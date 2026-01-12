// 详情、修改、新增
import DetailHeader from "@src/components/layout/Detailheader/index";
import { useShopStore } from "../../stores/useShopStore";
import { useState, useEffect } from "react";
import { ShopInfo, UpdateOrAddShopInfo } from "../../types";
import {
  addShopApi,
  findShopByIdApi,
  updateShopApi,
} from "@src/services/shop.service";
import message from "antd/lib/message";
import { Form, Input } from "antd";

interface ShopDetailProps {
  id?: string;
}

export function DictDetail(props: ShopDetailProps) {
  const [loading, setLoading] = useState(false);

  // 详情ID
  const shopId = useShopStore((state) => state.editId);
  // 设置详情视图
  const setView = useShopStore((state) => state.setView);
  // 详情视图
  const view = useShopStore((state) => state.view);

  // 绑定form
  const [form] = Form.useForm();

  useEffect(() => {
    if (view && shopId) {
      (async () => {
        const shopInfo: ShopInfo = await findShopByIdApi(shopId);
        // 这里通过查出来的信息绑定form
        form.setFieldsValue(shopInfo);
      })();
    }
  }, [view, shopId, form]);

  const handleSubmit = async (params: UpdateOrAddShopInfo) => {
    try {
      if (view && view === "edit") {
        if (!shopId) {
          message.error("请选择要编辑的角色");
          return;
        }
        params.id = shopId;
        // 编辑用户
        await updateShopApi(params);
      } else if (view && view === "add") {
        // 新增用户
        await addShopApi(params);
      }
      setView("list");
    } catch (err: unknown) {}
  };

  const handleBack = () => {
    setView("list");
  };

  const handleSave = () => {
    form.submit();
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* 头部组件 */}
      <DetailHeader
        mode={view}
        onBack={handleBack}
        onSave={handleSave}
        loading={loading}
      />
      <Form
        form={form}
        onFinish={handleSubmit} // 校验通过后的“终点站”
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "请输入名称" }]}
        >
          <Input />
        </Form.Item>
        {/* ... */}
      </Form>
    </div>
  );
}
