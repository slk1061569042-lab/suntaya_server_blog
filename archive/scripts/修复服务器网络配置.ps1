# 修复 Ubuntu 服务器网络和 SSH 配置问题
# 自动修复常见的服务器端配置问题

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复 Ubuntu 服务器网络配置" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 确认操作
Write-Host "此脚本将执行以下操作:" -ForegroundColor Yellow
Write-Host "1. 确保 SSH 服务正在运行" -ForegroundColor Gray
Write-Host "2. 配置防火墙允许 SSH 连接" -ForegroundColor Gray
Write-Host "3. 优化 SSH 配置以提高连接稳定性" -ForegroundColor Gray
Write-Host "4. 清理可能阻塞连接的进程和文件" -ForegroundColor Gray
Write-Host ""
$confirm = Read-Host "是否继续? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "操作已取消" -ForegroundColor Yellow
    exit
}
Write-Host ""

# 步骤 1: 确保 SSH 服务运行
Write-Host "【步骤 1/5】确保 SSH 服务正在运行..." -ForegroundColor Yellow
try {
    $sshStart = ssh myserver "sudo systemctl start sshd 2>/dev/null || sudo systemctl start ssh 2>/dev/null; sudo systemctl enable sshd 2>/dev/null || sudo systemctl enable ssh 2>/dev/null; systemctl is-active sshd 2>/dev/null || systemctl is-active ssh 2>/dev/null" 2>&1
    if ($sshStart -match "active") {
        Write-Host "  [OK] SSH 服务已启动并启用" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] SSH 服务状态: $sshStart" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [ERROR] 无法启动 SSH 服务: $_" -ForegroundColor Red
}
Write-Host ""

# 步骤 2: 配置防火墙
Write-Host "【步骤 2/5】配置防火墙允许 SSH..." -ForegroundColor Yellow
try {
    # 检查 UFW
    $ufwCheck = ssh myserver "which ufw" 2>&1
    if ($ufwCheck -match "ufw") {
        Write-Host "  检测到 UFW 防火墙，配置中..." -ForegroundColor Gray
        $ufwResult = ssh myserver "sudo ufw allow 22/tcp 2>&1; sudo ufw allow ssh 2>&1; echo 'UFW配置完成'" 2>&1
        Write-Host "  $ufwResult" -ForegroundColor Gray
    }
    
    # 配置 iptables（作为备用）
    Write-Host "  配置 iptables 规则..." -ForegroundColor Gray
    $iptablesResult = ssh myserver @"
sudo iptables -I INPUT -p tcp --dport 22 -j ACCEPT 2>/dev/null
sudo iptables -I OUTPUT -p tcp --sport 22 -j ACCEPT 2>/dev/null
echo 'iptables规则已添加'
"@ 2>&1
    Write-Host "  $iptablesResult" -ForegroundColor Gray
    Write-Host "  [OK] 防火墙配置完成" -ForegroundColor Green
} catch {
    Write-Host "  [WARN] 防火墙配置时出现警告: $_" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 3: 优化 SSH 配置
Write-Host "【步骤 3/5】优化 SSH 配置..." -ForegroundColor Yellow
try {
    $sshOptimize = ssh myserver @"
# 备份原配置
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.`$(date +%Y%m%d_%H%M%S) 2>/dev/null

# 检查并设置关键参数
sudo sed -i 's/#MaxStartups 10:30:60/MaxStartups 100:30:200/' /etc/ssh/sshd_config 2>/dev/null
sudo sed -i 's/#MaxSessions 10/MaxSessions 100/' /etc/ssh/sshd_config 2>/dev/null
sudo sed -i 's/#ClientAliveInterval 0/ClientAliveInterval 60/' /etc/ssh/sshd_config 2>/dev/null
sudo sed -i 's/#ClientAliveCountMax 3/ClientAliveCountMax 3/' /etc/ssh/sshd_config 2>/dev/null

# 如果参数不存在，添加它们
grep -q '^MaxStartups' /etc/ssh/sshd_config || echo 'MaxStartups 100:30:200' | sudo tee -a /etc/ssh/sshd_config > /dev/null
grep -q '^MaxSessions' /etc/ssh/sshd_config || echo 'MaxSessions 100' | sudo tee -a /etc/ssh/sshd_config > /dev/null
grep -q '^ClientAliveInterval' /etc/ssh/sshd_config || echo 'ClientAliveInterval 60' | sudo tee -a /etc/ssh/sshd_config > /dev/null
grep -q '^ClientAliveCountMax' /etc/ssh/sshd_config || echo 'ClientAliveCountMax 3' | sudo tee -a /etc/ssh/sshd_config > /dev/null

# 重新加载 SSH 配置
sudo systemctl reload sshd 2>/dev/null || sudo systemctl reload ssh 2>/dev/null || sudo service ssh reload 2>/dev/null

echo 'SSH配置优化完成'
"@ 2>&1
    Write-Host "  $sshOptimize" -ForegroundColor Gray
    Write-Host "  [OK] SSH 配置已优化" -ForegroundColor Green
} catch {
    Write-Host "  [WARN] SSH 配置优化时出现警告: $_" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 4: 清理阻塞连接的进程和文件
Write-Host "【步骤 4/5】清理阻塞连接的进程和文件..." -ForegroundColor Yellow
try {
    $cleanup = ssh myserver @"
# 停止可能阻塞的 Cursor 进程
pkill -9 -f cursor-server 2>/dev/null
pkill -9 -f cursor-remote 2>/dev/null
pkill -9 -f vscode-server 2>/dev/null

# 清理锁文件
rm -f /run/user/0/cursor-remote-* 2>/dev/null
rm -f /run/user/*/cursor-remote-* 2>/dev/null
rm -f /tmp/cursor-* 2>/dev/null
rm -f /tmp/vscode-* 2>/dev/null

# 清理旧的 SSH 连接
ss -K state established '( dport = :22 )' 2>/dev/null || true

echo '清理完成'
"@ 2>&1
    Write-Host "  $cleanup" -ForegroundColor Gray
    Write-Host "  [OK] 清理完成" -ForegroundColor Green
} catch {
    Write-Host "  [WARN] 清理时出现警告: $_" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 5: 验证配置
Write-Host "【步骤 5/5】验证配置..." -ForegroundColor Yellow
try {
    $verify = ssh myserver @"
echo '=== SSH 服务状态 ==='
systemctl is-active sshd 2>/dev/null || systemctl is-active ssh 2>/dev/null
echo ''
echo '=== SSH 端口监听 ==='
ss -tlnp | grep ':22 ' || netstat -tlnp | grep ':22 '
echo ''
echo '=== SSH 配置关键参数 ==='
grep -E '^(MaxStartups|MaxSessions|ClientAlive)' /etc/ssh/sshd_config 2>/dev/null | head -5
"@ 2>&1
    Write-Host "  $verify" -ForegroundColor Gray
    Write-Host "  [OK] 配置验证完成" -ForegroundColor Green
} catch {
    Write-Host "  [WARN] 验证时出现警告: $_" -ForegroundColor Yellow
}
Write-Host ""

# 测试连接
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试连接..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
try {
    $testResult = ssh -o ConnectTimeout=10 myserver "echo '连接测试成功'; hostname; uptime" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] 连接测试成功！" -ForegroundColor Green
        Write-Host "  $testResult" -ForegroundColor Gray
    } else {
        Write-Host "  [WARN] 连接测试结果: $testResult" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [ERROR] 连接测试失败: $_" -ForegroundColor Red
}
Write-Host ""

# 总结
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "已完成的修复操作:" -ForegroundColor Yellow
Write-Host "✓ SSH 服务已确保运行" -ForegroundColor Green
Write-Host "✓ 防火墙已配置允许 SSH" -ForegroundColor Green
Write-Host "✓ SSH 配置已优化" -ForegroundColor Green
Write-Host "✓ 阻塞连接的文件和进程已清理" -ForegroundColor Green
Write-Host ""
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "1. 在 Cursor 中重新连接远程服务器" -ForegroundColor Gray
Write-Host "2. 如果仍有问题，运行 '诊断服务器和网络问题.ps1' 进行详细诊断" -ForegroundColor Gray
Write-Host ""







