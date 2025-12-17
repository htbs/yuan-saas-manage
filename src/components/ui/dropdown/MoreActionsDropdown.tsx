import React from "react";
import { Dropdown, Button, Menu, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";

// 定义单个操作项的类型
export interface ActionItem<T> {
  key: string;
  label: string;
  /** 点击时的回调函数，接收当前行数据 */
  onClick: (record: T) => void;
  /** 是否禁用该操作项 */
  disabled?: (record: T) => boolean;
}

interface MoreActionsDropdownProps<T> {
  /** 当前行数据 */
  record: T;
  /** 操作列表 */
  actions: ActionItem<T>[];
}

const MoreActionsDropdown = <T extends object>({
  record,
  actions,
}: MoreActionsDropdownProps<T>) => {
  // 构造 MenuProps 对象
  const menuProps: MenuProps = {
    // 1. 定义点击事件处理器
    onClick: ({ key }) => {
      // 找到对应的 ActionItem 并执行其 onClick
      const action = actions.find((a) => a.key === key);
      if (action) {
        action.onClick(record);
      }
    },
    // 构造 items 数组
    items: actions.map((action) => ({
      key: action.key,
      label: action.label,
      //  将禁用逻辑放入配置对象中
      disabled: action.disabled ? action.disabled(record) : false,
    })),
  };

  return (
    <Dropdown
      menu={menuProps}
      trigger={["hover"]} // 鼠标悬浮触发
      placement="bottomRight"
    >
      <Button type="link" onClick={(e) => e.preventDefault()}>
        更多 <DownOutlined style={{ fontSize: "10px" }} />
      </Button>
    </Dropdown>
  );
};

export default MoreActionsDropdown;
