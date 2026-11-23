/* ══════════════════════════════════════════════════════════════
   Goal advisor — what a learner can ask for, mapped to OUR catalog.
   Each track is a roadmap (roadmap.sh style: ordered stages) built
   only from CipherSchools modules, plus the plan that covers it.
   `keywords` are matched against the learner's own words; weights
   let specific words (e.g. "devops") beat generic ones ("job").
   ══════════════════════════════════════════════════════════════ */

/* Catalog entries the roadmaps point to (ids match learnerModules / premium module cards) */
export const CATALOG = {
  cf: { title: 'Computer Fundamentals', note: 'OS, CN & OOPs', plan: 'Core' },
  dbms: { title: 'DBMS', note: 'SQL, normalisation, transactions', plan: 'Core' },
  dsa: { title: 'DSA · Core', note: 'Arrays to graphs, 600+ questions', plan: 'Core' },
  dsaAdv: { title: 'DSA · Advanced', note: 'Heaps, DP, graphs, 1,200+ questions', plan: 'Plus' },
  dsaMastery: { title: 'DSA Mastery', note: 'Hard, interview-level patterns', plan: 'Ultra' },
  dev: { title: 'Full Stack Development', note: 'MERN or Java (JFS)', plan: 'Plus' },
  devops: { title: 'DevOps & Cloud', note: 'Linux, Docker, CI/CD, cloud', plan: 'Plus' },
  sd: { title: 'System Design', note: 'HLD & LLD with interactive practice', plan: 'Plus' },
  genai: { title: 'Generative A.I.', note: 'LLMs, prompting, RAG & AI apps', plan: 'Plus' },
  comm: { title: 'Communication & Behavioural', note: 'HR rounds & soft skills', plan: 'Plus' },
  mock: { title: 'A.I. Mock Interviews', note: 'Generic & company-specific rounds', plan: 'Core' },
  resume: { title: 'Resume Builder & ATS Checker', note: 'Free tools', plan: 'Free' }
};

/* stage: [title, catalog id, topics, weeks] */
const S = (title, mod, topics, weeks) => ({ title, mod, topics, weeks });

export const GOAL_TRACKS = [
  {
    id: 'placements', title: 'Software engineer placements', plan: 'Plus',
    blurb: 'The full path from fundamentals to offer: DSA, a real project, system design and mock interviews.',
    keywords: { placement: 3, placements: 3, placed: 3, 'get placed': 3, career: 1, jobs: 1, mnc: 2, 'service based': 2, tcs: 2, infosys: 2, wipro: 2, accenture: 2, sde: 3, 'software engineer': 3, 'software developer': 2, job: 1, campus: 2, internship: 2, intern: 2, interview: 1, interviews: 1, crack: 1, offer: 1, 'product based': 2, product: 1, 'tech job': 2 },
    stages: [
      S('Strengthen CS fundamentals', 'cf', ['Operating systems', 'Computer networks', 'OOPs'], 3),
      S('Learn DSA, topic by topic', 'dsa', ['Arrays & strings', 'Recursion', 'Linked lists', 'Trees'], 6),
      S('Go deeper in DSA', 'dsaAdv', ['Heaps', 'Graphs', 'Dynamic programming'], 6),
      S('Build and ship a project', 'dev', ['Pick MERN or Java', 'Auth & APIs', 'Deploy'], 6),
      S('Learn system design basics', 'sd', ['HLD building blocks', 'LLD patterns'], 3),
      S('Practise real interviews', 'mock', ['A.I. mock rounds', 'Company-specific tests'], 2)
    ]
  },
  {
    id: 'faang', title: 'Top product companies (FAANG)', plan: 'Ultra',
    blurb: 'Interview-level DSA, design depth and repeated company-style mock rounds.',
    keywords: { faang: 4, maang: 4, google: 3, amazon: 3, microsoft: 3, meta: 2, apple: 2, adobe: 2, uber: 2, 'top product': 3, 'top companies': 3, 'big tech': 3, competitive: 2, 'hard problems': 2, mastery: 2 },
    stages: [
      S('Core DSA, fast', 'dsa', ['Patterns over problems', 'Time & space'], 4),
      S('Advanced DSA', 'dsaAdv', ['Graphs', 'DP', 'Segment trees'], 6),
      S('Hard problem sets', 'dsaMastery', ['Hashing', 'Heaps', 'DP & greedy'], 6),
      S('System design depth', 'sd', ['Scalability', 'Caching', 'LLD'], 4),
      S('Company-style mock rounds', 'mock', ['2 rounds per company', 'A.I. feedback'], 3)
    ]
  },
  {
    id: 'fullstack', title: 'Full stack web developer', plan: 'Plus',
    blurb: 'Learn to build complete apps with MERN or Java, then deploy them and pass the interview.',
    keywords: { 'full stack': 4, fullstack: 4, mern: 4, web: 2, 'web developer': 3, frontend: 3, 'front end': 3, backend: 3, 'back end': 3, react: 3, node: 3, javascript: 3, js: 2, java: 2, spring: 3, 'spring boot': 3, website: 2, developer: 1, development: 2, app: 1 },
    stages: [
      S('Programming & OOPs', 'cf', ['OOPs', 'How the web works'], 2),
      S('Databases', 'dbms', ['SQL', 'Data modelling'], 2),
      S('Full stack development', 'dev', ['Frontend in React', 'APIs in Node or Spring', 'Auth'], 8),
      S('Ship it', 'devops', ['Docker', 'CI/CD', 'Deploy to cloud'], 3),
      S('DSA for interviews', 'dsa', ['Arrays to trees'], 4),
      S('Mock interviews', 'mock', ['Development rounds'], 1)
    ]
  },
  {
    id: 'ai', title: 'A.I. engineer (GenAI apps)', plan: 'Plus',
    blurb: 'Build with LLMs: prompting, RAG and agents, on top of solid programming and DSA.',
    keywords: { ai: 3, 'a.i.': 3, genai: 4, 'gen ai': 4, 'generative ai': 4, llm: 4, llms: 4, 'machine learning': 3, ml: 3, 'data science': 2, chatgpt: 3, gpt: 2, prompt: 3, prompting: 3, rag: 4, agent: 3, agents: 3, 'deep learning': 2 },
    stages: [
      S('Programming foundations', 'cf', ['OOPs', 'Python & tooling'], 2),
      S('DSA essentials', 'dsa', ['Arrays', 'Hashing', 'Recursion'], 4),
      S('Generative A.I.', 'genai', ['LLM basics', 'Prompting', 'RAG', 'Agents'], 6),
      S('Build an AI app', 'dev', ['APIs', 'Frontend', 'Deploy'], 4),
      S('Interview ready', 'mock', ['A.I. mock rounds'], 1)
    ]
  },
  {
    id: 'devops', title: 'DevOps & cloud engineer', plan: 'Plus',
    blurb: 'From operating systems and networking to containers, CI/CD and cloud.',
    keywords: { devops: 4, 'dev ops': 4, cloud: 3, aws: 3, azure: 3, gcp: 3, docker: 4, kubernetes: 4, k8s: 4, linux: 3, 'ci/cd': 4, cicd: 4, sre: 3, infra: 2, infrastructure: 2 },
    stages: [
      S('OS & networking', 'cf', ['Linux basics', 'Networking'], 3),
      S('DevOps & cloud', 'devops', ['Docker', 'CI/CD', 'Cloud services'], 6),
      S('System design', 'sd', ['Scaling', 'Reliability'], 3),
      S('DSA basics for interviews', 'dsa', ['Arrays to trees'], 3),
      S('Mock interviews', 'mock', ['A.I. rounds'], 1)
    ]
  },
  {
    id: 'systemdesign', title: 'System design interviews', plan: 'Plus',
    blurb: 'HLD and LLD with hands-on practice, on top of networking and database basics.',
    keywords: { 'system design': 5, hld: 4, lld: 4, architecture: 3, scalable: 3, scalability: 3, 'distributed systems': 3, microservices: 3, senior: 1 },
    stages: [
      S('Networking & databases', 'cf', ['Computer networks', 'Caching basics'], 2),
      S('Database depth', 'dbms', ['Indexes', 'Transactions'], 2),
      S('System design', 'sd', ['HLD', 'LLD', 'Load tests'], 5),
      S('Design mock rounds', 'mock', ['A.I. design interviews'], 1)
    ]
  },
  {
    id: 'basics', title: 'Programming from scratch', plan: 'Core',
    blurb: 'Start right: computer fundamentals, databases and DSA basics, one unit at a time.',
    keywords: { beginner: 4, basics: 3, scratch: 4, start: 2, 'first year': 4, '1st year': 4, 'second year': 3, '2nd year': 3, fundamentals: 3, os: 2, dbms: 3, sql: 2, oops: 3, gate: 3, 'learn coding': 3, coding: 1, programming: 2, 'c++': 2, python: 2, dsa: 2 },
    stages: [
      S('Computer fundamentals', 'cf', ['OS', 'Networks', 'OOPs'], 4),
      S('Databases', 'dbms', ['SQL', 'Normalisation'], 3),
      S('DSA basics', 'dsa', ['Arrays', 'Strings', 'Recursion', 'Trees'], 6),
      S('First mock interview', 'mock', ['Generic A.I. round'], 1)
    ]
  },
  {
    id: 'softskills', title: 'HR rounds & communication', plan: 'Plus',
    blurb: 'Clear answers for HR and behavioural rounds, plus a resume that gets shortlisted.',
    keywords: { hr: 4, communication: 4, 'soft skills': 4, behavioural: 4, behavioral: 4, english: 3, speaking: 3, resume: 3, cv: 3, ats: 3, confidence: 2, 'group discussion': 3, gd: 2 },
    stages: [
      S('Resume that gets shortlisted', 'resume', ['ATS check', 'Project write-ups'], 1),
      S('Communication & behavioural', 'comm', ['STAR answers', 'HR questions'], 3),
      S('Practise out loud', 'mock', ['HR mock rounds'], 1)
    ]
  }
];

/* Shown as one-tap ideas, and when nothing matches */
export const GOAL_SUGGESTIONS = [
  'Crack campus placements as a software engineer',
  'Become a full stack developer with MERN',
  'Get into Google or Amazon',
  'Build AI apps with LLMs',
  'Learn DevOps and cloud',
  'Start coding from scratch'
];
