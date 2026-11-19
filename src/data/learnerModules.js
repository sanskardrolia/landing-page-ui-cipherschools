/* ══════════════════════════════════════════════════════════════
   Learner dashboard — module catalog
   ──────────────────────────────────────────────────────────────
   Every module has the same four-part shape:
     1. watch     — subjects → units → lectures
     2. practice  — practice sets (MCQ / coding / debugging / vibe coding …)
     3. tests     — proctored tests (unlock at TEST_UNLOCK_AT of the subject watched)
     4. interview — mock interviews (unlock when the subject is fully watched)

   Lecture titles, counts and durations below are PLACEHOLDER curriculum
   so the dashboard has realistic shape; replace with the real syllabus.
   ══════════════════════════════════════════════════════════════ */

export const TEST_UNLOCK_AT = 0.6; // 60% of a subject's lectures watched

/* Until real lecture videos exist, every lecture plays this file. A lecture can set
   its own `src` (see `unit()` below) to override it. */
export const DEMO_VIDEO_SRC = '/media/hero-video.mp4';

/* Which plans unlock which tier of modules (plan ids from PremiumPage) */
export const PLAN_TIERS = {
  starter: ['core'],
  plus: ['core', 'plus'],          // Plus includes ONE Full Stack track (see DEV_TRACKS)
  compete: ['core', 'plus', 'ultra'] // Ultra: everything, both tracks, Ultra modules, higher limits
};

/* Plus learners pick one Full Stack track at checkout; Ultra gets both */
export const DEV_TRACKS = ['mern', 'jfs'];
export const DEV_TRACK_LABELS = { mern: 'MERN (MongoDB, Express, React, Node)', jfs: 'JFS (Java, Spring Boot, React)' };
export const PLAN_LABELS = { starter: 'Core', plus: 'Plus', compete: 'Ultra' };
export const isExtendedPlan = (planId) => planId === 'compete';

/* ── helpers to keep the catalog compact ── */
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// unit('Process Management', ['Processes vs Threads', 18], ['CPU Scheduling', 24, '/videos/cpu.mp4'])
// → lectures with ids; the optional 3rd item is that lecture's video URL
const unit = (title, ...lectures) => ({
  id: slug(title),
  title,
  lectures: lectures.map(([t, mins, src]) => ({ id: slug(`${title}-${t}`), title: t, mins, ...(src ? { src } : {}) }))
});
const subject = (title, units, extra = {}) => ({ id: slug(title), title, units, ...extra });

/* ══════════════════════════ CORE TIER ══════════════════════════ */

const computerFundamentals = {
  id: 'computer-fundamentals',
  tier: 'core',
  title: 'Computer Fundamentals',
  short: 'OS, CN, DBMS & OOPs',
  icon: 'cpu',
  subjects: [
    subject('Operating Systems', [
      unit('Introduction to OS', ['What an OS does', 14], ['Kernel, Shell & System Calls', 18]),
      unit('Process Management', ['Processes vs Threads', 18], ['CPU Scheduling Algorithms', 26], ['Context Switching', 12]),
      unit('Synchronization', ['Critical Section & Mutex', 20], ['Semaphores', 22], ['Classic Problems', 24]),
      unit('Deadlocks', ['Conditions & Detection', 18], ["Banker's Algorithm", 22]),
      unit('Memory Management', ['Paging & Segmentation', 24], ['Virtual Memory & Page Replacement', 26])
    ], { id: 'operating-system' }), // id kept from the old title so saved progress still matches
    subject('Computer Networks', [
      unit('Network Models', ['OSI vs TCP/IP', 20], ['Data Encapsulation', 14]),
      unit('Application Layer', ['HTTP, DNS & DHCP', 24], ['Email & FTP', 16]),
      unit('Transport Layer', ['TCP vs UDP', 18], ['Flow & Congestion Control', 24]),
      unit('Network Layer', ['IP Addressing & Subnetting', 26], ['Routing Basics', 20])
    ]),
    // DBMS used to be its own module; its unit ids (foundations, sql, …) don't clash with the
    // other subjects, so its practice bank and tests carry over unchanged
    subject('Database Management System', [
      unit('Foundations', ['DBMS vs File System', 12], ['ER Model', 22], ['Relational Model & Keys', 20]),
      unit('SQL', ['DDL & DML', 18], ['Joins', 26], ['Subqueries & Aggregations', 24], ['Views & Indexes', 20]),
      unit('Normalization', ['Functional Dependencies', 18], ['1NF to BCNF', 26]),
      unit('Transactions', ['ACID Properties', 16], ['Concurrency Control', 24], ['Recovery', 18])
    ]),
    subject('Programming Language & OOPs', [
      unit('OOP Pillars', ['Classes & Objects', 16], ['Encapsulation & Abstraction', 18], ['Inheritance', 20], ['Polymorphism', 20]),
      unit('Language Internals', ['Memory: Stack vs Heap', 16], ['Exceptions', 14], ['SOLID Principles', 22])
    ], { id: 'oops-programming-language' })
  ],
  practice: [
    { kind: 'mcq', label: 'MCQ Practice', perUnit: 15 },
    { kind: 'sql', label: 'SQL Query Practice (DBMS)', perUnit: 10 }
  ],
  tests: [
    { kind: 'proctored', label: 'Subject Test (Proctored)', questions: 30, mins: 40, perSubject: true }
  ],
  interview: { label: 'Subject Mock Interview', perSubject: true, mins: 30 }
};

const DSA_CORE_TOPICS = [
  unit('Arrays', ['Array Basics & Traversal', 18], ['Two Pointers', 24], ['Prefix Sums', 20]),
  unit('Strings', ['String Manipulation', 18], ['Pattern Matching', 24]),
  unit('Recursion', ['Recursion Mindset', 22], ['Backtracking Intro', 26]),
  unit('Linked List', ['Singly & Doubly Linked Lists', 22], ['Fast & Slow Pointers', 20]),
  unit('Stack & Queue', ['Stack Applications', 20], ['Monotonic Stack', 24], ['Queues & Deques', 18]),
  unit('Trees', ['Tree Traversals', 24], ['Binary Search Trees', 26]),
  unit('Graphs', ['Graph Representation', 18], ['BFS & DFS', 28])
];

/* DSA is one module with two subjects. Basics is Core; Advanced is a Plus subject,
   so Core learners only see Basics (see moduleForPlan). Each subject carries its own
   practice and tests; the module's `practice` lists every kind across both. */
const DSA_BASICS = subject('Basics', DSA_CORE_TOPICS, {
  short: 'Topic-wise DSA', // the module's subtitle when Basics is all the plan has
  practice: [
    { kind: 'coding', label: 'Coding Problems', perUnit: 25, extendedPerUnit: 25 }
  ],
  tests: [
    { kind: 'ai', label: 'A.I. Assisted Test', questions: 3, mins: 60, perSubject: true },
    { kind: 'approach', label: 'Approach Based Coding Test', questions: 4, mins: 75, perSubject: true },
    { kind: 'literacy', label: 'A.I. Literacy Based Test', questions: 20, mins: 30, perSubject: true }
  ]
});

const DSA_ADVANCED = subject('Advanced', [
  unit('Hashing', ['HashMaps in Depth', 20], ['Hashing Patterns', 24]),
  unit('Heaps', ['Heap Internals', 20], ['Top-K & Merging Patterns', 24]),
  unit('Advanced Graphs', ['Shortest Paths', 28], ['Topological Sort', 22], ['Union Find', 24]),
  unit('Dynamic Programming', ['DP Foundations', 26], ['1D & 2D DP', 30], ['DP on Strings', 28], ['DP on Trees', 26]),
  unit('Greedy', ['Greedy Choice Property', 20], ['Intervals', 22])
], {
  tier: 'plus',
  fullTitle: 'DSA Advanced', // how plan comparisons name it
  practice: [
    { kind: 'coding', label: 'Coding Problems', perUnit: 40, extendedPerUnit: 55 },
    { kind: 'company', label: 'Company Specific Problem Sets', perUnit: 15, extendedPerUnit: 25 }
  ],
  tests: [
    { kind: 'ai', label: 'A.I. Assisted Test', questions: 3, mins: 60, perSubject: true },
    { kind: 'approach', label: 'Approach Based Coding Test', questions: 4, mins: 75, perSubject: true },
    { kind: 'company', label: 'Company Specific Test', questions: 3, mins: 90, perSubject: true }
  ]
});

const dsa = {
  id: 'dsa',
  tier: 'core',
  title: 'Data Structures & Algorithms',
  short: 'Basics & Advanced',
  icon: 'workflow',
  subjects: [DSA_BASICS, DSA_ADVANCED],
  practice: [...DSA_BASICS.practice, DSA_ADVANCED.practice[1]],
  tests: [],
  interview: { label: 'DSA Mock Interview', perSubject: true, mins: 45 }
};

/* ══════════════════════════ PLUS TIER ══════════════════════════ */

/* Development is one module with two Full Stack tracks as subjects. Plus includes the one
   track picked at checkout (`devTrack`); Ultra includes both (see subjectUnlocked). */
const MERN_TRACK = subject('MERN', [
  unit('Web Foundations', ['HTML & Semantic Markup', 18], ['Modern CSS & Layout', 26], ['JavaScript Essentials', 30]),
  unit('React', ['Components & Props', 22], ['State & Effects', 26], ['Routing & Data Fetching', 28]),
  unit('Node & Express', ['Node Runtime', 20], ['REST APIs with Express', 30], ['Auth & Middleware', 26]),
  unit('MongoDB', ['Documents & Collections', 18], ['Mongoose Modelling', 24]),
  unit('Shipping', ['Deploying a MERN App', 22])
], { track: 'mern', fullTitle: 'Full Stack Development [MERN]', short: 'MongoDB, Express, React, Node' });

const JFS_TRACK = subject('JFS', [
  unit('Core Java', ['Java Refresher', 24], ['Collections', 26], ['Streams & Lambdas', 22]),
  unit('Spring Boot', ['Spring Fundamentals', 24], ['Building REST APIs', 30], ['Spring Data JPA', 28], ['Spring Security', 28]),
  unit('Frontend', ['React for Java Devs', 26], ['Connecting to Spring APIs', 22]),
  // own id: MERN also has a "Shipping" unit, and unit ids must be unique within a module
  { ...unit('Shipping', ['Testing & Deployment', 24]), id: 'jfs-shipping' }
], { track: 'jfs', fullTitle: 'Full Stack Development [JFS]', short: 'Java, Spring Boot, React' });

const development = {
  id: 'development',
  tier: 'plus',
  title: 'Development',
  short: 'MERN & JFS Full Stack',
  icon: 'code',
  subjects: [MERN_TRACK, JFS_TRACK],
  practice: [
    { kind: 'debugging', label: 'Debugging Practice', perUnit: 6, extendedPerUnit: 10 },
    { kind: 'vibe', label: 'Vibe Coding Practice', perUnit: 4, extendedPerUnit: 7 }
  ],
  tests: [
    { kind: 'debugging', label: 'Debugging Test (Proctored)', questions: 5, mins: 60, perSubject: true },
    { kind: 'vibe', label: 'Vibe Coding Test (Proctored)', questions: 2, mins: 90, perSubject: true }
  ],
  interview: { label: 'Development Mock Interview', perSubject: true, mins: 45 }
};

/* Beyond Development: System Design and DevOps & Cloud as two sections of one module.
   Each keeps its own practice, tests and mock interview; unit ids don't overlap. */
const SYSTEM_DESIGN = subject('System Design', [
  unit('Foundations', ['Scalability Basics', 22], ['Load Balancing', 20], ['Caching', 24]),
  unit('Data', ['SQL vs NoSQL at Scale', 24], ['Sharding & Replication', 26]),
  unit('High Level Design', ['Design a URL Shortener', 30], ['Design a Chat System', 34], ['Design a News Feed', 32]),
  unit('Low Level Design', ['LLD Approach', 22], ['Design a Parking Lot', 28])
], {
  short: 'HLD & LLD',
  practice: [
    { kind: 'sd', label: 'Interactive System Design Practice', perUnit: 2, extendedPerUnit: 4 }
  ],
  tests: [
    { kind: 'sd', label: 'Interactive System Design Test (Proctored)', questions: 1, mins: 60, perSubject: true }
  ],
  interview: { label: 'System Design Mock Interview', perSubject: true, mins: 45 }
});

const DEVOPS_CLOUD = subject('DevOps & Cloud Computing', [
  unit('Linux & Git', ['Linux for Developers', 22], ['Git Workflows', 20]),
  unit('Containers', ['Docker Fundamentals', 26], ['Docker Compose', 20], ['Kubernetes Basics', 28]),
  unit('CI/CD', ['Pipelines with GitHub Actions', 24]),
  unit('Cloud', ['Core Cloud Services', 26], ['Deploying to the Cloud', 24])
], {
  short: 'Linux, Docker, CI/CD, Cloud',
  practice: [
    { kind: 'lab', label: 'Hands-on Sandbox Labs', perUnit: 3, extendedPerUnit: 5 },
    { kind: 'mcq', label: 'MCQ Practice', perUnit: 10 }
  ],
  tests: [
    { kind: 'proctored', label: 'DevOps Test (Proctored)', questions: 30, mins: 45, perSubject: true }
  ],
  interview: { label: 'DevOps Mock Interview', perSubject: true, mins: 30 }
});

const beyondDevelopment = {
  id: 'beyond-development',
  tier: 'plus',
  title: 'Beyond Development',
  short: 'System Design, DevOps & Cloud',
  icon: 'rocket',
  subjects: [SYSTEM_DESIGN, DEVOPS_CLOUD],
  practice: [...SYSTEM_DESIGN.practice, ...DEVOPS_CLOUD.practice],
  tests: [],
  interview: { label: 'Mock Interview', perSubject: true, mins: 45 } // each section has its own
};

const genai = {
  id: 'genai',
  tier: 'plus',
  title: 'Generative A.I.',
  short: 'LLMs, prompting & AI apps',
  icon: 'bot',
  subjects: [
    subject('Generative A.I.', [
      unit('Foundations', ['How LLMs Work', 24], ['Tokens, Context & Limits', 18]),
      unit('Building with LLMs', ['Prompt Engineering', 22], ['Calling LLM APIs', 24], ['Retrieval Augmented Generation', 28]),
      unit('Shipping AI Apps', ['Evaluating AI Output', 20], ['Building an AI Project', 32])
    ])
  ],
  practice: [
    { kind: 'project', label: 'GenAI Mini Projects', perUnit: 1, extendedPerUnit: 2 },
    { kind: 'mcq', label: 'MCQ Practice', perUnit: 10 }
  ],
  tests: [
    { kind: 'proctored', label: 'GenAI Test (Proctored)', questions: 25, mins: 40 }
  ],
  interview: { label: 'GenAI Mock Interview', perSubject: false, mins: 30 }
};

const commBehavioural = {
  id: 'communication',
  tier: 'plus',
  title: 'Communication & Behavioural',
  short: 'HR rounds & soft skills',
  icon: 'message',
  subjects: [
    subject('Communication & Behavioural', [
      unit('Communication', ['Structuring Your Answers', 18], ['Talking Through Code', 20]),
      unit('Behavioural', ['The STAR Method', 18], ['Common HR Questions', 24], ['Salary & Offer Conversations', 16])
    ])
  ],
  practice: [
    { kind: 'speaking', label: 'Speaking Drills', perUnit: 3, extendedPerUnit: 5 }
  ],
  tests: [],
  interview: { label: 'HR Mock Interview', perSubject: false, mins: 30 }
};

/* ══════════════════════════ ULTRA TIER ══════════════════════════ */

const dsaMastery = {
  id: 'dsa-mastery',
  tier: 'ultra',
  title: 'DSA Mastery',
  short: 'Hard problems & interview-level patterns',
  icon: 'workflow',
  subjects: [
    subject('DSA Mastery', [
      unit('Hashing Mastery', ['Hard Hashing Patterns', 28], ['Sliding Window + Hashing', 26]),
      unit('Heaps Mastery', ['Two-Heap Techniques', 26], ['K-way Merge in Interviews', 24]),
      unit('Graph Mastery', ['Shortest Paths with Constraints', 30], ['Bridges & Articulation Points', 28]),
      unit('DP Mastery', ['Interval DP', 32], ['Bitmask DP', 30], ['DP Optimisations', 28]),
      unit('Greedy Mastery', ['Exchange Arguments', 24], ['Scheduling Problems', 26])
    ])
  ],
  practice: [
    { kind: 'coding', label: 'Hard Problem Sets', perUnit: 2 }
  ],
  tests: [
    { kind: 'ai', label: 'A.I. Assisted Test', questions: 3, mins: 75 },
    { kind: 'approach', label: 'Approach Based Coding Test', questions: 4, mins: 90 },
    { kind: 'company', label: 'Company Specific Test', questions: 3, mins: 90 }
  ],
  interview: { label: 'DSA Mastery Mock Interview', perSubject: false, mins: 60 }
};

/* Order = sidebar order: Core, then Plus, then Ultra */
export const MODULES = [
  computerFundamentals, dsa,
  development, beyondDevelopment, genai, commBehavioural,
  dsaMastery
];

export const TIER_LABELS = { core: 'Core Modules', plus: 'Plus Modules', ultra: 'Ultra Modules' };

/* 1:1 Mentorship (Ultra) — meeting credits.
   PLACEHOLDER credit-pack prices; set the real ones before launch. */
export const MENTOR_CREDITS_INCLUDED = 3;
export const CREDIT_PACKS = [
  { id: 'one', credits: 1, price: 499 },
  { id: 'three', credits: 3, price: 1299 },
  { id: 'five', credits: 5, price: 1999 }
];
export const MENTOR_FOCUS = ['DSA & Problem Solving', 'Full Stack Development', 'System Design', 'Career, Resume & Interviews'];

/* ── derived helpers ── */
export const allLectures = (mod) =>
  mod.subjects.flatMap((s) => s.units.flatMap((u) => u.lectures.map((l) => ({ ...l, subjectId: s.id, unitId: u.id }))));

export const subjectLectures = (subj) => subj.units.flatMap((u) => u.lectures);

// Whole modules unlock by tier; the Full Stack track choice is per subject (subjectUnlocked)
export const moduleUnlocked = (mod, planId) => (PLAN_TIERS[planId] || []).includes(mod.tier);

export const findModule = (id) => MODULES.find((m) => m.id === id) || null;

/* ── Subject-level plan tiers (DSA Advanced is a Plus subject inside a Core module) ── */
export const subjectTier = (mod, subj) => subj.tier || mod.tier;
// Plus also gets only the Full Stack track picked at checkout (older Plus enrollments default to MERN)
export const subjectUnlocked = (mod, subj, planId, devTrack) =>
  (PLAN_TIERS[planId] || []).includes(subjectTier(mod, subj))
  && (!subj.track || planId !== 'plus' || subj.track === (devTrack || 'mern'));

/* Which plans include a subject the learner doesn't have, e.g. "Plus & Ultra" or "Ultra" */
export const subjectPlansLabel = (mod, subj) =>
  subj.track || subjectTier(mod, subj) === 'ultra' ? 'Ultra' : 'Plus & Ultra';

/* Ultra's higher limits apply to Plus & Ultra content, not Core */
export const subjectExtended = (extended, mod, subj) => extended && subjectTier(mod, subj) !== 'core';

/* A subject's own practice / tests, else the module's */
export const subjectPractice = (mod, subj) => subj.practice || mod.practice;
export const subjectTests = (mod, subj) => subj.tests || mod.tests;
export const subjectInterview = (mod, subj) => subj.interview || mod.interview;

/* The module as this plan sees it: subjects the plan doesn't include are left out */
export const moduleForPlan = (mod, planId, devTrack) => {
  if (!mod) return mod;
  const subjects = mod.subjects.filter((s) => subjectUnlocked(mod, s, planId, devTrack));
  if (!subjects.length || subjects.length === mod.subjects.length) return mod;
  const kinds = new Map();
  subjects.forEach((s) => (s.practice || []).forEach((p) => { if (!kinds.has(p.kind)) kinds.set(p.kind, p); }));
  return {
    ...mod,
    subjects,
    short: (subjects.length === 1 && subjects[0].short) || mod.short,
    practice: kinds.size ? [...kinds.values()] : mod.practice
  };
};
