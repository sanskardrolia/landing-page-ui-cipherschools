import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Award, Compass, Flame, Layers, BarChart3, BookOpen, Bot, Bug, Code2, Lightbulb, ScanSearch, Terminal, Timer, Users, CalendarDays, Check, ChevronDown, CirclePlay, ClipboardCheck, Coins, CreditCard,
  FileText, ListChecks, Mic, Pause, Play, Rocket, ShieldCheck, Sparkles, Star, X
} from 'lucide-react';
import { FAQS } from '../pages/PremiumPage';
import { STUDENT_FEEDBACK } from '../data/studentFeedback';
import SystemDesignDemo from './SystemDesignDemo';
import CodingTestDemo from './CodingTestDemo';
import { startPreview } from '../utils/preview';
import './HomeSections.css';

/* ══════════════════════════════════════════════════════════════
   Home (students): the sections between the hero and the footer.
   Order follows the landing-page rules:
     Problem & Solution → How it works & Key features → (Proof) →
     Value, objections & FAQs → Final CTA
   Prices and plan facts come from PremiumPage so they stay in sync.
   ══════════════════════════════════════════════════════════════ */

const useStartFree = () => {
  const navigate = useNavigate();
  return () => { startPreview(); navigate('/dashboard'); };
};

const Head = ({ eyebrow, title, sub }) => (
  <header className="hs-head">
    {eyebrow && <span className="hs-eyebrow">{eyebrow}</span>}
    <h2 className="hs-title">{title}</h2>
    {sub && <p className="hs-sub">{sub}</p>}
  </header>
);

/* ───────────── Problem & Solution (browser-tabs story) ─────────────
   The mess: a browser with a pile of prep tabs and a "plan" full of
   question marks. "Fix my prep": the tabs close one by one into a
   single CipherSchools tab and every question becomes an answer.
   Auto-plays until the visitor uses the button. */

/* Small site marks for the "mess" tabs (simplified, shown softly blurred) */
const TabLogo = ({ site }) => {
  if (site === 'leetcode') return (
    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 2 4.6 7.2a1.2 1.2 0 0 0 0 1.6l4.9 5.2" fill="none" stroke="#1F1F1F" strokeWidth="1.8" strokeLinecap="round" /><path d="M7.2 8h6" stroke="#B3B3B3" strokeWidth="1.8" strokeLinecap="round" /><path d="M9.5 2 12 4.6" stroke="#FFA116" strokeWidth="1.8" strokeLinecap="round" /></svg>
  );
  if (site === 'gfg') return (
    <svg viewBox="0 0 16 16" aria-hidden="true"><rect width="16" height="16" rx="3.5" fill="#2F8D46" /><path d="M4.2 8h3.4M8.4 8h3.4M7.6 8a2.6 2.6 0 1 1-1-2M8.4 8a2.6 2.6 0 1 0 1-2" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" /></svg>
  );
  if (site === 'udemy') return (
    <svg viewBox="0 0 16 16" aria-hidden="true"><rect width="16" height="16" rx="3.5" fill="#A435F0" /><path d="M5 5.6v3.2a3 3 0 0 0 6 0V5.6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /><path d="M5 4.2 8 2.8l3 1.4" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
  if (site === 'discord') return (
    <svg viewBox="0 0 16 16" aria-hidden="true"><rect width="16" height="16" rx="3.5" fill="#5865F2" /><path d="M4.3 5.2C5.4 4.5 6.4 4.3 8 4.3s2.6.2 3.7.9c.6 1.6.9 3.2.7 4.9-1 .8-1.9 1.1-2.6 1.3l-.6-.9c-.4.1-.8.2-1.2.2s-.8-.1-1.2-.2l-.6.9c-.7-.2-1.6-.5-2.6-1.3-.2-1.7.1-3.3.7-4.9Z" fill="#fff" /><circle cx="6.4" cy="8" r=".85" fill="#5865F2" /><circle cx="9.6" cy="8" r=".85" fill="#5865F2" /></svg>
  );
  return <FileText size={13} color="#DC2626" aria-hidden="true" />;
};

const MESS_TABS = [
  { label: 'LeetCode · Problems', site: 'leetcode' },
  { label: 'GeeksforGeeks · DSA', site: 'gfg' },
  { label: 'Udemy · DSA Bootcamp', site: 'udemy' },
  { label: 'Interview Tips.pdf', site: 'pdf' },
  { label: 'Discord · anyone free?', site: 'discord' }
];
const PLAN_ROWS = [
  { Icon: CirclePlay, mess: 'Watch… which playlist?', fix: 'Lectures, unit by unit, in order', c: '#E8801A' },
  { Icon: ListChecks, mess: 'Solve… which questions?', fix: 'Practice right after every unit', c: '#3B82F6' },
  { Icon: ClipboardCheck, mess: 'Test myself… where?', fix: 'Proctored tests, like real OAs', c: '#10B981' },
  { Icon: Mic, mess: 'Mock interview… with whom?', fix: 'Mock interviews with feedback', c: '#A855F7' },
  { Icon: Coins, mess: 'Stay consistent… gave up on day 3', fix: 'Streaks & CipherCoins keep you going', c: '#D97706' }
];

export const ProblemSolution = () => {
  const [fixed, setFixed] = useState(false);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return undefined;
    const t = setTimeout(() => setFixed((v) => !v), fixed ? 4200 : 3400);
    return () => clearTimeout(t);
  }, [fixed, auto]);
  const toggle = () => { setAuto(false); setFixed((v) => !v); };

  // The visitor's own pointer gets a "You" label
  const collabRef = useRef(null);
  const youRef = useRef(null);
  const [here, setHere] = useState(false);
  const moveYou = (e) => {
    const box = collabRef.current?.getBoundingClientRect();
    if (box && youRef.current) youRef.current.style.transform = `translate(${e.clientX - box.left}px, ${e.clientY - box.top}px)`;
  };

  return (
    <section className="hs-section" id="why-section">
      <div className="container">
        <Head
          title={<>Placement prep is scattered. <span className="hs-accent">We put it in one path.</span></>}
        />

        <div
          className="hs-collab"
          ref={collabRef}
          onMouseEnter={() => setHere(true)}
          onMouseLeave={() => setHere(false)}
          onMouseMove={moveYou}
        >
        <span ref={youRef} className={`hs-you ${here ? 'is-on' : ''}`} aria-hidden="true"><em>You</em></span>
        <div className={`hs-tabs ${fixed ? 'is-fixed' : ''}`}>
          {/* Tab strip */}
          <div className="hs-tabs-bar">
            <span className="hs-tabs-dots" aria-hidden="true"><i /><i /><i /></span>
            <div className="hs-tabs-strip">
              <span className="hs-tab hs-tab-cs">
                <img src="/cipherschools-logo.png" alt="" /> CipherSchools · Dashboard
              </span>
              {MESS_TABS.map((t, i) => (
                <span key={t.label} className="hs-tab hs-tab-mess" style={{ '--i': i }}>
                  <span className="hs-tab-logo"><TabLogo site={t.site} /></span> {t.label} <X size={11} />
                </span>
              ))}
              <span className="hs-tab hs-tab-more">+41</span>
            </div>
          </div>

          {/* The "plan" */}
          <div className="hs-tabs-body">
            <div className="hs-tabs-doc">
              <div className="hs-tabs-doc-head">
                <p className="hs-tabs-doc-title">My placement prep</p>
                <span className={`hs-tabs-chip ${fixed ? 'is-ok' : ''}`}><i />{fixed ? 'One path' : 'No plan'}</span>
              </div>
              <ul>
                {PLAN_ROWS.map((r, i) => (
                  <li key={r.fix} style={{ '--i': i }}>
                    <span className="hs-tabs-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="hs-tabs-icon"><r.Icon size={16} /></span>
                    <span className="hs-tabs-line">
                      <span className="is-mess">{r.mess}</span>
                      <span className="is-fix">{r.fix}</span>
                    </span>
                    <span className="hs-tabs-mark">{fixed ? <Check size={12} strokeWidth={3} /> : <span className="hs-tabs-hatch" />}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hs-tabs-side">
              {/* Visual: a pile of site icons → one CipherSchools hub with its four steps */}
              <div className="hs-tabs-visual" aria-hidden="true">
                {/* 12 open tabs (hatched) collapse into one solid tab */}
                <div className="hs-tabbars">
                  {Array.from({ length: 12 }, (_, k) => <i key={k} style={{ '--k': k, '--h': `${38 + ((k * 37) % 50)}%` }} />)}
                </div>
                <span className="hs-tabbars-label">{fixed ? 'cipherschools.com/dashboard' : 'leetcode · gfg · udemy · pdf · discord · +41'}</span>
              </div>

              <div className="hs-tabs-count">
                <strong>{fixed ? 1 : 47}</strong>
                {/* both captions share one cell, so the box keeps the taller one's height */}
                <span className="hs-tabs-cap">
                  <span className={fixed ? 'is-off' : ''} aria-hidden={fixed}>tabs open, and still unsure what&apos;s next.</span>
                  <span className={fixed ? '' : 'is-off'} aria-hidden={!fixed}>tab. Everything in one place.</span>
                </span>
              </div>

              <ul className="hs-tabs-stats">
                {(fixed
                  ? [['4', 'steps, in order'], ['1', 'dashboard'], ['0', 'guesswork']]
                  : [['5+', 'sites'], ['0', 'plan'], ['?', 'next step']]
                ).map(([n, l]) => <li key={l}><b>{n}</b><span>{l}</span></li>)}
              </ul>

              <button type="button" className={`hs-btn ${fixed ? 'hs-btn-ghost' : 'hs-btn-primary'} hs-tabs-btn`} onClick={toggle}>
                {fixed ? <><X size={16} /> Show the mess again</> : <><Sparkles size={16} /> Fix my prep</>}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

/* ───────────── How it works & Key features ─────────────
   Notion-style product moment: one short headline, the real dashboard
   in a window on a warm art backdrop, and a small dock to switch
   steps (auto-plays, with pause). Three plain text blurbs below. */

const STEPS = [
  { id: 'learn', label: 'Learn', Icon: CirclePlay, img: '/home/dash-learn.jpg', alt: 'Lectures tab of a module in the CipherSchools dashboard', pop: { Icon: Check, title: 'Lecture watched', at: 'tr' } },
  { id: 'practice', label: 'Practice', Icon: ListChecks, img: '/home/dash-practice.jpg', alt: 'Coding workspace with a problem and code editor', pop: { Icon: Check, title: 'Accepted · 3/3', at: 'br' } },
  { id: 'test', label: 'Test', Icon: ClipboardCheck, img: '/home/dash-test.jpg', alt: 'Proctored tests list with stages and launch button', pop: { Icon: ShieldCheck, title: 'Proctored', at: 'tr', live: true } },
  { id: 'interview', label: 'Interview', Icon: Mic, img: '/home/dash-interview.jpg', alt: 'Mock interview tab with a book-a-slot button', pop: { Icon: CalendarDays, title: 'Slot booked', at: 'mr' } },
  { id: 'track', label: 'Track', Icon: BarChart3, img: '/home/dash-overview.jpg', alt: 'Dashboard overview with progress cards and chart', pop: { Icon: Coins, title: '+25 CipherCoins', at: 'br' } }
];
const STEP_MS = 4500;

const BLURBS = [
  { Icon: Compass, title: 'Always know what\'s next', text: 'Your dashboard picks the next lecture, question and test for you.' },
  { Icon: Code2, title: 'Practice where you learn', text: 'Questions and an in-browser editor right after every unit.' },
  { Icon: Flame, title: 'Stay on track', text: 'A planner, streaks and CipherCoins that reward showing up daily.' }
];

export const HowItWorks = () => {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return undefined;
    const t = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [active, playing]);

  const step = STEPS[active];

  return (
    <section className="hs-section" id="how-section">
      <div className="container">
        <h2 className="hs-n-title">Learn. Practice. Test. Interview.</h2>

        <div className="hs-blurbs is-top">
          {BLURBS.map((b) => (
            <div key={b.title}>
              <span className="hs-blurb-ico"><b.Icon size={16} /></span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
        <div className="hs-canvas">
          <div className="hs-window">
            <div className="hs-window-bar">
              <span /><span /><span />
              <em>{step.label}</em>
            </div>
            <div className="hs-window-stage">
              {STEPS.map((s, i) => (
                <img key={s.id} src={s.img} alt={s.alt} className={active === i ? 'is-on' : ''} loading={i ? 'lazy' : 'eager'} />
              ))}
              <div key={step.id} className={`hs-pop at-${step.pop.at}`}>
                <span className={`hs-pop-icon ${step.pop.live ? 'is-live' : ''}`}><step.pop.Icon size={14} /></span>
                <strong>{step.pop.title}</strong>
              </div>
            </div>
          </div>

          {/* Dock: one icon per step, the active one labelled */}
          <div className="hs-dock-row">
            <div className="hs-dock" role="tablist" aria-label="How it works">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-label={s.label}
                  className={`hs-dock-btn ${active === i ? 'is-on' : ''}`}
                  onClick={() => { setActive(i); setPlaying(false); }}
                >
                  <s.Icon size={20} />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
            <button type="button" className="hs-dock-play" onClick={() => setPlaying((v) => !v)} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

/* ───────────── Everything CipherSchools can do ─────────────
   Notion "connections" pattern, CipherSchools style: what you do on
   the left plugs into the CipherSchools hub, which builds the four
   pillars of a placement-ready profile on the right. Items connect
   one by one when the section scrolls into view. */

const INPUTS = [
  { Icon: CirclePlay, name: 'Video Lectures', stat: 'Unit by unit, in order', color: '#E8801A' },
  { Icon: Code2, name: 'DSA Practice', stat: '600+ questions', color: '#3B82F6' },
  { Icon: Sparkles, name: 'Vibe Coding Practice', stat: 'Build features with AI', color: '#A855F7' },
  { Icon: Bug, name: 'Debugging Practice', stat: 'Fix real broken code', color: '#EF4444' },
  { Icon: Bot, name: 'AI-Assisted Coding Test', stat: 'Proctored · AI-reviewed', color: '#10B981' },
  { Icon: Lightbulb, name: 'Approach-Based Coding Test', stat: 'Explain, then code', color: '#F59E0B' }
];
const PILLARS = [
  { title: 'Lectures', tiles: [{ Icon: CirclePlay, c: '#E8801A' }, { Icon: BookOpen, c: '#E8801A' }] },
  { title: 'Practice', tiles: [{ Icon: Code2, c: '#3B82F6' }, { Icon: Bug, c: '#3B82F6' }] },
  { title: 'Tests', tiles: [{ Icon: ShieldCheck, c: '#10B981' }, { Icon: Timer, c: '#10B981' }] },
  { title: 'Mock Interviews', tiles: [{ Icon: Mic, c: '#A855F7' }, { Icon: Users, c: '#A855F7' }] }
];
const MORE = ['Resume Builder', 'ATS Checker', 'Online Compiler', 'Certificates', 'CipherCoins', '1:1 Mentorship'];

export const Capabilities = () => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [linked, setLinked] = useState(0); // how many inputs have connected

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setShown(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!shown || linked >= INPUTS.length) return undefined;
    const t = setTimeout(() => setLinked((n) => n + 1), linked ? 420 : 300);
    return () => clearTimeout(t);
  }, [shown, linked]);

  const done = linked >= INPUTS.length;
  const ys = INPUTS.map((_, i) => ((i + 0.5) / INPUTS.length) * 100);
  const outs = [16, 38, 62, 84];

  return (
    <section className="hs-section" id="capabilities-section" ref={ref}>
      <div className="container">
        <header className="hs-cap-head">
          <h2 className="hs-n-title">Everything CipherSchools can do.</h2>
          <p>From lectures and practice to proctored tests and mock interviews.</p>
        </header>

        <div className={`hs-cap ${done ? 'is-done' : ''}`}>
          {/* What you do */}
          <ul className="hs-cap-in">
            {INPUTS.map((x, i) => {
              const on = i < linked;
              return (
                <li key={x.name} className={`hs-cap-item ${on ? 'is-on' : ''}`} style={{ '--c': x.color }}>
                  <span className="hs-cap-icon"><x.Icon size={20} /></span>
                  <span className="hs-cap-text"><strong>{x.name}</strong><small>{on ? x.stat : 'Connecting…'}</small></span>
                  <span className="hs-cap-check" aria-label={on ? 'Included' : undefined}>{on ? <Check size={14} strokeWidth={3} /> : <span className="hs-cap-spin" />}</span>
                </li>
              );
            })}
          </ul>

          {/* Hub + wires */}
          <div className="hs-cap-mid" aria-hidden="true">
            <svg className="hs-cap-wires" viewBox="0 0 100 100" preserveAspectRatio="none">
              {ys.map((y, i) => (
                <path key={`l${i}`} d={`M0 ${y} C 30 ${y}, 30 50, 50 50`} className={i < linked ? 'is-on' : ''} style={{ '--c': INPUTS[i].color }} />
              ))}
              {outs.map((y, i) => (
                <path key={`r${i}`} d={`M50 50 C 70 50, 70 ${y}, 100 ${y}`} className={done ? 'is-on is-out' : ''} />
              ))}
            </svg>
            <span className={`hs-cap-hub ${done ? 'is-done' : ''}`}>
              <img src="/cipherschools-logo.png" alt="" />
            </span>
          </div>

          {/* What it builds */}
          <div className="hs-cap-out">
            <h3>Placement-ready you</h3>
            <div className="hs-cap-grid">
              {PILLARS.map((pl, i) => (
                <div key={pl.title} className="hs-cap-pillar" style={{ '--d': `${i * 140}ms` }}>
                  <h4>{pl.title}</h4>
                  <div className="hs-cap-tiles">
                    {pl.tiles.map((t, j) => (
                      <div key={j} className="hs-cap-tile">
                        <span style={{ color: t.c, background: `${t.c}1A` }}><t.Icon size={14} /></span>
                        <i style={{ '--w': '62%' }} /><i style={{ '--w': '86%' }} /><i style={{ '--w': '74%', '--c': t.c }} className="is-fill" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="hs-cap-more">
          <span className="hs-cap-more-icons" aria-hidden="true">
            {[FileText, ScanSearch, Terminal, Award, Coins, Users].map((I, i) => <span key={i}><I size={13} /></span>)}
          </span>
          Plus {MORE.join(', ')} and more.
        </p>
      </div>
    </section>
  );
};

/* ───────────── Beyond lectures (above pricing) ─────────────
   A system design practice problem, played out: drag, connect, run,
   fail under load, fix, pass. Then the other hands-on practice. */
const BEYOND = [
  {
    id: 'vibe', Icon: Code2, kicker: 'Vibe coding test', Demo: () => <CodingTestDemo compact />,
    title: 'Ship a real feature with AI, then prove it works',
    text: 'You get a ticket on a real codebase. Guide the assistant, review its edit, and run the tests before you submit.',
    points: ['Scored on your prompts, reviews and debugging', 'Visible tests now, hidden tests on submit', 'Timed, like a real take-home round']
  },
  {
    id: 'sd', Icon: Layers, kicker: 'System design', Demo: () => <SystemDesignDemo />,
    title: 'Design it, load it, fix what breaks',
    text: 'Drag in the blocks, wire them up and send 10k requests a second. When a server buckles, add a load balancer or cache and run it again.',
    points: ['HLD and LLD practice problems', 'Instant feedback on errors and latency', 'The same trade-offs interviews ask about']
  }
];

export const BeyondLectures = () => (
  <section className="hs-section sdd-section" id="beyond-section">
    <div className="container">
      <Head title={<>What you can do <span className="hs-accent">beyond lectures</span></>} sub="Hands-on rounds that feel like the job, not another video." />
      <div className="hs-beyond">
        {BEYOND.map((b, i) => (
          <div key={b.id} className={`hs-beyond-row ${i % 2 ? 'is-flip' : ''}`}>
            <div className="hs-beyond-mock"><b.Demo /></div>
            <div className="hs-beyond-copy">
              <span className="hs-beyond-kicker"><b.Icon size={14} /> {b.kicker}</span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
              <ul>{b.points.map((t) => <li key={t}><Check size={14} strokeWidth={2.5} /> {t}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
      <ul className="sdd-more" aria-label="More hands-on practice">
        {['Debugging', 'Approach-based tests', 'Mock interviews'].map((t) => <li key={t}>{t}</li>)}
      </ul>
    </div>
  </section>
);

/* ───────────── Student feedback (below pricing) ─────────────
   One row of feedback cards that scrolls sideways on its own
   (pauses on hover). Name, photo (or initials), 4–5 star rating,
   feedback. Data: src/data/studentFeedback.js */

const initialsOf = (name) => name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const Stars = ({ n }) => (
  <span className="hs-fb-stars" aria-label={`${n} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} className={i <= n ? 'is-on' : ''} />)}
  </span>
);

export const StudentFeedback = () => {
  const avg = (STUDENT_FEEDBACK.reduce((a, f) => a + f.rating, 0) / STUDENT_FEEDBACK.length).toFixed(1);
  // Two copies back to back so the loop is seamless
  const loop = [...STUDENT_FEEDBACK, ...STUDENT_FEEDBACK];
  return (
    <section className="hs-section hs-fb" id="feedback-section">
      <div className="container">
        <header className="hs-fb-head">
          <h2 className="hs-title">What students say</h2>
          <p className="hs-fb-avg"><Stars n={5} /> <strong>{avg}</strong> average from {STUDENT_FEEDBACK.length} students</p>
        </header>
      </div>
      <div className="hs-fb-track-wrap">
        <ul className="hs-fb-track" style={{ '--n': STUDENT_FEEDBACK.length }}>
          {loop.map((f, i) => (
            <li key={`${f.name}-${i}`} className="hs-fb-card" aria-hidden={i >= STUDENT_FEEDBACK.length}>
              <Stars n={f.rating} />
              <p className="hs-fb-text">“{f.text}”</p>
              <div className="hs-fb-who">
                {f.photo ? <img src={f.photo} alt="" className="hs-fb-photo" /> : <span className="hs-fb-photo is-initials">{initialsOf(f.name)}</span>}
                <span><strong>{f.name}</strong><small>{f.meta}</small></span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

/* ───────────── Value, objections & FAQs ───────────── */

const BUY_STEPS = [
  { Icon: Sparkles, title: 'Try it free', text: 'Open the dashboard as a guest; about 30% of DSA, Development and System Design is unlocked. No card.' },
  { Icon: CreditCard, title: 'Pick a plan', text: 'Pay once for 12 months by UPI, card or net banking. Plus asks which Full Stack track you want.' },
  { Icon: Rocket, title: 'Start right away', text: 'Your dashboard opens instantly. Upgrade any time and pay only the difference.' }
];

const GOOD_TO_KNOW = [
  'Every plan is 12 months, billed once.',
  'Plus includes one Full Stack track. Ultra includes both.',
  '1:1 mentorship is only in Ultra (3 credits; more can be bought).',
  'After your plan ends, you keep the video lectures of your plan.',
  'Free tools (practice, resume builder, ATS checker, compiler) stay free.'
];

const HOME_FAQS = [
  { q: 'Is CipherSchools free?', a: 'Yes, the practice problems, resume builder, ATS checker and online compiler are free. You can also try about 30% of the paid course content free before buying.' },
  { q: 'Do I need a card to start?', a: 'No. Starting free needs no payment details. You only pay when you choose a plan.' },
  { q: 'Who is this for?', a: 'College students preparing for internships and placements, from first year to final year, with or without a CS background.' },
  ...FAQS
];

export const ValueFaq = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="hs-section" id="faq-section">
      <div className="container">
        <Head
          eyebrow="BEFORE YOU BUY"
          title={<>Buying, limits and <span className="hs-accent">the questions students ask</span></>}
        />

        <div className="hs-value-grid">
          <div className="hs-card">
            <h3>How buying works</h3>
            <ol className="hs-buy">
              {BUY_STEPS.map((b, i) => (
                <li key={b.title}>
                  <span className="hs-buy-n">{i + 1}</span>
                  <div><strong><b.Icon size={15} /> {b.title}</strong><p>{b.text}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="hs-card">
            <h3>Good to know</h3>
            <ul className="hs-know">{GOOD_TO_KNOW.map((t) => <li key={t}><ShieldCheck size={15} /> {t}</li>)}</ul>
          </div>
        </div>

        <div className="hs-faq">
          <div className="hs-faq-side">
            <span className="hs-eyebrow">FAQ</span>
            <h3>Questions students ask</h3>
            <p>Still unsure? Try the dashboard free, or write to us from the Feedback button in the sidebar.</p>
          </div>
          <div className="hs-faq-list">
            {HOME_FAQS.map((f, i) => (
              <div key={f.q} className={`hs-faq-item ${open === i ? 'is-open' : ''}`}>
                <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  {f.q} <ChevronDown size={18} />
                </button>
                {open === i && <p>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ───────────── Final CTA ───────────── */

export const FinalCta = () => {
  const startFree = useStartFree();
  return (
    <section className="hs-section hs-final-wrap">
      <div className="container">
        <div className="hs-final">
          <span className="hs-eyebrow">AN ED-TECH COMPANY FOR STUDENTS</span>
          <h2>Start your placement prep today.</h2>
          <p>Start free and you land straight in your dashboard, with part of DSA, Development and System Design open to try. Pick a plan when you are ready.</p>
          <div className="hs-final-ctas">
            <button type="button" className="hs-btn hs-btn-primary hs-btn-lg" onClick={startFree}>Start free <ArrowRight size={17} /></button>
            <button type="button" className="hs-btn hs-btn-ghost hs-btn-lg" onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><FileText size={16} /> Compare plans</button>
          </div>
          <ul className="hs-final-assure">
            <li><Check size={14} /> No card to start</li>
            <li><Check size={14} /> 7-day money-back on paid plans</li>
            <li><Check size={14} /> Upgrade any time, pay only the difference</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
