# ApniDukaan (DukaanQuest)

A merchant-first, gamified omnichannel growth copilot for traditional Indian
retailers. It packages three real jobs — **getting stock ready for Amazon,
Flipkart, Myntra and Nykaa**, **reaching walk-ins back on WhatsApp**, and
**deciding where a small ad or a WhatsApp campaign pays** — behind one dark
interface a merchant wants to use, in the language they actually speak.

This repository is a two-package workspace:

| Package | Stack | Dev port | Purpose |
| ------- | ----- | -------- | ------- |
| `dukaanquest-app/` | React 19 + Vite 8 | 5173 | The merchant-facing interface. |
| `server/` | Node + Express | 5000 | REST API and every third-party integration. |

---

## Quick start

```bash
# 1. Backend dependencies
cd server && npm install && cd ..

# 2. Backend configuration (secrets stay local; the template is committed)
cp server/.env.example server/.env

# 3. Start the API on http://localhost:5000
npm run server

# 4. Frontend dependencies and dev server
npm --prefix dukaanquest-app install
npm run client          # http://localhost:5173
```

The frontend needs no `.env` for local work: it calls the relative path `/api`,
and the Vite dev-server proxy in `dukaanquest-app/vite.config.js` forwards that
to `http://localhost:5000`. The browser therefore stays same-origin in dev and
no CORS round trip is involved.

### Scripts (from the repository root)

| Command | Purpose |
| ------- | ------- |
| `npm run server` | Start the Express API on port 5000. |
| `npm run client` | Start the Vite dev server on port 5173. |
| `npm run build` | Production build of the frontend into `dukaanquest-app/dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm start` | Alias of `npm run server`. |

Inside `dukaanquest-app/`: `npm run dev`, `npm run build`, `npm run lint`
(`oxlint`), `npm run preview`. Inside `server/`: `npm start`, `npm run dev`
(`node --watch`).

Frontend unit test: `node dukaanquest-app/tests/draft.test.mjs`.

---

## Configuration

Secrets are **never committed**. Both packages ship a committed template and
read a git-ignored real file.

### `server/.env`

Copy from `server/.env.example`. Every key is optional — anything you leave
empty degrades to an honest `STAGED` / `FALLBACK` state instead of failing
silently. The groups are: Google Gemini, Sarvam AI, WhatsApp Cloud API
(via n8n), n8n (`N8N_WEBHOOK_URL`, `N8N_API_KEY`, `N8N_BASE_URL`), Paytm,
Amazon SP-API and Flipkart. The template's final section covers the deployment
variables (`PORT`, `FRONTEND_URL`).

### `dukaanquest-app/.env`

Copy from `dukaanquest-app/.env.example` only when you deploy the frontend
separately from the API:

```bash
VITE_API_BASE_URL=https://your-api-host.example
```

Bare origin, no trailing slash, no `/api` suffix — the client appends `/api`.

> `VITE_*` values are **inlined into the client bundle at build time and are
> public**. Never put a token, key or secret in one.

---

## What the app does

| Area | Screen | What the merchant does |
| ---- | ------ | ---------------------- |
| Physical prep | **Physical Readiness** | Check Amazon / Flipkart / Myntra packaging, labeling and compliance boxes, earn XP, print the checklist. |
| Photo studio | **Gemini AI Studio** | Upload a phone photo of a saree/kurta, get a studio version, a listing title and compliance read. |
| Catalog transform | **Catalog Transformer** | Pick one product and see the Amazon SP-API payload plus how the same item fits Flipkart, Meesho and Nykaa. |
| WhatsApp CRM | **n8n WhatsApp CRM** | Segment registered customers, translate the message into their tongue, approve once, dispatch to WhatsApp. |
| What-if sim | **What-If Simulator** | Set budget, customer count and target revenue; compare "sell on marketplaces", "win back customers" and "advertise nearby" with transparent, cited assumptions. |
| Payments | **Paytm Payment Hub** | Generate a Paytm payment link / counter QR standee for a customer paying in person or online. |
| Growth | **Town & Copilot** | Isometric digital plot of the shop and its four engines, with a Golden Journey stepper and milestone quests. |

**Five journey steps** map to real business progress, not page visits:
`Photograph` → `List once` → `Reach customers` → `Simulate` → `Grow`.
A step counts as done only when its quest is genuinely completed or its
readiness checklist is at 100 %.

Four interface languages (English, Hindi, Kannada, Tamil) with an on-device
translation cache in `localStorage`.

---

## Project layout

```
.
├── dukaanquest-app/            # Frontend (React 19 + Vite)
│   ├── index.html
│   ├── vite.config.js          # dev proxy /api -> backend :5000
│   ├── .env.example
│   ├── tests/draft.test.mjs
│   └── src/
│       ├── main.jsx            # root render + global stylesheet
│       ├── App.jsx             # shell, state, journey logic, health sync
│       ├── index.css           # design tokens and UI component classes
│       ├── services/
│       │   ├── api.js          # env-aware client (apiUrl, isCrossOriginApi)
│       │   └── draft.js        # product-draft schema helpers
│       ├── i18n/
│       │   └── TranslationProvider.jsx   # tx(), DO_NOT_TRANSLATE, cache
│       ├── utils/
│       │   ├── imageBudget.js  # compresses uploads under the 4.5 MB body cap
│       │   └── whiteBackground.js
│       ├── data/               # mockData.js (offline fallback), workspace.js
│       └── components/
│           ├── layout/         # WorkspaceSidebar, JourneyRail
│           ├── ProductWorkspace.jsx
│           ├── game/           # DigitalDukaanCanvas, QuestLog
│           ├── readiness/      # PhysicalReadinessChecker
│           ├── studio/         # GeminiPhotoStudio
│           ├── catalog/        # OmnichannelCatalog
│           ├── crm/            # WhatsAppCRMHub
│           ├── simulator/      # WhatIfSimulator
│           └── paytm/          # PaytmPaymentHub
│
├── server/                     # Backend (Node + Express)
│   ├── index.js                # all /api routes, CORS allowlist, error handler
│   ├── .env.example            # committed template — never the real .env
│   ├── .vercelignore           # keeps .env out of any Vercel upload
│   ├── db/
│   │   ├── database.js         # loadDB / saveDB / getPersistenceStatus
│   │   └── data.json           # seed store
│   ├── services/
│   │   ├── n8nService.js               # WhatsApp dispatch + error classification
│   │   ├── whatsappStatusService.js    # per-wamid delivery log
│   │   ├── geminiService.js            # image + copy generation
│   │   ├── sarvamService.js            # translation
│   │   ├── amazonService.js
│   │   ├── amazonListingsService.js
│   │   ├── marketplaceAdapters.js      # Flipkart / Meesho / Nykaa payloads
│   │   ├── paytmService.js
│   │   └── scraperService.js
│   └── test_api.ps1            # manual end-to-end probe (sends a real WhatsApp message)
│
├── README.md
└── VERCEL_DEPLOYMENT.md        # full public-deployment runbook
```

---

## API contract the frontend depends on

- `GET /api/health` returns `overall` (`"ok"` | `"partial"`) — **not** `status` —
  plus `integrationSummary`, `services`, `persistence`, `app`, `version`,
  `timestamp`.
- `health.services.<key>.classification` drives the per-integration state
  (`LIVE` / `SANDBOX` / `STAGED` / `FALLBACK`). No state is hardcoded in the UI.
- Write endpoints return `persisted: boolean` plus `persistence`, so the client
  never claims a save that the filesystem refused.
- `/api/quests` entries have no `building` key; the frontend maps them with
  `QUEST_BUILDING` in `src/data/workspace.js` so the town plot stays truthful.

---

## How the app stays honest

This matters more than any feature here, because most of the integrations are
sandboxed, staged or absent.

- **Integration states come from the API, never from constants.** Before
  `/api/health` answers the panel shows a staged fallback; afterwards every
  label is derived from the live payload.
- **A WhatsApp `wamid` means Meta accepted the request, not that the message
  was delivered.** The backend reports `metaAccepted` and a `deliveryStatus`
  separately, and never claims `LIVE_DELIVERY_CONFIRMED` off a `wamid`.
  Real delivery needs the status webhook on a public backend URL.
- **Error codes are surfaced, not swallowed.** Meta failures are classified
  (`131030` recipient not on the verified allow list, `131049` engagement
  filter) and returned to the merchant with the actual reason.
- **Unconfigured means unconfigured.** With no n8n URL on Vercel, dispatch
  reports `N8N_NOT_CONFIGURED` / `NOT_CONFIGURED` and sends nothing rather than
  silently falling back to a localhost that cannot exist in production.
- **Read-only filesystems degrade loudly.** On Vercel the JSON store cannot
  persist; `saveDB()` returns `false`, `/api/health` reports
  `READ_ONLY_SEED`, and the response says the write was not persisted.

---

## Deployment

Frontend and backend are deployed as **two separate Vercel projects**. The
complete procedure — project settings, environment variables, the CORS table,
the n8n blocker, known limitations and post-deploy test commands — is in
**[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)**.

The short version:

1. Backend: import the repo, set **Root Directory = `server`**, Framework
   Preset = Node.js. `server/index.js` exports the app and calls `app.listen`
   only when run directly, so Vercel's zero-config detection works.
2. Frontend: import the repo, set **Root Directory = `dukaanquest-app`**, and
   set `VITE_API_BASE_URL` to the backend's production origin.
3. On the backend project, set `FRONTEND_URL` to the frontend's production
   origin — CORS uses an explicit allowlist and never a wildcard.
4. `server/.vercelignore` excludes `server/.env` from the upload, but env vars
   still belong in the Vercel dashboard, not in the repo.

Note that ignore files resolve **relative to the configured Root Directory**, so
the root `.gitignore` is not consulted when Root Directory is set.

---

## Tech stack

**Frontend** — React 19, Vite 8, `oxlint` (no TypeScript, no router, no UI
framework). Rendering is plain DOM plus Canvas 2D for the isometric town. Fonts:
IBM Plex Sans + Mono, Noto Sans for Devanagari / Kannada / Tamil. Icons: Lucide
React. Visual identity: warm ink + saffron, one radius set (`--r-sm 6` /
`--r-md 10` / `--r-lg 14`), one spacing scale (`--s1`–`--s8`).

**Backend** — Express 4, `axios`, `cheerio`, `cors`, `dotenv`, `multer`, and a
JSON file store at `server/db/data.json`.

---

## Notes for contributors

- Do not add a router, new CSS components, or new fonts. The design system in
  `dukaanquest-app/src/index.css` is the single source of visual style.
- Watch `App.jsx` state: `go(id)` drives both the sidebar and the Golden
  Journey, and `stepDone()` is the single source of truth for what "done"
  means. A screen visit is never progress.
- Keep uploads under the platform body limit. `src/utils/imageBudget.js`
  compresses and re-encodes images (3 MB / 1280 px ceiling) because Vercel
  Functions reject request bodies over 4.5 MB and that cap is not configurable.
- `server/.env` holds real credentials and is git-ignored. Rotate any token that
  gets printed to a log or a terminal.
- `.claude/`, `.agents/`, `.planning/` and friends are local AI tooling and are
  git-ignored; they are not part of the application.