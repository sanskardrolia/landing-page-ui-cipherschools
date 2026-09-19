import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  RiHome5Fill, 
  RiVipCrown2Fill,
  RiGiftFill,
  RiDashboardFill,
  RiFileUserFill,
  RiPresentationFill
} from 'react-icons/ri';
import './AppSidebar.css';

// ── Hamburger Menu Icon matching reference ──
const MenuIcon = () => (
  <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="1.5" y1="2.5" x2="20.5" y2="2.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="1.5" y1="9" x2="20.5" y2="9" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="1.5" y1="15.5" x2="13.5" y2="15.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);

// ── Courses Books Icon (3 books, 1 tilted) ──
const CoursesIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="3.5" y="4" width="4.2" height="16" rx="0.8" />
    <rect x="9.5" y="4" width="4.2" height="16" rx="0.8" />
    <path d="M16.5 4.8L20 19.5C20.1 20 19.8 20.5 19.3 20.6L16.2 21.4C15.7 21.5 15.2 21.2 15.1 20.7L11.6 6C11.5 5.5 11.8 5 12.3 4.9L15.4 4.1C15.9 4 16.4 4.3 16.5 4.8Z" />
  </svg>
);

// ── Practice </> Icon ──
const PracticeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7 8 3 12 7 16" />
    <polyline points="17 8 21 12 17 16" />
    <line x1="14" y1="4" x2="10" y2="20" />
  </svg>
);

// ── Compiler Badge with </> inside ──
const CompilerIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="2.5" y="3.5" width="19" height="17" rx="4" />
    <path d="M8 8.5L5.5 12L8 15.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M16 8.5L18.5 12L16 15.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="13" y1="7.5" x2="11" y2="16.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

// ── Feedback User + Speech Bubble Icon ──
const FeedbackIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 19.5C2.5 16 5.5 14.5 9 14.5C12.5 14.5 15.5 16 15.5 19.5C15.5 20 15.1 20.5 14.5 20.5H3.5C2.9 20.5 2.5 20 2.5 19.5Z" />
    <path d="M15 3.5H22C22.55 3.5 23 3.95 23 4.5V10.5C23 11.05 22.55 11.5 22 11.5H19.5V14L16.5 11.5H15C14.45 11.5 14 11.05 14 10.5V4.5C14 3.95 14.45 3.5 15 3.5Z" />
  </svg>
);

// ── Circular Logout Icon ──
const LogoutIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.5 3.5A9.5 9.5 0 1 0 12.5 20.5" />
    <path d="M8.5 12H21.5" />
    <path d="M17.5 8L21.5 12L17.5 16" />
  </svg>
);

// ── Navigation Items Rail (Desktop Sequence) ──
const NAV_ITEMS = [
  { 
    id: 'home', 
    label: 'Home', 
    Icon: RiHome5Fill, 
    path: '/',
    cardBadge: 'PLATFORM',
    cardTitle: 'Home Overview',
    cardDesc: 'Return to the landing portal, exploration gateway, and platform highlights.',
    cardTags: ['Overview', 'Ecosystem', 'Updates']
  },
  { 
    id: 'courses', 
    label: 'Courses', 
    badge: 'FREE',
    Icon: CoursesIcon, 
    targetSection: 'student-section',
    cardBadge: 'FREE ACCESS',
    cardTitle: 'Structured Courses',
    cardDesc: 'Comprehensive self-paced video masterclasses covering web dev, cloud, DSA, and modern tech.',
    cardTags: ['Video Lessons', 'Projects', 'Certificates']
  },
  { 
    id: 'practice', 
    label: 'Practice', 
    badge: 'FREE',
    Icon: PracticeIcon, 
    targetSection: 'student-section',
    cardBadge: 'FREE ACCESS',
    cardTitle: 'Coding Practice Sandbox',
    cardDesc: 'Solve 100,000+ interactive challenges across DSA, algorithms, and system design.',
    cardTags: ['100K+ Questions', 'AI Hints', 'Test Cases']
  },
  { 
    id: 'resume', 
    label: 'Resume', 
    badge: 'FREE',
    Icon: RiFileUserFill, 
    targetSection: 'student-section',
    cardBadge: 'FREE ACCESS',
    cardTitle: 'Interactive Resume Builder',
    cardDesc: 'Craft ATS-compliant developer resumes with live PDF preview and real-time formatting guidance.',
    cardTags: ['ATS Templates', 'PDF Export', 'Live Preview']
  },
  { 
    id: 'compiler', 
    label: 'Compiler', 
    badge: 'FREE',
    Icon: CompilerIcon, 
    targetSection: 'student-section',
    cardBadge: 'FREE ACCESS',
    cardTitle: 'Cloud Online Compiler',
    cardDesc: 'Instant zero-setup in-browser code editor supporting 35+ languages with live input/output console.',
    cardTags: ['35+ Languages', 'Instant Run', 'I/O Console']
  },
  { 
    id: 'reward', 
    label: 'Reward', 
    Icon: RiGiftFill, 
    targetSection: 'student-section',
    cardBadge: 'ACHIEVEMENTS',
    cardTitle: 'Milestones & Rewards',
    cardDesc: 'Track daily learning streaks, earn skill badges, unlock certificates, and redeem reward coins.',
    cardTags: ['Daily Streaks', 'Skill Badges', 'Certificates']
  },
  { 
    id: 'premium', 
    label: 'Premium', 
    badge: 'PAID',
    Icon: RiVipCrown2Fill, 
    targetSection: 'university-section',
    cardBadge: 'PAID TIER',
    cardTitle: 'Premium & Campus Pro',
    cardDesc: 'Institutional LMS, proctored campus assessments, 1-on-1 industry mentorship, and placements.',
    cardTags: ['Proctored Exams', '1:1 Mentorship', 'Placements']
  },
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    Icon: RiDashboardFill, 
    path: '/login',
    cardBadge: 'LEARNER ANALYTICS',
    cardTitle: 'Student Dashboard',
    cardDesc: 'Unified analytics of your active courses, problem completion stats, and performance metrics.',
    cardTags: ['Learning Stats', 'Course Progress', 'Activity Heatmap']
  },
  { 
    id: 'creator', 
    label: 'Creator', 
    Icon: RiPresentationFill, 
    targetSection: 'university-section',
    cardBadge: 'INSTRUCTOR PORTAL',
    cardTitle: 'CipherSchools Creator',
    cardDesc: 'Publish technical courses, mentor the developer community, and monetize high-impact content.',
    cardTags: ['Course Publishing', 'Analytics', 'Monetization']
  },
  { 
    id: 'feedback', 
    label: 'Feedback', 
    Icon: FeedbackIcon, 
    targetSection: 'student-section',
    cardBadge: 'COMMUNITY & SUPPORT',
    cardTitle: 'Feedback & Suggestions',
    cardDesc: 'Submit feedback, report platform issues, or propose new features to our engineering team.',
    cardTags: ['Bug Reports', 'Feature Requests', 'Direct Feedback']
  },
];

// ── Mobile 5-Icon Navigation Sequence: Home, Courses, Practice, Premium, Dashboard ──
const MOBILE_NAV_KEYS = ['home', 'courses', 'practice', 'premium', 'dashboard'];
const MOBILE_NAV_ITEMS = MOBILE_NAV_KEYS.map(id => NAV_ITEMS.find(item => item.id === id)).filter(Boolean);

const LOGOUT_ITEM = {
  id: 'logout',
  label: 'Logout',
  cardBadge: 'SESSION',
  cardTitle: 'Sign Out',
  cardDesc: 'Safely terminate your active session or log in with another account profile.',
  cardTags: ['Secure Session', 'Switch Profile']
};

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeId, setActiveId] = useState('home');

  // Hover card state (desktop only)
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverPos, setHoverPos] = useState({ top: 0 });
  const closeTimeoutRef = useRef(null);

  // Keep Home active when on landing page '/'
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

  // Hover handlers for smooth fade cards (desktop only)
  const handleMouseEnter = (e, item) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const targetY = rect.top + rect.height / 2;
    const clampedY = Math.max(90, Math.min(window.innerHeight - 120, targetY));
    setHoverPos({ top: clampedY });
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 120);
  };

  const handleCardMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleCardMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 120);
  };

  return (
    <>
      {/* ── Desktop UI: Left Fixed Sidebar Navigation Rail (>= 1024px) ── */}
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
                onMouseEnter={(e) => handleMouseEnter(e, item)}
                onMouseLeave={handleMouseLeave}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Micro-badge for FREE or PAID */}
                {item.badge && (
                  <span className={`app-sb-item-badge badge-${item.badge.toLowerCase()}`}>
                    {item.badge}
                  </span>
                )}
                
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
            onMouseEnter={(e) => handleMouseEnter(e, LOGOUT_ITEM)}
            onMouseLeave={handleMouseLeave}
            aria-label="Logout"
          >
            <span className="app-sb-item-icon" aria-hidden="true">
              <LogoutIcon size={22} />
            </span>
            <span className="app-sb-item-label">Logout</span>
          </button>
        </div>

        {/* ── Greyscale Hover Card Flyout (Fade In, Desktop only) ── */}
        <div 
          className={`app-sb-flyout-card ${hoveredItem ? 'visible' : ''}`}
          style={{ top: `${hoverPos.top}px` }}
          role="tooltip"
          aria-hidden={!hoveredItem}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        >
          {hoveredItem && (
            <div className="app-sb-flyout-card-inner">
              <div className="app-sb-flyout-card-header">
                <span className="app-sb-flyout-card-badge">
                  {hoveredItem.cardBadge}
                </span>
                {hoveredItem.badge && (
                  <span className={`app-sb-flyout-pricing-pill pricing-${hoveredItem.badge.toLowerCase()}`}>
                    {hoveredItem.badge}
                  </span>
                )}
              </div>

              <h4 className="app-sb-flyout-card-title">
                {hoveredItem.cardTitle}
              </h4>

              <p className="app-sb-flyout-card-desc">
                {hoveredItem.cardDesc}
              </p>

              {hoveredItem.cardTags && hoveredItem.cardTags.length > 0 && (
                <div className="app-sb-flyout-card-tags">
                  {hoveredItem.cardTags.map((tag, idx) => (
                    <span key={idx} className="app-sb-flyout-card-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile UI: Bottom Sticky Navigation Bar (< 1024px) with 5 Icons ── */}
      <nav className="app-mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const IconComponent = item.Icon;

          return (
            <button
              key={`mobile-${item.id}`}
              type="button"
              className={`app-mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleItemClick(item)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Indicator Bar on Top */}
              {isActive && <span className="app-mobile-active-bar" aria-hidden="true" />}

              {/* Mobile Micro-badge for FREE / PAID */}
              {item.badge && (
                <span className={`app-mobile-badge badge-${item.badge.toLowerCase()}`}>
                  {item.badge}
                </span>
              )}

              <span className="app-mobile-icon-wrap" aria-hidden="true">
                <IconComponent size={21} />
              </span>
              <span className="app-mobile-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default AppSidebar;
