import { BaseResult, PageParams } from "@/src/types/constant";

/**
 * 字典信息
 */
export interface DictInfo extends BaseResult {
  dictName: string; // 名称
  dictType: string; // 字典类型
  platform: string; // 平台
  sort: number; // 排序
  remark: string; // 备注
}

/**
 * 字典项信息
 */
export interface DictItemInfo extends BaseResult {
  dictType: string; // 字典类型
  dictLabel: string; // 项名称
  dictValue: string; // 项值
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
