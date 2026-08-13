import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fragrance } from '../../types/fragrance';
import { useCursorStore } from '../../store/useStore';
import plateDance from '../../assets/images/generated/tile-dance.jpg';
import plateFire from '../../assets/images/generated/tile-fire.jpg';
import plateFireTwo from '../../assets/images/generated/tile-fire-two.jpg';

interface CollectionMosaicProps {
  fragrances: Fragrance[];
}

/** Plates are generated per fragrance by scripts/generate_art.py. */
const PLATES: Record<string, string> = {
  'dance-with-the-devil': plateDance,
  'fire-in-the-hole': plateFire,
  'fire-in-the-hole-2': plateFireTwo,
};

/**
 * Two columns, edge to edge: two stacked tiles on the left, one full-height
 * tile on the right. Every tile is a full-bleed plate with its name set over
 * the lower left and the action underlined beneath it — no frames, no gaps, no
 * card chrome. The grid itself is the composition.
 */
export const CollectionMosaic: React.FC<CollectionMosaicProps> = ({ fragrances }) => {
  const [first, second, third] = fragrances;

  return (
    <section className="w-full bg-obsidian" aria-label="The Grandmaster Series">
      <div className="px-6 pb-10 pt-24 sm:px-10 sm:pt-28 lg:px-16">
        <div className="mx-auto flex max-w-[112rem] flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(1.9rem,4.2vw,3.2rem)] text-porcelain">The Grandmaster Series</h2>
          <p className="notation text-ash">Extrait de Parfum — Paris</p>
        </div>
      </div>

      {/* Full-bleed from here down: the tiles meet with no gutter. */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col">
          {[first, second].filter(Boolean).map((fragrance) => (
            <Tile key={fragrance.id} fragrance={fragrance} className="h-[52svh] min-h-[22rem] lg:h-[45svh]" />
          ))}
        </div>

        {third && <Tile fragrance={third} className="h-[70svh] min-h-[30rem] lg:h-[90svh]" />}
      </div>
    </section>
  );
};

const Tile: React.FC<{ fragrance: Fragrance; className: string }> = ({ fragrance, className }) => {
  const navigate = useNavigate();
  const { setCursor, resetCursor } = useCursorStore();

  return (
    <article
      onClick={() => navigate(`/fragrance/${fragrance.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/fragrance/${fragrance.id}`);
        }
      }}
      onMouseEnter={() => setCursor(`SHOP ${fragrance.name.toUpperCase()}`, 'magnetic')}
      onMouseLeave={resetCursor}
      role="link"
      tabIndex={0}
      aria-label={`Shop ${fragrance.name}`}
      style={{ ['--accent' as string]: fragrance.colorTheme }}
      className={`group relative w-full cursor-pointer overflow-hidden ${className}`}
    >
      <img
        src={PLATES[fragrance.id] ?? fragrance.image}
        alt={fragrance.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
      />

      {/* Seat the lower left so the name always has something to sit on. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,6,7,0.88)_0%,rgba(6,6,7,0.35)_34%,transparent_68%)]"
      />

      <div className="absolute bottom-0 left-0 p-7 sm:p-9 lg:p-11">
        <h3 className="font-sans text-[clamp(1.5rem,2.8vw,2.5rem)] font-bold uppercase leading-none tracking-tight text-porcelain">
          {fragrance.name}
        </h3>
        <span className="mt-4 inline-block border-b-2 border-porcelain pb-1 transition-colors duration-500 group-hover:border-[color:var(--accent-type)]">
          <span className="eyebrow text-porcelain">Shop now</span>
        </span>
      </div>
    </article>
  );
};
