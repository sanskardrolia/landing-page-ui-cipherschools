import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Building2, Code2, FileText, Terminal, 
  PlayCircle, Laptop, CheckSquare, Award, Briefcase, Compass, ArrowRight 
} from 'lucide-react';
import './WelcomeGateway.css';

const DecipherBadge = ({ targetText = "BEYOND ED-TECH PLATFORM" }) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$&!%*";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            if (index < iteration) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }

      iteration += 0.4;
    }, 30);

    return () => clearInterval(interval);
  }, [targetText]);

  const renderContent = () => {
    const searchStr = "ED-TECH";
    const index = displayText.indexOf(searchStr);
    if (index !== -1) {
      const before = displayText.substring(0, index);
      const after = displayText.substring(index + searchStr.length);
      return (
        <>
          {before}
          <span className="badge-orange-italic">ED-TECH</span>
          {after}
        </>
      );
    }
    return displayText;
  };

  return (
    <div className="gateway-top-badge decipher-badge">
      {renderContent()}
    </div>
  );
};

const STUDENT_HIGHLIGHTS = [
  { id: 'dsa', label: 'DSA Practice', icon: Code2 },
  { id: 'resume', label: 'Resume Builder', icon: FileText },
  { id: 'compiler', label: 'Online Compiler', icon: Terminal },
  { id: 'video', label: 'Video Based Learning', icon: PlayCircle },
];

const UNIVERSITY_HIGHLIGHTS = [
  { id: 'lms', label: 'LMS Platform', icon: Laptop },
  { id: 'assessment', label: 'Assessment Platform', icon: CheckSquare },
  { id: 'training', label: 'Training Support', icon: Award },
  { id: 'placement', label: 'Placements', icon: Briefcase },
];

const WelcomeGateway = () => {
  const navigate = useNavigate();

  return (
    <section className="welcome-gateway-section">
      
      {/* Ambient Background Glows */}
      <div className="gateway-ambient-glow glow-top-left"></div>
      <div className="gateway-ambient-glow glow-bottom-right"></div>

      {/* ── LEFT ORBITAL SYSTEM (Student Features) ── */}
      <div className="orbital-system orbital-system-left">
        <svg className="orbital-svg" viewBox="0 0 700 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="0" cy="400" r="220" stroke="rgba(243, 145, 46, 0.12)" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="0" cy="400" r="340" stroke="rgba(243, 145, 46, 0.15)" strokeWidth="1.5" />
          <path d="M 0 60 A 340 340 0 0 1 340 400" stroke="#F3912E" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="0" cy="400" r="460" stroke="rgba(243, 145, 46, 0.1)" strokeWidth="1.5" />
          <circle cx="0" cy="400" r="580" stroke="rgba(243, 145, 46, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Floating Student Feature Nodes */}
        {STUDENT_HIGHLIGHTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className={`orbital-capsule-node node-left node-pos-${idx + 1}`}>
              <div className="capsule-icon amber-capsule-icon">
                <Icon size={16} />
              </div>
              <span className="capsule-label">{item.label}</span>
            </div>
          );
        })}
      </div>


      {/* ── RIGHT ORBITAL SYSTEM (University Features) ── */}
      <div className="orbital-system orbital-system-right">
        <svg className="orbital-svg" viewBox="0 0 700 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="700" cy="400" r="220" stroke="rgba(59, 130, 246, 0.12)" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="700" cy="400" r="340" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1.5" />
          <path d="M 700 60 A 340 340 0 0 0 360 400" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="700" cy="400" r="460" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1.5" />
          <circle cx="700" cy="400" r="580" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Floating University Feature Nodes */}
        {UNIVERSITY_HIGHLIGHTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className={`orbital-capsule-node node-right node-pos-${idx + 1}`}>
              <span className="capsule-label">{item.label}</span>
              <div className="capsule-icon blue-capsule-icon">
                <Icon size={16} />
              </div>
            </div>
          );
        })}
      </div>


      {/* ── CENTER HEADER COPY (EXACT SCREENSHOT MATCH) ── */}
      <div className="gateway-header-content">
        <DecipherBadge />

        <h1 className="gateway-main-h1">
          Welcome to <img src="/cipherschools-logo.png" alt="CipherSchools Logo" className="hero-title-logo" />
          <span className="cipherschools-orange-box">CipherSchools</span>
        </h1>

        <p className="gateway-sub-text">
          Choose how you want to <span className="text-orange-italic">experience</span> the <span className="text-orange-italic">platform</span>.
        </p>
      </div>


      {/* ── TWO CLEAN SELECTION CARDS ── */}
      <div className="gateway-cards-grid">
        
        {/* Card 1: Student */}
        <div className="gateway-card student-card" onClick={() => {
          const target = document.getElementById('student-section');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }}>
          <div className="gateway-card-glow student-glow"></div>
          
          <div className="gateway-icon-box student-icon-box">
            <GraduationCap size={32} className="icon-amber" />
          </div>

          <h2 className="gateway-card-title">I'm a Student</h2>
          
          <p className="gateway-card-desc">
            Looking to master new skills, build projects, and accelerate my career.
          </p>
        </div>


        {/* Card 2: University */}
        <div className="gateway-card university-card" onClick={() => {
          window.isNavigatingToUniversity = true;
          setTimeout(() => { window.isNavigatingToUniversity = false; }, 1600);
          const target = document.getElementById('university-section');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }}>
          <div className="gateway-card-glow university-glow"></div>
          
          <div className="gateway-icon-box university-icon-box">
            <Building2 size={32} className="icon-blue" />
          </div>

          <h2 className="gateway-card-title">I'm a University</h2>
          
          <p className="gateway-card-desc">
            Looking to upskill our students, deploy an LMS, and boost placements.
          </p>
        </div>

      </div>

    </section>
  );
};

export default WelcomeGateway;
