import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, 
  Lock, Mail, User, KeyRound, ShieldCheck, BookOpen, 
  Terminal, GraduationCap, Check
} from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'invite'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    inviteCode: '',
    rememberMe: true
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="login-page-container">
      
      {/* Top Mobile/Header Bar */}
      <div className="login-top-bar">
        <Link to="/" className="login-back-link">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        <Link to="/" className="login-brand-logo">
          <img src="/cipherschools-logo.png" alt="CipherSchools" />
          <span className="logo-text">Cipher<span className="text-brand">Schools</span></span>
        </Link>
      </div>

      <div className="login-split-layout">
        
        {/* ═══════════════════════════════════════════════
            LEFT SIDE: THE CIPHERSCHOOLS STORY NEWSPAPER
            ═══════════════════════════════════════════════ */}
        <div className="login-left-panel">
          <div className="login-story-wrap">
            
            {/* The Daily Dispatch Story Newspaper Card */}
            <div className="login-newspaper-card">
              <div className="founder-story-content">
                
                {/* Editorial Masthead Header */}
                <div className="toi-masthead-wrapper">
                  <div className="toi-masthead-center">
                    <h2 className="toi-brand-title">THE DAILY DISPATCH</h2>
                  </div>

                  <div className="toi-nav-strip">
                    <div className="toi-nav-left">
                      <span className="toi-logo-badge">DAILY<span className="toi-plus">+</span></span>
                      <span className="toi-nav-item">Editorial</span>
                      <span className="toi-nav-item">Campus</span>
                      <span className="toi-nav-item">Innovation</span>
                      <span className="toi-nav-item">Technology</span>
                      <span className="toi-nav-item">Careers</span>
                    </div>
                    <div className="toi-nav-right">
                      <span className="toi-live-pill">🔴 Special Edition</span>
                    </div>
                  </div>
                </div>

                {/* Main Newspaper Body with Side Column */}
                <div className="newspaper-columns-grid">
                  <div className="newspaper-main-column">
                    <p className="founder-story-paragraph">
                      <span className="founder-drop-cap">S</span>ince <strong>2020</strong>, <strong>CipherSchools</strong> has been building more than a learning platform. We started by helping students learn <strong className="founder-text-highlight">practical skills</strong>, <strong className="founder-text-highlight">build projects</strong>, and <strong className="founder-text-highlight">prepare for their careers</strong>. Today, we work with <strong className="founder-highlight-univ">universities</strong> to strengthen <strong className="founder-text-highlight">learning, assessment, training, and career readiness</strong>—while continuing to support students beyond the classroom.
                    </p>
                    <p className="founder-story-paragraph founder-story-tagline">
                      <span className="story-tagline-highlight">Started in 2020. Still learning. Still building. Still growing.</span>
                    </p>
                    <div className="founder-signoff">
                      <span className="founder-name">Anurag</span>
                      <span className="founder-sep">—</span>
                      <span className="founder-role">Founder, CipherSchools</span>
                    </div>
                  </div>

                  {/* Blurred Right Newspaper Column Preview */}
                  <div className="newspaper-side-column-blur">
                    <div className="news-side-header">Recent post</div>
                    <div className="news-side-card">
                      <div className="news-side-avatar">
                        <span>🎓</span>
                      </div>
                      <div className="news-side-info">
                        <span className="news-side-date">2020 – 2026</span>
                        <h5 className="news-side-title">Campus Impact</h5>
                      </div>
                    </div>
                    <div className="news-side-dummy-lines">
                      <span className="dummy-line" style={{ width: '92%' }}></span>
                      <span className="dummy-line" style={{ width: '78%' }}></span>
                      <span className="dummy-line" style={{ width: '84%' }}></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            RIGHT SIDE: AUTHENTICATION CONTAINER (Notion Style)
            ═══════════════════════════════════════════════ */}
        <div className="login-right-panel">
          <div className="login-card-inner">
            
            {/* Brand Header */}
            <div className="login-header-group">
              <Link to="/" className="login-logo-desktop">
                <img src="/cipherschools-logo.png" alt="CipherSchools Logo" />
                <span className="logo-title">Cipher<span className="text-brand">Schools</span></span>
              </Link>
              
              <h1 className="login-main-title">
                {authMode === 'login' && 'Welcome back'}
                {authMode === 'signup' && 'Create your account'}
                {authMode === 'invite' && 'Join with Invite Code'}
              </h1>
              
              <p className="login-sub-text">
                {authMode === 'login' && 'Enter your credentials to access CipherSchools Eco-system'}
                {authMode === 'signup' && 'Start learning, practicing, and building production projects today.'}
                {authMode === 'invite' && 'Enter your university or campus cohort code to unlock access.'}
              </p>
            </div>

            {/* Auth Mode Tabs Toggle (Hidden in Invite Code mode) */}
            {authMode !== 'invite' && (
              <div className="login-mode-tabs">
                <button 
                  type="button"
                  className={`login-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                  onClick={() => setAuthMode('login')}
                >
                  Log In
                </button>
                <button 
                  type="button"
                  className={`login-tab-btn ${authMode === 'signup' ? 'active' : ''}`}
                  onClick={() => setAuthMode('signup')}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              
              {/* Name (Sign Up only) */}
              {authMode === 'signup' && (
                <div className="login-input-group animate-fade-in">
                  <label className="login-input-label">Full Name</label>
                  <div className="login-input-wrap">
                    <User size={17} className="login-input-icon" />
                    <input 
                      type="text" 
                      placeholder="Sanskar Drolia" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              {authMode !== 'invite' && (
                <div className="login-input-group">
                  <label className="login-input-label">Email Address</label>
                  <div className="login-input-wrap">
                    <Mail size={17} className="login-input-icon" />
                    <input 
                      type="email" 
                      placeholder="name@university.edu" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              {authMode !== 'invite' && (
                <div className="login-input-group">
                  <div className="login-label-row">
                    <label className="login-input-label">Password</label>
                    {authMode === 'login' && (
                      <a href="#forgot" className="login-forgot-link" onClick={(e) => e.preventDefault()}>
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="login-input-wrap">
                    <Lock size={17} className="login-input-icon" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••••••" 
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="login-pwd-toggle" 
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Invite Code Form (If Invite Mode Active) */}
              {authMode === 'invite' && (
                <div className="login-invite-box animate-fade-in">
                  <div className="login-input-group">
                    <label className="login-input-label">Invite Code</label>
                    <div className="login-input-wrap">
                      <KeyRound size={17} className="login-input-icon text-brand" />
                      <input 
                        type="text" 
                        placeholder="e.g. CIPHER-LPU-2026" 
                        value={formData.inviteCode}
                        onChange={(e) => handleInputChange('inviteCode', e.target.value.toUpperCase())}
                        required
                        className="invite-code-input"
                      />
                    </div>
                    <span className="invite-input-hint">
                      Issued by your university department or workshop mentor.
                    </span>
                  </div>

                  <div className="login-input-group" style={{ marginTop: '1rem' }}>
                    <label className="login-input-label">Email</label>
                    <div className="login-input-wrap">
                      <Mail size={17} className="login-input-icon" />
                      <input 
                        type="email" 
                        placeholder="student@campus.edu" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button type="submit" className="login-submit-btn">
                <span>
                  {authMode === 'login' && 'Log In to CipherSchools'}
                  {authMode === 'signup' && 'Create Free Account'}
                  {authMode === 'invite' && 'Verify & Join Cohort'}
                </span>
                <ArrowRight size={17} />
              </button>

              {submitted && (
                <div className="login-feedback-toast animate-fade-in">
                  <CheckCircle2 size={16} />
                  <span>Request received. Redirecting to workspace...</span>
                </div>
              )}

            </form>

            {/* Social OAuth Providers (Placed below credentials) */}
            {authMode !== 'invite' && (
              <>
                <div className="login-divider-row">
                  <span className="login-divider-line"></span>
                  <span className="login-divider-text">OR CONTINUE WITH</span>
                  <span className="login-divider-line"></span>
                </div>

                <div className="login-oauth-group">
                  <button type="button" className="login-oauth-btn google-oauth-btn">
                    <svg className="oauth-svg-icon" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>
              </>
            )}

            {/* Have an invite code label link (replaces big box) */}
            {authMode !== 'invite' ? (
              <div className="login-invite-label-wrap">
                <button 
                  type="button" 
                  className="login-invite-label-btn"
                  onClick={() => setAuthMode('invite')}
                >
                  <KeyRound size={14} className="text-brand" />
                  <span>Have an invite code? <strong className="invite-action-text">Join with code &rarr;</strong></span>
                </button>
              </div>
            ) : (
              <div className="login-invite-label-wrap">
                <button 
                  type="button" 
                  className="login-invite-label-btn"
                  onClick={() => setAuthMode('login')}
                >
                  <ArrowLeft size={14} className="text-brand" />
                  <span>Back to regular login</span>
                </button>
              </div>
            )}

            <div className="login-terms-notice">
              By continuing, you agree to CipherSchools' <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
