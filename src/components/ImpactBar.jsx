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

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
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
          
          {/* Surround Notion Studio Hero Cards */}
          <div className="notion-hero-banner-wrapper">
            
            {/* Top-Left 1: Yellow Post-It Note */}
            <div className="notion-banner-card card-postit">
              <div className="postit-pin"></div>
              <p className="postit-text">
                Build real-world projects, master DSA, and crack dream engineering roles with ease.
              </p>
            </div>

            {/* Top-Left 2: Floating Blue Check Icon Badge */}
            <div className="notion-banner-card card-check-badge">
              <div className="check-badge-inner">
                <CheckCircle2 size={24} className="check-icon-blue" />
              </div>
            </div>

            {/* Top-Right 2: Reminders Tab Card */}
            <div className="notion-banner-card card-reminders">
              <div className="notion-card-tab-header">
                <span>Reminders</span>
              </div>
              <div className="notion-card-body">
                <div className="reminder-task-title">Today's Workshop</div>
                <div className="reminder-time-pill">
                  <Clock size={12} /> 14:00 - 15:30
                </div>
              </div>
            </div>

            {/* Bottom-Left: Practice Today Folder Card */}
            <div className="notion-banner-card card-tasks">
              <div className="notion-card-tab-header">
                <span>Practice Today</span>
              </div>
              <div className="notion-card-body">
                <div className="task-item">
                  <div className="task-info">
                    <span className="task-dot orange"></span>
                    <span className="task-name">Programming</span>
                  </div>
                  <div className="task-progress-bar">
                    <div className="task-progress-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="task-item">
                  <div className="task-info">
                    <span className="task-dot green"></span>
                    <span className="task-name">DSA & Algorithms</span>
                  </div>
                  <div className="task-progress-bar">
                    <div className="task-progress-fill" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="task-item" style={{ marginBottom: 0 }}>
                  <div className="task-info">
                    <span className="task-dot blue"></span>
                    <span className="task-name">SQL Queries</span>
                  </div>
                  <span className="task-status-badge">Ready</span>
                </div>
              </div>
            </div>

            {/* Bottom-Right: Resume Builder Card */}
            <div className="notion-banner-card card-integrations">
              <div className="notion-card-tab-header">
                <span>Resume Builder</span>
              </div>
              <div className="notion-card-body partners-icon-row">
                <div className="partner-logo-pill google">ATS Optimized</div>
                <div className="partner-logo-pill msft">Professional</div>
                <div className="partner-logo-pill amzn">Multiple Variants</div>
              </div>
            </div>

          </div>
          
          {/* Top Pill Badge */}
          <div className="notion-pill-badge" onClick={() => scrollToSection('welcome-section')}>
            <span className="notion-badge-dot"></span>
            <span>BEYOND ED-TECH PLATFORM</span>
            <span className="notion-badge-arrow">→</span>
          </div>

          {/* Main Headline */}
          <h1 className="impact-headline-main">
            <span className="headline-black-italic">WE ARE BEYOND</span><br className="headline-break" />
            <span className="headline-orange-italic">ED-TECH COMPANY</span>
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
