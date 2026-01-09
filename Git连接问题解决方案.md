# Git 连接 GitHub 失败问题解决方案

## 🔍 问题诊断

根据日志分析，您遇到的问题是：
```
fatal: unable to access 'https://github.com/linkslks/suntaya_server_blog.git/': 
Recv failure: Connection was reset
```

**根本原因**：无法连接到 GitHub 的 443 端口（HTTPS），这在中国大陆很常见。

## ✅ 解决方案

### 方案 1：配置 HTTP/HTTPS 代理（推荐）

如果您有可用的代理（如 Clash、V2Ray 等），可以配置 Git 使用代理：

```powershell
# 设置 HTTP 代理（根据您的代理端口调整）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 或者使用 SOCKS5 代理
git config --global http.proxy socks5://127.0.0.1:1080
git config --global https.proxy socks5://127.0.0.1:1080

# 仅对 GitHub 设置代理（推荐，不影响其他仓库）
git config --global http.https://github.com.proxy http://127.0.0.1:7890
git config --global https.https://github.com.proxy http://127.0.0.1:7890
```

**取消代理设置**：
```powershell
git config --global --unset http.proxy
git config --global --unset https.proxy
# 或仅取消 GitHub 的代理
git config --global --unset http.https://github.com.proxy
```

### 方案 2：使用 SSH 代替 HTTPS

SSH 连接通常更稳定，不受 HTTPS 端口限制：

```powershell
# 1. 检查是否已有 SSH 密钥
ls ~/.ssh

# 2. 如果没有，生成新的 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"
# 按提示操作，可以直接回车使用默认路径

# 3. 复制公钥内容
cat ~/.ssh/id_ed25519.pub
# 或
Get-Content ~/.ssh/id_ed25519.pub

# 4. 将公钥添加到 GitHub：
#    - 登录 GitHub
#    - Settings → SSH and GPG keys → New SSH key
#    - 粘贴公钥内容并保存

# 5. 测试 SSH 连接
ssh -T git@github.com

# 6. 修改远程仓库地址为 SSH
cd e:\GitSpace\git-docs-blog\suntaya_server_blog
git remote set-url origin git@github.com:linkslks/suntaya_server_blog.git

# 7. 验证远程地址
git remote -v
```

### 方案 3：使用 GitHub 镜像站点

如果无法使用代理，可以临时使用镜像：

```powershell
# 使用 GitHub 镜像（如 fastgit.org，注意：仅用于拉取，不要推送）
git remote set-url origin https://hub.fastgit.xyz/linkslks/suntaya_server_blog.git

# 或者使用其他镜像站点
# git remote set-url origin https://github.com.cnpmjs.org/linkslks/suntaya_server_blog.git
```

**注意**：镜像站点可能不稳定，建议仅用于紧急情况。

### 方案 4：检查防火墙和网络设置

```powershell
# 检查 Windows 防火墙是否阻止了 Git
# 在 Windows 设置中检查防火墙规则

# 尝试增加 Git 的缓冲区大小（可能有助于连接）
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 0
```

### 方案 5：使用 VPN 或更换网络

- 使用 VPN 服务
- 切换到移动热点（4G/5G）
- 使用公司网络（如果允许访问 GitHub）

## 🧪 测试连接

配置完成后，测试连接：

```powershell
# 测试 HTTPS 连接
git ls-remote https://github.com/linkslks/suntaya_server_blog.git

# 测试 SSH 连接（如果使用方案 2）
ssh -T git@github.com

# 尝试拉取
cd e:\GitSpace\git-docs-blog\suntaya_server_blog
git pull origin main
```

## 📝 当前仓库状态

根据检查，您的仓库状态：
- ✅ 本地分支：`main`
- ✅ 本地领先远程 1 个提交
- ✅ 工作区干净，无未提交更改
- ❌ 无法连接到远程仓库

## 🎯 推荐操作步骤

1. **优先尝试方案 1**（配置代理）- 如果您有代理服务
2. **其次尝试方案 2**（使用 SSH）- 最稳定的长期方案
3. **临时使用方案 3**（镜像站点）- 仅用于紧急拉取代码

配置完成后，您可以执行：
```powershell
cd e:\GitSpace\git-docs-blog\suntaya_server_blog
git push origin main  # 推送本地提交
```

## ⚠️ 注意事项

- 代理端口号需要根据您的实际代理软件配置调整
- SSH 方式需要先配置 SSH 密钥
- 镜像站点不建议用于生产环境
- 如果使用公司网络，可能需要联系 IT 部门开放 GitHub 访问权限
