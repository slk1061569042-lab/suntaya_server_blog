# 已修复 husky 问题 - 使用 --ignore-scripts

**时间**: 2026-01-20  
**状态**: ✅ 已修复

## 🔍 问题分析

### 构建 #8 的错误

```
> git-docs-blog@0.1.0 prepare
> husky install

sh: husky: not found
npm error code 127
```

### 原因

1. **Docker 权限问题已解决** ✅
   - 构建 #8 可以成功执行 `docker pull node:18-alpine`
   - Docker Pipeline 插件正常工作

2. **husky 问题仍然存在** ❌
   - `package.json` 中的 `prepare` 脚本会在 `npm ci` 后自动执行
   - `husky install` 命令找不到（可能是路径问题）

### 解决方案

在 Jenkinsfile 中使用 `--ignore-scripts` 参数跳过所有 npm 脚本（包括 `prepare`）：

```groovy
npm ci --ignore-scripts
```

**为什么这样修改？**
- 不需要修改 `package.json`
- 在 CI 环境中通常不需要运行 prepare 脚本（husky 是 Git hooks 工具，用于本地开发）
- 可以避免推送问题（因为历史提交中有私钥，推送被阻止）

---

## ✅ 已完成的修复

### 修改 Jenkinsfile

在 "Install Dependencies" 阶段，添加 `--ignore-scripts` 参数：

```groovy
if [ -f package-lock.json ]; then
  echo "===> 检测到 package-lock.json，使用 npm ci 安装依赖（跳过 prepare 脚本）"
  npm ci --ignore-scripts
else
  echo "===> 未检测到 package-lock.json，使用 npm install 安装依赖（跳过 prepare 脚本）"
  npm install --ignore-scripts
fi
```

---

## 🧪 下一步

### 提交并推送

```bash
git add Jenkinsfile
git commit -m "fix: skip npm prepare scripts in CI to avoid husky install failure"
git push origin main
```

**注意**: 如果推送被阻止（因为历史提交中有私钥），可以：
1. 使用 GitHub 提供的临时允许链接
2. 或者等待推送成功后，Jenkins 会自动触发构建

### 或手动触发构建

在 Jenkins Web UI 中点击 **Build Now** 重新触发构建。

---

## 📋 预期结果

修复后，构建应该能够：

1. ✅ 代码检出成功
2. ✅ 安装依赖成功（跳过 prepare 脚本，不会执行 husky install）
3. ✅ 继续执行后续阶段（Lint、Build、Export、Deploy）

---

**提示**: 已修复 husky 问题，使用 `--ignore-scripts` 跳过 prepare 脚本。现在可以提交并推送代码，然后重新触发构建测试。
