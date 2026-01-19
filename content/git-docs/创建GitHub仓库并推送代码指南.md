# 创建 GitHub 仓库并推送代码指南

**更新时间**: 2026-01-19  
**新账号**: slk1061569042-lab

## ✅ 已完成的配置

- **Git 用户名**: `slk1061569042-lab`
- **Git 邮箱**: `slk1061569042@gmail.com`
- **远程仓库 URL**: `https://github.com/slk1061569042-lab/suntaya_server_blog.git`

## 📝 创建 GitHub 仓库

由于仓库还未创建，你需要先在 GitHub 上创建仓库。有两种方法：

### 方法 1: 通过 GitHub 网站创建（推荐）

1. **访问 GitHub**
   - 登录你的 GitHub 账号: https://github.com/login
   - 确保登录的是 `slk1061569042-lab` 账号

2. **创建新仓库**
   - 点击右上角的 `+` 号 → 选择 `New repository`
   - 或者直接访问: https://github.com/new

3. **填写仓库信息**
   - **Repository name**: `suntaya_server_blog`
   - **Description**: （可选）填写项目描述
   - **Visibility**: 选择 `Public` 或 `Private`
   - **⚠️ 重要**: **不要**勾选以下选项：
     - ❌ 不要勾选 "Add a README file"
     - ❌ 不要勾选 "Add .gitignore"
     - ❌ 不要勾选 "Choose a license"
   - 点击 `Create repository`

4. **复制仓库 URL**
   - 创建后，GitHub 会显示仓库页面
   - 确认 URL 是: `https://github.com/slk1061569042-lab/suntaya_server_blog`

### 方法 2: 使用 GitHub CLI 创建（如果已配置）

如果你已经在服务器上配置了 GitHub CLI，可以运行：

```bash
ssh root@115.190.54.220 "gh repo create suntaya_server_blog --public --description 'Suntaya Server Blog Project'"
```

## 🚀 推送代码到新仓库

仓库创建完成后，使用以下步骤推送代码：

### 步骤 1: 确认当前状态

```powershell
# 检查 Git 状态
cd e:\GitSpace\suntaya_server_blog
git status

# 检查远程仓库配置
git remote -v
```

### 步骤 2: 添加并提交更改（如果有未提交的更改）

```powershell
# 添加所有更改
git add .

# 提交更改
git commit -m "Initial commit to new repository"
```

### 步骤 3: 推送到新仓库

```powershell
# 推送代码
git push -u origin main
```

**注意**: 如果是第一次推送，可能需要配置认证。

## 🔐 配置认证

### 方式 1: 使用 Personal Access Token (PAT) - HTTPS

1. **创建 Token**
   - 访问: https://github.com/settings/tokens
   - 点击 `Generate new token` → `Generate new token (classic)`
   - 填写信息：
     - **Note**: `Git Push Token`
     - **Expiration**: 选择过期时间（建议选择较长时间）
     - **Select scopes**: 勾选 `repo` 权限
   - 点击 `Generate token`
   - **⚠️ 重要**: 复制生成的 token（只显示一次）

2. **使用 Token 推送**
   - 当 Git 提示输入密码时，**粘贴 token 而不是密码**
   - 用户名输入: `slk1061569042-lab`

### 方式 2: 使用 SSH 密钥（推荐）

1. **生成 SSH 密钥**（如果还没有）

```powershell
# 在 PowerShell 中运行
ssh-keygen -t ed25519 -C "slk1061569042@gmail.com"
# 按提示操作，可以直接回车使用默认路径
```

2. **查看公钥**

```powershell
cat ~/.ssh/id_ed25519.pub
# 或
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

3. **添加到 GitHub**
   - 访问: https://github.com/settings/keys
   - 点击 `New SSH key`
   - **Title**: 填写一个名称（如：`Windows PC`）
   - **Key**: 粘贴刚才复制的公钥内容
   - 点击 `Add SSH key`

4. **更新远程 URL 为 SSH**

```powershell
cd e:\GitSpace\suntaya_server_blog
git remote set-url origin git@github.com:slk1061569042-lab/suntaya_server_blog.git
```

5. **测试 SSH 连接**

```powershell
ssh -T git@github.com
# 应该看到: Hi slk1061569042-lab! You've successfully authenticated...
```

## 📋 完整操作流程

### 快速推送脚本

我已经创建了一个脚本，你可以直接运行：

```powershell
.\scripts\push_to_github.ps1
```

这个脚本会：
1. 检查 Git 状态
2. 添加所有更改
3. 提示输入提交信息
4. 提交并推送到 GitHub

### 手动操作步骤

```powershell
# 1. 进入项目目录
cd e:\GitSpace\suntaya_server_blog

# 2. 检查状态
git status

# 3. 添加更改
git add .

# 4. 提交
git commit -m "你的提交信息"

# 5. 推送（首次推送）
git push -u origin main

# 之后推送只需要
git push
```

## ⚠️ 常见问题

### 问题 1: 推送时提示 "remote: Repository not found"

**原因**: 仓库还未创建或 URL 错误

**解决方法**:
1. 确认已在 GitHub 上创建仓库
2. 确认仓库名称是 `suntaya_server_blog`
3. 确认账号是 `slk1061569042-lab`

### 问题 2: 推送时提示 "Authentication failed"

**原因**: 认证信息不正确

**解决方法**:
- 如果使用 HTTPS，确保使用 Personal Access Token 作为密码
- 如果使用 SSH，确保 SSH 密钥已添加到 GitHub

### 问题 3: 推送时提示 "Permission denied"

**原因**: 没有仓库的写入权限

**解决方法**:
1. 确认登录的是正确的 GitHub 账号
2. 确认仓库属于你的账号
3. 检查 Token 或 SSH 密钥的权限

## 🔍 验证配置

运行以下命令验证配置：

```powershell
# 检查 Git 配置
git config --global user.name
git config --global user.email

# 检查远程仓库
git remote -v

# 测试连接（如果使用 SSH）
ssh -T git@github.com

# 测试连接（如果使用 HTTPS）
git ls-remote origin
```

## 📚 相关文档

- [GitHub 管理工具安装和配置指南](./GitHub管理工具安装和配置指南.md)
- [Git 和 GitHub CLI 区别说明](./Git和GitHub-CLI区别说明.md)

---

**下一步**: 创建 GitHub 仓库后，运行 `.\scripts\push_to_github.ps1` 推送代码！

---

**最后更新**: 2026-01-19
