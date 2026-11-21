import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User } from 'lucide-react';
import { PROFILE_LINKS } from '../data/profileLinks';
import { getEnrollment } from '../utils/enrollment';
import './NavProfileMenu.css';

/* Navbar profile icon with a small drop-down: Dashboard, Resume, Compiler, ATS Checker */
const initialsOf = (name = '') => name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const NavProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const [enrollment] = useState(getEnrollment);
  const ref = useRef(null);
  const name = enrollment?.learner?.name?.trim();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div className="npm" ref={ref}>
      <button type="button" className={`npm-btn ${open ? 'is-open' : ''}`} onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} aria-label="Profile menu">
        <span className="npm-avatar">{name ? initialsOf(name) : <User size={16} />}</span>
        <ChevronDown size={14} className="npm-chev" />
      </button>
      {open && (
        <div className="npm-pop" role="menu">
          {name && (
            <div className="npm-head">
              <strong>{name}</strong>
              <small>{enrollment?.planName ? `${enrollment.planName} plan` : 'Learner'}</small>
            </div>
          )}
          {PROFILE_LINKS.map((l) => (
            <Link key={l.to} to={l.to} role="menuitem" className="npm-item" onClick={() => setOpen(false)}>
              <span className="npm-icon"><l.Icon size={16} /></span>
              <span><strong>{l.label}</strong><small>{l.hint}</small></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavProfileMenu;
