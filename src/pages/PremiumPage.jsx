import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight, BadgePercent, BarChart2, Bot, Check, ChevronDown, ClipboardCheck, Clock, Code2, Crown, Database, Eye,
  Flame, Info, Laptop, Layers, Lock, Maximize2, Mic, PlayCircle, RefreshCw, ShieldCheck, Sparkles, Star, Terminal,
  Users, Workflow, X, Zap
} from 'lucide-react';
import { getEnrollment } from '../utils/enrollment';
import { startPreview } from '../utils/preview';
import './PremiumPage.css';
import './PremiumRedesign.css';

/* ── Topic lists shown in the (i) hover tooltip next to DSA ── */
const DSA_INFO_CORE = {
  title: 'Data Structure & Algorithms',
  topics: ['Arrays', 'Strings', 'Recursion', 'LinkedList', 'Stack', 'Queue', 'Tree', 'Binary Tree', 'Graph']
};
const DSA_INFO_PLUS = {
  title: 'Data Structure & Algorithms',
  topics: ['Arrays', 'Strings', 'Hashing', 'Recursion', 'LinkedList', 'Stack', 'Queue', 'Tree', 'Binary Tree', 'Heaps', 'Graph', 'Dynamic Programming']
};

/* ── Individual modules (bento grid) ──
   Pricing tiers: ₹1,599 foundational · ₹2,000 specialised · ₹2,500 flagship / full-build */
const MODULE_INCLUDES = [
  { label: 'Lectures', icon: PlayCircle },
  { label: 'Practice Questions', icon: Terminal },
  { label: 'Proctored Test', icon: ShieldCheck }
];
const MODULE_CARDS = [
  { id: 'dsa', price: 2500, title: 'Data Structure & Algorithm', icon: Workflow, span: 'span-4' },
  { id: 'cf', price: 1599, title: 'Computer Fundamentals', note: 'OS, CN, OOPs', icon: Laptop, span: 'span-2' },
  { id: 'dbms', price: 1599, title: 'Database Management & System', icon: Database, span: 'span-2' },
  { id: 'mern', price: 2500, title: 'Development', note: 'MERN Stack', icon: Layers, span: 'span-4' },
  { id: 'sd', price: 2000, title: 'System Design', icon: BarChart2, span: 'span-3' },
  { id: 'genai', price: 2000, title: 'Generative A.I.', icon: Bot, span: 'span-3' }
];

/* ── Shared offering building blocks (module → sub-offerings tree) ── */
const aiAssistedTest = () => ({ text: 'AI Assisted Test', children: [{ text: 'Approach Based' }, { text: 'AI Literacy Based' }] });
const proctoredTest = () => ({ text: 'Proctored AI Assisted Test (Industry Standard)', children: [{ text: 'Debugging Test' }, { text: 'Vibe Coding Test' }] });
const GENERIC_AND_COMPANY = 'Test Type: Generic + Company Specific';
const recordedLectures = () => ({ text: 'Recorded Lectures' });

const dsaAdvancedModule = (info) => ({
  text: 'DSA Advanced Module',
  info,
  children: [recordedLectures(), aiAssistedTest(), { text: GENERIC_AND_COMPANY }, { text: '1,200 DSA Questions + 20 new questions/mon' }]
});
const devopsModule = () => ({ text: 'DevOps & Cloud Computing Module', children: [recordedLectures()] });
const systemDesignModule = () => ({
  text: 'System Design Module',
  children: [
    recordedLectures(),
    { text: 'Interactive System Design Practice' },
    { text: 'Interactive System Design Test (Proctored)' }
  ]
});
const genAiModule = () => ({ text: 'Generative A.I. Module', children: [recordedLectures()] });
const commBehaviouralModule = () => ({ text: 'Communication & Behavioural Module', children: [recordedLectures()] });

/* Plus includes ONE Full Stack track, picked at checkout */
const fullStackChoiceModule = () => ({
  text: 'Full Stack Development Module — choose MERN or JFS',
  children: [recordedLectures(), proctoredTest(), { text: GENERIC_AND_COMPANY }]
});

/* Everything Plus adds on top of Core */
const plusOnlyModules = (info) => [
  dsaAdvancedModule(info),
  fullStackChoiceModule(),
  devopsModule(),
  systemDesignModule(),
  genAiModule(),
  commBehaviouralModule()
];

/* Ultra = every Plus module with higher limits, both Full Stack tracks, and the Ultra modules.
   `swap` replaces a Plus sub-line (by its text); `add` appends the Ultra allowance. */
const withHigherLimits = (mod, { swap = {}, add = [] } = {}) => ({
  ...mod,
  children: [
    ...(mod.children || []).map((c) => (swap[c.text] ? { ...c, text: swap[c.text] } : c)),
    ...add.map((text) => ({ text }))
  ]
});

const ultraModules = (info) => [
  withHigherLimits(dsaAdvancedModule(info), {
    swap: { '1,200 DSA Questions + 20 new questions/mon': '2,000 DSA Questions + 30 new questions/mon' }
  }),
  {
    text: 'DSA Mastery Module',
    children: [recordedLectures(), { text: 'Hard Problem Sets — Hashing, Heaps, Graphs, DP & Greedy' }, aiAssistedTest(), { text: 'DSA Mastery Mock Interview' }]
  },
  {
    text: 'Full Stack Development — both MERN & JFS',
    children: [recordedLectures(), proctoredTest(), { text: 'Additional Proctored AI Assisted Tests (Debugging & Vibe Coding)' }]
  },
  withHigherLimits(devopsModule(), { add: ['More Cloud Sandbox Hours'] }),
  withHigherLimits(systemDesignModule(), { add: ['Additional Interactive System Design Tests (Proctored)'] }),
  withHigherLimits(genAiModule(), { add: ['Additional GenAI Project Reviews'] }),
  withHigherLimits(commBehaviouralModule(), { add: ['Additional 1:1 HR Mock Rounds'] }),
  {
    text: '1:1 Mentorship',
    children: [{ text: '3 meeting credits included' }, { text: 'Book a mentor for DSA, Development, System Design or Career' }, { text: 'Buy more credits any time' }]
  }
];

/* ── 12-Month Commitment Plans Data (Max 30% Discount) ── */
export const PLANS_12M_DATA = [
  {
    id: 'starter',
    name: 'Core',
    isPopular: false,
    duration: '12m',
    durationMonths: 12,
    durationLabel: '12 Months',
    commitmentText: 'with a commitment of 12 months',
    price: 2088, // 30% off ₹249/mo (₹174 x 12)
    priceFormatted: '₹2,088',
    monthlyPrice: 174,
    monthlyPriceFormatted: '₹174',
    originalPrice: '₹2,988',
    originalMonthlyPrice: '₹249',
    discount: '30% OFF',
    period: 'mon',
    dailyCost: 5,
    dailyText: '~₹5 / day',
    chaiComparison: 'Barely ₹5 a day! Cheaper than any tapri chai ☕',
    pitch: 'Full 365-day placement runway. Master foundational CS & DSA with zero pressure.',
    accentColor: '#3B82F6',
    extensionCost: 99,
    extensionFormatted: '₹99/mon',
    features: [
      {
        text: 'Computer Fundamentals Module',
        children: [recordedLectures(), { text: 'Operating System' }, { text: 'Computer Networks' }, { text: 'OOPs & Programming Language' }]
      },
      { text: 'DBMS Module', children: [recordedLectures()] },
      {
        text: 'Data Structures & Algorithms Module',
        info: DSA_INFO_CORE,
        children: [
          recordedLectures(),
          aiAssistedTest(),
          { text: 'Test Type: Generic' },
          { text: '600 DSA Questions + 10 new questions/mon' },
          { text: 'Company Specific Tests', excluded: true }
        ]
      },
      { text: 'Generic Mock Interview' },
    ],
    ctaText: 'Choose 1-Year Core',
    ctaVariant: 'outline'
  },
  {
    id: 'plus',
    name: 'Plus',
    isPopular: true,
    duration: '12m',
    durationMonths: 12,
    durationLabel: '12 Months',
    commitmentText: 'with a commitment of 12 months',
    price: 4200, // 30% off ₹500/mo (₹350 x 12)
    priceFormatted: '₹4,200',
    monthlyPrice: 350,
    monthlyPriceFormatted: '₹350',
    originalPrice: '₹6,000',
    originalMonthlyPrice: '₹500',
    discount: '30% OFF',
    period: 'mon',
    dailyCost: 11,
    dailyText: '~₹11 / day',
    chaiComparison: 'Less than 1 single cup of canteen tea ☕',
    pitch: 'A full year of 100+ proctored tests, system design & AI mock interview feedback.',
    accentColor: '#F3912E',
    extensionCost: 200,
    extensionFormatted: '₹200/mon',
    inheritedLabel: 'All in Core, plus:',
    features: [
      ...plusOnlyModules(DSA_INFO_PLUS),
      { text: 'Company Specific Mock Interview' },
    ],
    ctaText: 'Claim 1-Year Plus Access',
    ctaVariant: 'primary'
  },
  {
    id: 'compete',
    name: 'Ultra',
    isPopular: false,
    duration: '12m',
    durationMonths: 12,
    durationLabel: '12 Months',
    commitmentText: 'with a commitment of 12 months',
    price: 5880, // 30% off ₹700/mo (₹490 x 12)
    priceFormatted: '₹5,880',
    monthlyPrice: 490,
    monthlyPriceFormatted: '₹490',
    originalPrice: '₹8,400',
    originalMonthlyPrice: '₹700',
    discount: '30% OFF',
    period: 'mon',
    dailyCost: 16,
    dailyText: '~₹16 / day',
    chaiComparison: 'Just 1 tapri tea with a friend ☕',
    pitch: 'The gold-standard 365-day placement program covering every FAANG & Tier-1 assessment.',
    accentColor: '#10B981',
    extensionCost: 280,
    extensionFormatted: '₹280/mon',
    inheritedLabel: 'All in Plus, with higher limits:',
    // Ultra = Plus with higher limits + both tracks + Ultra modules (see ultraModules)
    features: [
      ...ultraModules(DSA_INFO_PLUS),
      { text: 'Company Specific Mock Interview — 2 rounds' },
      { text: '2 attempts on every proctored test' },
    ],
    ctaText: 'Go All-In for 1 Year',
    ctaVariant: 'slate'
  }
];

/* URL slug for each checkout-able plan id (Core's internal id is 'starter') */
export const PLAN_SLUGS = { starter: 'core', plus: 'plus', compete: 'ultra' };
const PLAN_RANK = ['starter', 'plus', 'compete']; // Core → Plus → Ultra

/* ── Recursive offering tree: module → sub-offerings (excluded state inherits downward) ── */
export const FeatureTree = ({ nodes, level = 0, excluded = false }) => (
  <ul className={level === 0 ? 'plan-features-list' : 'feature-children'}>
    {nodes.map((node, idx) => {
      const isExcluded = excluded || !!node.excluded;
      if (node.header !== undefined) {
        return (
          <li key={idx} className="feature-group">
            {node.header && <div className="feature-group-label">{node.header}</div>}
            <FeatureTree nodes={node.items} level={0} excluded={node.excluded} />
          </li>
        );
      }
      return (
        <li
          key={idx}
          className={`feature-item feature-level-${level} ${isExcluded ? 'feat-excluded' : ''} ${node.extension ? 'feat-extension' : ''}`}
        >
          <div className="feature-row">
            <span className="feature-check-icon">
              {isExcluded ? <X size={level === 0 ? 14 : 11} strokeWidth={2.8} /> : (level === 0 ? <Check size={14} strokeWidth={2.8} /> : <span className="feature-dot" />)}
            </span>
            <span className={`feature-text ${level === 0 ? 'feat-bold' : ''}`}>{node.text}</span>
            {node.info && (
              <span className="info-tip" tabIndex={0} aria-label={`${node.info.title} topics`}>
                <Info size={14} />
                <span className="info-tip-box" role="tooltip">
                  <span className="info-tip-title">{node.info.title}</span>
                  <ul>
                    {node.info.topics.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </span>
              </span>
            )}
          </div>
          {node.children && <FeatureTree nodes={node.children} level={level + 1} excluded={isExcluded} />}
        </li>
      );
    })}
  </ul>
);

/* ══════════════════════════════════════════════════════════════
   PREMIUM PAGE CONTENT
   ══════════════════════════════════════════════════════════════ */

/* What each plan includes, as one row per offering so the three cards line up.
   `true` = included, `false` = not included, a string = included with that detail. */
const PLAN_ROWS = [
  { label: 'Computer Fundamentals', note: 'OS, CN, OOPs', v: [true, true, true] },
  { label: 'DBMS', v: [true, true, true] },
  { label: 'DSA questions', v: ['600 + 10/mo', '1,200 + 20/mo', '2,000 + 30/mo'] },
  { label: 'DSA Advanced', v: [false, true, true] },
  { label: 'Full Stack', v: [false, 'MERN or JFS', 'MERN + JFS'] },
  { label: 'DevOps & Cloud Computing', v: [false, true, true] },
  { label: 'System Design', v: [false, true, true] },
  { label: 'Generative A.I.', v: [false, true, true] },
  { label: 'Communication & Behavioural', v: [false, true, true] },
  { label: 'Company-specific tests', v: [false, true, true] },
  { label: 'Mock interviews', v: ['Generic', '+ Company', '+ Company · 2 rounds'] },
  { label: 'DSA Mastery', v: [false, false, true] },
  { label: '1:1 Mentorship', v: [false, false, '3 credits'] },
  { label: 'Attempts per test', v: ['1', '1', '2'] }
];

/* Hero offer card: the four strongest reasons to buy each plan */
const HERO_POINTS = {
  plus: ['1,200 DSA questions + 20 new every month', '9 modules incl. DSA Advanced & System Design', 'Your Full Stack track: MERN or JFS', 'Company-specific tests & mock interviews'],
  compete: ['Everything in Plus, with higher limits', 'Both Full Stack tracks: MERN + JFS', '2,000 DSA questions + 30 new every month', '1:1 Mentorship with 3 meeting credits']
};

/* Offer card micro-interaction: tilt towards the cursor and move a spotlight with it.
   Writes CSS variables straight to the element, so nothing re-renders. */
const tiltCard = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
  el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
  el.style.setProperty('--mx', `${x * 100}%`);
  el.style.setProperty('--my', `${y * 100}%`);
};
const resetCard = (e) => {
  ['--rx', '--ry'].forEach((v) => e.currentTarget.style.setProperty(v, '0deg'));
};

const PLAN_META = {
  starter: { Icon: Zap, tagline: 'Build strong CS & DSA foundations', cta: 'Get Core' },
  plus: { Icon: Flame, tagline: 'Everything you need to get placed', cta: 'Get Plus' },
  compete: { Icon: Crown, tagline: 'All-in: both tracks, mastery & mentorship', cta: 'Get Ultra' }
};

/* 30% launch offer countdown — set OFFER_ENDS to the real end date of the offer */
const endOfThisMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, 0).getTime();
};
const OFFER_ENDS = endOfThisMonth();
const msLeft = () => Math.max(0, OFFER_ENDS - Date.now());
const splitTime = (ms) => {
  const s = Math.floor(ms / 1000);
  return [
    ['days', Math.floor(s / 86400)],
    ['hrs', Math.floor((s % 86400) / 3600)],
    ['mins', Math.floor((s % 3600) / 60)],
    ['secs', s % 60]
  ];
};

const STATS = [
  { value: '11', label: 'Modules across CS, DSA, development & career' },
  { value: '2,000+', label: 'Curated DSA questions in Ultra' },
  { value: '100+', label: 'Proctored tests with A.I. assistance' },
  { value: '1,20,000+', label: 'Learners preparing with CipherSchools' }
];

/* "How it works" tabs — mirrors the learner dashboard */
const PLATFORM_TABS = [
  {
    id: 'watch', label: 'Watch', Icon: PlayCircle,
    title: 'Structured lectures, module by module',
    desc: 'Every module is split into units you watch in order, with progress saved as you go.',
    points: ['Recorded lectures for every module', 'Auto-play the next lecture', 'Pick up exactly where you left off'],
    mock: { head: 'Data Structures & Algorithms', rows: [['Arrays · Two pointers', '14 min', 'done'], ['Hashing · Frequency maps', '18 min', 'now'], ['Recursion · Subsets', '22 min', ''], ['Linked List · Reversal', '16 min', '']] }
  },
  {
    id: 'practice', label: 'Practice', Icon: Code2,
    title: 'Practice that matches every lecture',
    desc: 'Each unit has its own problem set: coding, MCQs, debugging or vibe-coding, tagged by level and company.',
    points: ['In-browser coding workspace', 'Easy · Medium · Hard, tagged by company', 'Problem of the Day for DSA'],
    mock: { head: 'Hashing · Practice', rows: [['Two Sum', 'Easy', 'Amazon'], ['Longest Consecutive Sequence', 'Medium', 'Google'], ['Subarray Sum Equals K', 'Medium', 'Microsoft'], ['Group Anagrams', 'Medium', 'Flipkart']] }
  },
  {
    id: 'test', label: 'Test', Icon: ClipboardCheck,
    title: 'Proctored tests, like the real thing',
    desc: 'Industry-standard proctored tests unlock as you learn: A.I. assisted, approach based, debugging and vibe coding.',
    points: ['Camera, full-screen & tab-switch monitoring', 'Module tests after every unit', 'Company-specific tests in Plus & Ultra'],
    mock: { head: 'Module Tests', rows: [['Arrays · A.I. Assisted', '45 min', 'done'], ['Hashing · Approach Based', '30 min', 'now'], ['Recursion · A.I. Assisted', '45 min', ''], ['Full Module Test', '90 min', '']] }
  },
  {
    id: 'interview', label: 'Mock Interview', Icon: Mic,
    title: 'Mock interviews before the real ones',
    desc: 'Finish a module and book a live mock interview on it. Plus adds company-specific rounds; Ultra adds a second round.',
    points: ['One per module or subject', 'Company-specific rounds in Plus & Ultra', 'Two rounds per module in Ultra'],
    mock: { head: 'Book a mock interview', rows: [['DSA Mock Interview', 'Thu, 11:00 am', 'now'], ['System Design Interview', 'Fri, 4:00 pm', ''], ['HR & Behavioural Round', 'Sat, 7:00 pm', '']] }
  },
  {
    id: 'mentor', label: '1:1 Mentorship', Icon: Users,
    title: 'A mentor when you need one',
    desc: 'Ultra includes 3 meeting credits for 1:1 sessions on DSA, development, system design or your career. Buy more any time.',
    points: ['3 credits included with Ultra', 'Pick a focus and a time that suits you', 'Cancel and your credit comes back'],
    mock: { head: '1:1 Mentorship · 3 credits left', rows: [['DSA · Graph problems review', 'Mon, 7:00 pm', 'now'], ['Career · Resume walkthrough', 'Wed, 4:00 pm', ''], ['System Design · Caching', 'Fri, 11:00 am', '']] }
  }
];

const VALUE_COMPARE = [
  { title: 'College fees', price: '₹1,00,000+', per: 'per semester', desc: 'Builds fundamentals, but placement preparation is still on you.' },
  { title: 'Offline coaching & bootcamps', price: '₹25,000+', per: 'per course', desc: 'Fixed batches and one stack at a time.' }
];

const TESTIMONIALS = [
  { initials: 'AK', name: 'Aman Kumar', role: 'SDE-1 at Amazon · 28 LPA', plan: 'Plus', quote: 'The mock interviews in the Plus plan felt just like my real bar-raiser round. The instant feedback on edge cases was priceless.' },
  { initials: 'SP', name: 'Sneha Patel', role: 'Frontend Engineer at Juspay · 18 LPA', plan: 'Plus', quote: 'Plus was the best investment of my 7th semester. Curated DSA problems with topic tags helped me clear 4 back-to-back rounds.' },
  { initials: 'RS', name: 'Rohan Sharma', role: 'Backend Developer at Razorpay · 22 LPA', plan: 'Plus', quote: 'The System Design proctored test taught me architecture diagrams and caching strategies no other course touched.' }
];

const FAQS = [
  { q: 'How does pricing work?', a: 'Every plan is a 12-month plan at 30% off, billed once: Core ₹2,088 (₹174/month), Plus ₹4,200 (₹350/month) and Ultra ₹5,880 (₹490/month).' },
  { q: 'Can I upgrade later?', a: 'Yes, any time from your dashboard. You pay only the difference between the two plans, and your validity resets to 12 months from the day you upgrade.' },
  { q: 'Which Full Stack track do I get with Plus?', a: 'Plus includes one Full Stack track, MERN or JFS, which you pick at checkout. Ultra includes both.' },
  { q: 'What is 1:1 Mentorship?', a: 'Ultra includes 3 meeting credits for 1:1 sessions with a mentor on DSA, development, system design or your career. Each meeting uses one credit, cancelling refunds it, and you can buy more credits any time.' },
  { q: 'What happens after my plan ends?', a: 'You keep lifetime access to the video lectures of your plan. Practice questions and solutions you unlocked stay in your dashboard.' },
  { q: 'Is there a refund policy?', a: 'Every paid plan comes with a 7-day 100% money-back guarantee.' },
  { q: 'How are the tests proctored?', a: 'Tests run with camera on, full-screen mode and tab-switch monitoring, the same way many companies run online assessments.' }
];

/* Headline effect: the censored letters (*) keep cycling through grawlix symbols,
   in short bursts, while the word glitches with an RGB split (see .pr-glitch). */
const GRAWLIX = '@#$%&!*?';
const grawlix = (text) => text.replace(/\*/g, () => GRAWLIX[Math.floor(Math.random() * GRAWLIX.length)]);

const GrawlixWord = ({ text }) => {
  const [shown, setShown] = useState(text);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let burst = 0;
    const t = setInterval(() => {
      burst = (burst + 1) % 24;          // ~2.9s cycle: 8 fast swaps, then rest on the asterisks
      setShown(burst < 8 ? grawlix(text) : text);
    }, 120);
    return () => clearInterval(t);
  }, [text]);
  return (
    <span className="pr-glitch" data-text={shown} aria-hidden="true">
      {shown.split('').map((ch, i) => (
        <span key={i} className={text[i] === '*' ? 'pr-censor' : undefined}>{ch}</span>
      ))}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════
   Full-size "See everything in {plan}" pop-up: headline numbers,
   then every module as a card, then what's carried over from the
   lower plan. Tabs switch between plans without closing.
   ══════════════════════════════════════════════════════════════ */
const OFFER_HIGHLIGHTS = {
  starter: [['3', 'Core modules'], ['600 + 10/mo', 'DSA questions'], ['Generic', 'Mock interview'], ['1', 'Attempt per test']],
  plus: [['9', 'Modules'], ['1,200 + 20/mo', 'DSA questions'], ['+ Company', 'Mock interviews & tests'], ['MERN or JFS', 'Full Stack track']],
  compete: [['11', 'Modules + mentorship'], ['2,000 + 30/mo', 'DSA questions'], ['2 rounds', 'Company mock interviews'], ['3 credits', '1:1 Mentorship']]
};
const OFFER_SECTIONS = {
  starter: [{ title: 'Core modules', from: 'starter' }],
  plus: [{ title: 'Plus modules', from: 'plus' }, { title: 'Also included from Core', from: 'starter', muted: true }],
  compete: [{ title: 'Ultra: every Plus module with higher limits, plus Ultra-only modules', from: 'compete' }, { title: 'Also included from Core', from: 'starter', muted: true }]
};
const moduleIcon = (text) => {
  const t = text.toLowerCase();
  if (t.includes('mentor')) return Users;
  if (t.includes('mock')) return Mic;
  if (t.includes('attempt')) return RefreshCw;
  if (t.includes('dsa') || t.includes('data structures')) return Workflow;
  if (t.includes('full stack')) return Layers;
  if (t.includes('dbms')) return Database;
  if (t.includes('computer fundamentals')) return Laptop;
  if (t.includes('system design')) return BarChart2;
  if (t.includes('generative') || t.includes('genai')) return Bot;
  if (t.includes('devops')) return Terminal;
  return Sparkles;
};

const PlanOfferingModal = ({ planId, onSwitch, onClose, ctaFor, onBuy }) => {
  const plan = PLANS_12M_DATA.find((p) => p.id === planId);
  const meta = PLAN_META[planId];

  // Lock page scroll and close on Escape while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div className="pr-om" role="dialog" aria-modal="true" aria-label={`Everything in ${plan.name}`} onClick={onClose}>
      <div className="pr-om-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Sticky header: plan switcher, price, buy */}
        <header className="pr-om-head">
          <div className="pr-om-tabs" role="tablist" aria-label="Plans">
            {PLANS_12M_DATA.map((p) => {
              const I = PLAN_META[p.id].Icon;
              return (
                <button key={p.id} type="button" role="tab" aria-selected={p.id === planId} className={p.id === planId ? 'active' : ''} onClick={() => onSwitch(p.id)}>
                  <I size={15} /> {p.name}
                </button>
              );
            })}
          </div>
          <div className="pr-om-buy">
            <span className="pr-om-price"><strong>{plan.monthlyPriceFormatted}</strong>/mo <s>{plan.originalMonthlyPrice}</s></span>
            <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={() => onBuy(plan)}>
              {ctaFor(plan)} <ArrowRight size={15} />
            </button>
          </div>
          <button type="button" className="pr-om-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </header>

        <div className="pr-om-body" key={planId}>
          <div className="pr-om-intro">
            <span className={`pr-om-badge pr-om-badge-${planId}`}><meta.Icon size={16} /> {plan.name}{plan.isPopular ? ' · Most popular' : ''}</span>
            <h2>Everything in {plan.name}</h2>
            <p>{meta.tagline}. {plan.priceFormatted} for 12 months, about ₹{plan.dailyCost} a day, with a 7-day money-back guarantee.</p>
          </div>

          <div className="pr-om-highlights">
            {OFFER_HIGHLIGHTS[planId].map(([value, label], i) => (
              <div key={label} className="pr-om-hl" style={{ '--i': i }}>
                <strong>{value}</strong><span>{label}</span>
              </div>
            ))}
          </div>

          {OFFER_SECTIONS[planId].map((sec) => {
            const nodes = PLANS_12M_DATA.find((p) => p.id === sec.from).features;
            const modules = nodes.filter((n) => n.children);
            const extras = nodes.filter((n) => !n.children);
            return (
              <section key={sec.title} className={`pr-om-section ${sec.muted ? 'is-muted' : ''}`}>
                <h3>{sec.title}</h3>
                <div className="pr-om-grid">
                  {modules.map((m, i) => {
                    const I = moduleIcon(m.text);
                    return (
                      <article key={m.text} className="pr-om-card" style={{ '--i': i }}>
                        <div className="pr-om-card-head">
                          <span className="pr-om-icon"><I size={17} /></span>
                          <h4>{m.text}</h4>
                        </div>
                        {m.info && (
                          <div className="pr-om-topics">
                            {m.info.topics.map((t) => <span key={t}>{t}</span>)}
                          </div>
                        )}
                        <ul>
                          {/* Carried-over Core modules: drop Core-only limits (its question count, ✗ lines) — the higher plan replaces them */}
                          {m.children.filter((c) => !sec.muted || (!c.excluded && !c.text.includes('DSA Questions'))).map((c) => (
                            <li key={c.text} className={c.excluded ? 'is-off' : ''}>
                              {c.excluded ? <X size={14} /> : <Check size={14} />}
                              <span>
                                {c.text}
                                {c.children && <span className="pr-om-sub">{c.children.map((g) => g.text).join(' · ')}</span>}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    );
                  })}
                </div>
                {extras.length > 0 && (
                  <ul className="pr-om-extras">
                    {extras.map((x) => {
                      const I = moduleIcon(x.text);
                      return <li key={x.text}><I size={15} /> {x.text}</li>;
                    })}
                  </ul>
                )}
              </section>
            );
          })}

          <div className="pr-om-foot">
            <p><ShieldCheck size={16} /> 7-day 100% money-back guarantee · Instant access · Upgrade any time, pay only the difference</p>
            <button type="button" className="pr-btn pr-btn-primary pr-btn-lg" onClick={() => onBuy(plan)}>
              {ctaFor(plan)} · {plan.priceFormatted} <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PremiumPage = () => {
  const navigate = useNavigate();
  const [enrollment] = useState(getEnrollment); // existing plan, if any — drives CTA labels and routing
  const [openFaq, setOpenFaq] = useState(0);
  const [tab, setTab] = useState(PLATFORM_TABS[0].id);
  const [detailsFor, setDetailsFor] = useState(null); // plan id shown in the full-size offering pop-up
  const [left, setLeft] = useState(msLeft);
  const plansRef = useRef(null);

  const location = useLocation();
  // Land at the top, or on the plan comparison when linked as /premium#plans (e.g. from dashboard preview)
  useEffect(() => {
    if (location.hash !== '#plans') { window.scrollTo(0, 0); return undefined; }
    // The page is still settling after the route change (layout, other scroll resets),
    // so keep nudging towards the plans for a moment until we're there.
    let tries = 0;
    const t = setInterval(() => {
      const el = plansRef.current;
      tries += 1;
      if (!el) return;
      const target = el.getBoundingClientRect().top + window.scrollY - 72;
      if (Math.abs(window.scrollY - target) < 8 || tries > 12) { clearInterval(t); return; }
      window.scrollTo({ top: target });
    }, 120);
    return () => clearInterval(t);
  }, [location.hash]);

  // Offer countdown
  useEffect(() => {
    const t = setInterval(() => setLeft(msLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Plan CTAs depend on what the learner already has:
     new → details form → checkout · higher → upgrade checkout (pay the difference)
     same/lower → dashboard (already included) */
  const planRelation = (planId) => {
    if (!enrollment) return 'new';
    const diff = PLAN_RANK.indexOf(planId) - PLAN_RANK.indexOf(enrollment.planId);
    return diff > 0 ? 'upgrade' : diff === 0 ? 'current' : 'included';
  };
  const upgradeCost = (planId) => {
    const target = PLANS_12M_DATA.find((p) => p.id === planId);
    const current = PLANS_12M_DATA.find((p) => p.id === enrollment?.planId);
    return `₹${Math.max(0, (target?.price || 0) - (current?.price || 0)).toLocaleString('en-IN')}`;
  };
  const ctaLabel = (plan, fallback) => ({
    new: fallback,
    upgrade: `Upgrade · Pay ${upgradeCost(plan.id)}`,
    current: 'Current plan · Go to dashboard',
    included: 'Included in your plan'
  })[planRelation(plan.id)];

  const handleOpenCheckout = (planOrId) => {
    const planId = typeof planOrId === 'string' ? planOrId : planOrId?.id;
    const slug = PLAN_SLUGS[planId];
    if (!slug) return;
    const rel = planRelation(planId);
    if (rel === 'new') {
      navigate(`/premium/checkout/${slug}`, { state: { fromPremiumCta: true } });
    } else if (rel === 'upgrade') {
      navigate(`/premium/checkout/${slug}/payment`, {
        state: { fromPremiumCta: true, details: enrollment.learner, upgradeFrom: enrollment.planId }
      });
    } else {
      navigate('/dashboard');
    }
  };

  // "Experience before you pay": open the full dashboard as a guest, everything locked
  const experience = () => {
    if (!enrollment) startPreview();
    navigate('/dashboard');
  };

  const scrollToPlans = () => plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // The plan to push in hero, value section and sticky bar: Plus, or the next tier up
  const featuredId = !enrollment ? 'plus' : PLAN_RANK[PLAN_RANK.indexOf(enrollment.planId) + 1] || null;
  const featured = PLANS_12M_DATA.find((p) => p.id === featuredId);
  const plus = PLANS_12M_DATA.find((p) => p.id === 'plus');
  const offerOn = left > 0;
  const clock = splitTime(left);
  const tabData = PLATFORM_TABS.find((t) => t.id === tab);
  const FeaturedIcon = featured ? PLAN_META[featured.id].Icon : Crown;

  return (
    <div className="pr">
      {/* ── Hero banner: pitch on the left, the plan offer on the right ── */}
      <header className="pr-hero">
        <div className="pr-hero-copy">
          <span className="pr-eyebrow"><Sparkles size={13} /> CipherSchools Premium</span>
          <h1 className="pr-h1-beyond" aria-label="Beyond LeetCode shit">
            <span className="pr-beyond" aria-hidden="true">Beyond</span>{' '}
            <GrawlixWord text="L**tC*de" />{' '}
            <span className="pr-bleep" aria-hidden="true"><span className="pr-hl pr-hl-draw">shit</span></span>
          </h1>
          <p className="pr-hero-sub">
            Lectures, practice, proctored tests, mock interviews and mentorship for CS fundamentals, DSA, development and system design.
          </p>
          <div className="pr-hero-ctas">
            <button type="button" className="pr-btn pr-btn-dark pr-btn-lg" onClick={scrollToPlans}>Compare all plans <ArrowRight size={17} /></button>
            <button type="button" className="pr-btn pr-btn-ghost pr-btn-lg" onClick={experience}>
              <Eye size={17} /> {enrollment ? 'Go to your dashboard' : 'Experience before you pay'}
            </button>
          </div>
          <ul className="pr-trust">
            <li><Users size={15} /> 1,20,000+ learners</li>
            <li><ShieldCheck size={15} /> 7-day money-back guarantee</li>
            <li><RefreshCw size={15} /> Upgrade any time, pay only the difference</li>
          </ul>
        </div>

        {featured ? (
          <aside className="pr-offer-card" aria-label={`${featured.name} plan offer`} onMouseMove={tiltCard} onMouseLeave={resetCard}>
            <div className="pr-oc-top">
              <span className="pr-oc-plan"><FeaturedIcon size={16} /> {featured.name}</span>
              <span className="pr-oc-badge">{featured.id === 'plus' ? 'Most popular' : 'Best value'}</span>
            </div>
            <div className="pr-oc-price">
              <strong>{featured.monthlyPriceFormatted}</strong><span>/month</span>
              <s>{featured.originalMonthlyPrice}</s>
              <span className="pr-oc-off">{featured.discount}</span>
            </div>
            <p className="pr-oc-billed">{featured.priceFormatted} billed for 12 months · just ₹{featured.dailyCost}/day</p>
            <ul className="pr-oc-points">
              {HERO_POINTS[featured.id].map((pt, i) => <li key={pt} style={{ '--i': i }}><Check size={15} /> {pt}</li>)}
            </ul>
            {offerOn && (
              <div className="pr-oc-timer">
                <Clock size={14} /> 30% off ends in
                <b>{clock[0][1]}d</b><b>{String(clock[1][1]).padStart(2, '0')}h</b><b>{String(clock[2][1]).padStart(2, '0')}m</b><b key={clock[3][1]} className="pr-tick">{String(clock[3][1]).padStart(2, '0')}s</b>
              </div>
            )}
            <button type="button" className="pr-btn pr-btn-primary pr-btn-lg pr-btn-block" onClick={() => handleOpenCheckout(featured)}>
              {ctaLabel(featured, `Get ${featured.name} now`)} <ArrowRight size={17} />
            </button>
            <p className="pr-oc-foot"><ShieldCheck size={13} /> 7-day money-back · Instant access</p>
          </aside>
        ) : (
          <aside className="pr-offer-card" aria-label="Your plan">
            <div className="pr-oc-top">
              <span className="pr-oc-plan"><Crown size={16} /> Ultra</span>
              <span className="pr-oc-badge">Your plan</span>
            </div>
            <p className="pr-oc-billed">You have every module, both Full Stack tracks, DSA Mastery and 1:1 Mentorship.</p>
            <Link to="/dashboard" className="pr-btn pr-btn-primary pr-btn-lg pr-btn-block">Go to dashboard <ArrowRight size={17} /></Link>
          </aside>
        )}
      </header>

      {/* ── Pricing ── */}
      <section className="pr-section pr-pricing" id="plans" ref={plansRef}>
        <div className="pr-head">
          <span className="pr-pill">Pricing Plans</span>
          <h2>Pick your plan, <span className="pr-hl">save 30%</span></h2>
          <p>12-month plans, billed once. Start with Core, or go straight to Plus or Ultra.</p>
        </div>

        {offerOn && (
          <div className="pr-offer" role="timer" aria-label="Offer countdown">
            <span className="pr-offer-text"><BadgePercent size={16} /> <strong>30% OFF</strong> on all 12-month plans · offer ends in</span>
            <span className="pr-clock">
              {clock.map(([unit, n]) => (
                <span key={unit} className="pr-clock-cell"><strong>{String(n).padStart(2, '0')}</strong><small>{unit}</small></span>
              ))}
            </span>
          </div>
        )}

        <div className="pr-cards">
          {PLANS_12M_DATA.map((plan, col) => {
            const meta = PLAN_META[plan.id];
            const rel = planRelation(plan.id);
            return (
              <article key={plan.id} className={`pr-card pr-card-${plan.id} ${plan.isPopular ? 'is-popular' : ''} ${rel === 'current' ? 'is-current' : ''}`}>
                {plan.isPopular && <div className="pr-card-flag">Most popular</div>}
                {rel === 'current' && <div className="pr-card-flag pr-card-flag-current">Your plan</div>}
                <div className="pr-card-top">
                  <h3><meta.Icon size={19} /> {plan.name}</h3>
                  <p className="pr-card-tag">{meta.tagline}</p>

                  <div className="pr-price">
                    <strong>{plan.monthlyPriceFormatted}</strong><span>/month</span>
                  </div>
                  <div className="pr-price-sub">
                    <s>{plan.originalMonthlyPrice}</s>
                    <span className="pr-off">{plan.discount}</span>
                  </div>
                  <p className="pr-billed">{plan.priceFormatted} billed for 12 months · about ₹{plan.dailyCost}/day</p>

                  <button
                    type="button"
                    className={`pr-btn pr-btn-block ${plan.isPopular ? 'pr-btn-primary' : 'pr-btn-dark'} ${rel === 'included' ? 'is-muted' : ''}`}
                    onClick={() => handleOpenCheckout(plan)}
                  >
                    {ctaLabel(plan, meta.cta)} <ArrowRight size={16} />
                  </button>
                </div>

                <ul className="pr-rows">
                  {PLAN_ROWS.map((row) => {
                    const v = row.v[col];
                    return (
                      <li key={row.label} className={v ? '' : 'is-off'}>
                        {v ? <Check size={15} className="pr-yes" /> : <X size={15} className="pr-no" />}
                        <span className="pr-row-label">{row.label}{row.note && <em> · {row.note}</em>}</span>
                        {typeof v === 'string' && <b className="pr-row-val">{v}</b>}
                      </li>
                    );
                  })}
                </ul>

                <button type="button" className="pr-more" aria-haspopup="dialog" onClick={() => setDetailsFor(plan.id)}>
                  See everything in {plan.name} <Maximize2 size={14} />
                </button>
              </article>
            );
          })}
        </div>

        <ul className="pr-assure">
          <li><ShieldCheck size={16} /> 7-day 100% money-back guarantee</li>
          <li><Zap size={16} /> Instant access after payment</li>
          <li><RefreshCw size={16} /> Upgrade any time, pay only the difference</li>
          <li><Lock size={16} /> Secure payments via UPI, cards & net banking</li>
        </ul>
      </section>

      {/* ── Numbers ── */}
      <section className="pr-section pr-stats-wrap">
        <div className="pr-stats">
          {STATS.map((s) => (
            <div key={s.label} className="pr-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platform overview ── */}
      <section className="pr-section">
        <div className="pr-head pr-head-left">
          <span className="pr-pill">Inside every module</span>
          <h2>One platform. <span className="pr-hl">Every placement advantage.</span></h2>
        </div>
        <div className="pr-tabs" role="tablist" aria-label="Platform features">
          {PLATFORM_TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
              <t.Icon size={15} /> {t.label}
            </button>
          ))}
        </div>
        <div className="pr-tab-panel" role="tabpanel">
          <div className="pr-tab-copy">
            <h3>{tabData.title}</h3>
            <p>{tabData.desc}</p>
            <ul>
              {tabData.points.map((p) => <li key={p}><Check size={15} /> {p}</li>)}
            </ul>
          </div>
          <div className="pr-mock" aria-hidden="true">
            <div className="pr-mock-bar"><i /><i /><i /><span>{tabData.mock.head}</span></div>
            <ul>
              {tabData.mock.rows.map(([a, b, c]) => (
                <li key={a} className={c === 'now' ? 'is-now' : c === 'done' ? 'is-done' : ''}>
                  <span className="pr-mock-dot" />
                  <span className="pr-mock-a">{a}</span>
                  <span className={`pr-mock-b pr-lvl-${String(b).toLowerCase()}`}>{b}</span>
                  {c && c !== 'now' && c !== 'done' && <span className="pr-mock-c">{c}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Value for money ── */}
      <section className="pr-section">
        <div className="pr-head">
          <span className="pr-pill">Value for money</span>
          <h2>Invest in your <span className="pr-hl">future</span></h2>
          <p>Compare what you pay with what you get.</p>
        </div>
        <div className="pr-value">
          {VALUE_COMPARE.map((v) => (
            <div key={v.title} className="pr-value-card">
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
              <div className="pr-value-price"><strong>{v.price}</strong> <span>{v.per}</span></div>
            </div>
          ))}
          <div className="pr-value-card is-ours">
            <h3><Flame size={18} /> CipherSchools Plus</h3>
            <ul>
              <li><Check size={15} /> A clear path through 9 modules</li>
              <li><Check size={15} /> Practice and proctored tests for every unit</li>
              <li><Check size={15} /> Company-specific tests & mock interviews</li>
              <li><Check size={15} /> One Full Stack track: MERN or JFS</li>
            </ul>
            <div className="pr-value-price"><strong>₹{plus.dailyCost}</strong> <span>/day for a full year</span></div>
            <button type="button" className="pr-btn pr-btn-primary pr-btn-block" onClick={() => handleOpenCheckout(plus)}>
              {ctaLabel(plus, `Get Plus · ${plus.priceFormatted}/year`)} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Single modules ── */}
      <section className="pr-section">
        <div className="pr-head pr-head-left pr-head-row">
          <div>
            <span className="pr-pill">Single modules</span>
            <h2>Just need one subject?</h2>
            <p>Buy a single module once: lectures, practice questions and a proctored test.</p>
          </div>
        </div>
        <div className="pr-modules">
          {MODULE_CARDS.map((mod) => (
            <div key={mod.id} className="pr-module">
              <span className="pr-module-icon"><mod.icon size={18} /></span>
              <div className="pr-module-text">
                <h3>{mod.title}</h3>
                <p>{mod.note || MODULE_INCLUDES.map((m) => m.label).join(' · ')}</p>
              </div>
              <div className="pr-module-buy">
                <strong>₹{mod.price.toLocaleString('en-IN')}</strong>
                <Link to="/login" state={{ module: mod.id, price: mod.price }} className="pr-link">Buy <ArrowRight size={14} /></Link>
              </div>
            </div>
          ))}
        </div>
        <p className="pr-modules-hint">
          Need three or more? <button type="button" className="pr-link" onClick={scrollToPlans}>Plus includes all of these for {plus.priceFormatted} <ArrowRight size={14} /></button>
        </p>
      </section>

      {/* ── Testimonials ── */}
      <section className="pr-section">
        <div className="pr-head">
          <span className="pr-pill">Placements</span>
          <h2>Learners who <span className="pr-hl">made it</span></h2>
        </div>
        <div className="pr-testimonials">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="pr-testimonial">
              <div className="pr-stars" aria-label="5 out of 5">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} />)}</div>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                <span className="pr-avatar">{t.initials}</span>
                <span><strong>{t.name}</strong><small>{t.role}</small></span>
                <span className="pr-plan-tag">{t.plan}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pr-section pr-faq">
        <div className="pr-faq-side">
          <span className="pr-pill">FAQ</span>
          <h2>Questions, answered</h2>
          <p>Still unsure? Every plan has a 7-day money-back guarantee, so you can try it without risk.</p>
        </div>
        <div className="pr-faq-list">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className={`pr-faq-item ${open ? 'open' : ''}`}>
                <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)}>
                  {f.q} <ChevronDown size={17} />
                </button>
                {open && <p>{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="pr-final">
        <h2>Your placement year starts today</h2>
        <p>Join 1,20,000+ learners preparing with CipherSchools.</p>
        <div className="pr-hero-ctas">
          {featured && (
            <button type="button" className="pr-btn pr-btn-primary pr-btn-lg" onClick={() => handleOpenCheckout(featured)}>
              {ctaLabel(featured, `Get ${featured.name} · ${featured.monthlyPriceFormatted}/month`)} <ArrowRight size={17} />
            </button>
          )}
          <button type="button" className="pr-btn pr-btn-light pr-btn-lg" onClick={scrollToPlans}>Compare plans</button>
        </div>
      </section>

      {detailsFor && (
        <PlanOfferingModal
          planId={detailsFor}
          onSwitch={setDetailsFor}
          onClose={() => setDetailsFor(null)}
          ctaFor={(plan) => ctaLabel(plan, PLAN_META[plan.id].cta)}
          onBuy={(plan) => { setDetailsFor(null); handleOpenCheckout(plan); }}
        />
      )}

      {/* ── Slim sticky banner: always on screen, pushes the next plan up (Plus for new learners) ── */}
      {featured && (
        <div className="pr-sticky" role="region" aria-label={`Upgrade to ${featured.name}`}>
          <div className="pr-sticky-inner">
            <span className="pr-sticky-tag"><Flame size={14} /> Upgrade to {featured.name}</span>
            <span className="pr-sticky-price">
              <strong>{featured.monthlyPriceFormatted}</strong>/mo <s>{featured.originalMonthlyPrice}</s>
              <span className="pr-sticky-off">{featured.discount}</span>
            </span>
            {offerOn && <span className="pr-sticky-timer"><Clock size={13} /> ends in {clock[0][1]}d {clock[1][1]}h {String(clock[2][1]).padStart(2, '0')}m</span>}
            <button type="button" className="pr-sticky-btn" onClick={() => handleOpenCheckout(featured)}>
              {ctaLabel(featured, `Upgrade to ${featured.name}`)} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumPage;
