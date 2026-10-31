import React from 'react';
import DiwaliToggle from '../components/DiwaliToggle';
import { useDiwaliMode } from '../hooks/useDiwali';
import ImpactBar from '../components/ImpactBar';
import Ecosystem from '../components/Ecosystem';
import Testimonials from '../components/Testimonials';
import ForUniversities from '../components/ForUniversities';

const MainPage = () => {
  // Intersection Observer for scroll reveal is handled in App.jsx
  const [diwali, toggleDiwali] = useDiwaliMode();

  return (
    <>
      <DiwaliToggle isOn={diwali} onToggle={toggleDiwali} />
      <div id="hero-impact-section">
        <ImpactBar diwali={diwali} />
      </div>

      <div id="student-section">
        <Ecosystem />
        <Testimonials />
      </div>

      <div id="university-section">
        <ForUniversities />
      </div>
    </>
  );
};

export default MainPage;
