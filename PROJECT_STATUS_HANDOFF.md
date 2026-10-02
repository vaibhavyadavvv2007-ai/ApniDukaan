# PROJECT STATUS HANDOFF — DukaanQuest

> **Single source of truth for this repository.** A new AI coding agent (or human) with no prior context should read this file first, then Section 24 before touching any code.
>
> **Last Updated:** 2026-10-02 ~22:45 IST
> **Commit inspected:** `a1a2859` ("complete prototype", 2026-10-02 22:34 +0530) — working tree clean at time of writing
> **Verification method:** Every claim below was checked against actual source code, and live runtime calls were made against the running stack (backend `:5000`, n8n `:5678`) on 2026-10-02. Anything that could not be verified is explicitly marked **UNVERIFIED**.

---

## 0. AGENT QUICK START — READ THIS FIRST (60 seconds)

- **Project:** **DukaanQuest** — gamified "digital team in a box" for Indian kirana/saree-shop owners (hackathon prototype, Hack Sprint 2026, PS-21 FinTech).
- **Architecture:** React 19 + Vite SPA (`dukaanquest-app/`, port **5173**) → Vite proxy `/api` → Express 4 API (`server/index.js`, port **5000**) → 8 service modules → external APIs (Gemini, Sarvam, Amazon SP-API sandbox, n8n→Meta WhatsApp, Paytm) + JSON file DB (`server/db/data.json`). n8n self-hosted on port **5678** does the actual WhatsApp sending.
- **Golden Journey (5 steps, in-app banner):** Gemini Photo Studio → Amazon SP-API Catalog → WhatsApp CRM (n8n+Sarvam) → What-If Simulator → Level-Up on the Town Canvas.
- **Integration status (verified live this session):** Gemini text **LIVE** · Sarvam **LIVE** · n8n **LIVE** · Meta WhatsApp **LIVE via n8n** (verified by prior `wamid`, not re-fired today) · Amazon SP-API **SANDBOX** (HTTP 200) · Gemini image gen **STAGED** (HTTP 429, billing) · Paytm **STAGED/FALLBACK** (demo data) · Flipkart/Meesho/Myntra/Nykaa **STAGED/payload-generators only** · Marketplace "scraper" is actually a **static knowledge base** (see §21.2).
- **Critical files:** `server/index.js` (all routes), `server/services/*.js` (one per integration), `dukaanquest-app/src/App.jsx` (shell + state), `dukaanquest-app/src/services/api.js` (all frontend calls), `dukaanquest-app/src/data/mockData.js` (fallback data), `server/db/database.js` (JSON store + seed).
- **Critical commands:** Backend: `npm run server` · Frontend: `npm run client` · Build: `npm run build` (passes, ~383 kB) · E2E script: `powershell -ExecutionPolicy Bypass -File ./server/test_api.ps1` (⚠️ sends a real WhatsApp message).
- **Biggest DON'Ts:** Don't break the 4-tier honesty contract (LIVE/SANDBOX/STAGED/FALLBACK) · Don't fake AI images or financial numbers · Don't rename API contracts · Don't commit `server/.env` · Don't enable Amazon production publishing · Don't remove fallbacks · Don't trust the old docs' claim of a "live scraper" — it returns a curated KB.

---

## 1. Project Identity

| Item | Value | Source |
|---|---|---|
| Project name | **DukaanQuest** | `index.html` title, `App.jsx` header |
| Repository | `dukaan.git` (remote `origin`, branch `main`) | git remote |
| Hackathon | **Hack Sprint 2026** (SDG MIT Bengaluru), **24-hour event**, build window described as 48-hour sprint in docs | `PRD.md`, `HackSprint_Strategy_Blueprint.md` §1, `DUKAANQUEST_MASTER_AGENT_PROMPT.md` |
| Problem statement | **PS-21 — "Democratizing Digital Commerce for Bharat Retailers"**, Track: **FinTech & Smart Commerce** | `PRD.md`, `App.jsx` footer ("Track PS-21") |
| Team size | **CONFLICTING:** Blueprint §31 says `Team size: 4`; pitch template says "1–4 Members" with placeholder names | `HackSprint_Strategy_Blueprint.md`, `HACKSPRINT_3MIN_PITCH_AND_SLIDES.md` |
| Key dates — **CONFLICTING** | `PRD.md`: target delivery **Oct 4, 2026**, screening deadline **Oct 5, 2026 11:50 PM IST**. Blueprint/pitch: event **Oct 17–18, 2026**. `DUKAANQUEST_MASTER_AGENT_PROMPT.md` (line 28) itself instructs: *"Verify event dates/deadlines against the official event website before final submission."* | see §21.7 |
| Current objective | Working demo-safe prototype for judging; shortlist screening is the immediate gate | `HackSprint_Strategy_Blueprint.md` §1 |
| Development stage | Prototype complete (`a1a2859 "complete prototype"`); backend + frontend + 5 live/staged integrations running locally | git log |

---

## 2. One-Paragraph Product Description

DukaanQuest is a **gamified omnichannel growth copilot** for traditional Indian shop owners (the demo persona: "Ramesh-ji" of *Shree Ganesh Matching & Saree Centre*, Gandhi Bazaar, Bengaluru). It gives one owner the digital team a big retailer has: an **AI Photo Studio** (Google Gemini) that turns counter photos into marketplace-compliant catalog assets, a **Physical Readiness checker** with marketplace packaging rules and an interactive XP checklist, an **Omnichannel Catalog transformer** that converts one master SKU into Amazon SP-API / Flipkart FMS / Meesho CSV / Myntra / Nykaa payloads, a **WhatsApp CRM** (n8n + Meta Cloud API + Sarvam AI translations) with human-in-the-loop approval and consent gating, a **Paytm payment hub** (demo/staged), and a **deterministic What-If simulator** comparing three growth strategies — all wrapped in a 2D canvas "town" where completing real business tasks levels the shop up from *Mohalla Merchant* to *Digital Vyapari*.

---

## 3. Problem Being Solved

From `PRD.md` and `HackSprint_Strategy_Blueprint.md` (project's own framing):

- **Target user:** Traditional Indian mom-and-pop retailers ("Mohalla Kiranas & Dukaans"), specifically apparel/saree shops; demo persona Ramesh-ji, 28 years in retail, UPI-enabled, no e-commerce staff.
- **Pain points (documented):**
  1. Marketplace onboarding is physically intimidating: micron-thickness polybags, FNSKU barcode sizes, H-taping, return QC protocols.
  2. Studio photography costs ₹500–₹1,500/SKU; counter photos get rejected by marketplace quality filters.
  3. English-first seller portals alienate vernacular merchants (hence Sarvam Hindi/Kannada/Tamil).
  4. Payments (Paytm/UPI) and customer re-engagement (WhatsApp) live in disconnected tools; repeat-customer revenue leaks.
- **Customer quote driving the product** (`PRD.md`): *"I want to sell my Kanjeevaram sarees on Amazon and notify my regular customers on WhatsApp when new Diwali stock comes, but I don't have an IT team or studio."*

## 4. Product Vision and Positioning

Documented in `HackSprint_Strategy_Blueprint.md` and `HACKSPRINT_3MIN_PITCH_AND_SLIDES.md` (do not invent new positioning):

- **Core positioning:** *"Big retailers have teams for e-commerce, CRM, and marketing. Small retailers have one owner. DukaanQuest gives that owner the team."*
- **Alternate taglines in repo:** *"The local retailer doesn't lack products. He lacks the digital team to sell them."* · *"From Mohalla Merchant to Digital Vyapari"* · *"Create once. Transform everywhere."* (catalog) · *"Code calculates. AI explains."* (simulator).
- **Differentiation (per blueprint):** (a) physical/packaging readiness layer no other demo has, (b) honest 4-tier integration classification instead of fake-live claims, (c) deterministic audited financial math instead of LLM-generated numbers, (d) one master SKU → 5 marketplace payloads.

## 5. Target User / Real-World Validation

| Category | Content |
|---|---|
| **VERIFIED (in repo)** | Demo persona "Ramesh Kumar Yadav", *Shree Ganesh Matching & Saree Centre*, Gandhi Bazaar, Bengaluru, 28 years in offline retail, ₹1,48,500 monthly offline revenue, 184 registered customers (`server/db/database.js` seed + `mockData.js`). Blueprint §"Unknown information that must be validated through interview" lists open questions. |
| **ASSUMPTION** | That the persona's shop data is real (or at least representative). All shop/product/customer records in the app are demo data (§17). |
| **UNKNOWN / needs validation** | Whether a real merchant interview happened; real commission/return-rate figures for the persona's category; actual WhatsApp opt-in rates. Blueprint explicitly marks these as pre-event interview items. |

---

## 6. Complete Product Feature Map

| # | Feature | Frontend | Backend | External | Status (verified) | Real vs Simulated | Notes / Limitations |
|---|---|---|---|---|---|---|---|
| 1 | 2D Town canvas + quest gamification | `components/game/DigitalDukaanCanvas.jsx`, `QuestLog.jsx` | `GET/POST /api/quests`, `PUT /api/shop/xp` | none | WORKING | Local simulation; XP persists to JSON DB (when calls succeed) | Canvas building labels use a hardcoded `shopProfile` fallback (§21.9) |
| 2 | Physical Readiness checklist | `components/readiness/PhysicalReadinessChecker.jsx` | `GET /api/readiness`, `POST /api/readiness/toggle`, `GET /api/readiness/scrape` | none (see scraper) | WORKING | Checklist real; "scrape" is a **static KB** (§21.2) | XP rewards + confetti; print modal is static text |
| 3 | Gemini Photo Studio (text/attributes) | `components/studio/GeminiPhotoStudio.jsx` | `POST /api/studio/upload`, `/enhance`, `/extract-attributes` → `geminiService.extractCatalogAttributes` | Gemini `gemini-3.1-flash-lite` | **LIVE** (HTTP 200, ~3.0 s measured) | Real AI for titles/bullets/compliance | Falls back to hardcoded saree analysis if key missing/error |
| 4 | Gemini Photo Studio (image gen) | same, split-slider + asset tabs | `POST /api/studio/generate-image` → `geminiService.generateOrTransformProductImage` | Gemini `gemini-3.1-flash-image` | **STAGED** (HTTP 429 quota=0, billing required — measured) | Displayed images are curated Unsplash URLs, clearly labeled "staged catalog asset" | Never fakes AI output; auto-upgrades when billing enabled |
| 5 | Omnichannel catalog transform | `components/catalog/OmnichannelCatalog.jsx` | `GET /api/catalog/transform/:productId` → `marketplaceAdapters.js` | none | WORKING (local transform) | Deterministic payload generation | Amazon payload is real SP-API schema; others are format emulations |
| 6 | Amazon SP-API sandbox verify + Listings POC | same file (4-step wizard UI) | `GET /api/amazon/verify-sandbox`, `/product-types`, `/product-type-definition`, `POST /api/amazon/listings/put`, `/listings/export` → `amazonService.js`, `amazonListingsService.js` | `api.amazon.com` LWA + `sandbox.sellingpartnerapi-eu.amazon.com` | **SANDBOX VERIFIED** (HTTP 200, ~1.4 s measured) | Real OAuth2 + authenticated sandbox GET; sandbox PUT usually falls back to export-ready JSON | Production publishing hard-blocked (`productionPublishingBlocked: true`) |
| 7 | WhatsApp CRM broadcast | `components/crm/WhatsAppCRMHub.jsx` | `POST /api/crm/broadcast` → `n8nService.dispatchN8NWebhook` | n8n `:5678` → Meta WhatsApp Cloud API | n8n **LIVE**; WhatsApp delivery **verified previously via `wamid`** (`API_INTEGRATION_STATUS.md`); Express-side classified STAGED because Meta creds live inside n8n, not in `server/.env` | Real dispatch when n8n up; `staged-fallback` payload otherwise | Consent gate (DPDP 2023), merchant approval modal, E.164 normalization |
| 8 | Sarvam Indic translation | navbar `select` in `App.jsx` + CRM preview | `POST /api/sarvam/translate` (`/stt`, `/tts` also exist) → `sarvamService.js` | `api.sarvam.ai` `mayura:v1` | **LIVE** (694 ms measured) | Real translation; curated dictionary fallback for en/hi/kn/ta | STT/TTS endpoints exist; STT/TTS **not exercised from UI** — STT returns simulated transcript when live fails |
| 9 | Paytm payments hub | `components/paytm/PaytmPaymentHub.jsx` | `POST /api/paytm/create-link`, `GET /api/paytm/status/:orderId` → `paytmService.js` | Paytm staging (only if real key provided) | **STAGED/FALLBACK** (measured: demo data) | 100% demo (`[DEMO LINK]`, `DEMO QR`, simulated Soundbox text) | Zero-code upgrade hook: set `PAYTM_MERCHANT_KEY` |
| 10 | What-If simulator | `components/simulator/WhatIfSimulator.jsx` | none (pure frontend math) | none | WORKING | Deterministic formulas with `[Sourced]`/`[Demo Assumption]`/`[Benchmark]` labels | `targetRevenue` slider is display-only (§21.10) |
| 11 | Health/status dashboard | tier bar in `App.jsx` header | `GET /api/health` | probes all | WORKING (server side) | Real probes for Gemini/Sarvam/n8n/Amazon; Paytm hardcoded FALLBACK | ⚠️ frontend `health.status === 'ok'` check never passes (§21.1) |
| 12 | Voice search / STT in UI | — | `POST /api/sarvam/stt` exists | Sarvam `saaras:v4` | **NOT IMPLEMENTED in UI** (backend endpoint ready) | — | Listed in old handoff as TODO; no mic button exists |

---

## 7. Current End-to-End User Journey ("Golden Journey")

The 5-step journey is hard-coded into the UI banner in `App.jsx` (each chip navigates to the tab). Exact flow:

**Step 1 — Photo Studio (Gemini Vision)**
- **Action:** Open *Gemini AI Studio* tab → optionally *Upload Photo* → click *Re-Enhance with Gemini*.
- **Frontend:** `GeminiPhotoStudio.jsx` → `api.uploadAndEnhanceImage()` (multipart) or `api.enhanceImageWithGemini()` (context-only).
- **Backend:** `POST /api/studio/upload|enhance` → `analyzeAndEnhanceImage()` runs Path A (text) and Path B (image) in parallel.
- **External:** Gemini `generateContent` × 2 models.
- **Expected:** `pathStatuses.textExtraction.status = "LIVE"`; split slider + 4 asset tabs show curated images labeled staged; AI analysis panel with SEO title, bullets, compliance score.
- **On failure:** Path A falls back to a hardcoded Kanjeevaram analysis (`mode:"offline-fallback"`); upload errors fall back to `handleRunGemini()`, then to a local default analysis object (`apiStatus='bridge'`).
- **Verified:** ✅ live call 200 OK (~3.0 s), liveAPI:true.

**Step 2 — Master SKU & Amazon SP-API Sandbox**
- **Action:** *Catalog Transformer* tab → pick product/type → *Submit to SP-API Sandbox (PUT)*.
- **Frontend:** `OmnichannelCatalog.jsx` (auto-runs `verifyAmazonSandbox()` + `fetchAmazonProductTypes('SAREE')` on mount).
- **Backend:** `GET /api/catalog/transform/prod-001`, `GET /api/amazon/*`, `POST /api/amazon/listings/put`.
- **External:** LWA token exchange → sandbox `GET /sellers/v1/marketplaceParticipations`, `PUT /listings/2021-08-01/items/...`.
- **Expected:** Green "SP-API Sandbox Verified" pill; 11-attribute validation matrix; PUT usually returns export-fallback JSON (`status` ≠ `ACCEPTED`) → UI shows "Export-Ready Payload Generated".
- **On failure:** Every Amazon service returns fallback objects (`sandbox-staged-fallback` / `export-fallback`); UI shows amber badges, never crashes.
- **Verified:** ✅ verify-sandbox HTTP 200 (1,435 ms), verified:true, productionPublishingBlocked:true.

**Step 3 — WhatsApp CRM & Sarvam Indic**
- **Action:** *n8n WhatsApp CRM* tab → pick segment → adjust discount → review Sarvam-translated preview → *Broadcast* → approval modal → *Yes, Authorize Broadcast*.
- **Frontend:** `WhatsAppCRMHub.jsx` → `api.dispatchCampaign()`.
- **Backend:** `POST /api/crm/broadcast` → `dispatchN8NWebhook()` (consent filter, E.164 normalize, Meta template payload) → POST to `N8N_WEBHOOK_URL` (falls back to `/webhook-test/...` on 404).
- **External:** n8n workflow → Meta WhatsApp Cloud API (`hello_world` template, `en_US`).
- **Expected:** `liveDeliveryConfirmed: true` + `whatsappMessageId` (`wamid.…`); UI shows wamid badge; dispatch grants +40 XP.
- **On failure:** `staged-fallback` mode with full payload preview; UI catch-block fabricates a success-looking result object with `mode:'staged-fallback'` (demo-safe).
- **Verified:** n8n healthz 200 this session. **Real message delivery NOT re-fired this session** (avoids sending a live WhatsApp); prior evidence: `wamid.HBgMOTE4NDI5MjQ2MDY3FQIAERgSNkJENjkzMkI2MTE3MTExQ0RCAA==` recorded in `API_INTEGRATION_STATUS.md`.

**Step 4 — What-If Simulator**
- **Action:** *What-If Simulator* tab → move sliders → compare Strategy A/B/C → click *"Adopt Strategy B & Complete Quest"*.
- **Frontend:** `WhatIfSimulator.jsx` (all math local, §16).
- **Backend/External:** none.
- **Expected:** Three strategy cards with net profit/margin/payback; B marked ★ Recommended; clicking B triggers `onCompleteJourney` → +100 XP, all quests completed, level forced to 3, confetti, jump to Town.
- **On failure:** N/A (pure client math).
- **Verified:** ✅ code-read; formulas deterministic.

**Step 5 — Town Upgrade & Level 3**
- **Action:** Land back on *Town & Copilot*; XP bar ≥600 → header reads "Digital Vyapari".
- **Frontend:** `App.jsx` `addXp()` (confetti at level-up), `DigitalDukaanCanvas.jsx` re-renders (but see §21.9 — canvas subtitle stays "Mohalla Merchant" due to fallback constant).
- **Backend:** `PUT /api/shop/xp` fires per XP add (fire-and-forget; silent `.catch`).
- **On failure:** XP calls are swallowed; UI state still updates locally.
- **Verified:** ✅ code-read.

---

## 8. Architecture

```
┌──────────────────────────── Browser ────────────────────────────┐
│  React 19 SPA (Vite dev :5173, host 127.0.0.1)                  │
│  App.jsx (shell, tabs, XP/lang state)                           │
│  └─ components/{game,readiness,studio,catalog,crm,simulator,paytm}│
│  api.js  ── fetch('/api/…') ──► (Vite proxy in vite.config.js)  │
└──────────────────────────────┬──────────────────────────────────┘
                               ▼ /api (proxied to :5000)
┌──────────────────── Express 4 (server/index.js, :5000) ─────────┐
│ CORS · JSON 25mb · Multer memory 25MB                           │
│ db/database.js  ◄── server/db/data.json (git-tracked!)          │
│ services/                                                       │
│  geminiService ──► generativelanguage.googleapis.com (2 models) │
│  sarvamService ──► api.sarvam.ai (mayura/saaras/bulbul)         │
│  n8nService ────► http://localhost:5678/webhook/dukaanquest-crm │
│       └─ also reads ~/.n8n/database.sqlite for wamid receipts   │
│  paytmService ──► (demo; securegw-stage.paytm.in if real key)   │
│  amazonService + amazonListingsService ──► api.amazon.com (LWA) │
│  marketplaceAdapters (pure functions)                           │
│  scraperService (static KB; axios/cheerio imported, unused)     │
└─────────────────────────────────────────────────────────────────┘
                               ▼
        n8n self-hosted (:5678, data in ~/.n8n) ──► Meta WhatsApp Cloud API
```

```mermaid
flowchart LR
  subgraph FE["React SPA :5173"]
    UI[Components] --> API[api.js]
  end
  API -->|/api proxy| EX["Express :5000"]
  EX --> DB[(server/db/data.json)]
  EX --> G[Gemini API]
  EX --> S[Sarvam API]
  EX --> A[Amazon SP-API Sandbox]
  EX --> N[n8n :5678]
  N --> W[Meta WhatsApp Cloud API]
  EX --> P[Paytm adapter - demo]
  EX -.static KB.-> SC[scraperService]
```

- **Data flow:** Frontend always calls `/api/*` (same-origin via Vite proxy → no CORS issues in dev; CORS middleware exists for direct :5000 access).
- **Authentication flow:** None for users (no login). Integration auth = API keys in `server/.env` (Gemini query param, Sarvam header, Amazon LWA OAuth2 with in-memory token cache, n8n unauthenticated local webhook).
- **Fallback flow (universal pattern):** every service tries live → on error/missing key returns a `success:true` payload with `mode:"offline-fallback"` (or `staged-fallback`/`live-quota-limited`) and realistic content, so the demo never crashes. Health endpoint reflects real state.
- **State:** Frontend keeps everything in React state seeded from `mockData.js`; backend JSON store is source-of-truth for shop/products/customers/readiness/quests but **the initial sync is currently dead** (§21.1) — so mock data wins in practice at startup.

## 9. Tech Stack

| Technology | Version | Where | Why |
|---|---|---|---|
| React | ^19.2.8 | `dukaanquest-app/src` | UI framework |
| Vite | ^8.3.0 (build ran 8.3.2) | frontend build/dev | fast dev server + `/api` proxy to :5000 |
| oxlint | ^1.81.0 | `npm run lint` (frontend) | linting (not part of CI) |
| lucide-react / canvas-confetti | ^1.49.0 / ^1.9.4 | all components | icons / celebration effects |
| Vanilla CSS design tokens | — | `dukaanquest-app/src/index.css` | OLED dark glassmorphism system (`--brand-primary:#6366f1`, `--bg-base:#030712`, fonts Outfit/Inter/Fira Code) |
| Node.js + Express | ^4.21.2 | `server/` | REST API (single file `index.js`, 497 lines) |
| Multer | ^1.4.5-lts.1 | `server/index.js` | 25 MB memory-buffer image upload |
| Axios | ^1.7.9 | all services | outbound HTTP |
| Cheerio | ^1.0.0 | `scraperService.js` (imported, **unused**) | originally intended for scraping |
| dotenv | ^16.4.7 | `server/index.js` | loads `server/.env` with explicit path resolution |
| node:sqlite (Node built-in) | Node ≥22 required | `n8nService.getLatestMetaMessageId()` | reads n8n's SQLite for wamid; silently no-ops if unavailable |
| JSON file store | — | `server/db/data.json` | zero-dependency persistence (atomic-ish writeFileSync) |
| n8n (self-hosted) | version UNKNOWN (not in repo) | port 5678 | workflow automation → Meta WhatsApp |
| Google Gemini API | models `gemini-3.1-flash-lite` (text), `gemini-3.1-flash-image` (image) | geminiService | attribute extraction / image generation |
| Sarvam AI | `mayura:v1` translate, `saaras:v4` STT, `bulbul:v3` TTS | sarvamService | Indic language support |
| Amazon SP-API | Listings Items v2021-08-01, Definitions v2020-09-01 | amazon* services | sandbox catalog POC |
| Meta WhatsApp Cloud API | via n8n | n8n instance | template messages |
| Testing | `server/test_api.ps1` (PowerShell E2E) + manual curl | — | no unit test framework exists |
| Deployment | **None** — local only | — | everything runs on localhost |

## 10. Repository Structure

```
├── package.json                      Root workspace scripts (start/server/client/build/preview) — SAFE
├── package-lock.json                 Root lockfile ("hacksprint" workspace)
├── PRD.md                            Product requirements, persona, dates — read-only reference
├── HackSprint_Strategy_Blueprint.md  Strategy, rubric, 24h execution plan, positioning — read-only reference
├── HACKSPRINT_3MIN_PITCH_AND_SLIDES.md  Pitch script + slide mapping — read-only reference
├── DUKAANQUEST_MASTER_AGENT_PROMPT.md   2000-line operating manual for AI agents — read-only reference
├── API_INTEGRATION_STATUS.md         Older integration audit (partially outdated vs code — see §21.4/21.5)
├── PROJECT_STATUS_HANDOFF.md         THIS FILE
├── HackSprint PPT Presentation.pptx  Official slide template (binary)
├── CLAUDE.md / .claude/ .agents/ .claude-flow/ .planning/ .swarm/ .impeccable/ .mcp.json
│                                     AI-assistant scaffolding committed in a1a2859 — NOT app code; ignore
├── server/
│   ├── index.js                      ALL routes (~370 lines of logic). Single entry. — CORE
│   ├── package.json                  express/cors/multer/axios/cheerio/dotenv
│   ├── .env                          REAL SECRETS — git-ignored (verified). NEVER print/commit.
│   ├── .env.example                  Template with var names + model defaults — safe to read
│   ├── test_api.ps1                  E2E verification script (hits all endpoints; sends real WhatsApp)
│   ├── db/
│   │   ├── database.js               loadDB/saveDB + full seed data (products/customers/rules/quests) — CORE
│   │   └── data.json                 RUNTIME STATE — committed to git (quirk, §21.3)
│   └── services/                     one module per integration — CORE (see §12 for each)
└── dukaanquest-app/
    ├── index.html                    Fonts (Outfit/Inter/Fira Code), meta
    ├── vite.config.js                port 5173, host 127.0.0.1, /api proxy → :5000 — CORE
    └── src/
        ├── main.jsx                  React root
        ├── App.jsx                   Shell: 7 tabs, XP/level state, language switcher, tier bar, journey banner — CORE
        ├── index.css                 Design tokens (CSS custom properties) — styling contract
        ├── services/api.js           Every fetch the frontend makes (192 lines) — CORE CONTRACT
        ├── data/mockData.js          Fallback shop/products/customers/quests + UI translations (en/hi/kn/ta) — CORE
        └── components/               8 feature components (§6) — CORE
```

## 11. Frontend Architecture

- **App shell:** `App.jsx` holds `activeTab` (7 tabs: town/readiness/studio/catalog/crm/simulator/paytm), `currentLang` (en/hi/kn/ta), and state for profile/xp/level/rules/quests/customers/products initialized from `mockData.js`. No router — tab switching by state. No state library.
- **Backend sync:** one `useEffect` on mount calls `fetchHealth()`, then (if `health.status === 'ok'`) loads shop/rules/quests/customers/products. **This condition is currently always false** (§21.1), so the app effectively runs on mock data for reads; write-paths (`updateShopXp`, `toggleReadinessTask`, `completeQuest`) are fire-and-forget with `.catch(() => {})`.
- **API communication:** all calls live in `services/api.js`; relative `/api` paths (proxy).
- **Loading/error states:** each component has local `isProcessing/isScraping/isDispatching` states; errors are caught and replaced with realistic fallback objects (see CRM catch-block). Confetti marks successes.
- **Language layer:** static translation dict in `mockData.js` (`languageTranslations`) for nav/labels; dynamic message translation via Sarvam only inside the CRM hub.
- **Canvas game:** `DigitalDukaanCanvas.jsx` — `requestAnimationFrame` render loop (particles, dashed beams, pulsing lights), `roundRect` glass buildings, click hit-areas map screen quadrants → tabs. Dependencies: level/xp/readinessProgress props; re-init on prop change (full effect re-run, incl. `devicePixelRatio` scaling).
- **UI assumptions:** segment counts in CRM buttons are hardcoded strings ("All Customers (184)" etc.) and do not match the actual 5 mock / 3 DB customers (§21.8).

## 12. Backend Architecture

- **Entry:** `server/index.js` — Express app; explicit dotenv path (`path.resolve(__dirname, '.env')`) with startup warnings for empty `GEMINI_API_KEY`/`SARVAM_API_KEY`; CORS; 25 MB JSON/urlencoded; Multer memory storage.
- **Routes:** all inline in `index.js` (no router modules). **Services:** `geminiService`, `sarvamService`, `n8nService`, `paytmService`, `amazonService`, `amazonListingsService`, `marketplaceAdapters`, `scraperService`. **Persistence:** `db/database.js` (`loadDB` seeds + caches nothing — reads file every call; `saveDB` writes pretty JSON).
- **Error handling pattern:** every service try/catches external calls and returns `success:true` fallback payloads with a `mode` field; `/api/health` probes services live and computes a 4-tier tally.

### Endpoint Table (all routes in `server/index.js`)

| Method | Endpoint | Purpose | Request | Response (key fields) | External Service | Verified status |
|---|---|---|---|---|---|---|
| GET | `/api/health` | 4-tier classification of 11 integrations | — | `overall`, `overallStatus`, `integrationSummary`, `services{}` | probes Gemini/Sarvam/n8n/Amazon | ✅ 200, "PARTIAL (3 LIVE, 1 SANDBOX, 6 STAGED, 1 FALLBACK)" |
| POST | `/api/reload-env` | re-read `server/.env` without restart | — | `geminiKeyConfigured`, `sarvamKeyConfigured` | — | code-read (not fired this session) |
| GET | `/api/shop` | merchant profile | — | shopProfile object | JSON DB | ✅ |
| PUT | `/api/shop/xp` | add XP; auto level-3 at 600 | `{xpToAdd}` | updated shopProfile | JSON DB | ✅ code-read |
| GET | `/api/products` | list products | — | products[] | JSON DB | ✅ |
| POST | `/api/products` | add product | product body | 201 + product | JSON DB | code-read |
| GET | `/api/catalog/transform/:productId` | 5-platform payload transform | — | `{platforms:{amazon,flipkart,meesho,myntra,nykaa}}` | none | ✅ |
| POST | `/api/catalog/transform` | transform posted product | product body | same | none | code-read |
| GET | `/api/amazon/verify-sandbox` | LWA + sandbox GET | — | `verified`, `statusCode`, `credentialAudit` (masked), `safeguard` | LWA + SP-API sandbox | ✅ **HTTP 200, verified:true (1.4 s)** |
| GET | `/api/amazon/product-types` | search product types | `?keywords=` | `productTypes[]`, `mode` | SP-API sandbox (fallback: local list) | ✅ (fallback path returns 5 types) |
| GET | `/api/amazon/product-type-definition` | schema for type | `?productType=` | schema or reference attributes | SP-API sandbox (fallback: local schema) | ✅ |
| POST | `/api/amazon/listings/put` | sandbox listing PUT | `{masterProduct, sellerId, sku}` | `mode:"sandbox"` or `"export-fallback"` | SP-API sandbox | code-read; sandbox write usually unsupported → export |
| POST | `/api/amazon/listings/export` | build JSON_LISTINGS_FEED | `{masterProduct}` | `exportReadyPayload` | none | code-read |
| GET | `/api/readiness` | packaging checklists | — | readinessRules | JSON DB | ✅ |
| POST | `/api/readiness/toggle` | set item completed | `{platform,taskId,completed}` | `{success, readinessRules}` | JSON DB | ✅ |
| GET | `/api/readiness/scrape` | packaging specs | `?platform=&category=` | `{specs[], sourceUrl, lastScraped, returnsProtocol}` | **none — static KB** (§21.2) | ✅ (returns KB) |
| POST | `/api/studio/upload` | multipart photo → dual-path analysis | multipart `image` + `productContext` | analysis + `pathStatuses` | Gemini (2 models) | ✅ (via /enhance) |
| POST | `/api/studio/enhance` | base64 photo → dual-path analysis | `{imageBase64, productContext}` | analysis + `pathStatuses` | Gemini | ✅ code-read |
| POST | `/api/studio/extract-attributes` | Path A only | `{imageBase64?, productContext}` | `analysis{productTitle, amazonBullets, complianceScore…}` | Gemini flash-lite | ✅ **liveAPI:true (3.0 s)** |
| POST | `/api/studio/generate-image` | Path B only | `{imageBase64?, prompt?, transformationType}` | `image` (live) or `fallbackImage` + `apiHttpStatus` | Gemini flash-image | ✅ **429 → staged** |
| GET | `/api/crm/customers` | customer list | — | customers[] (with marketingOptIn) | JSON DB | ✅ |
| POST | `/api/crm/broadcast` | dispatch campaign via n8n | `{recipients[], templateText, paymentLink, merchantApproved}` | `liveDeliveryConfirmed`, `whatsappMessageId`, `mode`, `classification`, `stagedPayloadPreview` | n8n → Meta WhatsApp | ✅ n8n live; **delivery not re-fired this session** (see §7 step 3) |
| GET | `/api/crm/n8n-workflow` | static workflow definition JSON | — | `{nodes[], connections}` | none | ✅ |
| GET | `/api/crm/template-status` | active WhatsApp template config | — | `activeTemplate:"hello_world"`, `metaReviewStatus:"SUBMITTED_UNDER_REVIEW"` | none | ✅ |
| POST | `/api/sarvam/translate` | translate text | `{text, targetLanguage}` | `translatedText`, `liveAPI`, `latencyMs` | Sarvam mayura:v1 | ✅ **liveAPI:true (694 ms)** |
| POST | `/api/sarvam/stt` | speech-to-text | `{audioBase64, languageCode}` | `transcript` (or simulated fallback) | Sarvam saaras:v4 | code-read; **live path UNVERIFIED** |
| POST | `/api/sarvam/tts` | text-to-speech | `{text, targetLanguage}` | `audioBase64` or fallback note | Sarvam bulbul:v3 | code-read; **live path UNVERIFIED** |
| POST | `/api/paytm/create-link` | payment link + QR + soundbox text | `{amount, customerName, orderId?, notes?}` | `status:"STAGED/FALLBACK"`, `paymentLink`, `qrData`, `soundbox` | Paytm staging only if real key | ✅ demo path |
| GET | `/api/paytm/status/:orderId` | simulated status | — | `paymentStatus:"DEMO_SUCCESS"`, `settlementTime:"T+0 Instant"` | none | code-read |
| GET | `/api/quests` | quest list | — | quests[] | JSON DB | ✅ |
| POST | `/api/quests/complete` | mark quest done | `{questId}` | `{success, quests}` | JSON DB | ✅ |

## 13. Integration Matrix

| Integration | Purpose | Implementation | Status | Verification Evidence | Limitation |
|---|---|---|---|---|---|
| **Google Gemini — text/vision** (`gemini-3.1-flash-lite`) | SEO title, bullets, fabric classification, compliance score | `geminiService.extractCatalogAttributes` (REST `generateContent`, `response_mime_type:application/json`, temp 0.2) | 🟢 **LIVE** | This session: HTTP 200, `liveAPI:true`, 2953 ms; health probe `LIVE_VERIFIED` | Hardcoded saree fallback if key missing; 15 s timeout |
| **Google Gemini — image gen** (`gemini-3.1-flash-image`) | hero/white-background/lifestyle/macro images | `geminiService.generateOrTransformProductImage` | 🟡 **STAGED** (quota) | This session: HTTP **429** `RESOURCE_EXHAUSTED` → `mode:"live-quota-limited"`, curated Unsplash asset returned | Needs GCP pay-as-you-go billing; returns Unsplash URL until then |
| **Sarvam AI — translate** (`mayura:v1`) | UI copy + CRM preview translation (hi/kn/ta) | `sarvamService.translateIndicText` | 🟢 **LIVE** | This session: HTTP 200, 694 ms, correct Hindi output | Curated dictionary fallback; `en` short-circuits |
| **Sarvam AI — STT/TTS** (`saaras:v4`/`bulbul:v3`) | voice search / voice notes | `sarvamService.transcribeSpeech/synthesizeSpeech` | 🟠 **STAGED** (endpoints live-coded, no UI consumer; live path UNVERIFIED) | No live call made this session | No mic UI; STT fallback returns a scripted Hindi transcript |
| **n8n webhook hub** (`:5678`) | campaign orchestration | `n8nService.dispatchN8NWebhook` → POST webhook (+ `/webhook-test/…` retry on 404); `getN8NHealth` probes `/healthz` | 🟢 **LIVE** | This session: `/healthz` → HTTP 200; health `LIVE_VERIFIED` | Local-only; no auth on webhook; `N8N_WEBHOOK_SECRET` defined but **unused in code** |
| **Meta WhatsApp Cloud API** (via n8n) | template broadcast (`hello_world` → custom `dukaanquest_new_arrival` pending Meta review) | n8n node sends template; Express extracts `wamid` from response or n8n SQLite | 🟢 **LIVE (verified previously)** / Express-side labeled STAGED (no `WHATSAPP_ACCESS_TOKEN` in `server/.env` — creds live in n8n) | Prior evidence: `wamid.HBgMOTE4NDI5MjQ2MDY3FQIA…` in `API_INTEGRATION_STATUS.md`; **not re-fired today** to avoid a real send | Custom template still under Meta review; template body params only injected for non-`hello_world` |
| **Amazon SP-API — auth** (LWA OAuth2) | sandbox access token | `amazonService.getLwaAccessToken` (in-memory cache, 2-min guard) | 🟢 **SANDBOX** | This session: token exchange OK; masked client `amzn1.ap...19e1` | Tokens never logged unmasked; sandbox tokens only |
| **Amazon SP-API — Sellers/Definitions/Listings** | marketplace verification + listing POC | `amazonService.verifySandboxCredentials`, `amazonListingsService.*` (host `sandbox.sellingpartnerapi-eu.amazon.com`, marketplace `A21TJRUUN4KGV`) | 🟢 **SANDBOX** | This session: `GET /sellers/v1/marketplaceParticipations` → HTTP 200, 1435 ms | Sandbox PUT commonly unsupported → export-fallback JSON; production publishing hard-blocked |
| **Paytm** (payment links/UPI/Soundbox) | checkout + QR + voice confirmation | `paytmService` (HMAC-SHA256 checksum helper; `securegw-stage.paytm.in` only when `PAYTM_MERCHANT_KEY` set and not demo) | 🟡 **STAGED/FALLBACK** (by directive: health classification hard-coded `FALLBACK`, "Never LIVE") | This session: demo payload returned, `dashboardKeyStatus:"KEY_GENERATION_UNAVAILABLE_ON_DASHBOARD"` | Real staging call code exists but untested (no key); test script expects `$paytm.notice` which doesn't exist top-level (blank line, §21.6) |
| **Flipkart FMS v3** | listing payload | `FlipkartAdapter.transform` (pure function) | 🟡 **STAGED** (schema gen only) | transform endpoint ✅ | No API credentials; partner registration "72h window" (claimed in docs, UNVERIFIED) |
| **Meesho** | bulk catalog upload | `MeeshoAdapter.transform` → Supplier Panel CSV; frontend CSV download | 🟡 **UPLOAD READY** (file gen only) | transform ✅ | No public API exists (by design); CSV correctness UNVERIFIED against real panel |
| **Myntra MMIP** | partner catalog submission | `MyntraAdapter.transform` | 🟡 **STAGED** (dossier only) | transform ✅ | No credentials; onboarding flow external |
| **Nykaa Fashion** | brand dossier | `NykaaAdapter.transform` | 🟡 **ELIGIBILITY WORKFLOW** | transform ✅ | Curated-brand model; no API |
| **Marketplace docs "scraper"** | packaging rules | `scraperService.scrapeMarketplaceSpecs` | 🟠 **STATIC KB (misleading name)** | Returns `documentationKB` literal; `axios`/`cheerio` imported but never called | No live scraping happens despite UI button "Scrape Live Marketplace Specs" (§21.2) |
| **Google Fonts** (Outfit/Inter/Fira Code) | typography | `index.html` `<link>` | 🟢 live CDN | — | Offline demo would lose brand fonts (fallback fonts render) |
| **Unsplash images** | curated product/hero photos | hardcoded URLs in mockData/DB/gemini fallbacks | 🟢 live CDN | — | Requires internet; hotlinked |

## 14. API / Credential Configuration

> **Secrets must remain in `server/.env` / credential storage and must never be committed.** `server/.env` is verified git-ignored (`.gitignore` line 2) and **not** tracked. Only variable **names** are documented here — never values.

Variables present in the actual `server/.env` (names verified by key-listing only): `PORT`, `GEMINI_API_KEY`, `SARVAM_API_KEY`, `N8N_WEBHOOK_URL`, `PAYTM_MID`, `PAYTM_KEY`, `PAYTM_MERCHANT_KEY`, `PAYTM_ENVIRONMENT`, `WHATSAPP_TEMPLATE_NAME`, `WHATSAPP_TEMPLATE_LANG`, `WHATSAPP_CUSTOM_TEMPLATE_NAME`, `AMAZON_LWA_CLIENT_ID`, `AMAZON_LWA_CLIENT_SECRET`, `AMAZON_SANDBOX_REFRESH_TOKEN`.

All variables (superset, from `.env.example` + code reads):

| Variable | Used for | Consumed by | Required? |
|---|---|---|---|
| `PORT` | backend port (default 5000) | `index.js` | optional |
| `GEMINI_API_KEY` | Gemini text+image calls | geminiService (query param) | **required for LIVE studio**; absent → fallback |
| `GEMINI_TEXT_MODEL` | text model override (default `gemini-3.1-flash-lite`) | geminiService | optional |
| `GEMINI_IMAGE_MODEL` | image model override (default `gemini-3.1-flash-image`) | geminiService | optional |
| `GEMINI_MODEL` | legacy alias for text model | geminiService | optional |
| `SARVAM_API_KEY` | translate/STT/TTS | sarvamService (header `api-subscription-key`) | **required for LIVE translation** |
| `N8N_BASE_URL` | documented in .env.example | **not referenced in code** | unused |
| `N8N_WEBHOOK_URL` | CRM dispatch target (default `http://localhost:5678/webhook/dukaanquest-crm`) | n8nService | required for live WhatsApp flow |
| `N8N_WEBHOOK_SECRET` | documented | **not referenced in code** | unused |
| `WHATSAPP_ACCESS_TOKEN` | gates `/api/health` whatsapp classification (LIVE vs STAGED) | index.js health check only | not set locally (creds live in n8n) |
| `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_WABA_ID`, `WHATSAPP_VERIFY_TOKEN` | documented for direct Meta API | **not referenced in server code** (used inside n8n) | unused by Express |
| `WHATSAPP_TEMPLATE_NAME` | active template (default `hello_world`) | n8nService | optional |
| `WHATSAPP_TEMPLATE_LANG` | template language (default `en_US`) | n8nService | optional |
| `WHATSAPP_CUSTOM_TEMPLATE_NAME` | pending custom template (default `dukaanquest_new_arrival`) | n8nService | optional |
| `PAYTM_MID` | merchant id shown in demo payloads/QR | paytmService | optional (default `PAYTM_MID_984521`) |
| `PAYTM_KEY`, `PAYTM_MERCHANT_KEY` | real staging key → enables live staging call; demo placeholders are detected & ignored | paytmService (`hasRealStagingKey` guard rejects values containing "demo") | optional |
| `PAYTM_ENVIRONMENT` | `PRODUCTION` vs staging endpoint selection | paytmService | optional |
| `PAYTM_WEBSITE`, `PAYTM_CALLBACK_URL` | documented | **not referenced in code** | unused |
| `AMAZON_LWA_CLIENT_ID` / `AMAZON_CLIENT_ID` | LWA app id | amazonService | **required for sandbox** |
| `AMAZON_LWA_CLIENT_SECRET` / `AMAZON_CLIENT_SECRET` | LWA secret | amazonService | **required for sandbox** |
| `AMAZON_SANDBOX_REFRESH_TOKEN` / `AMAZON_REFRESH_TOKEN` | LWA refresh token | amazonService | **required for sandbox** |
| `AMAZON_REGION`, `AMAZON_MARKETPLACE_ID`, `AMAZON_APP_ID` | documented | marketplace id is hard-coded `A21TJRUUN4KGV` in listings service; others **not referenced** | unused |
| `FLIPKART_CLIENT_ID/SECRET`, `FLIPKART_REDIRECT_URI` | future FMS API | **not referenced in code** | unused (staged) |

Required for **local startup with all LIVE features**: `GEMINI_API_KEY`, `SARVAM_API_KEY`, `N8N_WEBHOOK_URL` (+ running n8n), Amazon LWA trio. Everything degrades gracefully if any are missing.

## 15. Data Models

Persistent store `server/db/data.json` (schema defined by seed in `server/db/database.js`):

- **shopProfile**: `shopName` (string), `ownerName`, `location`, `category`, `level` (1–3), `levelTitle`, `currentXp` (number), `nextLevelXp` (600), `streakDays`, `monthlyOfflineRevenue` (₹ number). Level-up rule: `currentXp >= 600 && level < 3 → level 3, "Digital Vyapari"`.
- **products[]**: `id` (`prod-001`), `title`, `sku`, `category`, `basePrice` (₹4850), `mrp`, `material`/`fabric` (⚠️ adapters read `masterProduct.fabric`, DB stores `material` — mapping gap), `colors[]`, `stockCount`, `description`, `images{raw, amazonMain, myntraLifestyle, fabricDetail, dimensionGraphic}` (Unsplash URLs), `platformListings{amazon{title,bullets[],keywords}, flipkart{title,keyFeatures[]}, myntra{title,curationNotes}}`.
- **customers[]**: `id`, `name`, `phone` (display format `+91 98450 12345` — normalized to E.164 at dispatch), `tags[]`, `totalSpend`, `language` (`kn/hi/ta`), `marketingOptIn` (boolean, DB only), `optInDate`. **Frontend mockData customers lack `marketingOptIn`** — the CRM hub defaults them to opted-in (`c.marketingOptIn !== false`).
- **readinessRules**: map `amazon|flipkart|myntra` → `{name, checklist[{id, title, mandatory, completed, xpReward}]}` (DB seed lacks the `spec`/`category` fields the UI renders — only in mockData).
- **quests[]**: `{id, title, xp, completed}` (DB) — frontend mock adds `category`, `desc`, `building`, `badge`.
- **Transient response objects**: broadcast result (`liveDeliveryConfirmed`, `whatsappMessageId`, `classification`, `stagedPayloadPreview`), Paytm link (`paymentLink`, `qrData.upiString`, `soundbox.announcementText`), Amazon verification (`verified`, `statusCode`, `credentialAudit.masked*`), studio result (`pathStatuses{}`, `analysis{}`, `imageAsset`).

## 16. Deterministic Business Logic (What-If Simulator)

All in `WhatIfSimulator.jsx` — pure frontend, no LLM, no backend. Inputs: `budget` (₹3,000–50,000), `targetRevenue` (display-only), `customerCount` (50–800). Assumption labels are shown inline: `[Sourced]`, `[Demo Assumption]`, `[Benchmark]`.

| Item | Formula | Classification |
|---|---|---|
| A. Gross sales | `budget × 3.4` | Demo assumption (inventory turnover) |
| A. Commission | `gross × marketplaceFeePct%` (default 17.5, user-adjustable) | Sourced (Amazon apparel rate card claim) |
| A. Shipping | `(gross / 2200) × ₹110` | Empirical benchmark (₹110/500 g parcel) |
| A. Returns risk | `gross × returnRiskPct% × 0.4` (default 14%) | Benchmark (Redseer apparel returns claim) + 40% value-loss demo assumption |
| A. Payback | fixed 26 days | Demo assumption |
| B. Conversion | `customerCount × 24%` | Demo assumption (repeat shoppers) |
| B. Gross sales | `conversions × ₹1,850 AOV` | Demo assumption |
| B. Broadcast cost | `customerCount × ₹0.85` | Sourced (Meta WhatsApp marketing conversation rate claim) |
| B. COGS | `conversions × ₹1,050` | Demo assumption (weaver procurement) |
| B. Payback | 2 days | Benchmark (instant UPI claim) |
| C. Gross sales | `budget × 2.6` (ROAS) | Demo assumption |
| C. COGS | `gross × 48%` | Demo assumption |
| C. Payback | 6 days | Demo assumption |

**These are labeled demo assumptions, not real-world guarantees.** XP/quest logic: checklist XP per item (20–50), quests 40–75, broadcast +40, simulator complete +100; level 3 at 600 XP (client and server each compute independently — minor drift possible).

## 17. Mock / Demo / Fallback Inventory

| Item | Type | Where | Behavior | To make fully live |
|---|---|---|---|---|
| Studio text-attributes fallback | Hardcoded analysis | `geminiService.extractCatalogAttributes` catch/no-key branch | Returns realistic Kanjeevaram analysis, `mode:"offline-fallback"` | Valid `GEMINI_API_KEY` |
| Studio image "staged asset" | Curated Unsplash URL | `geminiService.generateOrTransformProductImage` + DB `images.*` | Labeled staged; real 429 reason surfaced | Enable GCP billing for image model |
| Gemini health "LIVE" claim | Derived | `getGeminiHealth` | Text probe must answer; image probe 429 counts as "live-authenticated" | — |
| Sarvam dictionary fallback | Curated translations (hi/kn/ta) | `sarvamService.translateIndicText` bottom | Fixed sentence set, `mode:"offline-fallback"` | Valid `SARVAM_API_KEY` |
| Sarvam STT fallback | Scripted transcript | `transcribeSpeech` | Returns fixed Hindi sentence, "Simulated" note | Valid key + audio |
| Paytm everything | Demo data contract | `paytmService` | `[DEMO LINK]`, `DEMO QR`, simulated Soundbox, `DEMO_SUCCESS` status | `PAYTM_MERCHANT_KEY` (real, non-demo) → staging endpoint auto-activates; **health classification stays FALLBACK by design** |
| Amazon product-types/definition fallback | Reference data | `amazonListingsService._fallback*` | Sandbox endpoints unsupported/absent → local catalog & schema | n/a (works as designed) |
| Amazon listings PUT fallback | Export payload | `putListingsItem` catch → `_exportFallback` | JSON_LISTINGS_FEED + manual upload instructions | Production-authorized seller + Feeds API |
| WhatsApp staged-fallback | Full payload preview | `n8nService.dispatchN8NWebhook` + CRM catch-block | `mode:"staged-fallback"`; UI still shows success styling | n8n running + Meta token validity |
| Marketplace "scraper" | **Entire feature is static** | `scraperService.documentationKB` | Returns KB with `lastScraped: now`; no network call | Implement real scraping (cheerio is already a dependency) |
| Marketplace adapters (Flipkart/Meesho/Myntra/Nykaa) | Payload generators | `marketplaceAdapters.js` | Deterministic transforms; no network | Credentials/partnerships per platform |
| Product/customer/shop/quest data | Demo dataset | `mockData.js` (frontend) + `database.js` seed (backend) | Frontend currently always starts from mock (§21.1) | Fix health-status check + keep DB in sync |
| CRM segment counts | Hardcoded strings | `WhatsAppCRMHub.jsx` buttons | "All Customers (184)" etc. don't reflect list length | Compute from data |
| Soundbox audio | Text-only simulation | `PaytmPaymentHub.handleTriggerSoundbox` | Shows Hindi text + confetti; old docs' "real audio chime" NOT present in current code (only text banner) | Real audio file / TTS |
| Canvas level title | Hardcoded fallback | module-level `shopProfile` in `DigitalDukaanCanvas.jsx` | Building sub always "Mohalla Merchant" | Pass profile prop |
| n8n workflow definition served by API | Static JSON | `getN8NWorkflowDefinition` | UI diagram; mirrors intended workflow, not read from live n8n | Fetch live via n8n API |
| Open/delivery rates ("88%", "100%") | Fabricated display metrics | n8nService response + UI | Labeled "Estimated" | Real analytics |

## 18. Testing & Verification

- **Build (this session):** `npm run build` → ✅ `vite v8.3.2`, 1898 modules, `dist/assets/index-*.js` **382.87 kB (gzip 109.37 kB)**, built in 566 ms. No typecheck configured (plain JS); `npm run lint` (oxlint) exists but was **not run** as part of verification.
- **Backend unit tests:** none exist. Only the PowerShell E2E script.
- **E2E script:** `powershell -ExecutionPolicy Bypass -File ./server/test_api.ps1` — hits health, studio (both paths), Sarvam, Paytm, Amazon (verify + types + definition + PUT), template-status, **crm/broadcast (⚠️ sends a real WhatsApp message)**, transform, scrape. **Not executed this session** to avoid a live WhatsApp send; individual read-only endpoints were verified via curl instead (results in §6/§12/§13).
- **Manual verification this session (all ✅):** health tally `3 LIVE, 1 SANDBOX, 6 STAGED, 1 FALLBACK`; Gemini text live (200, 2.95 s); Gemini image 429 staged; Sarvam live (694 ms); Amazon sandbox verified (200, 1.44 s, productionPublishingBlocked); Paytm staged demo; n8n healthz 200; transform + scrape OK; template `hello_world` active / custom `SUBMITTED_UNDER_REVIEW`.
- **Known intermittent:** Gemini image quota (persistent 429, not intermittent); external latencies vary (2.8–5.8 s for Gemini text historically).

## 19. Current Runtime

| Process | URL / Port | Start command | Order |
|---|---|---|---|
| n8n (external prerequisite) | `http://localhost:5678` (healthz `/healthz`) | started separately (e.g. `npx n8n` or desktop) — **not managed by repo** | first |
| Express backend | `http://127.0.0.1:5000` | `npm run server` (root) or `cd server && node index.js` | second |
| Vite frontend | `http://127.0.0.1:5173` (host fixed in vite.config) | `npm run client` (root) or `cd dukaanquest-app && npm run dev` | third |
| Health probe | `GET http://127.0.0.1:5000/api/health` | — | verify last |

At time of writing **all three were already running** (backend :5000 responding, n8n :5678 healthz 200). Frontend proxies `/api` → `http://localhost:5000` (`vite.config.js`). Do not start duplicate instances on 5000/5173.

## 20. Security Rules (project-specific)

1. `server/.env` holds real keys (Gemini, Sarvam, Amazon LWA, template names). It is git-ignored — **never** commit, print, or paste its contents. `.env.example` contains names only.
2. Amazon LWA client secret & refresh token are masked in every response/log (`maskCredential` → `amzn1.ap...19e1` style). Preserve masking.
3. Amazon production publishing is deliberately disarmed (`productionPublishingBlocked: true`, sandbox host only). Do not "fix" this.
4. WhatsApp broadcast requires: merchant approval flag, DPDP-2023 consent filter (`marketingOptIn !== false`), opt-out notice text, E.164 normalization. Preserve all four.
5. `N8N_WEBHOOK_SECRET` exists in `.env.example` but is **not enforced in code** — webhook is unauthenticated on localhost. Do not expose the backend publicly without adding auth.
6. No user PII beyond demo customer records; do not add real customer data to committed files (`server/db/data.json` is git-tracked — keep demo-only).
7. Never echo env values into API responses (current code only returns booleans/masked values — keep it that way).

## 21. Known Issues (verified)

| # | Issue | Severity | Workaround | Root cause | Do not break |
|---|---|---|---|---|---|
| 21.1 | **Frontend backend-sync dead:** `App.jsx` checks `health.status === 'ok'`, but `/api/health` returns `overall`/`overallStatus` and has **no top-level `status` key** (verified via live call: keys = overall, overallStatus, app, version, timestamp, integrationSummary, services). So `backendOnline` is always false, header shows "Local Engine", and the initial shop/rules/quests/customers/products load never runs. | High (cosmetic + stale data; demo unaffected because mock data fills in; write-syncs still work) | None needed for demo. Real fix = check `health.overall` — **but then DB records (missing `spec`, `feeRate`, `logoColor`, `marketingOptIn` fields, only 3 customers) will render differently than mockData** (§15). Fix data parity in the same change. | Contract drift between health response and App.jsx | Keep both sides working if you fix it |
| 21.2 | **"Live scrape" is not scraping:** `scraperService.scrapeMarketplaceSpecs` returns a hardcoded `documentationKB`; `axios`/`cheerio` imported but unused; UI button says "⚡ Scrape Live Marketplace Specs" and panel says "Live Scraped Seller Specs"; `lastScraped` is set to now. Docs (`PRD`, old handoff) claim live web scraping. | Medium (honesty risk in judging Q&A) | Presentation framing: "curated marketplace rules engine" | Never implemented; name/UX oversells | Don't claim it scrapes live; don't rename endpoint |
| 21.3 | `server/db/data.json` (runtime state) is **git-tracked**; every run mutates committed state. | Low | Commit only intentionally | No `.gitignore` entry for it | Don't accidentally commit sensitive data into it |
| 21.4 | Old docs reference `server/db/database.json`; actual file is `server/db/data.json`. | Info | Use this doc | Doc drift | n/a |
| 21.5 | `API_INTEGRATION_STATUS.md` sample health JSON (v1 schema, `status:"ok"`, `"overall":"operational"`) is outdated vs v2 code (`overallStatus`, integrationSummary). Its WhatsApp wamid evidence is still the only delivery proof on file. | Info | Trust code + this doc | Doc drift | Keep the wamid reference |
| 21.6 | `test_api.ps1` prints `$paytm.notice`, but `createPaymentLink` has no top-level `notice` (it's `metadata.demoDataNotice`) → blank line in output. | Low | Ignore blank | Contract drift in test script | n/a |
| 21.7 | **Hackathon dates conflict** across docs: PRD (delivery Oct 4 / screening Oct 5) vs Blueprint & Pitch (event Oct 17–18). Master prompt says verify against official site. | Medium (planning) | Confirm with organizers | Stale docs | n/a |
| 21.8 | CRM segment buttons hardcode counts (184/42/38/104) while actual lists have 5 (mock) or 3 (DB) customers; broadcast count reflects the real filtered list. | Low | Cosmetic | Hardcoded strings | n/a |
| 21.9 | Canvas building subtitle uses module-level fallback constant → always "Mohalla Merchant" even at Level 3 (header shows "Digital Vyapari" correctly). | Low | Cosmetic | Fallback object not wired to props | n/a |
| 21.10 | Simulator `targetRevenue` slider is display-only — no calculation consumes it. | Low | None | Dead input | Removing it changes UI (avoid in freeze) |
| 21.11 | Paytm health `classification` is hard-coded `'FALLBACK'` in `/api/health` ("Never LIVE per user directive") even if a real staging key is later added (create-link would do a real staging call while health still says FALLBACK). | Info | Intentional per directive | Explicit code comment | Keep the directive unless owner changes it |
| 21.12 | `n8nService.getLatestMetaMessageId()` reads `~/.n8n/database.sqlite` via `node:sqlite` — needs Node ≥22; silently no-ops otherwise (then wamid only from direct response). | Low | n8n response usually carries wamid | Env-dependent | Keep try/catch |

## 22. Intentional Design Decisions (do not casually reverse)

1. **4-tier honesty system** (LIVE/SANDBOX/STAGED/FALLBACK) with real probes in `/api/health` — the suite is never labeled "verified" when anything is FALLBACK. Reason: credibility with judges; master prompt §1698 "prevents the team from lying to itself."
2. **Staged image generation instead of fake AI images.** When quota blocks the image model, the app shows curated assets *and says so* (`isAIGenerated:false`, `quotaNote`). Never label an Unsplash image as AI output.
3. **Deterministic simulator math** — "Code calculates. AI explains." LLMs never compute financials. Reason: auditability; assumption values are labeled `[Demo Assumption]`/`[Sourced]`/`[Benchmark]`.
4. **Amazon sandbox-only** with masked credentials and blocked production publishing. Reason: no unauthorized marketplace writes.
5. **Paytm STAGED/FALLBACK by directive** (comment: "Never LIVE per user directive") with a zero-code upgrade hook (`PAYTM_MERCHANT_KEY`). Reason: dashboard key generation unavailable; demo must not block.
6. **One master product → 5 platform payloads** (`transformMasterProduct`). All marketplace flows derive from the same record.
7. **Approved-template requirement:** only Meta-approved templates (`hello_world` now; `dukaanquest_new_arrival` pending). Switching is env-only (`WHATSAPP_TEMPLATE_NAME`), no code change.
8. **Human-in-the-loop + consent gating** on every broadcast (approval modal server-side flag + client filter + opt-out text).
9. **Universal fallback pattern:** every service returns `success:true` with a `mode` discriminator instead of throwing — the demo cannot crash from an external outage.
10. **Explicit dotenv path** (`server/index.js` resolves `.env` relative to the file, not cwd) — fixing a past bug where keys loaded empty. Don't revert to bare `dotenv.config()`.
11. **JSON file store instead of a real DB** — deliberate for the 48-hour window (master prompt §1216).

## 23. “DO NOT BREAK” CONTRACT

A future agent MUST preserve:

1. **Endpoint contracts** — all 31 routes in §12, especially: `/api/health` shape consumed by `test_api.ps1`; `pathStatuses.textExtraction/imageGeneration` consumed by the Studio; `liveDeliveryConfirmed`/`whatsappMessageId` consumed by the CRM UI; Paytm response fields consumed by `PaytmPaymentHub`.
2. **Environment variable names** in §14 (`.env.example` is the reference). Renames break `.env`, docs, and the reload-env flow.
3. **The working Gemini text flow** (`gemini-3.1-flash-lite`, JSON `response_mime_type`, prompt shape) and the **dual-model separation** (never use flash-lite for images).
4. **The working Sarvam flow** (`mayura:v1`, `en-IN`→`{lang}-IN`, `api-subscription-key` header) and the dictionary fallback for en/hi/kn/ta.
5. **The working Amazon sandbox flow** (LWA token exchange → `sandbox.sellingpartnerapi-eu.amazon.com` → masked audit) and its fallbacks.
6. **The working n8n/WhatsApp flow** (webhook path `dukaanquest-crm`, `/webhook-test/…` retry, wamid extraction, `staged-fallback` mode, consent filter).
7. **Simulator formulas & labels** (§16) — deterministic, labeled assumptions.
8. **Game progression** (XP thresholds, quest XP, level-3 rule in both `App.jsx` and `PUT /api/shop/xp`).
9. **Fallback behavior everywhere** (§17) — no removal without explicit owner request.
10. **Frontend routes/components** — the 7 tabs and the 5-step journey banner are the demo script; the Golden Flow next-step buttons chain Studio→Catalog→CRM→Simulator→Town.
11. **Design token system** (`dukaanquest-app/src/index.css` custom properties) — no ad-hoc colors.
12. **Vite proxy** (`/api` → `localhost:5000`) and ports 5000/5173/5678.
13. **Security invariants** (§20): masking, production block, consent gate, `.env` ignored.

## 24. Safe Modification Rules for Future AI Agents

**BEFORE modifying anything:**
1. Read this file (esp. §21, §22, §23).
2. Inspect the existing implementation of the area you're changing — verify behavior in code, not in docs (this repo's docs have drifted: §21.2, §21.4, §21.5).
3. Identify all consumers: `services/api.js` (frontend), `test_api.ps1`, health payload, cross-service imports (`amazonListingsService` imports from `amazonService`).

**WHEN modifying:**
4. Make the smallest possible change; keep files focused (`server/index.js` is at 497 lines — do not grow it casually).
5. Do not rewrite working integrations; extend via the existing fallback-pattern (`success:true` + `mode`).
6. Do not rename API contracts/env vars without updating every consumer (frontend, test script, docs).
7. Never replace a real integration with a mock, and never mock-up a "live" result.
8. Never remove fallbacks unless explicitly requested.
9. Never expose secrets in code, logs, responses, or docs.
10. Preserve UI honesty labels (badges, `[Demo Assumption]`, staged notes).

**AFTER modifying:**
11. Run `npm run build` (must pass) and, if backend changed, restart it and re-run safe endpoint checks (avoid `POST /api/crm/broadcast` unless a live WhatsApp send is explicitly authorized).
12. Update this file (Last Updated stamp, §21, §13 statuses) and record what changed in the commit message.

## 25. Current Git State

- **Branch:** `main`, up to date with `origin/main` (pushed).
- **HEAD:** `a1a2859` "complete prototype" (2026-10-02 22:34 +0530). Working tree **clean** at inspection time.
- **History (oldest→newest):** `d51b557` docs(gsd) init → `681434b` feat(ui) app shell + canvas + 6 engines → `bfa37ce` feat(backend) Express+services → `2898a6a` feat(n8n-whatsapp) Meta hello_world → `17e48f7` feat(paytm) STAGED/FALLBACK → `17ac90f` feat(amazon-spapi) sandbox → `a1a2859` complete prototype.
- **Secrets:** `server/.env` is ignored (verified via `git check-ignore`) and untracked. **`server/db/data.json` is tracked** (runtime DB — see §21.3).
- **Committed in `a1a2859`:** all app code + AI-assistant scaffolding dirs (`.agents/`, `.claude/`, `.claude-flow/`, `.planning/`, `.swarm/`, `.impeccable/`, `.mcp.json`) + the PPTX. These scaffolding dirs are **not** application code.

## 26. Current Demo Script (2–3 minutes)

| # | Click | Audience sees | Proves | Say | If it fails (backup) |
|---|---|---|---|---|---|
| 0 | Land on Town tab | Neon canvas town, XP bar (420/600), tier bar: Gemini LIVE · Sarvam LIVE · WhatsApp/n8n LIVE · Amazon SANDBOX · Paytm FALLBACK | Honesty-first design | "Every badge is real — the health endpoint probes each API live." | Badges are static text; nothing can fail |
| 1 | Journey chip 1 → Studio → *Re-Enhance with Gemini* (optionally upload a photo first) | Processing banner → AI analysis (SEO title, bullets, compliance score) + before/after split slider | **Live Gemini vision** | "One counter photo becomes a compliant catalog in under 6 seconds." | Fallback analysis still renders (bridge mode); keep talking — data identical in shape |
| 2 | Journey chip 2 → Catalog → *Submit to SP-API Sandbox (PUT)* | Validation matrix 11/11 PASS → sandbox result card + payload JSON | **Live authenticated Amazon sandbox roundtrip** (~1.4 s) | "Real LWA OAuth, real sandbox host — production publishing is deliberately disarmed." | Export-fallback still shows the compliant payload |
| 3 | Journey chip 3 → CRM → pick VIP → *Broadcast* → *Yes, Authorize Broadcast* | Sarvam-translated preview (switch navbar language to हिंदी/ಕನ್ನಡ/தமிழ் first for effect) → dispatch result with wamid | **Live n8n → Meta WhatsApp + Sarvam** | "The merchant approves; consent and DPDP compliance are enforced in code." | `staged-fallback` result still renders with payload preview |
| 4 | Journey chip 4 → Simulator → drag budget → *Adopt Strategy B* | 3 strategy cards, B recommended (2-day payback), confetti, Level 3 "Digital Vyapari" | Deterministic audited math | "Code calculates, AI explains — every number is labeled sourced or assumption." | Cannot fail (pure client math) |
| 5 | Auto-return to Town | Level 3, all quests complete, confetti | Gamified retention loop | "From Mohalla Merchant to Digital Vyapari." | Canvas subtitle stays "Mohalla Merchant" (known cosmetic issue §21.9) |

**Pre-demo checklist:** backend :5000 + frontend :5173 + n8n :5678 running; `GET /api/health` shows 3 LIVE; Chrome at `http://127.0.0.1:5173/`.

## 27. Remaining Work

### Critical before submission
1. Resolve the **dates/team conflicts** (§1/§21.7) against the official event site; finalize slide deck + team names in `HackSprint PPT Presentation.pptx` using `HACKSPRINT_3MIN_PITCH_AND_SLIDES.md`.
2. Rehearse the §26 demo once end-to-end with n8n running (this is the only flow that can externally fail).
3. Decide whether to fix §21.1 (health-status contract). If fixed, also fix DB/mock data parity (§15) in the same commit — or deliberately defer and note it.

### Nice to have
4. Mobile responsiveness pass (<480 px drawer/nav overflow).
5. Rename the scraper button/labels to match reality ("Marketplace Rules Engine") or implement real scraping (cheerio is already installed).
6. Fix cosmetic issues §21.6, §21.8, §21.9, §21.10.
7. Voice-search UI consuming the existing `/api/sarvam/stt` endpoint.

### Post-hackathon production work
8. Real database (Postgres/Mongo) replacing the JSON store; real auth; deployment (nothing is deployed).
9. Enable Gemini image billing → image path flips to LIVE with zero code changes.
10. Flipkart/Meesho/Myntra credential onboarding; Amazon production authorization via Feeds API.
11. Enforce `N8N_WEBHOOK_SECRET`; move WhatsApp creds handling into a proper backend-owned sending layer.
12. Real opt-in management UI (currently opt-in is seed data only).

## 28. Future Roadmap (architecture-consistent only)

- Multi-product masters (DB already supports an array; adapters are per-product functions).
- Actual n8n workflow import/export via n8n REST API instead of the static definition endpoint.
- WhatsApp interactive buttons/list messages once `dukaanquest_new_arrival` is approved (body params are already wired in `dispatchN8NWebhook`).
- Streaming simulator "what-if" sharing (export strategy as image/PDF) — pure frontend.
- Marketplace scraper becoming real (fetch + cheerio + per-platform selectors, cached in the KB structure that already exists).

## 29. Handoff Summary

- **Project health:** Good for a prototype. Build green; all three processes ran without intervention; backend honest-status system works as designed.
- **Working (verified):** Express API (31 routes), Gemini text LIVE, Sarvam LIVE, n8n LIVE, Amazon SP-API sandbox verified, catalog transforms, quest/XP loop, simulator, Paytm demo, health contract, frontend build.
- **Staged:** Gemini image (429/billing), WhatsApp custom template (Meta review), Paytm (no staging keys), Flipkart/Myntra/Nykaa (payload generators), STT/TTS (no UI).
- **Incomplete:** real scraping (static KB), initial backend→frontend data sync (§21.1), unit tests, deployment, voice UI.
- **Current priority:** hackathon submission package (slides + rehearsed demo) — not engineering changes.
- **Biggest risks:** (1) judging questions about the "live scrape" wording; (2) §21.1 contract drift discovered by a curious judge; (3) external API failure mid-demo (mitigated by fallbacks); (4) date confusion (Oct 4 vs Oct 17–18).
- **Next recommended engineering action:** if any code change is authorized, fix §21.1 **together with** DB/mock data parity, then `npm run build` + full endpoint smoke test + update this file.

---

*End of handoff. When in doubt: the code is the truth; this file tells you where to look and what not to touch.*
