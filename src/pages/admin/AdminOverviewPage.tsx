import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, EyeOff, Film, Package, Rows3 } from 'lucide-react';
import { getDefaultMediaPanels, panelHasCustomMedia, useProductStore } from '../../store/useProductStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { SECTION_REGISTRY } from '../../data/sections';
import { useSectionLayout } from '../../hooks/useSiteContent';
import type { SiteSettings } from '../../types/settings';

/** Where the panel opens: what is overridden right now, and the way in to each surface. */
export const AdminOverviewPage: React.FC = () => {
  const { products, isServerBacked } = useProductStore();
  const settings = useSettingsStore((state) => state.settings);
  const layout = useSectionLayout();

  const slots = products.flatMap((product) => getDefaultMediaPanels(product));
  const customSlots = slots.filter(panelHasCustomMedia).length;

  const live = new Set(layout.map((section) => section.id));

  // One card per described section, counting its own overrides. Nothing is
  // listed by hand, so a section added to the registry shows up here with its
  // state already summarised.
  const sectionCards = SECTION_REGISTRY.map((section) => {
    const overrides = section.fields.filter((field) => isOverridden(settings, field.key));

    return {
      to: `/admin/section/${section.id}`,
      icon: section.icon,
      title: section.label,
      value: overrides.length
        ? `${overrides.length} override${overrides.length > 1 ? 's' : ''}`
        : 'Shipped default',
      detail: overrides.length
        ? overrides.map((field) => field.label.toLowerCase()).join(' · ')
        : section.description,
      muted: !live.has(section.id),
    };
  });

  const catalogueCards = [
    {
      to: '/admin/layout',
      icon: Rows3,
      title: 'Page layout',
      value: `${layout.length} of ${SECTION_REGISTRY.length} showing`,
      detail:
        layout.length === SECTION_REGISTRY.length
          ? 'Every section is live, in the order listed here.'
          : `${SECTION_REGISTRY.length - layout.length} section(s) switched off.`,
      muted: false,
    },
    {
      to: '/admin/products',
      icon: Package,
      title: 'Products',
      value: `${products.length} in the catalogue`,
      detail: isServerBacked
        ? 'Served from the server — every visitor sees these.'
        : 'Showing the bundled catalogue; the server has not answered yet.',
      muted: false,
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
      muted: false,
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-serif text-xl font-light uppercase tracking-wider text-white">Overview</h2>
        <p className="pt-1 text-xs text-zinc-400">
          Each surface has its own page. Nothing here is edited in place.
        </p>
      </header>

      <Grid title="Home page" cards={sectionCards} />
      <Grid title="Catalogue" cards={catalogueCards} />
    </div>
  );
};

interface Card {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  detail: string;
  /** Described but switched off — shown, dimmed, so it can be found again. */
  muted: boolean;
}

const Grid: React.FC<{ title: string; cards: Card[] }> = ({ title, cards }) => (
  <section className="space-y-3">
    <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{title}</h3>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ to, icon: Icon, title: cardTitle, value, detail, muted }) => (
        <Link
          key={to}
          to={to}
          className={`group space-y-3 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-5 transition-colors hover:border-zinc-700 ${
            muted ? 'opacity-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-300">
              <Icon className="h-4 w-4" />
              {cardTitle}
            </span>
            {muted ? (
              <EyeOff className="h-4 w-4 text-zinc-600" />
            ) : (
              <ArrowRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
            )}
          </div>

          <p className="font-serif text-2xl font-light text-white">{value}</p>
          <p className="text-[11px] leading-relaxed text-zinc-400">
            {muted ? 'Hidden on the storefront. ' : ''}
            {detail}
          </p>
        </Link>
      ))}
    </div>
  </section>
);

/** A key counts as overridden when it holds anything other than "untouched". */
const isOverridden = (settings: SiteSettings, key: keyof SiteSettings): boolean => {
  const value = settings[key];
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return true;
  return String(value).trim() !== '';
};
