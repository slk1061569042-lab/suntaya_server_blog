# 修复 Cursor Server 端口绑定失败问题
# 专门用于解决"进程存在但未监听端口"的问题

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复 Cursor Server 端口绑定失败" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 诊断当前状态
Write-Host "【步骤 1/5】诊断当前状态..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    # 分别执行命令，避免复杂的引号转义问题
    Write-Host "检查进程..." -ForegroundColor Cyan
    $processCount = ssh myserver "pgrep -f cursor-server | wc -l" 2>&1
    $processCount = [int]($processCount -replace '\D','')
    Write-Host "  进程数量: $processCount" -ForegroundColor Gray
    
    Write-Host "检查端口..." -ForegroundColor Cyan
    $portCount = ssh myserver "ss -tlnp 2>/dev/null | grep cursor | wc -l" 2>&1
    $portCount = [int]($portCount -replace '\D','')
    Write-Host "  监听端口数量: $portCount" -ForegroundColor Gray
    
    Write-Host "检查令牌文件..." -ForegroundColor Cyan
    $tokenCount = ssh myserver "ls -1 /run/user/0/cursor-remote-code.token.* 2>/dev/null | wc -l" 2>&1
    $tokenCount = [int]($tokenCount -replace '\D','')
    Write-Host "  令牌文件数量: $tokenCount" -ForegroundColor Gray
    
    Write-Host ""
    if ($processCount -gt 0 -and $portCount -eq 0) {
        Write-Host "  ⚠️  确认问题: 进程存在但未监听端口" -ForegroundColor Yellow
    } else {
        Write-Host "  ℹ️  当前状态可能不是端口绑定失败问题" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "  ✗ 诊断失败: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 步骤 2: 检查端口占用情况
Write-Host "【步骤 2/5】检查可能的端口冲突..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    Write-Host "检查 Cursor 常用端口范围 (40000-50000)..." -ForegroundColor Cyan
    $portCheck = ssh myserver "ss -tlnp 2>/dev/null | grep -E ':(4[0-9]{4}|5[0-9]{4}) ' | head -10 || echo '未发现占用'" 2>&1
    
    if ($portCheck -match "未发现占用" -or ($portCheck.Trim() -eq "")) {
        Write-Host "  ✓ 常用端口范围未被占用" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ 发现以下端口被占用:" -ForegroundColor Yellow
        $portCheck | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
    }
} catch {
    Write-Host "  ⚠ 无法检查端口占用情况" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 3: 检查系统资源
Write-Host "【步骤 3/5】检查系统资源..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    # 分别执行命令，避免复杂的引号转义问题
    Write-Host "文件描述符限制:" -ForegroundColor Cyan
    $ulimit = ssh myserver "ulimit -n" 2>&1
    Write-Host "  $ulimit" -ForegroundColor Gray
    
    Write-Host "内存使用:" -ForegroundColor Cyan
    $memory = ssh myserver "free -h | grep Mem" 2>&1
    Write-Host "  $memory" -ForegroundColor Gray
    
    Write-Host "磁盘空间:" -ForegroundColor Cyan
    $disk = ssh myserver "df -h / | tail -1" 2>&1
    Write-Host "  $disk" -ForegroundColor Gray
} catch {
    Write-Host "  ⚠ 无法检查系统资源" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 4: 强制停止所有 Cursor 进程
Write-Host "【步骤 4/5】强制停止所有 Cursor 进程..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    Write-Host "1. 查找所有 Cursor 相关进程..." -ForegroundColor Cyan
    $processList = ssh myserver "ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep" 2>&1
    if ($processList -and $processList.Trim() -ne "") {
        Write-Host "   发现以下进程:" -ForegroundColor Yellow
        $processList | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
    } else {
        Write-Host "   ✓ 没有运行中的进程" -ForegroundColor Green
    }
    Write-Host ""
    
    Write-Host "2. 强制停止进程..." -ForegroundColor Cyan
    ssh myserver "pkill -9 -f cursor-server" 2>&1 | Out-Null
    ssh myserver "pkill -9 -f cursor-remote" 2>&1 | Out-Null
    ssh myserver "pkill -9 -f cursor" 2>&1 | Out-Null
    Start-Sleep -Seconds 2
    
    $remaining = ssh myserver "ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep | wc -l" 2>&1
    $remaining = [int]($remaining -replace '\D','')
    if ($remaining -eq 0) {
        Write-Host "   ✓ 所有进程已停止" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ 仍有 $remaining 个进程在运行" -ForegroundColor Yellow
        Write-Host "   尝试更激进的清理..." -ForegroundColor Yellow
        ssh myserver "killall -9 cursor-server cursor-remote 2>/dev/null; sleep 1" 2>&1 | Out-Null
    }
    
} catch {
    Write-Host "   ✗ 停止进程时出现错误: $_" -ForegroundColor Red
}
Write-Host ""

# 步骤 5: 清理所有相关文件
Write-Host "【步骤 5/5】清理所有相关文件..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    Write-Host "清理锁文件和临时文件..." -ForegroundColor Cyan
    ssh myserver "rm -f /run/user/0/cursor-remote-* 2>/dev/null" 2>&1 | Out-Null
    ssh myserver "rm -f /run/user/*/cursor-remote-* 2>/dev/null" 2>&1 | Out-Null
    ssh myserver "rm -rf /tmp/cursor-* 2>/dev/null" 2>&1 | Out-Null
    ssh myserver "rm -rf /tmp/vscode-* 2>/dev/null" 2>&1 | Out-Null
    ssh myserver "rm -rf /tmp/.cursor-* 2>/dev/null" 2>&1 | Out-Null
    Write-Host "   ✓ 文件清理完成" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "等待进程完全退出..." -ForegroundColor Cyan
    Start-Sleep -Seconds 3
    Write-Host "   ✓ 等待完成" -ForegroundColor Green
    
} catch {
    Write-Host "   ✗ 清理文件时出现错误: $_" -ForegroundColor Red
}
Write-Host ""

# 验证清理结果
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "验证清理结果" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    Write-Host "=== 进程检查 ===" -ForegroundColor Cyan
    $verifyProcess = ssh myserver "ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep | wc -l" 2>&1
    $verifyProcess = [int]($verifyProcess -replace '\D','')
    if ($verifyProcess -eq 0) {
        Write-Host "  ✓ 没有运行中的进程" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ 仍有 $verifyProcess 个进程在运行" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "=== 文件检查 ===" -ForegroundColor Cyan
    $verifyFiles = ssh myserver "find /run/user -name 'cursor-remote-*' 2>/dev/null | wc -l" 2>&1
    $verifyFiles = [int]($verifyFiles -replace '\D','')
    if ($verifyFiles -eq 0) {
        Write-Host "  ✓ 没有残留文件" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ 仍有 $verifyFiles 个文件" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "  ⚠ 验证时出现错误" -ForegroundColor Yellow
}
Write-Host ""

# 完成提示
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "下一步操作:" -ForegroundColor Yellow
Write-Host ""
Write-Host "方法 1: 在 Cursor 中重新连接（推荐）" -ForegroundColor White
Write-Host "  1. 点击左下角 'SSH: myserver' 状态" -ForegroundColor Gray
Write-Host "  2. 选择 'Close Remote Connection'" -ForegroundColor Gray
Write-Host "  3. 等待 5-10 秒，确保连接完全关闭" -ForegroundColor Gray
Write-Host "  4. 重新连接到 myserver" -ForegroundColor Gray
Write-Host "  5. Cursor 会自动重新启动 Cursor Server" -ForegroundColor Gray
Write-Host ""

Write-Host "方法 2: 如果问题仍然存在，完全重置" -ForegroundColor White
Write-Host "  执行命令: ssh myserver 'rm -rf ~/.cursor-server/'" -ForegroundColor Gray
Write-Host "  然后重新连接（会重新下载安装 Cursor Server）" -ForegroundColor Gray
Write-Host ""

Write-Host "提示:" -ForegroundColor Yellow
Write-Host "  - 如果端口绑定仍然失败，可能是系统资源不足" -ForegroundColor White
Write-Host "  - 检查文件描述符限制: ssh myserver 'ulimit -n'" -ForegroundColor White
Write-Host "  - 如果限制太低（< 1024），可能需要增加: ssh myserver 'ulimit -n 4096'" -ForegroundColor White
Write-Host ""

