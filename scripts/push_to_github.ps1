# 提交代码到 GitHub 脚本
# 用于快速提交和推送本地更改到 GitHub

Write-Host "=== 提交代码到 GitHub ===" -ForegroundColor Cyan
Write-Host ""

# 切换到项目目录
$projectPath = Split-Path -Parent $PSScriptRoot
Set-Location $projectPath

Write-Host "当前目录: $projectPath" -ForegroundColor Gray
Write-Host ""

# 检查 Git 状态
Write-Host "检查 Git 状态..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "发现以下更改：" -ForegroundColor Green
    git status --short
    Write-Host ""
} else {
    Write-Host "✅ 没有需要提交的更改" -ForegroundColor Green
    exit 0
}

# 显示远程仓库信息
Write-Host "远程仓库信息：" -ForegroundColor Yellow
git remote -v
Write-Host ""

# 询问是否继续
$confirm = Read-Host "是否继续提交并推送到 GitHub？(y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "已取消操作" -ForegroundColor Yellow
    exit 0
}

# 添加所有更改
Write-Host ""
Write-Host "添加所有更改..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 添加文件失败" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 文件已添加到暂存区" -ForegroundColor Green
Write-Host ""

# 输入提交信息
Write-Host "请输入提交信息：" -ForegroundColor Yellow
$commitMessage = Read-Host "Commit message"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    Write-Host "使用默认提交信息: $commitMessage" -ForegroundColor Gray
}

# 提交更改
Write-Host ""
Write-Host "提交更改..." -ForegroundColor Yellow
git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 提交失败" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 更改已提交" -ForegroundColor Green
Write-Host ""

# 推送到远程仓库
Write-Host "推送到 GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 推送失败" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因：" -ForegroundColor Yellow
    Write-Host "1. 需要配置 GitHub 认证" -ForegroundColor White
    Write-Host "2. 远程仓库有新的提交，需要先拉取" -ForegroundColor White
    Write-Host ""
    Write-Host "解决方法：" -ForegroundColor Yellow
    Write-Host "1. 如果使用 HTTPS，可能需要配置 Personal Access Token" -ForegroundColor White
    Write-Host "2. 先运行: git pull origin main" -ForegroundColor White
    Write-Host "3. 然后再次运行: git push origin main" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "✅ 代码已成功推送到 GitHub！" -ForegroundColor Green
Write-Host ""
Write-Host "仓库地址: https://github.com/linkslks/suntaya_server_blog" -ForegroundColor Cyan
