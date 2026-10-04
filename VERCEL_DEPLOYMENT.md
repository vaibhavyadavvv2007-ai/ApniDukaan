# Vercel Deployment — ApniDukaan (DukaanQuest)

Guide for deploying both projects from this one GitHub repository. The
application is **not deployed yet**; this document prepares and verifies it.

Two separate Vercel projects are used, one per root directory:

| Project | Root Directory | Framework | Result |
|---|---|---|---|
| Frontend | `dukaanquest-app` | Vite | Static SPA in `dist/` |
| Backend | `server` | Express (auto-detected) | Single serverless Function |

---

## 1. What changed to make this deployable

No product behaviour, route, or integration was removed or mocked. The changes
are deployment plumbing only.

| File | Change |
|---|---|
| `dukaanquest-app/src/services/api.js` | API origin resolved from `VITE_API_BASE_URL`; still `/api` (Vite proxy) when unset |
| `dukaanquest-app/src/utils/imageBudget.js` | **New.** Shrinks uploads to fit Vercel's 4.5 MB body ceiling |
| `dukaanquest-app/src/components/crm/WhatsAppCRMHub.jsx` | Status poll uses `apiUrl()` instead of hardcoded `http://127.0.0.1:5000` |
| `dukaanquest-app/src/components/studio/GeminiPhotoStudio.jsx` | Upload passes through `fitImageToBudget()` |
| `dukaanquest-app/src/components/ProductWorkspace.jsx` | Draft data URL verified against budget; upload fitted |
| `dukaanquest-app/.env.example` | **New.** Documents `VITE_API_BASE_URL` |
| `server/index.js` | Exports the app for Vercel; configurable CORS; error handler; persistence reported in `/api/health` |
| `server/db/database.js` | `saveDB()` returns a boolean instead of throwing; added `getPersistenceStatus()` |
| `server/services/n8nService.js` | `N8N_WEBHOOK_URL` resolver that will not fall back to `localhost` when `VERCEL=1` |
| `server/.env.example` | Documented deployment variables and the n8n requirement |

---

## 2. GitHub preparation

1. Confirm `server/.env` is ignored and untracked:

   ```bash
   git check-ignore -v server/.env
   git ls-files server/.env      # must print nothing
   ```

2. Commit the changes and push to the branch you deploy from.

3. Never add `server/.env` to the commit. `.env.example` files contain names
   and empty values only.

---

## 3. Frontend Vercel project

Import the repository, then set:

| Setting | Value |
|---|---|
| Root Directory | `dukaanquest-app` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

No `vercel.json` is needed — Vercel's Vite preset handles build and output.

### Environment variable

```
VITE_API_BASE_URL=https://<your-backend>.vercel.app
```

- Bare origin, **no trailing slash**, **no `/api` suffix** (the client appends
  `/api`). A trailing slash is tolerated and stripped.
- Leave it **empty** for local development.
- Vite inlines `VITE_*` values at build time, so this must be set **before the
  build**. Changing it later requires a redeploy, not just a restart.

---

## 4. Backend Vercel project

Import the same repository as a second project, then set:

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Framework Preset | Express (detected automatically) |
| Build Command | *(leave empty)* |
| Output Directory | *(leave empty)* |
| Install Command | `npm install` |

Vercel detects `server/index.js`, which now ends with:

```js
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => { /* local only */ });
}
```

`module.exports` is what Vercel invokes as the request handler. The
`require.main` guard means local `node index.js` still binds a real port, while
the deployed function binds none. No `vercel.json` is required.

### Node version

`server` uses `node:sqlite` (via n8nService) and modern syntax. Set
**Node 22 or newer** under Project Settings → Runtime, or add an `engines`
field.

---

## 5. Environment variables (backend)

Set these in the backend project's **Settings → Environment Variables**. They
apply to Production and Preview as appropriate.

> Never place a secret in a `VITE_` variable. Everything prefixed `VITE_` is
> shipped to the browser and is public.

### Required for correct deployment

| Variable | Example | Purpose |
|---|---|---|
| `FRONTEND_URL` | `https://<frontend>.vercel.app` | CORS allowlist. Comma-separate for multiple origins |
| `N8N_WEBHOOK_URL` | `https://<public-n8n-host>/webhook/dukaanquest-crm` | WhatsApp automation target — see §6 |

`PORT` is supplied automatically by Vercel. Do not set it.

### Required for each integration to be LIVE

A missing key does not break the app; the service reports `FALLBACK` and the UI
labels it honestly.

| Variable | Effect when unset |
|---|---|
| `GEMINI_API_KEY` | Photo Studio text analysis falls back to canned content (`FALLBACK`) |
| `SARVAM_API_KEY` | Translation falls back to the curated dictionary (`FALLBACK`) |
| `AMAZON_LWA_CLIENT_ID`, `AMAZON_LWA_CLIENT_SECRET`, `AMAZON_SANDBOX_REFRESH_TOKEN` | Amazon verification reports not configured |
| `PAYTM_MERCHANT_KEY` | Payments stay in demo/staged mode |
| `META_WEBHOOK_VERIFY_TOKEN` | Meta cannot verify the delivery-status callback |
| `WHATSAPP_TEMPLATE_NAME`, `WHATSAPP_TEMPLATE_LANG` | Falls back to the built-in template registry |

The Meta access token is **not** set here. It lives in the n8n credential store
on the n8n host, which is the correct place for it.

`server/.env.example` documents every name. It contains no values.

---

## 6. n8n must be publicly reachable — **deployment blocker for WhatsApp**

This is the one thing that **cannot** be solved in code.

Vercel functions run outside your machine. They cannot reach
`http://localhost:5678`. Your current WhatsApp flow is:

```
browser → Vercel backend → n8n (localhost:5678) → Meta WhatsApp
                             ^^^^^^^^^^^^^^^^^^^^
                             unreachable from Vercel
```

You need n8n hosted where the public internet can reach it. Options:

1. **n8n Cloud** — hosted, public URL. Easiest.
2. **Self-hosted behind a tunnel** (ngrok, cloudflared) — works, but the URL
   changes on restart unless you pay for a fixed domain.
3. **n8n on a public VM** — most stable, needs a server.

Then set `N8N_WEBHOOK_URL` on the backend to the public URL and confirm the
workflow's production webhook path is registered (not `/webhook-test/`, which
only exists while the n8n editor is open).

### What happens if you skip this

The backend reports `n8n.verificationStatus = "NOT_CONFIGURED"` and
`classification = "FALLBACK"`. `POST /api/crm/broadcast` returns
`executionStatus: "N8N_NOT_CONFIGURED"` and **no message is sent**.

This is deliberate. The alternative — silently falling back to localhost — would
produce a misleading network error and could imply a send was attempted when it
was not.

---

## 7. Database limitation — **deployment blocker for saved progress**

`server/db/data.json` is a committed JSON file, and `server/db/database.js`
writes to it with `fs.writeFileSync`.

Vercel Functions have a **read-only filesystem outside `/tmp`**, and `/tmp` does
not persist between invocations. Writes therefore cannot succeed in production.

### Affected features

| Feature | Endpoint | Behaviour in production |
|---|---|---|
| XP progression and level-up | `PUT /api/shop/xp` | Applies to the response, **not saved**; resets on next request |
| Quest completion | `POST /api/quests/complete` | Same |
| Packaging checklist toggles | `POST /api/readiness/toggle` | Same |
| Product creation | `POST /api/products` | Same |
| WhatsApp delivery-status log | `POST /api/whatsapp/status` | Status webhooks are accepted (HTTP 200) but **not retained** |

Reads (`GET /api/shop`, `/api/products`, `/api/quests`, `/api/readiness`,
`/api/crm/customers`) all continue to work and return the committed seed data.

### How this is surfaced

- `GET /api/health` reports `persistence.mode` as `READ_ONLY_SEED` with a
  `writable: false` flag and an explanation.
- Every write endpoint returns `persisted: false` plus the same `persistence`
  object. **Nothing pretends a write succeeded.**
- `saveDB()` returns `false` rather than throwing, so the UI keeps working.

Local development is unaffected: `persistence.mode` is `PERSISTENT_FILE` and
writes behave exactly as before.

### Fixing it

Move the store to a hosted database (Postgres, Turso, Neon) and replace
`loadDB`/`saveDB`. The frontend already treats these as fire-and-forget calls
with local state, so the UI needs no change. This is deliberately **not**
included here because it is a schema change, not deployment plumbing.

---

## 8. Request size limit

Vercel rejects request bodies over **4.5 MB**. Two routes send images:

- `POST /api/studio/upload` (multipart)
- `POST /api/studio/enhance`, `/generate-image`, `/extract-attributes` (JSON base64, which inflates ~33%)

`dukaanquest-app/src/utils/imageBudget.js` now resizes client-side to a **3 MB**
budget before upload, leaving headroom for multipart overhead. The analysis
pipeline is unchanged — smaller pixels, same Gemini request, same response.

Without this, real phone photos (commonly 3–8 MB) would fail on Vercel while
working fine locally.

---

## 9. CORS

`server/index.js` allows an origin only when it matches `FRONTEND_URL` or is a
known local dev origin (`:5173`, `:4173`).

| Request `Origin` | Result |
|---|---|
| No `Origin` header (curl, server-to-server, Meta webhook) | Allowed |
| Matches `FRONTEND_URL` | Allowed, header returned |
| `http://localhost:5173` | Allowed (local dev) |
| Anything else | **No** `Access-Control-Allow-Origin` header; browser blocks it |

Set `FRONTEND_URL` to your deployed frontend origin. For multiple environments,
comma-separate:

```
FRONTEND_URL=https://dukaanquest.vercel.app,https://dukaanquest-git-main-you.vercel.app
```

A wildcard (`origin: '*'`) is deliberately **not** used.

---

## 10. Production URLs

After deploying both projects, record the real values here.

| What | Value |
|---|---|
| Frontend | *(fill in after deploy)* |
| Backend | *(fill in after deploy)* |
| `VITE_API_BASE_URL` | *(set to the backend origin)* |
| `FRONTEND_URL` on backend | *(set to the frontend origin)* |
| `N8N_WEBHOOK_URL` | *(set to the public n8n URL — see §6)* |

Deploy order matters: create the **backend first** so its URL exists, then set
`VITE_API_BASE_URL` on the frontend and redeploy it. Then set `FRONTEND_URL` on
the backend using the frontend's URL.

---

## 11. Post-deployment testing

**Backend — run these against the deployed backend URL:**

```bash
# 1. Health, including real integration tiers and persistence mode
curl -s https://<backend>/api/health | python -m json.tool

# 2. Reads
curl -s https://<backend>/api/shop
curl -s https://<backend>/api/products
curl -s https://<backend>/api/crm/template-status

# 3. CORS preflight from the deployed frontend origin
curl -si -X OPTIONS https://<backend>/api/health \
  -H "Origin: https://<frontend>" \
  -H "Access-Control-Request-Method: GET" | grep -i access-control

# 4. Negative CORS check — must return NO allow-origin header
curl -si https://<backend>/api/health \
  -H "Origin: https://evil.example.com" | grep -i access-control || echo "correctly blocked"
```

**Frontend:**

1. Open the deployed URL and hard-refresh.
2. Open the browser console — **confirm zero errors**.
3. Click through all eight screens: Overview, Product studio, Gemini AI Studio,
   Marketplace listings, Customer campaigns, Growth planner, Packaging
   checklist, Payments.
4. In DevTools → Network, confirm requests go to the **backend origin**, not to
   `127.0.0.1`.
5. Upload a real phone photo in the Gemini Photo Studio — it should complete
   rather than fail on size.

**Confirm the honest-status contract still holds:** `/api/health` must report
`LIVE` / `SANDBOX` / `STAGED` / `FALLBACK` accurately, and
`persistence.mode` must say `READ_ONLY_SEED` in production. If a deployed
service claims `LIVE`, verify it against the provider dashboard.

---

## 12. Known limitations after deployment

1. **No persistent saves** — XP, quests, checklist and delivery log (§7).
2. **WhatsApp needs public n8n** — otherwise reports `NOT_CONFIGURED` (§6).
3. **Delivery status webhook needs a public backend URL** — once deployed, the
   backend *is* public, so subscribe
   `https://<backend>/api/whatsapp/status` on the WABA for the `messages`
   field. Until then `GET /api/whatsapp/status/:id` returns
   `{"known": false, "status": "pending"}`, which the UI labels "Accepted by
   Meta" rather than "Delivered".
4. **Images capped at 4.5 MB** by the platform (§8).
5. **Template is `hello_world`** — the approved `MARKETING` template
   (`dukaanquest_new_arrival`) is suppressed by Meta's engagement filter
   (error 131049) for recipients with no engagement history. See
   `server/.env.example` for how to restore personalization with a
   UTILITY-category template.