# 🌐 配置 Supabase MCP 外网访问

**配置时间**: 2026-01-19  
**服务器**: 115.190.54.220

## 📊 当前状态

- ✅ **SUPABASE_PUBLIC_URL 已更新**: `http://115.190.54.220:8000`
- ✅ **Kong 服务运行正常**: 端口 8000 已对外开放
- ⚠️ **MCP 路由配置**: 需要确认是否已正确添加

## 🎯 配置目标

将 Supabase MCP 从本地配置改为外网可访问：
- **本地配置**: `http://localhost:8000/mcp`
- **外网配置**: `http://115.190.54.220:8000/mcp`

## 🔧 配置步骤

### 步骤 1: 确认环境变量已更新

```bash
ssh root@115.190.54.220 "cd /www/dk_project/dk_app/supabase/supabase_X6yr && grep SUPABASE_PUBLIC_URL .env"
```

应该显示：`SUPABASE_PUBLIC_URL=http://115.190.54.220:8000`

### 步骤 2: 检查 MCP 路由配置

```bash
ssh root@115.190.54.220 "cd /www/dk_project/dk_app/supabase/supabase_X6yr && grep -A 10 '## MCP routes' volumes/api/kong.yml"
```

如果 MCP 路由不存在，需要手动添加。

### 步骤 3: 添加 MCP 路由（如果需要）

编辑 `/www/dk_project/dk_app/supabase/supabase_X6yr/volumes/api/kong.yml`，在 dashboard 路由之前添加：

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

  ## Protected Dashboard - catch all remaining routes
```

**重要**: MCP 路由必须放在 dashboard 路由之前！

### 步骤 4: 重启 Kong

```bash
ssh root@115.190.54.220 "cd /www/dk_project/dk_app/supabase/supabase_X6yr && docker-compose restart supabase_X6yr"
```

### 步骤 5: 配置 Cursor

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

## 🔑 API Keys

**ANON_KEY**:
```
eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogImFub24iLCAiaXNzIjogInN1cGFiYXNlLWRlbW8iLCAiaWF0IjogMTc2NzE3ODkxNiwgImV4cCI6IDk5OTk5OTk5OTl9.c-3hQgs-DOlhcnEx5EE5EhAj0GYsAP78lEMlgexmj1Q
```

**SERVICE_ROLE_KEY** (完整权限):
```
eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogInNlcnZpY2Vfcm9sZSIsICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsICJpYXQiOiAxNzY3MTc4OTE2LCAiZXhwIjogOTk5OTk5OTk5OX0.zPvza83J0K5H5w-O-hvxSVsxGnHUpBjJuGIAXCaegNQ
```

## ✅ 验证配置

1. **检查 Kong 状态**
   ```bash
   ssh root@115.190.54.220 "docker ps | grep kong"
   ```

2. **测试 MCP 端点**
   ```bash
   curl -H "apikey: YOUR_ANON_KEY" http://115.190.54.220:8000/mcp
   ```

3. **在 Supabase Studio 中验证**
   - 访问：`http://115.190.54.220:3000`
   - 进入 MCP 配置页面
   - 检查 Server URL

## 📚 相关文档

- [Supabase-MCP外网配置指南](./Supabase-MCP外网配置指南.md)
- [Supabase-MCP外网配置完成](./Supabase-MCP外网配置完成.md)
- [Supabase-MCP外网配置总结](./Supabase-MCP外网配置总结.md)

---

**最后更新**: 2026-01-19
