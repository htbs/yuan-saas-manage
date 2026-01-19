import { ColumnType } from "antd/es/table";
import { useState, useCallback, useMemo, useRef } from "react";
import { ShopFilterListParams, ShopListInfo } from "../../types";
import {
  findShopPageApi,
  lockShopApi,
  unLockShopApi,
  deleteShopApi,
} from "@/src/services";
import {
  createActionColumn,
  FixedActionItem,
  createLinkColumn,
} from "@/src/lib/utils/tableColumns";
import { ActionItem } from "@/src/components/ui/dropdown/MoreActionsDropdown";
import { Space, Popconfirm, Button } from "antd";
import { CurdActionEnum } from "@/src/types";
import { PlusOutlined } from "@ant-design/icons";

export const useShopList = (baseColumns: ColumnType<ShopListInfo>[]) => {
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
    shopId?: string; // 数据ID
  }>({ isOpen: false, mode: CurdActionEnum.add, shopId: "" });

  /**
   * 打开编辑、详情、新增 Dialog
   */
  const openBaseDialog = useCallback(
    (mode: CurdActionEnum, shopId?: string) => {
      setBaseDialogState({ isOpen: true, mode, shopId });
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
   * 设置编辑、详情、新增 Dialog 逻辑
   */
  const [workBenchDialogState, setWorkBenchDialogState] = useState<{
    isOpen: boolean;
    shopId: string; // 数据ID
  }>({ isOpen: false, shopId: "" });

  /**
   * 打开编辑、详情、新增 Dialog
   */
  const openWorkBenchDialog = useCallback((shopId: string) => {
    setWorkBenchDialogState({ isOpen: true, shopId });
  }, []);

  /**
   * 关闭 编辑、详情、新增 Dialog
   */
  const closeWorkBenchDialog = useCallback(() => {
    setWorkBenchDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * 状态更新
   */
  const apiUpdateStatus = useCallback(async (record: ShopListInfo) => {
    try {
      console.log("lockStatus", record.lockStatus);
      // 启用 / 禁用
      if (record.lockStatus === "Y") {
        await unLockShopApi(record.id);
      } else {
        await lockShopApi(record.id);
      }
    } catch {}
  }, []);

  /**
   * 获取列表数据
   */
  const fetchList = useCallback(async (params: ShopFilterListParams) => {
    // 实际调用您封装的 request 模块
    const result = await findShopPageApi(params);
    return { list: result.content, total: result.totalElements };
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
    // 创建操作列
    const editItems: FixedActionItem<ShopListInfo>[] = [
      {
        label: "编辑",
        type: "primary",
        onClick: (record) => {
          openBaseDialog(CurdActionEnum.edit, record.id);
        },
      },
    ];
    // 工作台
    const workbenchItems: FixedActionItem<ShopListInfo>[] = [
      {
        label: "工作台",
        onClick: (record) => {
          openWorkBenchDialog(record.id);
        },
        type: "primary",
      },
    ];
    // 删除
    const deleteItems: ActionItem<ShopListInfo>[] = [
      {
        key: "delete",
        label: (record) => (
          <Popconfirm
            title="确定删除吗？"
            onConfirm={async () => {
              // 删除商家
              await deleteShopApi(record.id);
              triggerRefetch();
            }}
          >
            <a onClick={(e) => e.stopPropagation()}>删除</a>
          </Popconfirm>
        ),
        onClick: () => {},
      },
    ];

    // 更多操作： 修改状态
    const updateStatusItems: ActionItem<ShopListInfo>[] = [
      {
        key: "updateStatus",
        label: (record) => (
          <Popconfirm
            title={`确定${record.lockStatus === "N" ? "禁用" : "启用"}该商家吗？`}
            onConfirm={async () => {
              // 启用 / 禁用
              await apiUpdateStatus(record);
              triggerRefetch();
            }}
          >
            <a onClick={(e) => e.stopPropagation()}>
              {record.lockStatus === "N" ? "禁用" : "启用"}
            </a>
          </Popconfirm>
        ),
        onClick: () => {},
      },
    ];
    // 使用 .map 遍历原始列配置，实现“原位增强”
    return baseColumns.map((col) => {
      // 用户账号列 (Link)
      if (col.key === "name") {
        return createLinkColumn<ShopListInfo>(
          "name",
          (col.title as string) || "商家名称",
          (record) => openBaseDialog(CurdActionEnum.view, record.id),
          { ...col }, // 继承原有的 width, fixed 等配置
        );
      }

      // 操作列
      if (col.key === "action") {
        return {
          ...createActionColumn(
            [...editItems, ...workbenchItems],
            [updateStatusItems, deleteItems].flat(),
          ),
          ...col, // 合并原始配置中的 width, fixed 等
        };
      }

      // 其他列：保持原样
      return col;
    });
  }, [
    baseColumns,
    openBaseDialog,
    triggerRefetch,
    openWorkBenchDialog,
    apiUpdateStatus,
  ]);

  return {
    /**
     * 最终列定义
     */
    finalAllColumns,
    /**
     * 列表数据查询
     */
    fetchList,
    /**
     * 列表刷新注册
     */
    registerRefetch,

    /**
     * 新增按钮
     */
    addAction,
    /**
     * 角色编辑、详情、新增 Dialog
     */
    dialogProps: {
      ...baseDialogState,
      onClose: closeBaseDialog,
      onSuccess: triggerRefetch, // 刷新列表方法
    },

    /**
     * 工作台 Dialog
     */
    workBenchDialogProps: {
      ...workBenchDialogState,
      onClose: closeWorkBenchDialog,
      onSuccess: triggerRefetch, // 刷新列表方法
    },
  };
};
