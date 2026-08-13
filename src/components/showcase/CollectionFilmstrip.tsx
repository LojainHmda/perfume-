import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { Fragrance } from '../../types/fragrance';
import { MediaSlide } from '../../types/settings';
import { isVideoUrl } from '../../utils/media';

interface CollectionFilmstripProps {
  /** Full-bleed ground for the section. Still or film. */
  background: string;
  eyebrow: string;
  headline: string;
  /** The looping track, in order. Any length — the cycle is measured, not assumed. */
  slides: MediaSlide[];
  /** The catalogue, so each slide can resolve the product it opens. */
  products: Fragrance[];
}

/** Wheel notch to pixels. Roughly one plate per firm scroll. */
const WHEEL_SCALE = 1.1;
/** Per-second approach rate when easing the column toward where it was sent. */
const EASE = 9;
/** Below this the column is settled and the frame loop can stop. */
const SETTLED = 0.05;

/**
 * The collection frame: one plate held full-bleed, the house name set enormous
 * along the bottom, and a column of product stills looping down the right edge.
 *
 * The column is its own scroller. It never moves on its own and it never reads
 * the page's scroll position: it moves when the visitor moves it, by wheeling
 * or dragging over it with the hand, and it comes to rest wherever they leave
 * it. Wheeling anywhere else on the page scrolls the page as usual.
 *
 * Seamlessness comes from repetition, not from a reset: the slide set is
 * rendered end to end enough times to overflow the window, and the drawn offset
 * wraps on the height of exactly one set, so the frame after the wrap is
 * identical to the frame before it. The running offset itself is never
 * wrapped — that is what keeps the easing continuous across the seam.
 */
export const CollectionFilmstrip: React.FC<CollectionFilmstripProps> = ({
  background,
  eyebrow,
  headline,
  slides,
  products,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const reduceMotion = useReducedMotion();

  // Position lives in refs: it changes every frame while settling, and none of
  // it should cost a render.
  const offsetRef = useRef(0);
  const targetRef = useRef(0);
  const cycleRef = useRef(0);
  const frameRef = useRef(0);
  const draggingRef = useRef(false);

  const resolved = useMemo(
    () =>
      slides.map((slide) => {
        const product = slide.productId
          ? products.find((entry) => entry.id === slide.productId)
          : undefined;
        return { slide, product, label: slide.alt ?? product?.name ?? '' };
      }),
    [slides, products],
  );

  // One set must overflow the window, or the loop would show bare ground
  // between repeats. Measure, then render as many sets as it takes.
  useEffect(() => {
    const viewport = windowRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const measure = () => {
      // The cycle is the distance from one set's first plate to the next set's
      // first plate. Read it off the layout rather than from scrollHeight,
      // which drops the last child's bottom margin — that missing margin would
      // put a visible jump at every seam.
      const first = track.children[0] as HTMLElement | undefined;
      const repeat = track.children[resolved.length] as HTMLElement | undefined;
      const cycle =
        first && repeat ? repeat.offsetTop - first.offsetTop : track.scrollHeight / copies;

      cycleRef.current = cycle;
      if (cycle <= 0) return;

      draw();
      const needed = Math.max(2, Math.ceil(viewport.clientHeight / cycle) + 1);
      if (needed !== copies) setCopies(needed);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [copies, resolved.length]);

  /** Paint the current offset, wrapped into one cycle so the seam never shows. */
  const draw = () => {
    const track = trackRef.current;
    const cycle = cycleRef.current;
    if (!track || cycle <= 0) return;
    const wrapped = ((offsetRef.current % cycle) + cycle) % cycle;
    track.style.transform = `translate3d(0, ${-wrapped}px, 0)`;
  };

  /**
   * Run frames only while the column is catching up to where it was sent. At
   * rest nothing is scheduled at all, so an untouched section costs nothing.
   */
  const settle = () => {
    if (frameRef.current) return;

    let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05); // A backgrounded tab
      last = now;                                        // must not jump.

      const gap = targetRef.current - offsetRef.current;
      if (Math.abs(gap) < SETTLED && !draggingRef.current) {
        offsetRef.current = targetRef.current;
        draw();
        frameRef.current = 0;
        return;
      }

      offsetRef.current += gap * Math.min(delta * EASE, 1);
      draw();
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  /** Send the column somewhere. Positive scrolls the plates upward. */
  const nudge = (distance: number) => {
    targetRef.current += distance;
    if (reduceMotion) {
      offsetRef.current = targetRef.current;
      draw();
      return;
    }
    settle();
  };

  // The wheel is claimed only while the pointer is over the column, and the
  // listener has to be non-passive to do it, which React's onWheel cannot be.
  useEffect(() => {
    const viewport = windowRef.current;
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      // Horizontal intent belongs to the page, not to this column.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      nudge(event.deltaY * WHEEL_SCALE);
    };

    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
    // nudge closes over refs only, so this binds once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  // Drag, for the visitor who would rather push the column than wheel it.
  const dragFrom = useRef(0);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    draggingRef.current = true;
    dragFrom.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const delta = event.clientY - dragFrom.current;
    dragFrom.current = event.clientY;
    // Dragging down should bring earlier plates back down with the hand.
    nudge(-delta);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    settle();
  };

  const isFilm = isVideoUrl(background);
  // Repeats carry no links and no alt text — one plate, one entry in the tab
  // order, however many times it is drawn.
  const sets = copies;

  return (
    <section
      aria-label={headline}
      className="relative isolate h-[100svh] min-h-[38rem] w-full overflow-hidden bg-[#4A0509]"
    >
      {/* Ground */}
      {isFilm ? (
        <video
          key={background}
          src={background}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src={background}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      )}

      {/* Two washes: one pooling at the foot of the type, one closing the corners.
          Both stay light — the plate is the section, not a backdrop to bury. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,6,7,0.72)_0%,rgba(6,6,7,0.18)_22%,transparent_44%)]"
      />
      <div aria-hidden="true" className="vignette absolute inset-0 opacity-40" />

      {/* The name, set large and low, hugging the left edge the way the plate
          does. Inert to the pointer: it reaches full width and would otherwise
          sit over the foot of the track and swallow the hand's steering. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 px-[var(--rhythm-3)] pb-[var(--rhythm-4)] sm:px-[var(--rhythm-4)]">
        <span className="notation text-porcelain/60">{eyebrow}</span>
        {/* One line, set as large as the frame allows — the reference lockup. */}
        <h2 className="whitespace-nowrap font-sans text-[clamp(1.75rem,5.4vw,4.75rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-porcelain">
          {headline}
        </h2>
      </div>

      {/* The track. Held clear of the right edge so no plate is ever cut off
          sideways; the section's own top and bottom do the framing instead. */}
      {resolved.length > 0 && (
        <div
          ref={windowRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          role="group"
          aria-label={`${headline} — scroll to browse`}
          // pan-y keeps a touch swipe scrolling the page: the wheel and drag
          // handlers are mouse-only, so touch never loses the page scroll.
          className="absolute right-[var(--rhythm-2)] top-0 z-[5] h-full w-[min(38vw,13rem)] touch-pan-y overflow-hidden sm:right-[var(--rhythm-3)] lg:w-[min(20vw,15rem)]"
        >
          <div ref={trackRef} className="will-change-transform">
            {Array.from({ length: sets }, (_, set) =>
              resolved.map(({ slide, product, label }) => {
                const isRepeat = set > 0;

                const plate = (
                  <>
                    {isVideoUrl(slide.src) ? (
                      <video
                        src={slide.src}
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={slide.src}
                        alt={product || isRepeat ? '' : label}
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    )}

                    {/* The name only surfaces on approach, so the column stays a
                        column of photographs rather than a list of captions. */}
                    {product && (
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(6,6,7,0.9),transparent)] px-3 pb-2.5 pt-8 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-porcelain opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                        {product.name}
                      </span>
                    )}
                  </>
                );

                // Margin rather than flex gap: the cycle has to be an exact
                // multiple of one plate's full footprint for the seam to vanish.
                const shell =
                  'group relative mb-6 block aspect-[4/5] w-full overflow-hidden rounded-lg bg-obsidian-raised shadow-[0_1.25rem_2.5rem_rgba(0,0,0,0.55)] ring-1 ring-porcelain/10 transition-shadow duration-500';

                return product ? (
                  <Link
                    key={`${set}-${slide.id}`}
                    to={`/fragrance/${product.id}`}
                    aria-label={isRepeat ? undefined : label || product.name}
                    aria-hidden={isRepeat || undefined}
                    tabIndex={isRepeat ? -1 : undefined}
                    className={`${shell} hover:ring-[color:var(--border-gold)]`}
                  >
                    {plate}
                  </Link>
                ) : (
                  <figure key={`${set}-${slide.id}`} className={shell}>
                    {plate}
                  </figure>
                );
              }),
            )}
          </div>
        </div>
      )}
    </section>
  );
};
