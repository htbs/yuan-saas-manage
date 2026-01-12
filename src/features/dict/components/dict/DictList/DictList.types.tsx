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
      { value: "COMMON", label: "未签约" },
      { value: "SIGNED", label: "已签约" },
      { value: "EXPIRED", label: "已到期" },
    ],
  },
];

// 表格列配置
export const baseColumns: ColumnType<DictInfo>[] = [
  { title: "店铺编号", dataIndex: "code", key: "code" },
  { title: "店铺名称", dataIndex: "name", key: "name" },
  {
    title: "店铺类型",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "签约状态",
    dataIndex: "signedStatus",
    key: "depsignedStatustName",
    render: (value) => {
      if (value === "SIGNED") return "已签约";
      if (value === "UNSIGNED") return "未签约";
      if (value === "EXPIRED") return "已到期";
    },
  },
  { title: "签约时间", dataIndex: "signedStartAt", key: "signedStartAt" },
  { title: "到期时间", dataIndex: "signedEndAt", key: "signedEndAt" },
  { title: "创建时间", dataIndex: "createAt", key: "createAt" },
  { title: "锁定状态", dataIndex: "lockStatus", key: "lockStatus" },
  { title: "操作", dataIndex: "action", key: "action", width: 170 },
];
