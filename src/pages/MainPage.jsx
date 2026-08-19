import React, { useEffect } from 'react';
import WelcomeGateway from '../components/WelcomeGateway';
import StoryHero from '../components/StoryHero';
import ImpactBar from '../components/ImpactBar';
import Ecosystem from '../components/Ecosystem';
import Testimonials from '../components/Testimonials';
import TrustedBy from '../components/TrustedBy';
import ForUniversities from '../components/ForUniversities';
import SmartStickyExperienceBar from '../components/SmartStickyExperienceBar';

const MainPage = () => {
  // Intersection Observer for scroll reveal is handled in App.jsx

  return (
    <>
      <SmartStickyExperienceBar />

      <div id="hero-impact-section">
        <ImpactBar />
      </div>

      <div id="welcome-section">
        <WelcomeGateway />
      </div>

      <div id="student-section">
        <StoryHero />
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
