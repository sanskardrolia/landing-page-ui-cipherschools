import React, { useState, useRef, useCallback } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
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
    'GenAI Tools',
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
      <div className="hero-bg-grain"></div>

      <div className="hero-grid">
        {/* Left — Copy */}
        <div className="hero-left">
          <div className="hero-badge">CipherSchools Ecosystem</div>

          <h1 className="hero-h1">
            Build skills that <br />
            <span className="hero-h1-accent">get you hired.</span>
          </h1>

          <p className="hero-p">
            Project-based learning, CipherLabs, and mentorship from engineers at
            Google, Microsoft, and Amazon.
          </p>

          <div className="hero-cta-row">
            <a href="#" className="hero-btn-primary">
              Start for free <ArrowRight size={18} />
            </a>
            <a href="#ecosystem" className="hero-btn-ghost">
              See how it works
            </a>
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
          {onReplay && (
            <div className="hero-story-replay-wrap">
              <button className="hero-story-replay-btn" onClick={onReplay}>
                I can relate to story — <span>rewatch</span>
              </button>
            </div>
          )}
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
