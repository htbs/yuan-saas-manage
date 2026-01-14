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
import { useRef } from "react";

import { YsDraggableDialog } from "@src/components/YsDraggableDialog/YsDraggableDialog";
import SchemaForm from "@src/components/YsForm/index";
import { FormFieldConfig, SchemaFormRef } from "@src/components/YsForm/types";
import { z } from "zod";

interface RoleDetailProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "add" | "edit" | "detail";
}

// 1. Zod Schema, 校验规则
const formSchema = z.object({
  fullName: z.string().min(2, "姓名必填"),
  email: z.string().email("邮箱格式有误"),
  phone: z.string().optional(),
  department: z.string(),
  isRemote: z.boolean(),
});

export function RoleEditDialog(props: RoleDetailProps) {
  const formRef = useRef<SchemaFormRef>(null);
  // 1. 创建 Ref
  const handleOk = () => {
    // 3. 点击 Modal 确定按钮时，调用子组件的 submit
    // 这会自动触发 RHF 的校验，如果有错误，表单会显示红字，
    // 且不会执行下面的 handleFormSubmit
    formRef.current?.submit();
  };

  // 4. 表单验证通过后，才会执行这个回调
  const handleFormSubmit = (data: any) => {
    console.log("表单校验通过，数据：", data);
  };

  type FormData = z.infer<typeof formSchema>;

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
      renderAfter: "@company.com",
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
        return 12;
      },
      options: [
        { label: "研发部", value: "rd" },
        { label: "市场部", value: "mkt" },
      ],
    },
    {
      name: "isRemote",
      label: "是否远程",
      type: "switch",
      tooltip: "远程办公需要额外审批",
    },
  ];

  return (
    <div>
      <YsDraggableDialog
        visible={props.isOpen}
        title={
          props.mode === "add"
            ? "新增角色"
            : props.mode === "edit"
            ? "编辑角色"
            : "详情"
        }
        onClose={props.onClose}
        initialWidth={600}
        initialHeight={400}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button>重置</Button>
            <Button type="primary" onClick={handleOk}>
              提交表单
            </Button>
          </div>
        }
      >
        <SchemaForm
          ref={formRef}
          schema={formSchema}
          fields={fields}
          // readonly={true}
          onSubmit={handleFormSubmit}
          layout="horizontal"
        />
      </YsDraggableDialog>
    </div>
  );
}
