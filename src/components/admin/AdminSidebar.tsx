import React from 'react';
import { NavLink } from 'react-router-dom';
import { FolderOpen, LayoutDashboard, type LucideIcon, Package, Rows3 } from 'lucide-react';
import { SECTION_REGISTRY } from '../../data/sections';

/**
 * The admin's table of contents. One entry per surface an admin controls —
 * each is its own route, so a link can be bookmarked and the browser's back
 * button behaves.
 *
 * The page sections are not listed by hand: they come from the section
 * registry, which is also what builds their routes and their panels. A section
 * described there appears here, in the order the home page runs.
 */
interface NavEntry {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const TOP: NavEntry[] = [{ to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true }];

const SECTION_LINKS: NavEntry[] = SECTION_REGISTRY.map((section) => ({
  to: `/admin/section/${section.id}`,
  label: section.label,
  icon: section.icon,
}));

const CATALOGUE: NavEntry[] = [
  { to: '/admin/layout', label: 'Page layout', icon: Rows3 },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/media', label: 'Media library', icon: FolderOpen },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
    isActive
      ? 'bg-red-950/50 text-white ring-1 ring-red-500/40'
      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
  }`;

const Entries: React.FC<{ entries: NavEntry[] }> = ({ entries }) => (
  <>
    {entries.map(({ to, label, icon: Icon, end }) => (
      <NavLink key={to} to={to} end={end} className={linkClass}>
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </NavLink>
    ))}
  </>
);

/**
 * The group heading only earns its place in the stacked column. Across the top
 * on narrow screens the nav is a single scrolling row, where a heading would
 * break the rhythm rather than organise it.
 */
const GroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="hidden px-3.5 pb-1 pt-3 font-mono text-[9px] uppercase tracking-widest text-zinc-600 lg:block">
    {children}
  </span>
);

export const AdminSidebar: React.FC = () => (
  <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-950 p-2 lg:sticky lg:top-24 lg:h-fit lg:w-56 lg:flex-col lg:overflow-visible">
    <Entries entries={TOP} />

    <GroupLabel>Home page</GroupLabel>
    <Entries entries={SECTION_LINKS} />

    <GroupLabel>Catalogue</GroupLabel>
    <Entries entries={CATALOGUE} />
  </nav>
);
