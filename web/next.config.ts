import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
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

const nextConfig = {
  images: {
    unoptimized: true, // 极其重要：禁用 Next.js 默认图片优化，改用浏览器原生渲染
  }
};
module.exports = nextConfig;
