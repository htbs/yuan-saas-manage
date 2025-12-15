"use client";
import { Button } from "antd";
import { ColumnType } from "antd/es/table";
import React from "react";
import { useRouter } from "next/navigation";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";
import { FormFieldConfig } from "@/src/components/GenericFilterableList/types";
import {
  FilterListParams,
  MerchantListData,
} from "@/src/features/merchant/types";
import { findPageList } from "@/src/services/merchant.service";
// 2. 定义数据获取逻辑 (fetcher)
// ------------------------------------
const fetchUserList = async (params: FilterListParams) => {
  console.log("params", params);
  // 实际调用您封装的 request 模块
  const result = await findPageList(params);

  // 假设 API 直接返回 { list: T[], total: number }
  return { list: result.content, total: result.totalElements };
};

// ------------------------------------
// 3. 定义组件配置
// ------------------------------------

// 搜索表单配置
const userSearchFields: FormFieldConfig[] = [
  { key: "userName", label: "用户名称", type: "input" },
  { key: "email", label: "邮箱", type: "input" },
  {
    key: "role",
    label: "角色",
    type: "select",
    options: [
      { value: "admin", label: "管理员" },
      { value: "user", label: "普通用户" },
    ],
  },
];

// 表格列配置
const userColumns: ColumnType<MerchantListData>[] = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "姓名", dataIndex: "userName", key: "userName" },
  { title: "邮箱", dataIndex: "email", key: "email" },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (status: number) => (status === 1 ? "启用" : "禁用"),
  },
  { title: "注册日期", dataIndex: "createdAt", key: "createdAt" },
  {
    title: "操作",
    key: "action",
    render: () => <Button type="link">编辑</Button>,
  },
];

export default function MerchantList() {
  const router = useRouter();
  const handleAdd = () => {
    router.push("/merchant/add");
  };
  return (
    <div>
      <GenericFilterableList<MerchantListData, FilterListParams>
        columns={userColumns}
        searchFields={userSearchFields}
        fetcher={fetchUserList}
      />
    </div>
  );
}
