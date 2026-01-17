import { Button } from "antd";

import { UpdateOrAddRoleParams } from "../../types";
import {
  getRoleByIdApi,
  saveRoleApi,
  updateRoleApi,
} from "@/src/services/role.service";
import { useRef, useEffect } from "react";

import { YsDraggableDialog } from "@/src/components/YsDraggableDialog/YsDraggableDialog1";
import SchemaForm from "@src/components/YsForm/index";
import { FormFieldConfig, SchemaFormRef } from "@src/components/YsForm/types";
import { z } from "zod";

interface RoleDetailProps {
  roleId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "add" | "edit" | "detail";
}

// 1. Zod Schema, 校验规则
const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "请填写角色名称").max(8, "角色名称不能超过8个字符"),
  description: z.string().max(200, "角色描述不能超过200个字符").optional(),
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
  const handleFormSubmit = async (data: UpdateOrAddRoleParams) => {
    const api = props.mode === "add" ? saveRoleApi : updateRoleApi;
    if (props.mode === "add") {
      data.id = props.roleId;
    }

    const res = await api(data);
    if (res) {
      props.onClose();
      props.onSuccess();
    }
  };

  type FormData = z.infer<typeof formSchema>;

  // 2. 字段配置
  const fields: FormFieldConfig<FormData>[] = [
    {
      name: "name",
      label: "角色名称",
      type: "input",
      // required: true 只是为了显示红星，实际校验看 Zod
      required: true,
      placeholder: "请输入",
    },
    {
      name: "description",
      label: "角色描述",
      type: "input",
      required: false,
    },
  ];

  // 监听 isOpen 变化
  useEffect(() => {
    if (!props.isOpen || !props.roleId || props.mode === "add") return;

    // 调用接口获取数据并回填
    getRoleByIdApi(props.roleId).then((roleInfo) => {
      requestAnimationFrame(() => {
        formRef.current?.reset(roleInfo);
      });
    });
  }, [props.isOpen, props.roleId, props.mode]); // 依赖项数组中放入 isOpen

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
            <Button type="primary" onClick={handleOk}>
              确定
            </Button>
            <Button onClick={props.onClose}>取消</Button>
          </div>
        }
      >
        <SchemaForm
          ref={formRef}
          schema={formSchema}
          fields={fields}
          readonly={props.mode === "detail"}
          onSubmit={handleFormSubmit}
          layout="horizontal"
        />
      </YsDraggableDialog>
    </div>
  );
}
