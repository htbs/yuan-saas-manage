/**
 * api 相关 type :
 */
export interface LoginReqParams {
    username: string;
    password: string;
}

export interface LoginResInfo {
    token: string;
    expiresIn?: number;
    user?: {
        id: number | string;
        username: string;
        displayName?: string;
        [key: string]: any;
    };
}
