import React from 'react';
import { DollarSign } from 'lucide-react';
import { Fragrance } from '../../../types/fragrance';
import { NumberField } from '../shared/Field';

interface PricingTabProps {
  product: Fragrance;
  onChange: (patch: Partial<Fragrance>) => void;
}

export const PricingTab: React.FC<PricingTabProps> = ({ product, onChange }) => (
  <div className="space-y-6">
    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center gap-2 font-mono font-bold uppercase tracking-wider text-amber-300">
        <DollarSign className="h-4 w-4" />
        <span>Retail pricing</span>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2">
        <NumberField
          label="50 ml price (USD)"
          value={product.price50ml}
          onChange={(value) => onChange({ price50ml: value })}
        />
        <NumberField
          label="100 ml price (USD)"
          value={product.price100ml}
          onChange={(value) => onChange({ price100ml: value })}
        />
      </div>
    </div>

    <div className="space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-zinc-400">
      <span className="block font-mono text-[10px] uppercase text-amber-300">Options</span>

      <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-300">
        <input
          type="checkbox"
          checked={product.engravingAvailable}
          onChange={(event) => onChange({ engravingAvailable: event.target.checked })}
          className="h-4 w-4 accent-red-500"
        />
        Inscription available on the product page
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-300">
        <input
          type="checkbox"
          checked={product.sampleAvailable}
          onChange={(event) => onChange({ sampleAvailable: event.target.checked })}
          className="h-4 w-4 accent-red-500"
        />
        Sample vial offered
      </label>

      <p className="pt-2 text-xs text-white">
        Displayed as{' '}
        <span className="font-bold text-emerald-400">${product.price50ml}</span> (50 ml) and{' '}
        <span className="font-bold text-emerald-400">${product.price100ml}</span> (100 ml).
      </p>
    </div>
  </div>
);
