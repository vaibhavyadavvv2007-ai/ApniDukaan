import React, { useState } from 'react';
import { QrCode, Copy, Check, Volume2, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import * as api from '../../services/api';

const CONFETTI_COLORS = ['#E8A33D', '#7BB88F'];

export default function PaytmPaymentHub({ shopProfile, t }) {
  const [amount, setAmount] = useState('4850');
  const [customerName, setCustomerName] = useState('Ananya Deshpande');
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [soundboxText, setSoundboxText] = useState('');
  const [paymentLink, setPaymentLink] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);

  const rawLink = paymentLink?.paymentLink || `https://paytm.me/dukaan/demo-ORD_${amount}`;
  const displayLink = rawLink.startsWith('[DEMO LINK]') ? rawLink : `[DEMO LINK] ${rawLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(rawLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePaymentLink = async () => {
    setIsGenerating(true);
    try {
      const result = await api.createPaytmPaymentLink({
        amount: Number(amount),
        customerName,
        orderId: `ORD_DEMO_${Date.now()}`,
        notes: `Demo Payment for ${shopProfile.shopName}`
      });
      setPaymentLink(result);
      setLinkGenerated(true);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: CONFETTI_COLORS });
    } catch (err) {
      console.warn('Paytm API fallback error:', err);
      setPaymentLink({
        paymentLink: `https://paytm.me/dukaan/demo-${amount}`,
        orderId: `ORD_DEMO_${Date.now()}`,
        status: 'STAGED/FALLBACK',
        classification: 'STAGED/FALLBACK (DEMO DATA)'
      });
      setLinkGenerated(true);
    }
    setIsGenerating(false);
  };

  const handleTriggerSoundbox = () => {
    setIsPlayingAudio(true);
    setSoundboxText(`"पेटीएम पर ₹${Number(amount).toLocaleString()} रुपये प्राप्त हुए! (Demo Soundbox Alert)"`);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 }, colors: [...CONFETTI_COLORS, '#F7F2EA'] });
    setTimeout(() => setIsPlayingAudio(false), 3000);
  };

  return (
    <div className="stack">
      {soundboxText && (
        <div className="surface" style={{ padding: 'var(--s4) var(--s5)', display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
          <Volume2 size={18} color="var(--accent)" />
          <div>
            <p className="eyebrow">Soundbox announcement (demo)</p>
            <p style={{ fontSize: '0.9375rem', marginTop: 2 }}>{soundboxText}</p>
          </div>
        </div>
      )}

      <div className="paytm-grid">
        {/* ---------- The counter QR: what a customer actually sees ---------- */}
        <section>
          <div className="section-head">
            <div>
              <h2>Counter QR standee</h2>
              <p className="meta" style={{ marginTop: 2 }}>Print this for the shop counter</p>
            </div>
            <button onClick={() => alert("Printing Demo Counter QR Standee (STAGED/FALLBACK Mode)...")} className="btn btn-secondary btn-sm">
              Print standee
            </button>
          </div>

          <div className="qr-panel">
            <div className="qr-frame">
              <div className="qr-mark">
                <QrCode size={112} />
                <span>Paytm UPI QR</span>
              </div>
              <span className="qr-demo">Demo</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{shopProfile.shopName}</p>
              <p className="mono meta" style={{ marginTop: 3 }}>PAYTM_MID_984521</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s3)', marginTop: 'var(--s4)' }}>
            <div className="surface" style={{ padding: 'var(--s4)' }}>
              <p className="eyebrow">Collected this month</p>
              <p className="metric-sm" style={{ marginTop: 4 }}>₹12,450</p>
            </div>
            <div className="surface" style={{ padding: 'var(--s4)' }}>
              <p className="eyebrow">Payments</p>
              <p className="metric-sm" style={{ marginTop: 4 }}>8</p>
            </div>
          </div>
        </section>

        {/* ---------- Link builder ---------- */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
          <div>
            <h2>Payment link for a customer far away</h2>
            <p className="meta" style={{ marginTop: 2, lineHeight: 1.5 }}>
              Send a link they can pay from any UPI app. Useful when someone orders over WhatsApp.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 'var(--s3)' }}>
            <div>
              <label className="eyebrow" htmlFor="cust" style={{ display: 'block', marginBottom: 6 }}>Customer</label>
              <input
                id="cust"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="eyebrow" htmlFor="amt" style={{ display: 'block', marginBottom: 6 }}>Amount</label>
              <input
                id="amt"
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setLinkGenerated(false); }}
                className="field mono"
              />
            </div>
          </div>

          <button onClick={handleGeneratePaymentLink} disabled={isGenerating || !amount} className="btn btn-primary">
            {isGenerating ? 'Building link' : 'Create payment link'}
          </button>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span className="eyebrow">Link</span>
              <span className="meta">Demo data only</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" readOnly value={displayLink} className="field mono" style={{ fontSize: '0.75rem' }} aria-label="Generated payment link" />
              <button onClick={handleCopyLink} className="btn btn-secondary" aria-label="Copy payment link">
                {copied ? <Check size={15} color="var(--ok)" /> : <Copy size={15} />}
              </button>
            </div>
          </div>

          {linkGenerated && (
            <p className="meta" style={{ color: 'var(--ok)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Check size={14} /> Link ready for {customerName}
            </p>
          )}

          <button onClick={handleTriggerSoundbox} disabled={isPlayingAudio} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
            <Volume2 size={14} /> {isPlayingAudio ? 'Playing' : 'Play a soundbox alert'}
          </button>

          {/* Honest status: one calm paragraph, not a banner of warning badges */}
          <div className="surface-sunken" style={{ padding: 'var(--s4)' }}>
            <p className="meta" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', lineHeight: 1.55 }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                Paytm has not issued test keys to this project, so payments here run in
                demo mode and no money moves. When keys become available, adding one
                environment variable switches real staging calls on without code changes.
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}