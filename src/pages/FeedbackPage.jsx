import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bug, 
  Lightbulb, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  RotateCcw,
  Star,
  ArrowRight,
  Image as ImageIcon,
  X
} from 'lucide-react';
import './FeedbackPage.css';

const RATING_LABELS = {
  1: "1 Star — Poor experience",
  2: "2 Stars — Fair, needs polish",
  3: "3 Stars — Good experience",
  4: "4 Stars — Very Good, smooth platform",
  5: "5 Stars — Outstanding! Love CipherSchools"
};

const FEEDBACK_TYPES = [
  {
    id: "constructive",
    label: "Constructive Feedback",
    icon: Star,
    placeholder: "Tell us about your product experience with CipherSchools — what did you like the most, and how can we make it even better for you?"
  },
  {
    id: "bug",
    label: "Bug Report",
    icon: Bug,
    placeholder: "Please describe the bug, where it occurred, and steps to reproduce it..."
  },
  {
    id: "feature",
    label: "Feature Request",
    icon: Lightbulb,
    placeholder: "What feature would make your learning journey 10x better? How should it work?"
  },
  {
    id: "others",
    label: "Others",
    icon: MessageSquare,
    placeholder: "Share your thoughts, suggestions, or any general feedback with us..."
  }
];

const FeedbackPage = () => {
  const navigate = useNavigate();

  // Image attachment state (Optional, Bug Report only, max 1)
  const [attachedImage, setAttachedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      if (attachedImage?.previewUrl) {
        URL.revokeObjectURL(attachedImage.previewUrl);
      }
    };
  }, [attachedImage]);

  // Form State
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

  const processSelectedFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setErrorMessage('');
    if (attachedImage?.previewUrl) {
      URL.revokeObjectURL(attachedImage.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    setAttachedImage({
      file,
      previewUrl,
      name: file.name,
      size: sizeFormatted
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleRemoveImage = (e) => {
    e?.stopPropagation?.();
    if (attachedImage?.previewUrl) {
      URL.revokeObjectURL(attachedImage.previewUrl);
    }
    setAttachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

    setTimeout(() => {
      const randomTicket = `CS-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(randomTicket);
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }, 600);
  };

  const handleResetForm = () => {
    setFeedbackText('');
    setRating(5);
    setHoverRating(0);
    setIsSubmitted(false);
    setErrorMessage('');
    setFeedbackType('constructive');
    if (attachedImage?.previewUrl) {
      URL.revokeObjectURL(attachedImage.previewUrl);
    }
    setAttachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="feedback-page-root">
      <div className="feedback-container">
        
        {/* Minimal Clean Header */}
        <div className="feedback-header">
          <h1 className="feedback-headline">
            Share Your <span className="headline-gradient">Feedback</span>
          </h1>
          <p className="feedback-subtext">
            Help us shape the future of CipherSchools. We review every submission directly.
          </p>
        </div>

        {/* Minimal Centered Card */}
        <div className="feedback-card-wrapper">
          <div className="feedback-main-card">
            
            {isSubmitted ? (
              /* Success State */
              <div className="feedback-success-card animate-fade-in">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={44} className="text-emerald-500" />
                </div>
                <span className="success-badge">TICKET #{ticketId}</span>
                <h2 className="success-title">Thank You For Your Feedback!</h2>
                <p className="success-desc">
                  We have logged your submission under <strong>{currentTypeConfig.label}</strong>. We appreciate you helping us improve CipherSchools.
                </p>

                <div className="success-meta-box">
                  <div className="meta-row">
                    <span className="meta-label">Submitted by:</span>
                    <span className="meta-value">{name}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Email:</span>
                    <span className="meta-value">{email}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value font-semibold text-orange-600">{currentTypeConfig.label}</span>
                  </div>
                  {feedbackType === 'constructive' && (
                    <div className="meta-row">
                      <span className="meta-label">Rating:</span>
                      <span className="meta-value font-semibold text-amber-500">
                        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)} ({rating} / 5)
                      </span>
                    </div>
                  )}
                  {feedbackType === 'bug' && attachedImage && (
                    <div className="meta-row">
                      <span className="meta-label">Attached Screenshot:</span>
                      <span className="meta-value meta-image-val">
                        <ImageIcon size={13} className="text-orange-500 inline-block mr-1" />
                        <span>{attachedImage.name}</span>
                        <span className="text-slate-400 text-xs ml-1">({attachedImage.size})</span>
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
                    <RotateCcw size={14} />
                    <span>Submit Another</span>
                  </button>
                  <button 
                    type="button" 
                    className="feedback-btn-primary"
                    onClick={() => navigate('/')}
                  >
                    <span>Back to Home</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              /* Minimal Active Form */
              <form onSubmit={handleSubmit} className="feedback-form">
                
                {/* Feedback Type Selection (Clean Tabs) */}
                <div className="form-group">
                  <label className="form-label">
                    Feedback Type <span className="text-orange-500">*</span>
                  </label>
                  <div className="feedback-type-tabs">
                    {FEEDBACK_TYPES.map((type) => {
                      const IconComponent = type.icon;
                      const isSelected = feedbackType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          className={`feedback-tab-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => setFeedbackType(type.id)}
                        >
                          <IconComponent size={15} />
                          <span>{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* User Information */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="user-name">
                      Full Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="user-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="user-email">
                      Email Address <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="user-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="form-group">
                  <label className="form-label" htmlFor="user-phone">
                    Contact Number
                  </label>
                  <input
                    id="user-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 Phone number"
                    className="form-input"
                  />
                </div>

                {/* 1-to-5 Star Rating (Constructive Feedback Only) */}
                {feedbackType === 'constructive' && (
                  <div className="form-group rating-group animate-fade-in">
                    <div className="rating-label-row">
                      <label className="form-label">
                        Rate CipherSchools <span className="text-orange-500">*</span>
                      </label>
                      <span className="rating-score-pill">
                        {hoverRating || rating} / 5 Stars
                      </span>
                    </div>

                    <div className="rating-picker-box">
                      <div className="stars-cluster">
                        {[1, 2, 3, 4, 5].map((starVal) => {
                          const active = starVal <= (hoverRating || rating);
                          return (
                            <button
                              key={starVal}
                              type="button"
                              className={`star-tap-btn ${active ? 'active' : ''}`}
                              onClick={() => setRating(starVal)}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(0)}
                              aria-label={`Rate ${starVal} out of 5 stars`}
                            >
                              <Star
                                size={26}
                                fill={active ? '#F59E0B' : 'none'}
                                stroke={active ? '#F59E0B' : '#CBD5E1'}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="rating-caption">
                        {RATING_LABELS[hoverRating || rating]}
                      </span>
                    </div>
                  </div>
                )}

                {/* Feedback Textarea */}
                <div className="form-group">
                  <div className="textarea-label-row">
                    <label className="form-label" htmlFor="feedback-text">
                      {feedbackType === 'constructive' 
                        ? 'Write About Product Experience' 
                        : 'Enter Your Feedback'} <span className="text-orange-500">*</span>
                    </label>
                    <span className="char-count">
                      {feedbackText.length} / 1000
                    </span>
                  </div>

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
                    className="form-textarea"
                    required
                  />

                  {errorMessage && (
                    <div className="feedback-error-banner animate-fade-in">
                      {errorMessage}
                    </div>
                  )}
                </div>

                {/* Optional Screenshot Attachment (Bug Report Only, max 1) */}
                {feedbackType === 'bug' && (
                  <div className="form-group bug-image-upload-group animate-fade-in">
                    <div className="upload-header-row">
                      <label className="form-label" htmlFor="bug-image-input">
                        Attach Screenshot <span className="optional-tag">(Optional, max 1 image)</span>
                      </label>
                      {attachedImage && (
                        <span className="file-ready-pill">1 image attached</span>
                      )}
                    </div>

                    {!attachedImage ? (
                      <label 
                        htmlFor="bug-image-input" 
                        className={`image-dropzone ${isDragging ? 'dragging' : ''}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            processSelectedFile(file);
                          }
                        }}
                      >
                        <input
                          id="bug-image-input"
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                        <div className="dropzone-content">
                          <div className="dropzone-icon">
                            <ImageIcon size={18} />
                          </div>
                          <div className="dropzone-text">
                            <span className="dropzone-prompt">
                              <span className="dropzone-action">Click to upload</span> or drag & drop screenshot
                            </span>
                            <span className="dropzone-hint">PNG, JPG, WEBP up to 5MB (max 1)</span>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div className="image-preview-card">
                        <div className="preview-thumb-box">
                          <img 
                            src={attachedImage.previewUrl} 
                            alt="Bug screenshot preview" 
                            className="preview-img" 
                          />
                        </div>
                        <div className="preview-details">
                          <span className="preview-filename" title={attachedImage.name}>
                            {attachedImage.name}
                          </span>
                          <span className="preview-filesize">{attachedImage.size}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="preview-remove-btn"
                          aria-label="Remove attached image"
                          title="Remove image"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Action */}
                <div className="form-action-row">
                  <button 
                    type="submit" 
                    className="feedback-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Feedback</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default FeedbackPage;
