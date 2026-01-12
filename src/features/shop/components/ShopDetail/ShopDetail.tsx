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


  return <div>
      {/* 头部组件 */}
       <DetailHeader
          mode={view}
          title='新增'
          onBack={handleBack}
          onSave={handleSave}
          loading={loading}
      />



  </div>
}



