import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronDown, Play, CheckCircle2, 
  ArrowRight, Video, Clock, User, Bookmark, Sparkles, Star, X
} from 'lucide-react';
import './CoursesPage.css';

/* ── Category Filter Options ── */
const CATEGORIES = [
  'App Development',
  'Web Development',
  'Game Development',
  'Data Structures',
  'Programming',
  'Machine Learning',
  'Cloud Computing',
  'Cybersecurity'
];

/* ── Hero Slides Data ── */
const HERO_SLIDES = [
  {
    id: 1,
    title: 'DSA Practice Platform',
    subtitle: 'Your practice companion for next job',
    ctaText: 'Practice Now',
    bgGradient: 'linear-gradient(135deg, #3D0606 0%, #1A0303 60%, #0D0202 100%)',
    mockupHeadline: 'Master the Art of Coding Interviews',
    mockupSubtext: 'The ultimate platform to practice DSA, prepare for top tech companies and track your progress with a clean and intuitive experience.',
    problems: [
      { name: 'Balanced Boundary Subarrays', diff: 'Hard' },
      { name: 'Binary Insertion Quest', diff: 'Medium' },
      { name: 'Cipher Node Insertion', diff: 'Easy' },
      { name: 'Cipher Node Swap', diff: 'Medium' },
      { name: 'Demand Suppression Periods', diff: 'Hard' }
    ]
  },
  {
    id: 2,
    title: 'Full-Stack Web Sandbox',
    subtitle: 'Build production-ready apps with live sandboxes',
    ctaText: 'Explore Projects',
    bgGradient: 'linear-gradient(135deg, #062F3D 0%, #02161E 60%, #010A0E 100%)',
    mockupHeadline: 'Enterprise Full-Stack Architecture',
    mockupSubtext: 'Master Next.js 15, PostgreSQL, Redis caching, Docker microservices, and end-to-end cloud deployments.',
    problems: [
      { name: 'Server Actions Mutation Flow', diff: 'Medium' },
      { name: 'Distributed Rate Limiter', diff: 'Hard' },
      { name: 'Real-time WebSocket Chat', diff: 'Medium' },
      { name: 'JWT Auth & Refresh Flow', diff: 'Easy' }
    ]
  }
];

/* ── Section 1: Recommended Courses Data ── */
const RECOMMENDED_COURSES = [
  {
    id: 'rec-1',
    category: 'Languify',
    title: 'FREE IELTS/TOEFL Mock Assessment',
    desc: 'AI generated feedback and...',
    stat: 'Test duration: 30 mins / 3 hours',
    instructor: 'Languify',
    instructorSub: 'express & excel',
    hasCustomInst: true,
    instType: 'languify',
    thumbType: 'ielts',
    accentColor: '#10B981'
  },
  {
    id: 'rec-2',
    category: 'Web Development',
    title: 'Web Development | Beginner Friendly',
    desc: 'Complete full stack web developer roadmap',
    videosCount: 138,
    courseTime: '21.8 hours',
    instructor: 'Harshit Vashisth',
    instructorSub: 'Instructor',
    instType: 'harshit',
    thumbType: 'webdev',
    accentColor: '#F3912E'
  },
  {
    id: 'rec-3',
    category: 'Web Development',
    title: 'MERN(Mongo Db, Express.Js, React.Js &...',
    desc: 'Full-stack engineering with real-world apps',
    videosCount: 54,
    courseTime: '23.7 hours',
    instructor: 'Cipher Schools',
    instructorSub: 'Instructor',
    instType: 'cipherschools',
    thumbType: 'mern',
    accentColor: '#3B82F6'
  },
  {
    id: 'rec-4',
    category: 'Data Structures',
    title: 'Data Structures & Algorithm using Java | Beginner...',
    desc: 'Master DSA from arrays to advanced graphs',
    videosCount: 101,
    courseTime: '31.1 hours',
    instructor: 'Cipher Schools',
    instructorSub: 'Instructor',
    instType: 'cipherschools',
    thumbType: 'javadsa',
    accentColor: '#EA580C'
  },
  {
    id: 'rec-5',
    category: 'Programming',
    title: 'C++ Programming Course | Beginner to Advanced',
    desc: 'Complete C++ fundamentals and OOP mastery',
    videosCount: 26,
    courseTime: '14.0 hours',
    instructor: 'Cipher Schools',
    instructorSub: 'Instructor',
    instType: 'cipherschools',
    thumbType: 'cpp',
    accentColor: '#0284C7'
  }
];

/* ── Section 2: Courses From People You Follow Data ── */
const FOLLOWING_COURSES = [
  {
    id: 'fol-1',
    category: 'Others',
    title: 'UI Design Mastery: A Journey into UI Design...',
    desc: 'Project Odyssey design systems & Figma',
    videosCount: 3,
    courseTime: '1.0 hours',
    thumbType: 'uiux',
    accentColor: '#8B5CF6'
  },
  {
    id: 'fol-2',
    category: 'Others',
    title: 'Figma Basic - UI|UX in Hindi',
    desc: 'Complete Hindi masterclass for UI/UX designers',
    videosCount: 1,
    courseTime: '1.3 hours',
    thumbType: 'figma',
    accentColor: '#EC4899'
  },
  {
    id: 'fol-3',
    category: 'Others',
    title: 'Alumni Insights: Career Talks with Industry Expert',
    desc: 'Career roadmaps & tech job placement strategies',
    videosCount: 12,
    courseTime: '11.3 hours',
    thumbType: 'alumni',
    accentColor: '#F59E0B'
  },
  {
    id: 'fol-4',
    category: 'Others',
    title: 'Unveiling Opportunities: Journeying Beyond...',
    desc: 'Tech careers beyond traditional software tracks',
    videosCount: 4,
    courseTime: '5.1 hours',
    thumbType: 'podcast',
    accentColor: '#10B981'
  },
  {
    id: 'fol-5',
    category: 'Others',
    title: 'Frontend interview experiences | Questions...',
    desc: 'Top questions asked by product companies',
    videosCount: 3,
    courseTime: '0.7 hours',
    instructor: 'Vedant Jain',
    thumbType: 'frontend',
    accentColor: '#0F172A'
  }
];

/* ── Visual Thumbnail Renderers matching Screenshot Artwork ── */
const CourseThumbnail = ({ type }) => {
  switch (type) {
    case 'ielts':
      return (
        <div className="thumb-art thumb-ielts">
          <div className="art-grid-lines"></div>
          <div className="art-center-badge">
            <span className="art-ielts-text">Crack your Dream college with a <strong>FREE IELTS/TOEFL Mock</strong></span>
          </div>
          <div className="art-icon-student">🎓</div>
        </div>
      );
    case 'webdev':
      return (
        <div className="thumb-art thumb-webdev">
          <div className="art-laptop-frame">
            <span className="art-code-screen">💻</span>
          </div>
          <div className="art-bugs-row">
            <span className="art-bug">🐛</span>
            <span className="art-bug">🐝</span>
            <span className="art-bug">🕷️</span>
          </div>
          <h4 className="art-title-bold">Web<br />Development</h4>
        </div>
      );
    case 'mern':
      return (
        <div className="thumb-art thumb-mern">
          <h4 className="art-mern-title">Full- Stack<br />Development</h4>
          <span className="art-mern-sub">USING MERN</span>
          <div className="art-mern-badges">
            <span className="mern-pill">🍃 Mongo</span>
            <span className="mern-pill">⚡ Express</span>
            <span className="mern-pill">⚛️ React</span>
            <span className="mern-pill">🟢 Node</span>
          </div>
        </div>
      );
    case 'javadsa':
      return (
        <div className="thumb-art thumb-javadsa">
          <div className="javadsa-left">
            <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
              <path d="M22 10C24 12 21 14 23 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M17 11C19 13 16 15 18 17" stroke="#EA2D2E" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M13 19H27C27 19 28 25 20 26C12 25 13 19 13 19Z" fill="white" />
              <path d="M27 20C28.5 20 30 21.5 30 23C30 24.5 28.5 25.5 27 25.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="javadsa-right">
            <h4>Java And<br />Data Structures</h4>
          </div>
        </div>
      );
    case 'cpp':
      return (
        <div className="thumb-art thumb-cpp">
          <div className="cpp-badge-c">
            <span className="cpp-logo-c">C++</span>
          </div>
          <div className="cpp-title-block">
            <span className="cpp-sub-kicker">FUNDAMENTALS</span>
            <span className="cpp-main-kicker">FOR BEGINNERS</span>
          </div>
          <div className="cpp-character">👨‍💻</div>
        </div>
      );
    case 'uiux':
      return (
        <div className="thumb-art thumb-uiux">
          <div className="uiux-title">UI/UX</div>
          <span className="uiux-sub">PROJECT ODYSSEY (2024 EDITION)</span>
          <div className="uiux-3d-elements">📊 📱 💻</div>
        </div>
      );
    case 'figma':
      return (
        <div className="thumb-art thumb-figma">
          <span className="figma-kicker">Basics of</span>
          <h4 className="figma-title">FIGMA<br />IN हिंदी</h4>
          <div className="figma-icons-float">🎨 📐 ✍️</div>
        </div>
      );
    case 'alumni':
      return (
        <div className="thumb-art thumb-alumni">
          <span className="art-brand-logo-mini">CipherSchools</span>
          <h4 className="alumni-banner-title">CAREER TALKS WITH<br /><span>INDUSTRY EXPERT</span></h4>
          <div className="soundwave-bar">||||||||||||||||||||||||||||</div>
        </div>
      );
    case 'podcast':
      return (
        <div className="thumb-art thumb-podcast">
          <span className="art-brand-logo-mini">CipherSchools</span>
          <h4 className="podcast-title">JOURNEYING BEYOND<br />DOMAINS</h4>
          <div className="podcast-mic-icon">🎙️ 🎧</div>
        </div>
      );
    case 'frontend':
      return (
        <div className="thumb-art thumb-frontend">
          <span className="art-brand-logo-mini">CipherSchools</span>
          <h4 className="frontend-title">FRONTEND INTERVIEW<br />EXPERIENCES</h4>
          <span className="frontend-sub">QUESTIONS ASKED BY TOP COMPANIES</span>
          <div className="frontend-author">
            <span className="author-dot">👤</span>
            <span className="author-name">Vedant Jain</span>
          </div>
        </div>
      );
    default:
      return <div className="thumb-art thumb-default"><span>Course</span></div>;
  }
};

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Web Development');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeLectureTab, setActiveLectureTab] = useState(1);
  const [sortFilter, setSortFilter] = useState('Popular');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const categoriesRowRef = useRef(null);
  const recommendedRowRef = useRef(null);
  const followingRowRef = useRef(null);

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollContainer = (ref, dir) => {
    if (ref.current) {
      const scrollAmt = dir === 'left' ? -320 : 320;
      ref.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <div className="courses-page-viewport">
      <div className="courses-page-max-container">

        {/* ════════════════════════════════════════════════════════════
            1. TOP CATEGORY PILLS ROW WITH SCROLL ARROW
            ════════════════════════════════════════════════════════════ */}
        <section className="courses-category-section">
          <div className="category-scroll-container" ref={categoriesRowRef}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            className="category-scroll-arrow-btn" 
            onClick={() => scrollContainer(categoriesRowRef, 'right')}
            title="Scroll categories"
            aria-label="Scroll right"
          >
            <ArrowRight size={18} />
          </button>
        </section>

        {/* ════════════════════════════════════════════════════════════
            2. HERO FEATURED CAROUSEL BANNER (DSA Practice Platform)
            ════════════════════════════════════════════════════════════ */}
        <section className="courses-hero-carousel-section">
          <div className="hero-banner-container" style={{ background: currentSlide.bgGradient }}>
            
            {/* Left Nav Arrow */}
            <button className="carousel-nav-arrow arrow-left" onClick={prevSlide} aria-label="Previous Slide">
              <ChevronLeft size={20} />
            </button>

            {/* Left Content */}
            <div className="hero-banner-content">
              <h1 className="hero-banner-title">{currentSlide.title}</h1>
              <p className="hero-banner-subtitle">{currentSlide.subtitle}</p>
              <button className="hero-banner-cta-btn">
                {currentSlide.ctaText}
              </button>
            </div>

            {/* Right Mockup Graphic (Tilted 3D Cards) */}
            <div className="hero-banner-mockups">
              {/* Back tilted card */}
              <div className="tilted-card card-back">
                <span className="card-top-tag">• New 250+ DSA Questions •</span>
                <h3 className="card-title-3d">{currentSlide.mockupHeadline}</h3>
                <p className="card-desc-3d">{currentSlide.mockupSubtext}</p>
                <div className="card-btn-row">
                  <span className="mini-cta-orange">Start Practicing Now →</span>
                  <span className="mini-cta-outline">Weekly Challenges →</span>
                </div>
              </div>

              {/* Front tilted problem set card */}
              <div className="tilted-card card-front">
                <div className="problem-set-header">
                  <span className="ps-title">Problem Set</span>
                  <span className="ps-solved-chip">0 / 350 Solved</span>
                </div>
                <div className="ps-search-mock">
                  <span className="ps-search-placeholder">🔍 Search problems...</span>
                </div>
                <div className="ps-list-items">
                  {currentSlide.problems.map((prob, idx) => (
                    <div key={idx} className="ps-row">
                      <span className="ps-bullet">○</span>
                      <span className="ps-name">{prob.name}</span>
                      <span className={`ps-diff-tag diff-${prob.diff.toLowerCase()}`}>{prob.diff}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Nav Arrow */}
            <button className="carousel-nav-arrow arrow-right" onClick={nextSlide} aria-label="Next Slide">
              <ChevronRight size={20} />
            </button>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            3. RECOMMENDED COURSES SECTION
            ════════════════════════════════════════════════════════════ */}
        <section className="courses-cards-section">
          <div className="section-title-bar">
            <h2 className="section-heading">Recommended Courses</h2>
            
            {/* Filter Dropdown */}
            <div className="sort-dropdown-wrapper">
              <button 
                className="sort-dropdown-trigger"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                <span>{sortFilter}</span>
                <ChevronDown size={15} />
              </button>
              {sortDropdownOpen && (
                <div className="sort-dropdown-menu">
                  {['Popular', 'Highest Rated', 'Newest', 'Beginner Friendly'].map((opt) => (
                    <div 
                      key={opt} 
                      className={`sort-option ${sortFilter === opt ? 'active' : ''}`}
                      onClick={() => { setSortFilter(opt); setSortDropdownOpen(false); }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="cards-slider-wrapper">
            <div className="cards-row" ref={recommendedRowRef}>
              {RECOMMENDED_COURSES.map((course) => (
                <div key={course.id} className="course-card-item">
                  <div className="card-thumb-frame">
                    <CourseThumbnail type={course.thumbType} />
                  </div>

                  <div className="card-content-area">
                    <span className="card-category-tag">{course.category}</span>
                    <h3 className="course-card-title">{course.title}</h3>
                    
                    {course.videosCount ? (
                      <div className="course-card-stats">
                        <span>No. of videos: <strong>{course.videosCount}</strong></span>
                        <span>Course time: <strong>{course.courseTime}</strong></span>
                      </div>
                    ) : (
                      <div className="course-card-stats single-stat">
                        <span className="card-sub-info">{course.desc}</span>
                        <span className="card-duration-info">{course.stat}</span>
                      </div>
                    )}

                    {/* Instructor Row */}
                    <div className="course-instructor-footer">
                      {course.instType === 'cipherschools' && (
                        <div className="inst-avatar cs-avatar-icon">
                          <span>C</span>
                        </div>
                      )}
                      {course.instType === 'harshit' && (
                        <div className="inst-avatar harshit-avatar-icon">
                          <span>👨‍🏫</span>
                        </div>
                      )}
                      {course.instType === 'languify' && (
                        <div className="inst-avatar languify-avatar-icon">
                          <span className="languify-text-mini">languify</span>
                        </div>
                      )}
                      <div className="inst-details">
                        <span className="inst-name">{course.instructor}</span>
                        <span className="inst-role">{course.instructorSub}</span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            <button 
              className="slider-nav-arrow" 
              onClick={() => scrollContainer(recommendedRowRef, 'right')}
              title="Next courses"
              aria-label="Next courses"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            4. RESUME BANNER ("Craft your Career with Confidence")
            ════════════════════════════════════════════════════════════ */}
        <section className="courses-resume-banner-section">
          <div className="resume-purple-banner">
            <div className="resume-banner-left">
              <h2 className="resume-headline">
                Craft your Career with Confidence <span className="green-checkmark">✅</span>
              </h2>
              <p className="resume-subtext">
                A <strong>professional resume</strong> is your first step to your success, craft it for free with CipherSchools.
              </p>
            </div>

            <div className="resume-banner-right">
              {/* Smartphone Frame with Template Chooser */}
              <div className="resume-phone-mockup">
                <div className="phone-notch"></div>
                <div className="phone-screen-content">
                  <div className="phone-header">
                    <span className="phone-cs-logo">CipherSchools</span>
                    <span className="phone-time">6:31</span>
                  </div>
                  <h4 className="phone-title">Select your resume's template</h4>
                  <div className="phone-template-choice active-fresher">
                    <span>Fresher</span>
                  </div>
                  <div className="phone-template-choice">
                    <span>Experienced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            5. ALUMNI INSIGHTS FEATURE BOX
            ════════════════════════════════════════════════════════════ */}
        <section className="alumni-insights-section">
          <div className="alumni-feature-card">
            
            <div className="alumni-content-side">
              <span className="alumni-eyebrow">Alumni Insights: Career Talks with Industry Expert</span>
              
              {/* Lecture Tabs */}
              <div className="alumni-lecture-tabs">
                <button 
                  className={`lecture-tab-btn ${activeLectureTab === 1 ? 'active' : ''}`}
                  onClick={() => setActiveLectureTab(1)}
                >
                  Lecture 1
                </button>
                <button 
                  className={`lecture-tab-btn ${activeLectureTab === 2 ? 'active' : ''}`}
                  onClick={() => setActiveLectureTab(2)}
                >
                  Lecture 2
                </button>
                <button 
                  className={`lecture-tab-btn ${activeLectureTab === 3 ? 'active' : ''}`}
                  onClick={() => setActiveLectureTab(3)}
                >
                  Lecture 3
                </button>
              </div>

              <h3 className="alumni-headline">
                Q & a series with our alumni: ft. harshit | sde at maq software 🚀
              </h3>

              <p className="alumni-desc">
                Welcome to another exciting edition of our 'Q&A Series with Alumni,' where we feature inspiring success stories of Cipher Schools graduates! In this episode, we are proud to introduce Harshit, a Softw..
              </p>

              <a href="#alumni" className="alumni-link-cta">
                Get Started with Alumni Insights: Career Talks with Industry Expert →
              </a>
            </div>

            {/* Video Player Card */}
            <div className="alumni-video-side">
              <div className="video-player-card">
                <div className="video-thumb-overlay">
                  <div className="video-speaker-image">👩‍💻</div>
                  <button className="video-play-btn" aria-label="Play Video">
                    <Play size={22} fill="white" color="white" />
                  </button>
                  <span className="streamyard-tag">Powered by StreamYard</span>
                  <span className="video-cs-watermark">CipherSchools</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            6. COURSES FROM PEOPLE YOU FOLLOW SECTION
            ════════════════════════════════════════════════════════════ */}
        <section className="courses-cards-section following-section">
          <div className="section-title-bar">
            <h2 className="section-heading">Courses From People You Follow</h2>
          </div>

          <div className="cards-slider-wrapper">
            <div className="cards-row" ref={followingRowRef}>
              {FOLLOWING_COURSES.map((course) => (
                <div key={course.id} className="course-card-item">
                  <div className="card-thumb-frame">
                    <CourseThumbnail type={course.thumbType} />
                  </div>

                  <div className="card-content-area">
                    <span className="card-category-tag">{course.category}</span>
                    <h3 className="course-card-title">{course.title}</h3>
                    
                    <div className="course-card-stats">
                      <span>No. of videos: <strong>{course.videosCount}</strong></span>
                      <span>Course time: <strong>{course.courseTime}</strong></span>
                    </div>

                    {course.instructor ? (
                      <div className="course-instructor-footer">
                        <div className="inst-avatar vedant-avatar-icon">
                          <span>👨‍💼</span>
                        </div>
                        <div className="inst-details">
                          <span className="inst-name">{course.instructor}</span>
                          <span className="inst-role">Creator</span>
                        </div>
                      </div>
                    ) : (
                      <div className="course-instructor-footer">
                        <div className="inst-avatar cs-avatar-icon">
                          <span>C</span>
                        </div>
                        <div className="inst-details">
                          <span className="inst-name">Cipher Schools</span>
                          <span className="inst-role">Instructor</span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>

            <button 
              className="slider-nav-arrow" 
              onClick={() => scrollContainer(followingRowRef, 'right')}
              title="Next courses"
              aria-label="Next courses"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default CoursesPage;
