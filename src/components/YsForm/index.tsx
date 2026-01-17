import React, { useImperativeHandle, forwardRef } from "react";
import { useForm, FieldValues, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Row } from "antd"; // 引入 Antd 布局组件
import { SchemaFormProps, SchemaFormRef } from "./types";
import FieldRenderer from "./FieldRenderer";

const SchemaFormInner = <T extends FieldValues>(
  props: SchemaFormProps<T>,
  ref: React.Ref<SchemaFormRef>,
) => {
  const {
    schema,
    fields,
    defaultValues,
    onSubmit,
    onFieldChange,
    layout = "vertical",
    gridCols = 1,
    gutter = 16,
    labelCol,
    wrapperCol,
    className = "",
    readonly = false,
    children, // 如果还需要插槽
  } = props;

  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const { handleSubmit, reset } = methods; // 取出 reset
  // 2. 向父组件暴露方法
  useImperativeHandle(ref, () => ({
    submit: () => {
      // handleSubmit(onSubmit) 返回的是一个函数，
      // 我们这里直接调用它，React Hook Form 会自动触发校验
      // 如果校验通过，就会执行 props.onSubmit
      handleSubmit(onSubmit)();
    },
    reset: (data) => reset(data),
  }));

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
              readonly={readonly}
              onFieldChange={onFieldChange}
              defaultSpan={24 / gridCols}
            />
          ))}
        </Row>
        {children}
      </Form>
    </FormProvider>
  );
};

// 3. 使用 forwardRef 并强制转换类型
// (这是解决 TypeScript 泛型丢失问题的标准 Hack 写法)
const SchemaForm = forwardRef(SchemaFormInner) as <T extends FieldValues>(
  props: SchemaFormProps<T> & { ref?: React.Ref<SchemaFormRef> },
) => React.ReactElement;

export default SchemaForm;
