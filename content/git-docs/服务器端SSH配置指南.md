# Ubuntu 服务器端 SSH 配置指南

本文档说明如何在 Ubuntu 服务器上配置 SSH，以便与本地 Windows 客户端建立安全的 SSH 连接。

## 📋 目录

1. [清理旧配置](#清理旧配置)
2. [检查 SSH 服务](#检查-ssh-服务)
3. [配置 SSH 服务器](#配置-ssh-服务器)
4. [准备接收公钥](#准备接收公钥)
5. [验证配置](#验证配置)
6. [安全加固建议](#安全加固建议)

---

## 🧹 清理旧配置

### 1. 清理旧的 authorized_keys（可选）

如果之前配置过 SSH 密钥，可以先清理旧的记录：

```bash
# 备份现有的 authorized_keys（如果有）
cp ~/.ssh/authorized_keys ~/.ssh/authorized_keys.backup

# 查看当前内容
cat ~/.ssh/authorized_keys

# 如果需要完全清理，可以删除（谨慎操作）
# rm ~/.ssh/authorized_keys
```

### 2. 清理 Cursor Server 相关文件（如需要）

如果之前使用过 Cursor Remote，可以清理相关文件：

```bash
# 停止 Cursor 相关进程
pkill -f cursor-server
pkill -f cursor-remote

# 清理临时文件
rm -f /run/user/*/cursor-remote-*

# 可选：完全清理 Cursor Server（会重新下载）
# rm -rf ~/.cursor-server/
```

---

## 🔍 检查 SSH 服务

### 1. 检查 SSH 服务状态

```bash
# 检查 SSH 服务是否运行
sudo systemctl status sshd
# 或者
sudo systemctl status ssh
```

### 2. 如果服务未运行，启动服务

```bash
# 启动 SSH 服务
sudo systemctl start sshd
# 或者
sudo systemctl start ssh

# 设置开机自启
sudo systemctl enable sshd
# 或者
sudo systemctl enable ssh
```

### 3. 检查 SSH 服务端口

```bash
# 查看 SSH 服务监听的端口（默认是 22）
sudo netstat -tlnp | grep ssh
# 或者
sudo ss -tlnp | grep ssh
```

---

## ⚙️ 配置 SSH 服务器

### 1. 编辑 SSH 服务器配置文件

```bash
# 备份配置文件
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# 编辑配置文件
sudo nano /etc/ssh/sshd_config
```

### 2. 推荐的 SSH 配置选项

在配置文件中确保以下设置：

```bash
# 允许公钥认证
PubkeyAuthentication yes

# 允许密码认证（首次配置时可能需要，配置完成后可以禁用）
PasswordAuthentication yes

# 禁用 root 用户直接登录（安全建议）
PermitRootLogin no

# 允许特定用户登录（可选，更安全）
# AllowUsers ubuntu

# 设置最大认证尝试次数
MaxAuthTries 6

# 设置空闲超时时间（秒）
ClientAliveInterval 300
ClientAliveCountMax 2

# 禁用空密码登录
PermitEmptyPasswords no

# 使用强加密算法
Ciphers aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com,hmac-sha2-256,hmac-sha2-512
```

### 3. 应用配置更改

```bash
# 测试配置文件语法
sudo sshd -t

# 如果测试通过，重启 SSH 服务
sudo systemctl restart sshd
# 或者
sudo systemctl restart ssh
```

**⚠️ 重要提示**：在重启 SSH 服务前，确保你还有另一个 SSH 会话连接，或者确保配置正确，否则可能会失去连接。

---

## 🔑 准备接收公钥

### 1. 创建 .ssh 目录（如果不存在）

```bash
# 创建 .ssh 目录
mkdir -p ~/.ssh

# 设置正确的权限
chmod 700 ~/.ssh
```

### 2. 准备 authorized_keys 文件

```bash
# 如果文件不存在，创建它
touch ~/.ssh/authorized_keys

# 设置正确的权限（非常重要！）
chmod 600 ~/.ssh/authorized_keys
```

### 3. 验证目录和文件权限

```bash
# 检查权限
ls -la ~/.ssh/

# 应该看到类似这样的输出：
# drwx------ 2 ubuntu ubuntu 4096 ... .ssh
# -rw------- 1 ubuntu ubuntu   xxx ... authorized_keys
```

**权限说明**：
- `.ssh` 目录权限必须是 `700` (drwx------)
- `authorized_keys` 文件权限必须是 `600` (-rw-------)
- 错误的权限会导致 SSH 密钥认证失败

---

## 📝 添加公钥到服务器

### 方法一：手动添加（推荐用于首次配置）

1. **在本地 Windows 上获取公钥内容**

   在 PowerShell 中运行：
   ```powershell
   Get-Content $env:USERPROFILE\.ssh\id_rsa.pub
   ```

2. **在服务器上添加公钥**

   ```bash
   # 编辑 authorized_keys 文件
   nano ~/.ssh/authorized_keys
   
   # 将公钥内容粘贴到文件末尾（一行一个公钥）
   # 保存并退出（Ctrl+O, Enter, Ctrl+X）
   ```

3. **验证公钥已添加**

   ```bash
   cat ~/.ssh/authorized_keys
   ```

### 方法二：使用 ssh-copy-id（如果本地支持）

在本地 Windows PowerShell 中运行：

```powershell
# 需要先安装 OpenSSH 客户端（Windows 10/11 通常已包含）
type $env:USERPROFILE\.ssh\id_rsa.pub | ssh ubuntu@your-server-ip "cat >> ~/.ssh/authorized_keys"
```

### 方法三：使用一条命令（需要输入密码）

在本地 Windows PowerShell 中运行：

```powershell
Get-Content $env:USERPROFILE\.ssh\id_rsa.pub | ssh ubuntu@your-server-ip "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

---

## ✅ 验证配置

### 1. 在服务器上验证 authorized_keys

```bash
# 查看公钥内容
cat ~/.ssh/authorized_keys

# 验证文件权限
ls -l ~/.ssh/authorized_keys
# 应该显示: -rw------- 1 ubuntu ubuntu xxx ... authorized_keys
```

### 2. 在本地测试连接

在 Windows PowerShell 中：

```powershell
# 测试 SSH 连接（使用密码）
ssh ubuntu@your-server-ip

# 如果配置了 SSH config，测试：
ssh myserver
```

### 3. 测试密钥认证

```powershell
# 使用密钥认证测试（不应该提示输入密码）
ssh -i $env:USERPROFILE\.ssh\id_rsa ubuntu@your-server-ip
```

如果连接成功且不需要输入密码，说明配置正确！

---

## 🔒 安全加固建议

### 1. 禁用密码认证（配置完成后）

在服务器上编辑 `/etc/ssh/sshd_config`：

```bash
# 禁用密码认证，只允许密钥认证
PasswordAuthentication no

# 重启 SSH 服务
sudo systemctl restart sshd
```

### 2. 配置防火墙（如果使用 UFW）

```bash
# 允许 SSH 端口（默认 22）
sudo ufw allow 22/tcp

# 或者如果使用自定义端口（例如 2222）
sudo ufw allow 2222/tcp

# 启用防火墙
sudo ufw enable

# 查看防火墙状态
sudo ufw status
```

### 3. 限制 SSH 访问 IP（可选）

在 `/etc/ssh/sshd_config` 中添加：

```bash
# 只允许特定 IP 访问（替换为你的实际 IP）
AllowUsers ubuntu@your-ip-address
```

### 4. 更改默认 SSH 端口（可选，提高安全性）

```bash
# 编辑配置文件
sudo nano /etc/ssh/sshd_config

# 修改端口（例如改为 2222）
Port 2222

# 重启服务
sudo systemctl restart sshd

# 更新防火墙规则
sudo ufw allow 2222/tcp
```

**注意**：更改端口后，本地 SSH 配置也需要相应更新。

### 5. 定期更新系统

```bash
# 更新软件包列表
sudo apt update

# 升级系统
sudo apt upgrade -y

# 重启（如需要）
sudo reboot
```

---

## 🐛 常见问题排查

### 问题 1: 权限被拒绝 (Permission denied)

**原因**：文件权限不正确

**解决**：
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 问题 2: 仍然提示输入密码

**检查项**：
1. 公钥是否正确添加到 `authorized_keys`
2. 文件权限是否正确
3. SSH 服务器配置中 `PubkeyAuthentication` 是否为 `yes`
4. 检查 SSH 日志：`sudo tail -f /var/log/auth.log`

### 问题 3: 连接超时

**检查项**：
1. 服务器 IP 地址是否正确
2. 防火墙是否允许 SSH 端口
3. 服务器 SSH 服务是否运行
4. 网络连接是否正常

### 问题 4: 查看 SSH 连接日志

```bash
# 实时查看 SSH 认证日志
sudo tail -f /var/log/auth.log

# 查看 SSH 服务日志
sudo journalctl -u sshd -f
```

---

## 📚 相关命令参考

### 服务器端常用命令

```bash
# 查看当前登录用户
whoami

# 查看当前登录的 SSH 会话
who

# 查看 SSH 服务状态
sudo systemctl status sshd

# 重启 SSH 服务
sudo systemctl restart sshd

# 查看 SSH 配置
cat /etc/ssh/sshd_config | grep -v "^#" | grep -v "^$"

# 测试 SSH 配置
sudo sshd -t
```

---

## ✅ 配置完成检查清单

- [ ] SSH 服务正在运行
- [ ] `.ssh` 目录权限为 `700`
- [ ] `authorized_keys` 文件权限为 `600`
- [ ] 公钥已正确添加到 `authorized_keys`
- [ ] 本地可以无密码连接服务器
- [ ] SSH 服务器配置已优化
- [ ] 防火墙规则已配置
- [ ] 已禁用密码认证（可选，推荐）

---

## 🎯 下一步

配置完成后，返回本地 Windows 环境：

1. 运行 `setup_ssh_key.ps1` 配置本地 SSH
2. 编辑 `~/.ssh/config` 添加服务器配置
3. 测试连接：`ssh myserver`

如果遇到问题，请查看 `诊断服务器和网络问题.ps1` 进行排查。

---

**配置完成后，你的服务器已经准备好接收 SSH 密钥认证连接！** 🎉







