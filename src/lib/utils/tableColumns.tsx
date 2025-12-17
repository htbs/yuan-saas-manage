import React, { useState } from "react";
import { ColumnType } from "antd/es/table";
import MoreActionsDropdown, {
  ActionItem,
} from "@/src/components/ui/dropdown/MoreActionsDropdown";
import { Button, Switch, Typography } from "antd";

// --------------- 这里是操作列-------------

// 定义固定操作的类型
export interface FixedActionItem<T> {
  label: string;
  onClick: (record: T) => void;
  // 允许传入 Antd Button 的 type 等其他属性
  type?: "link" | "primary" | "default";
}

/**
 * 封装生成标准“操作”列的逻辑
 * @param fixedActions 固定的、直接显示的按钮操作数组 (如：编辑)
 * @param moreActions "更多"下拉菜单中的操作数组
 * @returns 完整的 Antd ColumnType 配置对象
 */
export const createActionColumn = <T extends object>(
  fixedActions: FixedActionItem<T>[],
  moreActions: ActionItem<T>[]
): ColumnType<T> => {
  // 确保 key 始终是 'action'
  const column: ColumnType<T> = {
    title: "操作",
    key: "action",
    width: 160, // 设定一个合理宽度防止溢出
    render: (text, record: T) => {
      return (
        <>
          {/* 1. 渲染固定操作按钮 */}
          {fixedActions.map((action, index) => (
            <Button
              key={index}
              type={action.type || "link"}
              onClick={() => action.onClick(record)}
            >
              {action.label}
            </Button>
          ))}

          {/* 2. 渲染“更多”下拉菜单，仅在 moreActions 不为空时显示 */}
          {moreActions && moreActions.length > 0 && (
            <MoreActionsDropdown record={record} actions={moreActions} />
          )}
        </>
      );
    },
  };

  return column;
};

// ----------- 这里是开关列-------------
// 内部操作组件：解决 Hook 调用报错
const StatusSwitch = <T extends object>({
  record,
  statusValue,
  updateStatusApi,
  refetch,
}: {
  record: T;
  statusValue: string;
  updateStatusApi: (record: T, newStatus: string) => Promise<unknown>;
  refetch: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const checked = statusValue === "Y";

  const handleToggle = async (newChecked: boolean) => {
    const newStatus = newChecked ? "Y" : "N";
    // const key = `status_toggle`; // 实际应用中可加入 record.id

    setLoading(true);
    // message.loading({ content: "更新中...", key });

    try {
      await updateStatusApi(record, newStatus);
      refetch();
      // message.success({ content: "操作成功", key });
    } catch (error) {
      // message.error({ content: "操作失败", key });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={checked}
      loading={loading}
      checkedChildren="启用"
      unCheckedChildren="禁用"
      onChange={handleToggle}
    />
  );
};

/**
 * 封装生成带 Switch 控件的状态操作列
 */
export const createSwitchStatusColumn = <
  T extends object,
  V = string | number | boolean
>(
  updateStatusApi: (record: T, newStatus: V) => Promise<unknown>,
  refetch: () => void,
  dataIndex: keyof T & (string | number), // 限制类型为 string | number
  title: string = "状态",
  options: { checked: V; unChecked: V } = {
    checked: "Y" as unknown as V,
    unChecked: "N" as unknown as V,
  }
): ColumnType<T> => {
  return {
    title,
    dataIndex: dataIndex as ColumnType<T>["dataIndex"], // 强制断言以匹配 Antd 复杂的 DataIndex 类型
    key: String(dataIndex),
    width: 100,
    align: "center",
    render: (value: T[keyof T], record: T) => (
      <StatusSwitch
        record={record}
        statusValue={String(value) === options.checked ? "Y" : "N"}
        updateStatusApi={async (rec, newStrStatus) => {
          const originalValue: V =
            newStrStatus === "Y" ? options.checked : options.unChecked;
          return updateStatusApi(rec, originalValue);
        }}
        refetch={refetch}
      />
    ),
  };
};

// -----------------Link列-------------
/**
 * 封装生成带链接的文字列 (常用于用户名、单号点击进入详情)
 * @template T 行数据类型
 * @param dataIndex 字段名
 * @param title 列标题
 * @param onClick 点击回调 (record) => void
 * @param options 扩展配置 (如 width, ellipsis 等)
 */
export const createLinkColumn = <T extends object>(
  dataIndex: keyof T & (string | number),
  title: string,
  onClick: (record: T) => void,
  options: Partial<ColumnType<T>> = {}
): ColumnType<T> => {
  return {
    title,
    dataIndex: dataIndex as ColumnType<T>["dataIndex"],
    key: String(dataIndex),
    ellipsis: true, // 默认开启省略号，防止长文本撑开表格
    ...options, // 允许外部覆盖默认配置
    render: (value: string, record: T) => {
      // 如果值为空，显示占位符
      if (value === null || value === undefined || value === "") return "-";

      return (
        <Typography.Link
          onClick={(e) => {
            e.preventDefault();
            onClick(record);
          }}
        >
          {value}
        </Typography.Link>
      );
    },
  };
};
