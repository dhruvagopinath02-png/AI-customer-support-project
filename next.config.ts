import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixes the 500 DOMMatrix error by skipping browser bundling for these Node packages
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas", "pdfjs-dist"],
  
  // Fixes the 413 Payload Too Large error globally if you are using Server Actions for the upload
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", 
    },
  },
};

export default nextConfig;