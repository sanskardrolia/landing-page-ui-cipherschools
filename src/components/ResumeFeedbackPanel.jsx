import { useEffect, useState } from 'react';
import { CheckCircle2, Star, X } from 'lucide-react';
import './ResumeFeedbackPanel.css';

const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent'
};

const STORAGE_KEY = 'cs_resume_feedback';

const saveFeedback = (entry) => {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable: submission still succeeds in the UI */
  }
};

/**
 * Right-side slide-in feedback form, shown after a resume is downloaded.
 * `prefill` = { name, email, phone } taken from the resume being edited.
 */
const ResumeFeedbackPanel = ({ open, onClose, prefill = {} }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', feedback: '' });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Each time the panel opens: fresh form, prefilled from the resume
  useEffect(() => {
    if (!open) return;
    setForm({
      name: prefill.name || '',
      email: prefill.email || '',
      phone: prefill.phone || '',
      feedback: ''
    });
    setRating(0);
    setHover(0);
    setErrors({});
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = 'Enter a valid email';
    if (form.phone.replace(/\D/g, '').length < 10) er.phone = 'Enter a valid phone number';
    if (!rating) er.rating = 'Please select a rating';
    if (!form.feedback.trim()) er.feedback = 'Please share your feedback';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    saveFeedback({
      source: 'resume-builder',
      ...form,
      rating,
      submittedAt: new Date().toISOString()
    });
    setSubmitted(true);
  };

  const shown = hover || rating;

  return (
    <>
      <div
        className={`rfp-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`rfp-panel ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Resume builder feedback"
        aria-hidden={!open}
      >
        <div className="rfp-head">
          <div>
            <h2 className="rfp-title">{submitted ? 'Thank you!' : 'How was your experience?'}</h2>
            {!submitted && <p className="rfp-sub">Your resume is downloading. Tell us how the builder worked for you.</p>}
          </div>
          <button type="button" className="rfp-close" onClick={onClose} aria-label="Close feedback">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="rfp-success">
            <CheckCircle2 size={44} />
            <p>We've received your feedback. It helps us make the resume builder better.</p>
            <button type="button" className="rfp-btn" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className="rfp-form" onSubmit={handleSubmit} noValidate>
            <label className="rfp-field">
              <span>Name</span>
              <input type="text" value={form.name} onChange={set('name')} autoComplete="name" placeholder="Your full name" />
              {errors.name && <em>{errors.name}</em>}
            </label>

            <label className="rfp-field">
              <span>Email</span>
              <input type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com" />
              {errors.email && <em>{errors.email}</em>}
            </label>

            <label className="rfp-field">
              <span>Phone</span>
              <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" />
              {errors.phone && <em>{errors.phone}</em>}
            </label>

            <div className="rfp-field">
              <span>Rating</span>
              <div className="rfp-stars" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`rfp-star ${n <= shown ? 'is-on' : ''}`}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => { setRating(n); setErrors((er) => ({ ...er, rating: undefined })); }}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    aria-pressed={rating === n}
                  >
                    <Star size={26} />
                  </button>
                ))}
                <span className="rfp-rating-label">{shown ? RATING_LABELS[shown] : ''}</span>
              </div>
              {errors.rating && <em>{errors.rating}</em>}
            </div>

            <label className="rfp-field">
              <span>Feedback</span>
              <textarea rows={4} value={form.feedback} onChange={set('feedback')} placeholder="What did you like? What could be better?" />
              {errors.feedback && <em>{errors.feedback}</em>}
            </label>

            <button type="submit" className="rfp-btn rfp-btn--primary">Submit feedback</button>
          </form>
        )}
      </aside>
    </>
  );
};

export default ResumeFeedbackPanel;
