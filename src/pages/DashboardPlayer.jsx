import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Circle, CircleCheck, CirclePlay, Clock, ListChecks, RotateCcw, X
} from 'lucide-react';
import { DEMO_VIDEO_SRC, allLectures, findModule, moduleForPlan, moduleUnlocked, subjectExtended } from '../data/learnerModules';
import { practiceForUnit } from '../data/practiceBank';

/* ══════════════════════════════════════════════════════════════
   Lecture player — /dashboard/m/:moduleId/watch/:lectureId
   Video on the left, the module's lecture list ("up next") on the right.
   Finishing a video marks it watched and counts down to the next one.
   The dashboard collapses its sidebar while this route is open.
   ══════════════════════════════════════════════════════════════ */

const AUTOPLAY_SECONDS = 5;
const watchUrl = (modId, lecId) => `/dashboard/m/${modId}/watch/${lecId}`;

const DashboardPlayer = ({ ctx }) => {
  const { moduleId, lectureId } = useParams();
  const navigate = useNavigate();
  const { planId, progress, toggle, set } = ctx;

  const [ended, setEnded] = useState(false);       // video finished → show "up next" card
  const [countdown, setCountdown] = useState(AUTOPLAY_SECONDS);
  const [autoNext, setAutoNext] = useState(true);  // learner can cancel the countdown
  const currentRef = useRef(null);

  // Preview uses its own short module list; otherwise the module as this plan sees it
  const mod = ctx.preview ? ctx.modules.find((m) => m.id === moduleId) || null : moduleForPlan(findModule(moduleId), planId, ctx.devTrack);
  const lectures = mod ? allLectures(mod) : [];
  const idx = lectures.findIndex((l) => l.id === lectureId);
  const current = lectures[idx];
  const prev = lectures[idx - 1];
  const next = lectures[idx + 1];
  // Playlist: only the unit being watched starts open (the player remounts per lecture)
  const [openUnits, setOpenUnits] = useState(() => new Set(current ? [current.unitId] : []));
  const flipUnit = (id) => setOpenUnits((prevSet) => {
    const n = new Set(prevSet);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  // Keep the playing lecture visible in the list
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'nearest' });
  }, [lectureId]);

  // Countdown to the next lecture once a video ends
  useEffect(() => {
    if (!ended || !autoNext || !next) return undefined;
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          navigate(watchUrl(mod.id, next.id));
          return AUTOPLAY_SECONDS;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [ended, autoNext, next, mod, navigate]);

  if (!mod) return <Navigate to="/dashboard" replace />;
  if (!moduleUnlocked(mod, planId, ctx.devTrack)) return <Navigate to={`/dashboard/m/${mod.id}`} replace />;
  if (!current) return <Navigate to={`/dashboard/m/${mod.id}?tab=watch`} replace />;

  const subject = mod.subjects.find((s) => s.id === current.subjectId);
  const unit = subject?.units.find((u) => u.id === current.unitId);
  const done = !!progress.watched[current.id];

  const onEnded = () => {
    set('watched', current.id, true);
    setEnded(true);
  };

  // Playlist: just this section's units, in lecture order
  const isExt = subject ? subjectExtended(ctx.extended, mod, subject) : false;
  const groups = (subject?.units || []).map((u) => ({ key: u.id, unit: u.title, lectures: u.lectures, practice: practiceForUnit(mod, u, isExt) }));
  const showSubject = mod.subjects.length > 1;
  const sectionLectures = groups.flatMap((g) => g.lectures);
  const sectionWatched = sectionLectures.filter((l) => progress.watched[l.id]).length;

  return (
    <div className="dx-player">
      <div className="dx-player-main">
        <Link to={`/dashboard/m/${mod.id}?tab=watch`} className="dx-back-link">
          <ArrowLeft size={15} /> {mod.title}
        </Link>

        <div className="dx-video">
          <video
            key={current.id}
            src={current.src || DEMO_VIDEO_SRC}
            controls
            autoPlay
            playsInline
            preload="metadata"
            onEnded={onEnded}
          />

          {ended && (
            <div className="dx-upnext-overlay">
              {next ? (
                <div className="dx-upnext-card">
                  <span className="dx-kicker">Up next{autoNext ? ` in ${countdown}s` : ''}</span>
                  <h3>{next.title}</h3>
                  <p className="dx-muted dx-small">{next.mins} min</p>
                  <div className="dx-upnext-actions">
                    <button type="button" className="dx-btn dx-btn-primary dx-btn-sm" onClick={() => navigate(watchUrl(mod.id, next.id))}>
                      <CirclePlay size={15} /> Play now
                    </button>
                    {autoNext ? (
                      <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => setAutoNext(false)}>
                        <X size={15} /> Cancel
                      </button>
                    ) : (
                      <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => setEnded(false)}>
                        <RotateCcw size={15} /> Stay here
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="dx-upnext-card">
                  <CircleCheck size={28} className="dx-done-icon" />
                  <h3>You've reached the end of {mod.title}</h3>
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

        <div className="dx-player-info">
          <p className="dx-player-path dx-muted dx-small">
            {showSubject && <>{subject?.title} · </>}{unit?.title} · Lecture {idx + 1} of {lectures.length}
          </p>
          <h1>{current.title}</h1>
          <div className="dx-player-actions">
            <span className="dx-muted dx-small dx-inline"><Clock size={14} /> {current.mins} min</span>
            <span className="dx-spacer" />
            <button
              type="button"
              className="dx-btn dx-btn-ghost dx-btn-sm"
              disabled={!prev}
              onClick={() => prev && navigate(watchUrl(mod.id, prev.id))}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              type="button"
              className={`dx-btn dx-btn-sm ${done ? 'dx-btn-done' : 'dx-btn-ghost'}`}
              onClick={() => toggle('watched', current.id)}
            >
              {done ? <CircleCheck size={16} /> : <Circle size={16} />} {done ? 'Completed' : 'Mark as complete'}
            </button>
            <button
              type="button"
              className="dx-btn dx-btn-primary dx-btn-sm"
              disabled={!next}
              onClick={() => next && navigate(watchUrl(mod.id, next.id))}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Up next / module playlist ── */}
      <aside className="dx-playlist" aria-label={`${mod.title} lectures`}>
        <div className="dx-playlist-head">
          <h2>{showSubject ? subject?.title : 'Module content'}</h2>
          <span className="dx-muted dx-small">{sectionWatched}/{sectionLectures.length} watched</span>
          <div className="dx-progress"><span style={{ width: `${sectionLectures.length ? Math.round((sectionWatched / sectionLectures.length) * 100) : 0}%` }} /></div>
        </div>
        <div className="dx-playlist-body">
          {groups.map((g, gi) => {
            const isOpen = openUnits.has(g.key);
            const gDone = g.lectures.filter((l) => progress.watched[l.id]).length;
            const gMins = g.lectures.reduce((a, l) => a + l.mins, 0);
            return (
            <div key={g.key} className={`dx-pl-group ${isOpen ? 'is-open' : ''}`}>
              {/* Unit header: click to open / close; only the playing unit starts open */}
              <button type="button" className="dx-pl-group-title dx-pl-unit-btn" onClick={() => flipUnit(g.key)} aria-expanded={isOpen}>
                <span className="dx-pl-unit-num">{String(gi + 1).padStart(2, '0')}</span>
                <span className="dx-pl-unit-name">{g.unit}</span>
                <span className="dx-pl-unit-meta">{gDone === g.lectures.length ? <CircleCheck size={13} /> : `${gDone}/${g.lectures.length}`} · {gMins} min</span>
                <ChevronDown size={15} className={`dx-pl-unit-chev ${isOpen ? 'up' : ''}`} />
              </button>
              {isOpen && (
              <ul>
                {g.lectures.map((l) => {
                  const isCurrent = l.id === current.id;
                  const isNext = next && l.id === next.id;
                  const isDone = !!progress.watched[l.id];
                  return (
                    <li key={l.id} ref={isCurrent ? currentRef : undefined}>
                      <Link
                        to={watchUrl(mod.id, l.id)}
                        className={`dx-pl-item ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`}
                        aria-current={isCurrent ? 'true' : undefined}
                      >
                        <span className="dx-pl-icon">
                          {isCurrent ? <CirclePlay size={16} /> : isDone ? <CircleCheck size={16} /> : <Circle size={16} />}
                        </span>
                        <span className="dx-pl-text">
                          <span className="dx-pl-title">{l.title}</span>
                          <span className="dx-pl-meta">
                            {l.mins} min
                            {isCurrent && <em className="dx-pl-tag">Now playing</em>}
                            {isNext && <em className="dx-pl-tag dx-pl-tag-next">Up next</em>}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
                {/* Last line of the unit: a quiet link to its practice questions */}
                {g.practice.length > 0 && (() => {
                  const solved = g.practice.filter((p) => progress.practice[p.id]).length;
                  return (
                    <li>
                      <Link to={`/dashboard/m/${mod.id}?tab=practice&subject=${subject.id}&unit=${g.key}`} className={`dx-pl-practice ${solved === g.practice.length ? 'is-done' : ''}`}>
                        <ListChecks size={14} />
                        <span>Practice {g.unit} questions</span>
                        <em>{solved}/{g.practice.length}</em>
                        <ArrowRight size={13} className="dx-pl-practice-go" />
                      </Link>
                    </li>
                  );
                })()}
              </ul>
              )}
            </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
};

export default DashboardPlayer;
