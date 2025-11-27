"use client"; // 这是一个 client component（需要与 useAuth 一起工作）

import React, { useState } from "react";
import { useAuth } from "../../src/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import LoginModule from "../../src/features/auth/components/LoginPage";


export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async ({ username, password, remember }: any) => {
        setLoading(true);
        try {
            await login({ username, password }, remember === true);
            // 登录成功后跳转到首页（或上次页面）
            router.push("/");
        } catch (err) {
            // login 已经在 hook 中 message.error
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LoginModule onSubmit={handleSubmit} loading={loading} />
        </main>
    )
}
