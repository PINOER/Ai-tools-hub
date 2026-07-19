import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // 🌟 精准加在这里：确保能在 Cloudflare 上完美跑通，不报优化错误
    domains: [  
      'cdn.pixabay.com',
      'api.getprixite.com',
      'in-maa-1.linodeobjects.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
