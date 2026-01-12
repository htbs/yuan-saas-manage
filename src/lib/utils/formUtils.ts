// utils/formUtils.ts
// 统一处理配置的参数，防止写成很多if
export const resolveDynamic = <TData, TResult>(
    prop: TResult | ((data: TData) => TResult) | undefined,
    data: TData
): TResult | undefined => {
    if (prop === undefined) return undefined;
    if (typeof prop === "function") {
        return (prop as (data: TData) => TResult)(data);
    }
    return prop;
};
