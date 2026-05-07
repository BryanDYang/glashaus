# Glashaus Architecture

## Executive Summary

Glashaus is a workflow-first real estate transaction workspace. The core product is not a chatbot. The core product is a durable transaction state machine with AI agents that help users understand, prepare, route, and review the work required to move a deal forward.

The MVP should prove that a direct buyer and direct seller can coordinate a transaction in one shared workspace while AI agents keep the process organized and surface the points where licensed professionals or third-party services are required.

## Product Positioning

Glashaus should avoid claiming that it replaces agents, lenders, escrow officers, title companies, inspectors, appraisers, or attorneys. That creates unnecessary regulatory and trust risk.

The stronger position is:

- Glashaus coordinates transaction workflows.
- Glashaus explains documents, deadlines, and options.
- Glashaus helps users prepare information for service providers.
- Glashaus logs decisions, files, milestones, and handoffs.
- Glashaus escalates legal, lending, escrow, title, tax, and valuation issues to qualified professionals.

This lets the MVP be useful now while leaving room for future licensed partner networks, marketplace revenue, referral economics, and transaction automation.

## Recommended Stack

- Frontend: Next.js App Router, React, TypeScript
- Backend: Next.js Route Handlers in the same repo
- Database: Supabase Postgres
- Auth: Supabase Auth
- Storage: Supabase Storage
- AI workflow: TypeScript workflow engine first; LangGraph JS when branching and retries become complex
- Hosting: Vercel
- Validation: Zod, added when request validation begins
- ORM/query layer: direct Supabase client first; introduce Drizzle or Prisma only when schema complexity grows
- Background jobs: Vercel Cron or queue-backed workers later

The simplest stack is TypeScript end to end. Python and YAML-heavy agent frameworks can be useful later, but they add another runtime, deployment path, type boundary, and debugging surface before the MVP needs them.

## System Context

```text
Buyer / Seller
  |
  v
Next.js Web App
  |
  +--> Route Handlers / Server Actions
  |      |
  |      +--> Supabase Auth
  |      +--> Supabase Postgres
  |      +--> Supabase Storage
  |      +--> AI Workflow Engine
  |
  +--> External Service Adapters
         |
         +--> Mortgage prequalification provider
         +--> Escrow provider
         +--> Title provider
         +--> Inspector marketplace
         +--> Valuation / property data provider
```

## Core Domain Model

### Users

Users are authenticated people using the system. A user may participate in multiple deals and may have different roles per deal.

### Deals

A deal is the top-level transaction workspace. It contains property information, buyer/seller participants, milestone timeline, documents, tasks, messages, agent outputs, and audit records.

### Participants

Participants represent a user or invited email on a deal. Roles should be deal-scoped:

- `buyer`
- `seller`
- `buyer_agent`
- `seller_agent`
- `transaction_coordinator`
- `loan_officer`
- `escrow_officer`
- `title_officer`
- `attorney`
- `admin`

The MVP can start with `buyer`, `seller`, and `admin`, then add professional roles when partner workflows are introduced.

### Milestones

Milestones are deterministic records, not AI guesses. Examples:

- intake
- property_review
- offer_preparation
- offer_submitted
- offer_accepted
- escrow_opened
- inspection_period
- financing
- appraisal
- title_review
- closing_preparation
- closed

Each milestone should have status, owner, due date, dependencies, and blockers.

### Tasks

Tasks are actionable units tied to a milestone. Tasks can be created by deterministic templates, users, or AI suggestions after human confirmation.

### Documents

Documents store metadata in Postgres and raw files in Supabase Storage. AI should not receive broad document access. Document processing must be explicit, authorized, and logged.

### Messages

Messages provide a shared deal thread. AI agents may create draft messages or summaries, but user-visible outbound communication should be tracked as a message event.

### Agent Runs

Agent runs are durable records of AI workflow execution:

- input state snapshot
- agent name
- model/provider
- output
- actions proposed
- actions applied
- escalation flags
- token/cost metadata later

### Audit Logs

Audit logs record sensitive events:

- document uploaded
- document viewed
- document processed by AI
- participant invited
- milestone changed
- AI output generated
- external service handoff started
- consent granted

## Five-Agent MVP Architecture

The impressive demo should be a coordinated workflow, not five independent chatbots.

### 1. Concierge Agent

Purpose: guide the user, gather missing context, explain what happens next, and route requests to the right specialist agent.

Inputs:

- deal state
- user role
- latest message or action
- incomplete intake fields

Outputs:

- next best action
- questions to ask
- route target
- concise user-facing explanation

### 2. Buyer Agent

Purpose: help the buyer prepare for the transaction.

Capabilities:

- buyer intake
- financing readiness checklist
- offer preparation checklist
- contingency explanation
- risk and blocker summary
- lender handoff package later

Boundaries:

- no loan origination
- no credit decisioning
- no legal advice
- no unauthorized offer submission

### 3. Seller Agent

Purpose: help the seller prepare the property and respond to buyer-side workflow needs.

Capabilities:

- seller intake
- disclosure readiness checklist
- listing facts checklist
- document request tracking
- buyer question organization
- counteroffer prep support later

Boundaries:

- no legal advice
- no mandatory disclosure determination without professional review
- no binding acceptance/rejection decisions

### 4. Transaction Coordinator Agent

Purpose: keep the transaction moving.

Capabilities:

- milestone state updates
- task generation
- deadline tracking
- blocker detection
- handoff preparation for escrow, title, mortgage, inspection, and appraisal
- daily or event-based deal digest

Boundaries:

- deterministic dates and statuses come from structured state
- AI can suggest tasks, but the system controls canonical milestone transitions

### 5. Compliance and Risk Agent

Purpose: reduce product risk by flagging missing consent, licensed-professional escalation points, suspicious requests, and sensitive document handling.

Capabilities:

- detect legal/lending/tax/escrow advice boundaries
- flag missing disclaimers or consent
- review AI outputs before user display for risky language
- classify document sensitivity
- recommend human escalation

Boundaries:

- this agent flags risk; it does not make final legal determinations

## Workflow Pattern

The workflow should run as a graph over structured state.

```text
User Action
  |
  v
Load Deal State
  |
  v
Concierge Agent
  |
  +--> Buyer Agent
  +--> Seller Agent
  +--> Transaction Coordinator Agent
  |
  v
Compliance and Risk Agent
  |
  v
Persist Agent Run + Suggested Actions
  |
  v
User Reviews / Confirms Action
  |
  v
Apply Deterministic State Change
```

The key design rule: AI produces suggestions, explanations, summaries, and drafts. The application applies state changes through typed, deterministic commands.

## Command Model

Agent outputs should be converted into commands before changing the system:

- `create_task`
- `update_task_status`
- `create_milestone`
- `update_milestone_status`
- `request_document`
- `summarize_document`
- `invite_participant`
- `prepare_service_handoff`
- `create_message_draft`
- `flag_escalation`

Every command should be validated, authorized, logged, and tied back to an agent run or user action.

## Data Model Additions

The existing migration has `profiles`, `deals`, `documents`, `milestones`, and `audit_logs`. The MVP will likely need these additional tables:

- `deal_participants`
- `properties`
- `tasks`
- `messages`
- `agent_runs`
- `agent_suggested_actions`
- `document_summaries`
- `service_handoffs`
- `consents`

These can be added incrementally. Do not overbuild all tables before the first workspace flow is working.

## Authorization Model

Authorization should be enforced server-side on every deal-scoped request.

Rules:

- A user can only access a deal if they are a participant.
- Role permissions are scoped to a deal.
- Document reads require explicit deal membership and document-level permission checks.
- AI document processing requires user consent or a workflow-specific authorization event.
- Admin access should be separate from participant access and logged.

## Document Trust Boundary

Raw documents are high-risk data. Treat them differently from normal chat text.

Rules:

- Store raw files in Supabase Storage.
- Store metadata in Postgres.
- Use private buckets.
- Prefer short-lived signed URLs or server-mediated reads.
- Never pass all deal documents into AI context by default.
- Log document processing events.
- Store extracted fields and summaries separately from raw files.
- Display when a document was processed by AI and which workflow used it.

## External Service Adapter Strategy

Start with mocked adapters. The MVP should show the shape of integrations without depending on real partner approvals.

Adapters:

- Mortgage adapter: prequalification checklist, affordability inputs, lender handoff package
- Escrow adapter: open escrow request, participant/contact package, status webhook placeholder
- Title adapter: title order placeholder, property and party package
- Inspection adapter: inspection request package and scheduling placeholder
- Valuation adapter: property facts and comparable sales placeholder

Each adapter should expose a consistent internal interface:

```ts
type ServiceHandoffRequest = {
  dealId: string;
  serviceType: "mortgage" | "escrow" | "title" | "inspection" | "valuation";
  requestedBy: string;
  payload: Record<string, unknown>;
};

type ServiceHandoffResult = {
  handoffId: string;
  status: "draft" | "submitted" | "accepted" | "failed";
  externalReference?: string;
  requiredNextSteps: string[];
};
```

## MVP User Flow

1. Buyer creates a deal workspace.
2. Buyer enters property target, budget, financing status, desired close date, and key constraints.
3. Buyer invites seller by email.
4. Seller accepts invite and enters property/disclosure readiness information.
5. Concierge Agent generates the transaction plan.
6. Buyer Agent produces buyer readiness tasks.
7. Seller Agent produces seller readiness tasks.
8. Transaction Coordinator Agent creates milestone timeline and blockers.
9. Compliance Agent flags escalation points and risky missing data.
10. Users review suggested actions and apply approved tasks/milestones.
11. Users upload documents.
12. AI creates document summaries only after explicit processing action.
13. Coordinator prepares mocked escrow, mortgage, title, inspection, and valuation handoff packages.

## Phased Build Plan

### Phase 0: Product Definition

Goal: make the MVP narrow enough to build.

Deliverables:

- README, architecture, and API spec
- clear product positioning
- MVP scope and non-goals
- initial schema sketch

Exit criteria:

- a developer can describe the app in one sentence
- a developer can implement the first user flow without guessing the domain model

### Phase 1: Deal Workspace Foundation

Goal: create the durable transaction workspace.

Deliverables:

- auth
- deal CRUD
- participant invites
- property intake
- milestones
- tasks
- audit logs

Exit criteria:

- a buyer can create a deal
- a seller can join
- both can see the same milestone/task state

### Phase 2: Document Workspace

Goal: make documents controlled and auditable.

Deliverables:

- private document upload
- document metadata
- signed download URLs
- document summary records
- document processing consent event
- audit trail

Exit criteria:

- users can upload and view authorized documents
- document AI processing is explicit and logged

### Phase 3: Five-Agent Orchestration

Goal: build the compelling AI coordination demo.

Deliverables:

- concierge route
- buyer agent route
- seller agent route
- transaction coordinator route
- compliance review route
- persisted agent runs
- suggested action review UI

Exit criteria:

- one user action can trigger a multi-agent workflow
- outputs are persisted
- suggested tasks and milestones can be accepted into canonical state

### Phase 4: Partner Handoff Simulation

Goal: show how Glashaus becomes a transaction network.

Deliverables:

- mocked mortgage handoff
- mocked escrow handoff
- mocked title handoff
- mocked inspection handoff
- mocked valuation handoff
- service handoff API and status records

Exit criteria:

- a deal can generate complete handoff packages
- the UI can show partner status without real integrations

### Phase 5: Pilot Readiness

Goal: make the MVP safe enough for controlled user testing.

Deliverables:

- role-based permissions
- stronger audit log coverage
- consent gates
- disclaimers
- data deletion path
- basic observability
- seed/demo data

Exit criteria:

- the product can be demoed repeatedly
- a small private pilot can use it with clear limitations

## Revenue Paths After MVP

The MVP should not depend on revenue integrations, but the architecture should leave room for:

- SaaS subscription for transaction workspaces
- per-transaction coordination fee
- referral fees where legally allowed
- partner marketplace for mortgage, escrow, title, inspection, insurance, and legal services
- premium document automation
- white-label workspace for small brokerages, investors, or transaction coordinators

Referral and marketplace revenue must be reviewed carefully because real estate, lending, title, and escrow compensation rules can be strict and state-specific.

## Technical Risks

- Regulatory overreach if the app appears to provide legal, lending, tax, brokerage, escrow, or title advice
- AI hallucination in high-stakes workflows
- Document privacy and consent mistakes
- State-specific transaction requirements
- Partner integration complexity
- Users treating suggestions as binding advice

Mitigations:

- keep canonical transaction state deterministic
- require human confirmation before applying actions
- run compliance review before displaying sensitive outputs
- log every sensitive event
- use narrow disclaimers and escalation flags
- start with one jurisdiction or generic demo mode

## Implementation Principle

Build the product as a transaction system with AI inside it, not as an AI chat app with transaction data attached.
