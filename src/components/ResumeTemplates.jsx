import { useLayoutEffect, useRef, useState } from 'react';
import { Mail, MapPin, Phone, Calendar, Globe } from 'lucide-react';
import {
  SAMPLE_RESUMES,
  toBullets,
  formatRange,
  yearRange,
  fullName,
  displayUrl,
  formatScore,
  skillList,
  visible,
} from '../utils/resumeData';
import './ResumeTemplates.css';

/*
 * The three CipherSchools resume templates (Beginner, Experienced, Modern).
 * Each renders a `data` object (see utils/resumeData.js) on an A4-ratio page
 * laid out at PAGE_W px and scaled by <ScaledPage> to fit its container.
 * `fit` pins the page to one A4 height (landing cards); otherwise the page
 * grows with the content (builder preview and print).
 */

export const PAGE_W = 600;
export const PAGE_H = 848;

const GithubIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M0 1.15C0 .52.52 0 1.18 0h13.64C15.48 0 16 .52 16 1.15v13.7c0 .63-.52 1.15-1.18 1.15H1.18C.52 16 0 15.48 0 14.85V1.15zm4.94 12.24V6.17H2.542v7.22h2.4zm-1.2-8.2c.84 0 1.36-.55 1.36-1.24-.01-.71-.52-1.24-1.34-1.24-.82 0-1.36.53-1.36 1.24 0 .69.52 1.24 1.33 1.24h.01zm4.91 8.2V9.36c0-.22.02-.43.08-.59.17-.43.57-.88 1.23-.88.87 0 1.21.66 1.21 1.63v3.87h2.4V9.25c0-2.22-1.18-3.25-2.76-3.25-1.27 0-1.84.7-2.16 1.19v.03h-.02l.02-.03V6.17h-2.4c.03.68 0 7.22 0 7.22h2.4z" />
  </svg>
);

/* Scales a fixed-width page to the width of its container */
export const ScaledPage = ({ children, className = '', fit = true }) => {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [contentH, setContentH] = useState(PAGE_H);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return undefined;
    const update = () => {
      setScale(wrap.clientWidth / PAGE_W);
      setContentH(Math.max(PAGE_H, inner.scrollHeight));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  const height = (fit ? PAGE_H : contentH) * scale;

  return (
    <div ref={wrapRef} className={`rt-scaled ${className}`} style={{ height }}>
      <div ref={innerRef} className="rt-scaled-inner" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
};

const pageClass = (name, fit) => `rt-page rt-${name} ${fit ? 'rt-page--fit' : 'rt-page--auto'}`;

const Bullets = ({ text, className }) => {
  const items = toBullets(text);
  if (items.length === 0) return null;
  return (
    <ul className={className}>
      {items.map((b, i) => <li key={i}>{b}</li>)}
    </ul>
  );
};

const NamePlaceholder = 'Your Name';

/* ───────────── 1. Beginner: centered academic layout, gray section bands ───────────── */
export const BeginnerResume = ({ data = SAMPLE_RESUMES.beginner, fit = true }) => {
  const p = data.personal;
  const v = visible(data);
  const contact = [
    p.email && { icon: <Mail />, text: p.email },
    p.location && { icon: <MapPin />, text: p.location },
    p.phone && { icon: <Phone />, text: p.phone },
    p.github && { icon: <GithubIcon />, text: displayUrl(p.github) },
    p.linkedin && { icon: <LinkedinIcon />, text: displayUrl(p.linkedin) },
    p.portfolio && { icon: <Globe />, text: displayUrl(p.portfolio) },
  ].filter(Boolean);

  return (
    <div className={pageClass('beginner', fit)} aria-hidden="true">
      <h1 className="rt-b-name">{fullName(p) || NamePlaceholder}</h1>
      {contact.length > 0 && (
        <p className="rt-b-contact">
          {contact.map((c, i) => <span key={i}>{c.icon}{c.text}</span>)}
        </p>
      )}

      {v.summary && (
        <>
          <h2 className="rt-b-h">Summary</h2>
          <p className="rt-b-summary">{v.summary}</p>
        </>
      )}

      {v.education.length > 0 && (
        <>
          <h2 className="rt-b-h">Academic Details</h2>
          <table className="rt-b-table">
            <thead>
              <tr><th>Degree</th><th>Institution</th><th>Field / Board</th><th>Year</th><th>Score</th></tr>
            </thead>
            <tbody>
              {v.education.map((e) => (
                <tr key={e.id}>
                  <td>{e.degree}</td>
                  <td><em>{e.institution}</em>{e.location && `, ${e.location}`}</td>
                  <td>{e.field}</td>
                  <td>{e.gradYear || e.startYear}</td>
                  <td>{e.score ? (e.scoreType === 'Percentage' ? `${e.score}%` : e.score) : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {v.skills.length > 0 && (
        <>
          <h2 className="rt-b-h">Technical Skills</h2>
          <ul className="rt-b-list">
            {v.skills.map((s) => (
              <li key={s.id}><strong>{s.category}:</strong> {skillList(s.skills)}</li>
            ))}
          </ul>
        </>
      )}

      {v.experience.length > 0 && (
        <>
          <h2 className="rt-b-h">Experience</h2>
          <ul className="rt-b-list">
            {v.experience.map((e) => (
              <li key={e.id}>
                <strong>{e.title}</strong>{e.employer && <> ({e.employer})</>}
                <p className="rt-b-guide">({[e.location, formatRange(e.startDate, e.endDate, e.current)].filter(Boolean).join(', ')})</p>
                <Bullets text={e.achievements} className="rt-b-sub" />
              </li>
            ))}
          </ul>
        </>
      )}

      {v.projects.length > 0 && (
        <>
          <h2 className="rt-b-h">Major Projects</h2>
          <ul className="rt-b-list">
            {v.projects.map((pr) => (
              <li key={pr.id}>
                <strong>{pr.title}</strong>
                {(pr.github || pr.link) && <> ({[pr.github, pr.link].filter(Boolean).map(displayUrl).join(' | ')})</>}
                {formatRange(pr.startDate, pr.endDate, pr.current) && (
                  <p className="rt-b-guide">({formatRange(pr.startDate, pr.endDate, pr.current)})</p>
                )}
                <Bullets text={pr.description} className="rt-b-sub" />
              </li>
            ))}
          </ul>
        </>
      )}

      {v.certifications.length > 0 && (
        <>
          <h2 className="rt-b-h">Certifications</h2>
          <ul className="rt-b-list">
            {v.certifications.map((c) => (
              <li key={c.id}>{c.title}{c.issuer && `, ${c.issuer}`}{c.link && <> ({displayUrl(c.link)})</>}</li>
            ))}
          </ul>
        </>
      )}

      {v.additional.map((a) => (
        <div key={a.id}>
          <h2 className="rt-b-h">{a.heading || 'Additional'}</h2>
          <Bullets text={a.description} className="rt-b-list" />
        </div>
      ))}
    </div>
  );
};

/* ───────────── 2. Experienced: dense LaTeX-style, small-caps ruled headings ───────────── */
export const ExperiencedResume = ({ data = SAMPLE_RESUMES.experienced, fit = true }) => {
  const p = data.personal;
  const v = visible(data);

  return (
    <div className={pageClass('experienced', fit)} aria-hidden="true">
      <header className="rt-e-head">
        <div>
          <h1 className="rt-e-name">{fullName(p) || NamePlaceholder}</h1>
          {p.linkedin && <p className="rt-e-link"><LinkedinIcon />{displayUrl(p.linkedin)}</p>}
          {p.github && <p className="rt-e-link"><GithubIcon />{displayUrl(p.github)}</p>}
          {p.portfolio && <p className="rt-e-link"><Globe />{displayUrl(p.portfolio)}</p>}
        </div>
        <div className="rt-e-head-right">
          {p.email && <p><Mail />{p.email}</p>}
          {p.phone && <p><Phone />{p.phone}</p>}
          {p.location && <p>{p.location}</p>}
        </div>
      </header>

      {v.summary && (
        <>
          <h2 className="rt-e-h">Summary</h2>
          <p className="rt-e-summary">{v.summary}</p>
        </>
      )}

      {v.education.length > 0 && (
        <>
          <h2 className="rt-e-h">Education</h2>
          {v.education.map((e) => (
            <div key={e.id} className="rt-e-entry">
              <p className="rt-e-row"><strong>{e.institution}</strong><span>{e.location}</span></p>
              <p className="rt-e-row rt-e-it">
                <span>{[e.degree, e.field].filter(Boolean).join(' - ')}{formatScore(e) && `; ${formatScore(e)}`}</span>
                <span>{yearRange(e.startYear, e.gradYear)}</span>
              </p>
            </div>
          ))}
        </>
      )}

      {v.skills.length > 0 && (
        <>
          <h2 className="rt-e-h">Skills Summary</h2>
          <ul className="rt-e-skills">
            {v.skills.map((s) => (
              <li key={s.id}><strong>{s.category}:</strong><span>{skillList(s.skills)}</span></li>
            ))}
          </ul>
        </>
      )}

      {v.experience.length > 0 && (
        <>
          <h2 className="rt-e-h">Experience</h2>
          {v.experience.map((e) => (
            <div key={e.id} className="rt-e-entry">
              <p className="rt-e-row"><strong>{e.employer}</strong><span>{e.location}</span></p>
              <p className="rt-e-row rt-e-it"><span>{e.title}</span><span>{formatRange(e.startDate, e.endDate, e.current)}</span></p>
              <Bullets text={e.achievements} className="rt-e-sub" />
            </div>
          ))}
        </>
      )}

      {v.projects.length > 0 && (
        <>
          <h2 className="rt-e-h">Projects</h2>
          {v.projects.map((pr) => (
            <div key={pr.id} className="rt-e-entry">
              <p className="rt-e-row">
                <span><strong>{pr.title}</strong>{(pr.github || pr.link) && <> | {[pr.github, pr.link].filter(Boolean).map(displayUrl).join(' | ')}</>}</span>
                <span className="rt-e-it">{formatRange(pr.startDate, pr.endDate, pr.current)}</span>
              </p>
              <Bullets text={pr.description} className="rt-e-sub" />
            </div>
          ))}
        </>
      )}

      {v.certifications.length > 0 && (
        <>
          <h2 className="rt-e-h">Certifications</h2>
          <ul className="rt-e-plain">
            {v.certifications.map((c) => (
              <li key={c.id}><strong>{c.title}</strong>{c.issuer && ` - ${c.issuer}`}{c.link && <> ({displayUrl(c.link)})</>}</li>
            ))}
          </ul>
        </>
      )}

      {v.additional.map((a) => (
        <div key={a.id}>
          <h2 className="rt-e-h">{a.heading || 'Additional'}</h2>
          <Bullets text={a.description} className="rt-e-plain" />
        </div>
      ))}
    </div>
  );
};

/* ───────────── 3. Modern: thin display name, two columns, ruled headings ───────────── */
const ModernMeta = ({ date, place }) => (
  (date || place) ? (
    <p className="rt-m-meta">
      {date && <span><Calendar />{date}</span>}
      {place && <span><MapPin />{place}</span>}
    </p>
  ) : null
);

const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const ModernResume = ({ data = SAMPLE_RESUMES.modern, fit = true }) => {
  const p = data.personal;
  const v = visible(data);
  const links = [
    p.github && { icon: <GithubIcon />, label: 'GitHub', text: displayUrl(p.github) },
    p.linkedin && { icon: <LinkedinIcon />, label: 'LinkedIn', text: displayUrl(p.linkedin) },
    p.portfolio && { icon: <Globe />, label: 'Portfolio', text: displayUrl(p.portfolio) },
  ].filter(Boolean);

  return (
    <div className={pageClass('modern', fit)} aria-hidden="true">
      <p className="rt-m-updated">Last Updated on {today()}</p>
      <h1 className="rt-m-name">{fullName(p) || NamePlaceholder}</h1>
      <p className="rt-m-contact">
        {p.phone && <span><Phone />{p.phone}</span>}
        {p.email && <span><Mail />{p.email}</span>}
        {p.location && <span><MapPin />{p.location}</span>}
      </p>

      {v.summary && <p className="rt-m-summary">{v.summary}</p>}

      <div className="rt-m-cols">
        <div className="rt-m-left">
          {v.education.length > 0 && (
            <>
              <h2 className="rt-m-h">Education</h2>
              {v.education.map((e) => (
                <div key={e.id}>
                  <p className="rt-m-title">{e.institution}</p>
                  <p className="rt-m-org">{[e.degree, e.field].filter(Boolean).join(' in ')}</p>
                  <ModernMeta date={yearRange(e.startYear, e.gradYear)} place={e.location} />
                  {formatScore(e) && <p className="rt-m-p">{formatScore(e)}</p>}
                </div>
              ))}
            </>
          )}

          {links.length > 0 && (
            <>
              <h2 className="rt-m-h">Links</h2>
              {links.map((l) => (
                <p key={l.label} className="rt-m-link">{l.icon}{l.label} <strong>{l.text}</strong></p>
              ))}
            </>
          )}

          {v.skills.length > 0 && (
            <>
              <h2 className="rt-m-h">Skills</h2>
              {v.skills.map((s) => (
                <div key={s.id}>
                  <p className="rt-m-title">{s.category}</p>
                  <p className="rt-m-p">{s.skills.split(',').map((x) => x.trim()).filter(Boolean).join(' • ')}</p>
                </div>
              ))}
            </>
          )}

          {v.certifications.length > 0 && (
            <>
              <h2 className="rt-m-h">Certifications</h2>
              {v.certifications.map((c) => (
                <div key={c.id}>
                  <p className="rt-m-title">{c.title}</p>
                  {c.issuer && <p className="rt-m-org">{c.issuer}</p>}
                  {c.link && <p className="rt-m-p">{displayUrl(c.link)}</p>}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="rt-m-right">
          {v.experience.length > 0 && (
            <>
              <h2 className="rt-m-h">Experience</h2>
              {v.experience.map((e) => (
                <div key={e.id}>
                  <p className="rt-m-title">{e.title}</p>
                  <p className="rt-m-org">{e.employer}</p>
                  <ModernMeta date={formatRange(e.startDate, e.endDate, e.current)} place={e.location} />
                  <Bullets text={e.achievements} className="rt-m-list" />
                </div>
              ))}
            </>
          )}

          {v.projects.length > 0 && (
            <>
              <h2 className="rt-m-h">Projects</h2>
              {v.projects.map((pr) => (
                <div key={pr.id}>
                  <p className="rt-m-title">{pr.title}</p>
                  {(pr.github || pr.link) && (
                    <p className="rt-m-org">{[pr.github, pr.link].filter(Boolean).map(displayUrl).join(' | ')}</p>
                  )}
                  <ModernMeta date={formatRange(pr.startDate, pr.endDate, pr.current)} />
                  <Bullets text={pr.description} className="rt-m-list" />
                </div>
              ))}
            </>
          )}

          {v.additional.map((a) => (
            <div key={a.id}>
              <h2 className="rt-m-h">{a.heading || 'Additional'}</h2>
              <Bullets text={a.description} className="rt-m-list" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
