import React from 'react';
import { ArrowRight } from 'lucide-react';
import './MentorsSection.css';

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

const MentorsSection = () => {
  const row1Mentors = [...MENTOR_PHOTOS, ...MENTOR_PHOTOS];
  const row2Mentors = [...MENTOR_PHOTOS.slice().reverse(), ...MENTOR_PHOTOS.slice().reverse()];

  const scrollToEcosystem = () => {
    const el = document.getElementById('ecosystem');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="mentors-section section">
      <div className="container">
        
        {/* ── Section Header ── */}
        <div className="mentors-header-block">
          <span className="mentors-eyebrow">INDUSTRY MENTORS</span>
          <h2 className="mentors-headline">
            Learn From Industry Professionals
          </h2>
          <p className="mentors-subheadline">
            Get guided by top engineers and leaders from Google, Meta, Netflix, Amazon, and Apple who have been in your shoes.
          </p>
          <button className="start-free-cta-btn" onClick={scrollToEcosystem}>
            Start Learning for FREE <ArrowRight size={18} />
          </button>
        </div>

      </div>

      {/* ── Full-Width Horizontal Infinite Scroll Container ── */}
      <div className="horizontal-scroll-stage">
        {/* Edge Fade Shadows */}
        <div className="scroll-h-fade left-fade"></div>
        <div className="scroll-h-fade right-fade"></div>

        {/* Single Row: Infinite Horizontal Marquee */}
        <div className="horizontal-marquee-row row-left">
          <div className="marquee-track">
            {row1Mentors.map((mentor, index) => (
              <div className="mentor-photo-card" key={`row1-${index}`}>
                <img src={mentor.avatar} alt={mentor.name} className="mentor-img" />
                <div className="company-badge-icon">
                  <img src={mentor.logo} alt={mentor.company} />
                </div>
                <div className="mentor-overlay-info">
                  <h4 className="mentor-overlay-name">{mentor.name}</h4>
                  <p className="mentor-overlay-role">{mentor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default MentorsSection;
