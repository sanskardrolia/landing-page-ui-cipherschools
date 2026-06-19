import React, { useState } from 'react';
import { ArrowUpRight, Code, TerminalSquare, User, Sparkles } from 'lucide-react';
import './MentorsSection.css';
import MentorWallModal from './MentorWallModal';

const MentorsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="mentors-section section bg-white">
      <MentorWallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="container">
        <div className="mentors-card">
          
          {/* Subtle background grid pattern */}
          <div className="mentors-bg-pattern"></div>

          <div className="mentors-grid">
            
            {/* Left Side: Copy & CTAs */}
            <div className="mentors-content">
              
              <div className="ms-top-tag">
                <div className="ms-tag-icon"><User size={14}/></div>
                <div className="ms-tag-text">
                  <strong>50k+ Learners</strong>
                  <span>Read Our <a href="#">Success Stories</a></span>
                </div>
              </div>

              <h2 className="ms-headline">Mentors</h2>
              
              <p className="ms-subheadline">
                Expert guidance, real-world insights, and placement support. All powered by elite industry leaders.
              </p>

              <div className="ms-stats-block">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Profile" className="ms-stat-avatar" />
                <div className="ms-stat-text">
                  <span>100+ FAANG Mentors</span>
                  <span className="ms-divider">/</span>
                  <span className="ms-rating">★ 4.9</span>
                </div>
              </div>

              <div className="ms-actions">
                <button className="ms-btn-primary">Start Learning — It's Free</button>
                <a 
                  href="#wall-of-fame" 
                  className="ms-btn-link"
                  onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                >
                  View All Mentors <ArrowUpRight size={16}/>
                </a>
              </div>
            </div>

            {/* Right Side: Overlapping UI */}
            <div className="mentors-visual">
              
              {/* Avatars */}
              <div className="ms-avatars">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop" alt="Mentor 1" className="ms-av ms-av-1" />
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop" alt="Mentor 2" className="ms-av ms-av-2" />
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop" alt="Mentor 3" className="ms-av ms-av-3" />
                <Sparkles size={20} className="ms-sparkle-1" />
                <Sparkles size={20} className="ms-sparkle-2" />
              </div>

              {/* Connecting Lines SVG */}
              <div className="ms-lines">
                <svg width="240" height="60" viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M120 0 L120 30" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  <path d="M40 30 L200 30" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  <path d="M40 30 L40 60" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  <path d="M120 30 L120 60" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  <path d="M200 30 L200 60" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Pills Row */}
              <div className="ms-pills">
                <div className="ms-pill">LEARN</div>
                <div className="ms-pill active"><span className="dot"></span> PRACTICE</div>
                <div className="ms-pill">CRACK IT</div>
              </div>

              {/* Floating Context Card removed */}

              {/* Company Badges */}
              <div className="ms-badges">
                <div className="ms-badge"><img src="https://api.iconify.design/simple-icons/amazonaws.svg?color=white" alt="AWS" className="icon-img" style={{opacity: 0.7, width: 24, height: 24}}/></div>
                <div className="ms-badge"><img src="https://api.iconify.design/simple-icons/microsoft.svg?color=white" alt="Microsoft" className="icon-img" style={{opacity: 0.7, width: 24, height: 24}}/></div>
                <div className="ms-badge"><img src="https://api.iconify.design/simple-icons/google.svg?color=white" alt="Google" className="icon-img" style={{opacity: 0.7, width: 24, height: 24}}/></div>
                <div className="ms-badge"><img src="https://api.iconify.design/simple-icons/adobe.svg?color=white" alt="Adobe" className="icon-img" style={{opacity: 0.7, width: 24, height: 24}}/></div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorsSection;
