import React from 'react';
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
  RiLockFill, 
  RiMenuFill
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

  const handleItemClick = (item) => {
    if (item.isHome) {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
    } else {
      // Jump directly to login - no pop-up dialog
      navigate('/login');
    }
  };

  return (
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
              aria-label={isHome ? 'Home' : `${item.label} - Login to access`}
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

              {/* Flyout Tooltip on Hover for Locked CTAs — Highlights 'Login to access' */}
              {!isHome && (
                <div className="app-sb-tooltip" role="tooltip">
                  <span className="app-sb-tooltip-title">{item.label}</span>
                  <span className="app-sb-tooltip-divider">•</span>
                  <span className="app-sb-tooltip-highlight">
                    <RiLockFill size={10} className="tooltip-lock-icon" />
                    <span>Login to access</span>
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default AppSidebar;
