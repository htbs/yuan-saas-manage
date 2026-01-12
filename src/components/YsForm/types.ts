import { ReactNode, ComponentType } from "react";
import { FieldValues, Path } from "react-hook-form";
import { FormLayout } from "antd/es/form/Form"; // Antd 布局类型

type DynamicProp<TData, TProp> = TProp | ((data: TData) => TProp);

export type FieldType =
    | "input" | "password" | "number" | "textarea"
    | "select" | "treeSelect" | "checkbox" | "switch"
    | "date" | "range" | "radio" | "custom";

export interface Option {
    label: string;
    value: string | number | boolean;
    children?: Option[];
}

export interface FormFieldConfig<T extends FieldValues> {
    name: Path<T>;
    type: FieldType;
    label?: DynamicProp<T, string>;

    // --- 布局配置 ---
    // Antd 使用 24 栅格系统。如果不填，默认根据全局列数计算。
    span?: DynamicProp<T, number>;

    // --- 交互与逻辑 ---
    ifShow?: DynamicProp<T, boolean>;
    disabled?: DynamicProp<T, boolean>;
    required?: DynamicProp<T, boolean>; // 控制 UI 上的红星显示

    // --- 组件配置 ---
    component?: ComponentType<any>; // 自定义组件
    componentProps?: DynamicProp<T, Record<string, any>>;
    options?: Option[];

    // --- 插槽 ---
    renderBefore?: DynamicProp<T, ReactNode>;
    renderAfter?: DynamicProp<T, ReactNode>;

    // --- 其它 ---
    emitChange?: boolean;
    tooltip?: string;
    helperText?: string; // 额外的提示文案
    placeholder?: string;
}

export interface SchemaFormProps<T extends FieldValues> {
    schema: any; // Zod schema
    fields: FormFieldConfig<T>[];
    defaultValues?: Partial<T>;
    onSubmit: (data: T) => void;
    onFieldChange?: (name: Path<T>, value: any, allValues: T) => void;

    loading?: boolean;
    children?: ReactNode;
    className?: string;

    // --- Antd 表单特定配置 ---
    layout?: FormLayout; // 'horizontal' | 'vertical' | 'inline'
    labelCol?: { span: number; offset?: number }; // Label 宽度配置
    wrapperCol?: { span: number; offset?: number }; // 控件宽度配置
    gridCols?: number; // 默认每行几列 (用于计算默认 span)
    gutter?: number | [number, number]; // 栅格间距
}