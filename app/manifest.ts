import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TikoPix · Photographe & vidéaste",
    short_name: "TikoPix",
    description: "Visual stories, captured with intention. Photographie et vidéo à Montréal.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0d",
    theme_color: "#0a0a0d",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
