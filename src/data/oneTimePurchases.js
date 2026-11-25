/* ══════════════════════════════════════════════════════════════
   One-time purchases shown on /dashboard/content, below the
   subscription path. Bought separately, lifetime access, and not
   part of the plan's sequence, so they are listed as standalone cards.
   Each course opens at /dashboard/course/:courseId and plays in the
   same lecture player. It is shaped like a module (one subject →
   units → lectures) so the player can use it as-is.
   DEMO data: replace with the learner's real purchases. `demoDone`
   is how many lectures show as watched until the learner changes it;
   `problems` and `tests` are [done, total] counts (demo).
   ══════════════════════════════════════════════════════════════ */

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const course = ({ id, title, purchased, demoDone, about, problems, tests, units }) => ({
  id,
  title,
  purchased,
  demoDone,
  about,
  problems,
  tests,
  subjects: [{
    id: `${id}-all`,
    title,
    units: units.map(([unitTitle, lectures]) => ({
      id: `${id}--${slug(unitTitle)}`,
      title: unitTitle,
      lectures: lectures.map(([t, mins]) => ({ id: `${id}--${slug(`${unitTitle}-${t}`)}`, title: t, mins }))
    }))
  }]
});

export const ONE_TIME_PURCHASES = [
  course({
    id: 'java-masterclass', title: 'Java Programming Masterclass', purchased: '2026-03-12', demoDone: 6, problems: [14, 40], tests: [1, 5],
    about: 'Core Java from syntax to collections, exceptions and multithreading.',
    units: [
      ['Getting Started', [['Installing the JDK', 9], ['Your First Program', 12], ['Variables & Data Types', 18]]],
      ['Control Flow', [['If, Else & Switch', 16], ['Loops', 20], ['Methods', 22]]],
      ['Object-Oriented Java', [['Classes & Objects', 24], ['Inheritance', 21], ['Interfaces & Abstract Classes', 25], ['Polymorphism', 19]]],
      ['Collections', [['ArrayList & LinkedList', 22], ['HashMap & HashSet', 24], ['Iterators & Comparators', 18]]],
      ['Exceptions & Threads', [['Exception Handling', 20], ['Threads & Runnable', 26], ['Synchronisation Basics', 23]]]
    ]
  }),
  course({
    id: 'react-web-dev', title: 'Web Development with React', purchased: '2026-05-02', demoDone: 0, problems: [0, 24], tests: [0, 4],
    about: 'Build modern interfaces with components, hooks, routing and APIs.',
    units: [
      ['React Basics', [['Why React', 10], ['JSX & Components', 18], ['Props', 15]]],
      ['State & Hooks', [['useState', 20], ['useEffect', 22], ['Custom Hooks', 19]]],
      ['Routing & Data', [['React Router', 21], ['Fetching from APIs', 24], ['Forms', 20]]],
      ['Ship It', [['Styling Approaches', 17], ['Build & Deploy', 18]]]
    ]
  }),
  course({
    id: 'sql-interviews', title: 'SQL for Interviews', purchased: '2026-01-20', demoDone: 8, problems: [30, 30], tests: [3, 3],
    about: 'The SQL patterns that show up in interview rounds, with worked queries.',
    units: [
      ['Querying', [['SELECT & WHERE', 14], ['ORDER BY & LIMIT', 10], ['Aggregates & GROUP BY', 18]]],
      ['Joins', [['Inner & Outer Joins', 20], ['Self Joins', 15]]],
      ['Advanced', [['Subqueries', 18], ['Window Functions', 24], ['Interview Query Patterns', 26]]]
    ]
  }),
  course({
    id: 'resume-workshop', title: 'Resume & LinkedIn Workshop', purchased: '2026-07-08', demoDone: 2, problems: [2, 8], tests: [0, 2],
    about: 'A resume that gets shortlisted and a LinkedIn profile recruiters find.',
    units: [
      ['Resume', [['What Recruiters Scan For', 12], ['Writing Project Bullets', 15], ['Beating the ATS', 11]]],
      ['LinkedIn', [['Headline & About', 13], ['Reaching Out to Recruiters', 14]]]
    ]
  })
];

export const findPurchase = (id) => ONE_TIME_PURCHASES.find((c) => c.id === id) || null;
export const courseLectures = (c) => c.subjects.flatMap((s) => s.units.flatMap((u) => u.lectures));
