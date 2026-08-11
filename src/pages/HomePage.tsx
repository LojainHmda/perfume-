import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useProductStore } from '../store/useProductStore';
import { useCursorStore, useCartStore } from '../store/useStore';
import { useAudio } from '../hooks/useAudio';
import { ParallaxSplitHero } from '../components/hero/ParallaxSplitHero';
import { EditorialGridSection } from '../components/home/EditorialGridSection';
import { Fragrance } from '../types/fragrance';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  ShoppingBag,
  Star,
  MapPin,
  CheckCircle2,
  Sliders,
  Droplet,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProductStore();
  const { setCursor, resetCursor } = useCursorStore();
  const { addItem } = useCartStore();
  const { playClick } = useAudio();

  // Page Scroll Parallax Setup
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const rawParallaxY1 = useTransform(scrollY, [300, 1500], [0, -90]);
  const parallaxY1 = useSpring(rawParallaxY1, { stiffness: 60, damping: 20 });

  const rawParallaxY2 = useTransform(scrollY, [600, 2000], [0, 80]);
  const parallaxY2 = useSpring(rawParallaxY2, { stiffness: 60, damping: 20 });

  // Interactive controls for collection items
  const [selectedSize, setSelectedSize] = useState<Record<string, '50ml' | '100ml'>>({});

  const [activeTab, setActiveTab] = useState<Record<string, 'top' | 'heart' | 'base'>>({});

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'gourmand' | 'boozy' | 'cherry'>('all');

  const filteredFragrances = products.filter((frag) => {
    if (selectedFilter === 'gourmand') return frag.id === 'dirty-rice';
    if (selectedFilter === 'boozy') return frag.id === 'drunk-lovers';
    if (selectedFilter === 'cherry') return frag.id === 'indecent-cherry';
    return true;
  });

  return (
    <div ref={pageRef} className="w-full bg-[#070708] text-white min-h-screen selection:bg-red-600 selection:text-white overflow-hidden">

      {/* 2. HERO SECTION — FULL-SCREEN INTERACTIVE 3-COLUMN SPLIT HERO WITH LUXURY DOORS */}
      <ParallaxSplitHero />

      {/* 3. EDITORIAL COLLECTION GRID — WITH PARALLAX DEPTH SHIFT */}
      <motion.div style={{ y: parallaxY1 }}>
        <EditorialGridSection />
      </motion.div>

      {/* 4. CURATED FRAGRANCE DISCOVERY COLLECTION WITH PARALLAX WATERMARK */}
      <section id="collection" className="relative py-24 px-6 max-w-7xl mx-auto border-t border-zinc-900">
        
        {/* Parallax Background Typography Watermark */}
        <motion.div
          style={{ y: parallaxY2 }}
          className="absolute top-10 right-0 pointer-events-none text-right font-serif text-[12vw] uppercase tracking-tighter text-white/[0.02] leading-none select-none z-0 overflow-hidden"
        >
          DISCOVERY
        </motion.div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-amber-300 font-bold">
              THE THREE SIGNATURE PERFUMES
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif uppercase tracking-wider text-white font-light">
              Discovery Collection
            </h2>
          </div>
        </div>

        {/* Fragrances Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredFragrances.map((frag, idx) => {
            const size = selectedSize[frag.id] || '50ml';
            const price = size === '50ml' ? frag.price50ml : frag.price100ml;
            const currentTab = activeTab[frag.id] || 'top';

            return (
              <motion.div
                key={frag.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.8 }}
                className="group relative bg-zinc-950/90 border border-zinc-800/80 rounded-3xl p-7 flex flex-col justify-between hover:border-amber-400/60 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
              >
                {/* Subtle Background Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"
                  style={{
                    background: `radial-gradient(circle at 50% 40%, ${frag.accentGlow} 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 space-y-4">
                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans tracking-[0.25em] text-amber-300 uppercase font-bold">
                      {frag.collection}
                    </span>
                    <span className="text-[10px] font-sans tracking-widest text-zinc-500 uppercase">
                      Extrait de Parfum
                    </span>
                  </div>

                  {/* Bottle Display */}
                  <div
                    onClick={() => {
                      playClick();
                      navigate(`/fragrance/${frag.id}`);
                    }}
                    onMouseEnter={() => setCursor(`ENTER 2x2 ${frag.name.toUpperCase()}`, 'magnetic')}
                    onMouseLeave={resetCursor}
                    className="relative w-full h-72 flex items-center justify-center cursor-pointer my-2"
                  >
                    <motion.img
                      src={frag.image}
                      alt={frag.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)] group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1 text-center">
                    <span className="text-xs font-sans tracking-widest text-zinc-400 uppercase">
                      {frag.subtitle}
                    </span>
                    <h3
                      onClick={() => navigate(`/fragrance/${frag.id}`)}
                      className="text-2xl font-serif text-white uppercase tracking-wider font-light cursor-pointer hover:text-amber-200 transition-colors"
                    >
                      {frag.name}
                    </h3>
                    <p className="text-xs font-sans text-zinc-400 font-light line-clamp-2">
                      {frag.tagline}
                    </p>
                  </div>

                  {/* Scent Pyramid Tabs */}
                  <div className="pt-2">
                    <div className="flex items-center justify-center gap-2 border-b border-zinc-900 pb-2 text-[10px] font-sans tracking-widest uppercase">
                      <button
                        onClick={() => setActiveTab({ ...activeTab, [frag.id]: 'top' })}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          currentTab === 'top' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Top Notes
                      </button>
                      <button
                        onClick={() => setActiveTab({ ...activeTab, [frag.id]: 'heart' })}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          currentTab === 'heart' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Heart Notes
                      </button>
                      <button
                        onClick={() => setActiveTab({ ...activeTab, [frag.id]: 'base' })}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          currentTab === 'base' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Base Notes
                      </button>
                    </div>

                    <div className="mt-2.5 flex flex-wrap justify-center gap-1.5 min-h-[44px]">
                      {currentTab === 'top' &&
                        frag.topNotes.map((note) => (
                          <span
                            key={note}
                            className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-sans text-zinc-300"
                          >
                            {note}
                          </span>
                        ))}
                      {currentTab === 'heart' &&
                        frag.heartNotes.map((note) => (
                          <span
                            key={note}
                            className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-sans text-amber-200/90"
                          >
                            {note}
                          </span>
                        ))}
                      {currentTab === 'base' &&
                        frag.baseNotes.map((note) => (
                          <span
                            key={note}
                            className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-sans text-red-300/90"
                          >
                            {note}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Size Selector & Add to Bag */}
                <div className="relative z-10 mt-6 pt-4 border-t border-zinc-900 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSize({ ...selectedSize, [frag.id]: '50ml' })}
                        className={`px-3 py-1 rounded-full border text-[10px] font-sans tracking-widest uppercase transition-all ${
                          size === '50ml'
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                            : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        50ml
                      </button>
                      <button
                        onClick={() => setSelectedSize({ ...selectedSize, [frag.id]: '100ml' })}
                        className={`px-3 py-1 rounded-full border text-[10px] font-sans tracking-widest uppercase transition-all ${
                          size === '100ml'
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                            : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        100ml
                      </button>
                    </div>
                    <span className="font-serif text-lg text-white font-medium">${price}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        playClick();
                        addItem(frag, size);
                      }}
                      onMouseEnter={() => setCursor('ADD TO BAG', 'button')}
                      onMouseLeave={resetCursor}
                      className="py-3 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-sans tracking-widest uppercase font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(227,6,19,0.3)] cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add Bag</span>
                    </button>

                    <button
                      onClick={() => {
                        playClick();
                        navigate(`/fragrance/${frag.id}`);
                      }}
                      onMouseEnter={() => setCursor('ENTER 2x2 WORLD', 'hover')}
                      onMouseLeave={resetCursor}
                      className="py-3 px-4 bg-zinc-900 border border-zinc-800 hover:border-amber-400 text-zinc-300 hover:text-white rounded-xl text-xs font-sans tracking-widest uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>2×2 World</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
