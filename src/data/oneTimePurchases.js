/* ══════════════════════════════════════════════════════════════
   One-time purchases shown on /dashboard/content, below the
   subscription path. Bought separately, lifetime access, and not
   part of the plan's sequence, so they are listed as standalone cards.
   Each course opens at /dashboard/course/:courseId and plays in the
   same lecture player. It is shaped like a module (one subject →
   units → lectures) so the player can use it as-is.
   Three pillars, like a subscription module: Lectures · Problem · Test.
     problems → per unit (coding problems open the coding workspace)
     tests    → one per unit, plus a final course test
   DEMO data: replace with the learner's real purchases. demoDone /
   demoSolved / demoTests are how many lectures, problems and tests
   show as done until the learner changes that course.
   ══════════════════════════════════════════════════════════════ */

import { findFreeProblem } from './freePractice';

/* problems: free-bank coding problems by id, or SQL problems written here */
const fromBank = (id) => { const p = findFreeProblem(`fp-${id}`); return p ? { ...p } : null; };
const sqlP = (title, level, companies, statement, schema, examples) => ({ kind: 'sql', title, level, companies, language: 'sql', statement, schema, examples, starter: '-- Write your query below\nSELECT\n' });
const ex = (input, output) => ({ input, output });

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const course = ({ id, title, purchased, demoDone, demoSolved = 0, demoTests = 0, about, units }) => ({
  id,
  title,
  purchased,
  demoDone,
  demoSolved,
  demoTests,
  about,
  subjects: [{
    id: `${id}-all`,
    title,
    units: units.map(([unitTitle, lectures, problems = []]) => {
      const unitId = `${id}--${slug(unitTitle)}`;
      return {
        id: unitId,
        title: unitTitle,
        lectures: lectures.map(([t, mins]) => ({ id: `${id}--${slug(`${unitTitle}-${t}`)}`, title: t, mins })),
        problems: problems.map((p) => (typeof p === 'string' ? fromBank(p) : p)).filter(Boolean)
          .map((p, i) => ({ ...p, id: `${unitId}--p${i}` }))
      };
    })
  }]
});

export const ONE_TIME_PURCHASES = [
  course({
    id: 'java-masterclass', title: 'Java Programming Masterclass', purchased: '2026-03-12', demoDone: 6, demoSolved: 3, demoTests: 1,
    about: 'Core Java from syntax to collections, exceptions and multithreading.',
    units: [
      ['Getting Started', [['Installing the JDK', 9], ['Your First Program', 12], ['Variables & Data Types', 18]], ['majority-element']],
      ['Control Flow', [['If, Else & Switch', 16], ['Loops', 20], ['Methods', 22]], ['binary-search', 'best-time-stock']],
      ['Object-Oriented Java', [['Classes & Objects', 24], ['Inheritance', 21], ['Interfaces & Abstract Classes', 25], ['Polymorphism', 19]], ['valid-parentheses']],
      ['Collections', [['ArrayList & LinkedList', 22], ['HashMap & HashSet', 24], ['Iterators & Comparators', 18]], ['two-sum', 'group-anagrams', 'merge-intervals']],
      ['Exceptions & Threads', [['Exception Handling', 20], ['Threads & Runnable', 26], ['Synchronisation Basics', 23]], ['product-except-self']]
    ]
  }),
  course({
    id: 'react-web-dev', title: 'Web Development with React', purchased: '2026-05-02', demoDone: 0,
    about: 'Build modern interfaces with components, hooks, routing and APIs.',
    units: [
      ['React Basics', [['Why React', 10], ['JSX & Components', 18], ['Props', 15]], ['reverse-list']],
      ['State & Hooks', [['useState', 20], ['useEffect', 22], ['Custom Hooks', 19]], ['longest-substring']],
      ['Routing & Data', [['React Router', 21], ['Fetching from APIs', 24], ['Forms', 20]], ['kth-largest', 'number-of-islands']],
      ['Ship It', [['Styling Approaches', 17], ['Build & Deploy', 18]]]
    ]
  }),
  course({
    id: 'sql-interviews', title: 'SQL for Interviews', purchased: '2026-01-20', demoDone: 8, demoSolved: 6, demoTests: 4,
    about: 'The SQL patterns that show up in interview rounds, with worked queries.',
    units: [
      ['Querying', [['SELECT & WHERE', 14], ['ORDER BY & LIMIT', 10], ['Aggregates & GROUP BY', 18]], [
        sqlP('Find Duplicate Emails', 'Easy', ['TCS'], 'Return every email that appears more than once.', 'Person(id INT, email VARCHAR)', [ex('a@x.com, b@x.com, a@x.com', 'a@x.com')]),
        sqlP('Orders per Customer', 'Easy', ['Swiggy'], 'Return each customer id with their number of orders, most orders first.', 'Orders(id INT, customer_id INT, amount INT)', [ex('Orders by 1, 1, 2', '1 → 2, 2 → 1')])
      ]],
      ['Joins', [['Inner & Outer Joins', 20], ['Self Joins', 15]], [
        sqlP('Customers Who Never Ordered', 'Easy', ['Flipkart'], 'List the names of customers who have never placed an order.', 'Customers(id INT, name VARCHAR) · Orders(id INT, customer_id INT)', [ex('Customers: Joe, Henry, Sam · Orders by Joe', 'Henry, Sam')]),
        sqlP('Employees Earning More Than Managers', 'Easy', ['Amazon'], 'Return employees who earn more than their manager.', 'Employee(id INT, name VARCHAR, salary INT, manager_id INT)', [ex('Joe 70k (manager Sam 60k)', 'Joe')])
      ]],
      ['Advanced', [['Subqueries', 18], ['Window Functions', 24], ['Interview Query Patterns', 26]], [
        sqlP('Second Highest Salary', 'Medium', ['Amazon'], 'Return the second highest distinct salary, or NULL if there is none.', 'Employee(id INT, name VARCHAR, salary INT)', [ex('100, 200, 300', '200')]),
        sqlP('Department Top Earners', 'Hard', ['Microsoft'], 'Return employees who earn one of the top three distinct salaries in their department.', 'Employee(id, name, salary, department_id) · Department(id, name)', [ex('IT: 90k, 85k, 85k, 70k, 69k', 'The 90k, 85k, 85k and 70k earners')])
      ]]
    ]
  }),
  course({
    id: 'resume-workshop', title: 'Resume & LinkedIn Workshop', purchased: '2026-07-08', demoDone: 2,
    about: 'A resume that gets shortlisted and a LinkedIn profile recruiters find.',
    units: [
      ['Resume', [['What Recruiters Scan For', 12], ['Writing Project Bullets', 15], ['Beating the ATS', 11]]],
      ['LinkedIn', [['Headline & About', 13], ['Reaching Out to Recruiters', 14]]]
    ]
  })
];

export const findPurchase = (id) => ONE_TIME_PURCHASES.find((c) => c.id === id) || null;
export const courseLectures = (c) => c.subjects.flatMap((s) => s.units.flatMap((u) => u.lectures));

export const courseUnits = (c) => c.subjects.flatMap((s) => s.units);
export const courseProblems = (c) => courseUnits(c).flatMap((u) => u.problems);

/* Tests: one per unit (unlocks after 60% of its lectures), then a final test (after 60% of the course) */
export const COURSE_TEST_UNLOCK = 0.6;
export const courseTests = (c) => {
  const units = courseUnits(c);
  const unitTests = units.map((u, i) => ({
    id: `${c.id}--t${i + 1}`, stage: `#${i + 1}`, name: `${u.title} · Unit test`, unit: u, lectures: u.lectures,
    mins: 15, count: `${Math.max(8, u.lectures.length * 4)} Questions`, testType: 'Unit Test', format: 'MCQ'
  }));
  const final = {
    id: `${c.id}--final`, stage: `#${units.length + 1}`, name: `${c.title} · Final test`, unit: null, lectures: courseLectures(c),
    mins: 45, count: '30 Questions', testType: 'Full Course', format: 'MCQ + Coding'
  };
  return [...unitTests, final];
};
