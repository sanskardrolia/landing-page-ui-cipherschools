import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, CalendarClock, ChevronRight, CircleCheck, Crown, Lock, Sparkles } from 'lucide-react';
import { MODULES, ULTRA_SECTIONS, allLectures, isExtendedPlan } from '../data/learnerModules';
import { practiceForUnit } from '../data/practiceBank';
import { LevelBadge } from './DashboardModuleView';

/* ══════════════════════════════════════════════════════════════
   Ultra extras — /dashboard/ultra/:sectionId
   Ultra extends the Plus modules rather than adding new ones.
   Core / Plus learners see a locked preview with an upgrade CTA;
   Ultra learners get the live lists linking into each module.
   ══════════════════════════════════════════════════════════════ */

const PLUS_MODULES = MODULES.filter((m) => m.tier === 'plus');

const DashboardUltra = ({ ctx }) => {
  const { sectionId } = useParams();
  const { planId, progress } = ctx;
  const section = ULTRA_SECTIONS.find((s) => s.id === sectionId);
  if (!section) return <Navigate to="/dashboard" replace />;

  const unlocked = isExtendedPlan(planId);

  return (
    <div className="dx-module">
      <nav className="dx-crumbs" aria-label="Breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <ChevronRight size={14} />
        <span>Ultra</span>
        <ChevronRight size={14} />
        <span>{section.title}</span>
      </nav>

      <header className="dx-mod-head">
        <span className="dx-mc-icon dx-mc-icon-lg"><Crown size={22} /></span>
        <div className="dx-mod-head-text">
          <h1>
            {section.title}
            {unlocked ? <span className="dx-ext-tag">Ultra</span> : <span className="dx-badge dx-badge-lock"><Lock size={12} /> Ultra</span>}
          </h1>
          <p className="dx-muted">{section.short}</p>
        </div>
      </header>

      {!unlocked && (
        <div className="dx-card dx-ultra-cta">
          <div>
            <h2>Unlock with Ultra</h2>
            <p className="dx-muted dx-small">
              {planId === 'starter'
                ? 'Ultra includes all Plus modules, with higher limits in each of them. Here is what this adds:'
                : 'Ultra keeps everything in your Plus plan and raises the limits in every Plus module. Here is what this adds:'}
            </p>
          </div>
          <Link to="/premium" className="dx-btn dx-btn-primary"><Sparkles size={16} /> Upgrade to Ultra</Link>
        </div>
      )}

      <div className={`dx-ultra-body ${unlocked ? '' : 'preview'}`}>
        {sectionId === 'extended-practice' && <ExtendedPractice unlocked={unlocked} progress={progress} />}
        {sectionId === 'extra-attempts' && <ExtraAttempts unlocked={unlocked} progress={progress} />}
        {sectionId === 'mock-round-2' && <RoundTwo unlocked={unlocked} progress={progress} />}
      </div>
    </div>
  );
};

/* Row link that becomes plain text in the locked preview */
const RowLink = ({ unlocked, to, children }) =>
  unlocked ? <Link to={to} className="dx-prow-title">{children}</Link> : <span className="dx-prow-title dx-prow-locked">{children}</span>;

const ExtendedPractice = ({ unlocked, progress }) => {
  const extraProblems = PLUS_MODULES.flatMap((mod) =>
    mod.subjects.flatMap((s) => s.units.flatMap((u) =>
      practiceForUnit(mod, u, true).filter((i) => i.extended).map((item) => ({ mod, unit: u, item }))
    ))
  );

  return (
    <>
      <section className="dx-block">
        <div className="dx-block-head"><div><h2>Extra Hard problems</h2><p className="dx-muted dx-small">One extra Hard problem in every DSA Advanced unit.</p></div></div>
        <div className="dx-card dx-ptable-wrap dx-ptable-card">
          <table className="dx-ptable">
            <thead><tr>
              <th className="dx-col-status" scope="col"><span className="dx-sr">Status</span></th>
              <th scope="col">Problem Name</th><th scope="col">Unit</th>
              <th scope="col" className="dx-col-level">Level</th><th scope="col" className="dx-col-tags">Company</th>
            </tr></thead>
            <tbody>
              {extraProblems.map(({ mod, unit, item }) => {
                const done = unlocked && progress.practice[item.id];
                return (
                  <tr key={item.id} className={done ? 'done' : ''}>
                    <td className="dx-col-status">{unlocked ? (done ? <CircleCheck size={17} className="dx-done-icon" /> : <span className="dx-dot-empty" />) : <Lock size={14} className="dx-muted" />}</td>
                    <td><RowLink unlocked={unlocked} to={`/dashboard/m/${mod.id}/practice/${item.id}`}>{item.title}</RowLink></td>
                    <td className="dx-muted">{unit.title}</td>
                    <td className="dx-col-level"><LevelBadge level={item.level} /></td>
                    <td className="dx-col-tags"><div className="dx-tags">{(item.companies || []).map((c) => <span key={c} className="dx-tag">{c}</span>)}</div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

    </>
  );
};

const ExtraAttempts = ({ unlocked, progress }) => (
  <div className="dx-ultra-grid">
    {PLUS_MODULES.filter((m) => m.tests.length).flatMap((mod) => mod.tests.map((t) => {
      const used = progress.tests[`${mod.id}:${t.kind}:module`]?.count || 0;
      return (
        <div key={`${mod.id}-${t.kind}`} className="dx-card dx-ultra-item">
          <span className="dx-muted dx-small">{mod.title}</span>
          <h3>{t.label}</h3>
          <p className="dx-ultra-limit"><s>1</s> <ArrowRight size={13} /> <strong>2</strong> attempts</p>
          {unlocked && (
            <>
              <p className="dx-muted dx-small">{used}/2 used</p>
              <Link to={`/dashboard/m/${mod.id}?tab=test`} className="dx-mini-link">Go to test <ArrowRight size={13} /></Link>
            </>
          )}
        </div>
      );
    }))}
  </div>
);

const RoundTwo = ({ unlocked, progress }) => (
  <div className="dx-ultra-grid">
    {PLUS_MODULES.map((mod) => {
      const lectures = allLectures(mod);
      const watched = lectures.filter((l) => progress.watched[l.id]).length;
      const complete = watched === lectures.length;
      const booked = progress.interviews[`${mod.id}:interview:module:2`];
      return (
        <div key={mod.id} className="dx-card dx-ultra-item">
          <span className="dx-muted dx-small">{mod.title}</span>
          <h3>{mod.interview.label} · Round 2</h3>
          <p className="dx-muted dx-small">{mod.interview.mins} min with an interviewer</p>
          {unlocked && (
            booked ? (
              <p className="dx-small dx-inline"><CalendarClock size={14} className="dx-done-icon" /> Booked: {booked}</p>
            ) : (
              <>
                <p className="dx-muted dx-small">{complete ? 'Ready to book' : `Unlocks after the module — ${watched}/${lectures.length} lectures watched`}</p>
                <Link to={`/dashboard/m/${mod.id}?tab=interview`} className="dx-mini-link">Go to mock interview <ArrowRight size={13} /></Link>
              </>
            )
          )}
        </div>
      );
    })}
  </div>
);

export default DashboardUltra;
