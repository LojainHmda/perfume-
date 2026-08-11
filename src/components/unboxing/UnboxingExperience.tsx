import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUnboxingStore, useCursorStore, useCartStore } from '../../store/useStore';
import { useAudio } from '../../hooks/useAudio';
import { ASSETS, FRAGRANCES } from '../../data/fragrances';
import { TransparentBottleImage } from '../common/TransparentBottleImage';
import { Perfume3DScene } from './Perfume3DScene';
import { Sparkles, ArrowRight, RotateCcw, ShoppingBag, Eye, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type UnboxingPhase = 
  | 'pristine'         // STEP 1: Pristine box with NO seal on surface
  | 'applying_seal'    // STEP 2: Circular sticker seal descends & presses onto box surface
  | 'seal_attached'    // Sealed box ready for unboxing
  | 'peeling'          // STEP 3: Smooth physical vinyl peel (continuous smooth 3D curl, no hard cuts/cracks)
  | 'lid_opening'      // STEP 4: Box lid opens on top physical hinge
  | 'bottles_reveal';  // STEP 5: Perfume bottles elevate out of velvet cavity

export const UnboxingExperience: React.FC = () => {
  const navigate = useNavigate();
  const { hasUnboxed, skipUnboxing, setStep } = useUnboxingStore();
  const { setCursor, resetCursor } = useCursorStore();
  const { addItem } = useCartStore();
  const { playClick, playSealSnap, playBoxOpen, playPeelSound } = useAudio();

  const [phase, setPhase] = useState<UnboxingPhase>('pristine');
  const [activeFragranceIndex, setActiveFragranceIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('50ml');
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const activeFragrance = FRAGRANCES[activeFragranceIndex] || FRAGRANCES[0];

  // Note: Unboxing renders as the hero section of the landing page
  const handleBoxClick = () => {
    if (phase === 'pristine') {
      playClick();
      // STEP 1: Seal attaches onto box surface
      setPhase('applying_seal');
      playSealSnap();

      // STEP 2: Seal peels/breaks
      setTimeout(() => {
        setPhase('peeling');
        playPeelSound();

        // STEP 3: Lid opens slowly in 3D
        setTimeout(() => {
          setPhase('lid_opening');
          playBoxOpen();

          // STEP 4: Complete reveal & present action controls
          setTimeout(() => {
            setPhase('bottles_reveal');
            setStep(5);
          }, 2400);
        }, 1200);
      }, 700);
    } else if (phase === 'seal_attached') {
      playClick();
      setPhase('peeling');
      playPeelSound();

      setTimeout(() => {
        setPhase('lid_opening');
        playBoxOpen();

        setTimeout(() => {
          setPhase('bottles_reveal');
          setStep(5);
        }, 2400);
      }, 1200);
    }
  };

  const handleResetSequence = () => {
    playClick();
    setPhase('pristine');
    setStep(1);
  };

  return (
    <section
      id="hero-unboxing"
      className="relative w-full min-h-[calc(100vh-4rem)] sm:min-h-screen bg-[#050507] flex flex-col items-center justify-between pt-16 sm:pt-20 pb-6 px-4 text-white select-none overflow-hidden border-b border-zinc-900/80"
    >
      {/* CINEMATIC SOFT AMBIENT SPOTLIGHT BEAM */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Radial Spotlight Centered above the Box */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.20)_0%,rgba(251,191,36,0.08)_45%,transparent_75%)] blur-2xl opacity-90" />
      </div>

      {/* Background Dark Room Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(40,30,25,0.4)_0%,rgba(5,5,7,1)_85%)] pointer-events-none" />

      {/* Floating Ambient Gold Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-100/50 blur-[0.5px]"
            style={{
              width: Math.random() * 3 + 1.5,
              height: Math.random() * 3 + 1.5,
              top: `${Math.random() * 75 + 10}%`,
              left: `${Math.random() * 85 + 5}%`,
              boxShadow: '0 0 8px rgba(251,191,36,0.8)',
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.15, 0.85, 0.15],
            }}
            transition={{
              duration: 3.5 + Math.random() * 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Replay / Reset Control */}
      <AnimatePresence>
        {phase !== 'pristine' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 sm:top-20 right-6 z-40"
          >
            <button
              onClick={handleResetSequence}
              onMouseEnter={() => setCursor('REPLAY EXPERIENCE', 'hover')}
              onMouseLeave={resetCursor}
              className="flex items-center gap-2 text-[10px] sm:text-[11px] tracking-widest text-amber-300 hover:text-white uppercase transition-all px-4 py-2 bg-black/70 backdrop-blur-md border border-amber-500/40 hover:border-amber-400 rounded-full cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Box</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN HERO CONTENT STAGE */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-between relative z-20 flex-1 py-2">

        {/* TOP HERO TYPOGRAPHY BLOCK */}
        <div className="text-center space-y-2 max-w-3xl mx-auto px-4 pt-1 z-20">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.4em] text-amber-400/90 uppercase block whitespace-nowrap"
          >
            {phase === 'bottles_reveal' ? 'EXPLORE HAUTE PARFUM' : 'EAU DE PARFUM COLLECTION'}
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl md:text-5xl font-serif tracking-[0.2em] text-white uppercase font-light leading-none whitespace-nowrap"
          >
            BORN TO STAND OUT
          </motion.h1>

          <p className="text-[11px] sm:text-xs font-sans text-zinc-400 font-light tracking-[0.2em] uppercase leading-relaxed max-w-md mx-auto">
            {phase === 'bottles_reveal'
              ? 'DANCE WITH THE DEVIL REVEALED IN LUXURY ATELIER CASE.'
              : 'CLICK THE LUXURY PERFUME BOX TO UNVEIL THE EXPERIENCE.'}
          </p>
        </div>

        {/* CENTRAL STAGE & 3D UNBOXING EXPERIENCE BOX */}
        <div className="relative w-full max-w-2xl flex-1 flex flex-col items-center justify-center my-auto mx-auto px-2">
          <div className="relative w-full">
            <Perfume3DScene
              phase={phase}
              onBoxClick={handleBoxClick}
              activeFragrance={activeFragrance}
            />
          </div>


        </div>

      </div>

      {/* Scroll Indicator Prompt */}
      <div className="mt-2 sm:mt-4 text-center z-20">
        <p className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase flex items-center justify-center gap-2">
          <span>Scroll Down to Discover Collection</span>
          <span className="animate-bounce font-bold text-amber-400">↓</span>
        </p>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Physical Sticker Peel Engine (Exact 4-Panel Reference Geometry)             */
/* -------------------------------------------------------------------------- */

function getClipPolygons(K: number) {
  if (K >= 400) {
    return {
      unpeeled: '0,0 200,0 200,200 0,200',
      peeled: '',
    };
  }
  if (K >= 200) {
    const x = K - 200;
    const y = K - 200;
    return {
      unpeeled: `0,0 200,0 200,${y} ${x},200 0,200`,
      peeled: `200,${y} 200,200 ${x},200`,
    };
  }
  if (K > 0) {
    return {
      unpeeled: `0,0 ${K},0 0,${K}`,
      peeled: `${K},0 200,0 200,200 0,200 0,${K}`,
    };
  }
  return {
    unpeeled: '',
    peeled: '0,0 200,0 200,200 0,200',
  };
}

export const StickerPeelAnimation: React.FC = () => {
  const [K, setK] = useState(352);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200; // 1.2s responsive vinyl peel sequence

    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);

      // Interpolate K from 352 (flat) down to -20 (fully unpeeled)
      const currentK = 352 - progress * 372;
      setK(currentK);

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, []);

  // Compute polygons and fold line intercepts P1 & P2
  const clipPolygons = getClipPolygons(K);

  let p1 = { x: 200, y: Math.max(0, K - 200) };
  let p2 = { x: Math.max(0, K - 200), y: 200 };
  if (K < 200) {
    p1 = { x: Math.max(0, K), y: 0 };
    p2 = { x: 0, y: Math.max(0, K) };
  }

  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center [transform-style:preserve-3d]">
      
      {/* Main SVG Physical Peel Container */}
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: [1, 1, 1, 1, 0], scale: [1, 1.01, 1.03, 1.05, 1.08] }}
        transition={{ duration: 1.2, times: [0, 0.28, 0.58, 0.88, 1], ease: 'linear' }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] overflow-visible"
        >
          <defs>
            {/* Circular Sticker Outline Mask */}
            <clipPath id="stickerCircleClip">
              <circle cx="100" cy="100" r="80" />
            </clipPath>

            {/* Satin Silver/White Metallic Paper Backing */}
            <linearGradient id="silverSatin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#f8fafc" />
              <stop offset="55%" stopColor="#e2e8f0" />
              <stop offset="85%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Specular Cylindrical Roll Sheen parallel to fold line */}
            <linearGradient id="curlRidgeSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.4)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
            </linearGradient>

            {/* Soft dark drop shadow cast under fold line */}
            <filter id="foldShadowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="-6" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* 1. Base Unpeeled Part attached on Box Surface (Clipped to Circle & Unpeeled Polygon) */}
          {clipPolygons.unpeeled && (
            <g clipPath="url(#stickerCircleClip)">
              <clipPath id="unpeeledClip">
                <polygon points={clipPolygons.unpeeled} />
              </clipPath>
              <g clipPath="url(#unpeeledClip)">
                <circle cx="100" cy="100" r="80" fill="#000000" />
                <image
                  href={ASSETS.waxSeal}
                  x="20"
                  y="20"
                  width="160"
                  height="160"
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              </g>
            </g>
          )}

          {/* 2. Fold Line Drop Shadow cast onto base surface */}
          {K < 340 && K > 0 && (
            <g clipPath="url(#stickerCircleClip)">
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#000000"
                strokeWidth="14"
                filter="url(#foldShadowFilter)"
                opacity="0.9"
              />
            </g>
          )}

          {/* 3. Reflected Curled Flap (Perfect Circular Sticker Flap reflected across x+y=K) */}
          {clipPolygons.peeled && K < 340 && (
            <g transform={`translate(${K / 2}, ${K / 2}) rotate(-45) scale(1, -1) rotate(45) translate(${-K / 2}, ${-K / 2})`}>
              <g clipPath="url(#stickerCircleClip)">
                <clipPath id="peeledClip">
                  <polygon points={clipPolygons.peeled} />
                </clipPath>
                <g clipPath="url(#peeledClip)">
                  {/* Silver/white satin paper backing */}
                  <circle cx="100" cy="100" r="80" fill="url(#silverSatin)" />
                  {/* Inner adhesive ring mark */}
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" strokeDasharray="5 3" />
                  {/* Outer gold rim */}
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#fbbf24" strokeWidth="3" />
                  {/* 3D Cylindrical sheen along roll */}
                  <circle cx="100" cy="100" r="80" fill="url(#curlRidgeSheen)" opacity="0.75" />
                </g>
              </g>
            </g>
          )}

          {/* 4. Fold Ridge Specular Edge (Highlight line right along the physical fold crease) */}
          {K < 340 && K > 0 && (
            <g clipPath="url(#stickerCircleClip)">
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#ffffff" strokeWidth="3" opacity="0.95" />
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#fef08a" strokeWidth="6" opacity="0.5" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
