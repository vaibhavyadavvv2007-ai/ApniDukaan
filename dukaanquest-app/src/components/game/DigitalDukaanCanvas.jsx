import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

/* Digital Town — an isometric merchant plot.
   Five buildings, one per product engine. The shop is the anchor; the other
   four are the engines that feed it. The left panel is the same data as the
   plot, so nothing is only discoverable by hovering a canvas. */

const C = {
  sky: '#141110',
  plot: '#1b1815',
  plotEdge: 'rgba(247, 240, 228, 0.07)',
  grid: 'rgba(247, 240, 228, 0.05)',
  wallLeft: '#3d362c',
  wallLeftHover: '#4a4136',
  wallRight: '#241f19',
  wallRightHover: '#2d2720',
  roof: '#4d4438',
  roofAnchor: '#61533f',
  roofHover: '#77664b',
  edge: 'rgba(247, 240, 228, 0.15)',
  accent: '#e8a33d',
  accentSoft: '#f2c179',
  ok: '#7bb88f',
  text: '#f7f2ea',
  text2: '#b3aa9d',
  text3: '#7d7469',
  shadow: 'rgba(0, 0, 0, 0.42)'
};

/* One soft elliptical contact shadow, reused by every building. */
function contactShadow(ctx, x, y, rx, ry) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
  g.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
  g.addColorStop(0.6, 'rgba(0, 0, 0, 0.22)');
  g.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, ry / Math.max(rx, ry));
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(rx, ry), 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
}

function project(wx, wy, wz, cx, cy, s) {
  return { x: cx + (wx - wy) * s, y: cy + (wx + wy) * s * 0.5 - wz * s };
}

function poly(ctx, pts, fill, stroke, lw = 1) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

export default function DigitalDukaanCanvas({
  level,
  xp,
  readinessProgress,
  studioUnlocked,
  crmConnected,
  onSelectBuilding
}) {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const hoverRef = useRef(null);
  const viewRef = useRef({ cx: 0, cy: 0, s: 1 });

  const buildings = useMemo(() => [
    {
      id: 'warehouse', engine: 'readiness', label: 'Packaging',
      state: readinessProgress >= 60 ? 'Amazon ready' : `${readinessProgress}% ready`,
      X: -3.3, Y: -1.5, w: 2.5, d: 1.5, h: 2.05, tint: C.ok
    },
    {
      id: 'studio', engine: 'studio', label: 'Photo studio',
      state: studioUnlocked ? 'Gemini vision active' : 'Unlocks at level 2',
      X: -3.9, Y: 1.5, w: 2.5, d: 1.5, h: 1.75, tint: C.accent
    },
    {
      id: 'shop', engine: 'catalog', label: 'Your shop',
      state: `Level ${level}, ${level === 3 ? 'Digital Vyapari' : 'Mohalla Merchant'}`,
      X: 0, Y: 0, w: 3.0, d: 1.8, h: 2.95, tint: C.accent, anchor: true
    },
    {
      id: 'tower', engine: 'crm', label: 'Customer reach',
      state: crmConnected ? 'Segmentation synced' : 'Ready to connect',
      X: 3.3, Y: -1.5, w: 2.3, d: 1.4, h: 2.4, tint: C.ok
    },
    {
      id: 'observatory', engine: 'simulator', label: 'What-if room',
      state: 'Simulations ready',
      X: 3.9, Y: 1.5, w: 2.3, d: 1.4, h: 1.55, tint: C.accentSoft
    }
  ], [level, readinessProgress, studioUnlocked, crmConnected]);

  useEffect(() => { hoverRef.current = hovered; }, [hovered]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width < 2 || height < 2) return;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* World -> screen. gx = (X + Y) / 2, gy = (Y - X) / 2 keeps X/Y
       readable as "across the street" and "depth". */
    const world = buildings.map(b => ({
      ...b,
      gx: (b.X + b.Y) / 2,
      gy: (b.Y - b.X) / 2,
      depth: b.Y
    }));
    const RX = 5.4;
    const RY = 3.6;
    const MAXH = 2.95;
    /* One scale for the whole plot: fit the diamond and the tallest roof
       inside the stage so nothing is ever cropped at any width. */
    const scale = Math.min((width * 0.94) / (2 * RX), (height * 0.9) / (2 * RY + MAXH));
    if (!Number.isFinite(scale) || scale <= 2) return;
    const cx = width / 2;
    const cy = height / 2 + (MAXH * scale) / 2 + 6;
    viewRef.current = { cx, cy, s: scale };
    const P = (wx, wy, wz) => project(wx, wy, wz, cx, cy, scale);

    /* ---- Backdrop ---- */
    ctx.fillStyle = C.sky;
    ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(cx, cy - 30 * scale * 0.06, 8, cx, cy, Math.max(width, height) * 0.7);
    glow.addColorStop(0, 'rgba(232, 163, 61, 0.075)');
    glow.addColorStop(1, 'rgba(232, 163, 61, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    /* ---- Bounded plot ---- */
    const plot = [P(-RX, -RY, 0), P(RX, -RY, 0), P(RX, RY, 0), P(-RX, RY, 0)];
    poly(ctx, plot, C.plot, C.plotEdge);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(plot[0].x, plot[0].y);
    for (let i = 1; i < plot.length; i++) ctx.lineTo(plot[i].x, plot[i].y);
    ctx.closePath();
    ctx.clip();
    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
      const a = P(i, -RY, 0), b = P(i, RY, 0);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      const c = P(-RX, i, 0), d = P(RX, i, 0);
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.stroke();
    }
    ctx.restore();

    /* ---- Far to near ---- */
    const order = [...world].sort((a, b) => a.depth - b.depth || a.gx - b.gx);
    const shop = world.find(b => b.id === 'shop');

    order.forEach(b => {
      const c = P(b.gx, b.gy, 0);
      const spread = ((b.w + b.d) / 2) * scale * 0.55;
      contactShadow(ctx, c.x, c.y, spread, spread * 0.34);
    });

    order.forEach(b => {
      if (b.id === 'shop') return;
      const a = P(shop.gx, shop.gy, 0);
      const t = P(b.gx, b.gy, 0);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = hoverRef.current === b.id ? 'rgba(232, 163, 61, 0.45)' : 'rgba(247, 240, 228, 0.07)';
      ctx.lineWidth = hoverRef.current === b.id ? 1.5 : 1;
      ctx.stroke();
    });

    /* ---- Volumes ---- */
    const labels = [];
    order.forEach(b => {
      const isHover = hoverRef.current === b.id;
      const { gx, gy, w, d, h } = b;
      const x0 = gx - w / 2, x1 = gx + w / 2;
      const y0 = gy - d / 2, y1 = gy + d / 2;

      const roof = [P(x0, y0, h), P(x1, y0, h), P(x1, y1, h), P(x0, y1, h)];
      const b00 = P(x0, y0, 0), b01 = P(x0, y1, 0), b11 = P(x1, y1, 0);

      poly(ctx, [roof[3], roof[0], b00, b01], isHover ? C.wallLeftHover : C.wallLeft);
      poly(ctx, [roof[3], roof[2], b11, b01], isHover ? C.wallRightHover : C.wallRight);

      // One warm window band: enough to give scale, not enough to add noise
      poly(
        ctx,
        [P(x0, y1, h * 0.62), P(x1, y1, h * 0.62), P(x1, y1, h * 0.34), P(x0, y1, h * 0.34)],
        isHover ? 'rgba(232, 163, 61, 0.30)' : 'rgba(232, 163, 61, 0.15)'
      );

      poly(
        ctx,
        roof,
        isHover ? C.roofHover : b.anchor ? C.roofAnchor : C.roof,
        isHover || b.anchor ? 'rgba(232, 163, 61, 0.5)' : C.edge
      );

      /* A ridge line and a lighter far edge give the flat roof a top plane,
         which is what separates a volume from a box on a grid. */
      const mid = P(gx, gy, h);
      ctx.beginPath();
      ctx.moveTo(roof[0].x, roof[0].y);
      ctx.lineTo(mid.x, mid.y);
      ctx.lineTo(roof[2].x, roof[2].y);
      ctx.strokeStyle = isHover || b.anchor ? 'rgba(232, 163, 61, 0.28)' : 'rgba(247, 240, 228, 0.09)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(roof[0].x, roof[0].y);
      ctx.lineTo(roof[1].x, roof[1].y);
      ctx.strokeStyle = 'rgba(247, 240, 228, 0.07)';
      ctx.stroke();

      /* Warm cornice on the near roof edges: the one lit accent. */
      ctx.beginPath();
      ctx.moveTo(roof[3].x, roof[3].y);
      ctx.lineTo(roof[2].x, roof[2].y);
      ctx.strokeStyle = b.tint;
      ctx.globalAlpha = isHover || b.anchor ? 0.95 : 0.5;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineCap = 'butt';

      /* The merchant's shop gets an awning, so the anchor is unmistakable. */
      if (b.anchor) {
        const aw = 0.22 * h;
        poly(
          ctx,
          [P(x0, y1, h * 0.46), P(x1, y1, h * 0.46), P(x1, y1, h * 0.46 - aw), P(x0, y1, h * 0.46 - aw)],
          isHover ? 'rgba(232, 163, 61, 0.55)' : 'rgba(232, 163, 61, 0.34)'
        );
        poly(
          ctx,
          [P(x0, y1, h * 0.46 - aw), P(x1, y1, h * 0.46 - aw), P(x1, y1, h * 0.46 - aw * 2), P(x0, y1, h * 0.46 - aw * 2)],
          'rgba(232, 163, 61, 0.16)'
        );
      }

      if (b.anchor) {
        const c = P(gx, gy, 0);
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, (w / 2) * scale * 1.15, (w / 2) * scale * 0.55, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(232, 163, 61, 0.22)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const base = P(gx, y1, 0);
      labels.push({ b, x: base.x, y: base.y + 19 });
    });

    /* Labels last, so a nearer building never clips a further building's
       name. The inspector panel carries the states, so the plot stays quiet. */
    labels.forEach(({ b, x, y }) => {
      const isHover = hoverRef.current === b.id;
      ctx.textAlign = 'center';
      ctx.font = `${b.anchor ? 600 : 500} 12.5px "IBM Plex Sans", sans-serif`;
      ctx.fillStyle = b.anchor || isHover ? C.text : C.text2;
      ctx.fillText(b.label, x, y);
    });
  }, [buildings]);

  useEffect(() => {
    draw();
    let raf;
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw, hovered]);

  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  const handleMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const { cx, cy, s } = viewRef.current;
    if (!s) return;
    const relX = (e.clientX - rect.left - cx) / s;
    const relY = (e.clientY - rect.top - cy) / (s * 0.5);
    const wx = (relX + relY) / 2;
    const wy = (relY - relX) / 2;

    let found = null;
    const candidates = [...buildings]
      .map(b => ({ ...b, gx: (b.X + b.Y) / 2, gy: (b.Y - b.X) / 2, depth: b.Y }))
      .sort((a, b) => b.depth - a.depth);
    for (const b of candidates) {
      if (
        wx >= b.gx - b.w / 2 - 0.2 && wx <= b.gx + b.w / 2 + 0.2 &&
        wy >= b.gy - b.d / 2 - 0.2 && wy <= b.gy + b.d / 2 + 0.2
      ) { found = b.id; break; }
    }
    if (found !== hoverRef.current) setHovered(found);
  };

  const handleClick = () => {
    if (hovered) onSelectBuilding?.(hovered);
  };

  const handleKey = (e) => {
    const ids = buildings.map(b => b.id);
    const i = ids.indexOf(hovered);
    if (e.key === 'Enter' || e.key === ' ') {
      if (hovered) { e.preventDefault(); onSelectBuilding?.(hovered); }
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); setHovered(ids[(i + 1 + ids.length) % ids.length]);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); setHovered(ids[(i - 1 + ids.length) % ids.length]);
    }
    if (e.key === 'Escape') setHovered(null);
  };

  const active = buildings.find(b => b.id === hovered);

  return (
    <div className="town-wrap">
      <div className="town-canvas-frame">
        <div className="town-stage">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMove}
            onMouseLeave={() => setHovered(null)}
            onClick={handleClick}
            onKeyDown={handleKey}
            tabIndex={0}
            style={{ width: '100%', height: '100%', display: 'block', cursor: hovered ? 'pointer' : 'default' }}
            role="application"
            aria-label={`Your digital shop at level ${level}. Arrow keys move between the five buildings, Enter opens one. The list beside the plot does the same thing.`}
          />
          <p className="town-legend">
            Each building is one engine of the business. Select one to open it.
          </p>
        </div>

        <aside className="town-inspector" aria-label="Town buildings">
          <div className="town-inspector-head">
            <span className="eyebrow">Level {level}</span>
            <span className="mono town-inspector-xp">{xp}/600 XP</span>
          </div>
          <p className="town-inspector-level">
            {level === 3 ? 'Digital Vyapari' : 'Mohalla Merchant'}
          </p>

          <ul className="town-list">
            {buildings.map(b => (
              <li key={b.id}>
                <button
                  className={`town-list-item${hovered === b.id ? ' is-hover' : ''}${b.anchor ? ' is-anchor' : ''}`}
                  onMouseEnter={() => setHovered(b.id)}
                  onMouseLeave={() => setHovered((h) => (h === b.id ? null : h))}
                  onFocus={() => setHovered(b.id)}
                  onBlur={() => setHovered((h) => (h === b.id ? null : h))}
                  onClick={() => onSelectBuilding?.(b.engine)}
                >
                  <span className="town-list-dot" style={{ background: b.tint }} aria-hidden="true" />
                  <span className="town-list-text">
                    <span className="town-list-label">{b.label}</span>
                    <span className="town-list-state">{b.state}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {active && (
            <p className="town-inspector-note">
              {{
                warehouse: 'Pack and label to marketplace spec.',
                studio: 'Turn one shot into four marketplace assets.',
                shop: 'The master product record everything starts from.',
                tower: 'Segment and message your WhatsApp customers.',
                observatory: 'Model the profit before you spend the money.'
              }[active.id]}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}