import React from 'react';

// Accurate dot matrix representation of India's geographical silhouette
const INDIA_DOT_GRID = [
  // [row_index, start_col, end_col]
  // Northern Sector (Ladakh, J&K, Himachal, Uttarakhand)
  [0, 16, 18],
  [1, 15, 20],
  [2, 14, 21],
  [3, 13, 21],
  [4, 12, 22],
  [5, 11, 23],
  // Northern Plains & Rajasthan (Punjab, Haryana, Delhi, UP)
  [6, 9, 24],
  [7, 8, 25],
  [8, 7, 26], [8, 30, 35], // Northeast starts
  [9, 6, 27], [9, 29, 36], // Assam, Arunachal, Meghalaya
  // Central & Western Bulge (Gujarat, MP, Bihar, Bengal, Northeast)
  [10, 4, 27], [10, 30, 36], // Kutch, Saurashtra
  [11, 3, 27], [11, 30, 35], // Gujarat peninsulas
  [12, 4, 26], [12, 31, 34], // Gujarat coast, Tripura, Mizoram
  [13, 5, 25],
  // Deccan Plateau & Central East (Maharashtra, Odisha, Chhattisgarh, Telangana)
  [14, 6, 24],
  [15, 7, 23],
  [16, 7, 22],
  // Southern Peninsula (Goa, Karnataka, AP, Telangana)
  [17, 8, 21],
  [18, 8, 20],
  [19, 9, 20],
  // Deep South (Bengaluru, Chennai, Tamil Nadu, Kerala)
  [20, 9, 19],
  [21, 10, 18],
  [22, 10, 17],
  [23, 11, 16],
  [24, 11, 15],
  // Southern Tip (Kanyakumari)
  [25, 12, 15],
  [26, 13, 14]
];

// Major University & Tech Campus Hubs in India with pulse animation
const CAMPUS_HUBS = [
  { name: "Delhi-NCR", r: 6, c: 15, label: "50+ Campuses" },
  { name: "Bengaluru", r: 21, c: 13, label: "60+ Campuses" },
  { name: "Mumbai/Pune", r: 15, c: 9, label: "40+ Campuses" },
  { name: "Hyderabad", r: 17, c: 15, label: "35+ Campuses" },
  { name: "Chennai", r: 21, c: 16, label: "30+ Campuses" },
  { name: "Jaipur", r: 8, c: 12, label: "15+ Campuses" },
  { name: "Kolkata", r: 11, c: 26, label: "20+ Campuses" }
];

const IndiaDotMatrix = ({ className = "" }) => {
  const step = 14;
  const dotRadius = 2.4;
  const viewBoxWidth = 38 * step; // ~532px
  const viewBoxHeight = 28 * step; // ~392px

  const dots = [];
  INDIA_DOT_GRID.forEach(([row, startCol, endCol]) => {
    for (let col = startCol; col <= endCol; col++) {
      // Check if this dot is a special hub
      const isHub = CAMPUS_HUBS.some(h => h.r === row && h.c === col);
      dots.push({
        id: `dot-${row}-${col}`,
        cx: col * step + step / 2,
        cy: row * step + step / 2,
        r: isHub ? 3.4 : dotRadius,
        isHub
      });
    }
  });

  return (
    <div className={`india-dot-matrix-container ${className}`}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="india-dot-matrix-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="CipherSchools Campus Ecosystem across India"
      >
        <defs>
          {/* Radial Glow Filter for Hubs */}
          <filter id="hub-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Linear Brand Gradient for connecting lines */}
          <linearGradient id="map-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3912E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Background Network Mesh Lines between major hubs */}
        <g className="map-network-connections" stroke="rgba(243, 145, 46, 0.15)" strokeWidth="1" strokeDasharray="3 3">
          <line x1={15 * step + 7} y1={6 * step + 7} x2={9 * step + 7} y2={15 * step + 7} />
          <line x1={15 * step + 7} y1={6 * step + 7} x2={15 * step + 7} y2={17 * step + 7} />
          <line x1={15 * step + 7} y1={6 * step + 7} x2={26 * step + 7} y2={11 * step + 7} />
          <line x1={9 * step + 7} y1={15 * step + 7} x2={13 * step + 7} y2={21 * step + 7} />
          <line x1={15 * step + 7} y1={17 * step + 7} x2={13 * step + 7} y2={21 * step + 7} />
          <line x1={13 * step + 7} y1={21 * step + 7} x2={16 * step + 7} y2={21 * step + 7} />
          <line x1={26 * step + 7} y1={11 * step + 7} x2={15 * step + 7} y2={17 * step + 7} />
        </g>

        {/* Regular Dot Matrix Array (Brand Orange #F3912E matching user sample) */}
        <g className="india-matrix-dots">
          {dots.map(dot => (
            <circle
              key={dot.id}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              className={dot.isHub ? "matrix-dot dot-hub" : "matrix-dot"}
              fill={dot.isHub ? "#F3912E" : "#F3912E"}
              fillOpacity={dot.isHub ? 1 : 0.45}
            />
          ))}
        </g>

        {/* Pulsing Campus Hub Radar Rings */}
        <g className="india-hub-radars">
          {CAMPUS_HUBS.map(hub => {
            const hx = hub.c * step + step / 2;
            const hy = hub.r * step + step / 2;
            return (
              <g key={`hub-radar-${hub.name}`} className="hub-radar-group">
                {/* Outer animated ripple */}
                <circle
                  cx={hx}
                  cy={hy}
                  r="10"
                  fill="none"
                  stroke="#F3912E"
                  strokeWidth="1.2"
                  className="radar-pulse-ring"
                />
                {/* Core bright node */}
                <circle
                  cx={hx}
                  cy={hy}
                  r="3.8"
                  fill="#FF7A00"
                  filter="url(#hub-glow)"
                />
                <circle
                  cx={hx}
                  cy={hy}
                  r="1.8"
                  fill="#FFFFFF"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default IndiaDotMatrix;
