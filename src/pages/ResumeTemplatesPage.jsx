import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { ScaledPage, BeginnerResume, ExperiencedResume, ModernResume } from '../components/ResumeTemplates';
import './ResumePage.css';

// Standalone builder; the picked template is passed as ?template=<id>.
const EDITOR_PATH = '/resume/builder';

const TEMPLATES = [
  {
    id: 'beginner',
    title: 'Beginner',
    audience: 'Students & freshers',
    tagline: 'Perfect for students and freshers starting their career journey.',
    highlights: ['Academic details table up top', 'Projects with guide and timeline', 'Skills grouped by type']
  },
  {
    id: 'experienced',
    title: 'Experienced',
    audience: 'Internships & jobs',
    tagline: 'Ideal for those with internships, projects or job experience.',
    highlights: ['Dense one-page layout', 'Impact-first experience bullets', 'Skills summary by category']
  },
  {
    id: 'modern',
    title: 'Modern',
    audience: 'Any stage',
    tagline: 'Sleek and clean design, suitable for both beginners and experienced.',
    highlights: ['Two-column layout', 'Links and skills in a sidebar', 'Clean sans-serif type']
  }
];

const PREVIEWS = { beginner: BeginnerResume, experienced: ExperiencedResume, modern: ModernResume };

// Template picker: the step between "Build My Resume" on /resume and the editor
const ResumeTemplatesPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const startWithTemplate = (templateId) => {
    navigate(`${EDITOR_PATH}?template=${templateId}`);
  };

  return (
    <div className="rs-page rs-tpl-page">
      <section className="rs-section rs-templates">
        <Link to="/resume" className="rs-tpl-back">
          <ArrowLeft size={15} />
          <span>Back to Resume Builder</span>
        </Link>

        <div className="rs-section-head">
          <h1 className="rs-section-title">
            Start from a <span className="rs-accent-text">proven template</span>
          </h1>
          <p className="rs-section-sub">
            Three layouts tested against leading applicant tracking systems. Each one orders your sections for the stage you're at.
          </p>
        </div>

        <div className="rs-template-grid">
          {TEMPLATES.map((tmpl) => {
            const Preview = PREVIEWS[tmpl.id];
            return (
              <article key={tmpl.id} className="rs-template-card">
                <div className="rs-template-preview">
                  <div className="rs-template-paper">
                    <ScaledPage>
                      <Preview />
                    </ScaledPage>
                  </div>
                </div>
                <div className="rs-template-body">
                  <span className="rs-tag">{tmpl.audience}</span>
                  <h2 className="rs-template-title">{tmpl.title} template</h2>
                  <p className="rs-template-tagline">{tmpl.tagline}</p>
                  <ul className="rs-template-points">
                    {tmpl.highlights.map((h) => (
                      <li key={h}><Check size={13} /> <span>{h}</span></li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="rs-btn rs-btn--outline rs-btn--block"
                    onClick={() => startWithTemplate(tmpl.id)}
                    aria-label={`Use the ${tmpl.title} template`}
                  >
                    <span>Use this template</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ResumeTemplatesPage;
