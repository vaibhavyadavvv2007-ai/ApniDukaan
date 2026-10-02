const axios = require('axios');
const { getLwaAccessToken, maskCredential } = require('./amazonService');

/**
 * Amazon SP-API Listings Proof-of-Concept Service
 * ─────────────────────────────────────────────────
 * Implements the official SP-API listing workflow:
 *   1. Product Type Definitions → discover required attributes
 *   2. Listings Items API → sandbox PUT listing (if sandbox write is supported)
 *   3. Manual/Export fallback → generate compliant JSON for manual upload
 *
 * Docs:
 *   - Product Type Definitions: https://developer-docs.amazon.com/sp-api/docs/product-type-definitions-api-v2020-09-01-reference
 *   - Listings Items: https://developer-docs.amazon.com/sp-api/docs/listings-items-api-v2021-08-01-reference
 *   - Sandbox: https://developer-docs.amazon.com/sp-api/docs/the-selling-partner-api-sandbox
 *
 * Security: NEVER expose LWA secrets in responses. Sandbox-only — production publishing blocked.
 */

const SANDBOX_HOST = 'https://sandbox.sellingpartnerapi-eu.amazon.com';
const MARKETPLACE_ID_IN = 'A21TJRUUN4KGV'; // Amazon.in

// ─── Product Type Definitions ─────────────────────────────────────

/**
 * Search for product type definitions in the sandbox catalog.
 * Endpoint: GET /definitions/2020-09-01/productTypes
 */
async function searchProductTypes({ keywords = 'SAREE' } = {}) {
  const tokenResult = await getLwaAccessToken();
  if (!tokenResult.success) {
    return _fallbackProductTypes(keywords, tokenResult.reason);
  }

  try {
    const url = `${SANDBOX_HOST}/definitions/2020-09-01/productTypes`;
    const response = await axios.get(url, {
      params: {
        keywords,
        marketplaceIds: MARKETPLACE_ID_IN,
        itemName: keywords
      },
      headers: {
        'x-amz-access-token': tokenResult.accessToken,
        'User-Agent': 'DukaanQuest/1.0 (Language=JavaScript; Platform=Windows)'
      },
      timeout: 10000
    });

    return {
      success: true,
      mode: 'sandbox',
      source: 'SP-API Product Type Definitions (Sandbox)',
      productTypes: response.data?.productTypes || [],
      totalCount: response.data?.productTypes?.length || 0
    };
  } catch (err) {
    const status = err.response?.status;
    const errData = err.response?.data;
    console.warn(`[Amazon Listings] searchProductTypes sandbox error (${status}):`, errData || err.message);

    // Sandbox may not support this endpoint — fallback with known product types
    return _fallbackProductTypes(keywords, `Sandbox returned ${status}: ${JSON.stringify(errData) || err.message}`);
  }
}

/**
 * Get the JSON schema for a specific product type.
 * Endpoint: GET /definitions/2020-09-01/productTypes/{productType}
 */
async function getProductTypeDefinition({ productType = 'SAREE' } = {}) {
  const tokenResult = await getLwaAccessToken();
  if (!tokenResult.success) {
    return _fallbackDefinition(productType, tokenResult.reason);
  }

  try {
    const url = `${SANDBOX_HOST}/definitions/2020-09-01/productTypes/${encodeURIComponent(productType)}`;
    const response = await axios.get(url, {
      params: {
        marketplaceIds: MARKETPLACE_ID_IN,
        requirements: 'LISTING',
        locale: 'en_IN'
      },
      headers: {
        'x-amz-access-token': tokenResult.accessToken,
        'User-Agent': 'DukaanQuest/1.0 (Language=JavaScript; Platform=Windows)'
      },
      timeout: 10000
    });

    return {
      success: true,
      mode: 'sandbox',
      source: 'SP-API Product Type Definition Schema (Sandbox)',
      productType,
      schema: response.data?.schema,
      requirements: response.data?.requirements,
      propertyGroups: response.data?.propertyGroups
    };
  } catch (err) {
    const status = err.response?.status;
    console.warn(`[Amazon Listings] getProductTypeDefinition sandbox error (${status}):`, err.response?.data || err.message);
    return _fallbackDefinition(productType, `Sandbox returned ${status}: ${err.message}`);
  }
}

// ─── Listings Items API ───────────────────────────────────────────

/**
 * Submit a product listing via PUT /listings/2021-08-01/items/{sellerId}/{sku}
 * Uses sandbox endpoint. If sandbox write is unsupported, returns export-ready payload.
 */
async function putListingsItem({ masterProduct, sellerId = 'SANDBOX_SELLER_ID', sku = null }) {
  const effectiveSku = sku || masterProduct?.sku || `DQ_${Date.now()}`;
  const payload = buildListingsPayload(masterProduct);

  const tokenResult = await getLwaAccessToken();
  if (!tokenResult.success) {
    return _exportFallback(effectiveSku, payload, tokenResult.reason);
  }

  try {
    const url = `${SANDBOX_HOST}/listings/2021-08-01/items/${encodeURIComponent(sellerId)}/${encodeURIComponent(effectiveSku)}`;
    const response = await axios.put(url, payload, {
      params: {
        marketplaceIds: MARKETPLACE_ID_IN
      },
      headers: {
        'x-amz-access-token': tokenResult.accessToken,
        'Content-Type': 'application/json',
        'User-Agent': 'DukaanQuest/1.0 (Language=JavaScript; Platform=Windows)'
      },
      timeout: 15000
    });

    return {
      success: true,
      mode: 'sandbox',
      sandboxWriteSupported: true,
      source: 'SP-API Listings Items PUT (Sandbox)',
      sku: effectiveSku,
      sellerId,
      status: response.data?.status || 'ACCEPTED',
      submissionId: response.data?.submissionId,
      issues: response.data?.issues || [],
      responseData: response.data,
      payload
    };
  } catch (err) {
    const status = err.response?.status;
    const errData = err.response?.data;
    console.warn(`[Amazon Listings] putListingsItem sandbox error (${status}):`, errData || err.message);

    // If 400/403/404 → sandbox write not supported for this operation
    // Return export-ready payload for manual upload via Seller Central
    return _exportFallback(effectiveSku, payload,
      `Sandbox write returned ${status}: ${JSON.stringify(errData?.errors?.[0]?.message || errData) || err.message}`,
      status, errData
    );
  }
}

/**
 * Build SP-API Listings Items JSON payload from a DukaanQuest master product.
 * Follows the JSON_LISTINGS_FEED schema with productType-specific attributes.
 */
function buildListingsPayload(masterProduct) {
  if (!masterProduct) masterProduct = {};

  return {
    productType: 'SAREE',
    requirements: 'LISTING',
    attributes: {
      item_name: [{
        value: masterProduct.title || 'SHREE GANESH Women\'s Kanjeevaram Pure Silk Saree with Blouse Piece',
        language_tag: 'en_IN',
        marketplace_id: MARKETPLACE_ID_IN
      }],
      brand: [{
        value: masterProduct.brand || 'SHREE GANESH'
      }],
      bullet_point: (masterProduct.platformListings?.amazon?.bullets || [
        'FABRIC EXCELLENCE: 100% Pure Mulberry Silk with authentic woven metallic Zari work.',
        'TRADITIONAL WEAVE: South Indian temple motifs with dense contrast pallu design.',
        'OCCASION READY: Ideal for Indian weddings, Diwali celebrations, and family festivities.',
        'PACKAGE INCLUDES: 1 Saree (5.5M) + 1 Unstitched Matching Blouse Piece (0.8M).',
        'CARE DIRECTIVE: Dry Clean Only to maintain the lustrous shine of gold zari.'
      ]).map(b => ({ value: b, language_tag: 'en_IN' })),
      manufacturer: [{
        value: masterProduct.manufacturer || 'Shree Ganesh Matching & Saree Centre'
      }],
      part_number: [{
        value: masterProduct.sku || `SGMS-KV-${Date.now()}`
      }],
      color: [{
        value: masterProduct.color || 'Maroon Gold'
      }],
      department: [{
        value: 'womens'
      }],
      material_composition: [{
        value: masterProduct.fabric || '100% Pure Mulberry Silk'
      }],
      country_of_origin: [{
        value: 'IN'
      }],
      item_type_keyword: [{
        value: 'saree'
      }],
      standard_price: [{
        value: Number(masterProduct.basePrice) || 4850,
        currency: 'INR'
      }],
      fulfillment_availability: [{
        fulfillment_channel_code: 'DEFAULT',
        quantity: Number(masterProduct.stockCount) || 10
      }],
      item_package_dimensions: [{
        length: { value: 38, unit: 'centimeters' },
        width: { value: 28, unit: 'centimeters' },
        height: { value: 4, unit: 'centimeters' },
        weight: { value: 850, unit: 'grams' }
      }],
      main_product_image_locator: [{
        media_location: masterProduct.images?.amazonMain || masterProduct.images?.raw || 'https://placeholder.dukaan.quest/saree-main.jpg'
      }]
    }
  };
}

// ─── Fallbacks ────────────────────────────────────────────────────

/**
 * Manual/export fallback when sandbox write operations are unsupported.
 * Generates a complete, compliant JSON payload ready for Seller Central manual upload.
 */
function _exportFallback(sku, payload, reason, httpStatus = null, rawError = null) {
  return {
    success: true,
    mode: 'export-fallback',
    sandboxWriteSupported: false,
    source: 'DukaanQuest Export Engine (Sandbox write unavailable)',
    sku,
    reason,
    httpStatus,
    exportReadyPayload: payload,
    exportFormat: 'JSON_LISTINGS_FEED',
    uploadInstructions: {
      method: 'Seller Central → Add a Product → Upload via Flat File / JSON Feed',
      step1: 'Log in to sellercentral.amazon.in',
      step2: 'Navigate to Inventory → Add a Product via Upload',
      step3: 'Select "JSON Listings Feed" format',
      step4: 'Paste or upload the exportReadyPayload JSON above',
      step5: 'Submit and monitor feed processing status',
      alternativeEndpoint: 'POST /feeds/2021-06-30/feeds (Feeds API v2021-06-30) — requires production authorization'
    },
    safeguard: {
      productionPublishingBlocked: true,
      message: 'Export payload is SP-API compliant. Production publishing requires live seller authorization.'
    }
  };
}

function _fallbackProductTypes(keywords, reason) {
  return {
    success: true,
    mode: 'export-fallback',
    source: 'DukaanQuest Reference Data (Sandbox endpoint unavailable)',
    reason,
    productTypes: [
      { name: 'SAREE', marketplaceIds: [MARKETPLACE_ID_IN], displayName: 'Saree' },
      { name: 'DUPATTA', marketplaceIds: [MARKETPLACE_ID_IN], displayName: 'Dupatta' },
      { name: 'LEHENGA', marketplaceIds: [MARKETPLACE_ID_IN], displayName: 'Lehenga Choli' },
      { name: 'KURTA', marketplaceIds: [MARKETPLACE_ID_IN], displayName: 'Kurta' },
      { name: 'DRESS', marketplaceIds: [MARKETPLACE_ID_IN], displayName: 'Dress' }
    ],
    totalCount: 5,
    notice: 'Product types sourced from DukaanQuest reference catalog. Use searchProductTypes in production for live catalog.'
  };
}

function _fallbackDefinition(productType, reason) {
  return {
    success: true,
    mode: 'export-fallback',
    source: 'DukaanQuest Reference Schema (Sandbox endpoint unavailable)',
    reason,
    productType,
    requiredAttributes: [
      { name: 'item_name', type: 'string', required: true, description: 'Product title (max 200 chars)' },
      { name: 'brand', type: 'string', required: true, description: 'Brand name' },
      { name: 'bullet_point', type: 'string[]', required: true, description: '5 bullet points (max 5)' },
      { name: 'standard_price', type: 'object', required: true, description: '{ value, currency }' },
      { name: 'fulfillment_availability', type: 'object', required: true, description: '{ quantity, fulfillment_channel_code }' },
      { name: 'country_of_origin', type: 'string', required: true, description: 'ISO 3166-1 alpha-2 country code' },
      { name: 'main_product_image_locator', type: 'object', required: true, description: '{ media_location }' },
      { name: 'manufacturer', type: 'string', required: true, description: 'Manufacturer name' },
      { name: 'color', type: 'string', required: true, description: 'Primary color' },
      { name: 'department', type: 'string', required: true, description: 'Target department' },
      { name: 'material_composition', type: 'string', required: true, description: 'Fabric/material' }
    ],
    optionalAttributes: [
      { name: 'item_package_dimensions', type: 'object', description: 'Package dimensions and weight' },
      { name: 'part_number', type: 'string', description: 'SKU / Part number' },
      { name: 'item_type_keyword', type: 'string', description: 'Item type keyword' },
      { name: 'other_image_locator', type: 'object[]', description: 'Additional product images' }
    ],
    notice: 'Schema derived from Amazon SP-API documentation for SAREE product type. Use getProductTypeDefinition in production for live schema.'
  };
}

module.exports = {
  searchProductTypes,
  getProductTypeDefinition,
  putListingsItem,
  buildListingsPayload
};
