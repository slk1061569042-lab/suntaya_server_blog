# 自动生成 Commit Message 说明

## 📋 概述

项目已配置自动生成 Git Commit Message 功能。当你执行 `git commit` 时，系统会自动分析你的代码变更并生成合适的 commit message。

## 🚀 使用方法

### 方法 1: 自动生成（推荐）

直接执行 `git commit`，系统会自动生成 commit message：

```bash
git add .
git commit
# 系统会自动生成并填充 commit message
```

### 方法 2: 手动预览

如果你想先预览生成的 commit message：

```bash
# 查看会生成什么 message
npm run commit:msg

# 或者
node scripts/generate-commit-msg.js
```

### 方法 3: 使用 npm 脚本

```bash
git add .
npm run commit
```

## 🎯 Commit Message 格式

系统会根据文件变更自动生成以下类型的 commit message：

### 1. 新增文件
- `feat: 添加新功能 - 文件名`
- `docs: 添加文档 - 文件名`
- `feat: 添加新文件 - 文件名`

### 2. 修改文件
- `update: 更新代码 - 文件名`
- `docs: 更新文档 - 文件名`
- `config: 更新配置 - 文件名`
- `style: 更新样式 - 文件名`
- `test: 更新测试 - 文件名`
- `fix: 修复问题 - 文件名`（如果文件名包含 fix/bug/error）

### 3. 删除文件
- `refactor: 删除文件 - 文件名`

### 4. 混合变更
- `chore: 代码变更 - 文件名`

## 📝 示例

### 示例 1: 添加新组件
```bash
git add components/NewComponent.tsx
git commit
# 自动生成: feat: 添加新功能 - NewComponent.tsx
```

### 示例 2: 更新文档
```bash
git add dev_docs/说明.md
git commit
# 自动生成: docs: 更新文档 - 说明.md
```

### 示例 3: 修复 Bug
```bash
git add components/fix-bug.tsx
git commit
# 自动生成: fix: 修复问题 - fix-bug.tsx
```

### 示例 4: 更新配置
```bash
git add package.json tsconfig.json
git commit
# 自动生成: config: 更新配置 - package.json, tsconfig.json
```

## 🔧 工作原理

### Git Hook

项目使用 Git 的 `prepare-commit-msg` hook 来自动生成 commit message：

- **Linux/Mac**: `.git/hooks/prepare-commit-msg` (Shell 脚本)
- **Windows**: `.git/hooks/prepare-commit-msg.cmd` (批处理脚本)

### Node.js 脚本

核心逻辑在 `scripts/generate-commit-msg.js` 中：

1. 分析 `git diff --cached` 获取暂存区文件变更
2. 根据文件类型和变更类型生成合适的 message
3. 自动写入 commit message 文件

## ⚙️ 自定义配置

### 修改生成规则

编辑 `scripts/generate-commit-msg.js` 可以自定义：

- 文件类型判断逻辑
- Commit message 格式
- 文件列表显示方式

### 禁用自动生成

如果你想手动编写 commit message：

```bash
# 使用 -m 参数直接指定 message
git commit -m "你的 commit message"

# 或者使用 --no-verify 跳过 hook
git commit --no-verify
```

## 🐛 故障排除

### Hook 不工作

1. **检查文件权限**（Linux/Mac）:
   ```bash
   chmod +x .git/hooks/prepare-commit-msg
   ```

2. **检查 Node.js 是否可用**:
   ```bash
   node --version
   ```

3. **手动测试脚本**:
   ```bash
   node scripts/generate-commit-msg.js
   ```

### Message 不符合预期

- 可以手动编辑生成的 message
- 或者使用 `git commit -m "自定义 message"` 覆盖

## 📚 相关文件

- **Git Hook (Linux/Mac)**: `.git/hooks/prepare-commit-msg`
- **Git Hook (Windows)**: `.git/hooks/prepare-commit-msg.cmd`
- **生成脚本**: `scripts/generate-commit-msg.js`
- **npm 脚本**: `package.json` 中的 `commit:msg`

## 💡 最佳实践

1. **提交前检查**: 使用 `npm run commit:msg` 预览生成的 message
2. **可以编辑**: 自动生成的 message 可以手动编辑
3. **保持简洁**: 系统生成的 message 通常已经足够，但你可以根据需要修改
4. **遵循规范**: 生成的 message 遵循常见的 commit 规范（feat, fix, docs 等）

---

**注意**: 自动生成的 commit message 只是一个起点，你可以根据需要编辑它！
