import { useState, useEffect } from 'react';
import { Store, Package, Sparkles, Globe, MessageSquare, Calculator, CreditCard, ArrowUpRight, ArrowRight, Plus, Check, Menu, X, Layers, ChevronRight } from 'lucide-react';
import DigitalDukaanCanvas from './components/game/DigitalDukaanCanvas';
import PhysicalReadinessChecker from './components/readiness/PhysicalReadinessChecker';
import PaytmPaymentHub from './components/paytm/PaytmPaymentHub';
import { ProductStudio, ProductListings } from './components/ProductWorkspace';
import WhatsAppCRMHub from './components/crm/WhatsAppCRMHub';
import WhatIfSimulator from './components/simulator/WhatIfSimulator';
import * as api from './services/api';
import { shopProfile, platformReadinessRules, sampleProducts, crmCustomers, languageTranslations } from './data/mockData';
import { DRAFT_KEY, newDraft, checks, patchDraft, money } from './services/draft';
const navigation = [['town', 'Overview', Store], ['studio', 'Product studio', Sparkles], ['catalog', 'Marketplace listings', Globe], ['crm', 'Customer campaigns', MessageSquare], ['simulator', 'Growth planner', Calculator], ['readiness', 'Packaging checklist', Package], ['paytm', 'Payments', CreditCard]];
export default function App() {
    const [active, setActive] = useState('town');
    const [navOpen, setNavOpen] = useState(false);
    const [health, setHealth] = useState(null);
    const [profile, setProfile] = useState(shopProfile);
    const [rules, setRules] = useState(platformReadinessRules);
    const [products, setProducts] = useState(sampleProducts);
    const [customers, setCustomers] = useState(crmCustomers);
    const [lang, setLang] = useState('en');
    const [notice, setNotice] = useState('');
    const [draft, setDraft] = useState(() => {
        try {
            const d = JSON.parse(localStorage.getItem(DRAFT_KEY));
            if (d && ['title', 'brand', 'material', 'size', 'description', 'original'].every(k => typeof d[k] === 'string'))
                return { ...newDraft(), ...d };
        }
        catch { /* Start with an empty draft if storage is unavailable. */ }
        return newDraft();
    });
    const [storageError, setStorageError] = useState(false);
    // Storage is an external system; report quota failures so users can export their work.
    useEffect(() => { try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        // Storage failures must be reflected in the UI after this external write.
        // oxlint-disable-next-line react/set-state-in-effect
        setStorageError(false);
    }
    catch {
        // oxlint-disable-next-line react/set-state-in-effect
        setStorageError(true);
    } }, [draft]);
    useEffect(() => {
        let mounted = true;
        api.fetchHealth().then(h => { if (mounted)
            setHealth(h); });
        Promise.allSettled([api.fetchShopProfile(), api.fetchReadinessRules(), api.fetchProducts(), api.fetchCustomers()]).then(results => {
            if (!mounted)
                return;
            const setters = [setProfile, setRules, setProducts, setCustomers];
            results.forEach((r, i) => { if (r.status === 'fulfilled' && r.value && !r.value.error)
                setters[i](r.value); });
        });
        return () => { mounted = false; };
    }, []);
    const update = patch => setDraft(old => patchDraft(old, patch));
    const go = tab => { setActive(tab); setNavOpen(false); setNotice(''); window.scrollTo({ top: 0, behavior: 'instant' }); };
    const begin = () => { if (draft.title || draft.original) {
        go('studio');
        return;
    } setDraft(newDraft()); go('studio'); };
    const validation = checks(draft);
    const ready = validation.every(c => c.valid);
    const completed = [!!draft.original, draft.reviewed && ready, draft.exported, draft.campaignPrepared];
    const stages = [['studio', 'Add product'], ['studio', 'Review details'], ['catalog', 'Prepare listing'], ['crm', 'Create campaign']];
    const done = completed.filter(Boolean).length;
    const optedIn = customers.filter(c => c.marketingOptIn === true).length;
    const next = stages[completed.findIndex(x => !x)] || ['crm', 'View campaign'];
    const t = languageTranslations[lang] || languageTranslations.en;
    const toggleTask = async (platform, id, completed) => {
        try {
            const result = await api.toggleReadinessTask(platform, id, completed);
            if (result?.error)
                throw Error(result.error);
            setRules(prev => ({ ...prev, [platform]: { ...prev[platform], checklist: prev[platform].checklist.map(item => item.id === id ? { ...item, completed } : item) } }));
        }
        catch {
            setNotice('Could not save the checklist. Check the backend and try again.');
        }
    };
    return <div className="app-shell">
  <aside className={`sidebar ${navOpen ? 'sidebar-open' : ''}`}>
   <div className="sidebar-brand"><div className="brand-mark"><Store size={23}/></div><div><span className="brand-name">dukaan<span className="brand-accent">quest</span></span><span className="brand-sub">YOUR NEXT CHAPTER IN COMMERCE</span></div><button className="mobile-close btn btn-quiet" aria-label="Close navigation" onClick={() => setNavOpen(false)}><X size={18}/></button></div>
   <div className="shop-identity"><span className="shop-avatar">SG</span><div><strong>Shree Ganesh</strong><span>Apparel & ethnic wear</span></div><ChevronRight size={15}/></div>
   <p className="nav-caption">WORKSPACE</p>
   <nav className="sidebar-nav" aria-label="Primary">{navigation.map(([id, label, Icon]) => <button key={id} className={`nav-item ${active === id ? 'nav-item-active' : ''}`} onClick={() => go(id)} aria-current={active === id ? 'page' : undefined}><Icon size={18}/>{label}{active === id && <span className="nav-active-dot"/>}</button>)}</nav>
   <div className="sidebar-foot">
    <div className="local-card"><Layers size={19}/><strong>Your work, saved here</strong><p>Product drafts stay in this browser. Export a copy when you are ready.</p></div>
    <details className="integrations"><summary><span className={`conn-dot ${health ? 'conn-live' : ''}`}/>{health ? 'Backend connected' : 'Using local sample data'}</summary><ul>{health?.services ? Object.entries(health.services).map(([name, s]) => <li key={name}><span>{name}</span><span>{s.classification || 'Unknown'}</span></li>) : <li>External services have not been verified.</li>}</ul></details>
    <p className="meta">DukaanQuest · HackSprint prototype</p>
   </div>
  </aside>
  {navOpen && <button className="scrim" aria-label="Close menu" onClick={() => setNavOpen(false)}/>}
  <div className="app-main">
   <header className="page-head"><button className="nav-toggle" onClick={() => setNavOpen(true)} aria-label="Open navigation"><Menu size={21}/></button><div className="breadcrumbs">Workspace <ChevronRight size={13}/> <strong>{navigation.find(n => n[0] === active)?.[1]}</strong></div><div className="head-actions"><span className="pill pill-quiet">Prototype workspace</span><span className="avatar">J</span></div></header>
   <main className="page-body">
    {storageError && <p role="alert" className="notice">Browser storage is full or unavailable. This draft is only saved for this session; export it before closing.</p>}
    {notice && <p role="status" className="notice">{notice}</p>}
    {active === 'town' ? <>
     <div className="overview-heading"><div><p className="eyebrow">A LITTLE PROGRESS, EVERY DAY</p><h1>Your shop. <span>New possibilities.</span></h1><p className="subtitle">Turn what’s on your shelves into what’s next for your business.</p></div><button className="btn btn-primary" onClick={begin}><Plus size={17}/>{draft.original ? 'Continue product' : 'Add your first product'}</button></div>
     <section className="hero-panel"><div className="hero-copy"><span className="pill pill-accent"><Sparkles size={13}/> FROM SHELF TO SCREEN</span><h2>A great product deserves<br />a bigger audience.</h2><p>One photo. A polished listing. A thoughtful message.<br />Take your next step into digital commerce.</p><button className="btn btn-primary" onClick={() => go(next[0])}>{draft.original ? next[1] : 'Let’s prepare a product'}<ArrowRight size={17}/></button><div className="hero-foot"><span className="tiny-dot"/>You review every detail before it leaves your shop.</div></div><div className="hero-art" aria-hidden="true"><div className="art-stamp">THE DIGITAL DUKAAN</div><div className="store-illustration"><div className="shop-roof">SHREE GANESH</div><div className="shop-awning">{Array.from({ length: 8 }, (_, i) => <i key={i}/>)}</div><div className="shop-face"><div className="shop-window"><span>✦</span><div className="cloth c1"/><div className="cloth c2"/><div className="cloth c3"/></div><div className="shop-door"><span>OPEN</span></div></div><div className="shop-base"/></div><div className="floating-label label-one"><Check size={15}/> Listing prepared</div><div className="floating-label label-two"><MessageSquare size={15}/> A personal touch</div><span className="art-caption">LOCAL ROOTS. WIDER REACH.</span></div></section>
     <div className="overview-stats">{[[Package, draft.original ? '1' : '0', 'Product in your workspace', 'One focused product journey'], [Check, `${validation.filter(c => c.valid).length}/${validation.length}`, 'Details ready', 'Confirm the facts before exporting'], [MessageSquare, String(optedIn), 'Customers with recorded opt-in', 'From the loaded customer records']].map(([Icon, value, label, detail]) => <div className="stat-card" key={label}><span className="stat-icon"><Icon size={19}/></span><span className="stat-value">{value}</span><h3>{label}</h3><p>{detail}</p></div>)}</div>
     <div className="dashboard-bottom"><section className="surface draft-summary"><div className="section-head"><h2>Pick up where you left off</h2><span className="pill pill-accent">{done}/4 steps</span></div><div className="draft-row">{draft.original ? <img src={draft.enhanced || draft.original} alt={draft.title || 'Your product'}/> : <div className="draft-empty"><Package size={32}/></div>}<div><p className="eyebrow">{draft.sample ? 'SAMPLE PRODUCT' : 'YOUR PRODUCT DRAFT'}</p><h3>{draft.title || 'Your next bestseller starts here'}</h3><p className="meta">{draft.title ? `${money(draft.price)} · ${draft.stock || 0} in stock` : 'Add a photo and a few details. We’ll help with the rest.'}</p></div></div><div className="mini-track"><div style={{ width: `${done / 4 * 100}%` }}/></div><button className="btn btn-secondary" onClick={() => go(next[0])}>{next[1]}<ArrowRight size={15}/></button></section><section className="surface next-actions"><p className="eyebrow">MAKE YOUR NEXT MOVE</p><h2>Small steps. Real outputs.</h2>{[['studio', '01', 'Prepare a product', 'Photo, details and a listing draft'], ['crm', '02', 'Start a conversation', 'Preview an offer for your customers'], ['simulator', '03', 'Explore the numbers', 'Compare scenarios before spending']].map(([id, n, title, desc]) => <button key={id} onClick={() => go(id)}><span>{n}</span><div><strong>{title}</strong><p>{desc}</p></div><ArrowUpRight size={18}/></button>)}</section></div>
     <details className="surface town-disclosure"><summary><Store size={18}/> Explore your digital town <span>Another way to navigate your workspace</span></summary><DigitalDukaanCanvas level={Math.min(3, 1 + Math.floor(done / 2))} xp={done * 150} readinessProgress={0} studioUnlocked={!!draft.original} crmConnected={draft.campaignPrepared} onSelectBuilding={go}/></details>
    </> : <>
     <div className="workspace-title"><p className="eyebrow">YOUR COMMERCE WORKSPACE</p><h1>{navigation.find(n => n[0] === active)?.[1]}</h1><p className="subtitle">{{ studio: 'Start with a photo. Make every detail your own.', catalog: 'One product, ready for its next destination.', crm: 'A personal offer. A preview you can trust.', simulator: 'Explore possibilities, with the assumptions in plain sight.', readiness: 'Prepare your packaging using the team’s reference checklist.', paytm: 'Explore the existing payment adapter and its reported status.' }[active]}</p></div>
     {['studio', 'catalog', 'crm'].includes(active) && <nav className="compact-journey" aria-label="Product journey">{stages.map(([id, label], i) => <button key={label} onClick={() => go(id)} className={completed[i] ? 'complete' : ''}><span>{completed[i] ? <Check size={13}/> : i + 1}</span>{label}</button>)}</nav>}
     {active === 'studio' && <ProductStudio draft={draft} update={update} setDraft={setDraft} products={products} onNext={() => go('catalog')} ready={ready}/>}
     {active === 'catalog' && <ProductListings draft={draft} update={update} setDraft={setDraft} onEdit={() => go('studio')} onNext={() => go('crm')} health={health}/>}
     {active === 'crm' && <WhatsAppCRMHub draft={draft} customers={customers} currentLanguage={lang} setLanguage={setLang} setDraft={setDraft} health={health}/>}
     {active === 'simulator' && <WhatIfSimulator draft={draft} customers={optedIn}/>}
     {active === 'readiness' && <PhysicalReadinessChecker readinessRules={rules} onToggleTask={toggleTask} t={t}/>}
     {active === 'paytm' && <PaytmPaymentHub shopProfile={profile} t={t}/>}
    </>}
    <footer className="workspace-footer"><Store size={14}/> Built for the shop around the corner.<span>Prepared ≠ published · Estimates ≠ earnings</span></footer>
   </main>
  </div>
 </div>;
}
