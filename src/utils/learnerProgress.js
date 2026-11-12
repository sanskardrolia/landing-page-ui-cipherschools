import { useCallback, useEffect, useState } from 'react';

/* ──────────────────────────────────────────────────────────────
   Demo learner progress (browser localStorage only).
   Shape: { watched: {lectureId: true}, practice: {key: true},
            tests: {key: ISODate}, interviews: {key: slotLabel} }
   Keys are prefixed with the module id so modules never collide.
   Replace with the real progress API when it exists.
   ────────────────────────────────────────────────────────────── */

const KEY = 'cs_demo_progress';
const EMPTY = { watched: {}, practice: {}, tests: {}, interviews: {} };

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
};

export const useLearnerProgress = () => {
  const [progress, setProgress] = useState(read);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* storage blocked */ }
  }, [progress]);

  // toggle(bucket, key) flips a boolean; set(bucket, key, value) stores a value (null removes)
  const toggle = useCallback((bucket, key) => {
    setProgress((p) => {
      const next = { ...p[bucket] };
      if (next[key]) delete next[key];
      else next[key] = true;
      return { ...p, [bucket]: next };
    });
  }, []);

  const set = useCallback((bucket, key, value) => {
    setProgress((p) => {
      const next = { ...p[bucket] };
      if (value == null) delete next[key];
      else next[key] = value;
      return { ...p, [bucket]: next };
    });
  }, []);

  return { progress, toggle, set };
};
