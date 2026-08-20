import React from 'react';
import { Quote } from 'lucide-react';
import './Testimonials.css';

const row1 = [
  {
    name: "Gabrielle Williams",
    role: "CEO and Co-founder of ABC Company",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    quote: "Creative geniuses who listen, understand, and craft captivating visuals - an agency that truly understands our needs."
  },
  {
    name: "Samantha Johnson",
    role: "CEO and Co-founder of ABC Company",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    quote: "Exceeded our expectations with innovative designs that brought our vision to life - a truly remarkable creative agency."
  },
  {
    name: "Isabella Rodriguez",
    role: "CEO and Co-founder of ABC Company",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    quote: "Their ability to capture our brand essence in every project is unparalleled - an invaluable creative collaborator."
  },
  {
    name: "Priya Sharma",
    role: "Software Engineer @ Google",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    quote: "CipherSchools gave me the structure I needed. The hands-on projects and live compiler completely changed how I prepare for interviews."
  },
  {
    name: "Rahul Verma",
    role: "Fullstack Lead @ Amazon",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    quote: "The resume builder and mock interviews were total game-changers. I went from struggling with DSA to leading complex architecture teams."
  }
];

const row2 = [
  {
    name: "John Peter",
    role: "CEO and Co-founder of ABC Company",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    quote: "Their team's artistic flair and strategic approach resulted in remarkable campaigns - a reliable creative partner."
  },
  {
    name: "Natalie Martinez",
    role: "CEO and Co-founder of ABC Company",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=300&auto=format&fit=crop",
    quote: "From concept to execution, their creativity knows no bounds - a game-changer for our brand's success."
  },
  {
    name: "Victoria Thompson",
    role: "CEO and Co-founder of ABC Company",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop",
    quote: "A refreshing and imaginative agency that consistently delivers exceptional results - highly recommended for any project."
  },
  {
    name: "Ananya Roy",
    role: "VP of Placement, Tech University",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=300&auto=format&fit=crop",
    quote: "Partnering with CipherSchools helped us increase our campus placement rate by 45% with top product companies visiting."
  },
  {
    name: "Orlando Diggs",
    role: "Product Engineer @ Meta",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    quote: "The continuous 1-on-1 feedback from senior mentors helped me refine my problem-solving speed and architectural discussions."
  }
];

// Triple duplicate for seamless 100% infinite marquee loop
const row1Marquee = [...row1, ...row1, ...row1];
const row2Marquee = [...row2, ...row2, ...row2];

const TestimonialCard = ({ item }) => (
  <div className="praise-card">
    <div className="praise-quote-icon">
      <Quote size={24} className="praise-svg-quote" />
    </div>
    <p className="praise-body-text">{item.quote}</p>
    <div className="praise-author-row">
      <img src={item.image} alt={item.name} className="praise-author-avatar" />
      <div className="praise-author-info">
        <h4 className="praise-author-name">{item.name}</h4>
        <p className="praise-author-role">{item.role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="praise-testimonials-section">
      <div className="praise-header text-center">
        <h2 className="praise-section-title">
          Words of praise from others<br />about our presence.
        </h2>
      </div>

      <div className="praise-marquee-wrapper">
        {/* Row 1: Leftward Auto-Scroll */}
        <div className="praise-marquee-container">
          <div className="praise-marquee-track marquee-scroll-left">
            {row1Marquee.map((item, idx) => (
              <TestimonialCard key={`r1-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2: Rightward Auto-Scroll */}
        <div className="praise-marquee-container">
          <div className="praise-marquee-track marquee-scroll-right">
            {row2Marquee.map((item, idx) => (
              <TestimonialCard key={`r2-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
