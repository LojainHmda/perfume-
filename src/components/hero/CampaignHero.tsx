import React from 'react';
import { Fragrance } from '../../types/fragrance';
import { useCursorStore } from '../../store/useStore';
import type { SiteContent } from '../../hooks/useSiteContent';

interface CampaignHeroProps {
  /**
   * The feature product, which still supplies the copy the admin has not
   * overridden: a headline left blank should read as the product's name rather
   * than as a house string that has to be kept in step with the catalogue.
   */
  feature: Fragrance;
  content: SiteContent;
  onDiscover: () => void;
}

/**
 * Full-bleed campaign banner.
 *
 * The plate is the whole frame — the set floats in the void because the image
 * edges are masked out into the obsidian ground rather than stopping on a hard
 * rectangle. The type sits ON the plate, held in the empty left third; the
 * column is width-capped so it never reaches the bottle or the chess group,
 * which start around 30% across.
 *
 * Deliberately static: no parallax, no scroll transform, no entrance animation.
 * The only motion is the hover rule under the call to action.
 */
export const CampaignHero: React.FC<CampaignHeroProps> = ({ feature, content, onDiscover }) => {
  const { setCursor, resetCursor } = useCursorStore();

  // Anything the admin set wins. Media and copy that stay empty fall back to
  // the registry's shipped value; the three lines below fall further, to the
  // feature product, because their default is catalogue data rather than copy.
  const plate = content.text('heroImage');
  const film = content.text('heroVideo');
  const eyebrow =
    content.text('heroEyebrow') || `${feature.moveNotation ?? 'The opening'} — ${feature.collection}`;
  const headline = content.text('heroHeadline') || feature.name;
  const tagline = content.text('heroTagline') || feature.tagline;
  const footerNotes = content.lines('heroFooterNotes');

  const surfaceClass =
    'absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-[56%_center] lg:object-center';
  const voidMask =
    'radial-gradient(120% 105% at 58% 45%, #000 42%, rgba(0,0,0,0.75) 66%, transparent 92%)';

  return (
    <section
      style={{ ['--accent' as string]: feature.colorTheme, ['--accent-glow' as string]: feature.accentGlow }}
      className="relative h-[100svh] min-h-[38rem] w-full overflow-hidden bg-obsidian"
      aria-label={`${feature.name} — campaign`}
    >
      {/* The plate, dissolved into the void at every edge. A hero film, when the
          admin has set one, plays in the same frame over the still. */}
      <img
        src={plate}
        alt={headline}
        style={{ WebkitMaskImage: voidMask, maskImage: voidMask }}
        className={surfaceClass}
      />

      {film && (
        <video
          key={film}
          src={film}
          poster={plate}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          style={{ WebkitMaskImage: voidMask, maskImage: voidMask }}
          className={surfaceClass}
        />
      )}

      {/* ---- The type: over the plate, held clear of the set ---- */}
      <div className="relative z-20 flex h-full flex-col justify-end px-6 pb-24 sm:px-10 sm:justify-center sm:pb-0 lg:px-16">
        <div className="max-w-[22rem] sm:max-w-[26vw] lg:max-w-[27vw]">
          <p className="notation mb-4 text-[color:var(--accent-type)]">{eyebrow}</p>

          <h1 className="font-sans text-[clamp(1.9rem,3.4vw,3.4rem)] font-bold uppercase leading-[0.9] tracking-tight text-porcelain">
            {headline}
          </h1>

          <p className="mt-4 font-sans text-[clamp(0.72rem,0.95vw,0.95rem)] font-medium uppercase tracking-[0.06em] text-porcelain/90">
            {tagline}
          </p>

          <button
            type="button"
            onClick={onDiscover}
            onMouseEnter={() => setCursor('ENTER', 'button')}
            onMouseLeave={resetCursor}
            className="group mt-8 inline-flex w-fit items-center gap-4"
          >
            <span className="eyebrow text-porcelain">{content.text('heroCta')}</span>
            <span className="h-px w-14 bg-porcelain transition-all duration-500 group-hover:w-24" />
          </button>
        </div>
      </div>

      {/* ---- The handover into the collection ---- */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[color:var(--border-subtle)] bg-obsidian/70 px-6 py-4 backdrop-blur-sm sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 sm:justify-between">
          {footerNotes.map((item) => (
            <span key={item} className="notation text-ash">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
