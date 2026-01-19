# Docker Git 访问指南

**更新时间**: 2026-01-19

## 📋 概述

本指南说明如何访问服务器上 Docker 容器中部署的 Git 以及服务器上的 Git 仓库。

## 🐳 Docker 容器信息

### Jenkins 容器

- **容器名称**: `jenkins_hwfa-jenkins_hWFA-1`
- **镜像**: `jenkins/jenkins:lts-jdk21`
- **状态**: 运行中
- **端口映射**:
  - `14808:8080` - Jenkins Web UI
  - `50000:50000` - Jenkins Agent 端口

### 其他 Docker 容器

服务器上还运行了多个 Supabase 相关容器，用于数据库和 API 服务。

## 🔧 访问方式

### 1. 访问 Jenkins 容器中的 Git

#### 方式一：通过 SSH 执行命令

```bash
# 检查 Git 版本
ssh root@115.190.54.220 'docker exec jenkins_hwfa-jenkins_hWFA-1 git --version'

# 在容器中执行 Git 命令
ssh root@115.190.54.220 'docker exec jenkins_hwfa-jenkins_hWFA-1 git config --list'

# 进入容器交互式 Shell
ssh root@115.190.54.220 'docker exec -it jenkins_hwfa-jenkins_hWFA-1 /bin/bash'
```

#### 方式二：直接进入容器

```bash
# SSH 到服务器
ssh root@115.190.54.220

# 进入 Jenkins 容器
docker exec -it jenkins_hwfa-jenkins_hWFA-1 /bin/bash

# 在容器内使用 Git
git --version
git config --list
```

### 2. 访问服务器上的 Git 仓库

#### Bare Repository 位置

```
/www/git-repos/suntaya_server_blog.git
```

#### 查看仓库信息

```bash
# SSH 到服务器
ssh root@115.190.54.220

# 查看仓库提交历史
cd /www/git-repos/suntaya_server_blog.git
git log --oneline -10

# 查看所有分支
git branch -a

# 查看远程配置
git remote -v

# 查看仓库统计
git count-objects -vH
```

#### 从本地访问服务器 Git 仓库

```bash
# 查看远程仓库信息
git remote show server

# 拉取最新代码
git pull server main

# 推送代码到服务器
git push server main

# 查看服务器仓库的提交
git log server/main --oneline -10
```

### 3. Jenkins 中的 Git 配置

Jenkins 在构建时会使用容器内的 Git。可以通过以下方式查看和配置：

```bash
# 查看 Jenkins 容器中的 Git 配置
ssh root@115.190.54.220 'docker exec jenkins_hwfa-jenkins_hWFA-1 git config --global --list'

# 设置 Git 用户信息（如果需要）
ssh root@115.190.54.220 'docker exec jenkins_hwfa-jenkins_hWFA-1 git config --global user.name "Jenkins"'
ssh root@115.190.54.220 'docker exec jenkins_hwfa-jenkins_hWFA-1 git config --global user.email "jenkins@example.com"'
```

## 🔍 常用操作

### 检查 Git 状态

```bash
# 服务器系统 Git
ssh root@115.190.54.220 'git --version'

# Jenkins 容器 Git
ssh root@115.190.54.220 'docker exec jenkins_hwfa-jenkins_hWFA-1 git --version'

# 服务器 Git 仓库状态
ssh root@115.190.54.220 'cd /www/git-repos/suntaya_server_blog.git && git status'
```

### 查看仓库内容

```bash
# 查看最新提交
ssh root@115.190.54.220 'cd /www/git-repos/suntaya_server_blog.git && git log --oneline -5'

# 查看分支
ssh root@115.190.54.220 'cd /www/git-repos/suntaya_server_blog.git && git branch -a'

# 查看标签
ssh root@115.190.54.220 'cd /www/git-repos/suntaya_server_blog.git && git tag'
```

### 克隆服务器仓库（如果需要工作副本）

```bash
# 在服务器上克隆 bare repository
ssh root@115.190.54.220 'cd /www && git clone /www/git-repos/suntaya_server_blog.git suntaya_server_blog'

# 或者从本地克隆
git clone root@115.190.54.220:/www/git-repos/suntaya_server_blog.git
```

## 📊 当前配置

### 服务器 Git 版本

- **系统 Git**: 2.52.0
- **位置**: `/usr/bin/git`

### Git 仓库

- **Bare Repository**: `/www/git-repos/suntaya_server_blog.git`
- **默认分支**: `main`
- **远程配置**: 
  - `origin`: GitHub (git@github.com-new:slk1061569042-lab/suntaya_server_blog.git)
  - `server`: 服务器 (root@115.190.54.220:/www/git-repos/suntaya_server_blog.git)

### Jenkins 配置

- **容器名称**: `jenkins_hwfa-jenkins_hWFA-1`
- **Web UI**: http://115.190.54.220:14808
- **部署目录**: `/www/wwwroot/next.sunyas.com`

## 🚀 快速访问脚本

### PowerShell 脚本：访问 Jenkins 容器 Git

```powershell
# 检查 Jenkins 容器中的 Git
ssh root@115.190.54.220 "docker exec jenkins_hwfa-jenkins_hWFA-1 git --version"

# 进入 Jenkins 容器
ssh root@115.190.54.220 "docker exec -it jenkins_hwfa-jenkins_hWFA-1 /bin/bash"
```

### PowerShell 脚本：访问服务器 Git 仓库

```powershell
# 查看服务器 Git 仓库状态
ssh root@115.190.54.220 "cd /www/git-repos/suntaya_server_blog.git && git log --oneline -5"

# 查看分支
ssh root@115.190.54.220 "cd /www/git-repos/suntaya_server_blog.git && git branch -a"
```

## ⚠️ 注意事项

1. **Bare Repository**: `/www/git-repos/suntaya_server_blog.git` 是一个 bare repository，没有工作目录，主要用于接收 push。

2. **Jenkins 构建**: Jenkins 在构建时会从 GitHub 克隆代码，而不是从服务器 Git 仓库。

3. **权限**: 确保有足够的权限访问 Docker 容器和 Git 仓库。

4. **SSH 密钥**: 访问服务器需要配置 SSH 密钥（已在 `~/.ssh/config` 中配置）。

## 📚 相关文档

- [Cursor连接115.190.54.220指南](../content/git-docs/Cursor连接115.190.54.220指南.md)
- [Jenkins安装和配置信息](../content/git-docs/_archive/Jenkins安装和配置信息.md)
- [本地代码推送到服务器Git指南](../content/git-docs/本地代码推送到服务器Git指南.md)

---

**最后更新**: 2026-01-19
