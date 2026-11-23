import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, CircleCheck, CirclePlay, ClipboardCheck, ListChecks, Lock, Mic, Sparkles } from 'lucide-react';
import {
  TEST_UNLOCK_AT, subjectExtended, subjectInterview, subjectLectures, subjectTests
} from '../data/learnerModules';
import { WORKSPACE_KINDS, practiceForUnit } from '../data/practiceBank';
import { ADDITIONAL_META, stageTests } from '../data/testBank';
import { previewFree } from '../utils/previewAccess';

/* ══════════════════════════════════════════════════════════════
   Overview › What's next — the two most useful next steps for the
   section the learner is in (the first unfinished one, in module
   order), picked from: next lecture, next question to practice, next
   test and the mock interview. Ready steps first. Real progress only.
   ══════════════════════════════════════════════════════════════ */

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/* Everything one section needs, plus whether it's finished */
const sectionState = (ctx, mod, subj) => {
  const { watched, practice, tests } = ctx.progress;
  const isExt = subjectExtended(ctx.extended, mod, subj);
  const lectures = subjectLectures(subj).map((l) => ({ ...l, unit: subj.units.find((u) => u.lectures.includes(l)) }));
  const items = subj.units.flatMap((u) => practiceForUnit(mod, u, isExt).map((p) => ({ ...p, unit: u })));
  const stage = stageTests(mod, subj);
  const extra = subjectTests(mod, subj).map((t) => ({ ...t, id: `${mod.id}:${t.kind}:${t.perSubject ? subj.id : 'module'}` }));
  const allTests = [...stage, ...extra];
  const done = lectures.every((l) => watched[l.id]) && items.every((p) => practice[p.id]) && allTests.every((t) => tests[t.id]?.count > 0);
  return { isExt, lectures, items, stage, extra, done, free: ctx.preview ? previewFree(mod, subj, isExt) : null };
};

const WhatsNext = ({ ctx, mods }) => {
  const { watched, practice, tests, interviews } = ctx.progress;

  // The section to work on: first unfinished one in module order
  let pick = null;
  for (const mod of mods) {
    for (const subj of mod.subjects) {
      const st = sectionState(ctx, mod, subj);
      if (!st.done) { pick = { mod, subj, st }; break; }
    }
    if (pick) break;
  }

  if (!pick) {
    return (
      <section className="dx-card dx-ov-next">
        <div className="dx-ov-card-head"><h3><Sparkles size={16} /> What's next</h3></div>
        <div className="dx-wn-done"><CircleCheck size={22} /><p>You're all caught up.</p><span>Every section's lectures, practice and tests are done.</span></div>
      </section>
    );
  }

  const { mod, subj, st } = pick;
  const base = `/dashboard/m/${mod.id}`;
  const q = `subject=${subj.id}`;
  const where = mod.subjects.length > 1 ? `${mod.title} · ${subj.title}` : mod.title;
  const lockedFor = (id) => !!st.free && !st.free.has(id); // preview: outside the open ~30%
  const tap = (e, id) => { if (lockedFor(id)) { e.preventDefault(); ctx.lockedTap({ ...mod, tier: subj.tier || mod.tier, track: subj.track }); } };

  /* 1. Lecture */
  const lec = st.lectures.find((l) => !watched[l.id]);
  const watchedCount = st.lectures.filter((l) => watched[l.id]).length;

  /* 2. Practice */
  const item = st.items.find((p) => !practice[p.id]);

  /* 3. Test: next stage in order; once all stages are attempted, the next additional test */
  let test = null;
  const stageIdx = st.stage.findIndex((t) => !(tests[t.id]?.count > 0));
  if (stageIdx >= 0) {
    const t = st.stage[stageIdx];
    const unitWatched = t.unit.lectures.filter((l) => watched[l.id]).length;
    const need = Math.ceil(t.unit.lectures.length * TEST_UNLOCK_AT) - unitWatched;
    const free = st.free ? st.free.has(t.id) : null;
    const open = free ?? need <= 0;
    test = { id: t.id, title: t.name, meta: `${t.mins} min`, open, note: open ? 'Ready to launch' : `Watch ${plural(need, 'more lecture', 'more lectures')} of ${t.unit.title}` };
  } else {
    const t = st.extra.find((x) => !(tests[x.id]?.count > 0));
    if (t) {
      const need = Math.ceil(st.lectures.length * TEST_UNLOCK_AT) - watchedCount;
      const open = st.free ? st.free.has(t.id) : need <= 0;
      const meta = ADDITIONAL_META[t.kind] || {};
      test = { id: t.id, title: t.label, meta: `${meta.testType || 'Additional'} · ${t.mins} min`, open, note: open ? 'Ready to launch' : `Watch ${plural(need, 'more lecture', 'more lectures')} of ${subj.title}` };
    }
  }

  /* 4. Mock interview */
  const iv = subjectInterview(mod, subj);
  let mock = null;
  if (iv) {
    const scope = iv.perSubject ? subj.id : 'module';
    const rounds = st.isExt ? 2 : 1;
    const keys = Array.from({ length: rounds }, (_, i) => `${mod.id}:interview:${scope}:${i + 1}`);
    const nextKey = keys.find((k) => !interviews[k]) || keys[0];
    const booked = interviews[nextKey];
    const left = st.lectures.length - watchedCount;
    const open = st.free ? st.free.has(nextKey) : left === 0;
    mock = {
      id: nextKey, title: `${iv.label}${rounds > 1 ? ` · Round ${keys.indexOf(nextKey) + 1}` : ''}`, meta: `${iv.mins} min · live`,
      open, booked, note: booked ? `Booked: ${booked}` : open ? 'Ready to book' : `Unlocks after the section · ${watchedCount}/${st.lectures.length} lectures`
    };
  }

  const blocks = [
    lec && {
      key: 'lecture', kind: 'lecture', Icon: CirclePlay, label: 'Lecture',
      title: lec.title, meta: `${lec.mins} min`, id: lec.id,
      to: `${base}/watch/${lec.id}`, cta: 'Watch', open: true, note: `${watchedCount}/${st.lectures.length} watched in this section`
    },
    item && {
      key: 'practice', kind: 'practice', Icon: ListChecks, label: 'Practice',
      title: item.title, meta: item.level || '', id: item.id,
      to: WORKSPACE_KINDS.includes(item.kind) ? `${base}/practice/${item.id}` : `${base}?tab=practice&${q}`, cta: 'Solve', open: true,
      note: `${st.items.filter((p) => practice[p.id]).length}/${st.items.length} solved`
    },
    test && { key: 'test', kind: 'test', Icon: ClipboardCheck, label: 'Test', ...test, to: `${base}?tab=test&${q}`, cta: test.open ? 'Take test' : 'View' },
    mock && { key: 'mock', kind: 'mock', Icon: Mic, label: 'Interview', ...mock, to: `${base}?tab=interview&${q}`, cta: mock.booked ? 'View' : mock.open ? 'Book' : 'View' }
  ].filter(Boolean);

  // Show two: the first steps that are ready now (in pillar order); waiting ones fill any gap
  const isReady = (b) => b.open && !lockedFor(b.id);
  const shown = [...blocks.filter(isReady), ...blocks.filter((b) => !isReady(b))].slice(0, 2)
    .sort((x, y) => blocks.indexOf(x) - blocks.indexOf(y));

  const pctWatched = st.lectures.length ? Math.round((watchedCount / st.lectures.length) * 100) : 0;
  const firstReady = shown.find((b) => b.open && !lockedFor(b.id));

  return (
    <section className="dx-card dx-ov-next">
      <div className="dx-ov-card-head">
        <h3><Sparkles size={16} /> What's next</h3>
        <Link to={`${base}?${q}`} className="dx-ov-link">Open section</Link>
      </div>
      {/* where you are + one slim progress line (replaces per-item counts) */}
      <div className="dx-wn-where">
        <span className="dx-wn-where-name">{where}</span>
        <span className="dx-wn-where-pct">{watchedCount}/{st.lectures.length} lectures</span>
        <span className="dx-wn-bar" aria-hidden="true"><i style={{ width: `${pctWatched}%` }} /></span>
      </div>
      <ul className="dx-wn-list">
        {shown.map((b) => {
          const locked = lockedFor(b.id);
          const ready = b.open && !locked;
          const sub = locked ? 'Unlock with a plan' : !b.open ? b.note : b.booked ? b.note : [b.label, b.meta].filter(Boolean).join(' · ');
          return (
            <li key={b.key}>
              <Link to={b.to} className={`dx-wn-item ${ready ? '' : 'is-waiting'} ${b === firstReady ? 'is-primary' : ''}`} onClick={(e) => tap(e, b.id)}>
                <span className="dx-wn-icon"><b.Icon size={16} /></span>
                <span className="dx-wn-text">
                  <strong>{b.title}</strong>
                  <span className="dx-wn-meta">{!ready && <Lock size={11} />}{b.booked && <CalendarClock size={11} />}{sub}</span>
                </span>
                <span className="dx-wn-cta">{locked ? <Lock size={14} /> : <>{b.cta} <ArrowRight size={14} /></>}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default WhatsNext;
