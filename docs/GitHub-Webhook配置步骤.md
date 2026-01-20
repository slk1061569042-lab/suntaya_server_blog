# GitHub Webhook 配置步骤

**时间**: 2026-01-20  
**目的**: 配置 GitHub Webhook 实现自动构建

## 🔍 问题

Push 代码到 GitHub 后，Jenkins 没有自动触发构建。

## ✅ 解决方案

### 步骤 1: 在 Jenkinsfile 中添加触发器（已完成）

已在 Jenkinsfile 中添加：
```groovy
triggers {
    githubPush()
}
```

### 步骤 2: 配置 GitHub Webhook

**步骤**：

1. **打开 GitHub 仓库**：
   - 访问：https://github.com/slk1061569042-lab/suntaya_server_blog

2. **进入 Webhook 设置**：
   - 点击仓库的 **Settings**
   - 点击左侧菜单的 **Webhooks**
   - 点击 **Add webhook**（或编辑现有 Webhook）

3. **配置 Webhook**：
   ```
   Payload URL: http://115.190.54.220:14808/github-webhook/
   Content type: application/json
   Secret: (留空，除非 Jenkins 配置了 Secret)
   Which events would you like to trigger this webhook?
   ✅ Just the push event
   Active: ✅ 勾选
   ```

4. **保存 Webhook**

5. **测试 Webhook**：
   - 点击 Webhook 右侧的 **Recent Deliveries**
   - 查看是否有请求记录
   - 如果有错误，查看错误信息

---

## 🔧 验证 Webhook

### 方法 1: 查看 GitHub Webhook 日志

1. **访问 Webhook 设置**：
   - https://github.com/slk1061569042-lab/suntaya_server_blog/settings/hooks

2. **点击 Webhook** → **Recent Deliveries**

3. **查看请求**：
   - 应该看到最近的 Push 事件
   - 状态码应该是 `200`（成功）
   - 如果有错误，查看 Response 内容

### 方法 2: 查看 Jenkins 日志

```bash
# 查看 Jenkins 日志
ssh root@115.190.54.220 "docker logs jenkins_hwfa-jenkins_hWFA-1 2>&1 | grep -i webhook | tail -20"
```

### 方法 3: 测试触发

1. **Push 代码到 GitHub**
2. **观察 Jenkins**：
   - 访问：http://115.190.54.220:14808
   - 进入 `suntaya-server-blog` Job
   - 查看构建历史，应该自动出现新的构建

---

## ⚠️ 常见问题

### 问题 1: Webhook 返回 403 或 401

**原因**：Jenkins 需要认证

**解决**：
- 在 Webhook URL 中添加认证信息（不推荐，不安全）
- 或配置 Jenkins 允许匿名访问 Webhook（不推荐）
- 或使用 GitHub App 认证（推荐）

### 问题 2: Webhook 返回 404

**原因**：URL 错误或 Jenkins 插件未安装

**解决**：
1. 检查 URL：`http://115.190.54.220:14808/github-webhook/`
2. 检查 Jenkins 是否安装了 **GitHub Plugin**
3. 检查 Jenkins 是否可访问（防火墙、网络）

### 问题 3: Webhook 触发但构建未开始

**原因**：Jenkinsfile 中的触发器配置可能有问题

**解决**：
1. 检查 Jenkinsfile 中是否有 `triggers { githubPush() }`
2. 检查 Jenkins Job 配置中的 "Build Triggers"
3. 查看 Jenkins 日志

---

## 📋 完整配置检查清单

- [ ] Jenkinsfile 中有 `triggers { githubPush() }`
- [ ] GitHub Webhook 已配置
- [ ] Webhook URL 正确：`http://115.190.54.220:14808/github-webhook/`
- [ ] Webhook 事件设置为 `push`
- [ ] Webhook 状态为 `Active`
- [ ] Jenkins GitHub Plugin 已安装
- [ ] Jenkins 可以从外网访问（或使用内网穿透）

---

## 🎯 快速测试

### 测试步骤

1. **配置 Webhook**（如果还没配置）
2. **Push 代码**：
   ```powershell
   git commit --allow-empty -m "test: trigger webhook"
   git push origin main
   ```
3. **观察 Jenkins**：
   - 等待 10-30 秒
   - 查看 Jenkins 构建历史
   - 应该自动出现新的构建

---

**最后更新**: 2026-01-20
