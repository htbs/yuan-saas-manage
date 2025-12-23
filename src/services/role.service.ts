// 角色相关接口

import request, { unwrap } from "@src/lib/request";
import { PageRole } from "@/src/features/role/types";
import { RoleFilterListParams } from "../features/role/components/RoleList/RoleList.types";

/**
 *  角色列表分页查询
 * @param params 查询参数
 * @returns
 */
export function findPageRoolListApi(
  params: RoleFilterListParams
): Promise<PageRole> {
  return request
    .getQuery<PageRole, RoleFilterListParams>(`/role/page`, params)
    .then(unwrap);
}
