import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

/**
 * Runtime UI localization via the Sarvam API.
 *
 * Design goals:
 *  1. Never blank the UI. t(text) returns the English string immediately and
 *     upgrades in place once Sarvam answers. No spinner, no layout jump.
 *  2. Pay once. Translations are cached in memory + localStorage per language,
 *     so re-visiting a screen or switching back is instant.
 *  3. Degrade safely. If the backend is down, everything simply stays English.
 *
 * Strings are collected automatically as components call t(), then flushed to
 * /api/sarvam/translate-batch in one request per language.
 */

const TranslationContext = createContext({ tx: (s) => s, lang: 'en', setLang: () => {}, pending: false });

const CACHE_KEY = 'apnidukaan.translations.v1';

// Curated overrides for high-visibility phrases where a literal machine
// translation reads poorly in a merchant-facing context.
const OVERRIDES = {
  hi: {
    'List this on marketplaces': 'इसे मार्केटप्लेस पर सूचीबद्ध करें',
    'Who receives it': 'इसे किसे मिलेगा',
    'Discount offered': 'छूट दी जा रही है',
    'What you get': 'आपको क्या मिलेगा',
    'Download all': 'सभी डाउनलोड करें'
  },
  kn: {
    'List this on marketplaces': 'ಇದನ್ನು ಮಾರುಕಟ್ಟೆಗಳಲ್ಲಿ ಪಟ್ಟಿ ಮಾಡಿ',
    'Who receives it': 'ಇದು ಯಾರಿಗೆ ಸಿಗುತ್ತದೆ',
    'Discount offered': 'ನೀಡುವ ರಿಯಾಯಿತಿ',
    'What you get': 'ನಿಮಗೆ ಏನು ಸಿಗುತ್ತದೆ',
    'Download all': 'ಎಲ್ಲಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ'
  },
  ta: {
    'List this on marketplaces': 'இதை சந்தைகளில் பட்டியலிடவும்',
    'Who receives it': 'இது யாருக்கு செல்கிறது',
    'Discount offered': 'வழங்கப்படும் தள்ளுபடி',
    'What you get': 'உங்களுக்கு என்ன கிடைக்கும்',
    'Download all': 'அனைத்தையும் பதிவிறக்கவும்'
  }
};

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function TranslationProvider({ children }) {
  // The provider owns the selected language so every screen can reach both the
  // translator and the switch without prop-drilling through App.
  const [lang, setLang] = useState('en');
  const [maps, setMaps] = useState(() => loadCache());
  const [pending, setPending] = useState(false);

  // Every distinct English string seen so far, for this language.
  const collected = useRef(new Set());
  const inFlight = useRef(false);

  // Persist whatever we learn so a reload doesn't re-hit Sarvam.
  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(maps));
    } catch { /* storage full/unavailable - cache is optional */ }
  }, [maps]);

  const flush = useCallback(async (strings, language) => {
    if (inFlight.current || !strings.length || language === 'en') return;
    inFlight.current = true;
    setPending(true);
    try {
      const res = await fetch('/api/sarvam/translate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: [...strings], targetLanguage: language })
      });
      if (!res.ok) return;
      const data = await res.json();
      const incoming = { ...(data.translations || {}) };
      // Curated phrases win over the machine output.
      Object.entries(OVERRIDES[language] || {}).forEach(([k, v]) => {
        if (k in incoming) incoming[k] = v;
      });
      setMaps(prev => ({ ...prev, [language]: { ...(prev[language] || {}), ...incoming } }));
    } catch {
      // Network/backend failure: leave English in place.
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }, []);

  // Flush newly-seen strings shortly after render settles.
  useEffect(() => {
    if (lang === 'en') return;
    const id = setTimeout(() => {
      const missing = [...collected.current].filter(
        s => !(maps[lang] && maps[lang][s]) && !(OVERRIDES[lang] || {})[s]
      );
      if (missing.length) flush(missing, lang);
    }, 250);
    return () => clearTimeout(id);
  }, [lang, maps, flush]);

  // `tx` translates a literal English string at runtime via Sarvam.
  // Named tx (not t) so it never collides with the curated nav/subtitle
  // lookup object in data/mockData.js that components already receive as `t`.
  // Brand + proper nouns that must never be machine-translated.
  const DO_NOT_TRANSLATE = /^(apni|dukaan|apnidukaan|hackSprint|Gemini|Amazon|Flipkart|Meesho|Myntra|Nykaa|Paytm|Meta|WhatsApp|Sarvam|Shree Ganesh)/i;

  const tx = useCallback((text) => {
    if (typeof text !== 'string' || !text) return text;
    if (lang === 'en') return text;
    if (DO_NOT_TRANSLATE.test(text.trim())) return text;

    // Record the source string so it gets batch-translated.
    collected.current.add(text);

    const curated = OVERRIDES[lang]?.[text];
    if (curated) return curated;

    const hit = maps[lang]?.[text];
    // English until the translation lands - never a blank label.
    return hit || text;
  }, [lang, maps]);

  return (
    <TranslationContext.Provider value={{ tx, lang, setLang, pending }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}