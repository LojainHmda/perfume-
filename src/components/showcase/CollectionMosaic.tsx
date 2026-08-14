import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fragrance } from '../../types/fragrance';
import { MediaSlide } from '../../types/settings';
import { useCursorStore } from '../../store/useStore';

interface CollectionMosaicProps {
  fragrances: Fragrance[];
  headline: string;
  notation: string;
  /** The underlined words at the foot of every tile. */
  cta: string;
  /**
   * The plates, in grid order. Each names the product it opens, so the mosaic
   * is no longer a fixed map from product id to a bundled image — an admin can
   * re-shoot a tile, re-point it, or add a fourth without touching this file.
   */
  slides: MediaSlide[];
}

/**
 * Two columns: two stacked tiles on the left, one full-height tile on the
 * right. Every tile is a plate with its name set over the lower left and the
 * action underlined beneath it — no frames, no card chrome. The grid itself is
 * the composition.
 *
 * The plates used to run edge to edge and meet with no gutter. They are now
 * pulled in and stood apart so the board shows around and between them: the
 * brand is CHECKMATE, so the ground the collection sits on is literally a
 * chessboard. Proportions are untouched — the left column still adds up to the
 * exact height of the right tile, the gutter taken out of the two halves.
 */
export const CollectionMosaic: React.FC<CollectionMosaicProps> = ({
  fragrances,
  headline,
  notation,
  cta,
  slides,
}) => {
  // A tile is a plate plus whichever product it points at. The product is what
  // gives it its name, its accent and its destination; the plate is only the
  // photograph, so a slot with neither is nothing to draw.
  const tiles = slides
    .map((slide) => ({
      slide,
      fragrance: fragrances.find((entry) => entry.id === slide.productId),
    }))
    .filter((tile) => tile.slide.src || tile.fragrance);

  // The composition is two stacked plates beside one standing full height. The
  // third slot is the tall one; everything else stacks on the left in order, so
  // a fourth tile lengthens the left column rather than breaking the grid.
  const standing = tiles[2];
  const stacked = tiles.filter((_, index) => index !== 2);

  return (
    <section className="relative w-full overflow-hidden bg-obsidian" aria-label={headline}>
      {/* The board, faded top and bottom so the section still meets its
          neighbours on the same obsidian ground. */}
      <div
        aria-hidden
        className="board-checker absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_10%,#000_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_10%,#000_90%,transparent_100%)]"
      />

      <div className="relative px-6 pb-10 pt-24 sm:px-10 sm:pt-28 lg:px-16">
        <div className="mx-auto flex max-w-[112rem] flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(1.9rem,4.2vw,3.2rem)] text-porcelain">{headline}</h2>
          <p className="notation text-ash">{notation}</p>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[96rem] grid-cols-1 gap-6 px-6 pb-20 sm:px-10 lg:grid-cols-2 lg:gap-8 lg:px-16 lg:pb-28">
        <div className="flex flex-col gap-6 lg:gap-8">
          {stacked.map(({ slide, fragrance }) => (
            // Half the right tile less half the gutter, so the two columns end level.
            <Tile
              key={slide.id}
              slide={slide}
              fragrance={fragrance}
              cta={cta}
              className="h-[40svh] min-h-[17rem] lg:h-[calc(35svh-1rem)]"
            />
          ))}
        </div>

        {standing && (
          <Tile
            slide={standing.slide}
            fragrance={standing.fragrance}
            cta={cta}
            className="h-[54svh] min-h-[23rem] lg:h-[70svh]"
          />
        )}
      </div>
    </section>
  );
};

interface TileProps {
  slide: MediaSlide;
  /** The catalogue entry behind the plate, when the slot names one. */
  fragrance?: Fragrance;
  cta: string;
  className: string;
}

const Tile: React.FC<TileProps> = ({ slide, fragrance, cta, className }) => {
  const navigate = useNavigate();
  const { setCursor, resetCursor } = useCursorStore();

  // A slot with no plate of its own borrows the product photograph, which is
  // what an admin who links a product and uploads nothing plainly means.
  const image = slide.src || fragrance?.image;
  const name = slide.title || fragrance?.name || slide.alt || '';
  const to = fragrance ? `/fragrance/${fragrance.id}` : slide.href;

  const open = () => {
    if (to) navigate(to);
  };

  return (
    <article
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      }}
      onMouseEnter={() => name && setCursor(`SHOP ${name.toUpperCase()}`, 'magnetic')}
      onMouseLeave={resetCursor}
      // An unlinked plate is a photograph, so it does not pretend to be a door.
      role={to ? 'link' : undefined}
      tabIndex={to ? 0 : undefined}
      aria-label={to ? `Shop ${name}` : undefined}
      style={fragrance ? { ['--accent' as string]: fragrance.colorTheme } : undefined}
      className={`group relative w-full overflow-hidden ${to ? 'cursor-pointer' : ''} ${className}`}
    >
      {image && (
        <img
          src={image}
          alt={slide.alt ?? name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
        />
      )}

      {/* Seat the lower left so the name always has something to sit on. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,6,7,0.88)_0%,rgba(6,6,7,0.35)_34%,transparent_68%)]"
      />

      <div className="absolute bottom-0 left-0 p-7 sm:p-9 lg:p-11">
        <h3 className="font-sans text-[clamp(1.5rem,2.8vw,2.5rem)] font-bold uppercase leading-none tracking-tight text-porcelain">
          {name}
        </h3>
        {to && (
          <span className="mt-4 inline-block border-b-2 border-porcelain pb-1 transition-colors duration-500 group-hover:border-[color:var(--accent-type)]">
            <span className="eyebrow text-porcelain">{cta}</span>
          </span>
        )}
      </div>
    </article>
  );
};
