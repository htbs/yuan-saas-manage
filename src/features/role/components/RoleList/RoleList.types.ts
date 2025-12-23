import { PageParams } from "@/src/types/constant";

/**
 * 角色列表数据 筛选参数 分页
 */
export interface RoleFilterListParams extends PageParams {
  name?: string; // 角色名称
  merchantCode?: string; //商家编码
}
