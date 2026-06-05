# Deployment Guide

LokTantra runs locally via Docker Compose for development, and on Kubernetes in production for high availability. Infrastructure is defined as code using Terraform (`infra/terraform/`) and Kubernetes manifests (`infra/k8s/`).

---

## 1. Local Development

### Prerequisites
- Docker and Docker Compose
- Node.js ≥ 18
- `openssl` (for generating `NEXTAUTH_SECRET`)

### Quick Start

```bash
# 1. Clone and install
git clone https://github.com/loktantra/democracy.git
cd democracy
npm install

# 2. Configure environment
cp .env.example .env
# Minimum required: DATABASE_URL, NEXTAUTH_SECRET, ANTHROPIC_API_KEY
# Generate NEXTAUTH_SECRET: openssl rand -base64 32

# 3. Start infrastructure services
docker-compose up -d

# 4. Initialize and seed database
npm run db:push
npm run db:seed

# 5. Start Next.js dev server
npm run dev
# → http://localhost:3000

# 6. (Optional) Start ETL worker
npm run worker
```

### Local Services (Docker Compose)

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | 5432 | Primary database |
| Neo4j | 7474 (HTTP), 7687 (Bolt) | Graph database |
| Redis | 6379 | Rate limiting, BullMQ, log streaming |
| Elasticsearch | 9200 | Full-text and semantic search |
| Bull Board | 3001 | BullMQ admin UI (via `/api/admin/queues`) |

---

## 2. Environment Variables

All environment variables are documented in `.env.example`. The minimum set required to run the platform:

### Required
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string: `postgresql://user:pass@host:5432/loktantra` |
| `NEXTAUTH_SECRET` | JWT signing secret. Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Canonical app URL (e.g., `https://loktantra.in` in production) |
| `ANTHROPIC_API_KEY` | Claude API key for AI assistant features |

### Optional (AI / Search)
| Variable | Description |
|----------|-------------|
| `VOYAGE_API_KEY` | Voyage AI embeddings key for semantic search (fall back to BM25-only if absent) |
| `ELASTICSEARCH_URL` | Elasticsearch node URL (fall back to Fuse.js if absent) |
| `ELASTICSEARCH_API_KEY` | For Elastic Cloud or protected clusters |
| `SEARCH_INDEX_SECRET` | Protects the `POST /api/search/index` endpoint in production |

### Optional (Auth)
| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (omit to disable Google sign-in) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

### Optional (Graph)
| Variable | Description |
|----------|-------------|
| `NEO4J_URI` | Neo4j Bolt URI (default: `bolt://localhost:7687`) |
| `NEO4J_USER` | Neo4j username |
| `NEO4J_PASSWORD` | Neo4j password — **change the default in production** |

### Optional (Infrastructure)
| Variable | Description |
|----------|-------------|
| `REDIS_URL` | Redis connection URL (default: `redis://localhost:6379`) |
| `LOG_LEVEL` | Log verbosity: `debug`, `info`, `warn`, `error` (default: `info`) |
| `NEXT_PUBLIC_MAPLIBRE_STYLE` | MapLibre GL style URL for constituency maps |

### Optional (Storage)
| Variable | Description |
|----------|-------------|
| `STORAGE_PROVIDER` | `local` (default), `r2` (Cloudflare R2), or `s3` (AWS S3) |
| `STORAGE_BUCKET` | Bucket name (default: `loktantra-media`) |
| `STORAGE_ENDPOINT` | R2 or S3 endpoint URL |
| `STORAGE_ACCESS_KEY` | Storage access key ID |
| `STORAGE_SECRET_KEY` | Storage secret key |
| `STORAGE_CDN_DOMAIN` | CDN domain for public media URLs |

---

## 3. Production Topology

### 3.1 Kubernetes Workloads (`infra/k8s/`)

The production deployment runs on Kubernetes (EKS or GKE). All manifests are managed with Kustomize.

| Workload | Manifest | Purpose |
|----------|----------|---------|
| Next.js App | `infra/k8s/app/deployment.yaml` | Web server, autoscaled by HPA |
| ETL Worker | `infra/k8s/worker/deployment.yaml` | BullMQ job consumer |
| KEDA ScaledObject | `infra/k8s/worker/keda-scaledobject.yaml` | Scale worker pods based on queue depth |
| HPA | `infra/k8s/app/hpa.yaml` | Autoscale app pods on CPU/memory |
| PDB | `infra/k8s/app/pdb.yaml` | Prevent all pods being disrupted at once |
| Ingress | `infra/k8s/ingress/ingress.yaml` | NGINX ingress with TLS termination |
| TLS Certificate | `infra/k8s/ingress/certificate.yaml` | cert-manager certificate (Let's Encrypt) |
| ConfigMap | `infra/k8s/01-configmap.yaml` | Non-secret environment config |
| Secrets template | `infra/k8s/02-secrets-template.yaml` | Secret structure (values from vault/CI) |
| Network Policy | `infra/k8s/03-network-policy.yaml` | Restricts inter-pod traffic |
| ServiceMonitor | `infra/k8s/monitoring/servicemonitor.yaml` | Prometheus scrape config |
| Backup CronJob | `infra/k8s/backup/cronjob.yaml` | Scheduled PostgreSQL backups |
| Namespace | `infra/k8s/00-namespace.yaml` | `loktantra` namespace |

### Deployment command
```bash
kubectl apply -k infra/k8s/
```

### 3.2 Managed Data Services (Recommended for Production)

| Service | Recommended Provider |
|---------|---------------------|
| PostgreSQL | AWS RDS (ap-south-1) or Supabase |
| Neo4j | Neo4j AuraDB Professional |
| Elasticsearch | Elastic Cloud (GCP ap-south-1) |
| Redis | Upstash Redis (serverless) or AWS ElastiCache |
| Media Storage | Cloudflare R2 (zero egress) or AWS S3 (ap-south-1) |
| Container Registry | AWS ECR or Google Artifact Registry |

### 3.3 Infrastructure as Code (`infra/terraform/`)

Terraform modules provision:
- VPC, subnets, and security groups
- EKS cluster (or GKE equivalent)
- RDS PostgreSQL instance
- ElastiCache Redis cluster
- S3 bucket for media storage
- IAM roles and service accounts

```bash
cd infra/terraform
terraform init
terraform plan -var-file=production.tfvars
terraform apply -var-file=production.tfvars
```

---

## 4. CI/CD Pipeline (`.github/workflows/`)

### CI — `ci.yml`
Runs on every pull request to `main`:

1. Install dependencies (`npm ci`)
2. TypeScript type check (`npx tsc --noEmit`)
3. ESLint (`npm run lint`)
4. Next.js build (`npm run build`)
5. Prisma schema validation

All checks must pass before merge.

### CD — `cd.yml`
Runs on merge to `main`:

1. Build Docker image for Next.js app and ETL worker
2. Push images to container registry with commit SHA tag
3. Update Kubernetes image tags in `infra/k8s/app/deployment.yaml` and `infra/k8s/worker/deployment.yaml`
4. Apply Kustomize manifests (`kubectl apply -k infra/k8s/`)
5. Wait for rollout to complete (`kubectl rollout status`)
6. Run health check (`infra/scripts/health-check.sh`)

---

## 5. Operational Scripts (`infra/scripts/`)

| Script | Purpose |
|--------|---------|
| `backup.sh` | Dump PostgreSQL to S3/R2 with timestamp |
| `restore.sh` | Restore PostgreSQL from a backup dump |
| `rollback.sh` | Roll back Kubernetes deployment to the previous image |
| `health-check.sh` | Verify all services (DB, Redis, Neo4j, Elasticsearch) are reachable |

---

## 6. Kubernetes Health Probes

The `/api/health` route is used by Kubernetes liveness and readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

The health endpoint checks: PostgreSQL connectivity, Redis ping, optional Neo4j and Elasticsearch reachability. Returns `200 OK` with `{ status: "ok" }` when healthy.

---

## 7. Security in Production

| Concern | Configuration |
|---------|--------------|
| TLS | cert-manager + Let's Encrypt via Ingress |
| Secrets management | Kubernetes Secrets (values from CI/CD secrets or external vault) |
| CSP headers | `unsafe-eval` excluded in `NODE_ENV=production` |
| Rate limiting | Middleware (in-memory; **switch to Redis for multi-pod**) |
| Network isolation | Kubernetes NetworkPolicy restricts pod-to-pod traffic |
| Neo4j TLS | Use `neo4j+s://` scheme in production (`NEO4J_URI`) |
| Database | RDS with private subnet; no public endpoint |

---

## 8. Connection Pooling (Production Critical)

PostgreSQL's default `max_connections` (typically 100) will be exhausted under concurrent load with multiple app pods. **Deploy PgBouncer in transaction mode** before going to production with horizontal scaling:

```
DATABASE_URL=postgresql://user:pass@pgbouncer:5432/loktantra?connection_limit=10&pool_timeout=20
```

Or use Supabase (which includes PgBouncer) or the Prisma Data Proxy as alternatives.

---

## 9. Monitoring & Observability

| Signal | Tooling |
|--------|---------|
| Application logs | Redis log stream → Admin dashboard at `/admin/observability` |
| Metrics | Prometheus scraping via `ServiceMonitor` (queue depths, scraper run counts) |
| Alerting | Built-in alert engine (`src/lib/observability/alert-engine.ts`) + external PagerDuty/Slack |
| Tracing | OpenTelemetry (planned — see AUDIT.md) |
| Uptime | `/api/health` polled by load balancer; Kubernetes liveness probe |
