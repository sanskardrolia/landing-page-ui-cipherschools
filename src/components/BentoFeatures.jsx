import React from 'react';
import { Activity, Share2, MessageCircle, FileEdit, Link as LinkIcon, ExternalLink, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import './BentoFeatures.css';

const BentoFeatures = () => {
  // Generate random heatmap data
  const heatmapData = Array.from({ length: 84 }, () => Math.floor(Math.random() * 5));

  return (
    <section className="bento-section section">
      <div className="container relative z-10">
        <div className="section-header text-center animate-fade-in" style={{marginBottom: '4rem'}}>
          <div className="screenshot-tag">Features</div>
          <h2 className="section-title" style={{fontSize: '2.5rem', fontWeight: '700', color: '#111', maxWidth: '600px', margin: '0 auto 1rem'}}>
            Beyond the Ecosystem. Built for Growth.
          </h2>
        </div>

        <div className="bento-grid">
          
          {/* Feature 1: Heatmap */}
          <div className="bento-card">
            <div className="bento-mockup-wrap">
              <div className="bento-mockup heatmap-mockup">
                <div className="heatmap-header">
                  <div className="heatmap-stats">
                    <span className="stat-bold">428</span> contributions
                  </div>
                </div>
                <div className="heatmap-grid-wrapper">
                  <div className="heatmap-grid">
                    {heatmapData.map((level, i) => (
                      <div key={i} className={`heatmap-cell level-${level}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bento-content">
              <h3>Track your learning progress</h3>
              <p>Build your streak and track your consistency with our GitHub-style heatmap. Stay motivated every day.</p>
              <button className="bento-cta-btn">Start for FREE - Sign up now</button>
            </div>
          </div>

          {/* Feature 2: Portfolio */}
          <div className="bento-card">
            <div className="bento-mockup-wrap">
              <div className="bento-mockup portfolio-mockup">
                <div className="portfolio-card">
                  <div className="port-header">
                    <div className="port-avatar"></div>
                    <div className="port-actions">
                      <div className="port-btn"><LinkIcon size={12} /></div>
                    </div>
                  </div>
                  <div className="port-info">
                    <div className="port-name">Alex Developer</div>
                    <div className="port-title">Full Stack Engineer</div>
                    <div className="port-meta">
                      <span><CheckCircle2 size={10} className="text-primary" /> Verified</span>
                    </div>
                  </div>
                  <div className="port-stats">
                    <div className="p-stat"><strong>15</strong><span>Projects</span></div>
                    <div className="p-stat"><strong>4</strong><span>Certs</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bento-content">
              <h3>Share your portfolio</h3>
              <p>Share your public profile and showcase your achievements to the world. Stand out to recruiters.</p>
              <button className="bento-cta-btn">Start for FREE - Sign up now</button>
            </div>
          </div>

          {/* Feature 3: WhatsApp Community */}
          <div className="bento-card">
            <div className="bento-mockup-wrap">
              <div className="bento-mockup whatsapp-mockup">
                <div className="wa-header">
                  <div className="wa-avatar-group">
                    <div className="wa-avatar a1"></div>
                    <div className="wa-avatar a2"></div>
                    <div className="wa-avatar a3"></div>
                  </div>
                  <div className="wa-title-wrap">
                    <div className="wa-title">CipherSchools General</div>
                    <div className="wa-sub">2,451 members</div>
                  </div>
                </div>
                <div className="wa-chat">
                  <div className="wa-bubble received">
                    <div className="wa-sender">Sarah</div>
                    Anyone up for pair programming? 🚀
                  </div>
                  <div className="wa-bubble sent">
                    Absolutely! Let's do it.
                  </div>
                </div>
              </div>
            </div>
            <div className="bento-content">
              <h3>WhatsApp Community 💬🎓</h3>
              <p>Where learning meets like-minded peers. Connect, collaborate, and stay updated.</p>
              <button className="bento-cta-btn">Start for FREE - Sign up now</button>
            </div>
          </div>

          {/* Feature 4: Effective Notes */}
          <div className="bento-card">
            <div className="bento-mockup-wrap">
              <div className="bento-mockup notion-mockup">
                <div className="notion-sidebar">
                  <div className="n-item active">React Hooks</div>
                  <div className="n-item">System Design</div>
                </div>
                <div className="notion-content-area">
                  <div className="n-title">React Hooks</div>
                  <div className="n-block heading">useEffect</div>
                  <div className="n-block text">The dependency array controls when the effect runs.</div>
                  <div className="n-block list">
                    <ul>
                      <li>Empty array <code>[]</code></li>
                      <li>No array</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bento-content">
              <h3>Take Effective Notes ✍🏻</h3>
              <p>Enhance your learning experience. Your personalized study companion aiding retention.</p>
              <button className="bento-cta-btn">Start for FREE - Sign up now</button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;
