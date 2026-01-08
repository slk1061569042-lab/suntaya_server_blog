# 诊断本地端口连接失败问题
# 解决 ERR_CONNECTION_REFUSED 错误（如 127.0.0.1:11528）

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "诊断本地端口连接失败" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 检查本地端口监听情况
Write-Host "【步骤 1/4】检查本地端口监听情况..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    # 检查常见的 Cursor 端口范围
    Write-Host "检查本地端口 40000-50000 范围..." -ForegroundColor Cyan
    $localPorts = netstat -an | Select-String -Pattern ":(4[0-9]{4}|5[0-9]{4})" | Select-String -Pattern "LISTENING"
    
    if ($localPorts) {
        Write-Host "  发现以下本地监听端口:" -ForegroundColor Green
        $localPorts | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
    } else {
        Write-Host "  ⚠ 未发现 Cursor 相关的本地监听端口" -ForegroundColor Yellow
        Write-Host "  这表示 SSH 端口转发可能未建立" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠ 无法检查本地端口" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 2: 检查远程服务器进程和端口
Write-Host "【步骤 2/4】检查远程服务器状态..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    Write-Host "检查远程进程..." -ForegroundColor Cyan
    $remoteProcess = ssh myserver "ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep | wc -l" 2>&1
    $remoteProcess = [int]($remoteProcess -replace '\D','')
    Write-Host "  远程进程数量: $remoteProcess" -ForegroundColor Gray
    
    Write-Host "检查远程端口监听..." -ForegroundColor Cyan
    $remotePort = ssh myserver "ss -tlnp 2>/dev/null | grep cursor | wc -l" 2>&1
    $remotePort = [int]($remotePort -replace '\D','')
    Write-Host "  远程监听端口数量: $remotePort" -ForegroundColor Gray
    
    if ($remoteProcess -gt 0 -and $remotePort -eq 0) {
        Write-Host ""
        Write-Host "  ⚠️  问题确认: 远程进程存在但未监听端口" -ForegroundColor Red
        Write-Host "  这是导致本地连接失败的根本原因！" -ForegroundColor Red
    } elseif ($remoteProcess -eq 0) {
        Write-Host ""
        Write-Host "  ⚠️  远程进程不存在" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "  ✓ 远程服务器状态正常" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ 无法检查远程服务器: $_" -ForegroundColor Red
}
Write-Host ""

# 步骤 3: 检查 SSH 连接和端口转发
Write-Host "【步骤 3/4】检查 SSH 连接状态..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    Write-Host "测试 SSH 基本连接..." -ForegroundColor Cyan
    $sshTest = ssh -o ConnectTimeout=5 myserver "echo 'SSH连接正常'" 2>&1
    if ($sshTest -match "SSH连接正常") {
        Write-Host "  ✓ SSH 基本连接正常" -ForegroundColor Green
    } else {
        Write-Host "  ✗ SSH 连接异常: $sshTest" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "检查 SSH 端口转发配置..." -ForegroundColor Cyan
    $sshConfig = Get-Content "$env:USERPROFILE\.ssh\config" -ErrorAction SilentlyContinue
    if ($sshConfig) {
        $myserverConfig = $sshConfig | Select-String -Pattern "Host myserver" -Context 0, 15
        if ($myserverConfig) {
            Write-Host "  ✓ 找到 myserver SSH 配置" -ForegroundColor Green
            $hasForwarding = $myserverConfig -match "LocalForward|RemoteForward"
            if ($hasForwarding) {
                Write-Host "  配置了端口转发" -ForegroundColor Gray
            } else {
                Write-Host "  ℹ️  未显式配置端口转发（Cursor 会自动创建）" -ForegroundColor Gray
            }
        }
    }
} catch {
    Write-Host "  ⚠ 无法检查 SSH 配置" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 4: 提供解决方案
Write-Host "【步骤 4/4】问题分析和解决方案..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "问题分析:" -ForegroundColor Cyan
Write-Host "  ERR_CONNECTION_REFUSED 错误表示:" -ForegroundColor White
Write-Host "  1. Cursor 尝试通过本地端口（如 11528）连接远程服务器" -ForegroundColor White
Write-Host "  2. 但远程服务器上的 Cursor Server 未正常监听端口" -ForegroundColor White
Write-Host "  3. 导致 SSH 端口转发无法建立连接" -ForegroundColor White
Write-Host ""

if ($remoteProcess -gt 0 -and $remotePort -eq 0) {
    Write-Host "根本原因:" -ForegroundColor Yellow
    Write-Host "  远程进程存在但未监听端口（端口绑定失败）" -ForegroundColor Red
    Write-Host ""
    Write-Host "解决方案:" -ForegroundColor Yellow
    Write-Host "  1. 强制停止远程进程并清理" -ForegroundColor White
    Write-Host "  2. 在 Cursor 中重新连接" -ForegroundColor White
    Write-Host ""
    Write-Host "执行修复:" -ForegroundColor Cyan
    
    $fixNow = Read-Host "是否现在执行修复? (Y/N，默认Y)"
    if ($fixNow -ne "N" -and $fixNow -ne "n") {
        Write-Host ""
        Write-Host "执行修复..." -ForegroundColor Cyan
        
        try {
            Write-Host "1. 停止远程进程..." -ForegroundColor Yellow
            ssh myserver "pkill -9 -f cursor-server" 2>&1 | Out-Null
            ssh myserver "pkill -9 -f cursor-remote" 2>&1 | Out-Null
            ssh myserver "pkill -9 -f cursor" 2>&1 | Out-Null
            Start-Sleep -Seconds 2
            Write-Host "   ✓ 进程已停止" -ForegroundColor Green
            
            Write-Host "2. 清理临时文件..." -ForegroundColor Yellow
            ssh myserver "rm -f /run/user/0/cursor-remote-* 2>/dev/null" 2>&1 | Out-Null
            ssh myserver "rm -f /run/user/*/cursor-remote-* 2>/dev/null" 2>&1 | Out-Null
            ssh myserver "rm -rf /tmp/cursor-* 2>/dev/null" 2>&1 | Out-Null
            Write-Host "   ✓ 文件已清理" -ForegroundColor Green
            
            Write-Host ""
            Write-Host "修复完成！" -ForegroundColor Green
            Write-Host ""
            Write-Host "下一步操作:" -ForegroundColor Yellow
            Write-Host "  1. 在 Cursor 中点击左下角 'SSH: myserver' 状态" -ForegroundColor White
            Write-Host "  2. 选择 'Close Remote Connection'" -ForegroundColor White
            Write-Host "  3. 等待 5-10 秒" -ForegroundColor White
            Write-Host "  4. 重新连接到 myserver" -ForegroundColor White
            Write-Host "  5. Cursor 会自动重新启动 Cursor Server" -ForegroundColor White
            
        } catch {
            Write-Host "   ✗ 修复过程中出现错误: $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "建议操作:" -ForegroundColor Yellow
    Write-Host "  1. 运行完整诊断: .\诊断进程异常状态.ps1" -ForegroundColor White
    Write-Host "  2. 运行修复脚本: .\修复端口绑定失败.ps1" -ForegroundColor White
    Write-Host "  3. 在 Cursor 中重新连接" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""







