// 修改密码

import React, { useState } from "react";
import { Modal, Form, Input } from "antd";
import { ResetPasswordParams } from "./RestPassword.types";
import { updatePasswordApi } from "@src/services";
import { hashPasswordMD5UpperCase } from "@/src/lib/utils/crypto";
export const ResetPasswordModal: React.FC<{
  open: boolean;
  onCancel: () => void;
}> = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (params: ResetPasswordParams) => {
    setLoading(true);
    try {
      params.oldPassword = hashPasswordMD5UpperCase(params.oldPassword);
      params.newPassword = hashPasswordMD5UpperCase(params.newPassword);
      await updatePasswordApi(params);
      onCancel?.();
    } catch (err: unknown) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="修改密码"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden={true}
      closable={false}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="oldPassword"
          label="旧密码"
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};
