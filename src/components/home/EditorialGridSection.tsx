import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCursorStore } from '../../store/useStore';
import { useAudio } from '../../hooks/useAudio';

import koreanIncenseImg from '../../assets/images/korean_incense_box_1785819570941.jpg';
import eauDeParfumImg from '../../assets/images/drunk_lovers_bottle_1785819581840.jpg';
import extraitExtremeImg from '../../assets/images/oud_candy_extrait_1785819592645.jpg';

export const EditorialGridSection: React.FC = () => {
  const navigate = useNavigate();
  const { setCursor, resetCursor } = useCursorStore();
  const { playClick } = useAudio();

  return (
    <section className="relative w-full bg-black text-white py-0 border-t border-b border-red-950/40 select-none overflow-hidden">
      {/* EDITORIAL GRID CONTAINER — EXACT BORN TO STAND OUT 3-TILE LAYOUT */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[680px] lg:min-h-[780px] gap-0 border-b border-zinc-900">
        
        {/* LEFT COLUMN: 2 HORIZONTALLY SPLIT TILES */}
        <div className="flex flex-col w-full h-full border-r-0 lg:border-r border-zinc-900">
          
          {/* TILE 1: KOREAN INCENSE */}
          <div 
            onClick={() => {
              playClick();
              navigate('/fragrance/drunk-lovers');
            }}
            onMouseEnter={() => setCursor('SHOP KOREAN INCENSE', 'button')}
            onMouseLeave={resetCursor}
            className="group relative w-full h-[340px] sm:h-[390px] overflow-hidden cursor-pointer border-b border-zinc-900 bg-red-950/40"
          >
            <img 
              src={koreanIncenseImg} 
              alt="Korean Incense Collection" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.92] group-hover:brightness-100"
            />
            {/* Vignette Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-colors duration-500" />

            {/* Bottom Left Content Overlay */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10 space-y-1">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black uppercase tracking-tight text-white drop-shadow-md group-hover:text-red-400 transition-colors">
                KOREAN INCENSE
              </h3>
              <div className="inline-block">
                <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-white uppercase underline underline-offset-4 decoration-2 decoration-white group-hover:decoration-red-400 transition-all">
                  SHOP NOW
                </span>
              </div>
            </div>
          </div>

          {/* TILE 2: EAU DE PARFUM */}
          <div 
            onClick={() => {
              playClick();
              navigate('/fragrance/dirty-rice');
            }}
            onMouseEnter={() => setCursor('SHOP EAU DE PARFUM', 'button')}
            onMouseLeave={resetCursor}
            className="group relative w-full h-[340px] sm:h-[390px] overflow-hidden cursor-pointer bg-black"
          >
            <img 
              src={eauDeParfumImg} 
              alt="Eau De Parfum Collection" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.9] group-hover:brightness-100"
            />
            {/* Vignette Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/65 transition-colors duration-500" />

            {/* Bottom Left Content Overlay */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10 space-y-1">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black uppercase tracking-tight text-white drop-shadow-md group-hover:text-amber-300 transition-colors">
                EAU DE PARFUM
              </h3>
              <div className="inline-block">
                <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-white uppercase underline underline-offset-4 decoration-2 decoration-white group-hover:decoration-amber-300 transition-all">
                  SHOP NOW
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TALL FULL HEIGHT TILE — EXTRAIT EXTRÊME */}
        <div 
          onClick={() => {
            playClick();
            navigate('/fragrance/dance-with-the-devil');
          }}
          onMouseEnter={() => setCursor('SHOP EXTRAIT EXTRÊME', 'button')}
          onMouseLeave={resetCursor}
          className="group relative w-full h-[580px] lg:h-full min-h-[680px] overflow-hidden cursor-pointer bg-zinc-950"
        >
          <img 
            src={extraitExtremeImg} 
            alt="Extrait Extrême Collection" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.9] group-hover:brightness-100"
          />
          {/* Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/65 transition-colors duration-500" />

          {/* Bottom Left Content Overlay */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10 space-y-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black uppercase tracking-tight text-white drop-shadow-md group-hover:text-red-400 transition-colors">
              EXTRAIT EXTRÊME
            </h3>
            <div className="inline-block">
              <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-white uppercase underline underline-offset-4 decoration-2 decoration-white group-hover:decoration-red-400 transition-all">
                SHOP NOW
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
