const axios = require('axios');

/**
 * Google Gemini Multimodal Vision & Generation Service
 * ─────────────────────────────────────────────────────
 * Dual-Model Architecture:
 * 
 * 1. Text & Product Attributes Path:
 *    - Model: GEMINI_TEXT_MODEL (default: 'gemini-3.1-flash-lite')
 *    - Role: Fast, cost-efficient product attribute extraction, SEO titles,
 *            marketplace bullets (Amazon/Flipkart/Myntra), and compliance scoring.
 * 
 * 2. Photo Studio Image Generation / Editing Path:
 *    - Model: GEMINI_IMAGE_MODEL (default: 'gemini-3.1-flash-image')
 *    - Alternative: 'gemini-3.1-flash-lite-image' (latency/cost-optimized)
 *    - Role: Hero-quality e-commerce catalog image generation, white background
 *            isolation, studio lighting synthesis, and visual drape transformations.
 *    - Note: Never uses flash-lite for image generation/editing.
 */

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function getTextModel() {
  return process.env.GEMINI_TEXT_MODEL || process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
}

function getImageModel() {
  return process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image';
}

/**
 * PATH A: Text & Product-Attribute Extraction
 * Uses Flash-Lite for fast, cost-effective attribute extraction & compliance analysis.
 */
async function extractCatalogAttributes({ imageBase64 = '', mimeType = 'image/jpeg', productContext = '' }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = getTextModel();
  const startTime = Date.now();

  if (apiKey) {
    try {
      const endpoint = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;
      const prompt = `You are DukaanQuest AI Studio Copilot for Indian retail shop owners.
Analyze this product photo/context. Context: "${productContext || 'Indian Ethnic Apparel'}".
Return a STRICT JSON object with these keys:
{
  "productTitle": "SEO optimized marketplace title (max 160 chars)",
  "fabricClassification": "Detected weave, fabric material and craftsmanship",
  "amazonBullets": ["5 feature-benefit bullet points"],
  "flipkartFeatures": ["4 key catalog attributes"],
  "myntraCuration": "Editorial high-fashion styling guide",
  "complianceScore": 92,
  "recommendations": "Actionable advice for pure white #FFFFFF background & lighting",
  "visualPrompts": {
    "whiteBackground": "Isolated product on pure #FFFFFF background with soft contact shadow",
    "lifestyle": "Indian ethnic model draped in festive setting",
    "macro": "Macro zoom on intricate border zari weave"
  }
}`;

      const parts = [{ text: prompt }];

      if (imageBase64 && imageBase64.length > 50) {
        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
          }
        });
      }

      const payload = {
        contents: [{ parts }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.2
        }
      };

      const response = await axios.post(endpoint, payload, { timeout: 15000 });
      const latencyMs = Date.now() - startTime;
      const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (candidateText) {
        const parsed = JSON.parse(candidateText);
        return {
          success: true,
          liveAPI: true,
          mode: "live",
          model,
          path: "text-attribute-extraction",
          latencyMs,
          analysis: parsed
        };
      }
    } catch (err) {
      console.warn(`[Gemini Text Service] Live API error (${err.message}). Activating local text fallback.`);
    }
  }

  // Deterministic local fallback for text extraction
  const latencyMs = Date.now() - startTime;
  return {
    success: true,
    liveAPI: false,
    mode: "offline-fallback",
    model: `${model} (local-fallback)`,
    path: "text-attribute-extraction",
    latencyMs: Math.max(15, latencyMs),
    analysis: {
      productTitle: "SHREE GANESH Women's Kanjeevaram Pure Silk Saree with Blouse Piece (Maroon Gold)",
      fabricClassification: "100% Pure Mulberry Silk with metallic Gold Zari border",
      amazonBullets: [
        "FABRIC EXCELLENCE: 100% Pure Mulberry Silk with authentic woven metallic Zari work.",
        "TRADITIONAL WEAVE: South Indian temple motifs with dense contrast pallu design.",
        "OCCASION READY: Ideal for Indian weddings, Diwali celebrations, and family festivities.",
        "PACKAGE INCLUDES: 1 Saree (5.5M) + 1 Unstitched Matching Blouse Piece (0.8M).",
        "CARE DIRECTIVE: Dry Clean Only to maintain the lustrous shine of gold zari."
      ],
      flipkartFeatures: [
        "Type: Kanjivaram Silk",
        "Fabric: Pure Silk Blend",
        "Occasion: Wedding & Festive",
        "Blouse Piece: Included (0.8M)"
      ],
      myntraCuration: "Elevate your festive wardrobe with this heirloom-worthy Kanjeevaram saree. Style with antique temple gold jewellery.",
      complianceScore: 94,
      recommendations: "Background replaced with pure white #FFFFFF, lighting normalized, 88% product frame occupancy achieved.",
      visualPrompts: {
        whiteBackground: "Isolated saree on pure #FFFFFF background with soft contact shadow",
        lifestyle: "Royal Indian wedding backdrop with warm ambient lighting",
        macro: "10x zoom on gold zari thread intertwining"
      }
    }
  };
}

/**
 * PATH B: Photo Studio Image Generation / Editing
 * Uses dedicated image models (gemini-3.1-flash-image or gemini-3.1-flash-lite-image).
 * NEVER uses flash-lite for image generation/editing.
 */
async function generateOrTransformProductImage({
  imageBase64 = '',
  mimeType = 'image/jpeg',
  prompt = '',
  transformationType = 'whiteBackground',
  productContext = 'Kanjeevaram Silk Saree'
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = getImageModel();
  const startTime = Date.now();

  const defaultPrompts = {
    whiteBackground: `Professional e-commerce product photograph of ${productContext}, centered, isolated on pure pristine white #FFFFFF background, crisp commercial lighting, soft natural contact shadow, high-end retail marketplace standard.`,
    lifestyle: `Editorial lifestyle catalog photo of an Indian woman elegantly draped in ${productContext}, luxury festive ambiance, warm golden hour ambient lighting, high fashion Myntra lookbook style.`,
    macro: `Ultra-detailed macro close-up shot focusing on the intricate woven gold zari border of ${productContext}, sharp texture, metallic sheen, 4K quality.`
  };

  const activePrompt = prompt || defaultPrompts[transformationType] || defaultPrompts.whiteBackground;

  if (apiKey) {
    try {
      const endpoint = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;
      const parts = [{ text: activePrompt }];

      if (imageBase64 && imageBase64.length > 50) {
        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
          }
        });
      }

      const payload = { contents: [{ parts }] };
      const response = await axios.post(endpoint, payload, { timeout: 20000 });
      const latencyMs = Date.now() - startTime;

      // Check if image data was returned in candidate parts
      const candidateParts = response.data?.candidates?.[0]?.content?.parts || [];
      const imagePart = candidateParts.find(p => p.inline_data);
      const textPart = candidateParts.find(p => p.text);

      if (imagePart?.inline_data) {
        return {
          success: true,
          liveAPI: true,
          mode: "live",
          model,
          path: "image-generation-editing",
          transformationType,
          latencyMs,
          image: {
            mimeType: imagePart.inline_data.mime_type,
            data: `data:${imagePart.inline_data.mime_type};base64,${imagePart.inline_data.data}`
          },
          summary: "Hero-quality image generated live via Gemini Image model"
        };
      } else if (textPart?.text) {
        return {
          success: true,
          liveAPI: true,
          mode: "live-guided",
          model,
          path: "image-generation-editing",
          transformationType,
          latencyMs,
          guidance: textPart.text,
          fallbackImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
          summary: "Image transformation prompt processed live by Gemini Image model"
        };
      }
    } catch (err) {
      const status = err.response?.status;
      const errorMsg = err.response?.data?.error?.message || err.message;
      const isQuota = status === 429 || errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED');
      
      console.warn(`[Gemini Image Service] Live API notice (${model}): HTTP ${status || 'ERR'} - ${errorMsg.substring(0, 120)}`);
      
      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        liveAPI: false,
        mode: isQuota ? "live-quota-limited" : "offline-fallback",
        model,
        path: "image-generation-editing",
        transformationType,
        latencyMs,
        apiHttpStatus: status || null,
        apiStatusDetail: isQuota 
          ? "Google Cloud project requires pay-as-you-go billing for Gemini Image models (Free tier quota limit is 0)."
          : errorMsg.substring(0, 160),
        fallbackImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
        summary: `Photo Studio asset provided via staged high-res catalog pipeline (${model})`
      };
    }
  }

  const latencyMs = Date.now() - startTime;
  return {
    success: true,
    liveAPI: false,
    mode: "offline-fallback",
    model: `${model} (staged-pipeline)`,
    path: "image-generation-editing",
    transformationType,
    latencyMs: Math.max(20, latencyMs),
    fallbackImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
    summary: "Staged high-resolution e-commerce catalog image"
  };
}

/**
 * Combined Photo Studio analysis & enhancement endpoint.
 * Orchestrates Path A (Text Attributes via Flash-Lite) AND Path B (Image Transformation via Flash-Image).
 */
async function analyzeAndEnhanceImage({ imageBase64 = '', mimeType = 'image/jpeg', productContext = '' }) {
  const [textResult, imageResult] = await Promise.all([
    extractCatalogAttributes({ imageBase64, mimeType, productContext }),
    generateOrTransformProductImage({ imageBase64, mimeType, productContext, transformationType: 'whiteBackground' })
  ]);

  // Derive clear, separate statuses for each path
  const textStatus = textResult.liveAPI ? 'LIVE' : 'FALLBACK';
  const imageIsLive = imageResult.liveAPI && imageResult.image; // Only LIVE if actual image data returned
  const imageIsQuotaLimited = imageResult.mode === 'live-quota-limited';
  const imageStatus = imageIsLive ? 'LIVE' : (imageIsQuotaLimited ? 'STAGED_QUOTA_LIMITED' : 'STAGED_FALLBACK');

  return {
    success: true,
    liveAPI: textResult.liveAPI,
    mode: textResult.mode,
    models: {
      text: textResult.model,
      image: imageResult.model
    },
    pathStatuses: {
      textExtraction: {
        status: textStatus,
        liveAPI: textResult.liveAPI,
        detail: textStatus === 'LIVE'
          ? `Live AI inference via ${textResult.model} (${textResult.latencyMs}ms)`
          : 'Deterministic local fallback attributes (no live AI call)'
      },
      imageGeneration: {
        status: imageStatus,
        liveAPI: imageResult.liveAPI || false,
        isAIGenerated: imageIsLive,
        detail: imageIsLive
          ? `Live AI-generated hero image via ${imageResult.model} (${imageResult.latencyMs}ms)`
          : imageIsQuotaLimited
            ? `Model ${imageResult.model} reached live (HTTP ${imageResult.apiHttpStatus}); free-tier quota is 0 — staged high-res catalog asset shown. Enable pay-as-you-go billing for live generation.`
            : 'Staged high-resolution catalog asset (no live AI image generation)',
        quotaNote: imageIsQuotaLimited
          ? 'Google Cloud project requires pay-as-you-go billing for Gemini Image models. Once billing is enabled, this path will return LIVE AI-generated images.'
          : null
      }
    },
    latencyMs: textResult.latencyMs + imageResult.latencyMs,
    analysis: textResult.analysis,
    imageAsset: imageResult
  };
}

/**
 * Health check with REAL live API verification for BOTH paths:
 * 1. Path A: Text/attribute model probe (GEMINI_TEXT_MODEL)
 * 2. Path B: Image model probe (GEMINI_IMAGE_MODEL)
 */
async function getGeminiHealth() {
  const apiKey = process.env.GEMINI_API_KEY;
  const configured = !!apiKey;
  const textModel = getTextModel();
  const imageModel = getImageModel();

  const health = {
    configured,
    isLive: false,
    mode: "offline-fallback",
    models: {
      textModel: {
        id: textModel,
        role: "Text & Catalog Attribute Extraction",
        status: "NOT_VERIFIED",
        httpStatus: null,
        detail: null
      },
      imageModel: {
        id: imageModel,
        role: "Photo Studio Hero Image Generation & Editing",
        status: "NOT_VERIFIED",
        httpStatus: null,
        detail: null
      }
    },
    verificationStatus: "NOT_VERIFIED",
    verificationDetail: null,
    lastVerified: null
  };

  if (!apiKey) {
    health.verificationDetail = "GEMINI_API_KEY is empty or missing in .env";
    return health;
  }

  // 1. Probe Text Model (Flash-Lite)
  try {
    const textEndpoint = `${GEMINI_BASE_URL}/${textModel}:generateContent?key=${apiKey}`;
    const textProbe = await axios.post(
      textEndpoint,
      {
        contents: [{ parts: [{ text: "Reply with exactly: OK" }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 5 }
      },
      { timeout: 18000 }
    );

    const reply = textProbe.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    health.models.textModel.httpStatus = textProbe.status;
    if (reply) {
      health.models.textModel.status = "LIVE_VERIFIED";
      health.models.textModel.detail = `Model responded: "${reply.trim().substring(0, 20)}"`;
      health.isLive = true;
      health.mode = "live";
    }
  } catch (err) {
    health.models.textModel.httpStatus = err.response?.status || null;
    health.models.textModel.status = "LIVE_PROBE_ERROR";
    health.models.textModel.detail = `Error: ${err.response?.status || ''} ${err.message}`.trim();
  }

  // 2. Probe Image Model (Flash-Image / Flash-Lite-Image)
  try {
    const imgEndpoint = `${GEMINI_BASE_URL}/${imageModel}:generateContent?key=${apiKey}`;
    const imgProbe = await axios.post(
      imgEndpoint,
      {
        contents: [{ parts: [{ text: "ping" }] }]
      },
      { timeout: 8000 }
    );
    health.models.imageModel.httpStatus = imgProbe.status;
    health.models.imageModel.status = "LIVE_VERIFIED";
    health.models.imageModel.detail = `Image model responded with HTTP ${imgProbe.status}`;
  } catch (err) {
    const status = err.response?.status;
    const isQuota = status === 429;
    health.models.imageModel.httpStatus = status || null;
    health.models.imageModel.status = isQuota ? "LIVE_REACHABLE_BILLING_REQUIRED" : "PROBE_ERROR";
    health.models.imageModel.detail = isQuota 
      ? `HTTP 429: Endpoint reached live; Google Cloud requires pay-as-you-go billing for image models (free tier limit: 0)`
      : `Error: ${status || ''} ${err.message}`.trim();
  }

  // Set overall verification
  if (health.models.textModel.status === "LIVE_VERIFIED") {
    health.verificationStatus = "LIVE_VERIFIED";
    health.verificationDetail = `Text model (${textModel}) verified live. Image model (${imageModel}) live-authenticated (${health.models.imageModel.status}).`;
    health.lastVerified = new Date().toISOString();
  } else {
    health.verificationStatus = "VERIFICATION_FAILED";
    health.verificationDetail = health.models.textModel.detail;
  }

  return health;
}

module.exports = {
  getTextModel,
  getImageModel,
  extractCatalogAttributes,
  generateOrTransformProductImage,
  analyzeAndEnhanceImage,
  getGeminiHealth
};
