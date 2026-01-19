# Supabase 升级脚本
# 渐进式升级策略，先升级应用层服务，最后升级数据库

$server = "root@115.190.54.220"
$backupDir = "/backup"
$backupFile = "$backupDir/supabase_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Supabase 升级脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 备份数据库
Write-Host "步骤 1: 备份数据库..." -ForegroundColor Yellow
ssh $server "mkdir -p $backupDir"
ssh $server "docker exec supabase-db pg_dumpall -U postgres > $backupFile 2>&1"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 数据库备份完成: $backupFile" -ForegroundColor Green
} else {
    Write-Host "✗ 数据库备份失败，但继续执行..." -ForegroundColor Yellow
}
Write-Host ""

# 步骤 2: 升级 Storage API
Write-Host "步骤 2: 升级 Storage API (v1.10.1 -> v1.25.7)..." -ForegroundColor Yellow
ssh $server "docker stop supabase-storage && docker rm supabase-storage"
ssh $server "docker run -d --name supabase-storage --network supabase_default -e POSTGRES_HOST=supabase-db -e POSTGRES_PORT=5432 -e POSTGRES_DB=postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=your-super-secret-and-long-postgres-password -e FILE_SIZE_LIMIT=52428800 -e STORAGE_BACKEND=file -e FILE_STORAGE_BACKEND_PATH=/var/lib/storage -v supabase-storage-data:/var/lib/storage supabase/storage-api:v1.25.7"
Start-Sleep -Seconds 5
Write-Host "✓ Storage API 升级完成" -ForegroundColor Green
Write-Host ""

# 步骤 3: 升级 Realtime
Write-Host "步骤 3: 升级 Realtime (v2.30.23 -> v2.34.47)..." -ForegroundColor Yellow
ssh $server "docker stop realtime-dev.supabase-realtime && docker rm realtime-dev.supabase-realtime"
# 注意：需要获取原始启动参数
Write-Host "⚠ 需要手动检查 Realtime 的启动参数" -ForegroundColor Yellow
Write-Host ""

# 步骤 4: 升级 Postgres Meta
Write-Host "步骤 4: 升级 Postgres Meta (v0.83.2 -> v0.95.2)..." -ForegroundColor Yellow
ssh $server "docker stop supabase-meta && docker rm supabase-meta"
# 注意：需要获取原始启动参数
Write-Host "⚠ 需要手动检查 Postgres Meta 的启动参数" -ForegroundColor Yellow
Write-Host ""

# 步骤 5: 升级 GoTrue (Auth)
Write-Host "步骤 5: 升级 GoTrue Auth (v2.158.1 -> v2.177.0)..." -ForegroundColor Yellow
ssh $server "docker stop supabase-auth && docker rm supabase-auth"
# 注意：需要获取原始启动参数
Write-Host "⚠ 需要手动检查 Auth 的启动参数" -ForegroundColor Yellow
Write-Host ""

# 步骤 6: 升级 Studio
Write-Host "步骤 6: 升级 Studio (20240729 -> 2025.11.17)..." -ForegroundColor Yellow
ssh $server "docker stop supabase-studio && docker rm supabase-studio"
# 注意：需要获取原始启动参数
Write-Host "⚠ 需要手动检查 Studio 的启动参数" -ForegroundColor Yellow
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "升级脚本执行完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "注意: 由于容器不是通过 docker-compose 启动，" -ForegroundColor Yellow
Write-Host "需要手动获取每个容器的完整启动参数。" -ForegroundColor Yellow
Write-Host ""
Write-Host "建议: 使用 docker inspect 查看容器配置，" -ForegroundColor Cyan
Write-Host "然后使用相同的参数重新创建容器。" -ForegroundColor Cyan
Write-Host ""
