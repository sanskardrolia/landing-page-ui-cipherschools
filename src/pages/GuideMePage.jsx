import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Compass, 
  Binary, 
  Globe, 
  Cpu, 
  Network, 
  GitBranch, 
  Code2, 
  Database 
} from 'lucide-react';
import './GuideMePage.css';

const CompanyIcons = {
  Google: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" className="company-svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  ),
  Amazon: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" className="company-svg">
      <path fill="#FF9900" d="M13.96 12.33c-.08-.6-.35-1.07-.82-1.42s-1.12-.53-1.96-.53c-.63 0-1.22.12-1.77.36-.55.24-.96.59-1.23 1.05l1.32.9c.14-.24.34-.43.6-.57.26-.14.54-.21.84-.21.43 0 .76.1.98.29.22.19.33.45.33.78v.37c-.37.04-.84.09-1.41.15s-1.1.18-1.59.36c-.49.18-.88.44-1.17.78-.29.34-.44.78-.44 1.32 0 .54.18.98.54 1.32.36.34.84.51 1.44.51.53 0 1-.12 1.41-.36.41-.24.73-.57.96-1.01v1.17h1.67V12.33zm-1.84 2.82c-.2.32-.47.56-.8.72-.33.16-.69.24-1.08.24-.34 0-.62-.09-.84-.27-.22-.18-.33-.42-.33-.72 0-.35.14-.64.42-.87.28-.23.75-.41 1.41-.54.66-.13 1.15-.22 1.47-.27v.29c0 .54-.08.99-.25 1.42z"/>
      <path fill="#FF9900" d="M19.16 16.73c-2.8 2.06-6.87 3.15-10.37 3.15-4.89 0-9.3-1.83-12.63-4.9.26.24.8.46 1.32.46 2.94 0 7.37-1.62 9.94-3.15.22-.13.46.12.26.31-1.08.98-3.08 2.29-6.3 2.29-1.03 0-2.02-.15-2.92-.47 3.01 2.37 6.87 3.79 11.08 3.79 3.16 0 6.64-.86 9.42-2.61.34-.21.57.17.2.13z"/>
    </svg>
  ),
  Uber: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" className="company-svg">
      <rect width="24" height="24" rx="4" fill="#000000"/>
      <path fill="#FFFFFF" d="M7 8h2.6v5.2c0 .9.7 1.6 1.6 1.6s1.6-.7 1.6-1.6V8h2.6v5.2c0 2.3-1.9 4.2-4.2 4.2s-4.2-1.9-4.2-4.2V8z"/>
    </svg>
  ),
  Microsoft: () => (
    <svg width="12" height="12" viewBox="0 0 23 23" className="company-svg">
      <path fill="#f35325" d="M1 1h10v10H1z"/>
      <path fill="#81bc06" d="M12 1h10v10H12z"/>
      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
      <path fill="#ffba08" d="M12 12h10v10H12z"/>
    </svg>
  ),
  TCS: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" className="company-svg">
      <rect width="24" height="24" rx="4" fill="#002D62"/>
      <text x="12" y="16" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">TCS</text>
    </svg>
  ),
  Infosys: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" className="company-svg">
      <rect width="24" height="24" rx="4" fill="#007CC3"/>
      <text x="12" y="17" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="'Trebuchet MS', sans-serif">i</text>
    </svg>
  ),
  Accenture: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" className="company-svg">
      <rect width="24" height="24" rx="4" fill="#A100FF"/>
      <path fill="#FFFFFF" d="M8 6l7 6-7 6V14l3.5-2-3.5-2V6z"/>
    </svg>
  ),
  Wipro: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" className="company-svg">
      <rect width="24" height="24" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1"/>
      <circle cx="8" cy="8" r="3" fill="#E81123"/>
      <circle cx="16" cy="8" r="3" fill="#FFB900"/>
      <circle cx="8" cy="16" r="3" fill="#008272"/>
      <circle cx="16" cy="16" r="3" fill="#0078D7"/>
    </svg>
  )
};

const GuideMePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartRoadmap = (track) => {
    navigate('/courses');
  };

  return (
    <div className="guide-me-page-root">
      <div className="guide-page-container">
        
        {/* Clean, Lightweight Header */}
        <div className="guide-compact-header">
          <div className="guide-badge-pill">
            <Compass size={13} className="text-orange-500" />
            <span>CAREER PATHWAY COMPASS</span>
          </div>
          <h1 className="guide-headline">
            Choose Your <span className="headline-gradient">Learning Path</span>
          </h1>
          <p className="guide-subtext">
            Compare target packages, timeline, and core milestones at a glance.
          </p>
        </div>

        {/* 2 Lightweight Infographic Cards */}
        <div className="guide-compact-grid">
          
          {/* PRODUCT TRACK */}
          <div className="compact-path-card product-border">
            <div className="card-top-row">
              <div className="card-tags-left">
                <span className="compact-category product-cat">TIER-1 / PRODUCT</span>
                <span className="compact-free-badge">
                  <span className="free-live-dot"></span>
                  FREE
                </span>
              </div>
              <span className="compact-ctc-badge product-ctc">₹18 - 45+ LPA</span>
            </div>

            <h2 className="compact-card-title">Product Companies</h2>
            <p className="compact-card-tagline">FAANG, high-growth startups & global tech firms</p>

            {/* Top Recruiters Row */}
            <div className="compact-recruiters-row">
              <span className="recruiters-row-label">Top Recruiters</span>
              <div className="company-chips-row">
                <div className="company-logo-chip" title="Google">
                  <CompanyIcons.Google />
                  <span className="company-chip-name">Google</span>
                </div>
                <div className="company-logo-chip" title="Amazon">
                  <CompanyIcons.Amazon />
                  <span className="company-chip-name">Amazon</span>
                </div>
                <div className="company-logo-chip" title="Uber">
                  <CompanyIcons.Uber />
                  <span className="company-chip-name">Uber</span>
                </div>
                <div className="company-logo-chip" title="Microsoft">
                  <CompanyIcons.Microsoft />
                  <span className="company-chip-name">Microsoft</span>
                </div>
              </div>
            </div>

            {/* Core Curriculum Roadmap Grid */}
            <div className="compact-steps-flow">
              <div className="flow-header-row">
                <span className="flow-label">CURRICULUM ROADMAP</span>
                <span className="flow-modules-count orange-count">5 Modules</span>
              </div>
              <div className="roadmap-modules-grid">
                <div className="module-grid-card">
                  <span className="module-step-badge orange-badge">01</span>
                  <Binary size={14} className="module-topic-icon orange-icon" />
                  <span className="module-name">DSA</span>
                </div>
                <div className="module-grid-card">
                  <span className="module-step-badge orange-badge">02</span>
                  <Globe size={14} className="module-topic-icon orange-icon" />
                  <span className="module-name">Development</span>
                </div>
                <div className="module-grid-card">
                  <span className="module-step-badge orange-badge">03</span>
                  <Cpu size={14} className="module-topic-icon orange-icon" />
                  <span className="module-name">System Design</span>
                </div>
                <div className="module-grid-card">
                  <span className="module-step-badge orange-badge">04</span>
                  <Network size={14} className="module-topic-icon orange-icon" />
                  <span className="module-name">OS & Networking</span>
                </div>
                <div className="module-grid-card module-card-full">
                  <span className="module-step-badge orange-badge">05</span>
                  <GitBranch size={14} className="module-topic-icon orange-icon" />
                  <span className="module-name">Version Control</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button 
              type="button" 
              className="compact-cta-btn product-btn"
              onClick={() => handleStartRoadmap('product')}
            >
              <span>Enrol For Free</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* SERVICE TRACK */}
          <div className="compact-path-card service-border">
            <div className="card-top-row">
              <div className="card-tags-left">
                <span className="compact-category service-cat">IT SERVICES / MNCS</span>
                <span className="compact-free-badge">
                  <span className="free-live-dot"></span>
                  FREE
                </span>
              </div>
              <span className="compact-ctc-badge service-ctc">₹4.5 - 9.5 LPA</span>
            </div>

            <h2 className="compact-card-title">Service Companies</h2>
            <p className="compact-card-tagline">TCS, Infosys, Accenture, Wipro & Consultancies</p>

            {/* Top Recruiters Row */}
            <div className="compact-recruiters-row">
              <span className="recruiters-row-label">Top Recruiters</span>
              <div className="company-chips-row">
                <div className="company-logo-chip" title="TCS">
                  <CompanyIcons.TCS />
                  <span className="company-chip-name">TCS</span>
                </div>
                <div className="company-logo-chip" title="Infosys">
                  <CompanyIcons.Infosys />
                  <span className="company-chip-name">Infosys</span>
                </div>
                <div className="company-logo-chip" title="Accenture">
                  <CompanyIcons.Accenture />
                  <span className="company-chip-name">Accenture</span>
                </div>
                <div className="company-logo-chip" title="Wipro">
                  <CompanyIcons.Wipro />
                  <span className="company-chip-name">Wipro</span>
                </div>
              </div>
            </div>

            {/* Core Curriculum Roadmap Grid */}
            <div className="compact-steps-flow">
              <div className="flow-header-row">
                <span className="flow-label">CURRICULUM ROADMAP</span>
                <span className="flow-modules-count blue-count">3 Modules</span>
              </div>
              <div className="roadmap-modules-grid">
                <div className="module-grid-card">
                  <span className="module-step-badge blue-badge">01</span>
                  <Code2 size={14} className="module-topic-icon blue-icon" />
                  <span className="module-name">Programming</span>
                </div>
                <div className="module-grid-card">
                  <span className="module-step-badge blue-badge">02</span>
                  <Database size={14} className="module-topic-icon blue-icon" />
                  <span className="module-name">DBMS</span>
                </div>
                <div className="module-grid-card module-card-full">
                  <span className="module-step-badge blue-badge">03</span>
                  <Network size={14} className="module-topic-icon blue-icon" />
                  <span className="module-name">OS & Networking</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button 
              type="button" 
              className="compact-cta-btn service-btn"
              onClick={() => handleStartRoadmap('service')}
            >
              <span>Enrol For Free</span>
              <ArrowRight size={15} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GuideMePage;
