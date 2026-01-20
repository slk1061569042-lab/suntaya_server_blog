# Jenkins 自动构建配置指南

**时间**: 2026-01-20  
**问题**: Push 代码后 Jenkins 没有自动构建

## 🔍 问题分析

### 当前状态

1. **Jenkinsfile 中没有 triggers** ⚠️
   - 当前 Jenkinsfile 没有配置自动触发
   - 需要手动点击 "Build Now" 才能构建

2. **GitHub Webhook 可能未配置** ⚠️
   - 需要检查 GitHub Webhook 是否已配置
   - Webhook URL 是否正确

---

## ✅ 解决方案

### 方案 1: 在 Jenkinsfile 中添加触发器（推荐）

**修改 Jenkinsfile**，在 `options` 块后添加 `triggers` 块：

```groovy
pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '-u root:root'
        }
    }

    environment {
        // ... 环境变量
    }

    options {
        // ... 选项配置
    }

    // 添加触发器配置
    triggers {
        // 方式 1: GitHub Webhook 触发（推荐）
        githubPush()
        
        // 方式 2: 轮询 GitHub（不推荐，会消耗资源）
        // pollSCM('H/5 * * * *')  // 每 5 分钟检查一次
    }

    stages {
        // ... 构建阶段
    }
}
```

---

### 方案 2: 配置 GitHub Webhook

**步骤**：

1. **打开 GitHub 仓库**：https://github.com/slk1061569042-lab/suntaya_server_blog

2. **进入 Settings → Webhooks**：
   - 点击仓库的 **Settings**
   - 点击左侧菜单的 **Webhooks**
   - 点击 **Add webhook**

3. **配置 Webhook**：
   ```
   Payload URL: http://115.190.54.220:14808/github-webhook/
   Content type: application/json
   Secret: (可选，如果 Jenkins 配置了 Secret)
   Which events: Just the push event
   Active: ✅ 勾选
   ```

4. **保存 Webhook**

5. **测试 Webhook**：
   - 点击 Webhook 右侧的 **Recent Deliveries**
   - 查看是否有请求记录
   - 如果有错误，查看错误信息

---

### 方案 3: 在 Jenkins Job 中配置触发器

**步骤**：

1. **访问 Jenkins**：http://115.190.54.220:14808

2. **进入 Job 配置**：
   - 点击 `suntaya-server-blog` Job
   - 点击左侧菜单的 **Configure**

3. **找到 "Build Triggers" 部分**：
   - 勾选 **GitHub hook trigger for GITScm polling**
   - 或勾选 **Poll SCM**（不推荐）

4. **保存配置**

---

## 🎯 推荐配置

### 最佳实践：GitHub Webhook + Jenkinsfile Triggers

**步骤 1: 修改 Jenkinsfile**

在 `options` 块后添加：

```groovy
triggers {
    githubPush()
}
```

**步骤 2: 配置 GitHub Webhook**

在 GitHub 仓库中配置 Webhook：
- URL: `http://115.190.54.220:14808/github-webhook/`
- Events: `push`

**步骤 3: 验证**

1. Push 代码到 GitHub
2. 检查 Jenkins 是否自动触发构建
3. 查看 Jenkins 构建历史

---

## 🔧 快速修复

### 立即添加触发器到 Jenkinsfile

修改 Jenkinsfile，在 `options` 块后添加 `triggers` 块。

---

## 📋 验证方法

### 验证 Webhook 配置

1. **检查 GitHub Webhook**：
   - 访问：https://github.com/slk1061569042-lab/suntaya_server_blog/settings/hooks
   - 查看是否有 Webhook 配置
   - 查看 Recent Deliveries 是否有请求

2. **检查 Jenkins 日志**：
   ```bash
   ssh root@115.190.54.220 "docker logs jenkins_hwfa-jenkins_hWFA-1 2>&1 | grep -i webhook | tail -20"
   ```

3. **测试触发**：
   - Push 代码到 GitHub
   - 观察 Jenkins 是否自动开始构建

---

## 📝 总结

### 问题原因

- **Jenkinsfile 没有 triggers** → 不会自动触发构建
- **GitHub Webhook 可能未配置** → Push 后不会通知 Jenkins

### 解决方案

1. **在 Jenkinsfile 中添加 `triggers { githubPush() }`**
2. **在 GitHub 中配置 Webhook**
3. **或在 Jenkins Job 中配置触发器**

---

**最后更新**: 2026-01-20
