import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import { CustomCursor } from './components/cursor/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { HomePage } from './pages/HomePage';
import { FragranceDetailPage } from './pages/FragranceDetailPage';
import { StoryPage } from './pages/StoryPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { HeroSettingsPage } from './pages/admin/HeroSettingsPage';
import { ProductsPage } from './pages/admin/ProductsPage';
import { MediaLibraryPage } from './pages/admin/MediaLibraryPage';
import { ProductEditorPage } from './pages/admin/product/ProductEditorPage';
import {
  ProductDetailsSection,
  ProductFilmsSection,
  ProductImageSection,
  ProductPricingSection,
} from './pages/admin/product/sections';
import { useAudio } from './hooks/useAudio';
import { useBootstrapContent } from './hooks/useBootstrapContent';

export default function App() {
  // Initialize subtle audio ambient hooks
  useAudio();

  // Pull catalogue, site settings and any live admin session from the server
  useBootstrapContent();

  // BASE_URL is '/' for the server deployment and '/perfume-/' on GitHub Pages.
  return (
    <Router basename={import.meta.env.BASE_URL}>
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
            {/* The admin is a section, not a page: one route per surface. */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="hero" element={<HeroSettingsPage />} />
              <Route path="media" element={<MediaLibraryPage />} />
              <Route path="products" element={<ProductsPage />} />

              <Route path="products/new" element={<ProductEditorPage mode="new" />}>
                <Route index element={<Navigate to="details" replace />} />
                <Route path="details" element={<ProductDetailsSection />} />
                <Route path="pricing" element={<ProductPricingSection />} />
                <Route path="image" element={<ProductImageSection />} />
                <Route path="films" element={<ProductFilmsSection />} />
              </Route>

              <Route path="products/:id" element={<ProductEditorPage />}>
                <Route index element={<Navigate to="details" replace />} />
                <Route path="details" element={<ProductDetailsSection />} />
                <Route path="pricing" element={<ProductPricingSection />} />
                <Route path="image" element={<ProductImageSection />} />
                <Route path="films" element={<ProductFilmsSection />} />
              </Route>
            </Route>
          </Routes>
        </main>

        {/* Global Luxury Footer */}
        <Footer />
      </div>
    </Router>
  );
}
