import { ColumnType } from "antd/es/table";
import { useState, useCallback, useMemo } from "react";
import { findPageRoolListApi, deleteRoleApi } from "@/src/services";
import { ActionItem } from "@/src/components/ui/dropdown/MoreActionsDropdown";
import {
  createActionColumn,
  FixedActionItem,
  createLinkColumn,
} from "@/src/lib/utils/tableColumns";
import { useRoleStore } from "../../stores/useRoleStore";
import { message, Popconfirm } from "antd";
import { RoleInfo, RoleFilterListParams } from "../../types";
export const useRoleList = (baseColumns: ColumnType<RoleInfo>[]) => {
  const fetchList = useCallback(async (params: RoleFilterListParams) => {
    // 分页查询
    const result = await findPageRoolListApi(params);
    return { list: result.content, total: result.totalElements };
  }, []);

  const setView = useRoleStore((state) => state.setView);

  // 使用 useRef 存储 refetch 函数
  const [refetcher, setRefetcher] = useState<() => void>(() => () => {});
  // 设置回调函数，将 refetch 存入 ref
  const handleSetRefetch = useCallback((fn: () => void) => {
    setRefetcher(() => fn); // 注意：设置函数需要用函数式更新
  }, []);

  const finalColumns = useMemo(() => {
    // 创建操作列
    const fixedActionItems: FixedActionItem<RoleInfo>[] = [
      {
        label: "编辑",
        onClick: (record) => {
          setView("edit", record.id);
        },
        type: "primary",
      },
    ];
    const deleteActionItems: FixedActionItem<RoleInfo>[] = [
      {
        type: "primary",
        label: (record) => (
          <Popconfirm
            title={`确定删除${record.name}吗?`}
            onConfirm={async () => {
              await deleteRoleApi(record.id);
              message.success(`删除+${record.name}成功`);
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
        key: "resetPassword",
        label: "授权",
        onClick: (record) => setView("auth", record.id),
      },
    ];

    // 使用 .map 遍历原始列配置，实现“原位增强”
    return baseColumns.map((col) => {
      // 用户账号列 (Link)
      if (col.key === "name") {
        return createLinkColumn<RoleInfo>(
          "name",
          (col.title as string) || "角色名称",
          (record) => setView("detail", record.id),
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
  }, [baseColumns, refetcher, setView]);

  return {
    finalColumns,
    fetchList,
    handleSetRefetch,
  };
};
