# 如何找到并填写 GitHub 私钥

**时间**: 2026-01-19

## 🔍 第一步：找到私钥文件

你的 GitHub SSH 私钥文件位置：

```
C:\Users\Administrator\.ssh\id_ed25519_github_new
```

### 方法 1：通过文件资源管理器

1. 按 `Win + R` 打开运行对话框
2. 输入：`C:\Users\Administrator\.ssh`
3. 按回车，会打开 SSH 目录
4. 找到 `id_ed25519_github_new` 文件（**注意：不是 `.pub` 结尾的公钥文件**）

### 方法 2：通过 PowerShell

在 PowerShell 中执行：
```powershell
notepad C:\Users\Administrator\.ssh\id_ed25519_github_new
```

这会直接用记事本打开私钥文件。

## 📋 第二步：复制私钥内容

打开 `id_ed25519_github_new` 文件后，你会看到类似这样的内容：

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCH4Ohjg7Jdayl90LBlugbtI+22hX50/XxRqUoni+s5PAAAAKCxAvQ7sQL0
OwAAAAtzc2gtZWQyNTUxOQAAACCH4Ohjg7Jdayl90LBlugbtI+22hX50/XxRqUoni+s5PA
AAAECSpJIzA6c4QfBQCI9fJ9gBlru0G4n20WttonX39DHQlYfg6GODsl1rKX3QsGW6Bu0j
7baFfnT9fFGpSieL6zk8AAAAF3NsazEwNjE1NjkwNDJAZ21haWwuY29tAQIDBAUG
-----END OPENSSH PRIVATE KEY-----
```

**重要**：
- ✅ 复制**全部内容**，包括：
  - `-----BEGIN OPENSSH PRIVATE KEY-----` 这一行
  - 中间的所有行（base64 编码的内容）
  - `-----END OPENSSH PRIVATE KEY-----` 这一行
- ❌ 不要只复制中间的部分
- ❌ 不要复制 `.pub` 文件（那是公钥，不是私钥）

## ⚠️ 第三步：解决 HTTP ERROR 403 错误

如果你在 Jenkins 界面看到 `HTTP ERROR 403 No valid crumb was included in the request` 错误，这是 CSRF 保护机制导致的。

### 解决方法：

1. **刷新页面**：
   - 在 Jenkins 界面按 `F5` 或点击浏览器的刷新按钮
   - 重新打开"添加凭据"对话框

2. **如果刷新无效，重启 Jenkins**：
   ```powershell
   ssh root@115.190.54.220 "docker restart jenkins_hwfa-jenkins_hWFA-1"
   ```
   等待 1-2 分钟后，重新访问 Jenkins

3. **清除浏览器缓存**（如果上述方法都不行）：
   - 按 `Ctrl + Shift + Delete`
   - 清除最近 1 小时的缓存和 Cookie
   - 重新登录 Jenkins

## 📝 第四步：在 Jenkins 中填写

### 详细步骤：

1. **访问 Jenkins**: http://115.190.54.220:14808

2. **进入 Credentials 管理**:
   - 点击 **Manage Jenkins**（管理 Jenkins）
   - 点击 **Manage Credentials**（管理凭据）
   - 点击 **System** → **Global credentials (unrestricted)**
   - 点击左侧 **Add Credentials**（添加凭据）

3. **填写表单**:
   ```
   Kind: SSH Username with private key
   Scope: Global
   ID: github-ssh-key
   Description: GitHub SSH Key for suntaya_server_blog
   Username: git
   Private Key: Enter directly（选择这个选项）
   ```

4. **粘贴私钥**:
   - 在 `Key` 文本框中，**粘贴你在第二步复制的完整私钥内容**
   - 确保包括 `-----BEGIN` 和 `-----END` 这两行

5. **Passphrase**: 留空（如果你的私钥没有设置密码）

6. **保存**: 点击 **添加** 或 **OK** 按钮

## ✅ 验证

添加成功后，你应该能看到：
- Credential 列表中出现了 `github-ssh-key`
- 没有错误提示

## 🔧 如果还是遇到问题

如果私钥文件不存在，我们可以重新生成：

```powershell
ssh-keygen -t ed25519 -C "slk1061569042@gmail.com" -f C:\Users\Administrator\.ssh\id_ed25519_github_new
```

然后需要：
1. 将公钥添加到 GitHub（`id_ed25519_github_new.pub`）
2. 使用新生成的私钥内容填写 Jenkins Credential

---

**提示**: 如果遇到任何问题，告诉我具体的错误信息，我会帮你解决！
