const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const { loadDB, saveDB } = require('./db/database');
const { analyzeAndEnhanceImage } = require('./services/geminiService');
const { translateIndicText } = require('./services/sarvamService');
const { dispatchN8NWebhook, getN8NWorkflowDefinition } = require('./services/n8nService');
const { createPaymentLink } = require('./services/paytmService');
const { scrapeMarketplaceSpecs } = require('./services/scraperService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Multer memory storage for image processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// --- ROUTES ---

// 1. Health & Sponsor Matrix
app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    app: "DukaanQuest Backend Copilot API",
    version: "1.0.0",
    sponsors: {
      gemini: { active: !!process.env.GEMINI_API_KEY, fallback: "Local Multimodal Bridge" },
      sarvam: { active: !!process.env.SARVAM_API_KEY, fallback: "Indic Dictionary Engine" },
      n8n: { active: true, endpoint: process.env.N8N_WEBHOOK_URL },
      paytm: { active: true, mid: process.env.PAYTM_MID || "PAYTM_MID_984521" }
    }
  });
});

// 2. Shop Profile & XP
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

// 3. Products
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

// 4. Physical Readiness
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

// 5. Gemini AI Photo Studio
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

// 6. n8n WhatsApp CRM Hub
app.get('/api/crm/customers', (req, res) => {
  const db = loadDB();
  res.json(db.customers);
});

app.post('/api/crm/broadcast', async (req, res) => {
  const { campaignId, recipients, templateText, paymentLink } = req.body;
  const result = await dispatchN8NWebhook({
    campaignId: campaignId || `CAMP_${Date.now()}`,
    recipients: recipients || [],
    templateText: templateText || '',
    paymentLink: paymentLink || ''
  });
  res.json(result);
});

app.get('/api/crm/n8n-workflow', (req, res) => {
  res.json(getN8NWorkflowDefinition());
});

// 7. Sarvam AI Translation
app.post('/api/sarvam/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;
  const result = await translateIndicText({ text, targetLanguage });
  res.json(result);
});

// 8. Paytm FinTech
app.post('/api/paytm/create-link', (req, res) => {
  const { amount, customerName, orderId, notes } = req.body;
  const result = createPaymentLink({ amount, customerName, orderId, notes });
  res.json(result);
});

// 9. Quests
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
  console.log(`📦 Gemini, Sarvam, n8n, & Paytm Engines Armed`);
  console.log(`====================================================`);
});
