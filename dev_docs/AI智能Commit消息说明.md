# AI 智能 Commit Message 说明

## ✨ 新功能

已升级为 **AI 智能分析**，不再只是简单的文件列表，而是会：

1. **分析代码变更内容** - 读取实际的代码 diff
2. **识别变更类型** - 自动识别是新增功能、修复 bug、重构等
3. **生成有意义的描述** - 根据代码内容生成描述性 message
4. **处理编码问题** - 自动处理文件名编码，生成可读的 message

## 🎯 改进对比

### 之前（简单版本）
```
feat: 添加新功能 - IDE\344\270\255\350\207\252\345\212\250\345\241\253\345\205\205Commit\346\266\210\346\201\257\350\257\264\346\230\216.md
```
❌ 文件名编码问题，看不懂
❌ 只是文件列表，没有实际意义

### 现在（AI 智能版本）
```
docs: 添加文档: IDE中自动填充Commit消息说明
```
✅ 文件名清晰可读
✅ 有意义的描述
✅ 自动识别文件类型和变更内容

## 🧠 AI 分析功能

### 1. 代码内容分析

系统会分析实际的代码变更：

- **识别函数和组件** - 检测新增的函数、组件
- **识别 Hook** - 检测 React Hooks 的使用
- **识别 API** - 检测 API 相关的变更
- **识别修复** - 检测 bug fix 相关的代码
- **统计代码行数** - 分析新增/删除的代码量

### 2. 智能分类

根据代码分析结果，自动分类为：

- `feat:` - 新增功能
- `fix:` - 修复问题
- `refactor:` - 重构优化
- `docs:` - 文档更新
- `style:` - 样式更新
- `config:` - 配置更新
- `update:` - 代码更新

### 3. 智能描述

根据变更内容生成描述：

- **新增组件**: `feat: 新增组件: UserProfile`
- **修复 Bug**: `fix: 修复问题: login-error`
- **重构代码**: `refactor: 重构优化: data-fetching`
- **更新文档**: `docs: 更新文档: API说明`
- **添加配置**: `config: 更新配置: package.json`

## 📝 示例

### 示例 1: 添加新组件
```bash
# 添加了 UserProfile.tsx 组件
git add components/UserProfile.tsx
git commit
# 生成: feat: 新增组件: UserProfile
```

### 示例 2: 修复 Bug
```bash
# 修复了登录错误
git add components/Login.tsx
git commit
# 生成: fix: 修复问题: Login
```

### 示例 3: 更新文档
```bash
# 更新了 API 文档
git add docs/API说明.md
git commit
# 生成: docs: 更新文档: API说明
```

### 示例 4: 重构代码
```bash
# 重构了数据获取逻辑
git add lib/data-fetching.ts
git commit
# 生成: refactor: 重构优化: data-fetching
```

### 示例 5: 大量代码变更
```bash
# 添加了大量新功能（+100 行）
git add components/NewFeature.tsx
git commit
# 生成: feat: 新增功能: NewFeature (+100 行)
```

## 🔧 工作原理

1. **获取文件变更** - 读取 `git diff --cached`
2. **分析代码内容** - 解析实际的代码 diff
3. **识别关键模式** - 检测函数、组件、Hook、API 等
4. **统计变更量** - 计算新增/删除的代码行数
5. **生成智能描述** - 根据分析结果生成有意义的 message

## 💡 使用技巧

### 1. 查看预览

在提交前预览会生成什么 message：

```bash
npm run commit:msg
```

### 2. 编辑优化

自动生成的 message 可以：
- 直接使用（通常已经很好）
- 编辑优化（添加更多细节）
- 完全重写（如果需要）

### 3. 多文件提交

如果一次提交多个文件，系统会：
- 分析主要文件（第一个文件）
- 显示文件数量（如果超过 3 个）
- 生成综合描述

## 🎨 智能识别规则

### 文件类型识别

- **组件文件** (`components/`) → `feat: 新增组件` / `feat: 更新组件`
- **Hook 文件** (`hooks/`) → `feat: 新增 Hook` / `feat: 更新 Hook`
- **API 文件** (`api/`, `route.ts`) → `feat: 新增 API` / `feat: 更新 API`
- **工具文件** (`lib/`, `utils/`) → `feat: 新增工具函数` / `update: 更新代码`
- **文档文件** (`.md`, `.mdc`) → `docs: 添加文档` / `docs: 更新文档`
- **配置文件** (`config`, `package.json`) → `config: 更新配置`

### 代码模式识别

- **包含 `fix`/`bug`/`error`** → `fix: 修复问题`
- **包含 `feat`/`feature`/`add`** → `feat: 新增功能`
- **包含 `refactor`/`optimize`** → `refactor: 重构优化`
- **大量新增代码** (+50 行) → `feat: 新增功能 (+X 行)`
- **大量删除代码** (-20 行) → `refactor: 代码优化 (减少 X 行)`

## 🚀 现在试试看！

```bash
# 1. 修改一些文件
# 2. 暂存文件
git add .

# 3. 提交（AI 会自动分析并生成 message）
git commit

# 或者先预览
npm run commit:msg
```

---

**提示**: AI 分析会读取实际的代码变更，所以生成的 message 更有意义、更准确！
