import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Crown, Sparkles, Check, Flame, Coffee, Zap, ShieldCheck, 
  ArrowRight, ChevronDown, ChevronUp, Star, Award, CheckCircle2,
  Clock, X, Heart, HelpCircle, Code2, Terminal, Bot, Laptop,
  RotateCcw, PlayCircle, Unlock, RefreshCw, BookOpen, Layers
} from 'lucide-react';
import './PremiumPage.css';

/* ── 6-Month Plans Data (Standard Full Runway) ── */
const PLANS_6M_DATA = [
  {
    id: 'starter',
    name: 'Starter',
    badge: 'ESSENTIAL FOUNDATION',
    isPopular: false,
    duration: '6m',
    durationLabel: '6 Months Sprint',
    price: 3999,
    priceFormatted: '₹3,999',
    originalPrice: '₹7,999',
    discount: '50% OFF',
    period: '6 months',
    dailyCost: 22,
    dailyText: '~₹22 / day',
    chaiComparison: 'Literally 1 tapri cutting chai + Parle-G ☕🍪',
    pitch: 'Perfect for foundational prep, core DSA mastery & cracking your first coding rounds.',
    accentColor: '#3B82F6',
    features: [
      { text: 'Access to Any Two premium programs', bold: true },
      { text: '500+ unique DSA challenges', bold: true },
      { text: '200+ SQL problems', bold: true },
      { text: '3 AI Mock Interview Access', bold: true },
      { text: 'Multi-language cloud sandbox' },
      { text: 'Verifiable course certificates' },
      { text: 'Standard community doubt support' }
    ],
    ctaText: 'Choose Starter Plan',
    ctaVariant: 'outline'
  },
  {
    id: 'plus',
    name: 'Plus',
    badge: '🔥 MOST POPULAR • 85% OF LEARNERS',
    isPopular: true,
    duration: '6m',
    durationLabel: '6 Months Sprint',
    price: 4599,
    priceFormatted: '₹4,599',
    originalPrice: '₹9,999',
    discount: '54% OFF',
    period: '6 months',
    dailyCost: 25,
    dailyText: '~₹25 / day',
    chaiComparison: 'Less than your evening tapri cold coffee 🥤🥪',
    pitch: 'The sweet spot for cracking Tier-1 product firms, high-growth startups & FAANG.',
    accentColor: '#F3912E',
    inheritedLabel: 'Everything from Starter, plus:',
    features: [
      { text: 'Plus 1,000 unique DSA problems', bold: true, highlight: true },
      { text: '400+ SQL problems', bold: true, highlight: true },
      { text: '5 AI Mock Interviews', bold: true, highlight: true },
      { text: '2 Proctored Test / weekly (Product Company Based)', bold: true, highlight: true },
      { text: 'System Design Proctored Test', bold: true, highlight: true }
    ],
    ctaText: 'Claim Plus Access',
    ctaVariant: 'primary'
  },
  {
    id: 'compete',
    name: 'Compete',
    badge: '👑 ULTIMATE PLACEMENT ACCELERATOR',
    isPopular: false,
    duration: '6m',
    durationLabel: '6 Months Sprint',
    price: 6999,
    priceFormatted: '₹6,999',
    originalPrice: '₹14,999',
    discount: '53% OFF',
    period: '6 months',
    dailyCost: 38,
    dailyText: '~₹38 / day',
    chaiComparison: 'A plate of canteen momos or filter coffee 🥟☕',
    pitch: 'All-inclusive full placement arsenal covering every round from aptitude to final interview.',
    accentColor: '#10B981',
    inheritedLabel: 'Everything from Plus & Starter, plus:',
    features: [
      { text: '2,000+ Unique DSA Problems', bold: true, highlight: true },
      { text: '10 AI Mock Interviews', bold: true, highlight: true },
      { text: '4 Proctored Test / weekly (Product Company Based)', bold: true, highlight: true },
      { text: 'Full System Design Proctored Curriculum', bold: true, highlight: true },
      { text: 'Aptitude, Verbal & Psychometric Tests', bold: true, highlight: true }
    ],
    ctaText: 'Go All-In with Compete',
    ctaVariant: 'slate'
  }
];

/* ── 3-Month Commitment Plans Data (-40% Price Reduction) ── */
const PLANS_3M_DATA = [
  {
    id: 'starter',
    name: 'Starter',
    badge: '⚡ 3-MONTH FAST-TRACK • 40% OFF',
    isPopular: false,
    duration: '3m',
    durationLabel: '3 Months Commitment',
    price: 2399, // 40% reduction from ₹3,999
    priceFormatted: '₹2,399',
    originalPrice: '₹3,999',
    discount: '-40% COMMITMENT DROP',
    period: '3 months',
    dailyCost: 26,
    dailyText: '~₹26 / day',
    chaiComparison: '1 plate canteen poha or hot chai ☕🥪',
    pitch: 'Fast-track 90-day foundational sprint. Perfect for targeted semester or internship prep.',
    accentColor: '#3B82F6',
    extensionCost: 959,
    extensionFormatted: '₹959 (~40% of paid)',
    features: [
      { text: 'Access to Any Two premium programs', bold: true },
      { text: '500+ unique DSA challenges', bold: true },
      { text: '200+ SQL problems', bold: true },
      { text: '3 AI Mock Interview Access', bold: true },
      { text: 'Multi-language cloud sandbox' },
      { text: 'Post-plan: Videos & solved questions kept forever', bold: true, highlight: true },
      { text: 'Future extension at ~40% cost (₹959)', bold: true }
    ],
    ctaText: 'Choose 3-Month Starter',
    ctaVariant: 'outline'
  },
  {
    id: 'plus',
    name: 'Plus',
    badge: '🔥 3-MONTH FAST-TRACK • 40% OFF',
    isPopular: true,
    duration: '3m',
    durationLabel: '3 Months Commitment',
    price: 2759, // 40% reduction from ₹4,599
    priceFormatted: '₹2,759',
    originalPrice: '₹4,599',
    discount: '-40% COMMITMENT DROP',
    period: '3 months',
    dailyCost: 30,
    dailyText: '~₹30 / day',
    chaiComparison: 'Just 1 cup canteen special cold coffee 🥤',
    pitch: 'The highest-intensity 90-day sprint for product firms, DSA & system design rounds.',
    accentColor: '#F3912E',
    extensionCost: 1100,
    extensionFormatted: '₹1,100 (~40% of paid)',
    inheritedLabel: 'Everything from Starter, plus:',
    features: [
      { text: 'Plus 1,000 unique DSA problems', bold: true, highlight: true },
      { text: '400+ SQL problems', bold: true, highlight: true },
      { text: '5 AI Mock Interviews', bold: true, highlight: true },
      { text: '2 Proctored Test / weekly (Product Company Based)', bold: true, highlight: true },
      { text: 'System Design Proctored Test', bold: true, highlight: true },
      { text: 'Post-plan: Videos & solved questions kept forever', bold: true, highlight: true },
      { text: 'Future extension at ~40% cost (₹1,100)', bold: true }
    ],
    ctaText: 'Claim 3-Month Plus Access',
    ctaVariant: 'primary'
  },
  {
    id: 'compete',
    name: 'Compete',
    badge: '👑 3-MONTH FAST-TRACK • 40% OFF',
    isPopular: false,
    duration: '3m',
    durationLabel: '3 Months Commitment',
    price: 4199, // 40% reduction from ₹6,999
    priceFormatted: '₹4,199',
    originalPrice: '₹6,999',
    discount: '-40% COMMITMENT DROP',
    period: '3 months',
    dailyCost: 46,
    dailyText: '~₹46 / day',
    chaiComparison: 'Equal to a canteen cheese grill sandwich 🥪☕',
    pitch: 'The full placement powerhouse in a concentrated 90-day bootcamp sprint.',
    accentColor: '#10B981',
    extensionCost: 1679,
    extensionFormatted: '₹1,679 (~40% of paid)',
    inheritedLabel: 'Everything from Plus & Starter, plus:',
    features: [
      { text: '2,000+ Unique DSA Problems', bold: true, highlight: true },
      { text: '10 AI Mock Interviews', bold: true, highlight: true },
      { text: '4 Proctored Test / weekly (Product Company Based)', bold: true, highlight: true },
      { text: 'Full System Design Proctored Curriculum', bold: true, highlight: true },
      { text: 'Aptitude, Verbal & Psychometric Tests', bold: true, highlight: true },
      { text: 'Post-plan: Videos & solved questions kept forever', bold: true, highlight: true },
      { text: 'Future extension at ~40% cost (₹1,679)', bold: true }
    ],
    ctaText: 'Go All-In for 3 Months',
    ctaVariant: 'slate'
  }
];

const PLANS_DATA = PLANS_6M_DATA;

/* ── FAQs ── */
const FAQS = [
  {
    q: 'How does the 3-month commitment with 40% price reduction work?',
    a: 'If you want a high-velocity preparation sprint for an upcoming placement season or semester drive, you can convert to our 3-Month Commitment. All 3 plans get an instant 40% price reduction: Starter is ₹2,399 (was ₹3,999), Plus is ₹2,759 (was ₹4,599), and Compete is ₹4,199 (was ₹6,999) with full unrestricted curriculum access.'
  },
  {
    q: 'What happens after my 3-month commitment plan ends?',
    a: 'You never lose your learning investments! Post-plan end, you retain permanent lifetime access to all video lectures in your enrolled programs. Furthermore, all practice questions, coding challenges, and solutions unlocked up to where you practiced remain available permanently in your student dashboard.'
  },
  {
    q: 'Can I extend my subscription after the 3 months end?',
    a: 'Yes! Whenever you need more active AI mock interviews, new proctored exam attempts, or cloud sandbox execution, you can extend your full active subscription anytime at near 40% of what you paid (Starter: ₹959, Plus: ₹1,100, Compete: ₹1,679).'
  },
  {
    q: 'How does the 6-month validity work?',
    a: 'Your access begins the moment your payment completes and stays active for a full 180 days. You get unlimited access to practice sandboxes, recorded modules, and scheduled mock interviews throughout this period.'
  },
  {
    q: 'What is the quirky chai/daily math you mentioned?',
    a: 'We calculated the daily cost: Starter 6M is ~₹22/day (3M is ~₹26/day), Plus 6M is ~₹25/day (3M is ~₹30/day), and Compete 6M is ~₹38/day (3M is ~₹46/day). Most college students spend more on a single cutting chai or evening canteen snack than the cost of landing a 12+ LPA software role!'
  },
  {
    q: 'Can I upgrade from Starter to Plus or Compete later?',
    a: 'Yes! You can upgrade at any time during your plan. You will only pay the prorated price difference, and your features will unlock instantly.'
  },
  {
    q: 'How realistic are the AI Mock Interviews?',
    a: 'Our AI Mock Interview system conducts live voice dialogues, asks follow-up edge-case questions based on your code in real time, and evaluates you on technical accuracy, communication clarity, and problem-solving approach.'
  }
];

/* ── Program Selection Options ── */
const PROGRAM_OPTIONS = [
  {
    id: 'fsd',
    title: 'FSD - Next.js',
    subtitle: 'Full-Stack Next.js 15, PostgreSQL & Microservices',
    tag: 'Web & Cloud',
    icon: Laptop,
    lectures: 'Lectures Access Included'
  },
  {
    id: 'dsa',
    title: 'DSA',
    subtitle: '500+ Unique Challenges & Algorithm Patterns',
    tag: 'Core Coding',
    icon: Code2,
    lectures: 'Lectures Access Included'
  },
  {
    id: 'genai',
    title: 'GenAI',
    subtitle: 'Generative AI, Prompt Engineering & RAG',
    tag: 'AI Track',
    icon: Bot,
    lectures: 'Lectures Access Included'
  }
];

/* ── Side-by-Side Comparison Matrix with Ticks & Crosses ── */
const COMPARISON_GROUPS = [
  {
    category: 'Core Curriculum & Programs',
    features: [
      {
        name: 'Access to Premium Programs',
        desc: 'Choose between FSD - Next.js, DSA, and GenAI',
        starter: 'Any 2 Programs',
        plus: 'Any 2 Programs',
        compete: 'Any 2 Programs',
        type: 'text'
      },
      {
        name: 'Complete Video Lectures Access',
        desc: 'Unrestricted HD video lectures for chosen programs',
        starter: true,
        plus: true,
        compete: true,
        type: 'boolean'
      },
      {
        name: 'Interactive Cloud Sandbox',
        desc: 'Multi-language compiler environment in browser',
        starter: true,
        plus: true,
        compete: true,
        type: 'boolean'
      },
      {
        name: 'Verifiable Course Certificates',
        desc: 'Verified completion certificates with unique ID',
        starter: true,
        plus: true,
        compete: true,
        type: 'boolean'
      }
    ]
  },
  {
    category: 'DSA & Coding Practice',
    features: [
      {
        name: 'Unique DSA Challenges',
        desc: 'Curated problem sets across arrays, trees, graphs, DP',
        starter: '500+ Unique Challenges',
        plus: '1,000+ Unique Challenges',
        compete: '2,000+ Unique Challenges',
        starterType: 'badge',
        plusType: 'badge-highlight',
        competeType: 'badge-highlight'
      },
      {
        name: 'SQL & Database Problems',
        desc: 'Real schema queries, window functions & joins',
        starter: '200+ Problems',
        plus: '400+ Problems',
        compete: '400+ Problems',
        type: 'text'
      }
    ]
  },
  {
    category: 'Interviews & Proctored Assessments',
    features: [
      {
        name: 'AI Mock Interviews',
        desc: 'Real-time voice & coding interview simulator with rubric feedback',
        starter: '3 AI Mocks',
        plus: '5 AI Mocks',
        compete: '10 AI Mocks',
        starterType: 'badge',
        plusType: 'badge-highlight',
        competeType: 'badge-highlight'
      },
      {
        name: 'Weekly Proctored Tests (Product Company Based)',
        desc: 'Timed online assessments modeling top tech company hiring tests',
        starter: false,
        plus: '2 Tests / week',
        compete: '4 Tests / week',
        starterType: 'cross',
        plusType: 'badge-highlight',
        competeType: 'badge-highlight'
      },
      {
        name: 'System Design Proctored Test',
        desc: 'High-level architecture, scalability, caching & DB design',
        starter: false,
        plus: true,
        compete: 'Full Curriculum Included',
        starterType: 'cross',
        plusType: 'check',
        competeType: 'badge-highlight'
      },
      {
        name: 'Aptitude, Verbal & Psychometric Tests',
        desc: 'Full campus placement test suite for screening rounds',
        starter: false,
        plus: false,
        compete: true,
        starterType: 'cross',
        plusType: 'cross',
        competeType: 'check'
      }
    ]
  },
  {
    category: 'Post-Plan Retention & Extensions',
    features: [
      {
        name: 'Post-Plan Video Lectures Access',
        desc: 'Permanent lifetime access kept forever after validity ends',
        starter: true,
        plus: true,
        compete: true,
        type: 'boolean'
      },
      {
        name: 'Unlocked Practice Questions Kept',
        desc: 'Keep all solved challenges and sandbox solutions permanently',
        starter: true,
        plus: true,
        compete: true,
        type: 'boolean'
      },
      {
        name: 'Subscription Extension Rate (~40% of Cost)',
        desc: 'Extend active subscription anytime at near 40% of paid rate',
        starter: '₹959/mon',
        plus: '₹1,100/mon',
        compete: '₹1,679/mon',
        type: 'text'
      }
    ]
  }
];

const renderComparisonCell = (feat, planKey) => {
  const cellType = feat[`${planKey}Type`] || feat.type;
  const val = feat[planKey];

  if (cellType === 'boolean' || typeof val === 'boolean') {
    if (val) {
      return (
        <span className="table-check-pill">
          <Check size={14} strokeWidth={3} className="pill-check-icon" />
          <span>Included</span>
        </span>
      );
    }
    return (
      <span className="table-cross-pill">
        <X size={13} strokeWidth={2.6} className="pill-cross-icon" />
        <span>Not Included</span>
      </span>
    );
  }

  if (cellType === 'cross') {
    return (
      <span className="table-cross-pill">
        <X size={13} strokeWidth={2.6} className="pill-cross-icon" />
        <span>Not Included</span>
      </span>
    );
  }

  if (cellType === 'check') {
    return (
      <span className="table-check-pill">
        <Check size={14} strokeWidth={3} className="pill-check-icon" />
        <span>Included</span>
      </span>
    );
  }

  if (cellType === 'badge-highlight') {
    return (
      <span className="table-value-pill pill-highlight">
        <Check size={12} strokeWidth={3} className="pill-mini-check" />
        <span>{val}</span>
      </span>
    );
  }

  if (cellType === 'badge') {
    return (
      <span className="table-value-pill pill-neutral">
        <Check size={12} strokeWidth={3} className="pill-mini-check" />
        <span>{val}</span>
      </span>
    );
  }

  return <span className="table-plain-text">{val}</span>;
};

const PremiumPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('6m'); // '6m' or '3m'
  
  // Checkout Modal State
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);
  const [selectedPrograms, setSelectedPrograms] = useState(['fsd', 'dsa']);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenCheckout = (plan) => {
    setSelectedPlanForModal(plan);
    setSelectedPrograms(['fsd', 'dsa']);
    setCouponCode('');
    setCouponApplied(false);
    setDiscountAmount(0);
    setIsSuccessState(false);
  };

  const switchModalDuration = (targetDuration) => {
    if (!selectedPlanForModal) return;
    const targetList = targetDuration === '3m' ? PLANS_3M_DATA : PLANS_6M_DATA;
    const matchedPlan = targetList.find(p => p.id === selectedPlanForModal.id);
    if (matchedPlan) {
      setSelectedPlanForModal(matchedPlan);
    }
  };

  const handleCloseCheckout = () => {
    setSelectedPlanForModal(null);
  };

  const handleToggleProgram = (programId) => {
    if (selectedPrograms.includes(programId)) {
      if (selectedPrograms.length <= 1) {
        alert('Please keep at least 1 program selected.');
        return;
      }
      setSelectedPrograms(prev => prev.filter(id => id !== programId));
    } else {
      setSelectedPrograms(prev => [...prev, programId]);
    }
  };

  const isAllPrograms = selectedPrograms.length === 3;
  const extraProgramFee = isAllPrograms ? 500 : 0;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'CHAI2026' || couponCode.trim().toUpperCase() === 'CAREER10') {
      setCouponApplied(true);
      setDiscountAmount(300);
    } else {
      alert('Invalid coupon! Try code "CHAI2026" for ₹300 off.');
    }
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    if (selectedPrograms.length < 2) {
      alert('Please select at least 2 premium programs included with your plan (or all 3 for +₹500).');
      return;
    }
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill out your name, email, and phone number.');
      return;
    }
    setIsSuccessState(true);
  };

  const activePlans = selectedDuration === '3m' ? PLANS_3M_DATA : PLANS_6M_DATA;

  return (
    <div className="premium-page-viewport">
      <div className="premium-page-container">

        {/* ── Breadcrumb ── */}
        <div className="premium-breadcrumb">
          <Link to="/" className="breadcrumb-nav-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-active-tag">Premium Plans</span>
        </div>

        {/* ── Hero Section ── */}
        <div className="premium-hero-box">
          <div className="premium-hero-badge">
            <Crown size={15} className="hero-crown-icon" />
            <span>CIPHERSCHOOLS PREMIUM • CAREER SPRINTS</span>
          </div>

          <h1 className="premium-hero-title">
            Level Up Your Tech Career.<br />
            <span className="text-gradient-orange">For Less Than A Cup Of Chai A Day.</span>
          </h1>

          <p className="premium-hero-sub">
            Master 2,000+ curated DSA challenges, crack system design rounds, and ace high-pressure technical interviews with real-time AI voice feedback.
          </p>
        </div>

        {/* ── Duration Switcher / Toggle ── */}
        <div className="duration-selector-wrap">
          <div className="duration-toggle-pillbox">
            <button 
              type="button"
              className={`duration-tab-btn ${selectedDuration === '6m' ? 'active' : ''}`}
              onClick={() => setSelectedDuration('6m')}
            >
              <span className="duration-tab-title">6 Months Sprint</span>
              <span className="duration-tab-tag">Full Placement Runway</span>
            </button>
            <button 
              type="button"
              className={`duration-tab-btn ${selectedDuration === '3m' ? 'active' : ''}`}
              onClick={() => setSelectedDuration('3m')}
            >
              <div className="duration-tab-title-row">
                <span className="duration-tab-title">3 Months Commitment</span>
                <span className="duration-discount-badge">-40% OFF</span>
              </div>
              <span className="duration-tab-tag">Fast-Track • Videos Retained</span>
            </button>
          </div>
        </div>

        {selectedDuration === '3m' && (
          <div className="duration-active-alert animate-fade-in">
            <Sparkles size={16} className="text-amber-500" />
            <span>
              <strong>3-Month Fast-Track Active (-40% Price Drop):</strong> You retain lifetime video lectures & all practice questions unlocked till where you practiced. Extend anytime at ~40% cost!
            </span>
          </div>
        )}

        {/* ── 3 Pricing Cards Grid ── */}
        <div className="pricing-cards-section">
          <div className="pricing-cards-grid">
            {activePlans.map((plan) => (
              <div 
                key={plan.id}
                className={`pricing-card-surface ${plan.isPopular ? 'popular-card' : ''} card-${plan.id}`}
              >
                {/* Popular / Tier Ribbon */}
                <div className={`plan-ribbon ${plan.isPopular ? 'ribbon-popular' : ''}`}>
                  {plan.badge}
                </div>

                {/* Plan Header */}
                <div className="plan-header">
                  <div className="plan-title-row">
                    <h3 className="plan-name">{plan.name}</h3>
                    {plan.id === 'compete' && <Crown size={20} className="text-emerald-500" />}
                    {plan.id === 'plus' && <Flame size={20} className="text-orange-500" />}
                    {plan.id === 'starter' && <Zap size={20} className="text-blue-500" />}
                  </div>
                  <p className="plan-pitch">{plan.pitch}</p>
                </div>

                {/* Price Block */}
                <div className="plan-price-block">
                  <div className="price-main-line">
                    <span className="price-figure">{plan.priceFormatted}</span>
                    <span className="price-period">/ {plan.period}</span>
                  </div>
                  <div className="price-sub-line">
                    <span className="price-original">{plan.originalPrice}</span>
                    <span className="price-discount-tag">{plan.discount}</span>
                  </div>
                  
                  {/* Quirky Daily Tag */}
                  <div className="plan-daily-pill">
                    <Coffee size={13} />
                    <span className="daily-bold">{plan.dailyText}</span>
                    <span className="daily-note">• {plan.chaiComparison}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button 
                  className={`plan-cta-btn btn-${plan.ctaVariant}`}
                  onClick={() => handleOpenCheckout(plan)}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight size={16} />
                </button>

                {/* Divider */}
                <div className="plan-card-divider"></div>

                {/* Features Header */}
                {plan.inheritedLabel && (
                  <div className="plan-inherited-banner">
                    <Sparkles size={13} />
                    <span>{plan.inheritedLabel}</span>
                  </div>
                )}

                {/* Features List */}
                <ul className="plan-features-list">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className={`feature-item ${feat.highlight ? 'feat-highlight' : ''}`}>
                      <div className="feature-check-icon">
                        <Check size={14} strokeWidth={2.8} />
                      </div>
                      <span className={`feature-text ${feat.bold ? 'feat-bold' : ''}`}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Footer Assurance */}
                <div className="plan-footer-assurance">
                  <ShieldCheck size={14} />
                  <span>Instant access • 100% money-back 7-day guarantee</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Feature Comparison Table Section (Cross & Tick Format) ── */}
        <div className="plan-comparison-section" id="compare-plans">
          <div className="comparison-header">
            <span className="comparison-kicker">DETAILED BREAKDOWN</span>
            <h2 className="comparison-title">Compare All Features Side-by-Side</h2>
            <p className="comparison-sub">
              A transparent look at what is included and what is not included across Starter, Plus, and Compete.
            </p>
          </div>

          <div className="comparison-table-card">
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th className="th-feature-col">
                      <span className="th-feature-heading">Features & Deliverables</span>
                      <span className="th-feature-sub">Everything included in your enrollment</span>
                    </th>
                    <th className="th-plan-col">
                      <div className="th-plan-box">
                        <span className="th-plan-badge badge-starter">FOUNDATION</span>
                        <h4 className="th-plan-name">Starter</h4>
                        <div className="th-plan-price">
                          {activePlans.find(p => p.id === 'starter')?.priceFormatted}
                          <span className="th-plan-period">/ {activePlans.find(p => p.id === 'starter')?.period}</span>
                        </div>
                        <button 
                          type="button" 
                          className="th-plan-cta btn-starter"
                          onClick={() => handleOpenCheckout('starter')}
                        >
                          Choose Starter
                        </button>
                      </div>
                    </th>
                    <th className="th-plan-col th-plus-highlight">
                      <div className="th-plan-box">
                        <span className="th-plan-badge badge-plus">🔥 MOST POPULAR</span>
                        <h4 className="th-plan-name">Plus</h4>
                        <div className="th-plan-price">
                          {activePlans.find(p => p.id === 'plus')?.priceFormatted}
                          <span className="th-plan-period">/ {activePlans.find(p => p.id === 'plus')?.period}</span>
                        </div>
                        <button 
                          type="button" 
                          className="th-plan-cta btn-plus"
                          onClick={() => handleOpenCheckout('plus')}
                        >
                          Claim Plus Access
                        </button>
                      </div>
                    </th>
                    <th className="th-plan-col">
                      <div className="th-plan-box">
                        <span className="th-plan-badge badge-compete">👑 ALL-IN-ONE</span>
                        <h4 className="th-plan-name">Compete</h4>
                        <div className="th-plan-price">
                          {activePlans.find(p => p.id === 'compete')?.priceFormatted}
                          <span className="th-plan-period">/ {activePlans.find(p => p.id === 'compete')?.period}</span>
                        </div>
                        <button 
                          type="button" 
                          className="th-plan-cta btn-compete"
                          onClick={() => handleOpenCheckout('compete')}
                        >
                          Go Compete
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_GROUPS.map((group, gIdx) => (
                    <React.Fragment key={gIdx}>
                      <tr className="tr-category-row">
                        <td colSpan={4} className="td-category-cell">
                          <span>{group.category}</span>
                        </td>
                      </tr>
                      {group.features.map((feat, fIdx) => (
                        <tr key={fIdx} className="tr-feature-row">
                          <td className="td-feature-info">
                            <span className="feature-name">{feat.name}</span>
                            {feat.desc && <span className="feature-desc">{feat.desc}</span>}
                          </td>
                          <td className="td-plan-val td-val-starter">
                            {renderComparisonCell(feat, 'starter')}
                          </td>
                          <td className="td-plan-val td-val-plus td-plus-cell-highlight">
                            {renderComparisonCell(feat, 'plus')}
                          </td>
                          <td className="td-plan-val td-val-compete">
                            {renderComparisonCell(feat, 'compete')}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Placement Proof & Student Testimonials ── */}
        <div className="placement-proof-section">
          <div className="proof-header">
            <span className="proof-kicker">PROVEN PLACEMENTS</span>
            <h2 className="proof-title">Students Cracking 12+ LPA Offers Everyday</h2>
            <p className="proof-sub">Here is what developers who prepared with CipherSchools Premium have to say.</p>
          </div>

          <div className="proof-cards-grid">
            <div className="proof-card">
              <div className="proof-card-top">
                <div className="proof-avatar">AK</div>
                <div>
                  <h4 className="proof-name">Aman Kumar</h4>
                  <span className="proof-role">SDE-1 at Amazon • 28 LPA</span>
                </div>
              </div>
              <p className="proof-quote">
                "The 10 AI Mock interviews in the Compete plan felt just like my real AWS bar-raiser round. The instant feedback on edge-cases was priceless."
              </p>
              <div className="proof-rating">
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <span className="rating-tag">Compete Plan Member</span>
              </div>
            </div>

            <div className="proof-card">
              <div className="proof-card-top">
                <div className="proof-avatar avatar-purple">SP</div>
                <div>
                  <h4 className="proof-name">Sneha Patel</h4>
                  <span className="proof-role">Frontend Engineer at Juspay • 18 LPA</span>
                </div>
              </div>
              <p className="proof-quote">
                "Plus plan was the best ₹4,599 investment during my 7th semester. 1,000+ DSA problems with curated topic tags helped me clear 4 back-to-back rounds."
              </p>
              <div className="proof-rating">
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <span className="rating-tag">Plus Plan Member</span>
              </div>
            </div>

            <div className="proof-card">
              <div className="proof-card-top">
                <div className="proof-avatar avatar-emerald">RS</div>
                <div>
                  <h4 className="proof-name">Rohan Sharma</h4>
                  <span className="proof-role">Backend Developer at Razorpay • 22 LPA</span>
                </div>
              </div>
              <p className="proof-quote">
                "The System Design proctored test taught me high-level architecture diagrams and caching strategies that no other course touched."
              </p>
              <div className="proof-rating">
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <Star size={14} fill="#F3912E" stroke="#F3912E" />
                <span className="rating-tag">Compete Plan Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ Section ── */}
        <div className="premium-faq-section">
          <div className="faq-header">
            <span className="faq-kicker">QUESTIONS & ANSWERS</span>
            <h2 className="faq-title">Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className={`faq-item-card ${isOpen ? 'open' : ''}`}
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                >
                  <div className="faq-question-row">
                    <span className="faq-q-text">{faq.q}</span>
                    <span className="faq-chevron-box">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </div>
                  {isOpen && (
                    <div className="faq-answer-row animate-fade-in">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom Final Call-to-Action ── */}
        <div className="premium-bottom-cta-banner">
          <div className="cta-banner-content">
            <div className="cta-badge">
              <Zap size={14} />
              <span>START YOUR 6-MONTH SPRINT TODAY</span>
            </div>
            <h2 className="cta-banner-title">
              Ready to land your dream developer job?
            </h2>
            <p className="cta-banner-sub">
              Join over 120,000+ ambitious developers preparing smarter every day.
            </p>
            <div className="cta-buttons-wrap">
              <button 
                className="btn-banner-primary"
                onClick={() => handleOpenCheckout(selectedDuration === '3m' ? PLANS_3M_DATA[1] : PLANS_6M_DATA[1])}
              >
                <span>Get Plus Plan ({selectedDuration === '3m' ? '₹2,759' : '₹4,599'})</span>
                <ArrowRight size={16} />
              </button>
              <button 
                className="btn-banner-secondary"
                onClick={() => handleOpenCheckout(selectedDuration === '3m' ? PLANS_3M_DATA[2] : PLANS_6M_DATA[2])}
              >
                <span>Go All-In with Compete ({selectedDuration === '3m' ? '₹4,199' : '₹6,999'})</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Interactive Checkout & Enrollment Modal ── */}
      {selectedPlanForModal && (
        <div className="checkout-modal-backdrop" onClick={handleCloseCheckout}>
          <div className="checkout-modal-window animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button className="checkout-close-btn" onClick={handleCloseCheckout} aria-label="Close">
              <X size={20} />
            </button>

            {!isSuccessState ? (
              <form onSubmit={handleCompleteOrder} className="checkout-modal-form">
                
                {/* Scrollable Upper Area */}
                <div className="checkout-modal-scrollable">
                  <div className="checkout-header">
                    <div className="checkout-header-top-row">
                      <div className="checkout-plan-tag">
                        <Crown size={14} />
                        <span>Selected Plan: <strong>{selectedPlanForModal.name}</strong></span>
                      </div>

                      {/* Modal Duration Switcher */}
                      <div className="modal-duration-pills">
                        <button
                          type="button"
                          className={`modal-duration-pill ${selectedPlanForModal.duration === '6m' ? 'active' : ''}`}
                          onClick={() => switchModalDuration('6m')}
                        >
                          <span>6 Months</span>
                        </button>
                        <button
                          type="button"
                          className={`modal-duration-pill ${selectedPlanForModal.duration === '3m' ? 'active' : ''}`}
                          onClick={() => switchModalDuration('3m')}
                        >
                          <span>3 Months</span>
                          <span className="modal-pill-discount">-40%</span>
                        </button>
                      </div>
                    </div>

                    <h3 className="checkout-title">
                      Complete Your {selectedPlanForModal.duration === '3m' ? '3-Month Fast-Track' : '6-Month'} Enrollment
                    </h3>
                    <p className="checkout-chai-pitch">
                      {selectedPlanForModal.chaiComparison}
                    </p>
                  </div>

                  <div className="checkout-grid-layout">
                    {/* Left: Summary */}
                    <div className="checkout-summary-box">
                      <span className="summary-title">Plan Summary</span>
                      <div className="summary-row">
                        <span>Plan Name</span>
                        <strong>{selectedPlanForModal.name} ({selectedPlanForModal.duration === '3m' ? '3 Months Commitment' : '6 Months'})</strong>
                      </div>
                      <div className="summary-row">
                        <span>Validity</span>
                        <span>{selectedPlanForModal.duration === '3m' ? '90 Days Fast-Track Access' : '180 Days Full Access'}</span>
                      </div>
                      <div className="summary-row">
                        <span>Daily Cost</span>
                        <span className="text-orange-600 font-semibold">{selectedPlanForModal.dailyText}</span>
                      </div>
                      <div className="summary-row">
                        <span>Base Price</span>
                        <span>{selectedPlanForModal.priceFormatted}</span>
                      </div>

                      {selectedPlanForModal.duration === '3m' && (
                        <div className="summary-row text-emerald-600 font-semibold">
                          <span>Commitment Drop (-40%)</span>
                          <span>Applied</span>
                        </div>
                      )}

                      <div className="summary-row">
                        <span>Selected Programs ({selectedPrograms.length})</span>
                        <span className="summary-programs-badge">
                          {selectedPrograms.map(id => PROGRAM_OPTIONS.find(p => p.id === id)?.title).join(', ')}
                        </span>
                      </div>

                      <div className="summary-row text-emerald-600 font-semibold">
                        <span className="summary-lectures-label">
                          <PlayCircle size={13} className="text-emerald-600" />
                          <span>Lectures Access</span>
                        </span>
                        <span className="summary-lectures-status">Included</span>
                      </div>

                      {extraProgramFee > 0 && (
                        <div className="summary-row text-amber-600 font-semibold">
                          <span>Extra 3rd Program Access</span>
                          <span>+ ₹500</span>
                        </div>
                      )}

                      {couponApplied && (
                        <div className="summary-row text-emerald-600">
                          <span>Coupon Discount (CHAI2026)</span>
                          <span>- ₹{discountAmount}</span>
                        </div>
                      )}

                      <div className="summary-divider"></div>

                      <div className="summary-total-row">
                        <span>Total Payable</span>
                        <span className="total-amount">
                          ₹{selectedPlanForModal.price + extraProgramFee - discountAmount}
                        </span>
                      </div>

                      {/* Coupon Input */}
                      <div className="coupon-form">
                        <input 
                          type="text" 
                          placeholder="Coupon code (e.g. CHAI2026)" 
                          value={couponCode} 
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="coupon-input"
                        />
                        <button type="button" onClick={handleApplyCoupon} className="coupon-apply-btn">Apply</button>
                      </div>
                      {couponApplied && (
                        <span className="coupon-success-msg">🎉 ₹300 Chai Discount Applied!</span>
                      )}

                      {/* 3-Month Commitment Guarantees in Modal */}
                      {selectedPlanForModal.duration === '3m' && (
                        <div className="modal-3m-guarantee-box">
                          <span className="guarantee-box-title">⚡ 3-Month Commitment Perks:</span>
                          <ul className="guarantee-box-list">
                            <li>
                              <PlayCircle size={13} className="text-emerald-600" />
                              <span>Permanent video lecture access post-plan end</span>
                            </li>
                            <li>
                              <Unlock size={13} className="text-emerald-600" />
                              <span>Practice questions unlocked till where practiced kept forever</span>
                            </li>
                            <li>
                              <RefreshCw size={13} className="text-blue-600" />
                              <span>Extend anytime at ~40% cost: <strong>{selectedPlanForModal.extensionFormatted}</strong></span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right: Program Picker & Student Information */}
                    <div className="checkout-form-box">
                      
                      {/* Step 1: Program Selection */}
                      <div className="modal-program-picker">
                        <div className="picker-header">
                          <div>
                            <span className="picker-kicker">STEP 1 • CHOOSE PREMIUM PROGRAMS</span>
                            <h4 className="picker-title">Which 2 premium programs do you want to take?</h4>
                          </div>
                          <span className={`picker-status-tag ${isAllPrograms ? 'tag-all' : selectedPrograms.length === 2 ? 'tag-included' : 'tag-alert'}`}>
                            {isAllPrograms 
                              ? '🔥 All 3 Unlocked (+₹500)' 
                              : selectedPrograms.length === 2 
                              ? '✓ 2 Included in Plan' 
                              : '⚠️ Select 2 programs to continue'}
                          </span>
                        </div>

                        <div className="picker-cards-grid">
                          {PROGRAM_OPTIONS.map((prog) => {
                            const isSelected = selectedPrograms.includes(prog.id);
                            const IconComp = prog.icon;
                            return (
                              <div
                                key={prog.id}
                                className={`picker-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleToggleProgram(prog.id)}
                              >
                                <div className="picker-card-top">
                                  <span className="picker-tag">{prog.tag}</span>
                                  <div className={`picker-check-circle ${isSelected ? 'checked' : ''}`}>
                                    {isSelected && <Check size={11} strokeWidth={3} />}
                                  </div>
                                </div>
                                <div className="picker-card-main">
                                  <IconComp size={16} className="picker-icon" />
                                  <span className="picker-card-name">{prog.title}</span>
                                </div>
                                <p className="picker-card-desc">{prog.subtitle}</p>
                                <div className="picker-lectures-badge">
                                  <PlayCircle size={12} className="picker-lectures-icon" />
                                  <span>{prog.lectures}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="picker-upsell-strip">
                          {isAllPrograms ? (
                            <div className="upsell-all-active">
                              <Sparkles size={14} className="text-amber-500" />
                              <span><strong>All 3 Programs Selected!</strong> You get FSD - Next.js, DSA & GenAI (+₹500 added to total).</span>
                            </div>
                          ) : (
                            <div className="upsell-hint-banner" onClick={() => setSelectedPrograms(['fsd', 'dsa', 'genai'])}>
                              <span>💡 Want all 3 programs? <strong>Select all 3 for only +₹500 extra</strong> (Click here to unlock all)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="form-legend">STEP 2 • STUDENT INFORMATION</span>
                      
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Rahul Verma"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Email Address *</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="rahul@college.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Phone Number *</label>
                          <input 
                            type="tel" 
                            required 
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>College / Passing Year</label>
                          <input 
                            type="text" 
                            placeholder="e.g. IIT Delhi '26"
                            value={formData.college}
                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── STICKY POP-UP BOTTOM BAR ── */}
                <div className="checkout-modal-sticky-footer">
                  <div className="sticky-footer-grid">
                    <div className="sticky-footer-left">
                      <div className="summary-guarantee">
                        <ShieldCheck size={18} className="text-emerald-500" />
                        <div>
                          <strong>7-Day 100% Risk-Free Guarantee</strong>
                          <span className="guarantee-sub-line">Instant full refund • No questions asked</span>
                        </div>
                      </div>
                    </div>

                    <div className="sticky-footer-right">
                      <div className="payment-modes-preview">
                        <span className="modes-label">Modes:</span>
                        <div className="modes-badges">
                          <span className="mode-badge">UPI / GPay</span>
                          <span className="mode-badge">Cards</span>
                          <span className="mode-badge">Net Banking</span>
                        </div>
                      </div>

                      <button type="submit" className="checkout-submit-btn sticky-submit-btn">
                        <span>Proceed to Pay ₹{selectedPlanForModal.price + extraProgramFee - discountAmount}</span>
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                </div>

              </form>
            ) : (
              <div className="checkout-success-body">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={54} className="text-emerald-500" />
                </div>
                <h3 className="success-title">
                  Welcome to CipherSchools {selectedPlanForModal.name} {selectedPlanForModal.duration === '3m' ? '(3-Month Fast-Track)' : ''}! 🚀
                </h3>
                <p className="success-sub">
                  Congratulations <strong>{formData.name}</strong>! Your {selectedPlanForModal.duration === '3m' ? '90-day fast-track' : '6-month'} access has been activated. A receipt and access link have been dispatched to <strong>{formData.email}</strong>.
                </p>

                {selectedPlanForModal.duration === '3m' && (
                  <div className="success-commitment-banner">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>
                      <strong>Commitment Perks Unlocked:</strong> You retain permanent access to all video lectures & practice problems solved. You can extend your subscription anytime at near 40% cost ({selectedPlanForModal.extensionFormatted}).
                    </span>
                  </div>
                )}

                <div className="success-programs-box">
                  <span className="success-programs-label">Your Active Programs:</span>
                  <div className="success-programs-pills">
                    {selectedPrograms.map(id => (
                      <span key={id} className="success-program-pill">
                        ✓ {PROGRAM_OPTIONS.find(p => p.id === id)?.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="success-quirky-banner">
                  <span>☕ Remember: You are now fueling your tech career for just {selectedPlanForModal.dailyText}! Go build something epic.</span>
                </div>
                <div className="success-actions">
                  <Link to="/courses" className="btn-success-courses" onClick={handleCloseCheckout}>
                    <span>Start Practice & Courses</span>
                    <ArrowRight size={15} />
                  </Link>
                  <button className="btn-success-close" onClick={handleCloseCheckout}>
                    Back to Plans
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default PremiumPage;
