import React, { useRef, useEffect } from 'react';

export default function DigitalDukaanCanvas({ 
  level, 
  xp, 
  readinessProgress, 
  studioUnlocked, 
  crmConnected, 
  onSelectBuilding 
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle High-DPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Floating particle state
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.7 + 0.2,
      hue: Math.random() > 0.5 ? 245 : 160 // Violet or Emerald
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Atmospheric Ground Grid & Ambient Glow
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#090D1A');
      bgGrad.addColorStop(0.5, '#0B132B');
      bgGrad.addColorStop(1, '#050811');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Radial Ground Spotlight
      const spotGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.55);
      spotGrad.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
      spotGrad.addColorStop(0.6, 'rgba(0, 186, 242, 0.06)');
      spotGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Isometric Ground Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Render Floating Ambient Particles
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity * (0.6 + 0.4 * Math.sin(frame * 0.05))})`;
        ctx.shadowColor = `hsl(${p.hue}, 90%, 60%)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Buildings Definitions
      const buildings = [
        {
          id: 'warehouse',
          label: '📦 Packaging Warehouse',
          sub: readinessProgress >= 60 ? 'Amazon Ready ✨' : '3/5 Tasks Done',
          x: width * 0.18,
          y: height * 0.38,
          w: 130,
          h: 90,
          color: '#10B981',
          glow: 'rgba(16, 185, 129, 0.35)',
          active: true,
          badge: `${readinessProgress}%`,
          icon: '📦'
        },
        {
          id: 'studio',
          label: '📸 Gemini AI Studio',
          sub: studioUnlocked ? '4K Studio Active' : 'Level 2 Unlocked',
          x: width * 0.18,
          y: height * 0.72,
          w: 130,
          h: 90,
          color: '#8B5CF6',
          glow: 'rgba(139, 92, 246, 0.35)',
          active: true,
          badge: 'AI ✨',
          icon: '📸'
        },
        {
          id: 'shop',
          label: '🏪 Shree Ganesh Cloth Centre',
          sub: `Level ${level} • ${shopProfile.levelTitle}`,
          x: width * 0.5,
          y: height * 0.52,
          w: 180,
          h: 120,
          color: '#6366F1',
          glow: 'rgba(99, 102, 241, 0.45)',
          active: true,
          badge: 'HQ 👑',
          icon: '🏪'
        },
        {
          id: 'tower',
          label: '⚡ n8n WhatsApp Tower',
          sub: crmConnected ? 'Auto-CRM Synced' : 'Ready to Connect',
          x: width * 0.82,
          y: height * 0.38,
          w: 130,
          h: 90,
          color: '#00BAF2',
          glow: 'rgba(0, 186, 242, 0.35)',
          active: true,
          badge: 'n8n 💬',
          icon: '⚡'
        },
        {
          id: 'observatory',
          label: '🔮 What-If Observatory',
          sub: 'Risk-Free Simulation',
          x: width * 0.82,
          y: height * 0.72,
          w: 130,
          h: 90,
          color: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.35)',
          active: true,
          badge: 'Sim 🎯',
          icon: '🔮'
        }
      ];

      // 4. Draw Connecting Energy Beams (Digital Commerce Network)
      const shopBuilding = buildings[2];
      [buildings[0], buildings[1], buildings[3], buildings[4]].forEach(target => {
        ctx.beginPath();
        ctx.moveTo(shopBuilding.x, shopBuilding.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.18)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated traveling light pulse along the line
        const pulseProgress = ((frame * 0.015 + target.x) % 1);
        const pulseX = shopBuilding.x + (target.x - shopBuilding.x) * pulseProgress;
        const pulseY = shopBuilding.y + (target.y - shopBuilding.y) * pulseProgress;
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = target.color;
        ctx.shadowColor = target.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 5. Draw Buildings with Modern Isometric Glass Card Styling
      buildings.forEach((b) => {
        const floatOffset = Math.sin(frame * 0.03 + b.x) * 4;
        const bx = b.x - b.w / 2;
        const by = b.y - b.h / 2 + floatOffset;

        // Shadow under building
        ctx.beginPath();
        ctx.ellipse(b.x, b.y + b.h / 2 + 10, b.w * 0.45, 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fill();

        // Building Box Background
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(bx, by, b.w, b.h, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
        ctx.shadowColor = b.glow;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Border
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = b.id === 'shop' ? 'rgba(99, 102, 241, 0.6)' : 'rgba(255, 255, 255, 0.14)';
        ctx.stroke();

        // Roof / Accent Bar
        ctx.beginPath();
        ctx.roundRect(bx, by, b.w, 6, [12, 12, 0, 0]);
        ctx.fillStyle = b.color;
        ctx.fill();

        // Top Badge
        ctx.font = '600 11px Outfit, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(b.badge, bx + b.w - 36, by + 20);

        // Building Icon
        ctx.font = '24px sans-serif';
        ctx.fillText(b.icon, bx + 14, by + 42);

        // Building Label
        ctx.font = '700 12px Outfit, sans-serif';
        ctx.fillStyle = '#F8FAFC';
        const labelText = b.label.length > 20 ? b.label.substring(0, 18) + '...' : b.label;
        ctx.fillText(labelText, bx + 12, by + 64);

        // Subtitle
        ctx.font = '500 10px Inter, sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(b.sub, bx + 12, by + 80);

        ctx.restore();
      });

      // 6. Draw Top Floating Town Stats Header
      ctx.save();
      ctx.fillStyle = 'rgba(3, 7, 18, 0.7)';
      ctx.roundRect(width / 2 - 160, 14, 320, 36, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      ctx.font = '600 12px Outfit, sans-serif';
      ctx.fillStyle = '#A5B4FC';
      ctx.fillText(`🎮 Gandhi Bazaar • Level ${level} Digital Town`, width / 2 - 130, 36);

      ctx.fillStyle = '#10B981';
      ctx.fillText(`⚡ ${xp}/600 XP`, width / 2 + 75, 36);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [level, xp, readinessProgress, studioUnlocked, crmConnected]);

  // Click Handler to Route into Engines
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !onSelectBuilding) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    // Check hit areas
    if (x < w * 0.35 && y < h * 0.55) {
      onSelectBuilding('readiness');
    } else if (x < w * 0.35 && y >= h * 0.55) {
      onSelectBuilding('studio');
    } else if (x > w * 0.65 && y < h * 0.55) {
      onSelectBuilding('crm');
    } else if (x > w * 0.65 && y >= h * 0.55) {
      onSelectBuilding('simulator');
    } else {
      onSelectBuilding('catalog');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '360px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
      <canvas 
        ref={canvasRef} 
        onClick={handleCanvasClick}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }} 
      />
      <div style={{ position: 'absolute', bottom: '12px', right: '16px', background: 'rgba(3, 7, 18, 0.8)', padding: '4px 12px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
        Click any building to manage engine
      </div>
    </div>
  );
}

// Helper mock profile for fallback
const shopProfile = {
  levelTitle: "Mohalla Merchant"
};
