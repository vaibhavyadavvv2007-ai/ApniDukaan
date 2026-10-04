import React, { useState, useEffect } from 'react';
import {
  Store,
  Package,
  Sparkles,
  MessageSquare,
  Check,
  TrendingUp,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Menu,
  ChevronRight
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
import { ProductStudio } from './components/ProductWorkspace';
import WorkspaceSidebar from './components/layout/WorkspaceSidebar';
import JourneyRail from './components/layout/JourneyRail';

import * as api from './services/api';

import {
  shopProfile as fallbackProfile,
  platformReadinessRules as fallbackRules,
  sampleProducts as fallbackProducts,
  crmCustomers as fallbackCustomers,
  activeQuests as fallbackQuests,
  languageTranslations
} from './data/mockData';

import {
  NAV,
  screenSubtitle,
  navLabel,
  JOURNEY,
  DRAFT_STAGES,
  INTEGRATION_ORDER,
  INTEGRATION_LABELS,
  FALLBACK_INTEGRATIONS,
  isStepDone
} from './data/workspace';

import { DRAFT_KEY, newDraft, checks, patchDraft, money } from './services/draft';
import { TranslationProvider, useTranslation } from './i18n/TranslationProvider';

const CONFETTI_COLORS = ['#E8A33D', '#F2C179', '#7BB88F', '#F7F2EA'];

function Workspace() {
  const { tx, lang: currentLang, setLang: setCurrentLang } = useTranslation();
  const [activeTab, setActiveTab] = useState('town');
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
  const [notice, setNotice] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [draft, setDraft] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(DRAFT_KEY));
      if (stored && ['title', 'brand', 'material', 'size', 'description', 'original'].every(k => typeof stored[k] === 'string')) {
        return { ...newDraft(), ...stored };
      }
    } catch {
      // Start with an empty draft if storage is unavailable.
    }
    return newDraft();
  });

  const t = languageTranslations[currentLang] || languageTranslations.en;

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      // Storage failures must be reflected in the UI after this external write.
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [draft]);

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
            // Progression (xp/level) is locally owned - see addXp below. The
            // health check can resolve seconds after first paint, and the
            // server copy has drifted (it can hold XP past the level cap),
            // so syncing it here silently rewrote the sidebar mid-session.
            // Shop details still sync; only the counters stay local.
            setProfile(dbShop);
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

  const addXp = (amount) => {
    const newXp = xp + amount;
    if (newXp >= 600 && level < 3) {
      setLevel(3);
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
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

  const go = (id) => {
    setActiveTab(id);
    setNavOpen(false);
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const begin = () => {
    if (!draft.original && !draft.title) setDraft(newDraft());
    go('studio');
  };

  const draftReady = checks(draft).every(c => c.valid);
  const draftSteps = [!!draft.original, draft.reviewed && draftReady, draft.exported, draft.campaignPrepared];
  const draftDone = draftSteps.filter(Boolean).length;
  const nextStageIndex = draftSteps.findIndex(x => !x);
  const nextStage = DRAFT_STAGES[nextStageIndex] || DRAFT_STAGES[3];
  const optedIn = customers.filter(c => c.marketingOptIn === true).length;

  const currentNav = NAV.find(n => n.id === activeTab);
  const currentNavLabel = currentNav ? navLabel(currentNav, t) : '';

  const stepDone = (step) => isStepDone(step, { level, quests, amzProgress });
  const doneCount = JOURNEY.filter(stepDone).length;
  const nextStep = JOURNEY.find(s => !stepDone(s)) || null;
  const nextQuest = quests.find(q => !q.completed) || null;

  // Real classifications from the backend, in merchant-facing order.
  const integrations = health?.services
    ? INTEGRATION_ORDER
      .filter(key => health.services[key])
      .map(key => ({ name: INTEGRATION_LABELS[key] || key, state: health.services[key].classification || 'UNKNOWN' }))
    : FALLBACK_INTEGRATIONS;

  const healthCounts = health?.integrationSummary || null;
  const levelTitle = level === 3 ? 'Digital Vyapari' : 'Mohalla Merchant';

  return (
    <div className="app-shell">
      <WorkspaceSidebar
        navOpen={navOpen}
        activeTab={activeTab}
        onNavigate={go}
        onClose={() => setNavOpen(false)}
        profile={profile}
        level={level}
        xp={xp}
        nextQuest={nextQuest}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backendOnline={backendOnline}
        healthCounts={healthCounts}
        integrations={integrations}
        t={t}
      />

      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} />}

      <div className="app-main">
        <header className="page-head">
          <button className="nav-toggle" onClick={() => setNavOpen(true)} aria-label="Open navigation">
            <Menu size={21} />
          </button>
          <div className="breadcrumbs">
            Workspace <ChevronRight size={13} /> <strong>{currentNavLabel}</strong>
          </div>
          <div className="head-actions">
            <span className="pill pill-quiet">Prototype workspace</span>
            <span className="avatar" aria-hidden="true">R</span>
          </div>
        </header>

        <main className="page-body">
          {storageError && (
            <p role="alert" className="notice">
              {tx('Browser storage is full or unavailable. This draft is only saved for this session; export it before closing.')}
            </p>
          )}
          {notice && <p role="status" className="notice">{notice}</p>}

          {activeTab === 'town' ? (
            <>
              <div className="overview-heading">
                <div>
                  <p className="eyebrow">{tx('A LITTLE PROGRESS, EVERY DAY')}</p>
                  <h1>{tx('Your shop.')} <span>{tx('New possibilities.')}</span></h1>
                  <p className="subtitle">
                    {doneCount === JOURNEY.length
                      ? tx('Every engine is running. Keep the town growing.')
                      : `${nextStep ? `Next up: ${nextStep.label.toLowerCase()}` : 'All five engines are running'}`}
                  </p>
                </div>
                <button className="btn btn-primary" onClick={begin}>
                  <Plus size={17} />{draft.original ? tx('Continue product') : tx('Add your first product')}
                </button>
              </div>

              <section className="hero-panel">
                <div className="hero-copy">
                  <span className="pill pill-accent"><Sparkles size={13} /> {tx('FROM SHELF TO SCREEN')}</span>
                  <h2>{tx('A great product deserves')}<br />{tx('a bigger audience.')}</h2>
                  <p>
                    ₹{profile.monthlyOfflineRevenue.toLocaleString()} at the counter each month.
                    {nextQuest ? ` ${tx('Next:')} ${nextQuest.title.toLowerCase()}.` : ` ${tx('Every engine is running.')}`}
                    <br />{tx('You review every detail before it leaves your shop.')}
                  </p>
                  <button className="btn btn-primary" onClick={() => go(nextStep ? nextStep.id : 'studio')}>
                    {nextStep ? nextStep.label : tx('Prepare a product')}<ArrowRight size={17} />
                  </button>
                  <div className="hero-foot">
                    <span className="tiny-dot" />
                    <TrendingUp size={12} />{tx('of')} {amzCompleted} {tx('of')} {amzItems.length} {tx('Amazon packaging checks done')}
                  </div>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="art-stamp">{tx('THE DIGITAL DUKAAN')}</div>
                  <div className="store-illustration">
                    <div className="shop-roof">SHREE GANESH</div>
                    <div className="shop-awning">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>
                    <div className="shop-face">
                      <div className="shop-window">
                        <span>✦</span>
                        <div className="cloth c1" /><div className="cloth c2" /><div className="cloth c3" />
                      </div>
                      <div className="shop-door"><span>OPEN</span></div>
                    </div>
                    <div className="shop-base" />
                  </div>
                  <div className="floating-label label-one"><Check size={15} /> {tx('Listing prepared')}</div>
                  <div className="floating-label label-two"><MessageSquare size={15} /> {tx('A personal touch')}</div>
                  <span className="art-caption">{tx('LOCAL ROOTS. WIDER REACH.')}</span>
                </div>
              </section>

              <div className="overview-stats">
                <div className="stat-card">
                  <span className="stat-icon"><Sparkles size={19} /></span>
                  <span className="stat-value">{xp}</span>
                  <h3>Experience points</h3>
                  <p>{levelTitle} · {level === 3 ? 'top level reached' : `${600 - xp} XP to Digital Vyapari`}</p>
                </div>
                <div className="stat-card">
                  <span className="stat-icon"><Package size={19} /></span>
                  <span className="stat-value">{amzCompleted}/{amzItems.length}</span>
                  <h3>Amazon packaging ready</h3>
                  <p>From the reference checklist, not a guess</p>
                </div>
                <div className="stat-card">
                  <span className="stat-icon"><MessageSquare size={19} /></span>
                  <span className="stat-value">{optedIn}</span>
                  <h3>Customers with recorded opt-in</h3>
                  <p>Reachable on WhatsApp in their own language</p>
                </div>
              </div>

              <div className="dashboard-bottom">
                <section className="surface draft-summary">
                  <div className="section-head">
                    <h2>Pick up where you left off</h2>
                    <span className="pill pill-accent">{draftDone}/4 steps</span>
                  </div>
                  <div className="draft-row">
                    {draft.original ? (
                      <img src={draft.original} alt={draft.title || 'Your product'} />
                    ) : (
                      <div className="draft-empty"><Package size={32} /></div>
                    )}
                    <div>
                      <p className="eyebrow">{draft.sample ? 'SAMPLE PRODUCT' : 'YOUR PRODUCT DRAFT'}</p>
                      <h3>{draft.title || 'Your next bestseller starts here'}</h3>
                      <p className="meta">
                        {draft.title ? `${money(draft.price)} · ${draft.stock || 0} in stock` : 'Add a photo and a few details. We’ll help with the rest.'}
                      </p>
                    </div>
                  </div>
                  <div className="mini-track"><div style={{ width: `${(draftDone / 4) * 100}%` }} /></div>
                  <button className="btn btn-secondary" onClick={() => go(nextStage.id)}>
                    {nextStage.label}<ArrowRight size={15} />
                  </button>
                </section>

                <section className="surface next-actions">
                  <p className="eyebrow">MAKE YOUR NEXT MOVE</p>
                  <h2>Small steps. Real outputs.</h2>
                  {[
                    ['gemini', '01', 'Photograph a product', 'Gemini reads the fabric and writes the listing'],
                    ['crm', '02', 'Start a conversation', 'Preview an offer for your customers'],
                    ['simulator', '03', 'Explore the numbers', 'Compare scenarios before spending']
                  ].map(([id, n, title, desc]) => (
                    <button key={id} onClick={() => go(id)}>
                      <span>{n}</span>
                      <div><strong>{title}</strong><p>{desc}</p></div>
                      <ArrowUpRight size={18} />
                    </button>
                  ))}
                </section>
              </div>

              <JourneyRail
                stepDone={stepDone}
                activeTab={activeTab}
                onNavigate={go}
                doneCount={doneCount}
              />

              <div className="stack">
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
            </>
          ) : (
            <>
              <div className="workspace-title">
                <p className="eyebrow">YOUR COMMERCE WORKSPACE</p>
                <h1>{currentNavLabel}</h1>
                <p className="subtitle">{screenSubtitle(activeTab, t)}</p>
              </div>

              {['studio', 'catalog', 'crm'].includes(activeTab) && (
                <nav className="compact-journey" aria-label="Product journey">
                  {DRAFT_STAGES.map((stage, i) => (
                    <button
                      key={stage.labelKey}
                      onClick={() => go(stage.id)}
                      className={draftSteps[i] ? 'complete' : ''}
                    >
                      <span>{draftSteps[i] ? <Check size={13} /> : i + 1}</span>
                      {t[stage.labelKey] || stage.label}
                    </button>
                  ))}
                </nav>
              )}

              {activeTab === 'studio' && (
                <ProductStudio
                  draft={draft}
                  update={(patch) => setDraft(old => patchDraft(old, patch))}
                  setDraft={setDraft}
                  products={products}
                  onNext={() => go('catalog')}
                  ready={draftReady}
                />
              )}

              {activeTab === 'gemini' && (
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
                  onDispatchCampaign={() => addXp(40)}
                  currentLanguage={currentLang}
                  t={t}
                  onNavigateToSimulator={() => go('simulator')}
                />
              )}

              {activeTab === 'simulator' && (
                <WhatIfSimulator
                  onApplyStrategy={() => addXp(50)}
                  t={t}
                  onCompleteJourney={() => {
                    addXp(100);
                    setQuests(prev => prev.map(q => ({ ...q, completed: true })));
                    setLevel(3);
                    setActiveTab('town');
                    confetti({ particleCount: 150, spread: 120, origin: { y: 0.5 }, colors: CONFETTI_COLORS });
                  }}
                />
              )}

              {activeTab === 'readiness' && (
                <PhysicalReadinessChecker readinessRules={rules} onToggleTask={handleToggleTask} t={t} />
              )}

              {activeTab === 'paytm' && (
                <PaytmPaymentHub shopProfile={profile} t={t} />
              )}
            </>
          )}

          <footer className="workspace-footer">
            <Store size={14} /> Built for the shop around the corner.
            <span>Prepared ≠ published · Estimates ≠ earnings</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

/**
 * Root. Mounts the Sarvam-backed translator above every screen; it owns the
 * selected language so any component can call tx('...') without prop-drilling.
 */
export default function App() {
  return (
    <TranslationProvider>
      <Workspace />
    </TranslationProvider>
  );
}
