import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Check,
  LayoutTemplate,
  PenLine,
  Download,
  ScanSearch
} from 'lucide-react';
import { CompanyLogos } from '../components/PlacementMarquee';
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

const STEPS = [
  { icon: LayoutTemplate, title: 'Pick a template', body: 'Choose the layout that matches where you are in your career.' },
  { icon: PenLine, title: 'Fill guided sections', body: 'Each section tells you what recruiters look for, so nothing important is missed.' },
  { icon: Download, title: 'Download your PDF', body: 'Export a clean, ATS-readable PDF ready to upload to any job portal.' }
];

const TRUSTED_COMPANIES = Object.keys(CompanyLogos);

const FAQ_ITEMS = [
  {
    q: 'What makes these templates ATS-friendly?',
    a: 'They use a single-column structure, standard section headings and real text instead of tables, icons or images, so applicant tracking systems like Workday, Lever, Greenhouse and Taleo can read every line.'
  },
  {
    q: 'Is the resume builder free?',
    a: 'Yes. There are no watermarks, no paywall at download and no limit on PDF exports or template changes.'
  },
  {
    q: 'Do I need an account?',
    a: 'Yes, a free CipherSchools account. It lets you save your resumes and come back to edit them from any device.'
  },
  {
    q: 'Can I check a resume I already have?',
    a: 'Yes. Upload it to the ATS Checker to get a score and a list of fixes before you apply.'
  }
];

const PREVIEWS = { beginner: BeginnerResume, experienced: ExperiencedResume, modern: ModernResume };

const ResumePage = () => {
  const navigate = useNavigate();
  const templatesRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [showDock, setShowDock] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowDock(window.scrollY > 520);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTemplates = () => {
    templatesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startWithTemplate = (templateId) => {
    navigate(`${EDITOR_PATH}?template=${templateId}`);
  };

  const openAtsChecker = () => navigate('/resume/ats-checker');

  return (
    <div className="rs-page">

      {/* ── HERO ── */}
      <section className="rs-hero">
        <h1 className="rs-hero-title">
          <span className="rs-hero-line">Make an ATS resume</span>
          <span className="rs-hero-line">
            in <span className="rs-hero-pill">minutes</span>
          </span>
        </h1>

        <p className="rs-hero-sub">
          Pick a recruiter-tested template, fill in guided sections and download a PDF that applicant tracking systems can read line by line.
        </p>

        <div className="rs-hero-actions">
          <button type="button" className="rs-btn rs-btn--primary rs-btn--lg" onClick={scrollToTemplates}>
            <span>Build my resume</span>
            <ChevronRight size={16} />
          </button>
          <button type="button" className="rs-btn rs-btn--dark rs-btn--lg" onClick={openAtsChecker}>
            <ScanSearch size={16} />
            <span>Check my ATS score</span>
          </button>
        </div>

        <p className="rs-hero-note">Free · No watermark · Unlimited PDF downloads</p>

        {/* Product visual: a sample resume with the ATS readout it would get */}
        <div className="rs-hero-visual" aria-label="Sample resume made with the CipherSchools builder" role="img">
          <div className="rs-sheet">
            <div className="rs-sheet-head">
              <p className="rs-sheet-name">Anurag Mishra</p>
              <p className="rs-sheet-role">Software Engineer · B.Tech CSE 2026</p>
              <p className="rs-sheet-meta">anurag.m@mail.com · linkedin/anuragm · github/anuragm</p>
            </div>
            <div className="rs-sheet-sec">
              <p className="rs-sheet-h">Experience</p>
              <p className="rs-sheet-row"><strong>Backend Intern, Groww</strong><span>May – Jul 2025</span></p>
              <ul>
                <li>Built a <mark>Node.js</mark> service that reconciles 1.2M daily transactions</li>
                <li>Reduced report generation time from 9 min to 47 s using <mark>PostgreSQL</mark> indexes</li>
              </ul>
            </div>
            <div className="rs-sheet-sec">
              <p className="rs-sheet-h">Projects</p>
              <p className="rs-sheet-row"><strong>PeerPrep: mock-interview platform</strong><span>2025</span></p>
              <ul>
                <li><mark>React</mark> + WebRTC app with 640 sign-ups in the first month</li>
              </ul>
            </div>
            <div className="rs-sheet-sec">
              <p className="rs-sheet-h">Skills</p>
              <p className="rs-sheet-p">Java, Python, <mark>React</mark>, <mark>Node.js</mark>, <mark>PostgreSQL</mark>, Docker, Git</p>
            </div>
          </div>

          <div className="rs-float rs-float--score">
            <div className="rs-score-ring"><span>92</span></div>
            <div>
              <p className="rs-float-title">ATS score</p>
              <p className="rs-float-sub">Parses cleanly</p>
            </div>
          </div>

          <div className="rs-float rs-float--checks">
            <p className="rs-float-title">Checks passed</p>
            <ul>
              <li><Check size={12} /> Single-column layout</li>
              <li><Check size={12} /> Standard headings</li>
              <li><Check size={12} /> Keywords matched</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="rs-trust" aria-label="Companies our job seekers work at">
        <p className="rs-trust-label">
          <strong>5000+</strong> Job Seekers trusted us
        </p>
        <div className="rs-marquee">
          <ul className="rs-marquee-track">
            {[...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES].map((name, i) => (
              <li
                key={`${name}-${i}`}
                className="rs-logo"
                aria-hidden={i >= TRUSTED_COMPANIES.length ? 'true' : undefined}
              >
                <span className="rs-logo-mark">{CompanyLogos[name]}</span>
                <span className="rs-logo-name">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section className="rs-section rs-templates" ref={templatesRef} id="templates">
        <div className="rs-section-head">
          <h2 className="rs-section-title">
            Start from a <span className="rs-accent-text">proven template</span>
          </h2>
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
                  <h3 className="rs-template-title">{tmpl.title} template</h3>
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

      {/* ── HOW IT WORKS ── */}
      <section className="rs-section rs-steps-section">
        <div className="rs-section-head">
          <h2 className="rs-section-title">
            From blank page to <span className="rs-accent-text">ready to apply</span>
          </h2>
        </div>
        <ol className="rs-steps">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="rs-step">
              <span className="rs-step-num">0{i + 1}</span>
              <span className="rs-step-icon"><Icon size={18} /></span>
              <h3 className="rs-step-title">{title}</h3>
              <p className="rs-step-body">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── ATS CHECKER ── */}
      <section className="rs-section">
        <div className="rs-ats-card">
          <div className="rs-ats-copy">
            <span className="rs-tag rs-tag--dark"><ScanSearch size={12} /> ATS Checker</span>
            <h2 className="rs-ats-title">Already have a resume? See how recruiters' software reads it.</h2>
            <p className="rs-ats-sub">
              Upload a PDF or DOCX and get a score across formatting, keywords and impact, with a list of specific fixes.
            </p>
            <button type="button" className="rs-btn rs-btn--dark" onClick={openAtsChecker}>
              <span>Check my resume</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="rs-ats-readout" aria-hidden="true">
            {[
              ['ATS compatibility', 94],
              ['Keyword match', 71],
              ['Resume impact', 63]
            ].map(([label, value]) => (
              <div key={label} className="rs-meter">
                <div className="rs-meter-top"><span>{label}</span><span>{value}</span></div>
                <div className="rs-meter-track"><div className="rs-meter-fill" style={{ '--v': `${value}%` }} /></div>
              </div>
            ))}
            <p className="rs-readout-note">Sample report</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="rs-section rs-faq">
        <div className="rs-section-head">
          <h2 className="rs-section-title">
            Questions about the <span className="rs-accent-text">resume builder</span>
          </h2>
        </div>
        <div className="rs-faq-list">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={item.q} className={`rs-faq-item ${isOpen ? 'is-open' : ''}`}>
                <h3 className="rs-faq-q">
                  <button
                    type="button"
                    id={`rs-faq-q-${idx}`}
                    aria-expanded={isOpen}
                    aria-controls={`rs-faq-a-${idx}`}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={16} className="rs-faq-chevron" />
                  </button>
                </h3>
                <div
                  id={`rs-faq-a-${idx}`}
                  role="region"
                  aria-labelledby={`rs-faq-q-${idx}`}
                  className="rs-faq-a"
                  inert={!isOpen}
                >
                  <div className="rs-faq-a-inner"><p>{item.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── UPSKILL (secondary) ── */}
      <section className="rs-section rs-upskill-wrap">
        <div className="rs-upskill">
          <div>
            <h2 className="rs-upskill-title">Want more to put on your resume?</h2>
            <p className="rs-upskill-sub">
              CipherSchools courses come with guided projects and mentor reviews you can list under Projects.
            </p>
          </div>
          <button type="button" className="rs-btn rs-btn--outline" onClick={() => navigate('/courses')}>
            <span>Explore courses</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ── FLOATING DOCK ── */}
      <div className={`rs-dock ${showDock ? 'is-visible' : ''}`} inert={!showDock}>
        <button type="button" className="rs-btn rs-btn--primary" onClick={scrollToTemplates}>
          <span>Build my resume</span>
          <ChevronRight size={15} />
        </button>
        <button type="button" className="rs-btn rs-btn--dark" onClick={openAtsChecker}>
          <ScanSearch size={15} />
          <span>Check ATS score</span>
        </button>
      </div>
    </div>
  );
};

export default ResumePage;
