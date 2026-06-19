import React, { useState, useEffect, useRef } from 'react';
import { Users, BookOpen, Award, GraduationCap, Rocket, Target } from 'lucide-react';
import './ImpactBar.css';

const CountUp = ({ end, suffix = "", duration = 2500 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime = null;
    let animationFrame;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const ImpactBar = () => {
  const stats = [
    {
      num: 50,
      suffix: "k+",
      label: "Learners",
      story: "From first-year students to working professionals — all building real skills every day.",
      icon: <Users size={22} />,
      color: "var(--primary)",
      bg: "rgba(243,145,46,0.08)"
    },
    {
      num: 15,
      suffix: "+",
      label: "In-demand Domains",
      story: "AI, Web3, Cloud, DevOps, Full-Stack — we cover what companies actually hire for.",
      icon: <Target size={22} />,
      color: "#10B981",
      bg: "#ECFDF5"
    },
    {
      num: 50,
      suffix: "+",
      label: "Free Programs",
      story: "Complete courses with certificates and achievements — no paywall, no catch.",
      icon: <Rocket size={22} />,
      color: "#2563EB",
      bg: "#EFF6FF"
    }
  ];

  return (
    <section className="impact-section">
      <div className="container">

        {/* Trust strip */}
        <div className="trust-strip">
          <GraduationCap size={20} className="trust-strip-icon" />
          <span className="trust-strip-label">Trusted by</span>
          <span className="trust-strip-name">Lovely Professional University</span>
          <span className="trust-strip-dot"></span>
          <span className="trust-strip-name">Galgotias University</span>
          <span className="trust-strip-dot"></span>
          <span className="trust-strip-more">and 50+ more</span>
        </div>

        {/* Stats grid */}
        <div className="impact-stats-grid">
          {stats.map((stat, i) => (
            <div className="impact-stat-card" key={i}>
              <div className="impact-stat-top">
                <div className="impact-stat-icon" style={{ color: stat.color, background: stat.bg }}>
                  {stat.icon}
                </div>
                <h3 className="impact-stat-num" style={{ color: stat.color }}>
                  <CountUp end={stat.num} suffix={stat.suffix} />
                </h3>
              </div>
              <div className="impact-stat-bottom">
                <h4 className="impact-stat-label">{stat.label}</h4>
                <p className="impact-stat-story">{stat.story}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ImpactBar;
