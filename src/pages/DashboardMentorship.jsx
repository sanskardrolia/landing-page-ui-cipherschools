import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, ChevronRight, Coins, Crown, Lock, Plus, Sparkles, Users, X } from 'lucide-react';
import { CREDIT_PACKS, MENTOR_CREDITS_INCLUDED, MENTOR_FOCUS } from '../data/learnerModules';
import { mentorCredits } from '../utils/mentorship';

/* ══════════════════════════════════════════════════════════════
   1:1 Mentorship (Ultra) — /dashboard/mentorship
   Book a meeting with a mentor using credits: 3 included with Ultra,
   1 credit per meeting, refunded on cancel, more can be bought.
   DEMO: buying credits doesn't charge anything — wire it to the
   payment gateway, and replace the slot list with real availability.
   ══════════════════════════════════════════════════════════════ */

const SLOT_HOURS = [11, 16, 19];
const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}`;
const rupees = (n) => `₹${n.toLocaleString('en-IN')}`;

// Next five days of mentor slots (placeholder availability)
const upcomingSlots = () => {
  const days = [];
  const base = new Date();
  for (let d = 1; d <= 5; d++) {
    const day = new Date(base);
    day.setDate(base.getDate() + d);
    days.push({
      label: day.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      slots: SLOT_HOURS.map((h) => {
        const t = new Date(day);
        t.setHours(h, 0, 0, 0);
        return t.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
      })
    });
  }
  return days;
};

// Preview mode: everything here is visible, but any tap (except the breadcrumb) asks for Ultra
const previewGuard = (ctx) => (e) => {
  if (e.target.closest('.dx-crumbs') || !e.target.closest('a, button, textarea, label')) return;
  e.preventDefault();
  e.stopPropagation();
  ctx.openUpgrade('compete');
};

const DashboardMentorship = ({ ctx }) => {
  const { progress, set, extended } = ctx;
  const credits = mentorCredits(progress);
  const bookings = Object.entries(progress.mentorBookings || {}).map(([id, b]) => ({ id, ...b }));
  const [days] = useState(upcomingSlots);
  const [focus, setFocus] = useState(MENTOR_FOCUS[0]);
  const [slot, setSlot] = useState('');
  const [agenda, setAgenda] = useState('');
  const [buying, setBuying] = useState(null);
  const [notice, setNotice] = useState('');
  const takenSlots = new Set(bookings.map((b) => b.slot));

  const header = (
    <>
      <nav className="dx-crumbs" aria-label="Breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <ChevronRight size={14} />
        <span>1:1 Mentorship</span>
      </nav>
      <header className="dx-mod-head">
        <span className="dx-mc-icon dx-mc-icon-lg"><Users size={22} /></span>
        <div className="dx-mod-head-text">
          <h1>1:1 Mentorship</h1>
          <p className="dx-muted">Book a one-on-one meeting with a mentor for DSA, development, system design or your career.</p>
        </div>
      </header>
    </>
  );

  /* Locked preview for Core / Plus */
  if (!extended) {
    return (
      <div className="dx-module">
        {header}
        <div className="dx-mentor-locked">
          <p className="dx-muted"><Lock size={14} /> 1:1 Mentorship is part of the <strong>Ultra</strong> plan.</p>
          <ul className="dx-locked-list">
            <li><Coins size={15} /> {MENTOR_CREDITS_INCLUDED} meeting credits included with Ultra</li>
            <li><CalendarClock size={15} /> Pick a mentor focus and a time that suits you</li>
            <li><Plus size={15} /> Buy more credits whenever you need them</li>
          </ul>
          <button type="button" className="dx-btn dx-btn-primary" onClick={() => ctx.openUpgrade('compete')}>
            <Sparkles size={16} /> Upgrade to Ultra
          </button>
        </div>
      </div>
    );
  }

  const book = () => {
    if (!slot || credits.left < 1) return;
    set('mentorBookings', makeId('mb'), { focus, slot, agenda: agenda.trim() });
    setNotice(`Booked: ${focus} · ${slot}. 1 credit used.`);
    setSlot('');
    setAgenda('');
  };

  const cancel = (b) => {
    set('mentorBookings', b.id, null);
    setNotice(`Cancelled ${b.slot}. 1 credit refunded.`);
  };

  const buy = () => {
    set('mentorCredits', makeId('mc'), buying.credits);
    setNotice(`${buying.credits} credit${buying.credits > 1 ? 's' : ''} added.`);
    setBuying(null);
  };

  return (
    <div className="dx-module dx-mentor" onClickCapture={ctx.preview ? previewGuard(ctx) : undefined}>
      {header}

      {/* Credits */}
      <section className="dx-mentor-credits">
        <div className="dx-mentor-credit-count">
          <Coins size={22} />
          <strong>{credits.left}</strong>
          <span>{ctx.preview ? 'credits included with Ultra' : `credit${credits.left === 1 ? '' : 's'} left`}</span>
        </div>
        <p className="dx-muted dx-small">
          {credits.included} included with Ultra · {credits.bought} bought · {credits.used} used. Each meeting uses 1 credit; cancelling refunds it.
        </p>
      </section>

      {notice && <p className="dx-mentor-notice" role="status">{notice}</p>}

      {/* Book */}
      <section className="dx-mentor-section">
        <h2>Book a meeting</h2>
        <span className="dx-label-sm">Mentor focus</span>
        <div className="dx-subjects">
          {MENTOR_FOCUS.map((f) => (
            <button key={f} type="button" className={`dx-subject ${focus === f ? 'active' : ''}`} onClick={() => setFocus(f)}>{f}</button>
          ))}
        </div>

        <span className="dx-label-sm">Pick a time</span>
        <div className="dx-mentor-days">
          {days.map((d) => (
            <div key={d.label} className="dx-mentor-day">
              <span className="dx-muted dx-small">{d.label}</span>
              {d.slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`dx-slot ${slot === s ? 'active' : ''}`}
                  disabled={takenSlots.has(s)}
                  onClick={() => setSlot(s)}
                >
                  {s.split(', ').pop()}
                  {takenSlots.has(s) && ' · booked'}
                </button>
              ))}
            </div>
          ))}
        </div>

        <label className="dx-mentor-agenda">
          <span className="dx-label-sm">What would you like to discuss? <em>(optional)</em></span>
          <textarea rows={3} value={agenda} onChange={(e) => setAgenda(e.target.value)} placeholder="e.g. Review my approach to graph problems before my Amazon interview" />
        </label>

        <div className="dx-mentor-book-row">
          <button type="button" className="dx-btn dx-btn-primary" disabled={!ctx.preview && (!slot || credits.left < 1)} onClick={book}>
            {ctx.preview ? <Lock size={16} /> : <CalendarClock size={16} />} Book meeting · uses 1 credit
          </button>
          {credits.left < 1 && <span className="dx-muted dx-small">You're out of credits — buy more below.</span>}
        </div>
      </section>

      {/* Upcoming */}
      <section className="dx-mentor-section">
        <h2>Your meetings</h2>
        {bookings.length === 0 ? (
          <p className="dx-muted dx-small">No meetings booked yet.</p>
        ) : (
          <ul className="dx-mentor-list">
            {bookings.map((b) => (
              <li key={b.id}>
                <CalendarClock size={16} className="dx-mentor-list-icon" />
                <div>
                  <strong>{b.focus}</strong>
                  <span className="dx-muted dx-small">{b.slot}{b.agenda ? ` · ${b.agenda}` : ''}</span>
                </div>
                <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => cancel(b)}>Cancel</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Buy */}
      <section className="dx-mentor-section">
        <h2>Buy more credits</h2>
        <div className="dx-mentor-packs">
          {CREDIT_PACKS.map((p) => (
            <div key={p.id} className="dx-mentor-pack">
              <span className="dx-mentor-pack-credits">{p.credits} credit{p.credits > 1 ? 's' : ''}</span>
              <strong>{rupees(p.price)}</strong>
              <span className="dx-muted dx-small">{rupees(Math.round(p.price / p.credits))} per meeting</span>
              <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => setBuying(p)}>Buy</button>
            </div>
          ))}
        </div>
      </section>

      {buying && (
        <div className="dx-dialog-backdrop" onClick={() => setBuying(null)}>
          <div className="dx-dialog" role="dialog" aria-modal="true" aria-label="Buy mentorship credits" onClick={(e) => e.stopPropagation()}>
            <div className="dx-dialog-head">
              <h2><Crown size={16} /> Buy {buying.credits} credit{buying.credits > 1 ? 's' : ''}</h2>
              <button type="button" className="dx-icon-btn" onClick={() => setBuying(null)} aria-label="Close"><X size={18} /></button>
            </div>
            <p className="dx-muted">{buying.credits} mentorship meeting{buying.credits > 1 ? 's' : ''} for {rupees(buying.price)}. Credits stay valid while your Ultra plan is active.</p>
            <div className="dx-demo-note">Demo: payment goes through the payment gateway here. Nothing is charged in this demo.</div>
            <div className="dx-dialog-actions">
              <button type="button" className="dx-btn dx-btn-ghost" onClick={() => setBuying(null)}>Cancel</button>
              <button type="button" className="dx-btn dx-btn-primary" onClick={buy}>Pay {rupees(buying.price)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMentorship;
