# Jenkins 交换空间配置问题

**时间**: 2026-01-19  
**问题**: Jenkins master 节点剩余交换空间为 0 B，存在红色警告

## 🔍 问题分析

### 当前状态

从 Jenkins 节点列表页面可以看到：

| 节点 | 剩余交换空间 | 状态 |
|------|-------------|------|
| **master** | **0 B** | ⚠️ **红色警告** |

### 问题严重性

**这是一个严重的配置问题**，可能导致以下后果：

1. **内存不足时系统崩溃**
   - 当物理内存耗尽时，系统无法使用交换空间作为缓冲
   - 可能导致 Jenkins 进程被 OOM Killer 强制终止
   - 构建任务可能因内存不足而失败

2. **系统性能下降**
   - 没有交换空间时，系统无法将不常用的内存页交换到磁盘
   - 可能导致频繁的内存分配失败
   - 系统响应变慢

3. **构建任务失败风险**
   - 大型构建任务（如 Next.js 构建）需要大量内存
   - 没有交换空间时，内存不足会导致构建失败
   - 特别是 Docker 容器构建时，内存需求更大

### 为什么需要交换空间？

**交换空间（Swap）的作用**：

- ✅ **内存溢出保护**: 当物理内存不足时，系统可以将不常用的内存页交换到磁盘
- ✅ **系统稳定性**: 防止 OOM Killer 强制终止进程
- ✅ **性能缓冲**: 为系统提供额外的"虚拟内存"空间
- ✅ **资源管理**: 允许系统更灵活地管理内存资源

**推荐配置**：
- **最小**: 物理内存的 50%
- **推荐**: 物理内存的 100%（与物理内存相同）
- **最大**: 物理内存的 200%

---

## 🔧 解决方案

### 方案 1: 创建 Swap 文件（推荐）

这是最简单、最常用的方法，不需要重新分区。

#### 步骤 1: 检查当前 Swap 状态

```bash
# 检查当前 swap 使用情况
free -h

# 检查是否有 swap 分区或文件
swapon --show

# 检查磁盘空间（确保有足够空间创建 swap 文件）
df -h
```

#### 步骤 2: 创建 Swap 文件

```bash
# 创建 4GB 的 swap 文件（根据你的需求调整大小）
# 推荐大小：与物理内存相同或更大
sudo fallocate -l 4G /swapfile

# 或者使用 dd 命令（如果 fallocate 不可用）
# sudo dd if=/dev/zero of=/swapfile bs=1024 count=4194304

# 设置正确的权限（只有 root 可以读写）
sudo chmod 600 /swapfile

# 格式化为 swap 文件系统
sudo mkswap /swapfile
```

#### 步骤 3: 启用 Swap 文件

```bash
# 启用 swap 文件
sudo swapon /swapfile

# 验证 swap 已启用
swapon --show
free -h
```

#### 步骤 4: 永久启用 Swap（重启后仍然有效）

```bash
# 编辑 /etc/fstab 文件
sudo nano /etc/fstab

# 在文件末尾添加以下行：
/swapfile none swap sw 0 0
```

#### 步骤 5: 优化 Swap 使用（可选）

```bash
# 调整 swappiness（控制系统使用 swap 的倾向）
# 默认值通常是 60，推荐设置为 10-20（更倾向于使用物理内存）
sudo sysctl vm.swappiness=10

# 永久设置（添加到 /etc/sysctl.conf）
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf

# 调整 cache pressure（控制系统回收缓存内存的倾向）
sudo sysctl vm.vfs_cache_pressure=50
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
```

---

### 方案 2: 创建 Swap 分区（如果使用独立分区）

如果你有未使用的磁盘分区，可以创建 swap 分区。

#### 步骤 1: 创建 Swap 分区

```bash
# 使用 fdisk 或 parted 创建新分区
sudo fdisk /dev/sdX  # 替换 X 为你的磁盘

# 在分区中创建 swap 文件系统
sudo mkswap /dev/sdXY  # 替换 XY 为你的分区

# 启用 swap 分区
sudo swapon /dev/sdXY
```

#### 步骤 2: 永久启用

```bash
# 编辑 /etc/fstab
sudo nano /etc/fstab

# 添加：
/dev/sdXY none swap sw 0 0
```

---

## 📊 验证修复

### 验证步骤

1. **检查 Swap 状态**
   ```bash
   free -h
   swapon --show
   ```

2. **在 Jenkins 中验证**
   - 访问 Jenkins → 系统管理 → 节点列表
   - 检查 master 节点的"剩余交换空间"
   - 应该显示可用空间（不再是 0 B）
   - 红色警告应该消失

3. **测试系统稳定性**
   - 运行一个大型构建任务
   - 监控内存使用情况
   - 确认系统不会因内存不足而崩溃

---

## ⚠️ 注意事项

### 1. Swap 文件大小建议

| 物理内存 | 推荐 Swap 大小 |
|---------|--------------|
| 1-2 GB | 2-4 GB |
| 2-4 GB | 4-8 GB |
| 4-8 GB | 8-16 GB |
| 8 GB+ | 与物理内存相同或更大 |

### 2. 磁盘空间

- 确保有足够的磁盘空间创建 swap 文件
- Swap 文件会占用磁盘空间，但不会自动增长

### 3. 性能影响

- Swap 使用磁盘 I/O，比物理内存慢
- 如果频繁使用 swap，说明物理内存不足，应该考虑增加物理内存

### 4. 容器环境

如果 Jenkins 运行在 Docker 容器中：
- Swap 配置需要在**宿主机**上进行
- 容器内的 swap 限制由宿主机决定
- 确保宿主机有足够的 swap 空间

---

## 🔄 后续优化

### 1. 监控 Swap 使用

```bash
# 定期检查 swap 使用情况
watch -n 1 free -h

# 检查哪些进程在使用 swap
sudo swapon --summary
```

### 2. 调整 Jenkins 内存配置

如果经常使用 swap，考虑：
- 增加 Jenkins 容器的内存限制
- 优化构建任务，减少内存使用
- 增加物理内存（如果可能）

### 3. 系统资源监控

设置监控告警：
- Swap 使用率超过 50% 时告警
- 内存使用率超过 80% 时告警
- 磁盘空间不足时告警

---

## 📋 快速检查清单

- [ ] 检查当前 swap 状态：`free -h`
- [ ] 创建 swap 文件（推荐 4GB 或更大）
- [ ] 设置正确的权限：`chmod 600 /swapfile`
- [ ] 格式化为 swap：`mkswap /swapfile`
- [ ] 启用 swap：`swapon /swapfile`
- [ ] 添加到 /etc/fstab 永久启用
- [ ] 优化 swappiness 设置
- [ ] 在 Jenkins 中验证修复
- [ ] 测试构建任务稳定性

---

## 🎯 总结

**问题**: Jenkins master 节点没有交换空间（0 B）

**影响**: 
- ⚠️ 内存不足时系统可能崩溃
- ⚠️ 构建任务可能因内存不足而失败
- ⚠️ 系统性能可能下降

**解决方案**: 
- ✅ 创建 swap 文件（推荐 4GB 或更大）
- ✅ 永久启用 swap
- ✅ 优化 swappiness 设置

**优先级**: 🔴 **高优先级** - 建议立即修复

---

## 🔄 Jenkins 容器环境特殊说明

### 问题：Jenkins 在容器中运行

如果 Jenkins 运行在 Docker 容器中，即使宿主机已配置 swap，Jenkins 界面可能仍显示 0 B。

### 原因

1. **监控缓存**: Jenkins 的监控插件可能缓存了旧的监控数据
2. **更新延迟**: 监控数据更新有延迟（通常 1-5 分钟）
3. **容器配置**: 容器默认可以看到宿主机的 swap，但监控插件可能需要刷新

### 解决方案

#### 方案 1: 手动刷新节点列表（最简单）

1. 访问 Jenkins: http://115.190.54.220:14808
2. 进入：**系统管理** → **节点列表**
3. 点击页面上的 **刷新按钮**（通常在右上角）
4. 等待 1-2 分钟让监控数据更新
5. 重新检查 master 节点的"剩余交换空间"

#### 方案 2: 重启 Jenkins 容器（已执行）

```bash
# 重启 Jenkins 容器
docker restart jenkins_hwfa-jenkins_hWFA-1

# 等待 30-60 秒让 Jenkins 完全启动
# 然后刷新节点列表页面
```

#### 方案 3: 配置监控插件

1. 访问 Jenkins: http://115.190.54.220:14808
2. 进入：**系统管理** → **节点列表**
3. 点击 **"Configure Monitors"** 按钮
4. 检查并保存配置（这会强制刷新监控数据）
5. 返回节点列表，检查 swap 空间

#### 方案 4: 验证容器内 swap（已确认）

```bash
# 在容器内检查 swap
docker exec jenkins_hwfa-jenkins_hWFA-1 free -h

# 应该显示：
# Swap:          4.0Gi          0B       4.0Gi
```

**当前状态**：
- ✅ 宿主机 swap: 4.0 GiB（已配置）
- ✅ 容器内可见 swap: 4.0 GiB（已确认）
- ⏳ Jenkins 界面显示: 等待刷新（可能需要 1-5 分钟）

### 如果仍然显示 0 B

如果等待 5 分钟后仍然显示 0 B，可能的原因：

1. **监控插件问题**: 检查是否安装了系统监控插件
2. **权限问题**: 容器可能无法读取 `/proc/meminfo`
3. **插件配置**: 监控插件可能需要特殊配置

**检查命令**：
```bash
# 检查容器内 swap 信息
docker exec jenkins_hwfa-jenkins_hWFA-1 cat /proc/meminfo | grep -i swap

# 应该看到：
# SwapTotal:       4194300 kB
# SwapFree:        4194300 kB
```

如果 `/proc/meminfo` 中显示有 swap，但 Jenkins 界面仍显示 0，这是监控插件的显示问题，**不影响实际功能**。系统在内存不足时会自动使用 swap。

---

**最后更新**: 2026-01-20
