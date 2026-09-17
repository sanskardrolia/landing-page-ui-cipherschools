import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  RiHome5Fill, 
  RiGraduationCapFill,
  RiVipCrown2Fill,
  RiGiftFill,
  RiDashboardFill,
  RiFileUserFill,
  RiPresentationFill
} from 'react-icons/ri';
import './AppSidebar.css';

// ── Hamburger Menu Icon matching media_1789649182682.png ──
const MenuIcon = () => (
  <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="1.5" y1="2.5" x2="20.5" y2="2.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="1.5" y1="9" x2="20.5" y2="9" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="1.5" y1="15.5" x2="13.5" y2="15.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);

// ── Courses Books Icon (3 books, 1 tilted) matching screenshot ──
const CoursesIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="3.5" y="4" width="4.2" height="16" rx="0.8" />
    <rect x="9.5" y="4" width="4.2" height="16" rx="0.8" />
    <path d="M16.5 4.8L20 19.5C20.1 20 19.8 20.5 19.3 20.6L16.2 21.4C15.7 21.5 15.2 21.2 15.1 20.7L11.6 6C11.5 5.5 11.8 5 12.3 4.9L15.4 4.1C15.9 4 16.4 4.3 16.5 4.8Z" />
  </svg>
);

// ── Practice </> Icon matching screenshot ──
const PracticeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7 8 3 12 7 16" />
    <polyline points="17 8 21 12 17 16" />
    <line x1="14" y1="4" x2="10" y2="20" />
  </svg>
);

// ── Compiler Badge with </> inside matching screenshot ──
const CompilerIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="2.5" y="3.5" width="19" height="17" rx="4" />
    <path d="M8 8.5L5.5 12L8 15.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M16 8.5L18.5 12L16 15.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="13" y1="7.5" x2="11" y2="16.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

// ── Feedback User + Speech Bubble Icon matching screenshot ──
const FeedbackIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 19.5C2.5 16 5.5 14.5 9 14.5C12.5 14.5 15.5 16 15.5 19.5C15.5 20 15.1 20.5 14.5 20.5H3.5C2.9 20.5 2.5 20 2.5 19.5Z" />
    <path d="M15 3.5H22C22.55 3.5 23 3.95 23 4.5V10.5C23 11.05 22.55 11.5 22 11.5H19.5V14L16.5 11.5H15C14.45 11.5 14 11.05 14 10.5V4.5C14 3.95 14.45 3.5 15 3.5Z" />
  </svg>
);

// ── Circular Logout Icon matching screenshot ──
const LogoutIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.5 3.5A9.5 9.5 0 1 0 12.5 20.5" />
    <path d="M8.5 12H21.5" />
    <path d="M17.5 8L21.5 12L17.5 16" />
  </svg>
);

// ── Navigation Items Rail ──
const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: RiHome5Fill, path: '/' },
  { id: 'courses', label: 'Courses', Icon: CoursesIcon, targetSection: 'student-section' },
  { id: 'batches', label: 'Batches', Icon: RiGraduationCapFill, targetSection: 'student-section' },
  { id: 'premium', label: 'Premium', Icon: RiVipCrown2Fill, targetSection: 'university-section' },
  { id: 'practice', label: 'Practice', Icon: PracticeIcon, targetSection: 'student-section' },
  { id: 'rewards', label: 'Rewards', Icon: RiGiftFill, targetSection: 'student-section' },
  { id: 'dashboard', label: 'Dashboard', Icon: RiDashboardFill, path: '/login' },
  { id: 'compiler', label: 'Compiler', Icon: CompilerIcon, targetSection: 'student-section' },
  { id: 'resume', label: 'Resume', Icon: RiFileUserFill, targetSection: 'student-section' },
  { id: 'creator', label: 'Creator', Icon: RiPresentationFill, targetSection: 'university-section' },
  { id: 'feedback', label: 'Feedback', Icon: FeedbackIcon, targetSection: 'student-section' },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeId, setActiveId] = useState('home');

  // Keep Home active when on the landing page '/'
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveId('home');
    } else if (location.pathname === '/login') {
      setActiveId('dashboard');
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setActiveId(item.id);
    if (item.id === 'home') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      return;
    }
    if (item.path) {
      navigate(item.path);
      return;
    }
    if (item.targetSection) {
      const el = document.getElementById(item.targetSection);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className="app-min-sidebar" aria-label="Sidebar Navigation Rail">
      {/* ── Top Header: Hamburger Menu Toggle ── */}
      <div className="app-sb-top-header">
        <button 
          className="app-sb-menu-btn" 
          aria-label="Toggle Menu"
          title="Menu"
          onClick={() => {
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <MenuIcon />
        </button>
      </div>

      {/* ── Center: Vertical Navigation Rail Items ── */}
      <nav className="app-sb-nav-list" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const IconComponent = item.Icon;

          return (
            <button
              key={item.id}
              type="button"
              className={`app-sb-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleItemClick(item)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              title={item.label}
            >
              <span className="app-sb-item-icon" aria-hidden="true">
                <IconComponent size={20} />
              </span>
              <span className="app-sb-item-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Bottom: Logout Action ── */}
      <div className="app-sb-bottom">
        <button
          type="button"
          className="app-sb-nav-item app-sb-logout-btn"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <span className="app-sb-item-icon" aria-hidden="true">
            <LogoutIcon size={22} />
          </span>
          <span className="app-sb-item-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
