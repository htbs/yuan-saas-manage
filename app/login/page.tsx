"use client"; // 这是一个 client component（需要与 useAuth 一起工作）

import React, { useState } from "react";
import { useAuth } from "../../src/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { LoginReqParams, LoginResInfo } from "../../src/features/auth/type";
import LoginModule from "../../src/features/auth/components/LoginPage";
import { getUserInfoApi } from "../../src/services/user.service";
import { User } from "../../src/types/user";

export default function LoginPage() {
  const { login, storageUserInfo } = useAuth();
  const router = useRouter();
  const [loading] = useState(false);

  const handleSubmit = async (
    vals: LoginReqParams & { remember?: boolean }
  ) => {
    try {
      const loginData: LoginResInfo = await login(vals, Boolean(vals.remember));
      // 登录成功，测试调用查询用户信息接口，
      const userInfo: User = await getUserInfoApi(loginData.userId);
      // 保存用户信息到 state 中
      storageUserInfo(userInfo);
      // 登录成功后跳转到首页（或上次页面）
      router.push("/home");
    } catch (err: unknown) {
      // login 已经在 hook 中 message.error
      console.error("登录失败", err);
    } finally {
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoginModule onSubmit={handleSubmit} loading={loading} />
    </main>
  );
}
