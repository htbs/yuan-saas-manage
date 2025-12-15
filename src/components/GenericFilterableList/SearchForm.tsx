import React from "react";
import { Form, Input, Select, Button, Space, DatePicker } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/es/form";
import { FormFieldConfig } from "./types";

interface SearchFormProps<F extends object = Record<string, unknown>> {
  form: FormInstance<F>;
  searchFields: FormFieldConfig[];
  onSearch: () => void;
  onReset: () => void;
}

// 辅助函数
const renderFormField = (field: FormFieldConfig) => {
  // ... 保持 renderFormField 逻辑不变 ...
  // 1. 构造基础的 placeholder 字符串 (仍然是 string)
  const basePlaceholder =
    field.placeholder ||
    `请${field.type === "input" ? "输入" : "选择"}${field.label}`;

  // 2. 构造通用的基础属性
  const commonProps: Record<string, unknown> = {
    allowClear: true,
  };

  // 3. 核心逻辑：根据类型设置 placeholder 属性
  if (field.type === "rangePicker") {
    // 如果是 RangePicker，placeholder 必须是 [string, string]
    commonProps.placeholder = [
      basePlaceholder + " (开始)",
      basePlaceholder + " (结束)",
    ];
  } else {
    // 其他组件，placeholder 保持 string
    commonProps.placeholder = basePlaceholder;
  }

  switch (field.type) {
    case "select":
      return (
        <Select {...commonProps} allowClear>
          {field.options?.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      );
    case "rangePicker":
      const { RangePicker } = DatePicker;
      return <RangePicker {...commonProps} style={{ width: 240 }} />;
    case "datePicker":
      return <DatePicker {...commonProps} />;
    case "input":
    default:
      return <Input {...commonProps} allowClear />;
  }
};

const SearchForm = <F extends object>({
  form,
  searchFields,
  onSearch,
  onReset,
}: SearchFormProps<F>) => {
  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onSearch} // 提交时调用 onSearch
      style={{ marginBottom: 20 }}
    >
      {/* 动态渲染表单项 */}
      {searchFields.map((field) => (
        <Form.Item
          key={field.key}
          name={field.key}
          label={field.label}
          rules={field.rules}
        >
          {renderFormField(field)}
        </Form.Item>
      ))}

      {/* 操作按钮 */}
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            查询
          </Button>
          <Button onClick={onReset} icon={<ReloadOutlined />}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SearchForm;
