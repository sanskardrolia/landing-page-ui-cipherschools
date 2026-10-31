import React, { useState, useEffect } from 'react';
import Diya from './Diya';
import './SplashScreen.css';

/* Fireworks: position (% of screen), colour, reach (px), stagger (s) */
const FIREWORKS = [
  { left: 16, top: 26, color: '#F3912E', reach: 110, delay: 0.1 },
  { left: 84, top: 22, color: '#E0A21B', reach: 124, delay: 0.55 },
  { left: 50, top: 14, color: '#E5457A', reach: 96, delay: 1.0 },
  { left: 26, top: 58, color: '#7C4DDB', reach: 88, delay: 1.45 },
  { left: 76, top: 56, color: '#F3912E', reach: 100, delay: 1.85 },
];
const STREAKS = Array.from({ length: 18 }, (_, i) => (360 / 18) * i);

const STARS = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 53 + 7) % 100,
  top: (i * 29 + 13) % 70,
  size: 1 + (i % 3),
  delay: ((i * 7) % 30) / 10,
}));

const DIYAS = [30, 38, 54, 38, 30];

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Progress counter (0 -> 100% in 2.2 seconds)
    const startTime = Date.now();
    const duration = 2200;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(progressInterval);
    }, 25);

    const exitTimer = setTimeout(() => setIsExiting(true), 2450);
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2950);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 400);
  };

  return (
    <div className={`dw-splash ${isExiting ? 'dw-splash-exit' : ''}`}>
      {/* Stars */}
      <div className="dw-stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="dw-star"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      {/* Fireworks */}
      <div className="dw-fireworks" aria-hidden="true">
        {FIREWORKS.map((f, i) => (
          <div
            key={i}
            className="dw-firework"
            style={{ left: `${f.left}%`, top: `${f.top}%`, '--fw-color': f.color, '--fw-delay': `${f.delay}s` }}
          >
            <span className="dw-firework-rocket" />
            <span className="dw-firework-flash" />
            {STREAKS.map((a, j) => (
              <span
                key={a}
                className="dw-firework-streak"
                style={{ '--angle': `${a}deg`, '--reach': `${j % 2 ? f.reach * 0.68 : f.reach}px` }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Greeting */}
      <div className="dw-center">
        <div className="dw-eyebrow">
          <span className="dw-brand">CipherSchools</span>
          <span className="dw-eyebrow-text">wishes you a</span>
        </div>
        <h1 className="dw-title">
          <span className="dw-title-happy">Happy</span>
          <span className="dw-title-main">Deepawali</span>
        </h1>
        <div className="dw-ornament" aria-hidden="true">
          <span /><i /><span />
        </div>
        <p className="dw-tagline">May every step you take glow with growth.</p>
      </div>

      {/* Diyas */}
      <div className="dw-diya-row" aria-hidden="true">
        {DIYAS.map((size, i) => (
          <span key={i} className="dw-diya" style={{ animationDelay: `${0.3 + i * 0.12}s` }}>
            <Diya size={size} />
          </span>
        ))}
      </div>

      {/* Progress */}
      <div className="dw-progress">
        <div className="dw-progress-info">
          <span>
            {progress < 40 && 'Lighting the diyas'}
            {progress >= 40 && progress < 85 && 'Setting up the celebration'}
            {progress >= 85 && 'Ready'}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="dw-progress-track">
          <div className="dw-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <button type="button" className="dw-skip" onClick={handleSkip} aria-label="Skip Loading Screen">
        Skip
      </button>
    </div>
  );
};

export default SplashScreen;
