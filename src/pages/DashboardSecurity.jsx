import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, CircleCheck, Eye, EyeOff, KeyRound, Mail, ShieldCheck, X } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   My Account › Sign-in & security
   • How the account was created: Email, Google, GitHub or LinkedIn.
   • Change password (or set one, for OAuth accounts) in three steps:
     1. send a one-time code to the account email
     2. enter the 6-digit code
     3. new password + retype it
   DEMO: there's no mail server yet, so the code is shown on screen,
   and only the change date is saved (never the password). Swap the
   three marked calls for the real auth API.
   ══════════════════════════════════════════════════════════════ */

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
    <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.4 4.4 18.4 4.7 18.4 4.7c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <rect width="24" height="24" rx="4" fill="#0A66C2" />
    <path fill="#fff" d="M7.1 9.5H4.5V19h2.6V9.5zM5.8 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM19.5 13.6c0-2.6-1.4-4.3-3.7-4.3-1.3 0-2.2.7-2.5 1.3V9.5h-2.5V19h2.6v-4.7c0-1.2.3-2.4 1.8-2.4s1.6 1.4 1.6 2.5V19h2.7v-5.4z" />
  </svg>
);

const PROVIDERS = {
  email: { label: 'Email & password', Icon: () => <Mail size={18} />, hasPassword: true },
  google: { label: 'Google', Icon: GoogleIcon },
  github: { label: 'GitHub', Icon: GitHubIcon },
  linkedin: { label: 'LinkedIn', Icon: LinkedInIcon }
};

const maskEmail = (email = '') => {
  const [user, domain] = email.split('@');
  if (!domain) return email;
  return `${user.slice(0, 2)}${'•'.repeat(Math.max(2, user.length - 2))}@${domain}`;
};
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const RULES = [
  { test: (p) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p) => /[A-Za-z]/.test(p) && /\d/.test(p), label: 'Letters and numbers' },
  { test: (p) => /[^A-Za-z0-9]/.test(p) || /[A-Z]/.test(p), label: 'A capital letter or symbol' }
];
const RESEND_AFTER = 30;

/* ───────────── Card on My Account ───────────── */

export const SignInCard = ({ ctx }) => {
  const learner = ctx.enrollment.learner || {};
  const provider = PROVIDERS[ctx.enrollment.authProvider] ? ctx.enrollment.authProvider : 'email';
  const P = PROVIDERS[provider];
  const hasPassword = P.hasPassword || !!learner.passwordUpdatedAt;
  const [open, setOpen] = useState(false);

  return (
    <section className="dx-acct-card">
      <header className="dx-acct-card-head">
        <div><h3><ShieldCheck size={15} /> Sign-in & security</h3><p>How you log in to CipherSchools.</p></div>
      </header>

      <div className="dx-sec-row">
        <span className={`dx-sec-provider is-${provider}`}><P.Icon /></span>
        <span className="dx-sec-text">
          <strong>{provider === 'email' ? 'Email & password' : `Signed up with ${P.label}`}</strong>
          <small>{learner.email || 'No email added'}</small>
        </span>
        <span className="dx-sec-tag"><Check size={12} /> Connected</span>
      </div>

      <div className="dx-sec-row">
        <span className="dx-sec-provider"><KeyRound size={17} /></span>
        <span className="dx-sec-text">
          <strong>Password</strong>
          <small>
            {learner.passwordUpdatedAt
              ? `Last changed ${fmtDate(learner.passwordUpdatedAt)}`
              : hasPassword ? '••••••••••' : `Not set · you sign in with ${P.label}`}
          </small>
        </span>
        <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => setOpen(true)} disabled={!learner.email}>
          {hasPassword ? 'Change' : 'Set password'}
        </button>
      </div>

      {open && <PasswordDialog ctx={ctx} setting={!hasPassword} onClose={() => setOpen(false)} />}
    </section>
  );
};

/* ───────────── Change password: email → code → new password ───────────── */

const PasswordDialog = ({ ctx, setting, onClose }) => {
  const email = ctx.enrollment.learner?.email || '';
  const [step, setStep] = useState('send'); // send · code · new · done
  const [code, setCode] = useState('');      // the one sent (demo)
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [codeError, setCodeError] = useState('');
  const [wait, setWait] = useState(0);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const boxes = useRef([]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  // 1. Send the code (DEMO: generated here; real: POST /auth/password/otp)
  const sendCode = () => {
    setBusy(true);
    setTimeout(() => {
      setCode(String(Math.floor(100000 + Math.random() * 900000)));
      setDigits(Array(6).fill(''));
      setCodeError('');
      setWait(RESEND_AFTER);
      setStep('code');
      setBusy(false);
      setTimeout(() => boxes.current[0]?.focus(), 0);
    }, 600);
  };

  const typeDigit = (i, v) => {
    const clean = v.replace(/\D/g, '');
    if (clean.length > 1) { // pasted the whole code
      const next = clean.slice(0, 6).split('');
      setDigits([...next, ...Array(6 - next.length).fill('')]);
      boxes.current[Math.min(next.length, 5)]?.focus();
      return;
    }
    setDigits((d) => d.map((x, j) => (j === i ? clean : x)));
    setCodeError('');
    if (clean && i < 5) boxes.current[i + 1]?.focus();
  };
  const keyDigit = (i, e) => { if (e.key === 'Backspace' && !digits[i] && i > 0) boxes.current[i - 1]?.focus(); };

  // 2. Check the code (real: POST /auth/password/verify → reset token)
  const verify = (e) => {
    e.preventDefault();
    if (digits.join('') !== code) { setCodeError('That code is not right. Check the email and try again.'); return; }
    setStep('new');
  };

  const rulesOk = RULES.every((r) => r.test(pw));
  const match = pw && pw === pw2;
  // 3. Save (real: POST /auth/password with the reset token). Only the date is kept here.
  const save = (e) => {
    e.preventDefault();
    if (!rulesOk || !match) return;
    setBusy(true);
    setTimeout(() => {
      ctx.updateLearner({ passwordUpdatedAt: new Date().toISOString() });
      setBusy(false);
      setStep('done');
    }, 600);
  };

  const title = setting ? 'Set a password' : 'Change password';
  const stepNo = { send: 1, code: 2, new: 3, done: 3 }[step];

  return (
    <div className="dx-ad-backdrop" onClick={onClose}>
      <div className="dx-ad dx-pw" role="dialog" aria-modal="true" aria-labelledby="dx-pw-title" onClick={(e) => e.stopPropagation()}>
        <header className="dx-ad-head">
          <span className="dx-ad-icon"><KeyRound size={18} /></span>
          <div className="dx-ad-titles">
            <h2 id="dx-pw-title">{title}</h2>
            <p>{step === 'done' ? 'All set' : `Step ${stepNo} of 3`}</p>
          </div>
          <button type="button" className="dx-icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>

        {step !== 'done' && (
          <ol className="dx-pw-steps" aria-hidden="true">
            {['Verify email', 'Enter code', 'New password'].map((l, i) => (
              <li key={l} className={i + 1 < stepNo ? 'is-done' : i + 1 === stepNo ? 'is-on' : ''}><span>{i + 1 < stepNo ? <Check size={11} strokeWidth={3} /> : i + 1}</span>{l}</li>
            ))}
          </ol>
        )}

        {step === 'send' && (
          <div className="dx-pw-body">
            <p>We'll email a 6-digit code to <strong>{maskEmail(email)}</strong> to confirm it's you.</p>
            <div className="dx-pw-actions">
              <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={onClose}>Cancel</button>
              <button type="button" className="dx-btn dx-btn-primary dx-btn-sm" onClick={sendCode} disabled={busy}>{busy ? 'Sending…' : 'Send code'}</button>
            </div>
          </div>
        )}

        {step === 'code' && (
          <form className="dx-pw-body" onSubmit={verify}>
            <p>Enter the code sent to <strong>{maskEmail(email)}</strong>. It expires in 10 minutes.</p>
            <p className="dx-pw-demo">Demo: no email is sent yet. Your code is <strong>{code}</strong></p>
            <div className={`dx-otp ${codeError ? 'has-error' : ''}`}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { boxes.current[i] = el; }}
                  value={d}
                  onChange={(e) => typeDigit(i, e.target.value)}
                  onKeyDown={(e) => keyDigit(i, e)}
                  inputMode="numeric"
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  maxLength={6}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>
            {codeError && <small className="dx-pw-error">{codeError}</small>}
            <div className="dx-pw-resend">
              {wait > 0 ? <span>Resend code in {wait}s</span> : <button type="button" onClick={sendCode}>Resend code</button>}
            </div>
            <div className="dx-pw-actions">
              <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => setStep('send')}><ArrowLeft size={14} /> Back</button>
              <button type="submit" className="dx-btn dx-btn-primary dx-btn-sm" disabled={digits.join('').length < 6}>Verify</button>
            </div>
          </form>
        )}

        {step === 'new' && (
          <form className="dx-pw-body" onSubmit={save}>
            <label className="dx-pw-field">
              <span>New password</span>
              <span className="dx-pw-input">
                <input type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" autoFocus />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </span>
            </label>
            <ul className="dx-pw-rules">
              {RULES.map((r) => <li key={r.label} className={r.test(pw) ? 'is-ok' : ''}><Check size={12} strokeWidth={3} /> {r.label}</li>)}
            </ul>
            <label className="dx-pw-field">
              <span>Retype new password</span>
              <span className="dx-pw-input">
                <input type={show ? 'text' : 'password'} value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" />
              </span>
              {pw2 && !match && <small className="dx-pw-error">Passwords don't match</small>}
            </label>
            <div className="dx-pw-actions">
              <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="dx-btn dx-btn-primary dx-btn-sm" disabled={!rulesOk || !match || busy}>{busy ? 'Saving…' : 'Update password'}</button>
            </div>
          </form>
        )}

        {step === 'done' && (
          <div className="dx-pw-done" role="status">
            <CircleCheck size={30} />
            <p>Password {setting ? 'set' : 'updated'}</p>
            <span>Use it next time you log in with {maskEmail(email)}.</span>
            <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
};
