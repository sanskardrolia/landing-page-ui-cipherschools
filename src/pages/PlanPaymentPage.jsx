import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Building2, CheckCircle2, CreditCard, Info, Loader2, Lock, ShieldCheck, Smartphone
} from 'lucide-react';
import { planFromSlug } from './PlanCheckoutPage';
import { saveEnrollment } from '../utils/enrollment';
import './PremiumPage.css';
import './PlanCheckoutPage.css';
import './PlanPaymentPage.css';

/* ──────────────────────────────────────────────────────────────
   DEMO payment page — no gateway is called and nothing is charged.
   Swap `simulatePayment` for the real gateway call when it exists.
   ────────────────────────────────────────────────────────────── */

const METHODS = [
  { id: 'upi', label: 'UPI', Icon: Smartphone },
  { id: 'card', label: 'Card', Icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', Icon: Building2 }
];

const UPI_APPS = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'];
const BANKS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank',
  'Punjab National Bank', 'Bank of Baroda', 'Yes Bank', 'IDFC FIRST Bank', 'Canara Bank'
];
const POPULAR_BANKS = BANKS.slice(0, 4);

const simulatePayment = () => new Promise((resolve) => setTimeout(resolve, 1800));

const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const validateMethod = (method, f) => {
  const e = {};
  if (method === 'upi') {
    if (!/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(f.upiId.trim())) e.upiId = 'Enter a valid UPI ID (e.g. name@okbank)';
  }
  if (method === 'card') {
    if (f.cardNumber.replace(/\s/g, '').length !== 16) e.cardNumber = 'Enter the 16-digit card number';
    const [mm, yy] = f.expiry.split('/');
    const m = Number(mm);
    if (!(m >= 1 && m <= 12) || !yy || yy.length !== 2) e.expiry = 'Use MM/YY';
    else {
      const now = new Date();
      const exp = new Date(2000 + Number(yy), m); // first day of the month after expiry
      if (exp <= now) e.expiry = 'This card has expired';
    }
    if (!/^\d{3,4}$/.test(f.cvv)) e.cvv = '3 or 4 digits';
    if (f.cardName.trim().length < 2) e.cardName = 'Enter the name on the card';
  }
  if (method === 'netbanking') {
    if (!f.bank) e.bank = 'Choose your bank';
  }
  return e;
};

const PlanPaymentPage = () => {
  const { planSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const plan = planFromSlug(planSlug);
  const details = location.state?.details;

  const [method, setMethod] = useState('upi');
  const [fields, setFields] = useState({ upiId: '', cardNumber: '', expiry: '', cvv: '', cardName: '', bank: '' });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | processing | success
  const txnId = useMemo(() => `DEMO${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`, []);

  // Top of page on arrival, and again when the confirmation replaces the form
  useEffect(() => { if (status !== 'processing') window.scrollTo(0, 0); }, [status]);

  // Only reachable by submitting the details form — otherwise back to plans.
  if (!plan || !location.state?.fromPremiumCta || !details) {
    return <Navigate to="/premium" replace />;
  }

  const errors = validateMethod(method, fields);
  const show = (k) => touched[k] && errors[k];
  const set = (k, transform = (v) => v) => (ev) => setFields((f) => ({ ...f, [k]: transform(ev.target.value) }));
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const switchMethod = (id) => {
    if (status !== 'idle') return;
    setMethod(id);
    setTouched({});
  };

  const onPay = async (ev) => {
    ev.preventDefault();
    setTouched({ upiId: true, cardNumber: true, expiry: true, cvv: true, cardName: true, bank: true });
    if (Object.keys(errors).length) return;
    setStatus('processing');
    await simulatePayment();
    // Unlocks the learner dashboard (demo: stored in this browser only)
    saveEnrollment({
      planId: plan.id,
      planName: plan.name,
      durationLabel: plan.durationLabel,
      amount: plan.priceFormatted,
      txnId,
      paidAt: new Date().toISOString(),
      learner: details
    });
    setStatus('success');
  };

  const editDetails = () =>
    navigate(`/premium/checkout/${planSlug}`, { state: { fromPremiumCta: true, details } });

  const methodLabel = METHODS.find((m) => m.id === method)?.label;
  const paidVia =
    method === 'upi' ? `UPI · ${fields.upiId}` :
    method === 'card' ? `Card · •••• ${fields.cardNumber.replace(/\s/g, '').slice(-4)}` :
    `Net Banking · ${fields.bank}`;

  return (
    <div className="premium-page-viewport plan-checkout-viewport">
      <div className="premium-page-container">
        {status !== 'success' && (
          <button type="button" className="plan-checkout-back pay-back-btn" onClick={editDetails}>
            <ArrowLeft size={15} /> Back to details
          </button>
        )}

        <div className="pay-demo-banner">
          <Info size={15} />
          <span>Demo payment — no real money is charged and no details are sent anywhere.</span>
        </div>

        {status === 'success' ? (
          <div className="pay-success-card">
            <CheckCircle2 size={44} />
            <h1>Payment successful</h1>
            <p>
              Welcome to <strong>{plan.name}</strong>, {details.name.trim().split(' ')[0]}! Your access is active for {plan.durationLabel}.
            </p>
            <ul className="plan-checkout-summary">
              <li><span>Amount paid</span>{plan.priceFormatted}</li>
              <li><span>Paid via</span>{paidVia}</li>
              <li><span>Transaction ID</span>{txnId}</li>
              <li><span>Receipt sent to</span>{details.email}</li>
            </ul>
            <div className="pay-success-actions">
              <Link to="/dashboard" className="plan-checkout-submit submit-plus">Go to my dashboard</Link>
              <Link to="/premium" className="plan-checkout-secondary">Back to plans</Link>
            </div>
          </div>
        ) : (
          <div className="plan-checkout-grid pay-grid">
            {/* ── Left: order summary ── */}
            <aside className="plan-checkout-form-card pay-summary">
              <h2 className="plan-checkout-form-title">Order summary</h2>
              <div className="pay-summary-plan">
                <div>
                  <strong>{plan.name} Plan</strong>
                  <span>{plan.durationLabel} · {plan.monthlyPriceFormatted}/mon</span>
                </div>
                <span className="price-discount-tag">{plan.discount}</span>
              </div>
              <ul className="pay-lines">
                <li><span>Original price</span><s>{plan.originalPrice}</s></li>
                <li><span>Discount</span><em>− ₹{(Number(plan.originalPrice.replace(/\D/g, '')) - plan.price).toLocaleString('en-IN')}</em></li>
                <li className="pay-total"><span>Total payable</span><strong>{plan.priceFormatted}</strong></li>
              </ul>

              <div className="pay-learner">
                <div className="pay-learner-head">
                  <span>Learner</span>
                  <button type="button" onClick={editDetails}>Edit</button>
                </div>
                <p><strong>{details.name}</strong></p>
                <p>{details.email}</p>
                <p>+91 {details.phone}</p>
                <p>{details.college} · {details.passoutYear}</p>
              </div>

              <div className="plan-footer-assurance pay-assurance">
                <ShieldCheck size={14} />
                <span>100% money-back 7-day guarantee</span>
              </div>
            </aside>

            {/* ── Right: payment method ── */}
            <section className="plan-checkout-form-card pay-methods-card">
              <h2 className="plan-checkout-form-title">Choose payment method</h2>

              <div className="pay-tabs" role="tablist">
                {METHODS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={method === id}
                    className={`pay-tab ${method === id ? 'active' : ''}`}
                    onClick={() => switchMethod(id)}
                  >
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>

              <form onSubmit={onPay} noValidate className="pay-form">
                {method === 'upi' && (
                  <>
                    <div className="pay-upi-apps">
                      {UPI_APPS.map((app) => (
                        <span key={app} className="pay-upi-app">{app}</span>
                      ))}
                    </div>
                    <PayField label="UPI ID" error={show('upiId')}>
                      <input type="text" placeholder="yourname@okbank" autoComplete="off"
                        value={fields.upiId} onChange={set('upiId')} onBlur={blur('upiId')} />
                    </PayField>
                    <p className="pay-hint">You'll get a collect request in your UPI app to approve.</p>
                  </>
                )}

                {method === 'card' && (
                  <>
                    <PayField label="Card Number" error={show('cardNumber')}>
                      <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" autoComplete="off"
                        value={fields.cardNumber} onChange={set('cardNumber', formatCardNumber)} onBlur={blur('cardNumber')} />
                    </PayField>
                    <div className="plan-checkout-row pay-card-row">
                      <PayField label="Expiry" error={show('expiry')}>
                        <input type="text" inputMode="numeric" placeholder="MM/YY" autoComplete="off"
                          value={fields.expiry} onChange={set('expiry', formatExpiry)} onBlur={blur('expiry')} />
                      </PayField>
                      <PayField label="CVV" error={show('cvv')}>
                        <input type="password" inputMode="numeric" placeholder="•••" autoComplete="off" maxLength={4}
                          value={fields.cvv} onChange={set('cvv', (v) => v.replace(/\D/g, ''))} onBlur={blur('cvv')} />
                      </PayField>
                    </div>
                    <PayField label="Name on Card" error={show('cardName')}>
                      <input type="text" placeholder="As printed on the card" autoComplete="off"
                        value={fields.cardName} onChange={set('cardName')} onBlur={blur('cardName')} />
                    </PayField>
                    <p className="pay-hint">Visa, Mastercard, RuPay and Amex accepted.</p>
                  </>
                )}

                {method === 'netbanking' && (
                  <>
                    <div className="pay-bank-grid">
                      {POPULAR_BANKS.map((b) => (
                        <button key={b} type="button"
                          className={`pay-bank-chip ${fields.bank === b ? 'active' : ''}`}
                          onClick={() => setFields((f) => ({ ...f, bank: b }))}
                        >
                          <Building2 size={15} /> {b}
                        </button>
                      ))}
                    </div>
                    <PayField label="Or choose another bank" error={show('bank')}>
                      <select value={fields.bank} onChange={set('bank')} onBlur={blur('bank')}>
                        <option value="" disabled>Select your bank</option>
                        {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </PayField>
                    <p className="pay-hint">You'll be redirected to your bank to log in and approve.</p>
                  </>
                )}

                <button type="submit" className={`plan-checkout-submit submit-${plan.id}`} disabled={status === 'processing'}>
                  {status === 'processing' ? (
                    <><Loader2 size={16} className="pay-spin" /> <span>Processing…</span></>
                  ) : (
                    <><Lock size={15} /> <span>Pay {plan.priceFormatted} via {methodLabel}</span></>
                  )}
                </button>
              </form>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

const PayField = ({ label, error, children }) => (
  <label className={`plan-checkout-field ${error ? 'has-error' : ''}`}>
    <span className="plan-checkout-label">{label}</span>
    {children}
    {error && <span className="plan-checkout-error">{error}</span>}
  </label>
);

export default PlanPaymentPage;
