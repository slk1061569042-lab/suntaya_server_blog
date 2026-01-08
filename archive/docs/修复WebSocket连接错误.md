# 🔧 修复 WebSocket 连接错误 (1006)

## 🚨 错误信息

- **错误1:** "Could not fetch remote environment"
- **错误2:** "Failed to connect to the remote extension host server (Error: WebSocket close with status code 1006)"

## 📊 错误分析

**WebSocket 1006 错误**通常表示：
- 连接异常关闭（没有正常关闭握手）
- 网络中断或超时
- 防火墙/安全组阻止
- 服务器端进程异常退出
- 端口转发失败

## 🔍 诊断步骤

### 步骤 1: 检查 Cursor Server 进程状态

```bash
ssh myserver "ps aux | grep cursor-server | grep -v grep"
```

如果进程不存在，需要重新启动。

### 步骤 2: 检查服务器日志

```bash
ssh myserver "tail -50 /run/user/0/cursor-remote-code.log.6ca0869f6193ac0d40fa6ae74ed01260"
```

查看是否有错误信息。

### 步骤 3: 检查端口监听

```bash
ssh myserver "netstat -tlnp | grep -E 'cursor|40305|36599'"
```

确认端口是否正确监听。

### 步骤 4: 检查网络连接

```bash
# 测试 SSH 连接稳定性
ssh -v myserver "echo 'test'"
```

## 🚀 解决方案

### 方案 1: 清理并重新连接（推荐）

**在 PowerShell 中执行：**

```powershell
# 1. 清理服务器端进程和文件
ssh myserver "pkill -f cursor-server; pkill -f cursor-remote; rm -f /run/user/0/cursor-remote-*"

# 2. 等待几秒
Start-Sleep -Seconds 3

# 3. 在 Cursor 中：
#    - 点击左下角 SSH 状态
#    - 选择 "Close Remote Connection"
#    - 重新连接到 myserver
```

### 方案 2: 完全重置 Cursor Server

如果方案1不行，完全清理：

```bash
# 在服务器上执行
ssh myserver "pkill -f cursor-server; rm -rf ~/.cursor-server/; rm -f /run/user/0/cursor-remote-*"
```

然后在 Cursor 中重新连接，会重新下载安装（约67MB）。

### 方案 3: 检查防火墙和安全组

**云服务器安全组需要开放：**
- SSH 端口：22（必须）
- 其他端口由 SSH 隧道自动转发（不需要手动开放）

**检查方法：**
1. 登录云服务器控制台
2. 检查安全组规则
3. 确保 SSH (22端口) 已开放

### 方案 4: 增加 SSH 连接稳定性

更新 SSH 配置，增加连接稳定性：

```ssh_config
Host myserver
    HostName 115.190.54.220
    Port 22
    User root
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa
    StrictHostKeyChecking accept-new
    UserKnownHostsFile ~/.ssh/known_hosts
    ServerAliveInterval 30
    ServerAliveCountMax 5
    TCPKeepAlive yes
    Compression yes
```

然后重新连接。

### 方案 5: 检查服务器资源

```bash
# 检查内存
ssh myserver "free -h"

# 检查磁盘
ssh myserver "df -h"

# 检查 CPU
ssh myserver "top -bn1 | head -5"
```

如果资源不足，可能需要：
- 关闭其他进程
- 增加服务器配置
- 清理磁盘空间

## 🔄 快速修复脚本

创建一个快速修复脚本：

```powershell
# 快速修复 WebSocket 错误
Write-Host "正在清理服务器端 Cursor Server..." -ForegroundColor Yellow

# 停止进程
ssh myserver "pkill -f cursor-server; pkill -f cursor-remote" 2>&1 | Out-Null
Start-Sleep -Seconds 2

# 清理文件
ssh myserver "rm -f /run/user/0/cursor-remote-*" 2>&1 | Out-Null

Write-Host "清理完成！" -ForegroundColor Green
Write-Host ""
Write-Host "下一步：" -ForegroundColor Yellow
Write-Host "1. 在 Cursor 中关闭远程连接" -ForegroundColor White
Write-Host "2. 重新连接到 myserver" -ForegroundColor White
Write-Host "3. 等待连接建立" -ForegroundColor White
```

## 📝 详细操作步骤

### 如果看到 "Reload Window" 按钮：

1. **先点击 "Reload Window"** - 有时可以自动恢复
2. 如果还是失败，继续下面的步骤

### 完整重置流程：

1. **在 Cursor 中关闭连接：**
   - 点击左下角 SSH 状态图标
   - 选择 "Close Remote Connection"

2. **清理服务器端（在 PowerShell 中）：**
   ```powershell
   ssh myserver "pkill -f cursor-server; rm -f /run/user/0/cursor-remote-*"
   ```

3. **等待 5 秒**

4. **重新连接：**
   - 在 Cursor 中连接到 `myserver`
   - 等待连接建立
   - 如果还是失败，尝试完全清理：
     ```powershell
     ssh myserver "rm -rf ~/.cursor-server/"
     ```
   - 然后重新连接（会重新下载安装）

## ⚠️ 常见原因

| 原因 | 检查方法 | 解决方案 |
|------|----------|----------|
| 进程异常退出 | `ps aux \| grep cursor` | 重新启动进程 |
| 网络不稳定 | `ping 115.190.54.220` | 检查网络，使用稳定连接 |
| 防火墙阻止 | 检查安全组 | 确保 SSH 端口开放 |
| 资源不足 | `free -h`, `df -h` | 清理资源或升级服务器 |
| 端口冲突 | `netstat -tlnp` | 清理占用端口的进程 |

## 🎯 推荐操作顺序

1. ✅ **先尝试 "Reload Window"**（最简单）
2. ✅ **清理服务器端进程和临时文件**
3. ✅ **重新连接**
4. ✅ **如果还不行，完全清理 Cursor Server**
5. ✅ **检查网络和服务器资源**

---

*WebSocket 1006 错误通常是临时性的，清理后重新连接通常可以解决。*

