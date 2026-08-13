import React from 'react';
import { Link } from 'react-router-dom';
import { useCursorStore } from '../../store/useStore';
import { FRAGRANCES } from '../../data/fragrances';

const SERVICES = [
  'Laser bottle engraving',
  'Complimentary discovery samples',
  'Velvet & wax seal presentation',
  'Worldwide express logistics',
];

export const Footer: React.FC = () => {
  const { setCursor, resetCursor } = useCursorStore();

  return (
    <footer className="relative w-full overflow-hidden border-t border-[color:var(--border-subtle)] bg-obsidian px-6 pb-10 pt-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[92rem]">
        {/* The wordmark, set at the largest size on the page — the last thing
            you see should be the name. */}
        <Link
          to="/"
          onMouseEnter={() => setCursor('CHECKMATE', 'magnetic')}
          onMouseLeave={resetCursor}
          className="display block text-[clamp(3rem,15vw,13rem)] leading-[0.8] text-porcelain/90 transition-colors hover:text-porcelain"
        >
          CHECKMATE
        </Link>

        <div className="rule mt-12" />

        <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="notation text-ash">The house</p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ash">
              We do not craft perfumes to blend into the shadows. CHECKMATE is a high-end rebellious fragrance
              house dedicated to visceral scent storytelling, sculptural obsidian craftsmanship, and
              uninhibited emotion.
            </p>
          </div>

          <div>
            <p className="notation text-ash">The collection</p>
            <ul className="mt-5 space-y-3">
              {FRAGRANCES.map((fragrance) => (
                <li key={fragrance.id}>
                  <Link
                    to={`/fragrance/${fragrance.id}`}
                    className="text-sm text-porcelain/80 transition-colors hover:text-porcelain"
                  >
                    {fragrance.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/story" className="text-sm text-porcelain/80 transition-colors hover:text-porcelain">
                  Manifesto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="notation text-ash">Atelier</p>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((service) => (
                <li key={service} className="text-sm text-ash">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-3 border-t border-[color:var(--border-subtle)] pt-8 sm:flex-row sm:items-center">
          <span className="notation text-ash/70">© 2026 Checkmate — all rights reserved</span>
          <span className="notation text-ash/70">Haute Parfumerie</span>
        </div>
      </div>
    </footer>
  );
};
