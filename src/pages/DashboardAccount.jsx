import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, CalendarDays, CircleCheck, CreditCard, GraduationCap, Link2, LogOut, Mail, Moon, Pencil, Phone, Sun, UserRound
} from 'lucide-react';
import { PLAN_LABELS } from '../data/learnerModules';
import { SignInCard } from './DashboardSecurity';

/* ══════════════════════════════════════════════════════════════
   My Account — /dashboard/account
   Profile summary, editable personal details (saved to the demo
   enrollment), notification preferences (this device) and sign-out.
   ══════════════════════════════════════════════════════════════ */

const PREFS_KEY = 'cs_dash_prefs';
const PREFS = [
  { key: 'reminders', label: 'Study reminders', hint: 'A nudge on days you planned to study' },
  { key: 'digest', label: 'Weekly progress digest', hint: 'Your week in lectures, practice and tests, every Monday' },
  { key: 'newContent', label: 'New content alerts', hint: 'When new lectures or questions land in your modules' },
  { key: 'mentorship', label: 'Interview & mentorship updates', hint: 'Booking confirmations and reminders' }
];
const DEFAULT_PREFS = { reminders: true, digest: true, newContent: false, mentorship: true };

const FIELDS = [
  { key: 'name', label: 'Full name', Icon: UserRound, type: 'text', required: true },
  { key: 'email', label: 'Email', Icon: Mail, type: 'email', required: true },
  { key: 'phone', label: 'Phone', Icon: Phone, type: 'tel' },
  { key: 'college', label: 'College', Icon: GraduationCap, type: 'text' },
  { key: 'passoutYear', label: 'Passout year', Icon: CalendarDays, type: 'text' },
  { key: 'linkedin', label: 'LinkedIn', Icon: Link2, type: 'url' }
];

const readPrefs = () => {
  try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') }; } catch { return DEFAULT_PREFS; }
};
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const initialsOf = (name) => name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const validate = (f) => {
  const e = {};
  if (!f.name?.trim()) e.name = 'Enter your name';
  if (!/^\S+@\S+\.\S+$/.test(f.email || '')) e.email = 'Enter a valid email';
  if (f.phone && !/^[+\d][\d\s-]{7,}$/.test(f.phone)) e.phone = 'Enter a valid phone number';
  if (f.passoutYear && !/^\d{4}$/.test(f.passoutYear)) e.passoutYear = 'Use a 4-digit year';
  return e;
};

const DashboardAccount = ({ ctx }) => {
  const { enrollment, planId } = ctx;
  const learner = enrollment.learner || {};
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(learner);
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState(readPrefs);
  const errors = editing ? validate(form) : {};
  const name = learner.name?.trim() || 'Learner';

  const startEdit = () => { setForm(learner); setEditing(true); setSaved(false); };
  const save = (e) => {
    e.preventDefault();
    if (Object.keys(validate(form)).length) return;
    ctx.updateLearner(Object.fromEntries(FIELDS.map((f) => [f.key, (form[f.key] || '').trim()])));
    setEditing(false);
    setSaved(true);
  };
  const togglePref = (key) => setPrefs((p) => {
    const next = { ...p, [key]: !p[key] };
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(next)); } catch { /* blocked */ }
    return next;
  });

  return (
    <div className="dx-acct">
      {/* Who you are */}
      <section className="dx-acct-hero">
        <span className="dx-acct-avatar">{initialsOf(name)}</span>
        <div className="dx-acct-who">
          <h2>{name}</h2>
          <p>{learner.email || 'No email added'}</p>
          <div className="dx-acct-tags">
            <Link to="/dashboard/subscription" className="dx-acct-tag is-plan"><CreditCard size={13} /> {PLAN_LABELS[planId]} plan</Link>
            <span className="dx-acct-tag"><CalendarDays size={13} /> Member since {fmtDate(enrollment.paidAt)}</span>
            {learner.college && <span className="dx-acct-tag"><GraduationCap size={13} /> {learner.college}</span>}
          </div>
        </div>
      </section>

      <div className="dx-acct-grid">
        {/* Personal details */}
        <div className="dx-acct-side">
        <form className="dx-acct-card" onSubmit={save} noValidate>
          <header className="dx-acct-card-head">
            <div>
              <h3>Personal details</h3>
              <p>Used on your certificates and receipts.</p>
            </div>
            {!editing && <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={startEdit}><Pencil size={14} /> Edit</button>}
          </header>

          {saved && <p className="dx-acct-saved" role="status"><CircleCheck size={15} /> Details saved</p>}

          <div className="dx-acct-fields">
            {FIELDS.map((f) => (
              <label key={f.key} className={`dx-acct-field ${errors[f.key] ? 'has-error' : ''}`}>
                <span className="dx-acct-label"><f.Icon size={14} /> {f.label}</span>
                {editing ? (
                  <>
                    <input
                      type={f.type}
                      value={form[f.key] || ''}
                      onChange={(e) => setForm((v) => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.required ? 'Required' : 'Optional'}
                      aria-invalid={!!errors[f.key]}
                    />
                    {errors[f.key] && <small>{errors[f.key]}</small>}
                  </>
                ) : (
                  <span className={`dx-acct-value ${learner[f.key] ? '' : 'is-empty'}`}>{learner[f.key] || 'Not added'}</span>
                )}
              </label>
            ))}
          </div>

          {editing && (
            <div className="dx-acct-actions">
              <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="dx-btn dx-btn-primary dx-btn-sm" disabled={Object.keys(errors).length > 0}>Save changes</button>
            </div>
          )}
        </form>

          {/* How you log in + change password */}
          <SignInCard ctx={ctx} />
        </div>

        <div className="dx-acct-side">
          {/* Notifications */}
          <section className="dx-acct-card">
            <header className="dx-acct-card-head">
              <div><h3><Bell size={15} /> Notifications</h3><p>Saved on this device.</p></div>
            </header>
            <ul className="dx-acct-prefs">
              {PREFS.map((p) => (
                <li key={p.key}>
                  <span><strong>{p.label}</strong><small>{p.hint}</small></span>
                  <button type="button" role="switch" aria-checked={prefs[p.key]} aria-label={p.label} className={`dx-acct-switch ${prefs[p.key] ? 'is-on' : ''}`} onClick={() => togglePref(p.key)}><span /></button>
                </li>
              ))}
            </ul>
          </section>

          {/* Appearance + session */}
          <section className="dx-acct-card">
            <header className="dx-acct-card-head"><div><h3>Appearance</h3><p>Dashboard theme.</p></div></header>
            <div className="dx-acct-theme" role="radiogroup" aria-label="Theme">
              {[{ id: 'dark', label: 'Dark', Icon: Moon }, { id: 'light', label: 'Light', Icon: Sun }].map((t) => (
                <button key={t.id} type="button" role="radio" aria-checked={ctx.theme === t.id} className={ctx.theme === t.id ? 'is-on' : ''} onClick={() => ctx.theme !== t.id && ctx.toggleTheme()}>
                  <t.Icon size={15} /> {t.label}
                </button>
              ))}
            </div>
          </section>

          <section className="dx-acct-card dx-acct-session">
            <div><h3>Sign out</h3><p>Your progress stays saved for when you're back.</p></div>
            <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm dx-acct-logout" onClick={ctx.logout}><LogOut size={14} /> Logout</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardAccount;
