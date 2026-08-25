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

/* ─── Gemini AI Fluid Text Reveal Component (Hero Style with Campus Scribbles) ─── */
const GeminiTextReveal = () => {
  return (
    <div className="fu-hero-header-wrap">
      {/* Floating Campus Scribble 1: Graduation Cap Doodle (Left) */}
      <div className="fu-scribble-doodle fu-scribble-mortarboard" aria-hidden="true">
        <svg width="68" height="56" viewBox="0 0 74 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cap Diamond */}
          <path d="M37 6 L68 18 L37 30 L6 18 Z" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="#FFFFFF" />
          {/* Cap Skull Base */}
          <path d="M19 23 V34 C19 39 27 43 37 43 C47 43 55 39 55 34 V23" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Tassel Button & String */}
          <circle cx="37" cy="18" r="2.5" fill="#F3912E" />
          <path d="M37 18 Q 48 24 53 32" stroke="#F3912E" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M53 32 L51 44 M53 32 L54 44 M53 32 L57 43" stroke="#F3912E" strokeWidth="2" strokeLinecap="round" />
          {/* Sparkle lines */}
          <path d="M10 8 L6 4 M14 5 L14 1 M5 12 L1 12" stroke="#F3912E" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* Floating Campus Scribble 2: University Pillar Building Doodle (Right) */}
      <div className="fu-scribble-doodle fu-scribble-campus" aria-hidden="true">
        <svg width="72" height="60" viewBox="0 0 78 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pediment / Roof Triangle */}
          <path d="M8 22 L39 6 L70 22 Z" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="#FFFFFF" />
          {/* Architrave Beam */}
          <path d="M11 26 H67" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
          {/* Pillars */}
          <path d="M18 27 V52 M24 27 V52" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M36 27 V52 M42 27 V52" stroke="#F3912E" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M54 27 V52 M60 27 V52" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
          {/* Base Steps */}
          <path d="M10 54 H68" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M5 60 H73" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
          {/* Star / Sparkle */}
          <path d="M68 6 L70 12 L76 14 L70 16 L68 22 L66 16 L60 14 L66 12 Z" fill="#F3912E" opacity="0.8" />
        </svg>
      </div>

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
          <span className="fu-scribble-word-wrapper">
            <span className="gemini-word gemini-accent" style={{ animationDelay: '0.52s' }}>Placement Support</span>
            <svg className="fu-scribble-underline" viewBox="0 0 320 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M4 12 Q 90 18 170 11 Q 250 5 314 13 Q 230 17 150 16 Q 70 15 10 16" 
                stroke="#F3912E" 
                strokeWidth="3.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </span>
        </span>
      </h1>
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
      let targetId = 'training-section';
      if (id === 'training') targetId = 'training-section';
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

          {/* ── Apple-Style Master Unified Bento Grid ── */}
          <section id="training-section" ref={refPair} className={`fu-sec fu-apple-bento-section fu-reveal ${visPair ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              {/* Section Header */}
              <div className="fu-apple-bento-header">
                <p className="fu-sec-eyebrow">TRAINING SUPPORT ECOSYSTEM</p>
                <h2 className="fu-apple-bento-title">
                  Everything Campuses Need. <span className="fu-pitch-accent">Built into One System.</span>
                </h2>
                <p className="fu-apple-bento-sub">
                  From multi-skill recruiter mandates to semester-aligned program delivery and agile beyond-syllabus tracks.
                </p>
              </div>

              {/* Apple-Style Asymmetrical Bento Grid */}
              <div className="fu-apple-bento-grid">
                
                {/* ── Tile 1: Market Alignment / Skill Combinations (Col Span 7) ── */}
                <div className="fu-apple-bento-tile tile-market-combo">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">MARKET COMBINATIONS</span>
                      <span className="fu-demand-score-pill">
                        {DOMAIN_MAPPINGS[activeComboIndex % DOMAIN_MAPPINGS.length]?.demandScore || '96% Recruiter Alignment'}
                      </span>
                    </div>
                    <h3 className="fu-tile-title">
                      We Deliver the Right Combination.
                    </h3>
                    <p className="fu-tile-desc">
                      Over generic courses — aligning students directly with recruiter multi-skill mandates.
                    </p>
                  </div>

                  {/* Interactive Combination Flow */}
                  {(() => {
                    const safeCombo = DOMAIN_MAPPINGS[activeComboIndex % DOMAIN_MAPPINGS.length] || DOMAIN_MAPPINGS[0];
                    const safeSkills = safeCombo.skills || [];

                    return (
                      <div className="fu-apple-combo-stage">
                        <div className="fu-apple-combo-topbar">
                          <div className="fu-role-tag">
                            <Sparkles size={13} /> ROLE: {safeCombo.role}
                          </div>
                          <div className="fu-salary-tag">
                            Avg Package: <strong className="text-emerald">{safeCombo.avgSalary}</strong>
                          </div>
                        </div>

                        <h4 className="fu-apple-combo-name">{safeCombo.title}</h4>

                        <div className="fu-apple-tech-stack-row">
                          <span className="fu-stack-label">RECRUITER TECH STACK:</span>
                          <div 
                            className="fu-stack-pills"
                            onClick={() => setActiveComboIndex((prev) => (prev + 1) % DOMAIN_MAPPINGS.length)}
                            style={{ cursor: 'pointer' }}
                            title="Click to view next combination"
                          >
                            {safeSkills.map((skill, si) => (
                              <React.Fragment key={si}>
                                {si > 0 && <span className="fu-stack-plus">+</span>}
                                <div className="fu-apple-skill-pill">
                                  <span className="fu-tech-pill-logo">{getTechLogo(skill)}</span>
                                  <span>{skill}</span>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        <div className="fu-apple-combo-footer">
                          <button 
                            type="button"
                            className="fu-apple-shuffle-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveComboIndex((prev) => (prev + 1) % DOMAIN_MAPPINGS.length);
                            }}
                          >
                            <RefreshCw size={14} className="fu-spin-icon" /> Next Combo
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* ── Tile 2: Structured Programs (Col Span 5) ── */}
                <div className="fu-apple-bento-tile tile-structured-programs">
                  <div className="fu-tile-header">
                    <span className="fu-apple-pill">STRUCTURED PROGRAMS</span>
                    <h3 className="fu-tile-title">
                      Programs that build real engineers.
                    </h3>
                    <p className="fu-tile-desc">
                      Flexible semester tracks tailored to your academic calendar.
                    </p>
                  </div>

                  <div className="fu-apple-programs-list">
                    {/* Program 1 */}
                    <div className="fu-apple-program-row">
                      <div className="fu-program-icon-box"><BookOpen size={16} /></div>
                      <div className="fu-program-info">
                        <span className="fu-program-name">Academic Training</span>
                        <span className="fu-program-meta">First Year to Final Year</span>
                      </div>
                      <span className="fu-program-tag">FOUNDATION</span>
                    </div>

                    {/* Program 2 */}
                    <div className="fu-apple-program-row featured-row">
                      <div className="fu-program-icon-box"><Target size={16} /></div>
                      <div className="fu-program-info">
                        <span className="fu-program-name">Placement Training</span>
                        <span className="fu-program-meta">Pre-Final to Final Year</span>
                      </div>
                      <span className="fu-program-tag tag-featured">MOST POPULAR</span>
                    </div>

                    {/* Program 3 */}
                    <div className="fu-apple-program-row">
                      <div className="fu-program-icon-box"><Zap size={16} /></div>
                      <div className="fu-program-info">
                        <span className="fu-program-name">Seasonal Programs</span>
                        <span className="fu-program-meta">Summer & Winter Training</span>
                      </div>
                      <span className="fu-program-tag">SPRINTS</span>
                    </div>
                  </div>
                </div>

                {/* ── Tile 3: Calendar Adaptation Stat Spotlight (Col Span 4) ── */}
                <div className="fu-apple-bento-tile tile-calendar-stat">
                  <span className="fu-apple-pill">SEMESTER ADAPTIVE</span>
                  <div className="fu-stat-huge-number">100%</div>
                  <h4 className="fu-stat-tile-title">Calendar Synchronized</h4>
                  <p className="fu-stat-tile-desc">
                    Custom 3, 6, or 9-month modules designed around your university examination dates.
                  </p>
                  <div className="fu-stat-footer-pill">
                    <Clock size={14} /> Agile Scheduling
                  </div>
                </div>

                {/* ── Tile 4: Beyond Static Syllabi (Col Span 8) ── */}
                <div className="fu-apple-bento-tile tile-beyond-syllabi">
                  <div className="fu-tile-header">
                    <span className="fu-apple-pill">AGILE EXPANSION</span>
                    <h3 className="fu-tile-title">
                      Beyond static syllabi.
                    </h3>
                    <p className="fu-tile-desc">
                      Beyond syllabus, we encourage students with multiple activities.
                    </p>
                  </div>

                  <div className="fu-apple-beyond-grid">
                    {/* Item 1 */}
                    <div className="fu-apple-beyond-card">
                      <div className="fu-beyond-icon-row">
                        <div className="fu-beyond-icon"><Flame size={18} /></div>
                        <span className="fu-beyond-chip">Sprint Cohorts</span>
                      </div>
                      <h4 className="fu-beyond-card-title">Immersive Bootcamps</h4>
                      <p className="fu-beyond-card-desc">Production-grade enterprise project sprints.</p>
                    </div>

                    {/* Item 2 */}
                    <div className="fu-apple-beyond-card">
                      <div className="fu-beyond-icon-row">
                        <div className="fu-beyond-icon"><Presentation size={18} /></div>
                        <span className="fu-beyond-chip">Live Sessions</span>
                      </div>
                      <h4 className="fu-beyond-card-title">Live Masterclasses</h4>
                      <p className="fu-beyond-card-desc">Modern cloud tools, frameworks, and AI workflows.</p>
                    </div>

                    {/* Item 3 */}
                    <div className="fu-apple-beyond-card">
                      <div className="fu-beyond-icon-row">
                        <div className="fu-beyond-icon"><Globe size={18} /></div>
                        <span className="fu-beyond-chip chip-accent">● Live AMAs</span>
                      </div>
                      <h4 className="fu-beyond-card-title">Industry Leader Sessions</h4>
                      <p className="fu-beyond-card-desc">Tech talks with senior engineering leaders.</p>
                    </div>

                    {/* Item 4 */}
                    <div className="fu-apple-beyond-card">
                      <div className="fu-beyond-icon-row">
                        <div className="fu-beyond-icon"><Compass size={18} /></div>
                        <span className="fu-beyond-chip">Interview Ready</span>
                      </div>
                      <h4 className="fu-beyond-card-title">Mentorship & Prep</h4>
                      <p className="fu-beyond-card-desc">1:1 code reviews, resume audits & mock interviews.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Section CTA */}
              <div className="fu-section-action-footer">
                <button 
                  className="fu-section-cta-btn"
                  onClick={() => setIsMeetingModalOpen(true)}
                  type="button"
                >
                  Book a Meeting <ArrowRight size={18} />
                </button>
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

              {/* Section CTA */}
              <div className="fu-section-action-footer" style={{ marginTop: '2.5rem' }}>
                <button 
                  className="fu-section-cta-btn"
                  onClick={() => setIsMeetingModalOpen(true)}
                  type="button"
                >
                  Book a Meeting <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>





          {/* ── 5.5 LMS Bento Section ── */}
          <section id="lms-section" ref={refLms} className={`fu-sec fu-lms-apple-bento-section fu-reveal ${visLms ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              {/* Section Header */}
              <div className="fu-apple-bento-header">
                <p className="fu-sec-eyebrow">CAMPUS LMS PLATFORM</p>
                <h2 className="fu-apple-bento-title">
                  A platform built for effortless <span className="fu-pitch-accent">learning management.</span>
                </h2>
                <p className="fu-apple-bento-sub">
                  White-labeled campus ecosystem providing seamless course delivery, real-time analytics, automated stage locking, and student progress tracking.
                </p>
              </div>

              {/* Apple-Style Asymmetrical Bento Grid */}
              <div className="fu-apple-bento-grid">
                
                {/* ── Tile 1: White-Labeled Campus Portal (Col Span 7) ── */}
                <div className="fu-apple-bento-tile tile-lms-portal">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">CUSTOM INFRASTRUCTURE</span>
                      <span className="fu-demand-score-pill">Custom Sub-Domain & SSO</span>
                    </div>
                    <h3 className="fu-tile-title">
                      White-Labeled Branding.
                    </h3>
                    <p className="fu-tile-desc">
                      Custom-branded portal integrated with your university logo, primary palette, and domain.
                    </p>
                  </div>

                  <div className="fu-lms-portal-preview-card">
                    {/* Browser Address Bar */}
                    <div className="fu-lms-browser-bar">
                      <div className="fu-lms-browser-dots">
                        <span></span><span></span><span></span>
                      </div>
                      <div className="fu-lms-url-pill">
                        <Lock size={11} />
                        <span>youruniversity.cipherschools.com</span>
                      </div>
                    </div>

                    {/* Mini Course Header & Active Session */}
                    <div className="fu-lms-active-course-row">
                      <div className="fu-lms-course-icon-badge">
                        <Laptop size={18} />
                      </div>
                      <div className="fu-lms-course-details">
                        <span className="fu-lms-course-tag">LIVE SEMESTER TRACK</span>
                        <h4 className="fu-lms-course-name">Full Stack & Java OOPs Specialization</h4>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="fu-lms-progress-box">
                      <div className="fu-lms-progress-meta">
                        <span className="fu-lms-progress-label">Batch Completion Track</span>
                        <span className="fu-lms-progress-val">86% Completed</span>
                      </div>
                      <div className="fu-lms-progress-track">
                        <div className="fu-lms-progress-bar" style={{ width: '86%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Tile 2: Prerequisite Stage Locking (Col Span 5) ── */}
                <div className="fu-apple-bento-tile tile-lms-stage-lock">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">PREREQUISITE CONTROL</span>
                      <span className="fu-stage-lock-badge">Automated Gate</span>
                    </div>
                    <h3 className="fu-tile-title">
                      Automated Stage Locking.
                    </h3>
                    <p className="fu-tile-desc">
                      Unlocks advanced modules only after students pass checkpoint evaluations.
                    </p>
                  </div>

                  <div className="fu-stage-lock-stack">
                    {/* Stage 1: Done */}
                    <div className="fu-stage-item stage-completed">
                      <div className="fu-stage-check-icon"><Check size={14} /></div>
                      <div className="fu-stage-info">
                        <span className="fu-stage-title">Module 1: Core Fundamentals</span>
                        <span className="fu-stage-sub">12 Quizzes Passed</span>
                      </div>
                      <span className="fu-stage-status-chip chip-done">PASSED</span>
                    </div>

                    {/* Stage 2: In Progress */}
                    <div className="fu-stage-item stage-active">
                      <div className="fu-stage-active-icon"><Sparkles size={14} /></div>
                      <div className="fu-stage-info">
                        <span className="fu-stage-title">Module 2: DSA & Algorithms</span>
                        <span className="fu-stage-sub">Checkpoint Test Active</span>
                      </div>
                      <span className="fu-stage-status-chip chip-active">CURRENT</span>
                    </div>

                    {/* Stage 3: Locked */}
                    <div className="fu-stage-item stage-locked">
                      <div className="fu-stage-lock-icon"><Lock size={14} /></div>
                      <div className="fu-stage-info">
                        <span className="fu-stage-title">Module 3: Enterprise Architecture</span>
                        <span className="fu-stage-sub">Unlocks after Module 2</span>
                      </div>
                      <span className="fu-stage-status-chip chip-locked">LOCKED</span>
                    </div>
                  </div>
                </div>

                {/* ── Tile 3: Assignment & Engagement Stat (Col Span 4) ── */}
                <div className="fu-apple-bento-tile tile-lms-engagement">
                  <span className="fu-apple-pill">CAMPUS ENGAGEMENT</span>
                  <div className="fu-stat-huge-number">99.4%</div>
                  <h4 className="fu-stat-tile-title">Assignment Completion</h4>
                  <p className="fu-stat-tile-desc">
                    Instant automated grading & code checks reduce evaluation time from days to seconds.
                  </p>
                  <div className="fu-stat-footer-pill">
                    <Clock size={14} /> 24/7 Automated Evaluation
                  </div>
                </div>

                {/* ── Tile 4: Granular Cohort Analytics & Live Stream (Col Span 8) ── */}
                <div className="fu-apple-bento-tile tile-lms-analytics">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">CAMPUS INTELLIGENCE</span>
                      <span className="fu-demand-score-pill">Real-Time Data Streams</span>
                    </div>
                    <h3 className="fu-tile-title">
                      Real-Time Campus Analytics.
                    </h3>
                    <p className="fu-tile-desc">
                      Granular faculty insights into attendance, code submissions, and batch-wise rankings.
                    </p>
                  </div>

                  <div className="fu-lms-analytics-grid">
                    {/* Metric 1 */}
                    <div className="fu-lms-metric-card">
                      <div className="fu-lms-metric-top">
                        <span className="fu-lms-metric-lbl">Total Tests Attempted</span>
                        <BarChart2 size={16} className="text-gray-400" />
                      </div>
                      <div className="fu-lms-metric-val">8/8 Passed</div>
                      <span className="fu-lms-metric-sub">94% Batch Average Score</span>
                    </div>

                    {/* Metric 2 */}
                    <div className="fu-lms-metric-card">
                      <div className="fu-lms-metric-top">
                        <span className="fu-lms-metric-lbl">Code Quality Index</span>
                        <Code2 size={16} className="text-gray-400" />
                      </div>
                      <div className="fu-lms-metric-val">92.8%</div>
                      <span className="fu-lms-metric-sub">Optimal Big-O Complexity</span>
                    </div>

                    {/* Metric 3 */}
                    <div className="fu-lms-metric-card">
                      <div className="fu-lms-metric-top">
                        <span className="fu-lms-metric-lbl">Placement Readiness</span>
                        <TrendingUp size={16} className="text-gray-400" />
                      </div>
                      <div className="fu-lms-metric-val">Top 5% Tier</div>
                      <span className="fu-lms-metric-sub">Recruiter Benchmark Met</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ── Exact Replica LMS Live Dashboard Showcase ── */}
              <div className="lms-replica-wrapper" style={{ marginTop: '2.5rem' }}>
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
                      <Presentation size={18} />
                      <span>Lectures</span>
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
                      <span className="lms-updates-badge">16</span>
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
                      <h3>Python Programming Self Paced 2026</h3>
                      <p className="lms-course-greeting">Hey there,</p>
                      <p className="lms-course-desc">
                        we're excited to have you join our course, designed to help you learn concepts in a practical and flexible way. Get access to recorded content on the platform, along with live weekend sessions for better understanding...
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
                          <span className="lms-meta-label">Mentors</span>
                          <span className="lms-meta-val" style={{ fontSize: '0.82rem', lineHeight: '1.3' }}>Cipher Schools, Zubair Proddutur, Akarsh Thakur, Harsh Tyagi</span>
                        </div>
                      </div>
                    </div>

                    {/* Keep Practicing Section */}
                    <div className="lms-practice-resume-card">
                      <div className="lms-practice-header">
                        <h4>Keep Practicing From Where You Left</h4>
                        <a href="#" className="lms-viewmore-link" onClick={(e) => e.preventDefault()}>View more ›</a>
                      </div>
                      <div className="lms-practice-item-row">
                        <div className="lms-practice-item-info">
                          <span className="lms-practice-item-title">Daily Temperature Streak</span>
                          <span className="lms-practice-item-type">Practice Problem</span>
                        </div>
                        <div className="lms-practice-item-actions">
                          <span className="lms-diff-tag easy">Easy</span>
                          <button className="lms-continue-btn">Continue</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel Widgets */}
                  <div className="lms-replica-right">
                    {/* Dark Graphic Banner */}
                    <div className="lms-course-banner-card">
                      <div className="lms-banner-content">
                        <span className="lms-live-badge">Recorded + Live Lectures | Online</span>
                        <h4>Python with OOPs Programming Language</h4>
                      </div>
                      <div className="lms-java-logo">🐍</div>
                    </div>

                    {/* Widget 1: Total Videos Watched */}
                    <div className="lms-widget-card">
                      <span className="lms-widget-title">Total Videos Watched</span>
                      <div className="lms-widget-stat">0/35</div>
                      <a href="#" className="lms-widget-link" onClick={(e) => e.preventDefault()}>Watch Now →</a>
                    </div>

                    {/* Widget 2: Total Questions Solved */}
                    <div className="lms-widget-card">
                      <span className="lms-widget-title">Total Questions Solved</span>
                      <div className="lms-widget-stat">0/67</div>
                      <a href="#" className="lms-widget-link" onClick={(e) => e.preventDefault()}>Practice Now →</a>
                    </div>

                    {/* Widget 3: Total Tests Attempted */}
                    <div className="lms-widget-card">
                      <span className="lms-widget-title">Total Tests Attempted</span>
                      <div className="lms-widget-stat">0/20</div>
                      <a href="#" className="lms-widget-link" onClick={(e) => e.preventDefault()}>Take Test →</a>
                    </div>

                    {/* Widget 4: Total Projects Completed */}
                    <div className="lms-widget-card">
                      <span className="lms-widget-title">Total Projects Completed</span>
                      <div className="lms-widget-stat">0/1</div>
                      <a href="#" className="lms-widget-link" onClick={(e) => e.preventDefault()}>View Projects →</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section CTA */}
              <div className="fu-section-action-footer">
                <button 
                  className="fu-section-cta-btn"
                  onClick={() => setIsMeetingModalOpen(true)}
                  type="button"
                >
                  Book a Meeting <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </section>

          {/* ── 7. Assessment Platform (Spacious HackerRank/Engage Inspired Layout) ── */}
          {/* ── Apple-Style Master Assessment Bento Grid ── */}
          <section id="assessment-section" ref={refAssessment} className={`fu-sec fu-assessment-apple-bento-section fu-reveal ${visAssessment ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              {/* Section Header */}
              <div className="fu-apple-bento-header">
                <p className="fu-sec-eyebrow">ASSESSMENT PLATFORM</p>
                <h2 className="fu-apple-bento-title">
                  Measure what matters, <span className="fu-pitch-accent">automatically.</span>
                </h2>
                <p className="fu-apple-bento-sub">
                  AI-powered evaluations, multi-language coding sandboxes, proctored aptitude tests, and real-time candidate analytics.
                </p>
              </div>

              {/* Apple-Style Asymmetrical Bento Grid */}
              <div className="fu-apple-bento-grid">
                
                {/* ── Tile 1: Multi-Language Coding Sandbox & System Design (Col Span 7) ── */}
                <div className="fu-apple-bento-tile tile-coding-sandbox">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">CODING EVALUATION</span>
                      <span className="fu-demand-score-pill">14 Testcases Auto-Scored</span>
                    </div>
                    <h3 className="fu-tile-title">
                      Multi-Language Compiler & Sandbox.
                    </h3>
                    <p className="fu-tile-desc">
                      Full production compiler supporting C, C++, Java, and Python with live System Design testing.
                    </p>
                  </div>

                  <div className="fu-mock-as-coding-rich">
                    <div className="fme-coding-header">
                      <div className="fme-lang-pills">
                        <span className="fme-lang-chip active">System Design</span>
                        <span className="fme-lang-chip">DSA</span>
                        <span className="fme-lang-chip">SQL</span>
                      </div>
                    </div>

                    <div className="fme-coding-body">
                      <div className="fme-editor-top">
                        <div className="fme-editor-lang-tabs">
                          <span className="fme-editor-tab">C</span>
                          <span className="fme-editor-tab">C++</span>
                          <span className="fme-editor-tab">JAVA</span>
                          <span className="fme-editor-tab active-tab">Python</span>
                        </div>
                      </div>
                      <div className="fm-editor-code">
                        <span className="fm-comment"># Live Automated Scoring & Execution</span><br/>
                        <span className="fm-kwd">class</span> <span className="fm-func">LoadBalancer</span>:<br/>
                        &nbsp;&nbsp;<span className="fm-kwd">def</span> <span className="fm-func">__init__</span>(self, nodes):<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;self.nodes = nodes<br/>
                        &nbsp;&nbsp;<span className="fm-kwd">def</span> <span className="fm-func">route</span>(self, req):<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="fm-comment"># Evaluating edge-cases & memory bounds</span><br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="fm-kwd">return</span> self.nodes[0]
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Tile 2: AI Technical & HR Mock Interviews (Col Span 5) ── */}
                <div className="fu-apple-bento-tile tile-ai-mock">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">AI VOICE INTERVIEWS</span>
                      <span className="fu-confidence-badge">94% Confidence</span>
                    </div>
                    <h3 className="fu-tile-title">
                      AI Mock Interviews.
                    </h3>
                    <p className="fu-tile-desc">
                      Simulated technical & HR voice evaluations with real-time speech and confidence scoring.
                    </p>
                  </div>

                  <div className="fu-apple-interview-card">
                    <div className="fu-ai-call-info">
                      <div className="fu-ai-avatar-badge">
                        <Bot size={18} />
                      </div>
                      <div>
                        <h4 className="fu-ai-call-name">AI Technical Interviewer</h4>
                        <span className="fu-ai-call-sub">System Architecture & Coding Session</span>
                      </div>
                    </div>

                    <div className="fu-ai-speech-bubble" style={{ margin: '0.75rem 0' }}>
                      <span className="fu-speech-author">AI Question:</span>
                      <p className="fu-speech-text" style={{ fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                        "How do you handle data consistency vs availability in distributed DBs?"
                      </p>
                    </div>

                    <div className="fu-candidate-res-card">
                      <div className="fu-res-header">
                        <span className="fu-res-label">Candidate Voice Analysis</span>
                        <span className="fu-res-score">Confidence 94%</span>
                      </div>
                      <div className="fu-res-wave-row">
                        <div className="fu-mic-icon-box">
                          <Volume2 size={15} />
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

                {/* ── Tile 3: Proctored Aptitude & Reasoning Tests (Col Span 4) ── */}
                <div className="fu-apple-bento-tile tile-aptitude-test">
                  <div className="fu-tile-header">
                    <span className="fu-apple-pill">PROCTORED EXAMS</span>
                    <h3 className="fu-tile-title" style={{ fontSize: '1.15rem' }}>
                      Aptitude & Reasoning.
                    </h3>
                    <p className="fu-tile-desc">
                      Timed evaluations with anti-cheat proctoring & automated scoring.
                    </p>
                  </div>

                  <div className="fu-mock-as-exam" style={{ marginTop: 'auto' }}>
                    <div className="fme-header">
                      <span className="fme-time">12:30 left</span>
                      <span className="fme-qnum">Logical Reasoning</span>
                    </div>
                    <div className="fme-body">
                      <div className="fme-q" style={{ fontSize: '0.78rem' }}>If all A are B, and some B are C, which statement is true?</div>
                      <div className="fme-options" style={{ gap: '4px', marginTop: '6px' }}>
                        <div className="fme-opt" style={{ padding: '4px 8px', fontSize: '0.74rem' }}><div className="fme-radio"></div>All A are C</div>
                        <div className="fme-opt active" style={{ padding: '4px 8px', fontSize: '0.74rem' }}><div className="fme-radio checked"></div>None of the above</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Tile 4: Real-Time Performance Analytics & Trajectory (Col Span 8) ── */}
                <div className="fu-apple-bento-tile tile-analytics-trajectory">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">GROWTH ANALYTICS</span>
                      <span className="fma-badge">+184% Growth 🚀</span>
                    </div>
                    <h3 className="fu-tile-title">
                      Performance Trajectories.
                    </h3>
                    <p className="fu-tile-desc">
                      Deep student cohort analytics, batch readiness tracking, and domain percentile rankings.
                    </p>
                  </div>

                  <div className="fu-apple-analytics-box">
                    <div className="fma-chart-header" style={{ marginBottom: '0.5rem' }}>
                      <div className="fma-chart-metric">
                        <span className="fma-metric-num" style={{ fontSize: '1.75rem' }}>96%</span>
                        <span className="fma-metric-lbl">Cohort Readiness Benchmark</span>
                      </div>
                      <span className="fu-growth-tag">Top 5% Tier Recruiter Level</span>
                    </div>

                    <div className="fma-svg-container">
                      <svg viewBox="0 0 500 140" className="fma-svg-chart">
                        <defs>
                          <linearGradient id="fmaGradientApple" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f7931e" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#f7931e" stopOpacity="0.0"/>
                          </linearGradient>
                        </defs>
                        <line x1="40" y1="25" x2="470" y2="25" stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                        <line x1="40" y1="65" x2="470" y2="65" stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                        <line x1="40" y1="105" x2="470" y2="105" stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                        <path d="M 40 115 Q 150 105 250 75 T 470 20 L 470 130 L 40 130 Z" fill="url(#fmaGradientApple)" />
                        <path d="M 40 115 Q 150 105 250 75 T 470 20" fill="none" stroke="#f7931e" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="40" cy="115" r="4.5" fill="#f7931e" stroke="#fff" strokeWidth="2" />
                        <text x="40" y="105" fill="#aaa" fontSize="10" textAnchor="middle">32%</text>
                        <text x="40" y="135" fill="#888" fontSize="10" textAnchor="middle">Jan</text>
                        <circle cx="255" cy="75" r="4.5" fill="#f7931e" stroke="#fff" strokeWidth="2" />
                        <text x="255" y="62" fill="#ffa103" fontSize="10" fontWeight="bold" textAnchor="middle">68%</text>
                        <text x="255" y="135" fill="#888" fontSize="10" textAnchor="middle">March</text>
                        <circle cx="470" cy="20" r="5.5" fill="#00c853" stroke="#fff" strokeWidth="2" />
                        <text x="470" y="11" fill="#00c853" fontSize="10" fontWeight="900" textAnchor="middle">96% 🔥</text>
                        <text x="470" y="135" fill="#00c853" fontSize="10" fontWeight="bold" textAnchor="middle">May</text>
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* Section CTA */}
              <div className="fu-section-action-footer">
                <button 
                  className="fu-section-cta-btn"
                  onClick={() => setIsMeetingModalOpen(true)}
                  type="button"
                >
                  Book a Meeting <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </section>





          {/* ── 7. Professional Executive CTA ── */}
          <section ref={refCta} className={`fu-sec fu-sec-cta-final fu-reveal ${visCta ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner fu-cta-final-inner">
              <div className="fu-cta-icon-badge">
                <GraduationCap size={28} />
              </div>
              <h2 className="fu-cta-final-title">
                Tailored Integration for Your Campus Ecosystem.
              </h2>
              <p className="fu-cta-final-sub">
                Explore credit-aligned curriculum modules, white-labeled LMS infrastructure, and turnkey placement sprints designed to integrate seamlessly into your university.
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
          <p>Partner with <strong>CipherSchools</strong> for your campus</p>
          <button className="fu-sticky-btn" onClick={() => setIsMeetingModalOpen(true)}>Book a Meeting <ArrowRight size={16} /></button>
        </div>
      </div>

      {/* Pop-up Meeting Modal */}
      <BookMeetingModal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} />
    </div>
  );
};

export default ForUniversities;
