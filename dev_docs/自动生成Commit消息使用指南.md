# 自动生成 Commit Message 使用指南

## ✅ 已配置完成

项目已成功配置自动生成 Git Commit Message 功能！

## 🚀 快速开始

### 基本使用

1. **添加文件到暂存区**:
   ```bash
   git add .
   ```

2. **提交（自动生成 message）**:
   ```bash
   git commit
   ```
   系统会自动生成并填充 commit message，你可以直接保存或编辑。

### 预览生成的 Message

在提交前，你可以先预览会生成什么 message：

```bash
npm run commit:msg
```

或者：

```bash
node scripts/generate-commit-msg.js
```

## 📝 生成的 Message 示例

根据你的代码变更，系统会自动生成类似这样的 message：

- `feat: 添加新功能 - NewComponent.tsx`
- `docs: 更新文档 - README.md`
- `config: 更新配置 - package.json, tsconfig.json`
- `fix: 修复问题 - bug-fix.tsx`
- `update: 更新代码 - Component.tsx`
- `style: 更新样式 - globals.css`

## 🎯 工作原理

1. 当你执行 `git commit` 时
2. Git 会触发 `prepare-commit-msg` hook
3. Hook 调用 `scripts/generate-commit-msg.js`
4. 脚本分析暂存区的文件变更
5. 根据文件类型和变更类型生成合适的 message
6. 自动填充到 commit message 编辑器

## 💡 使用技巧

### 1. 编辑自动生成的 Message

自动生成的 message 只是一个起点，你可以：
- 直接保存使用
- 编辑修改后使用
- 完全重写

### 2. 手动指定 Message

如果你想手动指定 message，使用 `-m` 参数：

```bash
git commit -m "你的自定义 message"
```

### 3. 跳过自动生成

如果想跳过自动生成，使用 `--no-verify`：

```bash
git commit --no-verify -m "手动 message"
```

## 🔧 故障排除

### Hook 不工作？

1. **检查文件是否存在**:
   ```bash
   # Windows
   Test-Path .git\hooks\prepare-commit-msg.cmd
   
   # Linux/Mac
   ls -la .git/hooks/prepare-commit-msg
   ```

2. **手动测试脚本**:
   ```bash
   node scripts/generate-commit-msg.js
   ```

3. **检查 Node.js**:
   ```bash
   node --version
   ```

### Message 不符合预期？

- 可以手动编辑生成的 message
- 或者使用 `git commit -m "自定义 message"` 覆盖

## 📚 相关文件

- **生成脚本**: `scripts/generate-commit-msg.js`
- **Git Hook (Windows)**: `.git/hooks/prepare-commit-msg.cmd`
- **Git Hook (Linux/Mac)**: `.git/hooks/prepare-commit-msg`
- **npm 脚本**: `npm run commit:msg`

## ✨ 现在试试看！

```bash
# 1. 添加一些文件
git add .

# 2. 提交（会自动生成 message）
git commit

# 或者先预览
npm run commit:msg
```

---

**提示**: 自动生成的 message 遵循常见的 commit 规范，但你可以根据需要编辑它！
