// src/features/auth/hooks/useAuth.tsx
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LoginReqParams, LoginResInfo, AuthContextValue } from "../type";
import { loginApi } from "@/src/services/user.service";
import { message } from "antd";
import { User } from "@/src/types/user";
import {
  readTokenFromStorages,
  saveAuthToStorage,
  clearAuthFromStorage,
} from "@/src/lib/utils/authUtil";

/** 创建 AuthContext 上下文 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** AuthProvider 组件 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // 状态 :
  const [token, setToken] = useState<string | null>(() =>
    JSON.stringify(readTokenFromStorages())
  );
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(true);

  // 登录方法 :
  const login = async (
    params: LoginReqParams,
    remember = false
  ): Promise<LoginResInfo> => {
    try {
      // 调用登录 API :
      const res: LoginResInfo = await loginApi(params);

      // 获取 token，如果token为空 则证明登录失败
      const tokenResp = res.accessToken;

      // 登录失败 :
      if (!tokenResp) {
        message.error("登录失败");
        return Promise.reject(new Error("未返回token"));
      }
      // 登录成功: 保存 token / user 到 storage 和 state :
      saveAuthToStorage(tokenResp, res.refreshToken, remember);

      setToken(tokenResp);
      return res;
    } catch (err: unknown) {
      // 登录失败。这里抛出去 ，让调用方处理
      return Promise.reject(err);
    }
  };

  // 登出方法 :
  const logout = () => {
    // 清空 storage :
    clearAuthFromStorage();

    // 清空 state :
    setToken(null);
    setUser(null);
    setReady(true);

    // 需要时可 router.push('/login') 由使用方决定
  };

  // 记忆化 context value :
  const authContextValue = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      ready,
      login,
      logout,
      setUser,
    }),
    [token, user, ready]
  );

  // 将 children 包裹在 AuthContext.Provider 中返回 :
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/** useAuth 自定义 Hook, useAuth 就是 useContext(AuthContext), 通过 useAuth() 来获取 token 那些信息 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
