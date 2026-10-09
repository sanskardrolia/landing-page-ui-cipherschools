/*
 * Bridge between the ATS Checker (engine `resume_json`) and the Resume Builder
 * (builder data model), plus the fixes the builder can apply.
 *
 * Automatic fixes only change what can be changed truthfully (layout, contact
 * placement, summary wording, weak bullet openers). Fixes that need facts only
 * the user has (metrics, real skills, missing sections) are "manual": the
 * builder points to the right section instead of inventing content.
 */
import { analyzeResume, STRONG_ACTION_VERBS } from './atsEngine.js';
import {
  emptyResume,
  emptySkill,
  newId,
  toBullets,
  formatRange,
  fullName,
  SUMMARY_HEADING_RE,
} from './resumeData.js';

export const HANDOFF_KEY = 'cs-ats-handoff:v1';
export const DRAFT_KEY = 'cs-resume-builder:v1';

const SUMMARY_RE = SUMMARY_HEADING_RE;
const ACHIEVEMENT_RE = /achiev|honou?r|award/i;
const ACTIVITY_RE = /activit|extracurricular|volunteer|leadership/i;

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// "Jan 2024" -> "2024-01"; "2024" -> "2024-"
const parseMonth = (text = '') => {
  const m = text.trim().match(/([a-z]{3})[a-z]*\.?\s+(\d{4})/i);
  if (m) {
    const idx = MONTHS.indexOf(m[1].toLowerCase());
    if (idx >= 0) return `${m[2]}-${String(idx + 1).padStart(2, '0')}`;
  }
  const y = text.match(/\d{4}/);
  return y ? `${y[0]}-` : '';
};

const parseDuration = (duration = '') => {
  const [start = '', end = ''] = duration.split(/\s+[-–—to]+\s+/i);
  const current = /present|current|now/i.test(end);
  return { startDate: parseMonth(start), endDate: current ? '' : parseMonth(end), current };
};

const parseScore = (score = '') => {
  if (!score) return { scoreType: 'CGPA', score: '' };
  const num = (score.match(/\d+(?:\.\d+)?/) || [''])[0];
  if (/%|percent/i.test(score)) return { scoreType: 'Percentage', score: num };
  if (/\bgpa\b/i.test(score) && !/cgpa/i.test(score)) return { scoreType: 'GPA', score: num };
  return { scoreType: 'CGPA', score: num };
};

const asBullets = (items = []) => items.filter(Boolean).map((b) => `- ${b}`).join('\n');

/* ── engine resume_json -> builder data ── */
export const atsToBuilder = (rj = {}) => {
  const base = emptyResume();
  const [firstName = '', ...rest] = (rj.name || '').trim().split(/\s+/);
  const links = rj.links || [];
  const github = links.find((l) => /github/i.test(l)) || '';
  const linkedin = links.find((l) => /linkedin/i.test(l)) || '';
  const portfolio = links.find((l) => l !== github && l !== linkedin) || '';

  const skillsText = Array.isArray(rj.skills) ? rj.skills.join(', ') : (rj.skills || '');

  const additional = [];
  if (rj.summary) additional.push({ id: newId('add'), heading: 'Summary', description: rj.summary });
  if (rj.achievements?.length) {
    additional.push({ id: newId('add'), heading: 'Achievements', description: asBullets(rj.achievements.map((a) => a.title || a)) });
  }
  if (rj.activities?.length) {
    additional.push({ id: newId('add'), heading: 'Activities', description: asBullets(rj.activities.map((a) => a.title || a)) });
  }

  return {
    ...base,
    personal: {
      ...base.personal,
      firstName,
      lastName: rest.join(' '),
      email: rj.email || '',
      phone: rj.phone || '',
      location: rj.location || '',
      github,
      linkedin,
      portfolio,
    },
    education: (rj.education || []).map((ed) => {
      const [degree, inField] = (ed.degree || '').split(/\s+in\s+/i);
      const years = (ed.year || '').match(/\d{4}/g) || [];
      return {
        id: newId('edu'),
        institution: ed.institution || '',
        location: ed.location || '',
        degree: degree || '',
        field: inField || ed.field || '',
        startYear: years.length > 1 ? years[0] : '',
        gradYear: years[years.length - 1] || '',
        ...parseScore(ed.score),
      };
    }),
    experience: (rj.experience || []).map((ex) => ({
      id: newId('exp'),
      employer: ex.company || '',
      title: ex.role || '',
      location: ex.location || '',
      ...parseDuration(ex.duration),
      achievements: asBullets(ex.bullets),
    })),
    skills: skillsText ? [{ ...emptySkill('Technical Skills'), skills: skillsText }] : base.skills,
    projects: (rj.projects || []).map((p) => ({
      id: newId('prj'),
      title: p.title || '',
      github: p.github || '',
      link: p.link || '',
      startDate: '',
      endDate: '',
      current: false,
      description: asBullets([...(p.bullets || []), p.tech ? `Tech stack: ${p.tech}` : '']),
    })),
    certifications: (rj.certifications || []).map((c) => ({
      id: newId('crt'),
      title: c.title || c,
      issuer: c.issuer || '',
      link: c.link || '',
    })),
    additional,
  };
};

/* ── builder data -> engine resume_json (for live re-scoring) ── */
export const builderToAts = (data) => {
  const p = data.personal;
  const summary = data.additional.find((a) => SUMMARY_RE.test(a.heading.trim()));
  const listFrom = (re) => data.additional
    .filter((a) => re.test(a.heading))
    .flatMap((a) => toBullets(a.description))
    .map((title) => ({ title }));

  return {
    name: fullName(p),
    email: p.email,
    phone: p.phone,
    location: p.location,
    links: [p.linkedin, p.github, p.portfolio].filter(Boolean),
    summary: summary ? toBullets(summary.description).join(' ') : '',
    education: data.education.filter((e) => e.institution || e.degree).map((e) => ({
      degree: [e.degree, e.field].filter(Boolean).join(' in '),
      institution: e.institution,
      field: e.field,
      year: [e.startYear, e.gradYear].filter(Boolean).join(' - '),
      score: e.score ? `${e.scoreType}: ${e.score}${e.scoreType === 'Percentage' ? '%' : ''}` : '',
    })),
    experience: data.experience.filter((e) => e.employer || e.title).map((e) => ({
      company: e.employer,
      role: e.title,
      duration: formatRange(e.startDate, e.endDate, e.current),
      bullets: toBullets(e.achievements),
    })),
    skills: data.skills.map((s) => s.skills).filter((s) => s.trim()).join(', '),
    projects: data.projects.filter((pr) => pr.title).map((pr) => {
      const lines = toBullets(pr.description);
      const techLine = lines.find((l) => /^tech( stack)?:/i.test(l));
      return {
        title: pr.title,
        tech: techLine ? techLine.replace(/^tech( stack)?:\s*/i, '') : '',
        bullets: lines.filter((l) => l !== techLine),
      };
    }),
    certifications: data.certifications.filter((c) => c.title).map((c) => ({ title: c.title })),
    achievements: listFrom(ACHIEVEMENT_RE),
    activities: listFrom(ACTIVITY_RE),
  };
};

export const scoreBuilder = (data, ctx) => analyzeResume({
  resume_json: builderToAts(data),
  doc_metrics: ctx.docMetrics,
  job_description: ctx.jd || '',
  job_meta: ctx.meta || '',
});

/* ── Fix catalogue ── */
const FIX_INFO = {
  layout: { title: 'Use a single-column, text-based layout', section: 'personal', auto: true,
    detail: 'Switches to the single-column Experienced template, which exports a PDF with real, selectable text.' },
  contact: { title: 'Put contact details in the page body', section: 'personal', auto: true,
    detail: 'The builder places your email and phone under your name, where ATS parsers read them.' },
  summary: { title: 'Rewrite your summary', section: 'additional', auto: true,
    detail: 'A 40–80 word, third-person summary built from your own skills, roles and projects.' },
  verbs: { title: 'Start bullets with strong action verbs', section: 'experience', auto: true,
    detail: 'Replaces weak openers like "Responsible for" or "Worked on" with clear action verbs.' },
  metrics: { title: 'Add numbers to your bullet points', section: 'experience', auto: false,
    detail: 'Only you know the real numbers. Add a %, count or time saved to each bullet.' },
  length: { title: 'Keep bullets between 12 and 28 words', section: 'experience', auto: false,
    detail: 'Trim long bullets and add context to very short ones.' },
  skills: { title: 'Close your skill gaps', section: 'skills', auto: false,
    detail: 'Add the missing skills you genuinely have, and mention them in a project or role.' },
  education: { title: 'Add your education', section: 'education', auto: false,
    detail: 'Add your degree, institution and graduation year.' },
  personal: { title: 'Complete your contact details', section: 'personal', auto: false,
    detail: 'Add a valid email address and a 10-digit phone number.' },
};

// Map a report section key or suggestion to a fix kind.
// Suggestion ids are renumbered after sorting, so match on field + title.
export const fixKindFor = ({ sectionKey, suggestion } = {}) => {
  if (suggestion) {
    const { field = '', title = '' } = suggestion;
    if (field === 'file_format' || field === 'layout') return 'layout';
    if (field === 'contact') return 'contact';
    if (field === 'summary') return 'summary';
    if (field === 'skills') return 'skills';
    if (field === 'bullets') {
      if (/action verb/i.test(title)) return 'verbs';
      if (/metric|numer/i.test(title)) return 'metrics';
      if (/word length|12-28/i.test(title)) return 'length';
    }
    return null;
  }
  switch (sectionKey) {
    case 'summary': return 'summary';
    case 'experience': return 'metrics';
    case 'skills': return 'skills';
    case 'education': return 'education';
    case 'personal': return 'personal';
    default: return null;
  }
};

// Fix list for the current state of an analysis (deduplicated by kind)
export const deriveFixes = (analysis) => {
  if (!analysis || analysis.error) return [];
  const kinds = new Map();
  const add = (kind, points) => {
    if (!kind || !FIX_INFO[kind]) return;
    kinds.set(kind, (kinds.get(kind) || 0) + (points || 0));
  };
  analysis.suggestions.forEach((s) => add(fixKindFor({ suggestion: s }), s.pointsGain));
  analysis.sections
    .filter((s) => s.hasConcern || s.topIssue)
    .forEach((s) => {
      // contact concern is the header/footer trap when email + phone exist
      const kind = s.key === 'personal' && !/missing/i.test(s.stat) ? 'contact' : fixKindFor({ sectionKey: s.key });
      if (!kinds.has(kind)) add(kind, 0);
    });
  const missing = analysis.keywords?.filter((k) => k.status === 'MISSING' && k.importance === 'REQUIRED').map((k) => k.text) || [];
  return [...kinds.entries()].map(([kind]) => ({
    kind,
    ...FIX_INFO[kind],
    detail: kind === 'skills' && missing.length
      ? `Missing from the job description: ${missing.slice(0, 6).join(', ')}. Add only the ones you have used.`
      : FIX_INFO[kind].detail,
  }));
};

/* ── Automatic fixes ── */
const GERUND_TO_VERB = {
  building: 'Built', developing: 'Developed', designing: 'Designed', creating: 'Created',
  implementing: 'Implemented', optimizing: 'Optimized', optimising: 'Optimized', deploying: 'Deployed',
  automating: 'Automated', integrating: 'Integrated', migrating: 'Migrated', configuring: 'Configured',
  writing: 'Authored', leading: 'Spearheaded', managing: 'Orchestrated', refactoring: 'Refactored',
  reducing: 'Reduced', increasing: 'Increased', scaling: 'Scaled', establishing: 'Established',
  streamlining: 'Streamlined', architecting: 'Architected', solving: 'Solved', mentoring: 'Mentored',
};

const VERB_SWAPS = {
  grew: 'Scaled', made: 'Created', wrote: 'Authored', led: 'Spearheaded', improved: 'Optimized',
  boosted: 'Increased', cut: 'Reduced', lowered: 'Reduced', setup: 'Configured', set: 'Configured',
  launched: 'Deployed', shipped: 'Deployed', coded: 'Developed', programmed: 'Developed',
  maintained: 'Streamlined', fixed: 'Solved', resolved: 'Solved', analyzed: 'Diagnosed',
  analysed: 'Diagnosed', tested: 'Benchmarked', planned: 'Formulated', ran: 'Executed',
};

const WEAK_OPENERS = [
  /^(?:was |were )?(?:solely )?responsible for\s+/i,
  /^(?:was )?tasked with\s+/i,
  /^(?:was )?involved in\s+/i,
  /^participated in\s+/i,
  /^worked on\s+/i,
  /^handled\s+/i,
];

export const strengthenBullet = (bullet) => {
  let text = bullet.trim();
  const first = text.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
  if (STRONG_ACTION_VERBS.has(first)) return bullet;

  for (const re of WEAK_OPENERS) {
    if (re.test(text)) {
      const rest = text.replace(re, '');
      const [word, ...tail] = rest.split(/\s+/);
      const verb = GERUND_TO_VERB[word?.toLowerCase()];
      if (verb) return [verb, ...tail].join(' ');
      return `${/worked on/i.test(re.source) ? 'Developed' : 'Executed'} ${rest}`;
    }
  }
  const [word, ...tail] = text.split(/\s+/);
  const lower = word.toLowerCase().replace(/[^a-z]/g, '');
  const swap = GERUND_TO_VERB[lower] || VERB_SWAPS[lower];
  return swap ? [swap, ...tail].join(' ') : bullet;
};

const strengthenText = (text) =>
  text.split('\n').map((line) => {
    const m = line.match(/^(\s*[-•*]\s*)(.*)$/);
    if (!m || !m[2].trim()) return line;
    return m[1] + strengthenBullet(m[2]);
  }).join('\n');

const words = (s) => s.trim().split(/\s+/).filter(Boolean);

export const buildSummary = (data) => {
  const latest = data.experience.find((e) => e.title);
  const edu = data.education.find((e) => e.degree || e.field);
  const skills = data.skills.flatMap((s) => s.skills.split(',')).map((s) => s.trim()).filter(Boolean);
  const projects = data.projects.filter((p) => p.title).map((p) => p.title);
  const existing = data.additional.find((a) => SUMMARY_RE.test(a.heading.trim()));
  const existingText = existing ? toBullets(existing.description).join(' ') : '';
  const pronouns = /\b(i|my|me|myself|we|our)\b/i;

  const headline = latest
    ? `${latest.title} at ${latest.employer || 'a product team'}`
    : (edu ? `${[edu.degree, edu.field].filter(Boolean).join(' in ')} graduate` : 'Software engineer');

  const parts = [];
  if (existingText && !pronouns.test(existingText)) {
    parts.push(existingText.replace(/\s*\.?\s*$/, '.'));
  } else {
    parts.push(`${headline} with hands-on experience in ${skills.slice(0, 6).join(', ') || 'modern software development'}.`);
  }
  if (projects.length) {
    parts.push(`Built ${projects.length > 1 ? `projects including ${projects.slice(0, 2).join(' and ')}` : projects[0]}, taking each from idea to a working release.`);
  }
  const closing = 'Known for clean, well-tested code, clear communication with teammates and shipping features that real users depend on.';
  if (words(parts.join(' ')).length < 40) parts.push(closing);
  if (words(parts.join(' ')).length < 40 && skills.length > 6) {
    parts.push(`Also comfortable with ${skills.slice(6, 12).join(', ')}.`);
  }
  if (words(parts.join(' ')).length < 40) {
    parts.push('Eager to take ownership of problems end to end and keep learning across the stack.');
  }
  // keep within 80 words
  return words(parts.join(' ')).slice(0, 80).join(' ').replace(/([^.])$/, '$1.');
};

/*
 * Apply one automatic fix.
 * Returns { data, ctx, template } with only the parts that changed.
 */
export const applyFix = (kind, data, ctx, template) => {
  switch (kind) {
    case 'layout':
      return {
        data,
        template: template === 'experienced' ? template : 'experienced',
        ctx: { ...ctx, docMetrics: { ...ctx.docMetrics, file_format: 'pdf', has_text_layer: true, column_count: 1, table_count: 0, text_box_count: 0 } },
      };
    case 'contact':
      return { data, template, ctx: { ...ctx, docMetrics: { ...ctx.docMetrics, header_footer_contact: false } } };
    case 'summary': {
      const text = buildSummary(data);
      const others = data.additional.filter((a) => !SUMMARY_RE.test(a.heading.trim()));
      const prev = data.additional.find((a) => SUMMARY_RE.test(a.heading.trim()));
      return {
        data: { ...data, additional: [{ id: prev?.id || newId('add'), heading: 'Summary', description: text }, ...others] },
        template,
        ctx,
      };
    }
    case 'verbs':
      return {
        data: {
          ...data,
          experience: data.experience.map((e) => ({ ...e, achievements: strengthenText(e.achievements) })),
          projects: data.projects.map((p) => ({ ...p, description: strengthenText(p.description) })),
        },
        template,
        ctx,
      };
    default:
      return { data, template, ctx };
  }
};

/* ── Storage helpers ── */
export const readHandoff = () => {
  try {
    const raw = sessionStorage.getItem(HANDOFF_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const writeHandoff = (value) => {
  try {
    if (value) sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(value));
    else sessionStorage.removeItem(HANDOFF_KEY);
  } catch {
    /* storage unavailable */
  }
};

export const readDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const writeDraft = (data) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable */
  }
};
