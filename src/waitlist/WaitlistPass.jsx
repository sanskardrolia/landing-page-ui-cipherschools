import { useRef } from 'react';
import { fmtJoined, maskEmail, nameFrom, pad } from './waitlistUtils';

/* The early-access pass. 3D: tilts toward the pointer, a glare follows it and a holographic
   foil shifts with the angle. With no `pass` it is the locked teaser shown before joining. */
const WaitlistPass = ({ pass = null, qr = null, size = 'lg' }) => {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * 18}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 22}deg`);
    el.style.setProperty('--gx', `${x * 100}%`);
    el.style.setProperty('--gy', `${y * 100}%`);
    el.style.setProperty('--hue', `${Math.round(x * 140 + y * 80)}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    ['--rx', '--ry'].forEach((k) => el.style.setProperty(k, '0deg'));
  };

  const locked = !pass;
  return (
    <div className={`wl-pass-wrap is-${size}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div ref={ref} className={`wl-pass ${locked ? 'is-locked' : 'is-live'}`} aria-label={locked ? 'Your early access pass, locked' : `Early access pass number ${pad(pass.number)}`}>
        <span className="wl-pass-mesh" aria-hidden="true" />
        <span className="wl-pass-glyphs" aria-hidden="true">{'01{}<>/#=;'.repeat(18)}</span>
        <span className="wl-pass-foil" aria-hidden="true" />
        <span className="wl-pass-glare" aria-hidden="true" />

        <div className="wl-pass-top">
          <span className="wl-pass-brand"><img src="/cipherschools-logo.png" alt="" /> CIPHERSCHOOLS</span>
          <span className="wl-pass-season">SEASON 01</span>
        </div>
        <div className="wl-pass-chiprow">
          <span className="wl-pass-chip" aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="wl-pass-kind">EARLY ACCESS PASS</span>
        </div>

        <div className="wl-pass-num">
          <small>WAITLIST NO.</small>
          <strong>{locked ? '#?????' : `#${pad(pass.number)}`}</strong>
        </div>

        <div className="wl-pass-bottom">
          <div className="wl-pass-who">
            <b>{locked ? 'Your name here' : nameFrom(pass.email)}</b>
            <small>{locked ? 'you@email.com' : maskEmail(pass.email)}</small>
            <span className="wl-pass-meta">
              <em>JOINED {locked ? '— — —' : fmtJoined(pass.joined)}</em>
            </span>
          </div>
          <span className="wl-pass-qr">{qr && !locked ? <img src={qr} alt="QR code to join the waitlist" /> : <i aria-hidden="true" />}</span>
        </div>

        {locked && <span className="wl-pass-lock" aria-hidden="true">Join to unlock</span>}
      </div>
    </div>
  );
};

export default WaitlistPass;
