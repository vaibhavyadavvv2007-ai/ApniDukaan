/* Workspace configuration for the shell: navigation, journey steps and the
   integration panel. Kept out of App.jsx so the labels can change without
   touching the wiring, and so the file stays readable. */

/* Labels follow the redesigned workspace wording; the screens behind them are
   unchanged, so nothing here may imply a screen was replaced. Every label is
   looked up in languageTranslations through its key, so the language switch
   in the sidebar actually changes the navigation. */
export const NAV = [
  { id: 'town', label: 'Overview', labelKey: 'navOverview', icon: 'store' },
  { id: 'studio', label: 'Product studio', labelKey: 'navProductStudio', icon: 'sparkles' },
  { id: 'gemini', label: 'Gemini AI Studio', labelKey: 'navGeminiStudio', icon: 'camera' },
  { id: 'catalog', label: 'Marketplace listings', labelKey: 'navListings', icon: 'globe' },
  { id: 'crm', label: 'Customer campaigns', labelKey: 'navCampaigns', icon: 'message' },
  { id: 'simulator', label: 'Growth planner', labelKey: 'navPlanner', icon: 'calculator' },
  { id: 'readiness', label: 'Packaging checklist', labelKey: 'navChecklist', icon: 'package' },
  { id: 'paytm', label: 'Payments', labelKey: 'navPayments', icon: 'card' }
];

export const SUBTITLE_KEYS = {
  studio: 'subStudio',
  gemini: 'subGemini',
  catalog: 'subCatalog',
  crm: 'subCrm',
  simulator: 'subSimulator',
  readiness: 'subReadiness',
  paytm: 'subPaytm'
};

/* English is the fallback whenever a key is missing from a translation. */
export function navLabel(item, t) {
  return (t && t[item.labelKey]) || item.label;
}

export function screenSubtitle(tab, t) {
  const key = SUBTITLE_KEYS[tab];
  return (key && t && t[key]) || '';
}

export const JOURNEY = [
  { id: 'studio', label: 'Photograph', building: 'studio', detail: 'Gemini reads your fabric and writes the listing', gain: 'Listing copy and four marketplace photos ready' },
  { id: 'catalog', label: 'List once', building: 'shop', detail: 'One product record, every marketplace', gain: 'Live on Amazon, Flipkart, Meesho, Myntra and Nykaa' },
  { id: 'crm', label: 'Reach customers', building: 'tower', detail: 'WhatsApp offers in each customer language', gain: 'Existing customers buying again on WhatsApp' },
  { id: 'simulator', label: 'Simulate', building: 'observatory', detail: 'See the profit before you spend the money', gain: 'A tested plan with the risk already priced in' },
  { id: 'town', label: 'Grow', building: null, detail: 'Earn XP and upgrade your shop', gain: 'Level 3, Digital Vyapari' }
];

/* The product-studio journey is driven by the draft, not by page visits. */
export const DRAFT_STAGES = [
  { id: 'studio', label: 'Add product', labelKey: 'stageAddProduct' },
  { id: 'studio', label: 'Review details', labelKey: 'stageReviewDetails' },
  { id: 'catalog', label: 'Prepare listing', labelKey: 'stagePrepareListing' },
  { id: 'crm', label: 'Create campaign', labelKey: 'stageCreateCampaign' }
];

/* Order here is the order the merchant meets the stack, not an importance
   ranking. The state text is always read from /api/health so the panel can
   never drift from the truth. */
export const INTEGRATION_ORDER = ['gemini', 'sarvam', 'n8n', 'whatsapp', 'amazon', 'flipkart', 'meesho', 'myntra', 'nykaa', 'photoStudio', 'paytm'];

export const INTEGRATION_LABELS = {
  gemini: 'Gemini', sarvam: 'Sarvam', n8n: 'n8n', whatsapp: 'WhatsApp',
  amazon: 'Amazon', flipkart: 'Flipkart', meesho: 'Meesho', myntra: 'Myntra',
  nykaa: 'Nykaa', photoStudio: 'Photo studio', paytm: 'Paytm'
};

/* The API returns quests without a building reference, so the link between a
   quest and the building it belongs to lives here, on the frontend. */
export const QUEST_BUILDING = {
  'quest-01': 'warehouse',
  'quest-02': 'studio',
  'quest-03': 'tower',
  'quest-04': 'observatory'
};

/* Shown only until the first health response lands, so the panel is never
   empty. These mirror the classifications the backend actually returns. */
export const FALLBACK_INTEGRATIONS = [
  { name: 'Gemini', state: 'LIVE' },
  { name: 'Sarvam', state: 'LIVE' },
  { name: 'n8n', state: 'LIVE' },
  { name: 'WhatsApp', state: 'STAGED' },
  { name: 'Amazon', state: 'SANDBOX' },
  { name: 'Paytm', state: 'FALLBACK' }
];

/* A step is only "done" when its quest is genuinely completed. Visiting a
   screen is not progress, so the stepper never overstates the merchant. */
export function isStepDone(step, { level, quests, amzProgress }) {
  if (!step.building) return level === 3;
  // The catalog step has no quest of its own, so it tracks the real
  // Amazon readiness signal instead of a page visit.
  if (step.building === 'shop') return amzProgress === 100;
  return quests.some(q => q.completed && QUEST_BUILDING[q.id] === step.building);
}