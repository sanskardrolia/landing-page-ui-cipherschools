import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import GuideMePage from './pages/GuideMePage';
import PremiumPage from './pages/PremiumPage';
import FeedbackDrawer from './components/FeedbackDrawer';
import ResumePage from './pages/ResumePage';
import AtsCheckerPage from './pages/AtsCheckerPage';
import CompilerPage from './pages/CompilerPage';
import BackToTop from './components/BackToTop';
import AppSidebar from './components/AppSidebar';
import SplashScreen from './components/SplashScreen';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import './App.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  useSmoothScroll();

  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    if (isLoginPage || location.pathname === '/guide-me' || location.pathname === '/guide' || location.pathname === '/courses' || location.pathname === '/premium' || location.pathname === '/feedback' || location.pathname === '/resume' || location.pathname === '/compiler' || location.pathname === '/ats-checker' || location.pathname === '/resume/ats-checker') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-revealed');
        }
      });
    }, { threshold: 0.12 });

    const timeout = setTimeout(() => {
      const sections = document.querySelectorAll('.section');
      sections.forEach(el => {
        if (!el.classList.contains('section-revealed')) {
          el.classList.add('section-hidden');
          observer.observe(el);
        }
      });
    }, 50);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [location.pathname, isLoginPage]);

  // Allow replaying splash screen on demand
  useEffect(() => {
    const handleReplay = () => setShowSplash(true);
    window.addEventListener('replay-splash', handleReplay);
    return () => window.removeEventListener('replay-splash', handleReplay);
  }, []);

  // Global Feedback Drawer event listeners
  useEffect(() => {
    const handleOpenFeedback = () => setIsFeedbackOpen(true);
    const handleCloseFeedback = () => setIsFeedbackOpen(false);
    window.addEventListener('open-feedback-drawer', handleOpenFeedback);
    window.addEventListener('close-feedback-drawer', handleCloseFeedback);
    return () => {
      window.removeEventListener('open-feedback-drawer', handleOpenFeedback);
      window.removeEventListener('close-feedback-drawer', handleCloseFeedback);
    };
  }, []);

  // Handle direct navigation to /feedback
  useEffect(() => {
    if (location.pathname === '/feedback') {
      setIsFeedbackOpen(true);
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  if (isLoginPage) {
    return <LoginPage />;
  }

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <FeedbackDrawer isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <AppSidebar />
      <div className="app-container with-sidebar">
        <Navbar />
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/guide-me" element={<GuideMePage />} />
            <Route path="/guide" element={<GuideMePage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/ats-checker" element={<AtsCheckerPage />} />
            <Route path="/resume/ats-checker" element={<AtsCheckerPage />} />
            <Route path="/compiler" element={<CompilerPage />} />
            <Route path="/*" element={<MainPage />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}

export default App;
