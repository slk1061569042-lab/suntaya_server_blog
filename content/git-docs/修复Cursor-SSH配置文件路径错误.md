# 🔧 修复 Cursor SSH 配置文件路径错误

## 📊 问题现象

当尝试通过 Cursor 连接远程服务器时，出现以下错误：

```
[error] Error installing server: [Error: Failed to connect to the remote SSH host. Please check the logs for more details.
[info] (ssh_tunnel) stderr: Can't open user config file C:\\Users\\Aquarius\\.ssh\\github: No such file or directory
```

## 🔍 问题分析

### 错误原因

Cursor 的远程 SSH 扩展尝试使用错误的 SSH 配置文件路径：
- **错误的路径**: `C:\Users\Aquarius\.ssh\github`
- **问题**: 
  1. 当前用户是 `Administrator`，不是 `Aquarius`
  2. 配置文件名称应该是 `config`，不是 `github`
  3. 该文件路径不存在

### 正确的配置路径

根据当前用户，正确的 SSH 配置文件路径应该是：
- **Windows**: `C:\Users\Administrator\.ssh\config`
- **Linux/Mac**: `~/.ssh/config`

## ✅ 解决方案

### 方法 1: 在 Cursor 中重新配置 SSH 连接（推荐）

1. **打开 Cursor 命令面板**
   - 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)

2. **打开 SSH 配置文件**
   - 输入并选择：`Remote-SSH: Open SSH Configuration File`
   - 选择正确的配置文件路径：`C:\Users\Administrator\.ssh\config`

3. **确保配置正确**
   
   配置文件应包含以下内容：
   ```ssh_config
   Host myserver
       HostName 115.190.54.220
       User root
       Port 22
       IdentityFile ~/.ssh/id_rsa
       ServerAliveInterval 60
       ServerAliveCountMax 3
       StrictHostKeyChecking no
       UserKnownHostsFile ~/.ssh/known_hosts
   
   # 也可以直接使用IP地址作为Host
   Host 115.190.54.220
       HostName 115.190.54.220
       User root
       Port 22
       IdentityFile ~/.ssh/id_rsa
       ServerAliveInterval 60
       ServerAliveCountMax 3
       StrictHostKeyChecking no
   ```

4. **保存配置文件**

5. **重新连接**
   - 在 Cursor 中重新连接到远程服务器

### 方法 2: 检查 Cursor 的远程 SSH 扩展设置

1. **打开 Cursor 设置**
   - 按 `Ctrl+,` (Windows/Linux) 或 `Cmd+,` (Mac)

2. **搜索 SSH 配置**
   - 在设置搜索框中输入：`remote.SSH.configFile`

3. **检查配置值**
   - 如果设置了值，确保路径正确：`C:\Users\Administrator\.ssh\config`
   - **或者留空**，让 Cursor 使用默认路径

4. **保存设置并重启 Cursor**

### 方法 3: 使用 IP 地址直接连接

如果使用 Host 别名有问题，可以尝试直接使用 IP 地址：

1. **在 Cursor 中连接时**
   - 输入：`root@115.190.54.220`
   - 而不是使用 `myserver` 别名

2. **或者确保 SSH 配置文件中包含 IP 地址的 Host 配置**
   ```ssh_config
   Host 115.190.54.220
       HostName 115.190.54.220
       User root
       Port 22
       IdentityFile ~/.ssh/id_rsa
   ```

### 方法 4: 检查环境变量

确保没有设置错误的 SSH 配置环境变量：

**Windows PowerShell:**
```powershell
# 检查环境变量
$env:SSH_CONFIG_FILE

# 如果设置了错误的路径，删除它
[Environment]::SetEnvironmentVariable("SSH_CONFIG_FILE", $null, "User")
```

**如果路径不正确，删除或修改此环境变量**

## 🔧 使用诊断脚本

运行诊断脚本来自动检查和修复：

```powershell
# 运行诊断脚本
.\scripts\fix_cursor_ssh_config_path.ps1
```

脚本会：
1. ✅ 检查当前用户和SSH配置
2. ✅ 验证正确的SSH配置文件路径
3. ✅ 检查错误的配置文件路径
4. ✅ 检查Cursor的SSH扩展配置
5. ✅ 测试SSH连接
6. ✅ 提供修复建议

## 📋 验证步骤

修复后，按以下步骤验证：

1. **测试 SSH 连接**
   ```powershell
   # 使用配置文件测试
   ssh -F C:\Users\Administrator\.ssh\config myserver "echo '连接成功'"
   
   # 或直接使用IP
   ssh root@115.190.54.220 "echo '连接成功'"
   ```

2. **在 Cursor 中重新连接**
   - 关闭当前的远程连接（如果有）
   - 重新连接到远程服务器
   - 等待连接建立

3. **检查连接状态**
   - 查看 Cursor 左下角的连接状态
   - 确认显示 "Connected to remote"

## 🚨 常见问题

### Q1: 为什么会出现错误的路径 `C:\Users\Aquarius\.ssh\github`？

**可能原因：**
- Cursor 的远程 SSH 扩展配置中指定了错误的路径
- 之前在其他用户账户下配置过
- 环境变量设置了错误的路径

**解决方法：**
- 按照方法 2 检查并修正 Cursor 设置
- 检查并清理环境变量

### Q2: 修复后仍然无法连接怎么办？

**检查清单：**
1. ✅ SSH 配置文件路径正确
2. ✅ SSH 配置文件内容正确
3. ✅ SSH 密钥文件存在且权限正确
4. ✅ 服务器端 SSH 服务正常运行
5. ✅ 网络连接正常
6. ✅ 服务器端已添加公钥到 `~/.ssh/authorized_keys`

**进一步诊断：**
```powershell
# 运行完整的SSH连接诊断
.\scripts\test_ssh_connection.ps1
```

### Q3: 如何确认 Cursor 使用的是正确的配置文件？

**检查方法：**
1. 查看 Cursor 的日志文件：
   - Windows: `C:\Users\Administrator\.cursor\logs\`
   - 查找 `remoteagent*.log` 文件
   - 搜索 "config file" 或 "SSH config"

2. 查看连接命令：
   - 日志中会显示 SSH 命令
   - 检查 `-F` 参数后的路径是否正确

## 📚 相关文档

- [快速配置指南](./快速配置指南.md)
- [服务器端SSH配置指南](./服务器端SSH配置指南.md)
- [排查远程连接问题](./排查远程连接问题.md)
- [解决Cursor连接卡住问题](./解决Cursor连接卡住问题.md)

## 🔗 参考链接

- [Cursor Remote SSH 文档](https://cursor.sh/docs/remote-ssh)
- [SSH 配置文件格式](https://www.ssh.com/academy/ssh/config)

---

**最后更新**: 2026-01-07
