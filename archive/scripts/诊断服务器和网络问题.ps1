# 全面诊断 Ubuntu 服务器和网络配置问题
# 用于排查 Cursor Remote SSH 连接失败的根本原因

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ubuntu 服务器和网络配置诊断工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 SSH 配置
Write-Host "【1/10】检查 SSH 配置..." -ForegroundColor Yellow
try {
    $sshConfig = Get-Content "$env:USERPROFILE\.ssh\config" -ErrorAction SilentlyContinue
    if ($sshConfig) {
        $myserverConfig = $sshConfig | Select-String -Pattern "Host myserver" -Context 0, 10
        if ($myserverConfig) {
            Write-Host "  [OK] SSH 配置文件中找到 myserver 配置" -ForegroundColor Green
            Write-Host "  $($myserverConfig.Context.PostContext -join "`n  ")" -ForegroundColor Gray
        } else {
            Write-Host "  [WARN] SSH 配置文件中未找到 myserver 配置" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  [WARN] 未找到 SSH 配置文件" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [ERROR] 无法读取 SSH 配置: $_" -ForegroundColor Red
}
Write-Host ""

# 测试基本 SSH 连接
Write-Host "【2/10】测试基本 SSH 连接..." -ForegroundColor Yellow
try {
    $sshTest = ssh -o ConnectTimeout=10 -o BatchMode=yes myserver "echo 'SSH连接成功'; exit 0" 2>&1
    if ($LASTEXITCODE -eq 0 -or $sshTest -match "SSH连接成功") {
        Write-Host "  [OK] SSH 基本连接正常" -ForegroundColor Green
    } else {
        Write-Host "  [ERROR] SSH 连接失败" -ForegroundColor Red
        Write-Host "  错误信息: $sshTest" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] SSH 连接异常: $_" -ForegroundColor Red
}
Write-Host ""

# 检查服务器 SSH 服务状态
Write-Host "【3/10】检查服务器 SSH 服务状态..." -ForegroundColor Yellow
try {
    $sshService = ssh myserver "systemctl status sshd 2>/dev/null | head -3 || systemctl status ssh 2>/dev/null | head -3 || service ssh status 2>/dev/null | head -3" 2>&1
    Write-Host "  $sshService" -ForegroundColor Gray
} catch {
    Write-Host "  [WARN] 无法检查 SSH 服务状态" -ForegroundColor Yellow
}
Write-Host ""

# 检查服务器防火墙状态
Write-Host "【4/10】检查服务器防火墙配置..." -ForegroundColor Yellow
try {
    Write-Host "  检查 UFW 防火墙:" -ForegroundColor Gray
    $ufwStatus = ssh myserver "ufw status 2>/dev/null | head -5" 2>&1
    Write-Host "  $ufwStatus" -ForegroundColor Gray
    
    Write-Host "  检查 iptables 规则:" -ForegroundColor Gray
    $iptables = ssh myserver "iptables -L -n 2>/dev/null | head -10" 2>&1
    Write-Host "  $iptables" -ForegroundColor Gray
    
    Write-Host "  检查 SSH 端口 (22) 是否开放:" -ForegroundColor Gray
    $port22 = ssh myserver "netstat -tlnp 2>/dev/null | grep ':22 ' || ss -tlnp 2>/dev/null | grep ':22 '" 2>&1
    if ($port22) {
        Write-Host "  [OK] SSH 端口 22 正在监听" -ForegroundColor Green
        Write-Host "  $port22" -ForegroundColor Gray
    } else {
        Write-Host "  [WARN] 未检测到 SSH 端口 22 监听" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [WARN] 无法检查防火墙配置" -ForegroundColor Yellow
}
Write-Host ""

# 检查网络连通性
Write-Host "【5/10】检查网络连通性..." -ForegroundColor Yellow
try {
    # 获取服务器 IP
    $serverIP = ssh myserver "hostname -I | awk '{print `$1}'" 2>&1
    if ($serverIP) {
        Write-Host "  服务器 IP: $serverIP" -ForegroundColor Gray
        
        # Ping 测试
        Write-Host "  执行 Ping 测试 (4次):" -ForegroundColor Gray
        $pingResult = ping -n 4 $serverIP.Trim() 2>&1
        $pingSuccess = $pingResult | Select-String -Pattern "TTL|time="
        if ($pingSuccess) {
            Write-Host "  [OK] Ping 测试成功" -ForegroundColor Green
        } else {
            Write-Host "  [WARN] Ping 测试失败或超时" -ForegroundColor Yellow
        }
        
        # 测试端口连通性
        Write-Host "  测试 SSH 端口 (22) 连通性:" -ForegroundColor Gray
        $tcpTest = Test-NetConnection -ComputerName $serverIP.Trim() -Port 22 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        if ($tcpTest.TcpTestSucceeded) {
            Write-Host "  [OK] 端口 22 可达" -ForegroundColor Green
        } else {
            Write-Host "  [ERROR] 端口 22 不可达" -ForegroundColor Red
            Write-Host "  这可能表示防火墙阻止了连接" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "  [WARN] 无法检查网络连通性: $_" -ForegroundColor Yellow
}
Write-Host ""

# 检查服务器系统资源
Write-Host "【6/10】检查服务器系统资源..." -ForegroundColor Yellow
try {
    $resources = ssh myserver @"
echo "=== 磁盘空间 ==="
df -h / | tail -1
echo ""
echo "=== 内存使用 ==="
free -h | grep Mem
echo ""
echo "=== CPU 负载 ==="
uptime
echo ""
echo "=== 系统负载 ==="
cat /proc/loadavg
"@ 2>&1
    Write-Host "  $resources" -ForegroundColor Gray
    
    # 检查磁盘空间是否充足
    $diskInfo = ssh myserver "df -h / | tail -1 | awk '{print `$5}' | sed 's/%//'" 2>&1
    if ($diskInfo -match '^\d+$') {
        $diskUsage = [int]$diskInfo
        if ($diskUsage -gt 90) {
            Write-Host "  [ERROR] 磁盘使用率过高 ($diskUsage%)，可能影响连接" -ForegroundColor Red
        } elseif ($diskUsage -gt 80) {
            Write-Host "  [WARN] 磁盘使用率较高 ($diskUsage%)" -ForegroundColor Yellow
        } else {
            Write-Host "  [OK] 磁盘空间充足 ($diskUsage%)" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "  [WARN] 无法检查服务器资源" -ForegroundColor Yellow
}
Write-Host ""

# 检查服务器 SSH 配置
Write-Host "【7/10】检查服务器 SSH 配置..." -ForegroundColor Yellow
try {
    $serverSSHConfig = ssh myserver @"
echo "=== SSH 配置文件权限 ==="
ls -la /etc/ssh/sshd_config 2>/dev/null
echo ""
echo "=== SSH 服务监听地址 ==="
ss -tlnp | grep ':22 ' || netstat -tlnp | grep ':22 '
echo ""
echo "=== SSH 配置关键设置 ==="
grep -E '^(Port|PermitRootLogin|PasswordAuthentication|PubkeyAuthentication|MaxStartups|MaxSessions)' /etc/ssh/sshd_config 2>/dev/null | head -10
"@ 2>&1
    Write-Host "  $serverSSHConfig" -ForegroundColor Gray
} catch {
    Write-Host "  [WARN] 无法检查服务器 SSH 配置" -ForegroundColor Yellow
}
Write-Host ""

# 检查服务器网络配置
Write-Host "【8/10】检查服务器网络配置..." -ForegroundColor Yellow
try {
    $networkConfig = ssh myserver @"
echo "=== 网络接口 ==="
ip addr show | grep -E '^[0-9]+:|inet ' | head -10
echo ""
echo "=== 路由表 ==="
ip route | head -5
echo ""
echo "=== DNS 配置 ==="
cat /etc/resolv.conf 2>/dev/null | head -5
echo ""
echo "=== 网络连接统计 ==="
ss -s 2>/dev/null | head -10
"@ 2>&1
    Write-Host "  $networkConfig" -ForegroundColor Gray
} catch {
    Write-Host "  [WARN] 无法检查网络配置" -ForegroundColor Yellow
}
Write-Host ""

# 检查服务器日志中的错误
Write-Host "【9/10】检查服务器系统日志..." -ForegroundColor Yellow
try {
    $syslog = ssh myserver @"
echo "=== SSH 相关错误日志 (最近10条) ==="
journalctl -u ssh -n 10 --no-pager 2>/dev/null | tail -10 || tail -20 /var/log/auth.log 2>/dev/null | grep -i ssh | tail -10
echo ""
echo "=== 系统错误日志 (最近5条) ==="
journalctl -p err -n 5 --no-pager 2>/dev/null | tail -5 || tail -10 /var/log/syslog 2>/dev/null | grep -i error | tail -5
"@ 2>&1
    Write-Host "  $syslog" -ForegroundColor Gray
} catch {
    Write-Host "  [WARN] 无法检查系统日志" -ForegroundColor Yellow
}
Write-Host ""

# 检查 Cursor Server 相关进程和端口
Write-Host "【10/10】检查 Cursor Server 状态..." -ForegroundColor Yellow
try {
    $cursorStatus = ssh myserver @"
echo "=== Cursor 相关进程 ==="
ps aux | grep -E 'cursor|vscode' | grep -v grep || echo "未找到相关进程"
echo ""
echo "=== Cursor Server 目录 ==="
if [ -d ~/.cursor-server ]; then
    echo "目录存在"
    ls -la ~/.cursor-server/bin/ 2>/dev/null | head -5
else
    echo "目录不存在"
fi
echo ""
echo "=== 可能的 Cursor 端口 ==="
ss -tlnp 2>/dev/null | grep -E '(40237|36599|4[0-9]{4})' || netstat -tlnp 2>/dev/null | grep -E '(40237|36599|4[0-9]{4})' || echo "未找到相关端口"
echo ""
echo "=== 锁文件和临时文件 ==="
ls -la /run/user/0/cursor-remote-* 2>/dev/null | head -5 || echo "未找到锁文件"
ls -la /tmp/cursor-* /tmp/vscode-* 2>/dev/null | head -5 || echo "未找到临时文件"
"@ 2>&1
    Write-Host "  $cursorStatus" -ForegroundColor Gray
} catch {
    Write-Host "  [WARN] 无法检查 Cursor Server 状态" -ForegroundColor Yellow
}
Write-Host ""

# 总结和建议
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "诊断完成 - 问题分析和建议" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "常见问题及解决方案:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 防火墙阻止连接" -ForegroundColor White
Write-Host "   解决方案: ssh myserver 'sudo ufw allow 22/tcp' 或 'sudo iptables -I INPUT -p tcp --dport 22 -j ACCEPT'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. SSH 服务未运行" -ForegroundColor White
Write-Host "   解决方案: ssh myserver 'sudo systemctl start sshd' 或 'sudo systemctl start ssh'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 磁盘空间不足" -ForegroundColor White
Write-Host "   解决方案: ssh myserver 'sudo apt clean && sudo apt autoremove -y'" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 网络连接不稳定" -ForegroundColor White
Write-Host "   解决方案: 检查网络延迟，考虑使用 VPN 或更换网络" -ForegroundColor Gray
Write-Host ""
Write-Host "5. SSH 配置限制" -ForegroundColor White
Write-Host "   解决方案: 检查 /etc/ssh/sshd_config 中的 MaxStartups 和 MaxSessions 设置" -ForegroundColor Gray
Write-Host ""
Write-Host "6. 端口被占用" -ForegroundColor White
Write-Host "   解决方案: 检查是否有其他进程占用 SSH 端口" -ForegroundColor Gray
Write-Host ""

Write-Host "下一步操作:" -ForegroundColor Yellow
Write-Host "1. 根据上述诊断结果，修复发现的问题" -ForegroundColor Gray
Write-Host "2. 重新运行此脚本验证修复效果" -ForegroundColor Gray
Write-Host "3. 如果问题仍然存在，请查看详细的错误日志" -ForegroundColor Gray
Write-Host ""







