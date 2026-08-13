import React from 'react';

/**
 * The three input primitives the panel is built from. They exist so no editor
 * tab has to re-type the same dark-field styling, and so a change to the look
 * happens in one place.
 */

interface FieldShellProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export const FieldShell: React.FC<FieldShellProps> = ({ label, hint, children, className = '' }) => (
  <div className={className}>
    <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-zinc-400">
      {label}
    </label>
    {children}
    {hint && <p className="pt-1 text-[10px] leading-relaxed text-zinc-500">{hint}</p>}
  </div>
);

const inputClass =
  'w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-white transition-colors focus:border-red-500 focus:outline-none disabled:opacity-60';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  mono?: boolean;
  className?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  hint,
  placeholder,
  disabled,
  mono,
  className,
}) => (
  <FieldShell label={label} hint={hint} className={className}>
    <input
      type="text"
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`${inputClass} ${mono ? 'font-mono text-xs' : ''}`}
    />
  </FieldShell>
);

interface TextAreaFieldProps extends Omit<TextFieldProps, 'mono'> {
  rows?: number;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  hint,
  placeholder,
  rows = 3,
  className,
}) => (
  <FieldShell label={label} hint={hint} className={className}>
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`${inputClass} leading-relaxed`}
    />
  </FieldShell>
);

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  min?: number;
  className?: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
  prefix = '$',
  min = 0,
  className,
}) => (
  <FieldShell label={label} className={className}>
    <div className="relative">
      <span className="absolute left-3.5 top-2.5 font-bold text-zinc-500">{prefix}</span>
      <input
        type="number"
        min={min}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2.5 pl-8 pr-3 font-mono text-base font-bold text-white focus:border-emerald-400 focus:outline-none"
      />
    </div>
  </FieldShell>
);

/** Comma-separated list bound to a string array — used for the note pyramids. */
interface ListFieldProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export const ListField: React.FC<ListFieldProps> = ({ label, values, onChange, className }) => (
  <FieldShell label={label} hint="Comma separated" className={className}>
    <input
      type="text"
      value={values.join(', ')}
      onChange={(event) =>
        onChange(
          event.target.value
            .split(',')
            .map((entry) => entry.trim())
            .filter(Boolean)
        )
      }
      className={inputClass}
    />
  </FieldShell>
);
