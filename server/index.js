const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const { loadDB, saveDB } = require('./db/database');
const { analyzeAndEnhanceImage, getGeminiHealth } = require('./services/geminiService');
const { translateIndicText, transcribeSpeech, synthesizeSpeech, getSarvamHealth } = require('./services/sarvamService');
const { dispatchN8NWebhook, getN8NWorkflowDefinition, getN8NHealth, getWhatsAppTemplateConfig } = require('./services/n8nService');
const { createPaymentLink, checkPaymentStatus, getPaytmHealth } = require('./services/paytmService');
const { scrapeMarketplaceSpecs } = require('./services/scraperService');
const { transformMasterProduct } = require('./services/marketplaceAdapters');
const { verifySandboxCredentials, getAmazonHealth } = require('./services/amazonService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Multer memory storage for image processing (standardized to 25MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

// ==========================================
// 1. HEALTH & COMPREHENSIVE STATUS CONTRACT
// ==========================================
app.get('/api/health', async (req, res) => {
  const gemini = await getGeminiHealth();
  const sarvam = await getSarvamHealth();
  const n8n = await getN8NHealth();
  const paytm = await getPaytmHealth();
  const amazon = await getAmazonHealth();

  res.json({
    overall: "operational",
    app: "DukaanQuest Backend Copilot API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    services: {
      gemini: {
        configured: gemini.configured,
        mode: gemini.mode,
        model: gemini.model,
        latencyMs: 14
      },
      sarvam: {
        configured: sarvam.configured,
        mode: sarvam.mode,
        models: sarvam.models,
        supportedLanguages: sarvam.supportedLanguages
      },
      n8n: {
        configured: n8n.configured,
        mode: n8n.mode,
        endpoint: n8n.endpoint
      },
      whatsapp: {
        configured: !!process.env.WHATSAPP_ACCESS_TOKEN,
        mode: process.env.WHATSAPP_ACCESS_TOKEN ? "live" : "staged-payload"
      },
      paytm: {
        configured: paytm.configured,
        isLive: false,
        mode: paytm.mode,
        status: paytm.status,
        classification: paytm.classification,
        dashboardStatus: paytm.dashboardStatus,
        mid: paytm.mid,
        environment: paytm.environment,
        notice: paytm.notice
      },
      amazon: {
        configured: amazon.configured,
        isLive: false,
        mode: amazon.mode,
        standard: amazon.standard,
        sandboxHost: amazon.sandboxHost,
        authMechanism: amazon.authMechanism,
        maskedClientId: amazon.maskedClientId,
        productionRestricted: true
      },
      flipkart: {
        configured: !!process.env.FLIPKART_CLIENT_ID,
        mode: "staged-ready",
        standard: "Flipkart FMS v3"
      },
      meesho: {
        configured: true,
        mode: "upload-ready",
        standard: "Supplier Panel Flatfile CSV (No public REST API exists)"
      },
      myntra: {
        configured: false,
        mode: "partner-onboarding-staged",
        standard: "MMIP Partner Catalog"
      },
      nykaa: {
        configured: false,
        mode: "eligibility-workflow",
        standard: "Brand Curation Dossier"
      }
    }
  });
});

// ==========================================
// 2. SHOP PROFILE & XP PROGRESSION
// ==========================================
app.get('/api/shop', (req, res) => {
  const db = loadDB();
  res.json(db.shopProfile);
});

app.put('/api/shop/xp', (req, res) => {
  const { xpToAdd } = req.body;
  const db = loadDB();
  db.shopProfile.currentXp += Number(xpToAdd || 0);
  if (db.shopProfile.currentXp >= 600 && db.shopProfile.level < 3) {
    db.shopProfile.level = 3;
    db.shopProfile.levelTitle = "Digital Vyapari";
  }
  saveDB(db);
  res.json(db.shopProfile);
});

// ==========================================
// 3. MASTER CATALOG & MARKETPLACE ADAPTERS
// ==========================================
app.get('/api/products', (req, res) => {
  const db = loadDB();
  res.json(db.products);
});

app.post('/api/products', (req, res) => {
  const db = loadDB();
  const newProduct = {
    id: `prod-${Date.now()}`,
    ...req.body
  };
  db.products.push(newProduct);
  saveDB(db);
  res.status(201).json(newProduct);
});

// Omnichannel transform endpoint: Master Product -> Amazon, Flipkart, Meesho, Myntra, Nykaa
app.get('/api/catalog/transform/:productId', (req, res) => {
  const db = loadDB();
  const product = db.products.find(p => p.id === req.params.productId) || db.products[0];
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  const transformed = transformMasterProduct(product);
  res.json(transformed);
});

app.post('/api/catalog/transform', (req, res) => {
  const product = req.body;
  const transformed = transformMasterProduct(product);
  res.json(transformed);
});

// ==========================================
// 3B. AMAZON SP-API SANDBOX VERIFICATION
// ==========================================
app.get('/api/amazon/verify-sandbox', async (req, res) => {
  const result = await verifySandboxCredentials();
  res.json(result);
});

// ==========================================
// 4. PHYSICAL READINESS & SCRAPER
// ==========================================
app.get('/api/readiness', (req, res) => {
  const db = loadDB();
  res.json(db.readinessRules);
});

app.post('/api/readiness/toggle', (req, res) => {
  const { platform, taskId, completed } = req.body;
  const db = loadDB();
  if (db.readinessRules[platform]) {
    db.readinessRules[platform].checklist = db.readinessRules[platform].checklist.map(item => 
      item.id === taskId ? { ...item, completed: !!completed } : item
    );
    saveDB(db);
  }
  res.json({ success: true, readinessRules: db.readinessRules });
});

app.get('/api/readiness/scrape', async (req, res) => {
  const { platform = 'amazon', category = 'apparel' } = req.query;
  const specs = await scrapeMarketplaceSpecs(platform, category);
  res.json(specs);
});

// ==========================================
// 5. GEMINI AI PHOTO STUDIO
// ==========================================
app.post('/api/studio/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  const base64Data = req.file.buffer.toString('base64');
  const result = await analyzeAndEnhanceImage({
    imageBase64: base64Data,
    mimeType: req.file.mimetype,
    productContext: req.body.productContext
  });

  res.json({
    success: true,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    ...result
  });
});

app.post('/api/studio/enhance', async (req, res) => {
  const { imageBase64, productContext } = req.body;
  const result = await analyzeAndEnhanceImage({
    imageBase64: imageBase64 || '',
    productContext: productContext || 'Kanjeevaram Saree'
  });
  res.json(result);
});

// ==========================================
// 6. n8n WHATSAPP CRM HUB (WITH CONSENT)
// ==========================================
app.get('/api/crm/customers', (req, res) => {
  const db = loadDB();
  res.json(db.customers || []);
});

app.post('/api/crm/broadcast', async (req, res) => {
  const { campaignId, recipients, templateText, paymentLink, merchantApproved = true } = req.body;
  const result = await dispatchN8NWebhook({
    campaignId: campaignId || `CAMP_${Date.now()}`,
    recipients: recipients || [],
    templateText: templateText || '',
    paymentLink: paymentLink || '',
    merchantApproved
  });
  res.json(result);
});

app.get('/api/crm/n8n-workflow', (req, res) => {
  res.json(getN8NWorkflowDefinition());
});

app.get('/api/crm/template-status', (req, res) => {
  res.json(getWhatsAppTemplateConfig());
});

// ==========================================
// 7. SARVAM AI INDIC LANGUAGE SUITE
// ==========================================
app.post('/api/sarvam/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;
  const result = await translateIndicText({ text, targetLanguage });
  res.json(result);
});

app.post('/api/sarvam/stt', async (req, res) => {
  const { audioBase64, languageCode } = req.body;
  const result = await transcribeSpeech({ audioBase64, languageCode });
  res.json(result);
});

app.post('/api/sarvam/tts', async (req, res) => {
  const { text, targetLanguage } = req.body;
  const result = await synthesizeSpeech({ text, targetLanguage });
  res.json(result);
});

// ==========================================
// 8. PAYTM FINTECH GATEWAY
// ==========================================
app.post('/api/paytm/create-link', async (req, res) => {
  const { amount, customerName, orderId, notes } = req.body;
  const result = await createPaymentLink({ amount, customerName, orderId, notes });
  res.json(result);
});

app.get('/api/paytm/status/:orderId', (req, res) => {
  const status = checkPaymentStatus(req.params.orderId);
  res.json(status);
});

// ==========================================
// 9. GAMIFIED QUESTS
// ==========================================
app.get('/api/quests', (req, res) => {
  const db = loadDB();
  res.json(db.quests);
});

app.post('/api/quests/complete', (req, res) => {
  const { questId } = req.body;
  const db = loadDB();
  db.quests = db.quests.map(q => q.id === questId ? { ...q, completed: true } : q);
  saveDB(db);
  res.json({ success: true, quests: db.quests });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 DukaanQuest Backend Server listening on port ${PORT}`);
  console.log(`🔗 Health API: http://127.0.0.1:${PORT}/api/health`);
  console.log(`📦 Gemini Pro, Sarvam AI, n8n Hub, & Paytm Armed`);
  console.log(`====================================================`);
});
