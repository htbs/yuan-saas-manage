import { ColumnType } from "antd/es/table";
import { useState, useCallback, useMemo, useRef } from "react";
import { findPageRoolListApi, deleteRoleApi } from "@/src/services";
import { ActionItem } from "@/src/components/ui/dropdown/MoreActionsDropdown";
import {
  createActionColumn,
  FixedActionItem,
  createLinkColumn,
} from "@/src/lib/utils/tableColumns";
import { message, Popconfirm } from "antd";
import { RoleInfo, RoleFilterListParams } from "../../types";
export const useRoleList = (baseColumns: ColumnType<RoleInfo>[]) => {
  const fetchList = useCallback(async (params: RoleFilterListParams) => {
    // 分页查询
    const result = await findPageRoolListApi(params);
    return { list: result.content, total: result.totalElements };
  }, []);

  // 使用 useRef 存储 refetch 函数
  const [refetcher, setRefetcher] = useState<() => void>(() => () => {});
  // 设置回调函数，将 refetch 存入 ref
  const handleSetRefetch = useCallback((fn: () => void) => {
    setRefetcher(() => fn); // 注意：设置函数需要用函数式更新
  }, []);

  // 1. 内部集成弹窗状态
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit" | "detail";
    id?: string; // 数据ID
  }>({ isOpen: false, mode: "add", id: "" });

  // 2. 定义打开逻辑
  const openDialog = useCallback(
    (mode: "add" | "edit" | "detail", id?: string) => {
      console.log("Hook: openDialog triggered", { mode, id });
      setDialogState({ isOpen: true, mode, id });
    },
    []
  );

  // 3. 定义关闭逻辑
  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // 定义授权的Dialog逻辑
  const [authMenuDialogState, setAuthDialogState] = useState<{
    isOpen: boolean;
    mode: "authMenu";
    roleId: string; // 数据ID
  }>({ isOpen: false, mode: "authMenu", roleId: "" });
  const openAuthMenuDialog = useCallback((mode: "authMenu", roleId: string) => {
    setAuthDialogState({ isOpen: true, mode, roleId });
  }, []);
  const closeAuthMenuDialog = useCallback(() => {
    setAuthDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const finalColumns = useMemo(() => {
    // 创建操作列
    const fixedActionItems: FixedActionItem<RoleInfo>[] = [
      {
        label: "编辑",
        onClick: (record) => {
          openDialog("edit", record.id);
        },
        type: "primary",
      },
    ];
    const deleteActionItems: FixedActionItem<RoleInfo>[] = [
      {
        type: "primary",
        label: (record) => (
          <Popconfirm
            title={`确定删除吗?`}
            onConfirm={async () => {
              await deleteRoleApi(record.id);
              message.success(`删除成功`);
              refetcher?.();
            }}
          >
            <a onClick={(e) => e.stopPropagation()}>删除</a>
          </Popconfirm>
        ),
        onClick: () => {},
      },
    ];

    // 授权
    const authAction: ActionItem<RoleInfo>[] = [
      {
        key: "authMenu",
        label: "授权菜单",
        onClick: (record) => openAuthMenuDialog("authMenu", record.id),
      },
    ];

    // 使用 .map 遍历原始列配置，实现“原位增强”
    return baseColumns.map((col) => {
      // 用户账号列 (Link)
      if (col.key === "name") {
        return createLinkColumn<RoleInfo>(
          "name",
          (col.title as string) || "角色名称",
          (record) => openDialog("detail", record.id),
          { ...col } // 继承原有的 width, fixed 等配置
        );
      }
      // 操作列
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
  }, [baseColumns, openDialog, refetcher, openAuthMenuDialog]);

  return {
    finalColumns,
    fetchList,
    handleSetRefetch,
    openAdd: () => openDialog("add"),
    dialogProps: {
      ...dialogState,
      onClose: closeDialog,
      onSuccess: () => refetcher?.(), // 刷新列表方法
    },
    authMenuDialogProps: {
      ...authMenuDialogState,
      onClose: closeAuthMenuDialog,
      onSuccess: () => refetcher?.(), // 刷新列表
    },
  };
};
