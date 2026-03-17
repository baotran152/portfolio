/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // enables static export
  images: {
    domains: ['images.unsplash.com', 'assets.aceternity.com'],
    unoptimized: true, // required for static hosting (GitHub Pages)
  },
  eslint: {
    ignoreDuringBuilds: true, // skip lint errors during build
  },
};

module.exports = nextConfig;
