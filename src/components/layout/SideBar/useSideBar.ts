import {useState} from "react";
import {useRouter} from "next/navigation";
import type {MenuProps} from "antd";
import {RoutesEnum} from "@src/components/layout/SideBar/type";


export function useSideBar(){
    /*-- 设置默认选中 --*/
    const [currentMenu, setCurrentMenu] = useState('home');

    /*-- 点击菜单跳转 --*/
    const router = useRouter();
    const handleSideBar: MenuProps['onClick'] = (e) => {
        router.push(RoutesEnum[e.key as keyof typeof RoutesEnum])
        setCurrentMenu(e.key)
    };

    /*-- 关闭和展开侧边栏 --*/
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return {
        currentMenu, handleSideBar,
        collapsed, toggleCollapsed,
    }
}