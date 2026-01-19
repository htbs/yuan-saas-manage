import { ColumnType } from "antd/es/table";
import { useState, useCallback, useMemo } from "react";
import { DictFilterListParams, DictInfo } from "../../../types";
import {
  findDictPageApi,
  lockDictApi,
  unLockDictApi,
  deleteDictApi,
} from "@/src/services";
import {
  createActionColumn,
  FixedActionItem,
  createLinkColumn,
} from "@/src/lib/utils/tableColumns";
import { ActionItem } from "@/src/components/ui/dropdown/MoreActionsDropdown";
import { Popconfirm, Space, Button } from "antd";
import { useRef } from "react";
import { CurdActionEnum } from "@/src/types";
import { PlusOutlined } from "@ant-design/icons";

export const useDictList = (baseColumns: ColumnType<DictInfo>[]) => {
  /**
   * 存储刷新数据的回调函数
   */
  const refetchRef = useRef<() => void>(() => () => {});
  /**
   * 注册列表刷新函数
   */
  const registerRefetch = useCallback((fn: () => void) => {
    refetchRef.current = fn;
  }, []);

  /** 触发列表刷新 */
  const triggerRefetch = useCallback(() => {
    refetchRef.current?.();
  }, []);

  /**
   * 设置编辑、详情、新增 Dialog 逻辑
   */
  const [baseDialogState, setBaseDialogState] = useState<{
    isOpen: boolean;
    mode: CurdActionEnum;
    dictInfo?: DictInfo; // 数据ID
  }>({ isOpen: false, mode: CurdActionEnum.add, dictInfo: undefined });

  /**
   * 打开编辑、详情、新增 Dialog
   */
  const openBaseDialog = useCallback(
    (mode: CurdActionEnum, dictInfo?: DictInfo) => {
      setBaseDialogState({ isOpen: true, mode, dictInfo });
    },
    [],
  );

  /**
   * 关闭 编辑、详情、新增 Dialog
   */
  const closeBaseDialog = useCallback(() => {
    setBaseDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * 设置 字典项 Dialog 逻辑
   */
  const [itemDialogState, setItemDialogState] = useState<{
    isOpen: boolean;
    dictCode: string; // 数据Code
  }>({ isOpen: false, dictCode: "" });

  /**
   * 打开编辑、详情、新增 Dialog
   */
  const openItemDialog = useCallback((dictCode: string) => {
    setItemDialogState({ isOpen: true, dictCode });
  }, []);

  /**
   * 关闭 编辑、详情、新增 Dialog
   */
  const closeItemDialog = useCallback(() => {
    setItemDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // 处理状态的启用禁用
  const apiUpdateStatus = useCallback(async (record: DictInfo) => {
    try {
      // 启用 / 禁用
      if (record.lockStatus === "Y") {
        await unLockDictApi(record.id);
      } else {
        await lockDictApi(record.id);
      }
    } catch {}
  }, []);

  /**
   * 操作列：新增按钮
   */
  const addAction = useCallback(() => {
    return (
      <Space>
        <Button
          icon={<PlusOutlined />}
          onClick={() => openBaseDialog(CurdActionEnum.add)}
        >
          新增
        </Button>
      </Space>
    );
  }, [openBaseDialog]);

  /**
   * 获取列表数据的函数
   */
  const fetchList = useCallback(async (params: DictFilterListParams) => {
    // 实际调用您封装的 request 模块
    const result = await findDictPageApi(params);
    return { list: result.content, total: result.totalElements };
  }, []);
  const finalAllColumns = useMemo(() => {
    // 创建操作列
    const editItems: FixedActionItem<DictInfo>[] = [
      {
        label: "编辑",
        onClick: (record) => {
          openBaseDialog(CurdActionEnum.edit, record);
        },
        type: "primary",
      },
    ];

    // 固定操作：子项内容
    const detailItems: FixedActionItem<DictInfo>[] = [
      {
        label: "详情",
        onClick: (record) => {
          openItemDialog(record.dictCode);
        },
        type: "primary",
      },
    ];

    // 删除
    const deleteItems: ActionItem<DictInfo>[] = [
      {
        key: "delete",
        label: (record) => (
          <Popconfirm
            title="确定删除吗？"
            onConfirm={async () => {
              // 删除字典
              await deleteDictApi(record.id);
              // 刷新列表
              triggerRefetch();
            }}
          >
            <a onClick={(e) => e.stopPropagation()}>删除</a>
          </Popconfirm>
        ),
        onClick: () => {},
      },
    ];

    // 启用禁用
    const lockStatusItems: ActionItem<DictInfo>[] = [
      {
        key: "lockStatus",
        label: (record) => (
          <Popconfirm
            title={record.lockStatus === "Y" ? "确定禁用吗？" : "确定启用吗？"}
            onConfirm={async () => {
              // 启用 / 禁用
              apiUpdateStatus(record);
              // 刷新列表
              triggerRefetch();
            }}
          >
            <a onClick={(e) => e.stopPropagation()}>
              {record.lockStatus === "Y" ? "启用" : "禁用"}
            </a>
          </Popconfirm>
        ),
        onClick: () => {},
      },
    ];

    // 使用 .map 遍历原始列配置，实现“原位增强”
    return baseColumns.map((col) => {
      // 用户账号列 (Link)
      if (col.key === "dictName") {
        return createLinkColumn<DictInfo>(
          "dictName",
          (col.title as string) || "字典名称",
          (record) => openBaseDialog(CurdActionEnum.view, record),
          { ...col }, // 继承原有的 width, fixed 等配置
        );
      }

      // 操作列
      if (col.key === "action") {
        return {
          ...createActionColumn(
            [...editItems, ...detailItems],
            [...deleteItems, ...lockStatusItems],
          ),
          ...col, // 合并原始配置中的 width, fixed 等
        };
      }

      // 其他列：保持原样
      return col;
    });
  }, [baseColumns, openBaseDialog, openItemDialog, triggerRefetch]);

  return {
    finalAllColumns,
    fetchList,
    handleSetRefetch: registerRefetch,
    addAction,
    /**
     * 编辑、详情、新增 Dialog
     */
    baseDialogProps: {
      ...baseDialogState,
      onClose: closeBaseDialog,
      onSuccess: triggerRefetch, // 刷新列表方法
    },
    /**
     * 字典项 Dialog
     */
    itemDialogProps: {
      ...itemDialogState,
      onClose: closeItemDialog,
      onSuccess: triggerRefetch, // 刷新列表方法
    },
  };
};
