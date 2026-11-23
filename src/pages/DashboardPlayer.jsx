import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, CirclePlay, Clock, FileText,
  ListChecks, PanelRightClose, PanelRightOpen, RotateCcw, X
} from 'lucide-react';
import { DEMO_VIDEO_SRC, allLectures, findModule, moduleForPlan, moduleUnlocked, subjectExtended } from '../data/learnerModules';
import { practiceForUnit } from '../data/practiceBank';

/* ══════════════════════════════════════════════════════════════
   Lecture player — /dashboard/m/:moduleId/watch/:lectureId
   Left: "← Sections", the video, title + course line, Report,
   then Additional resources / Notes tabs.
   Right: the subject panel — ‹ › switch between the module's
   subjects; every unit of the subject is listed (the playing one
   open) with a quiet practice link per unit; subject progress
   pinned at the bottom. The panel can be collapsed.
   ══════════════════════════════════════════════════════════════ */

const AUTOPLAY_SECONDS = 5;
const watchUrl = (modId, lecId) => `/dashboard/m/${modId}/watch/${lecId}`;

const notesKey = (id) => `cs-lecture-notes-${id}`;
const readNotes = (id) => { try { return localStorage.getItem(notesKey(id)) || ''; } catch { return ''; } };
const writeNotes = (id, v) => { try { localStorage.setItem(notesKey(id), v); } catch { /* storage off */ } };

const DashboardPlayer = ({ ctx }) => {
  const { moduleId, lectureId } = useParams();
  const navigate = useNavigate();
  const { planId, progress, toggle, set } = ctx;

  const [ended, setEnded] = useState(false);
  const [countdown, setCountdown] = useState(AUTOPLAY_SECONDS);
  const [autoNext, setAutoNext] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [infoTab, setInfoTab] = useState('resources');
  const [notes, setNotes] = useState(() => readNotes(lectureId));
  const currentRef = useRef(null);

  const mod = ctx.preview ? ctx.modules.find((m) => m.id === moduleId) || null : moduleForPlan(findModule(moduleId), planId, ctx.devTrack);
  const lectures = mod ? allLectures(mod) : [];
  const idx = lectures.findIndex((l) => l.id === lectureId);
  const current = lectures[idx];
  const next = lectures[idx + 1];

  // Which subject the panel shows (‹ › browse without leaving the video)
  const playingSubjectIdx = mod && current ? Math.max(0, mod.subjects.findIndex((s) => s.id === current.subjectId)) : 0;
  const [subjectIdx, setSubjectIdx] = useState(playingSubjectIdx);
  const [openUnits, setOpenUnits] = useState(() => new Set(current ? [current.unitId] : []));
  const flipUnit = (id) => setOpenUnits((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  useEffect(() => { currentRef.current?.scrollIntoView({ block: 'nearest' }); }, [lectureId]);

  useEffect(() => {
    if (!ended || !autoNext || !next) return undefined;
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(t); navigate(watchUrl(mod.id, next.id)); return AUTOPLAY_SECONDS; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [ended, autoNext, next, mod, navigate]);

  if (!mod) return <Navigate to="/dashboard" replace />;
  if (!moduleUnlocked(mod, planId, ctx.devTrack)) return <Navigate to={`/dashboard/m/${mod.id}`} replace />;
  if (!current) return <Navigate to={`/dashboard/m/${mod.id}?tab=watch`} replace />;

  const playingSubject = mod.subjects[playingSubjectIdx];
  const unit = playingSubject?.units.find((u) => u.id === current.unitId);
  const done = !!progress.watched[current.id];

  // Panel subject + its units
  const subject = mod.subjects[subjectIdx] || playingSubject;
  const nSubjects = mod.subjects.length;
  const isExt = subject ? subjectExtended(ctx.extended, mod, subject) : false;
  const groups = (subject?.units || []).map((u) => ({ unit: u, practice: practiceForUnit(mod, u, isExt) }));
  const subjLectures = groups.flatMap((g) => g.unit.lectures);
  const subjWatched = subjLectures.filter((l) => progress.watched[l.id]).length;
  const subjPct = subjLectures.length ? Math.round((subjWatched / subjLectures.length) * 100) : 0;
  const browse = (d) => {
    const n = (subjectIdx + d + nSubjects) % nSubjects;
    setSubjectIdx(n);
    // open the unit being played if we're back on its subject, else the first unit
    const s = mod.subjects[n];
    setOpenUnits(new Set([s.id === playingSubject.id ? current.unitId : s.units[0]?.id]));
  };


  return (
    <div className={`dx-player dx-lp ${panelOpen ? '' : 'is-wide'}`}>
      <div className="dx-player-main">
        <div className="dx-lp-top">
          <Link to={`/dashboard/m/${mod.id}?tab=watch`} className="dx-lp-back"><ArrowLeft size={16} /> Sections</Link>
          <button type="button" className="dx-lp-toggle" onClick={() => setPanelOpen((v) => !v)}
            aria-label={panelOpen ? 'Hide lecture list' : 'Show lecture list'} title={panelOpen ? 'Hide lecture list' : 'Show lecture list'}>
            {panelOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </button>
        </div>

        <div className="dx-video">
          <video key={current.id} src={current.src || DEMO_VIDEO_SRC} controls autoPlay playsInline preload="metadata"
            onEnded={() => { set('watched', current.id, true); setEnded(true); }} />
          {ended && (
            <div className="dx-upnext-overlay">
              {next ? (
                <div className="dx-upnext-card">
                  <span className="dx-kicker">Up next{autoNext ? ` in ${countdown}s` : ''}</span>
                  <h3>{next.title}</h3>
                  <p className="dx-muted dx-small">{next.mins} min</p>
                  <div className="dx-upnext-actions">
                    <button type="button" className="dx-btn dx-btn-primary dx-btn-sm" onClick={() => navigate(watchUrl(mod.id, next.id))}><CirclePlay size={15} /> Play now</button>
                    {autoNext
                      ? <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => setAutoNext(false)}><X size={15} /> Cancel</button>
                      : <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => setEnded(false)}><RotateCcw size={15} /> Stay here</button>}
                  </div>
                </div>
              ) : (
                <div className="dx-upnext-card">
                  <CircleCheck size={28} className="dx-done-icon" />
                  <h3>You&apos;ve reached the end of {mod.title}</h3>
                  <p className="dx-muted dx-small">Head to Practice and Tests to lock it in.</p>
                  <div className="dx-upnext-actions">
                    <Link to={`/dashboard/m/${mod.id}?tab=practice`} className="dx-btn dx-btn-primary dx-btn-sm">Go to Practice</Link>
                    <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => setEnded(false)}>Close</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="dx-lp-info">
          <div className="dx-lp-titles">
            <h1>{current.title}</h1>
            <p>{mod.subjects.length > 1 ? `${playingSubject?.title} · ` : `${mod.title} · `}{unit?.title}</p>
          </div>
          <div className="dx-lp-actions">
            <button type="button" className={`dx-lp-btn ${done ? 'is-done' : ''}`} onClick={() => toggle('watched', current.id)}>
              <CircleCheck size={16} /> {done ? 'Completed' : 'Mark complete'}
            </button>
            {ctx.openSupport && (
              <button type="button" className="dx-lp-btn" onClick={ctx.openSupport}><AlertCircle size={16} /> Report</button>
            )}
          </div>
        </div>

        <div className="dx-lp-tabs" role="tablist">
          {[['resources', 'Additional Resources'], ['notes', 'Notes']].map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={infoTab === k} className={infoTab === k ? 'is-on' : ''} onClick={() => setInfoTab(k)}>{label}</button>
          ))}
        </div>
        {infoTab === 'resources' ? (
          <ul className="dx-lp-res">
            <li><FileText size={16} /><span>{current.title} · lecture slides</span><em>PDF</em></li>
            <li><Clock size={16} /><span>{current.mins} min lecture</span><em>Lecture {idx + 1} of {lectures.length}</em></li>
          </ul>
        ) : (
          <div className="dx-lp-notes">
            <textarea value={notes} placeholder="Write notes for this lecture. They're saved on this device."
              onChange={(e) => { setNotes(e.target.value); writeNotes(current.id, e.target.value); }} />
          </div>
        )}
      </div>

      {/* ── Subject panel ── */}
      {panelOpen && (
        <aside className="dx-lp-panel" aria-label={`${subject.title} content`}>
          <div className="dx-lp-head">
            <h2>{nSubjects > 1 ? `Subject ${subjectIdx + 1}: ` : ''}{subject.title}</h2>
            {nSubjects > 1 && (
              <span className="dx-lp-step">
                <button type="button" onClick={() => browse(-1)} aria-label="Previous subject"><ChevronLeft size={16} /></button>
                <button type="button" onClick={() => browse(1)} aria-label="Next subject"><ChevronRight size={16} /></button>
              </span>
            )}
          </div>

          <div className="dx-lp-body">
            {groups.map(({ unit: u, practice }, gi) => {
              const isOpen = openUnits.has(u.id);
              const uDone = u.lectures.filter((l) => progress.watched[l.id]).length;
              const solved = practice.filter((p) => progress.practice[p.id]).length;
              return (
                <section key={u.id} className={`dx-lp-unit ${isOpen ? 'is-open' : ''}`}>
                  <button type="button" className="dx-lp-unit-btn" onClick={() => flipUnit(u.id)} aria-expanded={isOpen}>
                    <span className="dx-lp-unit-num">{String(gi + 1).padStart(2, '0')}</span>
                    <span className="dx-lp-unit-name">{u.title}</span>
                    <span className="dx-lp-unit-meta">{uDone}/{u.lectures.length}</span>
                    <ChevronDown size={15} className="dx-lp-chev" />
                  </button>
                  {isOpen && (
                    <ul>
                      {u.lectures.map((l) => {
                        const isCurrent = l.id === current.id;
                        const isDone = !!progress.watched[l.id];
                        return (
                          <li key={l.id} ref={isCurrent ? currentRef : undefined}>
                            <Link to={watchUrl(mod.id, l.id)} className={`dx-lp-item ${isCurrent ? 'is-current' : ''}`} aria-current={isCurrent ? 'true' : undefined}>
                              <span className="dx-lp-ico"><CirclePlay size={17} /></span>
                              <span className="dx-lp-text"><b>{l.title}</b><small>{isCurrent ? 'Now playing' : 'Video lecture'} · {l.mins} min</small></span>
                              <span className={`dx-lp-check ${isDone ? 'is-done' : ''}`} aria-label={isDone ? 'Watched' : 'Not watched'}>{isDone && <CircleCheck size={18} />}</span>
                            </Link>
                          </li>
                        );
                      })}
                      {/* last line of the unit: a quiet link to its practice questions */}
                      {practice.length > 0 && (
                        <li>
                          <Link to={`/dashboard/m/${mod.id}?tab=practice&subject=${subject.id}&unit=${u.id}`} className={`dx-pl-practice ${solved === practice.length ? 'is-done' : ''}`}>
                            <ListChecks size={14} />
                            <span>Practice {u.title} questions</span>
                            <em>{solved}/{practice.length}</em>
                            <ArrowRight size={13} className="dx-pl-practice-go" />
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>

          <div className="dx-lp-foot">
            <span>Subject progress</span><b>{subjPct}%</b>
            <div className="dx-lp-bar"><i style={{ width: `${subjPct}%` }} /></div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default DashboardPlayer;
