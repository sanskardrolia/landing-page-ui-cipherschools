import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, CirclePlay, ClipboardCheck, ListChecks, Mic } from 'lucide-react';
import { dayKey } from '../utils/learnerProgress';
import { findModule } from '../data/learnerModules';

/* ══════════════════════════════════════════════════════════════
   Activity — /dashboard/activity  (GitHub-contributions style)
   One heatmap box, a year switcher on the right, and a monthly
   "Learning activity" timeline underneath, built from the dated
   `progress.activity` log.
   ══════════════════════════════════════════════════════════════ */

const KINDS = [
  { id: 'lecture', label: 'Lecture', one: 'lecture', many: 'lectures', verb: 'Watched', tab: 'watch', Icon: CirclePlay, color: '#F3912E' },
  { id: 'practice', label: 'Practice', one: 'practice submission', many: 'practice submissions', verb: 'Made', tab: 'practice', Icon: ListChecks, color: '#3FB97A' },
  { id: 'test', label: 'Test', one: 'test attempt', many: 'test attempts', verb: 'Made', tab: 'test', Icon: ClipboardCheck, color: '#A78BFA' },
  { id: 'interview', label: 'Mock Interview', one: 'mock interview', many: 'mock interviews', verb: 'Booked', tab: 'interview', Icon: Mic, color: '#60A5FA' }
];
const FILTERS = [{ id: 'all', label: 'All activity', color: '#F3912E' }, ...KINDS];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const plural = (n, one, many) => `${n.toLocaleString('en-IN')} ${n === 1 ? one : many}`;
const level = (n) => (n <= 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4); // GitHub-style buckets
const countFor = (day, filter) =>
  !day ? 0 : filter === 'all' ? KINDS.reduce((a, k) => a + (day[k.id] || 0), 0) : day[filter] || 0;
const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };

const DashboardActivity = ({ ctx }) => {
  const { progress, enrollment } = ctx;
  const activity = progress.activity || {};
  const [filter, setFilter] = useState('all');
  const [period, setPeriod] = useState('last'); // 'last' or a year number
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const [monthsShown, setMonthsShown] = useState(2);
  const menuRef = useRef(null);

  // Close the settings menu on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /* Period → visible range */
  let rangeStart;
  let rangeEnd;
  if (period === 'last') {
    rangeEnd = today;
    rangeStart = new Date(today);
    rangeStart.setDate(rangeStart.getDate() - 364);
  } else {
    rangeStart = new Date(period, 0, 1);
    rangeEnd = new Date(Math.min(new Date(period, 11, 31).getTime(), today.getTime()));
  }
  const inRange = (d) => d >= rangeStart && d <= rangeEnd;

  /* Year list: from the earlier of enrollment / first activity, to this year */
  const firstYear = Math.min(
    today.getFullYear(),
    enrollment?.paidAt ? new Date(enrollment.paidAt).getFullYear() : today.getFullYear(),
    ...Object.keys(activity).map((k) => Number(k.slice(0, 4)))
  );
  const years = [];
  for (let y = today.getFullYear(); y >= firstYear; y--) years.push(y);

  /* Grid: Sunday-aligned week columns covering the range */
  const gridStart = new Date(rangeStart);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());
  const gridEnd = period === 'last' ? today : new Date(period, 11, 31);
  const weeks = [];
  for (let d = new Date(gridStart); d <= gridEnd || weeks.at(-1)?.length < 7; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0) weeks.push([]);
    weeks.at(-1).push(inRange(d) ? { date: new Date(d), key: dayKey(d) } : null);
  }
  const monthLabels = weeks.map((w, i) => {
    const first = w.find(Boolean)?.date;
    const prev = weeks[i - 1]?.find(Boolean)?.date;
    return first && (!prev || prev.getMonth() !== first.getMonth()) ? MONTHS[first.getMonth()] : '';
  });

  /* Totals + streaks */
  const rangeKeys = Object.keys(activity).filter((k) => inRange(parseKey(k)));
  const total = rangeKeys.reduce((a, k) => a + countFor(activity[k], filter), 0);
  const activeAll = new Set(Object.keys(activity).filter((k) => countFor(activity[k], 'all') > 0));
  const runBack = (d) => { let n = 0; const c = new Date(d); while (activeAll.has(dayKey(c))) { n++; c.setDate(c.getDate() - 1); } return n; };
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const currentStreak = activeAll.has(dayKey(today)) ? runBack(today) : runBack(yesterday);
  const longestStreak = [...activeAll].reduce((best, k) => {
    const d = parseKey(k);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    return activeAll.has(dayKey(next)) ? best : Math.max(best, runBack(d)); // measure only at the end of a run
  }, 0);

  /* Timeline: months in range with activity, newest first */
  const byMonth = {};
  rangeKeys.forEach((k) => {
    const day = activity[k];
    if (countFor(day, filter) === 0) return;
    const bucket = (byMonth[k.slice(0, 7)] ||= { kinds: {} });
    KINDS.forEach((kind) => {
      if (filter !== 'all' && filter !== kind.id) return;
      const n = day[kind.id] || 0;
      if (!n) return;
      const entry = (bucket.kinds[kind.id] ||= { total: 0, mods: {} });
      entry.total += n;
      Object.entries(day.mods || {}).forEach(([tag, c]) => {
        const [tk, mod] = tag.split('|');
        if (tk === kind.id) entry.mods[mod] = (entry.mods[mod] || 0) + c;
      });
    });
  });
  const months = Object.keys(byMonth).sort().reverse();
  const color = FILTERS.find((f) => f.id === filter).color;
  const periodLabel = period === 'last' ? 'in the last year' : `in ${period}`;
  const kindFor = KINDS.find((k) => k.id === filter);

  const choosePeriod = (p) => { setPeriod(p); setMonthsShown(2); };

  return (
    <div className="dx-gh">
      <div className="dx-gh-main">
        <div className="dx-gh-head">
          <h1>
            {filter === 'all' ? plural(total, 'activity', 'activities') : plural(total, kindFor.one, kindFor.many)} {periodLabel}
          </h1>

          <div className="dx-gh-settings" ref={menuRef}>
            <button type="button" className="dx-gh-settings-btn" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-haspopup="menu">
              Activity settings <ChevronDown size={14} />
            </button>
            {menuOpen && (
              <div className="dx-gh-menu" role="menu">
                <span className="dx-gh-menu-title">Show</span>
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={filter === f.id}
                    className="dx-gh-menu-item"
                    onClick={() => { setFilter(f.id); setMenuOpen(false); setMonthsShown(2); }}
                  >
                    <span className="dx-gh-check">{filter === f.id && <Check size={14} />}</span>
                    <span className="dx-gh-swatch" style={{ background: f.color }} />
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="dx-gh-streaks">
          <span><strong>{currentStreak}</strong> day streak</span>
          <span><strong>{longestStreak}</strong> longest streak</span>
          <span><strong>{activeAll.size}</strong> active {activeAll.size === 1 ? 'day' : 'days'}</span>
        </p>

        <section className="dx-gh-box" style={{ '--hm': color }}>
          <div className="dx-gh-scroll">
            <div className="dx-gh-cal" role="img" aria-label={`Activity heatmap: ${total} ${periodLabel}`}>
              <div className="dx-gh-months" aria-hidden="true">
                {monthLabels.map((m, i) => <span key={i}>{m}</span>)}
              </div>
              <div className="dx-gh-body">
                <div className="dx-gh-days" aria-hidden="true">
                  <span /><span>Mon</span><span /><span>Wed</span><span /><span>Fri</span><span />
                </div>
                <div className="dx-gh-grid">
                  {weeks.map((w, wi) => (
                    <div key={wi} className="dx-gh-week">
                      {w.map((cell, di) => {
                        if (!cell) return <span key={di} className="dx-gh-cell blank" />;
                        const day = activity[cell.key];
                        const n = countFor(day, filter);
                        const parts = KINDS.filter((k) => day?.[k.id]).map((k) => plural(day[k.id], k.one, k.many));
                        const when = cell.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                        return (
                          <span
                            key={di}
                            className={`dx-gh-cell l${level(n)}`}
                            title={parts.length ? `${parts.join(', ')} on ${when}` : `No activity on ${when}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="dx-gh-foot">
            <button type="button" className="dx-gh-link" onClick={() => setShowHow((v) => !v)} aria-expanded={showHow}>
              Learn how we count activity
            </button>
            <span className="dx-gh-legend" aria-hidden="true">
              Less {[0, 1, 2, 3, 4].map((l) => <span key={l} className={`dx-gh-cell l${l}`} />)} More
            </span>
          </div>
          {showHow && (
            <p className="dx-gh-how">
              A lecture counts the first time it's watched. Every practice submission, proctored test attempt and mock
              interview booking counts once. Activity is recorded from the day this view was added, so earlier progress
              has no date and doesn't appear here.
            </p>
          )}
        </section>

        <h2 className="dx-gh-subhead">Learning activity</h2>

        {months.length === 0 ? (
          <p className="dx-muted dx-gh-empty">No activity {periodLabel} yet. Watch a lecture or solve a problem to start your graph.</p>
        ) : (
          months.slice(0, monthsShown).map((mk) => {
            const [y, m] = mk.split('-').map(Number);
            const kinds = KINDS.filter((k) => byMonth[mk].kinds[k.id]);
            return (
              <section key={mk} className="dx-gh-month">
                <h3 className="dx-gh-month-head"><span><strong>{MONTHS_LONG[m - 1]}</strong> {y}</span></h3>
                <ol className="dx-gh-timeline">
                  {kinds.map((k) => {
                    const entry = byMonth[mk].kinds[k.id];
                    const mods = Object.entries(entry.mods).sort((a, b) => b[1] - a[1]);
                    const max = Math.max(1, ...mods.map(([, n]) => n));
                    return (
                      <li key={k.id} className="dx-gh-event">
                        <span className="dx-gh-event-icon" style={{ color: k.color }}><k.Icon size={16} /></span>
                        <div className="dx-gh-event-body">
                          <p className="dx-gh-event-title">
                            {k.verb} {plural(entry.total, k.one, k.many)}
                            {mods.length > 0 && <> in {plural(mods.length, 'module', 'modules')}</>}
                          </p>
                          {mods.length > 0 && (
                            <ul className="dx-gh-rows">
                              {mods.map(([modId, n]) => (
                                <li key={modId}>
                                  <Link to={`/dashboard/m/${modId}?tab=${k.tab}`} className="dx-gh-row-link">{findModule(modId)?.title || modId}</Link>
                                  <span className="dx-gh-row-count">{plural(n, k.one, k.many)}</span>
                                  <span className="dx-gh-bar"><span style={{ width: `${Math.round((n / max) * 100)}%`, background: k.color }} /></span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })
        )}

        {months.length > monthsShown && (
          <button type="button" className="dx-gh-more" onClick={() => setMonthsShown((n) => n + 3)}>
            Show more activity
          </button>
        )}
      </div>

      <nav className="dx-gh-years" aria-label="Choose period">
        <button type="button" className={period === 'last' ? 'active' : ''} onClick={() => choosePeriod('last')}>Last year</button>
        {years.map((y) => (
          <button key={y} type="button" className={period === y ? 'active' : ''} onClick={() => choosePeriod(y)}>{y}</button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardActivity;
