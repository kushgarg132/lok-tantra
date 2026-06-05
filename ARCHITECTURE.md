# LokTantra Architecture Blueprint

> **Status**: Approved (Phase 2)
> **Stack**: Next.js 14, TypeScript, Prisma, PostgreSQL, Neo4j, ElasticSearch, Redis

LokTantra uses a highly modular, layered architecture designed to scale both in terms of data volume and feature complexity. The platform relies on a "graph-first" understanding of Indian governance, augmented by AI and full-text search.

## System Overview

The system is divided into 9 primary architecture domains:

1. **Frontend**: Next.js App Router (Server Components default) + React Client Islands.
2. **Backend**: Layered service architecture (API Routes → Services → Repositories).
3. **Database Layer**: PostgreSQL (Source of Truth) via Prisma.
4. **Graph Layer**: Neo4j for complex governance relationship traversal (Who appoints whom? What courts overruled what articles?).
5. **Search Layer**: ElasticSearch for full-text entity search, plus pgvector for semantic RAG queries.
6. **AI Layer**: Anthropic Claude + RAG pipeline for politically neutral "explainers" and summarization.
7. **Event Layer**: Redis Streams for publishing entity mutations to derived projections (Neo4j, ES, Vector).
8. **ETL Pipelines**: Automated extraction from official sources (ECI, PRS, SCI) into the primary database.
9. **Observability**: Pino logs, OpenTelemetry traces, and Prometheus metrics.

## Layered Service Pattern

All business logic must be routed through the Service Layer. Neither API Routes nor Next.js Page components should invoke Prisma or Neo4j directly.

```
[ Next.js Page / API Route ]
            ↓
    [ Service Layer ] (e.g., ConstitutionService)
      ↓           ↓
[ CacheRepo ]  [ PrismaRepo / Neo4jRepo ]
```

## Dual-Database Strategy

To handle both structured entities and complex relationships without performance bottlenecks:
- **PostgreSQL** is the absolute source of truth. All data ingestion, CRUD operations, and versioning happen here.
- **Neo4j** is a read-optimized, derived projection. It is populated asynchronously via the Redis Event Bus when PostgreSQL entities change.

## Module Boundaries

The application is strictly modularized by domain to prevent spaghetti dependencies:
- `Constitution`
- `Institutions`
- `Elections`
- `Judiciary`
- `Legislation`
- `Bureaucracy`

Cross-domain logic is handled via Graph Traversals (Neo4j) or by publishing/subscribing to events, rather than tightly coupling service classes.

## Further Documentation

Detailed architecture specifications for specific sub-systems are located in the `docs/` directory:
- [API Reference](docs/api-reference.md)
- [Database & Graph Schema](docs/database-schema.md)
- [ETL Pipelines](docs/etl-pipelines.md)
- [AI / RAG System](docs/ai-rag-system.md)
- [Deployment Strategy](docs/deployment.md)
