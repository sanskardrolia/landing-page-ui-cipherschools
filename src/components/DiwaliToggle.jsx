import React from 'react';
import Diya from './Diya';
import './Diwali.css';

const DiwaliToggle = ({ isOn, onToggle }) => (
  <button
    type="button"
    className={`diwali-toggle ${isOn ? 'is-on' : ''}`}
    onClick={onToggle}
    role="switch"
    aria-checked={isOn}
    aria-label="Toggle Deepawali theme"
    title={isOn ? 'Turn off Deepawali mode' : 'Turn on Deepawali mode'}
  >
    <span className="diwali-toggle-icon"><Diya size={26} /></span>
    <span className="diwali-toggle-label">Deepawali</span>
    <span className="diwali-toggle-track"><span className="diwali-toggle-thumb" /></span>
  </button>
);

export default DiwaliToggle;
