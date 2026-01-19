# 获取 Supabase MCP 配置信息

$server = "root@115.190.54.220"
$supabaseDir = "/www/dk_project/dk_app/supabase/supabase_X6yr"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Supabase MCP 配置信息" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 获取环境变量
Write-Host "获取 API Keys..." -ForegroundColor Yellow
$anonKey = ssh $server "cd $supabaseDir && grep ANON_KEY .env | cut -d'=' -f2"
$serviceKey = ssh $server "cd $supabaseDir && grep SERVICE_ROLE_KEY .env | cut -d'=' -f2"
$publicUrl = ssh $server "cd $supabaseDir && grep SUPABASE_PUBLIC_URL .env | cut -d'=' -f2"

Write-Host ""
Write-Host "MCP Server URL:" -ForegroundColor Cyan
Write-Host "  $publicUrl/mcp" -ForegroundColor Green
Write-Host ""

Write-Host "Cursor MCP 配置 (JSON):" -ForegroundColor Cyan
Write-Host ""
$mcpConfig = @{
    mcpServers = @{
        supabase = @{
            url = "$publicUrl/mcp"
            headers = @{
                apikey = $anonKey
            }
        }
    }
} | ConvertTo-Json -Depth 10

Write-Host $mcpConfig -ForegroundColor Gray
Write-Host ""

Write-Host "配置步骤:" -ForegroundColor Yellow
Write-Host "1. 在 Cursor 中创建或编辑文件: .cursor/mcp.json" -ForegroundColor White
Write-Host "2. 将上面的 JSON 配置复制到文件中" -ForegroundColor White
Write-Host "3. 保存文件并重启 Cursor" -ForegroundColor White
Write-Host ""

Write-Host "安全提示:" -ForegroundColor Yellow
Write-Host "- ANON_KEY 用于客户端访问（权限受限）" -ForegroundColor Gray
Write-Host "- SERVICE_ROLE_KEY 拥有完整权限，请妥善保管" -ForegroundColor Gray
Write-Host "- 建议使用 HTTPS（当前为 HTTP）" -ForegroundColor Gray
Write-Host ""
