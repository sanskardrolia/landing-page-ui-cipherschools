/* ══════════════════════════════════════════════════════════════
   Plan upgrades
   ──────────────────────────────────────────────────────────────
   Rules:
   • A learner can upgrade to any higher tier at any time.
   • They pay only the difference: new plan price − price of the
     plan they're on (both 12-month prices, after the 30% discount).
   • Validity resets to 12 months from the upgrade date.
   ══════════════════════════════════════════════════════════════ */

import { PLANS_12M_DATA, PLAN_SLUGS } from '../pages/PremiumPage';
import { DEV_TRACKS, MENTOR_CREDITS_INCLUDED, MODULES } from './learnerModules';

export const PLAN_ORDER = ['starter', 'plus', 'compete']; // Core → Plus → Ultra

export const planById = (id) => PLANS_12M_DATA.find((p) => p.id === id) || null;
export const planSlug = (id) => PLAN_SLUGS[id];

const rupees = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const toNumber = (formatted) => Number(String(formatted).replace(/[^\d]/g, '')) || 0;

/* Higher tiers the learner can move to (empty on Ultra) */
export const upgradeTargets = (currentId) => {
  const i = PLAN_ORDER.indexOf(currentId);
  return PLAN_ORDER.slice(i + 1).map(planById).filter(Boolean);
};

export const isUpgrade = (fromId, toId) =>
  PLAN_ORDER.indexOf(toId) > PLAN_ORDER.indexOf(fromId) && PLAN_ORDER.indexOf(fromId) >= 0;

/* Price breakdown for moving from `fromId` to `toId` (or a fresh purchase when fromId is null) */
export const upgradeQuote = (fromId, toId, now = new Date()) => {
  const target = planById(toId);
  const current = fromId ? planById(fromId) : null;
  const list = toNumber(target.originalPrice);          // before the 30% discount
  const planDiscount = list - target.price;             // the 30% saving
  const credit = current ? current.price : 0;           // what they already paid
  const payable = Math.max(0, target.price - credit);
  const validTill = new Date(now);
  validTill.setFullYear(validTill.getFullYear() + 1);   // validity resets to 12 months

  return {
    target,
    current,
    list, planDiscount, credit, payable,
    listLabel: rupees(list),
    priceLabel: target.priceFormatted,
    discountLabel: rupees(planDiscount),
    creditLabel: rupees(credit),
    payableLabel: rupees(payable),
    validTill,
    validTillLabel: validTill.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };
};

/* What moving up adds — derived from the dashboard catalog so it stays in sync.
   `devTrack` is the Plus learner's chosen Full Stack track (to name the one Ultra adds). */
const PLUS_CORE_TITLES = MODULES.filter((m) => m.tier === 'plus' && !DEV_TRACKS.includes(m.id)).map((m) => m.title);
const TRACK_NAME = { mern: 'MERN', jfs: 'JFS' };

export const upgradeBenefits = (fromId, toId, devTrack) => {
  const out = [];
  const add = (title) => out.push({ title, detail: '' });
  if (PLAN_ORDER.indexOf(fromId) < 1 && PLAN_ORDER.indexOf(toId) >= 1) {
    add(PLUS_CORE_TITLES.join(' · '));
    add(toId === 'compete' ? 'Both Full Stack tracks (MERN & JFS)' : 'One Full Stack track — MERN or JFS');
    add('Company-specific practice & mock interviews');
  }
  if (toId === 'compete') {
    if (fromId === 'plus') add(`Full Stack ${TRACK_NAME[DEV_TRACKS.find((t) => t !== (devTrack || 'mern'))]} track`);
    add('DSA Mastery module');
    add(`1:1 Mentorship · ${MENTOR_CREDITS_INCLUDED} meeting credits`);
    add('2 attempts on every test & mock interview');
  }
  return out;
};

/* Short one-liners used on plan radio cards */
export const PLAN_BLURBS = {
  starter: 'CS Fundamentals, DBMS & DSA with recorded lectures and tests.',
  plus: 'Everything in Core plus 6 job-ready modules and one Full Stack track (MERN or JFS).',
  compete: 'Everything in Plus, both Full Stack tracks, DSA Mastery and 1:1 Mentorship.'
};
