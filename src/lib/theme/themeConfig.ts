// src/theme/themeConfig.ts
import { theme, type ThemeConfig } from "antd";

const baseTheme: ThemeConfig = {
  token: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },
};
/** ---------------- 明亮主题 ---------------- */
export const lightTheme: ThemeConfig = {
  ...baseTheme,
  token: {
    colorBgBase: "--global-bg", // 系统级背景色
    // colorBgContainer: "#fff", // 组件容器背景色（可选）
    // colorBgLayout: "#f0f2ff", // Layout 背景色（可选）
    colorPrimary: "#00b96b",
    // colorInfo: "#1677ff",
    colorBgElevated: "#000", // 悬浮容器背景色
    colorSplit: "--global-bg",
  },
  components: {
    Menu: {
      itemSelectedBg: "#e6f7ff", // 选中菜单项背景色
      itemHoverBg: "#f5f5f5", // 悬停菜单项背景色
      itemBg: "--global-bg", // 菜单项背景色
      subMenuItemBg: "--global-bg", // 子菜单项背景色
    },
  },
};

/** ---------------- 暗黑主题 ---------------- */
export const darkTheme: ThemeConfig = {
  // 1. 使用 antd 内置的暗色算法
  algorithm: theme.darkAlgorithm,
  ...baseTheme,
  // 2. 在暗色算法的基础上，自定义你的 token
  token: {
    colorPrimary: "#00b96b", // 暗黑模式下的品牌主色
    colorInfo: "#00b96b",
    colorBgLayout: "#22272e", // 暗黑模式下的布局背景
  },
};
