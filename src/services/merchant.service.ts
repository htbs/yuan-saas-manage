// 用户相关的接口请求
import request, { unwrap } from "@src/lib/request";
import { FilterListParams, PageMerchant } from "@src/features/merchant/types";

// 用户登录
export function findPageList(params: FilterListParams): Promise<PageMerchant> {
  return request
    .getQuery<PageMerchant, FilterListParams>("/sys/users/page", params)
    .then(unwrap);
}
