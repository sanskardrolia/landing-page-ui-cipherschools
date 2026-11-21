import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../data/demoAccounts';
import { PLAN_LABELS } from '../data/learnerModules';
import { clearEnrollment, getEnrollment, saveEnrollment } from './enrollment';
import { endPreview, startPreview } from './preview';

/* ──────────────────────────────────────────────────────────────
   DEMO sign-in (browser only). Replace with the real auth API.
   • A demo account with a plan → its paid dashboard.
   • An email that matches a plan bought on this device → that plan.
   • Any other valid email (or the free demo) → the preview dashboard.
   Returns { ok, error?, paid? }.
   ────────────────────────────────────────────────────────────── */

const SESSION_KEY = 'cs_demo_session';
const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
};
const saveSession = (s) => { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch { /* blocked */ } };
export const clearSession = () => { try { localStorage.removeItem(SESSION_KEY); } catch { /* blocked */ } };

const openPreview = (email, name, provider) => {
  clearEnrollment();          // a free login never sees someone else's paid plan
  startPreview();
  saveSession({ email, name, provider, plan: null });
  return { ok: true, paid: false };
};

export const signIn = (rawEmail, password, { provider = 'email' } = {}) => {
  const email = rawEmail.trim().toLowerCase();
  if (!isEmail(email)) return { ok: false, error: 'Enter a valid email address.' };
  if (provider === 'email' && (password || '').length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };

  const demo = DEMO_ACCOUNTS.find((a) => a.email === email);
  if (demo) {
    if (provider === 'email' && password !== DEMO_PASSWORD) return { ok: false, error: 'Wrong password for this demo account.' };
    if (!demo.planId) return openPreview(email, demo.name, provider);
    endPreview();
    saveEnrollment({
      planId: demo.planId,
      planName: PLAN_LABELS[demo.planId],
      durationLabel: '12 Months',
      txnId: `DEMO-${demo.planId.toUpperCase()}`,
      paidAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      learner: { name: demo.name, email },
      authProvider: provider,
      ...(demo.devTrack ? { devTrack: demo.devTrack } : {})
    });
    saveSession({ email, name: demo.name, provider, plan: demo.planId });
    return { ok: true, paid: true };
  }

  // A plan bought through checkout on this device, under this email
  const bought = getEnrollment();
  if (bought?.learner?.email?.toLowerCase() === email) {
    endPreview();
    saveSession({ email, name: bought.learner.name, provider, plan: bought.planId });
    return { ok: true, paid: true };
  }

  const name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return openPreview(email, name, provider);
};
