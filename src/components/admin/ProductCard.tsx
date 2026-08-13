import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Eye, Film, Trash2 } from 'lucide-react';
import { Fragrance } from '../../types/fragrance';
import { getDefaultMediaPanels, panelHasCustomMedia } from '../../store/useProductStore';

interface ProductCardProps {
  product: Fragrance;
  onEdit: (product: Fragrance) => void;
  onDelete: (product: Fragrance) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const panels = getDefaultMediaPanels(product);
  const customCount = panels.filter(panelHasCustomMedia).length;

  return (
    <div className="group relative flex flex-col justify-between space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-5 shadow-lg transition-all hover:border-zinc-700">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-amber-300">
              {product.collection}
            </span>
            <h3 className="font-serif text-lg font-normal uppercase leading-snug text-white">
              {product.name}
            </h3>
            <p className="text-xs text-zinc-400">{product.subtitle}</p>
          </div>

          <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
            {product.id}
          </span>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-zinc-800/60 bg-zinc-900/60 p-3">
          <img
            src={product.image}
            alt={product.name}
            className="h-16 w-16 rounded-lg border border-zinc-800 bg-black/40 object-contain p-1"
          />
          <div className="space-y-1 font-mono text-xs">
            <div className="text-zinc-400">
              <span className="text-zinc-500">50ML:</span>{' '}
              <span className="font-bold text-white">${product.price50ml}</span>
            </div>
            <div className="text-zinc-400">
              <span className="text-zinc-500">100ML:</span>{' '}
              <span className="font-bold text-white">${product.price100ml}</span>
            </div>
            <div className="flex items-center gap-1 pt-0.5 text-[10px] text-amber-300">
              <Film className="h-3 w-3" />
              <span>
                {customCount} of {panels.length} films uploaded
                {customCount < panels.length ? ' · rest use defaults' : ''}
              </span>
            </div>
          </div>
        </div>

        <p className="line-clamp-2 text-xs italic text-zinc-400">“{product.tagline}”</p>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-zinc-900 pt-3">
        <button
          onClick={() => onEdit(product)}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
        >
          <Edit className="h-3.5 w-3.5 text-amber-400" />
          <span>Edit</span>
        </button>

        <button
          onClick={() => navigate(`/fragrance/${product.id}`)}
          className="flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
        >
          <Eye className="h-3.5 w-3.5 text-blue-400" />
          <span>View</span>
        </button>

        <button
          onClick={() => onDelete(product)}
          className="flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-red-900 hover:bg-red-950/60 hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
