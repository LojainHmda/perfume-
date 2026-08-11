import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomCursor } from './components/cursor/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { HomePage } from './pages/HomePage';
import { FragranceDetailPage } from './pages/FragranceDetailPage';
import { StoryPage } from './pages/StoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { useAudio } from './hooks/useAudio';

export default function App() {
  // Initialize subtle audio ambient hooks
  useAudio();

  return (
    <Router>
      <div className="min-h-screen bg-[#070708] text-white selection:bg-red-500 selection:text-white font-sans relative">
        {/* Custom Branded Desktop Cursor */}
        <CustomCursor />

        {/* Global Luxury Header Navigation */}
        <Navbar />

        {/* Sliding Bag Drawer */}
        <CartDrawer />

        {/* Main Route Content */}
        <main className="w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/fragrance/:id" element={<FragranceDetailPage />} />
            <Route path="/story" element={<StoryPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>

        {/* Global Luxury Footer */}
        <Footer />
      </div>
    </Router>
  );
}
