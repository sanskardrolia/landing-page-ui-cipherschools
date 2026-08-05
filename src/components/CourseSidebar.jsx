import React from 'react';
import { 
  Home, BookOpen, Crown, Code2, Gift, Terminal, FileText, 
  UserCheck, MessageSquare, LogOut 
} from 'lucide-react';
import './CourseSidebar.css';

const SIDEBAR_RAIL_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'courses', label: 'Courses', icon: BookOpen, active: true },
  { id: 'premium', label: 'Premium', icon: Crown, isCrown: true },
  { id: 'cipherlabs', label: 'CipherLabs', icon: Code2 },
  { id: 'rewards', label: 'Rewards', icon: Gift },
  { id: 'compiler', label: 'Compiler', icon: Terminal },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'creator', label: 'Creator', icon: UserCheck },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
];

const CourseSidebar = ({ activeItem = 'courses', setActiveItem }) => {
  return (
    <aside className="cs-exact-sidebar">
      <div className="cs-sidebar-stack">
        {SIDEBAR_RAIL_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              className={`cs-sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveItem && setActiveItem(item.id)}
            >
              <div className="cs-sidebar-icon-wrap">
                <Icon size={20} className={item.isCrown ? 'icon-gold-crown' : ''} />
              </div>
              <span className="cs-sidebar-item-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Signin Item */}
      <div className="cs-sidebar-bottom">
        <button className="cs-sidebar-item cs-signin-item">
          <div className="cs-sidebar-icon-wrap">
            <LogOut size={20} className="cs-signin-icon" />
          </div>
          <span className="cs-sidebar-item-label">Signin</span>
        </button>
      </div>
    </aside>
  );
};

export default CourseSidebar;
