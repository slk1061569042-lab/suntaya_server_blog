# Next.js 部署模式说明

**时间**: 2026-01-20  
**目的**: 解释静态页面部署 vs 服务端渲染部署的区别

## 📊 两种部署模式对比

### 模式 1: 静态页面部署（Static Export）

**配置**：
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',  // 静态导出
};
```

**特点**：
- ✅ **简单**：生成纯 HTML/CSS/JS 文件
- ✅ **快速**：不需要 Node.js 服务器
- ✅ **便宜**：可以部署到任何静态托管（Nginx、CDN、GitHub Pages）
- ❌ **限制**：不支持服务端功能（API Routes、服务端渲染、动态路由等）

**构建输出**：
```
out/
├── index.html
├── docs/
│   └── [slug]/
│       └── page.html
├── _next/
│   └── static/
└── ...
```

**部署方式**：
- 直接复制 `out/` 目录到 Nginx 的网站根目录
- 不需要 Node.js、PM2、server.js
- 就像部署一个普通的 HTML 网站

---

### 模式 2: 服务端渲染部署（Standalone）

**配置**：
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',  // 独立服务器模式
};
```

**特点**：
- ✅ **功能完整**：支持所有 Next.js 功能（SSR、API Routes、动态路由等）
- ✅ **性能好**：服务端渲染，SEO 友好
- ❌ **复杂**：需要 Node.js 服务器运行
- ❌ **成本高**：需要服务器资源

**构建输出**：
```
.next/
├── standalone/          # 独立服务器文件
│   ├── server.js       # Next.js 服务器入口
│   ├── node_modules/   # 最小化依赖
│   └── ...
├── static/             # 静态资源
├── routes-manifest.json # 路由清单（必需）
├── BUILD_ID            # 构建 ID
└── ...
```

**部署方式**：
- 需要 Node.js 运行 `server.js`
- 使用 PM2 管理进程
- 需要完整的 `.next` 目录结构

---

## 🔍 为什么需要这些文件？

### 当前配置（Standalone 模式）

你的项目当前使用的是 **Standalone 模式**，所以需要这些文件：

#### 1. `server.js`（必需）
- **位置**：部署目录根目录
- **作用**：Next.js 服务器入口，处理所有请求
- **来源**：`.next/standalone/server.js`

#### 2. `.next/routes-manifest.json`（必需）
- **位置**：`.next/routes-manifest.json`
- **作用**：告诉 Next.js 有哪些路由，如何处理动态路由
- **问题**：之前缺少这个文件，导致 502 错误

#### 3. `.next/static/`（必需）
- **位置**：`.next/static/`
- **作用**：CSS、JS、图片等静态资源
- **访问**：通过 `/_next/static/...` URL 访问

#### 4. `.next/BUILD_ID`（必需）
- **位置**：`.next/BUILD_ID`
- **作用**：标识当前构建版本，用于缓存控制

#### 5. `node_modules/`（必需）
- **位置**：部署目录根目录
- **作用**：运行 Next.js 所需的依赖包（最小化版本）
- **来源**：`.next/standalone/node_modules/`

---

## 🤔 你应该用哪种模式？

### 检查你的项目需求

#### 如果你的项目：

1. **只有静态页面**（如文档网站、博客）
   - ✅ 使用 `output: 'export'`（静态导出）
   - ✅ 部署到 Nginx，不需要 Node.js

2. **有动态功能**（如搜索、API、服务端渲染）
   - ✅ 使用 `output: 'standalone'`（当前模式）
   - ✅ 需要 Node.js + PM2

### 检查你的代码

让我看看你的项目是否有服务端功能：

```typescript
// app/docs/[slug]/page.tsx
export default async function DocPage({ params }) {
  // async 函数 = 服务端渲染
  // 需要 Standalone 模式
}
```

**结论**：你的项目使用了**服务端功能**（`async` 函数、动态路由），所以**必须使用 Standalone 模式**。

**你的代码示例**：
```typescript
// app/docs/[slug]/page.tsx
export default async function DocPage({ params }) {
  // async 函数 = 服务端渲染
  // 需要 Standalone 模式才能运行
  const result = await processMarkdown(filePath);
  return <div>{result.html}</div>;
}
```

---

## 🔄 如果想改用静态页面模式

### 步骤 1: 修改配置

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',  // 改为静态导出
};
```

### 步骤 2: 修改代码

**问题**：你的页面使用了 `async` 函数，静态导出不支持。

**需要修改**：
```typescript
// 修改前（服务端渲染）
export default async function DocPage({ params }) {
  const content = await processMarkdown(...);
  return <div>{content}</div>;
}

// 修改后（静态生成）
export default function DocPage({ params }) {
  // 需要在构建时生成所有页面
  // 或者使用客户端获取数据
}
```

### 步骤 3: 修改 Jenkinsfile

```groovy
stage('Package for deployment') {
    steps {
        sh '''
          # 静态导出输出到 out/ 目录
          mkdir -p deploy-package
          cp -r out/* deploy-package/
        '''
    }
}
```

### 步骤 4: 修改部署脚本

```bash
# 不需要 PM2，直接复制到 Nginx 目录
cp -r deploy-package/* /www/wwwroot/next.sunyas.com/
# Nginx 会自动提供静态文件
```

---

## 📋 当前配置总结

### 你当前的配置（Standalone 模式）

**为什么需要这些文件**：

1. **`server.js`** → 运行 Next.js 服务器
2. **`.next/routes-manifest.json`** → 路由配置（之前缺少，导致 502）
3. **`.next/static/`** → 静态资源
4. **`.next/BUILD_ID`** → 构建版本
5. **`node_modules/`** → 运行依赖

**部署流程**：
```
构建 → 打包 → 上传 → PM2 启动 server.js → 监听 3000 端口 → Nginx 反向代理
```

---

## 🎯 推荐方案

### 对于你的项目（文档网站）

**建议**：**继续使用 Standalone 模式**

**原因**：
1. ✅ 你的代码已经使用了服务端渲染（`async` 函数）
2. ✅ 支持动态路由（`[slug]`）
3. ✅ 更好的 SEO（服务端渲染）
4. ✅ 已经配置好了，只需要修复打包问题

**如果改用静态模式**：
- ❌ 需要大量代码修改
- ❌ 失去动态路由的优势
- ❌ 需要重新配置 Jenkinsfile

---

## 📝 总结

### 静态页面模式（`output: 'export'`）
- **适合**：纯静态网站
- **部署**：复制文件到 Nginx
- **不需要**：Node.js、PM2、server.js

### 服务端渲染模式（`output: 'standalone'`）
- **适合**：有动态功能的网站（你的项目）
- **部署**：需要 Node.js + PM2 运行 server.js
- **需要**：完整的 `.next` 目录结构

**你的项目应该继续使用 Standalone 模式**，因为：
- 已经使用了服务端渲染
- 支持动态路由
- 只需要修复打包逻辑（已修复）

---

**最后更新**: 2026-01-20
