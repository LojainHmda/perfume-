/** Media slots accept a film or a still, and only the URL tells them apart. */
export const isVideoUrl = (url: string | null | undefined): boolean =>
  /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url ?? '');
