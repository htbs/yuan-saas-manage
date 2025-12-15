import React from "react";
import { Table, Form, Card } from "antd";
import { GenericListProps } from "./types";
import { useListManager } from "./useListManager";
import SearchForm from "./SearchForm";

// 核心通用列表组件
const GenericFilterableList = <
  T extends object,
  F extends object = Record<string, unknown>
>({
  columns,
  searchFields,
  fetcher,
}: GenericListProps<T, F>) => {
  // 1. 初始化表单实例
  const [form] = Form.useForm<F>();

  // 2. 调用自定义 Hook 获取所有状态和逻辑
  const {
    data,
    loading,
    pagination,
    handleTableChange,
    handleSearch,
    handleReset,
  } = useListManager<T, F>(fetcher, form);

  return (
    <Card>
      {/* 动态搜索表单 */}
      <SearchForm<F>
        form={form}
        searchFields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* 通用表格 */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        // 绑定 Hook 中的 Table 变化处理函数
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default GenericFilterableList;
