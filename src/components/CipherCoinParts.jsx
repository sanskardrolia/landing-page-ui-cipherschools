import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { CHECKIN_LADDER } from '../utils/cipherCoins';

/* Shared CipherCoins pieces: coin, check-in dots, level badge, mission row */

export const Coin = ({ size = 18 }) => (
  <span className="dx-coin" style={{ width: size, height: size, fontSize: size * 0.54 }} aria-hidden="true">C</span>
);

/* The 7-day check-in cycle as small dots (done · today · ahead) */
export const CheckinDots = ({ coins, onDark }) => {
  const done = coins.checkedToday ? coins.ladderPos + 1 : coins.ladderPos;
  return (
    <ol className={`dx-ckd ${onDark ? 'on-dark' : ''}`} aria-label={`Check-in day ${done} of ${CHECKIN_LADDER.length}`}>
      {CHECKIN_LADDER.map((amt, i) => (
        <li key={i} className={i < done ? 'is-done' : ''} title={`Day ${i + 1}: +${amt}`}>
          <span>{i < done ? <Check size={11} strokeWidth={3} /> : i + 1}</span>
        </li>
      ))}
    </ol>
  );
};

/* Level badge: a shield with the number and a LEVEL ribbon; grey until reached */
export const LevelBadge = ({ level, state = 'passed', size = 64 }) => (
  <span className={`dx-lvb is-${state}`} style={{ '--s': `${size}px` }} aria-hidden="true">
    <span className="dx-lvb-shield"><span>{level}</span></span>
    <span className="dx-lvb-ribbon">LEVEL</span>
  </span>
);

export const MissionRow = ({ m, onClaim, onGo }) => (
  <div className={`dx-ms is-${m.status}`}>
    <span className="dx-ms-text">
      <strong>{m.title}</strong>
      <small>{m.desc}</small>
      {m.total > 1 && m.status === 'open' && (
        <span className="dx-ms-prog">
          <span className="dx-ms-bar" aria-hidden="true"><span style={{ width: `${Math.round((m.done / m.total) * 100)}%` }} /></span>
          <em>{m.done}/{m.total}</em>
        </span>
      )}
    </span>
    <span className="dx-ms-reward"><Coin size={13} /> {m.reward}</span>
    {m.status === 'ready' && <button type="button" className="dx-ms-cta is-claim" onClick={() => onClaim(m)}>Claim</button>}
    {m.status === 'claimed' && <span className="dx-ms-cta is-claimed"><Check size={14} /> Done</span>}
    {m.status === 'open' && (m.to
      ? <Link to={m.to} className="dx-ms-cta is-go" onClick={onGo} aria-label={`Go: ${m.title}`}><ArrowRight size={15} /></Link>
      : <span className="dx-ms-cta is-claimed">—</span>)}
  </div>
);
