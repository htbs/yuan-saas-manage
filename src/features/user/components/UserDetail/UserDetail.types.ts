import { User } from "@src/types/user";

/**
 * 新增/修改用户参数
 */
export interface UpdateOrAddUserParams extends Partial<User> {
  smsCaptcha?: string; // 短信验证码
}
