import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getDefaultMediaPanels, useProductStore } from '../store/useProductStore';
import { EngravingModal } from '../components/fragrance/EngravingModal';
import { MediaSurface } from '../components/ui/MediaSurface';
import { useCartStore, useCursorStore } from '../store/useStore';
import { useAudio } from '../hooks/useAudio';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const SPEC_ROWS = (fragrance: {
  concentration?: string;
  longevity: string;
  sillage: string;
  mood: string;
  seasonality: string[];
}) => [
  ['Concentration', fragrance.concentration ?? 'Extrait de Parfum'],
  ['Longevity', fragrance.longevity],
  ['Sillage', fragrance.sillage],
  ['Mood', fragrance.mood],
  ['Wear', fragrance.seasonality.join(' · ')],
];

export const FragranceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductStore();
  const { addItem } = useCartStore();
  const { setCursor, resetCursor } = useCursorStore();
  const { playClick } = useAudio();

  const index = Math.max(0, products.findIndex((f) => f.id === id));
  const fragrance = products[index] ?? products[0];
  const nextFragrance = products[(index + 1) % products.length];

  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('100ml');
  const [engravingText, setEngravingText] = useState('');
  const [isEngravingOpen, setIsEngravingOpen] = useState(false);

  if (!fragrance) return null;

  const currentPrice = selectedSize === '50ml' ? fragrance.price50ml : fragrance.price100ml;
  const isPlate = fragrance.presentation === 'plate';
  const mediaPanels = getDefaultMediaPanels(fragrance);

  const handleAddToCart = () => {
    playClick();
    addItem(fragrance, selectedSize, engravingText || undefined);
  };

  return (
    <div
      className="grain w-full bg-obsidian text-porcelain"
      style={{
        ['--accent' as string]: fragrance.colorTheme,
        ['--accent-glow' as string]: fragrance.accentGlow,
      }}
    >
      {/* ---- Chapter head ---- */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 sm:px-10 sm:pt-32 lg:px-16">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] spotlight" />

        <div className="relative mx-auto max-w-[92rem]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              onMouseEnter={() => setCursor('BACK TO THE BOARD', 'button')}
              onMouseLeave={resetCursor}
              className="inline-flex items-center gap-2 text-ash transition-colors hover:text-porcelain"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="eyebrow">The table of moves</span>
            </button>
            <span className="notation text-ash">{fragrance.collection}</span>
          </div>

          <div className="rule mt-8" />

          <div className="mt-14 grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
            {/* Bottle */}
            <motion.div
              layoutId={`bottle-hero-${fragrance.id}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:col-span-6"
            >
              {isPlate ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img src={fragrance.image} alt={fragrance.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
                </div>
              ) : (
                <div className="relative flex h-[52vh] max-h-[38rem] min-h-[20rem] items-center justify-center">
                  <div aria-hidden className="absolute inset-x-[-15%] bottom-0 h-1/2 board-plane opacity-70" />
                  <div aria-hidden className="contact-shadow absolute inset-x-[12%] bottom-[6%] h-[14%]" />
                  <img
                    src={fragrance.image}
                    alt={fragrance.name}
                    className="relative h-full w-auto object-contain drop-shadow-[0_45px_70px_rgba(0,0,0,0.9)]"
                  />
                </div>
              )}
            </motion.div>

            {/* Identity */}
            <div className="lg:col-span-6 lg:pl-6">
              <p className="notation text-[color:var(--accent-type)]">
                {fragrance.moveNotation ?? 'Opening'}
              </p>
              <h1 className="display mt-4 text-[clamp(2.6rem,6.5vw,5.6rem)] text-porcelain">
                {fragrance.name}
              </h1>
              <p className="mt-3 text-xs tracking-[0.24em] text-ash uppercase">{fragrance.subtitle}</p>

              <p className="mt-8 max-w-xl text-sm leading-relaxed text-ash sm:text-base">
                {fragrance.description}
              </p>

              {/* ---- Purchase. Present, but set as instrumentation rather than
                      a storefront shout. ---- */}
              <div className="mt-10 border-t border-[color:var(--border-subtle)] pt-8">
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="notation text-ash">Volume</p>
                    <div className="mt-3 flex gap-3">
                      {(['50ml', '100ml'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`border px-5 py-2.5 text-[0.6875rem] tracking-[0.2em] uppercase transition-colors ${
                            selectedSize === size
                              ? 'border-[color:var(--accent-type)] text-porcelain'
                              : 'border-[color:var(--border-subtle)] text-ash hover:text-porcelain'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="font-serif text-4xl text-porcelain">
                    ${currentPrice}
                    <span className="ml-2 align-super text-[0.6875rem] tracking-[0.2em] text-ash">USD</span>
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <button
                    onClick={handleAddToCart}
                    onMouseEnter={() => setCursor('ADD TO BAG', 'button')}
                    onMouseLeave={resetCursor}
                    className="group inline-flex items-center gap-3 border-b border-[color:var(--accent-type)] pb-2 text-porcelain"
                  >
                    <span className="eyebrow">Add to bag</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" strokeWidth={1.5} />
                  </button>

                  {fragrance.engravingAvailable && (
                    <button
                      onClick={() => setIsEngravingOpen(true)}
                      onMouseEnter={() => setCursor('INSCRIBE', 'button')}
                      onMouseLeave={resetCursor}
                      className="inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.18em] text-ash uppercase underline-offset-8 transition-colors hover:text-porcelain hover:underline"
                    >
                      {engravingText ? <Check className="h-3 w-3" strokeWidth={2} /> : null}
                      {engravingText ? `Inscribed “${engravingText}”` : 'Add an inscription'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- The pyramid ---- */}
      <section className="border-t border-[color:var(--border-subtle)] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[92rem]">
          <h2 className="display text-[clamp(1.8rem,4vw,3rem)] text-porcelain">The Composition</h2>
          <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-[color:var(--border-subtle)] bg-[color:var(--border-subtle)] sm:grid-cols-3">
            {(
              [
                ['Top', fragrance.topNotes],
                ['Heart', fragrance.heartNotes],
                ['Base', fragrance.baseNotes],
              ] as const
            ).map(([label, notes]) => (
              <div key={label} className="bg-obsidian p-7">
                <dt className="notation text-[color:var(--accent-type)]">{label}</dt>
                <dd className="mt-5 space-y-2.5">
                  {notes.map((note) => (
                    <span key={note} className="block font-serif text-lg text-porcelain/90">
                      {note}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- Four movements. Each slot shows the film or still an admin
              uploaded for it; where nothing was uploaded, the generated
              atmosphere the site ships with plays instead. ---- */}
      <section className="border-t border-[color:var(--border-subtle)] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[92rem]">
          <h2 className="display text-[clamp(1.8rem,4vw,3rem)] text-porcelain">In Four Movements</h2>
          <div className="mt-10 grid grid-cols-1 gap-px bg-[color:var(--border-subtle)] sm:grid-cols-2">
            {fragrance.gridPanels.map((panel, index) => {
              const media = mediaPanels[index];
              return (
                <article key={panel.id} className="group relative aspect-[4/3] overflow-hidden bg-obsidian">
                  <MediaSurface
                    panel={media}
                    fallback={panel}
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <p className="notation text-ash">{panel.category}</p>
                    <h3 className="display mt-2 text-2xl text-porcelain sm:text-3xl">
                      {media?.title || panel.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-xs leading-relaxed text-ash">{panel.description}</p>
                    <p className="mt-4 font-serif text-lg italic text-porcelain/80">“{panel.overlayQuote}”</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Story + spec ---- */}
      <section className="border-t border-[color:var(--border-subtle)] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[92rem] grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display text-[clamp(1.8rem,4vw,3rem)] text-porcelain">The Origin</h2>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-ash sm:text-base">{fragrance.story}</p>
            <blockquote className="mt-8 border-l border-[color:var(--accent-type)] pl-5 font-serif text-xl italic text-porcelain/90">
              {fragrance.inspiration}
            </blockquote>
          </div>

          <dl className="lg:col-span-5">
            {SPEC_ROWS(fragrance).map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-6 border-b border-[color:var(--border-subtle)] py-5"
              >
                <dt className="notation shrink-0 text-ash">{label}</dt>
                <dd className="text-right text-sm text-porcelain/90">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- Next move ---- */}
      {nextFragrance && nextFragrance.id !== fragrance.id && (
        <section className="border-t border-[color:var(--border-subtle)] px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[92rem]">
            <p className="notation text-ash">Next move</p>
            <Link
              to={`/fragrance/${nextFragrance.id}`}
              onMouseEnter={() => setCursor('OPEN', 'magnetic')}
              onMouseLeave={resetCursor}
              className="group mt-5 flex flex-wrap items-baseline justify-between gap-6"
            >
              <span className="display text-[clamp(2rem,6vw,4.5rem)] text-porcelain transition-transform duration-500 group-hover:translate-x-3">
                {nextFragrance.name}
              </span>
              <span className="notation text-ash">{nextFragrance.moveNotation}</span>
            </Link>
          </div>
        </section>
      )}

      <EngravingModal
        fragrance={fragrance}
        isOpen={isEngravingOpen}
        onClose={() => setIsEngravingOpen(false)}
        onSave={(text) => setEngravingText(text)}
      />
    </div>
  );
};
