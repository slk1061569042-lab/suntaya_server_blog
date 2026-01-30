/**
 * PM2 配置：服务器上 Next 使用 3001（3000 被 Supabase Studio 占用）
 * 部署后可在服务器执行：cd /www/wwwroot/next.sunyas.com && pm2 start ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: 'next-sunyas',
      script: 'server.js',
      cwd: '/www/wwwroot/next.sunyas.com',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '127.0.0.1',
      },
    },
  ],
};
