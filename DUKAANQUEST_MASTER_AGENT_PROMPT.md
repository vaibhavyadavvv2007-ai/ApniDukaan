# DUKAANQUEST — MASTER CODING AGENT HANDOFF & EXECUTION PROMPT
## HackSprint 2026 | PS-21 | 48-Hour Build Window

You are now the **lead software engineer, integration engineer, product engineer, QA engineer, and technical architect** for the DukaanQuest HackSprint project.

Your job is NOT to brainstorm a different product.

Your job is to take the existing DukaanQuest repository, understand what is already implemented, fix inconsistencies, activate the right real APIs where realistically possible, preserve reliable fallbacks, and turn the project into a technically credible, visually impressive, demo-safe HackSprint submission.

Read this entire prompt before modifying anything.

---

# 0. NON-NEGOTIABLE PROJECT CONTEXT

## Project

**Product:** DukaanQuest  
**Problem:** PS-21 — Democratizing Digital Commerce for Bharat Retailers  
**Track:** FinTech & Commerce  
**Hackathon:** Hack Sprint — October 17–18, 2026  
**Current working window:** We have approximately **48 hours available for the current engineering sprint**, not only the eventual 24-hour event itself.

The existing handoff currently lists:
- Target submission deadline: October 4, 2026, 23:59 IST
- Screening evaluation: October 5, 2026, 23:50 IST

Verify event dates/deadlines against the official event website before final submission rather than blindly trusting stale local documents.

## Target user

A real offline clothing-shop owner (friend's father) who:
- already accepts digital payments/UPI
- uses WhatsApp
- wants to scale beyond the physical shop
- wants to sell on marketplaces such as Amazon, Flipkart, Meesho and fashion marketplaces
- does not know the technical process of seller onboarding/listing
- does not have time to manually learn and maintain marketplace operations
- wants to retain previous offline customers
- wants to reach more customers locally through digital marketing
- has ordinary phone photography rather than professional e-commerce studio photography

The key pain is:

> The merchant already owns products and has customers, but lacks the time, digital expertise, and operational bandwidth to convert the physical business into an omnichannel business.

---

# 1. THE PRODUCT WE ARE BUILDING

## Core positioning

> **DukaanQuest is an AI-powered omnichannel growth copilot for traditional retailers. It helps a small retailer prepare, digitize, list, market, retain customers, and make growth decisions without needing an e-commerce team.**

## Core promise

> **Create once. Sell everywhere. Retain existing customers. Reach new local customers. Simulate the next move before spending real money.**

## Strong positioning statement

> **Big retailers have teams for e-commerce, CRM, and marketing. Small retailers have one owner. DukaanQuest gives that owner the team.**

---

# 2. THE PRODUCT HAS SIX ENGINES

Do not lose this structure.

## Engine 1 — Marketplace / Physical Readiness

Before saying “go online,” explain what the retailer must prepare:
- seller/business requirements
- product requirements
- packaging
- labels
- product identifiers where applicable
- product information
- shipping information
- returns/compliance information

The product should present this as a simple readiness journey.

### Important correction

Do NOT hard-code unsupported claims such as:
- specific packaging micron requirements
- universal barcode requirements
- universal return windows
- “white background required” for every platform
- mandatory/optional brand registry
unless verified against current official documentation for that exact platform/category.

The existing handoff contains examples that may be stale or overgeneralized. Treat them as hypotheses requiring verification.

Prefer:

```text
AMAZON READINESS

Business information      ✅
Tax/GST information       ✅
Bank information          ✅
Product attributes        ✅
Images                    ✅
Package dimensions        ⚠️
Shipping information      ⚠️

2 actions remaining
[Fix readiness]
```

Every rule should record:
- source platform
- source URL
- retrieval/verification date
- platform
- category where relevant
- rule text/normalized requirement
- confidence

For production-like behavior, use cached/curated official source data where scraping is unreliable.

---

# 3. ENGINE 2 — GEMINI AI PHOTO STUDIO

## Goal

Merchant takes ordinary phone photos.

DukaanQuest turns them into professional marketplace-ready product assets.

Input:
- 1–2 photos
- optional price/details

Output:
- clean product image
- background removal/cleanup
- enhancement
- crop
- detail asset
- platform-specific asset variants where genuinely supported
- compliance analysis

## Critical current API change

Do NOT blindly use an old Gemini image model from stale project notes.

Google's current documentation says:
- Gemini API requires an API key.
- Current image generation/editing is provided by the newer Nano Banana family.
- `gemini-2.5-flash-image` is deprecated and scheduled for shutdown on **October 2, 2026**.
- Current recommended image models include `gemini-3.1-flash-image` and `gemini-3.1-flash-lite-image`.

Source:
https://ai.google.dev/gemini-api/docs/image-generation

Therefore:

### Audit the existing `geminiService.js`.

Determine:
1. which SDK is currently used
2. which model is currently used
3. whether the code is text/multimodal/image-generation compatible
4. whether the current model is deprecated
5. whether API-key authentication is implemented
6. whether fallback logic survives API failure

### Preferred implementation behavior

Use the current supported Gemini image model after checking the live official model documentation.

Do NOT expose the Gemini key in frontend code.

Use:

```env
GEMINI_API_KEY=
```

in the backend environment.

Never commit a real key.

## Gemini is a MUST-HAVE live integration

This is one of the APIs we should activate during this 48-hour sprint because it is central to the hero demo.

Test at least:
1. image understanding
2. product attribute extraction
3. image editing/generation if available under the current model
4. structured product JSON
5. graceful failure/fallback

---

# 4. ENGINE 3 — MASTER CATALOG + MARKETPLACE LISTING GENERATOR

The core principle:

> **Create once. Transform everywhere.**

Merchant should NOT type the same product three times.

Flow:

```text
PHONE PHOTO
     ↓
GEMINI
     ↓
MASTER PRODUCT
     ↓
PLATFORM ADAPTER
 ┌───┼────┐
 ↓   ↓    ↓
AMZ FK   MEESHO/MYNTRA/etc.
 ↓   ↓    ↓
READY / CONNECTED / UPLOAD
```

Example master product:

```json
{
  "title": "Blue Cotton Printed Kurti",
  "category": "Women's Ethnic Wear",
  "brand": "Local Brand",
  "color": "Blue",
  "material": "Cotton",
  "sizes": ["S", "M", "L", "XL"],
  "price": 899,
  "stock": 25,
  "sku": "DQ-KURTI-BLU-001"
}
```

Then convert that into platform-specific structures.

## IMPORTANT

Do not claim:

> "One-click live Amazon/Flipkart/Meesho publishing"

unless the corresponding real authorization and API integration actually works.

The UI must distinguish:

- `CONNECTED`
- `READY`
- `API PUBLISH`
- `UPLOAD FILE`
- `INTEGRATION PENDING`
- `STAGED DEMO`

Never fake production behavior.

---

# 5. AMAZON — REALITY + IMPLEMENTATION PLAN

Amazon's current SP-API documentation confirms that its APIs can:
- query product/catalog data
- retrieve product-type schemas
- check listing eligibility
- create/update/delete listings
- manage pricing/inventory/orders
- use sandbox environments

Amazon also requires developer onboarding, application registration, roles, and seller authorization. Public applications use OAuth 2.0; private apps have self-authorization limits and are intended for a single organization.

Official docs:
https://developer-docs.amazon.com/sp-api/docs/onboarding-overview
https://developer-docs.amazon.com/sp-api/lang-en_EN/docs/manage-product-listings-guide

## Decision

### DO THIS NOW:
- build clean `AmazonAdapter`
- model API payloads/interfaces
- support product-type requirements
- support listing validation
- implement sandbox/mock path
- begin developer registration immediately if practical

### DO NOT:
- block the whole project waiting for Amazon production approval
- use seller passwords
- claim live publication without a real successful call

## If credentials become available

Use:

```env
AMAZON_CLIENT_ID=
AMAZON_CLIENT_SECRET=
AMAZON_REFRESH_TOKEN=
AMAZON_REGION=
AMAZON_MARKETPLACE_ID=
AMAZON_APP_ID=
```

Exact names can be adjusted to the implementation.

Implement OAuth/token exchange and required request signing according to current official SP-API docs.

Store tokens securely.

---

# 6. FLIPKART — REALITY + IMPLEMENTATION PLAN

Flipkart's current Seller API documentation supports:
- seller API applications
- OAuth
- listing APIs
- seller-specific access

Important current fact:
- Self-access applications are for a seller's own account.
- Third-party applications are for partners/aggregators.
- Flipkart's documentation says third-party partner profiles may require verification and states a verification period of up to 72 hours.

Official docs:
https://seller.flipkart.com/api-docs/FMSAPI.html

## Decision

### DO THIS NOW:
- create `FlipkartAdapter`
- define listing payload schemas
- implement readiness/validation
- implement mock/staged publication path
- investigate API partner access immediately

### DO NOT:
- wait 72 hours and make it a blocker
- use self-access credentials to represent a third-party SaaS integration
- claim live third-party publishing unless actually authorized

If access becomes available:

```env
FLIPKART_CLIENT_ID=
FLIPKART_CLIENT_SECRET=
FLIPKART_REDIRECT_URI=
FLIPKART_ACCESS_TOKEN=
FLIPKART_REFRESH_TOKEN=
```

Use OAuth authorization for a seller if appropriate.

---

# 7. MEESHO — DO NOT INVENT AN API

Current research did not identify a public, self-serve seller API comparable to Amazon SP-API or Flipkart Seller APIs.

Meesho's official supplier site documents a Supplier Panel workflow where sellers register, upload catalogs, receive/ship orders, and receive payments.

Official supplier reference:
https://supplier.meesho.com/sell-online/shirts

## Decision

Do NOT waste the 48-hour sprint trying to reverse engineer private Supplier Panel APIs.

For Meesho:
- support a structured listing export
- provide listing-ready data
- provide bulk-upload-ready output if the required current format is verified
- show `UPLOAD-READY`
- do not claim direct live API publishing

No scraping/private endpoint abuse.

---

# 8. MYNTRA — POSSIBLE API, BUT PARTNER ACCESS MATTERS

Current Myntra Developer Centre documentation shows listing-management APIs and APIs for sellers to create/update product listings, images, attributes, activate/deactivate listings, inventory, orders, etc.

Source:
https://mmip.myntrainfo.com/

Myntra's current documentation also shows catalog submission/listing APIs and token-based authentication for partner integrations.

## Decision

Treat Myntra as:

### Tier 2 integration

Do:
- investigate official partner API access
- model an adapter
- build catalog/listing transformation
- support staged/ready output

Do not make the 48-hour product dependent on obtaining Myntra partner credentials.

---

# 9. NYKAA FASHION — DO NOT PROMISE DIRECT PUBLISHING

Nykaa Fashion's current support material points prospective partners toward association/onboarding rather than a simple public self-serve seller API flow.

Source:
https://onenykaafashion.zendesk.com/hc/en-us/articles/28744927960221-I-want-to-get-associated-with-Nykaa-Fashion

## Decision

Represent Nykaa Fashion as:

```text
NYKAA FASHION
⚠️ Partnership / eligibility workflow
```

Build:
- readiness
- catalog preparation
- partner onboarding guidance

Do not claim direct one-click publication.

---

# 10. ENGINE 4 — SARVAM AI

## Goal

Make the system usable by Indian-language-speaking merchants.

Use cases:
- translation
- voice commands
- voice guidance
- campaign generation
- local-language UI/copy
- regional marketing

## Current API reality

Sarvam's current documentation requires a Sarvam API key.

Official docs:
https://docs.sarvam.ai/api/getting-started/quickstart
https://docs.sarvam.ai/api-reference/authentication

Authentication:

```http
api-subscription-key: YOUR_SARVAM_API_KEY
```

Sarvam currently documents:
- text translation
- speech-to-text
- text-to-speech
- conversational APIs

The current Saaras v4 is the recommended/latest STT model in the current docs.
Bulbul v3 is the current/latest TTS model.

Do not blindly preserve old model names from the project handoff.

## Required environment variable

```env
SARVAM_API_KEY=
```

## MUST-HAVE LIVE INTEGRATION

Activate this now.

First implement/test:

### Translation
Hindi/Kannada/Tamil/English.

### STT
Short voice clip → merchant intent text.

### TTS
Text → regional-language audio.

Fallback remains mandatory.

---

# 11. ENGINE 5 — n8n AUTOMATION

## Important correction

n8n itself is NOT simply an "API key".

We need an n8n instance and workflows.

n8n can act as the workflow engine.

Core architecture:

```text
DukaanQuest Backend
       ↓
n8n Webhook
       ↓
Workflow
 ┌─────┼────────────┐
 ↓     ↓            ↓
CRM  Gemini      Sarvam
 ↓     ↓            ↓
Customer segmentation
       ↓
Merchant approval
       ↓
WhatsApp send
```

## MUST-HAVE LIVE INTEGRATION

Run an actual n8n instance during the sprint.

Preferred possibilities:
- n8n Cloud
- local/self-hosted n8n
- another reliable hosted instance

Do not assume the local URL will be reachable from a deployed frontend/backend.

If deployment is external, the n8n webhook must be reachable from the relevant backend.

## Environment design

Something like:

```env
N8N_BASE_URL=
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
```

If the n8n REST API itself is used, configure its API credentials separately.

## Required workflow #1

### New Customer Onboarding

```text
Webhook
↓
Validate consent
↓
Create customer
↓
Generate welcome message
↓
Merchant approval if promotional
↓
WhatsApp
```

## Required workflow #2

### Customer Re-engagement

```text
Scheduled trigger / webhook
↓
Fetch inactive customers
↓
Segment
↓
Gemini generates campaign
↓
Sarvam translates
↓
Merchant approval
↓
WhatsApp delivery
```

## Required workflow #3

### New Arrival Notification

```text
New product
↓
Find customers who previously purchased related category
↓
Generate message
↓
Translate
↓
Approval
↓
Send
```

---

# 12. WHATSAPP IS A SEPARATE CREDENTIAL LAYER

This is important.

n8n does not magically send WhatsApp messages simply because n8n is installed.

For real WhatsApp Business Cloud sending, we need Meta/WhatsApp credentials.

Typical configuration includes:
- WhatsApp access token
- WhatsApp phone number ID
- WhatsApp Business Account ID
- approved/test recipient(s)
- potentially app/system-user credentials depending on setup

For development, Meta can provide a test setup; temporary access tokens may expire quickly, so do not rely on a token generated once for the entire 48-hour period.

Recommended environment variables:

```env
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_WABA_ID=
WHATSAPP_VERIFY_TOKEN=
```

Do not commit these.

## Demo goal

Send at least one real test message from:
DukaanQuest → n8n → WhatsApp Cloud API → our test phone.

If Meta setup becomes blocked:
- keep the n8n workflow fully working
- use a mock WhatsApp delivery node
- show the exact payload that would be sent
- label it as staged

Never fake a real delivery.

---

# 13. ENGINE 6 — PAYTM

## Goal

Make Paytm a real fintech component, not a logo.

Use cases:
- payment links
- payment request
- transaction status
- QR/payment flow
- payment-related customer/order context

Paytm currently documents a Create Link API for generating payment links.

Official docs:
https://business.paytm.com/docs/api/create-link-api/

The documented flow includes:
- merchant MID
- checksum/signature
- staging and production endpoints
- payment link generation
- optional customer details
- status callback support

Paytm also documents staging/test integration.

## MUST-HAVE TARGET

Attempt a real staging Paytm integration during the 48-hour sprint.

Environment:

```env
PAYTM_ENVIRONMENT=STAGING
PAYTM_MID=
PAYTM_MERCHANT_KEY=
PAYTM_WEBSITE=
PAYTM_CALLBACK_URL=
```

Exact variables may be adapted to the implementation.

## IMPORTANT

Do not confuse:
- UPI intent generated by our own code
- a fake Paytm URL
- a real Paytm API payment link
- Paytm production payment

The UI must accurately state which one is active.

## Minimum real demonstration

```text
DukaanQuest
↓
Create Paytm Payment Link
↓
Receive real staging response
↓
Show returned link/status
```

If Paytm staging credentials cannot be obtained:
- preserve current mock/staged flow
- keep checksum implementation isolated
- clearly mark demo mode

---

# 14. THE WHAT-IF SIMULATOR

This is one of the product's strongest technical differentiators.

## Core rule

### LLM proposes.
### Code calculates.
### AI explains.

Never:

```text
Gemini: "You will earn ₹47,350."
```

without deterministic calculation.

Use deterministic functions for:
- revenue
- cost
- commission
- shipping
- return assumptions
- campaign cost
- conversion assumptions
- cash impact
- margin
- payback period

## Simulation strategies

Current concept:

### A — Marketplace Expansion
- broader reach
- marketplace costs
- setup effort
- inventory implications

### B — Existing Customer Re-engagement
- low acquisition cost
- repeat customer behavior
- WhatsApp cost
- conversion assumptions

### C — Hyperlocal Marketing
- budget
- radius
- customer acquisition assumptions
- campaign economics

## IMPORTANT

Numbers in the current handoff such as:
- 17.5% commission
- ₹110 shipping
- 14% return risk
- 24% conversion
- ₹0.85/chat
- 2.6x ROAS

must NOT automatically be presented as industry facts.

They should be treated as:
- configurable demo assumptions, or
- sourced values with citations.

UI should label them appropriately:

```text
DEMO ASSUMPTION
```

or:

```text
Source-backed assumption
```

Never present arbitrary assumptions as guaranteed market performance.

---

# 15. GAME / CITY LAYER

The game interface is not the product's core business value.

It is the memorable interface.

Do NOT build:
- combat
- RPG battles
- complex 3D
- Unity/Unreal
- unnecessary physics
- irrelevant XP mechanics

Use the existing 2D Canvas city.

The city represents merchant progress:

```text
Physical Shop
     ↓
Digital Catalog
     ↓
Amazon/Marketplace Stalls
     ↓
WhatsApp CRM Hub
     ↓
Marketing Center
     ↓
Simulation Observatory
```

Quest completion should map to actual business actions:

```text
Quest:
Prepare Product Images

Actual action:
Upload photo + Gemini enhancement

Quest:
Unlock Marketplace

Actual action:
Complete listing readiness

Quest:
Reactivate Customers

Actual action:
Generate and approve CRM campaign

Quest:
Simulate Growth

Actual action:
Compare strategies
```

XP is motivational UI only.

---

# 16. EXISTING REPOSITORY — DO NOT START FROM SCRATCH

The current handoff says the repository already includes:

## Backend
- `server/index.js`
- Express backend
- routes for health/shop/products/readiness/studio/CRM/Sarvam/Paytm/quests

## Services
- `geminiService.js`
- `sarvamService.js`
- `n8nService.js`
- `paytmService.js`
- `scraperService.js`

## Frontend
- React 19 + Vite
- Digital Dukaan Canvas
- Quest Log
- Physical Readiness Checker
- Gemini Photo Studio
- Omnichannel Catalog
- WhatsApp CRM Hub
- What-If Simulator
- Paytm Payment Hub

The current handoff lists these implemented services/routes explicitly:
`GET /api/health`,
`GET/PUT /api/shop`,
`GET/POST /api/products`,
`GET/POST /api/readiness`,
`GET /api/readiness/scrape`,
`POST /api/studio/upload`,
`POST /api/studio/enhance`,
`GET/POST /api/crm/...`,
`POST /api/sarvam/translate`,
`POST /api/paytm/create-link`,
and quest endpoints.

Do not recreate these from scratch.

---

# 17. FIRST COMMAND: AUDIT THE REPOSITORY

Before modifying code:

1. inspect root files
2. inspect `package.json`
3. inspect backend package.json
4. inspect frontend package.json
5. inspect `.env.example`
6. inspect `.gitignore`
7. inspect all service files
8. inspect `server/index.js`
9. inspect `dukaanquest-app/src/App.jsx`
10. inspect `dukaanquest-app/src/services/api.js`
11. inspect all feature components
12. run the current app
13. run existing tests
14. run production build

Do NOT trust the handoff as exact code truth.

The repository is the code truth.

---

# 18. CURRENT CREDENTIAL STATUS

This is critical.

### Current known status:

We have NOT yet implemented actual live credentials for:
- Gemini
- Sarvam
- n8n
- WhatsApp Cloud
- Paytm
- Amazon
- Flipkart

The application currently relies on fallback/staged behavior in several places.

The next agent must therefore:

### NEVER assume keys exist.

Instead:
- detect missing credentials
- produce a clear health status
- continue safely
- use fallback mode where necessary

---

# 19. CREDENTIAL PRIORITY FOR THE NEXT 48 HOURS

## PRIORITY A — DO IMMEDIATELY

### 1. Gemini
**YES — activate now.**

Reason:
- hero feature
- image understanding
- product extraction
- photo studio
- high demo value

### 2. Sarvam
**YES — activate now.**

Reason:
- meaningful sponsor integration
- regional-language differentiation
- translation/STT/TTS

### 3. n8n
**YES — activate now.**

Reason:
- core automation
- sponsor integration
- visual workflow demo

### 4. WhatsApp Cloud API
**YES — attempt now alongside n8n.**

Reason:
- completes the actual merchant retention workflow

### 5. Paytm staging
**YES — attempt now.**

Reason:
- sponsor fit
- real fintech behavior
- payment link demo

---

# 20. PRIORITY B — START REGISTRATION/ACCESS BUT DO NOT BLOCK

### Amazon SP-API
Start onboarding immediately if possible.

But:
- do not depend on production approval
- use sandbox/staged path if required

### Flipkart Seller API
Investigate/register immediately.

But:
- third-party verification may exceed our 48-hour window
- do not block MVP

### Myntra
Investigate official MMIP partner access.

But:
- do not block MVP

---

# 21. PRIORITY C — DO NOT WASTE THE SPRINT

### Meesho
Do not reverse-engineer private APIs.

### Nykaa Fashion
Do not chase undocumented/private integration.

### Full Meta Ads API campaign publishing
Do not make this a core 48-hour dependency.

We can generate:
- ad creative
- copy
- audience
- budget
- landing page

and show a staged "ready to launch" workflow.

---

# 22. REQUIRED FALLBACK ARCHITECTURE

Every external service must have:

```text
LIVE MODE
   ↓
API success
   ↓
real response

API failure / missing key
   ↓
fallback engine
   ↓
realistic demo response
```

Frontend should visibly understand status:

```text
🟢 LIVE
🟡 STAGED
⚪ OFFLINE FALLBACK
🔴 ERROR
```

Never silently fake live status.

---

# 23. ENVIRONMENT SECURITY

Never hard-code API keys.

Use:

```text
server/.env
```

and:

```text
server/.env.example
```

Make sure `.env` is gitignored.

Do not log:
- API keys
- access tokens
- refresh tokens
- merchant secret keys
- WhatsApp access tokens
- Paytm merchant keys
- marketplace credentials

Use safe health checks such as:

```text
Gemini: configured
Sarvam: missing
Paytm: staging configured
Amazon: not connected
```

NOT:

```text
GEMINI_API_KEY=AIza...
```

---

# 24. HEALTH ENDPOINT

Upgrade `/api/health` so it reports:

```json
{
  "overall": "degraded",
  "services": {
    "gemini": {
      "configured": true,
      "mode": "live",
      "latencyMs": 840
    },
    "sarvam": {
      "configured": true,
      "mode": "live"
    },
    "n8n": {
      "configured": true,
      "mode": "live"
    },
    "whatsapp": {
      "configured": false,
      "mode": "staged"
    },
    "paytm": {
      "configured": true,
      "mode": "staging"
    },
    "amazon": {
      "configured": false,
      "mode": "staged"
    },
    "flipkart": {
      "configured": false,
      "mode": "staged"
    }
  }
}
```

This is useful during judging and debugging.

---

# 25. ERROR HANDLING REQUIREMENTS

Every external call must have:
- timeout
- retry where appropriate
- friendly error
- structured server log
- fallback
- request correlation ID if practical

Do not let a single API outage crash the demo.

Example:

```text
Gemini timeout
↓
"AI Studio temporarily unavailable"
↓
Fallback product metadata
↓
Demo continues
```

---

# 26. DATABASE

The handoff currently uses a local atomic JSON database.

Do not migrate databases merely because MongoDB/Postgres sounds more professional.

First determine whether the current JSON store is sufficient for the 48-hour demo.

If yes:
**keep it.**

If the architecture genuinely requires persistence beyond the demo:
consider Supabase/Postgres after the core path is stable.

Avoid unnecessary migrations.

---

# 27. EXISTING ARCHITECTURE INCONSISTENCIES TO FIX

The handoff contains several potentially stale/inconsistent references.

Examples:
- old model names
- references to MongoDB Atlas while current implementation reportedly uses a local JSON store
- upload limit says both 10MB and 25MB in different places
- event/product documentation may mix current and old requirements
- Paytm responses currently described as realistic generated links
- marketplace claims may be more confident than actual integrations
- old model names for Sarvam
- old Gemini image model

The agent must reconcile these against the actual repository and current official docs.

Do not blindly preserve contradictory documentation.

---

# 28. TEST PLAN

Create/run tests for:

## Gemini
- product image upload
- product extraction
- image enhancement/editing
- missing key fallback

## Sarvam
- Hindi translation
- Kannada translation
- Tamil translation
- STT
- TTS
- missing key fallback

## n8n
- webhook receives payload
- workflow executes
- CRM data survives
- approval gate works

## WhatsApp
- test message successfully dispatched if credentials exist
- failure is handled

## Paytm
- staging request created
- checksum/signature works
- payment link returned
- error response handled

## Marketplace adapters
- master product transforms correctly
- required fields validated
- staging/manual-export path works

## Simulation
- deterministic outputs
- no LLM-generated numeric values
- edge cases work

## Build
- frontend build succeeds
- backend starts
- no console-breaking errors
- no uncaught promise errors

---

# 29. DEMO FLOW

Target: approximately 3 minutes.

## 0:00–0:20

Show physical clothing shop.

Story:

> "This retailer already has products, customers and digital payments. What he doesn't have is an e-commerce team."

## 0:20–0:45

Show readiness.

Merchant wants Amazon/Flipkart/Meesho/etc.

DukaanQuest identifies missing preparation steps.

## 0:45–1:10

Take one phone photo.

Gemini:
- understands product
- enhances image
- creates product data

## 1:10–1:30

Master product becomes marketplace-ready outputs.

Show:

```text
Amazon
Flipkart
Meesho
Myntra
```

with honest statuses.

## 1:30–1:50

Show customer CRM.

Existing offline customers are segmented.

## 1:50–2:10

n8n executes the workflow.

Sarvam creates regional-language campaign text/audio.

WhatsApp test delivery if live credentials exist.

## 2:10–2:35

Show city/quest.

Online marketplace/CRM/marketing capabilities unlock.

## 2:35–2:55

Run:

> "What should I do next?"

Compare:
- marketplace expansion
- customer reactivation
- local marketing

Show deterministic financial simulation.

## 2:55–3:00

Closing:

> **"Big retailers have teams. Small retailers have one owner. DukaanQuest gives that owner the team."**

---

# 30. DEMO SAFETY RULE

There must be one "golden path" that works even if:
- internet drops briefly
- one API rate limits
- n8n fails
- Paytm fails
- marketplace credentials are missing

The golden path should still demonstrate:

```text
PHOTO
↓
GEMINI / FALLBACK
↓
MASTER PRODUCT
↓
LISTING
↓
CRM
↓
SIMULATION
↓
CITY UPDATE
```

External integrations are additive, not single points of failure.

---

# 31. PRODUCT SCREEN PRIORITIES

## Must look excellent

### A. Digital Dukaan City
This is the visual hook.

### B. Gemini Photo Studio
Before/after slider.

### C. Marketplace readiness/listing screen
Simple and understandable.

### D. WhatsApp CRM
Real workflow visualization.

### E. What-If Simulator
Clear comparison.

Do not over-polish low-value settings pages.

---

# 32. SPONSOR STORY

We want meaningful sponsor usage, but never force sponsors into the architecture.

## Gemini
Product understanding + image studio.

## Sarvam
Voice + regional language.

## n8n
Automation engine.

## Paytm
Payment collection / payment workflow.

The phrase:

> "We integrated the sponsors"

is less important than:

> "Each sponsor solves a genuine technical part of the merchant journey."

---

# 33. HUMAN-IN-THE-LOOP

For external actions:

```text
AI recommendation
↓
Merchant preview
↓
MERCHANT APPROVES
↓
External action
```

Never let AI autonomously:
- blast marketing campaigns
- publish unknown products
- spend ad money
- make financial commitments
- send messages to customers without approval

This also makes the demo safer and more credible.

---

# 34. PRIVACY / CONSENT

Customer CRM must support:

```text
marketingOptIn: true/false
```

Campaigns should only target permitted users.

Every campaign should have:
- approval
- opt-out/stop mechanism
- audit record

Do not encourage contact scraping.

---

# 35. DO NOT OVERBUILD "AGENTS"

We don't need 17 agents.

Use focused modules:

```text
Catalog Agent
Marketplace Agent
Customer Agent
Growth Agent
Orchestrator
Simulation Engine
```

Prefer deterministic code for structured business logic.

---

# 36. GIT / CHANGE MANAGEMENT

Before editing:

```bash
git status
git branch
```

Create clean commits at meaningful milestones.

Examples:

```text
feat(gemini): activate live product vision
feat(sarvam): add live translation and voice
feat(n8n): connect CRM workflow
feat(paytm): add staging payment links
feat(simulator): harden deterministic calculations
fix(readiness): verify marketplace rule sources
```

Never commit secrets.

Never rewrite unrelated working code without reason.

---

# 37. CODING STYLE

Follow the existing design system.

The current handoff specifies CSS variables such as:
- `--bg-oled`
- `--brand-primary`
- `--border-subtle`
- `--radius-md`

Use existing tokens.

Do not create random styles/colors that make the application inconsistent.

Preserve the existing visual language unless a change clearly improves the product.

---

# 38. EXECUTION ORDER FOR THE NEXT 48 HOURS

## PHASE 0 — 30–60 MINUTES
Repository audit.

Do not code before understanding current state.

---

## PHASE 1 — FIRST 3 HOURS
Activate:

1. Gemini
2. Sarvam
3. n8n
4. WhatsApp test API if possible
5. Paytm staging if credentials can be obtained

Run smoke tests after each.

---

## PHASE 2 — NEXT 4–6 HOURS
Harden:

- Gemini photo flow
- product extraction
- master product object
- marketplace transformer
- readiness engine
- fallback behavior

---

## PHASE 3 — NEXT 3–4 HOURS
Harden CRM:

- customer segmentation
- n8n workflow
- Sarvam regional messaging
- consent
- approval gate
- WhatsApp test delivery

---

## PHASE 4 — NEXT 3 HOURS
Harden:

- Paytm staging
- payment link
- payment status
- QR
- order/customer linkage

---

## PHASE 5 — NEXT 3 HOURS
Harden simulator:

- deterministic math
- configurable assumptions
- clear methodology
- no hallucinated numeric output

---

## PHASE 6 — NEXT 3–4 HOURS
Polish UI/game:

- city
- quest progression
- transitions
- loading states
- empty/error states
- sponsor indicators

---

## PHASE 7 — NEXT 2–3 HOURS
QA:

- fresh clone
- clean install
- environment setup
- local run
- production build
- API smoke test
- golden demo path

---

## PHASE 8 — FINAL
Create:
- PPT screenshots
- architecture diagram
- data-flow diagram
- demo script
- README
- integration status table

---

# 39. REQUIRED API STATUS TABLE

Maintain a project file such as:

`API_INTEGRATION_STATUS.md`

with:

| Integration | Credentials | Live? | Demo status | Blocker |
|---|---|---|---|---|
| Gemini | Yes/No | Yes/No | Live/Staged | ... |
| Sarvam | Yes/No | Yes/No | Live/Staged | ... |
| n8n | Instance URL | Yes/No | Live/Staged | ... |
| WhatsApp | Meta token | Yes/No | Live/Staged | ... |
| Paytm | MID/Key | Yes/No | Staging/Staged | ... |
| Amazon | SP-API auth | Yes/No | Sandbox/Staged | ... |
| Flipkart | OAuth | Yes/No | Staged | ... |
| Meesho | No public API verified | No | Upload-ready | ... |
| Myntra | Partner auth | Yes/No | Staged | ... |
| Nykaa Fashion | Partnership flow | No | Readiness | ... |

This prevents the team from lying to itself about what is actually integrated.

---

# 40. REQUIRED FINAL PROJECT STATES

At the end of the sprint, the system must support:

## State A — Offline retailer
```text
🏪 Physical only
```

## State B — Digital ready
```text
📸 Products digitized
✅ Readiness checklist
```

## State C — Marketplace ready
```text
Amazon: ready/staged/live
Flipkart: ready/staged/live
Meesho: upload-ready
Myntra: readiness/staged
```

## State D — Customer growth ready
```text
👥 CRM
📱 WhatsApp automation
🗣️ Regional language
```

## State E — Growth simulation
```text
🔮 What-if
```

## State F — Digital Vyapari
```text
🏙️ city visibly expanded
```

---

# 41. WHAT THE AGENT MUST NOT DO

Do NOT:

- replace the entire project
- start from a new framework
- migrate the database without need
- build a mobile app
- build a full ERP
- reverse engineer private marketplace APIs
- claim undocumented API access
- hard-code fake production credentials
- expose secrets in frontend
- remove fallbacks
- let LLMs fabricate financial results
- make Amazon/Flipkart approval a blocker
- spend most of the sprint on 3D graphics
- implement unnecessary authentication complexity
- create dozens of AI agents
- add random features because they "sound cool"

---

# 42. WHAT THE AGENT SHOULD DO WHEN A CREDENTIAL IS MISSING

Example:

```text
GEMINI_API_KEY missing
```

Do:

1. keep the app running
2. show missing/disabled status
3. use existing fallback
4. create/update `.env.example`
5. document exactly what credential is needed
6. continue implementing all code around the integration

Do NOT:
- wait for the credential before continuing
- fake a successful real API call
- remove the integration because the key is unavailable

---

# 43. WHAT THE AGENT SHOULD DO WHEN A LIVE INTEGRATION IS BLOCKED

Example:

Amazon production approval unavailable.

Do:

```text
AmazonAdapter
↓
Sandbox/mock
↓
Verified payload
↓
UI says:
"Sandbox / Integration-ready"
```

Then continue.

The MVP must remain judge-demo-safe.

---

# 44. RESEARCH / CLAIM DISCIPLINE

Whenever adding a factual platform requirement:

1. use the current official documentation first
2. note the source URL
3. avoid unsupported universal claims
4. add retrieval date
5. distinguish demo assumptions from facts

External source hierarchy:

### Tier 1
Official platform documentation.

### Tier 2
Official platform support pages.

### Tier 3
Reputable secondary sources.

Do not use a random blog to establish a marketplace compliance requirement if official documentation exists.

---

# 45. CURRENT OFFICIAL RESEARCH REFERENCES

Gemini:
https://ai.google.dev/gemini-api/docs/get-started
https://ai.google.dev/gemini-api/docs/image-generation
https://ai.google.dev/gemini-api/docs/models

Sarvam:
https://docs.sarvam.ai/api/getting-started/quickstart
https://docs.sarvam.ai/api-reference/authentication
https://docs.sarvam.ai/api-reference/text/translate-text
https://docs.sarvam.ai/api-reference/speech-to-text/transcribe
https://docs.sarvam.ai/api-reference/text-to-speech/convert

Amazon SP-API:
https://developer-docs.amazon.com/sp-api/docs/onboarding-overview
https://developer-docs.amazon.com/sp-api/lang-en_EN/docs/manage-product-listings-guide

Flipkart:
https://seller.flipkart.com/api-docs/FMSAPI.html

Myntra:
https://mmip.myntrainfo.com/

Meesho:
https://supplier.meesho.com/sell-online/shirts

Nykaa Fashion:
https://onenykaafashion.zendesk.com/hc/en-us/articles/28744927960221-I-want-to-get-associated-with-Nykaa-Fashion

Paytm:
https://business.paytm.com/docs/api/create-link-api/

n8n:
https://docs.n8n.io/

---

# 46. DEFINITION OF DONE

The project is ready for the next stage when:

### Product
- the merchant journey is coherent
- no dead-end screens
- no contradictory statuses

### AI
- Gemini works live when key exists
- Sarvam works live when key exists
- fallbacks work

### Automation
- n8n workflow actually executes
- WhatsApp is live or clearly staged

### Payments
- Paytm staging works or is cleanly staged

### Marketplace
- master product → platform-specific output works
- current readiness information is source-backed
- no false live-publishing claim

### Simulator
- deterministic
- auditable
- transparent assumptions

### Game
- city reacts to actual product actions
- quests correspond to real tasks

### Security
- no secrets committed
- no keys in client bundle
- customer consent exists

### Reliability
- app survives API failures
- golden demo path always works

### Build
- frontend production build succeeds
- backend starts cleanly
- no critical console/server errors

---

# 47. FINAL INSTRUCTION TO THE CODING AGENT

Operate like a senior hackathon engineering lead.

Be proactive.

Do not repeatedly ask for permission to perform obvious engineering steps.

Inspect first.

Then implement.

When blocked by credentials:
- build the integration
- document the required credential
- keep fallback mode
- move to the next task

When you discover an outdated assumption:
- verify it against current official documentation
- update code/docs
- record what changed

When you find an architectural weakness:
- fix the smallest thing that solves it
- do not rewrite the entire system

When a feature is not feasible in 48 hours:
- downgrade it to adapter/staged/manual-export mode
- preserve the product experience
- don't let it block the core flow

The priority order is:

```text
REAL USER VALUE
      ↓
WORKING GOLDEN DEMO
      ↓
LIVE CORE API INTEGRATIONS
      ↓
RELIABLE FALLBACKS
      ↓
TECHNICAL CREDIBILITY
      ↓
VISUAL POLISH
      ↓
OPTIONAL FEATURES
```

The final product should make a judge think:

> "This isn't just another AI dashboard. They understood the actual operational problem of a small retailer, built a workflow that reduces the work, used the sponsor technologies for real reasons, and made the complexity understandable."

Build toward that.
