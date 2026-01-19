# GitHub 管理工具安装和配置指南

**安装时间**: 2026-01-19  
**服务器**: 115.190.54.220  
**系统**: Ubuntu 24.04 LTS

## 📊 已安装工具

### Git
- **版本**: 2.43.0
- **位置**: `/usr/bin/git`
- **状态**: ✅ 已安装

### GitHub CLI (gh)
- **版本**: 2.45.0
- **位置**: `/usr/bin/gh`
- **状态**: ✅ 已安装

## 🔧 配置 GitHub CLI

### 1. 登录 GitHub

首次使用需要登录 GitHub 账号：

```bash
# 交互式登录（推荐）
gh auth login

# 或者使用 token 登录
gh auth login --with-token < token.txt
```

**登录步骤**：
1. 选择 `GitHub.com`
2. 选择认证方式：
   - `Login with a web browser` (推荐，最简单)
   - `Paste an authentication token` (使用 Personal Access Token)
3. 如果选择浏览器登录，会显示一个验证码
4. 在浏览器中访问显示的 URL 并输入验证码
5. 授权 GitHub CLI 访问你的账号

### 2. 验证登录状态

```bash
# 检查登录状态
gh auth status

# 查看当前用户
gh api user
```

### 3. 配置 Git 用户信息（可选）

如果还没有配置 Git 用户信息：

```bash
# 配置全局用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 查看配置
git config --global --list
```

## 🚀 常用操作

### 创建新仓库并上传代码

#### 方法 1: 使用 GitHub CLI（推荐）

```bash
# 1. 在本地初始化 Git 仓库（如果还没有）
cd /path/to/your/project
git init

# 2. 添加文件
git add .

# 3. 提交
git commit -m "Initial commit"

# 4. 使用 GitHub CLI 创建仓库并推送
gh repo create my-repo-name --public --source=. --remote=origin --push
```

#### 方法 2: 手动创建仓库后推送

```bash
# 1. 在 GitHub 上创建仓库（通过 Web 或 gh CLI）
gh repo create my-repo-name --public

# 2. 在本地添加远程仓库
git remote add origin https://github.com/your-username/my-repo-name.git

# 3. 推送代码
git branch -M main
git push -u origin main
```

### 日常代码上传

```bash
# 1. 查看状态
git status

# 2. 添加更改
git add .
# 或添加特定文件
git add file1.txt file2.txt

# 3. 提交更改
git commit -m "描述你的更改"

# 4. 推送到 GitHub
git push

# 5. 如果创建了新分支，需要设置上游
git push -u origin branch-name
```

### 使用 GitHub CLI 管理仓库

```bash
# 查看仓库列表
gh repo list

# 查看仓库信息
gh repo view owner/repo-name

# 克隆仓库
gh repo clone owner/repo-name

# 创建新仓库
gh repo create repo-name --public    # 公开仓库
gh repo create repo-name --private  # 私有仓库

# 删除仓库（需要确认）
gh repo delete owner/repo-name

# 查看仓库的 Issues
gh issue list

# 创建 Issue
gh issue create --title "Bug report" --body "Description"

# 查看 Pull Requests
gh pr list

# 创建 Pull Request
gh pr create --title "Feature" --body "Description"
```

## 🔐 认证方式

### 方式 1: 浏览器登录（推荐）

```bash
gh auth login
# 选择 GitHub.com
# 选择 Login with a web browser
# 按照提示在浏览器中完成认证
```

### 方式 2: Personal Access Token (PAT)

1. **创建 Token**：
   - 访问: https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 选择权限（至少需要 `repo` 权限）
   - 复制生成的 token

2. **使用 Token 登录**：
   ```bash
   # 方法 A: 交互式输入
   gh auth login --with-token
   # 然后粘贴 token

   # 方法 B: 从文件读取
   echo "your_token_here" | gh auth login --with-token

   # 方法 C: 环境变量
   export GITHUB_TOKEN=your_token_here
   ```

### 方式 3: SSH 密钥（用于 Git 操作）

```bash
# 1. 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your.email@example.com"

# 2. 查看公钥
cat ~/.ssh/id_ed25519.pub

# 3. 添加到 GitHub
# 访问: https://github.com/settings/keys
# 点击 "New SSH key"，粘贴公钥内容

# 4. 测试连接
ssh -T git@github.com

# 5. 使用 SSH URL 克隆/推送
git remote set-url origin git@github.com:username/repo.git
```

## 📝 实用示例

### 示例 1: 上传现有项目到新仓库

```bash
# 假设你的项目在 /www/wwwroot/my-project

cd /www/wwwroot/my-project

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 创建 GitHub 仓库并推送
gh repo create my-project --public --source=. --remote=origin --push
```

### 示例 2: 克隆并修改代码

```bash
# 克隆仓库
gh repo clone owner/repo-name
cd repo-name

# 创建新分支
git checkout -b feature-branch

# 修改代码...
# 添加文件
git add .

# 提交
git commit -m "Add new feature"

# 推送新分支
git push -u origin feature-branch

# 创建 Pull Request
gh pr create --title "New Feature" --body "Description"
```

### 示例 3: 同步本地和远程仓库

```bash
# 拉取最新更改
git pull

# 如果有冲突，解决后
git add .
git commit -m "Resolve conflicts"
git push
```

## 🔍 故障排查

### 问题 1: 认证失败

```bash
# 检查认证状态
gh auth status

# 重新登录
gh auth login

# 清除认证信息后重新登录
gh auth logout
gh auth login
```

### 问题 2: 推送被拒绝

```bash
# 检查远程仓库 URL
git remote -v

# 如果使用 HTTPS，确保已登录
gh auth status

# 如果使用 SSH，检查密钥
ssh -T git@github.com

# 强制推送（谨慎使用）
git push --force
```

### 问题 3: 权限不足

- 确保 GitHub CLI 已正确登录
- 检查仓库权限（是否有写入权限）
- 如果使用 Token，确保有 `repo` 权限

## 📚 更多资源

### GitHub CLI 官方文档
- 官方文档: https://cli.github.com/manual/
- GitHub: https://github.com/cli/cli

### Git 文档
- 官方文档: https://git-scm.com/doc
- 中文教程: https://git-scm.com/book/zh/v2

## 🎯 快速参考

### 常用 Git 命令

```bash
# 初始化仓库
git init

# 查看状态
git status

# 添加文件
git add .
git add file.txt

# 提交
git commit -m "message"

# 推送
git push
git push origin branch-name

# 拉取
git pull

# 查看日志
git log
git log --oneline

# 查看分支
git branch
git branch -a

# 切换分支
git checkout branch-name
git checkout -b new-branch

# 合并分支
git merge branch-name
```

### 常用 GitHub CLI 命令

```bash
# 认证
gh auth login
gh auth status
gh auth logout

# 仓库管理
gh repo list
gh repo create name --public
gh repo clone owner/name
gh repo view owner/name

# Issues
gh issue list
gh issue create --title "Title" --body "Body"
gh issue view 123

# Pull Requests
gh pr list
gh pr create --title "Title" --body "Body"
gh pr view 123
gh pr merge 123
```

## 🔄 在 Docker 容器中使用

如果你需要在 Docker 容器中使用 Git 和 GitHub CLI：

### Jenkins 容器

Jenkins 容器已经安装了 Git，可以直接使用：

```bash
# 进入容器
docker exec -it jenkins_hwfa-jenkins_hWFA-1 bash

# 在容器内使用 Git
git --version
```

### 创建自定义容器

如果需要创建一个专门用于 Git 操作的容器：

```dockerfile
FROM ubuntu:24.04

RUN apt update && \
    apt install -y git curl && \
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | \
    dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | \
    tee /etc/apt/sources.list.d/github-cli.list > /dev/null && \
    apt update && \
    apt install -y gh && \
    apt clean

WORKDIR /workspace
CMD ["/bin/bash"]
```

构建和运行：

```bash
docker build -t git-tools .
docker run -it -v /path/to/project:/workspace git-tools
```

---

**最后更新**: 2026-01-19
