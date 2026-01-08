# 逐步诊断 WebSocket 1006 错误
# 按照 WebSocket1006错误详细分析.md 中的诊断清单逐步检查

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "WebSocket 1006 错误逐步诊断" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ========================================
# 🔴 高优先级检查 1: SSH 端口转发问题
# ========================================
Write-Host "【高优先级 1/3】检查 SSH 端口转发配置..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "1. 检查服务器端 SSH 配置..." -ForegroundColor Cyan
try {
    $sshConfig = ssh myserver "grep -E 'AllowTcpForwarding|GatewayPorts' /etc/ssh/sshd_config" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   服务器 SSH 配置:" -ForegroundColor Gray
        $sshConfig | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        
        # 检查 AllowTcpForwarding
        if ($sshConfig -match "AllowTcpForwarding\s+yes") {
            Write-Host "   ✓ AllowTcpForwarding 已启用" -ForegroundColor Green
        } elseif ($sshConfig -match "AllowTcpForwarding\s+no") {
            Write-Host "   ✗ AllowTcpForwarding 被禁用（需要修复）" -ForegroundColor Red
        } elseif ($sshConfig -notmatch "AllowTcpForwarding") {
            Write-Host "   ⚠ AllowTcpForwarding 未明确设置（默认启用）" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠ 无法读取 SSH 配置" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ 检查 SSH 配置时出错: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "2. 测试 SSH 连接和端口转发能力..." -ForegroundColor Cyan
try {
    # 使用 PowerShell 的 Select-String 替代 grep
    $sshVerbose = ssh -v myserver "echo 'test'" 2>&1 | Select-String -Pattern "forwarding|Forwarding" -CaseSensitive:$false
    if ($sshVerbose) {
        Write-Host "   SSH 详细输出（包含 forwarding）:" -ForegroundColor Gray
        $sshVerbose | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    } else {
        Write-Host "   ⚠ 未在 SSH 输出中找到端口转发相关信息" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠ 测试端口转发时出错: $_" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "3. 检查本地 SSH 配置..." -ForegroundColor Cyan
$localSshConfig = "$env:USERPROFILE\.ssh\config"
if (Test-Path $localSshConfig) {
    $configContent = Get-Content $localSshConfig -Raw
    if ($configContent -match "Host\s+myserver" -or $configContent -match "Host\s+\*") {
        Write-Host "   ✓ 找到 SSH 配置文件" -ForegroundColor Green
        $myserverConfig = Get-Content $localSshConfig | Select-String -Pattern "myserver" -Context 0,20
        if ($myserverConfig) {
            Write-Host "   myserver 配置:" -ForegroundColor Gray
            $myserverConfig | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        }
        
        # 检查关键配置项
        if ($configContent -match "ServerAliveInterval") {
            Write-Host "   ✓ ServerAliveInterval 已配置" -ForegroundColor Green
        } else {
            Write-Host "   ⚠ 建议添加 ServerAliveInterval 30" -ForegroundColor Yellow
        }
        
        if ($configContent -match "TCPKeepAlive") {
            Write-Host "   ✓ TCPKeepAlive 已配置" -ForegroundColor Green
        } else {
            Write-Host "   ⚠ 建议添加 TCPKeepAlive yes" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠ 未找到 myserver 的 SSH 配置" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠ SSH 配置文件不存在: $localSshConfig" -ForegroundColor Yellow
}
Write-Host ""

# ========================================
# 🔴 高优先级检查 2: 令牌文件问题
# ========================================
Write-Host "【高优先级 2/3】检查令牌文件..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "1. 检查令牌文件是否存在..." -ForegroundColor Cyan
try {
    $tokenFiles = ssh myserver "ls -la /run/user/0/cursor-remote-code.token.* 2>/dev/null" 2>&1
    if ($LASTEXITCODE -eq 0 -and $tokenFiles -and $tokenFiles.Trim() -ne "") {
        Write-Host "   ✓ 找到令牌文件:" -ForegroundColor Green
        $tokenFiles | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        
        # 统计令牌文件数量
        $tokenCount = ssh myserver "ls -1 /run/user/0/cursor-remote-code.token.* 2>/dev/null | wc -l" 2>&1
        if ($tokenCount -match "^\d+$") {
            $count = [int]$tokenCount.Trim()
            if ($count -gt 1) {
                Write-Host "   ⚠ 发现 $count 个令牌文件（可能存在多个连接冲突）" -ForegroundColor Yellow
            } else {
                Write-Host "   ✓ 只有 1 个令牌文件（正常）" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "   ✗ 未找到令牌文件（可能已被清理或连接未建立）" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ 检查令牌文件时出错: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "2. 检查令牌文件内容..." -ForegroundColor Cyan
try {
    $tokenContent = ssh myserver "cat /run/user/0/cursor-remote-code.token.* 2>/dev/null | head -1" 2>&1
    if ($LASTEXITCODE -eq 0 -and $tokenContent -and $tokenContent.Trim() -ne "") {
        $tokenLength = $tokenContent.Trim().Length
        Write-Host "   ✓ 令牌文件有内容（长度: $tokenLength 字符）" -ForegroundColor Green
        if ($tokenLength -lt 10) {
            Write-Host "   ⚠ 令牌内容过短，可能无效" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ✗ 令牌文件为空或无法读取" -ForegroundColor Red
    }
} catch {
    Write-Host "   ⚠ 无法读取令牌文件内容" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "3. 检查令牌文件权限..." -ForegroundColor Cyan
try {
    $tokenPerms = ssh myserver "stat -c '%a %U:%G' /run/user/0/cursor-remote-code.token.* 2>/dev/null | head -1" 2>&1
    if ($LASTEXITCODE -eq 0 -and $tokenPerms) {
        Write-Host "   令牌文件权限: $tokenPerms" -ForegroundColor Gray
        if ($tokenPerms -match "600|644") {
            Write-Host "   ✓ 权限看起来正常" -ForegroundColor Green
        } else {
            Write-Host "   ⚠ 权限可能不正确" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ⚠ 无法检查令牌文件权限" -ForegroundColor Yellow
}
Write-Host ""

# ========================================
# 🔴 高优先级检查 3: 进程状态异常
# ========================================
Write-Host "【高优先级 3/3】检查进程状态..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "1. 检查 Cursor Server 进程..." -ForegroundColor Cyan
try {
    $processes = ssh myserver "ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep" 2>&1
    if ($LASTEXITCODE -eq 0 -and $processes -and $processes.Trim() -ne "") {
        Write-Host "   发现以下进程:" -ForegroundColor Gray
        $processList = $processes -split "`n" | Where-Object { $_.Trim() -ne "" }
        $processCount = 0
        foreach ($proc in $processList) {
            $processCount++
            Write-Host "   进程 $processCount :" -ForegroundColor Gray
            Write-Host "   $proc" -ForegroundColor Gray
            
            # 检查进程状态（STAT 列）
            if ($proc -match "^\S+\s+\d+\s+(\S+)\s+") {
                $stat = $matches[1]
                if ($stat -match "Z") {
                    Write-Host "      ⚠ 警告: 进程可能是僵尸进程（Zombie）" -ForegroundColor Red
                } elseif ($stat -match "D") {
                    Write-Host "      ⚠ 警告: 进程可能处于不可中断睡眠状态（可能卡死）" -ForegroundColor Yellow
                } else {
                    Write-Host "      ✓ 进程状态正常" -ForegroundColor Green
                }
            }
        }
        Write-Host "   总计: $processCount 个进程" -ForegroundColor Gray
    } else {
        Write-Host "   ✗ 未发现运行中的 Cursor 进程" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ 检查进程时出错: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "2. 检查进程是否在监听端口..." -ForegroundColor Cyan
try {
    # 尝试使用 netstat
    $netstat = ssh myserver "netstat -tlnp 2>/dev/null | grep cursor" 2>&1
    if ($LASTEXITCODE -eq 0 -and $netstat -and $netstat.Trim() -ne "") {
        Write-Host "   ✓ 发现监听端口:" -ForegroundColor Green
        $netstat | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    } else {
        # 尝试使用 ss
        $ss = ssh myserver "ss -tlnp 2>/dev/null | grep cursor" 2>&1
        if ($LASTEXITCODE -eq 0 -and $ss -and $ss.Trim() -ne "") {
            Write-Host "   ✓ 发现监听端口（使用 ss）:" -ForegroundColor Green
            $ss | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        } else {
            Write-Host "   ⚠ 未发现 Cursor 进程监听的端口" -ForegroundColor Yellow
            Write-Host "     这可能表示进程存在但无法接受连接" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ⚠ 检查监听端口时出错: $_" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "3. 测试进程是否响应..." -ForegroundColor Cyan
try {
    $pidCheck = ssh myserver "PID=\$(pgrep -f cursor-server | head -1); if [ -n \"\$PID\" ]; then kill -0 \$PID 2>/dev/null && echo '进程响应' || echo '进程无响应'; else echo '未找到进程'; fi" 2>&1
    if ($pidCheck -match "进程响应") {
        Write-Host "   ✓ 进程响应正常" -ForegroundColor Green
    } elseif ($pidCheck -match "进程无响应") {
        Write-Host "   ✗ 进程无响应（可能卡死）" -ForegroundColor Red
    } else {
        Write-Host "   $pidCheck" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠ 测试进程响应时出错: $_" -ForegroundColor Yellow
}
Write-Host ""

# ========================================
# 🟡 中优先级检查 4: 网络延迟/超时
# ========================================
Write-Host "【中优先级 4/5】检查网络延迟和超时..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "1. 测试网络延迟（ping）..." -ForegroundColor Cyan
try {
    # 从 SSH 配置中获取服务器 IP（如果可能）
    $pingResult = ping -n 5 115.190.54.220 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Ping 结果:" -ForegroundColor Gray
        $pingLines = $pingResult | Select-String -Pattern "时间|time|平均|Average"
        if ($pingLines) {
            $pingLines | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        } else {
            Write-Host "   $pingResult" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ⚠ Ping 测试失败: $_" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "2. 测试 SSH 连接时间..." -ForegroundColor Cyan
try {
    $startTime = Get-Date
    $sshTest = ssh myserver "echo 'SSH连接测试'" 2>&1
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ SSH 连接成功" -ForegroundColor Green
        Write-Host "   连接耗时: $([math]::Round($duration, 2)) 秒" -ForegroundColor Gray
        if ($duration -gt 10) {
            Write-Host "   ⚠ 连接时间较长（>10秒），可能导致 WebSocket 超时" -ForegroundColor Yellow
        } elseif ($duration -gt 5) {
            Write-Host "   ⚠ 连接时间偏长（>5秒），建议优化网络" -ForegroundColor Yellow
        } else {
            Write-Host "   ✓ 连接时间正常" -ForegroundColor Green
        }
    } else {
        Write-Host "   ✗ SSH 连接失败" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ SSH 连接测试失败: $_" -ForegroundColor Red
}
Write-Host ""

# ========================================
# 🟡 中优先级检查 5: 多个连接冲突
# ========================================
Write-Host "【中优先级 5/5】检查多个连接冲突..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "1. 统计令牌文件数量..." -ForegroundColor Cyan
try {
    $tokenCount = ssh myserver "ls -1 /run/user/0/cursor-remote-code.token.* 2>/dev/null | wc -l" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $count = [int]($tokenCount.Trim() -replace '\D', '')
        if ($count -gt 1) {
            Write-Host "   ⚠ 发现 $count 个令牌文件（可能存在多个连接冲突）" -ForegroundColor Yellow
        } elseif ($count -eq 1) {
            Write-Host "   ✓ 只有 1 个令牌文件（正常）" -ForegroundColor Green
        } else {
            Write-Host "   ⚠ 没有令牌文件" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ⚠ 无法统计令牌文件" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "2. 检查临时文件和锁文件..." -ForegroundColor Cyan
try {
    $tempFiles = ssh myserver "find /tmp -name 'cursor-*' -o -name 'vscode-*' 2>/dev/null | wc -l" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $tempCount = [int]($tempFiles.Trim() -replace '\D', '')
        if ($tempCount -gt 0) {
            Write-Host "   ⚠ 发现 $tempCount 个临时文件" -ForegroundColor Yellow
        } else {
            Write-Host "   ✓ 没有临时文件残留" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "   ⚠ 无法检查临时文件" -ForegroundColor Yellow
}
Write-Host ""

# ========================================
# 🟢 低优先级检查 6: 防火墙规则
# ========================================
Write-Host "【低优先级 6/6】检查防火墙规则..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "1. 检查服务器防火墙状态..." -ForegroundColor Cyan
try {
    # 检查 ufw
    $ufwStatus = ssh myserver "ufw status verbose 2>/dev/null" 2>&1
    if ($LASTEXITCODE -eq 0 -and $ufwStatus -and $ufwStatus -notmatch "command not found") {
        Write-Host "   UFW 防火墙状态:" -ForegroundColor Gray
        $ufwStatus | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    } else {
        # 检查 iptables
        $iptables = ssh myserver "iptables -L -n 2>/dev/null | head -20" 2>&1
        if ($LASTEXITCODE -eq 0 -and $iptables) {
            Write-Host "   iptables 规则（前20行）:" -ForegroundColor Gray
            $iptables | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        } else {
            Write-Host "   ⚠ 无法检查防火墙状态" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ⚠ 检查防火墙时出错: $_" -ForegroundColor Yellow
}
Write-Host ""

# ========================================
# 总结和建议
# ========================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "诊断完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "根据诊断结果，建议的修复步骤：" -ForegroundColor Yellow
Write-Host ""
Write-Host "如果发现的问题：" -ForegroundColor White
Write-Host "  1. SSH 端口转发被禁用 → 运行修复脚本启用" -ForegroundColor Gray
Write-Host "  2. 令牌文件缺失或冲突 → 清理并重新连接" -ForegroundColor Gray
Write-Host "  3. 进程状态异常 → 清理进程并重新连接" -ForegroundColor Gray
Write-Host "  4. 网络延迟过高 → 优化 SSH 配置" -ForegroundColor Gray
Write-Host "  5. 多个连接冲突 → 清理所有残留文件" -ForegroundColor Gray
Write-Host ""

Write-Host "推荐的修复脚本：" -ForegroundColor White
Write-Host "  .\快速修复WebSocket1006.ps1        # 快速清理并修复" -ForegroundColor Cyan
Write-Host "  .\重新下载安装Cursor Server.ps1    # 完全重置" -ForegroundColor Cyan
Write-Host ""

