import React from 'react';
import { Lightbulb, CodeSquare, Network, HeartHandshake, Mic2, Users } from 'lucide-react';
import './ExperienceLayer.css';

const ExperienceLayer = () => {
  const experiences = [
    { icon: <CodeSquare />, title: "Hackathons" },
    { icon: <Lightbulb />, title: "Startup Sessions" },
    { icon: <Network />, title: "Networking" },
    { icon: <Mic2 />, title: "Career Talks" },
    { icon: <HeartHandshake />, title: "Collaborative Learning" },
    { icon: <Users />, title: "Community Events" },
  ];

  return (
    <section className="experience section">
      <div className="container">
        <div className="section-header text-center animate-fade-in">
          <h2 className="section-title">We build doers, not passive learners.</h2>
          <p className="section-subtitle">
            Experience the thrill of building. Engage in real-world scenarios, compete with peers, and learn from industry leaders.
          </p>
        </div>

        <div className="exp-grid">
          <div className="exp-visual-main">
            <div className="hackathon-card">
              <div className="hackathon-badge">Live Now</div>
              <h3>Global Winter Hackathon</h3>
              <p>Build the future of EdTech. $10,000 in prizes.</p>
              <div className="hackathon-stats">
                <div className="stat">
                  <strong>2,450</strong> Participants
                </div>
                <div className="stat">
                  <strong>48h</strong> Remaining
                </div>
              </div>
            </div>
            <div className="background-decor decor-1"></div>
            <div className="background-decor decor-2"></div>
          </div>

          <div className="exp-features">
            {experiences.map((exp, index) => (
              <div className="exp-feature-card" key={index}>
                <div className="exp-icon">{exp.icon}</div>
                <h4>{exp.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceLayer;
