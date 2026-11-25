/* ══════════════════════════════════════════════════════════════
   /waitlist — DEMO helpers. Nothing is sent anywhere: sign-ups live
   in this browser's localStorage so the flow can be shown end to end.
   Wire `joinWaitlist` to a real API before using it for real.
   ══════════════════════════════════════════════════════════════ */

const KEY = 'cs_waitlist_demo';
export const WAITLIST_BASE = 1248; // people "already" waiting in the demo

const readAll = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const writeAll = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* storage off */ } };

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/* short, stable code from an email (used for the referral link: the email itself never goes in a URL) */
export const codeFor = (email) => {
  let h = 2166136261;
  for (const ch of email.trim().toLowerCase()) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36).toUpperCase().padStart(7, '0').slice(0, 7);
};

export const waitingCount = () => WAITLIST_BASE + Object.keys(readAll()).length;

/* join (or re-open) a spot; same email → same number */
export const joinWaitlist = (email) => {
  const key = email.trim().toLowerCase();
  const all = readAll();
  if (!all[key]) {
    all[key] = { number: WAITLIST_BASE + Object.keys(all).length + 1, joined: new Date().toISOString() };
    writeAll(all);
  }
  return { email: key, code: codeFor(key), ...all[key] };
};

/* "sanskar.drolia99@x.com" → "Sanskar Drolia" */
export const nameFrom = (email) => email.split('@')[0]
  .replace(/[0-9]+/g, ' ')
  .split(/[._\-+\s]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
  .join(' ') || 'Early Member';

export const maskEmail = (email) => {
  const [u, d] = email.split('@');
  return `${u.slice(0, 2)}${'•'.repeat(Math.max(2, Math.min(6, u.length - 2)))}@${d}`;
};

export const pad = (n) => String(n).padStart(5, '0');
export const fmtJoined = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

export const shareUrl = (code) => `${window.location.origin}/waitlist?ref=${code}`;
export const shareText = (number) => `I just joined the CipherSchools waitlist. I'm #${pad(number)} in line for what's next. Grab your spot before it fills up:`;

/* Download the pass as a PNG (drawn on a canvas, so it works without extra libraries) */
export const downloadPass = async ({ name, number, joined, code, qr }) => {
  const W = 1200; const H = 756;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const r = 44;
  g.beginPath(); g.roundRect(0, 0, W, H, r); g.clip();
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#FFFFFF'); bg.addColorStop(0.55, '#FFF9F3'); bg.addColorStop(1, '#F8F5FF');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * 0.82, H * 0.1, 10, W * 0.82, H * 0.1, 620);
  glow.addColorStop(0, 'rgba(243,145,46,0.22)'); glow.addColorStop(1, 'rgba(243,145,46,0)');
  g.fillStyle = glow; g.fillRect(0, 0, W, H);

  g.fillStyle = '#F3912E'; g.font = '800 34px Unbounded, Inter, sans-serif'; g.fillText('CIPHERSCHOOLS', 72, 104);
  g.fillStyle = '#C2620A'; g.font = '600 24px "JetBrains Mono", monospace'; g.fillText('EARLY ACCESS PASS', 72, 146);
  g.fillStyle = '#8A8580';

  g.fillStyle = '#8A8580'; g.font = '600 22px "JetBrains Mono", monospace'; g.fillText('WAITLIST NO.', 72, 300);
  g.fillStyle = '#0B0B0D'; g.font = '800 150px Unbounded, Inter, sans-serif'; g.fillText(`#${pad(number)}`, 64, 440);

  g.fillStyle = '#0B0B0D'; g.font = '700 46px Inter, sans-serif'; g.fillText(name, 72, 560);
  g.fillStyle = '#6B6560'; g.font = '600 22px "JetBrains Mono", monospace';
  g.fillText(`JOINED ${fmtJoined(joined)}   ·   CODE ${code}`, 72, 610);
  g.fillStyle = '#C2620A'; g.font = '700 26px Inter, sans-serif'; g.fillText('Join the waitlist → cipherschools.com/waitlist', 72, 690);

  if (qr) {
    const img = new Image();
    img.src = qr;
    await img.decode().catch(() => {});
    g.fillStyle = '#FFFFFF'; g.strokeStyle = '#ECE7E1'; g.lineWidth = 2; g.beginPath(); g.roundRect(W - 292, H - 292, 220, 220, 18); g.fill(); g.stroke();
    g.drawImage(img, W - 282, H - 282, 200, 200);
  }
  const a = document.createElement('a');
  a.download = `cipherschools-pass-${pad(number)}.png`;
  a.href = c.toDataURL('image/png');
  a.click();
};
