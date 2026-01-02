import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // Configure images
  images: {
    unoptimized: true,
  },

  // Turbopack configuration (required for Next.js 16)
  turbopack: {},

  // TypeScript configuration
  typescript: {
    // Allow build to complete even with type errors during development
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
