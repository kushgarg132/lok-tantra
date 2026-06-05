variable "project_id" {
  description = "GCP project ID"
  type        = string
  default     = "loktantra-prod"
}

variable "region" {
  description = "GCP region (Mumbai for lowest latency to Indian users)"
  type        = string
  default     = "asia-south1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "environment must be staging or production"
  }
}

variable "gke_node_machine_type" {
  description = "GKE node machine type"
  type        = string
  default     = "e2-standard-4"   # 4 vCPU, 16GB RAM
}

variable "gke_min_nodes_per_zone" {
  description = "Minimum nodes per zone in node pool"
  type        = number
  default     = 1
}

variable "gke_max_nodes_per_zone" {
  description = "Maximum nodes per zone in node pool"
  type        = number
  default     = 5
}

variable "db_tier" {
  description = "Cloud SQL instance tier"
  type        = string
  default     = "db-custom-2-7680"   # 2 vCPU, 7.5 GB RAM
}

variable "db_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "POSTGRES_16"
}

variable "redis_tier" {
  description = "Cloud Memorystore tier"
  type        = string
  default     = "STANDARD_HA"   # High availability with failover replica
}

variable "redis_memory_size_gb" {
  description = "Redis memory size in GB"
  type        = number
  default     = 2
}

variable "alert_email" {
  description = "Email for infrastructure alerts"
  type        = string
  default     = "ops@loktantra.in"
}

variable "backup_retention_days" {
  description = "Number of days to retain automated DB backups"
  type        = number
  default     = 30
}
