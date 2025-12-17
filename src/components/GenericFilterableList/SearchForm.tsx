import React from "react";
import { Form, Input, Select, Button, Space, DatePicker, Row, Col } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
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
  // 状态管理：控制是否展开更多筛选
  const [expand, setExpand] = React.useState(false);

  //  关键常量：每行显示 4 个字段 (span=6)，因此两行为 8 个字段
  const fieldsPerRow = 4;
  const collapsibleThreshold = fieldsPerRow * 2;

  //  判断是否需要显示“更多筛选”按钮
  const showCollapseButton = searchFields.length > collapsibleThreshold;

  // 修正样式以解决边距问题
  const rowGutter: [number, number] = [24, 8]; // [水平间距, 垂直间距]

  return (
    <Form
      form={form}
      onFinish={onSearch} // 提交时调用 onSearch
      style={{ padding: 24 }}
    >
      <Row gutter={rowGutter}>
        {/* 动态渲染表单项 */}
        {searchFields.map((field, index) => {
          // 确定是否隐藏：如果索引大于阈值且未展开，则隐藏
          const isHidden = index >= collapsibleThreshold && !expand;

          return (
            <Col
              span={6}
              key={field.key}
              // 使用 style 隐藏，同时保持布局一致性（可选，但更清晰）
              style={{ display: isHidden ? "none" : "block" }}
            >
              <Form.Item
                name={field.key}
                label={field.label}
                rules={field.rules}
              >
                {renderFormField(field)}
              </Form.Item>
            </Col>
          );
        })}

        <Col span={6}>
          <Form.Item>
            <Space size="middle">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                查询
              </Button>
              <Button onClick={onReset} icon={<ReloadOutlined />}>
                重置
              </Button>

              {/* 更多/收起按钮 (仅在需要时显示) */}
              {showCollapseButton && (
                <a onClick={() => setExpand(!expand)}>
                  {expand ? "收起" : "展开"}
                  {expand ? <UpOutlined /> : <DownOutlined />}
                </a>
              )}
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
