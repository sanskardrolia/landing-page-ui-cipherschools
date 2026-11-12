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
  plus: ['core', 'plus'],
  compete: ['core', 'plus'] // Ultra: same modules as Plus, with extended limits
};
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
  short: 'OS, CN & OOPs',
  icon: 'cpu',
  subjects: [
    subject('Operating System', [
      unit('Introduction to OS', ['What an OS does', 14], ['Kernel, Shell & System Calls', 18]),
      unit('Process Management', ['Processes vs Threads', 18], ['CPU Scheduling Algorithms', 26], ['Context Switching', 12]),
      unit('Synchronization', ['Critical Section & Mutex', 20], ['Semaphores', 22], ['Classic Problems', 24]),
      unit('Deadlocks', ['Conditions & Detection', 18], ["Banker's Algorithm", 22]),
      unit('Memory Management', ['Paging & Segmentation', 24], ['Virtual Memory & Page Replacement', 26])
    ]),
    subject('Computer Networks', [
      unit('Network Models', ['OSI vs TCP/IP', 20], ['Data Encapsulation', 14]),
      unit('Application Layer', ['HTTP, DNS & DHCP', 24], ['Email & FTP', 16]),
      unit('Transport Layer', ['TCP vs UDP', 18], ['Flow & Congestion Control', 24]),
      unit('Network Layer', ['IP Addressing & Subnetting', 26], ['Routing Basics', 20])
    ]),
    subject('OOPs & Programming Language', [
      unit('OOP Pillars', ['Classes & Objects', 16], ['Encapsulation & Abstraction', 18], ['Inheritance', 20], ['Polymorphism', 20]),
      unit('Language Internals', ['Memory: Stack vs Heap', 16], ['Exceptions', 14], ['SOLID Principles', 22])
    ])
  ],
  practice: [
    { kind: 'mcq', label: 'MCQ Practice', perUnit: 15 }
  ],
  tests: [
    { kind: 'proctored', label: 'Subject Test (Proctored)', questions: 30, mins: 40, perSubject: true }
  ],
  interview: { label: 'Subject Mock Interview', perSubject: true, mins: 30 }
};

const dbms = {
  id: 'dbms',
  tier: 'core',
  title: 'DBMS',
  short: 'Database Management Systems',
  icon: 'database',
  subjects: [
    subject('Database Management System', [
      unit('Foundations', ['DBMS vs File System', 12], ['ER Model', 22], ['Relational Model & Keys', 20]),
      unit('SQL', ['DDL & DML', 18], ['Joins', 26], ['Subqueries & Aggregations', 24], ['Views & Indexes', 20]),
      unit('Normalization', ['Functional Dependencies', 18], ['1NF to BCNF', 26]),
      unit('Transactions', ['ACID Properties', 16], ['Concurrency Control', 24], ['Recovery', 18])
    ])
  ],
  practice: [
    { kind: 'mcq', label: 'MCQ Practice', perUnit: 15 },
    { kind: 'sql', label: 'SQL Query Practice', perUnit: 10 }
  ],
  tests: [
    { kind: 'proctored', label: 'DBMS Test (Proctored)', questions: 35, mins: 45, perSubject: true }
  ],
  interview: { label: 'DBMS Mock Interview', perSubject: true, mins: 30 }
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

const dsa = {
  id: 'dsa',
  tier: 'core',
  title: 'Data Structures & Algorithms',
  short: 'Topic-wise DSA',
  icon: 'workflow',
  subjects: [subject('DSA', DSA_CORE_TOPICS)],
  practice: [
    { kind: 'coding', label: 'Coding Problems', perUnit: 25, extendedPerUnit: 25 }
  ],
  tests: [
    { kind: 'ai', label: 'A.I. Assisted Test', questions: 3, mins: 60 },
    { kind: 'approach', label: 'Approach Based Coding Test', questions: 4, mins: 75 },
    { kind: 'literacy', label: 'A.I. Literacy Based Test', questions: 20, mins: 30 }
  ],
  interview: { label: 'DSA Mock Interview', perSubject: false, mins: 45 }
};

/* ══════════════════════════ PLUS TIER ══════════════════════════ */

const dsaAdvanced = {
  id: 'dsa-advanced',
  tier: 'plus',
  title: 'DSA Advanced',
  short: 'Hashing, Heaps, DP & more',
  icon: 'workflow',
  subjects: [
    subject('DSA Advanced', [
      unit('Hashing', ['HashMaps in Depth', 20], ['Hashing Patterns', 24]),
      unit('Heaps', ['Heap Internals', 20], ['Top-K & Merging Patterns', 24]),
      unit('Advanced Graphs', ['Shortest Paths', 28], ['Topological Sort', 22], ['Union Find', 24]),
      unit('Dynamic Programming', ['DP Foundations', 26], ['1D & 2D DP', 30], ['DP on Strings', 28], ['DP on Trees', 26]),
      unit('Greedy', ['Greedy Choice Property', 20], ['Intervals', 22])
    ])
  ],
  practice: [
    { kind: 'coding', label: 'Coding Problems', perUnit: 40, extendedPerUnit: 55 },
    { kind: 'company', label: 'Company Specific Problem Sets', perUnit: 15, extendedPerUnit: 25 }
  ],
  tests: [
    { kind: 'ai', label: 'A.I. Assisted Test', questions: 3, mins: 60 },
    { kind: 'approach', label: 'Approach Based Coding Test', questions: 4, mins: 75 },
    { kind: 'company', label: 'Company Specific Test', questions: 3, mins: 90 }
  ],
  interview: { label: 'DSA Mock Interview', perSubject: false, mins: 45 }
};

const devModule = (id, title, short, units) => ({
  id,
  tier: 'plus',
  title,
  short,
  icon: 'layers',
  subjects: [subject(title, units)],
  practice: [
    { kind: 'debugging', label: 'Debugging Practice', perUnit: 6, extendedPerUnit: 10 },
    { kind: 'vibe', label: 'Vibe Coding Practice', perUnit: 4, extendedPerUnit: 7 }
  ],
  tests: [
    { kind: 'debugging', label: 'Debugging Test (Proctored)', questions: 5, mins: 60 },
    { kind: 'vibe', label: 'Vibe Coding Test (Proctored)', questions: 2, mins: 90 }
  ],
  interview: { label: 'Development Mock Interview', perSubject: false, mins: 45 }
});

const mern = devModule('mern', 'Full Stack Development [MERN]', 'MongoDB, Express, React, Node', [
  unit('Web Foundations', ['HTML & Semantic Markup', 18], ['Modern CSS & Layout', 26], ['JavaScript Essentials', 30]),
  unit('React', ['Components & Props', 22], ['State & Effects', 26], ['Routing & Data Fetching', 28]),
  unit('Node & Express', ['Node Runtime', 20], ['REST APIs with Express', 30], ['Auth & Middleware', 26]),
  unit('MongoDB', ['Documents & Collections', 18], ['Mongoose Modelling', 24]),
  unit('Shipping', ['Deploying a MERN App', 22])
]);

const jfs = devModule('jfs', 'Full Stack Development [JFS]', 'Java, Spring Boot, React', [
  unit('Core Java', ['Java Refresher', 24], ['Collections', 26], ['Streams & Lambdas', 22]),
  unit('Spring Boot', ['Spring Fundamentals', 24], ['Building REST APIs', 30], ['Spring Data JPA', 28], ['Spring Security', 28]),
  unit('Frontend', ['React for Java Devs', 26], ['Connecting to Spring APIs', 22]),
  unit('Shipping', ['Testing & Deployment', 24])
]);

const devops = {
  id: 'devops',
  tier: 'plus',
  title: 'DevOps & Cloud Computing',
  short: 'Linux, Docker, CI/CD, Cloud',
  icon: 'cloud',
  subjects: [
    subject('DevOps & Cloud', [
      unit('Linux & Git', ['Linux for Developers', 22], ['Git Workflows', 20]),
      unit('Containers', ['Docker Fundamentals', 26], ['Docker Compose', 20], ['Kubernetes Basics', 28]),
      unit('CI/CD', ['Pipelines with GitHub Actions', 24]),
      unit('Cloud', ['Core Cloud Services', 26], ['Deploying to the Cloud', 24])
    ])
  ],
  practice: [
    { kind: 'lab', label: 'Hands-on Sandbox Labs', perUnit: 3, extendedPerUnit: 5 },
    { kind: 'mcq', label: 'MCQ Practice', perUnit: 10 }
  ],
  tests: [
    { kind: 'proctored', label: 'DevOps Test (Proctored)', questions: 30, mins: 45 }
  ],
  interview: { label: 'DevOps Mock Interview', perSubject: false, mins: 30 }
};

const systemDesign = {
  id: 'system-design',
  tier: 'plus',
  title: 'System Design',
  short: 'HLD & LLD',
  icon: 'chart',
  subjects: [
    subject('System Design', [
      unit('Foundations', ['Scalability Basics', 22], ['Load Balancing', 20], ['Caching', 24]),
      unit('Data', ['SQL vs NoSQL at Scale', 24], ['Sharding & Replication', 26]),
      unit('High Level Design', ['Design a URL Shortener', 30], ['Design a Chat System', 34], ['Design a News Feed', 32]),
      unit('Low Level Design', ['LLD Approach', 22], ['Design a Parking Lot', 28])
    ])
  ],
  practice: [
    { kind: 'sd', label: 'Interactive System Design Practice', perUnit: 2, extendedPerUnit: 4 }
  ],
  tests: [
    { kind: 'sd', label: 'Interactive System Design Test (Proctored)', questions: 1, mins: 60 }
  ],
  interview: { label: 'System Design Mock Interview', perSubject: false, mins: 45 }
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

/* Order = sidebar order: Core first, then Plus */
export const MODULES = [
  computerFundamentals, dbms, dsa,
  dsaAdvanced, mern, jfs, devops, systemDesign, genai, commBehavioural
];

export const TIER_LABELS = { core: 'Core Modules', plus: 'Plus Modules', ultra: 'Ultra' };

/* Ultra adds no new modules — it extends the Plus ones. These are its extras,
   shown as a third sidebar group (locked unless the learner is on Ultra). */
export const ULTRA_SECTIONS = [
  { id: 'extended-practice', title: 'Extended Practice', short: 'An extra Hard problem in every DSA Advanced unit', icon: 'sparkles' },
  { id: 'extra-attempts', title: 'Extra Test Attempts', short: 'A second attempt on every Plus-module test', icon: 'clipboard' },
  { id: 'mock-round-2', title: 'Round 2 Mock Interviews', short: 'A second interview round in each Plus module', icon: 'mic' }
];

/* ── derived helpers ── */
export const allLectures = (mod) =>
  mod.subjects.flatMap((s) => s.units.flatMap((u) => u.lectures.map((l) => ({ ...l, subjectId: s.id, unitId: u.id }))));

export const subjectLectures = (subj) => subj.units.flatMap((u) => u.lectures);

export const moduleUnlocked = (mod, planId) => (PLAN_TIERS[planId] || []).includes(mod.tier);

export const findModule = (id) => MODULES.find((m) => m.id === id) || null;
