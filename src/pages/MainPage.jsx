import ImpactBar from '../components/ImpactBar';
import { HowItWorks, ProblemSolution, StudentFeedback } from '../components/HomeSections';
import PlatformExperience from '../components/PlatformExperience';
import GoalAdvisor from '../components/GoalAdvisor';
import PlacedLogos from '../components/PlacedLogos';
import { PremiumOnHome } from './PremiumPage';
import { useHashScroll } from '../utils/sectionNav';
import './HomeGrid.css';

/* Home: students only (universities live on /university).
   Section order follows the landing-page rules:
   1. Hero              — what it is, who it's for, why it matters, primary CTA
   2. Problem & Solution
   3. How it works & Key features
   4. Beyond lectures: a played-out system design practice problem
   5. Premium: the plan offer + pricing (shared with /premium)
   6. Student feedback
   Each section sits in a plain Band wrapper (HomeGrid.css); the earlier grid frame was removed. */

// A homepage section wrapper. plain: the pricing band (keeps its own width rules).
const Band = ({ plain = false, children }) => (
  <div className={`home-band ${plain ? 'is-plain' : ''}`}>
    {children}
  </div>
);

const SHOW_HOW_IT_WORKS = false;

const MainPage = () => {
  useHashScroll(); // e.g. /#student-section when coming back from /university
  // Intersection Observer for scroll reveal is handled in App.jsx
  return (
    <div className="home-grid">
      <div id="hero-impact-section">
        <ImpactBar part="hero" />
      </div>

      <div id="student-section">
        {/* proof: where students have been placed */}
        <div className="home-proof"><div className="container"><PlacedLogos /></div></div>
        <Band><ProblemSolution /></Band>
        {/* "Learn. Practice. Test. Interview." — disabled for now; put back to show it again */}
        {SHOW_HOW_IT_WORKS && <Band><HowItWorks /></Band>}
        <Band><PlatformExperience /></Band>
        {/* Premium pitch + the plan cards (same as /premium) */}
        <Band plain><PremiumOnHome /></Band>
        <Band><StudentFeedback /></Band>
      </div>

      {/* "Describe your goal" pill (after the hero) → roadmap + course advisor */}
      <GoalAdvisor />
    </div>
  );
};

export default MainPage;
