/* ──────────────────────────────────────────────────────────────
   "Experience before you pay": a guest can open the full dashboard
   with everything visible but locked. The flag lives in sessionStorage,
   so it ends with the tab. A real enrollment always wins over preview.
   ────────────────────────────────────────────────────────────── */

const KEY = 'cs_dash_preview';

const SPLASH_KEY = 'cs_dash_preview_splash';

// Entering preview also queues the one-time crack-wall splash
export const startPreview = () => {
  try { sessionStorage.setItem(KEY, '1'); sessionStorage.setItem(SPLASH_KEY, '1'); } catch { /* storage blocked */ }
};
export const wantsSplash = () => {
  try { return sessionStorage.getItem(SPLASH_KEY) === '1'; } catch { return false; }
};
export const clearSplash = () => {
  try { sessionStorage.removeItem(SPLASH_KEY); } catch { /* storage blocked */ }
};
export const endPreview = () => {
  try { sessionStorage.removeItem(KEY); } catch { /* storage blocked */ }
};
export const isPreviewOn = () => {
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
};

// Shown as Ultra so every module and every item (incl. Ultra extras) is on screen
export const PREVIEW_ENROLLMENT = {
  planId: 'compete',
  planName: 'Preview',
  learner: { name: 'Guest' },
  paidAt: new Date().toISOString(),
  preview: true
};

// Empty progress; nothing a guest does is saved
export const PREVIEW_PROGRESS = {
  watched: {}, practice: {}, tests: {}, interviews: {}, activity: {}, mentorCredits: {}, mentorBookings: {}
};

// Plans that include a module, cheapest first (ids as in PLANS_12M_DATA)
export const plansIncluding = (mod) =>
  mod.tier === 'core' ? ['starter', 'plus', 'compete'] : mod.tier === 'plus' ? ['plus', 'compete'] : ['compete'];
