// 定义店铺相关的常量和枚举等

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
