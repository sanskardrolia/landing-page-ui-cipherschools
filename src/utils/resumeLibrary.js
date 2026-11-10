/* Saved-resume library: every resume edited in the builder is kept here so it can be
   listed on /resume/saved. Stored in this browser's localStorage only. */

export const LIBRARY_KEY = 'cs-resume-builder:library';
export const CURRENT_ID_KEY = 'cs-resume-builder:current-id';
const LEGACY_DRAFT_KEY = 'cs-resume-builder:v1';
const LEGACY_TITLE_KEY = 'cs-resume-builder:title';

export const newResumeId = () => `r_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const loadLibrary = () => {
  try {
    const list = JSON.parse(localStorage.getItem(LIBRARY_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const writeLibrary = (list) => {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
};

export const getEntry = (id) => loadLibrary().find((e) => e.id === id) || null;

/* Insert or update. `updatedAt` only moves when the content actually changed. */
export const upsertEntry = ({ id, title, template, resume }) => {
  const list = loadLibrary();
  const idx = list.findIndex((e) => e.id === id);
  if (idx >= 0) {
    const cur = list[idx];
    const same = cur.title === title && cur.template === template && JSON.stringify(cur.resume) === JSON.stringify(resume);
    if (same) return;
    list[idx] = { ...cur, title, template, resume, updatedAt: Date.now() };
  } else {
    list.push({ id, title, template, resume, updatedAt: Date.now() });
  }
  writeLibrary(list);
};

export const deleteEntry = (id) => {
  writeLibrary(loadLibrary().filter((e) => e.id !== id));
  try {
    if (localStorage.getItem(CURRENT_ID_KEY) === id) {
      localStorage.removeItem(CURRENT_ID_KEY);
      localStorage.removeItem(LEGACY_DRAFT_KEY);
      localStorage.removeItem(LEGACY_TITLE_KEY);
    }
  } catch {
    /* storage unavailable */
  }
};

/* People who built a resume before the library existed: surface their draft as an entry. */
export const importLegacyDraft = () => {
  if (loadLibrary().length) return;
  try {
    const raw = localStorage.getItem(LEGACY_DRAFT_KEY);
    if (!raw) return;
    const resume = JSON.parse(raw);
    const p = resume?.personal;
    if (!p || !(p.firstName || p.lastName || p.email)) return;
    const id = newResumeId();
    upsertEntry({
      id,
      title: localStorage.getItem(LEGACY_TITLE_KEY) || 'Edit your resume',
      template: 'beginner',
      resume
    });
    localStorage.setItem(CURRENT_ID_KEY, id);
  } catch {
    /* ignore a corrupt draft */
  }
};
