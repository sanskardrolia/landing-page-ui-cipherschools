import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* ──────────────────────────────────────────────────────────────
   Home (/) is for students; universities have their own page
   (/university). Links that point at a section ("#lms-section")
   open whichever page owns it, then scroll there.
   ────────────────────────────────────────────────────────────── */

export const UNIVERSITY_SECTIONS = new Set([
  'university-section', 'training-section', 'lms-section', 'assessment-section', 'practice-section', 'mock-interview-section'
]);

export const pageForSection = (id) => (UNIVERSITY_SECTIONS.has(id) ? '/university' : '/');

const NAV_OFFSET = 72; // fixed navbar

const scrollToId = (id, behavior = 'smooth') => {
  const el = document.getElementById(id);
  if (!el) return false;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET, behavior });
  return true;
};

/* Go to a section: scroll if it's on this page, otherwise open its page at that section */
export const goToSection = (navigate, pathname, id) => {
  const page = pageForSection(id);
  if (pathname === page) {
    if (id === 'university-section' || id === 'hero-impact-section') window.scrollTo({ top: 0, behavior: 'smooth' });
    else scrollToId(id);
    return;
  }
  const top = id === 'university-section' || id === 'hero-impact-section';
  navigate(top ? page : `${page}#${id}`);
};

/* On a page, honour #section in the URL once the page has settled (some sections
   scroll to top on mount or animate in, so keep nudging for a moment). */
export const useHashScroll = () => {
  const { hash } = useLocation();
  useEffect(() => {
    const id = hash.replace('#', '');
    if (!id) return undefined;
    let tries = 0;
    const t = setInterval(() => {
      tries += 1;
      const el = document.getElementById(id);
      if (!el) return;
      const target = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      if (Math.abs(window.scrollY - target) < 8 || tries > 14) { clearInterval(t); return; }
      window.scrollTo({ top: target });
    }, 120);
    return () => clearInterval(t);
  }, [hash]);
};
