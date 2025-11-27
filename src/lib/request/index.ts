import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Result } from "./type";
import { message } from "antd";

// 创建一个 Axios 实例
const service: AxiosInstance = axios.create({
  // 根据环境设置 baseURL
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 请求超时时间
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// --- 请求拦截器 ---
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. 添加 loading 状态

    // 2. 添加 token 到请求头

    // 注意：在 Next.js 中，客户端渲染时才能访问 localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// --- 响应拦截器 ---
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 1. 移除 loading 状态

    const res: Result = response.data;
    // 如果 code 不是 200 (假设 200 为成功状态)，则判断为错误
    if (res.code !== 200) {
      // 处理常见的错误状态码
      switch (res.code) {
        case 401:
          // 例如：Token 过期或未授权，跳转到登录页
          // 注意：在 Next.js 客户端路由跳转
          if (typeof window !== "undefined") {
            message.error("认证失败或已过期，请重新登录");
            // window.location.href = '/login';
          }
          break;
        case 403:
          message.error("没有权限访问");
          break;
        case 500:
          message.error("服务器内部错误");
          break;
        case 404:
          message.error("请求资源未找到");
          break;
        default:
          message.error(res.message || "请求失败");
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      // 成功，直接返回业务数据
      return response;
    }
  },
  (error) => {
    // 2. 移除 loading 状态

    // 处理网络错误
    let msg = "";
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          msg = "未授权，请登录";
          // 跳转逻辑
          break;
        case 403:
          msg = "拒绝访问";
          break;
        // 其他错误状态码
        default:
          msg = "请求失败";
      }
    } else {
      msg = "网络连接异常！";
    }

    message.error(msg);
    return Promise.reject(error);
  }
);

// --- 封装通用请求方法 ---
const request = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = unknown>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = unknown>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
};

export default request;
