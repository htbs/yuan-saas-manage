// 详情、修改、新增
import { useRef, useEffect } from "react";
import { DictInfo, platformOptions } from "../../../types";
import { addDictApi, updateDictApi } from "@src/services/dict.service";
import { Button } from "antd";
import { YsDraggableDialog } from "@/src/components/YsDraggableDialog/YsDraggableDialog";
import { CurdActionEnum } from "@src/types";
import { FormFieldConfig, SchemaFormRef } from "@src/components/YsForm/types";
import SchemaForm from "@/src/components/YsForm";
import z from "zod";

interface DictEditDialogProps {
  dictInfo?: DictInfo;
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
  dictName: z.string().min(1, "请输入字典名称"),
  platform: z.string().min(1, "请输入平台"),
  sort: z.number().default(1),
  remark: z.string().max(200, "请输入备注").optional(),
});

export function DictEditDialog(props: DictEditDialogProps) {
  const formRef = useRef<SchemaFormRef>(null);
  type FormData = z.infer<typeof formSchema>;
  // 弹窗确定
  const handleOk = () => {
    formRef.current?.submit();
  };
  /**
   * 提交表单
   */
  const handleSubmit = async (data: FormData) => {
    const api = props.mode === "add" ? addDictApi : updateDictApi;
    if (props.mode === "edit") {
      data.id = props.dictInfo?.id;
    }

    const res = await api(data as DictInfo);
    if (res) {
      props.onClose();
      props.onSuccess();
    }
  };

  // 2. 字段配置
  const fields: FormFieldConfig<FormData>[] = [
    {
      name: "dictName",
      label: "字典名称",
      type: "input",
      required: true,
      placeholder: "请输入",
    },
    {
      name: "platform",
      label: "所属平台",
      type: "select",
      required: true,
      placeholder: "请选择",
      options: platformOptions,
    },
    {
      name: "sort",
      label: "排序",
      type: "inputNumber",
      required: false,
    },
    {
      name: "remark",
      label: "备注",
      type: "textarea",
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
        id: "",
        dictName: "",
        platform: "",
        sort: 1,
        remark: "",
      });
    }
    // 如果是编辑 ｜ 查看 调用接口给表单赋值
    else if (
      [CurdActionEnum.edit, CurdActionEnum.view].includes(props.mode) &&
      props.dictInfo
    ) {
      requestAnimationFrame(() => {
        formRef.current?.reset(props.dictInfo);
      });
    }
  }, [props.isOpen, props.mode, props.dictInfo]); // 依赖项数组中放入 isOpen

  return (
    <>
      <YsDraggableDialog
        visible={props.isOpen}
        onClose={props.onClose}
        title={
          props.mode === "add"
            ? "新增字典"
            : props.mode === "edit"
              ? "编辑字典"
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
        initialWidth={600}
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
