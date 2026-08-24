import React from 'react';

// Key campus and university ecosystem nodes across India
const CAMPUS_HUBS = [
  { name: "Delhi-NCR", x: 198, y: 158, label: "50+ Campuses" },
  { name: "Bengaluru", x: 178, y: 395, label: "60+ Campuses" },
  { name: "Mumbai / Pune", x: 128, y: 295, label: "40+ Campuses" },
  { name: "Hyderabad", x: 202, y: 312, label: "35+ Campuses" },
  { name: "Chennai", x: 218, y: 405, label: "30+ Campuses" },
  { name: "Jaipur", x: 154, y: 192, label: "15+ Campuses" },
  { name: "Kolkata", x: 338, y: 232, label: "20+ Campuses" },
  { name: "Chandigarh", x: 180, y: 126, label: "12+ Campuses" },
  { name: "Ahmedabad", x: 108, y: 230, label: "18+ Campuses" }
];

const India2DMap = ({ className = "" }) => {
  return (
    <div className={`india-2d-map-container ${className}`}>
      <svg
        viewBox="0 0 460 520"
        className="india-2d-map-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="2D Map of India - CipherSchools Ecosystem"
      >
        <defs>
          {/* Main 2D India Gradient Fill */}
          <linearGradient id="india-2d-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3912E" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#FF7A00" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#F3912E" stopOpacity="0.05" />
          </linearGradient>

          {/* Accent Border Gradient */}
          <linearGradient id="india-2d-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3912E" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF7A00" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F3912E" stopOpacity="0.25" />
          </linearGradient>

          {/* Internal Terrain Shading Gradient */}
          <linearGradient id="india-internal-glow" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F3912E" stopOpacity="0.08" />
          </linearGradient>

          {/* Hub Glow Filter */}
          <filter id="hub-glow-2d" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Subtle Ambient Drop Shadow Silhouette */}
        <path
          d="M202,28 
             C210,32 225,48 232,58 
             C238,68 250,80 252,94 
             C254,106 244,116 236,122 
             C246,125 264,136 280,146 
             C294,155 315,160 326,164 
             C332,156 338,150 346,150 
             C352,152 355,160 358,168 
             C368,168 385,162 396,160 
             C412,158 436,168 442,180 
             C446,192 434,204 424,208 
             C412,212 400,214 394,226 
             C388,236 394,252 390,264 
             C384,274 366,278 358,266 
             C352,254 350,240 342,236 
             C334,232 320,240 318,252 
             C314,266 304,286 296,298 
             C284,316 270,336 256,360 
             C248,374 242,392 236,410 
             C228,432 216,456 204,476 
             C196,490 188,498 184,498 
             C180,498 174,484 168,464 
             C160,438 152,408 146,380 
             C140,352 134,324 130,296 
             C126,272 118,260 98,256 
             C76,252 52,246 44,236 
             C36,224 46,206 66,200 
             C82,196 102,192 108,180 
             C112,170 102,156 106,144 
             C112,130 128,122 142,112 
             C156,102 168,88 174,70 
             C180,52 192,30 202,28 Z"
          fill="rgba(243, 145, 46, 0.08)"
          transform="translate(4, 6)"
          filter="blur(8px)"
        />

        {/* Main 2D Vector Map Body of India */}
        <path
          className="india-main-path"
          d="M202,28 
             C210,32 225,48 232,58 
             C238,68 250,80 252,94 
             C254,106 244,116 236,122 
             C246,125 264,136 280,146 
             C294,155 315,160 326,164 
             C332,156 338,150 346,150 
             C352,152 355,160 358,168 
             C368,168 385,162 396,160 
             C412,158 436,168 442,180 
             C446,192 434,204 424,208 
             C412,212 400,214 394,226 
             C388,236 394,252 390,264 
             C384,274 366,278 358,266 
             C352,254 350,240 342,236 
             C334,232 320,240 318,252 
             C314,266 304,286 296,298 
             C284,316 270,336 256,360 
             C248,374 242,392 236,410 
             C228,432 216,456 204,476 
             C196,490 188,498 184,498 
             C180,498 174,484 168,464 
             C160,438 152,408 146,380 
             C140,352 134,324 130,296 
             C126,272 118,260 98,256 
             C76,252 52,246 44,236 
             C36,224 46,206 66,200 
             C82,196 102,192 108,180 
             C112,170 102,156 106,144 
             C112,130 128,122 142,112 
             C156,102 168,88 174,70 
             C180,52 192,30 202,28 Z"
          fill="url(#india-2d-grad)"
          stroke="url(#india-2d-border)"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        {/* Internal Contour Shading Lines */}
        <path
          d="M174,70 C190,110 200,160 202,240 C204,320 190,400 184,498"
          stroke="rgba(243, 145, 46, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
        />
        <path
          d="M108,180 C150,190 220,180 326,164"
          stroke="rgba(243, 145, 46, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
        />
        <path
          d="M98,256 C150,260 220,270 318,252"
          stroke="rgba(243, 145, 46, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
        />

        {/* Network Connection Lines Connecting Major Campus Hubs */}
        <g className="map-hub-lines" stroke="rgba(243, 145, 46, 0.25)" strokeWidth="1.2" strokeDasharray="3 3">
          <line x1="180" y1="126" x2="198" y2="158" />
          <line x1="198" y1="158" x2="154" y2="192" />
          <line x1="198" y1="158" x2="338" y2="232" />
          <line x1="198" y1="158" x2="202" y2="312" />
          <line x1="154" y1="192" x2="108" y2="230" />
          <line x1="108" y1="230" x2="128" y2="295" />
          <line x1="128" y1="295" x2="202" y2="312" />
          <line x1="128" y1="295" x2="178" y2="395" />
          <line x1="202" y1="312" x2="178" y2="395" />
          <line x1="202" y1="312" x2="218" y2="405" />
          <line x1="178" y1="395" x2="218" y2="405" />
        </g>

        {/* Glowing Interactive Campus Nodes */}
        <g className="map-hub-pins">
          {CAMPUS_HUBS.map((hub, idx) => (
            <g key={`hub-${hub.name}`} className="map-hub-group">
              {/* Radar Ping Animation */}
              <circle
                cx={hub.x}
                cy={hub.y}
                r="6"
                fill="none"
                stroke="#F3912E"
                strokeWidth="1"
                className="hub-ping-ring"
                style={{ animationDelay: `${idx * 0.35}s` }}
              />

              {/* Pin Base Glow */}
              <circle
                cx={hub.x}
                cy={hub.y}
                r="4.5"
                fill="#FF7A00"
                filter="url(#hub-glow-2d)"
              />

              {/* Pin Core */}
              <circle
                cx={hub.x}
                cy={hub.y}
                r="2.5"
                fill="#FFFFFF"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default India2DMap;
