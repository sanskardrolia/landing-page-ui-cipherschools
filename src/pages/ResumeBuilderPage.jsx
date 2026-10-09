import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Award,
  Briefcase,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FolderGit2,
  GraduationCap,
  ListPlus,
  Plus,
  Trash2,
  User,
  Wrench,
  X,
} from 'lucide-react';
import { ScaledPage, BeginnerResume, ExperiencedResume, ModernResume } from '../components/ResumeTemplates';
import {
  TEMPLATE_IDS,
  TEMPLATE_NAMES,
  SCORE_TYPES,
  emptyResume,
  emptyEducation,
  emptyExperience,
  emptySkill,
  emptyProject,
  emptyCertification,
  emptyAdditional,
  fullName,
  formatRange,
  yearRange,
} from '../utils/resumeData';
import './ResumeBuilderPage.css';

const STORAGE_KEY = 'cs-resume-builder:v1';

const TEMPLATE_COMPONENTS = {
  beginner: BeginnerResume,
  experienced: ExperiencedResume,
  modern: ModernResume,
};

const SECTIONS = [
  { key: 'personal', label: 'Personal info', icon: User, hint: 'How recruiters will reach you.' },
  { key: 'education', label: 'Education', icon: GraduationCap, hint: 'Most recent first.' },
  { key: 'experience', label: 'Experience', icon: Briefcase, hint: 'Jobs and internships, most recent first.' },
  { key: 'skills', label: 'Skills', icon: Wrench, hint: 'Separate skills with commas.' },
  { key: 'projects', label: 'Projects', icon: FolderGit2, hint: 'What you built and what it achieved.' },
  { key: 'certifications', label: 'Certifications', icon: Award, hint: 'Courses and certificates worth showing.' },
  { key: 'additional', label: 'Additional', icon: ListPlus, hint: 'Any other section, with your own heading.' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR + 6 - 1980 }, (_, i) => String(THIS_YEAR + 5 - i));

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.personal ? { ...emptyResume(), ...parsed } : null;
  } catch {
    return null;
  }
};

/* ─────────────────────────────── Form primitives ─────────────────────────────── */

const Field = ({ label, hint, full, children }) => (
  <label className={`rb-field ${full ? 'rb-field--full' : ''}`}>
    <span className="rb-label">{label}</span>
    {children}
    {hint && <span className="rb-hint">{hint}</span>}
  </label>
);

const TextInput = ({ value, onChange, ...rest }) => (
  <input className="rb-input" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
);

// Month + year as two native selects (works everywhere, incl. desktop Safari)
const MonthYear = ({ value, onChange, disabled, label }) => {
  const [y = '', m = ''] = (value || '').split('-');
  const set = (ny, nm) => onChange(ny || nm ? `${ny}-${nm}` : '');
  return (
    <div className="rb-split" role="group" aria-label={label}>
      <select className="rb-input" value={m} disabled={disabled} aria-label={`${label} month`}
        onChange={(e) => set(y || String(THIS_YEAR), e.target.value)}>
        <option value="">Month</option>
        {MONTHS.map((mo, i) => <option key={mo} value={String(i + 1).padStart(2, '0')}>{mo}</option>)}
      </select>
      <select className="rb-input" value={y} disabled={disabled} aria-label={`${label} year`}
        onChange={(e) => set(e.target.value, m)}>
        <option value="">Year</option>
        {YEARS.map((yr) => <option key={yr} value={yr}>{yr}</option>)}
      </select>
    </div>
  );
};

const YearSelect = ({ value, onChange, label }) => (
  <select className="rb-input" value={value} aria-label={label} onChange={(e) => onChange(e.target.value)}>
    <option value="">Year</option>
    {YEARS.map((yr) => <option key={yr} value={yr}>{yr}</option>)}
  </select>
);

/* Textarea where Enter continues a "- " bullet; Enter on an empty bullet ends the list */
const BulletArea = ({ value, onChange, placeholder, rows = 5 }) => {
  const ref = useRef(null);
  const caret = useRef(null);

  useEffect(() => {
    if (caret.current !== null && ref.current) {
      ref.current.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  });

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    const el = e.currentTarget;
    const { selectionStart: start, selectionEnd: end } = el;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const line = value.slice(lineStart, start);
    if (!/^\s*-/.test(line)) return;
    e.preventDefault();
    if (/^\s*-\s*$/.test(line)) {
      onChange(value.slice(0, lineStart) + value.slice(end));
      caret.current = lineStart;
      return;
    }
    const insert = '\n- ';
    onChange(value.slice(0, start) + insert + value.slice(end));
    caret.current = start + insert.length;
  };

  return (
    <textarea
      ref={ref}
      className="rb-input rb-textarea"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      onFocus={() => { if (!value) onChange('- '); }}
      onBlur={() => { if (value.trim() === '-') onChange(''); }}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const Checkbox = ({ checked, onChange, children }) => (
  <label className="rb-check">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="rb-check-box" aria-hidden="true"><Check size={12} strokeWidth={3} /></span>
    <span>{children}</span>
  </label>
);

/* Collapsible card for one entry in a repeatable section */
const ItemCard = ({ title, subtitle, index, total, open, onToggle, onMove, onRemove, children }) => (
  <div className={`rb-item ${open ? 'is-open' : ''}`}>
    <div className="rb-item-head">
      <button type="button" className="rb-item-toggle" onClick={onToggle} aria-expanded={open}>
        <span className="rb-item-text">
          <strong>{title}</strong>
          {subtitle && <span>{subtitle}</span>}
        </span>
        <ChevronDown size={16} className="rb-item-chevron" />
      </button>
      <div className="rb-item-actions">
        <button type="button" className="rb-icon-btn" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up">
          <ArrowUp size={15} />
        </button>
        <button type="button" className="rb-icon-btn" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Move down">
          <ArrowDown size={15} />
        </button>
        <button type="button" className="rb-icon-btn rb-icon-btn--danger" onClick={onRemove} aria-label="Remove">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
    {open && <div className="rb-item-body">{children}</div>}
  </div>
);

const AddButton = ({ onClick, children }) => (
  <button type="button" className="rb-add" onClick={onClick}>
    <Plus size={16} />
    <span>{children}</span>
  </button>
);

const EmptyNote = ({ children }) => <p className="rb-empty">{children}</p>;

/* ─────────────────────────────── Page ─────────────────────────────── */

const ResumeBuilderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const templateParam = searchParams.get('template');
  const template = TEMPLATE_IDS.includes(templateParam) ? templateParam : 'beginner';

  const [resume, setResume] = useState(() => loadDraft() || emptyResume());
  const [active, setActive] = useState(0);
  const [openIds, setOpenIds] = useState(() => new Set([resume.education[0]?.id].filter(Boolean)));
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const formTopRef = useRef(null);

  const Template = TEMPLATE_COMPONENTS[template];
  const section = SECTIONS[active];

  // Autosave the draft
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
        setSavedAt(new Date());
      } catch {
        /* storage unavailable: keep working in memory */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [resume]);

  // Lock page scroll behind the mobile preview
  useEffect(() => {
    document.body.style.overflow = previewOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [previewOpen]);

  useEffect(() => {
    document.title = 'Resume Builder | CipherSchools';
  }, []);

  // Sit below the site's fixed navbar, whose height changes on scroll
  const rootRef = useRef(null);
  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    const root = rootRef.current;
    if (!navbar || !root) return undefined;
    const update = () => root.style.setProperty('--rb-nav-h', `${navbar.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(navbar);
    return () => ro.disconnect();
  }, []);

  /* ── state helpers ── */
  const setPersonal = (field, value) =>
    setResume((r) => ({ ...r, personal: { ...r.personal, [field]: value } }));

  const updateItem = (key, id, patch) =>
    setResume((r) => ({ ...r, [key]: r[key].map((it) => (it.id === id ? { ...it, ...patch } : it)) }));

  const addItem = (key, factory) => {
    const item = factory();
    setResume((r) => ({ ...r, [key]: [...r[key], item] }));
    setOpenIds((s) => new Set(s).add(item.id));
  };

  const removeItem = (key, id) =>
    setResume((r) => ({ ...r, [key]: r[key].filter((it) => it.id !== id) }));

  const moveItem = (key, id, dir) =>
    setResume((r) => {
      const list = [...r[key]];
      const i = list.findIndex((it) => it.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return r;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...r, [key]: list };
    });

  const toggleOpen = (id) =>
    setOpenIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const cardProps = (key, item, index, list) => ({
    index,
    total: list.length,
    open: openIds.has(item.id),
    onToggle: () => toggleOpen(item.id),
    onMove: (dir) => moveItem(key, item.id, dir),
    onRemove: () => removeItem(key, item.id),
  });

  const setTemplate = (id) => setSearchParams({ template: id }, { replace: true });

  const goTo = (i) => {
    setActive(i);
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDownload = () => {
    const prev = document.title;
    const name = fullName(resume.personal);
    document.title = name ? `${name} - Resume` : 'Resume';
    window.print();
    document.title = prev;
  };

  const resetDraft = () => {
    if (!window.confirm('Clear everything and start a new resume?')) return;
    const fresh = emptyResume();
    setResume(fresh);
    setOpenIds(new Set([fresh.education[0].id]));
    setActive(0);
  };

  const done = useMemo(() => ({
    personal: Boolean(resume.personal.firstName && resume.personal.email),
    education: resume.education.some((e) => e.institution),
    experience: resume.experience.some((e) => e.employer || e.title),
    skills: resume.skills.some((s) => s.skills.trim()),
    projects: resume.projects.some((p) => p.title),
    certifications: resume.certifications.some((c) => c.title),
    additional: resume.additional.some((a) => a.heading || a.description),
  }), [resume]);

  const doneCount = Object.values(done).filter(Boolean).length;

  /* ── section forms ── */
  const renderSection = () => {
    switch (section.key) {
      case 'personal': {
        const p = resume.personal;
        return (
          <div className="rb-grid">
            <Field label="First name"><TextInput value={p.firstName} onChange={(v) => setPersonal('firstName', v)} autoComplete="given-name" placeholder="Anurag" /></Field>
            <Field label="Last name"><TextInput value={p.lastName} onChange={(v) => setPersonal('lastName', v)} autoComplete="family-name" placeholder="Mishra" /></Field>
            <Field label="Email"><TextInput type="email" value={p.email} onChange={(v) => setPersonal('email', v)} autoComplete="email" inputMode="email" placeholder="you@email.com" /></Field>
            <Field label="Phone number"><TextInput type="tel" value={p.phone} onChange={(v) => setPersonal('phone', v)} autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" /></Field>
            <Field label="Location" full><TextInput value={p.location} onChange={(v) => setPersonal('location', v)} autoComplete="address-level2" placeholder="City, State" /></Field>
            <Field label="GitHub"><TextInput type="url" value={p.github} onChange={(v) => setPersonal('github', v)} inputMode="url" placeholder="github.com/username" /></Field>
            <Field label="LinkedIn"><TextInput type="url" value={p.linkedin} onChange={(v) => setPersonal('linkedin', v)} inputMode="url" placeholder="linkedin.com/in/username" /></Field>
            <Field label="Portfolio" full><TextInput type="url" value={p.portfolio} onChange={(v) => setPersonal('portfolio', v)} inputMode="url" placeholder="yourname.dev" /></Field>
          </div>
        );
      }

      case 'education':
        return (
          <>
            {resume.education.length === 0 && <EmptyNote>No education added yet.</EmptyNote>}
            {resume.education.map((e, i, list) => (
              <ItemCard key={e.id} title={e.institution || 'New education'}
                subtitle={[e.degree, yearRange(e.startYear, e.gradYear)].filter(Boolean).join(' · ')}
                {...cardProps('education', e, i, list)}>
                <div className="rb-grid">
                  <Field label="Institution name" full><TextInput value={e.institution} onChange={(v) => updateItem('education', e.id, { institution: v })} placeholder="Lovely Professional University" /></Field>
                  <Field label="Degree type"><TextInput value={e.degree} onChange={(v) => updateItem('education', e.id, { degree: v })} placeholder="B.Tech, Class XII" /></Field>
                  <Field label="Field of study / Board"><TextInput value={e.field} onChange={(v) => updateItem('education', e.id, { field: v })} placeholder="Computer Science, CBSE" /></Field>
                  <Field label="Location" full><TextInput value={e.location} onChange={(v) => updateItem('education', e.id, { location: v })} placeholder="City, State" /></Field>
                  <Field label="Start year"><YearSelect label="Start year" value={e.startYear} onChange={(v) => updateItem('education', e.id, { startYear: v })} /></Field>
                  <Field label="Graduation year"><YearSelect label="Graduation year" value={e.gradYear} onChange={(v) => updateItem('education', e.id, { gradYear: v })} /></Field>
                  <Field label="Score type">
                    <div className="rb-seg" role="radiogroup" aria-label="Score type">
                      {SCORE_TYPES.map((t) => (
                        <button key={t} type="button" role="radio" aria-checked={e.scoreType === t}
                          className={e.scoreType === t ? 'is-active' : ''}
                          onClick={() => updateItem('education', e.id, { scoreType: t })}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Score">
                    <TextInput value={e.score} inputMode="decimal" onChange={(v) => updateItem('education', e.id, { score: v })}
                      placeholder={e.scoreType === 'Percentage' ? '91.4' : '8.6'} />
                  </Field>
                </div>
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem('education', emptyEducation)}>Add education</AddButton>
          </>
        );

      case 'experience':
        return (
          <>
            {resume.experience.length === 0 && <EmptyNote>No experience yet? That's fine. Projects can carry your resume.</EmptyNote>}
            {resume.experience.map((e, i, list) => (
              <ItemCard key={e.id} title={e.title || e.employer || 'New experience'}
                subtitle={[e.employer && e.title ? e.employer : '', formatRange(e.startDate, e.endDate, e.current)].filter(Boolean).join(' · ')}
                {...cardProps('experience', e, i, list)}>
                <div className="rb-grid">
                  <Field label="Employer"><TextInput value={e.employer} onChange={(v) => updateItem('experience', e.id, { employer: v })} placeholder="Razorpay" /></Field>
                  <Field label="Job title"><TextInput value={e.title} onChange={(v) => updateItem('experience', e.id, { title: v })} placeholder="Software Engineer Intern" /></Field>
                  <Field label="Start date"><MonthYear label="Start date" value={e.startDate} onChange={(v) => updateItem('experience', e.id, { startDate: v })} /></Field>
                  <Field label="End date"><MonthYear label="End date" value={e.endDate} disabled={e.current} onChange={(v) => updateItem('experience', e.id, { endDate: v })} /></Field>
                  <div className="rb-field rb-field--full">
                    <Checkbox checked={e.current} onChange={(v) => updateItem('experience', e.id, { current: v, endDate: v ? '' : e.endDate })}>
                      I'm currently working here
                    </Checkbox>
                  </div>
                  <Field label="Location" full><TextInput value={e.location} onChange={(v) => updateItem('experience', e.id, { location: v })} placeholder="Bengaluru or Remote" /></Field>
                  <Field label="Key achievements" full hint='Start each point with "-" on a new line. Lead with a number where you can.'>
                    <BulletArea value={e.achievements} onChange={(v) => updateItem('experience', e.id, { achievements: v })}
                      placeholder={'- Cut API latency by 38% with Redis caching\n- Shipped a dashboard used by 12,000+ merchants'} />
                  </Field>
                </div>
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem('experience', emptyExperience)}>Add experience</AddButton>
          </>
        );

      case 'skills':
        return (
          <>
            <div className="rb-skills">
              {resume.skills.map((s) => (
                <div key={s.id} className="rb-skill-row">
                  <Field label="Category">
                    <TextInput value={s.category} onChange={(v) => updateItem('skills', s.id, { category: v })} placeholder="e.g. Soft Skills" />
                  </Field>
                  <Field label="Skills">
                    <TextInput value={s.skills} onChange={(v) => updateItem('skills', s.id, { skills: v })} placeholder="React, Node.js, Express" />
                  </Field>
                  <button type="button" className="rb-icon-btn rb-icon-btn--danger rb-skill-remove" onClick={() => removeItem('skills', s.id)} aria-label={`Remove ${s.category || 'category'}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <AddButton onClick={() => addItem('skills', () => emptySkill(''))}>Add skill category</AddButton>
          </>
        );

      case 'projects':
        return (
          <>
            {resume.projects.length === 0 && <EmptyNote>Add 2–3 projects that show what you can build.</EmptyNote>}
            {resume.projects.map((p, i, list) => (
              <ItemCard key={p.id} title={p.title || 'New project'} subtitle={formatRange(p.startDate, p.endDate, p.current)}
                {...cardProps('projects', p, i, list)}>
                <div className="rb-grid">
                  <Field label="Project title" full><TextInput value={p.title} onChange={(v) => updateItem('projects', p.id, { title: v })} placeholder="Campus Food Ordering App" /></Field>
                  <Field label="GitHub link"><TextInput type="url" inputMode="url" value={p.github} onChange={(v) => updateItem('projects', p.id, { github: v })} placeholder="github.com/you/project" /></Field>
                  <Field label="Project link"><TextInput type="url" inputMode="url" value={p.link} onChange={(v) => updateItem('projects', p.id, { link: v })} placeholder="project.vercel.app" /></Field>
                  <Field label="Start date"><MonthYear label="Start date" value={p.startDate} onChange={(v) => updateItem('projects', p.id, { startDate: v })} /></Field>
                  <Field label="End date"><MonthYear label="End date" value={p.endDate} disabled={p.current} onChange={(v) => updateItem('projects', p.id, { endDate: v })} /></Field>
                  <div className="rb-field rb-field--full">
                    <Checkbox checked={p.current} onChange={(v) => updateItem('projects', p.id, { current: v, endDate: v ? '' : p.endDate })}>
                      I'm working on this
                    </Checkbox>
                  </div>
                  <Field label="Project description" full hint='Start each point with "-" on a new line.'>
                    <BulletArea value={p.description} onChange={(v) => updateItem('projects', p.id, { description: v })}
                      placeholder={'- Built a React + Firebase app for 4 campus canteens\n- Reduced queue time from 14 to 5 minutes'} />
                  </Field>
                </div>
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem('projects', emptyProject)}>Add project</AddButton>
          </>
        );

      case 'certifications':
        return (
          <>
            {resume.certifications.length === 0 && <EmptyNote>No certifications added yet.</EmptyNote>}
            {resume.certifications.map((c, i, list) => (
              <ItemCard key={c.id} title={c.title || 'New certification'} subtitle={c.issuer}
                {...cardProps('certifications', c, i, list)}>
                <div className="rb-grid">
                  <Field label="Title" full><TextInput value={c.title} onChange={(v) => updateItem('certifications', c.id, { title: v })} placeholder="Full Stack Web Development" /></Field>
                  <Field label="Issued by"><TextInput value={c.issuer} onChange={(v) => updateItem('certifications', c.id, { issuer: v })} placeholder="CipherSchools" /></Field>
                  <Field label="Link"><TextInput type="url" inputMode="url" value={c.link} onChange={(v) => updateItem('certifications', c.id, { link: v })} placeholder="Certificate URL" /></Field>
                </div>
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem('certifications', emptyCertification)}>Add certification</AddButton>
          </>
        );

      case 'additional':
        return (
          <>
            {resume.additional.length === 0 && <EmptyNote>Add sections like Achievements, Volunteering or Hobbies.</EmptyNote>}
            {resume.additional.map((a, i, list) => (
              <ItemCard key={a.id} title={a.heading || 'New section'} {...cardProps('additional', a, i, list)}>
                <div className="rb-grid">
                  <Field label="Heading" full><TextInput value={a.heading} onChange={(v) => updateItem('additional', a.id, { heading: v })} placeholder="Achievements" /></Field>
                  <Field label="Description" full hint='Start each point with "-" on a new line.'>
                    <BulletArea value={a.description} onChange={(v) => updateItem('additional', a.id, { description: v })}
                      placeholder={'- Winner, Smart India Hackathon 2024\n- 5-star coder on CodeChef'} />
                  </Field>
                </div>
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem('additional', emptyAdditional)}>Add section</AddButton>
          </>
        );

      default:
        return null;
    }
  };

  const templateSwitcher = (
    <div className="rb-seg rb-seg--templates" role="radiogroup" aria-label="Template">
      {TEMPLATE_IDS.map((id) => (
        <button key={id} type="button" role="radio" aria-checked={template === id}
          className={template === id ? 'is-active' : ''} onClick={() => setTemplate(id)}>
          {TEMPLATE_NAMES[id]}
        </button>
      ))}
    </div>
  );

  return (
    <div className="rb-root" ref={rootRef}>
      {/* ── Top bar ── */}
      <header className="rb-top">
        <div className="rb-top-left">
          <Link to="/resume" className="rb-back" aria-label="Back to Resume Builder home">
            <ArrowLeft size={18} />
          </Link>
          <div className="rb-top-title">
            <strong>Resume Builder</strong>
            <span>{savedAt ? 'Saved on this device' : 'Not saved yet'}</span>
          </div>
        </div>
        <div className="rb-top-center">{templateSwitcher}</div>
        <div className="rb-top-right">
          <button type="button" className="rb-btn rb-btn--primary" onClick={handleDownload}>
            <Download size={16} />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      <div className="rb-main">
        {/* ── Section nav ── */}
        <nav className="rb-nav" aria-label="Resume sections">
          {/* Wide desktop only: replaces the top toolbar */}
          <div className="rb-side-head">
            <Link to="/resume" className="rb-back" aria-label="Back to Resume Builder home">
              <ArrowLeft size={18} />
            </Link>
            <div className="rb-top-title">
              <strong>Resume Builder</strong>
              <span>{savedAt ? 'Saved on this device' : 'Not saved yet'}</span>
            </div>
          </div>

          <label className="rb-side-block">
            <span className="rb-side-label">Template</span>
            <select className="rb-input rb-side-select" value={template} onChange={(e) => setTemplate(e.target.value)}>
              {TEMPLATE_IDS.map((id) => (
                <option key={id} value={id}>{TEMPLATE_NAMES[id]}</option>
              ))}
            </select>
          </label>

          <p className="rb-nav-progress">{doneCount} of {SECTIONS.length} sections filled</p>
          <ol className="rb-nav-list">
            {SECTIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.key}>
                  <button type="button" className={`rb-nav-item ${i === active ? 'is-active' : ''} ${done[s.key] ? 'is-done' : ''}`}
                    onClick={() => goTo(i)} aria-current={i === active ? 'step' : undefined}>
                    <span className="rb-nav-icon">{done[s.key] ? <Check size={14} strokeWidth={3} /> : <Icon size={15} />}</span>
                    <span>{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <button type="button" className="rb-btn rb-btn--primary rb-side-download" onClick={handleDownload}>
            <Download size={16} />
            <span>Download PDF</span>
          </button>
          <button type="button" className="rb-reset" onClick={resetDraft}>Start over</button>
        </nav>

        {/* ── Form ── */}
        <section className="rb-form" aria-labelledby="rb-section-title">
          <div ref={formTopRef} className="rb-form-anchor" />
          <div className="rb-form-head">
            <p className="rb-step">Step {active + 1} of {SECTIONS.length}</p>
            <h1 id="rb-section-title" className="rb-form-title">{section.label}</h1>
            <p className="rb-form-hint">{section.hint}</p>
          </div>

          <div className="rb-form-body" key={section.key}>{renderSection()}</div>

          <div className="rb-form-foot">
            <button type="button" className="rb-btn rb-btn--ghost" onClick={() => goTo(active - 1)} disabled={active === 0}>
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
            {active < SECTIONS.length - 1 ? (
              <button type="button" className="rb-btn rb-btn--dark" onClick={() => goTo(active + 1)}>
                <span>Next: {SECTIONS[active + 1].label}</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" className="rb-btn rb-btn--primary" onClick={handleDownload}>
                <Download size={16} />
                <span>Download PDF</span>
              </button>
            )}
          </div>
        </section>

        {/* ── Live preview (desktop) ── */}
        <aside className="rb-preview" aria-label="Live preview">
          <div className="rb-preview-head">
            <span>Live preview</span>
            <span className="rb-preview-template">{TEMPLATE_NAMES[template]}</span>
          </div>
          <div className="rb-preview-paper">
            <ScaledPage fit={false}><Template data={resume} fit={false} /></ScaledPage>
          </div>
        </aside>
      </div>

      {/* ── Mobile bottom bar ── */}
      <div className="rb-mobile-bar">
        <button type="button" className="rb-btn rb-btn--ghost rb-btn--icon" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous section">
          <ChevronLeft size={18} />
        </button>
        <button type="button" className="rb-btn rb-btn--ghost rb-mobile-preview" onClick={() => setPreviewOpen(true)}>
          <Eye size={16} />
          <span>Preview</span>
        </button>
        {active < SECTIONS.length - 1 ? (
          <button type="button" className="rb-btn rb-btn--dark rb-mobile-next" onClick={() => goTo(active + 1)}>
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        ) : (
          <button type="button" className="rb-btn rb-btn--primary rb-mobile-next" onClick={handleDownload}>
            <Download size={16} />
            <span>PDF</span>
          </button>
        )}
      </div>

      {/* ── Mobile full-screen preview ── */}
      {previewOpen && (
        <div className="rb-sheet" role="dialog" aria-modal="true" aria-label="Resume preview">
          <div className="rb-sheet-head">
            <button type="button" className="rb-icon-btn" onClick={() => setPreviewOpen(false)} aria-label="Close preview">
              <X size={20} />
            </button>
            {templateSwitcher}
            <button type="button" className="rb-icon-btn" onClick={handleDownload} aria-label="Download PDF">
              <Download size={18} />
            </button>
          </div>
          <div className="rb-sheet-body">
            <div className="rb-preview-paper">
              <ScaledPage fit={false}><Template data={resume} fit={false} /></ScaledPage>
            </div>
          </div>
        </div>
      )}

      {/* ── Print-only full-size copy ── */}
      <div className="rb-print" aria-hidden="true">
        <Template data={resume} fit={false} />
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
