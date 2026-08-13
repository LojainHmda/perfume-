import React, { useMemo, useState } from 'react';
import { Fragrance } from '../../types/fragrance';
import { ProductCard } from './ProductCard';

interface ProductCatalogGridProps {
  products: Fragrance[];
  onEdit: (product: Fragrance) => void;
  onDelete: (product: Fragrance) => void;
}

export const ProductCatalogGrid: React.FC<ProductCatalogGridProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((product) =>
      [product.name, product.collection, product.subtitle, product.id]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }, [products, query]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="font-serif text-xl font-light uppercase tracking-wider text-white">
          Product Catalogue ({filtered.length})
        </h2>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, collection or id…"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none sm:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 p-10 text-center text-xs text-zinc-500">
          No products match “{query}”.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};
