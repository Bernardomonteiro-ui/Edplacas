/**
 * Prepara as fotografias-fonte em src/assets/images.
 * Uso: node scripts/optimize-images.mjs <pasta-com-originais>
 *
 * - aplica grading escuro consistente com a direção visual;
 * - desfoca placas estrangeiras legíveis nas fotos de banco de imagem;
 * - limita a largura em 2400px (o next/image gera AVIF/WebP responsivos a partir daqui).
 *
 * Substitua as fotos de banco pelas fotos reais da empresa assim que existirem.
 */
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const src = process.argv[2];
if (!src) {
  console.error("Informe a pasta com os originais.");
  process.exit(1);
}
const out = path.resolve("src/assets/images");
fs.mkdirSync(out, { recursive: true });

/** Regiões de placa (coordenadas no original 2600px) a desfocar. */
const plates = {
  "p-padrao.jpg": [{ left: 650, top: 962, width: 180, height: 120 }],
  "p-outros.jpg": [{ left: 694, top: 910, width: 120, height: 82 }],
};

const grade = {
  default: { brightness: 0.82, saturation: 0.72 },
  "hero.jpg": { brightness: 0.62, saturation: 0.45 },
  "inspect.jpg": { brightness: 0.8, saturation: 0.6 },
};

for (const file of fs.readdirSync(src).filter((f) => f.endsWith(".jpg"))) {
  const input = path.join(src, file);
  let base = sharp(input);
  const composites = [];
  for (const r of plates[file] ?? []) {
    const patch = await sharp(input).extract(r).blur(14).toBuffer();
    composites.push({ input: patch, left: r.left, top: r.top });
  }
  if (composites.length) base = sharp(await base.composite(composites).toBuffer());
  const g = grade[file] ?? grade.default;
  await base
    .modulate({ brightness: g.brightness, saturation: g.saturation })
    .linear(1.08, -8)
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toFile(path.join(out, file));
  console.log("ok", file);
}
