import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  ShieldCheck, 
  Printer, 
  Sparkles, 
  ExternalLink,
  Info,
  Package,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PhysicalReadinessChecker({ 
  readinessRules, 
  onToggleTask, 
  t 
}) {
  const [selectedPlatform, setSelectedPlatform] = useState('amazon');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const currentRules = readinessRules[selectedPlatform];
  const items = currentRules.checklist;
  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const isCertified = items.filter(i => i.mandatory).every(i => i.completed);

  const handleToggle = (item) => {
    const nextCompleted = !item.completed;
    onToggleTask(selectedPlatform, item.id, nextCompleted, item.xpReward);
    if (nextCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10B981', '#6366F1', '#F59E0B']
      });
    }
  };

  return (
    <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <Package size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>{t.physicalTitle}</h2>
            <span className="badge badge-amber">Exclusive Feature</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px' }}>
            {t.physicalSubtitle}
          </p>
        </div>

        <button 
          onClick={() => setShowPrintModal(true)}
          className="btn btn-secondary" 
          style={{ fontSize: '0.85rem' }}
        >
          <Printer size={16} /> Print Seller Checklist & Specs
        </button>
      </div>

      {/* Platform Selector Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', flexWrap: 'wrap' }}>
        {Object.entries(readinessRules).map(([key, data]) => {
          const active = selectedPlatform === key;
          const done = data.checklist.filter(i => i.completed).length;
          const total = data.checklist.length;
          return (
            <button
              key={key}
              onClick={() => setSelectedPlatform(key)}
              style={{
                background: active ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: active ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                color: active ? '#FFFFFF' : 'var(--text-secondary)',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{data.name}</span>
              <span className={`badge ${active ? 'badge-brand' : 'badge-amber'}`} style={{ fontSize: '0.7rem' }}>
                {done}/{total} Ready
              </span>
            </button>
          );
        })}
      </div>

      {/* Platform Status Banner */}
      <div style={{ background: 'rgba(3, 7, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: currentRules.logoColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
            {currentRules.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{currentRules.name} Onboarding Channel</span>
              {isCertified && (
                <span className="badge badge-emerald">
                  <ShieldCheck size={12} /> Certified Ready
                </span>
              )}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Fee Structure: <span style={{ color: '#E2E8F0', fontFamily: 'var(--font-mono)' }}>{currentRules.feeRate}</span>
            </div>
          </div>
        </div>

        {/* Progress Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Physical Readiness</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: progressPct >= 80 ? '#10B981' : '#F59E0B' }}>
              {progressPct}%
            </div>
          </div>
          <div style={{ width: '120px', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${progressPct}%`, 
                height: '100%', 
                background: progressPct >= 80 ? 'linear-gradient(90deg, #10B981, #059669)' : 'linear-gradient(90deg, #F59E0B, #D97706)',
                transition: 'width 400ms ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item)}
              style={{
                background: item.completed ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                border: item.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ paddingTop: '2px', color: item.completed ? '#10B981' : 'var(--text-muted)' }}>
                {item.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.975rem', textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                    {item.title}
                  </span>
                  <span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>
                    {item.category}
                  </span>
                  {item.mandatory ? (
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                      Mandatory
                    </span>
                  ) : (
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                      Recommended
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#FCD34D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Sparkles size={12} /> +{item.xpReward} XP
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                  {item.spec}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Specs Modal */}
      {showPrintModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '32px', background: '#0B0F19', border: '1px solid var(--border-medium)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>🖨️ Physical Packaging & Labeling Standards</h3>
              <button onClick={() => setShowPrintModal(false)} className="btn btn-ghost" style={{ padding: '6px 12px' }}>✕ Close</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: '#F8FAFC', display: 'block', marginBottom: '6px' }}>1. Polybag Warning Sticker Spec:</strong>
                Text required: "WARNING: To avoid danger of suffocation, keep this plastic bag away from babies and children." Minimum font size 10pt.
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: '#F8FAFC', display: 'block', marginBottom: '6px' }}>2. Barcode Label (FNSKU):</strong>
                Dimensions: 2" x 1" thermal transfer sticker. Must include Product Title, SKU (e.g. SG-KANJ-MRN-01), Condition (New), and EAN/FNSKU barcode.
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: '#F8FAFC', display: 'block', marginBottom: '6px' }}>3. Outer Carton Sealing:</strong>
                Use 2-inch wide pressure-sensitive plastic tape. Apply along all center seams and edge seams in an "H" shape.
              </div>
              <button 
                onClick={() => { alert("Packaging Spec Sheet sent to printer / PDF download started!"); setShowPrintModal(false); }}
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '10px' }}
              >
                Print / Save PDF Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
