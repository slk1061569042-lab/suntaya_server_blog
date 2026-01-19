# GitHub CLI 快速配置脚本
# 用于在服务器上配置 GitHub CLI

Write-Host "=== GitHub CLI 配置脚本 ===" -ForegroundColor Cyan
Write-Host ""

# 检查 GitHub CLI 是否已安装
Write-Host "检查 GitHub CLI 安装状态..." -ForegroundColor Yellow
$ghCheck = ssh root@115.190.54.220 "which gh"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ GitHub CLI 未安装，正在安装..." -ForegroundColor Red
    ssh root@115.190.54.220 @"
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | \
        dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg bs=1 2>/dev/null && \
        chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg && \
        ARCH=\$(dpkg --print-architecture) && \
        echo "deb [arch=\$ARCH signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list && \
        apt update && apt install -y gh
"@
} else {
    Write-Host "✅ GitHub CLI 已安装" -ForegroundColor Green
    ssh root@115.190.54.220 "gh --version"
}

Write-Host ""

# 检查认证状态
Write-Host "检查 GitHub CLI 认证状态..." -ForegroundColor Yellow
$authStatus = ssh root@115.190.54.220 "gh auth status 2>&1"
if ($authStatus -match "Logged in") {
    Write-Host "✅ GitHub CLI 已登录" -ForegroundColor Green
    Write-Host $authStatus
} else {
    Write-Host "⚠️  GitHub CLI 未登录" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请选择登录方式：" -ForegroundColor Cyan
    Write-Host "1. 浏览器登录（推荐）" -ForegroundColor White
    Write-Host "2. Token 登录" -ForegroundColor White
    Write-Host "3. 稍后手动登录" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "请输入选项 (1-3)"
    
    switch ($choice) {
        "1" {
            Write-Host "开始浏览器登录..." -ForegroundColor Yellow
            ssh root@115.190.54.220 "gh auth login"
        }
        "2" {
            Write-Host "请输入你的 GitHub Personal Access Token：" -ForegroundColor Yellow
            Write-Host "（可以在 https://github.com/settings/tokens 创建）" -ForegroundColor Gray
            $token = Read-Host "Token" -AsSecureString
            $tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                [Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
            )
            ssh root@115.190.54.220 "echo '$tokenPlain' | gh auth login --with-token"
        }
        "3" {
            Write-Host "稍后可以运行以下命令登录：" -ForegroundColor Yellow
            Write-Host "ssh root@115.190.54.220 'gh auth login'" -ForegroundColor White
        }
    }
}

Write-Host ""

# 检查 Git 配置
Write-Host "检查 Git 用户配置..." -ForegroundColor Yellow
$gitUser = ssh root@115.190.54.220 "git config --global --get user.name"
$gitEmail = ssh root@115.190.54.220 "git config --global --get user.email"

if ($gitUser -and $gitEmail) {
    Write-Host "✅ Git 用户已配置：" -ForegroundColor Green
    Write-Host "  用户名: $gitUser" -ForegroundColor White
    Write-Host "  邮箱: $gitEmail" -ForegroundColor White
} else {
    Write-Host "⚠️  Git 用户未配置" -ForegroundColor Yellow
    Write-Host ""
    $configureGit = Read-Host "是否现在配置 Git 用户信息？(y/n)"
    if ($configureGit -eq "y" -or $configureGit -eq "Y") {
        $userName = Read-Host "请输入 Git 用户名"
        $userEmail = Read-Host "请输入 Git 邮箱"
        ssh root@115.190.54.220 "git config --global user.name '$userName' && git config --global user.email '$userEmail'"
        Write-Host "✅ Git 用户配置完成" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=== 配置完成 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "常用命令：" -ForegroundColor Yellow
Write-Host "  查看认证状态: ssh root@115.190.54.220 'gh auth status'" -ForegroundColor White
Write-Host "  查看仓库列表: ssh root@115.190.54.220 'gh repo list'" -ForegroundColor White
Write-Host "  创建新仓库: ssh root@115.190.54.220 'gh repo create repo-name --public'" -ForegroundColor White
Write-Host ""
Write-Host "详细文档: content/git-docs/GitHub管理工具安装和配置指南.md" -ForegroundColor Gray
