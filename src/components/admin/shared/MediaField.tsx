import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, SquarePen, Trash2, Upload } from 'lucide-react';
import { apiUpload } from '../../../api/client';
import { isVideoUrl } from '../../../utils/media';

interface MediaFieldProps {
  label: string;
  /** Current URL, or '' when the slot is empty and the default is in effect. */
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  hint?: string;
  /** What the storefront shows while this stays empty. */
  emptyLabel?: string;
  /**
   * Where clicking the preview goes — the editor for the product this slot
   * shows. Omitted, the preview is a picture and nothing more.
   *
   * The picture an admin recognises is the fastest way back to the record
   * behind it, so wherever a slot knows which product it is displaying, the
   * thumbnail becomes the door to that product's editor rather than a dead end
   * that has to be traced back through the catalogue by name.
   */
  previewHref?: string;
  /** Tooltip and accessible name for that link. */
  previewLabel?: string;
  onError?: (message: string) => void;
}

/**
 * Upload-or-paste control for a single media slot.
 *
 * Files go to the server and only the returned URL is stored, so the catalogue
 * JSON stays small no matter how many 4K reels are attached. Clearing the field
 * is meaningful — it hands the slot back to its built-in default.
 */
export const MediaField: React.FC<MediaFieldProps> = ({
  label,
  value,
  onChange,
  accept = 'image/*,video/*',
  hint,
  emptyLabel = 'Empty — the built-in default is shown.',
  previewHref,
  previewLabel = 'Open this product',
  onError,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isVideo = isVideoUrl(value);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await apiUpload(file);
      onChange(result.url);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">{label}</span>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-zinc-500 transition-colors hover:text-red-400"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[9rem_1fr]">
        {/* Preview. A link when the slot knows the product it is showing. */}
        <PreviewShell href={previewHref} label={previewLabel}>
          {value ? (
            isVideo ? (
              <video src={value} className="h-full w-full object-cover" muted loop autoPlay playsInline />
            ) : (
              <img src={value} alt={label} className="h-full w-full object-cover" />
            )
          ) : (
            <span className="px-2 text-center text-[9px] uppercase leading-tight tracking-wider text-zinc-600">
              Default
            </span>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
            </div>
          )}
        </PreviewShell>

        {/* Controls */}
        <div className="space-y-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-700">
            <Upload className="h-3.5 w-3.5 text-amber-400" />
            <span>{isUploading ? 'Uploading…' : 'Upload file'}</span>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              disabled={isUploading}
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />
          </label>

          <input
            type="text"
            value={value}
            placeholder="…or paste a URL"
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded border border-zinc-800 bg-zinc-950 p-2 font-mono text-[11px] text-white focus:border-red-500 focus:outline-none"
          />

          <p className="text-[10px] leading-relaxed text-zinc-500">{value ? hint : emptyLabel}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * The framed preview box, as a link or as a plain div.
 *
 * Written as one component taking an optional href rather than two branches at
 * the call site so the frame's styling — which every panel's sense of rhythm
 * depends on — is written once.
 */
const PreviewShell: React.FC<{
  href?: string;
  label: string;
  children: React.ReactNode;
}> = ({ href, label, children }) => {
  const shell =
    'relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-black';

  if (!href) return <div className={shell}>{children}</div>;

  return (
    <Link
      to={href}
      title={label}
      aria-label={label}
      className={`group ${shell} cursor-pointer transition-colors hover:border-amber-500/60`}
    >
      {children}
      {/* Only surfaces on approach: at rest the row should read as photographs,
          not as a grid of buttons. */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <SquarePen className="h-4 w-4 text-amber-300" />
      </span>
    </Link>
  );
};
