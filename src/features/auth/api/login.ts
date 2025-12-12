/**
 * login.ts
 *
 * 后端请求集中, 便于 mock, 测试, 错误统一处理, 将来改 endpoint 或增加 header 只改一处;
 *
 */
import type { LoginReqParams, LoginResInfo } from "../type";
import request from "@/src/lib/request/index";

/**
 * 登录接口
 * 返回示例 :
{
    "status": "",
    "code": "",
    "data": {
        "accessToken": "",
        "refreshToken": "",
        "userType": "",
        "userId": 0,
        "username": "",
        "avatar": ""
    },
    "traceId": "",
    "message": "",
    "timestamp": 0,
    "debug": ""
}
 */
// export async function loginApi(params: LoginReqParams): Promise<LoginResInfo> {
//     /**
//      *
//     const res = await request.post<{ code: number; data: LoginResInfo; message?: string }>(
//         "/auth/login",
//         params
//     );
//     return (res as any).data ?? (res as unknown as LoginResInfo);

//      */
//     return (
//         {
//             'accessToken': '123456',
//             'refreshToken': '123456',
//             'userType': 'USER',
//             'userId': '123456',
//             'username': 'ginger',
//             'avatar': 'http://www.baidu.com/img/flexible/logo/pc/peak-result.png',
//         } as LoginResInfo
//     );
// }
