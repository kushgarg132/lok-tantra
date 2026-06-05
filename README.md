# LokTantra (लोकतंत्र)

> The operating system for understanding Indian democracy.

LokTantra is an interactive, open-source civic intelligence platform that makes Indian governance accessible, understandable, and strictly neutral. It combines comprehensive constitutional and electoral datasets, an AI-driven knowledge assistant, and a governance knowledge graph to help citizens explore the world's largest democracy.

## Features

- **Power Hierarchy Explorer** — Interactive traversal of the Indian governance structure, from the President to the Panchayat level, backed by Neo4j graph traversal.
- **Constitutional Browser** — Article-by-article explorer with amendment history, landmark case law, and AI explanations.
- **Election Intelligence** — Historical election data, party seat trends, state-wise results, and turnout analytics.
- **Governance Knowledge Graph** — Neo4j-backed map of who appoints whom, checks and balances, and constitutional authority chains.
- **Neutral AI Assistant** — RAG-powered chatbot grounded in constitutional text and official sources; neutrality-checked before every response.
- **Find Your Representative** — Discover your MP/MLA by name, constituency, state, or party.
- **Learning Paths** — Structured civic literacy tracks from beginner to UPSC-level depth.
- **Live Governance Feed** — Real-time civic event stream (parliament sessions, election results, judicial updates).
- **Citizen Action Guides** — Step-by-step RTI, PIL, and grievance escalation workflows.
- **Admin Observability** — Scraper health dashboard, Redis log streaming, BullMQ queue monitor, and alert system.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, Server Components) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Graph | Neo4j (governance relationship traversal) |
| Search | Elasticsearch 9 + Fuse.js (client-side fallback) |
| Embeddings | Voyage AI (`voyage-3`, 1024-dim) |
| AI Generation | Anthropic Claude (RAG assistant) |
| Queue / ETL | BullMQ + Redis |
| Auth | NextAuth.js v4 (Google OAuth + bcrypt email) |
| Storage | Local filesystem / Cloudflare R2 / AWS S3 |
| Styling | Tailwind CSS + Framer Motion |
| Visualization | Cytoscape.js, D3.js, MapLibre GL |
| State | Zustand |
| Validation | Zod |
| Caching | Redis (rate limiting, observability logs, queue) |

## Getting Started

### Prerequisites

- Node.js ≥ 18.x
- Docker and Docker Compose (for local infrastructure)
- `ANTHROPIC_API_KEY` (required for AI assistant)
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`

### Installation

```bash
# 1. Clone
git clone https://github.com/loktantra/democracy.git
cd democracy

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, NEXTAUTH_SECRET, ANTHROPIC_API_KEY at minimum

# 4. Start infrastructure (PostgreSQL, Neo4j, Redis, Elasticsearch)
docker-compose up -d

# 5. Push Prisma schema and seed data
npm run db:push
npm run db:seed

# 6. Start the dev server
npm run dev
```

Visit `http://localhost:3000`.

### Running the ETL Worker

The ETL worker processes scraping jobs from BullMQ. Run it in a separate terminal:

```bash
npm run worker
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server (HMR) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run worker` | Start BullMQ ETL worker process |
| `npm run db:generate` | Generate Prisma client after schema changes |
| `npm run db:push` | Push Prisma schema to database (dev) |
| `npm run db:seed` | Seed database with initial civic data |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    api/                # REST API route handlers
    admin/              # Admin dashboard (moderation, observability)
    constitution/       # Constitutional browser
    elections/          # Election analytics
    power-structure/    # Governance hierarchy explorer
    representatives/    # Find-your-representative
    judiciary/          # Courts and landmark cases
    parties/            # Political party profiles
    bureaucracy/        # Administrative hierarchy
    simulator/          # Governance process simulator
    learn/              # Learning paths
    citizen-action/     # RTI, PIL, grievance guides
    timeline/           # Political history timeline
  components/           # React components by domain
  lib/
    auth/               # NextAuth options, permissions
    data/               # Typed Prisma query functions
    etl/                # BullMQ ingestors and normalization
    neo4j/              # Neo4j driver singleton
    observability/      # Scraper health, freshness, alerting
    rag/                # Knowledge retrieval and Claude generation
    search/             # Elasticsearch client and RAG pipeline
    security/           # Rate limiter, sanitizer
    services/           # Graph, discovery, and moderation services
  store/                # Zustand stores
  types/                # TypeScript type definitions
  worker/               # BullMQ worker entrypoint and scheduler
prisma/
  schema.prisma         # Database schema
  seed.ts               # Initial data seed
infra/
  k8s/                  # Kubernetes manifests (app, worker, ingress, monitoring)
  terraform/            # Infrastructure as code (GCP/AWS)
  scripts/              # Backup, restore, health-check, rollback scripts
```

## Data Sources

| Domain | Source |
|--------|--------|
| Election results | Election Commission of India (eci.gov.in) |
| MP/MLA profiles | ADR (myneta.info), PRS Legislative Research |
| Legislation / Bills | PRS India (prsindia.org) |
| Acts and Rules | India Code (indiacode.nic.in) |
| Parliamentary sessions | Sansad.in |
| Supreme Court cases | Supreme Court of India (sci.gov.in) |
| Constitutional text | India Code + Constitution of India |

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture and design patterns |
| [AUDIT.md](AUDIT.md) | Platform audit, optimization report, production readiness checklist |
| [docs/api-reference.md](docs/api-reference.md) | REST API endpoints, parameters, and response shapes |
| [docs/database-schema.md](docs/database-schema.md) | PostgreSQL schema, indexes, and cascade rules |
| [docs/graph-ontology.md](docs/graph-ontology.md) | Neo4j node labels, edge types, and Cypher patterns |
| [docs/etl-pipelines.md](docs/etl-pipelines.md) | ETL architecture, ingestors, and data quality gates |
| [docs/ai-rag-system.md](docs/ai-rag-system.md) | AI assistant, RAG pipeline, and neutrality guardrails |
| [docs/deployment.md](docs/deployment.md) | Docker Compose, Kubernetes, Terraform, CI/CD |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines and coding standards |

## Principles

1. **Source Verifiability** — Every factual claim cites an official constitutional article or government source.
2. **Absolute Neutrality** — The platform presents facts, processes, and structures without political opinion or bias.
3. **Accessibility First** — Complex legal language simplified visually and textually; mobile-first design.
4. **Dark Mode** — Full dark mode support via Tailwind `class` strategy.

## License

Copyright © 2026 LokTantra Contributors. All rights reserved.
