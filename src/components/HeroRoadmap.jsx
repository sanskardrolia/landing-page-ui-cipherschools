import { useEffect, useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroRoadmap.css';

/* ══════════════════════════════════════════════════════════════
   Home hero › right side: "What you'll master", one feature card at
   a time. Card style follows the bento "feature card" pattern: a
   quiet title + one-line subtitle, then a small, believable piece of
   product UI (board, pipeline, diagram, chart, task card, live session).
   Neutral by default; brand orange marks the one thing that matters
   in each card; hatched fills mean "not yet".
   Auto-advances (paused on hover; stops once the visitor navigates).
   ══════════════════════════════════════════════════════════════ */

/* 1 · DSA — a problem board: three days × two topics */
const DsaUI = () => (
  <div className="fc-board">
    <div className="fc-board-head">
      <span className="fc-nav"><ChevronLeft size={12} /><ChevronRight size={12} /></span>
      <span>MON</span><span>TUE</span><span>WED</span>
    </div>
    <div className="fc-board-row">
      <span className="fc-board-label">Arrays</span>
      <span className="fc-chip"><b>Two Sum</b><small>Easy · Solved</small></span>
      <span className="fc-hatch" />
      <span className="fc-chip"><b>3Sum</b><small>Medium · Solved</small></span>
    </div>
    <div className="fc-board-row">
      <span className="fc-board-label">Graphs</span>
      <span className="fc-hatch" />
      <span className="fc-chip is-hot"><b>Topo Sort</b><small>Medium · Today</small></span>
      <span className="fc-hatch" />
    </div>
  </div>
);

/* 2 · Development — build steps of a real project */
const DevUI = () => (
  <div className="fc-window">
    <div className="fc-window-bar"><i /><i /><i /><span>shopkart · MERN</span></div>
    <ul className="fc-steps">
      {[['Auth & JWT', 'Done'], ['Cart API', 'Done'], ['Payments', 'Done'], ['Deploy to cloud', 'Building…']].map(([t, st], i) => (
        <li key={t} className={st === 'Done' ? '' : 'is-hot'} style={{ '--i': i }}>
          <span className="fc-tick">{st === 'Done' && <Check size={11} strokeWidth={3} />}</span>{t}<em>{st}</em>
        </li>
      ))}
    </ul>
  </div>
);

/* 3 · System Design — a small diagram with a metric tooltip */
const DesignUI = () => (
  <div className="fc-sd">
    <span className="fc-tip">Throughput: 10k rps</span>
    <span className="fc-node n1">Client</span>
    <span className="fc-node n2 is-hot">Load balancer</span>
    <span className="fc-node n3">API</span>
    <span className="fc-node n4">API</span>
    <span className="fc-node n5">DB</span>
    <svg viewBox="0 0 300 150" preserveAspectRatio="none" aria-hidden="true">
      <path d="M62 92 H104" /><path d="M196 84 L222 52" /><path d="M196 100 L222 132" /><path d="M262 60 L270 88" /><path d="M262 124 L270 104" />
    </svg>
  </div>
);

/* 4 · AI-assisted tests — scores across stages, one highlighted */
const TestUI = () => (
  <div className="fc-chart">
    <div className="fc-bars">
      {[['S1', 86, true], ['S2', 62], ['S3', 54], ['S4', 74], ['S5', 66], ['S6', 48]].map(([k, v, hot], i) => (
        <div key={k} className={`fc-bar ${hot ? 'is-hot' : ''}`} style={{ '--v': `${v}%`, '--i': i }}>
          {hot && <span className="fc-tip">Score: {v}%</span>}
          <span className="fc-bar-track"><i /></span>
          <small>{k}</small>
        </div>
      ))}
    </div>
  </div>
);

/* 5 · Vibe coding & debugging — the current task, flanked by others */
const VibeUI = () => (
  <div className="fc-task">
    <span className="fc-task-ghost is-l" />
    <div className="fc-task-card">
      <div className="fc-task-top"><span className="fc-dot" /> Current task <em>In progress</em></div>
      <p>Fix: cart total is off by one</p>
      <div className="fc-task-meta"><span>Mode: <b>Debugging</b></span><span>AI hints: <b>2</b></span></div>
    </div>
    <span className="fc-task-ghost is-r" />
  </div>
);

/* 6 · Mock interviews — a live session with named cursors */
const Pointer = () => <svg width="14" height="16" viewBox="0 0 18 20" aria-hidden="true"><path d="M1.5 1.5 16 9.2l-6.4 1.6-3 6.7z" /></svg>;
const MockUI = () => (
  <div className="fc-live">
    <div className="fc-window">
      <div className="fc-window-bar"><i /><i /><i /><span>Mock interview · live</span></div>
      <ul className="fc-rows">
        {[['Approach', 92, 58], ['Code', 70, 44], ['Communication', 84, 62]].map(([k, a, b]) => (
          <li key={k}><span>{k}</span><i style={{ '--w': `${a}%` }} /><i style={{ '--w': `${b}%` }} /></li>
        ))}
      </ul>
    </div>
    <span className="fc-cursor c1"><Pointer /><em>Interviewer</em></span>
    <span className="fc-cursor c2 is-hot"><Pointer /><em>You</em></span>
  </div>
);

const CARDS = [
  { id: 'dsa', title: 'DSA', text: 'Topic by topic, from arrays to DP, with 1,200+ problems.', UI: DsaUI },
  { id: 'dev', title: 'Development', text: 'Build and ship real MERN or Java full-stack projects.', UI: DevUI },
  { id: 'sd', title: 'System Design', text: 'Design, practice and test HLD and LLD under real load.', UI: DesignUI },
  { id: 'ai', title: 'AI-Assisted Coding Tests', text: 'Proctored tests that review your approach, not just output.', UI: TestUI },
  { id: 'vibe', title: 'Vibe Coding & Debugging', text: 'Build with AI and fix real broken code, like on the job.', UI: VibeUI },
  { id: 'mock', title: 'Mock Interviews', text: 'Company-specific rounds with feedback you can act on.', UI: MockUI }
];
const N = CARDS.length;
const AUTO_MS = 4200;
const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const HeroRoadmap = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (paused || touched || reduced()) return undefined;
    const t = setTimeout(() => setActive((a) => (a + 1) % N), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, paused, touched]);

  const go = (i) => { setTouched(true); setActive(((i % N) + N) % N); };
  const c = CARDS[active];

  return (
    <div
      className="fcx"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(active + 1); if (e.key === 'ArrowLeft') go(active - 1); }}
      aria-roledescription="carousel"
      aria-label="What you'll master"
    >
      <div className="fcx-head">
        <span className="fcx-kicker">What you&apos;ll master</span>
        <span className="fcx-count">{String(active + 1).padStart(2, '0')} <i>/ {String(N).padStart(2, '0')}</i></span>
      </div>

      {/* one card at a time; a soft second card sits behind it */}
      <div className="fcx-stage">
        <span className="fcx-behind" aria-hidden="true" />
        <article key={c.id} className="fcx-card" aria-live="polite">
          <header>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </header>
          <div className="fcx-ui"><c.UI /></div>
        </article>
      </div>

      <div className="fcx-nav">
        <button type="button" className="fcx-arrow" onClick={() => go(active - 1)} aria-label="Previous"><ChevronLeft size={16} /></button>
        <div className="fcx-dots" role="tablist" aria-label="Tracks">
          {CARDS.map((x, i) => (
            <button key={x.id} type="button" role="tab" aria-selected={active === i} aria-label={x.title} title={x.title}
              className={active === i ? 'is-on' : ''} onClick={() => go(i)}>
              {active === i && !paused && !touched && <span key={`p-${active}`} />}
            </button>
          ))}
        </div>
        <button type="button" className="fcx-arrow" onClick={() => go(active + 1)} aria-label="Next"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
};

export default HeroRoadmap;
