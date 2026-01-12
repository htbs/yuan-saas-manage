"use client";

import {
  useDictStore,
  DictDetail,
  DictList,
  DictItemList,
} from "@/src/features/dict";
import { message } from "antd";
import { useEffect } from "react";

export default function Shop() {
  const view = useDictStore((state) => state.view);
  const id = useDictStore((state) => state.editId);
  const resetAll = useDictStore((state) => state.resetAll);
  useEffect(() => {
    return () => {
      resetAll();
    };
  }, [resetAll]);

  // 定义一个组件映射
  const contentView = {
    add: <DictDetail />,
    detail: id ? <DictDetail id={id} /> : null,
    edit: id ? <DictDetail id={id} /> : null,
    auth: id ? <DictDetail id={id} /> : null,
    item_list: <DictItemList />,
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
    return <DictList />;
  };
  return <div>{renderContent()}</div>;
}
