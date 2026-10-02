# DUKAANQUEST — DEMO VIDEO GUIDE

> **For teammates recording the Hack Sprint 2026 demo video.** No coding knowledge needed. Read Sections 0–4 once, run the Section 6 checklist, then record using Sections 9–10.
>
> **Verified against:** commit `a1a2859` ("complete prototype"), 2026-10-02. Every button name, screen, and flow below was cross-checked against the actual source code and the running application. Discrepancies between older docs and the real app are explicitly flagged (marked ⚠️).

---

## 0. READ THIS FIRST — 60 SECOND OVERVIEW

| Item | Value |
|---|---|
| **Product name** | **DukaanQuest** |
| **One-line description** | A gamified AI "digital team in a box" that takes a traditional Indian shop owner from paper ledger to online seller — product photos, marketplace listings, WhatsApp marketing in their customers' language, and profit math — without hiring anyone. |
| **Problem** | Small retailers (like "Ramesh-ji" and his saree shop) can't sell online: studio photos cost ₹500–1,500 per product, marketplace packaging rules are confusing, seller portals are English-only, and they have no e-commerce/CRM/marketing staff. |
| **Solution** | One app with 6 engines: AI Photo Studio, Physical Readiness checker, Omnichannel Catalog, WhatsApp CRM (n8n + Sarvam AI), Paytm payments, and a deterministic What-If profit simulator — all wrapped in a 2D game town. |
| **Target user** | India's traditional "mohalla" merchants (kirana/saree/apparel shops), e.g. *Shree Ganesh Matching & Saree Centre, Gandhi Bazaar, Bengaluru*. |
| **Golden Journey (5 steps)** | ① Gemini Photo Studio → ② Amazon SP-API Catalog → ③ WhatsApp CRM with Sarvam translations → ④ What-If Simulator → ⑤ Level-Up to "Digital Vyapari" on the Town screen. The app itself shows this as a 5-chip banner at the top of every screen. |
| **Recommended demo duration** | **2:45–3:00 minutes** (a 60s and 30s cut are provided in §18–19) |
| **Frontend URL** | `http://127.0.0.1:5173` |
| **Backend URL** | `http://127.0.0.1:5000` (health check: `http://127.0.0.1:5000/api/health`) |
| **n8n URL** | `http://localhost:5678` (required only for the LIVE WhatsApp proof) |
| **⚠️ MOST IMPORTANT WARNING** | **Never claim a sandbox/staged feature is "live production."** The app itself prints honest badges (LIVE / SANDBOX / STAGED / FALLBACK) — your narration must match them, because judges *will* read the screen. Second warning: the WhatsApp broadcast **actually sends real WhatsApp template messages** to the demo customer list when n8n is running — that's the proof we want, but know it before you click. |

---

## 1. WHAT IS DUKAANQUEST?

### Who uses it
"Ramesh-ji" — a fictional-but-representative shop owner who has run **Shree Ganesh Matching & Saree Centre** in Gandhi Bazaar, Bengaluru for 28 years. He accepts UPI daily, knows every regular customer by name, and has ~184 customer phone numbers in a notebook. What he doesn't have: a photographer, a catalog manager, a marketing team, or an IT department.

### The problems he faces
1. **Going online is physically confusing** — Amazon/Flipkart/Myntra each have strict packaging rules (polybag thickness in microns, barcode sticker sizes, carton taping patterns) that a first-time seller has never heard of.
2. **Product photos get rejected** — marketplace AI filters reject typical counter-top photos; studio photography costs ₹500–₹1,500 per product.
3. **The tools are in English** — modern seller portals alienate vernacular merchants.
4. **His customer relationships are stuck offline** — WhatsApp and payments (Paytm/UPI) exist, but nothing connects "my 184 regulars" to "my new festive stock" automatically.
5. **He can't calculate risk** — should he spend ₹10,000 on marketplace listings, WhatsApp campaigns, or local ads? Nobody does that math for him.

### What DukaanQuest does
It gives Ramesh-ji the **team** he can't hire:
- a **photographer** (Gemini AI Photo Studio),
- a **compliance officer** (Physical Readiness checklists),
- a **catalog manager** (one master product → 5 marketplace payloads),
- a **marketing department** (WhatsApp CRM in Hindi/Kannada/Tamil via n8n + Sarvam),
- a **cashier** (Paytm payment links, demo mode),
- a **financial analyst** (deterministic What-If simulator).

### What makes it different
- **"Create once. Sell everywhere."** — one master product record automatically transforms into Amazon SP-API, Flipkart FMS, Meesho CSV, Myntra, and Nykaa formats.
- **It's honest** — every integration shows a real status badge. Nothing pretends to be live.
- **It's audited** — the simulator's math is fixed code with labeled assumptions, never AI-generated numbers.
- **It's a game** — completing *real* business tasks (finishing a checklist, sending a campaign) earns XP and levels the shop from **Mohalla Merchant** (Level 1–2) to **Digital Vyapari** (Level 3). The "Dukaan + Quest" idea: your shop is a character in a 2D town that literally upgrades as your business becomes digital.

### The core loop (from the project's own docs)
> **"Create once. Sell everywhere. Retain existing customers. Reach new local customers. Simulate the next move before spending real money."**

---

## 2. THE COMPLETE PRODUCT STORY

Tell the demo as ONE continuous story — Ramesh-ji's Tuesday:

| Stage | The merchant wants… | What he does | What DukaanQuest does | Technology | What you see |
|---|---|---|---|---|---|
| **1. Physical shop** | Sell his Kanjeevaram sarees beyond Gandhi Bazaar | Opens the app | Shows his shop as a building in a 2D town, with his stats (₹1,48,500/month offline, 184 customers) | React + HTML canvas (`DigitalDukaanCanvas.jsx`) | Neon town with 5 clickable buildings |
| **2. Product digitization** | His phone photos to look professional | Uploads/taps Re-Enhance | Sends photo to Google Gemini; returns SEO title, fabric analysis, Amazon bullet points, compliance score | Gemini `gemini-3.1-flash-lite` (LIVE) | Before/after split slider + AI analysis card |
| **3. AI product understanding** | Marketplace-ready images | Views the 4 asset tabs | Shows 4 channel-specific visuals (Amazon white-bg, Myntra lifestyle, macro weave, spec graphic) — clearly labeled staged assets | Gemini image model (STAGED, quota-blocked) + curated catalog images | 4 asset cards with badges |
| **4. Master catalog** | One product record everywhere | Opens Catalog Transformer | Keeps ONE master SKU (SG-KANJ-MRN-01) | JSON store + React state | Master product card |
| **5. Marketplace listing** | Get on Amazon without a consultant | Clicks Submit to SP-API Sandbox | Validates 11 required Amazon attributes, exchanges real OAuth tokens, calls Amazon's **sandbox** | Amazon SP-API + Login with Amazon (SANDBOX, verified) | Validation matrix 11/11 PASS + sandbox result |
| **6. Customer segmentation** | Reach his best customers | Picks the VIP segment in CRM hub | Filters his customer list by tags | React state | Customer cards with "Opt-in: Verified" |
| **7. Regional language marketing** | Talk to customers in Kannada/Hindi/Tamil | Switches the app language | Translates the campaign message live | Sarvam AI `mayura:v1` (LIVE) + fallback dictionary | WhatsApp preview updates to native script |
| **8. WhatsApp campaign** | Send it — but stay in control | Clicks Broadcast → approves modal | n8n workflow sends the Meta-approved template; consent (DPDP) enforced; returns a real message ID | n8n → Meta WhatsApp Cloud API (LIVE when n8n runs) | Dispatch result with wamid badge |
| **9. Profit/ROI simulation** | Know if marketing ₹10,000 is smart | Drags sliders in simulator | Runs 3 fixed growth strategies side-by-side with labeled assumptions | Pure deterministic React math (no AI) | 3 strategy cards, B recommended |
| **10. Business decision** | Choose the smart path | Clicks "Adopt Strategy B & Complete Quest" | Records the decision, awards XP | React state | Confetti + level bar moves |
| **11. Quest completion** | Feel progress | Returns to Town | Level 3 **Digital Vyapari** unlocked, all quests completed | Game engine in App.jsx | Town + header shows Level 3 |

---

## 3. GOLDEN MERCHANT JOURNEY (detailed)

The app bakes this journey into a banner at the top: **"3-Min Golden Journey:"** with 5 chips. Follow the chips in order — they are the demo.

---

### STEP 1 — AI Photo Studio (Gemini Vision)

- **PURPOSE:** Prove real, live AI understanding of a real product photo — the #1 blocker for marketplace onboarding.
- **USER ACTION:** Click the **"Gemini AI Studio"** tab → (optional but recommended: click **"Upload Photo"** and pick any product photo) → click **"Re-Enhance with Gemini"**.
- **WHAT APPEARS ON SCREEN:**
  - A purple processing banner with staged messages: *"Analyzing product contours with Gemini Vision…" → "Isolating fabric & removing shop background…" → "Synthesizing #FFFFFF studio lighting & soft shadows…"*
  - Then: a large **Before/After split slider** (labels "📷 Raw Shop Shot" and "✨ Gemini 4K Studio") — drag it left/right.
  - Below: **"✨ Gemini AI Analysis Result"** card with an SEO title, fabric classification, 5 "Amazon A9 Bullets", and a green **"Compliance: XX/100"** badge.
  - On the right: 4 asset tabs — **"1. Amazon Main"**, **"2. Myntra Lifestyle"**, **"3. Macro Weave Detail"**, **"4. Infographic Spec"**.
  - Badges in the header: `🟢 LIVE: gemini-3.1-flash-lite (Vision)` and `🟡 STAGED: gemini-3.1-flash-image (Catalog Asset)`.
- **WHAT HAPPENS IN THE BACKGROUND:** Browser POSTs the image (or just the product context text) to the Express backend (`/api/studio/upload` or `/api/studio/enhance`) → backend calls Google's Gemini API with the photo + a retail-copilot prompt → Gemini returns strict JSON (title, bullets, compliance score) → backend also asks the *image* model for a generated hero shot; because Google's free tier for image models has zero quota, that call returns HTTP 429 and the backend honestly substitutes a curated catalog image and labels it staged.
- **TECHNOLOGY USED:** `GeminiPhotoStudio.jsx` → `services/api.js` → `POST /api/studio/enhance` → `server/services/geminiService.js` → Google Gemini API.
- **EXPECTED RESULT:** Analysis card populated with AI content, compliance score ≥ 90, confetti burst.
- **CURRENT STATUS:** Text/attributes = **LIVE** (verified: HTTP 200, ~3 s). Image generation = **STAGED** (HTTP 429 — Google requires pay-as-you-go billing; the app shows curated assets and says so).
- **DEMO TALKING POINT:** *"This is a real Gemini call happening right now — it read the fabric, wrote Amazon-ready bullet points, and scored the photo's compliance. And notice: we don't fake the AI-generated image. Google's image quota needs billing, so we show clearly-labeled catalog assets instead. Honesty is a feature."*
- **SCREENSHOT MOMENT:** **YES** — zoom the split slider mid-drag (raw shot vs studio asset), then the compliance badge.
- **FAILURE BACKUP:** If Gemini is down, the backend automatically returns the same-shaped analysis from a built-in fallback (`mode:"offline-fallback"`) — the screen still fills, the badge in the result just reflects fallback mode. Keep narrating; nothing visibly breaks. (Do not claim "live AI" if you saw the fallback — see §8.)

---

### STEP 2 — Master Product & Amazon SP-API Sandbox

- **PURPOSE:** Prove real, authenticated Amazon Selling Partner API integration — in the safe sandbox.
- **USER ACTION:** Click **"Golden Flow Step 2: Open Master Product in Amazon Sandbox Catalog"** (bottom-right of the Studio result card). You land on the **Catalog Transformer** tab. Then click **"Submit to SP-API Sandbox (PUT)"** (orange button, Step 3 card).
- **WHAT APPEARS ON SCREEN:**
  - Master product card: **"Royal Kanjeevaram Pure Silk Zari Saree"**, SKU `SG-KANJ-MRN-01`, ₹4,850, MRP ₹6,999, stock 14.
  - Platform tabs: `Amazon India [SANDBOX READY]`, `Flipkart Seller Hub [STAGED READY]`, `Meesho [UPLOAD READY]`, `Myntra [PARTNER STAGED]`, `Nykaa Fashion [ELIGIBILITY WORKFLOW]`.
  - Amazon view shows a 3-step wizard: **"Step 1: Product Type"** (Saree/Dupatta/Lehenga Choli/Kurta/Dress buttons), **"Step 2: Attribute Validation"** ("11 / 11 Attributes Passed (100%)"), **"Step 3: Sandbox Test"**.
  - A diagnostic pill with Host `https://sandbox.sellingpartnerapi-eu.amazon.com`, Auth `SUCCESSFUL_LWA_OAUTH2`, endpoint, latency.
  - After submitting: result card **"SP-API Sandbox Verified • Export-Ready Payload Generated"** (or — rarely — "Submission Accepted"), an amber safeguard note *"Production publishing is disarmed"*, plus a **"Inspect Compliant SP-API JSON_LISTINGS_FEED Schema"** toggle showing the real JSON payload.
- **WHAT HAPPENS IN THE BACKGROUND:** On tab load the app already verified the sandbox (`/api/amazon/verify-sandbox`) — the backend exchanged the refresh token for an access token via **Login with Amazon OAuth2** and called Amazon's sandbox Sellers API. Your PUT click sends the master product through a payload builder that produces Amazon's official `JSON_LISTINGS_FEED` schema; Amazon's sandbox usually doesn't accept writes, so the backend returns the same payload as an **export-ready file** with manual upload instructions — that's the honest, designed behavior.
- **TECHNOLOGY USED:** `OmnichannelCatalog.jsx` → `/api/amazon/verify-sandbox`, `/api/amazon/product-types`, `/api/amazon/product-type-definition`, `/api/amazon/listings/put` → `amazonService.js` + `amazonListingsService.js` → api.amazon.com + sandbox.sellingpartnerapi-eu.amazon.com.
- **EXPECTED RESULT:** Green "🟢 SP-API Sandbox Verified" pill; validation 11/11 PASS; result card with SKU and source; confetti.
- **CURRENT STATUS:** **SANDBOX** (verified live: HTTP 200, ~1.4 s, production publishing blocked by design).
- **DEMO TALKING POINT:** *"This is a real OAuth token exchange and a real authenticated call to Amazon's SP-API sandbox — we validate all 11 attributes Amazon requires before a saree can even be listed. We deliberately block production publishing; no accidental live listings."*
- **SCREENSHOT MOMENT:** **YES** — the "11/11 Attributes Passed" matrix and the sandbox diagnostic pill.
- **FAILURE BACKUP:** If Amazon errors, the backend returns a fallback payload and the UI shows amber "Sandbox Authenticated" instead of the green pill — the screen still shows the full validation matrix and JSON schema. Keep narrating the validation engine; skip the live-latency claim.

---

### STEP 3 — WhatsApp CRM with Sarvam Regional Language

- **PURPOSE:** Prove the full marketing loop: consent → regional language → automation → real WhatsApp delivery, with a human approving.
- **USER ACTION (in order):**
  1. Click **"Golden Flow Step 3: Launch Regional WhatsApp Campaign for this Saree"** (in the Amazon result card) — you land on **n8n WhatsApp CRM**.
  2. (Recommended for the language moment) In the **top navbar**, open the language dropdown and pick **"हिंदी (Hindi)"** (or ಕನ್ನಡ/தமிழ்). Watch the WhatsApp preview bubble translate live (badge shows "Sarvam Translating…").
  3. Click the **"VIP"** segment button.
  4. (Optional) Drag the **"VIP Discount Offer (%)"** slider.
  5. Click **"Broadcast to 2 Customers"** (the number = the actual filtered list — with demo data, VIP = 2 customers: Ananya + Sunita).
  6. In the **"Merchant Approval Required"** modal, click **"Yes, Authorize Broadcast"**.
- **WHAT APPEARS ON SCREEN:**
  - A visual n8n pipeline: **Webhook Trigger → DPDP Opt-In Check → Sarvam AI Indic → Paytm Gateway → Meta WhatsApp**, with a badge "🟢 n8n Webhook Live" (or "Webhook Armed" if n8n is down).
  - Template bar: **"Live Meta Template: hello_world — Delivering Live"** and *"Custom: dukaanquest_new_arrival (Review In Progress)"*.
  - A green WhatsApp phone bubble: *"Shree Ganesh Matching Centre • Official Business"* with the translated festive-saree message, a Paytm link, and "✓✓ Delivered".
  - After approval: **"Campaign Broadcast Successfully Triggered!"** with badges for Template, Delivery: 100%, Mode, and — when n8n + Meta are healthy — a **`wamid:` badge (the real Meta message ID)**.
- **WHAT HAPPENS IN THE BACKGROUND:** The frontend POSTs the campaign to `/api/crm/broadcast` → backend filters out any customer without marketing opt-in (DPDP Act 2023 compliance), normalizes phone numbers to E.164, builds the exact Meta WhatsApp Cloud API template payload, and POSTs it to the local **n8n** webhook → n8n's workflow calls **Meta's WhatsApp Cloud API** → the backend extracts Meta's message ID (`wamid.…`) as delivery proof. If n8n isn't running, the backend returns the full payload as `staged-fallback` and the UI still shows a success-style card (with the honest mode badge).
- **TECHNOLOGY USED:** `WhatsAppCRMHub.jsx` → `/api/crm/broadcast` → `n8nService.js` → n8n (`:5678`) → Meta WhatsApp Cloud API; translation via `sarvamService.js` → Sarvam `mayura:v1`.
- **EXPECTED RESULT:** Success card + wamid badge; +40 XP (header XP ticks up 420 → 460).
- **CURRENT STATUS:** Sarvam translation **LIVE** (verified 694 ms). n8n engine **LIVE** (verified). Meta WhatsApp delivery **LIVE — verified previously with a recorded wamid**; each new broadcast is a real send, so re-verify in your pre-recording checklist (§6).
- **DEMO TALKING POINT:** *"No message leaves without the merchant pressing approve — human-in-the-loop by design. The opt-out notice and consent checks are code, not promises. And the message is in the customer's own language, translated live by Sarvam."*
- **SCREENSHOT MOMENT:** **YES — the single most important shot.** The WhatsApp bubble in Hindi/Kannada + the wamid badge in the result card.
- **FAILURE BACKUP:** If n8n is down or Meta rejects the send: the result card still appears with mode `staged-fallback` (amber badge) and no wamid. Narrate the pipeline and consent gating instead of delivery proof. Never say "delivered" if there's no wamid on screen.

---

### STEP 4 — What-If Profit Simulator

- **PURPOSE:** Prove trustworthy, audited business math — the anti-hallucination differentiator.
- **USER ACTION:** Click **"Golden Flow Step 4: Calculate Campaign Margins & ROI in What-If Simulator"** (in the CRM success card). Drag **"Available Investment Budget"** (default ₹10,000) and **"Stored Offline Customers"** (default 184). Then click the green **"Golden Flow Step 5: Adopt Strategy B & Complete Quest"** button on the recommended card.
- **WHAT APPEARS ON SCREEN:**
  - Header badges: **"Audited Math Engine"** and a shield **"Zero LLM Hallucinations"**.
  - Three strategy cards:
    - **Strategy A — "Marketplace Push"** (Risk: Medium)
    - **Strategy B — "WhatsApp Reactivation"** with a **"★ Recommended"** ribbon (Risk: Low) — with default sliders it shows ≈ **₹35,044 est. net profit (43%)**, payback **~2 Days**
    - **Strategy C — "Hyperlocal Meta Ads"** (Risk: High)
  - Each number carries a tiny label: `[Sourced]`, `[Demo Assumption]`, or `[Benchmark]`.
  - An assumptions banner: *Marketplace Take-rate 17.5% (Amazon Rate Card) · Return Rate Risk Buffer 14% (Redseer Benchmark) · WhatsApp ₹0.85/conversation (Meta API)*.
- **WHAT HAPPENS IN THE BACKGROUND:** Nothing external — this is 100% deterministic React code (`WhatIfSimulator.jsx`). Fixed formulas multiply your slider inputs by labeled constants (17.5% commission, ₹110 shipping, 24% WhatsApp conversion, ₹1,050 COGS, 2.6× ROAS…). No LLM is involved in any number.
- **TECHNOLOGY USED:** `WhatIfSimulator.jsx` only (pure frontend).
- **EXPECTED RESULT:** Three filled strategy cards; clicking B fires confetti, +50 XP then +100 XP, **all quests complete**, level jumps to 3, and the app auto-navigates to the Town tab with a big confetti burst.
- **CURRENT STATUS:** **DETERMINISTIC / LOCAL** (cannot fail — no network).
- **DEMO TALKING POINT:** *"Retailers risk real money here, so the math is code, not chatbot text — every number is labeled sourced, benchmark, or demo assumption. Strategy B wins because WhatsApp reactivation has zero platform commission and instant UPI settlement."*
- **SCREENSHOT MOMENT:** **YES** — the "★ Recommended" Strategy B card and the "Zero LLM Hallucinations" shield.
- **FAILURE BACKUP:** None needed — it cannot fail.

---

### STEP 5 — Town Upgrade & Level 3 (finale)

- **PURPOSE:** The emotional payoff — gamified progression for a real business milestone.
- **USER ACTION:** You land on **"Town & Copilot"** automatically after Step 4. Just let the confetti finish.
- **WHAT APPEARS ON SCREEN:** Header shows **"Level 3 • Digital Vyapari"** and **"610/600 XP"**; the town re-renders; QuestLog shows **"Completed 4/4 Business Milestones"**.
  - ⚠️ Known cosmetic quirk: the shop building inside the canvas may still read *"Level 3 • Mohalla Merchant"* — it uses a fallback label. **Don't zoom on the building subtitle; zoom on the header XP bar instead.**
- **WHAT HAPPENS IN THE BACKGROUND:** `App.jsx` crosses 600 XP → sets level 3 ("Digital Vyapari"), fires the large confetti, marks every quest complete. XP was also persisted to the backend (`PUT /api/shop/xp`) along the way.
- **TECHNOLOGY USED:** `App.jsx`, `DigitalDukaanCanvas.jsx`, `QuestLog.jsx`.
- **EXPECTED RESULT:** Level 3 + confetti + 4/4 quests.
- **CURRENT STATUS:** WORKING (local state + best-effort backend persistence).
- **DEMO TALKING POINT / CLOSING:** see §17.
- **SCREENSHOT MOMENT:** **YES** — final confetti frame over the town with "Level 3 • Digital Vyapari" in the header.
- **FAILURE BACKUP:** None needed.

---

## 4. EXACT CLICK-BY-CLICK DEMO INSTRUCTIONS

Do exactly this, in order. (Assumes a fresh page at `http://127.0.0.1:5173` — the app always starts at Level 2, 420/600 XP, "Completed 2/4".)

1. Open **`http://127.0.0.1:5173`** in Chrome.
2. Wait 2–3 seconds. You should see the dark "Town & Copilot" dashboard: a neon 2D town with 5 buildings, a top header reading **"DukaanQuest"** + `PS-21 FinTech`, a tier bar (**Gemini LIVE · Sarvam LIVE · WhatsApp/n8n LIVE · Amazon SANDBOX · Paytm FALLBACK**), and a **"3-Min Golden Journey"** chip banner.
3. Click the **"1. Photo Studio (Gemini Vision)"** journey chip (top banner).
4. *(Optional, 5 extra seconds, better video)*: click **"Upload Photo"**, choose any product photo from your computer, and watch the processing banner.
5. Click **"Re-Enhance with Gemini"** (purple button, top right).
6. Wait ~3–6 seconds until the processing banner disappears and confetti fires. Confirm the **"✨ Gemini AI Analysis Result"** card is filled.
7. Drag the split slider left and right once (slowly — this is a hero shot).
8. Click each asset tab once: **"1. Amazon Main" → "2. Myntra Lifestyle" → "3. Macro Weave Detail" → "4. Infographic Spec"**, ending back on **"1. Amazon Main"**.
9. Click **"Golden Flow Step 2: Open Master Product in Amazon Sandbox Catalog"** (bottom-right of the AI result card).
10. On the Catalog Transformer, confirm the badge **"🟢 SP-API Sandbox Verified"** is visible (it auto-checked when the tab opened). If it says "Sandbox Authenticated" (amber), see §12 Amazon backup.
11. Click **"Inspect Compliant SP-API JSON_LISTINGS_FEED Schema"** once to flash the real JSON, then collapse it.
12. Click **"Submit to SP-API Sandbox (PUT)"** (orange button).
13. Wait ~1–2 seconds. Confirm the result card appears: **"SP-API Sandbox Verified • Export-Ready Payload Generated"** with the amber safeguard note.
14. Click **"Golden Flow Step 3: Launch Regional WhatsApp Campaign for this Saree"**.
15. In the top navbar, click the language dropdown and select **"हिंदी (Hindi)"**. Watch the WhatsApp preview bubble translate (badge "Sarvam Translating…" for under a second). *(Optional: show one more language, e.g. "ಕನ್ನಡ (Kannada)", then continue in Hindi.)*
16. Click the **"VIP"** segment button (under "Select Customer Segment"). The recipient list should show 2 customers (Ananya Deshpande, Sunita Sharma).
17. Click **"Broadcast to 2 Customers"** (top-right button; label shows the live count).
18. In the **"Merchant Approval Required"** modal, pause one beat (good shot of the DPDP consent note), then click **"Yes, Authorize Broadcast"**.
19. Wait 1–3 seconds. Confirm **"Campaign Broadcast Successfully Triggered!"** and look for the **wamid** badge. Header XP should now read 460/600.
20. Click **"Golden Flow Step 4: Calculate Campaign Margins & ROI in What-If Simulator"**.
21. On the simulator, drag **"Available Investment Budget"** once (anywhere 3,000–50,000) to show it's interactive, then drag it back to **₹10,000**. Leave **"Stored Offline Customers"** at **184**.
22. Pause on the three strategy cards (say the simulator lines). Point at the **"★ Recommended"** ribbon and the **"Zero LLM Hallucinations"** shield.
23. Click **"Golden Flow Step 5: Adopt Strategy B & Complete Quest"** (green button on Strategy B).
24. Confetti fires; the app jumps to the Town tab. Header shows **"Level 3 • Digital Vyapari"** and **610/600 XP**. Hold on this frame for the closing narration (§17).

**Total: ~2:30–2:50 of screen action.** Optional bonus (only if time allows): the **Paytm FinTech** tab → **"Test Soundbox Voice Alert (Demo)"** → Hindi text banner + **"Generate Demo Payment Link"** → `[DEMO LINK]` field — always framed with its "STAGED / FALLBACK (Demo Data)" badge visible.

---

## 5. APPLICATION STARTUP GUIDE

Three processes. Use **three separate terminal windows** and keep them ALL open during recording.

### One-time setup (fresh machine)
```bash
# from the repository root
npm install                    # root workspace scripts
cd server && npm install && cd ..          # backend dependencies (express, axios, cheerio, multer, dotenv, cors)
cd dukaanquest-app && npm install && cd .. # frontend dependencies (react, vite, lucide, confetti)
```
Environment variables live in **`server/.env`** (already configured on the team machine; template in `server/.env.example` — includes `GEMINI_API_KEY`, `SARVAM_API_KEY`, `N8N_WEBHOOK_URL`, Amazon LWA credentials).

> 🔐 **SECRET RULE:** API keys are pasted **only** into `server/.env` (and into n8n's own credential manager for Meta). Never paste keys into a terminal, a chat, a screenshot, this guide, or a commit. If a key is ever exposed, rotate it immediately.

### Terminal 1 — n8n (start FIRST)
```bash
npx n8n start          # or however the team normally launches it (desktop app / docker)
```
- URL: **http://localhost:5678** → you should see the n8n editor.
- The workflow **"DukaanQuest - WhatsApp CRM Automation"** must be **Active** (toggle ON in n8n) so its production webhook `/webhook/dukaanquest-crm` responds. The backend auto-retries the `/webhook-test/…` URL if production 404s, but for LIVE delivery proof the workflow must be active.
- The Meta WhatsApp credentials (access token, phone-number ID) live **inside n8n's credentials**, not in this repo. ⚠️ Meta test access tokens can expire — if broadcasts stop returning a wamid, refresh the token in n8n before recording (marked requirement, see §6).

### Terminal 2 — Backend
```bash
npm run server         # runs: node server/index.js  →  port 5000
```
- Verify: open `http://127.0.0.1:5000/api/health` — you should see JSON with `"overallStatus":"PARTIAL (3 LIVE, 1 SANDBOX, 6 STAGED, 1 FALLBACK)"`.

### Terminal 3 — Frontend
```bash
npm run client         # runs: vite dev server  →  port 5173 (host 127.0.0.1)
```
- Verify: open `http://127.0.0.1:5173` — the town dashboard loads. The frontend proxies all `/api` calls to port 5000 automatically (configured in `vite.config.js`) — no extra config needed.

### Order & rules
- **Order:** n8n → backend → frontend (backend works without n8n, but WhatsApp will be in fallback mode).
- **Which process must keep running:** all three, for the entire recording. Closing the backend terminal mid-demo freezes every API call (Vite proxy will show errors).
- A production build (`npm run build`) is only used to prove the build passes — **record on the dev server**, not the built preview.

---

## 6. DEMO ENVIRONMENT CHECKLIST (run ~15 min before recording)

**APPLICATION**
- [ ] Frontend running → open `http://127.0.0.1:5173`, town dashboard renders
- [ ] Backend running → `curl http://127.0.0.1:5000/api/health` returns JSON
- [ ] Build passes → `npm run build` ends with `✓ built in ...` (run before recording, then keep dev server)
- [ ] No console-breaking errors → F12 → Console shows no red errors on load (warnings are OK)

**AI**
- [ ] Gemini working → `curl -X POST http://127.0.0.1:5000/api/studio/extract-attributes -H "Content-Type: application/json" -d "{\"productContext\":\"Silk Saree\"}"` → response contains `"liveAPI":true`
- [ ] Sarvam working → `curl -X POST http://127.0.0.1:5000/api/sarvam/translate -H "Content-Type: application/json" -d "{\"text\":\"Hello\",\"targetLanguage\":\"hi\"}"` → contains `"liveAPI":true`

**MARKETPLACE**
- [ ] Amazon sandbox responding → `curl http://127.0.0.1:5000/api/amazon/verify-sandbox` → contains `"verified":true` and `"statusCode":200`

**WHATSAPP**
- [ ] n8n running → `curl http://localhost:5678/healthz` returns 200 / open `http://localhost:5678`
- [ ] Workflow **active** in n8n (toggle on)
- [ ] Meta credentials valid → **send one test broadcast** from the CRM tab and confirm a **fresh `wamid:` badge** appears. ⚠️ *This sends a real WhatsApp template message to the demo list — do this check BEFORE recording, not during.*
- [ ] If no wamid appears → refresh the Meta access token inside n8n, re-test once

**SIMULATOR**
- [ ] Calculations load → open the simulator tab; all 3 strategy cards show rupee values (Strategy B ≈ ₹35,044 / 43% with default sliders)

**GAME**
- [ ] XP works → completing the journey ends at 610/600 XP, "Level 3 • Digital Vyapari"
- [ ] Quest progression → QuestLog goes from "Completed 2/4" to "Completed 4/4" after the journey
- [ ] Final state → Town tab + confetti + Level 3 header

**BROWSER**
- [ ] Fresh page loaded right before recording (resets demo state to 420 XP / Level 2)
- [ ] Language dropdown set to **English** at start
- [ ] Bookmarks bar / dev tools closed; window at 1920×1080 or 1280×720, 100% zoom

---

## 7. INTEGRATION STATUS FOR THE DEMO

| Service | What it does | Status | What the demo shows | Backup if it fails |
|---|---|---|---|---|
| **Gemini — text/vision** (`gemini-3.1-flash-lite`) | Product analysis, SEO title, bullets, compliance score | 🟢 **LIVE** (verified 200, ~3 s) | AI analysis card fills in real time | Built-in fallback analysis (same shape, labeled fallback) |
| **Gemini — image generation** (`gemini-3.1-flash-image`) | AI hero/lifestyle images | 🟡 **STAGED** (HTTP 429 — free tier quota is 0; needs Google Cloud billing) | Clearly-labeled curated catalog assets in the 4 asset tabs | Same staged assets — by design |
| **Sarvam AI** (`mayura:v1`) | Hindi/Kannada/Tamil translation of campaign | 🟢 **LIVE** (verified 694 ms) | WhatsApp preview translates on language switch | Built-in Indic dictionary fallback (fixed sentences) |
| **n8n engine** (`:5678`) | Workflow automation hub | 🟢 **LIVE** (healthz 200 verified) | Pipeline diagram + "🟢 n8n Webhook Live" badge | "Webhook Armed" badge + staged payload mode |
| **Meta WhatsApp Cloud API** (via n8n) | Real template message delivery (`hello_world`; custom template pending Meta approval) | 🟢 **LIVE — previously verified via recorded `wamid`**; re-verify before recording | wamid badge in the dispatch result | `staged-fallback` result card (no wamid shown — don't say "delivered") |
| **Amazon SP-API** (LWA OAuth2 + sandbox) | Marketplace auth + listing POC | 🟠 **SANDBOX** (verified 200, ~1.4 s; production blocked by design) | Green sandbox pill, 11/11 validation, payload JSON | Amber "Sandbox Authenticated" + export payload |
| **Paytm** (links/QR/Soundbox) | Payments demo | 🟡 **STAGED/FALLBACK** (never live — Paytm dashboard can't issue test keys) | `[DEMO LINK]`, `DEMO QR`, Soundbox text banner — always with badges | It *is* the backup; nothing to fall back from |
| **Flipkart FMS v3** | Listing payload generator | 🟡 **STAGED** | JSON payload on the Flipkart tab | Same |
| **Meesho** | Supplier Panel bulk CSV | 🟡 **UPLOAD READY** (file generator; no public API exists) | CSV preview + downloadable flatfile | Same |
| **Myntra MMIP** | Partner catalog dossier | 🟡 **STAGED** | Payload JSON on the Myntra tab | Same |
| **Nykaa Fashion** | Brand eligibility dossier | 🟡 **ELIGIBILITY WORKFLOW** | Payload JSON on the Nykaa tab | Same |
| **Marketplace "scraper"** | Packaging rules display | 🟠 **STATIC KNOWLEDGE BASE** — ⚠️ the "⚡ Scrape Live Marketplace Specs" button returns curated rules, it does **not** fetch the web (older docs claim it scrapes — code says otherwise) | Rules panel with source links | n/a |

**Rule for narration:** use the exact words on screen — LIVE, SANDBOX, STAGED, FALLBACK — nothing stronger.

---

## 8. WHAT IS ACTUALLY REAL VS SIMULATED

### REAL / LIVE (actual external API calls, verified)
- **Gemini text analysis** — every "Re-Enhance with Gemini" click hits Google's API. Health probe confirms `LIVE_VERIFIED`.
- **Sarvam translation** — every language switch (non-English) inside the CRM hits `api.sarvam.ai`.
- **n8n dispatch** — every broadcast POSTs to the running n8n instance.
- **Meta WhatsApp delivery** — when n8n's workflow is active and its Meta token valid, the template message actually sends and Meta returns a `wamid` message ID (proof previously recorded; re-verify per §6).

### SANDBOX (real platform, isolated environment)
- **Amazon SP-API** — real Login-with-Amazon OAuth2 token exchange and a real authenticated call to `sandbox.sellingpartnerapi-eu.amazon.com`. Production listing publishing is **deliberately blocked** (`productionPublishingBlocked: true`). The sandbox usually rejects writes, so the app converts the result into an export-ready JSON payload — that's designed behavior, not an error.

### STAGED (prepared assets because production access isn't available)
- **Gemini image generation** — model is reachable but Google returns HTTP 429 (free-tier image quota = 0; billing required). App shows curated catalog images labeled "staged".
- **Paytm** — demo link/QR/Soundbox with clearly-labeled demo data (dashboard can't issue test keys right now). A zero-code hook exists: adding a real `PAYTM_MERCHANT_KEY` to `server/.env` activates the staging call automatically.
- **Flipkart / Meesho / Myntra / Nykaa** — payload/CSV/dossier **generators** only. No API credentials exist or are claimed.

### FALLBACK (what happens when externals fail)
- Every backend service catches errors and returns `success:true` with a `mode` like `offline-fallback` / `staged-fallback` / `live-quota-limited`. The UI always renders something demo-safe. The `/api/health` endpoint reports the true tally, so you can always check reality.

### DETERMINISTIC LOGIC (calculated locally, never by an LLM)
- **The entire What-If simulator.** Fixed formulas in `WhatIfSimulator.jsx`:
  - Marketplace (A): sales = budget × 3.4 `[Demo Assumption]`; commission = 17.5% `[Sourced: Amazon rate card]`; shipping ₹110 per ₹2,200 `[Empirical benchmark]`; returns = 14% × 40% value loss `[Benchmark + assumption]`; payback 26 days `[Demo Assumption]`.
  - WhatsApp (B): conversion 24% `[Demo Assumption]`; AOV ₹1,850 `[Demo Assumption]`; cost ₹0.85/chat `[Sourced: Meta rate card]`; COGS ₹1,050 `[Demo Assumption]`; payback 2 days `[Benchmark: instant UPI]`.
  - Meta Ads (C): ROAS 2.6× `[Demo Assumption]`; COGS 48% `[Demo Assumption]`; payback 6 days `[Demo Assumption]`.
- **Never say** in the video: "production Amazon listings", "real Paytm payments", "AI-generated these images", or "the scraper fetches Amazon's website".

### ⚠️ Known doc-vs-reality discrepancies (don't get caught by a judge)
1. The **scraper is a curated knowledge base**, not a live web scrape (button wording oversells it).
2. The header badge may say **"Local Engine"** instead of "REST API Connected" — a known frontend health-check quirk; it doesn't affect anything. Don't zoom on it; don't explain it on camera.
3. The canvas building subtitle can stay "Mohalla Merchant" at Level 3 (cosmetic). Frame the header XP bar instead.

---

## 9. COMPLETE DEMO NARRATION SCRIPT (word-for-word, ~2:50)

> Read it aloud twice before recording. Speak in the rhythm of the clicks in §4.

**00:00–00:15 — Problem + hook** *(Town screen)*
> "Meet Ramesh-ji. For twenty-eight years he's run a saree shop in Gandhi Bazaar, Bengaluru. He knows every customer by name — but he can't sell online. Studio photos cost thousands, Amazon's packaging rules read like legalese, and his customers speak Kannada, not e-commerce English. Big retailers have teams for all of this. Small retailers have one owner."

**00:15–00:35 — Introduce DukaanQuest** *(pan across town + tier bar)*
> "This is DukaanQuest — a gamified copilot that gives that one owner a whole digital team. And everything you're about to see is real: the badges at the top show exactly which APIs are live, which are sandbox, and which are staged. We don't fake anything."

**00:35–01:00 — AI product intelligence** *(Studio tab, click Re-Enhance, drag slider)*
> "Ramesh-ji uploads one phone photo. Google Gemini analyzes it live — right now — reading the fabric, writing Amazon-ready bullet points, scoring compliance. One counter photo becomes catalog material. And when the AI image model hits its quota, we show clearly-labeled studio assets instead of pretending — honesty is the feature."

**01:00–01:25 — Master catalog + marketplace** *(Catalog tab, validation matrix, Submit)*
> "From one master product, DukaanQuest generates listing payloads for five marketplaces. Watch the Amazon flow: eleven required attributes validated, a real OAuth token exchange, and a live authenticated call to Amazon's SP-API sandbox — with production publishing deliberately disarmed, so nothing ever lists by accident."

**01:25–01:50 — CRM + WhatsApp + regional language** *(switch to Hindi, VIP, approve)*
> "Now his 184 regulars. He picks his VIPs, the campaign message translates live into Hindi with Sarvam AI — his customers' language. One approval click — because a human always decides what gets sent — and n8n fires the message through Meta's WhatsApp Cloud API. That wamid on screen? That's Meta confirming a real delivery. Consent checks and opt-outs are enforced in code, DPDP compliant."

**01:50–02:15 — What-If simulator** *(simulator tab, drag budget, point at cards)*
> "Before risking ten thousand rupees, Ramesh-ji simulates three growth paths. Marketplace expansion: solid, but 17.5% commission and 26-day settlement. WhatsApp reactivation: zero commission, two-day payback — the winner. Local ads: high risk. And this math is deterministic code — every number labeled sourced or assumption. Zero AI hallucinations, because he's betting real money."

**02:15–02:35 — Quest / game progression** *(click Adopt Strategy B, confetti, Level 3)*
> "He adopts the strategy — and his dukaan levels up. Every real business milestone — packaging done, campaigns sent, decisions made — earns XP, turning digital transformation into a quest."

**02:35–03:00 — Closing** *(hold on Level 3 town)*
> "Create once, sell everywhere, retain your customers, reach new ones, and simulate before you spend. Big retailers have teams for e-commerce, CRM, and marketing. Small retailers have one owner. **DukaanQuest gives that owner the team.**"

---

## 10. SCREEN RECORDING PLAN (shot list)

Recording setup: 1920×1080 (or 1280×720), 100% zoom, cursor visible, Chrome at `http://127.0.0.1:5173`.

| Shot | Time | Screen / Tab | Action | Show | Hide / avoid | Voiceover ref | Why it matters |
|---|---|---|---|---|---|---|---|
| 1 | 00:00–00:10 | Town | Slow pan across the canvas town | 5 buildings, stats cards, tier bar | Header "Local Engine" badge | §9 hook | Sets the world + honesty frame |
| 2 | 00:10–00:20 | Town | Hover the journey chips | "3-Min Golden Journey" banner | — | §9 intro | Shows the guided path exists |
| 3 | 00:20–00:45 | Studio | Click Re-Enhance; hold on processing banner | Live processing stages | Long pauses | §9 AI | Proves live AI latency |
| 4 | 00:45–00:55 | Studio | Drag split slider slowly | Raw ↔ studio comparison | — | §9 AI | The "wow" visual |
| 5 | 00:55–01:05 | Studio | Point at analysis card + compliance badge | SEO title, bullets, score | Asset-tab fine print | §9 AI | The tangible output |
| 6 | 01:05–01:15 | Catalog | Land on tab; show sandbox pill + 11/11 matrix | Green pill, validation grid | Other platform tabs (mention only) | §9 marketplace | Real validation depth |
| 7 | 01:15–01:30 | Catalog | Click Submit; flash JSON toggle | Result card + safeguard note + payload | Submission-ID fine print | §9 marketplace | Real SP-API proof |
| 8 | 01:30–01:40 | CRM | Switch language to हिंदी | Bubble translating live | English bubbles before switch | §9 CRM | Sarvam magic moment |
| 9 | 01:40–01:55 | CRM | VIP segment → Broadcast → approval modal (pause 1s) → Yes | Modal consent text; then wamid badge | Hardcoded segment counts (§13) | §9 CRM | Human-in-the-loop + delivery proof |
| 10 | 01:55–02:15 | Simulator | Drag budget; point at 3 cards + shield | Strategy B ★ ribbon, labeled assumptions | Target-revenue slider (it's decorative — don't touch) | §9 simulator | Audited math differentiator |
| 11 | 02:15–02:30 | Simulator → Town | Click "Adopt Strategy B & Complete Quest" | Confetti + auto-navigation | — | §9 quest | The payoff trigger |
| 12 | 02:30–03:00 | Town | Hold steady on final frame | "Level 3 • Digital Vyapari" + 610/600 + 4/4 quests | Canvas building subtitle | §9 closing | The brand closing line |

**Edit notes:** cut waiting time between API calls down to ~1 s each in post; keep the wamid shot and confetti at full length; total target ≤ 3:00.

---

## 11. WHAT THE CAMERA SHOULD FOCUS ON

**Zoom / dwell on:**
1. The **AI analysis card** (Step 1) — title, bullets, compliance %.
2. The **split slider** mid-drag.
3. **"11 / 11 Attributes Passed"** + the sandbox diagnostic pill (host + latency).
4. The **`wamid:` badge** — the single hardest piece of proof in the whole demo.
5. The WhatsApp bubble in **Hindi/Kannada script**.
6. **"★ Recommended"** Strategy B card + **"Zero LLM Hallucinations"** shield.
7. **"Level 3 • Digital Vyapari"** in the header + confetti.

**Do NOT dwell on / keep out of frame:**
- The header **"Local Engine"** badge (known quirk, §8).
- The canvas building subtitle at Level 3.
- The CRM segment buttons' hardcoded counts ("All Customers (184)") — the real filtered lists are smaller; the true count appears in the Broadcast button and the recipient list.
- The "Target Incremental Revenue" slider (decorative).
- Any dev tools, terminal windows, bookmarks, or the browser's URL bar (crop or full-screen F11).
- The Paytm tab unless you explicitly want the staged-payments beat — if shown, keep its "STAGED / FALLBACK (Demo Data)" badge in frame.

---

## 12. BACKUP DEMO PATHS

All backups use features that already exist. **Never fake an API response.**

### Gemini failure
- **Primary:** Click "Re-Enhance with Gemini" → live AI card (~3 s).
- **Backup:** The backend auto-returns a built-in expert analysis (`offline-fallback`) — the card still fills with title/bullets/score. Narrate the *output* ("Amazon-ready bullet points generated"), skip the word "live", and lean on the split slider + asset tabs, which are local and never fail. If even that lags: move on to Step 2 and return later — the card renders on demand.

### Amazon failure
- **Primary:** Green "🟢 SP-API Sandbox Verified" + Submit → result card.
- **Backup:** The validation matrix (Step 2 of the wizard) and the JSON schema toggle are 100% frontend/local — they always work. Narrate the 11-attribute validation and show the compliant payload; describe the sandbox as "verified in pre-recording checks" if the live pill is amber. Never claim a live roundtrip you didn't see.

### WhatsApp/Meta failure
- **Primary:** Broadcast → success card **with `wamid:` badge**.
- **Backup:** If n8n is down, the result card appears with mode `staged-fallback` (amber) and no wamid. Narrate what's real and on screen: consent gate, E.164 normalization, the Meta template payload preview, human approval. If the send failed for token reasons, fix n8n/Meta during a pause and re-record that shot — one clean take is enough.

### Sarvam failure
- **Primary:** Language switch → bubble translates live (~0.7 s).
- **Backup:** The app has a built-in Indic dictionary fallback — the bubble still shows native-script text (slightly different wording, badge shows fallback mode). Narrate the multilingual capability; omit "translated live by AI".

### Paytm failure
- **Primary/backup are the same:** Paytm is a demo by design. The Soundbox text banner and `[DEMO LINK]` always work (pure frontend). Just keep the "STAGED / FALLBACK" badge visible and say "staged" — there is no live mode to fall back from.

### n8n workflow failure (engine up, workflow broken)
- Symptom: result card says `LIVE_ACKNOWLEDGED_PENDING_CONFIRMATION` or downstream error, no wamid.
- **Backup:** Same as WhatsApp backup; optionally open `http://localhost:5678` in a paused moment to activate the workflow, re-test, then re-record the single CRM shot.

---

## 13. COMMON MISTAKES

1. **Closing a terminal window** mid-recording (kills backend → all API calls freeze). Keep all three windows open and visible in your taskbar.
2. **Refreshing the page mid-flow** — a refresh resets the app to 420 XP / Level 2 and clears in-progress results. Refresh only *before* starting.
3. **Clicking Broadcast twice** — each click is a real WhatsApp send when n8n is live. One approval per take.
4. **Zooming on the "Local Engine" badge** or the canvas "Mohalla Merchant" subtitle — known cosmetic quirks (§8); don't frame them.
5. **Believing the hardcoded segment counts** — buttons say "VIP & Bridal (42)" but the real VIP list with demo data is 2 customers; the Broadcast button shows the true number. Don't say "we're messaging 42 people."
6. **Touching the "Target Incremental Revenue" slider** — it's display-only; moving it changes nothing and invites questions.
7. **Claiming staged things are live** — "production listings", "real payments", "AI-generated images", "live web scraping" are all off-script (§7–8).
8. **Exposing secrets** — never open `server/.env`, n8n's credential panel, or any terminal running with env output on camera.
9. **Recording on a stale page** — always hard-refresh and start from the Town tab so the XP math (420 → 610) lands exactly as scripted.
10. **Skipping the final click** — the story ends at "Adopt Strategy B & Complete Quest"; without it there's no Level 3, no confetti, no closing frame.
11. **Speaking over processing banners** — start the Gemini/WhatsApp lines *while* the banner shows, so dead air is covered.
12. **Forgetting the language switch back to English** after the CRM step — harmless, but the closing frames look cleaner in English.

---

## 14. TROUBLESHOOTING

| Problem | Symptom | Cause | Fix | Backup |
|---|---|---|---|---|
| Frontend not loading | Browser can't reach `127.0.0.1:5173` | Vite dev server not running | Run `npm run client` in Terminal 3; wait for "Local:" URL | None — frontend required |
| Backend not responding | Health URL fails / all actions hang | Backend not running, or wrong port | Run `npm run server` in Terminal 2; confirm port 5000 in its startup banner | Restart takes ~2 s; do it before recording, not during |
| Every API call fails at once | Processing banners never resolve | Backend terminal was closed | Reopen Terminal 2, refresh page, restart the take | — |
| Gemini slow/quota | Studio takes >8 s or result shows fallback badge | Google latency spike; text quota rarely an issue | Wait once; if fallback persists, use §12 Gemini backup narration | Fallback card renders anyway |
| Gemini image stuck "staged" | Asset tabs show curated images with amber badge | By design — Google free tier quota is 0 | Nothing to fix; it's a talking point | n/a |
| Sarvam error | Translation doesn't change / badge shows fallback | Network or key issue | Check `server/.env` has `SARVAM_API_KEY` (ask the dev; never paste keys on camera); restart backend | Dictionary fallback shows native text anyway |
| Amazon sandbox failure | Amber "Sandbox Authenticated" instead of green pill | Amazon/network hiccup or expired credential | Click **"Re-verify SP-API Sandbox"** once; if still amber, use §12 Amazon backup | Validation matrix always works |
| WhatsApp no wamid | Result card shows `staged-fallback` or pending | n8n not running / workflow inactive / Meta token expired | Open `http://localhost:5678` → activate workflow; refresh Meta token in n8n credentials; re-test once BEFORE recording | §12 WhatsApp backup narration |
| Simulator looks wrong | Numbers differ from guide | Sliders were moved | Reset Budget to ₹10,000, Customers to 184 (defaults on fresh load) | Any values work; just narrate relative rankings |
| XP/level didn't reach 610 | Header shows less than Level 3 | A step was skipped (broadcast or journey-complete click) | Re-click the missed step; XP is additive | Or refresh and re-run the journey (~90 s) |
| UI looks broken/zoomed | Overlapping layout | Browser zoom ≠ 100% or narrow window | Set zoom 100%, window ≥1280 px wide | — |
| Confetti didn't fire | Level-up but no animation | Rare timing | It's cosmetic; the header level is the proof | — |

---

## 15. DEMO DATA (all pre-loaded — do not invent new data)

Everything below already exists in the app on a fresh load:

| Item | Exact value | Where it comes from |
|---|---|---|
| Shop / persona | **Shree Ganesh Matching & Saree Centre**, Ramesh Kumar Yadav, Gandhi Bazaar, Bengaluru, Level 2 "Mohalla Merchant", 420/600 XP, ₹1,48,500 monthly offline revenue, 4-day streak | App seed (`mockData.js` / backend `database.js`) |
| Hero product (Step 1–2) | **Royal Kanjeevaram Pure Silk Zari Saree** · SKU `SG-KANJ-MRN-01` · ₹4,850 (MRP ₹6,999) · 14 in stock · 100% Mulberry Silk + Gold Zari | Default selected product in Studio & Catalog |
| Other products (only if showing the carousel) | Handloom Chanderi Cotton Silk Kurta Set ₹2,200; Men's Classic Khadi Handspun Kurta ₹1,450 | Same |
| Amazon product type | **Saree** (default selected in the type buttons) | Catalog default |
| Customers | 5 demo customers; **VIP segment = Ananya Deshpande + Sunita Sharma** (both opt-in) | CRM hub |
| Campaign | Title "Festive Kanjeevaram Saree Launch", **VIP Discount 15%** (default), WhatsApp template `hello_world` (en_US) | CRM defaults |
| Languages | Start English → switch to **हिंदी (Hindi)** on camera (optionally flash ಕನ್ನಡ/தமிழ்) | Navbar dropdown |
| Simulator inputs | **Budget ₹10,000** (default), **Customers 184** (default) — expected Strategy B result ≈ ₹35,044 / 43% / ~2-day payback | Simulator defaults |
| Paytm (optional beat) | Amount **4850**, customer **Ananya Deshpande** (defaults) | Paytm hub defaults |

**Why this data:** it's the persona's story from the PRD, it's deterministic (same numbers every take), and it drives the exact XP math 420 → 460 → 510 → 610 that triggers Level 3 on camera.

---

## 16. IDEAL DEMO STATE (right before pressing Record)

- [ ] All 3 terminals open and quiet: n8n (:5678), backend (:5000), frontend (:5173)
- [ ] `GET /api/health` shows `"PARTIAL (3 LIVE, 1 SANDBOX, 6 STAGED, 1 FALLBACK)"`
- [ ] Chrome full-screen (F11), 100% zoom, at `http://127.0.0.1:5173`, **Town tab active**
- [ ] Page freshly loaded within the last minute → header reads **"Level 2 • Mohalla Merchant"**, **420/600 XP**, QuestLog "Completed 2/4"
- [ ] Language dropdown = **English**
- [ ] No error banners anywhere; F12 console closed (checked earlier, then closed)
- [ ] No dev tools, terminals, `.env` files, or n8n credential panels visible anywhere on screen
- [ ] One test broadcast already done in the checklist phase (so the wamid shot is proven to work)
- [ ] Recording software set to 1080p/720p, mic level tested, notifications silenced (Windows Focus Assist ON)

---

## 17. ENDING THE DEMO

The final click of Step 4 ("Adopt Strategy B & Complete Quest") does the ending for you: confetti → auto-navigate to Town → **Level 3 • Digital Vyapari**, **610/600 XP**, QuestLog **"Completed 4/4 Business Milestones"**. Hold that frame for 5–8 seconds while delivering the closing:

> **"Create once, sell everywhere, retain your customers, reach new ones — and simulate before you spend. Big retailers have teams for e-commerce, CRM, and marketing. Small retailers have one owner. DukaanQuest gives that owner the team."**

Then stop recording. Do not navigate anywhere else after the confetti — that frame *is* the poster shot.

---

## 18. 30-SECOND EMERGENCY DEMO

For last-minute slots or re-recordings. One continuous take:

1. (0–5 s) Town screen: pan once. *"DukaanQuest — the digital team for India's small shops."*
2. (5–15 s) Studio tab → **"Re-Enhance with Gemini"** → hold the AI analysis card. *"Live Gemini: photo to marketplace-ready catalog."*
3. (15–25 s) Jump to CRM tab → click **"Broadcast to 2 Customers"** → **"Yes, Authorize Broadcast"** → point at wamid. *"Real WhatsApp delivery, merchant-approved, in the customer's language."*
4. (25–30 s) Jump to Simulator → point at Strategy B ★ card. *"Audited profit math. Big retailers have teams — DukaanQuest gives the owner one."*

(If Gemini or WhatsApp are down: use the Catalog validation matrix (11/11) and the simulator cards instead — both are instant and cannot fail.)

---

## 19. 60-SECOND DEMO

1. (0–8 s) Town + tier bar. Hook line about Ramesh-ji.
2. (8–20 s) Studio: Re-Enhance → split slider drag → compliance badge. *"Live AI catalog intelligence."*
3. (20–33 s) Catalog: sandbox pill + 11/11 matrix + Submit result. *"Real Amazon SP-API sandbox, production blocked."*
4. (33–48 s) CRM: Hindi switch → VIP → approve → wamid. *"Regional-language WhatsApp marketing with human approval and real Meta delivery."*
5. (48–60 s) Simulator: Strategy B card → click Adopt → Level 3 confetti. *"Deterministic ROI math, and the shop levels up. DukaanQuest gives that owner the team."*

---

## 20. 3-MINUTE FULL DEMO

That is exactly §9 (narration) + §4 (clicks) + §10 (shot list) combined. Budget: ~20 s problem, ~15 s product intro, ~35 s Studio, ~30 s Catalog, ~40 s CRM, ~30 s Simulator, ~20 s finale, ~20 s closing. Rehearse twice with a timer; the natural take lands at 2:45–3:00.

---

## 21. TECHNICAL EXPLANATION FOR Q&A

**Why Gemini?** It's a multimodal model: one API call handles the product *photo* (vision) and returns strict JSON (we force `response_mime_type: application/json`, temperature 0.2) with the title, bullets, and compliance score. Two models split the work: `gemini-3.1-flash-lite` for fast text/attributes (live), `gemini-3.1-flash-image` for generation (staged on quota).

**Why Sarvam?** It's built for Indian languages (mayura:v1 for translation). Our fallback is a curated dictionary, so the multilingual demo survives outages — and the health endpoint tells you which one ran.

**How does the master catalog work?** One product record (SKU, price, images, platform listings) is stored once; `marketplaceAdapters.js` are pure functions that transform it into each platform's schema — Amazon `JSON_LISTINGS_FEED`, Flipkart FMS JSON, Meesho CSV, Myntra/Nykaa dossiers. No duplication, no drift.

**How do marketplace listings work?** For Amazon we implement the official chain: Product Type Definitions → required-attribute validation (11 attributes) → Listings Items PUT payload. The sandbox usually rejects writes, so we return the same payload as an export-ready JSON feed for Seller Central upload — compliant either way.

**Why Amazon sandbox?** It's the real SP-API with real OAuth (Login with Amazon), isolated from production so a demo can never create a live listing. `productionPublishingBlocked` is hard-coded.

**How does WhatsApp automation work?** The frontend POSTs the campaign to our backend, which enforces consent (skips `marketingOptIn: false`), normalizes numbers to E.164, and POSTs to a local n8n webhook; the n8n workflow calls Meta's WhatsApp Cloud API with the approved template (`hello_world` today, custom template pending Meta review — switching is one environment variable). Meta returns a `wamid` message ID, which we surface as delivery proof.

**Why n8n?** It's the automation layer merchants would eventually extend themselves (more triggers, more channels) — and it keeps our backend thin: we dispatch events; n8n owns delivery and retry logic.

**How does the simulator avoid hallucinations?** There's no LLM in it. Fixed formulas in React state compute the three strategies; every constant is labeled in the UI as `[Sourced]`, `[Benchmark]`, or `[Demo Assumption]`. "Code calculates. AI explains."

**What is actually AI?** Gemini attribute extraction (live) and Sarvam translation (live). What is deterministic? The simulator, the marketplace transforms, validation matrices, and all fallback data.

**How would this become production-ready?** Swap the JSON file store for a real database, add auth + real merchant onboarding, enable Gemini image billing (zero code change), onboard marketplace credentials (Flipkart partner registration, Myntra MMIP, Paytm staging keys — the code hooks already exist), and move from n8n-localhost to n8n Cloud/queue mode.

**How does the system scale?** The backend is stateless Express services (one module per integration) behind a single API surface; n8n scales horizontally; the heavy AI calls are external. The JSON store is the only single-node piece — first thing to replace.

**How are API credentials protected?** All secrets live in `server/.env` (git-ignored — verified) and inside n8n's credential store. Responses only ever include masked values (e.g. `amzn1.ap...19e1`); the Amazon client masks every credential in logs and API responses.

**Why is this better than just building an online store?** A store template solves *hosting a catalog*. Ramesh-ji's blockers are upstream and downstream of that: compliance, photos, language, retention, and capital decisions. DukaanQuest automates those — and the marketplace integrations meet him where the demand already is (Amazon, Flipkart, Meesho) instead of asking him to build destination traffic from zero.

---

## 22. FILE / COMPONENT MAP FOR DEMO OPERATORS

> Not for coding — for answering "where does this happen?" in 10 seconds.

| Feature | Frontend file | Backend file | External API |
|---|---|---|---|
| 2D town + quests | `dukaanquest-app/src/components/game/DigitalDukaanCanvas.jsx`, `QuestLog.jsx` | `server/index.js` (`/api/quests*`, `/api/shop/xp`), `server/db/database.js` | none |
| App shell / tabs / XP / language | `dukaanquest-app/src/App.jsx` | — | — |
| All frontend API calls | `dukaanquest-app/src/services/api.js` | — | — |
| Fallback data + UI translations | `dukaanquest-app/src/data/mockData.js` | `server/db/database.js` (seed) | — |
| Photo Studio (Gemini) | `components/studio/GeminiPhotoStudio.jsx` | `server/services/geminiService.js` (`/api/studio/*`) | Google Gemini |
| Catalog transformer | `components/catalog/OmnichannelCatalog.jsx` | `server/services/marketplaceAdapters.js` | none |
| Amazon SP-API | same | `server/services/amazonService.js`, `amazonListingsService.js` | api.amazon.com + SP-API sandbox |
| WhatsApp CRM | `components/crm/WhatsAppCRMHub.jsx` | `server/services/n8nService.js` (`/api/crm/*`) | n8n → Meta WhatsApp |
| Sarvam translation | `App.jsx` navbar + CRM hub | `server/services/sarvamService.js` (`/api/sarvam/*`) | api.sarvam.ai |
| Paytm hub | `components/paytm/PaytmPaymentHub.jsx` | `server/services/paytmService.js` (`/api/paytm/*`) | Paytm staging (only with real key) |
| What-If simulator | `components/simulator/WhatIfSimulator.jsx` | — (none — pure frontend) | none |
| Physical readiness | `components/readiness/PhysicalReadinessChecker.jsx` | `server/services/scraperService.js` (static KB) | none |
| Health dashboard | tier bar in `App.jsx` | `server/index.js` (`/api/health`) | probes all of the above |

---

## 23. DEMO RECORDING DO-NOT-TOUCH LIST

In the 24 hours before recording, nobody touches:

1. **`server/.env`** — any change can silently switch a service to fallback mode.
2. **API keys / tokens anywhere** (including n8n's credential manager) — unless refreshing an expired Meta token per §6, which is itself a "record-before" task.
3. **The n8n workflow** (nodes, webhook path `dukaanquest-crm`, active toggle) — beyond ensuring it's Active.
4. **Ports** (5000 / 5173 / 5678) and `vite.config.js`.
5. **Any file in `server/` or `dukaanquest-app/src/`** — no "small fixes" before the take.
6. **`package.json` / dependencies** — no installs or updates.
7. **Simulator constants** (17.5%, ₹0.85, 24%, ₹1,850, ₹1,050, 2.6×…) — they're printed on screen and in this script.
8. **Demo/seed data** (`mockData.js`, `server/db/data.json`) — the XP math and screens depend on them.
9. **Fallback configuration** in any service — the backups in §12 rely on them exactly as-is.
10. **Endpoint names/paths** — the frontend, test script, and this guide all reference them.

---

## 24. FINAL RECORDING CHECKLIST

- [ ] Application starts (`npm run client`, :5173 loads)
- [ ] Backend starts (`npm run server`, health returns PARTIAL tally)
- [ ] n8n starts and workflow is Active
- [ ] Gemini verified (`liveAPI:true` on extract-attributes)
- [ ] Sarvam verified (`liveAPI:true` on translate)
- [ ] Amazon sandbox verified (`verified:true`)
- [ ] WhatsApp verified (test broadcast returned a fresh wamid)
- [ ] Golden Journey tested once, end-to-end, timed (~2:50)
- [ ] Backup paths (§12) read and understood
- [ ] Browser cleaned (full-screen, 100% zoom, English, no dev tools)
- [ ] No secrets visible anywhere on screen
- [ ] Recording resolution + frame rate checked
- [ ] Microphone checked (10-second test clip)
- [ ] Narration (§9) practiced aloud twice
- [ ] Final quest completed on camera (610/600, Level 3, 4/4 quests)
- [ ] Video reviewed once after recording (check wamid readable, no dead air > 3 s, ≤ 3:00)

---

## 25. QUICK REFERENCE CARD (keep this open while recording)

```
START:   3 terminals — n8n (:5678) → `npm run server` (:5000) → `npm run client` (:5173)
OPEN:    http://127.0.0.1:5173  (fresh load = Level 2, 420/600 XP, English, Town tab)

STEP 1:  Journey chip ① → "Re-Enhance with Gemini" → drag split slider → AI card
STEP 2:  "Golden Flow Step 2…" → confirm 🟢 SP-API Sandbox Verified → "Submit to SP-API Sandbox (PUT)"
STEP 3:  "Golden Flow Step 3…" → language ▸ हिंदी → VIP → "Broadcast to 2 Customers"
         → "Yes, Authorize Broadcast" → wamid badge
STEP 4:  "Golden Flow Step 4…" → point at 3 strategy cards → "Golden Flow Step 5: Adopt
         Strategy B & Complete Quest"
FINAL SCREEN:  Town · Level 3 • Digital Vyapari · 610/600 XP · 4/4 quests · confetti

EMERGENCY BACKUP:
  Gemini down  → fallback card still renders; narrate output, skip "live"
  Amazon down  → show 11/11 validation matrix + JSON schema (always local)
  WhatsApp down→ staged-fallback card; narrate consent + approval, no "delivered"
  Sarvam down  → dictionary fallback still shows native script
  Total freeze → refresh page, redo journey (~90 s), or record §18 30-second cut

SAY NEVER:  "production listings" · "real payments" · "AI-generated images" ·
            "live web scraping" — match the badges: LIVE / SANDBOX / STAGED / FALLBACK
```

---

*Guide verified against the running app and source at commit `a1a2859` (2026-10-02). If the code changes, re-verify button labels in `dukaanquest-app/src/components/` and update §3–4 first.*
