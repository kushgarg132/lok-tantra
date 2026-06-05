# Deployment Strategy

LokTantra is designed to run locally via Docker Compose for rapid development, and on Kubernetes in production for high availability and scalability.

## 1. Local Development

We use Docker Compose to spin up the required infrastructure backing the Next.js application.

```bash
docker-compose up -d
```

### Local Services
- **PostgreSQL (Port 5432)**: Primary datastore.
- **Neo4j (Port 7474 / 7687)**: Graph database.
- **Redis (Port 6379)**: Caching and Event Bus (Redis Streams).
- **ElasticSearch (Port 9200)**: Full-text search engine.

The Next.js app itself runs locally via `npm run dev` to benefit from hot-module replacement (HMR).

## 2. Production Topology

In production, LokTantra relies on a mix of managed services and Kubernetes workloads.

### 2.1 Edge & CDN Layer
- **Vercel Edge / Cloudflare**: Handles CDN caching for static assets, image optimization for external domains (`*.gov.in`), and initial edge-based rate limiting.

### 2.2 Kubernetes Workloads (EKS/GKE)
- **Next.js App Pods**: The core web server, autoscaled (HPA) based on CPU/Memory utilization.
- **ETL Worker Pods**: Headless Node.js processes pulling jobs from BullMQ.
- **Sync Worker Pods**: Background processes listening to Redis Streams to sync PG data to Neo4j and ElasticSearch.
- **CronJobs**: Kubernetes CronJobs that periodically trigger the ETL Extractors.

### 2.3 Managed Data Services
To reduce operational overhead in production, we recommend managed services for the stateful layer:
- **Database**: AWS RDS PostgreSQL or Supabase.
- **Graph**: Neo4j AuraDB (managed cloud).
- **Search**: Elastic Cloud.
- **Cache/Events**: Upstash Redis or AWS ElastiCache.

## 3. CI/CD Pipeline

We use GitHub Actions for continuous integration and deployment.

1. **PR Checks**: 
   - Runs `tsc --noEmit`
   - Runs ESLint
   - Builds Next.js app (`npm run build`)
2. **Main Branch Merge**:
   - Builds Docker image.
   - Pushes to Container Registry.
   - Updates Kubernetes manifests (Kustomize).
   - Triggers ArgoCD or direct `kubectl apply` for deployment.

## 4. Environment Variables

Crucial environment variables required in production:
- `DATABASE_URL`: PostgreSQL connection string.
- `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`: Graph DB credentials.
- `REDIS_URL`: Cache connection.
- `ELASTICSEARCH_NODE`: Search cluster URL.
- `ANTHROPIC_API_KEY`: For AI/RAG features.
