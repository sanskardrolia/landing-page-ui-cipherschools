import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, CirclePlay, ClipboardCheck, Crown, House, Layers, LayoutDashboard,
  Lock, Menu, Mic, Moon, PanelLeft, Search, Sparkles, Sun, Terminal, X
} from 'lucide-react';
import { getEnrollment } from '../utils/enrollment';
import { useLearnerProgress } from '../utils/learnerProgress';
import {
  MODULES, PLAN_LABELS, TIER_LABELS, ULTRA_SECTIONS, allLectures, isExtendedPlan, moduleUnlocked
} from '../data/learnerModules';
import { MODULE_ICONS } from '../data/moduleIcons';
import ModuleView from './DashboardModuleView';
import DashboardPlayer from './DashboardPlayer';
import DashboardWorkspace from './DashboardWorkspace';
import DashboardUltra from './DashboardUltra';
import './LearnerDashboardPage.css';

/* ══════════════════════════════════════════════════════════════
   Learner dashboard (dark, immersive). Only renders for a paid
   (demo) enrollment; otherwise redirects to /premium.
   Routes:  /dashboard            → overview
            /dashboard/m/:moduleId → module (Watch / Practice / Test / Mock)
   ══════════════════════════════════════════════════════════════ */

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return ['Good morning', 'Fresh start. Pick up one lecture and build momentum.'];
  if (h < 17) return ['Good afternoon', 'The day gets heavy around now. Good to see you still going.'];
  return ['Good evening', 'A focused hour now beats a scattered weekend.'];
};

const THEME_KEY = 'cs_dash_theme';
const readTheme = () => {
  try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
};

const ULTRA_ICONS = { sparkles: Sparkles, clipboard: ClipboardCheck, mic: Mic };

const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);

const LearnerDashboardPage = () => {
  const [enrollment] = useState(getEnrollment);
  const { progress, toggle, set } = useLearnerProgress();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(readTheme);
  const location = useLocation();

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
  const ctx = { enrollment, planId, extended: isExtendedPlan(planId), progress, toggle, set };

  return (
    <div className={`dx ${collapsed || onPlayer ? 'dx-collapsed' : ''} ${theme === 'light' ? 'dx-light' : ''}`}>
      <Sidebar ctx={ctx} onCollapse={() => setCollapsed((v) => !v)} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {mobileOpen && <div className="dx-scrim" onClick={() => setMobileOpen(false)} />}

      <div className="dx-main">
        <TopBar ctx={ctx} onMenu={() => setMobileOpen(true)} theme={theme} onToggleTheme={toggleTheme} />
        <main className="dx-page">
          <Routes>
            <Route path="/dashboard" element={<Overview ctx={ctx} />} />
            <Route path="/dashboard/m/:moduleId" element={<ModuleRoute ctx={ctx} />} />
            <Route path="/dashboard/m/:moduleId/watch/:lectureId" element={<PlayerRoute ctx={ctx} />} />
            <Route path="/dashboard/m/:moduleId/practice/:itemId" element={<WorkspaceRoute ctx={ctx} />} />
            <Route path="/dashboard/ultra/:sectionId" element={<DashboardUltra ctx={ctx} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Keyed by module id so per-module state (selected subject, open units) starts fresh
const ModuleRoute = ({ ctx }) => {
  const { moduleId } = useParams();
  return <ModuleView key={moduleId} ctx={ctx} />;
};

// Keyed by lecture so the "ended / up next" state resets for every video
const PlayerRoute = ({ ctx }) => {
  const { lectureId } = useParams();
  return <DashboardPlayer key={lectureId} ctx={ctx} />;
};

// Keyed by item so code, console and submissions load fresh for each problem
const WorkspaceRoute = ({ ctx }) => {
  const { itemId } = useParams();
  return <DashboardWorkspace key={itemId} ctx={ctx} />;
};

/* ─────────────────────────── Sidebar ─────────────────────────── */

const moduleProgress = (mod, progress) => {
  const lectures = allLectures(mod);
  const done = lectures.filter((l) => progress.watched[l.id]).length;
  return { done, total: lectures.length, pct: pct(done, lectures.length) };
};

const Sidebar = ({ ctx, onCollapse, mobileOpen, onClose }) => {
  const { planId, extended, progress } = ctx;
  const [open, setOpen] = useState({ core: true, plus: true, ultra: true });

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

      <nav className="dx-nav">
        <NavLink to="/dashboard" end className="dx-nav-item" onClick={onClose}>
          <LayoutDashboard size={18} />
          <span className="dx-label">Dashboard</span>
        </NavLink>

        {['core', 'plus'].map((tier) => {
          const mods = MODULES.filter((m) => m.tier === tier);
          return (
            <div key={tier} className="dx-nav-group">
              <button
                type="button"
                className="dx-group-head"
                onClick={() => setOpen((o) => ({ ...o, [tier]: !o[tier] }))}
                aria-expanded={open[tier]}
              >
                <span className="dx-label">{TIER_LABELS[tier]}</span>
                {tier === 'plus' && extended && <span className="dx-ext-tag dx-label">Extended</span>}
                <ChevronDown size={14} className={`dx-chev dx-label ${open[tier] ? 'up' : ''}`} />
              </button>
              {open[tier] && mods.map((m) => {
                const Icon = MODULE_ICONS[m.icon] || Layers;
                const unlocked = moduleUnlocked(m, planId);
                const mp = moduleProgress(m, progress);
                return (
                  <NavLink key={m.id} to={`/dashboard/m/${m.id}`} className={`dx-nav-item ${unlocked ? '' : 'locked'}`} title={m.title} onClick={onClose}>
                    <Icon size={18} />
                    <span className="dx-label dx-nav-text">{m.title}</span>
                    {unlocked
                      ? (mp.pct > 0 && <span className="dx-label dx-nav-pct">{mp.pct}%</span>)
                      : <Lock size={13} className="dx-label dx-nav-lock" />}
                  </NavLink>
                );
              })}
            </div>
          );
        })}

        {/* Ultra: extras on top of Plus — locked unless the learner is on Ultra */}
        <div className="dx-nav-group">
          <button
            type="button"
            className="dx-group-head"
            onClick={() => setOpen((o) => ({ ...o, ultra: !o.ultra }))}
            aria-expanded={open.ultra}
          >
            <span className="dx-label">{TIER_LABELS.ultra}</span>
            {!extended && <Lock size={12} className="dx-label dx-nav-lock" />}
            <ChevronDown size={14} className={`dx-chev dx-label ${open.ultra ? 'up' : ''}`} />
          </button>
          {open.ultra && ULTRA_SECTIONS.map((sec) => {
            const Icon = ULTRA_ICONS[sec.icon] || Crown;
            return (
              <NavLink key={sec.id} to={`/dashboard/ultra/${sec.id}`} className={`dx-nav-item ${extended ? '' : 'locked'}`} title={sec.title} onClick={onClose}>
                <Icon size={18} />
                <span className="dx-label dx-nav-text">{sec.title}</span>
                {!extended && <Lock size={13} className="dx-label dx-nav-lock" />}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="dx-side-foot">
        <Link to="/online-compiler" className="dx-nav-item"><Terminal size={18} /><span className="dx-label">Compiler</span></Link>
        <Link to="/courses" className="dx-nav-item"><House size={18} /><span className="dx-label">Back to site</span></Link>
      </div>
    </aside>
  );
};

/* ─────────────────────────── Top bar ─────────────────────────── */

const TopBar = ({ ctx, onMenu, theme, onToggleTheme }) => {
  const { enrollment, planId, progress } = ctx;
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return MODULES.filter((m) => `${m.title} ${m.short}`.toLowerCase().includes(s)).slice(0, 6);
  }, [q]);

  const go = (m) => { setQ(''); setFocus(false); navigate(`/dashboard/m/${m.id}`); };

  const watchedTotal = Object.keys(progress.watched).length;
  const initials = (enrollment.learner?.name || 'L').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="dx-top">
      <button type="button" className="dx-icon-btn dx-menu" onClick={onMenu} aria-label="Open menu"><Menu size={18} /></button>

      <div className="dx-search">
        <Search size={16} />
        <input
          type="search"
          placeholder="Search modules…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 120)}
          onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(results[0]); }}
        />
        {focus && results.length > 0 && (
          <ul className="dx-search-results">
            {results.map((m) => (
              <li key={m.id}>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => go(m)}>
                  <span>{m.title}</span>
                  {!moduleUnlocked(m, planId) && <Lock size={13} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
        <span className="dx-stat-pill" title="Lectures watched"><CirclePlay size={15} /> {watchedTotal}</span>
        {planId !== 'compete' ? (
          <Link to="/premium" className="dx-upgrade"><Sparkles size={15} /> Upgrade</Link>
        ) : (
          <span className="dx-plan-pill"><Crown size={15} /> Ultra</span>
        )}
        <span className="dx-avatar" title={enrollment.learner?.name}>{initials}</span>
      </div>
    </header>
  );
};

/* ─────────────────────────── Overview ─────────────────────────── */

const Overview = ({ ctx }) => {
  const { enrollment, planId, extended, progress } = ctx;
  const [hello, sub] = greeting();
  const name = enrollment.learner?.name?.trim() || 'Learner';

  const unlocked = MODULES.filter((m) => moduleUnlocked(m, planId));
  const locked = MODULES.filter((m) => !moduleUnlocked(m, planId));

  // next unwatched lecture across unlocked modules, in sidebar order
  let next = null;
  for (const m of unlocked) {
    const l = allLectures(m).find((x) => !progress.watched[x.id]);
    if (l) { next = { mod: m, lecture: l }; break; }
  }

  const tierStats = ['core', 'plus']
    .filter((t) => unlocked.some((m) => m.tier === t))
    .map((t) => {
      const mods = unlocked.filter((m) => m.tier === t);
      const total = mods.reduce((a, m) => a + allLectures(m).length, 0);
      const done = mods.reduce((a, m) => a + allLectures(m).filter((l) => progress.watched[l.id]).length, 0);
      return { tier: t, label: t === 'core' ? 'Core' : 'Plus', done, total };
    });
  const totalAll = tierStats.reduce((a, s) => a + s.total, 0);
  const doneAll = tierStats.reduce((a, s) => a + s.done, 0);

  const validTill = new Date(enrollment.paidAt);
  validTill.setFullYear(validTill.getFullYear() + 1);

  return (
    <div className="dx-overview">
      <div className="dx-ov-main">
        <section className="dx-hello">
          <h1>{hello}, {name} <span aria-hidden="true">👋</span></h1>
          <p>{sub}</p>
        </section>

        {next && (
          <section className="dx-card dx-continue">
            <div>
              <span className="dx-kicker">Continue learning</span>
              <h2>{next.lecture.title}</h2>
              <p>{next.mod.title} · {next.lecture.mins} min</p>
            </div>
            <Link to={`/dashboard/m/${next.mod.id}/watch/${next.lecture.id}`} className="dx-btn dx-btn-primary">
              <CirclePlay size={16} /> Resume
            </Link>
          </section>
        )}

        <div className="dx-section-head">
          <h2>Your modules</h2>
          <span className="dx-rule" />
        </div>
        <div className="dx-module-grid">
          {unlocked.map((m) => <ModuleCard key={m.id} mod={m} progress={progress} extended={extended && m.tier === 'plus'} />)}
        </div>

        {locked.length > 0 && (
          <>
            <div className="dx-section-head">
              <h2>Unlock with Plus</h2>
              <span className="dx-rule" />
            </div>
            <div className="dx-module-grid">
              {locked.map((m) => <ModuleCard key={m.id} mod={m} progress={progress} locked />)}
            </div>
          </>
        )}
      </div>

      <aside className="dx-ov-rail">
        <section className="dx-card dx-ring-card">
          <h3>Learning Progress</h3>
          <div className="dx-ring-wrap">
            <ProgressRing value={doneAll} total={totalAll} />
            <ul className="dx-ring-legend">
              {tierStats.map((s) => (
                <li key={s.tier}>
                  <span className={`dx-dot dx-dot-${s.tier}`} />
                  <span className="dx-legend-label">{s.label}</span>
                  <span className="dx-legend-val"><strong>{s.done}</strong><span className="dx-muted"> / {s.total}</span></span>
                </li>
              ))}
            </ul>
          </div>
          <p className="dx-muted dx-small">Lectures watched across your unlocked modules.</p>
        </section>

        <section className="dx-card dx-plan-card">
          <span className="dx-kicker">Your plan</span>
          <h3>{PLAN_LABELS[planId]} {extended && <span className="dx-ext-tag">Extended limits</span>}</h3>
          <p className="dx-muted dx-small">Active till {validTill.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          {planId !== 'compete' && (
            <Link to="/premium" className="dx-btn dx-btn-ghost">
              {planId === 'starter' ? 'Upgrade to Plus' : 'Go Ultra for higher limits'} <ArrowRight size={15} />
            </Link>
          )}
        </section>
      </aside>
    </div>
  );
};

const ModuleCard = ({ mod, progress, locked, extended }) => {
  const Icon = MODULE_ICONS[mod.icon] || Layers;
  const mp = moduleProgress(mod, progress);
  return (
    <Link to={`/dashboard/m/${mod.id}`} className={`dx-card dx-module-card ${locked ? 'locked' : ''}`}>
      <div className="dx-mc-top">
        <span className="dx-mc-icon"><Icon size={18} /></span>
        {locked ? <span className="dx-badge"><Lock size={12} /> Plus</span> : extended && <span className="dx-ext-tag">Extended</span>}
      </div>
      <h3>{mod.title}</h3>
      <p className="dx-muted dx-small">{mod.short}</p>
      <div className="dx-mc-meta">
        <span>{mp.total} lectures</span>
        <span>{mod.practice.length} practice {mod.practice.length === 1 ? 'track' : 'tracks'}</span>
        {mod.tests.length > 0 && <span>{mod.tests.length} {mod.tests.length === 1 ? 'test' : 'tests'}</span>}
      </div>
      {!locked && (
        <div className="dx-progress" aria-label={`${mp.pct}% watched`}>
          <span style={{ width: `${mp.pct}%` }} />
        </div>
      )}
    </Link>
  );
};

const ProgressRing = ({ value, total, size = 150 }) => {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const p = total ? value / total : 0;
  return (
    <div className="dx-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} className="dx-ring-track" />
        <circle
          cx={size / 2} cy={size / 2} r={r} className="dx-ring-fill"
          strokeDasharray={c} strokeDashoffset={c * (1 - p)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="dx-ring-center">
        <strong>{value}</strong>
        <span>/ {total}</span>
      </div>
    </div>
  );
};

export default LearnerDashboardPage;
