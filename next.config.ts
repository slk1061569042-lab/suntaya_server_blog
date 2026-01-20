import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 使用 standalone 输出模式，优化部署包大小
  output: 'standalone',
};

export default nextConfig;
