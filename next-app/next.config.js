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
  swcMinify: true,
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
  webpack: (config) => {
    // Optimize webpack build
    config.optimization.minimize = true;
    return config;
  },
};

module.exports = nextConfig; 