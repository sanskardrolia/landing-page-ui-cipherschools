import ImpactBar from '../components/ImpactBar';
import Ecosystem from '../components/Ecosystem';
import Testimonials from '../components/Testimonials';
import { useHashScroll } from '../utils/sectionNav';

/* Home: students only. Universities live on /university (UniversityPage). */
const MainPage = () => {
  useHashScroll(); // e.g. /#student-section when coming back from /university
  // Intersection Observer for scroll reveal is handled in App.jsx
  return (
    <>
      <div id="hero-impact-section">
        <ImpactBar />
      </div>

      <div id="student-section">
        <Ecosystem />
        <Testimonials />
      </div>
    </>
  );
};

export default MainPage;
