import React from 'react';
import './Diwali.css';

const sparkles = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 47 + 11) % 100,
  size: 2 + ((i * 5) % 4),
  duration: 9 + ((i * 7) % 9),
  delay: -((i * 13) % 14),
}));

/* Full-section ambience: rising golden sparkles + warm glow */
const DiwaliHeroLayer = () => (
  <div className="diwali-hero-layer" aria-hidden="true">
    {sparkles.map((s, i) => (
      <span
        key={i}
        className="diwali-sparkle"
        style={{
          left: `${s.left}%`,
          width: s.size,
          height: s.size,
          animationDuration: `${s.duration}s`,
          animationDelay: `${s.delay}s`,
        }}
      />
    ))}
  </div>
);

export default DiwaliHeroLayer;
