import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUp, Check, Clock, Compass, Download, Loader2, Search, Sparkles, X } from 'lucide-react';
import { CATALOG, GOAL_SUGGESTIONS } from '../data/goalTracks';
import { matchGoal, timeframeWeeks, trackById } from '../utils/goalMatch';
import { downloadRoadmap } from '../utils/roadmapImage';
import { startPreview } from '../utils/preview';
import { PLANS_12M_DATA } from '../pages/PremiumPage';
import {
  logGoalSearch, trackHomeGoalAdvisorClosed, trackHomeGoalAdvisorOpened, trackHomeGoalCtaClicked, trackHomeGoalPillViewed,
  trackHomeGoalRoadmapDownloaded, trackHomeGoalSearchNoMatch, trackHomeGoalSearchSubmitted, trackHomeGoalSuggestionClicked,
  trackHomeGoalTrackSwitched
} from '../utils/goalAdvisorTracking';
import './GoalAdvisor.css';

/* ══════════════════════════════════════════════════════════════
   Home › goal advisor.
   1. A pill search bar floats at the bottom once the visitor scrolls
      past the hero ("Describe your goal…").
   2. Submitting opens a Notion-like sheet: the goal is matched to a
      roadmap built only from our catalog (roadmap.sh style), with the
      courses it uses and the plan that covers them.
   3. The roadmap downloads as a PNG with a QR code that reopens it here
      (/?goal=<id>#roadmap) to get started.
   No match never dead-ends: one-tap goals, the general placement path
   and Guide me. Every search is tracked (and logged on-device) so the
   team can see what learners ask for.
   ══════════════════════════════════════════════════════════════ */

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const BUILD_STEPS = ['Reading your goal', 'Matching it to our courses', 'Ordering the stages'];

const PLAN_BY_NAME = Object.fromEntries(PLANS_12M_DATA.map((p) => [p.name, p]));
const PLACEHOLDERS = ['crack campus placements in 6 months', 'become a full stack developer', 'get into Google or Amazon', 'build AI apps with LLMs'];

const GoalAdvisor = () => {
  const navigate = useNavigate();
  const [shown, setShown] = useState(false);       // pill visible (scrolled past the hero)
  const [open, setOpen] = useState(false);         // sheet open
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);      // { query, matches, active, weeksWanted } | null
  const [thinking, setThinking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [ph, setPh] = useState(0);
  const sheetInput = useRef(null);
  const viewedRef = useRef(false);

  // show the pill once the hero has scrolled away (i.e. from the second section on)
  useEffect(() => {
    const check = () => {
      const hero = document.getElementById('hero-impact-section');
      setShown(hero ? hero.getBoundingClientRect().bottom < 80 : window.scrollY > 600);
    };
    const t = setTimeout(check, 0);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => { clearTimeout(t); window.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);
  useEffect(() => {
    if (shown && !viewedRef.current) { viewedRef.current = true; trackHomeGoalPillViewed(); }
  }, [shown]);

  // rotate the placeholder idea
  useEffect(() => {
    const t = setInterval(() => setPh((i) => (i + 1) % PLACEHOLDERS.length), 3200);
    return () => clearInterval(t);
  }, []);

  // QR / shared link: /?goal=<id>#roadmap opens that roadmap straight away
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('goal');
    const t = id && trackById(id);
    if (!t) return;
    const timer = setTimeout(() => {
      setResult({ query: t.title, matches: [{ track: t, score: 1 }], active: 0, weeksWanted: null, fromLink: true });
      setOpen(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    trackHomeGoalAdvisorClosed({ stage: result ? (result.matches.length ? 'roadmap' : 'no_match') : 'empty' });
    setOpen(false);
  };

  // lock page scroll + Esc to close while the sheet is open
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  });

  const run = (text, source) => {
    const q = text.trim();
    if (!q) { setOpen(true); trackHomeGoalAdvisorOpened({ source }); return; }
    setQuery(q);
    setOpen(true);
    setThinking(true);
    const matches = matchGoal(q);
    trackHomeGoalSearchSubmitted({ query: q, source, matchedTrack: matches[0]?.track.id, matchCount: matches.length });
    if (!matches.length) trackHomeGoalSearchNoMatch({ query: q });
    logGoalSearch({ query: q, source, matched: matches.map((m) => m.track.id) });
    // a short "building" beat so the roadmap feels assembled, not instant-random
    setResult(null);
    setTimeout(() => {
      setResult({ query: q, matches, active: 0, weeksWanted: timeframeWeeks(q) });
      setThinking(false);
    }, reducedMotion() ? 200 : 2200);
  };

  // tap the pill → a fresh, centred input
  const openPopup = () => {
    setResult(null);
    setThinking(false);
    setOpen(true);
    trackHomeGoalAdvisorOpened({ source: 'pill' });
  };

  const pickSuggestion = (s, context) => { trackHomeGoalSuggestionClicked({ suggestion: s, context }); setQuery(s); run(s, 'suggestion'); };

  const active = result?.matches[result.active]?.track || null;
  const plan = active ? PLAN_BY_NAME[active.plan] : null;
  const weeks = active ? active.stages.reduce((a, s) => a + s.weeks, 0) : 0;
  const hrs = result?.weeksWanted && weeks ? Math.min(40, Math.ceil((weeks * 9) / result.weeksWanted)) : null;
  const courses = active ? [...new Set(active.stages.map((s) => s.mod))].map((id) => ({ id, ...CATALOG[id] })) : [];

  const onDownload = async () => {
    if (!active) return;
    setDownloading(true);
    trackHomeGoalRoadmapDownloaded({ trackId: active.id });
    try { await downloadRoadmap(active); } finally { setDownloading(false); }
  };

  const goPlans = () => {
    trackHomeGoalCtaClicked({ cta: `get_${active.plan.toLowerCase()}`, trackId: active.id, destination: 'plans' });
    setOpen(false);
    setTimeout(() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' }), 60);
  };
  const goFree = () => {
    trackHomeGoalCtaClicked({ cta: 'start_free', trackId: active?.id || 'none', destination: 'dashboard_preview' });
    startPreview();
    navigate('/dashboard');
  };

  return createPortal(
    <>
      {/* ── 1. the pill ── */}
      <button
        type="button"
        className={`ga-pill ${shown && !open ? 'is-shown' : ''}`}
        onClick={openPopup}
        aria-hidden={!shown || open}
        tabIndex={shown && !open ? 0 : -1}
        aria-label="Describe your learning goal"
      >
        <Sparkles size={16} className="ga-pill-ico" />
        <span className="ga-pill-text" key={ph}>Describe your goal, e.g. {PLACEHOLDERS[ph]}</span>
        <span className="ga-pill-go"><ArrowUp size={16} /></span>
      </button>

      {/* ── 2. the advisor sheet ── */}
      {open && (
        <div className={`ga-scrim ${!result && !thinking ? 'is-compact' : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className={`ga-sheet ${thinking ? 'is-building' : ''} ${!result && !thinking ? 'is-compact' : ''}`} role="dialog" aria-modal="true" aria-label="Find your roadmap">
            <div className="ga-top">
              <form className="ga-search" onSubmit={(e) => { e.preventDefault(); run(query, 'sheet'); }}>
                <Search size={18} />
                <input
                  ref={sheetInput}
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to achieve? e.g. become a backend developer in 6 months"
                  aria-label="Describe your learning goal"
                />
                <button type="submit" className="ga-go" disabled={!query.trim()}>Find roadmap <ArrowRight size={14} /></button>
              </form>
              <button type="button" className="ga-x" onClick={close} aria-label="Close"><X size={18} /></button>
            </div>

            <div className="ga-body">
              {thinking && (
                <div className="ga-build" aria-live="polite">
                  <p className="ga-build-h"><Sparkles size={16} /> Building your roadmap</p>
                  <div className="ga-build-status">
                    {BUILD_STEPS.map((t, i) => <span key={t} style={{ '--i': i }}>{t}…</span>)}
                  </div>
                  <ol className="ga-build-map">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <li key={i} style={{ '--i': i }}>
                        <span className="ga-build-node" />
                        <span className="ga-build-card"><i style={{ width: `${58 - i * 4}%` }} /><i style={{ width: '34%' }} /><i style={{ width: `${72 - i * 6}%` }} /></span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {!thinking && !result && (
                <div className="ga-empty is-compact">
                  <p>Describe your goal in your own words. We&apos;ll build a roadmap from our courses, step by step.</p>
                  <p className="ga-try">Try</p>
                  <div className="ga-chips">{GOAL_SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => pickSuggestion(s, 'empty')}><Sparkles size={12} /> {s}</button>)}</div>
                </div>
              )}

              {!thinking && result && !active && (
                <div className="ga-empty ga-nomatch">
                  <h2>We couldn&apos;t map that to a roadmap yet.</h2>
                  <p>We&apos;ve noted <b>&ldquo;{result.query}&rdquo;</b> to help us plan new courses. Meanwhile, one of these may be close:</p>
                  <div className="ga-chips">{GOAL_SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => pickSuggestion(s, 'no_match')}>{s}</button>)}</div>
                </div>
              )}

              {!thinking && active && (
                <div className="ga-result">
                  {/* roadmap */}
                  <section className="ga-map" id="roadmap">
                    <p className="ga-kicker"><Compass size={14} /> {result.fromLink ? 'Your roadmap' : 'Roadmap for your goal'}</p>
                    <h2>{active.title}</h2>
                    <p className="ga-blurb">{active.blurb}</p>
                    <p className="ga-meta">
                      <span><Clock size={13} /> About {weeks} weeks at 8–10 hrs/week</span>
                      {hrs && <span className="is-hot">For your timeline: about {hrs} hrs/week</span>}
                    </p>

                    {result.matches.length > 1 && (
                      <div className="ga-alt">
                        <span>Also matches:</span>
                        {result.matches.slice(0, 4).map((m, i) => (
                          <button key={m.track.id} type="button" className={i === result.active ? 'is-on' : ''}
                            onClick={() => { trackHomeGoalTrackSwitched({ trackId: m.track.id }); setResult({ ...result, active: i }); }}>
                            {m.track.title}
                          </button>
                        ))}
                      </div>
                    )}

                    <ol className="ga-steps">
                      {active.stages.map((s, i) => (
                        <li key={s.title} style={{ '--i': i }}>
                          <span className="ga-node">{i + 1}</span>
                          <div className="ga-card">
                            <b>{s.title}</b>
                            <span className="ga-mod">{CATALOG[s.mod].title} · {s.weeks} wk</span>
                            <span className="ga-topics">{s.topics.map((t) => <i key={t}>{t}</i>)}</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>

                  {/* recommendations */}
                  <aside className="ga-side">
                    <button type="button" className="ga-dl" onClick={onDownload} disabled={downloading}>
                      {downloading ? <Loader2 size={15} className="ga-spin" /> : <Download size={15} />} Download roadmap
                    </button>
                    <p className="ga-dl-note">PNG with a QR code that brings you back here to start.</p>

                    <p className="ga-side-h">Courses in this roadmap</p>
                    <ul className="ga-courses">
                      {courses.map((c) => (
                        <li key={c.id}><Check size={14} /><span><b>{c.title}</b><small>{c.note}</small></span><em className={`is-${c.plan.toLowerCase()}`}>{c.plan}</em></li>
                      ))}
                    </ul>

                    {plan && (
                      <div className="ga-plan">
                        <p className="ga-side-h">Best plan for this</p>
                        <div className="ga-plan-row"><b>{plan.name}</b><span><strong>{plan.monthlyPriceFormatted}</strong>/mo</span></div>
                        <p className="ga-plan-note">{plan.priceFormatted} for 12 months · covers every course above</p>
                        <button type="button" className="ga-cta" onClick={goPlans}>Get {plan.name} <ArrowRight size={14} /></button>
                        <button type="button" className="ga-cta is-ghost" onClick={goFree}>Start free</button>
                      </div>
                    )}
                  </aside>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};

export default GoalAdvisor;
