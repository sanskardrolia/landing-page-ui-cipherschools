import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Bell, Sun, Moon, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isCoursePage = location.pathname === '/courses';

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    window.dispatchEvent(new CustomEvent('courses-theme-toggle', { detail: { isDark: nextMode } }));
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
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

  /* ── Standard Navigation Bar for Single Page Landing (Notion Style) ── */
  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} navbar-theme-notion`}>
      <div className="container navbar-container">
        <div className="navbar-logo" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onClick={() => scrollToSection('welcome-section')}>
          <img src="/cipherschools-logo.png" alt="CipherSchools Logo" style={{ height: '26px', width: '26px', objectFit: 'contain' }} />
          <span className="logo-text">Cipher<span className="text-primary">Schools</span></span>
        </div>
        
        <div className="navbar-links desktop-only">
          <button onClick={() => scrollToSection('student-section')} className="notion-nav-link">
            For Students
          </button>
          <button onClick={() => scrollToSection('university-section')} className="notion-nav-link">
            For University
          </button>
          <button onClick={() => scrollToSection('ecosystem')} className="notion-nav-link">
            CipherLabs
          </button>
        </div>
        
        <div className="navbar-actions desktop-only">
          <a href="#login" className="notion-login-btn">Login</a>
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
          <button onClick={() => scrollToSection('student-section')} className="mobile-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', padding: '0.75rem 0' }}>
            <span>For Students</span>
          </button>
          <button onClick={() => scrollToSection('university-section')} className="mobile-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', padding: '0.75rem 0' }}>
            <span>For University</span>
          </button>
          <button onClick={() => scrollToSection('ecosystem')} className="mobile-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', padding: '0.75rem 0' }}>
            <span>CipherLabs</span>
          </button>
          <a href="#login" className="notion-cta-btn-mobile" onClick={() => setMobileMenuOpen(false)}>Login</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
