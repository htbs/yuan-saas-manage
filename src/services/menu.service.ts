import request, { unwrap } from "@src/lib/request";
import { MenuInfo } from "../features/menu/types";

/**
 * 根据用户ID查询可访问的菜单
 */
export function getAuthMenuByUserIdApi(id: string): Promise<MenuInfo[]> {
  return request.get<MenuInfo[]>(`sys/users/get/menu/list/${id}`).then(unwrap);
}

/**
 * 根据角色ID查询可访问的菜单
 */
export function getAuthMenuByRoleIdApi(id: string): Promise<MenuInfo[]> {
  return request
    .get<MenuInfo[]>(`/role/authorize/menu/list/${id}`)
    .then(unwrap);
}
