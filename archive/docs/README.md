# 远程 Docker 控制工具

这个工具集允许您通过 SSH 连接到云服务器并控制服务器上的 Docker 容器。

## 功能特性

- ✅ 通过 SSH 安全连接到远程服务器
- ✅ 执行所有常见的 Docker 命令
- ✅ 支持 SSH 密钥和密码认证
- ✅ 支持 SSH 配置文件
- ✅ Python 和 Shell 两种实现方式
- ✅ 简单易用的命令行接口

## 前置要求

1. **本地环境**：
   - Python 3.6+（如果使用 Python 脚本）
   - SSH 客户端
   - 对远程服务器的 SSH 访问权限

2. **远程服务器**：
   - 已安装 Docker
   - SSH 服务运行中
   - 您的用户有执行 Docker 命令的权限（通常需要将用户添加到 docker 组）

## 快速开始

### 1. 配置 SSH 连接

#### 方法一：使用 SSH 配置文件（推荐）

编辑 `~/.ssh/config` 文件（Windows: `C:\Users\YourUsername\.ssh\config`）：

```ssh_config
Host myserver
    HostName your-server-ip-or-domain
    User your-username
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

#### 方法二：使用提供的示例文件

1. 复制 `ssh_config.example` 到 `~/.ssh/config`
2. 修改其中的服务器信息

### 2. 设置 SSH 密钥（推荐）

如果还没有 SSH 密钥，生成一个：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

将公钥复制到服务器：

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub user@your-server-ip
```

### 3. 使用 Python 脚本

#### 基本用法

```bash
# 列出容器
python docker_remote.py -H myserver ps

# 列出所有容器（包括已停止的）
python docker_remote.py -H myserver ps -a

# 查看容器日志
python docker_remote.py -H myserver logs container_name --tail 100

# 启动容器
python docker_remote.py -H myserver start container_name

# 停止容器
python docker_remote.py -H myserver stop container_name

# 重启容器
python docker_remote.py -H myserver restart container_name

# 在容器中执行命令
python docker_remote.py -H myserver exec container_name "ls -la" -it

# 查看容器资源使用情况
python docker_remote.py -H myserver stats container_name

# 拉取镜像
python docker_remote.py -H myserver pull nginx:latest

# 运行新容器
python docker_remote.py -H myserver run nginx:latest --name my-nginx -p 8080:80
```

#### 使用 SSH 配置文件

```bash
python docker_remote.py -H myserver -F ~/.ssh/config ps
```

#### 指定 SSH 密钥

```bash
python docker_remote.py -H your-server-ip -u username -i ~/.ssh/id_rsa ps
```

### 4. 使用 Shell 脚本

```bash
# 给脚本添加执行权限
chmod +x docker_remote.sh

# 列出容器
./docker_remote.sh -H myserver ps

# 查看容器日志
./docker_remote.sh -H myserver logs container_name --tail 100

# 启动容器
./docker_remote.sh -H myserver start container_name
```

## 常用命令示例

### 容器管理

```bash
# 查看运行中的容器
python docker_remote.py -H myserver ps

# 查看所有容器
python docker_remote.py -H myserver ps -a

# 启动容器
python docker_remote.py -H myserver start container_name

# 停止容器
python docker_remote.py -H myserver stop container_name

# 重启容器
python docker_remote.py -H myserver restart container_name

# 删除容器
python docker_remote.py -H myserver rm container_name

# 强制删除容器
python docker_remote.py -H myserver rm container_name -f
```

### 日志和调试

```bash
# 查看最后 100 行日志
python docker_remote.py -H myserver logs container_name --tail 100

# 实时跟踪日志
python docker_remote.py -H myserver logs container_name -f

# 在容器中执行命令
python docker_remote.py -H myserver exec container_name "ls -la" -it

# 查看容器详细信息
python docker_remote.py -H myserver inspect container_name
```

### 镜像管理

```bash
# 列出镜像
python docker_remote.py -H myserver images

# 拉取镜像
python docker_remote.py -H myserver pull nginx:latest

# 删除镜像
python docker_remote.py -H myserver rmi image_name -f
```

### 运行新容器

```bash
# 运行 Nginx 容器
python docker_remote.py -H myserver run nginx:latest \
    --name my-nginx \
    -p 8080:80

# 运行带环境变量的容器
python docker_remote.py -H myserver run mysql:latest \
    --name my-mysql \
    -e MYSQL_ROOT_PASSWORD=password \
    -p 3306:3306

# 运行带卷挂载的容器
python docker_remote.py -H myserver run nginx:latest \
    --name my-nginx \
    -v /host/path:/container/path \
    -p 8080:80
```

### 监控

```bash
# 查看所有容器的资源使用情况
python docker_remote.py -H myserver stats

# 查看特定容器的资源使用情况
python docker_remote.py -H myserver stats container_name
```

## 高级用法

### 在 Python 代码中使用

```python
from docker_remote import RemoteDocker

# 创建连接
docker = RemoteDocker(
    host='myserver',
    ssh_config='~/.ssh/config'
)

# 列出容器
containers = docker.ps(all=True)
print(containers)

# 查看日志
docker.logs('my-container', tail=50, follow=False)

# 启动容器
docker.start('my-container')

# 执行命令
output = docker.exec('my-container', 'ls -la', interactive=False)
print(output)
```

## 故障排除

### SSH 连接问题

1. **连接被拒绝**：
   - 检查服务器 IP 和端口是否正确
   - 确认 SSH 服务正在运行
   - 检查防火墙设置

2. **认证失败**：
   - 确认 SSH 密钥路径正确
   - 检查密钥文件权限（应该是 600）
   - 如果使用密码认证，确保已配置

3. **权限被拒绝**：
   - 确保用户有执行 Docker 命令的权限
   - 将用户添加到 docker 组：`sudo usermod -aG docker $USER`

### Docker 命令问题

1. **找不到容器**：
   - 使用 `ps -a` 查看所有容器
   - 确认容器名称或 ID 正确

2. **命令执行失败**：
   - 检查 Docker 服务是否在远程服务器上运行
   - 确认用户有执行 Docker 命令的权限

## 安全建议

1. **使用 SSH 密钥认证**而不是密码
2. **限制 SSH 访问**：只允许特定 IP 访问
3. **定期更新**SSH 密钥
4. **使用强密码**保护私钥
5. **限制 Docker 权限**：不要使用 root 用户运行 Docker

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

