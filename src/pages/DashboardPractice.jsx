import { useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, CircleCheck, Search, X } from 'lucide-react';
import { FREE_LEVELS, FREE_PROBLEMS, FREE_TRACKS, findFreeProblem, markFreeSolved, readFreeSolved, topicsFor } from '../data/freePractice';
import { LevelBadge } from './DashboardModuleView';
import DashboardWorkspace from './DashboardWorkspace';

/* ══════════════════════════════════════════════════════════════
   Practice — /dashboard/practice (free DSA · Programming · SQL bank)
   Separate from the per-unit practice inside Content: its own list,
   its own solved store, open on every plan. "Solve" opens the same
   coding workspace at /dashboard/practice/:problemId.
   ══════════════════════════════════════════════════════════════ */

const DashboardPractice = () => {
  const [solved] = useState(readFreeSolved);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');
  const [topic, setTopic] = useState('All');
  const [status, setStatus] = useState('All');
  // DSA · Programming · SQL, kept in the URL so "back" from a problem returns to the same list
  const [params, setParams] = useSearchParams();
  const track = FREE_TRACKS.find((t) => t.id === params.get('track')) || FREE_TRACKS[0];
  const bank = useMemo(() => FREE_PROBLEMS.filter((p) => p.track === track.id), [track.id]);
  const topics = useMemo(() => topicsFor(track.id), [track.id]);
  const pickTrack = (id) => {
    setParams(id === FREE_TRACKS[0].id ? {} : { track: id }, { replace: true });
    setTopic('All');
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bank.filter((p) => (
      (level === 'All' || p.level === level)
      && (topic === 'All' || p.topics.includes(topic))
      && (status === 'All' || (status === 'Solved') === !!solved[p.id])
      && (!q || p.title.toLowerCase().includes(q) || p.companies.some((c) => c.toLowerCase().includes(q)) || p.topics.some((t) => t.toLowerCase().includes(q)))
    ));
  }, [bank, query, level, topic, status, solved]);

  const count = (lv) => {
    const all = bank.filter((p) => p.level === lv);
    return { done: all.filter((p) => solved[p.id]).length, total: all.length };
  };
  const solvedTotal = bank.filter((p) => solved[p.id]).length;
  const filtered = query || level !== 'All' || topic !== 'All' || status !== 'All';
  const clear = () => { setQuery(''); setLevel('All'); setTopic('All'); setStatus('All'); };

  return (
    <div className="dx-fp">
      {/* The top bar already says "Practice", so the page opens with one line, like Certificates */}
      <header className="dx-page-head">
        <p className="dx-muted dx-fp-lede">
          <span className="dx-fp-free">Free</span>
          {track.lede} Solve them anytime; they're separate from your course practice.
        </p>
      </header>

      <div className="dx-fp-stats">
        <div className="dx-fp-stat">
          <span className="dx-fp-stat-label">Solved</span>
          <strong>{solvedTotal}<span>/{bank.length}</span></strong>
          <span className="dx-fp-bar"><i style={{ width: `${(solvedTotal / bank.length) * 100}%` }} /></span>
        </div>
        {FREE_LEVELS.map((lv) => {
          const c = count(lv);
          return (
            <button key={lv} type="button" className={`dx-fp-stat is-btn ${level === lv ? 'active' : ''}`} onClick={() => setLevel(level === lv ? 'All' : lv)} aria-pressed={level === lv}>
              <span className={`dx-fp-stat-label dx-fp-lv-${lv.toLowerCase()}`}>{lv}</span>
              <strong>{c.done}<span>/{c.total}</span></strong>
            </button>
          );
        })}
      </div>

      <div className="dx-fp-tools">
        <div className="dx-fp-track" role="group" aria-label="Problem type">
          {FREE_TRACKS.map((t) => (
            <button key={t.id} type="button" className={track.id === t.id ? 'active' : ''} aria-pressed={track.id === t.id} onClick={() => pickTrack(t.id)}>{t.label}</button>
          ))}
        </div>
        <label className="dx-fp-search">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search problems, topics or companies" aria-label="Search problems" />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}
        </label>
        <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Difficulty">
          <option value="All">All difficulties</option>
          {FREE_LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic">
          <option value="All">All topics</option>
          {topics.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="All">All status</option>
          <option>Solved</option>
          <option>Unsolved</option>
        </select>
        {filtered && <button type="button" className="dx-fp-clear" onClick={clear}>Clear</button>}
      </div>

      <div className="dx-card dx-fp-card">
        <table className="dx-ptable dx-fp-table">
          <thead>
            <tr>
              <th scope="col">Problem</th>
              <th scope="col" className="dx-col-level">Difficulty</th>
              <th scope="col" className="dx-fp-col-co">Companies</th>
              <th scope="col" className="dx-fp-col-topics">Topics</th>
              <th scope="col" className="dx-fp-col-cta"><span className="dx-sr">Solve</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const done = !!solved[p.id];
              return (
                <tr key={p.id} className={done ? 'done' : ''}>
                  <td>
                    <Link to={`/dashboard/practice/${p.id}`} className="dx-prow-title">
                      <span className="dx-fp-num">{bank.indexOf(p) + 1}.</span>{p.title}
                      {done && <CircleCheck size={15} className="dx-done-icon" aria-label="Solved" />}
                    </Link>
                  </td>
                  <td className="dx-col-level"><LevelBadge level={p.level} /></td>
                  <td className="dx-fp-col-co"><div className="dx-tags">{p.companies.map((c) => <span key={c} className="dx-tag">{c}</span>)}</div></td>
                  <td className="dx-fp-col-topics"><span className="dx-fp-topics">{p.topics.join(' · ')}</span></td>
                  <td className="dx-fp-col-cta">
                    <Link to={`/dashboard/practice/${p.id}`} className={`dx-fp-solve ${done ? 'is-done' : ''}`} data-row={i}>
                      {done ? 'Solve again' : 'Solve'} <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="dx-fp-empty">
            <p>No problems match these filters.</p>
            <button type="button" className="dx-fp-clear" onClick={clear}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* /dashboard/practice/:problemId — the coding workspace for one free problem */
export const FreePracticeSolve = ({ ctx }) => {
  const { problemId } = useParams();
  const item = findFreeProblem(problemId);
  const [solved, setSolved] = useState(() => !!readFreeSolved()[problemId]);
  if (!item) return <Navigate to="/dashboard/practice" replace />;
  const onSolved = (id) => { markFreeSolved(id); setSolved(true); };
  const back = item.track && item.track !== FREE_TRACKS[0].id ? `/dashboard/practice?track=${item.track}` : '/dashboard/practice';
  return <DashboardWorkspace key={item.id} ctx={ctx} free={{ item, solved, onSolved, backTo: back, crumbs: [{ label: 'Practice', to: back }] }} />;
};

export default DashboardPractice;
