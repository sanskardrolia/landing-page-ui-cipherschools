import React from 'react';
import { Code2, Database, Cloud, GitBranch, Terminal, Blocks, ArrowRight } from 'lucide-react';
import './LearningPaths.css';

const LearningPaths = () => {
  return (
    <section className="learning-paths-section section">
      <div className="container relative z-10">
        
        <div className="section-header text-center animate-fade-in">
          <div className="tag cred-tag" style={{background: 'rgba(243,145,46,0.1)', color: 'var(--primary)'}}>Learning Paths</div>
          <h2 className="section-title">A quick guide to pick and start</h2>
          <p className="section-subtitle text-muted">
            Choose a learning path tailored perfectly to your career goals.
          </p>
        </div>

        <div className="lp-grid">
          
          {/* Card 1: Service Based */}
          <div className="lp-card">
            <h3 className="lp-title">Service Based Company<br/>Learning Path</h3>
            <p className="lp-desc">
              Kickstart your career in IT services & consulting with a strong foundation.
            </p>
            
            <div className="lp-badges">
              <div className="lp-badge">
                <div className="lp-badge-icon badge-soft-purple"><Code2 size={24} color="#5A52FF" /></div>
                <span>Programming</span>
              </div>
              <div className="lp-badge">
                <div className="lp-badge-icon badge-soft-blue"><Database size={24} color="#2D7FF9" /></div>
                <span>DBMS</span>
              </div>
              <div className="lp-badge">
                <div className="lp-badge-icon badge-soft-lightblue"><Cloud size={24} color="#72B5FF" /></div>
                <span>OS &<br/>Networking</span>
              </div>
            </div>

            <button className="lp-btn">Go to Course</button>
            <div className="lp-career-row">
              <div className="lp-career-label">Career<br/>Opportunity</div>
              <div className="lp-career-arrow"><ArrowRight size={16} /></div>
              <div className="lp-career-roles">IT Consultant, Analyst, Support Engineer and more.</div>
            </div>
          </div>

          {/* Card 2: Product Based */}
          <div className="lp-card">
            <h3 className="lp-title">Product Based Company<br/>Learning Path</h3>
            <p className="lp-desc">
              Master the skills to build world-class products and crack top tech jobs.
            </p>
            
            <div className="lp-badges">
              <div className="lp-badge">
                <div className="lp-badge-icon badge-soft-pink"><Blocks size={24} color="#D81B60" /></div>
                <span>DSA</span>
              </div>
              <div className="lp-badge">
                <div className="lp-badge-icon badge-soft-cyan"><Terminal size={24} color="#00838F" /></div>
                <span>Development</span>
              </div>
              <div className="lp-badge">
                <div className="lp-badge-icon badge-soft-orange"><Database size={24} color="var(--primary)" /></div>
                <span>System Design</span>
              </div>
              <div className="lp-badge">
                <div className="lp-badge-icon badge-soft-lightblue"><Cloud size={24} color="#2D7FF9" /></div>
                <span>OS &<br/>Networking</span>
              </div>
              <div className="lp-badge">
                <div className="lp-badge-icon badge-soft-red"><GitBranch size={24} color="#D32F2F" /></div>
                <span>Version Control</span>
              </div>
            </div>

            <button className="lp-btn">Go to Course</button>
            <div className="lp-career-row">
              <div className="lp-career-label">Career<br/>Opportunity</div>
              <div className="lp-career-arrow"><ArrowRight size={16} /></div>
              <div className="lp-career-roles">Software Engineer, Product Developer, System Designer and more.</div>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="lp-card lp-card-wide">
            <h3 className="lp-title">More Paths. More Possibilities</h3>
            <p className="lp-desc">
              We'll be expanding with more learning paths shortly. Keep an eye out and continue learning with curiosity.<br/>
              <strong>Team CipherSchools</strong>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LearningPaths;
