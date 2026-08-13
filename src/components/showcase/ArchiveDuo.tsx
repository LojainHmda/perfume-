import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Fragrance } from '../../types/fragrance';
import { SEAL } from '../../data/assets';
import { useCursorStore } from '../../store/useStore';

interface ArchiveDuoProps {
  fragrances: Fragrance[];
}

/**
 * Two half-width tiles, titles set over the lower left rather than centred —
 * the reading rhythm changes after the mosaic, which keeps the page from
 * turning into a repeating grid.
 */
export const ArchiveDuo: React.FC<ArchiveDuoProps> = ({ fragrances }) => {
  const navigate = useNavigate();
  const { setCursor, resetCursor } = useCursorStore();
  const closer = fragrances[fragrances.length - 1];

  const entries = [
    {
      key: 'manifesto',
      eyebrow: 'Archive — I',
      title: 'Why the board was chosen',
      to: '/story',
      art: SEAL,
      artClass: 'h-[48%]',
    },
    {
      key: 'silhouette',
      eyebrow: 'Archive — II',
      title: 'One silhouette, three compositions',
      to: closer ? `/fragrance/${closer.id}` : '/story',
      art: closer?.image,
      artClass: 'h-[58%]',
    },
  ];

  return (
    <section className="w-full bg-obsidian px-6 pb-24 sm:px-10 lg:px-16" aria-label="The archive">
      <div className="mx-auto max-w-[92rem]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(1.9rem,4.2vw,3.2rem)] text-porcelain">The Archive</h2>
          <p className="notation text-ash">Where the house keeps its reasoning</p>
        </div>
        <div className="rule mt-7" />

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
          {entries.map((entry, i) => (
            <motion.article
              key={entry.key}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => navigate(entry.to)}
              onMouseEnter={() => setCursor('READ', 'magnetic')}
              onMouseLeave={resetCursor}
              className="group relative aspect-[16/11] cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(155deg,#141419_0%,#0A0A0D_58%,#060607_100%)]" />
              <div className="absolute inset-0 spotlight opacity-60" />
              {entry.art && (
                <img
                  src={entry.art}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className={`absolute left-1/2 top-[38%] w-auto -translate-x-1/2 -translate-y-1/2 object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05] ${entry.artClass}`}
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(6,6,7,0.92)_70%,rgba(6,6,7,0.97)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <p className="notation text-ash">{entry.eyebrow}</p>
                <h3 className="display mt-2 max-w-[18ch] text-[clamp(1.4rem,2.4vw,2.1rem)] text-porcelain">
                  {entry.title}
                </h3>
                <span className="mt-4 flex items-center gap-3">
                  <span className="eyebrow text-porcelain">Read</span>
                  <span className="h-px w-9 bg-[color:var(--accent-type)] transition-all duration-500 group-hover:w-16" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
