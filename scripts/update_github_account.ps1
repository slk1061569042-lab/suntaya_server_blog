# 更新 GitHub 账号配置脚本
# 用于更换 GitHub 远程仓库和账号信息

Write-Host "=== 更新 GitHub 账号配置 ===" -ForegroundColor Cyan
Write-Host ""

# 切换到项目目录
$projectPath = Split-Path -Parent $PSScriptRoot
Set-Location $projectPath

Write-Host "当前目录: $projectPath" -ForegroundColor Gray
Write-Host ""

# 显示当前配置
Write-Host "当前配置：" -ForegroundColor Yellow
Write-Host "远程仓库: " -NoNewline
git remote get-url origin
Write-Host "Git 用户名: " -NoNewline
git config --global user.name
Write-Host "Git 邮箱: " -NoNewline
git config --global user.email
Write-Host ""

# 获取新账号信息
Write-Host "请输入新的 GitHub 账号信息：" -ForegroundColor Cyan
Write-Host ""

$newUsername = Read-Host "新的 GitHub 用户名"
if ([string]::IsNullOrWhiteSpace($newUsername)) {
    Write-Host "❌ 用户名不能为空" -ForegroundColor Red
    exit 1
}

$newEmail = Read-Host "新的 GitHub 邮箱（可选，直接回车跳过）"
$updateRepo = Read-Host "是否更新远程仓库 URL？(y/n，默认: y)"
if ($updateRepo -ne "n" -and $updateRepo -ne "N") {
    $repoName = Read-Host "仓库名称（默认: suntaya_server_blog）"
    if ([string]::IsNullOrWhiteSpace($repoName)) {
        $repoName = "suntaya_server_blog"
    }
}

Write-Host ""
Write-Host "确认信息：" -ForegroundColor Yellow
Write-Host "  新用户名: $newUsername" -ForegroundColor White
if ($newEmail) {
    Write-Host "  新邮箱: $newEmail" -ForegroundColor White
} else {
    Write-Host "  邮箱: 保持不变" -ForegroundColor Gray
}
if ($updateRepo -ne "n" -and $updateRepo -ne "N") {
    Write-Host "  新仓库 URL: https://github.com/$newUsername/$repoName.git" -ForegroundColor White
}
Write-Host ""

$confirm = Read-Host "确认更新？(y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "已取消操作" -ForegroundColor Yellow
    exit 0
}

# 更新 Git 用户配置
Write-Host ""
Write-Host "更新 Git 用户配置..." -ForegroundColor Yellow
git config --global user.name $newUsername
if ($newEmail) {
    git config --global user.email $newEmail
}
Write-Host "✅ Git 用户配置已更新" -ForegroundColor Green

# 更新远程仓库 URL
if ($updateRepo -ne "n" -and $updateRepo -ne "N") {
    Write-Host ""
    Write-Host "更新远程仓库 URL..." -ForegroundColor Yellow
    $newRepoUrl = "https://github.com/$newUsername/$repoName.git"
    git remote set-url origin $newRepoUrl
    Write-Host "✅ 远程仓库 URL 已更新为: $newRepoUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== 更新完成 ===" -ForegroundColor Cyan
Write-Host ""

# 显示更新后的配置
Write-Host "更新后的配置：" -ForegroundColor Yellow
Write-Host "远程仓库: " -NoNewline
git remote get-url origin
Write-Host "Git 用户名: " -NoNewline
git config --global user.name
Write-Host "Git 邮箱: " -NoNewline
git config --global user.email
Write-Host ""

# 认证提示
Write-Host "⚠️  重要提示：" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 如果使用 HTTPS，需要配置新的认证信息：" -ForegroundColor White
Write-Host "   - 访问: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host "   - 创建 Personal Access Token (classic)" -ForegroundColor Gray
Write-Host "   - 选择 'repo' 权限" -ForegroundColor Gray
Write-Host "   - 使用 token 作为密码进行推送" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 或者使用 SSH 密钥（推荐）：" -ForegroundColor White
Write-Host "   - 生成 SSH 密钥: ssh-keygen -t ed25519 -C '$newEmail'" -ForegroundColor Gray
Write-Host "   - 添加到 GitHub: https://github.com/settings/keys" -ForegroundColor Gray
Write-Host "   - 更新远程 URL: git remote set-url origin git@github.com:$newUsername/$repoName.git" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 测试连接：" -ForegroundColor White
Write-Host "   git ls-remote origin" -ForegroundColor Gray
Write-Host ""
