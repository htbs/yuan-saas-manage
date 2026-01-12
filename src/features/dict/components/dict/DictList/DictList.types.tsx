import { FormFieldConfig } from "@/src/components/GenericFilterableList/types";
import { ColumnType } from "antd/es/table";
import { DictInfo } from "../../../types";

// 搜索表单配置
export const searchFields: FormFieldConfig[] = [
  { key: "dictName", label: "字典名称", type: "input" },
  { key: "dictType", label: "字典类型", type: "input" },
  {
    key: "platform",
    label: "所属平台",
    type: "select",
    options: [
      { value: "YUAN_SHI", label: "元识管理端" },
      { value: "MERCHANT", label: "商家端" },
      { value: "CLIENT", label: "用户端" },
    ],
  },
];

// 表格列配置
export const baseColumns: ColumnType<DictInfo>[] = [
  { title: "字典编号", dataIndex: "code", key: "code" },
  { title: "字典名称", dataIndex: "name", key: "name" },
  {
    title: "字典类型",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "字典状态",
    dataIndex: "status",
    key: "status",
    render: (value) => {
      if (value === "Y") return "禁用";
      if (value === "N") return "启用";
    },
  },
  { title: "备注", dataIndex: "remark", key: "remark" },
  { title: "创建时间", dataIndex: "createAt", key: "createAt" },
  { title: "操作", dataIndex: "action", key: "action", width: 170 },
];
