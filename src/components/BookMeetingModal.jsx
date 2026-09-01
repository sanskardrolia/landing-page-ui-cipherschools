import React, { useState, useMemo } from 'react';
import { X, Calendar, CheckCircle2, ArrowRight, User, Mail, Phone, Building2, Briefcase, Clock, Sparkles } from 'lucide-react';
import './BookMeetingModal.css';

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
  '06:30 PM'
];

const generateUpcomingDates = () => {
  const dates = [];
  const now = new Date();
  let dayOffset = 1; // start from tomorrow
  while (dates.length < 6) {
    const d = new Date();
    d.setDate(now.getDate() + dayOffset);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0) { // Exclude Sundays
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = d.getDate();
      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      dates.push({
        id: dateString,
        dayName,
        monthName,
        dayNum,
        fullLabel: `${dayName}, ${dayNum} ${monthName}`
      });
    }
    dayOffset++;
  }
  return dates;
};

const BookMeetingModal = ({ isOpen, onClose }) => {
  const availableDates = useMemo(() => generateUpcomingDates(), []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    designation: 'HOD',
    customDesignation: '',
    preferredDate: availableDates[0]?.id || '',
    preferredDateLabel: availableDates[0]?.fullLabel || '',
    customDate: '',
    preferredTime: TIME_SLOTS[1], // Default: 11:30 AM
    customTime: '',
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
      preferredDate: availableDates[0]?.id || '',
      preferredDateLabel: availableDates[0]?.fullLabel || '',
      customDate: '',
      preferredTime: TIME_SLOTS[1],
      customTime: '',
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
          <form onSubmit={handleSubmit} className="bm-modal-form">
            {/* Modal Header (Fixed at top) */}
            <div className="bm-modal-header">
              <div className="bm-badge">
                <Calendar size={14} className="bm-badge-icon" />
                <span>PARTNERSHIP MEETING</span>
              </div>
              <h2 className="bm-title">Book a Quick Meeting</h2>
              <p className="bm-subtitle">
                Schedule a 1-on-1 demo & partnership discussion with the CipherSchools University Team.
              </p>
            </div>

            {/* Scrollable Form Body */}
            <div className="bm-modal-body">
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

              {/* ── Interactive Calendar & Availability Picker ── */}
              <div className="bm-input-group bm-availability-section">
                <div className="bm-availability-header">
                  <label className="bm-section-label">
                    <Calendar size={14} className="bm-sec-icon" />
                    <span>Select Date & Time Availability *</span>
                  </label>
                  <span className="bm-tz-tag">IST (GMT+5:30)</span>
                </div>

                {/* Available Date Chips */}
                <div className="bm-date-chips-grid">
                  {availableDates.slice(0, 5).map((d) => (
                    <button
                      type="button"
                      key={d.id}
                      className={`bm-date-chip ${formData.preferredDate === d.id ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, preferredDate: d.id, preferredDateLabel: d.fullLabel }))}
                    >
                      <span className="bm-chip-day">{d.dayName}</span>
                      <span className="bm-chip-num">{d.dayNum}</span>
                      <span className="bm-chip-month">{d.monthName}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`bm-date-chip bm-custom-date-chip ${formData.preferredDate === 'custom' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, preferredDate: 'custom', preferredDateLabel: formData.customDate ? new Date(formData.customDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Custom Date' }))}
                  >
                    <Calendar size={13} className="bm-chip-day" style={{ color: formData.preferredDate === 'custom' ? '#EA580C' : '#6B7280' }} />
                    <span className="bm-chip-num" style={{ fontSize: '0.82rem', marginTop: '1px' }}>Custom</span>
                    <span className="bm-chip-month">Date</span>
                  </button>
                </div>

                {/* Custom Date Input if Custom Selected */}
                {formData.preferredDate === 'custom' && (
                  <div className="bm-custom-field-box">
                    <label htmlFor="customDate">Select Custom Date *</label>
                    <div className="bm-input-wrapper">
                      <Calendar size={16} className="bm-field-icon" />
                      <input
                        type="date"
                        id="customDate"
                        name="customDate"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.customDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          const formatted = val ? new Date(val).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Custom Date';
                          setFormData(prev => ({ ...prev, customDate: val, preferredDateLabel: formatted }));
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Available Time Slots */}
                <div className="bm-time-slots-grid">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      className={`bm-time-slot ${formData.preferredTime === slot ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, preferredTime: slot }))}
                    >
                      <Clock size={13} className="bm-slot-icon" />
                      <span>{slot}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`bm-time-slot bm-time-custom-btn ${formData.preferredTime === 'Custom' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, preferredTime: 'Custom' }))}
                  >
                    <Sparkles size={13} className="bm-slot-icon" />
                    <span>Custom</span>
                  </button>
                </div>

                {/* Custom Time Input if Custom Selected */}
                {formData.preferredTime === 'Custom' && (
                  <div className="bm-custom-field-box">
                    <label htmlFor="customTime">Specify Preferred Time *</label>
                    <div className="bm-input-wrapper">
                      <Clock size={16} className="bm-field-icon" />
                      <input
                        type="text"
                        id="customTime"
                        name="customTime"
                        required
                        placeholder="e.g. 04:15 PM, 07:30 PM, or Morning 9 AM"
                        value={formData.customTime}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Response Time Guarantee Pill */}
              <div className="bm-time-guarantee">
                <Clock size={15} className="bm-clock-icon" />
                <span>Our team will get in touch with you within <strong>1–2 hours</strong>.</span>
              </div>
            </div>

            {/* Sticky Bottom Footer */}
            <div className="bm-modal-footer">
              <button type="submit" className="bm-submit-btn">
                <span>Confirm & Schedule Meeting</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        ) : (
          /* Success View */
          <div className="bm-success-state">
            <div className="bm-success-icon-wrap">
              <CheckCircle2 size={44} className="bm-success-icon" />
            </div>
            <h3 className="bm-success-title">We Received Your Response!</h3>
            <p className="bm-success-desc">
              Thank you, <strong>{formData.name}</strong>. Your meeting request for <strong>{formData.university}</strong> has been successfully booked.
            </p>

            {/* Scheduled Slot Summary */}
            <div className="bm-booking-summary-card">
              <div className="bm-summary-item">
                <Calendar size={16} className="bm-summary-icon" />
                <div>
                  <span className="bm-summary-label">Preferred Date</span>
                  <span className="bm-summary-val">{formData.preferredDateLabel}</span>
                </div>
              </div>
              <div className="bm-summary-divider"></div>
              <div className="bm-summary-item">
                <Clock size={16} className="bm-summary-icon" />
                <div>
                  <span className="bm-summary-label">Preferred Time Slot</span>
                  <span className="bm-summary-val">
                    {formData.preferredTime === 'Custom' ? (formData.customTime || 'Custom Requested Time') : formData.preferredTime} (IST)
                  </span>
                </div>
              </div>
            </div>

            <div className="bm-success-notice">
              <Sparkles size={16} className="bm-sparkle-icon" />
              <span>Our team will get in touch with you within <strong>1–2 hours</strong> to share the Google Meet invite and finalize the agenda.</span>
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
