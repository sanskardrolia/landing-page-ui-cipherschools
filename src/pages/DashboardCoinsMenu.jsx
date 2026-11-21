import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { Coin } from '../components/CipherCoinParts';
import { buildMissions, fmtCoins } from '../utils/cipherCoins';

/* ══════════════════════════════════════════════════════════════
   Top bar › CipherCoins pill + a small drop-down: balance & level,
   streak, and one thing to do (claim, or the next daily mission).
   Check-in is automatic; it shows in the toast below.
   ══════════════════════════════════════════════════════════════ */

const CoinsMenu = ({ ctx }) => {
  const { coins } = ctx;
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open]);

  const all = buildMissions(ctx, coins).groups.flatMap((g) => g.items);
  const ready = all.filter((m) => m.status === 'ready');
  const nextDaily = all.find((m) => m.group === 'daily' && m.status === 'open');
  const { level } = coins;
  const close = () => setOpen(false);

  return (
    <div className="dx-coins" ref={wrap}>
      <button type="button" className={`dx-coins-pill ${open ? 'is-open' : ''}`} onClick={() => setOpen((v) => !v)} aria-haspopup="dialog" aria-expanded={open} title="CipherCoins">
        <Coin size={17} />
        <strong>{fmtCoins(coins.balance)}</strong>
        {ready.length > 0 && <span className="dx-coins-ping" aria-label={`${ready.length} to claim`} />}
      </button>

      {open && (
        <div className="dx-coins-pop" role="dialog" aria-label="CipherCoins">
          <div className="dx-coins-bal">
            <Coin size={28} />
            <span><strong>{fmtCoins(coins.balance)}</strong><small>CipherCoins</small></span>
            <span className="dx-coins-lv">Level {level.level}</span>
          </div>
          {level.next && (
            <div className="dx-coins-lvbar">
              <span className="dx-coins-bar" aria-hidden="true"><span style={{ width: `${level.pct}%` }} /></span>
              <small>{fmtCoins(level.next - coins.earned)} to Level {level.level + 1}</small>
            </div>
          )}

          <div className="dx-coins-row">
            <Flame size={15} className="dx-coins-flame" />
            <span>{coins.checkinStreak}-day streak</span>
            <small>Checked in today</small>
          </div>

          {ready.length > 0 ? (
            <div className="dx-coins-row is-action">
              <span>{ready.length} {ready.length === 1 ? 'mission' : 'missions'} ready <b>+{fmtCoins(ready.reduce((a, m) => a + m.reward, 0))}</b></span>
              <button type="button" className="dx-coins-claim" onClick={() => coins.claimMany(ready)}>Claim</button>
            </div>
          ) : nextDaily && (
            <Link to={nextDaily.to} className="dx-coins-row is-action is-link" onClick={close}>
              <span>{nextDaily.title} <small>{nextDaily.done}/{nextDaily.total}</small></span>
              <b>+{nextDaily.reward}</b>
            </Link>
          )}

          <Link to="/dashboard/coins" className="dx-coins-all" onClick={close}>How to earn & rewards <ArrowRight size={14} /></Link>
        </div>
      )}
    </div>
  );
};

/* Bottom-right toast: auto check-in (with streak) and every claim */
export const CoinToast = ({ coins }) => (coins.toast ? (
  <div className="dx-coin-toast" role="status" key={coins.toast.id}>
    {coins.toast.kind === 'checkin' ? <span className="dx-coin-toast-flame"><Flame size={18} /></span> : <Coin size={22} />}
    <span>
      <strong>{coins.toast.kind === 'checkin' ? 'Daily check-in' : coins.toast.label} <b>+{coins.toast.amount}</b></strong>
      <small>{coins.toast.kind === 'checkin' ? coins.toast.label : 'Added to your CipherCoins'}</small>
    </span>
    <button type="button" className="dx-icon-btn" onClick={coins.dismissToast} aria-label="Dismiss">×</button>
  </div>
) : null);

export default CoinsMenu;
