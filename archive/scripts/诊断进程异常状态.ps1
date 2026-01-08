# 诊断 Cursor Server 进程异常状态
# 专门用于检测"进程存在但未监听端口且无令牌文件"的情况

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "诊断 Cursor Server 进程异常状态" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 检查进程是否存在
Write-Host "【步骤 1/4】检查进程状态..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    $processInfo = ssh myserver @"
ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep | head -5
"@ 2>&1
    
    if ($processInfo -and $processInfo.Trim() -ne "") {
        Write-Host "  ✓ 发现 Cursor 相关进程:" -ForegroundColor Green
        $processInfo | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
        
        # 统计进程数量
        $processCount = ($processInfo -split "`n" | Where-Object { $_.Trim() -ne "" }).Count
        Write-Host ""
        Write-Host "  进程数量: $processCount" -ForegroundColor Cyan
    } else {
        Write-Host "  ✗ 未发现运行中的 Cursor 进程" -ForegroundColor Red
        Write-Host ""
        Write-Host "  这意味着 Cursor Server 未启动" -ForegroundColor Yellow
        Write-Host "  建议: 在 Cursor 中重新连接到服务器" -ForegroundColor Yellow
        exit 0
    }
} catch {
    Write-Host "  ✗ 无法检查进程状态: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 步骤 2: 检查进程是否响应
Write-Host "【步骤 2/4】检查进程响应性..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    $responseTest = ssh myserver "kill -0 \$(pgrep -f cursor-server | head -1) 2>&1 && echo '响应' || echo '无响应'" 2>&1
    
    if ($responseTest -match "响应") {
        Write-Host "  ✓ 进程响应正常" -ForegroundColor Green
    } else {
        Write-Host "  ✗ 进程无响应（可能是僵尸进程）" -ForegroundColor Red
    }
} catch {
    Write-Host "  ⚠ 无法测试进程响应性" -ForegroundColor Yellow
}
Write-Host ""

# 步骤 3: 检查进程是否监听端口（关键检查）
Write-Host "【步骤 3/4】检查端口监听状态（关键）..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    $portCheck = ssh myserver "ss -tlnp 2>/dev/null | grep cursor || netstat -tlnp 2>/dev/null | grep cursor || echo '无端口监听'" 2>&1
    
    if ($portCheck -match "无端口监听" -or ($portCheck.Trim() -eq "")) {
        Write-Host "  ✗ 进程未监听任何端口" -ForegroundColor Red
        Write-Host ""
        Write-Host "  ⚠️  这是异常状态！" -ForegroundColor Yellow
        Write-Host "  正常情况: Cursor Server 应该监听一个端口（通常是 4xxxx 范围）" -ForegroundColor Yellow
        $portIssue = $true
    } else {
        Write-Host "  ✓ 进程正在监听端口:" -ForegroundColor Green
        $portCheck | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
        $portIssue = $false
    }
} catch {
    Write-Host "  ⚠ 无法检查端口状态" -ForegroundColor Yellow
    $portIssue = $true
}
Write-Host ""

# 步骤 4: 检查令牌文件（关键检查）
Write-Host "【步骤 4/4】检查令牌文件（关键）..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

try {
    $tokenCheck = ssh myserver @"
TOKEN_FILES=\$(ls -1 /run/user/0/cursor-remote-code.token.* 2>/dev/null | wc -l)
if [ \$TOKEN_FILES -gt 0 ]; then
    echo "找到 \$TOKEN_FILES 个令牌文件:"
    ls -la /run/user/0/cursor-remote-code.token.* 2>/dev/null | head -5
else
    echo "无令牌文件"
fi
"@ 2>&1
    
    if ($tokenCheck -match "无令牌文件" -or ($tokenCheck -match "cannot access")) {
        Write-Host "  ✗ 令牌文件不存在" -ForegroundColor Red
        Write-Host ""
        Write-Host "  ⚠️  这是异常状态！" -ForegroundColor Yellow
        Write-Host "  正常情况: Cursor Server 启动时会创建令牌文件" -ForegroundColor Yellow
        $tokenIssue = $true
    } else {
        Write-Host "  ✓ 令牌文件存在:" -ForegroundColor Green
        $tokenCheck | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
        $tokenIssue = $false
    }
} catch {
    Write-Host "  ⚠ 无法检查令牌文件" -ForegroundColor Yellow
    $tokenIssue = $true
}
Write-Host ""

# 综合诊断结果
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "诊断结果" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($portIssue -and $tokenIssue) {
    Write-Host "🔴 严重异常: 进程存在但未完成初始化" -ForegroundColor Red
    Write-Host ""
    Write-Host "问题分析:" -ForegroundColor Yellow
    Write-Host "  - 进程在运行，但未监听端口" -ForegroundColor White
    Write-Host "  - 进程在运行，但未创建令牌文件" -ForegroundColor White
    Write-Host "  - 这表明进程卡在初始化阶段，无法正常工作" -ForegroundColor White
    Write-Host ""
    Write-Host "可能的原因:" -ForegroundColor Yellow
    Write-Host "  1. 进程启动时遇到错误，但未完全退出" -ForegroundColor White
    Write-Host "  2. 资源不足（内存/文件描述符）导致初始化失败" -ForegroundColor White
    Write-Host "  3. 权限问题导致无法创建令牌文件或监听端口" -ForegroundColor White
    Write-Host "  4. 网络问题导致进程等待超时" -ForegroundColor White
    Write-Host ""
    Write-Host "解决方案:" -ForegroundColor Yellow
    Write-Host "  1. 强制停止所有 Cursor 进程" -ForegroundColor White
    Write-Host "  2. 清理所有临时文件和锁文件" -ForegroundColor White
    Write-Host "  3. 在 Cursor 中重新连接" -ForegroundColor White
    Write-Host ""
    Write-Host "执行修复命令:" -ForegroundColor Cyan
    Write-Host "  ssh myserver 'pkill -9 -f cursor-server; pkill -9 -f cursor-remote; rm -f /run/user/0/cursor-remote-*'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "或运行修复脚本:" -ForegroundColor Cyan
    Write-Host "  .\快速修复WebSocket1006.ps1" -ForegroundColor Gray
    
} elseif ($portIssue) {
    Write-Host "🟡 部分异常: 进程存在但未监听端口" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "问题分析:" -ForegroundColor Yellow
    Write-Host "  - 进程在运行，且有令牌文件" -ForegroundColor White
    Write-Host "  - 但进程未监听端口，无法接受连接" -ForegroundColor White
    Write-Host "  - 这表明进程卡在端口绑定阶段" -ForegroundColor White
    Write-Host ""
    
    # 深入诊断端口绑定失败的原因
    Write-Host "深入诊断端口绑定失败原因..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        # 检查进程启动参数，看看它想监听哪个端口
        Write-Host "1. 检查进程启动参数..." -ForegroundColor Yellow
        $processArgs = ssh myserver "ps aux | grep cursor-server | grep -v grep | head -1 | awk '{for(i=11;i<=NF;i++) printf \"%s \", \$i; print \"\"}'" 2>&1
        if ($processArgs -and $processArgs.Trim() -ne "") {
            Write-Host "   进程参数:" -ForegroundColor Gray
            Write-Host "   $processArgs" -ForegroundColor DarkGray
            
            # 尝试从参数中提取端口号
            if ($processArgs -match '--port\s+(\d+)' -or $processArgs -match ':(\d{4,5})') {
                $portNumber = $matches[1]
                Write-Host "   可能的目标端口: $portNumber" -ForegroundColor Cyan
                
                # 检查该端口是否被占用
                Write-Host ""
                Write-Host "2. 检查端口 $portNumber 是否被占用..." -ForegroundColor Yellow
                $portInUse = ssh myserver "ss -tlnp | grep ':$portNumber ' || netstat -tlnp | grep ':$portNumber '" 2>&1
                if ($portInUse -and $portInUse.Trim() -ne "") {
                    Write-Host "   ⚠️  端口 $portNumber 已被占用:" -ForegroundColor Red
                    Write-Host "   $portInUse" -ForegroundColor Gray
                    Write-Host "   这可能是端口绑定失败的原因！" -ForegroundColor Yellow
                } else {
                    Write-Host "   ✓ 端口 $portNumber 未被占用" -ForegroundColor Green
                }
            }
        }
        
        Write-Host ""
        Write-Host "3. 检查进程启动时间和状态..." -ForegroundColor Yellow
        $processStatus = ssh myserver "ps -o pid,etime,stat,cmd -p \$(pgrep -f cursor-server | head -1)" 2>&1
        if ($processStatus) {
            Write-Host "   $processStatus" -ForegroundColor Gray
        }
        
        Write-Host ""
        Write-Host "4. 检查系统资源（文件描述符限制）..." -ForegroundColor Yellow
        $ulimit = ssh myserver "ulimit -n" 2>&1
        $openFiles = ssh myserver "lsof -p \$(pgrep -f cursor-server | head -1) 2>/dev/null | wc -l" 2>&1
        Write-Host "   文件描述符限制: $ulimit" -ForegroundColor Gray
        Write-Host "   进程已打开文件数: $openFiles" -ForegroundColor Gray
        
        Write-Host ""
        Write-Host "5. 检查可能的错误日志..." -ForegroundColor Yellow
        $logs = ssh myserver "journalctl -u ssh -n 20 --no-pager 2>/dev/null | grep -i cursor | tail -5 || echo '未找到相关日志'" 2>&1
        if ($logs -and $logs -notmatch "未找到相关日志") {
            Write-Host "   发现相关日志:" -ForegroundColor Yellow
            Write-Host "   $logs" -ForegroundColor Gray
        } else {
            Write-Host "   未找到相关错误日志" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "   ⚠ 深入诊断时出现错误: $_" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "可能的原因:" -ForegroundColor Yellow
    Write-Host "  1. 端口被其他进程占用" -ForegroundColor White
    Write-Host "  2. 文件描述符限制不足" -ForegroundColor White
    Write-Host "  3. 权限问题导致无法绑定端口" -ForegroundColor White
    Write-Host "  4. 进程启动参数错误" -ForegroundColor White
    Write-Host "  5. 网络接口问题" -ForegroundColor White
    Write-Host ""
    Write-Host "解决方案:" -ForegroundColor Yellow
    Write-Host "  1. 强制停止所有 Cursor 进程" -ForegroundColor White
    Write-Host "  2. 清理所有临时文件和锁文件" -ForegroundColor White
    Write-Host "  3. 在 Cursor 中重新连接" -ForegroundColor White
    Write-Host ""
    Write-Host "执行修复命令:" -ForegroundColor Cyan
    Write-Host "  ssh myserver 'pkill -9 -f cursor-server; pkill -9 -f cursor-remote; rm -f /run/user/0/cursor-remote-*'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "或运行修复脚本:" -ForegroundColor Cyan
    Write-Host "  .\快速修复WebSocket1006.ps1" -ForegroundColor Gray
    
} elseif ($tokenIssue) {
    Write-Host "🟡 部分异常: 进程存在但无令牌文件" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "建议: 检查权限或重启进程" -ForegroundColor White
    
} else {
    Write-Host "🟢 进程状态正常" -ForegroundColor Green
    Write-Host ""
    Write-Host "如果仍然出现 WebSocket 1006 错误，可能是其他原因:" -ForegroundColor Yellow
    Write-Host "  - SSH 端口转发问题" -ForegroundColor White
    Write-Host "  - 网络延迟或超时" -ForegroundColor White
    Write-Host "  - 防火墙规则" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 提供快速修复选项
if ($portIssue -or ($portIssue -and $tokenIssue)) {
    $fixNow = Read-Host "是否现在执行修复? (Y/N，默认Y)"
    if ($fixNow -ne "N" -and $fixNow -ne "n") {
        Write-Host ""
        Write-Host "执行修复..." -ForegroundColor Cyan
        
        try {
            Write-Host "1. 停止所有 Cursor 进程..." -ForegroundColor Yellow
            $killResult = ssh myserver "pkill -9 -f cursor-server; pkill -9 -f cursor-remote; sleep 2; ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep | wc -l" 2>&1
            $remaining = [int]($killResult -replace '\D','')
            if ($remaining -eq 0) {
                Write-Host "   ✓ 所有进程已停止" -ForegroundColor Green
            } else {
                Write-Host "   ⚠ 仍有 $remaining 个进程在运行，尝试再次强制停止..." -ForegroundColor Yellow
                ssh myserver "pkill -9 -f cursor; sleep 1" 2>&1 | Out-Null
            }
            
            Write-Host "2. 清理临时文件和锁文件..." -ForegroundColor Yellow
            ssh myserver "rm -f /run/user/0/cursor-remote-* 2>/dev/null; rm -f /run/user/*/cursor-remote-* 2>/dev/null; rm -rf /tmp/cursor-* 2>/dev/null; rm -rf /tmp/vscode-* 2>/dev/null; echo '文件已清理'" 2>&1 | Out-Null
            Write-Host "   ✓ 文件已清理" -ForegroundColor Green
            
            Write-Host "3. 等待进程完全退出..." -ForegroundColor Yellow
            Start-Sleep -Seconds 3
            Write-Host "   ✓ 等待完成" -ForegroundColor Green
            
            Write-Host ""
            Write-Host "修复完成！" -ForegroundColor Green
            Write-Host ""
            Write-Host "下一步:" -ForegroundColor Yellow
            Write-Host "  1. 在 Cursor 中点击左下角 'SSH: myserver' 状态" -ForegroundColor White
            Write-Host "  2. 选择 'Close Remote Connection'" -ForegroundColor White
            Write-Host "  3. 等待 5-10 秒，确保连接完全关闭" -ForegroundColor White
            Write-Host "  4. 重新连接到 myserver" -ForegroundColor White
            Write-Host ""
            Write-Host "提示: 如果问题仍然存在，可能需要完全重置 Cursor Server" -ForegroundColor Cyan
            Write-Host "  执行: ssh myserver 'rm -rf ~/.cursor-server/'" -ForegroundColor Gray
            Write-Host "  然后重新连接（会重新下载安装）" -ForegroundColor Gray
            
        } catch {
            Write-Host "   ✗ 修复过程中出现错误: $_" -ForegroundColor Red
        }
    }
}

Write-Host ""

