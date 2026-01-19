# 🔌 Cursor 连接 115.190.54.220 完整指南

## 📊 当前状态

✅ **SSH 配置文件已就绪**: `C:\Users\Administrator\.ssh\config`  
✅ **服务器配置已添加**: `115.190.54.220`  
⚠️ **问题**: Cursor 尝试使用错误的用户路径 `C:\Users\Aquarius`

## 🎯 快速连接步骤

### 方法 1: 直接使用 IP 地址连接（推荐，避免路径问题）

1. **打开 Cursor**
2. **按 `Ctrl+Shift+P`** 打开命令面板
3. **输入并选择**: `Remote-SSH: Connect to Host...`
4. **输入**: `root@115.190.54.220`
5. **选择平台**: `Linux`
6. **等待连接建立**

### 方法 2: 使用 Host 别名连接

如果方法 1 失败，使用 Host 别名：

1. **打开 Cursor**
2. **按 `Ctrl+Shift+P`** 打开命令面板
3. **输入并选择**: `Remote-SSH: Connect to Host...`
4. **选择**: `myserver` 或 `115.190.54.220`
5. **等待连接建立**

## 🔧 如果遇到权限错误（EPERM: operation not permitted）

如果看到错误：`EPERM: operation not permitted, mkdir 'C:\Users\Aquarius'`

### 解决方案 A: 检查并修复 Cursor 设置

1. **打开 Cursor 设置**
   - 按 `Ctrl+,` 打开设置
   - 搜索：`remote.SSH.configFile`

2. **检查配置值**
   - 如果设置了值，确保路径是：`C:\Users\Administrator\.ssh\config`
   - **或者清空此设置**，让 Cursor 使用默认路径

3. **保存并重启 Cursor**

### 解决方案 B: 检查环境变量

运行以下 PowerShell 命令检查环境变量：

```powershell
# 检查是否有错误的SSH配置环境变量
Get-ChildItem Env: | Where-Object { $_.Value -match 'Aquarius' }

# 如果发现，删除它
[Environment]::SetEnvironmentVariable("SSH_CONFIG_FILE", $null, "User")
```

### 解决方案 C: 使用修复脚本

运行修复脚本：

```powershell
.\scripts\fix_cursor_settings.ps1
```

然后重启 Cursor。

## 📋 SSH 配置详情

当前 SSH 配置文件位置：`C:\Users\Administrator\.ssh\config`

配置内容：
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

Host 115.190.54.220
    HostName 115.190.54.220
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking no
    UserKnownHostsFile ~/.ssh/known_hosts
```

## ✅ 验证连接

### 1. 测试 SSH 连接（命令行）

在 PowerShell 中测试：

```powershell
# 使用配置文件
ssh -F C:\Users\Administrator\.ssh\config myserver "echo 'Connection successful'"

# 或直接使用IP
ssh root@115.190.54.220 "echo 'Connection successful'"
```

### 2. 在 Cursor 中连接

1. 按 `Ctrl+Shift+P`
2. 选择 `Remote-SSH: Connect to Host...`
3. 输入 `root@115.190.54.220`
4. 等待连接建立
5. 如果提示选择平台，选择 `Linux`
6. 如果提示打开文件夹，选择要打开的远程目录（如 `/root`）

## 🚨 常见问题排查

### Q1: 连接时提示 "operation not permitted, mkdir 'C:\Users\Aquarius'"

**原因**: Cursor 尝试创建错误的用户目录

**解决方法**:
1. 检查 Cursor 设置中的 `remote.SSH.configFile`，确保路径正确或留空
2. 检查环境变量，删除包含 `Aquarius` 的变量
3. 重启 Cursor
4. 尝试直接使用 IP 地址连接：`root@115.190.54.220`

### Q2: 连接超时或失败

**检查清单**:
1. ✅ 网络连接正常（可以 ping 通服务器）
2. ✅ SSH 服务正常运行（端口 22 可访问）
3. ✅ SSH 密钥已正确配置
4. ✅ 服务器端已添加公钥到 `~/.ssh/authorized_keys`

**测试命令**:
```powershell
# 测试网络连通性
Test-NetConnection -ComputerName 115.190.54.220 -Port 22

# 测试SSH连接
ssh -v root@115.190.54.220
```

### Q3: 连接成功但无法打开文件夹

**解决方法**:
1. 连接成功后，点击右下角的 "Open Folder" 按钮
2. 输入要打开的远程目录路径，例如：
   - `/root` - root 用户主目录
   - `/home/ubuntu` - ubuntu 用户主目录
   - `/var/www` - 网站目录

## 📚 相关文档

- [修复Cursor-SSH配置文件路径错误](./修复Cursor-SSH配置文件路径错误.md)
- [快速配置指南](./快速配置指南.md)
- [服务器端SSH配置指南](./服务器端SSH配置指南.md)
- [排查远程连接问题](./排查远程连接问题.md)

---

**最后更新**: 2026-01-07
