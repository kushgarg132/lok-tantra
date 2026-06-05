# LokTantra — Indian Democracy Platform

## Project Overview
LokTantra is an interactive civic intelligence platform for understanding Indian democracy, governance, constitutional systems, political power structures, elections, judiciary, bureaucracy, and citizen participation.

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS with custom design system (saffron/navy/chakra theme)
- **State**: Zustand
- **Visualization**: D3.js, Cytoscape.js (planned), Recharts
- **Database**: PostgreSQL + Prisma ORM (schema in `prisma/schema.prisma`)
- **Graph DB**: Neo4j (ontology in `src/lib/graph-ontology.ts`)
- **Maps**: MapLibre GL
- **Search**: Fuse.js (client-side), ElasticSearch (planned)
- **AI**: Claude API (planned for chatbot/explainer)

## Project Structure
```
src/
  app/              # Next.js App Router pages
    api/            # REST API routes
    power-structure/  # Governance hierarchy explorer
    constitution/     # Interactive constitution browser
    representatives/  # Find-your-representative
    elections/        # Election analytics dashboard
    simulator/        # Governance process simulator
    citizen-action/   # RTI, PIL, grievance guides
    learn/            # Learning paths (beginner to UPSC)
    judiciary/        # Court system and landmark cases
    parties/          # Political party profiles
    bureaucracy/      # Administrative hierarchy
    timeline/         # Political history timeline
  components/       # React components by feature
    home/           # Landing page components
    layout/         # Header, Footer, MobileSidebar
    power-structure/  # Power hierarchy explorer
    constitution/     # Constitution explorer
    representatives/  # Representative discovery
    elections/        # Election dashboard
    simulator/        # Governance simulator
    providers/        # ThemeProvider
  data/             # Static data (seed data, mock data)
  lib/              # Utilities, constants, graph ontology
  store/            # Zustand stores
  types/            # TypeScript type definitions
prisma/             # Prisma schema and migrations
```

## Key Design Principles
- **Politically neutral** — no party advocacy, constitutional grounding only
- **Source-verifiable** — every fact cites a constitutional article or official source
- **Mobile-first** — responsive design, works on all devices
- **Dark mode** — full dark mode support via `class` strategy
- **Beginner-friendly** — reduce jargon, explain visually first

## Commands
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run db:generate` — Generate Prisma client
- `npm run db:push` — Push schema to database
- `npm run db:seed` — Seed database with initial data

## Data Sources
- Election Commission of India (eci.gov.in)
- PRS Legislative Research (prsindia.org)
- India Code (indiacode.nic.in)
- Parliament of India (sansad.in)
- Supreme Court of India (sci.gov.in)
- ADR (Association for Democratic Reforms)
- Census of India

## Architecture Notes
- All data stored in PostgreSQL via Prisma ORM
- Server components query DB directly, pass serialized data as props to client components
- API routes use Prisma queries for external consumers
- Data access layer in `src/lib/data/` provides typed query functions
- Comprehensive seed file at `prisma/seed.ts` populates all tables
- `src/data/` contains legacy static data (retained as reference, not used by pages)
- Graph ontology designed for Neo4j but functional without it
