import { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';
import AiOrb from '../components/AiOrb';

/* ══════════════════════════════════════════════════════════════
   Small floating chips around the waitlist hero: code, binary, A.I.,
   interview, tests. Each drifts a little with the cursor (parallax by
   depth) and does one small thing when you hover or tap it.
   Wide screens only (hidden under 1000px so they never cover the copy).
   ══════════════════════════════════════════════════════════════ */

/* 8 bits you can flip: hover or tap a bit, the letter it spells updates */
const Binary = () => {
  const [bits, setBits] = useState([0, 1, 0, 0, 0, 0, 1, 1]); // 'C'
  const flip = (i) => setBits((b) => b.map((v, j) => (j === i ? 1 - v : v)));
  const code = parseInt(bits.join(''), 2);
  const ch = code >= 33 && code <= 126 ? String.fromCharCode(code) : '·';
  return (
    <span className="wl-dd-bin">
      {bits.map((v, i) => (
        <button key={i} type="button" className={v ? 'is-on' : ''} onPointerEnter={(e) => e.pointerType === 'mouse' && flip(i)} onClick={() => flip(i)} aria-label={`Bit ${i + 1}: ${v}`}>{v}</button>
      ))}
      <em aria-live="polite">= {ch}</em>
    </span>
  );
};

/* mock interview: the voice bars and timer run while hovered */
const Interview = () => {
  const [on, setOn] = useState(false);
  const [sec, setSec] = useState(42);
  useEffect(() => {
    if (!on) return undefined;
    const t = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [on]);
  return (
    <span className={`wl-dd-int ${on ? 'is-on' : ''}`} onPointerEnter={() => setOn(true)} onPointerLeave={() => setOn(false)}>
      <span className="wl-dd-mic"><Mic size={13} /></span>
      <span className="wl-dd-int-txt"><b>Mock interview</b><small>{on ? 'Listening' : 'Round 2 · system design'}</small></span>
      <span className="wl-dd-bars" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      <span className="wl-dd-time">{String(Math.floor(sec / 60)).padStart(2, '0')}:{String(sec % 60).padStart(2, '0')}</span>
    </span>
  );
};

/* A.I. orb: thinks while hovered, then answers */
const Ai = () => {
  const [on, setOn] = useState(false);
  return (
    <span className={`wl-dd-ai ${on ? 'is-on' : ''}`} onPointerEnter={() => setOn(true)} onPointerLeave={() => setOn(false)}>
      <AiOrb size={22} thinking={on} />
      <span className="wl-dd-ai-txt">
        <span>Explain this code?</span>
        <span>Thinking<i>.</i><i>.</i><i>.</i></span>
      </span>
    </span>
  );
};

const CHIPS = [
  { id: 'code', x: '7%', y: '24%', depth: 18, rot: -4, node: (
    <span className="wl-dd-code">
      <span><i className="k">const</i> you <i className="p">=</i> <i className="s">&apos;ready&apos;</i>;</span>
      <span className="wl-dd-code-2"><i className="c">{'// ai.review(): looks good'}</i></span>
    </span>
  ) },
  { id: 'bin', x: '9%', y: '68%', depth: 30, rot: 3, node: <Binary /> },
  { id: 'ai', x: '79%', y: '22%', depth: 24, rot: 3, node: <Ai /> },
  { id: 'int', x: '76%', y: '64%', depth: 14, rot: -3, node: <Interview /> },
  { id: 'test', x: '4%', y: '47%', depth: 40, rot: -2, node: (
    <span className="wl-dd-test"><span className="wl-dd-dot" /> <b>4/4</b> tests passed</span>
  ) },
  { id: 'brace', x: '86%', y: '44%', depth: 46, rot: 8, node: <span className="wl-dd-glyph">{'{ }'}</span> },
];

const WaitlistDoodles = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', ((e.clientX / innerWidth) - 0.5).toFixed(3));
        el.style.setProperty('--my', ((e.clientY / innerHeight) - 0.5).toFixed(3));
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} className="wl-dd">
      {CHIPS.map((c, i) => (
        <div key={c.id} className={`wl-dd-item is-${c.id}`} style={{ left: c.x, top: c.y, '--d': c.depth, '--r': `${c.rot}deg`, '--n': i }}>
          <div className="wl-dd-float">{c.node}</div>
        </div>
      ))}
    </div>
  );
};

export default WaitlistDoodles;
