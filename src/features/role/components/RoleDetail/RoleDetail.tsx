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

import { useRoleStore } from "../../stores/useRoleStore";
import { UpdateOrAddRoleParams } from "../../types";
import {
  getRoleByIdApi,
  saveRoleApi,
  updateRoleApi,
} from "@/src/services/role.service";
import { useEffect } from "react";

interface RoleDetailProps {
  id?: string;
}
const Title = Typography.Title;
export function RoleDetail(props: RoleDetailProps) {
  const setView = useRoleStore((state) => state.setView);
  const id = useRoleStore((state) => state.editId);
  const view = useRoleStore((state) => state.view);
  const [form] = Form.useForm();

  useEffect(() => {
    if (view && id) {
      (async () => {
        const roleInfo = await getRoleByIdApi(id);
        form.setFieldsValue(roleInfo);
      })();
    }
  }, [view, id, form]);

  const onFinish = async (params: UpdateOrAddRoleParams) => {
    try {
      if (view && view === "edit") {
        if (!id) {
          message.error("请选择要编辑的角色");
          return;
        }
        params.id = id;
        // 编辑用户
        await updateRoleApi(params);
      } else if (view && view === "add") {
        // 新增用户
        await saveRoleApi(params);
      }
      setView("list");
    } catch (err: unknown) {}
  };

  return (
    <div className="w-full!">
      <Card>
        <Title level={5}>基本详情</Title>
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
                label="角色名称"
                name="name"
                rules={[
                  { required: true, message: "请输入" },
                  {
                    max: 8,
                    min: 2,
                    message: "角色名称必须在2-8个字之间",
                  },
                ]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>

              <Form.Item
                label="角色描述"
                name="description"
                rules={[{ required: true, message: "请输入" }]}
              >
                <Input placeholder="请输入角色描述" />
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
