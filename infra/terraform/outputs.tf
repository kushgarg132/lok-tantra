output "gke_cluster_name" {
  description = "GKE cluster name"
  value       = google_container_cluster.main.name
}

output "gke_cluster_endpoint" {
  description = "GKE cluster endpoint"
  value       = google_container_cluster.main.endpoint
  sensitive   = true
}

output "cloud_sql_connection_name" {
  description = "Cloud SQL instance connection name (for Cloud SQL Auth Proxy)"
  value       = google_sql_database_instance.main.connection_name
}

output "cloud_sql_private_ip" {
  description = "Cloud SQL private IP address"
  value       = google_sql_database_instance.main.private_ip_address
}

output "redis_host" {
  description = "Cloud Memorystore Redis host"
  value       = google_redis_instance.main.host
}

output "redis_port" {
  description = "Cloud Memorystore Redis port"
  value       = google_redis_instance.main.port
}

output "media_bucket_name" {
  description = "GCS media bucket name"
  value       = google_storage_bucket.media.name
}

output "backup_bucket_name" {
  description = "GCS backups bucket name"
  value       = google_storage_bucket.backups.name
}

output "lb_ip_address" {
  description = "External IP for load balancer — point DNS A record here"
  value       = google_compute_global_address.lb_ip.address
}

output "artifact_registry_url" {
  description = "Docker registry URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.images.repository_id}"
}

output "app_workload_sa_email" {
  description = "Workload Identity service account for app pods"
  value       = google_service_account.app_workload.email
}

output "db_connection_string" {
  description = "Database connection string (for secrets)"
  value = "postgresql://loktantra:${random_password.db_password.result}@127.0.0.1:5432/loktantra?sslmode=disable"
  sensitive   = true
}
