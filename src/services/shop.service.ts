// 用户相关的接口请求
import request, { unwrap } from "@src/lib/request";
import { ShopFilterListParams, PageShop } from "@src/features/shop";

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
  return request.delete<boolean>(`/api/shop/delete/${id}`).then(unwrap);
}
