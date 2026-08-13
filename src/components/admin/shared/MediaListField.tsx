import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { MediaSlide, createSlide } from '../../../types/settings';
import { MediaField } from './MediaField';
import { SelectField, TextField } from './Field';

interface MediaListFieldProps {
  label: string;
  slides: MediaSlide[];
  onChange: (slides: MediaSlide[]) => void;
  /** Guard rail, not a design limit — the storefront renders whatever it is given. */
  max?: number;
  accept?: string;
  hint?: string;
  addLabel?: string;
  /**
   * Catalogue entries each slot may point at. Omit the prop entirely and the
   * list is plain media with no link column.
   */
  linkOptions?: { value: string; label: string }[];
  linkLabel?: string;
  onError?: (message: string) => void;
}

/**
 * An ordered list of media slots.
 *
 * Each row is the same upload-or-paste control used everywhere else in the
 * panel, plus the two things a list needs and a single field does not: a
 * position, and a way to change it. Rows are keyed by slide id so a reorder
 * moves the row rather than remounting it mid-upload.
 */
export const MediaListField: React.FC<MediaListFieldProps> = ({
  label,
  slides,
  onChange,
  max = 24,
  accept = 'image/*',
  hint,
  addLabel = 'Add image',
  linkOptions,
  linkLabel = 'Links to',
  onError,
}) => {
  const replace = (index: number, patch: Partial<MediaSlide>) =>
    onChange(slides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)));

  const move = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= slides.length) return;
    const reordered = [...slides];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    onChange(reordered);
  };

  const remove = (index: number) => onChange(slides.filter((_, i) => i !== index));

  const isFull = slides.length >= max;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
          {label} · {slides.length}
        </span>
        <button
          type="button"
          onClick={() => onChange([...slides, createSlide()])}
          disabled={isFull}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-300 transition-colors hover:text-white disabled:opacity-40"
        >
          <Plus className="h-3 w-3" />
          {addLabel}
        </button>
      </div>

      {hint && <p className="text-[10px] leading-relaxed text-zinc-500">{hint}</p>}

      {slides.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-800 px-4 py-6 text-center text-[11px] text-zinc-500">
          No images — the storefront shows the plates it ships with.
        </p>
      ) : (
        <ul className="space-y-3">
          {slides.map((slide, index) => (
            <li
              key={slide.id}
              className="space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move image ${index + 1} up`}
                    className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === slides.length - 1}
                    aria-label={`Move image ${index + 1} down`}
                    className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <MediaField
                label={`Image ${index + 1}`}
                value={slide.src}
                onChange={(url) => replace(index, { src: url })}
                accept={accept}
                hint="Shown in the scrolling column, in this order."
                emptyLabel="Empty — this slot is skipped when you save."
                onError={onError}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {linkOptions && (
                  <SelectField
                    label={linkLabel}
                    value={slide.productId ?? ''}
                    onChange={(value) => replace(index, { productId: value || null })}
                    options={linkOptions}
                    placeholder="— Not linked —"
                    hint="Where clicking this image takes the visitor."
                  />
                )}

                <TextField
                  label="Alt text"
                  value={slide.alt ?? ''}
                  onChange={(value) => replace(index, { alt: value })}
                  placeholder="Dance With The Devil"
                  hint="Blank uses the linked product's name."
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
