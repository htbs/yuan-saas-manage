import { FormFieldConfig } from "@/src/components/GenericFilterableList/types";
import { ColumnType } from "antd/es/table";
import { PageParams, BaseResult, Page } from "@/src/types/constant";

// 搜索表单配置
export const userSearchFields: FormFieldConfig[] = [
  { key: "userName", label: "用户账号", type: "input" },
  { key: "phone", label: "用户手机号", type: "input" },
  {
    key: "status",
    label: "用户状态",
    type: "select",
    options: [
      { value: "active", label: "启用" },
      { value: "suspended", label: "禁用" },
    ],
  },
];

// 表格列配置
export const baseColumns: ColumnType<SysUserDataList>[] = [
  { title: "用户账号", dataIndex: "userName", key: "userName" },
  { title: "用户姓名", dataIndex: "realName", key: "realName" },
  { title: "用户手机号", dataIndex: "phone", key: "realName" },
  { title: "创建日期", dataIndex: "createAt", key: "createdAt" },
  { title: "更新日期", dataIndex: "updateAt", key: "updateAt" },
  { title: "状态", dataIndex: "status", key: "status" },
  { title: "操作", dataIndex: "action", key: "action" },
];

/**
 * 系统用户列表筛选参数
 */
export interface SysUserFilterListParams extends PageParams {
  userName?: string;
  phone?: string;
  status?: number;
}

/**
 * 系统用户列表数据
 */
export interface SysUserDataList extends BaseResult {
  userName: string; // 用户名
  email: string; // 邮箱
  phone: string; // 手机号
  realName: string; // 真实姓名
  status: string; // 状态
  deptId: number; // 部门ID
  deptName: string; // 部门名称
}

/**
 * 系统用户列表数据
 */
export type PageSysUser = Page<SysUserDataList>;
