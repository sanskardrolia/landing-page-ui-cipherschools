import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Landmark, ArrowRight, Laptop, Play, Compass, Code2, Briefcase, Bot } from 'lucide-react';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      className="welcome-page"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="welcome-grid-bg"></div>
      
      {/* Floating Background Tags */}
      <div className="floating-tag tag-1"><Laptop size={16} color="#ffa103" /> LMS Platform</div>
      <div className="floating-tag tag-2"><Play size={16} color="#0052ff" /> Video Based</div>
      <div className="floating-tag tag-3"><Compass size={16} color="#ffa103" /> Career Path</div>
      <div className="floating-tag tag-4"><Code2 size={16} color="#0052ff" /> Online Compiler</div>
      <div className="floating-tag tag-5"><Briefcase size={16} color="#ffa103" /> Placements</div>
      <div className="floating-tag tag-6"><Bot size={16} color="#0052ff" /> AI Hints</div>

      <div className="welcome-container">
        
        <div className="welcome-header">
          <h1>Welcome to <span className="cipher-text">Cipher</span><span>Schools</span></h1>
          <p>Choose how you want to <span>experience</span> the <span>platform</span>.</p>
        </div>

        <div className="welcome-cards">
          
          {/* Student Card */}
          <div 
            className="w-card w-card-student" 
            onClick={() => navigate('/students')}
          >
            <div className="w-card-bg-glow"></div>
            <div className="w-card-icon">
              <GraduationCap size={42} strokeWidth={1.5} />
            </div>
            <div className="w-card-content">
              <h2>I'm a Student</h2>
              <p>Looking to master new skills, build projects, and accelerate my career.</p>
            </div>
            <div className="w-card-arrow">
              <ArrowRight size={24} />
            </div>
          </div>

          {/* University Card */}
          <div 
            className="w-card w-card-university" 
            onClick={() => navigate('/universities')}
          >
            <div className="w-card-bg-glow"></div>
            <div className="w-card-icon">
              <Landmark size={42} strokeWidth={1.5} />
            </div>
            <div className="w-card-content">
              <h2>I'm a University</h2>
              <p>Looking to upskill our students, deploy an LMS, and boost placements.</p>
            </div>
            <div className="w-card-arrow">
              <ArrowRight size={24} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WelcomePage;
