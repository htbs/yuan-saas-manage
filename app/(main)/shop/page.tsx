"use client";

import { useShopStore, ShopList, ShopDetail } from "@/src/features/shop";
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

  // 定义一个组件映射
  const contentView = {
    add: <ShopDetail />,
    detail: id ? <ShopDetail id={id} /> : null,
    edit: id ? <ShopDetail id={id} /> : null,
    auth: id ? <ShopDetail id={id} /> : null,
  };
  // 渲染内容
  const renderContent = () => {
    const content = contentView[view as keyof typeof contentView];
    // 如果有对印的组件就返回组件
    if (content) return content;
    // 没有要的组件就给用户提示
    if (['detail", "auth'].includes(view)) {
      message.error("请选择要操作的项");
    }
    // 默认返回列表
    return <ShopList />;
  };
  return <div>{renderContent()}</div>;
}
