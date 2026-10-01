# 📋 DukaanQuest — Functional & System Requirements

> **Document Version:** 1.0.0  
> **Status:** Approved for Build  
> **Traceability:** Aligned with Hack Sprint PS-21 (FinTech & Commerce)

---

## 1. Requirement Taxonomy

* **FR (Functional Requirements):** Core user-facing features and business logic engines.
* **SR (Sponsor Integration Requirements):** Specific sponsor API implementations and value demonstrations.
* **NFR (Non-Functional Requirements):** UX performance, visual quality, responsiveness, and offline tolerance.

---

## 2. Functional Requirements (FR)

### FR-01: Engine 1 — Physical Readiness Checker
* **FR-01.1 (Platform Selection):** The system shall allow the merchant to select one or multiple target platforms (Amazon India, Flipkart, Myntra).
* **FR-01.2 (Category Compliance Ingestion):** The system shall load pre-scraped, verified packaging, labeling, and legal standards specific to the merchant's category (e.g., Apparel / Sarees / Textiles).
* **FR-01.3 (Interactive Checklist):** The system shall provide an interactive, checklist UI covering:
  - GSTIN registration status & documentation.
  - Primary polybag thickness standards (minimum 50 microns + bilingual child suffocation warnings).
  - Barcode / FNSKU label placement guidelines.
  - Outer carton drop-test and sealing requirements.
  - Return policy & pickup hub readiness.
* **FR-01.4 (Badge & XP Reward):** Marking physical checklist items complete shall award XP and unlock platform-specific "Marketplace Ready" badges.

### FR-02: Engine 2 — Gemini AI Photo Studio
* **FR-02.1 (Image Upload & Preset Selection):** The system shall allow merchants to upload raw phone images or select sample cloth shop inventory items (e.g., Kanjeevaram Saree, Cotton Kurta, Denim Shirt).
* **FR-02.2 (AI Background Transformation):** The system shall process raw photos into e-commerce grade white-background product shots (#FFFFFF) complying with Amazon Main Image guidelines.
* **FR-02.3 (Lifestyle & Mannequin Synthesis):** The system shall synthesize lifestyle/draped contextual photos suitable for Myntra and Instagram feeds.
* **FR-02.4 (Dimension & Fabric Infographic Overlay):** The system shall generate platform-ready secondary images with fabric callouts, thread counts, and size tags.
* **FR-02.5 (Export Asset Bundle):** The system shall allow one-click export of a 4-image bundle ready for upload.

### FR-03: Engine 3 — Omnichannel Catalog Transformer
* **FR-03.1 (Single Master Record):** The system shall maintain a unified Master Product record (Title, Base Price, Material, Sizes, Colors, Inventory Count).
* **FR-03.2 (Schema Transformation):** The system shall automatically transform the master record into:
  - **Amazon Format:** 200-character keyword-rich title, 5 bullet points with technical specs, platinum keywords.
  - **Flipkart Format:** Brand approval format, key features array, wash-care directives.
  - **Myntra Format:** Style ID, pattern type, occasion tag, fashion curation notes.
* **FR-03.3 (JSON & Excel Flat-File Generation):** The system shall export ready-to-import bulk files formatted to each platform's seller requirements.

### FR-04: Engine 4 — n8n WhatsApp CRM Automation
* **FR-04.1 (Customer Contact Management):** The system shall support merchant customer lists with tags (`VIP In-store`, `Festive Buyer`, `Inactive >30 Days`).
* **FR-04.2 (Visual n8n Flow Display):** The system shall display an interactive visual flow diagram of the n8n automation pipeline (Webhook Trigger → Customer Segmentation → AI Personalization → WhatsApp Cloud Dispatch).
* **FR-04.3 (Campaign Simulator):** The merchant shall be able to preview and test campaign broadcasts (e.g., "Diwali New Arrivals", "Exclusive 15% VIP Discount") with personalized greeting tokens.
* **FR-04.4 (One-Tap Approval):** The merchant must explicitly confirm any automated broadcast before messages are queued or sent.

### FR-05: Engine 5 — Deterministic "What-If" Business Simulator
* **FR-05.1 (Input Parameters):** The system shall accept merchant baseline inputs: Monthly offline revenue, available investment capital (₹5,000 to ₹50,000), target revenue increase.
* **FR-05.2 (Tri-Strategy Projection):** The system shall compute and compare:
  - **Strategy A (Marketplace Onboarding):** High reach (All-India), 18% commission cut, 10-15 day cash cycle, high return rate risk (15-20%).
  - **Strategy B (WhatsApp Customer Reactivation):** High conversion (25%), ₹0 acquisition cost, immediate repeat purchases, high margin retention.
  - **Strategy C (Hyperlocal Meta Ads):** Targeted 5km radius, ₹1,500 ad spend, 40-70 new footfalls/queries, 4-day payback period.
* **FR-05.3 (AI Strategy Synthesis):** An AI advisory block shall explain the trade-offs in plain language and recommend the optimal phased approach.

### FR-06: Engine 6 — Gamified Digital Dukaan & Quest Engine
* **FR-06.1 (2D Canvas World):** The system shall render an animated 2D Canvas displaying the merchant's physical shop and surrounding digital business structures.
* **FR-06.2 (Dynamic Building Evolutions):**
  - Completing Physical Prep upgrades the **Warehouse**.
  - Completing Photo Quests upgrades the **Photo Studio**.
  - Listing on Amazon/Flipkart builds the **Marketplace Hub**.
  - Connecting WhatsApp activates the **Communication Tower**.
* **FR-06.3 (Quest Roadmap):** The system shall organize onboarding into sequential, bite-sized quests with XP meters and level progression (Level 1: Galli Retailer → Level 5: Digital Mahajan).

---

## 3. Sponsor Integration Requirements (SR)

* **SR-01 (Google Gemini):** Multi-modal image enhancement and product listing copy generation. Fallback mocking with realistic latency must be available when offline.
* **SR-02 (n8n):** Workflow automation configuration file (`.json`) exportable and viewable inside the dashboard.
* **SR-03 (Sarvam AI):** Vernacular language selector supporting English, Hindi (हिंदी), Kannada (ಕನ್ನಡ), and Tamil (தமிழ்), with real-time UI text translation and voice playback simulation.
* **SR-04 (Paytm):** Dynamic UPI QR code generator and Paytm Payment Link generator embedded within the checkout and customer invoices.

---

## 4. Non-Functional Requirements (NFR)

* **NFR-01 (Visual Excellence):** The UI must strictly follow modern high-end design aesthetics: dark glassmorphism, curated high-contrast typography (Inter/Outfit), fluid hover states, and smooth CSS transitions. No default bootstrap or generic styles.
* **NFR-02 (Speed & Responsiveness):** Initial page render under 1.2s; canvas animation running smoothly at 60 FPS without lag.
* **NFR-03 (Zero Dead Ends):** Every interactive button, modal, toggle, and checklist item must have functional state, feedback, or modal previews.
* **NFR-04 (Self-Contained Local Execution):** The prototype must run reliably in local development mode without external API key failures blocking the judge demo.
