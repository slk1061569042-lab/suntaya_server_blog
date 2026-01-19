# 设置SSH配置以便Cursor连接
# 确保SSH配置文件存在且正确配置

$sshDir = "$env:USERPROFILE\.ssh"
$sshConfig = "$sshDir\config"

# 创建.ssh目录（如果不存在）
if (-not (Test-Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
    Write-Host "Created .ssh directory: $sshDir"
}

# 检查并创建SSH配置文件
$configContent = @"
Host myserver
    HostName 115.190.54.220
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking no
    UserKnownHostsFile ~/.ssh/known_hosts

Host 115.190.54.220
    HostName 115.190.54.220
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking no
    UserKnownHostsFile ~/.ssh/known_hosts
"@

if (Test-Path $sshConfig) {
    $existing = Get-Content $sshConfig -Raw
    if ($existing -notmatch "115\.190\.54\.220") {
        # 追加配置
        Add-Content -Path $sshConfig -Value "`n$configContent"
        Write-Host "Added server configuration to existing config file"
    } else {
        Write-Host "Server configuration already exists in config file"
    }
} else {
    # 创建新配置文件
    Set-Content -Path $sshConfig -Value $configContent -Encoding UTF8
    Write-Host "Created SSH config file: $sshConfig"
}

Write-Host ""
Write-Host "SSH configuration is ready!"
Write-Host "Config file location: $sshConfig"
Write-Host ""
Write-Host "To connect in Cursor:"
Write-Host "1. Press Ctrl+Shift+P"
Write-Host "2. Type: Remote-SSH: Connect to Host"
Write-Host "3. Select: root@115.190.54.220"
Write-Host ""
