# 📜 DukaanQuest — Comprehensive Project Status & Engineering Handoff

> **HackSprint 2026 | Problem Statement PS-21: Democratizing Digital Commerce for Bharat Retailers**  
> **Last Updated:** 2026-10-02 12:00 IST  
> **Repository:** [https://github.com/vaibhavyadavvv2007-ai/dukaan.git](https://github.com/vaibhavyadavvv2007-ai/dukaan.git)  
> **Target Submission Deadline:** 2026-10-04 23:59 IST  
> **Screening Evaluation Date:** 2026-10-05 23:50 IST  
> **Target Audience:** Incoming AI coding assistants, subagents, and human developers.

---

## 1. Executive Summary & Problem Context

Traditional Indian mom-and-pop retailers ("Mohalla Kiranas & Dukaans") struggle to transition to online e-commerce platforms like Amazon, Flipkart, and Myntra due to four structural friction points:
1. **Physical Intimidation & Compliance Gap:** Retailers do not understand non-digital physical requirements (polybag micron thickness, thermal barcode sticker dimensions, suffocation warnings, return quality checks).
2. **Catalog Creation & Studio Photography Costs:** Traditional studio photography costs ₹500–₹1,500 per SKU; retailers take poor counter-top photos that get rejected by marketplace automated quality filters.
3. **Language & Interface Complexity:** Modern seller portals are predominantly English-first or poorly translated, alienating vernacular merchants.
4. **CRM & Cash Flow Disconnect:** Disjointed tools for payments (Paytm/UPI) and customer re-engagement (WhatsApp), leaving merchants vulnerable to high return rates and lost repeat customers.

**DukaanQuest** solves this as a **gamified copilot** ("From Mohalla Merchant to Digital Vyapari") that combines:
- **Marketplace Documentation Web Scraping** for physical packaging compliance.
- **Google Gemini Pro Vision AI** for instant #FFFFFF studio transformation and compliance auditing.
- **Sarvam AI Indic Language Engine** for real-time Hindi, Kannada, Tamil, and English translation.
- **n8n Workflow Automation** for WhatsApp campaign broadcasting with Human-in-the-Loop merchant control.
- **Paytm FinTech Integration** for dynamic UPI payment links, QR codes, and simulated Soundbox voice announcements.
- **Audited What-If Unit Economics Simulator** with zero LLM hallucinations.
- **2D Canvas Town Engine** turning seller onboarding into a motivating leveling quest.

---

## 2. High-Level Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DUKAANQUEST REACT FRONTEND (Port 5173)               │
│                                                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ 2D Canvas Town   │  │ Physical Checker │  │ Gemini Photo Studio  │  │
│  │ (Quest / Level)  │  │ (Scraper UI)     │  │ (Split Slider + AI)  │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
│           │                     │                       │              │
│  ┌────────┴─────────┐  ┌────────┴─────────┐  ┌──────────┴───────────┐  │
│  │ WhatsApp CRM Hub │  │ Paytm FinTech    │  │ What-If Simulator    │  │
│  │ (n8n + Sarvam)   │  │ (UPI / Soundbox) │  │ (Unit Economics)     │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
│           │                     │                       │              │
│           └─────────────────────┼───────────────────────┘              │
│                                 ▼                                      │
│                     Central API Client (api.js)                        │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ HTTP / JSON REST
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   EXPRESS REST BACKEND (Port 5000)                     │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Express 4 Core App (server/index.js) + CORS + Multer Limit 25MB  │  │
│  └────────────────────────────────┬─────────────────────────────────┘  │
│                                   │                                    │
│         ┌─────────────────────────┼─────────────────────────┐          │
│         ▼                         ▼                         ▼          │
│  ┌──────────────┐          ┌──────────────┐          ┌──────────────┐  │
│  │ scraperService│          │ geminiService│          │ sarvamService│  │
│  │ (Cheerio/Axios│          │ (Vision AI/  │          │ (Indic Lang  │  │
│  │  Scraper)    │          │  Compliance) │          │  Engine)     │  │
│  └──────────────┘          └──────────────┘          └──────────────┘  │
│         │                         │                         │          │
│         ├─────────────────────────┼─────────────────────────┤          │
│         ▼                         ▼                         ▼          │
│  ┌──────────────┐          ┌──────────────┐          ┌──────────────┐  │
│  │ n8nService   │          │ paytmService │          │ database.js  │  │
│  │ (Webhook Hub)│          │ (UPI / QR)   │          │ (JSON Store) │  │
│  └──────────────┘          └──────────────┘          └──────────────┘  │
│                                                             │          │
│                                                             ▼          │
│                                                   server/db/database.json
└────────────────────────────────────────────────────────────────────────┘
```

### Core Technologies Used:
- **Frontend:** React 19, Vite v8.3.2, Vanilla CSS design system (tokens, glassmorphism, OLED dark mode), `lucide-react` icons, `canvas-confetti`.
- **Backend:** Node.js, Express v4.21, Multer (memory buffer upload), Axios, Cheerio, Dotenv, CORS.
- **Database:** Local atomic JSON store (`server/db/database.json`) with safe disk persistence.
- **Typography:** Google Fonts (`Outfit` for headings, `Inter` for body UI, `Fira Code` for SKUs/metrics).
- **Design Tokens:** CSS custom properties in `dukaanquest-app/src/index.css` (`--brand-primary: #6366F1`, `--brand-gradient`, `--bg-oled: #030712`, etc.).

---

## 3. What Has Been Implemented (Feature Deep-Dive)

### 3.1. Centralized Express Backend (`server/`)
- **Server Entry:** [server/index.js](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/server/index.js)
  - Listens on port `5000` (or `process.env.PORT`).
  - Supports file uploads up to 10MB via Multer.
  - Endpoints implemented:
    - `GET /api/health` — Returns status and health status of all 4 sponsors (Gemini, Sarvam, n8n, Paytm).
    - `GET /api/shop` & `PUT /api/shop/xp` — Merchant profile and XP progression tracker.
    - `GET /api/products` & `POST /api/products` — Product catalog management.
    - `GET /api/readiness` & `POST /api/readiness/toggle` — Platform physical checklist state.
    - `GET /api/readiness/scrape?platform=...&category=...` — Live marketplace guidelines scraper.
    - `POST /api/studio/upload` & `POST /api/studio/enhance` — Gemini multimodal vision processing.
    - `GET /api/crm/customers` & `POST /api/crm/broadcast` — Customer list & n8n webhook campaign trigger.
    - `GET /api/crm/n8n-workflow` — Full visual workflow JSON definition.
    - `POST /api/sarvam/translate` — Real-time Indic translation.
    - `POST /api/paytm/create-link` — Dynamic Paytm payment link and UPI QR creation.
    - `GET /api/quests` & `POST /api/quests/complete` — Gamified quest completion.

### 3.2. Physical Readiness & Packaging Documentation Scraper
- **Backend Service:** [server/services/scraperService.js](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/server/services/scraperService.js)
- **Frontend Component:** [dukaanquest-app/src/components/readiness/PhysicalReadinessChecker.jsx](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/dukaanquest-app/src/components/readiness/PhysicalReadinessChecker.jsx)
- **Functionality:**
  - Scrapes or pulls official platform documentation from Amazon Seller Central, Flipkart Seller Hub, and Myntra Partner Portal.
  - **Live Scrape Button:** Retailer clicks `"⚡ Scrape Live Marketplace Specs"`, fetching real-time packaging rules, source URLs, and returns protocols.
  - Interactive checklist with XP rewards (+50 XP to +75 XP) and confetti upon completion.
  - **Printable Modal:** One-click print-ready packaging checklist specifying polybag micron thickness, FNSKU barcode dimensions, and carton H-tape sealing.

### 3.3. Google Gemini Vision Photo Studio
- **Backend Service:** [server/services/geminiService.js](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/server/services/geminiService.js)
- **Frontend Component:** [dukaanquest-app/src/components/studio/GeminiPhotoStudio.jsx](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/dukaanquest-app/src/components/studio/GeminiPhotoStudio.jsx)
- **Functionality:**
  - Accepts image file upload or camera photo.
  - Analyzes fabric texture, color fidelity, and background interference.
  - Synthesizes studio #FFFFFF lighting and isolates subject.
  - Interactive **Before/After Split Slider** (0–100% draggable).
  - Calculates **Marketplace Compliance Score (e.g. 94%)** with instant AI recommendations.
  - Prepares 4 channel-specific visual assets:
    1. Amazon Main Hero (1:1 square, 2000×2000, pure white background).
    2. Myntra Lifestyle Editorial (3:4 portrait, warm soft lighting).
    3. Macro Weave & Texture Detail (High zoom weave inspection).
    4. Dimension & Spec Overlay (Length, width, blouse piece callouts).

### 3.4. Sarvam AI Indic Language Localization
- **Backend Service:** [server/services/sarvamService.js](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/server/services/sarvamService.js)
- **Frontend Integration:** Universal top navbar in [dukaanquest-app/src/App.jsx](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/dukaanquest-app/src/App.jsx) and CRM template translator.
- **Functionality:**
  - Translates copy into **English, Hindi (हिंदी), Kannada (ಕನ್ನಡ), and Tamil (தமிழ்)**.
  - Seamless fallback dictionary ensures zero downtime even without an external API key.
  - Dynamically updates navigation, headers, button labels, and WhatsApp campaign messaging.

### 3.5. n8n WhatsApp CRM Automation Hub & Meta Cloud API
- **Backend Service:** [server/services/n8nService.js](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/server/services/n8nService.js)
- **Frontend Component:** [dukaanquest-app/src/components/crm/WhatsAppCRMHub.jsx](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/dukaanquest-app/src/components/crm/WhatsAppCRMHub.jsx)
- **Functionality & Meta WhatsApp Cloud API Integration:**
  - **Live Delivery Verified:** Verified n8n webhook → Meta WhatsApp Cloud API delivering the `hello_world` template live to WhatsApp.
  - **Environment-Driven Template Configuration:** Dynamically configured via `WHATSAPP_TEMPLATE_NAME` and `WHATSAPP_TEMPLATE_LANG` in `server/.env`.
  - **Seamless Switch to Custom Template:** `dukaanquest_new_arrival` is submitted to Meta and under review. Once approved, switching requires only updating `WHATSAPP_TEMPLATE_NAME=dukaanquest_new_arrival` without any code changes.
  - **E.164 Phone Normalization:** Cleans Indian numbers into Meta-compliant digits (`919845012345`) without spaces or special characters.
  - **Consent Gate & DPDP Act 2023 Compliance:** Automatically audits recipient list, skipping any contact with `marketingOptIn: false` and appending mandatory opt-out notices.
  - **Human-in-the-Loop Merchant Approval:** Merchant must review and confirm before messages are dispatched.
  - **Resilient Fallback Mode:** When n8n is offline or unreachable, system automatically stages the broadcast payload in `staged-fallback` mode with 100% data integrity, preventing frontend crashes.
  - **Visual n8n Pipeline & Status Bar:** Real-time indicator displaying active Meta template, review status, and interactive workflow node diagram.

### 3.6. Paytm FinTech Hub & Soundbox (STAGED/FALLBACK Mode)
- **Backend Service:** [server/services/paytmService.js](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/server/services/paytmService.js)
- **Frontend Component:** [dukaanquest-app/src/components/paytm/PaytmPaymentHub.jsx](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/dukaanquest-app/src/components/paytm/PaytmPaymentHub.jsx)
- **Operational Classification:** **STAGED / FALLBACK (NEVER LIVE)**.
- **Context & Unblocking Architecture:**
  - Paytm test-key generation is currently unavailable on the Paytm Developer Dashboard.
  - DukaanQuest does not block on missing keys; the system operates in resilient STAGED/FALLBACK mode.
  - The UI demonstrates the full intended payment-link creation, dynamic UPI QR standee, and vernacular Soundbox alerts using **clearly labeled demo data** (`[DEMO LINK]`, `DEMO QR`, `STAGED/FALLBACK`).
  - **Zero-Code Staging Hook:** If real staging credentials become available later, populating `PAYTM_MERCHANT_KEY` in `server/.env` immediately activates the live staging call without any architectural or frontend code changes.
- **Functionality:**
  - Remote UPI Link generation with E.164 and Paytm-compliant schema.
  - Counter-top UPI QR code standee preview with 0% MDR Bharat promotional tier.
  - **Simulated Paytm Soundbox:** Plays real audio chime and Hindi voice broadcast (*"Paytm par ₹4,850 prapt hue"*).
  - Deterministic settlement simulation (`T+0 Instant`).

### 3.7. Audited What-If Unit Economics Simulator
- **Frontend Component:** [dukaanquest-app/src/components/simulator/WhatIfSimulator.jsx](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/dukaanquest-app/src/components/simulator/WhatIfSimulator.jsx)
- **Functionality:**
  - Interactive sliders for Available Capital (₹3,000–₹50,000), Target Revenue, and Customer Base.
  - **Zero LLM Hallucinations:** Strictly audited deterministic mathematical models comparing 3 distinct growth paths:
    1. **Strategy A (Marketplace Expansion):** 17.5% commission, ₹110 shipping, 14% return risk buffer, 26-day payback.
    2. **Strategy B (WhatsApp CRM via n8n):** 24% conversion from repeat customers, ₹0.85 per chat, 2-day payback (Highest Margin Recommendation).
    3. **Strategy C (Hyperlocal Meta Ads):** 5km radius geofencing, 2.6x ROAS, 6-day payback.

### 3.8. Omnichannel Catalog & Amazon SP-API Sandbox
- **Backend Services:** 
  - [server/services/amazonService.js](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/server/services/amazonService.js) (LWA Token Exchange & SP-API Sandbox Client)
  - [server/services/marketplaceAdapters.js](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/server/services/marketplaceAdapters.js) (5-Engine Marketplace Transformation)
- **Frontend Component:** [dukaanquest-app/src/components/catalog/OmnichannelCatalog.jsx](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/dukaanquest-app/src/components/catalog/OmnichannelCatalog.jsx)
- **Amazon SP-API Sandbox Integration Status: VERIFIED (HTTP 200 OK)**
  - **LWA Token Exchange:** Automates documented Login with Amazon (LWA) OAuth2 refresh token exchange against `https://api.amazon.com/auth/o2/token` with in-memory caching.
  - **Authenticated Sandbox GET:** Executes authenticated `GET /sellers/v1/marketplaceParticipations` against EU/India sandbox host (`https://sandbox.sellingpartnerapi-eu.amazon.com`) with `x-amz-access-token`.
  - **Security & Zero Exposure:** Credential values are strictly masked in all responses, logs, and UI (`amzn1.ap...19e1`).
  - **Production Safeguards:** Production seller authorization and live listing publishing are safely disarmed (`productionPublishingBlocked: true`).
  - **Resilient Fallback:** Offline/error fallback mode is preserved if credentials fail or network times out.
  - **Interactive Verification UI:** Live testing button in catalog allows judges to execute the SP-API sandbox roundtrip in real time (~660ms).
- **Other Marketplace Adapters:**
  - **Flipkart FMS v3:** Staged ready schema generation.
  - **Meesho:** Upload-ready Supplier Panel bulk CSV generation (no public API exists).
  - **Myntra MMIP:** Partner curation dossier and apparel classification.
  - **Nykaa Fashion:** Curated brand association dossier.

### 3.9. Gamified 2D Dukaan Town Canvas
- **Frontend Component:** [dukaanquest-app/src/components/game/DigitalDukaanCanvas.jsx](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/dukaanquest-app/src/components/game/DigitalDukaanCanvas.jsx)
- **Quest Log:** [dukaanquest-app/src/components/game/QuestLog.jsx](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/dukaanquest-app/src/components/game/QuestLog.jsx)
- **Functionality:**
  - 60 FPS HTML5 Canvas town rendering shop buildings (Shop Counter, Fulfillment Hub, AI Studio, n8n Automation Tower, What-If Observatory).
  - Level progression from **Level 1 (Mohalla Merchant)** to **Level 3 (Digital Vyapari)**.
  - Floating ambient particles and clickable building navigation directly into sub-modules.

---

## 4. File Map & Key Artifacts

```
c:\Users\yadav\OneDrive\Desktop\hacksprint\
├── package.json                         # Root scripts (start, server, client, build)
├── PRD.md                               # Product Requirements Document (Full PRD)
├── HackSprint_Strategy_Blueprint.md     # Strategy, judging rubric, and pitch strategy
├── HackSprint PPT Presentation.pptx     # 7-slide official presentation template
├── PROJECT_STATUS_HANDOFF.md            # (This file) Complete handoff document
│
├── server/                              # Node.js + Express REST Backend
│   ├── index.js                         # Express entrypoint with all routes (port 5000)
│   ├── package.json                     # Backend dependencies (express, cors, multer, etc.)
│   ├── .env                             # Environment variables & sponsor API keys
│   ├── .env.example                     # Example environment template
│   ├── test_api.ps1                     # Automated PowerShell API test script
│   ├── db/
│   │   ├── database.js                  # Atomic JSON read/write persistence helper
│   │   └── database.json                # Persistent state (shop, products, rules, CRM, quests)
│   └── services/
│       ├── geminiService.js             # Multimodal vision & compliance auditor
│       ├── sarvamService.js             # Indic translation engine
│       ├── n8nService.js                # n8n webhook dispatcher & workflow definition
│       ├── paytmService.js              # Payment link, UPI intent & QR generator
│       └── scraperService.js            # Marketplace packaging documentation scraper
│
└── dukaanquest-app/                     # React 19 + Vite Frontend
    ├── index.html                       # HTML shell with Google Fonts
    ├── vite.config.js                   # Vite dev server configuration (proxy to :5000)
    ├── package.json                     # Frontend dependencies
    └── src/
        ├── main.jsx                     # React root mount
        ├── App.jsx                      # Main app shell, navigation, language & XP state
        ├── index.css                    # Design tokens & OLED dark glassmorphism system
        ├── data/
        │   └── mockData.js              # Fallback mock data and translations
        ├── services/
        │   └── api.js                   # Central REST client calling Express backend
        └── components/
            ├── game/
            │   ├── DigitalDukaanCanvas.jsx  # 2D Canvas town visualization
            │   └── QuestLog.jsx             # Active quests & XP reward cards
            ├── readiness/
            │   └── PhysicalReadinessChecker.jsx # Scraper UI & physical packaging checklist
            ├── studio/
            │   └── GeminiPhotoStudio.jsx    # Photo upload & before/after comparison
            ├── catalog/
            │   └── OmnichannelCatalog.jsx   # Multi-platform catalog & CSV exporter
            ├── crm/
            │   └── WhatsAppCRMHub.jsx       # n8n WhatsApp automation & Sarvam templates
            ├── simulator/
            │   └── WhatIfSimulator.jsx      # Tri-strategy unit economics simulator
            └── paytm/
                └── PaytmPaymentHub.jsx      # Payment links, QR & Soundbox player
```

---

## 5. How to Run, Test, and Verify the Project

### 5.1. Starting the Servers

Both servers run concurrently:

**Option A: Dedicated Terminal Windows (Recommended)**
```powershell
# Terminal 1: Backend Server (Port 5000)
cd c:\Users\yadav\OneDrive\Desktop\hacksprint\server
node index.js

# Terminal 2: Frontend Vite Server (Port 5173)
cd c:\Users\yadav\OneDrive\Desktop\hacksprint\dukaanquest-app
npm run dev -- --host 127.0.0.1 --port 5173
```

**Option B: Root NPM Scripts**
```powershell
# From root workspace:
npm run server   # Starts Express backend
npm run client   # Starts Vite frontend
```

### 5.2. Running Automated Backend API Tests
Run the included test script to verify all sponsor microservices:
```powershell
cd c:\Users\yadav\OneDrive\Desktop\hacksprint
powershell -ExecutionPolicy Bypass -File .\server\test_api.ps1
```
**Expected Output:**
```text
✅ Gemini Title: SHREE GANESH Women's Kanjeevaram Pure Silk Saree with Blouse Piece (Maroon Gold)
✅ Gemini Score: 94%
✅ Sarvam Translation: (Hindi/Vernacular translated text returned)
✅ Paytm Link: https://paytm.me/dukaan/sg-...
✅ UPI Intent: upi://pay?pa=PAYTM_MID_984521@paytm...
✅ Amazon Scraped Rules: 4 specifications verified
```

### 5.3. Verifying Production Build
```powershell
npm run build
```
Passes with 0 errors (`✓ built in ~450ms`, ~350 kB bundle).

### 5.4. Testing in Browser
Open Google Chrome at:
👉 **`http://127.0.0.1:5173/`**

---

## 6. What Remains to Be Done (Action Items Before Oct 4 Deadline)

Here is the exact task punch list for incoming agents or developers to take the project across the finish line:

### Priority 1: Hackathon Deliverables (Must-Have for Judging)
- [ ] **Slide Deck Finalization:** Complete the 7 slides in [HackSprint PPT Presentation.pptx](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/HackSprint%20PPT%20Presentation.pptx) based on [HackSprint_Strategy_Blueprint.md](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/HackSprint_Strategy_Blueprint.md):
  - Slide 1: Title & Team ("DukaanQuest — Democratizing Digital Commerce for Bharat Retailers")
  - Slide 2: The Problem (Ramesh-ji's story: counter photos rejected, packaging confusion, return fears)
  - Slide 3: The Solution Architecture & 4 Sponsor Bridges (Gemini, Sarvam, n8n, Paytm)
  - Slide 4: Unique Differentiator: Physical Readiness Scraper & Audited What-If Simulator
  - Slide 5: Tech Stack & System Architecture diagram
  - Slide 6: Business Model, Unit Economics & Market Size (12M Kiranas in India)
  - Slide 7: Live Demo Screenshots & 48-Hour Roadmap
- [ ] **3-Minute Video Pitch Script:** Draft and rehearse the recorded demo video covering:
  - 0:00–0:40: Hook & Real Retailer Pain Point
  - 0:40–1:40: Live Product Walkthrough (Town Canvas → Scraper → Gemini Studio → n8n WhatsApp → Paytm)
  - 1:40–2:30: Financial Simulator & Business Viability
  - 2:30–3:00: Closing, Sponsor shoutouts & Future Vision

### Priority 2: Technical Polish & Enhancements
- [ ] **Live API Keys Injection (Optional):** If real keys for Gemini Pro (`GEMINI_API_KEY`) or Sarvam AI (`SARVAM_API_KEY`) are available, add them to `server/.env`. (Note: The intelligent fallback engine is already 100% operational for seamless offline/local demos).
- [ ] **Live n8n Local Instance (Optional):** If the user wants to demo the live n8n workflow editor during the presentation, launch n8n locally (`npx n8n start` on port 5678) and point webhook to `http://localhost:5678/webhook/dukaanquest-crm`.
- [ ] **Mobile Responsiveness Polish:** Audit and refine smaller screen drawer layouts (<480px width) for mobile viewing.
- [ ] **Speech-to-Text (STT) Audio Input:** Add a microphone icon in the search/catalog bar using Web Speech API or Sarvam STT to allow voice search in Hindi/Tamil.

---

## 7. Guidelines for Collaborating AI Agents

1. **Do Not Break Running Ports:** Always check if port 5000 (backend) or 5173 (frontend) are running before starting duplicate instances.
2. **Preserve Fallback Architecture:** Every backend service has a dual-mode design (Real API with graceful fallback to realistic data). Keep this pattern so the app never crashes during live judge demos.
3. **Deterministic Math over LLM Hallucinations:** Any financial or commission calculation in the simulator must remain deterministic code (not LLM generated on the fly) to maintain credibility with judges.
4. **Use Established Design Tokens:** When styling any new UI component, strictly use the CSS variables defined in [index.css](file:///c:/Users/yadav/OneDrive/Desktop/hacksprint/dukaanquest-app/src/index.css) (`var(--bg-oled)`, `var(--brand-primary)`, `var(--border-subtle)`, `var(--radius-md)`). Do not introduce random ad-hoc colors.
5. **Atomic Commits:** When finishing a milestone, commit cleanly with descriptive messages matching the feature area (e.g. `feat(paytm): ...`, `docs: ...`, `fix(scraper): ...`).
