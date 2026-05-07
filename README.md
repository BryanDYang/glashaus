# Glashaus

Glashaus is an AI-assisted real estate transaction workspace for coordinating a direct buyer-to-seller deal from initial intent through closing preparation.

Real estate transactions are still too opaque, expensive, and difficult for consumers to understand. Buyers and sellers often depend on fragmented communication, unclear responsibilities, percentage-based compensation, and service providers whose incentives are not always obvious.

Glashaus is built around a different premise: the transaction should be transparent, structured, auditable, and easier to coordinate. Each party should understand what is happening, who is responsible, what is blocked, and how each professional is being compensated.

The MVP focuses on workflow orchestration, document control, task routing, and AI-assisted coordination. It does not try to replace licensed real estate agents, loan officers, escrow officers, attorneys, inspectors, appraisers, or other professionals. Instead, Glashaus gives buyers and sellers a shared operating system for the transaction and uses AI to explain, summarize, route, and prepare work for the right person or service.

Long term, Glashaus could hire or partner with licensed real estate agents and brokers as transaction success managers. These professionals would oversee progress, keep parties accountable, and handle regulated work where a license is required, but under a more transparent and lower-cost compensation model: a flat transaction fee plus clearly defined incentives instead of a traditional percentage-based commission.

## MVP

The first version should prove that a buyer and seller can coordinate the path from offer preparation to closing readiness in one shared workspace.

Core capabilities:

- Buyer and seller onboarding
- Shared deal workspace
- Offer-to-close milestones and tasks
- Document upload, metadata, summaries, and audit logs
- Five-agent workflow: concierge, buyer, seller, transaction coordinator, and compliance reviewer
- Partner-ready API surface for future mortgage, escrow, title, inspection, and valuation integrations

MVP boundaries:

- No legal, tax, lending, escrow, title, or brokerage advice
- No loan origination or escrow fund handling
- No binding decisions made on behalf of users
- No raw document processing by AI unless explicitly requested and logged

## Tech Stack

- Frontend: Next.js, React, TypeScript
- Backend: Next.js Route Handlers, TypeScript
- Auth: Supabase Auth
- Database: Supabase Postgres
- Storage: Supabase Storage
- AI orchestration: TypeScript workflow engine first, LangGraph JS when graph complexity requires it
- Hosting: Vercel

The repo is TypeScript-first to keep frontend, backend, API contracts, and workflow types in one language while the MVP is still changing.

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md): technical design, agent boundaries, data model, workflow model, security model, and build phases
- [API_SPEC.md](./API_SPEC.md): initial API contracts for deals, participants, milestones, tasks, documents, messages, agent runs, service handoffs, and audit logs

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run checks:

```bash
npm run typecheck
npm run lint
```

Open the app:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/api/health
```

## MVP Milestones

1. Foundation: app shell, auth, deal creation, participant invites, schema, and health check
2. Workspace: dashboard, milestones, tasks, messages, documents, and audit logs
3. Agent workflow: five-agent orchestration with persisted runs and reviewable suggested actions
4. Service handoffs: mocked mortgage, escrow, title, inspection, and valuation adapters
5. Pilot readiness: permissions, consent gates, disclaimers, document access logs, and demo data
