const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// ── Deployment-aware persistence ─────────────────────────────────
// Local development writes data.json in place and keeps working exactly as
// before. On serverless hosts (Vercel Functions) the filesystem is read-only
// outside /tmp and is ephemeral between invocations, so every write would throw.
//
// Rather than throwing (which would turn XP, quest and checklist actions into
// 500s) or silently pretending a write succeeded, we record the real outcome
// and expose it through /api/health as `persistence`. Reads keep working from
// the committed seed either way.
//
// Consequence in production: the store is effectively read-only demo data.
// Migrating to a hosted database is the fix; see VERCEL_DEPLOYMENT.md.
let persistence = {
  writable: true,
  lastError: null,
  lastErrorAt: null
};

function markWriteFailure(err) {
  persistence = {
    writable: false,
    lastError: err.message,
    lastErrorAt: new Date().toISOString()
  };
  // Log once per distinct failure to avoid flooding serverless logs.
  if (persistence.lastError !== err.message) {
    console.warn('[db] Write failed; running read-only with seed data:', err.message);
  }
}

/** Real persistence state, reported honestly by /api/health. */
function getPersistenceStatus() {
  return {
    mode: persistence.writable ? 'PERSISTENT_FILE' : 'READ_ONLY_SEED',
    writable: persistence.writable,
    detail: persistence.writable
      ? `Writes to ${DB_FILE} persist for the life of the process.`
      : 'This host cannot persist writes (read-only or ephemeral filesystem). ' +
        'XP, quest completion, packaging checklist and the WhatsApp delivery log are NOT saved. ' +
        'Reads still return the committed seed data.',
    lastError: persistence.lastError,
    lastErrorAt: persistence.lastErrorAt
  };
}

// Probe writability once at startup so /api/health is accurate before the first
// write attempt. Vercel marks the bundle read-only, so this fails fast there.
function probeWritable() {
  try {
    fs.accessSync(path.dirname(DB_FILE), fs.constants.W_OK);
  } catch (err) {
    markWriteFailure(err);
  }
}

// Initial seed data
const initialData = {
  shopProfile: {
    shopName: "Shree Ganesh Matching & Saree Centre",
    ownerName: "Ramesh Kumar Yadav",
    location: "Gandhi Bazaar, Bengaluru",
    category: "Apparel & Ethnic Wear",
    level: 2,
    levelTitle: "Mohalla Merchant",
    currentXp: 420,
    nextLevelXp: 600,
    streakDays: 4,
    monthlyOfflineRevenue: 148500
  },
  products: [
    {
      id: "prod-001",
      title: "Royal Kanjeevaram Pure Silk Zari Saree",
      sku: "SG-KANJ-MRN-01",
      category: "Saree",
      basePrice: 4850,
      mrp: 6999,
      material: "100% Pure Mulberry Silk with Gold Zari",
      colors: ["Deep Maroon", "Temple Gold Border"],
      stockCount: 14,
      description: "Authentic hand-woven traditional Kanjeevaram silk saree featuring rich temple border and contrast pallu.",
      images: {
        raw: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
        amazonMain: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
        myntraLifestyle: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85",
        fabricDetail: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85",
        dimensionGraphic: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85"
      },
      platformListings: {
        amazon: {
          title: "SHREE GANESH Women's Kanjeevaram Pure Silk Saree with Blouse Piece (Maroon Gold, Free Size)",
          bullets: [
            "FABRIC EXCELLENCE: 100% Pure Mulberry Silk with authentic woven metallic Zari work.",
            "TRADITIONAL WEAVE: South Indian temple motifs with dense contrast pallu design.",
            "OCCASION READY: Ideal for Indian weddings, Diwali celebrations, and family festivities.",
            "PACKAGE INCLUDES: 1 Saree (5.5M) + 1 Unstitched Matching Blouse Piece (0.8M).",
            "CARE DIRECTIVE: Dry Clean Only."
          ],
          keywords: "silk saree, kanjeevaram, wedding saree, pattu saree, maroon gold saree"
        },
        flipkart: {
          title: "SHREE GANESH Woven Kanjivaram Pure Silk Saree (Maroon)",
          keyFeatures: [
            "Type: Kanjivaram",
            "Fabric: Pure Silk Blend",
            "Blouse Piece: Included",
            "Occasion: Wedding & Festive"
          ]
        },
        myntra: {
          title: "SHREE GANESH Traditional Woven Design Kanjeevaram Silk Saree",
          curationNotes: "Elevate your festive wardrobe with this heirloom-worthy Kanjeevaram saree. Style with antique temple gold jewellery."
        }
      }
    }
  ],
  customers: [
    {
      id: "cust-101",
      name: "Ananya Deshpande",
      phone: "+91 84292 46067",
      tags: ["VIP", "Bridal"],
      totalSpend: 24500,
      language: "kn",
      marketingOptIn: true,
      optInDate: "2026-09-01"
    },
    {
      id: "cust-102",
      name: "Sunita Sharma",
      phone: "+91 84292 46067",
      tags: ["VIP", "Festive"],
      totalSpend: 18200,
      language: "hi",
      marketingOptIn: true,
      optInDate: "2026-08-15"
    },
    {
      id: "cust-103",
      name: "Meenakshi Sundaram",
      phone: "+91 84292 46067",
      tags: ["Inactive >30d"],
      totalSpend: 7800,
      language: "ta",
      marketingOptIn: true,
      optInDate: "2026-07-20"
    }
  ],
  readinessRules: {
    amazon: {
      name: "Amazon India",
      checklist: [
        { id: "amz-01", title: "50+ Micron Polybags with Suffocation Warning", mandatory: true, completed: true, xpReward: 30 },
        { id: "amz-02", title: "FNSKU / Barcode Sticker (2 x 1 inch)", mandatory: true, completed: true, xpReward: 30 },
        { id: "amz-03", title: "Outer Carton 'H-Taping' & 3-Foot Drop Test", mandatory: true, completed: false, xpReward: 40 },
        { id: "amz-04", title: "GSTIN with HSN Code 5208 Verification", mandatory: true, completed: true, xpReward: 25 },
        { id: "amz-05", title: "10-Day Customer Return Inspection Protocol", mandatory: false, completed: false, xpReward: 35 }
      ]
    },
    flipkart: {
      name: "Flipkart Seller Hub",
      checklist: [
        { id: "fk-01", title: "Flipkart Security Envelopes / Plain Polybag", mandatory: true, completed: true, xpReward: 30 },
        { id: "fk-02", title: "Shipping Label with Barcoded Tracking AWB", mandatory: true, completed: false, xpReward: 35 },
        { id: "fk-03", title: "GST Tax Invoice Insert inside Box", mandatory: true, completed: false, xpReward: 25 },
        { id: "fk-04", title: "Quality Check Fold & Polybag Tagging", mandatory: false, completed: true, xpReward: 20 }
      ]
    },
    myntra: {
      name: "Myntra Partner Portal",
      checklist: [
        { id: "myn-01", title: "Brand Authorization / Self-Trademark Affidavit", mandatory: true, completed: false, xpReward: 50 },
        { id: "myn-02", title: "Industrial Steam Press & Wrinkle-Free Packing", mandatory: true, completed: false, xpReward: 40 },
        { id: "myn-03", title: "Standardized Garment Hangtag with Thread Seal", mandatory: true, completed: false, xpReward: 35 },
        { id: "myn-04", title: "Curated Model/Mannequin Photography Verification", mandatory: true, completed: true, xpReward: 45 }
      ]
    }
  },
  quests: [
    { id: "quest-01", title: "Master Amazon Apparel Packaging", xp: 60, completed: false },
    { id: "quest-02", title: "AI Studio Transformation", xp: 50, completed: true },
    { id: "quest-03", title: "Connect n8n Automation Engine", xp: 75, completed: false },
    { id: "quest-04", title: "Run 'What-If' Simulation", xp: 40, completed: true }
  ]
};

// Ensure database file exists
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (err) {
      // Cannot create the file (read-only host). Serve the seed from memory;
      // the app stays readable instead of erroring on every route.
      markWriteFailure(err);
      return JSON.parse(JSON.stringify(initialData));
    }
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB file, resetting to initial seed:', err);
    return JSON.parse(JSON.stringify(initialData));
  }
}

/**
 * Persists the store. Returns true when the write landed, false when the host
 * refuses it. Never throws, so callers keep responding with a truthful payload
 * instead of a 500.
 */
function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    if (!persistence.writable) persistence = { writable: true, lastError: null, lastErrorAt: null };
    return true;
  } catch (err) {
    markWriteFailure(err);
    return false;
  }
}

probeWritable();

module.exports = {
  loadDB,
  saveDB,
  getPersistenceStatus
};
