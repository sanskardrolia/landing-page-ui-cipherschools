import { dayKey } from './learnerProgress';

/* ──────────────────────────────────────────────────────────────
   DEMO ONLY: a year of sample learning activity so the Activity
   heatmap and timeline have something to show on every plan.
   It is generated from the plan's own modules, seeded per plan
   (same data on every visit), merged in at display time and never
   saved. Real activity is added on top.

   Turn off before launch: set SHOW_DEMO_ACTIVITY to false.
   ────────────────────────────────────────────────────────────── */

export const SHOW_DEMO_ACTIVITY = true;

// How busy each plan's sample learner is
const PROFILE = {
  starter: { active: 0.42, keep: 0.68, streak: 6 },
  plus: { active: 0.5, keep: 0.74, streak: 11 },
  compete: { active: 0.58, keep: 0.8, streak: 18 },
  preview: { active: 0.5, keep: 0.74, streak: 9 } // "Experience before you pay" sample learner
};

const seeded = (s) => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
const seedOf = (str) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 2147483647, 7) || 1;

const DAYS = 365;

const cache = new Map();

/* `modules`: the modules this plan includes (as the sidebar lists them) */
export const demoActivity = (planId, modules) => {
  const key = `${planId}:${modules.map((m) => m.id).join(',')}`;
  if (cache.has(key)) return cache.get(key);

  const rnd = seeded(seedOf(key));
  const prof = PROFILE[planId] || PROFILE.starter;
  const pick = (list) => list[Math.floor(rnd() * list.length)];
  const between = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));

  // DSA and fundamentals get practised more; any module can show up in a day
  const practiceMods = modules.filter((m) => m.practice?.length);
  const weighted = (list) => list.flatMap((m) => (m.id === 'dsa' ? [m, m, m] : m.tier === 'core' ? [m, m] : [m]));
  const lectureBag = weighted(modules);
  const practiceBag = weighted(practiceMods.length ? practiceMods : modules);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out = {};
  let wasActive = false;

  for (let back = DAYS - 1; back >= 0; back--) {
    const d = new Date(today);
    d.setDate(d.getDate() - back);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const ramp = Math.min(1, 0.35 + (DAYS - back) / 160); // quieter in the first few months
    const chance = (wasActive ? prof.keep : prof.active) * ramp * (weekend ? 0.7 : 1);
    const active = back < prof.streak || rnd() < chance; // ends on a current streak
    wasActive = active;
    if (!active) continue;

    const day = { mods: {} };
    const add = (kind, mod, n) => {
      day[kind] = (day[kind] || 0) + n;
      const tag = `${kind}|${mod.id}`;
      day.mods[tag] = (day.mods[tag] || 0) + n;
    };

    if (rnd() < 0.75) add('lecture', pick(lectureBag), between(1, 4));
    if (rnd() < 0.2) add('lecture', pick(lectureBag), between(1, 2));
    if (rnd() < 0.6) add('practice', pick(practiceBag), between(1, 6));
    if (rnd() < 0.1) add('test', pick(modules), 1);
    if (rnd() < 0.03) add('interview', pick(modules), 1);
    if (!day.lecture && !day.practice) add('lecture', pick(lectureBag), 1);

    out[dayKey(d)] = day;
  }

  cache.set(key, out);
  return out;
};

/* Real activity + sample activity, summed per day */
export const withDemoActivity = (real = {}, demo = {}) => {
  const merged = { ...demo };
  Object.entries(real).forEach(([k, day]) => {
    const base = merged[k] || { mods: {} };
    const next = { ...base, mods: { ...(base.mods || {}) } };
    Object.entries(day).forEach(([field, v]) => {
      if (field === 'mods') {
        Object.entries(v || {}).forEach(([tag, n]) => { next.mods[tag] = (next.mods[tag] || 0) + n; });
      } else {
        next[field] = (next[field] || 0) + v;
      }
    });
    merged[k] = next;
  });
  return merged;
};

/* ──────────────────────────────────────────────────────────────
   DEMO ONLY: sample numbers for the dashboard's Learning Progress,
   so its meters aren't empty on a fresh account. Each value is the
   larger of the learner's real progress and the plan's sample share
   of the real total, so real progress still shows once it passes.
   Turn off before launch: set SHOW_DEMO_PROGRESS to false.
   ────────────────────────────────────────────────────────────── */

export const SHOW_DEMO_PROGRESS = true;

// Share of each total the sample learner has done, per plan
const SAMPLE_SHARE = {
  starter: { lectures: 0.46, coding: 0.34, mcq: 0.52, tests: 0.28, interviews: 0.33 },
  plus: { lectures: 0.58, coding: 0.41, mcq: 0.63, tests: 0.36, interviews: 0.45 },
  compete: { lectures: 0.67, coding: 0.49, mcq: 0.71, tests: 0.44, interviews: 0.55 }
};

const sampled = ({ done, total }, share) => ({ done: Math.min(total, Math.max(done, Math.round(total * share))), total });

export const withDemoStats = (stats, planId) => {
  const share = SAMPLE_SHARE[planId] || SAMPLE_SHARE.starter;
  const coding = sampled(stats.practice.coding, share.coding);
  const mcq = sampled(stats.practice.mcq, share.mcq);
  return {
    lectures: sampled(stats.lectures, share.lectures),
    practice: { done: coding.done + mcq.done, total: coding.total + mcq.total, coding, mcq },
    tests: sampled(stats.tests, share.tests),
    interviews: sampled(stats.interviews, share.interviews)
  };
};

/* The activity log a dashboard page shows: real progress plus, while the demo
   switch is on, the plan's (or preview's) sample year. Shared by Activity and Overview. */
export const activityFor = (ctx, unlocked) => (SHOW_DEMO_ACTIVITY
  ? withDemoActivity(ctx.progress.activity, demoActivity(ctx.preview ? 'preview' : ctx.planId, unlocked))
  : ctx.progress.activity || {});

/* Sample per-module progress (by position in the list) for the overview, so a fresh
   demo account isn't all 0%. Real progress wins as soon as it's higher. */
const SAMPLE_MODULE_PCT = [86, 58, 34, 12, 0, 0, 0, 0];
export const withDemoModuleProgress = (real, index) => {
  if (!SHOW_DEMO_PROGRESS) return real;
  const pct = Math.max(real.pct, SAMPLE_MODULE_PCT[index] ?? 0);
  const done = Math.max(real.done, Math.round((real.total * pct) / 100));
  return { done, total: real.total, pct, sample: pct > real.pct };
};
