// 用户相关的接口请求
import request, { unwrap } from "@src/lib/request";
import { LoginReqParams, LoginResInfo } from "@src/features/auth/type";
import { SysUserFilterListParams, PageSysUser } from "@/src/features/user";
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

// 用户列表分页查询
export function findPageListApi(
  params: SysUserFilterListParams
): Promise<PageSysUser> {
  return request
    .getQuery<PageSysUser, SysUserFilterListParams>("/sys/users/page", params)
    .then(unwrap);
}

/**
 * 锁定用户
 * @param id 用户ID
 * @returns true/false
 */
export function lockUserApi(id: string): Promise<boolean> {
  return request.put<boolean, string>(`/sys/users/lcok/${id}`).then(unwrap);
}

/**
 * 解决锁用户
 * @param id 用户ID
 * @returns true/false
 */
export function unLockUserApi(id: string): Promise<boolean> {
  return request.put<boolean, string>(`/sys/users/unlock/${id}`).then(unwrap);
}
