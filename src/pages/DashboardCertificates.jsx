import { useEffect, useState } from 'react';
import { Award, CircleCheck, Circle, Eye, Lock, Printer, X } from 'lucide-react';
import ModuleIcon from '../components/ModuleIcon';
import { allLectures, moduleUnlocked, subjectTests } from '../data/learnerModules';
import { SHOW_DEMO_PROGRESS } from '../utils/demoActivity';

/* ══════════════════════════════════════════════════════════════
   Certificates — /dashboard/certificates
   One certificate per module. It's earned once every lecture is
   watched and every module test has been attempted. Earned ones
   open full-size and print (or save as PDF from the print dialog).
   DEMO: with SHOW_DEMO_PROGRESS on, the first module shows as a
   sample earned certificate so the page isn't empty.
   ══════════════════════════════════════════════════════════════ */

const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const requirements = (mod, progress) => {
  const lectures = allLectures(mod);
  const watched = lectures.filter((l) => progress.watched[l.id]).length;
  const tests = [];
  const seen = new Set();
  mod.subjects.forEach((s) => subjectTests(mod, s).forEach((t) => {
    const id = `${mod.id}:${t.kind}:${t.perSubject ? s.id : 'module'}`;
    if (!seen.has(id)) { seen.add(id); tests.push(id); }
  }));
  const attempted = tests.filter((id) => progress.tests[id]?.count > 0).length;
  return {
    lectures: { done: watched, total: lectures.length },
    tests: { done: attempted, total: tests.length },
    earned: lectures.length > 0 && watched === lectures.length && attempted === tests.length
  };
};

const CertificateArt = ({ mod, name, date, serial }) => (
  <div className="dx-cert-art">
    <div className="dx-cert-art-top">
      <img src="/cipherschools-logo.png" alt="" />
      <span>CipherSchools</span>
    </div>
    <p className="dx-cert-kicker">Certificate of Completion</p>
    <p className="dx-cert-presented">This is presented to</p>
    <p className="dx-cert-name">{name}</p>
    <p className="dx-cert-for">for completing the <strong>{mod.title}</strong> module</p>
    <div className="dx-cert-foot">
      <span>{date ? fmt(date) : '—'}</span>
      <span className="dx-cert-seal"><Award size={20} /></span>
      <span>{serial}</span>
    </div>
  </div>
);

const DashboardCertificates = ({ ctx }) => {
  const name = ctx.preview ? 'Your name' : ctx.enrollment.learner?.name?.trim() || 'Learner';
  const mods = ctx.preview ? ctx.modules : ctx.modules.filter((m) => moduleUnlocked(m, ctx.planId, ctx.devTrack));
  const [open, setOpen] = useState(null);
  const [now] = useState(() => Date.now()); // fixed for this visit (sample earned date)

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const rows = mods.map((mod, i) => {
    const req = requirements(mod, ctx.progress);
    const sample = SHOW_DEMO_PROGRESS && !ctx.preview && i === 0 && !req.earned;
    const earned = !ctx.preview && (req.earned || sample);
    const date = earned ? new Date(now - 12 * 86400000) : null;
    const serial = `CS-${mod.id.slice(0, 3).toUpperCase()}-${String(1000 + i * 137).padStart(4, '0')}`;
    return { mod, req, earned, sample, date, serial };
  });
  const earnedCount = rows.filter((r) => r.earned).length;

  return (
    <div className="dx-certs">
      <header className="dx-page-head">
        <div>
          <p className="dx-muted">Finish a module to earn its certificate: watch every lecture and attempt every module test.</p>
        </div>
        <span className="dx-page-head-meta"><Award size={15} /> {earnedCount} of {rows.length} earned</span>
      </header>

      <div className="dx-cert-grid">
        {rows.map(({ mod, req, earned, sample, date, serial }) => {
          const pct = req.lectures.total ? Math.round((req.lectures.done / req.lectures.total) * 100) : 0;
          return (
            <article key={mod.id} className={`dx-card dx-cert-card ${earned ? 'is-earned' : ''}`}>
              <div className="dx-cert-thumb">
                <CertificateArt mod={mod} name={name} date={date} serial={serial} />
                {!earned && <span className="dx-cert-veil"><Lock size={16} /> {ctx.preview ? 'Earned with a plan' : `${pct}% complete`}</span>}
              </div>
              <div className="dx-cert-body">
                <div className="dx-cert-title">
                  <span className="dx-mc-icon"><ModuleIcon mod={mod} size={16} /></span>
                  <h3>{mod.title}</h3>
                </div>
                {earned ? (
                  <>
                    <p className="dx-cert-status ok"><CircleCheck size={14} /> Earned {fmt(date)}{sample && <span className="dx-cert-sample">Sample</span>}</p>
                    <div className="dx-cert-actions">
                      <button type="button" className="dx-btn dx-btn-primary dx-btn-sm" onClick={() => setOpen({ mod, date, serial })}><Eye size={14} /> View</button>
                    </div>
                  </>
                ) : (
                  <ul className="dx-cert-req">
                    <li className={req.lectures.done === req.lectures.total ? 'ok' : ''}>
                      {req.lectures.done === req.lectures.total ? <CircleCheck size={14} /> : <Circle size={14} />}
                      Watch all lectures <span>{req.lectures.done}/{req.lectures.total}</span>
                    </li>
                    <li className={req.tests.total && req.tests.done === req.tests.total ? 'ok' : ''}>
                      {req.tests.total && req.tests.done === req.tests.total ? <CircleCheck size={14} /> : <Circle size={14} />}
                      Attempt all module tests <span>{req.tests.done}/{req.tests.total}</span>
                    </li>
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {open && (
        <div className="dx-dialog-backdrop dx-cert-modal" onClick={() => setOpen(null)} data-free>
          <div className="dx-cert-view" role="dialog" aria-modal="true" aria-label={`${open.mod.title} certificate`} onClick={(e) => e.stopPropagation()}>
            <div className="dx-cert-view-bar">
              <strong>{open.mod.title}</strong>
              <div>
                <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={() => window.print()}><Printer size={14} /> Print / Save PDF</button>
                <button type="button" className="dx-icon-btn" onClick={() => setOpen(null)} aria-label="Close"><X size={18} /></button>
              </div>
            </div>
            <div className="dx-cert-print">
              <CertificateArt mod={open.mod} name={name} date={open.date} serial={open.serial} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCertificates;
