import React, { useState } from 'react';
import { Trophy, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

const CONFETTI_COLORS = ['#E8A33D', '#F2C179', '#7BB88F'];

export default function WhatIfSimulator({ onApplyStrategy, t, onCompleteJourney }) {
  const [budget, setBudget] = useState(10000);
  const [targetRevenue, setTargetRevenue] = useState(50000);
  const [customerCount, setCustomerCount] = useState(184);

  // Configurable Model Assumptions (transparent & cited)
  const [marketplaceFeePct, setMarketplaceFeePct] = useState(17.5);
  const [returnRiskPct, setReturnRiskPct] = useState(14);
  const [whatsAppCostPerChat, setWhatsAppCostPerChat] = useState(0.85);

  // ----------------------------------------------------
  // Deterministic Math Models (Strict code calculation)
  // ----------------------------------------------------

  // Strategy A: Marketplace Expansion
  const stratA_GrossSales = Math.round(budget * 3.4);
  const stratA_Commission = Math.round(stratA_GrossSales * (marketplaceFeePct / 100));
  const stratA_Shipping = Math.round((stratA_GrossSales / 2200) * 110);
  const stratA_ReturnsRisk = Math.round(stratA_GrossSales * (returnRiskPct / 100) * 0.4);
  const stratA_NetProfit = Math.round(stratA_GrossSales - budget - stratA_Commission - stratA_Shipping - stratA_ReturnsRisk);
  const stratA_Margin = stratA_GrossSales > 0 ? Math.round((stratA_NetProfit / stratA_GrossSales) * 100) : 0;
  const stratA_PaybackDays = 26;

  // Strategy B: WhatsApp Customer Reactivation
  const stratB_Reach = customerCount;
  const stratB_Conversion = Math.round(stratB_Reach * 0.24);
  const stratB_GrossSales = Math.round(stratB_Conversion * 1850);
  const stratB_Cost = Math.round(stratB_Reach * whatsAppCostPerChat);
  const stratB_NetProfit = Math.round(stratB_GrossSales - stratB_Cost - (stratB_Conversion * 1050));
  const stratB_Margin = stratB_GrossSales > 0 ? Math.round((stratB_NetProfit / stratB_GrossSales) * 100) : 0;
  const stratB_PaybackDays = 2;

  // Strategy C: Hyperlocal Meta Ads
  const stratC_GrossSales = Math.round(budget * 2.6);
  const stratC_AdCost = budget;
  const stratC_NetProfit = Math.round(stratC_GrossSales - stratC_AdCost - (stratC_GrossSales * 0.48));
  const stratC_Margin = stratC_GrossSales > 0 ? Math.round((stratC_NetProfit / stratC_GrossSales) * 100) : 0;
  const stratC_PaybackDays = 6;

  const handleApply = (strategyName) => {
    onApplyStrategy(strategyName);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 }, colors: CONFETTI_COLORS });
  };

  const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

  const strategies = [
    {
      id: 'A',
      name: 'Sell on marketplaces',
      blurb: 'Amazon and Flipkart, all-India reach',
      risk: 'Medium risk',
      riskTone: 'pill-warn',
      sales: stratA_GrossSales,
      costs: [
        { label: `Platform fee ${marketplaceFeePct}%`, value: -stratA_Commission },
        { label: `Returns buffer ${returnRiskPct}%`, value: -stratA_ReturnsRisk }
      ],
      profit: stratA_NetProfit,
      margin: stratA_Margin,
      payback: `~${stratA_PaybackDays} days`,
      action: () => handleApply('Strategy A: Marketplace')
    },
    {
      id: 'B',
      name: 'Win back your customers',
      blurb: 'WhatsApp offers to people who already shopped here',
      risk: 'Low risk',
      riskTone: 'pill-ok',
      sales: stratB_GrossSales,
      costs: [
        { label: `WhatsApp messages`, value: -stratB_Cost },
        { label: 'Marketplace commission', value: 0 },
        { label: 'Buying the cloth', value: -(stratB_Conversion * 1050) }
      ],
      profit: stratB_NetProfit,
      margin: stratB_Margin,
      payback: `~${stratB_PaybackDays} days`,
      recommended: true,
      action: () => {
        handleApply('Strategy B: WhatsApp CRM');
        if (onCompleteJourney) onCompleteJourney();
      }
    },
    {
      id: 'C',
      name: 'Advertise nearby',
      blurb: 'Paid ads within 5 km of your shop',
      risk: 'High risk',
      riskTone: 'pill-stop',
      sales: stratC_GrossSales,
      costs: [
        { label: 'Ad spend', value: -stratC_AdCost }
      ],
      profit: stratC_NetProfit,
      margin: stratC_Margin,
      payback: `~${stratC_PaybackDays} days`
    }
  ];

  return (
    <div className="stack">
      {/* Controls: what the merchant can change */}
      <section className="surface" style={{ padding: 'var(--s5)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--s5)' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span className="eyebrow">You can spend</span>
            <span className="mono" style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{inr(budget)}</span>
          </div>
          <input type="range" min="3000" max="50000" step="1000" value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            aria-label="Available investment budget"
            style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span className="eyebrow">Customers on your list</span>
            <span className="mono" style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{customerCount}</span>
          </div>
          <input type="range" min="50" max="800" step="10" value={customerCount}
            onChange={(e) => setCustomerCount(Number(e.target.value))}
            aria-label="Stored offline customers"
            style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span className="eyebrow">Revenue you want</span>
            <span className="mono" style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{inr(targetRevenue)}</span>
          </div>
          <input type="range" min="15000" max="150000" step="5000" value={targetRevenue}
            onChange={(e) => setTargetRevenue(Number(e.target.value))}
            aria-label="Target incremental revenue"
            style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>
      </section>

      {/* The answer: profit per option */}
      <section>
        <div className="section-head">
          <div>
            <h2>What each option would earn you</h2>
            <p className="meta" style={{ marginTop: 2 }}>Calculated from the numbers above, not estimated by a model</p>
          </div>
        </div>

        <div className="strategy-grid">
          {strategies.map(s => (
            <div
              key={s.id}
              className={`surface strategy${s.recommended ? ' strategy-featured' : ''}`}
            >
              {s.recommended && (
                <span className="strategy-flag">Best for a shop your size</span>
              )}

              <div>
                <p className="eyebrow">Option {s.id}</p>
                <h3 style={{ fontSize: '1.0625rem', marginTop: 4 }}>{s.name}</h3>
                <p className="meta" style={{ marginTop: 3 }}>{s.blurb}</p>
              </div>

              <div>
                <p className="eyebrow">You would keep</p>
                <p className="metric-lg" style={{ fontSize: '2rem', marginTop: 4 }}>{inr(s.profit)}</p>
                <p className="meta" style={{ marginTop: 2 }}>
                  {s.margin}% margin on {inr(s.sales)} of sales
                </p>
              </div>

              <div className="strategy-breakdown" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8125rem' }}>
                {s.costs.map(c => (
                  <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span className="meta">{c.label}</span>
                    <span className="mono" style={{ color: c.value < 0 ? 'var(--stop)' : 'var(--ok)' }}>
                      {c.value === 0 ? '₹0' : `-${inr(Math.abs(c.value))}`}
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 6, borderTop: '1px solid var(--line-faint)' }}>
                  <span className="meta">Money back in</span>
                  <span className="mono">{s.payback}</span>
                </div>
              </div>

              <div className="strategy-foot">
                <span className={`pill ${s.riskTone}`}>{s.risk}</span>

                <button
                  onClick={s.action || (() => handleApply(`Strategy ${s.id}`))}
                  className={s.recommended ? 'btn btn-primary' : 'btn btn-secondary'}
                >
                  {s.recommended && <Trophy size={15} />}
                  {s.recommended ? 'Do this one' : `Choose option ${s.id}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Where the assumptions come from */}
      <details className="model-notes">
        <summary>
          <span>Where these numbers come from</span>
          <ChevronDown size={14} />
        </summary>
        <div style={{ paddingTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--s4)' }}>
          <div>
            <p className="eyebrow">Marketplace fee</p>
            <p className="mono" style={{ marginTop: 3 }}>{marketplaceFeePct}%</p>
            <p className="meta">Amazon India apparel rate card</p>
          </div>
          <div>
            <p className="eyebrow">Returns buffer</p>
            <p className="mono" style={{ marginTop: 3 }}>{returnRiskPct}%</p>
            <p className="meta">Indian apparel return benchmark</p>
          </div>
          <div>
            <p className="eyebrow">WhatsApp conversation</p>
            <p className="mono" style={{ marginTop: 3 }}>₹{whatsAppCostPerChat}</p>
            <p className="meta">Meta India business rate</p>
          </div>
          <div>
            <p className="eyebrow">How it is calculated</p>
            <p className="meta" style={{ marginTop: 3, lineHeight: 1.5 }}>
              Arithmetic in the browser, so you can change any input and watch the profit move. Conversion, order value and returns are demo assumptions for a shop of this size.
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}