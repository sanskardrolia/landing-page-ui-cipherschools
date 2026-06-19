import React from 'react';
import StoryHero from '../components/StoryHero';
import ImpactBar from '../components/ImpactBar';
import Ecosystem from '../components/Ecosystem';
import ImageGallery from '../components/ImageGallery';
import MentorsSection from '../components/MentorsSection';
import ExplorePrograms from '../components/ExplorePrograms';
import BentoFeatures from '../components/BentoFeatures';
import PremiumExperience from '../components/PremiumExperience';
import Testimonials from '../components/Testimonials';

import TrustedBy from '../components/TrustedBy';

const HomePage = () => {
  return (
    <>
      <StoryHero />
      <TrustedBy />
      <ImpactBar />
      <ImageGallery />
      <Ecosystem />
      <MentorsSection />
      <ExplorePrograms />
      <PremiumExperience />
      <BentoFeatures />
      <Testimonials />
    </>
  );
};

export default HomePage;
