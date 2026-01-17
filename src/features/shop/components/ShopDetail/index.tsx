"use client";
// 详情、修改、新增
import { CurdActionEnum } from "@src/types/index";
import z from "zod";
import { FormFieldConfig } from "@src/components/YsForm/types";
import { YsDraggableDialog } from "@src/components/YsDraggableDialog/YsDraggableDialog";

interface ShopEditDialogProps {
  isOpen: boolean;
  mode: CurdActionEnum;
  onClose: () => void;
  onSuccess: () => void;
  shopId?: string;
}

// /**
//  * 定义表单结构和验证规则
//  */
// const formSchema = z.object({
//   id: z.string().optional(),
//   userName: z.string().min(1, "请输入用户名"),
//   realName: z.string().min(1, "请输入真实姓名"),
//   email: z.string().email("请输入正确的邮箱"),
//   phone: z.string().min(1, "请输入手机号"),
//   roleIds: z.array(z.number()).min(1, "请选择角色"),
//   verifyCode: z.string().min(4, "请输入验证码"),
//   headUrl: z.string().optional(),
// });

// type FormData = z.infer<typeof formSchema>;

export function ShopEditDialog(props: ShopEditDialogProps) {
  // 2. 字段配置
  // const fields: FormFieldConfig<FormData>[] = [
  //   {
  //     name: "userName",
  //     label: "用户账号",
  //     type: "input",
  //     required: true,
  //     placeholder: "请输入",
  //   },
  //   {
  //     name: "realName",
  //     label: "用户姓名",
  //     type: "input",
  //     required: true,
  //     placeholder: "请输入",
  //   },
  //   {
  //     name: "email",
  //     label: "邮箱",
  //     type: "input",
  //     required: false,
  //   },
  //   {
  //     name: "phone",
  //     label: "手机号",
  //     type: "input",
  //     required: true,
  //   },
  //   {
  //     name: "verifyCode",
  //     label: "验证码",
  //     type: "custom",
  //     required: false,
  //     ifShow: () => props.mode !== CurdActionEnum.view,
  //     component: () => <SmsCaptchaField />,
  //   },
  //   // 现在这里的角色选择后有问题， 明天再改
  //   {
  //     name: "roleIds",
  //     label: "角色",
  //     type: "select",
  //     options: options,
  //     componentProps: {
  //       mode: "multiple",
  //     },
  //     required: true,
  //     // component: () => <RoleSelect mode="multiple" />,
  //   },
  //   {
  //     name: "headUrl",
  //     label: "上传图片",
  //     type: "custom",
  //     required: true,
  //     component: () => <AvatarUploader />,
  //   },
  // ];

  return (
    <>
      <YsDraggableDialog
        visible={props.isOpen}
        onClose={props.onClose}
        title="编辑商家"
      >
        <div>编辑商家</div>
      </YsDraggableDialog>
    </>
  );
}
