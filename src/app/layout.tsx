"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, App } from "antd";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useTheme } from "@/components/theme/ThemeProvider";
import "@/styles/reset.css";
import "@/styles/globals.css";
import "@/styles/variables.css";

const inter = Inter({ subsets: ["latin"] }); // 引入 Inter 字体

// 客户端组件：注入 Ant Design 主题
function AntdThemeProvider({ children }: { children: ReactNode }) {
  const { currentTheme } = useTheme();
  return (
    <ConfigProvider theme={{ ...currentTheme, cssVar: true, hashed: false }}>
      {/* <StyleProvider hashPriority="high">{children}</StyleProvider> */}
      <App>{children}</App>
    </ConfigProvider>
  );
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AntdThemeProvider>{children}</AntdThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
