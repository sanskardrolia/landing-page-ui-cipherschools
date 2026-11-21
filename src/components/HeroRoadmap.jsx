import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Check, ChevronLeft, ChevronRight, Code2, Layers, Mic, Network, Timer, Wand2 } from 'lucide-react';
import './HeroRoadmap.css';

/* ══════════════════════════════════════════════════════════════
   Home hero › right side: "What you'll master" as a stack of cards,
   one per topic, each with a tiny live visual. The front card
   auto-advances (paused on hover); click it, swipe it, use the
   arrows / ← → keys, or pick a topic from the row below.
   Neutral palette: ink + greys.
   ══════════════════════════════════════════════════════════════ */

/* Small visuals, one per card (only the front card animates) */
const DsaVisual = () => (
  <ul className="hs2-list">
    {[['Two Sum', 'Easy', true], ['Longest Substring', 'Medium', true], ['Merge K Lists', 'Hard', false]].map(([t, d, ok], i) => (
      <li key={t} style={{ '--i': i }}>
        <span className={`hs2-box ${ok ? 'is-ok' : ''}`}>{ok && <Check size={11} strokeWidth={3} />}</span>
        <span className="hs2-list-t">{t}</span>
        <em className={`hs2-diff is-${d.toLowerCase()}`}>{d}</em>
      </li>
    ))}
  </ul>
);
const DevVisual = () => (
  <div className="hs2-dev">
    <div className="hs2-code">
      {[62, 84, 48, 72].map((w, i) => <i key={i} style={{ '--w': `${w}%`, '--i': i }} />)}
    </div>
    <div className="hs2-chips">{['React', 'Node', 'MongoDB', 'Spring Boot'].map((c) => <span key={c}>{c}</span>)}</div>
  </div>
);
const DesignVisual = () => (
  <div className="hs2-sd">
    <span className="n n1">Client</span>
    <span className="n n2">Load balancer</span>
    <span className="n n3">API</span>
    <span className="n n4">Cache</span>
    <span className="n n5">DB</span>
    <svg viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true">
      <path d="M44 22 H112" /><path d="M188 22 H236" /><path d="M262 34 V58 C262 70 250 76 236 76 H190" /><path d="M150 76 H112" /><path d="M150 88 V96" />
    </svg>
  </div>
);
const TestVisual = () => (
  <div className="hs2-test">
    <div className="hs2-test-top"><span>Q 2 / 3 · <span className="hs2-rec" /> Proctored</span><b><Timer size={11} /> 38:42</b></div>
    <div className="hs2-review">
      <span className="hs2-ai"><Bot size={12} /> AI review</span>
      <p><Check size={11} strokeWidth={3} /> Approach explained</p>
      <p><Check size={11} strokeWidth={3} /> O(n) solution</p>
    </div>
  </div>
);
const VibeVisual = () => (
  <div className="hs2-vibe">
    <p className="hs2-prompt">“Add a dark-mode toggle”</p>
    <div className="hs2-diff-lines">
      <i className="del" style={{ '--w': '70%' }} /><i className="add" style={{ '--w': '82%' }} /><i className="add" style={{ '--w': '56%' }} />
    </div>
    <span className="hs2-bug"><Check size={11} strokeWidth={3} /> Bug fixed on line 12</span>
  </div>
);
const MockVisual = () => (
  <div className="hs2-mock">
    <div className="hs2-wave">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
    <div className="hs2-scores">
      {[['Problem solving', 82], ['Communication', 74]].map(([k, v]) => (
        <div key={k}><span>{k}</span><b><i style={{ '--v': `${v}%` }} /></b></div>
      ))}
    </div>
  </div>
);

const CARDS = [
  { id: 'dsa', title: 'DSA', text: 'Arrays to DP · 1,200+ questions', Icon: Code2, tag: 'Most asked', Visual: DsaVisual },
  { id: 'dev', title: 'Development', text: 'MERN or Java Full Stack', Icon: Layers, tag: 'In demand', Visual: DevVisual },
  { id: 'sd', title: 'System Design', text: 'Design, practice & test: HLD + LLD', Icon: Network, tag: 'Trending', Visual: DesignVisual },
  { id: 'ai', title: 'AI-Assisted Coding Tests', text: 'Approach-based, AI-reviewed, proctored', Icon: Bot, tag: 'New', Visual: TestVisual },
  { id: 'vibe', title: 'Vibe Coding & Debugging', text: 'Build with AI, fix real broken code', Icon: Wand2, tag: 'Hot', Visual: VibeVisual },
  { id: 'mock', title: 'Mock Interviews', text: 'Company-specific, with feedback', Icon: Mic, tag: 'Placement-ready', Visual: MockVisual }
];
const N = CARDS.length;
const AUTO_MS = 3200;
const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const HeroRoadmap = () => {
  const [active, setActive] = useState(0);
  const [left, setLeft] = useState(null);   // the card that just flew off (animates to the back)
  const [paused, setPaused] = useState(false);
  const [drag, setDrag] = useState(0);
  const start = useRef(null);

  const go = useCallback((to) => {
    setActive((a) => {
      const next = ((to ?? a + 1) % N + N) % N;
      if (next !== a) setLeft(a);
      return next;
    });
  }, []);

  useEffect(() => {
    if (paused || reduced()) return undefined;
    const t = setTimeout(() => go(), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, paused, go]);

  // Swipe / drag the front card
  const onDown = (e) => { start.current = e.clientX; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const onMove = (e) => { if (start.current != null) setDrag(e.clientX - start.current); };
  const onUp = () => {
    if (start.current == null) return;
    const dx = drag;
    start.current = null;
    setDrag(0);
    if (Math.abs(dx) > 70) go(dx < 0 ? active + 1 : active - 1);
    else if (Math.abs(dx) < 6) go();               // a tap: next card
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };

  return (
    <div
      className="hs2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="What you'll master"
    >
      <div className="hs2-head">
        <span className="hs2-kicker">What you&apos;ll master</span>
        <span className="hs2-count">{String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
      </div>

      <div className="hs2-stack" tabIndex={0} onKeyDown={onKey} aria-live="polite">
        {CARDS.map((c, i) => {
          const d = (i - active + N) % N;           // 0 = front
          const isFront = d === 0;
          const style = {
            '--d': d,
            zIndex: N - d,
            ...(isFront && drag ? { transform: `translateX(${drag}px) rotate(${drag / 18}deg)`, transition: 'none' } : {})
          };
          return (
            <article
              key={c.id}
              className={`hs2-card ${isFront ? 'is-front' : ''} ${left === i ? 'is-left' : ''} ${d > 3 ? 'is-hidden' : ''}`}
              style={style}
              aria-hidden={!isFront}
              onPointerDown={isFront ? onDown : undefined}
              onPointerMove={isFront ? onMove : undefined}
              onPointerUp={isFront ? onUp : undefined}
              onPointerCancel={isFront ? onUp : undefined}
              onAnimationEnd={() => left === i && setLeft(null)}
            >
              <header className="hs2-card-head">
                <span className="hs2-icon"><c.Icon size={18} /></span>
                <span className="hs2-titles">
                  <strong>{c.title}</strong>
                  <small>{c.text}</small>
                </span>
                <em className="hs2-tag">{c.tag}</em>
              </header>
              <div className="hs2-visual"><c.Visual /></div>
              <footer className="hs2-card-foot">
                {['Learn', 'Practice', 'Test', 'Mock'].map((p) => <span key={p}><Check size={10} strokeWidth={3} /> {p}</span>)}
              </footer>
            </article>
          );
        })}
      </div>

      {/* Controls: arrows + a row of topics */}
      <div className="hs2-nav">
        <button type="button" className="hs2-arrow" onClick={() => go(active - 1)} aria-label="Previous topic"><ChevronLeft size={16} /></button>
        <div className="hs2-pills" role="tablist" aria-label="Topics">
          {CARDS.map((c, i) => (
            <button key={c.id} type="button" role="tab" aria-selected={active === i} className={active === i ? 'is-on' : ''} onClick={() => go(i)} title={c.title}>
              <c.Icon size={14} />
              {active === i && <span>{c.title}</span>}
            </button>
          ))}
        </div>
        <button type="button" className="hs2-arrow" onClick={() => go(active + 1)} aria-label="Next topic"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
};

export default HeroRoadmap;
