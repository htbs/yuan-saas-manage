import { FormFieldConfig } from "@/src/components/GenericFilterableList/types";
import { ColumnType } from "antd/es/table";
import { DictItemInfo } from "../../../types";

// 搜索表单配置
export const searchFields: FormFieldConfig[] = [
  { key: "dictLabel", label: "字典标签", type: "input" },
];

// 表格列配置
export const baseColumns: ColumnType<DictItemInfo>[] = [
  { title: "字典标签", dataIndex: "dictLabel", key: "dictLabel" },
  { title: "字典键值", dataIndex: "dictValue", key: "dictValue" },
  {
    title: "字典排序",
    dataIndex: "sort",
    key: "sort",
  },
  {
    title: "状态",
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
