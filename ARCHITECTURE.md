# ARCHITECTURE

## Overview

Glasshouse is designed as a **workflow-first system** with structured
deal state.

The architecture emphasizes:

-   deterministic financial calculations
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
-   properties
-   financing scenarios
-   offers
-   milestones
-   documents

### Workflow Engine

LangGraph coordinates specialized nodes:

-   Concierge Node
-   Property Intelligence Node
-   Financing Node
-   Offer Strategy Node
-   Compliance Node

Each node performs a specific task and writes outputs back to the deal
state.

------------------------------------------------------------------------

## Architecture Principles

1.  **Workflow First**\
    The system is designed around transaction workflows rather than chat
    interactions.

2.  **Structured Deal State**\
    All outputs are persisted in structured database records.

3.  **Deterministic Calculations**\
    Financial calculations use deterministic functions rather than LLM
    inference.

4.  **AI for Explanation**\
    LLMs assist with summarization, explanation, and workflow routing.

5.  **Human Escalation**\
    Critical outputs may require human review.
