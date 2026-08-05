import React from 'react';
import { PlayCircle, Star, Sparkles } from 'lucide-react';
import './ExplorePrograms.css';

const ExplorePrograms = () => {
  const programs = [
    {
      rank: 1,
      title: "Data Structures & Algorithms",
      category: "Interview Prep",
      desc: "Master problem solving & ace technical coding interviews with FAANG experts.",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
      badge: "TOP TRENDING",
    },
    {
      rank: 2,
      title: "Full-Stack Web Development",
      category: "Web & Cloud",
      desc: "Build scalable web applications from scratch using React, Node.js & Cloud AWS.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
      badge: "MOST POPULAR",
    },
    {
      rank: 3,
      title: "Machine Learning & GenAI",
      category: "AI & Data Science",
      desc: "Train neural networks, build predictive ML models & integrate LLMs into production.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
      badge: "NEW RELEASE",
    }
  ];

  return (
    <section className="explore-programs section">
      <div className="container relative z-10">
        
        {/* Section Header */}
        <div className="section-header text-center animate-fade-in">
          <h2 className="section-title dark-theme-title">Our Top Recommendations</h2>
          <p className="section-subtitle dark-theme-subtitle">
            Join thousands of learners building production-ready projects across in-demand technologies.
          </p>
        </div>

        {/* 3D Ranked Poster Grid */}
        <div className="ep-grid">
          {programs.map((prog) => (
            <div className="ep-poster-card" key={prog.rank}>
              
              {/* Giant 3D Rank Number (Overlapping Bottom-Left) */}
              <span className="ep-rank-num">{prog.rank}</span>

              {/* Poster Inner Container */}
              <div className="ep-poster-inner">
                <img src={prog.image} alt={prog.title} className="ep-poster-img" />
                <div className="ep-poster-overlay"></div>

                {/* Top Badges */}
                <div className="ep-poster-header">
                  <span className="ep-badge">{prog.badge}</span>
                  <span className="ep-free-tag">100% FREE</span>
                </div>

                {/* Bottom Content */}
                <div className="ep-poster-content">
                  <span className="ep-category">{prog.category}</span>
                  <h3 className="ep-poster-title">{prog.title}</h3>
                  <p className="ep-poster-desc">{prog.desc}</p>
                  
                  <button className="ep-watch-btn">
                    <PlayCircle size={18} /> Start Watching
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExplorePrograms;
