import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'violet-chimpanzee-234778.hostingersite.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}

export default nextConfig;
