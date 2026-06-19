import React from 'react';
import { Quote, Star } from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      type: "student",
      quote: "CipherSchools gave me the structure I needed. The hands-on projects and live compiler completely changed how I prepare for interviews.",
      author: "Priya Sharma",
      role: "Software Engineer at Google",
      initial: "P"
    },
    {
      type: "university",
      quote: "Partnering with CipherSchools helped us increase our campus placement rate by 40%. Their industry-aligned curriculum is exactly what students need.",
      author: "Dr. Arvind Kumar",
      role: "Director of Placements, Tech University",
      initial: "A"
    },
    {
      type: "student",
      quote: "The resume builder and the mock interviews were game-changers. I went from struggling with DSA to cracking my dream job.",
      author: "Rahul Verma",
      role: "SDE I at Amazon",
      initial: "R"
    }
  ];

  return (
    <section className="testimonials section">
      <div className="container">
        <div className="section-header text-center animate-fade-in">
          <div className="tag">Success Stories</div>
          <h2 className="section-title">Don't just take our word for it.</h2>
          <p className="section-subtitle" style={{ fontSize: '0.85rem' }}>
            Hear from the students and universities who have transformed their outcomes with CipherSchools.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((test, index) => (
            <div className={`testimonial-card ${test.type}`} key={index}>
              <Quote className="quote-icon" size={32} />
              
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="text-primary" fill="currentColor" />
                ))}
              </div>
              
              <p className="testimonial-quote">"{test.quote}"</p>
              
              <div className="testimonial-author">
                <div className="author-avatar">{test.initial}</div>
                <div>
                  <h5 className="author-name">{test.author}</h5>
                  <p className="author-role">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
