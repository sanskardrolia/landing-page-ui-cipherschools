import React, { useState, useEffect, useRef } from 'react';
import { Check, Copy, Gift, ArrowUpRight } from 'lucide-react';
import Diya from './Diya';
import { useDiyaCollection, DIYA_GOAL, COUPON_CODE, DISCOUNT_LABEL, PRO_URL } from '../hooks/useDiwali';
import './Diwali.css';

/* Navbar diya button + dropdown showing diyas collected and the coupon claim */
const DiyaCollectMenu = ({ className = '' }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef(null);
  const { count, claimed, claim } = useDiyaCollection();
  const complete = count >= DIYA_GOAL;

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(COUPON_CODE); } catch { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={`diya-menu ${className}`} ref={wrapRef}>
      <button
        type="button"
        className={`diya-menu-btn ${count === 0 ? 'is-empty' : ''} ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Diyas collected: ${count} of ${DIYA_GOAL}`}
      >
        <Diya size={26} />
        <span className="diya-menu-count">{count}/{DIYA_GOAL}</span>
      </button>

      {open && (
        <div className="diya-menu-panel" role="dialog" aria-label="Deepawali diyas">
          <p className="diya-menu-reward">
            Collect all {DIYA_GOAL} diyas to unlock <strong>{DISCOUNT_LABEL} off</strong> a premium course, a heavy Deepawali discount.
          </p>

          <div className="diya-menu-head">
            <span className="diya-menu-title">Diyas collected</span>
            <span className="diya-menu-score">{count}/{DIYA_GOAL}</span>
          </div>

          <div className="diya-menu-slots">
            {Array.from({ length: DIYA_GOAL }, (_, i) => (
              <span key={i} className={`diya-menu-slot ${i < count ? 'is-lit' : ''}`}>
                <Diya size={30} />
              </span>
            ))}
          </div>

          {!complete && (
            <p className="diya-menu-hint">
              Turn on Deepawali mode on the home page and tap the diyas near the hero mockup to collect them.
            </p>
          )}

          {complete && claimed ? (
            <>
              <div className="diya-menu-coupon">
                <span className="diya-menu-code">{COUPON_CODE}</span>
                <button type="button" className="diya-menu-copy" onClick={copyCode}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <a className="diya-menu-visit" href={PRO_URL} target="_blank" rel="noopener noreferrer">
                Enroll at pro.cipherschools.com <ArrowUpRight size={14} />
              </a>
            </>
          ) : (
            <button type="button" className="diya-menu-claim" disabled={!complete} onClick={claim}>
              <Gift size={15} />
              {complete ? 'Claim discount coupon' : 'Collect all to claim coupon'}
            </button>
          )}

          <ol className="diya-menu-steps">
            <li className={complete ? 'is-done' : ''}>Collect all {DIYA_GOAL} diyas</li>
            <li className={claimed ? 'is-done' : ''}>Click claim (make sure you're logged in)</li>
            <li className={claimed ? 'is-done' : ''}>You'll receive your coupon code</li>
            <li>Visit pro.cipherschools.com and enroll in the course</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default DiyaCollectMenu;
