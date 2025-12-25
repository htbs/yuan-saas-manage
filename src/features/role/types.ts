import { BaseResult, Page, PageParams } from "@/src/types/constant";

/**
 * 角色信息
 */
export interface RoleInfo extends BaseResult {
  name?: string; // 角色名称
  description?: string; // 角色描述
  deptId: string; // 部门ID
  deptName?: string;
}

/**
 * 角色列表数据 筛选参数 分页
 */
export interface RoleFilterListParams extends PageParams {
  name?: string; // 角色名称
  merchantCode?: string; //商家编码
}

/**
 * 系统用户列表数据
 */
export type PageRole = Page<RoleInfo>;

/**
 * 修改角色参数
 */
export interface UpdateOrAddRoleParams {
  id: string; // 角色ID
  name?: string; // 角色名称
  description?: string; // 角色描述
  deptId?: string; // 部门ID
  merchantCode?: string; // 商家编码
}

/**
 * 角色授权菜单参数
 */
export interface RoleAuthMenuParams {
  roleId: string; // 角色ID
  menuIds: string[]; // 菜单ID
}
