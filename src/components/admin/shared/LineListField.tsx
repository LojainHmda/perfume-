import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

interface LineListFieldProps {
  label: string;
  lines: string[];
  onChange: (lines: string[]) => void;
  /** Guard rail, not a design limit — the storefront renders whatever it is given. */
  max?: number;
  hint?: string;
  addLabel?: string;
  placeholder?: string;
}

/**
 * An ordered list of plain lines — manifesto phrases, the hero's notation
 * strip.
 *
 * Deliberately not the comma-separated `ListField` used for note pyramids:
 * these lines are sentences and can contain commas, and their order is the
 * content rather than an implementation detail, so each one needs its own row
 * and its own handle.
 *
 * Rows are keyed by position because a line has no id of its own. That is
 * sound here in a way it would not be for media: a text input holds nothing
 * that can be lost to a remount mid-edit.
 */
export const LineListField: React.FC<LineListFieldProps> = ({
  label,
  lines,
  onChange,
  max = 24,
  hint,
  addLabel = 'Add line',
  placeholder = 'Born of strategy',
}) => {
  const replace = (index: number, value: string) =>
    onChange(lines.map((line, i) => (i === index ? value : line)));

  const move = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= lines.length) return;
    const reordered = [...lines];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    onChange(reordered);
  };

  const remove = (index: number) => onChange(lines.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
          {label} · {lines.length}
        </span>
        <button
          type="button"
          onClick={() => onChange([...lines, ''])}
          disabled={lines.length >= max}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-300 transition-colors hover:text-white disabled:opacity-40"
        >
          <Plus className="h-3 w-3" />
          {addLabel}
        </button>
      </div>

      {hint && <p className="text-[10px] leading-relaxed text-zinc-500">{hint}</p>}

      {lines.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-800 px-4 py-6 text-center text-[11px] text-zinc-500">
          Nothing here — the storefront shows the lines it ships with.
        </p>
      ) : (
        <ul className="space-y-2">
          {lines.map((line, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-6 shrink-0 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                {String(index + 1).padStart(2, '0')}
              </span>

              <input
                type="text"
                value={line}
                placeholder={placeholder}
                onChange={(event) => replace(index, event.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-white transition-colors focus:border-red-500 focus:outline-none"
              />

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move line ${index + 1} up`}
                  className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:text-white disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === lines.length - 1}
                  aria-label={`Move line ${index + 1} down`}
                  className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Remove line ${index + 1}`}
                  className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
