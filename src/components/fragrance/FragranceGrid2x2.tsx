import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ASSETS } from '../../data/fragrances';
import { Fragrance } from '../../types/fragrance';
import { useCartStore, useCursorStore } from '../../store/useStore';
import { useAudio } from '../../hooks/useAudio';
import { Gift, Check, Play, Maximize2, X, Sparkles, Volume2 } from 'lucide-react';

interface FragranceGrid2x2Props {
  fragrance?: Fragrance;
  fragranceName?: string;
  onClose?: () => void;
}

interface VideoPanel {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
}

export const FragranceGrid2x2: React.FC<FragranceGrid2x2Props> = ({
  fragrance,
  fragranceName,
  onClose,
}) => {
  const { setCursor, resetCursor } = useCursorStore();
  const { playClick } = useAudio();
  const { addItem } = useCartStore();

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activePanel, setActivePanel] = useState<VideoPanel | null>(null);

  const activeName = fragrance?.name || fragranceName || 'LUMIÈRE PARFUMS';

  // Customized 4 Autoplay Video Panels tailored to the active perfume
  const videoPanels: VideoPanel[] = [
    {
      id: 'panel-1',
      title: activeName.toUpperCase(),
      subtitle: 'SCENARIO 01 • UNBOXING REEL',
      image: ASSETS.discoveryGloveBottle,
      tag: 'AUTOPLAYING 4K',
    },
    {
      id: 'panel-2',
      title: fragrance?.subtitle.toUpperCase() || 'SIN & PLEASURE',
      subtitle: 'SCENARIO 02 • SEDUCTIVE NOTES',
      image: ASSETS.discoveryAppleBottle,
      tag: 'AUTOPLAYING 4K',
    },
    {
      id: 'panel-3',
      title: 'MAD HONEY & ACCORDS',
      subtitle: 'SCENARIO 03 • AMBER DRIZZLE',
      image: ASSETS.discoveryHoneyBottle,
      tag: 'AUTOPLAYING 4K',
    },
    {
      id: 'panel-4',
      title: 'DRUNK LOVERS VINTAGE',
      subtitle: 'SCENARIO 04 • COGNAC INFUSION',
      image: ASSETS.discoveryWineBottle,
      tag: 'AUTOPLAYING 4K',
    },
  ];

  const handleUnlockGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    playClick();
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 font-sans">
      {/* 2-COLUMN DISCOVERY CARD CONTAINER (MATCHES EXACT BORNTOSTANDOUT RED MODAL) */}
      <div className="relative w-full rounded-[20px] bg-[#d6001c] shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
        
        {/* TOP RIGHT CLOSE DIALOG BUTTON (EXACT SVG STYLE FROM SCREENSHOT) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-50 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all border border-white/30 backdrop-blur-md"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* LEFT COLUMN: 2x2 AUTOPLAYING VIDEO GRID */}
        <div className="w-full lg:w-[48%] grid grid-cols-2 bg-black relative overflow-hidden">
          {videoPanels.map((panel, idx) => (
            <motion.div
              key={panel.id}
              onClick={() => setActivePanel(panel)}
              onMouseEnter={() => setCursor('WATCH REEL', 'video')}
              onMouseLeave={resetCursor}
              className="relative aspect-square overflow-hidden cursor-pointer group border-r border-b border-zinc-900/60"
            >
              {/* Autoplay Motion Loop (Pan & Scale) */}
              <motion.img
                src={panel.image}
                alt={panel.title}
                className="w-full h-full object-cover"
                animate={{
                  scale: [1, 1.08, 1],
                  x: idx % 2 === 0 ? [0, -4, 0] : [0, 4, 0],
                  y: idx < 2 ? [0, -4, 0] : [0, 4, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 6 + idx * 2,
                  ease: 'easeInOut',
                }}
              />

              {/* Shimmer Light Reflection Overlay for Autoplay Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + idx * 1.5,
                  ease: 'linear',
                  delay: idx * 0.8,
                }}
              />

              {/* Dark Gradient Contrast Mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent group-hover:from-black/95 transition-colors duration-300" />

              {/* Top Autoplay Live Badge */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-[8px] font-sans font-extrabold tracking-widest text-white uppercase backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <Play className="w-2 h-2 fill-white" />
                  AUTOPLAY 0{idx + 1}
                </span>
              </div>

              {/* Expand Icon */}
              <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6.5 h-6.5 rounded-full bg-black/70 border border-white/30 flex items-center justify-center text-white backdrop-blur-md">
                  <Maximize2 className="w-3 h-3" />
                </div>
              </div>

              {/* Bottom Scene Info */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-left">
                <span className="block text-[8px] font-sans tracking-widest text-amber-300/90 font-semibold uppercase">
                  {panel.subtitle}
                </span>
                <h4 className="text-xs sm:text-sm font-sans font-black text-white tracking-wider uppercase drop-shadow-md line-clamp-1">
                  {panel.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* RIGHT COLUMN: CRIMSON RED FORM (EXACT DESIGN MATCH) */}
        <div className="w-full lg:w-[52%] bg-[#d6001c] p-6 sm:p-10 flex flex-col justify-center items-center text-center space-y-5 text-white relative">
          
          {/* Brand Logo Header */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-serif font-bold tracking-[0.35em] uppercase text-amber-200/90 drop-shadow-sm">
              BORNTOSTANDOUT® / LUMIÈRE
            </span>
            <div className="w-12 h-[1px] bg-white/40 my-2" />
          </div>

          {/* Headline (Bebas / Heavy Bold Sans Style) */}
          <div className="space-y-0.5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans uppercase tracking-tight text-white leading-none drop-shadow-md">
              START YOUR DISCOVERY.
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans uppercase tracking-tight text-white leading-none drop-shadow-md">
              WE’LL HANDLE THE REST
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base font-sans tracking-wide text-white/95 max-w-sm font-medium">
            Your first bottle deserves a gift.
          </p>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleUnlockGift} className="w-full max-w-sm space-y-3 pt-2">
              <div className="relative">
                <label htmlFor="discovery-modal-email" className="sr-only">
                  Buy your favorite scent. We'll add a free gift.
                </label>
                <input
                  id="discovery-modal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full py-3.5 px-5 bg-white text-black font-sans text-sm rounded-md placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
                />
              </div>

              <button
                type="submit"
                onMouseEnter={() => setCursor('UNLOCK GIFT', 'button')}
                onMouseLeave={resetCursor}
                className="w-full py-3.5 px-6 bg-transparent hover:bg-white text-white hover:text-[#d6001c] font-sans font-black tracking-[0.2em] text-sm uppercase border-2 border-white rounded-md transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>UNLOCK MY GIFT</span>
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm p-5 bg-black/40 border border-amber-300/60 rounded-xl space-y-2 backdrop-blur-md"
            >
              <div className="flex items-center justify-center gap-2 text-amber-300">
                <Check className="w-5 h-5" />
                <span className="font-sans text-xs font-bold uppercase tracking-widest">
                  GIFT ACTIVATED: DISCOVERY100
                </span>
              </div>
              <p className="text-xs text-white/95 leading-relaxed">
                A complimentary 10ml Extrait Discovery Atomizer has been added for <strong>{email}</strong>.
              </p>
            </motion.div>
          )}

          <p className="text-[10px] text-white/70 tracking-wider uppercase pt-2">
            Complimentary luxury shipping & samples included with every order.
          </p>
        </div>

      </div>

      {/* EXPANDED FULLSCREEN REEL MODAL */}
      <AnimatePresence>
        {activePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePanel(null)}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-zinc-950 border border-red-500/40 rounded-2xl overflow-hidden shadow-2xl p-6 text-center space-y-4"
            >
              <button
                onClick={() => setActivePanel(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <img src={activePanel.image} alt={activePanel.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                  <Volume2 className="w-3 h-3 animate-pulse" />
                  AUTOPLAYING 4K CINEMATIC REEL
                </div>
              </div>

              <span className="text-xs font-mono tracking-widest text-red-400 uppercase">
                {activePanel.subtitle}
              </span>
              <h3 className="text-2xl font-serif text-white uppercase">{activePanel.title}</h3>
              <p className="text-xs text-zinc-400">
                Cinematic sensory exhibition featuring 4K macro camera motion and atmospheric sound design.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
