// 存储到localstorage中的token的key
export const STORAGE_AUTH = "auth";

// 存储到localstorage中的token的对象key，auth对应StorageAuth
export interface StorageAuth {
  token: string | null;
  refareshToken: string | null;
}

// 用户类型
export enum UserTypeEnum {
  SYSTEM_USER = "SYSTEM_USER", // 系统用户
  CLIENT_USER = "CLIENT_USER", // 客户用户
  GUEST_USER = "GUEST_USER", // 游客用户
}

// 登录类型
export enum LoginTypeEnum {
  USERNAME_PASSWORD = "USERNAME_PASSWORD", // 用户名密码
  WECHAT = "WECHAT", // 微信
  WECHAT_MP_SUBSCRIPTION = "WECHAT_MP_SUBSCRIPTION", // 微信公众号订阅
  SMS = "SMS", // 短信
}

// 分页元数据
export interface PageMeta {
  number: number; // 当前页码
  size: number; // 每页条数
  totalPages: number;
  totalElements: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 带内容的泛型分页
export interface Page<T> extends PageMeta {
  content: T[];
}

// 分页参数
export interface PageParams {
  pageNo: number; // 当前页码
  pageSize: number; // 每页条数
}

/**
 * 基础结果
 */
export interface BaseResult {
  id: string; // 主键ID
  createBy: string; // 创建人
  createAt: string; // 创建时间
  updateBy: string; // 修改人
  updateAt: string; // 修改时间
}
