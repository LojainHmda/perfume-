import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProductStore, getDefaultMediaPanels } from '../store/useProductStore';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { Fragrance, MediaPanelConfig } from '../types/fragrance';
import { ASSETS } from '../data/fragrances';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Upload,
  Video,
  DollarSign,
  Image as ImageIcon,
  Check,
  X,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Key,
  Lock,
  Layers,
  Eye,
  Play
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaults } = useProductStore();
  const { isAdmin, username, login, logout } = useAdminAuthStore();

  // Login form state
  const [loginUser, setLoginUser] = useState('admin');
  const [loginPass, setLoginPass] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Admin Dashboard State
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Fragrance | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'videos' | 'pricing'>('info');

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(loginUser, loginPass);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginError('');
      showToast('Admin Session Authenticated');
    }
  };

  const handleAutofillLogin = () => {
    setLoginUser('admin');
    setLoginPass('admin123');
    const res = login('admin', 'admin123');
    if (res.success) {
      setLoginError('');
      showToast('Logged in as Admin');
    }
  };

  const handleStartCreateProduct = () => {
    const newId = `custom-perfume-${Date.now()}`;
    const newFragrance: Fragrance = {
      id: newId,
      name: 'New Custom Fragrance',
      subtitle: 'HAUTE ATELIER',
      collection: 'Private Reserve',
      tagline: 'An exclusive sensory creation crafted in our atelier.',
      price50ml: 180,
      price100ml: 290,
      image: ASSETS.bottleDanceDevil,
      colorTheme: '#D4AF37',
      accentGlow: 'rgba(212, 175, 55, 0.4)',
      bgGradient: 'from-black via-[#111] to-[#050505]',
      description: 'A bespoke scent blended with rare botancals and rich amber accords.',
      story: 'Crafted exclusively for discerning collectors seeking a signature scent.',
      inspiration: 'Subtle elegance and modern luxury in perfect equilibrium.',
      mood: 'Sophisticated & Memorable',
      seasonality: ['All Seasons'],
      longevity: '12+ Hours',
      sillage: 'Refined Sillage',
      topNotes: ['Bergamot', 'Saffron'],
      heartNotes: ['Jasmine', 'Amber'],
      baseNotes: ['Sandlewood', 'Musk'],
      gridPanels: [
        {
          id: 'p1',
          title: 'Botanical Distillation',
          subtitle: 'Sceneario 01',
          category: 'Ingredient',
          description: 'Extract of pure rare flowers',
          videoType: 'ruby_essence',
          overlayQuote: 'Purity in every drop',
        },
        {
          id: 'p2',
          title: 'Atelier Process',
          subtitle: 'Scenario 02',
          category: 'Fragrance Note',
          description: 'Hand blended in small batches',
          videoType: 'crimson_smoke',
          overlayQuote: 'Craftsmanship',
        },
        {
          id: 'p3',
          title: 'Velvet Accord',
          subtitle: 'Scenario 03',
          category: 'Emotion',
          description: 'Smooth warmth on skin',
          videoType: 'noir_ripples',
          overlayQuote: 'Timeless luxury',
        },
        {
          id: 'p4',
          title: 'The Bottle Exhibit',
          subtitle: 'Scenario 04',
          category: 'Inspiration',
          description: 'Hand polished glass vessel',
          videoType: 'chess_monochrome',
          overlayQuote: 'Haute Parfumerie',
        },
      ],
      engravingAvailable: true,
      sampleAvailable: true,
      mediaPanels: [
        {
          id: 'panel-1',
          title: 'New Fragrance Reveal',
          subtitle: 'SCENARIO 01 • UNBOXING',
          image: ASSETS.discoveryGloveBottle,
        },
        {
          id: 'panel-2',
          title: 'Atmosphere & Mood',
          subtitle: 'SCENARIO 02 • ATMOSPHERE',
          image: ASSETS.discoveryAppleBottle,
        },
        {
          id: 'panel-3',
          title: 'Raw Accord Motion',
          subtitle: 'SCENARIO 03 • ACCORDS',
          image: ASSETS.discoveryHoneyBottle,
        },
        {
          id: 'panel-4',
          title: 'Haute Atelier Display',
          subtitle: 'SCENARIO 04 • ATELIER',
          image: ASSETS.discoveryWineBottle,
        },
      ],
    };

    setEditingProduct(newFragrance);
    setIsCreatingNew(true);
    setActiveTab('info');
  };

  const handleEditProductClick = (product: Fragrance) => {
    // Ensure mediaPanels exist
    const panels = getDefaultMediaPanels(product);
    setEditingProduct({ ...product, mediaPanels: panels });
    setIsCreatingNew(false);
    setActiveTab('info');
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    if (isCreatingNew) {
      addProduct(editingProduct);
      showToast(`Product "${editingProduct.name}" created successfully!`);
    } else {
      updateProduct(editingProduct.id, editingProduct);
      showToast(`Updated "${editingProduct.name}" successfully!`);
    }

    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      showToast(`Deleted "${name}"`);
    }
  };

  // Image File Upload Helper (converts to base64)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (base64Url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onSuccess(reader.result);
          showToast('File uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // IF NOT LOGGED IN AS ADMIN, DISPLAY LOGIN / CREDENTIALS PROMPT
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#070708] text-white pt-24 pb-12 px-4 flex items-center justify-center font-sans">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif font-light uppercase tracking-wider text-white">
              Admin Portal Login
            </h1>
            <p className="text-xs text-zinc-400">
              Access product management, pricing, images, and video controls.
            </p>
          </div>

          {/* CREDENTIALS DISPLAY BOX */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 text-xs space-y-2 text-amber-200">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-amber-300 font-bold border-b border-amber-500/20 pb-1.5">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Admin Credentials
              </span>
              <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">ADMIN ROLE</span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Username</span>
                <span className="text-white font-bold">admin</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Password</span>
                <span className="text-white font-bold">admin123</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutofillLogin}
              className="w-full mt-2 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Autofill & Login as Admin</span>
            </button>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-zinc-400 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="admin"
                className="w-full py-2.5 px-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-zinc-400 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 px-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-900/50">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-lg transition-colors cursor-pointer"
            >
              Enter Admin Panel
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline font-mono uppercase tracking-wider"
            >
              ← Back to Storefront
            </button>
          </div>

        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD UI
  return (
    <div className="min-h-screen bg-[#070708] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-emerald-900 border border-emerald-500 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP ADMIN HEADER BAR */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif text-white font-light uppercase tracking-wider">
                  Admin Control Panel
                </h1>
                <span className="text-[10px] font-mono uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Authenticated: {username}
                </span>
              </div>
              <p className="text-xs text-zinc-400 pt-0.5">
                Manage catalog items, product images, 4K media reels/videos, and prices in real time.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartCreateProduct}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(227,6,19,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset catalog to default built-in fragrances?')) {
                  resetToDefaults();
                  showToast('Reset products to default catalog.');
                }
              }}
              className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset Catalog"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Catalog</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Store</span>
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-red-400 hover:bg-red-950/40 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* SEARCH & PRODUCT OVERVIEW */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-serif text-white uppercase tracking-wider font-light">
              Product Catalog ({filteredProducts.length})
            </h2>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or collection..."
                className="w-full py-2 px-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* PRODUCT CARDS LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const panels = getDefaultMediaPanels(product);
              return (
                <div
                  key={product.id}
                  className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-lg relative group"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block font-bold">
                          {product.collection}
                        </span>
                        <h3 className="text-lg font-serif text-white uppercase font-normal leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-xs text-zinc-400">{product.subtitle}</p>
                      </div>

                      <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                        ID: {product.id}
                      </span>
                    </div>

                    {/* Image & Price Preview */}
                    <div className="flex items-center gap-4 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-contain rounded-lg bg-black/40 p-1 border border-zinc-800"
                      />
                      <div className="space-y-1 text-xs font-mono">
                        <div className="text-zinc-400">
                          <span className="text-zinc-500">50ML:</span>{' '}
                          <span className="text-white font-bold">${product.price50ml}</span>
                        </div>
                        <div className="text-zinc-400">
                          <span className="text-zinc-500">100ML:</span>{' '}
                          <span className="text-white font-bold">${product.price100ml}</span>
                        </div>
                        <div className="text-[10px] text-amber-300 flex items-center gap-1 pt-0.5">
                          <Video className="w-3 h-3" />
                          <span>{panels.length} Media Reels Configured</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 italic">
                      "{product.tagline}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-zinc-900 grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleEditProductClick(product)}
                      className="py-2 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => navigate(`/fragrance/${product.id}`)}
                      className="py-2 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>View 2x2</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="py-2 px-3 bg-zinc-900 hover:bg-red-950/60 border border-zinc-800 hover:border-red-900 text-zinc-400 hover:text-red-400 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* EDIT / ADD PRODUCT MODAL */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto"
            >
              {/* Modal Header */}
              <div className="p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-950 border border-red-500/30 flex items-center justify-center text-red-400">
                    <Edit className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-white uppercase font-light">
                      {isCreatingNew ? 'Add New Product' : `Edit "${editingProduct.name}"`}
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Update prices, images, 4K reel videos, and scent details.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingProduct(null)}
                  className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center gap-1 border-b border-zinc-800 bg-zinc-950 px-5 pt-3 text-xs font-sans tracking-wider uppercase">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`pb-2.5 px-3 border-b-2 font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'border-red-500 text-white font-bold'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  1. Basic Details
                </button>

                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`pb-2.5 px-3 border-b-2 font-medium transition-colors ${
                    activeTab === 'pricing'
                      ? 'border-red-500 text-white font-bold'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  2. Prices ($)
                </button>

                <button
                  onClick={() => setActiveTab('images')}
                  className={`pb-2.5 px-3 border-b-2 font-medium transition-colors ${
                    activeTab === 'images'
                      ? 'border-red-500 text-white font-bold'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  3. Product Image
                </button>

                <button
                  onClick={() => setActiveTab('videos')}
                  className={`pb-2.5 px-3 border-b-2 font-medium transition-colors ${
                    activeTab === 'videos'
                      ? 'border-red-500 text-white font-bold'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  4. 4K Videos & Reels (4)
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* TAB 1: BASIC DETAILS */}
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                          Product ID / Slug
                        </label>
                        <input
                          type="text"
                          disabled={!isCreatingNew}
                          value={editingProduct.id}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, id: e.target.value })
                          }
                          className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, name: e.target.value })
                          }
                          className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-serif text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                          Subtitle / Fragrance Code
                        </label>
                        <input
                          type="text"
                          value={editingProduct.subtitle}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, subtitle: e.target.value })
                          }
                          className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                          Collection
                        </label>
                        <input
                          type="text"
                          value={editingProduct.collection}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, collection: e.target.value })
                          }
                          className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={editingProduct.tagline}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, tagline: e.target.value })
                        }
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                        Full Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                          Top Notes (comma separated)
                        </label>
                        <input
                          type="text"
                          value={editingProduct.topNotes.join(', ')}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              topNotes: e.target.value.split(',').map((s) => s.trim()),
                            })
                          }
                          className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                          Heart Notes (comma separated)
                        </label>
                        <input
                          type="text"
                          value={editingProduct.heartNotes.join(', ')}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              heartNotes: e.target.value.split(',').map((s) => s.trim()),
                            })
                          }
                          className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                          Base Notes (comma separated)
                        </label>
                        <input
                          type="text"
                          value={editingProduct.baseNotes.join(', ')}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              baseNotes: e.target.value.split(',').map((s) => s.trim()),
                            })
                          }
                          className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PRICING */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-4">
                      <div className="flex items-center gap-2 text-amber-300 font-mono uppercase tracking-wider font-bold">
                        <DollarSign className="w-4 h-4" />
                        <span>Assign Product Prices</span>
                      </div>
                      <p className="text-zinc-400">
                        Set the retail pricing in USD for both 50ML and 100ML bottle sizes.
                      </p>

                      <div className="grid grid-cols-2 gap-6 pt-2">
                        <div className="space-y-1.5">
                          <label className="block text-zinc-400 font-mono text-[10px] uppercase">
                            50 ML Bottle Price ($)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-zinc-500 font-bold">$</span>
                            <input
                              type="number"
                              min="0"
                              value={editingProduct.price50ml}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  price50ml: Number(e.target.value),
                                })
                              }
                              className="w-full py-2.5 pl-8 pr-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono text-base font-bold focus:border-emerald-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-zinc-400 font-mono text-[10px] uppercase">
                            100 ML Bottle Price ($)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-zinc-500 font-bold">$</span>
                            <input
                              type="number"
                              min="0"
                              value={editingProduct.price100ml}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  price100ml: Number(e.target.value),
                                })
                              }
                              className="w-full py-2.5 pl-8 pr-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono text-base font-bold focus:border-emerald-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl text-zinc-400 space-y-2">
                      <span className="font-mono text-[10px] text-amber-300 uppercase block">
                        Live Price Preview
                      </span>
                      <p className="text-white font-medium">
                        {editingProduct.name} will be displayed on the website as{' '}
                        <span className="text-emerald-400 font-bold">${editingProduct.price50ml}</span> (50ml) and{' '}
                        <span className="text-emerald-400 font-bold">${editingProduct.price100ml}</span> (100ml).
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 3: IMAGES */}
                {activeTab === 'images' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="block text-zinc-400 font-mono text-[10px] uppercase">
                        Product Bottle Main Image
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-zinc-900/60 p-4 border border-zinc-800 rounded-xl">
                        <div className="relative w-28 h-28 bg-black rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                          {editingProduct.image ? (
                            <img
                              src={editingProduct.image}
                              alt="Bottle Preview"
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-zinc-600" />
                          )}
                        </div>

                        <div className="sm:col-span-2 space-y-3">
                          <div>
                            <span className="block text-[10px] text-zinc-400 font-mono uppercase mb-1">
                              Option A: Upload Image File from Computer
                            </span>
                            <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors border border-zinc-700">
                              <Upload className="w-4 h-4 text-amber-400" />
                              <span>Browse & Upload Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUpload(e, (base64) =>
                                    setEditingProduct({ ...editingProduct, image: base64 })
                                  )
                                }
                              />
                            </label>
                          </div>

                          <div>
                            <span className="block text-[10px] text-zinc-400 font-mono uppercase mb-1">
                              Option B: Or Enter Image URL
                            </span>
                            <input
                              type="text"
                              value={editingProduct.image}
                              onChange={(e) =>
                                setEditingProduct({ ...editingProduct, image: e.target.value })
                              }
                              placeholder="https://..."
                              className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded text-white font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: 4K VIDEOS & REELS (4 MEDIA PANELS) */}
                {activeTab === 'videos' && (
                  <div className="space-y-6">
                    <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-amber-200 text-xs">
                      <span className="font-bold flex items-center gap-1.5 uppercase font-mono">
                        <Video className="w-4 h-4 text-amber-400" />
                        Configure 4K Videos & Reels for the 2x2 Media Grid
                      </span>
                      <p className="pt-1 text-[11px] text-amber-200/80">
                        Upload custom video files or images for each of the 4 scenario reels on the product detail page.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {getDefaultMediaPanels(editingProduct).map((panel, idx) => {
                        const currentPanels = [...getDefaultMediaPanels(editingProduct)];
                        return (
                          <div
                            key={panel.id || `panel-${idx}`}
                            className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                              <span className="font-mono text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                REEL 0{idx + 1} • {panel.subtitle || `SCENARIO 0${idx + 1}`}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                                Panel {idx + 1} of 4
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                              {/* Thumbnail */}
                              <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center">
                                <img
                                  src={panel.image}
                                  alt={panel.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <span className="text-[9px] font-mono text-white bg-black/80 px-2 py-0.5 rounded border border-white/20">
                                    REEL 0{idx + 1}
                                  </span>
                                </div>
                              </div>

                              {/* Form Fields */}
                              <div className="sm:col-span-2 space-y-2">
                                <div>
                                  <label className="block text-[10px] font-mono text-zinc-400 uppercase">
                                    Reel Title
                                  </label>
                                  <input
                                    type="text"
                                    value={panel.title}
                                    onChange={(e) => {
                                      currentPanels[idx].title = e.target.value;
                                      setEditingProduct({
                                        ...editingProduct,
                                        mediaPanels: currentPanels,
                                      });
                                    }}
                                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded text-white font-medium"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-mono text-zinc-400 uppercase">
                                    Reel Subtitle
                                  </label>
                                  <input
                                    type="text"
                                    value={panel.subtitle}
                                    onChange={(e) => {
                                      currentPanels[idx].subtitle = e.target.value;
                                      setEditingProduct({
                                        ...editingProduct,
                                        mediaPanels: currentPanels,
                                      });
                                    }}
                                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded text-white"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                                    Upload Video / Image File
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs cursor-pointer flex items-center gap-1.5 border border-zinc-700">
                                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Upload File</span>
                                      <input
                                        type="file"
                                        accept="image/*,video/*"
                                        className="hidden"
                                        onChange={(e) =>
                                          handleFileUpload(e, (base64) => {
                                            currentPanels[idx].image = base64;
                                            setEditingProduct({
                                              ...editingProduct,
                                              mediaPanels: currentPanels,
                                            });
                                          })
                                        }
                                      />
                                    </label>

                                    <input
                                      type="text"
                                      value={panel.image}
                                      onChange={(e) => {
                                        currentPanels[idx].image = e.target.value;
                                        setEditingProduct({
                                          ...editingProduct,
                                          mediaPanels: currentPanels,
                                        });
                                      }}
                                      placeholder="Or enter image/video URL"
                                      className="flex-1 p-1.5 bg-zinc-950 border border-zinc-800 rounded text-[11px] text-white font-mono"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium uppercase transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveProduct}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(227,6,19,0.4)] flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
