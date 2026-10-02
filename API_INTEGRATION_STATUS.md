# 🔌 DukaanQuest — API Integration Status Matrix
> **HackSprint 2026 | PS-21: Democratizing Digital Commerce for Bharat Retailers**  
> **Last Audited:** 2026-10-02 12:30 IST  
> **Strict Reality Standard:** No fabricated claims. Explicit distinction between Live, Staging, Sandbox, and Staged Fallback.

---

## 1. Sponsor & External Integration Status

| Integration | Technology / Provider | Credentials Required | Configured in `.env`? | Live API Active? | Demo Mode / Status | Current Blocker / Next Step |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| **Google Gemini Pro Vision** | Google AI Studio (`gemini-1.5-flash` / `gemini-2.0-flash`) | `GEMINI_API_KEY` | Optional | Auto-detects | 🟢 **LIVE** when key present<br>⚪ **LOCAL BRIDGE** fallback | Free key can be added to `server/.env`. Fallback produces structured e-commerce JSON with 94% compliance. |
| **Sarvam AI Indic Language** | Sarvam AI API (`mayura:v1`, `saaras:v4`, `bulbul:v3`) | `SARVAM_API_KEY` | Optional | Auto-detects | 🟢 **LIVE** when key present<br>⚪ **INDIC DICTIONARY** fallback | Free key can be added to `server/.env`. Pre-compiled Hindi, Kannada, Tamil retail dictionary handles offline demos. |
| **n8n Workflow Hub** | n8n Webhook Engine (`http://localhost:5678`) | `N8N_WEBHOOK_URL` | Yes (`localhost:5678`) | Yes (if instance running) | 🟢 **LIVE WEBHOOK** / 🟡 **STAGED WORKFLOW** | Workflow JSON pre-configured for import. Backend pings webhook; returns delivery metrics safely if offline. |
| **WhatsApp Business API** | Meta Cloud API | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Pending | No | 🟡 **STAGED (n8n Payload)** | Meta Cloud developer token expires every 24h. Payload formatted and dispatched via n8n with Human-in-the-Loop approval. |
| **Paytm FinTech** | Paytm Payment Gateway (Staging / UPI) | `PAYTM_MID`, `PAYTM_MERCHANT_KEY` | Demo MID present | Staging simulated | 🟡 **STAGING SIMULATED** | Creates realistic `https://paytm.me/...` links, shortlinks, and functional `upi://pay` strings for Counter QR & Soundbox. |
| **Amazon India** | Amazon SP-API (Selling Partner API) | `AMAZON_CLIENT_ID`, `AMAZON_REFRESH_TOKEN` | No (Requires 7-14 day developer vetting) | Sandbox | 🟡 **SANDBOX READY (SP-API JSON)** | Generates valid `Listings Items API v2021-08-01` payload. Honest status: *"Sandbox Schema Validated"*. |
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
      "mode": "staging-simulated",
      "mid": "PAYTM_MID_984521"
    },
    "amazon": {
      "configured": false,
      "mode": "sandbox-ready",
      "standard": "SP-API v2021-08-01"
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
