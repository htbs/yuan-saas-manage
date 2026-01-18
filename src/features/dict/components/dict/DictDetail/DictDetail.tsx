// 详情、修改、新增
import DetailHeader from "@src/components/layout/Detailheader/index";
import { useState, useEffect } from "react";
import { DictInfo } from "../../../types";
import {
  addDictApi,
  findDictByIdApi,
  updateDictApi,
} from "@src/services/dict.service";
import message from "antd/lib/message";
import { Form, Input } from "antd";

interface DictDetailProps {
  id?: string;
}

export function DictDetail(props: DictDetailProps) {
  // const [loading, setLoading] = useState(false);

  // // 详情ID
  // const dictId = useDictStore((state) => state.editId);
  // // 设置详情视图
  // const setView = useDictStore((state) => state.setView);
  // // 详情视图
  // const view = useDictStore((state) => state.view);
  // // 绑定form
  // const [form] = Form.useForm();

  // useEffect(() => {
  //   if (view && dictId) {
  //     (async () => {
  //       const dictInfo: DictInfo = await findDictByIdApi(dictId);
  //       // 这里通过查出来的信息绑定form
  //       form.setFieldsValue(dictInfo);
  //     })();
  //   }
  // }, [view, dictId, form]);

  // const handleSubmit = async (params: DictInfo) => {
  //   try {
  //     if (view && view === "edit") {
  //       if (!dictId) {
  //         message.error("请选择要编辑的字典项");
  //         return;
  //       }
  //       params.id = dictId;
  //       // 编辑用户
  //       await updateDictApi(params);
  //     } else if (view && view === "add") {
  //       // 新增用户
  //       await addDictApi(params);
  //     }
  //     setView("list");
  //   } catch (err: unknown) {}
  // };

  // const handleBack = () => {
  //   setView("list");
  // };

  // const handleSave = () => {
  //   form.submit();
  // };

  return (
    <div className="p-6 bg-gray-50">
      {/* 头部组件 */}
      {/* <DetailHeader
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
      </Form> */}
      字典详情组件
    </div>
  );
}
