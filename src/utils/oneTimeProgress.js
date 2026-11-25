import { useCallback, useState } from 'react';
import { courseLectures } from '../data/oneTimePurchases';

/* ══════════════════════════════════════════════════════════════
   Watched lectures for one-time purchased courses. Kept apart from
   the subscription's progress, so they never count toward module
   progress, activity, coins or certificates.
   Stored per course; until the learner changes a course, its first
   `demoDone` lectures show as watched (demo data).
   ══════════════════════════════════════════════════════════════ */

const KEY = 'cs_once_watched';
const readAll = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const writeAll = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* storage blocked */ } };

export const courseWatched = (course) => {
  const saved = readAll()[course.id];
  if (saved) return saved;
  return Object.fromEntries(courseLectures(course).slice(0, course.demoDone || 0).map((l) => [l.id, true]));
};

export const useCourseWatched = (course) => {
  const [watched, setState] = useState(() => (course ? courseWatched(course) : {}));
  const setWatched = useCallback((lectureId, value) => {
    if (!course) return;
    setState((prev) => {
      const next = { ...prev };
      if (value) next[lectureId] = true; else delete next[lectureId];
      const all = readAll();
      all[course.id] = next;
      writeAll(all);
      return next;
    });
  }, [course]);
  return [watched, setWatched];
};

/* The three pillars (Lectures · Problem · Test), same shape as the module page's pillar bar.
   Overall = the average of the pillars, as on the subscription side. */
export const coursePillars = (course, watched) => {
  const lectures = courseLectures(course);
  const pct = (d, t) => (t ? Math.round((d / t) * 100) : 0);
  const parts = [
    { key: 'lectures', label: 'Lectures', done: lectures.filter((l) => watched[l.id]).length, total: lectures.length },
    { key: 'practice', label: 'Problem', done: course.problems?.[0] || 0, total: course.problems?.[1] || 0 },
    { key: 'tests', label: 'Test', done: course.tests?.[0] || 0, total: course.tests?.[1] || 0 }
  ].filter((x) => x.total > 0).map((x) => ({ ...x, pct: pct(x.done, x.total) }));
  const overall = parts.length ? Math.round(parts.reduce((a, x) => a + x.pct, 0) / parts.length) : 0;
  return { parts, overall };
};
