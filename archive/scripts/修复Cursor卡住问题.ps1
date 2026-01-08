# 修复 Cursor "Opening Remote..." 卡住问题
# 解决 Cursor 连接后卡在 "Opening Remote..." 状态的问题

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复 Cursor 'Opening Remote...' 卡住问题" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 诊断当前状态
Write-Host "【步骤 1/4】诊断当前状态" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# 检查 SSH 连接
Write-Host "1. 检查 SSH 连接..." -ForegroundColor Cyan
try {
    $sshTest = ssh -o ConnectTimeout=5 -o BatchMode=yes myserver "echo 'SSH连接正常'" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ SSH 连接正常" -ForegroundColor Green
    } else {
        Write-Host "   ✗ SSH 连接异常" -ForegroundColor Red
        Write-Host "   请先确保 SSH 连接正常" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "   ✗ SSH 连接失败: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 检查 Cursor Server 进程
Write-Host "2. 检查 Cursor Server 进程..." -ForegroundColor Cyan
try {
    $processCheck = ssh myserver "ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep | wc -l" 2>&1
    $processCount = [int]($processCheck.Trim())
    if ($processCount -gt 0) {
        Write-Host "   ⚠ 发现 $processCount 个 Cursor 相关进程正在运行" -ForegroundColor Yellow
        Write-Host "   这可能导致连接卡住" -ForegroundColor Yellow
    } else {
        Write-Host "   ✓ 没有发现卡住的进程" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠ 无法检查进程状态" -ForegroundColor Yellow
}
Write-Host ""

# 检查锁文件
Write-Host "3. 检查锁文件..." -ForegroundColor Cyan
try {
    $lockFiles = ssh myserver "ls -1 /run/user/0/cursor-remote-* 2>/dev/null | wc -l" 2>&1
    $lockCount = [int]($lockFiles.Trim())
    if ($lockCount -gt 0) {
        Write-Host "   ⚠ 发现 $lockCount 个锁文件" -ForegroundColor Yellow
        Write-Host "   这些文件可能导致连接卡住" -ForegroundColor Yellow
    } else {
        Write-Host "   ✓ 没有发现锁文件" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✓ 没有发现锁文件" -ForegroundColor Green
}
Write-Host ""

# 检查 Cursor Server 目录
Write-Host "4. 检查 Cursor Server 安装状态..." -ForegroundColor Cyan
try {
    $serverCheck = ssh myserver "if [ -d ~/.cursor-server/bin ]; then echo '已安装'; ls -lh ~/.cursor-server/bin/cursor-server 2>/dev/null | awk '{print \$5}'; else echo '未安装'; fi" 2>&1
    if ($serverCheck -match "已安装") {
        Write-Host "   ✓ Cursor Server 已安装" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ Cursor Server 未安装或正在安装中" -ForegroundColor Yellow
        Write-Host "   首次连接需要下载约 67MB，请耐心等待" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠ 无法检查 Cursor Server 状态" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "【步骤 2/4】重要提示" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠ 最常见的原因：需要手动点击 'Open Folder' 按钮" -ForegroundColor Yellow
Write-Host ""
Write-Host "如果 Cursor 显示 'Connected to remote.' 和 'Open Folder' 按钮：" -ForegroundColor White
Write-Host "  1. 点击右侧的 'Open Folder' 按钮" -ForegroundColor Cyan
Write-Host "  2. 输入远程目录路径，例如：" -ForegroundColor Cyan
Write-Host "     - /root          (root 用户主目录)" -ForegroundColor Gray
Write-Host "     - /home/ubuntu   (ubuntu 用户主目录)" -ForegroundColor Gray
Write-Host "     - /var/www       (网站目录)" -ForegroundColor Gray
Write-Host "  3. 按 Enter 或点击确定" -ForegroundColor Cyan
Write-Host "  4. 等待文件夹加载完成" -ForegroundColor Cyan
Write-Host ""
Write-Host "如果已经点击了 'Open Folder' 但仍然卡住，请继续下一步..." -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "是否已尝试点击 'Open Folder' 按钮? (Y/N，默认Y)"
if ($continue -eq "N" -or $continue -eq "n") {
    Write-Host ""
    Write-Host "请先在 Cursor 中点击 'Open Folder' 按钮，然后重新运行此脚本" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "【步骤 3/4】清理卡住的进程和文件" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

$clean = Read-Host "是否清理服务器端的 Cursor 进程和临时文件? (Y/N，默认Y)"
if ($clean -ne "N" -and $clean -ne "n") {
    Write-Host ""
    Write-Host "1. 停止 Cursor 相关进程..." -ForegroundColor Cyan
    try {
        $killResult = ssh myserver "pkill -9 -f cursor-server; pkill -9 -f cursor-remote; sleep 1; echo '进程已停止'" 2>&1
        Write-Host "   ✓ 进程已停止" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠ 停止进程时出现异常（可能进程不存在）" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "2. 清理锁文件和临时文件..." -ForegroundColor Cyan
    try {
        $cleanResult = ssh myserver "rm -f /run/user/0/cursor-remote-* 2>/dev/null; rm -rf /tmp/cursor-* 2>/dev/null; rm -rf /tmp/vscode-* 2>/dev/null; echo '文件已清理'" 2>&1
        Write-Host "   ✓ 临时文件已清理" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠ 清理文件时出现异常" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "3. 等待进程完全退出..." -ForegroundColor Cyan
    Start-Sleep -Seconds 3
    Write-Host "   ✓ 等待完成" -ForegroundColor Green
} else {
    Write-Host "   ⚠ 跳过清理步骤" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "【步骤 4/4】重新连接指南" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "现在请按照以下步骤操作：" -ForegroundColor Cyan
Write-Host ""
Write-Host "方法 1: 重新加载窗口（推荐）" -ForegroundColor White
Write-Host "  1. 在 Cursor 中按 Ctrl+Shift+P" -ForegroundColor Gray
Write-Host "  2. 输入 'Reload Window' 并回车" -ForegroundColor Gray
Write-Host "  3. 等待窗口重新加载" -ForegroundColor Gray
Write-Host ""

Write-Host "方法 2: 关闭并重新连接" -ForegroundColor White
Write-Host "  1. 点击 Cursor 左下角的 'SSH: myserver' 状态" -ForegroundColor Gray
Write-Host "  2. 选择 'Close Remote Connection'" -ForegroundColor Gray
Write-Host "  3. 等待 5-10 秒，确保连接完全关闭" -ForegroundColor Gray
Write-Host "  4. 重新连接到 myserver" -ForegroundColor Gray
Write-Host "  5. 等待连接建立（可能需要 1-2 分钟）" -ForegroundColor Gray
Write-Host "  6. 点击 'Open Folder' 按钮，选择远程目录" -ForegroundColor Gray
Write-Host ""

Write-Host "方法 3: 完全重置（如果以上方法都不行）" -ForegroundColor White
Write-Host "  执行以下命令完全清理 Cursor Server：" -ForegroundColor Gray
Write-Host "  ssh myserver 'rm -rf ~/.cursor-server/'" -ForegroundColor Cyan
Write-Host "  然后重新连接，会重新下载安装（约67MB，需要几分钟）" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "诊断和清理完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "提示：" -ForegroundColor Yellow
Write-Host "  - 如果首次连接，Cursor Server 需要下载安装，请耐心等待" -ForegroundColor White
Write-Host "  - 网络较慢时，可能需要 2-3 分钟" -ForegroundColor White
Write-Host "  - 连接成功后，必须点击 'Open Folder' 选择目录才能使用" -ForegroundColor White
Write-Host ""

