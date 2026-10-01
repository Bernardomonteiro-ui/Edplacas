import type { MetadataRoute } from "next";
import { company } from "@/config/company";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: company.name,
    description: company.description,
    start_url: `${base}/`,
    display: "browser",
    background_color: "#f6f7f9",
    theme_color: "#071331",
    icons: [
      { src: `${base}/icon.svg`, sizes: "any", type: "image/svg+xml" },
      { src: `${base}/apple-icon.png`, sizes: "180x180", type: "image/png" },
    ],
  };
}
