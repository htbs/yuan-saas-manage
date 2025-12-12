// 用户相关的接口请求
import request, { unwrap } from "@src/lib/request";
import { LoginReqParams, LoginResInfo } from "@src/features/auth/type";

// 用户登录
export function loginApi(params: LoginReqParams): Promise<LoginResInfo> {
  return request
    .post<LoginResInfo, LoginReqParams>("/auth/login", params)
    .then(unwrap);
}
