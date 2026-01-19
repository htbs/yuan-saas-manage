/**
 * 公共的工具方法
 */
// 获取操作人/创建人

/**
 * 解析后的用户信息接口
 */
export interface UserContext {
  userId: string;
  userType: string;
  userName: string;
}

/**
 * 解析 Java AppContextHolder 生成的用户信息字符串
 * 格式: "userId:userType:userName"
 * * @param userInfoRaw 原始字符串
 * @returns UserContext | null 解析成功返回对象，格式错误或为空返回 null
 */
export const parseUserInfo = (userInfoRaw: string): UserContext | null => {
  // 1. 防御性编程：处理空值
  if (!userInfoRaw || typeof userInfoRaw !== "string") {
    return null;
  }

  // 2. 解构赋值：基于冒号分割
  // Java 侧拼接逻辑：id + ":" + type + ":" + name
  const [userId, userType, userName] = userInfoRaw.split(":");

  // 3. 核心校验：根据 Java 逻辑，userId 是 map 的起点，如果 userId 为空说明原始逻辑没走通
  if (!userId) {
    return null;
  }

  return {
    userId,
    // 使用空字符串作为兜底，防止出现 undefined
    userType: userType ?? "",
    userName: userName ?? "",
  };
};
