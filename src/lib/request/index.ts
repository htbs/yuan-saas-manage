import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

import { Result } from "./type";
import { message } from "antd";
import Router from "next/router";
import { StorageAuth } from "@/src/types/constant";
import {
  readTokenFromStorages,
  saveAuthToStorage,
} from "@/src/lib/utils/authUtil";

/** 刷新 token 的纯函数 */
interface RefareshTokenResult {
  accessToken: string;
  refreshToken: string;
}

// 公共配置
const DEFAULT_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
};

// 主实例：带拦截
export const service: AxiosInstance = axios.create(DEFAULT_CONFIG);

// 干净实例：专用于刷新 token，无拦截
export const refreshAxios: AxiosInstance = axios.create(DEFAULT_CONFIG);

// 不需要 token 的接口
const NO_TOKEN_WHITE_LIST: string[] = ["/auth/login"];

/* ---------- 2. 工具函数 ---------- */
let loadingCount = 0;
// 展示 loading
const showLoading = () => {
  if (loadingCount === 0) {
    message.loading({ content: "加载中…", key: "loading" });
  }
  loadingCount++;
};

// 隐藏 loading
const hideLoading = () => {
  loadingCount = Math.max(loadingCount - 1, 0);
  if (loadingCount === 0) {
    message.destroy("loading");
  }
};

// 错误处理
const handleError = (code: string, msg?: string) => {
  let errorMessage = msg || "未知异常";
  switch (code) {
    case "401":
      errorMessage = errorMessage || "认证已失效";
      break;
    case "404":
      errorMessage = "接口不存在";
      break;
    case "403":
      errorMessage = "无权限访问";
      break;
    case "500":
      errorMessage = "服务器内部错误";
      break;
    case "ECONNABORTED":
      errorMessage = "服务打盹了";
      break;
    default:
      break;
  }
  console.error(code, msg);
  // 尽在客户端环境提示
  if (typeof window !== "undefined") {
    message.error(errorMessage);
  }
};

let isRefreshing = false; // 防止重复刷新
let failedQueue: Array<{
  resolve: (value?: AxiosResponse) => void;
  reject: (reason?: unknown) => void;
}> = [];

/* 刷新 token 的纯函数 */
async function refreshToken(): Promise<RefareshTokenResult> {
  const auth: StorageAuth = readTokenFromStorages();
  const refresh = auth.refareshToken;
  if (!refresh) throw new Error("无刷新凭证");

  // 这里用 axios 实例发刷新请求（不要走拦截器避免死循环）
  const { data } = await refreshAxios.post<Result<RefareshTokenResult>>(
    "/auth/refresh1",
    { refreshToken: refresh }
  );
  return {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  };
}

/** 清除登录态并跳转 */
const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    Router.replace(
      `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    );
  }
};

/* ---------- 3. 请求拦截器 ---------- */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    showLoading();
    const url = config.url ?? "";
    // 白名单直接放过,不增加token
    if (NO_TOKEN_WHITE_LIST.some((p) => url.startsWith(p))) return config;
    const auth: StorageAuth = readTokenFromStorages();
    if (auth && auth.token) config.headers.Authorization = `${auth.token}`;
    return config;
  },
  (error: AxiosError) => {
    hideLoading();
    return Promise.reject(error);
  }
);

/* ---------- 4. 响应拦截器 ---------- */
service.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    hideLoading();
    // HTTP 成功，但业务失败
    if (res.data.code !== "0000") {
      handleError(res.data.code, res.data.message);
      return Promise.reject(res.data);
    }

    // 真正成功
    return res;
  },
  async (err: AxiosError<Result>) => {
    hideLoading();
    const originalRequest = err.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = err.response?.status;
    // 只处理 401 且未重试过
    if (
      status === 401 &&
      err.response?.data.code === "AUTH_0004" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // 已经在刷新，把当前请求挂起
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => service(originalRequest));
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAuth: RefareshTokenResult = await refreshToken();

        saveAuthToStorage(newAuth.accessToken, newAuth.refreshToken); // 落盘
        // 更新 axios 默认头
        service.defaults.headers.common[
          "Authorization"
        ] = `${newAuth.accessToken}`;
        // 把队列里所有因 401 挂起的请求重新发
        failedQueue.forEach(({ resolve }) => resolve());
        failedQueue = [];
        // 重试原请求
        return service(originalRequest);
      } catch (refreshErr) {
        // 刷新失败：清 token、跳登录、抛错
        // clearAuthFromStorage();
        delete service.defaults.headers.common["Authorization"];
        failedQueue.forEach(({ reject }) => reject(refreshErr));
        failedQueue = [];
        handleError(String("401"));
        if (typeof window !== "undefined") {
          console.error("认证过期，正在跳转登录...");
          // 2. 优先尝试单例跳转，失败则使用 location
          window.location.replace("/login");
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    // 其它错误继续抛
    if (err.response) {
      handleError(String(status), err.response?.data.message);
    } else {
      handleError(String(err.code));
    }
    return Promise.reject(err);
  }
);

/* ---------- 5. 封装请求方法 ---------- */
export type UnwrapResult<T> = T extends Result<infer D> ? D : never;

/** 把 Result<T> 转成 T，方便链式调用 */
export const unwrap = <T>(res: Result<T>): T => res.data;

/**
 * 过滤掉对象中值为 null, undefined 或空字符串的属性。
 * @param obj 待过滤的对象
 * @returns 过滤后的新对象
 */
const cleanParams = <T extends object>(obj: T): Partial<T> => {
  if (!obj) return {} as Partial<T>;

  const cleaned: Partial<T> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // 检查值是否为 null, undefined, 或空字符串
      if (value !== null && value !== undefined && value !== "") {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
};

const request = {
  get<R = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Result<R>> {
    return service.get<Result<R>>(url, config).then((r) => r.data);
  },

  /**
   * 专用于 GET 请求，接收一个参数对象，自动放入 config.params 中。
   * @param url 请求地址
   * @param params 查询参数对象
   * @param config 可选的 Axios 配置
   */
  getQuery<R = unknown, P extends object = Record<string, unknown>>(
    url: string,
    params: P, // 明确的参数对象，不再是可选的 config
    config?: AxiosRequestConfig
  ): Promise<Result<R>> {
    const cleanedParams = cleanParams(params);
    // 构造最终的 AxiosRequestConfig 对象
    const finalConfig: AxiosRequestConfig = {
      ...config,
      // 核心：将传入的 params 对象赋值给 config.params
      params: cleanedParams,
    };

    return service.get<Result<R>>(url, finalConfig).then((r) => r.data);
  },

  post<R = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<Result<R>> {
    return service.post<Result<R>>(url, data, config).then((r) => r.data);
  },

  put<R = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<Result<R>> {
    return service.put<Result<R>>(url, data, config).then((r) => r.data);
  },

  delete<R = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Result<R>> {
    return service.delete<Result<R>>(url, config).then((r) => r.data);
  },
};

export default request;
