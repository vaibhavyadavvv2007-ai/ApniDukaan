# 🏆 DukaanQuest — HackSprint Official Pitch Deck & 3-Minute Demo Script
> **HackSprint 2026 | Track: FinTech & Smart Commerce | Problem Statement PS-21**  
> **Team:** DukaanQuest (1-4 Members)  
> **Target Event Date:** October 17–18, 2026 | **Build Window:** 48-Hour Sprint  
> **Repository:** [https://github.com/vaibhavyadavvv2007-ai/dukaan.git](https://github.com/vaibhavyadavvv2007-ai/dukaan.git)

---

# PART 1: 7-SLIDE OFFICIAL PRESENTATION CONTENT
*(Maps directly to the official `HackSprint PPT Presentation.pptx` template)*

---

### SLIDE 1: Cover / Title Slide
- **Title:** DukaanQuest
- **Subtitle:** AI-Powered Omnichannel Copilot for Bharat Retailers ("From Mohalla Merchant to Digital Vyapari")
- **Track:** FinTech & Smart Commerce (PS-21)
- **Team Name & Members:** [Your Team Name / Member Names & College Roll Numbers]
- **Key Positioning:** *"Big retailers have teams for e-commerce, CRM, and marketing. Small retailers have one owner. DukaanQuest gives that owner the team."*

---

### SLIDE 2: Problem & Real-World User Story
- **Header:** The Ground Reality of Bharat's 12 Million Offline Retailers
- **The Case Study:** Ramesh Kumar Yadav, Owner of *Shree Ganesh Matching & Saree Centre* (Gandhi Bazaar, Bengaluru).
  - 28 years running a physical store; accepts UPI daily; active on WhatsApp.
  - Wants to expand online to Amazon, Flipkart & Meesho, but lacks time, digital literacy, and an e-commerce agency.
- **The 4 Operational Breaking Points:**
  1. **Physical Intimidation Gap:** Online portals don't explain physical packaging rules (polybag $\ge 50\mu\text{m}$, thermal barcode sizes, drop-test survival, reverse quality checks).
  2. **Prohibitive Studio Photography Costs:** Agency shoots cost ₹500–₹1,500/SKU; raw phone counter photos get rejected by marketplace quality filters.
  3. **The Vernacular Language Barrier:** Complex seller consoles are English-first and jargon-heavy.
  4. **Fragmented Payments & High Return Risk:** E-commerce return rates in apparel hover at 14–25%, wiping out small merchants who lack return buffers.

---

### SLIDE 3: Solution & 5-Engine Core Architecture
- **Header:** Solution — Create Once. Sell Everywhere. Retain Direct.
- **The Core Engines:**
  - **Engine 1: Physical Readiness Scraper (Amazon, Flipkart, Myntra):** Scrapes official seller guidelines to generate physical packing, drop-test, and barcode compliance checklists.
  - **Engine 2: Google Gemini Pro Vision Studio:** Multimodal AI converts raw counter-top phone snaps into #FFFFFF white-background catalog assets with 94% compliance scoring.
  - **Engine 3: Omnichannel Master Catalog Transformer:** Transforms 1 shop SKU into format-compliant Amazon SP-API JSON, Flipkart FMS v3, Meesho Bulk CSV, Myntra MMIP, and Nykaa dossiers.
  - **Engine 4: n8n WhatsApp CRM Automation (Human-in-the-Loop):** Re-engages offline customers with personalized regional campaigns and embedded Paytm UPI links with DPDP consent.
  - **Engine 5: Audited What-If Unit Economics Simulator:** Deterministic math engine calculating commissions, return risk, net margin, and payback period with **Zero LLM Hallucinations**.
  - **FinTech Bridge: Paytm All-in-One Gateway & Soundbox:** Dynamic payment links, counter UPI QR, and real-time simulated Soundbox voice announcements.

---

### SLIDE 4: System Architecture & Data Flow Diagram
```
                     ┌─────────────────────────────────────────┐
                     │   DUKAANQUEST REACT 19 FRONTEND         │
                     │   (2D City Canvas • Studio • Simulator) │
                     └────────────────────┬────────────────────┘
                                          │ REST API (/api/*)
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │   CENTRAL NODE.JS / EXPRESS BACKEND     │
                     │   (Port 5000 • CORS • Multer Buffer)    │
                     └──────┬──────┬──────┬──────┬──────┬──────┘
                            │      │      │      │      │
       ┌────────────────────┘      │      │      │      └──────────────────┐
       ▼                           ▼      │      ▼                         ▼
┌──────────────┐     ┌──────────────┐     │ ┌──────────────┐     ┌───────────────────┐
│ Gemini Vision│     │ Sarvam Indic │     │ │ Paytm FinTech│     │ Marketplace Engine│
│ 1.5-Flash    │     │ Translation  │     │ │ Staging Link │     │ • Amazon SP-API   │
│ • White BG   │     │ • Saaras STT │     │ │ • Dynamic QR │     │ • Flipkart FMS v3 │
│ • Compliance │     │ • Bulbul TTS │     │ │ • Soundbox   │     │ • Meesho Bulk CSV │
└──────────────┘     └──────────────┘     │ └──────────────┘     │ • Myntra MMIP     │
                                          ▼                      └───────────────────┘
                                   ┌──────────────┐
                                   │ n8n Engine   │
                                   │ • Webhook    │
                                   │ • Consent Chk│
                                   │ • WhatsApp   │
                                   └──────────────┘
```

---

### SLIDE 5: Live Working Prototype Screenshots
- **Screenshot 1: The Gamified 2D Digital Dukaan Town:** Visual leveling progression from *Mohalla Merchant* to *Digital Vyapari* with interactive building routing.
- **Screenshot 2: Gemini AI Studio Split Slider:** Real-time before/after comparison showing raw saree photo transformed to pure white marketplace asset with 94% compliance.
- **Screenshot 3: Live Documentation Scraper:** Official Amazon India and Flipkart packaging rules (polybag microns, drop-test, thermal labels) with printable spec sheet.
- **Screenshot 4: WhatsApp CRM Hub & Paytm Soundbox:** Multilingual message preview (Hindi/Kannada/Tamil) with embedded Paytm payment link and simulated soundbox audio broadcast.
- **Screenshot 5: What-If Unit Economics Simulator:** Tri-strategy financial breakdown comparing marketplace push vs. WhatsApp retention vs. local ads.

---

### SLIDE 6: Business Viability, Unit Economics & Market Impact
- **Total Addressable Market (TAM):** 12 Million offline retail stores in India (Kirana, Apparel, Footwear, Consumer Electronics).
- **Serviceable Available Market (SAM):** 3.8 Million retailers in Tier 1, 2, and 3 cities already accepting UPI and using WhatsApp daily.
- **Monetization Model (SaaS + FinTech):**
  - **Freemium Tier:** Free physical readiness, basic catalog creation, and Paytm QR payments (0% MDR).
  - **Digital Vyapari Pro (₹499/month):** Unlimited Gemini AI Studio transformations, n8n WhatsApp automations, and multi-channel CSV/API syndication.
  - **FinTech Take-Rate / Value-Add:** Merchant micro-working capital financing partnerships based on transaction history.
- **Unit Economics Advantage:** Low customer acquisition cost (CAC) through merchant referral and hyper-retention via WhatsApp repeat orders.

---

### SLIDE 7: Roadmap & Defensibility (The "Unfair Advantage")
- **Technical Moats:**
  1. **Dual-Layer Resilience:** Full live API integration + zero-crash offline deterministic fallback engine.
  2. **Audit Integrity:** Financial simulator strictly avoids probabilistic LLM text generation—every rupee is calculated by deterministic code.
  3. **Privacy Compliance:** Full Digital Personal Data Protection (DPDP Act 2023) consent tracking with explicit opt-out directives.
- **Post-Hackathon 6-Month Roadmap:**
  - **Month 1:** Live pilot with 25 Gandhi Bazaar textile merchants.
  - **Month 2:** Direct ONDC (Open Network for Digital Commerce) protocol integration.
  - **Month 3:** Complete Amazon SP-API and Flipkart Partner developer production registration.
  - **Month 6:** Multi-category voice copilot with native mobile PWA offline sync.

---

# PART 2: THE WINNING 3-MINUTE VIDEO PITCH SCRIPT
*(Time-coded for precision delivery during the evaluation)*

### ⏱️ 0:00 – 0:25 | The Hook & Real Merchant Story
> *"Meet Ramesh-ji. For 28 years, he has run Shree Ganesh Matching Centre in Gandhi Bazaar, Bengaluru. He accepts UPI every day and his customers love him. Ramesh-ji wants to sell on Amazon, Flipkart, and Meesho to scale his business. But he doesn't have an e-commerce agency, a catalog photographer, or an IT team.*  
> *Big retailers have 50-person digital teams. Small retailers have one owner.*  
> *Welcome to **DukaanQuest** — the AI-powered copilot that turns traditional mohalla merchants into Digital Vyaparis."*

### ⏱️ 0:25 – 0:50 | The Problem & Physical Readiness Engine
> *(Screen Share: Switch to Physical Readiness tab)*  
> *"When small merchants try to list online, the biggest barrier isn't digital—it's physical. What packaging is allowed? What barcodes are mandatory?*  
> *DukaanQuest's **Physical Readiness Scraper** solves this instantly. With one click on 'Scrape Live Specs', our backend scrapes official guidelines directly from Amazon, Flipkart, and Myntra. It tells Ramesh-ji that Amazon requires 50-micron polybags with suffocation warnings and 2x1 inch thermal FNSKU barcodes, while Flipkart requires tamper-evident packaging and butter-paper inserts. He can even print this verified packaging checklist with one click!"*

### ⏱️ 0:50 – 1:20 | Gemini AI Photo Studio & Omnichannel Catalog
> *(Screen Share: Switch to Gemini Photo Studio & Omnichannel Catalog)*  
> *"Next is photography. Studio shoots cost ₹1,000 per product. Watch this:*  
> *Ramesh-ji snaps a raw photo on his shop counter with shadows and creases. In one tap, **Google Gemini Multimodal Vision** removes the cluttered background, synthesizes pure white #FFFFFF studio lighting, extracts fabric attributes, and audits compliance at 94%.*  
> *Even better: **Create once, transform everywhere.** DukaanQuest takes that single saree and automatically generates valid Amazon SP-API JSON payloads, Flipkart FMS schemas, Myntra editorial dossiers, and a ready-to-upload Meesho bulk CSV!"*

### ⏱️ 1:20 – 1:55 | Sarvam AI, n8n WhatsApp CRM & Paytm FinTech
> *(Screen Share: Switch to WhatsApp CRM Hub and Paytm Tab)*  
> *"Now let's talk customer retention. Ramesh-ji has hundreds of offline repeat customers.*  
> *Our **n8n Automation Hub** segments his VIP shoppers. Through **Sarvam AI**, the campaign is instantly translated into Ramesh-ji's customer's native language—Hindi, Kannada, or Tamil.*  
> *Notice our Human-in-the-Loop gate: AI never blasts messages autonomously. Ramesh-ji reviews the DPDP-compliant preview and authorizes it.*  
> *The message arrives on WhatsApp with a personalized **Paytm payment link**. When the customer pays, our simulated **Paytm Soundbox** announces: 'Paytm par ₹4,850 prapt hue!' with instant 0% MDR settlement!"*

### ⏱️ 1:55 – 2:35 | The What-If Simulator & Town Progression
> *(Screen Share: Switch to What-If Simulator & 2D Canvas Town)*  
> *"Finally, Ramesh-ji asks: 'Should I spend ₹10,000 on marketplace ads or on WhatsApp marketing?'*  
> *Instead of an AI hallucinating random numbers, our **What-If Simulator** runs audited, deterministic financial math. It factors in Amazon's 17.5% referral fee and a 14% return risk buffer versus WhatsApp's ₹0.85 per chat rate, proving that customer reactivation delivers a 44% net margin with a 2-day payback.*  
> *As Ramesh-ji completes these steps, his **2D Digital Dukaan Town** levels up from a simple shop into an omnichannel powerhouse."*

### ⏱️ 2:35 – 3:00 | Strong Closing & Call to Action
> *(Camera on presenter)*  
> *"DukaanQuest has been fully built and tested with a live Express REST backend and Vite frontend. Every sponsor technology—Gemini, Sarvam, n8n, and Paytm—was chosen because it solves an irreplaceable technical need for Indian retailers.*  
> *Big retailers have teams. Small retailers have one owner. DukaanQuest gives that owner the team.*  
> *Thank you!"*

---

# PART 3: JUDGE Q&A DEFENSE PLAYBOOK

| Expected Judge Question | Winning Technical Response |
| :--- | :--- |
| **Q1: "Why don't you directly publish live to Amazon and Flipkart via API right now?"** | *"Amazon SP-API and Flipkart Partner APIs require formal corporate developer onboarding and 7 to 14 days of security vetting. Rather than faking live publishing, our architecture strictly adheres to reality: we generate 100% compliant SP-API JSON payloads and Flipkart FMS schemas in our sandbox adapter, while offering ready-to-use Supplier Panel bulk files for Meesho."* |
| **Q2: "How do you prevent the AI from giving wrong financial advice to poor shopkeepers?"** | *"We enforce a strict separation of concerns: LLMs propose copy and visual attributes, but all financial projections (commissions, shipping weights, return rates, net margins) are executed by deterministic mathematical functions with transparent, cited benchmarks. Zero financial hallucinations."* |
| **Q3: "How do you handle customer data privacy on WhatsApp?"** | *"DukaanQuest is built to comply with India's DPDP Act 2023. Our CRM tracks `marketingOptIn` timestamps for every customer, skips unconsented contacts, and automatically appends a mandatory `Reply STOP to unsubscribe` notice in every outbound template."* |
| **Q4: "What happens if the internet goes down or an AI service experiences rate limiting?"** | *"Every external service has a dual-mode design: live API mode with a high-fidelity local deterministic fallback. If an API times out, the fallback engine engages within 100 milliseconds, ensuring the merchant and judges never see a crashed screen."* |
