import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  RiHome5Fill, 
  RiBookOpenFill, 
  RiVipCrownFill, 
  RiCodeBoxFill, 
  RiGiftFill, 
  RiTerminalBoxFill, 
  RiFileUserFill, 
  RiPresentationFill, 
  RiMessage3Fill, 
  RiLoginCircleFill, 
  RiLockFill, 
  RiMenuFill,
  RiCloseLine,
  RiArrowRightLine,
  RiGraduationCapFill,
  RiBuilding2Fill,
  RiAwardFill
} from 'react-icons/ri';
import './AppSidebar.css';

const SIDEBAR_ITEMS = [
  { id: 'home', label: 'Home', icon: RiHome5Fill, isHome: true },
  { id: 'courses', label: 'Courses', icon: RiBookOpenFill },
  { id: 'premium', label: 'Premium', icon: RiVipCrownFill },
  { id: 'practice', label: 'Practice', icon: RiCodeBoxFill },
  { id: 'rewards', label: 'Rewards', icon: RiGiftFill },
  { id: 'compiler', label: 'Compiler', icon: RiTerminalBoxFill },
  { id: 'resume', label: 'Resume', icon: RiFileUserFill },
  { id: 'creator', label: 'Creator', icon: RiPresentationFill },
  { id: 'feedback', label: 'Feedback', icon: RiMessage3Fill },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLockedItem, setSelectedLockedItem] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleItemClick = (item) => {
    if (item.isHome) {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
    } else {
      setSelectedLockedItem(item.label);
      setIsLoginModalOpen(true);
    }
  };

  const handleSignInClick = () => {
    setSelectedLockedItem('CipherSchools');
    setIsLoginModalOpen(true);
  };

  const handleLoginTypeSelect = (type) => {
    setIsLoginModalOpen(false);
    navigate(`/login?type=${type}`);
  };

  return (
    <>
      {/* ── STICKY MINIMIZED SHADCN-STYLE LEFT SIDEBAR WITH SOLID FILL ICONS ── */}
      <aside className="app-min-sidebar" aria-label="Sidebar Rail">
        {/* Top Hamburger Button */}
        <div className="app-sb-top">
          <button 
            className="app-sb-hamburger-btn" 
            aria-label="Toggle Menu"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
          >
            <RiMenuFill size={20} />
          </button>
        </div>

        {/* Sidebar Items Rail */}
        <nav className="app-sb-nav">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isHome = item.isHome;

            return (
              <button
                key={item.id}
                type="button"
                className={`app-sb-item ${isHome ? 'item-home active' : 'item-locked'}`}
                onClick={() => handleItemClick(item)}
                title={isHome ? 'Home' : `Locked: Sign in to access ${item.label}`}
              >
                <div className="app-sb-icon-wrap">
                  <Icon size={20} className="app-sb-icon" />
                  {!isHome && (
                    <span className="app-sb-lock-badge" aria-hidden="true">
                      <RiLockFill size={8} />
                    </span>
                  )}
                </div>
                <span className="app-sb-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Signin Item */}
        <div className="app-sb-bottom">
          <button
            type="button"
            className="app-sb-item item-locked item-signin"
            onClick={handleSignInClick}
            title="Sign in to your account"
          >
            <div className="app-sb-icon-wrap">
              <RiLoginCircleFill size={21} className="app-sb-icon" />
              <span className="app-sb-lock-badge" aria-hidden="true">
                <RiLockFill size={8} />
              </span>
            </div>
            <span className="app-sb-label">Signin</span>
          </button>
        </div>
      </aside>

      {/* ── SHADCN DIALOG STYLED LOGIN TYPES ACCESS MODAL ── */}
      {isLoginModalOpen && (
        <div className="app-login-modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
          <div className="app-login-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="app-login-modal-close" 
              onClick={() => setIsLoginModalOpen(false)}
              aria-label="Close"
            >
              <RiCloseLine size={20} />
            </button>

            <div className="app-login-modal-header">
              <div className="app-login-modal-badge">
                <RiLockFill size={18} />
              </div>
              <h3 className="app-login-modal-title">
                Sign in to access {selectedLockedItem}
              </h3>
              <p className="app-login-modal-desc">
                Select your account type to access practice sandboxes, live courses, institutional assessments, and platform tools.
              </p>
            </div>

            {/* 3 Login Types */}
            <div className="app-login-types-list">
              {/* Type 1: Student / Learner */}
              <button 
                type="button" 
                className="app-login-type-btn"
                onClick={() => handleLoginTypeSelect('student')}
              >
                <div className="app-login-type-icon-box icon-student">
                  <RiGraduationCapFill size={20} />
                </div>
                <div className="app-login-type-info">
                  <span className="app-login-type-name">Student / Learner</span>
                  <span className="app-login-type-sub">Access 50+ courses, DSA practice labs & certificates</span>
                </div>
                <RiArrowRightLine size={16} className="app-login-type-arrow" />
              </button>

              {/* Type 2: University / Campus */}
              <button 
                type="button" 
                className="app-login-type-btn"
                onClick={() => handleLoginTypeSelect('university')}
              >
                <div className="app-login-type-icon-box icon-university">
                  <RiBuilding2Fill size={20} />
                </div>
                <div className="app-login-type-info">
                  <span className="app-login-type-name">University / Campus Partner</span>
                  <span className="app-login-type-sub">Institutional LMS, batch progress & dean analytics</span>
                </div>
                <RiArrowRightLine size={16} className="app-login-type-arrow" />
              </button>

              {/* Type 3: Creator / Educator */}
              <button 
                type="button" 
                className="app-login-type-btn"
                onClick={() => handleLoginTypeSelect('creator')}
              >
                <div className="app-login-type-icon-box icon-creator">
                  <RiAwardFill size={20} />
                </div>
                <div className="app-login-type-info">
                  <span className="app-login-type-name">Creator / Mentor</span>
                  <span className="app-login-type-sub">Publish technical courses & mentor student cohorts</span>
                </div>
                <RiArrowRightLine size={16} className="app-login-type-arrow" />
              </button>
            </div>

            <div className="app-login-modal-footer">
              <button 
                type="button"
                className="app-login-direct-btn"
                onClick={() => handleLoginTypeSelect('general')}
              >
                Continue to Standard Login <RiArrowRightLine size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppSidebar;
