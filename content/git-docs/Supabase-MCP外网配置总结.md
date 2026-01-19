# ✅ Supabase MCP 外网配置总结

**配置完成时间**: 2026-01-19  
**服务器**: 115.190.54.220

## 🎯 配置目标

将 Supabase MCP 端点从本地配置（`http://localhost:8000/mcp`）改为外网可访问配置（`http://115.190.54.220:8000/mcp`），以便在 Cursor 中通过外网连接。

## ✅ 已完成的配置

### 1. 更新环境变量

**文件**: `/www/dk_project/dk_app/supabase/supabase_X6yr/.env`

```bash
# 更新前
SUPABASE_PUBLIC_URL=http://localhost:8000

# 更新后
SUPABASE_PUBLIC_URL=http://115.190.54.220:8000
```

### 2. 添加 MCP 路由到 Kong

**文件**: `/www/dk_project/dk_app/supabase/supabase_X6yr/volumes/api/kong.yml`

在 dashboard 路由之前添加了 MCP 路由配置：

```yaml
## MCP routes (must be before dashboard route)
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

**重要**: MCP 路由必须放在 dashboard 路由之前，因为 dashboard 路由匹配所有路径 `/`。

### 3. 重启服务

```bash
cd /www/dk_project/dk_app/supabase/supabase_X6yr
docker-compose restart supabase_X6yr
```

## 📋 Cursor MCP 配置

### 配置文件位置

在项目根目录创建 `.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "supabase": {
      "url": "http://115.190.54.220:8000/mcp",
      "headers": {
        "apikey": "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogImFub24iLCAiaXNzIjogInN1cGFiYXNlLWRlbW8iLCAiaWF0IjogMTc2NzE3ODkxNiwgImV4cCI6IDk5OTk5OTk5OTl9.c-3hQgs-DOlhcnEx5EE5EhAj0GYsAP78lEMlgexmj1Q"
      }
    }
  }
}
```

### 使用配置脚本

运行脚本自动生成配置：

```powershell
.\scripts\get_supabase_mcp_config.ps1
```

## 🔑 API Keys

### ANON_KEY（客户端访问）
```
eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogImFub24iLCAiaXNzIjogInN1cGFiYXNlLWRlbW8iLCAiaWF0IjogMTc2NzE3ODkxNiwgImV4cCI6IDk5OTk5OTk5OTl9.c-3hQgs-DOlhcnEx5EE5EhAj0GYsAP78lEMlgexmj1Q
```

### SERVICE_ROLE_KEY（服务端访问，完整权限）
```
eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogInNlcnZpY2Vfcm9sZSIsICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsICJpYXQiOiAxNzY3MTc4OTE2LCAiZXhwIjogOTk5OTk5OTk5OX0.zPvza83J0K5H5w-O-hvxSVsxGnHUpBjJuGIAXCaegNQ
```

## ✅ 验证配置

### 1. 检查 Kong 状态

```bash
ssh root@115.190.54.220 "docker ps | grep kong"
# 应该显示: Up ... (healthy)
```

### 2. 测试 MCP 端点

```bash
# 使用 ANON_KEY 测试
curl -H "apikey: YOUR_ANON_KEY" http://115.190.54.220:8000/mcp

# 返回 "Unauthorized" 是正常的，因为 MCP 使用 JSON-RPC 协议
# 需要通过 POST 请求发送 JSON-RPC 消息
```

### 3. 在 Supabase Studio 中验证

1. 访问：`http://115.190.54.220:3000`
2. 进入：`Project Settings` → `Connect` → `MCP` 标签
3. 检查 Server URL 是否显示：`http://115.190.54.220:8000/mcp`

## 🔒 安全注意事项

1. **当前使用 HTTP** - 建议配置 HTTPS
2. **API Keys 安全** - 不要将 SERVICE_ROLE_KEY 提交到公共仓库
3. **防火墙** - 确保 8000 端口已对外开放
4. **考虑使用 SSH 隧道** - 更安全的连接方式

## 📚 相关文档

- [Supabase-MCP外网配置指南](./Supabase-MCP外网配置指南.md)
- [Supabase-MCP外网配置完成](./Supabase-MCP外网配置完成.md)
- [Supabase MCP 官方文档](https://supabase.com/docs/guides/getting-started/mcp)

---

**配置完成**: 2026-01-19
