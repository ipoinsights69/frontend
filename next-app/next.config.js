/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't run ESLint during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't run TypeScript type checking during build
    ignoreBuildErrors: true,
  },
  // swcMinify is not needed in Next.js 13+ (removed)
  reactStrictMode: true,
  images: {
    domains: ['*'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Server components optimization
  experimental: {
    serverComponentsExternalPackages: [],
    serverActions: true,
  },
  webpack: (config) => {
    // Optimize webpack build
    config.optimization.minimize = true;
    return config;
  },
};

module.exports = nextConfig; 