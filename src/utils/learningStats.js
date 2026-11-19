import { allLectures, moduleUnlocked, subjectExtended, subjectInterview, subjectTests } from '../data/learnerModules';
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
    // Ultra's higher limits apply per subject (DSA Advanced yes, Basics no), as on the module page
    const extOf = (subj) => subjectExtended(extended, mod, subj);

    allLectures(mod).forEach((l) => tick(s.lectures, progress.watched[l.id]));

    mod.subjects.forEach((subj) => {
      subj.units.forEach((unit) => {
        practiceForUnit(mod, unit, extOf(subj)).forEach((p) => {
          const done = !!progress.practice[p.id];
          tick(s.practice, done);
          tick(WORKSPACE_KINDS.includes(p.kind) ? s.practice.coding : s.practice.mcq, done);
        });
      });
      stageTests(mod, subj).forEach((t) => tick(s.tests, progress.tests[t.id]?.count > 0));
    });

    // Additional tests: a subject's own list, else the module's; per subject when `perSubject`
    const counted = new Set();
    mod.subjects.forEach((subj) => {
      subjectTests(mod, subj).forEach((t) => {
        const id = `${mod.id}:${t.kind}:${t.perSubject ? subj.id : 'module'}`;
        if (counted.has(id)) return;
        counted.add(id);
        tick(s.tests, progress.tests[id]?.count > 0);
      });
    });

    // Mock interviews: a section's own, else the module's; one per section when `perSubject`
    const scopes = new Map();
    mod.subjects.forEach((x) => {
      const iv = subjectInterview(mod, x);
      if (!iv) return;
      const id = iv.perSubject ? x.id : 'module';
      scopes.set(id, (scopes.get(id) || false) || extOf(x));
    });
    scopes.forEach((ext, id) => {
      for (let r = 1; r <= (ext ? 2 : 1); r++) tick(s.interviews, progress.interviews[`${mod.id}:interview:${id}:${r}`]);
    });
  });

  return s;
};
