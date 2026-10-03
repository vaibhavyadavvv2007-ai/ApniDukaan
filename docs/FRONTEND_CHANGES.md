# DukaanQuest frontend review guide

Branch: `joshua-improvements`

Baseline: `6a8f5e0` (`readme`)

Prepared: 3 October 2026

## Purpose

Make the HackSprint PS-21 prototype easier to understand and demonstrate through one connected merchant journey:

**Add a product → confirm its details → export a listing draft → prepare a customer campaign.**

The changes focus on the frontend. Backend source, integration credentials, database records and dependency manifests are unchanged. This guide describes the implementation on this branch; some descriptions in the original README refer to the previous interface.

## Before and after

| Area | Previous interface | This branch |
| --- | --- | --- |
| Dashboard | Large repeated journey panel, revenue-led dashboard, several fixed counts and status claims | Action-led overview with an illustrated storefront, current draft, completeness counts and next actions |
| Navigation | Integration-oriented names such as Gemini AI Studio and n8n WhatsApp CRM | Merchant-oriented Product studio, Marketplace listings, Customer campaigns and Growth planner |
| Progress | Quest/XP-driven progress, including manually completable milestones | Four milestones based on the current draft: photo, review, CSV export, campaign download |
| Product handoff | Studio-to-catalogue navigation changed screens without carrying edited analysis | One shared product draft feeds the studio, listing and campaign |
| Persistence | Screen-local studio state | One draft saved in browser localStorage, with a visible warning if persistence fails |
| Studio image | Prepared catalogue assets displayed as the enhanced view | Original photo remains visible unless the response contains an actual live generated image; then a comparison slider is available |
| AI output | Fallback details could appear as AI analysis | Only verified live text results populate AI title/description; unavailable AI leaves manual entry available |
| Validation | Some missing fields gained defaults or automatically passed | Explicit checks for photo, title, brand, positive finite price, integer stock, material, dimensions and description |
| Downloads | Studio Download all displayed an alert | Listing CSV, product copy, campaign text and locally uploaded/generated displayed images can be downloaded |
| Marketplace presentation | Technical adapters and payloads dominated | Shopper-facing previews for Amazon, Flipkart and Meesho; existing Amazon sandbox action tucked into Advanced |
| Campaigns | Fixed collection copy and demo payment link, with success-like fallback states | Product-specific phone preview, editable discount, audience filtering and campaign download; live adapter remains an advanced action |
| Customer selection | Missing opt-in could be treated as consent | Only records with `marketingOptIn === true` are included |
| Growth planner | Fixed WhatsApp recommendation; target slider did not affect recommendation | Editable assumptions, visual comparisons, and budget/target-sensitive recommendations |
| HTTP handling | JSON could be treated as success even on a failing HTTP status | Shared response handling throws on non-2xx responses |
| Responsive layout | Repeated large panels and narrow-screen overflow | Compact journey, stacked mobile forms/cards, and wrapping planner labels |

## Product workflow

### Product studio

- Upload an image up to 12 MB; the browser resizes it to at most 1000 pixels on its longest side and stores a JPEG copy in the draft.
- Alternatively, load a clearly labelled sample product for a demonstration without API credentials.
- AI analysis is an explicit action using the existing `/api/studio/upload` endpoint. Upload your own photo to test it; sample remote photos are intended for manual editing.
- Live text extraction can fill the title and description. Material and dimensions remain merchant-confirmed fields.
- The original photo stays visible when image generation is unavailable. A returned live image is used for the comparison, rather than a prepared substitute.
- Complete every required field and confirm the details to continue.
- Replacing the photo starts a new product draft. Loading a sample asks before replacing an existing draft.

### Marketplace listings

- The same confirmed product appears in each platform preview.
- Download a generic listing CSV or plain-text product copy.
- CSV export marks the listing-preparation milestone complete; it does not publish anything.
- The existing Amazon sandbox endpoint remains accessible under Advanced when health reports `SANDBOX`. The returned response is shown; production publication is not part of this flow.

### Customer campaigns

- The selected product, shop/brand and selling price populate a phone-style preview.
- Discount changes update the displayed offer price.
- Audience selection uses loaded customer tags and explicit marketing opt-in.
- English drafts work without credentials. Hindi, Kannada and Tamil use the existing Sarvam endpoint on request; non-live translation responses are not presented as successful translation.
- Campaign preferences and a successful translation are stored with the browser draft. Translations are keyed to the message/language so stale text is not used after an offer changes.
- Downloading the campaign records preparation, not sending.
- Advanced delivery uses the existing backend-configured WhatsApp template, which can differ from the preview. It requires reported LIVE WhatsApp and n8n status, opted-in recipients, reviewed product details and a confirmation. It does not attach a payment link.
- No customer messages were sent during frontend verification.

### Editing after completion

Changing a product detail clears review, export and campaign-completion markers. This prevents an outdated exported listing or campaign from appearing current. Changing campaign settings clears campaign preparation.

## Design changes

The warm dark/saffron identity is retained. The new overview uses a CSS storefront illustration, stronger headings, compact navigation, a draft card and next-step actions. The isometric town is retained behind an expandable section rather than leading the dashboard. Listing previews use a light product-card surface; campaigns use a phone frame. The primary workflow was checked at desktop width and a 390-pixel mobile viewport.

The new primary interface is English. Regional-language campaign translation remains available; this branch does not provide a fully translated application shell.

## Growth planner assumptions

The planner is an illustrative comparison, not a forecast or measured business outcome.

- Customer campaign orders: `floor(customers × conversion / 100)`, with an assumed ₹1 message cost per customer.
- Marketplace orders: `floor(budget / max(price, 1) × 2)`.
- Local advertising orders: `floor(budget / max(price, 1) × 1.6)`.
- Contribution: revenue minus item costs, campaign spend and the marketplace fee assumption.
- Recommendations exclude unaffordable or non-positive-contribution scenarios. Among eligible scenarios, those reaching the sales target are preferred; the highest contribution then wins.
- Tax, shipping and returns are excluded. Replace the demo multipliers with validated assumptions before using this for real business decisions.

## Changed files

Paths below are relative to the repository root.

| File | Responsibility |
| --- | --- |
| `dukaanquest-app/src/App.jsx` | New overview and navigation; shared draft; browser persistence; progress derived from draft actions |
| `dukaanquest-app/src/components/ProductWorkspace.jsx` | New studio/editor, completeness checks, listing previews and exports; existing AI and sandbox endpoint connections |
| `dukaanquest-app/src/components/crm/WhatsAppCRMHub.jsx` | Product-aware campaign preview, discounts, saved campaign settings, translation and advanced delivery |
| `dukaanquest-app/src/components/simulator/WhatIfSimulator.jsx` | Editable assumptions, charts and dynamic recommendations |
| `dukaanquest-app/src/services/draft.js` | Draft factory, validation, invalidation, CSV encoding, downloads and scenario calculations |
| `dukaanquest-app/src/services/api.js` | Shared HTTP response/error handling |
| `dukaanquest-app/src/index.css` | New workspace styling and responsive overrides |
| `dukaanquest-app/vite.config.js` | Local API proxy targets `127.0.0.1:5001` |
| `dukaanquest-app/tests/draft.test.mjs` | Four focused Node tests |
| `README.md` | Entry point to this branch-specific review guide |
| `docs/FRONTEND_CHANGES.md` | This guide |

The old `GeminiPhotoStudio.jsx`, `OmnichannelCatalog.jsx` and `QuestLog.jsx` remain in the repository but are not mounted by the new main workflow. Packaging and payment components, the digital town component, backend adapters and reference datasets are retained. No package dependencies were added.

## Local setup

Run these commands from the repository root:

```bash
npm --prefix server install
npm --prefix dukaanquest-app install
```

Create `server/.env` from `server/.env.example` if needed. Keep credentials local. Set `PORT=5001`, or use the explicit port override below. Port 5001 avoids the port-5000 conflict encountered on the development Mac.

Terminal 1 (macOS/Linux):

```bash
PORT=5001 npm run server
```

Terminal 2:

```bash
npm run client
```

Open `http://127.0.0.1:5173/`. The frontend API proxy in this branch points to port 5001. For Windows, set `PORT=5001` in `server/.env` and run `npm run server`.

If you keep the backend on port 5000 instead, change the Vite proxy target to match it. Any configured local callback URLs must also match the backend port. This branch does not change the committed environment template.

The sample/manual product workflow runs without API keys. Live image generation, translation, sandbox submission and delivery require the teammate's valid configuration and separate integration verification.

## Review walkthrough (no live sends)

1. Open Product studio and choose **Try a sample product**.
2. Edit the product title and description to mark it as a demo. Fill in brand, material and size/dimensions.
3. Confirm the details. Verify the same image, price and edited text appear in Marketplace listings.
4. Download the listing CSV and product copy. Inspect the files; they are generic drafts, not marketplace-approved templates.
5. Prepare a campaign. Change the discount and verify the offer price changes in the phone preview.
6. Download the campaign draft. No message should be sent.
7. Refresh. Confirm the product and campaign settings persist in this browser.
8. Edit a product field. Confirm the old review/export/campaign milestones clear.
9. In Growth planner, vary audience, cost, budget and target. Check recommendations and negative outcomes change appropriately.
10. Repeat on a narrow viewport; navigation, forms and charts should fit without horizontal scrolling.

Browser storage is origin-specific: `localhost:5173` and `127.0.0.1:5173` hold separate drafts.

## Verification

Automated checks run successfully during implementation:

```bash
node --test dukaanquest-app/tests/draft.test.mjs
npm run build
npm --prefix dukaanquest-app run lint
```

The four tests cover:

1. Required fields and invalid numeric inputs.
2. Downstream invalidation after editing a product.
3. CSV quoting, multiline content and leading formula-prefix escaping.
4. Recommendations changing with audience/target and avoiding losing scenarios.

The production build passed. Lint completed without errors; existing unused-variable warnings remain in retained legacy components. Browser checks covered sample editing, product handoff, CSV/campaign downloads, persistence, milestone invalidation, phone-sized layouts and console errors. The planner overflow found during review was fixed.

Not verified with live credentials: AI image generation, live text extraction, regional-language translation, Amazon sandbox submission, WhatsApp delivery, and payment actions.

## Limitations and integration review before merging

- One browser-local product draft, not a server-synced multi-product catalogue. Large generated images may exceed storage quota; the app shows a warning.
- Product data checks confirm completeness, not material authenticity, marketplace compliance or approval.
- CSVs and platform previews are generic; platform-specific upload mappings must be confirmed separately. Myntra/Nykaa adapters remain in the backend but are not exposed in the simplified listing tabs.
- No live publication, payment settlement or delivery is implied by completing the four-step journey.
- Advanced delivery is deliberately separate from the preview because the existing backend may use a configured test template. The teammate should check template mapping and health classifications before enabling a real demo.
- Server-loaded shop/customer records may be sample data. Counts reflect those records, not independent real-world verification.
- The new workflow replaces the old quest-completion and XP controls. Town visuals now follow draft progress; this does not migrate or update backend XP.
- Payment and packaging screens retain their previous behaviour and reference content; they were not redesigned or validated against current provider rules.
- Human review is still needed for AI descriptions, generated images, assumptions and regional-language output.

Merge through a reviewed pull request. The intended base is `main`; no direct update to `main` is part of this change.
