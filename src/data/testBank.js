/* ══════════════════════════════════════════════════════════════
   Test bank
   ──────────────────────────────────────────────────────────────
   Module Tests     — one "stage" per Watch unit (same unit ids, same
                      order), unlocked one after another.
   Additional Tests — the bigger module-wide tests in each module's
                      `tests` list (learnerModules.js).

   `testType` is what the test assesses (A.I. Assisted, Debugging…);
   `format` is how it's taken (MCQ, Coding…). Durations and question
   counts are PLACEHOLDERS — replace with the real test configuration.
   ══════════════════════════════════════════════════════════════ */

const T = (key, testType, format, mins, questions, noun = 'Questions') => ({ key, testType, format, mins, questions, noun });

/* Stage tests generated for each unit, by module */
const STAGE_RULES = {
  dsa: () => [T('ai', 'A.I. Assisted', 'Coding', 45, 2, 'Problems'), T('approach', 'Approach Based', 'Coding', 30, 3, 'Problems')],
  'dsa-advanced': () => [T('ai', 'A.I. Assisted', 'Coding', 60, 2, 'Problems'), T('approach', 'Approach Based', 'Coding', 40, 3, 'Problems')],
  'dsa-mastery': () => [T('ai', 'A.I. Assisted', 'Coding', 75, 2, 'Problems'), T('approach', 'Approach Based', 'Coding', 50, 3, 'Problems')],
  mern: () => [T('debugging', 'Debugging', 'Coding', 30, 3, 'Bugs'), T('vibe', 'Vibe Coding', 'Build Task', 45, 1, 'Task')],
  jfs: () => [T('debugging', 'Debugging', 'Coding', 30, 3, 'Bugs'), T('vibe', 'Vibe Coding', 'Build Task', 45, 1, 'Task')],
  dbms: (unit) => (unit.id === 'sql'
    ? [T('concept', 'Concept Check', 'MCQ', 20, 10), T('sql', 'SQL Query', 'Coding', 30, 3, 'Queries')]
    : [T('concept', 'Concept Check', 'MCQ', 20, 10)]),
  devops: () => [T('lab', 'Hands-on Lab', 'Sandbox', 40, 1, 'Lab')],
  'system-design': () => [T('design', 'Interactive Design', 'Design Canvas', 45, 1, 'Scenario')],
  communication: () => [T('spoken', 'Spoken Response', 'Video Response', 15, 3)],
  default: () => [T('concept', 'Concept Check', 'MCQ', 20, 10)]
};

/* Module Tests for a subject: one or more stages per unit, numbered in order */
export const stageTests = (mod, subject) => {
  const rule = STAGE_RULES[mod.id] || STAGE_RULES.default;
  const rows = [];
  subject.units.forEach((unit) => {
    rule(unit).forEach((t) => {
      rows.push({
        ...t,
        id: `${mod.id}:stage:${subject.id}:${unit.id}:${t.key}`,
        unit,
        name: rule(unit).length > 1 ? `${unit.title} · ${t.testType} Test` : `${unit.title} Test`
      });
    });
  });
  return rows;
};

/* Additional (module-wide) tests: test type + format per kind */
export const ADDITIONAL_META = {
  ai: { testType: 'A.I. Assisted', format: 'Coding' },
  approach: { testType: 'Approach Based', format: 'Coding' },
  literacy: { testType: 'A.I. Literacy', format: 'MCQ' },
  company: { testType: 'Company Specific', format: 'Coding' },
  proctored: { testType: 'Full Module', format: 'MCQ' },
  debugging: { testType: 'Debugging', format: 'Coding' },
  vibe: { testType: 'Vibe Coding', format: 'Build Task' },
  sd: { testType: 'Interactive Design', format: 'Design Canvas' }
};
