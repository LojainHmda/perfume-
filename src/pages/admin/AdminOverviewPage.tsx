import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Film, Image as ImageIcon, Layers, Package } from 'lucide-react';
import { getDefaultMediaPanels, panelHasCustomMedia, useProductStore } from '../../store/useProductStore';
import { useSettingsStore } from '../../store/useSettingsStore';

/** Where the panel opens: what is overridden right now, and the way in to each surface. */
export const AdminOverviewPage: React.FC = () => {
  const { products, isServerBacked } = useProductStore();
  const settings = useSettingsStore((state) => state.settings);

  const slots = products.flatMap((product) => getDefaultMediaPanels(product));
  const customSlots = slots.filter(panelHasCustomMedia).length;

  const heroOverrides = [
    settings.heroImage && 'image',
    settings.heroVideo && 'film',
    settings.heroEyebrow && 'eyebrow',
    settings.heroHeadline && 'headline',
    settings.heroTagline && 'tagline',
  ].filter(Boolean) as string[];

  const customSlides = settings.collectionSlides;
  const collectionOverrides = [
    settings.collectionBackground && 'background',
    settings.collectionEyebrow && 'eyebrow',
    settings.collectionHeadline && 'headline',
    customSlides && `${customSlides.length} plate${customSlides.length === 1 ? '' : 's'}`,
  ].filter(Boolean) as string[];

  const cards = [
    {
      to: '/admin/hero',
      icon: ImageIcon,
      title: 'Hero',
      value: heroOverrides.length ? `${heroOverrides.length} override${heroOverrides.length > 1 ? 's' : ''}` : 'Default plate',
      detail: heroOverrides.length ? heroOverrides.join(' · ') : 'The shipped campaign image and copy are live.',
    },
    {
      to: '/admin/collection',
      icon: Layers,
      title: 'Collection',
      value: collectionOverrides.length
        ? `${collectionOverrides.length} override${collectionOverrides.length > 1 ? 's' : ''}`
        : 'Default frame',
      detail: collectionOverrides.length
        ? collectionOverrides.join(' · ')
        : 'The shipped background and three plates are live.',
    },
    {
      to: '/admin/products',
      icon: Package,
      title: 'Products',
      value: `${products.length} in the catalogue`,
      detail: isServerBacked
        ? 'Served from the server — every visitor sees these.'
        : 'Showing the bundled catalogue; the server has not answered yet.',
    },
    {
      to: '/admin/media',
      icon: Film,
      title: 'Product films',
      value: `${customSlots} of ${slots.length} slots uploaded`,
      detail:
        customSlots === slots.length
          ? 'Every panel plays uploaded media.'
          : `${slots.length - customSlots} panel${slots.length - customSlots === 1 ? '' : 's'} still play the default reels.`,
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-serif text-xl font-light uppercase tracking-wider text-white">Overview</h2>
        <p className="pt-1 text-xs text-zinc-400">
          Each surface has its own page. Nothing here is edited in place.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ to, icon: Icon, title, value, detail }) => (
          <Link
            key={to}
            to={to}
            className="group space-y-3 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-5 transition-colors hover:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                <Icon className="h-4 w-4" />
                {title}
              </span>
              <ArrowRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </div>

            <p className="font-serif text-2xl font-light text-white">{value}</p>
            <p className="text-[11px] leading-relaxed text-zinc-400">{detail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
