import { FormFieldConfig } from "@/src/components/GenericFilterableList/types";
import { ColumnType } from "antd/es/table";
import { DictInfo, platformOptions } from "../../../types";
import { parseUserInfo } from "@src/lib/utils";

// 搜索表单配置
export const searchFields: FormFieldConfig[] = [
  { key: "dictName", label: "字典名称", type: "input" },
  { key: "dictType", label: "字典类型", type: "input" },
  {
    key: "platform",
    label: "所属平台",
    type: "select",
    options: platformOptions,
  },
];

// 表格列配置
export const baseColumns: ColumnType<DictInfo>[] = [
  { title: "字典编号", dataIndex: "dictCode", key: "dictCode" },
  { title: "字典名称", dataIndex: "dictName", key: "dictName" },
  {
    title: "所属平台",
    dataIndex: "platform",
    key: "platform",
    render: (value) => {
      if (value === "COMMON") return "全平台";
      if (value === "PLATFORM") return "元识管理端";
      if (value === "SHOP") return "商家端";
      if (value === "USER") return "用户端";
    },
  },
  {
    title: "字典状态",
    dataIndex: "lockStatus",
    key: "lockStatus",
    render: (value) => {
      if (value === "Y") return "禁用";
      if (value === "N") return "启用";
    },
  },
  {
    title: "系统默认",
    dataIndex: "isSysDefault",
    key: "isSysDefault",
    render: (value) => {
      if (value === "Y") return "是";
      if (value === "N") return "否";
    },
  },
  { title: "备注", dataIndex: "remark", key: "remark" },
  { title: "创建时间", dataIndex: "createAt", key: "createAt" },
  { title: "修改时间", dataIndex: "updateAt", key: "updateAt" },
  {
    title: "操作人",
    dataIndex: "updateBy",
    key: "updateBy",
    render: (value) => parseUserInfo(value)?.userName || "",
  },
  { title: "操作", dataIndex: "action", key: "action", width: 170 },
];
