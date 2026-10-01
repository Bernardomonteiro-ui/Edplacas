import type { MetadataRoute } from "next";
import { company } from "@/config/company";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: company.name,
    description: company.description,
    start_url: "/",
    display: "browser",
    background_color: "#f6f7f9",
    theme_color: "#071331",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
