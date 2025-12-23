import React from "react";
import { Table, Form, Card } from "antd";
import { ColumnType } from "antd/es/table";
import { GenericListProps } from "./types";
import { useListManager } from "./useListManager";
import SearchForm from "./SearchForm";

// 核心通用列表组件
const GenericFilterableList = <
  T extends object,
  F extends object = Record<string, unknown>
>(
  props: GenericListProps<T, F>
) => {
  // 1. 初始化表单实例
  const [form] = Form.useForm<F>();
  const {
    columns,
    searchFields,
    fetcher,
    showIndexColumn,
    onRefetch,
    initialValues,
    renderSearchActions,
  } = props;

  // 2. 调用自定义 Hook 获取所有状态和逻辑
  const {
    data,
    loading,
    pagination,
    handleTableChange,
    handleSearch,
    handleReset,
    refetch,
  } = useListManager<T, F>(fetcher, form, props);

  // 使用 useEffect 将 refetch 函数通过 onRefetch 传递给父组件
  React.useEffect(() => {
    if (onRefetch) {
      onRefetch(refetch);
    }
  }, [onRefetch, refetch]); // 依赖项是 onRefetch 和 refetch

  // 新增序号列
  const serialNumberColumn: ColumnType<T> = {
    title: "序号",
    width: 80,
    align: "center",
    // 核心计算逻辑： (当前页码 - 1) * 每页大小 + 当前行索引 + 1
    render: (_, __, index) => {
      return (pagination.current - 1) * pagination.pageSize + index + 1;
    },
  };

  // 组合序号列与数据列
  const finalColumns = showIndexColumn
    ? [serialNumberColumn, ...columns]
    : columns;

  return (
    <Card>
      {/* 动态搜索表单 */}
      <SearchForm<F>
        form={form}
        searchFields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        initialValues={initialValues}
        renderActions={renderSearchActions}
      />
      {/* 通用表格 */}
      <Table
        columns={finalColumns}
        dataSource={data}
        rowKey="id"
        // loading={loading}
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
