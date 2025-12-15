"use client";
import "@/src/styles/reset.css";
import "@/src/styles/variables.css";
import "@/src/styles/globals.css";
import SideBar from "@src/components/layout/SideBar/sideBar";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth/hooks/useAuth";

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
  return (
    <div className="w-full h-full flex">
      <div className="flex-1">{children}</div>
    </div>
  );
}
