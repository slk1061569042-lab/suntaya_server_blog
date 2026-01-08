# 清理服务器端的 Cursor Server 并重新连接

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "清理 Cursor Server 并重新连接" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "警告: 这将清理服务器上的 Cursor Server 进程和临时文件" -ForegroundColor Yellow
Write-Host "Cursor 会在下次连接时重新安装 Server" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "是否继续? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "已取消" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "1. 停止 Cursor 相关进程..." -ForegroundColor Yellow
ssh myserver "pkill -f cursor-server; pkill -f cursor-remote" 2>&1 | Out-Null
Start-Sleep -Seconds 2
Write-Host "   ✓ 进程已停止" -ForegroundColor Green

Write-Host ""
Write-Host "2. 清理锁文件和临时文件..." -ForegroundColor Yellow
ssh myserver "rm -f /run/user/0/cursor-remote-*" 2>&1 | Out-Null
Write-Host "   ✓ 临时文件已清理" -ForegroundColor Green

Write-Host ""
Write-Host "3. 可选: 完全清理 Cursor Server (会重新下载)" -ForegroundColor Yellow
$fullClean = Read-Host "是否完全清理? (Y/N)"
if ($fullClean -eq "Y" -or $fullClean -eq "y") {
    ssh myserver "rm -rf ~/.cursor-server/" 2>&1 | Out-Null
    Write-Host "   ✓ Cursor Server 已完全清理" -ForegroundColor Green
    Write-Host "   下次连接时会重新下载安装（约67MB）" -ForegroundColor Yellow
} else {
    Write-Host "   ⚠ 保留 Cursor Server，只清理临时文件" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "清理完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Yellow
Write-Host "1. 在 Cursor 中关闭当前的远程连接" -ForegroundColor White
Write-Host "2. 重新连接到 myserver" -ForegroundColor White
Write-Host "3. 等待 Cursor Server 安装完成" -ForegroundColor White
Write-Host ""

