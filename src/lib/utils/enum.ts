// 定义返回项的接口
export interface EnumOption {
    label: string;
    value: string | number;
}

/**
 * 将枚举转换为 { label, value } 数组
 * @param enumObj TypeScript 枚举对象
 */
export function enumToArray(enumObj: Record<string, string | number>): EnumOption[] {
    return Object.keys(enumObj)
        .filter((key) => isNaN(Number(key))) // 过滤掉数字枚举的反向映射 key
        .map((key) => ({
            label: key,
            value: enumObj[key],
        }));
}

/**
 * 根据枚举的 Value 获取 Key (Label)
 * @param enumObj 枚举对象
 * @param value 枚举的值
 * @returns 对应的 Key，如果找不到返回 undefined
 */
export function getEnumKeyByValue(
    enumObj: Record<string, string | number>,
    value: string | number
): string | undefined {
    return Object.keys(enumObj).find((key) => {
        // 值匹配 且 key 不是数字（为了兼容数字枚举，防止取到反向映射的索引）
        return enumObj[key] === value && isNaN(Number(key));
    });
}