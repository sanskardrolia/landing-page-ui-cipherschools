import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import BackToTop from './components/BackToTop';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import './App.css';

function App() {
  const location = useLocation();
  useSmoothScroll();

  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    if (isLoginPage) return;

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

  if (isLoginPage) {
    return <LoginPage />;
  }

  return (
    <>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
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
