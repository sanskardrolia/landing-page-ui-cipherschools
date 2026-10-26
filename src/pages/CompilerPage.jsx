import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { track } from '../utils/analytics';
import {
  SITE_URL,
  PAGE_PATH,
  CONFIRMED,
  SEO,
  HERO,
  PROBLEM,
  HOW_IT_WORKS,
  FEATURES,
  SPOTLIGHT,
  PROOF,
  PRICING,
  OBJECTIONS,
  FAQ,
  FINAL_CTA,
  SECTION_CTA
} from '../content/online-compiler';
import { 
  Play, 
  RotateCcw, 
  Share2, 
  FileCode,
  Star,
  Link2,
  Copy,
  Plus,
  Download, 
  Maximize2, 
  Bookmark, 
  Sun, 
  User, 
  Check, 
  ChevronRight, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Undo2,
  Redo2,
  Trash2,
  Move,
  PenTool,
  Eraser,
  HelpCircle,
  MoreHorizontal,
  CircleAlert
} from 'lucide-react';
import './CompilerPage.css';

// ── Language Icons (exact SVGs from screenshots) ──
const CIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className="lang-svg-icon">
    <path d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2L12 2Z" fill="#1E293B"/>
    <path d="M14.5 9.2C13.8 8.4 12.8 8 11.6 8C9.2 8 7.5 9.8 7.5 12C7.5 14.2 9.2 16 11.6 16C12.8 16 13.8 15.6 14.5 14.8V16.2C13.7 16.7 12.7 17 11.5 17C8.4 17 6 14.8 6 12C6 9.2 8.4 7 11.5 7C12.7 7 13.7 7.3 14.5 7.8V9.2Z" fill="#FFFFFF"/>
  </svg>
);

const CppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className="lang-svg-icon">
    <path d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2L12 2Z" fill="#00599C"/>
    <path d="M13.5 9.2C12.9 8.5 12 8.1 11 8.1C9 8.1 7.6 9.6 7.6 12C7.6 14.4 9 15.9 11 15.9C12 15.9 12.9 15.5 13.5 14.8V16.1C12.8 16.6 11.9 16.9 10.9 16.9C8.1 16.9 6 14.8 6 12C6 9.2 8.1 7.1 10.9 7.1C11.9 7.1 12.8 7.4 13.5 7.9V9.2Z" fill="#FFFFFF"/>
    <path d="M15 11.2H16V10.2H17V11.2H18V12.2H17V13.2H16V12.2H15V11.2ZM19 11.2H20V10.2H21V11.2H22V12.2H21V13.2H20V12.2H19V11.2Z" fill="#0086D4" stroke="#FFFFFF" strokeWidth="0.5"/>
  </svg>
);

const JavaIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className="lang-svg-icon">
    <path d="M10.8 2.2C10.8 2.2 12.4 4 10.2 6.5C8.4 8.5 9.2 9.8 9.2 9.8C8 8.8 7.6 7.6 8.3 6.3C9.2 4.6 11 3.5 10.8 2.2Z" fill="#E76F51"/>
    <path d="M14.2 4.2C14.2 4.2 15.2 5.5 13.8 7.3C12.5 8.7 13.1 9.8 13.1 9.8C12.2 9 11.8 8.1 12.4 7C13.1 5.7 14.4 4.9 14.2 4.2Z" fill="#E76F51"/>
    <path d="M6 14.5C6 14.5 5.5 17.5 12 17.5C18.5 17.5 18 14.5 18 14.5H6Z" fill="#007396"/>
    <path d="M17.5 15.2C18.8 15.2 19.8 14.5 19.8 13.5C19.8 12.5 18.8 11.8 17.5 11.8V13C18 13 18.5 13.2 18.5 13.5C18.5 13.8 18 14 17.5 14V15.2Z" fill="#007396"/>
    <path d="M5.5 18.8C7.5 20.2 16.5 20.2 18.5 18.8C16.5 19.5 7.5 19.5 5.5 18.8Z" fill="#007396"/>
  </svg>
);

const PythonIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className="lang-svg-icon">
    <path d="M11.9 2C8.7 2 6.7 3.3 6.7 5.6V7.4H12V8.3H4.4C2.3 8.3 1 10.1 1 12.7C1 15.3 2.1 16.9 4.3 16.9H5.8V14.7C5.8 12.2 7.7 10.3 10.2 10.3H15.5C16.8 10.3 17.8 9.2 17.8 8V5.6C17.8 3.3 15.2 2 11.9 2ZM9.3 3.8C9.9 3.8 10.4 4.3 10.4 4.9C10.4 5.5 9.9 6 9.3 6C8.7 6 8.2 5.5 8.2 4.9C8.2 4.3 8.7 3.8 9.3 3.8Z" fill="#387EB8"/>
    <path d="M12.1 22C15.3 22 17.3 20.7 17.3 18.4V16.6H12V15.7H19.6C21.7 15.7 23 13.9 23 11.3C23 8.7 21.9 7.1 19.7 7.1H18.2V9.3C18.2 11.8 16.3 13.7 13.8 13.7H8.5C7.2 13.7 6.2 14.8 6.2 16V18.4C6.2 20.7 8.8 22 12.1 22ZM14.7 20.2C14.1 20.2 13.6 19.7 13.6 19.1C13.6 18.5 14.1 18 14.7 18C15.3 18 15.8 18.5 15.8 19.1C15.8 19.7 15.3 20.2 14.7 20.2Z" fill="#FFE052"/>
  </svg>
);

const JSIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className="lang-svg-icon">
    <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
    <path d="M7.5 18.5C8.8 18.5 9.8 17.8 9.8 16.2V11H8V16C8 16.6 7.6 16.9 7 16.9C6.4 16.9 6 16.5 5.8 15.8L4.2 16.7C4.7 17.9 5.9 18.5 7.5 18.5ZM14.8 18.5C16.8 18.5 18 17.4 18 15.8C18 14.3 17 13.6 15.4 12.9L14.7 12.6C13.8 12.2 13.4 11.8 13.4 11.2C13.4 10.6 13.9 10.1 14.7 10.1C15.4 10.1 15.9 10.5 16.2 11.2L17.7 10.3C17.1 9.1 16 8.5 14.7 8.5C12.8 8.5 11.6 9.6 11.6 11.2C11.6 12.6 12.5 13.4 14.1 14.1L14.8 14.4C15.8 14.8 16.2 15.3 16.2 15.9C16.2 16.6 15.6 17.1 14.7 17.1C13.8 17.1 13.2 16.5 12.9 15.6L11.3 16.4C11.8 17.8 13.1 18.5 14.8 18.5Z" fill="#000000"/>
  </svg>
);

const WhiteboardEaselIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="easel-svg-icon">
    <rect x="3" y="3" width="18" height="13" rx="2" />
    <line x1="8" y1="21" x2="10" y2="16" />
    <line x1="16" y1="21" x2="14" y2="16" />
    <line x1="6" y1="21" x2="18" y2="21" />
    <circle cx="9" cy="8" r="1.2" />
    <path d="M14 11l-2-2-4 4" />
  </svg>
);

// ── Language Definitions & Initial Codes ──
const LANGUAGES = [
  {
    id: 'c',
    name: 'C',
    file: 'main.c',
    icon: CIcon,
    compilerTitle: 'C Compiler',
    version: 'GCC 13.2 (C17 Standard)',
    flags: 'C17 (-O2 -Wall)',
    memoryLimit: '256 MB',
    timeLimit: '5.0s',
    features: ['Low-level pointers', 'Manual memory management', 'POSIX system calls'],
    description: 'Fast low-level performance, manual memory management & pointer logic.',
    code: `// Online Free C compiler to run C program online
#include <stdio.h>

int main() {
    printf("Welcome to CipherSchools Compiler\\n");
    return 0;
}`,
    output: `Welcome to CipherSchools Code Editor!\nHappy Coding! 🎉`
  },
  {
    id: 'cpp',
    name: 'C++',
    file: 'main.cpp',
    icon: CppIcon,
    compilerTitle: 'C++ Compiler',
    version: 'G++ 13.2 (C++20 Standard)',
    flags: 'C++20 (-std=c++20 -O2)',
    memoryLimit: '256 MB',
    timeLimit: '5.0s',
    features: ['STL containers', 'Fast I/O templates', 'Competitive programming', 'Graph & DP logic'],
    description: 'The preferred choice for Competitive Programming, DSA & high-performance systems.',
    code: `// Online Free C++ compiler to run C++ program online
#include <iostream>

int main() {
    std::cout << "Welcome to CipherSchools Compiler" << std::endl;
    return 0;
}`,
    output: `Welcome to CipherSchools Code Editor!\nHappy Coding! 🎉`
  },
  {
    id: 'java',
    name: 'Java',
    file: 'Main.java',
    icon: JavaIcon,
    compilerTitle: 'Java Compiler',
    version: 'OpenJDK 21 LTS',
    flags: 'Java 21 (HotSpot JIT)',
    memoryLimit: '512 MB',
    timeLimit: '8.0s',
    features: ['Collections framework', 'Object-Oriented Design', 'Multithreading primitives'],
    description: 'Object-oriented, secure enterprise backend language with robust collections.',
    code: `// Online Free Java compiler to run Java program online
public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to CipherSchools Compiler");
    }
}`,
    output: `Welcome to CipherSchools Code Editor!\nHappy Coding! 🎉`
  },
  {
    id: 'python',
    name: 'Python',
    file: 'main.py',
    icon: PythonIcon,
    compilerTitle: 'Python Compiler',
    version: 'Python 3.12.2',
    flags: 'CPython 3.12.2',
    memoryLimit: '256 MB',
    timeLimit: '10.0s',
    features: ['Standard math library', 'Dynamic typing', 'Interview algorithm dry runs'],
    description: 'Clean syntax, high readability, versatile scripting, AI & data science algorithms.',
    code: `# Online Free Python compiler to run Python program online
def main():
    print("Welcome to CipherSchools Compiler")

if __name__ == "__main__":
    main()`,
    output: `Welcome to CipherSchools Code Editor!\nHappy Coding! 🎉`
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    file: 'script.js',
    icon: JSIcon,
    compilerTitle: 'JavaScript Compiler',
    version: 'Node.js 20 LTS (V8 Engine)',
    flags: 'ES2024 / Node.js 20',
    memoryLimit: '256 MB',
    timeLimit: '5.0s',
    features: ['V8 TurboFan JIT', 'Async/Await promises', 'JSON & Array primitives'],
    description: 'Modern asynchronous runtime powering web frontends, full-stack & interview algorithms.',
    code: `// Online Free JavaScript runner to run JS program online
function welcome() {
    console.log("Welcome to CipherSchools Compiler");
}

welcome();`,
    output: `Welcome to CipherSchools Code Editor!\nHappy Coding! 🎉`
  }
];

// Whiteboard mockup is fixed to the C++ editor
const WB_LANG = LANGUAGES.find((l) => l.id === 'cpp');


// Minimal UI mockups for the problem/solution bento cards
const SetupBentoVisual = () => (
  <div className="oc-mock oc-mock-window">
    <div className="oc-mock-bar">
      <span className="oc-mock-dots"><i /><i /><i /></span>
    </div>
    <div className="oc-mock-langs">
      {LANGUAGES.map((lang) => (
        <span key={lang.id} className={`oc-mock-lang ${lang.id === 'cpp' ? 'active' : ''}`}>{lang.name}</span>
      ))}
    </div>
  </div>
);

const MultiFileBentoVisual = () => (
  <div className="oc-mock oc-mock-tree">
    {[
      { name: 'main.cpp', active: true },
      { name: 'helper.cpp', active: false }
    ].map((f) => (
      <div key={f.name} className={`oc-mock-file ${f.active ? 'active' : ''}`}>
        <FileCode size={15} />
        <span>{f.name}</span>
      </div>
    ))}
    <div className="oc-mock-file ghost">
      <Plus size={15} />
      <span>New file</span>
    </div>
  </div>
);

const SaveBentoVisual = () => (
  <div className="oc-mock oc-mock-saved">
    <div className="oc-mock-saved-row">
      <FileCode size={15} />
      <span className="oc-mock-saved-name">my-project</span>
      <span className="oc-mock-badge"><Check size={12} /> Saved</span>
    </div>
    <div className="oc-mock-saved-row faded">
      <FileCode size={15} />
      <span className="oc-mock-skeleton" style={{ width: '46%' }} />
    </div>
  </div>
);

const ShareBentoVisual = () => (
  <div className="oc-mock oc-mock-share">
    <div className="oc-mock-url">
      <Link2 size={15} />
      <span className="oc-mock-skeleton" style={{ width: '58%' }} />
      <span className="oc-mock-copy"><Copy size={13} /> Copy link</span>
    </div>
    <div className="oc-mock-access">
      <span>Anyone with the link</span>
      <span className="oc-mock-chip">View</span>
      <span className="oc-mock-chip">Run</span>
    </div>
  </div>
);

const PAIR_VISUALS = {
  setup: SetupBentoVisual,
  multifile: MultiFileBentoVisual,
  save: SaveBentoVisual,
  share: ShareBentoVisual
};

// Minimal UI mockups for the "how it works" steps
const PickLanguageStepVisual = () => (
  <div className="oc-mock oc-mock-window">
    <div className="oc-mock-bar">
      <span className="oc-mock-dots"><i /><i /><i /></span>
    </div>
    <div className="oc-mock-langs">
      {LANGUAGES.map((lang) => (
        <span key={lang.id} className={`oc-mock-lang ${lang.id === 'cpp' ? 'active' : ''}`}>{lang.name}</span>
      ))}
    </div>
  </div>
);

const WriteStepVisual = () => (
  <div className="oc-mock oc-mock-window">
    <div className="oc-mock-bar oc-mock-tabs">
      <span className="active">main.cpp</span>
      <span>helper.cpp</span>
    </div>
    <pre className="oc-mock-code">
      <span className="ln">1</span><span className="kw">#include</span>{' <iostream>\n'}
      <span className="ln">2</span><span className="kw">int</span>{' main() {\n'}
      <span className="ln">3</span>{'  std::cout << '}<span className="str">"Hello"</span>{';'}
    </pre>
  </div>
);

const RunStepVisual = () => (
  <div className="oc-mock oc-mock-run">
    <span className="oc-mock-run-btn"><Play size={14} /> Run</span>
    <div className="oc-mock-window">
      <div className="oc-mock-bar">
        <span className="oc-mock-output-label">Output</span>
        <span className="oc-mock-badge"><Check size={12} /> Done</span>
      </div>
      <div className="oc-mock-output">Hello</div>
    </div>
  </div>
);

const STEP_VISUALS = [PickLanguageStepVisual, WriteStepVisual, RunStepVisual];

// Proof renders only items that carry permission: true
const proofStats = PROOF.stats.filter((x) => x.permission !== false);
const proofTestimonials = PROOF.testimonials.filter((x) => x.permission === true);
const proofLogos = PROOF.logos.filter((x) => x.permission === true);
const hasProofData = proofStats.length > 0 || proofTestimonials.length > 0 || proofLogos.length > 0 || !!PROOF.caseStudy;
const showProof = hasProofData || PROOF.fallback.enabled;

const visibleFaqs = FAQ.items.filter((item) => item.confirmed);
const visibleObjections = OBJECTIONS.filter((o) => o.show);

const CompilerPage = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const heroTiltRef = useRef(null);

  const canvasRef = useRef(null);

  // Active language state
  const [selectedLangId, setSelectedLangId] = useState('cpp');
  const currentLang = LANGUAGES.find(l => l.id === selectedLangId) || LANGUAGES[1];

  // Editor states
  const [codes, setCodes] = useState({
    c: LANGUAGES[0].code,
    cpp: LANGUAGES[1].code,
    java: LANGUAGES[2].code,
    python: LANGUAGES[3].code,
    javascript: LANGUAGES[4].code
  });
  const [inputVal, setInputVal] = useState('');
  const [outputVal, setOutputVal] = useState(LANGUAGES[1].output);
  const [isCompiling, setIsCompiling] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
  const [extraTabs, setExtraTabs] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  
  // Mobile specific states
  const [mobileConsoleTab, setMobileConsoleTab] = useState('input'); // 'input' | 'output'
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const mobileActionsRef = useRef(null);

  // Close mobile dropdown on outside click/tap
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileActionsRef.current && !mobileActionsRef.current.contains(event.target)) {
        setMobileActionsOpen(false);
      }
    };
    if (mobileActionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileActionsOpen]);

  // Right pane mode: 'terminal' or 'whiteboard'
  const [isWhiteboardMode, setIsWhiteboardMode] = useState(false);

  // Whiteboard drawing tools state
  const [drawTool, setDrawTool] = useState('pen'); // 'pen' | 'eraser' | 'hand'
  const [penColor, setPenColor] = useState('#1E293B');
  const [penSize, setPenSize] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hero mockup tilt: 0 = tilted back (page top), 1 = flat (after ~420px of scroll)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / 420));
      heroTiltRef.current?.style.setProperty('--tilt-progress', progress.toFixed(3));
      // Fade the mockup in over the first ~300px of scroll
      const reveal = Math.min(1, Math.max(0, window.scrollY / 300));
      editorRef.current?.style.setProperty('--reveal', reveal.toFixed(3));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Hero bug: peeks out from behind "Open Compiler", crawls onto the mockup's
  // code as the page scrolls, then disappears at the end of its path.
  // Waypoints are re-measured every frame because the mockup tilts on scroll.
  const heroInnerRef = useRef(null);
  const heroCtaRef = useRef(null);
  const whiteboardSectionRef = useRef(null);
  const heroCodeRef = useRef(null);
  const heroBugRef = useRef(null);
  const [bugPhase, setBugPhase] = useState('peek'); // 'peek' | 'crawl' | 'gone'

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const SCROLL_START = 30;
    const SCROLL_END = 560;
    const LINE_H = 20; // .code-editable-area: 0.86rem × 1.45
    let raf = 0;
    let walkTimer = 0;
    let lastP = -1;

    const catmull = (a, b, c, d, t) =>
      0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t);
    const pointAt = (pts, u) => {
      const n = pts.length - 1;
      const f = Math.min(n - 1e-6, Math.max(0, u * n));
      const i = Math.floor(f);
      const t = f - i;
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(n, i + 2)];
      return { x: catmull(p0.x, p1.x, p2.x, p3.x, t), y: catmull(p0.y, p1.y, p2.y, p3.y, t) };
    };

    const update = () => {
      raf = 0;
      const inner = heroInnerRef.current;
      const cta = heroCtaRef.current;
      const code = heroCodeRef.current;
      const bug = heroBugRef.current;
      if (!inner || !cta || !code || !bug || bug.offsetParent === null) return;

      const p = Math.min(1, Math.max(0, (window.scrollY - SCROLL_START) / (SCROLL_END - SCROLL_START)));
      const o = inner.getBoundingClientRect();
      const c = cta.getBoundingClientRect();
      const k = code.getBoundingClientRect();
      const at = (x, y) => ({ x: x - o.left, y: y - o.top });
      const codeX = (px) => k.left + Math.min(px, k.width - 24);
      const lineY = (n) => k.top + 14 + LINE_H / 2 + n * LINE_H;

      const pts = [
        at(c.left + c.width * 0.72, c.top - 3), // head peeking over the CTA
        at(c.right + 36, c.bottom + 44),
        at(codeX(440), k.top - 70),
        at(codeX(380), lineY(0)),
        at(codeX(110), lineY(1)),
        at(codeX(320), lineY(3)),
        at(codeX(170), lineY(2))
      ];

      const pos = pointAt(pts, p);
      const ahead = pointAt(pts, Math.min(1, p + 0.012));
      const behind = pointAt(pts, Math.max(0, p - 0.012));
      // The SVG faces up; while peeking keep it looking up out of the button
      const angle = p < 0.01 ? -8 : (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI + 90;

      bug.style.setProperty('--bx', `${pos.x.toFixed(1)}px`);
      bug.style.setProperty('--by', `${pos.y.toFixed(1)}px`);
      bug.style.setProperty('--ba', `${angle.toFixed(1)}deg`);

      if (p !== lastP && lastP !== -1) {
        bug.classList.add('is-walking');
        clearTimeout(walkTimer);
        walkTimer = setTimeout(() => bug.classList.remove('is-walking'), 180);
      }
      lastP = p;
      setBugPhase(p <= 0 ? 'peek' : p >= 0.98 ? 'gone' : 'crawl');
    };

    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(raf);
      clearTimeout(walkTimer);
    };
  }, []);

  // Floating CTA & Shortcut dock visibility on scroll
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear when user scrolls down past hero action buttons (~280px)
      if (window.scrollY > 280) {
        setShowFloatingCta(true);
      } else {
        setShowFloatingCta(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fire once when the whiteboard spotlight enters the viewport
  useEffect(() => {
    const el = whiteboardSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        track('oc_feature_whiteboard_view');
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── SEO & Head Metadata (client-side) ──
  useEffect(() => {
    const prevTitle = document.title;
    const pageUrl = `${SITE_URL}${PAGE_PATH}`;
    document.title = SEO.title;

    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setCanonical = (href) => {
      let el = document.querySelector('link[rel="canonical"]');
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    const setJsonLd = (id, data) => {
      let script = document.getElementById(id);
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    setMeta('description', SEO.description);
    setMeta('author', 'CipherSchools');
    setMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    setMeta('og:title', SEO.title, true);
    setMeta('og:description', SEO.description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', pageUrl, true);
    setMeta('og:site_name', 'CipherSchools', true);
    setMeta('og:image', SEO.image, true);
    setMeta('og:image:alt', SEO.heroAlt, true);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', SEO.title);
    setMeta('twitter:description', SEO.description);
    setMeta('twitter:image', SEO.image);
    setMeta('twitter:image:alt', SEO.heroAlt);
    setMeta('twitter:site', '@cipherschools');

    setCanonical(pageUrl);

    const softwareSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'CipherSchools Online Compiler',
      'url': pageUrl,
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web',
      'description': SEO.description,
      'featureList': FEATURES.items.map((f) => `${f.title} ${f.body}`),
      'creator': {
        '@type': 'Organization',
        'name': 'CipherSchools',
        'url': SITE_URL
      }
    };
    // TODO(confirm): price 0 only once "free" is confirmed
    if (CONFIRMED.free) {
      softwareSchema.offers = { '@type': 'Offer', 'price': '0', 'priceCurrency': 'INR' };
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': FAQ.items.filter((item) => item.confirmed).map((item) => ({
        '@type': 'Question',
        'name': item.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': item.a }
      }))
    };

    setJsonLd('schema-software-app', softwareSchema);
    setJsonLd('schema-faq', faqSchema);

    return () => {
      document.title = prevTitle;
      document.getElementById('schema-software-app')?.remove();
      document.getElementById('schema-faq')?.remove();
    };
  }, []);

  // Keyboard shortcut listener (Ctrl/Cmd + Enter to Open & Compile)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        setIsWhiteboardMode(false);
        editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        handleCompile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLangId, inputVal]);

  // Update output when switching language
  const handleSelectLang = (id) => {
    setSelectedLangId(id);
    const langObj = LANGUAGES.find(l => l.id === id);
    if (langObj) {
      setOutputVal(langObj.output);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Compile action
  const handleCompile = () => {
    setIsCompiling(true);
    setMobileConsoleTab('output');
    setTimeout(() => {
      setIsCompiling(false);
      const customPrefix = inputVal.trim() 
        ? `[Input Provided]: ${inputVal.trim()}\n----------------------------------------\n`
        : '';
      setOutputVal(
        `${customPrefix}Welcome to CipherSchools Code Editor!\nHappy Coding! 🎉\n\n[Execution Finished in 0.12s]`
      );
      showToast('Program compiled and executed successfully!');
    }, 450);
  };

  const handleResetCode = () => {
    setCodes(prev => ({
      ...prev,
      [selectedLangId]: currentLang.code
    }));
    setOutputVal(currentLang.output);
    showToast('Code reset to default template');
  };

  const handleDownloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([codes[selectedLangId]], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = currentLang.file;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded ${currentLang.file}`);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast('Compiler link copied to clipboard!');
  };

  const handleAddTab = () => {
    if (extraTabs.length >= 2) {
      showToast('Max 3 tabs in demo preview');
      return;
    }
    const newTabName = extraTabs.length === 0 ? 'solution.h' : 'input.txt';
    setExtraTabs(prev => [...prev, newTabName]);
    setActiveTab(newTabName);
  };

  // ── Whiteboard Canvas Logic ──
  useEffect(() => {
    if (isWhiteboardMode && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Set resolution matching client size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

      // Draw initial DSA dry-run sketch
      drawDefaultDryRun(ctx, rect.width, rect.height);
    }
  }, [isWhiteboardMode]);

  const drawDefaultDryRun = (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);

    // Light grid background
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    for (let x = 20; x < w; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 20; y < h; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Title label on whiteboard
    ctx.fillStyle = '#EA580C';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('// DRY RUN: BST IN-ORDER TRAVERSAL', 24, 32);

    // Root Node (10)
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#EFF6FF';
    ctx.beginPath();
    ctx.arc(140, 75, 18, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('10', 133, 80);

    // Left Node (5)
    ctx.beginPath();
    ctx.moveTo(126, 86);
    ctx.lineTo(84, 124);
    ctx.strokeStyle = '#94A3B8';
    ctx.stroke();

    ctx.strokeStyle = '#10B981';
    ctx.fillStyle = '#ECFDF5';
    ctx.beginPath();
    ctx.arc(75, 135, 16, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#065F46';
    ctx.fillText('5', 71, 140);

    // Right Node (15)
    ctx.beginPath();
    ctx.moveTo(154, 86);
    ctx.lineTo(196, 124);
    ctx.strokeStyle = '#94A3B8';
    ctx.stroke();

    ctx.strokeStyle = '#8B5CF6';
    ctx.fillStyle = '#F5F3FF';
    ctx.beginPath();
    ctx.arc(205, 135, 16, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#5B21B6';
    ctx.fillText('15', 198, 140);

    // Traversal Output trace
    ctx.fillStyle = '#334155';
    ctx.font = '11px monospace';
    ctx.fillText('In-order Output: [ 5 -> 10 -> 15 ]', 24, 190);
    ctx.fillStyle = '#10B981';
    ctx.fillText('✓ Left < Root < Right verified', 24, 210);
  };

  const startDrawing = (e) => {
    if (drawTool === 'hand') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || drawTool === 'hand') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = drawTool === 'eraser' ? 18 : penSize * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = drawTool === 'eraser' ? '#FFFFFF' : penColor;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    showToast('Whiteboard canvas cleared');
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'cipherschools-whiteboard.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Whiteboard drawing saved as PNG');
  };

  // ── Auto Typing, Simulated Cursor & Compile Simulation ──
  const [isCompilerInView, setIsCompilerInView] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('idle'); // 'idle' | 'delay' | 'typing' | 'cursor_moving' | 'cursor_hovering' | 'cursor_clicking' | 'compiling' | 'output'
  const [displayedCode, setDisplayedCode] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [cursorTargeted, setCursorTargeted] = useState(false);

  const targetCode = currentLang.code;

  // Active scroll check: run the typing animation only while the mockup is on screen
  useEffect(() => {
    const handleScrollCheck = () => {
      if (!editorRef.current) return;
      const rect = editorRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Mockup sits in the hero, so it usually starts in view on load
      const isVisibleInViewport = rect.top < windowHeight * 0.9 && rect.bottom > windowHeight * 0.2;

      if (isVisibleInViewport) {
        setIsCompilerInView(true);
      } else if (rect.bottom < 0 || rect.top > windowHeight) {
        // Reset once the mockup is fully off-screen
        setIsCompilerInView(false);
      }
    };

    window.addEventListener('scroll', handleScrollCheck, { passive: true });
    handleScrollCheck();

    return () => window.removeEventListener('scroll', handleScrollCheck);
  }, []);

  // When compiler scrolls into view or language changes: start with deliberate delay
  useEffect(() => {
    if (isCompilerInView) {
      setDisplayedCode('');
      setTypingIndex(0);
      setCursorTargeted(false);
      setAnimationPhase('delay');
    } else {
      // Scrolled away / at hero: pause animation and stay idle
      setDisplayedCode('');
      setTypingIndex(0);
      setCursorTargeted(false);
      setAnimationPhase('idle');
    }
  }, [isCompilerInView, selectedLangId]);

  useEffect(() => {
    if (!isCompilerInView && animationPhase !== 'idle') return;

    let timer;
    if (animationPhase === 'delay') {
      // 850ms intentional delay after scrolling into view before typing starts
      timer = setTimeout(() => {
        setAnimationPhase('typing');
      }, 850);
    } else if (animationPhase === 'typing') {
      if (typingIndex < targetCode.length) {
        // Human-paced typing: 1 character at a time at a deliberate, readable pace
        const currentChar = targetCode[typingIndex];
        const charDelay = currentChar === '\n' ? 55 : (currentChar === ' ' ? 22 : 36);
        timer = setTimeout(() => {
          const nextIndex = typingIndex + 1;
          setDisplayedCode(targetCode.slice(0, nextIndex));
          setTypingIndex(nextIndex);
        }, charDelay);
      } else {
        // Typing done! Pause for 600ms, then cursor begins slow deliberate glide
        timer = setTimeout(() => {
          setCursorTargeted(false);
          setAnimationPhase('cursor_moving');
        }, 600);
      }
    } else if (animationPhase === 'cursor_moving') {
      // Small tick so cursor starts at code position before gliding
      const glideTick = setTimeout(() => {
        setCursorTargeted(true);
      }, 60);

      // Slower, smooth glide: 1.55s across editor to Compile button
      timer = setTimeout(() => {
        setAnimationPhase('cursor_hovering');
      }, 1550);

      return () => {
        clearTimeout(glideTick);
        clearTimeout(timer);
      };
    } else if (animationPhase === 'cursor_hovering') {
      // Hover over Compile button for 420ms with active glow
      timer = setTimeout(() => {
        setAnimationPhase('cursor_clicking');
      }, 420);
    } else if (animationPhase === 'cursor_clicking') {
      // Cursor click pulse & button press for 380ms -> then start compiling!
      timer = setTimeout(() => {
        setAnimationPhase('compiling');
      }, 380);
    } else if (animationPhase === 'compiling') {
      // Compiling animation for 1.1s -> then show output
      timer = setTimeout(() => {
        setAnimationPhase('output');
      }, 1100);
    } else if (animationPhase === 'output') {
      // Show output for 8.5 seconds, then smoothly restart if still in view
      timer = setTimeout(() => {
        if (isCompilerInView) {
          setDisplayedCode('');
          setTypingIndex(0);
          setCursorTargeted(false);
          setAnimationPhase('delay');
        }
      }, 8500);
    }

    return () => clearTimeout(timer);
  }, [animationPhase, typingIndex, targetCode, isCompilerInView]);

  const handleManualTriggerCompile = () => {
    setDisplayedCode(targetCode);
    setTypingIndex(targetCode.length);
    setCursorTargeted(true);
    setAnimationPhase('cursor_clicking');
  };

  const handleReplayCompiler = () => {
    setDisplayedCode('');
    setTypingIndex(0);
    setCursorTargeted(false);
    setAnimationPhase('delay');
  };

  const currentCodeLines = (displayedCode || (animationPhase === 'idle' ? targetCode : '') || '//').split('\n');

  // ── Whiteboard Cursive Drawing Animation State ──
  const [isWhiteboardInView, setIsWhiteboardInView] = useState(false);
  const [wbPhase, setWbPhase] = useState('idle'); // 'idle' | 'delay' | 'drawing_text' | 'complete'
  const [wbText, setWbText] = useState('');
  const targetWbText = 'Explain as you debug / dry run on white board';

  // Active scroll check for Whiteboard section: strictly only functional when scrolled to that section
  useEffect(() => {
    const handleWbScrollCheck = () => {
      if (!whiteboardSectionRef.current) return;
      const rect = whiteboardSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      const isVisibleInViewport = rect.top < windowHeight * 0.75 && rect.bottom > windowHeight * 0.2;

      if (isVisibleInViewport) {
        setIsWhiteboardInView(true);
      } else if (rect.top > windowHeight * 0.9) {
        setIsWhiteboardInView(false);
      }
    };

    window.addEventListener('scroll', handleWbScrollCheck, { passive: true });
    handleWbScrollCheck();

    return () => window.removeEventListener('scroll', handleWbScrollCheck);
  }, []);

  useEffect(() => {
    if (isWhiteboardInView) {
      setWbText('');
      setWbPhase('delay');
    } else {
      setWbText('');
      setWbPhase('idle');
    }
  }, [isWhiteboardInView]);

  useEffect(() => {
    let timer;
    if (wbPhase === 'delay') {
      // 400ms delay after scroll into view before cursive drawing starts
      timer = setTimeout(() => {
        setWbPhase('drawing_text');
      }, 400);
    } else if (wbPhase === 'drawing_text') {
      if (wbText.length < targetWbText.length) {
        timer = setTimeout(() => {
          setWbText(targetWbText.slice(0, wbText.length + 1));
        }, 45);
      } else {
        // Text drawing done!
        timer = setTimeout(() => {
          setWbPhase('complete');
        }, 300);
      }
    }

    return () => clearTimeout(timer);
  }, [wbPhase, wbText, targetWbText]);

  const [wbCtaVisible, setWbCtaVisible] = useState(false);
  const [editorCtaVisible, setEditorCtaVisible] = useState(false);

  // TODO: point this at the live compiler once its URL is available
  const handleOpenCompiler = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSectionCta = (section) => {
    track('oc_section_cta_click', { section });
    handleOpenCompiler();
  };

  // TODO: point this at the live whiteboard once its URL is available
  const handleOpenWhiteboard = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReplayWhiteboard = () => {
    setWbText('');
    setWbPhase('drawing_text');
    showToast('Replaying whiteboard drawing...');
  };

  return (
    <div className="compiler-page-root">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="compiler-toast-pill animate-fade-in">
          <Check size={14} className="text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         HERO SECTION: Title & Language Picker
         ───────────────────────────────────────────────────────────── */}
      <section className="compiler-hero-section">
        <div className="compiler-hero-inner" ref={heroInnerRef}>
          
          {/* Wraps the intro so it stacks above the bug while it peeks from the CTA */}
          <div className="hero-split">
          <div className="hero-intro">
            <div className="compiler-header-text">
              <p className="hero-microcopy">
                {HERO.microcopy.filter((m) => m.show).map((m) => m.text).join(' · ')}
              </p>

              <h1 className="compiler-main-title">
                <span className="compiler-title-line">
                  <span className="compiler-title-orange-italic">{HERO.h1.accent}</span>
                </span>{' '}
                <span className="compiler-title-line">
                  <span className="compiler-title-black-italic">{HERO.h1.rest}</span>
                </span>
              </h1>

              <p className="compiler-subtitle">
                <strong className="compiler-subtitle-lead">{HERO.sub.lead}</strong> {HERO.sub.rest}
              </p>
            </div>

            <div className="hero-action-buttons">
              <button
                type="button"
                className="hero-btn-primary"
                onClick={() => { track('oc_hero_cta_click', { cta: 'primary' }); handleOpenCompiler(); }}
                ref={heroCtaRef}
              >
                <span>{HERO.primaryCta}</span>
                <ChevronRight size={15} />
              </button>

              <div className="hero-keyboard-hint">
                <span className="kbd-shortcut-pill">
                  or press <kbd>Ctrl/Cmd</kbd> + <kbd>Enter</kbd>
                </span>
              </div>
            </div>

            {/* ── OR PICK A LANGUAGE TO START ── */}
            <div className="pick-language-block">
              <span className="pick-language-label">OR PICK A LANGUAGE TO START</span>
            
              <div className="language-pills-row">
                {LANGUAGES.map((lang) => {
                  const IconComponent = lang.icon;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      className="lang-pill-btn"
                      onClick={() => handleSelectLang(lang.id)}
                      aria-label={`Select ${lang.name} compiler`}
                    >
                      <IconComponent size={22} />
                      <span className="lang-pill-name">{lang.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column (desktop): minimal product cards */}
          <div className="hero-visual" aria-hidden="true">
            <div className="hv-card hv-terminal">
              <div className="hv-terminal-bar">
                <span className="hv-dots"><i /><i /><i /></span>
                <span className="hv-file">main.cpp</span>
              </div>
              <pre className="hv-code">
                <span className="kw">#include</span>{' <iostream>\n'}
                <span className="kw">int</span>{' main() {\n'}
                {'  std::cout << '}<span className="str">"Hello"</span>{';\n'}
                {'}'}<span className="hv-caret" />
              </pre>
              <div className="hv-output">
                <span className="hv-prompt">output:</span>
                <span className="hv-out-line">Hello</span>
                <span className="hv-done"><Check size={12} /> Finished</span>
              </div>
            </div>

            <div className="hv-card hv-share">
              <div className="hv-url">
                <Link2 size={14} />
                <span className="hv-url-bar" />
                <span className="hv-copy"><Copy size={12} /> Copy link</span>
              </div>
              <div className="hv-access">
                <span>Anyone with the link</span>
                <span className="hv-chip">View</span>
                <span className="hv-chip">Run</span>
              </div>
            </div>
          </div>
          </div>

          {/* ── Compiler mockup: slides up on load, tilts flat on scroll ── */}
          <div className="hero-mockup-stage" ref={editorRef} style={{ '--reveal': 0 }} role="group" aria-label={SEO.heroAlt}>
            <div className="hero-mockup-tilt" ref={heroTiltRef}>
              <div className="compiler-window-frame mockup-frame-non-accessible">

                {/* Top Window Header */}
                <div className="compiler-top-header">
                  <div className="header-brand-group">
                    <span className="compiler-type-text">{currentLang.compilerTitle}</span>
                  </div>

                  <div className="header-right-actions">
                    <button
                      type="button"
                      className="header-icon-btn"
                      title="Toggle Light Theme"
                      aria-label="Theme toggle"
                      tabIndex={-1}
                    >
                      <Sun size={15} />
                    </button>

                    <div className="header-avatar-circle" title="User Profile" tabIndex={-1}>
                      <User size={15} />
                    </div>
                  </div>
                </div>

                {/* Editor Workspace Split View */}
                <div className="compiler-main-workspace">
              
                  {/* Left Vertical Language & Tool Rail */}
                  <aside className="editor-left-rail">
                    <div className="rail-top-langs">
                      {LANGUAGES.map((lang) => {
                        const isSelected = selectedLangId === lang.id;
                        const IconComp = lang.icon;
                        return (
                          <button
                            key={lang.id}
                            type="button"
                            className={`rail-lang-btn ${isSelected ? 'active' : ''}`}
                            onClick={() => handleSelectLang(lang.id)}
                            title={`Switch to ${lang.name}`}
                            aria-label={`Switch to ${lang.name}`}
                          >
                            <IconComp size={20} />
                          </button>
                        );
                      })}
                    </div>

                    <div className="rail-bottom-tools">
                      <div className="rail-tool-btn static-tool" title="Whiteboard">
                        <WhiteboardEaselIcon size={18} />
                      </div>
                    </div>
                  </aside>

                  {/* Middle: Code Editor Pane — shows "Open Compiler" CTA on interaction */}
                  <div
                    className={`editor-code-pane editor-cta-pane ${editorCtaVisible ? 'wb-cta-active' : ''}`}
                    onPointerEnter={() => setEditorCtaVisible(true)}
                    onPointerDown={() => setEditorCtaVisible(true)}
                    onPointerLeave={(e) => { if (e.pointerType === 'mouse') setEditorCtaVisible(false); }}
                  >
                
                    {/* Editor File Tabs & Action Bar */}
                    <div className="editor-tabs-bar">
                      <div className="tabs-cluster">
                        <div className="code-tab-item active">
                          <span className="tab-dot desktop-only"></span>
                          <span>{currentLang.file.toLowerCase()}</span>
                          <span className="tab-bullet-mobile">•</span>
                          <span className="tab-asterisk desktop-only">*</span>
                        </div>

                        <div className="code-tab-item secondary-tab desktop-only">
                          <span>solution.h</span>
                        </div>

                        <span className="add-tab-btn static-btn desktop-only" title="Add File">
                          +
                        </span>
                      </div>

                      {/* Desktop Action Cluster */}
                      <div className="editor-actions-cluster desktop-only">
                        <button type="button" className="btn-editor-tool files-btn" tabIndex={-1}>
                          Files
                        </button>
                        <button 
                          type="button" 
                          className="btn-editor-tool icon-tool" 
                          onClick={handleReplayCompiler}
                          title="Replay Code Writing"
                        >
                          <RotateCcw size={14} />
                        </button>
                        <button type="button" className="btn-editor-tool icon-tool" tabIndex={-1} title="Share">
                          <Share2 size={14} />
                        </button>
                        <button type="button" className="btn-editor-tool icon-tool" tabIndex={-1} title="Save">
                          <Bookmark size={14} />
                        </button>
                        <button type="button" className="btn-editor-tool icon-tool" tabIndex={-1} title="Download">
                          <Download size={14} />
                        </button>
                        <button type="button" className="btn-editor-tool icon-tool" tabIndex={-1} title="Fullscreen">
                          <Maximize2 size={14} />
                        </button>

                        {/* Animated Compile Button with Simulated Cursor Target */}
                        <div className="compile-btn-wrap">
                          <button 
                            type="button" 
                            className={`btn-compile-orange ${animationPhase === 'cursor_clicking' ? 'simulated-pressed' : ''} ${(animationPhase === 'cursor_hovering' || (animationPhase === 'cursor_moving' && cursorTargeted)) ? 'target-glow' : ''}`}
                            onClick={handleManualTriggerCompile}
                            title="Click to Compile & Run"
                          >
                            {animationPhase === 'compiling' ? (
                              <>
                                <span className="spinner-dot"></span>
                                <span>Compiling...</span>
                              </>
                            ) : (
                              <>
                                <Play size={13} fill="currentColor" />
                                <span>Compile</span>
                              </>
                            )}
                          </button>

                          {(animationPhase === 'cursor_hovering' || (animationPhase === 'cursor_moving' && cursorTargeted)) && (
                            <div className="compile-highlight-pointer-tooltip animate-fade-in">
                              <span>Click to Compile</span>
                            </div>
                          )}

                          {/* Simulated Mouse Cursor Animation directly on Compile Button */}
                          {(animationPhase === 'cursor_moving' || animationPhase === 'cursor_hovering' || animationPhase === 'cursor_clicking') && (
                            <div 
                              className={`simulated-mockup-cursor ${animationPhase === 'cursor_clicking' ? 'clicking' : ''} ${(cursorTargeted || animationPhase === 'cursor_hovering') ? 'at-button' : 'at-origin'}`}
                              aria-hidden="true"
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-svg-icon">
                                <path 
                                  d="M3.5 2.5L10.5 20.5L14 13.5L21 10L3.5 2.5Z" 
                                  fill="#0F172A" 
                                  stroke="#FFFFFF" 
                                  strokeWidth="1.5" 
                                  strokeLinejoin="round" 
                                />
                              </svg>
                              {animationPhase === 'cursor_clicking' && (
                                <span className="cursor-click-wave" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Code Area with Line Numbers (Typing Simulation) */}
                    <div className="editor-textarea-wrap mockup-non-accessible-area">
                      <div className="line-numbers-gutter">
                        {currentCodeLines.map((_, i) => (
                          <span key={i} className="line-num">{i + 1}</span>
                        ))}
                      </div>
                  
                      <textarea
                        ref={heroCodeRef}
                        className="code-editable-area"
                        value={animationPhase === 'typing' ? (displayedCode + ' ▍') : (displayedCode || currentLang.code)}
                        readOnly={true}
                        tabIndex={-1}
                        spellCheck="false"
                        aria-label="Non-interactive code mockup with typing animation"
                      />
                    </div>

                    {/* Editor Status Bottom Footer */}
                    <div className="editor-status-footer">
                      <span className="status-tag">UTF-8</span>
                      <span className="status-tag">{currentLang.version}</span>
                      <span className="status-tag">Spaces: 4</span>
                      <span className="status-tag">Lines: {currentCodeLines.length}</span>
                    </div>

                    {/* Interaction CTA overlay */}
                    <div className="wb-open-cta-overlay" aria-hidden={!editorCtaVisible}>
                      <button
                        type="button"
                        className="hero-btn-primary wb-open-cta-btn"
                        onClick={handleOpenCompiler}
                        tabIndex={editorCtaVisible ? 0 : -1}
                      >
                        <span>Open Compiler</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>

                  </div>

                  {/* Right Side Pane: Split Input & Output */}
                  <div className="editor-terminal-pane mockup-terminal-pane">
                
                    {/* Top: Input Pane */}
                    <div className="terminal-subpanel input-subpanel">
                      <div className="subpanel-header">
                        <span className="panel-title-text">Input</span>
                      </div>
                      <div className="input-editor-box mockup-non-accessible-area">
                        <div className="input-gutter">
                          <span className="gutter-num">1</span>
                        </div>
                        <textarea
                          className="input-textarea"
                          placeholder="Enter custom input / test cases here..."
                          value={`5\n10 20 30 40 50`}
                          readOnly={true}
                          tabIndex={-1}
                          aria-label="Non-interactive input mockup"
                        />
                      </div>
                    </div>

                    {/* Split Divider */}
                    <div className="terminal-split-handle desktop-only"></div>

                    {/* Bottom: Output Pane with Live Animation */}
                    <div className="terminal-subpanel output-subpanel">
                      <div className="subpanel-header">
                        <span className="panel-title-text">Output</span>
                        {animationPhase === 'output' && (
                          <span className="output-status-pill success animate-fade-in">
                            <span className="status-success-dot"></span>
                            <span>0.08s</span>
                          </span>
                        )}
                        <button 
                          type="button"
                          className="clear-output-link" 
                          onClick={handleReplayCompiler}
                          title="Replay Animation"
                        >
                          Replay
                        </button>
                      </div>
                      <div className="output-console-box">
                        {(animationPhase === 'idle' || animationPhase === 'delay') && (
                          <pre className="output-pre-text output-typing-state">
                            <span className="output-muted-comment">// Ready to compile...</span>
                            <br />
                            <span className="output-muted-comment">// Waiting for compiler trigger...</span>
                          </pre>
                        )}
                        {animationPhase === 'typing' && (
                          <pre className="output-pre-text output-typing-state">
                            <span className="output-muted-comment">// Ready to compile...</span>
                            <br />
                            <span className="output-muted-comment">// Code is being written in editor...</span>
                          </pre>
                        )}
                        {(animationPhase === 'cursor_moving' || animationPhase === 'cursor_hovering' || animationPhase === 'cursor_clicking') && (
                          <pre className="output-pre-text output-highlight-state animate-fade-in">
                            <span className="output-active-comment">// Code complete! Cursor moving to compile...</span>
                          </pre>
                        )}
                        {animationPhase === 'compiling' && (
                          <div className="output-compiling-state animate-fade-in">
                            <div className="compiling-loader-bar">
                              <div className="compiling-loader-progress"></div>
                            </div>
                            <span className="output-cmd-line">$ {currentLang.compilerTitle.toLowerCase().replace(' ', '-')} -run {currentLang.file}</span>
                            <div className="compiling-status-msg">
                              <span className="spinner-dot"></span>
                              <span>Compiling code and linking binaries...</span>
                            </div>
                          </div>
                        )}
                        {animationPhase === 'output' && (
                          <div className="output-success-state animate-fade-in">
                            <pre className="output-pre-text" aria-live="polite">
    {`Welcome to CipherSchools Code Editor!
    Happy Coding! 🎉

    [Execution Finished in 0.08s - Exit Code: 0]`}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* Decorative bug: CTA → crawls over the mockup code on scroll → disappears */}
          <div className={`hero-bug is-${bugPhase}`} ref={heroBugRef} aria-hidden="true">
            <div className="hero-bug-body">
              <svg viewBox="0 0 32 32" width="28" height="28">
                <g className="hero-bug-legs hero-bug-legs-a" stroke="#7F1D1D" strokeWidth="1.4" strokeLinecap="round" fill="none">
                  <path d="M10 14 5 11" />
                  <path d="M22 20 27 21" />
                  <path d="M10 25 6 28" />
                </g>
                <g className="hero-bug-legs hero-bug-legs-b" stroke="#7F1D1D" strokeWidth="1.4" strokeLinecap="round" fill="none">
                  <path d="M22 14 27 11" />
                  <path d="M10 20 5 21" />
                  <path d="M22 25 26 28" />
                </g>
                <g className="hero-bug-antennae" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" fill="none">
                  <path d="M14.5 6 12 2.5" />
                  <path d="M17.5 6 20 2.5" />
                </g>
                <ellipse cx="16" cy="19" rx="7.5" ry="9" fill="#E5484D" />
                <path d="M16 11v16.5" stroke="#9F1F23" strokeWidth="1.1" />
                <circle cx="12.6" cy="16.5" r="1.5" fill="#7F1D1D" opacity="0.55" />
                <circle cx="19.4" cy="16.5" r="1.5" fill="#7F1D1D" opacity="0.55" />
                <circle cx="12.4" cy="22.5" r="1.2" fill="#7F1D1D" opacity="0.55" />
                <circle cx="19.6" cy="22.5" r="1.2" fill="#7F1D1D" opacity="0.55" />
                <circle cx="16" cy="9" r="3.6" fill="#1F2937" />
                <circle cx="14.7" cy="8.2" r="0.8" fill="#FFFFFF" />
                <circle cx="17.3" cy="8.2" r="0.8" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SECTION 2: PROBLEM & SOLUTION
         ───────────────────────────────────────────────────────────── */}
      <section className="compiler-capabilities-section" aria-labelledby="oc-problem-title">
        <div className="capabilities-container">

          <div className="section-head-center">
            <h2 className="section-title" id="oc-problem-title">
              <span className="oc-title-line">{PROBLEM.h2.line1}</span>
              <span className="oc-title-line">
                <span className="headline-gradient">{PROBLEM.h2.line2Accent}</span> {PROBLEM.h2.line2Rest}
              </span>
            </h2>
            <p className="section-subtitle">{PROBLEM.intro}</p>
          </div>

          <ul className="wb-features-row oc-bento-grid compiler-bento-grid">
            {PROBLEM.pairs.map((pair) => {
              const PairVisual = PAIR_VISUALS[pair.id];
              return (
              <li key={pair.id} className={`wb-feature-card bento-card oc-bento-card oc-bento--${pair.id}`}>
                <div className="oc-bento-visual" aria-hidden="true">
                  <PairVisual />
                </div>
                <p className="oc-pain-quote">&ldquo;{pair.pain}&rdquo;</p>
                <h3 className="wb-feature-title">{pair.title}</h3>
                <p className="wb-feature-desc">{pair.body}</p>
              </li>
              );
            })}
          </ul>

          <div className="wb-features-cta">
            <button type="button" className="hero-btn-primary" onClick={() => handleSectionCta('problem')}>
              <span>{SECTION_CTA}</span>
              <ChevronRight size={15} />
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SECTION 3: HOW IT WORKS & FEATURES
         ───────────────────────────────────────────────────────────── */}
      <section className="oc-section" aria-labelledby="oc-how-title">
        <div className="capabilities-container">

          <div className="section-head-center">
            <h2 className="section-title" id="oc-how-title">{HOW_IT_WORKS.h2.before} <span className="headline-gradient">{HOW_IT_WORKS.h2.accent}</span>{HOW_IT_WORKS.h2.after ? ` ${HOW_IT_WORKS.h2.after}` : ''}</h2>
          </div>

          <ol className="wb-features-row oc-steps-grid">
            {HOW_IT_WORKS.steps.map((step, idx) => {
              const StepVisual = STEP_VISUALS[idx];
              return (
                <li key={step.title} className="wb-feature-card oc-step-card">
                  <div className="oc-bento-visual oc-step-visual" aria-hidden="true">
                    <span className="oc-step-badge">{idx + 1}</span>
                    <StepVisual />
                  </div>
                  <h3 className="wb-feature-title">{step.title}</h3>
                  <p className="wb-feature-desc">{step.body}</p>
                </li>
              );
            })}
          </ol>

          <div className="wb-features-cta">
            <button type="button" className="hero-btn-primary" onClick={() => handleSectionCta('how')}>
              <span>{SECTION_CTA}</span>
              <ChevronRight size={15} />
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SECTION 3: DEDICATED WHITEBOARD MOCKUP (NON-ACCESSIBLE)
         ───────────────────────────────────────────────────────────── */}
      <section className="whiteboard-mockup-section" id={SPOTLIGHT.id} ref={whiteboardSectionRef} aria-labelledby="oc-spotlight-title">
        <div className="sandbox-container">

          <div className="section-head-center mockup-head-intro">
            <h2 className="section-title" id="oc-spotlight-title">
              <span className="oc-title-line">
                <span className="headline-gradient">{SPOTLIGHT.h2.accent}</span>
              </span>
              <span className="oc-title-line">{SPOTLIGHT.h2.rest}</span>
            </h2>
            <p className="section-subtitle">{SPOTLIGHT.body}</p>
          </div>

          <div className="compiler-window-frame mockup-frame-non-accessible">

            {/* Top Window Header (same as compiler mockup) */}
            <div className="compiler-top-header">
              <div className="header-brand-group">
                <span className="compiler-type-text">C++ Compiler + Whiteboard</span>
              </div>

              <div className="header-right-actions">
                <button type="button" className="header-icon-btn" title="Toggle Light Theme" tabIndex={-1}>
                  <Sun size={15} />
                </button>
                <div className="header-avatar-circle" title="User Profile" tabIndex={-1}>
                  <User size={15} />
                </div>
              </div>
            </div>

            <div className="compiler-main-workspace wb-split-workspace">

              {/* Left Vertical Language & Tool Rail (static, C++ selected) */}
              <aside className="editor-left-rail">
                <div className="rail-top-langs">
                  {LANGUAGES.map((lang) => {
                    const IconComp = lang.icon;
                    return (
                      <span
                        key={lang.id}
                        className={`rail-lang-btn static-btn ${lang.id === 'cpp' ? 'active' : ''}`}
                        title={lang.name}
                      >
                        <IconComp size={20} />
                      </span>
                    );
                  })}
                </div>

                <div className="rail-bottom-tools">
                  <div className="rail-tool-btn static-tool" title="Whiteboard Active">
                    <WhiteboardEaselIcon size={18} />
                  </div>
                </div>
              </aside>

              {/* Left: C++ Code Pane */}
              <div className="editor-code-pane">
                <div className="editor-tabs-bar">
                  <div className="tabs-cluster">
                    <div className="code-tab-item active">
                      <span className="tab-dot desktop-only"></span>
                      <span>{WB_LANG.file}</span>
                    </div>
                  </div>
                </div>

                <div className="editor-textarea-wrap mockup-non-accessible-area">
                  <div className="line-numbers-gutter">
                    {WB_LANG.code.split('\n').map((_, i) => (
                      <span key={i} className="line-num">{i + 1}</span>
                    ))}
                  </div>
                  <textarea
                    className="code-editable-area"
                    value={WB_LANG.code}
                    readOnly={true}
                    tabIndex={-1}
                    spellCheck="false"
                    aria-label="Non-interactive C++ code mockup"
                  />
                </div>

                <div className="editor-status-footer">
                  <span className="status-tag">UTF-8</span>
                  <span className="status-tag">{WB_LANG.version}</span>
                  <span className="status-tag">Lines: {WB_LANG.code.split('\n').length}</span>
                </div>
              </div>

              {/* Right: Whiteboard Pane — shows "Open Whiteboard" CTA on interaction */}
              <div
                className={`editor-whiteboard-pane ${wbCtaVisible ? 'wb-cta-active' : ''}`}
                onPointerEnter={() => setWbCtaVisible(true)}
                onPointerDown={() => setWbCtaVisible(true)}
                onPointerLeave={(e) => { if (e.pointerType === 'mouse') setWbCtaVisible(false); }}
              >
                <div className="whiteboard-canvas-wrap mockup-non-accessible-area">
                  <div className="whiteboard-surface-container clean-board">
                    <div className="whiteboard-grid-pattern" />
                    <div className="whiteboard-center-drawing-box">
                      <div className="wb-cursive-text-row">
                        <h3 className="wb-cursive-heading">
                          {wbText || (wbPhase === 'idle' ? targetWbText : '')}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="whiteboard-bottom-toolbar">
                  <div className="toolbar-cluster tools-group">
                    <div className="wb-tool-btn active" title="Pen Tool">
                      <PenTool size={15} />
                    </div>
                    <div className="wb-tool-btn" title="Eraser">
                      <Eraser size={15} />
                    </div>
                    <div className="wb-tool-btn" title="Hand Pan">
                      <Move size={15} />
                    </div>
                  </div>

                  <div className="toolbar-divider"></div>

                  <div className="toolbar-cluster colors-group">
                    {[
                      { color: '#1E293B', label: 'Black' },
                      { color: '#3B82F6', label: 'Blue' },
                      { color: '#10B981', label: 'Green' },
                      { color: '#F97316', label: 'Orange' }
                    ].map((swatch, idx) => (
                      <div
                        key={swatch.color}
                        className={`wb-color-dot ${idx === 3 ? 'selected' : ''}`}
                        style={{ backgroundColor: swatch.color }}
                        title={swatch.label}
                      />
                    ))}
                  </div>

                  <div className="toolbar-divider"></div>

                  <div className="toolbar-cluster actions-group">
                    <button
                      type="button"
                      className="wb-action-btn"
                      onClick={handleReplayWhiteboard}
                      title="Replay Whiteboard Drawing"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <div className="wb-action-btn" title="Undo">
                      <Undo2 size={14} />
                    </div>
                    <div className="wb-action-btn" title="Redo">
                      <Redo2 size={14} />
                    </div>
                  </div>
                </div>

                {/* Interaction CTA overlay */}
                <div className="wb-open-cta-overlay" aria-hidden={!wbCtaVisible}>
                  <button
                    type="button"
                    className="hero-btn-primary wb-open-cta-btn"
                    onClick={handleOpenWhiteboard}
                    tabIndex={wbCtaVisible ? 0 : -1}
                  >
                    <span>Open Whiteboard</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SECTION 4: PROOF & CREDIBILITY (renders only permitted data)
         ───────────────────────────────────────────────────────────── */}
      {showProof && (
        <section className="oc-section" aria-labelledby="oc-proof-title">
          <div className="capabilities-container">

            <div className="section-head-center">
              <h2 className="section-title" id="oc-proof-title">{PROOF.h2.before} <span className="headline-gradient">{PROOF.h2.accent}</span>{PROOF.h2.after ? ` ${PROOF.h2.after}` : ''}</h2>
            </div>

            {proofStats.length > 0 && (
              <ul className="wb-features-row oc-card-grid">
                {proofStats.map((stat) => (
                  <li key={stat.label} className="wb-feature-card">
                    <p className="oc-stat-value">{stat.value}</p>
                    <p className="wb-feature-desc">{stat.label}</p>
                  </li>
                ))}
              </ul>
            )}

            {proofTestimonials.length > 0 && (
              <div className="oc-feedback-marquee">
                {/* Rendered twice so the -50% slide loops seamlessly; the copy is hidden from screen readers */}
                <div className="oc-feedback-track">
                  {[0, 1].map((copy) => (
                    <ul key={copy} className="oc-feedback-list" aria-hidden={copy === 1 || undefined}>
                      {proofTestimonials.map(({ name, org, rating = 5, photo, quote }) => (
                        <li key={name} className="oc-feedback-card">
                          <div className="oc-feedback-stars" role="img" aria-label={`Rated ${rating} out of 5`}>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star key={n} size={14} aria-hidden="true" className={n <= rating ? 'is-on' : undefined} />
                            ))}
                          </div>
                          <p className="oc-feedback-quote">{quote}</p>
                          <div className="oc-feedback-author">
                            {photo ? (
                              <img src={photo} alt="" width={40} height={40} loading="lazy" decoding="async" />
                            ) : (
                              <span className="oc-feedback-initial" aria-hidden="true">{name.charAt(0)}</span>
                            )}
                            <div>
                              <p className="oc-feedback-name">{name}</p>
                              <p className="oc-feedback-role">{org}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            )}

            {proofLogos.length > 0 && (
              <ul className="oc-chip-row">
                {proofLogos.map((logo) => (
                  <li key={logo.name}><img src={logo.src} alt={logo.name} className="oc-proof-logo" /></li>
                ))}
              </ul>
            )}

            {!hasProofData && (
              <p className="section-subtitle">{PROOF.fallback.text}</p>
            )}

          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
         SECTION 5: VALUE, OBJECTIONS & FAQS
         ───────────────────────────────────────────────────────────── */}
      <section className="compiler-faq-section" aria-labelledby="oc-faq-title">
        <div className="faq-container">

          <div className="section-head-center">
            <h2 className="section-title" id="oc-faq-title">{FAQ.h2.before} <span className="headline-gradient">{FAQ.h2.accent}</span>{FAQ.h2.after ? ` ${FAQ.h2.after}` : ''}</h2>
          </div>

          {(PRICING.show || visibleObjections.length > 0) && (
            <div className="oc-value-block">
              {PRICING.show && (
                <>
                  <h3 className="wb-feature-title">{PRICING.h3}</h3>
                  <p className="wb-feature-desc">{PRICING.body}</p>
                </>
              )}
              {visibleObjections.length > 0 && (
                <dl className="oc-objections">
                  {visibleObjections.map((o) => (
                    <div key={o.id}>
                      <dt>{o.q}</dt>
                      <dd>{o.a}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )}

          <div className="faq-accordion-wrap">
            {visibleFaqs.map((item) => {
              const isOpen = openFaq === item.id;
              return (
                <div
                  key={item.id}
                  className={`faq-accordion-item ${isOpen ? 'open' : ''}`}
                >
                  <h3 className="faq-question-heading">
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => {
                        if (!isOpen) track('oc_faq_open', { question_id: item.id });
                        setOpenFaq(isOpen ? null : item.id);
                      }}
                      aria-expanded={isOpen}
                      aria-controls={`oc-faq-panel-${item.id}`}
                      id={`oc-faq-btn-${item.id}`}
                    >
                      <span className="faq-question-text">{item.q}</span>
                      <span className="faq-toggle-icon" aria-hidden="true">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </button>
                  </h3>

                  {isOpen && (
                    <div
                      className="faq-answer-content animate-fade-in"
                      id={`oc-faq-panel-${item.id}`}
                      role="region"
                      aria-labelledby={`oc-faq-btn-${item.id}`}
                    >
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── Floating CTA & Keyboard Shortcut Dock (When Scrolled) ── */}
      <div 
        className={`compiler-floating-cta-dock ${showFloatingCta ? 'visible' : ''}`}
        aria-hidden={!showFloatingCta}
      >
        <div className="floating-dock-card">
          <button
            type="button"
            className="floating-btn-primary"
            onClick={handleOpenCompiler}
            aria-label={FINAL_CTA.cta}
          >
            <span>{FINAL_CTA.cta}</span>
            <ChevronRight size={15} />
          </button>

          <div className="floating-keyboard-hint">
            <span className="kbd-shortcut-pill">
              or <kbd>Ctrl/Cmd</kbd> + <kbd>Enter</kbd>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CompilerPage;
