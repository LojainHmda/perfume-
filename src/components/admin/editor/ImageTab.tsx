import React from 'react';
import { Fragrance } from '../../../types/fragrance';
import { TextField } from '../shared/Field';
import { MediaField } from '../shared/MediaField';

interface ImageTabProps {
  product: Fragrance;
  onChange: (patch: Partial<Fragrance>) => void;
  fail: (message: string) => void;
}

export const ImageTab: React.FC<ImageTabProps> = ({ product, onChange, fail }) => (
  <div className="space-y-6">
    <MediaField
      label="Bottle photograph"
      value={product.image}
      accept="image/*"
      onChange={(url) => onChange({ image: url })}
      hint="Used on the storefront tiles, the product page and the bag."
      emptyLabel="No image set — the product will render an empty frame."
      onError={fail}
    />

    <div className="grid grid-cols-1 gap-4 border-t border-zinc-900 pt-4 sm:grid-cols-2">
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-zinc-400">
          Presentation
        </label>
        <select
          value={product.presentation ?? 'float'}
          onChange={(event) =>
            onChange({ presentation: event.target.value as Fragrance['presentation'] })
          }
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-white focus:border-red-500 focus:outline-none"
        >
          <option value="float">Float — cut-out bottle on the board</option>
          <option value="plate">Plate — full-bleed photograph</option>
        </select>
        <p className="pt-1 text-[10px] text-zinc-500">
          Float expects a transparent PNG; plate uses the photograph whole.
        </p>
      </div>

      <TextField
        label="Accent colour (hex)"
        value={product.colorTheme}
        mono
        placeholder="#D4AF37"
        hint="Drives the accent type and glow on this product's pages."
        onChange={(value) => onChange({ colorTheme: value })}
      />
    </div>

    <TextField
      label="Accent glow (rgba)"
      value={product.accentGlow}
      mono
      placeholder="rgba(212, 175, 55, 0.4)"
      onChange={(value) => onChange({ accentGlow: value })}
    />
  </div>
);
