# 快速修复 WebSocket 1006 错误

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复 WebSocket 连接错误" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "步骤 1: 清理服务器端 Cursor Server 进程..." -ForegroundColor Yellow
$result1 = ssh myserver "pkill -f cursor-server; pkill -f cursor-remote" 2>&1
Start-Sleep -Seconds 2
Write-Host "   ✓ 进程已停止" -ForegroundColor Green

Write-Host ""
Write-Host "步骤 2: 清理临时文件和锁文件..." -ForegroundColor Yellow
$result2 = ssh myserver "rm -f /run/user/0/cursor-remote-*" 2>&1
Write-Host "   ✓ 临时文件已清理" -ForegroundColor Green

Write-Host ""
Write-Host "步骤 3: 验证清理结果..." -ForegroundColor Yellow
$processes = ssh myserver "ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep" 2>&1
if ($processes -eq "") {
    Write-Host "   ✓ 确认：所有进程已停止" -ForegroundColor Green
} else {
    Write-Host "   ⚠ 仍有进程运行，强制清理..." -ForegroundColor Yellow
    ssh myserver "pkill -9 -f cursor-server; pkill -9 -f cursor-remote" 2>&1 | Out-Null
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "清理完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 在 Cursor 中：" -ForegroundColor White
Write-Host "   - 点击左下角的 SSH 连接状态" -ForegroundColor Gray
Write-Host "   - 选择 'Close Remote Connection'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 等待 3-5 秒" -ForegroundColor White
Write-Host ""
Write-Host "3. 重新连接到 myserver" -ForegroundColor White
Write-Host "   - 点击左下角 SSH 图标" -ForegroundColor Gray
Write-Host "   - 选择 'Connect to Host...'" -ForegroundColor Gray
Write-Host "   - 选择 'myserver'" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 等待连接建立（可能需要1-2分钟）" -ForegroundColor White
Write-Host ""
Write-Host "如果问题仍然存在，可以尝试完全清理：" -ForegroundColor Yellow
Write-Host "   ssh myserver 'rm -rf ~/.cursor-server/'" -ForegroundColor Gray
Write-Host "   然后重新连接（会重新下载约67MB）" -ForegroundColor Gray
Write-Host ""

