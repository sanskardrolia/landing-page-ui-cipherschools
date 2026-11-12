import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, Crown, Flame, Lock, ShieldCheck, Sparkles, Zap
} from 'lucide-react';
import { PLANS_12M_DATA, PLAN_SLUGS, FeatureTree } from './PremiumPage';
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

  return (
    <div className="premium-page-viewport plan-checkout-viewport">
      <div className="premium-page-container">
        <Link to="/premium" className="plan-checkout-back">
          <ArrowLeft size={15} /> Back to plans
        </Link>

        <div className="plan-checkout-grid">
          {/* ── Left: plan brief ── */}
          <aside className={`pricing-card-surface plan-checkout-brief card-${plan.id}`}>
            <div className="plan-header">
              <div className="plan-title-row">
                <h1 className="plan-name">{plan.name} Plan</h1>
                <PlanIcon size={20} className="plan-checkout-plan-icon" />
              </div>
              <p className="plan-checkout-pitch">{plan.pitch}</p>
            </div>

            <div className="plan-price-block">
              <div className="price-main-line">
                <span className="price-figure">{plan.monthlyPriceFormatted}</span>
                <span className="price-period">/ mon</span>
              </div>
              <div className="price-commitment-line">
                <span className="price-commitment-badge">with a commitment of {plan.durationLabel}</span>
                <span className="price-total-billed">Billed {plan.priceFormatted} upfront</span>
              </div>
              <div className="price-sub-line">
                <span className="price-original">{plan.originalMonthlyPrice}/mon</span>
                <span className="price-discount-tag">{plan.discount}</span>
              </div>
            </div>

            <div className="plan-card-divider"></div>

            {plan.inheritedLabel && (
              <div className="plan-inherited-banner">
                <Sparkles size={13} />
                <span>{plan.inheritedLabel}</span>
              </div>
            )}
            <FeatureTree nodes={plan.features} />

            <div className="plan-footer-assurance">
              <ShieldCheck size={14} />
              <span>Instant access • 100% money-back 7-day guarantee</span>
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
                  <Field label="Full Name" error={showErr('name')}>
                    <input type="text" autoComplete="name" placeholder="e.g. Riya Sharma"
                      value={form.name} onChange={onChange('name')} onBlur={onBlur('name')} />
                  </Field>

                  <Field label="Email" error={showErr('email')}>
                    <input type="email" autoComplete="email" placeholder="you@example.com"
                      value={form.email} onChange={onChange('email')} onBlur={onBlur('email')} />
                  </Field>

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
