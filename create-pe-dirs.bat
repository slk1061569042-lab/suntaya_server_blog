@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo PE启动盘目录结构创建脚本
echo ====================
echo.

set "ROOT=G:\"
if "%1" neq "" set "ROOT=%1:\"

echo 根目录: %ROOT%
echo 开始创建目录结构...
echo.

set "COUNT=0"

:: 系统维护目录
call :MKDIR "系统维护\系统镜像\Windows10"
call :MKDIR "系统维护\系统镜像\Windows11"
call :MKDIR "系统维护\系统镜像\Windows7"
call :MKDIR "系统维护\系统镜像\Linux"
call :MKDIR "系统维护\驱动包\网卡驱动"
call :MKDIR "系统维护\驱动包\显卡驱动"
call :MKDIR "系统维护\驱动包\主板驱动"
call :MKDIR "系统维护\驱动包\笔记本驱动包"
call :MKDIR "系统维护\驱动包\万能驱动包"
call :MKDIR "系统维护\装机工具\激活工具"
call :MKDIR "系统维护\装机工具\分区工具"
call :MKDIR "系统维护\装机工具\备份还原工具"
call :MKDIR "系统维护\装机工具\硬件检测工具"
call :MKDIR "系统维护\系统补丁\Windows更新包"
call :MKDIR "系统维护\系统补丁\安全补丁"
call :MKDIR "系统维护\PE工具扩展\额外工具包"
call :MKDIR "系统维护\PE工具扩展\自定义脚本"

:: 工作文档目录
call :MKDIR "工作文档\项目文件"
call :MKDIR "工作文档\文档资料\技术文档"
call :MKDIR "工作文档\文档资料\学习资料"
call :MKDIR "工作文档\文档资料\参考手册"
call :MKDIR "工作文档\临时文件"
call :MKDIR "工作文档\待整理"

:: 个人文件目录
call :MKDIR "个人文件\图片\照片"
call :MKDIR "个人文件\图片\截图"
call :MKDIR "个人文件\图片\设计素材"
call :MKDIR "个人文件\视频\录制视频"
call :MKDIR "个人文件\视频\下载视频"
call :MKDIR "个人文件\音乐"
call :MKDIR "个人文件\下载\软件安装包"
call :MKDIR "个人文件\下载\浏览器下载"
call :MKDIR "个人文件\下载\其他下载"
call :MKDIR "个人文件\桌面备份"

:: 软件工具目录
call :MKDIR "软件工具\便携软件\办公软件"
call :MKDIR "软件工具\便携软件\开发工具"
call :MKDIR "软件工具\便携软件\媒体工具"
call :MKDIR "软件工具\便携软件\实用工具"
call :MKDIR "软件工具\安装程序\常用软件"
call :MKDIR "软件工具\安装程序\专业软件"
call :MKDIR "软件工具\绿色软件"

:: 备份文件目录
call :MKDIR "备份文件\系统备份\系统镜像备份"
call :MKDIR "备份文件\系统备份\驱动备份"
call :MKDIR "备份文件\文件备份\重要文档备份"
call :MKDIR "备份文件\文件备份\配置文件备份"
call :MKDIR "备份文件\时间戳备份"

:: 其他目录
call :MKDIR "其他\测试文件"
call :MKDIR "其他\临时存储"
call :MKDIR "其他\待删除"

echo.
echo ==================================================
echo 目录创建完成！共创建 !COUNT! 个目录
echo ==================================================
echo.
echo 根目录: %ROOT%
echo.
pause
exit /b 0

:MKDIR
set "DIRPATH=%ROOT%%~1"
if not exist "!DIRPATH!" (
    mkdir "!DIRPATH!" >nul 2>&1
    if !errorlevel! equ 0 (
        echo [OK] 创建: %~1
        set /a COUNT+=1
    ) else (
        echo [FAIL] 失败: %~1
    )
) else (
    echo [SKIP] 已存在: %~1
)
exit /b 0
