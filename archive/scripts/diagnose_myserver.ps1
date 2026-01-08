# myserver SSH 连接诊断脚本
# 逐步测试 SSH 连接问题

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "myserver SSH 连接诊断" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 检查 SSH 配置
Write-Host "步骤 1: 检查 SSH 配置..." -ForegroundColor Yellow
$sshConfigPath = "$env:USERPROFILE\.ssh\config"
if (Test-Path $sshConfigPath) {
    Write-Host "  [OK] SSH 配置文件存在" -ForegroundColor Green
    $configContent = Get-Content $sshConfigPath -Raw
    if ($configContent -match "Host\s+myserver") {
        Write-Host "  [OK] 找到 myserver 配置" -ForegroundColor Green
        
        if ($configContent -match "(?s)Host\s+myserver\s+(.*?)(?=Host|\z)") {
            $myserverConfig = $matches[1]
            if ($myserverConfig -match "HostName\s+(\S+)") {
                $hostName = $matches[1]
                Write-Host "  服务器地址: $hostName" -ForegroundColor Gray
            }
            if ($myserverConfig -match "User\s+(\S+)") {
                $user = $matches[1]
                Write-Host "  用户名: $user" -ForegroundColor Gray
            }
            if ($myserverConfig -match "Port\s+(\d+)") {
                $port = [int]$matches[1]
                Write-Host "  端口: $port" -ForegroundColor Gray
            } else {
                $port = 22
                Write-Host "  端口: 22 (默认)" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host "  [ERROR] 未找到 myserver 配置" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  [ERROR] SSH 配置文件不存在" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 步骤 2: 检查 SSH 密钥
Write-Host "步骤 2: 检查 SSH 密钥文件..." -ForegroundColor Yellow
$keyPath = "$env:USERPROFILE\.ssh\id_rsa"
if (Test-Path $keyPath) {
    Write-Host "  [OK] 找到私钥文件" -ForegroundColor Green
    $keyInfo = Get-Item $keyPath
    Write-Host "  文件大小: $($keyInfo.Length) 字节" -ForegroundColor Gray
} else {
    Write-Host "  [ERROR] 未找到私钥文件: $keyPath" -ForegroundColor Red
}
Write-Host ""

# 步骤 3: 测试网络连通性
Write-Host "步骤 3: 测试网络连通性 (ping $hostName)..." -ForegroundColor Yellow
try {
    $pingResult = Test-Connection -ComputerName $hostName -Count 2 -Quiet -ErrorAction Stop
    if ($pingResult) {
        Write-Host "  [OK] 网络连通正常" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] 无法 ping 通服务器" -ForegroundColor Yellow
        Write-Host "  注意: 某些服务器可能禁用了 ICMP，这不影响 SSH 连接" -ForegroundColor Gray
    }
} catch {
    Write-Host "  [WARN] Ping 测试失败: $_" -ForegroundColor Yellow
    Write-Host "  注意: 某些服务器可能禁用了 ICMP，这不影响 SSH 连接" -ForegroundColor Gray
}
Write-Host ""

# 步骤 4: 测试 SSH 端口连通性
Write-Host "步骤 4: 测试 SSH 端口连通性 ($hostName`:$port)..." -ForegroundColor Yellow
$tcpClient = $null
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connect = $tcpClient.BeginConnect($hostName, $port, $null, $null)
    $wait = $connect.AsyncWaitHandle.WaitOne(5000, $false)
    if ($wait) {
        $tcpClient.EndConnect($connect)
        Write-Host "  [OK] SSH 端口 ($port) 可访问" -ForegroundColor Green
    } else {
        Write-Host "  [ERROR] SSH 端口 ($port) 连接超时" -ForegroundColor Red
        Write-Host "  可能原因:" -ForegroundColor Yellow
        Write-Host "  - 服务器 SSH 服务未运行" -ForegroundColor Gray
        Write-Host "  - 防火墙阻止了连接" -ForegroundColor Gray
        Write-Host "  - 端口号不正确" -ForegroundColor Gray
    }
} catch {
    Write-Host "  [ERROR] 无法连接到 SSH 端口: $_" -ForegroundColor Red
} finally {
    if ($tcpClient) {
        try { $tcpClient.Close() } catch {}
    }
}
Write-Host ""

# 步骤 5: 测试基本 SSH 连接（无交互模式）
Write-Host "步骤 5: 测试基本 SSH 连接（无交互模式）..." -ForegroundColor Yellow
Write-Host "  执行命令: ssh -o ConnectTimeout=5 -o BatchMode=yes myserver 'echo test'" -ForegroundColor Gray
try {
    $sshTest = ssh -o ConnectTimeout=5 -o BatchMode=yes -o StrictHostKeyChecking=no myserver 'echo SSH连接测试成功' 2>&1
    $exitCode = $LASTEXITCODE
    if ($exitCode -eq 0) {
        Write-Host "  [OK] SSH 连接成功！" -ForegroundColor Green
        Write-Host "  服务器响应: $sshTest" -ForegroundColor Gray
    } else {
        Write-Host "  [ERROR] SSH 连接失败 (退出码: $exitCode)" -ForegroundColor Red
        Write-Host "  错误信息:" -ForegroundColor Red
        $sshTest | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
        
        # 分析常见错误
        $errorStr = $sshTest -join " "
        Write-Host ""
        Write-Host "  可能的原因:" -ForegroundColor Yellow
        if ($errorStr -match "Permission denied") {
            Write-Host "  - SSH 密钥认证失败" -ForegroundColor Gray
            Write-Host "  - 服务器上未添加您的公钥" -ForegroundColor Gray
            Write-Host "  - 密钥文件权限不正确" -ForegroundColor Gray
            Write-Host ""
            Write-Host "  解决方案:" -ForegroundColor Cyan
            Write-Host "  1. 检查服务器上的 ~/.ssh/authorized_keys 文件" -ForegroundColor White
            Write-Host "  2. 确认您的公钥已添加到 authorized_keys" -ForegroundColor White
            Write-Host "  3. 检查 authorized_keys 文件权限 (应该是 600)" -ForegroundColor White
        } elseif ($errorStr -match "Connection refused") {
            Write-Host "  - SSH 服务未运行" -ForegroundColor Gray
            Write-Host "  - 端口号不正确" -ForegroundColor Gray
            Write-Host "  - 防火墙阻止连接" -ForegroundColor Gray
            Write-Host ""
            Write-Host "  解决方案:" -ForegroundColor Cyan
            Write-Host "  1. 在服务器上检查 SSH 服务: sudo systemctl status ssh" -ForegroundColor White
            Write-Host "  2. 启动 SSH 服务: sudo systemctl start ssh" -ForegroundColor White
            Write-Host "  3. 检查防火墙设置" -ForegroundColor White
        } elseif ($errorStr -match "Connection timed out" -or $errorStr -match "Connection timeout") {
            Write-Host "  - 网络连接问题" -ForegroundColor Gray
            Write-Host "  - 服务器地址不正确" -ForegroundColor Gray
            Write-Host "  - 防火墙阻止连接" -ForegroundColor Gray
            Write-Host ""
            Write-Host "  解决方案:" -ForegroundColor Cyan
            Write-Host "  1. 确认服务器地址是否正确" -ForegroundColor White
            Write-Host "  2. 检查网络连接" -ForegroundColor White
            Write-Host "  3. 检查服务器防火墙和安全组设置" -ForegroundColor White
        } elseif ($errorStr -match "Host key verification failed") {
            Write-Host "  - 服务器密钥已更改" -ForegroundColor Gray
            Write-Host "  - 需要更新 known_hosts 文件" -ForegroundColor Gray
            Write-Host ""
            Write-Host "  解决方案:" -ForegroundColor Cyan
            Write-Host "  ssh-keygen -R $hostName" -ForegroundColor White
        } else {
            Write-Host "  - 请查看上面的详细错误信息" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "  [ERROR] SSH 测试异常: $_" -ForegroundColor Red
}
Write-Host ""

# 步骤 6: 测试详细 SSH 连接（带详细输出）
Write-Host "步骤 6: 测试详细 SSH 连接（详细模式 -v）..." -ForegroundColor Yellow
Write-Host "  这将显示详细的连接过程信息" -ForegroundColor Gray
Write-Host "  ----------------------------------------" -ForegroundColor DarkGray
try {
    $sshVerbose = ssh -v -o ConnectTimeout=5 -o StrictHostKeyChecking=no myserver 'echo test' 2>&1
    $sshVerbose | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
} catch {
    Write-Host "  测试异常: $_" -ForegroundColor Red
}
Write-Host "  ----------------------------------------" -ForegroundColor DarkGray
Write-Host ""

# 总结
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "诊断完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "如果连接失败，请根据上面的错误信息进行排查。" -ForegroundColor Yellow
Write-Host ""
Write-Host "常用调试命令:" -ForegroundColor Yellow
Write-Host "  1. 手动测试: ssh -v myserver" -ForegroundColor White
Write-Host "  2. 超详细模式: ssh -vvv myserver" -ForegroundColor White
Write-Host "  3. 检查配置: ssh -F $sshConfigPath -G myserver" -ForegroundColor White
Write-Host ""

