import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tripx-wp.imgix.net',
      },
    ],
  },
};

export default nextConfig;
