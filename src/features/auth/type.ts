// types : src/features/auth/type.ts
import { UserTypeEnum, LoginTypeEnum } from "@/src/types/constant";
import { User } from "@/src/types/user";

// 登录请求参数 :
export type LoginReqParams = {
  username: string;
  password: string;
  // 其他后端约定字段，例如 captcha 等
  // captcha?: string;
  userType: UserTypeEnum;
  loginType: LoginTypeEnum; // 登录方式
};

// 登录响应参数 :
export interface LoginResInfo {
  accessToken: string; // token
  refreshToken: string; // 刷新token
  userType: UserTypeEnum; // 用户类型
  userId: string; // 用户id
  username: string; // 用户名
  avatar: string; // 头像
}

// // 鉴权上下文类型 :
export interface AuthContextValue {
  token: string | null; // token 信息
  user: User | null; // 用户信息
  isAuthenticated: boolean; // 是否已认证 ( 有 token )
  ready: boolean; // 是否完成初始化 ( 读取 storage 完成 )
  login: (params: LoginReqParams, remember?: boolean) => Promise<LoginResInfo>; // function : 登录
  logout: () => void; // function : 登出
  // setUser: (u: User) => void; // function : 更新用户信息
  storageUserInfo: (u: User) => void; // function : 存储用户信息
  // TODO: 这里采用了 any, 且提供了 setUser 方法, 需调整;
}

// // LoginForm 相关类型 :
export type LoginFormVals = {
  username: string;
  password: string;
  remember?: boolean;
};

// onSubmit 类型 ( 严格版 )
export type OnSubmitStrict = (
  vals: LoginReqParams & { remember?: boolean }
) => Promise<void>;

// onSubmit 类型 ( 兼容版 )
export type OnSubmitCompat = (
  vals: LoginReqParams & { remember?: boolean }
) => Promise<void> | void;

// LoginForm Props : ( 聚合版 )
export type LoginFormProps = {
  onSubmit: OnSubmitStrict | OnSubmitCompat;
  loading?: boolean;
};
