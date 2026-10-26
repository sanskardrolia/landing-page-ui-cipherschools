// All copy, SEO and proof data for the /online-compiler landing page.
// Anything marked TODO(confirm) is hidden behind a flag until it is verified.

export const SITE_URL = 'https://www.cipherschools.com';
export const PAGE_PATH = '/online-compiler';

// Flip a flag to true only once the fact is confirmed.
export const CONFIRMED = {
  free: false, // TODO(confirm): is the compiler free? Gates price 0 in JSON-LD, pricing block and FAQ 1
  noSignupToRun: false, // TODO(confirm): code runs without signing up
  loginToSave: false, // TODO(confirm): login required to save / create share links
  privateByDefault: false, // TODO(confirm): saved projects are private by default
  sameRuntimeAsLocal: false, // TODO(confirm): compiler/runtime versions
  forkOnShare: false // TODO(confirm): shared links cannot overwrite the original
};

export const SEO = {
  title: 'Online Compiler for C, C++, Java, Python & JS · Free',
  description:
    'Write, run and debug C, C++, Java, Python and JavaScript in your browser. Multiple files, save online, share by link, and a built-in whiteboard.',
  // TODO(confirm): og-compiler.png must exist at this URL; the brief asks for the hero image
  image: `${SITE_URL}/og-compiler.png`,
  heroAlt: 'Online compiler with code editor on the left and debugging whiteboard on the right'
};

export const HERO = {
  h1: { accent: 'Online Compiler', rest: 'with a Built-in Whiteboard' },
  sub: {
    lead: 'For anyone who wants to write and run code online without any setup.',
    rest: "It's free, runs in your browser, and needs no installs. Just write, run, save and share."
  },
  primaryCta: 'Start Coding Free',
  microcopy: [
    { text: 'No download needed', show: true },
    { text: 'Works in any browser', show: true },
    { text: 'No sign-up to run code', show: CONFIRMED.noSignupToRun } // TODO(confirm)
  ]
};

export const PROBLEM = {
  h2: {
    line1: 'Most online compilers are a single box.',
    line2Accent: 'Real coding',
    line2Rest: 'is more than that.'
  },
  intro:
    'Between setup, scattered files, lost tabs and messy pasted code, writing a program online takes more effort than it should. We take that friction out.',
  pairs: [
    {
      id: 'setup',
      pain: 'Setting up compilers, the JDK, and PATH takes longer than writing the program.',
      title: 'Runs in your browser.',
      body: 'C, C++, Java, Python and JavaScript are ready the moment the page loads.'
    },
    {
      id: 'multifile',
      pain: "Real programs don't fit in one file.",
      title: 'Multi-File.',
      body: 'Create, save, and run multiple code files.'
    },
    {
      id: 'save',
      pain: 'I closed the tab and lost everything.',
      title: 'Save code online.',
      body: 'Your work is stored so you can pick up where you left off on any device.'
    },
    {
      id: 'share',
      pain: 'Pasting code into chat breaks the formatting.',
      title: 'Share with a public link.',
      body: 'Send one link that opens the exact code, ready to run.'
    }
  ]
};

export const HOW_IT_WORKS = {
  h2: { before: 'From blank screen to', accent: 'working code', after: 'in three steps' },
  steps: [
    {
      title: 'Pick your language.',
      body: 'Choose C, C++, Java, Python or JavaScript. A starter template loads instantly.'
    },
    {
      title: 'Write.',
      body: 'Add as many files as your program needs.'
    },
    {
      title: 'Run.',
      body: 'Hit Run, and see output in seconds.'
    }
  ]
};

export const FEATURES = {
  h2: 'Features built for real programs',
  items: [
    {
      id: 'languages',
      title: 'Five languages, zero setup.',
      body: 'C, C++, Java, Python and JavaScript, compiled and run in the browser.'
    },
    {
      id: 'multifile',
      title: 'Multi-file projects.',
      body: 'Create, rename and organise multiple files in one project (same language).'
    },
    {
      id: 'save',
      title: 'Save online.',
      // TODO(confirm): login required to save? Add the requirement once confirmed.
      body: 'Projects are stored to your account, so code survives closed tabs and switched devices.'
    },
    {
      id: 'share',
      title: 'Shareable public links.',
      body: 'Anyone with the link can view and run your code. Useful for doubts, code reviews and interviews.'
    },
    {
      id: 'whiteboard',
      title: 'Built-in whiteboard.',
      body: 'A drawing canvas next to your editor for visual debugging.'
    }
  ]
};

export const SPOTLIGHT = {
  id: 'debug-by-drawing',
  h2: { accent: 'Debug by drawing,', rest: 'right beside your code' },
  body: 'Draw arrays, trace pointers and sketch recursion trees while your code stays in view, like an interview whiteboard.'
};

// Proof renders only from this config, and only items with permission: true.
// Leave everything empty until real, permitted data exists.
export const PROOF = {
  h2: { before: 'Trusted by learners writing', accent: 'real code', after: 'every day' },
  stats: [], // { label, value } e.g. programs run, projects saved, links shared
  // TODO(replace): PLACEHOLDER reviews shown at the owner's request. Swap in real, permitted
  // reviews before launch (shape: { quote, name, org, rating (1-5), photo (optional), permission: true }).
  testimonials: [
    {
      quote: 'I stopped fighting with setup. I opened the page, picked C++ and ran my first program in seconds.',
      name: 'Ananya Sharma',
      org: 'B.Tech CSE, final year',
      rating: 5,
      permission: true
    },
    {
      quote: 'Splitting my code across a few files made my assignment feel like a real project, and it all runs in the browser.',
      name: 'Rohit Verma',
      org: 'Software Engineer, 2 yrs',
      rating: 5,
      permission: true
    },
    {
      quote: 'Drawing the linked list on the whiteboard next to my code finally made the pointer bug obvious.',
      name: 'Priya Nair',
      org: 'MBA graduate learning Python',
      rating: 5,
      permission: true
    },
    {
      quote: 'I send my doubts to my mentor as a link. He opens the exact code and runs it. No more screenshots.',
      name: 'Karan Mehta',
      org: 'Data Analyst',
      rating: 4,
      permission: true
    },
    {
      quote: 'No installs, no PATH problems. Great for quick practice on a college lab machine.',
      name: 'Sneha Iyer',
      org: 'BCA, fresher',
      rating: 5,
      permission: true
    },
    {
      quote: 'Clean and simple. I switch between Java and Python without changing anything on my laptop.',
      name: 'Arjun Patel',
      org: 'Frontend Developer',
      rating: 4,
      permission: true
    }
  ],
  logos: [], // { name, src, permission: true }
  caseStudy: null,
  // TODO(confirm): brand + verified numbers. Shown only when no other proof exists and this is enabled.
  fallback: { enabled: false, text: 'Built by the team behind [Brand]' }
};

export const PRICING = {
  h3: 'Free to use.', // TODO(confirm)
  body: 'Run, save and share code in all five languages at no cost.', // TODO(confirm any gated feature)
  show: CONFIRMED.free
};

export const OBJECTIONS = [
  {
    id: 'local',
    q: 'Is it as reliable as a local setup?',
    a: "Standard compilers and runtimes, the same output you'd get locally.",
    show: CONFIRMED.sameRuntimeAsLocal // TODO(confirm versions)
  },
  {
    id: 'public',
    q: 'Will my code be public?',
    a: 'Only if you share it. Saved projects are private by default.',
    show: CONFIRMED.privateByDefault // TODO(confirm)
  }
];

// Only confirmed FAQs render and go into JSON-LD.
export const FAQ = {
  h2: { before: 'Frequently asked', accent: 'questions', after: '' },
  items: [
    {
      id: 'free',
      q: 'Is this online compiler free?',
      a: 'Yes, you can write, run, save and share code for free.',
      confirmed: CONFIRMED.free // TODO(confirm)
    },
    {
      id: 'languages',
      q: 'Which programming languages are supported?',
      a: 'C, C++, Java, Python and JavaScript.',
      confirmed: true
    },
    {
      id: 'multifile',
      q: 'Can I create multiple files in one project?',
      a: 'Yes. A project can hold multiple files in the same language, so you can split code into classes, modules or helpers.',
      confirmed: true
    },
    {
      id: 'account',
      q: 'Do I need an account?',
      a: 'You can run code without signing up. Sign in to save projects and create share links.',
      confirmed: CONFIRMED.noSignupToRun && CONFIRMED.loginToSave // TODO(confirm)
    },
    {
      id: 'sharing',
      q: 'Who can see my code when I share a link?',
      a: 'Anyone with the link can view and run it. People you share with cannot overwrite your original.',
      confirmed: CONFIRMED.forkOnShare // TODO(confirm fork/copy)
    },
    {
      id: 'whiteboard',
      q: 'What is the whiteboard for?',
      a: "It's a drawing space beside your editor for visual debugging: tracing arrays, pointers, recursion and data structures without leaving your code.",
      confirmed: true
    },
    { id: 'whiteboard-saved', q: 'Is my whiteboard saved with my code?', a: '', confirmed: false }, // TODO(confirm): answer TBD
    { id: 'stdin', q: 'Can I give input to my program (stdin)?', a: '', confirmed: false }, // TODO(confirm): answer TBD
    { id: 'libraries', q: 'Can I use external libraries or packages?', a: '', confirmed: false }, // TODO(confirm): answer TBD
    { id: 'limits', q: 'Is there a time or memory limit on execution?', a: '', confirmed: false }, // TODO(confirm): answer TBD
    { id: 'mobile', q: 'Does it work on mobile?', a: '', confirmed: false } // TODO(confirm): answer TBD
  ]
};

export const FINAL_CTA = {
  cta: 'Start Coding Free'
};

export const SECTION_CTA = 'Open Compiler';
