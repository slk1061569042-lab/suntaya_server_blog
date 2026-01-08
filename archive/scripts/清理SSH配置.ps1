# 清理本地 SSH 配置脚本
# 用于重新配置 SSH 连接前清理现有配置

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "清理 SSH 配置工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "警告: 此脚本将清理以下内容:" -ForegroundColor Yellow
Write-Host "  1. SSH 配置文件中的 myserver 配置" -ForegroundColor White
Write-Host "  2. 已知主机中的服务器记录" -ForegroundColor White
Write-Host "  3. SSH 密钥（可选）" -ForegroundColor White
Write-Host ""
Write-Host "注意: 不会删除 SSH 密钥文件本身，只清理配置引用" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "是否继续? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "已取消" -ForegroundColor Yellow
    exit 0
}

Write-Host ""

# 1. 清理 SSH 配置文件中的 myserver 配置
Write-Host "【1/4】清理 SSH 配置文件..." -ForegroundColor Yellow
$sshConfigPath = "$env:USERPROFILE\.ssh\config"

if (Test-Path $sshConfigPath) {
    try {
        $configContent = Get-Content $sshConfigPath -Raw
        $originalContent = $configContent
        
        # 使用正则表达式删除 myserver 配置块
        # 匹配从 "Host myserver" 到下一个 "Host" 或文件结尾
        $pattern = '(?s)Host\s+myserver\s+.*?(?=Host\s+\w+|$)'
        $configContent = $configContent -replace $pattern, ''
        
        # 清理多余的空行（连续3个或更多空行替换为2个）
        $configContent = $configContent -replace '\r?\n\s*\r?\n\s*\r?\n+', "`r`n`r`n"
        
        if ($configContent -ne $originalContent) {
            Set-Content -Path $sshConfigPath -Value $configContent -NoNewline
            Write-Host "  ✓ 已从 SSH 配置文件中删除 myserver 配置" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ SSH 配置文件中未找到 myserver 配置" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ✗ 清理 SSH 配置文件失败: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  ⚠ SSH 配置文件不存在: $sshConfigPath" -ForegroundColor Yellow
}

Write-Host ""

# 2. 清理 known_hosts 中的服务器记录
Write-Host "【2/4】清理已知主机记录..." -ForegroundColor Yellow
$knownHostsPath = "$env:USERPROFILE\.ssh\known_hosts"

if (Test-Path $knownHostsPath) {
    try {
        $knownHosts = Get-Content $knownHostsPath
        $originalCount = $knownHosts.Count
        $serverIP = Read-Host "请输入服务器IP地址（用于清理known_hosts，直接回车跳过）"
        
        if ($serverIP) {
            # 删除包含该IP的行
            $filteredHosts = $knownHosts | Where-Object { $_ -notmatch [regex]::Escape($serverIP) }
            
            if ($filteredHosts.Count -lt $originalCount) {
                Set-Content -Path $knownHostsPath -Value $filteredHosts
                $removedCount = $originalCount - $filteredHosts.Count
                Write-Host "  ✓ 已从 known_hosts 中删除 $removedCount 条记录" -ForegroundColor Green
            } else {
                Write-Host "  ⚠ 未找到匹配的记录" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  ⚠ 跳过清理 known_hosts" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ✗ 清理 known_hosts 失败: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  ⚠ known_hosts 文件不存在" -ForegroundColor Yellow
}

Write-Host ""

# 3. 显示当前 SSH 密钥信息
Write-Host "【3/4】检查 SSH 密钥..." -ForegroundColor Yellow
$privateKeyPath = "$env:USERPROFILE\.ssh\id_rsa"
$publicKeyPath = "$env:USERPROFILE\.ssh\id_rsa.pub"

if (Test-Path $privateKeyPath) {
    Write-Host "  ✓ 找到私钥: $privateKeyPath" -ForegroundColor Green
    if (Test-Path $publicKeyPath) {
        Write-Host "  ✓ 找到公钥: $publicKeyPath" -ForegroundColor Green
        Write-Host ""
        Write-Host "  公钥内容:" -ForegroundColor Cyan
        Write-Host "  ----------------------------------------" -ForegroundColor Gray
        Get-Content $publicKeyPath
        Write-Host "  ----------------------------------------" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⚠ 未找到 SSH 密钥文件" -ForegroundColor Yellow
    Write-Host "  建议: 运行 ssh-keygen 生成新密钥" -ForegroundColor Gray
}

Write-Host ""

# 4. 可选：删除 SSH 密钥（危险操作）
Write-Host "【4/4】可选操作..." -ForegroundColor Yellow
Write-Host "警告: 删除密钥后需要重新生成并配置到服务器" -ForegroundColor Red
$deleteKeys = Read-Host "是否删除现有 SSH 密钥? (Y/N，默认N)"

if ($deleteKeys -eq "Y" -or $deleteKeys -eq "y") {
    if (Test-Path $privateKeyPath) {
        Remove-Item $privateKeyPath -Force
        Write-Host "  ✓ 已删除私钥" -ForegroundColor Green
    }
    if (Test-Path $publicKeyPath) {
        Remove-Item $publicKeyPath -Force
        Write-Host "  ✓ 已删除公钥" -ForegroundColor Green
    }
    Write-Host ""
    Write-Host "  需要重新生成密钥，运行以下命令:" -ForegroundColor Yellow
    Write-Host "  ssh-keygen -t rsa -b 4096 -C `"your_email@example.com`"" -ForegroundColor Cyan
} else {
    Write-Host "  ⚠ 保留现有 SSH 密钥" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "清理完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Yellow
Write-Host "1. 查看服务器端配置指南: 服务器端SSH配置指南.md" -ForegroundColor White
Write-Host "2. 在服务器上清理旧的 authorized_keys 记录（如需要）" -ForegroundColor White
Write-Host "3. 重新配置 SSH 连接" -ForegroundColor White
Write-Host ""







