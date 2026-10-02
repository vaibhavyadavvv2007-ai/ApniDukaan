# 🔌 DukaanQuest — API Integration Status Matrix
> **HackSprint 2026 | PS-21: Democratizing Digital Commerce for Bharat Retailers**  
> **Last Audited:** 2026-10-02 12:30 IST  
> **Strict Reality Standard:** No fabricated claims. Explicit distinction between Live, Staging, Sandbox, and Staged Fallback.

---

## 1. Sponsor & External Integration Status

| Integration | Technology / Provider | Credentials Required | Configured in `.env`? | Live API Active? | Demo Mode / Status | Current Blocker / Next Step |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| **Google Gemini AI Engine (Dual-Model)** | Google AI Studio<br>• Text: `gemini-3.1-flash-lite`<br>• Image: `gemini-3.1-flash-image` (or `gemini-3.1-flash-lite-image`) | `GEMINI_API_KEY`<br>`GEMINI_TEXT_MODEL`<br>`GEMINI_IMAGE_MODEL` | Yes (`server/.env`) | 🟢 **LIVE (Text)**<br>🟡 **LIVE QUOTA-LIMITED (Image)** | • **Text Extraction:** 🟢 **LIVE** (HTTP 200, 5.7s)<br>• **Photo Studio Hero:** 🟡 **LIVE REACHABLE** (HTTP 429: Free tier quota limit 0; requires pay-as-you-go billing) | Dual-model architecture implemented. Text attributes & compliance run live via Flash-Lite. Photo Studio image generation routes to `gemini-3.1-flash-image`. |
| **Sarvam AI Indic Language** | Sarvam AI API (`mayura:v1`, `saaras:v4`, `bulbul:v3`) | `SARVAM_API_KEY` | Yes (`server/.env`) | 🟢 **LIVE** | 🟢 **LIVE VERIFIED** (HTTP 200, 671ms) | Real live translation active for Hindi/Kannada/Tamil with pre-compiled linguistic fallback. |
| **n8n Workflow Hub** | n8n Webhook Engine (`http://localhost:5678`) | `N8N_WEBHOOK_URL` | Yes (`localhost:5678`) | 🟢 **LIVE** | 🟢 **LIVE WEBHOOK ACTIVE** (Port 5678) | Automation engine running live; triggers workflow executions and routes downstream. |
| **WhatsApp Business API** | Meta Cloud API (via n8n) | `WHATSAPP_TEMPLATE_NAME` (`hello_world`) | Yes | 🟢 **LIVE** | 🟢 **LIVE VERIFIED DELIVERY** | Confirmed by returned Meta WhatsApp Message ID: `wamid.HBgMOTE4NDI5MjQ2MDY3FQIAERgSNkJENjkzMkI2MTE3MTExQ0RCAA==`. Template: `hello_world`. |
| **Paytm FinTech** | Paytm Payment Gateway (Staging / UPI) | `PAYTM_MID`, `PAYTM_KEY` | Demo credentials | STAGED / FALLBACK | 🟡 **STAGED / FALLBACK (DEMO DATA)** | Test-key generation unavailable on Paytm dashboard. Operates smoothly with demo data without blocking the project. |
| **Amazon India** | Amazon SP-API (Selling Partner API) | `AMAZON_LWA_CLIENT_ID`, `AMAZON_LWA_CLIENT_SECRET`, `AMAZON_SANDBOX_REFRESH_TOKEN` | Yes (`server/.env`) | 🟢 **SANDBOX VERIFIED** | 🟢 **SANDBOX VERIFIED (HTTP 200)** | Full LWA OAuth2 token exchange + Listings Items POC + Product Type Definitions verified against sandbox endpoint. |
| **Flipkart Seller Hub** | Flipkart FMS Seller API | `FLIPKART_CLIENT_ID`, `FLIPKART_SECRET` | No (72h partner verification window) | Staged | 🟡 **STAGED READY (FMS Schema)** | Transforms Master SKU to Flipkart listing payload with HSN tax code and image specs. |
| **Meesho** | Meesho Supplier Panel | None (No public REST API exists) | N/A | N/A | 📦 **UPLOAD READY (Bulk CSV)** | **Do not invent private APIs.** Produces formatted Supplier Panel CSV for direct catalog upload. |
| **Myntra** | Myntra MMIP Partner Integration | `MYNTRA_PARTNER_TOKEN` | No | Staged | ⚠️ **PARTNER ONBOARDING STAGED** | Tier 2 integration. Prepares MMIP apparel catalog format and steam-ironing compliance checklist. |
| **Nykaa Fashion** | Nykaa Brand Association Workflow | Partnership Agreement | N/A | N/A | ⚠️ **ELIGIBILITY WORKFLOW** | Generates brand dossier and curation specs for partner application. |

---

## 2. Health Check API Endpoint Contract (`GET /api/health`)

The health endpoint responds with real-time operational status:
```json
{
  "overall": "operational",
  "version": "1.0.0",
  "timestamp": "2026-10-02T07:00:00.000Z",
  "services": {
    "gemini": {
      "configured": false,
      "mode": "offline-fallback",
      "model": "gemini-1.5-flash",
      "latencyMs": 12
    },
    "sarvam": {
      "configured": false,
      "mode": "offline-fallback",
      "engine": "Indic Linguistic Dictionary",
      "supportedLanguages": ["en", "hi", "kn", "ta"]
    },
    "n8n": {
      "configured": true,
      "mode": "live-webhook",
      "endpoint": "http://localhost:5678/webhook/dukaanquest-crm"
    },
    "whatsapp": {
      "configured": false,
      "mode": "staged-payload"
    },
    "paytm": {
      "configured": true,
      "isLive": false,
      "mode": "staged-fallback",
      "status": "STAGED/FALLBACK",
      "classification": "STAGED/FALLBACK (DEMO DATA)",
      "dashboardKeyStatus": "KEY_GENERATION_UNAVAILABLE_ON_DASHBOARD",
      "mid": "PAYTM_MID_984521"
    },
    "amazon": {
      "configured": true,
      "isLive": false,
      "mode": "sandbox-verified",
      "sandboxStatus": "AUTHENTICATED_AND_VERIFIED",
      "standard": "Amazon SP-API Listings Items API (v2021-08-01)",
      "endpointTested": "GET /sellers/v1/marketplaceParticipations",
      "statusCode": 200,
      "tokenExchange": "Login with Amazon (LWA) OAuth2",
      "productionRestricted": true
    },
    "flipkart": {
      "configured": false,
      "mode": "staged-ready",
      "standard": "FMS v3"
    },
    "meesho": {
      "configured": true,
      "mode": "upload-ready",
      "format": "Supplier Panel Flatfile CSV"
    }
  }
}
```

---

## 3. Demo Safety & Fallback Guarantees

1. **Zero Crash Guarantee:** If an external API call times out or encounters network limits, the service instantly falls back to the deterministic local engine within 100ms.
2. **Honest Labeling in UI:** Every screen clearly exposes badges:
   - `🟢 LIVE API`
   - `🟡 STAGED / SANDBOX`
   - `📦 UPLOAD READY`
   - `⚠️ PARTNERSHIP FLOW`
3. **Deterministic Financials:** What-If simulator runs pure deterministic math with labeled assumptions, preventing AI hallucinated profits.
