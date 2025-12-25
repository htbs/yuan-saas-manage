"use client";

import { useRoleStore, RoleList, RoleDetail } from "@/src/features/role";
import RoleAuth from "@/src/features/role/components/RoleAuth/RoleAuth";
import { message } from "antd";
import { useEffect } from "react";

export default function Role() {
  const view = useRoleStore((state) => state.view);
  const id = useRoleStore((state) => state.editId);
  const resetAll = useRoleStore((state) => state.resetAll);
  useEffect(() => {
    return () => {
      resetAll();
    };
  }, [resetAll]);

  const renderContent = () => {
    switch (view) {
      case "add":
        return <RoleDetail />;
      case "edit":
        if (!id) {
          message.error("请选择要编辑的用户");
        } else {
          return <RoleDetail id={id} />;
        }
      case "detail":
        if (!id) {
          message.error("请选择要查看的用户");
        } else {
          return <RoleDetail id={id} />;
        }
      case "auth":
        if (!id) {
          message.error("请选择要授权的角色");
        } else {
          return <RoleAuth />;
        }
      default:
        return <RoleList />;
    }
  };

  return <div className="w-full!">{renderContent()}</div>;
}
