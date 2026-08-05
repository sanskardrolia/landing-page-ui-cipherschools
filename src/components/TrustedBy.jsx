import React from 'react';
import { GraduationCap, Building2, Landmark, Award, BookOpen, School, Globe, Shield } from 'lucide-react';
import './TrustedBy.css';

const TrustedBy = () => {
  const logos = [
    { name: 'Lovely Professional University', icon: <GraduationCap size={24} /> },
    { name: 'Galgotias University', icon: <School size={24} /> },
    { name: 'Chandigarh University', icon: <Building2 size={24} /> },
    { name: 'SRM Institute of Tech', icon: <Award size={24} /> },
    { name: 'Amity University', icon: <Landmark size={24} /> },
    { name: 'VIT Vellore', icon: <Globe size={24} /> },
    { name: 'Chitkara University', icon: <BookOpen size={24} /> },
    { name: 'KL University', icon: <Shield size={24} /> },
  ];

  // Duplicate for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="trusted-by-section">
      <div className="trusted-container">
        <h4 className="trusted-title">TRUSTED BY TOP COLLEGES IN INDIA</h4>
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {duplicatedLogos.map((logo, index) => (
              <div key={index} className="trusted-logo-item">
                <span className="trusted-logo-icon">{logo.icon}</span>
                <span className="trusted-logo-name">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
