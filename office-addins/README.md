# Office Add-ins 示例集合

这个目录包含了几个实用的 Office Add-in 示例，展示了如何在 PowerPoint 和 Excel 中创建自定义功能。

## 📁 项目结构

```
office-addins/
├── powerpoint-architecture-generator/  # PPT 技术架构图生成器
│   ├── manifest.xml                   # Add-in 清单文件
│   └── index.html                     # 主界面
├── powerpoint-presentation-generator/ # PPT 演讲稿生成器
│   └── index.html                     # 主界面
├── excel-data-analyzer/               # Excel 数据分析面板
│   └── index.html                     # 主界面
└── README.md                          # 本文件
```

## 🎯 功能演示

### 1. PowerPoint - 技术架构图生成器

**功能特点：**
- ✨ 多种架构模板（微服务、分层、Serverless、自定义）
- 🎨 美观的 UI 界面设计
- 📊 自动生成 ASCII 架构图
- 🔄 一键插入到 PowerPoint 幻灯片

**使用场景：**
- 技术方案演示
- 系统架构说明
- 技术文档制作

**效果预览：**
```
┌─────────────────────────────────────┐
│      电商平台 架构图                │
└─────────────────────────────────────┘

        ┌──────────────┐
        │  API Gateway │
        └──────┬───────┘
               │
    ┌──────────┼──────────┐
    │  用户服务            │
    │  订单服务            │
    └──────────────────────┘
```

### 2. PowerPoint - 技术演讲稿生成器

**功能特点：**
- 📝 根据技术实现描述自动生成完整演讲稿
- 🎯 可自定义演讲时长（5/10/20/30分钟）
- 📊 自动包含架构图、代码示例、演示步骤
- 🚀 一键生成多张幻灯片

**使用场景：**
- 技术分享会准备
- 项目汇报
- 技术方案讲解

**生成内容：**
1. 封面页
2. 目录页
3. 项目背景
4. 技术架构图
5. 核心功能模块（多张）
6. 技术栈介绍
7. 代码示例
8. 系统特点
9. 演示步骤
10. 总结

### 3. Excel - 数据分析面板

**功能特点：**
- 📊 智能数据统计分析
- 📈 实时生成可视化图表
- 🔍 数据预览功能
- 💾 一键插入图表到 Excel

**使用场景：**
- 数据快速分析
- 报表制作
- 数据可视化

**分析功能：**
- 数据行数/列数统计
- 数值总和/平均值计算
- 柱状图可视化
- 数据预览表格

## 🚀 快速开始

### 前置要求

1. **Office 版本要求：**
   - Office 2016 或更高版本
   - 或者 Office 365 / Microsoft 365

2. **开发工具：**
   - 文本编辑器（VS Code 推荐）
   - 本地 Web 服务器（用于测试）

### 安装步骤

1. **启动本地服务器**

   使用 Node.js 的 http-server 或 Python 的简单服务器：

   ```bash
   # 使用 Python
   cd office-addins
   python -m http.server 3000
   
   # 或使用 Node.js
   npx http-server -p 3000
   ```

2. **配置 manifest.xml**

   修改 manifest.xml 中的 URL，指向你的本地服务器：
   ```xml
   <SourceLocation DefaultValue="https://localhost:3000/powerpoint-architecture-generator/index.html"/>
   ```

3. **安装 Add-in**

   - 打开 PowerPoint 或 Excel
   - 文件 → 选项 → 加载项
   - 选择"我的加载项" → "上传我的加载项"
   - 选择对应的 manifest.xml 文件

4. **使用 Add-in**

   - 在 PowerPoint/Excel 中，点击"插入" → "我的加载项"
   - 选择已安装的 Add-in
   - 开始使用！

## 🎨 UI 设计亮点

所有 Add-in 都采用了现代化的 UI 设计：

- **渐变背景**：使用 CSS 渐变营造视觉层次
- **卡片式布局**：清晰的信息分组
- **交互动画**：按钮悬停效果、状态反馈
- **响应式设计**：适配不同屏幕尺寸
- **图标和表情符号**：增强可读性

## 💡 技术实现要点

### Office.js API 使用

```javascript
// PowerPoint 示例
PowerPoint.run(async (context) => {
    const slide = context.presentation.slides.getActiveSlide();
    const shape = slide.shapes.addTextBox(
        "文本内容",
        PowerPoint.ShapeTextOrientation.horizontal,
        50, 50, 600, 100
    );
    await context.sync();
});

// Excel 示例
Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    range.load("values");
    await context.sync();
    const data = range.values;
});
```

### 图表生成

- 使用 Chart.js 库生成交互式图表
- 支持多种图表类型（柱状图、折线图等）
- 可自定义颜色和样式

## 🔧 自定义开发

### 添加新功能

1. 在 `index.html` 中添加 UI 元素
2. 实现对应的 JavaScript 函数
3. 使用 Office.js API 与 Office 应用交互
4. 测试并调试

### 修改样式

所有样式都在 `<style>` 标签中，可以直接修改：
- 颜色主题
- 布局结构
- 字体大小
- 动画效果

## 📝 注意事项

1. **HTTPS 要求**：生产环境必须使用 HTTPS，本地开发可以使用 localhost
2. **跨域问题**：确保 manifest.xml 中的域名与服务器一致
3. **API 权限**：manifest.xml 中需要设置正确的权限（ReadWriteDocument）
4. **浏览器兼容性**：Office Add-ins 基于 Web 技术，需要现代浏览器支持

## 🎓 学习资源

- [Office Add-ins 官方文档](https://docs.microsoft.com/office/dev/add-ins/)
- [Office.js API 参考](https://docs.microsoft.com/javascript/api/)
- [PowerPoint JavaScript API](https://docs.microsoft.com/javascript/api/powerpoint)
- [Excel JavaScript API](https://docs.microsoft.com/javascript/api/excel)

## 📄 许可证

本项目示例代码仅供学习和参考使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**享受使用 Office Add-ins 的乐趣！** 🎉
