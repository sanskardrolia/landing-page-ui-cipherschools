/* ══════════════════════════════════════════════════════════════
   "Waitlist first": opening the site's main link (/) shows /waitlist
   first. Closing the waitlist (or opening it once) lets the homepage
   through for the rest of that browser tab's visit.
   Set WAITLIST_FIRST to false to go back to opening the homepage.
   Tiny on purpose: App.jsx imports it, the waitlist page stays lazy.
   ══════════════════════════════════════════════════════════════ */

export const WAITLIST_FIRST = true;

const KEY = 'cs_waitlist_seen';
export const waitlistSeen = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return true; } };
export const markWaitlistSeen = () => { try { sessionStorage.setItem(KEY, '1'); } catch { /* storage off */ } };
