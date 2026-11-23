/* Shared by the plan cards (PremiumPage) and the checkout summary (PlanCheckoutPage). */
/* What each plan includes, as one row per offering so the three cards line up.
   `true` = included, `false` = not included, a string = included with that detail. */
export const PLAN_ROWS = [
  { label: 'Computer Fundamentals', note: 'OS, CN, OOPs', v: [true, true, true] },
  { label: 'DBMS', v: [true, true, true] },
  // one row, named per plan: Core gets the core DSA set, Plus and Ultra the advanced one
  { label: 'Data Structure', labels: ['Data Structure - Core', 'Data Structure - Advanced', 'Data Structure - Advanced'], v: ['600 questions + 10/mo', '1,200 questions + 20/mo', '2,000 questions + 30/mo'], stack: true },
  { label: 'Full Stack', v: [false, 'MERN or JFS', 'MERN + JFS'] },
  { label: 'DevOps & Cloud Computing', v: [false, true, true] },
  { label: 'System Design', v: [false, true, true] },
  { label: 'Generative A.I.', v: [false, true, true] },
  { label: 'Communication & Behavioural', v: [false, true, true] },
  { label: 'Company-specific tests', v: [false, true, true] },
  { label: 'A.I. Mock interviews', v: ['Generic', '+ Company', '+ Company · 2 rounds'] },
  { label: '1:1 Mentorship', v: [false, false, '3 credits'] }
];

/* Column of each plan id in PLAN_ROWS[].v (Core's internal id is 'starter') */
export const PLAN_COL = { starter: 0, plus: 1, compete: 2 };

/* Every subject, in every plan, is taught through these four pillars */
export const PILLARS = ['Lectures', 'Practice', 'Tests', 'A.I. Mock interviews'];
