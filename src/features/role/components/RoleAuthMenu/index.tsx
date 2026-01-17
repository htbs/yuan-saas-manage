"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Tree, Button, Space, message, Spin } from "antd";
import type { TreeDataNode, TreeProps } from "antd";
import {
  getAuthMenuByUserIdApi,
  getAuthMenuByRoleIdApi,
} from "@/src/services/menu.service";
import { RoleAuthMenuParams } from "@/src/features/role/types";
import { roleAuthMenuApi } from "@/src/services/role.service";
import { readLocalUserInfo } from "@/src/lib/utils/authUtil";
import { MenuInfo } from "@src/features/menu/types";
import { YsDraggableDialog } from "@/src/components/YsDraggableDialog/YsDraggableDialog";

export const RoleAuthMenu = (props: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roleId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [menuTree, setMenuTree] = useState<TreeDataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<React.Key[]>([]);
  const [isCheckAll, setIsCheckAll] = useState(false); // 是否全选

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
  /** 把 MenuInfo 树转成 AntD Tree 需要的 TreeDataNode */
  const convertTree = (
    list: MenuInfo[],
    roleIdSet: Set<string>,
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
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const user = readLocalUserInfo();
      if (!user) return message.error("未获取到用户,请重新登录后重试。");

      if (!props.roleId) return message.error("请选择要授权的角色");

      // 并行获取当前登录人的菜单和当前选择角色的菜单
      const [userAuthMenuTree, roleAuthMenuTree] = await Promise.all([
        getAuthMenuByUserIdApi(user.id),
        getAuthMenuByRoleIdApi(props.roleId),
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
  }, [props.roleId]);

  // 1. 初始化加载
  useEffect(() => {
    if (!props.isOpen) return;
    const id = requestAnimationFrame(loadData);
    return () => cancelAnimationFrame(id); // 清除动画帧
  }, [props.isOpen, loadData]);
  // 2. 勾选逻辑
  const onCheck: TreeProps["onCheck"] = (checked, info) => {
    if (Array.isArray(checked)) {
      setCheckedKeys(checked);
    } else {
      setCheckedKeys(checked.checked);
      setHalfCheckedKeys(info.halfCheckedKeys || []);
    }
  };

  // 处理全选选或全不选
  const handleAllCheckToggle = () => {
    if (isCheckAll) {
      // 取消全选
      setCheckedKeys([]);
      setHalfCheckedKeys([]);
    } else {
      // 全选
      setCheckedKeys(allNodeKeys);
    }
    setIsCheckAll(!isCheckAll);
  };

  // 4. 保存提交
  const handleSave = async () => {
    try {
      // 合并全选和半选，确保后端能拿到完整的树路径
      const finalKeys = Array.from(
        new Set([...checkedKeys, ...halfCheckedKeys]),
      ).map(String);
      const params: RoleAuthMenuParams = {
        roleId: props.roleId,
        menuIds: finalKeys,
      };
      await roleAuthMenuApi(params);
      props.onClose();
    } catch (e) {
      message.error("保存失败");
    }
  };
  return (
    <div>
      <YsDraggableDialog
        title="角色权限配置"
        onClose={props.onClose}
        initialWidth={600}
        initialHeight={400}
        visible={props.isOpen}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Space>
              <Button onClick={handleAllCheckToggle}>全选/全不选</Button>
              <Button type="primary" onClick={handleSave}>
                保存
              </Button>
              <Button onClick={props.onClose}>取消</Button>
            </Space>
          </div>
        }
      >
        <Spin spinning={false}>
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
      </YsDraggableDialog>
    </div>
  );
};

export default RoleAuthMenu;
