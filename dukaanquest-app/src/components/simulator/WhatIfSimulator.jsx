import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  DollarSign,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WhatIfSimulator({ onApplyStrategy, t }) {
  const [budget, setBudget] = useState(10000);
  const [targetRevenue, setTargetRevenue] = useState(50000);
  const [customerCount, setCustomerCount] = useState(184);

  // Deterministic Math Models (Strictly calculated, no LLM hallucinations)
  // Strategy A: Marketplace Expansion
  const stratA_GrossSales = Math.round(budget * 3.4);
  const stratA_Commission = Math.round(stratA_GrossSales * 0.175);
  const stratA_Shipping = Math.round((stratA_GrossSales / 2200) * 110);
  const stratA_ReturnsRisk = Math.round(stratA_GrossSales * 0.14 * 0.4); // Cost of returns
  const stratA_NetProfit = Math.round(stratA_GrossSales - budget - stratA_Commission - stratA_Shipping - stratA_ReturnsRisk);
  const stratA_Margin = Math.round((stratA_NetProfit / stratA_GrossSales) * 100);
  const stratA_PaybackDays = 26;

  // Strategy B: WhatsApp Customer Reactivation (n8n)
  const stratB_Reach = customerCount;
  const stratB_Conversion = Math.round(stratB_Reach * 0.24); // 24% conversion from existing base
  const stratB_GrossSales = Math.round(stratB_Conversion * 1850);
  const stratB_Cost = Math.round(stratB_Reach * 0.85); // n8n + WhatsApp message cost
  const stratB_NetProfit = Math.round(stratB_GrossSales - stratB_Cost - (stratB_Conversion * 1050)); // COGS
  const stratB_Margin = Math.round((stratB_NetProfit / stratB_GrossSales) * 100);
  const stratB_PaybackDays = 2;

  // Strategy C: Hyperlocal Meta Ads (5km Radius)
  const stratC_GrossSales = Math.round(budget * 2.6);
  const stratC_AdCost = budget;
  const stratC_NetProfit = Math.round(stratC_GrossSales - stratC_AdCost - (stratC_GrossSales * 0.48)); // COGS
  const stratC_Margin = Math.round((stratC_NetProfit / stratC_GrossSales) * 100);
  const stratC_PaybackDays = 6;

  const handleApply = (strategyName) => {
    onApplyStrategy(strategyName);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#10B981', '#6366F1']
    });
  };

  return (
    <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <Calculator size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>{t.simTitle}</h2>
            <span className="badge badge-amber">Audited Math Engine</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px' }}>
            {t.simSubtitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: 'var(--radius-full)', color: '#6EE7B7', fontSize: '0.8rem', fontWeight: 600 }}>
          <ShieldCheck size={14} /> Zero LLM Hallucinations
        </div>
      </div>

      {/* Sliders Input Panel */}
      <div style={{ background: 'rgba(3, 7, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        
        {/* Slider 1: Capital Budget */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Available Investment Budget</span>
            <strong style={{ color: '#F59E0B', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>₹{budget.toLocaleString()}</strong>
          </div>
          <input 
            type="range" 
            min="3000" 
            max="50000" 
            step="1000" 
            value={budget} 
            onChange={(e) => setBudget(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#F59E0B' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>₹3,000</span>
            <span>₹50,000</span>
          </div>
        </div>

        {/* Slider 2: Target Revenue */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Target Incremental Revenue</span>
            <strong style={{ color: '#10B981', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>₹{targetRevenue.toLocaleString()}</strong>
          </div>
          <input 
            type="range" 
            min="15000" 
            max="150000" 
            step="5000" 
            value={targetRevenue} 
            onChange={(e) => setTargetRevenue(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#10B981' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>₹15,000</span>
            <span>₹1,50,000</span>
          </div>
        </div>

        {/* Slider 3: Customer Base */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Stored Offline Customers</span>
            <strong style={{ color: '#38BDF8', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>{customerCount} Shoppers</strong>
          </div>
          <input 
            type="range" 
            min="50" 
            max="800" 
            step="10" 
            value={customerCount} 
            onChange={(e) => setCustomerCount(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#38BDF8' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>50</span>
            <span>800</span>
          </div>
        </div>

      </div>

      {/* Tri-Strategy Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Strategy A */}
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-brand">Strategy A</span>
            <span style={{ fontSize: '0.75rem', color: '#F59E0B' }}>Risk: Medium</span>
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Marketplace Push</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Amazon & Flipkart All-India reach</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Projected Sales:</span>
              <strong style={{ color: '#F8FAFC' }}>₹{stratA_GrossSales.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Platform Fees (17.5%):</span>
              <span style={{ color: '#F43F5E' }}>-₹{stratA_Commission.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Returns Risk Buffer:</span>
              <span style={{ color: '#F43F5E' }}>-₹{stratA_ReturnsRisk.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Est. Net Profit:</span>
              <strong style={{ color: '#10B981', fontSize: '1rem' }}>₹{stratA_NetProfit.toLocaleString()} ({stratA_Margin}%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <span>Payback Timeline:</span>
              <span>~{stratA_PaybackDays} Days</span>
            </div>
          </div>

          <button onClick={() => handleApply('Strategy A: Marketplace')} className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
            Adopt Strategy A
          </button>
        </div>

        {/* Strategy B: Recommended */}
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', boxShadow: 'var(--color-emerald-glow)' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '20px', background: '#10B981', color: '#030712', fontSize: '0.7rem', fontWeight: 800, padding: '2px 10px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase' }}>
            ★ Recommended
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-emerald">Strategy B (n8n)</span>
            <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Risk: Low</span>
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>WhatsApp Reactivation</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Direct loyalty campaigns with 0% commission</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', borderTop: '1px solid rgba(16, 185, 129, 0.2)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Projected Sales:</span>
              <strong style={{ color: '#F8FAFC' }}>₹{stratB_GrossSales.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>n8n Broadcast Cost:</span>
              <span style={{ color: '#38BDF8' }}>₹{stratB_Cost} (Negligible)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Platform Commission:</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>₹0 (Direct UPI)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Est. Net Profit:</span>
              <strong style={{ color: '#10B981', fontSize: '1.1rem' }}>₹{stratB_NetProfit.toLocaleString()} ({stratB_Margin}%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <span>Payback Timeline:</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>~{stratB_PaybackDays} Days (Instant)</span>
            </div>
          </div>

          <button onClick={() => handleApply('Strategy B: WhatsApp CRM')} className="btn btn-emerald" style={{ width: '100%', marginTop: 'auto' }}>
            <Sparkles size={16} /> Execute Strategy B First
          </button>
        </div>

        {/* Strategy C */}
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-paytm">Strategy C</span>
            <span style={{ fontSize: '0.75rem', color: '#38BDF8' }}>Risk: Low-Med</span>
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Hyperlocal Meta Ads</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>5km radius Instagram/Facebook footfalls</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Projected Sales:</span>
              <strong style={{ color: '#F8FAFC' }}>₹{stratC_GrossSales.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ad Budget Spend:</span>
              <span style={{ color: '#F43F5E' }}>-₹{stratC_AdCost.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Footfalls:</span>
              <span style={{ color: '#38BDF8' }}>~45 Local Visits</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Est. Net Profit:</span>
              <strong style={{ color: '#10B981', fontSize: '1rem' }}>₹{stratC_NetProfit.toLocaleString()} ({stratC_Margin}%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <span>Payback Timeline:</span>
              <span>~{stratC_PaybackDays} Days</span>
            </div>
          </div>

          <button onClick={() => handleApply('Strategy C: Meta Ads')} className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
            Adopt Strategy C
          </button>
        </div>

      </div>

      {/* AI Plain-Language Verdict */}
      <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <Sparkles size={22} color="#A5B4FC" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: '#E0E7FF', display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>
            Copilot Strategic Verdict for Ramesh-ji:
          </strong>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Do not lock ₹{budget.toLocaleString()} into marketplaces immediately. Instead, run <strong>Strategy B (WhatsApp Reactivation)</strong>: you spend ₹{stratB_Cost} to reach your {customerCount} stored shoppers, recovering ₹{stratB_NetProfit.toLocaleString()} in profit within 48 hours. Then reinvest that generated cash into Strategy A for marketplace packaging and listings.
          </p>
        </div>
      </div>
    </div>
  );
}
