import { useState, useRef } from 'react';
import { Upload, Sparkles, ArrowRight, Check, Circle, Download, Package, AlertCircle, RefreshCw } from 'lucide-react';
import * as api from '../services/api';
import { newDraft, checks, money, listingCSV, downloadFile } from '../services/draft';
async function readPhoto(file) {
    if (!file.type.startsWith('image/'))
        throw Error('Choose an image file.');
    if (file.size > 12 * 1024 * 1024)
        throw Error('Choose an image smaller than 12 MB.');
    const url = URL.createObjectURL(file);
    try {
        const img = new Image();
        img.src = url;
        await img.decode();
        const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.82);
    }
    finally {
        URL.revokeObjectURL(url);
    }
}
function Photo({ src, title }) { return src ? <img src={src} alt={title || 'Product preview'}/> : <div className="photo-placeholder"><Package size={46}/><p>Your product goes here</p></div>; }
function Field({ label, name, draft, update, type = 'text' }) { return <label className="draft-field"><span>{label}</span><input className="field" name={name} type={type} min={type === 'number' ? 0 : undefined} step={name === 'stock' ? 1 : 'any'} value={draft[name]} onChange={e => update({ [name]: e.target.value })}/></label>; }
export function ProductStudio({ draft, update, setDraft, products, onNext, ready }) {
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [split, setSplit] = useState(50);
    const input = useRef(null);
    const choose = async (e) => { const file = e.target.files?.[0]; if (!file)
        return; setBusy(true); try {
        const original = await readPhoto(file);
        setDraft({ ...newDraft(), original });
        setMessage('Photo added. Enter the product details or ask AI for a draft.');
    }
    catch (err) {
        setMessage(err.message);
    }
    finally {
        setBusy(false);
        e.target.value = '';
    } };
    const analyze = async () => {
        setBusy(true);
        setMessage('Preparing your image and listing draft…');
        try {
            if (!draft.original.startsWith('data:'))
                throw Error('Upload your own photo to run AI analysis. The sample is available for manual editing.');
            const blob = await (await fetch(draft.original)).blob();
            const form = new FormData();
            form.append('image', blob, 'product.jpg');
            form.append('productContext', draft.title || 'Describe only visible product details. Mark unknown material and dimensions for merchant confirmation.');
            const result = await api.uploadAndEnhanceImage(form);
            if (!result?.success)
                throw Error(result?.error || 'Could not analyze this photo.');
            const live = result.pathStatuses?.textExtraction?.status === 'LIVE';
            const asset = result.imageAsset;
            const enhanced = asset?.liveAPI && asset.image?.data ? asset.image.data : '';
            const analysis = result.analysis || {};
            const patch = { enhanced, imageStatus: enhanced ? 'generated' : 'original', analysisStatus: live ? 'live' : 'fallback' };
            if (live) {
                if (analysis.productTitle)
                    patch.title = analysis.productTitle;
                if (analysis.amazonBullets?.length)
                    patch.description = analysis.amazonBullets.join('\n');
            }
            update(patch);
            setMessage(live ? 'AI draft received. Confirm the facts, especially material and dimensions.' : 'AI is unavailable in this environment. Your photo is preserved; fill in the details manually.');
        }
        catch (err) {
            setMessage(err.message);
        }
        finally {
            setBusy(false);
        }
    };
    const downloadPhoto = () => { const src = draft.enhanced || draft.original; if (!src.startsWith('data:'))
        return; const a = document.createElement('a'); a.href = src; a.download = draft.enhanced ? 'product-ai-image.png' : 'product-original.jpg'; a.click(); };
    const complete = () => { setDraft(d => ({ ...d, reviewed: true })); onNext(); };
    return <div className="stack">
  <div className="workspace-toolbar"><span className="pill pill-quiet">{draft.sample ? 'Sample product · editable' : 'Browser draft · autosaved'}</span><button className="btn btn-quiet" disabled={busy} onClick={() => { if ((draft.original || draft.title) && !window.confirm('Replace the current draft with a sample product?'))
        return; setDraft(newDraft(products[0])); setMessage('Sample product loaded. Confirm its details before export.'); }}>Try a sample product</button></div>
  <div className="product-workspace">
   <section className="surface photo-panel"><div className="section-head"><h2>01 / The product</h2><span className="pill pill-quiet">{draft.imageStatus === 'generated' ? 'AI image · review required' : 'Original photo'}</span></div>
    <div className="product-photo"><Photo src={draft.enhanced || draft.original} title={draft.title}/>{draft.enhanced && <><div className="photo-before" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}><Photo src={draft.original} title="Original product"/></div><input className="compare-control" type="range" aria-label="Before and after comparison" min="0" max="100" value={split} onChange={e => setSplit(Number(e.target.value))}/><span className="photo-label">Original / AI result</span></>}</div>
    <input type="file" accept="image/*" ref={input} onChange={choose} hidden/>
    <div className="button-row"><button className="btn btn-secondary" disabled={busy} onClick={() => input.current.click()}><Upload size={16}/>{draft.original ? 'Replace photo' : 'Upload a photo'}</button><button className="btn btn-primary" disabled={busy || !draft.original} onClick={analyze}><Sparkles size={16}/>{busy ? 'Working…' : 'Create AI draft'}</button></div>
    {draft.original.startsWith('data:') && <button className="btn btn-quiet btn-sm" onClick={downloadPhoto}><Download size={14}/>Download displayed image</button>}
    <p className="meta">JPG, PNG or WebP · up to 12 MB. Images are resized for your local draft. AI runs only when you ask.</p>
    {message && <p role="status" className="notice">{message}</p>}
   </section>
   <section className="surface details-panel"><div className="section-head"><h2>02 / Make it yours</h2><span className="pill pill-accent">Editable details</span></div><p className="meta">You know your product best. Review every field before preparing a listing.</p>
    <fieldset disabled={busy} className="editor-fields"><Field label="Product title" name="title" draft={draft} update={update}/><Field label="Brand or shop name" name="brand" draft={draft} update={update}/><div className="field-pair"><Field label="Selling price (₹)" name="price" type="number" draft={draft} update={update}/><Field label="Stock quantity" name="stock" type="number" draft={draft} update={update}/></div><div className="field-pair"><Field label="Confirmed material" name="material" draft={draft} update={update}/><Field label="Size / dimensions" name="size" draft={draft} update={update}/></div><label className="draft-field"><span>Description / key features</span><textarea className="field" rows="4" value={draft.description} onChange={e => update({ description: e.target.value })}/></label></fieldset>
    <button className="btn btn-primary wide" disabled={!ready || busy} onClick={complete}>Confirm details & preview listing<ArrowRight size={16}/></button>
   </section>
  </div>
  <Readiness draft={draft}/>
 </div>;
}
function Readiness({ draft, onEdit }) {
    const list = checks(draft);
    const missing = list.filter(c => !c.valid);
    return <section className="surface readiness-panel"><div><span className="readiness-icon">{missing.length ? <AlertCircle size={23}/> : <Check size={23}/>}</span><h2>{missing.length ? `${missing.length} details to finish` : 'Your draft has the essentials'}</h2><p className="meta">Draft completeness only. Marketplace approval and factual accuracy require review.</p>{onEdit && <button className="btn btn-secondary btn-sm" onClick={onEdit}>Edit product details</button>}</div><div className="readiness-items">{list.map(c => <div key={c.key} className={c.valid ? 'valid' : ''}>{c.valid ? <Check size={15}/> : <Circle size={15}/>}<span>{c.valid ? c.label : c.fix}</span></div>)}</div></section>;
}
export function ProductListings({ draft, setDraft, onEdit, onNext, health }) {
    const [platform, setPlatform] = useState('amazon');
    const [notice, setNotice] = useState('');
    const [busy, setBusy] = useState(false);
    const [sandboxResult, setSandboxResult] = useState(null);
    const ready = checks(draft).every(c => c.valid) && draft.reviewed;
    const exportListing = () => { downloadFile(`dukaanquest-${platform}-draft.csv`, listingCSV(draft, platform), 'text/csv;charset=utf-8'); setDraft(d => ({ ...d, exported: true })); setNotice('Listing draft downloaded. This is a generic export for review, not an approved marketplace upload template.'); };
    const downloadCopy = () => { downloadFile('product-copy.txt', `${draft.title}\n${draft.brand}\n${money(draft.price)}\nMaterial: ${draft.material}\nSize: ${draft.size}\n\n${draft.description}`); setNotice('Product copy downloaded.'); };
    const sandbox = async () => { setBusy(true); try {
        const product = { id: draft.id, sku: draft.id, title: draft.title, brand: draft.brand, basePrice: Number(draft.price), stockCount: Number(draft.stock), fabric: draft.material, images: { raw: draft.original, amazonMain: draft.enhanced || draft.original }, platformListings: { amazon: { bullets: draft.description.split('\n') } } };
        setSandboxResult(await api.submitAmazonListing(product));
    }
    catch (err) {
        setNotice(`Sandbox request failed: ${err.message}`);
    }
    finally {
        setBusy(false);
    } };
    return <div className="stack"><div className="workspace-toolbar"><div className="segmented">{['amazon', 'flipkart', 'meesho'].map(p => <button className={`segment ${platform === p ? 'segment-active' : ''}`} key={p} onClick={() => setPlatform(p)}>{p[0].toUpperCase() + p.slice(1)}</button>)}</div><span className="pill pill-quiet">Listing preview · not published</span></div>
  <div className="listing-workspace"><section className="listing-preview"><div className="preview-browser"><span /><span /><span /><p>{platform} / product preview</p></div><div className="listing-card"><div className="listing-image"><Photo src={draft.enhanced || draft.original} title={draft.title}/></div><div className="listing-copy"><p className="eyebrow">{draft.brand || 'YOUR BRAND'}</p><h2>{draft.title || 'Your product title'}</h2><p className="listing-price">{money(draft.price)}</p><span className="pill pill-quiet">{Number(draft.stock) > 0 ? `${draft.stock} units available` : 'Stock needs review'}</span><div className="product-attributes"><p><span>Material</span>{draft.material || 'Not provided'}</p><p><span>Size</span>{draft.size || 'Not provided'}</p></div><p className="listing-description">{draft.description || 'Add product details in the studio to see them here.'}</p></div></div></section>
   <section className="surface export-panel"><span className="feature-icon"><Package size={24}/></span><h2>Your listing, ready to go.</h2><p>Keep a copy of your product details, then prepare a personal offer for your customers.</p><div className="export-line"><Check size={16}/> Product title & description</div><div className="export-line"><Check size={16}/> Price, stock & attributes</div><div className="export-line"><Check size={16}/> Editable CSV draft</div><button className="btn btn-primary wide" disabled={!ready} onClick={exportListing}><Download size={16}/>Download listing CSV</button><button className="btn btn-secondary wide" disabled={!ready} onClick={downloadCopy}>Download product copy</button><p className="meta">Exporting does not publish a listing. Check the destination’s current requirements before uploading.</p><button className="btn btn-quiet" disabled={!ready} onClick={onNext}>Prepare a campaign<ArrowRight size={15}/></button></section>
  </div>
  {notice && <p role="status" className="notice">{notice}</p>}<Readiness draft={draft} onEdit={onEdit}/>{!draft.reviewed && <p className="meta">Confirm your details in Product studio to enable export.</p>}
  <details className="model-notes"><summary>Advanced · existing Amazon sandbox adapter</summary><p className="meta">Uses the existing backend adapter. Its response is shown below without claiming a live listing.</p><button className="btn btn-secondary" disabled={!ready || busy || health?.services?.amazon?.classification !== 'SANDBOX'} onClick={sandbox}><RefreshCw size={14}/>{busy ? 'Checking…' : 'Submit to sandbox'}</button>{sandboxResult && <pre className="schema">{JSON.stringify(sandboxResult, null, 2)}</pre>}</details>
 </div>;
}
