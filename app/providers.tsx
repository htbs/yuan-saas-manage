// AuthProvider 需要在客户端渲染
"use client";

import "@ant-design/v5-patch-for-react-19";

import React from "react";
import { AuthProvider } from "@src/features/auth/hooks/useAuth";

export default function Providers({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}
