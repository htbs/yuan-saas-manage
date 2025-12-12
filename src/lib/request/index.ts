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
import type { IncomingMessage } from "http";

// 创建一个 Axios 实例
const service: AxiosInstance = axios.create({
  // 根据环境设置 baseURL
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 请求超时时间
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

/* ---------- 2. 工具函数 ---------- */
let loadingCount = 0;
// 展示loading
const showLoading = () => {
  loadingCount === 0 && message.loading({ content: "加载中…", key: "loading" });
  loadingCount++;
};
// 隐藏 loading
const hideLoading = () => {
  loadingCount = Math.max(loadingCount - 1, 0);
  loadingCount === 0 && message.destroy("loading");
};

// 错误处理
const handleError = (code: string, msg?: string) => {
  let errorMessage = msg || "未知异常";
  switch (code) {
    case "401":
      errorMessage = "登录已失效";
      logout();
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
    default:
      break;
  }
  // 尽在客户端环境提示
  if (typeof window !== "undefined") {
    message.error(errorMessage);
  }
};

/** 获取 token：CSR 用 localStorage；SSR 用 cookie */
const getToken = (req?: IncomingMessage): string | null => {
  if (typeof window === "undefined") {
    // SSR 场景，从请求头 cookie 里解析
    const cookie = req?.headers?.cookie || "";
    const match = cookie.match(/(?:^|\s)authToken=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
  return localStorage.getItem("authToken");
};

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

    const token = getToken(config.headers?.req); // SSR 时把 req 带过来
    if (token) config.headers.Authorization = `Bearer ${token}`;

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
  (err: AxiosError<Result>) => {
    hideLoading();
    const status = err.response?.status;
    handleError(String(status));
    // if (status === 401) logout();
    return Promise.reject(err);
  }
);

/* ---------- 5. 封装请求方法 ---------- */
export type UnwrapResult<T> = T extends Result<infer D> ? D : never;

/** 把 Result<T> 转成 T，方便链式调用 */
export const unwrap = <T>(res: Result<T>): T => res.data;

const request = {
  get<R = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Result<R>> {
    return service.get<Result<R>>(url, config).then((r) => r.data);
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

// 使用示例
// import request, { unwrap } from '@/utils/http';

// // 1. 直接拿 Result
// request.get<User>('/user').then((res) => {
//   if (res.code === 200) console.log(res.data);
// });

// // 2. 链式 unwrap（更简洁）
// request.post<LoginVO>('/login', form).then(unwrap).then((vo) => {
//   Router.push('/dashboard');
// });

// // --- 请求拦截器 ---
// service.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     // 1. 添加 loading 状态

//     // 2. 添加 token 到请求头

//     // 注意：在 Next.js 中，客户端渲染时才能访问 localStorage
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("authToken");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     // 处理请求错误
//     return Promise.reject(error);
//   }
// );

// // --- 响应拦截器 ---
// service.interceptors.response.use(
//   (response: AxiosResponse) => {
//     // 1. 移除 loading 状态

//     const res: Result = response.data;
//     // 如果 code 不是 200 (假设 200 为成功状态)，则判断为错误
//     if (res.code !== 200) {
//       // 处理常见的错误状态码
//       switch (res.code) {
//         case 401:
//           // 例如：Token 过期或未授权，跳转到登录页
//           // 注意：在 Next.js 客户端路由跳转
//           if (typeof window !== "undefined") {
//             message.error("认证失败或已过期，请重新登录");
//             // window.location.href = '/login';
//           }
//           break;
//         case 403:
//           message.error("没有权限访问");
//           break;
//         case 500:
//           message.error("服务器内部错误");
//           break;
//         case 404:
//           message.error("请求资源未找到");
//           break;
//         default:
//           message.error(res.message || "请求失败");
//       }
//       return Promise.reject(new Error(res.message || "Error"));
//     } else {
//       // 成功，直接返回业务数据
//       return response;
//     }
//   },
//   (error) => {
//     // 2. 移除 loading 状态

//     // 处理网络错误
//     let msg = "";
//     if (error && error.response) {
//       switch (error.response.status) {
//         case 401:
//           msg = "未授权，请登录";
//           // 跳转逻辑
//           break;
//         case 403:
//           msg = "拒绝访问";
//           break;
//         // 其他错误状态码
//         default:
//           msg = "请求失败";
//       }
//     } else {
//       msg = "网络连接异常！";
//     }

//     message.error(msg);
//     return Promise.reject(error);
//   }
// );

// // --- 封装通用请求方法 ---
// const request = {
//   get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
//     return service.get(url, config);
//   },

//   post<T = unknown>(
//     url: string,
//     data?: object,
//     config?: AxiosRequestConfig
//   ): Promise<T> {
//     return service.post(url, data, config);
//   },

//   put<T = unknown>(
//     url: string,
//     data?: object,
//     config?: AxiosRequestConfig
//   ): Promise<T> {
//     return service.put(url, data, config);
//   },

//   delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
//     return service.delete(url, config);
//   },
// };

// export default request;
