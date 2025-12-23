import { Dropdown, Space, Avatar, MenuProps, Modal } from "antd";
import {
  LogoutOutlined,
  LockOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { UserActionsProps } from "./UserActions.type";
import useUserActions from "./useUserActions";
import { ResetPasswordModal } from "../RestPassword/RestPasswordModal";
import { useUserStore } from "../../stores/useUserStore";
import { UserDetail } from "../UserDetail/UserDetail";

export default function UserDropdown(userActionsProps: UserActionsProps) {
  const { activeModal, colseModal, openModal, logout } = useUserActions();
  const { userName, userAvatar } = userActionsProps;
  const setView = useUserStore((state) => state.setView);
  const handleClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "logout":
        logout();
        break;
      case "editUserProfile":
        // 跳转到修改用户信息页面
        openModal("editUserProfile");
        break;
      case "updatePassword":
        // 打开修改密码弹窗
        openModal("updatePassword");
        break;
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "editUserProfile",
      icon: <FormOutlined />,
      label: "个人信息",
    },
    {
      key: "updatePassword",
      icon: <LockOutlined />,
      label: "修改密码",
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
    <>
      <Dropdown
        menu={{ items, onClick: handleClick }}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
        trigger={["hover"]}
      >
        <div
          style={{
            cursor: "pointer",
            display: "inline-block",
            padding: "0 8px",
          }}
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
      <ResetPasswordModal
        open={activeModal === "updatePassword"}
        onCancel={colseModal}
      />
      {/* 这个暂时先放着 不确定如何实现 */}
      {/* <Modal
        title="编辑个人信息"
        open={activeModal === "editUserProfile"}
        // onCancel={onCancel}
        // onOk={() => form.submit()}
        // confirmLoading={loading}
        destroyOnHidden={true}
        closable={false}
      >
        <UserDetail id="261925757322924032" />
      </Modal> */}
    </>
  );
}
