// 角色相关接口

import request, { unwrap } from "@src/lib/request";
import {
  PageRole,
  RoleInfo,
  UpdateOrAddRoleParams,
  RoleFilterListParams,
  RoleAuthMenuParams,
} from "@/src/features/role/types";

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

/**
 * 删除
 * @param id 角色ID
 * @returns true/false
 */
export function deleteRoleApi(id: string): Promise<boolean> {
  return request.delete<boolean>(`/role/delete/${id}`).then(unwrap);
}

/**
 * 根据ID 查看详情
 * @param id 角色ID
 * @returns true/false
 */
export function getRoleByIdApi(id: string): Promise<RoleInfo> {
  return request.get<RoleInfo>(`/role/${id}`).then(unwrap);
}

/**
 * 新增角色
 * @param params 角色参数
 * @returns
 */
export function saveRoleApi(params: UpdateOrAddRoleParams): Promise<boolean> {
  return request
    .post<boolean, UpdateOrAddRoleParams>(`/role/save`, params)
    .then(unwrap);
}

/**
 * 修改角色
 * @param params 角色参数
 * @returns
 */
export function updateRoleApi(params: UpdateOrAddRoleParams): Promise<boolean> {
  return request
    .put<boolean, UpdateOrAddRoleParams>(`/role/update`, params)
    .then(unwrap);
}

/**
 * 角色授权菜单
 */
export function roleAuthMenuApi(params: RoleAuthMenuParams): Promise<boolean> {
  return request.post<boolean>(`/role/authorize`, params).then(unwrap);
}
