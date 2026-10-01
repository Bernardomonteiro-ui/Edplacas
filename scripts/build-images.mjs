/**
 * Gera as versões responsivas (WebP) de src/assets/images em public/img.
 * Necessário porque o GitHub Pages é hospedagem estática: não existe servidor
 * para otimizar imagens sob demanda. Roda automaticamente antes de `next build`.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { deviceSizes, imageSizes } from "../src/lib/image-sizes.mjs";

const src = path.resolve("src/assets/images");
const out = path.resolve("public/img");
fs.mkdirSync(out, { recursive: true });

const widths = [...imageSizes, ...deviceSizes];
let made = 0;
for (const file of fs.readdirSync(src).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const name = file.replace(/\.[^.]+$/, "");
  const input = path.join(src, file);
  const mtime = fs.statSync(input).mtimeMs;
  for (const w of widths) {
    const target = path.join(out, `${name}-${w}.webp`);
    if (fs.existsSync(target) && fs.statSync(target).mtimeMs > mtime) continue;
    await sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74, effort: 5 }).toFile(target);
    made++;
  }
}
console.log(`imagens: ${made} geradas em public/img`);
