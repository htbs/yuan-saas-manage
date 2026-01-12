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
  createSwitchStatusColumn,
  createActionColumn,
  FixedActionItem,
  createLinkColumn,
} from "@/src/lib/utils/tableColumns";
import { ActionItem } from "@/src/components/ui/dropdown/MoreActionsDropdown";
import { useDictStore } from "../../../stores/useDictStore";
import { message, Popconfirm } from "antd";

export const useDictList = (baseColumns: ColumnType<DictInfo>[]) => {
  const fetchList = useCallback(async (params: DictFilterListParams) => {
    // 实际调用您封装的 request 模块
    const result = await findDictPageApi(params);
    return { list: result.content, total: result.totalElements };
  }, []);

  const setView = useDictStore((state) => state.setView);

  // 使用 useRef 存储 refetch 函数
  const [refetcher, setRefetcher] = useState<() => void>(() => () => {});
  // 设置回调函数，将 refetch 存入 ref
  const handleSetRefetch = useCallback((fn: () => void) => {
    setRefetcher(() => fn); // 注意：设置函数需要用函数式更新
  }, []);

  // 处理状态的启用禁用
  const apiUpdateStatus = useCallback(async (record: DictInfo) => {
    const newStatus = record.status === "N" ? "Y" : "N";
    try {
      // 启用 / 禁用
      if (newStatus === "Y") {
        await unLockDictApi(record.id);
      } else {
        await lockDictApi(record.id);
      }
    } catch {}
  }, []);

  const finalAllColumns = useMemo(() => {
    // 创建操作列
    const editItems: FixedActionItem<DictInfo>[] = [
      {
        label: "编辑",
        onClick: (record) => {
          setView("edit", record.id);
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
      if (col.key === "dictName") {
        return createLinkColumn<DictInfo>(
          "dictName",
          (col.title as string) || "字典名称",
          (record) => setView("item_list", record.id),
          { ...col } // 继承原有的 width, fixed 等配置
        );
      }

      // 状态列 (Switch)
      if (col.key === "status") {
        return createSwitchStatusColumn<DictInfo, string>(
          apiUpdateStatus,
          refetcher,
          "status",
          (col.title as string) || "锁定状态",
          { checked: "N", unChecked: "Y" }
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
  }, [baseColumns, apiUpdateStatus, refetcher, setView]);

  return {
    finalAllColumns,
    fetchList,
    handleSetRefetch,
  };
};
