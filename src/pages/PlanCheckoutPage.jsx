import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, ClipboardCheck, Crown, Flame, ListChecks, Lock, Mic, PlayCircle, ShieldCheck, Zap
} from 'lucide-react';
import { PLANS_12M_DATA, PLAN_SLUGS, FeatureTree } from './PremiumPage';
import { PILLARS, PLAN_COL, PLAN_ROWS } from '../data/planRows';
import './PremiumPage.css';
import './PlanCheckoutPage.css';

/* slug in the URL → plan object (Core's internal id is 'starter') */
export const planFromSlug = (slug) => {
  const id = Object.keys(PLAN_SLUGS).find((k) => PLAN_SLUGS[k] === slug);
  return PLANS_12M_DATA.find((p) => p.id === id) || null;
};

/* Pass-out years: a few years back (alumni) through four years ahead (current students) */
const PASSOUT_YEARS = (() => {
  const now = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => now - 5 + i);
})();

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

const PILLAR_ICONS = [PlayCircle, ListChecks, ClipboardCheck, Mic];

const EMPTY_FORM = { name: '', email: '', college: '', phone: '', passoutYear: '', linkedin: '' };

const validate = (f) => {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Please enter your full name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email address';
  if (f.college.trim().length < 2) e.college = 'Please enter your college name';
  if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = 'Enter a valid 10-digit mobile number';
  if (!f.passoutYear) e.passoutYear = 'Select your pass-out year';
  if (f.linkedin.trim() && !/^(https?:\/\/)?([\w-]+\.)?linkedin\.com\/.+/i.test(f.linkedin.trim())) {
    e.linkedin = 'Enter a valid LinkedIn profile URL';
  }
  return e;
};

const PlanCheckoutPage = () => {
  const { planSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const plan = planFromSlug(planSlug);

  // Coming back from the payment page ("Edit details") pre-fills what was entered.
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...(location.state?.details || {}) }));
  const [touched, setTouched] = useState({});

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Only reachable from a plan CTA on /premium — direct visits / refreshes go back there.
  if (!plan || !location.state?.fromPremiumCta) {
    return <Navigate to="/premium" replace />;
  }

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;
  const showErr = (k) => touched[k] && errors[k];

  const onChange = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.value }));
  const onBlur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const onSubmit = (ev) => {
    ev.preventDefault();
    setTouched({ name: true, email: true, college: true, phone: true, passoutYear: true, linkedin: true });
    if (!isValid) return;
    navigate(`/premium/checkout/${planSlug}/payment`, {
      state: { fromPremiumCta: true, details: form }
    });
  };

  const PlanIcon = plan.id === 'plus' ? Flame : plan.id === 'compete' ? Crown : Zap;
  const col = PLAN_COL[plan.id] ?? 0;
  const fullPrice = Number(String(plan.originalPrice).replace(/[^\d]/g, '')) || plan.price;

  return (
    <div className="premium-page-viewport plan-checkout-viewport">
      <div className="premium-page-container">
        <Link to="/premium" className="plan-checkout-back">
          <ArrowLeft size={15} /> Back to plans
        </Link>

        <div className="plan-checkout-grid">
          {/* ── Left: plan brief — compact so the whole offer fits without scrolling:
                 price in two lines, the four pillars, then everything included in two
                 columns (same rows as the plan cards); the full module breakdown is optional ── */}
          <aside className={`pricing-card-surface plan-checkout-brief card-${plan.id}`}>
            <div className="pcb-head">
              <div>
                <h1 className="plan-name">{plan.name} Plan</h1>
                <p className="plan-checkout-pitch">{plan.pitch}</p>
              </div>
              <PlanIcon size={20} className="plan-checkout-plan-icon" />
            </div>

            <div className="pcb-price">
              <span className="pcb-price-fig">{plan.monthlyPriceFormatted}<small>/mon</small></span>
              <span className="pcb-price-was">{plan.originalMonthlyPrice}/mon</span>
              <span className="price-discount-tag">{plan.discount}</span>
            </div>
            <p className="pcb-billed"><b>{plan.priceFormatted}</b> billed once for {plan.durationLabel.toLowerCase()}</p>

            <div className="pcb-pillars">
              <span>Every subject includes</span>
              <ul>{PILLARS.map((t, i) => { const I = PILLAR_ICONS[i]; return <li key={t}><I size={13} /> {t}</li>; })}</ul>
            </div>

            <p className="pcb-label">What&apos;s included</p>
            <ul className="pcb-rows">
              {PLAN_ROWS.filter((r) => r.v[col]).map((r) => {
                const v = r.v[col];
                return (
                  <li key={r.label}>
                    <Check size={14} className="pcb-yes" />
                    <span>
                      {r.labels?.[col] ?? r.label}
                      {typeof v === 'string' && <small>{v}</small>}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="pcb-foot">
              <details className="pcb-more">
                <summary>See the full module breakdown <ChevronDown size={14} /></summary>
                <div className="pcb-more-body">
                  {plan.inheritedLabel && <p className="pcb-inherited">{plan.inheritedLabel}</p>}
                  <FeatureTree nodes={plan.features} />
                </div>
              </details>
              <span className="pcb-assure"><ShieldCheck size={13} /> 7-day money-back guarantee</span>
            </div>
          </aside>

          {/* ── Right: learner details ── */}
          <section className="plan-checkout-form-card">
              <form onSubmit={onSubmit} noValidate>
                <h2 className="plan-checkout-form-title">Your details</h2>
                <p className="plan-checkout-form-sub">
                  We'll set up your {plan.name} access with these.
                </p>

                <div className="plan-checkout-fields">
                  <div className="plan-checkout-row is-even">
                    <Field label="Full Name" error={showErr('name')}>
                      <input type="text" autoComplete="name" placeholder="e.g. Riya Sharma"
                        value={form.name} onChange={onChange('name')} onBlur={onBlur('name')} />
                    </Field>

                    <Field label="Email" error={showErr('email')}>
                      <input type="email" autoComplete="email" placeholder="you@example.com"
                        value={form.email} onChange={onChange('email')} onBlur={onBlur('email')} />
                    </Field>
                  </div>

                  <Field label="College" error={showErr('college')}>
                    <input type="text" autoComplete="organization" placeholder="Your college / university"
                      value={form.college} onChange={onChange('college')} onBlur={onBlur('college')} />
                  </Field>

                  <div className="plan-checkout-row">
                    <Field label="Phone Number" error={showErr('phone')}>
                      <div className="plan-checkout-phone">
                        <span>+91</span>
                        <input type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit mobile"
                          maxLength={10} value={form.phone}
                          onChange={(ev) => setForm((f) => ({ ...f, phone: ev.target.value.replace(/\D/g, '') }))}
                          onBlur={onBlur('phone')} />
                      </div>
                    </Field>

                    <Field label="Pass-out Year" error={showErr('passoutYear')}>
                      <select value={form.passoutYear} onChange={onChange('passoutYear')} onBlur={onBlur('passoutYear')}>
                        <option value="" disabled>Select year</option>
                        {PASSOUT_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </Field>
                  </div>

                  <Field label="LinkedIn URL" optional error={showErr('linkedin')}>
                    <input type="url" placeholder="linkedin.com/in/your-profile"
                      value={form.linkedin} onChange={onChange('linkedin')} onBlur={onBlur('linkedin')} />
                  </Field>
                </div>

                {/* order summary: fills the space above the pay button */}
                <dl className="plan-checkout-summary">
                  <div><dt>{plan.name} plan · {plan.durationLabel.toLowerCase()}</dt><dd>{plan.originalPrice}</dd></div>
                  <div className="is-off"><dt>{plan.discount.replace('OFF', 'off')} applied</dt><dd>−{inr(fullPrice - plan.price)}</dd></div>
                  <div className="is-total"><dt>Total today</dt><dd>{plan.priceFormatted}</dd></div>
                </dl>

                <button type="submit" className={`plan-checkout-submit submit-${plan.id}`}>
                  <span>Continue to payment · {plan.priceFormatted}</span>
                  <ArrowRight size={16} />
                </button>

                <ul className="plan-checkout-trust">
                  <li><Lock size={13} /> Your details stay private</li>
                  <li><Check size={13} /> 7-day money-back guarantee</li>
                </ul>
              </form>
          </section>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, optional, error, children }) => (
  <label className={`plan-checkout-field ${error ? 'has-error' : ''}`}>
    <span className="plan-checkout-label">
      {label}{optional && <em> (Optional)</em>}
    </span>
    {children}
    {error && <span className="plan-checkout-error">{error}</span>}
  </label>
);

export default PlanCheckoutPage;
