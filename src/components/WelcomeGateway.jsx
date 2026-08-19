import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Building2, Code2, FileText, Terminal, 
  PlayCircle, Laptop, CheckSquare, Award, Briefcase, Compass, ArrowRight, Sparkles 
} from 'lucide-react';
import './WelcomeGateway.css';

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
          <circle cx="700" cy="400" r="220" stroke="rgba(243, 145, 46, 0.12)" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="700" cy="400" r="340" stroke="rgba(243, 145, 46, 0.15)" strokeWidth="1.5" />
          <path d="M 700 60 A 340 340 0 0 0 360 400" stroke="#F3912E" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="700" cy="400" r="460" stroke="rgba(243, 145, 46, 0.1)" strokeWidth="1.5" />
          <circle cx="700" cy="400" r="580" stroke="rgba(243, 145, 46, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Floating University Feature Nodes */}
        {UNIVERSITY_HIGHLIGHTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className={`orbital-capsule-node node-right node-pos-${idx + 1}`}>
              <span className="capsule-label">{item.label}</span>
              <div className="capsule-icon amber-capsule-icon">
                <Icon size={16} />
              </div>
            </div>
          );
        })}
      </div>


      {/* ── CENTER HEADER COPY ── */}
      <div className="gateway-header-content">
        <h2 className="gateway-header-headline">
          Choose how you want to <span className="text-orange-italic">experience</span> the <span className="text-orange-italic">platform</span>.
        </h2>
      </div>

      {/* ── TWO MODERN SELECTION CARDS ── */}
      <div className="gateway-cards-grid">
        
        {/* Card 1: Student */}
        <div 
          className="gateway-card student-card" 
          onClick={() => {
            const target = document.getElementById('student-section');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="gateway-card-glow student-glow"></div>
          
          <div className="gateway-card-top-bar">
            <span className="card-badge student-badge">FOR LEARNERS</span>
          </div>

          <div className="gateway-icon-box student-icon-box">
            <GraduationCap size={28} className="icon-amber" />
          </div>

          <h3 className="gateway-card-title">I'm a Student</h3>
          
          <p className="gateway-card-desc">
            Looking to master new skills, build projects, and accelerate my career.
          </p>

          <div className="gateway-card-footer">
            <span className="card-cta-btn student-cta">
              Explore Pathway <ArrowRight size={15} />
            </span>
          </div>
        </div>

        {/* Card 2: University */}
        <div 
          className="gateway-card university-card" 
          onClick={() => {
            window.isNavigatingToUniversity = true;
            setTimeout(() => { window.isNavigatingToUniversity = false; }, 1600);
            const target = document.getElementById('university-section');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="gateway-card-glow university-glow"></div>
          
          <div className="gateway-card-top-bar">
            <span className="card-badge university-badge">FOR INSTITUTIONS</span>
          </div>

          <div className="gateway-icon-box university-icon-box">
            <Building2 size={28} className="icon-blue" />
          </div>

          <h3 className="gateway-card-title">I'm a University</h3>
          
          <p className="gateway-card-desc">
            Looking to upskill our students, deploy an LMS, and boost placements.
          </p>

          <div className="gateway-card-footer">
            <span className="card-cta-btn university-cta">
              Explore Solutions <ArrowRight size={15} />
            </span>
          </div>
        </div>

      </div>

    </section>
  );
};

export default WelcomeGateway;
