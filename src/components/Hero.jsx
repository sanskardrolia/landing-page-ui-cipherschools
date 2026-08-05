import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, RotateCcw } from 'lucide-react';
import InteractiveParticles from './InteractiveParticles';
import './Hero.css';

const Hero = ({ onReplay }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const hasPlayedOnce = useRef(false);

  const features = [
    'CipherLabs',
    'Proctored Tests',
    'DSA Problems',
    'FAANG Mentors',
  ];

  const handleVideoEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!hasPlayedOnce.current) {
      // First play just finished — mute and loop from now on
      hasPlayedOnce.current = true;
      video.muted = true;
      video.loop = true;
      video.play();
    }
  }, []);

  return (
    <section className="hero">
      <InteractiveParticles />
      <div className="hero-bg-isometric-grid"></div>
      <div className="hero-bg-grain"></div>

      <div className="hero-grid">
        {/* Left — Copy */}
        <div className="hero-left">
          <div className="hero-badge">FREE To Start</div>

          <h1 className="hero-h1">
            <span className="hero-h1-accent">Growth</span> is the<br />
            destination.
          </h1>

          <p className="hero-p">
            An outcome-driven learning platform that bridges the gap between learning and landing your dream tech career.
          </p>

          <div className="hero-cta-row">
            <button 
              className="hero-btn-primary"
              onClick={() => {
                const target = document.getElementById('ecosystem');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Explore & Learn For Free <ArrowRight size={18} />
            </button>
          </div>

          <div className="hero-features-strip">
            {features.map((f) => (
              <span key={f} className="hero-chip">{f}</span>
            ))}
          </div>
        </div>

        {/* Right — Video */}
        <div className="hero-right">
          <div className="hero-video-wrap">
            {onReplay && (
              <button 
                className="hero-replay-smart-btn" 
                onClick={onReplay}
                title="Replay Story"
                aria-label="Replay Story"
              >
                <RotateCcw size={16} />
              </button>
            )}

            <video
              ref={videoRef}
              className="hero-video"
              src="/media/hero-video.mp4"
              autoPlay
              playsInline
              preload="metadata"
              onLoadedData={() => setVideoLoaded(true)}
              onEnded={handleVideoEnded}
            />
            {!videoLoaded && (
              <div className="hero-video-placeholder">
                <span>▶ Replace with your video</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="hero-scroll-indicator">
        <ChevronDown className="scroll-arrow-icon" size={32} />
      </div>
    </section>
  );
};

export default Hero;
