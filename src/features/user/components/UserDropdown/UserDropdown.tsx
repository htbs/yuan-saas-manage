import { Dropdown, Space, Avatar, MenuProps } from "antd";
import { LogoutOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { UserDropdownProps } from "../..";

export default function UserDropdown(userDropdownProps: UserDropdownProps) {
  const { userName, userAvatar } = userDropdownProps;
  const handleClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "logout":
        userDropdownProps.onLogout();
        break;
      case "resetPassword":
        userDropdownProps.onRestPassword();
        break;
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "resetPassword",
      icon: <LockOutlined />,
      label: "重置密码",
    },
    {
      type: "divider", // 分割线
    },
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Dropdown
      menu={{ items, onClick: handleClick }}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
      trigger={["hover"]}
    >
      <div
        style={{ cursor: "pointer", display: "inline-block", padding: "0 8px" }}
      >
        <Space size={8}>
          <Avatar
            size="small"
            src={userAvatar}
            icon={!userAvatar && <UserOutlined />}
          />
          <span style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.88)" }}>
            {userName}
          </span>
        </Space>
      </div>
    </Dropdown>
  );
}
