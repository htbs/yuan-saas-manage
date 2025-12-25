import { FormFieldConfig } from "@/src/components/GenericFilterableList/types";
import { ColumnType } from "antd/es/table";
import { ShopListInfo } from "../../types";

// 搜索表单配置
export const searchFields: FormFieldConfig[] = [
  { key: "name", label: "店铺名称", type: "input" },
  { key: "code", label: "店铺编号", type: "input" },
  {
    key: "signedStatus",
    label: "签约状态",
    type: "select",
    options: [
      { value: "suspended", label: "未签约" },
      { value: "active", label: "已签约" },
      { value: "suspended1", label: "已到期" },
    ],
  },
];

// 表格列配置
export const baseColumns: ColumnType<ShopListInfo>[] = [
  { title: "店铺编号", dataIndex: "code", key: "code" },
  { title: "店铺名称", dataIndex: "name", key: "name" },
  { title: "店铺类型", dataIndex: "type", key: "type" },
  {
    title: "签约状态",
    dataIndex: "signedStatus",
    key: "depsignedStatustName",
    render: (value) => {
      if (value === "Y") return "已签约";
      if (value === "N") return "未签约";
      if (value === "U") return "已到期";
    },
  },
  { title: "签约时间", dataIndex: "signedStartAt", key: "signedStartAt" },
  { title: "到期时间", dataIndex: "signedEndAt", key: "signedEndAt" },
  { title: "创建时间", dataIndex: "createAt", key: "createAt" },
  { title: "锁定状态", dataIndex: "lockStatus", key: "lockStatus" },
  { title: "操作", dataIndex: "action", key: "action", width: 170 },
];
