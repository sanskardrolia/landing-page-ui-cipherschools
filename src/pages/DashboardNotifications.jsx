import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, CheckCheck, Code2, ListChecks } from 'lucide-react';
import AiOrb from '../components/AiOrb';
import { NEW_PROBLEMS_ADDED, newInModule } from '../data/newProblems';
import { moduleUnlocked, subjectExtended } from '../data/learnerModules';
import { PLANNER_LIVE } from '../data/features';

/* ══════════════════════════════════════════════════════════════
   Notifications — the bell in the dashboard top bar.
   Platform-wide updates: newly added problems per module (same rule
   as the "Newly added" labels), new features, what's coming.
   Read state stays on this device. DEMO: the list is built here;
   swap for a real notifications feed later.
   ══════════════════════════════════════════════════════════════ */

const READ_KEY = 'cs_notif_read';
const readSet = () => { try { return new Set(JSON.parse(localStorage.getItem(READ_KEY)) || []); } catch { return new Set(); } };
const saveSet = (set) => { try { localStorage.setItem(READ_KEY, JSON.stringify([...set])); } catch { /* storage off */ } };

const ago = (iso) => {
  const days = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));
  return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : days < 7 ? `${days} days ago` : new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const buildList = (ctx) => {
  const mods = ctx.preview ? ctx.modules : ctx.modules.filter((m) => moduleUnlocked(m, ctx.planId, ctx.devTrack));
  const problems = mods
    .map((m) => ({ m, n: newInModule(m, (s) => subjectExtended(ctx.extended, m, s)) }))
    .filter((x) => x.n > 0)
    .map(({ m, n }) => ({
      id: `new-problems:${m.id}:${NEW_PROBLEMS_ADDED}`,
      Icon: ListChecks,
      title: `${n} new problem${n === 1 ? '' : 's'} in ${m.title}`,
      body: 'Look for the "Newly added" label in the Problem tab.',
      at: NEW_PROBLEMS_ADDED,
      to: `/dashboard/m/${m.id}?tab=practice`
    }));
  return [
    ...problems,
    { id: 'feature:buddy', orb: true, title: 'Meet Buddy A.I.', body: 'Tap Ask Buddy A.I. in any lecture for a quiz, runnable code or a simple explanation.', at: '2026-11-18', to: '/dashboard/content' },
    { id: 'feature:free-practice', Icon: Code2, title: 'Free DSA practice is live', body: 'Interview questions you can solve anytime, separate from your course.', at: '2026-11-15', to: '/dashboard/practice' },
    ...(!PLANNER_LIVE ? [{ id: 'soon:planner', Icon: CalendarDays, title: 'Planner is coming soon', body: 'Plan your week, add lectures and problems in a tap and set a weekly goal.', at: '2026-11-12' }] : [])
  ];
};

const Notifications = ({ ctx }) => {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(readSet);
  const wrap = useRef(null);
  const navigate = useNavigate();
  const list = useMemo(() => buildList(ctx), [ctx]);
  const unread = list.filter((n) => !read.has(n.id)).length;

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open]);

  const markRead = (ids) => setRead((prev) => { const next = new Set(prev); ids.forEach((id) => next.add(id)); saveSet(next); return next; });
  const openItem = (n) => {
    markRead([n.id]);
    if (n.to) { setOpen(false); navigate(n.to); }
  };

  return (
    <div className="dx-notif" ref={wrap}>
      <button type="button" className={`dx-icon-btn dx-notif-btn ${open ? 'is-open' : ''}`} onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog" aria-expanded={open} aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} title="Notifications">
        <Bell size={17} />
        {unread > 0 && <span className="dx-notif-count">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="dx-notif-pop" role="dialog" aria-label="Notifications">
          <div className="dx-notif-head">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button type="button" onClick={() => markRead(list.map((n) => n.id))}><CheckCheck size={14} /> Mark all as read</button>
            )}
          </div>
          <ul className="dx-notif-list">
            {list.map((n) => {
              const isUnread = !read.has(n.id);
              return (
                <li key={n.id}>
                  <button type="button" className={`dx-notif-item ${isUnread ? 'is-unread' : ''} ${n.to ? '' : 'is-static'}`} onClick={() => openItem(n)}>
                    <span className="dx-notif-icon">{n.orb ? <AiOrb size={18} still /> : <n.Icon size={16} />}</span>
                    <span className="dx-notif-text">
                      <b>{n.title}</b>
                      <small>{n.body}</small>
                      <em>{ago(n.at)}</em>
                    </span>
                    {isUnread && <i className="dx-notif-dot" aria-label="Unread" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
