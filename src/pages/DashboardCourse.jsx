import { useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Camera, ChevronDown, Circle, CircleCheck, CirclePlay, ClipboardCheck, ExternalLink, Infinity as InfinityIcon,
  ListChecks, Lock, Monitor, PlayCircle, Timer, X
} from 'lucide-react';
import { COURSE_TEST_UNLOCK, courseLectures, courseTests, courseUnits, findPurchase } from '../data/oneTimePurchases';
import { coursePillars, useCourseProgress } from '../utils/oneTimeProgress';
import PillarBar from '../components/PillarBar';
import { Dialog, LevelBadge, TabInfo } from './DashboardModuleView';
import DashboardPlayer from './DashboardPlayer';
import DashboardWorkspace from './DashboardWorkspace';

/* ══════════════════════════════════════════════════════════════
   One-time purchased course — /dashboard/course/:courseId
   Same layout as a subscription module page: back link, header with
   the pillar bar, then three tabs — Lectures · Problem · Test.
   Lectures play at /dashboard/course/:courseId/watch/:lectureId and
   problems open the coding workspace at …/practice/:problemId.
   Progress lives in its own store (utils/oneTimeProgress).
   ══════════════════════════════════════════════════════════════ */

const TABS = [
  { id: 'watch', label: 'Lectures', Icon: CirclePlay, info: 'Every lecture of the course, unit by unit. Tick a lecture to mark it watched, or open it in the player.' },
  { id: 'practice', label: 'Problem', Icon: ListChecks, info: 'Problems that go with each unit. Open one to solve it in the coding workspace.' },
  { id: 'test', label: 'Test', Icon: ClipboardCheck, info: `One test per unit, then a final course test. A test unlocks once you watch ${Math.round(COURSE_TEST_UNLOCK * 100)}% of its lectures.` }
];

const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const hours = (mins) => (mins >= 60 ? `${Math.round(mins / 6) / 10} h` : `${mins} min`);
const base = (c) => `/dashboard/course/${c.id}`;

/* Unit accordions: open the first unfinished one by default */
const useUnitsOpen = (units, isDone) => {
  const first = units.find((u) => !isDone(u))?.id || units[0]?.id;
  const [open, setOpen] = useState(() => new Set(first ? [first] : []));
  const flip = (id) => setOpen((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  return [open, flip];
};

/* ── 1. Lectures ── */
const LecturesTab = ({ course, progress, update }) => {
  const units = courseUnits(course);
  const [open, flip] = useUnitsOpen(units, (u) => u.lectures.every((l) => progress.watched[l.id]));
  return (
    <section className="dx-tab-panel">
      <div className="dx-units">
        {units.map((u, idx) => {
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
                        <button type="button" className="dx-lecture-check" onClick={() => update('watched', l.id, !done)}
                          aria-label={done ? `Mark "${l.title}" as not watched` : `Mark "${l.title}" as watched`} aria-pressed={done}>
                          {done ? <CircleCheck size={18} className="dx-done-icon" /> : <Circle size={18} />}
                        </button>
                        <Link to={`${base(course)}/watch/${l.id}`} className="dx-lecture-link">
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

/* ── 2. Problem ── */
const ProblemTab = ({ course, progress }) => {
  const units = courseUnits(course).filter((u) => u.problems.length);
  const [open, flip] = useUnitsOpen(units, (u) => u.problems.every((p) => progress.solved[p.id]));
  if (!units.length) {
    return <section className="dx-tab-panel"><p className="dx-oc-empty">This course has no problems to solve. Its lectures and tests are on the other tabs.</p></section>;
  }
  return (
    <section className="dx-tab-panel">
      <div className="dx-units">
        {units.map((u, idx) => {
          const solved = u.problems.filter((p) => progress.solved[p.id]).length;
          const isOpen = open.has(u.id);
          return (
            <div key={u.id} className={`dx-unit ${isOpen ? 'open' : ''}`}>
              <button type="button" className="dx-unit-head" onClick={() => flip(u.id)} aria-expanded={isOpen}>
                <span className="dx-unit-num">{String(idx + 1).padStart(2, '0')}</span>
                <span className="dx-unit-title">{u.title}</span>
                <span className="dx-unit-meta">{solved}/{u.problems.length} solved</span>
                {solved === u.problems.length && <CircleCheck size={16} className="dx-done-icon" />}
                <ChevronDown size={16} className={`dx-chev ${isOpen ? 'up' : ''}`} />
              </button>
              {isOpen && (
                <div className="dx-ptable-wrap">
                  <table className="dx-ptable">
                    <thead>
                      <tr>
                        <th className="dx-col-status" scope="col"><span className="dx-sr">Status</span></th>
                        <th scope="col">Problem Name</th>
                        <th scope="col" className="dx-col-level">Level</th>
                        <th scope="col" className="dx-col-tags">Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      {u.problems.map((p) => {
                        const done = !!progress.solved[p.id];
                        return (
                          <tr key={p.id} className={done ? 'done' : ''}>
                            <td className="dx-col-status">
                              {done ? <CircleCheck size={17} className="dx-done-icon" aria-label="Solved" /> : <Circle size={17} className="dx-muted" aria-label="Not solved" />}
                            </td>
                            <td><Link to={`${base(course)}/practice/${p.id}`} className="dx-prow-title">{p.title}</Link></td>
                            <td className="dx-col-level"><LevelBadge level={p.level} /></td>
                            <td className="dx-col-tags"><div className="dx-tags">{(p.companies || []).map((c) => <span key={c} className="dx-tag">{c}</span>)}</div></td>
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
    </section>
  );
};

/* ── 3. Test ── */
const TestTab = ({ course, progress, update }) => {
  const [active, setActive] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const rows = courseTests(course).map((t) => {
    const watched = t.lectures.filter((l) => progress.watched[l.id]).length;
    const need = Math.ceil(t.lectures.length * COURSE_TEST_UNLOCK) - watched;
    return { ...t, unlocked: need <= 0, reason: `Watch ${need} more lecture${need === 1 ? '' : 's'}${t.unit ? ` of ${t.unit.title}` : ' of the course'}` };
  });

  return (
    <section className="dx-tab-panel">
      <div className="dx-card dx-ttable-card">
        <table className="dx-ptable dx-ttable">
          <thead>
            <tr>
              <th scope="col" className="dx-col-stage">Stage</th>
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
              const used = progress.tests[r.id]?.count || 0;
              return (
                <tr key={r.id}>
                  <td className="dx-col-stage">{r.stage}</td>
                  <td>
                    <div className="dx-tname">{r.name}</div>
                    <div className="dx-tmeta"><span><Timer size={13} /> {r.mins} mins</span><span>{r.count}</span></div>
                    {!r.unlocked && <div className="dx-treason"><Lock size={12} /> {r.reason}</div>}
                  </td>
                  <td><span className="dx-chip-type">{r.testType}</span></td>
                  <td><span className="dx-chip-format">{r.format}</span></td>
                  <td className="dx-muted dx-small">Chrome Browser</td>
                  <td>{used > 0 ? <span className="dx-chip-result ok">Attempted</span> : <span className="dx-chip-result">Unattempted</span>}</td>
                  <td className={used > 0 ? 'dx-small' : 'dx-muted'}>{used > 0 ? 'Pending' : 'N/A'}</td>
                  <td className="dx-col-link">
                    {!r.unlocked ? (
                      <button type="button" className="dx-btn dx-btn-locked dx-btn-sm" disabled title={r.reason}>Locked <Lock size={14} /></button>
                    ) : used > 0 ? (
                      <button type="button" className="dx-btn dx-btn-locked dx-btn-sm" disabled>Completed <CircleCheck size={14} /></button>
                    ) : (
                      <button type="button" className="dx-btn dx-btn-primary dx-btn-sm" onClick={() => { setAgreed(false); setActive(r); }}>
                        Launch Test <ExternalLink size={14} />
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
            <li><Timer size={15} /> The timer can&apos;t be paused once you start</li>
          </ul>
          <label className="dx-check">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            I understand the proctoring rules
          </label>
          <div className="dx-demo-note">The proctored test environment launches here. In this demo, starting records an attempt; marks show once it&apos;s evaluated.</div>
          <div className="dx-dialog-actions">
            <button type="button" className="dx-btn dx-btn-ghost" onClick={() => setActive(null)}>Cancel</button>
            <button type="button" className="dx-btn dx-btn-primary" disabled={!agreed}
              onClick={() => { update('tests', active.id, { count: 1, last: new Date().toISOString() }); setActive(null); }}>
              Start proctored test
            </button>
          </div>
        </Dialog>
      )}
    </section>
  );
};

/* ── Page ── */
const CoursePage = () => {
  const { courseId } = useParams();
  const course = findPurchase(courseId);
  const [progress, update] = useCourseProgress(course);
  const [params, setParams] = useSearchParams();

  if (!course) return <Navigate to="/dashboard/content" replace />;

  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'watch';
  const setTab = (id) => setParams({ tab: id }, { replace: true });
  const lectures = courseLectures(course);
  const watchedCount = lectures.filter((l) => progress.watched[l.id]).length;
  const next = lectures.find((l) => !progress.watched[l.id]);
  const pillars = coursePillars(course, progress);
  const mins = lectures.reduce((a, l) => a + l.mins, 0);

  return (
    <div className="dx-module dx-oc-page">
      <Link to="/dashboard/content" className="dx-mod-back" title="Back to all content">
        <ArrowLeft size={15} /> Back
      </Link>

      <header className="dx-mod-head">
        <span className="dx-mc-icon dx-mc-icon-lg"><PlayCircle size={22} /></span>
        <div className="dx-mod-head-text">
          <h1>{course.title}</h1>
          <p className="dx-muted">
            <span className="dx-oc-tag"><InfinityIcon size={12} /> One-time purchase</span>
            {courseUnits(course).length} units · {lectures.length} lectures · {hours(mins)} · {watchedCount} watched · Purchased {fmtDate(course.purchased)}
          </p>
        </div>
        <div className="dx-mod-progress">
          <PillarBar parts={pillars.parts} overall={pillars.overall} />
        </div>
      </header>

      {next && tab === 'watch' && (
        <Link to={`${base(course)}/watch/${next.id}`} className="dx-cp-resume dx-oc-resume">
          <span className="dx-cp-resume-icon"><PlayCircle size={20} /></span>
          <span className="dx-cp-resume-text">
            <small>{watchedCount ? 'Continue where you left off' : 'Start here'}</small>
            <strong>{next.title}</strong>
          </span>
        </Link>
      )}

      <div className="dx-tabs" role="tablist">
        {TABS.map((t, i) => (
          <div key={t.id} className={`dx-tab-wrap ${tab === t.id ? 'active' : ''}`}>
            <button type="button" role="tab" aria-selected={tab === t.id} className={`dx-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <span className="dx-tab-step">{i + 1}</span>
              <t.Icon size={16} />
              <span className="dx-tab-long">{t.label}</span>
              <span className="dx-tab-short">{t.label}</span>
            </button>
            <TabInfo id={t.id} label={t.label} text={t.info} />
          </div>
        ))}
      </div>

      {tab === 'watch' && <LecturesTab course={course} progress={progress} update={update} />}
      {tab === 'practice' && <ProblemTab course={course} progress={progress} />}
      {tab === 'test' && <TestTab course={course} progress={progress} update={update} />}
    </div>
  );
};

/* /dashboard/course/:courseId/watch/:lectureId — the lecture player for a purchased course */
const CourseWatchInner = ({ ctx }) => {
  const { courseId, lectureId } = useParams();
  const course = findPurchase(courseId);
  const [progress, update] = useCourseProgress(course);
  if (!course) return <Navigate to="/dashboard/content" replace />;
  const setWatched = (id, v) => update('watched', id, v);
  return <DashboardPlayer key={lectureId} ctx={ctx} course={{ mod: course, watched: progress.watched, setWatched }} />;
};

/* /dashboard/course/:courseId/practice/:problemId — the coding workspace for one course problem */
const CourseSolveInner = ({ ctx }) => {
  const { courseId, problemId } = useParams();
  const course = findPurchase(courseId);
  const [progress, update] = useCourseProgress(course);
  const item = course ? courseUnits(course).flatMap((u) => u.problems).find((p) => p.id === problemId) : null;
  if (!course || !item) return <Navigate to={course ? `${base(course)}?tab=practice` : '/dashboard/content'} replace />;
  const backTo = `${base(course)}?tab=practice`;
  return (
    <DashboardWorkspace key={item.id} ctx={ctx} free={{
      item,
      solved: !!progress.solved[item.id],
      onSolved: (id) => update('solved', id, new Date().toISOString()),
      backTo,
      crumbs: [{ label: course.title, to: backTo }]
    }} />
  );
};

/* Each course gets fresh state (progress, open units) when the URL moves to another course */
const DashboardCourse = () => <CoursePage key={useParams().courseId} />;
export const CourseWatch = ({ ctx }) => <CourseWatchInner key={useParams().courseId} ctx={ctx} />;
export const CourseSolve = ({ ctx }) => <CourseSolveInner key={useParams().courseId} ctx={ctx} />;

export default DashboardCourse;
