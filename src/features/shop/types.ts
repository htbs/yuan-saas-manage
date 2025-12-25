import { BaseResult, PageParams, Page } from "@src/types/constant";

/**
 * 商家完整信息
 */
export interface ShopInfo extends BaseResult {
  name?: string; // 商家名称
  code: string; // 商家编号
  type?: string; // 商家类型
  signedStatus?: string; // 签约状态
  signedStartAt?: string; // 签约时间
  signedEndAt?: string; // 到期时间
  lockStatus?: string; // 锁定状态
}

/**
 * 商家列表数据 筛选参数 分页
 */
export interface ShopFilterListParams extends PageParams {
  name?: string; // 商家名称
  code?: string; // 商家编号
  signedStatus?: string; // 签约状态
}

/**
 * 商家列表数据
 */
export interface ShopListInfo extends BaseResult {
  name?: string; // 商家名称
  code?: string; // 商家编号
  type?: string; // 商家类型
  signedStatus?: string; // 签约状态
  signedStartAt?: string; // 签约时间
  signedEndAt?: string; // 到期时间
  lockStatus?: string; // 锁定状态
}

/**
 * 系统用户列表数据
 */
export type PageShop = Page<ShopListInfo>;
