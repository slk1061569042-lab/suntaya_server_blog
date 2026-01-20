# 解决 Docker 权限问题

**时间**: 2026-01-19  
**问题**: Jenkins 构建失败，Docker 权限被拒绝

## 🔍 问题分析

### 错误信息

从构建日志中看到：

```
permission denied while trying to connect to the docker API at unix:///var/run/docker.sock
```

### 原因

Jenkins 容器内的用户无法访问 Docker socket (`/var/run/docker.sock`)，导致无法执行 Docker 命令。

### 影响

- ❌ 无法执行 `docker inspect` 检查镜像
- ❌ 无法执行 `docker pull` 拉取镜像
- ❌ Docker Pipeline 插件无法工作

---

## 🔧 解决方案

### 方案 1: 将 Jenkins 用户添加到 Docker 组（推荐）

需要重启 Jenkins 容器，添加 Docker socket 挂载和用户组映射。

### 方案 2: 修改 Docker Socket 权限（临时）

临时修改 Docker socket 权限，但重启后可能失效。

### 方案 3: 使用 Docker-in-Docker (DinD)

在 Jenkins 容器内运行独立的 Docker daemon，但资源消耗较大。

---

## 📋 推荐方案：方案 1

### 步骤 1: 检查当前配置

```bash
# 检查 Docker socket 挂载
docker inspect jenkins_hwfa-jenkins_hWFA-1 | grep -A 10 Binds

# 检查 Jenkins 容器内的用户
docker exec jenkins_hwfa-jenkins_hWFA-1 id

# 检查宿主机 Docker 组 ID
getent group docker | cut -d: -f3
```

### 步骤 2: 停止 Jenkins 容器

```bash
docker stop jenkins_hwfa-jenkins_hWFA-1
```

### 步骤 3: 修改容器配置

需要修改 Docker Compose 文件或启动命令，添加：
- Docker socket 挂载: `-v /var/run/docker.sock:/var/run/docker.sock`
- Docker 组映射: `--group-add $(getent group docker | cut -d: -f3)`

### 步骤 4: 重启 Jenkins 容器

```bash
docker start jenkins_hwfa-jenkins_hWFA-1
```

---

## ⚠️ 注意事项

1. **需要访问 Docker Compose 文件**: 如果使用 Docker Compose，需要修改 `docker-compose.yml`
2. **需要重启容器**: 修改配置后需要重启 Jenkins
3. **权限安全**: 确保只有必要的用户/组可以访问 Docker socket

---

**提示**: 需要查看 Docker Compose 文件或容器启动命令才能确定具体的修改方法。
