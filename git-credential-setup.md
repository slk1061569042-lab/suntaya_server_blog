# Git 凭证登录配置方案

## ✅ 已完成的配置

### 1. 凭证管理器配置
- ✅ 已配置使用 `manager-core`（Windows Credential Manager）
- ✅ 已为 GitHub 单独配置凭证助手
- ✅ 已启用 `useHttpPath`（为不同仓库保存不同凭证）

### 2. 远程仓库配置
- ✅ 远程仓库 URL：`https://github.com/linkslks/suntaya_server_blog.git`
- ✅ 分支已重命名为 `main`

### 3. 凭证缓存清理
- ✅ 已清除旧的错误凭证

## 📋 当前配置状态

```bash
# 查看凭证配置
git config --global credential.helper
# 输出：manager-core

# 查看 GitHub 专用配置
git config --global credential.https://github.com.helper
# 输出：manager-core

# 查看远程仓库
git remote -v
# 输出：
# origin  https://github.com/linkslks/suntaya_server_blog.git (fetch)
# origin  https://github.com/linkslks/suntaya_server_blog.git (push)
```

## 🚀 使用方法

### 方法 1：直接推送（推荐）

在 PowerShell 或 Git Bash 中执行：

```bash
cd C:\Users\Administrator\Documents\git-docs-blog
git push -u origin main
```

**第一次推送时会弹出 Windows 凭证对话框：**
- **用户名**：`linkslks`
- **密码**：输入你的 **Personal Access Token**（不是 GitHub 密码）

> ⚠️ **重要**：GitHub 已不再支持密码认证，必须使用 Personal Access Token

### 方法 2：使用 Git Bash（如果 PowerShell 有 DNS 问题）

1. 打开 **Git Bash**（不是 PowerShell）
2. 执行：
```bash
cd /c/Users/Administrator/Documents/git-docs-blog
git push -u origin main
```

### 方法 3：手动配置凭证（提前输入）

如果需要提前配置凭证，可以使用：

```bash
# 这会触发凭证输入
git credential-manager-core configure
```

或者直接推送，系统会自动弹出凭证对话框。

## 🔑 获取 Personal Access Token

如果还没有 Personal Access Token，按以下步骤创建：

1. 访问：https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写信息：
   - **Note**：`git-docs-blog`（描述用途）
   - **Expiration**：选择过期时间（建议 90 天或自定义）
   - **Select scopes**：至少勾选 `repo`（完整仓库权限）
4. 点击 **"Generate token"**
5. **立即复制 Token**（只显示一次！）

## 💾 凭证存储位置

凭证会保存在 **Windows Credential Manager** 中：

- 打开方式：`控制面板` → `凭据管理器` → `Windows 凭据`
- 查找：`git:https://github.com`
- 或使用命令查看：
```powershell
cmdkey /list | Select-String -Pattern "github"
```

## 🔍 验证凭证是否保存

推送成功后，可以验证凭证：

```bash
# 查看保存的凭证
cmdkey /list | Select-String -Pattern "github"

# 或者测试连接（不会真正推送）
git ls-remote origin
```

## 🛠️ 故障排除

### 问题 1：DNS 解析失败
**症状**：`getaddrinfo() thread failed to start`

**解决方案**：
- 使用 **Git Bash** 而不是 PowerShell
- 或重启计算机后重试
- 或使用 GitHub Desktop

### 问题 2：凭证对话框不弹出
**解决方案**：
```bash
# 清除凭证缓存
git credential-manager-core erase https://github.com

# 重新推送
git push -u origin main
```

### 问题 3：认证失败
**检查**：
- 确认使用的是 **Personal Access Token** 而不是密码
- 确认 Token 有 `repo` 权限
- 确认 Token 未过期

### 问题 4：凭证保存但推送失败
**解决方案**：
```bash
# 查看详细错误
git push -u origin main --verbose

# 或清除凭证重新输入
git credential-manager-core erase https://github.com
git push -u origin main
```

## 📝 完整操作流程

1. ✅ **配置完成**（已完成）
2. 🔄 **执行推送**：
   ```bash
   git push -u origin main
   ```
3. 🔑 **输入凭证**：
   - 弹出对话框时输入用户名和 Token
   - 勾选"记住我的凭据"
4. ✅ **验证成功**：
   - 推送成功后，凭证会自动保存
   - 下次推送无需再次输入

## 🎯 下一步

现在可以执行推送命令了：

```bash
cd C:\Users\Administrator\Documents\git-docs-blog
git push -u origin main
```

如果遇到 DNS 问题，请使用 **Git Bash** 执行上述命令。
