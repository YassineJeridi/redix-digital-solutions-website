// Public Website Layout Wrapper
// Provides Navbar, Footer, AnimatedBackground, and ChatPopup for all public pages
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import SupportWidget from './components/SupportWidget/SupportWidget';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import './styles/global.css';
import './styles/public-app.css';

const PublicLayoutInner = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className="app">
        <AnimatedBackground />
        <Navbar />
        <Outlet />
        <Footer />
        <SupportWidget />
      </div>
    </>
  );
};

const PublicLayout = () => (
  <ThemeProvider>
    <PublicLayoutInner />
  </ThemeProvider>
);

export default PublicLayout;
