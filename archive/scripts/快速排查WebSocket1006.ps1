# 快速排查 WebSocket 1006 错误
# 主要检查 Windows 防火墙对 SSH 的限制

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WebSocket 1006 错误快速排查工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查管理员权限
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  提示: 某些操作需要管理员权限" -ForegroundColor Yellow
    Write-Host ""
}

# ============================================
# 第一步：检查 Windows 防火墙
# ============================================
Write-Host "【第一步】检查 Windows 防火墙对 SSH 的限制" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

$sshRules = Get-NetFirewallRule | Where-Object {
    $_.DisplayName -like "*SSH*" -or 
    $_.DisplayName -like "*OpenSSH*" -or
    $_.Program -like "*ssh.exe*"
}

if ($sshRules.Count -eq 0) {
    Write-Host "🔴 问题确认: 未找到 SSH 防火墙规则" -ForegroundColor Red
    Write-Host "   说明: Windows 防火墙可能阻止了 SSH 的本地端口转发" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   解决方案:" -ForegroundColor Cyan
    Write-Host "   1. 按 Win+R，输入 firewall.cpl，回车" -ForegroundColor White
    Write-Host "   2. 点击'允许应用或功能通过 Windows Defender 防火墙'" -ForegroundColor White
    Write-Host "   3. 找到并勾选 'OpenSSH SSH Client'（勾选'专用'和'公用'）" -ForegroundColor White
    Write-Host "   4. 点击'确定'，然后重新尝试连接" -ForegroundColor White
    Write-Host ""
    $firewallIssue = $true
} else {
    Write-Host "✅ 找到 $($sshRules.Count) 条 SSH 相关防火墙规则" -ForegroundColor Green
    Write-Host ""
    
    $hasIssue = $false
    foreach ($rule in $sshRules) {
        $status = if ($rule.Enabled) { "✅ 启用" } else { "❌ 禁用" }
        $action = if ($rule.Action -eq "Allow") { "✅ 允许" } else { "❌ 阻止" }
        $direction = $rule.Direction
        
        Write-Host "   规则: $($rule.DisplayName)" -ForegroundColor White
        Write-Host "   状态: $status | 动作: $action | 方向: $direction" -ForegroundColor $(if ($rule.Enabled -and $rule.Action -eq "Allow") { "Green" } else { "Red" })
        
        if (-not $rule.Enabled -or $rule.Action -ne "Allow") {
            $hasIssue = $true
        }
        Write-Host ""
    }
    
    if ($hasIssue) {
        Write-Host "🔴 问题确认: 部分 SSH 防火墙规则被禁用或阻止" -ForegroundColor Red
        Write-Host "   建议: 启用所有 SSH 相关规则，并确保动作为'允许'" -ForegroundColor Yellow
        Write-Host ""
        $firewallIssue = $true
    } else {
        Write-Host "✅ Windows 防火墙配置正常" -ForegroundColor Green
        Write-Host ""
        $firewallIssue = $false
    }
}

# ============================================
# 第二步：检查本地 SSH 配置
# ============================================
Write-Host "【第二步】检查本地 SSH 配置" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

$sshConfigPath = "$env:USERPROFILE\.ssh\config"
if (Test-Path $sshConfigPath) {
    Write-Host "✅ 找到 SSH 配置文件: $sshConfigPath" -ForegroundColor Green
    $configContent = Get-Content $sshConfigPath -Raw
    
    $checks = @{
        "ServerAliveInterval" = $configContent -match "ServerAliveInterval"
        "ServerAliveCountMax" = $configContent -match "ServerAliveCountMax"
        "TCPKeepAlive" = $configContent -match "TCPKeepAlive"
    }
    
    Write-Host ""
    foreach ($check in $checks.GetEnumerator()) {
        if ($check.Value) {
            Write-Host "   ✅ $($check.Key): 已配置" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $($check.Key): 未配置（可选，但建议配置）" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "⚠️  未找到 SSH 配置文件（可选）" -ForegroundColor Yellow
    Write-Host "   建议创建 ~/.ssh/config 并配置连接保活参数" -ForegroundColor White
}
Write-Host ""

# ============================================
# 第三步：测试 SSH 连接
# ============================================
Write-Host "【第三步】测试 SSH 连接（需要配置 SSH Host）" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

$testHost = Read-Host "请输入要测试的 SSH Host 名称（如 myserver，直接回车跳过）"
if ($testHost) {
    Write-Host "正在测试 SSH 连接到 $testHost ..." -ForegroundColor White
    try {
        $result = ssh -o ConnectTimeout=5 $testHost "echo 'SSH连接测试成功'" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ SSH 连接正常" -ForegroundColor Green
        } else {
            Write-Host "❌ SSH 连接失败" -ForegroundColor Red
            Write-Host "   输出: $result" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ SSH 连接测试出错: $_" -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  跳过 SSH 连接测试" -ForegroundColor Gray
}
Write-Host ""

# ============================================
# 诊断结论
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  诊断结论" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($firewallIssue) {
    Write-Host "🔴 主要问题: Windows 防火墙阻止了 SSH 本地端口转发" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 解决步骤:" -ForegroundColor Cyan
    Write-Host "   1. 打开 Windows 防火墙设置（Win+R → firewall.cpl）" -ForegroundColor White
    Write-Host "   2. 点击'允许应用或功能通过 Windows Defender 防火墙'" -ForegroundColor White
    Write-Host "   3. 找到 'OpenSSH SSH Client' 并勾选'专用'和'公用'" -ForegroundColor White
    Write-Host "   4. 点击'确定'" -ForegroundColor White
    Write-Host "   5. 重新尝试 Cursor 连接" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 或者使用 PowerShell（需要管理员权限）:" -ForegroundColor Cyan
    Write-Host '   New-NetFirewallRule -DisplayName "SSH Client - Allow Outbound" -Direction Outbound -Program "$env:ProgramFiles\OpenSSH\ssh.exe" -Action Allow -Profile Any' -ForegroundColor Gray
} else {
    Write-Host "✅ Windows 防火墙配置正常" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 如果问题仍然存在，请尝试:" -ForegroundColor Cyan
    Write-Host "   1. 清理服务器端进程: ssh myserver 'pkill -9 -f cursor-server'" -ForegroundColor White
    Write-Host "   2. 在 Cursor 中关闭并重新建立连接" -ForegroundColor White
    Write-Host "   3. 检查服务器端 SSH 配置（AllowTcpForwarding）" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "排查完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
