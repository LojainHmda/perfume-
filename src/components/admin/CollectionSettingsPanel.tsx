import React, { useEffect, useState } from 'react';
import { Layers, RotateCcw, Save } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { MediaSlide, MAX_SLIDES, SiteSettings } from '../../types/settings';
import {
  DEFAULT_COLLECTION_EYEBROW,
  DEFAULT_COLLECTION_HEADLINE,
  DEFAULT_COLLECTION_SLIDES,
} from '../../data/collection';
import { MediaField } from './shared/MediaField';
import { MediaListField } from './shared/MediaListField';
import { TextField } from './shared/Field';

interface CollectionSettingsPanelProps {
  notify: (message: string) => void;
  fail: (message: string) => void;
}

/** The settings this panel owns. Restoring defaults clears exactly these. */
const KEYS: (keyof SiteSettings)[] = [
  'collectionBackground',
  'collectionEyebrow',
  'collectionHeadline',
  'collectionSlides',
];

const toForm = (settings: SiteSettings) => ({
  collectionBackground: settings.collectionBackground ?? '',
  collectionEyebrow: settings.collectionEyebrow ?? '',
  collectionHeadline: settings.collectionHeadline ?? '',
  // Null means "never overridden", so the panel opens on the shipped plates and
  // an edit to one of them saves the whole track as a custom set.
  collectionSlides: (settings.collectionSlides ?? DEFAULT_COLLECTION_SLIDES).map((slide) => ({
    ...slide,
  })),
});

/**
 * The home page collection frame: the ground behind it, the words over it, and
 * the column of plates that scrolls down its right edge.
 *
 * The track is a list, not three fixed slots — adding a fourth image is an
 * "Add image" click, and the storefront measures its own travel from whatever
 * it is handed.
 */
export const CollectionSettingsPanel: React.FC<CollectionSettingsPanelProps> = ({
  notify,
  fail,
}) => {
  const { settings, save, resetKeys, isSyncing } = useSettingsStore();
  const products = useProductStore((state) => state.products);
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
    // Half-filled rows are a work in progress, not content — drop them here so
    // the preview an admin sees is what the storefront gets.
    const slides: MediaSlide[] = form.collectionSlides
      .filter((slide) => slide.src.trim() !== '')
      .map((slide) => ({
        id: slide.id,
        src: slide.src.trim(),
        alt: slide.alt?.trim() ? slide.alt.trim() : null,
        productId: slide.productId?.trim() ? slide.productId.trim() : null,
      }));

    try {
      await save({ ...form, collectionSlides: slides });
      setForm((current) => ({ ...current, collectionSlides: slides }));
      setIsDirty(false);
      notify('Collection section updated. The storefront is showing it now.');
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Could not save the collection section.');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Restore the built-in collection background, copy and plates?')) return;
    try {
      await resetKeys(KEYS);
      setIsDirty(false);
      notify('Collection section restored to the shipped plates.');
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Could not reset the collection section.');
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-6 shadow-xl">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/50 text-amber-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-light uppercase tracking-wider text-white">
              Collection Section
            </h2>
            <p className="text-[11px] text-zinc-400">
              The full-bleed frame and its scrolling column of plates.
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
            {isDirty ? 'Save section' : 'Saved'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <MediaField
          label="Section background"
          value={form.collectionBackground}
          onChange={(url) => update({ collectionBackground: url })}
          accept="image/*,video/*"
          hint="Held full-bleed behind the type. A film plays muted on loop."
          emptyLabel="Empty — the built-in crimson plate is shown."
          onError={fail}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <TextField
            label="Eyebrow"
            value={form.collectionEyebrow}
            onChange={(value) => update({ collectionEyebrow: value })}
            placeholder={DEFAULT_COLLECTION_EYEBROW}
            hint="Small line above the title."
          />
          <TextField
            label="Headline"
            value={form.collectionHeadline}
            onChange={(value) => update({ collectionHeadline: value })}
            placeholder={DEFAULT_COLLECTION_HEADLINE}
            hint="Set large along the foot of the frame."
          />
        </div>
      </div>

      <div className="border-t border-zinc-900 pt-5">
        <MediaListField
          label="Scrolling column"
          slides={form.collectionSlides}
          onChange={(slides) => update({ collectionSlides: slides })}
          max={MAX_SLIDES}
          accept="image/*,video/*"
          hint="Top to bottom, in the order the column scrolls. Reorder with the arrows. Each slot links to a product, set independently of its image."
          linkLabel="Links to product"
          linkOptions={products.map((product) => ({ value: product.id, label: product.name }))}
          onError={fail}
        />
      </div>
    </section>
  );
};
