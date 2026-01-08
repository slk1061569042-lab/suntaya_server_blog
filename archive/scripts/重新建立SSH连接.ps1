# 重新建立 SSH 连接 - 逐步指导脚本
# 此脚本将引导您完成从生成密钥到建立连接的完整流程

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "重新建立 SSH 连接 - 逐步指导" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# 步骤 1: 生成 SSH 密钥
# ============================================
Write-Host "【步骤 1/5】生成 SSH 密钥" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

$privateKeyPath = "$env:USERPROFILE\.ssh\id_rsa"
$publicKeyPath = "$env:USERPROFILE\.ssh\id_rsa.pub"

# 检查是否已存在密钥
if (Test-Path $privateKeyPath) {
    Write-Host "  ⚠ 检测到已存在的 SSH 密钥" -ForegroundColor Yellow
    $useExisting = Read-Host "  是否使用现有密钥? (Y/N，默认N)"
    
    if ($useExisting -ne "Y" -and $useExisting -ne "y") {
        Write-Host "  请先运行清理脚本删除旧密钥，或手动删除以下文件:" -ForegroundColor Yellow
        Write-Host "    - $privateKeyPath" -ForegroundColor White
        Write-Host "    - $publicKeyPath" -ForegroundColor White
        exit 1
    } else {
        Write-Host "  ✓ 使用现有密钥" -ForegroundColor Green
    }
} else {
    Write-Host "  需要生成新的 SSH 密钥" -ForegroundColor Cyan
    Write-Host ""
    
    # 获取用户邮箱（用于密钥注释）
    $email = Read-Host "  请输入您的邮箱地址（用于密钥注释，可选）"
    if ([string]::IsNullOrWhiteSpace($email)) {
        $email = "$env:USERNAME@$(hostname)"
    }
    
    Write-Host ""
    Write-Host "  正在生成 SSH 密钥..." -ForegroundColor Cyan
    
    # 确保 .ssh 目录存在
    $sshDir = "$env:USERPROFILE\.ssh"
    if (-not (Test-Path $sshDir)) {
        New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
        Write-Host "  ✓ 已创建 .ssh 目录" -ForegroundColor Green
    }
    
    # 生成密钥（使用 ssh-keygen）
    $keygenCommand = "ssh-keygen -t rsa -b 4096 -C `"$email`" -f `"$privateKeyPath`" -N '""'"
    
    try {
        Invoke-Expression $keygenCommand
        Write-Host "  ✓ SSH 密钥生成成功！" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ 密钥生成失败: $_" -ForegroundColor Red
        Write-Host "  请手动运行: ssh-keygen -t rsa -b 4096 -C `"$email`"" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "  公钥位置: $publicKeyPath" -ForegroundColor Cyan
Write-Host "  私钥位置: $privateKeyPath" -ForegroundColor Cyan
Write-Host ""

# 显示公钥内容
if (Test-Path $publicKeyPath) {
    Write-Host "  公钥内容:" -ForegroundColor Cyan
    Write-Host "  ----------------------------------------" -ForegroundColor Gray
    $publicKey = Get-Content $publicKeyPath
    Write-Host "  $publicKey" -ForegroundColor White
    Write-Host "  ----------------------------------------" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  ⚠ 请复制上面的公钥内容，稍后需要添加到服务器" -ForegroundColor Yellow
    Write-Host ""
    
    # 询问是否复制到剪贴板
    $copyToClipboard = Read-Host "  是否将公钥复制到剪贴板? (Y/N，默认Y)"
    if ($copyToClipboard -ne "N" -and $copyToClipboard -ne "n") {
        $publicKey | Set-Clipboard
        Write-Host "  ✓ 公钥已复制到剪贴板" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "  按 Enter 继续下一步..." -ForegroundColor Gray
Read-Host

# ============================================
# 步骤 2: 收集服务器信息
# ============================================
Write-Host ""
Write-Host "【步骤 2/5】收集服务器连接信息" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

$serverIP = Read-Host "  请输入服务器 IP 地址或域名"
if ([string]::IsNullOrWhiteSpace($serverIP)) {
    Write-Host "  ✗ 服务器地址不能为空" -ForegroundColor Red
    exit 1
}

$serverUser = Read-Host "  请输入服务器用户名（默认: ubuntu）"
if ([string]::IsNullOrWhiteSpace($serverUser)) {
    $serverUser = "ubuntu"
}

$serverPort = Read-Host "  请输入 SSH 端口（默认: 22）"
if ([string]::IsNullOrWhiteSpace($serverPort)) {
    $serverPort = "22"
}

Write-Host ""
Write-Host "  服务器信息确认:" -ForegroundColor Cyan
Write-Host "    地址: $serverIP" -ForegroundColor White
Write-Host "    用户: $serverUser" -ForegroundColor White
Write-Host "    端口: $serverPort" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "  信息是否正确? (Y/N，默认Y)"
if ($confirm -eq "N" -or $confirm -eq "n") {
    Write-Host "  请重新运行脚本" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "  按 Enter 继续下一步..." -ForegroundColor Gray
Read-Host

# ============================================
# 步骤 3: 配置本地 SSH config
# ============================================
Write-Host ""
Write-Host "【步骤 3/5】配置本地 SSH config 文件" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

$sshConfigPath = "$env:USERPROFILE\.ssh\config"

# 确保 config 文件存在
if (-not (Test-Path $sshConfigPath)) {
    New-Item -ItemType File -Path $sshConfigPath -Force | Out-Null
    Write-Host "  ✓ 已创建 SSH config 文件" -ForegroundColor Green
}

# 检查是否已存在 myserver 配置
$configContent = Get-Content $sshConfigPath -Raw -ErrorAction SilentlyContinue
if ($configContent -match "Host\s+myserver") {
    Write-Host "  ⚠ 检测到已存在的 myserver 配置" -ForegroundColor Yellow
    $overwrite = Read-Host "  是否覆盖现有配置? (Y/N，默认Y)"
    
    if ($overwrite -eq "N" -or $overwrite -eq "n") {
        Write-Host "  跳过配置 SSH config" -ForegroundColor Yellow
    } else {
        # 删除旧的 myserver 配置
        $pattern = '(?s)Host\s+myserver\s+.*?(?=Host\s+\w+|$)'
        $configContent = $configContent -replace $pattern, ''
        $configContent = $configContent -replace '\r?\n\s*\r?\n\s*\r?\n+', "`r`n`r`n"
        Set-Content -Path $sshConfigPath -Value $configContent -NoNewline
        Write-Host "  ✓ 已删除旧的 myserver 配置" -ForegroundColor Green
    }
}

# 添加新的配置
if ($overwrite -ne "N" -and $overwrite -ne "n") {
    $newConfig = @"

Host myserver
    HostName $serverIP
    User $serverUser
    Port $serverPort
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking no
    UserKnownHostsFile ~/.ssh/known_hosts

"@
    
    # 追加到配置文件
    Add-Content -Path $sshConfigPath -Value $newConfig
    Write-Host "  ✓ SSH config 配置已添加" -ForegroundColor Green
    Write-Host ""
    Write-Host "  配置内容:" -ForegroundColor Cyan
    Write-Host "  ----------------------------------------" -ForegroundColor Gray
    Write-Host $newConfig -ForegroundColor White
    Write-Host "  ----------------------------------------" -ForegroundColor Gray
}

Write-Host ""
Write-Host "  按 Enter 继续下一步..." -ForegroundColor Gray
Read-Host

# ============================================
# 步骤 4: 将公钥添加到服务器
# ============================================
Write-Host ""
Write-Host "【步骤 4/5】将公钥添加到服务器" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "  有两种方式将公钥添加到服务器:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  方式 1: 自动复制（推荐）" -ForegroundColor Green
Write-Host "    - 使用 ssh-copy-id 或 PowerShell 命令自动复制" -ForegroundColor White
Write-Host "    - 需要输入服务器密码" -ForegroundColor White
Write-Host ""
Write-Host "  方式 2: 手动复制" -ForegroundColor Green
Write-Host "    - 手动登录服务器，编辑 authorized_keys 文件" -ForegroundColor White
Write-Host "    - 适合无法自动复制的情况" -ForegroundColor White
Write-Host ""

$method = Read-Host "  请选择方式 (1/2，默认1)"

if ($method -ne "2") {
    # 方式 1: 自动复制
    Write-Host ""
    Write-Host "  正在尝试自动复制公钥到服务器..." -ForegroundColor Cyan
    Write-Host "  提示: 系统会要求您输入服务器密码" -ForegroundColor Yellow
    Write-Host ""
    
    # 读取公钥内容
    $publicKeyContent = Get-Content $publicKeyPath -Raw
    
    # 构建命令：在服务器上创建目录、添加公钥、设置权限
    $remoteCommand = @"
mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$($publicKeyContent.Trim())' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo '公钥已成功添加'
"@
    
    try {
        # 使用 ssh 命令执行
        $sshCommand = "ssh -p $serverPort $serverUser@$serverIP `"$remoteCommand`""
        Write-Host "  执行命令: ssh -p $serverPort $serverUser@$serverIP" -ForegroundColor Gray
        Write-Host ""
        
        # 注意：这里需要用户手动输入密码，所以不能直接执行
        Write-Host "  请在下面手动执行以下命令（会提示输入密码）:" -ForegroundColor Yellow
        Write-Host "  ----------------------------------------" -ForegroundColor Gray
        Write-Host "  $sshCommand" -ForegroundColor Cyan
        Write-Host "  ----------------------------------------" -ForegroundColor Gray
        Write-Host ""
        
        # 或者使用 PowerShell 的 ssh 命令
        Write-Host "  或者，您可以运行以下 PowerShell 命令:" -ForegroundColor Yellow
        Write-Host "  ----------------------------------------" -ForegroundColor Gray
        $psCommand = @"
Get-Content '$publicKeyPath' | ssh -p $serverPort $serverUser@$serverIP "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
"@
        Write-Host $psCommand -ForegroundColor Cyan
        Write-Host "  ----------------------------------------" -ForegroundColor Gray
        Write-Host ""
        
        $manualCopy = Read-Host "  是否现在手动执行上述命令? (Y/N，默认Y)"
        if ($manualCopy -ne "N" -and $manualCopy -ne "n") {
            Write-Host ""
            Write-Host "  请在新的 PowerShell 窗口中执行命令..." -ForegroundColor Yellow
            Write-Host "  执行完成后，按 Enter 继续..." -ForegroundColor Gray
            Read-Host
        }
    } catch {
        Write-Host "  ✗ 自动复制失败: $_" -ForegroundColor Red
        Write-Host "  请使用方式 2 手动复制" -ForegroundColor Yellow
    }
} else {
    # 方式 2: 手动复制
    Write-Host ""
    Write-Host "  手动复制公钥步骤:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  1. 使用密码登录服务器:" -ForegroundColor White
    Write-Host "     ssh -p $serverPort $serverUser@$serverIP" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  2. 在服务器上执行以下命令:" -ForegroundColor White
    Write-Host "     mkdir -p ~/.ssh" -ForegroundColor Cyan
    Write-Host "     chmod 700 ~/.ssh" -ForegroundColor Cyan
    Write-Host "     nano ~/.ssh/authorized_keys" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  3. 将以下公钥内容粘贴到 authorized_keys 文件末尾:" -ForegroundColor White
    Write-Host "     ----------------------------------------" -ForegroundColor Gray
    if (Test-Path $publicKeyPath) {
        $publicKey = Get-Content $publicKeyPath
        Write-Host "     $publicKey" -ForegroundColor White
    }
    Write-Host "     ----------------------------------------" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  4. 保存文件（Ctrl+O, Enter, Ctrl+X）" -ForegroundColor White
    Write-Host ""
    Write-Host "  5. 设置正确的文件权限:" -ForegroundColor White
    Write-Host "     chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  6. 退出服务器（输入 exit）" -ForegroundColor White
    Write-Host ""
    
    Write-Host "  完成上述步骤后，按 Enter 继续..." -ForegroundColor Gray
    Read-Host
}

Write-Host ""
Write-Host "  按 Enter 继续下一步..." -ForegroundColor Gray
Read-Host

# ============================================
# 步骤 5: 测试连接
# ============================================
Write-Host ""
Write-Host "【步骤 5/5】测试 SSH 连接" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "  正在测试 SSH 连接..." -ForegroundColor Cyan
Write-Host ""

# 测试连接（使用 config 中的 myserver）
Write-Host "  测试命令: ssh -o ConnectTimeout=10 myserver 'echo 连接成功!'" -ForegroundColor Gray
Write-Host ""

try {
    $testResult = ssh -o ConnectTimeout=10 -o BatchMode=yes myserver 'echo 连接成功!' 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ SSH 连接测试成功！" -ForegroundColor Green
        Write-Host ""
        Write-Host "  输出: $testResult" -ForegroundColor White
    } else {
        Write-Host "  ⚠ 连接测试未完全成功" -ForegroundColor Yellow
        Write-Host "  输出: $testResult" -ForegroundColor White
        Write-Host ""
        Write-Host "  可能的原因:" -ForegroundColor Yellow
        Write-Host "    1. 公钥尚未正确添加到服务器" -ForegroundColor White
        Write-Host "    2. 服务器 authorized_keys 文件权限不正确" -ForegroundColor White
        Write-Host "    3. 服务器 SSH 配置问题" -ForegroundColor White
        Write-Host ""
        Write-Host "  建议:" -ForegroundColor Yellow
        Write-Host "    - 检查服务器端配置（参考: 服务器端SSH配置指南.md）" -ForegroundColor White
        Write-Host "    - 尝试手动连接: ssh myserver" -ForegroundColor White
    }
} catch {
    Write-Host "  ✗ 连接测试失败: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "  现在可以尝试手动连接:" -ForegroundColor Cyan
Write-Host "    ssh myserver" -ForegroundColor White
Write-Host ""

# 询问是否立即测试
$testNow = Read-Host "  是否现在测试手动连接? (Y/N，默认N)"
if ($testNow -eq "Y" -or $testNow -eq "y") {
    Write-Host ""
    Write-Host "  正在打开新的 SSH 连接..." -ForegroundColor Cyan
    Write-Host "  提示: 如果是首次连接，可能需要输入 'yes' 确认主机密钥" -ForegroundColor Yellow
    Write-Host ""
    
    # 启动 SSH 连接（在新窗口中）
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "ssh myserver"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "配置完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "总结:" -ForegroundColor Yellow
Write-Host "  ✓ SSH 密钥已生成" -ForegroundColor Green
Write-Host "  ✓ SSH config 已配置" -ForegroundColor Green
Write-Host "  ✓ 公钥已添加到服务器（请确认）" -ForegroundColor $(if ($testResult -match "连接成功") { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "  1. 确认可以无密码连接: ssh myserver" -ForegroundColor White
Write-Host "  2. 在 Cursor 中配置远程连接" -ForegroundColor White
Write-Host "  3. 如果遇到问题，查看: 服务器端SSH配置指南.md" -ForegroundColor White
Write-Host ""

