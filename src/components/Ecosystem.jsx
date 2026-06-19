import React, { useState } from 'react';
import { Layers, FileText, Code2, PlayCircle, TerminalSquare, Compass, Map } from 'lucide-react';
import './Ecosystem.css';

const Ecosystem = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const products = [
    { 
      id: 'lms',
      icon: <Layers size={24} />, 
      title: 'LMS', 
      desc: 'Structured learning journeys',
      ctaText: 'Start FREE Learning',
      mockup: (
        <div className="mini-mockup lms-mockup">
          <div className="mockup-header-bar"></div>
          <div className="path-container">
            <div className="path-node completed"></div>
            <div className="path-line active"></div>
            <div className="path-node active"></div>
            <div className="path-line"></div>
            <div className="path-node locked"></div>
          </div>
        </div>
      )
    },
    { 
      id: 'resume',
      icon: <FileText size={24} />, 
      title: 'Resume Builder', 
      desc: 'Create industry-ready resumes',
      ctaText: 'Create Resume',
      mockup: (
        <div className="mini-mockup resume-mockup">
          <div className="res-header">
            <div className="res-avatar"></div>
            <div className="res-lines">
              <div className="res-line short"></div>
              <div className="res-line"></div>
            </div>
          </div>
          <div className="res-body">
            <div className="res-section"></div>
            <div className="res-section"></div>
          </div>
        </div>
      )
    },
    { 
      id: 'compiler',
      icon: <Code2 size={24} />, 
      title: 'Online Compiler', 
      desc: 'Practice directly in browser',
      ctaText: 'Try Compiler',
      mockup: (
        <div className="mini-mockup compiler-mockup">
          <div className="mockup-header-simple">
            <span></span><span></span><span></span>
          </div>
          <div className="code-lines">
            <div className="code-line"><span className="keyword">function</span> <span className="name">solve</span>() {'{'}</div>
            <div className="code-line indented"><span className="keyword">return</span> <span className="string">"Success"</span>;</div>
            <div className="code-line">{'}'}</div>
          </div>
        </div>
      )
    },
    { 
      id: 'video',
      icon: <PlayCircle size={24} />, 
      title: 'Free Video Learning', 
      desc: 'Accessible learning for everyone',
      ctaText: 'Watch Videos',
      mockup: (
        <div className="mini-mockup video-mockup">
          <div className="video-player">
            <div className="play-button-pulse">
              <PlayCircle size={20} fill="white" className="text-primary" />
            </div>
            <div className="video-timeline">
              <div className="timeline-progress"></div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'labs',
      icon: <TerminalSquare size={24} />, 
      title: 'CipherLabs', 
      desc: 'Coding practice platform',
      ctaText: 'Practice Now',
      mockup: (
        <div className="mini-mockup labs-mockup">
          <div className="labs-layout">
            <div className="labs-problem">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
            <div className="labs-editor">
              <div className="run-btn">Run</div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'domains',
      icon: <Compass size={24} />, 
      title: 'Learning Domains', 
      desc: 'DSA, Web Dev, Data Science & more',
      ctaText: 'Explore Domains',
      mockup: (
        <div className="mini-mockup domains-mockup">
          <div className="domain-pill d1">Web</div>
          <div className="domain-pill d2">DSA</div>
          <div className="domain-pill d3">AI</div>
        </div>
      )
    },
    { 
      id: 'paths',
      icon: <Map size={24} />, 
      title: 'Focused Paths', 
      desc: 'Roadmap-based progression',
      ctaText: 'View Roadmaps',
      mockup: (
        <div className="mini-mockup paths-mockup">
          <div className="roadmap-grid">
            <div className="rd-box b1"></div>
            <div className="rd-box b2"></div>
            <div className="rd-box b3"></div>
            <div className="rd-box b4"></div>
          </div>
        </div>
      )
    },
  ];

  return (
    <section id="ecosystem" className="ecosystem section">
      <div className="eco-background-elements">
        <div className="eco-orb orb-1"></div>
        <div className="eco-orb orb-2"></div>
      </div>

      <div className="container relative z-10">
        <div className="section-header text-center animate-fade-in">
          <div className="tag cred-tag">Free For Learners</div>
          <h2 className="section-title text-white">The Complete Learning Ecosystem</h2>
          <p className="section-subtitle cred-subtitle">
            Interact with our suite of powerful tools. Designed for maximum focus and seamless progression.
          </p>
        </div>

        <div className="eco-bento-grid">
          {products.map((item, index) => {
            const isHovered = hoveredCard === index;
            const isDimmed = hoveredCard !== null && !isHovered;

            return (
              <div 
                className={`cred-eco-card card-${item.id} ${isHovered ? 'hovered' : ''} ${isDimmed ? 'dimmed' : ''}`} 
                key={item.id}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                    <div className="card-glass-panel">
                      <div className="eco-mockup-container">
                        {item.mockup}
                      </div>
                      <div className="eco-card-content">
                        <div className="eco-title-wrap">
                          <div className="eco-icon-small">{item.icon}</div>
                          <h3 className="eco-title-text">{item.title}</h3>
                        </div>
                        <p className="eco-desc-text">{item.desc}</p>
                        <div className="eco-cta-wrapper">
                          <span className="eco-sleek-cta">
                            {item.ctaText}
                            <svg className="eco-cta-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                          </span>
                        </div>
                      </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
