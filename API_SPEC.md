# API SPECIFICATION

## Base URL

/api

------------------------------------------------------------------------

## Deals

### Create Deal

POST /api/deals

Request Body

{ "target_location": "Anaheim", "purchase_timeline": "6 months" }

Response

{ "deal_id": "uuid", "status": "created" }

------------------------------------------------------------------------

### Get Deal

GET /api/deals/{dealId}

Response

{ "id": "uuid", "status": "active", "target_location": "Anaheim" }

------------------------------------------------------------------------

## Property Analysis

POST /api/listings/analyze

Request

{ "listing_url": "https://listing.example.com" }

Response

{ "summary": "...", "risk_flags": \[\], "estimated_price_range": {
"low": 820000, "high": 860000 } }

------------------------------------------------------------------------

## Financing Scenarios

POST /api/financing/scenarios

Request

{ "property_price": 850000, "down_payment": 170000, "interest_rate":
0.065 }

Response

{ "loan_amount": 680000, "monthly_payment": 4300, "cash_to_close":
185000 }

------------------------------------------------------------------------

## Offer Recommendation

POST /api/offers/recommend

Request

{ "deal_id": "uuid", "property_id": "uuid" }

Response

{ "recommended_low": 820000, "recommended_high": 845000, "notes":
"Consider inspection contingency" }

------------------------------------------------------------------------

## Workflow Trigger

POST /api/workflow/run

Request

{ "deal_id": "uuid", "workflow": "property_analysis" }

Response

{ "status": "started" }
