import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, ChevronLeft, Sparkles, Bot, Code2, Code, Users, Zap, Coffee, Network, Laptop, Plus, Briefcase, TrendingUp, Target, Wrench, MessageSquare, Rocket, Presentation, Flame, Compass, Globe, RefreshCw, X, CheckCircle2, Play, Lock, User, AlertTriangle, FileText, Clock, BookOpen, Award, HelpCircle, ArrowDown, Menu, Search, Bell, Sun, Home, Calendar, ClipboardList, BarChart2, Folder, Volume2, GraduationCap, ChevronRight, ChevronDown, CornerDownRight, ExternalLink, Brain, BrainCircuit, Cpu, Calculator, Database, Check, Terminal, Layers, UploadCloud, Mic, RotateCcw, Download, UserCheck, MicOff, Video, VideoOff, PhoneOff, Info } from 'lucide-react';
import BookMeetingModal from './BookMeetingModal';
import './ForUniversities.css';

/* ─── Typing animation component ─── */
const TypingText = ({ text, delay = 0, speed = 40 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return <span>{displayedText}</span>;
};

/* ─── Typewriter Chat Question Component ─── */
const TypewriterChatQuestion = ({ inView }) => {
  const fullText = "How CipherSchools can help your university?";
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setDisplayedLength(0);
    let current = 0;
    const interval = setInterval(() => {
      if (current <= fullText.length) {
        setDisplayedLength(current);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 38);
    return () => clearInterval(interval);
  }, [inView]);

  const currentText = fullText.slice(0, displayedLength);

  const renderTextWithHighlight = (str) => {
    const target = "CipherSchools";
    const idx = str.indexOf(target);
    if (idx === -1) return str;
    const before = str.slice(0, idx);
    const match = str.slice(idx, idx + target.length);
    const after = str.slice(idx + target.length);
    return (
      <>
        {before}
        <span className="fu-pitch-accent">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className="fu-smart-help-header-row">
      <p className="fu-smart-help-question">
        {renderTextWithHighlight(currentText)}
        <span className="fu-typing-cursor">|</span>
      </p>
    </div>
  );
};

/* ─── Scroll-reveal hook (callback ref) ─── */
const useReveal = (threshold = 0.15) => {
  const [visible, setVisible] = useState(false);
  const obsRef = useRef(null);

  const ref = useCallback((node) => {
    if (obsRef.current) obsRef.current.disconnect();
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(node); } },
      { threshold }
    );
    obs.observe(node);
    obsRef.current = obs;
  }, [threshold]);

  return [ref, visible];
};


/* ─── Open Source Tech Stack SVGs ─── */
const getTechLogo = (skill) => {
  if (!skill || typeof skill !== 'string') {
    return <Code2 size={16} className="tech-icon-amber" />;
  }
  try {
    if (skill.includes('Next.js') || skill.includes('React') || skill.includes('Frontend') || skill.includes('Tailwind')) {
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#000000">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.4 14.8-5.3-7.5v7.5H9.6V7.2h1.6l5.3 7.5V7.2h1.5v9.6z"/>
        </svg>
      );
    }
    if (skill.includes('DevOps') || skill.includes('Docker') || skill.includes('IaC') || skill.includes('Terraform')) {
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#2496ED">
          <path d="M13.98 11.08h2.12v2.12h-2.12zm-3.18 0h2.12v2.12h-2.12zm-3.18 0h2.12v2.12H7.62zm-3.18 0h2.12v2.12H4.44zm3.18-3.18h2.12v2.12H7.62zm3.18 0h2.12v2.12h-2.12zm3.18 0h2.12v2.12h-2.12zm-6.36-3.18h2.12v2.12H7.62zm3.18 0h2.12v2.12h-2.12zm11.75 6.94c-.45-.33-1.42-.45-2.27-.33-.27-1.12-1.09-2.07-2.19-2.58l-.4-.18-.28.33c-.66.77-.96 1.76-.9 2.76H1.5v1.89c0 3.86 2.92 7 6.51 7 4.14 0 7.42-3.15 7.82-7.14.7-.09 1.94-.48 2.5-1.43l.23-.38-.27-.22z"/>
        </svg>
      );
    }
    if (skill.includes('AWS') || skill.includes('Cloud') || skill.includes('Security')) {
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#FF9900">
          <path d="M18.75 14.23c-1.34 1.07-3.23 1.62-4.91 1.62-2.37 0-4.5-.89-6.13-2.37-.13-.12-.29-.06-.23.1.52 1.34 1.76 2.73 3.39 3.49 1.78.83 3.73.95 5.56.44.25-.07.39-.33.25-.56l-.32-.57c-.11-.2-.36-.26-.61-.15zm1.57-2.48c-.28-.36-1.85-.43-2.54-.34-.21.03-.25.26-.06.39.63.43 1.66.74 2.33.37.19-.11.45-.19.27-.42zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        </svg>
      );
    }
    if (skill.includes('Python') || skill.includes('PyTorch')) {
      return (
        <svg width="17" height="17" viewBox="0 0 24 24">
          <path fill="#3776AB" d="M11.89 2c-4.22 0-3.95 1.83-3.95 1.83l.01 1.9h4.02v.57H6.38s-2.38.27-2.38 3.94c0 3.67 2.07 3.54 2.07 3.54h1.24v-1.74s-.07-2.07 2.04-2.07h3.49s1.97.03 1.97-1.92V3.97S16.27 2 11.89 2z"/>
          <path fill="#FFD43B" d="M12.11 22c4.22 0 3.95-1.83 3.95-1.83l-.01-1.9h-4.02v-.57h5.59s2.38-.27 2.38-3.94c0-3.67-2.07-3.54-2.07-3.54h-1.24v1.74s.07 2.07-2.04 2.07h-3.49s-1.97-.03-1.97 1.92v3.98S7.73 22 12.11 22z"/>
        </svg>
      );
    }
    if (skill.includes('Vercel') || skill.includes('Edge')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000">
          <path d="M12 1L24 22H0L12 1Z"/>
        </svg>
      );
    }
    if (skill.includes('Kubernetes')) {
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#326CE5">
          <path d="M12 2L2.5 7.5v11L12 24l9.5-5.5v-11L12 2zm0 3.5l6.5 3.8v7.4L12 20.5l-6.5-3.8V9.3L12 5.5z"/>
        </svg>
      );
    }
    if (skill.includes('PostgreSQL') || skill.includes('Database') || skill.includes('Redis')) {
      return <Database size={16} className="tech-icon-emerald" />;
    }
    if (skill.includes('GenAI') || skill.includes('LLM') || skill.includes('AI')) {
      return <Brain size={16} className="tech-icon-purple" />;
    }
  } catch (err) {
    console.error("Tech logo error:", err);
  }
  return <Code2 size={16} className="tech-icon-amber" />;
};

/* ─── Tech Pairing Combos & Industry Outcome Mapping ─── */
const DOMAIN_MAPPINGS = [
  {
    id: 'fullstack-cloud',
    title: 'Full-Stack + Cloud Engineering',
    role: 'SDE II / Full-Stack Engineer',
    avgSalary: '₹14 - 28 LPA',
    demandScore: '98% Recruiter Alignment',
    skills: ['MERN / Next.js', 'DevOps & CI/CD', 'AWS Cloud Deployment'],
    icon: <Globe size={20} />
  },
  {
    id: 'dsa-genai',
    title: 'DSA + Generative AI Architect',
    role: 'AI / ML Engineer',
    avgSalary: '₹16 - 32 LPA',
    demandScore: '96% Recruiter Alignment',
    skills: ['Advanced DSA', 'Python / PyTorch', 'GenAI & LLM Fine-Tuning'],
    icon: <Brain size={20} />
  },
  {
    id: 'backend-systems',
    title: 'Backend + System Design',
    role: 'Backend Systems Engineer',
    avgSalary: '₹15 - 30 LPA',
    demandScore: '95% Recruiter Alignment',
    skills: ['Core Java / Go', 'PostgreSQL & Redis', 'System Design & Microservices'],
    icon: <Database size={20} />
  },
  {
    id: 'frontend-ux',
    title: 'Frontend + AI Engineering',
    role: 'Frontend Product Architect',
    avgSalary: '₹12 - 24 LPA',
    demandScore: '94% Recruiter Alignment',
    skills: ['React / TypeScript', 'Tailwind & UI Engineering', 'Vercel / Edge AI'],
    icon: <Code2 size={20} />
  },
  {
    id: 'devops-sec',
    title: 'DevOps + Cloud Security',
    role: 'Cloud Infrastructure Engineer',
    avgSalary: '₹14 - 26 LPA',
    demandScore: '93% Recruiter Alignment',
    skills: ['Docker & Kubernetes', 'Terraform / IaC', 'Cloud Security & Monitoring'],
    icon: <Cpu size={20} />
  }
];

/* ─── Gemini AI Fluid Text Reveal Component (Hero Style with Campus Scribbles) ─── */
const GeminiTextReveal = () => {
  return (
    <div className="fu-hero-header-wrap">
      {/* Floating Campus Scribble 1: Graduation Cap Doodle (Left) */}
      <div className="fu-scribble-doodle fu-scribble-mortarboard" aria-hidden="true">
        <svg width="68" height="56" viewBox="0 0 74 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cap Diamond */}
          <path d="M37 6 L68 18 L37 30 L6 18 Z" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="#FFFFFF" />
          {/* Cap Skull Base */}
          <path d="M19 23 V34 C19 39 27 43 37 43 C47 43 55 39 55 34 V23" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Tassel Button & String */}
          <circle cx="37" cy="18" r="2.5" fill="#F3912E" />
          <path d="M37 18 Q 48 24 53 32" stroke="#F3912E" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M53 32 L51 44 M53 32 L54 44 M53 32 L57 43" stroke="#F3912E" strokeWidth="2" strokeLinecap="round" />
          {/* Sparkle lines */}
          <path d="M10 8 L6 4 M14 5 L14 1 M5 12 L1 12" stroke="#F3912E" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* Floating Campus Scribble 2: University Pillar Building Doodle (Right) */}
      <div className="fu-scribble-doodle fu-scribble-campus" aria-hidden="true">
        <svg width="72" height="60" viewBox="0 0 78 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pediment / Roof Triangle */}
          <path d="M8 22 L39 6 L70 22 Z" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="#FFFFFF" />
          {/* Architrave Beam */}
          <path d="M11 26 H67" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
          {/* Pillars */}
          <path d="M18 27 V52 M24 27 V52" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M36 27 V52 M42 27 V52" stroke="#F3912E" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M54 27 V52 M60 27 V52" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
          {/* Base Steps */}
          <path d="M10 54 H68" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M5 60 H73" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
          {/* Star / Sparkle */}
          <path d="M68 6 L70 12 L76 14 L70 16 L68 22 L66 16 L60 14 L66 12 Z" fill="#F3912E" opacity="0.8" />
        </svg>
      </div>

      {/* Top Hero Pill Badge */}
      <div className="fu-hero-pill-badge">
        <span className="fu-pill-dot"></span>
        <span>FOR UNIVERSITIES & INSTITUTIONS</span>
        <span className="fu-pill-arrow">→</span>
      </div>

      <h1 className="gemini-ai-reveal-title">
        <span className="gemini-title-line">
          <span className="gemini-word" style={{ animationDelay: '0.05s' }}>We</span>{' '}
          <span className="gemini-word" style={{ animationDelay: '0.1s' }}>are</span>{' '}
          <span className="gemini-word" style={{ animationDelay: '0.15s' }}>the</span>{' '}
          <span className="gemini-word gemini-accent" style={{ animationDelay: '0.2s' }}>Ultimate Arms</span>{' '}
          <span className="gemini-word" style={{ animationDelay: '0.28s' }}>for</span>
        </span>
        <span className="gemini-title-line">
          <span className="gemini-word gemini-accent" style={{ animationDelay: '0.36s' }}>Training</span>{' '}
          <span className="gemini-word" style={{ animationDelay: '0.44s' }}>and</span>{' '}
          <span className="fu-scribble-word-wrapper">
            <span className="gemini-word gemini-accent" style={{ animationDelay: '0.52s' }}>Placement Support</span>
            <svg className="fu-scribble-underline" viewBox="0 0 320 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M4 12 Q 90 18 170 11 Q 250 5 314 13 Q 230 17 150 16 Q 70 15 10 16" 
                stroke="#F3912E" 
                strokeWidth="3.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </span>
        </span>
      </h1>
    </div>
  );
};


/* ─── Multi-Language Coding Sandbox Pseudo-Code Snippets ─── */
const SANDBOX_LANG_SNIPPETS = {
  Python: {
    code: (
      <>
        <span className="fm-comment"># CipherSchools Automated Evaluator</span><br/>
        <span className="fm-kwd">def</span> <span className="fm-func">evaluate_solution</span>(code, test_suite):<br/>
        &nbsp;&nbsp;sandbox = <span className="fm-func">CipherSandbox</span>(timeout_ms=<span className="fm-num">1000</span>, memory_limit=<span className="fm-str">"256MB"</span>)<br/>
        &nbsp;&nbsp;<span className="fm-kwd">return</span> sandbox.<span className="fm-func">run_tests</span>(code, test_suite)  <span className="fm-comment"># 14/14 auto-graded</span>
      </>
    )
  },
  JAVA: {
    code: (
      <>
        <span className="fm-comment">// CipherSchools Automated Evaluator</span><br/>
        <span className="fm-kwd">public class</span> <span className="fm-func">CipherEvaluator</span> &#123;<br/>
        &nbsp;&nbsp;<span className="fm-kwd">public static</span> TestResult <span className="fm-func">evaluate</span>(Code submission, TestCase[] suite) &#123;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="fm-kwd">return new</span> <span className="fm-func">CipherSandbox</span>(Limits.MB_256).<span className="fm-func">runSuite</span>(submission, suite);<br/>
        &nbsp;&nbsp;&#125;<br/>
        &#125;
      </>
    )
  },
  'C++': {
    code: (
      <>
        <span className="fm-comment">// CipherSchools Automated Evaluator</span><br/>
        <span className="fm-kwd">auto</span> <span className="fm-func">evaluateSolution</span>(<span className="fm-kwd">const</span> Code&amp; code, <span className="fm-kwd">const</span> vector&lt;TestCase&gt;&amp; suite) &#123;<br/>
        &nbsp;&nbsp;CipherSandbox <span className="fm-func">sandbox</span>(Timeout::ms(<span className="fm-num">1000</span>), Memory::MB(<span className="fm-num">256</span>));<br/>
        &nbsp;&nbsp;<span className="fm-kwd">return</span> sandbox.<span className="fm-func">evaluateAll</span>(code, suite); <span className="fm-comment">// Verified all edge-cases</span><br/>
        &#125;
      </>
    )
  },
  C: {
    code: (
      <>
        <span className="fm-comment">/* CipherSchools Automated Evaluator */</span><br/>
        CipherScore <span className="fm-func">evaluate_solution</span>(<span className="fm-kwd">const char</span>* code, TestCase suite[], <span className="fm-kwd">int</span> n) &#123;<br/>
        &nbsp;&nbsp;CipherSandbox* s = <span className="fm-func">cipherschools_init</span>(<span className="fm-num">1000</span>, <span className="fm-num">256</span>);<br/>
        &nbsp;&nbsp;<span className="fm-kwd">return</span> <span className="fm-func">cipherschools_grade_suite</span>(s, code, suite, n);<br/>
        &#125;
      </>
    )
  }
};

/* ─── Proctored Assessment Formats / Exam Tracks ─── */
const EXAM_TRACKS = [
  {
    id: 'mcq',
    name: 'Logical Reasoning - MCQ Test',
    tag: 'MCQ Evaluation',
    time: '12:30 left',
    category: 'Logical Reasoning',
    question: 'If all A are B, and some B are C, which statement is true?',
    options: [
      { text: 'All A are C', active: false },
      { text: 'None of the above', active: true }
    ]
  },
  {
    id: 'system_design',
    name: 'System Design Test',
    tag: 'Architecture',
    time: '45:00 left',
    category: 'System Architecture',
    question: 'Design a low-latency Distributed Rate Limiter for API Gateways',
    specs: [
      '• Token Bucket Algorithm (Redis Cluster)',
      '• Fallback Circuit Breaker & 99.99% Availability'
    ]
  },
  {
    id: 'cp',
    name: 'Competitive Programming Test',
    tag: 'DSA & Speed',
    time: '60:00 left',
    category: 'Algorithms',
    question: 'Find maximum sum contiguous subarray with at most K elements',
    specs: [
      '• Limits: 1000ms / 256MB • Strict Edge Cases',
      '• Status: 18/18 Hidden Testcases Passed ✓'
    ]
  },
  {
    id: 'sql',
    name: 'SQL Test',
    tag: 'Database Queries',
    time: '25:00 left',
    category: 'Relational DB',
    question: 'Calculate running total & 30-day moving average per student batch',
    specs: [
      '• Window Function: OVER (ORDER BY created_at ROWS ...)',
      '• Status: Query Cost Optimized (Index Scan) ✓'
    ]
  }
];

/* ─── University Syllabus Dataset ─── */
const SYLLABUS_MODULES = [
  {
    id: 'm1',
    week: 'Weeks 1–3',
    title: 'Foundations of Algorithms & Asymptotic Complexity',
    lectures: 8,
    labs: 4,
    status: 'Delivered ✓',
    statusClass: 'completed',
    topics: [
      { name: 'Asymptotic Notations (Big-O, Omega, Theta)', done: true },
      { name: 'Prefix Sums, Hashing & Frequency Arrays', done: true },
      { name: 'Two-Pointer & Sliding Window Paradigms', done: true },
      { name: 'Amortized Analysis & Dynamic Memory in C++', done: true }
    ],
    featuredLab: 'Distinct Divisible Subarrays (Hard)',
    labDifficulty: 'Hard'
  },
  {
    id: 'm2',
    week: 'Weeks 4–6',
    title: 'Linear Collections & Monotonic Structures',
    lectures: 9,
    labs: 4,
    status: 'In Progress ⚡',
    statusClass: 'in-progress',
    topics: [
      { name: 'Singly & Doubly Linked List Inversions', done: true },
      { name: 'Floyd’s Cycle Detection Algorithm', done: true },
      { name: 'Monotonic Stacks & Next Greater Element', done: false },
      { name: 'Circular Buffers & Deque Architectures', done: false }
    ],
    featuredLab: 'Maximum Frequency Stack & Histogram Area',
    labDifficulty: 'Medium'
  },
  {
    id: 'm3',
    week: 'Weeks 7–10',
    title: 'Hierarchical Trees, Heaps & Graph Traversal',
    lectures: 12,
    labs: 5,
    status: 'Upcoming',
    statusClass: 'upcoming',
    topics: [
      { name: 'Binary Tree Traversals & LCA Queries', done: false },
      { name: 'Binary Search Tree Balancing & Red-Black Basics', done: false },
      { name: 'Min/Max Heap Priority Queues', done: false },
      { name: 'BFS, DFS & Topological Sort on Directed Graphs', done: false }
    ],
    featuredLab: 'Network Delay Time & Shortest Path (Dijkstra)',
    labDifficulty: 'Medium'
  },
  {
    id: 'm4',
    week: 'Weeks 11–14',
    title: 'Dynamic Programming & Recruiter Benchmark Sprints',
    lectures: 13,
    labs: 5,
    status: 'Upcoming',
    statusClass: 'upcoming',
    topics: [
      { name: '1D/2D Tabulation vs Memoization', done: false },
      { name: '0/1 Knapsack & Unbounded Knapsack Variants', done: false },
      { name: 'Longest Common Subsequence & Edit Distance', done: false },
      { name: 'Company-Specific Recruiter Benchmark Sprints', done: false }
    ],
    featuredLab: 'Optimal Strategy for Game of Coins',
    labDifficulty: 'Hard'
  }
];

/* ─── Practice Environment Problems Dataset ─── */
const PRACTICE_PROBLEMS_DATA = [
  {
    id: 'p1',
    title: 'Palindrome Number',
    type: 'DSA',
    track: 'dsa',
    topics: ['Math', 'Two Pointers'],
    difficulty: 'Easy',
    level: 'beginner',
    company: 'Google',
    desc: `Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same backward as forward.`,
    examples: [
      { 
        id: 1,
        title: 'Example 1',
        input: 'x = 121', 
        output: 'true', 
        explanation: 'The reverse of 121 is 121 itself.\nSince the number reads the same from left to right and right to left, it is a palindrome.\nTherefore, the answer is true.' 
      },
      { 
        id: 2,
        title: 'Example 2',
        input: 'x = -121', 
        output: 'false', 
        explanation: 'Reversing -121 gives 121-, which is not the same as the original number.\nAlso, a negative number cannot be a palindrome because of the negative sign.\nTherefore, the answer is false.' 
      },
      { 
        id: 3,
        title: 'Example 3',
        input: 'x = 12321', 
        output: 'true', 
        explanation: '12321 reads as 12321 from left to right and from right to left.' 
      }
    ],
    starterCode: {
      JAVA: `class Solution {\n    public boolean isPalindrome(int x) {\n        // add your code here\n    }\n}`,
      Java: `class Solution {\n    public boolean isPalindrome(int x) {\n        // add your code here\n    }\n}`,
      Python: `class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        # add your code here\n        pass`,
      CPP: `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        // add your code here\n    }\n};`,
      'C++': `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        // add your code here\n    }\n};`
    },
    testCases: [
      {
        id: 1,
        input: 'x = 121',
        expected: 'true',
        actual: 'true',
        time: '1 ms'
      },
      {
        id: 2,
        input: 'x = -121',
        expected: 'false',
        actual: 'false',
        time: '1 ms'
      },
      {
        id: 3,
        input: 'x = 12321',
        expected: 'true',
        actual: 'true',
        time: '1 ms'
      }
    ],
    aiHint: 'An integer is a palindrome when it reads the same backward as forward. Negative numbers can never be palindromes due to the leading minus sign.'
  },
  {
    id: 'p2',
    title: "Key's Frequent Successor",
    type: 'DSA',
    track: 'dsa',
    topics: ['Array'],
    difficulty: 'Easy',
    level: 'beginner',
    company: 'Microsoft',
    desc: 'Given an array of keys and a target key, identify the most frequently occurring successor item immediately following any instance of the target key.',
    examples: [
      { input: 'keys = [1, 2, 1, 2, 1, 3, 1, 2], target = 1', output: '2', explanation: 'Key 1 is followed by 2 three times, making 2 the most frequent successor.' }
    ],
    starterCode: {
      Python: `def mostFrequentSuccessor(keys: list[int], target: int) -> int:\n    from collections import Counter\n    successors = [keys[i+1] for i in range(len(keys)-1) if keys[i] == target]\n    return Counter(successors).most_common(1)[0][0] if successors else -1`,
      Java: `public int mostFrequentSuccessor(int[] keys, int target) {\n    Map<Integer, Integer> freq = new HashMap<>();\n    for (int i = 0; i < keys.length - 1; i++) {\n        if (keys[i] == target) freq.put(keys[i+1], freq.getOrDefault(keys[i+1], 0) + 1);\n    }\n    return freq.entrySet().stream().max(Map.Entry.comparingByValue()).get().getKey();\n}`,
      'C++': `int mostFrequentSuccessor(vector<int>& keys, int target) {\n    map<int, int> freq;\n    for (size_t i = 0; i + 1 < keys.size(); ++i) {\n        if (keys[i] == target) freq[keys[i+1]]++;\n    }\n    return max_element(freq.begin(), freq.end(), [](auto& a, auto& b){ return a.second < b.second; })->first;\n}`
    },
    aiHint: 'Iterate up to index n - 2. Check if keys[i] matches target, and increment frequency of keys[i+1] in a hash map.'
  },
  {
    id: 'p3',
    title: 'Predicting the Next Heatwave',
    type: 'DSA',
    track: 'dsa',
    topics: ['Stack', 'Array', '+1'],
    difficulty: 'Medium',
    level: 'intermediate',
    company: 'Adobe',
    desc: 'Given daily temperature recordings, return an array answers where answers[i] is the number of days until a strictly warmer temperature arrives.',
    examples: [
      { input: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]', output: '[1, 1, 4, 2, 1, 1, 0, 0]', explanation: 'On day 2 (75), day 6 (76) is warmer (4 days later).' }
    ],
    starterCode: {
      Python: `def dailyTemperatures(temps: list[int]) -> list[int]:\n    ans = [0] * len(temps)\n    stack = []\n    for i, t in enumerate(temps):\n        while stack and temps[stack[-1]] < t:\n            prev = stack.pop()\n            ans[prev] = i - prev\n        stack.append(i)\n    return ans`,
      Java: `public int[] dailyTemperatures(int[] temps) {\n    int[] ans = new int[temps.length];\n    Deque<Integer> stack = new ArrayDeque<>();\n    for (int i = 0; i < temps.length; i++) {\n        while (!stack.isEmpty() && temps[stack.peek()] < temps[i]) {\n            int idx = stack.pop();\n            ans[idx] = i - idx;\n        }\n        stack.push(i);\n    }\n    return ans;\n}`,
      'C++': `vector<int> dailyTemperatures(vector<int>& temps) {\n    vector<int> ans(temps.size(), 0);\n    stack<int> s;\n    for (int i = 0; i < temps.size(); ++i) {\n        while (!s.empty() && temps[s.top()] < temps[i]) {\n            ans[s.top()] = i - s.top();\n            s.pop();\n        }\n        s.push(i);\n    }\n    return ans;\n}`
    },
    aiHint: 'A monotonic decreasing stack storing indices allows resolving day spans in a single O(n) scan.'
  },
  {
    id: 'p4',
    title: 'Road Trip Snacks',
    type: 'DSA',
    track: 'dsa',
    topics: ['Sliding-Window', 'Arrays'],
    difficulty: 'Easy',
    level: 'beginner',
    company: 'Meta',
    desc: 'Calculate the maximum contiguous assortment of road trip snacks a traveler can purchase under a given calorie budget.',
    examples: [
      { input: 'calories = [2, 1, 5, 2, 8], budget = 7', output: '3', explanation: 'Window [2, 1, 2] yields maximum 3 snack items under budget.' }
    ],
    starterCode: {
      Python: `def maxSnacks(calories: list[int], budget: int) -> int:\n    left = 0\n    curr_sum = 0\n    max_len = 0\n    for right, c in enumerate(calories):\n        curr_sum += c\n        while curr_sum > budget and left <= right:\n            curr_sum -= calories[left]\n            left += 1\n        max_len = max(max_len, right - left + 1)\n    return max_len`,
      Java: `public int maxSnacks(int[] calories, int budget) {\n    int left = 0, sum = 0, maxLen = 0;\n    for (int right = 0; right < calories.length; right++) {\n        sum += calories[right];\n        while (sum > budget) sum -= calories[left++];\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}`,
      'C++': `int maxSnacks(vector<int>& calories, int budget) {\n    int l = 0, sum = 0, maxL = 0;\n    for (int r = 0; r < calories.size(); ++r) {\n        sum += calories[r];\n        while (sum > budget) sum -= calories[l++];\n        maxL = max(maxL, r - l + 1);\n    }\n    return maxL;\n}`
    },
    aiHint: 'Expand the right pointer while running sum <= budget. Shrink from left pointer whenever sum exceeds budget.'
  },
  {
    id: 'p5',
    title: 'The Mirror of Numbers',
    type: 'DSA',
    track: 'dsa',
    topics: ['Arrays', 'Two Pointers'],
    difficulty: 'Easy',
    level: 'beginner',
    company: 'Google',
    desc: 'Verify if a sequence of numerical sensor readings is palindrome symmetric across its median coordinate.',
    examples: [
      { input: 'readings = [12, 45, 99, 45, 12]', output: 'True', explanation: 'Readings are identical forwards and backwards.' }
    ],
    starterCode: {
      Python: `def isMirrorSequence(readings: list[int]) -> bool:\n    left, right = 0, len(readings) - 1\n    while left < right:\n        if readings[left] != readings[right]:\n            return False\n        left += 1\n        right -= 1\n    return True`,
      Java: `public boolean isMirrorSequence(int[] readings) {\n    int i = 0, j = readings.length - 1;\n    while (i < j) if (readings[i++] != readings[j--]) return false;\n    return true;\n}`,
      'C++': `bool isMirrorSequence(vector<int>& readings) {\n    int i = 0, j = readings.size() - 1;\n    while (i < j) if (readings[i++] != readings[j--]) return false;\n    return true;\n}`
    },
    aiHint: 'Two pointers at head and tail moving inward provide an O(n) check with zero auxiliary memory.'
  },
  {
    id: 'p6',
    title: 'Balanced Boundary Subarrays',
    type: 'DSA',
    track: 'dsa',
    topics: ['Arrays', 'Prefix-Sum.'],
    difficulty: 'Medium',
    level: 'intermediate',
    company: 'Uber',
    desc: 'Return the length of the longest subarray where the boundary values sum up to the exact target calibration constant.',
    examples: [
      { input: 'weights = [3, 1, 4, 1, 5, 9, 2, 6], target = 8', output: '4', explanation: 'Subarray [3, 1, 4, 5] has boundary sum 3 + 5 = 8 with length 4.' }
    ],
    starterCode: {
      Python: `def balancedBoundary(weights: list[int], target: int) -> int:\n    max_len = 0\n    first_seen = {}\n    for j, w in enumerate(weights):\n        needed = target - w\n        if needed in first_seen:\n            max_len = max(max_len, j - first_seen[needed] + 1)\n        if w not in first_seen:\n            first_seen[w] = j\n    return max_len`,
      Java: `public int balancedBoundary(int[] weights, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    int maxLen = 0;\n    for (int j = 0; j < weights.length; j++) {\n        int needed = target - weights[j];\n        if (map.containsKey(needed)) maxLen = Math.max(maxLen, j - map.get(needed) + 1);\n        map.putIfAbsent(weights[j], j);\n    }\n    return maxLen;\n}`,
      'C++': `int balancedBoundary(vector<int>& weights, int target) {\n    unordered_map<int, int> seen;\n    int maxLen = 0;\n    for (int j = 0; j < weights.size(); ++j) {\n        int req = target - weights[j];\n        if (seen.count(req)) maxLen = max(maxLen, j - seen[req] + 1);\n        seen.emplace(weights[j], j);\n    }\n    return maxLen;\n}`
    },
    aiHint: 'Record the earliest index of each element in a hash map and check for target - current in each iteration.'
  },
  {
    id: 'p7',
    title: 'Energy target days',
    type: 'DSA',
    track: 'dsa',
    topics: ['Hashing', 'Arrays'],
    difficulty: 'Easy',
    level: 'beginner',
    company: 'Goldman Sachs',
    desc: 'Given daily energy generation readings and an energy quota, identify indices of the two days that aggregate to the quota.',
    examples: [
      { input: 'energy = [2, 7, 11, 15], quota = 9', output: '[0, 1]', explanation: 'energy[0] + energy[1] = 2 + 7 = 9' }
    ],
    starterCode: {
      Python: `def twoEnergyDays(energy: list[int], quota: int) -> list[int]:\n    seen = {}\n    for i, e in enumerate(energy):\n        diff = quota - e\n        if diff in seen:\n            return [seen[diff], i]\n        seen[e] = i\n    return []`,
      Java: `public int[] twoEnergyDays(int[] energy, int quota) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < energy.length; i++) {\n        int rem = quota - energy[i];\n        if (map.containsKey(rem)) return new int[]{map.get(rem), i};\n        map.put(energy[i], i);\n    }\n    return new int[0];\n}`,
      'C++': `vector<int> twoEnergyDays(vector<int>& energy, int quota) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < energy.size(); ++i) {\n        int rem = quota - energy[i];\n        if (seen.count(rem)) return {seen[rem], i};\n        seen[energy[i]] = i;\n    }\n    return {};\n}`
    },
    aiHint: 'One-pass hash table check: lookup complement (quota - energy[i]) as you iterate.'
  },
  {
    id: 'p8',
    title: 'Planetary Temperature Surge',
    type: 'DSA',
    track: 'dsa',
    topics: ['Array', 'Stack', '+1'],
    difficulty: 'Medium',
    level: 'intermediate',
    company: 'Apple',
    desc: 'Compute the peak surge span for deep-space planetary sensors by finding the continuous days of uninterrupted thermal escalation.',
    examples: [
      { input: 'surge = [100, 80, 60, 70, 60, 75, 85]', output: '[1, 1, 1, 2, 1, 4, 6]', explanation: 'Span of days where temperature was <= current day temperature.' }
    ],
    starterCode: {
      Python: `def planetarySurgeSpans(readings: list[int]) -> list[int]:\n    stack = []\n    spans = []\n    for i, p in enumerate(readings):\n        while stack and readings[stack[-1]] <= p:\n            stack.pop()\n        span = i + 1 if not stack else i - stack[-1]\n        spans.append(span)\n        stack.append(i)\n    return spans`,
      Java: `public int[] planetarySurgeSpans(int[] readings) {\n    int[] spans = new int[readings.length];\n    Stack<Integer> s = new Stack<>();\n    for (int i = 0; i < readings.length; i++) {\n        while (!s.isEmpty() && readings[s.peek()] <= readings[i]) s.pop();\n        spans[i] = s.isEmpty() ? i + 1 : i - s.peek();\n        s.push(i);\n    }\n    return spans;\n}`,
      'C++': `vector<int> planetarySurgeSpans(vector<int>& readings) {\n    vector<int> spans(readings.size());\n    stack<int> s;\n    for (int i = 0; i < readings.size(); ++i) {\n        while (!s.empty() && readings[s.top()] <= readings[i]) s.pop();\n        spans[i] = s.empty() ? i + 1 : i - s.top();\n        s.push(i);\n    }\n    return spans;\n}`
    },
    aiHint: 'Monotonic stack storing prior indices with strictly higher values.'
  },
  {
    id: 'p9',
    title: 'LRU Memory Cache Implementation',
    type: 'Programming',
    track: 'programming',
    topics: ['OOP', 'Design'],
    difficulty: 'Medium',
    level: 'intermediate',
    company: 'Amazon',
    desc: 'Design and implement a Least Recently Used (LRU) cache supporting get(key) and put(key, value) in O(1) average time complexity.',
    examples: [
      { input: 'LRUCache(2); put(1, 1); put(2, 2); get(1); put(3, 3);', output: 'get(2) returns -1', explanation: 'Key 2 was evicted when key 3 was inserted.' }
    ],
    starterCode: {
      Python: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n        \n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n        \n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)`,
      Java: `class LRUCache extends LinkedHashMap<Integer, Integer> {\n    private int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    public int get(int key) { return super.getOrDefault(key, -1); }\n    public void put(int key, int value) { super.put(key, value); }\n    protected boolean removeEldestEntry(Map.Entry eldest) { return size() > capacity; }\n}`,
      'C++': `class LRUCache {\n    int cap;\n    list<pair<int, int>> l;\n    unordered_map<int, list<pair<int, int>>::iterator> m;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (!m.count(key)) return -1;\n        l.splice(l.begin(), l, m[key]);\n        return m[key]->second;\n    }\n    void put(int key, int val) {\n        if (m.count(key)) { l.erase(m[key]); }\n        else if (l.size() == cap) { m.erase(l.back().first); l.pop_back(); }\n        l.push_front({key, val});\n        m[key] = l.begin();\n    }\n};`
    },
    aiHint: 'Combine a doubly linked list with a hash map to achieve O(1) node eviction and O(1) retrieval.'
  },
  {
    id: 'p10',
    title: 'Department Top 3 Earners via Dense Rank',
    type: 'SQL',
    track: 'sql',
    topics: ['Window Functions', 'Joins'],
    difficulty: 'Medium',
    level: 'intermediate',
    company: 'LinkedIn',
    desc: 'Write a SQL query to find employees who earn top 3 unique salaries in each department using window functions.',
    examples: [
      { input: 'Employee(id, name, salary, departmentId), Department(id, name)', output: 'Department, Employee, Salary', explanation: 'Ranked with DENSE_RANK() <= 3.' }
    ],
    starterCode: {
      SQL: `WITH RankedSalaries AS (\n    SELECT \n        d.name AS Department,\n        e.name AS Employee,\n        e.salary AS Salary,\n        DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) as rnk\n    FROM Employee e\n    JOIN Department d ON e.departmentId = d.id\n)\nSELECT Department, Employee, Salary\nFROM RankedSalaries\nWHERE rnk <= 3;`,
      Python: `# SQL assessment mode\nquery = """\nSELECT d.name AS Department, e.name AS Employee, e.salary\nFROM Employee e JOIN Department d ON e.departmentId = d.id\nWHERE 3 > (SELECT COUNT(DISTINCT e2.salary) FROM Employee e2 WHERE e2.salary > e.salary AND e2.departmentId = e.departmentId);\n"""`
    },
    aiHint: 'Use DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) inside a Common Table Expression.'
  }
];

/* ─── Mock Interview [AI] Datasets ─── */
const MOCK_RESUMES = [
  {
    id: 'res-1',
    name: 'Arjun_Verma_SDE_Resume.pdf',
    size: '342 KB',
    candidateName: 'Arjun Verma',
    role: 'Full-Stack SDE',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    projects: ['Distributed Order Pipeline', 'Real-Time Collaborative Canvas', 'Microservices Auth Service'],
    experience: 'Full-Stack Intern @ FinTech Corp (6 mos)'
  },
  {
    id: 'res-2',
    name: 'Priya_Sharma_Cloud_Backend.pdf',
    size: '418 KB',
    candidateName: 'Priya Sharma',
    role: 'Backend Systems Engineer',
    skills: ['Go', 'Kubernetes', 'AWS Lambda', 'gRPC', 'PostgreSQL'],
    projects: ['High-Throughput Gateway', 'Multi-Region Failover Controller'],
    experience: 'Cloud Engineering Intern @ ScaleOps (8 mos)'
  },
  {
    id: 'res-3',
    name: 'Rohan_Das_AIML_Resume.pdf',
    size: '290 KB',
    candidateName: 'Rohan Das',
    role: 'AI / ML Engineer',
    skills: ['Python', 'PyTorch', 'FastAPI', 'LangChain', 'Pinecone'],
    projects: ['RAG Enterprise Search', 'Agentic Workflow Pipeline'],
    experience: 'ML Research Associate @ AI Lab (1 yr)'
  }
];

const JOB_PROFILES = [
  {
    id: 'sde',
    title: 'Full-Stack SDE-1',
    companies: 'Amazon, Uber, Swiggy',
    rigor: 'FAANG Bar Raiser',
    focus: 'System Architecture, React/Node.js, Concurrency, DSA'
  },
  {
    id: 'backend',
    title: 'Backend Systems Engineer',
    companies: 'Google, Stripe, Razorpay',
    rigor: 'High Concurrency Tier',
    focus: 'Microservices, Database Sharding, Event Streams, Networking'
  },
  {
    id: 'aiml',
    title: 'AI / ML Engineer',
    companies: 'OpenAI, Meta, Microsoft',
    rigor: 'Production AI Tier',
    focus: 'LLMs, Vector Embeddings, RAG Architectures, Optimization'
  }
];

const INTERVIEW_QUESTIONS = {
  sde: [
    {
      qNum: 1,
      question: "How would you design a rate limiter for a public API?",
      context: "Think about the data structures you'd reach for, and how the design holds up when requests are spread across several servers.",
      helperText: "Take your time — speak when you're ready",
      ref: "Referenced from Resume: Distributed API Gateway & Microservices",
      sampleAnswer: "I would implement a Sliding Window Counter using Redis with atomic Lua scripts or Token Bucket with Redis hashes. To distribute across multi-region servers without race conditions, Redis cluster with local caching or Envoy proxy ratelimiting gracefully sheds overload with 429 Retry-After headers.",
      feedback: "Architecture: 96% • Exceptional understanding of Redis concurrency and distributed rate limiting."
    },
    {
      qNum: 2,
      question: "How did you guarantee idempotent event handling during network retries in your order pipeline?",
      context: "Consider idempotency keys, Redis SETNX distributed locking, TTLs, and transactional safety.",
      helperText: "Take your time — speak when you're ready",
      ref: "Referenced from Resume: Project #1 (Distributed Order Pipeline)",
      sampleAnswer: "We enforced idempotency by attaching a cryptographically generated UUIDv7 key at the API gateway. In our Redis streams worker, we used atomic SETNX transactions with a 60-second TTL to lock the event ID before dispatching to our PostgreSQL transactional store.",
      feedback: "Technical Depth: 95% • Excellent grasp of distributed locking and race conditions."
    },
    {
      qNum: 3,
      question: "How did you monitor database connection pools and avoid connection starvation when traffic surged 10x during flash sales?",
      context: "Evaluate connection pooling (PgBouncer), circuit breaker thresholds, and backoff headers.",
      helperText: "Take your time — speak when you're ready",
      ref: "Referenced from Resume: PostgreSQL & Node.js Backend",
      sampleAnswer: "We implemented PgBouncer in transaction-pooling mode in front of our database replica cluster, coupled with circuit breakers in our Node.js connection pool (knex/pg) to gracefully shed load with 429 backoff headers.",
      feedback: "Architecture: 92% • Practical high-scale operational knowledge."
    }
  ],
  backend: [
    {
      qNum: 1,
      question: "How would you handle data consistency and replication lag across AWS multi-region clusters?",
      context: "Evaluate asynchronous storage-level replication, read-your-own-writes session tokens, and failover latency.",
      helperText: "Take your time — speak when you're ready",
      ref: "Referenced from Resume: Project #2 (Multi-Region Controller)",
      sampleAnswer: "We deployed Aurora Global Database with asynchronous storage-level replication (typical lag < 1s). For write paths requiring strong consistency, we routed to the primary region and used read-your-own-writes session tokens for secondary regions.",
      feedback: "System Depth: 94% • Strong understanding of distributed consistency models."
    },
    {
      qNum: 2,
      question: "When gRPC microservices experience cascading latency degradation, what techniques do you apply to isolate the failure?",
      context: "Think about client-side deadlines, context propagation, exponential backoff with full jitter, and Envoy circuit breakers.",
      helperText: "Take your time — speak when you're ready",
      ref: "Referenced from Resume: gRPC & Kubernetes Experience",
      sampleAnswer: "We configure strict client-side deadlines with context propagation, exponential backoff with full jitter, and Envoy circuit breakers to cut traffic to degraded pods before buffers saturate.",
      feedback: "Resilience: 91% • Comprehensive fault isolation methodology."
    }
  ],
  aiml: [
    {
      qNum: 1,
      question: "How do you balance dense semantic retrieval with sparse BM25 keyword matching in production RAG systems?",
      context: "Analyze Reciprocal Rank Fusion (RRF), vector quantization, sparse-dense hybrid weights, and reranking trade-offs.",
      helperText: "Take your time — speak when you're ready",
      ref: "Referenced from Resume: RAG Enterprise Search (LangChain, Pinecone)",
      sampleAnswer: "We implemented Reciprocal Rank Fusion (RRF) with a constant k=60 to normalize and merge sparse BM25 scores from Elasticsearch with dense cosine similarity vectors from Pinecone, drastically reducing out-of-domain hallucinations.",
      feedback: "AI Architecture: 96% • State-of-the-art hybrid retrieval approach."
    },
    {
      qNum: 2,
      question: "How do you evaluate and safeguard your agentic tool-calling pipelines against prompt injection attacks?",
      context: "Consider Pydantic schema validation, sandboxed container boundaries, and secondary discriminator models.",
      helperText: "Take your time — speak when you're ready",
      ref: "Referenced from Resume: Agentic Workflow Pipeline",
      sampleAnswer: "We enforce strict Pydantic schema validation on all tool inputs, execute actions in sandboxed e2b containers with no network egress, and run a secondary discriminator model to verify instruction boundary integrity.",
      feedback: "Security & Guardrails: 93% • Robust defensive engineering."
    }
  ]
};

const ForUniversities = () => {
  const [step, setStep] = useState('question'); // 'question' | 'result'
  const [selected, setSelected] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [ripple, setRipple] = useState(null);
  const [activeComboIndex, setActiveComboIndex] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedSandboxLang, setSelectedSandboxLang] = useState('Python');
  const [selectedExamTrack, setSelectedExamTrack] = useState('mcq');
  const [lmsActiveTab, setLmsActiveTab] = useState('home');
  const [customWorkflowReq, setCustomWorkflowReq] = useState('');
  const [showCwExamples, setShowCwExamples] = useState(false);
  const [hasInteractedWithSyllabus, setHasInteractedWithSyllabus] = useState(false);
  const [expandedSyllabusModule, setExpandedSyllabusModule] = useState(0);
  const [hasInteractedWithSandbox, setHasInteractedWithSandbox] = useState(false);

  /* Practice Environment State */
  const [practiceTrack, setPracticeTrack] = useState('all');
  const [practiceSearch, setPracticeSearch] = useState('');
  const [practiceLevel, setPracticeLevel] = useState('all');
  const [practiceDifficulty, setPracticeDifficulty] = useState('all');
  const [practiceTopic, setPracticeTopic] = useState('all');
  const [practiceCompany, setPracticeCompany] = useState('all');
  const [practiceStatusFilter, setPracticeStatusFilter] = useState('all');
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [activePracticeProblem, setActivePracticeProblem] = useState(PRACTICE_PROBLEMS_DATA[0]);
  const [sandboxLang, setSandboxLang] = useState('JAVA');
  const [sandboxCode, setSandboxCode] = useState(PRACTICE_PROBLEMS_DATA[0].starterCode.JAVA);
  const [isAiHintOpen, setIsAiHintOpen] = useState(false);
  const [isRunningSandbox, setIsRunningSandbox] = useState(false);
  const [sandboxRunResult, setSandboxRunResult] = useState(null);
  const [isSandboxSubmitted, setIsSandboxSubmitted] = useState(false);
  const [isSandboxSubmitting, setIsSandboxSubmitting] = useState(false);
  const [submissionVerdict, setSubmissionVerdict] = useState(null);
  const [practiceViewTab, setPracticeViewTab] = useState('problem'); // 'problem' | 'submissions'
  const [showTestCases, setShowTestCases] = useState(false);
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(24); // starts at 00:00:24 matching screenshot
  const [activeDrawerTab, setActiveDrawerTab] = useState('ai'); // 'testcases' | 'ai'
  const [aiHintStage, setAiHintStage] = useState(0); // 0 to 3
  const [advancedToolsUsed, setAdvancedToolsUsed] = useState(0); // 0 to 10
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    {
      id: 'init-banner',
      type: 'welcome',
      content: `Welcome to CipherSchools Labs AI Assist Terminal\n\nHINTS · 3 stages · 3 uses total\n/hint run      : Request the next hint stage\n/hint 1        : View stage 1, Problem Breakdown\n/hint 2        : View stage 2, Core Logic\n/hint 3        : View stage 3, Full Pseudocode\n\nADVANCED TOOLS · 10 uses shared\n/analyze       : Analyze time & space complexity of your code\n/dry_run       : Trace code execution line by line\n/fix           : Get AI-powered code fix suggestions\n\nTERMINAL\n/status        : Show current usage for all tools\n/help          : Show this help message\n/clear         : Clear all terminal output`
    }
  ]);
  const terminalBottomRef = useRef(null);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSessionTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if (activeDrawerTab === 'ai') {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, activeDrawerTab]);

  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const [problemSubmissions, setProblemSubmissions] = useState([
    {
      id: 'sub-init-1',
      problemId: 'p1',
      status: 'Accepted',
      language: 'JAVA',
      runtime: '4 ms',
      memory: '18.2 MB',
      submittedAt: 'Yesterday'
    }
  ]);

  /* Mock Interview [AI] State */
  const [mockInterviewStage, setMockInterviewStage] = useState('interview'); // 'interview' | 'report'
  const [selectedResumeId, setSelectedResumeId] = useState('res-1');
  const [selectedJobProfileId, setSelectedJobProfileId] = useState('sde');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState(false);
  const [customUploadedFile, setCustomUploadedFile] = useState(null);
  const [isReportDownloaded, setIsReportDownloaded] = useState(false);

  /* scroll-reveal refs */
  const [refHeroText, visHeroText] = useReveal();
  const [refShift, visShift] = useReveal();
  const [refTraining, visTraining] = useReveal();
  const [refTyping, visTyping] = useReveal();
  const [refStack, visStack] = useReveal();
  const [refQuote, visQuote] = useReveal();
  const [refPair, visPair] = useReveal();
  const [refCta, visCta] = useReveal();
  const [refIndustry, visIndustry] = useReveal();
  const [refDoers, visDoers] = useReveal();
  const [refBeyond, visBeyond] = useReveal();
  const [refBreather1, visBreather1] = useReveal();
  const [refBreather2, visBreather2] = useReveal();
  const [refHelp, visHelp] = useReveal();
  const [refLms, visLms] = useReveal();
  const [refAssessment, visAssessment] = useReveal();
  const [refPractice, visPractice] = useReveal();
  const [refMockInterview, visMockInterview] = useReveal();
  const [activeAssessmentTab, setActiveAssessmentTab] = useState('coding');
  const [isAutoRotateAssessment, setIsAutoRotateAssessment] = useState(true);

  /* Practice environment helper functions & metrics */
  const toggleSolved = (id, e) => {
    if (e) e.stopPropagation();
    setSolvedProblems(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const openSandbox = (problem) => {
    setActivePracticeProblem(problem);
    const defaultLang = problem.track === 'sql' ? 'SQL' : 'CPP';
    setSandboxLang(defaultLang);
    const code = (problem.starterCode && (problem.starterCode[defaultLang] || problem.starterCode['C++'] || problem.starterCode.Python)) || '';
    setSandboxCode(code);
    setIsAiHintOpen(false);
    setSandboxRunResult(null);
    setIsSandboxSubmitted(false);
    setIsSandboxSubmitting(false);
    setSubmissionVerdict(null);
    setPracticeViewTab('problem');
    setShowTestCases(false);
    setActiveTestCaseTab(0);
  };

  const handleSandboxLangChange = (lang) => {
    setSandboxLang(lang);
    if (activePracticeProblem && activePracticeProblem.starterCode) {
      const code = activePracticeProblem.starterCode[lang] || activePracticeProblem.starterCode['C++'] || '';
      if (code) setSandboxCode(code);
    }
  };

  const handleResetCode = () => {
    if (activePracticeProblem && activePracticeProblem.starterCode) {
      const code = activePracticeProblem.starterCode[sandboxLang] || activePracticeProblem.starterCode.JAVA || activePracticeProblem.starterCode['C++'] || '';
      setSandboxCode(code);
      setSandboxRunResult(null);
      setSubmissionVerdict(null);
      setIsSandboxSubmitted(false);
    }
  };

  const handleRunSandboxCode = () => {
    setIsRunningSandbox(true);
    setShowTestCases(true);
    setSandboxRunResult(null);
    setTimeout(() => {
      setIsRunningSandbox(false);
      const testCasesList = (activePracticeProblem && activePracticeProblem.testCases) || [
        { id: 1, input: 'x = 121', expected: 'true', actual: 'true', time: '1 ms' },
        { id: 2, input: 'x = -121', expected: 'false', actual: 'false', time: '1 ms' },
        { id: 3, input: 'x = 12321', expected: 'true', actual: 'true', time: '1 ms' }
      ];
      setSandboxRunResult({
        success: true,
        casesPassed: testCasesList.length,
        totalCases: testCasesList.length,
        runtime: '1 ms',
        memory: '39.8 MB',
        cases: testCasesList
      });
      setActiveDrawerTab('testcases');
    }, 450);
  };

  const handleTerminalCommand = (cmdStr) => {
    const rawCmd = (cmdStr !== undefined ? cmdStr : terminalInput).trim();
    if (!rawCmd) return;
    setTerminalInput('');

    const lowerCmd = rawCmd.toLowerCase();

    if (lowerCmd === '/clear' || lowerCmd === 'clear') {
      setTerminalLogs([
        {
          id: `log-${Date.now()}`,
          type: 'welcome',
          content: `Welcome to CipherSchools Labs AI Assist Terminal\n\nHINTS · 3 stages · 3 uses total\n/hint run      : Request the next hint stage\n/hint 1        : View stage 1, Problem Breakdown\n/hint 2        : View stage 2, Core Logic\n/hint 3        : View stage 3, Full Pseudocode\n\nADVANCED TOOLS · 10 uses shared\n/analyze       : Analyze time & space complexity of your code\n/dry_run       : Trace code execution line by line\n/fix           : Get AI-powered code fix suggestions\n\nTERMINAL\n/status        : Show current usage for all tools\n/help          : Show this help message\n/clear         : Clear all terminal output`
        }
      ]);
      return;
    }

    if (lowerCmd === '/help' || lowerCmd === 'help') {
      setTerminalLogs(prev => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          type: 'command',
          cmd: rawCmd,
          output: `Available Commands:\n  /hint run       Request next algorithmic hint stage (0/3)\n  /hint 1         View Problem Breakdown\n  /hint 2         View Core Logic & Mathematical Invariant\n  /hint 3         View Full Java / Pseudocode Implementation\n  /analyze        Run time & space complexity diagnosis\n  /dry_run        Simulate step-by-step trace for x = 121\n  /fix            Inspect code for edge cases and syntax issues\n  /status         Display token usage and session statistics\n  /clear          Clear terminal window`
        }
      ]);
      return;
    }

    if (lowerCmd === '/status' || lowerCmd === 'status') {
      setTerminalLogs(prev => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          type: 'command',
          cmd: rawCmd,
          output: `Session Status [CipherSchools Labs]:\n• AI Hints: ${aiHintStage}/3 stages requested\n• Advanced Tools: ${advancedToolsUsed}/10 used\n• Environment: Java 21 (OpenJDK HotSpot)\n• Sandbox: Active & Connected`
        }
      ]);
      return;
    }

    if (lowerCmd === './analyze_complexity' || lowerCmd === '/analyze' || lowerCmd === 'analyze') {
      setAdvancedToolsUsed(prev => Math.min(10, prev + 1));
      setTerminalLogs(prev => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          type: 'command',
          cmd: rawCmd.startsWith('./') || rawCmd.startsWith('/') ? rawCmd : `./analyze_complexity`,
          output: `[Complexity Analysis: Palindrome Number]\n• Time Complexity: O(log₁₀(x))\n  Every iteration reduces x by a factor of 10. For an integer with n digits, the loop runs n/2 times.\n• Space Complexity: O(1)\n  Operates in-place with constant memory (only integer variables revertedNumber, x).\n• Best Practice: Reversing half the integer avoids 32-bit Integer.MAX_VALUE overflow.`
        }
      ]);
      return;
    }

    if (lowerCmd === './dry_run' || lowerCmd === '/dry_run' || lowerCmd === 'dry_run') {
      setAdvancedToolsUsed(prev => Math.min(10, prev + 1));
      setTerminalLogs(prev => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          type: 'command',
          cmd: rawCmd.startsWith('./') || rawCmd.startsWith('/') ? rawCmd : `./dry_run`,
          output: `[Execution Trace: x = 121]\n  ▶ Step 1: Input x = 121. Check if x < 0 -> false. Proceed.\n  ▶ Step 2: Initialize revertedNumber = 0.\n  ▶ Step 3: Iteration 1 ->\n            digit = 121 % 10 = 1\n            revertedNumber = 0 * 10 + 1 = 1\n            x = 121 / 10 = 12\n  ▶ Step 4: Iteration 2 ->\n            digit = 12 % 10 = 2\n            revertedNumber = 1 * 10 + 2 = 12\n            x = 12 / 10 = 1\n  ▶ Step 5: Stop condition (x <= revertedNumber: 1 <= 12 is true).\n  ▶ Step 6: Odd-digit check: x == revertedNumber / 10 (1 == 12 / 10 = 1) -> Returns true ✓`
        }
      ]);
      return;
    }

    if (lowerCmd === './fix_my_code' || lowerCmd === '/fix' || lowerCmd === 'fix') {
      setAdvancedToolsUsed(prev => Math.min(10, prev + 1));
      setTerminalLogs(prev => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          type: 'command',
          cmd: rawCmd.startsWith('./') || rawCmd.startsWith('/') ? rawCmd : `./fix_my_code`,
          output: `[AI Code Inspection & Edge-Case Fix]\nCritical edge cases identified:\n1. Negative Numbers: When x < 0, return false immediately (e.g. -121 -> 121-).\n2. Trailing Zeroes: If x > 0 and x % 10 == 0, the first digit cannot be 0, return false.\n3. Solution Template:\n   public boolean isPalindrome(int x) {\n       if (x < 0 || (x % 10 == 0 && x != 0)) return false;\n       int rev = 0;\n       while (x > rev) {\n           rev = rev * 10 + x % 10;\n           x /= 10;\n       }\n       return x == rev || x == rev / 10;\n   }`
        }
      ]);
      return;
    }

    if (lowerCmd === '/hint run' || lowerCmd === 'hint run' || lowerCmd.startsWith('/hint')) {
      let nextStage = aiHintStage + 1;
      if (lowerCmd === '/hint 1') nextStage = 1;
      if (lowerCmd === '/hint 2') nextStage = 2;
      if (lowerCmd === '/hint 3') nextStage = 3;
      if (nextStage > 3) nextStage = 3;
      setAiHintStage(nextStage);

      const hintTexts = {
        1: `[AI Hint Stage 1/3 - Problem Breakdown]\n• A palindrome number reads identically in both directions: forward and reverse.\n• Negative numbers like -121 can NEVER be palindromes because reversing produces '121-', and '-' cannot match a positive trailing digit.\n• If x ends in 0 (e.g., 10, 100), it can only be a palindrome if x == 0.`,
        2: `[AI Hint Stage 2/3 - Core Logic & Mathematical Shift]\n• Avoid converting to String to keep space complexity O(1).\n• We can reverse the last half of the digits mathematically using '% 10' and '/ 10'.\n• How do we know when we have reversed half? When x <= revertedNumber!`,
        3: `[AI Hint Stage 3/3 - Full Pseudocode]\n1. if (x < 0 || (x % 10 == 0 && x != 0)) return false;\n2. int rev = 0;\n3. while (x > rev) {\n       rev = rev * 10 + x % 10;\n       x /= 10;\n   }\n4. return x == rev || x == rev / 10;`
      };

      setTerminalLogs(prev => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          type: 'command',
          cmd: rawCmd,
          output: hintTexts[nextStage] || hintTexts[1]
        }
      ]);
      return;
    }

    // Default fallback
    setTerminalLogs(prev => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        type: 'command',
        cmd: rawCmd,
        output: `zsh: command not found: ${rawCmd}\nType /help to see all available CipherSchools AI commands.`
      }
    ]);
  };

  const handleSubmitSandbox = () => {
    if (!activePracticeProblem) return;
    setIsSandboxSubmitting(true);
    setSubmissionVerdict(null);
    setTimeout(() => {
      setIsSandboxSubmitting(false);
      setIsSandboxSubmitted(true);
      const newVerdict = {
        status: 'Accepted',
        runtime: '4 ms',
        runtimePercentile: '98.2%',
        memory: '18.2 MB',
        memoryPercentile: '94.1%',
        casesPassed: 45,
        totalCases: 45
      };
      setSubmissionVerdict(newVerdict);

      // Add to submissions list
      setProblemSubmissions(prev => [
        {
          id: 'sub-' + Date.now(),
          problemId: activePracticeProblem.id,
          status: 'Accepted',
          language: sandboxLang,
          runtime: '4 ms',
          memory: '18.2 MB',
          submittedAt: 'Just now'
        },
        ...prev
      ]);

      // Mark problem as solved in table
      if (!solvedProblems.includes(activePracticeProblem.id)) {
        setSolvedProblems(prev => [...prev, activePracticeProblem.id]);
      }
    }, 750);
  };

  const totalProgrammingSolved = solvedProblems.filter(id => {
    const p = PRACTICE_PROBLEMS_DATA.find(item => item.id === id);
    return p && p.track === 'programming';
  }).length;

  const totalDsaSolved = solvedProblems.filter(id => {
    const p = PRACTICE_PROBLEMS_DATA.find(item => item.id === id);
    return p && p.track === 'dsa';
  }).length;

  const totalSqlSolved = solvedProblems.filter(id => {
    const p = PRACTICE_PROBLEMS_DATA.find(item => item.id === id);
    return p && p.track === 'sql';
  }).length;

  const filteredProblems = PRACTICE_PROBLEMS_DATA.filter(prob => {
    if (practiceTrack !== 'all' && prob.track !== practiceTrack) return false;
    if (practiceSearch.trim()) {
      const q = practiceSearch.toLowerCase().trim();
      const matchTitle = prob.title.toLowerCase().includes(q);
      const matchTopic = prob.topics.some(t => t.toLowerCase().includes(q));
      const matchCompany = prob.company.toLowerCase().includes(q);
      if (!matchTitle && !matchTopic && !matchCompany) return false;
    }
    if (practiceLevel !== 'all' && prob.level !== practiceLevel) return false;
    if (practiceDifficulty !== 'all' && prob.difficulty !== practiceDifficulty) return false;
    if (practiceTopic !== 'all' && !prob.topics.some(t => t.toLowerCase().includes(practiceTopic.toLowerCase()))) return false;
    if (practiceCompany !== 'all' && prob.company.toLowerCase() !== practiceCompany.toLowerCase()) return false;
    const isSolved = solvedProblems.includes(prob.id);
    if (practiceStatusFilter === 'solved' && !isSolved) return false;
    if (practiceStatusFilter === 'unsolved' && isSolved) return false;
    return true;
  });

  /* Mock Interview [AI] Handlers */
  const activeResume = MOCK_RESUMES.find(r => r.id === selectedResumeId) || MOCK_RESUMES[0];
  const activeJobProfile = JOB_PROFILES.find(j => j.id === selectedJobProfileId) || JOB_PROFILES[0];
  const currentInterviewQuestions = INTERVIEW_QUESTIONS[selectedJobProfileId] || INTERVIEW_QUESTIONS.sde;
  const currentQ = currentInterviewQuestions[currentQuestionIdx] || currentInterviewQuestions[0];

  const handleStartInterview = () => {
    setCurrentQuestionIdx(0);
    const questions = INTERVIEW_QUESTIONS[selectedJobProfileId] || INTERVIEW_QUESTIONS.sde;
    setCandidateAnswer(questions[0]?.sampleAnswer || '');
    setMockInterviewStage('interview');
  };

  const handleNextQuestion = () => {
    const questions = INTERVIEW_QUESTIONS[selectedJobProfileId] || INTERVIEW_QUESTIONS.sde;
    if (currentQuestionIdx < questions.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setCandidateAnswer(questions[nextIdx]?.sampleAnswer || '');
      setIsVoiceRecording(false);
    } else {
      setIsEvaluatingAnswer(true);
      setTimeout(() => {
        setIsEvaluatingAnswer(false);
        setMockInterviewStage('report');
      }, 700);
    }
  };

  const handleResetInterview = () => {
    setMockInterviewStage('interview');
    setCurrentQuestionIdx(0);
    const questions = INTERVIEW_QUESTIONS[selectedJobProfileId] || INTERVIEW_QUESTIONS.sde;
    setCandidateAnswer(questions[0]?.sampleAnswer || '');
    setIsVoiceRecording(false);
    setIsVideoOn(true);
    setIsEvaluatingAnswer(false);
    setIsReportDownloaded(false);
  };

  const handleDownloadReport = () => {
    setIsReportDownloaded(true);
    setTimeout(() => {
      setIsReportDownloaded(false);
    }, 3000);
  };

  // Auto-rotate Assessment Tabs every 2.5s until user interacts
  useEffect(() => {
    if (!isAutoRotateAssessment) return;
    const assessmentTabs = ['coding', 'aptitude', 'comm_skill', 'analytics'];
    const interval = setInterval(() => {
      setActiveAssessmentTab(prev => {
        const nextIdx = (assessmentTabs.indexOf(prev) + 1) % assessmentTabs.length;
        return assessmentTabs[nextIdx];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isAutoRotateAssessment]);

  const handleAssessmentTabClick = (tabId) => {
    setIsAutoRotateAssessment(false);
    setActiveAssessmentTab(tabId);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const universityEl = document.getElementById('university-section');
      const studentEl = document.getElementById('student-section');
      const heroEl = document.getElementById('hero-impact-section');
      const welcomeEl = document.getElementById('welcome-section');

      const windowHeight = window.innerHeight;

      // Check if student, hero, or welcome sections are active in viewport
      const isStudentActive = studentEl && (studentEl.getBoundingClientRect().top <= windowHeight * 0.6 && studentEl.getBoundingClientRect().bottom >= 100);
      const isHeroActive = heroEl && (heroEl.getBoundingClientRect().bottom > 150);
      const isWelcomeActive = welcomeEl && (welcomeEl.getBoundingClientRect().top <= windowHeight * 0.6 && welcomeEl.getBoundingClientRect().bottom >= 100);

      // If user is viewing For Students or Hero or Welcome Gateway section, HIDE sticky CTA completely
      if (isStudentActive || isHeroActive || isWelcomeActive) {
        setShowStickyCta(false);
        setIsMeetingModalOpen(false);
        return;
      }

      // Check if For University section is in viewport
      if (universityEl) {
        const uniRect = universityEl.getBoundingClientRect();
        if (uniRect.top <= windowHeight * 0.75 && uniRect.bottom >= 150) {
          setShowStickyCta(true);
        } else {
          setShowStickyCta(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 } // 5% visibility is enough to be considered "entered"
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleSelect = (id) => {
    setRipple(id);
    setSelected(id);
    setStep('result');
    setTimeout(() => {
      setIsVisible(true);
      let targetId = 'training-section';
      if (id === 'training') targetId = 'training-section';
      if (id === 'lms') targetId = 'lms-section';
      if (id === 'assessment') targetId = 'assessment-section';
      if (id === 'practice') targetId = 'practice-section';
      if (id === 'mock-interview') targetId = 'mock-interview-section';

      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleBack = () => {
    setStep('question');
    setSelected(null);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const options = [
    { 
      id: 'training', 
      label: <>Training <span className="fu-pitch-accent">Support</span></>, 
      icon: <BrainCircuit size={28} />,
      desc: "End-to-end tech skilling & placement prep for your students.",
      stats: [
        { value: '4+', label: 'Tracks' },
        { value: '200+', label: 'Hours' },
      ],
      features: ['Live Mentorship', 'Project Based', 'Industry Ready'],
    },
    { 
      id: 'lms', 
      label: <>Campus <span className="fu-pitch-accent">LMS</span></>, 
      icon: <Laptop size={28} />,
      desc: "White-labeled platform for effortless learning management.",
      stats: [
        { value: '100%', label: 'Custom' },
        { value: '24/7', label: 'Access' },
      ],
      features: ['Video Modules', 'Analytics', 'Stage Locking'],
    },
    { 
      id: 'assessment', 
      label: <>Assessment <span className="fu-pitch-accent">Platform</span></>, 
      icon: <CheckCircle2 size={28} />,
      desc: "AI-powered evaluation with proctoring & detailed analytics.",
      stats: [
        { value: 'AI', label: 'Proctored' },
        { value: '∞', label: 'Tests' },
      ],
      features: ['Practice Tests', 'AI Hints', 'Result Dashboard'],
    },
  ];

  return (
    <div className="fu-pitch-page" ref={containerRef}>

      {/* Full Screen Text Reveal Hero + Embedded Smart Help Options */}
      <div ref={refHeroText} className={`fu-fullscreen-hero fu-reveal ${visHeroText ? 'fu-revealed' : ''}`}>
        <div className="gemini-ambient-glow"></div>
        <div className="fu-hero-glow-orb orb-1"></div>
        <div className="fu-hero-glow-orb orb-2"></div>

        <div className="fu-fullscreen-content">
          <GeminiTextReveal />

          {/* Smart Help Options UI Embedded Directly inside Hero */}
          <div className="fu-smart-help-stage">
            <TypewriterChatQuestion inView={visHeroText} />

            <div className="fu-smart-options-grid">
              <button 
                className={`fu-smart-option-card fu-training-hero-card ${selected === 'training' ? 'active' : ''}`}
                onClick={() => handleSelect('training')}
                aria-selected={selected === 'training'}
              >
                {selected === 'training' && (
                  <span className="fu-selected-active-badge">Selected ✓</span>
                )}
                <div className="fu-smart-card-icon fu-training-icon"><BrainCircuit size={24} /></div>
                <div className="fu-smart-card-body">
                  <span className="fu-smart-card-title">Training Support</span>
                  <span className="fu-smart-card-sub">Skilling & Placement Prep</span>
                  <p className="fu-training-card-desc">
                    Comprehensive campus placement prep with semester-aligned curriculum and direct recruiter tracks.
                  </p>
                </div>
                <ChevronRight size={18} className="fu-smart-card-arrow" />
              </button>

              {/* 2. Smart Border Enclosing CipherLabs (Campus LMS, Assessment Platform, Practice Env, Mock Interview) */}
              <div className="fu-cipherlabs-smart-group">
                <div className="fu-cipherlabs-smart-label">
                  <Cpu size={12} className="fu-cipherlabs-label-icon" />
                  <span>CipherLabs</span>
                </div>

                <div className="fu-cipherlabs-cards-grid">
                  {/* Card 1: Campus LMS */}
                  <button 
                    className={`fu-smart-option-card ${selected === 'lms' ? 'active' : ''}`}
                    onClick={() => handleSelect('lms')}
                    aria-selected={selected === 'lms'}
                  >
                    {selected === 'lms' && (
                      <span className="fu-selected-active-badge">Selected ✓</span>
                    )}
                    <div className="fu-smart-card-icon"><Laptop size={22} /></div>
                    <div className="fu-smart-card-body">
                      <span className="fu-smart-card-title">Campus LMS</span>
                      <span className="fu-smart-card-sub">White-Labeled Management</span>
                    </div>
                    <ChevronRight size={18} className="fu-smart-card-arrow" />
                  </button>

                  {/* Card 2: Assessment Platform */}
                  <button 
                    className={`fu-smart-option-card ${selected === 'assessment' ? 'active' : ''}`}
                    onClick={() => handleSelect('assessment')}
                    aria-selected={selected === 'assessment'}
                  >
                    {selected === 'assessment' && (
                      <span className="fu-selected-active-badge">Selected ✓</span>
                    )}
                    <div className="fu-smart-card-icon"><CheckCircle2 size={22} /></div>
                    <div className="fu-smart-card-body">
                      <span className="fu-smart-card-title">Assessment Platform</span>
                      <span className="fu-smart-card-sub">AI-Proctored Testing</span>
                    </div>
                    <ChevronRight size={18} className="fu-smart-card-arrow" />
                  </button>

                  {/* Card 3: Practice Environment [AI] */}
                  <button 
                    className={`fu-smart-option-card ${selected === 'practice' ? 'active' : ''}`}
                    onClick={() => handleSelect('practice')}
                    aria-selected={selected === 'practice'}
                  >
                    {selected === 'practice' && (
                      <span className="fu-selected-active-badge">Selected ✓</span>
                    )}
                    <div className="fu-smart-card-icon"><Terminal size={22} /></div>
                    <div className="fu-smart-card-body">
                      <span className="fu-smart-card-title">
                        Practice Environment <span className="fu-ai-tag">AI</span>
                      </span>
                      <span className="fu-smart-card-sub">In-Browser Coding Sandboxes</span>
                    </div>
                    <ChevronRight size={18} className="fu-smart-card-arrow" />
                  </button>

                  {/* Card 4: Mock Interview [AI] */}
                  <button 
                    className={`fu-smart-option-card ${selected === 'mock-interview' ? 'active' : ''}`}
                    onClick={() => handleSelect('mock-interview')}
                    aria-selected={selected === 'mock-interview'}
                  >
                    {selected === 'mock-interview' && (
                      <span className="fu-selected-active-badge">Selected ✓</span>
                    )}
                    <div className="fu-smart-card-icon"><Bot size={22} /></div>
                    <div className="fu-smart-card-body">
                      <span className="fu-smart-card-title">
                        Mock Interview <span className="fu-ai-tag">AI</span>
                      </span>
                      <span className="fu-smart-card-sub">Voice & Technical Evals</span>
                    </div>
                    <ChevronRight size={18} className="fu-smart-card-arrow" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RESULT SCREEN ─── */}
      <div className={`fu-result-page fu-visible`}>

          {/* ── Apple-Style Master Unified Bento Grid ── */}
          <section id="training-section" ref={refPair} className={`fu-sec fu-apple-bento-section fu-reveal ${visPair ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              {/* Section Header */}
              <div className="fu-apple-bento-header">
                <p className="fu-sec-eyebrow">TRAINING SUPPORT ECOSYSTEM</p>
                <h2 className="fu-apple-bento-title">
                  Everything Campuses Need. <span className="fu-pitch-accent">Built into One System.</span>
                </h2>
                <p className="fu-apple-bento-sub">
                  From multi-skill recruiter mandates to semester-aligned program delivery and agile beyond-syllabus tracks.
                </p>
              </div>

              {/* Apple-Style Asymmetrical Bento Grid */}
              <div className="fu-apple-bento-grid">
                
                {/* ── Tile 1: Structured Programs ── */}
                <div className="fu-apple-bento-tile tile-structured-programs">
                  <div className="fu-tile-header">
                    <span className="fu-apple-pill">STRUCTURED PROGRAMS</span>
                    <h3 className="fu-tile-title">
                      Programs that build real engineers.
                    </h3>
                    <p className="fu-tile-desc">
                      Flexible semester tracks tailored to your academic calendar.
                    </p>
                  </div>

                  <div className="fu-apple-programs-list">
                    {/* Program 1 */}
                    <div className="fu-apple-program-row">
                      <div className="fu-program-icon-box"><BookOpen size={16} /></div>
                      <div className="fu-program-info">
                        <span className="fu-program-name">Academic Training</span>
                        <span className="fu-program-meta">First Year to Final Year</span>
                      </div>
                      <span className="fu-program-tag">FOUNDATION</span>
                    </div>

                    {/* Program 2 */}
                    <div className="fu-apple-program-row featured-row">
                      <div className="fu-program-icon-box"><Target size={16} /></div>
                      <div className="fu-program-info">
                        <span className="fu-program-name">Placement Training</span>
                        <span className="fu-program-meta">Pre-Final to Final Year</span>
                      </div>
                      <span className="fu-program-tag tag-featured">MOST POPULAR</span>
                    </div>

                    {/* Program 3 */}
                    <div className="fu-apple-program-row">
                      <div className="fu-program-icon-box"><Zap size={16} /></div>
                      <div className="fu-program-info">
                        <span className="fu-program-name">Seasonal Programs</span>
                        <span className="fu-program-meta">Summer & Winter Training</span>
                      </div>
                      <span className="fu-program-tag">SPRINTS</span>
                    </div>
                  </div>
                </div>

                {/* ── Tile 3: Calendar Adaptation Stat Spotlight (Col Span 4) ── */}
                <div className="fu-apple-bento-tile tile-calendar-stat">
                  <span className="fu-apple-pill">SEMESTER ADAPTIVE</span>
                  <div className="fu-stat-huge-number">100%</div>
                  <h4 className="fu-stat-tile-title">Calendar Synchronized</h4>
                  <p className="fu-stat-tile-desc">
                    Custom 3, 6, or 9-month modules designed around your university examination dates.
                  </p>
                  <div className="fu-stat-footer-pill">
                    <Clock size={14} /> Agile Scheduling
                  </div>
                </div>

                {/* ── Tile 4: Beyond Static Syllabi (Col Span 8) ── */}
                <div className="fu-apple-bento-tile tile-beyond-syllabi">
                  <div className="fu-tile-header">
                    <span className="fu-apple-pill">AGILE EXPANSION</span>
                    <h3 className="fu-tile-title">
                      Beyond static syllabi.
                    </h3>
                    <p className="fu-tile-desc">
                      Beyond syllabus, we encourage students with multiple activities.
                    </p>
                  </div>

                  <div className="fu-apple-beyond-grid">
                    {/* Item 1 */}
                    <div className="fu-apple-beyond-card">
                      <div className="fu-beyond-icon-row">
                        <div className="fu-beyond-icon"><Flame size={18} /></div>
                        <span className="fu-beyond-chip">Sprint Cohorts</span>
                      </div>
                      <h4 className="fu-beyond-card-title">Immersive Bootcamps</h4>
                      <p className="fu-beyond-card-desc">Production-grade enterprise project sprints.</p>
                    </div>

                    {/* Item 2 */}
                    <div className="fu-apple-beyond-card">
                      <div className="fu-beyond-icon-row">
                        <div className="fu-beyond-icon"><Presentation size={18} /></div>
                        <span className="fu-beyond-chip">Live Sessions</span>
                      </div>
                      <h4 className="fu-beyond-card-title">Live Masterclasses</h4>
                      <p className="fu-beyond-card-desc">Modern cloud tools, frameworks, and AI workflows.</p>
                    </div>

                    {/* Item 3 */}
                    <div className="fu-apple-beyond-card">
                      <div className="fu-beyond-icon-row">
                        <div className="fu-beyond-icon"><Globe size={18} /></div>
                        <span className="fu-beyond-chip chip-accent">● Live AMAs</span>
                      </div>
                      <h4 className="fu-beyond-card-title">Industry Leader Sessions</h4>
                      <p className="fu-beyond-card-desc">Tech talks with senior engineering leaders.</p>
                    </div>

                    {/* Item 4 */}
                    <div className="fu-apple-beyond-card">
                      <div className="fu-beyond-icon-row">
                        <div className="fu-beyond-icon"><Compass size={18} /></div>
                        <span className="fu-beyond-chip">Interview Ready</span>
                      </div>
                      <h4 className="fu-beyond-card-title">Mentorship & Prep</h4>
                      <p className="fu-beyond-card-desc">1:1 code reviews, resume audits & mock interviews.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Section CTA */}
              <div className="fu-section-action-footer">
                <button 
                  className="fu-section-cta-btn"
                  onClick={() => setIsMeetingModalOpen(true)}
                  type="button"
                >
                  Book a Meeting <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </section>

          {/* ── 3-Image Horizontal Classroom/Workshop Grid Section ── */}
          <section className="fu-sec fu-gallery-section" style={{ padding: '4rem 0 3.5rem', background: '#0B0B0C' }}>
            <div className="fu-sec-inner">
              <div className="fu-campus-presence-header">
                <span className="fu-campus-badge">CAMPUS GALLERY</span>
                <h3 className="fu-campus-title">Glimpse of our campus presence</h3>
              </div>
              <div className="fu-outcome-photos-grid">
                <div className="fu-photo-card">
                  <img src="/company-look-1.jpg" alt="CipherSchools Classroom Workshop 1" className="fu-photo-img" />
                </div>
                <div className="fu-photo-card">
                  <img src="/company-look-2.jpg" alt="CipherSchools Classroom Workshop 2" className="fu-photo-img" />
                </div>
                <div className="fu-photo-card">
                  <img src="/company-look-3.jpg" alt="CipherSchools Classroom Workshop 3" className="fu-photo-img" />
                </div>
              </div>

              {/* Section CTA */}
              <div className="fu-section-action-footer" style={{ marginTop: '2.5rem' }}>
                <button 
                  className="fu-section-cta-btn"
                  onClick={() => setIsMeetingModalOpen(true)}
                  type="button"
                >
                  Book a Meeting <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>





          {/* ── 5.5 LMS Bento Section ── */}
          <section id="lms-section" ref={refLms} className={`fu-sec fu-lms-apple-bento-section fu-reveal ${visLms ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              {/* Section Header */}
              <div className="fu-apple-bento-header">
                <p className="fu-sec-eyebrow">CAMPUS LMS PLATFORM</p>
                <h2 className="fu-apple-bento-title">
                  A platform built for effortless <span className="fu-pitch-accent">learning management.</span>
                </h2>
                <p className="fu-apple-bento-sub">
                  White-labeled campus ecosystem providing seamless course delivery, real-time analytics, automated stage locking, and student progress tracking.
                </p>
              </div>

              {/* Apple-Style Asymmetrical Bento Grid */}
              <div className="fu-apple-bento-grid">
                
                {/* ── Tile 1: White-Labeled Campus Portal (Col Span 7) ── */}
                <div className="fu-apple-bento-tile tile-lms-portal">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">CUSTOM INFRASTRUCTURE</span>
                      <span className="fu-demand-score-pill">Custom Sub-Domain & SSO</span>
                    </div>
                    <h3 className="fu-tile-title">
                      White-Labeled Branding.
                    </h3>
                    <p className="fu-tile-desc">
                      Custom-branded portal integrated with your university logo, primary palette, and domain.
                    </p>
                  </div>

                  <div className="fu-lms-portal-preview-card">
                    {/* Browser Address Bar */}
                    <div className="fu-lms-browser-bar">
                      <div className="fu-lms-browser-dots">
                        <span></span><span></span><span></span>
                      </div>
                      <div className="fu-lms-url-pill">
                        <Lock size={11} />
                        <span>youruniversity.cipherschools.com</span>
                      </div>
                    </div>

                    {/* Mini Course Header & Active Session */}
                    <div className="fu-lms-active-course-row">
                      <div className="fu-lms-course-icon-badge">
                        <Laptop size={18} />
                      </div>
                      <div className="fu-lms-course-details">
                        <span className="fu-lms-course-tag">LIVE SEMESTER TRACK</span>
                        <h4 className="fu-lms-course-name">Full Stack & Java OOPs Specialization</h4>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="fu-lms-progress-box">
                      <div className="fu-lms-progress-meta">
                        <span className="fu-lms-progress-label">Batch Completion Track</span>
                        <span className="fu-lms-progress-val">86% Completed</span>
                      </div>
                      <div className="fu-lms-progress-track">
                        <div className="fu-lms-progress-bar" style={{ width: '86%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Tile 2: Prerequisite Stage Locking (Col Span 5) ── */}
                <div className="fu-apple-bento-tile tile-lms-stage-lock">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">PREREQUISITE CONTROL</span>
                      <span className="fu-stage-lock-badge">Automated Gate</span>
                    </div>
                    <h3 className="fu-tile-title">
                      Automated Stage Locking.
                    </h3>
                    <p className="fu-tile-desc">
                      Unlocks advanced modules only after students pass checkpoint evaluations.
                    </p>
                  </div>

                  <div className="fu-stage-lock-stack">
                    {/* Stage 1: Done */}
                    <div className="fu-stage-item stage-completed">
                      <div className="fu-stage-check-icon"><Check size={14} /></div>
                      <div className="fu-stage-info">
                        <span className="fu-stage-title">Module 1: Core Fundamentals</span>
                        <span className="fu-stage-sub">12 Quizzes Passed</span>
                      </div>
                      <span className="fu-stage-status-chip chip-done">PASSED</span>
                    </div>

                    {/* Stage 2: In Progress */}
                    <div className="fu-stage-item stage-active">
                      <div className="fu-stage-active-icon"><Sparkles size={14} /></div>
                      <div className="fu-stage-info">
                        <span className="fu-stage-title">Module 2: DSA & Algorithms</span>
                        <span className="fu-stage-sub">Checkpoint Test Active</span>
                      </div>
                      <span className="fu-stage-status-chip chip-active">CURRENT</span>
                    </div>

                    {/* Stage 3: Locked */}
                    <div className="fu-stage-item stage-locked">
                      <div className="fu-stage-lock-icon"><Lock size={14} /></div>
                      <div className="fu-stage-info">
                        <span className="fu-stage-title">Module 3: Enterprise Architecture</span>
                        <span className="fu-stage-sub">Unlocks after Module 2</span>
                      </div>
                      <span className="fu-stage-status-chip chip-locked">LOCKED</span>
                    </div>
                  </div>
                </div>

                {/* ── Tile 3: Assignment & Engagement Stat (Col Span 4) ── */}
                <div className="fu-apple-bento-tile tile-lms-engagement">
                  <span className="fu-apple-pill">CAMPUS ENGAGEMENT</span>
                  <div className="fu-stat-huge-number">99.4%</div>
                  <h4 className="fu-stat-tile-title">Assignment Completion</h4>
                  <p className="fu-stat-tile-desc">
                    Instant automated grading & code checks reduce evaluation time from days to seconds.
                  </p>
                  <div className="fu-stat-footer-pill">
                    <Clock size={14} /> 24/7 Automated Evaluation
                  </div>
                </div>

                {/* ── Tile 4: Granular Cohort Analytics & Live Stream (Col Span 8) ── */}
                <div className="fu-apple-bento-tile tile-lms-analytics">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">CAMPUS INTELLIGENCE</span>
                      <span className="fu-demand-score-pill">Real-Time Data Streams</span>
                    </div>
                    <h3 className="fu-tile-title">
                      Real-Time Campus Analytics.
                    </h3>
                    <p className="fu-tile-desc">
                      Granular faculty insights into attendance, code submissions, and batch-wise rankings.
                    </p>
                  </div>

                  <div className="fu-lms-analytics-grid">
                    {/* Metric 1 */}
                    <div className="fu-lms-metric-card">
                      <div className="fu-lms-metric-top">
                        <span className="fu-lms-metric-lbl">Total Tests Attempted</span>
                        <BarChart2 size={16} className="text-gray-400" />
                      </div>
                      <div className="fu-lms-metric-val">8/8 Passed</div>
                      <span className="fu-lms-metric-sub">94% Batch Average Score</span>
                    </div>

                    {/* Metric 2 */}
                    <div className="fu-lms-metric-card">
                      <div className="fu-lms-metric-top">
                        <span className="fu-lms-metric-lbl">Code Quality Index</span>
                        <Code2 size={16} className="text-gray-400" />
                      </div>
                      <div className="fu-lms-metric-val">92.8%</div>
                      <span className="fu-lms-metric-sub">Optimal Big-O Complexity</span>
                    </div>

                    {/* Metric 3 */}
                    <div className="fu-lms-metric-card">
                      <div className="fu-lms-metric-top">
                        <span className="fu-lms-metric-lbl">Placement Readiness</span>
                        <TrendingUp size={16} className="text-gray-400" />
                      </div>
                      <div className="fu-lms-metric-val">Top 5% Tier</div>
                      <span className="fu-lms-metric-sub">Recruiter Benchmark Met</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ── Exact Replica LMS Live Dashboard Showcase ── */}
              <div className="lms-replica-wrapper" style={{ marginTop: '2.5rem' }}>
                {/* Top Navbar */}
                <div className="lms-replica-topbar">
                  <div className="lms-top-left">
                    <button className="lms-hamburger-btn"><Menu size={18} /></button>
                    <div className="lms-logo-brand">
                      <span className="lms-logo-icon">C</span>
                      <span className="lms-logo-text">CipherSchools</span>
                    </div>
                  </div>
                  <div className="lms-top-right">
                    <button className="lms-experience-btn" onClick={() => setIsMeetingModalOpen(true)}>
                      <Sparkles size={14} /> Experience Yourself <ArrowRight size={14} />
                    </button>
                    <div className="lms-bell-box">
                      <Bell size={18} />
                      <span className="lms-badge">0</span>
                    </div>
                    <div className="lms-user-avatar-row">
                      <div className="lms-avatar-circle">
                        <User size={16} />
                      </div>
                      <span className="lms-user-name">Hey Sanskar</span>
                    </div>
                    <div className="lms-theme-toggle">
                      <Sun size={16} />
                    </div>
                  </div>
                </div>

                {/* Main Body Grid: Sidebar + Campus Workflows Canvas / Student Dashboard */}
                <div className={`lms-replica-body ${lmsActiveTab === 'request-feature' ? 'mode-request-feature' : ''}`}>
                  {/* Left Sidebar */}
                  <div className="lms-replica-sidebar">
                    <div 
                      className={`lms-menu-item ${lmsActiveTab === 'home' ? 'active' : ''}`}
                      onClick={() => setLmsActiveTab('home')}
                    >
                      <Home size={18} />
                      <span>Home</span>
                    </div>
                    <div 
                      className={`lms-menu-item lms-menu-syllabus-item ${lmsActiveTab === 'syllabus' ? 'active' : ''}`}
                      onClick={() => {
                        setLmsActiveTab('syllabus');
                        setHasInteractedWithSyllabus(true);
                      }}
                      title="Click to view interactive syllabus"
                    >
                      <Calendar size={18} />
                      <span>Syllabus</span>
                      <span className="lms-syllabus-live-dot" title="Interactive demo"></span>

                      {/* Animated Mouse Hover / Click Guide */}
                      {!hasInteractedWithSyllabus && lmsActiveTab !== 'syllabus' && (
                        <div className="lms-syllabus-guide-cursor">
                          <div className="lms-cursor-pointer-wrap">
                            <svg className="lms-cursor-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M4 4l7.07 17 2.51-7.39L21 11.07 4 4z" fill="#ffa103" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round"/>
                            </svg>
                            <span className="lms-cursor-click-wave"></span>
                          </div>
                          <div className="lms-cursor-callout">
                            <span>Click here</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="lms-menu-item">
                      <Presentation size={18} />
                      <span>Lectures</span>
                    </div>
                    <div className="lms-menu-item">
                      <ClipboardList size={18} />
                      <span>Practice</span>
                    </div>
                    <div className="lms-menu-item">
                      <FileText size={18} />
                      <span>Tests</span>
                    </div>
                    <div className="lms-menu-item">
                      <BarChart2 size={18} />
                      <span>Projects</span>
                    </div>
                    <div className="lms-menu-item">
                      <Folder size={18} />
                      <span>Resources</span>
                    </div>
                    <div className="lms-menu-item">
                      <Volume2 size={18} />
                      <span>Updates</span>
                      <span className="lms-updates-badge">16</span>
                    </div>
                    <div className="lms-menu-item">
                      <HelpCircle size={18} />
                      <span>Help & Support</span>
                    </div>
                    <div className="lms-menu-item">
                      <Code2 size={18} />
                      <span>Online Compiler</span>
                    </div>

                    {/* ── Request Feature in Sidebar ── */}
                    <div 
                      className={`lms-menu-item lms-menu-feature-req ${lmsActiveTab === 'request-feature' ? 'active' : ''}`}
                      onClick={() => setLmsActiveTab('request-feature')}
                      title="Request any feature for your university LMS"
                    >
                      <Sparkles size={18} className="lms-sparkle-icon" />
                      <span>Request Feature</span>
                    </div>

                    <div className="lms-menu-item lms-menu-bottom">
                      <GraduationCap size={18} />
                      <span>My Batches</span>
                    </div>
                  </div>

                  {/* ── Conditional Center Content ── */}
                  {lmsActiveTab === 'request-feature' ? (
                    /* Request Feature Mode: Exclusive Clean CAMPUS WORKFLOWS Section */
                    <div className="lms-campus-workflows-workspace animate-fade-in">
                      <div className="lms-cw-card">
                        <div className="lms-cw-header-row">
                          <div className="lms-cw-tag">
                            <Sparkles size={13} />
                            <span>CAMPUS WORKFLOWS</span>
                          </div>
                          <button 
                            className="lms-cw-close-btn" 
                            onClick={() => setLmsActiveTab('home')} 
                            title="Return to Student View"
                          >
                            ✕
                          </button>
                        </div>

                        <h3 className="lms-cw-title">
                          Build Exactly What Your Campus Needs.
                        </h3>
                        <p className="lms-cw-description">
                          Every university has unique academic and operational workflows. Tell us what your institution requires, and our engineering team will build and deploy custom modules directly into your LMS.
                        </p>

                        {/* Interactive Custom Workflow Request Box */}
                        <div className="lms-cw-request-box">
                          <div className="lms-cw-input-row">
                            <input
                              type="text"
                              className="lms-cw-input"
                              placeholder="Describe any custom workflow or module your campus requires..."
                              value={customWorkflowReq}
                              onChange={(e) => setCustomWorkflowReq(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') setIsMeetingModalOpen(true);
                              }}
                            />
                            <button
                              type="button"
                              className="lms-cw-submit-btn"
                              onClick={() => setIsMeetingModalOpen(true)}
                            >
                              <span>Book a Meeting</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="lms-cw-actions-row">
                          <span className="lms-cw-hint">
                            <CheckCircle2 size={13} />
                            <span>Complimentary engineering for partner campuses</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : lmsActiveTab === 'syllabus' ? (
                    /* Interactive University Syllabus View */
                    <div className="lms-syllabus-workspace animate-fade-in">
                      <div className="lms-syl-card">
                        {/* Header */}
                        <div className="lms-syl-header">
                          <div className="lms-syl-header-left">
                            <div className="lms-syl-tag-row">
                              <span className="lms-syl-code-badge">CS-402</span>
                              <span className="lms-syl-sem-badge">Semester IV • 4 Credits</span>
                              <span className="lms-syl-approved-badge">University Board Approved ✓</span>
                            </div>
                            <h3 className="lms-syl-title">Data Structures & Algorithms in C++ & Python</h3>
                            <p className="lms-syl-desc">
                              Semester curriculum aligned with tier-1 tech recruiter benchmarks and academic credit guidelines.
                            </p>
                          </div>

                          <div className="lms-syl-header-right">
                            <button 
                              type="button" 
                              className="lms-syl-download-btn"
                              onClick={() => alert("Downloading University Syllabus PDF...")}
                              title="Download PDF"
                            >
                              <Download size={14} />
                              <span>Download PDF</span>
                            </button>
                            <button 
                              type="button" 
                              className="lms-cw-close-btn"
                              onClick={() => setLmsActiveTab('home')}
                              title="Return to Home Dashboard"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Semester Metrics Bar */}
                        <div className="lms-syl-stats-bar">
                          <div className="lms-syl-stat-item">
                            <span className="lms-syl-stat-num">14</span>
                            <span className="lms-syl-stat-lbl">Weeks</span>
                          </div>
                          <div className="lms-syl-stat-divider"></div>
                          <div className="lms-syl-stat-item">
                            <span className="lms-syl-stat-num">42</span>
                            <span className="lms-syl-stat-lbl">Lectures</span>
                          </div>
                          <div className="lms-syl-stat-divider"></div>
                          <div className="lms-syl-stat-item">
                            <span className="lms-syl-stat-num">18</span>
                            <span className="lms-syl-stat-lbl">Coding Labs</span>
                          </div>
                          <div className="lms-syl-stat-divider"></div>
                          <div className="lms-syl-stat-item">
                            <span className="lms-syl-stat-num">4</span>
                            <span className="lms-syl-stat-lbl">Recruiter Tests</span>
                          </div>
                          <div className="lms-syl-progress-wrap">
                            <div className="lms-syl-prog-info">
                              <span>Curriculum Delivery</span>
                              <strong>65% Delivered</strong>
                            </div>
                            <div className="lms-syl-prog-track">
                              <div className="lms-syl-prog-fill" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Module Accordion List */}
                        <div className="lms-syl-modules-list">
                          {SYLLABUS_MODULES.map((mod, idx) => {
                            const isExpanded = expandedSyllabusModule === idx;
                            return (
                              <div 
                                key={mod.id} 
                                className={`lms-syl-mod-card ${isExpanded ? 'expanded' : ''}`}
                              >
                                <div 
                                  className="lms-syl-mod-header"
                                  onClick={() => setExpandedSyllabusModule(isExpanded ? null : idx)}
                                >
                                  <div className="lms-syl-mod-left">
                                    <span className={`lms-syl-status-tag tag-${mod.statusClass}`}>
                                      {mod.status}
                                    </span>
                                    <div>
                                      <h4 className="lms-syl-mod-title">
                                        {mod.week}: {mod.title}
                                      </h4>
                                      <div className="lms-syl-mod-meta">
                                        <span><Clock size={12} /> {mod.lectures} Lectures</span>
                                        <span>•</span>
                                        <span><Code size={12} /> {mod.labs} Coding Labs</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="lms-syl-mod-toggle">
                                    <span className="lms-syl-toggle-text">{isExpanded ? 'Collapse' : 'Expand Topics'}</span>
                                    <ChevronDown size={16} className={`lms-syl-chevron ${isExpanded ? 'rotated' : ''}`} />
                                  </div>
                                </div>

                                {isExpanded && (
                                  <div className="lms-syl-mod-body animate-fade-in">
                                    <div className="lms-syl-topics-grid">
                                      {mod.topics.map((t, tIdx) => (
                                        <div key={tIdx} className="lms-syl-topic-item">
                                          <CheckCircle2 size={14} color={t.done ? "#10B981" : "#9CA3AF"} />
                                          <span className={t.done ? "topic-done" : ""}>{t.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="lms-syl-lab-callout">
                                      <span className="lms-syl-lab-badge">Featured Lab Sandbox</span>
                                      <span className="lms-syl-lab-name">{mod.featuredLab}</span>
                                      <span className={`fu-solver-diff-badge diff-${mod.labDifficulty.toLowerCase()}`}>{mod.labDifficulty}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Standard Student Home Dashboard */
                    <>
                      <div className="lms-replica-center">
                        <div className="lms-center-header">
                          <h2>Hey Sanskar,</h2>
                          <button className="lms-back-btn" onClick={() => setLmsActiveTab('request-feature')}>Request Feature</button>
                        </div>

                        <div className="lms-important-label">Important</div>

                        <div className="lms-action-buttons-row">
                          <button className="lms-action-btn whatsapp-btn">Join WhatsApp Group</button>
                          <button className="lms-action-btn outline-btn">Complete Profile</button>
                          <button className="lms-action-btn outline-btn">Get Certificate</button>
                          <button 
                            className="lms-action-btn feature-req-btn"
                            onClick={() => setLmsActiveTab('request-feature')}
                            title="Request any feature for your LMS"
                          >
                            <Sparkles size={13} />
                            <span>Request Feature</span>
                          </button>
                        </div>

                        {/* Course Announcement Card */}
                        <div className="lms-main-course-card">
                          <h3>Python Programming Self Paced 2026</h3>
                          <p className="lms-course-greeting">Hey there,</p>
                          <p className="lms-course-desc">
                            we're excited to have you join our course, designed to help you learn concepts in a practical and flexible way. Get access to recorded content on the platform, along with live weekend sessions for better understanding...
                          </p>
                          <a href="#" className="lms-readmore-link" onClick={(e) => e.preventDefault()}>Read more <span>⌄</span></a>

                          <div className="lms-card-divider"></div>

                          <div className="lms-course-metadata-grid">
                            <div className="lms-meta-col">
                              <span className="lms-meta-label">Start Date</span>
                              <span className="lms-meta-val">June 12, 2026</span>
                            </div>
                            <div className="lms-meta-col">
                              <span className="lms-meta-label">Duration</span>
                              <span className="lms-meta-val">7 Weeks</span>
                            </div>
                            <div className="lms-meta-col">
                              <span className="lms-meta-label">Mentors</span>
                              <span className="lms-meta-val" style={{ fontSize: '0.82rem', lineHeight: '1.3' }}>Cipher Schools, Zubair Proddutur, Akarsh Thakur, Harsh Tyagi</span>
                            </div>
                          </div>
                        </div>

                        {/* Keep Practicing Section */}
                        <div className="lms-practice-resume-card">
                          <div className="lms-practice-header">
                            <h4>Keep Practicing From Where You Left</h4>
                            <a href="#" className="lms-viewmore-link" onClick={(e) => e.preventDefault()}>View more ›</a>
                          </div>
                          <div className="lms-practice-item-row">
                            <div className="lms-practice-item-info">
                              <span className="lms-practice-item-title">Daily Temperature Streak</span>
                              <span className="lms-practice-item-type">Practice Problem</span>
                            </div>
                            <div className="lms-practice-item-actions">
                              <span className="lms-diff-tag easy">Easy</span>
                              <button className="lms-continue-btn">Continue</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Panel Widgets */}
                      <div className="lms-replica-right">
                        {/* Dark Graphic Banner */}
                        <div className="lms-course-banner-card">
                          <div className="lms-banner-content">
                            <span className="lms-live-badge">Recorded + Live Lectures | Online</span>
                            <h4>Python with OOPs Programming Language</h4>
                          </div>
                          <div className="lms-java-logo">🐍</div>
                        </div>

                        {/* Widget 1: Total Videos Watched */}
                        <div className="lms-widget-card">
                          <span className="lms-widget-title">Total Videos Watched</span>
                          <div className="lms-widget-stat">0/35</div>
                          <a href="#" className="lms-widget-link" onClick={(e) => e.preventDefault()}>Watch Now →</a>
                        </div>

                        {/* Widget 2: Total Questions Solved */}
                        <div className="lms-widget-card">
                          <span className="lms-widget-title">Total Questions Solved</span>
                          <div className="lms-widget-stat">0/67</div>
                          <a href="#" className="lms-widget-link" onClick={(e) => e.preventDefault()}>Practice Now →</a>
                        </div>

                        {/* Widget 3: Total Tests Attempted */}
                        <div className="lms-widget-card">
                          <span className="lms-widget-title">Total Tests Attempted</span>
                          <div className="lms-widget-stat">0/20</div>
                          <a href="#" className="lms-widget-link" onClick={(e) => e.preventDefault()}>Take Test →</a>
                        </div>

                        {/* Widget 4: Total Projects Completed */}
                        <div className="lms-widget-card">
                          <span className="lms-widget-title">Total Projects Completed</span>
                          <div className="lms-widget-stat">0/1</div>
                          <a href="#" className="lms-widget-link" onClick={(e) => e.preventDefault()}>View Projects →</a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Section CTA */}
              <div className="fu-section-action-footer">
                <button 
                  className="fu-section-cta-btn"
                  onClick={() => setIsMeetingModalOpen(true)}
                  type="button"
                >
                  Book a Meeting <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </section>

          {/* ── 7. Assessment Platform (Spacious HackerRank/Engage Inspired Layout) ── */}
          {/* ── Apple-Style Master Assessment Bento Grid ── */}
          <section id="assessment-section" ref={refAssessment} className={`fu-sec fu-assessment-apple-bento-section fu-reveal ${visAssessment ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              {/* Section Header */}
              <div className="fu-apple-bento-header">
                <p className="fu-sec-eyebrow">ASSESSMENT PLATFORM</p>
                <h2 className="fu-apple-bento-title">
                  Measure what matters, <span className="fu-pitch-accent">automatically.</span>
                </h2>
                <p className="fu-apple-bento-sub">
                  Multi-language coding sandboxes, proctored aptitude tests, and real-time candidate analytics.
                </p>
              </div>

              {/* Apple-Style Asymmetrical Bento Grid */}
              <div className="fu-apple-bento-grid">
                
                {/* ── Tile 1: Proctored Test Engine (Col Span 7) ── */}
                <div className="fu-apple-bento-tile tile-coding-sandbox">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">PROCTORED TEST</span>
                      <span className="fu-demand-score-pill">Anti-Cheat Active</span>
                    </div>
                    <h3 className="fu-tile-title">
                      Comprehensive Proctored Test Engine.
                    </h3>
                    <p className="fu-tile-desc">
                      Multi-tier evaluation suite supporting standard multi-language assessments and modern generative AI prompt-level testing.
                    </p>
                  </div>

                  <div className="fu-mock-as-coding-rich">
                    {/* Browser Support Strip */}
                    <div className="fme-coding-header">
                      <div className="fme-support-strip">
                        <span className="fme-support-label">SUPPORTS:</span>
                        <span className="fme-support-text">
                          Chrome browser or Safe Browser (In-house)
                        </span>
                      </div>
                    </div>

                    {/* Test Modes Container */}
                    <div className="fu-proctor-modes-container">
                      {/* Mode 1: Standard Proctored Test */}
                      <div className="fu-proctor-mode-block">
                        <div className="fu-proctor-mode-header">
                          <h4 className="fu-proctor-mode-title">Standard Proctored Test</h4>
                          <span className="fme-mode-tag">Production Engine</span>
                        </div>

                        <div className="fme-editor-top">
                          <div className="fme-editor-lang-tabs-wrapper">
                            <span className="fme-lang-label">Languages supported:</span>
                            <div className="fme-editor-lang-tabs">
                              {['Python', 'JAVA', 'C++', 'C'].map((lang) => (
                                <button
                                  key={lang}
                                  type="button"
                                  className={`fme-editor-tab ${selectedSandboxLang === lang ? 'active-tab' : ''}`}
                                  onClick={() => setSelectedSandboxLang(lang)}
                                >
                                  {lang}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="fm-editor-code">
                          {SANDBOX_LANG_SNIPPETS[selectedSandboxLang]?.code || SANDBOX_LANG_SNIPPETS.Python.code}
                        </div>
                      </div>

                      {/* Mode 2: Prompt Level Test */}
                      <div className="fu-proctor-mode-block fu-prompt-level-block">
                        <div className="fu-proctor-mode-header">
                          <div className="fu-proctor-title-row">
                            <h4 className="fu-proctor-mode-title">Prompt Level Test</h4>
                            <span className="fu-ai-tag">AI</span>
                          </div>
                          <span className="fme-mode-tag">Prompt Engineering</span>
                        </div>

                        <p className="fu-prompt-block-desc">
                          Modern generative AI and prompt engineering assessments to evaluate AI problem-solving.
                        </p>

                        <div className="fu-prompt-sample-box">
                          <div className="fu-prompt-box-top">
                            <span className="fu-prompt-box-label">Evaluation Task:</span>
                            <span className="fu-prompt-metric-tag">Guardrails Verified ✓</span>
                          </div>
                          <p className="fu-prompt-box-text">
                            "Design a constrained prompt pipeline to extract structured JSON entities from technical documentation with zero hallucination."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Tile 2: Proctored Aptitude & Reasoning Tests (Col Span 5) ── */}
                <div className="fu-apple-bento-tile tile-aptitude-test">
                  <div className="fu-tile-header">
                    <span className="fu-apple-pill">PROCTORED EXAMS</span>
                    <h3 className="fu-tile-title" style={{ fontSize: '1.15rem' }}>
                      Aptitude & Reasoning.
                    </h3>
                    <p className="fu-tile-desc">
                      Timed evaluations with anti-cheat proctoring across multiple assessment formats.
                    </p>
                  </div>

                  {(() => {
                    const currentTrack = EXAM_TRACKS.find((t) => t.id === selectedExamTrack) || EXAM_TRACKS[0];
                    return (
                      <div className="fu-mock-as-exam" style={{ marginTop: 'auto' }}>
                        <div className="fme-header">
                          <span className="fme-time">{currentTrack.time}</span>
                          <span className="fme-qnum">{currentTrack.category}</span>
                        </div>
                        <div className="fme-body">
                          <div className="fme-q" style={{ fontSize: '0.78rem' }}>
                            {currentTrack.question}
                          </div>

                          {currentTrack.options ? (
                            <div className="fme-options" style={{ gap: '4px', marginTop: '6px' }}>
                              {currentTrack.options.map((opt, idx) => (
                                <div
                                  key={idx}
                                  className={`fme-opt ${opt.active ? 'active' : ''}`}
                                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                                >
                                  <div className={`fme-radio ${opt.active ? 'checked' : ''}`} />
                                  {opt.text}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="fme-specs-list" style={{ gap: '4px', marginTop: '6px' }}>
                              {currentTrack.specs.map((spec, idx) => (
                                <div key={idx} className="fme-spec-row">
                                  {spec}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 4 Supported Test Formats List */}
                          <div className="fme-formats-container">
                            <div className="fme-formats-label">SUPPORTED TEST FORMATS:</div>
                            <div className="fme-formats-list">
                              {EXAM_TRACKS.map((track) => {
                                const isSelected = selectedExamTrack === track.id;
                                return (
                                  <button
                                    key={track.id}
                                    type="button"
                                    className={`fme-format-btn ${isSelected ? 'active' : ''}`}
                                    onClick={() => setSelectedExamTrack(track.id)}
                                  >
                                    <div className="fme-format-name-col">
                                      <span className={`fme-format-dot ${isSelected ? 'active' : ''}`} />
                                      <span className="fme-format-title">{track.name}</span>
                                    </div>
                                    <span className="fme-format-tag">{track.tag}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* ── Tile 4: Real-Time Performance Analytics & Trajectory (Col Span 8) ── */}
                <div className="fu-apple-bento-tile tile-analytics-trajectory">
                  <div className="fu-tile-header">
                    <div className="fu-tile-badge-row">
                      <span className="fu-apple-pill">GROWTH ANALYTICS</span>
                      <span className="fma-badge">+184% Growth 🚀</span>
                    </div>
                    <h3 className="fu-tile-title">
                      Performance Trajectories.
                    </h3>
                    <p className="fu-tile-desc">
                      Deep student cohort analytics, batch readiness tracking, and domain percentile rankings.
                    </p>
                  </div>

                  <div className="fu-apple-analytics-box">
                    <div className="fma-chart-header" style={{ marginBottom: '0.5rem' }}>
                      <div className="fma-chart-metric">
                        <span className="fma-metric-num" style={{ fontSize: '1.75rem' }}>96%</span>
                        <span className="fma-metric-lbl">Cohort Readiness Benchmark</span>
                      </div>
                      <span className="fu-growth-tag">Top 5% Tier Recruiter Level</span>
                    </div>

                    <div className="fma-svg-container">
                      <svg viewBox="0 0 500 140" className="fma-svg-chart">
                        <defs>
                          <linearGradient id="fmaGradientApple" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f7931e" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#f7931e" stopOpacity="0.0"/>
                          </linearGradient>
                        </defs>
                        <line x1="40" y1="25" x2="470" y2="25" stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                        <line x1="40" y1="65" x2="470" y2="65" stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                        <line x1="40" y1="105" x2="470" y2="105" stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                        <path d="M 40 115 Q 150 105 250 75 T 470 20 L 470 130 L 40 130 Z" fill="url(#fmaGradientApple)" />
                        <path d="M 40 115 Q 150 105 250 75 T 470 20" fill="none" stroke="#ffa103" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="40" cy="115" r="4.5" fill="#ffa103" stroke="#fff" strokeWidth="2" />
                        <text x="40" y="105" fill="#aaa" fontSize="10" textAnchor="middle">32%</text>
                        <text x="40" y="135" fill="#888" fontSize="10" textAnchor="middle">Jan</text>
                        <circle cx="255" cy="75" r="4.5" fill="#ffa103" stroke="#fff" strokeWidth="2" />
                        <text x="255" y="62" fill="#ffa103" fontSize="10" fontWeight="bold" textAnchor="middle">68%</text>
                        <text x="255" y="135" fill="#888" fontSize="10" textAnchor="middle">March</text>
                        <circle cx="470" cy="20" r="5.5" fill="#00c853" stroke="#fff" strokeWidth="2" />
                        <text x="470" y="11" fill="#00c853" fontSize="10" fontWeight="900" textAnchor="middle">96% 🔥</text>
                        <text x="470" y="135" fill="#00c853" fontSize="10" fontWeight="bold" textAnchor="middle">May</text>
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* Section CTA */}
              <div className="fu-section-action-footer">
                <button 
                  className="fu-section-cta-btn"
                  onClick={() => setIsMeetingModalOpen(true)}
                  type="button"
                >
                  Book a Meeting <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </section>

          {/* ── 8. Practice Environment [AI] Section ── */}
          <section id="practice-section" ref={refPractice} className={`fu-sec fu-practice-apple-section fu-reveal ${visPractice ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              {/* Section Header */}
              <div className="fu-apple-bento-header">
                <p className="fu-sec-eyebrow">PRACTICE ENVIRONMENT [AI]</p>
                <h2 className="fu-apple-bento-title">
                  Real-world problem solving, <span className="fu-pitch-accent">mastered hands-on.</span>
                </h2>
                <p className="fu-apple-bento-sub">
                  Self-paced sandboxes featuring 340+ curated programming, DSA, and SQL challenges, intelligent AI hints, and instant browser compilation.
                </p>
              </div>

              {/* Interactive Practice Card */}
              {/* Interactive Practice Card: Dedicated Workspace Mockup */}
              <div className="fu-practice-main-card">
                <div className="fu-solver-workspace">
                  {/* 1. Solver Top Navigation Bar */}
                  <div className="fu-solver-top-bar">
                      <div className="fu-solver-nav-left">
                        <button
                          type="button"
                          className="fu-solver-back-btn"
                          onClick={() => setPracticeViewTab('problem')}
                          title="Back"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <button
                          type="button"
                          className={`fu-solver-tab-btn ${practiceViewTab === 'problem' ? 'active' : ''}`}
                          onClick={() => setPracticeViewTab('problem')}
                        >
                          <Code size={15} />
                          <span>Problem</span>
                        </button>

                        <button
                          type="button"
                          className={`fu-solver-tab-btn ${practiceViewTab === 'submissions' ? 'active' : ''}`}
                          onClick={() => setPracticeViewTab('submissions')}
                        >
                          <Clock size={14} />
                          <span>Submissions</span>
                          <span className="fu-solver-sub-count">{problemSubmissions.length}</span>
                        </button>
                      </div>

                      <div className="fu-solver-nav-right">
                        {/* Language Selector */}
                        <div className="fu-solver-lang-wrapper">
                          <Code size={13} className="fu-solver-lang-icon" />
                          <select
                            value={sandboxLang}
                            onChange={(e) => handleSandboxLangChange(e.target.value)}
                            className="fu-solver-lang-select"
                          >
                            <option value="JAVA">JAVA</option>
                            <option value="Python">Python</option>
                            <option value="CPP">C++</option>
                          </select>
                          <ChevronDown size={13} className="fu-solver-lang-chevron" />
                        </div>

                        {/* Monospace Timer Pill */}
                        <div className="fu-solver-timer-pill" title="Elapsed Time">
                          <Clock size={13} />
                          <span>{formatTimer(sessionTimer)}</span>
                        </div>

                        {/* Reset Code */}
                        <button
                          type="button"
                          className="fu-solver-icon-btn"
                          onClick={handleResetCode}
                          title="Reset to default starter code"
                        >
                          <RotateCcw size={15} />
                        </button>

                        {/* Run Code */}
                        <div className="fu-solver-btn-wrap">
                          <button
                            type="button"
                            className="fu-solver-run-btn"
                            onClick={() => {
                              setHasInteractedWithSandbox(true);
                              handleRunSandboxCode();
                            }}
                            disabled={isRunningSandbox}
                            title="Run code against sample test cases"
                          >
                            <Play size={13} fill="currentColor" />
                            <span>{isRunningSandbox ? 'Running...' : 'Run Code'}</span>
                          </button>

                          {/* Animated Cursor Guide for Run Code */}
                          {!hasInteractedWithSandbox && (
                            <div className="fu-run-guide-cursor">
                              <div className="lms-cursor-pointer-wrap">
                                <svg className="lms-cursor-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path d="M4 4l7.07 17 2.51-7.39L21 11.07 4 4z" fill="#2563EB" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round"/>
                                </svg>
                                <span className="fu-cursor-click-wave"></span>
                              </div>
                              <div className="fu-cursor-callout">
                                <span>Try Run Code</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Submit */}
                        <div className="fu-solver-btn-wrap">
                          <button
                            type="button"
                            className="fu-solver-submit-btn"
                            onClick={() => {
                              setHasInteractedWithSandbox(true);
                              handleSubmitSandbox();
                            }}
                            disabled={isSandboxSubmitting}
                            title="Submit solution for grading"
                          >
                            <Check size={14} strokeWidth={2.5} />
                            <span>{isSandboxSubmitting ? 'Submitting...' : 'Submit'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 2. Main Workspace Body */}
                    {practiceViewTab === 'problem' ? (
                      <div className="fu-solver-split-body">
                        
                        {/* Left Pane: Problem Statement */}
                        <div className="fu-solver-desc-pane">
                          <div className="fu-solver-title-row">
                            <h3 className="fu-solver-problem-title">{activePracticeProblem.title}</h3>
                            <span className={`fu-solver-diff-badge diff-${activePracticeProblem.difficulty.toLowerCase()}`}>
                              {activePracticeProblem.difficulty.toUpperCase()}
                            </span>
                          </div>

                          <div className="fu-solver-narrative">
                            {activePracticeProblem.desc.split('\n\n').map((para, i) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>

                          {/* 3 Example Cards matching screenshot */}
                          <div className="fu-solver-examples-list">
                            {(activePracticeProblem.examples || []).map((ex, idx) => (
                              <div key={ex.id || idx} className="fu-solver-example-card">
                                <div className="fu-solver-ex-heading">{ex.title || `Example ${idx + 1}`}</div>
                                
                                <div className="fu-solver-ex-field">
                                  <span className="fu-solver-field-label">INPUT:</span>
                                  <div className="fu-solver-field-box">{ex.input}</div>
                                </div>

                                <div className="fu-solver-ex-field">
                                  <span className="fu-solver-field-label">OUTPUT:</span>
                                  <div className="fu-solver-field-box">{ex.output}</div>
                                </div>

                                {ex.explanation && (
                                  <div className="fu-solver-ex-field fu-solver-ex-expl">
                                    <span className="fu-solver-field-label">EXPLANATION:</span>
                                    <div className="fu-solver-field-text">
                                      {ex.explanation.split('\n').map((line, li) => (
                                        <p key={li}>{line}</p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Center Divider / Drag Handle */}
                        <div className="fu-solver-divider">
                          <span className="fu-solver-handle-dots">⋮⋮</span>
                        </div>

                        {/* Right Pane: Code Editor + AI Assistance Drawer */}
                        <div className="fu-solver-editor-pane">
                          {/* Upper Half: Code Editor */}
                          <div className="fu-solver-editor-main">
                            {/* Line Numbers Gutter */}
                            <div className="fu-solver-gutter">
                              {Array.from({ length: Math.max((sandboxCode || '').split('\n').length, 5) }, (_, i) => (
                                <span key={i + 1} className="fu-gutter-num">{i + 1}</span>
                              ))}
                            </div>

                            {/* Code Textarea */}
                            <div className="fu-solver-code-wrap">
                              <textarea
                                className="fu-solver-textarea"
                                value={sandboxCode}
                                onChange={(e) => setSandboxCode(e.target.value)}
                                spellCheck="false"
                                wrap="off"
                              />
                            </div>
                          </div>

                          {/* Submission Verdict Banner */}
                          {submissionVerdict && (
                            <div className="fu-solver-verdict-banner">
                              <div className="fu-verdict-top">
                                <div className="fu-verdict-title">
                                  <CheckCircle2 size={18} color="#059669" />
                                  <span>Accepted</span>
                                </div>
                                <button
                                  type="button"
                                  className="fu-verdict-close"
                                  onClick={() => setSubmissionVerdict(null)}
                                >
                                  <X size={15} />
                                </button>
                              </div>
                              <div className="fu-verdict-stats">
                                <div className="fu-verdict-stat">
                                  <span className="fu-stat-label">Runtime:</span>
                                  <strong className="fu-stat-val">{submissionVerdict.runtime}</strong>
                                  <span className="fu-stat-sub">(Beats {submissionVerdict.runtimePercentile})</span>
                                </div>
                                <div className="fu-verdict-stat">
                                  <span className="fu-stat-label">Memory:</span>
                                  <strong className="fu-stat-val">{submissionVerdict.memory}</strong>
                                  <span className="fu-stat-sub">(Beats {submissionVerdict.memoryPercentile})</span>
                                </div>
                                <div className="fu-verdict-stat">
                                  <span className="fu-stat-label">Testcases:</span>
                                  <strong className="fu-stat-val status-green">{submissionVerdict.casesPassed}/{submissionVerdict.totalCases} Passed ✓</strong>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Lower Half: AI Terminal & Test Cases Console */}
                          <div className="fu-ai-terminal-console">
                            {/* Terminal Header Bar */}
                            <div className="fu-ai-term-header">
                              <div className="fu-ai-term-title">
                                <span className="fu-ai-term-badge-icon">
                                  <Terminal size={12} />
                                </span>
                                <span className="fu-ai-term-path">ai_assist@cipherschools_labs ~ zsh</span>
                              </div>

                              <div className="fu-ai-term-actions">
                                <div className="fu-ai-term-hint-count" title="Algorithmic Hint Stages">
                                  <span>AI HINT ({aiHintStage}/3)</span>
                                  <Info size={13} />
                                </div>

                                <button
                                  type="button"
                                  className="fu-ai-term-run-btn"
                                  onClick={() => {
                                    setActiveDrawerTab('ai');
                                    handleTerminalCommand('/hint run');
                                  }}
                                  title="Request Next Hint Stage"
                                >
                                  <Play size={11} fill="currentColor" />
                                  <span>Run AI Assist</span>
                                </button>

                                <button
                                  type="button"
                                  className="fu-ai-term-text-btn"
                                  onClick={() => handleTerminalCommand('/clear')}
                                  title="Clear Terminal Output"
                                >
                                  clear
                                </button>

                                <div className="fu-ai-term-win-controls">
                                  <button type="button" className="fu-ai-win-ctrl" title="Minimize">
                                    <span>—</span>
                                  </button>
                                  <button type="button" className="fu-ai-win-ctrl" title="Maximize">
                                    <span>⤢</span>
                                  </button>
                                  <button 
                                    type="button" 
                                    className="fu-ai-win-ctrl" 
                                    title="Reset Terminal"
                                    onClick={() => handleTerminalCommand('/clear')}
                                  >
                                    <span>✕</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Advanced Tools Sub-Bar */}
                            <div className="fu-ai-term-tools-bar">
                              <div className="fu-ai-tools-count">
                                <span>ADVANCED TOOLS ({advancedToolsUsed}/10)</span>
                                <Info size={12} />
                              </div>

                              <div className="fu-ai-tool-pills">
                                <button
                                  type="button"
                                  className="fu-ai-tool-pill"
                                  onClick={() => {
                                    setActiveDrawerTab('ai');
                                    handleTerminalCommand('./analyze_complexity');
                                  }}
                                  title="Run Complexity Analysis"
                                >
                                  ./analyze_complexity
                                </button>
                                <button
                                  type="button"
                                  className="fu-ai-tool-pill"
                                  onClick={() => {
                                    setActiveDrawerTab('ai');
                                    handleTerminalCommand('./dry_run');
                                  }}
                                  title="Trace Code Execution Line by Line"
                                >
                                  ./dry_run
                                </button>
                                <button
                                  type="button"
                                  className="fu-ai-tool-pill"
                                  onClick={() => {
                                    setActiveDrawerTab('ai');
                                    handleTerminalCommand('./fix_my_code');
                                  }}
                                  title="Get AI-Powered Code Fix Suggestions"
                                >
                                  ./fix_my_code
                                </button>
                              </div>
                            </div>

                            {/* Drawer Body: AI Terminal OR Test Cases */}
                            {activeDrawerTab === 'ai' ? (
                              <div className="fu-ai-term-body">
                                <div className="fu-ai-term-logs">
                                  {terminalLogs.map((log) => (
                                    <div key={log.id} className={`fu-ai-log-entry log-${log.type}`}>
                                      {log.type === 'welcome' && (
                                        <div className="fu-ai-welcome-block">
                                          <div className="fu-ai-welcome-title">Welcome to CipherSchools Labs AI Assist Terminal</div>
                                          <pre className="fu-ai-welcome-text">{log.content.replace('Welcome to CipherSchools Labs AI Assist Terminal\n\n', '')}</pre>
                                        </div>
                                      )}
                                      {log.type === 'command' && (
                                        <div className="fu-ai-cmd-block">
                                          <div className="fu-ai-cmd-input-line">
                                            <span className="fu-ai-prompt-symbol">ai_assist@cipherschools_labs:~$</span>
                                            <span className="fu-ai-cmd-typed">{log.cmd}</span>
                                          </div>
                                          <pre className="fu-ai-cmd-output">{log.output}</pre>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  <div ref={terminalBottomRef} />
                                </div>

                                {/* Terminal Prompt Form */}
                                <form
                                  className="fu-ai-prompt-form"
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    handleTerminalCommand();
                                  }}
                                >
                                  <span className="fu-ai-prompt-symbol">ai_assist@cipherschools_labs:~$</span>
                                  <input
                                    type="text"
                                    className="fu-ai-prompt-input"
                                    value={terminalInput}
                                    onChange={(e) => setTerminalInput(e.target.value)}
                                    placeholder="type /help for commands..."
                                    spellCheck="false"
                                  />
                                </form>
                              </div>
                            ) : (
                              /* Test Cases Console */
                              <div className="fu-tc-drawer fu-tc-drawer-in-term">
                                <div className="fu-tc-tabs">
                                  {((sandboxRunResult && sandboxRunResult.cases) || activePracticeProblem.testCases || []).map((tc, idx) => (
                                    <button
                                      key={tc.id || idx}
                                      type="button"
                                      className={`fu-tc-case-tab ${activeTestCaseTab === idx ? 'active' : ''}`}
                                      onClick={() => setActiveTestCaseTab(idx)}
                                    >
                                      <span className="fu-tc-dot-green" /> Case {idx + 1}
                                    </button>
                                  ))}
                                </div>

                                {(() => {
                                  const casesList = (sandboxRunResult && sandboxRunResult.cases) || activePracticeProblem.testCases || [];
                                  const activeCase = casesList[activeTestCaseTab] || casesList[0] || {};
                                  return (
                                    <div className="fu-tc-case-body">
                                      <div className="fu-tc-item">
                                        <span className="fu-tc-label">Input:</span>
                                        <div className="fu-tc-box">{activeCase.input}</div>
                                      </div>
                                      <div className="fu-tc-split-row">
                                        <div className="fu-tc-item">
                                          <span className="fu-tc-label">Output:</span>
                                          <div className="fu-tc-box output-pass">{activeCase.actual || activeCase.expected}</div>
                                        </div>
                                        <div className="fu-tc-item">
                                          <span className="fu-tc-label">Expected:</span>
                                          <div className="fu-tc-box">{activeCase.expected}</div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}

                            {/* Bottom Tab Bar (Test Cases & AI Assistance) */}
                            <div className="fu-ai-term-bottom-tabs">
                              <button
                                type="button"
                                className={`fu-ai-bottom-tab-btn ${activeDrawerTab === 'testcases' ? 'active' : ''}`}
                                onClick={() => setActiveDrawerTab('testcases')}
                              >
                                <span>Test Cases</span>
                              </button>

                              <button
                                type="button"
                                className={`fu-ai-bottom-tab-btn ${activeDrawerTab === 'ai' ? 'active-brand' : ''}`}
                                onClick={() => setActiveDrawerTab('ai')}
                              >
                                <span>AI Assistance</span>
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* Submissions View */
                      <div className="fu-solver-submissions-pane">
                        <div className="fu-sub-top-header">
                          <h4>Submission History for {activePracticeProblem.title}</h4>
                          <button
                            type="button"
                            className="fu-sub-back-btn"
                            onClick={() => setPracticeViewTab('problem')}
                          >
                            ← Back to Problem & Code
                          </button>
                        </div>

                        <table className="fu-sub-table">
                          <thead>
                            <tr>
                              <th>STATUS</th>
                              <th>LANGUAGE</th>
                              <th>RUNTIME</th>
                              <th>MEMORY</th>
                              <th>SUBMITTED</th>
                            </tr>
                          </thead>
                          <tbody>
                            {problemSubmissions.map((sub, idx) => (
                              <tr key={sub.id || idx}>
                                <td>
                                  <span className="fu-sub-status-badge accepted">
                                    <CheckCircle2 size={13} /> {sub.status}
                                  </span>
                                </td>
                                <td><span className="fu-sub-lang">{sub.language}</span></td>
                                <td>{sub.runtime}</td>
                                <td>{sub.memory}</td>
                                <td className="fu-sub-date">{sub.submittedAt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                </div>
              </div>

              {/* Section CTA */}
              <div className="fu-section-action-footer">
                <button 
                  className="fu-section-cta-btn"
                  onClick={() => setIsMeetingModalOpen(true)}
                  type="button"
                >
                  Book a Meeting <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </section>

          {/* ── 9. Mock Interview [AI] Section ── */}
          <section id="mock-interview-section" ref={refMockInterview} className={`fu-sec fu-mock-interview-apple-section fu-reveal ${visMockInterview ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              {/* Section Header */}
              <div className="fu-apple-bento-header">
                <p className="fu-sec-eyebrow">MOCK INTERVIEW [AI]</p>
                <h2 className="fu-apple-bento-title">
                  Real-time technical interviews, <span className="fu-pitch-accent">evaluated end-to-end.</span>
                </h2>
                <p className="fu-apple-bento-sub">
                  Target high-bar company roles, and let AI evaluate system design, technical depth, and communication rigor in real-time.
                </p>
              </div>

              {/* Functional Mockup Card */}
              <div className="fu-mi-main-card">
                
                {/* 1. Step Navigation Tabs */}
                <div className="fu-mi-steps-bar">
                  <button
                    type="button"
                    className={`fu-mi-step-tab ${mockInterviewStage === 'interview' ? 'active' : ''}`}
                    onClick={() => setMockInterviewStage('interview')}
                  >
                    <span className="fu-mi-step-num">1</span>
                    <span>Live AI Interview</span>
                  </button>

                  <button
                    type="button"
                    className={`fu-mi-step-tab ${mockInterviewStage === 'report' ? 'active' : ''}`}
                    onClick={() => setMockInterviewStage('report')}
                  >
                    <span className="fu-mi-step-num">2</span>
                    <span>360° Evaluation Report</span>
                  </button>
                </div>

                {/* ── STAGE 2: LIVE AI INTERVIEW ── */}
                {mockInterviewStage === 'interview' && (
                  <div className="fu-mi-stage-content fu-mi-stage-interview">
                    
                    {/* Live Room Frame */}
                    <div className="fu-mi-live-room-frame">
                      
                      {/* Top Status Header */}
                      <div className="fu-mi-live-header">
                        <div className="fu-mi-live-q-meta">
                          <span className="fu-mi-q-step">
                            Q{currentQuestionIdx + 1} / {currentInterviewQuestions.length}
                          </span>
                          <span className="fu-mi-meta-bullet">·</span>
                          <span className="fu-mi-asking-tag">
                            <span className="fu-mi-asking-dot" /> interviewer asking
                          </span>
                        </div>

                        <div className="fu-mi-live-header-right">
                          <div className="fu-mi-live-pill pill-timer">
                            <span className="fu-mi-rec-dot" />
                            <span>18:42</span>
                          </div>
                          <div className="fu-mi-live-pill pill-conn">
                            <span className="fu-mi-conn-dot" />
                            <span>Good connection</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Workspace: Left Question Area + Right Participant Video Feeds */}
                      <div className="fu-mi-live-body">
                        
                        {/* Left Column: Interviewer Question & Context */}
                        <div className="fu-mi-live-question-pane">
                          <h2 className="fu-mi-live-q-heading">
                            {currentQ.question}
                          </h2>

                          {(currentQ.context || currentQ.ref) && (
                            <div className="fu-mi-live-q-context">
                              <p>{currentQ.context || currentQ.ref}</p>
                            </div>
                          )}

                          <div className="fu-mi-live-q-prompt">
                            {currentQ.helperText || "Take your time — speak when you're ready"}
                          </div>

                          {/* Live Speech Recognition & Candidate Transcription Preview */}
                          {(isVoiceRecording || candidateAnswer) && (
                            <div className="fu-mi-live-transcription-box">
                              <div className="fu-mi-transcription-status">
                                <span className="fu-mi-listening-pulse" />
                                <span>{isVoiceRecording ? 'Transcribing your audio...' : 'Candidate Response:'}</span>
                              </div>
                              <p className="fu-mi-transcription-text">
                                "{candidateAnswer || currentQ.sampleAnswer}"
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right Column: AI Interviewer Persona + Candidate Video Tile */}
                        <div className="fu-mi-live-video-pane">
                          
                          {/* Top Tile: AI Interviewer */}
                          <div className="fu-mi-ai-video-card">
                            <div className="fu-mi-ai-aura">
                              <div className="fu-mi-concentric-ring ring-3" />
                              <div className="fu-mi-concentric-ring ring-2" />
                              <div className="fu-mi-concentric-ring ring-1">
                                <Bot size={28} className="fu-mi-bot-svg" />
                              </div>
                            </div>
                            <h4 className="fu-mi-ai-card-name">AI Interviewer</h4>
                            <div className="fu-mi-ai-speaking-badge">
                              <div className="fu-mi-audio-bars">
                                <span className="fu-mi-bar bar-1" />
                                <span className="fu-mi-bar bar-2" />
                                <span className="fu-mi-bar bar-3" />
                                <span className="fu-mi-bar bar-4" />
                              </div>
                              <span>Speaking</span>
                            </div>
                          </div>

                          {/* Bottom Tile: Candidate Stream ("You") */}
                          <div className={`fu-mi-user-video-tile ${!isVideoOn ? 'video-off' : ''}`}>
                            <div className="fu-mi-silhouette-center">
                              <div className="fu-mi-silhouette-head" />
                              <div className="fu-mi-silhouette-torso" />
                            </div>

                            {/* Top-Right Mic Status */}
                            <button
                              type="button"
                              className={`fu-mi-stream-mic-badge ${!isVoiceRecording ? 'is-muted' : 'is-live'}`}
                              onClick={() => setIsVoiceRecording(!isVoiceRecording)}
                              title={isVoiceRecording ? "Microphone active - click to mute" : "Microphone muted - click to speak"}
                            >
                              {!isVoiceRecording ? <MicOff size={13} /> : <Mic size={13} />}
                            </button>

                            {/* Bottom-Left Frosted You Tag */}
                            <div className="fu-mi-stream-status-pill">
                              <span className="fu-mi-stream-name">
                                {customUploadedFile ? 'You' : `You (${activeResume.candidateName.split(' ')[0]})`}
                              </span>
                              <span className="fu-mi-face-detection">
                                <span className="fu-mi-face-dot" /> Face detected
                              </span>
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Bottom Floating Control Dock */}
                      <div className="fu-mi-live-bottom-bar">
                        <div className="fu-mi-controls-dock">
                          
                          {/* Mic Button */}
                          <button
                            type="button"
                            className={`fu-mi-ctrl-btn ${!isVoiceRecording ? 'btn-mic-muted' : 'btn-mic-live'}`}
                            onClick={() => setIsVoiceRecording(!isVoiceRecording)}
                            title={isVoiceRecording ? "Mute Microphone" : "Unmute Microphone"}
                          >
                            {!isVoiceRecording ? <MicOff size={18} /> : <Mic size={18} />}
                          </button>

                          {/* Camera Button */}
                          <button
                            type="button"
                            className={`fu-mi-ctrl-btn ${isVideoOn ? 'btn-cam-on' : 'btn-cam-off'}`}
                            onClick={() => setIsVideoOn(!isVideoOn)}
                            title={isVideoOn ? "Turn off camera" : "Turn on camera"}
                          >
                            {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
                          </button>

                          {/* Next Question Button */}
                          {currentQuestionIdx < currentInterviewQuestions.length - 1 && (
                            <button
                              type="button"
                              className="fu-mi-ctrl-btn btn-next-q"
                              onClick={handleNextQuestion}
                              title="Next Interview Question"
                            >
                              <span>Next Question</span>
                              <ArrowRight size={15} />
                            </button>
                          )}

                          {/* End Interview Button */}
                          <button
                            type="button"
                            className="fu-mi-ctrl-btn btn-end"
                            onClick={() => {
                              setIsEvaluatingAnswer(true);
                              setTimeout(() => {
                                setIsEvaluatingAnswer(false);
                                setMockInterviewStage('report');
                              }, 600);
                            }}
                            title="End Interview & View Detailed Report"
                          >
                            <PhoneOff size={16} />
                            <span>End</span>
                          </button>

                        </div>

                        {/* Info Button in Bottom-Right Corner */}
                        <button
                          type="button"
                          className="fu-mi-info-btn"
                          onClick={() => alert(`CipherSchools AI Interview Room\n• Batch: B.Tech CSE 2025\n• Candidate: ${customUploadedFile ? 'Custom Resume' : activeResume.candidateName}\n• Question ${currentQuestionIdx + 1} of ${currentInterviewQuestions.length}\n• Status: 18:42 Left • Good connection`)}
                          title="Interview details"
                        >
                          <Info size={16} />
                        </button>
                      </div>

                    </div>

                  </div>
                )}

                {/* ── STAGE 2: 360° EVALUATION REPORT (Executive Glimpse) ── */}
                {mockInterviewStage === 'report' && (
                  <div className="fu-mi-stage-content fu-mi-stage-report">
                    
                    {/* Report Banner Header */}
                    <div className="fu-mi-report-header">
                      <div className="fu-mi-report-header-left">
                        <span className="fu-mi-report-eyebrow">EXECUTIVE EVALUATION GLIMPSE</span>
                        <h3 className="fu-mi-report-candidate">
                          {customUploadedFile ? 'Candidate Assessment' : activeResume.candidateName}
                        </h3>
                        <div className="fu-mi-report-meta">
                          <span>Target: <strong>{activeJobProfile.title}</strong></span>
                          <span>•</span>
                          <span>Benchmark: <strong>{activeJobProfile.companies}</strong></span>
                          <span>•</span>
                          <span className="fu-mi-eval-date">Evaluated Today</span>
                        </div>
                      </div>

                      <div className="fu-mi-report-header-right">
                        <div className="fu-mi-hire-badge">
                          <Award size={18} />
                          <div>
                            <span className="fu-mi-hire-status">Strong Hire Recommendation</span>
                            <span className="fu-mi-hire-percentile">Top 4% Candidate Cohort</span>
                          </div>
                        </div>

                        <div className="fu-mi-score-box">
                          <span className="fu-mi-big-score">91</span>
                          <span className="fu-mi-score-denom">/ 100</span>
                        </div>
                      </div>
                    </div>

                    {/* 4 Core Competency Progress Bars (Compact Snapshot) */}
                    <div className="fu-mi-metrics-grid fu-mi-metrics-glimpse">
                      <div className="fu-mi-metric-card">
                        <div className="fu-mi-metric-top">
                          <span className="fu-mi-metric-title">Technical Depth</span>
                          <span className="fu-mi-metric-val score-high">94%</span>
                        </div>
                        <div className="fu-mi-bar-track">
                          <div className="fu-mi-bar-fill fill-high" style={{ width: '94%' }} />
                        </div>
                      </div>

                      <div className="fu-mi-metric-card">
                        <div className="fu-mi-metric-top">
                          <span className="fu-mi-metric-title">Problem Solving & DSA</span>
                          <span className="fu-mi-metric-val score-high">88%</span>
                        </div>
                        <div className="fu-mi-bar-track">
                          <div className="fu-mi-bar-fill fill-high" style={{ width: '88%' }} />
                        </div>
                      </div>

                      <div className="fu-mi-metric-card">
                        <div className="fu-mi-metric-top">
                          <span className="fu-mi-metric-title">System Architecture</span>
                          <span className="fu-mi-metric-val score-high">92%</span>
                        </div>
                        <div className="fu-mi-bar-track">
                          <div className="fu-mi-bar-fill fill-high" style={{ width: '92%' }} />
                        </div>
                      </div>

                      <div className="fu-mi-metric-card">
                        <div className="fu-mi-metric-top">
                          <span className="fu-mi-metric-title">Communication</span>
                          <span className="fu-mi-metric-val score-high">89%</span>
                        </div>
                        <div className="fu-mi-bar-track">
                          <div className="fu-mi-bar-fill fill-high" style={{ width: '89%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Key Strengths & Growth Areas (Concise Glimpse) */}
                    <div className="fu-mi-feedback-grid fu-mi-feedback-glimpse">
                      <div className="fu-mi-fb-box fb-strength">
                        <h5>✓ Key Strengths</h5>
                        <ul>
                          <li>Mastery of distributed locking with atomic Redis primitives.</li>
                          <li>Structured communication with STAR framework delivery.</li>
                        </ul>
                      </div>

                      <div className="fu-mi-fb-box fb-growth">
                        <h5>△ Areas for Polish</h5>
                        <ul>
                          <li>Quantify memory trade-offs when scaling stream keys.</li>
                          <li>Incorporate distributed tracing for end-to-end auditability.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="fu-mi-report-actions">
                      <button
                        type="button"
                        className="fu-mi-report-download-btn"
                        onClick={handleDownloadReport}
                      >
                        <Download size={15} />
                        <span>{isReportDownloaded ? 'Downloaded Report PDF ✓' : 'Download Full Verified Report (PDF)'}</span>
                      </button>

                      <button
                        type="button"
                        className="fu-mi-report-restart-btn"
                        onClick={handleResetInterview}
                      >
                        <RotateCcw size={15} />
                        <span>Start New Mock Interview</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>

              {/* Section CTA */}
              <div className="fu-section-action-footer">
                <button 
                  className="fu-section-cta-btn"
                  onClick={() => setIsMeetingModalOpen(true)}
                  type="button"
                >
                  Book a Meeting <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </section>





          {/* ── 7. Professional Executive CTA ── */}
          <section ref={refCta} className={`fu-sec fu-sec-cta-final fu-reveal ${visCta ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner fu-cta-final-inner">
              <div className="fu-cta-icon-badge">
                <GraduationCap size={28} />
              </div>
              <h2 className="fu-cta-final-title">
                Tailored Integration for Your Campus Ecosystem.
              </h2>
              <p className="fu-cta-final-sub">
                Explore credit-aligned curriculum modules, white-labeled LMS infrastructure, and turnkey placement sprints designed to integrate seamlessly into your university.
              </p>
              <button className="fu-pitch-cta-btn" style={{ marginTop: '2rem' }} onClick={() => setIsMeetingModalOpen(true)}>
                Book a Meeting <ArrowRight size={20} />
              </button>
            </div>
          </section>

        </div>

      {/* ── STICKY CTA ── */}
      <div className={`fu-sticky-cta ${showStickyCta ? 'fu-sticky-visible' : ''}`}>
        <div className="fu-sticky-cta-inner">
          <p>Partner with <strong>CipherSchools</strong> for your campus</p>
          <button className="fu-sticky-btn" onClick={() => setIsMeetingModalOpen(true)}>Book a Meeting <ArrowRight size={16} /></button>
        </div>
      </div>

      {/* Pop-up Meeting Modal */}
      <BookMeetingModal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} />
    </div>
  );
};

export default ForUniversities;
