import React from 'react';
import { Building2, Briefcase, LandPlot, ShieldCheck, CreditCard, Home, Landmark, Shield } from 'lucide-react';
import './TrustedBy.css';

const TrustedBy = () => {
  const logos = [
    { name: 'NABARD', icon: <LandPlot size={24} /> },
    { name: 'SBI Life', icon: <Shield size={24} /> },
    { name: 'Ministry of Skill Development', icon: <Building2 size={24} /> },
    { name: 'TATA CAPITAL', icon: <Landmark size={24} /> },
    { name: 'Urban Company', icon: <Home size={24} /> },
    { name: 'AADHAAR', icon: <ShieldCheck size={24} /> },
    { name: 'AXIS BANK', icon: <Briefcase size={24} /> },
    { name: 'CRED', icon: <CreditCard size={24} /> },
  ];

  // Duplicate for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="trusted-by-section">
      <div className="trusted-container">
        <h4 className="trusted-title">TRUSTED BY LEADING ORGANIZATIONS</h4>
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
