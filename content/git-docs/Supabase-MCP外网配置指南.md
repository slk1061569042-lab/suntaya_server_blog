# 🌐 Supabase MCP 外网配置指南

**配置时间**: 2026-01-19  
**服务器**: 115.190.54.220

## 📊 当前状态

- ✅ **Kong 网关已配置** - 端口 8000 已对外开放
- ✅ **MCP 路由已添加** - `/mcp` 路径已配置
- ✅ **SUPABASE_PUBLIC_URL 已更新** - 从 `localhost` 改为外网地址

## 🔧 已完成的配置

### 1. 更新 SUPABASE_PUBLIC_URL

**文件**: `/www/dk_project/dk_app/supabase/supabase_X6yr/.env`

```bash
# 旧配置
SUPABASE_PUBLIC_URL=http://localhost:8000

# 新配置
SUPABASE_PUBLIC_URL=http://115.190.54.220:8000
```

### 2. 添加 MCP 路由到 Kong

**文件**: `/www/dk_project/dk_app/supabase/supabase_X6yr/volumes/api/kong.yml`

已添加以下配置：

```yaml
## MCP routes
- name: mcp
  _comment: 'MCP: /mcp -> http://studio:3000/api/mcp'
  url: http://studio:3000/api/mcp
  routes:
    - name: mcp-route
      strip_path: true
      paths:
        - /mcp
  plugins:
    - name: cors
    - name: key-auth
      config:
        hide_credentials: false
    - name: acl
      config:
        hide_groups_header: true
        allow:
          - admin
          - anon
```

### 3. 重启 Kong 服务

```bash
cd /www/dk_project/dk_app/supabase/supabase_X6yr
docker-compose restart supabase_X6yr
```

## 📋 Cursor MCP 配置

### 方法 1: 在 Cursor 中配置（推荐）

1. **打开 Cursor 设置**
   - 按 `Ctrl+,` 打开设置
   - 搜索：`mcp`

2. **添加 MCP 服务器配置**

   在 `.cursor/mcp.json` 文件中添加：

```json
{
  "mcpServers": {
    "supabase": {
      "url": "http://115.190.54.220:8000/mcp",
      "headers": {
        "apikey": "YOUR_ANON_KEY_OR_SERVICE_KEY"
      }
    }
  }
}
```

### 方法 2: 使用 Supabase Studio 配置

1. **访问 Supabase Studio**
   - 打开：`http://115.190.54.220:3000`
   - 登录到你的项目

2. **进入 MCP 配置页面**
   - 导航到：`Project Settings` → `Connect` → `MCP` 标签

3. **复制配置**
   - Studio 会显示更新后的 Server URL：`http://115.190.54.220:8000/mcp`
   - 复制 JSON 配置到 Cursor

## 🔑 获取 API Keys

需要获取 Supabase API Keys 用于认证：

```bash
# 查看 ANON_KEY
ssh root@115.190.54.220 "cd /www/dk_project/dk_app/supabase/supabase_X6yr && grep ANON_KEY .env"

# 查看 SERVICE_ROLE_KEY
ssh root@115.190.54.220 "cd /www/dk_project/dk_app/supabase/supabase_X6yr && grep SERVICE_ROLE_KEY .env"
```

**注意**：
- **ANON_KEY**: 用于客户端访问，权限受限
- **SERVICE_ROLE_KEY**: 用于服务端访问，拥有完整权限（请妥善保管）

## 🔒 安全建议

### 1. 使用 HTTPS（推荐）

当前配置使用 HTTP，建议：

1. **配置 SSL 证书**
2. **更新 SUPABASE_PUBLIC_URL 为 HTTPS**
3. **在 Kong 中启用 HTTPS 端口 8443**

### 2. 限制访问

考虑添加 IP 白名单：

```yaml
plugins:
  - name: ip-restriction
    config:
      allow:
        - YOUR_IP_ADDRESS
      deny: []
```

### 3. 使用 VPN 或 SSH 隧道（最安全）

如果可能，使用 SSH 隧道：

```bash
# 在本地创建 SSH 隧道
ssh -L 8000:localhost:8000 root@115.190.54.220

# 然后在 Cursor 中使用
# "url": "http://localhost:8000/mcp"
```

## ✅ 验证配置

### 1. 测试 MCP 端点

```bash
# 使用 ANON_KEY 测试
curl -H "apikey: YOUR_ANON_KEY" http://115.190.54.220:8000/mcp

# 使用 SERVICE_ROLE_KEY 测试
curl -H "apikey: YOUR_SERVICE_ROLE_KEY" http://115.190.54.220:8000/mcp
```

### 2. 检查 Kong 路由

```bash
ssh root@115.190.54.220 "docker logs supabase-kong --tail 50 | grep mcp"
```

### 3. 检查 Studio MCP 端点

```bash
ssh root@115.190.54.220 "curl -s http://localhost:3000/api/mcp | head -10"
```

## 🚨 常见问题

### Q1: 返回 "Unauthorized"

**原因**: 缺少或错误的 API Key

**解决方法**:
1. 确保在请求头中包含 `apikey`
2. 使用正确的 ANON_KEY 或 SERVICE_ROLE_KEY
3. 检查 Cursor 配置中的 headers 设置

### Q2: 连接超时

**原因**: 防火墙或网络问题

**解决方法**:
1. 检查服务器防火墙是否开放 8000 端口
2. 检查云服务商安全组设置
3. 使用 `telnet 115.190.54.220 8000` 测试连接

### Q3: CORS 错误

**原因**: 跨域请求被阻止

**解决方法**:
- Kong 配置中已包含 `cors` 插件
- 如果仍有问题，检查 CORS 插件配置

## 📚 相关文档

- [Supabase MCP 官方文档](https://supabase.com/docs/guides/getting-started/mcp)
- [Supabase 自托管 MCP 配置](https://supabase.com/docs/guides/self-hosting/enable-mcp)
- [Cursor MCP 配置文档](https://cursor.sh/docs/mcp)

## 🔄 回滚配置

如果配置出现问题，可以回滚：

```bash
# 恢复 Kong 配置
ssh root@115.190.54.220 "cd /www/dk_project/dk_app/supabase/supabase_X6yr && cp volumes/api/kong.yml.backup.* volumes/api/kong.yml"

# 恢复环境变量
ssh root@115.190.54.220 "cd /www/dk_project/dk_app/supabase/supabase_X6yr && cp .env.backup.* .env"

# 重启服务
ssh root@115.190.54.220 "cd /www/dk_project/dk_app/supabase/supabase_X6yr && docker-compose restart supabase_X6yr"
```

---

**配置完成时间**: 2026-01-19
