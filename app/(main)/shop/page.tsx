"use client";

import { useShopStore, ShopList, ShopInfo } from "@/src/features/shop";
import { message } from "antd";
import { useEffect } from "react";

export default function Shop() {
  const view = useShopStore((state) => state.view);
  const id = useShopStore((state) => state.editId);
  const resetAll = useShopStore((state) => state.resetAll);
  useEffect(() => {
    return () => {
      resetAll();
    };
  }, [resetAll]);

  const renderContent = () => {
    switch (view) {
      case "add":
        return <ShopList />;
      // case "edit":
      //   if (!id) {
      //     message.error("请选择要编辑的用户");
      //   } else {
      //     return <RoleDetail id={id} />;
      //   }
      // case "detail":
      //   if (!id) {
      //     message.error("请选择要查看的用户");
      //   } else {
      //     return <RoleDetail id={id} />;
      //   }
      // case "auth":
      //   if (!id) {
      //     message.error("请选择要授权的角色");
      //   } else {
      //     return <RoleAuth />;
      //   }
      default:
        return <ShopList />;
    }
  };

  return <div className="w-full!">{renderContent()}</div>;
}
