# ═══════════════════════════════════════════════════════════════════════════════
# LokTantra — Production Infrastructure (GCP)
# Region: asia-south1 (Mumbai) — primary; asia-south2 (Delhi) — DR
# ═══════════════════════════════════════════════════════════════════════════════

locals {
  name_prefix  = "loktantra-${var.environment}"
  common_labels = {
    project     = "loktantra"
    environment = var.environment
    managed-by  = "terraform"
  }
}

# ── Enable required APIs ───────────────────────────────────────────────────────
resource "google_project_service" "apis" {
  for_each = toset([
    "container.googleapis.com",          # GKE
    "sqladmin.googleapis.com",           # Cloud SQL
    "redis.googleapis.com",              # Memorystore
    "compute.googleapis.com",            # VPC, LB
    "servicenetworking.googleapis.com",  # Private service access
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
    "cloudtrace.googleapis.com",
    "storage.googleapis.com",
    "dns.googleapis.com",
  ])
  service            = each.key
  disable_on_destroy = false
}

# ── VPC Network ───────────────────────────────────────────────────────────────
resource "google_compute_network" "main" {
  name                    = "${local.name_prefix}-vpc"
  auto_create_subnetworks = false
  depends_on              = [google_project_service.apis]
}

resource "google_compute_subnetwork" "gke" {
  name                     = "${local.name_prefix}-gke-subnet"
  region                   = var.region
  network                  = google_compute_network.main.self_link
  ip_cidr_range            = "10.0.0.0/20"
  private_ip_google_access = true

  # Secondary ranges for pods and services
  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.4.0.0/14"
  }
  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.8.0.0/20"
  }
}

# Private IP allocation for Cloud SQL / Memorystore
resource "google_compute_global_address" "private_ip_range" {
  name          = "${local.name_prefix}-private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.main.self_link
}

resource "google_service_networking_connection" "private_vpc" {
  network                 = google_compute_network.main.self_link
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]
}

# ── GKE Cluster ───────────────────────────────────────────────────────────────
resource "google_container_cluster" "main" {
  provider                 = google-beta
  name                     = "${local.name_prefix}-cluster"
  location                 = var.region   # Regional cluster — 3 control plane zones
  network                  = google_compute_network.main.self_link
  subnetwork               = google_compute_subnetwork.gke.self_link

  # Remove default node pool; we manage our own
  remove_default_node_pool = true
  initial_node_count       = 1

  # Enable Workload Identity
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Private cluster — nodes have no public IPs
  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }

  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }

  networking_mode = "VPC_NATIVE"

  # Autopilot-style security hardening on standard cluster
  binary_authorization {
    evaluation_mode = "PROJECT_SINGLETON_POLICY_ENFORCE"
  }

  network_policy {
    enabled  = true
    provider = "CALICO"
  }

  addons_config {
    http_load_balancing { disabled = false }
    horizontal_pod_autoscaling { disabled = false }
    network_policy_config { disabled = false }
    gce_persistent_disk_csi_driver_config { enabled = true }
    gcp_filestore_csi_driver_config { enabled = false }
  }

  maintenance_policy {
    recurring_window {
      # Maintenance window: Sundays 01:00–05:00 IST (19:30–23:30 UTC Saturday)
      start_time = "2024-01-06T19:30:00Z"
      end_time   = "2024-01-06T23:30:00Z"
      recurrence = "FREQ=WEEKLY;BYDAY=SA"
    }
  }

  resource_labels = local.common_labels
  depends_on      = [google_project_service.apis]
}

# ── GKE Node Pool ─────────────────────────────────────────────────────────────
resource "google_container_node_pool" "main" {
  name     = "${local.name_prefix}-nodes"
  cluster  = google_container_cluster.main.name
  location = var.region

  autoscaling {
    min_node_count       = var.gke_min_nodes_per_zone
    max_node_count       = var.gke_max_nodes_per_zone
    location_policy      = "BALANCED"
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  upgrade_settings {
    strategy        = "SURGE"
    max_surge       = 1
    max_unavailable = 0
  }

  node_config {
    machine_type    = var.gke_node_machine_type
    disk_size_gb    = 50
    disk_type       = "pd-balanced"
    image_type      = "COS_CONTAINERD"
    spot            = false

    service_account = google_service_account.gke_node.email
    oauth_scopes    = ["https://www.googleapis.com/auth/cloud-platform"]

    shielded_instance_config {
      enable_secure_boot          = true
      enable_integrity_monitoring = true
    }

    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    labels = local.common_labels
  }
}

# ── Service Accounts ──────────────────────────────────────────────────────────
resource "google_service_account" "gke_node" {
  account_id   = "${local.name_prefix}-gke-node"
  display_name = "GKE node SA for ${local.name_prefix}"
}

resource "google_service_account" "app_workload" {
  account_id   = "${local.name_prefix}-app"
  display_name = "Workload identity SA for app pods"
}

# Bind app workload SA to K8s SA via Workload Identity
resource "google_service_account_iam_binding" "workload_identity" {
  service_account_id = google_service_account.app_workload.name
  role               = "roles/iam.workloadIdentityUser"
  members = [
    "serviceAccount:${var.project_id}.svc.id.goog[loktantra/loktantra-app]",
    "serviceAccount:${var.project_id}.svc.id.goog[loktantra/loktantra-worker]",
  ]
}

# App SA permissions
resource "google_project_iam_member" "app_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.app_workload.email}"
}

resource "google_project_iam_member" "app_storage_writer" {
  project = var.project_id
  role    = "roles/storage.objectCreator"
  member  = "serviceAccount:${google_service_account.app_workload.email}"
}

# ── Cloud SQL (PostgreSQL) ────────────────────────────────────────────────────
resource "random_password" "db_password" {
  length  = 32
  special = true
}

resource "google_sql_database_instance" "main" {
  name             = "${local.name_prefix}-pg"
  database_version = var.db_version
  region           = var.region

  settings {
    tier              = var.db_tier
    availability_type = "REGIONAL"   # HA with failover replica
    disk_autoresize   = true
    disk_type         = "PD_SSD"

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.self_link
      require_ssl     = true
    }

    backup_configuration {
      enabled                        = true
      start_time                     = "20:00"   # 01:30 IST
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
      backup_retention_settings {
        retained_backups = var.backup_retention_days
        retention_unit   = "COUNT"
      }
    }

    maintenance_window {
      day          = 7   # Sunday
      hour         = 19  # 00:30 IST
      update_track = "stable"
    }

    database_flags {
      name  = "max_connections"
      value = "200"
    }
    database_flags {
      name  = "log_checkpoints"
      value = "on"
    }
    database_flags {
      name  = "log_connections"
      value = "on"
    }
    database_flags {
      name  = "log_min_duration_statement"
      value = "1000"   # Log queries slower than 1s
    }

    insights_config {
      query_insights_enabled  = true
      query_string_length     = 1024
      record_application_tags = true
      record_client_address   = true
    }
  }

  deletion_protection = true
  depends_on          = [google_service_networking_connection.private_vpc]
}

resource "google_sql_database" "main" {
  name     = "loktantra"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "app" {
  name     = "loktantra"
  instance = google_sql_database_instance.main.name
  password = random_password.db_password.result
}

# ── Cloud Memorystore (Redis) ─────────────────────────────────────────────────
resource "random_password" "redis_auth" {
  length  = 40
  special = false
}

resource "google_redis_instance" "main" {
  name           = "${local.name_prefix}-redis"
  tier           = var.redis_tier
  memory_size_gb = var.redis_memory_size_gb
  region         = var.region

  authorized_network       = google_compute_network.main.self_link
  connect_mode             = "PRIVATE_SERVICE_ACCESS"
  transit_encryption_mode  = "SERVER_AUTHENTICATION"
  auth_enabled             = true

  redis_version = "REDIS_7_0"
  display_name  = "LokTantra ${var.environment} Redis"

  redis_configs = {
    maxmemory-policy    = "allkeys-lru"
    activedefrag        = "yes"
    hz                  = "15"
    save                = "900 1 300 10 60 10000"
    appendonly          = "yes"
    appendfsync         = "everysec"
    no-appendfsync-on-rewrite = "yes"
  }

  maintenance_policy {
    weekly_maintenance_window {
      day = "SUNDAY"
      start_time {
        hours   = 19
        minutes = 30
      }
    }
  }

  depends_on = [google_service_networking_connection.private_vpc]
}

# ── Cloud Storage (Media + Backups) ──────────────────────────────────────────
resource "google_storage_bucket" "media" {
  name          = "${local.name_prefix}-media"
  location      = var.region
  storage_class = "STANDARD"
  force_destroy = false

  uniform_bucket_level_access = true

  cors {
    origin          = ["https://loktantra.in", "https://staging.loktantra.in"]
    method          = ["GET", "HEAD"]
    response_header = ["Content-Type", "Cache-Control"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    action { type = "SetStorageClass"; storage_class = "NEARLINE" }
    condition { age = 90 }
  }

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  labels = local.common_labels
}

resource "google_storage_bucket" "backups" {
  name          = "${local.name_prefix}-backups"
  location      = "ASIA"   # Multi-region for DR
  storage_class = "STANDARD"
  force_destroy = false

  uniform_bucket_level_access = true

  lifecycle_rule {
    action { type = "SetStorageClass"; storage_class = "COLDLINE" }
    condition { age = 30 }
  }

  lifecycle_rule {
    action { type = "Delete" }
    condition { age = 365 }
  }

  versioning { enabled = true }

  labels = local.common_labels
}

# ── Cloud CDN + Load Balancer ─────────────────────────────────────────────────
resource "google_compute_managed_ssl_certificate" "main" {
  provider = google-beta
  name     = "${local.name_prefix}-ssl"
  managed {
    domains = ["loktantra.in", "www.loktantra.in"]
  }
}

resource "google_compute_global_address" "lb_ip" {
  name = "${local.name_prefix}-lb-ip"
}

# CDN-enabled backend bucket for static Next.js assets
resource "google_compute_backend_bucket" "static_assets" {
  name        = "${local.name_prefix}-static"
  bucket_name = google_storage_bucket.media.name
  enable_cdn  = true

  cdn_policy {
    cache_mode        = "CACHE_ALL_STATIC"
    default_ttl       = 86400     # 24 hours for static assets
    max_ttl           = 604800    # 7 days max
    client_ttl        = 3600      # Browser cache 1 hour
    negative_caching  = true
    serve_while_stale = 86400     # Serve stale while revalidating
  }
}

# ── Secret Manager — store generated secrets ──────────────────────────────────
resource "google_secret_manager_secret" "db_password" {
  secret_id = "${local.name_prefix}-db-password"
  replication { auto {} }
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = random_password.db_password.result
}

resource "google_secret_manager_secret" "redis_auth" {
  secret_id = "${local.name_prefix}-redis-auth"
  replication { auto {} }
}

resource "google_secret_manager_secret_version" "redis_auth" {
  secret      = google_secret_manager_secret.redis_auth.id
  secret_data = random_password.redis_auth.result
}

# ── Cloud Monitoring — uptime checks + alerting ───────────────────────────────
resource "google_monitoring_uptime_check_config" "app" {
  display_name = "LokTantra App Health"
  timeout      = "10s"
  period       = "60s"

  http_check {
    path         = "/api/health"
    port         = 443
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = "loktantra.in"
    }
  }
}

resource "google_monitoring_alert_policy" "uptime_failure" {
  display_name = "LokTantra uptime failure"
  combiner     = "OR"

  conditions {
    display_name = "Uptime check failure"
    condition_threshold {
      filter          = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND resource.type=\"uptime_url\""
      comparison      = "COMPARISON_LT"
      threshold_value = 1
      duration        = "120s"
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_FRACTION_TRUE"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.name]
  alert_strategy {
    auto_close = "3600s"
  }
}

resource "google_monitoring_notification_channel" "email" {
  display_name = "LokTantra ops email"
  type         = "email"
  labels = {
    email_address = var.alert_email
  }
}

# ── Artifact Registry (Docker images) ────────────────────────────────────────
resource "google_artifact_registry_repository" "images" {
  location      = var.region
  repository_id = "loktantra"
  format        = "DOCKER"
  description   = "LokTantra application Docker images"

  cleanup_policies {
    id     = "keep-last-20"
    action = "KEEP"
    most_recent_versions {
      keep_count = 20
    }
  }

  labels = local.common_labels
}
