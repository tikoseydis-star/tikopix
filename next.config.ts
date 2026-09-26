import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Demo seed imagery only. Replaced as soon as the Studio has real content.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    qualities: [60, 75, 85],
  },
};

export default nextConfig;
