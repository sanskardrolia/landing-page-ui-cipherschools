/*
 * Resume data model shared by the builder form and the template renderers.
 * Multi-line fields use "-" at the start of a line for each bullet point.
 */

export const TEMPLATE_IDS = ['beginner', 'experienced', 'modern'];

export const TEMPLATE_NAMES = {
  beginner: 'Beginner',
  experienced: 'Experienced',
  modern: 'Modern',
};

export const SCORE_TYPES = ['CGPA', 'GPA', 'Percentage'];

export const DEFAULT_SKILL_CATEGORIES = [
  'Technical Skills',
  'Programming Languages',
  'Libraries / Frameworks',
  'Tools / Platforms',
  'Databases',
];

let idCounter = 0;
export const newId = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}_${(idCounter++).toString(36)}`;

export const emptyEducation = () => ({
  id: newId('edu'),
  institution: '',
  location: '',
  degree: '',
  field: '',
  startYear: '',
  gradYear: '',
  scoreType: 'CGPA',
  score: '',
});

export const emptyExperience = () => ({
  id: newId('exp'),
  employer: '',
  title: '',
  startDate: '',
  endDate: '',
  location: '',
  current: false,
  achievements: '',
});

export const emptySkill = (category = '') => ({
  id: newId('skl'),
  category,
  skills: '',
});

export const emptyProject = () => ({
  id: newId('prj'),
  title: '',
  github: '',
  link: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
});

export const emptyCertification = () => ({
  id: newId('crt'),
  title: '',
  link: '',
  issuer: '',
});

export const emptyAdditional = () => ({
  id: newId('add'),
  heading: '',
  description: '',
});

export const emptyResume = () => ({
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    phone: '',
    github: '',
    linkedin: '',
    portfolio: '',
  },
  education: [emptyEducation()],
  experience: [],
  skills: DEFAULT_SKILL_CATEGORIES.map((c) => emptySkill(c)),
  projects: [],
  certifications: [],
  additional: [],
});

/* ── Formatting helpers used by the templates ── */

// "- Built X\n- Shipped Y" -> ["Built X", "Shipped Y"]
export const toBullets = (text = '') =>
  text
    .split('\n')
    .map((line) => line.replace(/^\s*[-•*]\s*/, '').trim())
    .filter(Boolean);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2024-05" -> "May 2024"
export const formatMonth = (value = '') => {
  const [y, m] = value.split('-');
  if (!y) return '';
  const month = MONTHS[Number(m) - 1];
  return month ? `${month} ${y}` : y;
};

export const formatRange = (start, end, current) => {
  const s = formatMonth(start);
  const e = current ? 'Present' : formatMonth(end);
  if (s && e) return `${s} - ${e}`;
  return s || e || '';
};

export const yearRange = (start, end) => [start, end].filter(Boolean).join(' - ');

export const fullName = (p = {}) => [p.firstName, p.lastName].filter(Boolean).join(' ');

// "https://github.com/anuragm/" -> "github.com/anuragm"
export const displayUrl = (url = '') => url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');

export const formatScore = (edu) => {
  if (!edu.score) return '';
  return edu.scoreType === 'Percentage' ? `${edu.score}%` : `${edu.scoreType}: ${edu.score}`;
};

export const skillList = (skills = '') =>
  skills.split(',').map((s) => s.trim()).filter(Boolean).join(', ');

// Additional sections with these headings render as a summary paragraph under the name
export const SUMMARY_HEADING_RE = /^(professional\s+)?(summary|profile|objective|about)/i;

/* Filled sections only, so empty form rows never print blank headings */
export const visible = (resume) => ({
  summary: resume.additional
    .filter((a) => SUMMARY_HEADING_RE.test(a.heading.trim()) && a.description.trim())
    .map((a) => toBullets(a.description).join(' '))
    .join(' '),
  education: resume.education.filter((e) => e.institution || e.degree),
  experience: resume.experience.filter((e) => e.employer || e.title),
  skills: resume.skills.filter((s) => s.category && s.skills.trim()),
  projects: resume.projects.filter((p) => p.title),
  certifications: resume.certifications.filter((c) => c.title),
  additional: resume.additional.filter((a) => (a.heading || a.description) && !SUMMARY_HEADING_RE.test(a.heading.trim())),
});

/* ── Sample resumes for the landing page previews ── */
export const SAMPLE_RESUMES = {
  beginner: {
    personal: {
      firstName: 'Anurag', lastName: 'Mishra', email: 'anurag.m@mail.com', location: 'Jalandhar, Punjab',
      phone: '+91 98xxx xxx42', github: 'github.com/anuragm', linkedin: 'linkedin.com/in/anuragm', portfolio: '',
    },
    education: [
      { id: 's1', institution: 'Lovely Professional University', location: 'Phagwara', degree: 'B.Tech', field: 'Computer Science', startYear: '2022', gradYear: '2026', scoreType: 'CGPA', score: '8.6' },
      { id: 's2', institution: 'Delhi Public School', location: 'Lucknow', degree: 'Class XII', field: 'CBSE', startYear: '2020', gradYear: '2022', scoreType: 'Percentage', score: '91.4' },
      { id: 's3', institution: 'Delhi Public School', location: 'Lucknow', degree: 'Class X', field: 'CBSE', startYear: '2018', gradYear: '2020', scoreType: 'Percentage', score: '94.2' },
    ],
    experience: [
      { id: 's4', employer: 'CipherSchools', title: 'Web Development Intern', startDate: '2025-05', endDate: '2025-07', location: 'Remote', current: false,
        achievements: '- Built React dashboards that track course progress for 10k+ learners\n- Cut page load time by 30% by lazy-loading video thumbnails' },
    ],
    skills: [
      { id: 's5', category: 'Programming Languages', skills: 'C++, Java, Python, JavaScript' },
      { id: 's6', category: 'Libraries / Frameworks', skills: 'React, Node.js, Express' },
      { id: 's7', category: 'Tools / Platforms', skills: 'Git, Docker, Postman, VS Code' },
      { id: 's8', category: 'Databases', skills: 'MySQL, MongoDB' },
    ],
    projects: [
      { id: 's9', title: 'Campus Food Ordering App', github: 'github.com/anuragm/canteen', link: '', startDate: '2025-01', endDate: '2025-04', current: false,
        description: '- Built a React + Firebase app that takes live orders from 4 campus canteens\n- Reduced average queue time from 14 to 5 minutes for 1,200+ daily users\n- Added role-based dashboards for canteen staff with real-time order status' },
      { id: 's10', title: 'Sorting Algorithm Visualiser', github: 'github.com/anuragm/sortviz', link: '', startDate: '2024-08', endDate: '2024-09', current: false,
        description: '- Animated 8 sorting algorithms step by step using JavaScript and Canvas\n- Used by 300+ juniors in the DSA study group' },
    ],
    certifications: [
      { id: 's11', title: 'Full Stack Web Development', link: '', issuer: 'CipherSchools' },
      { id: 's12', title: 'Data Structures and Algorithms in C++', link: '', issuer: 'CipherSchools' },
    ],
    additional: [
      { id: 's13', heading: 'Interests and Hobbies', description: '- Competitive Programming\n- Playing Chess' },
    ],
  },
  experienced: {
    personal: {
      firstName: 'Riya', lastName: 'Kapoor', email: 'riya.k@mail.com', location: 'Bengaluru, India',
      phone: '+91 98xxx xxx17', github: 'github.com/riyak', linkedin: 'linkedin.com/in/riyakapoor', portfolio: '',
    },
    education: [
      { id: 'e1', institution: 'Netaji Subhas University of Technology', location: 'New Delhi, India', degree: 'Bachelor of Technology', field: 'Information Technology', startYear: '2017', gradYear: '2021', scoreType: 'CGPA', score: '8.4' },
    ],
    experience: [
      { id: 'e2', employer: 'Razorpay', title: 'Software Engineer II', startDate: '2023-07', endDate: '', location: 'Bengaluru', current: true,
        achievements: '- Cut p95 checkout API latency by 38% with Redis read-through caching\n- Shipped a self-serve refunds dashboard used by 12,000+ merchants\n- Reduced pager alerts by 45% by adding SLO-based alerting' },
      { id: 'e3', employer: 'Zeta', title: 'Software Engineer', startDate: '2021-07', endDate: '2023-06', location: 'Remote', current: false,
        achievements: '- Led migration of 40+ Node.js services to TypeScript with zero downtime\n- Built REST APIs that issue 200k+ virtual cards a month' },
    ],
    skills: [
      { id: 'e4', category: 'Programming Languages', skills: 'TypeScript, JavaScript, Python, Go, SQL' },
      { id: 'e5', category: 'Libraries / Frameworks', skills: 'React, Next.js, Node.js, Express, NestJS' },
      { id: 'e6', category: 'Tools / Platforms', skills: 'Docker, Kubernetes, AWS, GCP, Kafka' },
      { id: 'e7', category: 'Databases', skills: 'PostgreSQL, Redis, MongoDB' },
    ],
    projects: [
      { id: 'e8', title: 'DevPulse', github: 'github.com/riyak/devpulse', link: '', startDate: '2024-03', endDate: '', current: true,
        description: '- Lightweight request tracing library for Express apps with 1.1k GitHub stars' },
      { id: 'e9', title: 'PeerPrep', github: '', link: 'peerprep.dev', startDate: '2022-08', endDate: '2022-11', current: false,
        description: '- Mock-interview platform pairing candidates in real time; 640 sign-ups in the first month' },
    ],
    certifications: [
      { id: 'e10', title: 'AWS Certified Developer - Associate', link: '', issuer: 'Amazon Web Services' },
    ],
    additional: [
      { id: 'e11', heading: 'Honors and Awards', description: '- Winner, Razorpay Internal Hackathon 2024\n- Runner-up, Smart India Hackathon 2020' },
    ],
  },
  modern: {
    personal: {
      firstName: 'Priya', lastName: 'Sharma', email: 'priya.s@mail.com', location: 'Bengaluru, KA',
      phone: '+91 98xxx xxx08', github: 'github.com/priyasharma', linkedin: 'linkedin.com/in/priya-sharma', portfolio: 'priyasharma.dev',
    },
    education: [
      { id: 'm1', institution: 'VIT University', location: 'Vellore, TN', degree: 'MS', field: 'Data Science', startYear: '2021', gradYear: '2023', scoreType: 'CGPA', score: '9.1' },
      { id: 'm2', institution: 'IIIT Gwalior', location: 'Gwalior, MP', degree: 'B.Tech', field: 'Computer Science', startYear: '2017', gradYear: '2021', scoreType: 'CGPA', score: '8.3' },
    ],
    experience: [
      { id: 'm3', employer: 'Swiggy', title: 'Data Scientist', startDate: '2023-07', endDate: '', location: 'Bengaluru, KA', current: true,
        achievements: '- Built a delivery-time model that cut ETA error by 22% across 600+ cities\n- Automated weekly demand forecasts with Airflow, saving 30 analyst hours a month' },
      { id: 'm4', employer: 'Flipkart', title: 'Machine Learning Intern', startDate: '2023-01', endDate: '2023-06', location: 'Bengaluru, KA', current: false,
        achievements: '- Trained a product-image classifier with 94% accuracy on 1.2M listings\n- Reduced manual catalogue tagging effort by 35%' },
    ],
    skills: [
      { id: 'm5', category: 'Programming Languages', skills: 'Python, R, SQL, C++' },
      { id: 'm6', category: 'Libraries / Frameworks', skills: 'Pandas, PyTorch, scikit-learn' },
      { id: 'm7', category: 'Tools / Platforms', skills: 'Tableau, Airflow, Git' },
    ],
    projects: [
      { id: 'm8', title: 'Churn Prediction', github: 'github.com/priyasharma/churn', link: '', startDate: '2022-11', endDate: '2022-12', current: false,
        description: '- Predicted telecom churn with gradient-boosted trees (0.91 AUC)\n- Explained key drivers with SHAP values for the product team' },
    ],
    certifications: [
      { id: 'm9', title: 'Deep Learning Specialization', link: '', issuer: 'Coursera' },
    ],
    additional: [
      { id: 'm10', heading: 'Competitions', description: '- Winner, Smart India Hackathon 2020 (Software Edition)' },
    ],
  },
};
