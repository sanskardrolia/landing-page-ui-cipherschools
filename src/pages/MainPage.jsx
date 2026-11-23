import ImpactBar from '../components/ImpactBar';
import { BeyondLectures, HowItWorks, ProblemSolution, StudentFeedback } from '../components/HomeSections';
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
   Layout detail: a light grid frame on top of each section (not pricing):
   a label tab, a hairline across the content, small corner markers and
   short guide lines that fade out (HomeGrid.css). */

// A section with a light grid frame at its top (label tab, hairline, corner markers, short guides).
// plain: no frame (pricing).
const Band = ({ label, plain = false, children }) => (
  <div className={`home-band ${plain ? 'is-plain' : ''}`}>
    {!plain && label && <span className="home-band-label">{label}</span>}
    {children}
  </div>
);

const MainPage = () => {
  useHashScroll(); // e.g. /#student-section when coming back from /university
  // Intersection Observer for scroll reveal is handled in App.jsx
  return (
    <div className="home-grid">
      <div id="hero-impact-section">
        <ImpactBar part="hero" />
      </div>

      <div id="student-section">
        <Band><ProblemSolution /></Band>
        <Band><HowItWorks /></Band>
        <Band><BeyondLectures /></Band>
        {/* Premium pitch + the plan cards (same as /premium) */}
        <Band plain><PremiumOnHome /></Band>
        <Band><StudentFeedback /></Band>
      </div>
    </div>
  );
};

export default MainPage;
