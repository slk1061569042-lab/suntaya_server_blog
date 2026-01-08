# 尝试使用 root 用户添加公钥
Write-Host "尝试使用 root 用户添加 SSH 公钥..." -ForegroundColor Yellow
Write-Host "提示: 请输入 root 用户的密码" -ForegroundColor Cyan
Write-Host ""

Get-Content C:\Users\Administrator\.ssh\id_rsa.pub | ssh root@115.190.54.220 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ 公钥已成功添加！" -ForegroundColor Green
    Write-Host "现在可以使用以下命令连接:" -ForegroundColor Cyan
    Write-Host "  ssh myserver-root" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "✗ 添加失败，请通过 ECS Terminal 手动添加" -ForegroundColor Red
}

