import React, { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  Download, 
  Layers, 
  Sliders, 
  Wand2, 
  Check, 
  Image as ImageIcon,
  Zap,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GeminiPhotoStudio({ sampleProducts, t }) {
  const [selectedProduct, setSelectedProduct] = useState(sampleProducts[0]);
  const [activeAssetTab, setActiveAssetTab] = useState('amazonMain');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [splitPos, setSplitPos] = useState(50); // 0 to 100 for before/after slider

  const handleRunGemini = () => {
    setIsProcessing(true);
    setProcessingStage('Analyzing product contours with Gemini Vision...');
    
    setTimeout(() => {
      setProcessingStage('Isolating fabric & removing shop background...');
    }, 700);

    setTimeout(() => {
      setProcessingStage('Synthesizing #FFFFFF studio lighting & soft shadows...');
    }, 1400);

    setTimeout(() => {
      setProcessingStage('Generating Myntra lifestyle drape & macro detail...');
    }, 2100);

    setTimeout(() => {
      setIsProcessing(false);
      setProcessingStage('');
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#8B5CF6', '#EC4899', '#38BDF8']
      });
    }, 2800);
  };

  const currentEnhancedImage = selectedProduct.images[activeAssetTab] || selectedProduct.images.amazonMain;

  return (
    <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
              <Sparkles size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>{t.studioTitle}</h2>
            <span className="badge badge-brand">Gemini Pro Vision</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px' }}>
            {t.studioSubtitle}
          </p>
        </div>

        <button 
          onClick={handleRunGemini} 
          disabled={isProcessing}
          className="btn btn-primary"
        >
          {isProcessing ? (
            <>
              <Zap size={16} className="animate-spin" /> Processing AI Studio...
            </>
          ) : (
            <>
              <Wand2 size={16} /> Re-Enhance with Gemini
            </>
          )}
        </button>
      </div>

      {/* Product Selector Carousel */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
        {sampleProducts.map((prod) => {
          const isSelected = prod.id === selectedProduct.id;
          return (
            <div
              key={prod.id}
              onClick={() => setSelectedProduct(prod)}
              style={{
                minWidth: '220px',
                background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <img 
                src={prod.images.raw} 
                alt={prod.title} 
                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} 
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {prod.title}
                </div>
                <div style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 700 }}>
                  ₹{prod.basePrice.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Processing Banner */}
      {isProcessing && (
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--brand-primary)', borderRadius: 'var(--radius-md)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6366F1' }} className="animate-ping" />
          <span style={{ fontSize: '0.9rem', color: '#E2E8F0', fontFamily: 'var(--font-mono)' }}>
            {processingStage}
          </span>
        </div>
      )}

      {/* Studio Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Left: Interactive Before / After Split Viewer */}
        <div style={{ background: 'rgba(3, 7, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={16} /> Interactive Before / After Split
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Raw Phone Photo</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Gemini Studio</span>
            </div>
          </div>

          {/* Split Container */}
          <div 
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: '380px', 
              borderRadius: 'var(--radius-md)', 
              overflow: 'hidden',
              userSelect: 'none',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Background Image: Enhanced */}
            <img 
              src={currentEnhancedImage} 
              alt="Enhanced" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />

            {/* Foreground Image: Raw Photo (clipped by splitPos) */}
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: `${splitPos}%`, 
                height: '100%', 
                overflow: 'hidden',
                borderRight: '2px solid #FFFFFF',
                boxShadow: '2px 0 10px rgba(0,0,0,0.5)'
              }}
            >
              <img 
                src={selectedProduct.images.raw} 
                alt="Raw Phone Shot" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', maxWidth: 'none', width: '380px' }} 
              />
              <span style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#FCD34D' }}>
                📷 Raw Shop Shot
              </span>
            </div>

            <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#6EE7B7' }}>
              ✨ Gemini 4K Studio
            </span>

            {/* Slider Control Line */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={splitPos} 
              onChange={(e) => setSplitPos(Number(e.target.value))}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'ew-resize',
                zIndex: 10
              }} 
            />
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
            ↔️ Drag horizontal slider to compare raw phone shot vs Gemini e-commerce output
          </p>
        </div>

        {/* Right: The 4 Multi-Channel Output Assets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} /> 4 E-Commerce Output Variations
            </span>
            <button 
              onClick={() => alert(`Downloading 4K asset bundle (4 images) for SKU: ${selectedProduct.sku}`)}
              className="btn btn-secondary" 
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              <Download size={14} /> Download Asset Bundle
            </button>
          </div>

          {/* Asset Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            
            {/* Asset 1: Amazon Main */}
            <div 
              onClick={() => setActiveAssetTab('amazonMain')}
              style={{
                background: activeAssetTab === 'amazonMain' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: activeAssetTab === 'amazonMain' ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>1. Amazon Main</span>
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>#FFFFFF Pure</span>
              </div>
              <img 
                src={selectedProduct.images.amazonMain} 
                alt="Amazon Main" 
                style={{ width: '100%', height: '110px', borderRadius: '6px', objectFit: 'cover' }} 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Amazon A9 standard 1000x1000px
              </span>
            </div>

            {/* Asset 2: Myntra Lifestyle */}
            <div 
              onClick={() => setActiveAssetTab('myntraLifestyle')}
              style={{
                background: activeAssetTab === 'myntraLifestyle' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: activeAssetTab === 'myntraLifestyle' ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>2. Myntra Lifestyle</span>
                <span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>On-Model</span>
              </div>
              <img 
                src={selectedProduct.images.myntraLifestyle} 
                alt="Myntra Lifestyle" 
                style={{ width: '100%', height: '110px', borderRadius: '6px', objectFit: 'cover' }} 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Fashion drape ambient look
              </span>
            </div>

            {/* Asset 3: Fabric Detail */}
            <div 
              onClick={() => setActiveAssetTab('fabricDetail')}
              style={{
                background: activeAssetTab === 'fabricDetail' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: activeAssetTab === 'fabricDetail' ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>3. Macro Weave Detail</span>
                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Zari Close-Up</span>
              </div>
              <img 
                src={selectedProduct.images.fabricDetail} 
                alt="Fabric Detail" 
                style={{ width: '100%', height: '110px', borderRadius: '6px', objectFit: 'cover' }} 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Authentic texture proof
              </span>
            </div>

            {/* Asset 4: Dimension Graphic */}
            <div 
              onClick={() => setActiveAssetTab('dimensionGraphic')}
              style={{
                background: activeAssetTab === 'dimensionGraphic' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: activeAssetTab === 'dimensionGraphic' ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>4. Infographic Spec</span>
                <span className="badge badge-paytm" style={{ fontSize: '0.65rem' }}>Dimensions</span>
              </div>
              <img 
                src={selectedProduct.images.dimensionGraphic} 
                alt="Dimensions" 
                style={{ width: '100%', height: '110px', borderRadius: '6px', objectFit: 'cover' }} 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Length, blouse & certification
              </span>
            </div>

          </div>

          {/* Gemini AI Reasoning Tag */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: '#A5B4FC', fontWeight: 600 }}>Gemini Vision Audit:</span> Product complies with Amazon Main Image Guideline (RGB 255,255,255 white background, 88% product fill, zero foreign text or watermarks).
          </div>
        </div>

      </div>
    </div>
  );
}
