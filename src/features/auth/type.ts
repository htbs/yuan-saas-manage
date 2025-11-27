// types : src/features/auth/type.ts


// 登录请求参数 :
export type LoginReqParams = {
    username: string;
    password: string;
    // 其他后端约定字段，例如 captcha 等
    // captcha?: string;
};


// 登录响应参数 :
export interface LoginResInfo {
    accessToken: string;
    refreshToken: string;
    userType: string;
    userId: number | string;
    username: string;
    avatar: string;
}


// 鉴权上下文类型 :
export interface AuthContextValue {
    token: string | null;           // token 信息
    user: any | null;               // 用户信息
    isAuthenticated: boolean;       // 是否已认证 ( 有 token )
    ready: boolean;                 // 是否完成初始化 ( 读取 storage 完成 )
    login: (params: LoginReqParams, remember?: boolean) => Promise<void>;  // function : 登录
    logout: () => void;             // function : 登出
    setUser: (u: any) => void;      // function : 更新用户信息  
    // TODO: 这里采用了 any, 且提供了 setUser 方法, 需调整;
}


// LoginForm 相关类型 :
export type LoginFormVals = {
    username: string;
    password: string;
    remember?: boolean;
};


// onSubmit 类型 ( 严格版 )
export type OnSubmitStrict = (vals: LoginReqParams & { remember?: boolean }) => Promise<void>;

// onSubmit 类型 ( 兼容版 )
export type OnSubmitCompat = (vals: LoginReqParams & { remember?: boolean }) => Promise<void> | void;


// LoginForm Props : ( 聚合版 )
export type LoginFormProps = {
    onSubmit: OnSubmitStrict | OnSubmitCompat;
    loading?: boolean;
};