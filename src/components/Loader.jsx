import React, { useEffect, useState } from 'react';
import { Code2, Video, TerminalSquare } from 'lucide-react';
import './Loader.css';

const Loader = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Sequence the animations
    const t1 = setTimeout(() => setStage(1), 300);   // Show Code icon
    const t2 = setTimeout(() => setStage(2), 700);   // Show Video icon
    const t3 = setTimeout(() => setStage(3), 1100);  // Show Terminal icon
    const t4 = setTimeout(() => setStage(4), 1600);  // Trigger exit wipe
    const t5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2200); // Wait for exit animation to finish before unmounting

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div className={`loader-overlay ${stage === 4 ? 'exit' : ''}`}>
      <div className="loader-content">
        
        {/* Animated Brand Pulse Ring */}
        <div className="loader-pulse-ring"></div>

        {/* Icons Sequence */}
        <div className="loader-icons">
          <div className={`l-icon ${stage >= 1 ? 'pop-in' : ''}`}>
            <Code2 size={32} />
          </div>
          <div className={`l-icon ${stage >= 2 ? 'pop-in' : ''}`}>
            <Video size={32} />
          </div>
          <div className={`l-icon ${stage >= 3 ? 'pop-in' : ''}`}>
            <TerminalSquare size={32} />
          </div>
        </div>

        {/* Text Fade In */}
        <div className={`loader-text ${stage >= 3 ? 'fade-up' : ''}`}>
          Initializing <span>CipherSchools</span> Ecosystem...
        </div>

        {/* Progress Bar */}
        <div className="loader-progress-bar">
          <div className="loader-progress-fill"></div>
        </div>

      </div>
    </div>
  );
};

export default Loader;
