import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Activity, ArrowRight, ChevronDown, CircleCheck, CirclePlay, Eye, Crown, Flame, House, Layers, LayoutDashboard,
  Lock, Menu, Moon, PanelLeft, RotateCcw, Search, Sparkles, Sun, Terminal, Users, X, Zap
} from 'lucide-react';
import { getEnrollment } from '../utils/enrollment';
import { useLearnerProgress } from '../utils/learnerProgress';
import {
  MODULES, PLAN_LABELS, TIER_LABELS, allLectures, isExtendedPlan, moduleUnlocked, requiredPlanFor, subjectLectures
} from '../data/learnerModules';
import { MODULE_ICONS } from '../data/moduleIcons';
import ModuleView from './DashboardModuleView';
import DashboardPlayer from './DashboardPlayer';
import DashboardWorkspace from './DashboardWorkspace';
import DashboardMentorship from './DashboardMentorship';
import { mentorCreditsLeft } from '../utils/mentorship';
import { learningStats } from '../utils/learningStats';
import { PREVIEW_ENROLLMENT, PREVIEW_PROGRESS, endPreview, isPreviewOn } from '../utils/preview';
import DashboardPreviewPlans from './DashboardPreviewPlans';

const noop = () => {};
import DashboardActivity from './DashboardActivity';
import DashboardUpgrade from './DashboardUpgrade';
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

/* Same plan icons as the pricing cards: Core ⚡ · Plus 🔥 · Ultra 👑 */
const TIER_ICONS = { core: Zap, plus: Flame, ultra: Crown };

const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);

const LearnerDashboardPage = () => {
  const [realEnrollment] = useState(getEnrollment);
  // Guests who chose "Experience before you pay" get the full dashboard with everything locked
  const [preview] = useState(() => !realEnrollment && isPreviewOn());
  const enrollment = realEnrollment || (preview ? PREVIEW_ENROLLMENT : null);
  const learner = useLearnerProgress();
  const { progress, toggle, set } = preview ? { progress: PREVIEW_PROGRESS, toggle: noop, set: noop } : learner;
  const [purchase, setPurchase] = useState(null); // preview only: { mod?, target? } while the plan pop-up is open
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [upgrade, setUpgrade] = useState(null); // { target } while the upgrade pop-up is open
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
  // openUpgrade(target?) opens the upgrade pop-up, optionally pre-selecting a plan id.
  // In preview, it and lockedTap(mod) open the plan pop-up instead.
  const ctx = {
    enrollment, planId, extended: isExtendedPlan(planId), devTrack: enrollment.devTrack, progress, toggle, set,
    preview,
    openUpgrade: preview ? (target) => setPurchase({ target }) : (target) => setUpgrade({ target }),
    lockedTap: (mod) => setPurchase({ mod })
  };
  const exitPreview = () => { endPreview(); navigate('/premium'); };

  return (
    <div className={`dx ${collapsed || onPlayer ? 'dx-collapsed' : ''} ${theme === 'light' ? 'dx-light' : ''} ${preview ? 'dx-preview' : ''}`}>
      <Sidebar ctx={ctx} onCollapse={() => setCollapsed((v) => !v)} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {mobileOpen && <div className="dx-scrim" onClick={() => setMobileOpen(false)} />}

      <div className="dx-main">
        <TopBar ctx={ctx} onMenu={() => setMobileOpen(true)} theme={theme} onToggleTheme={toggleTheme} />
        {preview && (
          <div className="dx-pv-bar" role="status">
            <Eye size={16} />
            <span><strong>Preview mode.</strong> Explore everything in Core, Plus and Ultra. Tap anything to see how to unlock it.</span>
            <button type="button" className="dx-btn dx-btn-primary dx-btn-sm" onClick={() => setPurchase({})}>See plans</button>
            <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={exitPreview}>Exit preview</button>
          </div>
        )}
        <main className="dx-page">
          <Routes>
            <Route path="/dashboard" element={<Overview ctx={ctx} />} />
            <Route path="/dashboard/m/:moduleId" element={<ModuleRoute ctx={ctx} />} />
            <Route path="/dashboard/m/:moduleId/watch/:lectureId" element={<PlayerRoute ctx={ctx} />} />
            <Route path="/dashboard/m/:moduleId/practice/:itemId" element={<WorkspaceRoute ctx={ctx} />} />
            <Route path="/dashboard/mentorship" element={<DashboardMentorship ctx={ctx} />} />
            <Route path="/dashboard/activity" element={<DashboardActivity ctx={ctx} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {upgrade && <DashboardUpgrade ctx={ctx} initialTarget={upgrade.target} onClose={() => setUpgrade(null)} />}
      {purchase && <DashboardPreviewPlans mod={purchase.mod} target={purchase.target} onClose={() => setPurchase(null)} />}
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
  const { moduleId, lectureId } = useParams();
  if (ctx.preview) return <Navigate to={`/dashboard/m/${moduleId}`} replace />;
  return <DashboardPlayer key={lectureId} ctx={ctx} />;
};

// Keyed by item so code, console and submissions load fresh for each problem
const WorkspaceRoute = ({ ctx }) => {
  const { moduleId, itemId } = useParams();
  if (ctx.preview) return <Navigate to={`/dashboard/m/${moduleId}?tab=practice`} replace />;
  return <DashboardWorkspace key={itemId} ctx={ctx} />;
};

/* ─────────────────────────── Sidebar ─────────────────────────── */

const moduleProgress = (mod, progress) => {
  const lectures = allLectures(mod);
  const done = lectures.filter((l) => progress.watched[l.id]).length;
  return { done, total: lectures.length, pct: pct(done, lectures.length) };
};

const initialsOf = (name) => name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const Sidebar = ({ ctx, onCollapse, mobileOpen, onClose }) => {
  const { planId, extended, progress, enrollment } = ctx;
  const learnerName = enrollment.learner?.name?.trim() || 'Learner';
  const [open, setOpen] = useState({ core: true, plus: true, ultra: true });
  const location = useLocation();
  const query = new URLSearchParams(location.search);

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

        {['core', 'plus', 'ultra'].map((tier) => {
          const mods = MODULES.filter((m) => m.tier === tier);
          return (
            <div key={tier} className="dx-nav-group">
              <button
                type="button"
                className="dx-group-head"
                onClick={() => setOpen((o) => ({ ...o, [tier]: !o[tier] }))}
                aria-expanded={open[tier]}
              >
                <TierIcon tier={tier} />
                <span className="dx-label">{TIER_LABELS[tier]}</span>
                {tier === 'ultra' && !extended && <Lock size={12} className="dx-label dx-nav-lock" />}
                <ChevronDown size={14} className={`dx-chev dx-label ${open[tier] ? 'up' : ''}`} />
              </button>
              {open[tier] && mods.map((m) => {
                const Icon = MODULE_ICONS[m.icon] || Layers;
                const unlocked = !ctx.preview && moduleUnlocked(m, planId, ctx.devTrack);
                const showSubjects = unlocked || ctx.preview; // preview: show everything, locked
                const mp = moduleProgress(m, progress);
                const modPath = `/dashboard/m/${m.id}`;
                const inModule = location.pathname === modPath;
                const activeSubject = query.get('subject') || m.subjects[0].id;
                return (
                  <div key={m.id} className="dx-nav-module">
                    <NavLink to={modPath} className={`dx-nav-item ${unlocked ? '' : 'locked'}`} title={m.title} onClick={onClose}>
                      <Icon size={18} />
                      <span className="dx-label dx-nav-text">{m.title}</span>
                      {unlocked
                        ? (mp.pct > 0 && <span className="dx-label dx-nav-pct">{mp.pct}%</span>)
                        : <Lock size={13} className="dx-label dx-nav-lock" />}
                    </NavLink>

                    {/* Subjects (e.g. OS / CN / OOPs) as sub-items of a multi-subject module */}
                    {showSubjects && m.subjects.length > 1 && (
                      <ul className="dx-nav-sub">
                        {m.subjects.map((sub) => {
                          const sl = subjectLectures(sub);
                          const sp = sl.length ? Math.round((sl.filter((l) => progress.watched[l.id]).length / sl.length) * 100) : 0;
                          const isActive = inModule && activeSubject === sub.id;
                          const tab = inModule ? query.get('tab') || 'watch' : 'watch';
                          return (
                            <li key={sub.id}>
                              <Link
                                to={`${modPath}?tab=${tab}&subject=${sub.id}`}
                                className={`dx-nav-subitem ${isActive ? 'active' : ''}`}
                                aria-current={isActive ? 'page' : undefined}
                                onClick={onClose}
                              >
                                <span className="dx-nav-text">{sub.title}</span>
                                {sp > 0 && <span className="dx-nav-pct">{sp}%</span>}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}

              {/* 1:1 Mentorship lives with the Ultra modules */}
              {tier === 'ultra' && open.ultra && (
                <NavLink to="/dashboard/mentorship" className={`dx-nav-item ${extended && !ctx.preview ? '' : 'locked'}`} title="1:1 Mentorship" onClick={onClose}>
                  <Users size={18} />
                  <span className="dx-label dx-nav-text">1:1 Mentorship</span>
                  {extended && !ctx.preview
                    ? <span className="dx-label dx-nav-pct">{mentorCreditsLeft(progress)} cr</span>
                    : <Lock size={13} className="dx-label dx-nav-lock" />}
                </NavLink>
              )}
            </div>
          );
        })}

      </nav>

      <div className="dx-side-foot">
        <Link to="/online-compiler" className="dx-nav-item"><Terminal size={18} /><span className="dx-label">Compiler</span></Link>
        <Link to="/courses" className="dx-nav-item"><House size={18} /><span className="dx-label">Back to site</span></Link>

        {/* Profile row: initials · name · plan · upgrade */}
        <div className="dx-profile">
          <span className="dx-profile-avatar" title={learnerName}>{initialsOf(learnerName)}</span>
          <span className="dx-profile-text">
            <strong>{learnerName}</strong>
            <span>{ctx.preview ? 'Preview' : `${PLAN_LABELS[planId]} plan`}</span>
          </span>
          {(planId !== 'compete' || ctx.preview) && (
            <button type="button" className="dx-upgrade" onClick={() => { onClose(); ctx.openUpgrade(); }}><Sparkles size={14} /> {ctx.preview ? 'Get plan' : 'Upgrade'}</button>
          )}
        </div>
      </div>
    </aside>
  );
};

const TierIcon = ({ tier }) => {
  const Icon = TIER_ICONS[tier];
  return Icon ? <Icon size={13} className={`dx-tier-icon dx-tier-${tier}`} aria-hidden="true" /> : null;
};

/* ─────────────────────────── Top bar ─────────────────────────── */

const TopBar = ({ ctx, onMenu, theme, onToggleTheme }) => {
  const { planId, progress } = ctx;
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
                  {(ctx.preview || !moduleUnlocked(m, planId, ctx.devTrack)) && <Lock size={13} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dx-top-right">
        <NavLink to="/dashboard/activity" className="dx-activity-btn" title="Activity heatmap">
          <Activity size={16} /> <span className="dx-activity-label">Activity</span>
        </NavLink>
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
        <span className="dx-stat-pill" title="Lectures watched"><CirclePlay size={15} /> {watchedTotal}</span>
        <span className="dx-top-divider" aria-hidden="true" />
        {planId !== 'compete' || ctx.preview ? (
          <button type="button" className="dx-upgrade" onClick={() => ctx.openUpgrade()}><Sparkles size={15} /> {ctx.preview ? 'Get a plan' : 'Upgrade'}</button>
        ) : (
          <span className="dx-plan-pill"><Crown size={15} /> Ultra</span>
        )}
      </div>
    </header>
  );
};

/* ─────────────────────────── Overview ─────────────────────────── */

const Overview = ({ ctx }) => {
  const { enrollment, planId, progress } = ctx;
  const [hello, sub] = greeting();
  const name = enrollment.learner?.name?.trim() || 'Learner';

  const unlocked = MODULES.filter((m) => moduleUnlocked(m, planId, ctx.devTrack));
  const locked = MODULES.filter((m) => !moduleUnlocked(m, planId, ctx.devTrack));

  // next unwatched lecture across unlocked modules, in sidebar order
  let next = null;
  for (const m of unlocked) {
    const l = allLectures(m).find((x) => !progress.watched[x.id]);
    if (l) { next = { mod: m, lecture: l }; break; }
  }

  const stats = learningStats(MODULES, ctx);
  // Where to start: the first unlocked module (sidebar order) that isn't fully watched yet.
  // It moves on by itself as soon as that module's last lecture is watched.
  const startHere = unlocked.find((m) => moduleProgress(m, progress).pct < 100)?.id;

  const validTill = new Date(enrollment.paidAt);
  validTill.setFullYear(validTill.getFullYear() + 1);

  return (
    <div className="dx-overview">
      <div className="dx-ov-main">
        <section className="dx-hello">
          {ctx.preview ? (
            <>
              <h1>Welcome, explorer <span aria-hidden="true">👋</span></h1>
              <p>This is the full CipherSchools Premium dashboard: every module, lecture, practice set, test and mock interview. Look around, then pick a plan to unlock it.</p>
            </>
          ) : (
            <>
              <h1>{hello}, {name} <span aria-hidden="true">👋</span></h1>
              <p>{sub}</p>
            </>
          )}
        </section>

        {ctx.preview && ['core', 'plus', 'ultra'].map((tier) => (
          <div key={tier}>
            <div className="dx-section-head">
              <h2><TierIcon tier={tier} /> {TIER_LABELS[tier]}</h2>
              <span className="dx-rule" />
              <span className="dx-muted dx-small">{tier === 'core' ? 'In every plan' : tier === 'plus' ? 'Plus & Ultra' : 'Ultra only'}</span>
            </div>
            <div className="dx-module-grid">
              {MODULES.filter((m) => m.tier === tier).map((m) => (
                <ModuleCard key={m.id} mod={m} progress={progress} locked={{ core: 'Core', plus: 'Plus', ultra: 'Ultra' }[tier]} />
              ))}
            </div>
          </div>
        ))}

        {!ctx.preview && next && (
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

        {!ctx.preview && (
          <>
            <div className="dx-section-head">
              <h2>Your modules</h2>
              <span className="dx-rule" />
            </div>
            <div className="dx-module-grid">
              {unlocked.map((m) => <ModuleCard key={m.id} mod={m} progress={progress} highlight={m.id === startHere} />)}
            </div>
          </>
        )}

        {!ctx.preview && locked.length > 0 && (
          <>
            <div className="dx-section-head">
              <h2>{planId === 'starter' ? 'Unlock with Plus & Ultra' : 'Unlock with Ultra'}</h2>
              <span className="dx-rule" />
            </div>
            <div className="dx-module-grid">
              {locked.map((m) => <ModuleCard key={m.id} mod={m} progress={progress} locked={PLAN_LABELS[requiredPlanFor(m, planId)]} />)}
            </div>
          </>
        )}
      </div>

      <aside className="dx-ov-rail">
        <section className="dx-card dx-ring-card">
          <h3>Learning Progress</h3>
          <div className="dx-stat-grid">
            <StatRing kind="lecture" label="Lectures watched" {...stats.lectures} />
            <StatRing
              kind="practice"
              label="Practice questions"
              {...stats.practice}
              sub={`Coding ${stats.practice.coding.done}/${stats.practice.coding.total} · MCQ ${stats.practice.mcq.done}/${stats.practice.mcq.total}`}
            />
            <StatRing kind="test" label="Tests taken" {...stats.tests} />
            <StatRing kind="interview" label="Mock interviews" {...stats.interviews} />
          </div>
          <p className="dx-muted dx-small">Across your unlocked modules.</p>
        </section>

        {ctx.preview ? (
          <section className="dx-card dx-plan-card">
            <span className="dx-kicker">Preview</span>
            <h3>Everything is locked</h3>
            <p className="dx-muted dx-small">Plans start at ₹174/month, billed yearly, with a 7-day money-back guarantee.</p>
            <button type="button" className="dx-btn dx-btn-primary" onClick={() => ctx.openUpgrade()}>
              See plans <ArrowRight size={15} />
            </button>
          </section>
        ) : (
        <section className="dx-card dx-plan-card">
          <span className="dx-kicker">Your plan</span>
          <h3>{PLAN_LABELS[planId]}</h3>
          {planId === 'plus' && <p className="dx-muted dx-small">Full Stack track: <strong>{(ctx.devTrack || 'mern').toUpperCase()}</strong></p>}
          <p className="dx-muted dx-small">Active till {validTill.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          {planId !== 'compete' && (
            <button type="button" className="dx-btn dx-btn-ghost" onClick={() => ctx.openUpgrade(planId === 'starter' ? 'plus' : 'compete')}>
              {planId === 'starter' ? 'Upgrade to Plus' : 'Go Ultra for higher limits'} <ArrowRight size={15} />
            </button>
          )}
        </section>
        )}
      </aside>
    </div>
  );
};

// `locked` is the plan name that unlocks this module ("Plus" / "Ultra"), or falsy when unlocked.
// `highlight` marks the module the learner should start (or continue) with.
const ModuleCard = ({ mod, progress, locked, highlight }) => {
  const Icon = MODULE_ICONS[mod.icon] || Layers;
  const mp = moduleProgress(mod, progress);
  const meta = (
    <div className="dx-mc-meta">
      <span>{mp.total} lectures</span>
      <span>{mod.practice.length} practice {mod.practice.length === 1 ? 'track' : 'tracks'}</span>
      {mod.tests.length > 0 && <span>{mod.tests.length} {mod.tests.length === 1 ? 'test' : 'tests'}</span>}
    </div>
  );

  if (locked) {
    return (
      <Link to={`/dashboard/m/${mod.id}`} className="dx-card dx-module-card locked">
        <div className="dx-mc-top">
          <span className="dx-mc-icon"><Icon size={18} /></span>
          <span className="dx-badge"><Lock size={12} /> {locked}</span>
        </div>
        <h3>{mod.title}</h3>
        <p className="dx-muted dx-small">{mod.short}</p>
        {meta}
        <span className="dx-mc-explore">Explore module <ArrowRight size={14} /></span>
      </Link>
    );
  }

  const nextLecture = allLectures(mod).find((l) => !progress.watched[l.id]);
  const state = mp.done === 0 ? 'new' : nextLecture ? 'progress' : 'done';
  const cta = {
    new: { label: 'Start learning', to: nextLecture && `/dashboard/m/${mod.id}/watch/${nextLecture.id}` },
    progress: { label: 'Continue learning', to: nextLecture && `/dashboard/m/${mod.id}/watch/${nextLecture.id}` },
    done: { label: 'Review module', to: `/dashboard/m/${mod.id}` }
  }[state];

  // The title link covers the whole card; the CTA sits above it, so there are no nested links
  return (
    <div className={`dx-card dx-module-card ${highlight ? 'is-next' : ''} ${state === 'done' ? 'is-done' : ''}`}>
      <div className="dx-mc-top">
        <span className="dx-mc-icon"><Icon size={18} /></span>
        {highlight && <span className="dx-mc-flag">{state === 'new' ? 'Start here' : 'Continue here'}</span>}
        {state === 'done' && <span className="dx-mc-done"><CircleCheck size={13} /> Completed</span>}
      </div>
      <h3><Link to={`/dashboard/m/${mod.id}`} className="dx-mc-link">{mod.title}</Link></h3>
      <p className="dx-muted dx-small">{mod.short}</p>
      {meta}
      <div className="dx-progress" aria-label={`${mp.pct}% watched`}>
        <span style={{ width: `${mp.pct}%` }} />
      </div>
      <div className="dx-mc-foot">
        <span className="dx-muted dx-small">{mp.done}/{mp.total} watched</span>
        <Link to={cta.to || `/dashboard/m/${mod.id}`} className={`dx-btn dx-btn-sm dx-mc-cta ${highlight ? 'dx-btn-primary' : 'dx-btn-ghost'}`}>
          {state === 'done' ? <RotateCcw size={14} /> : <CirclePlay size={14} />} {cta.label}
        </Link>
      </div>
    </div>
  );
};

// One of the four Learning Progress charts: a ring with done / total and a label
const StatRing = ({ kind, label, done, total, sub, size = 76 }) => {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const p = total ? done / total : 0;
  return (
    <div className={`dx-stat dx-stat-${kind}`} aria-label={`${label}: ${done} of ${total}`}>
      <div className="dx-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} className="dx-ring-track" />
          <circle
            cx={size / 2} cy={size / 2} r={r} className="dx-ring-fill"
            strokeDasharray={c} strokeDashoffset={c * (1 - p)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="dx-ring-center"><strong>{Math.round(p * 100)}%</strong></div>
      </div>
      <span className="dx-stat-label">{label}</span>
      <span className="dx-stat-val"><strong>{done}</strong> / {total}</span>
      {sub && <span className="dx-stat-sub">{sub}</span>}
    </div>
  );
};

export default LearnerDashboardPage;
