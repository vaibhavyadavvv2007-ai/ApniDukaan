import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Package, 
  Sparkles, 
  Globe, 
  MessageSquare, 
  Calculator, 
  CreditCard, 
  Trophy, 
  Flame, 
  Languages,
  Store,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Server
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

export default function App() {
  const [activeTab, setActiveTab] = useState('town'); // town, readiness, studio, catalog, crm, simulator, paytm
  const [currentLang, setCurrentLang] = useState('en'); // en, hi, kn, ta
  const [profile, setProfile] = useState(fallbackProfile);
  const [xp, setXp] = useState(fallbackProfile.currentXp);
  const [level, setLevel] = useState(fallbackProfile.level);
  const [rules, setRules] = useState(fallbackRules);
  const [quests, setQuests] = useState(fallbackQuests);
  const [customers, setCustomers] = useState(fallbackCustomers);
  const [products, setProducts] = useState(fallbackProducts);
  const [backendOnline, setBackendOnline] = useState(false);

  const t = languageTranslations[currentLang] || languageTranslations.en;

  // Sync with Backend API on Mount
  useEffect(() => {
    async function initData() {
      try {
        const health = await api.fetchHealth();
        if (health && health.status === 'ok') {
          setBackendOnline(true);
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

  // Calculate readiness percentage for Amazon
  const amzItems = rules.amazon?.checklist || [];
  const amzCompleted = amzItems.filter(i => i.completed).length;
  const amzProgress = amzItems.length > 0 ? Math.round((amzCompleted / amzItems.length) * 100) : 0;

  // Handle XP Increase & Level-Up
  const addXp = (amount) => {
    const newXp = xp + amount;
    if (newXp >= 600 && level < 3) {
      setLevel(3);
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899']
      });
    }
    setXp(newXp);
    api.updateShopXp(amount).catch(() => {});
  };

  // Toggle checklist item
  const handleToggleTask = (platform, taskId, completed, xpReward) => {
    setRules(prev => {
      const updatedList = prev[platform].checklist.map(item => 
        item.id === taskId ? { ...item, completed } : item
      );
      return {
        ...prev,
        [platform]: {
          ...prev[platform],
          checklist: updatedList
        }
      };
    });

    api.toggleReadinessTask(platform, taskId, completed).catch(() => {});

    if (completed) {
      addXp(xpReward);
    }
  };

  // Complete a quest
  const handleCompleteQuest = (questId, xpReward) => {
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, completed: true } : q));
    api.completeQuest(questId).catch(() => {});
    addXp(xpReward);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Universal Navbar */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        background: 'rgba(3, 7, 18, 0.85)', 
        backdropFilter: 'blur(20px)', 
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 24px'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Logo & Hackathon Track */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: 'var(--brand-gradient)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#FFFFFF', 
              fontWeight: 900, 
              fontSize: '1.2rem',
              boxShadow: 'var(--brand-glow)'
            }}>
              DQ
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #FFFFFF, #CBD5E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  DukaanQuest
                </span>
                <span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>
                  PS-21 FinTech
                </span>
                <span className={backendOnline ? "badge badge-emerald" : "badge badge-amber"} style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Server size={11} /> {backendOnline ? "REST API Connected" : "Local Engine"}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {profile.shopName} • {profile.location}
              </div>
            </div>
          </div>

          {/* Center: Sponsor Strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Integrated Sponsors:</span>
            <span style={{ fontSize: '0.75rem', color: '#8B5CF6', fontWeight: 600 }}>Gemini Pro</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 600 }}>n8n Hub</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: '#FCD34D', fontWeight: 600 }}>Sarvam AI</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: '#00BAF2', fontWeight: 600 }}>Paytm UPI</span>
          </div>

          {/* Right Controls: Sarvam Lang Switcher & Merchant Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Sarvam AI Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '4px 10px' }}>
              <Languages size={15} color="#A5B4FC" />
              <select 
                value={currentLang} 
                onChange={(e) => setCurrentLang(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#F8FAFC', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
              >
                <option value="en" style={{ background: '#0B0F19' }}>English</option>
                <option value="hi" style={{ background: '#0B0F19' }}>हिंदी (Hindi)</option>
                <option value="kn" style={{ background: '#0B0F19' }}>ಕನ್ನಡ (Kannada)</option>
                <option value="ta" style={{ background: '#0B0F19' }}>தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* XP & Level Meter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Level {level} • {level === 3 ? 'Digital Vyapari' : 'Mohalla Merchant'}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                  {xp}/600 XP
                </div>
              </div>
              <div style={{ width: '48px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, Math.round((xp / 600) * 100))}%`, height: '100%', background: 'linear-gradient(90deg, #6366F1, #10B981)' }} />
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* Main Tab Navigation Bar */}
      <nav style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-subtle)', padding: '8px 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {[
            { id: 'town', label: t.navDashboard, icon: Building2 },
            { id: 'readiness', label: t.navReadiness, icon: Package, badge: `${amzProgress}%` },
            { id: 'studio', label: t.navStudio, icon: Sparkles, badge: 'Gemini' },
            { id: 'catalog', label: t.navCatalog, icon: Globe },
            { id: 'crm', label: t.navCRM, icon: MessageSquare, badge: 'n8n' },
            { id: 'simulator', label: t.navSimulator, icon: Calculator },
            { id: 'paytm', label: 'Paytm FinTech', icon: CreditCard, badge: 'UPI' }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: active ? '1px solid var(--brand-primary)' : '1px solid transparent',
                  color: active ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={16} color={active ? '#A5B4FC' : 'currentColor'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`badge ${active ? 'badge-brand' : 'badge-emerald'}`} style={{ fontSize: '0.65rem' }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Viewport */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* TAB 1: Town & Copilot Dashboard */}
        {activeTab === 'town' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* 2D Canvas Town Engine */}
            <DigitalDukaanCanvas 
              level={level}
              xp={xp}
              readinessProgress={amzProgress}
              studioUnlocked={true}
              crmConnected={true}
              onSelectBuilding={(engine) => setActiveTab(engine)}
            />

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Offline Revenue</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F8FAFC', marginTop: '4px' }}>
                  ₹{profile.monthlyOfflineRevenue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  ↑ Gandhi Bazaar Footfalls Steady
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Marketplace Readiness</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
                  {amzProgress}% Complete
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Amazon & Flipkart Packaging Checked
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>WhatsApp CRM Reach</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#00BAF2', marginTop: '4px' }}>
                  {customers.length} Customers
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38BDF8', marginTop: '4px' }}>
                  n8n Automated Segmentation Active
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Gemini Studio Assets</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8B5CF6', marginTop: '4px' }}>
                  12 4K Assets
                </div>
                <div style={{ fontSize: '0.75rem', color: '#A5B4FC', marginTop: '4px' }}>
                  Amazon & Myntra Compliant
                </div>
              </div>
            </div>

            {/* Gamified Quests Log */}
            <QuestLog 
              quests={quests}
              level={level}
              xp={xp}
              streak={profile.streakDays}
              onCompleteQuest={handleCompleteQuest}
            />

          </div>
        )}

        {/* TAB 2: Engine 1 Physical Readiness */}
        {activeTab === 'readiness' && (
          <PhysicalReadinessChecker 
            readinessRules={rules}
            onToggleTask={handleToggleTask}
            t={t}
          />
        )}

        {/* TAB 3: Engine 2 Gemini AI Photo Studio */}
        {activeTab === 'studio' && (
          <GeminiPhotoStudio 
            sampleProducts={products}
            t={t}
          />
        )}

        {/* TAB 4: Engine 3 Omnichannel Catalog Transformer */}
        {activeTab === 'catalog' && (
          <OmnichannelCatalog 
            sampleProducts={products}
            t={t}
          />
        )}

        {/* TAB 5: Engine 4 n8n WhatsApp CRM */}
        {activeTab === 'crm' && (
          <WhatsAppCRMHub 
            customers={customers}
            onDispatchCampaign={(count) => addXp(40)}
            currentLanguage={currentLang}
            t={t}
          />
        )}

        {/* TAB 6: Engine 5 What-If Business Simulator */}
        {activeTab === 'simulator' && (
          <WhatIfSimulator 
            onApplyStrategy={(strat) => addXp(50)}
            t={t}
          />
        )}

        {/* TAB 7: Paytm FinTech Gateway */}
        {activeTab === 'paytm' && (
          <PaytmPaymentHub 
            shopProfile={profile}
            t={t}
          />
        )}

      </main>

      {/* Footer */}
      <footer style={{ background: 'rgba(3, 7, 18, 0.95)', borderTop: '1px solid var(--border-subtle)', padding: '20px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            <strong>DukaanQuest</strong> • Hack Sprint 2026 Submission Prototype (Track PS-21)
          </div>
          <div>
            Crafted for Ramesh-ji & India's 60M+ Retail Merchants
          </div>
        </div>
      </footer>

    </div>
  );
}
