import { useEffect, useState } from 'react';

/* ══════════════════════════════════════════════════════════════
   "Experience before you pay" splash: a white wall takes a hit,
   brand-orange cracks race out from the centre, then the wall
   shatters into shards that fly off to reveal the dashboard.
   Plays once per preview entry; click/tap or Esc skips it.
   ══════════════════════════════════════════════════════════════ */

const TOTAL_MS = 2300;

/* ── Geometry, built once (seeded, so it's the same every time) ── */
const seeded = (s) => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
const rnd = seeded(20251113);
const C = { x: 50, y: 47 };          // impact point, in % of the screen
const RAYS = 11;

// Where a ray from C at angle `a` meets the screen edge (0–100 box)
const edgeAt = (a) => {
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const tx = dx > 0 ? (100 - C.x) / dx : dx < 0 ? -C.x / dx : Infinity;
  const ty = dy > 0 ? (100 - C.y) / dy : dy < 0 ? -C.y / dy : Infinity;
  const t = Math.min(tx, ty);
  return { x: C.x + dx * t, y: C.y + dy * t };
};

const angles = Array.from({ length: RAYS }, (_, i) => (i / RAYS) * Math.PI * 2 + (rnd() - 0.5) * 0.35);

// Each crack is a jagged line from the centre to the edge
const rays = angles.map((a) => {
  const end = edgeAt(a);
  const pts = [C];
  for (let k = 1; k <= 5; k++) {
    const f = k / 6;
    const j = (rnd() - 0.5) * 5;
    pts.push({ x: C.x + (end.x - C.x) * f - Math.sin(a) * j, y: C.y + (end.y - C.y) * f + Math.cos(a) * j });
  }
  pts.push(end);
  return { a, pts };
});

// Short side branches off each crack
const branches = rays.flatMap((r) => [2, 4].map((k) => {
  const p = r.pts[k];
  const b = r.a + (rnd() > 0.5 ? 1 : -1) * (0.5 + rnd() * 0.5);
  const len = 5 + rnd() * 9;
  return [p, { x: p.x + Math.cos(b) * len * 0.55, y: p.y + Math.sin(b) * len * 0.55 + (rnd() - 0.5) * 2 }, { x: p.x + Math.cos(b) * len, y: p.y + Math.sin(b) * len }];
}));

// A broken ring around the impact
const ring = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  const r = 6 + rnd() * 2.5;
  return { x: C.x + Math.cos(a) * r * 0.62, y: C.y + Math.sin(a) * r };
});

// Shards: the wall between two neighbouring cracks, walking the screen corners in between
const CORNERS = [{ x: 100, y: 100 }, { x: 0, y: 100 }, { x: 0, y: 0 }, { x: 100, y: 0 }];
const angleOf = (p) => { const v = Math.atan2(p.y - C.y, p.x - C.x); return v < 0 ? v + Math.PI * 2 : v; };
const norm = (v) => ((v % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
const shards = rays.map((r, i) => {
  const next = rays[(i + 1) % RAYS];
  const a0 = norm(r.a);
  const span = norm(next.a - r.a);
  const corners = CORNERS
    .map((c) => ({ c, d: norm(angleOf(c) - a0) }))
    .filter(({ d }) => d > 0 && d < span)
    .sort((p, q) => p.d - q.d)
    .map(({ c }) => c);
  const poly = [...r.pts, ...corners, ...[...next.pts].reverse()];
  const mid = r.a + span / 2;
  return {
    clip: `polygon(${poly.map((p) => `${p.x.toFixed(2)}% ${p.y.toFixed(2)}%`).join(', ')})`,
    dx: `${(Math.cos(mid) * (55 + rnd() * 35)).toFixed(1)}vw`,
    dy: `${(Math.sin(mid) * (55 + rnd() * 35) + 25).toFixed(1)}vh`,
    rot: `${((rnd() - 0.5) * 70).toFixed(0)}deg`,
    delay: `${(rnd() * 0.12).toFixed(2)}s`
  };
});

// Points are kept in %, the SVG is drawn in real pixels so strokes stay even and the draw-in works
const line = (pts, w, h) => pts.map((p) => `${(p.x * w / 100).toFixed(1)},${(p.y * h / 100).toFixed(1)}`).join(' ');

const DashboardPreviewSplash = ({ onDone }) => {
  const [{ w, h }] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(onDone, reduced ? 0 : TOTAL_MS);
    const onKey = (e) => { if (e.key === 'Escape') onDone(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [onDone]);

  return (
    <div className="dx-crack" onClick={onDone} role="presentation" aria-hidden="true">
      {/* The wall, already cut into shards that hold still until it shatters */}
      {shards.map((s, i) => (
        <div
          key={i}
          className="dx-crack-shard"
          style={{ clipPath: s.clip, '--dx': s.dx, '--dy': s.dy, '--rot': s.rot, '--d': s.delay }}
        />
      ))}

      <svg className="dx-crack-lines" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <polygon className="dx-crack-ring" points={line(ring, w, h)} pathLength="1" />
        {rays.map((r, i) => (
          <polyline key={`r${i}`} className="dx-crack-main" points={line(r.pts, w, h)} pathLength="1" style={{ '--d': `${0.18 + i * 0.025}s` }} />
        ))}
        {branches.map((b, i) => (
          <polyline key={`b${i}`} className="dx-crack-branch" points={line(b, w, h)} pathLength="1" style={{ '--d': `${0.45 + (i % 6) * 0.05}s` }} />
        ))}
      </svg>
      <div className="dx-crack-flash" />
      <div className="dx-crack-copy">
        <img src="/cipherschools-logo.png" alt="" />
        <strong>Experience before you pay</strong>
        <span>Breaking in…</span>
      </div>
    </div>
  );
};

export default DashboardPreviewSplash;
