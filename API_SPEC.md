# Glashaus API Spec

## Overview

This API spec defines the initial REST contracts for the Glashaus MVP. The backend can be implemented with Next.js Route Handlers under `app/api`.

All deal-scoped endpoints must verify that the authenticated user is a participant on the deal before returning or mutating data.

## Conventions

Base path:

```text
/api
```

Response format:

```json
{
  "data": {},
  "error": null
}
```

Error format:

```json
{
  "data": null,
  "error": {
    "code": "forbidden",
    "message": "You do not have access to this deal."
  }
}
```

Common status codes:

- `200`: success
- `201`: created
- `202`: accepted for async processing
- `400`: invalid request
- `401`: unauthenticated
- `403`: forbidden
- `404`: not found
- `409`: conflict
- `422`: validation failed
- `500`: server error

## Health

### GET `/api/health`

Returns service health.

Response:

```json
{
  "status": "ok",
  "service": "glashaus"
}
```

## Current User

### GET `/api/me`

Returns the authenticated profile and deal memberships.

Response:

```json
{
  "data": {
    "id": "user_123",
    "email": "buyer@example.com",
    "fullName": "Buyer User",
    "memberships": [
      {
        "dealId": "deal_123",
        "role": "buyer"
      }
    ]
  },
  "error": null
}
```

## Deals

### POST `/api/deals`

Creates a transaction workspace.

Request:

```json
{
  "side": "buyer",
  "title": "123 Main St purchase",
  "property": {
    "addressLine1": "123 Main St",
    "city": "Los Angeles",
    "region": "CA",
    "postalCode": "90001",
    "propertyType": "single_family"
  },
  "intake": {
    "targetPrice": 850000,
    "financingStatus": "preapproved",
    "desiredCloseDate": "2026-08-15"
  }
}
```

Response:

```json
{
  "data": {
    "id": "deal_123",
    "title": "123 Main St purchase",
    "status": "active",
    "side": "buyer",
    "createdAt": "2026-05-06T12:00:00.000Z"
  },
  "error": null
}
```

### GET `/api/deals`

Lists deals visible to the authenticated user.

Query params:

- `status`: optional deal status filter
- `role`: optional participant role filter

Response:

```json
{
  "data": [
    {
      "id": "deal_123",
      "title": "123 Main St purchase",
      "status": "active",
      "role": "buyer",
      "updatedAt": "2026-05-06T12:30:00.000Z"
    }
  ],
  "error": null
}
```

### GET `/api/deals/:dealId`

Returns the full deal workspace summary.

Response:

```json
{
  "data": {
    "id": "deal_123",
    "title": "123 Main St purchase",
    "status": "active",
    "property": {
      "addressLine1": "123 Main St",
      "city": "Los Angeles",
      "region": "CA",
      "postalCode": "90001"
    },
    "participants": [],
    "milestones": [],
    "tasks": [],
    "documents": [],
    "latestAgentRun": null
  },
  "error": null
}
```

### PATCH `/api/deals/:dealId`

Updates editable deal metadata.

Request:

```json
{
  "title": "123 Main St direct purchase",
  "status": "active"
}
```

Response:

```json
{
  "data": {
    "id": "deal_123",
    "title": "123 Main St direct purchase",
    "status": "active",
    "updatedAt": "2026-05-06T13:00:00.000Z"
  },
  "error": null
}
```

## Participants

### POST `/api/deals/:dealId/participants/invite`

Invites a participant to a deal.

Request:

```json
{
  "email": "seller@example.com",
  "role": "seller",
  "message": "I created a Glashaus workspace for the transaction."
}
```

Response:

```json
{
  "data": {
    "inviteId": "invite_123",
    "email": "seller@example.com",
    "role": "seller",
    "status": "pending"
  },
  "error": null
}
```

### GET `/api/deals/:dealId/participants`

Lists deal participants.

Response:

```json
{
  "data": [
    {
      "id": "participant_123",
      "userId": "user_123",
      "email": "buyer@example.com",
      "role": "buyer",
      "status": "active"
    }
  ],
  "error": null
}
```

## Milestones

### GET `/api/deals/:dealId/milestones`

Lists milestones for a deal.

Response:

```json
{
  "data": [
    {
      "id": "milestone_123",
      "key": "offer_preparation",
      "label": "Offer preparation",
      "status": "in_progress",
      "dueAt": "2026-06-01T17:00:00.000Z",
      "blockedReason": null
    }
  ],
  "error": null
}
```

### POST `/api/deals/:dealId/milestones`

Creates a milestone. In normal flows, milestones should come from templates or accepted agent suggestions.

Request:

```json
{
  "key": "inspection_period",
  "label": "Inspection period",
  "dueAt": "2026-06-14T17:00:00.000Z"
}
```

Response:

```json
{
  "data": {
    "id": "milestone_456",
    "key": "inspection_period",
    "label": "Inspection period",
    "status": "pending"
  },
  "error": null
}
```

### PATCH `/api/deals/:dealId/milestones/:milestoneId`

Updates milestone state.

Request:

```json
{
  "status": "complete",
  "blockedReason": null
}
```

Response:

```json
{
  "data": {
    "id": "milestone_123",
    "status": "complete",
    "updatedAt": "2026-05-06T14:00:00.000Z"
  },
  "error": null
}
```

## Tasks

### GET `/api/deals/:dealId/tasks`

Lists deal tasks.

Query params:

- `status`: optional
- `ownerRole`: optional
- `milestoneId`: optional

Response:

```json
{
  "data": [
    {
      "id": "task_123",
      "title": "Upload preapproval letter",
      "description": "Add the current lender preapproval letter for seller review.",
      "status": "todo",
      "ownerRole": "buyer",
      "dueAt": null,
      "source": "agent_suggestion"
    }
  ],
  "error": null
}
```

### POST `/api/deals/:dealId/tasks`

Creates a task.

Request:

```json
{
  "title": "Upload seller disclosures",
  "description": "Upload available property disclosures for buyer review.",
  "ownerRole": "seller",
  "milestoneId": "milestone_123",
  "dueAt": "2026-06-01T17:00:00.000Z"
}
```

Response:

```json
{
  "data": {
    "id": "task_456",
    "title": "Upload seller disclosures",
    "status": "todo"
  },
  "error": null
}
```

### PATCH `/api/deals/:dealId/tasks/:taskId`

Updates task status or details.

Request:

```json
{
  "status": "done"
}
```

Response:

```json
{
  "data": {
    "id": "task_123",
    "status": "done",
    "updatedAt": "2026-05-06T15:00:00.000Z"
  },
  "error": null
}
```

## Documents

### POST `/api/deals/:dealId/documents/upload-url`

Creates a signed upload URL or server-mediated upload target.

Request:

```json
{
  "fileName": "preapproval.pdf",
  "mimeType": "application/pdf",
  "purpose": "buyer_financing"
}
```

Response:

```json
{
  "data": {
    "documentId": "doc_123",
    "uploadUrl": "https://storage.example/upload",
    "storagePath": "deals/deal_123/doc_123/preapproval.pdf",
    "expiresAt": "2026-05-06T15:15:00.000Z"
  },
  "error": null
}
```

### GET `/api/deals/:dealId/documents`

Lists document metadata for a deal.

Response:

```json
{
  "data": [
    {
      "id": "doc_123",
      "name": "preapproval.pdf",
      "mimeType": "application/pdf",
      "purpose": "buyer_financing",
      "summaryStatus": "not_requested",
      "createdAt": "2026-05-06T15:10:00.000Z"
    }
  ],
  "error": null
}
```

### POST `/api/deals/:dealId/documents/:documentId/download-url`

Creates a short-lived download URL after authorization.

Response:

```json
{
  "data": {
    "downloadUrl": "https://storage.example/download",
    "expiresAt": "2026-05-06T15:20:00.000Z"
  },
  "error": null
}
```

### POST `/api/deals/:dealId/documents/:documentId/summarize`

Starts an AI document summary after explicit user action and consent.

Request:

```json
{
  "consent": true,
  "summaryType": "transaction_relevance"
}
```

Response:

```json
{
  "data": {
    "agentRunId": "run_123",
    "documentId": "doc_123",
    "status": "queued"
  },
  "error": null
}
```

## Messages

### GET `/api/deals/:dealId/messages`

Lists the shared deal thread.

Response:

```json
{
  "data": [
    {
      "id": "msg_123",
      "authorId": "user_123",
      "body": "Can you summarize what we need before opening escrow?",
      "createdAt": "2026-05-06T16:00:00.000Z"
    }
  ],
  "error": null
}
```

### POST `/api/deals/:dealId/messages`

Creates a user message and can optionally trigger the concierge workflow.

Request:

```json
{
  "body": "What should we do next?",
  "triggerAgent": true
}
```

Response:

```json
{
  "data": {
    "messageId": "msg_456",
    "agentRunId": "run_456"
  },
  "error": null
}
```

## Agent Runs

### POST `/api/deals/:dealId/agent-runs`

Starts a workflow run over the current deal state.

Request:

```json
{
  "entrypoint": "concierge",
  "intent": "generate_transaction_plan",
  "message": "Create the next-step plan for buyer and seller.",
  "options": {
    "includeDocuments": false
  }
}
```

Response:

```json
{
  "data": {
    "agentRunId": "run_123",
    "status": "queued"
  },
  "error": null
}
```

### GET `/api/deals/:dealId/agent-runs/:agentRunId`

Returns workflow run status and output.

Response:

```json
{
  "data": {
    "id": "run_123",
    "status": "completed",
    "entrypoint": "concierge",
    "outputs": [
      {
        "agent": "transaction_coordinator",
        "summary": "The deal is ready for offer preparation after buyer financing proof and seller disclosure upload."
      }
    ],
    "suggestedActions": [
      {
        "id": "action_123",
        "type": "create_task",
        "status": "pending_review",
        "payload": {
          "title": "Upload preapproval letter",
          "ownerRole": "buyer"
        }
      }
    ]
  },
  "error": null
}
```

### POST `/api/deals/:dealId/agent-runs/:agentRunId/actions/:actionId/apply`

Applies an approved suggested action to canonical deal state.

Request:

```json
{
  "approved": true
}
```

Response:

```json
{
  "data": {
    "actionId": "action_123",
    "status": "applied",
    "result": {
      "taskId": "task_789"
    }
  },
  "error": null
}
```

## Service Handoffs

### POST `/api/deals/:dealId/service-handoffs`

Creates a draft handoff package for an external service.

Request:

```json
{
  "serviceType": "escrow",
  "mode": "draft",
  "payload": {
    "requestedCloseDate": "2026-08-15",
    "purchasePrice": 850000
  }
}
```

Response:

```json
{
  "data": {
    "handoffId": "handoff_123",
    "serviceType": "escrow",
    "status": "draft",
    "requiredNextSteps": [
      "Confirm buyer and seller legal names",
      "Attach signed purchase agreement"
    ]
  },
  "error": null
}
```

### GET `/api/deals/:dealId/service-handoffs`

Lists service handoff records.

Response:

```json
{
  "data": [
    {
      "id": "handoff_123",
      "serviceType": "escrow",
      "status": "draft",
      "externalReference": null,
      "createdAt": "2026-05-06T17:00:00.000Z"
    }
  ],
  "error": null
}
```

## Audit Logs

### GET `/api/deals/:dealId/audit-logs`

Returns audit logs for authorized participants. The MVP may restrict this endpoint to admins or deal owners.

Response:

```json
{
  "data": [
    {
      "id": "audit_123",
      "actorId": "user_123",
      "eventType": "document.processed_by_ai",
      "payload": {
        "documentId": "doc_123",
        "agentRunId": "run_123"
      },
      "createdAt": "2026-05-06T17:30:00.000Z"
    }
  ],
  "error": null
}
```

## Initial Endpoint Build Order

1. `GET /api/health`
2. `POST /api/deals`
3. `GET /api/deals`
4. `GET /api/deals/:dealId`
5. `POST /api/deals/:dealId/participants/invite`
6. `GET /api/deals/:dealId/milestones`
7. `GET /api/deals/:dealId/tasks`
8. `POST /api/deals/:dealId/agent-runs`
9. `GET /api/deals/:dealId/agent-runs/:agentRunId`
10. `POST /api/deals/:dealId/agent-runs/:agentRunId/actions/:actionId/apply`
11. document upload and summary endpoints
12. service handoff endpoints

## Contract Rules

- Never let an agent directly mutate canonical deal state.
- Persist every agent run.
- Persist every suggested action before it is applied.
- Validate all action payloads before applying them.
- Log document access and AI processing.
- Keep raw document access out of generic chat context.
- Use stable IDs in API responses.
- Prefer explicit status fields over inferred UI state.
