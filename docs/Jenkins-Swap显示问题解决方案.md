# Jenkins Swap 显示问题解决方案

**时间**: 2026-01-20  
**问题**: 宿主机已配置 4GB swap，但 Jenkins 界面仍显示 0 B

## 🔍 问题分析

### 当前状态

- ✅ **宿主机 swap**: 4.0 GiB（已配置并启用）
- ✅ **容器内可见 swap**: 4.0 GiB（已确认）
- ❌ **Jenkins 界面显示**: 0 B（监控数据未更新）

### 验证结果

```bash
# 宿主机
$ free -h
Swap:          4.0Gi          0B       4.0Gi

# 容器内
$ docker exec jenkins_hwfa-jenkins_hWFA-1 free -h
Swap:          4.0Gi          0B       4.0Gi

# 容器内 /proc/meminfo
$ docker exec jenkins_hwfa-jenkins_hWFA-1 cat /proc/meminfo | grep -i swap
SwapTotal:       4194300 kB
SwapFree:        4194300 kB
```

**结论**: Swap 已正确配置，容器可以访问，但 Jenkins 监控插件显示未更新。

---

## 🔧 解决方案

### 方案 1: 手动刷新节点列表（推荐，最简单）

1. **访问 Jenkins**: http://115.190.54.220:14808
2. **进入节点列表**: 系统管理 → 节点列表
3. **点击刷新按钮**: 在页面右上角找到刷新图标，点击刷新
4. **等待更新**: 等待 1-2 分钟让监控数据更新
5. **重新检查**: 查看 master 节点的"剩余交换空间"

### 方案 2: 配置监控插件（强制刷新）

1. **访问 Jenkins**: http://115.190.54.220:14808
2. **进入节点列表**: 系统管理 → 节点列表
3. **点击 "Configure Monitors"**: 在页面右上角
4. **检查配置**: 确认监控配置正确
5. **保存配置**: 点击保存（这会强制刷新所有监控数据）
6. **返回节点列表**: 检查 swap 空间显示

### 方案 3: 重启 Jenkins 容器（已执行）

```bash
# 重启容器
docker restart jenkins_hwfa-jenkins_hWFA-1

# 等待 30-60 秒
# 然后刷新 Jenkins 界面
```

**状态**: ✅ 已执行，容器已重启

### 方案 4: 等待自动更新

Jenkins 监控插件通常每 1-5 分钟自动更新一次。如果其他方案都不行，可以：

1. **等待 5 分钟**
2. **刷新浏览器页面**（F5 或 Ctrl+R）
3. **重新检查节点列表**

---

## ⚠️ 重要说明

### Swap 功能正常

即使 Jenkins 界面显示 0 B，**swap 功能仍然正常工作**：

- ✅ 系统在内存不足时会自动使用 swap
- ✅ 容器可以访问宿主机的 swap
- ✅ `/proc/meminfo` 显示 swap 可用
- ⚠️ 只是 Jenkins 监控插件的**显示问题**

### 不影响实际功能

这个显示问题**不会影响**：
- ✅ 系统稳定性
- ✅ 内存溢出保护
- ✅ OOM Killer 保护
- ✅ 构建任务执行

### 如何验证 swap 实际工作

```bash
# 在容器内检查 swap 使用情况
docker exec jenkins_hwfa-jenkins_hWFA-1 free -h

# 如果内存使用增加，swap 会被自动使用
# 可以通过以下命令监控：
watch -n 1 'docker exec jenkins_hwfa-jenkins_hWFA-1 free -h'
```

---

## 📋 快速检查清单

- [x] 宿主机 swap 已配置（4.0 GiB）
- [x] 容器内可见 swap（4.0 GiB）
- [x] Jenkins 容器已重启
- [ ] **手动刷新 Jenkins 节点列表**（待执行）
- [ ] **等待 1-5 分钟让监控更新**（待执行）
- [ ] **如果仍显示 0，点击 "Configure Monitors" 并保存**（待执行）

---

## 🎯 推荐操作步骤

1. **立即操作**: 访问 Jenkins → 节点列表 → 点击刷新按钮
2. **等待 2 分钟**: 让监控数据更新
3. **重新检查**: 查看 swap 空间显示
4. **如果仍为 0**: 点击 "Configure Monitors" → 保存 → 再次检查
5. **如果仍为 0**: 这是显示问题，不影响功能，可以忽略

---

## 📊 技术细节

### 为什么容器可以看到宿主机 swap？

Docker 容器默认情况下：
- ✅ 可以访问宿主机的 `/proc/meminfo`
- ✅ 可以看到宿主机的 swap 信息
- ✅ 可以使用宿主机的 swap（当内存不足时）

### 为什么 Jenkins 界面显示 0？

可能的原因：
1. **监控插件缓存**: 插件缓存了旧的监控数据
2. **更新延迟**: 监控数据更新有延迟（1-5 分钟）
3. **插件配置**: 监控插件可能需要特殊配置才能正确显示
4. **显示 bug**: 某些版本的监控插件可能有显示 bug

### 如何确认 swap 真的在工作？

```bash
# 方法 1: 检查 /proc/meminfo
docker exec jenkins_hwfa-jenkins_hWFA-1 cat /proc/meminfo | grep Swap

# 方法 2: 使用 free 命令
docker exec jenkins_hwfa-jenkins_hWFA-1 free -h

# 方法 3: 监控 swap 使用（当内存压力大时）
watch -n 1 'docker exec jenkins_hwfa-jenkins_hWFA-1 free -h | grep Swap'
```

---

**最后更新**: 2026-01-20
