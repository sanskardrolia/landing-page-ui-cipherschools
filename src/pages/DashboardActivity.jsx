import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronDown, CirclePlay, ClipboardCheck, Flame, Info, ListChecks, Mic, Sparkles, Trophy } from 'lucide-react';
import ModuleIcon from '../components/ModuleIcon';
import DashboardActivityDetail from './DashboardActivityDetail';
import { dayKey } from '../utils/learnerProgress';
import { findModule, moduleUnlocked } from '../data/learnerModules';
import { activityFor } from '../utils/demoActivity';

/* ══════════════════════════════════════════════════════════════
   Activity — /dashboard/activity
   1. Header: total, pillar filter, period
   2. Summary: total · current streak · longest streak · active days
   3. Heatmap (GitHub-style year grid)
   4. Insights: activity mix · weekly rhythm · top modules
   5. Months: one compact row each, open for the module breakdown
   Built from the dated `progress.activity` log (+ demo sample).
   Colours match the dashboard pillars.
   ══════════════════════════════════════════════════════════════ */

const KINDS = [
  { id: 'lecture', label: 'Lectures', one: 'lecture', many: 'lectures', tab: 'watch', Icon: CirclePlay, color: '#E8801A' },
  { id: 'practice', label: 'Practice', one: 'practice submission', many: 'practice submissions', tab: 'practice', Icon: ListChecks, color: '#3B82F6' },
  { id: 'test', label: 'Tests', one: 'test attempt', many: 'test attempts', tab: 'test', Icon: ClipboardCheck, color: '#10B981' },
  { id: 'interview', label: 'Mock', one: 'mock interview', many: 'mock interviews', tab: 'interview', Icon: Mic, color: '#A855F7' }
];
const FILTERS = [{ id: 'all', label: 'All', color: '#E8801A' }, ...KINDS];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAYS_LONG = ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays'];

const fmt = (n) => n.toLocaleString('en-IN');
const plural = (n, one, many) => `${fmt(n)} ${n === 1 ? one : many}`;
const level = (n) => (n <= 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4); // GitHub-style buckets
const countFor = (day, filter) =>
  !day ? 0 : filter === 'all' ? KINDS.reduce((a, k) => a + (day[k.id] || 0), 0) : day[filter] || 0;
const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };

const DashboardActivity = ({ ctx }) => {
  const { enrollment } = ctx;
  // Demo: every plan, and the preview, gets a year of sample activity from its own modules under the real log
  const activity = activityFor(ctx, ctx.modules.filter((m) => moduleUnlocked(m, ctx.planId, ctx.devTrack)));
  const [filter, setFilter] = useState('all');
  const [period, setPeriod] = useState('last'); // 'last' or a year number
  const [showHow, setShowHow] = useState(false);
  const [openMonths, setOpenMonths] = useState(() => new Set());
  const [monthsShown, setMonthsShown] = useState(4);
  const [detail, setDetail] = useState(null); // { mod, kind, mk, count } while the details window is open
  // Heatmap square size: fill the card's width (between 10 and 22px); narrow screens scroll instead
  const scrollRef = useRef(null);
  const [cell, setCell] = useState(11);

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

  /* Years: from the earlier of enrollment / first activity, to this year */
  const firstYear = Math.min(
    today.getFullYear(),
    enrollment?.paidAt ? new Date(enrollment.paidAt).getFullYear() : today.getFullYear(),
    ...Object.keys(activity).map((k) => Number(k.slice(0, 4)))
  );
  const years = [];
  for (let y = today.getFullYear(); y >= firstYear; y--) years.push(y);

  /* Heatmap grid: Sunday-aligned week columns covering the range */
  const gridStart = new Date(rangeStart);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());
  const gridEnd = period === 'last' ? today : new Date(period, 11, 31);
  const weeks = [];
  for (let d = new Date(gridStart); d <= gridEnd || weeks.at(-1)?.length < 7; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0) weeks.push([]);
    weeks.at(-1).push(inRange(d) ? { date: new Date(d), key: dayKey(d) } : null);
  }
  const weekCount = weeks.length;
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const GAP = 3;
    const DAYS_COL = 36; // weekday labels + gap, with a little room so it never needs a scrollbar
    const fit = () => {
      const size = Math.floor(((el.clientWidth - DAYS_COL + GAP) / weekCount - GAP) * 100) / 100; // fractional px so it fills exactly
      setCell(Math.max(10, Math.min(22, size)));
    };
    const first = setTimeout(fit, 0);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    ro?.observe(el);
    return () => { clearTimeout(first); ro?.disconnect(); };
  }, [weekCount]);

  const monthLabels = weeks.map((w, i) => {
    const first = w.find(Boolean)?.date;
    const prev = weeks[i - 1]?.find(Boolean)?.date;
    return first && (!prev || prev.getMonth() !== first.getMonth()) ? MONTHS[first.getMonth()] : '';
  });

  /* Totals + streaks */
  const rangeKeys = Object.keys(activity).filter((k) => inRange(parseKey(k)));
  const total = rangeKeys.reduce((a, k) => a + countFor(activity[k], filter), 0);
  const activeAll = new Set(Object.keys(activity).filter((k) => countFor(activity[k], 'all') > 0));
  const activeInRange = rangeKeys.filter((k) => countFor(activity[k], filter) > 0).length;
  const daysInRange = Math.round((rangeEnd - rangeStart) / 86400000) + 1;
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

  /* Insights over the range: kind mix, weekday rhythm, top modules */
  const mix = KINDS.map((k) => ({ ...k, n: rangeKeys.reduce((a, key) => a + (activity[key][k.id] || 0), 0) }));
  const mixTotal = mix.reduce((a, m) => a + m.n, 0);
  const weekday = WEEKDAYS.map(() => 0);
  const modCount = {};
  rangeKeys.forEach((key) => {
    const day = activity[key];
    weekday[(parseKey(key).getDay() + 6) % 7] += countFor(day, filter);
    Object.entries(day.mods || {}).forEach(([tag, c]) => {
      const [kind, mod] = tag.split('|');
      if (filter === 'all' || filter === kind) modCount[mod] = (modCount[mod] || 0) + c;
    });
  });
  const weekdayMax = Math.max(1, ...weekday);
  const busiest = weekday.indexOf(Math.max(...weekday));
  const modTitle = (id) => (ctx.modules.find((m) => m.id === id) || findModule(id))?.title || id;
  const modOf = (id) => ctx.modules.find((m) => m.id === id) || findModule(id);
  const topMods = Object.entries(modCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topMax = Math.max(1, ...topMods.map(([, n]) => n));

  /* Months in range with activity, newest first */
  const byMonth = {};
  rangeKeys.forEach((k) => {
    const day = activity[k];
    if (countFor(day, filter) === 0) return;
    const bucket = (byMonth[k.slice(0, 7)] ||= { total: 0, days: 0, kinds: {} });
    bucket.days += 1;
    KINDS.forEach((kind) => {
      if (filter !== 'all' && filter !== kind.id) return;
      const n = day[kind.id] || 0;
      if (!n) return;
      bucket.total += n;
      const entry = (bucket.kinds[kind.id] ||= { total: 0, mods: {} });
      entry.total += n;
      Object.entries(day.mods || {}).forEach(([tag, c]) => {
        const [tk, mod] = tag.split('|');
        if (tk === kind.id) entry.mods[mod] = (entry.mods[mod] || 0) + c;
      });
    });
  });
  const months = Object.keys(byMonth).sort().reverse();
  const isOpen = (mk, i) => (openMonths.has(mk) ? true : openMonths.has(`!${mk}`) ? false : i === 0);
  const flipMonth = (mk, i) => setOpenMonths((prev) => {
    const n = new Set(prev);
    const open = isOpen(mk, i);
    n.delete(mk); n.delete(`!${mk}`);
    n.add(open ? `!${mk}` : mk);
    return n;
  });

  const color = FILTERS.find((f) => f.id === filter).color;
  const periodLabel = period === 'last' ? 'in the last year' : `in ${period}`;
  const kindFor = KINDS.find((k) => k.id === filter);

  return (
    <div className="dx-act">
      {/* 1. Header */}
      <header className="dx-act-head">
        <p className="dx-act-total">
          <strong>{fmt(total)}</strong> {filter === 'all' ? (total === 1 ? 'activity' : 'activities') : (total === 1 ? kindFor.one : kindFor.many)} {periodLabel}
        </p>
        <div className="dx-act-controls">
          <div className="dx-act-filters" role="radiogroup" aria-label="Show">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" role="radio" aria-checked={filter === f.id} className={filter === f.id ? 'active' : ''} onClick={() => setFilter(f.id)} style={{ '--f': f.color }}>
                {f.id !== 'all' && <i />}{f.label}
              </button>
            ))}
          </div>
          <label className="dx-act-period">
            <CalendarDays size={14} />
            <select value={period} onChange={(e) => setPeriod(e.target.value === 'last' ? 'last' : Number(e.target.value))} aria-label="Period">
              <option value="last">Last 12 months</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
        </div>
      </header>

      {/* 2. Summary */}
      <section className="dx-act-kpis" aria-label="Summary">
        <div className="dx-act-kpi">
          <span className="dx-act-kpi-label"><Sparkles size={14} /> Activities</span>
          <strong>{fmt(total)}</strong>
          <span className="dx-act-kpi-sub">{activeInRange ? `≈ ${(total / activeInRange).toFixed(1)} per active day` : 'Nothing yet'}</span>
        </div>
        <div className="dx-act-kpi is-streak">
          <span className="dx-act-kpi-label"><Flame size={14} /> Current streak</span>
          <strong>{currentStreak}<small> {currentStreak === 1 ? 'day' : 'days'}</small></strong>
          <span className="dx-act-kpi-sub">{currentStreak ? 'Keep it going today' : 'Start one today'}</span>
        </div>
        <div className="dx-act-kpi">
          <span className="dx-act-kpi-label"><Trophy size={14} /> Longest streak</span>
          <strong>{longestStreak}<small> {longestStreak === 1 ? 'day' : 'days'}</small></strong>
          <span className="dx-act-kpi-sub">{currentStreak && currentStreak >= longestStreak ? 'You’re on your best run' : `${Math.max(0, longestStreak - currentStreak)} days to beat it`}</span>
        </div>
        <div className="dx-act-kpi">
          <span className="dx-act-kpi-label"><CalendarDays size={14} /> Active days</span>
          <strong>{activeInRange}</strong>
          <span className="dx-act-kpi-sub">{Math.round((activeInRange / Math.max(1, daysInRange)) * 100)}% of days</span>
        </div>
      </section>

      {/* 3. Heatmap */}
      <section className="dx-act-card dx-gh-box" style={{ '--hm': color }}>
        <div className="dx-gh-scroll" ref={scrollRef}>
          <div className="dx-gh-cal" role="img" aria-label={`Activity heatmap: ${total} ${periodLabel}`} style={{ '--cell': `${cell}px` }}>
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
                      const when = cell.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
                      return (
                        <span key={di} className={`dx-gh-cell l${level(n)}`} title={parts.length ? `${parts.join(', ')} on ${when}` : `No activity on ${when}`} />
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
            <Info size={13} /> How activity is counted
          </button>
          <span className="dx-gh-legend" aria-hidden="true">
            Less {[0, 1, 2, 3, 4].map((l) => <span key={l} className={`dx-gh-cell l${l}`} />)} More
          </span>
        </div>
        {showHow && (
          <p className="dx-gh-how">
            A lecture counts the first time it's watched. Every practice submission, proctored test attempt and mock
            interview booking counts once.
          </p>
        )}
      </section>

      {/* 4. Insights */}
      <div className="dx-act-insights">
        <section className="dx-act-card dx-act-mix">
          <h3>Activity mix</h3>
          {mixTotal === 0 ? <p className="dx-muted dx-small">No activity yet.</p> : (
            <>
              <div className="dx-act-mixbar" aria-hidden="true">
                {mix.filter((m) => m.n).map((m) => (
                  <span key={m.id} style={{ flexGrow: m.n, background: m.color }} className={filter !== 'all' && filter !== m.id ? 'is-dim' : ''} />
                ))}
              </div>
              <ul className="dx-act-mixlist">
                {mix.map((m) => (
                  <li key={m.id} className={filter !== 'all' && filter !== m.id ? 'is-dim' : ''}>
                    <i style={{ background: m.color }} />
                    <span>{m.label}</span>
                    <strong>{fmt(m.n)}</strong>
                    <em>{Math.round((m.n / mixTotal) * 100)}%</em>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="dx-act-card dx-act-week">
          <h3>Weekly rhythm</h3>
          <div className="dx-act-bars" style={{ '--c': color }}>
            {weekday.map((n, i) => (
              <div key={WEEKDAYS[i]} className={`dx-act-bar ${i === busiest && n > 0 ? 'is-top' : ''}`} title={`${WEEKDAYS_LONG[i]}: ${fmt(n)}`}>
                <span className="dx-act-bar-track"><span style={{ height: `${Math.max(n ? 6 : 0, (n / weekdayMax) * 100)}%` }} /></span>
                <small>{WEEKDAYS[i][0]}</small>
              </div>
            ))}
          </div>
          <p className="dx-act-note">{weekday[busiest] > 0 ? <>You learn most on <strong>{WEEKDAYS_LONG[busiest]}</strong>.</> : 'No pattern yet.'}</p>
        </section>

        <section className="dx-act-card dx-act-top">
          <h3>Top modules</h3>
          {topMods.length === 0 ? <p className="dx-muted dx-small">No activity yet.</p> : (
            <ul>
              {topMods.map(([id, n]) => {
                const mod = modOf(id);
                return (
                  <li key={id}>
                    <Link to={`/dashboard/m/${id}`} className="dx-act-top-row">
                      <span className="dx-act-top-icon">{mod ? <ModuleIcon mod={mod} size={14} /> : null}</span>
                      <span className="dx-act-top-name">{modTitle(id)}</span>
                      <span className="dx-act-top-n">{fmt(n)}</span>
                      <span className="dx-act-top-track" aria-hidden="true"><span style={{ width: `${(n / topMax) * 100}%`, background: color }} /></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* 5. Months */}
      <section className="dx-act-months" aria-label="Learning activity by month">
        <h2>Learning activity</h2>
        {months.length === 0 ? (
          <p className="dx-muted dx-act-empty">No activity {periodLabel} yet. Watch a lecture or solve a problem to start.</p>
        ) : (
          <ul>
            {months.slice(0, monthsShown).map((mk, i) => {
              const [y, m] = mk.split('-').map(Number);
              const b = byMonth[mk];
              const open = isOpen(mk, i);
              const kinds = KINDS.filter((k) => b.kinds[k.id]);
              return (
                <li key={mk} className={`dx-act-month ${open ? 'is-open' : ''}`}>
                  <button type="button" className="dx-act-month-head" onClick={() => flipMonth(mk, i)} aria-expanded={open}>
                    <span className="dx-act-month-name"><strong>{MONTHS_LONG[m - 1]}</strong> {y}</span>
                    <span className="dx-act-month-chips">
                      {kinds.map((k) => (
                        <span key={k.id} className="dx-act-chip" style={{ '--k': k.color }} title={plural(b.kinds[k.id].total, k.one, k.many)}>
                          <k.Icon size={12} /> {fmt(b.kinds[k.id].total)}
                        </span>
                      ))}
                    </span>
                    <span className="dx-act-month-total">{fmt(b.total)} · {plural(b.days, 'day', 'days')}</span>
                    <ChevronDown size={16} className={`dx-act-chev ${open ? 'up' : ''}`} />
                  </button>
                  {open && (
                    <div className="dx-act-month-body">
                      {kinds.map((k) => {
                        const mods = Object.entries(b.kinds[k.id].mods).sort((x, z) => z[1] - x[1]);
                        return (
                          <div key={k.id} className="dx-act-kind">
                            <span className="dx-act-kind-label" style={{ '--k': k.color }}><k.Icon size={13} /> {k.label}</span>
                            <span className="dx-act-kind-mods">
                              {mods.map(([modId, n]) => (
                                <button
                                  key={modId}
                                  type="button"
                                  className="dx-act-modtag"
                                  onClick={() => modOf(modId) && setDetail({ mod: modOf(modId), kind: k.id, mk, count: n })}
                                  aria-haspopup="dialog"
                                >
                                  {modTitle(modId)} <b>{fmt(n)}</b>
                                </button>
                              ))}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {months.length > monthsShown && (
          <button type="button" className="dx-act-more" onClick={() => setMonthsShown((n) => n + 4)}>Show earlier months</button>
        )}
      </section>

      {detail && (() => {
        const [dy, dm] = detail.mk.split('-').map(Number);
        // Item ids recorded in the log for this module, kind and month (newer activity only)
        const ids = Object.keys(activity)
          .filter((k) => k.startsWith(detail.mk))
          .sort()
          .flatMap((k) => (activity[k].items || []).filter((x) => x.k === detail.kind && x.m === detail.mod.id).map((x) => x.id));
        return (
          <DashboardActivityDetail
            ctx={ctx}
            mod={detail.mod}
            kind={detail.kind}
            monthKey={detail.mk}
            monthLabel={`${MONTHS_LONG[dm - 1]} ${dy}`}
            count={detail.count}
            dayItems={ids}
            onClose={() => setDetail(null)}
          />
        );
      })()}
    </div>
  );
};

export default DashboardActivity;
