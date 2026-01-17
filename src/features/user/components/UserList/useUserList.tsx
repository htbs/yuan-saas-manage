import { ColumnType } from "antd/es/table";
import { useState, useCallback, useMemo, useRef } from "react";
import { SysUserFilterListParams, SysUserDataList } from "./UserList.types";
import {
  findPageListApi,
  lockUserApi,
  unLockUserApi,
  resetPasswordApi,
} from "@/src/services";
import {
  createActionColumn,
  FixedActionItem,
  createLinkColumn,
} from "@/src/lib/utils/tableColumns";
import { ActionItem } from "@/src/components/ui/dropdown/MoreActionsDropdown";
import { message, Popconfirm, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CurdActionEnum } from "@/src/types";
export const useSysUserTable = (baseColumns: ColumnType<SysUserDataList>[]) => {
  /**
   * 存储刷新数据的回调函数
   */
  const refetchRef = useRef<() => void>(() => () => {});
  /**
   * 注册列表刷新函数
   */
  const registerRefetch = useCallback((fn: () => void) => {
    refetchRef.current = fn;
  }, []);

  /** 触发列表刷新 */
  const triggerRefetch = useCallback(() => {
    refetchRef.current?.();
  }, []);

  /**
   * 设置编辑、详情、新增 Dialog 逻辑
   */
  const [baseDialogState, setBaseDialogState] = useState<{
    isOpen: boolean;
    mode: CurdActionEnum;
    userId?: string; // 数据ID
  }>({ isOpen: false, mode: CurdActionEnum.add, userId: "" });

  /**
   * 打开编辑、详情、新增 Dialog
   */
  const openBaseDialog = useCallback(
    (mode: CurdActionEnum, userId?: string) => {
      setBaseDialogState({ isOpen: true, mode, userId });
    },
    [],
  );

  /**
   * 关闭 编辑、详情、新增 Dialog
   */
  const closeBaseDialog = useCallback(() => {
    setBaseDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * 启用 / 禁用 API
   */
  const apiUpdateStatus = useCallback(async (record: SysUserDataList) => {
    const newStatus = record.status === "active" ? "suspended" : "active";
    await (newStatus === "active"
      ? unLockUserApi(record.id)
      : lockUserApi(record.id));
  }, []);

  /**
   * 操作列：新增按钮
   */
  const addAction = useCallback(() => {
    return (
      <Space>
        <Button
          icon={<PlusOutlined />}
          onClick={() => openBaseDialog(CurdActionEnum.add)}
        >
          新增
        </Button>
      </Space>
    );
  }, [openBaseDialog]);

  /**
   * 分页查询用户列表
   */
  const fetchUserList = useCallback(async (params: SysUserFilterListParams) => {
    const result = await findPageListApi(params);
    return { list: result.content, total: result.totalElements };
  }, []);

  const finalUserColumns = useMemo(() => {
    // 固定操作： 编辑
    const fixedActionEdit: FixedActionItem<SysUserDataList>[] = [
      {
        label: "编辑",
        type: "primary",
        onClick: (record) => {
          openBaseDialog(CurdActionEnum.edit, record.id);
        },
      },
    ];

    // 更多操作： 重置密码
    const actionItems: ActionItem<SysUserDataList>[] = [
      {
        key: "resetPassword",
        label: (record) => (
          <Popconfirm
            title="确定重置密码吗？"
            onConfirm={async () => {
              await resetPasswordApi(record.id);
              message.success("重置密码成功");
            }}
          >
            {/* 阻止事件冒泡 */}
            <a onClick={(e) => e.stopPropagation()}>重置密码</a>
          </Popconfirm>
        ),
        onClick: () => {},
      },
    ];
    /**
     * 最终列定义 原位增强
     */
    return baseColumns.map((col) => {
      /**
       * 用户账号列 (跳转详情页)
       */
      if (col.key === "userName") {
        return createLinkColumn<SysUserDataList>(
          "userName",
          (col.title as string) || "用户账号",
          (record) => openBaseDialog(CurdActionEnum.view, record.id),
          { ...col }, // 继承原有的 width, fixed 等配置
        );
      }

      /**
       * 状态列
       */
      // if (col.key === "status") {
      //   return createSwitchStatusColumn<SysUserDataList, string>(
      //     apiUpdateStatus,
      //     onStatusChangeFinished,
      //     "status",
      //     (col.title as string) || "状态",
      //     { checked: "active", unChecked: "suspended" }
      //   );
      // }

      /**
       * 操作列
       */
      if (col.key === "action") {
        return {
          ...createActionColumn(fixedActionEdit, actionItems),
          ...col, // 合并原始配置中的 width, fixed 等
        };
      }

      // 其他列：保持原样
      return col;
    });
  }, [baseColumns, openBaseDialog]);

  return {
    /**
     * 最终列定义
     */
    finalUserColumns,
    /**
     * 列表数据查询
     */
    fetchUserList,
    /**
     * 列表刷新注册
     */
    registerRefetch,

    /**
     * 新增按钮
     */
    addAction,
    /**
     * 角色编辑、详情、新增 Dialog
     */
    dialogProps: {
      ...baseDialogState,
      onClose: closeBaseDialog,
      onSuccess: triggerRefetch, // 刷新列表方法
    },
  };
};
