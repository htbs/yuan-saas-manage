import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import type {MenuItemType} from "@src/components/layout/SideBar/type";

export const menuList: MenuItemType[] = [
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