// import React from "react";
// import { Button } from "antd";

// const Login = () => (



//     <div className="App">
//         <div className="flex justify-center items-center bg-blue-200 w-20 h-20 text-4xl ">
//             login
//         </div>

//     </div>
// );

// export default Login;


// src/app/login/page.tsx
"use client"; // 这是一个 client component（需要与 useAuth 一起工作）

import React, { useState } from "react";
import LoginForm from "../../src/features/auth/components/LoginForm/LoginForm";
import { useAuth } from "../../src/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";


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
            <LoginForm onSubmit={handleSubmit} loading={loading} />
        </main>
    );
}
