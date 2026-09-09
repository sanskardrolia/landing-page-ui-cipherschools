import React, { useState, useEffect, useRef } from 'react';
import { Brain, Cloud, Terminal, Layers, ArrowDown, MessageCircle, ArrowUpRight, BookOpen, Play, Code2, Award, Briefcase, Sparkles, CheckCircle2, Clock, ChevronRight, ShieldCheck, Users, TrendingUp, Check, Star, Zap, Flame } from 'lucide-react';
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
  const mockupContainerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeMockupIndex, setActiveMockupIndex] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Parallax Scroll Tracking for Quote Disappear / Reappear & Mockup Staging
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sy = window.scrollY || document.documentElement.scrollTop;
          setScrollY(sy);

          if (mockupContainerRef.current) {
            const rect = mockupContainerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementMid = rect.top + rect.height / 2;
            const viewportMid = windowHeight / 2;
            const diff = viewportMid - elementMid;

            // Smoothly change active mockup as user scrolls through the showcase area
            if (diff < -80) {
              setActiveMockupIndex(0); // 1. CipherLabs IDE
            } else if (diff >= -80 && diff < 160) {
              setActiveMockupIndex(1); // 2. Interactive Learning Portal
            } else {
              setActiveMockupIndex(2); // 3. AI Resume Builder
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Notion-Style Rotating Words state (UNIVERSITIES -> STUDENTS every 2s)
  const rotatingWords = ["UNIVERSITIES", "STUDENTS"];
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

  // Auto-Changing Mockup Timer (changes every 3.5s unless hovered)
  const [isMockupHovered, setIsMockupHovered] = useState(false);

  useEffect(() => {
    if (isMockupHovered) return;
    const autoTimer = setInterval(() => {
      setActiveMockupIndex((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(autoTimer);
  }, [isMockupHovered]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="impact-section modern-bento-light-theme" ref={sectionRef}>
      {/* ── Ambient Scribble & Handwriting Watermark Pattern (5-7% Visibility) ── */}
      <div className="hero-scribble-bg-layer" aria-hidden="true">
        {/* Top-Left Cluster: Learn & Code loops */}
        <div className="scribble-item sc-top-left-1">
          <span className="scribble-text">learn ~ explore</span>
          <svg className="scribble-svg" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 5,18 Q 30,5 55,18 T 95,12" strokeLinecap="round" />
          </svg>
        </div>

        <div className="scribble-item sc-top-left-2">
          <span className="scribble-text">practice.repeat()</span>
        </div>

        <div className="scribble-item sc-top-left-doodle">
          <svg className="scribble-svg" viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 10,40 Q 15,10 45,15 Q 55,18 45,35 Q 35,45 20,40" strokeLinecap="round" />
          </svg>
        </div>

        {/* Top-Right Cluster: Campus Placement & Arrow */}
        <div className="scribble-item sc-top-right-1">
          <span className="scribble-text">campus placement ★</span>
          <svg className="scribble-svg sc-arrow" viewBox="0 0 85 45" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 10,12 Q 45,38 75,18 M 60,12 L 75,18 L 68,32" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="scribble-item sc-top-right-2">
          <span className="scribble-text">career readiness ↗</span>
        </div>

        <div className="scribble-item sc-top-right-spark">
          <svg className="scribble-svg" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 20,4 L 20,36 M 4,20 L 36,20 M 9,9 L 31,31 M 9,31 L 31,9" strokeLinecap="round" />
          </svg>
        </div>

        {/* Mid-Left Cluster: Skills & Brackets */}
        <div className="scribble-item sc-mid-left-1">
          <span className="scribble-text">skills &gt; theory</span>
          <svg className="scribble-svg" viewBox="0 0 80 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 4,14 C 25,6 55,18 76,8" strokeLinecap="round" />
          </svg>
        </div>

        <div className="scribble-item sc-mid-left-2">
          <span className="scribble-text">{'{ hands-on code }'}</span>
        </div>

        {/* Mid-Right Cluster: Build & Innovate */}
        <div className="scribble-item sc-mid-right-1">
          <span className="scribble-text">build &amp; scale ✦</span>
          <svg className="scribble-svg" viewBox="0 0 110 25" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 5,16 Q 35,4 65,16 T 105,10" strokeLinecap="round" />
          </svg>
        </div>

        <div className="scribble-item sc-mid-right-2">
          <span className="scribble-text">assess · evaluate</span>
        </div>

        {/* Bottom-Left Cluster: Next-gen talent loop */}
        <div className="scribble-item sc-bottom-left-1">
          <span className="scribble-text">next-gen ecosystem</span>
          <svg className="scribble-svg sc-circle" viewBox="0 0 100 45" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M 12,22 C 12,8 90,8 90,22 C 90,36 18,38 6,24" strokeLinecap="round" />
          </svg>
        </div>

        {/* Bottom-Right Cluster: Outcome driven */}
        <div className="scribble-item sc-bottom-right-1">
          <span className="scribble-text">outcome focused ✧</span>
          <svg className="scribble-svg" viewBox="0 0 95 25" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 6,14 Q 30,2 55,14 T 90,8" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="container hero-split-container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* ── 2-Column Split Hero Layout ── */}
        <div className={`hero-split-grid ${inView ? 'impact-in-view' : ''}`}>
          
          {/* ── LEFT COLUMN: Headline, Value Prop, Journey Dock, CTA ── */}
          <div className="hero-left-column">
            
            {/* Main Headline with Rotating Pill Badge */}
            <h1 className="impact-headline-main">
              <span className="headline-line-block">
                <span className="headline-black-italic">AN</span>{' '}
                <span className="headline-orange-italic">ED-TECH</span>{' '}
                <span className="headline-black-italic">COMPANY</span>
              </span>
              <span className="headline-line-block">
                <span className="headline-black-italic">FOR</span>{' '}
                <span className="notion-hero-word-pill">
                  <span className={`notion-word-text ${isWordAnimating ? 'word-animating' : ''}`}>
                    {rotatingWords[wordIndex]}
                  </span>
                </span>
              </span>
            </h1>

            {/* Concise Value Proposition */}
            <p className="hero-value-prop">
              <span>We turn campuses into <strong>career-ready ecosystems</strong>.</span>
              <span className="hero-value-prop-sub">
                Built for <em className="prop-highlight">universities</em>. Designed for <em className="prop-highlight">students</em>.
              </span>
            </p>

            {/* Sequential Product Journey Path */}
            <div className="hero-product-offerings-container">
              <div className="hero-product-pipeline-card">
                {/* Step 1: TRAINING */}
                <div className="pipeline-step-item">
                  <div className="pipeline-step-tag">FOUNDATION</div>
                  <h4 className="pipeline-step-title">TRAINING</h4>
                  <p className="pipeline-step-desc">Campus LMS & Learning</p>
                </div>

                {/* Flow Separator 1 -> 2 */}
                <div className="pipeline-flow-sep">
                  <ChevronRight size={16} className="pipeline-chevron" />
                </div>

                {/* Step 2: ASSESS */}
                <div className="pipeline-step-item">
                  <div className="pipeline-step-tag">EVALUATION</div>
                  <h4 className="pipeline-step-title">ASSESS</h4>
                  <p className="pipeline-step-desc">Assessments & Performance</p>
                </div>

                {/* Flow Separator 2 -> 3 */}
                <div className="pipeline-flow-sep">
                  <ChevronRight size={16} className="pipeline-chevron" />
                </div>

                {/* Step 3: PRACTICE */}
                <div className="pipeline-step-item">
                  <div className="pipeline-step-tag">HANDS-ON</div>
                  <h4 className="pipeline-step-title">PRACTICE</h4>
                  <p className="pipeline-step-desc">Practice & Problem Sets</p>
                </div>
              </div>
            </div>

            {/* Single CTA */}
            <div className="notion-cta-group">
              <button 
                className="impact-start-journey-btn notion-primary-btn"
                onClick={() => scrollToSection('welcome-section')}
              >
                Explore the Platform <ArrowDown size={18} />
              </button>
            </div>

          </div>

          {/* ── RIGHT COLUMN: Interactive & Auto-Changing 3D Stacked Mockup Deck ── */}
          <div 
            className="hero-right-column"
            onMouseEnter={() => setIsMockupHovered(true)}
            onMouseLeave={() => setIsMockupHovered(false)}
          >
            <div ref={mockupContainerRef} className="hero-stacked-mockup-showcase">
              
              {/* Interactive Stage Indicator Switcher */}
              <div className="mockup-stage-indicators">
                <button 
                  className={`mockup-indicator-pill ${activeMockupIndex === 0 ? 'active' : ''}`}
                  onClick={() => setActiveMockupIndex(0)}
                  type="button"
                >
                  <span className="ind-dot"></span> Assessment Platform
                </button>
                <button 
                  className={`mockup-indicator-pill ${activeMockupIndex === 1 ? 'active' : ''}`}
                  onClick={() => setActiveMockupIndex(1)}
                  type="button"
                >
                  <span className="ind-dot"></span> LMS
                </button>
                <button 
                  className={`mockup-indicator-pill ${activeMockupIndex === 2 ? 'active' : ''}`}
                  onClick={() => setActiveMockupIndex(2)}
                  type="button"
                >
                  <span className="ind-dot"></span> Practice
                </button>
              </div>

              {/* 3D Stacked Mockup Inner Deck */}
              <div className="stacked-mockup-inner">
                
                {/* Card 1: Assessment Platform */}
                <div 
                  className={`stacked-mockup-card card-ide ${activeMockupIndex === 0 ? 'card-active' : 'card-past'}`}
                  onClick={() => setActiveMockupIndex(0)}
                >
                  <div className="mockup-window-header">
                    <span className="window-title">CipherSchools - Assessment Platform & Automated Scoring</span>
                  </div>
                  <div className="mockup-window-body">
                    <img src="/hero-mockup-left.png" alt="Assessment Platform Coding Mockup" className="mockup-img" />
                  </div>
                </div>

                {/* Card 2: Campus LMS Platform */}
                <div 
                  className={`stacked-mockup-card card-portal ${activeMockupIndex === 1 ? 'card-active' : (activeMockupIndex === 0 ? 'card-next' : 'card-past')}`}
                  onClick={() => setActiveMockupIndex(1)}
                >
                  <div className="mockup-window-header">
                    <span className="window-title">CipherSchools - Campus LMS Platform</span>
                  </div>
                  <div className="mockup-window-body">
                    <img src="/hero-mockup-lms.png" alt="CipherSchools LMS Dashboard Mockup" className="mockup-img" />
                  </div>
                </div>

                {/* Card 3: Practice */}
                <div 
                  className={`stacked-mockup-card card-resume ${activeMockupIndex === 2 ? 'card-active' : (activeMockupIndex === 1 ? 'card-next' : 'card-deep')}`}
                  onClick={() => setActiveMockupIndex(2)}
                >
                  <div className="mockup-window-header">
                    <span className="window-title">CipherSchools - Practice & Problem Set</span>
                  </div>
                  <div className="mockup-window-body">
                    <img src="/hero-mockup-cipherlabs.png" alt="CipherSchools Practice Platform Mockup" className="mockup-img" />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* ── Founder Story Narrative (Dynamic Scroll Reveal/Disappear + YC Drop-Cap Style) ── */}
        {(() => {
          const storyProgress = Math.min(Math.max((scrollY - 30) / 160, 0), 1);
          const storyOpacity = inView ? storyProgress : 0;
          const storyTranslateY = (1 - storyProgress) * 28;
          const storyScale = 0.96 + storyProgress * 0.04;
          const storyBlur = (1 - storyProgress) * 5;

          return (
            <div 
              className="hero-founder-story-card"
              style={{
                opacity: storyOpacity,
                transform: `translateY(${storyTranslateY}px) scale(${storyScale})`,
                filter: `blur(${storyBlur}px)`,
                pointerEvents: storyOpacity > 0.4 ? 'auto' : 'none',
                transition: 'transform 0.1s ease-out, opacity 0.12s ease-out, filter 0.12s ease-out',
                willChange: 'transform, opacity, filter'
              }}
            >
              <div className="founder-story-content">
                {/* ── Times of India Inspired Masthead Header (Full Blurred Editorial Backdrop) ── */}
                <div className="toi-masthead-wrapper">
                  {/* Big Centered Generic Newspaper Masthead Title */}
                  <div className="toi-masthead-center">
                    <h2 className="toi-brand-title">THE DAILY DISPATCH</h2>
                  </div>

                  {/* Generic Newspaper Sub-Navigation Strip */}
                  <div className="toi-nav-strip">
                    <div className="toi-nav-left">
                      <span className="toi-logo-badge">DAILY<span className="toi-plus">+</span></span>
                      <span className="toi-nav-item">Editorial</span>
                      <span className="toi-nav-item">Campus</span>
                      <span className="toi-nav-item">Innovation</span>
                      <span className="toi-nav-item">Technology</span>
                      <span className="toi-nav-item">Higher Ed</span>
                      <span className="toi-nav-item">Careers</span>
                      <span className="toi-nav-item">Research</span>
                      <span className="toi-nav-item">Special Report</span>
                    </div>
                    <div className="toi-nav-right">
                      <span className="toi-live-pill">🔴 Edition</span>
                      <span className="toi-icon">🔍</span>
                      <span className="toi-icon">☰</span>
                    </div>
                  </div>
                </div>

                {/* Main Newspaper Body with Subtle Blurred Side Column */}
                <div className="newspaper-columns-grid">
                  <div className="newspaper-main-column">
                    <p className="founder-story-paragraph">
                      <span className="founder-drop-cap">S</span>ince <strong>2020</strong>, <strong>CipherSchools</strong> has been building more than a learning platform. We started by helping students learn <strong className="founder-text-highlight">practical skills</strong>, <strong className="founder-text-highlight">build projects</strong>, and <strong className="founder-text-highlight">prepare for their careers</strong>. Today, we work with <strong className="founder-highlight-univ">universities</strong> to strengthen <strong className="founder-text-highlight">learning, assessment, training, and career readiness</strong>—while continuing to support students beyond the classroom.
                    </p>
                    <p className="founder-story-paragraph founder-story-tagline">
                      <span className="story-tagline-highlight">Started in 2020. Still learning. Still building. Still growing.</span>
                    </p>
                    <div className="founder-signoff">
                      <span className="founder-name">Anurag</span>
                      <span className="founder-sep">—</span>
                      <span className="founder-role">Founder, CipherSchools</span>
                    </div>
                  </div>

                  {/* Blurred Right Newspaper Column Preview */}
                  <div className="newspaper-side-column-blur">
                    <div className="news-side-header">Recent post</div>
                    <div className="news-side-card">
                      <div className="news-side-avatar">
                        <span>🎓</span>
                      </div>
                      <div className="news-side-info">
                        <span className="news-side-date">2020 – 2026</span>
                        <h5 className="news-side-title">Campus Impact</h5>
                      </div>
                    </div>
                    <div className="news-side-dummy-lines">
                      <span className="dummy-line" style={{ width: '92%' }}></span>
                      <span className="dummy-line" style={{ width: '78%' }}></span>
                      <span className="dummy-line" style={{ width: '84%' }}></span>
                    </div>
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
          
          {/* Section Header */}
          <div className="bento-impact-header">
            <span className="bento-impact-eyebrow">OUR REACH & OUTCOMES</span>
            <h2 className="bento-impact-title">
              The Impact CipherSchools Has Created.
            </h2>
          </div>

          <div className="modern-bento-container-frame">
            
            {/* Bento Cell 1: 50k+ Active Learners */}
            <div className="bento-cell cell-learners">
              <div className="bento-cell-top-row">
                <div className="bento-cell-tag"><Brain size={14} /> ACTIVE COMMUNITY</div>
                <span className="bento-status-pill pill-green">
                  <span className="bento-live-dot"></span> ACTIVELY GROWING
                </span>
              </div>
              <div className="bento-stat-num">
                <CountUp end={50} suffix="k+" />
              </div>
              <div className="bento-cell-body">
                <h4 className="bento-stat-label">Daily Active Coders</h4>
                <p className="bento-stat-caption">Building verified code streaks every day.</p>
              </div>
              <div className="bento-avatar-stack-wrap">
                <div className="bento-avatar-stack">
                  <div className="bento-avatar-circle bento-avatar-1">AK</div>
                  <div className="bento-avatar-circle bento-avatar-2">PR</div>
                  <div className="bento-avatar-circle bento-avatar-3">ST</div>
                  <div className="bento-avatar-circle bento-avatar-4">VM</div>
                  <div className="bento-avatar-circle bento-avatar-more">+48k</div>
                </div>
                <span className="bento-mini-pulse-chip">
                  <Zap size={11} /> 1.2M+ Submissions
                </span>
              </div>
            </div>

            {/* Bento Cell 2: Starts @ ₹0 */}
            <div className="bento-cell cell-zero">
              <div className="bento-cell-top-row">
                <div className="bento-cell-tag tag-orange"><Sparkles size={14} /> ZERO FRICTION</div>
                <span className="bento-status-pill">FREE ACCESS</span>
              </div>
              <div className="bento-stat-num text-brand-orange">
                Starts @ ₹0
              </div>
              <div className="bento-cell-body">
                <h4 className="bento-stat-label">No Paywalls. No Cards.</h4>
                <p className="bento-stat-caption">Start building without financial friction.</p>
              </div>
              <div className="bento-check-list">
                <div className="bento-check-item">
                  <Check size={13} className="bento-check-icon" />
                  <span>100% Free Guided Pathways</span>
                </div>
                <div className="bento-check-item">
                  <Check size={13} className="bento-check-icon" />
                  <span>Interactive In-Browser Labs</span>
                </div>
                <div className="bento-check-item">
                  <Check size={13} className="bento-check-icon" />
                  <span>Recognized Skill Credentials</span>
                </div>
              </div>
            </div>

            {/* Bento Cell 3: 30k+ Badges & Certificates */}
            <div className="bento-cell cell-badges">
              <div className="bento-cell-top-row">
                <div className="bento-cell-tag"><Layers size={14} /> VERIFIED SKILLS</div>
                <span className="bento-status-pill"><Award size={11} /> ACCREDITED</span>
              </div>
              <div className="bento-stat-num">
                <CountUp end={30} suffix="k+" />
              </div>
              <div className="bento-cell-body">
                <h4 className="bento-stat-label">Certificates Issued</h4>
                <p className="bento-stat-caption">Proof of competence recruiters trust.</p>
              </div>
              <div className="bento-cert-badges-row">
                <span className="bento-cert-chip highlight">
                  <Star size={11} /> Full-Stack Web
                </span>
                <span className="bento-cert-chip">
                  <Code2 size={11} /> DSA Mastery
                </span>
                <span className="bento-cert-chip">
                  <ShieldCheck size={11} /> System Design
                </span>
              </div>
            </div>

            {/* Bento Cell 4: 20k+ Proctored Tests Conducted */}
            <div className="bento-cell cell-proctored">
              <div className="bento-cell-top-row">
                <div className="bento-cell-tag"><ShieldCheck size={14} /> PROCTORED ASSESSMENTS</div>
                <span className="bento-status-pill">AI MONITORED</span>
              </div>
              <div className="bento-stat-num">
                <CountUp end={20} suffix="k+" />
              </div>
              <div className="bento-cell-body">
                <h4 className="bento-stat-label">Campus Tests Conducted</h4>
                <p className="bento-stat-caption">Secure evaluations across universities.</p>
              </div>
              <div className="bento-proctor-row">
                <span className="bento-integrity-pill">
                  <ShieldCheck size={12} /> 99.8% Integrity
                </span>
                <span className="bento-campus-pill">
                  120+ Campuses
                </span>
                <span className="bento-campus-pill">
                  Auto Scoring
                </span>
              </div>
            </div>

            {/* Bento Cell 5: Service-Based to Product-Based Transition */}
            <div className="bento-cell cell-transition">
              <div className="bento-cell-top-row">
                <div className="bento-cell-tag"><TrendingUp size={14} /> CAREER TRANSITION</div>
                <span className="bento-transition-hike-badge">
                  <Flame size={12} /> 3.2x Avg Hike
                </span>
              </div>
              <div className="bento-stat-num text-brand-dark" style={{ fontSize: '1.85rem', lineHeight: 1.1, margin: '0.2rem 0 0.4rem 0' }}>
                Service <span style={{ color: '#ffa103' }}>➔</span> Product
              </div>
              <div className="bento-cell-body">
                <h4 className="bento-stat-label">Tier-1 Company Readiness</h4>
                <p className="bento-stat-caption">Targeted interview sprints & architecture rigor.</p>
              </div>
              <div className="bento-roadmap-pills">
                <span className="bento-roadmap-pill orange">System Design</span>
                <span className="bento-roadmap-pill">1:1 Mock Interviews</span>
              </div>
            </div>

            {/* Bento Cell 6: 300+ Industry Mentors */}
            <div className="bento-cell cell-mentors">
              <div className="bento-cell-top-row">
                <div className="bento-cell-tag"><Users size={14} /> INDUSTRY EXPERTS</div>
                <span className="bento-rating-tag">
                  <Star size={11} className="bento-star-icon" /> 4.9/5 Rating
                </span>
              </div>
              <div className="bento-stat-num text-brand-orange">
                <CountUp end={300} suffix="+" />
              </div>
              <div className="bento-cell-body">
                <h4 className="bento-stat-label">Senior Tech Mentors</h4>
                <p className="bento-stat-caption">Direct guidance from top-tier engineers.</p>
              </div>
              <div className="bento-logos-row">
                <div className="bento-logo-chip" title="Google">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <div className="bento-logo-chip" title="Microsoft">
                  <svg width="16" height="16" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                </div>
                <div className="bento-logo-chip" title="Amazon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF9900">
                    <path d="M13.96 12.33c-.08-.6-.35-1.07-.82-1.42s-1.12-.53-1.96-.53c-.63 0-1.22.12-1.77.36-.55.24-.96.59-1.23 1.05l1.32.9c.14-.24.34-.43.6-.57.26-.14.54-.21.84-.21.43 0 .76.1.98.29.22.19.33.45.33.78v.37c-.37.04-.84.09-1.41.15s-1.1.18-1.59.36c-.49.18-.88.44-1.17.78-.29.34-.44.78-.44 1.32 0 .54.18.98.54 1.32.36.34.84.51 1.44.51.53 0 1-.12 1.41-.36.41-.24.73-.57.96-1.01v1.17h1.67V12.33zm-1.84 2.82c-.2.32-.47.56-.8.72-.33.16-.69.24-1.08.24-.34 0-.62-.09-.84-.27-.22-.18-.33-.42-.33-.72 0-.35.14-.64.42-.87.28-.23.75-.41 1.41-.54.66-.13 1.15-.22 1.47-.27v.29c0 .54-.08.99-.25 1.42z"/>
                    <path d="M19.16 16.73c-2.8 2.06-6.87 3.15-10.37 3.15-4.89 0-9.3-1.83-12.63-4.9.26.24.8.46 1.32.46 2.94 0 7.37-1.62 9.94-3.15.22-.13.46.12.26.31-1.08.98-3.08 2.29-6.3 2.29-1.03 0-2.02-.15-2.92-.47 3.01 2.37 6.87 3.79 11.08 3.79 3.16 0 6.64-.86 9.42-2.61.34-.21.57.17.2.13z"/>
                  </svg>
                </div>
                <div className="bento-logo-chip" title="Meta">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0081FB">
                    <path d="M12 11.217C10.63 8.358 8.442 6.5 6.07 6.5 2.717 6.5 0 9.388 0 12.946c0 3.42 2.57 6.35 6.07 6.35 2.213 0 4.195-1.18 5.93-3.606 1.735 2.426 3.717 3.606 5.93 3.606 3.5 0 6.07-2.93 6.07-6.35 0-3.558-2.717-6.446-6.07-6.446-2.372 0-4.56 1.858-5.93 4.717zm0 2.66c-1.428 2.528-3.082 3.87-4.887 3.87-2.43 0-4.22-2.146-4.22-4.801 0-2.607 1.83-4.897 4.22-4.897 1.855 0 3.486 1.417 4.887 3.996v1.832zm4.887 3.87c-1.805 0-3.46-1.342-4.887-3.87v-1.832c1.4-2.58 3.032-3.996 4.887-3.996 2.39 0 4.22 2.29 4.22 4.897 0 2.655-1.79 4.801-4.22 4.801z"/>
                  </svg>
                </div>
                <div className="bento-logo-chip" title="Adobe">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="#FA0F00">
                    <path d="M13.966 22h6.034L20 2H13.966v20zM4 2v20h6.034L4 2zm5.017 11.207l2.983-7.207 4.966 12h-3.414l-1.552-3.828H9.017z"/>
                  </svg>
                </div>
                <div className="bento-logo-chip" title="Netflix">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E50914">
                    <path d="M5.398 0v24c1.196-.18 2.417-.378 3.673-.594V0H5.398zm9.531 0v19.467c1.23-.238 2.45-.478 3.673-.718V0h-3.673zm-4.757 0l4.084 21.055c-1.25.216-2.47.414-3.693.606L6.478 0h3.694z"/>
                  </svg>
                </div>
                <div className="bento-logo-chip bento-logo-more" title="25+ more product companies">
                  <span>+25</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>
  );
};

export default ImpactBar;
