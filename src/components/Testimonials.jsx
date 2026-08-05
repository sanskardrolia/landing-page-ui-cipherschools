import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Sparkles, X } from 'lucide-react';
import './Testimonials.css';

const AvatarImage = ({ src, alt, name }) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (fullName) => {
    if (!fullName) return "CS";
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return fullName.substring(0, 2).toUpperCase();
  };

  if (!src || hasError) {
    return (
      <div className="avatar-fallback">
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="avatar-img" 
      onError={() => setHasError(true)} 
    />
  );
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeStoryModal, setActiveStoryModal] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shuffleDir, setShuffleDir] = useState('next');

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer @ Google",
      company: "Google",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
      story: "32 LPA Package • Google",
      quote: "CipherSchools gave me the structure I needed. The hands-on projects and live compiler completely changed how I prepare for technical interviews. Before I'd get lost or overwhelmed; now I work in structured sprints.",
      fullStory: "Before joining CipherSchools, I was struggling with complex Data Structures and graph algorithms. The structured DSA tracks on CipherLabs and live compiler feedback allowed me to practice 250+ curated interview problems under timed conditions. Combined with 1-on-1 mock interviews by senior engineers, I secured an offer from Google with a 32 LPA package!"
    },
    {
      name: "Ananya Roy",
      role: "VP of Placement, Tech University",
      company: "Tech University",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
      story: "+45% Campus Placements",
      quote: "Partnering with CipherSchools helped us increase our campus placement rate by 45%. Their industry-aligned curriculum and automated assessment platforms are exactly what modern universities need.",
      fullStory: "Our university needed an end-to-end LMS and automated assessment ecosystem to upskill 2,000+ engineering students. CipherSchools deployed custom learning paths, live progress tracking, and industry outcome mapping. Within one academic cycle, our campus placement rate jumped by 45% with top product companies visiting our campus."
    },
    {
      name: "Rahul Verma",
      role: "Fullstack Lead @ Amazon",
      company: "Amazon",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
      story: "SDE Lead in 8 Months",
      quote: "The resume builder and the mock interviews were total game-changers. I went from struggling with core DSA topics to leading complex web architecture teams at Amazon.",
      fullStory: "I started my journey with minimal experience in fullstack web architecture. The guided projects at CipherSchools helped me build 4 production-grade applications with microservices and Docker containers. The automated resume builder highlighted my real skills, helping me stand out to Amazon recruiters and crack SDE Lead in 8 months."
    },
    {
      name: "Jessica Dobrev",
      role: "Data Scientist @ Netflix",
      company: "Netflix",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
      story: "AI & ML Specialist",
      quote: "Mastering System Design and real-world ML workflows on CipherLabs gave me a massive edge in technical architecture rounds during my interviews.",
      fullStory: "Transitioning into Machine Learning required deep hands-on expertise with scalable systems. CipherSchools provided real dataset challenges, distributed training workflows, and end-to-end System Design modules. That hands-on rigor gave me complete confidence during Netflix's technical architecture rounds."
    },
    {
      name: "Orlando Diggs",
      role: "Product Engineer @ Meta",
      company: "Meta",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
      story: "Meta Engineering Team",
      quote: "The continuous 1-on-1 feedback from senior mentors helped me refine my problem-solving speed and architectural trade-off discussions for Meta interviews.",
      fullStory: "CipherSchools' peer coding community and 1-on-1 mentor guidance helped me refine both my coding speed and architectural trade-off discussions. The live compiler and real-time execution environment simulated actual Meta interview rounds, allowing me to succeed with flying colors."
    },
    {
      name: "Vikram Malhotra",
      role: "DevOps Lead @ Microsoft",
      company: "Microsoft",
      image: null,
      story: "QA to DevOps Transition",
      quote: "CipherSchools' structured project roadmap enabled a seamless transition from QA testing to senior Cloud DevOps Lead with hands-on Kubernetes labs.",
      fullStory: "Stuck in a repetitive QA testing role, I wanted to transition into Cloud & DevOps. CipherSchools' hands-on cloud labs covered Kubernetes, CI/CD pipelines, and Terraform infrastructure as code. In 6 months, I built a portfolio of cloud infrastructure projects that led to a Senior DevOps Lead offer at Microsoft."
    }
  ];

  const nextIndex1 = (currentIndex + 1) % testimonials.length;

  // Auto-advance timer (5 seconds), pauses on hover or modal active
  useEffect(() => {
    if (isPaused || activeStoryModal || isAnimating) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, activeStoryModal, isAnimating, testimonials.length]);

  const handleNext = () => {
    if (isAnimating) return;
    setShuffleDir('next');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setIsAnimating(false);
    }, 450);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setShuffleDir('prev');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 450);
  };

  const handleDotClick = (idx) => {
    if (isAnimating || idx === currentIndex) return;
    setShuffleDir(idx > currentIndex ? 'next' : 'prev');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsAnimating(false);
    }, 450);
  };

  const current = testimonials[currentIndex];
  const nextItem = testimonials[nextIndex1];

  return (
    <section className="testimonials-section dark-bg">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center animate-fade-in">
          <div className="tag-brand">
            <Sparkles size={14} /> STUDENT REVIEWS
          </div>
          <h2 className="section-title dark-theme-title">
            Don't just take our word for it.
          </h2>
          <p className="section-subtitle dark-theme-subtitle">
            Hear how CipherSchools transformed careers and helped students land jobs at top tech product companies.
          </p>
        </div>

        {/* 3D Stacked Cards Slider Wrapper */}
        <div 
          className="stacked-slider-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* Functional Left Arrow */}
          <button 
            className="slider-arrow arrow-left" 
            onClick={handlePrev}
            disabled={isAnimating}
            aria-label="Previous Testimonial"
          >
            <ChevronLeft size={28} />
          </button>

          {/* 3D Cards Stack with Shuffle Animation */}
          <div className={`cards-stack ${isAnimating ? `shuffling-${shuffleDir}` : ''}`}>
            
            {/* Background Decorative Layer 2 */}
            <div className="stack-card stack-card-back-2"></div>

            {/* Background Decorative Layer 1 (Card coming next) */}
            <div className="stack-card stack-card-back-1">
              <blockquote className="active-quote-text back-quote-preview">
                "{nextItem.quote}"
              </blockquote>
              <div className="author-row">
                <div className="author-meta">
                  <AvatarImage src={nextItem.image} alt={nextItem.name} name={nextItem.name} />
                  <div className="author-details">
                    <h4 className="author-name-text">{nextItem.name}</h4>
                    <p className="author-role-text">{nextItem.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Foreground Card */}
            <div className={`stack-card stack-card-active ${isAnimating ? `shuffle-card-${shuffleDir}` : ''}`}>
              
              <div className="quote-mark-watermark">
                <Quote size={80} />
              </div>

              <blockquote className="active-quote-text">
                "{current.quote}"
              </blockquote>

              <div className="author-row">
                <div className="author-meta">
                  <AvatarImage src={current.image} alt={current.name} name={current.name} />
                  <div className="author-details">
                    <h4 className="author-name-text">{current.name}</h4>
                    <p className="author-role-text">{current.role}</p>
                  </div>
                </div>

                <button 
                  className="full-story-trigger-btn"
                  onClick={() => setActiveStoryModal(current)}
                >
                  Read Full Story →
                </button>
              </div>

            </div>

          </div>

          {/* Functional Right Arrow */}
          <button 
            className="slider-arrow arrow-right" 
            onClick={handleNext}
            disabled={isAnimating}
            aria-label="Next Testimonial"
          >
            <ChevronRight size={28} />
          </button>

        </div>

        {/* Carousel Indicators / Dots */}
        <div className="slider-indicators">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* --- Clean Minimal Story Modal --- */}
      {activeStoryModal && (
        <div className="story-modal-overlay" onClick={() => setActiveStoryModal(null)}>
          <div className="story-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveStoryModal(null)}>
              <X size={20} />
            </button>

            <div className="clean-modal-header">
              <AvatarImage src={activeStoryModal.image} alt={activeStoryModal.name} name={activeStoryModal.name} />
              <div>
                <h3 className="clean-modal-name">{activeStoryModal.name}</h3>
                <p className="clean-modal-role">{activeStoryModal.role}</p>
              </div>
            </div>

            <div className="clean-modal-body">
              <p className="clean-full-story-text">{activeStoryModal.fullStory}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
