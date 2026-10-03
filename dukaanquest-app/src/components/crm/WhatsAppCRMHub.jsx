import { useState } from 'react';
import { MessageSquare, Download, Check, ArrowRight, Languages } from 'lucide-react';
import * as api from '../../services/api';
import { money, downloadFile, checks } from '../../services/draft';
export default function WhatsAppCRMHub({ draft, customers, setDraft, health }) {
    const tag = draft.campaign?.tag || 'All';
    const discount = draft.campaign?.discount ?? 10;
    const editCampaign = patch => setDraft(d => ({ ...d, campaign: { ...d.campaign, ...patch }, campaignPrepared: false }));
    const setTag = tag => editCampaign({ tag });
    const setDiscount = discount => editCampaign({ discount });
    const translation = draft.campaign?.translation || null;
    const setTranslation = value => setDraft(d => ({ ...d, campaign: { ...d.campaign, translation: value }, campaignPrepared: false }));
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState('');
    const [delivery, setDelivery] = useState(null);
    const [sending, setSending] = useState(false);
    const currentLanguage = draft.campaign?.language || 'en';
    const setLanguage = language => editCampaign({ language });
    const recipients = customers.filter(c => c.marketingOptIn === true && (tag === 'All' || c.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))));
    const price = Number(draft.price) || 0;
    const offer = price * (1 - discount / 100);
    const base = `Namaste {{name}}! ${draft.brand || 'Our shop'} has something for you: ${draft.title || 'our latest collection'}. Enjoy ${discount}% off — now ${money(offer)}. Reply to check availability or reserve yours. Reply STOP to opt out.`;
    const key = base + currentLanguage;
    const preview = currentLanguage !== 'en' && translation?.key === key ? translation.text : base;
    const translated = currentLanguage === 'en' || translation?.key === key;
    const ready = checks(draft).every(c => c.valid) && draft.reviewed;
    const translate = async () => { setBusy(true); setNotice(''); try {
        const r = await api.translateWithSarvam(base, currentLanguage);
        if (!r?.translatedText || r.liveAPI !== true)
            throw Error('Live translation is unavailable. Showing the English draft; no regional-language delivery is claimed.');
        setTranslation({ key, text: r.translatedText });
    }
    catch (e) {
        setNotice(e.message);
    }
    finally {
        setBusy(false);
    } };
    const save = () => { downloadFile('customer-campaign.txt', `CAMPAIGN DRAFT — NOT SENT\nProduct: ${draft.title}\nAudience: ${tag} (${recipients.length} opted-in records)\nLanguage: ${currentLanguage}\n\n${preview}`); setDraft(d => ({ ...d, campaignPrepared: true })); setNotice('Campaign draft downloaded. No customer messages were sent.'); };
    const sendTest = async () => {
        if (!window.confirm('Send the backend-configured WhatsApp template to the selected opted-in recipients? This may differ from the preview.'))
            return;
        setSending(true);
        setDelivery(null);
        try {
            const result = await api.dispatchCampaign({ campaignId: `CAMP_${Date.now()}`, recipients, templateText: preview, paymentLink: '', merchantApproved: true });
            setDelivery(result);
        }
        catch (e) {
            setNotice(`Delivery request failed: ${e.message}`);
        }
        finally {
            setSending(false);
        }
    };
    return <div className="campaign-workspace"><section className="phone-section"><p className="eyebrow">A PREVIEW OF THEIR NEXT FAVOURITE FIND</p><div className="phone-frame"><div className="phone-status"><span>9:41</span><span>● ● ▰</span></div><div className="phone-header"><span className="shop-avatar">{(draft.brand || 'DQ').slice(0, 2).toUpperCase()}</span><div><strong>{draft.brand || 'Your shop'}</strong><span>Business message preview</span></div><MessageSquare size={19}/></div><div className="phone-chat"><span className="phone-date">DRAFT PREVIEW</span><div className="message-card">{draft.original && <img src={draft.enhanced || draft.original} alt={draft.title}/>}<div className="message-text"><strong>{draft.title || 'Your next collection'}</strong><p>{preview.replace('{{name}}', 'Ananya')}</p><span className="message-time">Preview only · not sent</span></div></div><div className="phone-reply">Type a message <span>＋</span></div></div></div></section>
 <div className="stack"><section className="surface campaign-controls"><div className="section-head"><h2>Make it personal</h2><span className="pill pill-accent">Campaign draft</span></div><p className="meta">Your product travels with you. Choose the audience and shape the offer.</p><div className="draft-field"><span>Who is this for?</span><div className="segmented">{['All', 'VIP', 'Inactive', 'Regular'].map(t => <button className={`segment ${tag === t ? 'segment-active' : ''}`} onClick={() => setTag(t)} key={t}>{t === 'Inactive' ? 'Gone quiet' : t}</button>)}</div></div><p className="meta">{recipients.length} records with explicit marketing opt-in. This prototype does not verify their phone numbers.</p><div className="offer-control"><div><strong>A little reason to come back</strong><span>{discount}% off</span></div><input type="range" min="0" max="30" step="5" value={discount} onChange={e => setDiscount(Number(e.target.value))} aria-label="Campaign discount"/><p><s>{money(price)}</s> <strong>{money(offer)}</strong> <span>per product</span></p></div><label className="draft-field"><span>Message language</span><select className="field" value={currentLanguage} onChange={e => setLanguage(e.target.value)}><option value="en">English</option><option value="hi">Hindi</option><option value="kn">Kannada</option><option value="ta">Tamil</option></select></label>{currentLanguage !== 'en' && <button className="btn btn-secondary" disabled={busy} onClick={translate}><Languages size={16}/>{busy ? 'Translating…' : 'Translate with Sarvam'}</button>}{!translated && <p className="meta">English preview until a live translation succeeds.</p>}<button className="btn btn-primary wide" disabled={!ready || !translated || busy} onClick={save}><Download size={16}/>Save campaign draft<ArrowRight size={16}/></button>{!ready && <p className="meta">Finish and confirm your product details in Product studio first.</p>}{notice && <p className="notice" role="status">{notice}</p>}</section>
 <section className="surface campaign-delivery"><Check size={20}/><div><h3>Preview first. Send deliberately.</h3><p>This flow prepares a campaign file. Live delivery remains in the existing backend and needs a verified template and workflow before it matches this preview.</p><span className="pill pill-quiet">WhatsApp: {health?.services?.whatsapp?.classification || 'Not verified'}</span></div></section><details className="model-notes"><summary>Advanced · existing delivery workflow</summary><p>This submits the backend-configured template, which may be a test template rather than this preview. Check it with your teammate first. No payment link is attached.</p><p>Active template: {health?.services?.whatsapp?.activeTemplate || 'Not verified'}. The button requires live WhatsApp and n8n status.</p><button className="btn btn-secondary" disabled={sending || !ready || !recipients.length || health?.services?.whatsapp?.classification !== 'LIVE' || health?.services?.n8n?.classification !== 'LIVE'} onClick={sendTest}>{sending ? 'Submitting…' : 'Review & submit configured template'}</button>{delivery && <div role="status"><p>{delivery.classification === 'LIVE' ? 'Backend reports live delivery; inspect the returned receipt.' : 'Backend did not confirm live delivery.'}</p><pre className="schema">{JSON.stringify({ classification: delivery.classification, mode: delivery.mode, messageId: delivery.whatsappMessageId }, null, 2)}</pre></div>}</details></div></div>;
}
