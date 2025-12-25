"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, Tree, Button, Space, message, Spin, Divider } from "antd";
import {
  SaveOutlined,
  ReloadOutlined,
  CheckSquareOutlined,
  BorderOutlined,
} from "@ant-design/icons";
import type { TreeDataNode, TreeProps } from "antd";
import { useRoleStore } from "@/src/features/role";
import {
  getAuthMenuByUserIdApi,
  getAuthMenuByRoleIdApi,
} from "@/src/services/menu.service";
import { RoleAuthMenuParams } from "@/src/features/role/types";
import { roleAuthMenuApi } from "@/src/services/role.service";
import { readLocalUserInfo } from "@/src/lib/utils/authUtil";
import { MenuInfo } from "@src/features/menu/types";

const RoleAuth: React.FC = () => {
  const setView = useRoleStore((state) => state.setView);
  const roleId = useRoleStore((state) => state.editId);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // 数据状态
  const [menuTree, setMenuTree] = useState<TreeDataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<React.Key[]>([]);

  // 用于全选逻辑：获取所有节点的 Key
  const allNodeKeys = useMemo(() => {
    const keys: React.Key[] = [];
    const traverse = (data: TreeDataNode[]) => {
      data.forEach((node) => {
        keys.push(node.key);
        if (node.children) traverse(node.children);
      });
    };
    traverse(menuTree);
    return keys;
  }, [menuTree]);

  // 1. 初始化加载
  useEffect(() => {
    loadData();
  }, []);

  /** 把 MenuInfo 树转成 AntD Tree 需要的 TreeDataNode */
  const convertTree = (
    list: MenuInfo[],
    roleIdSet: Set<string>
  ): { tree: TreeDataNode[]; checked: string[] } => {
    const checked: string[] = [];

    const loop = (nodes: MenuInfo[]): TreeDataNode[] =>
      nodes.map((n) => {
        const node: TreeDataNode = {
          key: n.id, // AntD Tree 用 key
          title: n.name,
          icon: n.icon ? <i className={n.icon} /> : null,
          children: n.children?.length ? loop(n.children) : undefined,
        };
        // 只有用户菜单里存在的项才参与勾选
        if (roleIdSet.has(n.id)) checked.push(n.id);
        return node;
      });

    const tree = loop(list);
    return { tree, checked };
  };

  // 查询当前用户可访问的菜单与当前选择角色的菜单进行合并设置是否已选，最终以当前用户的为主
  const loadData = async () => {
    setLoading(true);
    try {
      const user = readLocalUserInfo();
      if (!user) return message.error("未获取到用户,请重新登录后重试。");

      if (!roleId) return message.error("请选择要授权的角色");

      // 并行获取当前登录人的菜单和当前选择角色的菜单
      const [userAuthMenuTree, roleAuthMenuTree] = await Promise.all([
        getAuthMenuByUserIdApi(user.id),
        getAuthMenuByRoleIdApi(roleId),
      ]);

      // 角色菜单 id 集合（用于快速比对）
      const roleIdSet = new Set(roleAuthMenuTree.map((m) => m.id));

      // 以用户菜单为基准，生成 Tree + 默认勾选
      const { tree, checked } = convertTree(userAuthMenuTree, roleIdSet);
      //设置所有菜单
      setMenuTree(tree);
      // 设置已选择项
      setCheckedKeys(checked);
    } catch (e) {
      message.error("加载菜单树失败");
    } finally {
      setLoading(false);
    }
  };

  // 2. 勾选逻辑
  const onCheck: TreeProps["onCheck"] = (checked, info) => {
    if (Array.isArray(checked)) {
      setCheckedKeys(checked);
    } else {
      setCheckedKeys(checked.checked);
      setHalfCheckedKeys(info.halfCheckedKeys || []);
    }
  };

  // 3. 全选 / 全不选
  const handleSelectAll = () => setCheckedKeys(allNodeKeys);
  const handleClearAll = () => {
    setCheckedKeys([]);
    setHalfCheckedKeys([]);
  };

  // 4. 保存提交
  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // 合并全选和半选，确保后端能拿到完整的树路径
      const finalKeys = Array.from(
        new Set([...checkedKeys, ...halfCheckedKeys])
      ).map(String);
      if (!roleId) return message.error("请选择要授权角色");
      const params: RoleAuthMenuParams = {
        roleId,
        menuIds: finalKeys,
      };
      await roleAuthMenuApi(params);
      console.log("提交的权限数据:", finalKeys);
      // await api.saveRolePermissions(roleId, finalKeys);
      message.success("角色权限配置已保存");
    } catch (e) {
      message.error("保存失败");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      <Card
        title={
          <span className="text-lg font-bold">角色权限设置 - 超级管理员</span>
        }
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadData}>
              刷新
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saveLoading}
              onClick={handleSave}
            >
              保存更改
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => setView("list")}
            >
              取消
            </Button>
          </Space>
        }
      >
        {/* 操作工具栏 */}
        <div className="flex justify-between items-center mb-4 p-3">
          <Space split={<Divider type="vertical" />}>
            <span className="text-gray-600">快速操作：</span>
            <Button
              type="link"
              icon={<CheckSquareOutlined />}
              onClick={handleSelectAll}
              className="p-0"
            >
              全选所有菜单
            </Button>
            <Button
              type="link"
              danger
              icon={<BorderOutlined />}
              onClick={handleClearAll}
              className="p-0"
            >
              取消所有勾选
            </Button>
            <div className="text-sm text-gray-500">
              已选择{" "}
              <span className="text-blue-600 font-bold">
                {checkedKeys.length}
              </span>{" "}
              个权限节点
            </div>
          </Space>
        </div>

        <Divider />

        {/* 树形内容区 */}
        <Spin spinning={loading}>
          <div className="max-w-4xl mx-auto py-4">
            <Tree
              checkable
              defaultExpandAll
              checkedKeys={checkedKeys}
              onCheck={onCheck}
              treeData={menuTree}
              className="text-base"
              // 关键：为了让全选/取消全选立即响应，设置 checkStrictly 为 false (默认)
              checkStrictly={false}
            />
          </div>
        </Spin>
      </Card>
    </div>
  );
};

export default RoleAuth;
