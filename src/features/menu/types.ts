import { BaseResult } from "@/src/types/constant";

/**
 * 菜单信息
 */
export interface MenuInfo extends BaseResult {
  pid: string; // 父级ID 根为0
  menuCode: string; // 菜单编码
  children: MenuInfo[]; // 子级菜单
  name: string; // 菜单名称
  url: string; // 菜单URL
  permissions: string; // 权限标识
  icon: string; // 图标
  sort: number; // 排序
  menuType: number; // 菜单类型 0：菜单 1：按钮
}
