# Jenkinsfile Groovy 语法错误验证步骤

**时间**: 2026-01-20  
**问题**: `illegal string body character after dollar sign` 错误

## 🔍 问题分析

错误信息：
```
WorkflowScript: 190: illegal string body character after dollar sign;
   solution: either escape a literal dollar sign "\$5" or bracket the value expression "${5}" @ line 190, column 82.
   : """set -e && cd '${deployDir}' && echo
                                 ^
```

**核心问题**：Groovy 在三引号字符串 `"""` 中遇到 `$` 符号，但无法识别为有效的变量表达式。

---

## 📋 验证步骤

### 步骤 1: 检查第 190 行的完整内容

**目的**：查看完整的 execCommand 字符串，找出所有 `$` 符号

**方法**：
1. 打开 `Jenkinsfile`
2. 找到第 190 行
3. 查看完整的 `execCommand` 字符串（可能跨多行）

**检查点**：
- [ ] 找到所有 `$` 符号的位置
- [ ] 确认哪些是 Groovy 变量（如 `${deployDir}`, `${appPort}`）
- [ ] 确认哪些是 Shell 变量（如 `$!`, `$?`, `$PATH` 等）

---

### 步骤 2: 识别变量类型

**目的**：区分 Groovy 变量和 Shell 变量

#### 2.1 Groovy 变量（需要在 Jenkins 端解析）

**特征**：
- 使用 `${变量名}` 格式
- 在 `script` 块中定义（如 `def deployDir = env.DEPLOY_DIR`）
- 需要在 Jenkins Pipeline 解析时替换为实际值

**你的代码中的 Groovy 变量**：
```groovy
def deployDir = env.DEPLOY_DIR  // 第 169 行
def appPort = env.APP_PORT      // 第 170 行

// 在 execCommand 中使用：
execCommand: """...${deployDir}...${appPort}..."""
```

**验证方法**：
```groovy
// 在 script 块中测试
script {
    def deployDir = env.DEPLOY_DIR
    def appPort = env.APP_PORT
    echo "deployDir = ${deployDir}"
    echo "appPort = ${appPort}"
}
```

**预期结果**：
- `deployDir = /www/wwwroot/next.sunyas.com`
- `appPort = 3000`

---

#### 2.2 Shell 变量（需要在远程服务器端解析）

**特征**：
- 使用 `$变量名` 或 `${变量名}` 格式
- 在 Shell 脚本中使用（如 `$!`, `$?`, `$PATH`）
- 需要在远程服务器执行时解析，**不应该**在 Jenkins 端解析

**常见的 Shell 变量**：
- `$!` - 上一个后台进程的 PID
- `$?` - 上一个命令的退出状态
- `$PATH` - 环境变量
- `$$` - 当前 Shell 进程的 PID

**你的代码中可能的 Shell 变量**：
```bash
# 在 execCommand 中
echo \\$! > app.pid  # $! 是 Shell 变量，需要转义
```

**验证方法**：
检查 execCommand 字符串中是否有：
- `$!` - 需要转义为 `\\$!` 或 `\$!`
- `$?` - 需要转义为 `\\$?` 或 `\$?`
- 其他 `$` 开头的 Shell 变量

---

### 步骤 3: 检查字符串中的特殊字符

**目的**：找出导致 Groovy 解析错误的 `$` 符号

**方法**：
1. 复制第 190 行的完整内容
2. 搜索所有 `$` 符号
3. 检查每个 `$` 符号后面的字符

**检查清单**：

#### 情况 A: `$` 后面跟数字（如 `$5`）

**示例**：
```groovy
execCommand: """...echo $5..."""
```

**问题**：Groovy 认为 `$5` 是变量表达式，但 `5` 不是有效的变量名

**验证**：
- [ ] 搜索 `$` 后面跟数字的情况
- [ ] 确认这是 Shell 变量还是误写

---

#### 情况 B: `$` 后面跟特殊字符（如 `$!`, `$?`）

**示例**：
```groovy
execCommand: """...echo \\$! > app.pid..."""
```

**问题**：如果转义不正确，Groovy 可能仍然尝试解析

**验证**：
- [ ] 检查 `$!` 的转义是否正确
- [ ] 检查是否有其他 `$` + 特殊字符的组合

---

#### 情况 C: `$` 后面跟空格或换行

**示例**：
```groovy
execCommand: """...echo $ ..."""
```

**问题**：`$` 后面没有有效字符，Groovy 无法解析

**验证**：
- [ ] 检查是否有孤立的 `$` 符号
- [ ] 检查 `$` 后面是否跟空格

---

#### 情况 D: 字符串中包含 `$` 但意图是字面量

**示例**：
```groovy
execCommand: """...echo 'Price: $5'..."""
```

**问题**：如果 `$5` 在单引号内，应该是字面量，但 Groovy 仍然会尝试解析

**验证**：
- [ ] 检查字符串中是否有需要作为字面量的 `$` 符号
- [ ] 确认是否需要转义

---

### 步骤 4: 验证环境变量是否正确设置

**目的**：确认 `DEPLOY_DIR` 和 `APP_PORT` 环境变量已正确定义

**方法**：

#### 4.1 检查 environment 块

```groovy
environment {
    DEPLOY_DIR  = '/www/wwwroot/next.sunyas.com'
    APP_PORT    = '3000'
}
```

**验证**：
- [ ] `DEPLOY_DIR` 是否在 `environment` 块中定义
- [ ] `APP_PORT` 是否在 `environment` 块中定义
- [ ] 值是否正确（字符串格式）

---

#### 4.2 检查 script 块中的变量获取

```groovy
script {
    def deployDir = env.DEPLOY_DIR
    def appPort = env.APP_PORT
    // ...
}
```

**验证**：
- [ ] `env.DEPLOY_DIR` 是否正确获取
- [ ] `env.APP_PORT` 是否正确获取
- [ ] 变量名是否一致（`deployDir` vs `DEPLOY_DIR`）

---

#### 4.3 测试环境变量值

**临时测试代码**（可以添加到 Jenkinsfile 中测试）：

```groovy
stage('Test Environment Variables') {
    steps {
        script {
            echo "DEPLOY_DIR = ${env.DEPLOY_DIR}"
            echo "APP_PORT = ${env.APP_PORT}"
            
            def deployDir = env.DEPLOY_DIR
            def appPort = env.APP_PORT
            
            echo "deployDir = ${deployDir}"
            echo "appPort = ${appPort}"
        }
    }
}
```

**预期结果**：
```
DEPLOY_DIR = /www/wwwroot/next.sunyas.com
APP_PORT = 3000
deployDir = /www/wwwroot/next.sunyas.com
appPort = 3000
```

---

### 步骤 5: 检查 execCommand 字符串的完整性

**目的**：确认 execCommand 字符串没有语法错误

**方法**：

#### 5.1 查看完整的 execCommand

第 190 行的 execCommand 可能很长，需要查看完整内容。

**检查点**：
- [ ] 字符串是否以 `"""` 开始
- [ ] 字符串是否以 `"""` 结束
- [ ] 中间是否有未转义的引号
- [ ] 是否有未闭合的括号

---

#### 5.2 检查字符串中的引号

**问题**：如果字符串中有引号，可能导致解析错误

**检查**：
- [ ] 单引号 `'` 是否正确使用
- [ ] 双引号 `"` 是否正确转义
- [ ] 反引号 `` ` `` 是否正确使用

---

#### 5.3 检查转义字符

**问题**：转义字符使用不正确可能导致解析错误

**检查**：
- [ ] `\\$` - 双反斜杠转义 `$`
- [ ] `\$` - 单反斜杠转义 `$`
- [ ] `$$` - 转义为字面量 `$`

**Groovy 转义规则**：
- 在三引号字符串 `"""` 中，`$` 会被解析为变量插值
- 要输出字面量 `$`，需要使用 `\$` 或 `\\$`
- 在 Shell 中，`$!` 需要转义为 `\$!` 或 `\\$!`

---

## 🎯 验证结果判断

### 情况 1: 环境变量未定义

**症状**：
- `env.DEPLOY_DIR` 返回 `null`
- `env.APP_PORT` 返回 `null`

**解决方法**：
- 检查 `environment` 块中的定义
- 确认变量名拼写正确

---

### 情况 2: Shell 变量未正确转义

**症状**：
- 错误指向 `$!` 或 `$?` 等 Shell 变量
- Groovy 尝试解析这些变量但失败

**解决方法**：
- 将 `$!` 转义为 `\\$!` 或 `\$!`
- 确保 Shell 变量不会被 Groovy 解析

---

### 情况 3: 字符串中有孤立的 `$` 符号

**症状**：
- `$` 后面跟空格、换行或无效字符
- Groovy 无法识别为变量表达式

**解决方法**：
- 转义孤立的 `$` 符号：`\$`
- 或者使用单引号字符串（但会失去变量插值功能）

---

### 情况 4: 字符串格式错误

**症状**：
- 引号不匹配
- 括号不匹配
- 转义字符使用错误

**解决方法**：
- 检查字符串的完整性
- 修复引号和括号
- 正确使用转义字符

---

## 📋 快速验证清单

按照以下顺序验证：

1. **环境变量验证**
   - [ ] `DEPLOY_DIR` 在 `environment` 块中定义
   - [ ] `APP_PORT` 在 `environment` 块中定义
   - [ ] `env.DEPLOY_DIR` 可以正确获取值
   - [ ] `env.APP_PORT` 可以正确获取值

2. **变量使用验证**
   - [ ] `deployDir` 变量在 `script` 块中定义
   - [ ] `appPort` 变量在 `script` 块中定义
   - [ ] `${deployDir}` 在 execCommand 中使用
   - [ ] `${appPort}` 在 execCommand 中使用

3. **Shell 变量转义验证**
   - [ ] 检查 execCommand 中是否有 `$!`
   - [ ] 检查 execCommand 中是否有 `$?`
   - [ ] 检查所有 Shell 变量是否正确转义

4. **字符串完整性验证**
   - [ ] execCommand 字符串以 `"""` 开始和结束
   - [ ] 没有未转义的引号
   - [ ] 没有孤立的 `$` 符号

---

## 🔧 下一步

完成验证后，根据验证结果：
1. **如果是环境变量问题** → 修复环境变量定义
2. **如果是 Shell 变量转义问题** → 修复转义字符
3. **如果是字符串格式问题** → 修复字符串格式
4. **如果是其他问题** → 根据具体情况修复

---

**最后更新**: 2026-01-20
