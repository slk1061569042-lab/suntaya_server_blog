/**
 * 设计系统配置
 * 基于 UI/UX Pro Max 规范
 * 所有设计相关的配置都在这里，便于统一管理和快速切换风格
 */

// ==================== 设计风格配置 ====================
export const DESIGN_STYLE = {
  // 主风格：Glassmorphism (玻璃态)
  primary: 'glassmorphism',
  // 辅助风格：Flat Design (扁平设计)
  secondary: 'flat',
  // 落地页模式：Hero-Centric Design (英雄区设计)
  landing: 'hero-centric',
} as const;

// ==================== 颜色配置 ====================
export const COLORS = {
  // 主色调
  primary: {
    main: '#2563EB',      // 信任蓝
    hover: '#1D4ED8',     // 主色悬停
    light: '#3B82F6',     // 亮蓝
    dark: '#1E40AF',      // 深蓝
  },
  
  // 次色调
  secondary: {
    main: '#3B82F6',      // 亮蓝
    hover: '#2563EB',    // 次色悬停
    light: '#60A5FA',    // 浅蓝
    dark: '#1D4ED8',     // 深蓝
  },
  
  // CTA 按钮颜色
  cta: {
    main: '#F97316',     // 活力橙
    hover: '#EA580C',    // CTA 悬停
    light: '#FB923C',    // 浅橙
    dark: '#C2410C',     // 深橙
  },
  
  // 背景色（暗色主题）
  background: {
    main: '#0A0E1A',           // 主背景
    secondary: '#0F172A',      // 次背景
    tertiary: '#1E293B',       // 第三背景
    glass: 'rgba(15, 23, 42, 0.85)',      // 玻璃效果背景
    glassCard: 'rgba(15, 23, 42, 0.8)',   // 玻璃卡片背景
  },
  
  // 文本颜色
  text: {
    primary: '#F1F5F9',         // 主文本
    main: '#E2E8F0',            // 常规文本
    muted: '#94A3B8',           // 次要文本
    mutedLight: '#CBD5E1',      // 浅次要文本
    disabled: '#64748B',        // 禁用文本
  },
  
  // 边框颜色
  border: {
    main: '#1E293B',            // 主边框
    light: '#334155',           // 浅边框
    glass: 'rgba(255, 255, 255, 0.1)',    // 玻璃边框
    glassCard: 'rgba(255, 255, 255, 0.12)', // 玻璃卡片边框
  },
  
  // 状态颜色
  status: {
    success: '#10B981',          // 成功
    warning: '#FBBF24',         // 警告
    error: '#EF4444',           // 错误
    info: '#3B82F6',            // 信息
  },
  
  // 功能区域颜色（用于 Git Flow Diagram 等）
  area: {
    blue: {
      border: '#3B82F6',
      bg: '#3B82F6',
      opacity: {
        border: 0.3,
        bg: 0.05,
      },
    },
    green: {
      border: '#10B981',
      bg: '#10B981',
      opacity: {
        border: 0.3,
        bg: 0.05,
      },
    },
    orange: {
      border: '#F97316',
      bg: '#F97316',
      opacity: {
        border: 0.3,
        bg: 0.05,
      },
    },
    purple: {
      border: '#8B5CF6',
      bg: '#8B5CF6',
      opacity: {
        border: 0.3,
        bg: 0.05,
      },
    },
    yellow: {
      border: '#FBBF24',
      bg: '#FBBF24',
      opacity: {
        border: 0.3,
        bg: 0.05,
      },
    },
  },
} as const;

// ==================== 玻璃效果配置 ====================
export const GLASS_EFFECTS = {
  // 基础玻璃效果
  glass: {
    blur: '12px',
    saturation: '180%',
    background: COLORS.background.glass,
    border: COLORS.border.glass,
  },
  
  // 玻璃卡片效果
  glassCard: {
    blur: '16px',
    saturation: '180%',
    background: COLORS.background.glassCard,
    border: COLORS.border.glassCard,
    shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },
} as const;

// ==================== 间距配置 ====================
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

// ==================== 圆角配置 ====================
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ==================== 过渡动画配置 ====================
export const TRANSITIONS = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  easing: {
    default: 'ease-in-out',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ==================== 字体配置 ====================
export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ==================== 阴影配置 ====================
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  glass: GLASS_EFFECTS.glassCard.shadow,
} as const;

// ==================== 响应式断点配置 ====================
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ==================== CSS 变量生成器 ====================
/**
 * 生成 CSS 变量字符串，用于注入到 :root
 */
export function generateCSSVariables(): string {
  return `
    --primary: ${COLORS.primary.main};
    --primary-hover: ${COLORS.primary.hover};
    --secondary: ${COLORS.secondary.main};
    --cta: ${COLORS.cta.main};
    --cta-hover: ${COLORS.cta.hover};
    --background: ${COLORS.background.main};
    --background-secondary: ${COLORS.background.secondary};
    --text: ${COLORS.text.main};
    --text-primary: ${COLORS.text.primary};
    --text-muted: ${COLORS.text.muted};
    --text-muted-light: ${COLORS.text.mutedLight};
    --border: ${COLORS.border.main};
    --border-light: ${COLORS.border.light};
  `.trim();
}

// ==================== Tailwind 类名工具函数 ====================
/**
 * 获取主色相关的 Tailwind 类名
 */
export function getPrimaryClasses() {
  return {
    text: `text-[${COLORS.primary.main}]`,
    bg: `bg-[${COLORS.primary.main}]`,
    border: `border-[${COLORS.primary.main}]`,
    hover: `hover:text-[${COLORS.primary.hover}] hover:bg-[${COLORS.primary.hover}]`,
  };
}

/**
 * 获取 CTA 按钮相关的 Tailwind 类名
 */
export function getCTAClasses() {
  return {
    bg: `bg-[${COLORS.cta.main}]`,
    hover: `hover:bg-[${COLORS.cta.hover}]`,
    text: `text-white`,
  };
}

/**
 * 获取玻璃效果相关的 Tailwind 类名
 */
export function getGlassClasses() {
  return {
    glass: 'glass',
    glassCard: 'glass-card',
  };
}

// ==================== 导出配置对象 ====================
export const DESIGN_CONFIG = {
  style: DESIGN_STYLE,
  colors: COLORS,
  glass: GLASS_EFFECTS,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  transitions: TRANSITIONS,
  typography: TYPOGRAPHY,
  shadows: SHADOWS,
  breakpoints: BREAKPOINTS,
} as const;

// ==================== 类型导出 ====================
export type DesignStyle = typeof DESIGN_STYLE;
export type Colors = typeof COLORS;
export type GlassEffects = typeof GLASS_EFFECTS;
