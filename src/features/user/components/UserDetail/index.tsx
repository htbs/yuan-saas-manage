import { Button } from "antd";

import SmsCaptchaInput from "@/src/components/ui/CaptchaInput/SmsCaptchaInput";
import { UpdateOrAddUserParams } from "./UserDetail.types";
import {
  getUserInfoApi,
  saveUserApi,
  updateUserApi,
} from "@/src/services/user.service";
import AvatarUploader from "@src/components/ui/avatar/AvatarUploader";
import { YsDraggableDialog } from "@/src/components/YsDraggableDialog/YsDraggableDialog";
import SchemaForm from "@/src/components/YsForm";
import { FormFieldConfig, SchemaFormRef } from "@src/components/YsForm/types";
import z from "zod";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { CurdActionEnum } from "@src/types";
import { useRoles } from "@src/features/role/components/RoleSelect/useRolesSelect";

interface UserEditDialogProps {
  userId?: string;
  isOpen: boolean;
  mode: CurdActionEnum;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * 定义表单结构和验证规则
 */
const formSchema = z.object({
  id: z.string().optional(),
  userName: z.string().min(1, "请输入用户名"),
  realName: z.string().min(1, "请输入真实姓名"),
  email: z.string().email("请输入正确的邮箱"),
  phone: z.string().min(1, "请输入手机号"),
  roleIds: z.array(z.number()).min(1, "请选择角色"),
  verifyCode: z.string().min(4, "请输入验证码"),
  headUrl: z.string().optional(),
});

export function UserEditDialog(props: UserEditDialogProps) {
  const { roles, loading } = useRoles("merchant");

  // 格式化为 Antd Select 需要的 options 格式
  const options = roles.map((role) => ({
    label: role.name,
    value: role.id,
  }));
  const formRef = useRef<SchemaFormRef>(null);
  type FormData = z.infer<typeof formSchema>;
  // 弹窗确定
  const handleOk = () => {
    console.log("提交", formRef.current);
    formRef.current?.submit();
  };
  /**
   * 提交表单
   */
  const handleSubmit = async (data: FormData) => {
    console.log("提交数据：", data);
    const api = props.mode === "add" ? saveUserApi : updateUserApi;
    if (props.mode === "edit") {
      data.id = props.userId;
    }

    const res = await api(data as UpdateOrAddUserParams);
    if (res) {
      props.onClose();
      props.onSuccess();
    }
  };

  /**
   * 发送验证码
   */
  const handleSendCaptcha = async (phone: string) => {
    console.log("手机号：", phone);
    // 模拟 API 调用
    // await api.auth.sendSms({ mobile: phoneValue });
    return new Promise<void>((resolve) => setTimeout(resolve, 800));
  };
  // 封装：内部自己监听表单值
  const SmsCaptchaField = () => {
    const { watch } = useFormContext<FormData>(); // 与外层共用同一个 context
    const phone = watch("phone"); // 实时值
    return (
      <SmsCaptchaInput
        phone={phone}
        onSend={() => handleSendCaptcha(phone)} // 把手机号带出去
      />
    );
  };

  // 2. 字段配置
  const fields: FormFieldConfig<FormData>[] = [
    {
      name: "userName",
      label: "用户账号",
      type: "input",
      required: true,
      placeholder: "请输入",
    },
    {
      name: "realName",
      label: "用户姓名",
      type: "input",
      required: true,
      placeholder: "请输入",
    },
    {
      name: "email",
      label: "邮箱",
      type: "input",
      required: false,
    },
    {
      name: "phone",
      label: "手机号",
      type: "input",
      required: true,
    },
    {
      name: "verifyCode",
      label: "验证码",
      type: "custom",
      required: false,
      ifShow: () => props.mode !== CurdActionEnum.view,
      component: () => <SmsCaptchaField />,
    },
    // 现在这里的角色选择后有问题， 明天再改
    {
      name: "roleIds",
      label: "角色",
      type: "select",
      options: options,
      componentProps: {
        mode: "multiple",
      },
      required: true,
      // component: () => <RoleSelect mode="multiple" />,
    },
    {
      name: "headUrl",
      label: "上传图片",
      type: "custom",
      required: true,
      component: () => <AvatarUploader />,
    },
  ];

  /**
   * 初始化 加载数据
   */
  useEffect(() => {
    // 如果是关闭就返回
    if (!props.isOpen) return;
    // 如果是新增就给表单默认值
    if (props.mode === CurdActionEnum.add) {
      formRef.current?.reset({
        id: "1",
        userName: "",
        realName: "",
        email: "",
        phone: "",
        roleIds: [],
        verifyCode: "",
        headUrl: "",
      });
    }
    // 如果是编辑 ｜ 查看 调用接口给表单赋值
    else if (
      [CurdActionEnum.edit, CurdActionEnum.view].includes(props.mode) &&
      props.userId
    ) {
      getUserInfoApi(props.userId)
        .then((userInfo) => {
          console.log(userInfo, "userInfo");
          requestAnimationFrame(() => {
            formRef.current?.reset(userInfo);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.isOpen, props.mode, props.userId]); // 依赖项数组中放入 isOpen

  return (
    <>
      <YsDraggableDialog
        visible={props.isOpen}
        onClose={props.onClose}
        title={
          props.mode === "add"
            ? "新增用户"
            : props.mode === "edit"
              ? "编辑用户"
              : "详情"
        }
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button type="primary" onClick={handleOk}>
              确定
            </Button>
            <Button onClick={props.onClose}>取消</Button>
          </div>
        }
        initialWidth={800}
        initialHeight={600}
      >
        <SchemaForm
          ref={formRef}
          schema={formSchema}
          fields={fields}
          readonly={props.mode === CurdActionEnum.view}
          onSubmit={handleSubmit}
        ></SchemaForm>
      </YsDraggableDialog>
    </>
  );
}
