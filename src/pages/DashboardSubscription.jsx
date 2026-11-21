import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, CircleCheck, Crown, Flame, LifeBuoy, Printer, Receipt, Users, Zap } from 'lucide-react';
import ModuleIcon from '../components/ModuleIcon';
import {
  DEV_TRACK_LABELS, MENTOR_CREDITS_INCLUDED, PLAN_LABELS, allLectures, moduleUnlocked, subjectUnlocked
} from '../data/learnerModules';
import { planById } from '../data/upgrade';
import { mentorCredits } from '../utils/mentorship';

/* ══════════════════════════════════════════════════════════════
   My Subscription — /dashboard/subscription
   The plan bought (no upgrade path inside a paid dashboard): status,
   validity left, what it includes, and the payment record.
   ══════════════════════════════════════════════════════════════ */

const PLAN_ICON = { starter: Zap, plus: Flame, compete: Crown };
const DAY = 86400000;
const fmtDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const DashboardSubscription = ({ ctx }) => {
  const { enrollment, planId, progress } = ctx;
  const plan = planById(planId);
  const Icon = PLAN_ICON[planId] || Zap;
  const [now] = useState(() => Date.now());

  const start = new Date(enrollment.paidAt);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  const totalDays = Math.round((end - start) / DAY);
  const left = Math.max(0, Math.ceil((end - now) / DAY));
  const usedPct = Math.min(100, Math.round(((totalDays - left) / totalDays) * 100));
  const active = left > 0;

  const mods = ctx.modules.filter((m) => moduleUnlocked(m, planId, ctx.devTrack));
  const lectures = mods.reduce((a, m) => a + allLectures(m).length, 0);
  const credits = planId === 'compete' ? mentorCredits(progress) : null;

  const payments = [
    {
      id: enrollment.txnId || '—',
      date: start,
      what: `${PLAN_LABELS[planId]} plan · ${enrollment.durationLabel || '12 Months'}${enrollment.upgradedFrom ? ` (upgrade from ${PLAN_LABELS[enrollment.upgradedFrom]})` : ''}`,
      amount: enrollment.amount || plan?.priceFormatted || '—'
    }
  ];

  return (
    <div className="dx-sub">
      {/* Plan summary */}
      <section className={`dx-sub-hero dx-sub-${planId}`}>
        <div className="dx-sub-plan">
          <span className="dx-sub-badge"><Icon size={20} /></span>
          <div>
            <p className="dx-sub-kicker">Current plan</p>
            <h2>{PLAN_LABELS[planId]}</h2>
            <p className="dx-sub-meta">
              <span className={`dx-sub-status ${active ? 'is-active' : ''}`}>{active ? 'Active' : 'Expired'}</span>
              {enrollment.durationLabel || '12 Months'} · {enrollment.amount || plan?.priceFormatted}
              {ctx.devTrack && planId === 'plus' && <> · {ctx.devTrack.toUpperCase()} track</>}
            </p>
          </div>
        </div>

        <div className="dx-sub-validity">
          <div className="dx-sub-validity-row">
            <span><CalendarClock size={14} /> Valid till <strong>{fmtDate(end)}</strong></span>
            <span><strong>{left}</strong> days left</span>
          </div>
          <div className="dx-sub-meter" role="meter" aria-valuemin={0} aria-valuemax={totalDays} aria-valuenow={totalDays - left} aria-label="Plan time used">
            <span style={{ width: `${usedPct}%` }} />
          </div>
          <div className="dx-sub-validity-row is-small">
            <span>Started {fmtDate(start)}</span>
            <span>{usedPct}% used</span>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="dx-sub-stats" aria-label="Plan at a glance">
        <div><strong>{mods.length}</strong><span>Modules</span></div>
        <div><strong>{lectures}</strong><span>Lectures</span></div>
        <div><strong>{planId === 'compete' ? 'Company' : 'Generic'}</strong><span>Test type</span></div>
        <div><strong>{credits ? `${credits.left}/${MENTOR_CREDITS_INCLUDED + credits.bought}` : '—'}</strong><span>Mentor credits</span></div>
      </section>

      <div className="dx-sub-grid">
        {/* What the plan includes */}
        <section className="dx-sub-card">
          <header className="dx-sub-card-head"><h3>What's included</h3><span>{mods.length} modules</span></header>
          <ul className="dx-sub-mods">
            {mods.map((m) => {
              const subs = m.subjects.filter((s) => subjectUnlocked(m, s, planId, ctx.devTrack));
              return (
                <li key={m.id}>
                  <Link to={`/dashboard/m/${m.id}`} className="dx-sub-mod">
                    <span className="dx-mc-icon"><ModuleIcon mod={m} size={15} /></span>
                    <span className="dx-sub-mod-text">
                      <strong>{m.title}</strong>
                      {m.subjects.length > 1 && <small>{subs.map((s) => s.title).join(' · ')}</small>}
                    </span>
                    <CircleCheck size={15} className="dx-sub-ok" />
                  </Link>
                </li>
              );
            })}
            {credits && (
              <li>
                <Link to="/dashboard/mentorship" className="dx-sub-mod">
                  <span className="dx-mc-icon"><Users size={15} /></span>
                  <span className="dx-sub-mod-text"><strong>1:1 Mentorship</strong><small>{MENTOR_CREDITS_INCLUDED} credits included · {credits.left} left</small></span>
                  <CircleCheck size={15} className="dx-sub-ok" />
                </Link>
              </li>
            )}
          </ul>
          {planId === 'plus' && ctx.devTrack && <p className="dx-sub-note">Full Stack track: {DEV_TRACK_LABELS[ctx.devTrack]}</p>}
        </section>

        <div className="dx-sub-side">
          {/* Payments */}
          <section className="dx-sub-card">
            <header className="dx-sub-card-head"><h3><Receipt size={15} /> Payment history</h3></header>
            <ul className="dx-sub-pay">
              {payments.map((p) => (
                <li key={p.id}>
                  <span className="dx-sub-pay-text">
                    <strong>{p.what}</strong>
                    <small>{fmtDate(p.date)} · Txn {p.id}</small>
                  </span>
                  <span className="dx-sub-pay-amt">{p.amount}<em>Paid</em></span>
                </li>
              ))}
            </ul>
            <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => window.print()}><Printer size={14} /> Print receipt</button>
          </section>

          <section className="dx-sub-card dx-sub-help">
            <div>
              <h3>Questions about billing?</h3>
              <p>Refunds, invoices or a payment that didn't go through.</p>
            </div>
            <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={ctx.openSupport}><LifeBuoy size={14} /> Contact support</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardSubscription;
