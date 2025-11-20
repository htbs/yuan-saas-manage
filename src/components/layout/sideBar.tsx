"use client";
import React, {useState} from "react";
import {
    AppstoreOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import type {MenuProps} from "antd";
import {Menu} from "antd";
import {useRouter} from "next/navigation";

// import s from "@/styles/main/index.module.css";

interface CustomMenuItem {
    key: string;
    label: React.ReactNode;
    path?: string;
    icon?: React.ReactNode;
    children?: CustomMenuItem[];
}

const items: CustomMenuItem[] = [
    {
        key: "home",
        path: "/",
        label: "数据看板",
        icon: <MailOutlined/>,
    },
    {
        key: "decorate",
        path: "/decorate",
        label: "店铺装修",
        icon: <AppstoreOutlined/>,
    },
    {
        key: "reserve",
        label: "预约管理",
        path: "/reserve",
        icon: <SettingOutlined/>,
        children: [
            {
                key: "board",
                path: "/board",
                label: "预约看板",
            },
            {
                key: "detail",
                path: "/detail",
                label: "预约明细",
            },
        ],
    },
    {
        key: "worksManagement",
        label: "作品管理",
        path: "/worksManagement",
        icon: <SettingOutlined/>,
        children: [
            {
                key: "category",
                path: "/category",
                label: "作品分类",
            },
            {
                key: "management",
                path: "/management",
                label: "作品管理",
            },
        ],
    },
];

const SideBar: React.FC = () => {
    const router = useRouter();
    const onClick: MenuProps["onClick"] = (e) => {
        const clickedItem = items.find((item) => item.key === e.key);
        if (clickedItem?.path) {
            router.push(clickedItem.path);
        }
    };

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    return (
        <>
            <div>
                <div
                    className={`h-(--sidebar-logo-h) flex items-center ${collapsed ? 'justify-center' : 'justify-around'}`}>
                    {collapsed ? (
                        <MenuUnfoldOutlined onClick={toggleCollapsed}/>
                    ) : (
                        <>
                            <span className='text-red-800'>logo</span>
                            <MenuFoldOutlined onClick={toggleCollapsed}/>
                        </>
                    )}
                </div>
                <Menu
                    className="h-[calc(100vh-var(--sidebar-logo-h))]"
                    onClick={onClick}
                    defaultSelectedKeys={["1"]}
                    defaultOpenKeys={["sub1"]}
                    mode="inline"
                    items={items}
                    inlineCollapsed={collapsed}
                />
            </div>
        </>
    );
};

export default SideBar;
