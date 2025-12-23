"use client";

import { UserList, UserDetail, useUserStore } from "@/src/features/user";
import { message } from "antd";
import { useEffect } from "react";

export default function UserOptions() {
  const view = useUserStore((state) => state.view);
  const id = useUserStore((state) => state.editId);
  const resetAll = useUserStore((state) => state.resetAll);
  useEffect(() => {
    return () => {
      resetAll();
    };
  }, [resetAll]);

  const renderContent = () => {
    switch (view) {
      case "add":
        return <UserDetail />;
      case "edit":
        if (!id) {
          message.error("请选择要编辑的用户");
        } else {
          return <UserDetail id={id} />;
        }
      case "detail":
        if (!id) {
          message.error("请选择要查看的用户");
        } else {
          return <UserDetail id={id} />;
        }
      default:
        return <UserList />;
    }
  };

  return <div>{renderContent()}</div>;
}
