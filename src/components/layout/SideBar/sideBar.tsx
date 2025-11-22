"use client";
import React from "react";
import {type MenuItemType} from "@src/components/layout/SideBar/type"
import {Menu} from "antd";
import {
    AppstoreOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import {useSideBar} from "@src/components/layout/SideBar/useSideBar";

const menuList: MenuItemType[] = [
    {
        key: "home",
        label: "数据看板",
        icon: <MailOutlined/>,
    },
    {
        key: "decorate",
        label: "店铺装修",
        icon: <AppstoreOutlined/>,
    },
    {
        key: "reserve",
        label: "预约管理",
        icon: <SettingOutlined/>,
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
        icon: <SettingOutlined/>,
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
const SideBar: React.FC = () => {
    //侧边栏的hook
   const {
       currentMenu, handleSideBar,
       collapsed, toggleCollapsed,
   } = useSideBar()

    return (
        <>
            <div>
                <div
                    className={`h-(--sidebar-logo-h) flex items-center ${
                        collapsed ? "justify-center" : "justify-around"
                    }`}
                >
                    {collapsed
                        ? <MenuUnfoldOutlined onClick={toggleCollapsed}/>
                        : <>
                            <span className="text-red-800">logo</span>
                            <MenuFoldOutlined onClick={toggleCollapsed}/>
                        </>
                    }
                </div>
                <Menu
                    className="h-[calc(100vh-var(--sidebar-logo-h))]"
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
