import { allLectures, moduleUnlocked } from '../data/learnerModules';
import { WORKSPACE_KINDS, practiceForUnit } from '../data/practiceBank';
import { stageTests } from '../data/testBank';

/* ──────────────────────────────────────────────────────────────
   Dashboard "Learning Progress": done / total for the four things a
   learner does, across the modules their plan unlocks. Ids match the
   ones the module pages write into progress (see DashboardModuleView).
   ────────────────────────────────────────────────────────────── */

export const learningStats = (modules, { planId, devTrack, extended, progress }) => {
  const s = {
    lectures: { done: 0, total: 0 },
    practice: { done: 0, total: 0, coding: { done: 0, total: 0 }, mcq: { done: 0, total: 0 } },
    tests: { done: 0, total: 0 },
    interviews: { done: 0, total: 0 }
  };
  const tick = (bucket, isDone) => { bucket.total += 1; if (isDone) bucket.done += 1; };

  modules.filter((m) => moduleUnlocked(m, planId, devTrack)).forEach((mod) => {
    const isExt = extended && mod.tier !== 'core'; // Ultra's higher limits, as on the module page

    allLectures(mod).forEach((l) => tick(s.lectures, progress.watched[l.id]));

    mod.subjects.forEach((subj) => {
      subj.units.forEach((unit) => {
        practiceForUnit(mod, unit, isExt).forEach((p) => {
          const done = !!progress.practice[p.id];
          tick(s.practice, done);
          tick(WORKSPACE_KINDS.includes(p.kind) ? s.practice.coding : s.practice.mcq, done);
        });
      });
      stageTests(mod, subj).forEach((t) => tick(s.tests, progress.tests[t.id]?.count > 0));
    });

    // Module-wide tests: one per subject when `perSubject`, else one for the module
    mod.tests.forEach((t) => {
      const scopes = t.perSubject ? mod.subjects.map((x) => x.id) : ['module'];
      scopes.forEach((id) => tick(s.tests, progress.tests[`${mod.id}:${t.kind}:${id}`]?.count > 0));
    });

    if (mod.interview) {
      const scopes = mod.interview.perSubject ? mod.subjects.map((x) => x.id) : ['module'];
      const rounds = isExt ? 2 : 1;
      scopes.forEach((id) => {
        for (let r = 1; r <= rounds; r++) tick(s.interviews, progress.interviews[`${mod.id}:interview:${id}:${r}`]);
      });
    }
  });

  return s;
};
