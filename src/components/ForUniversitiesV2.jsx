import React, { useEffect } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  BrainCircuit, 
  Lightbulb, 
  Server, 
  Users, 
  Briefcase,
  Trophy,
  Rocket,
  CheckCircle2,
  ChevronRight,
  Plus
} from 'lucide-react';
import './ForUniversitiesV2.css';

const ForUniversitiesV2 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fu-v2-page">
      
      {/* 1. Hero: The World Changed */}
      <section className="fu-v2-hero">
        <div className="fu-v2-container">
          <h1 className="fu-v2-hero-title">
            The Rules of Hiring <br/>
            <span className="fu-text-gradient">Have Changed.</span>
          </h1>
          
          <div className="fu-v2-hero-split">
            <div className="fu-v2-hero-side fu-v2-hero-old">
              <h3>Old Interview</h3>
              <ul className="fu-v2-hero-list">
                <li><CheckCircle2 size={20} /> Data Structures & Algorithms</li>
                <li><CheckCircle2 size={20} /> Basic Coding</li>
                <li><CheckCircle2 size={20} /> High GPA</li>
              </ul>
            </div>
            
            <div className="fu-v2-hero-side fu-v2-hero-new">
              <h3>Modern Interview</h3>
              <ul className="fu-v2-hero-list">
                <li><CheckCircle2 size={20} className="text-primary" /> Data Structures & Algorithms</li>
                <li><CheckCircle2 size={20} className="text-primary" /> AI & Prompt Engineering</li>
                <li><CheckCircle2 size={20} className="text-primary" /> Product Thinking</li>
                <li><CheckCircle2 size={20} className="text-primary" /> System Design</li>
                <li><CheckCircle2 size={20} className="text-primary" /> Collaboration & Communication</li>
                <li><CheckCircle2 size={20} className="text-primary" /> Ownership & Shipping Products</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DSA Isn't Dead */}
      <section className="fu-v2-equation-section">
        <div className="fu-v2-container">
          <h2 className="fu-v2-section-title">DSA Isn't Dead. It's Just Not Enough.</h2>
          <p className="fu-v2-section-subtitle">
            Strong fundamentals are still essential. But fundamentals alone no longer guarantee opportunities.
          </p>
          
          <div className="fu-v2-eq-container">
            <div className="fu-v2-eq-block">DSA</div>
            <div className="fu-v2-eq-op"><Plus size={24} /></div>
            <div className="fu-v2-eq-block">Development</div>
            <div className="fu-v2-eq-op"><Plus size={24} /></div>
            <div className="fu-v2-eq-block">AI</div>
            <div className="fu-v2-eq-op"><Plus size={24} /></div>
            <div className="fu-v2-eq-block">Systems</div>
            <div className="fu-v2-eq-op"><Plus size={24} /></div>
            <div className="fu-v2-eq-block">Communication</div>
            <div className="fu-v2-eq-op"><Plus size={24} /></div>
            <div className="fu-v2-eq-block">Execution</div>
            <div className="fu-v2-eq-op">=</div>
            <div className="fu-v2-eq-result">Modern Engineer</div>
          </div>
        </div>
      </section>

      {/* 3. The Modern Engineering Stack */}
      <section className="fu-v2-stack-section">
        <div className="fu-v2-container">
          <h2 className="fu-v2-section-title">The <span className="fu-text-gradient">Modern</span> Engineering Stack</h2>
          <p className="fu-v2-section-subtitle">What we build on top of your academic foundation.</p>
          
          <div className="fu-v2-stack-container">
            {/* Foundation */}
            <div className="fu-v2-stack-tier">
              <div className="fu-v2-stack-header">
                <Terminal size={24} className="text-primary" />
                <h3>Foundation</h3>
              </div>
              <div className="fu-v2-stack-items">
                <span className="fu-v2-stack-tag">DSA</span>
                <span className="fu-v2-stack-tag">Operating Systems</span>
                <span className="fu-v2-stack-tag">DBMS</span>
                <span className="fu-v2-stack-tag">Networks</span>
              </div>
            </div>

            {/* Build */}
            <div className="fu-v2-stack-tier">
              <div className="fu-v2-stack-header">
                <Briefcase size={24} className="text-primary" />
                <h3>Build</h3>
              </div>
              <div className="fu-v2-stack-items">
                <span className="fu-v2-stack-tag">Full-Stack Development</span>
                <span className="fu-v2-stack-tag">Git / GitHub</span>
                <span className="fu-v2-stack-tag">Testing</span>
                <span className="fu-v2-stack-tag">CI/CD Pipeline</span>
              </div>
            </div>

            {/* AI */}
            <div className="fu-v2-stack-tier">
              <div className="fu-v2-stack-header">
                <BrainCircuit size={24} className="text-primary" />
                <h3>AI Integration</h3>
              </div>
              <div className="fu-v2-stack-items">
                <span className="fu-v2-stack-tag">Cursor</span>
                <span className="fu-v2-stack-tag">GitHub Copilot</span>
                <span className="fu-v2-stack-tag">Claude</span>
                <span className="fu-v2-stack-tag">Prompt Engineering</span>
                <span className="fu-v2-stack-tag">AI Debugging</span>
              </div>
            </div>

            {/* Scale */}
            <div className="fu-v2-stack-tier">
              <div className="fu-v2-stack-header">
                <Server size={24} className="text-primary" />
                <h3>Scale</h3>
              </div>
              <div className="fu-v2-stack-items">
                <span className="fu-v2-stack-tag">System Design</span>
                <span className="fu-v2-stack-tag">Cloud Infrastructure</span>
                <span className="fu-v2-stack-tag">Security</span>
                <span className="fu-v2-stack-tag">Performance Tuning</span>
              </div>
            </div>

            {/* Think */}
            <div className="fu-v2-stack-tier">
              <div className="fu-v2-stack-header">
                <Lightbulb size={24} className="text-primary" />
                <h3>Think & Lead</h3>
              </div>
              <div className="fu-v2-stack-items">
                <span className="fu-v2-stack-tag">Product Thinking</span>
                <span className="fu-v2-stack-tag">Business Logic</span>
                <span className="fu-v2-stack-tag">Communication</span>
                <span className="fu-v2-stack-tag">Ownership</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What Companies Actually Hire */}
      <section className="fu-v2-hire-section">
        <div className="fu-v2-container">
          <h2 className="fu-v2-section-title text-center">What Companies Actually Hire</h2>
          <p className="fu-v2-section-subtitle">The progression of a candidate in the eyes of a modern recruiter.</p>
          
          <div className="fu-v2-hire-grid">
            <div className="fu-v2-hire-card">
              <h4>Average Candidate</h4>
              <p>"I learned technologies."</p>
            </div>
            
            <div className="fu-v2-hire-card">
              <h4>Good Candidate</h4>
              <p>"I built projects."</p>
            </div>
            
            <div className="fu-v2-hire-card">
              <h4>Strong Candidate</h4>
              <p>"I solved problems."</p>
            </div>
            
            <div className="fu-v2-hire-card exceptional">
              <h4>Exceptional Engineer</h4>
              <p>"I solved real problems, used AI effectively, collaborated with teams, and created measurable impact."</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The CipherSchools Difference (Pipeline) */}
      <section className="fu-v2-diff-section">
        <div className="fu-v2-container text-center">
          <h2 className="fu-v2-section-title">The CipherSchools <span className="fu-text-gradient">Difference</span></h2>
          <p className="fu-v2-section-subtitle">
            We don't just prepare students for interviews. We prepare them for engineering careers.
          </p>
          
          <div className="fu-v2-pipeline">
            <div className="fu-v2-pipe-node">Learn</div>
            <div className="fu-v2-pipe-arrow"><ChevronRight size={24} /></div>
            <div className="fu-v2-pipe-node">Practice</div>
            <div className="fu-v2-pipe-arrow"><ChevronRight size={24} /></div>
            <div className="fu-v2-pipe-node highlight">Build</div>
            <div className="fu-v2-pipe-arrow"><ChevronRight size={24} /></div>
            <div className="fu-v2-pipe-node highlight">Ship</div>
            <div className="fu-v2-pipe-arrow"><ChevronRight size={24} /></div>
            <div className="fu-v2-pipe-node">Document</div>
            <div className="fu-v2-pipe-arrow"><ChevronRight size={24} /></div>
            <div className="fu-v2-pipe-node highlight">Collaborate</div>
            <div className="fu-v2-pipe-arrow"><ChevronRight size={24} /></div>
            <div className="fu-v2-pipe-node">Interview</div>
            <div className="fu-v2-pipe-arrow"><ChevronRight size={24} /></div>
            <div className="fu-v2-pipe-node final"><Trophy size={18} /> Get Hired</div>
          </div>
        </div>
      </section>

      {/* 6. Final Section */}
      <section className="fu-v2-final">
        <div className="fu-v2-container">
          <h2 className="fu-v2-final-title">
            Universities create graduates.<br/>
            <span className="fu-text-gradient">CipherSchools helps create engineers companies want to hire.</span>
          </h2>
          <p className="fu-v2-final-subtitle">
            We combine strong computer science fundamentals with AI-native workflows, real-world projects, mentorship, and execution-focused learning.
          </p>
          <button className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.25rem' }}>
            Partner With Us <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </section>
      
    </div>
  );
};

export default ForUniversitiesV2;
