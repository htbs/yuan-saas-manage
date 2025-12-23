import { useState, useEffect, useCallback } from "react";
import { FormInstance, PaginationProps } from "antd";
import { GenericListProps } from "./types";

interface ListManagerResult<T extends object> {
  data: T[];
  loading: boolean;
  pagination: { current: number; pageSize: number; total: number };
  handleTableChange: (newPagination: PaginationProps) => void;
  handleSearch: () => void; // 添加 handleSearch 方法 用于搜索
  handleReset: () => void; // 添加 handleReset 方法 用于重置
  refetch: () => void; // 添加 refetch 方法 用于刷新列表
}

/**
 * 负责管理列表的数据请求、分页、加载状态和搜索/重置逻辑。
 * @param fetcher 数据请求函数
 * @param form 搜索表单实例
 */
export const useListManager = <
  T extends object,
  F extends object = Record<string, unknown>
>(
  fetcher: GenericListProps<T, F>["fetcher"],
  form: FormInstance<F>,
  props: GenericListProps<T, F>
): ListManagerResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   total: 0,
  // });

  // 内部兜底状态：如果没传 Zustand，组件也能跑
  // const [internalPagination, setInternalPagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  // });
  const [internalPagination, setInternalPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // 优先级：受控状态 > 内部状态
  const activePagination = props.controlledPagination || internalPagination;

  //  数据获取函数
  const fetchData = useCallback(async () => {
    // 1. 获取当前的筛选条件
    const filterValues = form.getFieldsValue();

    setLoading(true);
    try {
      // 2. 调用外部传入的 fetcher 函数
      const result = await fetcher({
        ...filterValues,
        pageNo: activePagination.current,
        pageSize: activePagination.pageSize,
      });

      setData(result.list);
      setTotal(result.total || 0);
      // setPagination((prev) => ({ ...prev, total: result.total }));
    } catch {
      setData([]);
      // setPagination((prev) => ({ ...prev, total: 0 }));
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [form, activePagination.current, activePagination.pageSize, fetcher]); // 依赖项 这里不要改 改了就死循环了

  const refetch = useCallback(() => {
    // 仅更新分页状态，依赖项变化会触发 fetchData
    fetchData();
  }, [fetchData]);

  //  生命周期：自动加载/刷新数据
  useEffect(() => {
    // 监听分页状态或 fetcher 变化，自动重新加载数据
    fetchData();
  }, [fetchData]);

  // 表单回显同步：当 Zustand 里的值变化（如重置），同步给 Form
  useEffect(() => {
    if (props.initialValues) {
      form.setFieldsValue(props.initialValues);
    }
  }, [props.initialValues, form]);

  // 处理 Table 的分页/排序/过滤变化
  // const handleTableChange = (newPagination: PaginationProps) => {
  //   // 仅更新分页状态，依赖项变化会触发 fetchData
  //   setPagination((prev) => ({
  //     ...prev,
  //     current: newPagination.current || 1,
  //     pageSize: newPagination.pageSize || 10,
  //   }));
  // };
  const handleTableChange = (nav: PaginationProps) => {
    const current = nav.current || 1;
    const pageSize = nav.pageSize || 10;

    if (props.onPaginationChange) {
      props.onPaginationChange(current, pageSize);
    } else {
      setInternalPagination({ current, pageSize });
    }
  };

  // 处理搜索按钮点击：重置页码到 1
  // const handleSearch = () => {
  //   // 仅更新 current，依赖项变化会触发 fetchData

  //   // setPagination((prev) => ({ ...prev, current: 1 }));
  //   // 1. 获取当前页码
  //   const currentPage = pagination.current;
  //   if (currentPage !== 1) {
  //     // 如果当前不在第一页，更新状态到 1，这会隐式触发 fetchData
  //     setPagination((prev) => ({ ...prev, current: 1 }));
  //   } else {
  //     // 状态更新不会发生，我们需要强制执行 fetchData
  //     fetchData();
  //   }
  // };

  const handleSearch = () => {
    const values = form.getFieldsValue();
    props.onSearchUpdate?.(values); // 同步搜索条件到 Zustand

    // 搜索时强制回第 1 页
    if (activePagination.current !== 1) {
      if (props.onPaginationChange) {
        props.onPaginationChange(1, activePagination.pageSize);
      } else {
        setInternalPagination((p) => ({ ...p, current: 1 }));
      }
    } else {
      fetchData();
    }
  };

  // 处理重置按钮点击：重置表单和页码
  // const handleReset = () => {
  //   form.resetFields();
  //   // 强制重置分页状态
  //   setPagination({ current: 1, pageSize: 10, total: 0 });
  // };

  const handleReset = () => {
    form.resetFields();
    if (props.onReset) {
      props.onReset();
    } else {
      setInternalPagination({ current: 1, pageSize: 10 });
    }
  };

  // 导出状态和方法
  // return {
  //   data,
  //   loading,
  //   pagination,
  //   handleTableChange,
  //   handleSearch,
  //   handleReset,
  //   refetch,
  // };
  return {
    data,
    loading,
    // pagination: { ...activePagination, total },
    pagination: {
      current: activePagination.current,
      pageSize: activePagination.pageSize,
      total,
    },
    handleTableChange,
    handleSearch,
    handleReset,
    refetch: fetchData,
  };
};
