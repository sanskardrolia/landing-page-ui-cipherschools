import React, { useEffect } from 'react';
import WelcomeGateway from '../components/WelcomeGateway';
import StoryHero from '../components/StoryHero';
import ImpactBar from '../components/ImpactBar';
import Ecosystem from '../components/Ecosystem';
import MentorsSection from '../components/MentorsSection';
import ExplorePrograms from '../components/ExplorePrograms';
import BentoFeatures from '../components/BentoFeatures';
import Testimonials from '../components/Testimonials';
import TrustedBy from '../components/TrustedBy';
import ForUniversities from '../components/ForUniversities';

const MainPage = () => {
  // Intersection Observer for scroll reveal is handled in App.jsx

  return (
    <>
      <div id="welcome-section">
        <WelcomeGateway />
      </div>

      <div id="student-section">
        <StoryHero />
        <ImpactBar />
        <Ecosystem />
        <MentorsSection />
        <ExplorePrograms />
        <BentoFeatures />
        <Testimonials />
      </div>

      <div id="university-section">
        <ForUniversities />
      </div>
    </>
  );
};

export default MainPage;
