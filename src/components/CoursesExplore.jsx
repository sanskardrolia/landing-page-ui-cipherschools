import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, ChevronLeft, ChevronRight, PlayCircle, Clock, Video, 
  User, ShieldCheck, Sparkles, Code2, ArrowRight, Star, Filter, 
  Layers, CheckCircle2, Bookmark, X 
} from 'lucide-react';
import CourseSidebar from './CourseSidebar';
import './CoursesExplore.css';

/* ── Sample Course Data ── */
const CATEGORIES = [
  'All',
  'App Development',
  'Web Development',
  'Game Development',
  'Data Structures',
  'Programming',
  'Cloud Computing',
  'AI & Machine Learning',
  'UI/UX Design'
];

const HERO_SLIDES = [
  {
    id: 1,
    title: 'CipherLabs - DSA Practice Platform',
    subtitle: 'Your practice companion for next job',
    ctaText: 'Practice Now',
    tag: 'FEATURED PLATFORM',
    bgGradient: 'linear-gradient(135deg, #7F1D1D 0%, #450A0A 50%, #18181B 100%)',
    mockupTitle: 'Master the Art of Coding Interviews',
    mockupSub: 'The ultimate platform to practice DSA, prepare for top tech companies and track your progress.',
    problemList: [
      { name: 'Balanced Boundary Subarrays', status: 'Solved' },
      { name: 'Binary Insertion Quest', status: 'Attempted' },
      { name: 'Cipher Node Insertion', status: 'New' },
      { name: 'Cipher Node Swap', status: 'New' },
    ]
  },
  {
    id: 2,
    title: 'GenAI & LLM Fine-Tuning Track',
    subtitle: 'Build & Deploy AI Agents using LangChain & Llama 3',
    ctaText: 'Explore AI Track',
    tag: 'TRENDING 2026',
    bgGradient: 'linear-gradient(135deg, #1E1B4B 0%, #311042 50%, #09090B 100%)',
    mockupTitle: 'Production AI Engineering',
    mockupSub: 'Hands-on projects building RAG pipelines, AI agents, and custom fine-tuned models.',
    problemList: [
      { name: 'RAG Pipeline with Vector DB', status: 'Solved' },
      { name: 'LangChain Agent Tool Call', status: 'Solved' },
      { name: 'Llama 3 LoRA Fine-Tuning', status: 'New' },
    ]
  },
  {
    id: 3,
    title: 'Full-Stack MERN & Next.js Masterclass',
    subtitle: 'From zero to production cloud deployment',
    ctaText: 'Start Learning',
    tag: 'POPULAR PATHWAY',
    bgGradient: 'linear-gradient(135deg, #064E3B 0%, #022C22 50%, #09090B 100%)',
    mockupTitle: 'Build Enterprise Web Applications',
    mockupSub: 'Master React 19, Next.js App Router, Node.js, and CI/CD Cloud Pipelines.',
    problemList: [
      { name: 'Server Actions & Mutations', status: 'Solved' },
      { name: 'PostgreSQL & Prisma Schema', status: 'Solved' },
      { name: 'Docker & AWS Deployment', status: 'New' },
    ]
  }
];

const RECOMMENDED_COURSES = [
  {
    id: 'pro-1',
    category: 'Web Development',
    catClass: 'pro',
    title: 'Full-Stack Web Engineering Pro Bootcamp',
    desc: 'Live 1:1 mentorship, Next.js 15, Node.js microservices, Docker & AWS cloud deployment.',
    videos: 195,
    duration: '6 Months',
    instructor: 'Harshit Vashisth & FAANG Team',
    instSub: 'Ex-Amazon Tech Lead',
    rating: 4.98,
    students: '8.4k',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    isFree: false,
    isPaid: true,
    price: '₹4,999',
    originalPrice: '₹12,999',
    discount: '61% OFF',
    proPerks: ['1:1 Live FAANG Mentorship', 'Placement Guarantee', 'Verified Industry Certificate', '10+ Live Capstone Projects']
  },
  {
    id: 'rec-1',
    category: 'Languify',
    catClass: 'orange',
    title: 'FREE IELTS/TOEFL Mock Assessment',
    desc: 'AI generated feedback and scores | Test duration: 30 mins / 3 hours',
    videos: 1,
    duration: '0.5 - 3.0 hrs',
    instructor: 'Languify',
    instSub: 'express & excel',
    rating: 4.9,
    students: '12.4k',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    isFree: true,
  },
  {
    id: 'rec-2',
    category: 'Web Development',
    catClass: 'orange',
    title: 'Web Development | Beginner Friendly',
    desc: 'Complete roadmap covering HTML, CSS, JavaScript, React & Backend APIs.',
    videos: 138,
    duration: '21.8 hours',
    instructor: 'Harshit Vashisth',
    instSub: 'Instructor',
    rating: 4.8,
    students: '45.2k',
    img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop',
    isFree: true,
  },
  {
    id: 'rec-3',
    category: 'Web Development',
    catClass: 'orange',
    title: 'Hyper Text Markup Language (HTML)',
    desc: 'Master HTML5 semantic elements, forms, accessibility, and modern web structure.',
    videos: 21,
    duration: '2.0 hours',
    instructor: 'Shruti Codes',
    instSub: 'Instructor',
    rating: 4.9,
    students: '28.9k',
    img: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=800&auto=format&fit=crop',
    isFree: true,
  }
];

const LATEST_VIDEOS = [
  {
    id: 'vid-1',
    category: 'Podcast',
    title: 'All about design | podcast',
    desc: 'Join this podcast with Ishank and Faizan where we covered major UI/UX industry trends and career advice.',
    instructor: 'Ishank Popli',
    instSub: 'Instructor',
    duration: '45 mins',
    img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'vid-2',
    category: 'Career',
    title: 'How to build your resume | for freshers & experienced people...',
    desc: 'What is the best way to stand out in your job application? Practical ATS-friendly resume breakdown.',
    instructor: 'Cipher Schools',
    instSub: 'Instructor',
    duration: '28 mins',
    img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'vid-3',
    category: 'Git & GitHub',
    title: 'All about git and github to get started',
    desc: 'Git is a distributed version control system for tracking changes in source code during software development.',
    instructor: 'Cipher Schools',
    instSub: 'Instructor',
    duration: '35 mins',
    img: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'vid-4',
    category: 'Open Source',
    title: 'GSOC, Proposal Writing, Open Source & FAQs by Biswarup',
    desc: 'The Google Summer of Code, often abbreviated to GSoC, is an international annual program.',
    instructor: 'Cipher Schools',
    instSub: 'Instructor',
    duration: '52 mins',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop'
  }
];

const ALL_COURSES = [
  ...RECOMMENDED_COURSES,
  {
    id: 'pro-2',
    category: 'Data Structures',
    catClass: 'pro',
    title: 'Advanced DSA & System Design Placement Sprint',
    desc: 'Intensive interview prep, LLD/HLD architecture, 200+ LeetCode Hard problems & mock interviews.',
    videos: 220,
    duration: '4 Months',
    instructor: 'Cipher FAANG Panel',
    instSub: 'Google & Microsoft Staff Engineers',
    rating: 4.96,
    students: '14.2k',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    isFree: false,
    isPaid: true,
    price: '₹3,999',
    originalPrice: '₹9,999',
    discount: '60% OFF',
    proPerks: ['AI Mock Interviews', 'System Design Whiteboarding', 'Direct Referral Network']
  },
  {
    id: 'pro-3',
    category: 'AI & Machine Learning',
    catClass: 'pro',
    title: 'Generative AI & LLM Fine-Tuning Pro Track',
    desc: 'Master PyTorch, Transformers, RAG Pipelines, LangChain, and fine-tuning Llama 3 models.',
    videos: 110,
    duration: '3 Months',
    instructor: 'Dr. A. Verma',
    instSub: 'AI Research Lead',
    rating: 4.92,
    students: '6.1k',
    img: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop',
    isFree: false,
    isPaid: true,
    price: '₹5,499',
    originalPrice: '₹14,999',
    discount: '63% OFF',
    proPerks: ['GPU Cloud Computing Credits', 'Custom Model Deployment', '1:1 Code Audits']
  },
  {
    id: 'all-5',
    category: 'UI/UX Design',
    catClass: 'orange',
    title: 'UI/UX Project Odyssey (2026 Edition)',
    desc: 'Design production-grade design systems, wireframes, and interactive prototypes in Figma.',
    videos: 54,
    duration: '14.5 hours',
    instructor: 'Anish Kumar',
    instSub: 'Senior Designer',
    rating: 4.9,
    students: '18.3k',
    img: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop',
    isFree: true,
  },
  {
    id: 'all-6',
    category: 'Programming',
    catClass: 'orange',
    title: 'Excel Tutorial for Beginners to Pro',
    desc: 'Master VLOOKUP, XLOOKUP, Pivot Tables, Data Analytics, and automated macros.',
    videos: 32,
    duration: '6.5 hours',
    instructor: 'Rahul Sharma',
    instSub: 'Data Analyst',
    rating: 4.7,
    students: '62.0k',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    isFree: true,
  },
  {
    id: 'all-7',
    category: 'Data Structures',
    catClass: 'orange',
    title: 'Data Structures & Algorithms in Java',
    desc: 'Complete DSA bootcamp covering Trees, Graphs, Dynamic Programming, and FAANG interview questions.',
    videos: 180,
    duration: '42.0 hours',
    instructor: 'Cipher Schools',
    instSub: 'Lead Instructor',
    rating: 4.95,
    students: '89.1k',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    isFree: true,
  },
  {
    id: 'all-8',
    category: 'AI & Machine Learning',
    catClass: 'orange',
    title: 'Python for Data Science & Machine Learning',
    desc: 'NumPy, Pandas, Matplotlib, Scikit-Learn, and Neural Networks with TensorFlow.',
    videos: 96,
    duration: '26.0 hours',
    instructor: 'Dr. A. Verma',
    instSub: 'AI Researcher',
    rating: 4.85,
    students: '34.7k',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    isFree: true,
  }
];

const CoursesExplore = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('courses');

  const filterRowRef = useRef(null);

  /* Theme Toggle Event Listener */
  useEffect(() => {
    const handleThemeToggle = (e) => {
      if (e.detail && typeof e.detail.isDark === 'boolean') {
        setIsDarkMode(e.detail.isDark);
      }
    };

    window.addEventListener('courses-theme-toggle', handleThemeToggle);
    return () => window.removeEventListener('courses-theme-toggle', handleThemeToggle);
  }, []);

  /* Filter Logic */
  const filteredRecommended = RECOMMENDED_COURSES.filter(course => {
    const matchesCat = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredAllCourses = ALL_COURSES.filter(course => {
    const matchesCat = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const scrollFilterRow = (direction) => {
    if (filterRowRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      filterRowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const togglePageTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    window.dispatchEvent(new CustomEvent('courses-theme-toggle', { detail: { isDark: nextMode } }));
  };

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <div className={`courses-explore-page ${isDarkMode ? 'courses-dark-mode' : 'courses-light-mode'}`}>
      
      {/* ── LEFT SIDEBAR (WeStud Floating Style for Light & Dark Theme) ── */}
      <CourseSidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeItem={activeSidebarItem}
        setActiveItem={setActiveSidebarItem}
        isDarkMode={isDarkMode}
        onToggleTheme={togglePageTheme}
      />

      {/* ── MAIN CONTENT AREA ── */}
      <div className="courses-main-content">
        <div className="courses-container">
          
          {/* ── CATEGORY FILTER PILLS ROW ── */}
          <div className="ce-category-wrapper">
            <div className="ce-category-pills-row" ref={filterRowRef}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`ce-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="ce-scroll-arrow-btn" onClick={() => scrollFilterRow('right')} title="Scroll Categories">
              <ChevronRight size={20} />
            </button>
          </div>

        {/* ── HERO FEATURED CAROUSEL BANNER ── */}
        <div className="ce-hero-carousel-wrapper" style={{ background: currentSlide.bgGradient }}>
          
          {/* Slide Content */}
          <div className="ce-slide-left">
            <span className="ce-slide-tag">{currentSlide.tag}</span>
            <h2 className="ce-slide-title">{currentSlide.title}</h2>
            <p className="ce-slide-sub">{currentSlide.subtitle}</p>
            <button className="ce-slide-cta-btn">
              {currentSlide.ctaText} <ArrowRight size={16} />
            </button>
          </div>

          {/* Slide 3D Mockup Graphic */}
          <div className="ce-slide-right">
            <div className="ce-mockup-card">
              <div className="ce-mockup-topbar">
                <span className="mockup-dot red"></span>
                <span className="mockup-dot yellow"></span>
                <span className="mockup-dot green"></span>
                <span className="mockup-tab-title">CipherLabs IDE</span>
              </div>
              <div className="ce-mockup-body">
                <h4 className="ce-mockup-heading">{currentSlide.mockupTitle}</h4>
                <p className="ce-mockup-subtext">{currentSlide.mockupSub}</p>
                
                <div className="ce-mockup-list">
                  <span className="ce-mock-list-label">Problem Set Preview:</span>
                  {currentSlide.problemList.map((prob, idx) => (
                    <div key={idx} className="ce-mock-item">
                      <span className="ce-mock-name">{prob.name}</span>
                      <span className={`ce-mock-status ${prob.status.toLowerCase()}`}>{prob.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Prev/Next Buttons */}
          <button 
            className="ce-carousel-nav prev"
            onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
          >
            <ChevronLeft size={20} />
          </button>

          <button 
            className="ce-carousel-nav next"
            onClick={() => setCurrentSlideIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1))}
          >
            <ChevronRight size={20} />
          </button>
        </div>


        {/* ── RECOMMENDED COURSES SECTION ── */}
        <section className="ce-section">
          <div className="ce-section-header">
            <h2 className="ce-sec-title">Recommended Courses</h2>
            <div className="ce-sec-controls">
              <div className="ce-dropdown-box">
                <span>Popular</span>
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>
          </div>

          <div className="ce-courses-grid-4">
            {filteredRecommended.map((course) => (
              <div key={course.id} className={`ce-course-card ${course.isPaid ? 'card-pro-paid' : ''}`} onClick={() => setSelectedCourse(course)}>
                <div className="ce-card-thumb">
                  <img src={course.img} alt={course.title} />
                  <span className={`ce-thumb-badge ${course.isPaid ? 'pro-badge' : ''}`}>
                    {course.category}
                  </span>
                </div>

                <div className="ce-card-body">
                  <h3 className="ce-course-title">{course.title}</h3>
                  <p className="ce-course-desc">{course.desc}</p>
                  
                  {!course.isPaid && (
                    <div className="ce-course-stats">
                      <span><Video size={13} /> {course.videos} {course.videos === 1 ? 'test' : 'modules'}</span>
                      <span><Clock size={13} /> {course.duration}</span>
                    </div>
                  )}

                  <div className="ce-instructor-row">
                    <div className="ce-inst-avatar">
                      <User size={14} />
                    </div>
                    <div className="ce-inst-info">
                      <span className="ce-inst-name">{course.instructor}</span>
                      {!course.isPaid && <span className="ce-inst-sub">{course.instSub}</span>}
                    </div>
                    
                    {course.isPaid ? (
                      <div className="ce-paid-price-box">
                        <span className="ce-paid-price">{course.price}</span>
                        {course.originalPrice && <span className="ce-paid-orig">{course.originalPrice}</span>}
                      </div>
                    ) : (
                      <span className="ce-free-tag">FREE</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ── INTERSTITIAL BANNER 1 (To Increase Scroll Depth) ── */}
        <div className="ce-interstitial-banner banner-compiler">
          <div className="banner-glow-bg"></div>
          <div className="banner-left">
            <div className="banner-badge"><Code2 size={16} /> CIPHERLABS COMPILER</div>
            <h2>Write, Compile & Execute Code in 10+ Languages</h2>
            <p>Instant feedback, zero setup required. Run Python, Java, C++, C#, JS, and SQL directly in browser.</p>
          </div>
          <button className="banner-cta-btn">
            Open Compiler <ArrowRight size={16} />
          </button>
        </div>


        {/* ── LATEST VIDEOS & PODCASTS SECTION ── */}
        <section className="ce-section">
          <div className="ce-section-header">
            <h2 className="ce-sec-title">Latest Videos & Podcasts</h2>
          </div>

          <div className="ce-courses-grid-4">
            {LATEST_VIDEOS.map((vid) => (
              <div key={vid.id} className="ce-course-card video-card">
                <div className="ce-card-thumb">
                  <img src={vid.img} alt={vid.title} />
                  <div className="ce-play-icon-overlay">
                    <PlayCircle size={36} />
                  </div>
                  <span className="ce-duration-badge">{vid.duration}</span>
                </div>

                <div className="ce-card-body">
                  <h3 className="ce-course-title">{vid.title}</h3>
                  <p className="ce-course-desc">{vid.desc}</p>

                  <div className="ce-instructor-row">
                    <div className="ce-inst-avatar">
                      <User size={14} />
                    </div>
                    <div className="ce-inst-info">
                      <span className="ce-inst-name">{vid.instructor}</span>
                      <span className="ce-inst-sub">{vid.instSub}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ── INTERSTITIAL BANNER 2 (CipherSchools Premium) ── */}
        <div className="ce-interstitial-banner banner-premium">
          <div className="banner-left">
            <div className="banner-badge premium-badge"><Sparkles size={16} /> CIPHERSCHOOLS PREMIUM</div>
            <h2>Unlock 1:1 FAANG Mentorship & Live Placement Sprint</h2>
            <p>Get personalized resume reviews, mock interviews, system design drills, and referral access.</p>
          </div>
          <button className="banner-cta-btn btn-premium">
            Upgrade to Premium <ArrowRight size={16} />
          </button>
        </div>


        {/* ── ALL COURSES GRID SECTION ── */}
        <section className="ce-section">
          <div className="ce-section-header">
            <h2 className="ce-sec-title">All Courses & Learning Pathways</h2>
            <span className="ce-count-indicator">Showing {filteredAllCourses.length} Programs</span>
          </div>

          <div className="ce-courses-grid-4">
            {filteredAllCourses.map((course) => (
              <div key={course.id} className={`ce-course-card ${course.isPaid ? 'card-pro-paid' : ''}`} onClick={() => setSelectedCourse(course)}>
                <div className="ce-card-thumb">
                  <img src={course.img} alt={course.title} />
                  <span className={`ce-thumb-badge ${course.isPaid ? 'pro-badge' : ''}`}>
                    {course.category}
                  </span>
                </div>

                <div className="ce-card-body">
                  <h3 className="ce-course-title">{course.title}</h3>
                  <p className="ce-course-desc">{course.desc}</p>
                  
                  {!course.isPaid && (
                    <div className="ce-course-stats">
                      <span><Video size={13} /> {course.videos} modules</span>
                      <span><Clock size={13} /> {course.duration}</span>
                    </div>
                  )}

                  <div className="ce-instructor-row">
                    <div className="ce-inst-avatar">
                      <User size={14} />
                    </div>
                    <div className="ce-inst-info">
                      <span className="ce-inst-name">{course.instructor}</span>
                      {!course.isPaid && <span className="ce-inst-sub">{course.instSub}</span>}
                    </div>

                    {course.isPaid ? (
                      <div className="ce-paid-price-box">
                        <span className="ce-paid-price">{course.price}</span>
                        {course.originalPrice && <span className="ce-paid-orig">{course.originalPrice}</span>}
                      </div>
                    ) : (
                      <span className="ce-free-tag">FREE</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── COURSE DETAIL MODAL PREVIEW ── */}
      {selectedCourse && (
        <div className="ce-modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="ce-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="ce-modal-close" onClick={() => setSelectedCourse(null)}>
              <X size={20} />
            </button>

            <div className="ce-modal-thumb-box">
              <img src={selectedCourse.img} alt={selectedCourse.title} />
              <span className={`ce-thumb-badge ${selectedCourse.isPaid ? 'pro-badge' : ''}`}>
                {selectedCourse.isPaid ? 'PRO BOOTCAMP' : selectedCourse.category}
              </span>
            </div>

            <div className="ce-modal-content">
              <h2 className="ce-modal-title">{selectedCourse.title}</h2>
              <p className="ce-modal-desc">{selectedCourse.desc}</p>

              <div className="ce-modal-meta-grid">
                <div className="meta-item">
                  <Video size={16} />
                  <span>{selectedCourse.videos} Modules</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{selectedCourse.duration}</span>
                </div>
                <div className="meta-item">
                  <Star size={16} className="icon-star" />
                  <span>{selectedCourse.rating || '4.9'} Rating</span>
                </div>
                <div className="meta-item">
                  <User size={16} />
                  <span>{selectedCourse.instructor}</span>
                </div>
              </div>

              {selectedCourse.isPaid && selectedCourse.proPerks && (
                <div className="ce-pro-perks-box">
                  <h4>Pro Bootcamp Perks Included:</h4>
                  <ul>
                    {selectedCourse.proPerks.map((perk, pi) => (
                      <li key={pi}><CheckCircle2 size={15} className="icon-orange" /> {perk}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="ce-modal-actions">
                {selectedCourse.isPaid ? (
                  <button className="ce-enroll-btn pro-enroll-btn">
                    Enroll Pro Track for {selectedCourse.price} <ArrowRight size={18} />
                  </button>
                ) : (
                  <button className="ce-enroll-btn">
                    Start Learning for FREE <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CoursesExplore;
