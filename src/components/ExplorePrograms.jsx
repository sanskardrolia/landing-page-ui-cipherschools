import React from 'react';
import { PlayCircle } from 'lucide-react';
import './ExplorePrograms.css';

const ExplorePrograms = () => {
  const programs = [
    {
      title: "Data Structures & Algorithms",
      desc: "Master the fundamentals of problem solving and ace your technical interviews with FAANG experts.",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Full-Stack Web Development",
      desc: "Build scalable web applications from scratch. Learn React, Node.js, and modern cloud deployment.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Machine Learning & AI",
      desc: "Dive deep into AI. Build predictive models, train neural networks, and learn real-world GenAI integration.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
    }
  ];

  return (
    <section className="explore-programs section">
      <div className="container relative z-10">
        <div className="section-header text-center animate-fade-in">
          <div className="tag cred-tag" style={{background: 'rgba(243,145,46,0.1)', color: 'var(--primary)'}}>Explore Our Programs</div>
          <h2 className="section-title">Start Learning Today</h2>
          <p className="section-subtitle text-muted">
            High-quality, comprehensive programs designed to take you from beginner to industry-ready.
          </p>
        </div>

        <div className="ep-grid">
          {programs.map((prog, index) => (
            <div className="ep-card" key={index}>
              <div className="ep-image-wrap">
                <img src={prog.image} alt={prog.title} className="ep-image" />
                <div className="ep-free-label">FREE</div>
              </div>
              <div className="ep-content">
                <h3 className="ep-title">{prog.title}</h3>
                <p className="ep-desc">{prog.desc}</p>
                <button className="ep-cta">
                  <PlayCircle size={18} /> Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExplorePrograms;
