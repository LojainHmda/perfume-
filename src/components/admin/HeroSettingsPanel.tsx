import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, RotateCcw, Save } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { SiteSettings } from '../../types/settings';
import { MediaField } from './shared/MediaField';
import { TextField } from './shared/Field';

interface HeroSettingsPanelProps {
  notify: (message: string) => void;
  fail: (message: string) => void;
}

/** Empty string in the form means "no override" — that is what clears a field. */
const toForm = (settings: SiteSettings) => ({
  heroImage: settings.heroImage ?? '',
  heroVideo: settings.heroVideo ?? '',
  heroEyebrow: settings.heroEyebrow ?? '',
  heroHeadline: settings.heroHeadline ?? '',
  heroTagline: settings.heroTagline ?? '',
});

/**
 * The home page hero.
 *
 * Anything left blank keeps the campaign plate and copy the site ships with, so
 * the admin can replace only the still, only the words, or the whole frame.
 */
export const HeroSettingsPanel: React.FC<HeroSettingsPanelProps> = ({ notify, fail }) => {
  const { settings, save, reset, isSyncing } = useSettingsStore();
  const [form, setForm] = useState(toForm(settings));
  const [isDirty, setIsDirty] = useState(false);

  // Adopt server state whenever it changes underneath an untouched form.
  useEffect(() => {
    if (!isDirty) setForm(toForm(settings));
  }, [settings, isDirty]);

  const update = (patch: Partial<ReturnType<typeof toForm>>) => {
    setForm((current) => ({ ...current, ...patch }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await save(form);
      setIsDirty(false);
      notify('Hero updated. The storefront is showing it now.');
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Could not save the hero.');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Restore the built-in hero image and copy?')) return;
    try {
      await reset();
      setIsDirty(false);
      notify('Hero restored to the shipped campaign plate.');
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Could not reset the hero.');
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-6 shadow-xl">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/50 text-amber-400">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-light uppercase tracking-wider text-white">
              Home Page Hero
            </h2>
            <p className="text-[11px] text-zinc-400">
              Leave a field empty to keep what the site ships with.
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
            {isDirty ? 'Save hero' : 'Saved'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <MediaField
          label="Hero image"
          value={form.heroImage}
          onChange={(url) => update({ heroImage: url })}
          accept="image/*"
          hint="Shown full-bleed behind the hero type."
          emptyLabel="Empty — the built-in campaign plate is shown."
          onError={fail}
        />

        <MediaField
          label="Hero film (optional)"
          value={form.heroVideo}
          onChange={(url) => update({ heroVideo: url })}
          accept="video/*"
          hint="Plays muted on loop over the still."
          emptyLabel="Empty — no film, the still stands alone."
          onError={fail}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-zinc-900 pt-4 sm:grid-cols-3">
        <TextField
          label="Eyebrow"
          value={form.heroEyebrow}
          onChange={(value) => update({ heroEyebrow: value })}
          placeholder="01 · E4 — The Grandmaster Series"
          hint="Blank uses the feature product's notation."
        />
        <TextField
          label="Headline"
          value={form.heroHeadline}
          onChange={(value) => update({ heroHeadline: value })}
          placeholder="Dance With The Devil"
          hint="Blank uses the feature product's name."
        />
        <TextField
          label="Tagline"
          value={form.heroTagline}
          onChange={(value) => update({ heroTagline: value })}
          placeholder="A provocative game of dark cherry…"
          hint="Blank uses the feature product's tagline."
        />
      </div>
    </section>
  );
};
