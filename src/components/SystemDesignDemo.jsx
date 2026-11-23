import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, Database, Globe, Layers, Pause, Play, RotateCcw, Server, Shuffle, Zap
} from 'lucide-react';
import './SystemDesignDemo.css';

/* ══════════════════════════════════════════════════════════════
   Home › "What you can do beyond lectures": a played-out system
   design practice problem. A learner drags blocks onto the board,
   connects them, runs 10k req/s — one API server buckles (503s,
   slow p99) — then adds a load balancer, a second server and a
   cache, runs again and passes. Loops; Pause / Replay; the visitor
   can also press Run themselves at any point.
   Coordinates are % of the board.
   ══════════════════════════════════════════════════════════════ */

const KINDS = {
  client: { label: 'Clients', short: 'Clients', Icon: Globe },
  lb: { label: 'Load balancer', short: 'LB', Icon: Shuffle },
  api: { label: 'API server', short: 'API', Icon: Server },
  cache: { label: 'Cache', short: 'Cache', Icon: Zap },
  db: { label: 'Database', short: 'DB', Icon: Database }
};
const PALETTE = ['client', 'lb', 'api', 'cache', 'db'];
const paletteY = (kind) => 16 + PALETTE.indexOf(kind) * 17; // where each block sits in the left tray
const TRAY_X = 7;

// Where blocks end up on the board
const SPOTS = {
  client: { x: 25, y: 50 },
  api1: { x: 55, y: 50 },
  db: { x: 85, y: 50 },
  lb: { x: 42, y: 50 },
  api1b: { x: 62, y: 28 },
  api2: { x: 62, y: 72 },
  cache: { x: 86, y: 24 },
  db2: { x: 86, y: 72 }
};

const EMPTY = { nodes: {}, edges: [], status: 'idle', cursor: { x: 70, y: 110, down: false }, note: '' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SystemDesignDemo = () => {
  const [s, setS] = useState(EMPTY);
  const [playing, setPlaying] = useState(true);
  const runId = useRef(0);
  const set = useCallback((patch) => setS((p) => ({ ...p, ...(typeof patch === 'function' ? patch(p) : patch) })), []);

  /* ── The script ── */
  const play = useCallback(async () => {
    const id = ++runId.current;
    const alive = () => runId.current === id;
    const wait = async (ms) => { await sleep(ms); return alive(); };
    const cursor = (x, y, down = false) => set({ cursor: { x, y, down } });
    const place = (nid, kind, pos) => set((p) => ({ nodes: { ...p.nodes, [nid]: { kind, ...pos, fresh: true } } }));
    const move = (nid, pos) => set((p) => ({ nodes: { ...p.nodes, [nid]: { ...p.nodes[nid], ...pos, fresh: false } } }));
    const edge = (a, b) => set((p) => ({ edges: [...p.edges, [a, b]] }));
    const drag = async (nid, kind, to) => {
      const from = { x: TRAY_X, y: paletteY(kind) };
      cursor(from.x, from.y); if (!(await wait(650))) return false;
      cursor(from.x, from.y, true); place(nid, kind, from); if (!(await wait(180))) return false;
      cursor(to.x, to.y, true); move(nid, to); if (!(await wait(900))) return false;
      cursor(to.x, to.y, false); return wait(250);
    };
    const run = async (result) => {
      cursor(91, 92); if (!(await wait(700))) return false;
      cursor(91, 92, true); set({ status: 'running', note: 'Sending 10,000 requests / second…' });
      if (!(await wait(200))) return false; cursor(91, 92, false);
      if (!(await wait(1800))) return false;
      set(result === 'fail'
        ? { status: 'fail', note: '' }
        : { status: 'pass', note: '' });
      return true;
    };

    // one full take; returns false if stopped
    const take = async () => {
    set({ ...EMPTY, note: 'Design: a URL shortener that serves 10k req/s' });
    if (!(await wait(900))) return false;

    // Attempt 1: client → one API server → database
    if (!(await drag('client', 'client', SPOTS.client))) return false;
    if (!(await drag('api1', 'api', SPOTS.api1))) return false;
    if (!(await drag('db', 'db', SPOTS.db))) return false;
    edge('client', 'api1'); if (!(await wait(350))) return false;
    edge('api1', 'db'); if (!(await wait(500))) return false;
    if (!(await run('fail'))) return false;
    if (!(await wait(2600))) return false;

    // Fix: load balancer + a second server + cache
    set({ status: 'idle', note: 'Fix: spread the load and cache hot reads' });
    if (!(await wait(500))) return false;
    set({ edges: [] });
    move('api1', SPOTS.api1b); move('db', SPOTS.db2);
    if (!(await wait(600))) return false;
    if (!(await drag('lb', 'lb', SPOTS.lb))) return false;
    if (!(await drag('api2', 'api', SPOTS.api2))) return false;
    if (!(await drag('cache', 'cache', SPOTS.cache))) return false;
    for (const [a, b] of [['client', 'lb'], ['lb', 'api1'], ['lb', 'api2'], ['api1', 'cache'], ['api2', 'cache'], ['api1', 'db'], ['api2', 'db']]) {
      edge(a, b); if (!(await wait(220))) return false;
    }
    if (!(await run('pass'))) return false;
    return wait(3800);
    };
    while (alive() && (await take()));
  }, [set]);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (playing && !reduce) play();
    return () => { runId.current += 1; };
  }, [playing, play]);

  // Visitor presses Run: judge whatever is on the board right now
  const runNow = () => {
    runId.current += 1; setPlaying(false);
    const n = s.nodes;
    const wired = (a, b) => s.edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
    if (!n.client || !n.api1 || !n.db) { set({ status: 'idle', note: 'Add clients, an API server and a database first' }); return; }
    // passes only with the load balancer, two servers and everything connected
    const ok = !!(n.lb && n.api2) && wired('client', 'lb') && wired('lb', 'api1') && wired('lb', 'api2') && wired('api1', 'db') && wired('api2', 'db');
    const anyPath = wired('client', 'api1') || wired('client', 'lb');
    if (!anyPath) { set({ status: 'idle', note: 'Connect the blocks first, then run the load test' }); return; }
    set({ status: 'running', note: 'Sending 10,000 requests / second…' });
    setTimeout(() => set({ status: ok ? 'pass' : 'fail', note: '' }), 1600);
  };
  const replay = () => { runId.current += 1; setS(EMPTY); setPlaying(false); setTimeout(() => setPlaying(true), 30); };

  const { nodes, edges, status, cursor, note } = s;
  const hot = status === 'fail' ? 'api1' : null;

  return (
    <div className={`sdd is-${status}`}>
      <div className="sdd-bar">
        <span className="sdd-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="sdd-title">System Design · Practice</span>
        <span className="sdd-problem">URL shortener · 10k req/s</span>
        <div className="sdd-ctrl">
          <button type="button" onClick={() => setPlaying((v) => !v)} aria-label={playing ? 'Pause demo' : 'Play demo'}>{playing ? <Pause size={14} /> : <Play size={14} />}</button>
          <button type="button" onClick={replay} aria-label="Replay demo"><RotateCcw size={14} /></button>
          <button type="button" className="sdd-run" onClick={runNow}><Play size={13} /> Run load test</button>
        </div>
      </div>

      <div className="sdd-board" role="img" aria-label="A learner drags system design blocks, connects them, runs a load test that fails, adds a load balancer, second server and cache, and passes.">
        {/* tray */}
        <div className="sdd-tray">
          {PALETTE.map((k) => {
            const K = KINDS[k];
            return <span key={k} className="sdd-chip" style={{ top: `${paletteY(k)}%` }}><K.Icon size={14} /> <b className="sdd-l">{K.label}</b><b className="sdd-s">{K.short}</b></span>;
          })}
        </div>

        {/* wires */}
        <svg className="sdd-wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {edges.map(([a, b]) => nodes[a] && nodes[b] && (
            <line key={`${a}-${b}`} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
              className={`${status === 'running' ? 'is-flow' : ''} ${status === 'fail' && (a === 'api1' || b === 'api1') ? 'is-bad' : ''} ${status === 'pass' ? 'is-good' : ''}`} />
          ))}
        </svg>

        {/* blocks */}
        {Object.entries(nodes).map(([nid, n]) => {
          const K = KINDS[n.kind];
          return (
            <div key={nid} className={`sdd-node k-${n.kind} ${hot === nid ? 'is-hot' : ''} ${status === 'pass' ? 'is-ok' : ''}`} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <K.Icon size={15} /> <span><b className="sdd-l">{K.label}</b><b className="sdd-s">{K.short}</b></span>
              {hot === nid && <em className="sdd-badge"><AlertTriangle size={11} /> CPU 100%</em>}
            </div>
          );
        })}

        {/* result */}
        <div className="sdd-result" aria-live="polite">
          {status === 'running' && <p className="is-run"><span className="sdd-spin" /> {note}</p>}
          {status === 'fail' && (
            <p className="is-fail"><AlertTriangle size={15} /> <strong>Failed</strong> 38% errors (503) · p99 2.4s · one server can&apos;t take 10k req/s</p>
          )}
          {status === 'pass' && (
            <p className="is-pass"><CheckCircle2 size={15} /> <strong>Passed</strong> 0.1% errors · p99 140ms · cache hit rate 82%</p>
          )}
          {status === 'idle' && note && <p className="is-note"><Layers size={14} /> {note}</p>}
        </div>

        {/* the learner's cursor */}
        <span className={`sdd-cursor ${cursor.down ? 'is-down' : ''}`} style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }} aria-hidden="true">
          <svg width="18" height="20" viewBox="0 0 18 20"><path d="M1.5 1.5 16 9.2l-6.4 1.6-3 6.7z" fill="#111827" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        </span>
      </div>
    </div>
  );
};

export default SystemDesignDemo;
