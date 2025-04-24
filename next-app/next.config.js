/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['randomuser.me', 'chittorgarh.net', 'www.chittorgarh.net'],
  },
  // Disable ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during production builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 