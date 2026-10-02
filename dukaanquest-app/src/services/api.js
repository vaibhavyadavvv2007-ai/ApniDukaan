/**
 * DukaanQuest Centralized API Service Client
 * Connects Frontend directly to Express Backend & Sponsor Microservices
 */

const BASE_URL = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchHealth error:', err);
    return null;
  }
}

export async function fetchShopProfile() {
  const res = await fetch(`${BASE_URL}/shop`);
  return await res.json();
}

export async function updateShopXp(xpToAdd) {
  const res = await fetch(`${BASE_URL}/shop/xp`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ xpToAdd })
  });
  return await res.json();
}

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  return await res.json();
}

export async function createProduct(productData) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  return await res.json();
}

export async function fetchReadinessRules() {
  const res = await fetch(`${BASE_URL}/readiness`);
  return await res.json();
}

export async function toggleReadinessTask(platform, taskId, completed) {
  const res = await fetch(`${BASE_URL}/readiness/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform, taskId, completed })
  });
  return await res.json();
}

export async function fetchScrapedSpecs(platform, category) {
  const res = await fetch(`${BASE_URL}/readiness/scrape?platform=${platform}&category=${category}`);
  return await res.json();
}

export async function enhanceImageWithGemini(imageBase64, productContext) {
  const res = await fetch(`${BASE_URL}/studio/enhance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, productContext })
  });
  return await res.json();
}

export async function uploadAndEnhanceImage(formData) {
  const res = await fetch(`${BASE_URL}/studio/upload`, {
    method: 'POST',
    body: formData
  });
  return await res.json();
}

export async function fetchCustomers() {
  const res = await fetch(`${BASE_URL}/crm/customers`);
  return await res.json();
}

export async function dispatchCampaign(campaignData) {
  const res = await fetch(`${BASE_URL}/crm/broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaignData)
  });
  return await res.json();
}

export async function fetchN8NWorkflow() {
  const res = await fetch(`${BASE_URL}/crm/n8n-workflow`);
  return await res.json();
}

export async function fetchWhatsAppTemplateStatus() {
  try {
    const res = await fetch(`${BASE_URL}/crm/template-status`);
    return await res.json();
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
  return await res.json();
}

export async function createPaytmPaymentLink(linkData) {
  const res = await fetch(`${BASE_URL}/paytm/create-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(linkData)
  });
  return await res.json();
}

export async function fetchQuests() {
  const res = await fetch(`${BASE_URL}/quests`);
  return await res.json();
}

export async function completeQuest(questId) {
  const res = await fetch(`${BASE_URL}/quests/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questId })
  });
  return await res.json();
}
