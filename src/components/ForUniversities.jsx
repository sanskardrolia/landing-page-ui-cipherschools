import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle2, TrendingUp, Code2, TerminalSquare, 
  Video, ShieldCheck, ChevronRight, Users, Award, Cpu, 
  LayoutDashboard, Server, FileText, ArrowRight, Building, Play, BarChart3, Briefcase
} from 'lucide-react';
import './ForUniversities.css';

// Modern Interactive Growth Chart (SVG Line)
const InteractiveGrowthChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  const data = [
    { year: '2021', val: 35, label: '35%' },
    { year: '2022', val: 55, label: '55%' },
    { year: '2023', val: 78, label: '78%' },
    { year: '2024', val: 95, label: '95%' }
  ];

  // Map values to SVG coordinates (0-100 grid)
  const getCoords = (index, val) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - val; 
    return { x, y };
  };

  // Generate SVG path string
  let pathD = `M ${getCoords(0, data[0].val).x} ${getCoords(0, data[0].val).y}`;
  for (let i = 1; i < data.length; i++) {
    const prev = getCoords(i - 1, data[i - 1].val);
    const curr = getCoords(i, data[i].val);
    // Simple bezier curve
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }
  
  const fillPathD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="modern-chart-wrapper">
      <div className="chart-header">
        <TrendingUp className="text-primary mr-2" size={20}/>
        <h4>Placement Growth (YoY)</h4>
      </div>
      <div className="svg-chart-container" onMouseLeave={() => setHoveredPoint(null)}>
        <svg viewBox="0 0 100 100" className="interactive-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[25, 50, 75].map(line => (
             <line key={line} x1="0" y1={line} x2="100" y2={line} stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2" />
          ))}

          {/* Area Fill */}
          <path d={fillPathD} fill="url(#growthGradient)" className="chart-area-anim" />
          
          {/* Line */}
          <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2" className="chart-line-anim" />
          
          {/* Interactive Points */}
          {data.map((pt, i) => {
            const { x, y } = getCoords(i, pt.val);
            const isHovered = hoveredPoint === i;
            return (
              <g key={i} className="chart-point-group" onMouseEnter={() => setHoveredPoint(i)}>
                {isHovered && <line x1={x} y1="0" x2={x} y2="100" stroke="#E5E7EB" strokeWidth="0.5" />}
                <circle cx={x} cy={y} r={isHovered ? "4" : "2"} fill={isHovered ? "#fff" : "var(--primary)"} stroke="var(--primary)" strokeWidth={isHovered ? "1.5" : "0"} style={{transition: 'all 0.3s ease', cursor: 'pointer'}}/>
              </g>
            );
          })}
        </svg>
        
        {/* Tooltip Overlay */}
        {hoveredPoint !== null && (
          <div className="chart-tooltip" style={{ left: `${getCoords(hoveredPoint, data[hoveredPoint].val).x}%`, top: `${getCoords(hoveredPoint, data[hoveredPoint].val).y}%` }}>
            <div className="tt-val">{data[hoveredPoint].label}</div>
            <div className="tt-lbl">in {data[hoveredPoint].year}</div>
          </div>
        )}
        
        <div className="chart-x-axis">
          {data.map(d => <span key={d.year}>{d.year}</span>)}
        </div>
      </div>
    </div>
  );
};

// Modern Interactive CTC Chart (Sleek Segmented Bars)
const InteractiveCTCChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const segments = [
    { label: "Top 10%", val: 24, max: 30, color: "#10B981", desc: "Product & FAANG Roles" },
    { label: "Top 25%", val: 14, max: 30, color: "#3B82F6", desc: "Core Tech & Unicorns" },
    { label: "Average", val: 8.5, max: 30, color: "var(--primary)", desc: "Standard IT & Consulting" }
  ];

  return (
    <div className="modern-chart-wrapper">
      <div className="chart-header">
        <Briefcase className="text-primary mr-2" size={20}/>
        <h4>CTC Breakdown (LPA)</h4>
      </div>
      <div className="ctc-bars-container">
        {segments.map((seg, i) => {
          const isHovered = hoveredIndex === i;
          const widthPct = (seg.val / seg.max) * 100;
          return (
            <div 
              key={i} 
              className={`ctc-bar-row ${isHovered ? 'active' : ''}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="ctc-lbl-col">
                <span className="ctc-lbl">{seg.label}</span>
              </div>
              <div className="ctc-track-col">
                <div className="ctc-track-bg">
                  <div className="ctc-track-fill" style={{ width: `${widthPct}%`, backgroundColor: seg.color }}>
                    {isHovered && <div className="ctc-glow" style={{ boxShadow: `0 0 15px ${seg.color}` }}></div>}
                  </div>
                </div>
                {/* Floating Info on Hover */}
                <div className={`ctc-hover-info ${isHovered ? 'visible' : ''}`}>
                  {seg.desc}
                </div>
              </div>
              <div className="ctc-val-col" style={{ color: isHovered ? seg.color : '#4B5563' }}>
                {seg.val} <span className="text-xs">LPA</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ForUniversities = () => {
  const domains = [
    { name: "Generative AI", icon: <Cpu size={18}/> },
    { name: "Data Structures & Algorithms", icon: <Code2 size={18}/> },
    { name: "Full Stack Development", icon: <LayoutDashboard size={18}/> },
    { name: "Data Science", icon: <TrendingUp size={18}/> },
    { name: "Machine Learning", icon: <Server size={18}/> },
    { name: "Cloud Computing", icon: <TerminalSquare size={18}/> },
    { name: "Cyber Security", icon: <ShieldCheck size={18}/> },
    { name: "Interview Preparation", icon: <Users size={18}/> }
  ];

  return (
    <div className="b2b-page-wrapper">
      
      {/* 1. Hero Section */}
      <section className="b2b-hero section relative overflow-hidden">
        <div className="b2b-mesh-bg"></div>
        <div className="container relative z-10 text-center">
          <div className="tag cred-tag mx-auto mb-6" style={{background: 'rgba(243,145,46,0.1)', color: 'var(--primary)'}}>
            <Building size={14} className="inline mr-2"/> For Academic Institutions
          </div>
          <h1 className="b2b-hero-title">
            Your Ultimate Arm for <br/>
            <span className="text-primary">Academic & Placement Training</span>
          </h1>
          <p className="b2b-hero-subtitle">
            Integrate industry-relevant learning, assessments, coding practice, and placement preparation directly into your academic ecosystem.
          </p>
          <div className="b2b-hero-ctas">
            <button className="btn btn-primary btn-lg">Book a Demo</button>
            <button className="btn btn-outline btn-lg">Partner with Us</button>
          </div>
        </div>
      </section>

      {/* 1.5 FAANG Mentorship Strip */}
      <section className="faang-strip">
        <div className="container">
          <div className="faang-strip-content">
             <div className="fs-text">
                Offer students <strong>10+ Modern Domains</strong> with direct mentorship from leaders at
             </div>
             <div className="fs-logos">
                <img src="https://api.iconify.design/simple-icons/google.svg?color=%239CA3AF" alt="Google" className="fs-logo-img" />
                <img src="https://api.iconify.design/simple-icons/apple.svg?color=%239CA3AF" alt="Apple" className="fs-logo-img" />
                <img src="https://api.iconify.design/simple-icons/microsoft.svg?color=%239CA3AF" alt="Microsoft" className="fs-logo-img" />
                <img src="https://api.iconify.design/simple-icons/adobe.svg?color=%239CA3AF" alt="Adobe" className="fs-logo-img" />
             </div>
          </div>
        </div>
      </section>

      {/* 7 & 8. Impact & Recognition */}
      <section className="b2b-impact-section section bg-white">
        <div className="container">
          <div className="uni-card uni-bento-wide impact-block text-center">
            <div className="impact-header">
              <h3 className="impact-title">Proven Academic Impact</h3>
              <p className="impact-subtitle">We train talent. Industry hires talent.</p>
            </div>
            
            <div className="claims-panel-wide mb-12">
              <div className="claim-stat-box">
                <div className="claim-number">15,000<span className="percent">+</span></div>
                <div className="claim-label">Students Trained</div>
              </div>
              <div className="claim-divider-vertical"></div>
              <div className="claim-stat-box">
                <div className="claim-number">70-75<span className="percent">%</span></div>
                <div className="claim-label">Placement Rate</div>
              </div>
              <div className="claim-divider-vertical"></div>
              <div className="claim-stat-box">
                <div className="claim-number">50<span className="percent">+</span></div>
                <div className="claim-label">University Partners</div>
              </div>
            </div>
            
            <div className="impact-charts-container mb-12">
              <InteractiveGrowthChart />
              <InteractiveCTCChart />
            </div>

            <h4 className="logos-heading" style={{ marginTop: '5rem' }}>Where Our Students Get Placed</h4>
            <div className="placement-logos justify-center">
              <div className="p-logo">
                <img src="https://api.iconify.design/simple-icons/apple.svg?color=%239CA3AF" alt="Apple" className="p-logo-img" />
                <span>Apple</span>
              </div>
              <div className="p-logo">
                <img src="https://api.iconify.design/simple-icons/google.svg?color=%239CA3AF" alt="Google" className="p-logo-img" />
                <span>Google</span>
              </div>
              <div className="p-logo">
                <img src="https://api.iconify.design/simple-icons/adobe.svg?color=%239CA3AF" alt="Adobe" className="p-logo-img" />
                <span>Adobe</span>
              </div>
              <div className="p-logo">
                <img src="https://api.iconify.design/simple-icons/microsoft.svg?color=%239CA3AF" alt="Microsoft" className="p-logo-img" />
                <span>Microsoft</span>
              </div>
              <div className="p-logo">
                <img src="https://api.iconify.design/simple-icons/paypal.svg?color=%239CA3AF" alt="PayPal" className="p-logo-img" />
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 What We Bring On Table (Image Bento) */}
      <section className="b2b-bring-table-section section bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">What We Bring On The Table</h2>
            <p className="text-muted max-w-2xl mx-auto">Immersive experiences that go far beyond standard coursework.</p>
          </div>
          
          <div className="bento-image-grid">
            <div className="bento-img-card span-2">
              <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop" alt="Live Classes" />
              <div className="bento-img-overlay">
                <h4>Live Classes</h4>
              </div>
            </div>
            
            <div className="bento-img-card">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop" alt="Career Building Session" />
              <div className="bento-img-overlay">
                <h4>Career Building Session</h4>
              </div>
            </div>
            
            <div className="bento-img-card">
              <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop" alt="Coding Contest" />
              <div className="bento-img-overlay">
                <h4>Coding Contest</h4>
              </div>
            </div>
            
            <div className="bento-img-card span-2">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" alt="Hackathon" />
              <div className="bento-img-overlay">
                <h4>Hackathon</h4>
              </div>
            </div>
            
            <div className="bento-img-card">
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop" alt="Industry Session" />
              <div className="bento-img-overlay">
                <h4>Industry Session</h4>
              </div>
            </div>
            
            <div className="bento-img-card span-3">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" alt="Mock Interview & Resume Preparation" />
              <div className="bento-img-overlay">
                <h4>Mock Interview & Resume Preparation</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Gap Section */}
      <section className="b2b-gap-section section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Traditional Curriculum Isn't Enough</h2>
            <p className="text-muted max-w-2xl mx-auto">Bridging the massive disconnect between academic theory and day-one employability.</p>
          </div>
          <div className="gap-visual-container">
            <div className="gap-box traditional">
              <h4>Academic Theory</h4>
              <ul>
                <li><CheckCircle2 size={16}/> Outdated Syllabuses</li>
                <li><CheckCircle2 size={16}/> Rote Memorization</li>
                <li><CheckCircle2 size={16}/> Limited Hands-on Infra</li>
              </ul>
            </div>
            <div className="gap-bridge">
              <div className="bridge-line"></div>
              <div className="bridge-badge">CipherSchools Ecosystem</div>
            </div>
            <div className="gap-box industry">
              <h4>Industry Demand</h4>
              <ul>
                <li><CheckCircle2 size={16}/> Modern Tech Stacks</li>
                <li><CheckCircle2 size={16}/> Project-based Portfolios</li>
                <li><CheckCircle2 size={16}/> Day-one Deployment Ready</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Complete Training Ecosystem */}
      <section className="b2b-domains-section section bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Complete Training Ecosystem</h2>
            <p className="text-muted max-w-2xl mx-auto">Continuously updated, industry-aligned content covering every modern tech stack.</p>
          </div>
          <div className="domains-grid">
            {domains.map((domain, i) => (
              <div key={i} className="domain-bento-card">
                <div className="db-icon text-primary">{domain.icon}</div>
                <div className="db-name">{domain.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How We Train */}
      <section className="b2b-how-we-train section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">How We Train</h2>
            <p className="text-muted max-w-2xl mx-auto">A structured, hands-on path ensuring students are prepared for their desired companies.</p>
          </div>
          
          <div className="hwt-grid-path">
             <div className="hwt-card">
                <div className="hwt-step-num">01</div>
                <div className="hwt-icon-wrapper"><BookOpen size={28}/></div>
                <h4>Domain Foundation</h4>
                <p>Mastering core concepts and modern tech stacks.</p>
             </div>
             <div className="hwt-card">
                <div className="hwt-step-num">02</div>
                <div className="hwt-icon-wrapper"><TerminalSquare size={28}/></div>
                <h4>Online Assessments</h4>
                <p>Proctored coding rounds matching industry standards.</p>
             </div>
             <div className="hwt-card">
                <div className="hwt-step-num">03</div>
                <div className="hwt-icon-wrapper"><FileText size={28}/></div>
                <h4>Mock Tests</h4>
                <p>Rigorous test series to build speed and accuracy.</p>
             </div>
             <div className="hwt-card">
                <div className="hwt-step-num">04</div>
                <div className="hwt-icon-wrapper"><Users size={28}/></div>
                <h4>Mock Interviews</h4>
                <p>1-on-1 technical and HR interview simulations.</p>
             </div>
          </div>

          <div className="hwt-disclaimer" style={{ marginTop: '5rem' }}>
             <h4 className="text-center section-title mb-8">Our Transparent Commitment</h4>
             <div className="commitment-visual-split">
                
                {/* What We Do */}
                <div className="commitment-box we-do">
                   <div className="c-tag">The CipherSchools Ecosystem</div>
                   <ul className="c-list">
                     <li><CheckCircle2 size={20}/> We Train</li>
                     <li><CheckCircle2 size={20}/> We Support</li>
                     <li><CheckCircle2 size={20}/> We Give Credible Results</li>
                   </ul>
                </div>
                
                {/* The Connective Tissue */}
                <div className="commitment-vs">
                   <div className="vs-circle">+</div>
                </div>
                
                {/* What the Student Does */}
                <div className="commitment-box they-do">
                   <div className="c-tag student-tag">The Student's Muscle</div>
                   <div className="c-student-visual">
                      <Users size={32} className="text-primary mx-auto mb-3"/>
                      <p>Ultimately, cracking the company interview requires the individual muscle, dedication, and effort of the student.</p>
                   </div>
                </div>

             </div>
          </div>
        </div>
      </section>

      {/* 5. LMS Infra */}
      <section className="b2b-infra-section section bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">Integrated Learning Infrastructure</h2>
            <p className="text-muted max-w-2xl mx-auto">Zero infrastructure setup. Deploy an enterprise-grade learning platform overnight.</p>
          </div>
          
          <div className="infra-bento-grid">
            
            {/* LMS Block */}
            <div className="infra-card lms-block bg-white w-full">
              <div className="infra-card-header">
                <h3>Integrated LMS</h3>
                <p>Semester-wise curriculum mapping with faculty analytics.</p>
              </div>
              <div className="lms-ui-stack mt-6">
                <div className="lms-ui-card">
                  <div className="lms-ui-icon-box"><Video className="text-primary" size={16}/></div>
                  <div className="lms-ui-details">
                    <div className="lms-ui-title">Video Based Learning</div>
                    <div className="lms-ui-sub">Structured curriculums & tracking</div>
                  </div>
                </div>
                <div className="lms-ui-card">
                  <div className="lms-ui-icon-box"><ShieldCheck className="text-primary" size={16}/></div>
                  <div className="lms-ui-details">
                    <div className="lms-ui-title">Proctored Assessments</div>
                    <div className="lms-ui-sub">Automated grading & insights</div>
                  </div>
                </div>
                <div className="lms-ui-card">
                  <div className="lms-ui-icon-box"><BarChart3 className="text-primary" size={16}/></div>
                  <div className="lms-ui-details">
                    <div className="lms-ui-title">Faculty Dashboard</div>
                    <div className="lms-ui-sub">Real-time student progress reports</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 9 & 10. Why Partner & Models */}
      <section className="b2b-models-section section bg-gray-50">
        <div className="container">
          <div className="why-partner-models-split">
            <div className="why-partner-container">
              <h3 className="section-subtitle">Why Partner With Us?</h3>
              <div className="why-partner-list">
                <div className="why-partner-item">
                  <CheckCircle2 className="text-primary wp-icon"/> 
                  <p><strong>Outcome-Focused Approach:</strong> Designed entirely around placement success.</p>
                </div>
                <div className="why-partner-item">
                  <CheckCircle2 className="text-primary wp-icon"/> 
                  <p><strong>Faculty Enablement:</strong> Powerful dashboards to monitor and guide student cohorts.</p>
                </div>
                <div className="why-partner-item">
                  <CheckCircle2 className="text-primary wp-icon"/> 
                  <p><strong>Scalable Implementation:</strong> Plug-and-play architecture for any semester structure.</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="section-subtitle">Partnership Models</h3>
              <div className="b2b-model-cards">
                <div className="model-card">Center of Excellence Collaborations</div>
                <div className="model-card">Placement Preparation Programs</div>
                <div className="model-card">Academic Training Integration</div>
                <div className="model-card">Technology Upskilling Initiatives</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ForUniversities;
