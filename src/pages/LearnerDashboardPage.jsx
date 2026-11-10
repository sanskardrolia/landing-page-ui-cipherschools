import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Award, BookOpen, ChevronDown, ChevronUp, ClipboardList, Code2,
  FileText, FolderKanban, GraduationCap, House, LifeBuoy, Megaphone, MessageCircle,
  PlayCircle, UserRound
} from 'lucide-react';
import { PLANS_12M_DATA, FeatureTree } from './PremiumPage';
import { getEnrollment } from '../utils/enrollment';
import './PremiumPage.css';
import './LearnerDashboardPage.css';

/* Learner dashboard — only rendered once a (demo) payment has created an enrollment. */

const NAV = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'syllabus', label: 'Syllabus', Icon: FileText },
  { id: 'lectures', label: 'Lectures', Icon: PlayCircle },
  { id: 'tests', label: 'Tests', Icon: ClipboardList },
  { id: 'projects', label: 'Projects', Icon: FolderKanban },
  { id: 'resources', label: 'Resources', Icon: BookOpen },
  { id: 'updates', label: 'Updates', Icon: Megaphone },
  { id: 'support', label: 'Support', Icon: LifeBuoy },
  { id: 'compiler', label: 'Compiler', Icon: Code2 }
];

/* Placeholder totals per plan until real progress data exists */
const PLAN_TOTALS = {
  starter: { videos: 180, tests: 12, projects: 2, mentors: 'CipherSchools Mentors' },
  plus: { videos: 420, tests: 30, projects: 6, mentors: 'CipherSchools Mentors, Industry Experts' }
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const LearnerDashboardPage = () => {
  const navigate = useNavigate();
  const [enrollment] = useState(getEnrollment);
  const [tab, setTab] = useState('home');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [tab]);

  const plan = enrollment && PLANS_12M_DATA.find((p) => p.id === enrollment.planId);
  if (!enrollment || !plan) return <Navigate to="/premium" replace />;

  const totals = PLAN_TOTALS[plan.id] || PLAN_TOTALS.starter;
  const firstName = (enrollment.learner?.name || 'there').trim().split(' ')[0];
  const year = new Date(enrollment.paidAt).getFullYear();
  const courseTitle = `CipherSchools ${plan.name} — Placement Track ${year}`;
  // Not history-back: the previous entry is usually the payment page, which shouldn't be revisited
  const goBack = () => navigate('/courses');

  const stats = [
    { label: 'Total Videos Watched', done: 0, total: totals.videos, cta: 'Watch Now', to: 'lectures' },
    { label: 'Total Tests Attempted', done: 0, total: totals.tests, cta: 'Take Test', to: 'tests' },
    { label: 'Total Projects Completed', done: 0, total: totals.projects, cta: 'View Projects', to: 'projects' }
  ];

  return (
    <div className="ld-shell">
      {/* ── Course sidebar ── */}
      <nav className="ld-nav" aria-label="Course navigation">
        <div className="ld-nav-main">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className={`ld-nav-item ${tab === id ? 'active' : ''}`}
              onClick={() => (id === 'compiler' ? navigate('/online-compiler') : setTab(id))}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <button type="button" className="ld-nav-item ld-nav-bottom" onClick={() => setTab('batches')}>
          <GraduationCap size={20} />
          <span>Batches</span>
        </button>
      </nav>

      <div className="ld-main">
        <div className="ld-content">
          <header className="ld-header">
            <h1>Hey {firstName},</h1>
            <button type="button" className="ld-back" onClick={goBack}>
              <ArrowLeft size={16} /> Back
            </button>
          </header>

          {tab === 'home' && (
            <>
              <h2 className="ld-section-title">Important</h2>
              <div className="ld-important">
                <button type="button" className="ld-chip ld-chip-whatsapp">
                  <MessageCircle size={16} /> Join WhatsApp Group
                </button>
                <button type="button" className="ld-chip"><UserRound size={16} /> Complete Profile</button>
                <button type="button" className="ld-chip" disabled title="Unlocks when you complete the course">
                  <Award size={16} /> Get Certificate
                </button>
              </div>

              <article className="ld-course-card">
                <h3>{courseTitle}</h3>
                <p className="ld-greet">Hey there,</p>
                <div className={`ld-desc ${expanded ? 'open' : ''}`}>
                  <p>
                    We're excited to have you on the {plan.name} plan, designed to take you from fundamentals to
                    placement-ready in a practical and flexible way.
                  </p>
                  <p>
                    You get recorded lectures for every module, AI-assisted practice tests and mock interviews,
                    all on the platform at your own pace. Start with the Syllabus to see your path, then pick up
                    the first lecture whenever you're ready.
                  </p>
                  <p>
                    Join the WhatsApp group for announcements and doubt support, and complete your profile so we
                    can personalise your roadmap.
                  </p>
                </div>
                <button type="button" className="ld-readmore" onClick={() => setExpanded((v) => !v)}>
                  {expanded ? 'Read less' : 'Read more'} {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <dl className="ld-meta">
                  <div><dt>Start Date</dt><dd>{formatDate(enrollment.paidAt)}</dd></div>
                  <div><dt>Duration</dt><dd>{plan.durationLabel}</dd></div>
                  <div><dt>Mentors</dt><dd>{totals.mentors}</dd></div>
                </dl>
              </article>
            </>
          )}

          {tab === 'syllabus' && (
            <section className="ld-panel">
              <h2 className="ld-section-title">Syllabus · {plan.name}</h2>
              <div className="pricing-card-surface ld-syllabus">
                {plan.inheritedLabel && (
                  <p className="ld-syllabus-note">
                    Includes everything in Core, plus the modules below.
                  </p>
                )}
                <FeatureTree nodes={plan.features} />
              </div>
            </section>
          )}

          {!['home', 'syllabus'].includes(tab) && (
            <section className="ld-panel ld-empty">
              <h2 className="ld-section-title">{tab === 'batches' ? 'Batches' : NAV.find((n) => n.id === tab)?.label}</h2>
              <p>Nothing here yet. This section unlocks as your course content goes live.</p>
              <button type="button" className="ld-chip" onClick={() => setTab('home')}>
                <ArrowLeft size={15} /> Back to Home
              </button>
            </section>
          )}
        </div>

        {/* ── Right rail ── */}
        <aside className="ld-rail">
          <div className={`ld-banner ld-banner-${plan.id}`}>
            <span className="ld-banner-brand">CipherSchools</span>
            <span className="ld-banner-pill">Recorded Lectures • Tests • Online</span>
            <strong className="ld-banner-title">
              {plan.name} <em>Plan</em>
            </strong>
            <span className="ld-banner-sub">Placement Track {year}</span>
          </div>

          {stats.map((s) => (
            <div key={s.label} className="ld-stat">
              <span className="ld-stat-label">{s.label}</span>
              <span className="ld-stat-value">{s.done}/{s.total}</span>
              <button type="button" className="ld-stat-cta" onClick={() => setTab(s.to)}>
                {s.cta} <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default LearnerDashboardPage;
