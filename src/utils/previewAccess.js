import { MODULES, subjectExtended, subjectInterview, subjectLectures, subjectTests } from '../data/learnerModules';
import { practiceForUnit } from '../data/practiceBank';
import { stageTests } from '../data/testBank';

/* ──────────────────────────────────────────────────────────────
   "Experience before you pay": what a guest sees and can try.
   • Only three modules: DSA, Development and System Design.
   • In every section, the first ~30% of each of the four pillars is
     open — lectures, practice, tests (unit + additional) and mock
     interview rounds. The rest stays locked and asks for a plan.
   Ids match the ones the module pages use, so the same checks work
   on the module page, the lecture player and the coding workspace.
   ────────────────────────────────────────────────────────────── */

export const PREVIEW_SHARE = 0.3;

const firstShare = (list) => list.slice(0, Math.ceil(list.length * PREVIEW_SHARE));

/* DSA (Basics + Advanced), Development (MERN + JFS) and System Design on its own
   (the System Design section of Beyond Development, shown as its own module) */
export const previewModules = () => MODULES.flatMap((m) => {
  if (m.id === 'dsa' || m.id === 'development') return [m];
  if (m.id === 'beyond-development') {
    const sd = m.subjects.find((s) => s.id === 'system-design');
    return sd ? [{ ...m, title: 'System Design', short: sd.short || m.short, subjects: [sd], practice: sd.practice || m.practice }] : [];
  }
  return [];
});

/* Ids open to try in one section: lectures, practice items, unit tests,
   additional tests and mock-interview round keys */
export const previewFree = (mod, subject, isExt) => {
  const ids = new Set();
  const add = (list) => firstShare(list).forEach((id) => ids.add(id));

  add(subjectLectures(subject).map((l) => l.id));
  add(subject.units.flatMap((u) => practiceForUnit(mod, u, isExt)).map((p) => p.id));
  add(stageTests(mod, subject).map((t) => t.id));
  add(subjectTests(mod, subject).map((t) => `${mod.id}:${t.kind}:${t.perSubject ? subject.id : 'module'}`));

  const iv = subjectInterview(mod, subject);
  if (iv) {
    const scope = iv.perSubject ? subject.id : 'module';
    add(Array.from({ length: isExt ? 2 : 1 }, (_, i) => `${mod.id}:interview:${scope}:${i + 1}`));
  }
  return ids;
};

/* Every open id across a module (for the lecture player and coding workspace) */
export const previewFreeInModule = (mod, extended) => {
  const ids = new Set();
  mod.subjects.forEach((s) => previewFree(mod, s, subjectExtended(extended, mod, s)).forEach((id) => ids.add(id)));
  return ids;
};
