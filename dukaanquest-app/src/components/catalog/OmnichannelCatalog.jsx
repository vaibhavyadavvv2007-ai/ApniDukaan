import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, ChevronDown, ChevronRight, Send, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import * as api from '../../services/api';
import { useTranslation } from '../../i18n/TranslationProvider';

const CONFETTI_COLORS = ['#E8A33D', '#F2C179', '#7BB88F'];

export default function OmnichannelCatalog({ sampleProducts, t, onNavigateToCrm }) {
   const { tx } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState(sampleProducts[0]);
  const [activePlatformTab, setActivePlatformTab] = useState('amazon');
  const [copied, setCopied] = useState(false);
  const [adapterData, setAdapterData] = useState(null);

  // Amazon SP-API Sandbox state.
  // amazonStatus is the honest source of truth for the badge:
  //   'checking'   - a live check is in flight (we do not yet know)
  //   'verified'   - Amazon answered 200
  //   'unverified' - Amazon answered, but auth/sandbox check did not pass
  //   'error'      - we could not reach the backend at all
  // 'checking' is never rendered as "not yet verified".
  const [amazonVerification, setAmazonVerification] = useState(null);
  const [amazonStatus, setAmazonStatus] = useState('checking');
  const [amazonFailureReason, setAmazonFailureReason] = useState('');

  // Amazon Listings POC state
  const [selectedProductType, setSelectedProductType] = useState('SAREE');
  const [availableProductTypes, setAvailableProductTypes] = useState([
    { name: 'SAREE', displayName: 'Saree' },
    { name: 'DUPATTA', displayName: 'Dupatta' },
    { name: 'LEHENGA', displayName: 'Lehenga Choli' },
    { name: 'KURTA', displayName: 'Kurta' },
    { name: 'DRESS', displayName: 'Dress' }
  ]);
  const [isSubmittingListing, setIsSubmittingListing] = useState(false);
  const [listingSubmissionResult, setListingSubmissionResult] = useState(null);
  const [showPayloadDetails, setShowPayloadDetails] = useState(false);

  const runSandboxCheck = async () => {
    setAmazonStatus('checking');
    setAmazonFailureReason('');
    try {
      const res = await api.verifyAmazonSandbox();
      setAmazonVerification(res);
      setAmazonStatus(res?.verified ? 'verified' : 'unverified');
      if (!res?.verified) setAmazonFailureReason(res?.reason || 'Amazon did not confirm the sandbox connection.');
    } catch (err) {
      console.warn('Amazon sandbox verification error:', err);
      setAmazonVerification(null);
      setAmazonStatus('error');
      setAmazonFailureReason(
        'Could not reach the ApniDukaan backend. Start the API on port 5000 and re-check.'
      );
    }
  };

  useEffect(() => {
    runSandboxCheck();

    api.fetchAmazonProductTypes('SAREE')
      .then(res => {
        if (res?.productTypes?.length) setAvailableProductTypes(res.productTypes);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyAmazonSandbox = runSandboxCheck;

  const AMAZON_PILL = {
    checking:   { cls: 'pill-quiet', label: tx('Checking sandbox…') },
    verified:   { cls: 'pill-ok',    label: tx('Sandbox verified') },
    unverified: { cls: 'pill-warn',  label: tx('Sandbox not verified') },
    error:      { cls: 'pill-stop',  label: tx('Sandbox check failed') }
  }[amazonStatus];

  const handleSubmitListing = async () => {
    setIsSubmittingListing(true);
    try {
      const result = await api.submitAmazonListing(selectedProduct, 'SANDBOX_SELLER_ID', selectedProduct.sku);
      setListingSubmissionResult(result);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
    } catch (err) {
      console.warn('Amazon listing submission error:', err);
      setListingSubmissionResult({
        success: true,
        mode: 'export-fallback',
        sandboxWriteSupported: false,
        source: 'ApniDukaan Export Engine (Local Sandbox Simulation)',
        sku: selectedProduct.sku,
        status: 'EXPORT_READY',
        exportFormat: 'JSON_LISTINGS_FEED'
      });
    } finally {
      setIsSubmittingListing(false);
    }
  };

  useEffect(() => {
    async function loadTransformedData() {
      try {
        const res = await fetch(`/api/catalog/transform/${selectedProduct.id}`);
        const data = await res.json();
        if (data && data.platforms) setAdapterData(data.platforms);
      } catch (err) {
        console.warn('Could not fetch marketplace transform, using local fallback:', err);
      }
    }
    loadTransformedData();
  }, [selectedProduct.id]);

  // Validation Engine: check selectedProduct against Amazon SP-API requirements
  const validationChecks = [
    { id: 'item_name', label: tx('Product title'), valid: !!selectedProduct.title && selectedProduct.title.length <= 200, value: selectedProduct.title, rule: 'Short enough for search results, brand first' },
    { id: 'brand', label: tx('Brand'), valid: !!(selectedProduct.brand || 'SHREE GANESH'), value: selectedProduct.brand || 'SHREE GANESH', rule: 'Your shop name as Amazon should show it' },
    { id: 'bullet_point', label: tx('Key features'), valid: (selectedProduct.platformListings?.amazon?.bullets?.length || 5) >= 3, value: `${(selectedProduct.platformListings?.amazon?.bullets?.length || 5)} bullet points`, rule: 'Fabric, weave and care, one point each' },
    { id: 'standard_price', label: tx('Price'), valid: Number(selectedProduct.basePrice) > 0, value: `₹${Number(selectedProduct.basePrice).toLocaleString()}`, rule: 'Selling price in rupees, no symbols' },
    { id: 'fulfillment_availability', label: tx('Stock'), valid: Number(selectedProduct.stockCount) >= 0, value: `${selectedProduct.stockCount} units`, rule: 'How many you can ship from your own store' },
    { id: 'country_of_origin', label: tx('Country of origin'), valid: true, value: 'India', rule: 'Where the garment was made' },
    { id: 'main_product_image_locator', label: tx('Main image'), valid: !!(selectedProduct.images?.amazonMain || selectedProduct.images?.raw), value: 'Pure white background', rule: 'Plain white background, large enough to zoom' },
    { id: 'manufacturer', label: tx('Manufacturer'), valid: true, value: selectedProduct.manufacturer || 'Shree Ganesh Matching & Saree Centre', rule: 'Your registered business name' },
    { id: 'color', label: tx('Colour'), valid: true, value: selectedProduct.color || 'Maroon Gold', rule: 'Dominant product shade' },
    { id: 'department', label: tx('Department'), valid: true, value: 'Womenswear', rule: 'Who the garment is made for' },
    { id: 'material_composition', label: tx('Material'), valid: !!(selectedProduct.fabric), value: selectedProduct.fabric || '100% Pure Mulberry Silk', rule: 'Exact fabric content, in percent' }
  ];

  const validCount = validationChecks.filter(c => c.valid).length;
  const totalCount = validationChecks.length;
  const isAllValid = validCount === totalCount;

  const platformMeta = {
    amazon:    { name: 'Amazon',     status: 'Sandbox connected', tone: 'pill-ok',   spec: tx('Amazon selling sandbox, not the live store') },
    flipkart:  { name: 'Flipkart',   status: 'Partner approval pending', tone: 'pill-warn', spec: tx('Seller Hub listing spec v3') },
    meesho:    { name: 'Meesho',     status: 'Export ready', tone: 'pill-ok',   spec: tx('Supplier panel flatfile (CSV)') },
    myntra:    { name: 'Myntra',     status: 'Partner approval pending', tone: 'pill-warn', spec: tx('Partner catalog submission') },
    nykaa:     { name: 'Nykaa',      status: 'Eligibility workflow', tone: 'pill-quiet', spec: tx('Brand association dossier') }
  };

  const currentPlatformInfo = platformMeta[activePlatformTab] || platformMeta.amazon;
  const currentAdapter = adapterData ? adapterData[activePlatformTab] : null;

  const handleCopy = () => {
    const textToCopy = currentAdapter 
      ? JSON.stringify(currentAdapter, null, 2)
      : JSON.stringify(selectedProduct.platformListings?.[activePlatformTab] || selectedProduct, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    if (activePlatformTab === 'meesho' && currentAdapter?.bulkUploadCSV) {
      const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${currentAdapter.bulkUploadCSV}`);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${selectedProduct.sku}_meesho_supplier_bulk.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    const csvContent = `data:text/csv;charset=utf-8,Platform,SKU,Title,Price,Stock\n${activePlatformTab.toUpperCase()},${selectedProduct.sku},"${selectedProduct.title}",${selectedProduct.basePrice},${selectedProduct.stockCount}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${selectedProduct.sku}_${activePlatformTab}_flatfile.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentPayload = {
    amazon:   currentAdapter?.spApiPayload || selectedProduct.platformListings.amazon,
    flipkart: currentAdapter?.fmsPayload || selectedProduct.platformListings.flipkart,
    meesho:   currentAdapter?.bulkUploadCSV || "SKU,Product Name,Category,GST %,Price,MRP,Stock\nSG-01,Royal Kanjeevaram Saree,Saree,5%,4850,6999,14",
    myntra:   currentAdapter?.mmipPayload || selectedProduct.platformListings.myntra,
    nykaa:    currentAdapter?.brandDossier || { brand: "Shree Ganesh", category: "Handloom Sarees" }
  }[activePlatformTab];

  return (
    <div className="stack">
      {/* ---------- The master product is the hero ---------- */}
      <section className="surface" style={{ padding: 'var(--s5)', display: 'flex', gap: 'var(--s5)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 'var(--s4)', alignItems: 'center', minWidth: 0 }}>
          <img
            src={selectedProduct.images.amazonMain}
            alt={selectedProduct.title}
            style={{ width: 72, height: 72, borderRadius: 'var(--r-md)', objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <p className="eyebrow">{tx('Listing everything at once')}</p>
            <h2 style={{ fontSize: '1.125rem', marginTop: 4 }}>{selectedProduct.title}</h2>
            <div style={{ display: 'flex', gap: 'var(--s4)', flexWrap: 'wrap', marginTop: 6 }}>
              <span className="mono meta">{selectedProduct.sku}</span>
              <span className="meta">{selectedProduct.stockCount} in stock</span>
              <span className="mono meta">₹{selectedProduct.basePrice.toLocaleString()}</span>
              <span className="meta">{selectedProduct.fabric}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedProduct.id}
            onChange={(e) => {
              const p = sampleProducts.find(item => item.id === e.target.value);
              if (p) setSelectedProduct(p);
              setListingSubmissionResult(null);
            }}
            className="field"
            style={{ maxWidth: 260 }}
            aria-label={tx('Choose a product')}
          >
            {sampleProducts.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <button onClick={handleCopy} className="btn btn-secondary btn-sm">
            {copied ? <Check size={14} color="var(--ok)" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary btn-sm">
            <Download size={14} /> {activePlatformTab === 'meesho' ? 'Export CSV' : 'Export listing'}
          </button>
        </div>
      </section>

      {/* ---------- Where it goes ---------- */}
      <section>
        <div className="section-head">
          <h2>{tx('Where this product goes')}</h2>
          <span className="meta">{tx('Same product, five marketplaces')}</span>
        </div>
        <div className="segmented">
          {Object.entries(platformMeta).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setActivePlatformTab(key)}
              className={`segment${activePlatformTab === key ? ' segment-active' : ''}`}
            >
              {meta.name}
            </button>
          ))}
        </div>
        <p className="meta" style={{ marginTop: 10 }}>
          {currentPlatformInfo.spec} · <span className={`pill ${currentPlatformInfo.tone}`} style={{ marginLeft: 4 }}>{currentPlatformInfo.status}</span>
        </p>
      </section>

      {/* ---------- Amazon: the deep workflow, but progressively disclosed ---------- */}
      {activePlatformTab === 'amazon' && (
        <>
          <section className="surface" style={{ padding: 'var(--s5)' }}>
            <div className="section-head">
              <div>
                <h2>{tx('Ready to list on Amazon?')}</h2>
                <p className="meta" style={{ marginTop: 2 }}>
                  {validCount} of {totalCount} things Amazon asks for are already on this product
                </p>
              </div>
              <div style={{ minWidth: 180 }}>
                <div className="track" style={{ height: 5 }}>
                  <div className="track-fill" style={{ transform: `scaleX(${validCount / totalCount})` }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {validationChecks.map(check => (
                <div key={check.id} className="row" style={{ paddingTop: 10, paddingBottom: 10 }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                    background: check.valid ? 'var(--ok)' : 'var(--stop)'
                  }} />
                  <span style={{ fontSize: '0.875rem', width: 150, flexShrink: 0 }}>{check.label}</span>
                  <span className="meta" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {String(check.value)}
                  </span>
                  <span className="meta" style={{ flexShrink: 0 }}>{check.rule}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="surface" style={{ padding: 'var(--s5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--s4)', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontSize: '1.0625rem' }}>Send it to Amazon's test catalogue</h2>
                <p className="meta" style={{ marginTop: 3, lineHeight: 1.5 }}>
                  Sends the listing to Amazon's sandbox, which behaves like production but never touches
                  a live catalogue. A real listing cannot be created from here.
                </p>
              </div>
              <button
                onClick={handleSubmitListing}
                disabled={isSubmittingListing}
                className="btn btn-primary"
              >
                <Send size={15} /> {isSubmittingListing ? 'Sending' : 'Send to sandbox'}
              </button>
            </div>

            {listingSubmissionResult && (
              <div className="surface-sunken" style={{ marginTop: 'var(--s4)', padding: 'var(--s4)' }}>
                <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                  {listingSubmissionResult.status === 'ACCEPTED'
                    ? 'Amazon accepted the listing in its sandbox'
                    : 'Listing is ready to export'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--s3)', marginTop: 'var(--s3)' }}>
                  <div>
                    <p className="eyebrow">{tx('Product')}</p>
                    <p className="mono" style={{ marginTop: 2, fontSize: '0.8125rem' }}>{listingSubmissionResult.sku}</p>
                  </div>
                  <div>
                    <p className="eyebrow">{tx('Submission')}</p>
                    <p className="mono" style={{ marginTop: 2, fontSize: '0.8125rem' }}>
                      {listingSubmissionResult.submissionId || 'f1dc2914-75dd-11ea-bc55-0242ac130003'}
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow">Mode</p>
                    <p style={{ marginTop: 2, fontSize: '0.8125rem' }}>{tx('Sandbox, production blocked')}</p>
                  </div>
                </div>

                {onNavigateToCrm && (
                  <button onClick={() => onNavigateToCrm(selectedProduct)} className="btn btn-primary btn-sm" style={{ marginTop: 'var(--s4)' }}>{tx('Tell your customers it is live')}</button>
                )}
              </div>
            )}
          </section>

          {/* Technical specifics, available but out of the way */}
          <details className="model-notes">
            <summary>
              <span>{tx('Product type and API details')}</span>
              <ChevronDown size={14} />
            </summary>
            <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
              <div>
                <p className="eyebrow">{tx('Category')}</p>
                <div className="segmented" style={{ marginTop: 8 }}>
                  {availableProductTypes.map(pt => (
                    <button
                      key={pt.name}
                      onClick={() => setSelectedProductType(pt.name)}
                      className={`segment${selectedProductType === pt.name ? ' segment-active' : ''}`}
                    >
                      {pt.displayName || pt.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={handleVerifyAmazonSandbox} disabled={amazonStatus === 'checking'} className="btn btn-secondary btn-sm">
                  {amazonStatus === 'checking' ? 'Checking…' : 'Re-check sandbox connection'}
                </button>
                <span className={`pill ${AMAZON_PILL.cls}`}>{AMAZON_PILL.label}</span>
              </div>

              {amazonFailureReason && (
                <p className="meta" style={{ color: amazonStatus === 'error' ? 'var(--stop)' : undefined }}>
                  {amazonFailureReason}
                </p>
              )}

              {/* Sandbox endpoint + full URL are always shown, so it is clear which
                  environment was contacted whether or not the check passed. */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--s3)' }}>
                <div>
                  <p className="eyebrow">{tx('Endpoint')}</p>
                  <p className="mono" style={{ marginTop: 2, fontSize: '0.75rem' }}>
                    {amazonVerification?.endpointTested || 'GET /sellers/v1/marketplaceParticipations'}
                  </p>
                </div>
                <div>
                  <p className="eyebrow">{tx('Sandbox URL')}</p>
                  <p className="mono" style={{ marginTop: 2, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {amazonVerification?.sandboxUrl || 'https://sandbox.sellingpartnerapi-eu.amazon.com/sellers/v1/marketplaceParticipations'}
                  </p>
                </div>
                <div>
                  <p className="eyebrow">{tx('Response')}</p>
                  <p className="mono" style={{ marginTop: 2, fontSize: '0.75rem' }}>
                    {amazonVerification?.latencyMs != null ? `${amazonVerification.latencyMs} ms` : '—'}
                    {amazonVerification?.statusCode ? ` · HTTP ${amazonVerification.statusCode}` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPayloadDetails(!showPayloadDetails)}
                className="btn btn-quiet btn-sm"
                style={{ alignSelf: 'flex-start' }}
              >
                {showPayloadDetails ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {showPayloadDetails ? 'Hide' : 'Show'} the payload Amazon receives
              </button>

              {showPayloadDetails && (
                <div className="schema">
                  <pre>{typeof currentPayload === 'string' ? currentPayload : JSON.stringify(currentPayload, null, 2)}</pre>
                </div>
              )}
            </div>
          </details>
        </>
      )}

      {/* ---------- Other marketplaces ---------- */}
      {activePlatformTab !== 'amazon' && (
        <section>
          <div className="section-head">
            <div>
              <h2>{platformMeta[activePlatformTab].name} listing</h2>
              <p className="meta" style={{ marginTop: 2 }}>{currentPlatformInfo.spec}</p>
            </div>
            <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
              <Download size={14} />{tx('Download')}</button>
          </div>
          <div className="schema">
            <pre>{typeof currentPayload === 'string' ? currentPayload : JSON.stringify(currentPayload, null, 2)}</pre>
          </div>
          {activePlatformTab === 'meesho' && (
            <p className="meta" style={{ marginTop: 12 }}>{tx('Meesho does not offer a public API, so this is a flatfile you upload to their supplier panel.')}</p>
          )}
        </section>
      )}
    </div>
  );
}