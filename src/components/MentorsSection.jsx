import React from 'react';
import { User, Sparkles } from 'lucide-react';
import './MentorsSection.css';

const MENTORS = [
  { name: 'Anjali Sharma', role: 'Sr. Software Engineer', company: 'Google', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' },
  { name: 'Rahul Desai', role: 'Staff Engineer', company: 'Microsoft', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop' },
  { name: 'Priya Patel', role: 'Product Manager', company: 'Amazon', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop' },
  { name: 'Vikram Singh', role: 'Engineering Manager', company: 'Apple', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
  { name: 'Neha Gupta', role: 'Frontend Lead', company: 'Adobe', avatar: 'https://images.unsplash.com/photo-1598550874175-4d0ef43ee90d?w=150&h=150&fit=crop' },
  { name: 'Arjun Mehta', role: 'Backend Architect', company: 'Netflix', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' },
  { name: 'Kavita Rao', role: 'ML Engineer', company: 'Meta', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
  { name: 'Siddharth Jain', role: 'Cloud Architect', company: 'AWS', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
];

const MentorCard = ({ mentor }) => (
  <div className="ms-mentor-card">
    <img src={mentor.avatar} alt={mentor.name} className="ms-mc-avatar" />
    <div className="ms-mc-info">
      <h4>{mentor.name}</h4>
      <p>{mentor.role}</p>
      <span className="ms-mc-company">{mentor.company}</span>
    </div>
  </div>
);

const MentorsSection = () => {
  // Duplicate for seamless loop
  const doubledMentors = [...MENTORS, ...MENTORS];

  return (
    <section className="mentors-section section bg-white">
      <div className="container">
        <div className="mentors-card">
          <div className="mentors-bg-pattern"></div>

          {/* ── Top: Two-column hero ── */}
          <div className="ms-hero-grid">
            
            {/* Left: Copy */}
            <div className="ms-top-content">
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
                <div className="ms-stat-text">
                  <span>100+ FAANG Mentors</span>
                  <span className="ms-divider">/</span>
                  <span className="ms-rating">★ 4.9</span>
                </div>
              </div>

              <div className="ms-actions">
                <button className="ms-btn-primary">Start Learning — It's Free</button>
              </div>
            </div>

            {/* Right: Image */}
            <div className="ms-hero-image">
              <img src="/mentors-group.jpg" alt="Our mentors" className="ms-hero-img" />
            </div>

          </div>

          {/* ── Bottom: Auto-scroll Marquee ── */}
          <div className="ms-marquee-wrap">
            <div className="ms-marquee-fade ms-fade-left"></div>
            <div className="ms-marquee-fade ms-fade-right"></div>
            <div className="ms-marquee-track">
              {doubledMentors.map((mentor, i) => (
                <MentorCard key={i} mentor={mentor} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MentorsSection;
