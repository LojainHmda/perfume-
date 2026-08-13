import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { Fragrance, MediaPanelConfig } from '../../../types/fragrance';
import { getDefaultMediaPanels, panelHasCustomMedia } from '../../../store/useProductStore';
import { TextField } from '../shared/Field';
import { MediaField } from '../shared/MediaField';

interface MediaTabProps {
  product: Fragrance;
  onChange: (patch: Partial<Fragrance>) => void;
  fail: (message: string) => void;
}

/**
 * The four product films.
 *
 * Each slot maps 1:1 to a panel of the product page's grid. Upload a film and
 * that panel plays it; leave it empty and the generated atmosphere the site
 * ships with keeps playing there. The two states are labelled on every card so
 * it is never a guess which one a visitor will see.
 */
export const MediaTab: React.FC<MediaTabProps> = ({ product, onChange, fail }) => {
  const panels = getDefaultMediaPanels(product);

  const writePanel = (index: number, patch: Partial<MediaPanelConfig>) => {
    const next = panels.map((panel, panelIndex) =>
      panelIndex === index ? { ...panel, ...patch } : panel
    );
    onChange({ mediaPanels: next });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 text-xs text-amber-200">
        <span className="flex items-center gap-1.5 font-mono font-bold uppercase">
          <Play className="h-4 w-4 fill-amber-400 text-amber-400" />
          Four films, one per panel of the product grid
        </span>
        <p className="pt-1 text-[11px] text-amber-200/80">
          Anything you leave empty keeps the default reel that is on the product page today. Videos
          are stored on the server, not in this page — large files are fine.
        </p>
      </div>

      {product.gridPanels.map((gridPanel, index) => {
        const panel = panels[index];
        const isCustom = panelHasCustomMedia(panel);

        return (
          <div
            key={gridPanel.id || `panel-${index}`}
            className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
              <span className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-amber-300">
                <Play className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                Panel {index + 1} · {gridPanel.category}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                  isCustom
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-zinc-700 bg-zinc-800/60 text-zinc-400'
                }`}
              >
                {isCustom ? (
                  'Custom media live'
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    Default reel · {gridPanel.videoType.replace(/_/g, ' ')}
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <MediaField
                label="Film"
                value={panel.videoUrl ?? ''}
                accept="video/*"
                onChange={(url) => writePanel(index, { videoUrl: url })}
                hint="Plays muted on loop in this panel."
                emptyLabel="Empty — the generated reel plays here."
                onError={fail}
              />

              <MediaField
                label="Still (used when there is no film)"
                value={panel.image ?? ''}
                accept="image/*"
                onChange={(url) => writePanel(index, { image: url })}
                hint="Shown when no film is set for this panel."
                emptyLabel="Empty — falls through to the generated reel."
                onError={fail}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField
                label="Panel title"
                value={panel.title ?? ''}
                placeholder={gridPanel.title}
                onChange={(value) => writePanel(index, { title: value })}
              />
              <TextField
                label="Poster frame URL (optional)"
                value={panel.posterUrl ?? ''}
                mono
                placeholder="Shown while the film loads"
                onChange={(value) => writePanel(index, { posterUrl: value })}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
