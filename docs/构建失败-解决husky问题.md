# 构建失败 - 解决 husky 问题

**时间**: 2026-01-20  
**状态**: Docker 权限已解决，但出现新错误

## 🔍 问题分析

### 构建 #7 的错误

从构建日志中看到：

```
> git-docs-blog@0.1.0 prepare
> husky install

sh: husky: not found
npm error code 127
npm error command failed
npm error command sh -c husky install
```

### 原因

1. **Docker 权限问题已解决** ✅
   - 构建 #7 可以成功执行 `docker pull node:18-alpine`
   - Docker Pipeline 插件正常工作

2. **新问题：husky 命令找不到** ❌
   - `npm ci` 执行后，会运行 `prepare` 脚本
   - `prepare` 脚本尝试执行 `husky install`
   - 但 `husky` 命令找不到

### 可能的原因

1. **husky 未安装**: `husky` 可能不在 `package.json` 的依赖中
2. **路径问题**: `node_modules/.bin` 不在 PATH 中
3. **安装失败**: `npm ci` 可能没有正确安装 husky

---

## 🔧 解决方案

### 方案 1: 修改 package.json（推荐）

在 `package.json` 中，将 `prepare` 脚本改为可选执行：

```json
{
  "scripts": {
    "prepare": "husky install || true"
  }
}
```

或者完全移除 `prepare` 脚本（如果不需要 husky）。

### 方案 2: 在 Jenkinsfile 中跳过 prepare

在 Jenkinsfile 的安装依赖阶段，使用 `--ignore-scripts` 跳过 prepare：

```groovy
npm ci --ignore-scripts
```

### 方案 3: 确保 husky 已安装

检查 `package.json` 中是否有 `husky` 依赖，如果没有，添加它。

---

## 📋 推荐方案

**方案 1** 是最简单的，因为：
- 不需要修改 Jenkinsfile
- 在 CI 环境中，通常不需要 husky（它是 Git hooks 工具）
- `|| true` 确保即使 husky 不存在也不会失败

---

**提示**: 需要查看 `package.json` 来确认具体的配置。
