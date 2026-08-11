import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, Flame, Leaf } from 'lucide-react';
import { useCursorStore } from '../../store/useStore';

interface OlfactoryPyramidProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  sillage: string;
  longevity: string;
}

export const OlfactoryPyramid: React.FC<OlfactoryPyramidProps> = ({
  topNotes,
  heartNotes,
  baseNotes,
  sillage,
  longevity,
}) => {
  const [activeTier, setActiveTier] = useState<'top' | 'heart' | 'base'>('heart');
  const { setCursor, resetCursor } = useCursorStore();

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-3xl p-8 sm:p-12 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-900 pb-6 gap-4">
        <div>
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-amber-300">
            COMPOSITION ARCHITECTURE
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-wider font-extralight mt-1">
            Olfactory Note Pyramid
          </h3>
        </div>

        {/* Longevity & Sillage Stats */}
        <div className="flex items-center gap-6 text-xs font-sans tracking-widest text-zinc-400 uppercase">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span>Sillage: <strong className="text-white">{sillage}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Longevity: <strong className="text-white">{longevity}</strong></span>
          </div>
        </div>
      </div>

      {/* Interactive Pyramid Tier Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {(['top', 'heart', 'base'] as const).map((tier) => (
          <button
            key={tier}
            onClick={() => setActiveTier(tier)}
            onMouseEnter={() => setCursor(tier.toUpperCase() + ' NOTES', 'hover')}
            onMouseLeave={resetCursor}
            className={`py-4 px-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-center space-y-1 ${
              activeTier === tier
                ? 'bg-amber-400/10 border-amber-400 text-amber-200 shadow-[0_0_25px_rgba(212,175,55,0.2)]'
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase font-bold">
              {tier === 'top' ? '01 • TOP' : tier === 'heart' ? '02 • HEART' : '03 • BASE'}
            </span>
            <span className="text-xs font-serif uppercase tracking-wider">
              {tier === 'top' ? 'Initial Flash (0–15m)' : tier === 'heart' ? 'The Core Character (1–6h)' : 'The Endless Trail (6–14h)'}
            </span>
          </button>
        ))}
      </div>

      {/* Active Tier Notes Details */}
      <motion.div
        key={activeTier}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-8 bg-zinc-900/60 rounded-2xl border border-amber-500/20 space-y-4"
      >
        <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-amber-300 uppercase">
          <Leaf className="w-4 h-4" />
          <span>
            {activeTier === 'top'
              ? 'Top Notes — The Volatile First Impression'
              : activeTier === 'heart'
              ? 'Heart Notes — The Signature Character'
              : 'Base Notes — The Deep Anchoring Sillage'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {(activeTier === 'top' ? topNotes : activeTier === 'heart' ? heartNotes : baseNotes).map((note, idx) => (
            <div
              key={idx}
              className="p-4 bg-black/60 rounded-xl border border-zinc-800/80 flex items-center justify-between"
            >
              <span className="font-serif text-sm text-white uppercase tracking-wider">{note}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400/60" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
