import './AiOrb.css';

/* ══════════════════════════════════════════════════════════════
   The lecture A.I.'s avatar: a soft brand-orange orb.
   idle     → breathes slowly, a light sheen drifts across it
   thinking → the core swirls faster and three small orbs circle it
   still    → no motion at all (used outside the chat, e.g. the Ask A.I. button)
   Pure CSS; honours prefers-reduced-motion.
   ══════════════════════════════════════════════════════════════ */

const AiOrb = ({ size = 28, thinking = false, still = false, className = '' }) => (
  <span className={`ai-orb ${thinking ? 'is-thinking' : ''} ${still ? 'is-still' : ''} ${className}`} style={{ '--orb': `${size}px` }} aria-hidden="true">
    <span className="ai-orb-core" />
    <span className="ai-orb-sheen" />
    <span className="ai-orb-ring"><i /><i /><i /></span>
  </span>
);

export default AiOrb;
