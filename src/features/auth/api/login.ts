/**
 * login.ts
 * 
 * 后端请求集中, 便于 mock, 测试, 错误统一处理, 将来改 endpoint 或增加 header 只改一处;
 * 
 */
import request from "../../../lib/request";
import type { LoginReqParams, LoginResInfo } from "./types";

/**
 * 登录接口
 * 返回示例 { code: 200, data: { token, user }, message: '' }
 * 这里返回的是 LoginResInfo
 */
export async function loginApi(params: LoginReqParams): Promise<LoginResInfo> {
    const res = await request.post<{ code: number; data: LoginResInfo; message?: string }>(
        "/auth/login",
        params
    );
    return (res as any).data ?? (res as unknown as LoginResInfo);
}
