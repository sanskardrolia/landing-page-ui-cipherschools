/* ──────────────────────────────────────────────────────────────
   Demo enrollment store (browser localStorage only).
   Written when the demo payment succeeds; the learner dashboard
   only renders when an enrollment exists. Replace with the real
   backend/session check once payments are live.
   ────────────────────────────────────────────────────────────── */

const KEY = 'cs_demo_enrollment';

export const saveEnrollment = (enrollment) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(enrollment));
  } catch {
    /* storage blocked (private mode etc.) — dashboard just won't unlock */
  }
};

export const getEnrollment = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : null;
    return data && data.planId ? data : null;
  } catch {
    return null;
  }
};

export const clearEnrollment = () => {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
};
