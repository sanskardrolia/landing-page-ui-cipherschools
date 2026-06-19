import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import './StoryHero.css';
import { ArrowRight, Sparkles } from 'lucide-react';

const STORY_PHRASES = [
  {
    content: <>What to <span className="story-hl">study?</span></>,
    className: "phrase-q1",
    align: "flex-start",
    ml: "8%",
    mr: "0"
  },
  {
    content: <>What <span className="story-hl">career path</span> should I pick?</>,
    className: "phrase-q2",
    align: "flex-end",
    ml: "0",
    mr: "10%"
  },
  {
    content: <>Where to <span className="story-hl">start?</span></>,
    className: "phrase-q3",
    align: "flex-start",
    ml: "18%",
    mr: "0"
  },
  {
    content: <>Will <span className="story-hl">AI replace</span> my job?</>,
    className: "phrase-q4",
    align: "flex-end",
    ml: "0",
    mr: "15%"
  },
  {
    content: <>Am I <span className="story-hl">not the one?</span></>,
    className: "phrase-q5",
    align: "center",
    ml: "0",
    mr: "0"
  }
];

const FINAL_PHRASE = <>An <span className="story-hl-gradient">ecosystem</span> that guides your path.</>;

const StoryHero = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [step, setStep] = useState(0);
  const [questionsVisible, setQuestionsVisible] = useState(true);
  const [reassuranceVisible, setReassuranceVisible] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle smooth progress bar tracking
  useEffect(() => {
    const totalDuration = 13300; // 13.3s total
    const intervalTime = 50; // update progress every 50ms
    const stepAmount = (intervalTime / totalDuration) * 100;

    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return p + stepAmount;
      });
    }, intervalTime);

    return () => clearInterval(progressTimer);
  }, []);

  // Run the story animation sequence
  useEffect(() => {
    if (step < STORY_PHRASES.length) {
      // Reveal each question quickly (stacking them)
      const nextTimer = setTimeout(() => {
        setStep(s => s + 1);
      }, 1000); 
      return () => clearTimeout(nextTimer);
    } 
    else if (step === STORY_PHRASES.length) {
      // All questions are on screen. Wait 1.5s, then fade them out.
      const fadeOutTimer = setTimeout(() => {
        setQuestionsVisible(false);
      }, 1500);
      
      // After they fade out (600ms transition), show reassurance phrase
      const nextPhaseTimer = setTimeout(() => {
        setStep(s => s + 1);
        setReassuranceVisible(true);
      }, 2100); 
      
      return () => { clearTimeout(fadeOutTimer); clearTimeout(nextPhaseTimer); };
    } 
    else if (step === STORY_PHRASES.length + 1) {
      // Reassurance phrase is on screen. Wait 2s, then fade out.
      const fadeOutTimer = setTimeout(() => {
        setReassuranceVisible(false);
      }, 2000);
      
      // After it fades out (600ms transition), show final phrase
      const nextPhaseTimer = setTimeout(() => {
        setStep(s => s + 1);
        setFinalVisible(true);
      }, 2600);
      
      return () => { clearTimeout(fadeOutTimer); clearTimeout(nextPhaseTimer); };
    }
    else if (step === STORY_PHRASES.length + 2) {
      // Final phrase is on screen. Wait 3s, fade out.
      const finalFadeOut = setTimeout(() => {
        setFinalVisible(false);
      }, 3000);
      
      // End story entirely
      const endStoryTimer = setTimeout(() => {
        setIsComplete(true);
      }, 3600);
      
      return () => { clearTimeout(finalFadeOut); clearTimeout(endStoryTimer); };
    }
  }, [step]);

  const finishStory = () => {
    setQuestionsVisible(false);
    setReassuranceVisible(false);
    setFinalVisible(false);
    setTimeout(() => {
      setIsComplete(true);
    }, 600);
  };

  if (isComplete) {
    return (
      <div className="animate-fade-in-slow">
        <Hero onReplay={() => {
          setIsComplete(false);
          setStep(0);
          setQuestionsVisible(true);
          setReassuranceVisible(false);
          setFinalVisible(false);
          setProgress(0);
        }} />
      </div>
    );
  }

  return (
    <div className="story-hero-container">
      {/* Progress Bar */}
      <div className="story-progress-bar-container">
        <div className="story-progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
      </div>

      {/* Skip Button */}
      <button className="story-skip-btn" onClick={finishStory}>
        Skip Story <ArrowRight size={16} />
      </button>

      {/* Questions Stack */}
      <div className={`story-questions-stack ${questionsVisible ? '' : 'fade-out'}`}>
        {STORY_PHRASES.slice(0, step).map((phrase, i) => (
          <div 
            key={i} 
            className="story-phrase-wrapper fade-in-up" 
            style={{ 
              alignSelf: phrase.align, 
              marginLeft: phrase.ml, 
              marginRight: phrase.mr 
            }}
          >
            <h2 className={`story-phrase question ${phrase.className}`}>
              {phrase.content}
            </h2>
          </div>
        ))}
      </div>

      {/* Reassurance Phrase */}
      {step === STORY_PHRASES.length + 1 && (
        <div className={`story-reassurance-wrapper ${reassuranceVisible ? 'fade-in-scale' : 'fade-out'}`}>
          <h1 className="story-phrase reassurance-phrase">
            Don't worry, we got you.
          </h1>
        </div>
      )}

      {/* Final Phrase */}
      {step > STORY_PHRASES.length + 1 && (
        <div className={`story-final-wrapper ${finalVisible ? 'fade-in-scale' : 'fade-out'}`}>
          <Sparkles className="story-sparkle text-primary mb-4" size={48} />
          <h1 className="story-phrase final-phrase">
            {FINAL_PHRASE}
          </h1>
        </div>
      )}
    </div>
  );
};

export default StoryHero;
