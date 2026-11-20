import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, CircleCheck, CirclePlay, ClipboardCheck, ListChecks, Mic, X } from 'lucide-react';
import ModuleIcon from '../components/ModuleIcon';
import {
  allLectures, subjectExtended, subjectInterview, subjectTests
} from '../data/learnerModules';
import { WORKSPACE_KINDS, practiceForUnit } from '../data/practiceBank';
import { ADDITIONAL_META, stageTests } from '../data/testBank';

/* ══════════════════════════════════════════════════════════════
   Activity › month › module tag → what exactly was done; every row
   has its own action: Watch / Rewatch, Solve / Solve again,
   Take / Retake, Book / View.
   Items come from the activity log's recorded ids; older / sample
   activity (counts only) is filled from the module's own content.
   ══════════════════════════════════════════════════════════════ */

const KIND_META = {
  lecture: { label: 'Lectures', verb: 'Watched', Icon: CirclePlay, color: '#E8801A', tab: 'watch' },
  practice: { label: 'Practice', verb: 'Practised', Icon: ListChecks, color: '#3B82F6', tab: 'practice' },
  test: { label: 'Tests', verb: 'Attempted', Icon: ClipboardCheck, color: '#10B981', tab: 'test' },
  interview: { label: 'Mock interviews', verb: 'Booked', Icon: Mic, color: '#A855F7', tab: 'interview' }
};
const SHOW = 8;
const hash = (str) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/* Where each item opens, and what the action says (done vs not yet) */
const itemCta = (mod, kind, x) => {
  const base = `/dashboard/m/${mod.id}`;
  if (kind === 'lecture') return { to: `${base}/watch/${x.id}`, action: x.done ? 'Rewatch' : 'Watch' };
  if (kind === 'practice') {
    const to = WORKSPACE_KINDS.includes(x.item.kind) ? `${base}/practice/${x.id}` : `${base}?tab=practice&subject=${x.subj.id}&unit=${x.unit.id}`;
    return { to, action: x.done ? 'Solve again' : 'Solve' };
  }
  if (kind === 'test') return { to: `${base}?tab=test&subject=${x.subj.id}`, action: x.done ? 'Retake' : 'Take' };
  return { to: `${base}?tab=interview&subject=${x.subj.id}`, action: x.done ? 'View' : 'Book' };
};

/* Everything of one kind in a module, in course order, with what to show for it */
const poolFor = (ctx, mod, kind) => {
  const out = [];
  mod.subjects.forEach((subj) => {
    const isExt = subjectExtended(ctx.extended, mod, subj);
    const where = mod.subjects.length > 1 ? subj.title : null;
    if (kind === 'lecture') {
      subj.units.forEach((u) => u.lectures.forEach((l) => out.push({ id: l.id, title: l.title, sub: [where, u.title].filter(Boolean).join(' · '), meta: `${l.mins} min`, done: !!ctx.progress.watched[l.id], subj, unit: u })));
    } else if (kind === 'practice') {
      subj.units.forEach((u) => practiceForUnit(mod, u, isExt).forEach((p) => out.push({ id: p.id, title: p.title, sub: [where, u.title].filter(Boolean).join(' · '), meta: p.level || '', done: !!ctx.progress.practice[p.id], item: p, unit: u, subj })));
    } else if (kind === 'test') {
      stageTests(mod, subj).forEach((t) => out.push({ id: t.id, title: t.name, sub: [where, t.testType].filter(Boolean).join(' · '), meta: `${t.mins} min`, done: ctx.progress.tests[t.id]?.count > 0, stage: t, subj }));
      subjectTests(mod, subj).forEach((t) => {
        const id = `${mod.id}:${t.kind}:${t.perSubject ? subj.id : 'module'}`;
        out.push({ id, title: t.label, sub: [where, (ADDITIONAL_META[t.kind] || {}).testType || 'Additional'].filter(Boolean).join(' · '), meta: `${t.mins} min`, done: ctx.progress.tests[id]?.count > 0, extra: t, subj });
      });
    } else if (kind === 'interview') {
      const iv = subjectInterview(mod, subj);
      if (!iv) return;
      const scope = iv.perSubject ? subj.id : 'module';
      const rounds = isExt ? 2 : 1;
      for (let r = 1; r <= rounds; r++) {
        const id = `${mod.id}:interview:${scope}:${r}`;
        const booked = ctx.progress.interviews[id];
        out.push({ id, title: `${iv.label}${rounds > 1 ? ` · Round ${r}` : ''}`, sub: where || mod.title, meta: booked || `${iv.mins} min`, done: !!booked, subj });
      }
    }
  });
  // one entry per id (module-wide tests/interviews repeat across sections)
  return out.filter((x, i) => out.findIndex((y) => y.id === x.id) === i).map((x) => ({ ...x, ...itemCta(mod, kind, x) }));
};

const DashboardActivityDetail = ({ ctx, mod, kind, monthKey, monthLabel, count, dayItems, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const meta = KIND_META[kind];
  const pool = poolFor(ctx, mod, kind);
  // Recorded ids first (newest last in the log); then fill from course order for count-only activity
  const recorded = [...new Set(dayItems)].map((id) => pool.find((x) => x.id === id)).filter(Boolean);
  const want = Math.min(count, pool.length);
  const fill = [];
  if (pool.length && recorded.length < want) {
    const start = hash(`${monthKey}:${mod.id}:${kind}`) % pool.length;
    for (let i = 0; fill.length < want - recorded.length && i < pool.length; i++) {
      const x = pool[(start + i) % pool.length];
      if (!recorded.includes(x)) fill.push(x);
    }
  }
  fill.sort((a, b) => pool.indexOf(a) - pool.indexOf(b)); // read in course order
  const items = [...recorded.reverse(), ...fill];
  const shown = items.slice(0, SHOW);
  const allLecs = allLectures(mod).length;

  return (
    <div className="dx-ad-backdrop" onClick={onClose}>
      <div className="dx-ad" role="dialog" aria-modal="true" aria-labelledby="dx-ad-title" onClick={(e) => e.stopPropagation()} style={{ '--k': meta.color }}>
        <header className="dx-ad-head">
          <span className="dx-ad-icon"><ModuleIcon mod={mod} size={18} /></span>
          <div className="dx-ad-titles">
            <h2 id="dx-ad-title">{mod.title}</h2>
            <p><span className="dx-ad-kind"><meta.Icon size={13} /> {meta.label}</span> · {monthLabel}</p>
          </div>
          <button type="button" className="dx-icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>

        <p className="dx-ad-sum"><strong>{count}</strong> {meta.verb.toLowerCase()} this month{kind === 'lecture' ? ` · ${allLecs} lectures in the module` : ''}</p>

        <ul className="dx-ad-list">
          {shown.map((x) => (
            <li key={x.id}>
              <Link to={x.to} className="dx-ad-row" onClick={onClose} aria-label={`${x.action}: ${x.title}`}>
                <span className={`dx-ad-dot ${x.done ? 'is-done' : ''}`}>{x.done ? <CircleCheck size={15} /> : kind === 'interview' ? <CalendarClock size={15} /> : <meta.Icon size={15} />}</span>
                <span className="dx-ad-text"><strong>{x.title}</strong><small>{x.sub}{x.meta ? ` · ${x.meta}` : ''}</small></span>
                <span className="dx-ad-go">{x.action} <ArrowRight size={14} /></span>
              </Link>
            </li>
          ))}
        </ul>
        {items.length > SHOW && <p className="dx-ad-more">and {items.length - SHOW} more</p>}

        <Link to={`/dashboard/m/${mod.id}?tab=${meta.tab}`} className="dx-ad-open" onClick={onClose}>Open {meta.label.toLowerCase()} in {mod.title}</Link>
      </div>
    </div>
  );
};

export default DashboardActivityDetail;
