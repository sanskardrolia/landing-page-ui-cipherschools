import React, { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import Diya from './Diya';
import { DIYA_GOAL, DISCOUNT_LABEL } from '../hooks/useDiwali';
import './DiwaliEnvelope.css';

/* Design size of the whole envelope + letter, scaled to fill ~40% of the screen */
const DESIGN_W = 520;
const DESIGN_H = 470;
const getScale = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const targetW = vw < 700 ? vw * 0.94 : vw * 0.4;
  return Math.min(targetW / DESIGN_W, (vh * 0.92) / DESIGN_H, 2.2);
};
const SHOW_DELAY = 3400; // let the splash screen finish first

/* Firecracker bursts: position (% of screen), colour, reach (vmin), stagger (s) */
const FIREWORKS = [
  { left: 22, top: 30, color: '#F3912E', reach: 17, delay: 0.0 },
  { left: 78, top: 26, color: '#FFC23C', reach: 19, delay: 0.25 },
  { left: 50, top: 18, color: '#E5457A', reach: 15, delay: 0.5 },
  { left: 12, top: 62, color: '#7C4DDB', reach: 13, delay: 0.75 },
  { left: 88, top: 60, color: '#F3912E', reach: 14, delay: 0.95 },
  { left: 36, top: 44, color: '#FFC23C', reach: 12, delay: 1.1 },
  { left: 64, top: 42, color: '#E5457A', reach: 12, delay: 1.25 },
];
const STREAKS = Array.from({ length: 22 }, (_, i) => (360 / 22) * i);

/* stage: hidden → burst (firecrackers) → enter (slides up) → open (flap) → letter (card rises) → closing */
const DiwaliEnvelope = ({ onCollect }) => {
  const [stage, setStage] = useState('hidden');
  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    const onResize = () => setScale(getScale());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* shown every time the home page is opened */
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage('burst'), SHOW_DELAY),
      setTimeout(() => setStage('enter'), SHOW_DELAY + 1700),
      setTimeout(() => setStage('open'), SHOW_DELAY + 2900),
      setTimeout(() => setStage('letter'), SHOW_DELAY + 3700),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const close = useCallback((after) => {
    setStage('closing');
    setTimeout(() => {
      setStage('hidden');
      if (after) after();
    }, 600);
  }, []);

  useEffect(() => {
    if (stage === 'hidden') return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [stage, close]);

  if (stage === 'hidden') return null;

  const opened = ['open', 'letter', 'closing'].includes(stage);
  const reading = stage === 'letter' || stage === 'closing';
  const cls = `denv is-${stage}${opened ? ' is-opened' : ''}${reading ? ' is-reading' : ''}`;

  return (
    <div className={cls} role="dialog" aria-modal="true" aria-label="Deepawali greetings from CipherSchools">
      <div className="denv-backdrop" onClick={() => close()} />

      <div className="denv-fireworks" aria-hidden="true">
        {FIREWORKS.map((f, i) => (
          <div
            key={i}
            className="denv-fw"
            style={{ left: `${f.left}%`, top: `${f.top}%`, '--fw-color': f.color, '--fw-delay': `${f.delay}s` }}
          >
            <span className="denv-fw-rocket" />
            <span className="denv-fw-flash" />
            {STREAKS.map((a, j) => (
              <span
                key={a}
                className="denv-fw-streak"
                style={{ '--angle': `${a}deg`, '--reach': `${j % 2 ? f.reach * 0.66 : f.reach}vmin` }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="denv-stage" style={{ '--k': scale }}>
        <div className="denv-env">
          <div className="denv-back" />
          <div className="denv-flap" />

          <div className="denv-clip">
            <div className="denv-letter">
              <button type="button" className="denv-close" onClick={() => close()} aria-label="Close">
                <X size={16} />
              </button>

              <div className="denv-diya"><Diya size={44} /></div>
              <p className="denv-kicker">Happy Deepawali</p>
              <h2 className="denv-title">Greetings from CipherSchools</h2>
              <p className="denv-wish">
                May this festival of lights brighten your learning journey, light up your career
                and fill your code with zero bugs. Wishing you and your family a joyful Deepawali!
              </p>

              <div className="denv-guide">
                <p className="denv-guide-title">Quick guide</p>
                <p className="denv-guide-text">
                  Collect all <strong>{DIYA_GOAL} diyas</strong> available on the homepage. Once collected,
                  you'll get <strong>{DISCOUNT_LABEL} discount</strong> on the premium course.
                </p>
              </div>

              <button type="button" className="denv-cta" onClick={() => close(onCollect)}>
                Collect now
              </button>
            </div>
          </div>

          <div className="denv-front" />
        </div>
      </div>
    </div>
  );
};

export default DiwaliEnvelope;
