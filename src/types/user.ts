// 用户类型
export interface User {
  id: number; //用户ID
  userName: string; //用户名
  email: string; // 用户邮箱
  phone: string; // 手机号
  realName: string; // 真实姓名
  status: string; // 账户状态
  deptId: number; // 部门id
  roleIds: number[]; // 角色集合
}
