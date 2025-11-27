// src/features/auth/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LoginReqParams, LoginResInfo } from "../api/types";
import { loginApi } from "../api/login";
import { message } from "antd";

/** storage keys */
const STORAGE_TOKEN_KEY = "authToken";
const STORAGE_USER_KEY = "authUser";

function readTokenFromStorages(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(STORAGE_TOKEN_KEY) || localStorage.getItem(STORAGE_TOKEN_KEY);
}

function readUserFromStorages(): any | null {
    if (typeof window === "undefined") return null;
    const userStr = sessionStorage.getItem(STORAGE_USER_KEY) || localStorage.getItem(STORAGE_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

function saveAuthToStorage(token: string, user: any, remember: boolean) {
    if (typeof window === "undefined") return;
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(STORAGE_TOKEN_KEY, token);
    storage.setItem(STORAGE_USER_KEY, JSON.stringify(user || {}));
}

function clearAuthFromStorage() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    sessionStorage.removeItem(STORAGE_TOKEN_KEY);
    sessionStorage.removeItem(STORAGE_USER_KEY);
}

/** Context value type (增加 ready 字段) */
interface AuthContextValue {
    token: string | null;
    user: any | null;
    isAuthenticated: boolean;
    ready: boolean; // 是否完成初始化（读取 storage）
    login: (params: LoginReqParams, remember?: boolean) => Promise<void>;
    logout: () => void;
    setUser: (u: any) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // 初始化时读取 storage
        const t = readTokenFromStorages();
        const u = readUserFromStorages();
        setToken(t);
        setUser(u);
        setReady(true); // 完成初始化
    }, []);

    const login = async (params: LoginReqParams, remember = false) => {
        try {
            const res: LoginResInfo = await loginApi(params);
            const tokenResp = res.token;
            const userResp = res.user ?? { username: params.username };
            if (!tokenResp) {
                message.error("登录失败：未返回 token");
                return Promise.reject(new Error("no token"));
            }
            saveAuthToStorage(tokenResp, userResp, remember);
            setToken(tokenResp);
            setUser(userResp);
            setReady(true);
            message.success("登录成功");
        } catch (err: any) {
            const e = err?.message || "登录失败";
            message.error(e);
            return Promise.reject(err);
        }
    };

    const logout = () => {
        clearAuthFromStorage();
        setToken(null);
        setUser(null);
        // 需要时可 router.push('/login') 由使用方决定
    };

    const value = useMemo(
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
