import { ColumnType } from "antd/es/table";
import { useState, useCallback, useMemo, useRef } from "react";
import { DictItemFilterListParams, DictItemInfo } from "../../../types";
import {
  findDictItemPageApi,
  lockDictItemApi,
  unLockDictItemApi,
  deleteDictItemApi,
} from "@/src/services";
import {
  createActionColumn,
  FixedActionItem,
} from "@/src/lib/utils/tableColumns";
import { ActionItem } from "@/src/components/ui/dropdown/MoreActionsDropdown";
import { Popconfirm, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CurdActionEnum } from "@/src/types";

export const useDictItemList = (baseColumns: ColumnType<DictItemInfo>[]) => {
  const fetchList = useCallback(async (params: DictItemFilterListParams) => {
    // 实际调用您封装的 request 模块
    const result = await findDictItemPageApi(params);
    return { list: result.content, total: result.totalElements };
  }, []);

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
    dictItemInfo?: DictItemInfo; // 数据ID
  }>({ isOpen: false, mode: CurdActionEnum.add, dictItemInfo: undefined });

  /**
   * 打开编辑、详情、新增 Dialog
   */
  const openBaseDialog = useCallback(
    (mode: CurdActionEnum, dictItemInfo?: DictItemInfo) => {
      setBaseDialogState({ isOpen: true, mode, dictItemInfo });
    },
    [],
  );

  /**
   * 关闭 编辑、详情、新增 Dialog
   */
  const closeBaseDialog = useCallback(() => {
    setBaseDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // 处理状态的启用禁用
  const apiUpdateStatus = useCallback(async (record: DictItemInfo) => {
    try {
      // 启用 / 禁用
      if (record.lockStatus === "Y") {
        await unLockDictItemApi(record.id);
      } else {
        await lockDictItemApi(record.id);
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

  const finalAllColumns = useMemo(() => {
    // 固定列 - 编辑
    const editItems: FixedActionItem<DictItemInfo>[] = [
      {
        label: "编辑",
        onClick: (record) => {
          openBaseDialog(CurdActionEnum.edit, record);
        },
        type: "primary",
      },
    ];

    // 删除
    const deleteItems: ActionItem<DictItemInfo>[] = [
      {
        key: "delete",
        label: (record) => (
          <Popconfirm
            title="确定删除吗？"
            onConfirm={async () => {
              // 删除字典项
              await deleteDictItemApi(record.id);
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

    // 启用 / 禁用
    const lockStatusItems: ActionItem<DictItemInfo>[] = [
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
      // if (col.key === "dictName") {
      //   return createLinkColumn<DictItemInfo>(
      //     "dictLabel",
      //     (col.title as string) || "字典名称",
      //     (record) => setView("detail", record.id),
      //     { ...col } // 继承原有的 width, fixed 等配置
      //   );
      // }

      // 状态列 (Switch)
      // if (col.key === "status") {
      //   return createSwitchStatusColumn<DictItemInfo, string>(
      //     apiUpdateStatus,
      //     refetcher,
      //     "status",
      //     (col.title as string) || "状态",
      //     { checked: "N", unChecked: "Y" },
      //   );
      // }

      // 操作列
      if (col.key === "action") {
        return {
          ...createActionColumn(
            [...editItems],
            [...deleteItems, ...lockStatusItems],
          ),
          ...col, // 合并原始配置中的 width, fixed 等
        };
      }

      // 其他列：保持原样
      return col;
    });
  }, [baseColumns, openBaseDialog, triggerRefetch, apiUpdateStatus]);

  return {
    finalAllColumns,
    fetchList,
    registerRefetch,
    addAction,
    dialogProps: {
      ...baseDialogState,
      onClose: closeBaseDialog,
      onSuccess: triggerRefetch, // 刷新列表方法
    },
  };
};
