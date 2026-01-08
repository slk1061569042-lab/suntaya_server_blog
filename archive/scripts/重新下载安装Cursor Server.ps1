# 重新下载安装 Cursor Server
# 此脚本将完全清理服务器上的 Cursor Server，然后指导您重新连接以下载安装

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "重新下载安装 Cursor Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 检查 SSH 连接
Write-Host "【步骤 1/4】检查 SSH 连接..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

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

# 步骤 2: 停止所有 Cursor 相关进程
Write-Host "【步骤 2/4】停止 Cursor 相关进程..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "1. 查找并停止 Cursor 进程..." -ForegroundColor Cyan
try {
    $processInfo = ssh myserver "ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep" 2>&1
    if ($processInfo -and $processInfo.Trim() -ne "") {
        Write-Host "   发现以下进程:" -ForegroundColor Yellow
        $processInfo | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        Write-Host ""
        
        $killResult = ssh myserver "pkill -9 -f cursor-server; pkill -9 -f cursor-remote; sleep 2; echo '进程已停止'" 2>&1
        Write-Host "   ✓ 进程已停止" -ForegroundColor Green
    } else {
        Write-Host "   ✓ 没有发现运行中的 Cursor 进程" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠ 停止进程时出现异常（可能进程不存在）" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 3: 清理 Cursor Server 目录和临时文件
Write-Host "【步骤 3/4】清理 Cursor Server 文件..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "1. 检查 Cursor Server 目录..." -ForegroundColor Cyan
try {
    $serverCheck = ssh myserver "if [ -d ~/.cursor-server ]; then du -sh ~/.cursor-server 2>/dev/null | awk '{print \$1}'; else echo '目录不存在'; fi" 2>&1
    if ($serverCheck -match "目录不存在") {
        Write-Host "   ✓ Cursor Server 目录不存在" -ForegroundColor Green
    } else {
        Write-Host "   发现 Cursor Server 目录，大小: $serverCheck" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠ 无法检查目录状态" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "2. 删除 Cursor Server 目录..." -ForegroundColor Cyan
try {
    $deleteResult = ssh myserver "rm -rf ~/.cursor-server 2>&1; if [ ! -d ~/.cursor-server ]; then echo '目录已删除'; else echo '删除失败'; fi" 2>&1
    if ($deleteResult -match "目录已删除") {
        Write-Host "   ✓ Cursor Server 目录已完全删除" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ 删除结果: $deleteResult" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠ 删除目录时出现异常: $_" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "3. 清理锁文件和临时文件..." -ForegroundColor Cyan
try {
    $cleanResult = ssh myserver @"
rm -f /run/user/0/cursor-remote-* 2>/dev/null
rm -f /run/user/*/cursor-remote-* 2>/dev/null
rm -rf /tmp/cursor-* 2>/dev/null
rm -rf /tmp/vscode-* 2>/dev/null
rm -rf /tmp/.cursor-* 2>/dev/null
echo '临时文件已清理'
"@ 2>&1
    
    Write-Host "   ✓ 临时文件和锁文件已清理" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ 清理文件时出现异常" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "4. 等待进程完全退出..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
Write-Host "   ✓ 等待完成" -ForegroundColor Green
Write-Host ""

# 步骤 4: 验证清理结果
Write-Host "【步骤 4/4】验证清理结果..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "检查清理结果..." -ForegroundColor Cyan
try {
    $verifyResult = ssh myserver @"
echo '=== 检查 Cursor Server 目录 ==='
if [ -d ~/.cursor-server ]; then
    echo '目录仍存在: ~/.cursor-server'
    ls -la ~/.cursor-server 2>/dev/null | head -5
else
    echo '✓ 目录已完全删除'
fi

echo ''
echo '=== 检查进程 ==='
PROCESS_COUNT=\$(ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep | wc -l)
if [ \$PROCESS_COUNT -eq 0 ]; then
    echo '✓ 没有运行中的进程'
else
    echo '⚠ 仍有 \$PROCESS_COUNT 个进程在运行'
fi

echo ''
echo '=== 检查锁文件 ==='
LOCK_COUNT=\$(find /run/user -name 'cursor-remote-*' 2>/dev/null | wc -l)
if [ \$LOCK_COUNT -eq 0 ]; then
    echo '✓ 没有锁文件'
else
    echo '⚠ 仍有 \$LOCK_COUNT 个锁文件'
fi
"@ 2>&1
    
    Write-Host $verifyResult -ForegroundColor Gray
} catch {
    Write-Host "   ⚠ 验证时出现异常" -ForegroundColor Yellow
}
Write-Host ""

# 完成提示
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "清理完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "现在请按照以下步骤重新连接以下载安装 Cursor Server：" -ForegroundColor Yellow
Write-Host ""

Write-Host "方法 1: 在 Cursor 中重新连接（推荐）" -ForegroundColor White
Write-Host "  1. 如果 Cursor 当前已连接，请先断开连接：" -ForegroundColor Gray
Write-Host "     - 点击 Cursor 左下角的 'SSH: myserver' 状态" -ForegroundColor Cyan
Write-Host "     - 选择 'Close Remote Connection'" -ForegroundColor Cyan
Write-Host "     - 等待 5-10 秒，确保连接完全关闭" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. 重新连接到 myserver：" -ForegroundColor Gray
Write-Host "     - 按 Ctrl+Shift+P 打开命令面板" -ForegroundColor Cyan
Write-Host "     - 输入 'Remote-SSH: Connect to Host'" -ForegroundColor Cyan
Write-Host "     - 选择 'myserver'" -ForegroundColor Cyan
Write-Host "     - 等待连接建立（首次下载需要 2-5 分钟）" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. 下载安装过程：" -ForegroundColor Gray
Write-Host "     - Cursor 会自动下载 Cursor Server（约 67MB）" -ForegroundColor Cyan
Write-Host "     - 下载完成后会自动安装" -ForegroundColor Cyan
Write-Host "     - 安装完成后会显示 'Connected to remote.'" -ForegroundColor Cyan
Write-Host ""
Write-Host "  4. 打开远程文件夹：" -ForegroundColor Gray
Write-Host "     - 点击右侧的 'Open Folder' 按钮" -ForegroundColor Cyan
Write-Host "     - 输入远程目录路径，例如：/root 或 /home/ubuntu" -ForegroundColor Cyan
Write-Host "     - 按 Enter 确认" -ForegroundColor Cyan
Write-Host ""

Write-Host "方法 2: 重新加载窗口" -ForegroundColor White
Write-Host "  1. 在 Cursor 中按 Ctrl+Shift+P" -ForegroundColor Gray
Write-Host "  2. 输入 'Developer: Reload Window' 并回车" -ForegroundColor Gray
Write-Host "  3. 等待窗口重新加载并重新连接" -ForegroundColor Gray
Write-Host ""

Write-Host "重要提示：" -ForegroundColor Yellow
Write-Host "  ⚠ 首次下载 Cursor Server 需要约 67MB 流量" -ForegroundColor White
Write-Host "  ⚠ 网络较慢时，可能需要 3-5 分钟" -ForegroundColor White
Write-Host "  ⚠ 请保持网络连接稳定，不要中断" -ForegroundColor White
Write-Host "  ⚠ 下载过程中可以在 Cursor 的输出面板查看进度" -ForegroundColor White
Write-Host ""

Write-Host "如果下载过程中遇到问题：" -ForegroundColor Yellow
Write-Host "  1. 检查网络连接是否正常" -ForegroundColor White
Write-Host "  2. 检查服务器磁盘空间是否充足" -ForegroundColor White
Write-Host "  3. 查看 Cursor 的输出面板中的错误信息" -ForegroundColor White
Write-Host "  4. 可以重新运行此脚本再次清理后重试" -ForegroundColor White
Write-Host ""

# 询问是否现在测试连接
$testNow = Read-Host "是否现在测试 SSH 连接以确保可以重新连接? (Y/N，默认Y)"
if ($testNow -ne "N" -and $testNow -ne "n") {
    Write-Host ""
    Write-Host "测试 SSH 连接..." -ForegroundColor Cyan
    try {
        $testResult = ssh -o ConnectTimeout=10 myserver "echo '连接测试成功'; hostname; echo '可以开始重新连接 Cursor 了'" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✓ SSH 连接正常，可以开始重新连接 Cursor" -ForegroundColor Green
            Write-Host ""
            Write-Host $testResult -ForegroundColor Gray
        } else {
            Write-Host "   ⚠ 连接测试未完全成功" -ForegroundColor Yellow
            Write-Host "   $testResult" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   ✗ 连接测试失败: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "准备就绪，可以开始重新连接了！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""







