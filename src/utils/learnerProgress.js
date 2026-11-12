import { useCallback, useEffect, useState } from 'react';
import { MODULES, allLectures } from '../data/learnerModules';

/* ──────────────────────────────────────────────────────────────
   Demo learner progress (browser localStorage only).
   Shape: { watched:    {lectureId: true},
            practice:   {itemId: true},
            tests:      {key: {count, last}},
            interviews: {key: slotLabel},
            mentorCredits:  {purchaseId: credits},   mentorBookings: {id: {focus, slot, agenda}},
            activity:   {'YYYY-MM-DD': {lecture, practice, test, interview,
                                         mods: {'lecture|dsa': n, …}}} }
   Keys are prefixed with the module id so modules never collide.
   `activity` is a dated log that powers the heatmap; it only grows
   from the moment it was added (older progress has no dates).
   Replace with the real progress API when it exists.
   ────────────────────────────────────────────────────────────── */

const KEY = 'cs_demo_progress';
const EMPTY = { watched: {}, practice: {}, tests: {}, interviews: {}, activity: {}, mentorCredits: {}, mentorBookings: {} };

// Which heatmap category each progress bucket counts towards
const BUCKET_KIND = { watched: 'lecture', practice: 'practice', tests: 'test', interviews: 'interview' };

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
};

// Module an event belongs to. Lecture ids carry no module prefix, so look them up;
// every other key starts with the module id ("dsa--arrays--0", "dsa:ai:module" …).
let lectureModule = null;
const moduleOf = (bucket, key) => {
  if (bucket === 'watched') {
    if (!lectureModule) {
      lectureModule = {};
      MODULES.forEach((m) => allLectures(m).forEach((l) => { lectureModule[l.id] = m.id; }));
    }
    return lectureModule[key] || null;
  }
  return String(key).split(/--|:/)[0] || null;
};

// Add one event of `bucket`'s kind to today's activity, attributed to its module
const logActivity = (activity, bucket, key) => {
  const kind = BUCKET_KIND[bucket];
  if (!kind) return activity;
  const today = dayKey();
  const day = { ...(activity?.[today] || {}) };
  day[kind] = (day[kind] || 0) + 1;
  const mod = moduleOf(bucket, key);
  if (mod) {
    const tag = `${kind}|${mod}`;
    day.mods = { ...(day.mods || {}), [tag]: (day.mods?.[tag] || 0) + 1 };
  }
  return { ...activity, [today]: day };
};

export const useLearnerProgress = () => {
  const [progress, setProgress] = useState(read);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* storage blocked */ }
  }, [progress]);

  // toggle(bucket, key) flips a boolean; turning it on is logged as activity
  const toggle = useCallback((bucket, key) => {
    setProgress((p) => {
      const next = { ...p[bucket] };
      const adding = !next[key];
      if (adding) next[key] = true;
      else delete next[key];
      return { ...p, [bucket]: next, activity: adding ? logActivity(p.activity, bucket, key) : p.activity };
    });
  }, []);

  // set(bucket, key, value) stores a value (null removes). Every submission, test attempt
  // and booking is logged; a lecture only counts the first time it becomes watched.
  const set = useCallback((bucket, key, value) => {
    setProgress((p) => {
      const next = { ...p[bucket] };
      const already = !!next[key];
      if (value == null) delete next[key];
      else next[key] = value;
      const log = value != null && !(bucket === 'watched' && already);
      return { ...p, [bucket]: next, activity: log ? logActivity(p.activity, bucket, key) : p.activity };
    });
  }, []);

  return { progress, toggle, set };
};
