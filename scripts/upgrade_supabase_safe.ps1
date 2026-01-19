# Supabase 安全升级脚本
# 渐进式升级，先备份，再逐步升级服务

$server = "root@115.190.54.220"
$supabaseDir = "/www/dk_project/dk_app/supabase/supabase_X6yr"
$backupDir = "$supabaseDir/backups"
$backupFile = "$backupDir/supabase_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Supabase 安全升级脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 创建备份目录并备份数据库
Write-Host "步骤 1: 备份数据库..." -ForegroundColor Yellow
ssh $server "mkdir -p $backupDir"
$backupResult = ssh $server "docker exec supabase-db pg_dumpall -U postgres > $backupFile 2>&1 && echo 'SUCCESS' || echo 'FAILED'"
if ($backupResult -match "SUCCESS") {
    $backupSize = ssh $server "du -h $backupFile | cut -f1"
    Write-Host "✓ 数据库备份完成: $backupFile ($backupSize)" -ForegroundColor Green
} else {
    Write-Host "✗ 数据库备份失败！" -ForegroundColor Red
    Write-Host "是否继续？(y/n): " -ForegroundColor Yellow -NoNewline
    $continue = Read-Host
    if ($continue -ne "y") {
        Write-Host "升级已取消" -ForegroundColor Yellow
        exit
    }
}
Write-Host ""

# 步骤 2: 备份 docker-compose.yml
Write-Host "步骤 2: 备份配置文件..." -ForegroundColor Yellow
$backupCompose = "$supabaseDir/docker-compose.yml.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
ssh $server "cp $supabaseDir/docker-compose.yml $backupCompose"
Write-Host "✓ 配置文件已备份: $backupCompose" -ForegroundColor Green
Write-Host ""

# 步骤 3: 更新 docker-compose.yml 中的镜像版本
Write-Host "步骤 3: 更新镜像版本..." -ForegroundColor Yellow
Write-Host "正在更新 docker-compose.yml 文件..." -ForegroundColor Gray

# 创建更新脚本
$updateScript = @"
cd $supabaseDir

# 备份原文件
cp docker-compose.yml docker-compose.yml.backup

# 更新镜像版本
sed -i 's|supabase/storage-api:v1.10.1|supabase/storage-api:v1.25.7|g' docker-compose.yml
sed -i 's|supabase/studio:20240729-ce42139|supabase/studio:2025.11.17-sha-6a18e49|g' docker-compose.yml
sed -i 's|supabase/realtime:v2.30.23|supabase/realtime:v2.34.47|g' docker-compose.yml
sed -i 's|supabase/postgres-meta:v0.83.2|supabase/postgres-meta:v0.95.2|g' docker-compose.yml
sed -i 's|supabase/gotrue:v2.158.1|supabase/gotrue:v2.177.0|g' docker-compose.yml

echo "镜像版本已更新"
"@

ssh $server $updateScript
Write-Host "✓ 镜像版本已更新" -ForegroundColor Green
Write-Host ""

# 步骤 4: 拉取新镜像
Write-Host "步骤 4: 拉取新镜像..." -ForegroundColor Yellow
ssh $server "cd $supabaseDir && docker-compose pull"
Write-Host "✓ 新镜像已拉取" -ForegroundColor Green
Write-Host ""

# 步骤 5: 逐步升级服务
Write-Host "步骤 5: 升级服务（按顺序）..." -ForegroundColor Yellow
Write-Host ""

# 5.1 升级 Storage API
Write-Host "  5.1 升级 Storage API..." -ForegroundColor Cyan
ssh $server "cd $supabaseDir && docker-compose up -d --no-deps supabase-storage"
Start-Sleep -Seconds 3
Write-Host "    ✓ Storage API 升级完成" -ForegroundColor Green

# 5.2 升级 Realtime
Write-Host "  5.2 升级 Realtime..." -ForegroundColor Cyan
ssh $server "cd $supabaseDir && docker-compose up -d --no-deps realtime-dev.supabase-realtime"
Start-Sleep -Seconds 3
Write-Host "    ✓ Realtime 升级完成" -ForegroundColor Green

# 5.3 升级 Postgres Meta
Write-Host "  5.3 升级 Postgres Meta..." -ForegroundColor Cyan
ssh $server "cd $supabaseDir && docker-compose up -d --no-deps supabase-meta"
Start-Sleep -Seconds 3
Write-Host "    ✓ Postgres Meta 升级完成" -ForegroundColor Green

# 5.4 升级 GoTrue Auth
Write-Host "  5.4 升级 GoTrue Auth..." -ForegroundColor Cyan
ssh $server "cd $supabaseDir && docker-compose up -d --no-deps supabase-auth"
Start-Sleep -Seconds 3
Write-Host "    ✓ GoTrue Auth 升级完成" -ForegroundColor Green

# 5.5 升级 Studio
Write-Host "  5.5 升级 Studio..." -ForegroundColor Cyan
ssh $server "cd $supabaseDir && docker-compose up -d --no-deps supabase-studio"
Start-Sleep -Seconds 3
Write-Host "    ✓ Studio 升级完成" -ForegroundColor Green

Write-Host ""

# 步骤 6: 检查服务状态
Write-Host "步骤 6: 检查服务状态..." -ForegroundColor Yellow
ssh $server "cd $supabaseDir && docker-compose ps"
Write-Host ""

# 步骤 7: 等待服务就绪
Write-Host "步骤 7: 等待服务就绪（30秒）..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# 步骤 8: 最终状态检查
Write-Host "步骤 8: 最终状态检查..." -ForegroundColor Yellow
ssh $server "docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}' | grep supabase"
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "升级完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "已升级的服务:" -ForegroundColor Yellow
Write-Host "  - Storage API: v1.10.1 -> v1.25.7" -ForegroundColor White
Write-Host "  - Studio: 20240729 -> 2025.11.17" -ForegroundColor White
Write-Host "  - Realtime: v2.30.23 -> v2.34.47" -ForegroundColor White
Write-Host "  - Postgres Meta: v0.83.2 -> v0.95.2" -ForegroundColor White
Write-Host "  - GoTrue Auth: v2.158.1 -> v2.177.0" -ForegroundColor White
Write-Host ""
Write-Host "注意: PostgreSQL 未升级（需要单独处理大版本升级）" -ForegroundColor Yellow
Write-Host ""
Write-Host "备份位置:" -ForegroundColor Cyan
Write-Host "  数据库: $backupFile" -ForegroundColor White
Write-Host "  配置: $backupCompose" -ForegroundColor White
Write-Host ""
