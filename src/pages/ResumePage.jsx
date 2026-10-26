import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Check,
  ScanSearch,
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
    q: 'Is the resume builder free?',
    a: 'Yes. There are no watermarks, no paywall at download and no limit on PDF exports or template changes.'
  },
  {
    q: 'What makes these templates ATS-friendly?',
    a: 'They use a single-column structure, standard section headings and real text instead of tables, icons or images, so applicant tracking systems like Workday, Lever, Greenhouse and Taleo can read every line.'
  },
  {
    q: 'Do I need an account?',
    a: 'Yes, a free CipherSchools account. It lets you save your resumes and come back to edit them from any device.'
  }
];

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

  // "Check My ATS Score" opens the ATS Checker landing page
  const openAtsChecker = () => navigate('/resume/ats-checker');

  return (
    <div className="rs-page">

      {/* ── HERO ── */}
      <section className="rs-hero">
        <div className="rs-hero-copy">
          <span className="rs-hero-badge">100% Free with ATS Checker</span>
          <h1 className="rs-hero-title">
            <span className="rs-hero-line rs-hero-accent"><span className="rs-hero-ink">Online</span> Resume Builder</span>{' '}
            <span className="rs-hero-line">for Students &amp; Professionals</span>
          </h1>

          <p className="rs-hero-sub">
            Create a professional, ATS-friendly resume with free resume templates that help recruiters find your skills, with no design or formatting needed.
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
                <p className="rs-sheet-sub">Data Structure And Algorithm Univeristy</p>
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
            Other resume builders make you hustle.<br /> We make you <span className="rs-accent-text">apply at ease</span>
          </h2>
          <p className="rs-section-sub">Build a free, ATS-friendly resume and spend your time applying, not formatting.</p>
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
            Make your own <span className="rs-accent-text">resume online</span><br /> in 3 Simple Steps
          </h2>
          <p className="rs-section-sub">Pick a free resume template, add your details and download an ATS-friendly resume PDF. No design skills needed.</p>
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

      {/* ── ATS CHECKER BANNER ── */}
      <section className="rs-section rs-atsb-section" aria-labelledby="rs-atsb-title">
        <div className="rs-atsb">
          <div className="rs-atsb-text">
            <span className="rs-atsb-label">For Students · Freshers · Working Professionals</span>
            <h2 className="rs-atsb-title" id="rs-atsb-title">
              Online ATS Checker <span className="rs-accent-text">for FREE</span>
            </h2>
            <p className="rs-atsb-desc">
              Upload yours and get a full score, the keywords you are missing and fixes ranked by priority, in about 10 seconds.
            </p>
            <button type="button" className="rs-btn rs-btn--primary" onClick={openAtsChecker}>
              <span>Check my ATS Score</span>
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="rs-atsb-visual" aria-hidden="true">
            <div className="rs-atsb-score">
              <svg viewBox="0 0 36 36" width="76" height="76">
                <circle cx="18" cy="18" r="15.5" className="rs-atsb-ring-bg" />
                <circle cx="18" cy="18" r="15.5" className="rs-atsb-ring" pathLength="100" strokeDasharray="82 100" />
              </svg>
              <span className="rs-atsb-score-num">82<small>/100</small></span>
            </div>
            <div className="rs-atsb-col">
              <p className="rs-atsb-cap">Missing keywords</p>
              <div className="rs-atsb-chips">
                <span>React</span><span>REST APIs</span><span>Git</span>
              </div>
              <p className="rs-atsb-cap">Top fixes</p>
              <ul className="rs-atsb-fixes">
                <li><b>High</b> Add a skills section</li>
                <li><b>Med</b> Quantify project impact</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEEDBACK ── */}
      <section className="rs-section rs-feedback" aria-labelledby="rs-feedback-title">
        <div className="rs-section-head">
          <h2 className="rs-section-title" id="rs-feedback-title">
            Don't believe us. Believe the<br /> <span className="rs-accent-text">opportunity seekers</span> who did.
          </h2>
          <p className="rs-section-sub">Reviews from students, freshers and professionals who built their resumes with the CipherSchools resume builder.</p>
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
            Frequently asked questions about <span className="rs-accent-text">Resume Builder</span>
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
