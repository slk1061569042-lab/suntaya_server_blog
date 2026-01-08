# 查看服务器上的 Cursor Server 状态
# 此脚本用于检查服务器上 Cursor Server 的安装和运行状态

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "查看 Cursor Server 状态" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 SSH 连接
Write-Host "【检查 SSH 连接】" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $sshTest = ssh -o ConnectTimeout=5 -o BatchMode=yes myserver "echo 'SSH连接正常'" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ SSH 连接正常" -ForegroundColor Green
    } else {
        Write-Host "   ✗ SSH 连接异常" -ForegroundColor Red
        Write-Host "   请先确保 SSH 连接正常" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "   ✗ SSH 连接失败: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 1. 检查 Cursor Server 目录
Write-Host "【1. Cursor Server 目录】" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $dirInfo = ssh myserver @"
echo '=== 目录检查 ==='
if [ -d ~/.cursor-server ]; then
    echo '✓ 目录存在: ~/.cursor-server'
    echo ''
    echo '目录大小:'
    du -sh ~/.cursor-server 2>/dev/null
    echo ''
    echo '目录内容（前10项）:'
    ls -lah ~/.cursor-server 2>/dev/null | head -10
    echo ''
    echo '子目录列表:'
    find ~/.cursor-server -maxdepth 2 -type d 2>/dev/null | head -10
else
    echo '✗ 目录不存在: ~/.cursor-server'
    echo '  （Cursor Server 尚未安装或已被删除）'
fi
"@ 2>&1
    
    Write-Host $dirInfo -ForegroundColor Gray
} catch {
    Write-Host "   ⚠ 检查目录时出现异常: $_" -ForegroundColor Yellow
}
Write-Host ""

# 2. 检查运行中的进程
Write-Host "【2. 运行中的进程】" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $processInfo = ssh myserver @"
echo '=== 进程检查 ==='
PROCESSES=\$(ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep)
if [ -z "\$PROCESSES" ]; then
    echo '✗ 没有运行中的 Cursor 相关进程'
else
    echo '✓ 发现以下进程:'
    echo "\$PROCESSES"
    echo ''
    echo '进程数量:'
    echo "\$PROCESSES" | wc -l
fi
"@ 2>&1
    
    Write-Host $processInfo -ForegroundColor Gray
} catch {
    Write-Host "   ⚠ 检查进程时出现异常: $_" -ForegroundColor Yellow
}
Write-Host ""

# 3. 检查版本信息
Write-Host "【3. 版本信息】" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $versionInfo = ssh myserver @"
echo '=== 版本检查 ==='
if [ -d ~/.cursor-server ]; then
    # 查找版本文件
    VERSION_FILE=\$(find ~/.cursor-server -name '*.version' -o -name 'version' 2>/dev/null | head -1)
    if [ -n "\$VERSION_FILE" ]; then
        echo '版本文件:'
        cat "\$VERSION_FILE" 2>/dev/null
        echo ''
    fi
    
    # 查找可执行文件
    SERVER_BIN=\$(find ~/.cursor-server -type f -name 'cursor-server' -o -name 'server.sh' 2>/dev/null | head -1)
    if [ -n "\$SERVER_BIN" ]; then
        echo '服务器可执行文件:'
        ls -lh "\$SERVER_BIN" 2>/dev/null
        echo ''
        echo '文件路径:'
        echo "\$SERVER_BIN"
    fi
    
    # 检查安装时间
    echo ''
    echo '安装时间（目录创建时间）:'
    stat -c '%y' ~/.cursor-server 2>/dev/null || stat -f '%Sm' ~/.cursor-server 2>/dev/null
else
    echo '✗ 无法检查版本（目录不存在）'
fi
"@ 2>&1
    
    Write-Host $versionInfo -ForegroundColor Gray
} catch {
    Write-Host "   ⚠ 检查版本时出现异常: $_" -ForegroundColor Yellow
}
Write-Host ""

# 4. 检查锁文件和临时文件
Write-Host "【4. 锁文件和临时文件】" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $lockInfo = ssh myserver @"
echo '=== 锁文件检查 ==='
LOCK_FILES=\$(find /run/user -name 'cursor-remote-*' 2>/dev/null)
if [ -z "\$LOCK_FILES" ]; then
    echo '✓ 没有发现锁文件'
else
    echo '⚠ 发现以下锁文件:'
    echo "\$LOCK_FILES"
    echo ''
    for lock in \$LOCK_FILES; do
        echo "文件: \$lock"
        ls -lh "\$lock" 2>/dev/null
    done
fi

echo ''
echo '=== 临时文件检查 ==='
TMP_FILES=\$(find /tmp -name 'cursor-*' -o -name '.cursor-*' 2>/dev/null | head -10)
if [ -z "\$TMP_FILES" ]; then
    echo '✓ 没有发现临时文件'
else
    echo '⚠ 发现以下临时文件:'
    echo "\$TMP_FILES"
fi
"@ 2>&1
    
    Write-Host $lockInfo -ForegroundColor Gray
} catch {
    Write-Host "   ⚠ 检查锁文件时出现异常: $_" -ForegroundColor Yellow
}
Write-Host ""

# 5. 检查磁盘使用情况
Write-Host "【5. 磁盘使用情况】" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $diskInfo = ssh myserver @"
echo '=== 磁盘空间 ==='
df -h ~ 2>/dev/null | tail -1
echo ''
echo 'Cursor Server 目录大小:'
if [ -d ~/.cursor-server ]; then
    du -sh ~/.cursor-server 2>/dev/null
    echo ''
    echo '详细大小（前10个最大的目录）:'
    du -h ~/.cursor-server 2>/dev/null | sort -rh | head -10
else
    echo '目录不存在'
fi
"@ 2>&1
    
    Write-Host $diskInfo -ForegroundColor Gray
} catch {
    Write-Host "   ⚠ 检查磁盘时出现异常: $_" -ForegroundColor Yellow
}
Write-Host ""

# 6. 检查网络连接（如果进程在运行）
Write-Host "【6. 网络连接状态】" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $networkInfo = ssh myserver @"
echo '=== 网络连接检查 ==='
PROCESS_PIDS=\$(ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep | awk '{print \$2}')
if [ -z "\$PROCESS_PIDS" ]; then
    echo '✗ 没有运行中的进程，无法检查网络连接'
else
    echo '进程的网络连接:'
    for pid in \$PROCESS_PIDS; do
        echo "进程 PID: \$pid"
        netstat -tunp 2>/dev/null | grep \$pid || ss -tunp 2>/dev/null | grep \$pid || echo '  无法获取网络信息'
    done
fi
"@ 2>&1
    
    Write-Host $networkInfo -ForegroundColor Gray
} catch {
    Write-Host "   ⚠ 检查网络时出现异常: $_" -ForegroundColor Yellow
}
Write-Host ""

# 总结
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "检查完成" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "提示：" -ForegroundColor Yellow
Write-Host "  • 如果目录不存在，说明 Cursor Server 尚未安装" -ForegroundColor White
Write-Host "  • 如果目录存在但没有进程，说明已安装但未运行" -ForegroundColor White
Write-Host "  • 如果进程在运行，说明 Cursor 正在使用远程连接" -ForegroundColor White
Write-Host ""

