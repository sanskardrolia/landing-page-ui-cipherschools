import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarClock, Check, Crown, Flame, Sparkles, X } from 'lucide-react';
import { planSlug, upgradeBenefits, upgradeQuote, upgradeTargets } from '../data/upgrade';

/* ══════════════════════════════════════════════════════════════
   Smart upgrade pop-up (dashboard). Shows only higher tiers, what
   each adds, and the exact amount: new price − current plan price.
   Continue → checkout in upgrade mode (details already known).
   ══════════════════════════════════════════════════════════════ */

const ICONS = { plus: Flame, compete: Crown };

const DashboardUpgrade = ({ ctx, initialTarget, onClose }) => {
  const { planId, enrollment } = ctx;
  const navigate = useNavigate();
  const targets = upgradeTargets(planId);
  const [selected, setSelected] = useState(
    targets.some((t) => t.id === initialTarget) ? initialTarget : targets[0]?.id
  );

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const currentValid = new Date(enrollment.paidAt);
  currentValid.setFullYear(currentValid.getFullYear() + 1);
  const currentValidLabel = currentValid.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const currentName = { starter: 'Core', plus: 'Plus', compete: 'Ultra' }[planId];

  const quote = selected ? upgradeQuote(planId, selected) : null;
  const benefits = selected ? upgradeBenefits(planId, selected, enrollment.devTrack) : [];

  const goCheckout = () => {
    onClose();
    navigate(`/premium/checkout/${planSlug(selected)}/payment`, {
      state: { fromPremiumCta: true, details: enrollment.learner, upgradeFrom: planId }
    });
  };

  return (
    <div className="dx-dialog-backdrop" onClick={onClose}>
      <div className="dx-dialog dx-upg" role="dialog" aria-modal="true" aria-label="Upgrade your plan" onClick={(e) => e.stopPropagation()}>
        <div className="dx-dialog-head">
          <div>
            <h2>{targets.length ? 'Upgrade your plan' : "You're on the highest plan"}</h2>
            <p className="dx-muted dx-small">On <strong>{currentName}</strong> · active till {currentValidLabel}</p>
          </div>
          <button type="button" className="dx-icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        {targets.length === 0 ? (
          <p className="dx-muted">Ultra already includes every module with the highest limits. Nothing to upgrade.</p>
        ) : (
          <>
            <div className="dx-upg-options" role="radiogroup" aria-label="Choose a plan">
              {targets.map((t) => {
                const q = upgradeQuote(planId, t.id);
                const Icon = ICONS[t.id] || Sparkles;
                const on = selected === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    className={`dx-upg-option ${on ? 'active' : ''}`}
                    onClick={() => setSelected(t.id)}
                  >
                    <span className="dx-upg-radio" aria-hidden="true" />
                    <span className="dx-upg-option-name"><Icon size={16} /> {t.name}</span>
                    <span className="dx-upg-option-price">
                      <strong>{q.payableLabel}</strong>
                      <span className="dx-muted dx-small">to upgrade</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="dx-upg-body">
              <div className="dx-upg-benefits">
                <h3>What you'll unlock</h3>
                <ul>
                  {benefits.map((b) => (
                    <li key={b.title}>
                      <Check size={15} />
                      <span>{b.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="dx-upg-bill">
                <h3>You pay only the difference</h3>
                <dl>
                  <div><dt>{quote.target.name} · 12 months</dt><dd><s className="dx-muted">{quote.listLabel}</s> {quote.priceLabel}</dd></div>
                  <div className="dx-upg-save"><dt>{currentName} plan credit</dt><dd>−{quote.creditLabel}</dd></div>
                  <div className="dx-upg-total"><dt>Today</dt><dd>{quote.payableLabel}</dd></div>
                </dl>
                <p className="dx-upg-valid"><CalendarClock size={14} /><span>Valid till {quote.validTillLabel} (12 months from today)</span></p>
              </div>
            </div>

            <div className="dx-dialog-actions">
              <button type="button" className="dx-btn dx-btn-ghost" onClick={onClose}>Not now</button>
              <button type="button" className="dx-btn dx-btn-primary" onClick={goCheckout}>
                Continue · {quote.payableLabel} <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardUpgrade;
