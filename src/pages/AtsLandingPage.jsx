import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronsLeftRight,
  FileText,
  Lock,
  UploadCloud,
  X,
  Gauge,
  ListChecks,
  Target,
  Sparkles,
  Wrench,
  LayoutList,
  ShieldCheck
} from 'lucide-react';
import './ResumePage.css';
import './AtsLandingPage.css';

const SCAN_PATH = '/resume/ats-checker/scan';
const MAX_BYTES = 10 * 1024 * 1024;

const HERO_MODES = [
  { value: 'resume', label: 'Resume Only' },
  { value: 'jd', label: 'Resume + Job Description' }
];

// Why it matters: each point pairs a short explanation with a small visual
const WHY = [
  {
    id: 'filter',
    title: 'Get past the first filter',
    body: 'Most companies run your resume through software before a person sees it. If the software cannot read your layout, your resume is skipped. We check that every section can be read.',
    visual: (
      <div className="ats-lp-viz">
        <p className="ats-lp-viz-cap">What the ATS reads</p>
        <ul className="ats-lp-viz-list">
          <li><Check size={14} />Contact details</li>
          <li><Check size={14} />Education</li>
          <li><Check size={14} />Skills</li>
          <li className="is-bad"><X size={14} />Experience <em>unreadable table</em></li>
        </ul>
      </div>
    )
  },
  {
    id: 'issues',
    title: 'Catch issues before recruiters do',
    body: 'A missing phone number or a two-column layout can quietly cost you the interview. We flag each problem and tell you how serious it is, so nothing slips through.',
    visual: (
      <div className="ats-lp-viz">
        <p className="ats-lp-viz-cap">Issues found</p>
        <ul className="ats-lp-viz-list">
          <li>Phone number missing <span className="ats-lp-tag is-crit">Critical</span></li>
          <li>Two-column layout <span className="ats-lp-tag is-imp">Important</span></li>
          <li>No LinkedIn link <span className="ats-lp-tag">Optional</span></li>
        </ul>
      </div>
    )
  },
  {
    id: 'match',
    title: 'Match the job description',
    body: 'Recruiters search by keywords from the job post. Paste the role you want and we show which skills you already have and which ones are missing from your resume.',
    visual: (
      <div className="ats-lp-viz">
        <p className="ats-lp-viz-cap">Keyword match <b>3 of 5</b></p>
        <div className="ats-lp-chips">
          <span className="is-on">React</span>
          <span className="is-on">JavaScript</span>
          <span className="is-on">Git</span>
          <span>REST APIs</span>
          <span>Testing</span>
        </div>
        <p className="ats-lp-viz-note">Dashed = missing from your resume</p>
      </div>
    )
  },
  {
    id: 'improve',
    title: 'Know what to improve',
    body: 'No vague advice like "add keywords". You get a ranked list of fixes, and each one shows how many points it adds, so you start with what matters most.',
    visual: (
      <div className="ats-lp-viz">
        <p className="ats-lp-viz-cap">Ranked fixes</p>
        <ul className="ats-lp-viz-list">
          <li><b>+8</b>Add a skills section</li>
          <li><b>+5</b>Add numbers to your bullets</li>
          <li><b>+3</b>Use standard headings</li>
        </ul>
      </div>
    )
  },
  {
    id: 'confidence',
    title: 'Apply with confidence',
    body: 'Make the fixes, check again and watch your score go up. When it looks good, you send your resume knowing it was built to be read.',
    visual: (
      <div className="ats-lp-viz">
        <p className="ats-lp-viz-cap">Your score</p>
        <div className="ats-lp-bars">
          <div><span>Before</span><i style={{ width: '58%' }} /><b>58</b></div>
          <div className="is-after"><span>After</span><i style={{ width: '86%' }} /><b>86</b></div>
        </div>
      </div>
    )
  }
];

// What each part of the report tells you
const REPORT_FEATURES = [
  { Icon: Gauge, title: 'Overall ATS score', body: 'One score out of 100 with a band (Excellent, Good, Fair, Needs work) and a one-line verdict, plus the score you can reach after the fixes.' },
  { Icon: ListChecks, title: 'Issues by priority', body: 'Every problem is counted as Critical, Important or Optional, so you know what to fix first and what can wait.' },
  { Icon: ShieldCheck, title: 'Three score pillars', body: 'ATS compatibility (can it be parsed), skills coverage or keyword match, and resume impact (action verbs and numbers). Hover any pillar to see how it is judged.' },
  { Icon: Target, title: 'Job keyword match', body: 'With a job description: required and preferred keywords, marked as exact, synonym or partial match, and the ones still missing.' },
  { Icon: Sparkles, title: 'Skills we detected', body: 'The skills the ATS finds in your resume, so you can see what it sees, and what it misses.' },
  { Icon: LayoutList, title: 'Section check', body: 'Contact, education, skills, projects, experience and summary scored one by one, each with its top issue.' },
  { Icon: Wrench, title: 'Ranked fixes', body: 'Each fix shows the points it adds. Apply it in the resume builder, then re-run the check to see your new score.' }
];

const LP_FAQ = [
  { q: 'Is the ATS Checker free?', a: 'Yes. You get the full report for free: your overall score, the score breakdown, section-by-section analysis and every suggested fix. Nothing is locked.' },
  { q: 'What file formats can I upload?', a: 'PDF only, up to 10 MB. Use a text-based file rather than a scanned image so the checker can read your resume the way an ATS would.' },
  { q: 'How is my ATS score calculated?', a: 'Your score is built from three parts: ATS compatibility (can the layout be parsed cleanly), skills coverage (which skills are found) and resume impact (action verbs and measurable results in your bullets).' },
  { q: 'Should I add a job description?', a: 'It is optional but recommended when you apply for a specific role. With a job description you also get a keyword match showing which skills from the posting are missing from your resume.' },
  { q: 'Can I fix my resume after checking it?', a: 'Yes. The report ranks fixes by priority, and you can apply them in the resume builder, then check again to see your new score.' }
];

// ATS checker: the two ways to check (?mode= opens the checker directly)
const ATS_MODES = [
  {
    mode: 'resume',
    tag: 'Quick check',
    title: 'Resume only',
    desc: 'See how well ATS software can read your resume.',
    score: '93',
    scoreLabel: 'ATS score',
    rows: [['ATS compatibility', 100], ['Skills coverage', 92], ['Resume impact', 78]]
  },
  {
    mode: 'jd',
    tag: 'Best for applying',
    title: 'Resume + job description',
    desc: 'Match your resume to a job and find the missing keywords.',
    score: '3/5',
    scoreLabel: 'Keywords found',
    chips: [['React', 1], ['Node.js', 1], ['SQL', 1], ['AWS', 0], ['CI/CD', 0]]
  }
];

// ATS checker: how it works (3 steps)
const ATS_STEPS = [
  { id: 'upload', title: 'Upload your CV', body: 'Drop a PDF file, up to 10 MB.' },
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

const AtsLandingPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const [mode, setMode] = useState('resume'); // 'resume' | 'jd'
  const heroRef = useRef(null);
  const [showDock, setShowDock] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Floating CTAs appear only once the hero has fully scrolled out of view (above the viewport)
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setShowDock(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0),
      { threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // The file goes straight to the scanner, which starts verifying it on arrival
  const takeFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported. Export your resume as a PDF and try again.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('That file is over 10 MB. Try a smaller PDF.');
      return;
    }
    setError('');
    navigate(`${SCAN_PATH}?mode=${mode}`, { state: { file } });
  };

  return (
    <div className="rs-page ats-lp">

      {/* ── HERO: what this is + the upload field ── */}
      <section className="ats-lp-hero" ref={heroRef}>
        <div className="ats-lp-copy">
        <span className="rs-atsb-label ats-lp-label">For Students · Freshers · Working Professionals</span>
        <h1 className="ats-lp-title">
          Online <span className="rs-accent-text">ATS Checker</span> For FREE
        </h1>
        <p className="ats-lp-sub">
          An ATS (applicant tracking system) is the software companies use to read and rank resumes.
          Upload yours and get a full score, the keywords you are missing and fixes ranked by priority, in about 10 seconds.
        </p>

        <div className="ats-lp-toggle" role="radiogroup" aria-label="What to check">
          {HERO_MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={mode === m.value}
              className={mode === m.value ? 'is-on' : undefined}
              onClick={() => setMode(m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="ats-lp-toggle-hint">
          {mode === 'jd'
            ? 'Upload your resume, then paste the job description to find missing keywords.'
            : 'Check how well applicant tracking systems can read your resume.'}
        </p>

        <div
          className={`ats-lp-drop ${isDragging ? 'is-dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            takeFile(e.dataTransfer?.files?.[0]);
          }}
        >
          <input
            ref={inputRef}
            id="ats-lp-file"
            className="ats-lp-file"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => { takeFile(e.target.files?.[0]); e.target.value = ''; }}
          />
          <span className="ats-lp-drop-icon" aria-hidden="true"><UploadCloud size={26} /></span>
          <div className="ats-lp-drop-copy">
            <p className="ats-lp-drop-title">Drop your resume here</p>
            <p className="ats-lp-drop-hint">PDF only, up to 10 MB</p>
          </div>
          <button type="button" className="rs-btn rs-btn--dark rs-btn--lg" onClick={() => inputRef.current?.click()}>
            <UploadCloud size={16} />
            <span>Upload now</span>
          </button>
        </div>
        {error && <p className="ats-lp-error" role="alert">{error}</p>}
        <p className="ats-lp-note">Free · Full report, nothing locked</p>
        </div>

        {/* Desktop only: a look at the report you get */}
        <div className="ats-lp-visual" aria-hidden="true">
          <img src="/assets/resume-steps/ats-hero-report.webp" alt="" width={1120} height={1080} decoding="async" />
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section className="rs-section" aria-labelledby="ats-lp-why">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="ats-lp-why">
            Make every application <span className="rs-accent-text">count</span>
          </h2>
          <p className="rs-section-sub">A strong profile still loses if the software cannot read it. Check first, then apply.</p>
        </div>
        <ol className="ats-lp-why">
          {WHY.map(({ id, title, body, visual }) => (
            <li key={id}>
              <div className="ats-lp-why-text">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
              <div className="ats-lp-why-viz">{visual}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="rs-section" aria-labelledby="rs-ats-how-title">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="rs-ats-how-title">
            How to use it in <span className="rs-accent-text">3 steps</span>
          </h2>
          <p className="rs-section-sub">
            Find out if applicant tracking systems can read your resume, with a free ATS resume check.
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
                    <span className="rs-v-drop-hint">PDF</span>
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
          <button type="button" className="rs-btn rs-btn--dark rs-btn--lg" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); inputRef.current?.focus({ preventScroll: true }); }}>
            <UploadCloud size={16} />
            <span>Upload now</span>
          </button>
          <p className="rs-ats-cta-note">Free · PDF up to 10 MB</p>
        </div>
      </section>

      {/* ── TWO WAYS TO CHECK ── */}
      <section className="rs-section" aria-labelledby="rs-ats-modes-title">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="rs-ats-modes-title">
            Two ways to <span className="rs-accent-text">check</span>
          </h2>
          <p className="rs-section-sub">Start with the resume alone, or match it to a job.</p>
        </div>
        <div className="rs-am-options">
          {ATS_MODES.map(({ mode: m, tag, title, desc, score, scoreLabel, rows, chips }) => (
            <Link key={m} to={`${SCAN_PATH}?mode=${m}`} className="rs-am-option">
              <span className="rs-am-go" aria-hidden="true"><ArrowRight size={16} /></span>
              <div className="rs-am-art" aria-hidden="true">
                <div className="rs-am-score">
                  <b>{score}</b>
                  <span>{scoreLabel}</span>
                </div>
                {rows ? (
                  <ul className="rs-am-rows">
                    {rows.map(([label, val]) => (
                      <li key={label}>
                        <span>{label}<b>{val}</b></span>
                        <i style={{ width: `${val}%` }} className={val < 80 ? 'is-warn' : undefined} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="rs-am-chips">
                    {chips.map(([label, found]) => (
                      <li key={label} className={found ? 'is-on' : undefined}>{label}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rs-am-body">
                <span className="rs-am-tag">{tag}</span>
                <h3 className="rs-am-option-title">{title}</h3>
                <p className="rs-am-option-desc">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── THE PROBLEM WE ARE SOLVING ── */}
      <section className="rs-section" aria-labelledby="rs-ats-sample-title">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="rs-ats-sample-title">
            Other ATS checkers make you pay.<br /> We show your report <span className="rs-accent-text">for FREE</span>
          </h2>
          <p className="rs-section-sub">No paywall, no locked sections. See your full score and every fix.</p>
        </div>
        {/* Slide to compare a typical checker's report with ours */}
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
      </section>

      {/* ── THE REPORT, FEATURE BY FEATURE ── */}
      <section className="rs-section" aria-labelledby="ats-lp-report">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="ats-lp-report">
            What is inside your <span className="rs-accent-text">ATS report</span>
          </h2>
          <p className="rs-section-sub">What each part of the report tells you. The sample above shows all of it.</p>
        </div>

        <ol className="ats-lp-features">
          {REPORT_FEATURES.map(({ Icon, title, body }, i) => (
            <li key={title} className="ats-lp-feature">
              <span className="ats-lp-feature-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="ats-lp-card-icon" aria-hidden="true"><Icon size={18} /></span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── FAQ ── */}
      <section className="rs-section rs-faq">
        <div className="rs-section-head">
          <h2 className="rs-section-title">
            Frequently asked questions about the <span className="rs-accent-text">ATS checker</span>
          </h2>
        </div>
        <div className="rs-faq-list">
          {LP_FAQ.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={item.q} className={`rs-faq-item ${isOpen ? 'is-open' : ''}`}>
                <h3 className="rs-faq-q">
                  <button
                    type="button"
                    id={`ats-faq-q-${idx}`}
                    aria-expanded={isOpen}
                    aria-controls={`ats-faq-a-${idx}`}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={16} className="rs-faq-chevron" />
                  </button>
                </h3>
                <div
                  id={`ats-faq-a-${idx}`}
                  role="region"
                  aria-labelledby={`ats-faq-q-${idx}`}
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

      {/* ── FLOATING CTAs: shown after the hero ── */}
      <div className={`ats-lp-dock${showDock ? ' is-visible' : ''}`} aria-hidden={!showDock}>
        <Link to={`${SCAN_PATH}?mode=resume`} className="ats-lp-dock-btn ats-lp-dock-btn--brand" tabIndex={showDock ? 0 : -1}>
          <UploadCloud size={16} aria-hidden="true" />
          <span>Resume Only</span>
        </Link>
        <Link to={`${SCAN_PATH}?mode=jd`} className="ats-lp-dock-btn ats-lp-dock-btn--dark" tabIndex={showDock ? 0 : -1}>
          <UploadCloud size={16} aria-hidden="true" />
          <span>Upload Resume + JD</span>
        </Link>
      </div>
    </div>
  );
};

export default AtsLandingPage;
