import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Tree-shake icon imports so each page only ships the icons it renders.
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
