import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, CalendarClock, CalendarDays, Camera, ChevronDown, ChevronRight, Circle, CircleCheck, CirclePlay,
  ClipboardCheck, ExternalLink, Layers, ListChecks, Lock, Mic, Monitor, Sparkles,
  Timer, X
} from 'lucide-react';
import {
  DEV_TRACKS, TEST_UNLOCK_AT, findModule, moduleUnlocked, requiredPlanFor, subjectLectures, allLectures
} from '../data/learnerModules';
import { MODULE_ICONS } from '../data/moduleIcons';
import { WORKSPACE_KINDS, practiceForUnit, problemOfTheDay } from '../data/practiceBank';
import { ADDITIONAL_META, stageTests } from '../data/testBank';

/* One module = four steps: Watch → Practice → Test → Mock Interview.
   Tests unlock at TEST_UNLOCK_AT of the subject watched; mock interviews at 100%. */

const TABS = [
  { id: 'watch', label: 'Content to Watch', short: 'Watch', Icon: CirclePlay },
  { id: 'practice', label: 'Practice', short: 'Practice', Icon: ListChecks },
  { id: 'test', label: 'Proctored Tests', short: 'Test', Icon: ClipboardCheck },
  { id: 'interview', label: 'Mock Interview', short: 'Interview', Icon: Mic }
];

const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);

const ModuleView = ({ ctx }) => {
  const { moduleId } = useParams();
  const [params, setParams] = useSearchParams();
  const { planId, extended, progress } = ctx;
  const mod = findModule(moduleId);


  if (!mod) return <Navigate to="/dashboard" replace />;
  if (!moduleUnlocked(mod, planId, ctx.devTrack)) return <LockedModule mod={mod} ctx={ctx} />;

  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'watch';
  // Tab and subject both live in the URL (?tab=…&subject=…) so the sidebar can link to a subject
  const setQuery = (patch) => setParams((prev) => {
    const next = new URLSearchParams(prev);
    Object.entries(patch).forEach(([k, v]) => next.set(k, v));
    return next;
  }, { replace: true });
  const setTab = (id) => setQuery({ tab: id });
  const setSubjectId = (id) => setQuery({ subject: id });
  const subjectId = params.get('subject');
  const isExt = extended && mod.tier !== 'core'; // Ultra's higher limits apply to Plus & Ultra modules
  const subject = mod.subjects.find((s) => s.id === subjectId) || mod.subjects[0];

  const Icon = MODULE_ICONS[mod.icon] || Layers;
  const lectures = allLectures(mod);
  const watchedCount = lectures.filter((l) => progress.watched[l.id]).length;

  return (
    <div className="dx-module">
      <nav className="dx-crumbs" aria-label="Breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <ChevronRight size={14} />
        <span>{mod.title}</span>
      </nav>

      <header className="dx-mod-head">
        <span className="dx-mc-icon dx-mc-icon-lg"><Icon size={22} /></span>
        <div className="dx-mod-head-text">
          <h1>
            {mod.title}
          </h1>
          <p className="dx-muted">{mod.short} · {lectures.length} lectures · {watchedCount} watched</p>
        </div>
        <div className="dx-mod-progress">
          <span>{pct(watchedCount, lectures.length)}%</span>
          <div className="dx-progress"><span style={{ width: `${pct(watchedCount, lectures.length)}%` }} /></div>
        </div>
      </header>

      {mod.subjects.length > 1 && (
        <div className="dx-subjects" role="group" aria-label="Subject">
          {mod.subjects.map((s) => {
            const sl = subjectLectures(s);
            const d = sl.filter((l) => progress.watched[l.id]).length;
            return (
              <button
                key={s.id}
                type="button"
                className={`dx-subject ${s.id === subject.id ? 'active' : ''}`}
                onClick={() => setSubjectId(s.id)}
              >
                {s.title}
                <span className="dx-subject-pct">{pct(d, sl.length)}%</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="dx-tabs" role="tablist">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`dx-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="dx-tab-step">{i + 1}</span>
            <t.Icon size={16} />
            <span className="dx-tab-long">{t.label}</span>
            <span className="dx-tab-short">{t.short}</span>
          </button>
        ))}
      </div>

      {/* Preview: everything stays visible; any tap on content (not unit/test-group toggles) opens the plan pop-up */}
      <div onClickCapture={ctx.preview ? (e) => previewGuard(e, () => ctx.lockedTap(mod)) : undefined}>
        {tab === 'watch' && <WatchTab key={subject.id} mod={mod} subject={subject} ctx={ctx} />}
        {tab === 'practice' && <PracticeTab key={subject.id} mod={mod} subject={subject} ctx={ctx} isExt={isExt} />}
        {tab === 'test' && <TestTab key={subject.id} mod={mod} subject={subject} ctx={ctx} isExt={isExt} />}
        {tab === 'interview' && <InterviewTab mod={mod} subject={subject} ctx={ctx} isExt={isExt} />}
      </div>
    </div>
  );
};

/* Preview mode: let unit accordions and the test-group switch work, lock every other tap */
const PREVIEW_FREE = '.dx-unit-head, .dx-test-switch';
const PREVIEW_ACTION = 'a, button, tr, .dx-card, .dx-lecture';
const previewGuard = (e, onLocked) => {
  if (e.target.closest(PREVIEW_FREE)) return;
  if (!e.target.closest(PREVIEW_ACTION)) return;
  e.preventDefault();
  e.stopPropagation();
  onLocked();
};

/* ─────────────── 1. Watch ─────────────── */

const WatchTab = ({ mod, subject, ctx }) => {
  const { progress, toggle } = ctx;
  const firstOpen = subject.units.find((u) => u.lectures.some((l) => !progress.watched[l.id]))?.id || subject.units[0]?.id;
  // Preview shows every unit expanded; otherwise open the first unfinished one
  const [open, setOpen] = useState(() => new Set(ctx.preview ? subject.units.map((u) => u.id) : [firstOpen])); // keyed by subject id

  const flip = (id) => setOpen((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  return (
    <section className="dx-tab-panel">
      <p className="dx-panel-intro">
        {ctx.preview
          ? `Every ${subject.title} lecture, unit by unit. Tap any lecture to see how to unlock it.`
          : <>Watch {subject.title} unit by unit. Open a lecture to play it, or tick the circle to mark it watched — tests unlock at
            {' '}{Math.round(TEST_UNLOCK_AT * 100)}% and the mock interview when the subject is complete.</>}
      </p>
      <div className="dx-units">
        {subject.units.map((u, idx) => {
          const d = u.lectures.filter((l) => progress.watched[l.id]).length;
          const mins = u.lectures.reduce((a, l) => a + l.mins, 0);
          const isOpen = open.has(u.id);
          return (
            <div key={u.id} className={`dx-unit ${isOpen ? 'open' : ''}`}>
              <button type="button" className="dx-unit-head" onClick={() => flip(u.id)} aria-expanded={isOpen}>
                <span className="dx-unit-num">{String(idx + 1).padStart(2, '0')}</span>
                <span className="dx-unit-title">{u.title}</span>
                <span className="dx-unit-meta">{d}/{u.lectures.length} · {mins} min</span>
                {d === u.lectures.length && <CircleCheck size={16} className="dx-done-icon" />}
                <ChevronDown size={16} className={`dx-chev ${isOpen ? 'up' : ''}`} />
              </button>
              {isOpen && (
                <ul className="dx-lectures">
                  {u.lectures.map((l) => {
                    const done = !!progress.watched[l.id];
                    return (
                      <li key={l.id} className={`dx-lecture ${done ? 'done' : ''}`}>
                        {ctx.preview ? (
                          <span className="dx-lecture-check dx-pv-lock" aria-label="Locked"><Lock size={15} /></span>
                        ) : (
                        <button
                          type="button"
                          className="dx-lecture-check"
                          onClick={() => toggle('watched', l.id)}
                          aria-label={done ? `Mark "${l.title}" as not watched` : `Mark "${l.title}" as watched`}
                          aria-pressed={done}
                        >
                          {done ? <CircleCheck size={18} className="dx-done-icon" /> : <Circle size={18} />}
                        </button>
                        )}
                        <Link to={`/dashboard/m/${mod.id}/watch/${l.id}`} className="dx-lecture-link">
                          <CirclePlay size={16} className="dx-lecture-play" />
                          <span className="dx-lecture-title">{l.title}</span>
                          <span className="dx-lecture-mins">{l.mins} min</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ─────────────── 2. Practice ─────────────── */

const LEVEL_CLASS = { Easy: 'easy', Medium: 'medium', Hard: 'hard' };
const KIND_LABEL = { debugging: 'Debugging', vibe: 'Vibe Coding', sql: 'SQL', coding: 'Coding' };
const LANG_LABEL = { javascript: 'JavaScript', java: 'Java', sql: 'SQL', cpp: 'C++', python: 'Python' };

export const LevelBadge = ({ level }) => (
  <span className={`dx-level dx-level-${LEVEL_CLASS[level] || 'medium'}`}>{level}</span>
);

// Daily featured problem — DSA modules only; renders nothing elsewhere
const ProblemOfTheDay = ({ mod, isExt, progress, preview }) => {
  const potd = problemOfTheDay(mod, isExt);
  if (!potd) return null;
  const { item, unit } = potd;
  const solved = !!progress.practice[item.id];

  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const mins = Math.max(1, Math.round((midnight - now) / 60000));
  const resetsIn = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;

  return (
    <div className="dx-card dx-potd">
      <div className="dx-potd-main">
        <span className="dx-kicker dx-potd-kicker">
          <CalendarDays size={14} /> Problem of the Day · {now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
        <h2>{item.title}</h2>
        <div className="dx-tags dx-potd-tags">
          <LevelBadge level={item.level} />
          <span className="dx-tag">{unit.title}</span>
          {(item.companies || []).map((c) => <span key={c} className="dx-tag">{c}</span>)}
        </div>
        <p className="dx-muted dx-small">{item.statement}</p>
      </div>
      <div className="dx-potd-side">
        {solved && <span className="dx-tag dx-tag-ok"><CircleCheck size={13} /> Solved</span>}
        <Link to={`/dashboard/m/${mod.id}/practice/${item.id}`} className={`dx-btn ${solved ? 'dx-btn-ghost' : 'dx-btn-primary'}`}>
          {preview ? <><Lock size={14} /> Unlock to solve</> : <>{solved ? 'Solve again' : 'Solve now'} <ArrowRight size={15} /></>}
        </Link>
        <span className="dx-muted dx-small">New problem in {resetsIn}</span>
      </div>
    </div>
  );
};

// Practice follows the Watch units one-to-one: same units, same order.
const PracticeTab = ({ mod, subject, ctx, isExt }) => {
  const { progress, toggle } = ctx;
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  const units = subject.units.map((u) => ({ unit: u, items: practiceForUnit(mod, u, isExt) }));
  const firstOpen = units.find((x) => x.items.some((i) => !progress.practice[i.id]))?.unit.id || units[0]?.unit.id;
  const [open, setOpen] = useState(() => new Set(ctx.preview ? units.map((x) => x.unit.id) : [firstOpen]));
  const flip = (id) => setOpen((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  const openItem = (item) => {
    if (WORKSPACE_KINDS.includes(item.kind)) navigate(`/dashboard/m/${mod.id}/practice/${item.id}`);
    else setActive(item);
  };

  return (
    <section className="dx-tab-panel">
      <p className="dx-panel-intro">
        Practice follows the lectures unit by unit. Watch a unit, then solve its questions here.
      </p>

      <ProblemOfTheDay mod={mod} isExt={isExt} progress={progress} preview={ctx.preview} />

      <div className="dx-units">
        {units.map(({ unit: u, items }, idx) => {
          const solved = items.filter((i) => progress.practice[i.id]).length;
          const isOpen = open.has(u.id);
          const lecturesDone = u.lectures.filter((l) => progress.watched[l.id]).length;
          const hasCompany = items.length > 0 && items.every((i) => i.companies);
          const workspace = items.some((i) => WORKSPACE_KINDS.includes(i.kind));
          return (
            <div key={u.id} className={`dx-unit ${isOpen ? 'open' : ''}`}>
              <button type="button" className="dx-unit-head" onClick={() => flip(u.id)} aria-expanded={isOpen}>
                <span className="dx-unit-num">{String(idx + 1).padStart(2, '0')}</span>
                <span className="dx-unit-title">{u.title}</span>
                <span className="dx-unit-meta">{solved}/{items.length} solved</span>
                {items.length > 0 && solved === items.length && <CircleCheck size={16} className="dx-done-icon" />}
                <ChevronDown size={16} className={`dx-chev ${isOpen ? 'up' : ''}`} />
              </button>

              {isOpen && (
                <div className="dx-ptable-wrap">
                  <div className="dx-ptable-note">
                    <span className="dx-muted dx-small">Lectures watched: {lecturesDone}/{u.lectures.length}</span>
                    <Link to={`/dashboard/m/${mod.id}/watch/${u.lectures[0].id}`} className="dx-mini-link">
                      <CirclePlay size={14} /> Watch this unit
                    </Link>
                  </div>
                  <table className="dx-ptable">
                    <thead>
                      <tr>
                        <th className="dx-col-status" scope="col"><span className="dx-sr">Status</span></th>
                        <th scope="col">{workspace ? 'Problem Name' : 'Practice Set'}</th>
                        <th scope="col" className="dx-col-level">Level</th>
                        <th scope="col" className="dx-col-tags">{hasCompany ? 'Company' : 'Details'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => {
                        const done = !!progress.practice[item.id];
                        return (
                          <tr key={item.id} className={done ? 'done' : ''}>
                            <td className="dx-col-status">
                              {ctx.preview
                                ? <Lock size={15} className="dx-pv-lock" aria-label="Locked" />
                                : done ? <CircleCheck size={17} className="dx-done-icon" aria-label="Solved" /> : <Circle size={17} className="dx-muted" aria-label="Not solved" />}
                            </td>
                            <td>
                              <button type="button" className="dx-prow-title" onClick={() => openItem(item)}>
                                {item.title}
                              </button>
                            </td>
                            <td className="dx-col-level"><LevelBadge level={item.level} /></td>
                            <td className="dx-col-tags">
                              <div className="dx-tags">
                                {item.companies
                                  ? item.companies.map((c) => <span key={c} className="dx-tag">{c}</span>)
                                  : KIND_LABEL[item.kind]
                                    ? <>
                                        <span className="dx-tag">{KIND_LABEL[item.kind]}</span>
                                        {item.language && <span className="dx-tag">{LANG_LABEL[item.language]}</span>}
                                      </>
                                    : <span className="dx-tag">{item.count} {item.noun}</span>}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {active && (
        <Dialog title={active.title} onClose={() => setActive(null)}>
          <p className="dx-muted">
            {active.count} {active.noun} · <LevelBadge level={active.level} />
          </p>
          <div className="dx-demo-note">This practice set opens here. In this demo you can mark it as done.</div>
          <div className="dx-dialog-actions">
            <button type="button" className="dx-btn dx-btn-ghost" onClick={() => setActive(null)}>Close</button>
            <button
              type="button"
              className="dx-btn dx-btn-primary"
              onClick={() => { if (!progress.practice[active.id]) toggle('practice', active.id); setActive(null); }}
            >
              <CircleCheck size={16} /> Mark set as done
            </button>
          </div>
        </Dialog>
      )}
    </section>
  );
};

/* ─────────────── 3. Proctored tests ─────────────── */

// Scope for gating: the selected subject for per-subject items, otherwise the whole module
const scopeOf = (mod, subject, perSubject) =>
  perSubject
    ? { id: subject.id, name: subject.title, lectures: subjectLectures(subject) }
    : { id: 'module', name: mod.title, lectures: allLectures(mod) };

const TestTab = ({ mod, subject, ctx, isExt }) => {
  const { progress, set } = ctx;
  const [view, setView] = useState('module');
  const [active, setActive] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const attemptsAllowed = isExt ? 2 : 1;
  const pctLabel = Math.round(TEST_UNLOCK_AT * 100);

  // Module Tests: one stage per unit (in lecture order), unlocked one after another
  const stages = stageTests(mod, subject);
  const moduleRows = stages.map((t, i) => {
    const watched = t.unit.lectures.filter((l) => progress.watched[l.id]).length;
    const need = Math.ceil(t.unit.lectures.length * TEST_UNLOCK_AT) - watched;
    const prevDone = i === 0 || !!progress.tests[stages[i - 1].id];
    return {
      id: t.id,
      stage: `#${i + 1}`,
      name: t.name,
      mins: t.mins,
      count: `${t.questions} ${t.noun}`,
      testType: t.testType,
      format: t.format,
      unlocked: prevDone && need <= 0,
      reason: !prevDone ? `Attempt stage #${i} first` : `Watch ${need} more lecture${need === 1 ? '' : 's'} of ${t.unit.title}`
    };
  });

  // Additional Tests: the module-wide tests (per subject where configured)
  const additionalRows = mod.tests.map((t, i) => {
    const scope = scopeOf(mod, subject, t.perSubject);
    const watched = scope.lectures.filter((l) => progress.watched[l.id]).length;
    const need = Math.ceil(scope.lectures.length * TEST_UNLOCK_AT) - watched;
    const meta = ADDITIONAL_META[t.kind] || { testType: t.label, format: 'MCQ' };
    return {
      id: `${mod.id}:${t.kind}:${scope.id}`,
      stage: `#${i + 1}`,
      name: t.perSubject ? `${scope.name} · ${t.label}` : t.label,
      mins: t.mins,
      count: `${t.questions} Questions`,
      testType: t.perSubject && t.kind === 'proctored' ? 'Full Subject' : meta.testType,
      format: meta.format,
      unlocked: need <= 0,
      reason: `Watch ${pctLabel}% of ${scope.name} (${need} more lecture${need === 1 ? '' : 's'})`
    };
  });

  const rows = view === 'module' ? moduleRows : additionalRows;

  return (
    <section className="dx-tab-panel">
      <div className="dx-test-switch" role="tablist" aria-label="Test groups">
        <button type="button" role="tab" aria-selected={view === 'module'} className={view === 'module' ? 'active' : ''} onClick={() => setView('module')}>
          Module Tests <span className="dx-count">{moduleRows.length}</span>
        </button>
        {additionalRows.length > 0 && (
          <button type="button" role="tab" aria-selected={view === 'additional'} className={view === 'additional' ? 'active' : ''} onClick={() => setView('additional')}>
            Additional Tests <span className="dx-count">{additionalRows.length}</span>
          </button>
        )}
      </div>

      <p className="dx-panel-intro">
        {view === 'module'
          ? `One test per unit, in lecture order. Each unlocks after you watch ${pctLabel}% of its unit and attempt the previous stage.`
          : `Module-wide tests. Each unlocks after you watch ${pctLabel}% of its content.`}
        {' '}All tests are proctored: camera on, full-screen and tab-switch monitoring.
      </p>

      <div className="dx-card dx-ttable-card">
        <table className="dx-ptable dx-ttable">
          <thead>
            <tr>
              <th scope="col" className="dx-col-stage">{view === 'module' ? 'Stage' : '#'}</th>
              <th scope="col">Name</th>
              <th scope="col">Test Type</th>
              <th scope="col">Type</th>
              <th scope="col">Platform</th>
              <th scope="col">Result</th>
              <th scope="col">Marks</th>
              <th scope="col" className="dx-col-link">Link</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const record = progress.tests[r.id];
              const used = record?.count || 0;
              const left = attemptsAllowed - used;
              return (
                <tr key={r.id}>
                  <td className="dx-col-stage">{r.stage}</td>
                  <td>
                    <div className="dx-tname">{r.name}</div>
                    <div className="dx-tmeta">
                      <span><Timer size={13} /> {r.mins} mins</span>
                      <span>{r.count}</span>
                      {isExt && <span className="dx-ext-tag">2 attempts</span>}
                    </div>
                    {ctx.preview
                      ? <div className="dx-treason"><Lock size={12} /> Unlocks with a plan</div>
                      : !r.unlocked && <div className="dx-treason"><Lock size={12} /> {r.reason}</div>}
                  </td>
                  <td><span className="dx-chip-type">{r.testType}</span></td>
                  <td><span className="dx-chip-format">{r.format}</span></td>
                  <td className="dx-muted dx-small">Chrome Browser</td>
                  <td>
                    {used > 0
                      ? <span className="dx-chip-result ok">Attempted{attemptsAllowed > 1 ? ` ${used}/${attemptsAllowed}` : ''}</span>
                      : <span className="dx-chip-result">Unattempted</span>}
                  </td>
                  <td className={used > 0 ? 'dx-small' : 'dx-muted'}>{used > 0 ? 'Pending' : 'N/A'}</td>
                  <td className="dx-col-link">
                    {ctx.preview || !r.unlocked ? (
                      <button type="button" className="dx-btn dx-btn-locked dx-btn-sm" disabled={!ctx.preview} title={ctx.preview ? 'Unlock with a plan' : r.reason}>
                        Locked <Lock size={14} />
                      </button>
                    ) : left > 0 ? (
                      <button
                        type="button"
                        className="dx-btn dx-btn-primary dx-btn-sm"
                        onClick={() => { setAgreed(false); setActive({ ...r, used }); }}
                      >
                        {used > 0 ? 'Retake Test' : 'Launch Test'} <ExternalLink size={14} />
                      </button>
                    ) : (
                      <button type="button" className="dx-btn dx-btn-locked dx-btn-sm" disabled>
                        Completed <CircleCheck size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {active && (
        <Dialog title={active.name} onClose={() => setActive(null)}>
          <p className="dx-muted">{active.testType} · {active.format} · {active.count} · {active.mins} minutes</p>
          <ul className="dx-rules">
            <li><Camera size={15} /> Camera stays on for the whole test</li>
            <li><Monitor size={15} /> Test runs in full-screen; leaving it is flagged</li>
            <li><X size={15} /> Tab switches and copy-paste are monitored</li>
            <li><Timer size={15} /> The timer can't be paused once you start</li>
          </ul>
          <label className="dx-check">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            I understand the proctoring rules
          </label>
          <div className="dx-demo-note">The proctored test environment launches here. In this demo, starting records an attempt; marks show once it's evaluated.</div>
          <div className="dx-dialog-actions">
            <button type="button" className="dx-btn dx-btn-ghost" onClick={() => setActive(null)}>Cancel</button>
            <button
              type="button"
              className="dx-btn dx-btn-primary"
              disabled={!agreed}
              onClick={() => {
                set('tests', active.id, { count: active.used + 1, last: new Date().toISOString() });
                setActive(null);
              }}
            >
              Start proctored test
            </button>
          </div>
        </Dialog>
      )}
    </section>
  );
};

/* ─────────────── 4. Mock interview ─────────────── */

const nextSlots = () => {
  const out = [];
  const base = new Date();
  for (let d = 1; d <= 3; d++) {
    const day = new Date(base);
    day.setDate(base.getDate() + d);
    for (const h of [10, 15, 19]) {
      const s = new Date(day);
      s.setHours(h, 0, 0, 0);
      out.push(s.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }));
    }
  }
  return out;
};

const InterviewTab = ({ mod, subject, ctx, isExt }) => {
  const { progress, set } = ctx;
  const [booking, setBooking] = useState(null);
  const [slot, setSlot] = useState('');
  const [slots] = useState(nextSlots);
  const iv = mod.interview;
  const scope = scopeOf(mod, subject, iv.perSubject);
  const watched = scope.lectures.filter((l) => progress.watched[l.id]).length;
  const complete = scope.lectures.length > 0 && watched === scope.lectures.length;
  const rounds = isExt ? 2 : 1;

  return (
    <section className="dx-tab-panel">
      <p className="dx-panel-intro">
        A live mock interview on {scope.name}, unlocked once you've completed {iv.perSubject ? 'the subject' : 'the module'}.
        You get detailed feedback after each round.
      </p>
      <div className="dx-test-grid">
        {Array.from({ length: rounds }, (_, i) => {
          const key = `${mod.id}:interview:${scope.id}:${i + 1}`;
          const booked = progress.interviews[key];
          return (
            <div key={key} className={`dx-card dx-test ${complete ? '' : 'locked'}`}>
              <div className="dx-set-top">
                <h3>{iv.label}{rounds > 1 ? ` · Round ${i + 1}` : ''}</h3>
                {!complete ? <Lock size={15} className="dx-muted" /> : booked && <CalendarClock size={16} className="dx-done-icon" />}
              </div>
              <p className="dx-muted dx-small">{scope.name} · {iv.mins} min{isExt && i === 1 ? ' · Ultra' : ''}</p>
              {!complete ? (
                <div className="dx-gate">
                  <div className="dx-progress"><span style={{ width: `${pct(watched, scope.lectures.length)}%` }} /></div>
                  <p className="dx-small dx-muted">
                    {ctx.preview ? 'Locked · unlocks with a plan' : `${watched}/${scope.lectures.length} lectures watched — finish all to unlock`}
                  </p>
                </div>
              ) : booked ? (
                <>
                  <p className="dx-small"><strong>Booked:</strong> {booked}</p>
                  <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => set('interviews', key, null)}>Cancel booking</button>
                </>
              ) : (
                <button type="button" className="dx-btn dx-btn-primary dx-btn-sm" onClick={() => { setSlot(''); setBooking({ key, round: i + 1 }); }}>
                  <CalendarClock size={15} /> Book a slot
                </button>
              )}
            </div>
          );
        })}
      </div>

      {booking && (
        <Dialog title={`Book ${iv.label}${rounds > 1 ? ` · Round ${booking.round}` : ''}`} onClose={() => setBooking(null)}>
          <p className="dx-muted">Pick a time. Slots are {iv.mins} minutes with an interviewer.</p>
          <div className="dx-slots">
            {slots.map((s) => (
              <button key={s} type="button" className={`dx-slot ${slot === s ? 'active' : ''}`} onClick={() => setSlot(s)}>{s}</button>
            ))}
          </div>
          <div className="dx-dialog-actions">
            <button type="button" className="dx-btn dx-btn-ghost" onClick={() => setBooking(null)}>Cancel</button>
            <button
              type="button"
              className="dx-btn dx-btn-primary"
              disabled={!slot}
              onClick={() => { set('interviews', booking.key, slot); setBooking(null); }}
            >
              Confirm slot
            </button>
          </div>
        </Dialog>
      )}
    </section>
  );
};

/* ─────────────── Locked module ─────────────── */

const TRACK = { mern: 'MERN', jfs: 'JFS' };
const lockedReason = (mod, ctx) => {
  if (mod.tier === 'ultra') return 'This module is part of the Ultra plan.';
  if (DEV_TRACKS.includes(mod.id)) {
    return ctx.planId === 'plus'
      ? `Your Plus plan includes the ${TRACK[ctx.devTrack || 'mern']} track. Get both Full Stack tracks with Ultra.`
      : 'Plus includes one Full Stack track of your choice (MERN or JFS). Ultra includes both.';
  }
  return 'This module is part of the Plus plan.';
};

const LockedModule = ({ mod, ctx }) => {
  const Icon = MODULE_ICONS[mod.icon] || Layers;
  const lectures = allLectures(mod);
  return (
    <div className="dx-module">
      <nav className="dx-crumbs" aria-label="Breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <ChevronRight size={14} />
        <span>{mod.title}</span>
      </nav>
      <div className="dx-card dx-locked">
        <span className="dx-mc-icon dx-mc-icon-lg"><Icon size={22} /></span>
        <h1>{mod.title}</h1>
        <p className="dx-muted">{lockedReason(mod, ctx)}</p>
        <ul className="dx-locked-list">
          <li><CirclePlay size={15} /> {lectures.length} lectures across {mod.subjects.reduce((a, s) => a + s.units.length, 0)} units</li>
          {mod.practice.map((p) => <li key={p.kind}><ListChecks size={15} /> {p.label}</li>)}
          {mod.tests.map((t) => <li key={t.kind}><ClipboardCheck size={15} /> {t.label}</li>)}
          <li><Mic size={15} /> {mod.interview.label}</li>
        </ul>
        <button type="button" className="dx-btn dx-btn-primary" onClick={() => ctx.openUpgrade(requiredPlanFor(mod, ctx.planId))}>
          <Sparkles size={16} /> Upgrade to {requiredPlanFor(mod, ctx.planId) === 'compete' ? 'Ultra' : 'Plus'}
        </button>
      </div>
    </div>
  );
};

/* ─────────────── Dialog (shadcn-style) ─────────────── */

const Dialog = ({ title, onClose, children }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="dx-dialog-backdrop" onClick={onClose}>
      <div className="dx-dialog" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="dx-dialog-head">
          <h2>{title}</h2>
          <button type="button" className="dx-icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ModuleView;
