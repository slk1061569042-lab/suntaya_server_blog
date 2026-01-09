# UI/UX Pro Max 使用指南

## 📖 如何使用

### 基本使用流程

当您需要设计 UI/UX 时，在 Cursor 中直接描述需求，AI 会自动使用 UI/UX Pro Max 来搜索相关设计规范。

**示例：**
- "按照 UI/UX Pro Max 规范，设计一个 SaaS 产品的登录页面"
- "创建一个现代化的仪表板，使用玻璃态风格"
- "设计一个医疗应用的首页，要求专业且友好"

### 手动搜索（高级用法）

如果需要手动搜索特定风格，可以使用 Python 脚本：

```bash
# 搜索风格
python .shared/ui-ux-pro-max/scripts/search.py "glassmorphism modern" --domain style

# 搜索颜色方案
python .shared/ui-ux-pro-max/scripts/search.py "saas" --domain color

# 搜索产品类型推荐
python .shared/ui-ux-pro-max/scripts/search.py "landing page" --domain product

# 搜索技术栈指南（Next.js）
python .shared/ui-ux-pro-max/scripts/search.py "routing" --stack nextjs
```

---

## 🎨 可用的风格类型

### 1. **Minimalism & Swiss Style** (极简主义)
- **特点**: 简洁、大量留白、高对比度、几何图形
- **颜色**: 黑白 + 单一强调色
- **适合**: 企业应用、仪表板、文档站点、SaaS 平台
- **性能**: ⚡ 优秀
- **复杂度**: 低

### 2. **Glassmorphism** (玻璃态)
- **特点**: 毛玻璃效果、透明、模糊背景、多层深度
- **颜色**: 半透明白色 + 鲜艳背景色
- **适合**: 现代 SaaS、金融仪表板、高端企业应用
- **性能**: ⚠ 良好
- **复杂度**: 中等

### 3. **Flat Design** (扁平设计)
- **特点**: 2D、无阴影、大胆颜色、简洁线条
- **颜色**: 明亮纯色（4-6种）
- **适合**: Web 应用、移动应用、SaaS、仪表板
- **性能**: ⚡ 优秀
- **复杂度**: 低

### 4. **Neumorphism** (新拟态)
- **特点**: 软 UI、浮雕效果、柔和深度、圆角
- **颜色**: 柔和粉彩
- **适合**: 健康/健身应用、冥想平台
- **性能**: ⚡ 良好
- **复杂度**: 中等

### 5. **Brutalism** (粗野主义)
- **特点**: 原始、高对比、纯文本、可见边框、不对称
- **颜色**: 红、蓝、黄、黑、白
- **适合**: 设计作品集、艺术项目、科技博客
- **性能**: ⚡ 优秀
- **复杂度**: 低

### 6. **Dark Mode (OLED)** (深色模式)
- **特点**: 深黑背景、高对比、护眼、省电
- **颜色**: 深黑 + 霓虹强调色
- **适合**: 夜间应用、编码平台、娱乐应用
- **性能**: ⚡ 优秀
- **复杂度**: 低

### 7. **Hero-Centric Design** (英雄区设计)
- **特点**: 大英雄区、醒目标题、高对比 CTA、产品展示
- **颜色**: 品牌主色 + 白色背景
- **适合**: SaaS 落地页、产品发布、服务落地页
- **性能**: ⚡ 良好
- **复杂度**: 中等

### 8. **Bento Box Grid** (便当盒网格)
- **特点**: 模块化卡片、不对称网格、Apple 风格、负空间
- **颜色**: 中性基础色 + 品牌强调色
- **适合**: 仪表板、产品页面、作品集、功能展示
- **性能**: ⚡ 优秀
- **复杂度**: 低

### 9. **Neubrutalism** (新粗野主义)
- **特点**: 粗边框、黑色轮廓、主色、厚阴影、无渐变
- **颜色**: 黄色、红色、蓝色、黑色
- **适合**: Gen Z 品牌、初创公司、创意机构、科技博客
- **性能**: ⚡ 优秀
- **复杂度**: 低

### 10. **Soft UI Evolution** (软 UI 进化)
- **特点**: 改进的软 UI、更好的对比度、现代美学、可访问性
- **颜色**: 改进对比度的柔和粉彩
- **适合**: 现代企业应用、SaaS 平台、健康/健身应用
- **性能**: ⚡ 优秀
- **复杂度**: 中等

### 其他风格
- **3D & Hyperrealism** (3D 超写实)
- **Vibrant & Block-based** (活力块状)
- **Claymorphism** (粘土态)
- **Aurora UI** (极光 UI)
- **Retro-Futurism** (复古未来)
- **Motion-Driven** (动效驱动)
- **Micro-interactions** (微交互)
- **AI-Native UI** (AI 原生 UI)
- **Spatial UI (VisionOS)** (空间 UI)
- 等等...共 58 种风格

---

## 🌐 如何做成和官网一样的风格

根据 UI/UX Pro Max 官网 (https://ui-ux-pro-max-skill.nextlevelbuilder.io) 的特点，推荐使用以下风格组合：

### 推荐风格：**Glassmorphism + Flat Design + Hero-Centric**

### 具体配置：

#### 1. **风格选择**
- **主风格**: Glassmorphism (玻璃态)
- **辅助风格**: Flat Design (扁平设计)
- **落地页模式**: Hero-Centric Design (英雄区设计)

#### 2. **颜色方案** (SaaS 通用)
```
主色 (Primary): #2563EB (信任蓝)
次色 (Secondary): #3B82F6 (亮蓝)
CTA 按钮: #F97316 (活力橙)
背景: #F8FAFC (浅灰白)
文本: #1E293B (深灰蓝)
边框: #E2E8F0 (浅灰)
```

#### 3. **设计要点**
- ✅ 使用毛玻璃效果 (`backdrop-blur`)
- ✅ 半透明卡片 (`bg-white/80` 或 `bg-white/10`)
- ✅ 大英雄区展示核心价值
- ✅ 清晰的 CTA 按钮
- ✅ 平滑的过渡动画 (200-300ms)
- ✅ 响应式设计（移动优先）

#### 4. **在 Cursor 中使用**

直接告诉 AI：
```
"按照 UI/UX Pro Max 官网风格，使用 Glassmorphism + Flat Design，创建一个现代化的 SaaS 产品落地页。使用信任蓝色 (#2563EB) 作为主色，橙色 (#F97316) 作为 CTA 按钮颜色。"
```

或者：
```
"创建一个和 UI/UX Pro Max 官网一样风格的页面，使用玻璃态效果、大英雄区、现代简洁的设计。"
```

---

## 📋 完整工作流程示例

### 场景：创建一个 SaaS 产品落地页

**步骤 1**: AI 会自动搜索产品类型
```bash
python .shared/ui-ux-pro-max/scripts/search.py "saas landing page" --domain product
```

**步骤 2**: 搜索推荐风格
```bash
python .shared/ui-ux-pro-max/scripts/search.py "glassmorphism modern" --domain style
```

**步骤 3**: 搜索颜色方案
```bash
python .shared/ui-ux-pro-max/scripts/search.py "saas" --domain color
```

**步骤 4**: 搜索排版
```bash
python .shared/ui-ux-pro-max/scripts/search.py "modern professional" --domain typography
```

**步骤 5**: 搜索落地页结构
```bash
python .shared/ui-ux-pro-max/scripts/search.py "hero-centric" --domain landing
```

**步骤 6**: 搜索技术栈指南
```bash
python .shared/ui-ux-pro-max/scripts/search.py "routing layout" --stack nextjs
```

**步骤 7**: AI 综合所有信息，生成代码

---

## 🎯 快速参考

### 常用命令

```bash
# 搜索风格
python .shared/ui-ux-pro-max/scripts/search.py "<关键词>" --domain style

# 搜索颜色
python .shared/ui-ux-pro-max/scripts/search.py "<产品类型>" --domain color

# 搜索产品推荐
python .shared/ui-ux-pro-max/scripts/search.py "<产品类型>" --domain product

# 搜索排版
python .shared/ui-ux-pro-max/scripts/search.py "<风格>" --domain typography

# 搜索落地页结构
python .shared/ui-ux-pro-max/scripts/search.py "<模式>" --domain landing

# 搜索技术栈指南
python .shared/ui-ux-pro-max/scripts/search.py "<主题>" --stack nextjs
```

### 可用的 Domain
- `style` - UI 风格
- `color` - 颜色方案
- `product` - 产品类型推荐
- `typography` - 字体配对
- `landing` - 落地页结构
- `chart` - 图表类型
- `ux` - UX 最佳实践
- `prompt` - AI 提示词

### 可用的 Stack
- `html-tailwind` - HTML + Tailwind CSS (默认)
- `react` - React
- `nextjs` - Next.js
- `vue` - Vue.js
- `svelte` - Svelte
- `swiftui` - SwiftUI
- `react-native` - React Native
- `flutter` - Flutter

---

## 💡 提示

1. **直接描述需求** - 在 Cursor 中直接说"按照 UI/UX Pro Max 规范设计..."，AI 会自动使用
2. **具体描述风格** - 越具体越好，例如"玻璃态 + 现代简约"
3. **指定产品类型** - 说明是 SaaS、电商、作品集等
4. **技术栈** - 如果使用 Next.js，AI 会自动应用 Next.js 最佳实践

---

## 🚀 开始使用

现在您可以直接在 Cursor 中说：

**"按照 UI/UX Pro Max 官网风格，创建一个现代化的 SaaS 产品落地页"**

AI 会自动搜索相关规范并生成代码！
