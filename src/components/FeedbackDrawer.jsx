import React, { useState, useEffect, useRef } from 'react';
import { 
  Bug, 
  Lightbulb, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  RotateCcw,
  Star,
  Image as ImageIcon,
  X,
  AlertCircle
} from 'lucide-react';
import './FeedbackDrawer.css';

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

const FeedbackDrawer = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState('constructive');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('Sanskar Drolia');
  const [email, setEmail] = useState('sanskar.drolia@cipherschools.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [feedbackText, setFeedbackText] = useState('');
  
  // Bug Report Image upload
  const [attachedImage, setAttachedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const drawerPanelRef = useRef(null);

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (attachedImage?.previewUrl) {
        URL.revokeObjectURL(attachedImage.previewUrl);
      }
    };
  }, [attachedImage]);

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
      if (drawerPanelRef.current) {
        drawerPanelRef.current.scrollTop = 0;
      }
    }, 550);
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

  const handleClose = () => {
    window.dispatchEvent(new CustomEvent('close-feedback-drawer'));
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-drawer-wrapper" role="dialog" aria-modal="true" aria-label="Feedback Modal">
      {/* Background Overlay Backdrop */}
      <div 
        className="feedback-drawer-backdrop" 
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel from Right */}
      <aside className="feedback-drawer-panel" ref={drawerPanelRef}>
        
        {/* Top Header */}
        <div className="feedback-drawer-header">
          <div className="feedback-drawer-title-group">
            <span className="feedback-drawer-badge">FEEDBACK & SUPPORT</span>
            <h2 className="feedback-drawer-title">
              Share Your <span className="headline-gradient-orange">Feedback</span>
            </h2>
            <p className="feedback-drawer-desc">
              We review every suggestion directly to improve CipherSchools.
            </p>
          </div>
          
          <button 
            type="button" 
            className="feedback-drawer-close-btn"
            onClick={handleClose}
            aria-label="Close feedback panel"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="feedback-drawer-body">
          {isSubmitted ? (
            /* Success State */
            <div className="feedback-drawer-success animate-fade-in">
              <div className="success-icon-wrap">
                <CheckCircle2 size={42} className="text-emerald-500" />
              </div>
              <span className="success-badge">TICKET #{ticketId}</span>
              <h3 className="success-title">Thank You For Your Feedback!</h3>
              <p className="success-desc">
                We have logged your submission under <strong>{currentTypeConfig.label}</strong>. Our product & engineering teams review all feedback directly.
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
                    <span className="meta-label">Attachment:</span>
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
                  className="drawer-btn-secondary"
                  onClick={handleResetForm}
                >
                  <RotateCcw size={14} />
                  <span>Submit Another</span>
                </button>
                <button 
                  type="button" 
                  className="drawer-btn-primary"
                  onClick={handleClose}
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Feedback Form */
            <form onSubmit={handleSubmit} className="feedback-drawer-form">
              
              {/* Feedback Category Tabs */}
              <div className="form-group">
                <label className="drawer-form-label">
                  Feedback Type <span className="text-orange-500">*</span>
                </label>
                <div className="feedback-type-grid">
                  {FEEDBACK_TYPES.map((type) => {
                    const IconComponent = type.icon;
                    const isSelected = feedbackType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        className={`feedback-chip-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => setFeedbackType(type.id)}
                      >
                        <IconComponent size={14} />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User Identity Details */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="drawer-form-label" htmlFor="drawer-user-name">
                    Full Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    id="drawer-user-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="drawer-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="drawer-form-label" htmlFor="drawer-user-email">
                    Email Address <span className="text-orange-500">*</span>
                  </label>
                  <input
                    id="drawer-user-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="drawer-input"
                    required
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div className="form-group">
                <label className="drawer-form-label" htmlFor="drawer-user-phone">
                  Contact Number <span className="optional-tag">(Optional)</span>
                </label>
                <input
                  id="drawer-user-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 Phone number"
                  className="drawer-input"
                />
              </div>

              {/* 1-to-5 Star Rating (Constructive Feedback Only) */}
              {feedbackType === 'constructive' && (
                <div className="form-group rating-group animate-fade-in">
                  <div className="rating-label-row">
                    <label className="drawer-form-label">
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
                              size={24}
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
                  <label className="drawer-form-label" htmlFor="drawer-feedback-text">
                    {feedbackType === 'constructive' 
                      ? 'Write About Product Experience' 
                      : 'Enter Your Feedback'} <span className="text-orange-500">*</span>
                  </label>
                  <span className="char-count">
                    {feedbackText.length} / 1000
                  </span>
                </div>

                <textarea
                  id="drawer-feedback-text"
                  rows={4}
                  maxLength={1000}
                  value={feedbackText}
                  onChange={(e) => {
                    setFeedbackText(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={currentTypeConfig.placeholder}
                  className="drawer-textarea"
                  required
                />

                {errorMessage && (
                  <div className="drawer-error-banner animate-fade-in">
                    <AlertCircle size={15} />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Bug Screenshot Upload (Bug Report Only) */}
              {feedbackType === 'bug' && (
                <div className="form-group bug-image-upload-group animate-fade-in">
                  <div className="upload-header-row">
                    <label className="drawer-form-label" htmlFor="drawer-bug-image-input">
                      Attach Screenshot <span className="optional-tag">(Optional, max 1 image)</span>
                    </label>
                    {attachedImage && (
                      <span className="file-ready-pill">1 image attached</span>
                    )}
                  </div>

                  {!attachedImage ? (
                    <label 
                      htmlFor="drawer-bug-image-input" 
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
                        id="drawer-bug-image-input"
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
                            <span className="dropzone-action">Click to upload</span> or drag screenshot
                          </span>
                          <span className="dropzone-hint">PNG, JPG, WEBP up to 5MB</span>
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
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Action */}
              <div className="drawer-footer-actions">
                <button 
                  type="submit" 
                  className="drawer-submit-btn"
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

      </aside>
    </div>
  );
};

export default FeedbackDrawer;
