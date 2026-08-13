import React from 'react';

const PHRASE = ['Born of strategy', 'Worn as intent', 'Every scent is a move'];

/**
 * The page's heartbeat: a slow band of didone caps drifting between the opening
 * and the collection. It carries the house line without asking for a click.
 */
export const ManifestoBand: React.FC = () => {
  // Rendered twice so the -50% translation loops seamlessly.
  const run = [...PHRASE, ...PHRASE, ...PHRASE];

  return (
    <section
      className="relative w-full overflow-hidden border-y border-[color:var(--border-subtle)] bg-obsidian-raised py-10 sm:py-14"
      aria-label="House manifesto"
    >
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap sm:gap-16">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-10 sm:gap-16" aria-hidden={copy === 1}>
            {run.map((phrase, i) => (
              <React.Fragment key={`${copy}-${i}`}>
                <span className="display text-[clamp(1.8rem,4.4vw,3.6rem)] text-porcelain/80">{phrase}</span>
                <span className="text-[color:var(--accent-type)] text-xl sm:text-2xl" aria-hidden>
                  ✦
                </span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      {/* Feathered edges so the band dissolves into the page rather than cutting. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-obsidian-raised to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-obsidian-raised to-transparent sm:w-40" />
    </section>
  );
};
