import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProductStore, getDefaultMediaPanels } from '../store/useProductStore';
import { ASSETS } from '../data/fragrances';
import { EngravingModal } from '../components/fragrance/EngravingModal';
import { useCartStore, useCursorStore } from '../store/useStore';
import { useAudio } from '../hooks/useAudio';
import { TransparentBottleImage } from '../components/common/TransparentBottleImage';
import {
  ArrowLeft,
  ShoppingBag,
  Play,
  Maximize2,
  X,
  Volume2
} from 'lucide-react';
import { MediaPanelConfig } from '../types/fragrance';

export const FragranceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductStore();
  
  const fragrance = products.find((f) => f.id === id) || products[0];

  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('100ml');
  const [engravingText, setEngravingText] = useState('');
  const [isEngravingOpen, setIsEngravingOpen] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState<MediaPanelConfig | null>(null);

  const { addItem } = useCartStore();
  const { setCursor, resetCursor } = useCursorStore();
  const { playClick } = useAudio();

  const currentPrice = selectedSize === '50ml' ? fragrance.price50ml : fragrance.price100ml;

  const handleAddToCart = () => {
    playClick();
    addItem(fragrance, selectedSize, engravingText || undefined);
  };

  // 4 Dynamic Autoplay Media Panels matching fragrance config
  const mediaPanels = getDefaultMediaPanels(fragrance);

  return (
    <div className="w-full h-screen bg-[#08080a] text-zinc-100 flex flex-col lg:flex-row font-sans pt-16 overflow-hidden">
      
      {/* LEFT HALF: 2x2 AUTOPLAYING MEDIA GALLERY GRID */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full grid grid-cols-2 grid-rows-2 bg-black relative overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800/60 p-1 gap-1">
        {mediaPanels.map((panel, idx) => (
          <motion.div
            key={panel.id}
            onClick={() => setActiveMediaModal(panel)}
            onMouseEnter={() => setCursor('EXPAND REEL', 'video')}
            onMouseLeave={resetCursor}
            className="relative w-full h-full overflow-hidden cursor-pointer group bg-zinc-950 rounded-sm"
          >
            {/* Smooth Continuous Zoom & Pan Autoplay Motion */}
            <motion.img
              src={panel.image}
              alt={panel.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              animate={{
                scale: [1, 1.07, 1],
              }}
              transition={{
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 8 + idx * 2,
                ease: 'easeInOut',
              }}
            />

            {/* Gradient Overlay for Readable Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 group-hover:from-black/95 transition-all duration-300" />

            {/* Minimal Autoplay Badge */}
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/60 border border-white/10 text-[8px] sm:text-[9px] font-sans font-medium tracking-widest text-zinc-300 uppercase backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Play className="w-2 h-2 fill-white text-white" />
                REEL 0{idx + 1}
              </span>
            </div>

            {/* Subtle Expand Icon on Hover */}
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>

            {/* Clean Bottom Label */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 z-10 text-left space-y-0.5">
              <span className="block text-[8px] sm:text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                {panel.subtitle}
              </span>
              <h4 className="text-xs sm:text-sm font-serif font-medium text-white tracking-wide truncate">
                {panel.title}
              </h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* RIGHT HALF: REGULAR CLEAN PRODUCT INFORMATION & PURCHASING PANEL */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full bg-[#08080a] p-6 sm:p-10 lg:p-12 flex flex-col justify-between overflow-y-auto">
        
        {/* Top Header Navigation */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-zinc-800/60 shrink-0">
          <button
            onClick={() => {
              playClick();
              navigate('/');
            }}
            className="flex items-center gap-2 text-xs font-sans tracking-widest text-zinc-400 hover:text-white uppercase transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Collection Overview</span>
          </button>

          <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
            {fragrance.collection}
          </span>
        </div>

        {/* Main Product Information */}
        <div className="w-full max-w-lg mx-auto my-auto py-6 space-y-6">
          
          {/* Featured Perfume Bottle Showcase with Shared Element Transition */}
          <div className="relative w-full h-52 sm:h-64 flex items-center justify-center my-2 group">
            <div 
              className="absolute inset-0 rounded-3xl opacity-20 filter blur-2xl transition-all duration-700 pointer-events-none"
              style={{ backgroundColor: fragrance.colorTheme }}
            />
            <motion.div layoutId={`bottle-hero-${fragrance.id}`} className="w-full h-full flex items-center justify-center">
              <TransparentBottleImage
                src={fragrance.image}
                alt={fragrance.name}
                threshold={210}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </div>

          {/* Brand & Collection Label */}
          <div className="space-y-1 text-left">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-400 block">
              BORNTOSTANDOUT®
            </span>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-tight font-medium">
              {fragrance.name}
            </div>
            <p className="text-xs font-sans tracking-widest text-zinc-400 uppercase pt-0.5">
              Eau de Parfum • {fragrance.subtitle}
            </p>
          </div>

          {/* Price & Description */}
          <div className="space-y-3 pt-1 border-t border-zinc-900 text-left">
            <div className="text-2xl font-sans font-light text-white">
              ${currentPrice} <span className="text-xs text-zinc-500 font-normal">USD</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {fragrance.description}
            </p>
          </div>

          {/* Purchasing Controls */}
          <div className="space-y-4 pt-2">
            
            {/* Size Selector */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block text-left">
                Select Volume
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedSize('50ml')}
                  className={`py-3 px-4 rounded-lg text-xs font-medium tracking-wider border text-center transition-all ${
                    selectedSize === '50ml'
                      ? 'bg-zinc-100 text-zinc-950 border-white shadow-md font-semibold'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  50 ML • ${fragrance.price50ml}
                </button>
                <button
                  onClick={() => setSelectedSize('100ml')}
                  className={`py-3 px-4 rounded-lg text-xs font-medium tracking-wider border text-center transition-all ${
                    selectedSize === '100ml'
                      ? 'bg-zinc-100 text-zinc-950 border-white shadow-md font-semibold'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  100 ML • ${fragrance.price100ml}
                </button>
              </div>
            </div>

            {/* Main Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              onMouseEnter={() => setCursor('ADD TO BAG', 'button')}
              onMouseLeave={resetCursor}
              className="w-full py-4 px-6 bg-white hover:bg-zinc-200 text-zinc-950 font-sans font-bold tracking-[0.2em] text-xs uppercase rounded-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag • ${currentPrice}</span>
            </button>

          </div>

        </div>

      </div>

      {/* EXPANDED 4K REEL MODAL */}
      <AnimatePresence>
        {activeMediaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMediaModal(null)}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 text-center space-y-4"
            >
              <button
                onClick={() => setActiveMediaModal(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800">
                <img src={activeMediaModal.image} alt={activeMediaModal.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-black/70 border border-white/20 text-white text-[9px] font-medium px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md">
                  <Volume2 className="w-3 h-3 text-white animate-pulse" />
                  CINEMATIC REEL • {fragrance.name}
                </div>
              </div>

              <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
                {activeMediaModal.subtitle}
              </span>
              <h3 className="text-2xl font-serif text-white uppercase">{activeMediaModal.title}</h3>
              <p className="text-xs text-zinc-400">
                High-definition luxury video exhibition.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Engraving Customization Modal */}
      <EngravingModal
        fragrance={fragrance}
        isOpen={isEngravingOpen}
        onClose={() => setIsEngravingOpen(false)}
        onSave={(text) => setEngravingText(text)}
      />

    </div>
  );
};
