import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Crown, Flame, Lock, ShieldCheck, X, Zap } from 'lucide-react';
import { PLAN_BLURBS, planById, planSlug } from '../data/upgrade';
import { DEV_TRACKS } from '../data/learnerModules';
import { plansIncluding } from '../utils/preview';

/* ══════════════════════════════════════════════════════════════
   Preview mode pop-up: shown when a guest taps anything locked.
   Lists the plans that include what they tapped (or all plans),
   with Plus pre-selected when it qualifies, and sends them to the
   normal purchase flow (details form → payment).
   ══════════════════════════════════════════════════════════════ */

const ICONS = { starter: Zap, plus: Flame, compete: Crown };
const ALL = ['starter', 'plus', 'compete'];

const DashboardPreviewPlans = ({ mod, target, onClose }) => {
  const navigate = useNavigate();
  const ids = mod ? plansIncluding(mod) : target ? ALL.slice(ALL.indexOf(target)) : ALL;
  const plans = ids.map(planById);
  const [selected, setSelected] = useState(ids.includes('plus') ? 'plus' : ids[0]);
  const plan = planById(selected);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const names = plans.map((p) => p.name);
  const includedIn = names.length === 3 ? 'every plan' : names.length === 2 ? `${names[0]} and ${names[1]}` : `${names[0]} only`;
  const title = mod ? `Unlock ${mod.title}` : target === 'compete' ? 'Unlock with Ultra' : 'Choose your plan';
  const isTrack = mod && DEV_TRACKS.includes(mod.id);

  const buy = () => {
    onClose();
    navigate(`/premium/checkout/${planSlug(selected)}`, { state: { fromPremiumCta: true } });
  };

  return (
    <div className="dx-dialog-backdrop" onClick={onClose}>
      <div className="dx-dialog dx-pv" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="dx-dialog-head">
          <div>
            <span className="dx-pv-kicker"><Lock size={13} /> Locked in preview</span>
            <h2>{title}</h2>
            <p className="dx-muted dx-small">
              {mod || target === 'compete' ? `Included in ${includedIn}.` : 'Everything you see in this dashboard unlocks with a plan.'}
              {isTrack && ' Plus includes one Full Stack track, Ultra includes both.'}
            </p>
          </div>
          <button type="button" className="dx-icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <div className="dx-upg-options dx-pv-options" role="radiogroup" aria-label="Choose a plan">
          {plans.map((p) => {
            const Icon = ICONS[p.id];
            const on = selected === p.id;
            return (
              <button key={p.id} type="button" role="radio" aria-checked={on} className={`dx-upg-option ${on ? 'active' : ''}`} onClick={() => setSelected(p.id)}>
                <span className="dx-upg-radio" aria-hidden="true" />
                <span className="dx-upg-option-main">
                  <span className="dx-upg-option-name"><Icon size={16} /> {p.name}{p.isPopular && <em className="dx-pv-pop">Most popular</em>}</span>
                  <span className="dx-muted dx-small">{PLAN_BLURBS[p.id]}</span>
                </span>
                <span className="dx-upg-option-price">
                  <strong>{p.monthlyPriceFormatted}<small>/mo</small></strong>
                  <span className="dx-muted dx-small"><s>{p.originalMonthlyPrice}</s> · {p.discount}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="dx-pv-note"><ShieldCheck size={14} /> {plan.priceFormatted} billed for 12 months · 7-day money-back guarantee</p>

        <div className="dx-dialog-actions">
          <button type="button" className="dx-btn dx-btn-ghost" onClick={onClose}>Keep exploring</button>
          <button type="button" className="dx-btn dx-btn-primary" onClick={buy}>
            Get {plan.name} · {plan.priceFormatted} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreviewPlans;
