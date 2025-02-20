import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, //  bypassing ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true, // Bypasses TypeScript errors during build
  },
};

export default nextConfig;