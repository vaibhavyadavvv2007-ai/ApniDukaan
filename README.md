# DukaanQuest

## Frontend redesign review (`joshua-improvements`)

This branch introduces a connected, browser-saved product → listing → campaign
workflow and a redesigned dashboard. Read the **[frontend change guide](docs/FRONTEND_CHANGES.md)**
for before/after comparisons, setup on port **5001**, file-level changes, testing,
and integration limitations before merging. The sections below describe the
previous interface and are retained for reference.

---

A merchant-first, gamified omnichannel growth copilot for traditional Indian
retailers. It packages three real jobs — **getting stock ready for Amazon,
Flipkart, Myntra and Nykaa**, **reaching walk-ins back on WhatsApp**, and
**deciding where a small ad or a WhatsApp campaign pays** — behind one dark
interface a merchant wants to use, in the language they actually speak.

The UI is a frontend-only rewrite. The backend and all integration services are
untouched; this app only reads data and calls them through the same `/api`
routes.

---

## What you get

| Area | Screen | What the merchant does |
| ---- | ------ | ---------------------- |
| Physical prep | **Physical Readiness** | Check Amazon / Flipkart / Myntra packaging, labeling and compliance boxes, earn XP, print the checklist. |
| Photo studio | **Gemini AI Studio** | Upload a phone photo of a saree/kurta, get a studio version, a listing title and compliance read. |
| Catalog transform | **Catalog Transformer** | Pick one product and see the Amazon SP-API payload plus how the same item fits Flipkart, Meesho and Nykaa. |
| WhatsApp CRM | **n8n WhatsApp CRM** | Segment registered customers, translate the message into their tongue, approve once, dispatch to WhatsApp with a Paytm link. |
| What-if sim | **What-If Simulator** | Set budget, customer count and target revenue; compare "sell on marketplaces", "win back customers" and "advertise nearby" with transparent, cited assumptions. |
| Payments | **Paytm Payment Hub** | Generate a Paytm payment link / counter QR standee for a customer paying in person or online. |
| Growth | **Town & Copilot** | Isometric digital plot of the shop and its four engines, with a Golden Journey stepper and milestone quests. |

**Five journey steps** map to real business progress, not page visits:
`Photograph` → `List once` → `Reach customers` → `Simulate` → `Grow`.
Each step is done only when its quest is genuinely completed or its readiness
checklist is at 100 %.

---

## Tech stack

- **Frontend:** React 19 + Vite 8 (TypeScript not used; `oxlint` is the linter).
- **Rendering:** plain DOM + Canvas 2D for the isometric town; no UI framework.
- **State/routing:** single `App.jsx` with tab state; screens are mounted
  conditional per tab (no router).
- **Data:** server JSON store; this frontend keeps a fully offline fallback
  (`src/data/mockData.js`) so the shell renders before the API answers.
- **Fonts:** IBM Plex Sans + Mono (UI and numbers), Noto Sans for Devanagari /
  Kannada / Tamil; four interface languages (English, Hindi, Kannada, Tamil).
- **Icons:** Lucide React.
- **Visual identity:** warm ink + saffron, one radius set (`--r-sm 6` /
  `--r-md 10` / `--r-lg 14`), one spacing scale (`--s1`–`--s8`). No gradients,
  glows, or decorative animation in the UI layer.

---

## Project layout

```
dukaanquest-app/
  index.html
  vite.config.js          # Vite 5173 -> proxy /api -> backend 5000
  package.json            # react, react-dom, canvas-confetti, lucide-react
  src/
    main.jsx              # root render + global stylesheet
    App.jsx               # shell, state, journey logic, health sync
    index.css             # v3 design tokens and UI component classes
    services/
      api.js              # one client per backend endpoint
    data/
      mockData.js         # offline fallback: shop, rules, products, customers, quests, translations
    components/
      game/
        DigitalDukaanCanvas.jsx   # isometric town + inspector + keyboard nav
        QuestLog.jsx              # milestones/quests with XP
      readiness/
        PhysicalReadinessChecker.jsx
      studio/
        GeminiPhotoStudio.jsx
      catalog/
        OmnichannelCatalog.jsx
      crm/
        WhatsAppCRMHub.jsx
      simulator/
        WhatIfSimulator.jsx
      paytm/
        PaytmPaymentHub.jsx
```

`server/` (Express REST API, Gemini, Sarvam, n8n, Paytm, Amazon SP-API) is
deliberately **not** part of this repository and is not modified by this work.

---

## Before running

1. Start the backend on `http://localhost:5000` (the shared `server/`).
2. `cd dukaanquest-app`
3. `npm install`
4. `npm run dev` → `http://localhost:5173`

Vite proxies `/api/*` to the backend, so every call in `src/services/api.js`
works as written against a running server.

The backend /api/health contract you must build against:

- `/api/health` returns `overall` (`"ok"` | `"partial"`) **not** `status`,
  plus `integrationSummary`, `services`, `app`, `version`, `timestamp`.
- `/api/quests` entries have no `building` key; the frontend maps them with
  `QUEST_BUILDING = { 'quest-01': 'warehouse', ... }` so the town plot stays
  truthful.
- `health.services.<key>.classification` drives the per-integration state
  (LIVE / SANDBOX / STAGED / FALLBACK). Hardcoded UI claims are not used.

---

## Available scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Vite dev server on port 5173. |
| `npm run build` | Production build (`vite build`). |
| `npm run lint` | `oxlint` over `src/`. |
| `npm run preview` | Serve the production `dist/` locally. |

---

## How the frontend stays honest

- The integrations panel is never hardcoded. Before `/api/health` returns, it
  shows a staged fallback; once the API answers, every label and state comes
  from the live payload:
  `Gemini / Sarvam / n8n → LIVE`, `WhatsApp → STAGED`,
  `Amazon → SANDBOX`, `Paytm → FALLBACK`, plus `photoStudio / flipkart /
  meesho / myntra / nykaa → STAGED`.
- The header shows **"Systems connected"** only once `health.overall` is
  `ok` or `partial` (a `partial` verdict still means the API answered).
  The `integrationCounts` line below it reports `LIVE / SANDBOX / STAGED /
  FALLBACK` from `health.integrationSummary`.
- Mosaic and mechanisms that cannot run for real (Paytm demo link, WhatsApp
  staged dispatch, n8n bridge) are clearly marked with `[DEMO LINK]`,
  "Demo", "staged workflow", "no live send was made" — never implied as live.
- The "Send to sandbox" button submits to the Amazon sandbox; production is
  unreachable from this screen and the payload sent is branded as sandbox.

---

## Assets

`public/favicon.svg` and `public/icons.svg` are the only file assets. Product
photos are remote Unsplash URLs referenced from `src/data/mockData.js`; no
images are committed.

---

## Browser requirements

Chrome/Edge/Firefox/Safari, WebGL-less canvas, modern React 19. Needs
`createRoot` (React 18+) and `fetch` (all current browsers).

---

## Notes for contributors

- Do not add a router, new CSS components, or new fonts. The design system in
  `src/index.css` is the single source of visual style.
- Pay attention to `App.jsx` state: `go(id)` drives both the sidebar and the
  Golden Journey, `stepDone()` is the single source of truth for what "done"
  means, and `visitedSteps` was removed so a screen visit is never progress.
- If you touch the integration panel, read the `/api/health` contract at the
  top of this file again — the `overall` field and the service classification
  are the two facts the UI is derived from.
