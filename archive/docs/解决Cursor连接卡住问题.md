# 🔧 解决 Cursor 连接卡住问题

## 📊 问题现象

- Cursor 显示 "连接中..." 状态
- 界面卡住，没有响应
- 没有数据传输（网速为 0）

## 🔍 诊断结果

通过诊断脚本发现：

1. ✅ **SSH 基本连接正常** - 命令行 SSH 可以连接
2. ✅ **AllowTcpForwarding = yes** - 端口转发功能已启用
3. ✅ **AllowAgentForwarding = yes** - Agent 转发已启用
4. ⚠️ **响应时间较长** - 约 5.5 秒（可能影响连接稳定性）
5. ✅ **Cursor Server 进程存在** - 说明 Cursor 正在尝试连接

## 🎯 根本原因

虽然 SSH 配置基本正确，但可能存在以下问题：

1. **网络延迟较高** - 响应时间 5.5 秒可能导致超时
2. **SSH 连接不稳定** - 需要优化连接保持机制
3. **Cursor Server 进程异常** - 可能需要清理并重启

## ✅ 已执行的修复

### 1. 服务器端 SSH 配置优化

```bash
# 确保以下配置已设置
AllowTcpForwarding yes
AllowAgentForwarding yes
```

### 2. 清理服务器端 Cursor 进程

```bash
# 停止所有 Cursor 相关进程
pkill -f cursor-server
pkill -f cursor-remote

# 清理临时文件和锁文件
rm -f /run/user/0/cursor-remote-*
rm -rf /tmp/cursor-*
```

### 3. 优化本地 SSH 配置

已在 `~/.ssh/config` 中添加：

```
Host myserver
    ServerAliveInterval 30
    ServerAliveCountMax 5
    TCPKeepAlive yes
    Compression yes
```

## 🚀 下一步操作

### 步骤 1: 在 Cursor 中关闭连接

1. 点击 Cursor 左下角的 **SSH 连接状态图标**
2. 选择 **"Close Remote Connection"**
3. 等待连接完全关闭

### 步骤 2: 等待并重新连接

1. **等待 5-10 秒**，确保服务器端进程完全清理
2. 在 Cursor 中重新连接到 `myserver`
3. **耐心等待 1-2 分钟**，让 Cursor Server 重新启动

### 步骤 3: 如果仍然无法连接

#### 方法 A: 完全重置 Cursor Server

在 PowerShell 中执行：

```powershell
# 完全清理服务器端
ssh myserver "pkill -f cursor-server; rm -rf ~/.cursor-server/; rm -f /run/user/0/cursor-remote-*"
```

然后在 Cursor 中重新连接（会重新下载安装，约 67MB）。

#### 方法 B: 检查 Cursor 日志

查看 Cursor 日志文件，定位具体错误：

```
Windows: %USERPROFILE%\.cursor\logs\
```

重点查看：
- `remoteagent.log`
- `exthost.log`
- `remote-ssh.log`

#### 方法 C: 检查网络连接

```powershell
# 测试网络延迟
Test-Connection -ComputerName 115.190.54.220 -Count 5

# 测试 SSH 连接稳定性
ssh -v myserver "echo 'test'"
```

## 🔧 服务器端配置验证

如果需要手动验证服务器配置：

```bash
# 检查 SSH 配置
sudo grep -E '^(AllowTcpForwarding|AllowAgentForwarding)' /etc/ssh/sshd_config

# 如果配置不正确，编辑配置文件
sudo nano /etc/ssh/sshd_config

# 确保有以下设置：
# AllowTcpForwarding yes
# AllowAgentForwarding yes

# 重启 SSH 服务
sudo systemctl restart sshd
# 或
sudo systemctl restart ssh
```

## 📝 快速修复命令

如果问题再次出现，可以快速执行：

```powershell
# 一键清理并重连
ssh myserver "pkill -f cursor-server; pkill -f cursor-remote; rm -f /run/user/0/cursor-remote-*"
Start-Sleep -Seconds 5
Write-Host "清理完成，请在 Cursor 中重新连接" -ForegroundColor Green
```

## ⚠️ 注意事项

1. **网络延迟**：如果服务器响应时间超过 3 秒，可能需要：
   - 检查网络连接质量
   - 考虑使用更近的服务器
   - 或使用 VPN/代理优化连接

2. **服务器资源**：确保服务器有足够资源：
   - 磁盘空间：至少 1GB 可用
   - 内存：至少 512MB 可用
   - CPU：正常负载

3. **防火墙/安全组**：
   - 确保 SSH 端口（22）已开放
   - 其他端口由 SSH 隧道自动转发，无需手动开放

## 🎯 推荐操作顺序

1. ✅ **执行修复脚本** - `fix_cursor_connection.ps1`
2. ✅ **在 Cursor 中关闭连接**
3. ✅ **等待 5-10 秒**
4. ✅ **重新连接**
5. ✅ **如果失败，完全清理并重连**

---

*如果以上方法都无法解决，请提供 Cursor 日志文件中的具体错误信息*

