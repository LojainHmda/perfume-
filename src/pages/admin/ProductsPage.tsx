import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ProductCatalogGrid } from '../../components/admin/ProductCatalogGrid';
import { useAdminToast } from '../../components/admin/AdminToastContext';
import { useProductStore } from '../../store/useProductStore';
import { Fragrance } from '../../types/fragrance';

/** /admin/products — the catalogue list. Editing happens on its own page. */
export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, deleteProduct } = useProductStore();
  const { notify, fail } = useAdminToast();

  const handleDelete = async (product: Fragrance) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id);
      notify(`“${product.name}” deleted.`);
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Delete failed.');
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-light uppercase tracking-wider text-white">
            Products
          </h2>
          <p className="pt-1 text-xs text-zinc-400">
            Open a product to edit its details, pricing, bottle image and four films.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(227,6,19,0.3)] transition-all hover:bg-red-500"
        >
          <Plus className="h-4 w-4" />
          <span>Add product</span>
        </button>
      </header>

      <ProductCatalogGrid
        products={products}
        onEdit={(product) => navigate(`/admin/products/${product.id}`)}
        onDelete={(product) => void handleDelete(product)}
      />
    </div>
  );
};
