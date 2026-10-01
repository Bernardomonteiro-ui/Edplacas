/**
 * Loader de imagens para exportação estática (GitHub Pages).
 * Converte "/_next/static/media/hero.3f2a1c.jpg" em "<basePath>/img/hero-1280.webp",
 * arquivos gerados por scripts/build-images.mjs.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const name = src.split("/").pop()!.split(".")[0];
  return `${base}/img/${name}-${width}.webp`;
}
