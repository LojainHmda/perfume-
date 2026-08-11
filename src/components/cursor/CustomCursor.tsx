import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'motion/react';
import { useCursorStore } from '../../store/useStore';

export const CustomCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { cursorLabel, cursorVariant } = useCursorStore();
  const mousePos = useRef({ x: -100, y: -100 });
  
  // Spring physics for buttery smooth motion without delay or jitter
  const cursorX = useSpring(-100, { stiffness: 450, damping: 28, mass: 0.2 });
  const cursorY = useSpring(-100, { stiffness: 450, damping: 28, mass: 0.2 });
  
  const trailX = useSpring(-100, { stiffness: 200, damping: 30, mass: 0.5 });
  const trailY = useSpring(-100, { stiffness: 200, damping: 30, mass: 0.5 });

  useEffect(() => {
    // Detect touch / tablet screen
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024;
      setIsTouchDevice(hasTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
    };

    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', checkTouch);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTouchDevice, cursorX, cursorY, trailX, trailY]);

  if (isTouchDevice) return null;

  // Variants styling logic
  const getDotStyles = () => {
    switch (cursorVariant) {
      case 'hover':
        return 'w-6 h-6 bg-amber-200/20 border border-amber-300/60 backdrop-blur-sm shadow-[0_0_10px_rgba(212,175,55,0.4)]';
      case 'magnetic':
        return 'w-8 h-8 bg-red-900/30 border border-red-500/80 shadow-[0_0_15px_rgba(200,16,46,0.5)]';
      case 'button':
        return 'w-6 h-6 bg-amber-400 text-black scale-110';
      case 'video':
        return 'w-10 h-10 bg-black/70 border border-red-500/50 backdrop-blur-md';
      case 'drag':
        return 'w-8 h-8 bg-amber-400/30 border border-amber-400';
      default:
        return 'w-3 h-3 bg-amber-100/90 shadow-[0_0_8px_rgba(255,255,255,0.8)]';
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Interpolated Ring */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
        }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/30 pointer-events-none transition-all duration-300"
        animate={{
          scale: cursorVariant !== 'default' ? 1.3 : 1,
          opacity: cursorVariant !== 'default' ? 0.7 : 0.3,
          width: 28,
          height: 28,
        }}
      />

      {/* Main Sharp Interactive Core Cursor */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
        }}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-center transition-colors duration-200 pointer-events-none ${getDotStyles()}`}
        animate={{
          scale: cursorVariant === 'magnetic' ? 1.2 : cursorVariant === 'button' ? 1.1 : 1,
        }}
      />
    </div>
  );
};
