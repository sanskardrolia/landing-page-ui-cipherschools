import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Sparkles, Bot, Code2, Users, Zap, Coffee, Network, Laptop, Plus, Briefcase, TrendingUp, Target, Wrench, MessageSquare, Rocket, Presentation, Flame, Compass, Globe, RefreshCw, X, CheckCircle2, Play, Lock, User, AlertTriangle, FileText, Clock, BookOpen, Award, HelpCircle, ArrowDown, Menu, Search, Bell, Sun, Home, Calendar, ClipboardList, BarChart2, Folder, Volume2, GraduationCap, ChevronRight, CornerDownRight, ExternalLink, Brain, BrainCircuit, Cpu, Calculator, Database, Check, Terminal } from 'lucide-react';
import TrustedBy from './TrustedBy';
import BookMeetingModal from './BookMeetingModal';
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

/* ─── Typewriter Chat Question Component ─── */
const TypewriterChatQuestion = ({ inView }) => {
  const fullText = "How CipherSchools can help your university?";
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setDisplayedLength(0);
    let current = 0;
    const interval = setInterval(() => {
      if (current <= fullText.length) {
        setDisplayedLength(current);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 38);
    return () => clearInterval(interval);
  }, [inView]);

  const currentText = fullText.slice(0, displayedLength);

  const renderTextWithHighlight = (str) => {
    const target = "CipherSchools";
    const idx = str.indexOf(target);
    if (idx === -1) return str;
    const before = str.slice(0, idx);
    const match = str.slice(idx, idx + target.length);
    const after = str.slice(idx + target.length);
    return (
      <>
        {before}
        <span className="fu-pitch-accent">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className="fu-smart-help-header-row">
      <p className="fu-smart-help-question">
        {renderTextWithHighlight(currentText)}
        <span className="fu-typing-cursor">|</span>
      </p>
    </div>
  );
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


/* ─── Open Source Tech Stack SVGs ─── */
const getTechLogo = (skill) => {
  if (!skill || typeof skill !== 'string') {
    return <Code2 size={16} className="tech-icon-amber" />;
  }
  try {
    if (skill.includes('Next.js') || skill.includes('React') || skill.includes('Frontend') || skill.includes('Tailwind')) {
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#000000">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.4 14.8-5.3-7.5v7.5H9.6V7.2h1.6l5.3 7.5V7.2h1.5v9.6z"/>
        </svg>
      );
    }
    if (skill.includes('DevOps') || skill.includes('Docker') || skill.includes('IaC') || skill.includes('Terraform')) {
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#2496ED">
          <path d="M13.98 11.08h2.12v2.12h-2.12zm-3.18 0h2.12v2.12h-2.12zm-3.18 0h2.12v2.12H7.62zm-3.18 0h2.12v2.12H4.44zm3.18-3.18h2.12v2.12H7.62zm3.18 0h2.12v2.12h-2.12zm3.18 0h2.12v2.12h-2.12zm-6.36-3.18h2.12v2.12H7.62zm3.18 0h2.12v2.12h-2.12zm11.75 6.94c-.45-.33-1.42-.45-2.27-.33-.27-1.12-1.09-2.07-2.19-2.58l-.4-.18-.28.33c-.66.77-.96 1.76-.9 2.76H1.5v1.89c0 3.86 2.92 7 6.51 7 4.14 0 7.42-3.15 7.82-7.14.7-.09 1.94-.48 2.5-1.43l.23-.38-.27-.22z"/>
        </svg>
      );
    }
    if (skill.includes('AWS') || skill.includes('Cloud') || skill.includes('Security')) {
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#FF9900">
          <path d="M18.75 14.23c-1.34 1.07-3.23 1.62-4.91 1.62-2.37 0-4.5-.89-6.13-2.37-.13-.12-.29-.06-.23.1.52 1.34 1.76 2.73 3.39 3.49 1.78.83 3.73.95 5.56.44.25-.07.39-.33.25-.56l-.32-.57c-.11-.2-.36-.26-.61-.15zm1.57-2.48c-.28-.36-1.85-.43-2.54-.34-.21.03-.25.26-.06.39.63.43 1.66.74 2.33.37.19-.11.45-.19.27-.42zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        </svg>
      );
    }
    if (skill.includes('Python') || skill.includes('PyTorch')) {
      return (
        <svg width="17" height="17" viewBox="0 0 24 24">
          <path fill="#3776AB" d="M11.89 2c-4.22 0-3.95 1.83-3.95 1.83l.01 1.9h4.02v.57H6.38s-2.38.27-2.38 3.94c0 3.67 2.07 3.54 2.07 3.54h1.24v-1.74s-.07-2.07 2.04-2.07h3.49s1.97.03 1.97-1.92V3.97S16.27 2 11.89 2z"/>
          <path fill="#FFD43B" d="M12.11 22c4.22 0 3.95-1.83 3.95-1.83l-.01-1.9h-4.02v-.57h5.59s2.38-.27 2.38-3.94c0-3.67-2.07-3.54-2.07-3.54h-1.24v1.74s.07 2.07-2.04 2.07h-3.49s-1.97-.03-1.97 1.92v3.98S7.73 22 12.11 22z"/>
        </svg>
      );
    }
    if (skill.includes('Vercel') || skill.includes('Edge')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000">
          <path d="M12 1L24 22H0L12 1Z"/>
        </svg>
      );
    }
    if (skill.includes('Kubernetes')) {
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#326CE5">
          <path d="M12 2L2.5 7.5v11L12 24l9.5-5.5v-11L12 2zm0 3.5l6.5 3.8v7.4L12 20.5l-6.5-3.8V9.3L12 5.5z"/>
        </svg>
      );
    }
    if (skill.includes('PostgreSQL') || skill.includes('Database') || skill.includes('Redis')) {
      return <Database size={16} className="tech-icon-emerald" />;
    }
    if (skill.includes('GenAI') || skill.includes('LLM') || skill.includes('AI')) {
      return <Brain size={16} className="tech-icon-purple" />;
    }
  } catch (err) {
    console.error("Tech logo error:", err);
  }
  return <Code2 size={16} className="tech-icon-amber" />;
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
    icon: <Globe size={20} />
  },
  {
    id: 'dsa-genai',
    title: 'DSA + Generative AI Architect',
    role: 'AI / ML Engineer',
    avgSalary: '₹16 - 32 LPA',
    demandScore: '96% Recruiter Alignment',
    skills: ['Advanced DSA', 'Python / PyTorch', 'GenAI & LLM Fine-Tuning'],
    icon: <Brain size={20} />
  },
  {
    id: 'backend-systems',
    title: 'Backend + System Design',
    role: 'Backend Systems Engineer',
    avgSalary: '₹15 - 30 LPA',
    demandScore: '95% Recruiter Alignment',
    skills: ['Core Java / Go', 'PostgreSQL & Redis', 'System Design & Microservices'],
    icon: <Database size={20} />
  },
  {
    id: 'frontend-ux',
    title: 'Frontend + AI Engineering',
    role: 'Frontend Product Architect',
    avgSalary: '₹12 - 24 LPA',
    demandScore: '94% Recruiter Alignment',
    skills: ['React / TypeScript', 'Tailwind & UI Engineering', 'Vercel / Edge AI'],
    icon: <Code2 size={20} />
  },
  {
    id: 'devops-sec',
    title: 'DevOps + Cloud Security',
    role: 'Cloud Infrastructure Engineer',
    avgSalary: '₹14 - 26 LPA',
    demandScore: '93% Recruiter Alignment',
    skills: ['Docker & Kubernetes', 'Terraform / IaC', 'Cloud Security & Monitoring'],
    icon: <Cpu size={20} />
  }
];

/* ─── Gemini AI Fluid Text Reveal Component (Hero Style) ─── */
const GeminiTextReveal = () => {
  return (
    <div className="fu-hero-header-wrap">
      {/* Top Hero Pill Badge */}
      <div className="fu-hero-pill-badge">
        <span className="fu-pill-dot"></span>
        <span>FOR UNIVERSITIES & INSTITUTIONS</span>
        <span className="fu-pill-arrow">→</span>
      </div>

      <h1 className="gemini-ai-reveal-title">
        <span className="gemini-title-line">
          <span className="gemini-word" style={{ animationDelay: '0.05s' }}>We</span>{' '}
          <span className="gemini-word" style={{ animationDelay: '0.1s' }}>are</span>{' '}
          <span className="gemini-word" style={{ animationDelay: '0.15s' }}>the</span>{' '}
          <span className="gemini-word gemini-accent" style={{ animationDelay: '0.2s' }}>Ultimate Arms</span>{' '}
          <span className="gemini-word" style={{ animationDelay: '0.28s' }}>for</span>
        </span>
        <span className="gemini-title-line">
          <span className="gemini-word gemini-accent" style={{ animationDelay: '0.36s' }}>Training</span>{' '}
          <span className="gemini-word" style={{ animationDelay: '0.44s' }}>and</span>{' '}
          <span className="gemini-word gemini-accent" style={{ animationDelay: '0.52s' }}>Placement Support</span>
        </span>
      </h1>

      <p className="gemini-hero-sub-text">
        Transforming campus placement outcomes with industry-aligned technical training, automated coding assessments, and enterprise LMS infrastructure.
      </p>
    </div>
  );
};


const ForUniversities = () => {
  const [step, setStep] = useState('question'); // 'question' | 'result'
  const [selected, setSelected] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [ripple, setRipple] = useState(null);
  const [activeComboIndex, setActiveComboIndex] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  /* scroll-reveal refs */
  const [refHeroText, visHeroText] = useReveal();
  const [refShift, visShift] = useReveal();
  const [refTraining, visTraining] = useReveal();
  const [refTyping, visTyping] = useReveal();
  const [refStack, visStack] = useReveal();
  const [refQuote, visQuote] = useReveal();
  const [refPair, visPair] = useReveal();
  const [refCta, visCta] = useReveal();
  const [refIndustry, visIndustry] = useReveal();
  const [refDoers, visDoers] = useReveal();
  const [refBeyond, visBeyond] = useReveal();
  const [refBreather1, visBreather1] = useReveal();
  const [refBreather2, visBreather2] = useReveal();
  const [refHelp, visHelp] = useReveal();
  const [refLms, visLms] = useReveal();
  const [refAssessment, visAssessment] = useReveal();
  const [activeAssessmentTab, setActiveAssessmentTab] = useState('coding');
  const [isAutoRotateAssessment, setIsAutoRotateAssessment] = useState(true);

  // Auto-rotate Assessment Tabs every 2.5s until user interacts
  useEffect(() => {
    if (!isAutoRotateAssessment) return;
    const assessmentTabs = ['coding', 'aptitude', 'comm_skill', 'analytics'];
    const interval = setInterval(() => {
      setActiveAssessmentTab(prev => {
        const nextIdx = (assessmentTabs.indexOf(prev) + 1) % assessmentTabs.length;
        return assessmentTabs[nextIdx];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isAutoRotateAssessment]);

  const handleAssessmentTabClick = (tabId) => {
    setIsAutoRotateAssessment(false);
    setActiveAssessmentTab(tabId);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const universityEl = document.getElementById('university-section');
      const studentEl = document.getElementById('student-section');
      const heroEl = document.getElementById('hero-impact-section');
      const welcomeEl = document.getElementById('welcome-section');

      const windowHeight = window.innerHeight;

      // Check if student, hero, or welcome sections are active in viewport
      const isStudentActive = studentEl && (studentEl.getBoundingClientRect().top <= windowHeight * 0.6 && studentEl.getBoundingClientRect().bottom >= 100);
      const isHeroActive = heroEl && (heroEl.getBoundingClientRect().bottom > 150);
      const isWelcomeActive = welcomeEl && (welcomeEl.getBoundingClientRect().top <= windowHeight * 0.6 && welcomeEl.getBoundingClientRect().bottom >= 100);

      // If user is viewing For Students or Hero or Welcome Gateway section, HIDE sticky CTA completely
      if (isStudentActive || isHeroActive || isWelcomeActive) {
        setShowStickyCta(false);
        setIsMeetingModalOpen(false);
        return;
      }

      // Check if For University section is in viewport
      if (universityEl) {
        const uniRect = universityEl.getBoundingClientRect();
        if (uniRect.top <= windowHeight * 0.75 && uniRect.bottom >= 150) {
          setShowStickyCta(true);
        } else {
          setShowStickyCta(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      if (id === 'training') targetId = 'shift-section';
      if (id === 'lms') targetId = 'lms-section';
      if (id === 'assessment') targetId = 'assessment-section';

      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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

      {/* Full Screen Text Reveal Hero + Embedded Smart Help Options */}
      <div ref={refHeroText} className={`fu-fullscreen-hero fu-reveal ${visHeroText ? 'fu-revealed' : ''}`}>
        <div className="gemini-ambient-glow"></div>
        <div className="fu-hero-glow-orb orb-1"></div>
        <div className="fu-hero-glow-orb orb-2"></div>

        <div className="fu-fullscreen-content">
          <GeminiTextReveal />

          {/* Smart Help Options UI Embedded Directly inside Hero */}
          <div className="fu-smart-help-stage">
            <TypewriterChatQuestion inView={visHeroText} />

            <div className="fu-smart-options-grid">
              <button 
                className={`fu-smart-option-card ${selected === 'training' ? 'active' : ''}`}
                onClick={() => handleSelect('training')}
                aria-selected={selected === 'training'}
              >
                {selected === 'training' && (
                  <span className="fu-selected-active-badge">Selected ✓</span>
                )}
                <div className="fu-smart-card-icon"><BrainCircuit size={22} /></div>
                <div className="fu-smart-card-body">
                  <span className="fu-smart-card-title">Training Support</span>
                  <span className="fu-smart-card-sub">Skilling & Placement Prep</span>
                </div>
                <ChevronRight size={18} className="fu-smart-card-arrow" />
              </button>

              <button 
                className={`fu-smart-option-card ${selected === 'lms' ? 'active' : ''}`}
                onClick={() => handleSelect('lms')}
                aria-selected={selected === 'lms'}
              >
                {selected === 'lms' && (
                  <span className="fu-selected-active-badge">Selected ✓</span>
                )}
                <div className="fu-smart-card-icon"><Laptop size={22} /></div>
                <div className="fu-smart-card-body">
                  <span className="fu-smart-card-title">Campus LMS</span>
                  <span className="fu-smart-card-sub">White-Labeled Management</span>
                </div>
                <ChevronRight size={18} className="fu-smart-card-arrow" />
              </button>

              <button 
                className={`fu-smart-option-card ${selected === 'assessment' ? 'active' : ''}`}
                onClick={() => handleSelect('assessment')}
                aria-selected={selected === 'assessment'}
              >
                {selected === 'assessment' && (
                  <span className="fu-selected-active-badge">Selected ✓</span>
                )}
                <div className="fu-smart-card-icon"><CheckCircle2 size={22} /></div>
                <div className="fu-smart-card-body">
                  <span className="fu-smart-card-title">Assessment Platform</span>
                  <span className="fu-smart-card-sub">AI-Proctored Testing</span>
                </div>
                <ChevronRight size={18} className="fu-smart-card-arrow" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Top Colleges Marquee */}
      <TrustedBy />

      {/* ─── RESULT SCREEN ─── */}
      <div className={`fu-result-page fu-visible`}>

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
                
                {/* Main Hero Combination Card (Notion Studio Theme) */}
                {(() => {
                  const safeCombo = DOMAIN_MAPPINGS[activeComboIndex % DOMAIN_MAPPINGS.length] || DOMAIN_MAPPINGS[0];
                  const safeSkills = safeCombo.skills || [];

                  return (
                    <div className="fu-outcome-hero-card">
                      <div className="fu-hero-card-header">
                        <div className="fu-role-badge">
                          <Sparkles size={14} /> ROLE: {safeCombo.role}
                        </div>
                        <div className="fu-salary-chip">
                          Avg Package: <strong className="text-emerald">{safeCombo.avgSalary}</strong>
                        </div>
                      </div>

                      <h3 className="fu-hero-combo-title">{safeCombo.title}</h3>

                      {/* Mix & Match Technology Combination Flow */}
                      <div className="fu-combo-flow-stage">
                        <p className="fu-flow-label">RECRUITER TECHNOLOGY COMBO STACK:</p>
                        <div className="fu-combo-pills-flow">
                          {safeSkills.map((skill, si) => (
                            <React.Fragment key={si}>
                              {si > 0 && <span className="fu-flow-plus">+</span>}
                              <div className="fu-flow-skill-pill">
                                <span className="fu-tech-pill-logo">{getTechLogo(skill)}</span>
                                <span>{skill}</span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Mix & Match Shuffle & Solution Buttons */}
                      <div className="fu-hero-card-footer">
                        <div className="fu-action-btn-group">
                          <button 
                            type="button"
                            className="fu-shuffle-domain-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveComboIndex((prev) => (prev + 1) % DOMAIN_MAPPINGS.length);
                            }}
                          >
                            <RefreshCw size={15} className="fu-spin-icon" /> Next Combination
                          </button>
                          <button 
                            type="button"
                            className="fu-solution-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              const target = document.getElementById('training-section');
                              if (target) target.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            Want Solution?
                          </button>
                        </div>
                        <span className="fu-demand-score-tag">{safeCombo.demandScore}</span>
                      </div>
                    </div>
                  );
                })()}

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

          {/* ── 3-Image Horizontal Classroom/Workshop Grid Section ── */}
          <section className="fu-sec fu-gallery-section" style={{ padding: '4rem 0 3.5rem', background: '#0B0B0C' }}>
            <div className="fu-sec-inner">
              <div className="fu-campus-presence-header">
                <span className="fu-campus-badge">CAMPUS GALLERY</span>
                <h3 className="fu-campus-title">Glimpse of our campus presence</h3>
              </div>
              <div className="fu-outcome-photos-grid">
                <div className="fu-photo-card">
                  <img src="/company-look-1.jpg" alt="CipherSchools Classroom Workshop 1" className="fu-photo-img" />
                </div>
                <div className="fu-photo-card">
                  <img src="/company-look-2.jpg" alt="CipherSchools Classroom Workshop 2" className="fu-photo-img" />
                </div>
                <div className="fu-photo-card">
                  <img src="/company-look-3.jpg" alt="CipherSchools Classroom Workshop 3" className="fu-photo-img" />
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
              
              {/* LMS Modern Notion-Style Feature Cards Grid (Above Mockup) */}
              <div className="fu-lms-bento-cards-grid notion-style-grid" style={{ marginBottom: '2.5rem' }}>
                
                {/* Notion Card 1: Automated Stage Locking */}
                <div className="fu-notion-card">
                  <div className="notion-card-icon-wrapper">
                    <div className="notion-card-icon-box amber-icon-box">
                      <Lock size={20} />
                    </div>
                  </div>

                  <div className="notion-card-header">
                    <div className="notion-card-meta">
                      <span className="notion-eyebrow">Prerequisite Control</span>
                      <h3 className="notion-card-title">Automated Stage Locking</h3>
                    </div>
                  </div>
                  
                  <p className="notion-card-desc">
                    Ensure prerequisite compliance by unlocking advanced modules only after students pass automated checkpoint quizzes.
                  </p>
                </div>

                {/* Notion Card 2: Real-Time Campus Analytics */}
                <div className="fu-notion-card">
                  <div className="notion-card-icon-wrapper">
                    <div className="notion-card-icon-box dark-icon-box">
                      <BarChart2 size={20} />
                    </div>
                  </div>

                  <div className="notion-card-header">
                    <div className="notion-card-meta">
                      <span className="notion-eyebrow">Campus Intelligence</span>
                      <h3 className="notion-card-title">Real-Time Campus Analytics</h3>
                    </div>
                  </div>

                  <p className="notion-card-desc">
                    Granular insights into student attendance, test attempt rates, code submissions, and batch-wise performance metrics.
                  </p>
                </div>

                {/* Notion Card 3: White-Labeled Branding */}
                <div className="fu-notion-card">
                  <div className="notion-card-icon-wrapper">
                    <div className="notion-card-icon-box amber-icon-box">
                      <Laptop size={20} />
                    </div>
                  </div>

                  <div className="notion-card-header">
                    <div className="notion-card-meta">
                      <span className="notion-eyebrow">Custom Infrastructure</span>
                      <h3 className="notion-card-title">White-Labeled Branding</h3>
                    </div>
                  </div>

                  <p className="notion-card-desc">
                    Custom-branded LMS portal integrated with your university logo, colors, and custom sub-domain name.
                  </p>
                </div>

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
                  </div>
                  <div className="lms-top-right">
                    <button className="lms-experience-btn" onClick={() => setIsMeetingModalOpen(true)}>
                      <Sparkles size={14} /> Experience Yourself <ArrowRight size={14} />
                    </button>
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

            </div>
          </section>

          {/* ── 7. Assessment Platform (Spacious HackerRank/Engage Inspired Layout) ── */}
          <section id="assessment-section" ref={refAssessment} className={`fu-sec fu-assessment-light-section fu-reveal ${visAssessment ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              <div className="fu-assessment-spacious-grid">
                
                {/* Left Column: Airy Typography & Bullet Points */}
                <div className="fu-assessment-left-info">
                  <div className="notion-section-tag">
                    <Sparkles size={14} className="tag-sparkle" /> ASSESSMENT PLATFORM
                  </div>
                  
                  <h2 className="fu-assessment-main-h2">
                    Measure what matters, <span className="fu-pitch-accent">automatically.</span>
                  </h2>
                  
                  <p className="fu-assessment-main-desc">
                    AI-powered evaluations, multi-language coding sandboxes, proctored aptitude tests, and real-time candidate analytics.
                  </p>

                  <ul className="fu-assessment-feature-bullets">
                    <li>
                      <span className="bullet-dot"></span>
                      <div>
                        <strong>Coding Test:</strong> Full compiler supporting C, C++, Java, and Python with System Design sandbox.
                      </div>
                    </li>
                    <li>
                      <span className="bullet-dot"></span>
                      <div>
                        <strong>AI Technical & HR Mock Interviews:</strong> Simulated voice evaluations with real-time confidence metrics.
                      </div>
                    </li>
                    <li>
                      <span className="bullet-dot"></span>
                      <div>
                        <strong>Proctored Aptitude & Reasoning Tests:</strong> Timed evaluations with automated scoring & question curation.
                      </div>
                    </li>
                    <li>
                      <span className="bullet-dot"></span>
                      <div>
                        <strong>Real-Time Performance Trajectories:</strong> Deep student growth analytics and batch accuracy insights.
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Right Column: Spacious Interactive Window Showcase */}
                <div className="fu-assessment-right-showcase">
                  <div 
                    className="fu-assessment-mockup-wrapper notion-window-wrapper"
                    onClick={() => setIsAutoRotateAssessment(false)}
                  >
                    
                    {/* Interactive Tab Switcher Bar inside Window Header */}
                    <div className="notion-stage-topbar spacious-topbar">
                      <div className="notion-topbar-dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                      </div>
                      
                      <div className="notion-stage-tabs">
                        {[
                          { id: 'coding', label: 'Coding Test' },
                          { id: 'aptitude', label: 'Aptitude Test' },
                          { id: 'comm_skill', label: 'AI Mock' },
                          { id: 'analytics', label: 'Analytics' },
                        ].map(t => (
                          <button
                            key={t.id}
                            className={`notion-tab-btn ${activeAssessmentTab === t.id ? 'active-tab' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssessmentTabClick(t.id);
                            }}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="fu-assessment-mockup tab-fade-enter" key={activeAssessmentTab}>
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
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="fm-comment"># Auto-evaluating 14 testcases</span><br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="fm-kwd">return</span> self.nodes[0]
                          </div>
                        </div>
                      </div>
                    )}
                    {activeAssessmentTab === 'aptitude' && (
                      <div className="fu-mock-as-exam">
                        <div className="fme-header">
                          <span className="fme-time">12:30</span>
                          <span className="fme-qnum">Logical Reasoning & Quant</span>
                        </div>
                        <div className="fme-body">
                          <div className="fme-q">If all A are B, and some B are C, which statement is true?</div>
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
                        </div>

                        {/* Video Call Stage Grid */}
                        <div className="fu-ai-call-stage">
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
                            </div>
                          </div>

                          <div className="fu-ai-dialogue-panel">
                            <div className="fu-ai-speech-bubble">
                              <span className="fu-speech-author">AI Question:</span>
                              <p className="fu-speech-text">
                                "How do you handle data consistency vs availability in distributed DBs?"
                              </p>
                            </div>

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
                              <span className="fma-sub">Jan to May Growth Curve</span>
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
                          </div>

                          <div className="fma-svg-container">
                            <svg viewBox="0 0 500 160" className="fma-svg-chart">
                              <defs>
                                <linearGradient id="fmaGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#f7931e" stopOpacity="0.35"/>
                                  <stop offset="100%" stopColor="#f7931e" stopOpacity="0.0"/>
                                </linearGradient>
                              </defs>
                              <line x1="40" y1="30" x2="470" y2="30" stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                              <line x1="40" y1="70" x2="470" y2="70" stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                              <line x1="40" y1="110" x2="470" y2="110" stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                              <path d="M 40 125 Q 150 115 250 85 T 470 25 L 470 140 L 40 140 Z" fill="url(#fmaGradient)" />
                              <path d="M 40 125 Q 150 115 250 85 T 470 25" fill="none" stroke="#f7931e" strokeWidth="3.5" strokeLinecap="round" />
                              <circle cx="40" cy="125" r="5" fill="#f7931e" stroke="#fff" strokeWidth="2" />
                              <text x="40" y="115" fill="#aaa" fontSize="11" textAnchor="middle">32%</text>
                              <text x="40" y="155" fill="#888" fontSize="11" textAnchor="middle">Jan</text>
                              <circle cx="255" cy="85" r="5" fill="#f7931e" stroke="#fff" strokeWidth="2" />
                              <text x="255" y="72" fill="#ffa103" fontSize="11" fontWeight="bold" textAnchor="middle">68%</text>
                              <text x="255" y="155" fill="#888" fontSize="11" textAnchor="middle">March</text>
                              <circle cx="470" cy="25" r="6.5" fill="#00c853" stroke="#fff" strokeWidth="2" />
                              <text x="470" y="14" fill="#00c853" fontSize="11" fontWeight="900" textAnchor="middle">96% 🔥</text>
                              <text x="470" y="155" fill="#00c853" fontSize="11" fontWeight="bold" textAnchor="middle">May</text>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>





          {/* ── 7. CTA ── */}
          <section ref={refCta} className={`fu-sec fu-sec-cta-final fu-reveal ${visCta ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner fu-cta-final-inner">
              <Coffee size={48} className="fu-cta-coffee-icon" />
              <h2 className="fu-cta-final-title">
                Let's connect over a <span className="fu-pitch-accent">coffee.</span>
              </h2>
              <p className="fu-cta-final-sub">
                Explore how CipherSchools can transform your institution's placement numbers and technical training.
              </p>
              <button className="fu-pitch-cta-btn" style={{ marginTop: '2rem' }} onClick={() => setIsMeetingModalOpen(true)}>
                Book a Meeting <ArrowRight size={20} />
              </button>
            </div>
          </section>

        </div>

      {/* ── STICKY CTA ── */}
      <div className={`fu-sticky-cta ${showStickyCta ? 'fu-sticky-visible' : ''}`}>
        <div className="fu-sticky-cta-inner">
          <p>Let's connect over a <strong>quick</strong> meeting</p>
          <button className="fu-sticky-btn" onClick={() => setIsMeetingModalOpen(true)}>Book Meeting <ArrowRight size={16} /></button>
        </div>
      </div>

      {/* Pop-up Meeting Modal */}
      <BookMeetingModal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} />
    </div>
  );
};

export default ForUniversities;
