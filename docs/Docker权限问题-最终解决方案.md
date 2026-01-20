# Docker 权限问题 - 最终解决方案

**时间**: 2026-01-19  
**状态**: ✅ 已修复

## 🔍 问题分析

### 错误信息

```
permission denied while trying to connect to the docker API at unix:///var/run/docker.sock
```

### 原因

- Docker socket 已挂载: `/var/run/docker.sock:/var/run/docker.sock` ✅
- Docker socket 权限: `srw-rw---- 1 root 988` (只有 root 和 GID 988 的用户可以访问)
- Jenkins 容器内没有 GID 988 的组
- Jenkins 用户不在 docker 组中

### 解决方案

**方案 1: 创建 docker 组并添加用户**（推荐）

```bash
# 创建 docker 组（GID 988）
docker exec -u root jenkins_hwfa-jenkins_hWFA-1 groupadd -g 988 docker

# 将 jenkins 用户添加到 docker 组
docker exec -u root jenkins_hwfa-jenkins_hWFA-1 usermod -aG docker jenkins
```

**方案 2: 修改 Docker socket 权限**（临时，不推荐）

```bash
# 修改权限为 666（所有用户可读写）
docker exec -u root jenkins_hwfa-jenkins_hWFA-1 chmod 666 /var/run/docker.sock
```

**注意**: 方案 2 会降低安全性，建议使用方案 1。

---

## ✅ 修复步骤

### 步骤 1: 创建 docker 组

```bash
docker exec -u root jenkins_hwfa-jenkins_hWFA-1 groupadd -g 988 docker
```

### 步骤 2: 添加用户到组

```bash
docker exec -u root jenkins_hwfa-jenkins_hWFA-1 usermod -aG docker jenkins
```

### 步骤 3: 验证修复

```bash
# 检查用户组（应该看到 docker(988)）
docker exec jenkins_hwfa-jenkins_hWFA-1 id jenkins

# 测试 Docker 命令
docker exec -u jenkins jenkins_hwfa-jenkins_hWFA-1 docker ps
```

### 步骤 4: 重新触发构建

在 Jenkins Web UI 中点击 **Build Now** 重新触发构建。

---

## ⚠️ 注意事项

1. **容器重启**: 如果 Jenkins 容器重启，组和用户配置会丢失，需要重新执行
2. **持久化**: 如果需要持久化，可以在容器启动时添加 `--group-add 988` 参数
3. **权限安全**: 确保只有必要的用户/组可以访问 Docker socket

---

## 🧪 测试

修复后，重新触发构建，应该看到：

```
[Pipeline] sh
+ docker inspect -f . node:18-alpine
.
[Pipeline] sh
+ docker pull node:18-alpine
（如果镜像不存在，会拉取；如果已存在，会跳过）
```

而不是之前的 `permission denied` 错误。

---

**提示**: Docker 权限已修复，现在可以重新触发构建测试了。如果还有其他问题，告诉我具体的错误信息。
