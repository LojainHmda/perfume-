import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Eye, Loader2 } from 'lucide-react';
import { createBlankProduct } from '../../../components/admin/createBlankProduct';
import { useAdminToast } from '../../../components/admin/AdminToastContext';
import { getDefaultMediaPanels, useProductStore } from '../../../store/useProductStore';
import { Fragrance } from '../../../types/fragrance';

export interface ProductEditorContext {
  draft: Fragrance;
  isNew: boolean;
  patch: (fields: Partial<Fragrance>) => void;
  fail: (message: string) => void;
}

/** Sub-pages read the draft through this rather than lifting their own copy. */
export const useProductEditor = (): ProductEditorContext =>
  useOutletContext<ProductEditorContext>();

const SECTIONS = [
  { path: 'details', label: 'Details' },
  { path: 'pricing', label: 'Pricing' },
  { path: 'image', label: 'Bottle image' },
  { path: 'films', label: 'Four films' },
];

/**
 * /admin/products/:id — one product, edited on its own page.
 *
 * The draft lives here and each section is a child route, so switching between
 * details and films is navigation rather than local tab state, and unsaved work
 * survives that move.
 */
export const ProductEditorPage: React.FC<{ mode?: 'new' }> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notify, fail } = useAdminToast();
  const { products, addProduct, updateProduct, isSyncing, isLoading } = useProductStore();

  const isNew = mode === 'new';
  const existing = useMemo(() => products.find((product) => product.id === id), [products, id]);

  const [draft, setDraft] = useState<Fragrance | null>(null);

  // Adopt the product once — later store updates must not clobber the draft.
  useEffect(() => {
    if (draft) return;
    if (isNew) {
      setDraft(createBlankProduct());
      return;
    }
    if (existing) {
      setDraft({ ...existing, mediaPanels: getDefaultMediaPanels(existing) });
    }
  }, [draft, existing, isNew]);

  if (!draft) {
    if (!isNew && !existing && !isLoading) {
      return (
        <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
          <p className="text-sm text-zinc-300">No product with id “{id}”.</p>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-xs uppercase tracking-wider text-amber-300 underline"
          >
            Back to products
          </button>
        </div>
      );
    }

    return (
      <div className="flex justify-center p-16 text-zinc-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const patch = (fields: Partial<Fragrance>) => setDraft({ ...draft, ...fields });

  const handleSave = async () => {
    if (isNew && products.some((product) => product.id === draft.id)) {
      fail(`A product with id “${draft.id}” already exists.`);
      return;
    }

    try {
      if (isNew) {
        await addProduct(draft);
        notify(`“${draft.name}” created.`);
        navigate(`/admin/products/${draft.id}/details`, { replace: true });
      } else {
        await updateProduct(draft.id, draft);
        notify(`“${draft.name}” saved.`);
      }
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Save failed.');
    }
  };

  return (
    <div className="space-y-5">
      <header className="space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <button
              onClick={() => navigate('/admin/products')}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All products
            </button>
            <h2 className="font-serif text-xl font-light uppercase tracking-wider text-white">
              {isNew ? 'New product' : draft.name}
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              {draft.id}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isNew && (
              <button
                onClick={() => navigate(`/fragrance/${draft.id}`)}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[11px] font-medium text-zinc-300 transition-colors hover:text-white"
              >
                <Eye className="h-3.5 w-3.5 text-blue-400" />
                View page
              </button>
            )}

            <button
              onClick={() => void handleSave()}
              disabled={isSyncing}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-500 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              {isSyncing ? 'Saving…' : isNew ? 'Create' : 'Save'}
            </button>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-zinc-900 pt-3 text-xs uppercase tracking-wider">
          {SECTIONS.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 font-medium transition-colors ${
                  isActive ? 'bg-zinc-900 font-bold text-white' : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-5 text-xs">
        <Outlet context={{ draft, isNew, patch, fail } satisfies ProductEditorContext} />
      </div>
    </div>
  );
};
