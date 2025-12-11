"use client";
import React from "react";
import { type MenuItemType } from "@src/components/layout/SideBar/type";
import { Menu } from "antd";
import type { MenuProps } from "antd";
// import { createStyles } from "antd-style";
import {
  AppstoreOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useSideBar } from "@src/components/layout/SideBar/useSideBar";

const menuList: MenuItemType[] = [
  {
    key: "home",
    label: "数据看板",
    icon: <MailOutlined />,
  },
  {
    key: "decorate",
    label: "店铺装修",
    icon: <AppstoreOutlined />,
  },
  {
    key: "reserve",
    label: "预约管理",
    icon: <SettingOutlined />,
    children: [
      {
        key: "board",
        label: "预约看板",
      },
      {
        key: "detail",
        label: "预约明细",
      },
    ],
  },
  {
    key: "worksManagement",
    label: "作品管理",
    icon: <SettingOutlined />,
    children: [
      {
        key: "category",
        label: "作品分类",
      },
      {
        key: "management",
        label: "作品管理",
      },
    ],
  },
];

const styles: MenuProps["styles"] = {
  root: { padding: "0px 8px", height: "calc(100vh - var(--sidebar-logo-h))" },
  // item 样式不完全生效 不知道为什么
  //   item: { marginTop: "10px", backgroundColor: "red" },
  //   subMenu: { list: { marginTop: "100px", backgroundColor: "red" } },
};

const SideBar: React.FC = () => {
  //侧边栏的hook
  const { currentMenu, handleSideBar, collapsed, toggleCollapsed } =
    useSideBar();

  return (
    <>
      <div>
        <div
          // h-(--sidebar-logo-h)
          className={`flex items-center h-20! ${
            collapsed ? "justify-center" : "justify-around"
          }`}
        >
          {collapsed ? (
            <MenuUnfoldOutlined onClick={toggleCollapsed} />
          ) : (
            <>
              <span className="text-red-800 text-xl!">元识科技</span>
              <MenuFoldOutlined onClick={toggleCollapsed} />
            </>
          )}
        </div>
        <Menu
          //   className="h-[calc(100vh-var(--sidebar-logo-h))]"
          className={`h-[calc(100vh-var(--sidebar-logo-h)) mt-4! ${
            collapsed ? "w-20!" : "w-60!"
          }`}
          styles={styles}
          onClick={handleSideBar}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={menuList}
          inlineCollapsed={collapsed}
          selectedKeys={[currentMenu]}
        />
      </div>
    </>
  );
};

export default SideBar;
