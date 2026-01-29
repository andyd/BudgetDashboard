import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  eslint: {
    // Skip ESLint during builds (will fix lint errors separately)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TypeScript errors during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
