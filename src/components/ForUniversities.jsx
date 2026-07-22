import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Sparkles, Bot, Code2, Users, Zap, Coffee, Network, Laptop, Plus, Briefcase, TrendingUp, Target, Wrench, MessageSquare, Rocket, Presentation, Flame, Compass, Globe, RefreshCw, X, CheckCircle2, Play, Lock, User, AlertTriangle, FileText } from 'lucide-react';
import './ForUniversities.css';

/* ─── Typing animation component ─── */
const TypingText = ({ text, delay = 0 }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [started, text]);

  return <span>{displayed}<span className="fu-cursor">|</span></span>;
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


/* ─── Tech Pairing Combos ─── */
const techCombos = [
  { tags: ['MERN Stack', 'DevOps', 'Cloud Deployment'], color: '#6c63ff' },
  { tags: ['DSA', 'Backend', 'GenAI for Dev'], color: '#ff6b6b' },
  { tags: ['Python', 'Full Stack', 'Cloud Computing'], color: '#36d399' },
  { tags: ['ML / Generative AI', 'DSA'], color: '#ffa103' },
  { tags: ['Core Java', 'SQL', 'DSA'], color: '#4facfe' },
];


const ForUniversities = () => {
  const [step, setStep] = useState('question'); // 'question' | 'result'
  const [selected, setSelected] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [ripple, setRipple] = useState(null);
  const [activeComboIndex, setActiveComboIndex] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);

  /* scroll-reveal refs */
  const [refShift, visShift] = useReveal();
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
  const [activeAssessmentTab, setActiveAssessmentTab] = useState('online_exam');

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

  const handleSelect = (id) => {
    setRipple(id);
    setTimeout(() => setRipple(null), 500);
    setSelected(id);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setIsVisible(false);
    setTimeout(() => {
      setStep('result');
      setTimeout(() => {
        setIsVisible(true);
        let targetId = 'shift-section';
        if (selected === 'lms') targetId = 'lms-section';
        if (selected === 'assessment') targetId = 'assessment-section';
        
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 150);
    }, 400);
  };

  const handleBack = () => {
    setIsVisible(false);
    setTimeout(() => {
      setStep('question');
      setSelected(null);
      window.scrollTo(0, 0);
      setTimeout(() => setIsVisible(true), 50);
    }, 400);
  };

  const options = [
    { 
      id: 'training', 
      label: <>Training <span className="fu-pitch-accent">Support</span></>, 
      icon: <Users size={28} />,
      desc: "Expert-led curriculum designed for campus placement success.",
      stats: [
        { value: '50+', label: 'Courses' },
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
    <div className="fu-pitch-page">

      {/* ─── QUESTION SCREEN ─── */}
      {step === 'question' && (
        <div className={`fu-pitch-container ${isVisible ? 'fu-visible' : ''}`}>
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

          <div className={`fu-pitch-cta-row ${selected ? 'fu-cta-visible' : ''}`}>
            <button className="fu-pitch-cta-btn" onClick={handleSubmit}>
              Continue <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}


      {/* ─── RESULT SCREEN ─── */}
      {step === 'result' && (
        <div className={`fu-result-page ${isVisible ? 'fu-visible' : ''}`}>

          <div className="fu-result-back">
            <button onClick={handleBack} className="fu-back-link">&larr; Change Selection</button>
          </div>


          {/* ── 1. The Shift ── */}
          <section id="shift-section" ref={refShift} className={`fu-sec fu-sec-industry fu-reveal ${visShift ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              <p className="fu-sec-eyebrow">The Shift</p>
              <h2 className="fu-sec-heading">
                Industry is <span className="fu-pitch-accent">not looking</span> for what we saw 2–3 years back.
              </h2>
              <div className="fu-old-bento">
                <div className="fu-old-card">
                  <div className="fu-card-status"><X size={14} /></div>
                  <div className="fu-old-icon-container"><Network size={28} /></div>
                  <h4>DSA</h4>
                  <p>Not enough anymore.</p>
                </div>
                <div className="fu-old-card">
                  <div className="fu-card-status"><X size={14} /></div>
                  <div className="fu-old-icon-container"><Coffee size={28} /></div>
                  <h4>Java</h4>
                  <p>Too narrow a skill.</p>
                </div>
                <div className="fu-old-card">
                  <div className="fu-card-status"><X size={14} /></div>
                  <div className="fu-old-icon-container"><Laptop size={28} /></div>
                  <h4>Development</h4>
                  <p>Missing the bigger picture.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 5. Tech Pairing (Interactive Presenter) ── */}
          <section id="hire-section" ref={refPair} className={`fu-sec fu-sec-pair fu-reveal ${visPair ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              <p className="fu-sec-eyebrow">What Companies Actually Hire</p>
              <h2 className="fu-sec-heading">
                We help to pick the <span className="fu-pitch-accent">right technologies.</span>
              </h2>
              <p className="fu-sec-sub">These are real combinations companies are hiring for right now.</p>

              <div className="fu-combo-presenter">
                <div className="fu-combo-stage">
                  <div key={activeComboIndex} className="fu-combo-active">
                    {techCombos[activeComboIndex].tags.map((tag, j) => (
                      <React.Fragment key={j}>
                        {j > 0 && <span className="fu-combo-plus-large"><Plus size={24} /></span>}
                        <div 
                          className="fu-combo-pill-large" 
                          style={{ borderColor: techCombos[activeComboIndex].color, color: techCombos[activeComboIndex].color }}
                        >
                          {tag}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                
                <button 
                  className="fu-combo-shuffle-btn"
                  onClick={() => setActiveComboIndex((prev) => (prev + 1) % techCombos.length)}
                >
                  <RefreshCw size={18} className="fu-shuffle-icon" /> Show Another Combination
                </button>
              </div>

              {/* NEW: Journey Bento */}
              <div className="fu-journey-bento">
                <div className="fu-journey-card fu-journey-wide">
                  <div className="fu-journey-icon-wrap"><Compass size={32} /></div>
                  <div className="fu-journey-text">
                    <h3>Training is a Journey, Not Just Teaching</h3>
                    <p>It's an immersive experience designed to build real-world intuition, going far beyond traditional lectures. We help students discover their passion and master the exact stack they need.</p>
                  </div>
                </div>
                <div className="fu-journey-card">
                  <div className="fu-journey-icon-wrap"><Target size={28} /></div>
                  <div className="fu-journey-text">
                    <h3>Pick the Right Stack</h3>
                    <p>We guide students to discover and master the perfect technology combinations for their careers.</p>
                  </div>
                </div>
                <div className="fu-journey-card">
                  <div className="fu-journey-icon-wrap"><Briefcase size={28} /></div>
                  <div className="fu-journey-text">
                    <h3>Industry Ready</h3>
                    <p>Equipping them with the exact tools and workflows used by top product companies.</p>
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



          {/* ── NEW 5.5 LMS Bento Grid ── */}
          <section id="lms-section" ref={refLms} className={`fu-sec fu-sec-lms fu-reveal ${visLms ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              <p className="fu-sec-eyebrow">LMS - CipherSchools</p>
              <h2 className="fu-sec-heading-split">
                <span className="fu-heading-light">A platform built for</span>
                <br/>effortless learning management.
              </h2>
              
              <div className="fu-lms-bento fu-lms-bento-4">
                {/* 1. Learning Analytics (Dashboard) */}
                <div className="fu-lms-card fu-lms-dashboard">
                   <div className="fu-mock-header">
                     <div className="fu-mock-nav">
                        <div className="fm-nav-item active"></div>
                        <div className="fm-nav-item"></div>
                        <div className="fm-nav-item"></div>
                     </div>
                     <div className="fu-mock-welcome">Hey University,</div>
                   </div>
                   <div className="fu-mock-stats">
                     <div className="fu-mock-stat-box">Total Videos<br/><span>0/35</span></div>
                     <div className="fu-mock-stat-box">Questions Solved<br/><span>0/67</span></div>
                     <div className="fu-mock-stat-box">Tests Attempted<br/><span>0/18</span></div>
                   </div>
                   <div className="fu-mock-course">
                     <h4>Learning Analytics</h4>
                     <p>Detailed breakdown of cohort performance and progress tracking.</p>
                     <div className="fu-mock-bar"></div>
                   </div>
                </div>

                {/* 2. Module Based Learning (Video/Article) */}
                <div className="fu-lms-card fu-lms-video">
                  <h4>Module Based Learning (Video/Article)</h4>
                  <div className="fu-mock-video-player" style={{marginTop: '1rem'}}>
                    <div className="fm-play-btn"><Play size={20} fill="white"/></div>
                    <div className="fm-progress"></div>
                  </div>
                  <div className="fu-mock-playlist">
                    <div className="fm-play-item active">Lecture 1 Setting Up Python</div>
                    <div className="fm-play-item">Lecture 2 Running Our First Program</div>
                  </div>
                </div>

                {/* 3. Practice & Testing */}
                <div className="fu-lms-card fu-lms-practice">
                   <h4>Practice & Testing (Module Based)</h4>
                   <div className="fu-mock-filters">
                     <span className="fu-mf-active">All</span>
                     <span>Solved</span>
                     <span>Unsolved</span>
                   </div>
                   <div className="fu-mock-table">
                     <div className="fu-mock-row"><div className="fm-circle"></div><div className="fm-line w-long"></div><div className="fm-tag easy">Easy</div></div>
                     <div className="fu-mock-row"><div className="fm-circle"></div><div className="fm-line w-med"></div><div className="fm-tag hard">Hard</div></div>
                     <div className="fu-mock-row"><div className="fm-circle"></div><div className="fm-line w-long"></div><div className="fm-tag med">Medium</div></div>
                   </div>
                </div>

                {/* 4. Resources Access */}
                <div className="fu-lms-card fu-lms-resources">
                  <h4>Resources Access</h4>
                  <div className="fu-mock-resources" style={{marginTop: '1rem'}}>
                     <div className="fm-resource-item">
                        <div className="fm-res-icon pdf"><FileText size={16}/></div>
                        <div className="fm-res-info">
                           <div className="fm-line w-long" style={{marginBottom: '4px'}}></div>
                           <span>PDF Document</span>
                        </div>
                     </div>
                     <div className="fm-resource-item">
                        <div className="fm-res-icon article"><FileText size={16}/></div>
                        <div className="fm-res-info">
                           <div className="fm-line w-long" style={{marginBottom: '4px'}}></div>
                           <span>Article Link</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* 5. Stage Based Locking */}
                <div className="fu-lms-card fu-lms-stages-wide">
                  <h4>Stage Based Locking</h4>
                  <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.5rem' }}>* Highly customizable structured paths.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '0.5rem' }}>
                    <div className="fm-stage unlocked" style={{ flex: '1', minWidth: '200px' }}>
                       <div className="fm-stage-icon"><Play size={12} fill="currentColor"/></div>
                       <div className="fm-stage-info">Module 1: Basics<br/><span>Completed</span></div>
                    </div>
                    <div className="fm-stage unlocked" style={{ flex: '1', minWidth: '200px' }}>
                       <div className="fm-stage-icon"><Play size={12} fill="currentColor"/></div>
                       <div className="fm-stage-info">Module 2: DSA<br/><span>In Progress</span></div>
                    </div>
                    <div className="fm-stage locked" style={{ flex: '1', minWidth: '200px', opacity: 0.5 }}>
                       <div className="fm-stage-icon"><Lock size={12}/></div>
                       <div className="fm-stage-info">Module 3: Advanced<br/><span>Locked</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── NEW 5.6 Assessment Platform ── */}
          <section id="assessment-section" ref={refAssessment} className={`fu-sec fu-sec-assessment fu-reveal ${visAssessment ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              <div className="fu-assessment-split">
                <div className="fu-assessment-content">
                  <p className="fu-sec-eyebrow">Assessment Platform</p>
                  <h2 className="fu-sec-heading-split">
                    <span className="fu-heading-light">Measure what matters,</span>
                    <br/>automatically.
                  </h2>
                  <div className="fu-assessment-tabs">
                    {[
                      { id: 'online_exam', label: 'Online examinations', desc: 'Secure, scalable exams for any domain.', icon: <FileText size={20} /> },
                      { id: 'auto_eval', label: 'Automated evaluation', desc: 'Instant grading and precise scoring.', icon: <Zap size={20} /> },
                      { id: 'coding', label: 'Coding assessments', desc: 'Full IDE with multiple languages.', icon: <Code2 size={20} /> },
                      { id: 'aptitude', label: 'Aptitude tests', desc: 'Logical reasoning and quantitative analysis.', icon: <Compass size={20} /> },
                      { id: 'comm_skill', label: 'Communication skill assessments', desc: 'AI-driven spoken and written evaluation.', icon: <MessageSquare size={20} /> },
                      { id: 'analytics', label: 'Performance analytics', desc: 'Deep dive into student capabilities.', icon: <TrendingUp size={20} /> },
                      { id: 'qbank', label: 'Question bank management', desc: 'Organize and curate your test library.', icon: <FileText size={20} /> },
                      { id: 'reports', label: 'Candidate reports', desc: 'Comprehensive hiring readiness profiles.', icon: <User size={20} /> },
                    ].map(tab => (
                      <div key={tab.id} className={`fu-as-tab ${activeAssessmentTab === tab.id ? 'active' : ''}`} onClick={() => setActiveAssessmentTab(tab.id)}>
                        <div className="fu-as-icon">{tab.icon}</div>
                        <div className="fu-as-text"><h4>{tab.label}</h4><p>{tab.desc}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="fu-assessment-mockup-wrapper">
                  <div className="fu-assessment-mockup">
                    {activeAssessmentTab === 'online_exam' && (
                      <div className="fu-mock-as-exam">
                        <div className="fme-header">
                          <span className="fme-time">45:00</span>
                          <span className="fme-qnum">Question 4 of 20</span>
                        </div>
                        <div className="fme-body">
                          <div className="fme-q">Which data structure uses LIFO?</div>
                          <div className="fme-options">
                            <div className="fme-opt"><div className="fme-radio"></div>Queue</div>
                            <div className="fme-opt active"><div className="fme-radio checked"></div>Stack</div>
                            <div className="fme-opt"><div className="fme-radio"></div>Tree</div>
                            <div className="fme-opt"><div className="fme-radio"></div>Graph</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeAssessmentTab === 'auto_eval' && (
                      <div className="fu-mock-as-eval">
                        <div className="fmeval-console">
                          <div className="fmeval-line success"><CheckCircle2 size={14}/> Test Case 1 Passed (12ms)</div>
                          <div className="fmeval-line success"><CheckCircle2 size={14}/> Test Case 2 Passed (15ms)</div>
                          <div className="fmeval-line success"><CheckCircle2 size={14}/> Test Case 3 Passed (14ms)</div>
                          <div className="fmeval-line success"><CheckCircle2 size={14}/> Hidden Case 1 Passed (11ms)</div>
                          <div className="fmeval-line success"><CheckCircle2 size={14}/> Hidden Case 2 Passed (13ms)</div>
                          <div className="fmeval-summary">Score: 100/100</div>
                        </div>
                      </div>
                    )}
                    {activeAssessmentTab === 'coding' && (
                      <div className="fu-mock-as-practice">
                         <div className="fmp-sidebar">
                           <div className="fm-line w-med"></div>
                           <div className="fm-line w-long"></div>
                           <div className="fm-line w-long"></div>
                         </div>
                         <div className="fmp-editor">
                           <div className="fm-editor-tab">solution.py</div>
                           <div className="fm-editor-code">
                             <span className="fm-kwd">def</span> <span className="fm-func">solve</span>(arr):<br/>
                             &nbsp;&nbsp;<span className="fm-kwd">return</span> sorted(arr)
                           </div>
                           <div className="fm-editor-btn">Run Code</div>
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
                      <div className="fu-mock-as-comm">
                        <div className="fmc-mic"><div className="fmc-pulse"></div><MessageSquare size={32} color="#fff" /></div>
                        <div className="fmc-waves">
                          <div className="fmc-wave" style={{height: '20%'}}></div>
                          <div className="fmc-wave" style={{height: '60%'}}></div>
                          <div className="fmc-wave" style={{height: '100%'}}></div>
                          <div className="fmc-wave" style={{height: '40%'}}></div>
                          <div className="fmc-wave" style={{height: '80%'}}></div>
                        </div>
                        <div className="fmc-status">Analyzing Pronunciation...</div>
                      </div>
                    )}
                    {activeAssessmentTab === 'analytics' && (
                      <div className="fu-mock-as-result">
                        <div className="fmr-score-circle">
                          <span>85</span>
                          <small>Score</small>
                        </div>
                        <div className="fmr-bars">
                          <div className="fmr-bar-item"><span>DSA</span> <div className="fmr-bar"><div style={{width: '90%'}}></div></div></div>
                          <div className="fmr-bar-item"><span>Speed</span> <div className="fmr-bar"><div style={{width: '70%'}}></div></div></div>
                          <div className="fmr-bar-item"><span>Accuracy</span> <div className="fmr-bar"><div style={{width: '85%'}}></div></div></div>
                        </div>
                      </div>
                    )}
                    {activeAssessmentTab === 'qbank' && (
                      <div className="fu-mock-as-qbank">
                        <div className="fmq-header">Question Library <div className="fmq-btn">+ Add</div></div>
                        <div className="fmq-list">
                          <div className="fmq-item"><div className="fmq-title">Two Sum</div><div className="fm-tag easy">Easy</div></div>
                          <div className="fmq-item"><div className="fmq-title">LRU Cache</div><div className="fm-tag med">Medium</div></div>
                          <div className="fmq-item"><div className="fmq-title">N-Queens</div><div className="fm-tag hard">Hard</div></div>
                        </div>
                      </div>
                    )}
                    {activeAssessmentTab === 'reports' && (
                      <div className="fu-mock-as-reports">
                        <div className="fmr-rep-card">
                          <div className="fmr-rep-user"><User size={24} color="#888"/> <div><h4>Jane Doe</h4><p>Full Stack Dev</p></div></div>
                          <div className="fm-tag easy">Hire</div>
                        </div>
                        <div className="fmr-rep-card">
                          <div className="fmr-rep-user"><User size={24} color="#888"/> <div><h4>John Smith</h4><p>Backend Dev</p></div></div>
                          <div className="fm-tag med">Review</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── NEW 6. Beyond Domain ── */}
          <section ref={refBeyond} className={`fu-sec fu-sec-beyond fu-reveal ${visBeyond ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              <p className="fu-sec-eyebrow">Beyond Subjects & Domains</p>
              <h2 className="fu-sec-heading-split">
                <span className="fu-heading-light">We are not limited</span>
                <br/>to what you see.
              </h2>
              <p className="fu-sec-sub">We integrate immersive experiences that help students think beyond the classroom.</p>

              <div className="fu-beyond-bento">
                <div className="fu-beyond-card fu-beyond-tall">
                  <div className="fu-beyond-icon"><Flame size={36} /></div>
                  <h3>Bootcamps</h3>
                  <p>Intensive, hands-on sprints to build and deploy full-scale projects in weeks, not years.</p>
                </div>
                <div className="fu-beyond-card">
                  <div className="fu-beyond-icon"><Presentation size={28} /></div>
                  <h3>Workshops</h3>
                  <p>Focused sessions mastering the latest industry tools and frameworks.</p>
                </div>
                <div className="fu-beyond-card">
                  <div className="fu-beyond-icon"><Globe size={28} /></div>
                  <h3>Industry Sessions</h3>
                  <p>Direct interactions with tech leaders from top product companies.</p>
                </div>
                <div className="fu-beyond-card fu-beyond-wide">
                  <div className="fu-beyond-icon"><Compass size={28} /></div>
                  <div>
                    <h3>Career Sessions & More...</h3>
                    <p>Mock interviews, resume reviews, 1:1 mentorship, and continuous guidance to crack the toughest hiring bars.</p>
                  </div>
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
                No pitch decks. No hard sells. Just a real conversation about your students.
              </p>
              <button className="fu-pitch-cta-btn" style={{ marginTop: '2rem' }}>
                Book a Chat <ArrowRight size={20} />
              </button>
            </div>
          </section>

        </div>
      )}

      {/* ── STICKY CTA ── */}
      <div className={`fu-sticky-cta ${showStickyCta ? 'fu-sticky-visible' : ''}`}>
        <div className="fu-sticky-cta-inner">
          <p>Let's connect over a quick meeting for a <strong>QUICK walk through</strong></p>
          <button className="fu-sticky-btn">Book Meeting</button>
        </div>
      </div>
    </div>
  );
};

export default ForUniversities;
