# ✅ Supabase MCP 外网配置完成

**配置时间**: 2026-01-19  
**服务器**: 115.190.54.220

## 📊 配置完成情况

### ✅ 已完成的配置

1. **更新 SUPABASE_PUBLIC_URL**
   - 从 `http://localhost:8000` 更新为 `http://115.190.54.220:8000`
   - 文件：`/www/dk_project/dk_app/supabase/supabase_X6yr/.env`

2. **添加 MCP 路由到 Kong**
   - 路由路径：`/mcp` → `http://studio:3000/api/mcp`
   - 认证：使用 key-auth（支持 anon 和 admin）
   - 文件：`/www/dk_project/dk_app/supabase/supabase_X6yr/volumes/api/kong.yml`
   - **重要**：MCP 路由已放在 dashboard 路由之前，确保正确匹配

3. **重启 Kong 服务**
   - Kong 已重新加载配置

## 🔧 Cursor MCP 配置

### 配置步骤

1. **创建或编辑 Cursor MCP 配置文件**

   在项目根目录创建 `.cursor/mcp.json`（如果不存在则创建 `.cursor` 目录）：

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

   **或者使用示例文件**：
   - 项目根目录已有示例文件：`.cursor/mcp.json.example`
   - 复制并重命名：`cp .cursor/mcp.json.example .cursor/mcp.json`

2. **使用脚本获取配置**

   运行配置脚本：

```powershell
.\scripts\get_supabase_mcp_config.ps1
```

   脚本会自动生成正确的 JSON 配置。

### API Keys

**ANON_KEY** (用于客户端访问):
```
eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogImFub24iLCAiaXNzIjogInN1cGFiYXNlLWRlbW8iLCAiaWF0IjogMTc2NzE3ODkxNiwgImV4cCI6IDk5OTk5OTk5OTl9.c-3hQgs-DOlhcnEx5EE5EhAj0GYsAP78lEMlgexmj1Q
```

**SERVICE_ROLE_KEY** (用于服务端访问，拥有完整权限):
```
eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogInNlcnZpY2Vfcm9sZSIsICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsICJpYXQiOiAxNzY3MTc4OTE2LCAiZXhwIjogOTk5OTk5OTk5OX0.zPvza83J0K5H5w-O-hvxSVsxGnHUpBjJuGIAXCaegNQ
```

## 🔍 验证配置

### 1. 测试 MCP 端点

```bash
# 使用 POST 请求测试（MCP 使用 JSON-RPC）
curl -X POST \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"initialize","id":1}' \
  http://115.190.54.220:8000/mcp
```

### 2. 在 Supabase Studio 中验证

1. 访问：`http://115.190.54.220:3000`
2. 进入：`Project Settings` → `Connect` → `MCP` 标签
3. 检查 Server URL 是否显示：`http://115.190.54.220:8000/mcp`

### 3. 在 Cursor 中测试

1. 配置完成后，重启 Cursor
2. 在 Cursor 中尝试使用 Supabase MCP 功能
3. 检查是否能够连接到 Supabase 项目

## ⚠️ 注意事项

### 安全建议

1. **使用 HTTPS**（强烈推荐）
   - 当前配置使用 HTTP，建议配置 SSL 证书
   - 更新 SUPABASE_PUBLIC_URL 为 `https://115.190.54.220:8443`

2. **保护 API Keys**
   - SERVICE_ROLE_KEY 拥有完整权限，请妥善保管
   - 不要将 API Keys 提交到公共代码仓库

3. **考虑使用 SSH 隧道**（最安全）
   ```bash
   ssh -L 8000:localhost:8000 root@115.190.54.220
   ```
   然后使用 `http://localhost:8000/mcp`

### 防火墙配置

确保服务器防火墙和云服务商安全组开放了 8000 端口：

```bash
# 检查端口是否开放
netstat -tlnp | grep 8000
# 或
ss -tlnp | grep 8000
```

## 🔄 配置位置总结

| 配置项 | 文件路径 | 说明 |
|--------|---------|------|
| **环境变量** | `/www/dk_project/dk_app/supabase/supabase_X6yr/.env` | SUPABASE_PUBLIC_URL |
| **Kong 路由** | `/www/dk_project/dk_app/supabase/supabase_X6yr/volumes/api/kong.yml` | MCP 路由配置 |
| **备份文件** | `/www/dk_project/dk_app/supabase/supabase_X6yr/volumes/api/kong.yml.backup.*` | Kong 配置备份 |
| **Cursor 配置** | `.cursor/mcp.json` | Cursor MCP 客户端配置 |

## 🚨 故障排查

### Q1: 返回 401 Unauthorized

**原因**: API Key 错误或缺失

**解决方法**:
1. 检查 Cursor 配置中的 `apikey` 是否正确
2. 使用正确的 ANON_KEY 或 SERVICE_ROLE_KEY
3. 确保请求头格式正确：`"apikey": "YOUR_KEY"`

### Q2: 返回 404 Not Found

**原因**: MCP 路由未正确配置

**解决方法**:
1. 检查 Kong 配置中 MCP 路由是否在 dashboard 路由之前
2. 重启 Kong 服务：`docker-compose restart supabase_X6yr`
3. 检查 Kong 日志：`docker logs supabase-kong --tail 50`

### Q3: 连接超时

**原因**: 网络或防火墙问题

**解决方法**:
1. 检查服务器防火墙设置
2. 检查云服务商安全组规则
3. 使用 `telnet 115.190.54.220 8000` 测试连接

## 📚 相关文档

- [Supabase-MCP外网配置指南](./Supabase-MCP外网配置指南.md)
- [Supabase MCP 官方文档](https://supabase.com/docs/guides/getting-started/mcp)
- [Cursor MCP 配置文档](https://cursor.sh/docs/mcp)

---

## ✅ 配置验证

### Kong 服务状态

- ✅ **Kong 运行正常** - 状态显示为 `healthy`
- ✅ **MCP 路由已配置** - `/mcp` 路径已添加到 Kong
- ✅ **外网可访问** - 端口 8000 已对外开放

### 测试结果

```bash
# 测试 MCP 端点（需要 API Key）
curl -H "apikey: YOUR_ANON_KEY" http://115.190.54.220:8000/mcp
```

**注意**: MCP 端点使用 JSON-RPC 协议，需要通过 POST 请求发送 JSON-RPC 消息。

## 📝 快速配置步骤

1. **在项目根目录创建 `.cursor/mcp.json`**（已创建示例文件）
2. **复制配置内容到文件**
3. **重启 Cursor**
4. **在 Supabase Studio 中验证** - 访问 `http://115.190.54.220:3000`，进入 MCP 配置页面

---

**配置完成时间**: 2026-01-19
