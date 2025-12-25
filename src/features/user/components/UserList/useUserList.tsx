import { ColumnType } from "antd/es/table";
import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SysUserFilterListParams, SysUserDataList } from "./UserList.types";
import {
  findPageListApi,
  lockUserApi,
  unLockUserApi,
  resetPasswordApi,
} from "@/src/services";
import {
  createSwitchStatusColumn,
  createActionColumn,
  FixedActionItem,
  createLinkColumn,
} from "@/src/lib/utils/tableColumns";
import { ActionItem } from "@/src/components/ui/dropdown/MoreActionsDropdown";
import { useUserStore } from "../../stores/useUserStore";
import { message, Popconfirm } from "antd";
export const useSysUserTable = (baseColumns: ColumnType<SysUserDataList>[]) => {
  const fetchUserList = useCallback(async (params: SysUserFilterListParams) => {
    // 实际调用您封装的 request 模块
    const result = await findPageListApi(params);
    return { list: result.content, total: result.totalElements };
  }, []);
  const router = useRouter();

  const setView = useUserStore((state) => state.setView);

  // 使用 useRef 存储 refetch 函数
  const [refetcher, setRefetcher] = useState<() => void>(() => () => {});
  // 设置回调函数，将 refetch 存入 ref
  const handleSetRefetch = useCallback((fn: () => void) => {
    setRefetcher(() => fn); // 注意：设置函数需要用函数式更新
  }, []);

  // 处理状态的启用禁用
  const apiUpdateStatus = useCallback(async (record: SysUserDataList) => {
    const newStatus = record.status === "active" ? "suspended" : "active";
    try {
      // 启用 / 禁用
      if (newStatus === "active") {
        await unLockUserApi(record.id);
      } else {
        await lockUserApi(record.id);
      }
    } catch {}
  }, []);

  const finalUserColumns = useMemo(() => {
    // 创建操作列
    const fixedActionItems: FixedActionItem<SysUserDataList>[] = [
      {
        label: "编辑",
        onClick: (record) => {
          setView("edit", record.id);
        },
        type: "primary",
      },
    ];
    const actionItems: ActionItem<SysUserDataList>[] = [
      {
        key: "resetPassword",
        label: (record) => (
          <Popconfirm
            title="确定重置密码吗？"
            onConfirm={async () => {
              await resetPasswordApi(record.id);
              message.success("重置密码成功");
            }}
          >
            <a onClick={(e) => e.stopPropagation()}>重置密码</a>
          </Popconfirm>
        ),
        onClick: () => {},
      },
    ];
    // 使用 .map 遍历原始列配置，实现“原位增强”
    return baseColumns.map((col) => {
      // 用户账号列 (Link)
      if (col.key === "userName") {
        return createLinkColumn<SysUserDataList>(
          "userName",
          (col.title as string) || "用户账号",
          (record) => setView("detail", record.id),
          { ...col } // 继承原有的 width, fixed 等配置
        );
      }

      // 状态列 (Switch)
      if (col.key === "status") {
        return createSwitchStatusColumn<SysUserDataList, string>(
          apiUpdateStatus,
          refetcher,
          "status",
          (col.title as string) || "状态",
          { checked: "active", unChecked: "suspended" }
        );
      }

      // 操作列
      if (col.key === "action") {
        return {
          ...createActionColumn(fixedActionItems, actionItems),
          ...col, // 合并原始配置中的 width, fixed 等
        };
      }

      // 其他列：保持原样
      return col;
    });
  }, [baseColumns, apiUpdateStatus, refetcher, setView]);

  return {
    finalUserColumns,
    fetchUserList,
    handleSetRefetch,
  };
};
