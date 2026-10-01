import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Workflow, 
  Sparkles, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  Zap,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WhatsAppCRMHub({ 
  customers, 
  onDispatchCampaign, 
  currentLanguage, 
  t 
}) {
  const [selectedTag, setSelectedTag] = useState('All');
  const [campaignTitle, setCampaignTitle] = useState('Festive Kanjeevaram Saree Launch');
  const [discountPct, setDiscountPct] = useState(15);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Filter customers
  const filteredCustomers = selectedTag === 'All' 
    ? customers 
    : customers.filter(c => c.tags.some(t => t.toLowerCase().includes(selectedTag.toLowerCase())));

  // Localized templates based on Sarvam AI
  const messagePreviews = {
    en: `Namaste {{name}}! Ramesh-ji from Shree Ganesh Matching Centre here. Our new Festive Kanjeevaram Silk collection has just arrived from weavers. Since you are our valued customer, enjoy an exclusive ${discountPct}% VIP discount! Reserve online or pay via Paytm: https://paytm.me/dukaan/sg-${discountPct}`,
    hi: `नमस्ते {{name}} जी! श्री गणेश मैचिंग सेंटर से रमेश जी का प्रणाम। हमारी नई उत्सव कांजीवरम सिल्क साड़ियों का संग्रह सीधे बुनकरों से आ गया है। आपके लिए विशेष ${discountPct}% वीआईपी छूट मान्य है! पेटीएम द्वारा सुरक्षित बुक करें: https://paytm.me/dukaan/sg-${discountPct}`,
    kn: `ನಮಸ್ಕಾರ {{name}} ಅವರೇ! ಶ್ರೀ ಗಣೇಶ್ ಮ್ಯಾಚಿಂಗ್ ಸೆಂಟರ್‌ನಿಂದ ರಮೇಶ್ ಅವರ ವಂದನೆಗಳು. ನೇಕಾರರಿಂದ ನೇರವಾಗಿ ತರಿಸಲಾದ ಹೊಸ ಕಾಂಜೀವರಂ ಸೀರೆಗಳ ಕಲೆಕ್ಷನ್ ಬಂದಿದೆ. ನಿಮಗಾಗಿ ವಿಶೇಷ ${discountPct}% ವಿಐಪಿ ರಿಯಾಯಿತಿ! ಪೇಟಿಎಂ ಮೂಲಕ ಕಾಯ್ದಿರಿಸಿ: https://paytm.me/dukaan/sg-${discountPct}`,
    ta: `வணக்கம் {{name}} அவர்களே! ஸ்ரீ கணேஷ் மேட்சிங் சென்டரிலிருந்து ரமேஷ் பேசுகிறேன். நெசவாளர்களிடமிருந்து புதிய காஞ்சிவரம் பட்டு சேலைகள் வந்துள்ளன. உங்களுக்கு சிறப்பு ${discountPct}% விஐபி தள்ளுபடி! பேடிஎம் மூலம் முன்பதிவு செய்யுங்கள்: https://paytm.me/dukaan/sg-${discountPct}`
  };

  const currentPreview = messagePreviews[currentLanguage] || messagePreviews.en;

  const handleConfirmApproval = () => {
    setShowApprovalModal(false);
    setIsDispatching(true);

    setTimeout(() => {
      setIsDispatching(false);
      setDispatchedSuccess(true);
      onDispatchCampaign(filteredCustomers.length);
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#00BAF2', '#10B981', '#6366F1']
      });
    }, 2000);
  };

  return (
    <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 186, 242, 0.15)', border: '1px solid rgba(0, 186, 242, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00BAF2' }}>
              <MessageSquare size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>{t.crmTitle}</h2>
            <span className="badge badge-paytm">n8n Sponsor Engine</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px' }}>
            {t.crmSubtitle}
          </p>
        </div>

        <button 
          onClick={() => setShowApprovalModal(true)} 
          disabled={isDispatching || filteredCustomers.length === 0}
          className="btn btn-paytm"
        >
          {isDispatching ? (
            <>
              <Zap size={16} className="animate-spin" /> Dispatching via n8n...
            </>
          ) : (
            <>
              <Send size={16} /> Broadcast to {filteredCustomers.length} Customers
            </>
          )}
        </button>
      </div>

      {/* n8n Live Visual Workflow Graph */}
      <div style={{ background: 'rgba(3, 7, 18, 0.75)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Workflow size={16} /> n8n Orchestration Pipeline (Active Trigger)
          </span>
          <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Webhook Live</span>
        </div>

        {/* Workflow Diagram Nodes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
          
          {/* Node 1 */}
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #38BDF8', borderRadius: '10px', padding: '10px 14px', minWidth: '140px' }}>
            <div style={{ fontSize: '0.7rem', color: '#38BDF8', fontWeight: 600 }}>TRIGGER</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Customer Tag QR</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Shop Walk-in</div>
          </div>

          <ArrowRight size={16} color="rgba(255,255,255,0.3)" />

          {/* Node 2 */}
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #F59E0B', borderRadius: '10px', padding: '10px 14px', minWidth: '150px' }}>
            <div style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 600 }}>FILTER & SEGMENT</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Tag: {selectedTag}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{filteredCustomers.length} Audiences</div>
          </div>

          <ArrowRight size={16} color="rgba(255,255,255,0.3)" />

          {/* Node 3 */}
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #8B5CF6', borderRadius: '10px', padding: '10px 14px', minWidth: '150px' }}>
            <div style={{ fontSize: '0.7rem', color: '#8B5CF6', fontWeight: 600 }}>SARVAM AI Indic</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Language: {currentLanguage.toUpperCase()}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Vernacular Tokenizer</div>
          </div>

          <ArrowRight size={16} color="rgba(255,255,255,0.3)" />

          {/* Node 4 */}
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #00BAF2', borderRadius: '10px', padding: '10px 14px', minWidth: '150px' }}>
            <div style={{ fontSize: '0.7rem', color: '#00BAF2', fontWeight: 600 }}>PAYTM API</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Instant Payment Link</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dynamic UPI QR</div>
          </div>

          <ArrowRight size={16} color="rgba(255,255,255,0.3)" />

          {/* Node 5 */}
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #10B981', borderRadius: '10px', padding: '10px 14px', minWidth: '150px' }}>
            <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>WHATSAPP CLOUD</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Cloud API Dispatch</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Direct Notification</div>
          </div>

        </div>
      </div>

      {/* Main Campaign Builder Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left: Audience & Parameters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Select Customer Segment
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['All', 'VIP', 'Inactive', 'Regular'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    background: selectedTag === tag ? 'rgba(0, 186, 242, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: selectedTag === tag ? '1px solid #00BAF2' : '1px solid var(--border-subtle)',
                    color: selectedTag === tag ? '#7DD3FC' : 'var(--text-secondary)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {tag === 'All' ? 'All Customers (184)' : tag === 'VIP' ? 'VIP & Bridal (42)' : tag === 'Inactive' ? 'Inactive >30d (38)' : 'Regular (104)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              VIP Discount Offer (%)
            </label>
            <input 
              type="range" 
              min="5" 
              max="30" 
              step="5" 
              value={discountPct} 
              onChange={(e) => setDiscountPct(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#00BAF2' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>5%</span>
              <strong style={{ color: '#00BAF2', fontSize: '1rem' }}>{discountPct}% OFF</strong>
              <span>30%</span>
            </div>
          </div>

          {/* Sample Recipients List */}
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Target Customers in this Segment ({filteredCustomers.length})
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
              {filteredCustomers.map(cust => (
                <div key={cust.id} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div>
                    <strong style={{ color: '#F8FAFC' }}>{cust.name}</strong>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>{cust.phone}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {cust.tags.map(t => (
                      <span key={t} className="badge badge-brand" style={{ fontSize: '0.65rem' }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live WhatsApp Phone Preview */}
        <div style={{ background: 'rgba(3, 7, 18, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} /> WhatsApp Live Message Preview
            </span>
            <span className="badge badge-brand">Sarvam Translation</span>
          </div>

          {/* WhatsApp Chat Bubble */}
          <div style={{ background: '#075E54', borderRadius: '16px', padding: '18px', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(0,0,0,0.4)', position: 'relative' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '6px' }}>Shree Ganesh Matching Centre • Official Business</div>
            <div style={{ fontSize: '0.925rem', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              {currentPreview.replace('{{name}}', 'Ananya')}
            </div>
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>⚡ Paytm UPI Instant Link</span>
              <span style={{ fontSize: '0.75rem', color: '#6EE7B7', fontWeight: 600 }}>✓✓ Delivered</span>
            </div>
          </div>

          {dispatchedSuccess && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={24} color="#10B981" />
              <div>
                <strong style={{ color: '#10B981', display: 'block', fontSize: '0.9rem' }}>Campaign Dispatched Successfully!</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Sent to {filteredCustomers.length} numbers via n8n automation pipeline.</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Human Approval Modal (Required by Tenets) */}
      {showApprovalModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '520px', width: '100%', padding: '28px', background: '#0B0F19', border: '1px solid var(--border-medium)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Merchant Approval Required</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Human-in-the-Loop Principle</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
              Are you sure you want to broadcast this campaign to <strong>{filteredCustomers.length} customers</strong>? Each customer will receive a WhatsApp message with an instant Paytm checkout link.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowApprovalModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmApproval} className="btn btn-paytm">
                Yes, Authorize Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
