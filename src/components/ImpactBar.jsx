import React, { useState, useEffect, useRef } from 'react';
import { Brain, Cloud, Terminal, Layers, ArrowDown, MessageCircle, ArrowUpRight, BookOpen, Play, Code2, Award, Briefcase, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import PlacementMarquee from './PlacementMarquee';
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

/* ── Thanos Word-by-Word Dust Reveal & Interactive Transformation Component ── */
const ThanosParagraphReveal = ({ scrollToSection, inView }) => {
  const [currentMode, setCurrentMode] = useState(0); // 0 = original, 1 = "Don't trust us blindly"
  const [isSnapping, setIsSnapping] = useState(false);

  const tokensState0 = [
    { text: "We ", type: "normal" },
    { text: "combine ", type: "normal" },
    { text: "structured learning", type: "strong" },
    { text: ", ", type: "normal" },
    { text: "hands-on practice", type: "strong" },
    { text: ", and ", type: "normal" },
    { text: "mentorship", type: "strong" },
    { text: " into ", type: "normal" },
    { text: "one platform", type: "normal" },
    { text: "\n", type: "break" },
    { text: "making ", type: "normal" },
    { text: "students", type: "student-link" },
    { text: " ", type: "normal" },
    { text: "industry-ready ", type: "normal" },
    { text: "while ", type: "muted" },
    { text: "helping ", type: "normal" },
    { text: "universities", type: "university-link" },
    { text: " ", type: "normal" },
    { text: "deliver ", type: "normal" },
    { text: "measurable placement outcomes.", type: "strong" }
  ];

  const tokensState1 = [
    { text: "Don't ", type: "orange-bold" },
    { text: "trust ", type: "orange-bold" },
    { text: "us ", type: "orange-bold" },
    { text: "blindly ", type: "orange-bold" },
    { text: "— ", type: "normal" },
    { text: "experience ", type: "orange-italic" },
    { text: "structured learning", type: "strong" },
    { text: ", ", type: "normal" },
    { text: "hands-on practice", type: "strong" },
    { text: ", and ", type: "normal" },
    { text: "measurable placement outcomes", type: "strong" },
    { text: "\n", type: "break" },
    { text: "for ", type: "normal" },
    { text: "students", type: "student-link" },
    { text: " and ", type: "normal" },
    { text: "universities", type: "university-link" },
    { text: " on ", type: "normal" },
    { text: "the ", type: "normal" },
    { text: "platform.", type: "normal" }
  ];

  const currentTokens = currentMode === 0 ? tokensState0 : tokensState1;

  const handleSnap = () => {
    if (isSnapping) return;
    setIsSnapping(true);

    setTimeout(() => {
      setCurrentMode((prev) => (prev === 0 ? 1 : 0));
      setIsSnapping(false);
    }, 650);
  };

  return (
    <p 
      className={`impact-subheading-text thanos-container ${inView ? 'thanos-in-view' : ''}`}
      onClick={handleSnap}
      title="Click to snap and transform text"
    >
      {currentTokens.map((token, idx) => {
        if (token.type === "break") {
          return <br key={`break-${idx}`} className="thanos-break-line" />;
        }

        const dx = (Math.sin(idx * 7) * 38 + (idx % 2 === 0 ? 18 : -18)).toFixed(1);
        const dy = (-24 - (idx % 4) * 16).toFixed(1);
        const rot = (Math.cos(idx * 5) * 40).toFixed(1);
        const delay = (0.03 * idx).toFixed(2);

        let content;
        if (token.type === "strong") {
          content = <strong>{token.text}</strong>;
        } else if (token.type === "orange-bold") {
          content = <strong className="text-brand-orange-bold">{token.text}</strong>;
        } else if (token.type === "orange-italic") {
          content = <span className="text-orange-highlight">{token.text}</span>;
        } else if (token.type === "italic-muted") {
          content = <span className="text-italic-muted">{token.text}</span>;
        } else if (token.type === "student-link") {
          content = (
            <span
              className="interactive-accent-link"
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection('student-section');
              }}
              title="Click to view Student Pathway"
            >
              {token.text}
            </span>
          );
        } else if (token.type === "university-link") {
          content = (
            <span
              className="interactive-accent-link"
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection('university-section');
              }}
              title="Click to view University Platform"
            >
              {token.text}
            </span>
          );
        } else if (token.type === "muted") {
          content = <span className="text-muted">{token.text}</span>;
        } else {
          content = token.text;
        }

        return (
          <span
            key={`${currentMode}-${idx}`}
            className={`thanos-word-span ${isSnapping ? 'thanos-snapping' : 'thanos-materializing'}`}
            style={{
              '--dx': `${dx}`,
              '--dy': `${dy}`,
              '--rot': `${rot}`,
              '--delay': `${delay}s`,
              animationDelay: `${delay}s`
            }}
          >
            {content}
          </span>
        );
      })}
    </p>
  );
};

const ImpactBar = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Parallax Scroll Tracking for Smart Disappear / Reappear
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sy = window.scrollY || document.documentElement.scrollTop;
          // Map scroll 0 to 420px to ratio 0 -> 1
          const ratio = Math.min(Math.max(sy / 420, 0), 1);
          setScrollRatio(ratio);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Notion-Style Rotating Words state (BEYOND -> BETTER -> BEST every 2s)
  const rotatingWords = ["BEYOND", "BETTER", "BEST"];
  const [wordIndex, setWordIndex] = useState(0);
  const [isWordAnimating, setIsWordAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsWordAnimating(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsWordAnimating(false);
      }, 220);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="impact-section modern-bento-light-theme" ref={sectionRef}>
      {/* Background Grid Pattern */}
      <div className="impact-grid-pattern-bg"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* ── Centered Hero Header with Notion Studio Banner Cards ── */}
        <div className={`notion-hero-header ${inView ? 'impact-in-view' : ''}`}>
          
          {/* Main Headline with Notion-Style BEYOND - BETTER - BEST Rotating Pill Badge */}
          <h1 className="impact-headline-main">
            <span className="headline-line1-wrap">
              <span className="headline-black-italic">WE ARE</span>
              <span className="notion-hero-word-pill">
                <span className={`notion-word-text ${isWordAnimating ? 'word-animating' : ''}`}>
                  {rotatingWords[wordIndex]}
                </span>
              </span>
            </span>
            <br className="headline-break" />
            <span className="headline-orange-italic">ED-TECH</span>
            {' '}
            <span className="headline-black-italic">COMPANY</span>
          </h1>

          {/* Thanos Word-by-Word Reveal & Snap Paragraph */}
          <div className="notion-paragraph-wrapper">
            <ThanosParagraphReveal scrollToSection={scrollToSection} inView={inView} />
          </div>

          {/* ── CTA Action Group ── */}
          <div className="notion-cta-group">
            <button 
              className="impact-start-journey-btn notion-primary-btn"
              onClick={() => scrollToSection('welcome-section')}
            >
              Start Your Journey <ArrowDown size={18} />
            </button>
          </div>

          {/* ── 3D Scroll-Driven Card Deck Shuffle App Showcase ── */}
          {(() => {
            // Card 1 (CipherLabs IDE) shuffle math
            const card1X = scrollRatio < 0.5 
              ? -15 - (scrollRatio * 250) 
              : -140 + ((scrollRatio - 0.5) * 350);
            const card1Rot = scrollRatio < 0.5 
              ? -1.5 - (scrollRatio * 10) 
              : -6.5 + ((scrollRatio - 0.5) * 18);
            const card1Z = scrollRatio > 0.5 ? 1 : 3;
            const card1Opacity = scrollRatio > 0.55 ? 0.88 : 1;

            // Card 2 (Course Player) shuffle math
            const card2X = scrollRatio < 0.5 
              ? 35 - (scrollRatio * 30) 
              : 20 - ((scrollRatio - 0.5) * 70);
            const card2Rot = scrollRatio < 0.5 
              ? 2.5 - (scrollRatio * 3) 
              : 1 - ((scrollRatio - 0.5) * 5);
            const card2Z = scrollRatio > 0.5 ? 3 : 1;
            const card2Scale = 0.94 + (scrollRatio * 0.08);

            return (
              <div 
                className="hero-stacked-mockup-showcase"
                style={{
                  transform: `scale(${0.92 + scrollRatio * 0.08}) translateY(${scrollRatio * 15}px)`,
                  transition: 'transform 0.12s ease-out',
                  willChange: 'transform'
                }}
              >
                <div className="stacked-mockup-inner">
                  {/* Back Card: Course Player (Promotes to Front on Scroll Shuffle) */}
                  <div 
                    className="stacked-mockup-card card-back"
                    style={{
                      transform: `translateX(${card2X}px) translateY(${-18 + scrollRatio * 12}px) rotate(${card2Rot}deg) scale(${card2Scale})`,
                      zIndex: card2Z,
                      opacity: Math.min(0.85 + scrollRatio * 0.15, 1),
                      boxShadow: card2Z === 3 ? `0 ${30 + scrollRatio * 20}px ${60 + scrollRatio * 25}px -15px rgba(0,0,0,0.18)` : '0 15px 35px rgba(0,0,0,0.08)',
                      transition: 'transform 0.12s ease-out, opacity 0.12s ease-out, box-shadow 0.12s ease-out',
                      willChange: 'transform, opacity'
                    }}
                  >
                    <div className="mockup-window-header">
                      <div className="window-dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                      </div>
                      <span className="window-title">CipherSchools - Interactive Learning Portal</span>
                    </div>
                    <div className="mockup-window-body">
                      <img src="/hero-mockup-right.png" alt="CipherSchools Course Player Mockup" className="mockup-img" />
                    </div>
                  </div>

                  {/* Front Card: CipherLabs IDE (Shuffles Out & Slides to Back Stack) */}
                  <div 
                    className="stacked-mockup-card card-front"
                    style={{
                      transform: `translateX(${card1X}px) translateY(${scrollRatio * 12}px) rotate(${card1Rot}deg)`,
                      zIndex: card1Z,
                      opacity: card1Opacity,
                      boxShadow: card1Z === 3 ? `0 ${30 + scrollRatio * 20}px ${60 + scrollRatio * 25}px -15px rgba(0,0,0,0.18)` : '0 15px 35px rgba(0,0,0,0.08)',
                      transition: 'transform 0.12s ease-out, opacity 0.12s ease-out, box-shadow 0.12s ease-out',
                      willChange: 'transform, opacity'
                    }}
                  >
                    <div className="mockup-window-header">
                      <div className="window-dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                      </div>
                      <span className="window-title">CipherLabs - Multi-Language IDE & Problem Solver</span>
                    </div>
                    <div className="mockup-window-body">
                      <img src="/hero-mockup-left.png" alt="CipherLabs IDE Coding Mockup" className="mockup-img" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── PLACEMENT SUCCESS Marquee Section (Directly Above Bento Grid Frame) ── */}
        <PlacementMarquee />

        {/* ── Modern Light Bento Grid Dock (All-in-One View) ── */}
        <div className={`modern-light-bento-dock ${inView ? 'impact-in-view' : ''}`}>
          <div className="modern-bento-container-frame">
            
            {/* Bento Cell 1: 50k+ Active Learners */}
            <div className="bento-cell cell-learners">
              <div className="bento-cell-tag"><Brain size={14} /> ACTIVE LEARNERS</div>
              <div className="bento-stat-num">
                <CountUp end={50} suffix="k+" />
              </div>
              <div className="bento-cell-body">
                <h4>Active Learners</h4>
                <p>Actively upskilling beyond their comfort zone every single day.</p>
              </div>
            </div>

            {/* Bento Cell 2: Starts @ ₹0 */}
            <div className="bento-cell cell-zero">
              <div className="bento-cell-tag tag-orange">ZERO FRICTION</div>
              <div className="bento-stat-num text-brand-orange">
                Starts @ ₹0
              </div>
              <div className="bento-cell-body">
                <h4>Only Procrastination Stops You</h4>
                <p>100% free learning pathways with verified digital skill badges.</p>
              </div>
            </div>

            {/* Bento Cell 3: 20k+ Badges & Certificates */}
            <div className="bento-cell cell-badges">
              <div className="bento-cell-tag"><Layers size={14} /> VERIFIED SKILLS</div>
              <div className="bento-stat-num">
                <CountUp end={20} suffix="k+" />
              </div>
              <div className="bento-cell-body">
                <h4>Badges & Certificates Created</h4>
                <p>Earned by students & ambitious working professionals.</p>
              </div>
            </div>

            {/* Bento Cell 4: Beyond Practice */}
            <div className="bento-cell cell-practice">
              <div className="bento-cell-tag"><Terminal size={14} /> CIPHERLABS PLATFORM</div>
              <h3 className="bento-practice-header">Beyond Practice</h3>
              <div className="bento-pill-tags">
                <span>Programming</span>
                <span className="pill-orange">Data Structures</span>
                <span>SQL</span>
              </div>
              <p className="bento-practice-desc">
                Solve, practice, and repeat — interactive browser environments designed for placement readiness.
              </p>
            </div>

            {/* Bento Cell 5: 15+ Domains */}
            <div className="bento-cell cell-domains">
              <div className="bento-cell-tag"><Cloud size={14} /> CURRICULUM</div>
              <div className="bento-domains-header">
                <span className="bento-stat-num inline"><CountUp end={15} suffix="+" /></span>
                <span className="domains-title">In-Demand Domains</span>
              </div>
              <div className="bento-domain-pills-row">
                <span className="bento-domain-pill"><Brain size={12} /> AI & ML</span>
                <span className="bento-domain-pill"><Cloud size={12} /> Cloud</span>
                <span className="bento-domain-pill"><Terminal size={12} /> DevOps</span>
                <span className="bento-domain-pill"><Layers size={12} /> DSA</span>
                <span className="bento-domain-pill"><Brain size={12} /> Web3</span>
              </div>
            </div>

            {/* Bento Cell 6: WhatsApp Community */}
            <div className="bento-cell cell-whatsapp">
              <div className="bento-cell-tag tag-whatsapp"><MessageCircle size={14} /> BEYOND LEARNING</div>
              <div className="bento-whatsapp-header">
                <h4 className="whatsapp-title">WhatsApp Community</h4>
                <span className="whatsapp-badge-live">10k+ Members</span>
              </div>
              <p className="bento-whatsapp-desc">
                Daily tech news, peer networking, doubt support, and exclusive placement alerts.
              </p>
              <a 
                href="#whatsapp-community" 
                className="bento-whatsapp-btn"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Redirecting to CipherSchools WhatsApp Community...');
                }}
              >
                <MessageCircle size={16} /> Join Community <ArrowUpRight size={15} />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ImpactBar;
