import React from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Building, GraduationCap } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  return (
    <footer className="footer-wrapper">
      {/* Main Footer */}
      <div className="main-footer">
        <div className="container">
          <div className="footer-grid">
            
            <div className="footer-brand">
              <span className="logo-text">Cipher<span className="text-primary">Schools</span></span>
              <p className="brand-desc">
                Helping students become industry-ready builders through structured learning, practice, and real-world experiences.
              </p>
            </div>

            <div className="footer-links-group">
              <h4>Products</h4>
              <ul>
                <li><a href="#">LMS Platform</a></li>
                <li><a href="#">CipherLabs</a></li>
                <li><a href="#">Resume Builder</a></li>
                <li><a href="#">Online Compiler</a></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4>Programs</h4>
              <ul>
                <li><a href="#">For Students</a></li>
                <li><a href="#">For Universities</a></li>
                <li><a href="#">Campus Ambasssadors</a></li>
                <li><a href="#">Community Events</a></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} CipherSchools. All rights reserved.</p>
            <div className="social-links">
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
