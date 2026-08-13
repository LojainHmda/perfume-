import React from 'react';
import { CinematicCanvas } from './CinematicCanvas';
import { GridPanelData, MediaPanelConfig } from '../../types/fragrance';

interface MediaSurfaceProps {
  /** Admin override for this slot. Undefined or empty means "use the default reel". */
  panel?: MediaPanelConfig;
  /** The shipped panel, which carries the generated atmosphere to fall back to. */
  fallback: Pick<GridPanelData, 'videoType'>;
  className?: string;
  /** Films autoplay muted in the grid; the lightbox can ask for sound. */
  muted?: boolean;
  controls?: boolean;
}

/**
 * One media tile, resolved in priority order:
 *
 *   1. an uploaded film   (`videoUrl`)
 *   2. an uploaded still  (`image`)
 *   3. the generated atmosphere the site ships with
 *
 * That last step is the whole point: a fragrance with no admin media looks
 * exactly as it does today, and each of the four slots falls back on its own.
 */
export const MediaSurface: React.FC<MediaSurfaceProps> = ({
  panel,
  fallback,
  className = '',
  muted = true,
  controls = false,
}) => {
  const videoUrl = panel?.videoUrl?.trim();
  const imageUrl = panel?.image?.trim();

  if (videoUrl) {
    return (
      <video
        key={videoUrl}
        src={videoUrl}
        poster={panel?.posterUrl?.trim() || undefined}
        className={`h-full w-full object-cover ${className}`}
        autoPlay
        loop
        muted={muted}
        playsInline
        controls={controls}
        preload="metadata"
      />
    );
  }

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={panel?.title ?? ''}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  return <CinematicCanvas type={fallback.videoType} className={className} />;
};
