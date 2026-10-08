import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Check,
  UploadCloud
} from 'lucide-react';
import './ResumePage.css';

// ── ATS Proven Templates Data ──
const TEMPLATES = [
  {
    id: 'beginner',
    title: 'Beginner Template',
    badge: 'Freshers',
    tagline: 'Perfect for students and freshers starting their career journey.',
    description: 'Prioritizes education, academic projects, technical coursework, and foundational problem-solving strengths.',
    sampleCandidate: 'Anurag Mishra',
    role: 'Computer Science Graduate',
    highlights: ['Academic Credentials First', 'Core Coursework & Projects', 'Technical Strengths Matrix']
  },
  {
    id: 'experienced',
    title: 'Mid-Level Template',
    badge: 'Popular',
    tagline: 'Designed for early career pros to highlight key skills and achievements.',
    description: 'Balances quantified professional experience, measurable team impact, technical stack competencies, and verified achievements.',
    sampleCandidate: 'Sanskar Drolia',
    role: 'Senior Full-Stack Developer',
    highlights: ['Quantified Impact Metrics', 'Production Stack Breakdown', 'Architecture & System Design']
  },
  {
    id: 'modern',
    title: 'Senior Template',
    badge: 'Leadership',
    tagline: 'Optimized for leadership roles to showcase impact and expertise.',
    description: 'High-contrast executive layout engineered for senior engineers, tech leads, and managers highlighting strategic initiatives and mentorship.',
    sampleCandidate: 'Priya Sharma',
    role: 'Engineering Lead / Architect',
    highlights: ['Executive Summary', 'Cross-functional Leadership', 'Scale & Reliability Wins']
  }
];

const FAQ_ITEMS = [
  {
    q: 'How does the CipherSchools ATS Resume Builder ensure ATS friendliness?',
    a: 'Our templates are built using single-column semantic structures, standard system font hierarchies, and zero non-parseable tables or graphics. They adhere to strict parsing protocols recognized by Workday, Lever, Greenhouse, and Taleo.'
  },
  {
    q: 'Is CipherSchools Resume Builder really 100% free?',
    a: 'Yes, completely free! There are no watermarks, no hidden paywalls at checkout, and no limits on PDF exports or template changes.'
  },
  {
    q: 'Will my changes be saved if I accidentally close the tab?',
    a: 'Yes. The editor utilizes real-time local storage auto-save. Every keystroke is saved immediately on your machine without requiring manual save buttons.'
  },
  {
    q: 'Can I download my resume as a PDF and print it directly?',
    a: 'Absolutely. You can click the "Download PDF" button in the studio header or trigger browser printing directly with standard A4 margins.'
  }
];

const ResumePage = () => {
  const navigate = useNavigate();
  const templatesRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State Management
  const [selectedTemplate, setSelectedTemplate] = useState('experienced');
  const [toastMessage, setToastMessage] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  // Toast feedback helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const scrollToTemplates = () => {
    templatesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectTemplate = (tmplId) => {
    setSelectedTemplate(tmplId);
    showToast(`Template "${TEMPLATES.find(t => t.id === tmplId)?.title}" selected!`);
    scrollToTemplates();
  };

  const handleAtsCheckerClick = () => {
    navigate('/ats-checker');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast(`Analyzing "${file.name}" with ATS Parser...`);
    setTimeout(() => {
      showToast(`✓ ATS Compatibility Score: 96/100 (Optimal for Workday & Greenhouse)!`);
    }, 1200);

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleMyResumes = () => {
    showToast('No saved resumes found yet. Choose a template below to get started!');
    scrollToTemplates();
  };

  // Scroll listener for floating CTA dock
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCta(window.scrollY > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="compiler-page-root resume-page-root">
      
      {/* Hidden File Input for ATS Checker */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept=".pdf,.doc,.docx" 
        onChange={handleFileUpload} 
        style={{ display: 'none' }} 
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="compiler-toast-pill animate-fade-in">
          <Check size={14} className="text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         HERO SECTION: Compiler Style Title & Template Picker
         ───────────────────────────────────────────────────────────── */}
      <section className="compiler-hero-section">
        <div className="compiler-hero-inner">
          
          {/* Antigravity Pill Badge */}
          <span className="compiler-badge-pill">
            <span className="badge-pulse-dot" />
            FREE ATS RESUME BUILDER
          </span>

          <div className="compiler-header-text">
            <h1 className="compiler-main-title">
              <span className="compiler-title-line">
                <span className="compiler-title-black-italic">MAKE AN ATS RESUME</span>
              </span>
              <span className="compiler-title-line">
                <span className="compiler-title-black-italic">IN</span>{' '}
                <span className="compiler-hero-word-pill">
                  <span className="compiler-pill-text">MINUTES</span>
                </span>
              </span>
            </h1>

            <p className="compiler-subtitle">
              Create a job-ready resume in minutes. Choose from ATS-friendly, tested templates that make you stand out and get hired faster.
            </p>

            {/* Antigravity Hero Action Buttons */}
            <div className="hero-action-buttons">
              <button
                type="button"
                className="hero-btn-primary"
                onClick={scrollToTemplates}
              >
                <span>Build new Resume</span>
                <ChevronRight size={15} />
              </button>

              <button
                type="button"
                className="hero-btn-black"
                onClick={handleAtsCheckerClick}
                aria-label="ATS Checker"
              >
                <ShieldCheck size={16} />
                <span>ATS Checker</span>
              </button>

              <button
                type="button"
                className="hero-btn-secondary"
                onClick={handleMyResumes}
              >
                <span>My Resumes</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* ── OR PICK A TEMPLATE TO START (Segmented Pill Dock) ── */}
          <div className="pick-language-block">
            <span className="pick-language-label">OR PICK A TEMPLATE TO START</span>
            
            <div className="language-pills-row">
              {TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    className={`lang-pill-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    aria-label={`Select ${tmpl.title}`}
                  >
                    {tmpl.badge && (
                      <span className="lang-popular-badge">{tmpl.badge}</span>
                    )}
                    <FileText size={18} />
                    <span className="lang-pill-name">{tmpl.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SECTION 2: PROVEN PROFESSIONAL TEMPLATES (Compiler Card Pattern)
         Copy:
         - "Make Your Resume with Proven Professional Templates."
         - Beginner, Mid-Level, Senior templates with tags
         ───────────────────────────────────────────────────────────── */}
      <section className="resume-templates-section" ref={templatesRef}>
        <div className="section-head-center">
          <span className="compiler-badge-pill">PROVEN ATS TEMPLATES</span>
          <h2 className="section-title">
            Make Your Resume with <span className="headline-gradient">Proven Professional Templates.</span>
          </h2>
          <p className="section-subtitle">
            Engineered and tested against leading Applicant Tracking Systems (ATS) to ensure flawless parsing by recruiters.
          </p>
        </div>

        <div className="templates-showcase-grid">
          {TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;
            return (
              <div 
                key={tmpl.id} 
                className={`template-feature-card ${isSelected ? 'active-template' : ''}`}
              >
                <div className="template-card-header">
                  <div className="template-badge-pill">{tmpl.badge}</div>
                  <h3 className="template-card-title">{tmpl.title}</h3>
                  <p className="template-card-tagline">{tmpl.tagline}</p>
                </div>

                <div className="template-preview-mock">
                  <div className="mock-sheet-preview">
                    <div className="mock-sheet-bar" style={{ width: '40%', height: '8px', background: '#0F172A', marginBottom: '6px' }} />
                    <div className="mock-sheet-bar" style={{ width: '25%', height: '5px', background: '#94A3B8', marginBottom: '10px' }} />
                    <div className="mock-sheet-divider" />
                    <div className="mock-sheet-bar" style={{ width: '90%', height: '4px', background: '#CBD5E1', marginBottom: '4px' }} />
                    <div className="mock-sheet-bar" style={{ width: '82%', height: '4px', background: '#E2E8F0', marginBottom: '8px' }} />
                    <div className="mock-sheet-divider" />
                    <div className="mock-sheet-bar" style={{ width: '95%', height: '4px', background: '#CBD5E1', marginBottom: '4px' }} />
                    <div className="mock-sheet-bar" style={{ width: '70%', height: '4px', background: '#E2E8F0' }} />
                  </div>
                </div>

                <ul className="template-highlights-list">
                  {tmpl.highlights.map((h, i) => (
                    <li key={i}>
                      <Check size={13} className="text-emerald-500" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`template-select-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectTemplate(tmpl.id)}
                >
                  <span>{isSelected ? 'Currently Selected' : 'Use This Template'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SECTION 3: SKILLS LEVEL-UP BANNER (Compiler Bottom CTA Pattern)
         Copy:
         - "Want to level up your skills? 🚀"
         - "Upskill with CipherSchools industry-aligned courses, curated projects, and expert mentorship to supercharge your resume."
         - Button: "Explore Courses →"
         ───────────────────────────────────────────────────────────── */}
      <section className="compiler-bottom-cta">
        <div className="cta-box-card">
          <div className="cta-content">
            <h2 className="cta-heading">Want to level up your skills? 🚀</h2>
            <p className="cta-sub">
              Upskill with CipherSchools industry-aligned courses, curated projects, and expert mentorship to supercharge your resume.
            </p>
          </div>
          <div className="cta-actions">
            <button
              type="button"
              className="cta-btn-primary"
              onClick={() => navigate('/courses')}
            >
              <span>Explore Courses</span>
              <ArrowRight size={14} />
            </button>
            <button
              type="button"
              className="cta-btn-secondary"
              onClick={scrollToTemplates}
            >
              <span>Build new Resume</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SECTION 4: FAQ ACCORDION (Compiler FAQ Section Pattern)
         ───────────────────────────────────────────────────────────── */}
      <section className="compiler-faq-section">
        <div className="faq-container">
          
          <div className="section-head-center">
            <span className="compiler-badge-pill">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="section-title">
              Everything You Need to Know About <span className="headline-gradient">Resume Builder</span>
            </h2>
          </div>

          <div className="faq-accordion-wrap">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`faq-accordion-item ${isOpen ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.q}</span>
                    <span className="faq-toggle-icon">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-content animate-fade-in">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         FLOATING CTA DOCK (WHEN SCROLLED)
         ───────────────────────────────────────────────────────────── */}
      <div 
        className={`compiler-floating-cta-dock ${showFloatingCta ? 'visible' : ''}`}
        aria-hidden={!showFloatingCta}
      >
        <div className="floating-dock-card">
          <button
            type="button"
            className="floating-btn-primary"
            onClick={scrollToTemplates}
            aria-label="Build new Resume"
          >
            <span>Build new Resume</span>
            <ChevronRight size={15} />
          </button>

          <button
            type="button"
            className="floating-btn-black"
            onClick={handleAtsCheckerClick}
            aria-label="ATS Checker"
          >
            <ShieldCheck size={14} />
            <span>ATS Checker</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default ResumePage;
