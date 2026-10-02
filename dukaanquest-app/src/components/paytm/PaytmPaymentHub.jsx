import React, { useState } from 'react';
import { 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Volume2, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Smartphone,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as api from '../../services/api';

export default function PaytmPaymentHub({ shopProfile, t }) {
  const [amount, setAmount] = useState('4850');
  const [customerName, setCustomerName] = useState('Ananya Deshpande');
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [soundboxText, setSoundboxText] = useState('');
  const [paymentLink, setPaymentLink] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);

  const generatedLink = paymentLink?.paymentLink || `https://paytm.me/dukaan/sg-matching-${amount}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePaymentLink = async () => {
    setIsGenerating(true);
    try {
      const result = await api.createPaytmPaymentLink({
        amount: Number(amount),
        customerName,
        orderId: `ORD_${Date.now()}`,
        notes: `Payment for ${shopProfile.shopName}`
      });

      setPaymentLink(result);
      setLinkGenerated(true);
      
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#00BAF2', '#10B981']
      });
    } catch (err) {
      console.warn('Paytm API error:', err);
      setPaymentLink({
        paymentLink: `https://paytm.me/dukaan/sg-matching-${amount}`,
        orderId: `ORD_${Date.now()}`,
        status: 'GENERATED'
      });
      setLinkGenerated(true);
    }
    setIsGenerating(false);
  };

  const handleTriggerSoundbox = () => {
    setIsPlayingAudio(true);
    setSoundboxText(`"पेटीएम पर ₹${Number(amount).toLocaleString()} रुपये प्राप्त हुए!"`);
    
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00BAF2', '#10B981', '#FFFFFF']
    });

    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3000);
  };

  return (
    <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 186, 242, 0.15)', border: '1px solid rgba(0, 186, 242, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00BAF2' }}>
              <CreditCard size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>Paytm FinTech & Soundbox Gateway</h2>
            <span className="badge badge-paytm">
              {paymentLink?.mode === 'live-staging' ? '🟢 Live Staging API' : '🟡 Staging Simulated (Paytm API v1)'}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px' }}>
            Seamless UPI QR payments, instant payment links for remote WhatsApp orders, and simulated real-time Paytm Soundbox voice alerts.
          </p>
        </div>

        <button 
          onClick={handleTriggerSoundbox} 
          disabled={isPlayingAudio}
          className="btn btn-paytm"
          style={{ fontSize: '0.85rem' }}
        >
          <Volume2 size={16} /> {isPlayingAudio ? 'Soundbox Playing...' : 'Test Soundbox Voice Alert'}
        </button>
      </div>

      {/* Voice Alert Announcement Banner */}
      {soundboxText && (
        <div style={{ background: 'rgba(0, 186, 242, 0.12)', border: '1px solid #00BAF2', borderRadius: 'var(--radius-md)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', animation: 'pulseGlow 2s infinite' }}>
          <Volume2 size={24} color="#00BAF2" />
          <div>
            <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase' }}>Paytm Soundbox 4.0 Audio Broadcast</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              {soundboxText}
            </div>
          </div>
        </div>
      )}

      {/* Payment Link & Dynamic QR Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left: Dynamic Link Builder */}
        <div style={{ background: 'rgba(3, 7, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} color="#00BAF2" /> Instant Remote UPI Link Generator
          </h3>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Customer Name / Reference
            </label>
            <input 
              type="text" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: '#FFFFFF' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Payment Amount (₹)
            </label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => { setAmount(e.target.value); setLinkGenerated(false); }}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
            />
          </div>

          {/* Generate Link Button */}
          <button
            onClick={handleGeneratePaymentLink}
            disabled={isGenerating || !amount}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {isGenerating ? (
              <><Zap size={16} className="animate-spin" /> Generating via Paytm API...</>
            ) : (
              <><CreditCard size={16} /> Generate Payment Link</>
            )}
          </button>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Generated Paytm Payment Link
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                readOnly 
                value={generatedLink} 
                style={{ flex: 1, background: 'rgba(0, 186, 242, 0.05)', border: '1px solid rgba(0, 186, 242, 0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
              />
              <button onClick={handleCopyLink} className="btn btn-secondary">
                {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {linkGenerated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6EE7B7', background: 'rgba(16, 185, 129, 0.08)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
              <CheckCircle2 size={16} />
              Payment link generated for {customerName} • ₹{Number(amount).toLocaleString()}
              {paymentLink?.orderId && <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>({paymentLink.orderId})</span>}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6EE7B7' }}>
            <ShieldCheck size={16} /> 0% Transaction MDR on UPI via Paytm All-in-One QR
          </div>
        </div>

        {/* Right: Counter UPI QR Card */}
        <div style={{ background: 'rgba(3, 7, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', maxWidth: '200px' }}>
            {/* Stylized QR Code Visual */}
            <div style={{ width: '168px', height: '168px', background: '#00BAF2', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', padding: '12px' }}>
              <QrCode size={110} color="#FFFFFF" />
              <span style={{ fontSize: '0.75rem', fontWeight: 900, marginTop: '4px', letterSpacing: '0.05em' }}>PAYTM UPI QR</span>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#F8FAFC' }}>
              Shree Ganesh Matching Centre
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Paytm Merchant ID: <code style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>PAYTM_MID_984521</code>
            </div>
          </div>

          {/* Transaction Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Today's UPI</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)' }}>₹12,450</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Transactions</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00BAF2', fontFamily: 'var(--font-mono)' }}>8</div>
            </div>
          </div>

          <button onClick={() => alert("Printing Counter QR Standee...")} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            Print Counter QR Standee
          </button>
        </div>

      </div>
    </div>
  );
}
