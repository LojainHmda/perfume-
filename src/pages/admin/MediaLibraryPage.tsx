import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Copy, Loader2, RefreshCw, Trash2, Upload } from 'lucide-react';
import { UploadedFile, deleteUpload, listUploads } from '../../api/uploads';
import { apiUpload } from '../../api/client';
import { useAdminToast } from '../../components/admin/AdminToastContext';
import { useProductStore } from '../../store/useProductStore';
import { useSettingsStore } from '../../store/useSettingsStore';

const isVideo = (name: string) => /\.(mp4|webm|ogg|mov|m4v)$/i.test(name);

const readableSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * /admin/media — every file that has been uploaded, in one place.
 *
 * A file that is currently referenced by the hero or by a product is labelled
 * as in use, so deleting something the storefront depends on is a deliberate
 * act rather than an accident.
 */
export const MediaLibraryPage: React.FC = () => {
  const { notify, fail } = useAdminToast();
  const products = useProductStore((state) => state.products);
  const settings = useSettingsStore((state) => state.settings);

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const usage = new Map<string, string[]>();
  const claim = (url: string | null | undefined, label: string) => {
    const key = url?.trim();
    if (!key) return;
    usage.set(key, [...(usage.get(key) ?? []), label]);
  };

  claim(settings.heroImage, 'Hero image');
  claim(settings.heroVideo, 'Hero film');
  claim(settings.collectionBackground, 'Collection background');
  (settings.collectionSlides ?? []).forEach((slide, index) => {
    claim(slide.src, `Collection · plate ${index + 1}`);
  });
  for (const product of products) {
    claim(product.image, `${product.name} · bottle`);
    (product.mediaPanels ?? []).forEach((panel, index) => {
      claim(panel.videoUrl, `${product.name} · panel ${index + 1} film`);
      claim(panel.image, `${product.name} · panel ${index + 1} still`);
      claim(panel.posterUrl, `${product.name} · panel ${index + 1} poster`);
    });
  }

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await listUploads();
      setFiles(result.files);
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Could not list uploads.');
    } finally {
      setIsLoading(false);
    }
  }, [fail]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await apiUpload(file);
      notify(`Uploaded ${result.originalName}.`);
      await refresh();
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (file: UploadedFile) => {
    const inUse = usage.get(file.url);
    const warning = inUse
      ? `“${file.name}” is in use by: ${inUse.join(', ')}.\n\nDelete it anyway? Those surfaces will fall back to their defaults.`
      : `Delete “${file.name}”?`;
    if (!window.confirm(warning)) return;

    try {
      await deleteUpload(file.name);
      notify(`Deleted ${file.name}.`);
      await refresh();
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Delete failed.');
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      notify('URL copied.');
    } catch {
      fail('Could not reach the clipboard.');
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-light uppercase tracking-wider text-white">
            Media library
          </h2>
          <p className="pt-1 text-xs text-zinc-400">
            Everything uploaded through the panel, stored on the server at /uploads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => void refresh()}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>

          <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-500">
            <Upload className="h-4 w-4" />
            <span>{isUploading ? 'Uploading…' : 'Upload'}</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              disabled={isUploading}
              onChange={(event) => void handleUpload(event.target.files?.[0])}
            />
          </label>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center p-16 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : files.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 p-10 text-center text-xs text-zinc-500">
          Nothing uploaded yet. Files added here can be pasted into any media field.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {files.map((file) => {
            const inUse = usage.get(file.url);

            return (
              <div
                key={file.url}
                className="space-y-3 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-4"
              >
                <div className="aspect-video overflow-hidden rounded-lg border border-zinc-800 bg-black">
                  {isVideo(file.name) ? (
                    <video src={file.url} className="h-full w-full object-cover" muted loop autoPlay playsInline />
                  ) : (
                    <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                  )}
                </div>

                <div className="space-y-1">
                  <p className="truncate font-mono text-[11px] text-white" title={file.name}>
                    {file.name}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    {readableSize(file.size)} · {new Date(file.modifiedAt).toLocaleDateString()}
                  </p>
                </div>

                <p
                  className={`rounded-lg border px-2 py-1 text-[10px] leading-relaxed ${
                    inUse
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
                  }`}
                >
                  {inUse ? `In use — ${inUse.join(', ')}` : 'Not referenced by any surface'}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => void copyUrl(file.url)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[11px] text-zinc-300 transition-colors hover:text-white"
                  >
                    <Copy className="h-3.5 w-3.5 text-amber-400" />
                    Copy URL
                  </button>

                  <button
                    onClick={() => void handleDelete(file)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[11px] text-zinc-400 transition-colors hover:border-red-900 hover:bg-red-950/60 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
