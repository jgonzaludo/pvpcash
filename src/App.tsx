import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from "framer-motion"
import NavigationBar from './components/NavigationBar'
import HomePage from './pages/HomePage'
import WalletPage from './pages/WalletPage'
import AccountPage from './pages/AccountPage'
import WheelPage from './pages/WheelPage'
import PokerPage from './pages/PokerPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AuthProvider } from './contexts/AuthContext'
import { AuroraBackground } from "@/components/ui/aurora-background"
import './style.scss' // Make sure SCSS is imported

function createBubbleAnimation(interBubble: HTMLDivElement) {
  let curX = 0;
  let curY = 0;
  let tgX = 0;
  let tgY = 0;

  function move() {
    curX += (tgX - curX) / 20;
    curY += (tgY - curY) / 20;
    interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    requestAnimationFrame(move);
  }

  window.addEventListener('mousemove', (event) => {
    tgX = event.clientX;
    tgY = event.clientY;
  });

  move();
}

const AppContent: React.FC = () => {
  return (
    <AuroraBackground>
      <div className="flex flex-col min-h-screen">
        <NavigationBar />
        <motion.main
          initial={{ opacity: 0.0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex-grow"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/wheel" element={<WheelPage />} />
            <Route path="/poker" element={<PokerPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </motion.main>
      </div>
    </AuroraBackground>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App; 