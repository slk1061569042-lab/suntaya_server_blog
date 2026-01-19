# Git 和 GitHub CLI 区别说明

## 📚 核心概念

### Git
- **定义**: 分布式版本控制系统（Version Control System）
- **作用**: 管理代码的版本历史、分支、合并等
- **范围**: 本地代码仓库管理
- **独立性**: 不依赖任何平台，可以独立使用

### GitHub CLI (gh)
- **定义**: GitHub 平台的命令行工具
- **作用**: 与 GitHub 网站交互，管理 GitHub 上的仓库、Issues、PR 等
- **范围**: GitHub 平台功能
- **依赖性**: 必须配合 GitHub 使用

## 🔍 详细对比

| 特性 | Git | GitHub CLI (gh) |
|------|-----|-----------------|
| **本质** | 版本控制工具 | GitHub 平台接口工具 |
| **主要功能** | 代码版本管理 | GitHub 平台操作 |
| **工作范围** | 本地仓库 | GitHub 远程平台 |
| **依赖关系** | 独立工具 | 依赖 GitHub |
| **适用平台** | 任何 Git 托管平台 | 仅 GitHub |
| **安装方式** | 系统包管理器 | GitHub 官方安装 |
| **命令前缀** | `git` | `gh` |

## 🎯 各自的主要用途

### Git 的主要功能

#### 1. 版本控制
```bash
# 跟踪文件变化
git add .
git commit -m "描述更改"

# 查看历史
git log
git log --oneline

# 查看差异
git diff
git diff HEAD~1
```

#### 2. 分支管理
```bash
# 创建分支
git branch feature-branch
git checkout feature-branch
# 或
git checkout -b feature-branch

# 合并分支
git merge feature-branch

# 查看分支
git branch
git branch -a
```

#### 3. 远程仓库操作
```bash
# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 推送代码
git push origin main

# 拉取代码
git pull origin main

# 克隆仓库
git clone https://github.com/user/repo.git
```

#### 4. 代码回退
```bash
# 撤销工作区更改
git checkout -- file.txt

# 撤销暂存区
git reset HEAD file.txt

# 回退到指定提交
git reset --hard commit-hash
```

### GitHub CLI 的主要功能

#### 1. 仓库管理
```bash
# 查看仓库列表
gh repo list

# 创建新仓库
gh repo create my-repo --public
gh repo create my-repo --private

# 查看仓库信息
gh repo view owner/repo-name

# 克隆仓库（比 git clone 更方便）
gh repo clone owner/repo-name

# 删除仓库
gh repo delete owner/repo-name
```

#### 2. Issues 管理
```bash
# 查看 Issues
gh issue list

# 创建 Issue
gh issue create --title "Bug report" --body "Description"

# 查看 Issue
gh issue view 123

# 关闭 Issue
gh issue close 123
```

#### 3. Pull Requests 管理
```bash
# 查看 PR 列表
gh pr list

# 创建 PR
gh pr create --title "Feature" --body "Description"

# 查看 PR
gh pr view 123

# 合并 PR
gh pr merge 123

# 检查 PR
gh pr checkout 123
```

#### 4. 认证管理
```bash
# 登录 GitHub
gh auth login

# 查看登录状态
gh auth status

# 登出
gh auth logout
```

#### 5. GitHub Actions 管理
```bash
# 查看工作流运行
gh run list

# 查看工作流日志
gh run view 123

# 重新运行工作流
gh run rerun 123
```

## 🔄 它们如何配合工作

### 典型工作流程

#### 场景 1: 创建新项目并上传到 GitHub

```bash
# 1. 使用 Git 初始化本地仓库
git init
git add .
git commit -m "Initial commit"

# 2. 使用 GitHub CLI 创建远程仓库并推送
gh repo create my-project --public --source=. --remote=origin --push
```

#### 场景 2: 日常开发流程

```bash
# 1. 使用 Git 进行本地版本控制
git checkout -b feature-branch
# ... 修改代码 ...
git add .
git commit -m "Add new feature"
git push origin feature-branch

# 2. 使用 GitHub CLI 创建 Pull Request
gh pr create --title "New Feature" --body "Description"
```

#### 场景 3: 查看和合并 PR

```bash
# 使用 GitHub CLI 查看 PR
gh pr list
gh pr view 123

# 使用 Git 获取 PR 代码
gh pr checkout 123

# 使用 Git 合并
git checkout main
git merge feature-branch
git push

# 或使用 GitHub CLI 直接合并
gh pr merge 123
```

## 💡 使用建议

### 什么时候用 Git？

✅ **必须使用 Git 的场景**：
- 初始化本地仓库
- 提交代码更改
- 创建和管理分支
- 合并代码
- 查看提交历史
- 回退代码版本
- 与任何 Git 托管平台交互（GitHub、GitLab、Bitbucket 等）

### 什么时候用 GitHub CLI？

✅ **使用 GitHub CLI 更方便的场景**：
- 创建 GitHub 仓库
- 管理 GitHub Issues
- 创建和管理 Pull Requests
- 查看 GitHub Actions 运行状态
- 管理 GitHub 仓库设置
- 需要与 GitHub 平台功能交互时

## 📊 功能对比表

| 功能 | Git | GitHub CLI | 说明 |
|------|-----|-----------|------|
| **初始化仓库** | ✅ `git init` | ❌ | Git 独有 |
| **提交代码** | ✅ `git commit` | ❌ | Git 独有 |
| **创建分支** | ✅ `git branch` | ❌ | Git 独有 |
| **推送代码** | ✅ `git push` | ❌ | Git 独有 |
| **克隆仓库** | ✅ `git clone` | ✅ `gh repo clone` | 两者都可以 |
| **创建 GitHub 仓库** | ❌ | ✅ `gh repo create` | GitHub CLI 更方便 |
| **管理 Issues** | ❌ | ✅ `gh issue` | GitHub CLI 独有 |
| **管理 PR** | ❌ | ✅ `gh pr` | GitHub CLI 独有 |
| **查看 Actions** | ❌ | ✅ `gh run` | GitHub CLI 独有 |
| **认证管理** | ❌ | ✅ `gh auth` | GitHub CLI 独有 |

## 🎓 实际例子

### 例子 1: 只使用 Git

```bash
# 这种方式需要手动在 GitHub 网页上创建仓库
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/user/repo.git
git push -u origin main
```

### 例子 2: Git + GitHub CLI（推荐）

```bash
# 这种方式一条命令完成所有操作
git init
git add .
git commit -m "Initial commit"
gh repo create my-repo --public --source=. --remote=origin --push
```

### 例子 3: 完整的开发流程

```bash
# 1. 使用 Git 进行本地开发
git checkout -b feature-login
# ... 编写代码 ...
git add .
git commit -m "Add login feature"
git push origin feature-login

# 2. 使用 GitHub CLI 创建 PR
gh pr create --title "Add login feature" --body "Implements user login functionality"

# 3. 代码审查后，使用 GitHub CLI 合并
gh pr merge 123 --squash

# 4. 使用 Git 更新本地代码
git checkout main
git pull origin main
```

## 🔧 安装和配置

### Git 安装

```bash
# Ubuntu/Debian
sudo apt install git

# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### GitHub CLI 安装

```bash
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | \
  sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | \
  sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# 登录
gh auth login
```

## 📝 总结

### Git
- **核心**: 版本控制系统
- **作用**: 管理代码历史、分支、合并
- **范围**: 本地 + 任何远程 Git 服务器
- **必需**: ✅ 是（进行版本控制的基础工具）

### GitHub CLI
- **核心**: GitHub 平台工具
- **作用**: 简化 GitHub 操作
- **范围**: 仅 GitHub 平台
- **必需**: ❌ 否（但能大幅提升效率）

### 最佳实践

1. **必须安装 Git** - 这是版本控制的基础
2. **推荐安装 GitHub CLI** - 如果使用 GitHub，能显著提升工作效率
3. **配合使用** - Git 处理本地版本控制，GitHub CLI 处理 GitHub 平台操作
4. **根据场景选择** - 本地操作用 Git，GitHub 平台操作用 GitHub CLI

---

**简单记忆**：
- **Git** = 代码版本管理工具（本地 + 远程）
- **GitHub CLI** = GitHub 网站的命令行版本（仅 GitHub）

两者配合使用，可以让你完全通过命令行完成从本地开发到 GitHub 管理的全部工作！

---

**最后更新**: 2026-01-19
