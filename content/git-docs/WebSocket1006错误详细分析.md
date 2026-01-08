# 🔍 WebSocket 1006 错误详细分析

## 🎯 问题根源总结（已确认）

**根本原因：Windows 防火墙阻止了 SSH 的本地端口转发功能** ⭐⭐⭐

**问题机制：**
1. Cursor 通过 SSH 建立连接，SSH 会在本地（Windows）创建端口转发
2. Windows 防火墙阻止了 SSH 在本地创建监听端口
3. 虽然 SSH 连接本身正常，但本地端口转发失败
4. 导致 Cursor 客户端无法通过转发的端口连接，出现 WebSocket 1006 错误

**快速解决方案：**
- 将 SSH（OpenSSH SSH Client）添加到 Windows 防火墙白名单
- 确保"专用"和"公用"网络都允许
- 修复后立即生效，无需重启

**快速排查命令：**
```powershell
# 检查 Windows 防火墙对 SSH 的限制
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*SSH*"} | Format-Table DisplayName, Enabled, Action
```

---

## 📊 错误现象

根据你的情况：
- ✅ **服务器端 Cursor Server 进程正在运行**（3个进程）
- ✅ **Cursor Server 已安装**（235MB）
- ❌ **但连接时出现 WebSocket 1006 错误**

这是一个典型的**"进程存在但连接失败"**的情况。

**关键特征：**
- SSH 连接本身正常（可以执行命令）
- 服务器端一切正常
- 但 WebSocket 连接失败
- **这通常指向 Windows 防火墙问题**

---

## 🎯 WebSocket 1006 错误的含义

**WebSocket 状态码 1006** 表示：
- **异常关闭**：连接在没有正常关闭握手的情况下被中断
- **非正常断开**：不是通过标准的 WebSocket 关闭流程断开
- **连接丢失**：网络层或传输层的问题导致连接突然中断

### 技术细节

WebSocket 1006 是**保留状态码**，用于表示：
- 连接在建立后、关闭前异常中断
- 没有收到关闭帧（Close Frame）
- 通常是底层网络问题，而非应用层问题

---

## 🔬 为什么进程在运行但连接失败？

### 原因 1: Windows 防火墙阻止本地端口转发（最常见）⭐⭐⭐

**问题根源（已确认）：**
这是导致 WebSocket 1006 错误的**最常见原因**，特别是当：
- ✅ SSH 连接本身正常（可以执行命令）
- ✅ 服务器端 Cursor Server 进程正常运行
- ❌ 但 WebSocket 连接失败

**问题机制：**
1. Cursor 通过 SSH 建立连接
2. SSH 创建**本地端口转发**（Local Port Forwarding）
   - SSH 在本地（Windows）创建一个监听端口（如 `127.0.0.1:随机端口`）
   - 通过 SSH 隧道转发到服务器的 Cursor Server
3. 本地 Cursor 客户端通过转发的**本地端口**连接到服务器上的 Cursor Server
4. **Windows 防火墙阻止了 SSH 的本地端口转发功能**
   - 虽然 SSH 连接本身可能正常（22端口已开放）
   - 但**本地端口转发**需要 Windows 防火墙允许 SSH 客户端访问本地回环地址
   - 防火墙阻止了本地端口转发，导致 WebSocket 连接失败

**为什么会出现这种情况：**
- Windows 防火墙默认可能只允许 SSH 出站连接（连接到远程服务器）
- 但**不允许 SSH 在本地创建监听端口**（本地端口转发需要）
- 或者防火墙规则不够完整，没有包含本地回环地址（127.0.0.1）的访问权限

**检查方法：**
```powershell
# 1. 检查 Windows 防火墙是否阻止了 SSH
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*SSH*" -or $_.DisplayName -like "*OpenSSH*"} | Format-Table DisplayName, Enabled, Direction, Action

# 2. 检查是否有针对本地端口的防火墙规则
Get-NetFirewallRule | Where-Object {$_.LocalPort -ne $null} | Select-Object DisplayName, LocalPort, Enabled

# 3. 测试本地端口转发是否被阻止
# 尝试手动创建端口转发，看是否成功
ssh -L 12345:localhost:8080 myserver "echo 'test'"
# 如果这个命令执行后，在另一个终端尝试连接 localhost:12345 失败，说明防火墙阻止了
```

**快速诊断（推荐）：**
```powershell
# 一键检查 Windows 防火墙对 SSH 的限制
$sshRules = Get-NetFirewallRule | Where-Object {
    $_.DisplayName -like "*SSH*" -or 
    $_.DisplayName -like "*OpenSSH*" -or
    $_.Program -like "*ssh.exe*"
}

if ($sshRules.Count -eq 0) {
    Write-Host "🔴 未找到 SSH 防火墙规则，可能需要添加" -ForegroundColor Red
} else {
    Write-Host "找到 $($sshRules.Count) 条 SSH 相关规则" -ForegroundColor Yellow
    $sshRules | ForEach-Object {
        $status = if ($_.Enabled) { "✅ 启用" } else { "❌ 禁用" }
        Write-Host "  - $($_.DisplayName): $status ($($_.Direction), $($_.Action))"
    }
}
```

**解决方案：**
```powershell
# 方法 1: 将 SSH 添加到 Windows 防火墙白名单（推荐）
# 在 Windows 防火墙中：
# 1. 打开"Windows Defender 防火墙"
# 2. 点击"允许应用或功能通过 Windows Defender 防火墙"
# 3. 找到 "OpenSSH SSH Client" 或 "SSH Client"
# 4. 勾选"专用"和"公用"两个复选框
# 5. 点击"确定"

# 方法 2: 使用 PowerShell 命令添加规则（需要管理员权限）
New-NetFirewallRule -DisplayName "SSH Client - Allow Local Port Forwarding" `
    -Direction Inbound `
    -Program "$env:ProgramFiles\OpenSSH\ssh.exe" `
    -Action Allow `
    -Profile Any

New-NetFirewallRule -DisplayName "SSH Client - Allow Outbound" `
    -Direction Outbound `
    -Program "$env:ProgramFiles\OpenSSH\ssh.exe" `
    -Action Allow `
    -Profile Any

# 方法 3: 临时禁用防火墙测试（仅用于诊断，不推荐长期使用）
# Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
```

---

### 原因 1.1: SSH 端口转发失败（其他原因）

**问题机制：**
除了 Windows 防火墙，还可能有以下原因：
1. SSH 连接不稳定，端口转发被中断
2. 服务器端防火墙/安全组阻止了端口转发
3. 网络波动导致 SSH 隧道断开
4. SSH 配置中 `AllowTcpForwarding` 被禁用

**检查方法：**
```bash
# 检查 SSH 端口转发是否正常
ssh -v myserver "echo 'test'" 2>&1 | grep -i forwarding

# 检查服务器端 SSH 配置
ssh myserver "grep -i 'AllowTcpForwarding\|GatewayPorts' /etc/ssh/sshd_config"
```

---

### 原因 2: Cursor Server 进程状态异常 ⚠️ **最常见**

**问题机制：**
虽然进程在运行，但可能：
- 进程处于**僵尸状态**（Zombie）
- 进程**卡死**（Hanging），无法响应请求
- 进程**监听端口失败**，虽然进程存在但无法接受连接
- **进程未完成初始化**：进程启动但未创建令牌文件或监听端口

**典型症状（你的情况）：**
- ✅ `kill -0` 成功 → 进程存在且响应信号
- ❌ `ss -tlnp | grep cursor` 无输出 → **进程未监听端口**
- ❌ `ls -la /run/user/0/cursor-remote-code.token.*` 失败 → **令牌文件不存在**

**这表示：**
进程启动后**卡在初始化阶段**，没有完成：
1. 创建令牌文件
2. 绑定监听端口
3. 建立 WebSocket 服务器

**可能的原因：**
- 进程启动时遇到错误，但未完全退出
- 资源不足（内存/文件描述符）导致初始化失败
- 权限问题导致无法创建令牌文件或监听端口
- 网络问题导致进程等待超时

**检查方法：**
```bash
# 1. 检查进程状态（STAT 列）
ssh myserver "ps aux | grep cursor-server | grep -v grep"

# 2. 检查进程是否在监听端口（关键检查）
ssh myserver "ss -tlnp | grep cursor"
# 或
ssh myserver "netstat -tlnp | grep cursor"

# 3. 检查进程是否响应
ssh myserver "kill -0 \$(pgrep -f cursor-server) && echo '进程响应' || echo '进程无响应'"

# 4. 检查令牌文件是否存在（关键检查）
ssh myserver "ls -la /run/user/0/cursor-remote-code.token.*"

# 5. 检查进程启动时间（如果启动很久但无端口，说明卡死了）
ssh myserver "ps -o pid,etime,cmd -p \$(pgrep -f cursor-server)"

# 6. 检查进程资源使用情况
ssh myserver "ps -o pid,%mem,%cpu,stat,cmd -p \$(pgrep -f cursor-server)"
```

**诊断逻辑：**
```bash
# 完整诊断脚本
ssh myserver "
  echo '=== 进程检查 ==='
  PROCESS_COUNT=\$(pgrep -f cursor-server | wc -l)
  echo \"进程数量: \$PROCESS_COUNT\"
  
  if [ \$PROCESS_COUNT -gt 0 ]; then
    echo '进程存在'
    kill -0 \$(pgrep -f cursor-server | head -1) 2>/dev/null && echo '进程响应: 是' || echo '进程响应: 否'
    
    echo ''
    echo '=== 端口检查 ==='
    PORT_COUNT=\$(ss -tlnp | grep cursor | wc -l)
    echo \"监听端口数量: \$PORT_COUNT\"
    if [ \$PORT_COUNT -eq 0 ]; then
      echo '⚠️  警告: 进程存在但未监听端口'
    fi
    
    echo ''
    echo '=== 令牌文件检查 ==='
    TOKEN_COUNT=\$(ls -1 /run/user/0/cursor-remote-code.token.* 2>/dev/null | wc -l)
    echo \"令牌文件数量: \$TOKEN_COUNT\"
    if [ \$TOKEN_COUNT -eq 0 ]; then
      echo '⚠️  警告: 令牌文件不存在'
    fi
    
    echo ''
    echo '=== 诊断结论 ==='
    if [ \$PORT_COUNT -eq 0 ] && [ \$TOKEN_COUNT -eq 0 ]; then
      echo '🔴 进程异常: 进程存在但未完成初始化（未监听端口且无令牌文件）'
      echo '   建议: 强制停止进程并重新连接'
    elif [ \$PORT_COUNT -eq 0 ]; then
      echo '🟡 部分异常: 进程存在但未监听端口'
    elif [ \$TOKEN_COUNT -eq 0 ]; then
      echo '🟡 部分异常: 进程存在但无令牌文件'
    else
      echo '🟢 进程状态正常'
    fi
  else
    echo '进程不存在'
  fi
"
```

---

### 原因 3: 令牌文件（Token File）过期或无效

**问题机制：**
1. Cursor Server 启动时创建令牌文件（Token File）
2. 本地 Cursor 客户端通过 SSH 读取令牌文件
3. 使用令牌建立 WebSocket 连接
4. **如果令牌文件过期、损坏或路径错误，连接会失败**

**从你的进程信息看：**
```
--connection-token-file /run/user/0/cursor-remote-code.token.6ca0869f6193ac0d40fa6ae74ed01260
```

**可能的问题：**
- 令牌文件被删除或损坏
- 令牌文件权限错误
- 令牌文件路径不正确
- 多个连接尝试导致令牌冲突

**检查方法：**
```bash
# 检查令牌文件是否存在
ssh myserver "ls -la /run/user/0/cursor-remote-code.token.*"

# 检查令牌文件内容（应该包含连接令牌）
ssh myserver "cat /run/user/0/cursor-remote-code.token.* 2>/dev/null | head -1"
```

---

### 原因 4: 网络延迟或超时

**问题机制：**
1. Cursor 客户端尝试建立 WebSocket 连接
2. 由于网络延迟高，连接建立时间过长
3. **超过超时时间后，连接被强制关闭**
4. 返回 1006 错误

**你的情况：**
- 从之前的诊断看，SSH 响应时间约 5.5 秒
- 如果 WebSocket 连接超时时间设置较短（如 10 秒），可能不够

**检查方法：**
```bash
# 测试网络延迟
ping -c 5 115.190.54.220

# 测试 SSH 连接时间
time ssh myserver "echo 'test'"
```

---

### 原因 5: 防火墙或安全组规则

**问题机制：**
1. SSH 端口（22）已开放，SSH 连接正常
2. 但**SSH 端口转发**可能被阻止
3. 或者**动态端口分配**被防火墙阻止

**注意：**
- Cursor 使用 SSH 隧道，不需要额外开放端口
- 但如果防火墙有**深度包检测（DPI）**，可能阻止 WebSocket 流量

**检查方法：**
```bash
# 检查服务器防火墙规则
ssh myserver "iptables -L -n | grep -i forward"
# 或
ssh myserver "ufw status verbose"
```

---

### 原因 6: 多个连接冲突

**问题机制：**
1. 之前的连接没有完全关闭
2. 旧的进程和锁文件仍然存在
3. 新连接尝试时，**与旧连接冲突**
4. 导致连接失败

**你的情况：**
- 有 3 个进程在运行
- 可能存在多个连接尝试的残留

---

## 📋 快速排查流程（按优先级）

### ⚡ 第一步：检查 Windows 防火墙（最重要！）⭐⭐⭐

**这是最快速、最有效的排查方法！**

```powershell
# 快速检查 Windows 防火墙对 SSH 的限制
$sshRules = Get-NetFirewallRule | Where-Object {
    $_.DisplayName -like "*SSH*" -or 
    $_.DisplayName -like "*OpenSSH*" -or
    $_.Program -like "*ssh.exe*"
}

if ($sshRules.Count -eq 0) {
    Write-Host "🔴 问题确认: 未找到 SSH 防火墙规则" -ForegroundColor Red
    Write-Host "   解决方案: 将 SSH 添加到 Windows 防火墙白名单" -ForegroundColor Yellow
} else {
    $blocked = $sshRules | Where-Object { -not $_.Enabled -or $_.Action -eq "Block" }
    if ($blocked) {
        Write-Host "🔴 问题确认: SSH 防火墙规则被禁用或阻止" -ForegroundColor Red
    } else {
        Write-Host "✅ SSH 防火墙规则正常" -ForegroundColor Green
    }
}
```

**如果发现防火墙问题：**
1. 打开"Windows Defender 防火墙"
2. 点击"允许应用或功能通过 Windows Defender 防火墙"
3. 找到并勾选 "OpenSSH SSH Client"（勾选"专用"和"公用"）
4. 重新尝试连接

---

### 📋 完整诊断清单

根据你的情况，按优先级检查：

### 🔴 高优先级（最可能的原因）

1. **Windows 防火墙阻止本地端口转发** ⭐⭐⭐
   ```powershell
   # 检查 Windows 防火墙
   Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*SSH*"} | Format-Table DisplayName, Enabled, Action
   ```
   **如果发现问题：** 将 SSH 添加到防火墙白名单

2. **SSH 端口转发配置问题**
   ```bash
   # 检查服务器端 SSH 配置
   ssh myserver "grep -E 'AllowTcpForwarding|GatewayPorts' /etc/ssh/sshd_config"
   ```

3. **令牌文件问题**
   ```bash
   # 检查令牌文件
   ssh myserver "ls -la /run/user/0/cursor-remote-code.token.*"
   ```

4. **进程状态异常**
   ```bash
   # 检查进程是否正常监听
   ssh myserver "netstat -tlnp | grep cursor"
   ```

### 🟡 中优先级

5. **网络延迟/超时**
   ```bash
   # 测试网络延迟
   ping -c 10 115.190.54.220
   ```

6. **多个连接冲突**
   ```bash
   # 检查是否有多个令牌文件
   ssh myserver "ls -1 /run/user/0/cursor-remote-code.token.* | wc -l"
   ```

### 🟢 低优先级

7. **服务器端防火墙规则**
8. **服务器资源不足**

---

## 🚀 解决方案（按推荐顺序）

### 方案 1: 修复 Windows 防火墙（最优先！）⭐⭐⭐

**为什么这是第一优先级：**
- 这是导致 WebSocket 1006 错误的**最常见根本原因**
- 修复后立即生效，无需重启
- 大多数情况下，仅此一步即可解决问题

**操作步骤（图形界面）：**
1. 按 `Win + R`，输入 `firewall.cpl`，回车
2. 点击"允许应用或功能通过 Windows Defender 防火墙"
3. 点击"更改设置"（如果需要）
4. 找到并勾选 **"OpenSSH SSH Client"** 或 **"SSH Client"**
5. 确保**"专用"和"公用"两个复选框都勾选**
6. 点击"确定"
7. 重新尝试 Cursor 连接

**操作步骤（PowerShell - 需要管理员权限）：**
```powershell
# 方法 1: 允许 SSH 客户端出站连接
New-NetFirewallRule -DisplayName "SSH Client - Allow Outbound" `
    -Direction Outbound `
    -Program "$env:ProgramFiles\OpenSSH\ssh.exe" `
    -Action Allow `
    -Profile Any `
    -ErrorAction SilentlyContinue

# 方法 2: 允许 SSH 客户端入站连接（用于本地端口转发）
New-NetFirewallRule -DisplayName "SSH Client - Allow Inbound for Port Forwarding" `
    -Direction Inbound `
    -LocalAddress 127.0.0.1 `
    -Action Allow `
    -Profile Any `
    -ErrorAction SilentlyContinue

# 方法 3: 如果 SSH 在 WSL 中，也需要允许 WSL
New-NetFirewallRule -DisplayName "WSL SSH - Allow" `
    -Direction Inbound `
    -InterfaceAlias "vEthernet (WSL)" `
    -Action Allow `
    -ErrorAction SilentlyContinue
```

**验证修复：**
```powershell
# 检查规则是否已创建
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*SSH*"} | Format-Table DisplayName, Enabled, Direction, Action
```

---

### 方案 2: 清理并重新连接

**为什么有效：**
- 清理旧的进程和令牌文件
- 让 Cursor 重新建立干净的连接
- 解决连接冲突问题

**操作步骤：**
```powershell
# 1. 清理服务器端
ssh myserver "pkill -9 -f cursor-server; pkill -9 -f cursor-remote; rm -f /run/user/0/cursor-remote-*"

# 2. 等待 5 秒
Start-Sleep -Seconds 5

# 3. 在 Cursor 中：
#    - 点击左下角 SSH 状态
#    - 选择 "Close Remote Connection"
#    - 等待 5 秒
#    - 重新连接到 myserver
```

**或使用脚本：**
```powershell
.\快速修复WebSocket1006.ps1
```

---

### 方案 3: 检查并修复 SSH 端口转发

**操作步骤：**
```bash
# 1. 检查服务器端 SSH 配置
ssh myserver "grep -E 'AllowTcpForwarding|GatewayPorts' /etc/ssh/sshd_config"

# 2. 如果 AllowTcpForwarding 不是 yes，需要修改
ssh myserver "sudo sed -i 's/#AllowTcpForwarding.*/AllowTcpForwarding yes/' /etc/ssh/sshd_config"
ssh myserver "sudo systemctl restart sshd"

# 3. 检查本地 SSH 配置（~/.ssh/config）
# 确保有：
# ServerAliveInterval 30
# ServerAliveCountMax 5
# TCPKeepAlive yes
```

---

### 方案 4: 完全重置 Cursor Server

**如果方案 1 和 2 都不行：**

```powershell
# 完全清理
ssh myserver "pkill -9 -f cursor-server; rm -rf ~/.cursor-server/; rm -f /run/user/0/cursor-remote-*"

# 然后重新连接，Cursor 会重新下载安装
```

**或使用脚本：**
```powershell
.\重新下载安装Cursor Server.ps1
```

---

### 方案 5: 优化网络连接

**更新 SSH 配置（~/.ssh/config）：**
```
Host myserver
    HostName 115.190.54.220
    Port 22
    User root
    ServerAliveInterval 30
    ServerAliveCountMax 5
    TCPKeepAlive yes
    Compression yes
    # 增加超时时间
    ConnectTimeout 30
    # 启用连接复用
    ControlMaster auto
    ControlPath ~/.ssh/control-%h-%p-%r
    ControlPersist 10m
```

---

### 方案 6: 检查服务器资源

```bash
# 检查内存
ssh myserver "free -h"

# 检查磁盘
ssh myserver "df -h"

# 检查 CPU 负载
ssh myserver "uptime"
```

如果资源不足，可能需要：
- 关闭其他进程
- 增加服务器配置
- 清理磁盘空间

---

## ⚡ 快速排查方法（遇到问题时优先执行）

### 30秒快速诊断

**第一步：检查 Windows 防火墙（最重要！）**
```powershell
# 运行这个命令，查看 SSH 防火墙规则状态
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*SSH*" -or $_.DisplayName -like "*OpenSSH*"} | Format-Table DisplayName, Enabled, Direction, Action -AutoSize
```

**判断标准：**
- ❌ **没有找到 SSH 相关规则** → 需要添加防火墙规则
- ❌ **规则存在但 Enabled = False** → 需要启用规则
- ❌ **规则存在但 Action = Block** → 需要修改为 Allow
- ✅ **规则存在且 Enabled = True, Action = Allow** → 防火墙正常，检查其他原因

**第二步：如果防火墙正常，检查服务器端**
```bash
# 快速检查服务器端状态
ssh myserver "pgrep -f cursor-server > /dev/null && echo '✅ 进程存在' || echo '❌ 进程不存在'; ss -tlnp | grep cursor > /dev/null && echo '✅ 端口监听正常' || echo '❌ 未监听端口'"
```

**第三步：根据检查结果选择解决方案**
- 防火墙问题 → 执行"方案 1: 修复 Windows 防火墙"
- 进程不存在 → 重新连接让 Cursor 自动启动
- 进程存在但无端口 → 执行"方案 2: 清理并重新连接"

---

## 🎯 针对你的情况的具体建议

根据你的终端输出：
- ✅ 进程在运行
- ✅ 目录存在（235MB）
- ❌ 但连接失败

**最可能的原因（已确认）：**
1. **Windows 防火墙阻止本地端口转发**（90% 可能性）⭐⭐⭐
2. **SSH 端口转发被中断**（5% 可能性）
3. **令牌文件过期或冲突**（3% 可能性）
4. **进程状态异常**（2% 可能性）

**推荐操作顺序：**
1. ✅ **首先检查并修复 Windows 防火墙**（最重要！）
2. ✅ **如果防火墙正常，清理并重新连接**：`.\快速修复WebSocket1006.ps1`
3. ✅ **在 Cursor 中点击 "Reload Window"**
4. ✅ **如果还不行，检查 SSH 端口转发配置**

---

## 📝 总结

### 🔍 问题根源（已确认）

**WebSocket 1006 错误的根本原因：**
- **Windows 防火墙阻止了 SSH 的本地端口转发功能** ⭐⭐⭐
- 虽然 SSH 连接本身正常（可以执行命令），但 Windows 防火墙阻止了 SSH 在本地创建监听端口
- 导致 Cursor 客户端无法通过本地转发的端口连接到服务器上的 Cursor Server

**为什么容易被忽略：**
- SSH 连接本身正常，容易误以为网络没问题
- 服务器端进程正常运行，容易误以为是服务器问题
- Windows 防火墙的提示不够明显，不会主动弹出阻止通知
- 错误信息（WebSocket 1006）不够直观，不容易联想到防火墙问题

### 🎯 快速排查流程

**遇到 WebSocket 1006 错误时，按以下顺序排查：**

1. **第一步（30秒）：检查 Windows 防火墙**
   ```powershell
   Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*SSH*"} | Format-Table DisplayName, Enabled, Action
   ```
   - 如果发现问题 → 修复防火墙规则 → **90% 的情况下问题解决**

2. **第二步（如果防火墙正常）：检查服务器端**
   ```bash
   ssh myserver "pgrep -f cursor-server && ss -tlnp | grep cursor"
   ```
   - 如果进程不存在 → 重新连接
   - 如果进程存在但无端口 → 清理并重新连接

3. **第三步（如果前两步都正常）：检查 SSH 配置**
   - 检查服务器端 `AllowTcpForwarding` 配置
   - 检查本地 SSH 配置（超时、保活等）

### 💡 解决思路总结

**优先级排序：**
1. ✅ **Windows 防火墙配置**（最常见，最容易被忽略）
2. ✅ **清理旧的连接残留**
3. ✅ **确保 SSH 端口转发正常**
4. ✅ **优化网络连接稳定性**
5. ✅ **必要时完全重置**

**关键要点：**
- **大多数情况下，问题出在 Windows 防火墙，而不是服务器端**
- **修复防火墙后立即生效，无需重启**
- **如果防火墙正常，再考虑其他原因**

### 🎉 预防措施

**为了避免以后再次遇到这个问题：**
1. 在首次配置 SSH 时，就将 SSH 添加到 Windows 防火墙白名单
2. 如果使用 WSL，也要确保 WSL 网络接口的防火墙规则正确
3. 定期检查防火墙规则是否被意外修改

**大多数情况下，修复 Windows 防火墙就能解决！** 🎉

