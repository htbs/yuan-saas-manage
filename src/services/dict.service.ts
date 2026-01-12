// 用户相关的接口请求
import request, { unwrap } from "@src/lib/request";
import {
  DictFilterListParams,
  DictInfo,
  DictItemFilterListParams,
  DictItemInfo,
  PageDict,
  PageDictItem,
} from "@src/features/dict";

// 分页查询字典列表
export function findDictPageApi(
  params: DictFilterListParams
): Promise<PageDict> {
  return request
    .getQuery<PageDict, DictFilterListParams>("/dict/page", params)
    .then(unwrap);
}

/**
 * 锁定
 * @param id ID
 * @returns true/false
 */
export function lockDictApi(id: string): Promise<boolean> {
  return request.put<boolean, string>(`/dict/lock/${id}`).then(unwrap);
}

/**
 * 解锁
 * @param id ID
 * @returns true/false
 */
export function unLockDictApi(id: string): Promise<boolean> {
  return request.put<boolean, string>(`/dict/unlock/${id}`).then(unwrap);
}

/**
 * 删除
 * @param id ID
 * @returns true/false
 */
export function deleteDictApi(id: string): Promise<boolean> {
  return request.delete<boolean>(`/dict/delete/${id}`).then(unwrap);
}

/**
 * 通过ID查询详情
 */
export function findDictByIdApi(id: string): Promise<DictInfo> {
  return request.get<DictInfo>(`/dict/get/${id}`).then(unwrap);
}

/**
 * 编辑字典详情
 */
export function updateDictApi(params: DictInfo): Promise<boolean> {
  return request.post<boolean, DictInfo>(`/dict/update`, params).then(unwrap);
}

/**
 * 新增字典
 */
export function addDictApi(params: DictInfo): Promise<boolean> {
  return request.post<boolean, DictInfo>(`/dict/add`, params).then(unwrap);
}

// 分页查询字典项
export function findDictItemPageApi(
  params: DictItemFilterListParams
): Promise<PageDictItem> {
  return request
    .getQuery<PageDictItem, DictItemFilterListParams>("/dict/item/page", params)
    .then(unwrap);
}

/**
 * 锁定字典项
 * @param id ID
 * @returns true/false
 */
export function lockDictItemApi(id: string): Promise<boolean> {
  return request.put<boolean, string>(`/dict/item/lock/${id}`).then(unwrap);
}

/**
 * 解锁字典项
 * @param id ID
 * @returns true/false
 */
export function unLockDictItemApi(id: string): Promise<boolean> {
  return request.put<boolean, string>(`/dict/item/unlock/${id}`).then(unwrap);
}

/**
 * 删除字典项
 * @param id ID
 * @returns true/false
 */
export function deleteDictItemApi(id: string): Promise<boolean> {
  return request.delete<boolean>(`/dict/item/delete/${id}`).then(unwrap);
}

/**
 * 编辑字典项
 */
export function updateDictItemApi(params: DictItemInfo): Promise<boolean> {
  return request
    .post<boolean, DictItemInfo>(`/dict/item/update`, params)
    .then(unwrap);
}

/**
 * 新增字典项
 */
export function addDictItemApi(params: DictItemInfo): Promise<boolean> {
  return request
    .post<boolean, DictItemInfo>(`/dict/item/add`, params)
    .then(unwrap);
}
