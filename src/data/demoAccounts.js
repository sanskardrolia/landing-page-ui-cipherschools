/* ──────────────────────────────────────────────────────────────
   DEMO sign-in accounts (no backend yet). Test values only:
   one shared demo password; each email maps to a plan.
   Free = no plan → the "Experience before you pay" dashboard.
   ────────────────────────────────────────────────────────────── */

export const DEMO_PASSWORD = 'cipher123';

export const DEMO_ACCOUNTS = [
  { email: 'free@example.com', name: 'Riya Sharma', planId: null, label: 'Free', note: 'No plan · preview dashboard' },
  { email: 'core@example.com', name: 'Aarav Mehta', planId: 'starter', label: 'Core', note: 'Core plan dashboard' },
  { email: 'plus@example.com', name: 'Isha Verma', planId: 'plus', devTrack: 'mern', label: 'Plus', note: 'Plus plan · MERN track' },
  { email: 'ultra@example.com', name: 'Kabir Singh', planId: 'compete', label: 'Ultra', note: 'Ultra plan dashboard' }
];
