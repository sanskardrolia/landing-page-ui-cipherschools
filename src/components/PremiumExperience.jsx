import React, { useEffect, useRef, useState } from 'react';
import { Play, TrendingDown, Crown, CheckCircle2, Lock, Layers, Code2, UserCheck, X } from 'lucide-react';
import LearningPaths from './LearningPaths';
import './PremiumExperience.css';

const PremiumExperience = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollPos = window.innerHeight - rect.top;
      
      // Simple logic to highlight steps based on scroll depth
      if (scrollPos > 800) setActiveStep(3);
      else if (scrollPos > 500) setActiveStep(2);
      else if (scrollPos > 200) setActiveStep(1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="premium-story-section section" ref={sectionRef}>
      <div className="container relative z-10">
        
        <div className="section-header text-center animate-fade-in">
          <div className="tag cred-tag" style={{background: 'rgba(243,145,46,0.1)', color: 'var(--primary)'}}>The Learner's Journey</div>
          <h2 className="section-title">Start to Standout</h2>
          <p className="section-subtitle text-muted" style={{maxWidth: '500px', margin: '0 auto'}}>
            Every developer hits a wall. We give you the tools to break through.
          </p>
        </div>

        <div className="journey-timeline">
          {/* Progress Line */}
          <div className="timeline-line">
            <div className="timeline-progress" style={{ height: activeStep === 1 ? '10%' : activeStep === 2 ? '50%' : '100%' }}></div>
          </div>

          {/* Step 1: The Start */}
          <div className={`journey-step ${activeStep >= 1 ? 'active' : ''}`}>
            <div className="step-marker"><Play size={20} /></div>
            <div className="step-content">
              <div className="step-badge free-badge">Step 1: The Foundation</div>
              <h3>Start for Free</h3>
              <p>Jumpstart your journey with zero friction. Write your first lines of code today.</p>
              <ul className="step-list">
                <li><CheckCircle2 size={16} /> Free access to Cloud Compiler</li>
                <li><CheckCircle2 size={16} /> Foundational video tutorials</li>
                <li><CheckCircle2 size={16} /> Basic standard learning paths</li>
              </ul>
              <button 
                className="btn btn-primary w-100" 
                style={{padding: '12px', fontSize: '1rem', marginTop: '2rem'}}
                onClick={() => setIsModalOpen(true)}
              >
                Start FREE
              </button>
            </div>
          </div>

          {/* Step 2: The Wall */}
          <div className={`journey-step ${activeStep >= 2 ? 'active' : ''}`}>
            <div className="step-marker wall-marker"><TrendingDown size={20} /></div>
            <div className="step-content">
              <div className="step-badge wall-badge">Step 2: The Plateau</div>
              <h3>The Developer Wall</h3>
              <p>Basic tutorials only go so far. Real engineering demands solving complex, ambiguous problems.</p>
              <div className="wall-visual">
                <Lock size={24} className="lock-icon" />
                <span>You need harder challenges to break through.</span>
              </div>
            </div>
          </div>

          {/* Step 3: The Breakthrough (Premium) */}
          <div className={`journey-step premium-step ${activeStep >= 3 ? 'active' : ''}`}>
            <div className="step-marker premium-marker"><Crown size={20} /></div>
            <div className="step-content premium-content">
              <div className="premium-glow-bg"></div>
              <div className="step-badge premium-badge">Step 3: The Breakthrough</div>
              <h3 className="premium-title">Unlock Premium Mastery</h3>
              <p>Access heavy-duty resources and 1-on-1 mentorship to become a top-tier engineer.</p>
              
              <div className="premium-visual-grid">
                <div className="pv-card">
                  <div className="pv-icon"><Layers size={24} /></div>
                  <h4>Advanced Courses</h4>
                  <p>Enterprise-grade architectures</p>
                </div>
                <div className="pv-card">
                  <div className="pv-icon"><Code2 size={24} /></div>
                  <h4>Massive Labs</h4>
                  <p>Thousands of new challenges</p>
                </div>
                <div className="pv-card">
                  <div className="pv-icon"><UserCheck size={24} /></div>
                  <h4>Personalization</h4>
                  <p>Mentorship & resume reviews</p>
                </div>
              </div>
              
              <button className="btn btn-primary premium-btn">Explore Premium Access</button>
            </div>
          </div>

        </div>
      </div>

      {/* Learning Paths Modal Pop-up */}
      {isModalOpen && (
        <div className="lp-modal-overlay animate-fade-in">
          <div className="lp-modal-content">
            <button className="lp-modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>
            <div className="lp-modal-scroll">
              <LearningPaths />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PremiumExperience;
