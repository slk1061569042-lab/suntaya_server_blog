@echo off
REM Git 推送脚本 - 使用凭证登录
REM 这个脚本会在 Git Bash 中执行推送，避免 PowerShell 的 DNS 问题

echo ========================================
echo Git 推送脚本
echo ========================================
echo.

REM 检查是否在正确的目录
if not exist ".git" (
    echo 错误：当前目录不是 Git 仓库！
    echo 请确保在项目根目录执行此脚本。
    pause
    exit /b 1
)

echo 当前目录：%CD%
echo.

REM 检查 Git Bash 是否存在
set "GIT_BASH=C:\Program Files\Git\bin\bash.exe"
if not exist "%GIT_BASH%" (
    set "GIT_BASH=C:\Program Files (x86)\Git\bin\bash.exe"
)

if not exist "%GIT_BASH%" (
    echo 警告：未找到 Git Bash，将使用 PowerShell 执行
    echo.
    echo 执行推送命令...
    git push -u origin main
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ 推送成功！
    ) else (
        echo.
        echo ❌ 推送失败！
        echo.
        echo 如果遇到 DNS 问题，请：
        echo 1. 手动打开 Git Bash
        echo 2. 执行：cd /c/Users/Administrator/Documents/git-docs-blog
        echo 3. 执行：git push -u origin main
    )
) else (
    echo 使用 Git Bash 执行推送...
    echo.
    "%GIT_BASH%" -c "cd '/c/Users/Administrator/Documents/git-docs-blog' && git push -u origin main"
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ 推送成功！
    ) else (
        echo.
        echo ❌ 推送失败！
        echo 请检查：
        echo 1. 是否已生成 Personal Access Token
        echo 2. Token 是否有 repo 权限
        echo 3. 网络连接是否正常
    )
)

echo.
echo ========================================
pause
