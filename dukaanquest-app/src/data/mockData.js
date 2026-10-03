// Comprehensive, realistic mock dataset for DukaanQuest
// Grounded in "Shree Ganesh Matching & Saree Centre" (Ramesh-ji's real shop)

export const shopProfile = {
  shopName: "Shree Ganesh Matching & Saree Centre",
  ownerName: "Ramesh Kumar Yadav",
  location: "Gandhi Bazaar, Bengaluru",
  category: "Apparel & Ethnic Wear",
  level: 2,
  levelTitle: "Mohalla Merchant",
  nextLevelTitle: "Digital Vyapari",
  currentXp: 420,
  nextLevelXp: 600,
  streakDays: 4,
  monthlyOfflineRevenue: 148500,
  activeProducts: 42,
  listedOnlineProducts: 6,
  registeredCustomers: 184,
  currencySymbol: "₹"
};

export const platformReadinessRules = {
  amazon: {
    name: "Amazon India",
    logoColor: "#FF9900",
    feeRate: "17.5% Category Commission + ₹15 Pick & Pack",
    checklist: [
      {
        id: "amz-01",
        title: "50+ Micron Polybags with Suffocation Warning",
        category: "Packaging",
        mandatory: true,
        spec: "Must be transparent, minimum 50 microns thickness, with bilingual warning text: 'Keep away from children'.",
        completed: true,
        xpReward: 30
      },
      {
        id: "amz-02",
        title: "FNSKU / Barcode Sticker (2 x 1 inch)",
        category: "Labeling",
        mandatory: true,
        spec: "Each saree variant must have a unique scannable barcode label on the outer polybag. Cannot cover product details.",
        completed: true,
        xpReward: 30
      },
      {
        id: "amz-03",
        title: "Outer Carton 'H-Taping' & 3-Foot Drop Test",
        category: "Dispatch",
        mandatory: true,
        spec: "Outer cardboard carton must withstand a 3-foot drop without tearing. Seal all box seams in an 'H' pattern using 2-inch tape.",
        completed: false,
        xpReward: 40
      },
      {
        id: "amz-04",
        title: "GSTIN with HSN Code 5208 Verification",
        category: "Legal & Tax",
        mandatory: true,
        spec: "Active GST registration matching merchant bank account name. Cotton/Silk fabrics classified under HSN 5208/5007.",
        completed: true,
        xpReward: 25
      },
      {
        id: "amz-05",
        title: "10-Day Customer Return Inspection Protocol",
        category: "Returns",
        mandatory: false,
        spec: "Apparel category requires accepting 10-day customer returns. Keep security tag attached so worn garments cannot be returned.",
        completed: false,
        xpReward: 35
      }
    ]
  },
  flipkart: {
    name: "Flipkart Seller Hub",
    logoColor: "#2874F0",
    feeRate: "16.0% Commission + ₹18 Collection Fee",
    checklist: [
      {
        id: "fk-01",
        title: "Flipkart Security Envelopes / Plain Polybag",
        category: "Packaging",
        mandatory: true,
        spec: "Flipkart Fulfilled requires tamper-evident tamper-proof bags. Direct ship requires plain non-branded 55 micron bags.",
        completed: true,
        xpReward: 30
      },
      {
        id: "fk-02",
        title: "Shipping Label with Barcoded Tracking AWB",
        category: "Labeling",
        mandatory: true,
        spec: "Thermal printed label (4x6 inches) with clear AWB barcode and Flipkart pickup slot details.",
        completed: false,
        xpReward: 35
      },
      {
        id: "fk-03",
        title: "GST Tax Invoice Insert inside Box",
        category: "Compliance",
        mandatory: true,
        spec: "Mandatory folded A4 retail invoice placed inside with state tax breakdown before final bag sealing.",
        completed: false,
        xpReward: 25
      },
      {
        id: "fk-04",
        title: "Quality Check Fold & Polybag Tagging",
        category: "Quality",
        mandatory: false,
        spec: "Ensure no loose threads, proper fold with butter-paper insert to prevent zari friction during transit.",
        completed: true,
        xpReward: 20
      }
    ]
  },
  myntra: {
    name: "Myntra Partner Portal",
    logoColor: "#FF3F6C",
    feeRate: "22.0% Fashion Curation + Free Returns Hub",
    checklist: [
      {
        id: "myn-01",
        title: "Brand Authorization / Self-Trademark Affidavit",
        category: "Brand",
        mandatory: true,
        spec: "Letter of Brand Authorization or Trademark Class 25 registration to list under brand 'Ganesh Ethnic'.",
        completed: false,
        xpReward: 50
      },
      {
        id: "myn-02",
        title: "Industrial Steam Press & Wrinkle-Free Packing",
        category: "Packaging",
        mandatory: true,
        spec: "Every garment must be industrially steamed. Polybagged with moisture-absorbing silica gel sachet.",
        completed: false,
        xpReward: 40
      },
      {
        id: "myn-03",
        title: "Standardized Garment Hangtag with Thread Seal",
        category: "Labeling",
        mandatory: true,
        spec: "Premium cardstock hangtag with MRP, Style Code, Fabric composition (100% Kanjeevaram Silk), and Care Instructions.",
        completed: false,
        xpReward: 35
      },
      {
        id: "myn-04",
        title: "Curated Model/Mannequin Photography Verification",
        category: "Creative",
        mandatory: true,
        spec: "Myntra strictly rejects flat-lay photos. Must be on-model or premium draped mannequin. (Use DukaanQuest Gemini Studio!).",
        completed: true,
        xpReward: 45
      }
    ]
  }
};

export const sampleProducts = [
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
    description: "Authentic hand-woven traditional Kanjeevaram silk saree featuring rich temple border and contrast pallu. Includes 0.8m unstitched blouse piece.",
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
          "FABRIC EXCELLENCE: Crafted from 100% Pure Mulberry Silk with authentic woven metallic Zari work.",
          "TRADITIONAL WEAVE: Features timeless South Indian temple motifs with dense contrast pallu design.",
          "OCCASION READY: Ideal for Indian weddings, Diwali celebrations, temple visits, and family festivities.",
          "PACKAGE INCLUDES: 1 Saree (5.5 Meters) + 1 Unstitched Matching Blouse Piece (0.8 Meters).",
          "CARE DIRECTIVE: Dry Clean Only to maintain the lustrous shine of the gold zari embroidery."
        ],
        keywords: "silk saree, kanjeevaram, wedding saree, pattu saree, south indian silk saree, maroon gold saree"
      },
      flipkart: {
        title: "SHREE GANESH Woven Kanjivaram Pure Silk, Art Silk Saree (Maroon)",
        keyFeatures: [
          "Type: Kanjivaram",
          "Fabric: Pure Silk Blend",
          "Blouse Piece: Included (Unstitched)",
          "Occasion: Wedding & Festive",
          "Pattern: Self Design, Temple Border"
        ]
      },
      myntra: {
        title: "SHREE GANESH Traditional Woven Design Kanjeevaram Silk Saree with Zari Accent",
        curationNotes: "Elevate your festive wardrobe with this heirloom-worthy Kanjeevaram saree. Style with antique temple gold jewellery and gajra for an authentic regal silhouette."
      }
    }
  },
  {
    id: "prod-002",
    title: "Handloom Chanderi Cotton Silk Kurta Set",
    sku: "SG-CHAN-EMB-02",
    category: "Kurta Set",
    basePrice: 2200,
    mrp: 3499,
    material: "Chanderi Cotton Silk with Gotta Patti",
    colors: ["Sage Green", "Silver Gotta"],
    stockCount: 22,
    description: "Lightweight festive Chanderi kurta with matching palazzo pants and sheer organza dupatta.",
    images: {
      raw: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
      amazonMain: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85",
      myntraLifestyle: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85",
      fabricDetail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
      dimensionGraphic: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85"
    }
  },
  {
    id: "prod-003",
    title: "Men's Classic Khadi Handspun Kurta",
    sku: "SG-KHAD-WHT-03",
    category: "Men Ethnic",
    basePrice: 1450,
    mrp: 2199,
    material: "100% Breathable Handloom Khadi Cotton",
    colors: ["Natural Ivory", "Coconut Shell Buttons"],
    stockCount: 30,
    description: "Comfortable regular-fit mandarin collar kurta made from hand-spun certified khadi fabric.",
    images: {
      raw: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80",
      amazonMain: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85",
      myntraLifestyle: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85",
      fabricDetail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
      dimensionGraphic: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85"
    }
  }
];

export const crmCustomers = [
  {
    id: "cust-101",
    name: "Ananya Deshpande",
    phone: "+91 98450 12345",
    tags: ["VIP", "Bridal"],
    totalSpend: 24500,
    lastPurchase: "12 days ago",
    language: "kn",
    preferredCategory: "Silk Sarees"
  },
  {
    id: "cust-102",
    name: "Sunita Sharma",
    phone: "+91 97112 67890",
    tags: ["VIP", "Festive"],
    totalSpend: 18200,
    lastPurchase: "18 days ago",
    language: "hi",
    preferredCategory: "Kurta Sets"
  },
  {
    id: "cust-103",
    name: "Meenakshi Sundaram",
    phone: "+91 94441 55521",
    tags: ["Inactive >30d"],
    totalSpend: 7800,
    lastPurchase: "48 days ago",
    language: "ta",
    preferredCategory: "Cotton Sarees"
  },
  {
    id: "cust-104",
    name: "Rajeshwar Rao",
    phone: "+91 98860 33412",
    tags: ["Regular"],
    totalSpend: 9400,
    lastPurchase: "25 days ago",
    language: "kn",
    preferredCategory: "Men Ethnic"
  },
  {
    id: "cust-105",
    name: "Pooja Hegde",
    phone: "+91 96200 88991",
    tags: ["Inactive >30d"],
    totalSpend: 5400,
    lastPurchase: "62 days ago",
    language: "en",
    preferredCategory: "Silk Sarees"
  }
];

export const activeQuests = [
  {
    id: "quest-01",
    category: "Physical Prep",
    title: "Master Amazon Apparel Packaging",
    desc: "Complete 4/5 physical packaging requirements for Amazon India seller fulfillment.",
    xp: 60,
    completed: false,
    building: "warehouse",
    badge: "Amazon Packmaster"
  },
  {
    id: "quest-02",
    category: "Photo Studio",
    title: "AI Studio Transformation",
    desc: "Enhance 3 raw product photos to pure white #FFFFFF e-commerce standards with Gemini.",
    xp: 50,
    completed: true,
    building: "studio",
    badge: "Pixel Artisan"
  },
  {
    id: "quest-03",
    category: "WhatsApp CRM",
    title: "Connect n8n Automation Engine",
    desc: "Broadcast localized festive catalog to 50 VIP walk-in customers with Paytm payment links.",
    xp: 75,
    completed: false,
    building: "tower",
    badge: "WhatsApp Vyapari"
  },
  {
    id: "quest-04",
    category: "Financial Sim",
    title: "Run 'What-If' Simulation",
    desc: "Model ₹10,000 Diwali inventory strategy before spending real marketing capital.",
    xp: 40,
    completed: true,
    building: "observatory",
    badge: "Strategic Sage"
  }
];

export const languageTranslations = {
  en: {
    navOverview: "Overview",
    navProductStudio: "Product studio",
    navGeminiStudio: "Gemini AI Studio",
    navListings: "Marketplace listings",
    navCampaigns: "Customer campaigns",
    navPlanner: "Growth planner",
    navChecklist: "Packaging checklist",
    navPayments: "Payments",
    subStudio: "Start with a photo. Make every detail your own.",
    subGemini: "Gemini reads your fabric and writes the listing copy.",
    subCatalog: "One product record, ready for every marketplace.",
    subCrm: "A personal offer, in each customer’s own language.",
    subSimulator: "Explore the possibilities, with the assumptions in plain sight.",
    subReadiness: "Prepare your packaging using the team’s reference checklist.",
    subPaytm: "Explore the existing payment adapter and its reported status.",
    stageAddProduct: "Add product",
    stageReviewDetails: "Review details",
    stagePrepareListing: "Prepare listing",
    stageCreateCampaign: "Create campaign",
    navDashboard: "Town & Copilot",
    navReadiness: "Physical Readiness",
    navStudio: "Gemini AI Studio",
    navCatalog: "Catalog Transformer",
    navCRM: "n8n WhatsApp CRM",
    navSimulator: "What-If Simulator",
    levelPrefix: "Level",
    xpLabel: "XP Progress",
    shopTagline: "Omnichannel Growth Copilot for Indian Retailers",
    sponsorPowered: "Powered by Gemini Pro • n8n • Sarvam AI • Paytm",
    physicalTitle: "Official Marketplace Physical Readiness Engine",
    physicalSubtitle: "Scraped compliance guidelines from Amazon, Flipkart & Myntra seller portals.",
    studioTitle: "Google Gemini Multimodal AI Photo Studio",
    studioSubtitle: "Turn cluttered phone photos into 4K white-background catalog assets.",
    crmTitle: "n8n Autonomous WhatsApp CRM Hub",
    crmSubtitle: "Re-engage walk-in customers in regional tongues with instant Paytm UPI links.",
    simTitle: "Deterministic What-If Business Simulator",
    simSubtitle: "Compare Marketplace vs WhatsApp vs Meta Ads before risking capital.",
    approveBtn: "Approve & Dispatch",
    simulateBtn: "Recalculate Projections",
    copyListing: "Copy Platform Payload",
    exportFlatfile: "Download Flat-File (CSV)"
  },
  hi: {
    navOverview: "अवलोकन",
    navProductStudio: "उत्पाद स्टूडियो",
    navGeminiStudio: "जेमिनी एआई स्टूडियो",
    navListings: "मार्केटप्लेस लिस्टिंग",
    navCampaigns: "ग्राहक अभियान",
    navPlanner: "विकास योजना",
    navChecklist: "पैकिंग चेकलिस्ट",
    navPayments: "भुगतान",
    subStudio: "एक फ़ोटो से शुरुआत करें। हर विवरण अपना बनाएँ।",
    subGemini: "जेमिनी आपके कपड़े को पढ़ता है और लिस्टिंग कॉपी लिखता है।",
    subCatalog: "एक उत्पाद रिकॉर्ड, हर मार्केटप्लेस के लिए तैयार।",
    subCrm: "हर ग्राहक की अपनी भाषा में एक निजी ऑफ़र।",
    subSimulator: "मान्यताओं के साथ संभावनाओं को देखें।",
    subReadiness: "टीम की संदर्भ सूची से अपनी पैकिंग तैयार करें।",
    subPaytm: "मौजूदा भुगतान अडैप्टर और उसकी स्थिति देखें।",
    stageAddProduct: "उत्पाद जोड़ें",
    stageReviewDetails: "विवरण जाँचें",
    stagePrepareListing: "लिस्टिंग तैयार करें",
    stageCreateCampaign: "अभियान बनाएँ",
    navDashboard: "दुकान व नगर",
    navReadiness: "शारीरिक तैयारी (पैकिंग)",
    navStudio: "जेमिनी एआई फोटो स्टूडियो",
    navCatalog: "कैटलॉग ट्रांसफार्मर",
    navCRM: "व्हाट्सएप सीआरएम (n8n)",
    navSimulator: "कारोबार सिम्युलेटर",
    levelPrefix: "स्तर",
    xpLabel: "एक्सपी प्रगति",
    shopTagline: "भारतीय खुदरा व्यापारियों का डिजिटल विकास साथी",
    sponsorPowered: "जेमिनी • n8n • सर्वम एआई • पेटीएम द्वारा संचालित",
    physicalTitle: "बाज़ार शारीरिक तैयारी चेकर",
    physicalSubtitle: "अमेज़ॅन, फ्लिपकार्ट और मिंत्रा के नियमों अनुसार पैकिंग व बारकोड तैयारी।",
    studioTitle: "गूगल जेमिनी एआई फोटो स्टूडियो",
    studioSubtitle: "दुकान के साधारण फोन फोटो को बनाएं 4K सफेद बैकग्राउंड कैटलॉग।",
    crmTitle: "n8n व्हाट्सएप ग्राहक जुड़ाव केंद्र",
    crmSubtitle: "ग्राहकों को मातृभाषा में संदेश भेजें और पेटीएम यूपीआई लिंक से तुरंत भुगतान पाएं।",
    simTitle: "व्यापारिक निर्णय सिम्युलेटर (व्हाट-इफ)",
    simSubtitle: "पैसे लगाने से पहले जांचें: बाज़ार लिस्टिंग बनाम व्हाट्सएप बनाम विज्ञापन।",
    approveBtn: "स्वीकृति दें और भेजें",
    simulateBtn: "गणना करें",
    copyListing: "लिस्टिंग कॉपी करें",
    exportFlatfile: "सीएसवी फाइल डाउनलोड करें"
  },
  kn: {
    navOverview: "ಅವಲೋಕನ",
    navProductStudio: "ಉತ್ಪನ್ನ ಸ್ಟುಡಿಯೋ",
    navGeminiStudio: "ಜೆಮಿನಿ ಎಐ ಸ್ಟುಡಿಯೋ",
    navListings: "ಮಾರುಕಟ್ಟೆ ಪಟ್ಟಿ",
    navCampaigns: "ಗ್ರಾಹಕ ಅಭಿಯಾನ",
    navPlanner: "ಬೆಳವಣಿಗೆ ಯೋಜನೆ",
    navChecklist: "ಪ್ಯಾಕಿಂಗ್ ಪಟ್ಟಿ",
    navPayments: "ಪಾವತಿಗಳು",
    subStudio: "ಒಂದು ಫೋಟೋದಿಂದ ಆರಂಭಿಸಿ. ಪ್ರತಿ ವಿವರವನ್ನೂ ನಿಮ್ಮದ್ದಿಗೆ ಮಾಡಿ.",
    subGemini: "ಜೆಮಿನಿ ನಿಮ್ಮ ಬಣ್ಣವನ್ನು ಓದಿ ಪಟ್ಟಿ ಪಠ್ಯ ಬರೆಯುತ್ತದೆ.",
    subCatalog: "ಒಂದೇ ಉತ್ಪನ್ನ ದಾಖಲೆ, ಎಲ್ಲಾ ಮಾರುಕಟ್ಟೆಗಳಿಗೆ.",
    subCrm: "ಪ್ರತಿ ಗ್ರಾಹಕರ ತಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ವೈಯಸ್ತಿಕ ಆಫರ್.",
    subSimulator: "ಊಹೆಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಪರಿಶೀಲಿಸಿ.",
    subReadiness: "ತಂಡದ ಮಾರ್ಗದರ್ಶಿ ಪಟ್ಟಿ ಬಳಸಿ ಪ್ಯಾಕಿಂಗ್ ಸಿದ್ಧಪಡಿಸಿ.",
    subPaytm: "ಇರುವ ಪಾವತಿ ವ್ಯವಸ್ಥೆ ಮತ್ತು ಅದರ ಸ್ಥಿತಿ ನೋಡಿ.",
    stageAddProduct: "ಉತ್ಪನ್ನ ಸೇರಿಸಿ",
    stageReviewDetails: "ವಿವರ ಪರಿಶೀಲಿಸಿ",
    stagePrepareListing: "ಪಟ್ಟಿ ಸಿದ್ಧಪಡಿಸಿ",
    stageCreateCampaign: "ಅಭಿಯಾನ ರಚಿಸಿ",
    navDashboard: "ಡಿಜಿಟಲ್ ಅಂಗಡಿ",
    navReadiness: "ಪ್ಯಾಕಿಂಗ್ ಸಿದ್ಧತೆ",
    navStudio: "ಜೆಮಿನಿ ಫೋಟೋ ಸ್ಟುಡಿಯೋ",
    navCatalog: "ಕ್ಯಾಟಲಾಗ್ ಬದಲಾವಣೆ",
    navCRM: "ವಾಟ್ಸಾಪ್ ಸಿಆರ್‌ಎಂ (n8n)",
    navSimulator: "ವ್ಯಾಪಾರ ಸಿಮ್ಯುಲೇಟರ್",
    levelPrefix: "ಹಂತ",
    xpLabel: "ಎಕ್ಸ್‌ಪಿ ಪ್ರಗತಿ",
    shopTagline: "ಭಾರತೀಯ ವ್ಯಾಪಾರಿಗಳ ಡಿಜಿಟಲ್ ಬೆಳವಣಿಗೆಯ ಸಂಗಾತಿ",
    sponsorPowered: "ಜೆಮಿನಿ • n8n • ಸರ್ವಂ ಎಐ • ಪೇಟಿಎಂ ಸಹಯೋಗ",
    physicalTitle: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ಪ್ಯಾಕಿಂಗ್ ಸಿದ್ಧತೆ",
    physicalSubtitle: "ಅಮೆಜಾನ್, ಫ್ಲಿಪ್‌ಕಾರ್ಟ್ ಮತ್ತು ಮಿಂತ್ರಾ ಮಾರಾಟಗಾರರ ನಿಯಮಗಳು.",
    studioTitle: "ಗೂಗಲ್ ಜೆಮಿನಿ ಎಐ ಫೋಟೋ ಸ್ಟುಡಿಯೋ",
    studioSubtitle: "ಮೊಬೈಲ್ ಫೋಟೋಗಳನ್ನು 4K ಪ್ರೊಫೆಷನಲ್ ಆನ್‌ಲೈನ್ ಫೋಟೋಗಳನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿ.",
    crmTitle: "n8n ವಾಟ್ಸಾಪ್ ಗ್ರಾಹಕ ನೆಟ್‌ವರ್ಕ್",
    crmSubtitle: "ಗ್ರಾಹಕರಿಗೆ ಕನ್ನಡದಲ್ಲೇ ಸಂದೇಶ ಕಳುಹಿಸಿ, ಪೇಟಿಎಂ ಮೂಲಕ ಹಣ ಪಡೆಯಿರಿ.",
    simTitle: "ವ್ಯಾಪಾರ ತಂತ್ರ ಸಿಮ್ಯುಲೇಟರ್",
    simSubtitle: "ಹಣ ಹೂಡುವ ಮುನ್ನ ಲಾಭದ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ.",
    approveBtn: "ಅನುಮೋದಿಸಿ ಕಳುಹಿಸಿ",
    simulateBtn: "ಮರು ಲೆಕ್ಕಾಚಾರ",
    copyListing: "ಕಾಪಿ ಮಾಡಿ",
    exportFlatfile: "ಸಿಎಸ್‌ವಿ ಡೌನ್‌ಲೋಡ್"
  },
  ta: {
    navOverview: "மேலோட்டம்",
    navProductStudio: "தயாரிப்பு ஸ்டுடியோ",
    navGeminiStudio: "ஜெமினி AI ஸ்டுடியோ",
    navListings: "மார்க்கெட் பட்டியல்",
    navCampaigns: "வாடிக்கையாளர் பிரச்சாரம்",
    navPlanner: "வளர்ச்சி திட்டம்",
    navChecklist: "பேக்கிங் பட்டியல்",
    navPayments: "கட்டணம்",
    subStudio: "ஒரு படத்தால் தொடங்குங்கள். ஒவ்வொரு விவரத்தையும் உங்களுடையதாக்குங்கள்.",
    subGemini: "ஜெமினி உங்கள் துணியைப் படித்து பட்டியல் உரையை எழுதுகிறது.",
    subCatalog: "ஒரே தயாரிப்பு பதிவு, அனைத்து சந்தைகளுக்கும்.",
    subCrm: "ஒவ்வொரு வாடிக்கையாளரின் மொழியிலும் ஒரு தனிப்பட்ட சலுகை.",
    subSimulator: "ஊகங்களுடன் சாத்தியங்களை ஆராயுங்கள்.",
    subReadiness: "குழு பட்டியலைப் பயன்படுத்தி பேக்கிங்கைத் தயாரியுங்கள்.",
    subPaytm: "இருக்கும் கட்டணத் தகவலாக்கி மற்றும் அதன் நிலையைப் பாருங்கள்.",
    stageAddProduct: "தயாரிப்பு சேர்",
    stageReviewDetails: "விவரங்களை ஆய்",
    stagePrepareListing: "பட்டியலைத் தயார்",
    stageCreateCampaign: "பிரச்சாரம் உருவாக்கு",
    navDashboard: "டிஜிட்டல் கடை",
    navReadiness: "பேக்கிங் தயார்நிலை",
    navStudio: "ஜெமினி ஸ்டுடியோ",
    navCatalog: "பட்டியல் மாற்றி",
    navCRM: "வாட்ஸ்அப் சிஆர்எம்",
    navSimulator: "வணிக சிமுலேட்டர்",
    levelPrefix: "நிலை",
    xpLabel: "எக்ஸ்பி முன்னேற்றம்",
    shopTagline: "இந்திய சில்லறை வணிகர்களுக்கான டிஜிட்டல் தோழன்",
    sponsorPowered: "ஜெமினி • n8n • சர்வம் ஏஐ • பேடிஎம் ஆதரவுடன்",
    physicalTitle: "சந்தை உடல் தயார்நிலை சோதனையாளர்",
    physicalSubtitle: "அமேசான், பிளிப்கார்ட் மற்றும் மிந்த்ரா விதிகள்.",
    studioTitle: "கூகிள் ஜெமினி ஏஐ போட்டோ ஸ்டுடியோ",
    studioSubtitle: "எளிய போன் புகைப்படங்களை உயர்தர வெள்ளை பின்னணியாக மாற்றவும்.",
    crmTitle: "n8n வாட்ஸ்அப் வாடிக்கையாளர் மையம்",
    crmSubtitle: "வாடிக்கையாளர்களுக்கு தாய்மொழியில் செய்தி அனுப்பி பேடிஎம் மூலம் பணம் பெறவும்.",
    simTitle: "வணிக முடிவெடுக்கும் சிமுலேட்டர்",
    simSubtitle: "பணம் முதலீடு செய்வதற்கு முன் லாபத்தை கணக்கிடுங்கள்.",
    approveBtn: "அனுமதித்து அனுப்பவும்",
    simulateBtn: "மீண்டும் கணக்கிடு",
    copyListing: "நகலெடுக்கவும்",
    exportFlatfile: "சிஎஸ்வி பதிவிறக்கம்"
  }
};
