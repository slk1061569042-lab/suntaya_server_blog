# 修复 Cursor 连接问题脚本
# 优化服务器 SSH 配置并清理连接

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复 Cursor 连接问题" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 检查并优化服务器 SSH 配置
Write-Host "步骤 1: 检查并优化服务器 SSH 配置..." -ForegroundColor Yellow

$sshConfigCheck = ssh myserver "sudo grep -E '^AllowTcpForwarding' /etc/ssh/sshd_config 2>/dev/null"
if (-not $sshConfigCheck) {
    Write-Host "  [INFO] AllowTcpForwarding 未设置，将添加配置..." -ForegroundColor Gray
    Write-Host "  执行命令: sudo bash -c 'echo \"AllowTcpForwarding yes\" >> /etc/ssh/sshd_config'" -ForegroundColor Gray
    $result = ssh myserver "sudo bash -c 'echo \"AllowTcpForwarding yes\" >> /etc/ssh/sshd_config' 2>&1"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] 已添加 AllowTcpForwarding yes" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] 添加配置失败: $result" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [INFO] AllowTcpForwarding 已配置: $sshConfigCheck" -ForegroundColor Gray
    if ($sshConfigCheck -match "no") {
        Write-Host "  [ERROR] AllowTcpForwarding = no，需要修改为 yes" -ForegroundColor Red
        Write-Host "  执行命令: sudo sed -i 's/^AllowTcpForwarding.*/AllowTcpForwarding yes/' /etc/ssh/sshd_config" -ForegroundColor Gray
        $result = ssh myserver "sudo sed -i 's/^AllowTcpForwarding.*/AllowTcpForwarding yes/' /etc/ssh/sshd_config 2>&1"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] 已修改 AllowTcpForwarding 为 yes" -ForegroundColor Green
        } else {
            Write-Host "  [ERROR] 修改失败: $result" -ForegroundColor Red
        }
    }
}

# 确保 AllowAgentForwarding 也启用
$agentCheck = ssh myserver "sudo grep -E '^AllowAgentForwarding' /etc/ssh/sshd_config 2>/dev/null"
if (-not $agentCheck) {
    Write-Host "  [INFO] 添加 AllowAgentForwarding yes..." -ForegroundColor Gray
    ssh myserver "sudo bash -c 'echo \"AllowAgentForwarding yes\" >> /etc/ssh/sshd_config'" 2>&1 | Out-Null
    Write-Host "  [OK] 已添加 AllowAgentForwarding yes" -ForegroundColor Green
}

Write-Host ""

# 步骤 2: 重启 SSH 服务（如果需要）
Write-Host "步骤 2: 检查是否需要重启 SSH 服务..." -ForegroundColor Yellow
$needRestart = $false
if ($sshConfigCheck -match "no" -or -not $sshConfigCheck) {
    $needRestart = $true
}

if ($needRestart) {
    Write-Host "  重启 SSH 服务..." -ForegroundColor Gray
    $restartResult = ssh myserver "sudo systemctl restart sshd 2>&1 || sudo systemctl restart ssh 2>&1"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] SSH 服务已重启" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } else {
        Write-Host "  [WARN] SSH 服务重启失败: $restartResult" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [INFO] 无需重启 SSH 服务" -ForegroundColor Gray
}
Write-Host ""

# 步骤 3: 清理服务器端 Cursor 进程和文件
Write-Host "步骤 3: 清理服务器端 Cursor 进程和文件..." -ForegroundColor Yellow
Write-Host "  停止 Cursor Server 进程..." -ForegroundColor Gray
$killResult = ssh myserver "pkill -f cursor-server; pkill -f cursor-remote; sleep 1; echo 'done'" 2>&1
Write-Host "  [OK] 已停止 Cursor 进程" -ForegroundColor Green

Write-Host "  清理临时文件和锁文件..." -ForegroundColor Gray
$cleanResult = ssh myserver "rm -f /run/user/0/cursor-remote-* 2>/dev/null; rm -rf /tmp/cursor-* 2>/dev/null; echo 'done'" 2>&1
Write-Host "  [OK] 已清理临时文件" -ForegroundColor Green
Write-Host ""

# 步骤 4: 优化本地 SSH 配置
Write-Host "步骤 4: 检查并优化本地 SSH 配置..." -ForegroundColor Yellow
$sshConfigPath = "$env:USERPROFILE\.ssh\config"
if (Test-Path $sshConfigPath) {
    $configContent = Get-Content $sshConfigPath -Raw
    if ($configContent -match "Host\s+myserver") {
        # 检查是否需要添加优化选项
        $needsUpdate = $false
        $newConfig = $configContent
        
        if ($configContent -notmatch "ServerAliveInterval") {
            $needsUpdate = $true
            Write-Host "  [INFO] 添加 ServerAliveInterval 配置..." -ForegroundColor Gray
        }
        if ($configContent -notmatch "TCPKeepAlive") {
            $needsUpdate = $true
            Write-Host "  [INFO] 添加 TCPKeepAlive 配置..." -ForegroundColor Gray
        }
        if ($configContent -notmatch "Compression") {
            $needsUpdate = $true
            Write-Host "  [INFO] 添加 Compression 配置..." -ForegroundColor Gray
        }
        
        if ($needsUpdate) {
            # 在 myserver 配置块中添加优化选项
            if ($configContent -match "(?s)(Host\s+myserver\s+.*?)(?=Host|\z)") {
                $myserverBlock = $matches[1]
                $optimizedBlock = $myserverBlock
                
                if ($myserverBlock -notmatch "ServerAliveInterval") {
                    $optimizedBlock = $optimizedBlock.TrimEnd() + "`n    ServerAliveInterval 30`n    ServerAliveCountMax 5`n"
                }
                if ($myserverBlock -notmatch "TCPKeepAlive") {
                    $optimizedBlock = $optimizedBlock.TrimEnd() + "`n    TCPKeepAlive yes`n"
                }
                if ($myserverBlock -notmatch "Compression") {
                    $optimizedBlock = $optimizedBlock.TrimEnd() + "`n    Compression yes`n"
                }
                
                $newConfig = $configContent -replace [regex]::Escape($myserverBlock), $optimizedBlock
                
                # 备份原配置
                Copy-Item $sshConfigPath "$sshConfigPath.backup.$(Get-Date -Format 'yyyyMMddHHmmss')" -ErrorAction SilentlyContinue
                
                # 写入新配置
                Set-Content -Path $sshConfigPath -Value $newConfig -Encoding UTF8
                Write-Host "  [OK] SSH 配置已优化" -ForegroundColor Green
            }
        } else {
            Write-Host "  [OK] SSH 配置已包含优化选项" -ForegroundColor Green
        }
    }
}
Write-Host ""

# 步骤 5: 测试连接
Write-Host "步骤 5: 测试 SSH 连接..." -ForegroundColor Yellow
$testStart = Get-Date
$testResult = ssh -o ConnectTimeout=10 myserver "echo '连接测试成功'" 2>&1
$testEnd = Get-Date
$testDuration = ($testEnd - $testStart).TotalMilliseconds

if ($testResult -match "连接测试成功") {
    Write-Host "  [OK] SSH 连接正常" -ForegroundColor Green
    Write-Host "  响应时间: $([math]::Round($testDuration, 0)) ms" -ForegroundColor Gray
} else {
    Write-Host "  [WARN] SSH 连接测试异常" -ForegroundColor Yellow
    Write-Host "  输出: $testResult" -ForegroundColor Gray
}
Write-Host ""

# 总结
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Yellow
Write-Host "1. 在 Cursor 中关闭远程连接（如果已连接）" -ForegroundColor White
Write-Host "   - 点击左下角 SSH 状态图标" -ForegroundColor Gray
Write-Host "   - 选择 'Close Remote Connection'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 等待 5 秒后重新连接" -ForegroundColor White
Write-Host "   - 在 Cursor 中连接到 myserver" -ForegroundColor Gray
Write-Host "   - 等待连接建立（可能需要 1-2 分钟）" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 如果仍然无法连接，检查 Cursor 日志:" -ForegroundColor White
Write-Host "   %USERPROFILE%\.cursor\logs\" -ForegroundColor Gray
Write-Host ""

