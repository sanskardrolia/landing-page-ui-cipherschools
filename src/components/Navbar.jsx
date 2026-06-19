import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isUniversityPage = location.pathname === '/universities';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isUniversityPage ? 'navbar-light' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
          <span className="logo-text">Cipher<span className="text-primary">Schools</span></span>
        </Link>
        
        <div className="navbar-links desktop-only">
          <Link to="/universities" className="nav-link">For Universities</Link>
          <a href="#resume-builder" className="nav-link">Resume Builder</a>
          <a href="#online-compiler" className="nav-link">Online Compiler</a>
          <Link to="/#about" className="nav-link">About</Link>
        </div>
        
        <div className="navbar-actions desktop-only">
          <a href="#login" className="nav-link login-link">Login</a>
        </div>

        <button 
          className="mobile-menu-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu mobile-only animate-fade-in">
          <Link to="/universities" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>For Universities</Link>
          <a href="#resume-builder" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Resume Builder</a>
          <a href="#online-compiler" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Online Compiler</a>
          <Link to="/#about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <a href="#login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Login</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
