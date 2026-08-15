import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Fragrance } from '../../types/fragrance';
import { SEAL } from '../../data/assets';
import { useCursorStore } from '../../store/useStore';

interface FragranceCompositionsProps {
  fragrances: Fragrance[];
  onOpen: (fragrance: Fragrance) => void;
  /** What the custom cursor reads while a panel is under it. */
  revealLabel: string;
  /** The invitation that surfaces once the bottle has risen. */
  enterLabel: string;
}

const REVEAL = [0.16, 1, 0.3, 1] as const;

/** True on pointers that can actually hover; false on touch, where we reveal on view instead. */
const useHoverCapable = () => {
  const [capable, setCapable] = useState(true);
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setCapable(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return capable;
};

/**
 * Three compositions, not three cards.
 *
 * Each panel rests as the fragrance's wax seal on its own ground. On approach
 * the seal dissolves and the bottle rises from behind it — one gesture, roughly
 * a second, no bounce. Panels are full-bleed and unbordered; the only thing
 * separating them is that each is lit differently.
 */
export const FragranceCompositions: React.FC<FragranceCompositionsProps> = ({
  fragrances,
  onOpen,
  revealLabel,
  enterLabel,
}) => (
  <section id="collection" className="relative w-full bg-obsidian" aria-label="The collection">
    <div className="grid grid-cols-1 lg:grid-cols-3">
      {fragrances.map((fragrance, i) => (
        <Composition
          key={fragrance.id}
          fragrance={fragrance}
          index={i}
          onOpen={onOpen}
          revealLabel={revealLabel}
          enterLabel={enterLabel}
        />
      ))}
    </div>
  </section>
);

const Composition: React.FC<{
  fragrance: Fragrance;
  index: number;
  onOpen: (f: Fragrance) => void;
  revealLabel: string;
  enterLabel: string;
}> = ({ fragrance, index, onOpen, revealLabel, enterLabel }) => {
  const { setCursor, resetCursor } = useCursorStore();
  const hoverCapable = useHoverCapable();
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Touch has no hover, so the reveal is driven by the panel settling in view.
  useEffect(() => {
    if (hoverCapable || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio > 0.55),
      { threshold: [0, 0.55, 1] }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hoverCapable]);

  const revealed = hoverCapable ? hovered : inView;
  const isPlate = fragrance.presentation === 'plate';

  // Each ground is lit from a different quarter so the three read as a set
  // without repeating.
  const groundAngle = ['at 50% 22%', 'at 50% 78%', 'at 50% 40%'][index % 3];

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        setHovered(true);
        setCursor(revealLabel, 'magnetic');
      }}
      onMouseLeave={() => {
        setHovered(false);
        resetCursor();
      }}
      onClick={() => onOpen(fragrance)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(fragrance);
        }
      }}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      role="link"
      tabIndex={0}
      aria-label={`${fragrance.name} — ${fragrance.tagline}`}
      style={{
        ['--accent' as string]: fragrance.colorTheme,
        ['--accent-glow' as string]: fragrance.accentGlow,
      }}
      className="group relative flex h-[78svh] min-h-[30rem] cursor-pointer flex-col items-center justify-center overflow-hidden lg:h-[88svh]"
    >
      {/* Ground. Near-black at rest, warming as the bottle arrives. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#0A0A0D_0%,#060607_55%,#0A0A0D_100%)]"
      />
      <motion.div
        aria-hidden
        animate={{ opacity: revealed ? 1 : 0.28 }}
        transition={{ duration: 1, ease: REVEAL }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 62% 52% ${groundAngle}, var(--accent-glow) 0%, transparent 68%)`,
        }}
      />

      {/* The plate fragrance reveals as its own photograph filling the panel. */}
      {isPlate && (
        <motion.img
          src={fragrance.image}
          alt=""
          aria-hidden
          loading="lazy"
          animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 1.12 }}
          transition={{ duration: 1.4, ease: REVEAL }}
          // Feathered on every edge: the still has to dissolve into the panel,
          // otherwise its studio ground ends in a rectangle and the whole thing
          // reads as a card.
          className="absolute inset-0 h-full w-full object-cover [mask-image:radial-gradient(ellipse_56%_78%_at_50%_46%,#000_26%,transparent_92%)]"
        />
      )}
      {isPlate && (
        <motion.div
          aria-hidden
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1.2, ease: REVEAL }}
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,7,0.82)_0%,rgba(6,6,7,0.25)_45%,rgba(6,6,7,0.92)_100%)]"
        />
      )}

      {/* Notation, always present. */}
      <span className="notation absolute top-10 z-20 text-ash/70">{fragrance.moveNotation}</span>

      {/* ---- The reveal pair, sharing one centre ---- */}
      <div className="relative z-10 flex h-[54%] w-full items-center justify-center">
        {/* Seal: recedes and softens rather than simply disappearing. */}
        <motion.div
          animate={{
            opacity: revealed ? 0 : 1,
            scale: revealed ? 1.14 : 1,
            filter: revealed ? 'blur(7px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.75, ease: REVEAL }}
          className="absolute flex h-full items-center justify-center"
        >
          {/* Supplied artwork, unaltered — sized and animated only. */}
          <img
            src={SEAL}
            alt=""
            className="h-[15rem] w-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.85)] sm:h-[17rem]"
          />
        </motion.div>

        {/* Bottle: rises from behind the seal, uncovered from the base up. */}
        {!isPlate && (
          <motion.div
            aria-hidden
            initial={false}
            animate={{
              opacity: revealed ? 1 : 0,
              y: revealed ? 0 : 34,
              scale: revealed ? 1 : 0.94,
              clipPath: revealed ? 'inset(0% 0% 0% 0%)' : 'inset(26% 0% 0% 0%)',
            }}
            transition={{ duration: 1.05, ease: REVEAL, delay: revealed ? 0.1 : 0 }}
            className="absolute flex h-full items-center justify-center"
          >
            {/* No drop-shadow here. That filter traces the source's alpha, and
                a bottle swapped in from the admin is very often an opaque JPG —
                which has no silhouette to trace, so the shadow comes out as the
                photograph's own rectangle. The contact shadow below grounds the
                bottle instead, and it does not care what the file looks like. */}
            <img
              src={fragrance.image}
              alt=""
              loading="lazy"
              className="h-full w-auto object-contain"
            />
          </motion.div>
        )}
      </div>

      {/* Contact shadow under whatever is currently standing there. */}
      <motion.div
        aria-hidden
        animate={{ opacity: revealed && !isPlate ? 0.9 : 0.4 }}
        transition={{ duration: 0.9, ease: REVEAL }}
        className="contact-shadow absolute bottom-[24%] h-[7%] w-[46%]"
      />

      {/* ---- Legend ---- */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 px-8 pb-12 text-center">
        <motion.h3
          animate={{ y: revealed ? -6 : 0 }}
          transition={{ duration: 0.9, ease: REVEAL }}
          className="display text-[clamp(1.6rem,2.6vw,2.4rem)] text-porcelain"
        >
          {fragrance.name}
        </motion.h3>

        <p className="text-[0.6875rem] tracking-[0.22em] text-ash uppercase">{fragrance.concentration}</p>

        {/* The invitation only appears once the bottle has. */}
        <motion.span
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 8 }}
          transition={{ duration: 0.7, ease: REVEAL, delay: revealed ? 0.25 : 0 }}
          className="mt-3 flex items-center gap-3"
        >
          <span className="eyebrow text-porcelain">{enterLabel}</span>
          <span className="h-px w-10 bg-[color:var(--accent-type)]" />
        </motion.span>
      </div>
    </div>
  );
};
