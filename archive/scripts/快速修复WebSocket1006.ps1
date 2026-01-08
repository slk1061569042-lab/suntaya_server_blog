# 快速修复 WebSocket 1006 错误
# 解决 "Could not fetch remote environment" 和 "Failed to connect to the remote extension host server"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "快速修复 WebSocket 1006 错误" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 停止所有 Cursor 相关进程
Write-Host "步骤 1: 停止服务器端 Cursor 进程..." -ForegroundColor Yellow
try {
    $killResult = ssh myserver "pkill -9 -f cursor-server; pkill -9 -f cursor-remote; sleep 2; echo '进程已停止'" 2>&1
    Write-Host "  $killResult" -ForegroundColor Green
} catch {
    Write-Host "  [WARN] 停止进程时出现异常（可能进程不存在）" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 2: 清理所有临时文件和锁文件
Write-Host "步骤 2: 清理服务器端临时文件..." -ForegroundColor Yellow
try {
    $cleanResult = ssh myserver "rm -f /run/user/0/cursor-remote-* 2>/dev/null; rm -rf /tmp/cursor-* 2>/dev/null; rm -rf /tmp/vscode-* 2>/dev/null; echo '文件已清理'" 2>&1
    Write-Host "  $cleanResult" -ForegroundColor Green
} catch {
    Write-Host "  [WARN] 清理文件时出现异常" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 3: 检查 Cursor Server 目录
Write-Host "步骤 3: 检查 Cursor Server 状态..." -ForegroundColor Yellow
try {
    $serverCheck = ssh myserver "if [ -d ~/.cursor-server ]; then echo 'Cursor Server 目录存在'; ls -la ~/.cursor-server/bin/ 2>/dev/null | head -3; else echo 'Cursor Server 目录不存在'; fi" 2>&1
    Write-Host "  $serverCheck" -ForegroundColor Gray
} catch {
    Write-Host "  [WARN] 无法检查 Cursor Server 状态" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 4: 测试 SSH 连接
Write-Host "步骤 4: 测试 SSH 连接..." -ForegroundColor Yellow
try {
    $testResult = ssh -o ConnectTimeout=5 myserver "echo 'SSH连接正常'" 2>&1
    if ($testResult -match "SSH连接正常") {
        Write-Host "  [OK] SSH 连接正常" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] SSH 连接测试异常: $testResult" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [ERROR] SSH 连接失败: $_" -ForegroundColor Red
}
Write-Host ""

# 步骤 5: 检查服务器资源
Write-Host "步骤 5: 检查服务器资源..." -ForegroundColor Yellow
try {
    # 分别执行命令，避免复杂的引号转义问题
    $disk = ssh myserver 'df -h / | tail -1' 2>&1
    $memory = ssh myserver 'free -h | grep Mem' 2>&1
    Write-Host "  磁盘: $disk" -ForegroundColor Gray
    Write-Host "  内存: $memory" -ForegroundColor Gray
} catch {
    Write-Host "  [WARN] 无法检查服务器资源" -ForegroundColor Yellow
}
Write-Host ""

# 总结
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "清理完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Yellow
Write-Host ""
Write-Host "方法 1: 在 Cursor 中重新加载（推荐）" -ForegroundColor White
Write-Host "  1. 点击错误通知中的 'Reload Window' 按钮" -ForegroundColor Gray
Write-Host "  2. 或按 Ctrl+Shift+P，输入 'Reload Window'" -ForegroundColor Gray
Write-Host ""
Write-Host "方法 2: 完全关闭并重新连接" -ForegroundColor White
Write-Host "  1. 点击左下角 'SSH: myserver' 状态" -ForegroundColor Gray
Write-Host "  2. 选择 'Close Remote Connection'" -ForegroundColor Gray
Write-Host "  3. 等待 5 秒" -ForegroundColor Gray
Write-Host "  4. 重新连接到 myserver" -ForegroundColor Gray
Write-Host ""
Write-Host "方法 3: 如果仍然失败，完全重置 Cursor Server" -ForegroundColor White
Write-Host "  执行命令: ssh myserver 'rm -rf ~/.cursor-server/'" -ForegroundColor Gray
Write-Host "  然后重新连接（会重新下载安装）" -ForegroundColor Gray
Write-Host ""

