import React, { useState, useEffect } from 'react';

// Global cache for transparent bottle data URLs so re-renders/clicks are instantaneous (0ms) and never flash
const globalImageCache = new Map<string, string>();
const globalProcessingPromises = new Map<string, Promise<string>>();

export const processTransparentImage = (src: string, threshold = 210): Promise<string> => {
  if (!src) return Promise.resolve('');
  if (globalImageCache.has(src)) {
    return Promise.resolve(globalImageCache.get(src)!);
  }
  if (globalProcessingPromises.has(src)) {
    return globalProcessingPromises.get(src)!;
  }

  const promise = new Promise<string>((resolve) => {
    const img = new Image();
    if (src.startsWith('http://') || src.startsWith('https://')) {
      img.crossOrigin = 'Anonymous';
    }
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const w = img.width;
        const h = img.height;
        if (w === 0 || h === 0) {
          globalImageCache.set(src, src);
          resolve(src);
          return;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          globalImageCache.set(src, src);
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Sample border/corner pixels to accurately detect background color
        const samples: [number, number, number][] = [];
        const samplePoints = [
          [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
          [Math.floor(w / 2), 0], [Math.floor(w / 2), h - 1],
          [0, Math.floor(h / 2)], [w - 1, Math.floor(h / 2)],
          [5, 5], [w - 6, 5], [5, h - 6], [w - 6, h - 6]
        ];

        samplePoints.forEach(([cx, cy]) => {
          const idx = (cy * w + cx) * 4;
          if (data[idx + 3] > 20) {
            samples.push([data[idx], data[idx + 1], data[idx + 2]]);
          }
        });

        let avgR = 245, avgG = 245, avgB = 245;
        if (samples.length > 0) {
          let sumR = 0, sumG = 0, sumB = 0;
          samples.forEach(([r, g, b]) => {
            sumR += r;
            sumG += g;
            sumB += b;
          });
          avgR = Math.round(sumR / samples.length);
          avgG = Math.round(sumG / samples.length);
          avgB = Math.round(sumB / samples.length);
        }

        const isLightBg = (avgR + avgG + avgB) / 3 > 110;

        const isBgPixel = (idx: number) => {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          if (a < 15) return true;

          if (isLightBg) {
            if (r >= threshold && g >= threshold && b >= threshold) return true;
            const dist = Math.hypot(r - avgR, g - avgG, b - avgB);
            if (dist < 70) return true;
            if (r > 180 && g > 180 && b > 180 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
              const bgDist = Math.hypot(r - avgR, g - avgG, b - avgB);
              if (bgDist < 100) return true;
            }
            return false;
          } else {
            const dist = Math.hypot(r - avgR, g - avgG, b - avgB);
            if (dist < 75) return true;
            if (r <= 60 && g <= 60 && b <= 60) return true;
            return false;
          }
        };

        const visited = new Uint8Array(w * h);
        const queue: number[] = [];

        for (let x = 0; x < w; x++) {
          const topIdx = (0 * w + x) * 4;
          const botIdx = ((h - 1) * w + x) * 4;
          if (isBgPixel(topIdx)) {
            visited[x] = 1;
            queue.push(x, 0);
          }
          if (isBgPixel(botIdx)) {
            visited[(h - 1) * w + x] = 1;
            queue.push(x, h - 1);
          }
        }

        for (let y = 0; y < h; y++) {
          const leftIdx = (y * w + 0) * 4;
          const rightIdx = (y * w + (w - 1)) * 4;
          if (!visited[y * w] && isBgPixel(leftIdx)) {
            visited[y * w] = 1;
            queue.push(0, y);
          }
          if (!visited[y * w + (w - 1)] && isBgPixel(rightIdx)) {
            visited[y * w + (w - 1)] = 1;
            queue.push(w - 1, y);
          }
        }

        let head = 0;
        const dx = [1, -1, 0, 0];
        const dy = [0, 0, 1, -1];

        while (head < queue.length) {
          const cx = queue[head++];
          const cy = queue[head++];
          const currPix = cy * w + cx;
          const dataIdx = currPix * 4;

          data[dataIdx + 3] = 0;

          for (let i = 0; i < 4; i++) {
            const nx = cx + dx[i];
            const ny = cy + dy[i];

            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const nextPix = ny * w + nx;
              if (!visited[nextPix]) {
                visited[nextPix] = 1;
                const nextDataIdx = nextPix * 4;
                if (isBgPixel(nextDataIdx)) {
                  queue.push(nx, ny);
                }
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        let minX = w, minY = h, maxX = 0, maxY = 0;
        let hasBottlePixels = false;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const alpha = data[(y * w + x) * 4 + 3];
            if (alpha > 15) {
              hasBottlePixels = true;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (hasBottlePixels && minX < maxX && minY < maxY) {
          const pad = 4;
          const finalMinX = Math.max(0, minX - pad);
          const finalMinY = Math.max(0, minY - pad);
          const finalMaxX = Math.min(w - 1, maxX + pad);
          const finalMaxY = Math.min(h - 1, maxY + pad);
          const finalW = finalMaxX - finalMinX + 1;
          const finalH = finalMaxY - finalMinY + 1;

          const cropCanvas = document.createElement('canvas');
          cropCanvas.width = finalW;
          cropCanvas.height = finalH;
          const cropCtx = cropCanvas.getContext('2d');

          if (cropCtx) {
            cropCtx.drawImage(
              canvas,
              finalMinX, finalMinY, finalW, finalH,
              0, 0, finalW, finalH
            );
            const croppedDataUrl = cropCanvas.toDataURL('image/png');
            if (croppedDataUrl && croppedDataUrl.length > 100) {
              globalImageCache.set(src, croppedDataUrl);
              resolve(croppedDataUrl);
              return;
            }
          }
        }

        const transparentDataUrl = canvas.toDataURL('image/png');
        if (transparentDataUrl && transparentDataUrl.length > 100) {
          globalImageCache.set(src, transparentDataUrl);
          resolve(transparentDataUrl);
        } else {
          globalImageCache.set(src, src);
          resolve(src);
        }
      } catch {
        globalImageCache.set(src, src);
        resolve(src);
      }
    };

    img.onerror = () => {
      globalImageCache.set(src, src);
      resolve(src);
    };
  });

  globalProcessingPromises.set(src, promise);
  return promise;
};

interface TransparentBottleImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  threshold?: number;
}

export const TransparentBottleImage: React.FC<TransparentBottleImageProps> = ({
  src,
  alt,
  className = '',
  threshold = 210,
  ...props
}) => {
  const cached = globalImageCache.get(src);
  const [processedSrc, setProcessedSrc] = useState<string>(cached || '');
  const [isLoaded, setIsLoaded] = useState<boolean>(!!cached);

  useEffect(() => {
    let isMounted = true;

    if (!src) return;

    if (globalImageCache.has(src)) {
      const result = globalImageCache.get(src)!;
      setProcessedSrc(result);
      setIsLoaded(true);
      return;
    }

    processTransparentImage(src, threshold).then((result) => {
      if (isMounted) {
        setProcessedSrc(result);
        setIsLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [src, threshold]);

  if (!processedSrc && !isLoaded) {
    return <div className={`w-full h-full ${className}`} />;
  }

  return (
    <img
      src={processedSrc || src}
      alt={alt}
      onError={() => {
        if (processedSrc !== src) {
          setProcessedSrc(src);
        }
      }}
      className={`${className} transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      {...props}
    />
  );
};

