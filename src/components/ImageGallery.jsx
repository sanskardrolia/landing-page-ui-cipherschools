import React from 'react';
import { Users, Code2, Target, Zap, Briefcase } from 'lucide-react';
import './ImageGallery.css';

const ImageGallery = () => {
  return (
    <section className="image-gallery-section">
      <div className="container">
        <div className="gallery-header text-center">
          <h2 className="section-title">Community at CipherSchools</h2>
          <p className="section-subtitle text-muted" style={{ fontSize: '0.75rem', fontWeight: 300 }}>A glimpse into our vibrant community of learners and builders.</p>
        </div>
        
        <div className="gallery-bento-grid">
          {/* Main Large Image */}
          <div className="gallery-item large">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" alt="Students collaborating" />
            <div className="gallery-overlay">
              <div className="gallery-icon" style={{ marginBottom: 'auto' }}><Users size={24} /></div>
              <div className="gallery-content">
                <h4>Collaborative Learning</h4>
                <p>Grow together with peers.</p>
              </div>
            </div>
          </div>
          
          {/* Top Right Wide Image */}
          <div className="gallery-item wide">
            <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop" alt="Coding on laptop" />
            <div className="gallery-overlay">
              <div className="gallery-icon" style={{ marginBottom: 'auto' }}><Code2 size={20} /></div>
              <div className="gallery-content">
                <h4>Build Products</h4>
                <p>Turn ideas into reality.</p>
              </div>
            </div>
          </div>
          
          {/* Bottom Right Small 1 */}
          <div className="gallery-item small">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop" alt="Team meeting" />
            <div className="gallery-overlay">
              <div className="gallery-icon" style={{ marginBottom: 'auto' }}><Target size={20} /></div>
              <div className="gallery-content">
                <h4>Mentorship</h4>
                <p>Learn from the best.</p>
              </div>
            </div>
          </div>
          
          {/* Bottom Right Small 2 */}
          <div className="gallery-item small">
            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop" alt="Whiteboard session" />
            <div className="gallery-overlay">
              <div className="gallery-icon" style={{ marginBottom: 'auto' }}><Zap size={20} /></div>
              <div className="gallery-content">
                <h4>Ideation</h4>
                <p>Solve complex problems.</p>
              </div>
            </div>
          </div>
          
          {/* Bottom Wide Image */}
          <div className="gallery-item wide">
            <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop" alt="Clean desk setup" />
            <div className="gallery-overlay">
              <div className="gallery-icon" style={{ marginBottom: 'auto' }}><Briefcase size={20} /></div>
              <div className="gallery-content">
                <h4>Deep Work</h4>
                <p>Master the fundamentals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
