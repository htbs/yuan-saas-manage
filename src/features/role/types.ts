import { BaseResult, Page } from "@/src/types/constant";

/**
 * 角色信息
 */
export interface RoleInfo extends BaseResult {
  name: string; // 角色名称
  description: string; // 角色描述
  deptId: string; // 部门ID
  deptName: string;
}

/**
 * 系统用户列表数据
 */
export type PageRole = Page<RoleInfo>;
