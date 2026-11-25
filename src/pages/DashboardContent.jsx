import { Link } from 'react-router-dom';
import { ArrowRight, Check, CircleCheck, Clock, Lock, PlayCircle, Route } from 'lucide-react';
import ModuleIcon from '../components/ModuleIcon';
import { MODULES, PLAN_LABELS, moduleUnlocked, subjectLectures, subjectUnlocked } from '../data/learnerModules';
import { ONE_TIME_PURCHASES, courseLectures } from '../data/oneTimePurchases';
import { coursePillars, courseWatched } from '../utils/oneTimeProgress';
import PillarBar from '../components/PillarBar';

/* ══════════════════════════════════════════════════════════════
   Content — /dashboard/content
   The learning path before entering a module: every module in order,
   and inside it every section (subject) in order, with progress.
   The first unfinished section is marked "Continue here".
   Paid: the plan's modules; a section outside the plan's tier (e.g.
   DSA Advanced on Core) shows locked; the other Full Stack track is
   left out. Preview: its short module list, all sections open.
   Two groups: "Subscription" (the plan's path, in sequence) and,
   after a divider, "One-time purchased" (standalone cards, no rail).
   ══════════════════════════════════════════════════════════════ */

const HIDDEN = ['dsa-mastery']; // kept off the paid content list (same as the module bar)
const pct = (d, t) => (t ? Math.round((d / t) * 100) : 0);
const two = (n) => String(n).padStart(2, '0');
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const hours = (mins) => (mins >= 60 ? `${Math.round(mins / 6) / 10} h` : `${mins} min`);

const buildPath = (ctx) => {
  const source = ctx.preview
    ? ctx.modules
    : MODULES.filter((m) => moduleUnlocked(m, ctx.planId) && !HIDDEN.includes(m.id));
  return source.map((mod) => {
    const subjects = mod.subjects
      .filter((s) => ctx.preview || !s.track || subjectUnlocked(mod, s, ctx.planId, ctx.devTrack))
      .map((s) => {
        const lectures = subjectLectures(s);
        const done = lectures.filter((l) => ctx.progress.watched[l.id]).length;
        return {
          subj: s,
          locked: !ctx.preview && !subjectUnlocked(mod, s, ctx.planId, ctx.devTrack),
          units: s.units.length,
          lectures: lectures.length,
          mins: lectures.reduce((a, l) => a + (l.mins || 0), 0),
          done,
          pct: pct(done, lectures.length)
        };
      });
    const open = subjects.filter((s) => !s.locked);
    const done = open.reduce((a, s) => a + s.done, 0);
    const total = open.reduce((a, s) => a + s.lectures, 0);
    return { mod, subjects, done, total, pct: pct(done, total) };
  }).filter((m) => m.subjects.length);
};

const DashboardContent = ({ ctx }) => {
  const path = buildPath(ctx);
  const allOpen = path.flatMap((m) => m.subjects.filter((s) => !s.locked).map((s) => ({ ...s, mod: m.mod })));
  const next = allOpen.find((s) => s.pct < 100);
  const done = allOpen.reduce((a, s) => a + s.done, 0);
  const total = allOpen.reduce((a, s) => a + s.lectures, 0);
  const finishedSections = allOpen.filter((s) => s.pct === 100).length;

  return (
    <div className="dx-cp">
      {/* Summary + where to pick up */}
      <section className="dx-cp-head">
        {/* Path banner: big number, one dot per module, a soft brand tint (same pattern as the check-in card) */}
        <div className="dx-cp-sum">
          <p className="dx-cp-kicker">Your learning path</p>
          <div className="dx-cp-big">
            <strong>{pct(done, total)}%</strong>
            <span>of your path done</span>
          </div>
          <ol className="dx-cp-dots" aria-label="Modules">
            {path.map((m, i) => (
              <li key={m.mod.id} className={m.pct === 100 ? 'is-done' : m.pct > 0 ? 'is-progress' : ''} title={`${m.mod.title} · ${m.pct}%`}>
                <span>{m.pct === 100 ? <Check size={11} strokeWidth={3} /> : i + 1}</span>
              </li>
            ))}
          </ol>
          <small className="dx-cp-foot">{path.length} modules · {allOpen.length} sections · {done}/{total} lectures · {finishedSections} sections done</small>
          <Route className="dx-cp-art" strokeWidth={1.4} aria-hidden="true" />
        </div>
        {next && (
          <Link to={`/dashboard/m/${next.mod.id}?subject=${next.subj.id}`} className="dx-cp-resume">
            <span className="dx-cp-resume-icon"><PlayCircle size={20} /></span>
            <span className="dx-cp-resume-text">
              <small>{done ? 'Continue where you left off' : 'Start here'}</small>
              <strong>{next.mod.subjects.length > 1 ? next.subj.title : next.mod.title}</strong>
              <em>{next.mod.title} · {next.done}/{next.lectures} lectures</em>
            </span>
            <ArrowRight size={16} />
          </Link>
        )}
      </section>

      {/* ── Subscription: modules in order, each with its sections in order ── */}
      <div className="dx-cp-group">
        <h2>Subscription</h2>
        <span>{ctx.preview ? 'Preview' : `${PLAN_LABELS[ctx.planId]} plan`} · {path.length} modules</span>
      </div>
      <ol className="dx-cp-path">
        {path.map((m, mi) => (
          <li key={m.mod.id} className={`dx-cp-step ${m.pct === 100 ? 'is-done' : ''}`}>
            <span className="dx-cp-num" aria-hidden="true">{m.pct === 100 ? <CircleCheck size={16} /> : two(mi + 1)}</span>
            <div className="dx-cp-mod">
              <Link to={`/dashboard/m/${m.mod.id}`} className="dx-cp-mod-head">
                <span className="dx-mc-icon"><ModuleIcon mod={m.mod} size={17} /></span>
                <span className="dx-cp-mod-title">
                  <strong>{m.mod.title}</strong>
                  <small>{m.subjects.length} {m.subjects.length === 1 ? 'section' : 'sections'}</small>
                </span>
                <span className="dx-cp-mod-pct">
                  <span className="dx-cp-bar is-sm" aria-hidden="true"><span style={{ width: `${m.pct}%` }} /></span>
                  <strong>{m.pct}%</strong>
                </span>
                <ArrowRight size={15} className="dx-cp-go" />
              </Link>

              <ul className="dx-cp-subs">
                {m.subjects.map((s, si) => {
                  const isNext = next && next.mod.id === m.mod.id && next.subj.id === s.subj.id;
                  const state = s.locked ? 'locked' : s.pct === 100 ? 'done' : s.done ? 'progress' : 'new';
                  const label = { locked: 'Locked', done: 'Completed', progress: 'In progress', new: 'Not started' }[state];
                  return (
                    <li key={s.subj.id}>
                      <Link
                        to={`/dashboard/m/${m.mod.id}?subject=${s.subj.id}`}
                        className={`dx-cp-sub is-${state} ${isNext ? 'is-next' : ''}`}
                      >
                        <span className="dx-cp-sub-top">
                          <span className="dx-cp-sub-num">{mi + 1}.{si + 1}</span>
                          <span className={`dx-cp-state is-${state}`}>
                            {state === 'locked' && <Lock size={11} />}
                            {state === 'done' && <CircleCheck size={11} />}
                            {isNext ? 'Continue here' : label}
                          </span>
                        </span>
                        <strong>{s.subj.title}</strong>
                        <span className="dx-cp-sub-meta">
                          {s.units} units · {s.lectures} lectures · <Clock size={11} /> {hours(s.mins)}
                        </span>
                        <span className="dx-cp-sub-prog">
                          <span className="dx-cp-bar is-sm" aria-hidden="true"><span style={{ width: `${s.pct}%` }} /></span>
                          <em>{s.locked ? 'Not in your plan' : `${s.done}/${s.lectures}`}</em>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      {/* ── One-time purchased: standalone courses, not part of the sequence ── */}
      {!ctx.preview && ONE_TIME_PURCHASES.length > 0 && (
        <>
          <hr className="dx-cp-divider" />
          <div className="dx-cp-group">
            <h2>One-time purchased</h2>
            <span>{ONE_TIME_PURCHASES.length} courses · lifetime access</span>
          </div>
          <ul className="dx-cp-subs dx-cp-once">
            {ONE_TIME_PURCHASES.map((c) => {
              const lectures = courseLectures(c);
              const pillars = coursePillars(c, courseWatched(c));
              return (
                <li key={c.id}>
                  <Link to={`/dashboard/course/${c.id}`} className="dx-cp-sub dx-cp-once-card">
                    <span className="dx-cp-sub-num">Purchased {fmtDate(c.purchased)}</span>
                    <strong>{c.title}</strong>
                    <span className="dx-cp-sub-meta">
                      {c.subjects[0].units.length} units · {lectures.length} lectures · <Clock size={11} /> {hours(lectures.reduce((a, l) => a + l.mins, 0))}
                    </span>
                    <PillarBar parts={pillars.parts} overall={pillars.overall} compact />
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default DashboardContent;
