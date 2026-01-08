# 检查服务器端 SSH 配置脚本
# 诊断 Cursor 远程连接所需的 SSH 功能

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "服务器 SSH 配置诊断" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 检查服务器端 SSH 配置
Write-Host "步骤 1: 检查服务器端 SSH 配置..." -ForegroundColor Yellow
Write-Host "  检查 /etc/ssh/sshd_config 中的关键设置..." -ForegroundColor Gray
Write-Host ""

try {
    $sshConfig = ssh myserver "sudo grep -E '^(AllowTcpForwarding|AllowAgentForwarding|PermitTunnel|GatewayPorts|X11Forwarding)' /etc/ssh/sshd_config 2>/dev/null; if [ `$? -ne 0 ]; then echo '未找到相关配置（使用默认值）'; fi"
    
    if ($sshConfig) {
        Write-Host "  当前配置:" -ForegroundColor Gray
        $sshConfig | ForEach-Object {
            if ($_ -match "AllowTcpForwarding\s+(yes|no)") {
                if ($matches[1] -eq "no") {
                    Write-Host "    [ERROR] AllowTcpForwarding = no" -ForegroundColor Red
                    Write-Host "      Cursor 需要端口转发功能！" -ForegroundColor Red
                } else {
                    Write-Host "    [OK] AllowTcpForwarding = yes" -ForegroundColor Green
                }
            }
            if ($_ -match "AllowAgentForwarding\s+(yes|no)") {
                Write-Host "    AllowAgentForwarding = $($matches[1])" -ForegroundColor $(if ($matches[1] -eq "yes") { "Green" } else { "Yellow" })
            }
            if ($_ -match "PermitTunnel\s+(yes|no)") {
                Write-Host "    PermitTunnel = $($matches[1])" -ForegroundColor Gray
            }
            if ($_ -match "GatewayPorts\s+(yes|no)") {
                Write-Host "    GatewayPorts = $($matches[1])" -ForegroundColor Gray
            }
            if ($_ -match "X11Forwarding\s+(yes|no)") {
                Write-Host "    X11Forwarding = $($matches[1])" -ForegroundColor Gray
            }
        }
        
        if ($sshConfig -notmatch "AllowTcpForwarding") {
            Write-Host "    [WARN] AllowTcpForwarding 未设置（默认值：yes）" -ForegroundColor Yellow
        }
    } else {
        Write-Host "    [INFO] 使用默认配置（通常允许端口转发）" -ForegroundColor Gray
    }
} catch {
    Write-Host "    [ERROR] 无法读取 SSH 配置: $_" -ForegroundColor Red
}
Write-Host ""

# 步骤 2: 测试端口转发功能
Write-Host "步骤 2: 测试端口转发功能..." -ForegroundColor Yellow
Write-Host "  尝试建立本地端口转发..." -ForegroundColor Gray
try {
    # 测试端口转发（后台运行，然后立即关闭）
    $testPort = 12345
    $forwardTest = Start-Job -ScriptBlock {
        param($hostName, $port)
        ssh -o ConnectTimeout=3 -o ExitOnForwardFailure=yes -N -L ${port}:localhost:22 myserver 2>&1
    } -ArgumentList "myserver", $testPort
    
    Start-Sleep -Seconds 2
    
    # 检查端口是否被占用（说明转发成功）
    $portCheck = Test-NetConnection -ComputerName localhost -Port $testPort -WarningAction SilentlyContinue -InformationLevel Quiet
    
    Stop-Job $forwardTest -ErrorAction SilentlyContinue | Out-Null
    Remove-Job $forwardTest -ErrorAction SilentlyContinue | Out-Null
    
    if ($portCheck) {
        Write-Host "    [OK] 端口转发功能正常" -ForegroundColor Green
    } else {
        Write-Host "    [WARN] 端口转发测试未成功" -ForegroundColor Yellow
        Write-Host "      这可能是正常的（测试端口可能被占用）" -ForegroundColor Gray
    }
} catch {
    Write-Host "    [WARN] 端口转发测试异常: $_" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 3: 检查 SSH 服务状态
Write-Host "步骤 3: 检查 SSH 服务状态..." -ForegroundColor Yellow
try {
    $sshStatus = ssh myserver "if systemctl is-active sshd 2>/dev/null; then systemctl is-active sshd; elif systemctl is-active ssh 2>/dev/null; then systemctl is-active ssh; else echo 'unknown'; fi"
    if ($sshStatus -match "active") {
        Write-Host "    [OK] SSH 服务正在运行" -ForegroundColor Green
    } else {
        Write-Host "    [WARN] SSH 服务状态: $sshStatus" -ForegroundColor Yellow
    }
} catch {
    Write-Host "    [WARN] 无法检查 SSH 服务状态" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 4: 检查 Cursor Server 进程
Write-Host "步骤 4: 检查 Cursor Server 进程..." -ForegroundColor Yellow
try {
    $cursorProcess = ssh myserver "ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep | head -3"
    if ($cursorProcess) {
        Write-Host "    [INFO] 找到 Cursor 相关进程:" -ForegroundColor Gray
        $cursorProcess | ForEach-Object {
            Write-Host "      $_" -ForegroundColor Gray
        }
    } else {
        Write-Host "    [INFO] 未找到 Cursor Server 进程（可能未连接或已断开）" -ForegroundColor Gray
    }
} catch {
    Write-Host "    [WARN] 无法检查进程状态" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 5: 检查服务器资源
Write-Host "步骤 5: 检查服务器资源..." -ForegroundColor Yellow
try {
    $resources = ssh myserver "echo '磁盘:'; df -h / | tail -1; echo '内存:'; free -h | grep Mem"
    Write-Host "    $resources" -ForegroundColor Gray
} catch {
    Write-Host "    [WARN] 无法检查服务器资源" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 6: 检查网络连接质量
Write-Host "步骤 6: 测试网络连接质量..." -ForegroundColor Yellow
try {
    $startTime = Get-Date
    $testResult = ssh -o ConnectTimeout=5 myserver "echo 'test'" 2>&1
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalMilliseconds
    
    if ($testResult -match "test") {
        Write-Host "    [OK] 网络连接正常" -ForegroundColor Green
        Write-Host "    响应时间: $([math]::Round($duration, 0)) ms" -ForegroundColor Gray
        if ($duration -gt 2000) {
            Write-Host "    [WARN] 响应时间较长，可能影响 Cursor 连接" -ForegroundColor Yellow
        }
    } else {
        Write-Host "    [ERROR] 网络连接测试失败" -ForegroundColor Red
    }
} catch {
    Write-Host "    [ERROR] 网络测试异常: $_" -ForegroundColor Red
}
Write-Host ""

# 总结和建议
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "诊断总结" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "如果 AllowTcpForwarding = no，需要修改服务器配置:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 在服务器上编辑 SSH 配置:" -ForegroundColor White
Write-Host "   sudo nano /etc/ssh/sshd_config" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 确保以下设置:" -ForegroundColor White
Write-Host "   AllowTcpForwarding yes" -ForegroundColor Gray
Write-Host "   AllowAgentForwarding yes" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 重启 SSH 服务:" -ForegroundColor White
Write-Host "   sudo systemctl restart sshd" -ForegroundColor Gray
Write-Host "   或" -ForegroundColor Gray
Write-Host "   sudo systemctl restart ssh" -ForegroundColor Gray
Write-Host ""

Write-Host "如果配置正常但 Cursor 仍无法连接，尝试:" -ForegroundColor Yellow
Write-Host "1. 清理服务器端 Cursor 进程和文件" -ForegroundColor White
Write-Host "2. 在 Cursor 中关闭并重新连接" -ForegroundColor White
Write-Host "3. 检查 Cursor 日志文件" -ForegroundColor White
Write-Host ""

