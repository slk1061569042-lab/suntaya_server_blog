# Nginx 反向代理无缓存配置说明

## 何时需要

当 **部署后直连 `curl http://127.0.0.1:3000` 已是新 Build，但浏览器访问域名仍显示旧版** 时，多半是 Nginx 对该站点做了代理缓存（`proxy_cache`），请求没有到达 Node，直接返回了缓存里的旧响应。

## 如何确认

在服务器（如 115.190.54.220）上执行：

```bash
grep -R "proxy_cache\|fastcgi_cache" /www/server/panel/vhost/nginx/ 2>/dev/null
cat /www/server/panel/vhost/nginx/next.sunyas.com.conf 2>/dev/null
```

若该站点的 `location` 中存在 `proxy_cache`、`proxy_cache_valid` 等，则需对 HTML/页面关闭缓存。

## 参考配置

见同目录下的 **`nginx-next-no-cache.conf.example`**，其中包含：

- 主 `location ^~ /` 已设 `proxy_cache off;`
- **静态资源** 的嵌套 location（`.*\.(css|js|jpg|...)`）也改为 **`proxy_cache off;`**，去掉了 `proxy_cache next_sunyas_com_cache`、`proxy_cache_valid`、`proxy_ignore_headers` 等，避免部署后仍看到旧版样式/脚本/图片。

## 应用步骤（在服务器上执行）

1. 编辑站点 Nginx 配置：
   - 宝塔：网站 → next.sunyas.com → 设置 → 配置文件  
   - 或 SSH：`vim /www/server/panel/vhost/nginx/next.sunyas.com.conf`
2. 找到 **#PROXY-CONF-START** 到 **#PROXY-CONF-END** 之间的整段（即 `location ^~ / { ... }` 含内部嵌套的 `location ~ .*\.(css|js|...)`）。
3. 将整段替换为 **`nginx-next-no-cache.conf.example`** 中「整块替换示例」里的内容（从 `location ^~ / {` 到对应的 `}`）。
4. 保存后测试并重载：
   ```bash
   nginx -t && nginx -s reload
   ```

## 常见错误：Connection refused（111）

当 Nginx 报错 **`connect() failed (111: Connection refused) while connecting to upstream ... http://127.0.0.1:3000`** 时，表示 **本机 3000 端口没有进程在监听**，即 Next.js（PM2）未运行或已退出。

### 处理步骤（在服务器上执行）

1. **进入部署目录并启动应用**（Jenkins 部署目录为 `/www/wwwroot/next.sunyas.com`）：
   ```bash
   cd /www/wwwroot/next.sunyas.com
   pm2 start server.js --name next-sunyas
   pm2 save
   ```
2. **若 PM2 里已有同名应用但已停掉**，可先删再起：
   ```bash
   cd /www/wwwroot/next.sunyas.com
   pm2 delete next-sunyas 2>/dev/null || true
   pm2 start server.js --name next-sunyas
   pm2 save
   ```
3. **确认 3000 已监听**：
   ```bash
   pm2 list
   lsof -i:3000
   curl -s http://127.0.0.1:3000 | head -5
   ```
   若 `pm2 list` 里 next-sunyas 为 online 且 `curl` 有正常 HTML，则 Nginx 再访问应恢复正常。

若应用反复退出，可查看 `pm2 logs next-sunyas` 或 `pm2 show next-sunyas` 排查启动错误（如缺少依赖、端口被占、路径错误等）。

---

## 部署目录嵌套（/www/.../next.sunyas.com/www/.../next.sunyas.com）

若服务器上出现 **`/www/wwwroot/next.sunyas.com/www/wwwroot/next.sunyas.com`** 这种重复路径，多半是 Jenkins Publish Over SSH 的「Remote directory」与该流水线里的 `remoteDirectory` 被拼了两次。

- **处理**：Jenkins 里该 SSH 服务器若已配置「Remote directory」为 `/www/wwwroot/next.sunyas.com`，则流水线中应设 `remoteDirectory: '.'`，文件会直接进该目录，不再嵌套。
- **兜底**：流水线部署脚本会检测嵌套并执行展平（`cp -a www/wwwroot/next.sunyas.com/. .`），展平后 PM2 从部署根目录启动即可。

---

## 相关排查

若直连 3000 仍是旧 Build，则问题在进程/部署目录，而非 Nginx 缓存。完整诊断步骤见项目内「发布后前端仍显示旧版」相关计划/文档。
