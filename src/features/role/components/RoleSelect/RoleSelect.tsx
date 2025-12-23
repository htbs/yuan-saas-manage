// 角色下拉框

import React from "react";
import { Select, Tag, Space, Typography } from "antd";
import type { SelectProps } from "antd";
import { useRoles } from "./useRolesSelect";

const { Text } = Typography;

interface RoleSelectProps extends Omit<SelectProps, "options" | "loading"> {
  scope?: "platform" | "merchant";
}

const RoleSelect: React.FC<RoleSelectProps> = ({ scope, ...restProps }) => {
  const { roles, loading } = useRoles(scope);

  // 格式化为 Antd Select 需要的 options 格式
  const options = roles.map((role) => ({
    label: role.name,
    value: role.id,
    // roleCode: role.roleCode,
    // level: role.level,
  }));

  return (
    <Select
      {...restProps}
      loading={loading}
      placeholder={restProps.placeholder || "请选择角色"}
      showSearch
      optionFilterProp="label"
      allowClear
      options={options}
      // 这里预留。可以自定义设置样式
      //   optionRender={(option) => (
      //     <Space className="w-full justify-between">
      //       <div className="flex flex-col">
      //         <Text>{option.label}</Text>
      //         <Text type="secondary" className="text-xs">
      //           代码: {option.data.roleCode}
      //         </Text>
      //       </div>
      //       {option.data.level === 1 && <Tag color="gold">高级</Tag>}
      //     </Space>
      //   )}
    />
  );
};

export default RoleSelect;
