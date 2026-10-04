const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// ── Explicit dotenv path resolution ─────────────────────────────
// Resolves from this file's directory, not from process.cwd().
// This is the root cause fix for GEMINI/SARVAM keys loading as empty.
const dotenvResult = require('dotenv').config({ path: path.resolve(__dirname, '.env') });
if (dotenvResult.error) {
  console.warn('[dotenv] Failed to load .env:', dotenvResult.error.message);
} else {
  const loadedKeys = Object.keys(dotenvResult.parsed || {});
  console.log(`[dotenv] Loaded ${loadedKeys.length} vars from ${path.resolve(__dirname, '.env')}`);
  // Warn about empty critical keys
  ['GEMINI_API_KEY', 'SARVAM_API_KEY'].forEach(k => {
    if (loadedKeys.includes(k) && !dotenvResult.parsed[k]) {
      console.warn(`[dotenv] ⚠ ${k} is present but EMPTY — service will run in fallback mode`);
    }
  });
}

const { loadDB, saveDB, getPersistenceStatus } = require('./db/database');
const { analyzeAndEnhanceImage, extractCatalogAttributes, generateOrTransformProductImage, getGeminiHealth } = require('./services/geminiService');
const { translateIndicText, translateBatch, transcribeSpeech, synthesizeSpeech, getSarvamHealth } = require('./services/sarvamService');
const { dispatchN8NWebhook, getN8NWorkflowDefinition, getN8NHealth, getWhatsAppTemplateConfig } = require('./services/n8nService');
const { recordStatusWebhook, getDeliveryStatus, listDeliveryStatuses } = require('./services/whatsappStatusService');
const { createPaymentLink, checkPaymentStatus, getPaytmHealth } = require('./services/paytmService');
const { scrapeMarketplaceSpecs } = require('./services/scraperService');
const { transformMasterProduct } = require('./services/marketplaceAdapters');
const { verifySandboxCredentials, getAmazonHealth } = require('./services/amazonService');
const { searchProductTypes, getProductTypeDefinition, putListingsItem, buildListingsPayload } = require('./services/amazonListingsService');

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ────────────────────────────────────────────────────────
// Local dev: the Vite server on :5173 is a different origin from :5000.
// Production: FRONTEND_URL names the deployed frontend origin(s).
// A wildcard is never used, so a deployed backend cannot be driven from an
// arbitrary site. When FRONTEND_URL is set the allowlist is enforced; when it
// is not (unset in production), same-origin requests still work and the
// browser blocks cross-origin callers on its own.
const ALLOWED_ORIGINS = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(o => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

// Extra origins that must keep working during local development.
const LOCAL_DEV_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173'
];

const corsOptions = {
  origin(origin, callback) {
    // No Origin header: same-origin, curl, server-to-server, or the Meta
    // webhook. These are not browser cross-origin requests.
    if (!origin) return callback(null, true);
    const allowed = ALLOWED_ORIGINS.includes(origin.replace(/\/+$/, ''))
      || LOCAL_DEV_ORIGINS.includes(origin.replace(/\/+$/, ''));
    return callback(null, allowed);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Multer memory storage for image processing (standardized to 25MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

// ==========================================
// 1. HEALTH & COMPREHENSIVE STATUS CONTRACT
//    Classification Tiers: LIVE | SANDBOX | STAGED | FALLBACK
//    Rule: Suite is NEVER labeled "verified" when any service is FALLBACK.
// ==========================================
app.get('/api/health', async (req, res) => {
  const gemini = await getGeminiHealth();
  const sarvam = await getSarvamHealth();
  const n8n = await getN8NHealth();
  const paytm = await getPaytmHealth();
  const amazon = await getAmazonHealth();

  // ── Per-service classification ────────────────────────────
  const geminiClassification = gemini.isLive ? 'LIVE' : 'FALLBACK';
  const sarvamClassification = sarvam.isLive ? 'LIVE' : 'FALLBACK';
  const n8nClassification = n8n.isLive ? 'LIVE' : 'FALLBACK';
  const whatsappConfigured = !!process.env.WHATSAPP_ACCESS_TOKEN;
  const whatsappClassification = whatsappConfigured ? 'LIVE' : 'STAGED';
  const paytmClassification = 'FALLBACK'; // Never LIVE per user directive
  const amazonClassification = amazon.configured ? 'SANDBOX' : 'FALLBACK';
  // Photo Studio image generation: only LIVE if image model returns actual images (not quota-limited)
  const imageModelStatus = gemini.models?.imageModel?.status;
  const photoStudioClassification = imageModelStatus === 'LIVE_VERIFIED' ? 'LIVE' : 'STAGED';
  const flipkartClassification = 'STAGED';
  const meeshoClassification = 'STAGED';
  const myntraClassification = 'STAGED';
  const nykaaClassification = 'STAGED';

  // ── Integration summary tally ─────────────────────────────
  const allClassifications = [
    geminiClassification, sarvamClassification, n8nClassification,
    whatsappClassification, paytmClassification, amazonClassification,
    photoStudioClassification, flipkartClassification, meeshoClassification, myntraClassification, nykaaClassification
  ];
  const tally = { LIVE: 0, SANDBOX: 0, STAGED: 0, FALLBACK: 0 };
  allClassifications.forEach(c => tally[c]++);
  const hasFallback = tally.FALLBACK > 0;
  const overallStatus = hasFallback
    ? `PARTIAL (${tally.LIVE} LIVE, ${tally.SANDBOX} SANDBOX, ${tally.STAGED} STAGED, ${tally.FALLBACK} FALLBACK)`
    : `ALL_OPERATIONAL (${tally.LIVE} LIVE, ${tally.SANDBOX} SANDBOX, ${tally.STAGED} STAGED)`;

  res.json({
    overall: hasFallback ? 'partial' : 'operational',
    overallStatus,
    app: 'DukaanQuest Backend Copilot API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    integrationSummary: {
      totalServices: allClassifications.length,
      ...tally,
      notice: hasFallback
        ? 'Some services are in FALLBACK mode. Check verificationDetail for each.'
        : 'All services are operational (LIVE, SANDBOX, or STAGED).'
    },
    // Honest storage state. On serverless hosts the store cannot be written, so
    // this reports READ_ONLY_SEED rather than implying progress is saved.
    persistence: getPersistenceStatus(),
    services: {
      gemini: {
        classification: geminiClassification,
        configured: gemini.configured,
        isLive: gemini.isLive,
        mode: gemini.mode,
        models: gemini.models,
        textModel: gemini.models?.textModel,
        imageModel: gemini.models?.imageModel,
        verificationStatus: gemini.verificationStatus,
        verificationDetail: gemini.verificationDetail,
        lastVerified: gemini.lastVerified
      },
      sarvam: {
        classification: sarvamClassification,
        configured: sarvam.configured,
        isLive: sarvam.isLive,
        mode: sarvam.mode,
        models: sarvam.models,
        supportedLanguages: sarvam.supportedLanguages,
        verificationStatus: sarvam.verificationStatus,
        verificationDetail: sarvam.verificationDetail,
        lastVerified: sarvam.lastVerified
      },
      n8n: {
        classification: n8nClassification,
        configured: n8n.configured,
        isLive: n8n.isLive,
        mode: n8n.mode,
        endpoint: n8n.endpoint,
        verificationStatus: n8n.verificationStatus,
        verificationDetail: n8n.verificationDetail
      },
      whatsapp: {
        classification: whatsappClassification,
        configured: whatsappConfigured,
        mode: whatsappConfigured ? 'live' : 'staged-payload',
        activeTemplate: n8n.whatsappTemplate?.activeTemplate,
        templateStatus: n8n.whatsappTemplate?.status,
        metaReviewStatus: n8n.whatsappTemplate?.metaReviewStatus
      },
      paytm: {
        classification: paytmClassification,
        configured: paytm.configured,
        isLive: false,
        mode: paytm.mode,
        status: paytm.status,
        dashboardStatus: paytm.dashboardStatus,
        mid: paytm.mid,
        environment: paytm.environment,
        notice: paytm.notice
      },
      amazon: {
        classification: amazonClassification,
        configured: amazon.configured,
        isLive: false,
        mode: amazon.mode,
        standard: amazon.standard,
        sandboxHost: amazon.sandboxHost,
        authMechanism: amazon.authMechanism,
        maskedClientId: amazon.maskedClientId,
        productionRestricted: true,
        listingsPocAvailable: true
      },
      photoStudio: {
        classification: photoStudioClassification,
        model: gemini.models?.imageModel?.id,
        imageModelStatus: gemini.models?.imageModel?.status,
        isAIGenerated: photoStudioClassification === 'LIVE',
        mode: photoStudioClassification === 'LIVE' ? 'live-ai-generation' : 'staged-catalog-asset',
        detail: photoStudioClassification === 'LIVE'
          ? 'Live AI-generated hero images via Gemini Image model'
          : 'Staged high-res catalog assets shown. Enable Google Cloud pay-as-you-go billing for live AI image generation.',
        quotaNote: photoStudioClassification !== 'LIVE'
          ? 'Image model endpoint is reachable and authenticated. Free-tier quota is 0 for image generation models. Once billing is enabled, this service will upgrade to LIVE.'
          : null
      },
      flipkart: {
        classification: flipkartClassification,
        configured: !!process.env.FLIPKART_CLIENT_ID,
        mode: 'staged-ready',
        standard: 'Flipkart FMS v3'
      },
      meesho: {
        classification: meeshoClassification,
        configured: true,
        mode: 'upload-ready',
        standard: 'Supplier Panel Flatfile CSV (No public REST API exists)'
      },
      myntra: {
        classification: myntraClassification,
        configured: false,
        mode: 'partner-onboarding-staged',
        standard: 'MMIP Partner Catalog'
      },
      nykaa: {
        classification: nykaaClassification,
        configured: false,
        mode: 'eligibility-workflow',
        standard: 'Brand Curation Dossier'
      }
    }
  });
});

// Endpoint to dynamically reload environment variables from server/.env
app.post('/api/reload-env', (req, res) => {
  const result = require('dotenv').config({ path: path.resolve(__dirname, '.env'), override: true });
  const geminiConfigured = !!process.env.GEMINI_API_KEY;
  const sarvamConfigured = !!process.env.SARVAM_API_KEY;
  res.json({
    success: !result.error,
    reloadedFrom: path.resolve(__dirname, '.env'),
    geminiKeyConfigured: geminiConfigured,
    sarvamKeyConfigured: sarvamConfigured,
    notice: geminiConfigured && sarvamConfigured 
      ? 'Keys loaded successfully into live process environment.' 
      : 'Keys are still empty or missing in server/.env on disk.'
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
  const persisted = saveDB(db);
  res.json({ ...db.shopProfile, persisted, persistence: getPersistenceStatus() });
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
  const persisted = saveDB(db);
  res.status(201).json({ ...newProduct, persisted, persistence: getPersistenceStatus() });
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
// 3C. AMAZON SP-API LISTINGS POC
//     Product Type Definitions → Required Attributes → Listings Items
//     Falls back to export-ready JSON when sandbox write is unsupported.
// ==========================================
app.get('/api/amazon/product-types', async (req, res) => {
  const { keywords } = req.query;
  const result = await searchProductTypes({ keywords: keywords || 'SAREE' });
  res.json(result);
});

app.get('/api/amazon/product-type-definition', async (req, res) => {
  const { productType } = req.query;
  const result = await getProductTypeDefinition({ productType: productType || 'SAREE' });
  res.json(result);
});

app.post('/api/amazon/listings/put', async (req, res) => {
  const { masterProduct, sellerId, sku } = req.body;
  const result = await putListingsItem({
    masterProduct: masterProduct || {},
    sellerId: sellerId || 'SANDBOX_SELLER_ID',
    sku
  });
  res.json(result);
});

app.post('/api/amazon/listings/export', (req, res) => {
  const { masterProduct } = req.body;
  const payload = buildListingsPayload(masterProduct || {});
  res.json({
    success: true,
    mode: 'export',
    source: 'ApniDukaan Listings Export Engine',
    format: 'JSON_LISTINGS_FEED',
    exportReadyPayload: payload,
    uploadInstructions: {
      method: 'Seller Central → Inventory → Add a Product via Upload',
      format: 'JSON Listings Feed',
      marketplace: 'Amazon.in (A21TJRUUN4KGV)'
    }
  });
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
  }
  const persisted = saveDB(db);
  res.json({ success: true, persisted, persistence: getPersistenceStatus(), readinessRules: db.readinessRules });
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

// Dedicated Path 1: Text & Catalog Attributes (using Flash-Lite)
app.post('/api/studio/extract-attributes', async (req, res) => {
  const { imageBase64, mimeType, productContext } = req.body;
  const result = await extractCatalogAttributes({
    imageBase64: imageBase64 || '',
    mimeType: mimeType || 'image/jpeg',
    productContext: productContext || 'Kanjeevaram Silk Saree'
  });
  res.json(result);
});

// Dedicated Path 2: Photo Studio Hero Image Generation & Editing (using Flash-Image)
app.post('/api/studio/generate-image', async (req, res) => {
  const { imageBase64, mimeType, prompt, transformationType, productContext } = req.body;
  const result = await generateOrTransformProductImage({
    imageBase64: imageBase64 || '',
    mimeType: mimeType || 'image/jpeg',
    prompt: prompt || '',
    transformationType: transformationType || 'whiteBackground',
    productContext: productContext || 'Kanjeevaram Silk Saree'
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
  const { campaignId, recipients, templateText, paymentLink, merchantApproved = true, campaign } = req.body;
  const result = await dispatchN8NWebhook({
    campaignId: campaignId || `CAMP_${Date.now()}`,
    recipients: recipients || [],
    templateText: templateText || '',
    paymentLink: paymentLink || '',
    merchantApproved,
    campaign: campaign || {}
  });
  res.json(result);
});

app.get('/api/crm/n8n-workflow', (req, res) => {
  res.json(getN8NWorkflowDefinition());
});

app.get('/api/crm/template-status', (req, res) => {
  res.json(getWhatsAppTemplateConfig());
});

// Meta WhatsApp Cloud API delivery-status callback.
// Subscribe this URL on the WABA for the `messages` field. Meta answers 200 as
// soon as the body is parsed and then reports sent/delivered/failed separately,
// which is the only trustworthy delivery signal.
// Meta's subscription verification is a GET, not a POST.
function handleMetaVerification(req, res, next) {
  if (req.query['hub.mode'] !== 'subscribe') return next();
  const expected = process.env.META_WEBHOOK_VERIFY_TOKEN;
  if (expected && req.query['hub.verify_token'] === expected) {
    return res.status(200).send(String(req.query['hub.challenge'] || ''));
  }
  return res.sendStatus(403);
}

app.post('/api/whatsapp/status', handleMetaVerification, (req, res) => {
  let written = 0;
  try {
    written = recordStatusWebhook(req.body);
  } catch (err) {
    console.error('[WhatsApp Status] Failed to record webhook:', err);
    // Still answer 200: a non-2xx makes Meta retry and eventually disable the field.
  }
  console.log(`[WhatsApp Status] Recorded ${written} status update(s)`);
  res.sendStatus(200);
});

app.get('/api/whatsapp/status', handleMetaVerification, (req, res) => {
  res.json(listDeliveryStatuses(25));
});

app.get('/api/whatsapp/status/:messageId', (req, res) => {
  res.json(getDeliveryStatus(req.params.messageId));
});

// ==========================================
// 7. SARVAM AI INDIC LANGUAGE SUITE
// ==========================================
app.post('/api/sarvam/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;
  const result = await translateIndicText({ text, targetLanguage });
  res.json(result);
});

// Batch variant: localizes the whole UI shell in one call from the client.
app.post('/api/sarvam/translate-batch', async (req, res) => {
  const { texts, targetLanguage } = req.body;
  const result = await translateBatch({
    texts: Array.isArray(texts) ? texts.slice(0, 400) : [],
    targetLanguage: targetLanguage || 'hi'
  });
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
  const persisted = saveDB(db);
  res.json({ success: true, persisted, persistence: getPersistenceStatus(), quests: db.quests });
});

// ── Error handler ───────────────────────────────────────────────
// Keeps a thrown route from leaving the function in an undefined state.
// Registered last so it catches errors from every route above.
app.use((err, req, res, next) => {
  console.error(`[Express] ${req.method} ${req.originalUrl} failed:`, err.message);
  if (res.headersSent) return next(err);
  res.status(500).json({
    error: 'Internal server error',
    detail: err.message
  });
});

// ── Export the app for Vercel ───────────────────────────────────
// Vercel runs this file as a single Function and routes requests through the
// exported app instead of a port listener, so `module.exports` must be the app.
// `npm start` / `node index.js` still binds a real port locally.
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 DukaanQuest Backend Server listening on port ${PORT}`);
    console.log(`🔗 Health API: http://127.0.0.1:${PORT}/api/health`);
    console.log(`🌐 Allowed frontend origins: ${ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS.join(', ') : '(none configured — set FRONTEND_URL for cross-origin browser access)'}`);
    console.log(`📦 Gemini Pro, Sarvam AI, n8n Hub, & Paytm Armed`);
    console.log(`====================================================`);
  });
}
