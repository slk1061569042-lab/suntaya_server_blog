@echo off
REM ========================================
REM Git SSH 方式推送配置脚本
REM 这是最可靠的推送方式，不依赖 DNS 解析
REM ========================================

echo.
echo ========================================
echo Git SSH 推送配置
echo ========================================
echo.

REM 检查是否在正确的目录
if not exist ".git" (
    echo [错误] 当前目录不是 Git 仓库！
    echo 请确保在项目根目录执行此脚本。
    pause
    exit /b 1
)

echo [1/4] 检查 SSH 密钥...
if not exist "%USERPROFILE%\.ssh\id_rsa.pub" (
    echo [错误] 未找到 SSH 公钥！
    echo.
    echo 请先生成 SSH 密钥：
    echo   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
    pause
    exit /b 1
)

echo [✓] SSH 公钥已找到
echo.

echo [2/4] 显示你的 SSH 公钥：
echo ----------------------------------------
type "%USERPROFILE%\.ssh\id_rsa.pub"
echo ----------------------------------------
echo.

echo [3/4] 请执行以下操作：
echo   1. 复制上面的 SSH 公钥（整个内容）
echo   2. 访问：https://github.com/settings/keys
echo   3. 点击 "New SSH key"
echo   4. 粘贴公钥并保存
echo.
echo 完成后，按任意键继续...
pause >nul

echo.
echo [4/4] 配置 Git 使用 SSH...
git remote set-url origin git@github.com:linkslks/suntaya_server_blog.git

echo.
echo [✓] 配置完成！
echo.
echo 测试 SSH 连接...
ssh -T git@github.com

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ SSH 配置成功！
    echo ========================================
    echo.
    echo 现在可以推送代码了：
    echo   git push -u origin main
    echo.
) else (
    echo.
    echo ========================================
    echo ⚠️  SSH 连接失败
    echo ========================================
    echo.
    echo 请检查：
    echo   1. 是否已将 SSH 公钥添加到 GitHub
    echo   2. 网络连接是否正常
    echo.
)

pause
