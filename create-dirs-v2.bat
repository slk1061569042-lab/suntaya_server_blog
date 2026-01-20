@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set "ROOT=%~1"
if "%ROOT%"=="" set "ROOT=G:"
if not "%ROOT:~-1%"=="\" set "ROOT=%ROOT%:\"

echo Creating directories in %ROOT%
echo.

cd /d %ROOT%
if errorlevel 1 (
    echo Error: Cannot access %ROOT%
    pause
    exit /b 1
)

md "系统维护\系统镜像\Windows10" 2>nul
md "系统维护\系统镜像\Windows11" 2>nul
md "系统维护\系统镜像\Windows7" 2>nul
md "系统维护\系统镜像\Linux" 2>nul
md "系统维护\驱动包\网卡驱动" 2>nul
md "系统维护\驱动包\显卡驱动" 2>nul
md "系统维护\驱动包\主板驱动" 2>nul
md "系统维护\驱动包\笔记本驱动包" 2>nul
md "系统维护\驱动包\万能驱动包" 2>nul
md "系统维护\装机工具\激活工具" 2>nul
md "系统维护\装机工具\分区工具" 2>nul
md "系统维护\装机工具\备份还原工具" 2>nul
md "系统维护\装机工具\硬件检测工具" 2>nul
md "系统维护\系统补丁\Windows更新包" 2>nul
md "系统维护\系统补丁\安全补丁" 2>nul
md "系统维护\PE工具扩展\额外工具包" 2>nul
md "系统维护\PE工具扩展\自定义脚本" 2>nul
md "工作文档\项目文件" 2>nul
md "工作文档\文档资料\技术文档" 2>nul
md "工作文档\文档资料\学习资料" 2>nul
md "工作文档\文档资料\参考手册" 2>nul
md "工作文档\临时文件" 2>nul
md "工作文档\待整理" 2>nul
md "个人文件\图片\照片" 2>nul
md "个人文件\图片\截图" 2>nul
md "个人文件\图片\设计素材" 2>nul
md "个人文件\视频\录制视频" 2>nul
md "个人文件\视频\下载视频" 2>nul
md "个人文件\音乐" 2>nul
md "个人文件\下载\软件安装包" 2>nul
md "个人文件\下载\浏览器下载" 2>nul
md "个人文件\下载\其他下载" 2>nul
md "个人文件\桌面备份" 2>nul
md "软件工具\便携软件\办公软件" 2>nul
md "软件工具\便携软件\开发工具" 2>nul
md "软件工具\便携软件\媒体工具" 2>nul
md "软件工具\便携软件\实用工具" 2>nul
md "软件工具\安装程序\常用软件" 2>nul
md "软件工具\安装程序\专业软件" 2>nul
md "软件工具\绿色软件" 2>nul
md "备份文件\系统备份\系统镜像备份" 2>nul
md "备份文件\系统备份\驱动备份" 2>nul
md "备份文件\文件备份\重要文档备份" 2>nul
md "备份文件\文件备份\配置文件备份" 2>nul
md "备份文件\时间戳备份" 2>nul
md "其他\测试文件" 2>nul
md "其他\临时存储" 2>nul
md "其他\待删除" 2>nul

echo.
echo Directory structure created!
echo Please check in File Explorer: %ROOT%
pause
