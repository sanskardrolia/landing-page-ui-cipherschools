import ForUniversities from '../components/ForUniversities';
import { useHashScroll } from '../utils/sectionNav';

/* /university — everything for universities (moved off the home page) */
const UniversityPage = () => {
  useHashScroll(); // e.g. /university#lms-section from the navbar
  return (
    <div id="university-section">
      <ForUniversities />
    </div>
  );
};

export default UniversityPage;
