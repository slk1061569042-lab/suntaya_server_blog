# PowerShell 中文乱码解决方案

**时间**: 2026-01-20  
**问题**: PowerShell 中 Git 提交信息显示乱码

## 🔍 问题分析

### 实际情况

1. **Git 存储是正确的** ✅
   - Git 已配置 UTF-8 编码
   - 提交信息以 UTF-8 格式存储
   - 问题在于 PowerShell **显示**时的编码

2. **PowerShell 显示问题** ⚠️
   - PowerShell 默认使用系统编码（Windows 中文系统通常是 GBK）
   - 即使设置了 UTF-8，显示时仍可能乱码
   - 这是 Windows PowerShell 的已知限制

---

## ✅ 解决方案

### 方案 1: 使用英文提交信息（最推荐）

**优点**：
- ✅ 完全避免编码问题
- ✅ 国际化友好
- ✅ 团队协作更方便
- ✅ 不需要额外配置

**示例**：
```powershell
git commit -m "fix: resolve encoding issues"
git commit -m "docs: add deployment guide"
git commit -m "feat: add new feature"
```

---

### 方案 2: 使用 Git Bash（推荐用于中文）

**步骤**：
1. **打开 Git Bash**（已随 Git 安装）
2. **在 Git Bash 中操作**：
   ```bash
   cd /e/GitSpace/suntaya_server_blog
   git commit -m "测试: 中文编码测试"
   git log -1 --pretty=format:"%s"
   ```

**优点**：
- ✅ 更好的中文支持
- ✅ UTF-8 编码默认启用
- ✅ 显示正常

---

### 方案 3: 使用 VS Code 终端（推荐）

**VS Code 的终端默认使用 UTF-8**：

1. **在 VS Code 中打开终端**（`Ctrl+``）
2. **直接使用中文提交**：
   ```bash
   git commit -m "测试: 中文编码测试"
   git log -1 --pretty=format:"%s"
   ```

**优点**：
- ✅ VS Code 终端默认 UTF-8
- ✅ 不需要额外配置
- ✅ 显示正常
- ✅ 与编辑器集成

---

### 方案 4: 配置 PowerShell（复杂）

**创建 PowerShell 配置文件**：

```powershell
# 1. 查看配置文件路径
$PROFILE

# 2. 如果文件不存在，创建它
if (!(Test-Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}

# 3. 编辑配置文件，添加以下内容：
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# 4. 重启 PowerShell
```

**注意**：
- ⚠️ 可能仍然有显示问题
- ⚠️ 需要重启 PowerShell
- ⚠️ 不是所有 PowerShell 版本都支持

---

## 🎯 推荐方案

### 对于日常使用

**推荐组合**：
1. **Git 提交**：使用 **英文**（避免编码问题）
2. **查看日志**：使用 **Git Bash** 或 **VS Code 终端**
3. **Jenkins 部署**：已配置，应该正常显示中文

---

## 📋 验证方法

### 验证 Git 存储是否正确

```powershell
# 方法 1: 导出到文件查看
git log -1 --format=%B | Out-File -Encoding utf8 commit-msg.txt
notepad commit-msg.txt  # 应该显示正确的中文

# 方法 2: 使用 Git Bash 查看
# 在 Git Bash 中：
git log -1 --pretty=format:"%s"  # 应该显示正确的中文
```

### 验证 Jenkins 编码

1. **触发一次构建**
2. **查看控制台输出**：中文应该正常显示
3. **检查日志文件**：如果有日志文件，检查编码

---

## 📝 总结

### 问题根源

- **PowerShell 编码限制**：Windows PowerShell 对 UTF-8 支持不完善
- **Git 存储正确**：提交信息以 UTF-8 格式存储
- **显示问题**：PowerShell 显示时使用错误编码

### 推荐做法

1. **提交信息**：使用英文（最简单、最可靠）
2. **查看日志**：使用 Git Bash 或 VS Code 终端
3. **Jenkins 部署**：已配置，应该正常

### 如果必须使用中文

- ✅ 使用 **Git Bash** 提交和查看
- ✅ 或使用 **VS Code 终端**
- ❌ 避免使用 **PowerShell** 直接操作

---

## 🔧 快速参考

### 使用英文提交（推荐）

```powershell
git commit -m "fix: resolve encoding issues"
git commit -m "docs: add deployment guide"
```

### 使用 Git Bash（中文）

```bash
# 在 Git Bash 中
git commit -m "测试: 中文编码测试"
git log -1 --pretty=format:"%s"
```

### 使用 VS Code 终端（中文）

```bash
# 在 VS Code 终端中
git commit -m "测试: 中文编码测试"
git log -1 --pretty=format:"%s"
```

---

**最后更新**: 2026-01-20
