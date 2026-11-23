import {
  SiAtlassian, SiGoldmansachs, SiGoogle, SiIntuit, SiNvidia, SiPaypal, SiPaytm, SiPhonepe, SiPostman, SiRazorpay, SiSamsung,
  SiSwiggy, SiUber, SiZerodha, SiZoho, SiZomato
} from 'react-icons/si';
import './PlacedLogos.css';

/* ══════════════════════════════════════════════════════════════
   Home › proof strip: "Students placed at". Top companies and Indian
   startups scroll right → left in neutral grey; hovering one brings
   back its real brand colour (and pauses the strip).
   Logos come from Simple Icons (react-icons/si). Brands that aren't in
   that set (Amazon, Microsoft, Flipkart, CRED) show as text wordmarks.
   ⚠ Keep this list to companies students have actually been placed at.
   ══════════════════════════════════════════════════════════════ */

const COMPANIES = [
  { name: 'Google', Icon: SiGoogle, color: '#4285F4' },
  { name: 'Microsoft', mark: 'ms', color: '#00A4EF' },
  { name: 'Amazon', mark: 'text', color: '#FF9900' },
  { name: 'Atlassian', Icon: SiAtlassian, color: '#0052CC' },
  { name: 'Uber', Icon: SiUber, color: '#000000' },
  { name: 'Goldman Sachs', Icon: SiGoldmansachs, color: '#7399C6' },
  { name: 'Razorpay', Icon: SiRazorpay, color: '#0C2451' },
  { name: 'CRED', mark: 'text', color: '#111111', caps: true },
  { name: 'Flipkart', mark: 'text', color: '#2874F0' },
  { name: 'Swiggy', Icon: SiSwiggy, color: '#FC8019' },
  { name: 'Zomato', Icon: SiZomato, color: '#E23744' },
  { name: 'PhonePe', Icon: SiPhonepe, color: '#5F259F' },
  { name: 'Paytm', Icon: SiPaytm, color: '#00BAF2' },
  { name: 'Zerodha', Icon: SiZerodha, color: '#387ED1' },
  { name: 'Postman', Icon: SiPostman, color: '#FF6C37' },
  { name: 'Zoho', Icon: SiZoho, color: '#E42527' },
  { name: 'Intuit', Icon: SiIntuit, color: '#236CFF' },
  { name: 'PayPal', Icon: SiPaypal, color: '#003087' },
  { name: 'NVIDIA', Icon: SiNvidia, color: '#76B900' },
  { name: 'Samsung', Icon: SiSamsung, color: '#1428A0' }
];

/* Microsoft's four squares (plain shapes, drawn here) */
const MsMark = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className="pl-ms">
    <rect x="0" y="0" width="9.2" height="9.2" style={{ '--c': '#F25022' }} />
    <rect x="10.8" y="0" width="9.2" height="9.2" style={{ '--c': '#7FBA00' }} />
    <rect x="0" y="10.8" width="9.2" height="9.2" style={{ '--c': '#00A4EF' }} />
    <rect x="10.8" y="10.8" width="9.2" height="9.2" style={{ '--c': '#FFB900' }} />
  </svg>
);

const Logo = ({ c }) => (
  <li className={`pl-logo ${c.caps ? 'is-caps' : ''} ${c.mark === 'text' ? 'is-word' : ''}`} style={{ '--brand': c.color }}>
    {c.Icon && <c.Icon size={20} aria-hidden="true" />}
    {c.mark === 'ms' && <MsMark />}
    <span>{c.name}</span>
  </li>
);

const PlacedLogos = () => (
  <section className="pl-section" aria-label="Companies our students have been placed at">
    <p className="pl-title">Our platform has helped students crack interviews at companies like</p>
    <div className="pl-marquee">
      {/* two copies back to back so the loop is seamless; the second is hidden from screen readers */}
      <ul className="pl-track">
        {COMPANIES.map((c) => <Logo key={c.name} c={c} />)}
      </ul>
      <ul className="pl-track" aria-hidden="true">
        {COMPANIES.map((c) => <Logo key={c.name} c={c} />)}
      </ul>
    </div>
  </section>
);

export default PlacedLogos;
