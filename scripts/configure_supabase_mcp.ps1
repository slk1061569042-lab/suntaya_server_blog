# Supabase MCP 外网配置脚本
# 自动配置 Supabase MCP 以支持外网访问

$server = "root@115.190.54.220"
$supabaseDir = "/www/dk_project/dk_app/supabase/supabase_X6yr"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Supabase MCP 外网配置" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 更新 SUPABASE_PUBLIC_URL
Write-Host "步骤 1: 更新 SUPABASE_PUBLIC_URL..." -ForegroundColor Yellow
ssh $server "cd $supabaseDir && cp .env .env.backup.mcp && sed -i 's|SUPABASE_PUBLIC_URL=http://localhost:8000|SUPABASE_PUBLIC_URL=http://115.190.54.220:8000|g' .env && grep SUPABASE_PUBLIC_URL .env"
Write-Host "✓ SUPABASE_PUBLIC_URL 已更新" -ForegroundColor Green
Write-Host ""

# 步骤 2: 检查 MCP 路由是否存在
Write-Host "步骤 2: 检查 MCP 路由配置..." -ForegroundColor Yellow
$hasMcp = ssh $server "cd $supabaseDir && grep -q 'name: mcp' volumes/api/kong.yml && echo 'EXISTS' || echo 'NOT_FOUND'"
if ($hasMcp -match "EXISTS") {
    Write-Host "✓ MCP 路由已存在" -ForegroundColor Green
} else {
    Write-Host "⚠ MCP 路由不存在，需要手动添加" -ForegroundColor Yellow
    Write-Host "  请参考文档: content/git-docs/Supabase-MCP外网配置指南.md" -ForegroundColor Gray
}
Write-Host ""

# 步骤 3: 检查 Kong 状态
Write-Host "步骤 3: 检查 Kong 服务状态..." -ForegroundColor Yellow
$kongStatus = ssh $server "docker ps --format '{{.Status}}' --filter 'name=supabase-kong'"
if ($kongStatus -match "healthy") {
    Write-Host "✓ Kong 服务运行正常: $kongStatus" -ForegroundColor Green
} else {
    Write-Host "⚠ Kong 服务状态: $kongStatus" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 4: 获取 API Keys
Write-Host "步骤 4: 获取 API Keys..." -ForegroundColor Yellow
$anonKey = ssh $server "cd $supabaseDir && grep ANON_KEY .env | cut -d'=' -f2"
$serviceKey = ssh $server "cd $supabaseDir && grep SERVICE_ROLE_KEY .env | cut -d'=' -f2"

Write-Host "✓ API Keys 已获取" -ForegroundColor Green
Write-Host ""

# 步骤 5: 生成 Cursor 配置
Write-Host "步骤 5: 生成 Cursor MCP 配置..." -ForegroundColor Yellow
$mcpUrl = "http://115.190.54.220:8000/mcp"

$cursorConfig = @{
    mcpServers = @{
        supabase = @{
            url = $mcpUrl
            headers = @{
                apikey = $anonKey
            }
        }
    }
} | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host "Cursor MCP 配置 (复制到 .cursor/mcp.json):" -ForegroundColor Cyan
Write-Host $cursorConfig -ForegroundColor Gray
Write-Host ""

# 步骤 6: 测试 MCP 端点
Write-Host "步骤 6: 测试 MCP 端点..." -ForegroundColor Yellow
$testResult = ssh $server "curl -s -H 'apikey: $anonKey' $mcpUrl 2>&1"
if ($testResult -match "Unauthorized") {
    Write-Host "✓ MCP 端点可访问（返回 Unauthorized 是正常的，需要 JSON-RPC 协议）" -ForegroundColor Green
} else {
    Write-Host "⚠ 测试结果: $testResult" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "配置完成" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Yellow
Write-Host "1. 在项目根目录创建 .cursor/mcp.json" -ForegroundColor White
Write-Host "2. 将上面的 JSON 配置复制到文件中" -ForegroundColor White
Write-Host "3. 保存文件并重启 Cursor" -ForegroundColor White
Write-Host "4. 在 Supabase Studio 中验证配置" -ForegroundColor White
Write-Host ""
