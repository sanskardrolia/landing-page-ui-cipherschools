import { useCallback, useEffect, useState } from 'react';
import { subjectLectures } from '../data/learnerModules';
import { dayKey } from './learnerProgress';

/* ══════════════════════════════════════════════════════════════
   CipherCoins: earned for showing up and doing the work.
   Store (localStorage, demo until a backend exists):
     { ledger:   [{ id, amount, label, kind, at }],   // every coin earned
       checkins: { 'YYYY-MM-DD': true },             // daily check-ins
       claimed:  { missionKey: true } }               // missions already paid out
   Missions are computed from learning progress; a finished mission
   is claimed by the learner (Claim → coins land in the ledger).
   Daily missions carry the date in their key, so they reset each day.
   Preview ("Experience before you pay") keeps coins for the visit only.
   ══════════════════════════════════════════════════════════════ */

const KEY = 'cs_dash_coins';
const EMPTY = { ledger: [], checkins: {}, claimed: {} };

/* Daily check-in: day 1 → 7 of a check-in streak; day 7 is the big one, then it repeats */
export const CHECKIN_LADDER = [10, 15, 20, 25, 30, 40, 75];

const DAY = 86400000;
const shiftDay = (key, n) => {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(new Date(y, m - 1, d).getTime() + n * DAY));
};

/* Consecutive days (ending today, or yesterday if today isn't done yet) that pass `has` */
const runEndingNow = (has, today) => {
  let start = has(today) ? today : shiftDay(today, -1);
  let n = 0;
  while (has(start)) { n += 1; start = shiftDay(start, -1); }
  return n;
};

const read = () => {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return EMPTY; }
};

/* Levels: reached by total coins earned (spending later never lowers a level) */
export const LEVELS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 6000, 9000];
export const levelOf = (earned) => {
  let lv = 1;
  LEVELS.forEach((need, i) => { if (earned >= need) lv = i + 1; });
  const next = LEVELS[lv] ?? null; // coins needed for the next level (null at the top)
  const from = LEVELS[lv - 1];
  return { level: lv, next, from, pct: next ? Math.round(((earned - from) / (next - from)) * 100) : 100 };
};

const entry = (id, amount, label, kind) => ({ id, amount, label, kind, at: new Date().toISOString() });

/* First open of the day checks in automatically: returns the updated store and the toast to show */
const autoCheckIn = (store) => {
  const today = dayKey();
  if (store.checkins[today]) return { store, toast: null };
  const streakBefore = runEndingNow((k) => store.checkins[k], today); // ends yesterday (today isn't in yet)
  const pos = streakBefore % CHECKIN_LADDER.length;
  const amount = CHECKIN_LADDER[pos];
  const id = `checkin:${today}`;
  return {
    store: {
      ...store,
      checkins: { ...store.checkins, [today]: true },
      claimed: { ...store.claimed, [id]: true },
      ledger: [...store.ledger, entry(id, amount, `Daily check-in · day ${pos + 1}`, 'checkin')]
    },
    toast: { amount, kind: 'checkin', streak: streakBefore + 1, label: `Day ${streakBefore + 1} streak · checked in automatically`, id }
  };
};

export const useCipherCoins = (preview) => {
  // Read once, check in for today if needed (preview: coins last for this visit only)
  const [boot] = useState(() => autoCheckIn(preview ? EMPTY : read()));
  const [store, setStore] = useState(boot.store);
  const [toast, setToast] = useState(boot.toast);

  useEffect(() => {
    if (preview) return;
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch { /* storage blocked */ }
  }, [store, preview]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const claim = useCallback((m) => {
    if (m.status !== 'ready') return;
    setStore((s) => (s.claimed[m.key] ? s : {
      ...s,
      claimed: { ...s.claimed, [m.key]: true },
      ledger: [...s.ledger, entry(m.key, m.reward, m.title, m.group)]
    }));
    setToast({ amount: m.reward, label: m.title, kind: 'claim', id: `${m.key}:${Date.now()}` });
  }, []);

  // Several at once (Claim all): one toast with the total
  const claimMany = useCallback((list) => {
    const ready = list.filter((m) => m.status === 'ready');
    if (!ready.length) return;
    setStore((s) => {
      const fresh = ready.filter((m) => !s.claimed[m.key]);
      return {
        ...s,
        claimed: { ...s.claimed, ...Object.fromEntries(fresh.map((m) => [m.key, true])) },
        ledger: [...s.ledger, ...fresh.map((m) => entry(m.key, m.reward, m.title, m.group))]
      };
    });
    setToast({ amount: ready.reduce((a, m) => a + m.reward, 0), label: `${ready.length} missions claimed`, kind: 'claim', id: `many:${Date.now()}` });
  }, []);

  const today = dayKey();
  const checkedToday = !!store.checkins[today];
  const checkinStreak = runEndingNow((k) => store.checkins[k], today);
  const ladderPos = ((checkedToday ? checkinStreak - 1 : checkinStreak) % CHECKIN_LADDER.length + CHECKIN_LADDER.length) % CHECKIN_LADDER.length;
  const balance = store.ledger.reduce((a, e) => a + e.amount, 0);
  const earned = balance; // nothing is spent until the rewards store opens
  const weekFrom = shiftDay(today, -6); // last 7 days, today included
  const thisWeek = store.ledger.filter((e) => dayKey(new Date(e.at)) >= weekFrom).reduce((a, e) => a + e.amount, 0);

  return {
    store, balance, earned, thisWeek, today, checkedToday, checkinStreak, ladderPos, level: levelOf(earned),
    claim, claimMany, toast, dismissToast: () => setToast(null)
  };
};

/* ───────────── Missions ───────────── */

const PRACTICE_LADDER = [[1, 20], [10, 60], [25, 120], [50, 250], [100, 500], [250, 1200]];
const STREAK_LADDER = [[3, 40], [7, 120], [14, 300], [30, 750]];
export const REFERRAL_REWARD = 250;
export const REFERRAL_FRIEND = 100;

const mondayOf = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return shiftDay(key, -((date.getDay() + 6) % 7));
};

/* Every mission, grouped, with live progress and its state:
   'ready' (claim it) · 'claimed' · 'open' (still to do) */
export const buildMissions = (ctx, coins) => {
  const { progress, enrollment } = ctx;
  const today = coins.today;
  const act = progress.activity || {};
  const dayOf = (k) => act[k] || {};
  const status = (key, done, total) => (coins.store.claimed[key] ? 'claimed' : done >= total ? 'ready' : 'open');
  const make = (group, key, title, desc, done, total, reward, to) => ({
    group, key, title, desc, done: Math.min(done, total), total, reward, to, status: status(key, done, total)
  });

  const t = dayOf(today);
  const solved = Object.keys(progress.practice || {}).length;
  const watched = Object.keys(progress.watched || {}).length;
  const testsTaken = Object.values(progress.tests || {}).filter((x) => x?.count > 0).length;
  const mocks = Object.keys(progress.interviews || {}).length;

  /* Daily: reset every day */
  const dailyBase = [
    make('daily', `daily:${today}:lecture`, 'Watch 2 lectures', 'Any module, any section', t.lecture || 0, 2, 20, '/dashboard/content'),
    make('daily', `daily:${today}:practice`, 'Solve 3 practice questions', 'Problems, MCQs or labs', t.practice || 0, 3, 30, '/dashboard/content'),
    make('daily', `daily:${today}:test`, 'Attempt a test', 'Any unlocked test', t.test || 0, 1, 40, '/dashboard/content')
  ];
  const dailyDone = dailyBase.filter((m) => m.status === 'claimed').length;
  const daily = [...dailyBase, make('daily', `daily:${today}:all`, 'Clear all daily missions', 'Bonus for claiming all three today', dailyDone, 3, 50)];

  /* Practice: a ladder of totals + a weekly target */
  let weekSolved = 0;
  const monday = mondayOf(today);
  for (let i = 0; i < 7; i++) weekSolved += dayOf(shiftDay(monday, i)).practice || 0;
  const nextRung = PRACTICE_LADDER.findIndex(([n]) => !coins.store.claimed[`practice:total:${n}`]);
  const practice = [
    make('practice', `practice:week:${monday}`, 'Solve 15 questions this week', 'Resets every Monday', weekSolved, 15, 100, '/dashboard/content'),
    // Show the claimable / next rungs of the ladder, not all six at once
    ...PRACTICE_LADDER.filter((_, i) => nextRung < 0 || (i >= nextRung && i <= nextRung + 2))
      .map(([n, r]) => make('practice', `practice:total:${n}`, n === 1 ? 'Solve your first question' : `Solve ${n} questions`, 'Total practice questions solved', solved, n, r, '/dashboard/content'))
  ];

  /* Learning streak (days with any learning activity) */
  const hasActivity = (k) => ['lecture', 'practice', 'test', 'interview'].some((x) => (act[k]?.[x] || 0) > 0);
  const learnStreak = runEndingNow(hasActivity, today);
  const streaks = STREAK_LADDER.map(([n, r]) => make('streak', `streak:${n}`, `${n}-day learning streak`, 'Learn something every day', learnStreak, n, r, '/dashboard/activity'));

  /* Milestones: one-time firsts */
  const sectionDone = ctx.modules.some((m) => m.subjects.some((s) => {
    const ls = subjectLectures(s);
    return ls.length > 0 && ls.every((l) => progress.watched[l.id]);
  }));
  const milestones = [
    make('milestone', 'ms:lecture:1', 'Watch your first lecture', 'Start any module', watched, 1, 20, '/dashboard/content'),
    make('milestone', 'ms:lecture:25', 'Watch 25 lectures', 'Across all modules', watched, 25, 150, '/dashboard/content'),
    make('milestone', 'ms:section', 'Finish a full section', 'Every lecture of one section', sectionDone ? 1 : 0, 1, 200, '/dashboard/content'),
    make('milestone', 'ms:test:1', 'Take your first test', 'Unlocks at 60% of a unit', testsTaken, 1, 60, '/dashboard/content'),
    make('milestone', 'ms:test:5', 'Take 5 tests', 'Module or additional tests', testsTaken, 5, 200, '/dashboard/content'),
    make('milestone', 'ms:mock:1', 'Book your first mock interview', 'Unlocks when a section is complete', mocks, 1, 150, '/dashboard/content')
  ];

  /* Bonuses (referrals are shown on their own card) */
  const l = enrollment.learner || {};
  const profileFields = ['name', 'email', 'phone', 'college', 'passoutYear', 'linkedin'];
  const filled = profileFields.filter((k) => (l[k] || '').trim()).length;
  const bonuses = [
    make('bonus', 'bonus:welcome', 'Welcome bonus', 'For joining CipherSchools', 1, 1, 100),
    make('bonus', 'bonus:profile', 'Complete your profile', 'Fill every field in My Account', filled, profileFields.length, 50, '/dashboard/account'),
    make('bonus', 'bonus:planner', 'Tick off a planned task', 'Complete a task in the Planner', plannerDone(), 1, 30, '/dashboard/planner')
  ];

  return {
    learnStreak,
    groups: [
      { id: 'daily', title: 'Daily missions', note: 'Reset at midnight', items: daily },
      { id: 'practice', title: 'Practice missions', note: `${solved} solved so far`, items: practice },
      { id: 'streak', title: 'Streak bonuses', note: `${learnStreak}-day learning streak`, items: streaks },
      { id: 'milestone', title: 'Milestones', note: 'One-time', items: milestones },
      { id: 'bonus', title: 'Bonuses', note: 'One-time', items: bonuses }
    ]
  };
};

/* Planner tasks marked done (the Planner keeps its own store) */
const plannerDone = () => {
  try {
    const p = JSON.parse(localStorage.getItem('cs_dash_planner') || 'null');
    return Object.values(p?.tasks || {}).flat().filter((t) => t.done).length;
  } catch { return 0; }
};

export const fmtCoins = (n) => n.toLocaleString('en-IN');

/* A short, stable referral code from the learner's name */
export const referralCode = (name = 'learner') => {
  const base = name.trim().split(/\s+/)[0].replace(/[^a-z]/gi, '').toUpperCase().slice(0, 6) || 'CIPHER';
  const n = [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 900 + 100;
  return `${base}${n}`;
};
