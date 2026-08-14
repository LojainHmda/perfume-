import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Eye, EyeOff, Rows3, SquarePen, RotateCcw, Save } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAdminToast } from '../../components/admin/AdminToastContext';
import { LAYOUT_KEYS, SECTIONS_BY_ID, SECTION_REGISTRY } from '../../data/sections';
import type { SectionDefinition } from '../../types/sections';

/**
 * /admin/layout — what the home page is made of, and in what order.
 *
 * The order is stored as a list of section ids rather than as a number on each
 * section, so moving one entry is one write and can never leave two sections
 * claiming the same position.
 */
export const PageLayoutPage: React.FC = () => {
  const { settings, save, resetKeys, isSyncing } = useSettingsStore();
  const { notify, fail } = useAdminToast();

  // Resolving through the same function the storefront uses means the list an
  // admin reorders is literally the list visitors get, including any section
  // added since the order was last saved.
  const [order, setOrder] = useState<string[]>(() =>
    resolveLayoutIds(settings.sectionOrder ?? null),
  );
  const [hidden, setHidden] = useState<string[]>(() => settings.hiddenSections ?? []);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isDirty) return;
    setOrder(resolveLayoutIds(settings.sectionOrder ?? null));
    setHidden(settings.hiddenSections ?? []);
  }, [settings, isDirty]);

  const move = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= order.length) return;
    const reordered = [...order];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    setOrder(reordered);
    setIsDirty(true);
  };

  const toggle = (id: string) => {
    setHidden((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await save({ sectionOrder: order, hiddenSections: hidden });
      setIsDirty(false);
      notify('Page layout updated. The storefront is in this order now.');
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Could not save the page layout.');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Restore the shipped order and show every section?')) return;
    try {
      await resetKeys(LAYOUT_KEYS);
      setIsDirty(false);
      notify('Page layout restored to the order the site ships with.');
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Could not reset the page layout.');
    }
  };

  const sections = order
    .map((id) => SECTIONS_BY_ID[id])
    .filter((section): section is SectionDefinition => Boolean(section));

  return (
    <section className="space-y-5 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-6 shadow-xl">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/50 text-amber-400">
            <Rows3 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-light uppercase tracking-wider text-white">
              Page Layout
            </h2>
            <p className="text-[11px] text-zinc-400">
              The order the home page runs in, and which sections it shows.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => void handleReset()}
            disabled={isSyncing}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[11px] font-medium text-zinc-400 transition-colors hover:text-white disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restore default
          </button>

          <button
            onClick={() => void handleSave()}
            disabled={isSyncing || !isDirty}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-500 disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5" />
            {isDirty ? 'Save layout' : 'Saved'}
          </button>
        </div>
      </header>

      <ul className="space-y-2">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isHidden = hidden.includes(section.id) && !section.required;

          return (
            <li
              key={section.id}
              className={`flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 transition-opacity ${
                isHidden ? 'opacity-45' : ''
              }`}
            >
              <span className="w-6 shrink-0 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/50 text-amber-400">
                <Icon className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-[10rem] flex-1">
                <p className="font-serif text-sm uppercase tracking-wider text-white">
                  {section.label}
                  {section.required && (
                    <span className="ml-2 rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-zinc-500">
                      Always on
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-zinc-400">{section.description}</p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Link
                  to={`/admin/section/${section.id}`}
                  aria-label={`Edit ${section.label}`}
                  className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:text-amber-300"
                >
                  <SquarePen className="h-3.5 w-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => toggle(section.id)}
                  disabled={section.required}
                  aria-label={`${isHidden ? 'Show' : 'Hide'} ${section.label}`}
                  className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:text-white disabled:opacity-30"
                >
                  {isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${section.label} up`}
                  className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:text-white disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === sections.length - 1}
                  aria-label={`Move ${section.label} down`}
                  className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

/**
 * The saved order, completed with anything the registry knows and it does not.
 *
 * Shares its rule with `resolveLayout` — which filters hidden sections out for
 * the storefront — but keeps them in, because this page is where they are
 * switched back on.
 */
const resolveLayoutIds = (saved: string[] | null): string[] => {
  const known = (saved ?? []).filter((id) => id in SECTIONS_BY_ID);
  const seen = new Set(known);
  return [...known, ...SECTION_REGISTRY.filter((s) => !seen.has(s.id)).map((s) => s.id)];
};
