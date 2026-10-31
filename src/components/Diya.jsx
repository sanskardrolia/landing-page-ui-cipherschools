import React from 'react';
import './Diwali.css';

/* Small clay diya with a flickering flame */
const Diya = ({ size = 40, className = '' }) => (
  <svg
    className={`diya-svg ${className}`}
    width={size}
    height={size * 0.8}
    viewBox="0 0 50 40"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="diyaFlameGrad" cx="50%" cy="70%" r="60%">
        <stop offset="0%" stopColor="#FFF7D6" />
        <stop offset="45%" stopColor="#FFC23C" />
        <stop offset="100%" stopColor="#F3912E" />
      </radialGradient>
      <linearGradient id="diyaBowlGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C2561B" />
        <stop offset="100%" stopColor="#7A2E0E" />
      </linearGradient>
    </defs>
    <path
      className="diya-flame"
      d="M25 2 C30 9 33 13 33 18 C33 22.5 29.5 25 25 25 C20.5 25 17 22.5 17 18 C17 13 20 9 25 2 Z"
      fill="url(#diyaFlameGrad)"
    />
    <path d="M25 25 L25 28" stroke="#3B1A0A" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M3 27 H47 C47 35 38 39 25 39 C12 39 3 35 3 27 Z" fill="url(#diyaBowlGrad)" />
    <path d="M7 29.5 H43" stroke="#F3B35A" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
  </svg>
);

export default Diya;
