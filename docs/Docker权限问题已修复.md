# Docker 权限问题已修复

**时间**: 2026-01-19  
**状态**: ✅ 已修复

## 🔍 问题分析

### 错误信息

```
permission denied while trying to connect to the docker API at unix:///var/run/docker.sock
```

### 原因

- Docker socket 已挂载: `/var/run/docker.sock:/var/run/docker.sock` ✅
- Docker socket 所有者: `root:988` (988 是 docker 组的 GID)
- Jenkins 用户: `jenkins` (uid=1000, gid=1000)，**不在 docker 组中** ❌

### 解决方案

将 Jenkins 用户添加到 docker 组（GID 988）：

```bash
docker exec -u root jenkins_hwfa-jenkins_hWFA-1 usermod -aG 988 jenkins
```

---

## ✅ 修复步骤

### 步骤 1: 添加用户到组

```bash
docker exec -u root jenkins_hwfa-jenkins_hWFA-1 usermod -aG 988 jenkins
```

### 步骤 2: 验证修复

```bash
# 检查用户组
docker exec jenkins_hwfa-jenkins_hWFA-1 id jenkins

# 测试 Docker 命令
docker exec -u jenkins jenkins_hwfa-jenkins_hWFA-1 docker ps
```

### 步骤 3: 重新触发构建

在 Jenkins Web UI 中点击 **Build Now** 重新触发构建。

---

## 📋 预期结果

修复后，构建应该能够：

1. ✅ 执行 `docker inspect` 检查镜像
2. ✅ 执行 `docker pull` 拉取镜像
3. ✅ Docker Pipeline 插件正常工作
4. ✅ 构建流程正常进行

---

## ⚠️ 注意事项

1. **容器重启**: 如果 Jenkins 容器重启，可能需要重新执行 `usermod` 命令
2. **持久化**: 如果需要持久化，可以在容器启动时添加 `--group-add 988` 参数
3. **权限安全**: 确保只有必要的用户/组可以访问 Docker socket

---

**提示**: 权限已修复，现在可以重新触发构建测试了。
