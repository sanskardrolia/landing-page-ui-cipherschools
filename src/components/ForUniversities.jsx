import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, ChevronLeft, Sparkles, Bot, Code2, Code, Users, Zap, Coffee, Network, Laptop, Plus, Briefcase, TrendingUp, Target, Wrench, MessageSquare, Rocket, Presentation, Flame, Compass, Globe, RefreshCw, X, CheckCircle2, Play, Lock, User, AlertTriangle, FileText, Clock, BookOpen, Award, HelpCircle, ArrowDown, Menu, Search, Bell, Sun, Home, Calendar, ClipboardList, BarChart2, Folder, Volume2, GraduationCap, ChevronRight, ChevronDown, CornerDownRight, ExternalLink, Brain, BrainCircuit, Cpu, Calculator, Database, Check, Terminal, Layers, UploadCloud, Mic, RotateCcw, Download, UserCheck } from 'lucide-react';
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

/* ─── Practice Environment Problems Dataset ─── */
const PRACTICE_PROBLEMS_DATA = [
  {
    id: 'p1',
    title: 'Distinct Divisible Subarrays',
    type: 'DSA',
    track: 'dsa',
    topics: ['Arrays', 'Prefix-Sum.'],
    difficulty: 'Hard',
    level: 'advanced',
    company: 'Amazon',
    desc: `In a magical kingdom, a wizard has a scroll containing enchanted numbers arranged in order. The wizard studies different continuous parts of the scroll to find special magical patterns.\n\nA group of numbers is called a divisible magical segment if the sum of all numbers in that segment is divisible by k.\n\nYour task is to help the wizard count how many distinct magical segments exist in the scroll. Two magical segments are considered are considered identical if they have the same length and contain the same values in the same order, regardless of their positions. Identical subarrays should be counted only once.\n• Note: The array magicalValues is sorted in non-decreasing order`,
    examples: [
      { 
        input: 'n = 3\nmagical values = [1, 2, 3]\nk = 3', 
        output: '3', 
        explanation: 'The distinct magical segments are:\n- [3] (sum = 3, divisible by 3)\n- [1, 2] (sum = 3, divisible by 3)\n- [1, 2, 3] (sum = 6, divisible by 3)' 
      }
    ],
    starterCode: {
      CPP: `long long countDistinctDivisibleSubarrays(vector<int>& v, int k) {\n    // add your code here\n    \n}`,
      'C++': `long long countDistinctDivisibleSubarrays(vector<int>& v, int k) {\n    // add your code here\n    \n}`,
      Python: `def countDistinctDivisibleSubarrays(v: list[int], k: int) -> int:\n    # add your code here\n    pass`,
      Java: `class Solution {\n    public long countDistinctDivisibleSubarrays(int[] v, int k) {\n        // add your code here\n        return 0;\n    }\n}`
    },
    testCases: [
      {
        id: 1,
        input: 'n = 3, magical values = [1, 2, 3], k = 3',
        expected: '3',
        actual: '3',
        time: '2 ms'
      },
      {
        id: 2,
        input: 'n = 4, magical values = [2, 4, 6, 8], k = 2',
        expected: '10',
        actual: '10',
        time: '3 ms'
      }
    ],
    aiHint: 'Calculate prefix sum remainder modulo k at each index. When two prefix sums share the same modulo, the subarray between them is divisible by k.'
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
      question: "Arjun, I see on your resume that you built an asynchronous order-processing pipeline at your internship using Redis streams and Node.js. How did you guarantee idempotent event handling during network retries?",
      ref: "Referenced from Resume: Project #1 (Distributed Order Pipeline)",
      sampleAnswer: "We enforced idempotency by attaching a cryptographically generated UUIDv7 key at the API gateway. In our Redis streams worker, we used atomic SETNX transactions with a 60-second TTL to lock the event ID before dispatching to our PostgreSQL transactional store.",
      feedback: "Technical Depth: 95% • Excellent grasp of distributed locking and race conditions."
    },
    {
      qNum: 2,
      question: "How did you monitor database connection pools and avoid connection starvation when traffic surged 10x during flash sales?",
      ref: "Referenced from Resume: PostgreSQL & Node.js Backend",
      sampleAnswer: "We implemented PgBouncer in transaction-pooling mode in front of our database replica cluster, coupled with circuit breakers in our Node.js connection pool (knex/pg) to gracefully shed load with 429 backoff headers.",
      feedback: "Architecture: 92% • Practical high-scale operational knowledge."
    },
    {
      qNum: 3,
      question: "Tell me about a time when you and a teammate disagreed on an architectural decision. How did you resolve it?",
      ref: "Behavioral & Leadership Evaluation (STAR Method)",
      sampleAnswer: "My peer advocated for GraphQL while I proposed REST with strict OpenAPI contracts. We benchmarked caching overhead and client bundle size for our mobile app, presented the empirical data to our tech lead, and aligned on REST for core order flows and GraphQL for the dynamic dashboard.",
      feedback: "Communication & Conflict Resolution: 94% • Strong data-driven collaboration."
    }
  ],
  backend: [
    {
      qNum: 1,
      question: "Priya, looking at your Multi-Region Failover project, how did you handle data consistency and replication lag across AWS us-east-1 and eu-west-1?",
      ref: "Referenced from Resume: Project #2 (Multi-Region Controller)",
      sampleAnswer: "We deployed Aurora Global Database with asynchronous storage-level replication (typical lag < 1s). For write paths requiring strong consistency, we routed to the primary region and used read-your-own-writes session tokens for secondary regions.",
      feedback: "System Depth: 94% • Strong understanding of distributed consistency models."
    },
    {
      qNum: 2,
      question: "When gRPC microservices experience cascading latency degradation, what techniques do you apply to isolate the failure?",
      ref: "Referenced from Resume: gRPC & Kubernetes Experience",
      sampleAnswer: "We configure strict client-side deadlines with context propagation, exponential backoff with full jitter, and Envoy circuit breakers to cut traffic to degraded pods before buffers saturate.",
      feedback: "Resilience: 91% • Comprehensive fault isolation methodology."
    }
  ],
  aiml: [
    {
      qNum: 1,
      question: "Rohan, your RAG Enterprise Search project mentions hybrid search. How did you balance dense semantic retrieval with sparse BM25 keyword matching?",
      ref: "Referenced from Resume: RAG Enterprise Search (LangChain, Pinecone)",
      sampleAnswer: "We implemented Reciprocal Rank Fusion (RRF) with a constant k=60 to normalize and merge sparse BM25 scores from Elasticsearch with dense cosine similarity vectors from Pinecone, drastically reducing out-of-domain hallucinations.",
      feedback: "AI Architecture: 96% • State-of-the-art hybrid retrieval approach."
    },
    {
      qNum: 2,
      question: "How do you evaluate and safeguard your agentic tool-calling pipelines against prompt injection attacks?",
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
  const [lmsActiveTab, setLmsActiveTab] = useState('request-feature');

  /* Practice Environment State */
  const [practiceTrack, setPracticeTrack] = useState('all');
  const [practiceSearch, setPracticeSearch] = useState('');
  const [practiceLevel, setPracticeLevel] = useState('all');
  const [practiceDifficulty, setPracticeDifficulty] = useState('all');
  const [practiceTopic, setPracticeTopic] = useState('all');
  const [practiceCompany, setPracticeCompany] = useState('all');
  const [practiceStatusFilter, setPracticeStatusFilter] = useState('all');
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [activePracticeProblem, setActivePracticeProblem] = useState(null);
  const [sandboxLang, setSandboxLang] = useState('CPP');
  const [sandboxCode, setSandboxCode] = useState('');
  const [isAiHintOpen, setIsAiHintOpen] = useState(false);
  const [isRunningSandbox, setIsRunningSandbox] = useState(false);
  const [sandboxRunResult, setSandboxRunResult] = useState(null);
  const [isSandboxSubmitted, setIsSandboxSubmitted] = useState(false);
  const [isSandboxSubmitting, setIsSandboxSubmitting] = useState(false);
  const [submissionVerdict, setSubmissionVerdict] = useState(null);
  const [practiceViewTab, setPracticeViewTab] = useState('problem'); // 'problem' | 'submissions'
  const [showTestCases, setShowTestCases] = useState(false);
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);
  const [problemSubmissions, setProblemSubmissions] = useState([
    {
      id: 'sub-init-1',
      problemId: 'p1',
      status: 'Accepted',
      language: 'CPP',
      runtime: '4 ms',
      memory: '18.2 MB',
      submittedAt: 'Yesterday'
    }
  ]);

  /* Mock Interview [AI] State */
  const [mockInterviewStage, setMockInterviewStage] = useState('resume'); // 'resume' | 'interview' | 'report'
  const [selectedResumeId, setSelectedResumeId] = useState('res-1');
  const [selectedJobProfileId, setSelectedJobProfileId] = useState('sde');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
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
      const code = activePracticeProblem.starterCode[sandboxLang] || activePracticeProblem.starterCode['C++'] || '';
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
      setSandboxRunResult({
        success: true,
        casesPassed: 2,
        totalCases: 2,
        runtime: '2 ms',
        memory: '14.2 MB',
        cases: (activePracticeProblem && activePracticeProblem.testCases) || [
          {
            id: 1,
            input: 'n = 3, magical values = [1, 2, 3], k = 3',
            expected: '3',
            actual: '3',
            time: '2 ms'
          },
          {
            id: 2,
            input: 'n = 4, magical values = [2, 4, 6, 8], k = 2',
            expected: '10',
            actual: '10',
            time: '3 ms'
          }
        ]
      });
    }, 450);
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
    setMockInterviewStage('resume');
    setCurrentQuestionIdx(0);
    setCandidateAnswer('');
    setIsVoiceRecording(false);
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
                    <div className="lms-menu-item">
                      <Calendar size={18} />
                      <span>Syllabus</span>
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
                          Request Any Feature for Your Campus LMS — We’ll Build & Implement It.
                        </h3>
                        <p className="lms-cw-description">
                          Have specific requirements for your university? Request any bespoke workflow or custom module for your campus LMS, and our engineering team will build and deploy it directly into your instance.
                        </p>

                        {/* Interactive Workflow Capabilities Bento Tiles */}
                        <div className="lms-cw-capabilities-grid">
                          <div className="lms-cw-cap-card">
                            <div className="lms-cw-cap-icon"><CheckCircle2 size={16} /></div>
                            <div>
                              <strong>Custom Evaluation & Relative Grading</strong>
                              <span>Implement university-specific grading rubrics, relative grading curves, and automated grade sheet exports.</span>
                            </div>
                          </div>

                          <div className="lms-cw-cap-card">
                            <div className="lms-cw-cap-icon"><Layers size={16} /></div>
                            <div>
                              <strong>Campus ERP & SIS Synchronization</strong>
                              <span>Bidirectional integration with your existing university database, attendance tracking, and student registries.</span>
                            </div>
                          </div>

                          <div className="lms-cw-cap-card">
                            <div className="lms-cw-cap-icon"><Terminal size={16} /></div>
                            <div>
                              <strong>Multi-Stage Timed Lab Assessments</strong>
                              <span>Automated semester coding sprints with stage locking, anti-cheat AI proctoring, and custom test-case suites.</span>
                            </div>
                          </div>

                          <div className="lms-cw-cap-card">
                            <div className="lms-cw-cap-icon"><GraduationCap size={16} /></div>
                            <div>
                              <strong>White-Labeled Institutional Sub-Portals</strong>
                              <span>Custom campus domain branding, departmental access hierarchy, and dean-level placement analytics.</span>
                            </div>
                          </div>
                        </div>

                        <div className="lms-cw-actions-row">
                          <button className="lms-cw-primary-btn" onClick={() => setIsMeetingModalOpen(true)}>
                            <span>Book a Meeting</span>
                            <ArrowRight size={15} />
                          </button>
                          <span className="lms-cw-hint">Zero upfront engineering cost for partner campuses</span>
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
              <div className="fu-practice-main-card">
                {activePracticeProblem ? (
                  <div className="fu-solver-workspace">
                    {/* 1. Solver Top Navigation Bar */}
                    <div className="fu-solver-top-bar">
                      <div className="fu-solver-nav-left">
                        <button
                          type="button"
                          className="fu-solver-back-btn"
                          onClick={() => setActivePracticeProblem(null)}
                          title="Back to Problems"
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
                          {problemSubmissions.filter(s => s.problemId === activePracticeProblem.id).length > 0 && (
                            <span className="fu-solver-sub-count">
                              {problemSubmissions.filter(s => s.problemId === activePracticeProblem.id).length}
                            </span>
                          )}
                        </button>
                      </div>

                      <div className="fu-solver-nav-right">
                        {/* Language Selector */}
                        <div className="fu-solver-lang-wrapper">
                          <select
                            value={sandboxLang}
                            onChange={(e) => handleSandboxLangChange(e.target.value)}
                            className="fu-solver-lang-select"
                          >
                            {(activePracticeProblem.track === 'sql' ? ['SQL'] : ['CPP', 'Python', 'Java']).map(lang => (
                              <option key={lang} value={lang}>{lang}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="fu-solver-lang-chevron" />
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
                        <button
                          type="button"
                          className="fu-solver-run-btn"
                          onClick={handleRunSandboxCode}
                          disabled={isRunningSandbox}
                        >
                          <Play size={13} fill="currentColor" />
                          <span>{isRunningSandbox ? 'Running...' : 'Run Code'}</span>
                        </button>

                        {/* Submit */}
                        <button
                          type="button"
                          className="fu-solver-submit-btn"
                          onClick={handleSubmitSandbox}
                          disabled={isSandboxSubmitting}
                        >
                          <Check size={14} strokeWidth={2.5} />
                          <span>{isSandboxSubmitting ? 'Submitting...' : 'Submit'}</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Main Workspace Body */}
                    {practiceViewTab === 'problem' ? (
                      <div className="fu-solver-split-body">
                        
                        {/* Left Pane: Problem Statement */}
                        <div className="fu-solver-desc-pane">
                          <div className="fu-solver-breadcrumbs">
                            <span>Home</span>
                            <span className="fu-bc-sep">/</span>
                            <span>CipherLabs</span>
                            <span className="fu-bc-sep">/</span>
                            <button
                              type="button"
                              className="fu-bc-link"
                              onClick={() => setActivePracticeProblem(null)}
                            >
                              Problems
                            </button>
                            <span className="fu-bc-sep">/</span>
                            <span className="fu-bc-current">{activePracticeProblem.title}</span>
                          </div>

                          <div className="fu-solver-title-row">
                            <h3 className="fu-solver-problem-title">{activePracticeProblem.title}</h3>
                            <span className={`fu-solver-diff-badge diff-${activePracticeProblem.difficulty.toLowerCase()}`}>
                              {activePracticeProblem.difficulty}
                            </span>
                          </div>

                          <div className="fu-solver-narrative">
                            {activePracticeProblem.desc.split('\n\n').map((para, i) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>

                          {/* Example 1 Card */}
                          {activePracticeProblem.examples && activePracticeProblem.examples.length > 0 && (
                            <div className="fu-solver-example-card">
                              <div className="fu-solver-ex-heading">Example 1:</div>
                              <div className="fu-solver-ex-field">
                                <span className="fu-solver-field-label">Input:</span>
                                <pre className="fu-solver-field-val">{activePracticeProblem.examples[0].input}</pre>
                              </div>
                              <div className="fu-solver-ex-field">
                                <span className="fu-solver-field-label">Output:</span>
                                <pre className="fu-solver-field-val">{activePracticeProblem.examples[0].output}</pre>
                              </div>
                              {activePracticeProblem.examples[0].explanation && (
                                <div className="fu-solver-ex-field">
                                  <span className="fu-solver-field-label">Explanation:</span>
                                  <pre className="fu-solver-field-val">{activePracticeProblem.examples[0].explanation}</pre>
                                </div>
                              )}
                            </div>
                          )}

                          {/* AI Tutor Hint Box */}
                          <div className="fu-solver-hint-box">
                            <button
                              type="button"
                              className="fu-solver-hint-btn"
                              onClick={() => setIsAiHintOpen(!isAiHintOpen)}
                            >
                              <Sparkles size={13} />
                              <span>{isAiHintOpen ? 'Hide AI Tutor Hint' : '💡 Ask AI Tutor for an Optimization Hint'}</span>
                            </button>
                            {isAiHintOpen && (
                              <div className="fu-solver-hint-content">
                                <div className="fu-hint-badge">CipherAI Hint</div>
                                <p>{activePracticeProblem.aiHint}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Center Divider / Drag Handle */}
                        <div className="fu-solver-divider">
                          <span className="fu-solver-handle-dots">⋮⋮</span>
                        </div>

                        {/* Right Pane: Code Editor + Test Console */}
                        <div className="fu-solver-editor-pane">
                          <div className="fu-solver-editor-main">
                            {/* Line Numbers Gutter */}
                            <div className="fu-solver-gutter">
                              {Array.from({ length: Math.max((sandboxCode || '').split('\n').length, 8) }, (_, i) => (
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
                              <div className="fu-verdict-actions">
                                <button
                                  type="button"
                                  className="fu-verdict-sub-link"
                                  onClick={() => setPracticeViewTab('submissions')}
                                >
                                  View All Submissions →
                                </button>
                                <button
                                  type="button"
                                  className="fu-verdict-back-link"
                                  onClick={() => setActivePracticeProblem(null)}
                                >
                                  Back to Problems List
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Bottom Test Cases Console */}
                          <div className="fu-solver-testcases-console">
                            <div className="fu-tc-bar">
                              <button
                                type="button"
                                className={`fu-tc-toggle-btn ${showTestCases ? 'active' : ''}`}
                                onClick={() => setShowTestCases(!showTestCases)}
                              >
                                <span>Test Cases</span>
                                <ChevronDown size={14} className={`fu-tc-chevron ${showTestCases ? 'rotated' : ''}`} />
                              </button>

                              {sandboxRunResult && (
                                <span className="fu-tc-run-status">
                                  <Check size={13} color="#059669" />
                                  {sandboxRunResult.casesPassed}/{sandboxRunResult.totalCases} Testcases Passed ({sandboxRunResult.runtime})
                                </span>
                              )}
                            </div>

                            {showTestCases && (
                              <div className="fu-tc-drawer">
                                {/* Case Tabs */}
                                <div className="fu-tc-tabs">
                                  {((sandboxRunResult && sandboxRunResult.cases) || activePracticeProblem.testCases || [
                                    { id: 1, input: 'n = 3, magical values = [1, 2, 3], k = 3', expected: '3', actual: '3', time: '2 ms' },
                                    { id: 2, input: 'n = 4, magical values = [2, 4, 6, 8], k = 2', expected: '10', actual: '10', time: '3 ms' }
                                  ]).map((tc, idx) => (
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

                                {/* Active Case Details */}
                                {(() => {
                                  const casesList = (sandboxRunResult && sandboxRunResult.cases) || activePracticeProblem.testCases || [
                                    { id: 1, input: 'n = 3, magical values = [1, 2, 3], k = 3', expected: '3', actual: '3', time: '2 ms' },
                                    { id: 2, input: 'n = 4, magical values = [2, 4, 6, 8], k = 2', expected: '10', actual: '10', time: '3 ms' }
                                  ];
                                  const activeCase = casesList[activeTestCaseTab] || casesList[0];
                                  return (
                                    <div className="fu-tc-case-body">
                                      <div className="fu-tc-item">
                                        <span className="fu-tc-label">Input:</span>
                                        <div className="fu-tc-box">{activeCase.input}</div>
                                      </div>
                                      <div className="fu-tc-split-row">
                                        <div className="fu-tc-item">
                                          <span className="fu-tc-label">Output:</span>
                                          <div className="fu-tc-box output-pass">{activeCase.actual}</div>
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
                            {problemSubmissions
                              .filter(s => s.problemId === activePracticeProblem.id)
                              .map((sub, idx) => (
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
                ) : (
                  <>
                    {/* 1. Track Bar */}
                    <div className="fu-practice-track-bar">
                      <div className="fu-practice-track-left">
                        <span className="fu-track-label">TRACK:</span>
                        <button
                          type="button"
                          className={`fu-track-tab-btn ${practiceTrack === 'all' ? 'active' : ''}`}
                          onClick={() => setPracticeTrack('all')}
                        >
                          <Sparkles size={13} className="fu-sparkle-icon" />
                          <span>All (346)</span>
                        </button>
                      </div>

                      <div className="fu-practice-track-right">
                        <button
                          type="button"
                          className={`fu-track-tab-btn ${practiceTrack === 'programming' ? 'active' : ''}`}
                          onClick={() => setPracticeTrack('programming')}
                        >
                          <Code size={13} />
                          <span>Programming {totalProgrammingSolved}/108</span>
                        </button>
                        <button
                          type="button"
                          className={`fu-track-tab-btn ${practiceTrack === 'dsa' ? 'active' : ''}`}
                          onClick={() => setPracticeTrack('dsa')}
                        >
                          <Layers size={13} />
                          <span>DSA {totalDsaSolved}/190</span>
                        </button>
                        <button
                          type="button"
                          className={`fu-track-tab-btn ${practiceTrack === 'sql' ? 'active' : ''}`}
                          onClick={() => setPracticeTrack('sql')}
                        >
                          <Database size={13} />
                          <span>SQL {totalSqlSolved}/48</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Search and Filter Bar */}
                    <div className="fu-practice-filter-bar">
                      <div className="fu-filter-top-row">
                        <div className="fu-practice-search-box">
                          <Search size={15} className="fu-search-icon" />
                          <input
                            type="text"
                            placeholder="Search problems..."
                            value={practiceSearch}
                            onChange={(e) => setPracticeSearch(e.target.value)}
                            className="fu-practice-search-input"
                          />
                          {practiceSearch && (
                            <button 
                              type="button" 
                              className="fu-search-clear-btn" 
                              onClick={() => setPracticeSearch('')}
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>

                        <div className="fu-practice-level-group">
                          <span className="fu-level-label">LEVEL:</span>
                          <div className="fu-level-pills">
                            {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                className={`fu-level-pill ${practiceLevel === lvl ? 'active' : ''}`}
                                onClick={() => setPracticeLevel(lvl)}
                              >
                                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Filters Row */}
                      <div className="fu-filter-dropdowns-row">
                        <div className="fu-select-wrapper">
                          <select
                            value={practiceCompany}
                            onChange={(e) => setPracticeCompany(e.target.value)}
                            className="fu-filter-select"
                          >
                            <option value="all">Company...</option>
                            <option value="Amazon">Amazon</option>
                            <option value="Google">Google</option>
                            <option value="Microsoft">Microsoft</option>
                            <option value="Adobe">Adobe</option>
                            <option value="Meta">Meta</option>
                            <option value="Uber">Uber</option>
                            <option value="Apple">Apple</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Goldman Sachs">Goldman Sachs</option>
                          </select>
                          <ChevronDown size={14} className="fu-select-arrow" />
                        </div>

                        <div className="fu-select-wrapper">
                          <select
                            value={practiceDifficulty}
                            onChange={(e) => setPracticeDifficulty(e.target.value)}
                            className="fu-filter-select"
                          >
                            <option value="all">Difficulty</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                          <ChevronDown size={14} className="fu-select-arrow" />
                        </div>

                        <div className="fu-select-wrapper">
                          <select
                            value={practiceTopic}
                            onChange={(e) => setPracticeTopic(e.target.value)}
                            className="fu-filter-select"
                          >
                            <option value="all">Topics</option>
                            <option value="Arrays">Arrays</option>
                            <option value="Stack">Stack</option>
                            <option value="Prefix-Sum">Prefix-Sum</option>
                            <option value="Sliding-Window">Sliding-Window</option>
                            <option value="Two Pointers">Two Pointers</option>
                            <option value="Hashing">Hashing</option>
                            <option value="OOP">OOP / Design</option>
                            <option value="Window Functions">Window Functions</option>
                          </select>
                          <ChevronDown size={14} className="fu-select-arrow" />
                        </div>

                        <div className="fu-select-wrapper">
                          <select
                            value={practiceStatusFilter}
                            onChange={(e) => setPracticeStatusFilter(e.target.value)}
                            className="fu-filter-select"
                          >
                            <option value="all">Status</option>
                            <option value="solved">Solved</option>
                            <option value="unsolved">Unsolved</option>
                          </select>
                          <ChevronDown size={14} className="fu-select-arrow" />
                        </div>
                      </div>
                    </div>

                    {/* 3. Problems Table */}
                    <div className="fu-practice-table-container">
                      <table className="fu-practice-table">
                        <thead>
                          <tr>
                            <th className="th-status">STATUS</th>
                            <th className="th-title">TITLE</th>
                            <th className="th-type">TYPE</th>
                            <th className="th-topic">TOPIC</th>
                            <th className="th-difficulty">DIFFICULTY</th>
                            <th className="th-action">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProblems.length > 0 ? (
                            filteredProblems.map((prob) => {
                              const isSolved = solvedProblems.includes(prob.id);
                              return (
                                <tr key={prob.id} className="fu-practice-tr" onClick={() => openSandbox(prob)}>
                                  <td className="td-status" onClick={(e) => toggleSolved(prob.id, e)}>
                                    <button
                                      type="button"
                                      className={`fu-status-toggle ${isSolved ? 'solved' : ''}`}
                                      title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                                    >
                                      {isSolved ? <Check size={11} strokeWidth={3} /> : null}
                                    </button>
                                  </td>
                                  <td className="td-title">
                                    <span className="fu-prob-title">{prob.title}</span>
                                  </td>
                                  <td className="td-type">
                                    <span className="fu-prob-type-badge">{prob.type}</span>
                                  </td>
                                  <td className="td-topic">
                                    <div className="fu-prob-topics-row">
                                      {prob.topics.map((topic, i) => (
                                        <span key={i} className="fu-prob-topic-tag">{topic}</span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="td-difficulty">
                                    <span className={`fu-prob-diff-badge diff-${prob.difficulty.toLowerCase()}`}>
                                      {prob.difficulty}
                                    </span>
                                  </td>
                                  <td className="td-action">
                                    <button
                                      type="button"
                                      className="fu-practice-action-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openSandbox(prob);
                                      }}
                                    >
                                      Practice <ChevronRight size={14} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={6} className="fu-practice-empty">
                                No problems match your current filter criteria.
                                <button 
                                  type="button" 
                                  className="fu-reset-filters-btn"
                                  onClick={() => {
                                    setPracticeTrack('all');
                                    setPracticeSearch('');
                                    setPracticeLevel('all');
                                    setPracticeDifficulty('all');
                                    setPracticeTopic('all');
                                    setPracticeCompany('all');
                                    setPracticeStatusFilter('all');
                                  }}
                                >
                                  Reset Filters
                                </button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
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

          {/* ── 9. Mock Interview [AI] Section ── */}
          <section id="mock-interview-section" ref={refMockInterview} className={`fu-sec fu-mock-interview-apple-section fu-reveal ${visMockInterview ? 'fu-revealed' : ''}`}>
            <div className="fu-sec-inner">
              
              {/* Section Header */}
              <div className="fu-apple-bento-header">
                <p className="fu-sec-eyebrow">MOCK INTERVIEW [AI]</p>
                <h2 className="fu-apple-bento-title">
                  Resume-driven technical interviews, <span className="fu-pitch-accent">evaluated end-to-end.</span>
                </h2>
                <p className="fu-apple-bento-sub">
                  Upload a candidate resume, target high-bar company roles, and let AI evaluate personality, system design, and technical depth in one unified report.
                </p>
              </div>

              {/* Functional Mockup Card */}
              <div className="fu-mi-main-card">
                
                {/* 1. Step Navigation Tabs */}
                <div className="fu-mi-steps-bar">
                  <button
                    type="button"
                    className={`fu-mi-step-tab ${mockInterviewStage === 'resume' ? 'active' : ''}`}
                    onClick={() => setMockInterviewStage('resume')}
                  >
                    <span className="fu-mi-step-num">1</span>
                    <span>Upload Resume & Profile</span>
                  </button>

                  <button
                    type="button"
                    className={`fu-mi-step-tab ${mockInterviewStage === 'interview' ? 'active' : ''}`}
                    onClick={() => {
                      if (mockInterviewStage === 'resume') handleStartInterview();
                      else setMockInterviewStage('interview');
                    }}
                  >
                    <span className="fu-mi-step-num">2</span>
                    <span>Live AI Interview</span>
                  </button>

                  <button
                    type="button"
                    className={`fu-mi-step-tab ${mockInterviewStage === 'report' ? 'active' : ''}`}
                    onClick={() => setMockInterviewStage('report')}
                  >
                    <span className="fu-mi-step-num">3</span>
                    <span>360° Evaluation Report</span>
                  </button>
                </div>

                {/* ── STAGE 1: RESUME & JOB PROFILE SELECTION ── */}
                {mockInterviewStage === 'resume' && (
                  <div className="fu-mi-stage-content fu-mi-stage-resume">
                    <div className="fu-mi-grid-2col">
                      
                      {/* Left: Resume Upload & Samples */}
                      <div className="fu-mi-col">
                        <h4 className="fu-mi-col-title">
                          <FileText size={16} /> Candidate Resume
                        </h4>

                        {/* Drag and Drop Zone */}
                        <label className="fu-mi-upload-dropzone">
                          <input 
                            type="file" 
                            accept=".pdf,.docx,.doc" 
                            className="fu-mi-file-input" 
                            onChange={(e) => {
                              const file = e.target.files && e.target.files[0];
                              if (file) setCustomUploadedFile(file.name);
                            }}
                          />
                          <UploadCloud size={32} className="fu-mi-upload-icon" />
                          <div className="fu-mi-upload-text">
                            <strong>Click to upload</strong> or drag & drop student resume
                          </div>
                          <span className="fu-mi-upload-sub">PDF, DOCX up to 10MB • AI parses tech stack & projects</span>
                        </label>

                        {customUploadedFile && (
                          <div className="fu-mi-uploaded-badge">
                            <CheckCircle2 size={15} color="#059669" />
                            <span>Uploaded: <strong>{customUploadedFile}</strong></span>
                          </div>
                        )}

                        {/* Sample Resumes Picker */}
                        <div className="fu-mi-samples-wrap">
                          <span className="fu-mi-samples-label">OR TEST WITH SAMPLE CANDIDATE RESUMES:</span>
                          <div className="fu-mi-samples-list">
                            {MOCK_RESUMES.map(res => (
                              <button
                                key={res.id}
                                type="button"
                                className={`fu-mi-sample-btn ${selectedResumeId === res.id && !customUploadedFile ? 'active' : ''}`}
                                onClick={() => {
                                  setSelectedResumeId(res.id);
                                  setCustomUploadedFile(null);
                                }}
                              >
                                <div className="fu-mi-sample-top">
                                  <span className="fu-mi-sample-name">{res.candidateName}</span>
                                  <span className="fu-mi-sample-role">{res.role}</span>
                                </div>
                                <div className="fu-mi-sample-skills">
                                  {res.skills.slice(0, 4).map((s, idx) => (
                                    <span key={idx} className="fu-mi-skill-tag">{s}</span>
                                  ))}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Target Job Profile Selection */}
                      <div className="fu-mi-col">
                        <h4 className="fu-mi-col-title">
                          <Briefcase size={16} /> Target Job Profile
                        </h4>

                        <div className="fu-mi-profiles-list">
                          {JOB_PROFILES.map(prof => (
                            <button
                              key={prof.id}
                              type="button"
                              className={`fu-mi-profile-card ${selectedJobProfileId === prof.id ? 'active' : ''}`}
                              onClick={() => setSelectedJobProfileId(prof.id)}
                            >
                              <div className="fu-mi-profile-header">
                                <div className="fu-mi-radio-circle">
                                  {selectedJobProfileId === prof.id && <div className="fu-mi-radio-dot" />}
                                </div>
                                <div>
                                  <h5 className="fu-mi-profile-title">{prof.title}</h5>
                                  <span className="fu-mi-profile-companies">Hiring standard: {prof.companies}</span>
                                </div>
                                <span className="fu-mi-rigor-tag">{prof.rigor}</span>
                              </div>
                              <p className="fu-mi-profile-focus">
                                <strong>Assessment Focus:</strong> {prof.focus}
                              </p>
                            </button>
                          ))}
                        </div>

                        {/* Interview Configuration Box */}
                        <div className="fu-mi-config-box">
                          <div className="fu-mi-config-row">
                            <span className="fu-mi-config-item">
                              <Sparkles size={13} /> AI Recruiter: <strong>Sophia (Principal Bar Raiser)</strong>
                            </span>
                            <span className="fu-mi-config-item">
                              <Clock size={13} /> Duration: <strong>~20 Mins</strong>
                            </span>
                          </div>
                        </div>

                        {/* Start Action Button */}
                        <button
                          type="button"
                          className="fu-mi-start-btn"
                          onClick={handleStartInterview}
                        >
                          Generate Tailored Questions & Begin Interview <ArrowRight size={16} />
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {/* ── STAGE 2: LIVE AI INTERVIEW ── */}
                {mockInterviewStage === 'interview' && (
                  <div className="fu-mi-stage-content fu-mi-stage-interview">
                    
                    {/* Top Status Strip */}
                    <div className="fu-mi-interview-top-strip">
                      <div className="fu-mi-top-left">
                        <span className="fu-mi-live-indicator">
                          <span className="fu-mi-live-dot" /> LIVE SESSION
                        </span>
                        <span className="fu-mi-active-profile-tag">
                          {activeJobProfile.title} • {activeJobProfile.companies}
                        </span>
                      </div>

                      <div className="fu-mi-top-right">
                        <span className="fu-mi-proctor-pill">
                          <UserCheck size={13} /> Anti-Cheat Active
                        </span>
                        <span className="fu-mi-timer-pill">
                          <Clock size={13} /> 18:42 Left
                        </span>
                        <span className="fu-mi-q-count">
                          Question {currentQuestionIdx + 1} of {currentInterviewQuestions.length}
                        </span>
                      </div>
                    </div>

                    {/* Interview Grid: AI Persona vs Candidate Input */}
                    <div className="fu-mi-interview-grid">
                      
                      {/* Left: AI Interviewer Persona & Question */}
                      <div className="fu-mi-ai-pane">
                        <div className="fu-mi-persona-card">
                          <div className="fu-mi-avatar-wrap">
                            <div className="fu-mi-avatar">
                              <Bot size={28} />
                            </div>
                            <div className="fu-mi-audio-waves">
                              <span className="fu-mi-wave" />
                              <span className="fu-mi-wave" />
                              <span className="fu-mi-wave" />
                              <span className="fu-mi-wave" />
                            </div>
                          </div>
                          <div>
                            <h5 className="fu-mi-interviewer-name">Sophia</h5>
                            <span className="fu-mi-interviewer-title">Principal AI Engineering Recruiter</span>
                          </div>
                        </div>

                        <div className="fu-mi-question-box">
                          <div className="fu-mi-q-label">QUESTION #{currentQ.qNum}:</div>
                          <p className="fu-mi-q-text">"{currentQ.question}"</p>
                          <div className="fu-mi-q-ref">
                            <Sparkles size={13} /> {currentQ.ref}
                          </div>
                        </div>

                        <div className="fu-mi-expected-topics">
                          <span className="fu-mi-topics-label">Key Topics Assessed:</span>
                          <div className="fu-mi-topic-chips">
                            <span>Idempotency Keys</span>
                            <span>Distributed Locks (SETNX)</span>
                            <span>TTL & Deadlock Prevention</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Candidate Response Console */}
                      <div className="fu-mi-candidate-pane">
                        <div className="fu-mi-response-header">
                          <span className="fu-mi-cand-name">
                            Candidate Response ({customUploadedFile ? 'Uploaded Resume' : activeResume.candidateName})
                          </span>

                          <button
                            type="button"
                            className={`fu-mi-voice-toggle ${isVoiceRecording ? 'recording' : ''}`}
                            onClick={() => setIsVoiceRecording(!isVoiceRecording)}
                          >
                            <Mic size={14} />
                            <span>{isVoiceRecording ? 'Listening (Speaking...)' : 'Speak Answer'}</span>
                          </button>
                        </div>

                        <div className="fu-mi-textarea-wrap">
                          <textarea
                            className="fu-mi-response-textarea"
                            value={candidateAnswer}
                            onChange={(e) => setCandidateAnswer(e.target.value)}
                            placeholder="Type or dictate your technical response here..."
                          />
                        </div>

                        {/* Live AI Analysis Callout */}
                        <div className="fu-mi-live-critique">
                          <span className="fu-mi-critique-badge">Live AI Signal:</span>
                          <span className="fu-mi-critique-text">{currentQ.feedback}</span>
                        </div>

                        {/* Interview Navigation Controls */}
                        <div className="fu-mi-interview-actions">
                          <button
                            type="button"
                            className="fu-mi-btn-subtle"
                            onClick={handleResetInterview}
                          >
                            <RotateCcw size={13} /> Change Resume / Profile
                          </button>

                          <button
                            type="button"
                            className="fu-mi-btn-next"
                            onClick={handleNextQuestion}
                            disabled={isEvaluatingAnswer}
                          >
                            {isEvaluatingAnswer ? (
                              'Analyzing Answer...'
                            ) : currentQuestionIdx < currentInterviewQuestions.length - 1 ? (
                              <>Next Question <ArrowRight size={15} /></>
                            ) : (
                              <>Complete Interview & View Report <ArrowRight size={15} /></>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* ── STAGE 3: DETAILED EVALUATION REPORT ── */}
                {mockInterviewStage === 'report' && (
                  <div className="fu-mi-stage-content fu-mi-stage-report">
                    
                    {/* Report Banner Header */}
                    <div className="fu-mi-report-header">
                      <div className="fu-mi-report-header-left">
                        <span className="fu-mi-report-eyebrow">CANDIDATE PERFORMANCE DOSSIER</span>
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

                    {/* 4 Multi-Dimensional Evaluation Cards */}
                    <div className="fu-mi-metrics-grid">
                      <div className="fu-mi-metric-card">
                        <div className="fu-mi-metric-top">
                          <span className="fu-mi-metric-title">Technical Depth & Accuracy</span>
                          <span className="fu-mi-metric-val score-high">94%</span>
                        </div>
                        <div className="fu-mi-bar-track">
                          <div className="fu-mi-bar-fill fill-high" style={{ width: '94%' }} />
                        </div>
                        <p className="fu-mi-metric-sub">
                          Exceptional understanding of idempotency, atomic Redis SETNX locking, and distributed state.
                        </p>
                      </div>

                      <div className="fu-mi-metric-card">
                        <div className="fu-mi-metric-top">
                          <span className="fu-mi-metric-title">Problem Solving & DSA</span>
                          <span className="fu-mi-metric-val score-high">88%</span>
                        </div>
                        <div className="fu-mi-bar-track">
                          <div className="fu-mi-bar-fill fill-high" style={{ width: '88%' }} />
                        </div>
                        <p className="fu-mi-metric-sub">
                          Clean algorithmic complexity justification, quick edge-case validation, and space optimization.
                        </p>
                      </div>

                      <div className="fu-mi-metric-card">
                        <div className="fu-mi-metric-top">
                          <span className="fu-mi-metric-title">System Architecture</span>
                          <span className="fu-mi-metric-val score-high">92%</span>
                        </div>
                        <div className="fu-mi-bar-track">
                          <div className="fu-mi-bar-fill fill-high" style={{ width: '92%' }} />
                        </div>
                        <p className="fu-mi-metric-sub">
                          Practical pooling knowledge with PgBouncer, connection starvation mitigation, and circuit breakers.
                        </p>
                      </div>

                      <div className="fu-mi-metric-card">
                        <div className="fu-mi-metric-top">
                          <span className="fu-mi-metric-title">Communication & Personality</span>
                          <span className="fu-mi-metric-val score-high">89%</span>
                        </div>
                        <div className="fu-mi-bar-track">
                          <div className="fu-mi-bar-fill fill-high" style={{ width: '89%' }} />
                        </div>
                        <p className="fu-mi-metric-sub">
                          Clear structured STAR framework delivery, articulate confidence, and collaborative tone.
                        </p>
                      </div>
                    </div>

                    {/* Personality & Behavioral Spectrum */}
                    <div className="fu-mi-behavioral-section">
                      <h4 className="fu-mi-section-subtitle">
                        <Brain size={16} /> Personality & Behavioral Competencies
                      </h4>
                      
                      <div className="fu-mi-behavior-pills">
                        <div className="fu-mi-bpill">
                          <span className="fu-mi-bpill-name">Ownership & Accountability</span>
                          <span className="fu-mi-bpill-score">9.4 / 10</span>
                          <span className="fu-mi-bpill-desc">Proactively takes ownership of failure states and network retries.</span>
                        </div>

                        <div className="fu-mi-bpill">
                          <span className="fu-mi-bpill-name">Critical Thinking Under Stress</span>
                          <span className="fu-mi-bpill-score">8.9 / 10</span>
                          <span className="fu-mi-bpill-desc">Maintained composure and data-backed rationale when probed on trade-offs.</span>
                        </div>

                        <div className="fu-mi-bpill">
                          <span className="fu-mi-bpill-name">Data-Driven Conflict Resolution</span>
                          <span className="fu-mi-bpill-score">9.2 / 10</span>
                          <span className="fu-mi-bpill-desc">Empirical benchmarking of REST vs GraphQL resolved team impasse.</span>
                        </div>
                      </div>
                    </div>

                    {/* Question-by-Question Evaluation Breakdown */}
                    <div className="fu-mi-breakdown-section">
                      <h4 className="fu-mi-section-subtitle">
                        <ClipboardList size={16} /> Question-by-Question AI Analysis
                      </h4>

                      <div className="fu-mi-q-analysis-list">
                        {currentInterviewQuestions.map((q, idx) => (
                          <div key={idx} className="fu-mi-q-analysis-card">
                            <div className="fu-mi-q-analysis-top">
                              <div className="fu-mi-q-num-badge">Q{q.qNum}</div>
                              <div className="fu-mi-q-analysis-heading">
                                <strong>{q.ref}</strong>
                                <p>{q.question}</p>
                              </div>
                              <span className="fu-mi-q-score-badge">9.{5 - idx} / 10</span>
                            </div>
                            <div className="fu-mi-q-analysis-feedback">
                              <strong>AI Feedback:</strong> {q.feedback}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Growth Areas */}
                    <div className="fu-mi-feedback-grid">
                      <div className="fu-mi-fb-box fb-strength">
                        <h5>✓ Demonstrated Strengths</h5>
                        <ul>
                          <li>Authoritative command of distributed locking with atomic Redis SETNX operations.</li>
                          <li>Clean mitigation strategy against connection pool starvation using connection poolers.</li>
                          <li>Constructive, data-first communication style when handling architectural disagreements.</li>
                        </ul>
                      </div>

                      <div className="fu-mi-fb-box fb-growth">
                        <h5>△ Areas for Continuous Polish</h5>
                        <ul>
                          <li>Could explicitly quantify memory consumption trade-offs when scaling Redis stream keys.</li>
                          <li>Consider mentioning distributed tracing (e.g. OpenTelemetry) for end-to-end auditability.</li>
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
