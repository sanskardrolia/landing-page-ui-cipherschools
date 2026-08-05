import React from 'react';
import { Users, Code2, Target, Zap, Briefcase } from 'lucide-react';
import './ImageGallery.css';

const ImageGallery = () => {
  return (
    <section className="image-gallery-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="gallery-header text-center">
          <h1 className="section-title">Learn Together. Build Together.</h1>
          <p className="section-subtitle text-muted">
            Join a network of passionate learners, build projects together, participate in hackathons, and attend exclusive live workshops and networking sessions.
          </p>
          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <button className="start-free-cta-btn">Join Community for FREE</button>
          </div>
        </div>
        
        {/* ── Community Grid Layout ── */}
        <div className="community-flex-layout">
          
          {/* ── LEFT COLUMN ── */}
          <div className="community-col-left">
            
            {/* Card 1: Learner Community (Tall) */}
            <div className="community-card card-learner-community">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
                alt="Learner Community" 
                className="community-card-img" 
              />
              <div className="card-dark-overlay"></div>
              <div className="card-glass-icon">
                <Users size={18} />
              </div>
              <h3 className="card-bottom-title">Learner Community</h3>
            </div>

            {/* Card 2: Live/Offline Sessions (Wide) */}
            <div className="community-card card-live-sessions">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop" 
                alt="Live/Offline Sessions" 
                className="community-card-img" 
              />
              <div className="card-dark-overlay"></div>
              <div className="card-glass-icon">
                <Briefcase size={18} />
              </div>
              <h3 className="card-bottom-title">Live/Offline Sessions</h3>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="community-col-right">
            
            {/* Card 3: Events & Networking (Top Wide) */}
            <div className="community-card card-events-networking">
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop" 
                alt="Events & Networking" 
                className="community-card-img" 
              />
              <div className="card-dark-overlay"></div>
              <div className="card-glass-icon">
                <Code2 size={18} />
              </div>
              <h3 className="card-bottom-title">Events & Networking</h3>
            </div>

            {/* Bottom Row of Right Column */}
            <div className="community-subrow-right">
              
              {/* Card 4: Hackathons & Competitions */}
              <div className="community-card card-hackathons">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop" 
                  alt="Hackathons & Competitions" 
                  className="community-card-img" 
                />
                <div className="card-dark-overlay"></div>
                <div className="card-glass-icon">
                  <Target size={18} />
                </div>
                <h3 className="card-bottom-title">Hackathons & Competitions</h3>
              </div>

              {/* Card 5: Ideation */}
              <div className="community-card card-ideation">
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop" 
                  alt="Ideation" 
                  className="community-card-img" 
                />
                <div className="card-dark-overlay"></div>
                <div className="card-glass-icon">
                  <Zap size={18} />
                </div>
                <h3 className="card-bottom-title">Ideation</h3>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ImageGallery;
