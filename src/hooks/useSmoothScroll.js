import { useEffect } from 'react';

/**
 * Custom hook to dampen scroll speed by ~50% (1 scroll/swipe = 1/2 distance)
 * with buttery smooth lerp physics for enhanced reading pace.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let isRunning = false;
    let isTouching = false;
    let lastTouchY = 0;
    let isProgrammatic = false;

    const SPEED_MULTIPLIER = 0.5; // Exactly half-speed scroll distance
    const LERP_FACTOR = 0.085;     // Smooth inertia easing factor

    const getMaxScroll = () => {
      return Math.max(
        0,
        (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight
      );
    };

    const isInsideScrollableModal = (target) => {
      if (!target) return false;
      let el = target;
      while (el && el !== document.body && el !== document.documentElement) {
        if (
          el.classList?.contains('bm-modal-overlay') ||
          el.classList?.contains('bm-modal-content')
        ) {
          return true;
        }
        const style = window.getComputedStyle(el);
        if (
          (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight
        ) {
          return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const animate = () => {
      const diff = targetScrollY - currentScrollY;
      
      if (Math.abs(diff) > 0.4) {
        currentScrollY += diff * LERP_FACTOR;
        isProgrammatic = true;
        window.scrollTo(0, Math.round(currentScrollY));
        requestAnimationFrame(animate);
      } else {
        currentScrollY = targetScrollY;
        isProgrammatic = true;
        window.scrollTo(0, Math.round(currentScrollY));
        isRunning = false;
      }
    };

    const startAnimation = () => {
      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(animate);
      }
    };

    // ── Mouse Wheel / Trackpad Handler ──
    const handleWheel = (e) => {
      // Allow modal / internal scrollable elements to scroll normally
      if (isInsideScrollableModal(e.target)) {
        return;
      }

      // Check if body scroll is locked
      if (document.body.style.overflow === 'hidden') {
        return;
      }

      // Prevent native instant jumping so we can apply 50% dampened smooth glide
      e.preventDefault();

      const delta = e.deltaY * SPEED_MULTIPLIER;
      const maxScroll = getMaxScroll();

      // If animation was resting, sync starting point
      if (!isRunning) {
        targetScrollY = window.scrollY;
        currentScrollY = window.scrollY;
      }

      targetScrollY = Math.max(0, Math.min(targetScrollY + delta, maxScroll));
      startAnimation();
    };

    // ── Touch Handlers for Mobile / Tablet ──
    const handleTouchStart = (e) => {
      if (isInsideScrollableModal(e.target)) return;
      isTouching = true;
      lastTouchY = e.touches[0].clientY;
      targetScrollY = window.scrollY;
      currentScrollY = window.scrollY;
    };

    const handleTouchMove = (e) => {
      if (!isTouching || isInsideScrollableModal(e.target)) return;
      if (document.body.style.overflow === 'hidden') return;

      const touchY = e.touches[0].clientY;
      const rawDelta = (lastTouchY - touchY) * SPEED_MULTIPLIER;
      lastTouchY = touchY;

      // Prevent high-velocity native swipe bypass
      e.preventDefault();

      const maxScroll = getMaxScroll();
      targetScrollY = Math.max(0, Math.min(targetScrollY + rawDelta, maxScroll));
      startAnimation();
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    // ── Sync when native programmatic scroll occurs (Anchor links, window.scrollTo) ──
    const handleScroll = () => {
      if (!isProgrammatic) {
        targetScrollY = window.scrollY;
        currentScrollY = window.scrollY;
      }
      isProgrammatic = false;
    };

    // ── Keyboard Navigation (Arrow keys, Page Up/Down, Space) ──
    const handleKeyDown = (e) => {
      if (['input', 'textarea', 'select'].includes(e.target.tagName?.toLowerCase())) return;
      if (isInsideScrollableModal(e.target)) return;

      let keyDelta = 0;
      if (e.key === 'ArrowDown') keyDelta = 60 * SPEED_MULTIPLIER;
      else if (e.key === 'ArrowUp') keyDelta = -60 * SPEED_MULTIPLIER;
      else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) keyDelta = 300 * SPEED_MULTIPLIER;
      else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) keyDelta = -300 * SPEED_MULTIPLIER;

      if (keyDelta !== 0) {
        e.preventDefault();
        const maxScroll = getMaxScroll();
        if (!isRunning) {
          targetScrollY = window.scrollY;
          currentScrollY = window.scrollY;
        }
        targetScrollY = Math.max(0, Math.min(targetScrollY + keyDelta, maxScroll));
        startAnimation();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
