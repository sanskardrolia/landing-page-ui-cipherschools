import React, { useState, useEffect } from 'react';
import { GraduationCap, Building2, ChevronDown, Sparkles } from 'lucide-react';
import './SmartStickyExperienceBar.css';

const SmartStickyExperienceBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMerged, setIsMerged] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero-impact-section');
      const welcomeEl = document.getElementById('welcome-section');

      if (!heroEl || !welcomeEl) return;

      const heroRect = heroEl.getBoundingClientRect();
      const welcomeRect = welcomeEl.getBoundingClientRect();

      // Show after scrolling 250px into Hero
      const pastHeroHeader = heroRect.top < -250;

      // Check if welcome section is visible in viewport (smart merge range)
      const welcomeInView = (
        welcomeRect.top < window.innerHeight * 0.75 &&
        welcomeRect.bottom > window.innerHeight * 0.25
      );

      // Past welcome section completely
      const pastWelcome = welcomeRect.bottom <= window.innerHeight * 0.25;

      if (welcomeInView) {
        setIsVisible(true);
        setIsMerged(true); // Docking into section!
      } else if (pastHeroHeader && !pastWelcome) {
        setIsVisible(true);
        setIsMerged(false); // Floating sticky bar!
      } else {
        setIsVisible(false);
        setIsMerged(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTarget = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible && !isMerged) return null;

  return (
    <div className={`smart-sticky-bar-wrapper ${isMerged ? 'merged-docked' : 'floating-active'}`}>
      <div className="smart-sticky-bar-container">
        
        {/* Left Label */}
        <div className="sticky-bar-label">
          <Sparkles size={14} className="sticky-sparkle" />
          <span>Choose how you want to experience:</span>
        </div>

        {/* Action Buttons */}
        <div className="sticky-bar-actions">
          <button 
            className="sticky-action-btn btn-student"
            onClick={() => scrollToTarget('student-section')}
          >
            <GraduationCap size={15} />
            <span>I'm a Student</span>
          </button>

          <button 
            className="sticky-action-btn btn-university"
            onClick={() => scrollToTarget('university-section')}
          >
            <Building2 size={15} />
            <span>I'm a University</span>
          </button>
        </div>

        {/* Scroll Jump Hint */}
        <button 
          className="sticky-jump-hint"
          onClick={() => scrollToTarget('welcome-section')}
          title="Scroll to Gateway section"
        >
          <ChevronDown size={16} />
        </button>

      </div>
    </div>
  );
};

export default SmartStickyExperienceBar;
