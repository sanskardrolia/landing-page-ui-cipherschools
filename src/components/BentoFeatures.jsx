import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import './BentoFeatures.css';

const BentoFeatures = () => {
  const heatmapData = Array.from({ length: 98 }, () => Math.floor(Math.random() * 5));

  return (
    <section className="bento-section section">
      <div className="container relative z-10">
        <div className="section-header text-center animate-fade-in" style={{marginBottom: '4rem'}}>
          <div className="bf-tag">FEATURES</div>
          <h2 className="section-title" style={{fontSize: '2.5rem', fontWeight: '800', color: '#fff', maxWidth: '700px', margin: '0 auto 1rem', letterSpacing: '-1px'}}>
            Lessons That Keeps You Motivated
          </h2>
        </div>

        <div className="bf-grid">
          
          {/* Card 1: Heatmap (Span 2) */}
          <div className="bf-card span-2 bf-wrap">
            <div className="bf-text">
              <h3>Track your Learning Progress 📈</h3>
              <p><mark>Plan and track your learning</mark> progress by keeping track of your programming skills in a detailed contribution graph.</p>
              <a href="#" className="bf-link">Know more <ArrowRight size={14}/></a>
            </div>
            <div className="bf-mock">
              <div className="mock-heatmap">
                <div className="mh-grid">
                  {heatmapData.map((level, i) => (
                    <div key={i} className={`mh-cell l${level}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Rewards (Span 1) */}
          <div className="bf-card bf-wrap">
            <div className="bf-text">
              <h3>Gamified Rewards 🎁</h3>
              <p>Collect points, unlock more learning and climb tiers as you code.</p>
              <a href="#" className="bf-link">Know more <ArrowRight size={14}/></a>
            </div>
            <div className="bf-mock" style={{ alignItems: 'center' }}>
              <div className="mock-rewards">
                <div className="mrew-badge-dashed-ring">
                  <div className="mrew-coin-gold">
                    <span className="coin-c-logo">C</span>
                  </div>
                </div>
                <div className="mrew-stats">
                  <div className="mrew-pts">2,450</div>
                  <div className="mrew-label">CIPHERPOINTS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: AI Mentor (Span 1) */}
          <div className="bf-card bf-wrap">
            <div className="bf-text">
              <h3>AI-Powered Mentor 🤖</h3>
              <p>Stuck on a bug? <mark>Get real-time hints and explanations</mark> from our integrated AI assistant.</p>
              <a href="#" className="bf-link">Know more <ArrowRight size={14}/></a>
            </div>
            <div className="bf-mock">
              <div className="mock-ai">
                <div className="mai-msg user">Why is my loop failing?</div>
                <div className="mai-msg ai">You have an off-by-one error at line 12. Try changing `i &lt;= len` to `i &lt; len`.</div>
                <div className="mai-glow"></div>
              </div>
            </div>
          </div>

          {/* Card 4: WhatsApp Community (Span 2) */}
          <div className="bf-card span-2 bf-wrap">
            <div className="bf-text">
              <h3>Join the WhatsApp Community! 💬🎓</h3>
              <p>Where learning meets like-minded peers. <mark>Connect, Collaborate, and Stay Updated</mark> with thousands of active developers.</p>
              <a href="#" className="bf-link">Know more <ArrowRight size={14}/></a>
            </div>
            <div className="bf-mock">
              <div className="mock-chat">
                <div className="mc-bubble mc-received">
                  <span className="mc-sender">Sarah</span>
                  Anyone up for pair programming tonight? 🚀
                </div>
                <div className="mc-bubble mc-sent">
                  Absolutely, let's build that React app!
                </div>
                <div className="mc-bubble mc-received">
                  <span className="mc-sender">Raj</span>
                  Count me in 🤝
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;
