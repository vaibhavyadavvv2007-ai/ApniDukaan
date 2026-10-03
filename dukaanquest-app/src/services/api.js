/**
 * DukaanQuest Centralized API Service Client
 * Connects Frontend directly to Express Backend & Sponsor Microservices
 */

const BASE_URL = '/api';
async function readResponse(res) {
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
 return data;
}

export async function fetchHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return await readResponse(res);
  } catch (err) {
    console.warn('API fetchHealth error:', err);
    return null;
  }
}

export async function fetchShopProfile() {
  const res = await fetch(`${BASE_URL}/shop`);
  return await readResponse(res);
}

export async function updateShopXp(xpToAdd) {
  const res = await fetch(`${BASE_URL}/shop/xp`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ xpToAdd })
  });
  return await readResponse(res);
}

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  return await readResponse(res);
}

export async function createProduct(productData) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  return await readResponse(res);
}

export async function fetchReadinessRules() {
  const res = await fetch(`${BASE_URL}/readiness`);
  return await readResponse(res);
}

export async function toggleReadinessTask(platform, taskId, completed) {
  const res = await fetch(`${BASE_URL}/readiness/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform, taskId, completed })
  });
  return await readResponse(res);
}

export async function fetchScrapedSpecs(platform, category) {
  const res = await fetch(`${BASE_URL}/readiness/scrape?platform=${platform}&category=${category}`);
  return await readResponse(res);
}

export async function enhanceImageWithGemini(imageBase64, productContext) {
  const res = await fetch(`${BASE_URL}/studio/enhance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, productContext })
  });
  return await readResponse(res);
}

export async function uploadAndEnhanceImage(formData) {
  const res = await fetch(`${BASE_URL}/studio/upload`, {
    method: 'POST',
    body: formData
  });
  return await readResponse(res);
}

export async function generateImageWithGemini({ imageBase64, prompt, transformationType, productContext }) {
  const res = await fetch(`${BASE_URL}/studio/generate-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, prompt, transformationType, productContext })
  });
  return await readResponse(res);
}

export async function extractProductAttributesWithGemini({ imageBase64, productContext }) {
  const res = await fetch(`${BASE_URL}/studio/extract-attributes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, productContext })
  });
  return await readResponse(res);
}

export async function fetchCustomers() {
  const res = await fetch(`${BASE_URL}/crm/customers`);
  return await readResponse(res);
}

export async function dispatchCampaign(campaignData) {
  const res = await fetch(`${BASE_URL}/crm/broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaignData)
  });
  return await readResponse(res);
}

export async function fetchN8NWorkflow() {
  const res = await fetch(`${BASE_URL}/crm/n8n-workflow`);
  return await readResponse(res);
}

export async function fetchWhatsAppTemplateStatus() {
  try {
    const res = await fetch(`${BASE_URL}/crm/template-status`);
    return await readResponse(res);
  } catch (err) {
    console.warn('Could not fetch template status:', err);
    return null;
  }
}

export async function translateWithSarvam(text, targetLanguage) {
  const res = await fetch(`${BASE_URL}/sarvam/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage })
  });
  return await readResponse(res);
}

export async function createPaytmPaymentLink(linkData) {
  const res = await fetch(`${BASE_URL}/paytm/create-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(linkData)
  });
  return await readResponse(res);
}

export async function fetchQuests() {
  const res = await fetch(`${BASE_URL}/quests`);
  return await readResponse(res);
}

export async function completeQuest(questId) {
  const res = await fetch(`${BASE_URL}/quests/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questId })
  });
  return await readResponse(res);
}

export async function verifyAmazonSandbox() {
  const res = await fetch(`${BASE_URL}/amazon/verify-sandbox`);
  return await readResponse(res);
}

export async function fetchAmazonProductTypes(keywords = 'SAREE') {
  const res = await fetch(`${BASE_URL}/amazon/product-types?keywords=${encodeURIComponent(keywords)}`);
  return await readResponse(res);
}

export async function fetchAmazonProductTypeDefinition(productType = 'SAREE') {
  const res = await fetch(`${BASE_URL}/amazon/product-type-definition?productType=${encodeURIComponent(productType)}`);
  return await readResponse(res);
}

export async function submitAmazonListing(masterProduct, sellerId = 'SANDBOX_SELLER_ID', sku = null) {
  const res = await fetch(`${BASE_URL}/amazon/listings/put`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ masterProduct, sellerId, sku })
  });
  return await readResponse(res);
}

export async function exportAmazonListing(masterProduct) {
  const res = await fetch(`${BASE_URL}/amazon/listings/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ masterProduct })
  });
  return await readResponse(res);
}
