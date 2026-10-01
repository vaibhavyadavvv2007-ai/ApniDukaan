import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Globe, 
  CheckCircle2,
  Tag,
  ArrowRight
} from 'lucide-react';

export default function OmnichannelCatalog({ sampleProducts, t }) {
  const [selectedProduct, setSelectedProduct] = useState(sampleProducts[0]);
  const [activePlatformTab, setActivePlatformTab] = useState('amazon');
  const [copied, setCopied] = useState(false);

  const listings = selectedProduct.platformListings;
  const currentListing = listings[activePlatformTab] || listings.amazon;

  const handleCopy = () => {
    const textToCopy = JSON.stringify(currentListing, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Platform,SKU,Title,Price,Stock\n${activePlatformTab.toUpperCase()},${selectedProduct.sku},"${currentListing.title}",${selectedProduct.basePrice},${selectedProduct.stockCount}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedProduct.sku}_${activePlatformTab}_flatfile.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
              <Globe size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>{t.navCatalog}</h2>
            <span className="badge badge-brand">Unified Master Record</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px' }}>
            One product record in your shop automatically generates tailored SEO listings formatted for Amazon, Flipkart, and Myntra.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleCopy} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
            {copied ? 'Copied JSON!' : t.copyListing}
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            <Download size={16} /> {t.exportFlatfile}
          </button>
        </div>
      </div>

      {/* Master Product Card */}
      <div style={{ background: 'rgba(3, 7, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src={selectedProduct.images.amazonMain} 
            alt={selectedProduct.title} 
            style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedProduct.title}</span>
              <span className="badge badge-emerald">In Stock ({selectedProduct.stockCount})</span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', gap: '16px', marginTop: '4px' }}>
              <span>SKU: <code style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>{selectedProduct.sku}</code></span>
              <span>Price: <strong style={{ color: '#10B981' }}>₹{selectedProduct.basePrice.toLocaleString()}</strong></span>
              <span>MRP: <del>₹{selectedProduct.mrp.toLocaleString()}</del></span>
            </div>
          </div>
        </div>

        {/* Change Product Dropdown */}
        <select 
          value={selectedProduct.id} 
          onChange={(e) => setSelectedProduct(sampleProducts.find(p => p.id === e.target.value))}
          style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-medium)', color: '#FFFFFF', padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
        >
          {sampleProducts.map(p => (
            <option key={p.id} value={p.id}>{p.title} (₹{p.basePrice})</option>
          ))}
        </select>
      </div>

      {/* Platform Switcher Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
        <button
          onClick={() => setActivePlatformTab('amazon')}
          style={{
            background: activePlatformTab === 'amazon' ? 'rgba(255, 153, 0, 0.15)' : 'transparent',
            border: activePlatformTab === 'amazon' ? '1px solid #FF9900' : '1px solid transparent',
            color: activePlatformTab === 'amazon' ? '#FFB84D' : 'var(--text-secondary)',
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Amazon India (A9 SEO Engine)
        </button>
        <button
          onClick={() => setActivePlatformTab('flipkart')}
          style={{
            background: activePlatformTab === 'flipkart' ? 'rgba(40, 116, 240, 0.15)' : 'transparent',
            border: activePlatformTab === 'flipkart' ? '1px solid #2874F0' : '1px solid transparent',
            color: activePlatformTab === 'flipkart' ? '#70A6FF' : 'var(--text-secondary)',
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Flipkart Seller Hub
        </button>
        <button
          onClick={() => setActivePlatformTab('myntra')}
          style={{
            background: activePlatformTab === 'myntra' ? 'rgba(255, 63, 108, 0.15)' : 'transparent',
            border: activePlatformTab === 'myntra' ? '1px solid #FF3F6C' : '1px solid transparent',
            color: activePlatformTab === 'myntra' ? '#FF7A9A' : 'var(--text-secondary)',
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Myntra Fashion Partner
        </button>
      </div>

      {/* Platform Listing Preview */}
      <div style={{ background: 'rgba(3, 7, 18, 0.4)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Title Block */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OPTIMIZED TITLE ({currentListing.title.length} CHARACTERS)</span>
            <span style={{ fontSize: '0.75rem', color: '#10B981' }}>Within {activePlatformTab === 'amazon' ? '200' : '150'} limit</span>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontWeight: 600, fontSize: '1rem', color: '#F8FAFC', lineHeight: 1.4 }}>
            {currentListing.title}
          </div>
        </div>

        {/* Amazon Specific Bullets */}
        {activePlatformTab === 'amazon' && currentListing.bullets && (
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              AMAZON 5-POINT BULLET ATTRIBUTES ([FEATURE]: [BENEFIT])
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentListing.bullets.map((bullet, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#FF9900', fontWeight: 700 }}>•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {currentListing.keywords && (
              <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  A9 BACKEND PLATINUM KEYWORDS
                </span>
                <code style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'block', fontSize: '0.85rem', color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                  {currentListing.keywords}
                </code>
              </div>
            )}
          </div>
        )}

        {/* Flipkart Specific Key Features */}
        {activePlatformTab === 'flipkart' && currentListing.keyFeatures && (
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              FLIPKART KEY SPECIFICATIONS GRID
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {currentListing.keyFeatures.map((feat, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {feat}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Myntra Specific Editorial Notes */}
        {activePlatformTab === 'myntra' && currentListing.curationNotes && (
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              MYNTRA FASHION CURATION & STYLING EDITORIAL
            </span>
            <div style={{ background: 'rgba(255, 63, 108, 0.05)', border: '1px solid rgba(255, 63, 108, 0.25)', padding: '16px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', color: '#FCE7F3', lineHeight: 1.5 }}>
              "{currentListing.curationNotes}"
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
