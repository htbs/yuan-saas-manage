// 详情、修改、新增
import DetailHeader from "@src/components/layout/Detailheader/index";
import { useDictItemStore } from "../../../stores/useDictItemStore";
import { useState, useEffect } from "react";
import { DictItemInfo } from "../../../types";
import { addDictItemApi, updateDictItemApi } from "@src/services/dict.service";
import message from "antd/lib/message";
import { Form, Input } from "antd";

interface DictDetailProps {
  id?: string;
  dictType: string; // 字典类型
  dictLabel: string; // 项名称
  dictValue: string; // 项值
  status: string; // 状态
  sort: number; // 排序
  remark: string; // 备注
}

export function DictItemDetail(props: DictDetailProps) {
  const [loading, setLoading] = useState(false);

  // 详情ID
  const dictId = useDictItemStore((state) => state.editId);
  // 设置详情视图
  const setView = useDictItemStore((state) => state.setView);
  // 详情视图
  const view = useDictItemStore((state) => state.view);
  // 绑定form
  const [form] = Form.useForm();

  useEffect(() => {
    if (view && dictId) {
      form.setFieldsValue(props);
    }
  }, [view, dictId, form, props]);

  const handleSubmit = async (params: DictItemInfo) => {
    try {
      if (view && view === "edit") {
        if (!dictId) {
          message.error("请选择要编辑的字典项");
          return;
        }
        params.id = dictId;
        // 编辑用户
        await updateDictItemApi(params);
      } else if (view && view === "add") {
        // 新增用户
        await addDictItemApi(params);
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
