import React, { useState, useEffect, useRef } from 'react';
import { Users, Target, Rocket } from 'lucide-react';
import './ImpactBar.css';

/* ── CountUp ── */
const CountUp = ({ end, suffix = "", duration = 2500 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = null, raf;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(ease * end));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, started]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const ImpactBar = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.12 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="impact-section" ref={sectionRef}>
      <div className="container">
        <div className={`impact-layout ${inView ? 'impact-in-view' : ''}`}>

          {/* ── Left: Hero Stat ── */}
          <div className="il-hero-stat">
            <div className="il-hero-ring">
              <svg viewBox="0 0 120 120" className="il-ring-svg">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#F0F0F0" strokeWidth="4" />
                <circle
                  cx="60" cy="60" r="54"
                  fill="none" stroke="#ffa103" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="339.3"
                  strokeDashoffset="339.3"
                  className="il-ring-progress"
                />
              </svg>
              <div className="il-hero-icon">
                <Users size={28} />
              </div>
            </div>
            <div className="il-hero-text">
              <h3 className="il-big-num"><CountUp end={50} suffix="k+" /></h3>
              <span className="il-big-label">Learners</span>
            </div>
            <div className="il-hero-pulse" />
          </div>

          {/* ── Center: Divider ── */}
          <div className="il-divider" />

          {/* ── Right: Stacked Stats ── */}
          <div className="il-stacked">
            <div className="il-stat-row">
              <div className="il-stat-icon-wrap">
                <Target size={20} />
              </div>
              <div className="il-stat-info">
                <h3 className="il-stat-num"><CountUp end={15} suffix="+" /></h3>
                <span className="il-stat-label">In-demand Domains</span>
              </div>
              <div className="il-stat-tags">
                {['AI', 'Cloud', 'DevOps', 'Web3'].map((t, i) => (
                  <span key={i} className="il-tag" style={{ '--tag-i': i }}>{t}</span>
                ))}
              </div>
            </div>

            <div className="il-row-sep" />

            <div className="il-stat-row">
              <div className="il-stat-icon-wrap">
                <Rocket size={20} />
              </div>
              <div className="il-stat-info">
                <h3 className="il-stat-num"><CountUp end={50} suffix="+" /></h3>
                <span className="il-stat-label">Free Programs</span>
              </div>
              <div className="il-stat-tags">
                <span className="il-tag il-tag-accent" style={{ '--tag-i': 0 }}>No paywall*</span>
                <span className="il-tag" style={{ '--tag-i': 1 }}>Certified</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ImpactBar;
