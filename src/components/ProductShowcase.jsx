import React from 'react';
import { Layers, TerminalSquare, FileText, Code2, Check } from 'lucide-react';
import './ProductShowcase.css';

const ProductShowcase = () => {
  const products = [
    {
      id: "lms",
      title: "Learning Management System",
      icon: <Layers size={24} />,
      desc: "Structured paths designed for maximum retention and practical application.",
      features: ["Video + Text Content", "Progress Tracking", "Interactive Quizzes"],
      reversed: false
    },
    {
      id: "cipherlabs",
      title: "CipherLabs",
      icon: <TerminalSquare size={24} />,
      desc: "Our custom competitive programming platform designed like the best industry tools.",
      features: ["500+ Curated Questions", "Company Tags", "Global Leaderboard"],
      reversed: true
    },
    {
      id: "resume",
      title: "Resume Builder",
      icon: <FileText size={24} />,
      desc: "Auto-generate industry-standard resumes based on your platform progress.",
      features: ["ATS-Friendly Templates", "Auto-sync Projects", "One-click Export"],
      reversed: false
    },
    {
      id: "compiler",
      title: "In-Browser Compiler",
      icon: <Code2 size={24} />,
      desc: "Practice coding in 15+ languages without leaving your browser.",
      features: ["Instant Execution", "Syntax Highlighting", "Multiple Languages"],
      reversed: true
    }
  ];

  return (
    <section className="showcase section">
      <div className="container">
        <div className="section-header text-center animate-fade-in">
          <div className="tag">Product Suite</div>
          <h2 className="section-title">Built for the modern builder.</h2>
          <p className="section-subtitle">
            Explore our integrated suite of products designed to give you a competitive edge.
          </p>
        </div>

        <div className="showcase-list">
          {products.map((product) => (
            <div className={`showcase-row ${product.reversed ? 'reversed' : ''}`} key={product.id}>
              
              <div className="showcase-content">
                <div className="showcase-icon">{product.icon}</div>
                <h3 className="showcase-title">{product.title}</h3>
                <p className="showcase-desc">{product.desc}</p>
                <ul className="showcase-features">
                  {product.features.map((feature, i) => (
                    <li key={i}>
                      <Check size={16} className="text-primary" /> {feature}
                    </li>
                  ))}
                </ul>
                <button className="btn btn-outline-primary mt-4">Explore {product.title}</button>
              </div>

              <div className="showcase-visual">
                <div className={`product-mockup mockup-${product.id}`}>
                  <div className="mockup-header-simple">
                    <span></span><span></span><span></span>
                  </div>
                  <div className="mockup-body-simple">
                    <div className="wireframe-image"></div>
                    <div className="wireframe-lines">
                      <div className="line"></div>
                      <div className="line"></div>
                      <div className="line short"></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
