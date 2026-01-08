# SSH 连接简单测试脚本
# 全面诊断 SSH 连接问题

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SSH 连接诊断工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 SSH 配置
Write-Host "1. 检查 SSH 配置文件..." -ForegroundColor Yellow
$sshConfigPath = "$env:USERPROFILE\.ssh\config"
if (Test-Path $sshConfigPath) {
    Write-Host "   [OK] SSH 配置文件存在: $sshConfigPath" -ForegroundColor Green
    $configContent = Get-Content $sshConfigPath -Raw
    if ($configContent -match "Host\s+myserver") {
        Write-Host "   [OK] 找到 myserver 配置" -ForegroundColor Green
        
        # 提取配置信息
        if ($configContent -match "HostName\s+(\S+)") {
            $hostName = $matches[1]
            Write-Host "   服务器地址: $hostName" -ForegroundColor Gray
        }
        if ($configContent -match "User\s+(\S+)") {
            $user = $matches[1]
            Write-Host "   用户名: $user" -ForegroundColor Gray
        }
        if ($configContent -match "Port\s+(\d+)") {
            $port = $matches[1]
            Write-Host "   端口: $port" -ForegroundColor Gray
        } else {
            $port = "22"
            Write-Host "   端口: 22 (默认)" -ForegroundColor Gray
        }
        if ($configContent -match "IdentityFile\s+(\S+)") {
            $keyFile = $matches[1].Replace("~", $env:USERPROFILE)
            Write-Host "   密钥文件: $keyFile" -ForegroundColor Gray
        }
    } else {
        Write-Host "   [WARN] 未找到 myserver 配置" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [ERROR] SSH 配置文件不存在: $sshConfigPath" -ForegroundColor Red
}
Write-Host ""

# 检查 SSH 密钥
Write-Host "2. 检查 SSH 密钥文件..." -ForegroundColor Yellow
$sshDir = "$env:USERPROFILE\.ssh"
if (Test-Path $sshDir) {
    Write-Host "   [OK] .ssh 目录存在" -ForegroundColor Green
    
    $keyFiles = @("id_rsa", "id_ed25519", "id_ecdsa", "id_dsa")
    $foundKey = $false
    foreach ($key in $keyFiles) {
        $keyPath = Join-Path $sshDir $key
        if (Test-Path $keyPath) {
            Write-Host "   [OK] 找到密钥文件: $key" -ForegroundColor Green
            $foundKey = $true
            $keyInfo = Get-Item $keyPath
            Write-Host "   文件大小: $($keyInfo.Length) 字节" -ForegroundColor Gray
        }
    }
    
    if (-not $foundKey) {
        Write-Host "   [WARN] 未找到常见的 SSH 密钥文件" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [ERROR] .ssh 目录不存在" -ForegroundColor Red
}
Write-Host ""

# 测试网络连通性
Write-Host "3. 测试网络连通性..." -ForegroundColor Yellow
if ($hostName) {
    Write-Host "   正在 ping $hostName ..." -ForegroundColor Gray
    $pingResult = Test-Connection -ComputerName $hostName -Count 2 -Quiet -ErrorAction SilentlyContinue
    if ($pingResult) {
        Write-Host "   [OK] 网络连通正常" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] 无法 ping 通服务器" -ForegroundColor Red
    }
} else {
    Write-Host "   [WARN] 无法确定服务器地址，跳过网络测试" -ForegroundColor Yellow
}
Write-Host ""

# 测试 SSH 端口
Write-Host "4. 测试 SSH 端口连通性..." -ForegroundColor Yellow
if ($hostName -and $port) {
    Write-Host "   正在测试 $hostName`:$port ..." -ForegroundColor Gray
    $tcpClient = $null
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $connect = $tcpClient.BeginConnect($hostName, $port, $null, $null)
        $wait = $connect.AsyncWaitHandle.WaitOne(3000, $false)
        if ($wait) {
            $tcpClient.EndConnect($connect)
            Write-Host "   [OK] SSH 端口 ($port) 可访问" -ForegroundColor Green
        } else {
            Write-Host "   [ERROR] SSH 端口 ($port) 连接超时" -ForegroundColor Red
        }
    } catch {
        Write-Host "   [ERROR] 无法连接到 SSH 端口: $_" -ForegroundColor Red
    } finally {
        if ($tcpClient) {
            try { $tcpClient.Close() } catch {}
        }
    }
} else {
    Write-Host "   [WARN] 无法确定服务器地址或端口，跳过端口测试" -ForegroundColor Yellow
}
Write-Host ""

# 测试基本 SSH 连接
Write-Host "5. 测试基本 SSH 连接..." -ForegroundColor Yellow
$sshTest = ssh -o ConnectTimeout=5 -o BatchMode=yes -o StrictHostKeyChecking=no myserver "echo SSH连接成功" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   [OK] SSH 连接成功" -ForegroundColor Green
    Write-Host "   服务器响应: $sshTest" -ForegroundColor Gray
} else {
    Write-Host "   [ERROR] SSH 连接失败 (退出码: $LASTEXITCODE)" -ForegroundColor Red
    Write-Host "   错误信息:" -ForegroundColor Red
    $sshTest | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
    
    $errorStr = $sshTest -join " "
    if ($errorStr -match "Permission denied") {
        Write-Host ""
        Write-Host "   可能的原因:" -ForegroundColor Yellow
        Write-Host "   - SSH 密钥未正确配置" -ForegroundColor Gray
        Write-Host "   - 服务器上未添加公钥" -ForegroundColor Gray
    } elseif ($errorStr -match "Connection refused") {
        Write-Host ""
        Write-Host "   可能的原因:" -ForegroundColor Yellow
        Write-Host "   - SSH 服务未运行" -ForegroundColor Gray
        Write-Host "   - 端口号不正确" -ForegroundColor Gray
    } elseif ($errorStr -match "Connection timed out") {
        Write-Host ""
        Write-Host "   可能的原因:" -ForegroundColor Yellow
        Write-Host "   - 网络连接问题" -ForegroundColor Gray
        Write-Host "   - 服务器地址不正确" -ForegroundColor Gray
    }
}
Write-Host ""

# 测试详细 SSH 连接
Write-Host "6. 测试详细 SSH 连接（详细模式）..." -ForegroundColor Yellow
Write-Host "   执行命令: ssh -v myserver 'echo test'" -ForegroundColor Gray
Write-Host "   ----------------------------------------" -ForegroundColor DarkGray
$sshVerbose = ssh -v -o ConnectTimeout=5 myserver "echo test" 2>&1
$sshVerbose | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
Write-Host "   ----------------------------------------" -ForegroundColor DarkGray
Write-Host ""

# 总结
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "诊断总结" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "常用调试命令:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 手动测试 SSH 连接:" -ForegroundColor White
Write-Host "   ssh -v myserver" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 测试连接并执行命令:" -ForegroundColor White
Write-Host "   ssh myserver 'whoami && hostname'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 查看详细的 SSH 连接日志:" -ForegroundColor White
Write-Host "   ssh -vvv myserver" -ForegroundColor Gray
Write-Host ""

