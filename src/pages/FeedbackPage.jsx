import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bug, 
  Lightbulb, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  RotateCcw,
  Star
} from 'lucide-react';
import './FeedbackPage.css';

const RATING_LABELS = {
  1: "1 Star — Poor experience, needs major improvements",
  2: "2 Stars — Fair, several areas to polish",
  3: "3 Stars — Good, standard learning experience",
  4: "4 Stars — Very Good, smooth & valuable platform",
  5: "5 Stars — Outstanding! Love the CipherSchools ecosystem"
};

const FEEDBACK_TYPES = [
  {
    id: "constructive",
    label: "Constructive Feedback",
    icon: Star,
    description: "Rate CipherSchools and share in-depth feedback on your product experience",
    placeholder: "Tell us about your product experience with CipherSchools — what did you like the most, and how can we make it even better for you?"
  },
  {
    id: "bug",
    label: "Bug Report",
    icon: Bug,
    description: "Report broken UI, errors, or unexpected platform behavior",
    placeholder: "Please describe the bug, where it occurred, and steps to reproduce it..."
  },
  {
    id: "feature",
    label: "Feature Request",
    icon: Lightbulb,
    description: "Suggest new courses, practice tools, or feature enhancements",
    placeholder: "What feature would make your learning journey 10x better? How should it work?"
  },
  {
    id: "others",
    label: "Others",
    icon: MessageSquare,
    description: "General queries, curriculum reviews, or words of appreciation",
    placeholder: "Share your thoughts, suggestions, or any general feedback with us..."
  }
];

// ── 1. Star Rating SVG: Displayed ONLY for Constructive Feedback ──
const StarFeedbackSVG = () => (
  <svg 
    viewBox="0 0 320 340" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="feedback-vector-svg animate-fade-in"
    role="img"
    aria-label="User star feedback and rating illustration"
  >
    <defs>
      <linearGradient id="orangeLinear" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F3912E" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <filter id="softCardShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.06" />
      </filter>
      <filter id="chatBubbleShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.08" />
      </filter>
    </defs>

    {/* Ambient Soft Glow Circles */}
    <circle cx="160" cy="170" r="130" fill="#FFF7ED" opacity="0.75" />
    <circle cx="245" cy="75" r="45" fill="#EFF6FF" opacity="0.8" />
    <circle cx="65" cy="270" r="35" fill="#ECFDF5" opacity="0.7" />

    {/* Decorative Sparkle Accents */}
    <path d="M45 75 Q45 85 35 85 Q45 85 45 95 Q45 85 55 85 Q45 85 45 75 Z" fill="#F3912E" opacity="0.8" />
    <path d="M285 105 Q285 113 277 113 Q285 113 285 121 Q285 113 293 113 Q285 113 285 105 Z" fill="#10B981" opacity="0.8" />
    <path d="M60 215 Q60 221 54 221 Q60 221 60 227 Q60 221 66 221 Q60 221 60 215 Z" fill="#3B82F6" opacity="0.7" />

    {/* Main Feedback Clipboard Card */}
    <g filter="url(#softCardShadow)">
      <rect x="50" y="45" width="220" height="255" rx="18" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
    </g>

    {/* Clipboard Top Clip */}
    <rect x="110" y="32" width="100" height="24" rx="6" fill="#1E293B" />
    <path d="M128 35 V22 C128 17 192 17 192 22 V35" stroke="#94A3B8" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    <circle cx="160" cy="44" r="3.5" fill="#F3912E" />

    {/* 5 Feedback Rating Stars */}
    <g fill="#F59E0B">
      <path d="M96 73 L98.5 78.5 L104.5 79.2 L100 83.4 L101.2 89.2 L96 86.3 L90.8 89.2 L92 83.4 L87.5 79.2 L93.5 78.5 Z" />
      <path d="M128 73 L130.5 78.5 L136.5 79.2 L132 83.4 L133.2 89.2 L128 86.3 L122.8 89.2 L124 83.4 L119.5 79.2 L125.5 78.5 Z" />
      <path d="M160 73 L162.5 78.5 L168.5 79.2 L164 83.4 L165.2 89.2 L160 86.3 L154.8 89.2 L156 83.4 L151.5 79.2 L157.5 78.5 Z" />
      <path d="M192 73 L194.5 78.5 L200.5 79.2 L196 83.4 L197.2 89.2 L192 86.3 L186.8 89.2 L188 83.4 L183.5 79.2 L189.5 78.5 Z" />
      <path d="M224 73 L226.5 78.5 L232.5 79.2 L228 83.4 L229.2 89.2 L224 86.3 L218.8 89.2 L220 83.4 L215.5 79.2 L221.5 78.5 Z" />
    </g>

    {/* Feedback Rating Tag */}
    <rect x="96" y="100" width="128" height="20" rx="10" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
    <text x="160" y="114" fill="#B45309" fontSize="9.5" fontWeight="800" textAnchor="middle" letterSpacing="0.04em" fontFamily="system-ui, sans-serif">
      5-STAR FEEDBACK
    </text>

    {/* Feedback Text Placeholder Lines */}
    <rect x="74" y="134" width="172" height="7" rx="3.5" fill="#E2E8F0" />
    <rect x="74" y="148" width="148" height="7" rx="3.5" fill="#E2E8F0" />
    <rect x="74" y="162" width="112" height="7" rx="3.5" fill="#CBD5E1" />

    {/* Checklist Review Items */}
    <g>
      <circle cx="86" cy="189" r="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.4" />
      <path d="M83 189 L85.5 191.5 L89.5 186.5" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="102" y="186" width="124" height="6.5" rx="3.2" fill="#94A3B8" />

      <circle cx="86" cy="212" r="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.4" />
      <path d="M83 212 L85.5 214.5 L89.5 209.5" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="102" y="209" width="98" height="6.5" rx="3.2" fill="#94A3B8" />
    </g>

    {/* Satisfaction / Feedback Progress Bar */}
    <rect x="74" y="240" width="172" height="7" rx="3.5" fill="#F1F5F9" />
    <rect x="74" y="240" width="146" height="7" rx="3.5" fill="url(#orangeLinear)" />
    <circle cx="220" cy="243.5" r="5" fill="#EA580C" stroke="#FFFFFF" strokeWidth="1.5" />

    {/* Floating User Voice Speech Bubble (Bottom-Right) */}
    <g filter="url(#chatBubbleShadow)">
      <path d="M190 279 L182 291 L200 279 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="165" y="218" width="138" height="62" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
      
      {/* Icon Circle */}
      <circle cx="192" cy="249" r="14" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1" />
      {/* Heart Icon */}
      <path d="M187 249 C187 246.5 189 245 192 247.2 C195 245 197 246.5 197 249 C197 251.5 192 254.5 192 254.5 C192 254.5 187 251.5 187 249 Z" fill="#F3912E" />
      
      <text x="214" y="244" fill="#0F172A" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">
        User Voice
      </text>
      <text x="214" y="259" fill="#EA580C" fontSize="9.5" fontWeight="700" fontFamily="system-ui, sans-serif">
        Direct Impact ✨
      </text>
    </g>

    {/* Origami Paper Airplane (Sending feedback up) */}
    <path d="M205 105 Q240 80 265 38" fill="none" stroke="#F3912E" strokeWidth="2" strokeDasharray="3 3" />
    <polygon points="265,38 245,47 253,52" fill="#F3912E" />
    <polygon points="265,38 253,52 258,64" fill="#EA580C" />
    <polygon points="265,38 258,64 276,49" fill="#FB923C" />
  </svg>
);

// ── 2. Generic Feedback SVG: Displayed for Bug Report, Feature Request & Others (No Stars) ──
const GenericFeedbackSVG = () => (
  <svg 
    viewBox="0 0 320 340" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="feedback-vector-svg animate-fade-in"
    role="img"
    aria-label="Generic community feedback and suggestion illustration"
  >
    <defs>
      <linearGradient id="genOrangeLinear" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F3912E" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <filter id="genSoftCardShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.06" />
      </filter>
      <filter id="genChatBubbleShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.08" />
      </filter>
    </defs>

    {/* Ambient Soft Glow Circles */}
    <circle cx="160" cy="170" r="130" fill="#FFF7ED" opacity="0.7" />
    <circle cx="245" cy="75" r="45" fill="#EFF6FF" opacity="0.8" />
    <circle cx="65" cy="270" r="35" fill="#F0FDF4" opacity="0.7" />

    {/* Decorative Sparkle Accents */}
    <path d="M45 75 Q45 85 35 85 Q45 85 45 95 Q45 85 55 85 Q45 85 45 75 Z" fill="#F3912E" opacity="0.8" />
    <path d="M285 105 Q285 113 277 113 Q285 113 285 121 Q285 113 293 113 Q285 113 285 105 Z" fill="#10B981" opacity="0.8" />
    <path d="M60 215 Q60 221 54 221 Q60 221 60 227 Q60 221 66 221 Q60 221 60 215 Z" fill="#3B82F6" opacity="0.7" />

    {/* Main Feedback Board Card */}
    <g filter="url(#genSoftCardShadow)">
      <rect x="48" y="44" width="224" height="256" rx="18" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
    </g>

    {/* Top Header Strip with Window Controls */}
    <path d="M48 62 C48 52 50 44 66 44 H254 C270 44 272 52 272 62 V76 H48 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
    <circle cx="68" cy="60" r="4" fill="#EF4444" />
    <circle cx="80" cy="60" r="4" fill="#F59E0B" />
    <circle cx="92" cy="60" r="4" fill="#10B981" />

    {/* Header Tag Badge */}
    <rect x="138" y="51" width="118" height="18" rx="9" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1" />
    <text x="197" y="63.5" fill="#C2410C" fontSize="8.5" fontWeight="800" textAnchor="middle" letterSpacing="0.04em" fontFamily="system-ui, sans-serif">
      FEEDBACK DESK
    </text>

    {/* User Feedback Comment Bubble */}
    <g>
      <rect x="64" y="90" width="192" height="50" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.2" />
      {/* User avatar circle */}
      <circle cx="82" cy="108" r="10" fill="#E0F2FE" />
      <path d="M78 114 C78 111 80 109 82 109 C84 109 86 111 86 114" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="82" cy="105" r="2.8" fill="#0284C7" />
      
      {/* Text lines simulating user feedback */}
      <rect x="100" y="103" width="142" height="6" rx="3" fill="#94A3B8" />
      <rect x="100" y="115" width="110" height="6" rx="3" fill="#CBD5E1" />
      <rect x="100" y="127" width="75" height="5" rx="2.5" fill="#E2E8F0" />
    </g>

    {/* Verified Review Notification Strip */}
    <g>
      <rect x="64" y="150" width="192" height="32" rx="8" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1" />
      <circle cx="82" cy="166" r="7.5" fill="#10B981" />
      <path d="M79.5 166 L81.5 168 L84.5 164" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="96" y="169.5" fill="#9A3412" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">
        Logged & Reviewed by Engineering
      </text>
    </g>

    {/* 3 Categorized Topic Pills */}
    <g>
      {/* Feature */}
      <rect x="64" y="193" width="62" height="22" rx="6" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="0.8" />
      <text x="95" y="207" fill="#B45309" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">
        💡 Feature
      </text>

      {/* Bug */}
      <rect x="132" y="193" width="58" height="22" rx="6" fill="#FEE2E2" stroke="#FECACA" strokeWidth="0.8" />
      <text x="161" y="207" fill="#B91C1C" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">
        🐞 Bug
      </text>

      {/* Others */}
      <rect x="196" y="193" width="60" height="22" rx="6" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="0.8" />
      <text x="226" y="207" fill="#1D4ED8" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">
        💬 Suggest
      </text>
    </g>

    {/* Pipeline Track */}
    <g>
      <rect x="64" y="230" width="192" height="6" rx="3" fill="#F1F5F9" />
      <rect x="64" y="230" width="145" height="6" rx="3" fill="url(#genOrangeLinear)" />
      <circle cx="209" cy="233" r="4.5" fill="#EA580C" stroke="#FFFFFF" strokeWidth="1.5" />
      <text x="64" y="252" fill="#64748B" fontSize="8.5" fontWeight="600" fontFamily="system-ui, sans-serif">
        Response Track: Active Review
      </text>
    </g>

    {/* Floating Speech Bubble (Bottom-Right) */}
    <g filter="url(#genChatBubbleShadow)">
      <path d="M190 279 L182 291 L200 279 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="165" y="222" width="138" height="58" rx="13" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
      
      {/* Icon Circle */}
      <circle cx="192" cy="251" r="13" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1" />
      {/* Message icon */}
      <path d="M187 248 H197 M187 252 H194 M187 256 H192" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
      
      <text x="214" y="246" fill="#0F172A" fontSize="10.5" fontWeight="800" fontFamily="system-ui, sans-serif">
        Your Voice
      </text>
      <text x="214" y="260" fill="#EA580C" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">
        Builds Better ✨
      </text>
    </g>

    {/* Origami Paper Airplane (Sending feedback up) */}
    <path d="M205 105 Q240 80 265 38" fill="none" stroke="#F3912E" strokeWidth="2" strokeDasharray="3 3" />
    <polygon points="265,38 245,47 253,52" fill="#F3912E" />
    <polygon points="265,38 253,52 258,64" fill="#EA580C" />
    <polygon points="265,38 258,64 276,49" fill="#FB923C" />
  </svg>
);

const FeedbackPage = () => {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form State - Defaulting to Constructive Feedback with 5 stars
  const [feedbackType, setFeedbackType] = useState('constructive');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('Sanskar Drolia');
  const [email, setEmail] = useState('sanskar.drolia@cipherschools.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [feedbackText, setFeedbackText] = useState('');
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const currentTypeConfig = FEEDBACK_TYPES.find(t => t.id === feedbackType) || FEEDBACK_TYPES[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      setErrorMessage(
        feedbackType === 'constructive'
          ? 'Please write about your product experience before submitting.'
          : 'Please enter your feedback before submitting.'
      );
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    // Simulate reliable API submission
    setTimeout(() => {
      const randomTicket = `CS-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(randomTicket);
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }, 700);
  };

  const handleResetForm = () => {
    setFeedbackText('');
    setRating(5);
    setHoverRating(0);
    setIsSubmitted(false);
    setErrorMessage('');
    setFeedbackType('constructive');
  };

  return (
    <div className="feedback-page-root">
      <div className="feedback-container">
        
        {/* Page Top Header */}
        <div className="feedback-header">
          <div className="feedback-badge-pill">
            <Sparkles size={13} className="text-orange-500" />
            <span>COMMUNITY FEEDBACK & SUGGESTIONS</span>
          </div>
          <h1 className="feedback-headline">
            Share Your <span className="headline-gradient">Feedback</span>
          </h1>
          <p className="feedback-subtext">
            Help us shape the future of CipherSchools. Our engineering and curriculum teams review every submission directly.
          </p>
        </div>

        {/* Content Layout: Form & Side Info Card */}
        <div className="feedback-grid">
          
          {/* Main Card (Form or Success View) */}
          <div className="feedback-main-card">
            
            {isSubmitted ? (
              /* Success State */
              <div className="feedback-success-card animate-fade-in">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                </div>
                <span className="success-badge">TICKET CREATED #{ticketId}</span>
                <h2 className="success-title">Thank You For Your Feedback!</h2>
                <p className="success-desc">
                  We have successfully logged your submission under <strong>{currentTypeConfig.label}</strong>. Our core team will review this and get back to <strong>{email}</strong> if any clarifications are needed.
                </p>

                <div className="success-meta-box">
                  <div className="meta-row">
                    <span className="meta-label">Submitted by:</span>
                    <span className="meta-value">{name}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Contact:</span>
                    <span className="meta-value">{phone}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Feedback Type:</span>
                    <span className="meta-value font-semibold text-orange-600">{currentTypeConfig.label}</span>
                  </div>
                  {feedbackType === 'constructive' && (
                    <div className="meta-row">
                      <span className="meta-label">CipherSchools Rating:</span>
                      <span className="meta-value font-semibold text-amber-500">
                        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)} ({rating} / 5 Stars)
                      </span>
                    </div>
                  )}
                </div>

                <div className="success-actions">
                  <button 
                    type="button" 
                    className="feedback-btn-secondary"
                    onClick={handleResetForm}
                  >
                    <RotateCcw size={15} />
                    <span>Submit Another Response</span>
                  </button>
                  <button 
                    type="button" 
                    className="feedback-btn-primary"
                    onClick={() => navigate('/')}
                  >
                    <span>Back to Home</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ) : (
              /* Active Form */
              <form onSubmit={handleSubmit} className="feedback-form">
                
                {/* 1. Feedback Type Selection (4 Options) */}
                <div className="form-section">
                  <div className="section-label-row">
                    <label className="section-title">
                      1. Select Feedback Type <span className="text-orange-500">*</span>
                    </label>
                    <span className="section-hint">Choose the most relevant category</span>
                  </div>

                  <div className="feedback-types-grid">
                    {FEEDBACK_TYPES.map((type) => {
                      const IconComponent = type.icon;
                      const isSelected = feedbackType === type.id;
                      return (
                        <div
                          key={type.id}
                          className={`feedback-type-pill ${isSelected ? 'type-pill-active' : ''}`}
                          onClick={() => setFeedbackType(type.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && setFeedbackType(type.id)}
                        >
                          <div className="type-pill-top">
                            <div className={`type-icon-circle ${isSelected ? 'icon-circle-active' : ''}`}>
                              <IconComponent size={16} />
                            </div>
                          </div>
                          <span className="type-label">{type.label}</span>
                          <span className="type-desc">{type.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. User Details */}
                <div className="form-section">
                  <div className="section-label-row">
                    <label className="section-title">
                      2. Your Information
                    </label>
                  </div>

                  <div className="feedback-inputs-grid">
                    {/* Name */}
                    <div className="feedback-field-wrap">
                      <label className="field-label" htmlFor="user-name">
                        <User size={13} className="text-slate-400" />
                        <span>Full Name</span>
                      </label>
                      <input
                        id="user-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="feedback-input"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="feedback-field-wrap">
                      <label className="field-label" htmlFor="user-email">
                        <Mail size={13} className="text-slate-400" />
                        <span>Email Address</span>
                      </label>
                      <input
                        id="user-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="feedback-input"
                        required
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="feedback-field-wrap full-width-field">
                      <label className="field-label" htmlFor="user-phone">
                        <Phone size={13} className="text-slate-400" />
                        <span>Contact Number</span>
                      </label>
                      <input
                        id="user-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 Phone number"
                        className="feedback-input"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Rating Section (Visible ONLY for Constructive Feedback) */}
                {feedbackType === 'constructive' && (
                  <div className="form-section rating-section-wrap animate-fade-in">
                    <div className="section-label-row">
                      <label className="section-title">
                        3. Rate CipherSchools <span className="text-orange-500">*</span>
                      </label>
                      <span className="rating-score-pill">
                        {hoverRating || rating} / 5 Stars
                      </span>
                    </div>

                    <div className="interactive-rating-card">
                      <div className="stars-row">
                        {[1, 2, 3, 4, 5].map((starVal) => {
                          const active = starVal <= (hoverRating || rating);
                          return (
                            <button
                              key={starVal}
                              type="button"
                              className={`star-tap-btn ${active ? 'star-active' : ''}`}
                              onClick={() => setRating(starVal)}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(0)}
                              aria-label={`Rate ${starVal} out of 5 stars`}
                            >
                              <Star
                                size={30}
                                className={active ? 'star-svg-active' : 'star-svg-inactive'}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <div className="rating-level-desc">
                        <span className="rating-level-label">
                          {RATING_LABELS[hoverRating || rating]}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Write About Product Experience / Enter Feedback */}
                <div className="form-section">
                  <div className="section-label-row">
                    <label className="section-title" htmlFor="feedback-text">
                      {feedbackType === 'constructive' 
                        ? '4. Write About Product Experience' 
                        : '3. Enter Your Feedback'} <span className="text-orange-500">*</span>
                    </label>
                    <span className="section-hint">
                      {feedbackText.length} / 1000 characters
                    </span>
                  </div>

                  <div className="feedback-textarea-wrap">
                    <textarea
                      id="feedback-text"
                      rows={5}
                      maxLength={1000}
                      value={feedbackText}
                      onChange={(e) => {
                        setFeedbackText(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder={currentTypeConfig.placeholder}
                      className="feedback-textarea"
                      required
                    />
                    <div className="textarea-footer-hint">
                      <FileText size={12} className="text-slate-400" />
                      <span>
                        {feedbackType === 'constructive'
                          ? 'Share your thoughts on course quality, compilers, practice tools, or UI navigation.'
                          : 'Be as detailed as possible to help us reproduce or evaluate quickly.'}
                      </span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="feedback-error-banner animate-fade-in">
                      {errorMessage}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="form-submit-row">
                  <button 
                    type="submit" 
                    className="feedback-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="submit-spinner"></span>
                        <span>Submitting Your Feedback...</span>
                      </span>
                    ) : (
                      <>
                        <span>Submit Feedback</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                  <span className="submit-security-note">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Transmitted securely to engineering desk</span>
                  </span>
                </div>

              </form>
            )}

          </div>

          {/* Right Column: Clean SVG Visual of Feedback (Dynamic: Star SVG only for Constructive, Generic SVG for others) */}
          <div className="feedback-side-column">
            <div className="feedback-illustration-card">
              {feedbackType === 'constructive' ? (
                <StarFeedbackSVG />
              ) : (
                <GenericFeedbackSVG />
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FeedbackPage;
