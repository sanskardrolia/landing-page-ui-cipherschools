import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Building2, Check, CheckCircle2, ChevronDown, CreditCard,
  Crown, Flame, Loader2, Lock, ShieldCheck, Smartphone, Sparkles, Zap
} from 'lucide-react';
import { planFromSlug } from './PlanCheckoutPage';
import { getEnrollment, saveEnrollment } from '../utils/enrollment';
import { DEV_TRACKS, DEV_TRACK_LABELS } from '../data/learnerModules';
import {
  PLAN_ORDER, isUpgrade, planById, planSlug, upgradeBenefits, upgradeQuote, upgradeTargets
} from '../data/upgrade';
import './PlanPaymentPage.css';

/* ══════════════════════════════════════════════════════════════
   Checkout — /premium/checkout/:planSlug/payment
   New purchase:  reached from the details form (state.details).
   Upgrade:       reached from the dashboard pop-up (state.upgradeFrom);
                  learner pays only the difference, validity resets.

   DEMO: no gateway is called and nothing is charged. Replace
   `simulatePayment` with the existing payment gateway call.
   ══════════════════════════════════════════════════════════════ */

const simulatePayment = () => new Promise((resolve) => setTimeout(resolve, 1800));
// Demo transaction id (the real gateway returns its own); only called from the Pay handler
const makeTxnId = () => `DEMO${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;

const PLAN_ICONS = { starter: Zap, plus: Flame, compete: Crown };
const METHODS = [
  { id: 'upi', label: 'UPI', Icon: Smartphone },
  { id: 'card', label: 'Card', Icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', Icon: Building2 }
];
const BANKS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank',
  'Punjab National Bank', 'Bank of Baroda', 'Yes Bank', 'IDFC FIRST Bank', 'Canara Bank'
];
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
};

const validate = (method, f) => {
  const e = {};
  if (f.billedTo.trim().length < 2) e.billedTo = 'Enter the name for the invoice';
  if (method === 'upi' && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(f.upiId.trim())) e.upiId = 'Enter a valid UPI ID (e.g. name@okbank)';
  if (method === 'card') {
    if (f.cardNumber.replace(/\s/g, '').length !== 16) e.cardNumber = 'Enter the 16-digit card number';
    const [mm, yy] = f.expiry.split('/').map((x) => x.trim());
    const m = Number(mm);
    if (!(m >= 1 && m <= 12) || !yy || yy.length !== 2) e.expiry = 'Use MM / YY';
    else if (new Date(2000 + Number(yy), m) <= new Date()) e.expiry = 'This card has expired';
    if (!/^\d{3}$/.test(f.cvv)) e.cvv = '3 digits';
  }
  if (method === 'netbanking' && !f.bank) e.bank = 'Choose your bank';
  if (!f.state) e.state = 'Choose your state';
  if (f.city.trim().length < 2) e.city = 'Enter your city';
  if (!/^[1-9]\d{5}$/.test(f.pin)) e.pin = '6-digit PIN code';
  return e;
};

const PlanPaymentPage = () => {
  const { planSlug: slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const plan = planFromSlug(slug);
  const details = location.state?.details;
  const upgradeFrom = location.state?.upgradeFrom || null;
  const [enrollment] = useState(getEnrollment); // read once: the plan the learner had on arrival

  const [method, setMethod] = useState('upi');
  const [fields, setFields] = useState(() => ({
    billedTo: details?.name || '', upiId: '', cardNumber: '', expiry: '', cvv: '',
    bank: '', state: '', city: '', pin: ''
  }));
  const [touched, setTouched] = useState({});
  const [devTrack, setDevTrack] = useState(null); // Plus only: the one Full Stack track (MERN or JFS)
  const [status, setStatus] = useState('idle'); // idle | processing | success
  const [txnId, setTxnId] = useState('');

  useEffect(() => { if (status !== 'processing') window.scrollTo(0, 0); }, [status]);

  // Only reachable through the flows above
  if (!plan || !location.state?.fromPremiumCta || !details) return <Navigate to="/premium" replace />;
  const upgradeMode = !!upgradeFrom;
  if (upgradeMode && (!enrollment || enrollment.planId !== upgradeFrom || !isUpgrade(upgradeFrom, plan.id))) {
    if (status !== 'success') return <Navigate to="/dashboard" replace />;
  }

  const quote = upgradeQuote(upgradeMode ? upgradeFrom : null, plan.id);
  const options = upgradeMode ? upgradeTargets(upgradeFrom) : PLAN_ORDER.map(planById);
  const fromPlan = upgradeMode ? planById(upgradeFrom) : null;
  const unlocks = upgradeMode
    ? upgradeBenefits(upgradeFrom, plan.id, enrollment?.devTrack)
    : plan.features.filter((f) => !f.extension).map((f) => ({ title: f.text }));

  const needsTrack = plan.id === 'plus';
  const errors = validate(method, fields);
  if (needsTrack && !devTrack) errors.devTrack = 'Choose MERN or JFS to continue';
  const show = (k) => touched[k] && errors[k];
  const set = (k, fmt = (v) => v) => (ev) => setFields((f) => ({ ...f, [k]: fmt(ev.target.value) }));
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const choosePlan = (id) => {
    if (id === plan.id || status !== 'idle') return;
    navigate(`/premium/checkout/${planSlug(id)}/payment`, { replace: true, state: location.state });
  };

  const onPay = async (ev) => {
    ev.preventDefault();
    setTouched({ ...Object.fromEntries(Object.keys(fields).map((k) => [k, true])), devTrack: true });
    if (Object.keys(errors).length) return;
    setStatus('processing');
    await simulatePayment();
    const id = makeTxnId();
    setTxnId(id);
    saveEnrollment({
      planId: plan.id,
      planName: plan.name,
      durationLabel: plan.durationLabel,
      amount: quote.payableLabel,
      txnId: id,
      paidAt: new Date().toISOString(), // validity (12 months) counts from here — resets on upgrade
      learner: details,
      // Plus: the chosen track. Ultra unlocks both, so keep whatever was chosen before (if any).
      ...(needsTrack ? { devTrack } : enrollment?.devTrack ? { devTrack: enrollment.devTrack } : {}),
      ...(upgradeMode ? { upgradedFrom: upgradeFrom } : {})
    });
    setStatus('success');
  };

  const paidVia =
    method === 'upi' ? `UPI · ${fields.upiId}` :
    method === 'card' ? `Card · •••• ${fields.cardNumber.replace(/\s/g, '').slice(-4)}` :
    `Net Banking · ${fields.bank}`;

  /* ─────────────── Success ─────────────── */
  if (status === 'success') {
    return (
      <div className="co-page">
        <div className="co-shell co-success">
          <CheckCircle2 size={48} className="co-success-icon" />
          <h1>{upgradeMode ? `You're now on ${plan.name}` : 'Payment successful'}</h1>
          <p className="co-muted">
            {upgradeMode
              ? `Your ${fromPlan.name} plan has been upgraded. Everything in ${plan.name} is unlocked now.`
              : `Welcome to ${plan.name}, ${details.name.trim().split(' ')[0]}! Your access is active.`}
          </p>
          <dl className="co-summary">
            <div><dt>Amount paid</dt><dd>{quote.payableLabel}</dd></div>
            {upgradeMode && <div><dt>Upgrade credit applied</dt><dd>−{quote.creditLabel}</dd></div>}
            {needsTrack && <div><dt>Full Stack track</dt><dd>{devTrack.toUpperCase()}</dd></div>}
            <div><dt>Paid via</dt><dd>{paidVia}</dd></div>
            <div><dt>Active till</dt><dd>{quote.validTillLabel}</dd></div>
            <div><dt>Transaction ID</dt><dd>{txnId}</dd></div>
            <div><dt>Receipt sent to</dt><dd>{details.email}</dd></div>
          </dl>
          <Link to="/dashboard" className="co-btn co-btn-primary">Go to my dashboard <ArrowRight size={16} /></Link>
          <p className="co-demo">Demo checkout — no real payment was made.</p>
        </div>
      </div>
    );
  }

  /* ─────────────── Checkout ─────────────── */
  return (
    <div className="co-page">
      <div className="co-shell">
        {/* ── Left: plan ── */}
        <section className="co-left">
          <div className="co-brand-row">
            <Link to="/" className="co-brand"><img src="/cipherschools-logo.png" alt="" /> CipherSchools</Link>
            <button
              type="button"
              className="co-back"
              onClick={() => (upgradeMode ? navigate('/dashboard') : navigate(`/premium/checkout/${slug}`, { state: { fromPremiumCta: true, details } }))}
            >
              <ArrowLeft size={14} /> {upgradeMode ? 'Back to dashboard' : 'Edit details'}
            </button>
          </div>

          <h1 className="co-title">{upgradeMode ? 'Upgrade to' : 'Activate'} CipherSchools {plan.name}</h1>
          {upgradeMode
            ? <p className="co-muted co-sub">From <strong>{fromPlan.name}</strong> · you pay only the difference.</p>
            : <p className="co-muted co-sub">{plan.pitch}</p>}

          <div className="co-plans" role="radiogroup" aria-label="Plan">
            {options.map((p) => {
              const q = upgradeQuote(upgradeMode ? upgradeFrom : null, p.id);
              const Icon = PLAN_ICONS[p.id] || Sparkles;
              const on = p.id === plan.id;
              return (
                <button key={p.id} type="button" role="radio" aria-checked={on} className={`co-plan ${on ? 'active' : ''}`} onClick={() => choosePlan(p.id)}>
                  <span className="co-radio" aria-hidden="true" />
                  <span className="co-plan-name"><Icon size={15} /> {p.name}</span>
                  <span className="co-plan-price">
                    <strong>{upgradeMode ? q.payableLabel : p.monthlyPriceFormatted}</strong>
                    <span className="co-muted co-small">{upgradeMode ? 'to upgrade' : '/ month'}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {needsTrack && (
            <>
              <h2 className="co-h2">Choose your Full Stack track <span className="co-muted co-small">· Ultra gets both</span></h2>
              <div className={`co-tracks ${touched.devTrack && errors.devTrack ? 'has-error' : ''}`} role="radiogroup" aria-label="Full Stack track">
                {DEV_TRACKS.map((t) => (
                  <button key={t} type="button" role="radio" aria-checked={devTrack === t} className={`co-plan co-track ${devTrack === t ? 'active' : ''}`} onClick={() => setDevTrack(t)}>
                    <span className="co-radio" aria-hidden="true" />
                    <span className="co-plan-main">
                      <span className="co-plan-name">{t.toUpperCase()}</span>
                      <span className="co-muted co-small">{DEV_TRACK_LABELS[t]}</span>
                    </span>
                  </button>
                ))}
              </div>
              {touched.devTrack && errors.devTrack && <span className="co-error">{errors.devTrack}</span>}
            </>
          )}

          <h2 className="co-h2">What you'll unlock</h2>
          <ul className="co-unlocks">
            {unlocks.map((u) => (
              <li key={u.title}><Check size={15} /><span>{u.title}</span></li>
            ))}
          </ul>
        </section>

        {/* ── Right: payment ── */}
        <form className="co-right" onSubmit={onPay} noValidate>
          <div className="co-seg" role="tablist" aria-label="Payment method">
            {METHODS.map(({ id, label, Icon }) => (
              <button key={id} type="button" role="tab" aria-selected={method === id} className={method === id ? 'active' : ''} onClick={() => { setMethod(id); setTouched({}); }}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          <Field label="Billed to" error={show('billedTo')}>
            <input type="text" value={fields.billedTo} onChange={set('billedTo')} onBlur={blur('billedTo')} autoComplete="name" />
          </Field>

          {method === 'upi' && (
            <Field label="UPI ID" error={show('upiId')}>
              <input type="text" placeholder="yourname@okbank" value={fields.upiId} onChange={set('upiId')} onBlur={blur('upiId')} autoComplete="off" />
            </Field>
          )}

          {method === 'card' && (
            <>
              <Field label="Card number" error={show('cardNumber')}>
                <div className="co-input-wrap">
                  <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" value={fields.cardNumber} onChange={set('cardNumber', formatCardNumber)} onBlur={blur('cardNumber')} autoComplete="off" />
                  <span className="co-networks" aria-hidden="true"><span>RuPay</span><span>VISA</span><span>Mastercard</span></span>
                </div>
              </Field>
              <div className="co-row-2">
                <Field error={show('expiry')}>
                  <input type="text" inputMode="numeric" placeholder="MM / YY" value={fields.expiry} onChange={set('expiry', formatExpiry)} onBlur={blur('expiry')} autoComplete="off" aria-label="Expiry" />
                </Field>
                <Field error={show('cvv')}>
                  <input type="password" inputMode="numeric" placeholder="CVV" maxLength={3} value={fields.cvv} onChange={set('cvv', (v) => v.replace(/\D/g, ''))} onBlur={blur('cvv')} autoComplete="off" aria-label="CVV" />
                </Field>
              </div>
            </>
          )}

          {method === 'netbanking' && (
            <Field label="Bank" error={show('bank')}>
              <div className="co-select">
                <select value={fields.bank} onChange={set('bank')} onBlur={blur('bank')}>
                  <option value="" disabled>Choose your bank</option>
                  {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <ChevronDown size={16} />
              </div>
            </Field>
          )}

          <div className="co-row-3">
            <Field label="State" error={show('state')}>
              <div className="co-select">
                <select value={fields.state} onChange={set('state')} onBlur={blur('state')}>
                  <option value="" disabled>Choose</option>
                  {STATES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
                <ChevronDown size={16} />
              </div>
            </Field>
            <Field label="City" error={show('city')}>
              <input type="text" value={fields.city} onChange={set('city')} onBlur={blur('city')} autoComplete="address-level2" />
            </Field>
            <Field label="PIN code" error={show('pin')}>
              <input type="text" inputMode="numeric" maxLength={6} value={fields.pin} onChange={set('pin', (v) => v.replace(/\D/g, ''))} onBlur={blur('pin')} autoComplete="postal-code" />
            </Field>
          </div>

          <div className="co-total-block">
            <dl className="co-lines">
              <div><dt>{plan.name} · 12 months{needsTrack && devTrack ? ` · ${devTrack.toUpperCase()}` : ''}</dt><dd><s>{quote.listLabel}</s> {quote.priceLabel}</dd></div>
              {upgradeMode && <div className="co-save"><dt>{fromPlan.name} plan credit</dt><dd>−{quote.creditLabel}</dd></div>}
            </dl>
            <div className="co-total">
              <span>Total</span>
              <strong>{quote.payableLabel}</strong>
            </div>
            <p className="co-muted co-small co-valid">Valid till {quote.validTillLabel} · 7-day money-back guarantee</p>
          </div>

          <button type="submit" className="co-btn co-btn-primary co-pay" disabled={status === 'processing'}>
            {status === 'processing'
              ? <><Loader2 size={16} className="co-spin" /> Processing…</>
              : <><Lock size={15} /> {upgradeMode ? `Upgrade · Pay ${quote.payableLabel}` : `Pay ${quote.payableLabel}`}</>}
          </button>

          <p className="co-secure"><ShieldCheck size={14} /> Secure payment · Demo checkout, nothing is charged</p>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <label className={`co-field ${error ? 'has-error' : ''}`}>
    {label && <span className="co-label">{label}</span>}
    {children}
    {error && <span className="co-error">{error}</span>}
  </label>
);

export default PlanPaymentPage;
