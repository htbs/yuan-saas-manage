import { ColumnType } from "antd/es/table";
import { Rule } from "antd/es/form";
import { AxiosRequestConfig } from "axios";

// 1. 搜索表单字段配置类型
export interface FormFieldConfig {
  key: string; // 对应 Form.Item 的 name
  label: string;
  type: "input" | "select" | "rangePicker" | "datePicker"; // 支持的 Antd 组件类型
  placeholder?: string;
  options?: { value: string | number; label: string }[]; // 仅用于 select
  rules?: Rule[];
}

// 基础分页参数
interface PaginationParams {
  pageNo: number;
  pageSize: number;
}

/**
 * 列表请求参数类型。
 * 默认情况下，筛选字段 F 为 Record<string, unknown>。
 * 这表示筛选对象中的值是未知的，但在使用时需要进行类型窄化（Type Narrowing）。
 */
export type ListRequestParams<F extends object = Record<string, unknown>> =
  PaginationParams & F;

// 2. 通用的列表 Props 类型
export interface GenericListProps<
  T extends object,
  F extends object = Record<string, unknown>
> {
  // 传入 Antd Table 的 Columns，T 是数据项类型
  columns: ColumnType<T>[];

  // 搜索表单的配置数组
  searchFields: FormFieldConfig[];

  // 核心：数据获取函数。接收筛选参数+分页信息，返回 Promise<T[]>
  fetcher: (
    params: ListRequestParams<F>,
    config?: AxiosRequestConfig // 允许传递额外的 Axios 配置
  ) => Promise<{ list: T[]; total: number }>;

  showIndexColumn?: boolean; // 是否显示索引列

  onRefetch: (refetch: () => void) => void; // 供父组件获取列表刷新函数的 Callback

  // 这些是使用zustand 的时候。可以选择传入。如果不需要可以忽略
  initialValues?: F; // 外部传入的初始表单值
  controlledPagination?: { current: number; pageSize: number }; // 外部页码
  onPaginationChange?: (current: number, pageSize: number) => void; // 页码改变回调
  onSearchUpdate?: (values: F) => void; // 点击搜索后的回调
  onReset?: () => void; // 点击重置后的回调
}
