import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Activity, ArrowUpRight, Award, BookOpen, CalendarDays, ChevronDown, ChevronRight, CircleCheck, CirclePlay, ClipboardCheck,
  Code2, Contrast, Crown, Eye, FileText, Flame, Info, LayoutDashboard, ListChecks, Lock, Menu, Mic, Moon, PanelLeft, RotateCcw,
  CreditCard, LifeBuoy, LogOut, ScanSearch, Search, Sparkles, Sun, UserRound, Users, Wrench, X, Zap
} from 'lucide-react';
import { clearEnrollment, getEnrollment, saveEnrollment } from '../utils/enrollment';
import { clearSession, getSession } from '../utils/auth';
import { dayKey, useLearnerProgress, useSessionProgress } from '../utils/learnerProgress';
import { PREVIEW_SHARE, previewFreeInModule, previewModules } from '../utils/previewAccess';
import {
  MODULES, PLAN_LABELS, allLectures, isExtendedPlan, moduleForPlan, moduleUnlocked, subjectTests
} from '../data/learnerModules';
import ModuleIcon from '../components/ModuleIcon';
import ModuleView from './DashboardModuleView';
import DashboardPlayer from './DashboardPlayer';
import DashboardWorkspace from './DashboardWorkspace';
import DashboardMentorship from './DashboardMentorship';
import { mentorCreditsLeft } from '../utils/mentorship';
import { learningStats } from '../utils/learningStats';
import { SHOW_DEMO_PROGRESS, activityFor, withDemoModuleProgress, withDemoStats } from '../utils/demoActivity';
import { PREVIEW_ENROLLMENT, clearSplash, endPreview, isPreviewOn, wantsSplash } from '../utils/preview';
import DashboardPreviewPlans from './DashboardPreviewPlans';
import DashboardPreviewSplash from './DashboardPreviewSplash';
import DashboardActivity from './DashboardActivity';
import DashboardSearch from './DashboardSearch';
import DashboardPlanner from './DashboardPlanner';
import DashboardCertificates from './DashboardCertificates';
import DashboardNextStep from './DashboardNextStep';
import WhatsNext from './DashboardWhatsNext';
import DashboardAccount from './DashboardAccount';
import DashboardContent from './DashboardContent';
import DashboardCoins from './DashboardCoins';
import CoinsMenu, { CoinToast } from './DashboardCoinsMenu';
import { useCipherCoins } from '../utils/cipherCoins';
import DashboardSubscription from './DashboardSubscription';
import DashboardSupport from './DashboardSupport';
import './LearnerDashboardPage.css';

/* ══════════════════════════════════════════════════════════════
   Learner dashboard. Only renders for a paid (demo) enrollment or
   the "Experience before you pay" preview; otherwise → /premium.
   Routes:  /dashboard               → Overview
            /dashboard/content       → opens the module to continue with
            /dashboard/m/:moduleId   → module (Content / Practice / Test / Mock),
                                       with the module bar under the top bar
            /dashboard/planner · /activity · /certificates · /mentorship
   ══════════════════════════════════════════════════════════════ */

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return ['Good morning', 'Fresh start. Pick up one lecture and build momentum.'];
  if (h < 17) return ['Good afternoon', 'The day gets heavy around now. Good to see you still going.'];
  return ['Good evening', 'A focused hour now beats a scattered weekend.'];
};

const THEME_KEY = 'cs_dash_theme';
// Light by default on first visit; dark only once the learner has chosen it
const readTheme = () => {
  try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
};

/* Same plan icons as the pricing cards: Core ⚡ · Plus 🔥 · Ultra 👑 */
const TIER_ICONS = { core: Zap, plus: Flame, ultra: Crown };
const PLAN_TIER = { starter: 'core', plus: 'plus', compete: 'ultra' }; // plan id → its tier (icon / label)

const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);

/* Modules the learner works in: the plan's own (preview: its short list) */
const learnerModules = (ctx) => (ctx.preview ? ctx.modules : ctx.modules.filter((m) => moduleUnlocked(m, ctx.planId, ctx.devTrack)));

const LearnerDashboardPage = () => {
  const [realEnrollment, setRealEnrollment] = useState(getEnrollment);
  // Guests who chose "Experience before you pay" get a partly open dashboard
  const [preview] = useState(() => !realEnrollment && isPreviewOn());
  // Preview after a free login: show the signed-in name instead of "Guest"
  const [session] = useState(getSession);
  const enrollment = realEnrollment || (preview
    ? (session?.email ? { ...PREVIEW_ENROLLMENT, learner: { name: session.name || 'Guest', email: session.email } } : PREVIEW_ENROLLMENT)
    : null);
  const learner = useLearnerProgress();
  const guest = useSessionProgress(); // preview: what a guest tries lasts only for this visit
  const { progress, toggle, set } = preview ? guest : learner;
  const [purchase, setPurchase] = useState(null); // preview only: { mod?, target? } while the plan pop-up is open
  // Crack-wall splash, once per "Experience before you pay" entry
  const [splash, setSplash] = useState(() => preview && wantsSplash());
  const endSplash = useCallback(() => setSplash(false), []);
  useEffect(() => { if (splash) clearSplash(); }, [splash]);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(readTheme);
  const [searchOpen, setSearchOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const coins = useCipherCoins(preview); // preview: coins last for this visit only
  const location = useLocation();

  // Cmd/Ctrl + F (or K) opens dashboard search; the code editor keeps its own find
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || !['f', 'k'].includes(e.key.toLowerCase())) return;
      if (e.target.closest?.('.dx-ws')) return;
      e.preventDefault();
      setSearchOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleTheme = () => setTheme((t) => {
    const next = t === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch { /* storage blocked */ }
    return next;
  });

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  if (!enrollment) return <Navigate to="/premium" replace />;

  // The lecture player and coding workspace take the full width, so the sidebar collapses
  const onPlayer = /^\/dashboard\/m\/[^/]+\/(watch|practice)\//.test(location.pathname);

  const planId = enrollment.planId;
  // Paid dashboards show only the plan bought, so there is no upgrade path inside them.
  // openUpgrade(target?) and lockedTap(mod) are preview-only.
  const ctx = {
    enrollment, planId, extended: isExtendedPlan(planId), devTrack: enrollment.devTrack, progress, toggle, set,
    // Every module as this plan sees it (e.g. Core gets DSA Basics only, not Advanced).
    // Preview shows only DSA, Development and System Design.
    modules: preview ? previewModules() : MODULES.map((m) => moduleForPlan(m, planId, enrollment.devTrack)),
    preview,
    // Preview: a plain "Get plan" goes to the premium page's plan comparison; a locked item asks for its plan
    openUpgrade: (target) => (target ? setPurchase({ target }) : navigate('/premium#plans')),
    lockedTap: (mod) => setPurchase({ mod }),
    theme, toggleTheme,
    // My Account: save edited details back to the (demo) enrollment
    updateLearner: (patch) => {
      if (!realEnrollment) return;
      const next = { ...realEnrollment, learner: { ...realEnrollment.learner, ...patch } };
      saveEnrollment(next);
      setRealEnrollment(next);
    },
    openSupport: () => setSupportOpen(true),
    coins,
    // Log out: forget this device's enrollment (progress stays) and go home
    logout: () => { clearEnrollment(); clearSession(); navigate('/', { replace: true }); }
  };
  const exitPreview = () => { endPreview(); clearSession(); navigate('/premium'); };

  return (
    <div className={`dx ${collapsed || onPlayer ? 'dx-collapsed' : ''} ${theme === 'light' ? 'dx-light' : ''} ${preview ? 'dx-preview' : ''}`}>
      <Sidebar ctx={ctx} onCollapse={() => setCollapsed((v) => !v)} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onSearch={() => { setMobileOpen(false); setSearchOpen(true); }} />
      {mobileOpen && <div className="dx-scrim" onClick={() => setMobileOpen(false)} />}

      <div className="dx-main">
        <TopBar ctx={ctx} onMenu={() => setMobileOpen(true)} theme={theme} onToggleTheme={toggleTheme} onSearch={() => setSearchOpen(true)} />
        {preview && (
          <div className="dx-pv-bar" role="status">
            <Eye size={16} />
            <span><strong>Preview</strong> · about {Math.round(PREVIEW_SHARE * 100)}% of each module is open to try; tap anything locked to unlock it</span>
            <button type="button" className="dx-btn dx-btn-primary dx-btn-sm" onClick={() => navigate('/premium#plans')}>See plans</button>
            <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={exitPreview}>Exit preview</button>
          </div>
        )}
        <main className="dx-page">
          <Routes>
            <Route path="/dashboard" element={<Overview ctx={ctx} />} />
            <Route path="/dashboard/content" element={<DashboardContent ctx={ctx} />} />
            <Route path="/dashboard/m/:moduleId" element={<ModuleRoute ctx={ctx} />} />
            <Route path="/dashboard/m/:moduleId/watch/:lectureId" element={<PlayerRoute ctx={ctx} />} />
            <Route path="/dashboard/m/:moduleId/practice/:itemId" element={<WorkspaceRoute ctx={ctx} />} />
            <Route path="/dashboard/planner" element={<DashboardPlanner ctx={ctx} />} />
            <Route path="/dashboard/activity" element={<DashboardActivity ctx={ctx} />} />
            <Route path="/dashboard/certificates" element={<DashboardCertificates ctx={ctx} />} />
            <Route path="/dashboard/mentorship" element={<DashboardMentorship ctx={ctx} />} />
            <Route path="/dashboard/coins" element={<DashboardCoins ctx={ctx} />} />
            <Route path="/dashboard/account" element={preview ? <Navigate to="/dashboard" replace /> : <DashboardAccount ctx={ctx} />} />
            <Route path="/dashboard/subscription" element={preview ? <Navigate to="/dashboard" replace /> : <DashboardSubscription ctx={ctx} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Next-step pop-ups: lectures done → practice, practice done → tests, all three → mock */}
      <DashboardNextStep ctx={ctx} />
      {searchOpen && <DashboardSearch ctx={ctx} onClose={() => setSearchOpen(false)} />}
      <CoinToast coins={coins} />
      {supportOpen && <DashboardSupport ctx={ctx} onClose={() => setSupportOpen(false)} />}
      {splash && <DashboardPreviewSplash onDone={endSplash} />}
      {purchase && <DashboardPreviewPlans mod={purchase.mod} target={purchase.target} onClose={() => setPurchase(null)} />}
    </div>
  );
};

const previewOpen = (ctx, moduleId, id) => {
  const mod = ctx.modules.find((m) => m.id === moduleId);
  return !!mod && previewFreeInModule(mod, ctx.extended).has(id);
};

/* Content opens the module to continue with (the first one not finished) */

// Keyed by module id so per-module state (selected subject, open units) starts fresh
const ModuleRoute = ({ ctx }) => {
  const { moduleId } = useParams();
  return <ModuleView key={moduleId} ctx={ctx} />;
};

// Keyed by lecture so the "ended / up next" state resets for every video
const PlayerRoute = ({ ctx }) => {
  const { moduleId, lectureId } = useParams();
  // Preview: only the open (first ~30%) lectures play
  if (ctx.preview && !previewOpen(ctx, moduleId, lectureId)) return <Navigate to={`/dashboard/m/${moduleId}`} replace />;
  return <DashboardPlayer key={lectureId} ctx={ctx} />;
};

// Keyed by item so code, console and submissions load fresh for each problem
const WorkspaceRoute = ({ ctx }) => {
  const { moduleId, itemId } = useParams();
  // Preview: only the open (first ~30%) practice problems can be solved
  if (ctx.preview && !previewOpen(ctx, moduleId, itemId)) return <Navigate to={`/dashboard/m/${moduleId}?tab=practice`} replace />;
  return <DashboardWorkspace key={itemId} ctx={ctx} />;
};

const moduleProgress = (mod, progress) => {
  const lectures = allLectures(mod);
  const done = lectures.filter((l) => progress.watched[l.id]).length;
  return { done, total: lectures.length, pct: pct(done, lectures.length) };
};

const initialsOf = (name) => name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/* ─────────────────────────── Sidebar ─────────────────────────── */

const TOOLS = [
  { to: '/resume', label: 'Resume Builder', Icon: FileText },
  { to: '/resume/ats-checker', label: 'ATS Checker', Icon: ScanSearch },
  { to: '/online-compiler', label: 'Compiler', Icon: Code2 }
];

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

const Sidebar = ({ ctx, onCollapse, mobileOpen, onClose, onSearch }) => {
  const { extended, progress, enrollment } = ctx;
  const learnerName = enrollment.learner?.name?.trim() || 'Learner';
  const location = useLocation();
  const [toolsOpen, setToolsOpen] = useState(true);
  const inContent = location.pathname.startsWith('/dashboard/m/') || location.pathname === '/dashboard/content';

  return (
    <aside className={`dx-side ${mobileOpen ? 'open' : ''}`} aria-label="Dashboard navigation">
      <div className="dx-brand">
        <Link to="/" className="dx-logo" title="CipherSchools home">
          <img src="/cipherschools-logo.png" alt="" />
          <span>CipherSchools</span>
        </Link>
        <button type="button" className="dx-icon-btn dx-collapse" onClick={onCollapse} aria-label="Collapse sidebar">
          <PanelLeft size={17} />
        </button>
        <button type="button" className="dx-icon-btn dx-close" onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      {/* Small search: opens the dashboard-wide search (also Cmd/Ctrl + F) */}
      <button type="button" className="dx-side-search" onClick={onSearch} aria-haspopup="dialog" aria-label="Search the dashboard" title="Search">
        <Search size={15} />
        <span className="dx-label">Search</span>
        <kbd className="dx-label">{isMac ? '⌘' : 'Ctrl'} F</kbd>
      </button>

      <nav className="dx-nav">
        <span className="dx-nav-heading dx-label">Main menu</span>
        <NavLink to="/dashboard" end className="dx-nav-item" onClick={onClose} title="Overview">
          <LayoutDashboard size={18} /><span className="dx-label">Overview</span>
        </NavLink>
        <NavLink to="/dashboard/content" className={`dx-nav-item ${inContent ? 'active' : ''}`} onClick={onClose} title="Content">
          <BookOpen size={18} /><span className="dx-label">Content</span>
        </NavLink>
        <NavLink to="/dashboard/planner" className="dx-nav-item" onClick={onClose} title="Planner">
          <CalendarDays size={18} /><span className="dx-label">Planner</span>
        </NavLink>
        <NavLink to="/dashboard/activity" className="dx-nav-item" onClick={onClose} title="Activity">
          <Activity size={18} /><span className="dx-label">Activity</span>
        </NavLink>
        <NavLink to="/dashboard/certificates" className="dx-nav-item" onClick={onClose} title="Certificates">
          <Award size={18} /><span className="dx-label">Certificates</span>
        </NavLink>
        {extended && !ctx.preview && (
          <NavLink to="/dashboard/mentorship" className="dx-nav-item" onClick={onClose} title="1:1 Mentorship">
            <Users size={18} /><span className="dx-label dx-nav-text">1:1 Mentorship</span>
            <span className="dx-label dx-nav-pct">{mentorCreditsLeft(progress)} cr</span>
          </NavLink>
        )}

        {/* Tools open the site's own pages (outside the dashboard) */}
        <span className="dx-nav-heading dx-label">Tools</span>
        <div className={`dx-nav-module has-subs ${toolsOpen ? '' : 'is-folded'}`}>
          <button type="button" className="dx-nav-item dx-nav-groupbtn" onClick={() => setToolsOpen((v) => !v)} aria-expanded={toolsOpen} title="Tools">
            <Wrench size={18} /><span className="dx-label dx-nav-text">Tools</span>
            <ChevronDown size={15} className={`dx-label dx-tools-chev ${toolsOpen ? 'up' : ''}`} />
          </button>
          {toolsOpen && (
            <ul className="dx-nav-sub">
              {TOOLS.map((t) => (
                <li key={t.to}>
                  <Link to={t.to} className="dx-nav-subitem" onClick={onClose}>
                    <t.Icon size={14} className="dx-nav-subicon" />
                    <span className="dx-nav-text">{t.label}</span>
                    <ArrowUpRight size={13} className="dx-nav-ext" aria-label="Opens outside the dashboard" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      <div className="dx-side-foot">
        {/* Profile row: initials · name · plan; opens the account menu */}
        <ProfileMenu ctx={ctx} name={learnerName} onNavigate={onClose} />
      </div>
    </aside>
  );
};

/* ─────────────────── Profile menu (sidebar foot) ─────────────────── */

const ProfileMenu = ({ ctx, name, onNavigate }) => {
  const { planId, enrollment } = ctx;
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open]);

  const go = (to) => { setOpen(false); onNavigate(); navigate(to); };
  const email = enrollment.learner?.email;
  const items = ctx.preview ? [
    { key: 'support', label: 'Support & Feedback', Icon: LifeBuoy, run: () => { setOpen(false); onNavigate(); ctx.openSupport(); } },
    { key: 'exit', label: 'Exit preview', Icon: LogOut, run: () => { setOpen(false); endPreview(); clearSession(); navigate('/premium'); }, danger: true }
  ] : [
    { key: 'account', label: 'My Account', Icon: UserRound, run: () => go('/dashboard/account') },
    { key: 'sub', label: 'My Subscription', Icon: CreditCard, run: () => go('/dashboard/subscription'), note: PLAN_LABELS[planId] },
    { key: 'support', label: 'Support & Feedback', Icon: LifeBuoy, run: () => { setOpen(false); onNavigate(); ctx.openSupport(); } },
    { key: 'logout', label: 'Logout', Icon: LogOut, run: () => { setOpen(false); ctx.logout(); }, danger: true }
  ];

  return (
    <div className="dx-profile-wrap" ref={wrap}>
      {open && (
        <div className="dx-pmenu" role="menu" aria-label="Account">
          <div className="dx-pmenu-head">
            <span className="dx-profile-avatar">{initialsOf(name)}</span>
            <span className="dx-pmenu-who">
              <strong>{name}</strong>
              <span>{ctx.preview ? 'Previewing the dashboard' : email || `${PLAN_LABELS[planId]} plan`}</span>
            </span>
          </div>
          {items.map((it, i) => (
            <button key={it.key} type="button" role="menuitem" className={`dx-pmenu-item ${it.danger ? 'is-danger' : ''} ${it.danger && i > 0 ? 'has-sep' : ''}`} onClick={it.run}>
              <it.Icon size={16} />
              <span>{it.label}</span>
              {it.note && <em>{it.note}</em>}
            </button>
          ))}
        </div>
      )}
      <div className="dx-profile">
        <button type="button" className="dx-profile-btn" onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} title={name}>
          <span className="dx-profile-avatar">{initialsOf(name)}</span>
          <span className="dx-profile-text">
            <strong>{name}</strong>
            <span>{ctx.preview ? 'Preview' : `${PLAN_LABELS[planId]} plan`}</span>
          </span>
          <ChevronDown size={15} className={`dx-label dx-profile-chev ${open ? 'up' : ''}`} />
        </button>
        {ctx.preview && (
          <button type="button" className="dx-upgrade" onClick={() => { onNavigate(); ctx.openUpgrade(); }}><Sparkles size={14} /> Get plan</button>
        )}
      </div>
    </div>
  );
};

const TierIcon = ({ tier }) => {
  const Icon = TIER_ICONS[tier];
  return Icon ? <Icon size={13} className={`dx-tier-icon dx-tier-${tier}`} aria-hidden="true" /> : null;
};

/* ─────────────────── Module bar (Content) ─────────────────── */

/* ─────────────────────────── Top bar ─────────────────────────── */

/* Page title for the top bar, from the route */
const PAGE_TITLES = {
  '/dashboard': 'Overview', '/dashboard/planner': 'Planner', '/dashboard/activity': 'Activity',
  '/dashboard/certificates': 'Certificates', '/dashboard/mentorship': '1:1 Mentorship', '/dashboard/content': 'Content',
  '/dashboard/account': 'My Account', '/dashboard/coins': 'CipherCoins', '/dashboard/subscription': 'My Subscription'
};
const pageTitle = (pathname, ctx) => {
  const m = pathname.match(/^\/dashboard\/m\/([^/]+)/);
  if (m) return { title: 'Content', sub: ctx.modules.find((x) => x.id === m[1])?.title, subTo: `/dashboard/m/${m[1]}` };
  return { title: PAGE_TITLES[pathname.replace(/\/$/, '')] || 'Overview' };
};

const TopBar = ({ ctx, onMenu, theme, onToggleTheme, onSearch }) => {
  const { planId, progress } = ctx;
  const location = useLocation();
  const { title, sub, subTo } = pageTitle(location.pathname, ctx);
  const watchedTotal = Object.keys(progress.watched).length;

  return (
    <header className="dx-top">
      <button type="button" className="dx-icon-btn dx-menu" onClick={onMenu} aria-label="Open menu"><Menu size={18} /></button>

      <div className="dx-top-title">
        {sub ? (
          <>
            <Link to="/dashboard/content" className="dx-top-title-root">{title}</Link>
            <ChevronRight size={16} className="dx-top-title-sep" aria-hidden="true" />
            <h1><Link to={subTo}>{sub}</Link></h1>
          </>
        ) : <h1>{title}</h1>}
      </div>

      {/* Phones: the sidebar is a drawer, so search also sits here */}
      <button type="button" className="dx-icon-btn dx-top-search" onClick={onSearch} aria-label="Search the dashboard"><Search size={17} /></button>

      <div className="dx-top-right">
        <button
          type="button"
          className="dx-icon-btn dx-theme-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <span className="dx-top-divider" aria-hidden="true" />
        <CoinsMenu ctx={ctx} />
        <span className="dx-top-divider" aria-hidden="true" />
        <span className="dx-stat-pill" title="Lectures watched"><CirclePlay size={15} /> {watchedTotal}</span>
        <span className="dx-top-divider" aria-hidden="true" />
        {ctx.preview ? (
          <button type="button" className="dx-upgrade" onClick={() => ctx.openUpgrade()}><Sparkles size={15} /> Get a plan</button>
        ) : (
          <span className="dx-plan-pill"><TierIcon tier={PLAN_TIER[planId]} /> {PLAN_LABELS[planId]}</span>
        )}
      </div>
    </header>
  );
};

/* ─────────────────────────── Overview ─────────────────────────── */

const STAT_CARDS = [
  { key: 'lectures', label: 'Lectures watched', tab: 'watch', Icon: CirclePlay, kind: 'lecture' },
  { key: 'practice', label: 'Practice solved', tab: 'practice', Icon: ListChecks, kind: 'practice' },
  { key: 'tests', label: 'Tests taken', tab: 'test', Icon: ClipboardCheck, kind: 'test' },
  { key: 'interviews', label: 'Mock interviews', tab: 'interview', Icon: Mic, kind: 'interview' }
];
const MODULE_TABS = [
  { id: 'all', label: 'All modules' },
  { id: 'progress', label: 'In progress' },
  { id: 'new', label: 'Not started' },
  { id: 'done', label: 'Completed' }
];
const BANNER_KEY = 'cs_dash_plan_banner_hidden';
const MONO_KEY = 'cs_dash_overview_mono';

const Overview = ({ ctx }) => {
  const { enrollment, planId, progress } = ctx;
  const [hello, sub] = greeting();
  const name = enrollment.learner?.name?.trim() || 'Learner';
  const [tab, setTab] = useState('all');
  const [bannerHidden, setBannerHidden] = useState(() => { try { return sessionStorage.getItem(BANNER_KEY) === '1'; } catch { return false; } });
  // Greyscale for the four stat cards (remembered on this device)
  const [mono, setMono] = useState(() => { try { return localStorage.getItem(MONO_KEY) === '1'; } catch { return false; } });
  const toggleMono = () => setMono((v) => { try { localStorage.setItem(MONO_KEY, v ? '0' : '1'); } catch { /* blocked */ } return !v; });

  const mods = learnerModules(ctx);
  // What each module shows: real progress, or the demo sample while the demo switch is on
  const shown = mods.map((m, i) => ({ mod: m, prog: ctx.preview ? moduleProgress(m, progress) : withDemoModuleProgress(moduleProgress(m, progress), i) }));
  const startHere = shown.find((x) => x.prog.pct < 100)?.mod.id;
  const startMod = startHere || mods[0]?.id;

  const realStats = learningStats(ctx.modules, ctx);
  // Demo: sample numbers so the stat cards aren't empty (see utils/demoActivity.js)
  const stats = SHOW_DEMO_PROGRESS && !ctx.preview ? withDemoStats(realStats, planId) : realStats;

  const validTill = new Date(enrollment.paidAt);
  validTill.setFullYear(validTill.getFullYear() + 1);
  const hideBanner = () => { setBannerHidden(true); try { sessionStorage.setItem(BANNER_KEY, '1'); } catch { /* blocked */ } };

  const stateOf = (p) => (p.pct >= 100 ? 'done' : p.pct > 0 ? 'progress' : 'new');
  const listed = shown.filter((x) => tab === 'all' || stateOf(x.prog) === tab);

  return (
    <div className={`dx-ov2 ${mono ? 'is-mono' : ''}`}>
      <header className="dx-page-head">
        <div>
          <p className="dx-muted">
            {ctx.preview
              ? `Welcome, explorer. DSA, Development and System Design: about ${Math.round(PREVIEW_SHARE * 100)}% of each is open to try.`
              : `${hello}, ${name}. ${sub}`}
          </p>
        </div>
        <button type="button" role="switch" aria-checked={mono} className={`dx-mono-toggle ${mono ? 'is-on' : ''}`} onClick={toggleMono} title="Show the stat cards in greyscale">
          <Contrast size={15} />
          <span>Greyscale</span>
          <span className="dx-switch" aria-hidden="true"><span /></span>
        </button>
      </header>

      {!ctx.preview && !bannerHidden && (
        <div className="dx-ov-banner" role="status">
          <Info size={16} />
          <span>
            Your <strong>{PLAN_LABELS[planId]}</strong> plan is active till {validTill.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {planId === 'plus' && <> · Full Stack track: <strong>{(ctx.devTrack || 'mern').toUpperCase()}</strong></>}
          </span>
          <button type="button" className="dx-icon-btn" onClick={hideBanner} aria-label="Dismiss"><X size={16} /></button>
        </div>
      )}

      {!ctx.preview && (
        <section className="dx-ov-stats dx-kpis" aria-label="Learning progress">
          {/* Four pillars as one compact strip; each cell opens that pillar in the current module */}
          {STAT_CARDS.map((c) => {
            const v = stats[c.key];
            const p = pct(v.done, v.total);
            return (
              <Link
                key={c.key}
                to={startMod ? `/dashboard/m/${startMod}?tab=${c.tab}` : '/dashboard/content'}
                className={`dx-kpi dx-stat-${c.kind}`}
                aria-label={`${c.label}: ${v.done} of ${v.total}, ${p}%. See details`}
              >
                <span className="dx-kpi-head">
                  <span className="dx-kpi-icon"><c.Icon size={14} /></span>
                  <span className="dx-kpi-label">{c.label}</span>
                  <ArrowUpRight size={15} className="dx-kpi-go" aria-hidden="true" />
                </span>
                <span className="dx-kpi-body">
                  <span className="dx-kpi-val"><strong>{v.done}</strong>/{v.total}</span>
                  <span className="dx-kpi-pct">{p}%</span>
                </span>
                <span className="dx-kpi-bar" aria-hidden="true"><span style={{ width: `${p}%` }} /></span>
                {c.key === 'practice' && <span className="dx-kpi-sub">Coding {v.coding.done}/{v.coding.total} · MCQ {v.mcq.done}/{v.mcq.total}</span>}
              </Link>
            );
          })}
        </section>
      )}

      <div className="dx-ov-row">
        <ProgressChart ctx={ctx} mods={mods} />
        {/* What's next: next lecture, practice question, test and mock for the current section */}
        <WhatsNext ctx={ctx} mods={mods} />
      </div>

      <section className="dx-ov-modules">
        <div className="dx-ov-tabs" role="tablist" aria-label="Filter modules">
          {(ctx.preview ? MODULE_TABS.slice(0, 1) : MODULE_TABS).map((t) => {
            const count = t.id === 'all' ? shown.length : shown.filter((x) => stateOf(x.prog) === t.id).length;
            return (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
                {t.label} <span className="dx-count">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="dx-module-grid">
          {listed.length === 0 && <p className="dx-muted dx-ov-empty">No modules here yet.</p>}
          {listed.map(({ mod, prog }) => (ctx.preview
            ? <ModuleCard key={mod.id} mod={mod} progress={progress} locked={`${{ core: 'Core', plus: 'Plus', ultra: 'Ultra' }[mod.tier]} · ${Math.round(PREVIEW_SHARE * 100)}% open`} />
            : <ModuleCard key={mod.id} mod={mod} progress={progress} shown={prog} highlight={mod.id === startHere} />))}
        </div>
      </section>
    </div>
  );
};

/* "Your progress": lectures, practice, tests and mock interviews per day, from the activity log */
const RANGES = [{ id: 7, label: '7 days' }, { id: 14, label: '14 days' }, { id: 30, label: '30 days' }];
const SERIES = [
  { id: 'lecture', label: 'Lectures', color: 'var(--accent)' },
  { id: 'practice', label: 'Practice', color: '#3B82F6' },
  { id: 'test', label: 'Tests', color: '#10B981' },
  { id: 'interview', label: 'Mock interviews', color: '#A855F7' }
];
const W = 600;
const H = 200;

const smoothPath = (pts) => pts.reduce((d, p, i, a) => {
  if (i === 0) return `M${p[0]},${p[1]}`;
  const [x0, y0] = a[i - 1];
  const cx = (x0 + p[0]) / 2;
  return `${d} C${cx},${y0} ${cx},${p[1]} ${p[0]},${p[1]}`;
}, '');

const ProgressChart = ({ ctx, mods }) => {
  const [range, setRange] = useState(14);
  const [hover, setHover] = useState(null);
  const activity = activityFor(ctx, mods);

  const days = useMemo(() => {
    const out = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const a = activity[dayKey(d)] || {};
      out.push({ date: d, lecture: a.lecture || 0, practice: a.practice || 0, test: a.test || 0, interview: a.interview || 0 });
    }
    return out;
  }, [activity, range]);

  const max = Math.max(4, ...days.flatMap((d) => SERIES.map((s) => d[s.id])));
  const step = Math.ceil(max / 4);
  const top = step * 4;
  const x = (i) => (days.length === 1 ? W / 2 : (i / (days.length - 1)) * W);
  const y = (v) => H - (v / top) * H;
  const totals = SERIES.map((s) => days.reduce((a, d) => a + d[s.id], 0));
  const labelEvery = range <= 7 ? 1 : range <= 14 ? 2 : 5;

  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - box.left) / box.width) * (days.length - 1));
    setHover(Math.max(0, Math.min(days.length - 1, i)));
  };
  const h = hover != null ? days[hover] : null;

  return (
    <section className="dx-card dx-ov-chart">
      <div className="dx-ov-card-head">
        <h3><Activity size={16} /> Your progress</h3>
        <div className="dx-ov-range" role="radiogroup" aria-label="Range">
          {RANGES.map((r) => (
            <button key={r.id} type="button" role="radio" aria-checked={range === r.id} className={range === r.id ? 'active' : ''} onClick={() => { setRange(r.id); setHover(null); }}>{r.label}</button>
          ))}
        </div>
      </div>
      <div className="dx-ov-legend">
        {SERIES.map((s, i) => (
          <span key={s.id}><i style={{ background: s.color }} /> {s.label} <strong>{totals[i]}</strong></span>
        ))}
      </div>
      <div className="dx-chart">
        <div className="dx-chart-y" aria-hidden="true">
          {[4, 3, 2, 1, 0].map((k) => <span key={k}>{k * step}</span>)}
        </div>
        <div className="dx-chart-plot" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`Lectures, practice, tests and mock interviews per day, last ${range} days`}>
            {[0, 1, 2, 3, 4].map((k) => <line key={k} x1="0" x2={W} y1={(k / 4) * H} y2={(k / 4) * H} className="dx-chart-grid" />)}
            {SERIES.map((s) => (
              <path key={s.id} d={smoothPath(days.map((d, i) => [x(i), y(d[s.id])]))} className="dx-chart-line" style={{ stroke: s.color }} />
            ))}
            {h && <line x1={x(hover)} x2={x(hover)} y1="0" y2={H} className="dx-chart-cursor" />}
          </svg>
          {h && SERIES.map((s) => (
            <span key={s.id} className="dx-chart-dot" style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(h[s.id]) / H) * 100}%`, background: s.color }} />
          ))}
          {h && (
            <div className={`dx-chart-tip ${hover > days.length / 2 ? 'left' : ''}`} style={{ left: `${(x(hover) / W) * 100}%` }}>
              <strong>{h.date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</strong>
              {SERIES.map((s) => <span key={s.id}><i style={{ background: s.color }} /> {s.label} <b>{h[s.id]}</b></span>)}
            </div>
          )}
        </div>
        <div className="dx-chart-x" aria-hidden="true">
          {days.map((d, i) => (
            <span key={i} style={{ left: `${(x(i) / W) * 100}%` }}>
              {i % labelEvery === 0 || i === days.length - 1 ? d.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

// `locked` is the label for a preview card ("Core · 30% open"), or falsy for the learner's own module.
// `shown` is the progress to display (real, or the demo sample); `highlight` marks where to continue.
const ModuleCard = ({ mod, progress, locked, highlight, shown }) => {
  const real = moduleProgress(mod, progress);
  const mp = shown || real;
  // Additional tests, counted once per kind across the subjects this plan includes
  const testCount = new Set(mod.subjects.flatMap((s) => subjectTests(mod, s).map((t) => t.kind))).size;
  const meta = (
    <div className="dx-mc-meta">
      <span>{mp.total} lectures</span>
      <span>{mod.practice.length} practice {mod.practice.length === 1 ? 'track' : 'tracks'}</span>
      {testCount > 0 && <span>{testCount} {testCount === 1 ? 'test' : 'tests'}</span>}
    </div>
  );

  if (locked) {
    return (
      <Link to={`/dashboard/m/${mod.id}`} className="dx-card dx-module-card dx-mc-row locked">
        <span className="dx-mc-icon"><ModuleIcon mod={mod} /></span>
        <div className="dx-mc-body">
          <h3>{mod.title}</h3>
          <p className="dx-muted dx-small">{mod.short}</p>
          {meta}
        </div>
        <span className="dx-badge dx-mc-side"><Lock size={12} /> {locked}</span>
      </Link>
    );
  }

  const nextLecture = allLectures(mod).find((l) => !progress.watched[l.id]);
  const state = mp.pct === 0 ? 'new' : mp.pct < 100 ? 'progress' : 'done';
  const cta = {
    new: { label: 'Start learning', to: nextLecture && `/dashboard/m/${mod.id}/watch/${nextLecture.id}` },
    progress: { label: 'Continue learning', to: nextLecture && `/dashboard/m/${mod.id}/watch/${nextLecture.id}` },
    done: { label: 'Review module', to: `/dashboard/m/${mod.id}` }
  }[state];

  // One horizontal card per module: icon · title & details · progress · CTA.
  // The title link covers the whole card; the CTA sits above it, so there are no nested links.
  return (
    <div className={`dx-card dx-module-card dx-mc-row ${highlight ? 'is-next' : ''} ${state === 'done' ? 'is-done' : ''}`}>
      <span className="dx-mc-icon"><ModuleIcon mod={mod} /></span>
      <div className="dx-mc-body">
        <div className="dx-mc-title">
          <h3><Link to={`/dashboard/m/${mod.id}`} className="dx-mc-link">{mod.title}</Link></h3>
          {highlight && <span className="dx-mc-flag">{state === 'new' ? 'Start here' : 'Continue here'}</span>}
          {state === 'done' && <span className="dx-mc-done"><CircleCheck size={13} /> Completed</span>}
        </div>
        <p className="dx-muted dx-small">{mod.short}</p>
        {meta}
      </div>
      <div className="dx-mc-prog">
        <div className="dx-progress" aria-label={`${mp.pct}% watched`}>
          <span style={{ width: `${mp.pct}%` }} />
        </div>
        <span className="dx-muted dx-small">{mp.done}/{mp.total} watched · {mp.pct}%</span>
      </div>
      <Link to={cta.to || `/dashboard/m/${mod.id}`} className={`dx-btn dx-btn-sm dx-mc-cta ${highlight ? 'dx-btn-primary' : 'dx-btn-ghost'}`}>
        {state === 'done' ? <RotateCcw size={14} /> : <CirclePlay size={14} />} {cta.label}
      </Link>
    </div>
  );
};

export default LearnerDashboardPage;
