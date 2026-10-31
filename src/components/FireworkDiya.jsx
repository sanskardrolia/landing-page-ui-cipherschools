import React, { useState } from 'react';
import Diya from './Diya';
import { useDiyaCollection } from '../hooks/useDiwali';
import './Diwali.css';

const STREAKS = 12;
const streakAngles = Array.from({ length: STREAKS }, (_, i) => (360 / STREAKS) * i);
let burstId = 0;

/* Diya that sets off a small, quiet firework behind it when tapped */
const FireworkDiya = ({ id, size = 40, className = '' }) => {
  const [bursts, setBursts] = useState([]);
  const [popped, setPopped] = useState(false);
  const { collected, collect } = useDiyaCollection();
  const isCollected = collected.includes(id);

  const fire = () => {
    const burst = ++burstId;
    setBursts((b) => [...b, burst]);
    if (id && collect(id)) {
      setPopped(true);
      setTimeout(() => setPopped(false), 1200);
    }
  };

  const clear = (burst) => setBursts((b) => b.filter((x) => x !== burst));

  return (
    <button
      type="button"
      className={`diwali-diya-btn ${isCollected ? 'is-collected' : ''} ${className}`}
      onClick={fire}
      aria-label="Light a firework"
    >
      {bursts.map((burst) => (
        <span key={burst} className="diwali-burst" onAnimationEnd={(e) => e.target === e.currentTarget && clear(burst)}>
          <span className="diwali-burst-ring" />
          {streakAngles.map((a, i) => (
            <span
              key={a}
              className="diwali-burst-streak"
              style={{ '--angle': `${a}deg`, '--reach': `${i % 2 ? 34 : 48}px` }}
            />
          ))}
        </span>
      ))}
      <Diya size={size} />
      {popped && <span className="diwali-collect-pop">+1 diya</span>}
    </button>
  );
};

export default FireworkDiya;
