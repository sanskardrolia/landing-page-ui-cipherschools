import React, { useState, useEffect, useRef } from 'react';
import './StoryHero.css';
import { ArrowRight, ArrowDown, RotateCcw, Sparkles } from 'lucide-react';

const STORY_PHRASES = [
  {
    content: <>What to <span className="story-hl">study?</span></>,
    className: "phrase-q1",
    align: "flex-start",
    ml: "8%",
    mr: "0"
  },
  {
    content: <>What <span className="story-hl">career path</span> should I pick?</>,
    className: "phrase-q2",
    align: "flex-end",
    ml: "0",
    mr: "10%"
  },
  {
    content: <>Where to <span className="story-hl">start?</span></>,
    className: "phrase-q3",
    align: "flex-start",
    ml: "18%",
    mr: "0"
  },
  {
    content: <>Will <span className="story-hl">AI replace</span> my job?</>,
    className: "phrase-q4",
    align: "flex-end",
    ml: "0",
    mr: "15%"
  },
  {
    content: <>Am I <span className="story-hl">not the one?</span></>,
    className: "phrase-q5",
    align: "center",
    ml: "0",
    mr: "0"
  }
];

const MENTOR_PHOTOS = [
  { name: 'Alex Rivera', role: 'Sr. Product Designer', company: 'Google', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' },
  { name: 'Sarah Connor', role: 'Data Scientist', company: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop' },
  { name: 'Maya Lin', role: 'UX Director', company: 'Apple', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop' },
  { name: 'Chen Wei', role: 'SDE Lead', company: 'Netflix', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { name: 'Yuki Tanaka', role: 'Frontend Architect', company: 'Twitter', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop' },
  { name: 'Amara Okafor', role: 'AI Researcher', company: 'Meta', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
  { name: 'Anjali Sharma', role: 'Engineering Manager', company: 'Microsoft', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
  { name: 'Vikram Singh', role: 'Cloud Architect', company: 'Adobe', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop' },
];

const FINAL_PHRASE = <>An <span className="story-hl-gradient">ecosystem</span> that guides your path.</>;

const StoryHero = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [step, setStep] = useState(0);
  const [questionsVisible, setQuestionsVisible] = useState(true);
  const [reassuranceVisible, setReassuranceVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef(null);

  // Trigger animation when scrolled into view (with dwell check and navigation lock)
  useEffect(() => {
    let dwellTimer = null;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (window.isNavigatingToUniversity) return;

        // Dwell 350ms to ensure user didn't just fast-scroll past
        dwellTimer = setTimeout(() => {
          if (!window.isNavigatingToUniversity) {
            setHasStarted(true);
            observer.disconnect();
          }
        }, 350);
      } else {
        if (dwellTimer) clearTimeout(dwellTimer);
      }
    }, { threshold: 0.3 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (dwellTimer) clearTimeout(dwellTimer);
      observer.disconnect();
    };
  }, []);

  // Handle smooth progress bar tracking
  useEffect(() => {
    if (!hasStarted) return;
    const totalDuration = 10000;
    const intervalTime = 50;
    const stepAmount = (intervalTime / totalDuration) * 100;

    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return p + stepAmount;
      });
    }, intervalTime);

    return () => clearInterval(progressTimer);
  }, [hasStarted]);

  // Run the story animation sequence (Seamless zero-gap timing)
  useEffect(() => {
    if (!hasStarted) return;

    if (step < STORY_PHRASES.length) {
      // Reveal each question quickly
      const nextTimer = setTimeout(() => {
        setStep(s => s + 1);
      }, 950); 
      return () => clearTimeout(nextTimer);
    } 
    else if (step === STORY_PHRASES.length) {
      // All questions on screen. Fade questions and immediately show final complete stage with mentors & CTAs
      const fadeOutTimer = setTimeout(() => {
        setQuestionsVisible(false);
        setIsComplete(true);
      }, 1200);
      
      return () => clearTimeout(fadeOutTimer);
    }
  }, [step, hasStarted]);

  const finishStory = () => {
    setQuestionsVisible(false);
    setIsComplete(true);
  };

  const replayStory = () => {
    setIsComplete(false);
    setStep(0);
    setQuestionsVisible(true);
    setReassuranceVisible(false);
    setProgress(0);
    setHasStarted(true);
  };

  const scrollToNextSection = () => {
    const el = document.getElementById('ecosystem');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isComplete) {
    const compactMentors = [...MENTOR_PHOTOS, ...MENTOR_PHOTOS];
    return (
      <div className="story-hero-container story-completed-container" ref={containerRef}>
        {/* Warm Ambient Glow Backdrop */}
        <div className="story-ambient-glow"></div>

        <div className="story-phrase-stage active">
          <div className="story-final-card">
            
            {/* Top Badge */}
            <div className="story-top-badge">
              <Sparkles size={14} className="story-sparkle-icon" /> YOUR PATHWAY TO SUCCESS
            </div>

            <h2 className="story-final-text">
              An <span className="story-hl-orange">ecosystem</span> that guides your path.
            </h2>
            
            {/* Ecosystem 4-Feature Pills Row */}
            <div className="story-feature-pills-row">
              <span className="story-feature-pill">🔥 Learn From Top Mentor</span>
              <span className="story-feature-pill">⚡ Practice What You Learn</span>
              <span className="story-feature-pill">💼 Build Resume</span>
              <span className="story-feature-pill">🎯 Networking</span>
            </div>

            {/* Embedded Upgraded Mentors Marquee */}
            <div className="story-mentors-embed-stage">
              <p className="story-mentors-label">LEARN DIRECTLY FROM ENGINEERS & LEADERS AT TOP TECH COMPANIES</p>

              <div className="story-mentors-marquee-row">
                <div className="story-mentors-track">
                  {compactMentors.map((mentor, index) => (
                    <div className="story-compact-card" key={`compact-${index}`}>
                      <img src={mentor.avatar} alt={mentor.name} className="compact-img" />
                      <div className="compact-company-badge">
                        <img src={mentor.logo} alt={mentor.company} />
                      </div>
                      <div className="compact-overlay">
                        <span className="compact-status-dot">● Available</span>
                        <h4 className="compact-name">{mentor.name}</h4>
                        <p className="compact-role">{mentor.role} @ {mentor.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="story-final-actions-row">
              <button className="story-primary-cta-btn" onClick={scrollToNextSection}>
                Start Your Student Journey <ArrowDown size={18} />
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="story-hero-container" ref={containerRef}>
      {/* Progress Bar */}
      <div className="story-progress-bar-container">
        <div className="story-progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
      </div>

      {/* Skip Button */}
      <button className="story-skip-btn" onClick={finishStory}>
        Skip Story <ArrowRight size={16} />
      </button>

      {/* Questions Stack */}
      <div className={`story-questions-stack ${questionsVisible ? '' : 'fade-out'}`}>
        {hasStarted && STORY_PHRASES.slice(0, step).map((phrase, i) => (
          <div 
            key={i} 
            className="story-phrase-wrapper fade-in-up" 
            style={{ 
              alignSelf: phrase.align, 
              marginLeft: phrase.ml, 
              marginRight: phrase.mr 
            }}
          >
            <h2 className={`story-phrase question ${phrase.className}`}>
              {phrase.content}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryHero;
