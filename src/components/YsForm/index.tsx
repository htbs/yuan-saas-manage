import React, { useImperativeHandle, forwardRef } from "react";
import { useForm, FieldValues, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Row } from "antd"; // 引入 Antd 布局组件
import { SchemaFormProps, SchemaFormRef } from "./types";
import FieldRenderer from "./FieldRenderer";

const SchemaFormInner = <T extends FieldValues>(
    props: SchemaFormProps<T>,
    ref: React.Ref<SchemaFormRef>
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
        children, // 如果还需要插槽
    } = props;

    const methods = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as any,
    });

    const { handleSubmit } = methods;

    // 2. 核心：向父组件暴露 submit 方法
    useImperativeHandle(ref, () => ({
        submit: () => {
            // handleSubmit(onSubmit) 返回的是一个函数，
            // 我们这里直接调用它，React Hook Form 会自动触发校验
            // 如果校验通过，就会执行 props.onSubmit
            handleSubmit(onSubmit)();
        },
    }));

    return (
        <FormProvider {...methods}>
            <Form
                component="form"
                layout={layout}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
                // 注意：这里不需要 onSubmitCapture 了，因为是外部触发
                // 但为了兼容回车提交，保留也无妨
                onSubmitCapture={handleSubmit(onSubmit)}
                className={className}
            >
                <Row gutter={gutter}>
                    {fields.map((fieldConfig) => (
                        <FieldRenderer
                            key={fieldConfig.name}
                            config={fieldConfig}
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
    props: SchemaFormProps<T> & { ref?: React.Ref<SchemaFormRef> }
) => React.ReactElement;

export default SchemaForm;