import React from "react";
import {
  Controller,
  useFormContext,
  useWatch,
  type FieldValues,
} from "react-hook-form";
import {
  Form,
  Col,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Checkbox,
  Radio,
  TreeSelect,
} from "antd";
import { FormFieldConfig } from "./types";
import { resolveDynamic } from "@src/lib/utils/formUtils";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

// 定义 Props，接收默认的 gridSpan
interface FieldRendererProps<T extends FieldValues> {
  config: FormFieldConfig<T>;
  onFieldChange?: (...args: any[]) => void;
  defaultSpan?: number; // 根据 gridCols 计算出的默认 span
  readonly?: boolean; // 接收全局只读状态y
}

const FieldRenderer = <T extends FieldValues>({
  config,
  onFieldChange,
  defaultSpan = 24,
  readonly = false,
}: FieldRendererProps<T>) => {
  // 1. 使用 Context 获取状态，不再需要父组件传 props
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const formValues = (useWatch({ control }) || {}) as T;

  // 2. 动态计算属性
  const isVisible = resolveDynamic(config.ifShow, formValues) ?? true;
  if (!isVisible) return null;

  // 如果全局是 readonly，则强制 disabled。 否则，使用配置中的 disabled (动态或静态)
  const configDisabled = resolveDynamic(config.disabled, formValues) ?? false;
  const disabled = readonly || configDisabled;

  const span = resolveDynamic(config.span, formValues) ?? defaultSpan;
  const isRequired = resolveDynamic(config.required, formValues) ?? false;
  const label = resolveDynamic(config.label, formValues);
  const componentProps =
    resolveDynamic(config.componentProps, formValues) || {};
  const contentBefore = resolveDynamic(config.renderBefore, formValues);
  const contentAfter = resolveDynamic(config.renderAfter, formValues);

  // 3. 错误信息处理 (从 RHF 获取错误，传给 Antd Form.Item)
  const errorMsg = errors[config.name]?.message as string | undefined;

  // 4. 组件渲染工厂
  const renderControl = (field: any) => {
    const handleChange = (val: any) => {
      let finalValue = val;
      if (val?.target) {
        finalValue =
          val.target.type === "checkbox"
            ? val.target.checked
            : val.target.value;
      }
      field.onChange(finalValue);
      if (config.emitChange && onFieldChange) {
        onFieldChange(config.name, finalValue, {
          ...formValues,
          [config.name]: finalValue,
        });
      }
    };

    const commonProps = {
      ...field,
      ...componentProps,
      onChange: handleChange,
      disabled,
      placeholder: config.placeholder,
      id: config.name,
      checked:
        config.type === "checkbox" || config.type === "switch"
          ? field.value
          : undefined,
    };

    // Input 类型直接使用 Antd 的 addon
    if (["input", "number", "password"].includes(config.type)) {
      commonProps.addonBefore = contentBefore;
      commonProps.addonAfter = contentAfter;
    }

    switch (config.type) {
      case "input":
        return <Input {...commonProps} />;
      case "password":
        return <Input.Password {...commonProps} />;
      case "number":
        return (
          <InputNumber
            {...commonProps}
            style={{ width: "100%", ...componentProps.style }}
          />
        );
      case "textarea":
        return <TextArea {...commonProps} rows={4} />;
      case "select":
        return <Select options={config.options} {...commonProps} allowClear />;
      case "treeSelect":
        return (
          <TreeSelect treeData={config.options} {...commonProps} allowClear />
        );
      case "date":
        return <DatePicker {...commonProps} style={{ width: "100%" }} />;
      case "range":
        return <RangePicker {...commonProps} style={{ width: "100%" }} />;
      case "switch":
        return <Switch {...commonProps} checked={field.value} />;
      case "checkbox":
        return (
          <Checkbox {...commonProps}>{config.options?.[0]?.label}</Checkbox>
        );
      case "radio":
        return <Radio.Group options={config.options} {...commonProps} />;
      case "custom":
        if (config.component) {
          const CustomComponent = config.component;
          return <CustomComponent {...commonProps} />;
        }
        return <div className="text-red-500">Missing Component</div>;
      default:
        return <Input {...commonProps} />;
    }
  };

  // 5. 判断是否需要 Flex 包裹 (针对非 Input 组件的插槽)
  const isInputWithAddon = ["input", "number", "password"].includes(
    config.type
  );
  const needWrapper = !isInputWithAddon && (contentBefore || contentAfter);

  return (
    <Col span={span}>
      <Form.Item
        label={label}
        name={config.name} // 这里的 name 主要用于 Label 点击聚焦
        required={isRequired} // UI 红星
        validateStatus={errorMsg ? "error" : ""} // 控制红框
        help={errorMsg || config.helperText} // 错误提示 或 帮助文本
        tooltip={config.tooltip}
        style={{ marginBottom: 24 }} // 统一间距
      >
        <div
          className={`w-full ${needWrapper ? "flex items-center gap-2" : ""}`}
        >
          {needWrapper && contentBefore && (
            <div className="flex-shrink-0">{contentBefore}</div>
          )}

          <div className="flex-grow">
            <Controller
              control={control}
              name={config.name}
              render={({ field }) => renderControl(field)}
            />
          </div>

          {needWrapper && contentAfter && (
            <div className="flex-shrink-0">{contentAfter}</div>
          )}
        </div>
      </Form.Item>
    </Col>
  );
};

export default FieldRenderer;
