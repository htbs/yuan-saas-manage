import type { MenuProps } from "antd";

//定义一个路由和侧边栏的key对应关系的enum。
export enum RoutesEnum {
  home = "/home", //数据看板
  merchant = "/merchant/list", //商家管理
  reserve = "/reserve", //预约管理
  board = "/board", //预约看板
  detail = "/detail", //预约明细
  worksManagement = "/worksManagement", //作品管理
  category = "/category", //作品分类
  management = "/management", //作品管理
}

//路由的类型
export type MenuItemType = Required<MenuProps>["items"][number];
