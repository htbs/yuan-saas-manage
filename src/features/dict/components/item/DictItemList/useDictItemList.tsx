import { ColumnType } from "antd/es/table";
import { useState, useCallback, useMemo } from "react";
import { DictItemFilterListParams, DictItemInfo } from "../../../types";
import {
  findDictItemPageApi,
  lockDictItemApi,
  unLockDictItemApi,
  deleteDictItemApi,
} from "@/src/services";
import {
  createSwitchStatusColumn,
  createActionColumn,
  FixedActionItem,
} from "@/src/lib/utils/tableColumns";
import { ActionItem } from "@/src/components/ui/dropdown/MoreActionsDropdown";
import { message, Popconfirm } from "antd";

export const useDictItemList = (baseColumns: ColumnType<DictItemInfo>[]) => {
  const fetchList = useCallback(async (params: DictItemFilterListParams) => {
    // 实际调用您封装的 request 模块
    const result = await findDictItemPageApi(params);
    return { list: result.content, total: result.totalElements };
  }, []);

  // 使用 useRef 存储 refetch 函数
  const [refetcher, setRefetcher] = useState<() => void>(() => () => {});
  // 设置回调函数，将 refetch 存入 ref
  const handleSetRefetch = useCallback((fn: () => void) => {
    setRefetcher(() => fn); // 注意：设置函数需要用函数式更新
  }, []);

  // 处理状态的启用禁用
  const apiUpdateStatus = useCallback(async (record: DictItemInfo) => {
    const newStatus = record.status === "N" ? "Y" : "N";
    try {
      // 启用 / 禁用
      if (newStatus === "Y") {
        await unLockDictItemApi(record.id);
      } else {
        await lockDictItemApi(record.id);
      }
    } catch {}
  }, []);

  const finalAllColumns = useMemo(() => {
    // 创建操作列
    const editItems: FixedActionItem<DictItemInfo>[] = [
      {
        label: "编辑",
        onClick: (record) => {
          // setView("edit", record.id);
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
              message.success(`删除成功`);
            }}
          >
            <a onClick={(e) => e.stopPropagation()}>删除</a>
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
      if (col.key === "status") {
        return createSwitchStatusColumn<DictItemInfo, string>(
          apiUpdateStatus,
          refetcher,
          "status",
          (col.title as string) || "状态",
          { checked: "N", unChecked: "Y" },
        );
      }

      // 操作列
      if (col.key === "action") {
        return {
          ...createActionColumn([...editItems], [...deleteItems]),
          ...col, // 合并原始配置中的 width, fixed 等
        };
      }

      // 其他列：保持原样
      return col;
    });
  }, [baseColumns, apiUpdateStatus, refetcher]);

  return {
    finalAllColumns,
    fetchList,
    handleSetRefetch,
  };
};
