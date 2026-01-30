# Jenkins 磁盘空间与资源清理

## Jenkins 在 Docker 中部署时

若 **Jenkins 本身是跑在 Docker 容器里**的：

- **`/var/jenkins_home`** 一般是**数据卷（volume）或宿主机目录挂载**，占用的空间在**宿主机**上，删容器不会自动清掉这些数据。
- 清理时要分两块：
  1. **容器内 JENKINS_HOME**：用 `docker exec` 进 Jenkins 容器执行 `du`、删旧工作区等（见下方 A、B）。
  2. **宿主机上的 Docker**：在**宿主机**执行 `docker system df`、`docker image prune`、`docker builder prune`（见下方 C）。

示例（先查容器名）：

```bash
# 宿主机上
docker ps | grep -i jenkins   # 记下 CONTAINER ID 或 NAMES

# 查看容器内 JENKINS_HOME 占用（把 <jenkins_container> 换成实际容器名或 ID）
docker exec <jenkins_container> du -sh /var/jenkins_home/workspace/* 2>/dev/null | sort -hr | head -20
docker exec <jenkins_container> du -sh /var/jenkins_home/jobs/*/builds 2>/dev/null | sort -hr | head -10
```

---

## 1. JENKINS_HOME 快满了（优先处理）

提示：**「你的 Jenkins 数据目录 /var/jenkins_home 就快要空间不足了」**

### 原因

- 构建历史、工作区、构建产物堆积
- Jenkins 用 Docker 执行构建时，产生的镜像/层、未清理的容器（在**宿主机**上占空间）
- 嵌套目录或重复部署导致重复文件（若曾出现 `/www/.../next.sunyas.com/www/...` 等）

### 建议操作

**若 Jenkins 在 Docker 中**：以下 A、B 在 **Jenkins 容器内**执行（`docker exec <jenkins_container> bash -c "..."`），C 在 **宿主机**执行。

**A. 清理本流水线旧构建**

- 流水线已设置 `buildDiscarder(logRotator(numToKeepStr: '10'))`，只保留最近 10 次；若之前未限制，可手动删除旧构建：
- 进入该 Job → 左侧「Build History」→ 对不需要的构建点进去 → 左侧「Delete build」

**B. 清理工作区与全局缓存（需有权限）**

- **Jenkins 在 Docker 中**：在宿主机执行 `docker exec <jenkins_container> bash -c "..."`，例如：
```bash
# 宿主机执行，<jenkins_container> 换成实际容器名或 ID
docker exec <jenkins_container> du -sh /var/jenkins_home/workspace/* 2>/dev/null | sort -hr | head -20
docker exec <jenkins_container> du -sh /var/jenkins_home/jobs/*/builds 2>/dev/null | sort -hr | head -10
# 只清理某 Job 的工作区（谨慎）：docker exec <jenkins_container> rm -rf /var/jenkins_home/workspace/<Job名>
```
- **Jenkins 直接装在本机**：在 Jenkins 机器上 `cd /var/jenkins_home` 后执行上述 `du`/`rm`。
- 流水线里已有 `post { always { cleanWs() } }`，每次构建结束会清工作区，主要占空间的是 `jobs/*/builds` 历史。

**C. Docker 占用（在宿主机执行）**

Jenkins 用 Docker 执行构建时，镜像和构建缓存在**宿主机**上，需在**宿主机**执行：

```bash
docker system df
docker image prune -a --filter "until=72h"   # 删 3 天前未用的镜像
docker builder prune -f                     # 删构建缓存
```

**D. 扩大磁盘或迁移 JENKINS_HOME**

若磁盘本身太小，可扩容；若 JENKINS_HOME 是 Docker volume，可迁移到更大分区后改 `docker run -v` 或 compose 的 volume 配置并重启 Jenkins。

---

## 2. 「Resources Jenkins was not able to dispose automatically」

提示：**There are resources Jenkins was not able to dispose automatically**，右侧有 **Manage** 按钮。

- 含义：有资源（如 agent、工作区、锁）未按预期释放，可能和构建失败、中断、Docker 未正常关闭有关。
- 操作：点 **Manage**，在列表里勾选可安全释放的资源（如离线/断开的 agent、陈旧的工作区），执行清理。清理后有助于释放部分空间并减少误报。

---

## 3. 新版本 Jenkins 2.541.1

- 仅为更新提示，不影响当前磁盘与资源问题。
- 若需升级，请先备份 `/var/jenkins_home` 并在维护窗口操作。

---

**小结**：先处理磁盘（删旧构建、Docker 清理、必要时扩容），再点 Manage 清理未释放资源；已改 `remoteDirectory: '.'` 并做了展平兜底后，新部署不应再产生嵌套目录，有助于避免空间被重复目录占满。
