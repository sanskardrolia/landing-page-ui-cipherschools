import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, ArrowRight, User, Mail, Phone, Building2, Briefcase, Clock } from 'lucide-react';
import './BookMeetingModal.css';

const BookMeetingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    designation: 'HOD',
    customDesignation: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      university: '',
      designation: 'HOD',
      customDesignation: '',
      message: ''
    });
    onClose();
  };

  return (
    <div className="bm-modal-overlay" onClick={handleClose}>
      <div className="bm-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="bm-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {!isSubmitted ? (
          <>
            {/* Modal Header */}
            <div className="bm-modal-header">
              <div className="bm-badge">
                <Calendar size={14} className="bm-badge-icon" />
                <span>PARTNERSHIP MEETING</span>
              </div>
              <h2 className="bm-title">Book a Quick Meeting</h2>
              <p className="bm-subtitle">
                Schedule a 1-on-1 discussion with the CipherSchools University Partnership Team.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bm-form">
              
              {/* Full Name */}
              <div className="bm-input-group">
                <label htmlFor="name">Full Name *</label>
                <div className="bm-input-wrapper">
                  <User size={16} className="bm-field-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="bm-input-row">
                <div className="bm-input-group">
                  <label htmlFor="email">Work Email *</label>
                  <div className="bm-input-wrapper">
                    <Mail size={16} className="bm-field-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="rajesh@university.edu.in"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="bm-input-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <div className="bm-input-wrapper">
                    <Phone size={16} className="bm-field-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* University Name */}
              <div className="bm-input-group">
                <label htmlFor="university">University / Institution Name *</label>
                <div className="bm-input-wrapper">
                  <Building2 size={16} className="bm-field-icon" />
                  <input
                    type="text"
                    id="university"
                    name="university"
                    required
                    placeholder="e.g. Lovely Professional University"
                    value={formData.university}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Designation Selector */}
              <div className="bm-input-group">
                <label>Designation / Role *</label>
                <div className="bm-designation-options">
                  {['HOD', 'Dean', 'TPO Head', 'Director / Principal', 'Other'].map((desig) => (
                    <button
                      type="button"
                      key={desig}
                      className={`bm-desig-pill ${formData.designation === desig ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, designation: desig }))}
                    >
                      {desig}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Designation if 'Other' */}
              {formData.designation === 'Other' && (
                <div className="bm-input-group bm-custom-desig">
                  <label htmlFor="customDesignation">Specify Designation *</label>
                  <div className="bm-input-wrapper">
                    <Briefcase size={16} className="bm-field-icon" />
                    <input
                      type="text"
                      id="customDesignation"
                      name="customDesignation"
                      required
                      placeholder="e.g. Professor / Academic Coordinator"
                      value={formData.customDesignation}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {/* Response Time Guarantee Pill */}
              <div className="bm-time-guarantee">
                <Clock size={15} className="bm-clock-icon" />
                <span>Our team will get in touch with you within <strong>24–36 hours</strong>.</span>
              </div>

              {/* Submit Button */}
              <button type="submit" className="bm-submit-btn">
                <span>Confirm & Schedule Meeting</span>
                <ArrowRight size={16} />
              </button>

            </form>
          </>
        ) : (
          /* Success View */
          <div className="bm-success-state">
            <div className="bm-success-icon-wrap">
              <CheckCircle2 size={48} className="bm-success-icon" />
            </div>
            <h3 className="bm-success-title">Meeting Request Submitted!</h3>
            <p className="bm-success-desc">
              Thank you, <strong>{formData.name}</strong>. We have received your request for <strong>{formData.university}</strong>.
            </p>
            <div className="bm-success-notice">
              <Clock size={16} />
              <span>Our team will get in touch with you within <strong>24–36 hours</strong> to finalize the schedule.</span>
            </div>
            <button className="bm-done-btn" onClick={handleClose}>
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookMeetingModal;
