# IDE 中自动填充 Commit Message 说明

## ✅ 已配置完成

自动填充功能**已经可以在 IDE 的 Git 界面中使用**！

## 🎯 在 IDE 中使用

### Cursor / VS Code 中的 Git 界面

1. **打开 Source Control 面板**（`Ctrl+Shift+G`）
2. **暂存文件**（点击文件旁的 `+` 号）
3. **点击 Commit 按钮**或输入框
4. **系统会自动填充 commit message**！

### 工作流程

```
1. 在 IDE 中修改文件
   ↓
2. 在 Source Control 面板暂存文件（Stage Changes）
   ↓
3. 点击 Commit 输入框或 Commit 按钮
   ↓
4. ✅ Commit message 自动填充！
   ↓
5. 可以直接保存，或编辑后保存
```

## 🔧 工作原理

IDE 中的 Git 操作也会触发 Git hooks，所以：

- ✅ **命令行 `git commit`** → 自动填充
- ✅ **IDE Git 界面 Commit** → 自动填充
- ✅ **任何 Git 客户端** → 自动填充

## 📝 自动生成的 Message 示例

根据你的文件变更，系统会自动生成：

- `feat: 添加新功能 - Component.tsx`
- `docs: 更新文档 - README.md`
- `config: 更新配置 - package.json`
- `fix: 修复问题 - bug-fix.tsx`
- `update: 更新代码 - App.tsx`

## 💡 使用技巧

### 1. 直接使用

自动填充的 message 通常已经足够，可以直接保存。

### 2. 编辑修改

如果觉得自动生成的 message 不够准确，可以：
- 在 IDE 的 commit 输入框中直接编辑
- 修改后保存即可

### 3. 手动输入

如果想完全手动输入，直接在输入框中输入即可，会自动覆盖生成的 message。

## 🐛 故障排除

### 如果 IDE 中没有自动填充

1. **检查 Git Hook 是否正常**:
   ```bash
   # 测试脚本
   node scripts/generate-commit-msg.js
   ```

2. **检查文件路径**:
   - 确保 `.git/hooks/prepare-commit-msg.cmd` 存在
   - 确保 `scripts/generate-commit-msg.js` 存在

3. **重启 IDE**:
   - 有时候需要重启 IDE 才能识别新的 Git hooks

4. **检查 Node.js**:
   ```bash
   node --version
   ```

### 如果 message 格式不对

- 可以直接在 IDE 中编辑
- 或者使用命令行：`git commit -m "你的 message"`

## ✨ 现在试试看！

1. 在 IDE 中修改一些文件
2. 在 Source Control 面板暂存文件
3. 点击 Commit 输入框
4. 看看是否自动填充了 message！

---

**提示**: Git hooks 会在任何 Git 操作时触发，无论是命令行还是 IDE 界面！
