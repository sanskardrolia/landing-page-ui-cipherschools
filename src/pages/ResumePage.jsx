import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronsLeftRight,
  Check,
  Lock,
  ScanSearch,
  FileText,
  Star,
  X,
  LayoutTemplate,
  PenLine,
  Wallet
} from 'lucide-react';
import './ResumePage.css';

// "Hustle vs ease" comparison: the usual resume pain, and how we remove it
const HUSTLE_VS_EASE = [
  { topic: 'Formatting', Icon: LayoutTemplate, hustle: 'Hours lost fixing margins and fonts', ease: 'Layout handled for you' },
  { topic: 'Writing', Icon: PenLine, hustle: 'Staring at a blank page', ease: 'Guided sections with tips' },
  { topic: 'ATS check', Icon: ScanSearch, hustle: 'Guessing if the ATS can read it', ease: 'ATS-friendly by default' },
  { topic: 'Download', Icon: Wallet, hustle: 'Paywall right at download', ease: '100% free PDF download' }
];

// "Make your resume" steps. Step 1 has a cropped screenshot of the real product; the others are text only
const STEPS = [
  {
    id: 'pick',
    title: 'Choose a resume template',
    body: 'Pick a free, recruiter-approved template made for students, freshers or experienced professionals.',
    img: '/assets/resume-steps/step-1-pick.webp',
    alt: 'Beginner, Experienced and Modern resume templates side by side',
    w: 1600, h: 463
  },
  {
    id: 'type',
    title: 'Add your details',
    body: 'Fill in guided sections for education, skills, projects and work experience, with tips on what to write.',
  },
  {
    id: 'download',
    title: 'Download your resume as a PDF',
    body: 'Get a clean, ATS-friendly PDF you can upload to any job portal.',
  }
];

// ATS checker: the two ways to check (same copy as the checker's mode screen; ?mode= opens it directly)
const ATS_MODES = [
  {
    mode: 'resume',
    img: '/assets/resume-steps/ats-resume-only.webp',
    alt: 'ATS report for a resume-only scan: overall score 93 with ATS compatibility, skills coverage and resume impact scores',
    w: 2464, h: 1081,
    tag: 'Quick check',
    title: 'Resume only',
    desc: 'See how well applicant tracking systems can read your resume.',
    points: ['Layout & formatting', 'Action verbs & metrics', 'Section-by-section fixes']
  },
  {
    mode: 'jd',
    img: '/assets/resume-steps/ats-with-jd.webp',
    alt: 'Job keyword match from a resume and job description scan: 11 of 13 keywords found, AWS and CI/CD missing',
    w: 1638, h: 649,
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


// Placeholder feedback; swap in real reviews before launch.
const FEEDBACK = [
  {
    name: 'Ananya Sharma',
    role: 'B.Tech CSE, final year',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=160&auto=format&fit=crop',
    quote: 'The Beginner template put my projects up front. I got my first internship shortlist within a week of applying.',
  },
  {
    name: 'Rohit Verma',
    role: 'Software Engineer, 2 yrs',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=160&auto=format&fit=crop',
    quote: 'The ATS check with a job description showed exactly which skills I was missing. Small edits, many more callbacks.',
  },
  {
    name: 'Priya Nair',
    role: 'MBA graduate',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=160&auto=format&fit=crop',
    quote: 'Clean layout, no fiddling with formatting. I built and downloaded my resume in under twenty minutes.',
  },
  {
    name: 'Karan Mehta',
    role: 'Data Analyst',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=160&auto=format&fit=crop',
    quote: 'Switching careers was easier with the Modern template. Recruiters finally read past the first section.',
  },
  {
    name: 'Sneha Iyer',
    role: 'BCA, fresher',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=160&auto=format&fit=crop',
    quote: 'I had no idea my old resume was failing ATS scans. My score went from 52 to 88 after the suggestions.',
  },
  {
    name: 'Arjun Patel',
    role: 'Frontend Developer',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=160&auto=format&fit=crop',
    quote: 'Simple, quick and free. The section order for experienced profiles is spot on.',
  },
];

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

// What a typical ATS checker report gives you, shown under the slider
const OTHER_REPORT_POINTS = [
  'One overall score, no breakdown',
  'Generic tips like "add more keywords"',
  'No section-by-section analysis',
  'Fixes not ranked by priority',
  'Full report locked behind a paywall'
];

const clampPos = (v) => Math.min(100, Math.max(0, v));

// Before/after slider over the sample report: other checkers on the left, ours on the right.
// Sweeps once when it scrolls into view, then the handle is the user's.
const ReportCompare = ({ children }) => {
  const [pos, setPos] = useState(50);
  const wrapRef = useRef(null);
  const draggingRef = useRef(false);
  const touchedRef = useRef(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      // 50 → 82 → 18 → 50, eased per leg
      const legs = [[50, 82], [82, 18], [18, 50]];
      const legMs = 900;
      const start = performance.now();
      const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
      const tick = (now) => {
        if (touchedRef.current) return;
        const t = (now - start) / legMs;
        const i = Math.floor(t);
        if (i >= legs.length) { setPos(50); return; }
        const [from, to] = legs[i];
        setPos(from + (to - from) * ease(t - i));
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.45 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  const posFromEvent = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    return clampPos(((e.clientX - rect.left) / rect.width) * 100);
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    touchedRef.current = true;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setPos(posFromEvent(e));
  };

  const onPointerMove = (e) => {
    if (draggingRef.current) setPos(posFromEvent(e));
  };

  const stopDrag = () => { draggingRef.current = false; };

  return (
    <div className="rs-cmp-wrap">
      <div className="rs-cmp-labels" aria-hidden="true">
        <span>Other ATS checker report</span>
        <span className="rs-cmp-label-us">CipherSchools ATS Report</span>
      </div>

      <div
        ref={wrapRef}
        className="rs-cmp"
        style={{ '--pos': `${pos}%` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        {children}

        {/* Typical report, clipped to the left of the handle */}
        <div className="rs-cmp-other" aria-label="Typical ATS checker report" role="img">
          <div className="rs-cmp-other-head">
            <p className="rs-cmp-other-title">Resume Scan Results</p>
            <p className="rs-cmp-other-meta">resume.pdf</p>
          </div>
          <div className="rs-cmp-other-body">
            <div className="rs-cmp-other-score">
              <span>64</span>
              <small>Match rate</small>
            </div>
            <ul className="rs-cmp-other-points">
              {OTHER_REPORT_POINTS.map((pt) => (
                <li key={pt}><X size={14} /><span>{pt}</span></li>
              ))}
            </ul>
          </div>
          <div className="rs-cmp-other-locked">
            <div className="rs-cmp-other-blur" />
            <span className="rs-cmp-other-lock"><Lock size={13} /> Upgrade to see the full report</span>
          </div>
        </div>

        <div className="rs-cmp-handle" aria-hidden="true">
          <span className="rs-cmp-knob"><ChevronsLeftRight size={16} /></span>
        </div>

        <input
          type="range"
          className="rs-cmp-range"
          min="0"
          max="100"
          step="1"
          value={Math.round(pos)}
          onChange={(e) => { touchedRef.current = true; setPos(Number(e.target.value)); }}
          aria-label="Compare a typical ATS checker report with the CipherSchools ATS report"
          aria-valuetext={`${Math.round(pos)}% typical report shown`}
        />
      </div>
    </div>
  );
};

const ResumePage = () => {
  const navigate = useNavigate();
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

  // "Build My Resume" goes to the template picker, which then opens the editor
  const openTemplates = () => navigate('/resume/templates');

  const openAtsChecker = (mode) => navigate(mode ? `/resume/ats-checker?mode=${mode}` : '/resume/ats-checker');

  return (
    <div className="rs-page">

      {/* ── HERO ── */}
      <section className="rs-hero">
        <div className="rs-hero-copy">
          <span className="rs-hero-badge">100% Free</span>
          <h1 className="rs-hero-title">
            <span className="rs-hero-line rs-hero-accent">Online Resume Builder</span>{' '}
            <span className="rs-hero-line">for Students &amp; Professionals</span>
          </h1>

          <p className="rs-hero-sub">
            Build an ATS-friendly resume that helps recruiters find your skills without worrying about design or formatting.
          </p>

          <div className="rs-hero-actions">
            <button type="button" className="rs-btn rs-btn--primary rs-btn--lg" onClick={openTemplates}>
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

      {/* ── HUSTLE VS EASE ── */}
      <section className="rs-section" aria-labelledby="rs-hve-title">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="rs-hve-title">
            Other resume builders make you hustle. We make you <span className="rs-accent-text">apply at ease</span>
          </h2>
          <p className="rs-section-sub">Spend your time applying, not formatting.</p>
        </div>

        <div className="rs-hve">
          <div className="rs-hve-head" aria-hidden="true">
            <span className="rs-hve-head-topic">What you need</span>
            <span className="rs-hve-head-them"><X size={13} /> Other builders</span>
            <span className="rs-hve-head-us"><Check size={13} /> CipherSchools</span>
          </div>
          <ul className="rs-hve-rows">
            {HUSTLE_VS_EASE.map(({ topic, Icon, hustle, ease }) => (
              <li key={topic} className="rs-hve-row">
                <span className="rs-hve-topic">
                  <span className="rs-hve-topic-icon"><Icon size={16} aria-hidden="true" /></span>
                  {topic}
                </span>
                <span className="rs-hve-cell rs-hve-cell--hustle">
                  <X size={14} aria-hidden="true" />
                  <span><span className="rs-sr-only">Other builders: </span>{hustle}</span>
                </span>
                <span className="rs-hve-cell rs-hve-cell--ease">
                  <span className="rs-hve-arrow" aria-hidden="true"><ArrowRight size={13} /></span>
                  <Check size={14} aria-hidden="true" />
                  <span><span className="rs-sr-only">CipherSchools: </span>{ease}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="rs-section rs-steps-section">
        <div className="rs-section-head">
          <h2 className="rs-section-title">
            Make your own <span className="rs-accent-text">resume</span> in 3 Simple Steps
          </h2>
          <p className="rs-section-sub">Pick a template, add your details and download an ATS-friendly PDF. No design skills needed.</p>
        </div>
        <ol className="rs-steps">
          {STEPS.map(({ id, title, body, img, alt, w, h }, i) => (
            <li key={id} className={`rs-step rs-step--${id}`}>
              <div className="rs-step-text">
                <span className="rs-step-num">Step {i + 1}</span>
                <h3 className="rs-step-title">{title}</h3>
                <p className="rs-step-body">{body}</p>
                {i === 0 && (
                  <button type="button" className="rs-btn rs-btn--primary rs-step-cta" onClick={openTemplates}>
                    <span>Start with Template</span>
                    <ChevronRight size={15} />
                  </button>
                )}
              </div>
              {img && (
                <div className="rs-step-shot">
                  <div className="rs-step-canvas" style={{ aspectRatio: `${w} / ${h}` }}>
                    <img src={img} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ── ATS CHECKER: TWO WAYS TO CHECK (mirrors the checker's mode screen) ── */}
      <section className="rs-section rs-am-split" aria-labelledby="rs-ats-modes-title">
        <div className="rs-am-hero">
          <h2 className="rs-am-title" id="rs-ats-modes-title">
            Already have a <span className="rs-am-title-pill">resume?</span>
          </h2>
          <p className="rs-am-sub">Check your ATS score</p>
          <p className="rs-am-note">Free · Takes about 10 seconds</p>
        </div>

        <div className="rs-am-options">
          {ATS_MODES.map((opt) => (
            <Link key={opt.mode} to={`/resume/ats-checker?mode=${opt.mode}`} className="rs-am-option">
              <span className="rs-am-go" aria-hidden="true"><ArrowRight size={16} /></span>

              <div className="rs-am-art">
                <img className="rs-am-shot" src={opt.img} alt={opt.alt} width={opt.w} height={opt.h} loading="lazy" decoding="async" />
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

      {/* ── ATS CHECKER: SAMPLE REPORT ── */}
      <section className="rs-section" aria-labelledby="rs-ats-sample-title">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="rs-ats-sample-title">
            Other ATS checkers make you pay. We show you the <span className="rs-accent-text rs-keep-together">full report, free</span>
          </h2>
        </div>

        {/* Sample report built from dummy data, under a slider that compares it with a typical checker's report */}
        <ReportCompare>
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
        </ReportCompare>

        <div className="rs-ats-cta">
          <button type="button" className="rs-btn rs-btn--dark" onClick={() => openAtsChecker()}>
            <ScanSearch size={15} />
            <span>Check My ATS Score</span>
          </button>
          <p className="rs-ats-cta-note">Free · PDF or DOCX up to 10 MB</p>
        </div>
      </section>

      {/* ── ATS CHECKER: HOW IT WORKS ── */}
      <section className="rs-section" aria-labelledby="rs-ats-how-title">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="rs-ats-how-title">
            How you can check <span className="rs-accent-text">ATS Score</span> of your Resume in 3 steps
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

      {/* ── FEEDBACK ── */}
      <section className="rs-section rs-feedback" aria-labelledby="rs-feedback-title">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="rs-feedback-title">
            Don't believe us. Believe the <span className="rs-accent-text">opportunity seekers</span> who did.
          </h2>
          <p className="rs-section-sub">Students and professionals who built their resumes with CipherSchools.</p>
        </div>
        <div className="rs-feedback-marquee">
          {/* Rendered twice so the -50% slide loops seamlessly; the copy is hidden from screen readers */}
          <div className="rs-feedback-track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="rs-feedback-list" aria-hidden={copy === 1 || undefined}>
                {FEEDBACK.map(({ name, role, rating, image, quote }) => (
                  <li key={name} className="rs-feedback-card">
                    <div className="rs-feedback-stars" role="img" aria-label={`Rated ${rating} out of 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={14} aria-hidden="true" className={n <= rating ? 'is-on' : undefined} />
                      ))}
                    </div>
                    <p className="rs-feedback-quote">{quote}</p>
                    <div className="rs-feedback-author">
                      <img src={image} alt="" width={40} height={40} loading="lazy" decoding="async" />
                      <div>
                        <p className="rs-feedback-name">{name}</p>
                        <p className="rs-feedback-role">{role}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ))}
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
        <button type="button" className="rs-btn rs-btn--primary" onClick={openTemplates}>
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
