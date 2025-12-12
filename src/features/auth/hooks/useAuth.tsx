// src/features/auth/hooks/useAuth.tsx
import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LoginReqParams, LoginResInfo, AuthContextValue } from "../type";
import { loginApi } from "@/src/services/user.service";
import { message } from "antd";
import { User } from "@/src/types/user";

/** storage keys */
const STORAGE_TOKEN_KEY = "authToken";
const STORAGE_USER_KEY = "authUser";

// 存储登录信息
const STORAGE_AUTH = "auth";

// 存储的token信息
interface StorageAuth {
  token: string | null;
  refareshToken: string | null;
}

/** 从 storage 读取 token */
function readTokenFromStorages(): string | null {
  // window 是浏览器提供的全局对象, 服务端渲染时是没有 window 的 ! ( typeof 规避异常 )
  if (typeof window === "undefined") return null;

  // 先从 sessionStorage 读取, 再从 localStorage 读取 :
  return (
    sessionStorage.getItem(STORAGE_TOKEN_KEY) ||
    localStorage.getItem(STORAGE_TOKEN_KEY)
  );
}

/** 从 storage 读取 user */
// function readUserFromStorages(): any | null {
//   // window 是浏览器提供的全局对象, 服务端渲染时是没有 window 的 ! ( typeof 规避异常 )
//   if (typeof window === "undefined") return null;

//   // 先从 sessionStorage 读取, 再从 localStorage 读取 :
//   const userStr =
//     sessionStorage.getItem(STORAGE_USER_KEY) ||
//     localStorage.getItem(STORAGE_USER_KEY);

//   // 返回 Json / null :
//   return userStr ? JSON.parse(userStr) : null;
// }

/** 将 token 存入 storage */
function saveAuthToStorage(
  token: string,
  refareshToken: string,
  remember: boolean
) {
  // window 是浏览器提供的全局对象, 服务端渲染时是没有 window 的 ! ( typeof 规避异常 )
  if (typeof window === "undefined") return;

  // 根据 remeber 决定是存入 localStorage 还是 sessionStorage :
  const storage = remember ? localStorage : sessionStorage;
  const storageUserToke: StorageAuth = {
    token,
    refareshToken,
  };
  // 存入 token 和 user : ( {} 表示空对象 )
  storage.setItem(STORAGE_AUTH, JSON.stringify(storageUserToke));
}

/** 清空 storage 中的 token / user 信息 */
function clearAuthFromStorage() {
  // window 是浏览器提供的全局对象, 服务端渲染时是没有 window 的 ! ( typeof 规避异常 )
  if (typeof window === "undefined") return;

  // 移除 localStorage / sessionStorage 中的 token / user :
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
  sessionStorage.removeItem(STORAGE_TOKEN_KEY);
  sessionStorage.removeItem(STORAGE_USER_KEY);
}

/** 创建 AuthContext 上下文 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** AuthProvider 组件 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // 状态 :
  const [token, setToken] = useState<string | null>(() =>
    readTokenFromStorages()
  );
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(true);

  // 初始化 :
  // useEffect(() => {
  //   // 初始化时从 storage 读取 token / user :
  //   // const tokenByStorage = readTokenFromStorages();
  //   // const userByStorage = readUserFromStorages();
  //   // setToken(tokenByStorage);
  //   // setUser(userByStorage);
  //   // setReady(true);
  // }, []);

  // 登录方法 :
  const login = async (params: LoginReqParams, remember = false) => {
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
      // 如果认为有token 则登录成功，缓存中存储：token \refreshToken
      // const userResp = { username: res.username ?? params.username };

      // setToken(tokenResp);
      // setUser(userResp);
      // setReady(true);
      message.success("登录成功");
    } catch (err: unknown) {
      // const e = err?.message || "登录失败";
      // message.error(e);
      // return Promise.reject(err);
      // 在调用接口的时候已经提示了。不用在处理
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
