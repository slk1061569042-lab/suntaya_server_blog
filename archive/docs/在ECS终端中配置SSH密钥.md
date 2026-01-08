# 在 ECS Terminal 中配置 SSH 密钥

## 方法一：通过 ECS Terminal 手动添加公钥（推荐）

### 步骤 1: 打开 ECS Terminal
1. 在云服务商控制台点击"远程连接"
2. 选择"ECS Terminal"（推荐）
3. 点击"立即登录"

### 步骤 2: 查看当前用户名
登录后，在终端中执行：
```bash
whoami
```
这会显示你当前的用户名（可能是 `root`、`ubuntu` 或其他）

### 步骤 3: 添加 SSH 公钥

在 ECS Terminal 中执行以下命令：

```bash
# 创建 .ssh 目录（如果不存在）
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 编辑 authorized_keys 文件
nano ~/.ssh/authorized_keys
```

### 步骤 4: 复制公钥内容

在 Windows 中打开 PowerShell，查看你的公钥：
```powershell
Get-Content C:\Users\Administrator\.ssh\id_rsa.pub
```

**完整复制公钥内容**（从 `ssh-rsa` 开始到邮箱结束的整行），然后：

1. 在 ECS Terminal 的 nano 编辑器中粘贴
2. 按 `Ctrl + O` 保存
3. 按 `Enter` 确认
4. 按 `Ctrl + X` 退出

### 步骤 5: 设置正确的权限

```bash
chmod 600 ~/.ssh/authorized_keys
```

### 步骤 6: 验证配置

```bash
cat ~/.ssh/authorized_keys
```
应该能看到你刚才添加的公钥内容。

## 方法二：如果用户名不是 ubuntu

如果 `whoami` 显示的是 `root` 或其他用户名，需要更新 SSH 配置：

更新 `C:\Users\Administrator\.ssh\config` 文件中的 `User` 字段。

## 方法三：使用 root 用户尝试

如果 ECS Terminal 中显示是 root 用户，可以尝试：

```powershell
Get-Content C:\Users\Administrator\.ssh\id_rsa.pub | ssh root@115.190.54.220 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

