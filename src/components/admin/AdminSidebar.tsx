import React from 'react';
import { NavLink } from 'react-router-dom';
import { FolderOpen, Image as ImageIcon, Layers, LayoutDashboard, Package } from 'lucide-react';

/**
 * The admin's table of contents. One entry per surface an admin controls —
 * each is its own route, so a link can be bookmarked and the browser's back
 * button behaves.
 */
const LINKS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/hero', label: 'Hero', icon: ImageIcon, end: false },
  { to: '/admin/collection', label: 'Collection', icon: Layers, end: false },
  { to: '/admin/products', label: 'Products', icon: Package, end: false },
  { to: '/admin/media', label: 'Media library', icon: FolderOpen, end: false },
];

export const AdminSidebar: React.FC = () => (
  <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-950 p-2 lg:sticky lg:top-24 lg:h-fit lg:w-56 lg:flex-col lg:overflow-visible">
    {LINKS.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
            isActive
              ? 'bg-red-950/50 text-white ring-1 ring-red-500/40'
              : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
          }`
        }
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);
