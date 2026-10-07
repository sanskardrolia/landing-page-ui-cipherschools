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
  MoreHorizontal
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
    a: 'When practicing Data Structures and Algorithms (DSA) or solving coding interview questions, sketching logic (such as binary tree traversals, graph cycles, or two-pointer traces) is critical. Having a whiteboard directly alongside your editor eliminates window-switching to Excalidraw or physical paper.'
  },
  {
    q: 'Can I provide custom inputs and test cases for programming problems?',
    a: 'Yes! The dedicated Input pane lets you enter multi-line test cases (e.g. array sizes, test matrices, strings) before clicking Compile. The runtime seamlessly passes your input to your program across any language.'
  },
  {
    q: 'Is the CipherSchools Online Compiler free to use?',
    a: 'Yes, 100% free with unlimited runs, zero ads, and no sign-up or installation required. You can jump in and execute code in seconds.'
  },
  {
    q: 'Which compiler and runtime versions are supported?',
    a: 'We support modern enterprise-grade toolchains: GCC 13.2 (C17 & C++20), OpenJDK 21 LTS, Python 3.12.2, and Node.js 20 LTS.'
  },
  {
    q: 'Can I download my source code files?',
    a: 'Yes! Click the Download icon in the editor top toolbar to instantly export your code (e.g. main.cpp, main.py) straight to your computer.'
  },
  {
    q: 'How does the built-in whiteboard help during technical interview preparation?',
    a: 'Top tech company interviews (e.g. Google, Amazon, Microsoft) require candidates to explain their thought process before writing code. The built-in whiteboard allows you to draw recursion trees, dynamic programming state transitions, graph adjacency lists, and pointer movements alongside your code in real time.'
  },
  {
    q: 'Can I use keyboard shortcuts in the CipherSchools Code Editor?',
    a: 'Yes! You can press Ctrl + Enter (or Cmd + Enter on macOS) to instantly compile and execute your code without having to click the button.'
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

  const currentCodeLines = (codes[selectedLangId] || '').split('\n');

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
                  setIsWhiteboardMode(false);
                  editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      <section className="compiler-sandbox-section" ref={editorRef}>
        <div className="sandbox-container">

          {/* Mobile Top Segmented Control: [ Compiler ] [ Whiteboard ] (Matches mobile mock) */}
          <div className="mobile-mode-toggle-bar">
            <button
              type="button"
              className={`mobile-segmented-btn ${!isWhiteboardMode ? 'active' : ''}`}
              onClick={() => setIsWhiteboardMode(false)}
            >
              Compiler
            </button>
            <button
              type="button"
              className={`mobile-segmented-btn ${isWhiteboardMode ? 'active' : ''}`}
              onClick={() => setIsWhiteboardMode(true)}
            >
              Whiteboard
            </button>
          </div>

          <div className="compiler-window-frame">
            
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
                >
                  <Sun size={15} />
                </button>

                <div className="header-avatar-circle" title="User Profile">
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

                {/* Bottom Rail: Whiteboard Easel Toggle Icon (Screenshot 1 & 2) */}
                <div className="rail-bottom-tools">
                  <button
                    type="button"
                    className={`rail-tool-btn ${isWhiteboardMode ? 'active-whiteboard' : ''}`}
                    onClick={() => setIsWhiteboardMode(prev => !prev)}
                    title={isWhiteboardMode ? "Switch to Terminal Mode" : "Switch to Whiteboard Mode"}
                    aria-label="Toggle Whiteboard Canvas"
                  >
                    <WhiteboardEaselIcon size={20} />
                  </button>
                </div>
              </aside>

              {/* Middle: Code Editor Pane */}
              <div className="editor-code-pane">
                
                {/* Editor File Tabs & Action Bar */}
                <div className="editor-tabs-bar">
                  <div className="tabs-cluster">
                    <button 
                      type="button" 
                      className={`code-tab-item ${activeTab === 'main' ? 'active' : ''}`}
                      onClick={() => setActiveTab('main')}
                    >
                      <span className="tab-dot desktop-only"></span>
                      <span>{currentLang.file.toLowerCase()}</span>
                      <span className="tab-bullet-mobile">•</span>
                      <span className="tab-asterisk desktop-only">*</span>
                    </button>

                    {extraTabs.map((tabName) => (
                      <button 
                        key={tabName} 
                        type="button" 
                        className={`code-tab-item ${activeTab === tabName ? 'active' : ''}`}
                        onClick={() => setActiveTab(tabName)}
                      >
                        <span>{tabName}</span>
                      </button>
                    ))}

                    <button 
                      type="button" 
                      className="add-tab-btn" 
                      onClick={handleAddTab}
                      title="Add File"
                      aria-label="Add file"
                    >
                      +
                    </button>
                  </div>

                  {/* Desktop Action Cluster (Hidden on mobile) */}
                  <div className="editor-actions-cluster desktop-only">
                    <button type="button" className="btn-editor-tool files-btn">
                      Files
                    </button>
                    <button 
                      type="button" 
                      className="btn-editor-tool icon-tool" 
                      onClick={handleResetCode}
                      title="Reset Code"
                      aria-label="Reset Code"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="btn-editor-tool icon-tool" 
                      onClick={handleShare}
                      title="Share Code Link"
                      aria-label="Share Code"
                    >
                      <Share2 size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="btn-editor-tool icon-tool" 
                      onClick={() => showToast('Code saved to Cloud Workspace')}
                      title="Save Code"
                      aria-label="Save Code"
                    >
                      <Bookmark size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="btn-editor-tool icon-tool" 
                      onClick={handleDownloadCode}
                      title="Download File"
                      aria-label="Download File"
                    >
                      <Download size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="btn-editor-tool icon-tool" 
                      onClick={() => showToast('Fullscreen mode toggled')}
                      title="Fullscreen"
                      aria-label="Fullscreen"
                    >
                      <Maximize2 size={14} />
                    </button>

                    {/* Prominent Compile Button */}
                    <button 
                      type="button" 
                      className="btn-compile-orange"
                      onClick={handleCompile}
                      disabled={isCompiling}
                    >
                      {isCompiling ? (
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
                  </div>

                  {/* Mobile Dots Action Button & Dropdown Menu */}
                  <div className="mobile-dots-action-wrap" ref={mobileActionsRef}>
                    <button
                      type="button"
                      className="mobile-dots-btn"
                      onClick={() => setMobileActionsOpen(prev => !prev)}
                      aria-label="Editor actions"
                      title="More options"
                    >
                      <MoreHorizontal size={18} color="#FFFFFF" />
                    </button>

                    {mobileActionsOpen && (
                      <div className="mobile-actions-dropdown animate-fade-in">
                        <button
                          type="button"
                          className="mobile-action-dropdown-item run-action"
                          onClick={() => {
                            handleCompile();
                            setMobileActionsOpen(false);
                          }}
                        >
                          <Play size={14} fill="currentColor" />
                          <span>Compile & Run</span>
                        </button>

                        <div className="dropdown-divider"></div>

                        <div className="dropdown-lang-section">
                          <span className="dropdown-section-title">LANGUAGES</span>
                          <div className="dropdown-lang-chips">
                            {LANGUAGES.map((l) => (
                              <button
                                key={l.id}
                                type="button"
                                className={`dropdown-chip-btn ${selectedLangId === l.id ? 'active' : ''}`}
                                onClick={() => {
                                  handleSelectLang(l.id);
                                  setMobileActionsOpen(false);
                                }}
                              >
                                {l.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        <button
                          type="button"
                          className="mobile-action-dropdown-item"
                          onClick={() => {
                            handleResetCode();
                            setMobileActionsOpen(false);
                          }}
                        >
                          <RotateCcw size={14} />
                          <span>Reset Code</span>
                        </button>

                        <button
                          type="button"
                          className="mobile-action-dropdown-item"
                          onClick={() => {
                            handleDownloadCode();
                            setMobileActionsOpen(false);
                          }}
                        >
                          <Download size={14} />
                          <span>Download Source</span>
                        </button>

                        <button
                          type="button"
                          className="mobile-action-dropdown-item"
                          onClick={() => {
                            handleShare();
                            setMobileActionsOpen(false);
                          }}
                        >
                          <Share2 size={14} />
                          <span>Share Code</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Code Area with Line Numbers & Editable Code */}
                <div className="editor-textarea-wrap">
                  <div className="line-numbers-gutter">
                    {currentCodeLines.map((_, i) => (
                      <span key={i} className="line-num">{i + 1}</span>
                    ))}
                  </div>
                  
                  <textarea
                    className="code-editable-area"
                    value={codes[selectedLangId] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCodes(prev => ({
                        ...prev,
                        [selectedLangId]: val
                      }));
                    }}
                    spellCheck="false"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
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

              {/* Right Side Pane: Split Input/Output OR Whiteboard Canvas */}
              {!isWhiteboardMode ? (
                /* Mode 1: Split Input & Output (Screenshot 1) */
                <div className="editor-terminal-pane">
                  
                  {/* Mobile Middle Segmented Control: [ Input ] [ Output ] (Matches mobile mock) */}
                  <div className="mobile-console-toggle-bar">
                    <button
                      type="button"
                      className={`mobile-segmented-btn ${mobileConsoleTab === 'input' ? 'active' : ''}`}
                      onClick={() => setMobileConsoleTab('input')}
                    >
                      Input
                    </button>
                    <button
                      type="button"
                      className={`mobile-segmented-btn ${mobileConsoleTab === 'output' ? 'active' : ''}`}
                      onClick={() => setMobileConsoleTab('output')}
                    >
                      Output
                    </button>
                  </div>

                  {/* Top: Input Pane */}
                  <div className={`terminal-subpanel input-subpanel ${mobileConsoleTab === 'input' ? 'mobile-visible' : 'mobile-hidden'}`}>
                    <div className="subpanel-header">
                      <span className="panel-title-text">
                        Input <span className="input-hint-sub">[Please input, before you compile]</span>
                      </span>
                    </div>
                    <div className="input-editor-box">
                      <div className="input-gutter">
                        <span className="gutter-num">1</span>
                      </div>
                      <textarea
                        className="input-textarea"
                        placeholder="Enter custom input / test cases here..."
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Split Divider (Desktop only) */}
                  <div className="terminal-split-handle desktop-only"></div>

                  {/* Bottom: Output Pane */}
                  <div className={`terminal-subpanel output-subpanel ${mobileConsoleTab === 'output' ? 'mobile-visible' : 'mobile-hidden'}`}>
                    <div className="subpanel-header">
                      <span className="panel-title-text">Output</span>
                      <button 
                        type="button" 
                        className="clear-output-link"
                        onClick={() => setOutputVal('')}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="output-console-box">
                      <pre className="output-pre-text" aria-live="polite" aria-atomic="true">{outputVal}</pre>
                    </div>
                  </div>

                </div>
              ) : (
                /* Mode 2: Whiteboard Scratchpad (Screenshot 2) */
                <div className="editor-whiteboard-pane animate-fade-in">
                  
                  {/* Canvas Viewport */}
                  <div className="whiteboard-canvas-wrap">
                    <canvas
                      ref={canvasRef}
                      className={`whiteboard-canvas ${drawTool === 'hand' ? 'cursor-grab' : 'cursor-crosshair'}`}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>

                  {/* Bottom Whiteboard Toolbar (Exact Screenshot 2) */}
                  <div className="whiteboard-bottom-toolbar">
                    
                    {/* Tool Selection */}
                    <div className="toolbar-cluster tools-group">
                      <button
                        type="button"
                        className={`wb-tool-btn ${drawTool === 'pen' ? 'active' : ''}`}
                        onClick={() => setDrawTool('pen')}
                        title="Pen Tool"
                      >
                        <PenTool size={15} />
                      </button>
                      <button
                        type="button"
                        className={`wb-tool-btn ${drawTool === 'eraser' ? 'active' : ''}`}
                        onClick={() => setDrawTool('eraser')}
                        title="Eraser"
                      >
                        <Eraser size={15} />
                      </button>
                      <button
                        type="button"
                        className={`wb-tool-btn ${drawTool === 'hand' ? 'active' : ''}`}
                        onClick={() => setDrawTool('hand')}
                        title="Hand Pan"
                      >
                        <Move size={15} />
                      </button>
                      <span className="toolbar-section-label">TOOLS</span>
                    </div>

                    <div className="toolbar-divider"></div>

                    {/* Color Swatches */}
                    <div className="toolbar-cluster colors-group">
                      {[
                        { color: '#1E293B', label: 'Black' },
                        { color: '#3B82F6', label: 'Blue' },
                        { color: '#10B981', label: 'Green' },
                        { color: '#F97316', label: 'Orange' },
                        { color: '#A855F7', label: 'Purple' }
                      ].map((swatch) => (
                        <button
                          key={swatch.color}
                          type="button"
                          className={`wb-color-dot ${penColor === swatch.color && drawTool === 'pen' ? 'selected' : ''}`}
                          style={{ backgroundColor: swatch.color }}
                          onClick={() => {
                            setPenColor(swatch.color);
                            setDrawTool('pen');
                          }}
                          title={swatch.label}
                        />
                      ))}
                    </div>

                    <div className="toolbar-divider"></div>

                    {/* Brush Size */}
                    <div className="toolbar-cluster size-group">
                      <button
                        type="button"
                        className="wb-size-toggle"
                        onClick={() => setPenSize(prev => prev === 2 ? 4 : prev === 4 ? 6 : 2)}
                        title={`Brush Size: ${penSize}px`}
                      >
                        <span 
                          className="size-dot" 
                          style={{ width: `${penSize * 2 + 2}px`, height: `${penSize * 2 + 2}px` }}
                        ></span>
                      </button>
                      <span className="toolbar-section-label">SIZE</span>
                    </div>

                    <div className="toolbar-divider"></div>

                    {/* Actions: Undo, Redo, Clear, Download */}
                    <div className="toolbar-cluster actions-group">
                      <button
                        type="button"
                        className="wb-action-btn"
                        onClick={() => showToast('Undo last stroke')}
                        title="Undo"
                      >
                        <Undo2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="wb-action-btn"
                        onClick={() => showToast('Redo stroke')}
                        title="Redo"
                      >
                        <Redo2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="wb-action-btn delete-btn"
                        onClick={clearCanvas}
                        title="Clear Canvas"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="wb-action-btn download-btn"
                        onClick={downloadCanvas}
                        title="Download Diagram"
                      >
                        <Download size={14} />
                      </button>
                      <span className="toolbar-section-label">ACTIONS</span>
                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* Quick Helper Mode Switcher Bar (Desktop only) */}
          <div className="workspace-mode-switch-bar desktop-only">
            <span className="mode-desc">
              Currently viewing: <strong>{isWhiteboardMode ? 'Whiteboard Scratchpad (Dry-Run Mode)' : 'Code Editor, Custom Input & Output Console'}</strong>
            </span>
            <button
              type="button"
              className="mode-toggle-pill-btn"
              onClick={() => setIsWhiteboardMode(prev => !prev)}
            >
              <WhiteboardEaselIcon size={14} />
              <span>{isWhiteboardMode ? 'Switch to Terminal Console' : 'Switch to Whiteboard Scratchpad'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SEO FAQ ACCORDION
         ───────────────────────────────────────────────────────────── */}
      <section className="compiler-faq-section">
        <div className="faq-container">
          
          <div className="section-head-center">
            <span className="compiler-badge-pill">FREQUENTLY ASKED QUESTIONS</span>
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
              setIsWhiteboardMode(false);
              editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            aria-label="Open Code Editor"
          >
            <span>Open Editor</span>
            <ChevronRight size={15} />
          </button>

          <div 
            className="floating-keyboard-hint"
            onClick={() => {
              setIsWhiteboardMode(false);
              editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
