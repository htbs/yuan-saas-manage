import { ColumnType } from "antd/es/table";
import { useState, useCallback, useMemo, useRef } from "react";
import { findPageRoolListApi, deleteRoleApi } from "@/src/services";
import { ActionItem } from "@/src/components/ui/dropdown/MoreActionsDropdown";
import {
  createActionColumn,
  FixedActionItem,
  createLinkColumn,
} from "@/src/lib/utils/tableColumns";
import { message, Popconfirm, Space, Button } from "antd";
import { RoleInfo, RoleFilterListParams } from "../../types";
import { PlusOutlined } from "@ant-design/icons";

export const useRoleList = (baseColumns: ColumnType<RoleInfo>[]) => {
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
   * 角色编辑、详情、新增 Dialog 逻辑
   */
  const [roleDialogState, setRoleDialogState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit" | "detail";
    roleId?: string; // 数据ID
  }>({ isOpen: false, mode: "add", roleId: "" });

  /**
   * 打开角色编辑、详情、新增 Dialog
   */
  const openRoleDialog = useCallback(
    (mode: "add" | "edit" | "detail", roleId?: string) => {
      setRoleDialogState({ isOpen: true, mode, roleId });
    },
    []
  );

  /**
   * 关闭角色编辑、详情、新增 Dialog
   */
  const closeDialog = useCallback(() => {
    setRoleDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * 定义菜单授权 Dialog 逻辑
   */
  const [authMenuDialogState, setAuthDialogState] = useState<{
    isOpen: boolean;
    roleId: string; // 数据ID
  }>({ isOpen: false, roleId: "" });

  /**
   * 打开菜单授权 Dialog
   */
  const openAuthMenuDialog = useCallback((roleId: string) => {
    setAuthDialogState({ isOpen: true, roleId });
  }, []);

  /**
   * 关闭菜单授权 Dialog
   */
  const closeAuthMenuDialog = useCallback(() => {
    setAuthDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * 分页查询角色列表
   */
  const fetchList = useCallback(async (params: RoleFilterListParams) => {
    // 分页查询
    const result = await findPageRoolListApi(params);
    return { list: result.content, total: result.totalElements };
  }, []);

  /**
   * 操作列：新增按钮
   */
  const addAction = useCallback(() => {
    return (
      <Space>
        <Button icon={<PlusOutlined />} onClick={() => openRoleDialog("add")}>
          新增
        </Button>
      </Space>
    );
  }, [openRoleDialog]);

  /**
   * 列定义
   */
  const finalColumns = useMemo(() => {
    /**
     * 固定操作：编辑
     */
    const fixedActionItems: FixedActionItem<RoleInfo>[] = [
      {
        label: "编辑",
        type: "primary",
        onClick: (record) => {
          openRoleDialog("edit", record.id);
        },
      },
    ];
    /**
     * 固定操作：删除
     */
    const deleteActionItems: FixedActionItem<RoleInfo>[] = [
      {
        type: "primary",
        label: (record) => (
          <Popconfirm
            title={`确定删除吗?`}
            onConfirm={async () => {
              await deleteRoleApi(record.id);
              message.success(`删除成功`);
              triggerRefetch();
            }}
          >
            {/* 这里阻止冒泡 避免触发行点击 */}
            <a onClick={(e) => e.stopPropagation()}>删除</a>
          </Popconfirm>
        ),
        onClick: () => {},
      },
    ];

    /**
     * 更多操作：授权菜单
     */
    const authAction: ActionItem<RoleInfo>[] = [
      {
        key: "authMenu",
        label: "授权菜单",
        onClick: (record) => openAuthMenuDialog(record.id),
      },
    ];

    /**
     * 对 baseColumns 进行“原位增强”
     */
    return baseColumns.map((col) => {
      // 角色名称 --> 可点击查询详情
      if (col.key === "name") {
        return createLinkColumn<RoleInfo>(
          "name",
          (col.title as string) || "角色名称",
          (record) => openRoleDialog("detail", record.id),
          { ...col } // 继承原有的 width, fixed 等配置
        );
      }
      // 操作 编辑、删除、更多操作
      if (col.key === "action") {
        return {
          ...createActionColumn(
            [...fixedActionItems, ...deleteActionItems],
            authAction
          ),
          ...col, // 合并原始配置中的 width, fixed 等
        };
      }

      // 其他列：保持原样
      return col;
    });
  }, [baseColumns, openRoleDialog, triggerRefetch, openAuthMenuDialog]);

  return {
    /**
     * 最终列
     */
    finalColumns,
    /**
     * 列表查询方法
     */
    fetchList,
    /**
     * 注册列表刷新方法
     */
    handleSetRefetch: registerRefetch,
    /**
     * 操作列： 新增
     */
    addAction,
    /**
     * 角色编辑、详情、新增 Dialog
     */
    dialogProps: {
      ...roleDialogState,
      onClose: closeDialog,
      onSuccess: triggerRefetch, // 刷新列表方法
    },
    /**
     * 菜单授权 Dialog
     */
    authMenuDialogProps: {
      ...authMenuDialogState,
      onClose: closeAuthMenuDialog,
      onSuccess: triggerRefetch, // 刷新列表
    },
  };
};
