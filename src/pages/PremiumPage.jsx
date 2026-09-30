import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Crown, Sparkles, Check, Flame, Coffee, Zap, ShieldCheck, 
  ArrowRight, ChevronDown, ChevronUp, Star, Award, CheckCircle2,
  Clock, X, Heart, HelpCircle, Code2, Terminal, Bot, Laptop,
  RotateCcw, PlayCircle, Unlock, RefreshCw, BookOpen, Layers,
  Database, BarChart2, Workflow
} from 'lucide-react';
import './PremiumPage.css';

/* ── 6-Month Commitment Plans Data (20% Discount) ── */
const PLANS_6M_DATA = [
  {
    id: 'starter',
    name: 'Starter',
    badge: 'ESSENTIAL FOUNDATION • 20% OFF',
    isPopular: false,
    duration: '6m',
    durationMonths: 6,
    durationLabel: '6 Months',
    commitmentText: 'with a commitment of 6 months',
    price: 1194, // 20% off ₹249/mo (₹199 x 6)
    priceFormatted: '₹1,194',
    monthlyPrice: 199,
    monthlyPriceFormatted: '₹199',
    originalPrice: '₹1,494',
    originalMonthlyPrice: '₹249',
    discount: '20% OFF',
    period: 'mon',
    dailyCost: 6,
    dailyText: '~₹6 / day',
    chaiComparison: 'Cheaper than 1 cutting chai + biscuit ☕🍪',
    pitch: 'Perfect for foundational prep, core DSA mastery & cracking your first coding rounds.',
    accentColor: '#3B82F6',
    extensionCost: 99,
    extensionFormatted: '₹99/mon',
    features: [
      { text: 'Access to Any 2 Premium Courses of your choice', bold: true },
      { text: '500+ exclusive DSA challenges', bold: true },
      { text: '200+ SQL problems', bold: true },
      { text: '3 AI Mock Interview Access Company / Role Based', bold: true },
      { text: 'Future extension at ~40% cost (₹99/mon)', bold: true }
    ],
    ctaText: 'Choose Starter Plan',
    ctaVariant: 'outline'
  },
  {
    id: 'plus',
    name: 'Plus',
    badge: '🔥 MOST POPULAR • 20% OFF',
    isPopular: true,
    duration: '6m',
    durationMonths: 6,
    durationLabel: '6 Months',
    commitmentText: 'with a commitment of 6 months',
    price: 2400, // 20% off ₹500/mo (₹400 x 6)
    priceFormatted: '₹2,400',
    monthlyPrice: 400,
    monthlyPriceFormatted: '₹400',
    originalPrice: '₹3,000',
    originalMonthlyPrice: '₹500',
    discount: '20% OFF',
    period: 'mon',
    dailyCost: 13,
    dailyText: '~₹13 / day',
    chaiComparison: 'Less than a college canteen cutting chai ☕',
    pitch: 'The sweet spot for cracking Tier-1 product firms, high-growth startups & FAANG.',
    accentColor: '#F3912E',
    extensionCost: 200,
    extensionFormatted: '₹200/mon',
    inheritedLabel: 'Everything from Starter, plus:',
    features: [
      { text: 'Access to Any 3 Premium Courses of your choice', bold: true, highlight: true },
      { text: 'Plus 1,000 exclusive DSA challenges', bold: true, highlight: true },
      { text: '400+ SQL problems', bold: true, highlight: true },
      { text: '5 AI Mock Interview Access Company / Role Based', bold: true, highlight: true },
      { text: '2 Company Specific Test / weekly', bold: true, highlight: true },
      { text: 'System Design Proctored Test', bold: true, highlight: true },
      { text: 'Future extension at ~40% cost (₹200/mon)', bold: true }
    ],
    ctaText: 'Claim Plus Access',
    ctaVariant: 'primary'
  },
  {
    id: 'compete',
    name: 'Compete',
    badge: '👑 ULTIMATE ACCELERATOR • 20% OFF',
    isPopular: false,
    duration: '6m',
    durationMonths: 6,
    durationLabel: '6 Months',
    commitmentText: 'with a commitment of 6 months',
    price: 3360, // 20% off ₹700/mo (₹560 x 6)
    priceFormatted: '₹3,360',
    monthlyPrice: 560,
    monthlyPriceFormatted: '₹560',
    originalPrice: '₹4,200',
    originalMonthlyPrice: '₹700',
    discount: '20% OFF',
    period: 'mon',
    dailyCost: 18,
    dailyText: '~₹18 / day',
    chaiComparison: '1 evening tea + canteen samosa ☕🥟',
    pitch: 'All-inclusive full placement arsenal covering every round from aptitude to final interview.',
    accentColor: '#10B981',
    extensionCost: 280,
    extensionFormatted: '₹280/mon',
    inheritedLabel: 'Everything from Plus & Starter, plus:',
    features: [
      { text: 'Access to Any 5 Premium Courses of your choice', bold: true, highlight: true },
      { text: '2,000+ exclusive DSA challenges', bold: true, highlight: true },
      { text: '10 AI Mock Interview Access Company / Role Based', bold: true, highlight: true },
      { text: '4 Company Specific Test / weekly', bold: true, highlight: true },
      { text: 'Full System Design Proctored Curriculum', bold: true, highlight: true },
      { text: 'Aptitude, Verbal & Psychometric Tests', bold: true, highlight: true },
      { text: 'Future extension at ~40% cost (₹280/mon)', bold: true }
    ],
    ctaText: 'Go All-In with Compete',
    ctaVariant: 'slate'
  }
];

/* ── 3-Month Commitment Plans Data (10% Discount) ── */
const PLANS_3M_DATA = [
  {
    id: 'starter',
    name: 'Starter',
    badge: '⚡ 3-MONTH FAST-TRACK • 10% OFF',
    isPopular: false,
    duration: '3m',
    durationMonths: 3,
    durationLabel: '3 Months',
    commitmentText: 'with a commitment of 3 months',
    price: 672, // 10% off ₹249/mo (₹224 x 3)
    priceFormatted: '₹672',
    monthlyPrice: 224,
    monthlyPriceFormatted: '₹224',
    originalPrice: '₹747',
    originalMonthlyPrice: '₹249',
    discount: '10% OFF',
    period: 'mon',
    dailyCost: 7,
    dailyText: '~₹7 / day',
    chaiComparison: 'Less than 1 single cutting chai ☕',
    pitch: 'Fast-track 90-day foundational sprint. Perfect for targeted semester or internship prep.',
    accentColor: '#3B82F6',
    extensionCost: 99,
    extensionFormatted: '₹99/mon',
    features: [
      { text: 'Access to Any 2 Premium Courses of your choice', bold: true },
      { text: '500+ exclusive DSA challenges', bold: true },
      { text: '200+ SQL problems', bold: true },
      { text: '3 AI Mock Interview Access Company / Role Based', bold: true },
      { text: 'Future extension at ~40% cost (₹99/mon)', bold: true }
    ],
    ctaText: 'Choose 3-Month Starter',
    ctaVariant: 'outline'
  },
  {
    id: 'plus',
    name: 'Plus',
    badge: '🔥 3-MONTH FAST-TRACK • 10% OFF',
    isPopular: true,
    duration: '3m',
    durationMonths: 3,
    durationLabel: '3 Months',
    commitmentText: 'with a commitment of 3 months',
    price: 1350, // 10% off ₹500/mo (₹450 x 3)
    priceFormatted: '₹1,350',
    monthlyPrice: 450,
    monthlyPriceFormatted: '₹450',
    originalPrice: '₹1,500',
    originalMonthlyPrice: '₹500',
    discount: '10% OFF',
    period: 'mon',
    dailyCost: 15,
    dailyText: '~₹15 / day',
    chaiComparison: '1 hot cutting chai with bun muska ☕🥪',
    pitch: 'The highest-intensity 90-day sprint for product firms, DSA & system design rounds.',
    accentColor: '#F3912E',
    extensionCost: 200,
    extensionFormatted: '₹200/mon',
    inheritedLabel: 'Everything from Starter, plus:',
    features: [
      { text: 'Access to Any 3 Premium Courses of your choice', bold: true, highlight: true },
      { text: 'Plus 1,000 exclusive DSA challenges', bold: true, highlight: true },
      { text: '400+ SQL problems', bold: true, highlight: true },
      { text: '5 AI Mock Interview Access Company / Role Based', bold: true, highlight: true },
      { text: '2 Company Specific Test / weekly', bold: true, highlight: true },
      { text: 'System Design Proctored Test', bold: true, highlight: true },
      { text: 'Future extension at ~40% cost (₹200/mon)', bold: true }
    ],
    ctaText: 'Claim 3-Month Plus Access',
    ctaVariant: 'primary'
  },
  {
    id: 'compete',
    name: 'Compete',
    badge: '👑 3-MONTH FAST-TRACK • 10% OFF',
    isPopular: false,
    duration: '3m',
    durationMonths: 3,
    durationLabel: '3 Months',
    commitmentText: 'with a commitment of 3 months',
    price: 1890, // 10% off ₹700/mo (₹630 x 3)
    priceFormatted: '₹1,890',
    monthlyPrice: 630,
    monthlyPriceFormatted: '₹630',
    originalPrice: '₹2,100',
    originalMonthlyPrice: '₹700',
    discount: '10% OFF',
    period: 'mon',
    dailyCost: 21,
    dailyText: '~₹21 / day',
    chaiComparison: '1 plate hot canteen poha or tea ☕🥪',
    pitch: 'The full placement powerhouse in a concentrated 90-day bootcamp sprint.',
    accentColor: '#10B981',
    extensionCost: 280,
    extensionFormatted: '₹280/mon',
    inheritedLabel: 'Everything from Plus & Starter, plus:',
    features: [
      { text: 'Access to Any 5 Premium Courses of your choice', bold: true, highlight: true },
      { text: '2,000+ exclusive DSA challenges', bold: true, highlight: true },
      { text: '10 AI Mock Interview Access Company / Role Based', bold: true, highlight: true },
      { text: '4 Company Specific Test / weekly', bold: true, highlight: true },
      { text: 'Full System Design Proctored Curriculum', bold: true, highlight: true },
      { text: 'Aptitude, Verbal & Psychometric Tests', bold: true, highlight: true },
      { text: 'Future extension at ~40% cost (₹280/mon)', bold: true }
    ],
    ctaText: 'Go All-In for 3 Months',
    ctaVariant: 'slate'
  }
];

/* ── 1-Month Commitment Plans Data (Base Monthly Rates) ── */
const PLANS_1M_DATA = [
  {
    id: 'starter',
    name: 'Starter',
    badge: '⚡ 1-MONTH SPRINT',
    isPopular: false,
    duration: '1m',
    durationMonths: 1,
    durationLabel: '1 Month',
    commitmentText: 'with a commitment of 1 month',
    price: 249,
    priceFormatted: '₹249',
    monthlyPrice: 249,
    monthlyPriceFormatted: '₹249',
    originalPrice: '₹349',
    originalMonthlyPrice: '₹349',
    discount: 'BASE RATE',
    period: 'mon',
    dailyCost: 8,
    dailyText: '~₹8 / day',
    chaiComparison: 'Literally half a cup of cutting chai ☕',
    pitch: 'Flexible 30-day foundational burst. Solve DSA problems & explore premium programs.',
    accentColor: '#3B82F6',
    extensionCost: 99,
    extensionFormatted: '₹99/mon',
    features: [
      { text: 'Access to Any 2 Premium Courses of your choice', bold: true },
      { text: '500+ exclusive DSA challenges', bold: true },
      { text: '200+ SQL problems', bold: true },
      { text: '3 AI Mock Interview Access Company / Role Based', bold: true },
      { text: 'Future extension at ~40% cost (₹99/mon)', bold: true }
    ],
    ctaText: 'Choose 1-Month Starter',
    ctaVariant: 'outline'
  },
  {
    id: 'plus',
    name: 'Plus',
    badge: '🔥 1-MONTH INTENSIVE',
    isPopular: true,
    duration: '1m',
    durationMonths: 1,
    durationLabel: '1 Month',
    commitmentText: 'with a commitment of 1 month',
    price: 500,
    priceFormatted: '₹500',
    monthlyPrice: 500,
    monthlyPriceFormatted: '₹500',
    originalPrice: '₹699',
    originalMonthlyPrice: '₹699',
    discount: 'BASE RATE',
    period: 'mon',
    dailyCost: 16,
    dailyText: '~₹16 / day',
    chaiComparison: '1 tapri cutting tea + Parle-G ☕🍪',
    pitch: 'Targeted 30-day burst with AI mock interviews & product proctored assessments.',
    accentColor: '#F3912E',
    extensionCost: 200,
    extensionFormatted: '₹200/mon',
    inheritedLabel: 'Everything from Starter, plus:',
    features: [
      { text: 'Access to Any 3 Premium Courses of your choice', bold: true, highlight: true },
      { text: 'Plus 1,000 exclusive DSA challenges', bold: true, highlight: true },
      { text: '400+ SQL problems', bold: true, highlight: true },
      { text: '5 AI Mock Interview Access Company / Role Based', bold: true, highlight: true },
      { text: '2 Company Specific Test / weekly', bold: true, highlight: true },
      { text: 'System Design Proctored Test', bold: true, highlight: true },
      { text: 'Future extension at ~40% cost (₹200/mon)', bold: true }
    ],
    ctaText: 'Claim 1-Month Plus Access',
    ctaVariant: 'primary'
  },
  {
    id: 'compete',
    name: 'Compete',
    badge: '👑 1-MONTH POWER PASS',
    isPopular: false,
    duration: '1m',
    durationMonths: 1,
    durationLabel: '1 Month',
    commitmentText: 'with a commitment of 1 month',
    price: 700,
    priceFormatted: '₹700',
    monthlyPrice: 700,
    monthlyPriceFormatted: '₹700',
    originalPrice: '₹999',
    originalMonthlyPrice: '₹999',
    discount: 'BASE RATE',
    period: 'mon',
    dailyCost: 23,
    dailyText: '~₹23 / day',
    chaiComparison: '1 canteen samosa or hot filter coffee 🥟☕',
    pitch: 'Full unrestricted placement suite for urgent upcoming interview preparation.',
    accentColor: '#10B981',
    extensionCost: 280,
    extensionFormatted: '₹280/mon',
    inheritedLabel: 'Everything from Plus & Starter, plus:',
    features: [
      { text: 'Access to Any 5 Premium Courses of your choice', bold: true, highlight: true },
      { text: '2,000+ exclusive DSA challenges', bold: true, highlight: true },
      { text: '10 AI Mock Interview Access Company / Role Based', bold: true, highlight: true },
      { text: '4 Company Specific Test / weekly', bold: true, highlight: true },
      { text: 'Full System Design Proctored Curriculum', bold: true, highlight: true },
      { text: 'Aptitude, Verbal & Psychometric Tests', bold: true, highlight: true },
      { text: 'Future extension at ~40% cost (₹280/mon)', bold: true }
    ],
    ctaText: 'Go All-In for 1 Month',
    ctaVariant: 'slate'
  }
];

/* ── 12-Month Commitment Plans Data (Max 30% Discount) ── */
const PLANS_12M_DATA = [
  {
    id: 'starter',
    name: 'Starter',
    badge: '🌱 1-YEAR PLACEMENT FOUNDATION • 30% OFF',
    isPopular: false,
    duration: '12m',
    durationMonths: 12,
    durationLabel: '12 Months',
    commitmentText: 'with a commitment of 12 months',
    price: 2088, // 30% off ₹249/mo (₹174 x 12)
    priceFormatted: '₹2,088',
    monthlyPrice: 174,
    monthlyPriceFormatted: '₹174',
    originalPrice: '₹2,988',
    originalMonthlyPrice: '₹249',
    discount: '30% OFF',
    period: 'mon',
    dailyCost: 5,
    dailyText: '~₹5 / day',
    chaiComparison: 'Barely ₹5 a day! Cheaper than any tapri chai ☕',
    pitch: 'Full 365-day placement runway. Master foundational CS & DSA with zero pressure.',
    accentColor: '#3B82F6',
    extensionCost: 99,
    extensionFormatted: '₹99/mon',
    features: [
      { text: 'Access to Any 2 Premium Courses of your choice', bold: true },
      { text: '500+ exclusive DSA challenges', bold: true },
      { text: '200+ SQL problems', bold: true },
      { text: '3 AI Mock Interview Access Company / Role Based', bold: true },
      { text: 'Future extension at ~40% cost (₹99/mon)', bold: true }
    ],
    ctaText: 'Choose 1-Year Starter',
    ctaVariant: 'outline'
  },
  {
    id: 'plus',
    name: 'Plus',
    badge: '🔥 1-YEAR CAREER CATALYST • 30% OFF',
    isPopular: true,
    duration: '12m',
    durationMonths: 12,
    durationLabel: '12 Months',
    commitmentText: 'with a commitment of 12 months',
    price: 4200, // 30% off ₹500/mo (₹350 x 12)
    priceFormatted: '₹4,200',
    monthlyPrice: 350,
    monthlyPriceFormatted: '₹350',
    originalPrice: '₹6,000',
    originalMonthlyPrice: '₹500',
    discount: '30% OFF',
    period: 'mon',
    dailyCost: 11,
    dailyText: '~₹11 / day',
    chaiComparison: 'Less than 1 single cup of canteen tea ☕',
    pitch: 'A full year of 100+ proctored tests, system design & AI mock interview feedback.',
    accentColor: '#F3912E',
    extensionCost: 200,
    extensionFormatted: '₹200/mon',
    inheritedLabel: 'Everything from Starter, plus:',
    features: [
      { text: 'Access to Any 3 Premium Courses of your choice', bold: true, highlight: true },
      { text: 'Plus 1,000 exclusive DSA challenges', bold: true, highlight: true },
      { text: '400+ SQL problems', bold: true, highlight: true },
      { text: '5 AI Mock Interview Access Company / Role Based', bold: true, highlight: true },
      { text: '2 Company Specific Test / weekly', bold: true, highlight: true },
      { text: 'System Design Proctored Test', bold: true, highlight: true },
      { text: 'Future extension at ~40% cost (₹200/mon)', bold: true }
    ],
    ctaText: 'Claim 1-Year Plus Access',
    ctaVariant: 'primary'
  },
  {
    id: 'compete',
    name: 'Compete',
    badge: '👑 1-YEAR ULTIMATE FELLOWSHIP • 30% OFF',
    isPopular: false,
    duration: '12m',
    durationMonths: 12,
    durationLabel: '12 Months',
    commitmentText: 'with a commitment of 12 months',
    price: 5880, // 30% off ₹700/mo (₹490 x 12)
    priceFormatted: '₹5,880',
    monthlyPrice: 490,
    monthlyPriceFormatted: '₹490',
    originalPrice: '₹8,400',
    originalMonthlyPrice: '₹700',
    discount: '30% OFF',
    period: 'mon',
    dailyCost: 16,
    dailyText: '~₹16 / day',
    chaiComparison: 'Just 1 tapri tea with a friend ☕',
    pitch: 'The gold-standard 365-day placement program covering every FAANG & Tier-1 assessment.',
    accentColor: '#10B981',
    extensionCost: 280,
    extensionFormatted: '₹280/mon',
    inheritedLabel: 'Everything from Plus & Starter, plus:',
    features: [
      { text: 'Access to Any 5 Premium Courses of your choice', bold: true, highlight: true },
      { text: '2,000+ exclusive DSA challenges', bold: true, highlight: true },
      { text: '10 AI Mock Interview Access Company / Role Based', bold: true, highlight: true },
      { text: '4 Company Specific Test / weekly', bold: true, highlight: true },
      { text: 'Full System Design Proctored Curriculum', bold: true, highlight: true },
      { text: 'Aptitude, Verbal & Psychometric Tests', bold: true, highlight: true },
      { text: 'Future extension at ~40% cost (₹280/mon)', bold: true }
    ],
    ctaText: 'Go All-In for 1 Year',
    ctaVariant: 'slate'
  }
];

const PLANS_BY_DURATION = {
  '1m': PLANS_1M_DATA,
  '3m': PLANS_3M_DATA,
  '6m': PLANS_6M_DATA,
  '12m': PLANS_12M_DATA,
};

const PLANS_DATA = PLANS_6M_DATA;

/* ── FAQs ── */
const FAQS = [
  {
    q: 'How do duration commitment discounts work?',
    a: 'You can choose between flexible 1-Month access (Starter ₹249/mo, Plus ₹500/mo, Compete ₹700/mo), or save with multi-month commitments: 3 Months gets 10% OFF, 6 Months gets 20% OFF, and 12 Months gets our MAX 30% OFF across all plans (Starter from ₹174/mon, Plus from ₹350/mon, Compete from ₹490/mon).'
  },
  {
    q: 'What happens after my commitment plan ends?',
    a: 'You never lose your learning investments! Post-plan end, you retain permanent lifetime access to all video lectures in your enrolled programs. Furthermore, all practice questions, coding challenges, and solutions unlocked up to where you practiced remain available permanently in your student dashboard.'
  },
  {
    q: 'Can I extend my subscription after my plan ends?',
    a: 'Yes! Whenever you need more active AI mock interviews, new proctored exam attempts, or cloud sandbox execution, you can extend your full active subscription anytime at near 40% of base rate (Starter: ₹99/mon, Plus: ₹200/mon, Compete: ₹280/mon).'
  },
  {
    q: 'How does the plan validity work?',
    a: 'Your access begins the moment your payment completes and stays active for your full selected duration (30, 90, 180, or 365 days). You get unlimited access to practice sandboxes, recorded modules, and scheduled mock interviews throughout this period.'
  },
  {
    q: 'What is the quirky chai/daily math you mentioned?',
    a: 'We calculated the daily cost: Starter is only ~₹5–₹8/day, Plus is ~₹11–₹16/day, and Compete is ~₹16–₹23/day. Most college students spend more on a single cutting chai or canteen snack than the cost of landing a 12+ LPA software role!'
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

/* ── Program Selection Options (Upto 2 in Starter, 3 in Plus, 5 in Compete • Extra at ₹399/ea) ── */
const EXTRA_COURSE_PRICE = 399;

const PROGRAM_OPTIONS = [
  {
    id: 'fsd',
    title: 'Full Stack Development',
    subtitle: 'Next.js 15, React 19, Node.js, Express, Microservices & Cloud Architectures',
    tag: 'Web & Cloud',
    icon: Laptop,
    lectures: 'Lecture Included',
    hours: '65+ Hours of HD Video',
    lecturesCount: '48 Comprehensive Lectures',
    projectsCount: '6 Production Projects',
    overview: 'Master modern full-stack web engineering using Next.js 15 App Router, React Server Components, TypeScript, PostgreSQL, Prisma, Redis, and cloud architectures.',
    modules: [
      {
        title: 'Modern Frontend with Next.js 15 & React 19',
        items: [
          'Next.js 15 App Router Architecture & Directory Conventions',
          'React Server Components (RSC) vs Client Components',
          'Server Actions, Form Mutations & Optimistic UI Updates',
          'Tailwind CSS, Shadcn UI & Responsive Production Layouts'
        ]
      },
      {
        title: 'Scalable Backend Services & APIs',
        items: [
          'Node.js & Express.js Internal Event Loops & Async Execution',
          'RESTful API Design & Enterprise Best Practices',
          'Type-Safe APIs with tRPC & Zod Validation',
          'Authentication & Authorization with NextAuth / JWT'
        ]
      },
      {
        title: 'Relational & NoSQL Database Mastery',
        items: [
          'PostgreSQL Schema Design, Indexes & Query Optimization',
          'ORM Modeling with Prisma & Drizzle',
          'Redis for High-Speed In-Memory Caching & Session Storage',
          'Database Migrations & Transaction Isolation Levels'
        ]
      },
      {
        title: 'Real-Time Systems & Microservices',
        items: [
          'WebSockets & Socket.io for Real-Time Feeds & Chat',
          'Message Queues with BullMQ & Redis Workers',
          'Microservices Communication & Asynchronous Processing',
          'Rate Limiting, CORS & Production Security Hardening'
        ]
      },
      {
        title: 'DevOps, Docker & Cloud Deployment',
        items: [
          'Containerizing Next.js & Node Apps with Multi-stage Docker',
          'CI/CD Pipelines with GitHub Actions & Automated Testing',
          'Deployment on AWS (EC2, S3, RDS) & Vercel Edge Network',
          'Production Logging, APM Monitoring & Scalability Tuning'
        ]
      }
    ]
  },
  {
    id: 'dbms',
    title: 'DBMS',
    subtitle: 'Relational SQL, NoSQL, PostgreSQL, Indexing, Transactions & Distributed Data',
    tag: 'Databases & Systems',
    icon: Database,
    lectures: 'Lecture Included',
    hours: '45+ Hours of HD Video',
    lecturesCount: '38 Detailed Lectures',
    projectsCount: '4 Real-World Database Projects',
    overview: 'Deep dive into Database Management Systems from relational schema design and SQL query optimization to indexing internals, ACID guarantees, and distributed database sharding.',
    modules: [
      {
        title: 'Relational Data Modeling & Schema Design',
        items: [
          'Relational Algebra & Entity-Relationship (ER) Modeling',
          'Functional Dependencies & Normalization (1NF, 2NF, 3NF, BCNF)',
          'PostgreSQL Advanced DDL, Constraints & Table Partitioning',
          'Schema Migrations & Production Zero-Downtime Alterations'
        ]
      },
      {
        title: 'Advanced SQL Querying & Analytics',
        items: [
          'Complex Joins (Inner, Outer, Cross, Self) & Set Operations',
          'Window Functions: ROW_NUMBER(), RANK(), LEAD(), LAG()',
          'Correlated Subqueries vs Common Table Expressions (CTEs)',
          'Recursive Queries & Hierarchical Data Handling'
        ]
      },
      {
        title: 'Database Internals & Indexing Architecture',
        items: [
          'Storage Engines, Buffer Pool Management & Page Layouts',
          'B+ Tree Index Internals, Search & Split Mechanisms',
          'Hash Indexes, GIN/GiST Indexes & Full-Text Search',
          'Query Execution Plans (EXPLAIN ANALYZE) & Cost Optimization'
        ]
      },
      {
        title: 'Transactions, Concurrency & ACID Guarantees',
        items: [
          'ACID Properties & Write-Ahead Logging (WAL)',
          'Concurrency Anomalies: Dirty Reads, Non-repeatable Reads & Phantoms',
          'Transaction Isolation Levels & Multi-Version Concurrency Control (MVCC)',
          'Two-Phase Locking (2PL), Deadlocks & Resolution Strategies'
        ]
      },
      {
        title: 'Distributed Systems & NoSQL Databases',
        items: [
          'Distributed Data Architectures, Master-Replica & Multi-Master',
          'Database Sharding Strategies (Range vs Hash) & Hotspot Mitigation',
          'CAP Theorem & PACELC Model in Distributed Data Stores',
          'NoSQL Paradigms: Document (MongoDB), Key-Value (Redis) & Columnar'
        ]
      }
    ]
  },
  {
    id: 'clouddevops',
    title: 'Cloud & DevOps',
    subtitle: 'Docker, Kubernetes, AWS, Terraform, CI/CD & Production Infrastructure',
    tag: 'DevOps & Cloud',
    icon: Terminal,
    lectures: 'Lecture Included',
    hours: '55+ Hours of HD Video',
    lecturesCount: '42 Hands-on Lectures',
    projectsCount: '15 Real Cloud Infrastructure Labs',
    overview: 'Master modern cloud infrastructure, Docker containerization, Kubernetes orchestration, CI/CD automation, Infrastructure as Code (Terraform), and AWS cloud architectures.',
    modules: [
      {
        title: 'Linux Administration & Cloud Fundamentals',
        items: [
          'Linux Kernel, Processes, File Permissions & Systemd',
          'Shell Scripting, Bash Automation & Cron Scheduling',
          'Networking: DNS, TCP/IP, OSI Layers & Reverse Proxies',
          'AWS Cloud Core: VPC, Subnets, EC2 & IAM Roles'
        ]
      },
      {
        title: 'Containerization with Docker',
        items: [
          'Container Internals: Namespaces, Cgroups & UnionFS',
          'Writing Optimized Multi-Stage Dockerfiles',
          'Docker Compose for Multi-Container Local Stacks',
          'Container Security, Non-Root Users & Vulnerability Scanning'
        ]
      },
      {
        title: 'Kubernetes Orchestration from Zero to Prod',
        items: [
          'Kubernetes Architecture: Control Plane vs Worker Nodes',
          'Pods, Deployments, ReplicaSets & Rollout Strategies',
          'Services (ClusterIP, NodePort, LoadBalancer) & Ingress',
          'ConfigMaps, Secrets, Volumes & Persistent Volume Claims (PVC)',
          'Helm Charts for Package Management in Kubernetes'
        ]
      },
      {
        title: 'CI/CD Pipelines & GitOps Workflows',
        items: [
          'Automated Testing & Linting with GitHub Actions',
          'Building & Pushing Images to AWS ECR / Docker Hub',
          'GitOps Deployment using ArgoCD into Kubernetes',
          'Zero-Downtime Blue/Green & Canary Deployments'
        ]
      },
      {
        title: 'Infrastructure as Code (IaC) & Monitoring',
        items: [
          'Terraform Fundamentals, Providers, State Management & Modules',
          'Automating AWS VPC & EKS Cluster Creation with Terraform',
          'Metrics Collection with Prometheus & Grafana Dashboards',
          'Centralized Log Aggregation with ELK Stack'
        ]
      }
    ]
  },
  {
    id: 'dsa',
    title: 'Data Structure & Algorithms',
    subtitle: '500+ Exclusive Challenges, High-Frequency Patterns & FAANG Problem Solving',
    tag: 'Core Coding',
    icon: Code2,
    lectures: 'Lecture Included',
    hours: '80+ Hours of HD Video',
    lecturesCount: '70 Detailed Lectures',
    projectsCount: '500+ Exclusive DSA Challenges',
    overview: 'Comprehensive mastery of algorithms and data structures required to ace product-based company coding interviews (Google, Amazon, Microsoft, Uber).',
    modules: [
      {
        title: 'Algorithmic Foundations & Complexity Analysis',
        items: [
          'Asymptotic Notations (Big-O, Omega, Theta) & Math Tools',
          'Two Pointers Technique & Sliding Window Mastery',
          'Prefix Sums, Kadane Algorithm & Bit Manipulation Tricks',
          'Binary Search & Monotonic Function Search Spaces'
        ]
      },
      {
        title: 'Linear Data Structures In-Depth',
        items: [
          'Arrays, Strings & In-Place Manipulations',
          'Singly, Doubly & Circular Linked Lists with Pointer Manipulation',
          'Stacks, Queues, Deques & Monotonic Stack Applications',
          'Expression Evaluation & Next Greater Element Variations'
        ]
      },
      {
        title: 'Non-Linear Structures: Trees & Heaps',
        items: [
          'Binary Trees, Traversals (Pre/In/Post/Level) & Views',
          'Binary Search Trees (BST), Insertion, Deletion & LCA',
          'Priority Queues, Binary Heaps & Top-K Problems',
          'Trie Data Structure for String Prefix & Auto-complete'
        ]
      },
      {
        title: 'Graph Algorithms & Advanced Networks',
        items: [
          'Graph Representations (Adjacency Matrix vs List)',
          'BFS, DFS, Connected Components & Cycle Detection',
          'Topological Sort (Kahn\'s Algorithm) & Bipartite Graphs',
          'Shortest Paths (Dijkstra, Bellman-Ford, Floyd-Warshall)',
          'Minimum Spanning Trees (Kruskal & Prim with Disjoint Set Union)'
        ]
      },
      {
        title: 'Dynamic Programming & Backtracking Mastery',
        items: [
          'Recursion Trees, Memoization vs Bottom-up Tabulation',
          'Classic 1D DP: Fibonacci, Climbing Stairs & House Robber',
          '2D DP: Grid Paths, 0/1 Knapsack & Unbounded Knapsack',
          'Longest Common Subsequence (LCS) & Edit Distance Patterns',
          'DP on Trees & DP with Bitmasking'
        ]
      }
    ]
  },
  {
    id: 'genai',
    title: 'Gen AI',
    subtitle: 'Generative AI, Transformer Architecture, RAG Pipelines & Autonomous Agents',
    tag: 'AI & Machine Learning',
    icon: Bot,
    lectures: 'Lecture Included',
    hours: '60+ Hours of HD Video',
    lecturesCount: '45 Deep-Dive Lectures',
    projectsCount: '8 End-to-End AI Applications',
    overview: 'From ML fundamentals to state-of-the-art Generative AI, LLMs, RAG architectures, prompt engineering, vector databases, and autonomous AI agents.',
    modules: [
      {
        title: 'ML Fundamentals & Deep Learning Primer',
        items: [
          'Supervised vs Unsupervised Learning & Cost Functions',
          'Neural Networks, Activation Functions & Backpropagation',
          'Convolutional & Recurrent Neural Networks Overview',
          'Python Data Science Stack: PyTorch, NumPy & Pandas'
        ]
      },
      {
        title: 'Transformer Architecture & Large Language Models',
        items: [
          'Self-Attention Mechanisms & Multi-Head Attention Mathematics',
          'BERT (Encoder) vs GPT (Decoder) Architectures',
          'Tokenization, Embeddings & Positional Encodings',
          'OpenAI, Anthropic & Hugging Face API Integrations'
        ]
      },
      {
        title: 'Retrieval-Augmented Generation (RAG) Systems',
        items: [
          'RAG Pipeline Architecture: Chunking, Indexing & Retrieval',
          'Vector Embeddings & Semantic Search Mathematics',
          'Vector Databases: Pinecone, ChromaDB & PGVector',
          'Building Production RAG with LangChain & LlamaIndex'
        ]
      },
      {
        title: 'Prompt Engineering & Fine-Tuning LLMs',
        items: [
          'Few-Shot Prompting, Chain-of-Thought (CoT) & ReAct Frameworks',
          'Parameter-Efficient Fine-Tuning (PEFT) & LoRA / QLoRA',
          'Instruction Tuning with Custom Datasets',
          'Model Evaluation Rubrics & Hallucination Mitigation'
        ]
      },
      {
        title: 'Autonomous AI Agents & Production Deployment',
        items: [
          'Building Autonomous Multi-Agent Workflows with LangGraph',
          'Tool Calling, Function Calling & External API Actions',
          'Optimizing Latency: Quantization (GGUF, AWQ) & vLLM Serving',
          'Deploying Scalable AI Microservices on Cloud'
        ]
      }
    ]
  },
  {
    id: 'datascience',
    title: 'Data Science',
    subtitle: 'Python Data Stack, Statistical Modeling, Machine Learning & Predictive Analytics',
    tag: 'Data & Analytics',
    icon: BarChart2,
    lectures: 'Lecture Included',
    hours: '50+ Hours of HD Video',
    lecturesCount: '40 Practical Lectures',
    projectsCount: '10 Hands-on Data Projects',
    overview: 'Master the complete data science lifecycle from exploratory data analysis, statistics, and machine learning modeling to production model evaluation and storytelling.',
    modules: [
      {
        title: 'Python for Data Science & Vectorized Computing',
        items: [
          'NumPy Array Manipulation, Broadcasting & Math Operations',
          'Pandas DataFrames, Data Cleaning, Wrangling & Aggregations',
          'Data Ingestion from APIs, SQL Databases, Parquet & CSV Files',
          'Vectorized Operations & High-Performance Data Processing'
        ]
      },
      {
        title: 'Exploratory Data Analysis (EDA) & Data Visualization',
        items: [
          'Visualizing Distributions with Matplotlib & Seaborn',
          'Outlier Detection, Skewness Correction & Missing Value Imputation',
          'Correlation Matrices, Heatmaps & Multicollinearity Analysis (VIF)',
          'Interactive Visualizations with Plotly & Dashboards'
        ]
      },
      {
        title: 'Applied Statistics & Hypothesis Testing',
        items: [
          'Descriptive vs Inferential Statistics & Central Limit Theorem',
          'Probability Distributions (Normal, Binomial, Poisson)',
          'Hypothesis Testing: T-Tests, ANOVA, Chi-Square & P-Values',
          'A/B Testing Methodologies & Sample Size Determination'
        ]
      },
      {
        title: 'Supervised & Unsupervised Machine Learning',
        items: [
          'Linear & Logistic Regression, Regularization (L1 Lasso, L2 Ridge)',
          'Decision Trees, Random Forests, XGBoost & LightGBM Ensembles',
          'Unsupervised Clustering: K-Means, Hierarchical & DBSCAN',
          'Dimensionality Reduction: PCA & t-SNE'
        ]
      },
      {
        title: 'Model Evaluation, ML Pipelines & Deployment',
        items: [
          'Evaluation Metrics: Precision, Recall, F1-Score, ROC-AUC & Confusion Matrix',
          'Cross-Validation, K-Fold & Hyperparameter Tuning (Optuna / GridSearchCV)',
          'Building End-to-End Scikit-Learn Preprocessing Pipelines',
          'Deploying ML Inference APIs with FastAPI & Streamlit'
        ]
      }
    ]
  },
  {
    id: 'prompteng',
    title: 'Prompt Engineering',
    subtitle: 'Advanced Prompt Architectures, CoT, RAG Grounding, LLM Evals & Guardrails',
    tag: 'AI Engineering',
    icon: Zap,
    lectures: 'Lecture Included',
    hours: '35+ Hours of HD Video',
    lecturesCount: '30 Masterclass Lectures',
    projectsCount: '12 Real-World Enterprise Prompts & Agents',
    overview: 'Learn how to systematically program Large Language Models with advanced prompt patterns, context window optimization, few-shot reasoning, structured outputs, and security guardrails.',
    modules: [
      {
        title: 'LLM Foundations & Core Prompt Mechanics',
        items: [
          'How LLMs Process Context: Tokenizers, Attention & Sampling (Temp, Top-P)',
          'Anatomy of an Effective Prompt: Directives, Context, Output Constraints',
          'System vs User vs Assistant Role Prompting Strategies',
          'Handling Context Windows & Needle-in-a-Haystack Retrieval'
        ]
      },
      {
        title: 'Advanced Reasoning & Problem-Solving Patterns',
        items: [
          'Zero-Shot vs Few-Shot Prompting with Calibrated Exemplars',
          'Chain-of-Thought (CoT) & Least-to-Most Decomposition',
          'Tree of Thoughts (ToT) & Self-Consistency Sampling',
          'ReAct (Reason + Act) Framework for Tool Use'
        ]
      },
      {
        title: 'Structured Outputs, Data Extraction & Function Calling',
        items: [
          'Reliable JSON Schema Enforcement & Pydantic Validation',
          'Function Calling & Tool Definition for External API Triggers',
          'Synthetic Data Generation & Data Extraction from Unstructured Text',
          'Multi-Modal Prompting with Vision & Audio Inputs'
        ]
      },
      {
        title: 'Prompt Security, Jailbreaks & Safety Guardrails',
        items: [
          'Understanding Direct & Indirect Prompt Injections',
          'Defending Against Jailbreaks, System Prompt Leaks & Hijacking',
          'Implementing Guardrails with NeMo Guardrails & Llama Guard',
          'PII Masking & Responsible AI Safety Rubrics'
        ]
      },
      {
        title: 'Automated Prompt Optimization & LLM Evaluation',
        items: [
          'Building Automated Evaluation Pipelines with Ragas & DeepEval',
          'LLM-as-a-Judge Evaluation Frameworks & Accuracy Scoring',
          'Prompt Versioning & CI/CD for Production Prompts',
          'DSPy: Programming Foundation Models with Self-Optimizing Prompts'
        ]
      }
    ]
  },
  {
    id: 'fde',
    title: 'Forward Deployed Engineer - FDE',
    subtitle: 'Enterprise Client Architecture, High-Stakes Integration & Palantir-Style Playbooks',
    tag: 'Enterprise Engineering',
    icon: Workflow,
    lectures: 'Lecture Included',
    hours: '45+ Hours of HD Video',
    lecturesCount: '36 Industry Lectures',
    projectsCount: '5 Enterprise Capstone Integrations',
    overview: 'Master the coveted Forward Deployed Software Engineer (FDE) role combining high-level systems architecture, custom enterprise integrations, rapid client prototyping, and high-stakes production debugging.',
    modules: [
      {
        title: 'The FDE Paradigm & High-Impact Prototyping',
        items: [
          'The Forward Deployed Engineer Role: Engineering Meets Mission Critical Impact',
          'Palantir & Scale AI FDE Playbooks: Discovery to Production Delivery',
          'Rapid 48-Hour Prototyping: Turning Vague Requirements into Working Systems',
          'Architecture Trade-offs: Speed of Delivery vs Long-Term Maintainability'
        ]
      },
      {
        title: 'Enterprise Systems Architecture & Legacy Integration',
        items: [
          'Integrating with Complex Legacy Stacks, SOAP/REST APIs & Webhooks',
          'Identity Federation: SSO, SAML, OAuth2 & Enterprise RBAC',
          'Air-Gapped & On-Premises Deployment Architectures',
          'Data Ingestion from Heterogeneous Sources (Kafka, Databases, SFTP)'
        ]
      },
      {
        title: 'High-Stakes Production Debugging & Incident Triage',
        items: [
          'Live Client Production Debugging Under High Stakes & SLAs',
          'Distributed Tracing with OpenTelemetry, Jaeger & Log Aggregation',
          'Root Cause Analysis (RCA) & Post-Mortem Best Practices',
          'Performance Bottleneck Profiling (CPU, Memory, Network Latency)'
        ]
      },
      {
        title: 'Data Reliability & Scalable ETL Pipelines',
        items: [
          'Building Resilient Batch & Streaming Ingestion Pipelines',
          'Schema Evolution, Dead Letter Queues & Fault-Tolerant Retries',
          'Data Quality Gates & Automated Validation Rules',
          'Data Governance, Audit Logging & Compliance (SOC2 / GDPR)'
        ]
      },
      {
        title: 'Technical Leadership & Client-Facing Execution',
        items: [
          'Executive Technical Presentations & Live Architecture Walkthroughs',
          'Translating Business Pain Points into Concrete Technical Milestones',
          'Managing Client Technical Objections & Scope Creep',
          'Handoff Frameworks & Training Client Engineering Teams'
        ]
      }
    ]
  }
];

const getMaxCoursesForPlan = (planId) => {
  if (planId === 'compete') return 5;
  if (planId === 'plus') return 3;
  return 2; // Starter
};

const getDefaultProgramsForPlan = (planId) => {
  if (planId === 'compete') return ['fsd', 'dbms', 'clouddevops', 'dsa', 'genai'];
  if (planId === 'plus') return ['fsd', 'dbms', 'dsa'];
  return ['fsd', 'dsa'];
};

/* ── Side-by-Side Comparison Matrix with Ticks & Crosses ── */
const COMPARISON_GROUPS = [
  {
    category: 'Core Curriculum & Programs',
    features: [
      {
        name: 'Access to Premium Courses Included',
        desc: 'Choose from Full Stack, DBMS, Cloud & DevOps, DSA, Gen AI, Data Science, Prompt Eng & FDE (Add more at ₹399/course)',
        starter: '2 Included (Extra ₹399/ea)',
        plus: '3 Included (Extra ₹399/ea)',
        compete: '5 Included (Extra ₹399/ea)',
        starterType: 'badge-highlight',
        plusType: 'badge-highlight',
        competeType: 'badge-highlight'
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
        name: 'Exclusive DSA Challenges',
        desc: 'Curated problem sets across arrays, trees, graphs, DP',
        starter: '500+ Exclusive Challenges',
        plus: '1,000+ Exclusive Challenges',
        compete: '2,000+ Exclusive Challenges',
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
        name: 'AI Mock Interview Access Company / Role Based',
        desc: 'Real-time voice & coding interview simulator with rubric feedback',
        starter: '3 AI Mocks',
        plus: '5 AI Mocks',
        compete: '10 AI Mocks',
        starterType: 'badge',
        plusType: 'badge-highlight',
        competeType: 'badge-highlight'
      },
      {
        name: 'Company Specific Test / weekly',
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
        desc: 'Extend active subscription anytime at near 40% of base rate',
        starter: '₹99/mon',
        plus: '₹200/mon',
        compete: '₹280/mon',
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

const DURATION_PILL_OPTIONS = [
  { 
    id: '1m', 
    title: '1 Month', 
    sub: 'From ₹249/mon • Flexible', 
    discountBadge: null,
    badgeClass: '' 
  },
  { 
    id: '3m', 
    title: '3 Months', 
    sub: 'From ₹224/mon • Fast-Track', 
    discountBadge: '10% OFF',
    badgeClass: 'badge-upon-green' 
  },
  { 
    id: '6m', 
    title: '6 Months', 
    sub: 'From ₹199/mon • Full Runway', 
    discountBadge: '🔥 20% OFF',
    badgeClass: 'badge-upon-orange' 
  },
  { 
    id: '12m', 
    title: '12 Months', 
    sub: 'From ₹174/mon • 1-Year Track', 
    discountBadge: '30% OFF',
    badgeClass: 'badge-upon-purple' 
  },
];

const PremiumPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('6m'); // '6m' or '3m'
  
  // Checkout Modal State
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);
  const [selectedPrograms, setSelectedPrograms] = useState(['fsd', 'dsa']);
  const [viewingSyllabusProgram, setViewingSyllabusProgram] = useState(null);
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

  const handleOpenCheckout = (planOrId) => {
    let plan = planOrId;
    if (typeof planOrId === 'string') {
      plan = activePlans.find(p => p.id === planOrId) || PLANS_6M_DATA.find(p => p.id === planOrId);
    }
    setSelectedPlanForModal(plan);
    setSelectedPrograms(getDefaultProgramsForPlan(plan?.id));
    setCouponCode('');
    setCouponApplied(false);
    setDiscountAmount(0);
    setIsSuccessState(false);
    setViewingSyllabusProgram(null);
  };

  const switchModalDuration = (targetDuration) => {
    if (!selectedPlanForModal) return;
    const targetList = PLANS_BY_DURATION[targetDuration] || PLANS_6M_DATA;
    const matchedPlan = targetList.find(p => p.id === selectedPlanForModal.id);
    if (matchedPlan) {
      setSelectedPlanForModal(matchedPlan);
    }
  };

  const handleCloseCheckout = () => {
    setSelectedPlanForModal(null);
    setViewingSyllabusProgram(null);
  };

  const baseAllowedCourses = getMaxCoursesForPlan(selectedPlanForModal?.id);
  const extraCoursesCount = Math.max(0, selectedPrograms.length - baseAllowedCourses);
  const extraCoursesCost = extraCoursesCount * EXTRA_COURSE_PRICE;
  const totalPlanPayable = Math.max(0, (selectedPlanForModal?.price || 0) + extraCoursesCost - discountAmount);

  const handleToggleProgram = (programId) => {
    if (selectedPrograms.includes(programId)) {
      if (selectedPrograms.length <= 1) {
        alert('Please keep at least 1 premium course selected.');
        return;
      }
      setSelectedPrograms(prev => prev.filter(id => id !== programId));
    } else {
      setSelectedPrograms(prev => [...prev, programId]);
    }
  };

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
    if (selectedPrograms.length < 1) {
      alert(`Please select at least 1 premium course for your ${selectedPlanForModal?.name || ''} plan.`);
      return;
    }
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill out your name, email, and phone number.');
      return;
    }
    setIsSuccessState(true);
  };

  const activePlans = PLANS_BY_DURATION[selectedDuration] || PLANS_6M_DATA;

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

        {/* ── Pill-Shaped Duration Switcher with Floating Upon-Badges ── */}
        <div className="duration-selector-wrap">
          <div className="duration-toggle-pillbox">
            {DURATION_PILL_OPTIONS.map((opt) => {
              const isActive = selectedDuration === opt.id;
              return (
                <button 
                  key={opt.id}
                  type="button"
                  className={`duration-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedDuration(opt.id)}
                >
                  {opt.discountBadge && (
                    <span className={`duration-upon-badge ${opt.badgeClass}`}>
                      {opt.discountBadge}
                    </span>
                  )}
                  <span className="duration-tab-title">{opt.title}</span>
                  <span className="duration-tab-tag">{opt.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

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
                    <span className="price-figure">{plan.monthlyPriceFormatted}</span>
                    <span className="price-period">/ mon</span>
                  </div>
                  <div className="price-commitment-line">
                    <span className="price-commitment-badge">with a commitment of {plan.durationLabel}</span>
                    <span className="price-total-billed">Billed {plan.priceFormatted} upfront</span>
                  </div>
                  <div className="price-sub-line">
                    <span className="price-original">{plan.originalMonthlyPrice}/mon</span>
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
                          {activePlans.find(p => p.id === 'starter')?.monthlyPriceFormatted}
                          <span className="th-plan-period">/ mon</span>
                        </div>
                        <div className="th-plan-commitment">
                          with {activePlans.find(p => p.id === 'starter')?.durationLabel} commitment ({activePlans.find(p => p.id === 'starter')?.priceFormatted})
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
                          {activePlans.find(p => p.id === 'plus')?.monthlyPriceFormatted}
                          <span className="th-plan-period">/ mon</span>
                        </div>
                        <div className="th-plan-commitment">
                          with {activePlans.find(p => p.id === 'plus')?.durationLabel} commitment ({activePlans.find(p => p.id === 'plus')?.priceFormatted})
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
                          {activePlans.find(p => p.id === 'compete')?.monthlyPriceFormatted}
                          <span className="th-plan-period">/ mon</span>
                        </div>
                        <div className="th-plan-commitment">
                          with {activePlans.find(p => p.id === 'compete')?.durationLabel} commitment ({activePlans.find(p => p.id === 'compete')?.priceFormatted})
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
                onClick={() => handleOpenCheckout(activePlans[1])}
              >
                <span>Get Plus Plan ({activePlans[1]?.monthlyPriceFormatted}/mon • {activePlans[1]?.durationLabel})</span>
                <ArrowRight size={16} />
              </button>
              <button 
                className="btn-banner-secondary"
                onClick={() => handleOpenCheckout(activePlans[2])}
              >
                <span>Go All-In with Compete ({activePlans[2]?.monthlyPriceFormatted}/mon • {activePlans[2]?.durationLabel})</span>
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
                          className={`modal-duration-pill ${selectedPlanForModal.duration === '1m' ? 'active' : ''}`}
                          onClick={() => switchModalDuration('1m')}
                        >
                          <span>1 Month</span>
                        </button>
                        <button
                          type="button"
                          className={`modal-duration-pill ${selectedPlanForModal.duration === '3m' ? 'active' : ''}`}
                          onClick={() => switchModalDuration('3m')}
                        >
                          <span>3 Months</span>
                          <span className="modal-pill-discount">10% OFF</span>
                        </button>
                        <button
                          type="button"
                          className={`modal-duration-pill ${selectedPlanForModal.duration === '6m' ? 'active' : ''}`}
                          onClick={() => switchModalDuration('6m')}
                        >
                          <span>6 Months</span>
                          <span className="modal-pill-discount modal-pill-orange">20% OFF</span>
                        </button>
                        <button
                          type="button"
                          className={`modal-duration-pill ${selectedPlanForModal.duration === '12m' ? 'active' : ''}`}
                          onClick={() => switchModalDuration('12m')}
                        >
                          <span>12 Months</span>
                          <span className="modal-pill-discount modal-pill-purple">30% OFF</span>
                        </button>
                      </div>
                    </div>

                    <h3 className="checkout-title">
                      Complete Your {selectedPlanForModal.durationLabel} Commitment Enrollment
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
                        <strong>{selectedPlanForModal.name} ({selectedPlanForModal.durationLabel} Commitment)</strong>
                      </div>
                      <div className="summary-row">
                        <span>Rate</span>
                        <strong className="text-orange-600 font-bold">{selectedPlanForModal.monthlyPriceFormatted} / mon</strong>
                      </div>
                      <div className="summary-row">
                        <span>Commitment Total</span>
                        <span>{selectedPlanForModal.priceFormatted} upfront</span>
                      </div>
                      <div className="summary-row">
                        <span>Validity</span>
                        <span>{selectedPlanForModal.durationMonths * 30} Days Full Access</span>
                      </div>
                      <div className="summary-row">
                        <span>Daily Breakdown</span>
                        <span className="text-orange-600 font-semibold">{selectedPlanForModal.dailyText}</span>
                      </div>

                      {selectedPlanForModal.discount && (
                        <div className="summary-row text-emerald-600 font-semibold">
                          <span>Commitment Drop</span>
                          <span>{selectedPlanForModal.discount} Applied</span>
                        </div>
                      )}

                      <div className="summary-row">
                        <span>{selectedPlanForModal.name} Plan ({selectedPlanForModal.durationLabel})</span>
                        <span>{selectedPlanForModal.priceFormatted}</span>
                      </div>

                      {extraCoursesCount > 0 && (
                        <div className="summary-row text-orange-600 font-semibold">
                          <span>Extra Courses ({extraCoursesCount} × ₹{EXTRA_COURSE_PRICE})</span>
                          <span>+ ₹{extraCoursesCost}</span>
                        </div>
                      )}

                      <div className="summary-courses-group">
                        <div className="summary-row summary-courses-header-row">
                          <span>Selected Courses</span>
                          <span className="summary-courses-counter">
                            {selectedPrograms.length} of {baseAllowedCourses} Included{extraCoursesCount > 0 ? ` + ${extraCoursesCount} Extra` : ''}
                          </span>
                        </div>
                        {selectedPrograms.length > 0 && (
                          <div className="summary-courses-chips">
                            {selectedPrograms.map(id => {
                              const p = PROGRAM_OPTIONS.find(prog => prog.id === id);
                              const isExtra = selectedPrograms.indexOf(id) >= baseAllowedCourses;
                              return (
                                <div key={id} className={`summary-course-chip ${isExtra ? 'chip-extra' : ''}`}>
                                  <span className="chip-name">{p ? p.title : id}</span>
                                  {isExtra ? (
                                    <span className="chip-addon">+₹399</span>
                                  ) : (
                                    <span className="chip-check">✓</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="summary-row text-emerald-600 font-semibold">
                        <span className="summary-lectures-label">
                          <PlayCircle size={13} className="text-emerald-600" />
                          <span>Lectures Access</span>
                        </span>
                        <span className="summary-lectures-status">Included</span>
                      </div>

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
                          ₹{totalPlanPayable}
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
                      
                      {/* Step 1: Course Selection (Upto 2 in Starter, 3 in Plus, 5 in Compete • Extra at ₹399/ea) */}
                      <div className="modal-program-picker">
                        <div className="picker-header">
                          <div>
                            <span className="picker-kicker">STEP 1 • CHOOSE PREMIUM COURSES ({selectedPrograms.length} Selected)</span>
                            <h4 className="picker-title">Select Premium Courses for {selectedPlanForModal.name}</h4>
                          </div>
                          <span className={`picker-status-tag ${extraCoursesCount > 0 ? 'tag-extra' : selectedPrograms.length === baseAllowedCourses ? 'tag-included' : 'tag-all'}`}>
                            {extraCoursesCount > 0 ? (
                              `✓ ${baseAllowedCourses} Included + ${extraCoursesCount} Extra (+₹${extraCoursesCost})`
                            ) : (
                              `✓ ${selectedPrograms.length} of ${baseAllowedCourses} Included Courses Selected`
                            )}
                          </span>
                        </div>

                        <div className="picker-cards-grid">
                          {PROGRAM_OPTIONS.map((prog) => {
                            const isSelected = selectedPrograms.includes(prog.id);
                            const selectedIdx = selectedPrograms.indexOf(prog.id);
                            const isExtraCourse = isSelected && selectedIdx >= baseAllowedCourses;
                            const isAvailableExtra = !isSelected && selectedPrograms.length >= baseAllowedCourses;
                            const IconComp = prog.icon;
                            return (
                              <div
                                key={prog.id}
                                className={`picker-card ${isSelected ? 'selected' : ''} ${isExtraCourse ? 'card-extra-addon' : ''}`}
                                onClick={() => handleToggleProgram(prog.id)}
                              >
                                <div className="picker-card-top">
                                  <span className="picker-tag">{prog.tag}</span>
                                  <div className="picker-card-top-right">
                                    {isExtraCourse ? (
                                      <span className="picker-extra-badge">+₹399 Add-on</span>
                                    ) : isSelected ? (
                                      <span className="picker-included-badge">Included in Plan</span>
                                    ) : isAvailableExtra ? (
                                      <span className="picker-addon-hint">+₹399</span>
                                    ) : null}
                                    <div className={`picker-check-circle ${isSelected ? 'checked' : ''} ${isExtraCourse ? 'circle-extra' : ''}`}>
                                      {isSelected && <Check size={11} strokeWidth={3} />}
                                    </div>
                                  </div>
                                </div>
                                <div className="picker-card-main">
                                  <IconComp size={17} className="picker-icon" />
                                  <span className="picker-card-name">{prog.title}</span>
                                </div>
                                <div className="picker-card-footer">
                                  <div className="picker-lectures-badge">
                                    <PlayCircle size={12} className="picker-lectures-icon" />
                                    <span>{prog.lectures}</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="picker-syllabus-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewingSyllabusProgram(prog);
                                    }}
                                  >
                                    <BookOpen size={12} />
                                    <span>View Syllabus</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="picker-upsell-strip">
                          <div className="upsell-all-active">
                            <Sparkles size={14} className="text-amber-500 flex-shrink-0" />
                            <span>
                              <strong>{selectedPlanForModal.name} Plan includes {baseAllowedCourses} premium courses</strong> with 100% video lectures access kept forever. Need more? Add any extra course for just <strong>₹399 each</strong>!
                              {extraCoursesCount > 0 ? (
                                <span className="text-orange-600 font-bold"> ({extraCoursesCount} extra course{extraCoursesCount > 1 ? 's' : ''} added: +₹{extraCoursesCost})</span>
                              ) : selectedPrograms.length < baseAllowedCourses ? (
                                <span className="text-slate-600"> (You have {baseAllowedCourses - selectedPrograms.length} more included course{baseAllowedCourses - selectedPrograms.length > 1 ? 's' : ''} available)</span>
                              ) : (
                                <span className="text-slate-600"> (Tap any course to add it for ₹399)</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Step 2: Student Information */}
                      <div className="modal-student-box">
                        <div className="student-box-header">
                          <div>
                            <span className="form-legend">STEP 2 • STUDENT INFORMATION</span>
                            <h4 className="student-box-title">Enter Details for Instant Activation</h4>
                          </div>
                          <span className="student-box-sub">Direct access credentials will be delivered to this email</span>
                        </div>
                        
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
                        <span>Proceed to Pay ₹{totalPlanPayable}</span>
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
                  Welcome to CipherSchools {selectedPlanForModal.name} ({selectedPlanForModal.durationLabel} Commitment)! 🚀
                </h3>
                <p className="success-sub">
                  Congratulations <strong>{formData.name}</strong>! Your {selectedPlanForModal.durationMonths * 30}-day commitment access has been activated. A receipt and access link have been dispatched to <strong>{formData.email}</strong>.
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

      {/* Course Syllabus Preview Modal */}
      {viewingSyllabusProgram && (
        <div 
          className="syllabus-modal-backdrop" 
          onClick={() => setViewingSyllabusProgram(null)}
        >
          <div 
            className="syllabus-modal-container" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="syllabus-modal-header">
              <div className="syllabus-header-left">
                <div className="syllabus-header-meta">
                  <span className="picker-tag">{viewingSyllabusProgram.tag}</span>
                  <div className="picker-lectures-badge">
                    <PlayCircle size={12} className="picker-lectures-icon" />
                    <span>Lecture Included</span>
                  </div>
                </div>
                <h3 className="syllabus-title">{viewingSyllabusProgram.title}</h3>
                <p className="syllabus-subtitle">{viewingSyllabusProgram.subtitle}</p>
              </div>
              <button 
                type="button"
                className="syllabus-close-btn"
                onClick={() => setViewingSyllabusProgram(null)}
                aria-label="Close Syllabus"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stats Bar */}
            <div className="syllabus-stats-bar">
              <div className="syllabus-stat-item">
                <PlayCircle size={14} className="text-emerald-600" />
                <span>{viewingSyllabusProgram.lecturesCount || '45+ Lectures Included'}</span>
              </div>
              <div className="syllabus-stat-item">
                <Clock size={14} className="text-blue-600" />
                <span>{viewingSyllabusProgram.hours || '60+ Hours Content'}</span>
              </div>
              <div className="syllabus-stat-item">
                <Code2 size={14} className="text-amber-600" />
                <span>{viewingSyllabusProgram.projectsCount || 'Hands-on Projects'}</span>
              </div>
              <div className="syllabus-stat-item">
                <Award size={14} className="text-purple-600" />
                <span>Lifetime Access</span>
              </div>
            </div>

            {/* Body */}
            <div className="syllabus-modal-body">
              <div className="syllabus-overview-box">
                <strong>Course Overview:</strong> {viewingSyllabusProgram.overview}
              </div>

              <h4 className="syllabus-curriculum-heading">Detailed Course Curriculum & Modules</h4>
              <div className="syllabus-modules-list">
                {viewingSyllabusProgram.modules?.map((mod, idx) => (
                  <div key={idx} className="syllabus-module-card">
                    <div className="syllabus-module-header">
                      <span className="syllabus-module-num">0{idx + 1}</span>
                      <span className="syllabus-module-title">{mod.title}</span>
                    </div>
                    <ul className="syllabus-module-topics">
                      {mod.items.map((item, tIdx) => (
                        <li key={tIdx}>
                          <CheckCircle2 size={13} className="syllabus-topic-check" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="syllabus-modal-footer">
              <div className="syllabus-footer-status">
                {selectedPrograms.includes(viewingSyllabusProgram.id) ? (
                  selectedPrograms.indexOf(viewingSyllabusProgram.id) < baseAllowedCourses ? (
                    <span className="syllabus-selected-indicator">
                      <Check size={14} strokeWidth={3} />
                      Included in your {selectedPlanForModal?.name || 'Selected'} Plan
                    </span>
                  ) : (
                    <span className="syllabus-selected-indicator extra">
                      <Check size={14} strokeWidth={3} />
                      Extra Course Selected (+₹399)
                    </span>
                  )
                ) : (
                  <span className="syllabus-unselected-indicator">
                    {selectedPrograms.length >= baseAllowedCourses 
                      ? `Add-on course for +₹399 (Plan included quota full)`
                      : `Available to add free (${selectedPrograms.length} of ${baseAllowedCourses} included selected)`}
                  </span>
                )}
              </div>
              <div className="syllabus-footer-actions">
                <button
                  type="button"
                  className="syllabus-secondary-btn"
                  onClick={() => setViewingSyllabusProgram(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className={`syllabus-primary-btn ${selectedPrograms.includes(viewingSyllabusProgram.id) ? 'btn-is-selected' : ''}`}
                  onClick={() => {
                    handleToggleProgram(viewingSyllabusProgram.id);
                  }}
                >
                  {selectedPrograms.includes(viewingSyllabusProgram.id) ? (
                    <>
                      <Check size={14} strokeWidth={3} />
                      <span>Selected</span>
                    </>
                  ) : selectedPrograms.length >= baseAllowedCourses ? (
                    <span>+ Add Course (+₹399)</span>
                  ) : (
                    <span>+ Select This Course</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PremiumPage;
