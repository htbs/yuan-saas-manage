import * as CryptoJS from "crypto-js";

/**
 * 使用 MD5 对字符串进行哈希加密
 * @param password 待加密的原始密码
 * @returns 加密后的 32 位 MD5 字符串
 */
export const hashPasswordMD5 = (password: string): string => {
  if (!password) {
    return "";
  }

  // 1. 确保传入的密码是字符串
  // 2. 使用 CryptoJS.MD5 方法进行哈希计算
  // 3. 调用 .toString() 将结果转换为标准的十六进制字符串
  return CryptoJS.MD5(password).toString();
};

/**
 * MD5 大写
 * @param password  明文
 * @returns
 */
export const hashPasswordMD5UpperCase = (password: string): string => {
  return CryptoJS.MD5(password).toString().toUpperCase();
};
