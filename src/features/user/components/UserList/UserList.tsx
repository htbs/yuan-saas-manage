import {
  SysUserDataList,
  SysUserFilterListParams,
  useSysUserTable,
  userSearchFields,
  baseColumns,
  useUserStore,
} from "@/src/features/user";
import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";

export function UserList() {
  const { finalUserColumns, fetchUserList, handleSetRefetch } =
    useSysUserTable(baseColumns);
  const { pagination, setPagination, setQueryParams, resetAll, setView } =
    useUserStore();
  const renderSearchActions = () => {
    return (
      <Space>
        <Button icon={<PlusOutlined />} onClick={() => setView("add")}>
          新增用户
        </Button>
      </Space>
    );
  };
  return (
    <div>
      <GenericFilterableList<SysUserDataList, SysUserFilterListParams>
        columns={finalUserColumns}
        searchFields={userSearchFields}
        fetcher={fetchUserList}
        showIndexColumn={true}
        onRefetch={handleSetRefetch}
        renderSearchActions={renderSearchActions}
        controlledPagination={pagination} // 分页同步
        onPaginationChange={setPagination} // 分页操作回调
        onSearchUpdate={setQueryParams} // 搜索操作回调
        onReset={resetAll} // 重置操作回调
      />
    </div>
  );
}
