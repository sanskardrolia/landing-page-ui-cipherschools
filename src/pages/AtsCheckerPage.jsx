import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Sparkles, 
  Info, 
  Check, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Layers, 
  ExternalLink,
  Search,
  Sliders,
  Filter,
  Flame,
  ArrowUpRight,
  ChevronRight,
  Cpu,
  Zap,
  Play,
  FastForward,
  CheckCheck,
  FileCode,
  Terminal,
  RefreshCw,
  Target,
  Wrench,
  X
} from 'lucide-react';
import { 
  analyzeResume, 
  SAMPLE_RESUMES 
} from '../utils/atsEngine';
import { ThinkingOrb } from 'thinking-orbs';
import { atsToBuilder, fixKindFor, readDraft, writeDraft, writeHandoff } from '../utils/resumeAtsBridge';
import { emptyResume, fullName } from '../utils/resumeData';

// ── Pillar Metadata & Hover Definitions ──
const PILLAR_DEFINITIONS = {
  atsCompatibility: {
    category: 'PILLAR 1',
    title: 'ATS Compatibility',
    description: 'Audits formatting, single-column parsing, font system, and OCR readability for major ATS platforms like Workday, Taleo, and Greenhouse.'
  },
  keywordMatch: {
    category: 'PILLAR 2',
    title: 'Keyword Match',
    description: 'Measures alignment against core skills, industry vocabulary, required competencies, and semantic job requirements.'
  },
  resumeImpact: {
    category: 'PILLAR 3',
    title: 'Resume Impact',
    description: 'Evaluates action verb strength, quantified achievements, metric density, and bullet-point conciseness.'
  }
};

// Skills pillar when no job description was given
const SKILLS_PILLAR_NO_JD = {
  category: 'PILLAR 2',
  title: 'Skills Coverage',
  description: 'Counts the in-demand engineering skills your resume shows. Add a job description to match against a specific role.'
};

const getPillarStatus = (score) => {
  if (score >= 80) {
    return { label: 'Excellent', color: '#059669', tone: 'good' };
  }
  if (score >= 55) {
    return { label: 'Needs attention', color: '#F3912E', tone: 'fair' };
  }
  return { label: 'Poor', color: '#DC2626', tone: 'poor' };
};

const BAND_LABELS = { EXCELLENT: 'Excellent', GOOD: 'Good', FAIR: 'Fair', NEEDS_WORK: 'Needs work' };
const PRIORITY_LABELS = { CRITICAL: 'Critical', IMPORTANT: 'Important', OPTIONAL: 'Optional' };
const MATCH_LABELS = { EXACT: 'Exact match', ALIAS: 'Synonym match', PARTIAL: 'Partial match' };

const prettyLabel = (value = '') => {
  const text = value.toLowerCase().replaceAll('_', ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const CircularScoreRing = ({ score = 0, size = 88, strokeWidth = 7, color = '#F3912E', showMax = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="pillar-circular-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="pillar-ring-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="pillar-ring-center-content">
        <span className="pillar-ring-score-val" style={{ color }}>{clampedScore}</span>
        {showMax && <span className="pillar-ring-score-max">/100</span>}
      </div>
    </div>
  );
};
import './AtsCheckerPage.css';

/**
 * Standalone ATS Checker Page with:
 * 1. Mode Selection: Standalone choice screen ("Upload Resume" vs "Upload JD + Resume")
 * 2. Upload Screen: Standalone workstation with dedicated back navigation
 * 3. Hand-Tuned ThinkingOrb from Libraries.dev on a clean light theme
 * 4. High-energy celebratory Flash Screen transition
 * 5. Standalone Report Dashboard with interactive fixes & schema JSON export
 */
const getThinkingOrbState = (stage) => {
  switch (stage) {
    case 'uploading': return 'connecting';
    case 'scraping': return 'searching';
    case 'analyzing': return 'solving';
    case 'almost_done': return 'composing';
    default: return 'searching';
  }
};

const AtsCheckerPage = () => {
  const navigate = useNavigate();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ── Main Page State Machine ──
  // 'MODE_SELECTION' = Standalone mode selection screen (Resume Only vs JD + Resume)
  // 'UPLOAD' = Standalone document upload workstation
  // 'ANIMATING' = AI Orb multi-stage processing pipeline
  // 'REPORT' = Standalone comprehensive ATS report page
  const [viewState, setViewState] = useState('MODE_SELECTION');

  // Selected analysis mode: 'RESUME_ONLY' (NO_JD) | 'JD_RESUME' (WITH_JD)
  const [selectedMode, setSelectedMode] = useState('RESUME_ONLY');

  // Orb Animation Pipeline States
  // 'uploading' | 'scraping' | 'analyzing' | 'almost_done'
  const [orbStage, setOrbStage] = useState('uploading');
  const [orbProgress, setOrbProgress] = useState(0);
  // Circular brand reveal after the scan: null | 'cover' | 'reveal'
  const [flashPhase, setFlashPhase] = useState(null);
  const [flashOrigin, setFlashOrigin] = useState({ x: '50%', y: '50%' });
  const scanOrbRef = useRef(null);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const animationTimersRef = useRef([]);
  const animationIntervalRef = useRef(null);

  // Resume Document States
  const [resumeData, setResumeData] = useState(SAMPLE_RESUMES.fresher.resume_json);
  const [docMetrics, setDocMetrics] = useState(SAMPLE_RESUMES.fresher.doc_metrics);
  const [fileName, setFileName] = useState('resume.pdf');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Upload & Transition Continuity States
  const [uploadStatus, setUploadStatus] = useState('ready'); // 'idle' | 'uploading' | 'ready'
  const [uploadProgress, setUploadProgress] = useState(100);
  const [uploadStatusText, setUploadStatusText] = useState('Document verified • Ready for ATS scan');
  const [fileSizeFormatted, setFileSizeFormatted] = useState('142 KB');
  const [isTransitioningToEngine, setIsTransitioningToEngine] = useState(false);
  const uploadTimerRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '142 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Job Description States
  const [jobDescription, setJobDescription] = useState('');
  const [jobMeta, setJobMeta] = useState('');

  // Analysis Result States
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Interactive Report States
  const [keywordFilter, setKeywordFilter] = useState('ALL'); // 'ALL' | 'MATCHED' | 'MISSING' | 'REQUIRED' | 'PREFERRED'
  const [fixedSuggestionIds, setFixedSuggestionIds] = useState(new Set());
  const [fixedSectionKeys, setFixedSectionKeys] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSectionExpand = (secKey) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(secKey)) next.delete(secKey);
      else next.add(secKey);
      return next;
    });
  };

  const fileInputRef = useRef(null);
  const reportRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Clear running animation timers on unmount
  useEffect(() => {
    return () => {
      animationTimersRef.current.forEach(timer => clearTimeout(timer));
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      if (uploadTimerRef.current) {
        clearInterval(uploadTimerRef.current);
      }
    };
  }, []);

  // Orange circle grows out of the orb to cover the screen, the view swaps
  // underneath, then a circle opens from the same point to reveal the report.
  const playReportReveal = (onSwap) => {
    const rect = scanOrbRef.current?.getBoundingClientRect();
    setFlashOrigin(rect
      ? { x: `${Math.round(rect.left + rect.width / 2)}px`, y: `${Math.round(rect.top + rect.height / 2)}px` }
      : { x: '50%', y: '50%' });
    setFlashPhase('cover');

    const swapTimer = setTimeout(() => {
      onSwap();
      window.scrollTo({ top: 0, behavior: 'auto' });
      setFlashPhase('reveal');
    }, 560);
    const endTimer = setTimeout(() => setFlashPhase(null), 1320);
    animationTimersRef.current.push(swapTimer, endTimer);
  };

  // ── Pipeline Runner: Uploading -> Scraping -> Analyzing -> Almost Done -> Flash -> Report ──
  const startAnalysisPipeline = (options = {}) => {
    if (isTransitioningToEngine) return;

    const activeResume = options.resume || resumeData;
    const activeMetrics = options.metrics || docMetrics;
    const activeMode = options.mode || selectedMode;
    const activeJd = activeMode === 'RESUME_ONLY' ? '' : (options.jd !== undefined ? options.jd : jobDescription);
    const activeMeta = activeMode === 'RESUME_ONLY' ? '' : (options.meta !== undefined ? options.meta : jobMeta);

    // Validation: Check JD length in JD mode
    if (activeMode === 'JD_RESUME') {
      const trimmedJd = (activeJd || '').trim();
      if (trimmedJd.length > 0 && trimmedJd.length < 200) {
        setErrorMessage('Job description must be at least 200 characters to match keywords accurately.');
        showToast('Job description must be at least 200 characters');
        return;
      }
      if (trimmedJd.length === 0) {
        setErrorMessage('Please paste a job description (minimum 200 characters).');
        showToast('Please provide a job description for JD + Resume matching');
        return;
      }
    }

    setErrorMessage('');
    setIsTransitioningToEngine(true);

    // 380ms smart continuity transition into the ATS engine
    setTimeout(() => {
      setViewState('ANIMATING');
      setIsTransitioningToEngine(false);
      setOrbStage('uploading');
      setOrbProgress(0);

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Clear any previous timers and intervals
      animationTimersRef.current.forEach(t => clearTimeout(t));
      animationTimersRef.current = [];
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }

      // ── SLOW & SMOOTH ANIMATION PIPELINE (Total: 9600ms) ──
      // Stage 1: Uploading (0% - 25% | 0s - 2.4s) -> thinking state: 'connecting'
      // Stage 2: Scraping  (25% - 55% | 2.4s - 5.2s) -> thinking state: 'searching'
      // Stage 3: Analyzing (55% - 85% | 5.2s - 8.1s) -> thinking state: 'solving'
      // Stage 4: Finalizing (85% - 100% | 8.1s - 9.6s) -> thinking state: 'composing'
      // Stage 5: Radiant Flash Screen (9.6s - 10.0s)
      const TOTAL_DURATION_MS = 9600;
      const startTime = Date.now();

      animationIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, Math.floor((elapsed / TOTAL_DURATION_MS) * 100));
        setOrbProgress(progress);

        if (progress < 25) {
          setOrbStage('uploading');
        } else if (progress < 55) {
          setOrbStage('scraping');
        } else if (progress < 85) {
          setOrbStage('analyzing');
        } else {
          setOrbStage('almost_done');
        }

        if (elapsed >= TOTAL_DURATION_MS) {
          clearInterval(animationIntervalRef.current);
          animationIntervalRef.current = null;
          setOrbProgress(100);
          setOrbStage('almost_done');

          try {
            // Deterministic ATS calculation
            const result = analyzeResume({
              resume_json: activeResume,
              doc_metrics: activeMetrics,
              job_description: activeJd,
              job_meta: activeMeta
            });

            if (result.error) {
              setErrorMessage(result.error.message);
              setViewState('UPLOAD');
              showToast(`Error: ${result.error.message}`);
              return;
            }

            setAnalysisResult(result);
            setFixedSuggestionIds(new Set());
            setFixedSectionKeys(new Set());
            playReportReveal(() => {
              setViewState('REPORT');
              showToast('ATS Report Generated Successfully');
            });
          } catch (err) {
            console.error('ATS calculation error:', err);
            setErrorMessage(err?.message || 'An unexpected error occurred during ATS analysis. Please try again.');
            setViewState('UPLOAD');
            showToast('Error generating ATS report');
          }
        }
      }, 50);
    }, 380);
  };

  // Instant skip for animation
  const handleSkipAnimation = () => {
    if (flashPhase) return;
    animationTimersRef.current.forEach(t => clearTimeout(t));
    animationTimersRef.current = [];
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    const activeJd = selectedMode === 'RESUME_ONLY' ? '' : jobDescription;
    const activeMeta = selectedMode === 'RESUME_ONLY' ? '' : jobMeta;

    try {
      const result = analyzeResume({
        resume_json: resumeData,
        doc_metrics: docMetrics,
        job_description: activeJd,
        job_meta: activeMeta
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        setViewState('UPLOAD');
        showToast(`Error: ${result.error.message}`);
        return;
      }

      setAnalysisResult(result);
      setFixedSuggestionIds(new Set());
      setFixedSectionKeys(new Set());
      playReportReveal(() => {
        setViewState('REPORT');
        showToast('ATS Report Generated');
      });
    } catch (err) {
      console.error('ATS calculation error:', err);
      setErrorMessage(err?.message || 'An unexpected error occurred during ATS analysis. Please try again.');
      setViewState('UPLOAD');
      showToast('Error generating ATS report');
    }
  };

  // Switch Mode handler: sets selected mode without leaving screen immediately
  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    setErrorMessage('');
  };

  // Continue CTA handler: advances to upload workstation
  const handleContinueFromSelection = (mode = selectedMode) => {
    setSelectedMode(mode);
    setErrorMessage('');
    setViewState('UPLOAD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mode === 'RESUME_ONLY') {
      showToast('Mode: Upload Your Resume');
    } else {
      showToast('Mode: Upload JD + Resume Match');
    }
  };

  // Helper to process uploaded file (PDF / DOCX) with animated verification
  const processUploadedFile = (file) => {
    if (!file) return;

    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current);
      uploadTimerRef.current = null;
    }

    const nameLower = file.name.toLowerCase();
    const isDocx = nameLower.endsWith('.docx') || nameLower.endsWith('.doc');
    const isPdf = nameLower.endsWith('.pdf');
    const format = isPdf ? 'pdf' : (isDocx ? 'docx' : 'pdf');
    const formattedSize = file.size ? formatFileSize(file.size) : '142 KB';

    setUploadedFile(file);
    setFileName(file.name);
    setFileSizeFormatted(formattedSize);
    setUploadStatus('uploading');
    setUploadProgress(15);
    setUploadStatusText('Ingesting document stream...');
    setErrorMessage('');

    // Smooth simulated upload progress with realistic ATS verification checkpoints
    const startTs = Date.now();
    const uploadDuration = 700; // 700ms smooth upload & verification

    uploadTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTs;
      const progress = Math.min(100, Math.floor((elapsed / uploadDuration) * 100));
      setUploadProgress(progress);

      if (progress < 35) {
        setUploadStatusText('Ingesting document stream...');
      } else if (progress < 70) {
        setUploadStatusText('Parsing text layer & font encodings...');
      } else if (progress < 95) {
        setUploadStatusText('Verifying single-column layout & OCR...');
      } else {
        setUploadStatusText('Document verified • Ready for ATS scan');
      }

      if (elapsed >= uploadDuration) {
        clearInterval(uploadTimerRef.current);
        uploadTimerRef.current = null;
        setUploadProgress(100);
        setUploadStatus('ready');

        const simulatedMetrics = {
          file_format: format,
          has_text_layer: true,
          column_count: 1,
          table_count: 0,
          text_box_count: 0,
          header_footer_contact: false,
          headings_recognized: true,
          headings_unknown_count: 0,
          date_format_consistent: true,
          dated_items_ratio: 0.95,
          has_images: false,
          has_icons: false,
          parse_rate: 0.98,
          has_unreadable_chars: false,
          months_of_experience: 18,
          page_count: 1,
          has_sensitive_info: false,
          language_issues_count: 0
        };

        // Clean candidate name from file name if recognizable
        const cleanBaseName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b(resume|cv|biodata|profile|ats)\b/gi, '')
          .trim();

        if (cleanBaseName && cleanBaseName.length >= 3) {
          const formattedName = cleanBaseName
            .split(' ')
            .filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
          
          if (formattedName) {
            setResumeData(prev => ({
              ...prev,
              name: formattedName
            }));
          }
        }

        setDocMetrics(simulatedMetrics);
        setErrorMessage('');
        showToast(`Document verified: ${file.name}`);
      }
    }, 35);
  };

  // File Upload Handler via file input
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  // "Apply this fix" opens a consent dialog: copy this resume into the builder, or start a new one
  const [fixConsent, setFixConsent] = useState(null); // { kind, title }
  const consentPrimaryRef = useRef(null);

  useEffect(() => {
    if (!fixConsent) return undefined;
    consentPrimaryRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setFixConsent(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fixConsent]);

  const existingDraft = fixConsent ? readDraft() : null;
  const existingDraftName = existingDraft?.personal ? fullName(existingDraft.personal) : '';

  const openBuilderWithCopy = () => {
    const isJd = analysisResult?.overall?.mode === 'WITH_JD';
    writeDraft(atsToBuilder(resumeData));
    writeHandoff({
      createdAt: Date.now(),
      reportScore: analysisResult?.overall?.score,
      mode: analysisResult?.overall?.mode,
      jd: isJd ? jobDescription : '',
      meta: isJd ? jobMeta : '',
      docMetrics,
      focusKind: fixConsent?.kind || null,
    });
    setFixConsent(null);
    navigate('/resume/builder?template=experienced&from=ats');
  };

  const openBuilderBlank = () => {
    writeDraft(emptyResume());
    writeHandoff(null);
    setFixConsent(null);
    navigate('/resume/builder?template=beginner');
  };

  // Calculate dynamic score with fixed suggestions and fixed sections
  const calculatedSuggestionPoints = analysisResult?.suggestions
    ? analysisResult.suggestions
        .filter(s => fixedSuggestionIds.has(s.id))
        .reduce((acc, s) => acc + s.pointsGain, 0)
    : 0;

  const calculatedSectionPoints = analysisResult?.sections
    ? analysisResult.sections
        .filter(s => fixedSectionKeys.has(s.key))
        .reduce((acc, s) => acc + (s.pointsGain ?? 5), 0)
    : 0;

  const calculatedPointsGained = calculatedSuggestionPoints + calculatedSectionPoints;

  const dynamicScore = analysisResult?.overall
    ? Math.min(100, analysisResult.overall.score + calculatedPointsGained)
    : 0;

  return (
    <div className="compiler-page-root ats-checker-page-root">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="compiler-toast-pill animate-fade-in">
          <Check size={14} className="text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Apply-fix consent dialog */}
      {fixConsent && (
        <div className="fc-overlay" onClick={() => setFixConsent(null)}>
          <div
            className="fc-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fc-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="fc-close" onClick={() => setFixConsent(null)} aria-label="Close">
              <X size={18} />
            </button>
            <span className="fc-icon" aria-hidden="true"><Sparkles size={20} /></span>
            <h2 id="fc-title" className="fc-title">Apply this fix in the Resume Builder</h2>
            <p className="fc-text">
              Fixes are made on an editable copy of your resume, so you can review every change before downloading a new PDF.
            </p>
            {fixConsent.title && <p className="fc-fix"><span>Fix</span>{fixConsent.title}</p>}

            <div className="fc-options">
              <button type="button" ref={consentPrimaryRef} className="fc-option fc-option--primary" onClick={openBuilderWithCopy}>
                <span className="fc-option-text">
                  <strong>Copy data from my resume</strong>
                  <span>Prefill the builder and apply fixes in one click</span>
                </span>
                <ArrowRight size={18} />
              </button>
              <button type="button" className="fc-option" onClick={openBuilderBlank}>
                <span className="fc-option-text">
                  <strong>Create a new resume</strong>
                  <span>Start from a blank template</span>
                </span>
                <ArrowRight size={18} />
              </button>
            </div>

            {existingDraftName && (
              <p className="fc-note">Either option replaces your current builder draft ({existingDraftName}).</p>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept=".pdf,.docx,.doc" 
        onChange={handleFileUpload} 
        style={{ display: 'none' }} 
      />

      {/* ── High-Energy Screen Flash Overlay ── */}
      {flashPhase && (
        <div
          className={`ats-reveal ats-reveal--${flashPhase}`}
          style={{ '--rx': flashOrigin.x, '--ry': flashOrigin.y }}
          aria-hidden="true"
        >
          <div className="ats-reveal-fill" />
          <div className="ats-reveal-ring" />
        </div>
      )}

      <div className="ats-checker-container">
        
        {/* ── Breadcrumb Navigation (hidden while the scan runs) ── */}
        {viewState !== 'ANIMATING' && (
        <div className="ats-breadcrumbs">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <ChevronRight size={13} className="breadcrumb-sep" />
          <Link to="/resume" className="breadcrumb-link">Resume Builder</Link>
          <ChevronRight size={13} className="breadcrumb-sep" />
          <span className="breadcrumb-current">ATS Checker Engine</span>
        </div>
        )}

        {/* =========================================================================
            VIEW 1: STANDALONE MODE SELECTION SCREEN (Google / CipherSchools Style)
            ========================================================================= */}
        {viewState === 'MODE_SELECTION' && (
          <div className="ats-mode-selection-view animate-fade-in">
            
            {/* Minimal Hero Header */}
            <section className="am-hero">
              <h1 className="am-title">
                Check your <span className="am-title-pill">ATS score</span>
              </h1>
              <p className="am-sub">Pick how you want your resume checked to get started.</p>
            </section>

            <div className="am-options">
              {[
                {
                  mode: 'RESUME_ONLY',
                  tag: 'Quick check',
                  title: 'Resume only',
                  desc: 'See how well applicant tracking systems can read your resume.',
                  points: ['Layout & formatting', 'Action verbs & metrics', 'Section-by-section fixes']
                },
                {
                  mode: 'JD_RESUME',
                  tag: 'Best for applying',
                  title: 'Resume + job description',
                  desc: 'Match your resume to a specific job and find missing keywords.',
                  points: ['Keyword & skill gaps', 'Role match score', 'What to add and where']
                }
              ].map(opt => {
                const openMode = () => handleContinueFromSelection(opt.mode);
                return (
                  <div
                    key={opt.mode}
                    className="am-option"
                    role="button"
                    tabIndex={0}
                    aria-label={`${opt.title}: ${opt.desc}`}
                    onClick={openMode}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openMode();
                      }
                    }}
                  >
                    <span className="am-go" aria-hidden="true"><ArrowRight size={16} /></span>

                    {/* Illustration */}
                    <div className="am-art" aria-hidden="true">
                      {opt.mode === 'RESUME_ONLY' ? (
                        <div className="am-sheet">
                          <span className="am-l am-l--name" />
                          <span className="am-l am-l--meta" />
                          <span className="am-l am-l--h" />
                          <span className="am-l" />
                          <span className="am-l am-l--short" />
                          <span className="am-l am-l--h" />
                          <span className="am-l" />
                          <span className="am-l am-l--short" />
                          <span className="am-badge am-badge--score">
                            <CheckCircle2 size={11} /> 92
                          </span>
                        </div>
                      ) : (
                        <div className="am-pair">
                          <div className="am-sheet am-sheet--sm">
                            <span className="am-l am-l--name" />
                            <span className="am-l am-l--h" />
                            <span className="am-l" />
                            <span className="am-l am-l--short" />
                            <span className="am-l am-l--h" />
                            <span className="am-l" />
                          </div>
                          <span className="am-link" />
                          <div className="am-sheet am-sheet--sm am-sheet--jd">
                            <span className="am-jd-icon"><Briefcase size={11} /></span>
                            <span className="am-l am-l--meta" />
                            <span className="am-chip-row">
                              <span className="am-chip is-hit" />
                              <span className="am-chip is-hit" />
                              <span className="am-chip is-miss" />
                            </span>
                            <span className="am-l" />
                            <span className="am-l am-l--short" />
                          </div>
                          <span className="am-badge am-badge--match">87% match</span>
                        </div>
                      )}
                    </div>

                    <div className="am-body">
                      <span className="am-tag">{opt.tag}</span>
                      <h3 className="am-option-title">{opt.title}</h3>
                      <p className="am-option-desc">{opt.desc}</p>
                      <ul className="am-points">
                        {opt.points.map(pt => (
                          <li key={pt}><Check size={14} /><span>{pt}</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="am-cta">
              <p className="am-note">Free · Takes about 10 seconds</p>
            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 2: STANDALONE DOCUMENT UPLOAD SCREEN
            ========================================================================= */}
        {viewState === 'UPLOAD' && (
          <div className="ats-upload-view animate-fade-in">
            
            {/* Standalone Upload Header Navigation Bar */}
            <div className="upload-top-nav">
              <button 
                type="button" 
                className="upload-back-btn"
                onClick={() => {
                  setErrorMessage('');
                  setViewState('MODE_SELECTION');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ArrowLeft size={15} />
                <span>Back to Mode Selection</span>
              </button>

              <div className="upload-mode-indicator">
                {selectedMode === 'RESUME_ONLY' ? (
                  <span className="mode-badge-pill resume-only-pill">
                    <Zap size={12} />
                    <span>MODE: RESUME ONLY</span>
                  </span>
                ) : (
                  <span className="mode-badge-pill jd-match-pill">
                    <Target size={12} />
                    <span>MODE: JD + RESUME MATCH</span>
                  </span>
                )}
              </div>
            </div>

            {/* Standalone Upload Hero Header */}
            <section className="ats-checker-hero upload-hero">
              <h1 className="ats-hero-title">
                {selectedMode === 'RESUME_ONLY' ? (
                  <>Upload Your <span className="headline-gradient">Resume</span></>
                ) : (
                  <>Upload <span className="headline-gradient">Resume & JD</span></>
                )}
              </h1>

              <p className="ats-hero-sub">
                {selectedMode === 'RESUME_ONLY' 
                  ? 'Upload your resume to check ATS readability, layout formatting, and impact score.'
                  : 'Provide your resume and target job description for keyword alignment and gap analysis.'}
              </p>
            </section>

            {/* Standalone Upload Workstation */}
            <div className={`ats-standalone-workstation ${selectedMode === 'RESUME_ONLY' ? 'centered-workstation' : ''}`}>
              <div className={`ats-workstation-panel compact-panel ${isTransitioningToEngine ? 'transitioning-to-engine' : ''}`}>
                
                {selectedMode === 'RESUME_ONLY' ? (
                  /* ── Resume Only: 2-Column Bento (Compact Upload + Minimal Checklist) ── */
                  <div className="resume-only-upload-grid">
                    
                    {/* Left: Compact Resume Upload Card */}
                    <div className="workstation-card compact-card">
                      <div className="workstation-card-head">
                        <div className="card-head-title">
                          <FileText size={16} style={{ color: '#ffa103' }} />
                          <h4>Resume Document</h4>
                        </div>
                        <span className="card-pill-tag">PDF / DOCX</span>
                      </div>

                      {/* Compact Dropzone with Animated In-Flight & Ready States */}
                      <div 
                        className={`file-dropzone-box compact-dropzone ${isDragging ? 'dragging-active' : ''} ${uploadStatus === 'uploading' ? 'is-uploading-active' : ''} ${uploadStatus === 'ready' ? 'is-file-ready' : ''}`}
                        onClick={() => {
                          if (uploadStatus !== 'uploading') {
                            fileInputRef.current?.click();
                          }
                        }}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const file = e.dataTransfer?.files?.[0];
                          if (file) processUploadedFile(file);
                        }}
                        title={uploadStatus === 'uploading' ? 'Uploading document...' : 'Click to choose or drop resume file (PDF/DOCX)'}
                      >
                        {uploadStatus === 'uploading' ? (
                          <div className="dropzone-uploading-state animate-fade-in">
                            <div className="upload-scanning-icon-wrap">
                              <div className="upload-icon-pulse-ring" />
                              <FileText size={22} className="upload-file-icon-amber" />
                              <div className="upload-scan-beam" />
                            </div>
                            
                            <div className="upload-progress-details">
                              <div className="upload-progress-meta-row">
                                <strong className="uploading-file-name" title={fileName}>{fileName}</strong>
                                <span className="upload-pct-badge">{uploadProgress}%</span>
                              </div>

                              <div className="upload-progress-track">
                                <div 
                                  className="upload-progress-fill" 
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>

                              <div className="upload-status-sub-row">
                                <RefreshCw size={11} className="animate-spin text-amber-500" />
                                <span className="upload-status-caption">{uploadStatusText}</span>
                              </div>
                            </div>
                          </div>
                        ) : uploadStatus === 'ready' && fileName ? (
                          <div className="dropzone-ready-state animate-fade-in">
                            <div className="ready-doc-avatar">
                              <FileText size={20} className="text-amber-500" />
                              <span className="ready-doc-format-badge">
                                {docMetrics.file_format?.toUpperCase() || 'PDF'}
                              </span>
                            </div>

                            <div className="ready-doc-details">
                              <div className="ready-doc-name-row">
                                <strong className="ready-doc-title" title={fileName}>{fileName}</strong>
                                <span className="ready-doc-size">{fileSizeFormatted}</span>
                              </div>
                              <span className="ready-doc-subtext">Click or drag new file to change</span>
                            </div>

                            <button 
                              type="button" 
                              className="ready-doc-replace-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              title="Choose a different resume file"
                            >
                              <UploadCloud size={13} />
                              <span>Replace</span>
                            </button>
                          </div>
                        ) : (
                          <div className="dropzone-idle-state">
                            <div className="dropzone-icon-circle compact-circle">
                              <UploadCloud size={20} />
                            </div>
                            <div className="dropzone-text-group">
                              <strong>{fileName}</strong>
                              <p>Drop file here or click to browse (max 10MB)</p>
                            </div>
                            <button 
                              type="button" 
                              className="dropzone-browse-btn compact-browse"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                            >
                              Browse
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Compact Trigger Button with Seamless Launching State */}
                      <div className="scan-trigger-bar compact-trigger">
                        {errorMessage && (
                          <div className="ats-error-banner animate-fade-in">
                            <AlertTriangle size={15} />
                            <span>{errorMessage}</span>
                          </div>
                        )}

                        <button
                          type="button"
                          className={`run-ats-scan-btn primary-start-btn ${isTransitioningToEngine ? 'is-launching' : ''}`}
                          onClick={() => startAnalysisPipeline()}
                          disabled={isTransitioningToEngine || uploadStatus === 'uploading'}
                        >
                          {isTransitioningToEngine ? (
                            <>
                              <RefreshCw size={16} className="animate-spin" />
                              <span>Connecting ATS Engine...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={16} />
                              <span>Start ATS Scan</span>
                              <ArrowRight size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Right: Minimal Important ATS Checklist Card */}
                    <div className="upload-guidelines-bento-card minimal-checklist-card">
                      <div className="guidelines-card-head">
                        <div className="guidelines-card-title">
                          <ShieldCheck size={16} className="guidelines-icon-amber" />
                          <h5>Important ATS Rules</h5>
                        </div>
                      </div>

                      <ul className="guidelines-checklist-list">
                        <li>
                          <CheckCircle2 size={15} className="checklist-check-icon" />
                          <span>Single-column format without tables or text boxes</span>
                        </li>
                        <li>
                          <CheckCircle2 size={15} className="checklist-check-icon" />
                          <span>Clean selectable text in PDF or DOCX format</span>
                        </li>
                        <li>
                          <CheckCircle2 size={15} className="checklist-check-icon" />
                          <span>Standard section headings: Experience, Skills, Education</span>
                        </li>
                        <li>
                          <CheckCircle2 size={15} className="checklist-check-icon" />
                          <span>Contact details placed in main document body</span>
                        </li>
                      </ul>
                    </div>

                  </div>
                ) : (
                  /* ── JD + Resume Mode: Compact Inputs + Bottom Guidelines Strip ── */
                  <div className="jd-resume-upload-wrapper">
                    
                    <div className="workstation-inputs-layout two-cols compact-layout">
                      {/* Left: Compact Resume Upload Card */}
                      <div className="workstation-card compact-card">
                        <div className="workstation-card-head">
                          <div className="card-head-title">
                            <FileText size={16} style={{ color: '#ffa103' }} />
                            <h4>Resume Document</h4>
                          </div>
                          <span className="card-pill-tag">PDF / DOCX</span>
                        </div>

                        {/* Compact Dropzone with Animated States */}
                        <div 
                          className={`file-dropzone-box compact-dropzone ${isDragging ? 'dragging-active' : ''} ${uploadStatus === 'uploading' ? 'is-uploading-active' : ''} ${uploadStatus === 'ready' ? 'is-file-ready' : ''}`}
                          onClick={() => {
                            if (uploadStatus !== 'uploading') {
                              fileInputRef.current?.click();
                            }
                          }}
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            const file = e.dataTransfer?.files?.[0];
                            if (file) processUploadedFile(file);
                          }}
                          title={uploadStatus === 'uploading' ? 'Uploading document...' : 'Click to choose or drop resume file (PDF/DOCX)'}
                        >
                          {uploadStatus === 'uploading' ? (
                            <div className="dropzone-uploading-state animate-fade-in">
                              <div className="upload-scanning-icon-wrap">
                                <div className="upload-icon-pulse-ring" />
                                <FileText size={22} className="upload-file-icon-amber" />
                                <div className="upload-scan-beam" />
                              </div>
                              
                              <div className="upload-progress-details">
                                <div className="upload-progress-meta-row">
                                  <strong className="uploading-file-name" title={fileName}>{fileName}</strong>
                                  <span className="upload-pct-badge">{uploadProgress}%</span>
                                </div>

                                <div className="upload-progress-track">
                                  <div 
                                    className="upload-progress-fill" 
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>

                                <div className="upload-status-sub-row">
                                  <RefreshCw size={11} className="animate-spin text-amber-500" />
                                  <span className="upload-status-caption">{uploadStatusText}</span>
                                </div>
                              </div>
                            </div>
                          ) : uploadStatus === 'ready' && fileName ? (
                            <div className="dropzone-ready-state animate-fade-in">
                              <div className="ready-doc-avatar">
                                <FileText size={20} className="text-amber-500" />
                                <span className="ready-doc-format-badge">
                                  {docMetrics.file_format?.toUpperCase() || 'PDF'}
                                </span>
                              </div>

                              <div className="ready-doc-details">
                                <div className="ready-doc-name-row">
                                  <strong className="ready-doc-title" title={fileName}>{fileName}</strong>
                                  <span className="ready-doc-size">{fileSizeFormatted}</span>
                                </div>
                                <span className="ready-doc-subtext">Click or drag new file to change</span>
                              </div>

                              <button 
                                type="button" 
                                className="ready-doc-replace-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fileInputRef.current?.click();
                                }}
                                title="Choose a different resume file"
                              >
                                <UploadCloud size={13} />
                                <span>Replace</span>
                              </button>
                            </div>
                          ) : (
                            <div className="dropzone-idle-state">
                              <div className="dropzone-icon-circle compact-circle">
                                <UploadCloud size={20} />
                              </div>
                              <div className="dropzone-text-group">
                                <strong>{fileName}</strong>
                                <p>Drop file here or click to browse (max 10MB)</p>
                              </div>
                              <button 
                                type="button" 
                                className="dropzone-browse-btn compact-browse"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fileInputRef.current?.click();
                                }}
                              >
                                Browse
                              </button>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Right: Compact Target Job Description Card */}
                      <div className="workstation-card compact-card">
                        <div className="workstation-card-head">
                          <div className="card-head-title">
                            <Briefcase size={16} style={{ color: '#ffa103' }} />
                            <h4>Target Job Description</h4>
                          </div>
                          <span className={`card-mode-pill ${jobDescription.trim().length >= 200 ? 'mode-with-jd' : 'mode-no-jd'}`}>
                            {jobDescription.trim().length >= 200 ? 'Ready' : 'Min 200 chars'}
                          </span>
                        </div>

                        <div className="jd-textarea-wrap compact-textarea-wrap">
                          <textarea
                            className="jd-textarea compact-textarea"
                            rows={4}
                            value={jobDescription}
                            onChange={(e) => {
                              setJobDescription(e.target.value);
                              if (errorMessage) setErrorMessage('');
                            }}
                            placeholder="Paste target job description here (minimum 200 characters)..."
                          />
                          <div className="jd-counter-bar">
                            <span className="jd-char-count">
                              {jobDescription.trim().length} characters
                            </span>
                            {jobDescription.trim().length >= 200 && (
                              <span className="jd-valid-tag">
                                <Check size={12} /> Ready
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Trigger Bar with Smooth Launching State */}
                    <div className="scan-trigger-bar compact-trigger">
                      {errorMessage && (
                        <div className="ats-error-banner animate-fade-in">
                          <AlertTriangle size={15} />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        className={`run-ats-scan-btn primary-start-btn ${isTransitioningToEngine ? 'is-launching' : ''}`}
                        onClick={() => startAnalysisPipeline()}
                        disabled={isTransitioningToEngine || uploadStatus === 'uploading'}
                      >
                        {isTransitioningToEngine ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            <span>Connecting ATS Engine...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} />
                            <span>Start ATS & JD Scan</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Bottom Guidelines Strip for JD Match */}
                    <div className="upload-guidelines-bento-strip minimal-checklist-strip">
                      <div className="guidelines-card-head">
                        <div className="guidelines-card-title">
                          <Target size={16} className="guidelines-icon-blue" />
                          <h5>Important JD Match Rules</h5>
                        </div>
                      </div>

                      <div className="guidelines-strip-grid">
                        <div className="guidelines-strip-item minimal-item">
                          <CheckCircle2 size={14} className="checklist-check-icon blue" />
                          <span>Full job description (minimum 200 characters)</span>
                        </div>
                        <div className="guidelines-strip-item minimal-item">
                          <CheckCircle2 size={14} className="checklist-check-icon blue" />
                          <span>Contextual skill proof inside experience bullets</span>
                        </div>
                        <div className="guidelines-strip-item minimal-item">
                          <CheckCircle2 size={14} className="checklist-check-icon blue" />
                          <span>Technical keywords and framework aliases</span>
                        </div>
                        <div className="guidelines-strip-item minimal-item">
                          <CheckCircle2 size={14} className="checklist-check-icon blue" />
                          <span>Required vs preferred competency alignment</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 2: 3D AI ORB ANIMATION PIPELINE VIEW
            ========================================================================= */}
        {viewState === 'ANIMATING' && (() => {
          const stages = [
            { key: 'uploading', label: 'Read', title: 'Reading your resume', from: 0, to: 25 },
            { key: 'scraping', label: 'Extract', title: 'Extracting the text', from: 25, to: 55 },
            {
              key: 'analyzing',
              label: selectedMode === 'JD_RESUME' ? 'Match' : 'Review',
              title: selectedMode === 'JD_RESUME' ? 'Matching it to the job' : 'Checking the content',
              from: 55,
              to: 85,
            },
            { key: 'almost_done', label: 'Score', title: 'Calculating your score', from: 85, to: 100 },
          ];
          const activeIndex = Math.max(0, stages.findIndex((st) => st.key === orbStage));

          return (
            <div className="ats-scan-view animate-engine-enter">
              <div className="ats-scan-bar">
                <div className="ats-scan-file" title={fileName}>
                  <span className="ats-scan-file-tag">{docMetrics.file_format?.toUpperCase() || 'PDF'}</span>
                  <span className="ats-scan-file-name">{fileName}</span>
                </div>
                <button
                  type="button"
                  className="ats-scan-skip"
                  onClick={handleSkipAnimation}
                >
                  Skip
                  <FastForward size={13} />
                </button>
              </div>

              <div className="ats-scan-stage">
                <div className="ats-scan-orb" ref={scanOrbRef}>
                  <span className="ats-scan-ring ats-scan-ring--outer" />
                  <span className="ats-scan-ring ats-scan-ring--arc" />
                  <span className="ats-scan-ring ats-scan-ring--inner" />
                  <div className="ats-scan-orb-canvas">
                    <ThinkingOrb
                      state={getThinkingOrbState(orbStage)}
                      size={64}
                      theme="light"
                      color="#F3912E"
                      speed={0.85}
                      dots={1.25}
                      dotSize={1.15}
                      gravity={true}
                    />
                  </div>
                </div>

                <p className="ats-scan-eyebrow">Step {activeIndex + 1} of {stages.length}</p>
                <h2 className="ats-scan-title" key={orbStage}>{stages[activeIndex].title}</h2>
              </div>

              <div className="ats-scan-progress" role="progressbar" aria-valuenow={orbProgress} aria-valuemin={0} aria-valuemax={100}>
                <div className="ats-scan-segments">
                  {stages.map((st, i) => {
                    const fill = Math.min(100, Math.max(0, ((orbProgress - st.from) / (st.to - st.from)) * 100));
                    return (
                      <div
                        key={st.key}
                        className={`ats-scan-seg ${i < activeIndex ? 'is-done' : ''} ${i === activeIndex ? 'is-active' : ''}`}
                      >
                        <div className="ats-scan-seg-track">
                          <div className="ats-scan-seg-fill" style={{ width: `${fill}%` }} />
                        </div>
                        <span className="ats-scan-seg-label">
                          {i < activeIndex && <Check size={11} strokeWidth={3} />}
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <span className="ats-scan-pct">{orbProgress}%</span>
              </div>
            </div>
          );
        })()}

        {/* =========================================================================
            VIEW 3: STANDALONE REPORT DASHBOARD VIEW
            ========================================================================= */}
        {viewState === 'REPORT' && analysisResult && (() => {
          const { overall, cards, keywords, keywordSummary, sections, suggestions, suggestionSummary } = analysisResult;
          const isJd = overall.mode === 'WITH_JD';
          const overallStatus = getPillarStatus(overall.score);
          const hasProjection = calculatedPointsGained > 0;
          const pillars = [
            { key: 'atsCompatibility', def: PILLAR_DEFINITIONS.atsCompatibility, data: cards.atsCompatibility },
            { key: 'keywordMatch', def: isJd ? PILLAR_DEFINITIONS.keywordMatch : SKILLS_PILLAR_NO_JD, data: cards.keywordMatch },
            { key: 'resumeImpact', def: PILLAR_DEFINITIONS.resumeImpact, data: cards.resumeImpact }
          ];
          const issueCounts = [
            { key: 'critical', label: 'Critical', count: overall.issues.critical },
            { key: 'important', label: 'Important', count: overall.issues.important },
            { key: 'optional', label: 'Optional', count: overall.issues.optional }
          ];
          const missingCount = keywords.filter(kw => kw.status === 'MISSING').length;
          const visibleKeywords = keywords.filter(kw => {
            if (keywordFilter === 'MATCHED') return kw.status !== 'MISSING';
            if (keywordFilter === 'MISSING') return kw.status === 'MISSING';
            return true;
          });
          const keywordGroups = [
            { key: 'REQUIRED', title: 'Required', items: visibleKeywords.filter(kw => kw.importance === 'REQUIRED') },
            { key: 'PREFERRED', title: 'Preferred', items: visibleKeywords.filter(kw => kw.importance !== 'REQUIRED') }
          ].filter(g => g.items.length > 0);
          // Sections that need work come first
          const orderedSections = [
            ...sections.filter(sec => sec.hasConcern || sec.topIssue),
            ...sections.filter(sec => !(sec.hasConcern || sec.topIssue))
          ];
          const resetToModeSelection = () => {
            setViewState('MODE_SELECTION');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          };

          return (
          <section className="ats-results-dashboard ar-report animate-fade-in" ref={reportRef}>

            {/* Top bar */}
            <div className="ar-topbar">
              <button type="button" className="ar-text-btn" onClick={resetToModeSelection}>
                <ArrowLeft size={15} />
                <span>New scan</span>
              </button>
              <div className="ar-topbar-right">
                <span className="ar-file" title={fileName}>
                  <span className="ar-file-tag">{docMetrics.file_format?.toUpperCase() || 'PDF'}</span>
                  <span className="ar-file-name">{fileName}</span>
                </span>
                <button
                  type="button"
                  className="ar-ghost-btn"
                  onClick={() => startAnalysisPipeline()}
                >
                  <RefreshCw size={14} />
                  <span>Re-run</span>
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="ar-card ar-summary">
              <div className="ar-summary-score">
                <CircularScoreRing score={overall.score} size={148} strokeWidth={10} color={overallStatus.color} showMax={false} />
                <span className={`ar-band ar-tone-${overallStatus.tone}`}>{BAND_LABELS[overall.band] || prettyLabel(overall.band)}</span>
              </div>

              <div className="ar-summary-body">
                <p className="ar-eyebrow">
                  {isJd
                    ? <>Matched to <strong>{overall.jobTitle || 'your job description'}</strong>{overall.company && <> at <strong>{overall.company}</strong></>}</>
                    : 'Resume-only scan'}
                </p>
                <h2 className="ar-verdict">{overall.verdict}</h2>

                <div className="ar-issues">
                  {issueCounts.map(item => (
                    <span key={item.key} className={`ar-issue ar-issue--${item.key} ${item.count === 0 ? 'is-zero' : ''}`}>
                      <span className="ar-issue-num">{item.count}</span>
                      {item.label}
                    </span>
                  ))}
                </div>

                <div className="ar-potential">
                  <div className="ar-potential-row">
                    <span>
                      {hasProjection
                        ? <>Projected score <strong>{dynamicScore}</strong></>
                        : <>Up to <strong>{overall.potentialScore}</strong> with the fixes below</>}
                    </span>
                    {suggestionSummary.pointsAvailable > 0 && (
                      <span className="ar-gain">+{suggestionSummary.pointsAvailable} pts available</span>
                    )}
                  </div>
                  <div className="ar-potential-bar" aria-hidden="true">
                    <span className="ar-potential-max" style={{ width: `${overall.potentialScore}%` }} />
                    <span className="ar-potential-now" style={{ width: `${hasProjection ? dynamicScore : overall.score}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pillars */}
            <div className="ar-pillars">
              {pillars.map(({ key, def, data }) => {
                const status = getPillarStatus(data.score);
                return (
                  <div key={key} className="ar-card ar-pillar">
                    <div className="ar-pillar-head">
                      <h3 className="ar-pillar-title">{def.title}</h3>
                      <div className="pillar-info-wrap">
                        <button type="button" className="pillar-info-icon-btn" aria-label={`About ${def.title}`}>
                          <Info size={14} />
                        </button>
                        <div className="pillar-info-popover" role="tooltip">
                          <strong className="popover-title">{def.title}</strong>
                          <p className="popover-desc">{def.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ar-pillar-body">
                      <CircularScoreRing score={data.score} size={72} strokeWidth={6} color={status.color} showMax={false} />
                      <div>
                        <p className={`ar-status ar-tone-${status.tone}`}>{status.label}</p>
                        <p className="ar-muted">{data.stat}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Keywords (JD) or detected skills (resume only) */}
            {isJd ? (
              <div className="ar-card">
                <div className="ar-card-head">
                  <div>
                    <h3 className="ar-card-title">Job keywords</h3>
                    <p className="ar-muted">
                      {keywordSummary.matched} of {keywordSummary.total} found in your resume
                      {keywordSummary.missingRequired > 0 && <> · <span className="ar-text-poor">{keywordSummary.missingRequired} required missing</span></>}
                    </p>
                  </div>
                  <div className="ar-segmented" role="tablist" aria-label="Filter keywords">
                    {[
                      { key: 'ALL', label: `All ${keywords.length}` },
                      { key: 'MATCHED', label: `Found ${keywords.length - missingCount}` },
                      { key: 'MISSING', label: `Missing ${missingCount}` }
                    ].map(tab => (
                      <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={keywordFilter === tab.key}
                        className={keywordFilter === tab.key ? 'is-active' : ''}
                        onClick={() => setKeywordFilter(tab.key)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {keywordGroups.length === 0 ? (
                  <p className="ar-empty">
                    {keywordFilter === 'MISSING' ? 'Nothing missing. Your resume covers every keyword in this job description.' : 'No keywords to show.'}
                  </p>
                ) : keywordGroups.map(group => (
                  <div key={group.key} className="ar-kw-group">
                    <p className="ar-kw-group-title">{group.title}</p>
                    <ul className="ar-kw-list">
                      {group.items.map(kw => {
                        const missing = kw.status === 'MISSING';
                        const tip = missing
                          ? `Not in your resume. Add it to ${kw.addTo || 'Skills'}.`
                          : `${MATCH_LABELS[kw.matchType] || prettyLabel(kw.matchType)}, ${kw.count}x · ${kw.foundIn}`;
                        return (
                          <li key={kw.text} className={`ar-kw ${missing ? 'is-missing' : 'is-found'}`} title={tip}>
                            {missing ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
                            <span>{kw.text}</span>
                            {!missing && kw.count > 1 && <span className="ar-kw-count">{kw.count}×</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ar-card ar-skills">
                <div className="ar-skills-body">
                  <h3 className="ar-card-title">Skills we detected</h3>
                  <p className="ar-muted">{keywords.length} in-demand skills found in your resume.</p>
                  <ul className="ar-kw-list">
                    {keywords.map(kw => (
                      <li key={kw.text} className="ar-kw is-found">
                        <CheckCircle2 size={13} />
                        <span>{kw.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="ar-skills-cta">
                  <Target size={18} />
                  <p>Applying for a specific role? Add the job description to see which keywords you are missing.</p>
                  <button
                    type="button"
                    className="ar-ghost-btn"
                    onClick={() => {
                      setSelectedMode('JD_RESUME');
                      setViewState('UPLOAD');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <span>Add job description</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Section health */}
            <div className="ar-card">
              <div className="ar-card-head">
                <div>
                  <h3 className="ar-card-title">Section check</h3>
                  <p className="ar-muted">Sections that need work are listed first.</p>
                </div>
              </div>

              <ul className="ar-sections">
                {orderedSections.map(sec => {
                  const hasConcern = Boolean(sec.hasConcern || sec.topIssue);
                  const isFixed = fixedSectionKeys.has(sec.key);
                  const isExpanded = expandedSections.has(sec.key);
                  const pointsGain = sec.pointsGain ?? 5;
                  const state = isFixed ? 'fixed' : hasConcern ? 'warn' : sec.score === null ? 'empty' : 'ok';
                  const stateLabel = { fixed: 'Done', warn: 'Needs work', empty: 'Not added', ok: 'Looks good' }[state];

                  return (
                    <li key={sec.key} className={`ar-sec ar-sec--${state} ${isExpanded ? 'is-open' : ''}`}>
                      <button
                        type="button"
                        className="ar-sec-row"
                        aria-expanded={isExpanded}
                        onClick={() => toggleSectionExpand(sec.key)}
                      >
                        <span className="ar-sec-icon">
                          {state === 'warn' ? <AlertTriangle size={15} /> : state === 'empty' ? <Info size={15} /> : <CheckCircle2 size={15} />}
                        </span>
                        <span className="ar-sec-name">{sec.title}</span>
                        <span className="ar-sec-state">{stateLabel}</span>
                        <span className="ar-sec-stat">{sec.stat}</span>
                        <span className="ar-sec-score">
                          {sec.score !== null ? (isFixed ? Math.min(100, sec.score + pointsGain) : sec.score) : ''}
                        </span>
                        <ChevronDown size={16} className="ar-sec-chevron" />
                      </button>

                      {isExpanded && (
                        <div className="ar-sec-body animate-fade-in">
                          {hasConcern ? (
                            <>
                              <p className="ar-sec-issue">{sec.topIssue}</p>
                              <p className="ar-sec-text">{sec.fixExplanation}</p>
                              {sec.fixAction && (
                                <p className="ar-sec-action"><Wrench size={13} /><span>{sec.fixAction}</span></p>
                              )}
                              <button
                                type="button"
                                className="ar-apply-btn"
                                onClick={() => setFixConsent({ kind: fixKindFor({ sectionKey: sec.key }), title: sec.topIssue })}
                              >
                                <Sparkles size={14} />
                                <span>Apply this fix</span>
                              </button>
                            </>
                          ) : (
                            <p className="ar-sec-text">{sec.fixExplanation}</p>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="ar-card">
                <div className="ar-card-head">
                  <div>
                    <h3 className="ar-card-title">Top fixes</h3>
                    <p className="ar-muted">{suggestionSummary.total} fixes, highest impact first.</p>
                  </div>
                  {suggestionSummary.pointsAvailable > 0 && (
                    <span className="ar-gain">+{suggestionSummary.pointsAvailable} pts available</span>
                  )}
                </div>

                <ol className="ar-fixes">
                  {suggestions.map(sugg => {
                    const isFixed = fixedSuggestionIds.has(sugg.id);
                    const priority = sugg.priority.toLowerCase();
                    return (
                      <li key={sugg.id} className={`ar-fix ${isFixed ? 'is-done' : ''}`}>
                        <div className="ar-fix-main">
                          <div className="ar-fix-meta">
                            <span className={`ar-priority ar-priority--${priority}`}>{PRIORITY_LABELS[sugg.priority] || prettyLabel(sugg.priority)}</span>
                            <span className="ar-dot-sep">·</span>
                            <span>{prettyLabel(sugg.action)}</span>
                            <span className="ar-dot-sep">·</span>
                            <span className="ar-text-good">+{sugg.pointsGain} pts</span>
                          </div>
                          <h4 className="ar-fix-title">{sugg.title}</h4>
                          <p className="ar-fix-reason">{sugg.reason}</p>

                          {(sugg.before || sugg.after) && (
                            <div className="ar-diff">
                              {sugg.before && (
                                <div className="ar-diff-line is-before">
                                  <span className="ar-diff-label">Before</span>
                                  <p>{sugg.before}</p>
                                </div>
                              )}
                              {sugg.after && (
                                <div className="ar-diff-line is-after">
                                  <span className="ar-diff-label">After</span>
                                  <p>{sugg.after}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          className="ar-apply-btn"
                          onClick={() => setFixConsent({ kind: fixKindFor({ suggestion: sugg }), title: sugg.title })}
                        >
                          <Sparkles size={14} />
                          <span>Apply fix</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {/* Bottom actions */}
            <div className="ar-bottom">
              <button type="button" className="ar-primary-btn" onClick={() => navigate('/resume')}>
                <span>Fix it in the Resume Builder</span>
                <ArrowRight size={16} />
              </button>
              <button type="button" className="ar-ghost-btn ar-ghost-btn--lg" onClick={resetToModeSelection}>
                <RotateCcw size={15} />
                <span>Scan another resume</span>
              </button>
            </div>

          </section>
          );
        })()}

      </div>
    </div>
  );
};

export default AtsCheckerPage;
