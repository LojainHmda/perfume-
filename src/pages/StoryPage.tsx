import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Compass } from 'lucide-react';

export const StoryPage: React.FC = () => {
  return (
    <div className="w-full bg-[#070708] text-white min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-sans text-[11px] font-semibold tracking-[0.35em] uppercase">
            PARFUM DE LUXE MANIFESTO
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif uppercase tracking-wider text-white font-extralight">
            Checkmate
          </h1>
          <p className="text-sm font-sans tracking-widest text-zinc-400 uppercase max-w-xl mx-auto font-light">
            Rebellious Haute Perfumery • Obsidian Sculptural Aesthetics • visceral scent storytelling
          </p>
        </div>

        <div className="prose prose-invert max-w-none font-sans text-zinc-300 leading-relaxed space-y-6 text-sm sm:text-base font-light">
          <p className="text-lg font-serif italic text-amber-100 border-l-2 border-amber-400 pl-6 my-6">
            "In a world conditioned by safe scents and muted conformism, we design fragrances for those who choose to be unforgettably distinct."
          </p>

          <p>
            Established as a high-concept perfume house, CHECKMATE treats olfactory creation not as a commercial product line, but as an interactive art exhibition. We fuse old-world master distillation techniques with provocative modern narratives.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 pt-6">
            <div className="p-8 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-serif text-white uppercase tracking-wider">
                Raw Visceral Ingredients
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                From 30-year wild Cambodian agarwood to Florentine iris butter dried for three full years, we spare zero expense in sourcing rare natural essences.
              </p>
            </div>

            <div className="p-8 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
              <Shield className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-serif text-white uppercase tracking-wider">
                Monolithic Sculptural Bottles
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Our heavy ceramic and ruby glass vessels are inspired by modern minimalist architecture, designed to stand out on any vanity table.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
