import React, { useState, useEffect, useRef } from 'react';
import { Brain, Cloud, Terminal, Layers, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import './ImpactBar.css';

/* ── CountUp Component ── */
const CountUp = ({ end, suffix = "", duration = 2200 }) => {
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
  const [scrollYOffset, setScrollYOffset] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.12 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Parallax Scroll Tracking
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const offset = (progress - 0.5) * 80;
        setScrollYOffset(offset);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="impact-section light-bento-theme" ref={sectionRef}>
      {/* Parallax Background Glow */}
      <div 
        className="impact-parallax-bg"
        style={{ transform: `translateY(${scrollYOffset * 0.35}px)` }}
      ></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Bento Grid Container with Parallax Offset */}
        <div 
          className={`bento-impact-grid ${inView ? 'impact-in-view' : ''}`}
          style={{ transform: `translateY(${scrollYOffset * -0.15}px)` }}
        >
          
          {/* ── Left Column Cards (50k+ Learners & 20k+ Badges) ── */}
          <div 
            className="bento-col"
            style={{ transform: `translateY(${scrollYOffset * -0.22}px)` }}
          >
            {/* Card 1: 50k+ Learners */}
            <div className="bento-card card-dark card-parallax-hero">
              <div className="card-metric-num">
                <CountUp end={50} suffix="k+" />
              </div>
              <div className="card-label-block">
                <span className="card-metric-label">Learners</span>
                <p className="card-subtext">Active students up skilling</p>
              </div>
            </div>

            {/* Card 2: 20k+ Badges & Certificate Created */}
            <div className="bento-card card-dark">
              <div className="card-metric-num">
                <CountUp end={20} suffix="k+" />
              </div>
              <div className="card-label-block">
                <span className="card-metric-label">
                  Badges & Certificate <span className="text-orange-highlight">Created</span>
                </span>
                <p className="card-subtext">By Students & Working Professional</p>
              </div>
            </div>
          </div>

          {/* ── Middle Column Cards (50+ Free Programs & Starts @ ₹0) ── */}
          <div 
            className="bento-col"
            style={{ transform: `translateY(${scrollYOffset * -0.08}px)` }}
          >
            {/* Card 3: 50+ Free Programs */}
            <div className="bento-card card-dark">
              <div className="card-metric-num">
                <CountUp end={50} suffix="+" />
              </div>
              <div className="card-label-block">
                <span className="card-metric-label">Free Programs</span>
                <p className="card-subtext">Start for FREE because your learning should never stop.</p>
              </div>
            </div>

            {/* Card 4: Starts @ ₹0 */}
            <div className="bento-card card-dark">
              <div className="card-metric-num text-brand-orange">
                Starts @ ₹0
              </div>
              <div className="card-label-block">
                <span className="card-metric-label">
                  Only <span className="text-orange-highlight">Procrastination</span> Stops you
                </span>
                <p className="card-subtext">100% free learning pathways with Badges</p>
              </div>
            </div>
          </div>

          {/* ── Right Column: TALL HERO CARD ── */}
          <div 
            className="bento-col col-tall"
            style={{ transform: `translateY(${scrollYOffset * -0.28}px)` }}
          >
            <div className="bento-card card-tall-hero">
              
              <div className="tall-card-content">
                <div className="card-metric-num text-hero-num">
                  <CountUp end={15} suffix="+" />
                </div>
                <h3 className="tall-card-title">In-demand Domains</h3>
                
                <div className="impact-domain-pills-row">
                  <span className="impact-domain-pill"><Brain size={12} /> AI</span>
                  <span className="impact-domain-pill"><Cloud size={12} /> Cloud</span>
                  <span className="impact-domain-pill"><Terminal size={12} /> DevOps</span>
                  <span className="impact-domain-pill"><Layers size={12} /> DSA</span>
                </div>

                <button className="impact-cta-btn">
                  Start for free <ArrowRight size={16} />
                </button>
              </div>

              {/* 3D Floating Metallic Coins Mockup Graphic */}
              <div 
                className="coins-mockup-container"
                style={{ transform: `translateY(${scrollYOffset * 0.4}px) rotate(${scrollYOffset * 0.05}deg)` }}
              >
                <div className="coin-3d coin-1" title="Web3 Domain">
                  <div className="coin-inner">
                    <Layers size={24} />
                  </div>
                </div>
                <div className="coin-3d coin-2" title="DevOps Domain">
                  <div className="coin-inner">
                    <Terminal size={24} />
                  </div>
                </div>
                <div className="coin-3d coin-3" title="Cloud Domain">
                  <div className="coin-inner">
                    <Cloud size={24} />
                  </div>
                </div>
                <div className="coin-3d coin-4" title="AI Domain">
                  <div className="coin-inner">
                    <Brain size={24} />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ImpactBar;
