import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './MentorWallModal.css';

const MOCK_MENTORS = [
  {
    id: 1,
    name: 'Anjali Sharma',
    role: 'Senior Software Engineer',
    company: 'Google',
    companyLogo: 'https://api.iconify.design/simple-icons/google.svg?color=%234B5563',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
    linkedin: '#'
  },
  {
    id: 2,
    name: 'Rahul Desai',
    role: 'Staff Engineer',
    company: 'Microsoft',
    companyLogo: 'https://api.iconify.design/simple-icons/microsoft.svg?color=%234B5563',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
    linkedin: '#'
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Product Manager',
    company: 'Amazon',
    companyLogo: 'https://api.iconify.design/simple-icons/amazonaws.svg?color=%234B5563',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
    linkedin: '#'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Engineering Manager',
    company: 'Apple',
    companyLogo: 'https://api.iconify.design/simple-icons/apple.svg?color=%234B5563',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    linkedin: '#'
  },
  {
    id: 5,
    name: 'Neha Gupta',
    role: 'Frontend Lead',
    company: 'Adobe',
    companyLogo: 'https://api.iconify.design/simple-icons/adobe.svg?color=%234B5563',
    avatar: 'https://images.unsplash.com/photo-1598550874175-4d0ef43ee90d?w=150&h=150&fit=crop',
    linkedin: '#'
  },
  {
    id: 6,
    name: 'Arjun Mehta',
    role: 'Backend Architect',
    company: 'Netflix',
    companyLogo: 'https://api.iconify.design/simple-icons/netflix.svg?color=%234B5563',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
    linkedin: '#'
  }
];

const MentorWallModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mw-overlay" onClick={onClose}>
      <div className="mw-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mw-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="mw-header">
          <div className="mw-badge">Exclusive Network</div>
          <h2>Wall of Fame</h2>
          <p>Get guided by industry veterans from top product-based companies.</p>
        </div>

        <div className="mw-grid">
          {MOCK_MENTORS.map((mentor) => (
            <div key={mentor.id} className="mw-card">
              <div className="mw-avatar-wrap">
                <img src={mentor.avatar} alt={mentor.name} className="mw-avatar" />
              </div>
              <div className="mw-info">
                <h3>{mentor.name}</h3>
                <p className="mw-role">{mentor.role}</p>
                <div className="mw-company">
                  <img src={mentor.companyLogo} alt={mentor.company} className="mw-company-logo" />
                  <span>{mentor.company}</span>
                </div>
              </div>
              <a href={mentor.linkedin} className="mw-linkedin-btn" target="_blank" rel="noreferrer">
                <img src="https://api.iconify.design/simple-icons/linkedin.svg?color=%230A66C2" alt="LinkedIn" style={{ width: '18px', height: '18px' }} />
                <span>Connect</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorWallModal;
