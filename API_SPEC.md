# API SPECIFICATION

## Base URL

/api

------------------------------------------------------------------------

## Deals

### Create Deal

POST /api/deals

Request Body

{ "role": "buyer", "target_location": "Anaheim", "timeline": "6 months" }

Response

{ "deal_id": "uuid", "status": "created" }

------------------------------------------------------------------------

### Get Deal

GET /api/deals/{dealId}

Response

{ "id": "uuid", "role": "buyer", "status": "active", "target_location": "Anaheim" }

------------------------------------------------------------------------

## Buyer Intake

POST /api/buyers/intake

Request

{ "deal_id": "uuid", "budget": 850000, "target_location": "Anaheim", "timeline": "6 months" }

Response

{ "status": "saved", "next_step": "Complete buyer readiness checklist" }

------------------------------------------------------------------------

## Seller Intake

POST /api/sellers/intake

Request

{ "deal_id": "uuid", "property_address": "123 Main St", "timeline": "3 months", "property_condition": "good" }

Response

{ "status": "saved", "next_step": "Review listing prep checklist" }

------------------------------------------------------------------------

## Guidance

POST /api/guidance/generate

Request

{ "deal_id": "uuid" }

Response

{ "summary": "...", "risk_flags": \[\], "recommended_next_steps": ["..."] }

------------------------------------------------------------------------

## Checklist

POST /api/checklists/generate

Request

{ "deal_id": "uuid" }

Response

{ "checklist_id": "uuid", "items": [{ "title": "Get pre-approval", "status": "open" }] }

------------------------------------------------------------------------

## Workflow Trigger

POST /api/workflow/run

Request

{ "deal_id": "uuid", "workflow": "buyer_guidance" }

Response

{ "status": "started" }
