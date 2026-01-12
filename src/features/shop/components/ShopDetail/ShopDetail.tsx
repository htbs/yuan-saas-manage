"use client";
// 详情、修改、新增
import DetailHeader from '@src/components/layout/Detailheader/index'
import { useShopStore } from "../../stores/useShopStore";
import SchemaForm from "@src/components/YsForm/index"; // 引入你封装的表单
import { FormFieldConfig } from "@src/components/YsForm/types";
import ColorPicker from "@src/components/YsColorPicker/ColorPicker"; // 自定义组件
import { UserOutlined, PayCircleOutlined } from "@ant-design/icons"; // Antd 图标
import React, { useState } from "react";
import { z } from "zod";
import { Button, Radio, Divider } from "antd";

// 1. Zod Schema
const formSchema = z.object({
    fullName: z.string().min(2, "姓名必填"),
    email: z.string().email("邮箱格式有误"),
    phone: z.string().optional(),
    department: z.string(),
    isRemote: z.boolean(),
});
type FormData = z.infer<typeof formSchema>;

export function ShopDetail(props) {
    const [loading, setLoading] = useState(false);
    // 假设当前是从路由获取的参数，这里模拟为 'add'
    const currentMode = 'add';

    const handleBack = () => {
        setView('list');
    };

    const handleSave = () => {
        setLoading(true);
        // 模拟异步请求
        setTimeout(() => {
            setLoading(false);
            console.log('保存成功');
            setView('list');
        }, 2000);
    };
  // 详情ID
  const shopId = useShopStore((state) => state.editId);
  // 设置详情视图
  const setView = useShopStore((state) => state.setView);
  // 详情视图
  const view = useShopStore((state) => state.view);

    const [layoutMode, setLayoutMode] = useState<"horizontal" | "vertical">("vertical");

    // 2. 字段配置
    const fields: FormFieldConfig<FormData>[] = [
        {
            name: "fullName",
            label: "员工姓名",
            type: "input",
            // required: true 只是为了显示红星，实际校验看 Zod
            required: true,
            placeholder: "请输入",
        },
        {
            name: "email",
            label: "公司邮箱",
            type: "input",
            required: true,
            renderAfter: "@company.com"
        },
        {
            name: "phone",
            label: "联系电话",
            type: "input",
            // 单独控制 span：这一行我想要两个输入框，所以各占 12 (总24)
            span: 12,
        },
        {
            name: "department",
            label: "所属部门",
            type: "select",
            span: (data) => {
                console.log(data);
                return 12
            },
            options: [
                { label: "研发部", value: "rd" },
                { label: "市场部", value: "mkt" }
            ]
        },
        {
            name: "isRemote",
            label: "是否远程",
            type: "switch",
            tooltip: "远程办公需要额外审批"
        }
    ];

  return <div>
      {/* 头部组件 */}
       <DetailHeader
          mode={view}
          title='新增'
          onBack={handleBack}
          onSave={handleSave}
          loading={loading}
      />
      <SchemaForm<FormData>
          className='mt-5!'
          schema={formSchema}
          fields={fields}
          onSubmit={(data) => console.log("Submit:", data)}
          gridCols={1}        // 默认每行 1 个控件 (span 24)
          gutter={24}         // 控件间距
          layout='horizontal'
          // 仅当 layout="horizontal" 时，控制 label 和 input 的宽度比例
          // labelCol={{ span: 6 }}
          // wrapperCol={{ span: 18 }}
      >
          <div className="flex justify-end gap-4">
              <Button>重置</Button>
              <Button type="primary" htmlType="submit">提交表单</Button>
          </div>
      </SchemaForm>


  </div>
}



