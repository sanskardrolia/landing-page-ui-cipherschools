import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, CirclePlay, ClipboardCheck, Clock, Layers, ListChecks, Mic, PartyPopper, ShieldCheck, Sparkles, Timer, X } from 'lucide-react';
import ModuleIcon from '../components/ModuleIcon';
import {
  moduleUnlocked, subjectExtended, subjectInterview, subjectLectures, subjectTests
} from '../data/learnerModules';
import { WORKSPACE_KINDS, practiceForUnit } from '../data/practiceBank';
import { ADDITIONAL_META, stageTests } from '../data/testBank';

/* ══════════════════════════════════════════════════════════════
   Next-step pop-ups, per section (a module with one section = the module):
   1. every lecture watched        → "Practice now"  (practice meta)
   2. every practice item solved   → "Take the test" (test meta)
   3. lectures + practice + tests  → "Book your mock interview"
   Each shows once. Milestones already reached when this first runs
   are recorded silently, so old progress doesn't fire a burst.
   ══════════════════════════════════════════════════════════════ */

const KEY = 'cs_dash_milestones';
const STEPS = [
  { id: 'lectures', label: 'Lectures', Icon: CirclePlay },
  { id: 'practice', label: 'Practice', Icon: ListChecks },
  { id: 'tests', label: 'Tests', Icon: ClipboardCheck },
  { id: 'mock', label: 'Mock', Icon: Mic }
];
const PRACTICE_MINS = { coding: 25, debugging: 20, sql: 15, vibe: 30, mcq: 10, lab: 25, sd: 30, project: 45, speaking: 10, company: 30 };

const fmtMins = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m} min`);

/* Status of one section across the four pillars */
const sectionStatus = (ctx, mod, subj) => {
  const isExt = subjectExtended(ctx.extended, mod, subj);
  const { watched, practice, tests } = ctx.progress;
  const lectures = subjectLectures(subj);
  const items = subj.units.flatMap((u) => practiceForUnit(mod, u, isExt).map((p) => ({ ...p, unit: u })));
  const stage = stageTests(mod, subj);
  const extra = subjectTests(mod, subj).map((t) => ({ ...t, id: `${mod.id}:${t.kind}:${t.perSubject ? subj.id : 'module'}` }));
  const iv = subjectInterview(mod, subj);
  const lecturesDone = lectures.length > 0 && lectures.every((l) => watched[l.id]);
  const practiceDone = items.every((p) => practice[p.id]);
  const testsDone = [...stage, ...extra].every((t) => tests[t.id]?.count > 0);
  return { isExt, lectures, items, stage, extra, iv, lecturesDone, practiceDone, testsDone };
};

/* Milestones reached right now, in the order they should be offered */
const reached = (ctx) => {
  const out = [];
  ctx.modules.filter((m) => moduleUnlocked(m, ctx.planId, ctx.devTrack)).forEach((mod) => {
    mod.subjects.forEach((subj) => {
      const s = sectionStatus(ctx, mod, subj);
      const base = `${mod.id}:${subj.id}`;
      const testCount = s.stage.length + s.extra.length;
      if (s.lecturesDone && s.items.length) out.push({ key: `${base}:practice`, step: 'practice', mod, subj, s });
      if (s.lecturesDone && s.practiceDone && testCount) out.push({ key: `${base}:tests`, step: 'tests', mod, subj, s });
      if (s.lecturesDone && s.practiceDone && s.testsDone && s.iv) out.push({ key: `${base}:mock`, step: 'mock', mod, subj, s });
    });
  });
  return out;
};

const readSeen = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : null; } catch { return null; } };
const writeSeen = (set) => { try { localStorage.setItem(KEY, JSON.stringify([...set])); } catch { /* storage blocked */ } };

const DashboardNextStep = ({ ctx }) => {
  const navigate = useNavigate();
  // First run: everything already reached counts as seen (no burst of old pop-ups)
  const [seen, setSeen] = useState(() => {
    if (ctx.preview) return new Set();
    const saved = readSeen();
    if (saved) return new Set(saved);
    const initial = new Set(reached(ctx).map((m) => m.key));
    writeSeen(initial);
    return initial;
  });

  if (ctx.preview) return null;
  const next = reached(ctx).find((m) => !seen.has(m.key));
  if (!next) return null;

  const { mod, subj, s, step } = next;
  const where = mod.subjects.length > 1 ? `${mod.title} · ${subj.title}` : mod.title;
  const tab = { practice: 'practice', tests: 'test', mock: 'interview' }[step];

  const close = () => setSeen((prev) => { const n = new Set(prev); n.add(next.key); writeSeen(n); return n; });
  const go = () => { close(); navigate(`/dashboard/m/${mod.id}?tab=${tab}&subject=${subj.id}`); };

  const done = { lectures: s.lecturesDone, practice: s.lecturesDone && s.practiceDone, tests: s.lecturesDone && s.practiceDone && s.testsDone, mock: false };
  const current = step === 'tests' ? 'tests' : step;

  let copy;
  if (step === 'practice') {
    const problems = s.items.filter((p) => WORKSPACE_KINDS.includes(p.kind)).length;
    const sets = s.items.length - problems;
    const levels = ['Easy', 'Medium', 'Hard'].map((l) => [l, s.items.filter((p) => p.level === l).length]).filter(([, n]) => n);
    const mins = s.items.reduce((a, p) => a + (PRACTICE_MINS[p.kind] || 15), 0);
    copy = {
      Icon: PartyPopper,
      kicker: 'Lectures complete',
      title: 'Time to practice',
      body: `You've watched every lecture in ${where}. Lock it in with practice while it's fresh.`,
      meta: [
        { Icon: ListChecks, label: [problems && `${problems} problem${problems === 1 ? '' : 's'}`, sets && `${sets} set${sets === 1 ? '' : 's'}`].filter(Boolean).join(' · ') },
        { Icon: Layers, label: levels.map(([l, n]) => `${n} ${l}`).join(' · ') || 'Mixed levels' },
        { Icon: Clock, label: `≈ ${fmtMins(mins)} in total` }
      ],
      list: s.items.slice(0, 3).map((p) => ({ title: p.title, side: p.level || p.unit.title })),
      cta: 'Start practice'
    };
  } else if (step === 'tests') {
    const all = [...s.stage, ...s.extra];
    const mins = all.reduce((a, t) => a + (t.mins || 0), 0);
    const formats = [...new Set([...s.stage.map((t) => t.format), ...s.extra.map((t) => (ADDITIONAL_META[t.kind] || {}).format).filter(Boolean)])];
    copy = {
      Icon: Sparkles,
      kicker: 'Practice complete',
      title: 'Take the test',
      body: `Every practice item in ${where} is solved. Show what you know in the proctored tests.`,
      meta: [
        { Icon: ClipboardCheck, label: `${s.stage.length} unit test${s.stage.length === 1 ? '' : 's'}${s.extra.length ? ` · ${s.extra.length} additional` : ''}` },
        { Icon: Timer, label: `≈ ${fmtMins(mins)} in total` },
        { Icon: ShieldCheck, label: `Proctored · ${formats.join(', ') || 'MCQ'}` }
      ],
      list: all.slice(0, 3).map((t) => ({ title: t.name || t.label, side: `${t.mins} min` })),
      cta: 'Go to tests'
    };
  } else {
    const rounds = s.isExt ? 2 : 1;
    copy = {
      Icon: PartyPopper,
      kicker: 'Lectures, practice & tests complete',
      title: 'Book your mock interview',
      body: `You've finished all three pillars of ${where}. A live mock interview is the last step.`,
      meta: [
        { Icon: Mic, label: `${s.iv.label}${rounds > 1 ? ` · ${rounds} rounds` : ''}` },
        { Icon: Clock, label: `${s.iv.mins} min with an interviewer` },
        { Icon: Sparkles, label: 'Detailed feedback after each round' }
      ],
      list: null,
      cta: 'Book mock interview'
    };
  }

  return (
    <div className="dx-ns-backdrop" onClick={close} data-free>
      <div className="dx-ns" role="dialog" aria-modal="true" aria-labelledby="dx-ns-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="dx-icon-btn dx-ns-close" onClick={close} aria-label="Close"><X size={18} /></button>

        <div className="dx-ns-head">
          <span className="dx-ns-badge"><copy.Icon size={22} /></span>
          <span className="dx-ns-kicker">{copy.kicker}</span>
          <h2 id="dx-ns-title">{copy.title}</h2>
          <p className="dx-ns-where"><span className="dx-mc-icon"><ModuleIcon mod={mod} size={14} /></span> {where}</p>
          <p className="dx-ns-body">{copy.body}</p>
        </div>

        <ol className="dx-ns-steps" aria-label="Progress in this section">
          {STEPS.map((st) => {
            const isDone = done[st.id];
            const isNow = st.id === current;
            return (
              <li key={st.id} className={`${isDone ? 'is-done' : ''} ${isNow ? 'is-now' : ''}`}>
                <span className="dx-ns-dot">{isDone ? <Check size={13} /> : <st.Icon size={13} />}</span>
                <span>{st.label}</span>
              </li>
            );
          })}
        </ol>

        <ul className="dx-ns-meta">
          {copy.meta.map((m) => <li key={m.label}><m.Icon size={15} /> {m.label}</li>)}
        </ul>

        {copy.list && (
          <ul className="dx-ns-list">
            {copy.list.map((x) => <li key={x.title}><span>{x.title}</span><em>{x.side}</em></li>)}
          </ul>
        )}

        <div className="dx-ns-actions">
          <button type="button" className="dx-btn dx-btn-ghost" onClick={close}>Later</button>
          <button type="button" className="dx-btn dx-btn-primary" onClick={go}>{copy.cta} <ArrowRight size={15} /></button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNextStep;
