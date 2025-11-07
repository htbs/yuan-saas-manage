import type { ThemeConfig } from "antd";

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  currentTheme: ThemeConfig;
}
