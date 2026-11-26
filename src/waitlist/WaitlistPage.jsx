import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Copy, Download, Loader2, Sparkles, X } from 'lucide-react';
import { markWaitlistSeen } from './waitlistGate';
import QRCode from 'qrcode';
import WaitlistPass from './WaitlistPass';
import WaitlistDoodles from './WaitlistDoodles';
import { REFERRAL_GOAL, downloadPass, isEmail, joinWaitlist, nameFrom, pad, referralsFor, shareText, shareUrl, waitingCount } from './waitlistUtils';
import './waitlist.css';

/* ══════════════════════════════════════════════════════════════
   /waitlist — standalone DEMO page (own route, no site navbar or
   footer, lazy-loaded so the main site's bundle is untouched).
   Minimal white layout: one headline, one input. The pass card stays
   hidden until you join: a pixel splash then dissolves into the pass page.
   DEMO: nothing is sent; see waitlistUtils.js.
   ══════════════════════════════════════════════════════════════ */

const COLS = 16;
const ROWS = 10;
// stable pseudo-random delay per pixel, so the dissolve looks scattered
const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => ((i * 7919) % 97) / 97);

/* Headline words fade up out of a soft blur, one after another */
const Words = ({ text, from = 0, className = '' }) => (
  <span className={className}>
    {text.split(' ').map((w, i) => <span key={i} className="wl-word" style={{ '--i': from + i }}>{w}{' '}</span>)}
  </span>
);

/* Soft gradient trail behind the cursor (canvas; skipped on touch screens and reduced motion) */
const CursorTrail = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !window.matchMedia?.('(pointer: fine)').matches) return undefined;
    const g = c.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => { c.width = innerWidth * dpr; c.height = innerHeight * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const pts = [];
    let raf = 0;
    // fill the gap between pointer events so fast moves still draw one smooth ribbon
    const onMove = (e) => {
      const t = performance.now();
      const last = pts[pts.length - 1];
      if (last) {
        const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
        const steps = Math.min(24, Math.floor(dist / 5));
        for (let s = 1; s < steps; s++) {
          const f = s / steps;
          pts.push({ x: last.x + (e.clientX - last.x) * f, y: last.y + (e.clientY - last.y) * f, t: last.t + (t - last.t) * f });
        }
      }
      pts.push({ x: e.clientX, y: e.clientY, t });
      if (pts.length > 260) pts.splice(0, pts.length - 260);
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const LIFE = 650;
    function draw() {
      const now = performance.now();
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      g.clearRect(0, 0, innerWidth, innerHeight);
      pts.forEach((p, i) => {
        const k = 1 - (now - p.t) / LIFE;            // 1 → 0 as the point ages
        const r = 10 + 26 * k;
        const hue = i / Math.max(1, pts.length - 1); // tail → head: lilac → orange
        const col = hue > 0.5 ? '243, 145, 46' : '167, 139, 250';
        const grad = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, `rgba(${col}, ${0.09 * k})`);
        grad.addColorStop(1, `rgba(${col}, 0)`);
        g.fillStyle = grad;
        g.beginPath(); g.arc(p.x, p.y, r, 0, Math.PI * 2); g.fill();
      });
      raf = pts.length ? requestAnimationFrame(draw) : 0;
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('resize', size);
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', size); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} className="wl-trail" aria-hidden="true" />;
};

/* Full-screen pixel splash: "cover" fills the screen pixel by pixel, "reveal" dissolves it */
const PixelSplash = ({ phase }) => (
  <div className={`wl-px is-${phase}`} aria-hidden="true" style={{ '--cols': COLS, '--rows': ROWS }}>
    {CELLS.map((d, i) => <i key={i} style={{ '--d': d }} />)}
    <span className="wl-px-label"><span className="wl-px-dots"><b /><b /><b /></span> Building your pass</span>
  </div>
);

const WaitlistPage = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle · error · loading · done
  const [phase, setPhase] = useState(null);   // pixel splash: cover · reveal · null
  const [pass, setPass] = useState(null);
  const [qr, setQr] = useState(null);
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(waitingCount);
  const [extra, setExtra] = useState(0); // DEMO: people "joining" after you while the page is open
  const timers = useRef([]);
  const navigate = useNavigate();
  const ref = new URLSearchParams(window.location.search).get('ref');

  useEffect(() => {
    const prev = document.title;
    document.title = 'Join the waitlist · CipherSchools';
    markWaitlistSeen(); // the homepage won't redirect back here during this visit
    const t = timers.current;
    return () => { document.title = prev; t.forEach(clearTimeout); };
  }, []);

  // DEMO: a new sign-up lands every few seconds, so "behind you" and the live count keep climbing
  useEffect(() => {
    if (state !== 'done') return undefined;
    let t;
    const tick = () => { t = setTimeout(() => { setExtra((n) => n + 1 + Math.floor(Math.random() * 2)); tick(); }, 2200 + Math.random() * 2600); };
    tick();
    return () => clearTimeout(t);
  }, [state]);

  const later = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const submit = (e) => {
    e.preventDefault();
    if (!isEmail(email)) { setState('error'); return; }
    setState('loading');
    const p = joinWaitlist(email, ref);
    QRCode.toDataURL(shareUrl(p.code), { margin: 0, width: 220, color: { dark: '#0B0B0D', light: '#FFFFFF' } }).then(setQr).catch(() => setQr(null));
    const show = () => { setPass(p); setCount(waitingCount()); setState('done'); window.scrollTo({ top: 0 }); };
    if (reduced()) { later(400, show); return; }
    // button spins → pixels cover the screen → page swaps underneath → pixels dissolve
    later(700, () => setPhase('cover'));
    later(1700, () => { show(); setPhase('reveal'); });
    later(2600, () => setPhase(null));
  };

  const url = pass ? shareUrl(pass.code) : '';
  const refs = pass ? referralsFor(pass.code) : 0;
  const copy = () => navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }).catch(() => {});
  const linkedIn = pass ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` : '#';
  const xIntent = pass ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText(pass.number))}&url=${encodeURIComponent(url)}` : '#';

  return (
    <div className={`wl is-${state}`}>
      <header className="wl-top">
        <a href="/" className="wl-logo"><img src="/cipherschools-logo.png" alt="" /> CipherSchools</a>
        <span className="wl-top-right">
          <span className="wl-live"><i /> {(count + extra).toLocaleString('en-IN')} joined</span>
          <button type="button" className="wl-close" onClick={() => navigate('/')} aria-label="Close the waitlist and go to the homepage" title="Close">
            <X size={18} />
          </button>
        </span>
      </header>

      {state !== 'done' ? (
        <main className="wl-hero">
          {ref && <span className="wl-invite"><Sparkles size={13} /> A friend saved you a spot</span>}
          <h1 aria-label="New chapter begins. Hiring is moving past DSA. So are we.">
            <span>
              <span className="wl-word" style={{ '--i': 0 }}>New{' '}</span>
              <span className="wl-word wl-h-brand" style={{ '--i': 1 }}>chapter{' '}</span>
              <span className="wl-word" style={{ '--i': 2 }}>begins</span>
            </span>
            <span className="wl-h-sorry" aria-hidden="true">
              <Words text="Hiring is moving past DSA." from={3} />
              <Words text="So are we." from={8} className="wl-h-more" />
            </span>
          </h1>
          <p className="wl-sub">Tech interviews now test how you read, review and build code with AI, not just DSA. We&apos;re building what gets you ready.</p>

          <form className={`wl-form ${state === 'error' ? 'is-shake' : ''}`} onSubmit={submit} noValidate onAnimationEnd={() => state === 'error' && setState('idle')}>
            <input
              type="email" value={email} placeholder="you@email.com" aria-label="Email address" autoComplete="email"
              onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }} disabled={state === 'loading'}
            />
            <button type="submit" disabled={state === 'loading'}>
              {state === 'loading' ? <><Loader2 size={16} className="wl-spin" /> Joining</> : <>Join waitlist <ArrowRight size={16} /></>}
            </button>
          </form>
          <p className={`wl-note ${state === 'error' ? 'is-err' : ''}`}>{state === 'error' ? 'That email looks off. Try again?' : 'Early access and launch perks for everyone on the list. No spam.'}</p>
        </main>
      ) : (
        <main className="wl-done">
          <section className="wl-done-main">
            <h2>You&apos;re on the list at <em>#{pad(pass.number)}</em></h2>
            <p className="wl-sub">Thanks for joining, {nameFrom(pass.email).split(' ')[0]}. You&apos;ll be the first to know when we launch, so keep an eye on your inbox.</p>
            <div className="wl-line" aria-label="Your place in line">
              <span><b>{(pass.number - 1).toLocaleString('en-IN')}</b> people ahead of you</span>
              <i aria-hidden="true" />
              <span className="is-behind"><b key={extra}>{(count + extra - pass.number).toLocaleString('en-IN')}</b> joined after you <em className="wl-line-live" aria-hidden="true" /></span>
            </div>
            <WaitlistPass pass={pass} qr={qr} size="lg" />
            <button type="button" className="wl-dl" onClick={() => downloadPass({ name: nameFrom(pass.email), number: pass.number, joined: pass.joined, code: pass.code, qr })}>
              <Download size={14} /> Download your pass
            </button>
          </section>

          <aside className="wl-ref" aria-label="Refer friends">
            <h3>Want to move up the list?</h3>
            <p className="wl-ref-sub">Invite friends and classmates to join the waitlist too.</p>

            <div className="wl-ref-goal">
              <span>Refer {REFERRAL_GOAL} friends for a big jump</span>
              <b>{Math.min(refs, REFERRAL_GOAL)}/{REFERRAL_GOAL}</b>
            </div>
            <span className="wl-ref-bar" aria-hidden="true">
              {Array.from({ length: REFERRAL_GOAL }, (_, i) => <i key={i} className={i < refs ? 'is-on' : ''} />)}
            </span>

            <div className="wl-ref-link">
              <input readOnly value={url} aria-label="Your invite link" onFocus={(e) => e.target.select()} />
              <button type="button" onClick={copy}>{copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}</button>
            </div>

            <p className="wl-ref-more">The more you share, the higher you climb.</p>
            <div className="wl-ref-share">
              <a className="wl-btn" href={xIntent} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z" /></svg>
                Share on X
              </a>
              <a className="wl-btn" href={linkedIn} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="#0A66C2" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
                Share on LinkedIn
              </a>
            </div>
            <button type="button" className="wl-again" onClick={() => { setPass(null); setEmail(''); setExtra(0); setState('idle'); }}>Use another email</button>
          </aside>
        </main>
      )}

      {state !== 'done' && <WaitlistDoodles />}
      <CursorTrail />
      {phase && <PixelSplash phase={phase} />}
    </div>
  );
};

export default WaitlistPage;
