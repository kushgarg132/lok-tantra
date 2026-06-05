# LokTantra (लोकतंत्र)

> The operating system for understanding Indian democracy.

LokTantra is an interactive, open-source civic intelligence platform designed to make Indian governance accessible, understandable, and strictly neutral. By combining comprehensive datasets, an expansive governance knowledge graph, and AI-driven insights, LokTantra empowers citizens to explore the complex machinery of the world's largest democracy.

## Core Features

- **🏛️ Power Hierarchy Explorer**: Interactive traversal of the Indian governance structure, from the President down to the Panchayat level.
- **📜 Constitutional Semantic Search**: Deep semantic retrieval of articles, amendments, and landmark Supreme Court cases.
- **🗳️ Election Intelligence**: Real-time and historical election data analysis across state and central levels.
- **🔗 Governance Knowledge Graph**: Neo4j-backed mapping of who appoints whom, who reports to whom, and constitutional checks & balances.
- **🤖 Neutral AI Explainer**: RAG-powered chatbot that explains complex bills and processes, strictly grounded in verifiable, official sources.

## Tech Stack Overview

- **Framework**: Next.js 14 (App Router, Server Components)
- **Language**: TypeScript (Strict Mode)
- **Database**: PostgreSQL (Primary) & Neo4j (Graph)
- **ORM**: Prisma
- **Search**: ElasticSearch & pgvector
- **AI**: Anthropic Claude & OpenAI Embeddings
- **Styling**: Tailwind CSS & Framer Motion
- **Caching**: Redis

## Getting Started

### Prerequisites

- Node.js >= 18.x
- Docker & Docker Compose (for local database services)
- API Keys for Anthropic Claude (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/loktantra/democracy.git
   cd democracy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and provide your local credentials
   ```

4. **Start local infrastructure**
   ```bash
   docker-compose up -d
   ```

5. **Initialize database & seed data**
   ```bash
   npm run db:push
   npm run db:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to access the platform.

## Documentation

Comprehensive documentation can be found in the `docs/` directory:

- [System Architecture](ARCHITECTURE.md)
- [API Reference](docs/api-reference.md)
- [Database & Graph Schema](docs/database-schema.md)
- [ETL Pipelines & Ingestion](docs/etl-pipelines.md)
- [AI & RAG System](docs/ai-rag-system.md)
- [Deployment Guide](docs/deployment.md)

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## Principles

1. **Source Verifiability**: Every factual claim must be backed by official government data (ECI, PRS, India Code).
2. **Absolute Neutrality**: The platform presents facts, processes, and structures without political bias.
3. **Accessibility First**: Complex legal language should be simplified without losing accuracy.

## License

Copyright © 2026 LokTantra Contributors. All rights reserved.
