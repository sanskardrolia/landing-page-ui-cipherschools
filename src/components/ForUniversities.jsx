import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Sparkles, Bot, Code2, Users, Zap, Coffee, Network, Laptop, Plus, Briefcase, TrendingUp, Target, Wrench, MessageSquare, Rocket, Presentation, Flame, Compass, Globe, RefreshCw, X, CheckCircle2, Play, Lock, User, AlertTriangle, FileText, Clock, BookOpen, Award, HelpCircle, ArrowDown, Menu, Search, Bell, Sun, Home, Calendar, ClipboardList, BarChart2, Folder, Volume2, GraduationCap, ChevronRight, CornerDownRight, ExternalLink, Brain, BrainCircuit, Cpu, Calculator, Database, Check } from 'lucide-react';
import TrustedBy from './TrustedBy';
import './ForUniversities.css';

/* ─── Typing animation component ─── */
const TypingText = ({ text, delay = 0, speed = 40 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return <span>{displayedText}</span>;
};

/* ─── Scroll-reveal hook (callback ref) ─── */
const useReveal = (threshold = 0.15) => {
  const [visible, setVisible] = useState(false);
  const obsRef = useRef(null);

  const ref = useCallback((node) => {
    if (obsRef.current) obsRef.current.disconnect();
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(node); } },
      { threshold }
    );
    obs.observe(node);
    obsRef.current = obs;
  }, [threshold]);

  return [ref, visible];
};


/* ─── Tech Pairing Combos & Industry Outcome Mapping ─── */
const DOMAIN_MAPPINGS = [
  {
    id: 'fullstack-cloud',
    title: 'Full-Stack + Cloud Engineering',
    role: 'SDE II / Full-Stack Engineer',
    avgSalary: '₹14 - 28 LPA',
    demandScore: '98% Recruiter Alignment',
    skills: ['MERN / Next.js', 'DevOps & CI/CD', 'AWS Cloud Deployment'],
    icon: <Globe size={20} />,
    description: 'Combines modern web frameworks with automated deployment pipelines to build scalable cloud-native products.'
  },
  {
    id: 'dsa-genai',
    title: 'DSA + Generative AI Architect',
    role: 'AI / ML Engineer',
    avgSalary: '₹16 - 32 LPA',
    demandScore: '96% Recruiter Alignment',
    skills: ['Advanced DSA', 'Python / PyTorch', 'GenAI & LLM Fine-Tuning'],
    icon: <Brain size={20} />,
    description: 'Blends algorithmic problem-solving with cutting-edge AI models for intelligent automation and data products.'
  },
  {
    id: 'backend-systems',
    title: 'Backend + System Design',
    role: 'Backend Systems Engineer',
    avgSalary: '₹15 - 30 LPA',
    demandScore: '95% Recruiter Alignment',
    skills: ['Core Java / Go', 'PostgreSQL & Redis', 'System Design & Microservices'],
    icon: <Database size={20} />,
    description: 'Focuses on high-concurrency microservices, data persistence, and enterprise system architecture.'
  },
  {
    id: 'frontend-ux',
    title: 'Frontend + AI Engineering',
    role: 'Frontend Product Architect',
    avgSalary: '₹12 - 24 LPA',
    demandScore: '94% Recruiter Alignment',
    skills: ['React / TypeScript', 'Tailwind & UI Engineering', 'Vercel / Edge AI'],
    icon: <Code2 size={20} />,
    description: 'Crafts ultra-fast, responsive user interfaces integrated with edge AI models and real-time APIs.'
  },
  {
    id: 'devops-sec',
    title: 'DevOps + Cloud Security',
    role: 'Cloud Infrastructure Engineer',
    avgSalary: '₹14 - 26 LPA',
    demandScore: '93% Recruiter Alignment',
    skills: ['Docker & Kubernetes', 'Terraform / IaC', 'Cloud Security & Monitoring'],
    icon: <Cpu size={20} />,
    description: 'Master container orchestration, infrastructure as code, and enterprise-grade security protocols.'
  }
];

/* ─── Gemini AI Fluid Text Reveal Component ─── */
const GeminiTextReveal = ({ text }) => {
  const words = text.split(" ");
  const accentWords = ["Ultimate", "Arms", "Training", "Placement", "Support"];
  
  return (
    <h1 className="gemini-ai-reveal-title">
      {words.map((word, idx) => {
        const cleanWord = word.replace(/[^a-zA-Z]/g, "");
        const isAccent = accentWords.includes(cleanWord);
        return (
          <span 
            key={idx} 
            className={`gemini-word ${isAccent ? 'gemini-accent' : ''}`}
            style={{ animationDelay: `${0.12 * idx}s` }}
          >
            {word}{' '}
          </span>
        );
      })}
    </h1>
  );
};


const ForUniversities = () => {
  const [step, setStep] = useState('question'); // 'question' | 'result'
  const [selected, setSelected] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [ripple, setRipple] = useState(null);
  const [activeComboIndex, setActiveComboIndex] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);

  /* scroll-reveal refs */
  const [refHeroText, visHeroText] = useReveal();
  const [refShift, visShift] = useReveal();
  const [refTraining, visTraining] = useReveal();
  const [refTyping, visTyping] = useReveal();
  const [refStack, visStack] = useReveal();
  const [refQuote, visQuote] = useReveal();
  const [refPair, visPair] = useReveal();
  const [refImages, visImages] = useReveal();
  const [refCta, visCta] = useReveal();
  const [refIndustry, visIndustry] = useReveal();
  const [refDoers, visDoers] = useReveal();
  const [refBeyond, visBeyond] = useReveal();
  const [refBreather1, visBreather1] = useReveal();
  const [refBreather2, visBreather2] = useReveal();
  const [refHelp, visHelp] = useReveal();
  const [refLms, visLms] = useReveal();
  const [refAssessment, visAssessment] = useReveal();
  const [autoHighlightIndex, setAutoHighlightIndex] = useState(null);
  const [activeAssessmentTab, setActiveAssessmentTab] = useState('coding');

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);

    // Auto-highlight sequence
    const timers = [];
    timers.push(setTimeout(() => setAutoHighlightIndex(0), 800));
    timers.push(setTimeout(() => setAutoHighlightIndex(1), 1600));
    timers.push(setTimeout(() => setAutoHighlightIndex(2), 2400));
    timers.push(setTimeout(() => setAutoHighlightIndex(null), 3200));

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  useEffect(() => {
    if (step === 'result') {
      const timer = setTimeout(() => setShowStickyCta(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowStickyCta(false);
    }
  }, [step]);

  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 } // 5% visibility is enough to be considered "entered"
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleSelect = (id) => {
    setRipple(id);
    setSelected(id);
    setStep('result');
    setTimeout(() => {
      setIsVisible(true);
      let targetId = 'shift-section';
      if (id === 'training') targetId = 'training-section';
      if (id === 'lms') targetId = 'lms-section';
      if (id === 'assessment') targetId = 'assessment-section';

      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  const handleBack = () => {
    setStep('question');
    setSelected(null);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const options = [
    { 
      id: 'training', 
      label: <>Training <span className="fu-pitch-accent">Support</span></>, 
      icon: <BrainCircuit size={28} />,
      desc: "End-to-end tech skilling & placement prep for your students.",
      stats: [
        { value: '4+', label: 'Tracks' },
        { value: '200+', label: 'Hours' },
      ],
      features: ['Live Mentorship', 'Project Based', 'Industry Ready'],
    },
    { 
      id: 'lms', 
      label: <>Campus <span className="fu-pitch-accent">LMS</span></>, 
      icon: <Laptop size={28} />,
      desc: "White-labeled platform for effortless learning management.",
      stats: [
        { value: '100%', label: 'Custom' },
        { value: '24/7', label: 'Access' },
      ],
      features: ['Video Modules', 'Analytics', 'Stage Locking'],
    },
    { 
      id: 'assessment', 
      label: <>Assessment <span className="fu-pitch-accent">Platform</span></>, 
      icon: <CheckCircle2 size={28} />,
      desc: "AI-powered evaluation with proctoring & detailed analytics.",
      stats: [
        { value: 'AI', label: 'Proctored' },
        { value: '∞', label: 'Tests' },
      ],
      features: ['Practice Tests', 'AI Hints', 'Result Dashboard'],
    },
  ];

  return (
    <div className="fu-pitch-page" ref={containerRef}>

      {/* ─── QUESTION SCREEN (Always visible now) ─── */}
      <div className={`fu-pitch-container fu-visible`}>
        <div className="fu-pitch-header">
          <p className="fu-pitch-eyebrow">For Universities & Colleges</p>
          <h1 className="fu-pitch-title">
            How <span className="fu-pitch-accent">CipherSchools</span> can help your university?
          </h1>
        </div>

        <div className="fu-pitch-grid">
          {options.map((opt, idx) => (
            <div
              key={opt.id}
              className={`fu-pitch-option ${selected === opt.id ? 'fu-selected' : ''} ${ripple === opt.id ? 'fu-ripple' : ''} ${autoHighlightIndex === idx ? 'fu-auto-highlight' : ''}`}
              onClick={() => handleSelect(opt.id)}
              style={{ animationDelay: `${0.15 + idx * 0.1}s` }}
            >
              {/* Top visual area */}
              <div className="fu-pitch-option-visual">
                <div className="fu-pitch-option-icon-wrapper">
                  {opt.icon}
                </div>
                <div className="fu-pitch-option-stats">
                  {opt.stats.map((stat, si) => (
                    <div key={si} className="fu-stat-chip">
                      <span className="fu-stat-value">{stat.value}</span>
                      <span className="fu-stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content area */}
              <div className="fu-pitch-option-body">
                <h3 className="fu-pitch-option-text">{opt.label}</h3>
                <p className="fu-pitch-option-desc">{opt.desc}</p>
                <div className="fu-pitch-option-tags">
                  {opt.features.map((f, fi) => (
                    <span key={fi} className="fu-feature-tag">{f}</span>
                  ))}
                </div>
              </div>

              {selected === opt.id && <div className="fu-check-badge"><Sparkles size={16} /></div>}
            </div>
          ))}
        </div>
      </div>

      {/* ─── RESULT SCREEN (Visible conditionally) ─── */}
      {step === 'result' && (
        <div className={`fu-result-page ${isVisible ? 'fu-visible' : ''}`}>

          {/* Full Screen Text Reveal Hero */}
          <div ref={refHeroText} className={`fu-fullscreen-hero fu-reveal ${visHeroText ? 'fu-revealed' : ''}`}>
            <div className="gemini-ambient-glow"></div>
            <div className="fu-hero-glow-orb orb-1"></div>
            <div className="fu-hero-glow-orb orb-2"></div>

            <div className="fu-fullscreen-content">
              <GeminiTextReveal text="We are the Ultimate Arms for Training and Placement Support" />
            </div>
          </div>

          {/* Trusted By Top Colleges Marquee */}
          <TrustedBy />

          {/* ── 1. The Shift (Light Theme 2-Card Layout) ── */}
          <section id="shift-section" ref={refShift} className={`fu-sec fu-shift-bento-section fu-reveal ${visShift ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              <div className="fu-shift-header">
                <p className="fu-sec-eyebrow">THE SHIFT</p>
                <h2 className="fu-shift-title">
                  Industry is not looking for what<br />
                  we saw <span className="fu-pitch-accent">2–3 years</span> back...
                </h2>
              </div>

              <div className="fu-shift-bento-grid">
                
                {/* Card 1 (Left): Single-Skill Focus */}
                <div className="fu-bento-card card-circuit">
                  <div className="fu-card-text">
                    <h3 className="fu-card-title">Single-Skill Focus</h3>
                    <p className="fu-card-sub">
                      Relying on just <em>one technology</em> or <em>DSA practice</em> is <em>no longer</em> enough for <strong>campus placement</strong>.
                    </p>
                  </div>
                  <div className="fu-graphic-circuit">
                    <div className="circuit-line left-line"></div>
                    <div className="circuit-line right-line"></div>
                    <div className="circuit-node-center">
                      <div className="circuit-ring-outer">
                        <div className="circuit-ring-inner">
                          <Code2 size={22} className="circuit-icon" />
                        </div>
                      </div>
                    </div>
                    <div className="glow-dot dot-1"></div>
                    <div className="glow-dot dot-2"></div>
                  </div>
                </div>

                {/* Card 2 (Right): Same Legacy Curriculum */}
                <div className="fu-bento-card card-pricing">
                  <div className="fu-card-text">
                    <h3 className="fu-card-title">Same Legacy Curriculum</h3>
                    <p className="fu-card-sub">
                      <em>Static syllabi</em> out of sync with <em>fast-moving tech</em> requirements lack real-world engineering practices.
                    </p>
                  </div>
                  <div className="fu-graphic-pill-banner">
                    <div className="pill-banner-badge">
                      <X size={16} className="pill-x-icon" />
                      <span>Outdated Standards</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ── 5. Industry Outcome Mapping (Exact Screenshot Match) ── */}
          <section id="hire-section" ref={refPair} className={`fu-sec fu-outcome-mapping-section fu-reveal ${visPair ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              <div className="fu-outcome-header">
                <h2 className="fu-outcome-title">
                  Time Has Changed - Companies <span className="fu-pitch-accent">Look For.</span>
                </h2>
                <p className="fu-outcome-sub">
                  The <em>right combination</em> over just one skill from students
                </p>
              </div>

              {/* Interactive Bento Stage */}
              <div className="fu-outcome-bento-grid">
                
                {/* Main Hero Combination Card */}
                <div className="fu-outcome-hero-card">
                  <div className="fu-hero-card-header">
                    <div className="fu-role-badge">
                      <Sparkles size={14} /> ROLE: {DOMAIN_MAPPINGS[activeComboIndex]?.role || DOMAIN_MAPPINGS[0].role}
                    </div>
                    <div className="fu-salary-chip">
                      Avg Package: <strong className="text-orange">{DOMAIN_MAPPINGS[activeComboIndex]?.avgSalary || DOMAIN_MAPPINGS[0].avgSalary}</strong>
                    </div>
                  </div>

                  <h3 className="fu-hero-combo-title">{DOMAIN_MAPPINGS[activeComboIndex]?.title || DOMAIN_MAPPINGS[0].title}</h3>
                  <p className="fu-hero-combo-desc">{DOMAIN_MAPPINGS[activeComboIndex]?.description || DOMAIN_MAPPINGS[0].description}</p>

                  {/* Mix & Match Technology Combination Flow */}
                  <div className="fu-combo-flow-stage">
                    <p className="fu-flow-label">RECRUITER TECHNOLOGY COMBO STACK:</p>
                    <div className="fu-combo-pills-flow">
                      {(DOMAIN_MAPPINGS[activeComboIndex]?.skills || DOMAIN_MAPPINGS[0].skills).map((skill, si) => (
                        <React.Fragment key={si}>
                          {si > 0 && <span className="fu-flow-plus">+</span>}
                          <div className="fu-flow-skill-pill">
                            {skill}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Mix & Match Shuffle & Solution Buttons */}
                  <div className="fu-hero-card-footer">
                    <div className="fu-action-btn-group">
                      <button 
                        className="fu-shuffle-domain-btn"
                        onClick={() => setActiveComboIndex((prev) => (prev + 1) % DOMAIN_MAPPINGS.length)}
                      >
                        <RefreshCw size={15} className="fu-spin-icon" /> Next Combination
                      </button>
                      <button 
                        className="fu-solution-btn"
                        onClick={() => {
                          const target = document.getElementById('training-section');
                          if (target) target.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <RefreshCw size={15} /> Want Solution?
                      </button>
                    </div>
                    <span className="fu-demand-score-tag">{DOMAIN_MAPPINGS[activeComboIndex]?.demandScore || '98% Recruiter Look For This Stack'}</span>
                  </div>
                </div>

                {/* Side Bento Card 1: Capstones Projects */}
                <div className="fu-outcome-side-card card-capstone">
                  <div className="fu-side-card-icon"><Code2 size={20} /></div>
                  <h4>Capstones Projects</h4>
                  <p>Students build <em>real-world</em> production applications/projects.</p>
                  <div className="fu-card-foot-tag">HANDS-ON LABS INCLUDED</div>
                </div>

                {/* Side Bento Card 2: Tier-1 Alignment */}
                <div className="fu-outcome-side-card card-alignment">
                  <div className="fu-side-card-icon"><TrendingUp size={20} /></div>
                  <h4>Tier-1 Alignment</h4>
                  <p>Designed around the <em>real interview frameworks</em> and <em>screening benchmarks</em> used by top tech companies.</p>
                  <div className="fu-card-foot-tag">UPDATED QUARTERLY</div>
                </div>

              </div>

            </div>
          </section>

          {/* ── 4. Training Solutions (Crisp & Solution-Oriented - No Emojis) ── */}
          <section id="training-section" ref={refTraining} className={`fu-sec fu-training-solutions-section fu-reveal ${visTraining ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              <div className="fu-solutions-header">
                <p className="fu-sec-eyebrow">Solutions We Provide</p>
                <h2 className="fu-solutions-title">
                  Structured programs that build <span className="fu-pitch-accent">real</span> engineers.
                </h2>
                <p className="fu-solutions-sub">
                  Customizable 3, 6, or 9-month programs designed around your university calendar.
                </p>
              </div>

              {/* Crisp 4-Card Solution Grid */}
              <div className="fu-solutions-grid-4">
                
                {/* Solution 1: Academic Training */}
                <div className="fu-solution-card">
                  <div className="fu-solution-card-top">
                    <div className="fu-solution-icon-badge">
                      <BookOpen size={22} className="icon-orange" />
                    </div>
                    <span className="fu-solution-tag">Solution 01</span>
                  </div>
                  <h3 className="fu-solution-title">Academic Training</h3>
                  <p className="fu-solution-desc">
                    Strengthen CS & engineering fundamentals early through semester-aligned DSA, full-stack, and cloud tracks.
                  </p>
                  <div className="fu-solution-chips">
                    <span>1 Semester</span>
                    <span>2nd Year Students</span>
                  </div>
                </div>

                {/* Solution 2: Placement Preparation */}
                <div className="fu-solution-card fu-featured-solution">
                  <div className="fu-solution-card-top">
                    <div className="fu-solution-icon-badge">
                      <Target size={22} className="icon-orange" />
                    </div>
                    <span className="fu-popular-badge">MOST POPULAR</span>
                  </div>
                  <h3 className="fu-solution-title">Placement Preparation</h3>
                  <p className="fu-solution-desc">
                    Intensive recruitment bootcamp covering DSA, System Design, SQL, and AI mock interviews to boost hiring rates.
                  </p>
                  <div className="fu-solution-chips">
                    <span>4–6 Weeks</span>
                    <span>3rd & 4th Year</span>
                  </div>
                </div>

                {/* Solution 3: Advanced Technical Excellence */}
                <div className="fu-solution-card">
                  <div className="fu-solution-card-top">
                    <div className="fu-solution-icon-badge">
                      <Rocket size={22} className="icon-orange" />
                    </div>
                    <span className="fu-solution-tag">Solution 03</span>
                  </div>
                  <h3 className="fu-solution-title">Advanced Technical Excellence</h3>
                  <p className="fu-solution-desc">
                    High-performer track for students targeting Tier-1 product companies, high LPA packages, and complex systems.
                  </p>
                  <div className="fu-solution-chips">
                    <span>12 Weeks</span>
                    <span>High Performers</span>
                  </div>
                </div>

                {/* Solution 4: Seasonal Programs */}
                <div className="fu-solution-card">
                  <div className="fu-solution-card-top">
                    <div className="fu-solution-icon-badge">
                      <Zap size={22} className="icon-orange" />
                    </div>
                    <span className="fu-solution-tag">Solution 04</span>
                  </div>
                  <h3 className="fu-solution-title">Seasonal Programs</h3>
                  <p className="fu-solution-desc">
                    Short-term summer & winter break sprints providing project certifications and rapid skill upgrades.
                  </p>
                  <div className="fu-solution-chips">
                    <span>Summer / Winter</span>
                    <span>Online / Offline</span>
                  </div>
                </div>

              </div>

              <div className="fu-training-custom-banner">
                <div className="fu-custom-icon-box"><Clock size={18} /></div>
                <div className="fu-custom-text">
                  <strong>Need a tailored schedule?</strong> Durations and curriculum modules are fully customizable to fit your university's exact semester dates.
                </div>
              </div>
            </div>
          </section>

          {/* ── 6. Beyond Domain (Redesigned Light Theme Bento Grid) ── */}
          <section ref={refBeyond} className={`fu-sec fu-beyond-light-bento fu-reveal ${visBeyond ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              <div className="fu-beyond-header">
                <p className="fu-sec-eyebrow">Beyond Subjects & Domains</p>
                <h2 className="fu-beyond-title">
                  We are not limited <span className="fu-pitch-accent">to what you see.</span>
                </h2>
                <p className="fu-beyond-sub">
                  We support your institution for all upcoming tech stacks, domain specializations, and career pathways.
                </p>
              </div>

              <div className="fu-beyond-bento-grid">
                
                {/* Card 1: Immersive Bootcamps */}
                <div className="fu-light-bento-card card-bootcamps">
                  <div className="fu-card-text">
                    <div className="fu-light-icon-badge">
                      <Flame size={24} className="icon-orange" />
                    </div>
                    <h3 className="fu-light-card-title">Immersive Bootcamps</h3>
                    <p className="fu-light-card-sub">
                      Intensive, hands-on sprints designed to build and deploy full-scale enterprise projects in weeks, not years.
                    </p>
                  </div>
                  <div className="fu-bento-graphic-bootcamp">
                    <div className="bootcamp-stat-pill">
                      <Sparkles size={14} /> 4-6 Week Sprints
                    </div>
                  </div>
                </div>

                {/* Card 2: Hands-on Workshops */}
                <div className="fu-light-bento-card card-workshops">
                  <div className="fu-card-text">
                    <div className="fu-light-icon-badge">
                      <Presentation size={24} className="icon-orange" />
                    </div>
                    <h3 className="fu-light-card-title">Hands-on Workshops</h3>
                    <p className="fu-light-card-sub">
                      Focused interactive masterclasses mastering the latest production tools, cloud systems, and AI workflows.
                    </p>
                  </div>
                  <div className="fu-bento-graphic-workshop">
                    <div className="workshop-pill">Live Masterclasses</div>
                  </div>
                </div>

                {/* Card 3: Industry Leader Sessions */}
                <div className="fu-light-bento-card card-sessions">
                  <div className="fu-card-text">
                    <div className="fu-light-icon-badge">
                      <Globe size={24} className="icon-orange" />
                    </div>
                    <h3 className="fu-light-card-title">Industry Leader Sessions</h3>
                    <p className="fu-light-card-sub">
                      Direct live interactions, tech talks, and AMA sessions with engineering leaders from top product companies.
                    </p>
                  </div>
                  <div className="fu-bento-graphic-sessions">
                    <span className="live-dot-tag">● Live Tech Talks</span>
                  </div>
                </div>

                {/* Card 4: 1:1 Mentorship & Career Guidance */}
                <div className="fu-light-bento-card card-mentorship">
                  <div className="fu-card-text">
                    <div className="fu-light-icon-badge">
                      <Compass size={24} className="icon-orange" />
                    </div>
                    <h3 className="fu-light-card-title">1:1 Mentorship & Career Guidance</h3>
                    <p className="fu-light-card-sub">
                      Mock interviews, resume reviews, portfolio audits, and 1:1 mentorship to crack top technical hiring bars.
                    </p>
                  </div>
                  <div className="fu-bento-graphic-mentorship">
                    <div className="mentorship-chip">100% Interview Ready</div>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* ── BREATHER 1 ── */}
          <section ref={refBreather1} className={`fu-sec fu-sec-breather fu-reveal ${visBreather1 ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              <div className="fu-breather-img-container">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop" alt="Collaborative learning" className="fu-breather-img" />
              </div>
            </div>
          </section>




          {/* ── BREATHER 2 ── */}
          <section ref={refBreather2} className={`fu-sec fu-sec-breather fu-reveal ${visBreather2 ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              <div className="fu-breather-img-container fu-breather-tall">
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop" alt="Modern workspace" className="fu-breather-img" />
              </div>
            </div>
          </section>



          {/* ── 5.5 LMS Bento Section ── */}
          <section id="lms-section" ref={refLms} className={`fu-sec fu-lms-bento-section fu-reveal ${visLms ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              <div className="fu-lms-header">
                <p className="fu-sec-eyebrow">LMS - CipherSchools</p>
                <h2 className="fu-lms-title">
                  A platform built for effortless learning management.
                </h2>
                <p className="fu-lms-sub">
                  White-labeled campus ecosystem providing seamless course delivery, real-time analytics, automated stage locking, and student progress tracking.
                </p>
              </div>
              
              {/* Exact Replica LMS Dashboard Screen */}
              <div className="lms-replica-wrapper">
                {/* Top Navbar */}
                <div className="lms-replica-topbar">
                  <div className="lms-top-left">
                    <button className="lms-hamburger-btn"><Menu size={18} /></button>
                    <div className="lms-logo-brand">
                      <span className="lms-logo-icon">C</span>
                      <span className="lms-logo-text">CipherSchools</span>
                    </div>
                    <div className="lms-guide-me-btn">Guide Me</div>
                  </div>
                  <div className="lms-top-search">
                    <input type="text" placeholder="Search and Learn" readOnly />
                    <Search size={16} className="lms-search-icon" />
                  </div>
                  <div className="lms-top-right">
                    <div className="lms-bell-box">
                      <Bell size={18} />
                      <span className="lms-badge">0</span>
                    </div>
                    <div className="lms-user-avatar-row">
                      <div className="lms-avatar-circle">
                        <User size={16} />
                      </div>
                      <span className="lms-user-name">Hey Sanskar</span>
                    </div>
                    <div className="lms-coin-pill">
                      <span className="lms-coin-icon">C</span>
                      <span>2.68K</span>
                    </div>
                    <div className="lms-theme-toggle">
                      <Sun size={16} />
                    </div>
                  </div>
                </div>

                {/* Main Body Grid: Sidebar + Workspace + Right Column */}
                <div className="lms-replica-body">
                  {/* Left Sidebar */}
                  <div className="lms-replica-sidebar">
                    <div className="lms-menu-item active">
                      <Home size={18} />
                      <span>Home</span>
                    </div>
                    <div className="lms-menu-item">
                      <Calendar size={18} />
                      <span>Syllabus</span>
                    </div>
                    <div className="lms-menu-item">
                      <ClipboardList size={18} />
                      <span>Practice</span>
                    </div>
                    <div className="lms-menu-item">
                      <FileText size={18} />
                      <span>Tests</span>
                    </div>
                    <div className="lms-menu-item">
                      <BarChart2 size={18} />
                      <span>Projects</span>
                    </div>
                    <div className="lms-menu-item">
                      <Folder size={18} />
                      <span>Resources</span>
                    </div>
                    <div className="lms-menu-item">
                      <Volume2 size={18} />
                      <span>Updates</span>
                      <span className="lms-updates-badge">14</span>
                    </div>
                    <div className="lms-menu-item">
                      <HelpCircle size={18} />
                      <span>Help & Support</span>
                    </div>
                    <div className="lms-menu-item">
                      <Code2 size={18} />
                      <span>Online Compiler</span>
                    </div>
                    <div className="lms-menu-item lms-menu-bottom">
                      <GraduationCap size={18} />
                      <span>My Batches</span>
                    </div>
                  </div>

                  {/* Center Workspace */}
                  <div className="lms-replica-center">
                    <div className="lms-center-header">
                      <h2>Hey Sanskar,</h2>
                      <button className="lms-back-btn">← Back</button>
                    </div>

                    <div className="lms-important-label">Important</div>

                    <div className="lms-action-buttons-row">
                      <button className="lms-action-btn whatsapp-btn">Join WhatsApp Group</button>
                      <button className="lms-action-btn outline-btn">Complete Profile</button>
                      <button className="lms-action-btn outline-btn">Get Certificate</button>
                    </div>

                    {/* Course Announcement Card */}
                    <div className="lms-main-course-card">
                      <h3>Java Programming Live 2026</h3>
                      <p className="lms-course-greeting">Hey there,</p>
                      <p className="lms-course-desc">
                        We're excited to have you join our LIVE course — designed to help you learn concepts in a practical and engaging way....
                      </p>
                      <a href="#" className="lms-readmore-link" onClick={(e) => e.preventDefault()}>Read more <span>⌄</span></a>

                      <div className="lms-card-divider"></div>

                      <div className="lms-course-metadata-grid">
                        <div className="lms-meta-col">
                          <span className="lms-meta-label">Start Date</span>
                          <span className="lms-meta-val">June 12, 2026</span>
                        </div>
                        <div className="lms-meta-col">
                          <span className="lms-meta-label">Duration</span>
                          <span className="lms-meta-val">7 Weeks</span>
                        </div>
                        <div className="lms-meta-col">
                          <span className="lms-meta-label">Mentor</span>
                          <span className="lms-meta-val">Cipher Schools</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel Widgets */}
                  <div className="lms-replica-right">
                    {/* Dark Graphic Banner */}
                    <div className="lms-course-banner-card">
                      <div className="lms-banner-content">
                        <span className="lms-live-badge">Live Lectures | Online</span>
                        <h4>Java Programming with OOPs</h4>
                      </div>
                      <div className="lms-java-logo">☕</div>
                    </div>

                    {/* Widget 1: Total Tests Attempted */}
                    <div className="lms-widget-card">
                      <span className="lms-widget-title">Total Tests Attempted</span>
                      <div className="lms-widget-stat">0/8</div>
                      <a href="#" className="lms-widget-link" onClick={(e) => e.preventDefault()}>Take Test →</a>
                    </div>

                    {/* Widget 2: Total Projects Completed */}
                    <div className="lms-widget-card">
                      <span className="lms-widget-title">Total Projects Completed</span>
                      <div className="lms-widget-stat">0/1</div>
                      <a href="#" className="lms-widget-link" onClick={(e) => e.preventDefault()}>View Projects →</a>
                    </div>

                    {/* Widget 3: Upcoming Test */}
                    <div className="lms-widget-card upcoming-test-widget">
                      <div className="lms-widget-header">
                        <span>Upcoming Test</span>
                        <a href="#" onClick={(e) => e.preventDefault()}>View more ›</a>
                      </div>
                      <div className="lms-upcoming-box">
                        <div className="lms-code-badge">&gt;_</div>
                        <div className="lms-upcoming-info">
                          <div className="lms-upcoming-title">STP'26 – Final Test | ...</div>
                          <div className="lms-upcoming-tags">
                            <span className="lms-tag-coding">CODING</span>
                            <span className="lms-tag-meta">3 Questions</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LMS Bento Feature Cards Grid */}
              <div className="fu-lms-bento-cards-grid">
                <div className="fu-bento-card card-lms-feat">
                  <div className="fu-card-text">
                    <div className="fu-side-card-icon"><Lock size={22} /></div>
                    <h3 className="fu-card-title">Automated Stage Locking</h3>
                    <p className="fu-card-sub">
                      Ensure prerequisite compliance by unlocking advanced modules only after students pass automated checkpoint quizzes.
                    </p>
                  </div>
                </div>

                <div className="fu-bento-card card-lms-feat">
                  <div className="fu-card-text">
                    <div className="fu-side-card-icon"><BarChart2 size={22} /></div>
                    <h3 className="fu-card-title">Real-Time Campus Analytics</h3>
                    <p className="fu-card-sub">
                      Granular insights into student attendance, test attempt rates, code submissions, and batch-wise performance metrics.
                    </p>
                  </div>
                </div>

                <div className="fu-bento-card card-lms-feat">
                  <div className="fu-card-text">
                    <div className="fu-side-card-icon"><Laptop size={22} /></div>
                    <h3 className="fu-card-title">White-Labeled Branding</h3>
                    <p className="fu-card-sub">
                      Custom-branded LMS portal integrated with your university logo, colors, and custom sub-domain name.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── NEW 5.6 Assessment Platform ── */}
          {/* ── 7. Assessment Platform (Redesigned Light Theme & Smart Color Balance) ── */}
          <section id="assessment-section" ref={refAssessment} className={`fu-sec fu-assessment-light-section fu-reveal ${visAssessment ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              <div className="fu-assessment-header">
                <p className="fu-sec-eyebrow">Assessment Platform</p>
                <h2 className="fu-assessment-title">
                  Measure what matters, <span className="fu-pitch-accent">automatically.</span>
                </h2>
                <p className="fu-assessment-sub">
                  AI-powered evaluations, multi-language coding sandboxes, proctored aptitude tests, and real-time candidate analytics.
                </p>
              </div>

              <div className="fu-assessment-split-stage">
                <div className="fu-as-tabs-col">
                  {[
                    { id: 'coding', label: 'Coding assessments', desc: 'Full IDE with multi-language compiler & System Design support.', icon: <Code2 size={20} /> },
                    { id: 'aptitude', label: 'Aptitude tests', desc: 'Logical reasoning and quantitative analysis.', icon: <Compass size={20} /> },
                    { id: 'comm_skill', label: 'AI Mock - Interview', desc: 'Simulated real-time AI technical & HR mock interviews.', icon: <Bot size={20} /> },
                    { id: 'analytics', label: 'Performance analytics', desc: 'Deep dive into student capabilities & growth trajectory.', icon: <TrendingUp size={20} /> },
                    { id: 'qbank', label: 'Question bank management', desc: 'Organize and curate your institutional test library.', icon: <FileText size={20} /> },
                  ].map(tab => (
                    <div key={tab.id} className={`fu-light-as-tab ${activeAssessmentTab === tab.id ? 'active-light-tab' : ''}`} onClick={() => setActiveAssessmentTab(tab.id)}>
                      <div className="fu-as-tab-icon">{tab.icon}</div>
                      <div className="fu-as-tab-text">
                        <h4>{tab.label}</h4>
                        <p>{tab.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="fu-assessment-mockup-wrapper">
                  <div className="fu-assessment-mockup">
                    {activeAssessmentTab === 'coding' && (
                      <div className="fu-mock-as-coding-rich">
                        <div className="fme-coding-header">
                          <div className="fme-lang-pills">
                            <span className="fme-lang-chip active">C</span>
                            <span className="fme-lang-chip active">C++</span>
                            <span className="fme-lang-chip active">JAVA</span>
                            <span className="fme-lang-chip active">Python</span>
                          </div>
                          <div className="fme-sys-badge"><Sparkles size={12} /> System Design ⚡</div>
                        </div>

                        <div className="fme-coding-body">
                          <div className="fme-editor-top">
                            <span className="fme-file-tab">system_architecture.py</span>
                            <span className="fme-mode-tag">Multi-Language Compiler</span>
                          </div>
                          <div className="fm-editor-code">
                            <span className="fm-comment"># Fully charged for System Design & Coding</span><br/>
                            <span className="fm-kwd">class</span> <span className="fm-func">LoadBalancer</span>:<br/>
                            &nbsp;&nbsp;<span className="fm-kwd">def</span> <span className="fm-func">__init__</span>(self, nodes):<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;self.nodes = nodes<br/>
                            &nbsp;&nbsp;<span className="fm-kwd">def</span> <span className="fm-func">route</span>(self, req):<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="fm-kwd">return</span> self.nodes[hash(req) % len(self.nodes)]
                          </div>
                          <div className="fme-editor-action">
                            <span className="fme-status-text">Production Ready</span>
                            <div className="fm-editor-btn">Run & Submit</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeAssessmentTab === 'aptitude' && (
                      <div className="fu-mock-as-exam">
                        <div className="fme-header">
                          <span className="fme-time">12:30</span>
                          <span className="fme-qnum">Logical Reasoning</span>
                        </div>
                        <div className="fme-body">
                          <div className="fme-q">If all A are B, and some B are C, which is true?</div>
                          <div className="fme-options">
                            <div className="fme-opt"><div className="fme-radio"></div>All A are C</div>
                            <div className="fme-opt"><div className="fme-radio"></div>Some A are C</div>
                            <div className="fme-opt active"><div className="fme-radio checked"></div>None of the above</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeAssessmentTab === 'comm_skill' && (
                      <div className="fu-mock-ai-interview-light">
                        {/* Top Video Call Bar */}
                        <div className="fu-ai-call-topbar">
                          <div className="fu-ai-call-info">
                            <div className="fu-ai-avatar-badge">
                              <Bot size={18} />
                            </div>
                            <div>
                              <h4 className="fu-ai-call-name">AI Technical Interviewer</h4>
                              <span className="fu-ai-call-sub">System Architecture & Coding Session</span>
                            </div>
                          </div>
                          <div className="fu-ai-live-tag">
                            <span className="fu-ai-live-dot"></span> AI Speaking
                          </div>
                        </div>

                        {/* Video Call Stage Grid */}
                        <div className="fu-ai-call-stage">
                          
                          {/* Dummy AI Talking Screen */}
                          <div className="fu-ai-screen-card">
                            <div className="fu-ai-screen-inner">
                              <div className="fu-ai-avatar-orb">
                                <div className="fu-ai-pulse-ring ring-1"></div>
                                <div className="fu-ai-pulse-ring ring-2"></div>
                                <div className="fu-ai-orb-core">
                                  <Bot size={32} className="fu-ai-bot-icon" />
                                </div>
                              </div>
                              <span className="fu-ai-speaking-label">AI Interviewer</span>

                              {/* AI Audio Wave Animation */}
                              <div className="fu-ai-audio-waves">
                                <span className="ai-wave-bar"></span>
                                <span className="ai-wave-bar"></span>
                                <span className="ai-wave-bar"></span>
                                <span className="ai-wave-bar"></span>
                                <span className="ai-wave-bar"></span>
                              </div>
                            </div>
                          </div>

                          {/* Speech & Evaluation Panel */}
                          <div className="fu-ai-dialogue-panel">
                            
                            {/* AI Question Speech Box */}
                            <div className="fu-ai-speech-bubble">
                              <span className="fu-speech-author">AI Question:</span>
                              <p className="fu-speech-text">
                                "How do you handle data consistency vs availability in a distributed database system?"
                              </p>
                            </div>

                            {/* Candidate Response Bar */}
                            <div className="fu-candidate-res-card">
                              <div className="fu-res-header">
                                <span className="fu-res-label">Candidate Response</span>
                                <span className="fu-res-score">Confidence 94%</span>
                              </div>
                              <div className="fu-res-wave-row">
                                <div className="fu-mic-icon-box">
                                  <Volume2 size={16} />
                                </div>
                                <div className="fu-res-wave-bars">
                                  <span className="res-bar"></span>
                                  <span className="res-bar"></span>
                                  <span className="res-bar"></span>
                                  <span className="res-bar"></span>
                                  <span className="res-bar"></span>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>
                      </div>
                    )}
                    {activeAssessmentTab === 'analytics' && (
                      <div className="fu-mock-as-analytics">
                        <div className="fma-header">
                          <div className="fma-title-group">
                            <TrendingUp size={18} color="#f7931e" />
                            <div>
                              <h4>Student Performance Trajectory</h4>
                              <span className="fma-sub">Jan to May Exponential Growth Curve</span>
                            </div>
                          </div>
                          <span className="fma-badge">+184% Growth 🚀</span>
                        </div>

                        <div className="fma-chart-box">
                          <div className="fma-chart-header">
                            <div className="fma-chart-metric">
                              <span className="fma-metric-num">96%</span>
                              <span className="fma-metric-lbl">May Readiness Score</span>
                            </div>
                            <div className="fma-chart-legend">
                              <span className="fma-legend-dot"></span> Exponential Growth Line (Jan - May)
                            </div>
                          </div>

                          {/* SVG Exponential Line Chart */}
                          <div className="fma-svg-container">
                            <svg viewBox="0 0 500 160" className="fma-svg-chart">
                              <defs>
                                <linearGradient id="fmaGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#f7931e" stopOpacity="0.35"/>
                                  <stop offset="100%" stopColor="#f7931e" stopOpacity="0.0"/>
                                </linearGradient>
                              </defs>
                              
                              {/* Grid lines */}
                              <line x1="40" y1="30" x2="470" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                              <line x1="40" y1="70" x2="470" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                              <line x1="40" y1="110" x2="470" y2="110" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                              {/* Area Fill */}
                              <path d="M 40 125 Q 150 115 250 85 T 470 25 L 470 140 L 40 140 Z" fill="url(#fmaGradient)" />

                              {/* Exponential Curve Line */}
                              <path d="M 40 125 Q 150 115 250 85 T 470 25" fill="none" stroke="#f7931e" strokeWidth="3.5" strokeLinecap="round" />

                              {/* Data Points */}
                              <circle cx="40" cy="125" r="5" fill="#f7931e" stroke="#fff" strokeWidth="2" />
                              <text x="40" y="115" fill="#aaa" fontSize="11" textAnchor="middle">32%</text>
                              <text x="40" y="155" fill="#888" fontSize="11" textAnchor="middle">Jan</text>

                              <circle cx="147" cy="112" r="5" fill="#f7931e" stroke="#fff" strokeWidth="2" />
                              <text x="147" y="102" fill="#aaa" fontSize="11" textAnchor="middle">48%</text>
                              <text x="147" y="155" fill="#888" fontSize="11" textAnchor="middle">Feb</text>

                              <circle cx="255" cy="85" r="5" fill="#f7931e" stroke="#fff" strokeWidth="2" />
                              <text x="255" y="72" fill="#ffa103" fontSize="11" fontWeight="bold" textAnchor="middle">68%</text>
                              <text x="255" y="155" fill="#888" fontSize="11" textAnchor="middle">March</text>

                              <circle cx="362" cy="52" r="5" fill="#f7931e" stroke="#fff" strokeWidth="2" />
                              <text x="362" y="40" fill="#aaa" fontSize="11" textAnchor="middle">84%</text>
                              <text x="362" y="155" fill="#888" fontSize="11" textAnchor="middle">Apr</text>

                              <circle cx="470" cy="25" r="6.5" fill="#00c853" stroke="#fff" strokeWidth="2" />
                              <text x="470" y="14" fill="#00c853" fontSize="11" fontWeight="900" textAnchor="middle">96% 🔥</text>
                              <text x="470" y="155" fill="#00c853" fontSize="11" fontWeight="bold" textAnchor="middle">May</text>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeAssessmentTab === 'qbank' && (
                      <div className="fu-mock-as-qbank-rich">
                        <div className="fmq-header">
                          <div className="fmq-title-group">
                            <FileText size={18} color="#f7931e" />
                            <div>
                              <h4>Question Bank Library</h4>
                              <span className="fmq-sub">10,000+ Curated Problems</span>
                            </div>
                          </div>
                          <div className="fmq-tags-bar">
                            <span className="fmq-filter-tag active">SQL</span>
                            <span className="fmq-filter-tag active">Programming</span>
                            <span className="fmq-filter-tag active">DSA</span>
                          </div>
                        </div>

                        <div className="fmq-list-container">
                          <div className="fmq-item-rich">
                            <div className="fmq-item-left">
                              <span className="fmq-cat-chip sql">SQL</span>
                              <div>
                                <div className="fmq-item-title">Nth Highest Salary Query</div>
                                <span className="fmq-item-meta">Database • Window Functions</span>
                              </div>
                            </div>
                            <span className="fm-tag med">Medium</span>
                          </div>

                          <div className="fmq-item-rich">
                            <div className="fmq-item-left">
                              <span className="fmq-cat-chip prog">Programming</span>
                              <div>
                                <div className="fmq-item-title">LRU Cache Implementation</div>
                                <span className="fmq-item-meta">OOP & Hash Map</span>
                              </div>
                            </div>
                            <span className="fm-tag hard">Hard</span>
                          </div>

                          <div className="fmq-item-rich">
                            <div className="fmq-item-left">
                              <span className="fmq-cat-chip dsa">DSA</span>
                              <div>
                                <div className="fmq-item-title">Binary Tree Traversal</div>
                                <span className="fmq-item-meta">Data Structures • BFS</span>
                              </div>
                            </div>
                            <span className="fm-tag easy">Easy</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Highlights Bar Below Mockup */}
                  {activeAssessmentTab === 'coding' && (
                    <div className="fu-mock-bottom-highlight aptitude-highlight">
                      <div className="fmb-aptitude-grid">
                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Code2 size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>Multi-Language IDE</h4>
                            <p className="fmb-apt-desc">C / C++ / JAVA / Python runtime support</p>
                          </div>
                        </div>

                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Sparkles size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>System Design Included</h4>
                            <p className="fmb-apt-desc">From Programming to System Design problems</p>
                          </div>
                        </div>

                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><CheckCircle2 size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>Automated Evaluation</h4>
                            <p className="fmb-apt-desc">Instant testcase execution & score reports</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeAssessmentTab === 'aptitude' && (
                    <div className="fu-mock-bottom-highlight aptitude-highlight">
                      <div className="fmb-aptitude-grid">
                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Brain size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>Logical Reasoning</h4>
                            <p className="fmb-apt-desc">Puzzles, series & coding-decoding</p>
                          </div>
                        </div>

                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Cpu size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>Algorithmic Thinking</h4>
                            <p className="fmb-apt-desc">Step-by-step logic & computational flow</p>
                          </div>
                        </div>

                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Calculator size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>Quant & Analytics</h4>
                            <p className="fmb-apt-desc">Math, ratios & probability concepts</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeAssessmentTab === 'comm_skill' && (
                    <div className="fu-mock-bottom-highlight aptitude-highlight">
                      <div className="fmb-aptitude-grid">
                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Bot size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>AI Interviewer</h4>
                            <p className="fmb-apt-desc">Real-time technical & HR rounds</p>
                          </div>
                        </div>

                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Volume2 size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>Voice Metrics</h4>
                            <p className="fmb-apt-desc">Speech clarity, pacing & confidence</p>
                          </div>
                        </div>

                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Award size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>Instant Scorecard</h4>
                            <p className="fmb-apt-desc">STAR method & hiring feedback</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeAssessmentTab === 'analytics' && (
                    <div className="fu-mock-bottom-highlight aptitude-highlight">
                      <div className="fmb-aptitude-grid">
                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><TrendingUp size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>Exponential Growth</h4>
                            <p className="fmb-apt-desc">Jan (32%) → May (96%) trajectory</p>
                          </div>
                        </div>

                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><BarChart2 size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>Skill Diagnostics</h4>
                            <p className="fmb-apt-desc">DSA, System Design & weakness radar</p>
                          </div>
                        </div>

                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Target size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>Placement Predictor</h4>
                            <p className="fmb-apt-desc">Company readiness & cohort benchmarks</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeAssessmentTab === 'qbank' && (
                    <div className="fu-mock-bottom-highlight aptitude-highlight">
                      <div className="fmb-aptitude-grid">
                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Database size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>SQL & Databases</h4>
                            <p className="fmb-apt-desc">Complex queries, joins & schema design</p>
                          </div>
                        </div>

                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Code2 size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>Core Programming</h4>
                            <p className="fmb-apt-desc">Syntax, OOP concepts & logic building</p>
                          </div>
                        </div>

                        <div className="fmb-apt-card">
                          <div className="fmb-apt-icon"><Network size={18} /></div>
                          <div className="fmb-apt-body">
                            <h4>DSA Problems</h4>
                            <p className="fmb-apt-desc">Trees, graphs, DP & algorithmic rigor</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>



          {/* ── 7. Image Bento ── */}
          <section ref={refImages} className={`fu-sec fu-sec-images fu-reveal ${visImages ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              <div className="fu-img-bento">
                <div className="fu-img-card fu-img-large">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" alt="Students collaborating" />
                  <div className="fu-img-overlay"><span>Build Together</span></div>
                </div>
                <div className="fu-img-card">
                  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop" alt="Coding" />
                  <div className="fu-img-overlay"><span>Ship Code</span></div>
                </div>
                <div className="fu-img-card">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop" alt="Mentorship" />
                  <div className="fu-img-overlay"><span>Learn from Experts</span></div>
                </div>
                <div className="fu-img-card fu-img-wide">
                  <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop" alt="Campus" />
                  <div className="fu-img-overlay"><span>Transform Your Campus</span></div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 7. CTA ── */}
          <section ref={refCta} className={`fu-sec fu-sec-cta-final fu-reveal ${visCta ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner fu-cta-final-inner">
              <Coffee size={48} className="fu-cta-coffee-icon" />
              <h2 className="fu-cta-final-title">
                Let's connect over a <span className="fu-pitch-accent">chai or coffee.</span>
              </h2>
              <p className="fu-cta-final-sub">
                Explore how CipherSchools can transform your institution's placement numbers and technical training.
              </p>
              <button className="fu-pitch-cta-btn" style={{ marginTop: '2rem' }}>
                Book a Meeting <ArrowRight size={20} />
              </button>
            </div>
          </section>

        </div>
      )}

      {/* ── STICKY CTA ── */}
      <div className={`fu-sticky-cta ${showStickyCta ? 'fu-sticky-visible' : ''}`}>
        <div className="fu-sticky-cta-inner">
          <p>Let's connect over a <strong>quick walkthrough</strong> meeting</p>
          <button className="fu-sticky-btn">Book Meeting <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default ForUniversities;
