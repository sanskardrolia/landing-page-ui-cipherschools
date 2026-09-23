import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, CheckCircle2, 
  BookOpen, Target, Award, Code2, Cpu, Zap 
} from 'lucide-react';
import './GuideMePage.css';

/* ── Custom High-Fidelity Tech Badges (Light-Adapted) ── */

// 1. C++ Tech Badge
const CppLogo = () => (
  <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" fill="#00599C" stroke="rgba(0,89,156,0.15)" strokeWidth="1.5" />
    <path d="M19 13.5C15.4 13.5 12.5 16.4 12.5 20C12.5 23.6 15.4 26.5 19 26.5C21.2 26.5 23.1 25.4 24.3 23.7L21.8 22.3C21.2 23.1 20.2 23.6 19 23.6C17 23.6 15.4 22 15.4 20C15.4 18 17 16.4 19 16.4C20.2 16.4 21.2 16.9 21.8 17.7L24.3 16.3C23.1 14.6 21.2 13.5 19 13.5Z" fill="white" />
    <path d="M26 18.5H27.2V17H28.2V18.5H29.5V19.5H28.2V21H27.2V19.5H26V18.5Z" fill="#00D8FF" />
    <path d="M30.5 18.5H31.7V17H32.7V18.5H34V19.5H32.7V21H31.7V19.5H30.5V18.5Z" fill="#00D8FF" />
  </svg>
);

// 2. Python Tech Badge
const PythonLogo = () => (
  <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#F8FAFC" />
    <path d="M20 9C15.5 9 15.8 11 15.8 11L15.8 13.2H20.2V14.5H13.6C11.3 14.5 9.5 16.2 9.5 18.9C9.5 22 11.5 22.2 11.5 22.2H13.2V20.2C13.2 17.9 15.2 17.9 15.2 17.9H20.2C22.2 17.9 22.5 16.1 22.5 16.1V11.2C22.5 11.2 22.6 9 20 9ZM17.6 10.7C18.2 10.7 18.7 11.2 18.7 11.8C18.7 12.4 18.2 12.9 17.6 12.9C17 12.9 16.5 12.4 16.5 11.8C16.5 11.2 17 10.7 17.6 10.7Z" fill="#3776AB" />
    <path d="M20 31C24.5 31 24.2 29 24.2 29L24.2 26.8H19.8V25.5H26.4C28.7 25.5 30.5 23.8 30.5 21.1C30.5 18 28.5 17.8 28.5 17.8H26.8V19.8C26.8 22.1 24.8 22.1 24.8 22.1H19.8C17.8 22.1 17.5 23.9 17.5 23.9V28.8C17.5 28.8 17.4 31 20 31ZM22.4 29.3C21.8 29.3 21.3 28.8 21.3 28.2C21.3 27.6 21.8 27.1 22.4 27.1C23 27.1 23.5 27.6 23.5 28.2C23.5 28.8 23 29.3 22.4 29.3Z" fill="#F59E0B" />
  </svg>
);

// 3. React Tech Badge
const ReactLogo = () => (
  <svg width="40" height="40" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="21" cy="21" r="3.2" fill="#0284C7" />
    <g stroke="#0284C7" strokeWidth="1.8" fill="none">
      <ellipse cx="21" cy="21" rx="15" ry="5.8" />
      <ellipse cx="21" cy="21" rx="15" ry="5.8" transform="rotate(60 21 21)" />
      <ellipse cx="21" cy="21" rx="15" ry="5.8" transform="rotate(120 21 21)" />
    </g>
  </svg>
);

// 4. Java Tech Badge
const JavaLogo = () => (
  <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#FFF7ED" />
    <path d="M22 10C24 12 21 14 23 16" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 11C19 13 16 15 18 17" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
    <path d="M13 19H27C27 19 28 25 20 26C12 25 13 19 13 19Z" fill="#0284C7" />
    <path d="M27 20C28.5 20 30 21.5 30 23C30 24.5 28.5 25.5 27 25.5" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M11 28C16 30 24 30 29 28" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ── Custom Module Icons for Pathway Cards ── */

// 1. Programming: </>
const ProgrammingIcon = () => (
  <svg width="38" height="38" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="34" rx="10" fill="#EEF2FF" />
    <path d="M13.5 13L9.5 17L13.5 21" stroke="#4F46E5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.5 13L24.5 17L20.5 21" stroke="#4F46E5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 11.5L15.5 22.5" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 2. DBMS: Database Cylinder
const DbmsIcon = () => (
  <svg width="38" height="38" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="34" rx="10" fill="#E0F2FE" />
    <ellipse cx="17" cy="11.5" rx="7.5" ry="3" fill="#38BDF8" />
    <path d="M9.5 11.5V17C9.5 18.7 12.8 20 17 20C21.2 20 24.5 18.7 24.5 17V11.5" stroke="#0284C7" strokeWidth="2" fill="none" />
    <path d="M9.5 17V22.5C9.5 24.2 12.8 25.5 17 25.5C21.2 25.5 24.5 24.2 24.5 22.5V17" stroke="#0284C7" strokeWidth="2" fill="none" />
  </svg>
);

// 3. OS & Networking: Cloud & Network
const OsNetworkingIcon = () => (
  <svg width="38" height="38" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="34" rx="10" fill="#F0F9FF" />
    <path d="M11 22C9.3 22 8 20.7 8 19C8 17.5 9.1 16.2 10.6 16C11.1 13.7 13.1 12 15.5 12C18.2 12 20.4 14.1 20.5 16.8C21.8 17 22.8 18.1 22.8 19.5C22.8 20.9 21.7 22 20.2 22H11Z" fill="#38BDF8" />
    <path d="M17 19V24M14 24H20" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 4. DSA: Connected Graph Nodes
const DsaIcon = () => (
  <svg width="38" height="38" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="34" rx="10" fill="#FDF2F8" />
    <line x1="12" y1="23" x2="17" y2="13" stroke="#D946EF" strokeWidth="2" />
    <line x1="22" y1="23" x2="17" y2="13" stroke="#D946EF" strokeWidth="2" />
    <line x1="12" y1="23" x2="22" y2="23" stroke="#D946EF" strokeWidth="2" />
    <circle cx="17" cy="13" r="3.2" fill="#EC4899" stroke="#BE185D" strokeWidth="1.5" />
    <circle cx="11" cy="23" r="3.2" fill="#06B6D4" stroke="#0891B2" strokeWidth="1.5" />
    <circle cx="23" cy="23" r="3.2" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1.5" />
  </svg>
);

// 5. Development: Globe & Network
const DevelopmentIcon = () => (
  <svg width="38" height="38" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="34" rx="10" fill="#EFF6FF" />
    <circle cx="17" cy="17" r="7.5" stroke="#2563EB" strokeWidth="1.8" />
    <ellipse cx="17" cy="17" rx="3.5" ry="7.5" stroke="#3B82F6" strokeWidth="1.5" />
    <line x1="9.5" y1="17" x2="24.5" y2="17" stroke="#2563EB" strokeWidth="1.5" />
  </svg>
);

// 6. System Design: Folder & Braces
const SystemDesignIcon = () => (
  <svg width="38" height="38" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="34" rx="10" fill="#FEF3C7" />
    <path d="M9 13C9 11.9 9.9 11 11 11H14.5L16.5 13H23C24.1 13 25 13.9 25 15V23C25 24.1 24.1 25 23 25H11C9.9 25 9 24.1 9 23V13Z" fill="#F59E0B" />
    <path d="M15 17C14.5 17.5 14.5 18 14 18.5C14.5 19 14.5 19.5 15 20" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M19 17C19.5 17.5 19.5 18 20 18.5C19.5 19 19.5 19.5 19 20" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// 7. Version Control: Git Branch Diamond
const VersionControlIcon = () => (
  <svg width="38" height="38" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="34" rx="10" fill="#FFF1F2" />
    <rect x="17" y="7.5" width="13" height="13" rx="2.5" transform="rotate(45 17 7.5)" fill="#EF4444" />
    <circle cx="17" cy="14" r="1.6" fill="white" />
    <circle cx="17" cy="22" r="1.6" fill="white" />
    <circle cx="21" cy="18" r="1.6" fill="white" />
    <path d="M17 15.6V20.4M17 18C18.2 18 19.4 18 20.2 18" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const GuideMePage = () => {
  const navigate = useNavigate();

  // Scroll to top upon page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToPathways = () => {
    const el = document.getElementById('guide-pathways-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigateToCourse = (track) => {
    navigate('/courses');
  };

  return (
    <div className="guide-me-page-root">
      
      {/* ── Hero Section (Light Background, Adjusted Text Colors) ── */}
      <section className="guide-page-hero">
        <div className="guide-page-container hero-container relative">
          
          {/* Ambient Glow (Soft Orange Tint on Light Canvas) */}
          <div className="guide-light-hero-glow"></div>

          {/* Floating Tech Badges (4 Corners in Elevated Light Cards) */}
          <div className="guide-page-float-badge float-top-left" title="C++">
            <CppLogo />
          </div>
          <div className="guide-page-float-badge float-bottom-left" title="Python">
            <PythonLogo />
          </div>
          <div className="guide-page-float-badge float-top-right" title="React">
            <ReactLogo />
          </div>
          <div className="guide-page-float-badge float-bottom-right" title="Java">
            <JavaLogo />
          </div>

          {/* Hero Content */}
          <div className="guide-page-hero-content animate-fade-in">
            <div className="guide-hero-pill-badge">
              <Sparkles size={14} className="sparkle-accent" />
              <span>CAREER NAVIGATION COMPASS</span>
            </div>

            <h1 className="guide-page-title">
              Let us help you choose your <br />
              <span className="guide-page-title-gradient">Learning Path</span>
            </h1>

            <p className="guide-page-subtitle">
              Whether you're aiming for a <span className="guide-kw-bold">product-based</span> or{' '}
              <span className="guide-kw-bold">service-based</span> company, <br className="hidden-mobile" />
              we've got the perfect learning path for you.
            </p>

            <button className="guide-page-explore-btn" onClick={scrollToPathways}>
              <span>Explore Now</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* ── Two Learning Path Cards Section ── */}
      <section className="guide-pathways-section" id="guide-pathways-section">
        <div className="guide-page-container">
          
          <div className="guide-section-header">
            <h2 className="guide-section-title">Select Your Career Trajectory</h2>
            <p className="guide-section-desc">
              Curated roadmaps designed by industry architects to match campus recruitment standards.
            </p>
          </div>

          <div className="guide-cards-grid-layout">
            
            {/* CARD 1: Service Based Company Learning Path */}
            <div className="guide-card-surface service-track-card">
              <div className="card-top-header">
                <span className="track-badge service-tag">IT SERVICES TRACK</span>
                <h3 className="card-heading">
                  Service Based Company <br />
                  <span>Learning Path</span>
                </h3>
                <p className="card-summary">
                  Kickstart your career in IT services & consulting with a strong foundation in core software engineering principles.
                </p>
              </div>

              {/* Modules Row (3 Modules) */}
              <div className="card-modules-container">
                <span className="modules-label">CORE CURRICULUM MODULES</span>
                <div className="modules-pill-row">
                  {/* Programming */}
                  <div className="module-chip">
                    <div className="chip-icon">
                      <ProgrammingIcon />
                    </div>
                    <span className="chip-title">Programming</span>
                  </div>

                  {/* DBMS */}
                  <div className="module-chip">
                    <div className="chip-icon">
                      <DbmsIcon />
                    </div>
                    <span className="chip-title">DBMS</span>
                  </div>

                  {/* OS & Networking */}
                  <div className="module-chip">
                    <div className="chip-icon">
                      <OsNetworkingIcon />
                    </div>
                    <span className="chip-title">OS & Networking</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="card-bottom-action">
                <button 
                  className="card-cta-btn" 
                  onClick={() => handleNavigateToCourse('service')}
                >
                  <span>Go to Course</span>
                  <ArrowRight size={15} />
                </button>
                <div className="card-roles-ribbon">
                  <CheckCircle2 size={14} className="green-check" />
                  <span>Target Roles: IT Consultant, Analyst, Support Engineer & more</span>
                </div>
              </div>
            </div>

            {/* CARD 2: Product Based Company Learning Path */}
            <div className="guide-card-surface product-track-card">
              <div className="card-top-header">
                <span className="track-badge product-tag">HIGH IMPACT TRACK</span>
                <h3 className="card-heading">
                  Product Based Company <br />
                  <span>Learning Path</span>
                </h3>
                <p className="card-summary">
                  Master the skills to build world-class products, scalable backend systems, and crack tier-1 product tech interviews.
                </p>
              </div>

              {/* Modules Row (5 Modules) */}
              <div className="card-modules-container">
                <span className="modules-label">CORE CURRICULUM MODULES</span>
                <div className="modules-pill-row product-pill-row">
                  {/* DSA */}
                  <div className="module-chip">
                    <div className="chip-icon">
                      <DsaIcon />
                    </div>
                    <span className="chip-title">DSA</span>
                  </div>

                  {/* Development */}
                  <div className="module-chip">
                    <div className="chip-icon">
                      <DevelopmentIcon />
                    </div>
                    <span className="chip-title">Development</span>
                  </div>

                  {/* System Design */}
                  <div className="module-chip">
                    <div className="chip-icon">
                      <SystemDesignIcon />
                    </div>
                    <span className="chip-title">System Design</span>
                  </div>

                  {/* OS & Networking */}
                  <div className="module-chip">
                    <div className="chip-icon">
                      <OsNetworkingIcon />
                    </div>
                    <span className="chip-title">OS & Networking</span>
                  </div>

                  {/* Version Control */}
                  <div className="module-chip">
                    <div className="chip-icon">
                      <VersionControlIcon />
                    </div>
                    <span className="chip-title">Version Control</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="card-bottom-action">
                <button 
                  className="card-cta-btn" 
                  onClick={() => handleNavigateToCourse('product')}
                >
                  <span>Go to Course</span>
                  <ArrowRight size={15} />
                </button>
                <div className="card-roles-ribbon">
                  <CheckCircle2 size={14} className="green-check" />
                  <span>Target Roles: Software Engineer, Full Stack Dev, Architect & more</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default GuideMePage;
