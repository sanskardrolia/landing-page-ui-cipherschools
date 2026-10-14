import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Check,
  ScanSearch,
  FileText,
  Briefcase
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

/* Small line illustrations for the 3 "make your resume" steps: greys + one orange accent */
const PickTemplateArt = () => (
  <svg viewBox="0 0 200 120" className="rs-step-art" aria-hidden="true">
    <g className="rs-art-page rs-art-page--dim">
      <rect x="22" y="34" width="44" height="60" rx="3" />
      <path d="M30 44h22M30 52h28M30 58h20M30 66h28M30 72h16" />
    </g>
    <g className="rs-art-page rs-art-page--dim">
      <rect x="134" y="34" width="44" height="60" rx="3" />
      <path d="M142 44h22M142 52h28M142 58h20M142 66h28M142 72h16" />
    </g>
    <g className="rs-art-page rs-art-page--on">
      <rect x="74" y="20" width="52" height="72" rx="3" />
      <path d="M83 31h24" className="rs-art-ink" />
      <path d="M83 41h16M83 60h16" className="rs-art-accent" />
      <path d="M83 47h34M83 52h26M83 66h34M83 71h22" />
    </g>
    <circle cx="124" cy="22" r="9" className="rs-art-badge" />
    <path d="m120 22 3 3 5-6" className="rs-art-tick" />
  </svg>
);

const FillInfoArt = () => (
  <svg viewBox="0 0 200 120" className="rs-step-art" aria-hidden="true">
    <g className="rs-art-page">
      <rect x="54" y="12" width="92" height="98" rx="3" />
      <path d="M64 24h22M64 50h18M64 76h26" className="rs-art-label" />
      <rect x="64" y="29" width="72" height="12" rx="2" />
      <rect x="64" y="55" width="72" height="12" rx="2" className="rs-art-field-on" />
      <rect x="64" y="81" width="72" height="12" rx="2" />
      <path d="M69 35h26" className="rs-art-ink" />
      <path d="M69 61h34" className="rs-art-ink" />
      <path d="M106 58v6" className="rs-art-caret" />
    </g>
  </svg>
);

const DownloadPdfArt = () => (
  <svg viewBox="0 0 200 120" className="rs-step-art" aria-hidden="true">
    <g className="rs-art-page">
      <rect x="62" y="12" width="70" height="90" rx="3" />
      <path d="M72 24h30" className="rs-art-ink" />
      <path d="M72 34h18M72 58h18" className="rs-art-accent" />
      <path d="M72 40h48M72 45h40M72 64h48M72 69h34" />
    </g>
    <rect x="70" y="80" width="28" height="13" rx="2" className="rs-art-tag" />
    <text x="84" y="89.5" textAnchor="middle" className="rs-art-tag-text">PDF</text>
    <circle cx="134" cy="92" r="14" className="rs-art-dl" />
    <path d="M134 84v14M128 92l6 6 6-6" className="rs-art-dl-arrow" />
  </svg>
);

const STEPS = [
  { art: PickTemplateArt, title: 'Pick a template', body: 'Choose a recruiter-tested layout for your career stage.' },
  { art: FillInfoArt, title: 'Fill the information', body: 'Add your details in guided sections, with tips on what to write.' },
  { art: DownloadPdfArt, title: 'Download resume as PDF', body: 'Get an ATS-friendly PDF, ready for any job portal.' }
];

// ATS checker: the two ways to check (same copy as the checker's mode screen; ?mode= opens it directly)
const ATS_MODES = [
  {
    mode: 'resume',
    tag: 'Quick check',
    title: 'Resume only',
    desc: 'See how well applicant tracking systems can read your resume.',
    points: ['Layout & formatting', 'Action verbs & metrics', 'Section-by-section fixes']
  },
  {
    mode: 'jd',
    tag: 'Best for applying',
    title: 'Resume + job description',
    desc: 'Match your resume to a specific job and find missing keywords.',
    points: ['Keyword & skill gaps', 'Role match score', 'What to add and where']
  }
];

// ATS checker: how it works (3 steps)
const ATS_STEPS = [
  { id: 'upload', title: 'Upload your CV', body: 'Drop a PDF or DOCX file, up to 10 MB.' },
  { id: 'job', title: 'Add a job description', body: 'Optional. Paste a job post to match your CV against it.' },
  { id: 'score', title: 'Get your ATS score', body: 'See how ATS software reads your CV, with fixes ranked by priority.' }
];


// Sample ATS report (dummy data) shown as a product preview
const SAMPLE_REPORT = {
  score: 72,
  potential: 89,
  verdict: 'Clean layout, but your bullets need numbers and two key skills are missing.',
  issues: [
    { key: 'critical', label: 'Critical', count: 2 },
    { key: 'important', label: 'Important', count: 4 },
    { key: 'optional', label: 'Optional', count: 3 }
  ],
  pillars: [
    { title: 'ATS compatibility', score: 88, status: 'Excellent', stat: 'Single column, parses cleanly' },
    { title: 'Skills coverage', score: 69, status: 'Needs attention', stat: '14 skills found' },
    { title: 'Resume impact', score: 58, status: 'Needs attention', stat: '3 of 9 bullets have numbers' }
  ],
  sections: [
    { key: 'contact', title: 'Contact', state: 'ok', score: 100 },
    { key: 'education', title: 'Education', state: 'ok', score: 92 },
    { key: 'skills', title: 'Skills', state: 'warn', score: 70, fix: 'Add Docker and SQL' },
    { key: 'projects', title: 'Projects', state: 'warn', score: 66, fix: 'Link each project on GitHub' },
    { key: 'experience', title: 'Experience', state: 'warn', score: 61, fix: 'Add numbers to 4 bullets' },
    { key: 'summary', title: 'Summary', state: 'empty', score: 0, fix: 'Add a 2–3 line summary' }
  ]
};


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

  const openAtsChecker = (mode) => navigate(mode ? `/resume/ats-checker?mode=${mode}` : '/resume/ats-checker');

  return (
    <div className="rs-page">

      {/* ── HERO ── */}
      <section className="rs-hero">
        <div className="rs-hero-copy">
          <span className="rs-hero-badge">100% Free</span>
          <h1 className="rs-hero-title">
            <span className="rs-hero-line rs-hero-accent">Resume Builder</span>{' '}
            <span className="rs-hero-line">for Students &amp; Professionals</span>
          </h1>

          <p className="rs-hero-sub">
            Pick a recruiter-tested template, fill in guided sections and download a PDF that applicant tracking systems can read line by line.
          </p>

          <div className="rs-hero-actions">
            <button type="button" className="rs-btn rs-btn--primary rs-btn--lg" onClick={scrollToTemplates}>
              <span>Build My Resume</span>
              <ChevronRight size={16} />
            </button>
            <button type="button" className="rs-btn rs-btn--dark rs-btn--lg" onClick={() => openAtsChecker()}>
              <ScanSearch size={16} />
              <span>Check My ATS Score</span>
            </button>
          </div>

          <p className="rs-hero-note">Free · No watermark · Unlimited PDF downloads</p>
        </div>

        {/* Product visual: a sample resume with the ATS readout it would get */}
        <div className="rs-hero-visual" aria-label="Sample resume made with the CipherSchools builder" role="img">
          <div className="rs-sheet">
            <div className="rs-sheet-page">
              <div className="rs-sheet-head">
                <p className="rs-sheet-name">Anurag Mishra</p>
                <p className="rs-sheet-role">Software Engineer · B.Tech CSE 2026</p>
                <p className="rs-sheet-meta">anurag.m@mail.com · +91 98765 43210 · linkedin/anuragm · github/anuragm</p>
              </div>

              <div className="rs-sheet-sec">
                <p className="rs-sheet-h">Summary</p>
                <p>Final-year CSE student who builds backend services in <mark>Node.js</mark> and Java.</p>
              </div>

              <div className="rs-sheet-sec">
                <p className="rs-sheet-h">Education</p>
                <p className="rs-sheet-row"><strong>B.Tech, Computer Science &amp; Engineering</strong><span>2022 – 2026</span></p>
                <p className="rs-sheet-sub">Lovely Professional University, Punjab · CGPA 8.7 / 10</p>
              </div>

              <div className="rs-sheet-sec">
                <p className="rs-sheet-h">Experience</p>
                <p className="rs-sheet-row"><strong>Backend Intern, Groww</strong><span>May – Jul 2025</span></p>
                <ul>
                  <li>Built a <mark>Node.js</mark> service that reconciles 1.2M daily transactions</li>
                  <li>Cut report generation from 9 min to 47 s with <mark>PostgreSQL</mark> indexes</li>
                </ul>
                <p className="rs-sheet-row"><strong>Web Developer Intern, CipherSchools</strong><span>Jan – Mar 2025</span></p>
                <ul>
                  <li>Shipped <mark>React</mark> dashboards used by 10k+ learners each week</li>
                </ul>
              </div>

              <div className="rs-sheet-sec">
                <p className="rs-sheet-h">Projects</p>
                <p className="rs-sheet-row"><strong>PeerPrep: mock-interview platform</strong><span>2025</span></p>
                <ul>
                  <li><mark>React</mark> + WebRTC app with 640 sign-ups in the first month</li>
                </ul>
                <p className="rs-sheet-row"><strong>ShopSync: real-time inventory tracker</strong><span>2024</span></p>
                <ul>
                  <li>Spring Boot + MySQL API with Redis cache, deployed on <mark>AWS</mark></li>
                </ul>
              </div>

              <div className="rs-sheet-sec">
                <p className="rs-sheet-h">Skills</p>
                <p><strong>Languages:</strong> Java, Python, JavaScript, SQL</p>
                <p><strong>Frameworks:</strong> <mark>React</mark>, <mark>Node.js</mark>, Express, Spring Boot</p>
                <p><strong>Tools:</strong> <mark>PostgreSQL</mark>, Docker, Git, <mark>AWS</mark></p>
              </div>

              <div className="rs-sheet-sec">
                <p className="rs-sheet-h">Certifications &amp; Achievements</p>
                <ul>
                  <li>AWS Cloud Practitioner (2025) · SIH 2024 finalist · LeetCode top 5%</li>
                </ul>
              </div>
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
            How you can make your own <span className="rs-accent-text">resume</span>
          </h2>
          <p className="rs-section-sub">Three simple steps. No design skills needed.</p>
        </div>
        <ol className="rs-steps">
          {STEPS.map(({ art: Art, title, body }, i) => (
            <li key={title} className="rs-step">
              <Art />
              <div className="rs-step-text">
                <span className="rs-step-num">Step {i + 1}</span>
                <h3 className="rs-step-title">{title}</h3>
                <p className="rs-step-body">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── ATS CHECKER: TWO WAYS TO CHECK (mirrors the checker's mode screen) ── */}
      <section className="rs-section rs-am-split" aria-labelledby="rs-ats-modes-title">
        <div className="rs-am-hero">
          <p className="rs-am-eyebrow">Already have a resume?</p>
          <h2 className="rs-am-title" id="rs-ats-modes-title">
            Check your <span className="rs-am-title-pill">ATS score</span>
          </h2>
          <p className="rs-am-sub">Pick how you want your resume checked to get started.</p>
          <p className="rs-am-note">Free · Takes about 10 seconds</p>
        </div>

        <div className="rs-am-options">
          {ATS_MODES.map((opt) => (
            <Link key={opt.mode} to={`/resume/ats-checker?mode=${opt.mode}`} className="rs-am-option">
              <span className="rs-am-go" aria-hidden="true"><ArrowRight size={16} /></span>

              <div className="rs-am-art" aria-hidden="true">
                {opt.mode === 'resume' ? (
                  <div className="rs-am-sheet">
                    <span className="rs-am-l rs-am-l--name" />
                    <span className="rs-am-l rs-am-l--meta" />
                    <span className="rs-am-l rs-am-l--h" />
                    <span className="rs-am-l" />
                    <span className="rs-am-l rs-am-l--short" />
                    <span className="rs-am-l rs-am-l--h" />
                    <span className="rs-am-l" />
                    <span className="rs-am-l rs-am-l--short" />
                    <span className="rs-am-badge rs-am-badge--score"><Check size={11} /> 92</span>
                  </div>
                ) : (
                  <div className="rs-am-pair">
                    <div className="rs-am-sheet rs-am-sheet--sm">
                      <span className="rs-am-l rs-am-l--name" />
                      <span className="rs-am-l rs-am-l--h" />
                      <span className="rs-am-l" />
                      <span className="rs-am-l rs-am-l--short" />
                      <span className="rs-am-l rs-am-l--h" />
                      <span className="rs-am-l" />
                    </div>
                    <span className="rs-am-link" />
                    <div className="rs-am-sheet rs-am-sheet--sm">
                      <span className="rs-am-jd-icon"><Briefcase size={11} /></span>
                      <span className="rs-am-l rs-am-l--meta" />
                      <span className="rs-am-chip-row">
                        <span className="rs-am-chip is-hit" />
                        <span className="rs-am-chip is-hit" />
                        <span className="rs-am-chip is-miss" />
                      </span>
                      <span className="rs-am-l" />
                      <span className="rs-am-l rs-am-l--short" />
                    </div>
                    <span className="rs-am-badge rs-am-badge--match">87% match</span>
                  </div>
                )}
              </div>

              <div className="rs-am-body">
                <span className="rs-am-tag">{opt.tag}</span>
                <h3 className="rs-am-option-title">{opt.title}</h3>
                <p className="rs-am-option-desc">{opt.desc}</p>
                <ul className="rs-am-points">
                  {opt.points.map((pt) => (
                    <li key={pt}><Check size={14} /><span>{pt}</span></li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ATS CHECKER: HOW IT WORKS ── */}
      <section className="rs-section" aria-labelledby="rs-ats-how-title">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="rs-ats-how-title">
            How our <span className="rs-accent-text">free ATS CV checker</span> works
          </h2>
          <p className="rs-section-sub">
            Find out if applicant tracking systems can read your resume, in three steps.
          </p>
        </div>

        <ol className="rs-ats-steps">
          {ATS_STEPS.map((step, i) => (
            <li key={step.id} className="rs-ats-step">
              <div className="rs-ats-visual" aria-hidden="true">
                {step.id === 'upload' && (
                  <div className="rs-v-drop">
                    <span className="rs-v-file">
                      <FileText size={15} />
                      <span>my-resume.pdf</span>
                    </span>
                    <span className="rs-v-drop-hint">PDF · DOCX</span>
                  </div>
                )}
                {step.id === 'job' && (
                  <div className="rs-v-jd">
                    <span className="rs-v-jd-label">Job description</span>
                    <p>
                      Looking for a <mark>React</mark> developer with <mark>Node.js</mark>, REST APIs and <mark>AWS</mark> experience…
                    </p>
                  </div>
                )}
                {step.id === 'score' && (
                  <div className="rs-v-score">
                    <div className="rs-score-ring rs-score-ring--lg" style={{ '--v': 86 }}><span>86</span></div>
                    <div className="rs-v-bars">
                      {[['ATS', 94], ['Keywords', 71], ['Impact', 63]].map(([label, v]) => (
                        <div key={label} className="rs-v-bar">
                          <span>{label}</span>
                          <i style={{ '--v': `${v}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="rs-ats-step-num">Step {i + 1}</span>
              <h3 className="rs-ats-step-title">{step.title}</h3>
              <p className="rs-ats-step-body">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="rs-ats-cta">
          <button type="button" className="rs-btn rs-btn--dark rs-btn--lg" onClick={() => openAtsChecker()}>
            <ScanSearch size={16} />
            <span>Check My ATS Score</span>
          </button>
          <p className="rs-ats-cta-note">Free · PDF or DOCX up to 10 MB</p>
        </div>
      </section>

      {/* ── ATS CHECKER: SAMPLE REPORT ── */}
      <section className="rs-section" aria-labelledby="rs-ats-sample-title">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="rs-ats-sample-title">
            Your ATS score with <span className="rs-accent-text rs-keep-together">section-by-section analysis</span>
          </h2>
          <p className="rs-section-sub">
            Here's a sample report for a fresher's software engineering resume.
          </p>
        </div>

        {/* Static infographic built from sample data; nothing here is interactive */}
        <figure className="rs-info" aria-label="Sample ATS report: overall score, three pillar scores and section-by-section analysis">
          <header className="rs-info-head">
            <div>
              <p className="rs-info-title">ATS Report</p>
              <p className="rs-info-meta">anurag-mishra-resume.pdf · Resume-only scan</p>
            </div>
            <span className="rs-info-sample">Sample</span>
          </header>

          <div className="rs-info-grid">
            {/* 01 · Overall score */}
            <div className="rs-info-col">
              <p className="rs-info-step"><b>01</b> Overall ATS score</p>
              <div className="rs-info-score">
                <div className="rs-ring" style={{ '--v': SAMPLE_REPORT.score }}>
                  <span>{SAMPLE_REPORT.score}<small>/100</small></span>
                </div>
                <p className="rs-info-gain">
                  Up to <strong>{SAMPLE_REPORT.potential}</strong> after fixes <em>+{SAMPLE_REPORT.potential - SAMPLE_REPORT.score}</em>
                </p>
              </div>
              <ul className="rs-info-issues">
                {SAMPLE_REPORT.issues.map((it) => (
                  <li key={it.key} className={`rs-info-issue--${it.key}`}>
                    <b>{it.count}</b>
                    <span>{it.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 02 · Three pillars */}
            <div className="rs-info-col">
              <p className="rs-info-step"><b>02</b> What makes up the score</p>
              <ul className="rs-info-pillars">
                {SAMPLE_REPORT.pillars.map((pl) => (
                  <li key={pl.title}>
                    <div className="rs-info-pillar-top">
                      <span>{pl.title}</span>
                      <b>{pl.score}</b>
                    </div>
                    <div className="rs-info-bar"><i style={{ width: `${pl.score}%` }} /></div>
                    <p>{pl.stat}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* 03 · Section by section */}
            <div className="rs-info-col">
              <p className="rs-info-step"><b>03</b> Section-by-section analysis</p>
              <ul className="rs-info-secs">
                {SAMPLE_REPORT.sections.map((sec) => (
                  <li key={sec.key} className={`rs-info-sec rs-info-sec--${sec.state}`}>
                    <span className="rs-info-sec-name">{sec.title}</span>
                    <div className="rs-info-bar"><i style={{ width: `${Math.max(sec.score, 3)}%` }} /></div>
                    <b className="rs-info-sec-score">{sec.state === 'empty' ? '—' : sec.score}</b>
                    {sec.fix && <span className="rs-info-sec-fix">→ {sec.fix}</span>}
                  </li>
                ))}
              </ul>
              <p className="rs-info-legend">
                <span className="ok">Looks good</span>
                <span className="warn">Needs work</span>
                <span className="empty">Missing</span>
              </p>
            </div>
          </div>

          <footer className="rs-info-foot">Generated by CipherSchools ATS Checker</footer>
        </figure>

        <div className="rs-ats-cta">
          <button type="button" className="rs-btn rs-btn--dark" onClick={() => openAtsChecker()}>
            <ScanSearch size={15} />
            <span>Get Your Score &amp; Section-by-Section Analysis</span>
          </button>
          <p className="rs-ats-cta-note">Free · PDF or DOCX up to 10 MB</p>
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
          <span>Build My Resume</span>
          <ChevronRight size={15} />
        </button>
        <button type="button" className="rs-btn rs-btn--dark" onClick={() => openAtsChecker()}>
          <ScanSearch size={15} />
          <span>Check My ATS Score</span>
        </button>
      </div>
    </div>
  );
};

export default ResumePage;
