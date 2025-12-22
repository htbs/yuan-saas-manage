export interface UserActionsProps {
  userName: string; // 用户名
  userAvatar?: string; // 用户头像
  onLogout: () => void; // 退出登录
  onRestPassword: () => void; // 重置密码
}
