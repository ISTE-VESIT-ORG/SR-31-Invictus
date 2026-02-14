/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'apod.nasa.gov' },
      { protocol: 'https', hostname: 'mars.nasa.gov' },
      { protocol: 'https', hostname: 'epic.gsfc.nasa.gov' },
      { protocol: 'https', hostname: 'images-assets.nasa.gov' },
      { protocol: 'https', hostname: '*.nasa.gov' },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
