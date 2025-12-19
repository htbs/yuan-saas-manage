"use client";
import "@/src/styles/reset.css";
import "@/src/styles/variables.css";
import "@/src/styles/globals.css";
import SideBar from "@src/components/layout/SideBar/sideBar";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import RightHeader from "@src/components/layout/RightHeader/RightHeader";

export function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full h-full flex">
      <SideBar />
      <div className="flex-1">{children}</div>
    </div>
  );
}

/**
 * ProtectedLayout : 通过 useAuth 检查 token, 未登录则重定向到 /login ;
 * 约定 :
 *     所有需要鉴权 token 的页面, 均放置于 ProtectedLayout 内, 也就是 app/(main) 目录下.
 */
export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [ready, isAuthenticated, router]);

  if (!ready) {
    return (
      <div
        style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}
      >
        正在检查登录状态…
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full h-full flex">
      <SideBar />
      {/* 2. 右侧包装容器：设为 flex-col 使内部元素上下排列 */}
      <div className="flex-1 flex flex-col h-full">
        {/* 右上区域 */}
        <RightHeader />

        {/* 右下区域 */}
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
