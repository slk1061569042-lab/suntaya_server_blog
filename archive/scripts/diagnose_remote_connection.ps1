# Cursor 远程连接诊断脚本
# 用于排查远程连接卡住的问题

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cursor 远程连接诊断工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 测试基本 SSH 连接
Write-Host "1. 测试基本 SSH 连接..." -ForegroundColor Yellow
$sshTest = ssh -o ConnectTimeout=5 -o BatchMode=yes myserver "echo 'SSH连接成功'" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ SSH 连接正常" -ForegroundColor Green
} else {
    Write-Host "   ✗ SSH 连接失败" -ForegroundColor Red
    Write-Host "   错误信息: $sshTest" -ForegroundColor Red
    Write-Host ""
    Write-Host "   请先解决 SSH 连接问题" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 2. 检查服务器上的 Cursor Server 进程
Write-Host "2. 检查 Cursor Server 进程..." -ForegroundColor Yellow
$cursorProcess = ssh myserver "ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep" 2>&1
if ($cursorProcess) {
    Write-Host "   找到 Cursor 相关进程:" -ForegroundColor Green
    $cursorProcess | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "   ⚠ 未找到 Cursor Server 进程" -ForegroundColor Yellow
    Write-Host "   可能正在安装或已停止" -ForegroundColor Yellow
}
Write-Host ""

# 3. 检查 Cursor Server 目录
Write-Host "3. 检查 Cursor Server 安装目录..." -ForegroundColor Yellow
$cursorDir = ssh myserver "ls -la ~/.cursor-server/bin/ 2>/dev/null | head -3" 2>&1
if ($cursorDir -and $cursorDir -notmatch "No such file") {
    Write-Host "   ✓ Cursor Server 目录存在" -ForegroundColor Green
    Write-Host "   目录内容预览:" -ForegroundColor Gray
    $cursorDir | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "   ✗ Cursor Server 目录不存在" -ForegroundColor Red
    Write-Host "   可能需要重新安装" -ForegroundColor Yellow
}
Write-Host ""

# 4. 检查锁文件
Write-Host "4. 检查锁文件和临时文件..." -ForegroundColor Yellow
$lockFiles = ssh myserver "ls -la /run/user/0/cursor-remote-* 2>/dev/null | wc -l" 2>&1
if ($lockFiles -match "^\d+$") {
    $count = [int]$lockFiles
    if ($count -gt 0) {
        Write-Host "   找到 $count 个锁文件/临时文件" -ForegroundColor Yellow
        Write-Host "   文件列表:" -ForegroundColor Gray
        ssh myserver "ls -la /run/user/0/cursor-remote-* 2>/dev/null | head -5" | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    } else {
        Write-Host "   ✓ 没有锁文件" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠ 无法检查锁文件" -ForegroundColor Yellow
}
Write-Host ""

# 5. 检查服务器资源
Write-Host "5. 检查服务器资源..." -ForegroundColor Yellow
$diskSpace = ssh myserver "df -h / | tail -1" 2>&1
$memory = ssh myserver "free -h | grep Mem" 2>&1

Write-Host "   磁盘空间:" -ForegroundColor Gray
Write-Host "   $diskSpace" -ForegroundColor Gray
Write-Host "   内存使用:" -ForegroundColor Gray
Write-Host "   $memory" -ForegroundColor Gray

# 检查磁盘使用率
$diskUsage = ($diskSpace -split '\s+')[4] -replace '%', ''
if ([int]$diskUsage -gt 90) {
    Write-Host "   ⚠ 警告: 磁盘使用率超过 90%" -ForegroundColor Red
} elseif ([int]$diskUsage -gt 80) {
    Write-Host "   ⚠ 警告: 磁盘使用率超过 80%" -ForegroundColor Yellow
} else {
    Write-Host "   ✓ 磁盘空间充足" -ForegroundColor Green
}
Write-Host ""

# 6. 检查 Cursor Server 日志
Write-Host "6. 检查 Cursor Server 日志（最后10行）..." -ForegroundColor Yellow
$logContent = ssh myserver "tail -10 /run/user/0/cursor-remote-code.log 2>/dev/null" 2>&1
if ($logContent -and $logContent -notmatch "No such file") {
    Write-Host "   日志内容:" -ForegroundColor Gray
    $logContent | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "   ⚠ 日志文件不存在或无法读取" -ForegroundColor Yellow
}
Write-Host ""

# 7. 检查网络连接
Write-Host "7. 检查网络连接..." -ForegroundColor Yellow
$pingResult = Test-Connection -ComputerName 115.190.54.220 -Count 2 -Quiet
if ($pingResult) {
    Write-Host "   ✓ 网络连接正常" -ForegroundColor Green
} else {
    Write-Host "   ✗ 网络连接异常" -ForegroundColor Red
}
Write-Host ""

# 8. 检查 Cursor 本地日志位置
Write-Host "8. Cursor 本地日志位置..." -ForegroundColor Yellow
$logPath = "$env:USERPROFILE\.cursor\logs"
if (Test-Path $logPath) {
    Write-Host "   ✓ 日志目录存在: $logPath" -ForegroundColor Green
    $logFiles = Get-ChildItem $logPath -Filter "*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 3
    if ($logFiles) {
        Write-Host "   最新的日志文件:" -ForegroundColor Gray
        $logFiles | ForEach-Object { 
            Write-Host "   - $($_.Name) (修改时间: $($_.LastWriteTime))" -ForegroundColor Gray 
        }
    }
} else {
    Write-Host "   ⚠ 日志目录不存在: $logPath" -ForegroundColor Yellow
}
Write-Host ""

# 总结和建议
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "诊断总结" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "如果连接卡住，可以尝试以下操作:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 清理服务器端的 Cursor 进程和文件:" -ForegroundColor White
Write-Host "   ssh myserver 'pkill -f cursor-server; rm -f /run/user/0/cursor-remote-*'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 在 Cursor 中关闭远程连接，然后重新连接" -ForegroundColor White
Write-Host ""
Write-Host "3. 查看 Cursor 本地日志获取详细错误信息:" -ForegroundColor White
Write-Host "   位置: $env:USERPROFILE\.cursor\logs" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 如果问题持续，可以完全清理 Cursor Server:" -ForegroundColor White
Write-Host "   ssh myserver 'rm -rf ~/.cursor-server/'" -ForegroundColor Gray
Write-Host "   然后重新连接，让 Cursor 重新安装" -ForegroundColor Gray
Write-Host ""

