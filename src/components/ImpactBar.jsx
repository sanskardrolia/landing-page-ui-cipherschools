import React, { useState, useEffect, useRef } from 'react';
import { Brain, Cloud, Terminal, Layers, ArrowDown, MessageCircle, ArrowUpRight, BookOpen, Play, Code2, Award, Briefcase, Sparkles, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
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
              <div className="hero-product-offerings-path-wrapper">
                <div className="hero-product-offerings-dock path-flow-dock">
                  
                  {/* Step 1: LEARN */}
                  <div 
                    className="hero-offering-pillar path-step-card step-1"
                    onClick={() => scrollToSection('training-section')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="pillar-step-top">
                      <span className="pillar-step-tag">FOUNDATION</span>
                    </div>
                    <div className="offering-content">
                      <h4 className="offering-title">TRAINING SUPPORT</h4>
                      <p className="offering-desc">Campus LMS & Learning</p>
                    </div>
                  </div>

                  {/* Connector Arrow 1 -> 2 */}
                  <div className="hero-path-connector">
                    <div className="path-line"></div>
                    <div className="path-arrow-node">
                      <ChevronRight size={12} />
                    </div>
                  </div>

                  {/* Step 2: ASSESS */}
                  <div 
                    className="hero-offering-pillar path-step-card step-2"
                    onClick={() => scrollToSection('assessment-section')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="pillar-step-top">
                      <span className="pillar-step-tag">EVALUATION</span>
                    </div>
                    <div className="offering-content">
                      <h4 className="offering-title">ASSESS</h4>
                      <p className="offering-desc">Assessments & Performance</p>
                    </div>
                  </div>

                  {/* Connector Arrow 2 -> 3 */}
                  <div className="hero-path-connector">
                    <div className="path-line"></div>
                    <div className="path-arrow-node">
                      <ChevronRight size={12} />
                    </div>
                  </div>

                  {/* Step 3: PRACTICE */}
                  <div 
                    className="hero-offering-pillar path-step-card step-3"
                    onClick={() => scrollToSection('lms-section')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="pillar-step-top">
                      <span className="pillar-step-tag">HANDS-ON</span>
                    </div>
                    <div className="offering-content">
                      <h4 className="offering-title">PRACTICE</h4>
                      <p className="offering-desc">CipherLabs & Resume Builder</p>
                    </div>
                  </div>

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
                  <span className="ind-dot"></span> Learn From Videos
                </button>
                <button 
                  className={`mockup-indicator-pill ${activeMockupIndex === 2 ? 'active' : ''}`}
                  onClick={() => setActiveMockupIndex(2)}
                  type="button"
                >
                  <span className="ind-dot"></span> Build Resume
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

                {/* Card 2: Interactive Learning Portal */}
                <div 
                  className={`stacked-mockup-card card-portal ${activeMockupIndex === 1 ? 'card-active' : (activeMockupIndex === 0 ? 'card-next' : 'card-past')}`}
                  onClick={() => setActiveMockupIndex(1)}
                >
                  <div className="mockup-window-header">
                    <span className="window-title">CipherSchools - Interactive Learning Portal</span>
                  </div>
                  <div className="mockup-window-body">
                    <img src="/hero-mockup-right.png" alt="CipherSchools Course Player Mockup" className="mockup-img" />
                  </div>
                </div>

                {/* Card 3: AI Resume Builder */}
                <div 
                  className={`stacked-mockup-card card-resume ${activeMockupIndex === 2 ? 'card-active' : (activeMockupIndex === 1 ? 'card-next' : 'card-deep')}`}
                  onClick={() => setActiveMockupIndex(2)}
                >
                  <div className="mockup-window-header">
                    <span className="window-title">CipherSchools - AI Resume Builder</span>
                  </div>
                  <div className="mockup-window-body">
                    <img src="/hero-mockup-resume.png" alt="CipherSchools AI Resume Builder Mockup" className="mockup-img" />
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

      </section>
  );
};

export default ImpactBar;
