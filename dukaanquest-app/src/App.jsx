import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  Sparkles, 
  Globe, 
  MessageSquare, 
  Calculator, 
  CreditCard, 
  Languages,
  Check,
  TrendingUp,
  CircleDashed
} from 'lucide-react';
import confetti from 'canvas-confetti';

import DigitalDukaanCanvas from './components/game/DigitalDukaanCanvas';
import QuestLog from './components/game/QuestLog';
import PhysicalReadinessChecker from './components/readiness/PhysicalReadinessChecker';
import GeminiPhotoStudio from './components/studio/GeminiPhotoStudio';
import OmnichannelCatalog from './components/catalog/OmnichannelCatalog';
import WhatsAppCRMHub from './components/crm/WhatsAppCRMHub';
import WhatIfSimulator from './components/simulator/WhatIfSimulator';
import PaytmPaymentHub from './components/paytm/PaytmPaymentHub';

import * as api from './services/api';

import { 
  shopProfile as fallbackProfile, 
  platformReadinessRules as fallbackRules, 
  sampleProducts as fallbackProducts, 
  crmCustomers as fallbackCustomers, 
  activeQuests as fallbackQuests, 
  languageTranslations 
} from './data/mockData';

const CONFETTI_COLORS = ['#E8A33D', '#F2C179', '#7BB88F', '#F7F2EA'];

const JOURNEY = [
  {
    id: 'studio', label: 'Photograph', building: 'studio',
    detail: 'Gemini reads your fabric and writes the listing',
    gain: 'Listing copy and four marketplace photos ready'
  },
  {
    id: 'catalog', label: 'List once', building: 'shop',
    detail: 'One product record, every marketplace',
    gain: 'Live on Amazon, Flipkart, Meesho, Myntra and Nykaa'
  },
  {
    id: 'crm', label: 'Reach customers', building: 'tower',
    detail: 'WhatsApp offers in each customer language',
    gain: 'Existing customers buying again on WhatsApp'
  },
  {
    id: 'simulator', label: 'Simulate', building: 'observatory',
    detail: 'See the profit before you spend the money',
    gain: 'A tested plan with the risk already priced in'
  },
  {
    id: 'town', label: 'Grow', building: null,
    detail: 'Earn XP and upgrade your shop',
    gain: 'Level 3, Digital Vyapari'
  }
];

/* Order here is the order the merchant meets the stack, not an importance
   ranking. The state text is always read from /api/health so the panel can
   never drift from the truth. */
const INTEGRATION_ORDER = ['gemini', 'sarvam', 'n8n', 'whatsapp', 'amazon', 'flipkart', 'meesho', 'myntra', 'nykaa', 'photoStudio', 'paytm'];

const INTEGRATION_LABELS = {
  gemini: 'Gemini', sarvam: 'Sarvam', n8n: 'n8n', whatsapp: 'WhatsApp',
  amazon: 'Amazon', flipkart: 'Flipkart', meesho: 'Meesho', myntra: 'Myntra',
  nykaa: 'Nykaa', photoStudio: 'Photo studio', paytm: 'Paytm'
};

/* The API returns quests without a building reference, so the link between a
   quest and the building it belongs to lives here, on the frontend. */
const QUEST_BUILDING = {
  'quest-01': 'warehouse',
  'quest-02': 'studio',
  'quest-03': 'tower',
  'quest-04': 'observatory'
};

/* Shown only until the first health response lands, so the panel is never
   empty. These mirror the classifications the backend actually returns. */
const FALLBACK_INTEGRATIONS = [
  { name: 'Gemini', state: 'LIVE' },
  { name: 'Sarvam', state: 'LIVE' },
  { name: 'n8n', state: 'LIVE' },
  { name: 'WhatsApp', state: 'STAGED' },
  { name: 'Amazon', state: 'SANDBOX' },
  { name: 'Paytm', state: 'FALLBACK' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('town');
  const [currentLang, setCurrentLang] = useState('en');
  const [profile, setProfile] = useState(fallbackProfile);
  const [xp, setXp] = useState(fallbackProfile.currentXp);
  const [level, setLevel] = useState(fallbackProfile.level);
  const [rules, setRules] = useState(fallbackRules);
  const [quests, setQuests] = useState(fallbackQuests);
  const [customers, setCustomers] = useState(fallbackCustomers);
  const [products, setProducts] = useState(fallbackProducts);
  const [backendOnline, setBackendOnline] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [health, setHealth] = useState(null);

  const t = languageTranslations[currentLang] || languageTranslations.en;

  useEffect(() => {
    async function initData() {
      try {
        const health = await api.fetchHealth();
        // /api/health reports `overall` ("ok" | "partial"), not `status`.
        // A partial verdict still means the API answered, so the app syncs
        // from it and shows the real per-service classification.
        if (health && (health.overall === 'ok' || health.overall === 'partial')) {
          setBackendOnline(true);
          setHealth(health);
          const [dbShop, dbRules, dbQuests, dbCustomers, dbProducts] = await Promise.all([
            api.fetchShopProfile(),
            api.fetchReadinessRules(),
            api.fetchQuests(),
            api.fetchCustomers(),
            api.fetchProducts()
          ]);
          if (dbShop) {
            setProfile(dbShop);
            setXp(dbShop.currentXp);
            setLevel(dbShop.level);
          }
          if (dbRules) setRules(dbRules);
          if (dbQuests) setQuests(dbQuests);
          if (dbCustomers) setCustomers(dbCustomers);
          if (dbProducts) setProducts(dbProducts);
        }
      } catch (err) {
        console.warn('Backend API offline, continuing with local persistent state:', err);
      }
    }
    initData();
  }, []);

  const amzItems = rules.amazon?.checklist || [];
  const amzCompleted = amzItems.filter(i => i.completed).length;
  const amzProgress = amzItems.length > 0 ? Math.round((amzCompleted / amzItems.length) * 100) : 0;

  const completedQuests = quests.filter(q => q.completed).length;

  const addXp = (amount) => {
    const newXp = xp + amount;
    if (newXp >= 600 && level < 3) {
      setLevel(3);
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: CONFETTI_COLORS
      });
    }
    setXp(newXp);
    api.updateShopXp(amount).catch(() => {});
  };

  const handleToggleTask = (platform, taskId, completed, xpReward) => {
    setRules(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        checklist: prev[platform].checklist.map(item =>
          item.id === taskId ? { ...item, completed } : item
        )
      }
    }));
    api.toggleReadinessTask(platform, taskId, completed).catch(() => {});
    if (completed) addXp(xpReward);
  };

  const handleCompleteQuest = (questId, xpReward) => {
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, completed: true } : q));
    api.completeQuest(questId).catch(() => {});
    addXp(xpReward);
  };

  const NAV = [
    { id: 'town', label: t.navDashboard, icon: Store },
    { id: 'readiness', label: t.navReadiness, icon: Package },
    { id: 'studio', label: t.navStudio, icon: Sparkles },
    { id: 'catalog', label: t.navCatalog, icon: Globe },
    { id: 'crm', label: t.navCRM, icon: MessageSquare },
    { id: 'simulator', label: t.navSimulator, icon: Calculator },
    { id: 'paytm', label: 'Paytm FinTech', icon: CreditCard }
  ];

  // Readiness and Paytm are support screens, not journey steps, so no step is
  // highlighted as "current" while the merchant is in them.
  const journeyIndex = JOURNEY.findIndex(s => s.id === activeTab);
  const currentNav = NAV.find(n => n.id === activeTab);

  // A step is only "done" when its quest is genuinely completed. Visiting a
  // screen is not progress, so the stepper never overstates the merchant.
  const stepDone = (step) => {
    if (!step.building) return level === 3;
    // The catalog step has no quest of its own, so it tracks the real
    // Amazon readiness signal instead of a page visit.
    if (step.building === 'shop') return amzProgress === 100;
    return quests.some(q => q.completed && QUEST_BUILDING[q.id] === step.building);
  };
  const doneCount = JOURNEY.filter(stepDone).length;
  const nextStep = JOURNEY.find(s => !stepDone(s)) || null;
  const nextQuest = quests.find(q => !q.completed) || null;

  // Real classifications from the backend, in merchant-facing order.
  const integrations = health?.services
    ? INTEGRATION_ORDER
        .filter(key => health.services[key])
        .map(key => ({
          name: INTEGRATION_LABELS[key] || key,
          state: health.services[key].classification || 'UNKNOWN'
        }))
    : FALLBACK_INTEGRATIONS;

  const healthCounts = health?.integrationSummary || null;

  const go = (id) => {
    setActiveTab(id);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      {/* ---------------- Sidebar ---------------- */}
      <aside className={`sidebar${navOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark" aria-hidden="true">DQ</div>
          <div className="brand-text">
            <span className="brand-name">DukaanQuest</span>
            <span className="brand-sub">{profile.location}</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`nav-item${active ? ' nav-item-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <div className="level-block">
            <div className="level-row">
              <span className="level-name">
                {level === 3 ? 'Digital Vyapari' : 'Mohalla Merchant'}
              </span>
              <span className="level-xp mono">{xp}/600</span>
            </div>
            <div
              className="track level-track"
              role="progressbar"
              aria-valuenow={Math.min(xp, 600)}
              aria-valuemin={0}
              aria-valuemax={600}
              aria-label="Experience toward the next level"
            >
              <div className="track-fill" style={{ transform: `scaleX(${Math.min(1, xp / 600)})` }} />
            </div>
            <p className="meta level-sub">
              {level === 3
                ? 'Top level reached'
                : `${600 - xp} XP to Digital Vyapari`}
            </p>
            {nextQuest && (
              <div className="level-next">
                <span className="level-next-label">Next milestone</span>
                <span className="level-next-title">{nextQuest.title}</span>
                <span className="level-next-xp mono">+{nextQuest.xp} XP</span>
              </div>
            )}
          </div>

          <div className="lang-field">
            <Languages size={15} />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              aria-label="Interface language"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>

          <details className="integrations">
            <summary>
              <span className={`conn-dot${backendOnline ? ' conn-live' : ''}`} />
              {backendOnline ? 'Systems connected' : 'Local data'}
            </summary>
            {healthCounts && (
              <p className="meta integration-counts">
                {healthCounts.LIVE} live, {healthCounts.SANDBOX} sandbox,{' '}
                {healthCounts.STAGED} staged, {healthCounts.FALLBACK} fallback
              </p>
            )}
            <ul>
              {integrations.map(i => (
                <li key={i.name}>
                  <span>{i.name}</span>
                  <span className={`mono meta conn-state conn-state-${i.state.toLowerCase()}`}>
                    {i.state}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </aside>

      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} />}

      {/* ---------------- Main ---------------- */}
      <div className="app-main">
        <header className="page-head">
          <button className="nav-toggle" onClick={() => setNavOpen(true)} aria-label="Open navigation">
            <span /><span /><span />
          </button>
          <div className="page-head-text">
            <h1>{currentNav?.label}</h1>
            <p className="meta">{profile.shopName}</p>
          </div>
        </header>

        <main className="page-body">
          {/* ---- Golden Journey: a path with real progress, not a row of pills ---- */}
          <section className="journey" aria-label="Golden journey">
            <div className="journey-head">
              <div className="journey-head-text">
                <h2 className="journey-title">From photo to profit</h2>
                <p className="meta">
                  {doneCount === JOURNEY.length
                    ? 'Every engine is running. Keep the town growing.'
                    : `${nextStep
                      ? `Next up: ${nextStep.label.toLowerCase()}`
                      : 'All five engines are running'}`}
                </p>
              </div>
              <div className="journey-score">
                <span className="journey-score-value">{doneCount}<span className="journey-score-of">/{JOURNEY.length}</span></span>
                <span className="journey-score-label">steps done</span>
              </div>
            </div>

            <div className="journey-rail" aria-hidden="true">
              <div
                className="journey-rail-fill"
                style={{ transform: `scaleX(${doneCount / JOURNEY.length})` }}
              />
            </div>

            <ol className="journey-track">
              {JOURNEY.map((step, i) => {
                const done = stepDone(step);
                const current = i === journeyIndex;
                return (
                  <li key={step.id} className="journey-step">
                    <button
                      onClick={() => go(step.id)}
                      className={`journey-node${current ? ' is-current' : ''}${done ? ' is-done' : ''}`}
                      aria-current={current ? 'step' : undefined}
                    >
                      <span className="journey-mark">
                        {done ? <Check size={13} strokeWidth={2.5} /> : <span className="mono">{i + 1}</span>}
                      </span>
                      <span className="journey-text">
                        <span className="journey-label">{step.label}</span>
                        <span className="journey-detail">{done ? step.gain : step.detail}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ---- Tab 1: Town ---- */}
          {activeTab === 'town' && (
            <div className="stack">
              <div className="metric-block">
                <div className="surface metric-primary">
                  <div className="metric-primary-text">
                    <span className="eyebrow">Monthly revenue at the shop counter</span>
                    <span className="metric-lg">₹{profile.monthlyOfflineRevenue.toLocaleString()}</span>
                    <span className="metric-note">
                      <TrendingUp size={13} /> Walk-in sales in {profile.location.split(',')[0]}
                    </span>
                  </div>
                  <div className="metric-primary-side">
                    <p className="eyebrow">What is working</p>
                    <p className="metric-primary-hint">
                      Three engines are live and earning. Finish the Amazon
                      packaging checklist to unlock the marketplace listing.
                    </p>
                    <button className="btn btn-sm btn-secondary" onClick={() => go('readiness')}>
                      Open checklist
                    </button>
                  </div>
                </div>

                <div className="metric-stack">
                  <div className="surface metric-small">
                    <span className="eyebrow">Ready to sell on Amazon</span>
                    <span className="metric-sm">{amzCompleted} of {amzItems.length}</span>
                    <div
                      className="track metric-track"
                      role="progressbar"
                      aria-valuenow={amzProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Amazon packaging checklist progress"
                    >
                      <div className="track-fill" style={{ transform: `scaleX(${amzProgress / 100})` }} />
                    </div>
                    <span className="meta">of what Amazon asks for, done</span>
                  </div>
                  <div className="surface metric-small">
                    <span className="eyebrow">Customers you can message</span>
                    <span className="metric-sm">{customers.length}</span>
                    <span className="meta">opted in, reachable on WhatsApp in their own language</span>
                  </div>
                  <div className="surface metric-small">
                    <span className="eyebrow">Photos ready to list</span>
                    <span className="metric-sm">12</span>
                    <span className="meta">one product, shot for Amazon, Myntra and Flipkart</span>
                  </div>
                </div>
              </div>

              <DigitalDukaanCanvas 
                level={level}
                xp={xp}
                readinessProgress={amzProgress}
                studioUnlocked={true}
                crmConnected={true}
                onSelectBuilding={(engine) => go(engine)}
              />

              <QuestLog 
                quests={quests}
                level={level}
                xp={xp}
                streak={profile.streakDays}
                onCompleteQuest={handleCompleteQuest}
              />
            </div>
          )}

          {activeTab === 'readiness' && (
            <PhysicalReadinessChecker readinessRules={rules} onToggleTask={handleToggleTask} t={t} />
          )}

          {activeTab === 'studio' && (
            <GeminiPhotoStudio 
              sampleProducts={products}
              t={t}
              onNavigateToCatalog={() => go('catalog')}
            />
          )}

          {activeTab === 'catalog' && (
            <OmnichannelCatalog 
              sampleProducts={products}
              t={t}
              onNavigateToCrm={() => go('crm')}
            />
          )}

          {activeTab === 'crm' && (
            <WhatsAppCRMHub 
              customers={customers}
              onDispatchCampaign={(count) => addXp(40)}
              currentLanguage={currentLang}
              t={t}
              onNavigateToSimulator={() => go('simulator')}
            />
          )}

          {activeTab === 'simulator' && (
            <WhatIfSimulator 
              onApplyStrategy={(strat) => addXp(50)}
              t={t}
              onCompleteJourney={() => {
                addXp(100);
                setQuests(prev => prev.map(q => ({ ...q, completed: true })));
                setLevel(3);
                setActiveTab('town');
                confetti({
                  particleCount: 150,
                  spread: 120,
                  origin: { y: 0.5 },
                  colors: CONFETTI_COLORS
                });
              }}
            />
          )}

          {activeTab === 'paytm' && (
            <PaytmPaymentHub shopProfile={profile} t={t} />
          )}
        </main>
      </div>
    </div>
  );
}