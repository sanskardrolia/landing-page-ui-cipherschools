import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, CircleCheck, CirclePlay, Clock, Infinity as InfinityIcon, PlayCircle, RotateCcw } from 'lucide-react';
import { courseLectures, findPurchase } from '../data/oneTimePurchases';
import { coursePillars, useCourseWatched } from '../utils/oneTimeProgress';
import PillarBar from '../components/PillarBar';
import DashboardPlayer from './DashboardPlayer';

/* ══════════════════════════════════════════════════════════════
   One-time purchased course — /dashboard/course/:courseId
   Overview of a course bought separately (outside the plan): progress,
   a Continue button and every unit with its lectures. Lectures play in
   the lecture player at /dashboard/course/:courseId/watch/:lectureId.
   ══════════════════════════════════════════════════════════════ */

const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const hours = (mins) => (mins >= 60 ? `${Math.round(mins / 6) / 10} h` : `${mins} min`);

const DashboardCourse = () => {
  const { courseId } = useParams();
  const course = findPurchase(courseId);
  const [watched] = useCourseWatched(course);
  const units = course ? course.subjects.flatMap((s) => s.units) : [];
  const firstOpen = units.find((u) => u.lectures.some((l) => !watched[l.id]))?.id || units[0]?.id;
  const [open, setOpen] = useState(() => new Set(firstOpen ? [firstOpen] : []));

  if (!course) return <Navigate to="/dashboard/content" replace />;

  const lectures = courseLectures(course);
  const done = lectures.filter((l) => watched[l.id]).length;
  const mins = lectures.reduce((a, l) => a + l.mins, 0);
  const next = lectures.find((l) => !watched[l.id]);
  const resume = next || lectures[0];
  const watchUrl = (id) => `/dashboard/course/${course.id}/watch/${id}`;
  const flip = (id) => setOpen((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  return (
    <div className="dx-oc">
      <Link to="/dashboard/content" className="dx-oc-back"><ArrowLeft size={15} /> Content</Link>

      <section className="dx-oc-hero">
        <div className="dx-oc-hero-text">
          <span className="dx-oc-kicker"><InfinityIcon size={13} /> One-time purchase · lifetime access</span>
          <h1>{course.title}</h1>
          <p>{course.about}</p>
          <small>{units.length} units · {lectures.length} lectures · <Clock size={12} /> {hours(mins)} · Purchased {fmtDate(course.purchased)}</small>
        </div>
        <div className="dx-oc-hero-side">
          <PillarBar {...coursePillars(course, watched)} />
          <Link to={watchUrl(resume.id)} className="dx-btn dx-btn-primary dx-oc-cta">
            {next ? <PlayCircle size={16} /> : <RotateCcw size={16} />}
            {next ? (done ? 'Continue' : 'Start course') : 'Watch again'}
          </Link>
          {next && <small className="dx-oc-next">Next: {next.title}</small>}
        </div>
      </section>

      <div className="dx-oc-units">
        {units.map((u, i) => {
          const isOpen = open.has(u.id);
          const uDone = u.lectures.filter((l) => watched[l.id]).length;
          return (
            <section key={u.id} className={`dx-lp-unit dx-oc-unit ${isOpen ? 'is-open' : ''}`}>
              <button type="button" className="dx-lp-unit-btn" onClick={() => flip(u.id)} aria-expanded={isOpen}>
                <span className="dx-lp-unit-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="dx-lp-unit-name">{u.title}</span>
                <span className="dx-lp-unit-meta">{uDone}/{u.lectures.length}</span>
                {uDone === u.lectures.length && <CircleCheck size={16} className="dx-done-icon" />}
                <ChevronDown size={15} className="dx-lp-chev" />
              </button>
              {isOpen && (
                <ul>
                  {u.lectures.map((l) => {
                    const isDone = !!watched[l.id];
                    const isNext = next?.id === l.id;
                    return (
                      <li key={l.id}>
                        <Link to={watchUrl(l.id)} className={`dx-lp-item ${isNext ? 'is-current' : ''}`}>
                          <span className="dx-lp-ico"><CirclePlay size={17} /></span>
                          <span className="dx-lp-text"><b>{l.title}</b><small>{isNext ? 'Up next' : 'Video lecture'} · {l.mins} min</small></span>
                          <span className={`dx-lp-check ${isDone ? 'is-done' : ''}`} aria-label={isDone ? 'Watched' : 'Not watched'}>{isDone && <CircleCheck size={18} />}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

/* /dashboard/course/:courseId/watch/:lectureId — the lecture player for a purchased course */
export const CourseWatch = ({ ctx }) => {
  const { courseId, lectureId } = useParams();
  const course = findPurchase(courseId);
  const [watched, setWatched] = useCourseWatched(course);
  if (!course) return <Navigate to="/dashboard/content" replace />;
  return <DashboardPlayer key={lectureId} ctx={ctx} course={{ mod: course, watched, setWatched }} />;
};

export default DashboardCourse;
