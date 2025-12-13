// 用户相关的接口请求
import request, { unwrap } from "@src/lib/request";
import { LoginReqParams, LoginResInfo } from "@src/features/auth/type";
import { User } from "@src/types/user";

// 用户登录
export function loginApi(params: LoginReqParams): Promise<LoginResInfo> {
  return request
    .post<LoginResInfo, LoginReqParams>("/auth/login", params)
    .then(unwrap);
}

// 根据用户ID获取用户信息
export function getUserInfoApi(id: number): Promise<User> {
  return request.get<User>(`/sys/users/${id}`).then(unwrap);
}
