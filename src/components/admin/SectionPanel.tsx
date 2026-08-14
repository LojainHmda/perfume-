import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { SectionDefinition, SectionField } from '../../types/sections';
import type { MediaSlide, SiteSettings } from '../../types/settings';
import { MAX_SLIDES, SETTING_KINDS } from '../../types/settings';
import { MediaField } from './shared/MediaField';
import { MediaListField } from './shared/MediaListField';
import { LineListField } from './shared/LineListField';
import { TextField } from './shared/Field';

interface SectionPanelProps {
  section: SectionDefinition;
  notify: (message: string) => void;
  fail: (message: string) => void;
}

/** A form holds concrete values; `null` is only ever a wire representation. */
type FormValue = string | string[] | MediaSlide[];
type Form = Record<string, FormValue>;

/**
 * Open a section's form on what the storefront is showing right now.
 *
 * Text and media start empty when there is no override, because empty is how
 * "keep the default" is expressed and the shipped copy is already offered as
 * the placeholder. Lists start on the shipped set instead: a track with no rows
 * gives an admin nothing to edit, and the point of opening the panel is usually
 * to change one plate rather than to build a column from nothing.
 */
const toForm = (section: SectionDefinition, settings: SiteSettings): Form =>
  Object.fromEntries(
    section.fields.map((field) => {
      const kind = SETTING_KINDS[field.key];
      const saved = settings[field.key];

      if (kind === 'slides' || kind === 'cards') {
        const track = (saved ?? field.fallback ?? []) as MediaSlide[];
        return [field.key, track.map((slide) => ({ ...slide }))];
      }

      if (kind === 'lines' || kind === 'ids') {
        return [field.key, [...((saved ?? field.fallback ?? []) as string[])]];
      }

      return [field.key, (saved as string | null) ?? ''];
    }),
  );

/**
 * The editor for any described section.
 *
 * There is one of these rather than one per section: a section is a list of
 * typed fields, and each kind already has a control. What used to be a
 * hand-written panel per surface — with its own copy of the header, the save
 * button and the dirty tracking — is now the registry entry and nothing else.
 */
export const SectionPanel: React.FC<SectionPanelProps> = ({ section, notify, fail }) => {
  const { settings, save, resetKeys, isSyncing } = useSettingsStore();
  const products = useProductStore((state) => state.products);
  const [form, setForm] = useState<Form>(() => toForm(section, settings));
  const [isDirty, setIsDirty] = useState(false);

  // Adopt server state whenever it changes underneath an untouched form, and
  // rebuild from scratch when the route moves to a different section.
  useEffect(() => {
    setForm(toForm(section, settings));
    setIsDirty(false);
  }, [section]);

  useEffect(() => {
    if (!isDirty) setForm(toForm(section, settings));
  }, [settings, isDirty, section]);

  const update = (key: keyof SiteSettings, value: FormValue) => {
    setForm((current) => ({ ...current, [key]: value }));
    setIsDirty(true);
  };

  const linkOptions = useMemo(
    () => products.map((product) => ({ value: product.id, label: product.name })),
    [products],
  );

  const handleSave = async () => {
    // Half-filled rows are a work in progress, not content — drop them here so
    // the preview an admin sees is what the storefront gets. The server drops
    // them too; doing it in both places is what keeps the form and the
    // storefront agreeing after a save without a reload.
    const patch: Partial<SiteSettings> = {};

    for (const field of section.fields) {
      const kind = SETTING_KINDS[field.key];
      const value = form[field.key];

      if (kind === 'slides' || kind === 'cards') {
        const rows = (value as MediaSlide[])
          .filter((slide) => slide.src.trim() !== '' || (kind === 'cards' && slide.title?.trim()))
          .map((slide) => ({
            ...slide,
            src: slide.src.trim(),
            alt: slide.alt?.trim() ? slide.alt.trim() : null,
            productId: slide.productId?.trim() ? slide.productId.trim() : null,
          }));
        Object.assign(patch, { [field.key]: rows });
        continue;
      }

      if (kind === 'lines' || kind === 'ids') {
        const lines = (value as string[]).map((line) => line.trim()).filter(Boolean);
        Object.assign(patch, { [field.key]: lines });
        continue;
      }

      Object.assign(patch, { [field.key]: value });
    }

    try {
      await save(patch);
      setIsDirty(false);
      notify(`${section.label} updated. The storefront is showing it now.`);
    } catch (error) {
      fail(error instanceof Error ? error.message : `Could not save ${section.label}.`);
    }
  };

  const handleReset = async () => {
    if (!window.confirm(`Restore everything ${section.label} ships with?`)) return;
    try {
      await resetKeys(section.fields.map((field) => field.key));
      setIsDirty(false);
      notify(`${section.label} restored to what the site ships with.`);
    } catch (error) {
      fail(error instanceof Error ? error.message : `Could not reset ${section.label}.`);
    }
  };

  // Controls are grouped by kind rather than left in declaration order: media
  // wants a two-up grid, copy wants a denser one, and a track wants the full
  // width with a rule above it. Grouping here keeps every section's panel
  // reading the same way without the registry having to describe layout.
  const media = section.fields.filter((field) => SETTING_KINDS[field.key] === 'media');
  const copy = section.fields.filter((field) => SETTING_KINDS[field.key] === 'text');
  const lists = section.fields.filter((field) =>
    ['slides', 'cards', 'lines', 'ids'].includes(SETTING_KINDS[field.key]),
  );

  const Icon = section.icon;

  return (
    <section className="space-y-5 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-6 shadow-xl">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/50 text-amber-400">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-light uppercase tracking-wider text-white">
              {section.label}
            </h2>
            <p className="text-[11px] text-zinc-400">{section.description}</p>
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
            {isDirty ? 'Save section' : 'Saved'}
          </button>
        </div>
      </header>

      {(media.length > 0 || copy.length > 0) && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {media.map((field) => (
            <MediaField
              key={field.key}
              label={field.label}
              value={form[field.key] as string}
              onChange={(url) => update(field.key, url)}
              accept={field.accept}
              hint={field.hint}
              emptyLabel={field.emptyLabel}
              onError={fail}
            />
          ))}

          {copy.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {copy.map((field) => (
                <TextField
                  key={field.key}
                  label={field.label}
                  value={form[field.key] as string}
                  onChange={(value) => update(field.key, value)}
                  placeholder={typeof field.fallback === 'string' ? field.fallback : undefined}
                  hint={field.hint ?? field.emptyLabel}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {lists.map((field) => (
        <div key={field.key} className="border-t border-zinc-900 pt-5">
          <ListControl
            field={field}
            value={form[field.key]}
            onChange={(value) => update(field.key, value)}
            linkOptions={linkOptions}
            onError={fail}
          />
        </div>
      ))}
    </section>
  );
};

/** Picks the control a list-shaped field needs, so the panel body stays flat. */
const ListControl: React.FC<{
  field: SectionField;
  value: FormValue;
  onChange: (value: FormValue) => void;
  linkOptions: { value: string; label: string }[];
  onError: (message: string) => void;
}> = ({ field, value, onChange, linkOptions, onError }) => {
  const kind = SETTING_KINDS[field.key];

  if (kind === 'lines' || kind === 'ids') {
    return (
      <LineListField
        label={field.label}
        lines={value as string[]}
        onChange={onChange}
        max={MAX_SLIDES}
        hint={field.hint}
        addLabel={field.addLabel}
      />
    );
  }

  const isCards = kind === 'cards';

  return (
    <MediaListField
      label={field.label}
      slides={value as MediaSlide[]}
      onChange={onChange}
      max={MAX_SLIDES}
      accept={field.accept}
      hint={field.hint}
      addLabel={field.addLabel}
      linkOptions={linkOptions}
      linkLabel={field.linkLabel}
      withCopy={isCards}
      itemNoun={isCards ? 'entry' : 'image'}
      onError={onError}
    />
  );
};
