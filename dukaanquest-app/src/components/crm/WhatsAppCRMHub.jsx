import React, { useState, useEffect } from 'react';
import { Send, ArrowRight, ShieldCheck, X, Workflow, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import * as api from '../../services/api';
import { apiUrl } from '../../services/api';
import { useTranslation } from '../../i18n/TranslationProvider';

const CONFETTI_COLORS = ['#E8A33D', '#F2C179', '#7BB88F'];

export default function WhatsAppCRMHub({ 
  customers, 
  onDispatchCampaign, 
  currentLanguage, 
  t,
  onNavigateToSimulator
}) {
   const { tx } = useTranslation();
  const [selectedTag, setSelectedTag] = useState('All');
  const [discountPct, setDiscountPct] = useState(15);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);
  const [dispatchFailed, setDispatchFailed] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [sarvamTranslatedPreview, setSarvamTranslatedPreview] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [n8nWorkflow, setN8nWorkflow] = useState(null);
  const [templateConfig, setTemplateConfig] = useState({
    activeTemplate: 'dukaanquest_new_arrival',
    language: 'en',
    category: 'MARKETING',
    role: 'APPROVED_MARKETING_TEMPLATE',
    isTestTemplate: false,
    metaReviewStatus: 'APPROVED',
    bodyParameterOrder: ['customerName', 'collectionName', 'shopName', 'discount'],
    technicalTestTemplate: 'hello_world'
  });

  const filteredCustomers = selectedTag === 'All' 
    ? customers 
    : customers.filter(c => c.tags.some(t => t.toLowerCase().includes(selectedTag.toLowerCase())));

  useEffect(() => {
    api.fetchN8NWorkflow().then(wf => setN8nWorkflow(wf)).catch(() => {});
    api.fetchWhatsAppTemplateStatus().then(cfg => {
      if (cfg) setTemplateConfig(cfg);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (currentLanguage === 'en') {
      setSarvamTranslatedPreview('');
      return;
    }
    setIsTranslating(true);
    const baseText = `Namaste! Ramesh-ji from Shree Ganesh Matching Centre here. Our new Festive Kanjeevaram Silk collection has just arrived from weavers. Exclusive ${discountPct}% VIP discount for you! Book via Paytm.`;
    api.translateWithSarvam(baseText, currentLanguage)
      .then(result => {
        if (result?.translatedText) setSarvamTranslatedPreview(result.translatedText);
        setIsTranslating(false);
      })
      .catch(() => setIsTranslating(false));
  }, [currentLanguage, discountPct]);

  const messagePreviews = {
    en: `Namaste {{name}}! Ramesh-ji from Shree Ganesh Matching Centre here. Our new Festive Kanjeevaram Silk collection has just arrived from weavers. Since you are our valued customer, enjoy an exclusive ${discountPct}% VIP discount! Reserve online or pay via Paytm: https://paytm.me/dukaan/sg-${discountPct}`,
    hi: `नमस्ते {{name}} जी! श्री गणेश मैचिंग सेंटर से रमेश जी का प्रणाम। हमारी नई उत्सव कांजीवरम सिल्क साड़ियों का संग्रह सीधे बुनकरों से आ गया है। आपके लिए विशेष ${discountPct}% वीआईपी छूट मान्य है! पेटीएम द्वारा सुरक्षित बुक करें: https://paytm.me/dukaan/sg-${discountPct}`,
    kn: `ನಮಸ್ಕಾರ {{name}} ಅವರೇ! ಶ್ರೀ ಗಣೇಶ್ ಮ್ಯಾಚಿಂಗ್ ಸೆಂಟರ್‌ನಿಂದ ರಮೇಶ್ ಅವರ ವಂದನೆಗಳು. ನೇಕಾರರಿಂದ ನೇರವಾಗಿ ತರಿಸಲಾದ ಹೊಸ ಕಾಂಜೀವರಂ ಸೀರೆಗಳ ಕಲೆಕ್ಷನ್ ಬಂದಿದೆ. ನಿಮಗಾಗಿ ವಿಶೇಷ ${discountPct}% ವಿಐಪಿ ರಿಯಾಯಿತಿ! ಪೇಟಿಎಂ ಮೂಲಕ ಕಾಯ್ದಿರಿಸಿ: https://paytm.me/dukaan/sg-${discountPct}`,
    ta: `வணக்கம் {{name}} அவர்களே! ஸ்ரீ கணேஷ் மேட்சிங் சென்டரிலிருந்து ரமேஷ் பேசுகிறேன். நெசவாளர்களிடமிருந்து புதிய காஞ்சிவரம் பட்டு சேலைகள் வந்துள்ளன. உங்களுக்கு சிறப்பு ${discountPct}% விஐபி தள்ளுபடி! பேடிஎம் மூலம் முன்பதிவு செய்யுங்கள்: https://paytm.me/dukaan/sg-${discountPct}`
  };

  const currentPreview = sarvamTranslatedPreview || messagePreviews[currentLanguage] || messagePreviews.en;

  const LANG_NAMES = { en: 'English', hi: 'Hindi', kn: 'Kannada', ta: 'Tamil' };

  const handleConfirmApproval = async () => {
    setShowApprovalModal(false);
    setIsDispatching(true);
    setDispatchFailed(false);
    try {
      const result = await api.dispatchCampaign({
        campaignId: `CAMP_${Date.now()}`,
        recipients: filteredCustomers.map(c => ({
          name: c.name,
          phone: c.phone,
          language: c.language,
          tags: c.tags,
          marketingOptIn: c.marketingOptIn !== false
        })),
        templateText: currentPreview,
        paymentLink: `https://paytm.me/dukaan/sg-${discountPct}`,
        merchantApproved: true,
        campaign: {
          collectionName: 'Festive Kanjeevaram Silk',
          shopName: 'Shree Ganesh Matching & Saree Centre',
          discount: `${discountPct}%`
        }
      });
      setDispatchResult(result);
      setDeliveryStatus(null);
      if (result?.templateConfig) setTemplateConfig(result.templateConfig);
      setIsDispatching(false);
      // Only celebrate an actual confirmed send; a rejected or unreachable
      // send must not be dressed up as a success.
      if (result?.liveDeliveryConfirmed) {
        setDispatchedSuccess(true);
        onDispatchCampaign(filteredCustomers.length);
        confetti({ particleCount: 50, spread: 80, origin: { y: 0.7 }, colors: CONFETTI_COLORS });
      } else {
        setDispatchFailed(true);
      }
    } catch (err) {
      console.warn('CRM dispatch error:', err);
      setIsDispatching(false);
      setDispatchFailed(true);
      setDeliveryStatus(null);
      setDispatchResult({
        workflow: 'DukaanQuest-WhatsApp-CRM-v1',
        dispatchedCount: filteredCustomers.length,
        liveDeliveryConfirmed: false,
        mode: 'staged-fallback',
        dispatchedToLiveInstance: false,
        errorDetail: err?.message || 'Could not reach the campaign service.'
      });
    }
  };

  // A wamid only means Meta ACCEPTED the message. Poll the status endpoint so the
  // panel reflects what Meta actually decided (delivered / failed 131049, etc.)
  // instead of reporting an unverified "Delivered".
  useEffect(() => {
    const messageId = dispatchResult?.whatsappMessageId;
    if (!messageId) return undefined;

    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(apiUrl(`/whatsapp/status/${encodeURIComponent(messageId)}`));
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setDeliveryStatus(data);
      } catch (err) {
        // Status endpoint unreachable: keep waiting silently.
      }
    };

    poll();
    const timer = setInterval(poll, 4000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [dispatchResult?.whatsappMessageId]);

  const deliveryLabel = (() => {
    if (!dispatchResult) return tx('Preview');
    if (!dispatchResult.liveDeliveryConfirmed) return tx('Not sent');
    const status = deliveryStatus?.status;
    if (!deliveryStatus?.known || !status) return tx('Accepted by Meta');
    if (status === 'delivered' || status === 'read') return tx('Delivered');
    if (status === 'sent') return tx('Sent');
    if (status === 'failed') return tx('Delivery failed');
    return tx('Accepted by Meta');
  })();

  return (
    <div className="stack">
      <div className="crm-grid">
        {/* ---------- What the customer sees ---------- */}
        <section>
          <div className="section-head">
            <div>
              <h2>{tx('Message preview')}</h2>
              <p className="meta" style={{ marginTop: 2 }}>
                Sent in {LANG_NAMES[currentLanguage]}{isTranslating ? ', translating' : ''}
              </p>
            </div>
          </div>

          <div className="wa-bubble">
            <p className="wa-sender">{tx('Shree Ganesh Matching Centre')}</p>
            <p className="wa-body">{currentPreview.replace('{{name}}', 'Ananya')}</p>
            <div className="wa-foot">
              <span>{tx('Includes a Paytm payment link')}</span>
              <span className="wa-ticks">{deliveryLabel}</span>
            </div>
          </div>

          {dispatchedSuccess && (
            <div className="surface" style={{ marginTop: 'var(--s4)', padding: 'var(--s4)' }}>
              <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                Message sent to {dispatchResult?.dispatchedCount || filteredCustomers.length} customers
              </p>
              <p className="meta" style={{ marginTop: 4 }}>
                {dispatchResult?.liveDeliveryConfirmed
                  ? 'Meta accepted the send through the live n8n workflow and Cloud API.'
                  : 'Ran through the staged workflow. No live send was made.'}
              </p>
              {dispatchResult?.liveDeliveryConfirmed && (
                <p className="meta" style={{ marginTop: 6 }}>
                  {deliveryStatus?.known
                    ? (deliveryStatus.status === 'failed'
                      ? `Meta delivery status: failed${deliveryStatus.errorCode ? ` (error ${deliveryStatus.errorCode})` : ''}. ${deliveryStatus.errorTitle || ''}`
                      : `Meta delivery status: ${deliveryStatus.status}.`)
                    : 'Awaiting Meta delivery confirmation on the status webhook. A message ID alone does not guarantee delivery.'}
                </p>
              )}
              {deliveryStatus?.status === 'failed' && deliveryStatus?.errorCode === 131049 && (
                <p className="meta" style={{ marginTop: 6 }}>
                  {tx('This is Meta’s engagement filter, not a campaign bug. It suppresses marketing-template sends to recipients with no prior engagement with the business. A UTILITY template such as hello_world passes the same filter, which is why a connectivity test can succeed while a real campaign is held back.')}
                </p>
              )}
              {dispatchResult?.templateConfig?.activeTemplate && (
                <p className="mono meta" style={{ marginTop: 6 }}>
                  Template {dispatchResult.templateConfig.activeTemplate} ({dispatchResult.templateConfig.language})
                </p>
              )}
              {dispatchResult?.whatsappMessageId && (
                <p className="mono meta" style={{ marginTop: 6 }}>
                  Message id {dispatchResult.whatsappMessageId}
                </p>
              )}
              {onNavigateToSimulator && (
                <button onClick={onNavigateToSimulator} className="btn btn-primary btn-sm" style={{ marginTop: 'var(--s4)' }}>{tx('See what this earns you')}<ArrowRight size={14} />
                </button>
              )}
            </div>
          )}

          {dispatchFailed && (
            <div className="surface" style={{ marginTop: 'var(--s4)', padding: 'var(--s4)', borderLeft: '3px solid var(--stop)' }}>
              <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--stop)' }}>{tx('Campaign was not delivered')}</p>
              <p className="meta" style={{ marginTop: 4 }}>
                {dispatchResult?.externalStatusDetail
                  || dispatchResult?.metaRejection?.hint
                  || dispatchResult?.errorDetail
                  || tx('The send could not be confirmed by Meta WhatsApp.')}
              </p>
              {deliveryStatus?.status === 'failed' && (
                <p className="meta" style={{ marginTop: 6, color: 'var(--stop)' }}>
                  {tx('Meta reported this message as failed on delivery.')}{' '}
                  {deliveryStatus.errorTitle}
                  {deliveryStatus.errorCode ? ` (Meta error ${deliveryStatus.errorCode})` : ''}
                </p>
              )}
              {dispatchResult?.metaRejection?.code && (
                <p className="mono meta" style={{ marginTop: 6 }}>
                  Meta error {dispatchResult.metaRejection.code}
                  {dispatchResult.metaRejection.subcode ? ` / ${dispatchResult.metaRejection.subcode}` : ''}
                </p>
              )}
              <p className="meta" style={{ marginTop: 6 }}>{tx('No message was sent with a different template. Fix the issue above and send again.')}</p>
            </div>
          )}
        </section>

        {/* ---------- Controls ---------- */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s5)' }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 10 }}>{tx('Who receives it')}</p>
            <div className="segmented">
              {['All', 'VIP', 'Inactive', 'Regular'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`segment${selectedTag === tag ? ' segment-active' : ''}`}
                >
                  {tag === 'All' ? 'Everyone' : tag === 'VIP' ? 'VIP' : tag === 'Inactive' ? 'Gone quiet' : 'Regular'}
                </button>
              ))}
            </div>
            <p className="meta" style={{ marginTop: 8 }}>
              {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'} in this group, all opted in
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <p className="eyebrow">{tx('Discount offered')}</p>
              <span className="mono" style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{discountPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value))}
              aria-label={tx('VIP discount percentage')}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>

          <div>
            <p className="eyebrow" style={{ marginBottom: 10 }}>{tx('Recipients')}</p>
            <div className="recipient-list">
              {filteredCustomers.map(c => (
                <div key={c.id} className="row recipient-row">
                  <span className="recipient-name">{c.name}</span>
                  <span className="mono meta">{c.language?.toUpperCase()}</span>
                </div>
              ))}
            </div>
            {filteredCustomers.length > 4 && (
              <p className="recipient-more">Scroll for all {filteredCustomers.length} recipients</p>
            )}
          </div>

          <button
            onClick={() => setShowApprovalModal(true)}
            disabled={isDispatching || filteredCustomers.length === 0}
            className="btn btn-primary"
          >
            {isDispatching ? 'Sending' : `Send to ${filteredCustomers.length} customers`}
            <Send size={15} />
          </button>

          {/* Honest technical status: present, but not shouting */}
          <details className="model-notes">
            <summary>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <Workflow size={13} />{tx('How this is delivered')}</span>
              <ChevronDown size={14} />
            </summary>
            <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p className="meta">
                Segmentation, consent check, translation and delivery run in an n8n workflow
                {n8nWorkflow ? ` (${n8nWorkflow.nodes?.length || 5} steps)` : ''}.
              </p>
              <p className="meta">
                {templateConfig.isTestTemplate ? (
                  <>
                    <span className="pill pill-warn" style={{ marginRight: 8 }}>{tx('Utility template')}</span>
                    {tx('This message will be sent using the Meta-approved WhatsApp template')}{' '}
                    <span className="mono">{templateConfig.activeTemplate}</span> ({templateConfig.language}).
                  </>
                ) : (
                  <>
                    <span className="pill pill-ok" style={{ marginRight: 8 }}>{tx('Approved marketing template')}</span>
                    {tx('This message will be sent using the Meta-approved WhatsApp template')}{' '}
                    <span className="mono">{templateConfig.activeTemplate}</span> ({templateConfig.language}).
                  </>
                )}
              </p>
              {templateConfig.isTestTemplate ? (
                <p className="meta">
                  {tx('This template declares no variables, so the message carries no customer name, collection, shop name or discount. It is active because Meta’s engagement filter (delivery error 131049) suppresses marketing-template sends to recipients with no prior engagement, while utility templates pass that filter. To restore personalization, submit a utility-category template declaring the four campaign variables and await Meta approval.')}
                </p>
              ) : (
                <p className="meta">
                  <span className="pill pill-quiet" style={{ marginRight: 8 }}>{tx('Technical test')}</span>
                  <span className="mono">{templateConfig.technicalTestTemplate}</span> stays available for connectivity
                  checks only, and is never used for merchant campaigns.
                </p>
              )}
              <p className="meta">
                <span className="pill pill-quiet" style={{ marginRight: 8 }}>{tx('Consent')}</span>{tx('Only customers with opt-in on record are included, per the DPDP Act 2023.')}</p>
            </div>
          </details>
        </section>
      </div>

      {/* Merchant approval, before anything leaves the shop */}
      {showApprovalModal && (
        <div className="modal-scrim" onClick={() => setShowApprovalModal(false)}>
          <div
            className="surface"
            role="dialog"
            aria-modal="true"
            aria-label={tx('Confirm sending the campaign')}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 460, width: '100%', padding: 'var(--s5)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 'var(--s4)' }}>
              <div>
                <h2 style={{ fontSize: '1.0625rem' }}>{tx('Send this message?')}</h2>
                <p className="meta" style={{ marginTop: 3 }}>
                  {filteredCustomers.length} customers who opted in
                </p>
              </div>
              <button onClick={() => setShowApprovalModal(false)} className="btn btn-quiet btn-sm" aria-label={tx('Close')}>
                <X size={15} />
              </button>
            </div>

            <p className="meta" style={{ lineHeight: 1.6, marginBottom: 'var(--s4)' }}>
              The message goes out over WhatsApp with a Paytm payment link, offering {discountPct}% off.
              Every recipient can reply STOP to unsubscribe.
            </p>

            <p className="meta" style={{ display: 'flex', gap: 7, alignItems: 'center', color: 'var(--ok)' }}>
              <ShieldCheck size={14} /> Consent is recorded for all {filteredCustomers.length} recipients
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 'var(--s5)' }}>
              <button onClick={() => setShowApprovalModal(false)} className="btn btn-secondary">{tx('Cancel')}</button>
              <button onClick={handleConfirmApproval} className="btn btn-primary">{tx('Send it')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}