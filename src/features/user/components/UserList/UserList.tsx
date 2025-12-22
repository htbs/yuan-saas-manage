import {
  SysUserDataList,
  SysUserFilterListParams,
  useSysUserTable,
  userSearchFields,
  baseColumns,
  useUserStore,
} from "@/src/features/user";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";

export function UserList() {
  const { finalUserColumns, fetchUserList, handleSetRefetch } =
    useSysUserTable(baseColumns);
  const { queryParams, pagination, setPagination, setQueryParams, resetAll } =
    useUserStore();
  return (
    <div>
      <GenericFilterableList<SysUserDataList, SysUserFilterListParams>
        columns={finalUserColumns}
        searchFields={userSearchFields}
        fetcher={fetchUserList}
        showIndexColumn={true}
        onRefetch={handleSetRefetch}
        initialValues={queryParams} // 搜索条件回显
        controlledPagination={pagination} // 分页同步
        onPaginationChange={setPagination} // 分页操作回调
        onSearchUpdate={setQueryParams} // 搜索操作回调
        onReset={resetAll} // 重置操作回调
      />
    </div>
  );
}
