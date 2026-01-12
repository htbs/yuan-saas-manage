# 🚀 React 19 + Ant Design 通用配置化表单

这是一个基于 **React 19**、**React Hook Form**、**Zod** 和 **Ant Design** 的高性能、类型安全的配置化表单生成器。

它旨在解决中后台开发中繁琐的表单构建工作，通过 JSON 配置即可实现**复杂联动**、**动态布局**、**自定义组件**及**深度验证**。

## 📚 目录

- [核心特性](#-核心特性)
- [环境依赖](#-环境依赖)
- [目录结构](#-目录结构)
- [核心代码实现](#-核心代码实现)
    - [1. 类型定义 (`types/form.ts`)](#1-类型定义-typesformts)
    - [2. 工具函数 (`utils/formUtils.ts`)](#2-工具函数-utilsformutilsts)
    - [3. 字段渲染器 (`FieldRenderer.tsx`)](#3-字段渲染器-fieldrenderertsx)
    - [4. 表单主组件 (`index.tsx`)](#4-表单主组件-indextsx)
- [自定义组件开发](#-自定义组件开发)
- [终极使用示例 (Demo)](#-终极使用示例-demo)
- [API 参考](#-api-参考)

---

## ✨ 核心特性

1.  **配置驱动**: 将 UI 与逻辑分离，通过 JSON 数组生成表单。
2.  **响应式联动**: 所有属性（`label`, `span`, `disabled`, `ifShow`, `props`）均支持传入 `(data) => result` 函数，实时响应表单数据变化。
3.  **深度适配 Ant Design**: 完美支持 Antd 的 24 栅格系统 (`Row`/`Col`) 和 `Form.Item` 样式（红星、错误提示、Label 对齐）。
4.  **高性能**: 基于 React Hook Form 的 `FormProvider` 和 `useWatch`，避免非必要的全量重渲染。
5.  **类型安全**: 结合 Zod Schema，提供全链路 TypeScript 类型推导。
6.  **无限扩展**: 支持 `type: 'custom'` 接入任意 React 组件。

---

## 📦 环境依赖

确保你的项目中安装了以下库：

```bash
# npm
npm install react-hook-form zod @hookform/resolvers antd @ant-design/icons

# pnpm
pnpm add react-hook-form zod @hookform/resolvers antd @ant-design/icons
```

---

## 📂 目录结构

建议按照以下结构组织文件：

```text
src/
├── types/
│   └── form.ts               # 类型定义
├── utils/
│   └── formUtils.ts          # 动态属性解析工具
├── components/
│   ├── SchemaForm/
│   │   ├── index.tsx         # 表单入口
│   │   └── FieldRenderer.tsx # 单个字段渲染逻辑
│   └── CustomComponents/     # 你的自定义业务组件
```

---

## 💻 核心代码实现

### 1. 类型定义 (`types/form.ts`)

```typescript
import { ReactNode, ComponentType } from "react";
import { FieldValues, Path } from "react-hook-form";
import { FormLayout } from "antd/es/form/Form";

// 泛型工具：属性可以是静态值，也可以是依赖表单数据的函数
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
  
  // --- 基础 & 动态属性 ---
  label?: DynamicProp<T, string>;
  ifShow?: DynamicProp<T, boolean>;     // 是否渲染
  disabled?: DynamicProp<T, boolean>;   // 是否禁用
  required?: DynamicProp<T, boolean>;   // 仅控制 UI 红星显示，实际校验由 Zod 负责
  
  // --- 布局 (Antd 24栅格) ---
  span?: DynamicProp<T, number>;

  // --- 组件配置 ---
  placeholder?: string;
  options?: Option[];                   // 用于 Select/Radio/TreeSelect
  component?: ComponentType<any>;       // type="custom" 时必传
  componentProps?: DynamicProp<T, Record<string, any>>; // 透传给 Antd 组件的 props
  
  // --- 插槽 & 提示 ---
  renderBefore?: DynamicProp<T, ReactNode>; // 前置内容 (Icon/Text)
  renderAfter?: DynamicProp<T, ReactNode>;  // 后置内容 (单位/说明)
  tooltip?: string;                         // Label 旁的问号提示
  helperText?: string;                      // 字段下方的辅助文字

  // --- 交互 ---
  emitChange?: boolean;                 // 是否触发外部 onFieldChange 事件
}

export interface SchemaFormProps<T extends FieldValues> {
  schema: any; // Zod Schema
  fields: FormFieldConfig<T>[];
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void;
  onFieldChange?: (name: Path<T>, value: any, allValues: T) => void;
  
  loading?: boolean;
  children?: ReactNode;
  className?: string;

  // --- 布局配置 ---
  layout?: FormLayout;       // 'horizontal' | 'vertical' | 'inline'
  gridCols?: number;         // 默认每行显示几列 (用于计算默认 span)
  gutter?: number | [number, number]; 
  labelCol?: { span: number; offset?: number };
  wrapperCol?: { span: number; offset?: number };
}
```

### 2. 工具函数 (`utils/formUtils.ts`)

```typescript
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
```

### 3. 字段渲染器 (`components/SchemaForm/FieldRenderer.tsx`)

负责处理动态逻辑、插槽布局以及 Antd 组件映射。

```tsx
import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { 
  Form, Col, Input, InputNumber, Select, DatePicker, Switch, 
  Checkbox, Radio, TreeSelect 
} from "antd";
import { FormFieldConfig } from "../../types/form";
import { resolveDynamic } from "../../utils/formUtils";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface FieldRendererProps<T extends any> {
  config: FormFieldConfig<T>;
  onFieldChange?: any;
  defaultSpan?: number;
}

const FieldRenderer = <T extends any>({
  config,
  onFieldChange,
  defaultSpan = 24,
}: FieldRendererProps<T>) => {
  // 1. 获取上下文 (解决 control 为 null 问题)
  const { control, formState: { errors } } = useFormContext();
  
  // 2. 实时监听表单数据，实现联动
  const formValues = useWatch({ control }) || {};

  // 3. 解析动态属性
  const isVisible = resolveDynamic(config.ifShow, formValues) ?? true;
  if (!isVisible) return null;

  const span = resolveDynamic(config.span, formValues) ?? defaultSpan;
  const disabled = resolveDynamic(config.disabled, formValues) ?? false;
  const isRequired = resolveDynamic(config.required, formValues) ?? false;
  const label = resolveDynamic(config.label, formValues);
  const componentProps = resolveDynamic(config.componentProps, formValues) || {};
  const contentBefore = resolveDynamic(config.renderBefore, formValues);
  const contentAfter = resolveDynamic(config.renderAfter, formValues);

  // 4. 组件渲染工厂
  const renderControl = (field: any) => {
    // 拦截 onChange 处理 emitChange
    const handleChange = (val: any) => {
      let finalValue = val;
      if (val?.target) {
         finalValue = val.target.type === 'checkbox' ? val.target.checked : val.target.value;
      }
      field.onChange(finalValue);
      
      if (config.emitChange && onFieldChange) {
        // 注意：此时 formValues 可能尚未更新，手动合并最新值传出
        onFieldChange(config.name, finalValue, { ...formValues, [config.name]: finalValue });
      }
    };

    const commonProps = {
      ...field,
      ...componentProps,
      onChange: handleChange,
      disabled,
      placeholder: config.placeholder,
      id: config.name,
      // 抹平 checked/value 差异
      checked: (config.type === "checkbox" || config.type === "switch") ? field.value : undefined,
    };

    // 针对 Input 使用 Antd 原生 addon
    if (["input", "number", "password"].includes(config.type)) {
       commonProps.addonBefore = contentBefore;
       commonProps.addonAfter = contentAfter;
    }

    switch (config.type) {
      case "input": return <Input {...commonProps} />;
      case "password": return <Input.Password {...commonProps} />;
      case "number": return <InputNumber {...commonProps} style={{ width: "100%", ...componentProps.style }} />;
      case "textarea": return <TextArea {...commonProps} rows={4} />;
      case "select": return <Select options={config.options} {...commonProps} allowClear />;
      case "treeSelect": return <TreeSelect treeData={config.options} {...commonProps} allowClear />;
      case "date": return <DatePicker {...commonProps} style={{ width: "100%" }} />;
      case "range": return <RangePicker {...commonProps} style={{ width: "100%" }} />;
      case "switch": return <Switch {...commonProps} checked={field.value} />;
      case "checkbox": return <Checkbox {...commonProps}>{config.options?.[0]?.label}</Checkbox>;
      case "radio": return <Radio.Group options={config.options} {...commonProps} />;
      case "custom":
        if (config.component) {
          const CustomComponent = config.component;
          return <CustomComponent {...commonProps} />;
        }
        return <div style={{ color: "red" }}>Missing Component</div>;
      default: return <Input {...commonProps} />;
    }
  };

  // 5. 非 Input 组件的插槽外层包裹
  const isInputWithAddon = ["input", "number", "password"].includes(config.type);
  const needWrapper = !isInputWithAddon && (contentBefore || contentAfter);
  const errorMsg = errors[config.name]?.message as string | undefined;

  return (
    <Col span={span}>
      <Form.Item
        label={label}
        name={config.name}
        required={isRequired}
        validateStatus={errorMsg ? "error" : ""}
        help={errorMsg || config.helperText}
        tooltip={config.tooltip}
        style={{ marginBottom: 24 }}
      >
        <div className={`w-full ${needWrapper ? "flex items-center gap-2" : ""}`}>
          {needWrapper && contentBefore && <div className="flex-shrink-0">{contentBefore}</div>}
          
          <div className="flex-grow">
            <Controller
              control={control}
              name={config.name}
              render={({ field }) => renderControl(field)}
            />
          </div>
          
          {needWrapper && contentAfter && <div className="flex-shrink-0">{contentAfter}</div>}
        </div>
      </Form.Item>
    </Col>
  );
};

export default FieldRenderer;
```

### 4. 表单主组件 (`components/SchemaForm/index.tsx`)

```tsx
import React from "react";
import { useForm, FieldValues, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Row } from "antd";
import { SchemaFormProps } from "../../types/form";
import FieldRenderer from "./FieldRenderer";

const SchemaForm = <T extends FieldValues>({
  schema,
  fields,
  defaultValues,
  onSubmit,
  onFieldChange,
  children,
  className = "",
  layout = "vertical",
  gridCols = 1,
  gutter = 16,
  labelCol,
  wrapperCol,
}: SchemaFormProps<T>) => {
  
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const { handleSubmit } = methods;
  const defaultSpan = 24 / gridCols;

  return (
    <FormProvider {...methods}>
      <Form
        component="form"
        layout={layout}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        onSubmitCapture={handleSubmit(onSubmit)}
        className={className}
      >
        <Row gutter={gutter}>
          {fields.map((fieldConfig) => (
            <FieldRenderer
              key={fieldConfig.name}
              config={fieldConfig}
              onFieldChange={onFieldChange}
              defaultSpan={defaultSpan}
            />
          ))}
        </Row>
        <div className="mt-2">
          {children}
        </div>
      </Form>
    </FormProvider>
  );
};

export default SchemaForm;
```

---

## 🧩 自定义组件开发

如果内置组件不够用，你可以编写自定义组件。只需满足：**接收 `value` 和 `onChange`**。

```tsx
// components/ColorPicker.tsx
import React from "react";
import { ColorPicker as AntColorPicker } from "antd";

interface Props {
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

const MyColorPicker: React.FC<Props> = ({ value, onChange, disabled }) => {
  return (
    <AntColorPicker 
      value={value} 
      onChange={(c) => onChange?.(c.toHexString())} // 转换 Antd 颜色对象为字符串
      disabled={disabled} 
      showText
    />
  );
};
export default MyColorPicker;
```

---

## 🌟 终极使用示例 (Demo)

这个示例展示了所有高级功能：**动态显隐、布局调整、自定义组件接入、事件监听、前后插槽**。

```tsx
"use client";
import React, { useState } from "react";
import { z } from "zod";
import { Button, message, Divider } from "antd";
import { UserOutlined, PayCircleOutlined } from "@ant-design/icons";
import SchemaForm from "./components/SchemaForm";
import { FormFieldConfig } from "./types/form";
import MyColorPicker from "./components/ColorPicker"; // 引入上面的自定义组件

// 1. 定义 Schema
const schema = z.object({
  userType: z.enum(["personal", "company"]),
  companyName: z.string().optional(),
  taxNo: z.string().optional(),
  productName: z.string().min(2, "必填"),
  currency: z.string(),
  price: z.number().min(0.01),
  isGift: z.boolean(),
  giftColor: z.string().optional(),
}).refine(data => {
  if (data.userType === "company" && !data.taxNo) return false;
  return true;
}, { message: "企业税号必填", path: ["taxNo"] });

type FormValues = z.infer<typeof schema>;

export default function DemoPage() {
  const [loading, setLoading] = useState(false);

  // 2. 表单配置
  const fields: FormFieldConfig<FormValues>[] = [
    // --- 动态显隐与联动 ---
    {
      name: "userType",
      label: "客户类型",
      type: "radio",
      span: 24,
      options: [
        { label: "个人", value: "personal" },
        { label: "企业", value: "company" }
      ],
      defaultValue: "personal",
    },
    {
      name: "companyName",
      label: "公司名称",
      type: "input",
      span: 12,
      ifShow: (data) => data.userType === "company", // 仅企业显示
      required: true, 
    },
    {
      name: "taxNo",
      label: "纳税人识别号",
      type: "input",
      span: 12,
      ifShow: (data) => data.userType === "company",
      required: true,
      placeholder: "15-20位税号"
    },

    // --- 插槽与动态 Label ---
    {
      name: "productName",
      label: "商品名称",
      type: "input",
      span: 24,
      renderBefore: <UserOutlined />,
    },
    {
      name: "currency",
      label: "币种",
      type: "select",
      span: 8,
      options: [
        { label: "人民币 (CNY)", value: "CNY" },
        { label: "美元 (USD)", value: "USD" }
      ],
      defaultValue: "CNY",
      emitChange: true, // 监听变化
    },
    {
      name: "price",
      // 动态 Label
      label: (data) => `单价 (${data.currency})`,
      type: "number",
      span: 16,
      renderBefore: <PayCircleOutlined />,
      // 动态 Props
      componentProps: (data) => ({
        step: data.currency === "USD" ? 0.01 : 1,
        prefix: data.currency === "USD" ? "$" : "¥"
      })
    },

    // --- 自定义组件与 Switch ---
    {
      name: "isGift",
      label: "礼品包装",
      type: "switch",
      span: 4,
    },
    {
      name: "giftColor",
      label: "选择包装色",
      type: "custom",
      component: MyColorPicker, // 接入自定义组件
      span: 20,
      ifShow: (data) => !!data.isGift,
    }
  ];

  const handleSubmit = (data: FormValues) => {
    setLoading(true);
    console.log("提交数据:", data);
    setTimeout(() => {
      message.success("提交成功");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">高级动态表单</h1>
      <SchemaForm<FormValues>
        schema={schema}
        fields={fields}
        onSubmit={handleSubmit}
        // Antd 布局配置
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        gridCols={2} // 默认两列布局
        gutter={[16, 16]}
      >
        <Divider />
        <div className="flex justify-end gap-4">
          <Button>重置</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交订单
          </Button>
        </div>
      </SchemaForm>
    </div>
  );
}
```

---

## 📖 API 参考

### SchemaForm Props

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `schema` | `ZodSchema` | **必填**。Zod 定义的验证规则 |
| `fields` | `FormFieldConfig[]` | **必填**。表单字段配置数组 |
| `onSubmit` | `(data) => void` | 表单提交回调 |
| `onFieldChange` | `(name, value, all) => void` | 字段值变化回调 (需配合 `emitChange: true`) |
| `layout` | `'horizontal' \| 'vertical'` | Label 位置 (默认 'vertical') |
| `gridCols` | `number` | 默认每行几列 (默认 1) |
| `labelCol` | `ColProps` | Antd Label 宽度配置 |
| `wrapperCol` | `ColProps` | Antd 控件宽度配置 |

### FormFieldConfig

**所有带 `(data) => ...` 的属性都支持根据当前表单值动态计算。**

| 属性 | 类型 | 动态支持 | 说明 |
| :--- | :--- | :--- | :--- |
| `name` | `string` | ❌ | 对应 Schema 中的字段名 |
| `type` | `FieldType` | ❌ | 组件类型 |
| `label` | `string` | ✅ | 字段标签 |
| `span` | `number` | ✅ | 栅格占位 (0-24) |
| `ifShow` | `boolean` | ✅ | 是否显示该字段 |
| `disabled` | `boolean` | ✅ | 是否禁用 |
| `required` | `boolean` | ✅ | 是否显示必填红星 |
| `component` | `Component` | ❌ | 自定义组件 |
| `renderBefore` | `ReactNode` | ✅ | 前置插槽 |
| `renderAfter` | `ReactNode` | ✅ | 后置插槽 |
| `componentProps` | `Object` | ✅ | 透传给 Antd 组件的 Props |