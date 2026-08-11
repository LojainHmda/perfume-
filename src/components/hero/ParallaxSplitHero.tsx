import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FRAGRANCES } from '../../data/fragrances';
import { useCursorStore } from '../../store/useStore';
import { useAudio } from '../../hooks/useAudio';
import { TransparentBottleImage, processTransparentImage } from '../common/TransparentBottleImage';
import { ArrowRight } from 'lucide-react';

export const ParallaxSplitHero: React.FC = () => {
  const navigate = useNavigate();
  const { setCursor, resetCursor } = useCursorStore();
  const { playClick } = useAudio();

  // Selected column index (0, 1, 2). Default to null (all closed)
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Pre-process & cache all bottle images on mount so opening/expanding is instantaneous with 0 flash
  useEffect(() => {
    FRAGRANCES.slice(0, 3).forEach((item) => {
      if (item.image) {
        processTransparentImage(item.image, 210);
      }
    });
  }, []);

  const handleCardClick = (frag: typeof FRAGRANCES[0], idx: number) => {
    playClick();
    if (activeIdx === idx) {
      // Direct navigation to the official fragrance detail page
      navigate(`/fragrance/${frag.id}`);
    } else {
      // Expand/drag open this section
      setActiveIdx(idx);
    }
  };

  // Exactly 3 Featured Perfumes mapped directly from FRAGRANCES data
  const items = [
    {
      ...FRAGRANCES[0], // Dance with the Devil
      num: '01',
      title: FRAGRANCES[0].name,
      subtitle: 'Nocturnal Cherry & Oud',
      bgColor: 'bg-[#2A080C]',
      inactiveBg: 'bg-[#FAF0F1]',
      hoverBg: 'hover:bg-[#F3E0E3]',
      accentTop: 'bg-[#990F26]',
      btnHoverBg: 'group-hover:bg-[#990F26]',
      tagText: 'CHERRY & OUD',
      hexColor: '#2A080C',
      watermarkText: 'DEVIL',
    },
    {
      ...FRAGRANCES[1], // Bombshell Seduction
      num: '02',
      title: FRAGRANCES[1].name,
      subtitle: 'White Peony & Velvet Sage',
      bgColor: 'bg-[#2E181D]',
      inactiveBg: 'bg-[#F9EFF3]',
      hoverBg: 'hover:bg-[#F0DEE6]',
      accentTop: 'bg-[#9E2A51]',
      btnHoverBg: 'group-hover:bg-[#9E2A51]',
      tagText: 'PEONY & SAGE',
      hexColor: '#2E181D',
      watermarkText: 'SEDUCTION',
    },
    {
      ...FRAGRANCES[2], // French Vanilla
      num: '03',
      title: FRAGRANCES[2].name,
      subtitle: 'Madagascar Vanilla & Amber',
      bgColor: 'bg-[#281E08]',
      inactiveBg: 'bg-[#FAF5E6]',
      hoverBg: 'hover:bg-[#F2E8CE]',
      accentTop: 'bg-[#C88A2E]',
      btnHoverBg: 'group-hover:bg-[#C88A2E]',
      tagText: 'VANILLA & AMBER',
      hexColor: '#281E08',
      watermarkText: 'VANILLA',
    },
  ];

  return (
    <section
      className="relative w-full h-screen min-h-[640px] max-h-[1080px] bg-[#121214] text-zinc-900 overflow-hidden select-none font-sans"
    >
      {/* 3-COLUMN SPLIT CARDS HERO VIEW WITH DISTINCT COLOR DEGREES */}
      <div className="w-full h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-300/80 transition-all duration-300">
        {items.map((item, idx) => {
          const isActive = activeIdx === idx;

          return (
            <motion.div
              key={item.id + idx}
              onMouseEnter={() => {
                setCursor(isActive ? `VIEW ${item.title.toUpperCase()}` : `EXPAND ${item.title.toUpperCase()}`, 'hover');
              }}
              onMouseLeave={resetCursor}
              onClick={() => handleCardClick(item, idx)}
              className={`relative h-full flex flex-col cursor-pointer transition-all duration-500 ease-out overflow-hidden group ${
                isActive
                  ? `justify-between pt-20 sm:pt-24 pb-8 sm:pb-10 px-6 sm:px-8 lg:px-10 md:flex-[2.5] flex-[2] ${item.bgColor} text-white shadow-2xl z-20`
                  : `justify-center items-start px-6 sm:px-8 lg:px-10 py-12 flex-1 ${item.inactiveBg} ${item.hoverBg} text-zinc-900 z-10 hover:shadow-lg`
              }`}
            >
              {/* TOP COLOR ACCENT BAR FOR VISUAL DISTINCTION */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 transition-opacity duration-300 ${item.accentTop} ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`} />

              {/* 1. TOP NUMBER & TITLE HEADER */}
              <div className="relative z-10 space-y-3 w-full">
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-mono font-bold tracking-widest block transition-colors duration-300 ${
                      isActive ? 'text-white/80' : 'text-zinc-600'
                    }`}
                  >
                    SECTION {item.num}
                  </span>
                  {!isActive && (
                    <span className="text-[10px] font-sans font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/5 text-zinc-700 border border-black/10 group-hover:bg-black group-hover:text-white transition-all">
                      {item.tagText}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h2
                    className={`text-2xl sm:text-3xl lg:text-4xl font-sans font-bold tracking-tight transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-zinc-950 group-hover:translate-x-1 transition-transform'
                    }`}
                  >
                    {item.title}
                  </h2>
                  <p
                    className={`text-xs sm:text-sm font-sans font-medium transition-colors duration-300 ${
                      isActive ? 'text-white/80' : 'text-zinc-600'
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* 2. CENTER TRANSPARENT PERFUME BOTTLE SHOWCASE (ONLY SHOWN WHEN CLICKED/ACTIVE) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [0, -8, 0],
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      opacity: { duration: 0.35 },
                      scale: { duration: 0.35, ease: 'easeOut' },
                      y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
                    }}
                    className="my-auto py-4 flex items-center justify-center pointer-events-none z-10"
                  >
                    {/* Bottle with 100% Canvas Background Stripper */}
                    <div className="relative w-40 sm:w-48 h-56 sm:h-64 flex items-center justify-center">
                      <TransparentBottleImage
                        src={item.image}
                        alt={item.title}
                        threshold={210}
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3. PILL BUTTON ("View more ->") */}
              <div className={`relative z-10 w-full ${isActive ? 'pt-4 mt-auto' : 'pt-4'}`}>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(item, idx);
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-sans font-semibold tracking-wider transition-all shadow-sm ${
                    isActive
                      ? 'bg-white/20 hover:bg-white text-white hover:text-zinc-950 border border-white/40 backdrop-blur-md'
                      : `bg-zinc-950 ${item.btnHoverBg} text-white border border-transparent shadow-md`
                  }`}
                >
                  <span>{isActive ? 'Explore Fragrance' : 'Click to Expand'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

