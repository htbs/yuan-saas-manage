// 用户类型
export enum UserTypeEnum {
  SYSTEM_USER = "SYSTEM_USER", // 系统用户
  CLIENT_USER = "CLIENT_USER", // 客户用户
  GUEST_USER = "GUEST_USER", // 游客用户
}

// 登录类型
export enum LoginTypeEnum {
  USERNAME_PASSWORD = "USERNAME_PASSWORD", // 用户名密码
  WECHAT = "WECHAT", // 微信
  WECHAT_MP_SUBSCRIPTION = "WECHAT_MP_SUBSCRIPTION", // 微信公众号订阅
  SMS = "SMS", // 短信
}
