import { BaseResult, PageParams, Page } from "@/src/types/constant";

/**
 * 字典信息
 */
export interface DictInfo extends BaseResult {
  dictName: string; // 名称
  dictCode: string; // 字典编码
  platform: string; // 平台
  sort: number; // 排序
  lockStatus: string; // 状态
  remark: string; // 备注
}

/**
 * 字典项信息
 */
export interface DictItemInfo extends BaseResult {
  dictType: string; // 字典类型
  dictLabel: string; // 项名称
  dictValue: string; // 项值
  lockStatus: string; // 状态
  sort: number; // 排序
  remark: string; // 备注
}

/**
 * 字典列表数据 筛选参数 分页
 */
export interface DictFilterListParams extends PageParams {
  dictName?: string; // 字典名称
  platform?: string; // 字典所属平台
}

/**
 * 系统用户列表数据
 */
export type PageDict = Page<DictInfo>;

/**
 * 字典列表数据 筛选参数 分页
 */
export interface DictItemFilterListParams extends PageParams {
  dictType?: string; // 字典类型
}

/**
 * 字典项列表数据
 */
export type PageDictItem = Page<DictItemInfo>;

/**
 * 平台选项
 */
export const platformOptions = [
  { value: "COMMON", label: "全平台" },
  { value: "PLATFORM", label: "元识管理端" },
  { value: "SHOP", label: "商家端" },
  { value: "USER", label: "用户端" },
];
