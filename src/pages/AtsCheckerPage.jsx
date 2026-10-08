import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Sparkles, 
  Copy, 
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
  ChevronRight
} from 'lucide-react';
import { 
  analyzeResume, 
  SAMPLE_RESUMES, 
  SAMPLE_JOB_DESCRIPTIONS 
} from '../utils/atsEngine';
import './AtsCheckerPage.css';

const AtsCheckerPage = () => {
  const navigate = useNavigate();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Input states
  const [selectedSampleKey, setSelectedSampleKey] = useState('fresher');
  const [resumeData, setResumeData] = useState(SAMPLE_RESUMES.fresher.resume_json);
  const [docMetrics, setDocMetrics] = useState(SAMPLE_RESUMES.fresher.doc_metrics);
  const [fileName, setFileName] = useState('anurag_mishra_sde_resume.pdf');
  const [uploadedFile, setUploadedFile] = useState(null);

  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTIONS.amazon_sde.text);
  const [jobMeta, setJobMeta] = useState(SAMPLE_JOB_DESCRIPTIONS.amazon_sde.meta);
  const [selectedJdKey, setSelectedJdKey] = useState('amazon_sde');

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);

  // Filter & Toggle states
  const [keywordFilter, setKeywordFilter] = useState('ALL'); // 'ALL' | 'MATCHED' | 'MISSING' | 'REQUIRED' | 'PREFERRED'
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [fixedSuggestionIds, setFixedSuggestionIds] = useState(new Set());
  const [expandedCards, setExpandedCards] = useState({ ats: true, impact: true, sections: true });

  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Run analysis helper
  const runAnalysis = (resume = resumeData, metrics = docMetrics, jd = jobDescription, meta = jobMeta) => {
    setIsAnalyzing(true);
    setErrorMessage('');

    setTimeout(() => {
      const result = analyzeResume({
        resume_json: resume,
        doc_metrics: metrics,
        job_description: jd,
        job_meta: meta
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        setIsAnalyzing(false);
        showToast(`Error: ${result.error.message}`);
        return;
      }

      setAnalysisResult(result);
      setFixedSuggestionIds(new Set());
      setIsAnalyzing(false);
      showToast('✓ ATS Analysis complete!');
      
      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 600);
  };

  // Run initial analysis on mount
  useEffect(() => {
    runAnalysis(SAMPLE_RESUMES.fresher.resume_json, SAMPLE_RESUMES.fresher.doc_metrics, SAMPLE_JOB_DESCRIPTIONS.amazon_sde.text, SAMPLE_JOB_DESCRIPTIONS.amazon_sde.meta);
  }, []);

  // Quick Sample Resume Loader
  const handleLoadSampleResume = (key) => {
    const sample = SAMPLE_RESUMES[key];
    if (!sample) return;
    setSelectedSampleKey(key);
    setResumeData(sample.resume_json);
    setDocMetrics(sample.doc_metrics);
    setFileName(key === 'fresher' ? 'anurag_mishra_sde_resume.pdf' : 'sanskar_drolia_fullstack.pdf');
    setUploadedFile(null);
    showToast(`Loaded: ${sample.label}`);
    runAnalysis(sample.resume_json, sample.doc_metrics, jobDescription, jobMeta);
  };

  // Quick Sample JD Loader
  const handleLoadSampleJd = (key) => {
    if (key === 'none') {
      setSelectedJdKey('none');
      setJobDescription('');
      setJobMeta('');
      showToast('Cleared Job Description (NO_JD Mode)');
      runAnalysis(resumeData, docMetrics, '', '');
      return;
    }
    const sampleJd = SAMPLE_JOB_DESCRIPTIONS[key];
    if (!sampleJd) return;
    setSelectedJdKey(key);
    setJobDescription(sampleJd.text);
    setJobMeta(sampleJd.meta);
    showToast(`Loaded: ${sampleJd.label}`);
    runAnalysis(resumeData, docMetrics, sampleJd.text, sampleJd.meta);
  };

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setFileName(file.name);
    setSelectedSampleKey('custom');

    // Simulate extraction & measurement of doc_metrics
    const isDocx = file.name.endsWith('.docx');
    const isPdf = file.name.endsWith('.pdf');
    const simulatedMetrics = {
      file_format: isPdf ? 'pdf' : (isDocx ? 'docx' : 'unknown'),
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
      parse_rate: 0.97,
      has_unreadable_chars: false,
      months_of_experience: 18,
      page_count: 1,
      has_sensitive_info: false,
      language_issues_count: 0
    };

    setDocMetrics(simulatedMetrics);
    showToast(`Parsed: ${file.name}`);
    runAnalysis(resumeData, simulatedMetrics, jobDescription, jobMeta);
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

  // Copy JSON Output to clipboard
  const handleCopyJson = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
    setCopiedJson(true);
    showToast('✓ Raw Engine JSON copied to clipboard!');
    setTimeout(() => setCopiedJson(false), 2500);
  };

  // Calculate dynamic score with fixed suggestions
  const calculatedPointsGained = analysisResult?.suggestions
    ? analysisResult.suggestions
        .filter(s => fixedSuggestionIds.has(s.id))
        .reduce((acc, s) => acc + s.pointsGain, 0)
    : 0;

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

      <div className="ats-checker-container">
        
        {/* ── Breadcrumb Navigation ── */}
        <div className="ats-breadcrumbs">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <ChevronRight size={13} className="breadcrumb-sep" />
          <Link to="/resume" className="breadcrumb-link">Resume Builder</Link>
          <ChevronRight size={13} className="breadcrumb-sep" />
          <span className="breadcrumb-current">ATS Checker Engine</span>
        </div>

        {/* ── Hero Header ── */}
        <section className="ats-checker-hero">
          <span className="compiler-badge-pill">
            <span className="badge-pulse-dot" />
            STANDALONE ATS ANALYSIS ENGINE
          </span>

          <h1 className="ats-hero-title">
            ANALYZE YOUR RESUME FOR{' '}
            <span className="headline-gradient">ATS COMPLIANCE</span>
          </h1>

          <p className="ats-hero-sub">
            Built for students and early-career software engineers in India. Evaluates single-column OCR parsability, keyword coverage against targeted job descriptions, and quantifiable impact metrics.
          </p>
        </section>

        {/* ── Input Workstation Grid ── */}
        <section className="ats-input-workstation">
          <div className="input-workstation-grid">
            
            {/* Card 1: Resume Document Upload & Samples */}
            <div className="workstation-card">
              <div className="workstation-card-head">
                <div className="card-head-title">
                  <FileText size={18} className="text-orange-500" />
                  <h3>1. Select or Upload Resume</h3>
                </div>
                <span className="card-pill-tag">
                  {uploadedFile ? 'Custom File' : 'Sample Loaded'}
                </span>
              </div>

              {/* Sample Quick Switcher */}
              <div className="sample-quick-switcher">
                <span className="switcher-label">TEST SAMPLES:</span>
                <div className="switcher-btns-row">
                  <button
                    type="button"
                    className={`sample-pill-btn ${selectedSampleKey === 'fresher' ? 'active' : ''}`}
                    onClick={() => handleLoadSampleResume('fresher')}
                  >
                    🔰 SDE Fresher (Anurag)
                  </button>
                  <button
                    type="button"
                    className={`sample-pill-btn ${selectedSampleKey === 'experienced' ? 'active' : ''}`}
                    onClick={() => handleLoadSampleResume('experienced')}
                  >
                    💼 Full-Stack (Sanskar)
                  </button>
                </div>
              </div>

              {/* Dropzone / Upload Box */}
              <div 
                className="file-dropzone-box"
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload your resume (PDF/DOCX)"
              >
                <div className="dropzone-icon-circle">
                  <UploadCloud size={24} />
                </div>
                <div className="dropzone-text-group">
                  <strong>{fileName}</strong>
                  <p>Click to browse or drop standard PDF or DOCX file</p>
                </div>
                <button type="button" className="dropzone-browse-btn">
                  Browse File
                </button>
              </div>

              <div className="resume-meta-preview">
                <div className="meta-item">
                  <span className="meta-label">Candidate:</span>
                  <span className="meta-val">{resumeData.name || 'Not detected'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Target Role:</span>
                  <span className="meta-val">{resumeData.summary ? 'Software Engineer' : 'General SDE'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Format:</span>
                  <span className="meta-val">{docMetrics.file_format?.toUpperCase()} (1 Column)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Job Description Input & Samples */}
            <div className="workstation-card">
              <div className="workstation-card-head">
                <div className="card-head-title">
                  <Briefcase size={18} className="text-orange-500" />
                  <h3>2. Target Job Description (Optional)</h3>
                </div>
                <span className={`card-mode-pill ${jobDescription.trim().length >= 200 ? 'mode-with-jd' : 'mode-no-jd'}`}>
                  {jobDescription.trim().length >= 200 ? 'MODE: WITH_JD' : 'MODE: NO_JD'}
                </span>
              </div>

              {/* Sample JD Switcher */}
              <div className="sample-quick-switcher">
                <span className="switcher-label">TEST JOB POSTINGS:</span>
                <div className="switcher-btns-row">
                  <button
                    type="button"
                    className={`sample-pill-btn ${selectedJdKey === 'amazon_sde' ? 'active' : ''}`}
                    onClick={() => handleLoadSampleJd('amazon_sde')}
                  >
                    Amazon SDE 1
                  </button>
                  <button
                    type="button"
                    className={`sample-pill-btn ${selectedJdKey === 'google_frontend' ? 'active' : ''}`}
                    onClick={() => handleLoadSampleJd('google_frontend')}
                  >
                    Google Frontend
                  </button>
                  <button
                    type="button"
                    className={`sample-pill-btn ${selectedJdKey === 'none' ? 'active' : ''}`}
                    onClick={() => handleLoadSampleJd('none')}
                  >
                    None (NO_JD Mode)
                  </button>
                </div>
              </div>

              {/* JD Textarea */}
              <div className="jd-textarea-wrap">
                <textarea
                  className="jd-textarea"
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    setSelectedJdKey('custom');
                  }}
                  placeholder="Paste Job Description here (minimum 200 characters to unlock targeted keyword matching)..."
                />
                <div className="jd-counter-bar">
                  <span className="jd-char-count">
                    {jobDescription.trim().length} characters {jobDescription.trim().length > 0 && jobDescription.trim().length < 200 ? '(Need 200+ for WITH_JD)' : ''}
                  </span>
                  {jobDescription.trim().length >= 200 && (
                    <span className="jd-valid-tag">
                      <Check size={12} /> Keyword Match Ready
                    </span>
                  )}
                </div>
              </div>

              <div className="jd-helper-note">
                {jobDescription.trim().length === 0 ? (
                  <span>💡 <strong>NO_JD Mode Active:</strong> Analyzes general ATS compatibility (70%) and impact (30%). Paste a posting to match specific keywords!</span>
                ) : jobDescription.trim().length < 200 ? (
                  <span className="text-amber-600">⚠️ Postings under 200 characters return error: <code>JD_TOO_SHORT</code>.</span>
                ) : (
                  <span>🎯 <strong>WITH_JD Mode Active:</strong> Weighting: 30% ATS + 60% Keyword Match + 10% Impact.</span>
                )}
              </div>
            </div>

          </div>

          {/* Action Trigger Bar */}
          <div className="scan-trigger-bar">
            {errorMessage && (
              <div className="ats-error-banner animate-fade-in">
                <AlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="button"
              className="run-ats-scan-btn"
              onClick={() => runAnalysis()}
              disabled={isAnalyzing}
            >
              <Sparkles size={18} />
              <span>{isAnalyzing ? 'Running Engine Diagnostics...' : 'Run In-Depth ATS Scan'}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        {/* ── Results Dashboard ── */}
        {analysisResult && (
          <section className="ats-results-dashboard animate-fade-in" ref={resultsRef}>
            
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
                  <button 
                    type="button"
                    className="json-toggle-btn"
                    onClick={() => setShowJsonInspector(prev => !prev)}
                  >
                    <Code2 size={13} />
                    <span>{showJsonInspector ? 'Hide JSON' : 'Inspect Engine JSON'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* JSON Inspector Modal/Tray */}
            {showJsonInspector && (
              <div className="json-inspector-tray animate-fade-in">
                <div className="json-tray-header">
                  <div className="json-header-title">
                    <Code2 size={16} className="text-orange-500" />
                    <strong>Raw Engine JSON Output (Schema Spec Compliant)</strong>
                  </div>
                  <button type="button" className="copy-json-btn" onClick={handleCopyJson}>
                    {copiedJson ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="json-code-block">
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              </div>
            )}

            {/* ── 3 Main Pillar Cards ── */}
            <div className="pillar-cards-grid">
              
              {/* Pillar 1: ATS Compatibility */}
              <div className="pillar-card">
                <div className="pillar-card-header">
                  <div>
                    <span className="pillar-category">PILLAR 1</span>
                    <h3 className="pillar-title">ATS Compatibility</h3>
                  </div>
                  <div className="pillar-score-badge">
                    <span>{analysisResult.cards.atsCompatibility.score}</span>
                    <small>/100</small>
                  </div>
                </div>

                <div className="pillar-stat-line">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>{analysisResult.cards.atsCompatibility.stat}</span>
                </div>

                <div className="checks-list-container">
                  {analysisResult.cards.atsCompatibility.checks.map(check => (
                    <div key={check.id} className={`check-row-item ${check.status.toLowerCase()}`}>
                      <div className="check-status-badge">
                        {check.status === 'PASS' && <CheckCircle2 size={13} />}
                        {check.status === 'WARN' && <AlertTriangle size={13} />}
                        {check.status === 'FAIL' && <XCircle size={13} />}
                        <span>{check.status}</span>
                      </div>
                      <div className="check-info">
                        <strong>{check.label}</strong>
                        <p>{check.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 2: Keyword Match */}
              <div className="pillar-card">
                <div className="pillar-card-header">
                  <div>
                    <span className="pillar-category">PILLAR 2</span>
                    <h3 className="pillar-title">Keyword Match</h3>
                  </div>
                  <div className="pillar-score-badge">
                    {analysisResult.cards.keywordMatch.score !== null ? (
                      <>
                        <span>{analysisResult.cards.keywordMatch.score}</span>
                        <small>/100</small>
                      </>
                    ) : (
                      <span className="locked-score">LOCKED</span>
                    )}
                  </div>
                </div>

                {analysisResult.cards.keywordMatch.state === 'LOCKED' ? (
                  <div className="locked-card-state">
                    <div className="locked-icon-bubble">
                      <Lock size={28} />
                    </div>
                    <h4>Keyword Match Locked</h4>
                    <p>
                      No job description provided (NO_JD Mode). Paste a target job description above to unlock skill gap analysis!
                    </p>
                    <button
                      type="button"
                      className="unlock-jd-btn"
                      onClick={() => handleLoadSampleJd('amazon_sde')}
                    >
                      <Sparkles size={14} />
                      <span>Load Sample JD to Unlock</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="pillar-stat-line">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>{analysisResult.cards.keywordMatch.stat}</span>
                    </div>

                    <div className="checks-list-container">
                      {analysisResult.cards.keywordMatch.checks.map(check => (
                        <div key={check.id} className={`check-row-item ${check.status.toLowerCase()}`}>
                          <div className="check-status-badge">
                            {check.status === 'PASS' && <CheckCircle2 size={13} />}
                            {check.status === 'WARN' && <AlertTriangle size={13} />}
                            {check.status === 'FAIL' && <XCircle size={13} />}
                            <span>{check.status}</span>
                          </div>
                          <div className="check-info">
                            <strong>{check.label}</strong>
                            <p>{check.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Pillar 3: Resume Impact */}
              <div className="pillar-card">
                <div className="pillar-card-header">
                  <div>
                    <span className="pillar-category">PILLAR 3</span>
                    <h3 className="pillar-title">Resume Impact</h3>
                  </div>
                  <div className="pillar-score-badge">
                    <span>{analysisResult.cards.resumeImpact.score}</span>
                    <small>/100</small>
                  </div>
                </div>

                <div className="pillar-stat-line">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>{analysisResult.cards.resumeImpact.stat}</span>
                </div>

                <div className="checks-list-container">
                  {analysisResult.cards.resumeImpact.checks.map(check => (
                    <div key={check.id} className={`check-row-item ${check.status.toLowerCase()}`}>
                      <div className="check-status-badge">
                        {check.status === 'PASS' && <CheckCircle2 size={13} />}
                        {check.status === 'WARN' && <AlertTriangle size={13} />}
                        {check.status === 'FAIL' && <XCircle size={13} />}
                        <span>{check.status}</span>
                      </div>
                      <div className="check-info">
                        <strong>{check.label}</strong>
                        <p>{check.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Targeted Keywords Breakdown (When WITH_JD) ── */}
            {analysisResult.overall.mode === 'WITH_JD' && (
              <div className="keywords-deep-dive-card">
                <div className="section-header-row">
                  <div>
                    <span className="sub-label">KEYWORD RELEVANCE</span>
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
                  <span className="sub-label">STRUCTURE AUDIT</span>
                  <h3 className="section-block-title">Section-by-Section Health Check</h3>
                </div>
                <span className="hint-note">Order: Personal ➔ Summary ➔ Experience ➔ Education ➔ Skills ➔ Projects</span>
              </div>

              <div className="sections-table-rows">
                {analysisResult.sections.map(sec => (
                  <div key={sec.key} className={`section-audit-row status-${sec.status.toLowerCase()}`}>
                    <div className="section-row-name">
                      <strong>{sec.title}</strong>
                      <span className="sec-stat-line">{sec.stat}</span>
                    </div>

                    <div className="section-row-status">
                      <span className={`status-badge-pill ${sec.status.toLowerCase()}`}>
                        {sec.status}
                      </span>
                      {sec.score !== null && (
                        <span className="sec-score-num">{sec.score}/100</span>
                      )}
                    </div>

                    <div className="section-row-issue">
                      {sec.topIssue ? (
                        <span className="issue-text-warn">⚠️ {sec.topIssue}</span>
                      ) : (
                        <span className="issue-text-pass">✓ All checks optimal</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Prioritized Actionable Suggestions ── */}
            <div className="suggestions-showcase-card">
              <div className="section-header-row">
                <div>
                  <span className="sub-label">ACTION PLAN</span>
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
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <RotateCcw size={15} />
                <span>Upload Another Resume</span>
              </button>
            </div>

          </section>
        )}

      </div>
    </div>
  );
};

export default AtsCheckerPage;
