# 修复 Cursor SSH 配置文件路径错误
# 问题：Cursor 尝试使用错误的 SSH 配置文件路径
# 错误：Can't open user config file C:\Users\Aquarius\.ssh\github

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复 Cursor SSH 配置文件路径错误" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 检查当前用户和SSH配置
Write-Host "1. 检查当前用户和SSH配置..." -ForegroundColor Yellow
$currentUser = $env:USERNAME
$currentUserProfile = $env:USERPROFILE
Write-Host "   当前用户: $currentUser" -ForegroundColor Gray
Write-Host "   用户目录: $currentUserProfile" -ForegroundColor Gray
Write-Host ""

# 2. 检查正确的SSH配置文件
Write-Host "2. 检查正确的SSH配置文件..." -ForegroundColor Yellow
$correctConfigPath = "$currentUserProfile\.ssh\config"
$correctConfigDir = "$currentUserProfile\.ssh"

if (Test-Path $correctConfigDir) {
    Write-Host "   ✓ .ssh 目录存在: $correctConfigDir" -ForegroundColor Green
} else {
    Write-Host "   ✗ .ssh 目录不存在，正在创建..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $correctConfigDir -Force | Out-Null
    Write-Host "   ✓ 已创建 .ssh 目录" -ForegroundColor Green
}

if (Test-Path $correctConfigPath) {
    Write-Host "   ✓ SSH 配置文件存在: $correctConfigPath" -ForegroundColor Green
    $configContent = Get-Content $correctConfigPath -Raw
    if ($configContent -match "Host\s+(myserver|115\.190\.54\.220)") {
        Write-Host "   ✓ 找到服务器配置" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ 未找到服务器配置，需要添加" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠ SSH 配置文件不存在: $correctConfigPath" -ForegroundColor Yellow
    Write-Host "   正在创建默认配置..." -ForegroundColor Gray
    
    $defaultConfig = @"
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
    
    Set-Content -Path $correctConfigPath -Value $defaultConfig -Encoding UTF8
    Write-Host "   ✓ 已创建 SSH 配置文件" -ForegroundColor Green
}
Write-Host ""

# 3. 检查错误的路径（如果存在）
Write-Host "3. 检查错误的配置文件路径..." -ForegroundColor Yellow
$wrongPaths = @(
    "C:\Users\Aquarius\.ssh\github",
    "C:\Users\Aquarius\.ssh\config"
)

foreach ($wrongPath in $wrongPaths) {
    if (Test-Path $wrongPath) {
        Write-Host "   ⚠ 发现错误的配置文件: $wrongPath" -ForegroundColor Yellow
        Write-Host "   建议：删除或重命名此文件" -ForegroundColor Gray
    } else {
        Write-Host "   ✓ 错误的路径不存在: $wrongPath" -ForegroundColor Green
    }
}
Write-Host ""

# 4. 检查Cursor的SSH扩展配置
Write-Host "4. 检查Cursor SSH扩展配置..." -ForegroundColor Yellow
$cursorSettingsPath = "$env:APPDATA\Cursor\User\settings.json"
if (Test-Path $cursorSettingsPath) {
    Write-Host "   ✓ Cursor 设置文件存在" -ForegroundColor Green
    $settingsContent = Get-Content $cursorSettingsPath -Raw -ErrorAction SilentlyContinue
    if ($settingsContent -match "remote\.SSH|ssh") {
        Write-Host "   ⚠ 发现SSH相关配置，请手动检查设置文件" -ForegroundColor Yellow
        Write-Host "   文件路径: $cursorSettingsPath" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠ 未找到SSH相关配置" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠ Cursor 设置文件不存在" -ForegroundColor Yellow
}
Write-Host ""

# 5. 提供修复建议
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复建议" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "问题原因：" -ForegroundColor Yellow
Write-Host "Cursor 尝试使用错误的SSH配置文件路径：" -ForegroundColor White
Write-Host "  C:\Users\Aquarius\.ssh\github" -ForegroundColor Red
Write-Host ""
Write-Host "正确的配置文件路径应该是：" -ForegroundColor White
Write-Host "  $correctConfigPath" -ForegroundColor Green
Write-Host ""

Write-Host "解决方案：" -ForegroundColor Yellow
Write-Host ""
Write-Host "方法 1: 在Cursor中重新配置SSH连接" -ForegroundColor Cyan
Write-Host "1. 打开 Cursor" -ForegroundColor White
Write-Host "2. 按 Ctrl+Shift+P 打开命令面板" -ForegroundColor White
Write-Host "3. 输入 'Remote-SSH: Open SSH Configuration File'" -ForegroundColor White
Write-Host "4. 选择正确的配置文件: $correctConfigPath" -ForegroundColor White
Write-Host "5. 确保配置文件中包含以下内容：" -ForegroundColor White
Write-Host ""
Write-Host "   Host myserver" -ForegroundColor Gray
Write-Host "       HostName 115.190.54.220" -ForegroundColor Gray
Write-Host "       User root" -ForegroundColor Gray
Write-Host "       Port 22" -ForegroundColor Gray
Write-Host "       IdentityFile ~/.ssh/id_rsa" -ForegroundColor Gray
Write-Host ""

Write-Host "方法 2: 检查Cursor的远程SSH扩展设置" -ForegroundColor Cyan
Write-Host "1. 打开 Cursor" -ForegroundColor White
Write-Host "2. 按 Ctrl+, 打开设置" -ForegroundColor White
Write-Host "3. 搜索 'remote.SSH.configFile'" -ForegroundColor White
Write-Host "4. 确保设置为: $correctConfigPath" -ForegroundColor White
Write-Host "   或者留空使用默认路径" -ForegroundColor Gray
Write-Host ""

Write-Host "方法 3: 使用IP地址直接连接" -ForegroundColor Cyan
Write-Host "如果使用Host别名有问题，可以尝试直接使用IP地址：" -ForegroundColor White
Write-Host "1. 在Cursor中连接时，输入: root@115.190.54.220" -ForegroundColor Gray
Write-Host "2. 或者确保SSH配置文件中包含IP地址的Host配置" -ForegroundColor Gray
Write-Host ""

Write-Host "方法 4: 检查环境变量" -ForegroundColor Cyan
Write-Host "确保没有设置错误的SSH配置环境变量：" -ForegroundColor White
Write-Host "  检查: `$env:SSH_CONFIG_FILE" -ForegroundColor Gray
$envSshConfig = [Environment]::GetEnvironmentVariable("SSH_CONFIG_FILE", "User")
if ($envSshConfig) {
    Write-Host "   ⚠ 发现环境变量 SSH_CONFIG_FILE = $envSshConfig" -ForegroundColor Yellow
    Write-Host "   如果路径不正确，请删除或修改此环境变量" -ForegroundColor Yellow
} else {
    Write-Host "   ✓ 未设置 SSH_CONFIG_FILE 环境变量" -ForegroundColor Green
}
Write-Host ""

# 6. 测试SSH连接
Write-Host "5. 测试SSH连接..." -ForegroundColor Yellow
Write-Host "   使用正确的配置文件测试连接..." -ForegroundColor Gray
try {
    $sshTest = ssh -F $correctConfigPath -o ConnectTimeout=5 myserver "echo test" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ SSH 连接成功" -ForegroundColor Green
        Write-Host "   服务器响应: $sshTest" -ForegroundColor Gray
    } else {
        Write-Host "   ✗ SSH 连接失败 (退出码: $LASTEXITCODE)" -ForegroundColor Red
        Write-Host "   错误信息:" -ForegroundColor Red
        $sshTest | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
    }
} catch {
    Write-Host "   ✗ SSH 测试异常: $_" -ForegroundColor Red
}
Write-Host ""

# 7. 显示当前SSH配置内容
Write-Host "6. 当前SSH配置内容：" -ForegroundColor Yellow
if (Test-Path $correctConfigPath) {
    Write-Host "   ----------------------------------------" -ForegroundColor DarkGray
    Get-Content $correctConfigPath | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    Write-Host "   ----------------------------------------" -ForegroundColor DarkGray
} else {
    Write-Host "   ⚠ 配置文件不存在" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "诊断完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Yellow
Write-Host "1. 按照上述方法修复Cursor的SSH配置路径" -ForegroundColor White
Write-Host "2. 重新启动Cursor" -ForegroundColor White
Write-Host "3. 尝试重新连接远程服务器" -ForegroundColor White
Write-Host ""
