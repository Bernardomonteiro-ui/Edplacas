import type { NextConfig } from "next";
import { deviceSizes, imageSizes } from "./src/lib/image-sizes.mjs";

/**
 * Exportação estática: `npm run build` gera a pasta out/ com o site completo,
 * pronta para GitHub Pages (ou qualquer hospedagem estática).
 * NEXT_PUBLIC_BASE_PATH = subcaminho do site (ex.: "/Edplacas" no GitHub Pages; vazio em domínio próprio).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    deviceSizes,
    imageSizes,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
