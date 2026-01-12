// 用户相关的接口请求
import request, { unwrap } from "@src/lib/request";
import {
  ShopFilterListParams,
  PageShop,
  ShopInfo,
  UpdateOrAddShopInfo,
} from "@src/features/shop";
import path from "path";

// 用户登录
export function findShopPageApi(
  params: ShopFilterListParams
): Promise<PageShop> {
  return request
    .getQuery<PageShop, ShopFilterListParams>("/shop/page", params)
    .then(unwrap);
}

/**
 * 锁定
 * @param id ID
 * @returns true/false
 */
export function lockShopApi(id: string): Promise<boolean> {
  return request.put<boolean, string>(`/shop/lcok/${id}`).then(unwrap);
}

/**
 * 解锁
 * @param id ID
 * @returns true/false
 */
export function unLockShopApi(id: string): Promise<boolean> {
  return request.put<boolean, string>(`/shop/unlock/${id}`).then(unwrap);
}

/**
 * 删除
 * @param id ID
 * @returns true/false
 */
export function deleteShopApi(id: string): Promise<boolean> {
  return request.delete<boolean>(`/shop/delete/${id}`).then(unwrap);
}

/**
 * 通过ID查询详情
 */
export function findShopByIdApi(id: string): Promise<ShopInfo> {
  return request.get<ShopInfo>(`/shop/get/${id}`).then(unwrap);
}

/**
 * 编辑商家详情
 */
export function updateShopApi(params: UpdateOrAddShopInfo): Promise<boolean> {
  return request
    .post<boolean, UpdateOrAddShopInfo>(`/shop/update`, params)
    .then(unwrap);
}

/**
 * 新增商家
 */
export function addShopApi(params: UpdateOrAddShopInfo): Promise<boolean> {
  return request
    .post<boolean, UpdateOrAddShopInfo>(`/shop/add`, params)
    .then(unwrap);
}
