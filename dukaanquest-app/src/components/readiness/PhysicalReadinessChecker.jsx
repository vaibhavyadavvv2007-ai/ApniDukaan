import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  Printer, 
  Sparkles, 
  ExternalLink,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranslation } from '../../i18n/TranslationProvider';

const CONFETTI_COLORS = ['#E8A33D', '#F2C179', '#7BB88F'];

export default function PhysicalReadinessChecker({ 
  readinessRules, 
  onToggleTask, 
  t 
}) {
   const { tx } = useTranslation();
  const [selectedPlatform, setSelectedPlatform] = useState('amazon');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [scrapedData, setScrapedData] = useState(null);
  const [isScraping, setIsScraping] = useState(false);

  const currentRules = readinessRules[selectedPlatform];
  const items = currentRules.checklist;
  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const isCertified = items.filter(i => i.mandatory).every(i => i.completed);

  const handleLiveScrape = async (platform) => {
    setIsScraping(true);
    try {
      const target = platform || selectedPlatform;
      const res = await fetch(`/api/readiness/scrape?platform=${target}&category=apparel`);
      const data = await res.json();
      setScrapedData(data);
    } catch (err) {
      console.warn('Scrape failed, using local rules:', err);
    } finally {
      setIsScraping(false);
    }
  };

  const handleToggle = (item) => {
    const nextCompleted = !item.completed;
    onToggleTask(selectedPlatform, item.id, nextCompleted, item.xpReward);
    if (nextCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: CONFETTI_COLORS
      });
    }
  };

  return (
    <div className="stack">
      {/* Platform switcher: segmented, quiet */}
      <div className="segmented" role="tablist" aria-label={tx('Marketplace')}>
        {Object.entries(readinessRules).map(([key, data]) => {
          const active = selectedPlatform === key;
          const done = data.checklist.filter(i => i.completed).length;
          const total = data.checklist.length;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedPlatform(key)}
              className={`segment${active ? ' segment-active' : ''}`}
            >
              {data.name}
              <span className="mono segment-count">{done}/{total}</span>
            </button>
          );
        })}
      </div>

      {/* Progress: the leading fact for this screen */}
      <section className="surface" style={{ padding: 'var(--s5)', display: 'flex', flexWrap: 'wrap', gap: 'var(--s5)', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s4)', minWidth: 0 }}>
          <div
            aria-hidden="true"
            style={{
              width: 42, height: 42, borderRadius: 'var(--r-sm)',
              background: currentRules.logoColor, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: '1.0625rem', flexShrink: 0
            }}
          >
            {currentRules.name.charAt(0)}
          </div>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: '1.0625rem' }}>{t.physicalTitle}</h2>
            <p className="meta" style={{ marginTop: 3 }}>
              {t.physicalSubtitle}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s5)', flexWrap: 'wrap' }}>
          <div>
            <p className="eyebrow">{currentRules.name} takes</p>
            <p className="mono" style={{ fontSize: '1rem', marginTop: 2 }}>{currentRules.feeRate}</p>
          </div>
          <div style={{ minWidth: 150 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
              <span className="eyebrow">{tx('Ready')}</span>
              <span className="mono" style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{progressPct}%</span>
            </div>
            <div className="track" style={{ height: 5 }}>
              <div className="track-fill" style={{ transform: `scaleX(${progressPct / 100})` }} />
            </div>
            {isCertified && (
              <p className="meta" style={{ marginTop: 7, color: 'var(--ok)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <ShieldCheck size={13} />{tx('All mandatory steps done')}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => handleLiveScrape(selectedPlatform)}
              disabled={isScraping}
              className="btn btn-secondary btn-sm"
            >
              <Sparkles size={14} /> {isScraping ? 'Reading specs...' : 'Check live marketplace specs'}
            </button>
            <button onClick={() => setShowPrintModal(true)} className="btn btn-quiet btn-sm">
              <Printer size={14} />{tx('Print checklist')}</button>
          </div>
        </div>
      </section>

      {/* Scraped specs, folded away until asked for */}
      {scrapedData && (
        <div className="surface-sunken" style={{ padding: 'var(--s4) var(--s5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: '0.9375rem' }}>
                {scrapedData.platform} requirements for {scrapedData.category}
              </h3>
              <a
                href={scrapedData.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="meta"
                style={{ color: 'var(--accent-soft)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 3 }}
              >{tx('View source')}<ExternalLink size={11} />
              </a>
            </div>
            <button onClick={() => setScrapedData(null)} className="btn btn-quiet btn-sm" aria-label={tx('Dismiss')}>
              <X size={14} />
            </button>
          </div>
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px 20px', listStyle: 'none', padding: 0 }}>
            {scrapedData.specs?.map((spec, i) => (
              <li key={i} className="meta" style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--accent)' }}>·</span>{spec}
              </li>
            ))}
          </ul>
          {scrapedData.returnsProtocol && (
            <p className="meta" style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line-faint)' }}>
              <strong style={{ color: 'var(--text-2)', fontWeight: 500 }}>{tx('Returns')}</strong> {scrapedData.returnsProtocol}
            </p>
          )}
        </div>
      )}

      {/* The checklist is the work. Give it room. */}
      <section>
        <div className="section-head">
          <h2>{currentRules.name} requirements</h2>
          <span className="meta mono">{completedCount} of {totalCount} done</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleToggle(item)}
              className="row row-interactive"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: 'var(--r-md)',
                paddingTop: 14,
                paddingBottom: 14,
                background: item.completed ? 'transparent' : 'var(--ink-800)',
                opacity: item.completed ? 0.6 : 1
              }}
            >
              <span style={{ color: item.completed ? 'var(--ok)' : 'var(--text-3)', flexShrink: 0 }}>
                {item.completed ? <CheckCircle2 size={17} /> : <Circle size={17} />}
              </span>

              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.9375rem', fontWeight: 500,
                    color: item.completed ? 'var(--text-3)' : 'var(--text)',
                    textDecoration: item.completed ? 'line-through' : 'none'
                  }}>
                    {item.title}
                  </span>
                  {item.mandatory && <span className="pill pill-warn">{tx('Required')}</span>}
                </span>
                <span className="meta" style={{ display: 'block', marginTop: 3, lineHeight: 1.45 }}>
                  {item.spec}
                </span>
              </span>

              <span className="mono meta" style={{ flexShrink: 0 }}>+{item.xpReward} XP</span>
            </button>
          ))}
        </div>
      </section>

      {/* Print guide */}
      {showPrintModal && (
        <div className="modal-scrim" onClick={() => setShowPrintModal(false)}>
          <div
            className="surface"
            role="dialog"
            aria-modal="true"
            aria-label={tx('Packaging and labeling standards')}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 560, width: '100%', padding: 'var(--s5)', maxHeight: '85vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s4)' }}>
              <h2 style={{ fontSize: '1.0625rem' }}>{tx('Packaging and labeling standards')}</h2>
              <button onClick={() => setShowPrintModal(false)} className="btn btn-quiet btn-sm" aria-label={tx('Close')}>
                <X size={15} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
              <div>
                <p style={{ fontWeight: 500, marginBottom: 3 }}>{tx('Polybag warning sticker')}</p>
                <p className="meta">"WARNING: To avoid danger of suffocation, keep this plastic bag away from babies and children." Minimum 10pt.</p>
              </div>
              <div>
                <p style={{ fontWeight: 500, marginBottom: 3 }}>{tx('Barcode label (FNSKU)')}</p>
                <p className="meta">{tx('2 × 1 inch thermal sticker carrying product title, SKU, condition, and barcode.')}</p>
              </div>
              <div>
                <p style={{ fontWeight: 500, marginBottom: 3 }}>{tx('Outer carton sealing')}</p>
                <p className="meta">{tx('2 inch pressure-sensitive tape along all centre and edge seams in an H pattern.')}</p>
              </div>
              <button
                onClick={() => { alert("Packaging Spec Sheet sent to printer / PDF download started!"); setShowPrintModal(false); }}
                className="btn btn-primary"
              >{tx('Print or save as PDF')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}