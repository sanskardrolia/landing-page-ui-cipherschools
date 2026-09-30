import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Save, 
  Layers, 
  Edit3, 
  Eye, 
  X, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  ExternalLink,
  ChevronRight,
  Zap
} from 'lucide-react';
import './ResumePage.css';

// ── Recruiter-Approved ATS Templates Data ──
// ── Recruiter-Approved ATS Templates Data (Matching Screenshot 2) ──
const TEMPLATES = [
  {
    id: 'beginner',
    title: 'Beginner Template',
    badgeText: '🔰 Beginner:',
    description: 'Perfect for students and freshers starting their career journey.',
    sampleCandidate: 'Anurag Mishra'
  },
  {
    id: 'experienced',
    title: 'Experienced Template',
    badgeText: 'Experienced:',
    description: 'Ideal for those with internships, projects, or job experience.',
    sampleCandidate: 'Cipher Schools'
  },
  {
    id: 'modern',
    title: 'Modern Template',
    badgeText: '📝 Modern:',
    description: 'Sleek and clean design, suitable for both beginners & experienced',
    sampleCandidate: 'John Doe'
  }
];

const ResumePage = () => {
  const navigate = useNavigate();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Interactive Live Builder Modal State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('beginner');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Resume Form Data (Pre-filled from learner profile)
  const [formData, setFormData] = useState({
    fullName: 'Sanskar Drolia',
    role: 'Senior Full-Stack Engineer',
    email: 'sanskar.drolia@cipherschools.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/sanskardrolia',
    github: 'github.com/sanskardrolia',
    summary: 'Results-driven software engineer with 3+ years of experience architecting high-concurrency web applications, microservices, and interactive developer sandboxes. Passionate about algorithms, modern UI, and distributed cloud systems.',
    skills: 'React.js, Node.js, TypeScript, Python, Next.js, PostgreSQL, Docker, AWS, DSA, System Design',
    experienceCompany: 'CipherSchools Technologies',
    experienceRole: 'Full-Stack Developer',
    experienceDuration: '2023 - Present',
    experienceBullet1: 'Engineered high-performance real-time interactive sandboxes scaling to 100K+ concurrent learners with sub-50ms latency.',
    experienceBullet2: 'Spearheaded frontend migration to Next.js 15, improving Core Web Vitals and Lighthouse performance scores by 42%.',
    educationDegree: 'B.Tech in Computer Science & Engineering',
    educationSchool: 'National Institute of Technology',
    educationYear: '2020 - 2024 • CGPA: 8.9/10'
  });

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 900);
  };

  return (
    <div className="resume-page-root">
      <div className="resume-container">

        {/* ─────────────────────────────────────────────────────────────
            SECTION 1: HERO SECTION
            Exact Copy: "Make an ATS-Friendly Resume in Minutes"
            "Craft a resume for free and get one step closer to your dream job with our ATS-friendly templates."
            Buttons: "Build new Resume" & "My Resumes →"
            Visual: Editor Interface + Ankit Sharma Resume + "ATS Friendly" badge
           ───────────────────────────────────────────────────────────── */}
        <section className="resume-hero-section">
          <div className="resume-hero-grid">
            
            {/* Left Column: Hero Text & Actions */}
            <div className="resume-hero-content">
              <h1 className="resume-hero-title">
                Make an ATS-Friendly <span className="headline-gradient">Resume in Minutes</span>
              </h1>

              <p className="resume-hero-subtitle">
                Craft a resume for free and get one step closer to your dream job with our ATS-friendly templates.
              </p>

              <div className="resume-hero-cta-row">
                <button 
                  type="button" 
                  className="resume-primary-btn"
                  onClick={() => setIsBuilderOpen(true)}
                >
                  <Edit3 size={17} />
                  <span>Build new Resume</span>
                </button>

                <button 
                  type="button" 
                  className="resume-secondary-link"
                  onClick={() => setIsBuilderOpen(true)}
                >
                  <span>My Resumes</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Trust Pillars Bar */}
              <div className="resume-trust-stats-row">
                <div className="trust-stat-item">
                  <strong>98.4%</strong>
                  <span>ATS Pass Rate</span>
                </div>
                <div className="trust-stat-divider" />
                <div className="trust-stat-item">
                  <strong>250K+</strong>
                  <span>Resumes Built</span>
                </div>
                <div className="trust-stat-divider" />
                <div className="trust-stat-item">
                  <strong>100% Free</strong>
                  <span>No Watermark</span>
                </div>
              </div>

            </div>

            {/* Right Column: Clean & Minimal ATS Resume Preview */}
            <div className="resume-hero-visual-wrap">
              <div className="hero-clean-resume-wrapper">
                
                {/* Clean Subtle Sheet Header Bar */}
                <div className="resume-sheet-bar">
                  <div className="sheet-bar-left">
                    <FileText size={15} className="text-orange-500" />
                    <span className="sheet-bar-filename">Ankit_Sharma_Resume.pdf</span>
                  </div>
                  <div className="sheet-bar-right">
                    <span className="clean-ats-tag">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      <span>99% ATS Pass Rate</span>
                    </span>
                  </div>
                </div>

                {/* Clean White A4 Sheet Preview */}
                <div className="hero-clean-paper">
                  
                  {/* Candidate Header */}
                  <div className="clean-paper-header">
                    <h3 className="clean-paper-name">Ankit Sharma</h3>
                    <p className="clean-paper-role">Senior Full-Stack Engineer</p>
                    <p className="clean-paper-contacts">
                      Bengaluru, India • ankit.sharma@cipherschools.com • +91 98765 43210
                    </p>
                    <p className="clean-paper-links">
                      linkedin.com/in/ankit-dev • github.com/ankit-dev
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="clean-paper-section">
                    <h4 className="clean-sec-title">PROFESSIONAL SUMMARY</h4>
                    <div className="clean-sec-divider" />
                    <p className="clean-sec-body">
                      Full-Stack Software Engineer with 4+ years of experience designing scalable microservices, high-concurrency cloud systems, and responsive web platforms. Proficient in React, Node.js, distributed databases, and CI/CD pipelines.
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="clean-paper-section">
                    <h4 className="clean-sec-title">WORK EXPERIENCE</h4>
                    <div className="clean-sec-divider" />
                    
                    <div className="clean-exp-block">
                      <div className="clean-exp-head">
                        <strong>Senior Software Engineer — TechCorp Global</strong>
                        <span className="clean-exp-date">2022 – Present</span>
                      </div>
                      <ul className="clean-exp-list">
                        <li>Architected high-throughput microservices handling 25M+ daily requests with 99.98% uptime.</li>
                        <li>Spearheaded web platform performance optimizations, cutting bundle size by 38% and boosting Lighthouse scores to 98+.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Technical Skills */}
                  <div className="clean-paper-section">
                    <h4 className="clean-sec-title">TECHNICAL SKILLS</h4>
                    <div className="clean-sec-divider" />
                    <p className="clean-skills-line">
                      <strong>Core Languages & Frameworks:</strong> React, Next.js, Node.js, TypeScript, Python, PostgreSQL, Redis, Docker, AWS
                    </p>
                  </div>

                  {/* Education */}
                  <div className="clean-paper-section">
                    <h4 className="clean-sec-title">EDUCATION</h4>
                    <div className="clean-sec-divider" />
                    <div className="clean-exp-head">
                      <strong>B.Tech in Computer Science & Engineering</strong>
                      <span className="clean-exp-date">2018 – 2022</span>
                    </div>
                    <p className="clean-edu-sub">National Institute of Technology • CGPA: 8.9 / 10</p>
                  </div>

                </div>

                {/* Single Clean, Tasteful Floating Badge */}
                <div className="clean-floating-ats-pill">
                  <span className="ats-dot" />
                  <span>ATS Friendly</span>
                </div>

              </div>
            </div>

          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────────
            SECTION 2: WHY CHOOSE CIPHERSCHOOLS RESUME BUILDER?
            Shifted above "Select the Template to Create your Resume"
           ───────────────────────────────────────────────────────────── */}
        <section className="resume-why-choose-section">
          <div className="why-choose-header">
            <h2 className="section-title-large">
              Why Choose CipherSchools Resume Builder?
            </h2>
            <p className="section-subtitle">
              Create a professional resume in three simple steps: select a template, fill in your details, and download your ATS-friendly resume ready to impress recruiters and hiring systems.
            </p>
          </div>

          <div className="why-choose-cards-grid">
            
            {/* Feature 1 */}
            <div className="why-feature-card">
              <div className="feature-icon-badge">
                <Save size={20} className="text-orange-500" />
              </div>
              <h3 className="feature-card-title">Auto-Save Progress</h3>
              <p className="feature-card-desc">
                Never lose your work, your resume is saved in real time once you create an account.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="why-feature-card">
              <div className="feature-icon-badge">
                <ShieldCheck size={20} className="text-orange-500" />
              </div>
              <h3 className="feature-card-title">ATS-Friendly Templates</h3>
              <p className="feature-card-desc">
                Designed to pass through Applicant Tracking Systems used by top companies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="why-feature-card">
              <div className="feature-icon-badge">
                <Download size={20} className="text-orange-500" />
              </div>
              <h3 className="feature-card-title">Free PDF Export</h3>
              <p className="feature-card-desc">
                Download your professional resume in high-quality PDF format absolutely free.
              </p>
            </div>

          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────────
            SECTION 3: SELECT THE TEMPLATE TO CREATE YOUR RESUME
            Exact Title from Screenshot 2: "Select the Template to Create your Resume"
           ───────────────────────────────────────────────────────────── */}
        <section className="resume-templates-section">
          <h2 className="template-picker-title">Select the Template to Create your Resume</h2>

          <div className="template-picker-grid">
            
            {/* Column 1: Beginner */}
            <div className="template-picker-column">
              <div className="template-desc-banner">
                <span className="banner-prefix">🔰 Beginner:</span>
                <span className="banner-desc">Perfect for students and freshers starting their career journey.</span>
              </div>

              <div 
                className={`template-sheet-card ${selectedTemplate === 'beginner' ? 'card-selected' : ''}`}
                onClick={() => setSelectedTemplate('beginner')}
              >
                <div className="template-sheet-viewport sheet-beginner">
                  {/* Header */}
                  <div className="anurag-sheet-head">
                    <h4 className="anurag-title">Anurag Mishra</h4>
                    <p className="anurag-sub">
                      abc@xyz.com &bull; XYZ, ABC MAIN &bull; 000-000-0000 &bull; Cipher &bull; Cipher
                    </p>
                  </div>

                  {/* Academic Details */}
                  <div className="anurag-section">
                    <div className="anurag-bar-title">ACADEMIC DETAILS</div>
                    <table className="anurag-data-table">
                      <thead>
                        <tr>
                          <th>Examination</th>
                          <th>University</th>
                          <th>Institute</th>
                          <th>Year</th>
                          <th>CPI/%</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Post Graduate Specialization</td>
                          <td>Computer Science and Engineering</td>
                          <td>IIT Bombay</td>
                          <td>2014</td>
                          <td>8.5</td>
                        </tr>
                        <tr>
                          <td>Post Graduation</td>
                          <td>Computer Science and Engineering</td>
                          <td>IIT Bombay</td>
                          <td>2014</td>
                          <td>8.5</td>
                        </tr>
                        <tr>
                          <td>Under Graduate Specialization</td>
                          <td>Computer Engineering</td>
                          <td>IET, DAVV, Indore</td>
                          <td>2012</td>
                          <td>76.5</td>
                        </tr>
                        <tr>
                          <td>Graduation</td>
                          <td>DAVV, Indore</td>
                          <td>IET, DAVV, Indore</td>
                          <td>2012</td>
                          <td>76.5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Fields of Interest */}
                  <div className="anurag-section">
                    <div className="anurag-bar-title">FIELDS OF INTEREST</div>
                    <p className="anurag-bullet-p">&bull; Wireless Network and Network Security, Another one, a third one</p>
                  </div>

                  {/* Technical Skills */}
                  <div className="anurag-section">
                    <div className="anurag-bar-title">TECHNICAL SKILLS</div>
                    <p className="anurag-bullet-p">
                      &bull; <strong>Languages:</strong> (C, C++, Java) &bull; <strong>Database:</strong> (MySQL) Script: (Python, Shell, Perl, R) Tools: (Eclipse, LaTeX, Gnuplot, etc)
                    </p>
                  </div>

                  {/* Major Projects and Seminar */}
                  <div className="anurag-section">
                    <div className="anurag-bar-title">MAJOR PROJECTS AND SEMINAR</div>
                    <div className="anurag-proj-row">
                      <span className="proj-title">Media Access Control Contending (Research Project)</span>
                      <span className="proj-guide">Guide: Prof. John Doe, May '13 - Jul '14</span>
                    </div>
                    <ul className="anurag-proj-bullets">
                      <li>Objective: Performance analysis of HTTP web browsing traffic.</li>
                      <li>Performance analysis will help in comparing different MAC protocols based on different network scenarios.</li>
                      <li>Studied various papers related to different MAC protocols and now working on improving simulations.</li>
                    </ul>

                    <div className="anurag-proj-row mt-1">
                      <span className="proj-title">Second Item (M. Tech. Seminar)</span>
                      <span className="proj-guide">Guide: Prof. John Doe, Jun '14 - Aug '14</span>
                    </div>
                    <ul className="anurag-proj-bullets">
                      <li>First edition.</li>
                      <li>Second edition.</li>
                    </ul>
                  </div>

                  {/* Strengths */}
                  <div className="anurag-section">
                    <div className="anurag-bar-title">STRENGTHS</div>
                    <p className="anurag-bullet-p">&bull; Positive Attitude, Social Interaction, Hardworking.</p>
                  </div>

                  {/* Interest and Hobbies */}
                  <div className="anurag-section">
                    <div className="anurag-bar-title">INTEREST AND HOBBIES</div>
                    <p className="anurag-bullet-p">&bull; Solving Puzzles.</p>
                    <p className="anurag-bullet-p">&bull; Playing Chess.</p>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="template-select-solid-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate('beginner');
                    setIsBuilderOpen(true);
                  }}
                >
                  Select Template
                </button>
              </div>
            </div>

            {/* Column 2: Experienced */}
            <div className="template-picker-column">
              <div className="template-desc-banner">
                <span className="banner-prefix">Experienced:</span>
                <span className="banner-desc">Ideal for those with internships, projects, or job experience.</span>
              </div>

              <div 
                className={`template-sheet-card ${selectedTemplate === 'experienced' ? 'card-selected' : ''}`}
                onClick={() => setSelectedTemplate('experienced')}
              >
                <div className="template-sheet-viewport sheet-experienced">
                  {/* Header */}
                  <div className="cs-sheet-head">
                    <div className="cs-brand-side">
                      <h4 className="cs-brand-name">Cipher Schools</h4>
                      <div className="cs-brand-sub">&bull; Cipher</div>
                    </div>
                    <div className="cs-contact-side">
                      <div>abc@xyz.com</div>
                      <div>000-000-0000</div>
                      <div>XYZ, ABC MAIN</div>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="cs-section">
                    <div className="cs-heading-underlined">EDUCATION</div>
                    <div className="cs-split-info">
                      <span className="cs-school">Netaji Subhash Engineering College</span>
                      <span className="cs-city">Kolkata, India</span>
                    </div>
                    <div className="cs-split-info cs-italics">
                      <span>Bachelor of Technology - Information Technology, GPA: 7.9</span>
                      <span>July 2014 - June 2018</span>
                    </div>
                    <p className="cs-coursework-text">
                      Coursework: Operating Systems, Data Structures, Analysis Of Algorithms, Artificial Intelligence, Machine Learning, Networking, Databases
                    </p>
                  </div>

                  {/* Skills Summary */}
                  <div className="cs-section">
                    <div className="cs-heading-underlined">SKILLS SUMMARY</div>
                    <p className="cs-skill-row">&bull; <strong>Languages:</strong> Python, PHP, C++, JavaScript, SQL, Bash, JAVA</p>
                    <p className="cs-skill-row">&bull; <strong>Frameworks:</strong> SCADA, NLTK, OpenCV, TensorFlow, Keras, Django, Flask, NodeJS, LAMP</p>
                    <p className="cs-skill-row">&bull; <strong>Tools:</strong> Kubernetes, Docker, GIT, PostgreSQL, MySQL, SQLite</p>
                    <p className="cs-skill-row">&bull; <strong>Platforms:</strong> Linux, Web, Windows, Arduino, Raspberry PI, AWS, GCP, Alibaba Cloud</p>
                    <p className="cs-skill-row">&bull; <strong>Soft Skills:</strong> Leadership, Event Management, Writing, Public Speaking, Time Management</p>
                  </div>

                  {/* Experience */}
                  <div className="cs-section">
                    <div className="cs-heading-underlined">EXPERIENCE</div>
                    <div className="cs-split-info">
                      <span className="cs-org">Google Summer of Code - Submitty</span>
                      <span className="cs-dates">May 2019 - Sep 2019</span>
                    </div>
                    <div className="cs-split-info cs-italics">
                      <span>Student Developer (Full-time)</span>
                      <span>Rensselaer, NY</span>
                    </div>
                    <ul className="cs-bullet-list">
                      <li>Discussion Forum Upgrades: Redactor forum for performance to handle large databases</li>
                      <li>REST API for Discussion Forum: Synced w/ Twig, based form-parts converted to API-first interact</li>
                      <li>Re-architect PHP WebSocket: Implemented a WebSocket for low-latency real-time exchange of posts and thread updates</li>
                    </ul>

                    <div className="cs-split-info mt-1">
                      <span className="cs-org">DataCamp Inc.</span>
                      <span className="cs-dates">Dec 2018 - Present</span>
                    </div>
                    <div className="cs-split-info cs-italics">
                      <span>Instructor (Part-time, Contractual)</span>
                      <span>Remote</span>
                    </div>
                    <ul className="cs-bullet-list">
                      <li>Project Course - Find Movie Similarity from Plot Summaries: Created project-based course using Unsupervised learning and natural language processing</li>
                    </ul>
                  </div>

                  {/* Projects */}
                  <div className="cs-section">
                    <div className="cs-heading-underlined">PROJECTS</div>
                    <p className="cs-proj-p">&bull; <strong>Vision</strong> - multimedia search engine (NLP, Search Engine, Web Crawlers, Multimedia Processing)</p>
                    <p className="cs-proj-p">&bull; <strong>Reinforcement Learning based Traffic Control System</strong> (Reinforcement Learning, Computer Vision)</p>
                    <p className="cs-proj-p">&bull; <strong>Panorama from Satellite Imagery using Distributed Computing</strong> (Distributed Computing, Image Processing)</p>
                  </div>

                  {/* Publications */}
                  <div className="cs-section">
                    <div className="cs-heading-underlined">PUBLICATIONS</div>
                    <p className="cs-proj-p">&bull; Book: Deep Learning on Web (Web Development, Deep Learning) Work in Progress book to be published</p>
                  </div>

                  {/* Honors and Awards */}
                  <div className="cs-section">
                    <div className="cs-heading-underlined">HONORS AND AWARDS</div>
                    <p className="cs-proj-p">&bull; Awarded title of Intel Software Innovator - May 2019</p>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="template-select-solid-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate('experienced');
                    setIsBuilderOpen(true);
                  }}
                >
                  Select Template
                </button>
              </div>
            </div>

            {/* Column 3: Modern */}
            <div className="template-picker-column">
              <div className="template-desc-banner">
                <span className="banner-prefix">📝 Modern:</span>
                <span className="banner-desc">Sleek and clean design, suitable for both beginners & experienced</span>
              </div>

              <div 
                className={`template-sheet-card ${selectedTemplate === 'modern' ? 'card-selected' : ''}`}
                onClick={() => setSelectedTemplate('modern')}
              >
                <div className="template-sheet-viewport sheet-modern">
                  {/* Header */}
                  <div className="modern-title-wrap">
                    <h4 className="modern-candidate-name">John Doe</h4>
                    <p className="modern-candidate-sub">0000 000000 &bull; fake@gmail.com</p>
                  </div>

                  {/* 2-Column Split */}
                  <div className="modern-two-columns">
                    
                    {/* Left Column */}
                    <div className="modern-left-pane">
                      <div className="modern-group">
                        <div className="modern-head-label">Education</div>
                        <div className="modern-school-name">UNIVERSITY OF LEEDS</div>
                        <div className="modern-degree-text">MS IN DATA SCIENCE / ANALYSIS</div>
                        <div className="modern-date-tag">Sep 2021 - Aug 2022</div>
                        <ul className="modern-bullet-list">
                          <li>International Masters Excellence Scholarship</li>
                          <li>Expecting a first class degree</li>
                        </ul>
                      </div>

                      <div className="modern-group">
                        <div className="modern-head-label">Links</div>
                        <div className="modern-link-line">&bull; GitHub: /themagicalmammal</div>
                        <div className="modern-link-line">&bull; LinkedIn: /themagicalmammal</div>
                      </div>

                      <div className="modern-group">
                        <div className="modern-head-label">Coursework</div>
                        <div className="modern-sub-tier">GRADUATE</div>
                        <div className="modern-sub-item">Data Science</div>
                        <div className="modern-sub-item">Programming for Data Science</div>
                        <div className="modern-sub-tier mt-1">UNDERGRADUATE</div>
                        <div className="modern-sub-item">Machine Learning</div>
                        <div className="modern-sub-item">Statistical Theory and Methods</div>
                      </div>

                      <div className="modern-group">
                        <div className="modern-head-label">Skills</div>
                        <div className="modern-sub-tier">PROGRAMMING</div>
                        <div className="modern-sub-item">Python &bull; PHP &bull; C/C++ &bull; HTML/CSS</div>
                        <div className="modern-sub-item">JavaScript &bull; SQL</div>
                      </div>

                      <div className="modern-group">
                        <div className="modern-head-label">Honors</div>
                        <div className="modern-school-name">EXCELLENCE SCHOLARSHIP</div>
                        <div className="modern-sub-item">University of Leeds</div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="modern-right-pane">
                      <div className="modern-group">
                        <div className="modern-head-label">Experience</div>
                        
                        <div className="modern-job-entry">
                          <div className="modern-role-title">SOFTWARE ENGINEER</div>
                          <div className="modern-company-text">Raja Ramanna Centre for Advanced Technology</div>
                          <ul className="modern-bullet-list">
                            <li>Using Vibo to crack the accuracy of low light situations in mobile level 3.</li>
                            <li>Using Bash scripts and Linux tools to automate and optimize the data handling for traffic apps.</li>
                          </ul>
                        </div>

                        <div className="modern-job-entry mt-1">
                          <div className="modern-role-title">MACHINE LEARNING INTERN</div>
                          <div className="modern-company-text">Raja Ramanna Centre for Advanced Technology</div>
                          <ul className="modern-bullet-list">
                            <li>Using Genetic algorithm designed a model to detect the crossover/mutation in gene which is portable for scheduling scenarios.</li>
                          </ul>
                        </div>

                        <div className="modern-job-entry mt-1">
                          <div className="modern-role-title">WEB DEVELOPMENT INTERN</div>
                          <ul className="modern-bullet-list">
                            <li>Designed the dynamic website using PHP for the data visualization (Angular 4 and Node.js) of particle accelerator for internal usage.</li>
                            <li>Using Django to connect with SQL backend with SQL Server 2012.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="modern-group">
                        <div className="modern-head-label">Recent Projects</div>
                        <div className="modern-job-entry">
                          <div className="modern-role-title">STUDY OF THE BEHAVIOUR OF SERIAL KILLERS</div>
                          <div className="modern-company-text">A project under the University of Leeds to analyze data from 2000 to 2015 and discover patterns in the data such as trends, correlations, probabilities.</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <button 
                  type="button" 
                  className="template-select-solid-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate('modern');
                    setIsBuilderOpen(true);
                  }}
                >
                  Select Template
                </button>
              </div>
            </div>

          </div>
        </section>





        {/* ─────────────────────────────────────────────────────────────
            SECTION 4: SKILL LEVEL-UP BANNER
            Exact Copy: "Want to level up your skills? 🚀"
            "Stand out to recruiters by adding industry-relevant skills and making your resume truly job-ready. Let your skills speak!"
           ───────────────────────────────────────────────────────────── */}
        <section className="resume-level-up-banner">
          <div className="level-up-banner-content">
            <div className="level-up-text-side">
              <h3 className="level-up-title">
                Want to level up your skills? 🚀
              </h3>
              <p className="level-up-desc">
                Stand out to recruiters by adding industry-relevant skills and making your resume truly job-ready. Let your skills speak!
              </p>
              <button 
                type="button" 
                className="level-up-courses-btn"
                onClick={() => navigate('/courses')}
              >
                <span>Explore Free Courses</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Bullseye / Target Vector Graphic */}
            <div className="level-up-graphic-side">
              <svg width="140" height="110" viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Target concentric rings */}
                <circle cx="80" cy="65" r="50" fill="#FFFFFF" fillOpacity="0.12" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="80" cy="65" r="36" fill="#FFFFFF" fillOpacity="0.2" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="80" cy="65" r="22" fill="#FFFFFF" fillOpacity="0.4" />
                <circle cx="80" cy="65" r="10" fill="#FFFFFF" />
                {/* Dart Arrow hitting Bullseye */}
                <path d="M125 25 L83 62" stroke="#FFEDD5" strokeWidth="3.5" strokeLinecap="round" />
                <polygon points="80,65 92,60 88,54" fill="#FFEDD5" />
              </svg>
            </div>
          </div>
        </section>





        {/* ─────────────────────────────────────────────────────────────
            INTERACTIVE LIVE BUILDER MODAL
            Allows learners to test and customize their resume live!
           ───────────────────────────────────────────────────────────── */}
        {isBuilderOpen && (
          <div className="builder-modal-overlay animate-fade-in" role="dialog" aria-modal="true">
            <div className="builder-modal-container">
              
              {/* Modal Top Bar */}
              <div className="builder-modal-header">
                <div className="builder-modal-title-row">
                  <div className="builder-header-icon">
                    <FileText size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="builder-header-name">CipherSchools ATS Resume Builder</h3>
                    <span className="builder-header-sub">
                      Template: {TEMPLATES.find(t => t.id === selectedTemplate)?.title} • 99% ATS Pass Rate
                    </span>
                  </div>
                </div>

                <div className="builder-modal-actions">
                  <button 
                    type="button" 
                    className="builder-download-btn"
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <span>Generating PDF...</span>
                    ) : downloadSuccess ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Downloaded!</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>Download ATS PDF</span>
                      </>
                    )}
                  </button>

                  <button 
                    type="button" 
                    className="builder-close-btn"
                    onClick={() => setIsBuilderOpen(false)}
                    aria-label="Close Builder"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content: Split Edit & Preview */}
              <div className="builder-modal-body">
                
                {/* Form Controls Sidebar */}
                <div className="builder-form-pane">
                  <div className="form-pane-intro">
                    <span className="pane-tag">EDIT DETAILS</span>
                    <h4>Personal & Experience Details</h4>
                  </div>

                  <div className="builder-fields-scroll">
                    
                    <div className="builder-field-wrap">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        value={formData.fullName} 
                        onChange={(e) => handleInputChange('fullName', e.target.value)} 
                        className="builder-input"
                      />
                    </div>

                    <div className="builder-field-wrap">
                      <label>Target Role / Headline</label>
                      <input 
                        type="text" 
                        value={formData.role} 
                        onChange={(e) => handleInputChange('role', e.target.value)} 
                        className="builder-input"
                      />
                    </div>

                    <div className="builder-row-two">
                      <div className="builder-field-wrap">
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => handleInputChange('email', e.target.value)} 
                          className="builder-input"
                        />
                      </div>
                      <div className="builder-field-wrap">
                        <label>Phone Number</label>
                        <input 
                          type="text" 
                          value={formData.phone} 
                          onChange={(e) => handleInputChange('phone', e.target.value)} 
                          className="builder-input"
                        />
                      </div>
                    </div>

                    <div className="builder-field-wrap">
                      <label>Professional Summary</label>
                      <textarea 
                        rows={3} 
                        value={formData.summary} 
                        onChange={(e) => handleInputChange('summary', e.target.value)} 
                        className="builder-textarea"
                      />
                    </div>

                    <div className="builder-field-wrap">
                      <label>Technical Skills (Comma-separated)</label>
                      <input 
                        type="text" 
                        value={formData.skills} 
                        onChange={(e) => handleInputChange('skills', e.target.value)} 
                        className="builder-input"
                      />
                    </div>

                    <div className="builder-field-wrap">
                      <label>Work Experience</label>
                      <input 
                        type="text" 
                        placeholder="Company Name"
                        value={formData.experienceCompany} 
                        onChange={(e) => handleInputChange('experienceCompany', e.target.value)} 
                        className="builder-input mb-2"
                      />
                      <textarea 
                        rows={2}
                        placeholder="Key Impact / Achievement"
                        value={formData.experienceBullet1} 
                        onChange={(e) => handleInputChange('experienceBullet1', e.target.value)} 
                        className="builder-textarea"
                      />
                    </div>

                    <div className="builder-field-wrap">
                      <label>Education</label>
                      <input 
                        type="text" 
                        value={formData.educationDegree} 
                        onChange={(e) => handleInputChange('educationDegree', e.target.value)} 
                        className="builder-input mb-1"
                      />
                      <input 
                        type="text" 
                        value={formData.educationSchool} 
                        onChange={(e) => handleInputChange('educationSchool', e.target.value)} 
                        className="builder-input"
                      />
                    </div>

                  </div>
                </div>

                {/* Live Real-time A4 PDF Sheet Preview */}
                <div className="builder-preview-pane">
                  <div className="preview-pane-header">
                    <span>LIVE ATS PREVIEW (A4)</span>
                    <span className="ats-compliance-tag">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span>100% Parser Compliant</span>
                    </span>
                  </div>

                  <div className="a4-resume-sheet">
                    <div className="sheet-header">
                      <h1 className="sheet-name">{formData.fullName || 'Your Name'}</h1>
                      <div className="sheet-role">{formData.role || 'Target Role'}</div>
                      <div className="sheet-contacts">
                        <span>{formData.location}</span>
                        <span>•</span>
                        <span>{formData.email}</span>
                        <span>•</span>
                        <span>{formData.phone}</span>
                      </div>
                      <div className="sheet-links">
                        <span>{formData.linkedin}</span>
                        <span>•</span>
                        <span>{formData.github}</span>
                      </div>
                    </div>

                    <div className="sheet-section">
                      <h2 className="sheet-sec-title">PROFESSIONAL SUMMARY</h2>
                      <div className="sheet-sec-line" />
                      <p className="sheet-text">{formData.summary}</p>
                    </div>

                    <div className="sheet-section">
                      <h2 className="sheet-sec-title">TECHNICAL COMPETENCIES</h2>
                      <div className="sheet-sec-line" />
                      <p className="sheet-text">
                        <strong>Core Technologies:</strong> {formData.skills}
                      </p>
                    </div>

                    <div className="sheet-section">
                      <h2 className="sheet-sec-title">PROFESSIONAL EXPERIENCE</h2>
                      <div className="sheet-sec-line" />
                      <div className="sheet-exp-header">
                        <strong>{formData.experienceRole} — {formData.experienceCompany}</strong>
                        <span className="sheet-exp-date">{formData.experienceDuration}</span>
                      </div>
                      <ul className="sheet-bullets">
                        <li>{formData.experienceBullet1}</li>
                        <li>{formData.experienceBullet2}</li>
                      </ul>
                    </div>

                    <div className="sheet-section">
                      <h2 className="sheet-sec-title">EDUCATION</h2>
                      <div className="sheet-sec-line" />
                      <div className="sheet-exp-header">
                        <strong>{formData.educationDegree}</strong>
                        <span className="sheet-exp-date">Graduated</span>
                      </div>
                      <p className="sheet-school">{formData.educationSchool} • {formData.educationYear}</p>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResumePage;
