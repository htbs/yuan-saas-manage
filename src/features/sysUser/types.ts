import { PageParams, BaseResult, Page } from "@/src/types/constant";

/**
 * 系统用户列表筛选参数
 */
export interface SysUserFilterListParams extends PageParams {
  userName?: string;
  phone?: string;
  status?: number;
}

/**
 * 系统用户列表数据
 */
export interface SysUserDataList extends BaseResult {
  userName: string; // 用户名
  email: string; // 邮箱
  phone: string; // 手机号
  realName: string; // 真实姓名
  status: string; // 状态
  deptId: number; // 部门ID
  deptName: string; // 部门名称
}

/**
 * 系统用户列表数据
 */
export type PageSysUser = Page<SysUserDataList>;
