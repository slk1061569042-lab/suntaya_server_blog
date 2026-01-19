# 服务器上 Git 的使用场景和指南

**服务器**: 115.190.54.220  
**Git 版本**: 2.43.0  
**更新时间**: 2026-01-19

## 📊 当前状态

- ✅ Git 已安装: `/usr/bin/git`
- ⚠️ Git 用户配置: 未配置
- 📦 远程仓库: `https://github.com/slk1061569042-lab/suntaya_server_blog.git`

## 🎯 服务器上 Git 的主要用途

### 1. 代码克隆和同步

#### 场景：在服务器上直接获取代码

```bash
# 克隆代码到服务器
cd /www/wwwroot
git clone https://github.com/slk1061569042-lab/suntaya_server_blog.git

# 或者克隆到指定目录
git clone https://github.com/slk1061569042-lab/suntaya_server_blog.git /www/wwwroot/next.sunyas.com
```

**用途**：
- 在服务器上直接获取最新代码
- 用于开发、测试或调试
- 作为代码备份

### 2. 代码更新和拉取

#### 场景：更新服务器上的代码

```bash
# 进入项目目录
cd /www/wwwroot/next.sunyas.com

# 拉取最新代码
git pull origin main

# 或者先获取再合并
git fetch origin
git merge origin/main
```

**用途**：
- 更新服务器上的代码到最新版本
- 配合自动化脚本实现自动更新
- 在服务器上直接进行代码同步

### 3. 自动化部署脚本

#### 场景：创建自动化部署脚本

```bash
#!/bin/bash
# deploy.sh - 自动化部署脚本

PROJECT_DIR="/www/wwwroot/next.sunyas.com"
REPO_URL="https://github.com/slk1061569042-lab/suntaya_server_blog.git"

cd $PROJECT_DIR

# 拉取最新代码
echo "拉取最新代码..."
git pull origin main

# 安装依赖
echo "安装依赖..."
npm install

# 构建项目
echo "构建项目..."
npm run build

# 重启服务（如果需要）
echo "部署完成！"
```

**用途**：
- 一键更新和部署
- 定时自动部署
- CI/CD 流程的一部分

### 4. 代码备份和版本管理

#### 场景：在服务器上维护代码版本

```bash
# 在服务器上初始化 Git 仓库（如果还没有）
cd /www/wwwroot/next.sunyas.com
git init
git remote add origin https://github.com/slk1061569042-lab/suntaya_server_blog.git

# 查看代码历史
git log --oneline

# 查看文件变更
git status
git diff

# 回退到指定版本（如果需要）
git checkout <commit-hash>
```

**用途**：
- 在服务器上查看代码历史
- 快速回退到之前的版本
- 对比不同版本的代码

### 5. 分支管理和测试

#### 场景：在服务器上测试不同分支

```bash
# 查看所有分支
git branch -a

# 切换到测试分支
git checkout test-branch
git pull origin test-branch

# 测试完成后切回主分支
git checkout main
```

**用途**：
- 在服务器上测试新功能分支
- 预览不同版本的代码
- 进行 A/B 测试

### 6. 配合 Jenkins 使用

#### 当前部署流程

根据你的 `Jenkinsfile`，当前流程是：
1. Jenkins 在容器中克隆代码
2. 构建项目
3. 通过 SSH 将构建产物部署到服务器

#### 优化方案：服务器端 Git 拉取

可以修改部署流程，让服务器直接拉取代码：

```bash
# 在 Jenkins 部署脚本中添加
ssh root@115.190.54.220 << 'EOF'
cd /www/wwwroot/next.sunyas.com
git pull origin main
npm install
npm run build
# 重启服务
EOF
```

## 🔧 配置服务器 Git

### 1. 配置 Git 用户信息

```bash
# SSH 到服务器
ssh root@115.190.54.220

# 配置用户名和邮箱
git config --global user.name "slk1061569042-lab"
git config --global user.email "slk1061569042@gmail.com"

# 验证配置
git config --global --list
```

### 2. 配置认证

#### 方式 1: 使用 Personal Access Token (HTTPS)

```bash
# 克隆时使用 token
git clone https://<token>@github.com/slk1061569042-lab/suntaya_server_blog.git

# 或者配置 credential helper
git config --global credential.helper store
# 第一次输入用户名和 token，之后会自动保存
```

#### 方式 2: 使用 SSH 密钥（推荐）

```bash
# 在服务器上生成 SSH 密钥
ssh-keygen -t ed25519 -C "slk1061569042@gmail.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 添加到 GitHub: https://github.com/settings/keys

# 使用 SSH URL
git remote set-url origin git@github.com:slk1061569042-lab/suntaya_server_blog.git
```

## 📝 实际使用场景

### 场景 1: 手动更新服务器代码

```bash
# SSH 到服务器
ssh root@115.190.54.220

# 进入项目目录（如果已克隆）
cd /www/wwwroot/next.sunyas.com

# 拉取最新代码
git pull origin main

# 安装依赖并构建
npm install
npm run build
```

### 场景 2: 创建自动化更新脚本

创建 `/root/update_project.sh`:

```bash
#!/bin/bash
set -e

PROJECT_DIR="/www/wwwroot/next.sunyas.com"
REPO_URL="https://github.com/slk1061569042-lab/suntaya_server_blog.git"

echo "=== 开始更新项目 ==="

# 如果目录不存在，克隆仓库
if [ ! -d "$PROJECT_DIR" ]; then
    echo "目录不存在，正在克隆仓库..."
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
else
    echo "目录存在，拉取最新代码..."
    cd $PROJECT_DIR
    git pull origin main
fi

# 安装依赖
echo "安装依赖..."
npm install

# 构建项目
echo "构建项目..."
npm run build

echo "=== 更新完成 ==="
```

设置执行权限并运行：

```bash
chmod +x /root/update_project.sh
/root/update_project.sh
```

### 场景 3: 定时自动更新（Cron）

```bash
# 编辑 crontab
crontab -e

# 添加定时任务（每天凌晨 2 点更新）
0 2 * * * /root/update_project.sh >> /var/log/project_update.log 2>&1
```

### 场景 4: 代码回滚

```bash
# 查看提交历史
cd /www/wwwroot/next.sunyas.com
git log --oneline

# 回退到指定版本
git checkout <commit-hash>

# 或者回退到上一个版本
git reset --hard HEAD~1
```

## 🔄 与 Jenkins 的配合

### 当前流程（Jenkins 构建后部署）

Jenkins → 构建 → SSH 部署静态文件 → 服务器

### 优化流程（服务器直接拉取）

**方案 A: Jenkins 触发服务器拉取**

修改 Jenkinsfile，在部署阶段添加：

```groovy
stage('Deploy') {
    steps {
        sshPublisher(
            publishers: [
                sshPublisherDesc(
                    configName: '115.190.54.220',
                    transfers: [
                        sshTransfer(
                            execCommand: '''
                                cd /www/wwwroot/next.sunyas.com
                                git pull origin main
                                npm install
                                npm run build
                            '''
                        )
                    ]
                )
            ]
        )
    }
}
```

**方案 B: 服务器端 Git Hook**

在服务器上设置 Git Hook，当代码更新时自动部署：

```bash
# 创建 post-receive hook
cd /www/wwwroot/next.sunyas.com/.git/hooks
cat > post-receive << 'EOF'
#!/bin/bash
cd /www/wwwroot/next.sunyas.com
npm install
npm run build
EOF
chmod +x post-receive
```

## 🛠️ 实用脚本

### 快速配置脚本

创建 `/root/setup_git.sh`:

```bash
#!/bin/bash

echo "=== 配置服务器 Git ==="

# 配置用户信息
git config --global user.name "slk1061569042-lab"
git config --global user.email "slk1061569042@gmail.com"

# 配置默认分支
git config --global init.defaultBranch main

# 配置颜色输出
git config --global color.ui auto

# 配置编辑器
git config --global core.editor nano

echo "✅ Git 配置完成"
git config --global --list
```

## 📊 使用建议

### ✅ 推荐使用场景

1. **代码同步和备份**
   - 定期拉取最新代码作为备份
   - 在服务器上维护代码副本

2. **快速更新**
   - 紧急修复时直接在服务器上更新代码
   - 测试新功能时快速切换分支

3. **自动化部署**
   - 配合脚本实现自动化部署
   - 定时自动更新代码

### ⚠️ 注意事项

1. **不要在生产环境直接修改代码**
   - 服务器上的代码应该只读
   - 所有修改应该在本地完成并推送到 GitHub

2. **保持代码同步**
   - 定期拉取最新代码
   - 避免服务器代码与 GitHub 不同步

3. **备份重要数据**
   - 在更新前备份当前版本
   - 使用 Git 标签标记重要版本

## 🔍 验证和测试

### 测试 Git 配置

```bash
# 测试克隆
cd /tmp
git clone https://github.com/slk1061569042-lab/suntaya_server_blog.git test-repo
cd test-repo
git log --oneline -5
cd ..
rm -rf test-repo

# 测试 SSH（如果配置了）
ssh -T git@github.com
```

### 检查连接

```bash
# 检查远程仓库连接
git ls-remote https://github.com/slk1061569042-lab/suntaya_server_blog.git

# 或者使用 SSH
git ls-remote git@github.com:slk1061569042-lab/suntaya_server_blog.git
```

## 📚 相关文档

- [GitHub 管理工具安装和配置指南](./GitHub管理工具安装和配置指南.md)
- [Jenkins 安装和配置信息](./Jenkins安装和配置信息.md)
- [创建 GitHub 仓库并推送代码指南](./创建GitHub仓库并推送代码指南.md)

---

**总结**: 服务器上的 Git 主要用于代码同步、自动化部署、版本管理和备份。配合 Jenkins 使用可以实现完整的 CI/CD 流程。

---

**最后更新**: 2026-01-19
