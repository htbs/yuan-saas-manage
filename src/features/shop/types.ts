import { BaseResult, PageParams, Page, AddressMeta } from "@src/types/constant";

/**
 * 商家完整信息
 */
export interface ShopInfo extends BaseResult {
  name?: string; // 商家名称
  code: string; // 商家编号
  type?: string; // 商家类型
  address?: AddressMeta; // 地址信息
  signedStatus?: string; // 签约状态
  unifiedCreditCode?: string; // 统一社会信用代码
  legalPersonName: string; // 法人姓名
  legalPersonSex: string; // 法人性别
  legalPersonPhone: string; // 法人电话
  legalPersonEmail: string; // 法人邮箱
  idCardFront: string; // 法人身份证正面
  idCardBack: string; // 法人身份证反面
  businessLicense: string; // 营业执照
  signedUserId: string; //签约人id
  signedUserName: string; //签约人
  signedStartAt: string; // 签约时间
  signedEndAt: string; // 到期时间
  signedAmount: number; // 签约金额（分）
  lockStatus: string; // 锁定状态
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
 * 新增或修改商家信息
 */
export interface UpdateOrAddShopInfo extends BaseResult {
  name: string; // 商家名称
  code: string; // 商家编号
  type: string; // 商家类型
  address: AddressMeta; // 地址信息
  signedStatus: ShopTypeEnum; // 签约状态
  unifiedCreditCode: string; // 统一社会信用代码
  legalPersonName: string; // 法人姓名
  legalPersonSex: string; // 法人性别
  legalPersonPhone: string; // 法人电话
  legalPersonEmail: string; // 法人邮箱
  idCardFront: string; // 法人身份证正面
  idCardBack: string; // 法人身份证反面
  businessLicense: string; // 营业执照
  signedStartAt?: string; // 签约时间
  signedEndAt?: string; // 到期时间
  lockStatus?: string; // 锁定状态
}

/**
 * 系统用户列表数据
 */
export type PageShop = Page<ShopListInfo>;

/** 1. 定义原始枚举 */
export enum ShopTypeEnum {
  RESTAURANT = "RESTAURANT",
  SCENIC_SPOT = "SCENIC_SPOT",
  BEAUTY = "BEAUTY",
}

/** 2. 定义元数据映射 (私有) */
const ShopTypeConfig = {
  [ShopTypeEnum.RESTAURANT]: { name: "餐饮" },
  [ShopTypeEnum.SCENIC_SPOT]: { name: "景点" },
  [ShopTypeEnum.BEAUTY]: { name: "美容美妆" },
} as const;

/** 3. 功能实现 */

// A. 根据字符串获取枚举值 (Value)
export const getEnumByStr = (str: string): ShopTypeEnum | undefined => {
  return Object.values(ShopTypeEnum).includes(str as ShopTypeEnum)
    ? (str as ShopTypeEnum)
    : undefined;
};

// B. 根据枚举值获取对应的 name
export const getShopTypeName = (value: ShopTypeEnum): string => {
  return ShopTypeConfig[value]?.name ?? "未知类型";
};

// C. 根据 name 获取枚举值 (反向查找)
export const getEnumByName = (name: string): ShopTypeEnum | undefined => {
  const entry = Object.entries(ShopTypeConfig).find(
    ([_, info]) => info.name === name
  );
  return entry ? (entry[0] as ShopTypeEnum) : undefined;
};

// D. 获取下拉框数据 (Select Options)
export interface ShopTypeOption {
  label: string;
  value: ShopTypeEnum;
}

/**
 * 获取下拉框数据
 */
export const getShopTypeOptions = (): ShopTypeOption[] => {
  return Object.values(ShopTypeEnum).map((val) => ({
    label: ShopTypeConfig[val].name,
    value: val,
  }));
};
