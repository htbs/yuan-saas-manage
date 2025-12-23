import {
  Form,
  Typography,
  Button,
  Row,
  Col,
  Input,
  Space,
  Card,
  message,
} from "antd";

import SmsCaptchaInput from "@/src/components/ui/CaptchaInput/SmsCaptchaInput";
import { useUserStore } from "../../stores/useUserStore";
import { UpdateOrAddUserParams } from "./UserDetail.types";
import RoleSelect from "@src/features/role/components/RoleSelect/RoleSelect";
import {
  updateUserApi,
  saveUserApi,
  getUserInfoApi,
} from "@/src/services/user.service";
import AvatarUploader from "@src/components/ui/avatar/AvatarUploader";
import { useEffect } from "react";

interface UserDetailProps {
  id?: string;
}
const Title = Typography.Title;
export function UserDetail(props: UserDetailProps) {
  const setView = useUserStore((state) => state.setView);
  const id = useUserStore((state) => state.editId);
  const view = useUserStore((state) => state.view);
  const [form] = Form.useForm();

  // 监听手机号字段，用于传给验证码组件
  const phoneValue = Form.useWatch("phone", form);

  const handleSendCaptcha = async () => {
    // 模拟 API 调用
    // await api.auth.sendSms({ mobile: phoneValue });
    return new Promise<void>((resolve) => setTimeout(resolve, 800));
  };

  useEffect(() => {
    if (view && id) {
      (async () => {
        const userInfo = await getUserInfoApi(id);
        form.setFieldsValue(userInfo);
      })();
    }
  }, [view, id, form]);

  const onFinish = async (params: UpdateOrAddUserParams) => {
    try {
      if (view && view === "edit") {
        if (!id) {
          message.error("请选择要编辑的用户");
          return;
        }
        params.id = id;
        // 编辑用户
        await updateUserApi(params);
      } else if (view && view === "add") {
        // 新增用户
        await saveUserApi(params);
      }
      setView("list");
    } catch (err: unknown) {}
  };

  return (
    <div>
      <Card>
        <Title level={5}>用户基本详情</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          disabled={view === "detail"}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="用户账号"
                name="userName"
                rules={[
                  { required: true, message: "请输入" },
                  {
                    pattern: /^[A-Za-z0-9]{6,18}$/,
                    message: "账号必须为 6-18 位的数字或字母",
                  },
                ]}
              >
                <Input placeholder="请输入用户账号" />
              </Form.Item>

              <Form.Item
                label="用户姓名"
                name="realName"
                rules={[{ required: true, message: "请输入" }]}
              >
                <Input placeholder="请输入用户姓名" />
              </Form.Item>

              <Form.Item
                label="电子邮箱"
                name="email"
                rules={[
                  { required: false },
                  { type: "email", message: "请输入正确的邮箱格式" },
                ]}
              >
                <Input placeholder="请输入电子邮箱" />
              </Form.Item>
              <Form.Item
                label="手机号"
                name="phone"
                rules={[
                  { required: true, message: "请输入" },
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: "请输入正确的手机号",
                  },
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
              {view !== "detail" && (
                <Form.Item
                  name="verifyCode"
                  label="验证码"
                  rules={[{ required: true, message: "请输入验证码" }]}
                >
                  <SmsCaptchaInput
                    phone={phoneValue}
                    onSend={handleSendCaptcha}
                  ></SmsCaptchaInput>
                </Form.Item>
              )}

              <Title level={5}>业务信息</Title>
              <Form.Item
                label="角色"
                name="roleIds"
                rules={[{ required: true, message: "请选择" }]}
              >
                <RoleSelect
                  placeholder="请选择角色"
                  mode="multiple"
                  disabled={view === "detail"}
                ></RoleSelect>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="上传图片"
                name="headUrl"
                rules={[{ required: true, message: "请上传图片" }]}
              >
                <AvatarUploader needCrop={true} />
              </Form.Item>
            </Col>
          </Row>

          {/* ---------- 底部：提交按钮 ---------- */}
          <Row>
            <Col span={24} style={{ textAlign: "center", marginTop: 24 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  onClick={() => setView("list")}
                  disabled={false}
                >
                  返回
                </Button>
                <Button type="primary" htmlType="submit" size="large">
                  提交
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
