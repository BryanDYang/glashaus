# ARCHITECTURE

## Overview

Glasshouse is designed as a **workflow-first system** with structured
deal state for both buyer-side and seller-side assistance.

The architecture emphasizes:

-   structured data persistence
-   AI-assisted workflow orchestration
-   human review capability

------------------------------------------------------------------------

## High Level Architecture

User \| v Next.js Application \| +--\> Supabase Auth +--\> Supabase
Postgres +--\> Supabase Storage \| v LangGraph Workflow Engine

------------------------------------------------------------------------

## Core Components

### Frontend

Next.js handles:

-   UI rendering
-   deal workspace
-   user authentication
-   form inputs

### Backend

Next.js route handlers manage:

-   API endpoints
-   workflow triggers
-   database interactions

### Database

Supabase Postgres stores:

-   users
-   deals
-   profiles
-   checklists
-   guidance outputs
-   milestones
-   documents

### Workflow Engine

LangGraph coordinates specialized nodes:

-   Concierge Node
-   Buyer Guidance Node
-   Seller Guidance Node
-   Workflow Coordination Node
-   Compliance Node

Each node performs a specific task and writes outputs back to the deal
state.

### Document Trust Boundary

Glasshouse uses **Supabase Storage as the default document system of
record** for buyer and seller transaction files.

The document boundary is:

-   raw documents are stored in Supabase Storage by deal
-   document metadata is stored in Supabase Postgres
-   access to raw files must be restricted to authorized users for the
    relevant deal
-   AI workflows do not receive blanket access to all stored documents
-   raw document content may only be sent to AI services when triggered
    by an explicit product action or a clearly defined workflow step
-   summaries, extracted fields, and workflow outputs derived from
    documents are treated as sensitive deal data
-   document access, document processing, and AI usage should be logged
    in audit records

The system should default to **least privilege**:

-   storage access should use short-lived signed URLs or equivalent
    server-mediated retrieval
-   server-side authorization should be enforced before every document
    read, write, parse, or share action
-   internal administrative access to raw files should be tightly
    limited and auditable

Glasshouse may later support **bring your own storage (BYOS)** through
OAuth-connected cloud drives or user-managed storage providers. BYOS is
an optional storage mode for customers who want stronger control over
where raw documents live, but it does not replace the need for strict
authorization, audit logging, and AI access controls.

------------------------------------------------------------------------

## Architecture Principles

1.  **Workflow First**\
    The system is designed around transaction workflows rather than chat
    interactions.

2.  **Structured Deal State**\
    All outputs are persisted in structured database records.

3.  **Deterministic Workflows**\
    Timeline state, checklist state, and any calculations should use
    deterministic application logic rather than LLM inference.

4.  **AI for Explanation**\
    LLMs assist with summarization, explanation, and workflow routing.

5.  **Human Escalation**\
    Critical outputs may require human review.

6.  **Explicit Document Consent Boundary**\
    Raw files should be isolated from general AI context and only used
    in controlled, auditable processing paths.
