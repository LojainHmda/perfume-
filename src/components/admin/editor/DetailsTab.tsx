import React from 'react';
import { Fragrance } from '../../../types/fragrance';
import { ListField, TextAreaField, TextField } from '../shared/Field';

interface DetailsTabProps {
  product: Fragrance;
  isNew: boolean;
  onChange: (patch: Partial<Fragrance>) => void;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({ product, isNew, onChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TextField
        label="Product id / slug"
        value={product.id}
        mono
        disabled={!isNew}
        hint={isNew ? 'Used in the product URL.' : 'The id is fixed once a product exists.'}
        onChange={(value) => onChange({ id: value.trim().toLowerCase().replace(/\s+/g, '-') })}
      />
      <TextField
        label="Product name"
        value={product.name}
        onChange={(value) => onChange({ name: value })}
      />
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TextField
        label="Subtitle"
        value={product.subtitle}
        onChange={(value) => onChange({ subtitle: value })}
      />
      <TextField
        label="Collection"
        value={product.collection}
        onChange={(value) => onChange({ collection: value })}
      />
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TextField
        label="Move notation"
        value={product.moveNotation ?? ''}
        placeholder="01 · E4"
        onChange={(value) => onChange({ moveNotation: value })}
      />
      <TextField
        label="Concentration"
        value={product.concentration ?? ''}
        placeholder="Extrait de Parfum"
        onChange={(value) => onChange({ concentration: value })}
      />
    </div>

    <TextField
      label="Tagline"
      value={product.tagline}
      onChange={(value) => onChange({ tagline: value })}
    />

    <TextAreaField
      label="Description"
      value={product.description}
      onChange={(value) => onChange({ description: value })}
    />

    <TextAreaField
      label="Story"
      value={product.story}
      onChange={(value) => onChange({ story: value })}
    />

    <TextAreaField
      label="Inspiration"
      rows={2}
      value={product.inspiration}
      onChange={(value) => onChange({ inspiration: value })}
    />

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <ListField
        label="Top notes"
        values={product.topNotes}
        onChange={(values) => onChange({ topNotes: values })}
      />
      <ListField
        label="Heart notes"
        values={product.heartNotes}
        onChange={(values) => onChange({ heartNotes: values })}
      />
      <ListField
        label="Base notes"
        values={product.baseNotes}
        onChange={(values) => onChange({ baseNotes: values })}
      />
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <TextField
        label="Longevity"
        value={product.longevity}
        onChange={(value) => onChange({ longevity: value })}
      />
      <TextField
        label="Sillage"
        value={product.sillage}
        onChange={(value) => onChange({ sillage: value })}
      />
      <TextField
        label="Mood"
        value={product.mood}
        onChange={(value) => onChange({ mood: value })}
      />
    </div>

    <ListField
      label="Seasonality"
      values={product.seasonality}
      onChange={(values) => onChange({ seasonality: values })}
    />
  </div>
);
