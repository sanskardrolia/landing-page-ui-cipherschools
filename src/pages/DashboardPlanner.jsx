import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronLeft, ChevronRight, CirclePlay, ListChecks, NotebookPen, Plus, Target, Trash2 } from 'lucide-react';
import { allLectures, moduleUnlocked } from '../data/learnerModules';
import { practiceForUnit, WORKSPACE_KINDS } from '../data/practiceBank';
import { dayKey } from '../utils/learnerProgress';
import { activityFor } from '../utils/demoActivity';

/* ══════════════════════════════════════════════════════════════
   Planner — /dashboard/planner
   Pick a week (‹ Today ›) and a day from the strip, then plan that
   day: quick-add tasks or drop in "Up next" items from your modules.
   One line at the top tracks the week: tasks done and the weekly
   lecture goal. Tasks stay on this device (preview: this visit only).
   ══════════════════════════════════════════════════════════════ */

const KEY = 'cs_dash_planner';
const GOALS = [5, 10, 15, 20];
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const KIND = {
  lecture: { label: 'Lecture', Icon: CirclePlay },
  practice: { label: 'Practice', Icon: ListChecks },
  custom: { label: 'Task', Icon: NotebookPen }
};

const weekStart = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // Monday
  return x;
};
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const uid = () => Math.random().toString(36).slice(2, 9);
const load = (preview) => {
  if (preview) return null;
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
};

// Real next steps across the plan's modules: next lecture and next practice item not done yet
const suggestions = (ctx, unlocked) => {
  const out = [];
  for (const mod of unlocked) {
    const lecture = allLectures(mod).find((l) => !ctx.progress.watched[l.id]);
    if (lecture) out.push({ kind: 'lecture', text: lecture.title, sub: mod.title, to: `/dashboard/m/${mod.id}/watch/${lecture.id}`, mins: lecture.mins });
    const unit = mod.subjects[0]?.units[0];
    const item = unit && practiceForUnit(mod, unit, false).find((p) => !ctx.progress.practice[p.id]);
    if (item) {
      out.push({
        kind: 'practice', text: item.title, sub: mod.title,
        to: WORKSPACE_KINDS.includes(item.kind) ? `/dashboard/m/${mod.id}/practice/${item.id}` : `/dashboard/m/${mod.id}?tab=practice`
      });
    }
    if (out.length >= 8) break;
  }
  return out.slice(0, 8);
};

const DashboardPlanner = ({ ctx }) => {
  const unlocked = useMemo(() => ctx.modules.filter((m) => moduleUnlocked(m, ctx.planId, ctx.devTrack)), [ctx.modules, ctx.planId, ctx.devTrack]);
  const ideas = suggestions(ctx, unlocked);
  const [today] = useState(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; });
  const todayKey = dayKey(today);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState(todayKey);
  const [draft, setDraft] = useState('');

  const monday = addDays(weekStart(today), weekOffset * 7);
  const days = DAY_NAMES.map((name, i) => { const date = addDays(monday, i); return { name, date, key: dayKey(date) }; });
  const day = days.find((d) => d.key === selected) || days[0];

  // First visit: start today with a couple of real next steps
  const [state, setState] = useState(() => {
    const saved = load(ctx.preview);
    if (saved) return saved;
    return { goal: 10, tasks: { [todayKey]: ideas.slice(0, 2).map((s) => ({ id: uid(), ...s, done: false })) } };
  });

  useEffect(() => {
    if (ctx.preview) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage blocked */ }
  }, [state, ctx.preview]);

  const update = (fn) => setState((s) => { const next = { ...s, tasks: { ...s.tasks } }; fn(next); return next; });
  const addTask = (key, task) => update((s) => { s.tasks[key] = [...(s.tasks[key] || []), { id: uid(), done: false, kind: 'custom', ...task }]; });
  const toggleTask = (id) => update((s) => { s.tasks[day.key] = s.tasks[day.key].map((t) => (t.id === id ? { ...t, done: !t.done } : t)); });
  const removeTask = (id) => update((s) => { s.tasks[day.key] = s.tasks[day.key].filter((t) => t.id !== id); });
  const moveTask = (id) => update((s) => {
    const t = s.tasks[day.key].find((x) => x.id === id);
    const nextKey = dayKey(addDays(day.date, 1));
    s.tasks[day.key] = s.tasks[day.key].filter((x) => x.id !== id);
    s.tasks[nextKey] = [...(s.tasks[nextKey] || []), t];
  });
  const submit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    addTask(day.key, { text });
    setDraft('');
  };
  const goWeek = (n) => {
    const nextOffset = n === 0 ? 0 : weekOffset + n;
    setWeekOffset(nextOffset);
    setSelected(nextOffset === 0 ? todayKey : dayKey(addDays(weekStart(today), nextOffset * 7)));
  };

  // Week summary: tasks done, plus lectures watched against the weekly goal
  const weekTasks = days.flatMap((d) => state.tasks[d.key] || []);
  const doneCount = weekTasks.filter((t) => t.done).length;
  const activity = activityFor(ctx, unlocked);
  const weekLectures = days.reduce((a, d) => a + (activity[d.key]?.lecture || 0), 0);
  const goalPct = Math.min(100, Math.round((weekLectures / state.goal) * 100));
  const tasks = state.tasks[day.key] || [];
  const planned = new Set(tasks.map((t) => t.to).filter(Boolean));
  const isPast = day.date < today;

  const fmtRange = `${days[0].date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${days[6].date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;

  return (
    <div className="dx-plan">
      <header className="dx-plan-head">
        <p className="dx-muted">Plan your week, one day at a time.</p>
        <div className="dx-plan-week" role="group" aria-label="Week">
          <button type="button" className="dx-icon-btn" onClick={() => goWeek(-1)} aria-label="Previous week"><ChevronLeft size={17} /></button>
          <button type="button" className="dx-plan-today" onClick={() => goWeek(0)} disabled={weekOffset === 0 && selected === todayKey}>Today</button>
          <button type="button" className="dx-icon-btn" onClick={() => goWeek(1)} aria-label="Next week"><ChevronRight size={17} /></button>
          <span className="dx-plan-range">{fmtRange}</span>
        </div>
      </header>

      <section className="dx-plan-summary" aria-label="This week">
        <div className="dx-plan-stat">
          <span className="dx-plan-stat-label"><Check size={14} /> Tasks done</span>
          <strong>{doneCount}<span>/{weekTasks.length}</span></strong>
          <div className="dx-plan-bar"><span style={{ width: `${weekTasks.length ? (doneCount / weekTasks.length) * 100 : 0}%` }} /></div>
        </div>
        <div className="dx-plan-stat">
          <span className="dx-plan-stat-label"><Target size={14} /> Weekly goal</span>
          <strong>{weekLectures}<span>/{state.goal} lectures</span></strong>
          <div className="dx-plan-bar is-goal"><span style={{ width: `${goalPct}%` }} /></div>
        </div>
        <label className="dx-plan-goal">
          <span>Goal</span>
          <select value={state.goal} onChange={(e) => setState((s) => ({ ...s, goal: Number(e.target.value) }))}>
            {GOALS.map((g) => <option key={g} value={g}>{g} lectures / week</option>)}
          </select>
        </label>
      </section>

      <nav className="dx-plan-days" aria-label="Days">
        {days.map((d) => {
          const list = state.tasks[d.key] || [];
          const left = list.filter((t) => !t.done).length;
          return (
            <button
              key={d.key}
              type="button"
              className={`dx-plan-day ${d.key === day.key ? 'is-selected' : ''} ${d.key === todayKey ? 'is-today' : ''}`}
              onClick={() => setSelected(d.key)}
              aria-pressed={d.key === day.key}
            >
              <span className="dx-plan-dname">{d.name}</span>
              <span className="dx-plan-dnum">{d.date.getDate()}</span>
              <span className="dx-plan-dots" aria-label={`${list.length} tasks`}>
                {list.slice(0, 4).map((t) => <i key={t.id} className={t.done ? 'done' : ''} />)}
                {list.length === 0 && <i className="empty" />}
              </span>
              {left > 0 && <span className="dx-sr">{left} open</span>}
            </button>
          );
        })}
      </nav>

      <div className="dx-plan-body">
        <section className="dx-plan-list" aria-label={day.date.toDateString()}>
          <div className="dx-plan-list-head">
            <h2>{day.key === todayKey ? 'Today' : day.date.toLocaleDateString('en-IN', { weekday: 'long' })}<span>{day.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</span></h2>
            {tasks.length > 0 && <span className="dx-plan-count">{tasks.filter((t) => t.done).length}/{tasks.length} done</span>}
          </div>

          <form className="dx-plan-add" onSubmit={submit}>
            <Plus size={16} />
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={isPast ? 'Add a task to this day' : 'Add a task and press Enter'} aria-label="Add a task" />
            {draft.trim() && <button type="submit" className="dx-btn dx-btn-primary dx-btn-sm">Add</button>}
          </form>

          {tasks.length === 0 ? (
            <div className="dx-plan-empty">
              <NotebookPen size={22} />
              <p>Nothing planned for this day.</p>
              <span>Add a task above or pick something from Up next.</span>
            </div>
          ) : (
            <ul className="dx-plan-tasks">
              {tasks.map((t) => {
                const k = KIND[t.kind] || KIND.custom;
                return (
                  <li key={t.id} className={`dx-plan-task ${t.done ? 'is-done' : ''}`}>
                    <button type="button" className="dx-plan-check" onClick={() => toggleTask(t.id)} aria-pressed={t.done} aria-label={t.done ? 'Mark not done' : 'Mark done'}>
                      <Check size={13} />
                    </button>
                    <div className="dx-plan-task-text">
                      {t.to ? <Link to={t.to}>{t.text}</Link> : <span>{t.text}</span>}
                      <small className={`dx-plan-tag is-${t.kind || 'custom'}`}><k.Icon size={12} /> {k.label}{t.sub ? ` · ${t.sub}` : ''}{t.mins ? ` · ${t.mins} min` : ''}</small>
                    </div>
                    <div className="dx-plan-task-actions">
                      {!t.done && <button type="button" onClick={() => moveTask(t.id)} title="Move to next day" aria-label="Move to next day"><ArrowRight size={14} /></button>}
                      <button type="button" onClick={() => removeTask(t.id)} title="Delete" aria-label="Delete task"><Trash2 size={14} /></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside className="dx-plan-next" aria-label="Up next">
          <h3>Up next</h3>
          <p className="dx-muted dx-small">From your modules. Add one to {day.key === todayKey ? 'today' : day.name}.</p>
          {ideas.length === 0 ? <p className="dx-muted dx-small">You're all caught up.</p> : (
            <ul>
              {ideas.map((s) => {
                const k = KIND[s.kind];
                const added = planned.has(s.to);
                return (
                  <li key={s.to}>
                    <span className={`dx-plan-kind is-${s.kind}`}><k.Icon size={14} /></span>
                    <span className="dx-plan-next-text"><strong>{s.text}</strong><small>{s.sub}</small></span>
                    <button type="button" className={`dx-plan-addbtn ${added ? 'is-added' : ''}`} onClick={() => !added && addTask(day.key, s)} disabled={added} aria-label={added ? 'Added' : `Add to ${day.name}`}>
                      {added ? <Check size={14} /> : <Plus size={14} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
};

export default DashboardPlanner;
