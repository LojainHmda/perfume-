import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check } from 'lucide-react';
import { Fragrance } from '../../types/fragrance';

interface EngravingModalProps {
  fragrance: Fragrance;
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
}

export const EngravingModal: React.FC<EngravingModalProps> = ({
  fragrance,
  isOpen,
  onClose,
  onSave,
}) => {
  const [engravingText, setEngravingText] = useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    onSave(engravingText.trim().toUpperCase());
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-amber-400/40 rounded-3xl p-8 space-y-6 shadow-2xl text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1">
            <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-amber-300">
              HAUTE ATELIER SERVICE
            </span>
            <h3 className="text-2xl font-serif uppercase tracking-wider text-white">
              Laser Bottle Engraving
            </h3>
            <p className="text-xs font-sans text-zinc-400 uppercase tracking-widest">
              Personalize your bottle of {fragrance.name} with bespoke gold laser typography.
            </p>
          </div>

          {/* Bottle Preview with Laser Text */}
          <div className="relative h-64 bg-zinc-900/60 rounded-2xl border border-zinc-800 flex items-center justify-center overflow-hidden">
            <img
              src={fragrance.image}
              alt={fragrance.name}
              referrerPolicy="no-referrer"
              className="h-48 object-contain"
            />
            {engravingText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-16 px-4 py-1 bg-black/80 border border-amber-400/80 rounded shadow-lg text-amber-300 font-serif text-xs uppercase tracking-[0.3em]"
              >
                ✦ {engravingText.toUpperCase()} ✦
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-sans uppercase tracking-widest text-zinc-300 flex justify-between">
              <span>Your Inscription (Max 18 Characters)</span>
              <span className="text-amber-400">{engravingText.length}/18</span>
            </label>
            <input
              type="text"
              maxLength={18}
              value={engravingText}
              onChange={(e) => setEngravingText(e.target.value)}
              placeholder="E.G. DANCE WITH ME"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-serif tracking-widest uppercase focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            onClick={handleApply}
            className="w-full py-4 bg-gradient-to-r from-red-900 via-amber-600 to-red-900 text-white font-sans text-xs uppercase tracking-[0.3em] rounded-full shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply Custom Engraving</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
