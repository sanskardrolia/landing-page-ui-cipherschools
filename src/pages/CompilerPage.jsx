import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  RotateCcw, 
  Share2, 
  Download, 
  Maximize2, 
  Bookmark, 
  FolderPlus, 
  FileCode, 
  Sun, 
  User, 
  Check, 
  Copy, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Layers, 
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
  GraduationCap
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
    badge: null,
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
    badge: null,
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
    badge: null,
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
    badge: 'Popular',
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
    name: 'Javascript',
    file: 'script.js',
    icon: JSIcon,
    badge: null,
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

const FAQ_ITEMS = [
  {
    q: 'Why does CipherSchools Compiler include a built-in whiteboard?',
    a: 'Sketch data structures, recursion trees, and pointer traces without tab switching.'
  },
  {
    q: 'Can I provide custom inputs and test cases?',
    a: 'Yes, enter multi-line test inputs in the input pane before compiling.'
  },
  {
    q: 'Is the CipherSchools Online Compiler free to use?',
    a: '100% free with unlimited runs, zero ads, and no sign-up required.'
  },
  {
    q: 'Which compiler and runtime versions are supported?',
    a: 'GCC 13.2 (C & C++), OpenJDK 21 LTS, Python 3.12, and Node.js 20 LTS.'
  },
  {
    q: 'Can I download my source code files?',
    a: 'Yes, 1-click export downloads files with original extensions (.cpp, .py, etc.).'
  },
  {
    q: 'How does the whiteboard help during technical interview preparation?',
    a: 'Diagram logic, dry-runs, and algorithm steps in real time before coding.'
  },
  {
    q: 'Can I use keyboard shortcuts?',
    a: 'Press Ctrl + Enter (or Cmd + Enter on macOS) to instantly compile.'
  }
];

const CompilerPage = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
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

  // ── SEO & Dynamic Head Metadata Management ──
  useEffect(() => {
    const prevTitle = document.title;
    const pageTitle = `Free ${currentLang.name} Online Compiler & IDE with Whiteboard | CipherSchools`;
    document.title = pageTitle;

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

    // Primary Meta Tags
    setMeta('description', `Free in-browser ${currentLang.name} online compiler & IDE with built-in whiteboard scratchpad for DSA dry runs. Instant execution across C, C++, Java, Python, and JavaScript with custom inputs.`);
    setMeta('keywords', `online compiler, ${currentLang.name.toLowerCase()} compiler online, free online ide, dsa whiteboard, code editor online, cipherschools compiler, dry run algorithms`);
    setMeta('author', 'CipherSchools');
    setMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // Open Graph
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', `Run, compile, and dry-run ${currentLang.name} code online with zero installation. Features an integrated visual whiteboard for DSA interview prep.`, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', 'https://www.cipherschools.com/compiler', true);
    setMeta('og:site_name', 'CipherSchools', true);
    setMeta('og:image', 'https://www.cipherschools.com/og-compiler.png', true);

    // Twitter Cards
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', `Free online ${currentLang.name} compiler & IDE with whiteboard algorithm scratchpad.`);
    setMeta('twitter:site', '@cipherschools');

    // Canonical link
    setCanonical('https://www.cipherschools.com/compiler');

    // JSON-LD Structured Data Schemas
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'CipherSchools Online Compiler & IDE',
      'alternateName': 'CipherSchools Code Editor',
      'url': 'https://www.cipherschools.com/compiler',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'All (Web Browser)',
      'browserRequirements': 'Requires JavaScript. Requires HTML5.',
      'softwareVersion': '2.0',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'INR',
        'availability': 'https://schema.org/InStock'
      },
      'description': 'Free in-browser multi-language online compiler (C, C++, Java, Python, JavaScript) featuring an integrated whiteboard scratchpad for DSA algorithm tracing.',
      'featureList': [
        'Instant compilation with GCC 13.2, OpenJDK 21, Python 3.12, and Node.js 20',
        'Integrated Whiteboard Scratchpad for DSA visual dry runs',
        'Custom input test cases support',
        'Direct source code file download',
        'Zero setup, 100% free with unlimited runs'
      ],
      'creator': {
        '@type': 'Organization',
        'name': 'CipherSchools',
        'url': 'https://www.cipherschools.com'
      }
    };

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': FAQ_ITEMS.map(item => ({
        '@type': 'Question',
        'name': item.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.a
        }
      }))
    };

    const breadcrumbsSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://www.cipherschools.com/'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Online Compiler',
          'item': 'https://www.cipherschools.com/compiler'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': `${currentLang.name} Compiler`,
          'item': `https://www.cipherschools.com/compiler?lang=${currentLang.id}`
        }
      ]
    };

    setJsonLd('schema-web-app', webAppSchema);
    setJsonLd('schema-faq', faqSchema);
    setJsonLd('schema-breadcrumbs', breadcrumbsSchema);

    return () => {
      document.title = prevTitle;
      document.getElementById('schema-web-app')?.remove();
      document.getElementById('schema-faq')?.remove();
      document.getElementById('schema-breadcrumbs')?.remove();
    };
  }, [currentLang.id, currentLang.name]);

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

  // ── "Run your buggy code" Headline Animated Strikethrough & Removal ──
  const [buggyPhase, setBuggyPhase] = useState('visible'); // 'visible' | 'striking' | 'removed'

  useEffect(() => {
    if (isCompilerInView) {
      setBuggyPhase('visible');
      const timer1 = setTimeout(() => {
        setBuggyPhase('striking');
      }, 700);

      const timer2 = setTimeout(() => {
        setBuggyPhase('removed');
      }, 950);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setBuggyPhase('visible');
    }
  }, [isCompilerInView]);

  const handleReplayBuggyAnimation = () => {
    setBuggyPhase('visible');
    setTimeout(() => setBuggyPhase('striking'), 300);
    setTimeout(() => setBuggyPhase('removed'), 550);
  };

  const targetCode = currentLang.code;

  // Active scroll check: animation is strictly ONLY functional when user scrolls to compiler section
  useEffect(() => {
    const handleScrollCheck = () => {
      if (!editorRef.current) return;
      const rect = editorRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Section is considered in view if the top has scrolled into viewport and user is not at hero top
      const isScrolledPastHero = window.scrollY > 90;
      const isVisibleInViewport = rect.top < windowHeight * 0.75 && rect.bottom > windowHeight * 0.2;

      if (isScrolledPastHero && isVisibleInViewport) {
        setIsCompilerInView(true);
      } else if (!isScrolledPastHero || rect.top > windowHeight * 0.88) {
        // Reset when user scrolls back to hero top or away
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
  const whiteboardSectionRef = useRef(null);
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
        <div className="compiler-hero-inner">
          
          <div className="compiler-header-text">
            <h1 className="compiler-main-title">
              <span className="compiler-title-line">
                <span className="compiler-title-black-italic">CODE, COMPILE & REPEAT</span>
              </span>
              <span className="compiler-title-line">
                <span className="compiler-title-black-italic">IN</span>{' '}
                <span className="compiler-hero-word-pill">
                  <span className="compiler-pill-text">REAL-TIME</span>
                </span>
              </span>
            </h1>

            <div className="hero-action-buttons">
              <button
                type="button"
                className="hero-btn-primary"
                onClick={() => {
                  editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <span>Open Editor</span>
                <ChevronRight size={15} />
              </button>

              <div className="hero-keyboard-hint">
                <span className="kbd-shortcut-pill">
                  <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to open
                </span>
              </div>
            </div>
          </div>

          {/* ── OR PICK A LANGUAGE TO START ── */}
          <div className="pick-language-block">
            <span className="pick-language-label">OR PICK A LANGUAGE TO START</span>
            
            <div className="language-pills-row">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLangId === lang.id;
                const IconComponent = lang.icon;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    className={`lang-pill-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectLang(lang.id)}
                    aria-label={`Select ${lang.name} compiler`}
                  >
                    {lang.badge && (
                      <span className="lang-popular-badge">{lang.badge}</span>
                    )}
                    <IconComponent size={22} />
                    <span className="lang-pill-name">{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         INTERACTIVE COMPILER & WHITEBOARD INTERFACE (Screenshots 1 & 2)
         ───────────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────
         SECTION 1: CIPHERSCHOOLS COMPILER MOCKUP (NON-ACCESSIBLE)
         ───────────────────────────────────────────────────────────── */}
      <section className="compiler-sandbox-section" ref={editorRef}>
        <div className="sandbox-container">

          <div className="section-head-center mockup-head-intro">
            <h2 
              className="section-title section-title-animated-buggy"
              onClick={handleReplayBuggyAnimation}
              title="Click to replay animation"
            >
              <span>Run Your</span>
              <span className={`buggy-word-wrapper ${buggyPhase}`}>
                <span className="buggy-space-prefix">&nbsp;</span>
                <span className="buggy-word-inner">
                  <span className="buggy-word-text">buggy</span>
                  <span className="buggy-strikethrough-line" />
                </span>
              </span>
              <span>&nbsp;Code with </span>
              <span className="headline-gradient">Zero Setup</span>
            </h2>

            {/* Minimal "Did You Know?" Compiler Definition Strip */}
            <div className="compiler-did-you-know-strip">
              <div className="dyk-badge">
                <Sparkles size={12} className="dyk-icon" />
                <span>DID YOU KNOW?</span>
              </div>
              <p className="dyk-text">
                A compiler is the ultimate bridge between human intellect and pure physics—transforming elegant lines of code into lightning-fast binary symphonies that whisper directly to the silicon of modern machines.
              </p>
            </div>
          </div>

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
                  <div className="rail-tool-btn static-tool" title="Compiler Core Active">
                    <Terminal size={18} />
                  </div>
                </div>
              </aside>

              {/* Middle: Code Editor Pane */}
              <div className="editor-code-pane">
                
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
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SECTION 2: COMPILER CAPABILITIES BENTO GRID
         ───────────────────────────────────────────────────────────── */}
      <section className="compiler-capabilities-section">
        <div className="capabilities-container">

          <div className="compiler-bento-grid">
            
            {/* Bento Card 1: Write Code in 5 languages (Col Span 2 - Hero Feature Box) */}
            <div className="bento-card bento-span-2 bento-card-languages">
              <div className="bento-card-header">
                <div className="bento-icon-box">
                  <FileCode size={20} />
                </div>
                <span className="bento-badge-pill">Multi-Language Engine</span>
              </div>
              <div className="bento-content-body">
                <h3 className="bento-card-title">Write Code in 5 languages</h3>
                <p className="bento-card-desc">
                  Optimized low-latency cloud runtimes configured for competitive programming, system design, and DSA interviews.
                </p>
                {/* Visual Bento Widget: Language Chips with Compiler Specs */}
                <div className="bento-langs-display-row">
                  {[
                    { name: 'C', version: 'C17 Clang', icon: '⚡' },
                    { name: 'C++', version: 'C++20 GCC 13', icon: '🚀' },
                    { name: 'Java', version: 'OpenJDK 17 LTS', icon: '☕' },
                    { name: 'Python', version: 'Python 3.11', icon: '🐍' },
                    { name: 'JavaScript', version: 'Node.js 20', icon: '🌐' }
                  ].map((l) => (
                    <div key={l.name} className="bento-lang-chip">
                      <span className="lang-chip-icon">{l.icon}</span>
                      <div className="lang-chip-meta">
                        <span className="lang-chip-name">{l.name}</span>
                        <span className="lang-chip-ver">{l.version}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bento Card 2: Compile in no time with * (Col Span 1 - Speed Benchmark Box) */}
            <div className="bento-card bento-span-1 bento-card-speed">
              <div className="bento-card-header">
                <div className="bento-icon-box">
                  <Play size={20} />
                </div>
                <span className="bento-badge-pill">Sub-Second Cloud</span>
              </div>
              <div className="bento-content-body">
                <h3 className="bento-card-title">Compile in no time with *</h3>
                <p className="bento-card-desc">
                  Instant sub-second cloud execution.
                </p>
                {/* Visual Bento Widget: Apple-Style Bold Execution Metric */}
                <div className="bento-speed-stat-box">
                  <div className="bento-stat-number-row">
                    <span className="bento-speed-value">0.08</span>
                    <span className="bento-speed-unit">s</span>
                  </div>
                  <div className="bento-speed-tag">
                    <span className="speed-pulse-indicator" />
                    <span>Real-time Execution Benchmark</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Save Your Code (Col Span 1 - Persistence Box) */}
            <div className="bento-card bento-span-1 bento-card-save">
              <div className="bento-card-header">
                <div className="bento-icon-box">
                  <Bookmark size={20} />
                </div>
                <span className="bento-badge-pill">Cloud Persistence</span>
              </div>
              <div className="bento-content-body">
                <h3 className="bento-card-title">Save Your Code</h3>
                <p className="bento-card-desc">
                  Auto-saves directly to your cloud workspace.
                </p>
                {/* Visual Bento Widget: Cloud Sync Status Card */}
                <div className="bento-sync-widget">
                  <div className="bento-sync-icon-pulse">
                    <Check size={16} className="text-emerald-500" />
                  </div>
                  <div className="bento-sync-text-wrap">
                    <span className="sync-title">Cloud Auto-Save</span>
                    <span className="sync-subtitle">Synced on every keystroke</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 4: Create multiple files together (Col Span 2 - Modular Tabs Box) */}
            <div className="bento-card bento-span-2 bento-card-multifile">
              <div className="bento-card-header">
                <div className="bento-icon-box">
                  <FolderPlus size={20} />
                </div>
                <span className="bento-badge-pill">Modular Projects</span>
              </div>
              <div className="bento-content-body">
                <h3 className="bento-card-title">Create multiple file together .c, .cpp, .java, .js, .py</h3>
                <p className="bento-card-desc">
                  Multi-file tabs for modular projects. Split headers, algorithms, and test cases across native tabs.
                </p>
                {/* Visual Bento Widget: Mini Multi-File Tab Bar Mockup */}
                <div className="bento-mini-tabbar">
                  <div className="mini-tab-item active">
                    <span className="mini-tab-dot" />
                    <span>main.cpp *</span>
                  </div>
                  <div className="mini-tab-item">
                    <span>solution.h</span>
                  </div>
                  <div className="mini-tab-item">
                    <span>test_cases.py</span>
                  </div>
                  <div className="mini-tab-add" title="Add File">
                    +
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 5: Create a shareable link for your code (Col Span 2 - Collaboration Box) */}
            <div className="bento-card bento-span-2 bento-card-share">
              <div className="bento-card-header">
                <div className="bento-icon-box">
                  <Share2 size={20} />
                </div>
                <span className="bento-badge-pill">Instant Share</span>
              </div>
              <div className="bento-content-body">
                <h3 className="bento-card-title">Create a shareable link for your code</h3>
                <p className="bento-card-desc">
                  Instant shareable URLs for code. Generate clean read-only links for peers, mentors, or interviews.
                </p>
                {/* Visual Bento Widget: Interactive Apple-Style URL Bar */}
                <div className="bento-share-url-widget">
                  <div className="share-url-input-mimic">
                    <span className="share-url-protocol">https://</span>
                    <span className="share-url-domain">cipherschools.com/code/</span>
                    <span className="share-url-slug">algo-v2-live</span>
                  </div>
                  <button 
                    type="button" 
                    className="bento-copy-btn"
                    onClick={() => {
                      navigator.clipboard?.writeText('https://cipherschools.com/code/algo-v2-live');
                      showToast('Share link copied to clipboard!');
                    }}
                    title="Copy Share Link"
                  >
                    <Copy size={13} />
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bento Card 6: Download Your Code (Col Span 1 - Native Export Box) */}
            <div className="bento-card bento-span-1 bento-card-download">
              <div className="bento-card-header">
                <div className="bento-icon-box">
                  <Download size={20} />
                </div>
                <span className="bento-badge-pill">Native File Export</span>
              </div>
              <div className="bento-content-body">
                <h3 className="bento-card-title">Download Your Code</h3>
                <p className="bento-card-desc">
                  1-click native file export.
                </p>
                {/* Visual Bento Widget: Formats Row & Action Button */}
                <div className="bento-formats-row">
                  {['.cpp', '.py', '.java', '.js', '.c'].map((ext) => (
                    <span key={ext} className="bento-ext-pill">{ext}</span>
                  ))}
                </div>
                <button 
                  type="button" 
                  className="bento-download-action-btn"
                  onClick={() => showToast(`Downloaded ${currentLang.file}`)}
                  title="Download File"
                >
                  <Download size={14} />
                  <span>1-Click Download</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SECTION 3: DEDICATED WHITEBOARD MOCKUP (NON-ACCESSIBLE)
         ───────────────────────────────────────────────────────────── */}
      <section className="whiteboard-mockup-section" ref={whiteboardSectionRef}>
        <div className="sandbox-container">

          <div className="section-head-center mockup-head-intro">
            <h2 className="section-title">
              Visual Dry-Runs with <span className="headline-gradient">Interactive Whiteboard</span>
            </h2>
          </div>

          <div className="compiler-window-frame mockup-frame-non-accessible">
            
            {/* Top Whiteboard Header */}
            <div className="compiler-top-header">
              <div className="header-brand-group">
                <WhiteboardEaselIcon size={20} />
                <span className="compiler-type-text">CipherSchools Whiteboard Studio</span>
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

            {/* Whiteboard Main Canvas Area */}
            <div className="whiteboard-canvas-wrap mockup-non-accessible-area">
              <div className="whiteboard-surface-container clean-board">
                
                {/* Subtle Whiteboard Grid Dot Pattern */}
                <div className="whiteboard-grid-pattern" />

                {/* Center Whiteboard Showcase */}
                <div className="whiteboard-center-drawing-box">
                  
                  {/* Cursive / Dry-Erase Handwriting */}
                  <div className="wb-cursive-text-row">
                    <h3 className="wb-cursive-heading">
                      {wbText || (wbPhase === 'idle' ? targetWbText : '')}
                    </h3>
                  </div>

                </div>

              </div>
            </div>

            {/* Bottom Whiteboard Toolbar */}
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
                  { color: '#F97316', label: 'Orange' },
                  { color: '#A855F7', label: 'Purple' }
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

              <div className="toolbar-cluster size-group">
                <div className="wb-size-toggle" title="Brush Size: 4px">
                  <span className="size-dot" style={{ width: '10px', height: '10px' }}></span>
                </div>
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
                <div className="wb-action-btn delete-btn" onClick={clearCanvas} title="Clear Canvas">
                  <Trash2 size={14} />
                </div>
                <div className="wb-action-btn download-btn" onClick={downloadCanvas} title="Download Diagram">
                  <Download size={14} />
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SECTION 4: POINTERS BELOW WHITE BOARD COMPILER
         ───────────────────────────────────────────────────────────── */}
      <section className="whiteboard-pointers-section">
        <div className="whiteboard-pointers-container">
          
          <div className="section-head-center">
            <h2 className="section-title">
              Visual Learning Made Simple with <span className="headline-gradient">Whiteboard</span>
            </h2>
            <p className="section-subtitle">
              Teach students, sketch algorithms, and export diagrams.
            </p>
          </div>

          {/* 2 Core Pointers */}
          <div className="wb-pointers-dual-grid">
            
            {/* Pointer 1: Draw as you like */}
            <div className="wb-pointer-card">
              <div className="wb-pointer-icon-wrap">
                <PenTool size={22} />
              </div>
              <div className="wb-pointer-content">
                <div className="wb-pointer-header">
                  <h3 className="wb-pointer-title">Draw as you like</h3>
                </div>
                <p className="wb-pointer-desc">
                  Sketch recursion trees, graphs, and logic freely.
                </p>
                <div className="wb-pointer-pills">
                  <span className="wb-feature-pill">Freehand Sketching</span>
                  <span className="wb-feature-pill">5 Marker Colors</span>
                  <span className="wb-feature-pill">Pan & Zoom</span>
                </div>
              </div>
            </div>

            {/* Pointer 2: Download PNG */}
            <div className="wb-pointer-card">
              <div className="wb-pointer-icon-wrap">
                <Download size={22} />
              </div>
              <div className="wb-pointer-content">
                <div className="wb-pointer-header">
                  <h3 className="wb-pointer-title">Download PNG</h3>
                </div>
                <p className="wb-pointer-desc">
                  1-click export for notes, slides, and revisions.
                </p>
                <div className="wb-pointer-pills">
                  <span className="wb-feature-pill">High-Resolution PNG</span>
                  <span className="wb-feature-pill">Instant 1-Click Export</span>
                  <span className="wb-feature-pill">Lossless Quality</span>
                </div>
              </div>
            </div>

          </div>

          {/* Teach Students & Share Feature Highlights Strip */}
          <div className="wb-teach-share-banner">
            <div className="teach-share-item">
              <div className="ts-icon-circle">
                <GraduationCap size={19} />
              </div>
              <div className="ts-text-wrap">
                <h4 className="ts-title">Teach Students Visually</h4>
                <p className="ts-caption">Illustrate data structures and logic live on screen.</p>
              </div>
            </div>

            <div className="ts-divider"></div>

            <div className="teach-share-item">
              <div className="ts-icon-circle">
                <Share2 size={19} />
              </div>
              <div className="ts-text-wrap">
                <h4 className="ts-title">Download & Share with Them</h4>
                <p className="ts-caption">Share high-res diagrams with batches and study groups.</p>
              </div>
            </div>

            <div className="ts-divider"></div>

            <div className="teach-share-item">
              <div className="ts-icon-circle">
                <Sparkles size={19} />
              </div>
              <div className="ts-text-wrap">
                <h4 className="ts-title">Your Go-To Whiteboard Tool</h4>
                <p className="ts-caption">Built into your compiler so you never switch tabs.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SEO FAQ ACCORDION
         ───────────────────────────────────────────────────────────── */}
      <section className="compiler-faq-section">
        <div className="faq-container">
          
          <div className="section-head-center">
            <h2 className="section-title">
              Everything You Need to Know About <span className="headline-gradient">CipherSchools Compiler</span>
            </h2>
          </div>

          <div className="faq-accordion-wrap">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`faq-accordion-item ${isOpen ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.q}</span>
                    <span className="faq-toggle-icon">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-content animate-fade-in">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         BOTTOM CONVERSION CTA BANNER
         ───────────────────────────────────────────────────────────── */}
      <section className="compiler-bottom-cta">
        <div className="cta-box-card">
          <div className="cta-content">
            <h2 className="cta-heading">Ready to write and dry-run your next algorithm?</h2>
            <p className="cta-sub">
              Experience the best in-browser IDE with built-in whiteboard tools. 100% Free. Zero installation.
            </p>
          </div>
          <div className="cta-actions">
            <button
              type="button"
              className="cta-btn-primary"
              onClick={() => {
                editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <span>Launch Free Compiler</span>
              <Play size={14} fill="currentColor" />
            </button>
            <button
              type="button"
              className="cta-btn-secondary"
              onClick={() => navigate('/courses')}
            >
              <span>Explore Free Courses</span>
              <ExternalLink size={14} />
            </button>
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
            onClick={() => {
              editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            aria-label="Open Code Editor"
          >
            <span>Open Editor</span>
            <ChevronRight size={15} />
          </button>

          <div 
            className="floating-keyboard-hint"
            onClick={() => {
              editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            title="Click or press Ctrl + Enter to open"
          >
            <span className="kbd-shortcut-pill">
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to open
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CompilerPage;
