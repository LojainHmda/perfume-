import React from 'react';
import { Link } from 'react-router-dom';
import { useUnboxingStore, useCursorStore } from '../../store/useStore';
import { useAudio } from '../../hooks/useAudio';
import { Box, Sparkles, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { triggerUnboxing } = useUnboxingStore();
  const { setCursor, resetCursor } = useCursorStore();
  const { playClick } = useAudio();

  return (
    <footer className="w-full bg-black border-t border-zinc-900 text-white py-16 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-950/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Col 1 Brand */}
        <div className="space-y-4 md:col-span-2">
          <span className="font-serif tracking-[0.35em] text-xs text-amber-300 uppercase">
            HAUTE PARFUMERIE
          </span>
          <h3 className="font-sans font-black text-2xl tracking-[0.3em] uppercase">
            BORN TO STAND OUT
          </h3>
          <p className="text-xs font-sans text-zinc-400 max-w-md leading-relaxed">
            We do not craft perfumes to blend into the shadows. Born To Stand Out is a high-end rebellious fragrance house dedicated to visceral scent storytelling, sculptural obsidian craftsmanship, and uninhibited emotion.
          </p>

          <button
            onClick={() => {
              playClick();
              triggerUnboxing();
            }}
            onMouseEnter={() => setCursor('REPLAY', 'button')}
            onMouseLeave={resetCursor}
            className="mt-4 px-6 py-3 bg-zinc-900 border border-amber-500/30 rounded-full text-xs font-sans tracking-[0.2em] text-amber-200 uppercase hover:bg-amber-400/10 hover:border-amber-400 transition-colors flex items-center gap-2"
          >
            <Box className="w-4 h-4 text-amber-400" />
            <span>Replay Unboxing Experience</span>
          </button>
        </div>

        {/* Col 2 Exhibition Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-serif tracking-[0.3em] uppercase text-amber-300">
            THE EXHIBITION
          </h4>
          <ul className="space-y-2 text-xs font-sans tracking-widest text-zinc-400 uppercase">
            <li>
              <Link to="/fragrance/dance-with-the-devil" className="hover:text-white transition-colors">
                Dance with the Devil
              </Link>
            </li>
            <li>
              <Link to="/fragrance/bombshell-seduction" className="hover:text-white transition-colors">
                Bombshell Seduction
              </Link>
            </li>
            <li>
              <Link to="/fragrance/french-vanilla" className="hover:text-white transition-colors">
                French Vanilla
              </Link>
            </li>
            <li>
              <Link to="/story" className="hover:text-white transition-colors">
                Perfumer Manifesto
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3 Atelier Services */}
        <div className="space-y-3">
          <h4 className="text-xs font-serif tracking-[0.3em] uppercase text-amber-300">
            HAUTE SERVICES
          </h4>
          <ul className="space-y-2 text-xs font-sans tracking-widest text-zinc-400 uppercase">
            <li className="flex items-center gap-1">
              <span>Laser Bottle Engraving</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </li>
            <li>Complimentary Discovery Samples</li>
            <li>Velvet & Wax Seal Gift Wrap</li>
            <li>Worldwide Express Logistics</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between text-[10px] font-sans tracking-[0.3em] text-zinc-600 uppercase">
        <span>© 2026 BORN TO STAND OUT — ALL RIGHTS RESERVED</span>
        <span>PARFUM DE LUXE • ORIGINAL IMPLEMENTATION</span>
      </div>
    </footer>
  );
};
