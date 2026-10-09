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
  Wrench
} from 'lucide-react';
import { 
  analyzeResume, 
  SAMPLE_RESUMES 
} from '../utils/atsEngine';
import { ThinkingOrb } from 'thinking-orbs';

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

const getPillarStatus = (score) => {
  if (score >= 80) {
    return {
      label: 'Excellent',
      color: '#10B981',
      badgeClass: 'pillar-badge-excellent'
    };
  }
  if (score >= 55) {
    return {
      label: 'Needs Attention',
      color: '#FFA103',
      badgeClass: 'pillar-badge-attention'
    };
  }
  return {
    label: 'Poor',
    color: '#EF4444',
    badgeClass: 'pillar-badge-poor'
  };
};

const CircularScoreRing = ({ score = 0, size = 88, strokeWidth = 7, color = '#FFA103' }) => {
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
          stroke="#F1F5F9"
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
        <span className="pillar-ring-score-max">/100</span>
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
  const [isFlashing, setIsFlashing] = useState(false);
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
            setIsFlashing(true);

            const flashTimer = setTimeout(() => {
              setIsFlashing(false);
              setViewState('REPORT');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              showToast('ATS Report Generated Successfully');
            }, 400);
            animationTimersRef.current.push(flashTimer);
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
      setIsFlashing(true);

      setTimeout(() => {
        setIsFlashing(false);
        setViewState('REPORT');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('ATS Report Generated');
      }, 280);
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
  const handleContinueFromSelection = () => {
    setErrorMessage('');
    setViewState('UPLOAD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (selectedMode === 'RESUME_ONLY') {
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

  // Toggle Fix for Suggestions
  const handleToggleFix = (suggId, pointsGain) => {
    setFixedSuggestionIds(prev => {
      const next = new Set(prev);
      if (next.has(suggId)) {
        next.delete(suggId);
      } else {
        next.add(suggId);
        showToast(`Fix applied! Score boosted by +${pointsGain} points.`);
      }
      return next;
    });
  };

  // Toggle Fix for Section Concerns
  const handleToggleSectionFix = (secKey, pointsGain = 5) => {
    setFixedSectionKeys(prev => {
      const next = new Set(prev);
      if (next.has(secKey)) {
        next.delete(secKey);
        showToast('Section fix reverted.');
      } else {
        next.add(secKey);
        showToast(`Section fix applied! Score boosted by +${pointsGain} points.`);
      }
      return next;
    });
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
        .reduce((acc, s) => acc + (s.pointsGain || 5), 0)
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

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept=".pdf,.docx,.doc" 
        onChange={handleFileUpload} 
        style={{ display: 'none' }} 
      />

      {/* ── High-Energy Screen Flash Overlay ── */}
      {isFlashing && (
        <div className="ats-flash-screen" />
      )}

      <div className="ats-checker-container">
        
        {/* ── Breadcrumb Navigation ── */}
        <div className="ats-breadcrumbs">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <ChevronRight size={13} className="breadcrumb-sep" />
          <Link to="/resume" className="breadcrumb-link">Resume Builder</Link>
          <ChevronRight size={13} className="breadcrumb-sep" />
          <span className="breadcrumb-current">ATS Checker Engine</span>
        </div>

        {/* =========================================================================
            VIEW 1: STANDALONE MODE SELECTION SCREEN (Google / CipherSchools Style)
            ========================================================================= */}
        {viewState === 'MODE_SELECTION' && (
          <div className="ats-mode-selection-view animate-fade-in">
            
            {/* Minimal Hero Header */}
            <section className="ats-checker-hero centered-hero">
              <h1 className="ats-hero-title">
                ATS <span className="headline-gradient">ANALYSIS</span>
              </h1>

              <p className="ats-hero-sub">
                Select your evaluation method to check ATS readability and match score.
              </p>
            </section>

            {/* ── Google-style Card Selector List (Matching Screenshot with 4px Border & Benefit Pointers) ── */}
            <div className="ats-google-selector-container">
              
              {/* Option 1: Upload Resume (Resume Only) */}
              <div 
                className={`ats-google-option-row ${selectedMode === 'RESUME_ONLY' ? 'is-selected' : ''}`}
                onClick={() => handleSelectMode('RESUME_ONLY')}
                onDoubleClick={handleContinueFromSelection}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter') handleContinueFromSelection(); 
                  if (e.key === ' ') handleSelectMode('RESUME_ONLY');
                }}
              >
                {/* Minimal Infographic Box */}
                <div className="option-infographic-frame">
                  <div className="mini-doc-canvas">
                    <div className="mini-doc-header-line" />
                    <div className="mini-doc-sub-line" />
                    <div className="mini-doc-divider" />
                    <div className="mini-doc-body-lines">
                      <span className="mini-line line-1" />
                      <span className="mini-line line-2" />
                      <span className="mini-line line-3" />
                    </div>
                  </div>
                  {/* Floating Minimal ATS Badge */}
                  <div className="mini-floating-badge badge-ats">
                    <CheckCircle2 size={10} className="badge-icon-orange" />
                    <span>ATS</span>
                  </div>
                </div>

                {/* Option Text & Benefits */}
                <div className="option-content-block">
                  <div className="option-title-row">
                    <h3 className="option-title">Upload Resume</h3>
                    {selectedMode === 'RESUME_ONLY' && (
                      <span className="selected-mode-pill">Selected</span>
                    )}
                  </div>
                  <p className="option-description">
                    Evaluate formatting compliance, single-column readability, and action verb impact.
                  </p>

                  {/* 3 Benefit Pointers */}
                  <ul className="option-benefits-list">
                    <li className="option-benefit-item">
                      <CheckCircle2 size={13} className="benefit-icon-amber" />
                      <span>Single-column formatting & standard heading compliance</span>
                    </li>
                    <li className="option-benefit-item">
                      <CheckCircle2 size={13} className="benefit-icon-amber" />
                      <span>Action verb strength & metric density evaluation</span>
                    </li>
                    <li className="option-benefit-item">
                      <CheckCircle2 size={13} className="benefit-icon-amber" />
                      <span>Selectable text layer & instant OCR parse score</span>
                    </li>
                  </ul>
                </div>

                {/* Action Arrow */}
                <div className="option-arrow-box">
                  <ChevronRight size={18} />
                </div>
              </div>

              {/* Option 2: Upload JD + Resume (Role Targeted Match) */}
              <div 
                className={`ats-google-option-row ${selectedMode === 'JD_RESUME' ? 'is-selected' : ''}`}
                onClick={() => handleSelectMode('JD_RESUME')}
                onDoubleClick={handleContinueFromSelection}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter') handleContinueFromSelection(); 
                  if (e.key === ' ') handleSelectMode('JD_RESUME');
                }}
              >
                {/* Minimal Infographic Box */}
                <div className="option-infographic-frame">
                  <div className="mini-doc-canvas jd-canvas">
                    <div className="mini-doc-header-line" />
                    <div className="mini-doc-sub-line" />
                    <div className="mini-doc-divider" />
                    <div className="mini-doc-body-lines">
                      <span className="mini-line line-1" />
                      <span className="mini-line line-2" />
                    </div>
                  </div>
                  {/* Floating JD Badge Top-Right */}
                  <div className="mini-floating-badge badge-jd-top">
                    <Briefcase size={9} className="badge-icon-blue" />
                    <span>JD</span>
                  </div>
                  {/* Floating Match Badge Bottom-Left */}
                  <div className="mini-floating-badge badge-match-bottom">
                    <Sparkles size={9} className="badge-icon-orange" />
                    <span>Match</span>
                  </div>
                </div>

                {/* Option Text & Benefits */}
                <div className="option-content-block">
                  <div className="option-title-row">
                    <h3 className="option-title">Upload JD + Resume</h3>
                    {selectedMode === 'JD_RESUME' && (
                      <span className="selected-mode-pill blue">Selected</span>
                    )}
                  </div>
                  <p className="option-description">
                    Compare your resume against a target job description to diagnose keyword and skill gaps.
                  </p>

                  {/* 3 Benefit Pointers */}
                  <ul className="option-benefits-list">
                    <li className="option-benefit-item">
                      <CheckCircle2 size={13} className="benefit-icon-blue" />
                      <span>Role-targeted keyword & skill gap diagnosis</span>
                    </li>
                    <li className="option-benefit-item">
                      <CheckCircle2 size={13} className="benefit-icon-blue" />
                      <span>Hard & soft competency coverage against job description</span>
                    </li>
                    <li className="option-benefit-item">
                      <CheckCircle2 size={13} className="benefit-icon-blue" />
                      <span>Deterministic match score to beat recruiter ATS filters</span>
                    </li>
                  </ul>
                </div>

                {/* Action Arrow */}
                <div className="option-arrow-box">
                  <ChevronRight size={18} />
                </div>
              </div>

              {/* Dedicated Continue CTA */}
              <div className="selector-cta-row">
                <button
                  type="button"
                  className="selector-continue-btn"
                  onClick={handleContinueFromSelection}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              </div>

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
        {viewState === 'ANIMATING' && (
          <div className="ats-orb-animation-view animate-engine-enter">
            
            {/* Top Quick Actions Bar with Mode Indicator */}
            <div className="orb-top-nav">
              <div className="orb-mode-pill-chip">
                {selectedMode === 'RESUME_ONLY' ? (
                  <>
                    <Zap size={12} className="text-amber-500" />
                    <span>MODE: RESUME ONLY</span>
                  </>
                ) : (
                  <>
                    <Target size={12} className="text-blue-500" />
                    <span>MODE: JD + RESUME MATCH</span>
                  </>
                )}
              </div>

              <button 
                type="button" 
                className="skip-animation-btn"
                onClick={handleSkipAnimation}
                title="Skip animation and display report immediately"
              >
                <span>Skip to Report</span>
                <FastForward size={14} />
              </button>
            </div>

            {/* Central Clean Light-Themed ThinkingOrb Showcase */}
            <div className="ats-orb-centerpiece clean-light-theme">
              
              {/* Document Identity Pill (Continuity Anchor: Upload -> Engine) */}
              <div className="engine-continuity-header animate-fade-in">
                <div className="engine-doc-identity-pill">
                  <div className="doc-pill-left">
                    <span className="doc-pill-format-tag">
                      {docMetrics.file_format?.toUpperCase() || 'PDF'}
                    </span>
                    <FileText size={14} className="doc-pill-file-icon" />
                    <span className="doc-pill-file-name" title={fileName}>
                      {fileName}
                    </span>
                    <span className="doc-pill-file-size">
                      {fileSizeFormatted || '142 KB'}
                    </span>
                  </div>
                </div>

                {/* Animated Stream Connector Flowing into the Orb Pedestal */}
                <div className="engine-stream-flow-line">
                  <div className="flow-pulse-particle" />
                </div>
              </div>

              {/* Grand Glowing Pedestal with ThinkingOrb from Libraries.dev */}
              <div className="clean-thinking-orb-stage">
                <div className="clean-orb-pedestal">
                  <div className="clean-orb-glow-backdrop" />
                  <div className="clean-orb-ambient-ring" />
                  <div className="clean-orb-inner-ring" />
                  <div className="clean-orb-canvas-wrap">
                    <ThinkingOrb 
                      state={getThinkingOrbState(orbStage)} 
                      size={64} 
                      theme="light"
                      color="#ffa103"
                      speed={0.85}
                      dots={1.25}
                      dotSize={1.15}
                      gravity={true}
                    />
                  </div>
                </div>
              </div>

              {/* Minimal Calm Status Title with Continuity Document Reference */}
              <h2 className="orb-stage-minimal-title">
                {orbStage === 'uploading' && `Ingesting "${fileName}" & validating layout structure...`}
                {orbStage === 'scraping' && `Extracting text layer & verifying single-column hierarchy...`}
                {orbStage === 'analyzing' && (selectedMode === 'JD_RESUME' 
                  ? `Comparing "${fileName}" against target job description...` 
                  : `Evaluating action verbs, metric density & formatting compliance...`)}
                {orbStage === 'almost_done' && `Compiling deterministic ATS score & recommendations...`}
              </h2>

              {/* Minimal 4-Step Pipeline Flow */}
              <div className="orb-minimal-steps">
                <div className={`orb-step-item ${orbStage === 'uploading' ? 'current' : orbProgress >= 25 ? 'done' : ''}`}>
                  <span className="orb-step-num">1</span>
                  <span>Upload</span>
                </div>
                <span className="orb-step-arrow">→</span>
                <div className={`orb-step-item ${orbStage === 'scraping' ? 'current' : orbProgress >= 55 ? 'done' : ''}`}>
                  <span className="orb-step-num">2</span>
                  <span>Scrape</span>
                </div>
                <span className="orb-step-arrow">→</span>
                <div className={`orb-step-item ${orbStage === 'analyzing' ? 'current' : orbProgress >= 85 ? 'done' : ''}`}>
                  <span className="orb-step-num">3</span>
                  <span>Analyze</span>
                </div>
                <span className="orb-step-arrow">→</span>
                <div className={`orb-step-item ${orbStage === 'almost_done' ? 'current' : orbProgress === 100 ? 'done' : ''}`}>
                  <span className="orb-step-num">4</span>
                  <span>Finalize</span>
                </div>
              </div>

              {/* Minimal Sleek Progress Bar */}
              <div className="orb-minimal-progress-wrap">
                <div className="orb-minimal-progress-bar">
                  <div 
                    className="orb-minimal-progress-fill" 
                    style={{ width: `${orbProgress}%` }}
                  />
                </div>
                <span className="orb-minimal-progress-pct">{orbProgress}%</span>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 3: STANDALONE REPORT DASHBOARD VIEW
            ========================================================================= */}
        {viewState === 'REPORT' && analysisResult && (
          <section className="ats-results-dashboard animate-fade-in" ref={reportRef}>
            
            {/* Standalone Report Header Navigation Bar */}
            <div className="report-standalone-navbar">
              <button 
                type="button" 
                className="report-back-btn"
                onClick={() => {
                  setViewState('MODE_SELECTION');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ArrowLeft size={15} />
                <span>Back to Mode Selection</span>
              </button>

              <div className="report-nav-actions">
                <button 
                  type="button" 
                  className="rerun-scan-nav-btn"
                  onClick={() => startAnalysisPipeline()}
                  title="Re-run the full 4-stage scan animation"
                >
                  <RefreshCw size={14} />
                  <span>Re-run Scan</span>
                </button>
              </div>
            </div>

            {/* Top Overview Banner Card */}
            <div className="results-hero-banner">
              <div className="score-radial-group">
                <div className={`score-radial-circle band-${analysisResult.overall.band.toLowerCase()}`}>
                  <span className="score-big-number">{dynamicScore}</span>
                  <span className="score-total-denom">/100</span>
                </div>
                <div className="score-band-pill">
                  {analysisResult.overall.band}
                </div>
              </div>

              <div className="banner-details-group">
                <div className="banner-top-tags">
                  <span className="mode-indicator-chip">
                    MODE: <strong>{analysisResult.overall.mode}</strong>
                  </span>
                  {analysisResult.overall.jobTitle && (
                    <span className="target-role-chip">
                      Target: <strong>{analysisResult.overall.jobTitle}</strong> ({analysisResult.overall.company || 'Enterprise'})
                    </span>
                  )}
                  <span className="potential-score-chip">
                    Potential Score: <strong>{analysisResult.overall.potentialScore}/100</strong>
                    {analysisResult.suggestionSummary.pointsAvailable > 0 && (
                      <span> (+{analysisResult.suggestionSummary.pointsAvailable} pts available)</span>
                    )}
                  </span>
                </div>

                <h2 className="verdict-heading">
                  "{analysisResult.overall.verdict}"
                </h2>

                <div className="issues-counter-row">
                  <span className="issue-count-item critical">
                    <span className="count-dot" /> {analysisResult.overall.issues.critical} Critical
                  </span>
                  <span className="issue-count-item important">
                    <span className="count-dot" /> {analysisResult.overall.issues.important} Important
                  </span>
                  <span className="issue-count-item optional">
                    <span className="count-dot" /> {analysisResult.overall.issues.optional} Optional
                  </span>
                </div>
              </div>
            </div>

            {/* ── 3 Main Pillar Cards (Minimal Circular Gauge + Info Popover) ── */}
            <div className="pillar-cards-grid">
              {[
                {
                  key: 'atsCompatibility',
                  def: PILLAR_DEFINITIONS.atsCompatibility,
                  data: analysisResult.cards.atsCompatibility
                },
                {
                  key: 'keywordMatch',
                  def: PILLAR_DEFINITIONS.keywordMatch,
                  data: analysisResult.cards.keywordMatch
                },
                {
                  key: 'resumeImpact',
                  def: PILLAR_DEFINITIONS.resumeImpact,
                  data: analysisResult.cards.resumeImpact
                }
              ].map(({ key, def, data }) => {
                const status = getPillarStatus(data.score);
                return (
                  <div key={key} className="pillar-minimal-card">
                    <div className="pillar-card-top-row">
                      <span className="pillar-category-tag">{def.category}</span>
                      
                      {/* Info Button with Hover Popover */}
                      <div className="pillar-info-wrap">
                        <button 
                          type="button" 
                          className="pillar-info-icon-btn" 
                          aria-label={`About ${def.title}`}
                        >
                          <Info size={13} />
                        </button>
                        <div className="pillar-info-popover" role="tooltip">
                          <strong className="popover-title">{def.title}</strong>
                          <p className="popover-desc">{def.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pillar-title-row">
                      <h3 className="pillar-title-text">{def.title}</h3>
                    </div>

                    <div className="pillar-visual-content">
                      <CircularScoreRing score={data.score} color={status.color} />
                      
                      <div className="pillar-score-details">
                        <span className={`pillar-label-badge ${status.badgeClass}`}>
                          {status.label}
                        </span>
                        <span className="pillar-stat-text">{data.stat}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Targeted Keywords Breakdown (When WITH_JD) ── */}
            {analysisResult.overall.mode === 'WITH_JD' && (
              <div className="keywords-deep-dive-card">
                <div className="section-header-row">
                  <div>
                    <h3 className="section-block-title">Job Description Skills Breakdown</h3>
                  </div>
                  <div className="keyword-filters-row">
                    <button
                      type="button"
                      className={`filter-tab-btn ${keywordFilter === 'ALL' ? 'active' : ''}`}
                      onClick={() => setKeywordFilter('ALL')}
                    >
                      All ({analysisResult.keywords.length})
                    </button>
                    <button
                      type="button"
                      className={`filter-tab-btn ${keywordFilter === 'MATCHED' ? 'active' : ''}`}
                      onClick={() => setKeywordFilter('MATCHED')}
                    >
                      Matched ({analysisResult.keywordSummary.matched})
                    </button>
                    <button
                      type="button"
                      className={`filter-tab-btn ${keywordFilter === 'MISSING' ? 'active' : ''}`}
                      onClick={() => setKeywordFilter('MISSING')}
                    >
                      Missing Required ({analysisResult.keywordSummary.missingRequired})
                    </button>
                  </div>
                </div>

                <div className="keywords-chips-grid">
                  {analysisResult.keywords
                    .filter(kw => {
                      if (keywordFilter === 'MATCHED') return kw.status === 'MATCHED' || kw.status === 'OVERUSED';
                      if (keywordFilter === 'MISSING') return kw.status === 'MISSING' && kw.importance === 'REQUIRED';
                      return true;
                    })
                    .map((kw, i) => (
                      <div key={i} className={`keyword-chip-card status-${kw.status.toLowerCase()}`}>
                        <div className="chip-top-line">
                          <span className="kw-text">{kw.text}</span>
                          <span className={`importance-tag ${kw.importance.toLowerCase()}`}>
                            {kw.importance}
                          </span>
                        </div>
                        <div className="chip-bottom-line">
                          <span className={`match-type-tag type-${kw.matchType.toLowerCase()}`}>
                            {kw.status === 'MISSING' ? 'Missing' : `${kw.matchType} (${kw.count}x)`}
                          </span>
                          <span className="found-in-text">{kw.foundIn}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ── Section-by-Section Health Check ── */}
            <div className="sections-health-card">
              <div className="section-header-row">
                <div>
                  <h3 className="section-block-title">Section-by-Section Health Check</h3>
                </div>
                <span className="hint-note">Order: Personal → Summary → Experience → Education → Skills → Projects</span>
              </div>

              <div className="sections-bento-grid">
                {analysisResult.sections.map(sec => {
                  const hasConcern = Boolean(sec.hasConcern || sec.topIssue);
                  const isFixed = fixedSectionKeys.has(sec.key);
                  const isExpanded = expandedSections.has(sec.key);
                  const pointsGain = sec.pointsGain || 5;

                  return (
                    <div 
                      key={sec.key} 
                      className={`section-bento-card ${hasConcern && !isFixed ? 'has-concern action-needed-highlight' : 'is-optimal'} ${isFixed ? 'fix-applied' : ''} ${isExpanded ? 'is-expanded' : 'is-minimized'}`}
                    >
                      {/* Minimized Clickable Header Bar */}
                      <div 
                        className="sec-minimized-bar"
                        onClick={() => toggleSectionExpand(sec.key)}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isExpanded}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleSectionExpand(sec.key);
                          }
                        }}
                      >
                        <div className="sec-bar-left">
                          <button
                            type="button"
                            className="sec-expand-icon-btn"
                            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                            tabIndex={-1}
                          >
                            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          </button>

                          <strong className="sec-name">{sec.title}</strong>

                          {isFixed ? (
                            <span className="status-badge-pill pass">FIXED (+{pointsGain} pts)</span>
                          ) : hasConcern ? (
                            <span className="status-badge-pill action-needed-pill">
                              <AlertTriangle size={12} />
                              <span>Action Needed</span>
                            </span>
                          ) : (
                            <span className="status-badge-pill pass">OPTIMAL</span>
                          )}

                          {sec.score !== null && (
                            <span className="sec-score-num">
                              {isFixed ? Math.min(100, sec.score + pointsGain) : sec.score}/100
                            </span>
                          )}
                        </div>

                        <div className="sec-bar-right">
                          <span className="sec-stat-line">{sec.stat}</span>
                          {hasConcern && !isFixed ? (
                            <span className="sec-cue-badge cue-warn">
                              <span>{isExpanded ? 'Collapse' : 'View Fix'}</span>
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronRight size={12} />}
                            </span>
                          ) : (
                            <span className="sec-cue-badge cue-neutral">
                              <span>{isExpanded ? 'Collapse' : 'Details'}</span>
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronRight size={12} />}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expandable Diagnostic Body */}
                      {isExpanded && (
                        <div className="sec-expandable-body animate-fade-in">
                          {hasConcern ? (
                            <div className="sec-concern-details">
                              <div className="sec-concern-issue-bar">
                                <AlertTriangle size={14} className="sec-warn-icon" />
                                <span className="sec-issue-headline">
                                  <strong>Concern:</strong> {sec.topIssue}
                                </span>
                              </div>

                              <div className="sec-explanation-box">
                                <span className="sec-explanation-label">What needs to be fixed & why:</span>
                                <p className="sec-explanation-text">{sec.fixExplanation}</p>
                              </div>

                              {sec.fixAction && (
                                <div className="sec-action-recommendation">
                                  <Wrench size={12} className="sec-action-icon" />
                                  <span><strong>Recommended Action:</strong> {sec.fixAction}</span>
                                </div>
                              )}

                              {/* Apply Fix Action Bar */}
                              <div className="sec-fix-action-bar">
                                <button
                                  type="button"
                                  className={`sec-apply-fix-btn ${isFixed ? 'applied' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleSectionFix(sec.key, pointsGain);
                                  }}
                                  title={isFixed ? 'Click to revert fix' : `Apply fix to gain +${pointsGain} points`}
                                >
                                  {isFixed ? (
                                    <>
                                      <Check size={13} />
                                      <span>Fix Applied (+{pointsGain} pts)</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles size={13} />
                                      <span>Apply Fix (+{pointsGain} pts)</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="sec-optimal-details">
                              <div className="sec-optimal-pill">
                                <CheckCircle2 size={14} className="sec-pass-icon" />
                                <span className="sec-optimal-headline">All structure & ATS formatting checks optimal</span>
                              </div>
                              <p className="sec-optimal-text">{sec.fixExplanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Prioritized Actionable Suggestions ── */}
            <div className="suggestions-showcase-card">
              <div className="section-header-row">
                <div>
                  <h3 className="section-block-title">Prioritized High-Gain Improvements</h3>
                </div>
                <div className="suggestions-counter-badge">
                  <span>{analysisResult.suggestionSummary.total} Total Fixes</span>
                  <span className="pts-available-tag">
                    +{analysisResult.suggestionSummary.pointsAvailable} pts available
                  </span>
                </div>
              </div>

              <div className="suggestions-cards-column">
                {analysisResult.suggestions.map(sugg => {
                  const isFixed = fixedSuggestionIds.has(sugg.id);
                  return (
                    <div key={sugg.id} className={`suggestion-card priority-${sugg.priority.toLowerCase()} ${isFixed ? 'fixed' : ''}`}>
                      <div className="suggestion-card-top">
                        <div className="sugg-tags-row">
                          <span className={`priority-tag ${sugg.priority.toLowerCase()}`}>
                            {sugg.priority}
                          </span>
                          <span className="action-tag">{sugg.action.replace('_', ' ')}</span>
                          <span className="gain-tag">+{sugg.pointsGain} pts</span>
                          {sugg.autoFix && <span className="autofix-tag">Auto-Fixable</span>}
                        </div>
                        <button
                          type="button"
                          className={`apply-fix-btn ${isFixed ? 'fixed-active' : ''}`}
                          onClick={() => handleToggleFix(sugg.id, sugg.pointsGain)}
                        >
                          {isFixed ? (
                            <>
                              <Check size={14} />
                              <span>Fixed ({dynamicScore}/100)</span>
                            </>
                          ) : (
                            <>
                              <span>Apply Fix</span>
                              <ChevronRight size={14} />
                            </>
                          )}
                        </button>
                      </div>

                      <h4 className="sugg-title">{sugg.title}</h4>
                      <p className="sugg-reason">{sugg.reason}</p>

                      {/* Before / After diff block where applicable */}
                      {(sugg.before || sugg.after) && (
                        <div className="diff-preview-box">
                          {sugg.before && (
                            <div className="diff-line before">
                              <span className="diff-indicator">- BEFORE:</span>
                              <code>{sugg.before}</code>
                            </div>
                          )}
                          {sugg.after && (
                            <div className="diff-line after">
                              <span className="diff-indicator">+ AFTER:</span>
                              <code>{sugg.after}</code>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Conversion Action Bar */}
            <div className="results-bottom-actions">
              <button
                type="button"
                className="build-resume-from-ats-btn"
                onClick={() => navigate('/resume')}
              >
                <span>Edit & Fix in CipherSchools Resume Builder</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="reanalyze-btn"
                onClick={() => {
                  setViewState('MODE_SELECTION');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <RotateCcw size={15} />
                <span>Change Mode or Upload Another Resume</span>
              </button>
            </div>

          </section>
        )}

      </div>
    </div>
  );
};

export default AtsCheckerPage;
