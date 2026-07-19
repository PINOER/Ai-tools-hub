import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // 确保完美适配 Cloudflare 运行时
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
