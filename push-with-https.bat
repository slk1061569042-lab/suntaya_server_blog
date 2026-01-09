@echo off
REM ========================================
REM Git HTTPS 方式推送脚本（使用 Git Bash）
REM 使用 Git Bash 可以绕过 PowerShell 的 DNS 问题
REM ========================================

echo.
echo ========================================
echo Git HTTPS 推送（使用 Git Bash）
echo ========================================
echo.

REM 查找 Git Bash
set "GIT_BASH="
if exist "D:\Git\bin\bash.exe" (
    set "GIT_BASH=D:\Git\bin\bash.exe"
) else if exist "C:\Program Files\Git\bin\bash.exe" (
    set "GIT_BASH=C:\Program Files\Git\bin\bash.exe"
) else if exist "C:\Program Files (x86)\Git\bin\bash.exe" (
    set "GIT_BASH=C:\Program Files (x86)\Git\bin\bash.exe"
)

if "%GIT_BASH%"=="" (
    echo [错误] 未找到 Git Bash！
    echo.
    echo 请手动打开 Git Bash，然后执行：
    echo   cd /c/Users/Administrator/Documents/git-docs-blog
    echo   git push -u origin main
    echo.
    pause
    exit /b 1
)

echo [✓] 找到 Git Bash: %GIT_BASH%
echo.

REM 检查是否在正确的目录
if not exist ".git" (
    echo [错误] 当前目录不是 Git 仓库！
    pause
    exit /b 1
)

echo 正在使用 Git Bash 执行推送...
echo.
echo 注意：如果弹出凭证对话框，请输入：
echo   用户名：linkslks
echo   密码：你的 Personal Access Token（不是 GitHub 密码）
echo.
echo ----------------------------------------

"%GIT_BASH%" -c "cd '/c/Users/Administrator/Documents/git-docs-blog' && git push -u origin main"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ 推送成功！
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ❌ 推送失败
    echo ========================================
    echo.
    echo 可能的原因：
    echo   1. 未生成 Personal Access Token
    echo   2. Token 权限不足（需要 repo 权限）
    echo   3. Token 已过期
    echo   4. 网络连接问题
    echo.
    echo 获取 Token：https://github.com/settings/tokens
    echo.
)

pause
