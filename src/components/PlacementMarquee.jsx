import React from 'react';
import { Sparkles, Building2 } from 'lucide-react';
import './PlacementMarquee.css';

const CompanyLogos = {
  Google: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  ),
  Microsoft: (
    <svg width="15" height="15" viewBox="0 0 23 23">
      <path fill="#f35325" d="M1 1h10v10H1z"/>
      <path fill="#81bc06" d="M12 1h10v10H12z"/>
      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
      <path fill="#ffba08" d="M12 12h10v10H12z"/>
    </svg>
  ),
  Amazon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF9900">
      <path d="M13.96 12.33c-.08-.6-.35-1.07-.82-1.42s-1.12-.53-1.96-.53c-.63 0-1.22.12-1.77.36-.55.24-.96.59-1.23 1.05l1.32.9c.14-.24.34-.43.6-.57.26-.14.54-.21.84-.21.43 0 .76.1.98.29.22.19.33.45.33.78v.37c-.37.04-.84.09-1.41.15s-1.1.18-1.59.36c-.49.18-.88.44-1.17.78-.29.34-.44.78-.44 1.32 0 .54.18.98.54 1.32.36.34.84.51 1.44.51.53 0 1-.12 1.41-.36.41-.24.73-.57.96-1.01v1.17h1.67V12.33zm-1.84 2.82c-.2.32-.47.56-.8.72-.33.16-.69.24-1.08.24-.34 0-.62-.09-.84-.27-.22-.18-.33-.42-.33-.72 0-.35.14-.64.42-.87.28-.23.75-.41 1.41-.54.66-.13 1.15-.22 1.47-.27v.29c0 .54-.08.99-.25 1.42z"/>
      <path d="M19.16 16.73c-2.8 2.06-6.87 3.15-10.37 3.15-4.89 0-9.3-1.83-12.63-4.9.26.24.8.46 1.32.46 2.94 0 7.37-1.62 9.94-3.15.22-.13.46.12.26.31-1.08.98-3.08 2.29-6.3 2.29-1.03 0-2.02-.15-2.92-.47 3.01 2.37 6.87 3.79 11.08 3.79 3.16 0 6.64-.86 9.42-2.61.34-.21.57.17.2.13z"/>
    </svg>
  ),
  LinkedIn: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
    </svg>
  ),
  PayPal: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#003087">
      <path d="M20.067 8.478c.492.315.844.763 1.046 1.336.208.59.185 1.334-.069 2.218-.696 2.42-2.282 3.655-4.757 3.655h-1.42a.846.846 0 0 0-.834.717l-.804 5.093c-.035.221-.225.385-.45.385h-2.923a.465.465 0 0 1-.46-.537l2.274-14.4c.036-.222.226-.386.45-.386h5.367c1.472 0 2.585.347 3.328 1.037.158.147.294.309.407.485zm-4.716 3.385c.34-.148.608-.383.79-.693.18-.31.258-.698.225-1.151-.067-.937-.775-1.416-2.107-1.416h-2.31l-.924 5.852h1.69c1.196 0 2.05-.333 2.566-.992z"/>
    </svg>
  ),
  Adobe: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
      <path d="M13.966 22h6.034L20 2H13.966v20zM4 2v20h6.034L4 2zm5.017 11.207l2.983-7.207 4.966 12h-3.414l-1.552-3.828H9.017z"/>
    </svg>
  ),
  OpenAI: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#10A37F">
      <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.04 6.04 0 0 0-6.51-2.9 6.07 6.07 0 0 0-4.66-2.08 6.06 6.06 0 0 0-5.78 4.2 6.05 6.05 0 0 0-4.14 3 6.06 6.06 0 0 0 .74 6.56 5.98 5.98 0 0 0 .52 4.91 6.04 6.04 0 0 0 6.51 2.9 6.04 6.04 0 0 0 4.66 2.08 6.06 6.06 0 0 0 5.78-4.2 6.05 6.05 0 0 0 4.14-3 6.06 6.06 0 0 0-.74-6.56zm-9.78 12.08a4.44 4.44 0 0 1-2.58-.8l.13-.23 3.63-2.1a.8.8 0 0 0 .4-.69v-5.13l1.53.88a.07.07 0 0 1 .04.06v5.82a4.47 4.47 0 0 1-3.15 2.06zm-8.31-3.95a4.45 4.45 0 0 1-.49-2.65l.24.14 3.63 2.1a.8.8 0 0 0 .8 0l4.44-2.56v1.76a.07.07 0 0 1-.03.06l-5.04 2.91a4.47 4.47 0 0 1-3.55-1.76zm-1.8-9.15a4.45 4.45 0 0 1 2.09-1.85l.11.24 3.63 2.1a.8.8 0 0 0 .8 0l4.44-2.56v1.77a.07.07 0 0 1-.03.06l-5.04 2.91a4.47 4.47 0 0 1-6-2.67z"/>
    </svg>
  ),
  Figma: (
    <svg width="15" height="15" viewBox="0 0 38 57">
      <path fill="#F24E1E" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
      <path fill="#A259FF" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
      <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z"/>
      <path fill="#FF7262" d="M19 0h9.5a9.5 9.5 0 1 1 0 19H19V0z"/>
      <path fill="#1ABCFE" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z"/>
      <path fill="#0ACF83" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
    </svg>
  ),
  Vercel: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#000000">
      <path d="M12 1L24 22H0L12 1Z"/>
    </svg>
  ),
  NVIDIA: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#76B900">
      <path d="M11.5 3.5c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-1.5 12v-8l5 4-5 4z"/>
    </svg>
  ),
  Walmart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFC220">
      <path d="M12 2.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-3 0V4A1.5 1.5 0 0 1 12 2.5zm6.71 3.79a1.5 1.5 0 0 1 0 2.12l-2.12 2.12a1.5 1.5 0 1 1-2.12-2.12l2.12-2.12a1.5 1.5 0 0 1 2.12 0zm-13.42 0a1.5 1.5 0 0 1 2.12 0l2.12 2.12a1.5 1.5 0 0 1-2.12 2.12L5.29 8.41a1.5 1.5 0 0 1 0-2.12zM12 17a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-3 0v-3A1.5 1.5 0 0 1 12 17z"/>
    </svg>
  )
};

const PlacementMarquee = () => {
  const row1 = [
    { name: 'Google' },
    { name: 'PayPal' },
    { name: 'Amazon' },
    { name: 'LinkedIn' },
    { name: 'JPMorgan' },
    { name: 'Walmart' },
    { name: 'Adobe' },
    { name: 'Microsoft' },
    { name: 'JusPay' },
  ];

  const row2 = [
    { name: 'Morgan Stanley' },
    { name: 'OpenAI' },
    { name: 'Figma' },
    { name: 'NVIDIA' },
    { name: 'Vercel' },
    { name: 'Atlassian' },
    { name: 'Uber' },
    { name: 'Goldman Sachs' },
    { name: 'Flipkart' },
  ];

  const row1Marquee = [...row1, ...row1, ...row1, ...row1];
  const row2Marquee = [...row2, ...row2, ...row2, ...row2];

  return (
    <section className="placement-marquee-section">
      <div className="placement-container">
        
        {/* Top Header */}
        <div className="placement-header">
          <div className="placement-eyebrow-pill">
            <Sparkles size={13} className="placement-sparkle" />
            <span>PLACEMENT SUCCESS</span>
          </div>
          <h2 className="placement-main-title">
            Our Students Are Hired At
          </h2>
          <p className="placement-subtitle">
            Some of the top product based companies around the world
          </p>
        </div>

        {/* Double Marquee Rows */}
        <div className="placement-double-marquee-stage">
          {/* Row 1: Leftward Auto-Scroll */}
          <div className="placement-marquee-wrap">
            <div className="placement-track marquee-track-left">
              {row1Marquee.map((item, index) => (
                <div key={`pill-r1-${index}`} className="placement-pill-card">
                  <span className="placement-company-logo">
                    {CompanyLogos[item.name] || <Building2 size={16} className="company-fallback-icon" />}
                  </span>
                  <span className="placement-company-name">{item.name}</span>
                  <span className="placement-dot-sep">•</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Rightward Auto-Scroll */}
          <div className="placement-marquee-wrap">
            <div className="placement-track marquee-track-right">
              {row2Marquee.map((item, index) => (
                <div key={`pill-r2-${index}`} className="placement-pill-card">
                  <span className="placement-company-logo">
                    {CompanyLogos[item.name] || <Building2 size={16} className="company-fallback-icon" />}
                  </span>
                  <span className="placement-company-name">{item.name}</span>
                  <span className="placement-dot-sep">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PlacementMarquee;
