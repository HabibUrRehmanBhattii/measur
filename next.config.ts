import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Bypasses TypeScript errors during build
  },
};

export default nextConfig;
