import QRCode from 'qrcode';
import { CATALOG } from '../data/goalTracks';

/* ══════════════════════════════════════════════════════════════
   Downloadable roadmap (PNG). roadmap.sh-style: a vertical spine
   with numbered stage cards on alternating sides, each tagged with
   the CipherSchools module that teaches it. A QR code at the end
   opens this same roadmap on the site to get started.
   ══════════════════════════════════════════════════════════════ */

const W = 1080;
const INK = '#111827';
const MUTED = '#6B7280';
const LINE = '#E5E7EB';
const ACCENT = '#E8801A';
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif';

const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

/* wrap text into lines that fit maxW */
const wrap = (ctx, text, maxW) => {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  words.forEach((w) => {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width > maxW && cur) { lines.push(cur); cur = w; } else cur = next;
  });
  if (cur) lines.push(cur);
  return lines;
};

export const roadmapLink = (trackId) => `${window.location.origin}/?goal=${encodeURIComponent(trackId)}&utm_source=roadmap_qr#roadmap`;

export const downloadRoadmap = async (track) => {
  const CARD_W = 420;
  const CARD_H = 150;
  const GAP = 34;
  const TOP = 300;
  const stagesH = track.stages.length * (CARD_H + GAP);
  const H = TOP + stagesH + 300;

  const canvas = document.createElement('canvas');
  const scale = 2; // crisp when printed or zoomed
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // page
  ctx.fillStyle = '#FBFAF8';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(17,24,39,0.05)';
  for (let x = 20; x < W; x += 24) for (let y = 20; y < H; y += 24) ctx.fillRect(x, y, 1.5, 1.5);

  // header
  ctx.fillStyle = ACCENT;
  ctx.font = `800 20px ${FONT}`;
  ctx.fillText('CipherSchools', 72, 86);
  ctx.fillStyle = MUTED;
  ctx.font = `600 16px ${FONT}`;
  ctx.fillText('ROADMAP', 72 + ctx.measureText('CipherSchools  ').width + 40, 86);
  ctx.fillStyle = INK;
  ctx.font = `800 46px ${FONT}`;
  ctx.fillText(track.title, 72, 150);
  ctx.fillStyle = MUTED;
  ctx.font = `400 19px ${FONT}`;
  wrap(ctx, track.blurb, W - 144).forEach((l, i) => ctx.fillText(l, 72, 192 + i * 28));
  const weeks = track.stages.reduce((a, s) => a + s.weeks, 0);
  ctx.fillStyle = INK;
  ctx.font = `600 16px ${FONT}`;
  ctx.fillText(`${track.stages.length} stages  ·  about ${weeks} weeks at 8–10 hrs a week  ·  Best with ${track.plan}`, 72, 262);

  // spine
  const cx = W / 2;
  ctx.strokeStyle = '#D1D5DB';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(cx, TOP);
  ctx.lineTo(cx, TOP + stagesH - GAP);
  ctx.stroke();
  ctx.setLineDash([]);

  track.stages.forEach((s, i) => {
    const y = TOP + i * (CARD_H + GAP);
    const left = i % 2 === 0;
    const x = left ? cx - 40 - CARD_W : cx + 40;
    // connector + node
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left ? x + CARD_W : x, y + CARD_H / 2);
    ctx.lineTo(cx, y + CARD_H / 2);
    ctx.stroke();
    ctx.fillStyle = ACCENT;
    ctx.beginPath();
    ctx.arc(cx, y + CARD_H / 2, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `800 15px ${FONT}`;
    const n = String(i + 1);
    ctx.fillText(n, cx - ctx.measureText(n).width / 2, y + CARD_H / 2 + 5);
    // card
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, CARD_W, CARD_H, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.font = `700 20px ${FONT}`;
    ctx.fillText(s.title, x + 22, y + 38);
    const mod = CATALOG[s.mod];
    ctx.fillStyle = '#FFF4E8';
    ctx.font = `700 13px ${FONT}`;
    const tag = `${mod.title}  ·  ${s.weeks} wk`;
    const tw = ctx.measureText(tag).width + 20;
    roundRect(ctx, x + 22, y + 52, tw, 26, 5);
    ctx.fill();
    ctx.fillStyle = '#9A4D0A';
    ctx.fillText(tag, x + 32, y + 70);
    ctx.fillStyle = MUTED;
    ctx.font = `400 15px ${FONT}`;
    wrap(ctx, s.topics.join('  ·  '), CARD_W - 44).slice(0, 2).forEach((l, k) => ctx.fillText(l, x + 22, y + 106 + k * 22));
  });

  // footer: QR to get started
  const fy = TOP + stagesH + 20;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = LINE;
  roundRect(ctx, 72, fy, W - 144, 220, 12);
  ctx.fill();
  ctx.stroke();
  const qr = await QRCode.toDataURL(roadmapLink(track.id), { margin: 1, width: 360, color: { dark: INK, light: '#FFFFFF' } });
  const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = qr; });
  ctx.drawImage(img, W - 72 - 24 - 176, fy + 22, 176, 176);
  ctx.fillStyle = INK;
  ctx.font = `800 28px ${FONT}`;
  ctx.fillText('Scan to start this roadmap', 104, fy + 74);
  ctx.fillStyle = MUTED;
  ctx.font = `400 18px ${FONT}`;
  wrap(ctx, 'Opens this roadmap on CipherSchools with the lectures, practice, tests and A.I. mock interviews for every stage.', 560)
    .forEach((l, i) => ctx.fillText(l, 104, fy + 112 + i * 27));
  ctx.fillStyle = ACCENT;
  ctx.font = `700 17px ${FONT}`;
  ctx.fillText('cipherschools.com', 104, fy + 190);

  // save
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cipherschools-roadmap-${track.id}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};
