import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fragrance } from '../../types/fragrance';
import { ASSETS } from '../../data/fragrances';
import { StickerPeelAnimation } from './UnboxingExperience';
import { TransparentBottleImage } from '../common/TransparentBottleImage';

interface Perfume3DSceneProps {
  phase: string;
  onBoxClick: () => void;
  activeFragrance: Fragrance;
}

/**
 * IsolatedBoxImage Component
 * Performs BFS flood-fill background removal on canvas to isolate the box image.
 * Hides raw image completely before canvas processing to avoid any white background flashing.
 */
const IsolatedBoxImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  lightThreshold?: number;
}> = ({ src, alt, className = '', lightThreshold = 180 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;

    img.onload = () => {
      if (!isMounted) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const w = img.width;
      const h = img.height;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Flood-fill BFS to remove outer white/light backdrop pixels
      const visited = new Uint8Array(w * h);
      const queue: number[] = [];

      const isLight = (idx: number) => {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const lum = (r * 299 + g * 587 + b * 114) / 1000;
        return lum >= lightThreshold && r >= 150 && g >= 150 && b >= 150;
      };

      for (let x = 0; x < w; x++) {
        const topIdx = (0 * w + x) * 4;
        const botIdx = ((h - 1) * w + x) * 4;
        if (isLight(topIdx)) {
          visited[x] = 1;
          queue.push(x, 0);
        }
        if (isLight(botIdx)) {
          visited[(h - 1) * w + x] = 1;
          queue.push(x, h - 1);
        }
      }

      for (let y = 0; y < h; y++) {
        const leftIdx = (y * w + 0) * 4;
        const rightIdx = (y * w + (w - 1)) * 4;
        if (!visited[y * w] && isLight(leftIdx)) {
          visited[y * w] = 1;
          queue.push(0, y);
        }
        if (!visited[y * w + (w - 1)] && isLight(rightIdx)) {
          visited[y * w + (w - 1)] = 1;
          queue.push(w - 1, y);
        }
      }

      // BFS Traversal
      let head = 0;
      const dx = [1, -1, 0, 0];
      const dy = [0, 0, 1, -1];

      while (head < queue.length) {
        const cx = queue[head++];
        const cy = queue[head++];
        const currPix = cy * w + cx;
        const dataIdx = currPix * 4;

        data[dataIdx + 3] = 0;

        for (let i = 0; i < 4; i++) {
          const nx = cx + dx[i];
          const ny = cy + dy[i];

          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const nextPix = ny * w + nx;
            if (!visited[nextPix]) {
              visited[nextPix] = 1;
              const nextDataIdx = nextPix * 4;
              if (isLight(nextDataIdx)) {
                queue.push(nx, ny);
              }
            }
          }
        }
      }

      // Edge smoothing
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const pix = y * w + x;
          const dataIdx = pix * 4;
          if (data[dataIdx + 3] !== 0) {
            let hasBgNeighbor = false;
            for (let i = 0; i < 4; i++) {
              const nx = x + dx[i];
              const ny = y + dy[i];
              if (data[(ny * w + nx) * 4 + 3] === 0) {
                hasBgNeighbor = true;
                break;
              }
            }
            if (hasBgNeighbor) {
              const r = data[dataIdx];
              const g = data[dataIdx + 1];
              const b = data[dataIdx + 2];
              const lum = (r + g + b) / 3;
              if (lum > 140) {
                data[dataIdx + 3] = Math.max(0, Math.min(255, Math.floor((255 - lum) * 2)));
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setIsLoaded(true);
    };

    return () => {
      isMounted = false;
    };
  }, [src, lightThreshold]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        aria-label={alt}
        className={`w-full h-full object-contain ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
      />
    </div>
  );
};

export const Perfume3DScene: React.FC<Perfume3DSceneProps> = ({
  phase,
  onBoxClick,
  activeFragrance,
}) => {
  const isOpeningOrRevealed = phase === 'lid_opening' || phase === 'bottles_reveal';
  const isPeelingOrApplying = phase === 'applying_seal' || phase === 'peeling';

  return (
    <div
      onClick={onBoxClick}
      className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] cursor-pointer flex items-center justify-center select-none overflow-hidden py-4"
    >
      {/* STAGE CONTAINER WITH FIXED SQUARE DIMENSIONS FOR MATCHED BOX SIZING */}
      <div className="relative w-[340px] sm:w-[460px] md:w-[500px] aspect-square flex items-center justify-center">
        
        {/* 1. CLOSED LUMIÈRE BOX PHOTO (PERSISTENTLY MOUNTED, ZERO WHITE FLASH) */}
        <motion.div
          className="absolute inset-0 w-full h-full flex items-center justify-center z-20 pointer-events-none"
          initial={false}
          animate={{
            opacity: !isOpeningOrRevealed ? 1 : 0,
            scale: !isOpeningOrRevealed ? 1 : 0.96,
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full h-full p-2 flex items-center justify-center">
            <IsolatedBoxImage
              src={ASSETS.boxIsolatedClosed || ASSETS.boxClosed}
              alt="Lumiere Presentation Box Closed"
              className="w-full h-full max-h-[92%] object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            />
          </div>
        </motion.div>

        {/* 2. OPEN LUMIÈRE BOX PHOTO WITH BOTTLE REVEAL (PERSISTENTLY MOUNTED) */}
        <motion.div
          className="absolute inset-0 w-full h-full flex items-center justify-center z-10 pointer-events-none"
          initial={false}
          animate={{
            opacity: isOpeningOrRevealed ? 1 : 0,
            scale: isOpeningOrRevealed ? 1 : 0.96,
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <IsolatedBoxImage
              src={ASSETS.boxIsolatedOpen || ASSETS.boxRealOpen}
              alt="Lumiere Presentation Box Open"
              className="w-full h-full max-h-[92%] object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            />

            {/* PERFUME BOTTLE INSIDE OPEN BOX TRAY */}
            <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
              <motion.div
                className="relative w-[52%] sm:w-[48%] max-h-[78%] flex items-center justify-center"
                initial={false}
                animate={{
                  opacity: isOpeningOrRevealed ? 1 : 0,
                  y: isOpeningOrRevealed ? 0 : 16,
                  scale: isOpeningOrRevealed ? 1 : 0.94,
                }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Ambient Glow */}
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-60" />

                <motion.div
                  className="relative z-10 flex items-center justify-center max-h-[220px] sm:max-h-[260px] w-auto"
                  animate={isOpeningOrRevealed ? { y: [0, -3, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                >
                  <TransparentBottleImage
                    src={activeFragrance.image}
                    alt={activeFragrance.name}
                    threshold={200}
                    className="max-h-[220px] sm:max-h-[260px] w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 3. WAX SEAL INTERACTION OVERLAY */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40">
          <AnimatePresence mode="wait">
            {phase === 'pristine' && (
              <motion.div
                key="wax-seal-pristine"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={ASSETS.waxSeal}
                    alt="Gold Wax Seal"
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="mt-3 px-3.5 py-1 bg-black/85 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] tracking-[0.25em] text-amber-300 uppercase font-sans font-semibold border border-amber-500/40 shadow-lg animate-pulse">
                  Click Seal to Open
                </span>
              </motion.div>
            )}

            {isPeelingOrApplying && (
              <motion.div
                key="wax-seal-peel"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-40"
              >
                <StickerPeelAnimation />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
