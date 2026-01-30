import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 使用 standalone 输出模式，优化部署包大小
  output: 'standalone',
  // 动态页不缓存，避免浏览器强缓存导致部署后仍显示旧版（不覆盖 _next/static）
  async headers() {
    return [
      { source: '/', headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }] },
      { source: '/docs', headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }] },
      { source: '/docs/:path*', headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }] },
      { source: '/git-visualizer', headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }] },
    ];
  },
};

export default nextConfig;
