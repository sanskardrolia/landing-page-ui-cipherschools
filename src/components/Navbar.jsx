import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Search, Bell, Sun, Moon, User, 
  BookOpen, Code2, Terminal, FileText, Sparkles, 
  GraduationCap, Laptop, CheckCircle2, ArrowRight, 
  ChevronDown, Layers, Target, Compass, Cpu
} from 'lucide-react';
import BookMeetingModal from './BookMeetingModal';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null); // 'students' | 'university' | null
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('welcome');
  const [activeDropdown, setActiveDropdown] = useState(null); // 'students' | 'university' | null
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Track Active Section On Scroll */
  useEffect(() => {
    if (location.pathname === '/courses') return;

    const checkActiveSection = () => {
      const secStudent = document.getElementById('student-section');
      const secUniversity = document.getElementById('university-section');

      if (!secStudent || !secUniversity) return;

      const studentTop = secStudent.getBoundingClientRect().top;
      const uniTop = secUniversity.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (uniTop <= windowHeight * 0.45) {
        setActiveSection('university');
      } else if (studentTop <= windowHeight * 0.55) {
        setActiveSection('student');
      } else {
        setActiveSection('welcome');
      }
    };

    window.addEventListener('scroll', checkActiveSection, { passive: true });
    checkActiveSection(); // Run immediately

    return () => window.removeEventListener('scroll', checkActiveSection);
  }, [location.pathname]);

  const isCoursePage = location.pathname === '/courses';

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    window.dispatchEvent(new CustomEvent('courses-theme-toggle', { detail: { isDark: nextMode } }));
  };

  const handleMouseEnter = (menu) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    if (id === 'university-section') {
      window.isNavigatingToUniversity = true;
      setTimeout(() => { window.isNavigatingToUniversity = false; }, 1600);
    } else {
      window.isNavigatingToUniversity = false;
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /* ── Dedicated Navigation Bar for Course / Explore Page (/courses) ── */
  if (isCoursePage) {
    return (
      <nav className={`navbar navbar-course-page scrolled ${darkMode ? 'courses-nav-dark' : 'courses-nav-light'}`}>
        <div className="container navbar-container cs-exact-header">
          
          {/* Left: Hamburger + Logo + Guide Me */}
          <div className="cs-header-left">
            <button className="cs-menu-hamburger-btn" aria-label="Toggle Navigation">
              <Menu size={20} />
            </button>
            <Link to="/" className="navbar-logo cs-exact-logo" style={{ textDecoration: 'none' }}>
              <span className="cs-c-logo-circle">C</span>
              <span className="logo-text cs-logo-title">Cipher<span className="text-white-bold">Schools</span></span>
            </Link>
            <button className="cs-guide-me-pill">
              Guide Me
            </button>
          </div>

          {/* Center: Search and Learn Input with Right Search Icon */}
          <div className="cs-header-search-wrap desktop-only">
            <input type="text" placeholder="Search and Learn" readOnly />
            <Search size={18} className="cs-nav-search-right-icon" />
          </div>

          {/* Right: Actions (Bell 0, Hey Profile, Coin 0, Moon/Sun) */}
          <div className="cs-header-right-actions">
            
            {/* Notification Bell with 0 Badge */}
            <div className="cs-nav-bell-box" title="Notifications">
              <Bell size={18} />
              <span className="cs-bell-badge">0</span>
            </div>

            {/* Profile User Chip */}
            <div className="cs-nav-user-chip">
              <User size={18} className="cs-user-icon-gray" />
              <span className="cs-user-hey-text">Hey</span>
            </div>

            {/* Cipher Coin Balance Pill */}
            <div className="cs-nav-coin-pill">
              <span className="cs-coin-circle-icon">C</span>
              <span className="cs-coin-val">0</span>
            </div>

            {/* Theme Change Icon */}
            <button 
              className="cs-nav-theme-btn" 
              title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
              onClick={toggleTheme}
            >
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>

          </div>

        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} navbar-theme-notion`}>
        <div className="container navbar-container">
          <div className="navbar-logo-wrap">
            <div className="navbar-logo" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onClick={() => scrollToSection('welcome-section')}>
              <img src="/cipherschools-logo.png" alt="CipherSchools Logo" style={{ height: '26px', width: '26px', objectFit: 'contain' }} />
              <span className="logo-text">Cipher<span className="text-primary">Schools</span></span>
            </div>
          </div>
          
          <div className="navbar-links desktop-only">
            
            {/* ── For Students with Hover Mega Popup ── */}
            <div 
              className="nav-dropdown-item-wrap"
              onMouseEnter={() => handleMouseEnter('students')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                onClick={() => scrollToSection('student-section')} 
                className={`notion-nav-link ${activeSection === 'student' ? 'active' : ''} ${activeDropdown === 'students' ? 'dropdown-open' : ''}`}
              >
                <span>For Students</span>
                <ChevronDown size={13} className={`nav-chevron-icon ${activeDropdown === 'students' ? 'rotated' : ''}`} />
              </button>

              {/* Students Mega Popup Dropdown */}
              {activeDropdown === 'students' && (
                <div 
                  className="nav-mega-dropdown-popup mega-students-popup animate-fade-in"
                  onMouseEnter={() => handleMouseEnter('students')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="nav-mega-header">
                    <span className="nav-mega-category">STUDENT LEARNING ECOSYSTEM</span>
                  </div>

                  {/* 4 Cards Grid */}
                  <div className="nav-mega-grid nav-mega-grid-4">
                    
                    {/* 1. Courses */}
                    <div 
                      className="nav-mega-card card-courses"
                      onClick={() => { setActiveDropdown(null); window.location.href = '/courses'; }}
                    >
                      <div className="nav-card-preview">
                        <div className="nav-card-mini-window">
                          <div className="nav-mini-bar">
                            <span className="nav-mini-dot"></span>
                            <span className="nav-mini-dot"></span>
                            <span className="nav-mini-dot"></span>
                          </div>
                          <div className="nav-mini-code-body">
                            <div className="nav-mini-line line-brand"></div>
                            <div className="nav-mini-line line-neutral"></div>
                            <div className="nav-mini-line line-short"></div>
                          </div>
                        </div>
                        <div className="nav-card-icon-badge">
                          <BookOpen size={16} />
                        </div>
                      </div>
                      <div className="nav-card-content">
                        <h4 className="nav-card-title">Courses</h4>
                        <p className="nav-card-desc">Industry-vetted tracks in Web Dev, DSA, AI & Cloud.</p>
                      </div>
                    </div>

                    {/* 2. CipherLabs */}
                    <div 
                      className="nav-mega-card card-cipherlabs"
                      onClick={() => scrollToSection('ecosystem')}
                    >
                      <div className="nav-card-preview">
                        <div className="nav-card-mini-window">
                          <div className="nav-mini-bar">
                            <span className="nav-mini-dot"></span>
                            <span className="nav-mini-dot"></span>
                            <span className="nav-mini-dot"></span>
                          </div>
                          <div className="nav-mini-terminal-body">
                            <span className="nav-mini-term-prompt">practice as you go</span>
                            <div className="nav-mini-term-cursor"></div>
                          </div>
                        </div>
                        <div className="nav-card-icon-badge">
                          <Cpu size={16} />
                        </div>
                      </div>
                      <div className="nav-card-content">
                        <h4 className="nav-card-title">CipherLabs</h4>
                        <p className="nav-card-desc">Instant in-browser coding labs & interactive sandboxes.</p>
                      </div>
                    </div>

                    {/* 3. Resume Builder */}
                    <div 
                      className="nav-mega-card card-resumebuilder"
                      onClick={() => scrollToSection('student-section')}
                    >
                      <div className="nav-card-preview">
                        <div className="nav-card-mini-window">
                          <div className="nav-mini-doc-body">
                            <div className="nav-mini-doc-header"></div>
                            <div className="nav-mini-doc-row"></div>
                            <div className="nav-mini-doc-row short"></div>
                          </div>
                          <div className="nav-mini-score-tag">98% ATS</div>
                        </div>
                        <div className="nav-card-icon-badge">
                          <FileText size={16} />
                        </div>
                      </div>
                      <div className="nav-card-content">
                        <h4 className="nav-card-title">Resume Builder</h4>
                        <p className="nav-card-desc">ATS-optimized, recruiter-ready tech resumes in minutes.</p>
                      </div>
                    </div>

                    {/* 4. Compiler */}
                    <div 
                      className="nav-mega-card card-compiler"
                      onClick={() => scrollToSection('student-section')}
                    >
                      <div className="nav-card-preview">
                        <div className="nav-card-mini-window">
                          <div className="nav-mini-bar">
                            <span className="nav-mini-dot"></span>
                            <span className="nav-mini-dot"></span>
                            <span className="nav-mini-dot"></span>
                          </div>
                          <div className="nav-mini-compiler-body">
                            <span className="nav-mini-play-tag">▶ 0.02s</span>
                          </div>
                        </div>
                        <div className="nav-card-icon-badge">
                          <Terminal size={16} />
                        </div>
                      </div>
                      <div className="nav-card-content">
                        <h4 className="nav-card-title">Compiler</h4>
                        <p className="nav-card-desc">Multi-language online compiler for instant code execution.</p>
                      </div>
                    </div>

                  </div>

                  {/* Dropdown Footer Bar */}
                  <div className="nav-mega-footer">
                    <div className="nav-mega-footer-left">
                      <Sparkles size={14} className="text-brand" />
                      <span>Start for free</span>
                    </div>
                    <button 
                      className="nav-mega-footer-btn"
                      onClick={() => scrollToSection('student-section')}
                    >
                      <span>Explore Student Portal</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── For University with Hover Mega Popup ── */}
            <div 
              className="nav-dropdown-item-wrap"
              onMouseEnter={() => handleMouseEnter('university')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                onClick={() => scrollToSection('university-section')} 
                className={`notion-nav-link ${activeSection === 'university' ? 'active' : ''} ${activeDropdown === 'university' ? 'dropdown-open' : ''}`}
              >
                <span>For University</span>
                <ChevronDown size={13} className={`nav-chevron-icon ${activeDropdown === 'university' ? 'rotated' : ''}`} />
              </button>

              {/* University Mega Popup Dropdown */}
              {activeDropdown === 'university' && (
                <div 
                  className="nav-mega-dropdown-popup mega-university-popup animate-fade-in"
                  onMouseEnter={() => handleMouseEnter('university')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="nav-mega-header">
                    <span className="nav-mega-category">CAMPUS & INSTITUTIONAL PLATFORM</span>
                  </div>

                  {/* 3 Cards Grid */}
                  <div className="nav-mega-grid nav-mega-grid-3">
                    
                    {/* 1. Training */}
                    <div 
                      className="nav-mega-card card-training"
                      onClick={() => scrollToSection('training-section')}
                    >
                      <div className="nav-card-preview">
                        <div className="nav-card-mini-window">
                          <div className="nav-mini-syllabus-bar">
                            <span className="nav-mini-sem-tag">Semester Adaptive</span>
                          </div>
                          <div className="nav-mini-curriculum-steps">
                            <div className="nav-mini-step active"></div>
                            <div className="nav-mini-step"></div>
                            <div className="nav-mini-step"></div>
                          </div>
                        </div>
                        <div className="nav-card-icon-badge">
                          <GraduationCap size={16} />
                        </div>
                      </div>
                      <div className="nav-card-content">
                        <h4 className="nav-card-title">Training</h4>
                        <p className="nav-card-desc">Semester-adaptive academic and placement readiness programs.</p>
                      </div>
                    </div>

                    {/* 2. Campus LMS */}
                    <div 
                      className="nav-mega-card card-campuslms"
                      onClick={() => scrollToSection('lms-section')}
                    >
                      <div className="nav-card-preview">
                        <div className="nav-card-mini-window">
                          <div className="nav-mini-lms-grid">
                            <div className="nav-mini-lms-sidebar"></div>
                            <div className="nav-mini-lms-main">
                              <div className="nav-mini-line line-brand"></div>
                              <div className="nav-mini-stage-badge">Stage Lock</div>
                            </div>
                          </div>
                        </div>
                        <div className="nav-card-icon-badge">
                          <Laptop size={16} />
                        </div>
                      </div>
                      <div className="nav-card-content">
                        <h4 className="nav-card-title">Campus LMS</h4>
                        <p className="nav-card-desc">Centralized campus portal with automated evaluations & workflows.</p>
                      </div>
                    </div>

                    {/* 3. Assessment Platform */}
                    <div 
                      className="nav-mega-card card-assessment"
                      onClick={() => scrollToSection('assessment-section')}
                    >
                      <div className="nav-card-preview">
                        <div className="nav-card-mini-window">
                          <div className="nav-mini-proctor-view">
                            <div className="nav-mini-cam-box"></div>
                            <div className="nav-mini-score-pill">AI Proctored</div>
                          </div>
                        </div>
                        <div className="nav-card-icon-badge">
                          <CheckCircle2 size={16} />
                        </div>
                      </div>
                      <div className="nav-card-content">
                        <h4 className="nav-card-title">Assessment Platform</h4>
                        <p className="nav-card-desc">Secure AI-proctored exams, coding challenges & recruiter analytics.</p>
                      </div>
                    </div>

                  </div>

                  {/* Dropdown Footer Bar */}
                  <div className="nav-mega-footer">
                    <div className="nav-mega-footer-left">
                      <Sparkles size={14} className="text-brand" />
                      <span>Bespoke workflows built specifically for your campus academic calendar.</span>
                    </div>
                    <button 
                      className="nav-mega-footer-btn"
                      onClick={() => { setActiveDropdown(null); setIsMeetingModalOpen(true); }}
                    >
                      <span>Book University Demo</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Smart What's New Button & Dropdown ── */}
            <div 
              className="nav-dropdown-item-wrap whats-new-wrap"
              onMouseEnter={() => handleMouseEnter('whats-new')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'whats-new' ? null : 'whats-new')}
                className={`notion-nav-link whats-new-nav-btn ${activeDropdown === 'whats-new' ? 'dropdown-open' : ''}`}
              >
                <span className="whats-new-sparkle-dot"></span>
                <span>What's New</span>
                <span className="whats-new-pill-badge">Revamped</span>
              </button>

              {/* What's New Dropdown Popover */}
              {activeDropdown === 'whats-new' && (
                <div 
                  className="nav-mega-dropdown-popup whats-new-popup animate-fade-in"
                  onMouseEnter={() => handleMouseEnter('whats-new')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="whats-new-card-inner">
                    <div className="whats-new-header">
                      <div className="whats-new-title-row">
                        <span className="whats-new-tag">✨ PLATFORM UPDATE</span>
                      </div>
                      <h4 className="whats-new-headline">We Just Revamped!</h4>
                    </div>

                    <p className="whats-new-desc">
                      As we grow and evolve, we've upgraded the CipherSchools platform.
                    </p>

                    <div className="whats-new-batch-box">
                      <div className="batch-box-icon">
                        <Layers size={16} />
                      </div>
                      <div className="batch-box-text">
                        <strong>Looking for your enrolled batches?</strong>
                        <span>You can access all your active batches, labs, and assignments directly after logging in.</span>
                      </div>
                    </div>

                    <div className="whats-new-action-row">
                      <Link 
                        to="/login" 
                        className="whats-new-login-btn"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span>Login Here</span>
                        <ArrowRight size={14} />
                      </Link>
                      <button 
                        type="button" 
                        className="whats-new-dismiss-btn"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="navbar-actions desktop-only">
            <Link to="/login" className="notion-login-btn">Login</Link>
          </div>

          <button 
            className="mobile-menu-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu mobile-only animate-fade-in">
            <div className="mobile-menu-group">
              <button 
                onClick={() => setMobileSubmenu(mobileSubmenu === 'students' ? null : 'students')} 
                className="mobile-link mobile-link-toggle"
              >
                <span>For Students</span>
                <ChevronDown size={16} className={`mobile-chevron ${mobileSubmenu === 'students' ? 'rotated' : ''}`} />
              </button>
              {mobileSubmenu === 'students' && (
                <div className="mobile-nested-links">
                  <div className="mobile-sub-item" onClick={() => { setMobileMenuOpen(false); window.location.href = '/courses'; }}>
                    <BookOpen size={15} className="text-brand" />
                    <div>
                      <strong>Courses</strong>
                      <small>Web Dev, DSA, AI & Cloud tracks</small>
                    </div>
                  </div>
                  <div className="mobile-sub-item" onClick={() => scrollToSection('ecosystem')}>
                    <Cpu size={15} className="text-brand" />
                    <div>
                      <strong>CipherLabs</strong>
                      <small>Live in-browser coding environments</small>
                    </div>
                  </div>
                  <div className="mobile-sub-item" onClick={() => scrollToSection('student-section')}>
                    <FileText size={15} className="text-brand" />
                    <div>
                      <strong>Resume Builder</strong>
                      <small>ATS-optimized tech resumes</small>
                    </div>
                  </div>
                  <div className="mobile-sub-item" onClick={() => scrollToSection('student-section')}>
                    <Terminal size={15} className="text-brand" />
                    <div>
                      <strong>Compiler</strong>
                      <small>Instant multi-language code execution</small>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mobile-menu-group">
              <button 
                onClick={() => setMobileSubmenu(mobileSubmenu === 'university' ? null : 'university')} 
                className="mobile-link mobile-link-toggle"
              >
                <span>For University</span>
                <ChevronDown size={16} className={`mobile-chevron ${mobileSubmenu === 'university' ? 'rotated' : ''}`} />
              </button>
              {mobileSubmenu === 'university' && (
                <div className="mobile-nested-links">
                  <div className="mobile-sub-item" onClick={() => scrollToSection('training-section')}>
                    <GraduationCap size={15} className="text-brand" />
                    <div>
                      <strong>Training</strong>
                      <small>Semester-aligned placement training</small>
                    </div>
                  </div>
                  <div className="mobile-sub-item" onClick={() => scrollToSection('lms-section')}>
                    <Laptop size={15} className="text-brand" />
                    <div>
                      <strong>Campus LMS</strong>
                      <small>All-in-one portal with automated grading</small>
                    </div>
                  </div>
                  <div className="mobile-sub-item" onClick={() => scrollToSection('assessment-section')}>
                    <CheckCircle2 size={15} className="text-brand" />
                    <div>
                      <strong>Assessment Platform</strong>
                      <small>AI proctoring & coding tests</small>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile What's New Notification */}
            <div className="mobile-whats-new-card">
              <div className="mobile-whats-new-badge">✨ What's New — Revamped!</div>
              <strong>Access your batches after login</strong>
              <p>As we grow, we've upgraded CipherSchools. Log in to access your enrolled batches and live labs.</p>
              <Link to="/login" className="mobile-whats-new-btn" onClick={() => setMobileMenuOpen(false)}>
                <span>Login Here</span>
                <ArrowRight size={13} />
              </Link>
            </div>
            
            <Link to="/login" className="notion-cta-btn-mobile" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          </div>
        )}
      </nav>

      {/* Book Meeting Modal */}
      <BookMeetingModal 
        isOpen={isMeetingModalOpen} 
        onClose={() => setIsMeetingModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
