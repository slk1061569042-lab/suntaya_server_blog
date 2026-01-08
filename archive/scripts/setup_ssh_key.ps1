# SSH 密钥配置脚本
# 用于将公钥复制到云服务器

$serverIP = "115.190.54.220"
$serverUser = "ubuntu"
$publicKeyPath = "$env:USERPROFILE\.ssh\id_rsa.pub"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SSH 公钥配置工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查公钥文件是否存在
if (Test-Path $publicKeyPath) {
    Write-Host "✓ 找到公钥文件: $publicKeyPath" -ForegroundColor Green
    Write-Host ""
    
    # 显示公钥内容
    Write-Host "你的公钥内容:" -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Get-Content $publicKeyPath
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "请选择操作方式:" -ForegroundColor Cyan
    Write-Host "1. 自动复制公钥到服务器（需要输入服务器密码）" -ForegroundColor White
    Write-Host "2. 手动复制公钥（显示操作步骤）" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "请输入选项 (1 或 2)"
    
    if ($choice -eq "1") {
        # 方法1: 使用 ssh-copy-id（如果可用）或手动复制
        Write-Host ""
        Write-Host "正在尝试自动复制公钥..." -ForegroundColor Yellow
        
        # 读取公钥内容
        $publicKey = Get-Content $publicKeyPath -Raw
        
        # 尝试使用 ssh-copy-id（Windows 上可能不可用）
        $sshCopyId = Get-Command ssh-copy-id -ErrorAction SilentlyContinue
        
        if ($sshCopyId) {
            Write-Host "使用 ssh-copy-id 复制公钥..." -ForegroundColor Green
            ssh-copy-id -i $publicKeyPath "$serverUser@$serverIP"
        } else {
            # 手动方式：通过 SSH 命令添加
            Write-Host "使用 SSH 命令复制公钥..." -ForegroundColor Green
            Write-Host "提示: 需要输入服务器密码" -ForegroundColor Yellow
            Write-Host ""
            
            $publicKeyContent = Get-Content $publicKeyPath
            $command = "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$publicKeyContent' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo '公钥已成功添加！'"
            
            ssh "$serverUser@$serverIP" $command
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "✓ 公钥已成功复制到服务器！" -ForegroundColor Green
                Write-Host ""
                Write-Host "现在可以测试连接:" -ForegroundColor Cyan
                Write-Host "  ssh myserver" -ForegroundColor White
            } else {
                Write-Host ""
                Write-Host "✗ 自动复制失败，请使用手动方式" -ForegroundColor Red
            }
        }
    } else {
        # 方法2: 手动复制
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "手动配置步骤" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "方法一：使用密码登录后手动添加" -ForegroundColor Yellow
        Write-Host "1. 使用密码登录服务器:" -ForegroundColor White
        Write-Host "   ssh $serverUser@$serverIP" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. 登录后执行以下命令:" -ForegroundColor White
        Write-Host "   mkdir -p ~/.ssh" -ForegroundColor Gray
        Write-Host "   chmod 700 ~/.ssh" -ForegroundColor Gray
        Write-Host "   nano ~/.ssh/authorized_keys" -ForegroundColor Gray
        Write-Host ""
        Write-Host "3. 将下面的公钥内容复制并粘贴到 authorized_keys 文件中:" -ForegroundColor White
        Write-Host "----------------------------------------" -ForegroundColor Gray
        Get-Content $publicKeyPath
        Write-Host "----------------------------------------" -ForegroundColor Gray
        Write-Host ""
        Write-Host "4. 保存文件（Ctrl+O, Enter, Ctrl+X）" -ForegroundColor White
        Write-Host "5. 设置正确的权限:" -ForegroundColor White
        Write-Host "   chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Gray
        Write-Host ""
        Write-Host "方法二：使用一条命令添加（需要输入密码）" -ForegroundColor Yellow
        Write-Host "执行以下命令，然后输入服务器密码:" -ForegroundColor White
        Write-Host "----------------------------------------" -ForegroundColor Gray
        $publicKeyContent = Get-Content $publicKeyPath
        Write-Host "type $publicKeyPath | ssh $serverUser@$serverIP `"cat >> ~/.ssh/authorized_keys`"" -ForegroundColor Cyan
        Write-Host "----------------------------------------" -ForegroundColor Gray
        Write-Host ""
        Write-Host "或者使用 PowerShell 命令:" -ForegroundColor White
        Write-Host "----------------------------------------" -ForegroundColor Gray
        Write-Host "Get-Content $publicKeyPath | ssh $serverUser@$serverIP 'cat >> ~/.ssh/authorized_keys'" -ForegroundColor Cyan
        Write-Host "----------------------------------------" -ForegroundColor Gray
    }
} else {
    Write-Host "✗ 未找到公钥文件: $publicKeyPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "需要生成新的 SSH 密钥对吗？(Y/N)" -ForegroundColor Yellow
    $generate = Read-Host
    
    if ($generate -eq "Y" -or $generate -eq "y") {
        Write-Host ""
        Write-Host "正在生成 SSH 密钥对..." -ForegroundColor Yellow
        ssh-keygen -t rsa -b 4096 -C "$env:USERNAME@$(hostname)" -f "$env:USERPROFILE\.ssh\id_rsa" -N '""'
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ SSH 密钥对生成成功！" -ForegroundColor Green
            Write-Host "私钥: $env:USERPROFILE\.ssh\id_rsa" -ForegroundColor White
            Write-Host "公钥: $env:USERPROFILE\.ssh\id_rsa.pub" -ForegroundColor White
            Write-Host ""
            Write-Host "请重新运行此脚本以复制公钥到服务器" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "配置完成后，测试连接:" -ForegroundColor Cyan
Write-Host "  ssh myserver" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

