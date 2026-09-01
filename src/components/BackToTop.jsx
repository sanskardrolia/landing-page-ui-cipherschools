import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import './BackToTop.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (totalScrollHeight > 0) {
        const progress = Math.min(Math.max((currentScrollY / totalScrollHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }

      if (currentScrollY > 360) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      type="button"
      className={`back-to-top-btn ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      {/* Subtle Circular Progress Indicator SVG */}
      <svg className="back-to-top-ring" viewBox="0 0 40 40">
        <circle
          className="ring-bg"
          cx="20"
          cy="20"
          r="17"
        />
        <circle
          className="ring-progress"
          cx="20"
          cy="20"
          r="17"
          style={{
            strokeDasharray: 106.8,
            strokeDashoffset: 106.8 - (106.8 * scrollProgress) / 100
          }}
        />
      </svg>

      <div className="back-to-top-icon-wrap">
        <ArrowUp size={16} className="back-to-top-arrow" />
      </div>
    </button>
  );
};

export default BackToTop;
