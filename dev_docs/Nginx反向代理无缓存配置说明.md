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

见同目录下的 **`nginx-next-no-cache.conf.example`**，将其中 `location /` 的写法合并到你的站点配置中，重点保证：

- `proxy_cache off;` 或对该 location 不启用 `proxy_cache`。

## 应用步骤

1. 在服务器上编辑对应站点 Nginx 配置（宝塔面板或 `/www/server/panel/vhost/nginx/` 下对应 `.conf`）。
2. 在 `server { ... }` 内、转发到 3000 的 `location /` 中加上 `proxy_cache off;`（或按示例替换整个 `location /`）。
3. 测试并重载：
   ```bash
   nginx -t && nginx -s reload
   ```

## 相关排查

若直连 3000 仍是旧 Build，则问题在进程/部署目录，而非 Nginx 缓存。完整诊断步骤见项目内「发布后前端仍显示旧版」相关计划/文档。
