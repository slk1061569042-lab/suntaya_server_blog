# 🔧 Supabase MCP 外网访问手动配置步骤

**服务器**: 115.190.54.220  
**目标**: 将 MCP 端点从 `localhost` 改为外网可访问

## ✅ 已完成的配置

1. ✅ **SUPABASE_PUBLIC_URL 已更新** - `http://115.190.54.220:8000`
2. ✅ **Kong 服务运行正常** - 端口 8000 已对外开放

## 📋 需要手动完成的步骤

### 步骤 1: 添加 MCP 路由到 Kong 配置

**文件路径**: `/www/dk_project/dk_app/supabase/supabase_X6yr/volumes/api/kong.yml`

**操作**:
1. SSH 连接到服务器
2. 编辑 Kong 配置文件
3. 找到 `## Protected Dashboard - catch all remaining routes` 这一行（大约在第 272 行）
4. **在这一行之前**插入以下配置：

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

**重要提示**:
- MCP 路由**必须**放在 dashboard 路由之前
- 保持正确的 YAML 缩进（2 个空格）
- 确保没有语法错误

### 步骤 2: 重启 Kong 服务

```bash
ssh root@115.190.54.220
cd /www/dk_project/dk_app/supabase/supabase_X6yr
docker-compose restart supabase_X6yr
```

等待 10-15 秒，然后检查状态：

```bash
docker ps | grep kong
# 应该显示: Up ... (healthy)
```

### 步骤 3: 验证配置

```bash
# 检查 Kong 配置是否正确
docker exec supabase-kong kong config parse /home/kong/kong.yml

# 应该显示: parse successful
```

### 步骤 4: 配置 Cursor

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

### 步骤 5: 重启 Cursor

保存配置文件后，重启 Cursor 使配置生效。

## 🔍 快速验证命令

```bash
# 1. 检查 SUPABASE_PUBLIC_URL
ssh root@115.190.54.220 "cd /www/dk_project/dk_app/supabase/supabase_X6yr && grep SUPABASE_PUBLIC_URL .env"

# 2. 检查 MCP 路由是否存在
ssh root@115.190.54.220 "cd /www/dk_project/dk_app/supabase/supabase_X6yr && grep -A 5 '## MCP routes' volumes/api/kong.yml"

# 3. 检查 Kong 状态
ssh root@115.190.54.220 "docker ps | grep kong"

# 4. 测试 MCP 端点
curl -H "apikey: YOUR_ANON_KEY" http://115.190.54.220:8000/mcp
```

## 🚨 常见问题

### Q1: Kong 启动失败

**检查**:
```bash
docker logs supabase-kong --tail 20
```

**常见原因**:
- YAML 语法错误（缩进、引号等）
- MCP 路由位置不正确（必须在 dashboard 之前）

### Q2: MCP 端点返回 404

**检查**:
1. MCP 路由是否已添加到 Kong 配置
2. 路由是否在 dashboard 路由之前
3. Kong 是否已重启

### Q3: 返回 401 Unauthorized

**这是正常的**，因为：
- MCP 使用 JSON-RPC 协议
- 需要通过 POST 请求发送 JSON-RPC 消息
- 在 Cursor 中配置后会自动处理认证

## 📚 相关文档

- [Supabase-MCP外网配置指南](./Supabase-MCP外网配置指南.md)
- [Supabase-MCP外网配置完成](./Supabase-MCP外网配置完成.md)
- [Supabase-MCP外网配置总结](./Supabase-MCP外网配置总结.md)

---

**最后更新**: 2026-01-19
