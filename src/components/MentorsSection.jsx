import React from 'react';
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

  // Column 1 Track Items (Only Mentor Photo Cards)
  const col1Items = [
    MENTOR_PHOTOS[0],
    MENTOR_PHOTOS[1],
    MENTOR_PHOTOS[2],
    MENTOR_PHOTOS[3],
    MENTOR_PHOTOS[4],
  ];

  // Column 2 Track Items (Only Mentor Photo Cards)
  const col2Items = [
    MENTOR_PHOTOS[5],
    MENTOR_PHOTOS[6],
    MENTOR_PHOTOS[7],
    MENTOR_PHOTOS[0],
    MENTOR_PHOTOS[2],
  ];

  // Column 3 Track Items (Only Mentor Photo Cards)
  const col3Items = [
    MENTOR_PHOTOS[2],
    MENTOR_PHOTOS[3],
    MENTOR_PHOTOS[4],
    MENTOR_PHOTOS[1],
    MENTOR_PHOTOS[5],
  ];

  return (
    <section className="mentors-section section">
      <div className="container">
        <div className="mentors-split-layout">
          
          {/* ── Left Half: Text & CTA ── */}
          <div className="mentors-left-col">
            
            <h2 className="mentors-headline">
              Learn From Industry Professionals
            </h2>
            
            <p className="mentors-subheadline">
              Get guided by top engineers and leaders from Google, Meta, Netflix, Amazon, and Apple who have been in your shoes.
            </p>

            <button className="start-free-cta-btn">
              Start Learning for FREE
            </button>

          </div>

          {/* ── Right Half: Auto-Scrolling Vertical Container Box ── */}
          <div className="mentors-right-col">
            <div className="vertical-scroll-container">
              <div className="scroll-v-fade top-fade"></div>
              <div className="scroll-v-fade bottom-fade"></div>

              <div className="vertical-grid-tracks">
                
                {/* Track 1: Scroll UP */}
                <div className="v-track track-up">
                  {[...col1Items, ...col1Items].map((mentor, index) => (
                    <div className="track-item-wrapper" key={`col1-${index}`}>
                      <div className="mentor-photo-card">
                        <img src={mentor.avatar} alt={mentor.name} className="mentor-img" />
                        <div className="company-badge-icon">
                          <img src={mentor.logo} alt={mentor.company} />
                        </div>
                        <div className="mentor-overlay-info">
                          <h4 className="mentor-overlay-name">{mentor.name}</h4>
                          <p className="mentor-overlay-role">{mentor.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Track 2: Scroll DOWN */}
                <div className="v-track track-down">
                  {[...col2Items, ...col2Items].map((mentor, index) => (
                    <div className="track-item-wrapper" key={`col2-${index}`}>
                      <div className="mentor-photo-card">
                        <img src={mentor.avatar} alt={mentor.name} className="mentor-img" />
                        <div className="company-badge-icon">
                          <img src={mentor.logo} alt={mentor.company} />
                        </div>
                        <div className="mentor-overlay-info">
                          <h4 className="mentor-overlay-name">{mentor.name}</h4>
                          <p className="mentor-overlay-role">{mentor.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Track 3: Scroll UP */}
                <div className="v-track track-up">
                  {[...col3Items, ...col3Items].map((mentor, index) => (
                    <div className="track-item-wrapper" key={`col3-${index}`}>
                      <div className="mentor-photo-card">
                        <img src={mentor.avatar} alt={mentor.name} className="mentor-img" />
                        <div className="company-badge-icon">
                          <img src={mentor.logo} alt={mentor.company} />
                        </div>
                        <div className="mentor-overlay-info">
                          <h4 className="mentor-overlay-name">{mentor.name}</h4>
                          <p className="mentor-overlay-role">{mentor.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MentorsSection;
