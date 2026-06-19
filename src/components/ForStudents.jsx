import React, { useState } from 'react';
import { Video, Code, FileText, LayoutTemplate, Layers, CheckCircle2, Users, Trophy } from 'lucide-react';
import './ForStudents.css';

const ForStudents = () => {
  const [activeTab, setActiveTab] = useState(0);

  const ecosystemTabs = [
    {
      id: 'video',
      icon: <Video size={20} />,
      title: 'Premium Cohorts & Video',
      desc: 'Structured learning journeys with industry-grade video curriculums.'
    },
    {
      id: 'compiler',
      icon: <Code size={20} />,
      title: 'Cloud Compiler',
      desc: 'Practice instantly in your browser without any setup overhead.'
    },
    {
      id: 'labs',
      icon: <LayoutTemplate size={20} />,
      title: 'CipherLabs',
      desc: 'Dedicated environments for full-stack project building.'
    },
    {
      id: 'resume',
      icon: <FileText size={20} />,
      title: 'Resume Builder',
      desc: 'Auto-generate ATS-friendly resumes from your project portfolio.'
    }
  ];

  return (
    <section className="student-page-wrapper section">
      <div className="container relative z-10">
        
        {/* 1. Header Block */}
        <div className="stu-header-block text-center animate-fade-in">
          <div className="freemium-badge-large">
            <span className="dot"></span> 100% Free Forever for Students
          </div>
          <h1 className="stu-main-title">
            Go from <span className="text-primary">Learner to Builder</span>
          </h1>
          <p className="stu-main-subtitle text-muted">
            Don't just watch tutorials. Practice, code, build projects, and get placed. We provide the complete ecosystem you need to launch your tech career.
          </p>
          <div className="stu-actions mt-4">
            <button className="btn btn-primary cred-btn">Start Free Learning</button>
            <span className="text-muted text-small d-block mt-2">* No credit card required</span>
          </div>
        </div>

        {/* 2. Interactive Ecosystem Explorer */}
        <div className="eco-explorer-block animate-fade-in" style={{animationDelay: '0.2s'}}>
          <div className="explorer-layout">
            
            {/* Sidebar Tabs */}
            <div className="explorer-sidebar">
              <h3 className="explorer-title">The Student Ecosystem</h3>
              <div className="explorer-tabs">
                {ecosystemTabs.map((tab, index) => (
                  <div 
                    key={tab.id}
                    className={`explorer-tab ${activeTab === index ? 'active' : ''}`}
                    onClick={() => setActiveTab(index)}
                  >
                    <div className="tab-icon">{tab.icon}</div>
                    <div className="tab-content">
                      <h4>{tab.title}</h4>
                      <p>{tab.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Mockup Display */}
            <div className="explorer-display">
              <div className="explorer-glass-panel">
                
                {/* Mockup 1: Video Learning */}
                <div className={`mockup-view ${activeTab === 0 ? 'active' : ''}`}>
                  <div className="video-ui">
                    <div className="vid-header">Advanced React Patterns: Custom Hooks</div>
                    <div className="vid-player">
                      <div className="play-button-large">
                        <div className="play-triangle"></div>
                      </div>
                      <div className="vid-bottom-bar">
                        <div className="vid-progress-bg">
                          <div className="vid-progress-fill" style={{width: '65%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mockup 2: Cloud Compiler */}
                <div className={`mockup-view dark-mode ${activeTab === 1 ? 'active' : ''}`}>
                  <div className="compiler-ui">
                    <div className="mac-header">
                      <div className="mac-dots"><span className="red"></span><span className="yellow"></span><span className="green"></span></div>
                      <div className="mac-title">main.js - CipherSchools Compiler</div>
                    </div>
                    <div className="code-editor">
                      <div className="line-numbers">
                        <span>1</span><span>2</span><span>3</span><span>4</span>
                      </div>
                      <div className="code-content">
                        <div><span className="kw">function</span> <span className="fn">getHired</span>() {'{'}</div>
                        <div className="ind"><span className="kw">const</span> student = <span className="kw">new</span> <span className="cls">CipherStudent</span>();</div>
                        <div className="ind">student.<span className="fn">learn</span>().<span className="fn">practice</span>().<span className="fn">build</span>();</div>
                        <div>{'}'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mockup 3: CipherLabs */}
                <div className={`mockup-view ${activeTab === 2 ? 'active' : ''}`}>
                  <div className="labs-ui">
                    <div className="labs-sidebar">
                      <div className="l-item active">index.html</div>
                      <div className="l-item">styles.css</div>
                      <div className="l-item">app.js</div>
                    </div>
                    <div className="labs-main">
                      <div className="labs-nav">Preview: Portfolio App</div>
                      <div className="labs-preview">
                        <div className="skeleton-nav"></div>
                        <div className="skeleton-hero"></div>
                        <div className="skeleton-grid">
                          <div></div><div></div><div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mockup 4: Resume Builder */}
                <div className={`mockup-view ${activeTab === 3 ? 'active' : ''}`}>
                  <div className="resume-ui">
                    <div className="resume-doc">
                      <div className="res-header">
                        <div className="res-avatar"></div>
                        <div className="res-title-lines">
                          <div className="res-line w-80"></div>
                          <div className="res-line w-50"></div>
                        </div>
                      </div>
                      <div className="res-section">
                        <div className="res-section-title">Experience</div>
                        <div className="res-block"></div>
                        <div className="res-block"></div>
                      </div>
                      <div className="res-section">
                        <div className="res-section-title">Projects</div>
                        <div className="res-block w-90"></div>
                      </div>
                    </div>
                    <div className="resume-sidebar">
                      <div className="res-btn">Generate ATS Resume</div>
                      <div className="res-score">ATS Score: 92%</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* 3. Community Features Bento */}
        <div className="stu-community-bento">
          <div className="stu-bento-card">
            <Users className="text-primary mb-3" size={32} />
            <h3>Community Learning</h3>
            <p className="text-muted">Join thousands of like-minded peers in our active Discord and WhatsApp communities. Collaborate, debug together, and grow.</p>
          </div>
          <div className="stu-bento-card">
            <Layers className="text-primary mb-3" size={32} />
            <h3>Structured Paths</h3>
            <p className="text-muted">Stop guessing what to learn next. Follow our meticulously designed roadmaps tailored for specific tech roles.</p>
          </div>
          <div className="stu-bento-card">
            <Trophy className="text-primary mb-3" size={32} />
            <h3>Projects & Hackathons</h3>
            <p className="text-muted">Put your skills to the test. Participate in exclusive hackathons and build real-world projects that stand out on your resume.</p>
          </div>
        </div>

        {/* 4. Premium Reflection Kanban */}
        <div className="stu-premium-kanban-wrapper mt-5">
          <div className="kanban-header">
            <h3>Explore Premium Upgrades</h3>
            <p>Ready to go beyond? Unlock the tools you need for absolute mastery.</p>
          </div>
          
          <div className="kanban-board">
            
            {/* Column 1 */}
            <div className="kanban-col">
              <div className="k-col-header">
                <span className="k-dot k-dot-blue"></span> Advanced Content
                <span className="k-count">2</span>
              </div>
              <div className="k-card">
                <div className="k-tags"><span className="k-tag k-tag-premium">Premium</span></div>
                <div className="k-card-title">System Design Architecture Course</div>
                <div className="k-card-meta"><Video size={12}/> 40+ hours</div>
              </div>
              <div className="k-card">
                <div className="k-tags"><span className="k-tag k-tag-premium">Premium</span></div>
                <div className="k-card-title">Exclusive Enterprise Projects</div>
                <div className="k-card-meta"><Layers size={12}/> 5 Projects</div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="kanban-col">
              <div className="k-col-header">
                <span className="k-dot k-dot-orange"></span> Premium CipherLabs
                <span className="k-count">2</span>
              </div>
              <div className="k-card">
                <div className="k-tags"><span className="k-tag k-tag-code">Coding</span></div>
                <div className="k-card-title">500+ Advanced Industry Problems</div>
                <div className="k-card-meta"><Code size={12}/> Auto-graded</div>
              </div>
              <div className="k-card">
                <div className="k-tags"><span className="k-tag k-tag-code">Coding</span></div>
                <div className="k-card-title">FAANG Mock Assessments</div>
                <div className="k-card-meta"><Trophy size={12}/> Timed Labs</div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="kanban-col">
              <div className="k-col-header">
                <span className="k-dot k-dot-green"></span> 1-on-1 Guidance
                <span className="k-count">2</span>
              </div>
              <div className="k-card">
                <div className="k-tags"><span className="k-tag k-tag-mentor">Mentorship</span></div>
                <div className="k-card-title">Weekly Resume Reviews</div>
                <div className="k-card-meta"><FileText size={12}/> Personalized</div>
              </div>
              <div className="k-card">
                <div className="k-tags"><span className="k-tag k-tag-mentor">Mentorship</span></div>
                <div className="k-card-title">Direct Industry Mentorship</div>
                <div className="k-card-meta"><Users size={12}/> 1-on-1 calls</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ForStudents;
