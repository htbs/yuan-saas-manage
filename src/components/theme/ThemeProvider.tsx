"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeContextType } from "@/components/theme/type";
import type { ThemeConfig } from "antd";
import { lightTheme, darkTheme } from "@/lib/theme/themeConfig";

// 创建上下文（指定默认值类型）
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  currentTheme: lightTheme,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 初始化主题（从 localStorage 读取，处理 SSR 场景）
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  // 当前主题
  const currentTheme: ThemeConfig = isDark ? darkTheme : lightTheme;

  // 切换主题方法
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  // 同步 HTML 根元素 class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
