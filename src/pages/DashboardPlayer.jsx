import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, CirclePlay, Clock,
  ListChecks, PanelRightClose, PanelRightOpen, RotateCcw, X
} from 'lucide-react';
import { DEMO_VIDEO_SRC, allLectures, findModule, moduleForPlan, moduleUnlocked, subjectExtended } from '../data/learnerModules';
import { practiceForUnit } from '../data/practiceBank';
import LectureAI from './DashboardLectureAI';
import AiOrb from '../components/AiOrb';

/* ══════════════════════════════════════════════════════════════
   Lecture player — /dashboard/m/:moduleId/watch/:lectureId
   Left: "← Sections", the video, title + course line, Report,
   then Additional resources / Notes tabs.
   Right: the subject panel — ‹ › switch between the module's
   subjects; every unit of the subject is listed (the playing one
   open) with a quiet practice link per unit; subject progress
   pinned at the bottom. The panel can be collapsed.
   ✦ (Ask Buddy A.I.) opens a chat in the top 60% of the panel and pushes
   the lecture list down into the remaining 40%.
   ══════════════════════════════════════════════════════════════ */

const AUTOPLAY_SECONDS = 5;
const watchUrl = (modId, lecId) => `/dashboard/m/${modId}/watch/${lecId}`;

// Ask Buddy A.I. stays open when the next lecture starts (the player remounts per lecture)
const AI_KEY = 'cs_lp_ai_open';
const readAiOpen = () => { try { return sessionStorage.getItem(AI_KEY) === '1'; } catch { return false; } };
const writeAiOpen = (v) => { try { sessionStorage.setItem(AI_KEY, v ? '1' : '0'); } catch { /* storage off */ } };

const notesKey = (id) => `cs-lecture-notes-${id}`;
const readNotes = (id) => { try { return localStorage.getItem(notesKey(id)) || ''; } catch { return ''; } };
const writeNotes = (id, v) => { try { localStorage.setItem(notesKey(id), v); } catch { /* storage off */ } };

/* `course` (optional): a one-time purchased course ({ mod, watched, setWatched }).
   It plays here too, with its own links (/dashboard/course/:id) and its own watched store. */
const DashboardPlayer = ({ ctx, course = null }) => {
  const params = useParams();
  const moduleId = course ? course.mod.id : params.moduleId;
  const { lectureId } = params;
  const navigate = useNavigate();
  const { planId, progress: planProgress, toggle, set } = ctx;
  // Purchased courses read and write their own watched lectures, never the plan's progress
  const progress = course ? { watched: course.watched, practice: {} } : planProgress;
  const markWatched = (id, value) => (course ? course.setWatched(id, value) : set('watched', id, value));
  const flipWatched = (id) => (course ? course.setWatched(id, !course.watched[id]) : toggle('watched', id));
  const base = course ? `/dashboard/course/${moduleId}` : `/dashboard/m/${moduleId}`;
  const lectureUrl = (lecId) => (course ? `${base}/watch/${lecId}` : watchUrl(moduleId, lecId));

  const [ended, setEnded] = useState(false);
  const [countdown, setCountdown] = useState(AUTOPLAY_SECONDS);
  const [autoNext, setAutoNext] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [aiOpen, setAiOpenState] = useState(readAiOpen);
  const setAiOpen = (v) => { setAiOpenState(v); writeAiOpen(v); };
  const [infoTab, setInfoTab] = useState('resources');
  const [notes, setNotes] = useState(() => readNotes(lectureId));
  const currentRef = useRef(null);
  const panelRef = useRef(null);
  const [aiHeight, setAiHeight] = useState(null); // px once dragged; 60% of the column until then

  // Drag the bar under the chat: down makes the chat taller and pushes the subject card down
  const startResize = (e) => {
    e.preventDefault();
    const box = panelRef.current?.getBoundingClientRect();
    if (!box) return;
    const move = (ev) => setAiHeight(Math.round(Math.min(box.height - 130, Math.max(220, ev.clientY - box.top - 6))));
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  const nudgeResize = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const box = panelRef.current?.getBoundingClientRect();
    if (!box) return;
    const now = aiHeight ?? box.height * 0.6;
    setAiHeight(Math.round(Math.min(box.height - 130, Math.max(220, now + (e.key === 'ArrowDown' ? 40 : -40)))));
  };

  const mod = course ? course.mod : ctx.preview ? ctx.modules.find((m) => m.id === moduleId) || null : moduleForPlan(findModule(moduleId), planId, ctx.devTrack);
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
        if (c <= 1) { clearInterval(t); navigate(lectureUrl(next.id)); return AUTOPLAY_SECONDS; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [ended, autoNext, next, mod, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mod) return <Navigate to="/dashboard" replace />;
  if (!course && !moduleUnlocked(mod, planId, ctx.devTrack)) return <Navigate to={`/dashboard/m/${mod.id}`} replace />;
  if (!current) return <Navigate to={course ? base : `/dashboard/m/${mod.id}?tab=watch`} replace />;

  const playingSubject = mod.subjects[playingSubjectIdx];
  const unit = playingSubject?.units.find((u) => u.id === current.unitId);
  const done = !!progress.watched[current.id];

  // Panel subject + its units
  const subject = mod.subjects[subjectIdx] || playingSubject;
  const nSubjects = mod.subjects.length;
  const isExt = subject && !course ? subjectExtended(ctx.extended, mod, subject) : false;
  const groups = (subject?.units || []).map((u) => ({ unit: u, practice: course ? [] : practiceForUnit(mod, u, isExt) }));
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
          <Link to={course ? base : `/dashboard/m/${mod.id}?tab=watch`} className="dx-lp-back"><ArrowLeft size={16} /> {course ? 'Course' : 'Sections'}</Link>
          <span className="dx-lp-top-tools">
            <button type="button" className="dx-lp-toggle" onClick={() => setPanelOpen((v) => !v)}
              aria-label={panelOpen ? 'Hide lecture list' : 'Show lecture list'} title={panelOpen ? 'Hide lecture list' : 'Show lecture list'}>
              {panelOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            </button>
          </span>
        </div>

        <div className="dx-video">
          <video key={current.id} src={current.src || DEMO_VIDEO_SRC} controls autoPlay playsInline preload="metadata"
            onEnded={() => { markWatched(current.id, true); setEnded(true); }} />
          {ended && (
            <div className="dx-upnext-overlay">
              {next ? (
                <div className="dx-upnext-card">
                  <span className="dx-kicker">Up next{autoNext ? ` in ${countdown}s` : ''}</span>
                  <h3>{next.title}</h3>
                  <p className="dx-muted dx-small">{next.mins} min</p>
                  <div className="dx-upnext-actions">
                    <button type="button" className="dx-btn dx-btn-primary dx-btn-sm" onClick={() => navigate(lectureUrl(next.id))}><CirclePlay size={15} /> Play now</button>
                    {autoNext
                      ? <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => setAutoNext(false)}><X size={15} /> Cancel</button>
                      : <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => setEnded(false)}><RotateCcw size={15} /> Stay here</button>}
                  </div>
                </div>
              ) : (
                <div className="dx-upnext-card">
                  <CircleCheck size={28} className="dx-done-icon" />
                  <h3>You&apos;ve reached the end of {mod.title}</h3>
                  <p className="dx-muted dx-small">{course ? 'You have finished every lecture in this course.' : 'Head to Practice and Tests to lock it in.'}</p>
                  <div className="dx-upnext-actions">
                    {course
                      ? <Link to={base} className="dx-btn dx-btn-primary dx-btn-sm">Back to course</Link>
                      : <Link to={`/dashboard/m/${mod.id}?tab=practice`} className="dx-btn dx-btn-primary dx-btn-sm">Go to Problem</Link>}
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
            <button type="button" className={`dx-lp-btn ${done ? 'is-done' : ''}`} onClick={() => flipWatched(current.id)}>
              <CircleCheck size={16} /> {done ? 'Completed' : 'Mark complete'}
            </button>
            {/* Ask Buddy A.I.: opens the chat above the lecture list */}
            <button type="button" className={`dx-lp-btn dx-lp-ai-btn ${aiOpen && panelOpen ? 'is-on' : ''}`}
              onClick={() => { if (aiOpen && panelOpen) setAiOpen(false); else { setAiOpen(true); setPanelOpen(true); } }}
              aria-pressed={aiOpen && panelOpen} title="Ask Buddy A.I. about this lecture">
              <AiOrb size={18} still /> Ask Buddy A.I.
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
        <aside ref={panelRef} className={`dx-lp-panel ${aiOpen ? 'has-ai' : ''}`} aria-label={`${subject.title} content`}>
          {aiOpen && (
            <>
              <LectureAI lecture={current} unitTitle={unit?.title} onClose={() => setAiOpen(false)} height={aiHeight} />
              <div className="dx-ai-resize" role="separator" aria-orientation="horizontal" aria-label="Drag to resize the Buddy A.I. chat"
                tabIndex={0} onPointerDown={startResize} onKeyDown={nudgeResize} onDoubleClick={() => setAiHeight(null)} title="Drag to resize · double-click to reset">
                <span />
              </div>
            </>
          )}
          <div className="dx-lp-list">
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
                            <Link to={lectureUrl(l.id)} className={`dx-lp-item ${isCurrent ? 'is-current' : ''}`} aria-current={isCurrent ? 'true' : undefined}>
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
          </div>
        </aside>
      )}
    </div>
  );
};

export default DashboardPlayer;
