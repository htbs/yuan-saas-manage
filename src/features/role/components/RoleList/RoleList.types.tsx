import { FormFieldConfig } from "@/src/components/GenericFilterableList/types";
import { ColumnType } from "antd/es/table";
import { RoleInfo } from "../../types";
import { Tooltip } from "antd";

// 搜索表单配置
export const searchFields: FormFieldConfig[] = [
  { key: "name", label: "角色名称", type: "input" },
];

// 表格列配置
export const baseColumns: ColumnType<RoleInfo>[] = [
  { title: "角色名称", dataIndex: "name", key: "name" },
  { title: "所述部门", dataIndex: "deptName", key: "deptName" },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
    width: 180,
    ellipsis: {
      showTitle: false,
    },
    render: (address) => (
      <Tooltip placement="topLeft" title={address}>
        {address}
      </Tooltip>
    ),
  },
  { title: "创建日期", dataIndex: "createAt", key: "createdAt" },
  { title: "更新日期", dataIndex: "updateAt", key: "updateAt" },
  {
    title: "操作人",
    dataIndex: "updateBy",
    key: "updateBy",
  },
  { title: "操作", dataIndex: "action", key: "action", width: 170 },
];
