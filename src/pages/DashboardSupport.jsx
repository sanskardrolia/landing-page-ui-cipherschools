import { useEffect, useState } from 'react';
import { CircleCheck, LifeBuoy, MessageSquareHeart, Star, X } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   Support & Feedback dialog (profile menu). Two modes: ask for help
   (topic + message) or share feedback (rating + message).
   DEMO: submissions are kept in localStorage until a backend exists.
   ══════════════════════════════════════════════════════════════ */

const KEY = 'cs_dash_support';
const TOPICS = ['Lectures or content', 'Practice or tests', 'Mock interviews', 'Payment or billing', 'Account or login', 'Something else'];
const RATINGS = ['Poor', 'Okay', 'Good', 'Great', 'Loving it'];

const DashboardSupport = ({ ctx, onClose }) => {
  const [mode, setMode] = useState('help');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const canSend = message.trim().length >= 10 && (mode === 'help' || rating > 0);
  const submit = (e) => {
    e.preventDefault();
    if (!canSend) return;
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || '[]');
      list.push({ mode, topic: mode === 'help' ? topic : null, rating: mode === 'feedback' ? rating : null, message: message.trim(), at: new Date().toISOString(), plan: ctx.planId });
      localStorage.setItem(KEY, JSON.stringify(list.slice(-50)));
    } catch { /* storage blocked */ }
    setSent(true);
  };
  const email = ctx.enrollment.learner?.email;

  return (
    <div className="dx-ad-backdrop" onClick={onClose}>
      <div className="dx-ad dx-support" role="dialog" aria-modal="true" aria-labelledby="dx-support-title" onClick={(e) => e.stopPropagation()}>
        <header className="dx-ad-head">
          <span className="dx-ad-icon"><LifeBuoy size={18} /></span>
          <div className="dx-ad-titles">
            <h2 id="dx-support-title">Support & Feedback</h2>
            <p>We usually reply within a day.</p>
          </div>
          <button type="button" className="dx-icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>

        {sent ? (
          <div className="dx-support-done" role="status">
            <CircleCheck size={28} />
            <p>{mode === 'help' ? 'Request sent' : 'Thanks for the feedback'}</p>
            <span>{mode === 'help' ? `We'll get back to you${email ? ` at ${email}` : ''}.` : 'It helps us decide what to build next.'}</span>
            <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="dx-support-form">
            <div className="dx-support-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={mode === 'help'} className={mode === 'help' ? 'is-on' : ''} onClick={() => setMode('help')}><LifeBuoy size={14} /> Get help</button>
              <button type="button" role="tab" aria-selected={mode === 'feedback'} className={mode === 'feedback' ? 'is-on' : ''} onClick={() => setMode('feedback')}><MessageSquareHeart size={14} /> Share feedback</button>
            </div>

            {mode === 'help' ? (
              <div className="dx-support-field">
                <span>What's it about?</span>
                <div className="dx-support-chips">
                  {TOPICS.map((t) => (
                    <button key={t} type="button" className={topic === t ? 'is-on' : ''} aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="dx-support-field">
                <span>How's your experience so far?</span>
                <div className="dx-support-stars" role="radiogroup" aria-label="Rating">
                  {RATINGS.map((r, i) => (
                    <button key={r} type="button" role="radio" aria-checked={rating === i + 1} aria-label={r} title={r} className={rating > i ? 'is-on' : ''} onClick={() => setRating(i + 1)}><Star size={20} /></button>
                  ))}
                  {rating > 0 && <em>{RATINGS[rating - 1]}</em>}
                </div>
              </div>
            )}

            <label className="dx-support-field">
              <span>{mode === 'help' ? 'Describe the issue' : 'What should we keep or change?'}</span>
              <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={mode === 'help' ? 'What happened, and where in the dashboard?' : 'Tell us anything…'} />
              <small>{message.trim().length < 10 ? 'At least 10 characters' : `${message.trim().length} characters`}</small>
            </label>

            <div className="dx-support-actions">
              <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="dx-btn dx-btn-primary dx-btn-sm" disabled={!canSend}>{mode === 'help' ? 'Send request' : 'Send feedback'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DashboardSupport;
