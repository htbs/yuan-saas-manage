import React from "react";
import { useForm, FieldValues, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Row } from "antd"; // 引入 Antd 布局组件
import { SchemaFormProps } from "./types";
import FieldRenderer from "./FieldRenderer";

const SchemaForm = <T extends FieldValues>({
                                               schema,
                                               fields,
                                               defaultValues,
                                               onSubmit,
                                               onFieldChange,
                                               children,
                                               className = "",
                                               // 布局默认参数
                                               layout = "vertical", // 默认 Label 在顶部
                                               gridCols = 1, // 默认一列
                                               gutter = 16,  // 默认间距
                                               labelCol,
                                               wrapperCol,
                                           }: SchemaFormProps<T>) => {

    // 1. 初始化 RHF
    const methods = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as any,
    });

    const { handleSubmit } = methods;

    // 2. 计算默认的 span (Antd 总共24格)
    // 如果 gridCols=2, 则每个默认 span=12; gridCols=3, span=8
    const defaultSpan = 24 / gridCols;

    return (
        <FormProvider {...methods}>
            {/*
         Antd Form 组件：
         component="form": 渲染为原生 <form> 标签
         layout: 控制 label 位置 (vertical | horizontal | inline)
         onFinish: 我们这里用原生 onSubmit 代替
      */}
            <Form
                component="form"
                layout={layout}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
                onSubmitCapture={handleSubmit(onSubmit)} // 绑定 RHF 提交
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

                {/* 底部插槽 (按钮区) */}
                <div className="mt-2">
                    {children}
                </div>
            </Form>
        </FormProvider>
    );
};

export default SchemaForm;