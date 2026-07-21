import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UploadsPage from './pages/UploadsPage';
import PackagesPage from './pages/PackagesPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import UploadDetails from './pages/UploadDetails';
import PackageDetails from './pages/PackageDetails';
import { NotificationProvider } from './context/NotificationContext';
import AnnouncementPopup from './components/AnnouncementPopup';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';
import ScrollToTop from './components/ScrollToTop';
import SeoHead from './components/SeoHead';
import { useTracking } from './hooks/useTracking';
import { useGlobalScrollReveal } from './hooks/useScrollReveal';
import './index.css';

function AppInner() {
  useTracking();
  useGlobalScrollReveal();

  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  return (
    <>
      <div className="bg-noise" />
      <SeoHead />
      <ScrollToTop />
      <Navbar />
      {/* Floating background particles */}
      <div className="bg-particles">
        <div className="bg-particles__dot bg-particles__dot--1" />
        <div className="bg-particles__dot bg-particles__dot--2" />
        <div className="bg-particles__dot bg-particles__dot--3" />
        <div className="bg-particles__dot bg-particles__dot--4" />
        <div className="bg-particles__dot bg-particles__dot--5" />
        <div className="bg-particles__dot bg-particles__dot--6" />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/uploads" element={<UploadsPage />} />
        <Route path="/uploads/:slug" element={<UploadDetails />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/:slug" element={<PackageDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
      <AnnouncementPopup />
      <GlobalAudioPlayer />
    </>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <SettingsProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppInner />
          </BrowserRouter>
        </AuthProvider>
      </SettingsProvider>
    </NotificationProvider>
  );
}
