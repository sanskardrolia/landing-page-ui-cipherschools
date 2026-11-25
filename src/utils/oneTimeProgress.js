import { useCallback, useState } from 'react';
import { courseLectures, courseProblems, courseTests } from '../data/oneTimePurchases';

/* ══════════════════════════════════════════════════════════════
   Progress for one-time purchased courses: watched lectures, solved
   problems and test attempts. Kept apart from the subscription's
   progress, so it never counts toward module progress, activity,
   coins or certificates.
   Stored per course; until the learner changes a course, its first
   demoDone / demoSolved / demoTests items show as done (demo data).
   ══════════════════════════════════════════════════════════════ */

const KEY = 'cs_once_progress';
const readAll = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const writeAll = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* storage blocked */ } };

const seed = (course) => {
  const on = (list, n, val = true) => Object.fromEntries(list.slice(0, n || 0).map((x) => [x.id, val]));
  return {
    watched: on(courseLectures(course), course.demoDone),
    solved: on(courseProblems(course), course.demoSolved),
    tests: on(courseTests(course), course.demoTests, { count: 1 })
  };
};

export const courseProgress = (course) => readAll()[course.id] || seed(course);

/* [progress, update(bucket, id, value)] — value false/null removes the entry */
export const useCourseProgress = (course) => {
  const [progress, setState] = useState(() => (course ? courseProgress(course) : { watched: {}, solved: {}, tests: {} }));
  const update = useCallback((bucket, id, value) => {
    if (!course) return;
    setState((prev) => {
      const next = { ...prev, [bucket]: { ...prev[bucket] } };
      if (value) next[bucket][id] = value; else delete next[bucket][id];
      const all = readAll();
      all[course.id] = next;
      writeAll(all);
      return next;
    });
  }, [course]);
  return [progress, update];
};

/* The three pillars (Lectures · Problem · Test), same shape as the module page's pillar bar.
   Overall = the average of the pillars, as on the subscription side. */
export const coursePillars = (course, progress) => {
  const pct = (d, t) => (t ? Math.round((d / t) * 100) : 0);
  const lectures = courseLectures(course);
  const problems = courseProblems(course);
  const tests = courseTests(course);
  const parts = [
    { key: 'lectures', label: 'Lectures', done: lectures.filter((l) => progress.watched[l.id]).length, total: lectures.length },
    { key: 'practice', label: 'Problem', done: problems.filter((p) => progress.solved[p.id]).length, total: problems.length },
    { key: 'tests', label: 'Test', done: tests.filter((t) => progress.tests[t.id]?.count > 0).length, total: tests.length }
  ].filter((x) => x.total > 0).map((x) => ({ ...x, pct: pct(x.done, x.total) }));
  const overall = parts.length ? Math.round(parts.reduce((a, x) => a + x.pct, 0) / parts.length) : 0;
  return { parts, overall };
};
