import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1. Smooth, snappy progress counter (0 -> 100% in 2.2 seconds)
    const startTime = Date.now();
    const duration = 2200;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressInterval);
      }
    }, 25);

    // 2. Trigger smooth exit peel at 2.45s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2450);

    // 3. Complete and unmount at 2.95s
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
    <div className={`splash-overlay ${isExiting ? 'splash-exit-peel' : ''}`}>
      {/* ── Background Scratchpad Paper with Grid Texture ── */}
      <div className="splash-scratch-canvas">
        <div className="splash-paper-grain"></div>
        <div className="splash-notebook-grid"></div>

        {/* Masking Washi Tape Corners */}
        <div className="splash-washi-tape tape-tl"></div>
        <div className="splash-washi-tape tape-tr"></div>
        <div className="splash-washi-tape tape-br"></div>

        {/* Hand-drawn Floating Doodles & Scratches */}
        <svg className="splash-floating-doodles" viewBox="0 0 1000 700" fill="none">
          <path 
            className="splash-draw-path doodle-squiggle" 
            d="M 60,90 Q 90,60 120,95 T 180,85" 
            stroke="#A1A1AA" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          <path 
            className="splash-draw-path doodle-star" 
            d="M 880,120 L 890,140 L 910,145 L 895,160 L 898,180 L 880,170 L 862,180 L 865,160 L 850,145 L 870,140 Z" 
            stroke="#F3912E" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinejoin="round" 
          />
          <path 
            className="splash-draw-path doodle-arrow" 
            d="M 140,540 C 180,520 220,580 200,620 C 190,640 160,630 180,600 L 210,590" 
            stroke="#71717A" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          <path 
            className="splash-draw-path doodle-sparkle" 
            d="M 840,520 L 840,560 M 820,540 L 860,540 M 826,526 L 854,554 M 826,554 L 854,526" 
            stroke="#F3912E" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          <path 
            className="splash-draw-path doodle-scratches" 
            d="M 80,320 L 110,340 M 85,335 L 115,355 M 90,350 L 120,370" 
            stroke="#D4D4D8" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
        </svg>

        {/* ── Main Scratch Center Card ── */}
        <div className="splash-center-sheet">
          
          {/* Header Annotation */}
          <div className="splash-sheet-topbar">
            <span className="splash-badge-scribble splash-badge-revamped">
              <span className="scribble-dot"></span>
              CORE_V2 // 2026
            </span>
            <span className="splash-stamp-date">OFFICIAL RELEASE</span>
          </div>

          {/* ── PRIORITY 'WE GOT REVAMPED' HERO STAGE ── */}
          <div className="splash-revamped-hero-stage">
            
            <div className="splash-eyebrow-pill animate-pop-in">
              <span className="eyebrow-sparkle">✦</span>
              <span>MAJOR PLATFORM OVERHAUL</span>
              <span className="eyebrow-sparkle">✦</span>
            </div>

            {/* Giant Prioritized Headline with Highlighted REVAMPED */}
            <h1 className="splash-priority-headline animate-headline-slam">
              <span className="splash-we-got">WE GOT</span>
              <span className="splash-revamped-highlight-box">
                <span className="splash-revamped-text">REVAMPED</span>
                {/* Hand-drawn Underline Squiggle */}
                <svg className="splash-brush-underline" viewBox="0 0 280 22" fill="none">
                  <path d="M 6,15 Q 75,4 145,17 T 274,10" stroke="#18181B" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span className="splash-highlight-star star-tl">★</span>
                <span className="splash-highlight-star star-br">✦</span>
              </span>
            </h1>

            {/* Subnote with handwritten arrow */}
            <div className="splash-revamped-subnote animate-subnote-fade">
              <span className="subnote-arrow">↳</span>
              <span className="subnote-text">Next-Gen AI Compilers • Modern UI • Real-time Labs</span>
            </div>

            {/* Funky Stickers Row */}
            <div className="splash-stickers-row">
              <span className="splash-funky-sticker sticker-highlight-revamped">★ 100% REVAMPED</span>
              <span className="splash-funky-sticker sticker-orange">AI COMPILERS</span>
              <span className="splash-funky-sticker sticker-dark">CAMPUS ECOSYSTEM</span>
            </div>

          </div>

          {/* ── BOTTOM PROGRESS & SCRATCHPAD METER ── */}
          <div className="splash-bottom-meter">
            <div className="splash-progress-info">
              <span className="splash-progress-status">
                {progress < 40 && '⚡ Loading revamped architecture...'}
                {progress >= 40 && progress < 85 && '🚀 Syncing new AI practice tracks...'}
                {progress >= 85 && '✨ All set! Ready to explore!'}
              </span>
              <span className="splash-progress-number">{progress}%</span>
            </div>

            {/* Hand-drawn sketchy progress track */}
            <div className="splash-progress-track">
              <div 
                className="splash-progress-fill" 
                style={{ width: `${progress}%` }}
              >
                <div className="splash-fill-stripes"></div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Quick Skip Pill ── */}
        <button 
          type="button" 
          className="splash-skip-btn" 
          onClick={handleSkip}
          aria-label="Skip Loading Screen"
        >
          Skip Intro <span>→</span>
        </button>

      </div>
    </div>
  );
};

export default SplashScreen;
