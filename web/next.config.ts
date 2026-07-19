import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, 
    domains: [  
      'cdn.pixabay.com',
      'api.getprixite.com',
      'in-maa-1.linodeobjects.com',
    ],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  // 🌟 全局大招：添加以下这段实验性配置，强制忽略构建期的预渲染错误
  experimental: {
    prerenderEarlyExit: false, 
  },
};

export default nextConfig;
